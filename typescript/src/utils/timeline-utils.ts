/**
 * Utilities for timeline operations including date alignment and knip merging.
 */

import { Timeline, Period } from '../ast/timelines';
import { Value } from '../interfaces';
import Decimal from 'decimal.js';

/**
 * Align a date to the start of the day (00:00:00).
 */
export function alignToDay(dt: Date): Date {
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
}

/**
 * Align a date to the start of the month (first day at 00:00:00).
 */
export function alignToMonth(dt: Date): Date {
  return new Date(dt.getFullYear(), dt.getMonth(), 1);
}

/**
 * Align a date to the start of the year (January 1st at 00:00:00).
 */
export function alignToYear(dt: Date): Date {
  return new Date(dt.getFullYear(), 0, 1);
}

/**
 * Get the next day at 00:00:00.
 */
export function nextDay(dt: Date): Date {
  const next = new Date(dt);
  next.setDate(next.getDate() + 1);
  return alignToDay(next);
}

/**
 * Get the first day of the next month at 00:00:00.
 */
export function nextMonth(dt: Date): Date {
  const next = new Date(dt);
  next.setMonth(next.getMonth() + 1);
  return alignToMonth(next);
}

/**
 * Get January 1st of the next year at 00:00:00.
 */
export function nextYear(dt: Date): Date {
  const next = new Date(dt);
  next.setFullYear(next.getFullYear() + 1);
  return alignToYear(next);
}

/**
 * Align a date to the start of its period based on granularity.
 */
export function alignDate(dt: Date, granularity: 'dag' | 'maand' | 'jaar'): Date {
  switch (granularity) {
    case 'dag':
      return alignToDay(dt);
    case 'maand':
      return alignToMonth(dt);
    case 'jaar':
      return alignToYear(dt);
    default:
      throw new Error(`Unknown granularity: ${granularity}`);
  }
}

/**
 * Get the start of the next period based on granularity.
 */
export function nextPeriod(dt: Date, granularity: 'dag' | 'maand' | 'jaar'): Date {
  switch (granularity) {
    case 'dag':
      return nextDay(dt);
    case 'maand':
      return nextMonth(dt);
    case 'jaar':
      return nextYear(dt);
    default:
      throw new Error(`Unknown granularity: ${granularity}`);
  }
}

/**
 * Extract all knips (change points) from a timeline.
 */
export function getKnipsFromTimeline(timeline: Timeline): Date[] {
  const knips: Date[] = [];
  for (const period of timeline.periods) {
    knips.push(period.startDate);
    knips.push(period.endDate);
  }
  return knips;
}

/**
 * Merge knips from multiple timelines, removing duplicates and sorting.
 */
export function mergeKnips(...timelines: Timeline[]): Date[] {
  const knipsSet = new Set<number>();
  
  for (const timeline of timelines) {
    for (const period of timeline.periods) {
      knipsSet.add(period.startDate.getTime());
      knipsSet.add(period.endDate.getTime());
    }
  }
  
  return Array.from(knipsSet)
    .sort((a, b) => a - b)
    .map(time => new Date(time));
}

/**
 * Get evaluation periods between consecutive knips.
 */
export function getEvaluationPeriods(knips: Date[]): Array<{ start: Date; end: Date }> {
  const periods: Array<{ start: Date; end: Date }> = [];
  
  for (let i = 0; i < knips.length - 1; i++) {
    periods.push({
      start: knips[i],
      end: knips[i + 1]
    });
  }
  
  return periods;
}

/**
 * Check if a date is a leap year.
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Get the number of days in a month.
 */
function getDaysInMonth(year: number, month: number): number {
  // month is 0-indexed in JavaScript Date
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  if (month === 1 && isLeapYear(year)) {
    return 29;
  }
  
  return daysInMonth[month];
}

/**
 * Calculate time-proportional value for a partial period.
 * Used for tijdsevenredig deel calculations.
 */
export function calculateProportionalValue(
  baseValue: Value,
  startDate: Date,
  endDate: Date,
  periodType: 'maand' | 'jaar'
): Value {
  // Only works with numeric values
  if (baseValue.type !== 'number') {
    throw new Error('Proportional calculation requires numeric value');
  }
  
  // Calculate the number of days in the actual period
  const periodDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let totalDays: number;
  
  if (periodType === 'maand') {
    // For monthly proportional, we need to know which month we're in
    // Use the start date's month for calculation
    const year = startDate.getFullYear();
    const month = startDate.getMonth();
    totalDays = getDaysInMonth(year, month);
  } else if (periodType === 'jaar') {
    // For yearly proportional, check if it's a leap year
    const year = startDate.getFullYear();
    totalDays = isLeapYear(year) ? 366 : 365;
  } else {
    throw new Error(`Unknown period type for proportional calculation: ${periodType}`);
  }
  
  // Calculate the proportion
  const proportion = new Decimal(periodDays).div(new Decimal(totalDays));
  
  // Apply proportion to the base value
  const baseDecimal = new Decimal(baseValue.value as number);
  const resultValue = baseDecimal.mul(proportion);
  
  return {
    type: 'number',
    value: resultValue.toNumber(),
    unit: baseValue.unit
  };
}

/**
 * Remove redundant knips that don't actually represent value changes.
 */
export function removeRedundantKnips(
  periods: Period[],
  granularity: 'dag' | 'maand' | 'jaar'
): Period[] {
  if (periods.length <= 1) {
    return periods;
  }
  
  const result: Period[] = [periods[0]];
  
  for (let i = 1; i < periods.length; i++) {
    const current = periods[i];
    const last = result[result.length - 1];
    
    // Check if values are equal and periods are adjacent
    if (areValuesEqual(last.value, current.value) &&
        last.endDate.getTime() === current.startDate.getTime()) {
      // Merge periods by extending the last one
      last.endDate = current.endDate;
    } else {
      result.push(current);
    }
  }
  
  return result;
}

/**
 * Check if two values are equal.
 */
function areValuesEqual(v1: Value, v2: Value): boolean {
  if (v1.type !== v2.type) {
    return false;
  }
  
  if (v1.type === 'number' && v2.type === 'number') {
    // Use Decimal for precise comparison
    const d1 = new Decimal(v1.value as number);
    const d2 = new Decimal(v2.value as number);
    return d1.equals(d2) && v1.unit?.name === v2.unit?.name;
  }
  
  // For other types, use simple equality
  return v1.value === v2.value;
}