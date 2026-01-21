import { DecisionTable, DecisionTableRow } from '../ast/decision-tables';
import { Expression, NumberLiteral, StringLiteral, VariableReference } from '../ast/expressions';

/**
 * Parser for RegelSpraak decision tables (Beslistabel)
 */
export class DecisionTableParser {
  private lines: string[];
  private currentLine: number = 0;

  constructor(input: string) {
    this.lines = input.split('\n');
  }

  parseDecisionTable(): DecisionTable {
    // Parse "Beslistabel <name>"
    const firstLine = this.lines[this.currentLine]?.trim();
    if (!firstLine || !firstLine.startsWith('Beslistabel ')) {
      throw new Error('Expected "Beslistabel" keyword');
    }
    
    const name = firstLine.substring(12).trim();
    if (!name) {
      throw new Error('Decision table name missing');
    }
    this.currentLine++;
    
    // Parse validity "geldig altijd"
    if (this.currentLine >= this.lines.length) {
      throw new Error('Expected "geldig" keyword');
    }
    
    const validityLine = this.lines[this.currentLine].trim();
    if (!validityLine.startsWith('geldig ')) {
      throw new Error('Expected "geldig" keyword');
    }
    
    const validity = validityLine.substring(7).trim();
    if (validity !== 'altijd') {
      throw new Error('Only "geldig altijd" supported for now');
    }
    this.currentLine++;
    
    // Parse table header
    const headerLine = this.findNextTableLine();
    if (!headerLine) {
      throw new Error('Expected table header');
    }
    
    const { resultColumn, conditionColumns } = this.parseHeader(headerLine);
    
    // Skip separator line
    const separatorLine = this.findNextTableLine();
    if (!separatorLine || !separatorLine.includes('-')) {
      throw new Error('Expected separator line');
    }
    
    // Parse rows
    const rows: DecisionTableRow[] = [];
    let rowLine: string | null;
    
    while ((rowLine = this.findNextTableLine()) !== null) {
      const row = this.parseRow(rowLine, conditionColumns.length);
      if (row) {
        rows.push(row);
      }
    }
    
    return {
      type: 'DecisionTable',
      name,
      validity,
      resultColumn,
      conditionColumns,
      rows
    };
  }

  private findNextTableLine(): string | null {
    while (this.currentLine < this.lines.length) {
      const line = this.lines[this.currentLine];
      this.currentLine++;
      
      // Skip empty lines
      if (!line.trim()) continue;
      
      // Table lines start with |
      if (line.trim().startsWith('|')) {
        return line;
      }
    }
    return null;
  }

  private parseHeader(line: string): { resultColumn: string; conditionColumns: string[] } {
    // Split by pipe but keep all parts (including empty ones)
    const allParts = line.split('|').map(p => p.trim());
    
    // Remove leading and trailing empty parts
    while (allParts.length > 0 && allParts[0] === '') {
      allParts.shift();
    }
    while (allParts.length > 0 && allParts[allParts.length - 1] === '') {
      allParts.pop();
    }
    
    // Skip the first part if it's empty (row number column) 
    const parts = allParts[0] === '' ? allParts.slice(1) : allParts;
    
    if (parts.length < 2) {
      throw new Error('Table header must have at least result column and one condition column');
    }
    
    const resultColumn = parts[0];
    const conditionColumns = parts.slice(1);
    
    return { resultColumn, conditionColumns };
  }

  private parseRow(line: string, expectedConditions: number): DecisionTableRow | null {
    const parts = line.split('|').map(p => p.trim()).filter(p => p);
    
    if (parts.length < 2 + expectedConditions) {
      return null; // Invalid row
    }
    
    // First part is row number
    const rowNumber = parseInt(parts[0]);
    if (isNaN(rowNumber)) {
      return null;
    }
    
    // Second part is result expression
    const resultExpression = this.parseExpression(parts[1]);
    
    // Remaining parts are condition values
    const conditionValues: (Expression | 'n.v.t.')[] = [];
    for (let i = 2; i < parts.length && i < 2 + expectedConditions; i++) {
      const value = parts[i];
      if (value === 'n.v.t.') {
        conditionValues.push('n.v.t.');
      } else {
        conditionValues.push(this.parseExpression(value));
      }
    }
    
    return {
      type: 'DecisionTableRow',
      rowNumber,
      resultExpression,
      conditionValues
    };
  }

  private parseExpression(text: string): Expression {
    const trimmed = text.trim();
    
    // Try to parse as number
    const num = parseFloat(trimmed);
    if (!isNaN(num)) {
      return {
        type: 'NumberLiteral',
        value: num
      } as NumberLiteral;
    }
    
    // Parse string literal (single quotes)
    if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
      return {
        type: 'StringLiteral',
        value: trimmed.slice(1, -1)
      } as StringLiteral;
    }
    
    // Parse EUR amounts (e.g., "10 EUR")
    const eurMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s+EUR$/);
    if (eurMatch) {
      return {
        type: 'NumberLiteral',
        value: parseFloat(eurMatch[1])
      } as NumberLiteral;
    }

    // Parse percentage literal (e.g., "50%", "10,5%")
    const percentMatch = trimmed.match(/^(\d+(?:[.,]\d+)?)\s*%$/);
    if (percentMatch) {
      return {
        type: 'NumberLiteral',
        value: parseFloat(percentMatch[1].replace(',', '.'))
      } as NumberLiteral;
    }

    // Otherwise treat as variable reference
    // Clean up common articles
    const cleaned = trimmed.replace(/^(de|het|een)\s+/i, '');
    const words = cleaned.split(/\s+/);
    
    return {
      type: 'VariableReference',
      variableName: words.join('_').toLowerCase()
    } as VariableReference;
  }
}