import { Value } from '../interfaces/value';
import { CompositeUnit } from './composite-unit';
import { UnitRegistry } from './unit-registry';

/**
 * Extended value interface with composite unit support
 */
export interface UnitValue extends Value {
  compositeUnit?: CompositeUnit;
}

/**
 * Create a value with unit information
 */
export function createUnitValue(
  value: number,
  unit?: string,
  registry?: UnitRegistry
): UnitValue {
  if (!unit) {
    return { type: 'number', value };
  }

  // Parse composite unit
  const compositeUnit = CompositeUnit.parse(unit);
  
  // For simple units, also store the unit info
  if (compositeUnit.numerator.length === 1 && 
      compositeUnit.denominator.length === 0 &&
      compositeUnit.numerator[0][1] === 1) {
    const unitName = compositeUnit.numerator[0][0];
    const unitInfo = registry?.findUnit(unitName);
    
    return {
      type: 'number',
      value,
      unit: unitInfo ? { name: unitInfo.unit.name, symbol: unitInfo.unit.symbol } : { name: unitName },
      compositeUnit
    };
  }

  return {
    type: 'number',
    value,
    compositeUnit
  };
}

/**
 * Perform arithmetic operations with unit handling
 */
export function performUnitArithmetic(
  operation: '+' | '-' | '*' | '/',
  left: UnitValue,
  right: UnitValue,
  registry: UnitRegistry
): UnitValue {
  switch (operation) {
    case '+':
    case '-':
      return performAdditionSubtraction(operation, left, right, registry);
    case '*':
      return performMultiplication(left, right);
    case '/':
      return performDivision(left, right);
  }
}

function performAdditionSubtraction(
  operation: '+' | '-',
  left: UnitValue,
  right: UnitValue,
  registry: UnitRegistry
): UnitValue {
  // Both must have compatible units or no units
  const leftUnit = getSimpleUnit(left);
  const rightUnit = getSimpleUnit(right);

  if (!leftUnit && !rightUnit) {
    // No units, simple arithmetic
    const value = operation === '+' ? left.value + right.value : left.value - right.value;
    return { type: 'number', value };
  }

  if (!leftUnit || !rightUnit) {
    throw new Error(`Cannot ${operation === '+' ? 'add' : 'subtract'} values with incompatible units`);
  }

  // Check if units are compatible
  if (!registry.areUnitsCompatible(leftUnit, rightUnit)) {
    throw new Error(`Cannot ${operation === '+' ? 'add' : 'subtract'} incompatible units: ${leftUnit} and ${rightUnit}`);
  }

  // Convert right to left's unit if needed
  let rightValue = right.value;
  if (leftUnit !== rightUnit) {
    const converted = registry.convert(right.value, rightUnit, leftUnit);
    if (converted === undefined) {
      throw new Error(`Cannot convert from ${rightUnit} to ${leftUnit}`);
    }
    rightValue = converted;
  }

  const value = operation === '+' ? left.value + rightValue : left.value - rightValue;
  return {
    type: 'number',
    value,
    unit: left.unit,
    compositeUnit: left.compositeUnit
  };
}

function performMultiplication(left: UnitValue, right: UnitValue): UnitValue {
  const value = left.value * right.value;

  // Get composite units, creating them from simple units if needed
  const leftComposite = getCompositeUnit(left);
  const rightComposite = getCompositeUnit(right);

  // No units
  if (!leftComposite && !rightComposite) {
    return { type: 'number', value };
  }

  // One has unit
  if (!leftComposite) {
    return {
      type: 'number',
      value,
      compositeUnit: rightComposite
    };
  }
  if (!rightComposite) {
    return {
      type: 'number',
      value,
      compositeUnit: leftComposite
    };
  }

  // Both have units - multiply them
  const compositeUnit = leftComposite.multiply(rightComposite);
  
  return {
    type: 'number',
    value,
    compositeUnit: compositeUnit.isDimensionless() ? undefined : compositeUnit
  };
}

function performDivision(left: UnitValue, right: UnitValue): UnitValue {
  if (right.value === 0) {
    throw new Error('Division by zero');
  }

  const value = left.value / right.value;

  // Get composite units, creating them from simple units if needed
  const leftComposite = getCompositeUnit(left);
  const rightComposite = getCompositeUnit(right);

  // No units
  if (!leftComposite && !rightComposite) {
    return { type: 'number', value };
  }

  // Create composite units if needed
  const leftUnit = leftComposite || new CompositeUnit();
  const rightUnit = rightComposite || new CompositeUnit();

  // Divide units
  const compositeUnit = leftUnit.divide(rightUnit);
  
  return {
    type: 'number',
    value,
    compositeUnit: compositeUnit.isDimensionless() ? undefined : compositeUnit
  };
}

/**
 * Get composite unit from a value, creating it from simple unit if needed
 */
function getCompositeUnit(value: UnitValue): CompositeUnit | undefined {
  if (value.compositeUnit) {
    return value.compositeUnit;
  }
  
  if (value.unit) {
    // Create composite unit from simple unit
    return new CompositeUnit([[value.unit.name, 1]], []);
  }
  
  return undefined;
}

/**
 * Get simple unit name from a value (if it has one)
 */
function getSimpleUnit(value: UnitValue): string | undefined {
  if (value.unit) {
    return value.unit.name;
  }
  
  if (value.compositeUnit &&
      value.compositeUnit.numerator.length === 1 &&
      value.compositeUnit.denominator.length === 0 &&
      value.compositeUnit.numerator[0][1] === 1) {
    return value.compositeUnit.numerator[0][0];
  }
  
  return undefined;
}