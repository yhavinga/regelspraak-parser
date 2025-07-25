import { Expression } from './expressions';

/**
 * Decision table AST nodes for RegelSpraak Beslistabel
 */

export interface DecisionTableCondition {
  type: 'DecisionTableCondition';
  headerText: string; // Original column header text
  subjectPath?: string[]; // Attribute path being tested
  operator?: string; // Comparison operator
}

export interface DecisionTableResult {
  type: 'DecisionTableResult';
  headerText: string; // Original column header text
  targetType: 'attribute'; // For now, only attribute assignments
  attributePath?: string[]; // Target attribute path
}

export interface DecisionTableRow {
  type: 'DecisionTableRow';
  rowNumber: number;
  resultExpression: Expression;
  conditionValues: (Expression | 'n.v.t.')[]; // n.v.t. = not applicable
}

export interface DecisionTable {
  type: 'DecisionTable';
  name: string;
  validity: string; // For now, always "altijd"
  resultColumn: string; // Header text for result column
  conditionColumns: string[]; // Header texts for condition columns
  rows: DecisionTableRow[];
  // Parsed headers (populated during semantic analysis)
  parsedResult?: DecisionTableResult;
  parsedConditions?: DecisionTableCondition[];
}