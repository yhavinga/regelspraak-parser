import { Engine, Context } from '../../src';

describe('Engine - Variable References', () => {
  let engine: Engine;
  let context: Context;

  beforeEach(() => {
    engine = new Engine();
    context = new Context();
  });

  test('should evaluate simple variable reference', () => {
    context.setVariable('x', { type: 'number', value: 42 });
    const result = engine.run('x', context);
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      type: 'number',
      value: 42
    });
  });

  test('should evaluate variable in expression', () => {
    context.setVariable('a', { type: 'number', value: 10 });
    context.setVariable('b', { type: 'number', value: 5 });
    const result = engine.run('a + b', context);
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      type: 'number',
      value: 15
    });
  });

  test('should evaluate complex expression with variables', () => {
    context.setVariable('x', { type: 'number', value: 3 });
    context.setVariable('y', { type: 'number', value: 4 });
    const result = engine.run('(x + y) * 2', context);
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      type: 'number',
      value: 14
    });
  });

  test('should fail on undefined variable', () => {
    const result = engine.run('undefinedVar');
    expect(result.success).toBe(false);
    expect(result.error?.message).toBe('Undefined variable: undefinedVar');
  });

  test('should handle mixed literals and variables', () => {
    context.setVariable('pi', { type: 'number', value: 3.14 });
    const result = engine.run('2 * pi * 5', context);
    expect(result.success).toBe(true);
    expect(result.value?.value).toBeCloseTo(31.4, 5);
  });

  test('should handle variable names with underscores', () => {
    context.setVariable('my_var', { type: 'number', value: 100 });
    const result = engine.run('my_var / 4', context);
    expect(result.success).toBe(true);
    expect(result.value).toEqual({
      type: 'number',
      value: 25
    });
  });

  test('should handle variable reassignment', () => {
    context.setVariable('counter', { type: 'number', value: 1 });
    
    let result = engine.run('counter', context);
    expect(result.value?.value).toBe(1);
    
    context.setVariable('counter', { type: 'number', value: 2 });
    result = engine.run('counter', context);
    expect(result.value?.value).toBe(2);
  });

  test('should respect variable scope', () => {
    context.setVariable('x', { type: 'number', value: 10 });
    context.pushScope();
    context.setVariable('x', { type: 'number', value: 20 });
    
    let result = engine.run('x', context);
    expect(result.value?.value).toBe(20);
    
    context.popScope();
    result = engine.run('x', context);
    expect(result.value?.value).toBe(10);
  });
});