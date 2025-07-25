import { Engine, Context } from '../../src';

describe('Engine - Function Calls', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('sqrt function', () => {
    test('should calculate square root of positive number', () => {
      const result = engine.run('sqrt(16)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should calculate square root of decimal', () => {
      const result = engine.run('sqrt(2.25)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 1.5
      });
    });

    test('should handle sqrt in expression', () => {
      const result = engine.run('sqrt(9) + 1');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should fail on negative number', () => {
      const result = engine.run('sqrt(-4)');
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('sqrt of negative number');
    });

    test('should fail on wrong number of arguments', () => {
      const result = engine.run('sqrt()');
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('sqrt expects exactly 1 argument');
    });

    test('should fail on multiple arguments', () => {
      const result = engine.run('sqrt(4, 5)');
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('sqrt expects exactly 1 argument');
    });
  });

  describe('abs function', () => {
    test('should return absolute value of negative number', () => {
      const result = engine.run('abs(-42)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 42
      });
    });

    test('should return same value for positive number', () => {
      const result = engine.run('abs(42)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 42
      });
    });

    test('should handle abs in expression', () => {
      const result = engine.run('abs(-5) * 2');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 10
      });
    });

    test('should handle nested function calls', () => {
      const result = engine.run('abs(sqrt(16) - 10)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 6
      });
    });
  });

  describe('function call syntax', () => {
    test('should handle function with expression argument', () => {
      const result = engine.run('sqrt(4 * 4)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should handle function with parenthesized argument', () => {
      const result = engine.run('sqrt((3 + 1) * 4)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should handle whitespace in function calls', () => {
      const result = engine.run('sqrt  (  16  )');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should fail on unknown function', () => {
      const result = engine.run('unknown(42)');
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Unknown function: unknown');
    });

    test('should fail on missing closing parenthesis', () => {
      const result = engine.run('sqrt(16');
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Expected closing parenthesis in function call');
    });
  });

  describe('functions with variables', () => {
    test('should evaluate function with variable argument', () => {
      const context = new Context();
      context.setVariable('x', { type: 'number', value: 16 });
      const result = engine.run('sqrt(x)', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should evaluate complex expression with functions and variables', () => {
      const context = new Context();
      context.setVariable('a', { type: 'number', value: -5 });
      context.setVariable('b', { type: 'number', value: 12 });
      const result = engine.run('sqrt(abs(a) * abs(a) + b * b)', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 13  // sqrt(25 + 144) = sqrt(169) = 13
      });
    });
  });
});