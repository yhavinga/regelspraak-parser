/**
 * AST nodes for expressions
 */

export interface Expression {
  type: string;
}

export interface NumberLiteral extends Expression {
  type: 'NumberLiteral';
  value: number;
}

export interface StringLiteral extends Expression {
  type: 'StringLiteral';
  value: string;
}

export interface BinaryExpression extends Expression {
  type: 'BinaryExpression';
  operator: '+' | '-' | '*' | '/';
  left: Expression;
  right: Expression;
}

export interface VariableReference extends Expression {
  type: 'VariableReference';
  variableName: string;
}

export interface FunctionCall extends Expression {
  type: 'FunctionCall';
  functionName: string;
  arguments: Expression[];
}