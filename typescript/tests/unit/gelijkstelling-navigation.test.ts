import { Engine, Context } from '../../src';

describe('Gelijkstelling - Complex Navigation', () => {
  let engine: Engine;
  let context: Context;

  beforeEach(() => {
    engine = new Engine();
    context = new Context();
  });

  describe('three-level navigation', () => {
    test('should set attribute through two-level navigation', () => {
      const code = `
Objecttype de Adres
  de straatnaam Tekst;
  het huisnummer Numeriek;

Objecttype de Persoon  
  de naam Tekst;
  het adres Adres;

Objecttype de Bedrijf
  de eigenaar Persoon;

Regel bereken straatnaam
geldig altijd
  De straatnaam van het adres van de eigenaar van een Bedrijf moet gesteld worden op "Hoofdstraat".
`;

      const parseResult = engine.parse(code);
      if (!parseResult.success) {
        console.error('Parse error:', parseResult.error);
        console.error('Parse result:', JSON.stringify(parseResult, null, 2));
      }
      expect(parseResult.success).toBe(true);

      // Create nested structure
      const adres = {
        straatnaam: { type: 'string' as const, value: '' },
        huisnummer: { type: 'number' as const, value: 0 }
      };
      const persoon = {
        naam: { type: 'string' as const, value: 'Jan' },
        adres: { type: 'object' as const, value: adres }
      };
      const bedrijf = {
        eigenaar: { type: 'object' as const, value: persoon }
      };
      
      context.createObject('Bedrijf', 'bedrijf1', bedrijf);

      const runResult = engine.run(code, context);
      expect(runResult.success).toBe(true);

      // Check if the straatnaam was set
      const bedrijfObj = context.getObject('Bedrijf', 'bedrijf1');
      const eigenaar = (bedrijfObj.eigenaar as any).value;
      const adresObj = eigenaar.adres.value;
      expect(adresObj.straatnaam.value).toBe('Hoofdstraat');
    });

    test('should handle navigation with missing intermediate object', () => {
      const code = `
Objecttype de Adres
  de straatnaam Tekst;

Objecttype de Persoon  
  het adres Adres;

Objecttype de Bedrijf
  de eigenaar Persoon;

Regel bereken straatnaam
geldig altijd
  De straatnaam van het adres van de eigenaar van een Bedrijf moet gesteld worden op "Test".
`;

      const parseResult = engine.parse(code);
      if (!parseResult.success) {
        console.error('Parse error:', parseResult.error);
        console.error('Parse result:', JSON.stringify(parseResult, null, 2));
      }
      expect(parseResult.success).toBe(true);

      // Create structure with missing adres
      const persoon = {
        // No adres attribute
      };
      const bedrijf = {
        eigenaar: { type: 'object' as const, value: persoon }
      };
      
      context.createObject('Bedrijf', 'bedrijf1', bedrijf);

      const runResult = engine.run(code, context);
      // Should handle gracefully - either skip or error
      expect(runResult.success).toBe(true);
    });
  });

  describe('four-level navigation', () => {
    test('should set attribute through three-level navigation', () => {
      const code = `
Objecttype de Land
  de naam Tekst;

Objecttype de Stad
  het land Land;
  de naam Tekst;

Objecttype de Adres
  de stad Stad;
  de straatnaam Tekst;

Objecttype de Persoon
  het adres Adres;
  de naam Tekst;

Objecttype de Bedrijf
  de eigenaar Persoon;

Regel bereken landnaam
geldig altijd
  De naam van het land van de stad van het adres van de eigenaar van een Bedrijf moet gesteld worden op "Nederland".
`;

      const parseResult = engine.parse(code);
      if (!parseResult.success) {
        console.error('Parse error:', parseResult.error);
        console.error('Parse result:', JSON.stringify(parseResult, null, 2));
      }
      expect(parseResult.success).toBe(true);

      // Create deep nested structure
      const land = {
        naam: { type: 'string' as const, value: '' }
      };
      const stad = {
        land: { type: 'object' as const, value: land },
        naam: { type: 'string' as const, value: 'Amsterdam' }
      };
      const adres = {
        stad: { type: 'object' as const, value: stad },
        straatnaam: { type: 'string' as const, value: 'Damrak' }
      };
      const persoon = {
        adres: { type: 'object' as const, value: adres },
        naam: { type: 'string' as const, value: 'Piet' }
      };
      const bedrijf = {
        eigenaar: { type: 'object' as const, value: persoon }
      };
      
      context.createObject('Bedrijf', 'bedrijf1', bedrijf);

      const runResult = engine.run(code, context);
      expect(runResult.success).toBe(true);

      // Check if the land naam was set
      const bedrijfObj = context.getObject('Bedrijf', 'bedrijf1');
      const eigenaar = (bedrijfObj.eigenaar as any).value;
      const adresObj = eigenaar.adres.value;
      const stadObj = adresObj.stad.value;
      const landObj = stadObj.land.value;
      expect(landObj.naam.value).toBe('Nederland');
    });
  });

  describe('navigation with calculations', () => {
    test('should evaluate expression and set through navigation', () => {
      const code = `
Objecttype de Factuur
  het bedrag Bedrag;
  de btw Bedrag;

Objecttype de Klant
  de factuur Factuur;

Objecttype de Bedrijf
  de klant Klant;

Parameter het btw_percentage: Numeriek;

Regel bereken btw
geldig altijd
  De btw van de factuur van de klant van een Bedrijf moet berekend worden als 21.
`;

      const parseResult = engine.parse(code);
      if (!parseResult.success) {
        console.error('Parse error:', parseResult.error);
        console.error('Parse result:', JSON.stringify(parseResult, null, 2));
      }
      expect(parseResult.success).toBe(true);

      // Set parameter
      context.setVariable('btw_percentage', { 
        type: 'number' as const, 
        value: 0.21
      });

      // Create structure
      const factuur = {
        bedrag: { type: 'number' as const, value: 100, unit: 'EUR' },
        btw: { type: 'number' as const, value: 0, unit: 'EUR' }
      };
      const klant = {
        factuur: { type: 'object' as const, value: factuur }
      };
      const bedrijf = {
        klant: { type: 'object' as const, value: klant }
      };
      
      context.createObject('Bedrijf', 'bedrijf1', bedrijf);

      const runResult = engine.run(code, context);
      if (!runResult.success) {
        console.error('Run error:', runResult.error);
      }
      expect(runResult.success).toBe(true);

      // Check if btw was calculated
      const bedrijfObj = context.getObject('Bedrijf', 'bedrijf1');
      const klantObj = (bedrijfObj.klant as any).value;
      const factuurObj = klantObj.factuur.value;
      expect(factuurObj.btw.value).toBe(21);
    });
  });

  describe('multiple objects iteration', () => {
    test('should set attributes on all objects when using object-scoped rule', () => {
      const code = `
Objecttype de Product
  de naam Tekst;
  de prijs Bedrag;
  de korting Bedrag;

Objecttype de Winkel
  het product Product;

Regel bereken korting
geldig altijd
  De korting van het product van een Winkel moet berekend worden als 
  de prijs van zijn product maal 0,1.
`;

      const parseResult = engine.parse(code);
      if (!parseResult.success) {
        console.error('Parse error:', parseResult.error);
        console.error('Parse result:', JSON.stringify(parseResult, null, 2));
      }
      expect(parseResult.success).toBe(true);

      // Create multiple winkels
      const product1 = {
        naam: { type: 'string' as const, value: 'Appel' },
        prijs: { type: 'number' as const, value: 2, unit: 'EUR' },
        korting: { type: 'number' as const, value: 0, unit: 'EUR' }
      };
      const winkel1 = {
        product: { type: 'object' as const, value: product1 }
      };

      const product2 = {
        naam: { type: 'string' as const, value: 'Banaan' },
        prijs: { type: 'number' as const, value: 3, unit: 'EUR' },
        korting: { type: 'number' as const, value: 0, unit: 'EUR' }
      };
      const winkel2 = {
        product: { type: 'object' as const, value: product2 }
      };
      
      context.createObject('Winkel', 'winkel1', winkel1);
      context.createObject('Winkel', 'winkel2', winkel2);

      const runResult = engine.run(code, context);
      expect(runResult.success).toBe(true);

      // Check if korting was set on both products
      const winkel1Obj = context.getObject('Winkel', 'winkel1');
      const product1Obj = (winkel1Obj.product as any).value;
      expect(product1Obj.korting.value).toBeCloseTo(0.2);

      const winkel2Obj = context.getObject('Winkel', 'winkel2');
      const product2Obj = (winkel2Obj.product as any).value;
      expect(product2Obj.korting.value).toBeCloseTo(0.3);
    });
  });

  describe('error handling', () => {
    test('should handle undefined navigation attribute gracefully', () => {
      const code = `
Objecttype de Persoon
  de naam Tekst;

Objecttype de Bedrijf
  de eigenaar Persoon;

Regel bereken naam
geldig altijd
  De naam van de manager van een Bedrijf moet gesteld worden op "Test".
`;

      const parseResult = engine.parse(code);
      if (!parseResult.success) {
        console.error('Parse error:', parseResult.error);
        console.error('Parse result:', JSON.stringify(parseResult, null, 2));
      }
      expect(parseResult.success).toBe(true);

      const bedrijf = {
        eigenaar: { 
          type: 'object' as const, 
          value: { naam: { type: 'string' as const, value: 'Jan' } }
        }
        // No manager attribute
      };
      
      context.createObject('Bedrijf', 'bedrijf1', bedrijf);

      const runResult = engine.run(code, context);
      // Should complete without crashing
      expect(runResult.success).toBe(true);
    });

    test('should handle non-object in navigation chain', () => {
      const code = `
Objecttype de Persoon
  de naam Tekst;
  het salaris Bedrag;

Objecttype de Bedrijf
  de eigenaar Persoon;

Regel bereken salaris waarde
geldig altijd
  De waarde van het salaris van de eigenaar van een Bedrijf moet gesteld worden op 100.
`;

      const parseResult = engine.parse(code);
      if (!parseResult.success) {
        console.error('Parse error:', parseResult.error);
        console.error('Parse result:', JSON.stringify(parseResult, null, 2));
      }
      expect(parseResult.success).toBe(true);

      const persoon = {
        naam: { type: 'string' as const, value: 'Jan' },
        salaris: { type: 'number' as const, value: 50, unit: 'EUR' }
      };
      const bedrijf = {
        eigenaar: { type: 'object' as const, value: persoon }
      };
      
      context.createObject('Bedrijf', 'bedrijf1', bedrijf);

      const runResult = engine.run(code, context);
      // Should handle the fact that salaris is not an object
      expect(runResult.success).toBe(true);
    });
  });
});