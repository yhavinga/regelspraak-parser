import { RuntimeContext, Value } from '../interfaces';
import { DecisionTable, DecisionTableCondition, DecisionTableResult } from '../ast/decision-tables';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { Expression, StringLiteral, AttributeReference } from '../ast/expressions';
import { DecisionTableHeaderParser, ParsedCondition, ParsedResult } from '../parsers/decision-table-header-parser';
import { UnitRegistry, performUnitArithmetic, UnitValue } from '../units';
import { setValueAtPath } from '../utils/navigation';

export interface DecisionTableExecutionResult {
  success: boolean;
  matchedRow?: number;
  target?: string;
  value?: Value;
  error?: Error;
}

/**
 * Executes RegelSpraak decision tables
 */
export class DecisionTableExecutor {
  private expressionEvaluator = new ExpressionEvaluator();
  private headerParser = new DecisionTableHeaderParser();
  private unitRegistry = new UnitRegistry();

  execute(table: DecisionTable, context: RuntimeContext): DecisionTableExecutionResult {
    try {
      // Parse headers using structured parser
      const parsedResult = this.headerParser.parseResultColumn(table.resultColumn);
      if (!parsedResult) {
        throw new Error(`Failed to parse result column: ${table.resultColumn}`);
      }

      const parsedConditions = table.conditionColumns.map(col => {
        const parsed = this.headerParser.parseConditionColumn(col);
        if (!parsed) {
          throw new Error(`Failed to parse condition column: ${col}`);
        }
        return parsed;
      });

      // Evaluate each row
      for (const row of table.rows) {
        if (this.evaluateRow(row, parsedConditions, context)) {
          // Row matches - execute result
          const value = this.expressionEvaluator.evaluate(row.resultExpression, context);

          // Get current_instance from context (set by engine during iteration)
          const currentInstance = (context as any).current_instance;

          // Set the attribute on current_instance or fall back to variable
          if (parsedResult.targetType === 'attribute' && parsedResult.targetExpression) {
            const targetName = this.extractTargetName(parsedResult.targetExpression);

            // Store on current_instance if available (object-scoped decision table)
            if (currentInstance && currentInstance.value) {
              const objData = currentInstance.value as Record<string, Value>;
              objData[targetName] = value;
            } else {
              // Fallback for non-object-scoped tables
              context.setVariable(targetName, value);
            }

            return {
              success: true,
              matchedRow: row.rowNumber,
              target: targetName,
              value
            };
          } else if (parsedResult.targetType === 'kenmerk') {
            // For kenmerk assignments, set the characteristic on current_instance
            const targetName = parsedResult.kenmerkName || 'kenmerk';

            if (currentInstance && currentInstance.value) {
              const objData = currentInstance.value as Record<string, Value>;
              objData[targetName] = value;
            } else {
              context.setVariable(targetName, value);
            }

            return {
              success: true,
              matchedRow: row.rowNumber,
              target: targetName,
              value
            };
          }

          throw new Error('Unknown target type in decision table result');
        }
      }

      // No matching row found
      return {
        success: false,
        error: new Error('No matching row in decision table')
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error
      };
    }
  }

  private extractTargetName(expr: Expression): string {
    // Extract a simple name from the target expression for storage
    switch (expr.type) {
      case 'AttributeReference':
        const path = (expr as any).path;
        // Use the last path element (attribute name) for storage
        // E.g., ['Natuurlijk persoon', 'woonregio factor'] -> 'woonregio factor'
        return path.length > 0 ? path[path.length - 1] : 'result';
      case 'VariableReference':
        return (expr as any).variableName;
      default:
        return 'result';
    }
  }

  private evaluateRow(
    row: any,
    conditions: ParsedCondition[],
    context: RuntimeContext
  ): boolean {
    // Check all conditions
    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i];
      const cellValue = row.conditionValues[i];

      // Skip n.v.t. conditions
      if (cellValue === 'n.v.t.') {
        continue;
      }

      // Handle kenmerk checks specially
      if (condition.isKenmerkCheck) {
        // For kenmerk checks, the cell value should be 'waar' or 'onwaar'
        const expectedValue = cellValue === 'waar' ||
          (cellValue as any)?.value === true ||
          cellValue === true;
        if (!expectedValue) {
          return false;
        }
        continue;
      }

      // Evaluate the subject expression
      const subjectValue = this.expressionEvaluator.evaluate(condition.subjectExpression, context);

      if (!subjectValue || subjectValue.type === 'null') {
        return false; // Subject not found or null
      }

      // Handle DisjunctionExpression with empty values array (parser bug workaround)
      // Extract string values directly from the cell value's location
      let conditionValue: Value;
      const cellExpr = cellValue as any;
      if (cellExpr.type === 'DisjunctionExpression' &&
          (!cellExpr.values || cellExpr.values.length === 0) &&
          cellExpr.location) {
        // Get source text from context if available
        const sourceText = (context as any).sourceText || (context as any).domainModel?.sourceText;
        if (sourceText) {
          const lines = sourceText.split('\n');
          const line = lines[cellExpr.location.startLine - 1];
          if (line) {
            const cellText = line.substring(cellExpr.location.startColumn - 1, cellExpr.location.endColumn);
            // Extract quoted strings from the cell text
            const stringMatches = cellText.match(/'[^']+'/g);
            if (stringMatches && stringMatches.length > 0) {
              const values: Value[] = stringMatches.map((s: string) => ({
                type: 'string' as const,
                value: s.replace(/'/g, '')
              }));
              conditionValue = { type: 'array', value: values };
            } else {
              conditionValue = { type: 'array', value: [] };
            }
          } else {
            conditionValue = { type: 'array', value: [] };
          }
        } else {
          // Fallback: evaluate normally (will return empty array)
          conditionValue = this.expressionEvaluator.evaluate(cellValue as Expression, context);
        }
      } else {
        // Evaluate the condition value normally
        conditionValue = this.expressionEvaluator.evaluate(cellValue as Expression, context);
      }

      // Compare based on operator
      if (!this.compareValues(subjectValue, conditionValue, condition.operator)) {
        return false;
      }
    }

    return true; // All conditions matched
  }

  private compareValues(left: Value, right: Value, operator: string): boolean {
    // Handle disjunction (array) comparison - check if left value matches any in the array
    if (right.type === 'array') {
      const values = right.value as Value[];
      if (values.length === 0) {
        return false; // Empty array means no match possible
      }
      // Check if left matches any of the values in the array
      for (const val of values) {
        if (this.compareValues(left, val, operator)) {
          return true;
        }
      }
      return false;
    }

    // Handle unit values - extract numeric values and units
    const leftValue = this.extractNumericValue(left);
    const rightValue = this.extractNumericValue(right);

    // Handle string comparison
    if (left.type === 'string' && right.type === 'string') {
      switch (operator) {
        case '==': return left.value === right.value;
        case '!=': return left.value !== right.value;
        default: return false;
      }
    }

    // Handle boolean comparison
    if (left.type === 'boolean' && right.type === 'boolean') {
      switch (operator) {
        case '==': return left.value === right.value;
        case '!=': return left.value !== right.value;
        default: return false;
      }
    }

    // Handle numeric comparison (including units)
    if (leftValue !== null && rightValue !== null) {
      // If both have units, ensure they're compatible
      if ((left as any).unit && (right as any).unit) {
        const leftUnit = (left as any).unit;
        const rightUnit = (right as any).unit;

        // Check unit compatibility
        if (leftUnit.system !== rightUnit.system) {
          return false; // Incompatible units
        }

        // TODO: Implement proper unit conversion
        // For now, just compare the numeric values if units match
        if (leftUnit.name !== rightUnit.name) {
          // Try to convert units
          const converted = this.convertUnits(rightValue, rightUnit, leftUnit);
          if (converted !== null) {
            return this.compareNumericValues(leftValue, converted, operator);
          }
          return false;
        }
      }

      return this.compareNumericValues(leftValue, rightValue, operator);
    }

    // Handle enum/domain values
    // Note: enum is not a standard ValueType, but may be used for domain values
    if ((left as any).type === 'enum' && (right as any).type === 'enum') {
      switch (operator) {
        case '==': return left.value === right.value;
        case '!=': return left.value !== right.value;
        default: return false;
      }
    }

    // Type mismatch - try loose equality for GELIJK_AAN
    if (operator === '==') {
      return left.value == right.value; // Note: loose equality
    }

    return false;
  }

  private extractNumericValue(value: Value): number | null {
    if (value.type === 'number') {
      return value.value as number;
    }
    // Check if it's a unit value with numeric component
    if ((value as any).unit && typeof value.value === 'number') {
      return value.value as number;
    }
    return null;
  }

  private compareNumericValues(left: number, right: number, operator: string): boolean {
    switch (operator) {
      case '==': return left === right;
      case '!=': return left !== right;
      case '>': return left > right;
      case '>=': return left >= right;
      case '<': return left < right;
      case '<=': return left <= right;
      default: return false;
    }
  }

  private convertUnits(value: number, fromUnit: any, toUnit: any): number | null {
    // Simple unit conversion for common cases
    // This should ideally use the UnitRegistry

    // For now, handle simple same-system conversions
    if (fromUnit.system === 'Geld' && toUnit.system === 'Geld') {
      // All money units are typically in the same base (euro)
      return value;
    }

    if (fromUnit.system === 'Tijd' && toUnit.system === 'Tijd') {
      // Time conversions
      const conversions: Record<string, number> = {
        'dag': 1,
        'week': 7,
        'maand': 30, // Approximate
        'jaar': 365  // Approximate
      };

      const fromFactor = conversions[fromUnit.name] || 1;
      const toFactor = conversions[toUnit.name] || 1;

      return value * fromFactor / toFactor;
    }

    // Unable to convert
    return null;
  }
}