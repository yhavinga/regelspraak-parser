import { Engine, Context } from '../../src';

describe('Debug - Unit System', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  test('should debug unit calculation', () => {
    const modelWithUnits = `
Eenheidsysteem afstand
de meter m
de kilometer km = 1000 m
de centimeter cm = 1/100 m

Parameter de afstand : Numeriek (getal) met eenheid km;
`;
    
    const context = new Context();
    context.setVariable('afstand', { type: 'number', value: 5, unit: { name: 'kilometer' } });
    
    // First, just test if the unit system and parameter parse correctly
    const result = engine.run(modelWithUnits, context);
    
    console.log('Parse result:', result);
    
    expect(result.success).toBe(true);
    
    // Check that the parameter is available
    const afstandValue = context.getVariable('afstand');
    console.log('afstand value:', afstandValue);
    expect(afstandValue).toBeDefined();
  });

  test('should debug simple rule', () => {
    const simpleRule = `
Regel test regel
geldig altijd
De waarde van een berekening moet berekend worden als 42.
`;
    
    const context = new Context();
    // Create a 'berekening' object for the rule to set attributes on
    context.setVariable('berekening', {
      type: 'object',
      value: {}
    });
    
    const result = engine.run(simpleRule, context);
    
    console.log('Simple rule result:', result);
    
    expect(result.success).toBe(true);
    
    const berekeningingObject = context.getVariable('berekening');
    expect(berekeningingObject?.type).toBe('object');
    const waarde = (berekeningingObject?.value as any).waarde;
    console.log('waarde:', waarde);
    expect(waarde?.value).toBe(42);
  });

  test('should debug rule with parameter reference', () => {
    const model = `
Parameter de invoer : Numeriek (getal);

Regel test regel
geldig altijd
De uitvoer van een berekening moet berekend worden als de invoer plus 10.
`;
    
    const context = new Context();
    context.setVariable('invoer', { type: 'number', value: 5 });
    // Create a 'berekening' object for the rule to set attributes on
    context.setVariable('berekening', {
      type: 'object',
      value: {}
    });
    
    const result = engine.run(model, context);
    
    console.log('Parameter rule result:', result);
    
    expect(result.success).toBe(true);
    
    const berekeningingObject = context.getVariable('berekening');
    expect(berekeningingObject?.type).toBe('object');
    const uitvoer = (berekeningingObject?.value as any).uitvoer;
    console.log('uitvoer:', uitvoer);
    expect(uitvoer?.value).toBe(15);
  });
});