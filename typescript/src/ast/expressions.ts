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

export interface BinaryExpression extends Expression {
  type: 'BinaryExpression';
  operator: '+' | '-' | '*' | '/';
  left: Expression;
  right: Expression;
}