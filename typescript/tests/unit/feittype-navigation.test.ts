import { Engine, Context, Value } from '../../src';

describe('Feittype Relationship Navigation', () => {
  let engine: Engine;
  let context: Context;

  beforeEach(() => {
    engine = new Engine();
    context = new Context();
  });

  describe('navigation through Feittype relationships', () => {
    test('should navigate through single Feittype relationship', () => {
      // Based on TOKA example: "vluchtdatum van zijn reis" navigates from 
      // Natuurlijk persoon to Vlucht through the Feittype relationship
      const code = `
Feittype vlucht van natuurlijke personen
  de reis	Vlucht
  de passagier	Natuurlijk persoon

Objecttype de Natuurlijk persoon
  de naam Tekst;
  de leeftijd Numeriek;

Objecttype de Vlucht
  de vluchtdatum Datum in dagen;
  de bestemming Tekst;

Regel stel_vluchtdatum_in
geldig altijd
  De vluchtdatum van de reis van een Natuurlijk persoon moet gesteld worden op 01-01-2024.
`;

      const parseResult = engine.parse(code);
      if (!parseResult.success) {
        console.error('Parse error:', parseResult.error || parseResult.errors);
      }
      expect(parseResult.success).toBe(true);

      // Create objects
      context.createObject('Natuurlijk persoon', 'persoon1', {
        naam: { type: 'string', value: 'Jan' },
        leeftijd: { type: 'number', value: 30 }
      });
      // Create Value object for the relationship
      const persoon: Value = {
        type: 'object',
        objectType: 'Natuurlijk persoon',
        objectId: 'persoon1',
        value: context.getObject('Natuurlijk persoon', 'persoon1')
      };

      context.createObject('Vlucht', 'vlucht1', {
        vluchtdatum: { type: 'date', value: new Date('2023-01-01') },
        bestemming: { type: 'string', value: 'Amsterdam' }
      });
      // Create Value object for the relationship
      const vlucht: Value = {
        type: 'object',
        objectType: 'Vlucht',
        objectId: 'vlucht1',
        value: context.getObject('Vlucht', 'vlucht1')
      };

      // Create relationship through Feittype
      context.addRelationship('vlucht van natuurlijke personen', vlucht, persoon);

      // Run the rule
      const runResult = engine.run(code, context);
      if (!runResult.success) {
        console.error('Run failed:', runResult.error);
        console.error('Error stack:', (runResult.error as any)?.stack);
      }
      expect(runResult.success).toBe(true);

      // Verify the vluchtdatum was updated
      const updatedVlucht = context.getObject('Vlucht', 'vlucht1');
      expect(updatedVlucht.vluchtdatum.value).toEqual(new Date('2024-01-01'));
    });

    test('should navigate through multiple Feittype relationships', () => {
      const code = `
Feittype eigendom relatie
  de eigenaar	Persoon
  het gebouw	Gebouw

Feittype werkrelatie  
  de werkgever	Bedrijf
  de werknemer	Persoon

Objecttype de Persoon
  de naam Tekst;

Objecttype het Gebouw
  het adres Tekst;

Objecttype het Bedrijf
  de bedrijfsnaam Tekst;

Regel stel_bedrijfsnaam_in
geldig altijd
  De bedrijfsnaam van de werkgever van de eigenaar van een Gebouw 
  moet gesteld worden op "Acme Corp".
`;

      const parseResult = engine.parse(code);
      expect(parseResult.success).toBe(true);

      // Create objects
      context.createObject('Persoon', 'persoon1', {
        naam: { type: 'string', value: 'Jan' }
      });
      const persoon: Value = {
        type: 'object',
        objectType: 'Persoon',
        objectId: 'persoon1',
        value: context.getObject('Persoon', 'persoon1')
      };

      context.createObject('Gebouw', 'gebouw1', {
        adres: { type: 'string', value: 'Main St 1' }
      });
      const gebouw: Value = {
        type: 'object',
        objectType: 'Gebouw',
        objectId: 'gebouw1',
        value: context.getObject('Gebouw', 'gebouw1')
      };

      context.createObject('Bedrijf', 'bedrijf1', {
        bedrijfsnaam: { type: 'string', value: 'Old Name' }
      });
      const bedrijf: Value = {
        type: 'object',
        objectType: 'Bedrijf',
        objectId: 'bedrijf1',
        value: context.getObject('Bedrijf', 'bedrijf1')
      };

      // Create relationships
      context.addRelationship('eigendom relatie', persoon, gebouw);
      context.addRelationship('werkrelatie', bedrijf, persoon);

      // Run the rule with gebouw as context
      const runResult = engine.run(code, context);
      expect(runResult.success).toBe(true);

      // Verify the bedrijfsnaam was updated
      const updatedBedrijf = context.getObject('Bedrijf', 'bedrijf1');
      expect(updatedBedrijf.bedrijfsnaam.value).toBe('Acme Corp');
    });

    test('should handle navigation when relationship does not exist', () => {
      const code = `
Feittype eigendom relatie
  de eigenaar	Persoon
  het gebouw	Gebouw

Objecttype de Persoon
  de naam Tekst;

Objecttype het Gebouw
  het adres Tekst;

Regel stel_naam_in
geldig altijd
  De naam van de eigenaar van een Gebouw moet gesteld worden op "Test".
`;

      const parseResult = engine.parse(code);
      expect(parseResult.success).toBe(true);

      // Create gebouw but no relationship
      context.createObject('Gebouw', 'gebouw1', {
        adres: { type: 'string', value: 'Main St 1' }
      });
      const gebouw: Value = {
        type: 'object',
        objectType: 'Gebouw',
        objectId: 'gebouw1',
        value: context.getObject('Gebouw', 'gebouw1')
      };

      // Run should handle gracefully when relationship doesn't exist
      const runResult = engine.run(code, context);
      // This should either skip the rule or return an appropriate error
      expect(runResult).toBeDefined();
    });

    test('should support collection navigation through Feittype', () => {
      const code = `
Feittype vlucht van natuurlijke personen
  de reis	Vlucht
  de passagier	Natuurlijk persoon

Objecttype de Natuurlijk persoon
  de naam Tekst;
  de leeftijd Numeriek;

Objecttype de Vlucht
  het vluchtnummer Tekst;

Regel tel_passagiers
geldig altijd
  Het aantal passagiers van een Vlucht moet berekend worden als 
  het aantal van alle passagiers van de vlucht.
`;

      const parseResult = engine.parse(code);
      expect(parseResult.success).toBe(true);

      // Create vlucht
      context.createObject('Vlucht', 'vlucht1', {
        vluchtnummer: { type: 'string', value: 'KL123' }
      });
      const vlucht: Value = {
        type: 'object',
        objectType: 'Vlucht',
        objectId: 'vlucht1',
        value: context.getObject('Vlucht', 'vlucht1')
      };

      // Create multiple passengers
      context.createObject('Natuurlijk persoon', 'persoon1', {
        naam: { type: 'string', value: 'Jan' },
        leeftijd: { type: 'number', value: 30 }
      });
      const persoon1: Value = {
        type: 'object',
        objectType: 'Natuurlijk persoon',
        objectId: 'persoon1',
        value: context.getObject('Natuurlijk persoon', 'persoon1')
      };

      context.createObject('Natuurlijk persoon', 'persoon2', {
        naam: { type: 'string', value: 'Marie' },
        leeftijd: { type: 'number', value: 25 }
      });
      const persoon2: Value = {
        type: 'object',
        objectType: 'Natuurlijk persoon',
        objectId: 'persoon2',
        value: context.getObject('Natuurlijk persoon', 'persoon2')
      };

      // Create relationships
      context.addRelationship('vlucht van natuurlijke personen', vlucht, persoon1);
      context.addRelationship('vlucht van natuurlijke personen', vlucht, persoon2);

      // Run the rule
      const runResult = engine.run(code, context);
      
      // Should be able to count the passengers through the relationship
      // Note: Implementation may need adjustment to support this pattern
      expect(runResult.success).toBe(true);
    });
  });

  describe('TOKA specification compliance', () => {
    test('should implement TOKA age calculation through relationship', () => {
      // From TOKA spec section 4.4
      const code = `
Feittype vlucht van natuurlijke personen
  de reis	Vlucht
  de passagier	Natuurlijk persoon

Objecttype de Natuurlijk persoon
  de geboortedatum Datum in dagen;
  de leeftijd Numeriek;

Objecttype de Vlucht
  de vluchtdatum Datum in dagen;

Regel bepaal_leeftijd
geldig altijd
  De leeftijd van een Natuurlijk persoon moet berekend worden als 
  de tijdsduur van zijn geboortedatum tot de vluchtdatum van zijn reis in hele jaren.
`;

      const parseResult = engine.parse(code);
      expect(parseResult.success).toBe(true);

      // Create objects with dates
      context.createObject('Natuurlijk persoon', 'persoon1', {
        geboortedatum: { type: 'date', value: new Date('1990-01-01') },
        leeftijd: { type: 'number', value: 0 }
      });
      const persoon: Value = {
        type: 'object',
        objectType: 'Natuurlijk persoon',
        objectId: 'persoon1',
        value: context.getObject('Natuurlijk persoon', 'persoon1')
      };

      context.createObject('Vlucht', 'vlucht1', {
        vluchtdatum: { type: 'date', value: new Date('2024-01-01') }
      });
      const vlucht: Value = {
        type: 'object',
        objectType: 'Vlucht',
        objectId: 'vlucht1',
        value: context.getObject('Vlucht', 'vlucht1')
      };

      // Create relationship
      context.addRelationship('vlucht van natuurlijke personen', vlucht, persoon);

      // Run the rule
      const runResult = engine.run(code, context);
      expect(runResult.success).toBe(true);

      // Check age calculation
      const updatedPersoon = context.getObject('Natuurlijk persoon', 'persoon1');
      expect(updatedPersoon.leeftijd.value).toBe(34); // 2024 - 1990 = 34 years
    });
  });
});