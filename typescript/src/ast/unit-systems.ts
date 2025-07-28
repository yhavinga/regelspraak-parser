/**
 * AST nodes for unit system (eenheidsysteem) definitions in RegelSpraak
 */

export interface UnitSystemDefinition {
  type: 'UnitSystemDefinition';
  name: string;
  units: UnitDefinition[];
}

export interface UnitDefinition {
  name: string;
  plural?: string;
  abbreviation: string;
  symbol?: string;
  conversion?: UnitConversion;
}

export interface UnitConversion {
  factor: number;
  toUnit: string;
}