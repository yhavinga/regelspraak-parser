import { Engine } from '../../src';

describe('Engine - Number Literal', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  test('should parse and evaluate positive integer', () => {
    const result = engine.run('42');
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      type: 'number',
      value: 42
    });
  });

  test('should parse and evaluate negative integer', () => {
    const result = engine.run('-17');
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      type: 'number',
      value: -17
    });
  });

  test('should parse and evaluate decimal number', () => {
    const result = engine.run('3,14');
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      type: 'number',
      value: 3.14
    });
  });

  test('should fail on invalid input', () => {
    const result = engine.run('not a number');
    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('Undefined variable');
  });
});