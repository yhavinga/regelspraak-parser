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
}