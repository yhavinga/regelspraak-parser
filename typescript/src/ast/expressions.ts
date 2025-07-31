/**
 * AST nodes for expressions
 */

export interface Expression {
  type: string;
}

export interface NumberLiteral extends Expression {
  type: 'NumberLiteral';
  value: number;
  unit?: string;
}

export interface StringLiteral extends Expression {
  type: 'StringLiteral';
  value: string;
}

export interface Literal extends Expression {
  type: 'Literal';
  value: any;
  datatype?: string;
}

export interface BooleanLiteral extends Expression {
  type: 'BooleanLiteral';
  value: boolean;
}

export interface BinaryExpression extends Expression {
  type: 'BinaryExpression';
  operator: '+' | '-' | '*' | '/' | '==' | '!=' | '>' | '<' | '>=' | '<=' | '&&' | '||' |
            'is een dagsoort' | 'zijn een dagsoort' | 'is geen dagsoort' | 'zijn geen dagsoort';
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
  unitConversion?: string; // e.g., "jaren", "maanden", "dagen"
}

export interface UnaryExpression extends Expression {
  type: 'UnaryExpression';
  operator: '-' | '!' | 'niet' | 'voldoet aan de elfproef' | 'voldoen aan de elfproef' | 
            'voldoet niet aan de elfproef' | 'voldoen niet aan de elfproef' | 'moeten uniek zijn';
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

export interface AttributeReference extends Expression {
  type: 'AttributeReference';
  path: string[];
}

export interface SubselectieExpression extends Expression {
  type: 'SubselectieExpression';
  collection: Expression;
  predicaat: Predicaat;
}

export interface AllAttributesExpression extends Expression {
  type: 'AllAttributesExpression';
  attribute: string;  // e.g., "burgerservicenummer"
  objectType: string; // e.g., "Persoon"
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