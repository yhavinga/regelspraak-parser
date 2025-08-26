import { Value, RuntimeContext } from '../interfaces';
import { Timeline, Period, TimelineValue, TimelineExpression, PeriodDefinition, TimelineValueImpl } from '../ast/timelines';
import { Expression } from '../ast/expressions';
import { ExpressionEvaluator } from './expression-evaluator';
import { 
  mergeKnips, 
  getEvaluationPeriods, 
  removeRedundantKnips,
  calculateProportionalValue,
  alignDate,
  nextPeriod
} from '../utils/timeline-utils';
import { Context } from '../runtime/context';
import Decimal from 'decimal.js';

/**
 * Evaluator for timeline expressions and operations
 */
export class TimelineEvaluator {
  constructor(private expressionEvaluator: ExpressionEvaluator) {}

  /**
   * Evaluate a timeline expression
   */
  evaluate(expr: TimelineExpression, context: RuntimeContext): Value {
    switch (expr.operation) {
      case 'totaal':
        return this.evaluateTotaal(expr, context);
      case 'aantal_dagen':
        return this.evaluateAantalDagen(expr, context);
      case 'naar_verhouding':
        return this.evaluateNaarVerhouding(expr, context);
      case 'tijdsevenredig_deel_per_maand':
        return this.evaluateTijdsevenredigPerMaand(expr, context);
      case 'tijdsevenredig_deel_per_jaar':
        return this.evaluateTijdsevenredigPerJaar(expr, context);
      default:
        throw new Error(`Unknown timeline operation: ${expr.operation}`);
    }
  }

  /**
   * Get value at a specific date from a timeline value
   */
  getValueAt(timelineValue: TimelineValue, date: Date): Value | null {
    const timeline = timelineValue.value;
    
    for (const period of timeline.periods) {
      if (date >= period.startDate && date < period.endDate) {
        return period.value || null;
      }
    }
    
    return null;
  }

  /**
   * Merge knips (change points) from multiple timelines
   */
  mergeKnips(...timelines: Timeline[]): Date[] {
    const knips = new Set<number>();
    
    for (const timeline of timelines) {
      for (const period of timeline.periods) {
        knips.add(period.startDate.getTime());
        knips.add(period.endDate.getTime());
      }
    }
    
    return Array.from(knips)
      .sort((a, b) => a - b)
      .map(time => new Date(time));
  }

  /**
   * Evaluate timeline addition, multiplication, etc.
   */
  evaluateTimelineBinaryOp(
    leftTimeline: Timeline,
    rightTimeline: Timeline,
    operator: '+' | '-' | '*' | '/' | '==' | '!=' | '>' | '<' | '>=' | '<=' | '&&' | '||',
    context: RuntimeContext
  ): TimelineValue {
    // Check if operator is valid for timeline operations
    if (['==', '!=', '>', '<', '>=', '<=', '&&', '||'].includes(operator)) {
      throw new Error(`Operator ${operator} not supported for timeline operations`);
    }
    // Get all knips from both timelines
    const knips = this.mergeKnips(leftTimeline, rightTimeline);
    const periods: Period[] = [];
    
    // Create evaluation periods between consecutive knips
    for (let i = 0; i < knips.length - 1; i++) {
      const startDate = knips[i];
      const endDate = knips[i + 1];
      
      // Get values from both timelines at this period's start
      const leftValue = this.getValueAtDate(leftTimeline, startDate);
      const rightValue = this.getValueAtDate(rightTimeline, startDate);
      
      if (leftValue && rightValue) {
        // Perform the operation
        const resultValue = this.performBinaryOp(leftValue, rightValue, operator);
        periods.push({
          startDate,
          endDate,
          value: resultValue
        });
      }
    }
    
    // Determine result granularity (finest of the two)
    const granularity = this.getFinestGranularity(
      leftTimeline.granularity,
      rightTimeline.granularity
    );
    
    return {
      type: 'timeline',
      value: {
        periods,
        granularity
      }
    };
  }

  private evaluateTotaal(expr: TimelineExpression, context: RuntimeContext): Value {
    // Evaluate the target expression
    const targetValue = this.expressionEvaluator.evaluate(expr.target, context);
    
    // Handle timeline values
    if (targetValue.type === 'timeline') {
      const timelineValue = targetValue as any as TimelineValue;
      const timeline = timelineValue.value;
      
      // If there's a temporal condition, filter periods
      let periodsToSum = timeline.periods;
      if (expr.condition) {
        periodsToSum = this.filterPeriodsWithCondition(timeline, expr.condition, context);
      }
      
      // Per specification section 7.1: totaal_van returns a scalar sum
      // The sum accounts for the actual duration of each period
      let total = new Decimal(0);
      
      for (const period of periodsToSum) {
        if (!period.value) {
          // Skip empty periods
          continue;
        }
        if (period.value.type !== 'number') {
          throw new Error('Cannot sum non-numeric timeline values');
        }
        
        // For timeline aggregation, we sum the values directly
        // The timeline values are already adjusted for their period duration
        total = total.plus(new Decimal(period.value.value as number));
      }
      
      return {
        type: 'number',
        value: total.toNumber(),
        unit: timeline.periods[0]?.value?.unit
      };
    }
    
    // Handle array values (backward compatibility)
    if (targetValue.type === 'array') {
      const values = targetValue.value as Value[];
      let total = 0;
      
      for (const val of values) {
        if (val.type !== 'number') {
          throw new Error(`totaal_van expects numeric values, got ${val.type}`);
        }
        total += val.value as number;
      }
      
      return {
        type: 'number',
        value: total,
        unit: values[0]?.unit
      };
    }
    
    // Handle scalar values (single number)
    if (targetValue.type === 'number') {
      return targetValue; // The total of a single number is itself
    }
    
    throw new Error(`totaal operation expects a timeline, array, or number value, got ${targetValue.type}`);
  }

  private evaluateAantalDagen(expr: TimelineExpression, context: RuntimeContext): Value {
    // Pattern: "het aantal dagen in [period] dat [condition]"
    if (!expr.condition) {
      throw new Error('aantal_dagen requires a condition');
    }
    
    // Get the period to evaluate
    let startDate: Date;
    let endDate: Date;
    
    if (expr.period) {
      // Use the specified period
      const periodBounds = this.evaluatePeriodDefinition(expr.period, context);
      startDate = periodBounds.start;
      endDate = periodBounds.end;
    } else {
      // Use current evaluation context period (e.g., current month)
      startDate = alignDate(context.evaluation_date, 'maand');
      endDate = nextPeriod(startDate, 'maand');
    }
    
    // Count days where condition is true
    let dayCount = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate < endDate) {
      // Save current evaluation date
      const savedDate = context.evaluation_date;
      context.evaluation_date = currentDate;
      
      // Evaluate condition for this day
      const conditionResult = this.expressionEvaluator.evaluate(expr.condition, context);
      
      // Restore evaluation date
      context.evaluation_date = savedDate;
      
      if (conditionResult.type === 'boolean' && conditionResult.value === true) {
        dayCount++;
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return {
      type: 'number',
      value: dayCount
    };
  }

  private evaluateNaarVerhouding(expr: TimelineExpression, context: RuntimeContext): Value {
    // Calculate prorated value based on time duration
    const targetValue = this.expressionEvaluator.evaluate(expr.target, context);
    
    if (targetValue.type !== 'number') {
      throw new Error('naar_verhouding requires a numeric value');
    }
    
    // This would need period information to calculate proportion
    // For now, return the original value
    return targetValue;
  }
  
  /**
   * Evaluate tijdsevenredig deel per maand (time-proportional per month).
   */
  private evaluateTijdsevenredigPerMaand(expr: TimelineExpression, context: RuntimeContext): Value | TimelineValue {
    const targetValue = this.expressionEvaluator.evaluate(expr.target, context);
    
    if (targetValue.type === 'timeline') {
      // Apply tijdsevenredig to a timeline
      return this.applyTijdsevenredigToTimeline(
        targetValue as any as TimelineValue,
        'maand',
        expr.condition,
        context
      );
    } else if (targetValue.type === 'number') {
      // Simple scalar value - convert yearly to monthly if needed
      const value = targetValue.value as number;
      // Assume the value is per year and convert to per month
      return {
        type: 'number',
        value: value / 12,
        unit: targetValue.unit
      };
    }
    
    throw new Error('tijdsevenredig_deel_per_maand requires numeric or timeline value');
  }
  
  /**
   * Evaluate tijdsevenredig deel per jaar (time-proportional per year).
   */
  private evaluateTijdsevenredigPerJaar(expr: TimelineExpression, context: RuntimeContext): Value | TimelineValue {
    const targetValue = this.expressionEvaluator.evaluate(expr.target, context);
    
    if (targetValue.type === 'timeline') {
      // Apply tijdsevenredig to a timeline
      return this.applyTijdsevenredigToTimeline(
        targetValue as any as TimelineValue,
        'jaar',
        expr.condition,
        context
      );
    } else if (targetValue.type === 'number') {
      // Simple scalar value - already per year
      return targetValue;
    }
    
    throw new Error('tijdsevenredig_deel_per_jaar requires numeric or timeline value');
  }
  
  /**
   * Apply tijdsevenredig calculation to a timeline.
   */
  applyTijdsevenredigToTimeline(
    timelineValue: TimelineValue,
    periodType: 'maand' | 'jaar',
    condition: Expression | undefined,
    context: RuntimeContext
  ): TimelineValue {
    const timeline = timelineValue.value;
    const resultPeriods: Period[] = [];
    
    // When converting granularities, we need to expand periods
    if (timeline.granularity !== periodType) {
      // Expand each period into the target granularity
      for (const period of timeline.periods) {
        if (!period.value) {
          // Skip empty periods
          continue;
        }
        
        // Generate periods at the target granularity
        const expandedPeriods = this.expandPeriodToGranularity(
          period,
          periodType,
          condition,
          context
        );
        resultPeriods.push(...expandedPeriods);
      }
    } else {
      // Same granularity - check for partial periods and apply proportional calculation
      for (const period of timeline.periods) {
        if (condition) {
          // Evaluate condition at the start of this period
          const savedDate = context.evaluation_date;
          context.evaluation_date = period.startDate;
          const conditionResult = this.expressionEvaluator.evaluate(condition, context);
          context.evaluation_date = savedDate;
          
          const includeperiod = conditionResult.type === 'boolean' && conditionResult.value === true;
          if (!includeperiod) {
            // Skip periods where condition is false
            continue;
          }
        }
        
        // Check if this is a partial period
        const periodStart = alignDate(period.startDate, periodType);
        const periodEnd = nextPeriod(periodStart, periodType);
        
        if (period.value && (period.startDate > periodStart || period.endDate < periodEnd)) {
          // Partial period - calculate proportional value
          const proportionalValue = calculateProportionalValue(
            period.value,
            period.startDate,
            period.endDate,
            periodType
          );
          
          resultPeriods.push({
            startDate: period.startDate,
            endDate: period.endDate,
            value: proportionalValue
          });
        } else {
          // Full period - keep as-is
          resultPeriods.push(period);
        }
      }
    }
    
    return {
      type: 'timeline',
      value: {
        periods: resultPeriods,
        granularity: periodType
      }
    };
  }
  
  /**
   * Expand a period to a different granularity, applying tijdsevenredig conversion.
   */
  private expandPeriodToGranularity(
    period: Period,
    targetGranularity: 'maand' | 'jaar',
    condition: Expression | undefined,
    context: RuntimeContext
  ): Period[] {
    const results: Period[] = [];
    const sourceGranularity = period.endDate.getTime() - period.startDate.getTime() > 32 * 24 * 60 * 60 * 1000 ? 'jaar' : 'maand';
    
    if (sourceGranularity === 'jaar' && targetGranularity === 'maand') {
      // Expand year to months
      const yearValue = period.value?.type === 'number' ? period.value.value as number : 0;
      const monthlyValue = yearValue / 12;
      
      // Generate monthly periods within this year period
      let currentDate = new Date(period.startDate);
      
      while (currentDate < period.endDate) {
        const monthStart = new Date(currentDate);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        
        // Don't go beyond the period end
        const actualEnd = monthEnd > period.endDate ? period.endDate : monthEnd;
        
        if (condition) {
          // Evaluate condition for this month
          const savedDate = context.evaluation_date;
          context.evaluation_date = monthStart;
          const conditionResult = this.expressionEvaluator.evaluate(condition, context);
          context.evaluation_date = savedDate;
          
          if (conditionResult.type === 'boolean' && conditionResult.value === true) {
            // Include this month with the calculated value
            results.push({
              startDate: monthStart,
              endDate: actualEnd,
              value: {
                type: 'number',
                value: monthlyValue,
                unit: period.value?.unit
              }
            });
          }
          // If condition is false, we don't add a period (results in null when queried)
        } else {
          // No condition - always include
          results.push({
            startDate: monthStart,
            endDate: actualEnd,
            value: {
              type: 'number',
              value: monthlyValue,
              unit: period.value?.unit
            }
          });
        }
        
        // Move to next month
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      }
    } else if (sourceGranularity === 'maand' && targetGranularity === 'jaar') {
      // Aggregate months to year - would need to handle this case
      // For now, just return the original period
      results.push(period);
    } else {
      // Same granularity
      results.push(period);
    }
    
    return results;
  }
  
  /**
   * Filter periods based on a temporal condition.
   */
  private filterPeriodsWithCondition(
    timeline: Timeline,
    condition: Expression,
    context: RuntimeContext
  ): Period[] {
    const filteredPeriods: Period[] = [];
    
    for (const period of timeline.periods) {
      // Evaluate condition at the start of this period
      const savedDate = context.evaluation_date;
      context.evaluation_date = period.startDate;
      
      const conditionResult = this.expressionEvaluator.evaluate(condition, context);
      
      context.evaluation_date = savedDate;
      
      if (conditionResult.type === 'boolean' && conditionResult.value === true) {
        filteredPeriods.push(period);
      }
    }
    
    return filteredPeriods;
  }
  
  /**
   * Evaluate a period definition to get start and end dates.
   */
  private evaluatePeriodDefinition(
    periodDef: PeriodDefinition,
    context: RuntimeContext
  ): { start: Date; end: Date } {
    let start: Date;
    let end: Date;
    
    switch (periodDef.periodType) {
      case 'vanaf':
        if (!periodDef.startDate) {
          throw new Error('vanaf requires a start date');
        }
        const startValue = this.expressionEvaluator.evaluate(periodDef.startDate, context);
        if (startValue.type !== 'date') {
          throw new Error('Period start must be a date');
        }
        start = startValue.value as Date;
        // End is open-ended, use a far future date
        end = new Date(2100, 0, 1);
        break;
        
      case 'tot':
      case 'tot_en_met':
        if (!periodDef.endDate) {
          throw new Error(`${periodDef.periodType} requires an end date`);
        }
        // Start is open-ended, use a far past date
        start = new Date(1900, 0, 1);
        const endValue = this.expressionEvaluator.evaluate(periodDef.endDate, context);
        if (endValue.type !== 'date') {
          throw new Error('Period end must be a date');
        }
        end = endValue.value as Date;
        if (periodDef.periodType === 'tot_en_met') {
          // Include the end date
          end = new Date(end);
          end.setDate(end.getDate() + 1);
        }
        break;
        
      case 'van_tot':
      case 'van_tot_en_met':
        if (!periodDef.startDate || !periodDef.endDate) {
          throw new Error(`${periodDef.periodType} requires both start and end dates`);
        }
        const startVal = this.expressionEvaluator.evaluate(periodDef.startDate, context);
        const endVal = this.expressionEvaluator.evaluate(periodDef.endDate, context);
        if (startVal.type !== 'date' || endVal.type !== 'date') {
          throw new Error('Period bounds must be dates');
        }
        start = startVal.value as Date;
        end = endVal.value as Date;
        if (periodDef.periodType === 'van_tot_en_met') {
          // Include the end date
          end = new Date(end);
          end.setDate(end.getDate() + 1);
        }
        break;
        
      default:
        throw new Error(`Unknown period type: ${periodDef.periodType}`);
    }
    
    return { start, end };
  }

  private getValueAtDate(timeline: Timeline, date: Date): Value | null {
    for (const period of timeline.periods) {
      if (date >= period.startDate && date < period.endDate) {
        return period.value || null;
      }
    }
    return null;
  }

  private performBinaryOp(left: Value, right: Value, operator: string): Value {
    if (left.type !== 'number' || right.type !== 'number') {
      throw new Error(`Cannot apply ${operator} to ${left.type} and ${right.type}`);
    }
    
    const leftVal = left.value as number;
    const rightVal = right.value as number;
    let result: number;
    
    switch (operator) {
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
        throw new Error(`Unknown operator: ${operator}`);
    }
    
    return {
      type: 'number',
      value: result,
      unit: left.unit
    };
  }

  private getFinestGranularity(
    g1: 'dag' | 'maand' | 'jaar',
    g2: 'dag' | 'maand' | 'jaar'
  ): 'dag' | 'maand' | 'jaar' {
    const order = { 'dag': 0, 'maand': 1, 'jaar': 2 };
    return order[g1] < order[g2] ? g1 : g2;
  }

  /**
   * Evaluate timeline × scalar operation.
   * Broadcasts the scalar value across all periods in the timeline.
   */
  evaluateTimelineScalarOp(
    timeline: Timeline,
    scalar: Value,
    operator: '+' | '-' | '*' | '/',
    context: RuntimeContext
  ): TimelineValue {
    const periods: Period[] = [];
    
    // Apply the operation to each period in the timeline
    for (const period of timeline.periods) {
      if (period.value) {
        // Apply binary operation between timeline value and scalar
        const resultValue = this.performBinaryOp(period.value, scalar, operator);
        
        periods.push({
          startDate: period.startDate,
          endDate: period.endDate,
          value: resultValue
        });
      } else {
        // Keep empty periods but ensure value is undefined, not null
        periods.push({
          startDate: period.startDate,
          endDate: period.endDate
          // Omit value property entirely for empty periods
        });
      }
    }
    
    // Create result timeline with same granularity
    const cleanedPeriods = removeRedundantKnips(periods, timeline.granularity);
    const resultTimeline: Timeline = {
      periods: cleanedPeriods,
      granularity: timeline.granularity
    };
    
    return {
      type: 'timeline',
      value: resultTimeline
    };
  }

  /**
   * Evaluate scalar × timeline operation.
   * Broadcasts the scalar value across all periods in the timeline.
   * Order matters for non-commutative operations (-, /).
   */
  evaluateScalarTimelineOp(
    scalar: Value,
    timeline: Timeline,
    operator: '+' | '-' | '*' | '/',
    context: RuntimeContext
  ): TimelineValue {
    const periods: Period[] = [];
    
    // Apply the operation to each period in the timeline
    for (const period of timeline.periods) {
      if (period.value) {
        // Apply binary operation between scalar and timeline value (order matters!)
        const resultValue = this.performBinaryOp(scalar, period.value, operator);
        
        periods.push({
          startDate: period.startDate,
          endDate: period.endDate,
          value: resultValue
        });
      } else {
        // For operations with empty values, follow specification rules
        // Most operations with empty values return empty
        periods.push({
          startDate: period.startDate,
          endDate: period.endDate
          // Omit value property entirely for empty periods
        });
      }
    }
    
    // Create result timeline with same granularity
    const cleanedPeriods = removeRedundantKnips(periods, timeline.granularity);
    const resultTimeline: Timeline = {
      periods: cleanedPeriods,
      granularity: timeline.granularity
    };
    
    return {
      type: 'timeline',
      value: resultTimeline
    };
  }
}