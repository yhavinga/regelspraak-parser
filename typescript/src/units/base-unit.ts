/**
 * Base unit representation within a unit system
 * 
 * Units use a hub-and-spoke conversion model:
 * - Each unit has a `toBaseFactor` that converts it to the system's base unit
 * - Any conversion becomes: (value * fromUnit.toBaseFactor) / toUnit.toBaseFactor
 * - This enables O(1) conversion between any two units in the same system
 */
export interface BaseUnit {
  name: string;  // e.g., "meter"
  plural?: string;  // e.g., "meters"
  abbreviation?: string;  // e.g., "m"
  symbol?: string;  // e.g., "€"

  /**
   * Conversion factor to the system's base unit.
   * Multiply by this factor to get the value in base units.
   * Default is 1 for the base unit itself.
   * 
   * Example for time system (base = seconde):
   * - milliseconde: 0.001 (1 ms = 0.001 s)
   * - minuut: 60 (1 min = 60 s)
   * - uur: 3600 (1 hr = 3600 s)
   */
  toBaseFactor?: number;

  // Legacy fields - kept for backward compatibility with existing definitions
  // These are still used when toBaseFactor is not available
  conversionFactor?: number;
  conversionToUnit?: string;
}

/**
 * Unit system (eenheidssysteem) with its base units
 * 
 * Uses hub-and-spoke conversion: all units convert through a common base unit.
 */
export class UnitSystem {
  constructor(
    public name: string,  // e.g., "Tijd", "Valuta", "Afstand"
    private baseUnits: Map<string, BaseUnit> = new Map(),
    private abbreviationMap: Map<string, string> = new Map(),
    private symbolMap: Map<string, string> = new Map()
  ) { }

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
   * Convert a value from one unit to another within this system.
   * 
   * Uses hub-and-spoke pattern:
   * 1. Convert from source unit to base unit: value * fromUnit.toBaseFactor
   * 2. Convert from base unit to target: baseValue / toUnit.toBaseFactor
   * 
   * Falls back to legacy edge-to-edge conversion if toBaseFactor is not available.
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

    // Hub-and-spoke conversion (preferred)
    const fromBaseFactor = from.toBaseFactor;
    const toBaseFactor = to.toBaseFactor;

    if (fromBaseFactor !== undefined && toBaseFactor !== undefined) {
      // Convert to base unit, then to target unit
      const baseValue = value * fromBaseFactor;
      return baseValue / toBaseFactor;
    }

    // Legacy: Direct conversion path (for backward compatibility)
    if (from.conversionToUnit === to.name && from.conversionFactor) {
      return value * from.conversionFactor;
    }

    // Legacy: Reverse conversion
    if (to.conversionToUnit === from.name && to.conversionFactor) {
      return value / to.conversionFactor;
    }

    // No conversion path available
    return undefined;
  }
}