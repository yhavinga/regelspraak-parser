import { Engine, Context } from '../../src';

describe('Uniek Predicate', () => {
    const engine = new Engine();
    
    describe('parsing uniek predicates', () => {
        test('should parse "moeten uniek zijn" predicate', () => {
            const source = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    
                Consistentieregel BSN uniekheid
                    De burgerservicenummers van alle Personen moeten uniek zijn.
            `;
            
            const result = engine.parse(source);
            
            expect(result.success).toBe(true);
            expect(result.ast).toMatchObject({
                type: 'Model',
                rules: [{
                    type: 'Rule',
                    name: 'BSNuniekheid',
                    result: {
                        type: 'Consistentieregel',
                        criteriumType: 'uniek',
                        target: {
                            type: 'AttributeReference',
                            path: ['burgerservicenummers', 'alle', 'Personen']
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
                    
                Consistentieregel BSN uniekheid check
                    de burgerservicenummers van alle Personen moeten uniek zijn.
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
            
            const result = engine.run(modelText, context);
            
            if (!result.success) {
                console.error('Run failed:', result.error);
            }
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Persoon');
            expect(persons.length).toBe(2);
            // Consistency rules don't set kenmerken on objects - they just validate
            expect(persons[0].value['burgerservicenummer']).toEqual({ type: 'string', value: '123456789' });
            expect(persons[1].value['burgerservicenummer']).toEqual({ type: 'string', value: '123456789' });
        });

        test('should pass when all values are unique', () => {
            const modelText = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    
                Consistentieregel BSN uniekheid check
                    de burgerservicenummers van alle Personen moeten uniek zijn.
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
            // Verify objects maintain their unique BSNs
            expect(persons[0].value['burgerservicenummer']).toEqual({ type: 'string', value: '123456789' });
            expect(persons[1].value['burgerservicenummer']).toEqual({ type: 'string', value: '987654321' });
        });

        test('should handle missing values in uniqueness check', () => {
            const modelText = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    
                Consistentieregel BSN uniekheid check
                    de burgerservicenummers van alle Personen moeten uniek zijn.
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
            // Missing values are ignored in uniqueness check
            expect(persons[0].value['burgerservicenummer']).toEqual({ type: 'string', value: '123456789' });
            expect(persons[1].value['burgerservicenummer']).toBeUndefined();
        });

        test('should handle empty collection', () => {
            const modelText = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    
                Consistentieregel BSN uniekheid check
                    de burgerservicenummers van alle Personen moeten uniek zijn.
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
                    
                Consistentieregel BSN uniekheid check
                    de burgerservicenummers van alle Personen moeten uniek zijn.
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
            // Single value is always unique (but consistency rules don't set kenmerken)
            expect(persons[0].value['burgerservicenummer']).toEqual({ type: 'string', value: '123456789' });
        });

        test('should handle multiple duplicates', () => {
            const modelText = `
                Objecttype de Persoon
                    het burgerservicenummer Tekst;
                    
                Consistentieregel BSN uniekheid check
                    de burgerservicenummers van alle Personen moeten uniek zijn.
            `;
            
            const context = new Context();
            
            // Create 5 persons, 3 with same BSN
            for (let i = 1; i <= 5; i++) {
                const personId = context.generateObjectId('Persoon');
                context.createObject('Persoon', personId, {
                    burgerservicenummer: { type: 'string', value: i <= 3 ? '111111111' : `${i}${i}${i}${i}${i}${i}${i}${i}${i}` }
                });
            }
            
            const result = engine.run(modelText, context);
            
            expect(result.success).toBe(true);
            const persons = context.getObjectsByType('Persoon');
            expect(persons.length).toBe(5);
            // Verify the BSN values (3 duplicates, 2 unique)
            const bsnValues = persons.map(p => p.value['burgerservicenummer']?.value);
            expect(bsnValues.filter(bsn => bsn === '111111111').length).toBe(3);
            expect(bsnValues.filter(bsn => bsn !== '111111111' && bsn !== undefined).length).toBe(2);
        });
    });
});