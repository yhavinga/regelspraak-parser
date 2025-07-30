/**
 * AST nodes for Feittype (relationship types) in RegelSpraak
 */

/**
 * Represents a role in a feittype relationship
 */
export interface Rol {
  type: 'Rol';
  /** Role name (e.g., "passagier", "reis") */
  naam: string;
  /** Plural form of role name (e.g., "passagiers") */
  meervoud?: string;
  /** Object type that fulfills this role (e.g., "Natuurlijk persoon", "Vlucht") */
  objectType: string;
}

/**
 * Represents a feittype (relationship type) between object types
 */
export interface FeitType {
  type: 'FeitType';
  /** Feittype name (e.g., "vlucht van natuurlijke personen") */
  naam: string;
  /** Whether reciprocal (e.g., partner relationship) */
  wederkerig: boolean;
  /** Roles in the relationship (1 for reciprocal, 2+ for regular) */
  rollen: Rol[];
  /** Cardinality description (e.g., "Een reis betreft de verplaatsing van meerdere passagiers") */
  cardinalityDescription?: string;
}

/**
 * Model interface that includes feittypen
 */
export interface Model {
  type: 'Model';
  rules?: any[];
  objectTypes?: any[];
  parameters?: any[];
  unitSystems?: any[];
  dimensions?: any[];
  feittypen?: FeitType[];
}