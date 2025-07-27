import { IEngine, ParseResult, RuntimeContext, ExecutionResult, Value } from '../interfaces';
import { Context } from '../runtime/context';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { RuleExecutor } from '../executors/rule-executor';
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
      // Check if this contains multiple definitions (has newlines and multiple keywords)
      const lines = trimmed.split('\n');
      const definitionKeywords = ['Parameter ', 'Objecttype ', 'Regel ', 'Beslistabel ', 'Consistentieregel ', 'Verdeling '];
      let definitionCount = 0;
      for (const line of lines) {
        const trimmedLine = line.trim();
        if (definitionKeywords.some(kw => trimmedLine.startsWith(kw))) {
          definitionCount++;
          if (definitionCount >= 2) break;
        }
      }
      const hasMultipleDefinitions = definitionCount >= 2;
      
      if (hasMultipleDefinitions) {
        // Parse as a full document
        const definitions = this.antlrParser.parse(trimmed);
        
        // Wrap definitions in a Model object
        const rules = definitions.filter((def: any) => def.type === 'Rule');
        const objectTypes = definitions.filter((def: any) => def.type === 'ObjectTypeDefinition');
        const parameters = definitions.filter((def: any) => def.type === 'ParameterDefinition');
        
        return {
          success: true,
          ast: {
            type: 'Model',
            rules,
            objectTypes,
            parameters
          }
        };
      }
      
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
        // Use ANTLR parser for decision tables
        const ast = this.antlrParser.parseDecisionTable(trimmed);
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
      // Handle array of definitions
      if (Array.isArray(ast)) {
        let lastResult: ExecutionResult = {
          success: true,
          value: { type: 'null', value: null }
        };
        
        for (const definition of ast) {
          const result = this.execute(definition, context);
          if (!result.success) {
            return result; // Return first error
          }
          lastResult = result;
        }
        
        return lastResult;
      }
      
      // Handle different AST types
      if (ast.type === 'Model') {
        // Execute all rules in the model
        let lastResult: ExecutionResult = {
          success: true,
          value: { type: 'string', value: 'Model executed' }
        };
        
        // Execute each rule in sequence
        for (const rule of (ast as any).rules || []) {
          const result = this.ruleExecutor.execute(rule, context);
          if (!result.success) {
            return {
              success: false,
              error: result.error
            };
          }
          // Keep track of the last result
          if (result.value) {
            lastResult = {
              success: true,
              value: result.value
            };
          }
        }
        
        return lastResult;
      } else if (ast.type === 'Rule') {
        const result = this.ruleExecutor.execute(ast, context);
        // Convert RuleExecutionResult to ExecutionResult
        if (result.success) {
          if (result.skipped) {
            // Rule was skipped due to condition
            return {
              success: true,
              value: {
                type: 'string',
                value: `Rule skipped: ${result.reason || 'condition not met'}`
              }
            };
          }
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
        // Convert JavaScript values to Value objects
        const valueObj = this.convertToValue(value);
        context.setVariable(key, valueObj);
      }
    }
    
    return this.run(source, context);
  }
  
  private convertToValue(value: any): Value {
    if (typeof value === 'number') {
      return { type: 'number', value };
    } else if (typeof value === 'string') {
      return { type: 'string', value };
    } else if (typeof value === 'boolean') {
      return { type: 'boolean', value };
    } else if (value instanceof Date) {
      return { type: 'date', value };
    } else if (value === null || value === undefined) {
      return { type: 'null', value: null };
    } else if (Array.isArray(value)) {
      return { type: 'list', value };
    } else {
      return { type: 'object', value };
    }
  }
}