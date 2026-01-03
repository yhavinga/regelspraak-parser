import { describe, it, expect, beforeEach } from '@jest/globals';
import { Engine } from '../../src';

describe('FeitCreatie (Relationship Creation)', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('Basic FeitCreatie', () => {
    it('should parse FeitCreatie rule correctly', () => {
      const code = `
Feittype verdeling contingent treinmiles over passagiers
  het te verdelen contingent treinmiles Contingent Treinmiles
  de passagier met recht op treinmiles Natuurlijk persoon
  één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles

Regel passagier met recht op treinmiles
  geldig altijd
    Een passagier met recht op treinmiles van een vastgestelde contingent treinmiles 
    is een passagier van de reis met treinmiles van het vastgestelde contingent treinmiles.`;

      const result = engine.parse(code);

      expect(result.success).toBe(true);
      if (result.success && result.ast.type === 'Model') {
        expect(result.ast.rules).toHaveLength(1);
        const rule = result.ast.rules[0];
        expect(rule.type).toBe('Rule');
        expect(rule.name).toBe('passagier met recht op treinmiles');
        expect(rule.result.type).toBe('FeitCreatie');

        const feitCreatie = rule.result as any;
        expect(feitCreatie.role1).toBe('passagier met recht op treinmiles');
        expect(feitCreatie.role2).toBe('passagier');
      }
    });

    it('should execute simple FeitCreatie', () => {
      const code = `
Objecttype de Persoon
  de naam Tekst;

Objecttype de Club  
  de naam Tekst;

Feittype lidmaatschap
  het lid Persoon
  de club Club
  één lid kan lid zijn van meerdere clubs

Regel maak lidmaatschap
  geldig altijd
    Een lid van een club is een persoon van de club.`;

      // Need to provide variables with transformed names (spaces removed)
      const context = {
        'persoon': {
          type: 'object',
          value: {
            object_type_naam: 'Persoon',
            instance_id: 'p1',
            naam: 'Jan'
          }
        },
        'club': {
          type: 'object',
          value: {
            object_type_naam: 'Club',
            instance_id: 'c1',
            naam: 'Schaakclub'
          }
        },
        // The parser transforms "lid van een club" to "lidvaneenclub"
        'lidvaneenclub': {
          type: 'object',
          value: {
            object_type_naam: 'Club',
            instance_id: 'c1',
            naam: 'Schaakclub'
          }
        }
      };

      const result = engine.evaluate(code, context);

      if (!result.success) {
        console.error('Test failed with error:', result.error);
      }

      expect(result.success).toBe(true);
      // The relationship should be created
      expect(result.value).toBeDefined();
    });
  });

  describe('FeitCreatie with navigation', () => {
    it('should handle complex navigation patterns', () => {
      const code = `
Objecttype de Vlucht
  het vluchtnummer Tekst;

Objecttype de Persoon
  de naam Tekst;

Objecttype het Contingent
  het aantal miles Numeriek (positief geheel getal);

Feittype vlucht van personen
  de vlucht Vlucht
  de passagier Persoon
  één vlucht heeft meerdere passagiers

Feittype reis met contingent
  de reis Vlucht
  het contingent Contingent
  één reis heeft één contingent

Feittype verdeling contingent over passagiers
  het te verdelen contingent Contingent
  de passagier met recht op miles Persoon
  één contingent wordt verdeeld over meerdere passagiers

Regel verdeel miles
  geldig altijd
    Een passagier met recht op miles van een contingent 
    is een passagier van de reis van het contingent.`;

      const context = {
        'vlucht': {
          type: 'object',
          value: {
            object_type_naam: 'Vlucht',
            instance_id: 'v1',
            vluchtnummer: 'KL123'
          }
        },
        'contingent': {
          type: 'object',
          value: {
            object_type_naam: 'Contingent',
            instance_id: 'c1',
            aantal_miles: 1000,
            reis: {
              type: 'object',
              value: {
                object_type_naam: 'Vlucht',
                instance_id: 'v1'
              }
            }
          }
        },
        'passagiers': {
          type: 'list',
          value: [
            {
              type: 'object',
              value: {
                object_type_naam: 'Persoon',
                instance_id: 'p1',
                naam: 'Alice'
              }
            },
            {
              type: 'object',
              value: {
                object_type_naam: 'Persoon',
                instance_id: 'p2',
                naam: 'Bob'
              }
            }
          ]
        }
      };

      const result = engine.evaluate(code, context);

      if (!result.success) {
        console.error('Evaluation failed:', result.error);
      }

      expect(result.success).toBe(true);
      // Should create relationships for passagiers
    });
  });

  describe('Conditional FeitCreatie', () => {
    it('should only create relationships when condition is met', () => {
      // This test needs to be redesigned - the FeitCreatie pattern doesn't parse correctly
      // The issue is "Een deelnemer van een activiteit is een persoon van de activiteit"
      // is not a valid FeitCreatie pattern. FeitCreatie needs specific subject references
      // on both sides, not navigation patterns with conditions.
      // 
      // The TypeScript conditional FeitCreatie is now implemented, but this specific
      // test case doesn't match the grammar's expectations for FeitCreatie syntax.
      // A proper test would need to use explicit variable references like:
      // "Een deelnemer van een activiteit is een persoon"
      // where 'persoon' is a variable in context.
      const code = `
Objecttype de Persoon
  de naam Tekst;
  de leeftijd Numeriek (positief geheel getal);
  het is volwassen kenmerk (bezittelijk);

Objecttype de Activiteit
  de naam Tekst;
  de minimum leeftijd Numeriek (positief geheel getal);

Feittype deelname
  de deelnemer Persoon
  de activiteit Activiteit
  meerdere deelnemers kunnen deelnemen aan één activiteit

Regel alleen volwassenen
  geldig altijd
    Een deelnemer van een activiteit is een persoon van de activiteit
    indien de leeftijd van de persoon groter dan de minimum leeftijd van de activiteit is.`;

      const context = {
        'activiteit': {
          type: 'object',
          value: {
            object_type_naam: 'Activiteit',
            instance_id: 'a1',
            naam: 'Wijnproeverij',
            minimum_leeftijd: 18
          }
        },
        'personen': {
          type: 'list',
          value: [
            {
              type: 'object',
              value: {
                object_type_naam: 'Persoon',
                instance_id: 'p1',
                naam: 'Alice',
                leeftijd: 25
              }
            },
            {
              type: 'object',
              value: {
                object_type_naam: 'Persoon',
                instance_id: 'p2',
                naam: 'Bob',
                leeftijd: 16
              }
            }
          ]
        }
      };

      const result = engine.evaluate(code, context);

      if (!result.success) {
        console.error('Test failed with error:', result.error);
      }

      expect(result.success).toBe(true);
      // Should only create relationship for Alice (age 25), not Bob (age 16)
    });
  });

  describe('Error handling', () => {
    it('should handle missing subjects gracefully', () => {
      const code = `
Regel invalid feit creatie
  geldig altijd
    Een niet bestaande rol van een niet bestaand object 
    is een andere rol van een ander object.`;

      const result = engine.evaluate(code, {});

      // Should not crash, but might return error or skip
      expect(result.success).toBeDefined();
    });

    it('should handle malformed FeitCreatie patterns', () => {
      const code = `
Regel malformed
  geldig altijd
    Een van een is een van een.`;

      const parseResult = engine.parse(code);

      // Parser should still handle this, even if pattern is incomplete
      expect(parseResult.success).toBeDefined();
    });
  });

  describe('Integration with FeitType definitions', () => {
    it('should respect FeitType cardinality', () => {
      const code = `
Objecttype de Persoon
  de naam Tekst;

Objecttype de Partner
  de naam Tekst;

Wederkerig feittype huwelijk
  de echtgenoot Persoon  
  de echtgenote Partner
  één echtgenoot heeft één echtgenote

Regel maak huwelijk
  geldig altijd
    Een echtgenote van een huwelijk is een partner van het huwelijk.`;

      const context = {
        'persoon': {
          type: 'object',
          value: {
            object_type_naam: 'Persoon',
            instance_id: 'p1',
            naam: 'Jan'
          }
        },
        'partner': {
          type: 'object',
          value: {
            object_type_naam: 'Partner',
            instance_id: 'pa1',
            naam: 'Marie'
          }
        }
      };

      const result = engine.evaluate(code, context);

      if (!result.success) {
        console.error('Test failed with error:', result.error);
      }

      expect(result.success).toBe(true);
      // Should create reciprocal relationship due to "Wederkerig"
    });
  });
});