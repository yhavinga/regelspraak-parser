import { Expression } from './expressions';

/**
 * Decision table AST nodes for RegelSpraak Beslistabel
 */

export interface DecisionTableCondition {
  type: 'DecisionTableCondition';
  headerText: string; // Original column header text
  subjectExpression?: Expression; // The expression to evaluate for the subject
  operator?: string; // Comparison operator
  isKenmerkCheck?: boolean; // Whether this is a kenmerk check
  kenmerkName?: string; // Name of kenmerk for kenmerk checks
}

export interface DecisionTableResult {
  type: 'DecisionTableResult';
  headerText: string; // Original column header text
  targetType: 'attribute' | 'kenmerk'; // Type of assignment
  targetExpression?: Expression; // The target expression to assign to
  kenmerkName?: string; // Name of kenmerk for kenmerk assignments
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