import { IEngine, ParseResult, RuntimeContext, ExecutionResult } from '../interfaces';
import { Context } from '../runtime/context';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';

/**
 * Main RegelSpraak engine
 */
export class Engine implements IEngine {
  private expressionEvaluator = new ExpressionEvaluator();

  parse(source: string): ParseResult {
    // For now, minimal parsing - just handle number literals
    const trimmed = source.trim();
    
    // Simple number check
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return {
        success: true,
        ast: {
          type: 'NumberLiteral',
          value: parseFloat(trimmed)
        }
      };
    }

    return {
      success: false,
      errors: [{
        line: 1,
        column: 1,
        message: 'Invalid expression'
      }]
    };
  }

  execute(program: any, context?: RuntimeContext): ExecutionResult {
    const ctx = context || new Context();
    
    try {
      const value = this.expressionEvaluator.evaluate(program, ctx);
      return {
        success: true,
        value
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error
      };
    }
  }

  run(source: string, context?: RuntimeContext): ExecutionResult {
    const parseResult = this.parse(source);
    
    if (!parseResult.success) {
      return {
        success: false,
        error: new Error(parseResult.errors![0].message)
      };
    }

    return this.execute(parseResult.ast!, context);
  }
}