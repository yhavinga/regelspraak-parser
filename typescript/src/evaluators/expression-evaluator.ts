import { IEvaluator, Value, RuntimeContext } from '../interfaces';
import { Expression, NumberLiteral, StringLiteral, BinaryExpression, UnaryExpression, VariableReference, FunctionCall, AggregationExpression, NavigationExpression, SubselectieExpression, AllAttributesExpression, Predicaat, KenmerkPredicaat, AttributeComparisonPredicaat, AttributeReference } from '../ast/expressions';
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
      case 'AttributeReference':
        return this.evaluateAttributeReference(expr as AttributeReference, context);
      case 'AllAttributesExpression':
        return this.evaluateAllAttributesExpression(expr as AllAttributesExpression, context);
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

    // Check if this is a dagsoort operator
    const dagsoortOps = ['is een dagsoort', 'zijn een dagsoort', 'is geen dagsoort', 'zijn geen dagsoort'];
    if (dagsoortOps.includes(expr.operator)) {
      return this.evaluateDagsoortExpression(expr, context);
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
    const { operator, operand: operandExpr } = expr;
    
    switch (operator) {
      case '-': {
        // Evaluate operand for unary minus
        const operand = this.evaluate(operandExpr, context);
        // Unary minus - operand must be a number
        if (operand.type !== 'number') {
          throw new Error(`Cannot apply unary minus to ${operand.type}`);
        }
        return {
          type: 'number',
          value: -(operand.value as number),
          unit: operand.unit
        };
      }
        
      case '!':
      case 'niet': {
        // Evaluate operand for logical NOT
        const operand = this.evaluate(operandExpr, context);
        // Logical NOT - operand must be boolean
        if (operand.type !== 'boolean') {
          throw new Error(`Cannot apply logical NOT to ${operand.type}`);
        }
        return {
          type: 'boolean',
          value: !(operand.value as boolean)
        };
      }
        
      case 'voldoet aan de elfproef':
      case 'voldoen aan de elfproef': {
        // Evaluate operand for elfproef
        const operand = this.evaluate(operandExpr, context);
        // Elfproef validation - handle null/missing values
        if (operand.type === 'null' || operand.value === null || operand.value === undefined) {
          return {
            type: 'boolean',
            value: false
          };
        }
        // Operand must be string or number
        if (operand.type !== 'string' && operand.type !== 'number') {
          throw new Error(`Cannot apply elfproef to ${operand.type}`);
        }
        return {
          type: 'boolean',
          value: this.checkElfproef(operand.value)
        };
      }
        
      case 'voldoet niet aan de elfproef':
      case 'voldoen niet aan de elfproef': {
        // Evaluate operand for negative elfproef
        const operand = this.evaluate(operandExpr, context);
        // Negative elfproef validation - handle null/missing values
        if (operand.type === 'null' || operand.value === null || operand.value === undefined) {
          return {
            type: 'boolean',
            value: true  // null/missing doesn't meet elfproef, so "not meets" is true
          };
        }
        // Operand must be string or number
        if (operand.type !== 'string' && operand.type !== 'number') {
          throw new Error(`Cannot apply elfproef to ${operand.type}`);
        }
        return {
          type: 'boolean',
          value: !this.checkElfproef(operand.value)
        };
      }
      
      case 'moeten uniek zijn':
        return this.evaluateUniekExpression(operandExpr, context);
        
      default:
        throw new Error(`Unknown unary operator: ${operator}`);
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
        expr.operator as ('+' | '-' | '*' | '/' | '==' | '!=' | '>' | '<' | '>=' | '<=' | '&&' | '||'),
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
      // Throw an error when attribute is not found
      throw new Error(`Attribute "${expr.attribute}" not found`);
    }
    
    return attributeValue;
  }

  private evaluateAttributeReference(expr: AttributeReference, context: RuntimeContext): Value {
    // Check if this is the special "alle" pattern for uniqueness checks
    if (expr.path.length === 3 && expr.path[1] === 'alle') {
      // Pattern: ["attributeName", "alle", "objectType"]
      const attributeName = expr.path[0];
      const objectType = expr.path[2];
      
      // Get all objects of the specified type from context
      const ctx = context as any;  // Cast to access implementation-specific methods
      if (ctx.getObjectsByType) {
        const objects = ctx.getObjectsByType(objectType);
        
        // Extract the specified attribute from each object
        const values: Value[] = [];
        for (const obj of objects) {
          if (obj.type === 'object') {
            const objectData = obj.value as Record<string, Value>;
            const attrValue = objectData[attributeName];
            if (attrValue !== undefined) {
              values.push(attrValue);
            }
          }
        }
        
        // Return as array for uniqueness checking
        return {
          type: 'array',
          value: values
        };
      }
    }
    
    // For other attribute reference patterns, we need more context
    // This might be a navigation pattern or other reference
    throw new Error(`Unsupported AttributeReference pattern: ${expr.path.join(' -> ')}`);
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

  private evaluateDagsoortExpression(expr: BinaryExpression, context: RuntimeContext): Value {
    // Evaluate the date expression (left side)
    const dateValue = this.evaluate(expr.left, context);
    
    // Handle null/missing values
    if (dateValue.type === 'null' || dateValue.value === null || dateValue.value === undefined) {
      // For positive checks (is een dagsoort), null returns false
      // For negative checks (is geen dagsoort), null returns true
      const isNegativeCheck = expr.operator.includes('geen');
      return {
        type: 'boolean',
        value: isNegativeCheck
      };
    }
    
    // Date must be a Date type
    if (dateValue.type !== 'date') {
      throw new Error(`Cannot apply dagsoort check to ${dateValue.type}`);
    }
    
    // Get the dagsoort name from the right side
    const dagsoortExpr = expr.right;
    if (dagsoortExpr.type !== 'StringLiteral') {
      throw new Error('Expected dagsoort name to be a string literal');
    }
    const dagsoortName = (dagsoortExpr as StringLiteral).value;
    
    
    // For now, implement hardcoded dagsoort checks
    // In a full implementation, this would look up dagsoort definitions in the model
    const date = dateValue.value as Date;
    let isDagsoort = false;
    
    switch (dagsoortName.toLowerCase()) {
      case 'werkdag':
        isDagsoort = this.isWerkdag(date);
        break;
      case 'weekend':
        isDagsoort = this.isWeekend(date);
        break;
      case 'feestdag':
        isDagsoort = this.isFeestdag(date);
        break;
      default:
        // Unknown dagsoort - would normally look up in model
        isDagsoort = false;
        break;
    }
    
    // Apply negation if needed
    const isPositiveCheck = expr.operator === 'is een dagsoort' || expr.operator === 'zijn een dagsoort';
    const result = isPositiveCheck ? isDagsoort : !isDagsoort;
    
    return {
      type: 'boolean',
      value: result
    };
  }

  private isWerkdag(date: Date): boolean {
    // First check if it's a holiday
    if (this.isFeestdag(date)) {
      return false;
    }
    
    // Check if it's a weekend
    const dayOfWeek = date.getDay();
    // Sunday = 0, Saturday = 6
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }

  private isWeekend(date: Date): boolean {
    const dayOfWeek = date.getDay();
    // Sunday = 0, Saturday = 6
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  private isFeestdag(date: Date): boolean {
    // Dutch national holidays (fixed dates)
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();
    
    // Fixed holidays
    const fixedHolidays = [
      { month: 1, day: 1 },   // New Year's Day
      { month: 4, day: 27 },  // King's Day (Koningsdag)
      { month: 12, day: 25 }, // Christmas Day
      { month: 12, day: 26 }  // Boxing Day (Tweede Kerstdag)
    ];
    
    // Check if the date matches any fixed holiday
    for (const holiday of fixedHolidays) {
      if (month === holiday.month && day === holiday.day) {
        return true;
      }
    }
    
    // TODO: Implement movable holidays (Easter, Pentecost, etc.)
    // For now, we'll just check fixed holidays
    
    return false;
  }

  // Removed duplicate evaluateUnaryExpression - merged into the one above

  private evaluateUniekExpression(operand: Expression, context: RuntimeContext): Value {
    // Evaluate the operand to get the collection of values to check
    const collectionValue = this.evaluate(operand, context);
    
    // Handle null/missing values
    if (collectionValue.type === 'null' || collectionValue.value === null) {
      // Empty collection is considered unique
      return { type: 'boolean', value: true };
    }
    
    // Must be an array
    if (collectionValue.type !== 'array') {
      throw new Error(`Cannot check uniqueness of non-array type: ${collectionValue.type}`);
    }
    
    const values = collectionValue.value as Value[];
    
    // Filter out null/missing values
    const nonNullValues = values.filter(v => v.type !== 'null' && v.value !== null && v.value !== undefined);
    
    // Empty or single-item collections are always unique
    if (nonNullValues.length <= 1) {
      return { type: 'boolean', value: true };
    }
    
    // Check for duplicates
    const seen = new Set<any>();
    for (const val of nonNullValues) {
      const key = this.getValueKey(val);
      if (seen.has(key)) {
        // Found a duplicate
        return { type: 'boolean', value: false };
      }
      seen.add(key);
    }
    
    // All values are unique
    return { type: 'boolean', value: true };
  }

  private getValueKey(value: Value): string {
    // Create a unique key for the value to use in duplicate detection
    if (value.type === 'string' || value.type === 'number' || value.type === 'boolean') {
      return `${value.type}:${value.value}`;
    } else if (value.type === 'date') {
      return `date:${(value.value as Date).toISOString()}`;
    } else {
      // For complex types, use JSON serialization
      return JSON.stringify(value);
    }
  }

  private evaluateNot(value: Value): Value {
    if (value.type === 'boolean') {
      return { type: 'boolean', value: !value.value };
    }
    // For other types, apply truthiness check then negate
    const isTruthy = this.isTruthy(value);
    return { type: 'boolean', value: !isTruthy };
  }

  private isTruthy(value: Value): boolean {
    if (value.type === 'boolean') {
      return value.value === true;
    }
    if (value.type === 'number') {
      return value.value !== 0;
    }
    if (value.type === 'string') {
      return value.value !== '';
    }
    if (value.type === 'null') {
      return false;
    }
    // For other types, non-null is truthy
    return value.value != null;
  }
  
  private evaluateAllAttributesExpression(expr: AllAttributesExpression, context: RuntimeContext): Value {
    // This is similar to AttributeReference with the "alle" pattern
    // Pattern is more structured here: specific attribute from all objects of a type
    
    const ctx = context as any;  // Cast to access implementation-specific methods
    if (!ctx.getObjectsByType) {
      throw new Error('Context does not support getObjectsByType');
    }
    
    const objects = ctx.getObjectsByType(expr.objectType);
    
    // Extract the specified attribute from each object
    const values: Value[] = [];
    for (const obj of objects) {
      if (obj.type === 'object') {
        const objectData = obj.value as Record<string, Value>;
        const attrValue = objectData[expr.attribute];
        if (attrValue !== undefined) {
          values.push(attrValue);
        }
      }
    }
    
    // Return as array for uniqueness checking or other aggregations
    return {
      type: 'array',
      value: values
    };
  }
}