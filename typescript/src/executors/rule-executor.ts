import { IRuleExecutor, RuleExecutionResult, RuntimeContext, Value } from '../interfaces';
import { Rule, Gelijkstelling } from '../ast/rules';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';

/**
 * Executes RegelSpraak rules
 */
export class RuleExecutor implements IRuleExecutor {
  private expressionEvaluator = new ExpressionEvaluator();

  execute(rule: Rule, context: RuntimeContext): RuleExecutionResult {
    try {
      // Check if there's a condition
      if (rule.condition) {
        // Evaluate the condition
        const conditionResult = this.expressionEvaluator.evaluate(rule.condition.expression, context);
        
        // Check if condition is truthy
        if (!this.isTruthy(conditionResult)) {
          // Condition is false, skip rule execution
          return {
            success: true,
            skipped: true,
            reason: 'Condition evaluated to false'
          };
        }
      }
      
      // For now, we only handle Gelijkstelling (assignment)
      if (rule.result.type !== 'Gelijkstelling') {
        throw new Error(`Unsupported result type: ${rule.result.type}`);
      }

      const gelijkstelling = rule.result as Gelijkstelling;
      
      // Evaluate the expression
      const value = this.expressionEvaluator.evaluate(gelijkstelling.expression, context);
      
      // Set the variable in context
      context.setVariable(gelijkstelling.target, value);
      
      return {
        success: true,
        target: gelijkstelling.target,
        value
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error
      };
    }
  }
  
  private isTruthy(value: Value): boolean {
    // Check if a value is considered true in a conditional context
    if (value.type === 'boolean') {
      return value.value === true;
    }
    if (value.type === 'number') {
      return value.value !== 0;
    }
    if (value.type === 'string') {
      return value.value !== '';
    }
    // For other types, consider non-null as truthy
    return value.value != null;
  }
}