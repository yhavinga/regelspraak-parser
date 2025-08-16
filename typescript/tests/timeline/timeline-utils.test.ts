/**
 * Tests for timeline utility functions.
 */

import {
  alignToDay,
  alignToMonth,
  alignToYear,
  nextDay,
  nextMonth,
  nextYear,
  alignDate,
  nextPeriod,
  getKnipsFromTimeline,
  mergeKnips,
  getEvaluationPeriods,
  calculateProportionalValue,
  removeRedundantKnips
} from '../../src/utils/timeline-utils';
import { Timeline, Period } from '../../src/ast/timelines';

describe('Timeline Utilities', () => {
  describe('Date Alignment', () => {
    it('should align dates to day', () => {
      const dt = new Date(2024, 5, 15, 14, 30, 45); // June 15, 2024, 2:30:45 PM
      const aligned = alignToDay(dt);
      
      expect(aligned.getFullYear()).toBe(2024);
      expect(aligned.getMonth()).toBe(5);
      expect(aligned.getDate()).toBe(15);
      expect(aligned.getHours()).toBe(0);
      expect(aligned.getMinutes()).toBe(0);
      expect(aligned.getSeconds()).toBe(0);
    });
    
    it('should align dates to month', () => {
      const dt = new Date(2024, 5, 15, 14, 30, 45);
      const aligned = alignToMonth(dt);
      
      expect(aligned.getFullYear()).toBe(2024);
      expect(aligned.getMonth()).toBe(5);
      expect(aligned.getDate()).toBe(1);
      expect(aligned.getHours()).toBe(0);
    });
    
    it('should align dates to year', () => {
      const dt = new Date(2024, 5, 15, 14, 30, 45);
      const aligned = alignToYear(dt);
      
      expect(aligned.getFullYear()).toBe(2024);
      expect(aligned.getMonth()).toBe(0);
      expect(aligned.getDate()).toBe(1);
      expect(aligned.getHours()).toBe(0);
    });
  });
  
  describe('Next Period', () => {
    it('should get next day', () => {
      const dt = new Date(2024, 5, 15);
      const next = nextDay(dt);
      
      expect(next.getFullYear()).toBe(2024);
      expect(next.getMonth()).toBe(5);
      expect(next.getDate()).toBe(16);
    });
    
    it('should get next month', () => {
      const dt = new Date(2024, 5, 15);
      const next = nextMonth(dt);
      
      expect(next.getFullYear()).toBe(2024);
      expect(next.getMonth()).toBe(6);
      expect(next.getDate()).toBe(1);
    });
    
    it('should handle year boundary for next month', () => {
      const dt = new Date(2024, 11, 15); // December
      const next = nextMonth(dt);
      
      expect(next.getFullYear()).toBe(2025);
      expect(next.getMonth()).toBe(0); // January
      expect(next.getDate()).toBe(1);
    });
    
    it('should get next year', () => {
      const dt = new Date(2024, 5, 15);
      const next = nextYear(dt);
      
      expect(next.getFullYear()).toBe(2025);
      expect(next.getMonth()).toBe(0);
      expect(next.getDate()).toBe(1);
    });
  });
  
  describe('Knips Handling', () => {
    it('should extract knips from timeline', () => {
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
        }
      ];
      
      const timeline: Timeline = { periods, granularity: 'maand' };
      const knips = getKnipsFromTimeline(timeline);
      
      expect(knips).toHaveLength(4);
      expect(knips[0]).toEqual(new Date(2024, 0, 1));
      expect(knips[1]).toEqual(new Date(2024, 3, 1));
      expect(knips[2]).toEqual(new Date(2024, 3, 1)); // Duplicate
      expect(knips[3]).toEqual(new Date(2024, 6, 1));
    });
    
    it('should merge knips from multiple timelines', () => {
      const timeline1: Timeline = {
        periods: [
          {
            startDate: new Date(2024, 0, 1),
            endDate: new Date(2024, 6, 1),
            value: { type: 'number', value: 100 }
          }
        ],
        granularity: 'maand'
      };
      
      const timeline2: Timeline = {
        periods: [
          {
            startDate: new Date(2024, 3, 1),
            endDate: new Date(2024, 9, 1),
            value: { type: 'number', value: 200 }
          }
        ],
        granularity: 'maand'
      };
      
      const merged = mergeKnips(timeline1, timeline2);
      
      expect(merged).toHaveLength(4);
      expect(merged[0]).toEqual(new Date(2024, 0, 1));
      expect(merged[1]).toEqual(new Date(2024, 3, 1));
      expect(merged[2]).toEqual(new Date(2024, 6, 1));
      expect(merged[3]).toEqual(new Date(2024, 9, 1));
    });
    
    it('should get evaluation periods between knips', () => {
      const knips = [
        new Date(2024, 0, 1),
        new Date(2024, 3, 1),
        new Date(2024, 6, 1),
        new Date(2024, 9, 1)
      ];
      
      const periods = getEvaluationPeriods(knips);
      
      expect(periods).toHaveLength(3);
      expect(periods[0].start).toEqual(new Date(2024, 0, 1));
      expect(periods[0].end).toEqual(new Date(2024, 3, 1));
      expect(periods[1].start).toEqual(new Date(2024, 3, 1));
      expect(periods[1].end).toEqual(new Date(2024, 6, 1));
      expect(periods[2].start).toEqual(new Date(2024, 6, 1));
      expect(periods[2].end).toEqual(new Date(2024, 9, 1));
    });
  });
  
  describe('Proportional Calculations', () => {
    it('should calculate proportional value for partial month', () => {
      const baseValue = { type: 'number' as const, value: 31 };
      const startDate = new Date(2024, 0, 1);  // Jan 1
      const endDate = new Date(2024, 0, 8);    // Jan 8 (7 days)
      
      const result = calculateProportionalValue(baseValue, startDate, endDate, 'maand');
      
      // 7 days out of 31 in January = 7/31 * 31 = 7
      expect(result.type).toBe('number');
      expect(result.value).toBeCloseTo(7, 2);
    });
    
    it('should handle leap year for yearly proportional', () => {
      const baseValue = { type: 'number' as const, value: 366 };
      const startDate = new Date(2024, 0, 1);  // Jan 1, 2024
      const endDate = new Date(2024, 1, 1);    // Feb 1, 2024 (31 days)
      
      const result = calculateProportionalValue(baseValue, startDate, endDate, 'jaar');
      
      // 31 days out of 366 (leap year) = 31/366 * 366 = 31
      expect(result.type).toBe('number');
      expect(result.value).toBeCloseTo(31, 2);
    });
    
    it('should handle non-leap year for yearly proportional', () => {
      const baseValue = { type: 'number' as const, value: 365 };
      const startDate = new Date(2023, 0, 1);  // Jan 1, 2023
      const endDate = new Date(2023, 1, 1);    // Feb 1, 2023 (31 days)
      
      const result = calculateProportionalValue(baseValue, startDate, endDate, 'jaar');
      
      // 31 days out of 365 (non-leap year) = 31/365 * 365 = 31
      expect(result.type).toBe('number');
      expect(result.value).toBeCloseTo(31, 2);
    });
    
    it('should handle February in leap year', () => {
      const baseValue = { type: 'number' as const, value: 29 };
      const startDate = new Date(2024, 1, 1);  // Feb 1, 2024
      const endDate = new Date(2024, 1, 15);   // Feb 15, 2024 (14 days)
      
      const result = calculateProportionalValue(baseValue, startDate, endDate, 'maand');
      
      // 14 days out of 29 in February (leap year) = 14/29 * 29 = 14
      expect(result.type).toBe('number');
      expect(result.value).toBeCloseTo(14, 2);
    });
  });
  
  describe('Remove Redundant Knips', () => {
    it('should merge adjacent periods with same value', () => {
      const periods: Period[] = [
        {
          startDate: new Date(2024, 0, 1),
          endDate: new Date(2024, 3, 1),
          value: { type: 'number', value: 100 }
        },
        {
          startDate: new Date(2024, 3, 1),
          endDate: new Date(2024, 6, 1),
          value: { type: 'number', value: 100 } // Same value
        },
        {
          startDate: new Date(2024, 6, 1),
          endDate: new Date(2024, 9, 1),
          value: { type: 'number', value: 200 } // Different value
        }
      ];
      
      const result = removeRedundantKnips(periods, 'maand');
      
      expect(result).toHaveLength(2);
      expect(result[0].startDate).toEqual(new Date(2024, 0, 1));
      expect(result[0].endDate).toEqual(new Date(2024, 6, 1)); // Merged
      expect(result[0].value.value).toBe(100);
      expect(result[1].startDate).toEqual(new Date(2024, 6, 1));
      expect(result[1].endDate).toEqual(new Date(2024, 9, 1));
      expect(result[1].value.value).toBe(200);
    });
    
    it('should not merge non-adjacent periods', () => {
      const periods: Period[] = [
        {
          startDate: new Date(2024, 0, 1),
          endDate: new Date(2024, 3, 1),
          value: { type: 'number', value: 100 }
        },
        {
          startDate: new Date(2024, 4, 1), // Gap here
          endDate: new Date(2024, 6, 1),
          value: { type: 'number', value: 100 }
        }
      ];
      
      const result = removeRedundantKnips(periods, 'maand');
      
      expect(result).toHaveLength(2); // Not merged due to gap
    });
  });
});