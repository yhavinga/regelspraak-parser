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

export type ResultPart = Gelijkstelling | ObjectCreation | MultipleResults | Kenmerktoekenning | Consistentieregel | Verdeling;

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

export interface Consistentieregel {
  type: 'Consistentieregel';
  criteriumType: 'uniek' | 'inconsistent';
  target?: Expression;  // For uniqueness checks (e.g., "de BSN")
  condition?: Expression;  // For conditional inconsistency
}

// Distribution method types
export interface VerdelingMethode {
  type: string;
}

export interface VerdelingGelijkeDelen extends VerdelingMethode {
  type: 'VerdelingGelijkeDelen';
}

export interface VerdelingNaarRato extends VerdelingMethode {
  type: 'VerdelingNaarRato';
  ratioExpression: Expression;
}

export interface VerdelingOpVolgorde extends VerdelingMethode {
  type: 'VerdelingOpVolgorde';
  orderDirection: 'toenemende' | 'afnemende';
  orderExpression: Expression;
}

export interface VerdelingTieBreak extends VerdelingMethode {
  type: 'VerdelingTieBreak';
  tieBreakMethod: VerdelingMethode;
}

export interface VerdelingMaximum extends VerdelingMethode {
  type: 'VerdelingMaximum';
  maxExpression: Expression;
}

export interface VerdelingAfronding extends VerdelingMethode {
  type: 'VerdelingAfronding';
  decimals: number;
  roundDirection: 'naar beneden' | 'naar boven';
}

export interface Verdeling {
  type: 'Verdeling';
  sourceAmount: Expression;  // What to distribute
  targetCollection: Expression;  // Collection to distribute over
  distributionMethods: VerdelingMethode[];  // Methods and constraints
  remainderTarget?: Expression;  // Where to store remainder
}

export interface RegelGroep {
  type: 'RegelGroep';
  name: string;
  isRecursive: boolean;
  rules: Rule[];  // The rules contained in this group
}