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

Parameter de afstand : Numeriek (getal) met eenheid km;

Regel bereken totaal
geldig altijd
De totale afstand van een berekening moet berekend worden als de afstand plus 3000 m.
`;
    
    const context = new Context();
    context.setVariable('afstand', { type: 'number', value: 5, unit: { name: 'kilometer' } });
    const result = engine.run(modelWithUnits, context);
    
    expect(result.success).toBe(true);
    
    // Check that the total distance is calculated correctly (5 km + 3000 m = 8 km)
    const totalDistance = context.getVariable('totale afstand');
    expect(totalDistance).toMatchObject({
      type: 'number',
      value: 8,
      unit: { name: 'kilometer' }
    });
  });

  test('should handle unit system with symbols', () => {
    const unitSystem = `
Eenheidsysteem temperatuur
de celsius C °C
de fahrenheit F °F
`;
    
    const context = new Context();
    const result = engine.run(unitSystem, context);
    
    expect(result.success).toBe(true);
    expect(result.value?.value).toBe("Unit system 'temperatuur' registered");
  });

  test('should handle unit conversions with fractions', () => {
    const modelWithUnits = `
Eenheidsysteem lengtematen
de inch in
de foot ft = 12 in
de yard yd = 3 ft
de mile mi = 1760 yd

Parameter de lengte : Numeriek (getal) met eenheid mi;

Regel converteer naar yards
geldig altijd
De lengte in yards van een meting moet berekend worden als de lengte.
`;
    
    const context = new Context();
    context.setVariable('lengte', { type: 'number', value: 1, unit: { name: 'mile' } });
    const result = engine.run(modelWithUnits, context);
    
    expect(result.success).toBe(true);
    
    // Check conversion (1 mile = 1760 yards)
    const lengthInYards = context.getVariable('lengte in yards');
    expect(lengthInYards).toMatchObject({
      type: 'number',
      value: 1760,
      unit: { name: 'yard' }
    });
  });

  test('should integrate custom units with built-in units', () => {
    const modelWithMixedUnits = `
Eenheidsysteem snelheid
de meter per seconde m/s
de kilometer per uur km/h = 1/3.6 m/s

Parameter de snelheid : Numeriek (getal) met eenheid km/h;
Parameter de tijd : Numeriek (getal) met eenheid uur;

Regel bereken afstand
geldig altijd
De afgelegde afstand van een reis moet berekend worden als de snelheid maal de tijd.
`;
    
    const context = new Context();
    context.setVariable('snelheid', { type: 'number', value: 100, unit: { name: 'kilometer per uur' } });
    context.setVariable('tijd', { type: 'number', value: 2, unit: { name: 'uur' } });
    const result = engine.run(modelWithMixedUnits, context);
    
    expect(result.success).toBe(true);
    
    // Check that distance is calculated (100 km/h * 2 h = 200 km)
    const distance = context.getVariable('afgelegde afstand');
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

Parameter het gewicht : Numeriek (getal) met eenheid kg;
Parameter het volume : Numeriek (getal) met eenheid ml;

Regel bereken dichtheid
geldig altijd
De dichtheid van een stof moet berekend worden als het gewicht gedeeld door het volume.
`;
    
    const context = new Context();
    context.setVariable('gewicht', { type: 'number', value: 2, unit: { name: 'kilogram' } });
    context.setVariable('volume', { type: 'number', value: 500, unit: { name: 'milliliter' } });
    const result = engine.run(model, context);
    
    expect(result.success).toBe(true);
    
    // Check that density is calculated (2 kg / 0.5 l = 4 kg/l)
    const density = context.getVariable('dichtheid');
    expect(density).toBeDefined();
    expect(density?.value).toBe(4);
    // Unit should be kg/l (composite unit)
  });
});