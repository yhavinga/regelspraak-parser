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
   */
  private initStandardSystems(): void {
    // Time system (Tijd)
    const timeSystem = new UnitSystem("Tijd");
    
    timeSystem.addUnit({
      name: "milliseconde",
      plural: "milliseconden",
      abbreviation: "ms",
      conversionFactor: 0.001,
      conversionToUnit: "seconde"
    });
    
    timeSystem.addUnit({
      name: "seconde",
      plural: "seconden",
      abbreviation: "s",
      conversionFactor: 1/60,
      conversionToUnit: "minuut"
    });
    
    timeSystem.addUnit({
      name: "minuut",
      plural: "minuten",
      abbreviation: "minuut",
      conversionFactor: 1/60,
      conversionToUnit: "uur"
    });
    
    timeSystem.addUnit({
      name: "uur",
      plural: "uren",
      abbreviation: "u",
      conversionFactor: 1/24,
      conversionToUnit: "dag"
    });
    
    timeSystem.addUnit({
      name: "dag",
      plural: "dagen",
      abbreviation: "dg"
    });
    
    timeSystem.addUnit({
      name: "week",
      plural: "weken",
      abbreviation: "wk",
      conversionFactor: 7,
      conversionToUnit: "dag"
    });
    
    timeSystem.addUnit({
      name: "maand",
      plural: "maanden",
      abbreviation: "mnd"
      // No conversion to days
    });
    
    timeSystem.addUnit({
      name: "kwartaal",
      plural: "kwartalen",
      abbreviation: "kw",
      conversionFactor: 3,
      conversionToUnit: "maand"
    });
    
    timeSystem.addUnit({
      name: "jaar",
      plural: "jaren",
      abbreviation: "jr",
      conversionFactor: 365.25,
      conversionToUnit: "dag"
    });
    
    this.systems.set("Tijd", timeSystem);

    // Currency system (Valuta)
    const currencySystem = new UnitSystem("Valuta");
    
    currencySystem.addUnit({
      name: "euro",
      plural: "euros",
      abbreviation: "EUR",
      symbol: "€"
    });
    
    currencySystem.addUnit({
      name: "dollar",
      plural: "dollars", 
      abbreviation: "USD",
      symbol: "$"
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