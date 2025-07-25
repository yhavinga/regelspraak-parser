import { Engine, Context } from '../../src';

describe('Engine - Rule Execution', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('simple rule with alleen expression', () => {
    test('should execute rule with number literal', () => {
      const rule = `Regel test_literal
geldig altijd
    Het resultaat van een berekening moet berekend worden als 42.`;
      
      const context = new Context();
      const result = engine.run(rule, context);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 42
      });
      
      // Check that the variable was set in context
      const storedValue = context.getVariable('resultaat');
      expect(storedValue).toEqual({
        type: 'number',
        value: 42
      });
    });

    test('should execute rule with arithmetic expression', () => {
      const rule = `Regel bereken_som
geldig altijd
    Het totaal van een berekening moet berekend worden als 10 plus 20.`;
      
      const context = new Context();
      const result = engine.run(rule, context);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 30
      });
      
      // Check that the variable was set in context
      const storedValue = context.getVariable('totaal');
      expect(storedValue).toEqual({
        type: 'number',
        value: 30
      });
    });

    test('should execute rule with verminderd met operator', () => {
      const rule = `Regel bereken_verschil
geldig altijd
    Het resultaat van een berekening moet berekend worden als 10 verminderd met 3.`;
      
      const context = new Context();
      const result = engine.run(rule, context);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 7
      });
    });

    test('should execute rule with variable reference', () => {
      const rule = `Regel bereken_dubbel
geldig altijd
    Het dubbele van een berekening moet berekend worden als x maal 2.`;
      
      const context = new Context();
      context.setVariable('x', { type: 'number', value: 5 });
      const result = engine.run(rule, context);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 10
      });
    });

    test('should execute rule with function call', () => {
      const rule = `Regel bereken_wortel
geldig altijd
    De uitkomst van een berekening moet berekend worden als de wortel van 16.`;
      
      const context = new Context();
      const result = engine.run(rule, context);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should execute rule with complex expression', () => {
      const rule = `Regel bereken_complex
geldig altijd
    Het resultaat van een berekening moet berekend worden als (10 plus 5) maal 2 verminderd met 3.`;
      
      const context = new Context();
      const result = engine.run(rule, context);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 27  // (10 + 5) * 2 - 3 = 15 * 2 - 3 = 30 - 3 = 27
      });
    });
  });

  describe('error handling', () => {
    test('should fail on invalid rule syntax', () => {
      const rule = `Regel test_incomplete`;  // Incomplete rule (missing rest)
      
      const result = engine.run(rule);
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Expected "geldig" keyword');
    });

    test('should fail on missing geldig keyword', () => {
      const rule = `Regel test
    Het resultaat van een berekening moet berekend worden als 42.`;
      
      const result = engine.run(rule);
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Expected "geldig" keyword');
    });

    test('should fail on invalid gelijkstelling pattern', () => {
      const rule = `Regel test
geldig altijd
    Het resultaat van een berekening is 42.`;
      
      const result = engine.run(rule);
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Expected gelijkstelling pattern');
    });

    test('should fail on undefined variable in rule expression', () => {
      const rule = `Regel test
geldig altijd
    Het resultaat van een berekening moet berekend worden als x plus y.`;
      
      const context = new Context();
      context.setVariable('x', { type: 'number', value: 5 });
      // y is not defined
      
      const result = engine.run(rule, context);
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Undefined variable: y');
    });
  });

  describe('target extraction', () => {
    test('should extract simple target names', () => {
      const testCases = [
        {
          rule: `Regel test\ngeldig altijd\n    Het resultaat van een berekening moet berekend worden als 1.`,
          expectedTarget: 'resultaat'
        },
        {
          rule: `Regel test\ngeldig altijd\n    De leeftijd van een persoon moet berekend worden als 25.`,
          expectedTarget: 'leeftijd'
        },
        {
          rule: `Regel test\ngeldig altijd\n    Het aantal van een groep moet berekend worden als 10.`,
          expectedTarget: 'aantal'
        }
      ];

      for (const testCase of testCases) {
        const context = new Context();
        const result = engine.run(testCase.rule, context);
        
        expect(result.success).toBe(true);
        expect(context.getVariable(testCase.expectedTarget)).toBeDefined();
      }
    });
  });
});