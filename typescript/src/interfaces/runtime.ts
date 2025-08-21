import { Value } from './value';
import { FeitType } from '../ast/feittype';

// Relationship interface (minimal definition)
export interface Relationship {
  feittypeNaam: string;
  subject: Value;
  object: Value;
  preposition?: string;
}

/**
 * Runtime context for execution
 */
export interface RuntimeContext {
  // Variable management
  getVariable(name: string): Value | undefined;
  setVariable(name: string, value: Value): void;
  
  // Scope management
  pushScope(): void;
  popScope(): void;
  
  // Parameter access
  getParameter(name: string): Value | undefined;
  
  // Object access
  getObject(type: string, id: string): any | undefined;
  createObject(type: string, id: string, attributes: Record<string, Value>): void;
  
  // Timeline evaluation context
  evaluation_date: Date;
  
  // Current instance context
  current_instance?: Value;
  
  // Feittype and relationship management
  registerFeittype?(feittype: FeitType): void;
  getFeittype?(naam: string): FeitType | undefined;
  getAllFeittypen?(): FeitType[];
  findFeittypeByRole?(roleName: string): FeitType | undefined;
  addRelationship?(feittypeNaam: string, subject: Value, object: Value, preposition?: string): Relationship;
  getRelationships?(feittypeNaam: string, subject: Value): Relationship[];
  findRelationships?(criteria: { subject?: Value; object?: Value; feittypeNaam?: string }): Relationship[];
}