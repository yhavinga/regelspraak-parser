import { Engine, Context } from '../../src';
import { ExpressionEvaluator } from '../../src/evaluators/expression-evaluator';
import { Timeline, Period, TimelineValue, TimelineExpression } from '../../src/ast/timelines';
import { BinaryExpression, VariableReference } from '../../src/ast/expressions';

describe('Timeline', () => {
  describe('TimelineEvaluator', () => {
    let evaluator: ExpressionEvaluator;
    let context: Context;

    beforeEach(() => {
      evaluator = new ExpressionEvaluator();
      context = new Context();
    });

    test('should add two timeline values with same granularity', () => {
      // Create timeline for salary (monthly)
      const salaryPeriods: Period[] = [
        {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          value: { type: 'number', value: 3000 }
        },
        {
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-03-01'),
          value: { type: 'number', value: 3100 }
        },
        {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-04-01'),
          value: { type: 'number', value: 3200 }
        }
      ];
      const salaryTimeline: Timeline = {
        periods: salaryPeriods,
        granularity: 'maand'
      };
      const salaryValue: TimelineValue = {
        type: 'timeline',
        value: salaryTimeline
      };
      context.setVariable('salary', salaryValue as any);

      // Create timeline for bonus (monthly)
      const bonusPeriods: Period[] = [
        {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          value: { type: 'number', value: 500 }
        },
        {
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-03-01'),
          value: { type: 'number', value: 600 }
        },
        {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-04-01'),
          value: { type: 'number', value: 700 }
        }
      ];
      const bonusTimeline: Timeline = {
        periods: bonusPeriods,
        granularity: 'maand'
      };
      const bonusValue: TimelineValue = {
        type: 'timeline',
        value: bonusTimeline
      };
      context.setVariable('bonus', bonusValue as any);

      // Create expression to add salary + bonus
      const expr: BinaryExpression = {
        type: 'BinaryExpression',
        left: { type: 'VariableReference', variableName: 'salary' },
        right: { type: 'VariableReference', variableName: 'bonus' },
        operator: '+'
      };

      const result = evaluator.evaluate(expr, context);
      expect(result.type).toBe('timeline');
      
      const resultTimeline = (result as any).value;
      expect(resultTimeline.periods.length).toBe(3);
      expect(resultTimeline.periods[0].value.value).toBe(3500); // 3000 + 500
      expect(resultTimeline.periods[1].value.value).toBe(3700); // 3100 + 600
      expect(resultTimeline.periods[2].value.value).toBe(3900); // 3200 + 700
    });

    test('should merge knips when timelines have different change points', () => {
      // Timeline 1: changes at Jan 1 and Mar 1
      const timeline1Periods: Period[] = [
        {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-03-01'),
          value: { type: 'number', value: 100 }
        },
        {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-05-01'),
          value: { type: 'number', value: 200 }
        }
      ];
      const timeline1: Timeline = {
        periods: timeline1Periods,
        granularity: 'maand'
      };
      context.setVariable('t1', { type: 'timeline', value: timeline1 } as any);

      // Timeline 2: changes at Jan 1, Feb 1, and Apr 1
      const timeline2Periods: Period[] = [
        {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          value: { type: 'number', value: 10 }
        },
        {
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-04-01'),
          value: { type: 'number', value: 20 }
        },
        {
          startDate: new Date('2024-04-01'),
          endDate: new Date('2024-05-01'),
          value: { type: 'number', value: 30 }
        }
      ];
      const timeline2: Timeline = {
        periods: timeline2Periods,
        granularity: 'maand'
      };
      context.setVariable('t2', { type: 'timeline', value: timeline2 } as any);

      const expr: BinaryExpression = {
        type: 'BinaryExpression',
        left: { type: 'VariableReference', variableName: 't1' },
        right: { type: 'VariableReference', variableName: 't2' },
        operator: '+'
      };

      const result = evaluator.evaluate(expr, context);
      const resultTimeline = (result as any).value;
      
      // Should have 4 periods due to knip merging
      expect(resultTimeline.periods.length).toBe(4);
      
      // Jan 1 - Feb 1: 100 + 10 = 110
      expect(resultTimeline.periods[0].value.value).toBe(110);
      expect(resultTimeline.periods[0].startDate).toEqual(new Date('2024-01-01'));
      expect(resultTimeline.periods[0].endDate).toEqual(new Date('2024-02-01'));
      
      // Feb 1 - Mar 1: 100 + 20 = 120
      expect(resultTimeline.periods[1].value.value).toBe(120);
      
      // Mar 1 - Apr 1: 200 + 20 = 220
      expect(resultTimeline.periods[2].value.value).toBe(220);
      
      // Apr 1 - May 1: 200 + 30 = 230
      expect(resultTimeline.periods[3].value.value).toBe(230);
    });

    test('should evaluate totaal timeline expression', () => {
      // Create a timeline with monthly values
      const periods: Period[] = [
        {
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          value: { type: 'number', value: 100 }
        },
        {
          startDate: new Date('2024-02-01'),
          endDate: new Date('2024-03-01'),
          value: { type: 'number', value: 200 }
        },
        {
          startDate: new Date('2024-03-01'),
          endDate: new Date('2024-04-01'),
          value: { type: 'number', value: 300 }
        }
      ];
      const timeline: Timeline = {
        periods,
        granularity: 'maand'
      };
      context.setVariable('monthly', { type: 'timeline', value: timeline } as any);

      const expr: TimelineExpression = {
        type: 'TimelineExpression',
        operation: 'totaal',
        target: { type: 'VariableReference', variableName: 'monthly' }
      };

      const result = evaluator.evaluate(expr, context);
      expect(result.type).toBe('number');
      expect(result.value).toBe(600); // 100 + 200 + 300
    });

    test('should handle totaal on non-timeline values for backward compatibility', () => {
      // Test with scalar value
      context.setVariable('scalar', { type: 'number', value: 42 });
      const scalarExpr: TimelineExpression = {
        type: 'TimelineExpression',
        operation: 'totaal',
        target: { type: 'VariableReference', variableName: 'scalar' }
      };
      const scalarResult = evaluator.evaluate(scalarExpr, context);
      expect(scalarResult.type).toBe('number');
      expect(scalarResult.value).toBe(42); // Total of a single number is itself

      // Test with array value
      context.setVariable('array', { 
        type: 'array', 
        value: [
          { type: 'number', value: 10 },
          { type: 'number', value: 20 },
          { type: 'number', value: 30 }
        ]
      });
      const arrayExpr: TimelineExpression = {
        type: 'TimelineExpression',
        operation: 'totaal',
        target: { type: 'VariableReference', variableName: 'array' }
      };
      const arrayResult = evaluator.evaluate(arrayExpr, context);
      expect(arrayResult.type).toBe('number');
      expect(arrayResult.value).toBe(60); // Sum of array elements
    });

    test('should handle timeline subtraction', () => {
      // Create two timelines
      const revenue: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 5000 }
          },
          {
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-03-01'),
            value: { type: 'number', value: 6000 }
          }
        ],
        granularity: 'maand'
      };
      context.setVariable('revenue', { type: 'timeline', value: revenue } as any);

      const costs: Timeline = {
        periods: [
          {
            startDate: new Date('2024-01-01'),
            endDate: new Date('2024-02-01'),
            value: { type: 'number', value: 3000 }
          },
          {
            startDate: new Date('2024-02-01'),
            endDate: new Date('2024-03-01'),
            value: { type: 'number', value: 3500 }
          }
        ],
        granularity: 'maand'
      };
      context.setVariable('costs', { type: 'timeline', value: costs } as any);

      const expr: BinaryExpression = {
        type: 'BinaryExpression',
        left: { type: 'VariableReference', variableName: 'revenue' },
        right: { type: 'VariableReference', variableName: 'costs' },
        operator: '-'
      };

      const result = evaluator.evaluate(expr, context);
      const resultTimeline = (result as any).value;
      
      expect(resultTimeline.periods[0].value.value).toBe(2000); // 5000 - 3000
      expect(resultTimeline.periods[1].value.value).toBe(2500); // 6000 - 3500
    });

    test('should handle granularity correctly', () => {
      // Daily timeline
      const daily: Timeline = {
        periods: [{
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-02'),
          value: { type: 'number', value: 10 }
        }],
        granularity: 'dag'
      };

      // Monthly timeline
      const monthly: Timeline = {
        periods: [{
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-02-01'),
          value: { type: 'number', value: 100 }
        }],
        granularity: 'maand'
      };

      context.setVariable('daily', { type: 'timeline', value: daily } as any);
      context.setVariable('monthly', { type: 'timeline', value: monthly } as any);

      const expr: BinaryExpression = {
        type: 'BinaryExpression',
        left: { type: 'VariableReference', variableName: 'daily' },
        right: { type: 'VariableReference', variableName: 'monthly' },
        operator: '+'
      };

      const result = evaluator.evaluate(expr, context);
      const resultTimeline = (result as any).value;
      
      // Result should have daily granularity (finest)
      expect(resultTimeline.granularity).toBe('dag');
    });
  });
});