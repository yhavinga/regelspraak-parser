import { RuntimeContext, Value } from '../interfaces';

/**
 * Implementation of runtime context
 */
export class Context implements RuntimeContext {
  private scopes: Map<string, Value>[] = [new Map()];
  private objects: Map<string, Map<string, any>> = new Map();
  private executionTrace: string[] = [];
  private objectCounter: number = 0;

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
}