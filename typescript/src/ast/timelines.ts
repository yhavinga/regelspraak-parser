import { Value } from '../interfaces';
import { Expression } from './expressions';

/**
 * Represents a single period in a timeline with a constant value.
 * The period is from startDate (inclusive) to endDate (exclusive).
 */
export interface Period {
  startDate: Date;
  endDate: Date;
  value: Value;
}

/**
 * Represents a time-dependent value as a sequence of periods.
 * Each period has a constant value from start to end date.
 */
export interface Timeline {
  periods: Period[];
  granularity: 'dag' | 'maand' | 'jaar';
}

/**
 * Represents a timeline period definition (vanaf, tot, van...tot, etc.)
 */
export interface PeriodDefinition extends Expression {
  type: 'PeriodDefinition';
  periodType: 'vanaf' | 'tot' | 'tot_en_met' | 'van_tot' | 'van_tot_en_met';
  startDate?: Expression;
  endDate?: Expression;
}

/**
 * Timeline-aware value that changes over time
 */
export interface TimelineValue {
  type: 'timeline';
  timeline: Timeline;
}

/**
 * Timeline expression for operations like "totaal van" over time periods
 */
export interface TimelineExpression extends Expression {
  type: 'TimelineExpression';
  operation: 'totaal' | 'aantal_dagen' | 'naar_verhouding';
  target: Expression;
  period?: PeriodDefinition;
  condition?: Expression;
}