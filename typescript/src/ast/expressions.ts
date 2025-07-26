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
  operator: '+' | '-' | '*' | '/' | '==' | '!=' | '>' | '<' | '>=' | '<=' | '&&' | '||';
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

export interface UnaryExpression extends Expression {
  type: 'UnaryExpression';
  operator: '-' | '!';
  operand: Expression;
}

export interface AggregationExpression extends Expression {
  type: 'AggregationExpression';
  aggregationType: 'som' | 'aantal' | 'maximum' | 'minimum' | 'eerste' | 'laatste';
  target: Expression | Expression[];
  dimensionRange?: {
    dimension: string;
    from: string;
    to: string;
  };
}

export interface NavigationExpression extends Expression {
  type: 'NavigationExpression';
  attribute: string;
  object: Expression;
}

export interface SubselectieExpression extends Expression {
  type: 'SubselectieExpression';
  collection: Expression;
  predicaat: Predicaat;
}

// Predicaat types for filtering
export type Predicaat = KenmerkPredicaat | AttributeComparisonPredicaat;

export interface KenmerkPredicaat {
  type: 'KenmerkPredicaat';
  kenmerk: string;
}

export interface AttributeComparisonPredicaat {
  type: 'AttributeComparisonPredicaat';
  attribute: string;
  operator: string;
  value: Expression;
}