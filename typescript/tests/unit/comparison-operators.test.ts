import { Engine } from '../../src';

describe('Engine - Comparison Operators', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('Equality operators', () => {
    test('should evaluate gelijk aan (equals)', () => {
      const result = engine.run('5 gelijk aan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate is gelijk aan', () => {
      const result = engine.run('3 is gelijk aan 3');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate ongelijk aan (not equals)', () => {
      const result = engine.run('5 ongelijk aan 3');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate equality with decimals', () => {
      const result = engine.run('3,14 gelijk aan 3,14');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });
  });

  describe('Greater than operators', () => {
    test('should evaluate groter dan', () => {
      const result = engine.run('10 groter dan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate is groter dan', () => {
      const result = engine.run('7 is groter dan 3');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate groter of gelijk aan', () => {
      const result = engine.run('5 groter of gelijk aan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should return false for not greater than', () => {
      const result = engine.run('3 groter dan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: false
      });
    });
  });

  describe('Less than operators', () => {
    test('should evaluate kleiner dan', () => {
      const result = engine.run('3 kleiner dan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate is kleiner dan', () => {
      const result = engine.run('2 is kleiner dan 7');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate kleiner of gelijk aan', () => {
      const result = engine.run('5 kleiner of gelijk aan 5');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });
  });

  describe('Complex comparisons', () => {
    test('should evaluate comparison with expressions', () => {
      const result = engine.run('2 plus 3 groter dan 4');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should evaluate comparison with multiplication', () => {
      const result = engine.run('2 maal 3 gelijk aan 6');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });

    test('should handle negative numbers in comparisons', () => {
      const result = engine.run('-5 kleiner dan 0');
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'boolean',
        value: true
      });
    });
  });
});