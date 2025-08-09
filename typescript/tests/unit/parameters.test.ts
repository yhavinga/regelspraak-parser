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

describe('Engine - Parameter Definitions', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('basic parameter parsing', () => {
    test('should parse simple numeric parameter', () => {
      const source = `Parameter de volwassenleeftijd : Numeriek (geheel getal);`;
      
      const result = engine.parse(source);
      
      if (!result.success) {
        console.log('Parse error:', result.errors);
      }
      
      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'volwassenleeftijd',
        dataType: { type: 'Numeriek', specification: 'geheel getal' }
      });
    });

    test('should parse parameter with unit', () => {
      const source = `Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;`;
      
      const result = engine.parse(source);
      
      if (!result.success) {
        console.log('Parse error:', result.errors);
      }
      
      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'volwassenleeftijd',
        dataType: { type: 'Numeriek', specification: 'geheel getal' },
        unit: 'jr'
      });
    });

    test('should parse parameter with domain reference', () => {
      const source = `Parameter het aantal kinderen : AantalKinderen;`;
      
      const result = engine.parse(source);
      
      if (!result.success) {
        console.log('Parse error:', result.errors);
      }
      
      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'aantal kinderen',
        dataType: { type: 'DomainReference', domain: 'AantalKinderen' }
      });
    });

    test('should parse text parameter', () => {
      const source = `Parameter de standaard locatie : Tekst;`;
      
      const result = engine.parse(source);
      
      if (!result.success) {
        console.log('Parse error:', result.errors);
      }
      
      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'standaard locatie',
        dataType: { type: 'Tekst' }
      });
    });

    test('should parse date parameter', () => {
      const source = `Parameter de startdatum : Datum in dagen;`;
      
      const result = engine.parse(source);
      
      if (!result.success) {
        console.log('Parse error:', result.errors);
      }
      
      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'startdatum',
        dataType: { type: 'Datum' }
      });
    });

    test('should parse parameter with timeline', () => {
      const source = `Parameter de startdatum : Datum in dagen voor elke dag;`;
      
      const result = engine.parse(source);
      
      if (!result.success) {
        console.log('Parse error:', result.errors);
      }
      
      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'startdatum',
        dataType: { type: 'Datum' },
        timeline: true
      });
    });

    test('should parse parameter with Euro unit', () => {
      const source = `Parameter de initiele belasting : Bedrag met eenheid €;`;
      
      const result = engine.parse(source);
      
      if (!result.success) {
        console.log('Parse error:', result.errors);
      }
      
      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'initiele belasting',
        dataType: { type: 'DomainReference', domain: 'Bedrag' },
        unit: '€'
      });
    });

    test('should parse parameter with semicolon', () => {
      const source = `Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;`;
      
      const result = engine.parse(source);
      
      if (!result.success) {
        console.log('Parse error:', result.errors);
      }
      
      expect(result.success).toBe(true);
      expect(stripLocations(result.ast)).toEqual({
        type: 'ParameterDefinition',
        name: 'volwassenleeftijd',
        dataType: { type: 'Numeriek', specification: 'geheel getal' },
        unit: 'jr'
      });
    });
  });

  describe('execution', () => {
    test('should execute parameter definition', () => {
      const source = `Parameter de volwassenleeftijd : Numeriek (geheel getal);`;
      
      const result = engine.run(source);
      
      if (!result.success) {
        console.log('Run error:', result.error);
      }
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'string',
        value: 'Parameter registered'
      });
    });
  });
});