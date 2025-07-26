import { Engine, Context } from '../../src';

describe('Elfproef Predicate', () => {
    let engine: Engine;

    beforeEach(() => {
        engine = new Engine();
    });

    describe('parsing elfproef predicates', () => {
        test('should parse positive elfproef predicate', () => {
            const source = `
                Objecttype de Natuurlijk persoon
                    het burgerservicenummer Tekst;
                    is BSNgeldig kenmerk;
                    
                Regel check BSN validiteit
                geldig altijd
                    Een Natuurlijk persoon is BSNgeldig
                    indien zijn burgerservicenummer voldoet aan de elfproef.
            `;
            
            const result = engine.parse(source);
            
            expect(result.success).toBe(true);
            expect(result.ast).toMatchObject({
                type: 'Model',
                rules: [{
                    type: 'Rule',
                    name: 'check BSN validiteit',
                    result: {
                        type: 'Kenmerktoekenning',
                        subject: expect.any(Object),
                        characteristic: 'BSNgeldig'
                    },
                    condition: {
                        type: 'Voorwaarde',
                        expression: {
                            type: 'UnaryExpression',
                            operator: 'voldoet aan de elfproef',
                            operand: expect.any(Object)
                        }
                    }
                }]
            });
        });

        test('should parse negative elfproef predicate', () => {
            const source = `
                Objecttype de Natuurlijk persoon
                    het burgerservicenummer Tekst;
                    is BSNongeldig kenmerk;
                    
                Regel check BSN ongeldigheid
                geldig altijd
                    Een Natuurlijk persoon is BSNongeldig
                    indien zijn burgerservicenummer voldoet niet aan de elfproef.
            `;
            
            const result = engine.parse(source);
            
            expect(result.success).toBe(true);
            expect(result.ast?.rules[0].condition).toMatchObject({
                type: 'Voorwaarde',
                expression: {
                    type: 'UnaryExpression',
                    operator: 'voldoet niet aan de elfproef',
                    operand: expect.any(Object)
                }
            });
        });
    });

    describe('executing elfproef validation', () => {
        test('should validate valid BSN (999999990)', () => {
            const modelText = `
                Objecttype de Natuurlijk persoon
                    het burgerservicenummer Tekst;
                    is BSNgeldig kenmerk;
                    
                Regel check BSN validiteit
                geldig altijd
                    Een Natuurlijk persoon is BSNgeldig
                    indien zijn burgerservicenummer voldoet aan de elfproef.
            `;
            
            const context = new Context();
            
            // Create person with valid BSN 999999990
            // Validation: 9*9 + 9*8 + 9*7 + 9*6 + 9*5 + 9*4 + 9*3 + 9*2 + 0*(-1) = 396
            // 396 % 11 = 0 (valid!)
            const personId = context.generateObjectId('Natuurlijkpersoon');
            context.createObject('Natuurlijkpersoon', personId, {
                burgerservicenummer: { type: 'string', value: '999999990' },
                BSNgeldig: { type: 'boolean', value: false } // Initialize as false
            });
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Natuurlijkpersoon');
            expect(persons.length).toBe(1);
            expect(persons[0].value.BSNgeldig).toEqual({ type: 'boolean', value: true });
        });

        test('should invalidate invalid BSN (111111111)', () => {
            const modelText = `
                Objecttype de Natuurlijk persoon
                    het burgerservicenummer Tekst;
                    is BSNgeldig kenmerk;
                    
                Regel check BSN validiteit
                geldig altijd
                    Een Natuurlijk persoon is BSNgeldig
                    indien zijn burgerservicenummer voldoet aan de elfproef.
            `;
            
            const context = new Context();
            
            // Create person with invalid BSN
            // 1*9 + 1*8 + 1*7 + 1*6 + 1*5 + 1*4 + 1*3 + 1*2 + 1*(-1) = 44
            // 44 % 11 = 0 (but all same digits not allowed)
            const personId = context.generateObjectId('Natuurlijkpersoon');
            context.createObject('Natuurlijkpersoon', personId, {
                burgerservicenummer: { type: 'string', value: '111111111' }
            });
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Natuurlijkpersoon');
            expect(persons.length).toBe(1);
            expect(persons[0].value.BSNgeldig).toBeFalsy();
        });

        test('should handle non-numeric BSN', () => {
            const modelText = `
                Objecttype de Natuurlijk persoon
                    het burgerservicenummer Tekst;
                    is BSNgeldig kenmerk;
                    
                Regel check BSN validiteit
                geldig altijd
                    Een Natuurlijk persoon is BSNgeldig
                    indien zijn burgerservicenummer voldoet aan de elfproef.
            `;
            
            const context = new Context();
            
            // Create person with non-numeric BSN
            const personId = context.generateObjectId('Natuurlijkpersoon');
            context.createObject('Natuurlijkpersoon', personId, {
                burgerservicenummer: { type: 'string', value: 'ABC123DEF' }
            });
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Natuurlijkpersoon');
            expect(persons.length).toBe(1);
            expect(persons[0].value.BSNgeldig).toBeFalsy();
        });

        test('should handle wrong length BSN', () => {
            const modelText = `
                Objecttype de Natuurlijk persoon
                    het burgerservicenummer Tekst;
                    is BSNgeldig kenmerk;
                    
                Regel check BSN validiteit
                geldig altijd
                    Een Natuurlijk persoon is BSNgeldig
                    indien zijn burgerservicenummer voldoet aan de elfproef.
            `;
            
            const context = new Context();
            
            // Create person with too short BSN (only 7 digits)
            const personId = context.generateObjectId('Natuurlijkpersoon');
            context.createObject('Natuurlijkpersoon', personId, {
                burgerservicenummer: { type: 'string', value: '1234567' }
            });
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Natuurlijkpersoon');
            expect(persons.length).toBe(1);
            expect(persons[0].value.BSNgeldig).toBeFalsy();
        });

        test('should handle empty BSN', () => {
            const modelText = `
                Objecttype de Natuurlijk persoon
                    het burgerservicenummer Tekst;
                    is BSNgeldig kenmerk;
                    
                Regel check BSN validiteit
                geldig altijd
                    Een Natuurlijk persoon is BSNgeldig
                    indien zijn burgerservicenummer voldoet aan de elfproef.
            `;
            
            const context = new Context();
            
            // Create person without BSN
            const personId = context.generateObjectId('Natuurlijkpersoon');
            context.createObject('Natuurlijkpersoon', personId, {
                // Don't set burgerservicenummer
            });
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Natuurlijkpersoon');
            expect(persons.length).toBe(1);
            expect(persons[0].value.BSNgeldig).toBeFalsy();
        });

        test('should handle negative elfproef check', () => {
            const modelText = `
                Objecttype de Natuurlijk persoon
                    het burgerservicenummer Tekst;
                    is BSNongeldig kenmerk;
                    
                Regel check BSN ongeldigheid
                geldig altijd
                    Een Natuurlijk persoon is BSNongeldig
                    indien zijn burgerservicenummer voldoet niet aan de elfproef.
            `;
            
            const context = new Context();
            
            // Create person with invalid BSN
            const personId = context.generateObjectId('Natuurlijkpersoon');
            context.createObject('Natuurlijkpersoon', personId, {
                burgerservicenummer: { type: 'string', value: '111111111' }
            });
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Natuurlijkpersoon');
            expect(persons.length).toBe(1);
            expect(persons[0].value.BSNongeldig).toEqual({ type: 'boolean', value: true });
        });

        test('should validate another valid BSN (123456782)', () => {
            const modelText = `
                Objecttype de Natuurlijk persoon
                    het burgerservicenummer Tekst;
                    is BSNgeldig kenmerk;
                    
                Regel check BSN validiteit
                geldig altijd
                    Een Natuurlijk persoon is BSNgeldig
                    indien zijn burgerservicenummer voldoet aan de elfproef.
            `;
            
            const context = new Context();
            
            // Create person with valid BSN 123456782
            // Validation: 1*9 + 2*8 + 3*7 + 4*6 + 5*5 + 6*4 + 7*3 + 8*2 + 2*(-1)
            // = 9 + 16 + 21 + 24 + 25 + 24 + 21 + 16 - 2 = 154
            // 154 % 11 = 0 (valid!)
            const personId = context.generateObjectId('Natuurlijkpersoon');
            context.createObject('Natuurlijkpersoon', personId, {
                burgerservicenummer: { type: 'string', value: '123456782' }
            });
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Natuurlijkpersoon');
            expect(persons.length).toBe(1);
            expect(persons[0].value.BSNgeldig).toEqual({ type: 'boolean', value: true });
        });
    });
});