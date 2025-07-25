import { IEngine, ParseResult, RuntimeContext, ExecutionResult } from '../interfaces';
import { Context } from '../runtime/context';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { RuleParser } from '../parsers/rule-parser';
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
      // Check if this is a rule, decision table, or just an expression
      if (trimmed.startsWith('Regel ')) {
        const ruleParser = new RuleParser(trimmed);
        const ast = ruleParser.parseRule();
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
        return this.ruleExecutor.execute(ast, context);
      } else if (ast.type === 'DecisionTable') {
        return this.decisionTableExecutor.execute(ast, context);
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