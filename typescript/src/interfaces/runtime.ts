import { Value } from './value';

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
}