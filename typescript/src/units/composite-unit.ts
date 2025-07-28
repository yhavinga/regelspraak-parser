/**
 * Represents a composite unit like km/h or m/s^2
 */
export class CompositeUnit {
  constructor(
    // List of (unit, power) pairs in numerator
    public numerator: Array<[string, number]> = [],
    // List of (unit, power) pairs in denominator
    public denominator: Array<[string, number]> = []
  ) {}

  /**
   * Parse a unit expression like "km/h" or "m/s^2"
   */
  static parse(unitExpr: string): CompositeUnit {
    const parts = unitExpr.split('/');
    const numerator: Array<[string, number]> = [];
    const denominator: Array<[string, number]> = [];

    // Parse numerator
    if (parts[0]) {
      const numParts = parts[0].split('*');
      for (const part of numParts) {
        const [unit, power] = parseUnitWithPower(part.trim());
        if (unit) {
          numerator.push([unit, power]);
        }
      }
    }

    // Parse denominator
    if (parts[1]) {
      const denParts = parts[1].split('*');
      for (const part of denParts) {
        const [unit, power] = parseUnitWithPower(part.trim());
        if (unit) {
          denominator.push([unit, power]);
        }
      }
    }

    return new CompositeUnit(numerator, denominator);
  }

  /**
   * Normalize by canceling out matching units
   */
  normalize(): CompositeUnit {
    const numCounts = new Map<string, number>();
    const denCounts = new Map<string, number>();

    // Count total powers
    for (const [unit, power] of this.numerator) {
      numCounts.set(unit, (numCounts.get(unit) || 0) + power);
    }
    for (const [unit, power] of this.denominator) {
      denCounts.set(unit, (denCounts.get(unit) || 0) + power);
    }

    // Cancel out matching units
    const newNum: Array<[string, number]> = [];
    const newDen: Array<[string, number]> = [];

    // Process remaining numerator units
    for (const [unit, totalPower] of numCounts) {
      const denPower = denCounts.get(unit) || 0;
      const remaining = totalPower - denPower;
      if (remaining > 0) {
        newNum.push([unit, remaining]);
      } else if (remaining < 0) {
        newDen.push([unit, -remaining]);
      }
    }

    // Process denominator units not in numerator
    for (const [unit, power] of denCounts) {
      if (!numCounts.has(unit)) {
        newDen.push([unit, power]);
      }
    }

    return new CompositeUnit(newNum, newDen);
  }

  /**
   * Multiply two composite units
   */
  multiply(other: CompositeUnit): CompositeUnit {
    const newNum = [...this.numerator, ...other.numerator];
    const newDen = [...this.denominator, ...other.denominator];
    return new CompositeUnit(newNum, newDen).normalize();
  }

  /**
   * Divide by another composite unit
   */
  divide(other: CompositeUnit): CompositeUnit {
    const newNum = [...this.numerator, ...other.denominator];
    const newDen = [...this.denominator, ...other.numerator];
    return new CompositeUnit(newNum, newDen).normalize();
  }

  /**
   * Check if this is a dimensionless unit (all canceled out)
   */
  isDimensionless(): boolean {
    const normalized = this.normalize();
    return normalized.numerator.length === 0 && normalized.denominator.length === 0;
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    if (this.isDimensionless()) {
      return "";
    }

    const numParts = this.numerator.map(([unit, power]) => 
      power === 1 ? unit : `${unit}^${power}`
    );

    if (this.denominator.length === 0) {
      return numParts.join("*");
    }

    const denParts = this.denominator.map(([unit, power]) => 
      power === 1 ? unit : `${unit}^${power}`
    );

    const numStr = numParts.length > 0 ? numParts.join("*") : "1";
    const denStr = denParts.join("*");

    return `${numStr}/${denStr}`;
  }

  /**
   * Check if two composite units are equal
   */
  equals(other: CompositeUnit): boolean {
    const norm1 = this.normalize();
    const norm2 = other.normalize();

    if (norm1.numerator.length !== norm2.numerator.length ||
        norm1.denominator.length !== norm2.denominator.length) {
      return false;
    }

    // Check numerator
    const num1Map = new Map(norm1.numerator);
    for (const [unit, power] of norm2.numerator) {
      if (num1Map.get(unit) !== power) {
        return false;
      }
    }

    // Check denominator
    const den1Map = new Map(norm1.denominator);
    for (const [unit, power] of norm2.denominator) {
      if (den1Map.get(unit) !== power) {
        return false;
      }
    }

    return true;
  }
}

/**
 * Parse a unit with optional power (e.g., "m^2" or "s^-1")
 */
function parseUnitWithPower(unitStr: string): [string, number] {
  const match = unitStr.match(/^([a-zA-Z]+)\^(-?\d+)$/);
  if (match) {
    return [match[1], parseInt(match[2])];
  }
  return [unitStr, 1];
}