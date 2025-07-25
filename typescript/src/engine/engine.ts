import { IEngine, ParseResult, RuntimeContext, ExecutionResult } from '../interfaces';
import { Context } from '../runtime/context';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { RuleExecutor } from '../executors/rule-executor';
import { DecisionTableParser } from '../parsers/decision-table-parser';
import { DecisionTableExecutor } from '../executors/decision-table-executor';
import { AntlrParser } from '../parsers/antlr-parser';

/**
 * Main RegelSpraak engine
 */
export class Engine implements IEngine {
  private expressionEvaluator = new ExpressionEvaluator();
  private ruleExecutor = new RuleExecutor();
  private decisionTableExecutor = new DecisionTableExecutor();
  private antlrParser = new AntlrParser();

  parse(source: string): ParseResult {
    const trimmed = source.trim();
    
    try {
      // Check if this is a rule, object type, decision table, or just an expression
      if (trimmed.startsWith('Regel ')) {
        // Use ANTLR parser for rules
        const ast = this.antlrParser.parseRule(trimmed);
        return {
          success: true,
          ast
        };
      } else if (trimmed.startsWith('Objecttype ') || trimmed.startsWith('objecttype ')) {
        // Use ANTLR parser for object types
        const ast = this.antlrParser.parseObjectType(trimmed);
        return {
          success: true,
          ast
        };
      } else if (trimmed.startsWith('Parameter ')) {
        // Use ANTLR parser for parameters
        const ast = this.antlrParser.parseParameter(trimmed);
        return {
          success: true,
          ast
        };
      } else if (trimmed.startsWith('Beslistabel ')) {
        const dtParser = new DecisionTableParser(trimmed);
        const ast = dtParser.parseDecisionTable();
        return {
          success: true,
          ast
        };
      } else {
        // Parse as expression using ANTLR
        const ast = this.antlrParser.parseExpression(trimmed);
        return {
          success: true,
          ast
        };
      }
    } catch (error) {
      return {
        success: false,
        errors: [{
          line: 1,
          column: 1,
          message: error instanceof Error ? error.message : 'Unknown parse error'
        }]
      };
    }
  }

  execute(ast: any, context: RuntimeContext): ExecutionResult {
    try {
      // Handle different AST types
      if (ast.type === 'Rule') {
        const result = this.ruleExecutor.execute(ast, context);
        // Convert RuleExecutionResult to ExecutionResult
        if (result.success) {
          return {
            success: true,
            value: result.value!
          };
        } else {
          return {
            success: false,
            error: result.error
          };
        }
      } else if (ast.type === 'DecisionTable') {
        return this.decisionTableExecutor.execute(ast, context);
      } else if (ast.type === 'ObjectTypeDefinition') {
        // For now, object type definitions don't execute - they just register
        // In a full implementation, this would register the type in the context
        return {
          success: true,
          value: { type: 'string', value: 'Object type registered' }
        };
      } else if (ast.type === 'ParameterDefinition') {
        // For now, parameter definitions don't execute - they just register
        // In a full implementation, this would register the parameter in the context
        return {
          success: true,
          value: { type: 'string', value: 'Parameter registered' }
        };
      } else {
        // It's an expression
        const value = this.expressionEvaluator.evaluate(ast, context);
        return {
          success: true,
          value
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown execution error')
      };
    }
  }

  run(source: string, context?: RuntimeContext): ExecutionResult {
    const ctx = context || new Context();
    
    const parseResult = this.parse(source);
    if (!parseResult.success) {
      return {
        success: false,
        error: new Error(parseResult.errors![0].message)
      };
    }

    return this.execute(parseResult.ast!, ctx);
  }

  evaluate(source: string, data?: Record<string, any>): ExecutionResult {
    const context = new Context();
    
    // Initialize context with provided data
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        context.setVariable(key, value);
      }
    }
    
    return this.run(source, context);
  }
}