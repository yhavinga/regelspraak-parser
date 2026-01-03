import { Engine, Context, Value } from '../../src';

/**
 * Tests for possessive pronouns (zijn/haar/hun) in bezieldeReferentie navigation.
 * These tests validate that haar and hun work like zijn for navigation.
 */
describe('Possessive Pronouns in Navigation (bezieldeReferentie)', () => {
    let engine: Engine;
    let context: Context;

    beforeEach(() => {
        engine = new Engine();
        context = new Context();
    });

    describe('parsing possessive pronouns', () => {
        test('should parse "zijn" possessive in navigation', () => {
            // "zijn" has always been supported
            const code = `
Objecttype de Persoon
  de naam Tekst;
  de leeftijd Numeriek;

Regel test_zijn
geldig altijd
  De leeftijd van een Persoon moet berekend worden als zijn leeftijd.
`;
            const result = engine.parse(code);
            expect(result.success).toBe(true);
        });

        test('should parse "haar" possessive in navigation', () => {
            // "haar" support was added - this would fail without the fix
            const code = `
Objecttype de Vrouw
  de naam Tekst;
  de leeftijd Numeriek;

Regel test_haar
geldig altijd
  De naam van een Vrouw moet gesteld worden op haar naam.
`;
            const result = engine.parse(code);
            if (!result.success) {
                console.error('Parse error:', result.errors);
            }
            expect(result.success).toBe(true);
        });

        test('should parse "hun" possessive in navigation', () => {
            // "hun" support was added - this would fail without the fix
            const code = `
Objecttype de Groep
  de naam Tekst;
  het aantal leden Numeriek;

Regel test_hun
geldig altijd
  Het aantal leden van een Groep moet berekend worden als hun aantal leden.
`;
            const result = engine.parse(code);
            if (!result.success) {
                console.error('Parse error:', result.errors);
            }
            expect(result.success).toBe(true);
        });
    });

    describe('executing rules with possessive pronouns', () => {
        test('should execute rule with "haar" navigation', () => {
            const code = `
Objecttype de Vrouw
  de naam Tekst;
  de dubbele naam Tekst;

Regel dubbel_naam
geldig altijd
  De dubbele naam van een Vrouw moet gesteld worden op haar naam.
`;
            const parseResult = engine.parse(code);
            expect(parseResult.success).toBe(true);

            // Create object
            context.createObject('Vrouw', 'vrouw1', {
                naam: { type: 'string', value: 'Maria' },
                'dubbele naam': { type: 'string', value: '' }
            });

            const runResult = engine.run(code, context);
            expect(runResult.success).toBe(true);

            // Verify the attribute was set using haar navigation
            const vrouw = context.getObject('Vrouw', 'vrouw1');
            expect(vrouw['dubbele naam']?.value).toBe('Maria');
        });

        test('should execute rule with "hun" navigation', () => {
            const code = `
Objecttype het Team
  het motto Tekst;
  de slogan Tekst;

Regel kopieer_motto
geldig altijd
  De slogan van een Team moet gesteld worden op hun motto.
`;
            const parseResult = engine.parse(code);
            expect(parseResult.success).toBe(true);

            // Create object
            context.createObject('Team', 'team1', {
                motto: { type: 'string', value: 'Samen sterk' },
                slogan: { type: 'string', value: '' }
            });

            const runResult = engine.run(code, context);
            expect(runResult.success).toBe(true);

            // Verify the attribute was set using hun navigation
            const team = context.getObject('Team', 'team1');
            expect(team.slogan?.value).toBe('Samen sterk');
        });
    });
});
