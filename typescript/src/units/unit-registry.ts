import { UnitSystem, BaseUnit } from './base-unit';
import { CompositeUnit } from './composite-unit';

/**
 * Registry of all unit systems in the domain
 */
export class UnitRegistry {
  private systems: Map<string, UnitSystem> = new Map();

  constructor() {
    this.initStandardSystems();
  }

  /**
   * Initialize standard unit systems from the specification
   * Uses hub-and-spoke pattern: all units have toBaseFactor relative to base unit
   */
  private initStandardSystems(): void {
    // Time system (Tijd) - base unit: seconde
    const timeSystem = new UnitSystem("Tijd");

    // Base unit: seconde (toBaseFactor = 1)
    timeSystem.addUnit({
      name: "seconde",
      plural: "seconden",
      abbreviation: "s",
      toBaseFactor: 1  // Base unit
    });

    timeSystem.addUnit({
      name: "milliseconde",
      plural: "milliseconden",
      abbreviation: "ms",
      toBaseFactor: 0.001  // 1 ms = 0.001 s
    });

    timeSystem.addUnit({
      name: "minuut",
      plural: "minuten",
      abbreviation: "minuut",
      toBaseFactor: 60  // 1 min = 60 s
    });

    timeSystem.addUnit({
      name: "uur",
      plural: "uren",
      abbreviation: "u",
      toBaseFactor: 3600  // 1 hr = 3600 s
    });

    timeSystem.addUnit({
      name: "dag",
      plural: "dagen",
      abbreviation: "dg",
      toBaseFactor: 86400  // 1 day = 86400 s
    });

    timeSystem.addUnit({
      name: "week",
      plural: "weken",
      abbreviation: "wk",
      toBaseFactor: 604800  // 7 days = 604800 s
    });

    timeSystem.addUnit({
      name: "maand",
      plural: "maanden",
      abbreviation: "mnd",
      toBaseFactor: 2629746  // Average month (30.44 days)
    });

    timeSystem.addUnit({
      name: "kwartaal",
      plural: "kwartalen",
      abbreviation: "kw",
      toBaseFactor: 7889238  // 3 months
    });

    timeSystem.addUnit({
      name: "jaar",
      plural: "jaren",
      abbreviation: "jr",
      toBaseFactor: 31556952  // Average year (365.25 days)
    });

    this.systems.set("Tijd", timeSystem);

    // Currency system (Valuta) - no conversions between currencies
    // Each currency is its own base (toBaseFactor = 1)
    const currencySystem = new UnitSystem("Valuta");

    currencySystem.addUnit({
      name: "euro",
      plural: "euros",
      abbreviation: "EUR",
      symbol: "€",
      toBaseFactor: 1  // Base for euro
    });

    currencySystem.addUnit({
      name: "dollar",
      plural: "dollars",
      abbreviation: "USD",
      symbol: "$",
      toBaseFactor: 1  // Base for dollar (no cross-currency conversion)
    });

    this.systems.set("Valuta", currencySystem);
  }

  /**
   * Add a new unit system
   */
  addSystem(system: UnitSystem): void {
    this.systems.set(system.name, system);
  }

  /**
   * Get a unit system by name
   */
  getSystem(name: string): UnitSystem | undefined {
    return this.systems.get(name);
  }

  /**
   * Find a unit across all systems
   */
  findUnit(identifier: string): { unit: BaseUnit; system: UnitSystem } | undefined {
    for (const system of this.systems.values()) {
      const unit = system.findUnit(identifier);
      if (unit) {
        return { unit, system };
      }
    }
    return undefined;
  }

  /**
   * Check if two units are compatible (same system)
   */
  areUnitsCompatible(unit1: string, unit2: string): boolean {
    const result1 = this.findUnit(unit1);
    const result2 = this.findUnit(unit2);

    if (!result1 || !result2) {
      return false;
    }

    return result1.system.name === result2.system.name;
  }

  /**
   * Convert a value between units
   */
  convert(value: number, fromUnit: string, toUnit: string): number | undefined {
    const result1 = this.findUnit(fromUnit);
    const result2 = this.findUnit(toUnit);

    if (!result1 || !result2) {
      return undefined;
    }

    if (result1.system.name !== result2.system.name) {
      return undefined; // Can't convert between different systems
    }

    return result1.system.convert(value, fromUnit, toUnit);
  }
}