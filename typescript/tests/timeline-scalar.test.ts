import { describe, it, expect } from '@jest/globals';
import { ExpressionEvaluator } from '../src/evaluators/expression-evaluator';
import { TimelineEvaluator } from '../src/evaluators/timeline-evaluator';
import { Context } from '../src/runtime/context';
import { BinaryExpression, Literal } from '../src/ast/expressions';
import { Timeline, Period, TimelineValue } from '../src/ast/timelines';
import { Value } from '../src/interfaces';

describe('Timeline-Scalar Operations', () => {
  let evaluator: ExpressionEvaluator;
  let context: Context;

  beforeEach(() => {
    const timelineEvaluator = new TimelineEvaluator(null as any);
    evaluator = new ExpressionEvaluator(timelineEvaluator);
    // Set the circular reference
    (timelineEvaluator as any).expressionEvaluator = evaluator;
    context = new Context();
  });

  describe('Timeline + Scalar', () => {
    it('should add a scalar to all periods in a timeline', () => {
      // Create a timeline with two periods
      const timeline: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 100, unit: '€/month' }
          },
          {
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-03-01'),
            value: { type: 'number', value: 200, unit: '€/month' }
          }
        ],
        granularity: 'maand'
      };

      const timelineValue: TimelineValue = {
        type: 'timeline',
        value: timeline
      };

      const scalar: Value = {
        type: 'number',
        value: 50,
        unit: '€/month'
      };

      // Create binary expression: timeline + scalar
      const expr: BinaryExpression = {
        type: 'binary',
        left: { type: 'literal', value: timelineValue } as any,
        right: { type: 'literal', value: scalar } as any,
        operator: '+'
      };

      // Mock evaluate to return the values directly
      jest.spyOn(evaluator, 'evaluate').mockImplementation((e, ctx) => {
        if (e === expr.left) return timelineValue;
        if (e === expr.right) return scalar;
        // For the main expression, call the real implementation
        return evaluator['evaluateBinaryExpression'](expr, context);
      });

      const result = evaluator.evaluate(expr, context);

      expect(result.type).toBe('timeline');
      const resultTimeline = (result as TimelineValue).value;
      expect(resultTimeline.periods).toHaveLength(2);
      expect(resultTimeline.periods[0].value.value).toBe(150); // 100 + 50
      expect(resultTimeline.periods[1].value.value).toBe(250); // 200 + 50
    });

    it('should subtract a scalar from all periods in a timeline', () => {
      const timeline: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 100, unit: '€' }
          }
        ],
        granularity: 'maand'
      };

      const timelineValue: TimelineValue = {
        type: 'timeline',
        value: timeline
      };

      const scalar: Value = {
        type: 'number',
        value: 30,
        unit: '€'
      };

      const expr: BinaryExpression = {
        type: 'binary',
        left: { type: 'literal', value: timelineValue } as any,
        right: { type: 'literal', value: scalar } as any,
        operator: '-'
      };

      jest.spyOn(evaluator, 'evaluate').mockImplementation((e, ctx) => {
        if (e === expr.left) return timelineValue;
        if (e === expr.right) return scalar;
        return evaluator['evaluateBinaryExpression'](expr, context);
      });

      const result = evaluator.evaluate(expr, context);

      expect(result.type).toBe('timeline');
      const resultTimeline = (result as TimelineValue).value;
      expect(resultTimeline.periods[0].value.value).toBe(70); // 100 - 30
    });
  });

  describe('Scalar + Timeline', () => {
    it('should add a scalar to all periods (commutative)', () => {
      const timeline: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 100, unit: '€' }
          }
        ],
        granularity: 'maand'
      };

      const timelineValue: TimelineValue = {
        type: 'timeline',
        value: timeline
      };

      const scalar: Value = {
        type: 'number',
        value: 50,
        unit: '€'
      };

      const expr: BinaryExpression = {
        type: 'binary',
        left: { type: 'literal', value: scalar } as any,
        right: { type: 'literal', value: timelineValue } as any,
        operator: '+'
      };

      jest.spyOn(evaluator, 'evaluate').mockImplementation((e, ctx) => {
        if (e === expr.left) return scalar;
        if (e === expr.right) return timelineValue;
        return evaluator['evaluateBinaryExpression'](expr, context);
      });

      const result = evaluator.evaluate(expr, context);

      expect(result.type).toBe('timeline');
      const resultTimeline = (result as TimelineValue).value;
      expect(resultTimeline.periods[0].value.value).toBe(150); // 50 + 100
    });

    it('should subtract timeline from scalar (non-commutative)', () => {
      const timeline: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 30, unit: '€' }
          }
        ],
        granularity: 'maand'
      };

      const timelineValue: TimelineValue = {
        type: 'timeline',
        value: timeline
      };

      const scalar: Value = {
        type: 'number',
        value: 100,
        unit: '€'
      };

      const expr: BinaryExpression = {
        type: 'binary',
        left: { type: 'literal', value: scalar } as any,
        right: { type: 'literal', value: timelineValue } as any,
        operator: '-'
      };

      jest.spyOn(evaluator, 'evaluate').mockImplementation((e, ctx) => {
        if (e === expr.left) return scalar;
        if (e === expr.right) return timelineValue;
        return evaluator['evaluateBinaryExpression'](expr, context);
      });

      const result = evaluator.evaluate(expr, context);

      expect(result.type).toBe('timeline');
      const resultTimeline = (result as TimelineValue).value;
      expect(resultTimeline.periods[0].value.value).toBe(70); // 100 - 30
    });
  });

  describe('Timeline * Scalar', () => {
    it('should multiply all periods by a scalar', () => {
      const timeline: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 100, unit: '€/month' }
          },
          {
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-03-01'),
            value: { type: 'number', value: 200, unit: '€/month' }
          }
        ],
        granularity: 'maand'
      };

      const timelineValue: TimelineValue = {
        type: 'timeline',
        value: timeline
      };

      const scalar: Value = {
        type: 'number',
        value: 2,
        unit: null
      };

      const expr: BinaryExpression = {
        type: 'binary',
        left: { type: 'literal', value: timelineValue } as any,
        right: { type: 'literal', value: scalar } as any,
        operator: '*'
      };

      jest.spyOn(evaluator, 'evaluate').mockImplementation((e, ctx) => {
        if (e === expr.left) return timelineValue;
        if (e === expr.right) return scalar;
        return evaluator['evaluateBinaryExpression'](expr, context);
      });

      const result = evaluator.evaluate(expr, context);

      expect(result.type).toBe('timeline');
      const resultTimeline = (result as TimelineValue).value;
      expect(resultTimeline.periods[0].value.value).toBe(200); // 100 * 2
      expect(resultTimeline.periods[1].value.value).toBe(400); // 200 * 2
    });
  });

  describe('Timeline / Scalar', () => {
    it('should divide all periods by a scalar', () => {
      const timeline: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 100, unit: '€' }
          }
        ],
        granularity: 'maand'
      };

      const timelineValue: TimelineValue = {
        type: 'timeline',
        value: timeline
      };

      const scalar: Value = {
        type: 'number',
        value: 2,
        unit: null
      };

      const expr: BinaryExpression = {
        type: 'binary',
        left: { type: 'literal', value: timelineValue } as any,
        right: { type: 'literal', value: scalar } as any,
        operator: '/'
      };

      jest.spyOn(evaluator, 'evaluate').mockImplementation((e, ctx) => {
        if (e === expr.left) return timelineValue;
        if (e === expr.right) return scalar;
        return evaluator['evaluateBinaryExpression'](expr, context);
      });

      const result = evaluator.evaluate(expr, context);

      expect(result.type).toBe('timeline');
      const resultTimeline = (result as TimelineValue).value;
      expect(resultTimeline.periods[0].value.value).toBe(50); // 100 / 2
    });

    it('should throw error for division by zero', () => {
      const timeline: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 100, unit: '€' }
          }
        ],
        granularity: 'maand'
      };

      const timelineValue: TimelineValue = {
        type: 'timeline',
        value: timeline
      };

      const scalar: Value = {
        type: 'number',
        value: 0,
        unit: null
      };

      const expr: BinaryExpression = {
        type: 'binary',
        left: { type: 'literal', value: timelineValue } as any,
        right: { type: 'literal', value: scalar } as any,
        operator: '/'
      };

      jest.spyOn(evaluator, 'evaluate').mockImplementation((e, ctx) => {
        if (e === expr.left) return timelineValue;
        if (e === expr.right) return scalar;
        return evaluator['evaluateBinaryExpression'](expr, context);
      });

      expect(() => evaluator.evaluate(expr, context)).toThrow('Division by zero');
    });
  });

  describe('Empty Value Handling', () => {
    it('should preserve empty periods in timeline', () => {
      const timeline: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 100, unit: '€' }
          },
          {
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-03-01'),
            value: null as any // Empty period
          }
        ],
        granularity: 'maand'
      };

      const timelineValue: TimelineValue = {
        type: 'timeline',
        value: timeline
      };

      const scalar: Value = {
        type: 'number',
        value: 50,
        unit: '€'
      };

      const expr: BinaryExpression = {
        type: 'binary',
        left: { type: 'literal', value: timelineValue } as any,
        right: { type: 'literal', value: scalar } as any,
        operator: '+'
      };

      jest.spyOn(evaluator, 'evaluate').mockImplementation((e, ctx) => {
        if (e === expr.left) return timelineValue;
        if (e === expr.right) return scalar;
        return evaluator['evaluateBinaryExpression'](expr, context);
      });

      const result = evaluator.evaluate(expr, context);

      expect(result.type).toBe('timeline');
      const resultTimeline = (result as TimelineValue).value;
      expect(resultTimeline.periods[0].value.value).toBe(150); // 100 + 50
      expect(resultTimeline.periods[1].value).toBeUndefined(); // Empty remains empty
    });
  });

  describe('Error Cases', () => {
    it('should throw error for non-arithmetic operations', () => {
      const timeline: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 100, unit: '€' }
          }
        ],
        granularity: 'maand'
      };

      const timelineValue: TimelineValue = {
        type: 'timeline',
        value: timeline
      };

      const scalar: Value = {
        type: 'number',
        value: 50,
        unit: '€'
      };

      const expr: BinaryExpression = {
        type: 'binary',
        left: { type: 'literal', value: timelineValue } as any,
        right: { type: 'literal', value: scalar } as any,
        operator: '>'
      };

      jest.spyOn(evaluator, 'evaluate').mockImplementation((e, ctx) => {
        if (e === expr.left) return timelineValue;
        if (e === expr.right) return scalar;
        return evaluator['evaluateBinaryExpression'](expr, context);
      });

      expect(() => evaluator.evaluate(expr, context))
        .toThrow('Cannot apply operator > to timeline and number');
    });

    it('should throw error for timeline with non-numeric value', () => {
      const timeline: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'string', value: 'text', unit: null }
          }
        ],
        granularity: 'maand'
      };

      const timelineValue: TimelineValue = {
        type: 'timeline',
        value: timeline
      };

      const booleanValue: Value = {
        type: 'boolean',
        value: true
      };

      const expr: BinaryExpression = {
        type: 'binary',
        left: { type: 'literal', value: timelineValue } as any,
        right: { type: 'literal', value: booleanValue } as any,
        operator: '+'
      };

      jest.spyOn(evaluator, 'evaluate').mockImplementation((e, ctx) => {
        if (e === expr.left) return timelineValue;
        if (e === expr.right) return booleanValue;
        return evaluator['evaluateBinaryExpression'](expr, context);
      });

      expect(() => evaluator.evaluate(expr, context))
        .toThrow('Cannot apply operator + to timeline and boolean');
    });
  });
});