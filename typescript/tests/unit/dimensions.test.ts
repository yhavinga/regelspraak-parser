import { Engine, Context } from '../../src';

describe('Engine - Dimensions', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  test('should parse a simple dimension definition', () => {
    const dimensionDef = `
Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
  1. vorig jaar
  2. huidig jaar
`;
    
    const result = engine.parse(dimensionDef);
    
    expect(result.success).toBe(true);
    expect(result.ast).toMatchObject({
      type: 'Dimension',
      name: 'jaardimensie',
      plural: 'jaardimensies',
      usageStyle: 'prepositional',
      preposition: 'van',
      labels: [
        { position: 1, label: 'vorig jaar' },
        { position: 2, label: 'huidig jaar' }
      ]
    });
  });

  test('should parse an adjectival dimension', () => {
    const dimensionDef = `
Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
  1. bruto
  2. netto
`;
    
    const result = engine.parse(dimensionDef);
    
    expect(result.success).toBe(true);
    expect(result.ast).toMatchObject({
      type: 'Dimension',
      name: 'brutonettodimensie',
      plural: 'brutonettodimensies',
      usageStyle: 'adjectival',
      labels: [
        { position: 1, label: 'bruto' },
        { position: 2, label: 'netto' }
      ]
    });
    expect(result.ast?.preposition).toBeUndefined();
  });

  test('should parse dimension with alternative preposition', () => {
    const dimensionDef = `
Dimensie de periodetypedimensie, bestaande uit de periodetypedimensies (na het attribuut met voorzetsel in):
  1. maandelijks
  2. jaarlijks
`;
    
    const result = engine.parse(dimensionDef);
    
    expect(result.success).toBe(true);
    expect(result.ast).toMatchObject({
      type: 'Dimension',
      name: 'periodetypedimensie',
      plural: 'periodetypedimensies',
      usageStyle: 'prepositional',
      preposition: 'in',
      labels: [
        { position: 1, label: 'maandelijks' },
        { position: 2, label: 'jaarlijks' }
      ]
    });
  });

  test('should parse attribute with dimensions', () => {
    const model = `
Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
  1. vorig jaar
  2. huidig jaar

Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
  1. bruto
  2. netto

Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
  het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie en brutonettodimensie;
`;
    
    const result = engine.parse(model);
    
    expect(result.success).toBe(true);
    expect(result.ast?.type).toBe('Model');
    
    // Check dimensions are parsed
    expect(result.ast?.dimensions).toHaveLength(2);
    
    // Check object type with dimensioned attribute
    expect(result.ast?.objectTypes).toHaveLength(1);
    const objectType = result.ast?.objectTypes[0];
    const inkomenAttr = objectType.members.find((m: any) => m.name === 'inkomen');
    
    expect(inkomenAttr).toMatchObject({
      type: 'AttributeSpecification',
      name: 'inkomen',
      dataType: { type: 'Numeriek', specification: 'geheel getal' },
      dimensions: ['jaardimensie', 'brutonettodimensie']
    });
  });

  test('should parse dimension reference in expression', () => {
    const model = `
Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
  1. vorig jaar
  2. huidig jaar

Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
  1. bruto
  2. netto

Objecttype de Persoon (mv: Personen) (bezield)
  het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie en brutonettodimensie;

Parameter de persoon : Persoon

Regel bereken netto inkomen huidig jaar
geldig altijd
Het netto inkomen van huidig jaar van de persoon moet berekend worden als het bruto inkomen van huidig jaar van de persoon maal 0,7.
`;
    
    // For now, just test that the model parses successfully
    // Full dimension reference evaluation would require expression evaluator updates
    const result = engine.parse(model);
    
    // Log the error if parsing fails
    if (!result.success) {
      console.error('Parse error:', result.errors);
    }
    
    expect(result.success).toBe(true);
    expect(result.ast?.type).toBe('Model');
    expect(result.ast?.dimensions).toHaveLength(2);
    expect(result.ast?.rules).toHaveLength(1);
  });
});