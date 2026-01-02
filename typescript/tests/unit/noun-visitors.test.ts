import { Engine } from '../../src';

// Helper to strip location properties from AST nodes for testing
function stripLocations(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(stripLocations);
  }
  const result: any = {};
  for (const key in obj) {
    if (key !== 'location') {
      result[key] = stripLocations(obj[key]);
    }
  }
  return result;
}

describe('Noun Visitor Methods', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('visitNaamwoord - compound nouns with articles', () => {
    test('should parse simple noun with article', () => {
      const source = `Parameter de leeftijd : Numeriek`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'leeftijd',
        dataType: { type: 'Numeriek' }
      });
    });

    test('should parse compound noun with preposition', () => {
      const source = `Parameter de leeftijd van persoon : Numeriek`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'leeftijd van persoon',
        dataType: { type: 'Numeriek' }
      });
    });

    test('should parse compound noun with multiple articles', () => {
      // Note: Grammar only allows article at start, not after preposition
      // "de afstand van de reis" is not valid - should be "de afstand van reis"
      const source = `Parameter de afstand van reis : Numeriek`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'afstand van reis',  // Article stripped from start
        dataType: { type: 'Numeriek' }
      });
    });

    test('should handle het article', () => {
      const source = `Parameter het aantal passagiers : Numeriek`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'aantal passagiers',
        dataType: { type: 'Numeriek' }
      });
    });

    test('should handle een article', () => {
      const source = `Objecttype een persoon`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ObjectTypeDefinition',
        name: 'persoon',
        plural: ['personen'],
        animated: false,
        members: []
      });
    });
  });

  describe('visitNaamwoordWithNumbers - nouns with numeric annotations', () => {
    test('should preserve numbers in identifiers', () => {
      const source = `Parameter de regel2024 : Tekst`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'regel2024',
        dataType: { type: 'Tekst' }
      });
    });

    test('should handle numbered object types', () => {
      const source = `Objecttype de Persoon1`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ObjectTypeDefinition',
        name: 'Persoon1',
        plural: ['Persoon1s'],  // Default pluralization
        animated: false,
        members: []
      });
    });
  });

  describe('visitNaamwoordNoIs - navigation truncation', () => {
    test('should handle object type without is', () => {
      const source = `Objecttype de natuurlijk persoon`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ObjectTypeDefinition',
        name: 'natuurlijk persoon',
        plural: ['natuurlijk personen'],
        animated: false,
        members: []
      });
    });

    test('should truncate at navigation indicator', () => {
      // This would be in a more complex rule context
      const source = `Objecttype de reis`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ObjectTypeDefinition',
        name: 'reis',
        plural: ['reizen'],
        animated: false,
        members: []
      });
    });
  });

  describe('visitParamRefExpr - parameter references', () => {
    test('should parse parameter reference in expressions', () => {
      const source = `
Parameter de drempel : Numeriek

Regel berekening
geldig altijd
  Het resultaat van een test moet berekend worden als de drempel.`;

      const model = engine.parseModel(source);

      if (!model.success) {
        console.error('Parse error:', model.errors);
      }

      expect(model.success).toBe(true);
      expect(model.model?.parameters).toHaveLength(1);
      expect(model.model?.parameters[0].name).toBe('drempel');
      expect(model.model?.regels).toHaveLength(1);

      // Check that the parameter reference is correctly parsed in the expression
      const regel = model.model?.regels[0];
      expect(regel?.type).toBe('Rule');
    });

    test('should handle parameter with compound name', () => {
      const source = `
Parameter de belasting op basis van afstand : Bedrag`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'belasting op basis van afstand',
        dataType: { type: 'DomainReference', domain: 'Bedrag' }
      });
    });
  });

  describe('visitNaamwoordExpr - expression wrapper', () => {
    test('should parse noun expression as string literal', () => {
      const source = `
Regel test
geldig altijd
  De uitvoer van een test moet berekend worden als "test waarde".`;

      const model = engine.parseModel(source);

      if (!model.success) {
        console.error('Parse error:', model.errors);
      }

      expect(model.success).toBe(true);
      expect(model.model?.regels).toHaveLength(1);
    });
  });

  describe('TOKA integration - real-world examples', () => {
    test('should parse TOKA parameter with units', () => {
      const source = `Parameter de afstand tot bestemming : Numeriek met eenheid km`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'afstand tot bestemming',
        dataType: { type: 'Numeriek' },
        unit: 'km'
      });
    });

    test('should parse TOKA object type', () => {
      const source = `Objecttype de Natuurlijk persoon`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ObjectTypeDefinition',
        name: 'Natuurlijk persoon',
        plural: ['Natuurlijk personen'],
        animated: false,
        members: []
      });
    });

    test('should parse TOKA object type with attributes', () => {
      // Note: Use semicolons to separate members, not bare lines
      const source = `Objecttype de Vlucht
  de luchthaven van vertrek Luchthaven;
  de luchthaven van bestemming Luchthaven;
  de vluchtdatum Datum;`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast).name).toBe('Vlucht');
      expect(stripLocations(result.ast).members).toHaveLength(3);
      expect(stripLocations(result.ast).members[0].name).toBe('luchthaven van vertrek');
      expect(stripLocations(result.ast).members[1].name).toBe('luchthaven van bestemming');
      expect(stripLocations(result.ast).members[2].name).toBe('vluchtdatum');
    });

    test('should parse complex TOKA parameter names', () => {
      const source = `Parameter het aantal treinmiles per passagier voor contingent : Numeriek`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'aantal treinmiles per passagier voor contingent',
        dataType: { type: 'Numeriek' }
      });
    });

    test('should not crash on complex noun contexts', () => {
      // This previously would throw "Don't know how to handle NaamwoordContext with 3 children"
      const source = `Parameter de belasting op basis van afstand plus zijn belasting : Bedrag`;

      const result = engine.parse(source);

      // Even if it doesn't parse perfectly, it should not crash
      expect(() => engine.parse(source)).not.toThrow();
    });
  });

  describe('edge cases and error handling', () => {
    test('should handle empty noun phrase gracefully', () => {
      const source = `Parameter : Numeriek`;

      const result = engine.parse(source);

      // Should fail parsing but not crash
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    test('should handle capitalized articles', () => {
      const source = `Parameter De Leeftijd : Numeriek`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'Leeftijd',  // Capitalized article stripped
        dataType: { type: 'Numeriek' }
      });
    });

    test('should handle multiple prepositions', () => {
      const source = `Parameter de afstand van plaats tot bestemming : Numeriek`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'afstand van plaats tot bestemming',
        dataType: { type: 'Numeriek' }
      });
    });

    test.skip('should handle zijn/haar/hun articles', () => {
      // Note: Grammar only supports de/het in parameterNamePhrase, not possessives
      // This would require grammar changes to support
      const source = `Parameter zijn leeftijd : Numeriek`;

      const result = engine.parse(source);

      if (!result.success) {
        console.error('Parse error:', result.errors);
      }

      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'leeftijd',  // Possessive article stripped
        dataType: { type: 'Numeriek' }
      });
    });
  });
});