import { Engine, Context } from '../../src';

describe('Uniek Predicate', () => {
    const engine = new Engine();
    
    describe('parsing uniek predicates', () => {
        test('should parse "moeten uniek zijn" predicate', () => {
            const source = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    
                Regel BSN uniekheid
                geldig altijd
                    De burgerservicenummers van alle Personen moeten uniek zijn.
            `;
            
            const result = engine.parse(source);
            
            expect(result.success).toBe(true);
            expect(result.ast).toMatchObject({
                type: 'Model',
                rules: [{
                    type: 'Rule',
                    name: 'BSN uniekheid',
                    result: {
                        type: 'UnaryExpression',
                        operator: 'moeten uniek zijn',
                        operand: {
                            type: 'VariableReference',
                            variableName: 'burgerservicenummersvanallePersonen'
                        }
                    }
                }]
            });
        });

        test('should parse uniek check with compound attributes', () => {
            const source = `
                Objecttype de Medewerker
                    het personeelsnummer Nummer;
                    de afdeling Tekst;
                    
                Regel personeelsnummer uniekheid per afdeling
                geldig altijd
                    De personeelsnummers van alle medewerkers met dezelfde afdeling moeten uniek zijn.
            `;
            
            const result = engine.parse(source);
            
            expect(result.success).toBe(true);
        });
    });

    describe('executing uniek validation', () => {
        test('should detect duplicate values', () => {
            const modelText = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    is BSNUniek kenmerk;
                    
                Regel BSN uniekheid check
                geldig altijd
                    Een Persoon is BSNUniek
                    indien de burgerservicenummers van alle personen moeten uniek zijn.
            `;
            
            const context = new Context();
            
            // Create persons with duplicate BSN
            const person1Id = context.generateObjectId('Persoon');
            context.createObject('Persoon', person1Id, {
                burgerservicenummer: { type: 'string', value: '123456789' }
            });
            
            const person2Id = context.generateObjectId('Persoon');
            context.createObject('Persoon', person2Id, {
                burgerservicenummer: { type: 'string', value: '123456789' } // Duplicate!
            });
            
            const parseResult = engine.parse(modelText);
            console.log('Parse result:', JSON.stringify(parseResult.ast?.rules[0], null, 2));
            
            const result = engine.run(modelText, context);
            
            if (!result.success) {
                console.error('Run failed:', result.error);
            }
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Persoon');
            expect(persons.length).toBe(2);
            // Both persons should have BSNUniek = false because there are duplicates
            expect(persons[0].value['is BSNUniek']).toEqual({ type: 'boolean', value: false });
            expect(persons[1].value['is BSNUniek']).toEqual({ type: 'boolean', value: false });
        });

        test('should pass when all values are unique', () => {
            const modelText = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    is BSNUniek kenmerk;
                    
                Regel BSN uniekheid check
                geldig altijd
                    Een Persoon is BSNUniek
                    indien de burgerservicenummers van alle personen moeten uniek zijn.
            `;
            
            const context = new Context();
            
            // Create persons with unique BSNs
            const person1Id = context.generateObjectId('Persoon');
            context.createObject('Persoon', person1Id, {
                burgerservicenummer: { type: 'string', value: '123456789' }
            });
            
            const person2Id = context.generateObjectId('Persoon');
            context.createObject('Persoon', person2Id, {
                burgerservicenummer: { type: 'string', value: '987654321' } // Different BSN
            });
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Persoon');
            expect(persons.length).toBe(2);
            // Both persons should have BSNUniek = true because all BSNs are unique
            expect(persons[0].value['is BSNUniek']).toEqual({ type: 'boolean', value: true });
            expect(persons[1].value['is BSNUniek']).toEqual({ type: 'boolean', value: true });
        });

        test('should handle missing values in uniqueness check', () => {
            const modelText = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    is BSNUniek kenmerk;
                    
                Regel BSN uniekheid check
                geldig altijd
                    Een Persoon is BSNUniek
                    indien de burgerservicenummers van alle personen moeten uniek zijn.
            `;
            
            const context = new Context();
            
            // Create persons with one missing BSN
            const person1Id = context.generateObjectId('Persoon');
            context.createObject('Persoon', person1Id, {
                burgerservicenummer: { type: 'string', value: '123456789' }
            });
            
            const person2Id = context.generateObjectId('Persoon');
            context.createObject('Persoon', person2Id, {
                // No BSN provided
            });
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Persoon');
            expect(persons.length).toBe(2);
            // Missing values should be ignored in uniqueness check
            // Only non-missing values are checked, so person1 is unique
            expect(persons[0].value['is BSNUniek']).toEqual({ type: 'boolean', value: true });
            // Person2 has no BSN, so uniqueness check doesn't apply
            expect(persons[1].value['is BSNUniek']).toBeFalsy();
        });

        test('should handle empty collection', () => {
            const modelText = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    is BSNUniek kenmerk;
                    
                Regel BSN uniekheid check
                geldig altijd
                    Een Persoon is BSNUniek
                    indien de burgerservicenummers van alle personen moeten uniek zijn.
            `;
            
            const context = new Context();
            // No persons created
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Persoon');
            expect(persons.length).toBe(0);
        });

        test('should handle single item collection', () => {
            const modelText = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    is BSNUniek kenmerk;
                    
                Regel BSN uniekheid check
                geldig altijd
                    Een Persoon is BSNUniek
                    indien de burgerservicenummers van alle personen moeten uniek zijn.
            `;
            
            const context = new Context();
            
            // Create only one person
            const personId = context.generateObjectId('Persoon');
            context.createObject('Persoon', personId, {
                burgerservicenummer: { type: 'string', value: '123456789' }
            });
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Persoon');
            expect(persons.length).toBe(1);
            // Single value is always unique
            expect(persons[0].value['is BSNUniek']).toEqual({ type: 'boolean', value: true });
        });

        test('should detect multiple duplicates', () => {
            const modelText = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    is BSNUniek kenmerk;
                    
                Regel BSN uniekheid check
                geldig altijd
                    Een Persoon is BSNUniek
                    indien de burgerservicenummers van alle personen moeten uniek zijn.
            `;
            
            const context = new Context();
            
            // Create multiple persons with the same BSN
            for (let i = 0; i < 5; i++) {
                const personId = context.generateObjectId('Persoon');
                context.createObject('Persoon', personId, {
                    burgerservicenummer: { type: 'string', value: '123456789' } // All have same BSN
                });
            }
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Persoon');
            expect(persons.length).toBe(5);
            // All persons should have BSNUniek = false
            persons.forEach(person => {
                expect(person.value['is BSNUniek']).toEqual({ type: 'boolean', value: false });
            });
        });
    });
});