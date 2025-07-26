/**
 * Value types in RegelSpraak
 */
export type ValueType = 'number' | 'string' | 'boolean' | 'date' | 'object' | 'list' | 'array' | 'null' | 'timeline';

/**
 * Unit information for numeric values
 */
export interface Unit {
  name: string;
  symbol?: string;
}

/**
 * Base value interface
 */
export interface Value {
  type: ValueType;
  value: any;
  unit?: Unit;
}