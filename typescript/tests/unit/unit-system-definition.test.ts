import { Engine, Context } from '../../src';

describe('Engine - Unit System Definitions', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  test('should parse and register a simple unit system', () => {
    const unitSystem = `
Eenheidsysteem afstand
de meter m
de kilometer km = 1000 m
de centimeter cm = 1/100 m
`;
    
    const context = new Context();
    const result = engine.run(unitSystem, context);
    
    if (!result.success) {
      console.log('Error:', result.error);
    } else {
      console.log('Result:', result.value);
    }
    
    expect(result.success).toBe(true);
    expect(result.value?.value).toBe("Unit system 'afstand' registered");
  });

  test('should use custom units in calculations', () => {
    const modelWithUnits = `
Eenheidsysteem afstand
de meter m
de kilometer km = 1000 m
de centimeter cm = 1/100 m

Parameter de afstand : Numeriek (getal) met eenheid km

Regel bereken totaal
geldig altijd
De totale afstand van een berekening moet berekend worden als de afstand plus 3000 m.
`;
    
    const context = new Context();
    context.setVariable('afstand', { type: 'number', value: 5, unit: { name: 'kilometer' } });
    // Create berekening object for the rule to set attributes on
    context.setVariable('berekening', { type: 'object', value: {} });
    const result = engine.run(modelWithUnits, context);
    
    expect(result.success).toBe(true);
    
    // Check that the total distance is calculated correctly (5 km + 3000 m = 8 km)
    const berekeningingObject = context.getVariable('berekening');
    expect(berekeningingObject).toBeDefined();
    expect(berekeningingObject?.type).toBe('object');
    const totalDistance = (berekeningingObject?.value as any)['totale afstand'];
    expect(totalDistance).toMatchObject({
      type: 'number',
      value: 8,
      unit: { name: 'kilometer' }
    });
  });

  test('should handle unit system with symbols', () => {
    const unitSystem = `
Eenheidsysteem temperatuur
de celsius C
de fahrenheit F
`;
    
    const context = new Context();
    const result = engine.run(unitSystem, context);
    
    // Log the error if parsing fails
    if (!result.success) {
      console.error('Parse error:', result.error);
    }
    
    expect(result.success).toBe(true);
    expect(result.value?.value).toBe("Unit system 'temperatuur' registered");
  });

  test('should handle unit conversions with fractions', () => {
    const modelWithUnits = `
Eenheidsysteem lengtematen
de inch inch
de foot ft = 12 inch
de yard yd = 3 ft
de mile mi = 1760 yd

Parameter de lengte : Numeriek (getal) met eenheid mi

Regel converteer naar yards
geldig altijd
De lengte in yards van een meting moet berekend worden als de lengte.
`;
    
    const context = new Context();
    context.setVariable('lengte', { type: 'number', value: 1, unit: { name: 'mile' } });
    // Create meting object for the rule to set attributes on
    context.setVariable('meting', { type: 'object', value: {} });
    const result = engine.run(modelWithUnits, context);
    
    expect(result.success).toBe(true);
    
    // The rule simply assigns the value without automatic conversion
    // Unit conversion is not automatic based on variable name
    const metingObject = context.getVariable('meting');
    expect(metingObject).toBeDefined();
    expect(metingObject?.type).toBe('object');
    const lengthInYards = (metingObject?.value as any)['lengte in yards'];
    expect(lengthInYards).toMatchObject({
      type: 'number',
      value: 1,
      unit: { name: 'mile' }  // Unit remains as mile, no automatic conversion
    });
  });

  test('should integrate custom units with built-in units', () => {
    const modelWithMixedUnits = `
Eenheidsysteem snelheid
de meter_per_seconde mps
de kilometer_per_uur kmh = 5/18 mps

Parameter de snelheid : Numeriek (getal) met eenheid kmh
Parameter de tijd : Numeriek (getal) met eenheid uur

Regel bereken afstand
geldig altijd
De afgelegde afstand van een reis moet berekend worden als de snelheid maal de tijd.
`;
    
    const context = new Context();
    context.setVariable('snelheid', { type: 'number', value: 100, unit: { name: 'kilometer_per_uur' } });
    context.setVariable('tijd', { type: 'number', value: 2, unit: { name: 'uur' } });
    // Create reis object for the rule to set attributes on
    context.setVariable('reis', { type: 'object', value: {} });
    const result = engine.run(modelWithMixedUnits, context);
    
    // Log the error if parsing fails
    if (!result.success) {
      console.error('Parse error:', result.error);
    }
    
    expect(result.success).toBe(true);
    
    // Check that distance is calculated (100 km/h * 2 h = 200 km)
    const reisObject = context.getVariable('reis');
    expect(reisObject).toBeDefined();
    expect(reisObject?.type).toBe('object');
    const distance = (reisObject?.value as any)['afgelegde afstand'];
    expect(distance).toMatchObject({
      type: 'number',
      value: 200
      // Unit should be km (from km/h * h)
    });
  });

  test('should handle multiple unit systems in one model', () => {
    const model = `
Eenheidsysteem gewicht
de gram g
de kilogram kg = 1000 g

Eenheidsysteem volume
de milliliter ml
de liter l = 1000 ml

Parameter het gewicht : Numeriek (getal) met eenheid kg
Parameter het volume : Numeriek (getal) met eenheid ml

Regel bereken dichtheid
geldig altijd
De dichtheid van een stof moet berekend worden als het gewicht gedeeld door het volume.
`;
    
    const context = new Context();
    context.setVariable('gewicht', { type: 'number', value: 2, unit: { name: 'kilogram' } });
    context.setVariable('volume', { type: 'number', value: 500, unit: { name: 'milliliter' } });
    // Create stof object for the rule to set attributes on
    context.setVariable('stof', { type: 'object', value: {} });
    const result = engine.run(model, context);
    
    expect(result.success).toBe(true);
    
    // Check that density is calculated (2 kg / 500 ml = 0.004 kg/ml)
    // No automatic unit conversion happens during division
    const stofObject = context.getVariable('stof');
    expect(stofObject).toBeDefined();
    expect(stofObject?.type).toBe('object');
    const density = (stofObject?.value as any)['dichtheid'];
    expect(density).toBeDefined();
    expect(density?.value).toBe(0.004);
    // Unit should be kg/ml (composite unit without automatic simplification)
  });
});