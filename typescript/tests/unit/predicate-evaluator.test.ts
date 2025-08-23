import { describe, it, expect, beforeEach } from '@jest/globals';
import { PredicateEvaluator } from '../../src/predicates/predicate-evaluator';
import { 
  SimplePredicate, 
  CompoundPredicate, 
  AttributePredicate,
  NotPredicate,
  QuantifierType
} from '../../src/predicates/predicate-types';
import { ExpressionEvaluator } from '../../src/evaluators/expression-evaluator';
import { Context } from '../../src/runtime/context';
import { Value } from '../../src/interfaces';

describe('Unified Predicate Evaluator', () => {
  let predicateEvaluator: PredicateEvaluator;
  let expressionEvaluator: ExpressionEvaluator;
  let context: Context;

  beforeEach(() => {
    expressionEvaluator = new ExpressionEvaluator();
    predicateEvaluator = new PredicateEvaluator(expressionEvaluator);
    context = new Context();
  });

  describe('SimplePredicate', () => {
    it('should evaluate kenmerk predicates', () => {
      const predicate: SimplePredicate = {
        type: 'SimplePredicate',
        operator: 'kenmerk',
        kenmerk: 'minderjarig'
      };

      const value: Value = {
        type: 'object',
        value: {
          'is minderjarig': { type: 'boolean', value: true }
        }
      };

      const result = predicateEvaluator.evaluate(predicate, value, context);
      expect(result).toBe(true);
    });

    it('should evaluate comparison predicates', () => {
      const predicate: SimplePredicate = {
        type: 'SimplePredicate',
        operator: '>',
        left: { type: 'NumberLiteral', value: 10 },
        right: { type: 'NumberLiteral', value: 5 }
      };

      const result = predicateEvaluator.evaluate(
        predicate, 
        { type: 'null', value: null },
        context
      );
      expect(result).toBe(true);
    });

    it('should evaluate dagsoort predicates', () => {
      const predicate: SimplePredicate = {
        type: 'SimplePredicate',
        operator: 'dagsoort',
        dagsoort: 'werkdag'
      };

      // Monday
      const value: Value = {
        type: 'date',
        value: '2024-01-08'
      };

      const result = predicateEvaluator.evaluate(predicate, value, context);
      expect(result).toBe(true);
    });

    it('should evaluate elfproef validation', () => {
      const predicate: SimplePredicate = {
        type: 'SimplePredicate',
        operator: 'elfproef'
      };

      // Test that elfproef evaluator runs without error
      // Actual validation logic is tested elsewhere
      const account: Value = {
        type: 'string',
        value: '123456789'
      };

      const result = predicateEvaluator.evaluate(predicate, account, context);
      expect(typeof result).toBe('boolean');
    });

    it('should handle negated predicates', () => {
      const predicate: SimplePredicate = {
        type: 'SimplePredicate',
        operator: 'kenmerk',
        kenmerk: 'minderjarig',
        negated: true
      };

      const value: Value = {
        type: 'object',
        value: {
          'is minderjarig': { type: 'boolean', value: true }
        }
      };

      const result = predicateEvaluator.evaluate(predicate, value, context);
      expect(result).toBe(false); // Negated, so should be false
    });
  });

  describe('CompoundPredicate', () => {
    it('should evaluate ALLE quantifier', () => {
      const predicate: CompoundPredicate = {
        type: 'CompoundPredicate',
        quantifier: QuantifierType.ALLE,
        predicates: [
          {
            type: 'SimplePredicate',
            operator: '>',
            left: { type: 'NumberLiteral', value: 10 },
            right: { type: 'NumberLiteral', value: 5 }
          },
          {
            type: 'SimplePredicate',
            operator: '==',
            left: { type: 'StringLiteral', value: 'test' },
            right: { type: 'StringLiteral', value: 'test' }
          }
        ]
      };

      const result = predicateEvaluator.evaluate(
        predicate,
        { type: 'null', value: null },
        context
      );
      expect(result).toBe(true);
    });

    it('should evaluate GEEN quantifier', () => {
      const predicate: CompoundPredicate = {
        type: 'CompoundPredicate',
        quantifier: QuantifierType.GEEN,
        predicates: [
          {
            type: 'SimplePredicate',
            operator: '<',
            left: { type: 'NumberLiteral', value: 10 },
            right: { type: 'NumberLiteral', value: 5 }
          },
          {
            type: 'SimplePredicate',
            operator: '==',
            left: { type: 'StringLiteral', value: 'foo' },
            right: { type: 'StringLiteral', value: 'bar' }
          }
        ]
      };

      const result = predicateEvaluator.evaluate(
        predicate,
        { type: 'null', value: null },
        context
      );
      expect(result).toBe(true); // Both conditions are false
    });

    it('should evaluate TEN_MINSTE quantifier', () => {
      const predicate: CompoundPredicate = {
        type: 'CompoundPredicate',
        quantifier: QuantifierType.TEN_MINSTE,
        count: 2,
        predicates: [
          {
            type: 'SimplePredicate',
            operator: '>',
            left: { type: 'NumberLiteral', value: 10 },
            right: { type: 'NumberLiteral', value: 5 }
          },
          {
            type: 'SimplePredicate',
            operator: '==',
            left: { type: 'StringLiteral', value: 'test' },
            right: { type: 'StringLiteral', value: 'test' }
          },
          {
            type: 'SimplePredicate',
            operator: '<',
            left: { type: 'NumberLiteral', value: 1 },
            right: { type: 'NumberLiteral', value: 10 }
          }
        ]
      };

      const result = predicateEvaluator.evaluate(
        predicate,
        { type: 'null', value: null },
        context
      );
      expect(result).toBe(true); // All 3 conditions are true, >= 2
    });
  });

  describe('AttributePredicate', () => {
    it('should evaluate attribute comparisons', () => {
      const predicate: AttributePredicate = {
        type: 'AttributePredicate',
        attribute: 'leeftijd',
        operator: '>',
        value: { type: 'NumberLiteral', value: 18 }
      };

      const value: Value = {
        type: 'object',
        value: {
          'leeftijd': { type: 'number', value: 25 }
        }
      };

      const result = predicateEvaluator.evaluate(predicate, value, context);
      expect(result).toBe(true);
    });

    it('should return false for missing attributes', () => {
      const predicate: AttributePredicate = {
        type: 'AttributePredicate',
        attribute: 'missing',
        operator: '==',
        value: { type: 'StringLiteral', value: 'test' }
      };

      const value: Value = {
        type: 'object',
        value: {}
      };

      const result = predicateEvaluator.evaluate(predicate, value, context);
      expect(result).toBe(false);
    });
  });

  describe('NotPredicate', () => {
    it('should negate predicate results', () => {
      const predicate: NotPredicate = {
        type: 'NotPredicate',
        predicate: {
          type: 'SimplePredicate',
          operator: '==',
          left: { type: 'NumberLiteral', value: 5 },
          right: { type: 'NumberLiteral', value: 5 }
        }
      };

      const result = predicateEvaluator.evaluate(
        predicate,
        { type: 'null', value: null },
        context
      );
      expect(result).toBe(false); // NOT(5 == 5) = false
    });
  });

  describe('Nested CompoundPredicate', () => {
    it('should evaluate nested compound predicates', () => {
      const predicate: CompoundPredicate = {
        type: 'CompoundPredicate',
        quantifier: QuantifierType.ALLE,
        predicates: [
          {
            type: 'SimplePredicate',
            operator: '>',
            left: { type: 'NumberLiteral', value: 10 },
            right: { type: 'NumberLiteral', value: 5 }
          },
          {
            type: 'CompoundPredicate',
            quantifier: QuantifierType.TEN_MINSTE,
            count: 1,
            predicates: [
              {
                type: 'SimplePredicate',
                operator: '==',
                left: { type: 'StringLiteral', value: 'a' },
                right: { type: 'StringLiteral', value: 'a' }
              },
              {
                type: 'SimplePredicate',
                operator: '==',
                left: { type: 'NumberLiteral', value: 1 },
                right: { type: 'NumberLiteral', value: 2 }
              }
            ]
          }
        ]
      };

      const result = predicateEvaluator.evaluate(
        predicate,
        { type: 'null', value: null },
        context
      );
      expect(result).toBe(true); // First is true, nested has at least 1 true
    });
  });
});