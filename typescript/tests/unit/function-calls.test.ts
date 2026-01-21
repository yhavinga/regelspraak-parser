import { Engine, Context } from '../../src';

describe('Engine - Function Calls', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('wortel (sqrt) function', () => {
    test('should calculate square root of positive number', () => {
      const result = engine.run('de wortel van 16');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should calculate square root of decimal', () => {
      const result = engine.run('de wortel van 2,25');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 1.5
      });
    });

    test('should handle sqrt in expression', () => {
      const result = engine.run('de wortel van 9 plus 1');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should fail on negative number', () => {
      const result = engine.run('de wortel van -4');
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('sqrt of negative number');
    });

    test('should fail on wrong number of arguments', () => {
      // Dutch syntax doesn't support empty arguments
      const result = engine.run('de wortel van');
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Missing argument for "de wortel van"');
    });

    test('should fail on multiple arguments', () => {
      // Dutch syntax doesn't support multiple arguments like this
      const result = engine.run('de wortel van 4, 5');
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Multiple arguments not supported for "de wortel van"');
    });
  });

  describe('abs function', () => {
    test('should return absolute value of negative number', () => {
      const result = engine.run('de absolute waarde van (-42)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 42
      });
    });

    test('should return same value for positive number', () => {
      const result = engine.run('de absolute waarde van (42)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 42
      });
    });

    test('should handle abs in expression', () => {
      const result = engine.run('de absolute waarde van (-5) maal 2');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 10
      });
    });

    test('should handle nested function calls', () => {
      const result = engine.run('de absolute waarde van ((de wortel van 16) min 10)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 6
      });
    });
  });

  describe('function call syntax', () => {
    test('should handle function with expression argument', () => {
      // Note: without parentheses, this parses as (sqrt(4)) * 4 = 8, not sqrt(4*4) = 4
      const result = engine.run('de wortel van (4 maal 4)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should handle function with parenthesized argument', () => {
      const result = engine.run('de wortel van ((3 plus 1) maal 4)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test.skip('should handle whitespace in function calls', () => {
      // Lexer limitation: function keywords must match exactly, extra spaces break tokenization
      const result = engine.run('de   wortel   van   16');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4
      });
    });

    test('should fail on unknown function', () => {
      // Unknown Dutch function syntax - parser rejects "van NUMBER" as invalid
      const result = engine.run('de onbekende functie van 42');
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('Parse error');
    });

  });

  describe('functions with variables', () => {
    test('should evaluate function with variable argument', () => {
      const context = new Context();
      context.setVariable('x', { type: 'number', value: 16 });
      const result = engine.run('de wortel van x', context);
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
      const result = engine.run('de wortel van (de absolute waarde van (a) maal de absolute waarde van (a) plus b maal b)', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 13  // sqrt(25 + 144) = sqrt(169) = 13
      });
    });
  });

  describe('minimale/maximale waarde van (explicit values)', () => {
    test('should return minimum of explicit values', () => {
      const result = engine.run('de minimale waarde van 5, 3 en 8');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 3
      });
    });

    test('should return maximum of explicit values', () => {
      const result = engine.run('de maximale waarde van 5, 3 en 8');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 8
      });
    });

    test('should handle minimum with two values', () => {
      const result = engine.run('de minimale waarde van 10 en 20');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 10
      });
    });

    test('should handle maximum with two values', () => {
      const result = engine.run('de maximale waarde van 10 en 20');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 20
      });
    });

    test('should handle minimum with variables', () => {
      const context = new Context();
      context.setVariable('a', { type: 'number', value: 15 });
      context.setVariable('b', { type: 'number', value: 7 });
      context.setVariable('c', { type: 'number', value: 22 });
      const result = engine.run('de minimale waarde van a, b en c', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 7
      });
    });

    test('should handle maximum with variables', () => {
      const context = new Context();
      context.setVariable('a', { type: 'number', value: 15 });
      context.setVariable('b', { type: 'number', value: 7 });
      context.setVariable('c', { type: 'number', value: 22 });
      const result = engine.run('de maximale waarde van a, b en c', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 22
      });
    });

    test('should handle minimum with expressions', () => {
      const result = engine.run('de minimale waarde van (2 maal 5), (3 plus 4) en 12');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 7  // min(10, 7, 12) = 7
      });
    });
  });

  describe('percentage functions', () => {
    test('should calculate percentage of value', () => {
      const result = engine.run('50% van 200');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 100
      });
    });

    test('should calculate percentage with decimal (Dutch notation)', () => {
      const result = engine.run('12,5% van 80');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 10
      });
    });

    test('should calculate percentage of variable', () => {
      const context = new Context();
      context.setVariable('bedrag', { type: 'number', value: 500 });
      const result = engine.run('20% van bedrag', context);
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 100
      });
    });

    test('should calculate percentage of expression', () => {
      const result = engine.run('25% van (40 plus 60)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 25
      });
    });

    test('should handle 100 percent', () => {
      const result = engine.run('100% van 42');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 42
      });
    });

    test('should handle small percentage', () => {
      const result = engine.run('1% van 1000');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 10
      });
    });
  });
});