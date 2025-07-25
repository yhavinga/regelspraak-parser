/**
 * AST nodes for RegelSpraak dimensions
 */

export interface Dimension {
  type: 'Dimension';
  name: string;
  plural: string;
  usageStyle: 'prepositional' | 'adjectival';
  preposition?: string;
  labels: DimensionLabel[];
}

export interface DimensionLabel {
  position: number;
  label: string;
}

export interface DimensionedAttribute {
  type: 'DimensionedAttribute';
  attribute: string;
  dimensions: string[];
}

export interface DimensionCoordinate {
  dimension: string;
  label: string;
}

export interface DimensionReference {
  type: 'DimensionReference';
  attribute: string;
  coordinates: DimensionCoordinate[];
}