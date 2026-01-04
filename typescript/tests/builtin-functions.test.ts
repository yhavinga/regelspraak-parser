/**
 * Built-in functions tests for eerste_van, laatste_van, afronding, begrenzing
 * 
 * These tests exercise TOKA-related expression patterns that are
 * critical for scenario execution.
 */

import { Engine } from '../src/engine/engine';
import { Context } from '../src/runtime/context';

describe('Built-in Functions', () => {
    let engine: Engine;
    let context: Context;

    beforeEach(() => {
        engine = new Engine();
        context = new Context();
    });

    describe('eerste_van', () => {
        it('should return first non-null value from list', () => {
            context.setVariable('a', { type: 'null', value: null });
            context.setVariable('b', { type: 'number', value: 42 });
            context.setVariable('c', { type: 'number', value: 100 });

            const result = engine.run('de eerste van a, b en c', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(42);
        });

        it('should return first value when all are non-null', () => {
            context.setVariable('a', { type: 'number', value: 10 });
            context.setVariable('b', { type: 'number', value: 42 });
            context.setVariable('c', { type: 'number', value: 100 });

            const result = engine.run('de eerste van a, b en c', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(10);
        });

        it('should return null when all values are null', () => {
            context.setVariable('a', { type: 'null', value: null });
            context.setVariable('b', { type: 'null', value: null });

            const result = engine.run('de eerste van a en b', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBeNull();
        });
    });

    describe('laatste_van', () => {
        it('should return last non-null value from list', () => {
            context.setVariable('a', { type: 'number', value: 10 });
            context.setVariable('b', { type: 'number', value: 42 });
            context.setVariable('c', { type: 'null', value: null });

            const result = engine.run('de laatste van a, b en c', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(42);
        });

        it('should return last value when all are non-null', () => {
            context.setVariable('a', { type: 'number', value: 10 });
            context.setVariable('b', { type: 'number', value: 42 });
            context.setVariable('c', { type: 'number', value: 100 });

            const result = engine.run('de laatste van a, b en c', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(100);
        });
    });
});

describe('Afronding (Rounding)', () => {
    let engine: Engine;
    let context: Context;

    beforeEach(() => {
        engine = new Engine();
        context = new Context();
    });

    describe('naar beneden (floor)', () => {
        it('should round down to 0 decimals', () => {
            context.setVariable('waarde', { type: 'number', value: 42.7 });

            const result = engine.run('de waarde naar beneden afgerond op 0 decimalen', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(42);
        });

        it('should round down to 1 decimal', () => {
            context.setVariable('waarde', { type: 'number', value: 42.75 });

            const result = engine.run('de waarde naar beneden afgerond op 1 decimalen', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(42.7);
        });

        it('should round down negative numbers correctly', () => {
            context.setVariable('waarde', { type: 'number', value: -42.3 });

            const result = engine.run('de waarde naar beneden afgerond op 0 decimalen', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(-43);
        });
    });

    describe('naar boven (ceil)', () => {
        it('should round up to 0 decimals', () => {
            context.setVariable('waarde', { type: 'number', value: 42.1 });

            const result = engine.run('de waarde naar boven afgerond op 0 decimalen', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(43);
        });
    });

    describe('rekenkundig (standard rounding)', () => {
        it('should round using standard rounding', () => {
            context.setVariable('waarde', { type: 'number', value: 42.5 });

            const result = engine.run('de waarde rekenkundig afgerond op 0 decimalen', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(43);
        });

        it('should round down when less than 0.5', () => {
            context.setVariable('waarde', { type: 'number', value: 42.4 });

            const result = engine.run('de waarde rekenkundig afgerond op 0 decimalen', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(42);
        });
    });

    describe('richting nul (truncate)', () => {
        it('should truncate positive numbers', () => {
            context.setVariable('waarde', { type: 'number', value: 42.9 });

            const result = engine.run('de waarde richting nul afgerond op 0 decimalen', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(42);
        });

        it('should truncate negative numbers towards zero', () => {
            context.setVariable('waarde', { type: 'number', value: -42.9 });

            const result = engine.run('de waarde richting nul afgerond op 0 decimalen', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(-42);
        });
    });
});

describe('Begrenzing (Bounds)', () => {
    let engine: Engine;
    let context: Context;

    beforeEach(() => {
        engine = new Engine();
        context = new Context();
    });

    describe('minimum', () => {
        it('should apply minimum bound when value is below', () => {
            context.setVariable('waarde', { type: 'number', value: -50 });

            const result = engine.run('de waarde, met een minimum van 0', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(0);
        });

        it('should not change value when above minimum', () => {
            context.setVariable('waarde', { type: 'number', value: 50 });

            const result = engine.run('de waarde, met een minimum van 0', context);

            expect(result.success).toBe(true);
            expect(result.value?.value).toBe(50);
        });
    });
});
