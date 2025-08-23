import { Value, RuntimeContext } from '../interfaces';
import { AggregationExpression, Expression } from '../ast/expressions';
import { ExpressionEvaluator } from './expression-evaluator';

/**
 * Engine for evaluating aggregation expressions in RegelSpraak
 */
export class AggregationEngine {
  constructor(private expressionEvaluator: any) {}

  evaluate(expr: AggregationExpression, context: RuntimeContext): Value {
    // Collect values to aggregate
    const values = this.collectValues(expr.target, context);
    
    // Apply dimension range filtering if specified
    const filteredValues = expr.dimensionRange 
      ? this.filterByDimensionRange(values, expr.dimensionRange, context)
      : values;
    
    // Perform aggregation
    return this.aggregate(filteredValues, expr.aggregationType);
  }

  private collectValues(target: Expression | Expression[], context: RuntimeContext): Value[] {
    if (Array.isArray(target)) {
      // Multiple expressions (e.g., "de som van X, Y en Z")
      return target.map(expr => this.expressionEvaluator.evaluate(expr, context));
    } else {
      // Single expression - might return a collection
      const result = this.expressionEvaluator.evaluate(target, context);
      
      // If it's a list, extract all values
      if (result.type === 'list' && Array.isArray(result.value)) {
        return result.value as Value[];
      } else {
        // Single value - for dimensional objects, return it as-is
        return [result];
      }
    }
  }

  private filterByDimensionRange(
    values: Value[], 
    range: { dimension: string; from: string; to: string },
    context: RuntimeContext
  ): Value[] {
    // Get the dimension registry to validate and get label positions
    const registry = context.dimensionRegistry;

    // Infer axis if not provided
    let axis = range.dimension;
    if (!axis) {
      axis = registry.findAxisForLabel(range.from) || registry.findAxisForLabel(range.to) || '';
    }
    
    // Get the labels that fall within the specified range
    const labelsInRange = axis ? registry.getLabelsInRange(axis, range.from, range.to) : [];
    
    if (labelsInRange.length === 0) {
      // Invalid range or dimension - return empty array
      return [];
    }
    
    // Filter values based on whether they correspond to labels in the range
    // This assumes values are structured with dimension coordinates
    const filteredValues: Value[] = [];
    
    for (const value of values) {
      // Check if this value has dimension coordinates that match our range
      // For now, we'll handle the simple case where values are directly keyed by dimension labels
      // In a more complete implementation, we'd need to handle complex dimensional structures
      
      if (value.type === 'object' && value.value) {
        // Check if the object has values for the dimension labels in range
        const objValue = value.value as Record<string, any>;
        
        for (const label of labelsInRange) {
          if (label in objValue) {
            // Found a value for this label - include it
            const labelValue = objValue[label];
            if (typeof labelValue === 'number') {
              filteredValues.push({ type: 'number', value: labelValue });
            } else if (labelValue && typeof labelValue === 'object' && 'type' in labelValue) {
              filteredValues.push(labelValue);
            } else if (labelValue && typeof labelValue === 'object') {
              // Plain object leaf value (e.g., could wrap numbers) -> try to coerce numeric
              const maybeNumber = (labelValue as any).value ?? labelValue;
              if (typeof maybeNumber === 'number') {
                filteredValues.push({ type: 'number', value: maybeNumber });
              }
            }
          }
        }
      } else {
        // For non-dimensional values, include them as-is if no filtering is needed
        // This handles cases where the aggregation target isn't actually dimensional
        filteredValues.push(value);
      }
    }
    
    return filteredValues;
  }

  private aggregate(values: Value[], type: string): Value {
    if (values.length === 0) {
      throw new Error('Cannot aggregate empty collection');
    }

    switch (type) {
      case 'som':
        return this.sum(values);
      case 'aantal':
        return this.count(values);
      case 'maximum':
        return this.maximum(values);
      case 'minimum':
        return this.minimum(values);
      case 'eerste':
        return this.first(values);
      case 'laatste':
        return this.last(values);
      default:
        throw new Error(`Unknown aggregation type: ${type}`);
    }
  }

  private sum(values: Value[]): Value {
    // Ensure all values are numbers
    const numbers = values.map(v => {
      if (v.type !== 'number') {
        throw new Error(`Cannot sum ${v.type} values`);
      }
      return v.value as number;
    });

    return {
      type: 'number',
      value: numbers.reduce((acc, n) => acc + n, 0)
    };
  }

  private count(values: Value[]): Value {
    return {
      type: 'number',
      value: values.length
    };
  }

  private maximum(values: Value[]): Value {
    // Ensure all values are numbers
    const numbers = values.map(v => {
      if (v.type !== 'number') {
        throw new Error(`Cannot find maximum of ${v.type} values`);
      }
      return v.value as number;
    });

    return {
      type: 'number',
      value: Math.max(...numbers)
    };
  }

  private minimum(values: Value[]): Value {
    // Ensure all values are numbers
    const numbers = values.map(v => {
      if (v.type !== 'number') {
        throw new Error(`Cannot find minimum of ${v.type} values`);
      }
      return v.value as number;
    });

    return {
      type: 'number',
      value: Math.min(...numbers)
    };
  }

  private first(values: Value[]): Value {
    return values[0];
  }

  private last(values: Value[]): Value {
    return values[values.length - 1];
  }
}