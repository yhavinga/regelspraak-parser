/**
 * Centralized predicate evaluator
 * Single source of truth for all predicate evaluation logic
 */

import { 
  Predicate, 
  SimplePredicate, 
  CompoundPredicate, 
  NotPredicate, 
  AttributePredicate,
  QuantifierType,
  isSimplePredicate,
  isCompoundPredicate,
  isNotPredicate,
  isAttributePredicate
} from './predicate-types';
import { Value, RuntimeContext } from '../interfaces';
import { Expression } from '../ast/expressions';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import Decimal from 'decimal.js';

export class PredicateEvaluator {
  private expressionEvaluator: ExpressionEvaluator;

  constructor(expressionEvaluator: ExpressionEvaluator) {
    this.expressionEvaluator = expressionEvaluator;
  }

  /**
   * Main entry point for predicate evaluation
   * Evaluates a predicate against a value in a given context
   */
  evaluate(predicate: Predicate, value: Value, context: RuntimeContext): boolean {
    if (isSimplePredicate(predicate)) {
      return this.evaluateSimple(predicate, value, context);
    }
    
    if (isCompoundPredicate(predicate)) {
      return this.evaluateCompound(predicate, value, context);
    }
    
    if (isNotPredicate(predicate)) {
      return !this.evaluate(predicate.predicate, value, context);
    }
    
    if (isAttributePredicate(predicate)) {
      return this.evaluateAttribute(predicate, value, context);
    }
    
    throw new Error(`Unknown predicate type: ${predicate.type}`);
  }

  /**
   * Evaluates simple predicates
   */
  private evaluateSimple(predicate: SimplePredicate, value: Value, context: RuntimeContext): boolean {
    const { operator, negated } = predicate;
    let result = false;

    switch (operator) {
      // Comparison operators
      case '==':
      case '!=':
      case '>':
      case '<':
      case '>=':
      case '<=':
        result = this.evaluateComparison(predicate, context);
        break;

      // Kenmerk check (heeft/is kenmerk)
      case 'kenmerk':
        result = this.evaluateKenmerk(predicate, value);
        break;

      // Dagsoort check (is een dagsoort)
      case 'dagsoort':
        result = this.evaluateDagsoort(predicate, value, context);
        break;

      // Elfproef validation
      case 'elfproef':
        result = this.evaluateElfproef(value);
        break;

      // Uniqueness check
      case 'uniek':
        result = this.evaluateUniek(value);
        break;

      // Numeric exact digits check
      case 'numeriek_exact':
        result = this.evaluateNumeriekExact(predicate, value);
        break;

      // Rule status checks
      case 'gevuurd':
        result = this.evaluateRegelGevuurd(predicate, context);
        break;

      case 'inconsistent':
        result = this.evaluateRegelInconsistent(predicate, context);
        break;

      default:
        throw new Error(`Unknown simple predicate operator: ${operator}`);
    }

    // Apply negation if needed
    return negated ? !result : result;
  }

  /**
   * Evaluates compound predicates with quantifiers
   */
  private evaluateCompound(predicate: CompoundPredicate, value: Value, context: RuntimeContext): boolean {
    const { quantifier, count, predicates } = predicate;
    
    // Evaluate each nested predicate
    let trueCount = 0;
    for (const nestedPredicate of predicates) {
      // Check if this is actually a predicate or an expression
      if (!nestedPredicate || typeof nestedPredicate !== 'object' || !nestedPredicate.type) {
        throw new Error('Invalid predicate in compound condition');
      }
      
      // If it's not a recognized predicate type, it's an expression that needs evaluation
      if (!isSimplePredicate(nestedPredicate) && !isCompoundPredicate(nestedPredicate) && 
          !isNotPredicate(nestedPredicate) && !isAttributePredicate(nestedPredicate)) {
        // This is an expression, not a predicate
        // Evaluate it using the expression evaluator
        const exprResult = this.expressionEvaluator.evaluate(nestedPredicate as any, context);
        
        // Strict boolean check - each condition must evaluate to boolean
        if (exprResult.type !== 'boolean') {
          throw new Error(`Compound condition element must evaluate to boolean, got ${exprResult.type}`);
        }
        
        if (exprResult.value === true) {
          trueCount++;
        }
      } else {
        // It's a proper predicate, evaluate normally
        if (this.evaluate(nestedPredicate, value, context)) {
          trueCount++;
        }
      }
    }

    // Apply quantifier logic
    switch (quantifier) {
      case QuantifierType.ALLE:
        return trueCount === predicates.length;
      
      case QuantifierType.GEEN:
        return trueCount === 0;
      
      case QuantifierType.TEN_MINSTE:
        if (count === undefined) {
          throw new Error('TEN_MINSTE requires a count');
        }
        return trueCount >= count;
      
      case QuantifierType.TEN_HOOGSTE:
        if (count === undefined) {
          throw new Error('TEN_HOOGSTE requires a count');
        }
        return trueCount <= count;
      
      case QuantifierType.PRECIES:
        if (count === undefined) {
          throw new Error('PRECIES requires a count');
        }
        return trueCount === count;
      
      default:
        throw new Error(`Unknown quantifier: ${quantifier}`);
    }
  }

  /**
   * Evaluates attribute predicates (for subselectie)
   */
  private evaluateAttribute(predicate: AttributePredicate, value: Value, context: RuntimeContext): boolean {
    // Check if value is an object
    if (value.type !== 'object') {
      return false;
    }

    // Get the attribute value
    const attrValue = value.value[predicate.attribute];
    if (!attrValue) {
      return false;
    }

    // Evaluate the comparison value
    const compValue = this.expressionEvaluator.evaluate(predicate.value, context);

    // Perform comparison
    return this.compareValues(attrValue, predicate.operator, compValue);
  }

  /**
   * Helper: Evaluate comparison predicates
   */
  private evaluateComparison(predicate: SimplePredicate, context: RuntimeContext): boolean {
    if (!predicate.left || !predicate.right) {
      throw new Error('Comparison predicate requires left and right expressions');
    }

    const leftValue = this.expressionEvaluator.evaluate(predicate.left, context);
    const rightValue = this.expressionEvaluator.evaluate(predicate.right, context);

    return this.compareValues(leftValue, predicate.operator, rightValue);
  }

  /**
   * Helper: Compare two values
   */
  private compareValues(left: Value, operator: string, right: Value): boolean {
    // Handle different value types
    if (left.type === 'number' && right.type === 'number') {
      const leftNum = new Decimal(left.value);
      const rightNum = new Decimal(right.value);

      switch (operator) {
        case '==': return leftNum.equals(rightNum);
        case '!=': return !leftNum.equals(rightNum);
        case '>': return leftNum.greaterThan(rightNum);
        case '<': return leftNum.lessThan(rightNum);
        case '>=': return leftNum.greaterThanOrEqualTo(rightNum);
        case '<=': return leftNum.lessThanOrEqualTo(rightNum);
        default: return false;
      }
    }

    if (left.type === 'string' && right.type === 'string') {
      switch (operator) {
        case '==': return left.value === right.value;
        case '!=': return left.value !== right.value;
        case '>': return left.value > right.value;
        case '<': return left.value < right.value;
        case '>=': return left.value >= right.value;
        case '<=': return left.value <= right.value;
        default: return false;
      }
    }

    if (left.type === 'boolean' && right.type === 'boolean') {
      switch (operator) {
        case '==': return left.value === right.value;
        case '!=': return left.value !== right.value;
        default: return false;
      }
    }

    if (left.type === 'date' && right.type === 'date') {
      const leftDate = new Date(left.value);
      const rightDate = new Date(right.value);
      
      switch (operator) {
        case '==': return leftDate.getTime() === rightDate.getTime();
        case '!=': return leftDate.getTime() !== rightDate.getTime();
        case '>': return leftDate > rightDate;
        case '<': return leftDate < rightDate;
        case '>=': return leftDate >= rightDate;
        case '<=': return leftDate <= rightDate;
        default: return false;
      }
    }

    // Type mismatch
    return false;
  }

  /**
   * Helper: Evaluate kenmerk predicate
   */
  private evaluateKenmerk(predicate: SimplePredicate, value: Value): boolean {
    if (!predicate.kenmerk) {
      throw new Error('Kenmerk predicate requires kenmerk property');
    }

    // Check if value is an object
    if (value.type !== 'object') {
      return false;
    }

    // Check if object has the kenmerk
    const kenmerkKey = `is ${predicate.kenmerk}`;
    const kenmerkValue = value.value[kenmerkKey];

    if (kenmerkValue && kenmerkValue.type === 'boolean') {
      return kenmerkValue.value === true;
    }

    return false;
  }

  /**
   * Helper: Evaluate dagsoort predicate
   */
  private evaluateDagsoort(predicate: SimplePredicate, value: Value, context: RuntimeContext): boolean {
    if (!predicate.dagsoort) {
      throw new Error('Dagsoort predicate requires dagsoort property');
    }

    // Check if value is a date
    if (value.type !== 'date') {
      return false;
    }

    const date = new Date(value.value);
    const dayOfWeek = date.getDay();

    // Hardcoded day type checks (to be replaced with model-driven evaluation)
    switch (predicate.dagsoort.toLowerCase()) {
      case 'werkdag':
        return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      
      case 'weekend':
        return dayOfWeek === 0 || dayOfWeek === 6; // Saturday or Sunday
      
      case 'feestdag':
        // Check Dutch holidays - simplified for now
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // King's Day (April 27), Christmas (Dec 25), New Year (Jan 1)
        return (month === 4 && day === 27) || 
               (month === 12 && day === 25) || 
               (month === 1 && day === 1);
      
      default:
        // Check custom day types from model (TODO: implement model-driven check)
        return false;
    }
  }

  /**
   * Helper: Evaluate elfproef (Dutch bank account validation)
   */
  private evaluateElfproef(value: Value): boolean {
    if (value.type !== 'string' && value.type !== 'number') {
      return false;
    }

    const str = String(value.value).replace(/\D/g, '');
    
    if (str.length !== 9 && str.length !== 10) {
      return false;
    }

    const digits = str.split('').map(Number);
    let sum = 0;

    if (digits.length === 9) {
      // 9-digit account number
      for (let i = 0; i < 9; i++) {
        sum += digits[i] * (9 - i);
      }
      return sum % 11 === 0;
    } else {
      // 10-digit account (BSN)
      for (let i = 0; i < 9; i++) {
        sum += digits[i] * (10 - i);
      }
      sum -= digits[9];
      return sum % 11 === 0;
    }
  }

  /**
   * Helper: Evaluate uniqueness
   */
  private evaluateUniek(value: Value): boolean {
    if (value.type !== 'array') {
      return false;
    }

    const seen = new Set<string>();
    for (const item of value.value) {
      const key = JSON.stringify(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
    }

    return true;
  }

  /**
   * Helper: Evaluate numeric exact digits
   */
  private evaluateNumeriekExact(predicate: SimplePredicate, value: Value): boolean {
    if (!predicate.digits) {
      throw new Error('Numeriek exact predicate requires digits property');
    }

    if (value.type !== 'number' && value.type !== 'string') {
      return false;
    }

    const str = String(value.value).replace(/[^\d]/g, '');
    return str.length === predicate.digits;
  }

  /**
   * Helper: Check if rule has been executed
   */
  private evaluateRegelGevuurd(predicate: SimplePredicate, context: RuntimeContext): boolean {
    if (predicate.subject?.type === 'Literal' && predicate.subject.valueType === 'text') {
      const regelNaam = predicate.subject.value as string;
      return (context as any).isRuleExecuted?.(regelNaam) || false;
    }
    return false;
  }

  /**
   * Helper: Check if rule is inconsistent
   */
  private evaluateRegelInconsistent(predicate: SimplePredicate, context: RuntimeContext): boolean {
    if (predicate.subject?.type === 'Literal' && predicate.subject.valueType === 'text') {
      const regelNaam = predicate.subject.value as string;
      return (context as any).isRuleInconsistent?.(regelNaam) || false;
    }
    return false;
  }
}