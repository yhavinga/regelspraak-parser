import { Engine } from '../../src/engine/engine';

describe('Parentheses in Expressions', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('Basic parentheses', () => {
    test('should evaluate expression with parentheses', () => {
      const result = engine.run('(5 plus 3)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 8
      });
    });

    test('should respect parentheses precedence', () => {
      const result = engine.run('2 maal (3 plus 4)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 14  // 2 * 7
      });
    });

    test('should handle nested parentheses', () => {
      const result = engine.run('((2 plus 3) maal 4)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 20  // 5 * 4
      });
    });

    test('should handle multiple nested parentheses', () => {
      const result = engine.run('(2 maal (3 plus (4 maal 5)))');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 46  // 2 * (3 + 20) = 2 * 23
      });
    });
  });

  describe('Parentheses with logical operators', () => {
    test('should handle parentheses with logical operators', () => {
      const result = engine.run('(5 groter dan 3) en (10 groter dan 5)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should change logical operator precedence with parentheses', () => {
      // Without parentheses: 5>3 en 2>5 of 10>5 = true && false || true = false || true = true
      // With parentheses: 5>3 en (2>5 of 10>5) = true && (false || true) = true && true = true
      const result = engine.run('5 groter dan 3 en (2 groter dan 5 of 10 groter dan 5)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });
  });

  describe('Arithmetic precedence', () => {
    test('should handle standard precedence without parentheses', () => {
      // Multiplication before addition
      const result = engine.run('2 plus 3 maal 4');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 14  // 2 + 12
      });
    });

    test('should override precedence with parentheses', () => {
      const result = engine.run('(2 plus 3) maal 4');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 20  // 5 * 4
      });
    });

    test('should handle division and subtraction with parentheses', () => {
      const result = engine.run('20 gedeeld door (10 min 5)');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'number',
        value: 4  // 20 / 5
      });
    });
  });
});