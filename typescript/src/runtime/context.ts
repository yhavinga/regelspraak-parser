import { RuntimeContext, Value } from '../interfaces';
import { FeitType } from '../ast/feittype';

/**
 * Represents a relationship instance between two objects
 */
export interface Relationship {
  feittypeNaam: string;  // The type of relationship
  subject: Value;        // The subject of the relationship (must be object type)
  object: Value;         // The object of the relationship (must be object type)
  preposition?: string;  // "MET" or "TOT" (optional)
}

/**
 * Implementation of runtime context
 */
export class Context implements RuntimeContext {
  private scopes: Map<string, Value>[] = [new Map()];
  private objects: Map<string, Map<string, any>> = new Map();
  private executionTrace: string[] = [];
  private objectCounter: number = 0;
  public current_instance: Value | undefined;
  public evaluation_date: Date = new Date();
  
  // Store relationships between objects
  private relationships: Relationship[] = [];
  
  // Store Feittype definitions
  private feittypen: Map<string, FeitType> = new Map();

  getVariable(name: string): Value | undefined {
    // Search from innermost to outermost scope
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      const value = this.scopes[i].get(name);
      if (value !== undefined) {
        return value;
      }
    }
    return undefined;
  }

  setVariable(name: string, value: Value): void {
    // Set in current scope
    this.scopes[this.scopes.length - 1].set(name, value);
  }

  pushScope(): void {
    this.scopes.push(new Map());
  }

  popScope(): void {
    if (this.scopes.length > 1) {
      this.scopes.pop();
    }
  }

  getParameter(name: string): Value | undefined {
    // For now, parameters are just variables in the global scope
    return this.scopes[0].get(name);
  }

  getObject(type: string, id: string): any | undefined {
    const typeMap = this.objects.get(type);
    return typeMap?.get(id);
  }

  createObject(type: string, id: string, attributes: Record<string, Value>): void {
    if (!this.objects.has(type)) {
      this.objects.set(type, new Map());
    }
    this.objects.get(type)!.set(id, attributes);
  }

  getObjectsByType(type: string): Value[] {
    const typeMap = this.objects.get(type);
    if (!typeMap) {
      return [];
    }
    
    const result: Value[] = [];
    for (const [id, attributes] of typeMap.entries()) {
      result.push({
        type: 'object',
        objectType: type,
        objectId: id,
        value: attributes
      } as any);
    }
    return result;
  }

  addExecutionTrace(message: string): void {
    this.executionTrace.push(message);
  }

  getExecutionTrace(): string[] {
    return [...this.executionTrace];
  }

  generateObjectId(type: string): string {
    this.objectCounter++;
    return `${type}_${this.objectCounter}`;
  }
  
  getEvaluationDate(): Date {
    return this.evaluation_date;
  }
  
  setEvaluationDate(date: Date): void {
    this.evaluation_date = date;
  }
  
  setCurrentInstance(instance: Value | undefined): void {
    this.current_instance = instance;
  }
  
  // --- Feittype Handling ---
  
  /**
   * Register a Feittype definition
   */
  registerFeittype(feittype: FeitType): void {
    this.feittypen.set(feittype.naam, feittype);
  }
  
  /**
   * Get a Feittype definition by name
   */
  getFeittype(naam: string): FeitType | undefined {
    return this.feittypen.get(naam);
  }
  
  // --- Relationship Handling ---
  
  /**
   * Creates and stores a relationship between two objects
   */
  addRelationship(feittypeNaam: string, subject: Value, object: Value, preposition: string = 'MET'): Relationship {
    if (subject.type !== 'object' || object.type !== 'object') {
      throw new Error('Relationships can only be created between objects');
    }
    
    const relationship: Relationship = {
      feittypeNaam,
      subject,
      object,
      preposition
    };
    
    this.relationships.push(relationship);
    return relationship;
  }
  
  /**
   * Find relationships matching the given criteria
   */
  findRelationships(criteria: {
    subject?: Value;
    object?: Value;
    feittypeNaam?: string;
  }): Relationship[] {
    return this.relationships.filter(rel => {
      if (criteria.subject && rel.subject !== criteria.subject) {
        return false;
      }
      if (criteria.object && rel.object !== criteria.object) {
        return false;
      }
      if (criteria.feittypeNaam && rel.feittypeNaam !== criteria.feittypeNaam) {
        return false;
      }
      return true;
    });
  }
  
  /**
   * Get objects related to the given subject via the specified feittype
   */
  getRelatedObjects(subject: Value, feittypeNaam: string, asSubject: boolean = true): Value[] {
    if (subject.type !== 'object') {
      return [];
    }
    
    const related: Value[] = [];
    for (const rel of this.relationships) {
      if (rel.feittypeNaam !== feittypeNaam) {
        continue;
      }
      
      // Check if objects match by comparing their identities
      const subjectMatches = this.objectsMatch(rel.subject, subject);
      const objectMatches = this.objectsMatch(rel.object, subject);
      
      if (asSubject && subjectMatches) {
        related.push(rel.object);
      } else if (!asSubject && objectMatches) {
        related.push(rel.subject);
      }
    }
    return related;
  }
  
  /**
   * Helper to check if two object values represent the same object
   */
  private objectsMatch(obj1: Value, obj2: Value): boolean {
    if (obj1.type !== 'object' || obj2.type !== 'object') {
      return false;
    }
    
    // Compare by objectType and objectId if available
    const o1 = obj1 as any;
    const o2 = obj2 as any;
    
    if (o1.objectType && o2.objectType && o1.objectType !== o2.objectType) {
      return false;
    }
    
    if (o1.objectId && o2.objectId) {
      return o1.objectId === o2.objectId;
    }
    
    // If no IDs, compare by reference
    return obj1 === obj2;
  }
}