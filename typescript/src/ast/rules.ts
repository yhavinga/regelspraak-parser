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

export type ResultPart = Gelijkstelling;

export interface Gelijkstelling {
  type: 'Gelijkstelling';
  target: string; // Simplified: just the attribute name for now
  expression: Expression;
}

export interface Voorwaarde {
  type: 'Voorwaarde';
  expression: Expression; // The condition expression
}