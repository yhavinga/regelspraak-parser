import { IEvaluator, Value, RuntimeContext } from '../interfaces';
import { Expression, NumberLiteral, BinaryExpression, VariableReference } from '../ast/expressions';

/**
 * Evaluator for expression nodes
 */
export class ExpressionEvaluator implements IEvaluator {
  evaluate(expr: Expression, context: RuntimeContext): Value {
    switch (expr.type) {
      case 'NumberLiteral':
        return this.evaluateNumberLiteral(expr as NumberLiteral);
      case 'BinaryExpression':
        return this.evaluateBinaryExpression(expr as BinaryExpression, context);
      case 'VariableReference':
        return this.evaluateVariableReference(expr as VariableReference, context);
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

  private evaluateBinaryExpression(expr: BinaryExpression, context: RuntimeContext): Value {
    const left = this.evaluate(expr.left, context);
    const right = this.evaluate(expr.right, context);

    // Type check - both must be numbers for arithmetic
    if (left.type !== 'number' || right.type !== 'number') {
      throw new Error(`Cannot apply ${expr.operator} to ${left.type} and ${right.type}`);
    }

    const leftVal = left.value as number;
    const rightVal = right.value as number;
    let result: number;

    switch (expr.operator) {
      case '+':
        result = leftVal + rightVal;
        break;
      case '-':
        result = leftVal - rightVal;
        break;
      case '*':
        result = leftVal * rightVal;
        break;
      case '/':
        if (rightVal === 0) {
          throw new Error('Division by zero');
        }
        result = leftVal / rightVal;
        break;
      default:
        throw new Error(`Unknown operator: ${expr.operator}`);
    }

    return {
      type: 'number',
      value: result
    };
  }

  private evaluateVariableReference(expr: VariableReference, context: RuntimeContext): Value {
    const value = context.getVariable(expr.variableName);
    if (value === undefined) {
      throw new Error(`Undefined variable: ${expr.variableName}`);
    }
    return value;
  }
}