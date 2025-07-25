import { Engine } from '../../src';

describe('Engine - Object Type Definitions', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  describe('basic object type parsing', () => {
    test('should parse simple object type', () => {
      const source = `Objecttype persoon`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast).toEqual({
        type: 'ObjectTypeDefinition',
        name: 'persoon',
        animated: false,
        members: []
      });
    });

    test('should parse object type with plural', () => {
      const source = `Objecttype persoon (mv:personen)`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast).toEqual({
        type: 'ObjectTypeDefinition',
        name: 'persoon',
        plural: ['personen'],
        animated: false,
        members: []
      });
    });

    test('should parse animated object type', () => {
      const source = `Objecttype persoon bezield`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast).toEqual({
        type: 'ObjectTypeDefinition',
        name: 'persoon',
        animated: true,
        members: []
      });
    });
  });

  describe('kenmerk specifications', () => {
    test('should parse simple kenmerk', () => {
      const source = `Objecttype persoon
  aanwezig kenmerk;`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast).toEqual({
        type: 'ObjectTypeDefinition',
        name: 'persoon',
        animated: false,
        members: [{
          type: 'KenmerkSpecification',
          name: 'aanwezig'
        }]
      });
    });

    test('should parse bijvoeglijk kenmerk', () => {
      const source = `Objecttype persoon
  gelukkig kenmerk (bijvoeglijk);`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.members[0]).toEqual({
        type: 'KenmerkSpecification',
        name: 'gelukkig',
        kenmerkType: 'bijvoeglijk'
      });
    });

    test('should parse bezittelijk kenmerk', () => {
      const source = `Objecttype persoon
  gehuwd kenmerk (bezittelijk);`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.members[0]).toEqual({
        type: 'KenmerkSpecification',
        name: 'gehuwd',
        kenmerkType: 'bezittelijk'
      });
    });
  });

  describe('attribute specifications', () => {
    test('should parse simple text attribute', () => {
      const source = `Objecttype persoon
  naam Tekst;`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.members[0]).toEqual({
        type: 'AttributeSpecification',
        name: 'naam',
        dataType: { type: 'Tekst' }
      });
    });

    test('should parse number attribute', () => {
      const source = `Objecttype persoon
  leeftijd Numeriek (geheel getal);`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.members[0]).toEqual({
        type: 'AttributeSpecification',
        name: 'leeftijd',
        dataType: { type: 'Numeriek', specification: 'geheel getal' }
      });
    });

    test('should parse attribute with unit', () => {
      // The grammar actually DOES support complex units like km/h through eenheidExpressie
      // However, attribuutSpecificatie uses a simplified unit form (single IDENTIFIER)
      // For now, test with simple unit until we update the grammar
      const source = `Objecttype auto
  snelheid Numeriek (getal) met eenheid meter;`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.members[0]).toEqual({
        type: 'AttributeSpecification',
        name: 'snelheid',
        dataType: { type: 'Numeriek', specification: 'getal' },
        unit: 'meter'
      });
    });

    test('should parse attribute with Euro symbol', () => {
      const source = `Objecttype product
  prijs Bedrag met eenheid €;`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.members[0]).toEqual({
        type: 'AttributeSpecification',
        name: 'prijs',
        dataType: { type: 'DomainReference', domain: 'Bedrag' },
        unit: '€'
      });
    });

    test('should parse attribute with dimensions', () => {
      // Note: dimensieRef expects IDENTIFIER tokens, not keywords like 'jaar'
      // This is a limitation in the grammar
      const source = `Objecttype verkoop
  omzet Bedrag gedimensioneerd met dimension1 en dimension2;`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.members[0]).toEqual({
        type: 'AttributeSpecification',
        name: 'omzet',
        dataType: { type: 'DomainReference', domain: 'Bedrag' },
        dimensions: ['dimension1', 'dimension2']
      });
    });

    test('should parse attribute with timeline', () => {
      const source = `Objecttype persoon
  inkomen Bedrag voor elk jaar;`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast?.members[0]).toEqual({
        type: 'AttributeSpecification',
        name: 'inkomen',
        dataType: { type: 'DomainReference', domain: 'Bedrag' },
        timeline: true
      });
    });
  });

  describe('complex object types', () => {
    test('should parse object type with multiple members', () => {
      const source = `Objecttype persoon (mv:personen) bezield
  aanwezig kenmerk;
  naam Tekst;
  leeftijd Numeriek (geheel getal);
  inkomen Bedrag met eenheid € voor elk jaar;`;
      
      const result = engine.parse(source);
      
      expect(result.success).toBe(true);
      expect(result.ast).toEqual({
        type: 'ObjectTypeDefinition',
        name: 'persoon',
        plural: ['personen'],
        animated: true,
        members: [
          {
            type: 'KenmerkSpecification',
            name: 'aanwezig'
          },
          {
            type: 'AttributeSpecification',
            name: 'naam',
            dataType: { type: 'Tekst' }
          },
          {
            type: 'AttributeSpecification',
            name: 'leeftijd',
            dataType: { type: 'Numeriek', specification: 'geheel getal' }
          },
          {
            type: 'AttributeSpecification',
            name: 'inkomen',
            dataType: { type: 'DomainReference', domain: 'Bedrag' },
            unit: '€',
            timeline: true
          }
        ]
      });
    });
  });

  describe('execution', () => {
    test('should execute object type definition', () => {
      const source = `Objecttype persoon
  naam tekst;`;
      
      const result = engine.run(source);
      
      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        type: 'string',
        value: 'Object type registered'
      });
    });
  });
});