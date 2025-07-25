import { Engine, Context } from '../../src';

describe('Engine - Decision Tables', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('simple decision table', () => {
    test('should execute decision table with string matching', () => {
      const decisionTable = `Beslistabel Woonregio factor
geldig altijd
|   | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie gelijk is aan |
|---|-------------------------------------------------------------------------|------------------------------------------|
| 1 | 1                                                                       | 'Friesland'                              |
| 2 | 2                                                                       | 'Noord-Brabant'                          |
| 3 | 3                                                                       | 'Noord-Holland'                          |`;
      
      const context = new Context();
      context.setVariable('woonprovincie', { type: 'string', value: 'Noord-Brabant' });
      
      const result = engine.run(decisionTable, context);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 2
      });
      
      // Check that the variable was set in context
      const storedValue = context.getVariable('woonregio_factor');
      expect(storedValue).toEqual({
        type: 'number',
        value: 2
      });
    });

    test('should match first row when condition matches', () => {
      const decisionTable = `Beslistabel Test
geldig altijd
|   | de result moet gesteld worden op | indien value gelijk is aan |
|---|-----------------------------------|----------------------------|
| 1 | 10                                | 5                          |
| 2 | 20                                | 10                         |
| 3 | 30                                | 15                         |`;
      
      const context = new Context();
      context.setVariable('value', { type: 'number', value: 5 });
      
      const result = engine.run(decisionTable, context);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 10
      });
    });

    test('should fail when no row matches', () => {
      const decisionTable = `Beslistabel Test
geldig altijd
|   | de result moet gesteld worden op | indien value gelijk is aan |
|---|-----------------------------------|----------------------------|
| 1 | 10                                | 5                          |
| 2 | 20                                | 10                         |`;
      
      const context = new Context();
      context.setVariable('value', { type: 'number', value: 7 });
      
      const result = engine.run(decisionTable, context);
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('No matching row');
    });
  });

  describe('decision table with n.v.t.', () => {
    test('should handle n.v.t. conditions', () => {
      const decisionTable = `Beslistabel Belasting
geldig altijd
|   | de belasting moet gesteld worden op | indien value groter is dan | indien value kleiner of gelijk is aan |
|---|--------------------------------------|---------------------------|---------------------------------------|
| 1 | 10                                   | n.v.t.                    | 100                                   |
| 2 | 20                                   | 100                       | 200                                   |
| 3 | 30                                   | 200                       | n.v.t.                                |`;
      
      const context = new Context();
      
      // Test first row (value <= 100)
      context.setVariable('value', { type: 'number', value: 50 });
      let result = engine.run(decisionTable, context);
      expect(result.success).toBe(true);
      expect(result.value?.value).toBe(10);
      
      // Test second row (100 < value <= 200)
      context.setVariable('value', { type: 'number', value: 150 });
      result = engine.run(decisionTable, context);
      expect(result.success).toBe(true);
      expect(result.value?.value).toBe(20);
      
      // Test third row (value > 200)
      context.setVariable('value', { type: 'number', value: 250 });
      result = engine.run(decisionTable, context);
      expect(result.success).toBe(true);
      expect(result.value?.value).toBe(30);
    });
  });

  describe('decision table with EUR amounts', () => {
    test('should parse EUR amounts', () => {
      const decisionTable = `Beslistabel Korting
geldig altijd
|   | de korting moet gesteld worden op | indien aankoopbedrag groter is dan |
|---|-------------------------------------|-------------------------------------|
| 1 | 5 EUR                               | 50                                  |
| 2 | 10 EUR                              | 100                                 |
| 3 | 20 EUR                              | 200                                 |`;
      
      const context = new Context();
      context.setVariable('aankoopbedrag', { type: 'number', value: 150 });
      
      const result = engine.run(decisionTable, context);
      
      expect(result.success).toBe(true);
      // First matching row wins - aankoopbedrag (150) > 50, so row 1 matches
      expect(result.value).toEqual({
        type: 'number',
        value: 5  // EUR amount parsed as number
      });
    });
  });

  describe('error handling', () => {
    test('should fail on invalid syntax', () => {
      const invalidTable = `Beslistabel Test
geldig altijd
Invalid table content`;
      
      const result = engine.run(invalidTable);
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toBeDefined();
    });

    test('should fail on missing Beslistabel keyword', () => {
      const invalidTable = `Test
geldig altijd
|   | result | condition |
|---|--------|-----------|
| 1 | 10     | 5         |`;
      
      const result = engine.run(invalidTable);
      
      expect(result.success).toBe(false);
    });

    test('should fail on missing geldig keyword', () => {
      const invalidTable = `Beslistabel Test
|   | result | condition |
|---|--------|-----------|
| 1 | 10     | 5         |`;
      
      const result = engine.run(invalidTable);
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Expected "geldig" keyword');
    });

    test('should fail when condition variable is undefined', () => {
      const decisionTable = `Beslistabel Test
geldig altijd
|   | de result moet gesteld worden op | indien value gelijk is aan |
|---|-----------------------------------|----------------------------|
| 1 | 10                                | 5                          |`;
      
      const context = new Context();
      // 'value' is not defined in context
      
      const result = engine.run(decisionTable, context);
      
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('No matching row');
    });
  });
});