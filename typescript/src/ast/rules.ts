/**
 * AST nodes for RegelSpraak rules
 */

import { Expression } from './expressions';

export interface Rule {
  type: 'Rule';
  name: string;
  version: RuleVersion;
  result: ResultPart;
  condition?: Voorwaarde; // Optional condition (indien X)
}

export interface RuleVersion {
  type: 'RuleVersion';
  validity: 'altijd' | 'vanaf' | 'tot'; // Simplified for now
}

export type ResultPart = Gelijkstelling | ObjectCreation | MultipleResults | Kenmerktoekenning;

export interface Gelijkstelling {
  type: 'Gelijkstelling';
  target: string; // Simplified: just the attribute name for now
  expression: Expression;
}

export interface ObjectCreation {
  type: 'ObjectCreation';
  objectType: string;
  attributeInits: Array<{
    attribute: string;
    value: Expression;
  }>;
}

export interface MultipleResults {
  type: 'MultipleResults';
  results: ResultPart[];
}

export interface Kenmerktoekenning {
  type: 'Kenmerktoekenning';
  subject: Expression; // The object to assign the characteristic to
  characteristic: string; // The kenmerk name
}

export interface Voorwaarde {
  type: 'Voorwaarde';
  expression: Expression; // The condition expression
}