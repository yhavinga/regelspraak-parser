/**
 * Unified predicate types for centralized predicate representation
 * Consolidates predicates used in subselectie, conditions, and compound conditions
 */

import { Expression, QuantifierType } from '../ast/expressions';
import { SourceLocation } from '../ast/location';

// Re-export for convenience - canonical definition is in ast/expressions
export { QuantifierType } from '../ast/expressions';

// Base predicate interface
export interface Predicate {
  type: string;
  location?: SourceLocation;
}

// Simple predicates for basic comparisons and checks
export interface SimplePredicate extends Predicate {
  type: 'SimplePredicate';
  operator: PredicateOperator;
  left?: Expression;  // For comparisons
  right?: Expression; // For comparisons
  kenmerk?: string;   // For kenmerk checks
  dagsoort?: string;  // For dagsoort checks  
  digits?: number;    // For numeriek exact checks
  negated?: boolean;  // For negated forms (e.g., "is niet", "voldoet niet aan")
}

// Predicate operators that can be used in SimplePredicate
export type PredicateOperator = 
  // Comparison operators
  | '==' | '!=' | '>' | '<' | '>=' | '<='
  // Special checks
  | 'kenmerk'        // heeft/is kenmerk
  | 'dagsoort'       // is een dagsoort
  | 'elfproef'       // voldoet aan de elfproef
  | 'uniek'          // moeten uniek zijn
  | 'numeriek_exact' // is numeriek met exact N cijfers
  | 'gevuurd'        // regel is gevuurd
  | 'inconsistent';  // regel is inconsistent

// CompoundPredicate uses QuantifierType from ast/expressions
export interface CompoundPredicate extends Predicate {
  type: 'CompoundPredicate';
  quantifier: QuantifierType;
  count?: number;  // For ten_minste, ten_hoogste, precies
  predicates: Predicate[];  // Nested predicates
}

// Negation predicate wrapper
export interface NotPredicate extends Predicate {
  type: 'NotPredicate';
  predicate: Predicate;
}

// Attribute comparison for subselectie (DIE/DAT patterns)
export interface AttributePredicate extends Predicate {
  type: 'AttributePredicate';
  attribute: string;
  operator: ComparisonOperator;
  value: Expression;
}

export type ComparisonOperator = '==' | '!=' | '>' | '<' | '>=' | '<=';

// Type guards for runtime type checking
export function isSimplePredicate(pred: Predicate): pred is SimplePredicate {
  return pred.type === 'SimplePredicate';
}

export function isCompoundPredicate(pred: Predicate): pred is CompoundPredicate {
  return pred.type === 'CompoundPredicate';
}

export function isNotPredicate(pred: Predicate): pred is NotPredicate {
  return pred.type === 'NotPredicate';
}

export function isAttributePredicate(pred: Predicate): pred is AttributePredicate {
  return pred.type === 'AttributePredicate';
}

// Conversion utilities for migration from old types
export interface LegacyKenmerkPredicaat {
  type: 'KenmerkPredicaat';
  kenmerk: string;
}

export interface LegacyAttributeComparisonPredicaat {
  type: 'AttributeComparisonPredicaat';
  attribute: string;
  operator: string;
  value: Expression;
}

export function fromLegacyKenmerkPredicaat(legacy: LegacyKenmerkPredicaat): SimplePredicate {
  return {
    type: 'SimplePredicate',
    operator: 'kenmerk',
    kenmerk: legacy.kenmerk
  };
}

export function fromLegacyAttributeComparison(legacy: LegacyAttributeComparisonPredicaat): AttributePredicate {
  return {
    type: 'AttributePredicate',
    attribute: legacy.attribute,
    operator: legacy.operator as ComparisonOperator,
    value: legacy.value
  };
}