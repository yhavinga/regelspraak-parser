import { Engine } from '../../src/engine/engine';

describe('Logical Operators', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('EN (AND) operator', () => {
    test('should evaluate true en true to true', () => {
      const result = engine.run('5 groter dan 3 en 10 groter dan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate true en false to false', () => {
      const result = engine.run('5 groter dan 3 en 2 groter dan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false
      });
    });

    test('should evaluate false en true to false', () => {
      const result = engine.run('2 groter dan 5 en 10 groter dan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false
      });
    });

    test('should evaluate false en false to false', () => {
      const result = engine.run('2 groter dan 5 en 3 groter dan 10');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false
      });
    });

    test('should short-circuit on false left operand', () => {
      // If left is false, right shouldn't be evaluated (would throw error on undefined variable)
      const result = engine.run('2 groter dan 5 en onbekendeVariabele groter dan 0');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false
      });
    });
  });

  describe('OF (OR) operator', () => {
    test('should evaluate true of true to true', () => {
      const result = engine.run('5 groter dan 3 of 10 groter dan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate true of false to true', () => {
      const result = engine.run('5 groter dan 3 of 2 groter dan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate false of true to true', () => {
      const result = engine.run('2 groter dan 5 of 10 groter dan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate false of false to false', () => {
      const result = engine.run('2 groter dan 5 of 3 groter dan 10');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false
      });
    });

    test('should short-circuit on true left operand', () => {
      // If left is true, right shouldn't be evaluated (would throw error on undefined variable)
      const result = engine.run('5 groter dan 3 of onbekendeVariabele groter dan 0');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });
  });

  describe('Complex logical expressions', () => {
    test('should handle multiple en operators', () => {
      const result = engine.run('5 groter dan 3 en 10 groter dan 5 en 20 groter dan 10');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should handle multiple of operators', () => {
      const result = engine.run('2 groter dan 5 of 3 groter dan 10 of 15 groter dan 10');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should handle mixed en/of with right associativity', () => {
      // Since logical expression is right-associative, this should be: 5>3 en (2>5 of 10>5)
      const result = engine.run('5 groter dan 3 en 2 groter dan 5 of 10 groter dan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true  // true && (false || true) = true && true = true
      });
    });

    test('should handle comparison with equality operators', () => {
      const result = engine.run('5 gelijk aan 5 en 10 ongelijk aan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });
  });

  describe('Error handling', () => {
    test('should error on non-boolean left operand for en', () => {
      const result = engine.run('5 plus 3 en 10 groter dan 5');
      expect(result.success).toBe(false);
      expect(result.error?.message).toMatch(/Left operand of && must be boolean/);
    });

    test('should error on non-boolean right operand for en', () => {
      const result = engine.run('5 groter dan 3 en 10 plus 5');
      expect(result.success).toBe(false);
      expect(result.error?.message).toMatch(/Right operand of && must be boolean/);
    });

    test('should error on non-boolean left operand for of', () => {
      const result = engine.run('5 plus 3 of 10 groter dan 5');
      expect(result.success).toBe(false);
      expect(result.error?.message).toMatch(/Left operand of \|\| must be boolean/);
    });

    test('should error on non-boolean right operand for of when left is false', () => {
      // Need left to be false to force evaluation of right operand
      const result = engine.run('5 kleiner dan 3 of 10 plus 5');
      expect(result.success).toBe(false);
      expect(result.error?.message).toMatch(/Right operand of \|\| must be boolean/);
    });
  });
});