/**
 * Base unit representation within a unit system
 */
export interface BaseUnit {
  name: string;  // e.g., "meter"
  plural?: string;  // e.g., "meters"
  abbreviation?: string;  // e.g., "m"
  symbol?: string;  // e.g., "€"
  // Conversion factor to another unit in same system
  conversionFactor?: number;
  conversionToUnit?: string;  // Target unit name for conversion
}

/**
 * Unit system (eenheidssysteem) with its base units
 */
export class UnitSystem {
  constructor(
    public name: string,  // e.g., "Tijd", "Valuta", "Afstand"
    private baseUnits: Map<string, BaseUnit> = new Map(),
    private abbreviationMap: Map<string, string> = new Map(),
    private symbolMap: Map<string, string> = new Map()
  ) {}

  addUnit(unit: BaseUnit): void {
    this.baseUnits.set(unit.name, unit);
    if (unit.abbreviation) {
      this.abbreviationMap.set(unit.abbreviation, unit.name);
    }
    if (unit.symbol) {
      this.symbolMap.set(unit.symbol, unit.name);
    }
    if (unit.plural) {
      this.baseUnits.set(unit.plural, unit);
    }
  }

  findUnit(identifier: string): BaseUnit | undefined {
    // Direct name lookup
    if (this.baseUnits.has(identifier)) {
      return this.baseUnits.get(identifier);
    }
    // Abbreviation lookup
    if (this.abbreviationMap.has(identifier)) {
      const unitName = this.abbreviationMap.get(identifier)!;
      return this.baseUnits.get(unitName);
    }
    // Symbol lookup
    if (this.symbolMap.has(identifier)) {
      const unitName = this.symbolMap.get(identifier)!;
      return this.baseUnits.get(unitName);
    }
    return undefined;
  }

  /**
   * Convert a value from one unit to another within this system
   */
  convert(value: number, fromUnit: string, toUnit: string): number | undefined {
    const from = this.findUnit(fromUnit);
    const to = this.findUnit(toUnit);
    
    if (!from || !to) {
      return undefined;
    }

    // Same unit
    if (from.name === to.name) {
      return value;
    }

    // Direct conversion path
    if (from.conversionToUnit === to.name && from.conversionFactor) {
      return value * from.conversionFactor;
    }

    // Reverse conversion
    if (to.conversionToUnit === from.name && to.conversionFactor) {
      return value / to.conversionFactor;
    }

    // TODO: Implement multi-step conversion through intermediate units
    return undefined;
  }
}