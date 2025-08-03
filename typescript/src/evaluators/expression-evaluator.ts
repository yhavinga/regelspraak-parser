import { IEvaluator, Value, RuntimeContext } from '../interfaces';
import { Expression, NumberLiteral, StringLiteral, BinaryExpression, UnaryExpression, VariableReference, FunctionCall, AggregationExpression, NavigationExpression, SubselectieExpression, AllAttributesExpression, Predicaat, KenmerkPredicaat, AttributeComparisonPredicaat, AttributeReference } from '../ast/expressions';
import { AggregationEngine } from './aggregation-engine';
import { TimelineEvaluator } from './timeline-evaluator';
import { TimelineExpression, TimelineValue } from '../ast/timelines';
import { UnitRegistry, performUnitArithmetic, UnitValue, createUnitValue } from '../units';

/**
 * Evaluator for expression nodes
 */
export class ExpressionEvaluator implements IEvaluator {
  private builtInFunctions: Record<string, (args: Value[], unitConversion?: string) => Value> = {
    'sqrt': this.sqrt.bind(this),
    'abs': this.abs.bind(this),
    'aantal': this.aantal.bind(this),
    'som': this.som.bind(this),
    'som_van': this.som_van.bind(this),
    'tijdsduur_van': this.tijdsduur_van.bind(this),
    'abs_tijdsduur_van': this.abs_tijdsduur_van.bind(this),
    'aantal_dagen_in': this.aantal_dagen_in.bind(this)
  };
  private aggregationEngine: AggregationEngine;
  private timelineEvaluator: TimelineEvaluator;
  private unitRegistry: UnitRegistry;

  constructor() {
    this.aggregationEngine = new AggregationEngine(this);
    this.timelineEvaluator = new TimelineEvaluator(this);
    this.unitRegistry = new UnitRegistry();
  }

  evaluate(expr: Expression, context: RuntimeContext): Value {
    // Defensive check for undefined expression
    if (!expr) {
      console.error('Expression evaluator received null/undefined expression');
      throw new Error('Cannot evaluate null or undefined expression');
    }
    
    // Defensive check for missing type
    if (!expr.type) {
      console.error('Expression missing type field:', JSON.stringify(expr, null, 2));
      throw new Error(`Expression missing type field: ${JSON.stringify(expr)}`);
    }
    
    switch (expr.type) {
      case 'NumberLiteral':
        return this.evaluateNumberLiteral(expr as NumberLiteral, context);
      case 'StringLiteral':
        return this.evaluateStringLiteral(expr as StringLiteral);
      case 'Literal':
        return this.evaluateLiteral(expr as any);
      case 'BooleanLiteral':
        return this.evaluateBooleanLiteral(expr as any);
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
      case 'DimensionedAttributeReference':
        return this.evaluateDimensionedAttributeReference(expr as any, context);
      case 'AllAttributesExpression':
        return this.evaluateAllAttributesExpression(expr as AllAttributesExpression, context);
      default:
        throw new Error(`Unknown expression type: ${expr.type}`);
    }
  }

  private evaluateNumberLiteral(expr: NumberLiteral, context: RuntimeContext): Value {
    if (expr.unit) {
      // Use context's unit registry if available (for custom unit systems)
      const registry = (context as any).unitRegistry || this.unitRegistry;
      // Create a unit value using the unit registry
      return createUnitValue(expr.value, expr.unit, registry);
    }
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

  private evaluateLiteral(expr: any): Value {
    // Generic literal handler - for compatibility with visitor patterns
    // Maps datatype to Value type
    switch (expr.datatype) {
      case 'string':
      case 'Tekst':
        return {
          type: 'string',
          value: expr.value
        };
      case 'number':
      case 'Numeriek':
        return {
          type: 'number',
          value: expr.value
        };
      case 'boolean':
      case 'Logisch':
        return {
          type: 'boolean',
          value: expr.value
        };
      default:
        // Fallback to string
        return {
          type: 'string',
          value: expr.value
        };
    }
  }

  private evaluateBooleanLiteral(expr: any): Value {
    return {
      type: 'boolean',
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

    // Use unit arithmetic if either operand has units
    if (left.unit || right.unit || (left as UnitValue).compositeUnit || (right as UnitValue).compositeUnit) {
      try {
        // Use context's unit registry if available (for custom unit systems)
        const registry = (context as any).unitRegistry || this.unitRegistry;
        return performUnitArithmetic(
          expr.operator as '+' | '-' | '*' | '/',
          left as UnitValue,
          right as UnitValue,
          registry
        );
      } catch (error) {
        // Re-throw with more context
        throw new Error(`Unit arithmetic error: ${(error as Error).message}`);
      }
    }

    // No units - simple arithmetic
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
    // First check if there's a current instance and the variable name is an attribute
    const ctx = context as any;
    if (ctx.current_instance && ctx.current_instance.type === 'object') {
      const objectData = ctx.current_instance.value as Record<string, Value>;
      if (objectData[expr.variableName] !== undefined) {
        return objectData[expr.variableName];
      }
    }
    
    // Otherwise look for a regular variable
    const value = context.getVariable(expr.variableName);
    if (value === undefined) {
      throw new Error(`Undefined variable: ${expr.variableName}`);
    }
    return value;
  }

  private evaluateFunctionCall(expr: FunctionCall, context: RuntimeContext): Value {
    // Special handling for aantal_dagen_in - needs unevaluated condition expression
    if (expr.functionName === 'aantal_dagen_in') {
      return this.aantal_dagen_in_special(expr, context);
    }
    
    // Evaluate all arguments first
    const evaluatedArgs = expr.arguments.map(arg => this.evaluate(arg, context));
    
    // Check if it's a built-in function
    const builtInFunc = this.builtInFunctions[expr.functionName];
    if (builtInFunc) {
      return builtInFunc(evaluatedArgs, expr.unitConversion);
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

  private som(args: Value[]): Value {
    // Simple sum of multiple values
    if (args.length === 0) {
      throw new Error('som expects at least one argument');
    }
    
    let sum = 0;
    for (const arg of args) {
      if (arg.type !== 'number') {
        throw new Error(`som expects numeric arguments, got ${arg.type}`);
      }
      sum += arg.value as number;
    }
    
    return {
      type: 'number',
      value: sum
    };
  }

  private som_van(args: Value[]): Value {
    // Sum aggregation for attribute references with filtering
    if (args.length !== 1) {
      throw new Error('som_van expects exactly 1 argument (an array of values)');
    }
    
    const arg = args[0];
    
    // If it's already an array, sum the values
    if (arg.type === 'array') {
      const values = arg.value as Value[];
      let sum = 0;
      
      for (const val of values) {
        if (val.type !== 'number') {
          throw new Error(`som_van expects numeric values, got ${val.type}`);
        }
        sum += val.value as number;
      }
      
      return {
        type: 'number',
        value: sum
      };
    } else {
      throw new Error(`som_van expects an array argument, got ${arg.type}`);
    }
  }

  private tijdsduur_van(args: Value[], unitConversion?: string): Value {
    if (args.length !== 2) {
      throw new Error('tijdsduur_van expects exactly 2 arguments');
    }
    
    const startDateVal = args[0];
    const endDateVal = args[1];
    
    if (startDateVal.type !== 'date' || endDateVal.type !== 'date') {
      throw new Error(`tijdsduur_van expects two date arguments, got ${startDateVal.type} and ${endDateVal.type}`);
    }
    
    const startDate = startDateVal.value as Date;
    const endDate = endDateVal.value as Date;
    
    // Calculate difference in milliseconds
    const diffMs = endDate.getTime() - startDate.getTime();
    
    // Convert to the requested unit or default to days
    const unit = unitConversion || 'dagen';
    let value: number;
    
    switch (unit) {
      case 'jaren':
        // Calculate year difference accounting for leap years
        const yearDiff = endDate.getFullYear() - startDate.getFullYear();
        const monthDiff = endDate.getMonth() - startDate.getMonth();
        const dayDiff = endDate.getDate() - startDate.getDate();
        
        // Adjust for partial years
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          value = yearDiff - 1;
        } else {
          value = yearDiff;
        }
        break;
        
      case 'maanden':
        const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 
                          + (endDate.getMonth() - startDate.getMonth());
        // Adjust for partial months
        if (endDate.getDate() < startDate.getDate()) {
          value = totalMonths - 1;
        } else {
          value = totalMonths;
        }
        break;
        
      case 'dagen':
        value = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        break;
        
      case 'weken':
        value = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
        break;
        
      case 'uren':
        value = Math.floor(diffMs / (1000 * 60 * 60));
        break;
        
      case 'minuten':
        value = Math.floor(diffMs / (1000 * 60));
        break;
        
      case 'seconden':
        value = Math.floor(diffMs / 1000);
        break;
        
      default:
        throw new Error(`Unknown time unit: ${unit}`);
    }
    
    // Create unit value with the specified unit
    return createUnitValue(value, unit);
  }

  private abs_tijdsduur_van(args: Value[], unitConversion?: string): Value {
    // Call regular tijdsduur_van first
    const result = this.tijdsduur_van(args, unitConversion);
    
    // Make the value absolute
    if (result.type === 'number') {
      const value = Math.abs(result.value as number);
      // Preserve unit if present
      if ('unit' in result) {
        return createUnitValue(value, (result as any).unit?.name);
      }
      return {
        type: 'number',
        value: Math.abs(result.value as number)
      };
    }
    
    return result;
  }

  private aantal_dagen_in(args: Value[]): Value {
    // This is the legacy method that takes evaluated arguments
    // Not used for the specification pattern
    throw new Error('aantal_dagen_in should be called via aantal_dagen_in_special');
  }
  
  private aantal_dagen_in_special(expr: FunctionCall, context: RuntimeContext): Value {
    // Pattern: "het aantal dagen in (de maand | het jaar) dat <condition>"
    // Args: [periodType: 'maand' | 'jaar', condition: expression (unevaluated)]
    
    if (expr.arguments.length !== 2) {
      throw new Error('aantal_dagen_in expects exactly 2 arguments: period type and condition');
    }
    
    // First argument should be a Literal with period type
    const periodArg = expr.arguments[0];
    if (periodArg.type !== 'Literal') {
      throw new Error('First argument to aantal_dagen_in must be a literal');
    }
    
    const periodLiteral = periodArg as any;
    const periodType = periodLiteral.value;
    
    if (periodType !== 'maand' && periodType !== 'jaar') {
      throw new Error("First argument to aantal_dagen_in must be 'maand' or 'jaar'");
    }
    
    // Second argument is the condition expression (unevaluated)
    const conditionExpr = expr.arguments[1];
    
    // Get evaluation date from context
    const ctx = context as any;
    const evaluationDate = ctx.getEvaluationDate ? ctx.getEvaluationDate() : new Date();
    
    // Determine the period to iterate over
    let startDate: Date;
    let endDate: Date;
    
    if (periodType === 'maand') {
      // Current month
      startDate = new Date(evaluationDate.getFullYear(), evaluationDate.getMonth(), 1);
      endDate = new Date(evaluationDate.getFullYear(), evaluationDate.getMonth() + 1, 0);
    } else {
      // Current year
      startDate = new Date(evaluationDate.getFullYear(), 0, 1);
      endDate = new Date(evaluationDate.getFullYear(), 11, 31);
    }
    
    // Count days where condition is true
    let count = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      // Create a temporary context with current date
      // We need to properly copy properties, not just use prototype chain
      const tempContext = Object.create(context);
      
      // Copy important properties from the original context
      Object.assign(tempContext, {
        current_instance: (context as any).current_instance,
        getEvaluationDate: function() { return new Date(currentDate); },
        setEvaluationDate: function(date: Date) { /* no-op for temp context */ },
        // Copy other necessary methods/properties
        getVariable: context.getVariable ? context.getVariable.bind(context) : undefined,
        setVariable: context.setVariable ? context.setVariable.bind(context) : undefined,
        getObjectsByType: (context as any).getObjectsByType ? (context as any).getObjectsByType.bind(context) : undefined
      });
      
      // Evaluate the condition for this day
      try {
        const conditionResult = this.evaluate(conditionExpr, tempContext);
        
        // Check if condition is truthy
        if (this.isTruthy(conditionResult)) {
          count++;
        }
      } catch (error) {
        // If condition evaluation fails (e.g., missing attribute), skip this day
        // This is consistent with how conditions are handled elsewhere
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      type: 'number',
      value: count,
      unit: {
        name: `dagen/${periodType}`,
        system: 'Tijd'
      }
    } as UnitValue;
  }

  private evaluateNavigationExpression(expr: NavigationExpression, context: RuntimeContext): Value {
    // First evaluate the object expression
    const objectValue = this.evaluate(expr.object, context);
    
    // Handle navigation into collections
    if (objectValue.type === 'array') {
      // When navigating into a collection, return a collection of the attribute values
      const collection = objectValue.value as Value[];
      const results: Value[] = [];
      
      for (const item of collection) {
        if (item.type === 'object') {
          const objectData = item.value as Record<string, Value>;
          const attributeValue = objectData[expr.attribute];
          
          if (attributeValue !== undefined) {
            results.push(attributeValue);
          }
          // Skip items that don't have the attribute
        }
      }
      
      return {
        type: 'array',
        value: results
      };
    }
    
    // Check if the object is actually an object
    if (objectValue.type !== 'object') {
      throw new Error(`Cannot navigate into non-object type: ${objectValue.type}`);
    }
    
    // Get the object's attributes
    const objectData = objectValue.value as Record<string, Value>;
    
    // Look up the attribute
    const attributeValue = objectData[expr.attribute];
    
    if (attributeValue === undefined) {
      // Check if this is a navigation through a Feittype relationship
      const ctx = context as any;
      // Try to find related objects through Feittype relationships
      const relatedObjects = this.findRelatedObjectsThroughFeittype(expr.attribute, objectValue, ctx);
      if (relatedObjects && relatedObjects.length > 0) {
        // Return as an array of related objects
        return {
          type: 'array',
          value: relatedObjects
        };
      }
      
      // Throw an error when attribute is not found and no relationships match
      throw new Error(`Attribute "${expr.attribute}" not found`);
    }
    
    return attributeValue;
  }
  
  private findRelatedObjectsThroughFeittype(roleName: string, fromObject: Value, context: any): Value[] | null {
    // Get all registered Feittypen
    const feittypen = context.feittypen || new Map();
    
    // Clean the role name for comparison
    const roleNameClean = roleName.toLowerCase().trim();
    
    // Check each Feittype to see if it has a matching role
    for (const [feittypeName, feittype] of feittypen) {
      for (const rol of feittype.rollen) {
        const rolNaamClean = rol.naam.toLowerCase().trim();
        const rolMeervoudClean = (rol.meervoud || '').toLowerCase().trim();
        
        // Check if the role name matches (singular or plural)
        if (roleNameClean === rolNaamClean || 
            roleNameClean === rolMeervoudClean ||
            // Handle common plural patterns
            (roleNameClean.endsWith('s') && roleNameClean.slice(0, -1) === rolNaamClean) ||
            (roleNameClean.endsWith('en') && roleNameClean.slice(0, -2) === rolNaamClean)) {
          
          // Found a matching role - get related objects
          const asSubject = feittype.rollen.indexOf(rol) === 1; // If we matched the second role, look for subjects
          const relatedObjects = context.getRelatedObjects(fromObject, feittypeName, asSubject);
          
          if (relatedObjects && relatedObjects.length > 0) {
            return relatedObjects;
          }
        }
      }
    }
    
    return null;
  }

  private evaluateAttributeReference(expr: AttributeReference, context: RuntimeContext): Value {
    // Handle paths starting with 'self' (pronoun resolution)
    if (expr.path.length >= 2 && expr.path[0] === 'self') {
      // Get the current instance from context
      const ctx = context as any;
      const currentInstance = ctx.current_instance;
      
      if (!currentInstance) {
        throw new Error('No current instance available for pronoun resolution');
      }
      
      // Navigate through the rest of the path
      let value: Value = currentInstance;
      for (let i = 1; i < expr.path.length; i++) {
        const attr = expr.path[i];
        
        if (value.type === 'object') {
          const objectData = value.value as Record<string, Value>;
          if (!(attr in objectData)) {
            throw new Error(`Attribute '${attr}' not found on object`);
          }
          value = objectData[attr];
          
          // If the value has a timeline, extract the value at the evaluation date
          if (value && typeof value === 'object' && 'timeline' in value) {
            const timelineValue = value as any;
            const evalDate = ctx.getEvaluationDate ? ctx.getEvaluationDate() : new Date();
            
            // Find the value at the evaluation date
            let foundValue = null;
            if (timelineValue.timeline && Array.isArray(timelineValue.timeline)) {
              for (const period of timelineValue.timeline) {
                if (evalDate >= period.validFrom && evalDate < period.validTo) {
                  foundValue = period.value;
                  break;
                }
              }
            }
            
            // If we found a timeline value, use it; otherwise use the base value
            value = foundValue || timelineValue;
          }
        } else {
          throw new Error(`Cannot access attribute '${attr}' on ${value.type}`);
        }
      }
      
      return value;
    }
    
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
    
    // Handle simple navigation patterns like ["naam", "persoon"]
    if (expr.path.length === 2) {
      const [attribute, objectName] = expr.path;
      
      // Look up the object as a variable
      const objectValue = this.evaluateVariableReference({ type: 'VariableReference', variableName: objectName } as VariableReference, context);
      
      // Navigate to the attribute
      if (objectValue.type !== 'object') {
        throw new Error(`Cannot navigate into non-object type: ${objectValue.type}`);
      }
      
      const obj = objectValue.value as Record<string, Value>;
      
      if (!(attribute in obj)) {
        // Check for Feittype relationships
        const relatedObjects = this.findRelatedObjectsThroughFeittype(attribute, objectValue, context);
        if (relatedObjects) {
          return {
            type: 'array',
            value: relatedObjects
          };
        }
        
        throw new Error(`Attribute '${attribute}' not found on object of type ${objectValue.type}`);
      }
      
      return obj[attribute];
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

  private evaluateDimensionedAttributeReference(expr: any, context: RuntimeContext): Value {
    // DimensionedAttributeReference wraps a navigation/attribute reference with dimension labels
    
    // For the pattern "het netto inkomen van huidig jaar van de persoon", the AST has:
    // - baseAttribute: NavigationExpression with attribute "netto inkomen" and object pointing to "huidig jaar"
    // - dimensionLabels: ["netto", "huidig jaar"]
    
    // We need to extract the real attribute name and object from the base attribute
    const baseAttribute = expr.baseAttribute;
    let targetObject: Value;
    let attributeName: string;
    
    if (baseAttribute.type === 'NavigationExpression') {
      // For dimensional patterns, we need to reconstruct the proper navigation
      // The attribute name should be cleaned of dimension keywords
      attributeName = baseAttribute.attribute;
      
      // Remove dimension keywords from attribute name
      const dimensionKeywords = ['bruto', 'netto'];
      for (const keyword of dimensionKeywords) {
        attributeName = attributeName.replace(keyword, '').trim();
      }
      
      // The object might be nested navigation that includes dimension labels
      // For now, we'll assume the deepest object is the actual target
      let currentNav = baseAttribute.object;
      while (currentNav && currentNav.type === 'NavigationExpression') {
        currentNav = currentNav.object;
      }
      
      // Evaluate the actual object
      if (currentNav && currentNav.type === 'VariableReference') {
        targetObject = this.evaluate(currentNav, context);
      } else {
        targetObject = this.evaluate(baseAttribute.object, context);
      }
    } else if (baseAttribute.type === 'AttributeReference') {
      // For AttributeReference with dimensions
      // The path should have the attribute name and object type
      const path = baseAttribute.path;
      if (path.length < 2) {
        throw new Error('AttributeReference in dimensional context must have at least 2 path elements');
      }
      
      // Extract attribute name and object path
      attributeName = path[0];
      
      // Remove dimension keywords from attribute name if needed
      const dimensionKeywords = ['bruto', 'netto'];
      for (const keyword of dimensionKeywords) {
        attributeName = attributeName.replace(keyword, '').trim();
      }
      
      // Get the target object - for now, assume it's a variable
      const objectName = path[path.length - 1];
      targetObject = context.getVariable(objectName) || { type: 'null', value: null };
    } else {
      throw new Error(`Unsupported base attribute type for dimensional reference: ${baseAttribute.type}`);
    }
    
    // Ensure we have an object
    if (targetObject.type !== 'object') {
      throw new Error(`Cannot access dimensional attribute on non-object type: ${targetObject.type}`);
    }
    
    // Access the dimensional attribute value
    const objectData = targetObject.value as Record<string, any>;
    
    // Check if the attribute has dimensional values
    const attrValue = objectData[attributeName];
    if (!attrValue || typeof attrValue !== 'object') {
      // Attribute doesn't have dimensional values, return null
      return { type: 'null', value: null };
    }
    
    // Navigate through the dimension structure based on the labels
    // The test expects a nested structure like: inkomen['huidig jaar']['netto']
    let currentValue = attrValue;
    
    // First check for temporal dimensions (jaar)
    const temporalLabels = ['huidig jaar', 'vorig jaar', 'volgend jaar'];
    for (const label of expr.dimensionLabels) {
      if (temporalLabels.includes(label) && currentValue && typeof currentValue === 'object' && label in currentValue) {
        currentValue = currentValue[label];
        break;
      }
    }
    
    // Then check for other dimensions (bruto/netto)
    const valueLabels = ['bruto', 'netto'];
    for (const label of expr.dimensionLabels) {
      if (valueLabels.includes(label) && currentValue && typeof currentValue === 'object' && label in currentValue) {
        currentValue = currentValue[label];
        break;
      }
    }
    
    // Convert the final value to a proper Value type
    if (typeof currentValue === 'number') {
      return { type: 'number', value: currentValue };
    } else if (typeof currentValue === 'string') {
      return { type: 'string', value: currentValue };
    } else if (currentValue === null || currentValue === undefined) {
      return { type: 'null', value: null };
    } else {
      // Return as-is for complex types
      return { type: 'object', value: currentValue };
    }
  }
}