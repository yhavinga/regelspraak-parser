import { IEvaluator, Value, RuntimeContext } from '../interfaces';
import { Expression, NumberLiteral } from '../ast/expressions';

/**
 * Evaluator for expression nodes
 */
export class ExpressionEvaluator implements IEvaluator {
  evaluate(expr: Expression, _context: RuntimeContext): Value {
    switch (expr.type) {
      case 'NumberLiteral':
        return this.evaluateNumberLiteral(expr as NumberLiteral);
      default:
        throw new Error(`Unknown expression type: ${expr.type}`);
    }
  }

  private evaluateNumberLiteral(expr: NumberLiteral): Value {
    return {
      type: 'number',
      value: expr.value
    };
  }
}