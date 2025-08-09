/**
 * AST nodes for object type definitions in RegelSpraak
 */

import { SourceLocation } from './location';

export interface ObjectTypeDefinition {
  type: 'ObjectTypeDefinition';
  name: string;
  plural?: string[];
  animated?: boolean; // bezield
  members: ObjectTypeMember[];
  location?: SourceLocation;  // Set by visitor - guaranteed to exist after parsing
}

export type ObjectTypeMember = KenmerkSpecification | AttributeSpecification;

export interface KenmerkSpecification {
  type: 'KenmerkSpecification';
  name: string;
  kenmerkType?: 'bijvoeglijk' | 'bezittelijk';
}

export interface AttributeSpecification {
  type: 'AttributeSpecification';
  name: string;
  dataType: DataType | DomainReference;
  unit?: string;
  dimensions?: string[];
  timeline?: boolean;
}

export type DataType = 
  | { type: 'Tekst' }
  | { type: 'Numeriek'; specification?: string }
  | { type: 'Boolean' }
  | { type: 'Datum' }
  | { type: 'DatumTijd' };

export interface DomainReference {
  type: 'DomainReference';
  domain: string;
}