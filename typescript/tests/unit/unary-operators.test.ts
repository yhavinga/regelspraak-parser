import { Engine } from '../../src/engine/engine';

describe('Unary Operators', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('Unary minus operator', () => {
    test('should negate positive number', () => {
      const result = engine.run('min 42');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: -42
      });
    });

    test('should negate negative number', () => {
      const result = engine.run('min -42');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 42
      });
    });

    test('should handle unary minus with decimal', () => {
      const result = engine.run('min 3,14');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: -3.14
      });
    });

    test('should handle unary minus in expression', () => {
      const result = engine.run('min 5 plus 10');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 5  // -5 + 10
      });
    });

    test('should handle unary minus with parentheses', () => {
      const result = engine.run('min (3 plus 4)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: -7
      });
    });

    test('should handle double negation', () => {
      const result = engine.run('min min 42');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 42
      });
    });

    test('should error on non-numeric operand', () => {
      const result = engine.run('min (5 groter dan 3)');
      expect(result.success).toBe(false);
      expect(result.error?.message).toMatch(/Cannot apply unary minus to boolean/);
    });
  });

  describe('NIET (NOT) operator', () => {
    test('should negate true to false', () => {
      const result = engine.run('niet (5 groter dan 3)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false
      });
    });

    test('should negate false to true', () => {
      const result = engine.run('niet (5 kleiner dan 3)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should handle double negation', () => {
      const result = engine.run('niet niet (5 groter dan 3)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should work with equality comparisons', () => {
      const result = engine.run('niet (5 gelijk aan 5)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false
      });
    });

    test('should work in logical expressions', () => {
      const result = engine.run('niet (5 groter dan 3) of 10 groter dan 20');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false  // false || false
      });
    });

    test('should work with en operator', () => {
      const result = engine.run('niet (5 groter dan 3) en niet (10 groter dan 20)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false  // false && true = false
      });
    });

    test('should error on non-boolean operand', () => {
      const result = engine.run('niet 42');
      expect(result.success).toBe(false);
      expect(result.error?.message).toMatch(/Cannot apply logical NOT to number/);
    });

    test('should handle arithmetic in niet expression', () => {
      const result = engine.run('niet (5 plus 3 groter dan 10)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true  // !(8 > 10) = !false = true
      });
    });
  });

  describe('Complex expressions with unary operators', () => {
    test('should handle unary minus with multiplication', () => {
      const result = engine.run('min 5 maal 3');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: -15
      });
    });

    test('should handle unary minus with division', () => {
      const result = engine.run('min 20 gedeeld door 4');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: -5
      });
    });

    test('should handle complex boolean expression with niet', () => {
      const result = engine.run('niet ((5 groter dan 3) en (10 kleiner dan 20))');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false  // !(true && true) = false
      });
    });

    test('should handle mixed operators', () => {
      const result = engine.run('niet (min 5 groter dan min 10)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false  // !(-5 > -10) = !true = false
      });
    });
  });
});