/**
 * Basic tests for timeline functionality in TypeScript.
 */

import { Context } from '../../src/runtime/context';
import { ExpressionEvaluator } from '../../src/evaluators/expression-evaluator';
import { TimelineValueImpl, Period, Timeline } from '../../src/ast/timelines';
import { Value } from '../../src/interfaces';

describe('Timeline Basic Tests', () => {
  describe('Timeline Attribute Storage', () => {
    it('should store and retrieve timeline attributes', () => {
      // Create context
      const context = new Context();
      
      // Create a timeline value
      const periods: Period[] = [
        {
          startDate: new Date(2024, 0, 1),  // Jan 1, 2024
          endDate: new Date(2024, 6, 1),    // Jul 1, 2024
          value: { type: 'number', value: 100 }
        },
        {
          startDate: new Date(2024, 6, 1),  // Jul 1, 2024
          endDate: new Date(2025, 0, 1),    // Jan 1, 2025
          value: { type: 'number', value: 200 }
        }
      ];
      
      const timeline: Timeline = {
        periods,
        granularity: 'maand'
      };
      
      const timelineValue = new TimelineValueImpl(timeline);
      
      // Store timeline attribute
      context.setTimelineAttribute('Person', 'person1', 'salary', timelineValue);
      
      // Retrieve value at different dates
      context.evaluation_date = new Date(2024, 2, 15); // Mar 15, 2024
      const marchValue = context.getTimelineAttribute('Person', 'person1', 'salary');
      expect(marchValue?.type).toBe('number');
      expect(marchValue?.value).toBe(100);
      
      context.evaluation_date = new Date(2024, 8, 15); // Sep 15, 2024
      const septValue = context.getTimelineAttribute('Person', 'person1', 'salary');
      expect(septValue?.type).toBe('number');
      expect(septValue?.value).toBe(200);
    });
  });
  
  describe('Timeline Value Methods', () => {
    it('should get value at specific date', () => {
      const periods: Period[] = [
        {
          startDate: new Date(2024, 0, 1),
          endDate: new Date(2024, 6, 1),
          value: { type: 'number', value: 1000 }
        },
        {
          startDate: new Date(2024, 6, 1),
          endDate: new Date(2025, 0, 1),
          value: { type: 'number', value: 2000 }
        }
      ];
      
      const timeline: Timeline = { periods, granularity: 'jaar' };
      const timelineValue = new TimelineValueImpl(timeline);
      
      // Test getValueAt
      const val1 = timelineValue.getValueAt(new Date(2024, 3, 15));
      expect(val1?.value).toBe(1000);
      
      const val2 = timelineValue.getValueAt(new Date(2024, 9, 15));
      expect(val2?.value).toBe(2000);
      
      // Test outside range
      const val3 = timelineValue.getValueAt(new Date(2023, 0, 1));
      expect(val3).toBeNull();
    });
    
    it('should get periods between dates', () => {
      const periods: Period[] = [
        {
          startDate: new Date(2024, 0, 1),
          endDate: new Date(2024, 3, 1),
          value: { type: 'number', value: 100 }
        },
        {
          startDate: new Date(2024, 3, 1),
          endDate: new Date(2024, 6, 1),
          value: { type: 'number', value: 200 }
        },
        {
          startDate: new Date(2024, 6, 1),
          endDate: new Date(2024, 9, 1),
          value: { type: 'number', value: 300 }
        }
      ];
      
      const timeline: Timeline = { periods, granularity: 'maand' };
      const timelineValue = new TimelineValueImpl(timeline);
      
      // Get periods overlapping with Q2 (Apr-Jun)
      const q2Periods = timelineValue.getPeriodsBetween(
        new Date(2024, 3, 1),
        new Date(2024, 7, 1)  // Include July to get the period starting at Jul 1
      );
      
      expect(q2Periods).toHaveLength(2);
      expect(q2Periods[0].value.value).toBe(200);
      expect(q2Periods[1].value.value).toBe(300);
    });
    
    it('should add periods in chronological order', () => {
      const timeline: Timeline = { periods: [], granularity: 'dag' };
      const timelineValue = new TimelineValueImpl(timeline);
      
      // Add periods out of order
      timelineValue.addPeriod({
        startDate: new Date(2024, 6, 1),
        endDate: new Date(2024, 9, 1),
        value: { type: 'number', value: 300 }
      });
      
      timelineValue.addPeriod({
        startDate: new Date(2024, 0, 1),
        endDate: new Date(2024, 3, 1),
        value: { type: 'number', value: 100 }
      });
      
      timelineValue.addPeriod({
        startDate: new Date(2024, 3, 1),
        endDate: new Date(2024, 6, 1),
        value: { type: 'number', value: 200 }
      });
      
      // Check periods are in order
      expect(timeline.periods).toHaveLength(3);
      expect(timeline.periods[0].value.value).toBe(100);
      expect(timeline.periods[1].value.value).toBe(200);
      expect(timeline.periods[2].value.value).toBe(300);
    });
  });
});