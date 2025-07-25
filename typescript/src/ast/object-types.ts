/**
 * AST nodes for object type definitions in RegelSpraak
 */

export interface ObjectTypeDefinition {
  type: 'ObjectTypeDefinition';
  name: string;
  plural?: string[];
  animated?: boolean; // bezield
  members: ObjectTypeMember[];
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
  | { type: 'tekst' }
  | { type: 'geheel getal' }
  | { type: 'getal' }
  | { type: 'bedrag' }
  | { type: 'datum' }
  | { type: 'percentage' }
  | { type: 'waarheidswaarde' };

export interface DomainReference {
  type: 'DomainReference';
  domain: string;
}