import { Engine } from '../../src';

describe('Engine - Binary Expressions', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('Addition', () => {
    test('should evaluate simple addition', () => {
      const result = engine.run('2 plus 3');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 5
      });
    });

    test('should evaluate multiple additions', () => {
      const result = engine.run('1 plus 2 plus 3');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 6
      });
    });
  });

  describe('Subtraction', () => {
    test('should evaluate simple subtraction', () => {
      const result = engine.run('10 min 3');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 7
      });
    });

    test('should evaluate chain subtraction', () => {
      const result = engine.run('10 min 3 min 2');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 5
      });
    });
  });

  describe('Multiplication', () => {
    test('should evaluate simple multiplication', () => {
      const result = engine.run('4 maal 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 20
      });
    });

    test('should evaluate multiple multiplications', () => {
      const result = engine.run('2 maal 3 maal 4');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 24
      });
    });
  });

  describe('Division', () => {
    test('should evaluate simple division', () => {
      const result = engine.run('15 gedeeld door 3');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 5
      });
    });

    test('should handle decimal results', () => {
      const result = engine.run('10 gedeeld door 3');
      expect(result.success).toBe(true);
      expect(result.value?.value).toBeCloseTo(3.333333, 5);
    });

    test('should fail on division by zero', () => {
      const result = engine.run('10 gedeeld door 0');
      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('Division by zero');
    });
  });

  describe('Operator Precedence', () => {
    test('should handle multiplication before addition', () => {
      const result = engine.run('2 plus 3 maal 4');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 14  // 2 + 12, not 20
      });
    });

    test('should handle division before subtraction', () => {
      const result = engine.run('20 min 12 gedeeld door 3');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 16  // 20 - 4, not 2.67
      });
    });

    test('should handle complex expression', () => {
      const result = engine.run('2 maal 3 plus 4 maal 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 26  // 6 + 20
      });
    });
  });

  describe('Parentheses', () => {
    test('should respect parentheses', () => {
      const result = engine.run('(2 plus 3) maal 4');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 20  // 5 * 4
      });
    });

    test('should handle nested parentheses', () => {
      const result = engine.run('((2 plus 3) maal 4) gedeeld door 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4  // 20 / 5
      });
    });

    test('should fail on missing closing parenthesis', () => {
      const result = engine.run('(2 plus 3');
      expect(result.success).toBe(false);
      expect(result.error?.message).toContain("no viable alternative");
    });
  });

  describe('Whitespace Handling', () => {
    test('should handle expressions without spaces', () => {
      const result = engine.run('2 plus 3 maal 4');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 14
      });
    });

    test('should handle expressions with extra spaces', () => {
      const result = engine.run('  2  plus  3  maal  4  ');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 14
      });
    });
  });

  describe('Edge Cases', () => {
    test('should handle negative numbers in expressions', () => {
      const result = engine.run('-5 plus 3');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: -2
      });
    });

    test('should handle decimal numbers in expressions', () => {
      const result = engine.run('3,5 maal 2');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 7
      });
    });
  });
});