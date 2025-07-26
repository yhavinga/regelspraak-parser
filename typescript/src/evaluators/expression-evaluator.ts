import { IEvaluator, Value, RuntimeContext } from '../interfaces';
import { Expression, NumberLiteral, StringLiteral, BinaryExpression, UnaryExpression, VariableReference, FunctionCall, AggregationExpression, NavigationExpression, SubselectieExpression, Predicaat, KenmerkPredicaat, AttributeComparisonPredicaat } from '../ast/expressions';
import { AggregationEngine } from './aggregation-engine';
import { TimelineEvaluator } from './timeline-evaluator';
import { TimelineExpression, TimelineValue } from '../ast/timelines';

/**
 * Evaluator for expression nodes
 */
export class ExpressionEvaluator implements IEvaluator {
  private builtInFunctions: Record<string, (args: Value[]) => Value> = {
    'sqrt': this.sqrt.bind(this),
    'abs': this.abs.bind(this),
    'aantal': this.aantal.bind(this)
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
      case 'NavigationExpression':
        return this.evaluateNavigationExpression(expr as NavigationExpression, context);
      case 'SubselectieExpression':
        return this.evaluateSubselectieExpression(expr as SubselectieExpression, context);
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
    // Check if types are compatible for comparison
    if (left.type !== right.type && 
        !(left.type === 'null' || right.type === 'null')) {
      throw new Error(`Cannot compare ${left.type} with ${right.type}`);
    }

    let result: boolean;

    // Handle equality/inequality for all types
    if (expr.operator === '==' || expr.operator === '!=') {
      const equal = left.value === right.value;
      result = expr.operator === '==' ? equal : !equal;
    } 
    // Handle ordering comparisons
    else if (expr.operator === '>' || expr.operator === '<' || 
             expr.operator === '>=' || expr.operator === '<=') {
      
      // Only numbers and strings support ordering
      if (left.type !== 'number' && left.type !== 'string') {
        throw new Error(`Cannot use ${expr.operator} with ${left.type}`);
      }
      
      const leftVal = left.value as number | string;
      const rightVal = right.value as number | string;
      
      switch (expr.operator) {
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
    } else {
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
        
      case 'voldoet aan de elfproef':
      case 'voldoen aan de elfproef':
        // Elfproef validation - operand must be string or number
        if (operand.type !== 'string' && operand.type !== 'number') {
          throw new Error(`Cannot apply elfproef to ${operand.type}`);
        }
        return {
          type: 'boolean',
          value: this.checkElfproef(operand.value)
        };
        
      case 'voldoet niet aan de elfproef':
      case 'voldoen niet aan de elfproef':
        // Negative elfproef validation
        if (operand.type !== 'string' && operand.type !== 'number') {
          throw new Error(`Cannot apply elfproef to ${operand.type}`);
        }
        return {
          type: 'boolean',
          value: !this.checkElfproef(operand.value)
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
  
  private aantal(args: Value[]): Value {
    if (args.length !== 1) {
      throw new Error('aantal expects exactly 1 argument');
    }
    
    const arg = args[0];
    if (arg.type !== 'array') {
      throw new Error('aantal expects an array argument');
    }
    
    const items = arg.value as Value[];
    return {
      type: 'number',
      value: items.length
    };
  }

  private evaluateNavigationExpression(expr: NavigationExpression, context: RuntimeContext): Value {
    // First evaluate the object expression
    const objectValue = this.evaluate(expr.object, context);
    
    // Check if the object is actually an object
    if (objectValue.type !== 'object') {
      throw new Error(`Cannot navigate into non-object type: ${objectValue.type}`);
    }
    
    // Get the object's attributes
    const objectData = objectValue.value as Record<string, Value>;
    
    // Look up the attribute
    const attributeValue = objectData[expr.attribute];
    
    if (attributeValue === undefined) {
      throw new Error(`Attribute "${expr.attribute}" not found in object`);
    }
    
    return attributeValue;
  }

  private evaluateSubselectieExpression(expr: SubselectieExpression, context: RuntimeContext): Value {
    // First evaluate the collection expression
    const collectionValue = this.evaluate(expr.collection, context);
    
    // Check if it's an array
    if (collectionValue.type !== 'array') {
      throw new Error(`Cannot filter non-array type: ${collectionValue.type}`);
    }
    
    const items = collectionValue.value as Value[];
    
    // Filter the items based on the predicaat
    const filteredItems = items.filter(item => {
      return this.evaluatePredicaat(expr.predicaat, item, context);
    });
    
    return {
      type: 'array',
      value: filteredItems
    };
  }
  
  private evaluatePredicaat(predicaat: Predicaat, item: Value, context: RuntimeContext): boolean {
    switch (predicaat.type) {
      case 'KenmerkPredicaat':
        return this.evaluateKenmerkPredicaat(predicaat as KenmerkPredicaat, item);
        
      case 'AttributeComparisonPredicaat':
        return this.evaluateAttributeComparisonPredicaat(predicaat as AttributeComparisonPredicaat, item, context);
        
      default:
        throw new Error(`Unknown predicaat type: ${(predicaat as any).type}`);
    }
  }
  
  private evaluateKenmerkPredicaat(predicaat: KenmerkPredicaat, item: Value): boolean {
    // Check if the item is an object
    if (item.type !== 'object') {
      return false;
    }
    
    const objectData = item.value as Record<string, Value>;
    
    // Check if the kenmerk exists and is true
    const kenmerkKey = `is ${predicaat.kenmerk}`;
    const kenmerkValue = objectData[kenmerkKey];
    
    if (kenmerkValue && kenmerkValue.type === 'boolean') {
      return kenmerkValue.value as boolean;
    }
    
    return false;
  }
  
  private evaluateAttributeComparisonPredicaat(predicaat: AttributeComparisonPredicaat, item: Value, context: RuntimeContext): boolean {
    // Check if the item is an object
    if (item.type !== 'object') {
      return false;
    }
    
    const objectData = item.value as Record<string, Value>;
    const attributeValue = objectData[predicaat.attribute];
    
    if (!attributeValue) {
      return false;
    }
    
    // Create a comparison expression and evaluate it
    const comparisonExpr: BinaryExpression = {
      type: 'BinaryExpression',
      operator: predicaat.operator as any,
      left: { type: 'VariableReference', variableName: '_temp' } as Expression,
      right: predicaat.value
    };
    
    // Create temporary context with the attribute value
    const tempContext = context;
    (tempContext as any).setVariable('_temp', attributeValue);
    
    const result = this.evaluateBinaryExpression(comparisonExpr, tempContext);
    
    // Clean up temporary variable
    (tempContext as any).setVariable('_temp', undefined);
    
    return result.type === 'boolean' && result.value === true;
  }

  private checkElfproef(value: string | number): boolean {
    // Convert to string if number
    const bsn = value.toString();
    
    // BSN must be exactly 9 digits
    if (!/^\d{9}$/.test(bsn)) {
      return false;
    }
    
    // Check if all digits are the same (not allowed)
    if (/^(\d)\1{8}$/.test(bsn)) {
      return false;
    }
    
    // Apply the elfproef algorithm
    // Weights are: 9, 8, 7, 6, 5, 4, 3, 2, -1
    const weights = [9, 8, 7, 6, 5, 4, 3, 2, -1];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(bsn[i]) * weights[i];
    }
    
    // Valid if sum is divisible by 11
    return sum % 11 === 0;
  }
}