import { IEvaluator, Value, RuntimeContext } from '../interfaces';
import { Expression, NumberLiteral, StringLiteral, BinaryExpression, UnaryExpression, VariableReference, FunctionCall, AggregationExpression, SubselectieExpression, RegelStatusExpression, AllAttributesExpression, Predicaat, KenmerkPredicaat, AttributeComparisonPredicaat, AttributeReference, SamengesteldeVoorwaarde, KwantificatieType } from '../ast/expressions';
import { AggregationEngine } from './aggregation-engine';
import { TimelineEvaluator } from './timeline-evaluator';
import { TimelineExpression, TimelineValue, TimelineValueImpl } from '../ast/timelines';
import { PredicateEvaluator } from '../predicates/predicate-evaluator';
import { 
  SimplePredicate, 
  CompoundPredicate, 
  AttributePredicate,
  fromLegacyKenmerkPredicaat,
  fromLegacyAttributeComparison
} from '../predicates/predicate-types';
import { UnitRegistry, performUnitArithmetic, UnitValue, createUnitValue } from '../units';
import { Context } from '../runtime/context';

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
    // 'totaal_van' removed - handled via TimelineExpression
    'tijdsevenredig_deel': this.tijdsevenredig_deel.bind(this),
    'tijdsduur_van': this.tijdsduur_van.bind(this),
    'abs_tijdsduur_van': this.abs_tijdsduur_van.bind(this),
    'aantal_dagen_in': this.aantal_dagen_in.bind(this),
    'maand_uit': this.maand_uit.bind(this),
    'dag_uit': this.dag_uit.bind(this),
    'jaar_uit': this.jaar_uit.bind(this)
  };
  private aggregationEngine: AggregationEngine;
  private timelineEvaluator: TimelineEvaluator;
  private unitRegistry: UnitRegistry;
  private predicateEvaluator: PredicateEvaluator;

  constructor() {
    this.aggregationEngine = new AggregationEngine(this);
    this.timelineEvaluator = new TimelineEvaluator(this);
    this.unitRegistry = new UnitRegistry();
    this.predicateEvaluator = new PredicateEvaluator(this);
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
      // NavigationExpression removed - now using AttributeReference with path arrays
      // case 'NavigationExpression':
      //   return this.evaluateNavigationExpression(expr as NavigationExpression, context);
      case 'SubselectieExpression':
        return this.evaluateSubselectieExpression(expr as SubselectieExpression, context);
      case 'AttributeReference':
        return this.evaluateAttributeReference(expr as AttributeReference, context);
      case 'DimensionedAttributeReference':
        return this.evaluateDimensionedAttributeReference(expr as any, context);
      case 'AllAttributesExpression':
        return this.evaluateAllAttributesExpression(expr as AllAttributesExpression, context);
      case 'SamengesteldeVoorwaarde':
        return this.evaluateSamengesteldeVoorwaarde(expr as SamengesteldeVoorwaarde, context);
      case 'RegelStatusExpression':
        return this.evaluateRegelStatusExpression(expr as RegelStatusExpression, context);
      case 'DateLiteral':
        return this.evaluateDateLiteral(expr as any, context);
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

  private evaluateDateLiteral(expr: any, context: RuntimeContext): Value {
    return {
      type: 'date',
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

    // Check if this is a numeric exact operator
    const numericExactOps = ['is numeriek met exact', 'is niet numeriek met exact', 
                             'zijn numeriek met exact', 'zijn niet numeriek met exact'];
    if (numericExactOps.includes(expr.operator)) {
      return this.evaluateNumericExactExpression(expr, context);
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
    // Check if we can perform the operation
    const arithmeticOps = ['+', '-', '*', '/'];
    const isArithmeticOp = arithmeticOps.includes(expr.operator);
    
    if (left.type === 'timeline' && right.type === 'timeline') {
      // Both are timelines
      const leftTimeline = (left as any as TimelineValue).value;
      const rightTimeline = (right as any as TimelineValue).value;
      return this.timelineEvaluator.evaluateTimelineBinaryOp(
        leftTimeline,
        rightTimeline,
        expr.operator as ('+' | '-' | '*' | '/' | '==' | '!=' | '>' | '<' | '>=' | '<=' | '&&' | '||'),
        context
      );
    } else if (left.type === 'timeline' && right.type === 'number' && isArithmeticOp) {
      // Timeline × scalar
      const leftTimeline = (left as any as TimelineValue).value;
      return this.timelineEvaluator.evaluateTimelineScalarOp(
        leftTimeline,
        right,
        expr.operator as ('+' | '-' | '*' | '/'),
        context
      );
    } else if (left.type === 'number' && right.type === 'timeline' && isArithmeticOp) {
      // Scalar × timeline
      const rightTimeline = (right as any as TimelineValue).value;
      return this.timelineEvaluator.evaluateScalarTimelineOp(
        left,
        rightTimeline,
        expr.operator as ('+' | '-' | '*' | '/'),
        context
      );
    } else {
      // Unsupported combination
      throw new Error(`Cannot apply operator ${expr.operator} to ${left.type} and ${right.type}`);
    }
  }

  private evaluateVariableReference(expr: VariableReference, context: RuntimeContext): Value {
    // First check if there's a current instance and the variable name is an attribute
    const ctx = context as any;
    if (ctx.current_instance && ctx.current_instance.type === 'object') {
      const currentInstance = ctx.current_instance;
      const objectData = currentInstance.value as Record<string, Value>;
      
      // Check if the variable name matches the current instance's object type
      // This handles pronoun-like references (e.g., "vlucht" refers to the current Vlucht)
      if (currentInstance.objectType && 
          expr.variableName.toLowerCase() === currentInstance.objectType.toLowerCase()) {
        return currentInstance;
      }
      
      // Check if this is a Feittype role name that should navigate to a related object
      const relatedObjects = this.findRelatedObjectsThroughFeittype(expr.variableName, currentInstance, ctx);
      if (relatedObjects && relatedObjects.length > 0) {
        // Return the first related object (assumes single relationship)
        return relatedObjects[0];
      }
      
      // Check if it's an attribute of the current instance
      if (objectData[expr.variableName] !== undefined) {
        return objectData[expr.variableName];
      }
    }
    
    // Otherwise look for a regular variable
    const value = context.getVariable(expr.variableName);
    if (value !== undefined) {
      return value;
    }
    
    // Check for timeline parameters
    if (ctx.getTimelineParameter) {
      const timelineValue = ctx.getTimelineParameter(expr.variableName);
      if (timelineValue) {
        // TimelineValueImpl already has type: 'timeline' and value: Timeline
        return timelineValue;
      }
    }
    
    throw new Error(`Undefined variable: ${expr.variableName}`);
  }

  private evaluateFunctionCall(expr: FunctionCall, context: RuntimeContext): Value {
    // Special handling for aantal_dagen_in - needs unevaluated condition expression
    if (expr.functionName === 'aantal_dagen_in') {
      return this.aantal_dagen_in_special(expr, context);
    }
    
    // Defensive check: totaal_van should be handled via TimelineExpression, not FunctionCall
    if (expr.functionName === 'totaal_van') {
      throw new Error('totaal_van should be handled via TimelineExpression. Grammar may have changed unexpectedly.');
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

  // totaal_van method removed - handled via TimelineExpression in timeline-evaluator

  private tijdsevenredig_deel(args: Value[]): Value {
    // Time-proportional part calculation
    // Format: HET_TIJDSEVENREDIG_DEEL_PER (MAAND | JAAR) VAN expressie
    if (args.length < 2) {
      throw new Error('tijdsevenredig_deel expects at least 2 arguments (period type and value)');
    }
    
    // First argument should be the period type ("maand" or "jaar")
    const periodType = args[0];
    if (periodType.type !== 'string') {
      throw new Error('tijdsevenredig_deel first argument should be period type');
    }
    
    const value = args[1];
    if (value.type !== 'number') {
      throw new Error('tijdsevenredig_deel expects a numeric value');
    }
    
    // TODO: Implement actual time-proportional calculation based on period
    // For now, return a placeholder implementation
    console.warn('tijdsevenredig_deel not fully implemented in TypeScript');
    
    return value; // Placeholder: return the value as-is
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

  private findRelatedObjectsThroughFeittype(roleName: string, fromObject: Value, context: any): Value[] | null {
    // Get all registered Feittypen
    const feittypen = context.getAllFeittypen ? context.getAllFeittypen() : [];
    
    // Clean the role name for comparison (remove articles)
    const roleNameClean = roleName.toLowerCase().replace(/^(de|het|een)\s+/, '').trim();
    
    // Check each Feittype to see if it has a matching role
    for (const feittype of feittypen) {
      if (!feittype.rollen) continue;
      
      for (let roleIdx = 0; roleIdx < feittype.rollen.length; roleIdx++) {
        const rol = feittype.rollen[roleIdx];
        const rolNaamClean = rol.naam.toLowerCase().replace(/^(de|het|een)\s+/, '').trim();
        const rolMeervoudClean = (rol.meervoud || '').toLowerCase().replace(/^(de|het|een)\s+/, '').trim();
        
        // Check if the role name matches (singular or plural)
        if (roleNameClean === rolNaamClean || 
            (rolMeervoudClean && roleNameClean === rolMeervoudClean) ||
            // Handle common plural patterns
            (roleNameClean.endsWith('s') && roleNameClean.slice(0, -1) === rolNaamClean) ||
            (roleNameClean.endsWith('en') && roleNameClean.slice(0, -2) === rolNaamClean)) {
          
          // Found a matching role - now check if fromObject matches any other role in this Feittype
          const fromObjType = (fromObject as any).objectType;
          if (!fromObjType) continue;
          
          // Find which role the fromObject matches
          for (let otherIdx = 0; otherIdx < feittype.rollen.length; otherIdx++) {
            if (otherIdx === roleIdx) continue; // Skip the target role
            
            const otherRol = feittype.rollen[otherIdx];
            if (otherRol.objectType === fromObjType) {
              // fromObject matches this role, so we can navigate
              // Determine navigation direction: if fromObject is at index 0, it's the subject
              const asSubject = (otherIdx === 0);
              const relatedObjects = context.getRelatedObjects(fromObject, feittype.naam, asSubject);
              
              if (relatedObjects && relatedObjects.length > 0) {
                return relatedObjects;
              }
            }
          }
        }
      }
    }
    
    return null;
  }

  private evaluateAttributeReference(expr: AttributeReference, context: RuntimeContext): Value {
    // Check if the last element is an aggregation function (object-first order)
    if (expr.path.length > 1) {
      const lastElement = expr.path[expr.path.length - 1].toLowerCase();
      if (lastElement === 'aantal' || lastElement === 'som' || lastElement === 'totaal') {
        // This is an aggregation pattern: ['vlucht', 'alle passagiers', 'aantal']
        // Navigate through the path except the last element to collect objects
        const remainingPath = expr.path.slice(0, -1);
        
        // Create a new AttributeReference for the navigation part
        const navExpr: AttributeReference = {
          type: 'AttributeReference',
          path: remainingPath
        };
        
        // Evaluate the navigation to get the collection
        const collectionValue = this.evaluateAttributeReference(navExpr, context);
        
        // Apply the aggregation
        if (lastElement === 'aantal') {
          // Count the items
          if (collectionValue.type === 'array') {
            const items = collectionValue.value as Value[];
            return { type: 'number', value: items.length };
          } else if (collectionValue.type === 'list') {
            const items = collectionValue.value as Value[];
            return { type: 'number', value: items.length };
          } else {
            // Single item counts as 1
            return { type: 'number', value: 1 };
          }
        } else if (lastElement === 'som' || lastElement === 'totaal') {
          // Sum the values
          if (collectionValue.type !== 'array' && collectionValue.type !== 'list') {
            throw new Error(`Cannot sum non-collection type: ${collectionValue.type}`);
          }
          const items = collectionValue.value as Value[];
          let sum = 0;
          for (const item of items) {
            if (item.type === 'number') {
              sum += item.value as number;
            } else {
              throw new Error(`Cannot sum ${item.type} values`);
            }
          }
          return { type: 'number', value: sum };
        }
      }
    }
    
    // Handle pronoun-bound dimensional map access like ["self", "betaalde belasting in jaar"]
    if (expr.path.length === 2 && expr.path[0] === 'self') {
      const ctxAny = context as any;
      const currentInstance = ctxAny.current_instance;
      if (!currentInstance || currentInstance.type !== 'object') {
        // Fallback to variable
        const v = context.getVariable(expr.path[1]);
        return v ?? { type: 'null', value: null };
      }
      
      // First check if this is a timeline attribute
      const attr = expr.path[1];
      // Convert attribute name to internal format (spaces to underscores)
      const attrName = attr.replace(/ /g, '_');
      
      if (ctxAny.getTimelineAttribute && currentInstance.objectType && currentInstance.objectId) {
        const timelineValue = ctxAny.getTimelineAttribute(
          currentInstance.objectType, 
          currentInstance.objectId, 
          attrName,
          ctxAny.evaluation_date
        );
        if (timelineValue !== null && timelineValue !== undefined) {
          return timelineValue;
        }
      }
      
      // Fall back to regular object attributes
      const objectData = currentInstance.value as Record<string, Value> | Record<string, any>;
      const val = (objectData as any)[attrName] || (objectData as any)[attr];
      if (val === undefined) {
        return { type: 'null', value: null };
      }
      // If plain JS object (dimension map), wrap it
      if (val && typeof val === 'object' && !('type' in val)) {
        return { type: 'object', value: val } as Value;
      }
      return val as Value;
    }
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
      // Pattern: ["objectType", "alle", "attributeName"] (object-first order)
      const objectType = expr.path[0];
      const attributeName = expr.path[2];
      
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
    
    // Check for "alle <role> van <object>" pattern (e.g., "alle passagiers van de vlucht")
    // With object-first order: ["vlucht", "alle passagiers"]
    if (expr.path.length === 2 && expr.path[1].startsWith('alle ')) {
      // Extract the role name from "alle passagiers"
      const roleName = expr.path[1].substring(5); // Remove "alle " prefix
      const objectRef = expr.path[0];
      
      // First get the object
      const objectValue = this.evaluateVariableReference({ 
        type: 'VariableReference', 
        variableName: objectRef 
      } as VariableReference, context);
      
      if (objectValue.type !== 'object') {
        throw new Error(`Expected object but got ${objectValue.type}`);
      }
      
      // Find related objects through Feittype relationships
      const ctx = context as any;
      const relatedObjects = this.findRelatedObjectsThroughFeittype(roleName, objectValue, ctx);
      
      if (relatedObjects) {
        return {
          type: 'array',
          value: relatedObjects
        };
      }
      
      // If no Feittype relationship found, return empty array
      return {
        type: 'array',
        value: []
      };
    }
    
    // Handle simple navigation patterns like ["persoon", "naam"] (object-first order)
    if (expr.path.length === 2) {
      const [objectName, attribute] = expr.path;
      
      // Check if this is a pronoun-based Feittype navigation like ["vluchtdatum", "zijn reis"]
      if (objectName.startsWith('zijn ') || objectName.startsWith('haar ')) {
        const roleName = objectName.substring(5); // Remove "zijn " or "haar " prefix
        const ctx = context as any;
        
        if (ctx.current_instance && ctx.current_instance.type === 'object') {
          // Find related objects through Feittype using the role name
          const relatedObjects = this.findRelatedObjectsThroughFeittype(roleName, ctx.current_instance, ctx);
          
          if (relatedObjects && relatedObjects.length > 0) {
            // Get the first related object (assumes single relationship)
            const relatedObject = relatedObjects[0];
            
            if (relatedObject.type === 'object') {
              const objectData = relatedObject.value as Record<string, Value>;
              const attrValue = objectData[attribute];
              
              if (attrValue !== undefined) {
                return attrValue;
              }
              throw new Error(`Attribute '${attribute}' not found on related object`);
            }
          }
          throw new Error(`No related object found through role '${roleName}'`);
        }
      }
      
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
    
    // Handle simple single-element paths as variable references
    if (expr.path.length === 1) {
      const variableName = expr.path[0];
      
      // Check if this is a pronoun-based Feittype role like "zijn reis"
      if (variableName.startsWith('zijn ') || variableName.startsWith('haar ')) {
        const roleName = variableName.substring(5); // Remove pronoun prefix
        const ctx = context as any;
        
        if (ctx.current_instance && ctx.current_instance.type === 'object') {
          // Find related objects through Feittype using the role name
          const relatedObjects = this.findRelatedObjectsThroughFeittype(roleName, ctx.current_instance, ctx);
          
          if (relatedObjects && relatedObjects.length > 0) {
            // Return the first related object (assumes single relationship)
            return relatedObjects[0];
          }
          throw new Error(`No related object found through role '${roleName}'`);
        }
      }
      
      // Check if this refers to the current instance by object type name
      const ctx = context as any;
      if (ctx.current_instance) {
        const currentInstance = ctx.current_instance;
        if (currentInstance.type === 'object' && currentInstance.objectType) {
          // Check if the variable name matches the object type (case-insensitive)
          if (variableName.toLowerCase() === currentInstance.objectType.toLowerCase()) {
            return currentInstance;
          }
        }
      }
      
      const value = context.getVariable(variableName);
      if (value) {
        return value;
      }
      // Try with underscores replaced by spaces (for multi-word attributes)
      const altName = variableName.replace(/_/g, ' ');
      const altValue = context.getVariable(altName);
      if (altValue) {
        return altValue;
      }
      // Return null if not found
      return { type: 'null', value: null };
    }
    
    // Handle multi-element navigation paths (3 or more elements)
    // Use the navigation utility to resolve complex paths
    if (expr.path.length > 2) {
      const { resolveNavigationPath } = require('../utils/navigation');
      const navResult = resolveNavigationPath(expr.path, context);
      
      if (navResult.error) {
        throw new Error(navResult.error);
      }
      
      if (!navResult.targetObject) {
        throw new Error(`Navigation failed for path: ${expr.path.join(' -> ')}`);
      }
      
      // Get the attribute from the target object
      if (navResult.targetObject.type !== 'object') {
        throw new Error(`Cannot get attribute '${navResult.attributeName}' from non-object`);
      }
      
      const objectData = navResult.targetObject.value as Record<string, Value>;
      const value = objectData[navResult.attributeName];
      
      if (value === undefined) {
        throw new Error(`Attribute '${navResult.attributeName}' not found on object`);
      }
      
      return value;
    }
    
    // For other unhandled patterns
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
      // Use unified predicate if available
      if (expr.predicate) {
        return this.predicateEvaluator.evaluate(expr.predicate, item, context);
      }
      // Fallback to legacy evaluation
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
    const date = dateValue.value as Date;
    
    // Check if the dagsoort is declared in the model
    // Need to check both the full name and the name without article
    const isDagsoortDeclared = context.domainModel.dagsoortDefinities?.some(
      d => {
        const fullName = (d as any).name || (d as any).dagsoortName;
        if (!fullName) return false;
        // Check exact match
        if (fullName.toLowerCase() === dagsoortName.toLowerCase()) return true;
        // Check without article (de/het/een)
        const nameWithoutArticle = fullName.replace(/^(de|het|een)\s+/i, '');
        return nameWithoutArticle.toLowerCase() === dagsoortName.toLowerCase();
      }
    );
    
    // Look up dagsoort rules in the model
    // Dagsoort rules can be either DagsoortDefinitie or KenmerkToekenning with format "is een <dagsoort>"
    const dagsoortRules = (context.domainModel.regels || []).filter(regel => {
      // Support both 'result' and 'resultaat' property names
      const result = regel.result || regel.resultaat;
      
      // Check for DagsoortDefinitie type
      if (result && result.type === 'DagsoortDefinitie' && 
          (result as any).dagsoortName?.toLowerCase() === dagsoortName.toLowerCase()) {
        return true;
      }
      
      // Check for Kenmerktoekenning with matching kenmerk
      if (result && result.type === 'Kenmerktoekenning') {
        const kt = result as any;
        // Check if it's "is een <dagsoort>" pattern
        if (kt.kenmerk === `is een ${dagsoortName}` || 
            kt.kenmerk === dagsoortName ||
            kt.kenmerk?.toLowerCase() === dagsoortName.toLowerCase()) {
          return true;
        }
      }
      
      return false;
    });
    
    if (dagsoortRules.length === 0) {
      // If dagsoort is declared but has no rules, return false
      if (isDagsoortDeclared) {
        const isPositiveCheck = expr.operator === 'is een dagsoort' || expr.operator === 'zijn een dagsoort';
        return {
          type: 'boolean',
          value: !isPositiveCheck
        };
      }
      
      // Check for built-in dagsoort types only if not declared
      const builtInResult = this.evaluateBuiltInDagsoort(date, dagsoortName);
      if (builtInResult !== undefined) {
        const isPositiveCheck = expr.operator === 'is een dagsoort' || expr.operator === 'zijn een dagsoort';
        const result = isPositiveCheck ? builtInResult : !builtInResult;
        return {
          type: 'boolean',
          value: result
        };
      }
      
      // No definition found - return false for positive checks, true for negative
      const isPositiveCheck = expr.operator === 'is een dagsoort' || expr.operator === 'zijn een dagsoort';
      return {
        type: 'boolean',
        value: !isPositiveCheck
      };
    }
    
    // Create a temporary context for evaluating the dagsoort rules
    const dagContext = context.clone ? context.clone() : context;
    
    // Create a temporary dag object
    const dagObject = {
      type: 'Dag',
      id: `dag_${date.toISOString()}`,
      attributes: {
        dag: { type: 'date', value: date } as Value,
        maand: { type: 'number', value: date.getMonth() + 1 } as Value,
        dag_van_maand: { type: 'number', value: date.getDate() } as Value,
        jaar: { type: 'number', value: date.getFullYear() } as Value
      }
    };
    
    // Set the dag object as current instance
    dagContext.current_instance = dagObject as any;
    
    // Make "de dag" available as a variable
    dagContext.setVariable('dag', { type: 'date', value: date });
    
    // Check each dagsoort rule
    let isDagsoort = false;
    for (const regel of dagsoortRules) {
      // Support both 'voorwaarde' and 'condition' property names
      const voorwaarde = regel.voorwaarde || regel.condition;
      if (voorwaarde) {
        try {
          // Evaluate the condition
          const conditionResult = this.evaluate(voorwaarde.expression || (voorwaarde as any).expressie, dagContext);
          if (conditionResult.type === 'boolean' && conditionResult.value === true) {
            isDagsoort = true;
            break;
          }
        } catch (e) {
          console.debug(`Error evaluating dagsoort rule '${regel.name || regel.naam}':`, e);
          continue;
        }
      } else {
        // No condition means always true
        isDagsoort = true;
        break;
      }
    }
    
    // Apply negation if needed
    const isPositiveCheck = expr.operator === 'is een dagsoort' || expr.operator === 'zijn een dagsoort';
    const result = isPositiveCheck ? isDagsoort : !isDagsoort;
    
    return {
      type: 'boolean',
      value: result
    };
  }

  private evaluateNumericExactExpression(expr: BinaryExpression, context: RuntimeContext): Value {
    // Evaluate the value expression (left side)
    const valueToCheck = this.evaluate(expr.left, context);
    
    // Handle null/missing values
    if (valueToCheck.type === 'null' || valueToCheck.value === null || valueToCheck.value === undefined) {
      // For positive checks, null returns false
      // For negative checks, null returns true
      const isNegativeCheck = expr.operator.includes('niet');
      return {
        type: 'boolean',
        value: isNegativeCheck
      };
    }
    
    // Get the expected digit count from the right side
    const digitCountExpr = expr.right;
    if (digitCountExpr.type !== 'NumberLiteral') {
      throw new Error('Expected digit count to be a number literal');
    }
    const digitCount = (digitCountExpr as NumberLiteral).value;
    
    // Convert value to string for digit checking
    const strValue = String(valueToCheck.value);
    
    // Check if all characters are digits
    const isAllDigits = /^\d+$/.test(strValue);
    
    // Check exact digit count
    const hasExactDigits = isAllDigits && strValue.length === digitCount;
    
    // Apply negation if needed
    const isPositiveCheck = expr.operator === 'is numeriek met exact' || expr.operator === 'zijn numeriek met exact';
    const result = isPositiveCheck ? hasExactDigits : !hasExactDigits;
    
    return {
      type: 'boolean',
      value: result
    };
  }

  // Date extraction functions
  private maand_uit(args: Value[]): Value {
    if (args.length !== 1) {
      throw new Error(`Function 'maand_uit' expects 1 argument, got ${args.length}`);
    }
    
    const dateValue = args[0];
    if (dateValue.type !== 'date') {
      throw new Error(`Function 'maand_uit' requires date argument, got ${dateValue.type}`);
    }
    
    const date = dateValue.value as Date;
    if (!date) {
      return { type: 'null', value: null };
    }
    
    // Return month number (1-12)
    return {
      type: 'number',
      value: date.getMonth() + 1  // JavaScript months are 0-indexed
    };
  }
  
  private dag_uit(args: Value[]): Value {
    if (args.length !== 1) {
      throw new Error(`Function 'dag_uit' expects 1 argument, got ${args.length}`);
    }
    
    const dateValue = args[0];
    if (dateValue.type !== 'date') {
      throw new Error(`Function 'dag_uit' requires date argument, got ${dateValue.type}`);
    }
    
    const date = dateValue.value as Date;
    if (!date) {
      return { type: 'null', value: null };
    }
    
    // Return day of month (1-31)
    return {
      type: 'number',
      value: date.getDate()
    };
  }
  
  private jaar_uit(args: Value[]): Value {
    if (args.length !== 1) {
      throw new Error(`Function 'jaar_uit' expects 1 argument, got ${args.length}`);
    }
    
    const dateValue = args[0];
    if (dateValue.type !== 'date') {
      throw new Error(`Function 'jaar_uit' requires date argument, got ${dateValue.type}`);
    }
    
    const date = dateValue.value as Date;
    if (!date) {
      return { type: 'null', value: null };
    }
    
    // Return year
    return {
      type: 'number',
      value: date.getFullYear()
    };
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

  private evaluateRegelStatusExpression(expr: RegelStatusExpression, context: RuntimeContext): Value {
    // Evaluate rule status check (gevuurd/inconsistent)
    const ctx = context as any;  // Cast to access Context methods
    
    if (expr.check === 'gevuurd') {
      const isExecuted = ctx.isRuleExecuted?.(expr.regelNaam) ?? false;
      return {
        type: 'boolean',
        value: isExecuted
      };
    } else if (expr.check === 'inconsistent') {
      const isInconsistent = ctx.isRuleInconsistent?.(expr.regelNaam) ?? false;
      return {
        type: 'boolean',
        value: isInconsistent
      };
    } else {
      throw new Error(`Unknown regel status check: ${expr.check}`);
    }
  }

  private evaluateSamengesteldeVoorwaarde(voorwaarde: SamengesteldeVoorwaarde, context: RuntimeContext): Value {
    // Use unified predicate if available
    if (voorwaarde.predicate) {
      // Use the unified predicate evaluator
      // For compound conditions, we pass a dummy value since conditions don't filter objects
      const result = this.predicateEvaluator.evaluate(
        voorwaarde.predicate, 
        { type: 'null', value: null }, 
        context
      );
      return { type: 'boolean', value: result };
    }
    
    // Fallback to legacy evaluation (to be removed after full migration)
    // Evaluate each condition and count how many are true
    let conditionsMetCount = 0;
    const totalConditions = voorwaarde.voorwaarden.length;
    
    // Evaluate each condition
    for (const conditionExpr of voorwaarde.voorwaarden) {
      // Evaluate the condition expression
      const result = this.evaluate(conditionExpr, context);
      
      // Strict boolean check - each condition must evaluate to boolean
      if (result.type !== 'boolean') {
        throw new Error(`Compound condition element must evaluate to boolean, got ${result.type}`);
      }
      
      // Count if condition is true
      if (result.value === true) {
        conditionsMetCount++;
      }
    }
    
    // Apply quantifier logic
    let finalResult = false;
    
    switch (voorwaarde.kwantificatie.type) {
      case KwantificatieType.ALLE:
        // All conditions must be true
        finalResult = conditionsMetCount === totalConditions;
        break;
        
      case KwantificatieType.GEEN:
        // No conditions can be true
        finalResult = conditionsMetCount === 0;
        break;
        
      case KwantificatieType.TEN_MINSTE:
        // At least n conditions must be true
        if (voorwaarde.kwantificatie.aantal === undefined) {
          throw new Error('TEN_MINSTE quantifier requires a number');
        }
        finalResult = conditionsMetCount >= voorwaarde.kwantificatie.aantal;
        break;
        
      case KwantificatieType.TEN_HOOGSTE:
        // At most n conditions must be true
        if (voorwaarde.kwantificatie.aantal === undefined) {
          throw new Error('TEN_HOOGSTE quantifier requires a number');
        }
        finalResult = conditionsMetCount <= voorwaarde.kwantificatie.aantal;
        break;
        
      case KwantificatieType.PRECIES:
        // Exactly n conditions must be true
        if (voorwaarde.kwantificatie.aantal === undefined) {
          throw new Error('PRECIES quantifier requires a number');
        }
        finalResult = conditionsMetCount === voorwaarde.kwantificatie.aantal;
        break;
        
      default:
        throw new Error(`Unknown quantifier type: ${voorwaarde.kwantificatie.type}`);
    }
    
    return {
      type: 'boolean',
      value: finalResult
    };
  }

  private evaluateDimensionedAttributeReference(expr: any, context: RuntimeContext): Value {
    // DimensionedAttributeReference wraps a navigation/attribute reference with dimension labels
    
    // For the pattern "het netto inkomen van huidig jaar van de persoon", the AST has:
    // - baseAttribute: AttributeReference with path elements
    // - dimensionLabels: ["netto", "huidig jaar"]

    // We need to extract the real attribute name and object from the base attribute
    const baseAttribute = expr.baseAttribute;
    let targetObject: Value;
    let attributeName: string;

    // Handle AttributeReference and SubselectieExpression
    if (baseAttribute.type === 'AttributeReference') {
      // For AttributeReference with dimensions
      // The path should have the attribute name and object type
      const path = baseAttribute.path;
      if (path.length < 2) {
        throw new Error('AttributeReference in dimensional context must have at least 2 path elements');
      }
      
      // Extract attribute name and object path (object-first order)
      attributeName = path[path.length - 1];  // Last element is the attribute
      
      // Use dimension registry to identify and remove adjectival dimension labels from attribute name
      const registry = context.dimensionRegistry;
      for (const label of expr.dimensionLabels) {
        const axisName = registry.findAxisForLabel(label);
        if (axisName && registry.isAdjectival(axisName)) {
          // Remove adjectival dimension labels from the attribute name
          attributeName = attributeName.replace(label, '').trim();
        }
      }
      
      // Get the target object - with object-first order, first element is the object
      const objectName = path[0];
      targetObject = context.getVariable(objectName) || { type: 'null', value: null };
    } else if (baseAttribute.type === 'SubselectieExpression') {
      // Handle SubselectieExpression with dimensions
      // First evaluate the subselectie to get the filtered collection
      const subselectieResult = this.evaluateSubselectieExpression(baseAttribute as SubselectieExpression, context);

      // For dimensional access, we need a single object, not a collection
      if (subselectieResult.type === 'array') {
        const items = subselectieResult.value as Value[];
        if (items.length === 0) {
          return { type: 'null', value: null };
        }
        // Take the first item from the filtered collection
        targetObject = items[0];
      } else {
        targetObject = subselectieResult;
      }

      // Extract the attribute name from the underlying collection expression
      if (baseAttribute.collection?.type === 'AttributeReference') {
        const path = baseAttribute.collection.path;
        attributeName = path[path.length - 1];
      } else {
        throw new Error('Unable to determine attribute name from SubselectieExpression');
      }
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
    
    // Process dimension labels in order using the registry to determine their axes
    const registry = context.dimensionRegistry;
    const processedAxes = new Set<string>();
    
    // Sort labels by their dimension axis to ensure proper navigation order
    // Prepositional dimensions (with preposition) usually come first, then adjectival
    const sortedLabels = [...expr.dimensionLabels].sort((a, b) => {
      const axisA = registry.findAxisForLabel(a);
      const axisB = registry.findAxisForLabel(b);
      
      if (!axisA || !axisB) return 0;
      
      // Prepositional dimensions come first (they're typically the outer structure)
      const isPrepA = registry.isPrepositional(axisA);
      const isPrepB = registry.isPrepositional(axisB);
      
      if (isPrepA && !isPrepB) return -1;
      if (!isPrepA && isPrepB) return 1;
      return 0;
    });
    
    for (const label of sortedLabels) {
      const axisName = registry.findAxisForLabel(label);
      if (axisName && !processedAxes.has(axisName)) {
        processedAxes.add(axisName);
        
        if (currentValue && typeof currentValue === 'object' && label in currentValue) {
          currentValue = currentValue[label];
        } else {
          // Label not found in current value structure
          return { type: 'null', value: null };
        }
      }
    }
    
    // Convert the final value to a proper Value type
    if (typeof currentValue === 'number') {
      return { type: 'number', value: currentValue };
    } else if (typeof currentValue === 'string') {
      return { type: 'string', value: currentValue };
    } else if (currentValue === null || currentValue === undefined) {
      return { type: 'null', value: null };
    } else if (currentValue && typeof currentValue === 'object' && 'type' in currentValue) {
      // Already a proper Value object
      return currentValue as Value;
    } else {
      // Return as-is for complex types
      return { type: 'object', value: currentValue };
    }
  }
  
  /**
   * Evaluate built-in dagsoort types
   */
  private evaluateBuiltInDagsoort(date: Date, dagsoortName: string): boolean | undefined {
    const lowerName = dagsoortName.toLowerCase();
    
    // Werkdag: Monday through Friday, not a holiday
    if (lowerName === 'werkdag') {
      const dayOfWeek = date.getDay();
      // 0 = Sunday, 6 = Saturday
      const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
      // Check if it's a Dutch public holiday
      const isHoliday = this.isDutchPublicHoliday(date);
      return isWeekday && !isHoliday;
    }
    
    // Weekend: Saturday or Sunday
    if (lowerName === 'weekend' || lowerName === 'weekenddatum') {
      const dayOfWeek = date.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6;
    }
    
    // Feestdag: Dutch public holiday
    if (lowerName === 'feestdag') {
      return this.isDutchPublicHoliday(date);
    }
    
    // Not a built-in type
    return undefined;
  }
  
  /**
   * Check if a date is a Dutch public holiday
   */
  private isDutchPublicHoliday(date: Date): boolean {
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    const day = date.getDate();
    
    // Fixed holidays
    // New Year's Day (January 1)
    if (month === 0 && day === 1) return true;
    
    // Christmas Day (December 25)
    if (month === 11 && day === 25) return true;
    
    // Boxing Day (December 26)
    if (month === 11 && day === 26) return true;
    
    // King's Day (April 27, or April 26 if 27th is Sunday)
    if (month === 3) {
      if (day === 27 && date.getDay() !== 0) return true;
      if (day === 26 && new Date(year, 3, 27).getDay() === 0) return true;
    }
    
    // Liberation Day (May 5) - every 5 years
    if (month === 4 && day === 5 && year % 5 === 0) return true;
    
    // Easter-based holidays (simplified - would need proper Easter calculation)
    // For now, return false for movable holidays
    // TODO: Implement proper Easter calculation for Good Friday, Easter Monday, Ascension Day, Whit Monday
    
    return false;
  }
}