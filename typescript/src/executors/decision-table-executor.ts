import { RuntimeContext, Value } from '../interfaces';
import { DecisionTable, DecisionTableCondition } from '../ast/decision-tables';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { Expression, StringLiteral } from '../ast/expressions';

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

  execute(table: DecisionTable, context: RuntimeContext): DecisionTableExecutionResult {
    try {
      // Parse headers if not already done
      const parsedResult = this.parseResultHeader(table.resultColumn);
      const parsedConditions = table.conditionColumns.map(col => 
        this.parseConditionHeader(col)
      );
      
      // Evaluate each row
      for (const row of table.rows) {
        if (this.evaluateRow(row, parsedConditions, context)) {
          // Row matches - execute result
          const value = this.expressionEvaluator.evaluate(row.resultExpression, context);
          
          // Set the variable in context
          const target = parsedResult.target;
          context.setVariable(target, value);
          
          return {
            success: true,
            matchedRow: row.rowNumber,
            target,
            value
          };
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

  private parseResultHeader(header: string): { target: string } {
    // Pattern: "de X van een Y moet gesteld worden op"
    // Extract X as the target, but convert spaces to underscores
    
    const cleaned = header.replace(/moet gesteld worden op$/, '').trim();
    
    // Try to match "de/het/een X [Y Z...]" pattern
    const match = cleaned.match(/^(?:de|het|een)\s+(.+?)(?:\s+van\s+|$)/);
    
    if (match) {
      // Replace spaces with underscores in multi-word attributes
      const target = match[1].replace(/\s+/g, '_').toLowerCase();
      return { target };
    }
    
    // Fallback: extract all words between article and "van" or end
    const words = cleaned.split(/\s+/);
    const startIdx = words.findIndex(w => ['de', 'het', 'een'].includes(w.toLowerCase())) + 1;
    const endIdx = words.indexOf('van') > -1 ? words.indexOf('van') : words.length;
    
    if (startIdx > 0 && startIdx < endIdx) {
      const attribute = words.slice(startIdx, endIdx).join('_').toLowerCase();
      return { target: attribute };
    }
    
    return { target: 'result' };
  }

  private parseConditionHeader(header: string): DecisionTableCondition {
    // Pattern: "indien X gelijk is aan" or "indien X groter is dan"
    
    const cleaned = header.replace(/^indien\s+/, '').trim();
    
    // Extract operator - order matters! Check longer patterns first
    let operator = '=='; // default
    if (cleaned.includes('kleiner of gelijk is aan')) {
      operator = '<=';
    } else if (cleaned.includes('groter of gelijk is aan')) {
      operator = '>=';
    } else if (cleaned.includes('kleiner is dan')) {
      operator = '<';
    } else if (cleaned.includes('groter is dan')) {
      operator = '>';
    } else if (cleaned.includes('gelijk is aan')) {
      operator = '==';
    }
    
    // Extract subject (what we're comparing)
    const subjectMatch = cleaned.match(/^(.+?)\s+(?:gelijk|groter|kleiner)/);
    const subject = subjectMatch ? subjectMatch[1] : cleaned;
    
    // Remove articles and possessives, then get attribute name
    const subjectCleaned = subject
      .replace(/^(zijn|haar|hun)\s+/, '')
      .replace(/^(de|het|een)\s+/, '');
    
    return {
      type: 'DecisionTableCondition',
      headerText: header,
      subjectPath: [subjectCleaned.toLowerCase()],
      operator
    };
  }

  private evaluateRow(
    row: any, 
    conditions: DecisionTableCondition[], 
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
      
      // Get the subject value from context
      const subjectName = condition.subjectPath![0];
      const subjectValue = context.getVariable(subjectName);
      
      if (!subjectValue) {
        return false; // Subject not found
      }
      
      // Evaluate the condition value
      const conditionValue = this.expressionEvaluator.evaluate(cellValue as Expression, context);
      
      // Compare based on operator
      if (!this.compareValues(subjectValue, conditionValue, condition.operator!)) {
        return false;
      }
    }
    
    return true; // All conditions matched
  }

  private compareValues(left: Value, right: Value, operator: string): boolean {
    // Handle string comparison
    if (left.type === 'string' && right.type === 'string') {
      switch (operator) {
        case '==': return left.value === right.value;
        case '!=': return left.value !== right.value;
        default: return false;
      }
    }
    
    // Handle number comparison
    if (left.type === 'number' && right.type === 'number') {
      switch (operator) {
        case '==': return left.value === right.value;
        case '!=': return left.value !== right.value;
        case '>': return left.value > right.value;
        case '>=': return left.value >= right.value;
        case '<': return left.value < right.value;
        case '<=': return left.value <= right.value;
        default: return false;
      }
    }
    
    // Type mismatch
    return false;
  }
}