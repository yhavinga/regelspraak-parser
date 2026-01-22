import { IEvaluator, Value, RuntimeContext } from '../interfaces';
import { Expression, NumberLiteral, StringLiteral, BinaryExpression, UnaryExpression, VariableReference, ParameterReference, FunctionCall, AggregationExpression, SubselectieExpression, RegelStatusExpression, AllAttributesExpression, Predicaat, KenmerkPredicaat, AttributeComparisonPredicaat, AttributeReference, SamengesteldeVoorwaarde, QuantifierType } from '../ast/expressions';
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
import { stripUnitSuffix } from '../utils/navigation';

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
    'maximum_van': this.maximum_van.bind(this),
    'minimum_van': this.minimum_van.bind(this),
    'maximum_van_values': this.maximum_van_values.bind(this),
    'minimum_van_values': this.minimum_van_values.bind(this),
    // 'totaal_van' removed - handled via TimelineExpression
    // 'tijdsevenredig_deel' removed - handled via TimelineExpression in timeline-evaluator
    'tijdsduur_van': this.tijdsduur_van.bind(this),
    'abs_tijdsduur_van': this.abs_tijdsduur_van.bind(this),
    'aantal_dagen_in': this.aantal_dagen_in.bind(this),
    'maand_uit': this.maand_uit.bind(this),
    'dag_uit': this.dag_uit.bind(this),
    'jaar_uit': this.jaar_uit.bind(this),
    'datum_met': this.datum_met.bind(this),
    'eerste_van': this.eerste_van.bind(this),
    'laatste_van': this.laatste_van.bind(this),
    'eerste_paasdag_van': this.eerste_paasdag_van.bind(this)
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
      case 'TekstreeksExpression':
        return this.evaluateTekstreeksExpression(expr as any, context);
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
      case 'ParameterReference':
        return this.evaluateParameterReference(expr as ParameterReference, context);
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
      case 'AfrondingExpression':
        return this.evaluateAfrondingExpression(expr as any, context);
      case 'BegrenzingExpression':
        return this.evaluateBegrenzingExpression(expr as any, context);
      case 'BegrenzingAfrondingExpression':
        return this.evaluateBegrenzingAfrondingExpression(expr as any, context);
      case 'DisjunctionExpression':
        return this.evaluateDisjunctionExpression(expr as any, context);
      case 'ConjunctionExpression':
        return this.evaluateConjunctionExpression(expr as any, context);
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
        // Robustness: infer type from JavaScript typeof when datatype is missing
        if (typeof expr.value === 'number') {
          return { type: 'number', value: expr.value };
        }
        if (typeof expr.value === 'boolean') {
          return { type: 'boolean', value: expr.value };
        }
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

    // Check for date arithmetic (matching Python engine.py:5290-5314)
    if (expr.operator === '+' || expr.operator === '-') {
      const isLeftDate = left.type === 'date';
      const isRightDate = right.type === 'date';
      const timeUnits = ['jaren', 'jaar', 'jr', 'maanden', 'maand', 'mnd', 'weken', 'week', 'dagen', 'dag', 'dg', 'uren', 'uur', 'u', 'minuten', 'minuut', 'seconden', 'seconde', 's', 'milliseconden', 'milliseconde', 'ms'];

      // Get unit name (handle both string and Unit object)
      const getUnitName = (val: Value): string | undefined => {
        if (!val.unit) return undefined;
        return typeof val.unit === 'string' ? val.unit : val.unit.name;
      };

      // Date +/- time-unit
      const rightUnit = getUnitName(right);
      if (isLeftDate && !isRightDate && rightUnit && timeUnits.includes(rightUnit)) {
        return this.addTimeToDate(left, right, expr.operator === '-', context);
      }

      // time-unit + Date (commutative)
      const leftUnit = getUnitName(left);
      if (!isLeftDate && isRightDate && leftUnit && timeUnits.includes(leftUnit)) {
        return this.addTimeToDate(right, left, false, context);
      }

      // Date - Date -> tijdsduur_van call (auto-conversion)
      if (isLeftDate && isRightDate && expr.operator === '-') {
        return this.tijdsduur_van([left, right], undefined);
      }
    }

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
    // Convert null/non-number to 0 for arithmetic operations (graceful degradation for missing/wrong type attributes)
    // This matches Python's behavior where missing attributes compute as 0 rather than crash
    let leftVal = left;
    let rightVal = right;
    const arithmeticOps = ['+', '-', '*', '/'];
    if (arithmeticOps.includes(expr.operator)) {
      if (leftVal.type === 'null' || leftVal.type === 'string' || leftVal.type === 'boolean') {
        leftVal = { type: 'number', value: 0 };
      }
      if (rightVal.type === 'null' || rightVal.type === 'string' || rightVal.type === 'boolean') {
        rightVal = { type: 'number', value: 0 };
      }
    }

    if (leftVal.type !== 'number' || rightVal.type !== 'number') {
      throw new Error(`Cannot apply ${expr.operator} to ${leftVal.type} and ${rightVal.type}`);
    }

    // Use unit arithmetic if either operand has units
    if (leftVal.unit || rightVal.unit || (leftVal as UnitValue).compositeUnit || (rightVal as UnitValue).compositeUnit) {
      try {
        // Use context's unit registry if available (for custom unit systems)
        const registry = (context as any).unitRegistry || this.unitRegistry;
        return performUnitArithmetic(
          expr.operator as '+' | '-' | '*' | '/',
          leftVal as UnitValue,
          rightVal as UnitValue,
          registry
        );
      } catch (error) {
        // Re-throw with more context
        throw new Error(`Unit arithmetic error: ${(error as Error).message}`);
      }
    }

    // No units - simple arithmetic
    const leftNum = leftVal.value as number;
    const rightNum = rightVal.value as number;
    let result: number;

    switch (expr.operator) {
      case '+':
        result = leftNum + rightNum;
        break;
      case '-':
        result = leftNum - rightNum;
        break;
      case '*':
        result = leftNum * rightNum;
        break;
      case '/':
        if (rightNum === 0) {
          throw new Error('Division by zero');
        }
        result = leftNum / rightNum;
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
    // Handle object == true/false as existence/truthiness check
    // This handles mis-parsed kenmerk checks like "hij is een passagier" → self == true
    if ((left.type === 'object' && right.type === 'boolean') ||
      (left.type === 'boolean' && right.type === 'object')) {
      const objValue = left.type === 'object' ? left : right;
      const boolValue = left.type === 'boolean' ? left : right;

      // Object exists and is compared to true → check truthiness
      if (expr.operator === '==') {
        const objExists = objValue.value !== null && objValue.value !== undefined;
        const result = boolValue.value === true ? objExists : !objExists;
        return { type: 'boolean', value: result };
      } else if (expr.operator === '!=') {
        const objExists = objValue.value !== null && objValue.value !== undefined;
        const result = boolValue.value === true ? !objExists : objExists;
        return { type: 'boolean', value: result };
      }
    }

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

    // Strip possessive pronouns for FeitType lookup (matches Python _strip_possessive_pronoun)
    let lookupName = expr.variableName;
    const possessivePrefixes = ['zijn ', 'haar ', 'hun '];
    for (const prefix of possessivePrefixes) {
      if (expr.variableName.toLowerCase().startsWith(prefix)) {
        lookupName = expr.variableName.substring(prefix.length);
        break;
      }
    }

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
      // Use lookupName (possessive stripped) for FeitType lookup
      const relatedObjects = this.findRelatedObjectsThroughFeittype(lookupName, currentInstance, ctx);
      if (relatedObjects && relatedObjects.length > 0) {
        // Return the first related object (assumes single relationship)
        return relatedObjects[0];
      }

      // Check if it's an attribute of the current instance (try both original and stripped)
      if (objectData[expr.variableName] !== undefined) {
        return objectData[expr.variableName];
      }
      if (lookupName !== expr.variableName && objectData[lookupName] !== undefined) {
        return objectData[lookupName];
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

  private evaluateParameterReference(expr: ParameterReference, context: RuntimeContext): Value {
    const ctx = context as any;

    // Check for timeline parameters first
    if (ctx.getTimelineParameter) {
      const timelineValue = ctx.getTimelineParameter(expr.parameterName);
      if (timelineValue) {
        return timelineValue;
      }
    }

    // Get parameter value from context
    const value = context.getParameter(expr.parameterName);
    if (value !== undefined) {
      return value;
    }

    throw new Error(`Undefined parameter: ${expr.parameterName}`);
  }

  private evaluateFunctionCall(expr: FunctionCall, context: RuntimeContext): Value {
    // Special handling for aantal_dagen_in - needs unevaluated condition expression
    if (expr.functionName === 'aantal_dagen_in') {
      return this.aantal_dagen_in_special(expr, context);
    }

    // Special handling for som_van with 2 arguments (attribute path + collection)
    // Pattern: "som van de <attribute> van alle <collection>"
    if (expr.functionName === 'som_van' && expr.arguments.length === 2) {
      return this.som_van_special(expr, context);
    }

    // Special handling for maximum_van with 2 arguments (attribute path + collection)
    // Pattern: "maximale waarde van de <attribute> van alle <collection>"
    if (expr.functionName === 'maximum_van' && expr.arguments.length === 2) {
      return this.aggregation_special(expr, context, Math.max, -Infinity);
    }

    // Special handling for minimum_van with 2 arguments (attribute path + collection)
    // Pattern: "minimale waarde van de <attribute> van alle <collection>"
    if (expr.functionName === 'minimum_van' && expr.arguments.length === 2) {
      return this.aggregation_special(expr, context, Math.min, Infinity);
    }

    // Defensive check: totaal_van should be handled via TimelineExpression, not FunctionCall
    if (expr.functionName === 'totaal_van') {
      throw new Error('totaal_van should be handled via TimelineExpression. Grammar may have changed unexpectedly.');
    }

    // Special handling for aantal - needs to resolve collections from AttributeReference/Subselectie
    // Cannot evaluate arguments first because AttributeReference may not resolve to an array directly
    if (expr.functionName === 'aantal') {
      return this.aantal_special(expr, context);
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

  /**
   * Special handling for aantal function - resolves collections from AttributeReference
   * Pattern: "het aantal passagiers van de reis" -> FunctionCall("aantal", AttributeReference)
   */
  private aantal_special(expr: FunctionCall, context: RuntimeContext): Value {
    if (expr.arguments.length !== 1) {
      throw new Error('aantal expects exactly 1 argument');
    }

    const arg = expr.arguments[0];

    // Handle SubselectieExpression (filtered collection): "het aantal personen die minderjarig zijn"
    if (arg.type === 'SubselectieExpression') {
      const subselectie = arg as SubselectieExpression;
      const collection = this.resolveCollectionForAantal(subselectie.collection as AttributeReference, context);

      // Filter by predicate using evaluatePredicaat which handles KenmerkPredicaat etc.
      let count = 0;
      for (const item of collection) {
        // Set item as current instance for predicate evaluation
        const previousInstance = (context as any).current_instance;
        (context as any).current_instance = item;
        try {
          // Use evaluatePredicaat which properly handles KenmerkPredicaat, AttributeComparisonPredicaat
          const matches = this.evaluatePredicaat(subselectie.predicaat as Predicaat, item, context);
          if (matches) {
            count++;
          }
        } finally {
          (context as any).current_instance = previousInstance;
        }
      }
      return { type: 'number', value: count };
    }

    // Handle AttributeReference (collection lookup): "het aantal passagiers van de reis"
    if (arg.type === 'AttributeReference') {
      const attrRef = arg as AttributeReference;
      const collection = this.resolveCollectionForAantal(attrRef, context);
      return { type: 'number', value: collection.length };
    }

    // Fallback: evaluate and check if array
    const evaluated = this.evaluate(arg, context);
    if (evaluated.type === 'array') {
      return { type: 'number', value: (evaluated.value as Value[]).length };
    }
    if (evaluated.type === 'list') {
      return { type: 'number', value: (evaluated.value as Value[]).length };
    }

    throw new Error(`aantal expects a collection argument, got ${arg.type}`);
  }

  /**
   * Resolve a collection reference for aantal function
   * Handles object type lookups, FeitType navigation, variable lookups, and attribute references
   */
  private resolveCollectionForAantal(ref: AttributeReference, context: RuntimeContext): Value[] {
    const path = ref.path;

    // Single element: might be object type name, role alias, or variable
    if (path.length === 1) {
      const typeName = path[0];

      // First try as a variable (handles test cases with context.setVariable('personen', {...}))
      const variable = (context as any).getVariable(typeName);
      if (variable && (variable.type === 'array' || variable.type === 'list')) {
        return variable.value as Value[];
      }

      // Try as object type name
      const objects = (context as any).getObjectsByType(typeName);
      if (objects && objects.length > 0) {
        return objects;
      }

      // Try FeitType navigation from current instance
      if ((context as any).current_instance) {
        const related = (context as any).getRelatedObjects(
          (context as any).current_instance,
          typeName,
          true  // as subject
        );
        if (related && related.length > 0) {
          return related;
        }
      }
    }

    // Two elements: navigation pattern like ["reis", "passagiers"]
    if (path.length === 2) {
      const [contextRef, roleName] = path;

      // Get the context object (e.g., "reis" -> current flight)
      let contextObj: Value | undefined;

      // Check if it's a reference to current instance's attribute
      if ((context as any).current_instance) {
        const currentAttrs = ((context as any).current_instance as any).value || {};
        if (currentAttrs[contextRef]) {
          contextObj = currentAttrs[contextRef];
        }
      }

      // If not found, try to resolve as object type
      if (!contextObj) {
        const objects = (context as any).getObjectsByType(contextRef);
        if (objects && objects.length === 1) {
          contextObj = objects[0];
        }
      }

      // Now get related objects via FeitType
      if (contextObj) {
        const related = (context as any).getRelatedObjects(contextObj, roleName, true);
        if (related && related.length > 0) {
          return related;
        }
        // Also try as object (in relationship)
        const relatedAsObject = (context as any).getRelatedObjects(contextObj, roleName, false);
        if (relatedAsObject && relatedAsObject.length > 0) {
          return relatedAsObject;
        }
      }
    }

    // Try direct evaluation as fallback
    try {
      const evaluated = this.evaluateAttributeReference(ref, context);
      if (evaluated.type === 'array') {
        return evaluated.value as Value[];
      }
      if (evaluated.type === 'list') {
        return evaluated.value as Value[];
      }
    } catch (e) {
      // Ignore evaluation errors and return empty collection
    }

    return [];
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

  /**
   * Special handling for som_van with 2 arguments:
   * Pattern: "som van de <attribute> van alle <collection>"
   * arg[0] = attribute path to extract from each item
   * arg[1] = collection path to iterate
   */
  private som_van_special(expr: FunctionCall, context: RuntimeContext): Value {
    const attrArg = expr.arguments[0];
    const collectionArg = expr.arguments[1];

    // First evaluate the collection argument
    const collectionValue = this.evaluate(collectionArg, context);

    if (collectionValue.type !== 'array') {
      // If collection is a single object, wrap it in an array
      const items = collectionValue.type === 'object' ? [collectionValue] : [];
      if (items.length === 0) {
        return { type: 'number', value: 0 };
      }
    }

    const items = (collectionValue.type === 'array'
      ? collectionValue.value
      : [collectionValue]) as Value[];

    // Extract the attribute name from the first argument
    let attrName: string;
    if (attrArg.type === 'AttributeReference') {
      attrName = (attrArg as AttributeReference).path[
        (attrArg as AttributeReference).path.length - 1
      ];
    } else if (attrArg.type === 'VariableReference') {
      attrName = (attrArg as VariableReference).variableName;
    } else {
      throw new Error(`som_van expects AttributeReference or VariableReference as first arg, got ${attrArg.type}`);
    }

    // Sum the attribute values from each item
    let sum = 0;
    for (const item of items) {
      if (item.type === 'object') {
        const objData = item.value as Record<string, Value>;
        let attrValue = objData[attrName];

        // Try alternate names (with underscores, normalized)
        if (attrValue === undefined) {
          const altName = attrName.replace(/\s+/g, '_');
          attrValue = objData[altName];
        }
        if (attrValue === undefined) {
          const altName = attrName.replace(/_/g, ' ');
          attrValue = objData[altName];
        }

        if (attrValue !== undefined && attrValue.type === 'number') {
          sum += attrValue.value as number;
        }
        // If attribute is null/undefined, treat as 0 (graceful handling)
      }
    }

    return { type: 'number', value: sum };
  }

  /**
   * Generic aggregation handling for min/max patterns with 2 arguments:
   * arg[0] = attribute path to extract from each item
   * arg[1] = collection path to iterate
   */
  private aggregation_special(
    expr: FunctionCall,
    context: RuntimeContext,
    reducer: (...values: number[]) => number,
    initialValue: number
  ): Value {
    const attrArg = expr.arguments[0];
    const collectionArg = expr.arguments[1];

    // First evaluate the collection argument
    const collectionValue = this.evaluate(collectionArg, context);

    const items = (collectionValue.type === 'array'
      ? collectionValue.value
      : [collectionValue]) as Value[];

    // Extract the attribute name from the first argument
    let attrName: string;
    if (attrArg.type === 'AttributeReference') {
      attrName = (attrArg as AttributeReference).path[
        (attrArg as AttributeReference).path.length - 1
      ];
    } else if (attrArg.type === 'VariableReference') {
      attrName = (attrArg as VariableReference).variableName;
    } else {
      throw new Error(`Aggregation expects AttributeReference or VariableReference as first arg, got ${attrArg.type}`);
    }

    // Aggregate the attribute values from each item
    let result = initialValue;
    for (const item of items) {
      if (item.type === 'object') {
        const objData = item.value as Record<string, Value>;
        let attrValue = objData[attrName];

        // Try alternate names (with underscores, normalized)
        if (attrValue === undefined) {
          const altName = attrName.replace(/\s+/g, '_');
          attrValue = objData[altName];
        }
        if (attrValue === undefined) {
          const altName = attrName.replace(/_/g, ' ');
          attrValue = objData[altName];
        }

        // Try singular form (Dutch plural endings: -en, -s)
        // e.g., "leeftijden" → "leeftijd"
        if (attrValue === undefined) {
          const singularName = this.singularize(attrName);
          if (singularName !== attrName) {
            attrValue = objData[singularName];
          }
        }

        if (attrValue !== undefined && attrValue.type === 'number') {
          result = reducer(result, attrValue.value as number);
        }
      }
    }

    // Return 0 if no values found
    return {
      type: 'number',
      value: result === initialValue ? 0 : result
    };
  }

  /**
   * Convert Dutch plural noun to singular.
   * Handles common Dutch plural endings:
   * - "-en" suffix (leeftijden → leeftijd)
   * - "-s" suffix (items → item)
   */
  private singularize(word: string): string {
    if (word.endsWith('en') && word.length > 3) {
      return word.slice(0, -2);
    }
    if (word.endsWith('s') && word.length > 2) {
      return word.slice(0, -1);
    }
    return word;
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

  private maximum_van(args: Value[]): Value {
    // Maximum aggregation - should receive an array of values
    if (args.length !== 1) {
      throw new Error('maximum_van expects exactly 1 argument (an array of values)');
    }

    const arg = args[0];
    if (arg.type !== 'array') {
      throw new Error(`maximum_van expects an array argument, got ${arg.type}`);
    }

    const values = arg.value as Value[];
    let maxValue = -Infinity;

    for (const val of values) {
      if (val.type === 'number') {
        maxValue = Math.max(maxValue, val.value as number);
      }
    }

    return {
      type: 'number',
      value: maxValue === -Infinity ? 0 : maxValue
    };
  }

  private minimum_van(args: Value[]): Value {
    // Minimum aggregation - should receive an array of values
    if (args.length !== 1) {
      throw new Error('minimum_van expects exactly 1 argument (an array of values)');
    }

    const arg = args[0];
    if (arg.type !== 'array') {
      throw new Error(`minimum_van expects an array argument, got ${arg.type}`);
    }

    const values = arg.value as Value[];
    let minValue = Infinity;

    for (const val of values) {
      if (val.type === 'number') {
        minValue = Math.min(minValue, val.value as number);
      }
    }

    return {
      type: 'number',
      value: minValue === Infinity ? 0 : minValue
    };
  }

  private maximum_van_values(args: Value[]): Value {
    // Maximum of explicit values: "de maximale waarde van a, b en c"
    if (args.length < 2) {
      throw new Error('maximum_van_values expects at least 2 arguments');
    }

    let maxValue = -Infinity;
    for (const val of args) {
      if (val.type === 'number') {
        maxValue = Math.max(maxValue, val.value as number);
      }
    }

    return {
      type: 'number',
      value: maxValue === -Infinity ? 0 : maxValue
    };
  }

  private minimum_van_values(args: Value[]): Value {
    // Minimum of explicit values: "de minimale waarde van a, b en c"
    if (args.length < 2) {
      throw new Error('minimum_van_values expects at least 2 arguments');
    }

    let minValue = Infinity;
    for (const val of args) {
      if (val.type === 'number') {
        minValue = Math.min(minValue, val.value as number);
      }
    }

    return {
      type: 'number',
      value: minValue === Infinity ? 0 : minValue
    };
  }

  // totaal_van method removed - handled via TimelineExpression in timeline-evaluator
  // tijdsevenredig_deel method removed - handled via TimelineExpression in timeline-evaluator

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

  /**
   * Add or subtract a time unit from a date.
   * Ports Python's _add_time_to_date (engine.py:5316-5398)
   */
  private addTimeToDate(dateVal: Value, timeVal: Value, subtract: boolean, context: RuntimeContext): Value {
    if (dateVal.value === null || dateVal.value === undefined) {
      return { type: 'date', value: null };
    }

    if (timeVal.value === null || timeVal.value === undefined) {
      return dateVal;
    }

    const date = dateVal.value as Date;
    const amount = this.toNumber(timeVal) || 0;
    // Handle both string unit and Unit object
    const unitName = typeof timeVal.unit === 'string' ? timeVal.unit : timeVal.unit?.name;
    const multiplier = subtract ? -1 : 1;

    let newDate = new Date(date);

    switch (unitName) {
      case 'jaren':
      case 'jaar':
      case 'jr':
        newDate.setFullYear(date.getFullYear() + amount * multiplier);
        break;

      case 'maanden':
      case 'maand':
      case 'mnd':
        newDate.setMonth(date.getMonth() + amount * multiplier);
        break;

      case 'weken':
      case 'week':
        newDate.setDate(date.getDate() + (amount * 7 * multiplier));
        break;

      case 'dagen':
      case 'dag':
      case 'dg':
        newDate.setDate(date.getDate() + amount * multiplier);
        break;

      case 'uren':
      case 'uur':
      case 'u':
        newDate.setHours(date.getHours() + amount * multiplier);
        break;

      case 'minuten':
      case 'minuut':
        newDate.setMinutes(date.getMinutes() + amount * multiplier);
        break;

      case 'seconden':
      case 'seconde':
      case 's':
        newDate.setSeconds(date.getSeconds() + amount * multiplier);
        break;

      case 'milliseconden':
      case 'milliseconde':
      case 'ms':
        newDate.setMilliseconds(date.getMilliseconds() + amount * multiplier);
        break;

      default:
        // Default to days
        newDate.setDate(date.getDate() + amount * multiplier);
    }

    return { type: 'date', value: newDate };
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
        getEvaluationDate: function () { return new Date(currentDate); },
        setEvaluationDate: function (date: Date) { /* no-op for temp context */ },
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

    // Clean the role name for comparison (remove articles AND possessives)
    const roleNameClean = roleName.toLowerCase().replace(/^(de|het|een|zijn|haar|hun)\s+/, '').trim();

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
            // Use flexible matching: parser may include cardinality text in objectType
            // e.g., "Natuurlijk persoon één reis betreft" instead of just "Natuurlijk persoon"
            const otherObjType = otherRol.objectType || '';
            const otherObjTypeClean = otherObjType.toLowerCase().trim();
            const fromObjTypeClean = fromObjType.toLowerCase().trim();

            if (otherObjTypeClean === fromObjTypeClean ||
              otherObjTypeClean.startsWith(fromObjTypeClean) ||
              fromObjTypeClean.startsWith(otherObjTypeClean)) {
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
        // Try the timeline lookup with multiple name variations
        const namesToTry = [attrName, attr];

        // If no spaces/underscores in attr, it may be a concatenated name
        // Try to find matching timeline attribute via flexible lookup
        if (ctxAny.getTimelineAttributeNames) {
          const normalizedAttr = attr.replace(/[\s_-]/g, '').toLowerCase();
          const timelineAttrNames = ctxAny.getTimelineAttributeNames(
            currentInstance.objectType,
            currentInstance.objectId
          ) || [];
          for (const tlAttrName of timelineAttrNames) {
            const normalizedTlName = tlAttrName.replace(/[\s_-]/g, '').toLowerCase();
            if (normalizedTlName === normalizedAttr && !namesToTry.includes(tlAttrName)) {
              namesToTry.push(tlAttrName);
            }
          }
        }

        for (const nameToTry of namesToTry) {
          const timelineValue = ctxAny.getTimelineAttribute(
            currentInstance.objectType,
            currentInstance.objectId,
            nameToTry,
            ctxAny.evaluation_date
          );
          if (timelineValue !== null && timelineValue !== undefined) {
            return timelineValue;
          }
        }
      }

      // Fall back to regular object attributes
      const objectData = currentInstance.value as Record<string, Value> | Record<string, any>;
      let val = (objectData as any)[attrName] || (objectData as any)[attr];

      // If not found, try flexible matching for concatenated attribute names
      // E.g., "belastingopbasisvanafstand" should match "belasting op basis van afstand"
      if (val === undefined) {
        const normalizedAttr = attr.replace(/[\s_-]/g, '').toLowerCase();
        for (const key of Object.keys(objectData)) {
          const normalizedKey = key.replace(/[\s_-]/g, '').toLowerCase();
          if (normalizedKey === normalizedAttr) {
            val = (objectData as any)[key];
            break;
          }
        }
      }

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
      const ctx = context as any;

      // First try to resolve objectRef as a FeitType role name that maps to current_instance
      // This handles patterns like "alle passagiers van de reis" where "reis" is a role
      // that maps to Vlucht (the current instance type)
      let objectValue: Value | null = null;

      if (ctx.current_instance && ctx.current_instance.type === 'object') {
        const currentObjType = (ctx.current_instance.objectType || '').toLowerCase();
        const objectRefClean = objectRef.toLowerCase().replace(/^(de|het|een)\s+/, '').trim();

        // Check if objectRef is a role name in any FeitType that maps to current_instance's type
        const feittypen = ctx.getAllFeittypen ? ctx.getAllFeittypen() : [];
        for (const feittype of feittypen) {
          if (!feittype.rollen) continue;

          for (const rol of feittype.rollen) {
            const rolNaamClean = rol.naam.toLowerCase().replace(/^(de|het|een)\s+/, '').trim();
            const rolObjType = (rol.objectType || '').toLowerCase().trim();

            // Check if the role name matches objectRef AND the role's objectType matches current_instance
            if (rolNaamClean === objectRefClean &&
              (rolObjType === currentObjType ||
                rolObjType.startsWith(currentObjType) ||
                currentObjType.startsWith(rolObjType))) {
              // Role matches current_instance - use current_instance as the object
              objectValue = ctx.current_instance;
              break;
            }
          }
          if (objectValue) break;
        }
      }

      // If no role match found, fall back to variable lookup
      if (!objectValue) {
        objectValue = this.evaluateVariableReference({
          type: 'VariableReference',
          variableName: objectRef
        } as VariableReference, context);
      }

      if (objectValue.type !== 'object') {
        throw new Error(`Expected object but got ${objectValue.type}`);
      }

      // Find related objects through Feittype relationships
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

      // Check if the first element matches current_instance.objectType
      // This handles paths like ["Vlucht", "passagiers"] when current_instance is a Vlucht
      const ctx = context as any;
      if (ctx.current_instance && ctx.current_instance.type === 'object') {
        const currentObjType = ctx.current_instance.objectType;
        if (currentObjType && objectName.toLowerCase() === currentObjType.toLowerCase()) {
          // First element matches current instance type - get attribute from current instance
          const instanceData = ctx.current_instance.value as Record<string, Value>;

          // Check if it's a direct attribute
          const directAttr = instanceData[attribute];
          if (directAttr !== undefined) {
            return directAttr;
          }

          // Try FeitType relationship navigation from current instance
          const relatedObjects = this.findRelatedObjectsThroughFeittype(attribute, ctx.current_instance, ctx);
          if (relatedObjects && relatedObjects.length > 0) {
            return { type: 'array', value: relatedObjects };
          }
          // Attribute/relationship not found - return empty array for graceful degradation
          // This allows aggregation functions like `aantal` to work correctly with empty collections
          return { type: 'array', value: [] };
        }
      }

      // Check if this is a pronoun-based navigation like ["zijn product", "attribute"]
      // Python pattern: first check direct attribute, then Feittype relationship
      if (objectName.startsWith('zijn ') || objectName.startsWith('haar ')) {
        const roleName = objectName.substring(5); // Remove "zijn " or "haar " prefix

        if (ctx.current_instance && ctx.current_instance.type === 'object') {
          const instanceData = ctx.current_instance.value as Record<string, Value>;

          // FIRST: Check if roleName is a direct attribute on current_instance (Python engine.py:2254-2258)
          // This handles cases like "zijn product" where product is an embedded object attribute
          const directAttr = instanceData[roleName];
          if (directAttr !== undefined && directAttr !== null) {
            // If the attribute is an object, get the nested attribute
            if (directAttr.type === 'object') {
              const nestedData = directAttr.value as Record<string, Value>;
              const attrValue = nestedData[attribute];
              if (attrValue !== undefined) {
                return attrValue;
              }
            } else if (typeof directAttr === 'object' && 'value' in directAttr) {
              // Handle wrapped object values
              const objValue = directAttr.value;
              if (objValue && typeof objValue === 'object') {
                const attrValue = (objValue as Record<string, Value>)[attribute];
                if (attrValue !== undefined) {
                  return attrValue;
                }
              }
            }
          }

          // SECOND: Try Feittype relationship navigation as fallback
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

      // Use resolveNavigationPath for all navigation, even simple 2-element paths
      // This ensures consistent navigation behavior
      const { resolveNavigationPath } = require('../utils/navigation');
      const navResult = resolveNavigationPath(expr.path, context);

      if (navResult.error) {
        // Check for Feittype relationships as a fallback
        const objectValue = context.getVariable(objectName);
        if (objectValue && objectValue.type === 'object') {
          const relatedObjects = this.findRelatedObjectsThroughFeittype(attribute, objectValue, context);
          if (relatedObjects) {
            return {
              type: 'array',
              value: relatedObjects
            };
          }
        }
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

      // Try the attribute name as-is first
      let value = objectData[navResult.attributeName];
      let effectiveAttrName = navResult.attributeName;

      // If not found, try stripping "in X" unit suffix (e.g., "reisduur per trein in minuten" → "reisduur per trein")
      if (value === undefined) {
        const { name: strippedName, unit } = stripUnitSuffix(navResult.attributeName);
        if (strippedName !== navResult.attributeName) {
          value = objectData[strippedName];
          effectiveAttrName = strippedName;
        }
      }

      // If attribute not found directly, try FeitType relationship navigation
      if (value === undefined) {
        const relatedObjects = this.findRelatedObjectsThroughFeittype(
          effectiveAttrName, navResult.targetObject, context
        );
        if (relatedObjects && relatedObjects.length > 0) {
          // Always return array for FeitType relationships to support aggregation
          value = { type: 'array', value: relatedObjects };
        }
      }

      if (value === undefined) {
        throw new Error(`Attribute '${navResult.attributeName}' not found on object`);
      }

      return value;
    }

    // Handle simple single-element paths as variable references
    if (expr.path.length === 1) {
      const variableName = expr.path[0];

      // Check if this is a pronoun-based navigation like "zijn product"
      // Python pattern: first check direct attribute, then Feittype relationship
      if (variableName.startsWith('zijn ') || variableName.startsWith('haar ')) {
        const roleName = variableName.substring(5); // Remove pronoun prefix
        const ctx = context as any;

        if (ctx.current_instance && ctx.current_instance.type === 'object') {
          const instanceData = ctx.current_instance.value as Record<string, Value>;

          // FIRST: Check if roleName is a direct attribute on current_instance
          const directAttr = instanceData[roleName];
          if (directAttr !== undefined && directAttr !== null) {
            return directAttr;
          }

          // SECOND: Try Feittype relationship navigation as fallback
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

        // Handle "self" as a reference to current_instance
        if (variableName === 'self' || variableName === 'hij' || variableName === 'zij') {
          return currentInstance;
        }

        if (currentInstance.type === 'object' && currentInstance.objectType) {
          // Check if the variable name matches the object type (case-insensitive)
          if (variableName.toLowerCase() === currentInstance.objectType.toLowerCase()) {
            return currentInstance;
          }
        }

        // Check if this is an attribute on current_instance
        if (currentInstance.type === 'object' && currentInstance.value) {
          const instanceData = currentInstance.value as Record<string, Value>;
          const attrValue = instanceData[variableName];
          if (attrValue !== undefined && attrValue !== null) {
            return attrValue;
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
    // Handle projection case: when collection is AttributeReference with multi-segment path
    // e.g., path=["personen", "belasting"] means: get "personen", filter them, project "belasting"
    const collection = expr.collection as any;
    if (collection.type === 'AttributeReference' && collection.path && collection.path.length > 1) {
      // Split: collection path (all but last) and attribute to project (last)
      const collectionPath = collection.path.slice(0, -1);
      const attributeToProject = collection.path[collection.path.length - 1];

      // Evaluate just the collection path to get the array of objects
      const collectionRef = {
        type: 'AttributeReference',
        path: collectionPath
      };
      const collectionValue = this.evaluate(collectionRef as any, context);

      // Check if it's an array
      if (collectionValue.type !== 'array') {
        throw new Error(`Cannot filter non-array type: ${collectionValue.type}`);
      }

      const items = collectionValue.value as Value[];

      // Filter the items based on the predicaat
      const filteredItems = items.filter(item => {
        if (expr.predicate) {
          return this.predicateEvaluator.evaluate(expr.predicate, item, context);
        }
        return this.evaluatePredicaat(expr.predicaat, item, context);
      });

      // Project: extract the attribute value from each filtered object
      const projectedValues: Value[] = [];
      for (const item of filteredItems) {
        if (item.type === 'object') {
          const objectData = item.value as Record<string, Value>;
          const attrValue = objectData[attributeToProject];
          // Filter out null/undefined values (matches Python's behavior)
          if (attrValue !== undefined && attrValue !== null &&
            !(attrValue.type === 'null' || attrValue.value === null)) {
            projectedValues.push(attrValue);
          }
        }
      }

      return {
        type: 'array',
        value: projectedValues
      };
    }

    // Standard case: evaluate collection directly (no projection needed)
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
    const itemAny = item as any;

    // Check if the kenmerk exists and is true
    const kenmerkKey = `is ${predicaat.kenmerk}`;

    // First check object attributes (legacy path)
    const kenmerkValue = objectData[kenmerkKey];
    if (kenmerkValue && kenmerkValue.type === 'boolean') {
      return kenmerkValue.value as boolean;
    }

    // Fallback: check the separate kenmerken dict (added in getObjectsByType)
    const kenmerken = itemAny.kenmerken as Record<string, boolean> | undefined;
    if (kenmerken) {
      // Try with 'is ' prefix
      if (kenmerken[kenmerkKey] !== undefined) {
        return kenmerken[kenmerkKey];
      }

      // Try without prefix (for bezittelijk kenmerken like "recht op duurzaamheidskorting")
      if (kenmerken[predicaat.kenmerk] !== undefined) {
        return kenmerken[predicaat.kenmerk];
      }

      // Try normalized matching (handles case differences)
      const normalizedKey = predicaat.kenmerk.toLowerCase();
      for (const [storedKey, storedValue] of Object.entries(kenmerken)) {
        const storedNormalized = storedKey.toLowerCase()
          .replace(/^(is|heeft)\s+/, '')
          .replace(/^(de|het|een)\s+/, '');
        if (storedNormalized === normalizedKey) {
          return storedValue;
        }
      }
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

  private datum_met(args: Value[]): Value {
    // Constructs a date from year, month, day components
    if (args.length !== 3) {
      throw new Error(`Function 'datum_met' expects 3 arguments, got ${args.length}`);
    }

    const year = args[0];
    const month = args[1];
    const day = args[2];

    if (year.type !== 'number' || month.type !== 'number' || day.type !== 'number') {
      throw new Error(`Function 'datum_met' requires 3 numeric arguments`);
    }

    const yearVal = year.value as number;
    const monthVal = month.value as number;
    const dayVal = day.value as number;

    // Construct date - JavaScript months are 0-indexed
    const date = new Date(yearVal, monthVal - 1, dayVal);

    // Validate the date is valid (JavaScript Date auto-adjusts invalid dates)
    if (date.getFullYear() !== yearVal ||
        date.getMonth() !== monthVal - 1 ||
        date.getDate() !== dayVal) {
      throw new Error(`Invalid date: ${yearVal}-${monthVal}-${dayVal}`);
    }

    return { type: 'date', value: date };
  }

  /**
   * Evaluate a TekstreeksExpression (string interpolation).
   * Concatenates text parts with evaluated expression parts.
   */
  private evaluateTekstreeksExpression(
    expr: { parts: Array<{type: string; text?: string; expression?: Expression}> },
    context: RuntimeContext
  ): Value {
    let result = '';

    for (const part of expr.parts) {
      if (part.type === 'TekstreeksText') {
        result += part.text || '';
      } else if (part.type === 'TekstreeksInterpolation') {
        const value = this.evaluate(part.expression!, context);
        result += this.formatValueForInterpolation(value);
      }
    }

    return { type: 'string', value: result };
  }

  /**
   * Format a value for string interpolation.
   * Handles type-specific formatting (Dutch conventions).
   */
  private formatValueForInterpolation(value: Value): string {
    if (value.type === 'null' || value.value === null || value.value === undefined) {
      return '';
    }
    if (value.type === 'number') {
      // Dutch decimal: . → ,
      return String(value.value).replace('.', ',');
    }
    if (value.type === 'date') {
      const d = value.value as Date;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }
    if (value.type === 'boolean') {
      return value.value ? 'waar' : 'onwaar';
    }
    return String(value.value);
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
    // Prefer legacy evaluation when voorwaarden array is available
    // The predicate evaluator has issues with certain patterns (e.g., "hij is een passagier" parsed as self == true)
    if (voorwaarde.voorwaarden && voorwaarde.voorwaarden.length > 0) {
      // Legacy evaluation - evaluate each condition and count how many are true
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
      const kwantType = String(voorwaarde.kwantificatie?.type || 'alle');

      if (kwantType === 'alle' || kwantType === QuantifierType.ALLE) {
        // All conditions must be true
        finalResult = conditionsMetCount === totalConditions;
      } else if (kwantType === 'geen' || kwantType === QuantifierType.GEEN) {
        // No conditions can be true
        finalResult = conditionsMetCount === 0;
      } else if (kwantType === 'ten_minste' || kwantType === QuantifierType.TEN_MINSTE) {
        // At least n conditions must be true
        const aantal = voorwaarde.kwantificatie?.aantal ?? 1;
        finalResult = conditionsMetCount >= aantal;
      } else if (kwantType === 'ten_hoogste' || kwantType === QuantifierType.TEN_HOOGSTE) {
        // At most n conditions must be true
        const aantal = voorwaarde.kwantificatie?.aantal ?? 1;
        finalResult = conditionsMetCount <= aantal;
      } else if (kwantType === 'precies' || kwantType === QuantifierType.PRECIES) {
        // Exactly n conditions must be true
        const aantal = voorwaarde.kwantificatie?.aantal ?? 1;
        finalResult = conditionsMetCount === aantal;
      }

      return {
        type: 'boolean',
        value: finalResult
      };
    }

    // Use unified predicate if available and no voorwaarden
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
      case QuantifierType.ALLE:
        // All conditions must be true
        finalResult = conditionsMetCount === totalConditions;
        break;

      case QuantifierType.GEEN:
        // No conditions can be true
        finalResult = conditionsMetCount === 0;
        break;

      case QuantifierType.TEN_MINSTE:
        // At least n conditions must be true
        if (voorwaarde.kwantificatie.aantal === undefined) {
          throw new Error('TEN_MINSTE quantifier requires a number');
        }
        finalResult = conditionsMetCount >= voorwaarde.kwantificatie.aantal;
        break;

      case QuantifierType.TEN_HOOGSTE:
        // At most n conditions must be true
        if (voorwaarde.kwantificatie.aantal === undefined) {
          throw new Error('TEN_HOOGSTE quantifier requires a number');
        }
        finalResult = conditionsMetCount <= voorwaarde.kwantificatie.aantal;
        break;

      case QuantifierType.PRECIES:
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

    // Easter-based movable holidays
    const easter = this.calculateEasterSunday(year);
    const easterTime = easter.getTime();
    const dateTime = date.getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    // Good Friday (Goede Vrijdag) - 2 days before Easter
    if (dateTime === easterTime - 2 * dayMs) return true;

    // Easter Sunday (Eerste Paasdag)
    if (dateTime === easterTime) return true;

    // Easter Monday (Tweede Paasdag) - 1 day after Easter
    if (dateTime === easterTime + 1 * dayMs) return true;

    // Ascension Day (Hemelvaartsdag) - 39 days after Easter
    if (dateTime === easterTime + 39 * dayMs) return true;

    // Whit Sunday (Eerste Pinksterdag) - 49 days after Easter
    if (dateTime === easterTime + 49 * dayMs) return true;

    // Whit Monday (Tweede Pinksterdag) - 50 days after Easter
    if (dateTime === easterTime + 50 * dayMs) return true;

    return false;
  }

  /**
   * Calculate Easter Sunday date for a given year.
   * Uses Anonymous Gregorian algorithm (Meeus/Jones/Butcher).
   */
  private calculateEasterSunday(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  // --- Built-in functions: eerste_van, laatste_van, eerste_paasdag_van ---

  /**
   * Return the first non-null value from the arguments.
   * Mirrors Python's eerste_van function.
   */
  private eerste_van(args: Value[]): Value {
    for (const arg of args) {
      if (arg.value !== null && arg.value !== undefined) {
        return arg;
      }
    }
    return { type: 'null', value: null };
  }

  /**
   * Return the last non-null value from the arguments.
   * Mirrors Python's laatste_van function.
   */
  private laatste_van(args: Value[]): Value {
    for (let i = args.length - 1; i >= 0; i--) {
      if (args[i].value !== null && args[i].value !== undefined) {
        return args[i];
      }
    }
    return { type: 'null', value: null };
  }

  /**
   * Calculate Easter date for a given year.
   * Uses the shared calculateEasterSunday helper.
   */
  private eerste_paasdag_van(args: Value[]): Value {
    if (args.length !== 1) {
      throw new Error('eerste_paasdag_van expects exactly 1 argument (year)');
    }

    const yearArg = args[0];
    if (yearArg.type !== 'number') {
      throw new Error('eerste_paasdag_van expects a numeric year');
    }

    return {
      type: 'date',
      value: this.calculateEasterSunday(yearArg.value as number)
    };
  }

  // --- Expression evaluators: Afronding, Begrenzing, BegrenzingAfronding ---

  /**
   * Evaluate rounding expression (afronding).
   * Handles patterns like "naar beneden afgerond op 0 decimalen"
   */
  private evaluateAfrondingExpression(expr: any, context: RuntimeContext): Value {
    const innerValue = this.evaluate(expr.expression, context);
    const decimals = expr.decimals ?? 0;
    const direction = expr.direction as string | undefined;

    const numValue = this.toNumber(innerValue);
    if (numValue === null) return innerValue;

    const factor = Math.pow(10, decimals);
    let result: number;

    // Handle both Dutch direction names from visitor and English for backwards compatibility
    if (direction === 'down' || direction === 'naar_beneden') {
      result = Math.floor(numValue * factor) / factor;
    } else if (direction === 'up' || direction === 'naar_boven') {
      result = Math.ceil(numValue * factor) / factor;
    } else if (direction === 'richting_nul') {
      // Round towards zero (truncate)
      result = Math.trunc(numValue * factor) / factor;
    } else if (direction === 'weg_van_nul') {
      // Round away from zero
      result = (numValue >= 0 ? Math.ceil(numValue * factor) : Math.floor(numValue * factor)) / factor;
    } else {
      // Default (rekenkundig or undefined): standard rounding
      result = Math.round(numValue * factor) / factor;
    }

    return {
      ...innerValue,
      value: result
    };
  }

  /**
   * Evaluate bounding expression (begrenzing).
   * Handles patterns like "met een minimum van 0 €"
   */
  private evaluateBegrenzingExpression(expr: any, context: RuntimeContext): Value {
    const innerValue = this.evaluate(expr.expression, context);
    const numValue = this.toNumber(innerValue);
    if (numValue === null) return innerValue;

    let result = numValue;

    if (expr.minimum !== undefined) {
      const minVal = this.toNumber(this.evaluate(expr.minimum, context));
      if (minVal !== null && result < minVal) result = minVal;
    }

    if (expr.maximum !== undefined) {
      const maxVal = this.toNumber(this.evaluate(expr.maximum, context));
      if (maxVal !== null && result > maxVal) result = maxVal;
    }

    return {
      ...innerValue,
      value: result
    };
  }

  /**
   * Evaluate combined bounding and rounding expression.
   * Handles patterns like "met een minimum van 0 € naar beneden afgerond op 0 decimalen"
   */
  private evaluateBegrenzingAfrondingExpression(expr: any, context: RuntimeContext): Value {
    // Apply begrenzing first
    const bounded = this.evaluateBegrenzingExpression({
      expression: expr.expression,
      minimum: expr.minimum,
      maximum: expr.maximum
    }, context);

    // Apply afronding directly on the bounded Value (avoid re-evaluation which loses type info)
    const numValue = this.toNumber(bounded);
    if (numValue === null) return bounded;

    const decimals = expr.decimals ?? 0;
    const direction = expr.direction as string | undefined;
    const factor = Math.pow(10, decimals);
    let result: number;

    // Handle both Dutch direction names from visitor and English for backwards compatibility
    if (direction === 'down' || direction === 'naar_beneden') {
      result = Math.floor(numValue * factor) / factor;
    } else if (direction === 'up' || direction === 'naar_boven') {
      result = Math.ceil(numValue * factor) / factor;
    } else if (direction === 'richting_nul') {
      result = Math.trunc(numValue * factor) / factor;
    } else if (direction === 'weg_van_nul') {
      result = (numValue >= 0 ? Math.ceil(numValue * factor) : Math.floor(numValue * factor)) / factor;
    } else {
      result = Math.round(numValue * factor) / factor;
    }

    // Preserve type and unit from bounded value
    return {
      ...bounded,
      value: result
    };
  }

  /**
   * Helper to convert Value to number, or return null if not numeric.
   */
  private toNumber(value: Value): number | null {
    if (value.type === 'number' && typeof value.value === 'number') {
      return value.value;
    }
    return null;
  }

  /**
   * Evaluate a DisjunctionExpression (values connected by "of").
   * Returns an array of the evaluated values, or extracts string values from location if values array is empty.
   */
  private evaluateDisjunctionExpression(expr: any, context: RuntimeContext): Value {
    // If values array is populated, evaluate each value
    if (expr.values && expr.values.length > 0) {
      const evaluatedValues: Value[] = [];
      for (const val of expr.values) {
        evaluatedValues.push(this.evaluate(val, context));
      }
      return { type: 'array', value: evaluatedValues };
    }

    // If values array is empty but we have location, try to extract strings from source
    // This handles the parser bug where DisjunctionExpression values aren't captured
    if (expr.location && (context as any).sourceText) {
      const sourceText = (context as any).sourceText as string;
      const lines = sourceText.split('\n');
      const line = lines[expr.location.startLine - 1];
      if (line) {
        const cellText = line.substring(expr.location.startColumn - 1, expr.location.endColumn);
        // Extract quoted strings from the cell text
        const stringMatches = cellText.match(/'[^']+'/g);
        if (stringMatches && stringMatches.length > 0) {
          const values: Value[] = stringMatches.map(s => ({
            type: 'string' as const,
            value: s.replace(/'/g, '')
          }));
          return { type: 'array', value: values };
        }
      }
    }

    // Fallback: return empty array
    return { type: 'array', value: [] };
  }

  /**
   * Evaluate a ConjunctionExpression (values connected by "en").
   * Returns an array of the evaluated values.
   */
  private evaluateConjunctionExpression(expr: any, context: RuntimeContext): Value {
    if (expr.values && expr.values.length > 0) {
      const evaluatedValues: Value[] = [];
      for (const val of expr.values) {
        evaluatedValues.push(this.evaluate(val, context));
      }
      return { type: 'array', value: evaluatedValues };
    }
    return { type: 'array', value: [] };
  }
}