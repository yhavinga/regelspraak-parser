import { IEvaluator, Value, RuntimeContext } from '../interfaces';
import { Expression, NumberLiteral, StringLiteral, BinaryExpression, VariableReference, FunctionCall, AggregationExpression } from '../ast/expressions';
import { AggregationEngine } from './aggregation-engine';

/**
 * Evaluator for expression nodes
 */
export class ExpressionEvaluator implements IEvaluator {
  private builtInFunctions: Record<string, (args: Value[]) => Value> = {
    'sqrt': this.sqrt.bind(this),
    'abs': this.abs.bind(this)
  };
  private aggregationEngine: AggregationEngine;

  constructor() {
    this.aggregationEngine = new AggregationEngine(this);
  }

  evaluate(expr: Expression, context: RuntimeContext): Value {
    switch (expr.type) {
      case 'NumberLiteral':
        return this.evaluateNumberLiteral(expr as NumberLiteral);
      case 'StringLiteral':
        return this.evaluateStringLiteral(expr as StringLiteral);
      case 'BinaryExpression':
        return this.evaluateBinaryExpression(expr as BinaryExpression, context);
      case 'VariableReference':
        return this.evaluateVariableReference(expr as VariableReference, context);
      case 'FunctionCall':
        return this.evaluateFunctionCall(expr as FunctionCall, context);
      case 'AggregationExpression':
        return this.aggregationEngine.evaluate(expr as AggregationExpression, context);
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

  private evaluateStringLiteral(expr: StringLiteral): Value {
    return {
      type: 'string',
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

  private evaluateFunctionCall(expr: FunctionCall, context: RuntimeContext): Value {
    // Evaluate all arguments first
    const evaluatedArgs = expr.arguments.map(arg => this.evaluate(arg, context));
    
    // Check if it's a built-in function
    const builtInFunc = this.builtInFunctions[expr.functionName];
    if (builtInFunc) {
      return builtInFunc(evaluatedArgs);
    }
    
    // Unknown function
    throw new Error(`Unknown function: ${expr.functionName}`);
  }

  // Built-in function implementations
  private sqrt(args: Value[]): Value {
    if (args.length !== 1) {
      throw new Error('sqrt expects exactly 1 argument');
    }
    
    const arg = args[0];
    if (arg.type !== 'number') {
      throw new Error('sqrt expects a number argument');
    }
    
    const value = arg.value as number;
    if (value < 0) {
      throw new Error('sqrt of negative number');
    }
    
    return {
      type: 'number',
      value: Math.sqrt(value)
    };
  }

  private abs(args: Value[]): Value {
    if (args.length !== 1) {
      throw new Error('abs expects exactly 1 argument');
    }
    
    const arg = args[0];
    if (arg.type !== 'number') {
      throw new Error('abs expects a number argument');
    }
    
    return {
      type: 'number',
      value: Math.abs(arg.value as number)
    };
  }
}