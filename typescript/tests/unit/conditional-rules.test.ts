import { Engine } from '../../src';

describe('Engine - Conditional Rules', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('parsing conditional rules', () => {
    test('should parse rule with simple condition', () => {
      const source = `Regel bereken bonus
geldig altijd
De bonus van een berekening moet berekend worden als 100
indien de verkoop groter is dan 1000.`;
      
      const result = engine.parse(source);
      
      if (!result.success) {
        console.log('Parse error:', result.errors);
      }
      
      expect(result.success).toBe(true);
      expect(result.ast).toMatchObject({
        type: 'Rule',
        name: 'bereken bonus',
        result: {
          type: 'Gelijkstelling',
          target: {
            type: 'AttributeReference',
            path: ['berekening', 'bonus']  // Dutch right-to-left navigation: object-first
          },
          expression: {
            type: 'NumberLiteral',
            value: 100
          }
        },
        condition: {
          type: 'Voorwaarde',
          expression: {
            type: 'BinaryExpression',
            operator: '>',
            left: { type: 'VariableReference', variableName: 'verkoop' },
            right: { type: 'NumberLiteral', value: 1000 }
          }
        }
      });
    });

    test('should parse rule with equality condition', () => {
      const source = `Regel geef korting
geldig altijd
Het kortingspercentage van een berekening moet berekend worden als 10
indien de klanttype gelijk is aan "premium".`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.condition).toMatchObject({
        type: 'Voorwaarde',
        expression: {
          type: 'BinaryExpression',
          operator: '==',
          left: { type: 'VariableReference', variableName: 'klanttype' },
          right: { type: 'StringLiteral', value: 'premium' }
        }
      });
    });

    test('should parse rule with boolean condition', () => {
      const source = `Regel activeer gratis verzending
geldig altijd
De verzendkosten van een berekening moet berekend worden als 0
indien de isVIP.`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.condition).toMatchObject({
        type: 'Voorwaarde',
        expression: {
          type: 'VariableReference',
          variableName: 'isVIP'
        }
      });
    });

    test('should parse rule without condition', () => {
      const source = `Regel bereken basis
geldig altijd
Het resultaat van een berekening moet berekend worden als 42.`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.condition).toBeUndefined();
    });
  });

  describe('executing conditional rules', () => {
    test('should execute rule when condition is true', () => {
      const source = `Regel bereken bonus
geldig altijd
De bonus van een berekening moet berekend worden als 100
indien de verkoop groter is dan 1000.`;
      
      const result = engine.evaluate(source, { verkoop: 1500 });
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 100
      });
    });

    test('should skip rule when condition is false', () => {
      const source = `Regel bereken bonus
geldig altijd
De bonus van een berekening moet berekend worden als 100
indien de verkoop groter is dan 1000.`;
      
      const result = engine.evaluate(source, { verkoop: 500 });
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'string',
        value: 'Rule skipped: Condition evaluated to false'
      });
    });

    test('should handle boolean conditions', () => {
      const source = `Regel activeer gratis verzending
geldig altijd
De verzendkosten van een berekening moet berekend worden als 0
indien de isVIP.`;
      
      // When isVIP is true
      let result = engine.evaluate(source, { isVIP: true });
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 0
      });
      
      // When isVIP is false
      result = engine.evaluate(source, { isVIP: false });
      expect(result.success).toBe(true);
      expect(result.value?.value).toContain('Rule skipped');
    });

    test('should handle logical operators in conditions', () => {
      const source = `Regel bereken super bonus
geldig altijd
De bonus van een klant moet berekend worden als 500
indien de verkoop groter is dan 1000 en de klanttype gelijk is aan "premium".`;
      
      // Both conditions true
      let result = engine.evaluate(source, { verkoop: 1500, klanttype: "premium" });
      expect(result.success).toBe(true);
      expect(result.value?.value).toBe(500);
      
      // One condition false
      result = engine.evaluate(source, { verkoop: 1500, klanttype: "regular" });
      expect(result.success).toBe(true);
      expect(result.value?.value).toContain('Rule skipped');
    });

    test('should handle numeric comparisons in conditions', () => {
      const source = `Regel geef seniorenkorting
geldig altijd
Het kortingspercentage van een berekening moet berekend worden als 15
indien de leeftijd is groter of gelijk aan 65.`;
      
      // Senior citizen
      let result = engine.evaluate(source, { leeftijd: 70 });
      expect(result.success).toBe(true);
      expect(result.value?.value).toBe(15);
      
      // Not a senior
      result = engine.evaluate(source, { leeftijd: 45 });
      expect(result.success).toBe(true);
      expect(result.value?.value).toContain('Rule skipped');
    });
  });
});