import { Engine, Context } from '../../src';
import { UnitRegistry, CompositeUnit } from '../../src/units';

describe('Units and Dimensions', () => {
  describe('UnitRegistry', () => {
    let registry: UnitRegistry;

    beforeEach(() => {
      registry = new UnitRegistry();
    });

    test('should have standard time units', () => {
      const timeSystem = registry.getSystem('Tijd');
      expect(timeSystem).toBeDefined();
      
      // Check various time units
      expect(timeSystem!.findUnit('uur')).toBeDefined();
      expect(timeSystem!.findUnit('u')).toBeDefined(); // abbreviation
      expect(timeSystem!.findUnit('dag')).toBeDefined();
      expect(timeSystem!.findUnit('dagen')).toBeDefined(); // plural
      expect(timeSystem!.findUnit('jaar')).toBeDefined();
      expect(timeSystem!.findUnit('jr')).toBeDefined(); // abbreviation
    });

    test('should have standard currency units', () => {
      const currencySystem = registry.getSystem('Valuta');
      expect(currencySystem).toBeDefined();
      
      expect(currencySystem!.findUnit('euro')).toBeDefined();
      expect(currencySystem!.findUnit('€')).toBeDefined(); // symbol
      expect(currencySystem!.findUnit('EUR')).toBeDefined(); // abbreviation
    });

    test('should convert between time units', () => {
      // 1 hour = 60 minutes
      expect(registry.convert(1, 'uur', 'minuut')).toBe(60);
      // 2 hours = 120 minutes
      expect(registry.convert(2, 'uur', 'minuut')).toBe(120);
      // 30 minutes = 0.5 hour
      expect(registry.convert(30, 'minuut', 'uur')).toBe(0.5);
    });

    test('should check unit compatibility', () => {
      expect(registry.areUnitsCompatible('uur', 'minuut')).toBe(true);
      expect(registry.areUnitsCompatible('dag', 'jaar')).toBe(true);
      expect(registry.areUnitsCompatible('euro', 'EUR')).toBe(true);
      expect(registry.areUnitsCompatible('uur', 'euro')).toBe(false);
    });
  });

  describe('CompositeUnit', () => {
    test('should parse simple units', () => {
      const unit = CompositeUnit.parse('km');
      expect(unit.numerator).toEqual([['km', 1]]);
      expect(unit.denominator).toEqual([]);
    });

    test('should parse division units', () => {
      const unit = CompositeUnit.parse('km/u');
      expect(unit.numerator).toEqual([['km', 1]]);
      expect(unit.denominator).toEqual([['u', 1]]);
    });

    test('should parse units with powers', () => {
      const unit = CompositeUnit.parse('m/s^2');
      expect(unit.numerator).toEqual([['m', 1]]);
      expect(unit.denominator).toEqual([['s', 2]]);
    });

    test('should normalize units', () => {
      const unit1 = new CompositeUnit([['m', 1], ['s', 1]], [['s', 1]]);
      const normalized = unit1.normalize();
      expect(normalized.numerator).toEqual([['m', 1]]);
      expect(normalized.denominator).toEqual([]);
    });

    test('should multiply units', () => {
      const unit1 = CompositeUnit.parse('kW');
      const unit2 = CompositeUnit.parse('u');
      const result = unit1.multiply(unit2);
      expect(result.toString()).toBe('kW*u');
    });

    test('should divide units', () => {
      const unit1 = CompositeUnit.parse('km');
      const unit2 = CompositeUnit.parse('u');
      const result = unit1.divide(unit2);
      expect(result.toString()).toBe('km/u');
    });
  });

  describe('Engine - Unit Arithmetic', () => {
    let engine: Engine;
    let context: Context;

    beforeEach(() => {
      engine = new Engine();
      context = new Context();
    });

    test('should fail adding incompatible units', () => {
      context.setVariable('afstand', { type: 'number', value: 10, unit: { name: 'km' } });
      context.setVariable('tijd', { type: 'number', value: 2, unit: { name: 'uur' } });
      
      const result = engine.run('afstand plus tijd', context);
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('incompatible units');
    });

    test('should add compatible units with conversion', () => {
      context.setVariable('tijd1', { type: 'number', value: 1, unit: { name: 'uur' } });
      context.setVariable('tijd2', { type: 'number', value: 30, unit: { name: 'minuut' } });
      
      const result = engine.run('tijd1 plus tijd2', context);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 1.5, // 1 hour + 30 minutes = 1.5 hours
        unit: { name: 'uur' }
      });
    });

    test('should multiply to create composite units', () => {
      context.setVariable('vermogen', { type: 'number', value: 5, unit: { name: 'kW' } });
      context.setVariable('tijd', { type: 'number', value: 2, unit: { name: 'u' } });
      
      const result = engine.run('vermogen maal tijd', context);
      
      expect(result.success).toBe(true);
      expect(result.value?.value).toBe(10);
      // Should have composite unit kW*u
      const unitValue = result.value as any;
      expect(unitValue.compositeUnit?.toString()).toBe('kW*u');
    });

    test('should divide to create composite units', () => {
      context.setVariable('afstand', { type: 'number', value: 100, unit: { name: 'km' } });
      context.setVariable('tijd', { type: 'number', value: 2, unit: { name: 'u' } });
      
      const result = engine.run('afstand gedeeld door tijd', context);
      
      expect(result.success).toBe(true);
      expect(result.value?.value).toBe(50);
      // Should have composite unit km/u
      const unitValue = result.value as any;
      expect(unitValue.compositeUnit?.toString()).toBe('km/u');
    });

    test('should preserve units with unary minus', () => {
      context.setVariable('bedrag', { type: 'number', value: 100, unit: { name: 'euro', symbol: '€' } });
      
      const result = engine.run('min bedrag', context);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: -100,
        unit: { name: 'euro', symbol: '€' }
      });
    });
  });
});