import { Value, RuntimeContext } from '../interfaces';
import { Timeline, Period, TimelineValue, TimelineExpression, PeriodDefinition } from '../ast/timelines';
import { Expression } from '../ast/expressions';
import { ExpressionEvaluator } from './expression-evaluator';

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
        return period.value;
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
    operator: '+' | '-' | '*' | '/' | '==' | '!=' | '>' | '<' | '>=' | '<=',
    context: RuntimeContext
  ): TimelineValue {
    // Check if operator is valid for timeline operations
    if (['==', '!=', '>', '<', '>=', '<='].includes(operator)) {
      throw new Error(`Comparison operator ${operator} not supported for timeline operations`);
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
    
    if (targetValue.type !== 'timeline') {
      throw new Error('totaal operation requires a timeline value');
    }
    
    const timelineValue = targetValue as any as TimelineValue;
    const timeline = timelineValue.value;
    
    // Sum all values in the timeline
    let total = 0;
    for (const period of timeline.periods) {
      if (period.value.type !== 'number') {
        throw new Error('Cannot sum non-numeric timeline values');
      }
      total += period.value.value as number;
    }
    
    return {
      type: 'number',
      value: total,
      unit: timeline.periods[0]?.value.unit
    };
  }

  private evaluateAantalDagen(expr: TimelineExpression, context: RuntimeContext): Value {
    // Count days that satisfy the condition
    if (!expr.condition) {
      throw new Error('aantal_dagen requires a condition');
    }
    
    // This is a simplified implementation
    // Full implementation would evaluate the condition for each day
    return {
      type: 'number',
      value: 0
    };
  }

  private evaluateNaarVerhouding(expr: TimelineExpression, context: RuntimeContext): Value {
    // Calculate prorated value based on time duration
    // This is a placeholder implementation
    return {
      type: 'number',
      value: 0
    };
  }

  private getValueAtDate(timeline: Timeline, date: Date): Value | null {
    for (const period of timeline.periods) {
      if (date >= period.startDate && date < period.endDate) {
        return period.value;
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
}