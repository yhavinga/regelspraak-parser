/**
 * AST nodes for expressions
 */

import { SourceLocation } from './location';

export interface Expression {
  type: string;
  location?: SourceLocation;  // Set by visitor - guaranteed to exist after parsing
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

// String interpolation (Tekstreeks) types
export interface TekstreeksText {
  type: 'TekstreeksText';
  text: string;
}

export interface TekstreeksInterpolation {
  type: 'TekstreeksInterpolation';
  expression: Expression;
}

export type TekstreeksPart = TekstreeksText | TekstreeksInterpolation;

export interface TekstreeksExpression extends Expression {
  type: 'TekstreeksExpression';
  parts: TekstreeksPart[];
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
  'is een dagsoort' | 'zijn een dagsoort' | 'is geen dagsoort' | 'zijn geen dagsoort' |
  'is numeriek met exact' | 'is niet numeriek met exact' |
  'zijn numeriek met exact' | 'zijn niet numeriek met exact';
  left: Expression;
  right: Expression;
}

export interface VariableReference extends Expression {
  type: 'VariableReference';
  variableName: string;
}

export interface ParameterReference extends Expression {
  type: 'ParameterReference';
  parameterName: string;
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

export interface AttributeReference extends Expression {
  type: 'AttributeReference';
  path: string[];
}

/**
 * @deprecated Use AttributeReference with path arrays instead.
 * NavigationExpression has been removed from the specification.
 * This interface is kept for backward compatibility with existing tests.
 */
export interface NavigationExpression extends Expression {
  type: 'NavigationExpression';
  object: Expression;
  attribute: string;
}

export interface SubselectieExpression extends Expression {
  type: 'SubselectieExpression';
  collection: Expression;
  predicaat: Predicaat;
  // Unified predicate for centralized evaluation
  predicate?: import('../predicates/predicate-types').Predicate;
}

export interface RegelStatusExpression extends Expression {
  type: 'RegelStatusExpression';
  regelNaam: string;
  check: 'gevuurd' | 'inconsistent';
}

export interface AllAttributesExpression extends Expression {
  type: 'AllAttributesExpression';
  attribute: string;  // e.g., "burgerservicenummer"
  objectType: string; // e.g., "Persoon"
}

// Predicaat types for filtering
// @deprecated Use unified predicate types from '../predicates/predicate-types' instead
export type Predicaat = KenmerkPredicaat | AttributeComparisonPredicaat | SamengesteldPredicaatNode;

// Samengesteld predicaat types (compound predicates in subselectie)
export interface SamengesteldPredicaatNode {
  type: 'SamengesteldPredicaat';
  kwantificatie: Quantifier;
  voorwaarden: GenesteVoorwaardeInPredicaat[];
  predicate: import('../predicates/predicate-types').CompoundPredicate;
  location?: SourceLocation;
}

export interface GenesteVoorwaardeInPredicaat {
  type: 'GenesteVoorwaardeInPredicaat';
  niveau: number;  // Bullet level (1 = •, 2 = ••, etc.)
  voorwaarde: VergelijkingInPredicaat | SamengesteldPredicaatNode;
  location?: SourceLocation;
}

export interface VergelijkingInPredicaat {
  type: 'VergelijkingInPredicaat';
  vergelijkingType: 'attribuut_vergelijking' | 'object_check' | 'kenmerk_check';
  onderwerp?: Expression;
  attribuut?: Expression;  // Can be AttributeReference or other expression types
  operator?: string;
  waarde?: Expression;
  kenmerkNaam?: string;
  location?: SourceLocation;
}

// @deprecated Use SimplePredicate with operator: 'kenmerk' instead
export interface KenmerkPredicaat {
  type: 'KenmerkPredicaat';
  kenmerk: string;
}

// @deprecated Use AttributePredicate from unified predicate types instead
export interface AttributeComparisonPredicaat {
  type: 'AttributeComparisonPredicaat';
  attribute: string;
  operator: string;
  value: Expression;
}

// Compound condition types
export enum QuantifierType {
  DE = 'de', // Singular form: "aan de volgende voorwaarde"
  ALLE = 'alle',
  GEEN = 'geen',
  TEN_MINSTE = 'ten_minste',
  TEN_HOOGSTE = 'ten_hoogste',
  PRECIES = 'precies'
}

export interface Quantifier {
  type: QuantifierType;
  aantal?: number; // For TEN_MINSTE, TEN_HOOGSTE, PRECIES
}

export interface SamengesteldeVoorwaarde extends Expression {
  type: 'SamengesteldeVoorwaarde';
  kwantificatie: Quantifier;
  voorwaarden: Expression[];
  // Unified predicate representation for centralized evaluation
  predicate?: import('../predicates/predicate-types').CompoundPredicate;
}

// Rounding and limiting expressions
export type RoundingDirection = 'naar_beneden' | 'naar_boven' | 'rekenkundig' | 'richting_nul' | 'weg_van_nul';

export interface AfrondingExpression extends Expression {
  type: 'AfrondingExpression';
  expression: Expression;
  direction?: RoundingDirection;
  decimals: number;
}

export interface BegrenzingExpression extends Expression {
  type: 'BegrenzingExpression';
  expression: Expression;
  minimum?: Expression;
  maximum?: Expression;
}

export interface BegrenzingAfrondingExpression extends Expression {
  type: 'BegrenzingAfrondingExpression';
  expression: Expression;
  minimum?: Expression;
  maximum?: Expression;
  direction?: RoundingDirection;
  decimals: number;
}

// Concatenation expressions
export interface ConjunctionExpression extends Expression {
  type: 'ConjunctionExpression';
  values: Expression[];
}

export interface DisjunctionExpression extends Expression {
  type: 'DisjunctionExpression';
  values: Expression[];
}