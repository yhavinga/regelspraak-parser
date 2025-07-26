import { Engine, Context } from '../../src';

describe('Subselectie (Collection Filtering)', () => {
    let engine: Engine;

    beforeEach(() => {
        engine = new Engine();
    });

    test('should filter by kenmerk: "die minderjarig zijn"', () => {
        // Test filtering objects that have a specific kenmerk
        const expressionText = `het aantal personen die minderjarig zijn`;
        
        // Create test context with persons
        const context = new Context();
        
        const persoon1 = {
            type: 'object',
            value: { 
                'is minderjarig': { type: 'boolean', value: true }
            }
        };
        const persoon2 = {
            type: 'object',
            value: { 
                'is minderjarig': { type: 'boolean', value: false }
            }
        };
        const persoon3 = {
            type: 'object',
            value: { 
                'is minderjarig': { type: 'boolean', value: true }
            }
        };
        
        context.setVariable('personen', {
            type: 'array',
            value: [persoon1, persoon2, persoon3]
        });
        
        // Run the expression
        const result = engine.run(expressionText, context);
        
        // We should get 2 (two persons are minderjarig)
        expect(result.success).toBe(true);
        expect(result.value?.type).toBe('number');
        expect(result.value?.value).toBe(2);
    });

    test('should filter by attribute comparison: "die een leeftijd hebben kleiner dan X"', () => {
        const expressionText = `het aantal personen die een leeftijd hebben kleiner dan de leeftijdsgrens`;
        
        const context = new Context();
        context.setVariable('leeftijdsgrens', { type: 'number', value: 18, unit: 'jr' });
        
        // Create test persons
        const personen = [
            { type: 'object', value: { leeftijd: { type: 'number', value: 15, unit: 'jr' } } },
            { type: 'object', value: { leeftijd: { type: 'number', value: 20, unit: 'jr' } } },
            { type: 'object', value: { leeftijd: { type: 'number', value: 17, unit: 'jr' } } }
        ];
        
        context.setVariable('personen', { type: 'array', value: personen });
        
        // Run the expression
        const result = engine.run(expressionText, context);
        
        // We should get 2 (two persons under 18)
        expect(result.success).toBe(true);
        expect(result.value?.type).toBe('number');
        expect(result.value?.value).toBe(2);
    });

    test.skip('should filter with aggregation: "de som van X van alle Y die Z"', () => {
        // TODO: Implement som function and test aggregation with subselectie
        // For now, skip this test as it requires implementing the som function
    });

    test('should filter by text comparison: "die een nationaliteit hebben gelijk aan X"', () => {
        const expressionText = `het aantal personen die een nationaliteit hebben gelijk aan "Nederlandse"`;
        
        const context = new Context();
        
        // Create test persons
        const personen = [
            { 
                type: 'object', 
                value: { 
                    naam: { type: 'string', value: 'Jan' },
                    nationaliteit: { type: 'string', value: 'Nederlandse' }
                } 
            },
            { 
                type: 'object', 
                value: { 
                    naam: { type: 'string', value: 'John' },
                    nationaliteit: { type: 'string', value: 'Amerikaanse' }
                } 
            },
            { 
                type: 'object', 
                value: { 
                    naam: { type: 'string', value: 'Piet' },
                    nationaliteit: { type: 'string', value: 'Nederlandse' }
                } 
            }
        ];
        
        context.setVariable('personen', { type: 'array', value: personen });
        
        // Run the expression
        const result = engine.run(expressionText, context);
        
        // We should get 2 (two Dutch persons)
        expect(result.success).toBe(true);
        expect(result.value?.type).toBe('number');
        expect(result.value?.value).toBe(2);
    });

    test('should handle empty result set', () => {
        const expressionText = `het aantal personen die senior zijn`;
        
        const context = new Context();
        
        // Create only young people
        const personen = [
            { 
                type: 'object', 
                value: { 
                    leeftijd: { type: 'number', value: 20, unit: 'jr' },
                    'is senior': { type: 'boolean', value: false }
                } 
            },
            { 
                type: 'object', 
                value: { 
                    leeftijd: { type: 'number', value: 25, unit: 'jr' },
                    'is senior': { type: 'boolean', value: false }
                } 
            },
            { 
                type: 'object', 
                value: { 
                    leeftijd: { type: 'number', value: 30, unit: 'jr' },
                    'is senior': { type: 'boolean', value: false }
                } 
            }
        ];
        
        context.setVariable('personen', { type: 'array', value: personen });
        
        // Run the expression
        const result = engine.run(expressionText, context);
        
        // We should get 0 (no seniors)
        expect(result.success).toBe(true);
        expect(result.value?.type).toBe('number');
        expect(result.value?.value).toBe(0);
    });
});