import { IEvaluator, Value, RuntimeContext } from '../interfaces';
import { Expression, NumberLiteral, StringLiteral, BinaryExpression, UnaryExpression, VariableReference, FunctionCall, AggregationExpression } from '../ast/expressions';
import { AggregationEngine } from './aggregation-engine';
import { TimelineEvaluator } from './timeline-evaluator';
import { TimelineExpression, TimelineValue } from '../ast/timelines';

/**
 * Evaluator for expression nodes
 */
export class ExpressionEvaluator implements IEvaluator {
  private builtInFunctions: Record<string, (args: Value[]) => Value> = {
    'sqrt': this.sqrt.bind(this),
    'abs': this.abs.bind(this)
  };
  private aggregationEngine: AggregationEngine;
  private timelineEvaluator: TimelineEvaluator;

  constructor() {
    this.aggregationEngine = new AggregationEngine(this);
    this.timelineEvaluator = new TimelineEvaluator(this);
  }

  evaluate(expr: Expression, context: RuntimeContext): Value {
    switch (expr.type) {
      case 'NumberLiteral':
        return this.evaluateNumberLiteral(expr as NumberLiteral);
      case 'StringLiteral':
        return this.evaluateStringLiteral(expr as StringLiteral);
      case 'BinaryExpression':
        return this.evaluateBinaryExpression(expr as BinaryExpression, context);
      case 'UnaryExpression':
        return this.evaluateUnaryExpression(expr as UnaryExpression, context);
      case 'VariableReference':
        return this.evaluateVariableReference(expr as VariableReference, context);
      case 'FunctionCall':
        return this.evaluateFunctionCall(expr as FunctionCall, context);
      case 'AggregationExpression':
        return this.aggregationEngine.evaluate(expr as AggregationExpression, context);
      case 'TimelineExpression':
        return this.timelineEvaluator.evaluate(expr as TimelineExpression, context);
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
    // Check if this is a logical operator
    if (expr.operator === '&&' || expr.operator === '||') {
      return this.evaluateLogicalExpression(expr, context);
    }

    const left = this.evaluate(expr.left, context);
    const right = this.evaluate(expr.right, context);

    // Check if either operand is a timeline
    if (left.type === 'timeline' || right.type === 'timeline') {
      return this.evaluateTimelineBinaryExpression(expr, left, right, context);
    }

    // Check if this is a comparison operator
    const comparisonOps = ['==', '!=', '>', '<', '>=', '<='];
    if (comparisonOps.includes(expr.operator)) {
      return this.evaluateComparisonExpression(expr, left, right);
    }

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

  private evaluateComparisonExpression(expr: BinaryExpression, left: Value, right: Value): Value {
    // For now, only support comparing numbers
    if (left.type !== 'number' || right.type !== 'number') {
      throw new Error(`Cannot compare ${left.type} with ${right.type}`);
    }

    const leftVal = left.value as number;
    const rightVal = right.value as number;
    let result: boolean;

    switch (expr.operator) {
      case '==':
        result = leftVal === rightVal;
        break;
      case '!=':
        result = leftVal !== rightVal;
        break;
      case '>':
        result = leftVal > rightVal;
        break;
      case '<':
        result = leftVal < rightVal;
        break;
      case '>=':
        result = leftVal >= rightVal;
        break;
      case '<=':
        result = leftVal <= rightVal;
        break;
      default:
        throw new Error(`Unknown comparison operator: ${expr.operator}`);
    }

    return {
      type: 'boolean',
      value: result
    };
  }

  private evaluateLogicalExpression(expr: BinaryExpression, context: RuntimeContext): Value {
    // For && operator, implement short-circuit evaluation
    if (expr.operator === '&&') {
      const left = this.evaluate(expr.left, context);
      
      // Type check - must be boolean
      if (left.type !== 'boolean') {
        throw new Error(`Left operand of && must be boolean, got ${left.type}`);
      }
      
      // Short-circuit: if left is false, don't evaluate right
      if (!(left.value as boolean)) {
        return {
          type: 'boolean',
          value: false
        };
      }
      
      // Left is true, evaluate right
      const right = this.evaluate(expr.right, context);
      
      if (right.type !== 'boolean') {
        throw new Error(`Right operand of && must be boolean, got ${right.type}`);
      }
      
      return {
        type: 'boolean',
        value: right.value as boolean
      };
    } 
    // For || operator, implement short-circuit evaluation
    else if (expr.operator === '||') {
      const left = this.evaluate(expr.left, context);
      
      // Type check - must be boolean
      if (left.type !== 'boolean') {
        throw new Error(`Left operand of || must be boolean, got ${left.type}`);
      }
      
      // Short-circuit: if left is true, don't evaluate right
      if (left.value as boolean) {
        return {
          type: 'boolean',
          value: true
        };
      }
      
      // Left is false, evaluate right
      const right = this.evaluate(expr.right, context);
      
      if (right.type !== 'boolean') {
        throw new Error(`Right operand of || must be boolean, got ${right.type}`);
      }
      
      return {
        type: 'boolean',
        value: right.value as boolean
      };
    } else {
      throw new Error(`Unknown logical operator: ${expr.operator}`);
    }
  }

  private evaluateUnaryExpression(expr: UnaryExpression, context: RuntimeContext): Value {
    // Evaluate the operand
    const operand = this.evaluate(expr.operand, context);
    
    switch (expr.operator) {
      case '-':
        // Unary minus - operand must be a number
        if (operand.type !== 'number') {
          throw new Error(`Cannot apply unary minus to ${operand.type}`);
        }
        return {
          type: 'number',
          value: -(operand.value as number),
          unit: operand.unit
        };
        
      case '!':
        // Logical NOT - operand must be boolean
        if (operand.type !== 'boolean') {
          throw new Error(`Cannot apply logical NOT to ${operand.type}`);
        }
        return {
          type: 'boolean',
          value: !(operand.value as boolean)
        };
        
      default:
        throw new Error(`Unknown unary operator: ${expr.operator}`);
    }
  }

  private evaluateTimelineBinaryExpression(
    expr: BinaryExpression,
    left: Value,
    right: Value,
    context: RuntimeContext
  ): Value {
    // Both must be timelines, or one timeline and one scalar
    if (left.type === 'timeline' && right.type === 'timeline') {
      const leftTimeline = (left as any as TimelineValue).value;
      const rightTimeline = (right as any as TimelineValue).value;
      return this.timelineEvaluator.evaluateTimelineBinaryOp(
        leftTimeline,
        rightTimeline,
        expr.operator,
        context
      );
    } else {
      // One timeline and one scalar - not yet implemented
      throw new Error('Timeline-scalar operations not yet implemented');
    }
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