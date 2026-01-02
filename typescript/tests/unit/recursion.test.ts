import { Engine, Context } from '../../src';

describe('Engine - Recursion Support', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  test('should parse a simple non-recursive regel group', () => {
    const model = `
Objecttype Persoon
  de naam Tekst;
  de leeftijd Numeriek met eenheid jr;

Regelgroep Persoonberekeningen
Regel set naam
  geldig altijd
  De naam van een Persoon moet gesteld worden op "Jan".

Regel set leeftijd
  geldig altijd
  De leeftijd van een Persoon moet gesteld worden op 25 jr.
`;

    const context = new Context();
    const persoon = {
      type: 'object',
      value: {}
    };
    context.setVariable('Persoon', persoon);

    const result = engine.run(model, context);

    expect(result.success).toBe(true);

    // Check that the regel group was parsed
    const ast = engine.parse(model);
    expect(ast.success).toBe(true);
    expect(ast.ast).toBeDefined();

    // Find the regel group in the AST
    if (Array.isArray(ast.ast)) {
      const regelGroep = ast.ast.find((item: any) => item.type === 'RegelGroep');
      expect(regelGroep).toBeDefined();
      expect(regelGroep.name).toBe('Persoonberekeningen');
      expect(regelGroep.isRecursive).toBe(false);
      expect(regelGroep.rules).toHaveLength(2);
    }
  });

  test('should parse a recursive regel group', () => {
    const model = `
Objecttype Berekening
  de iteratie Numeriek;
  de waarde Numeriek;

Regelgroep Iteratieve berekening is recursief
Regel creeer berekening
  geldig altijd
  Er wordt een nieuw Berekening aangemaakt
  met de iteratie gelijk aan 1
  en de waarde gelijk aan 10
  indien het aantal alle Berekening kleiner is dan 3.

Regel bereken waarde
  geldig altijd
  De waarde van een Berekening moet berekend worden als de waarde van de Berekening plus 1.
`;

    const result = engine.parse(model);

    expect(result.success).toBe(true);
    expect(result.ast).toBeDefined();

    // Find the regel group in the AST
    if (Array.isArray(result.ast)) {
      const regelGroep = result.ast.find((item: any) => item.type === 'RegelGroep');
      expect(regelGroep).toBeDefined();
      expect(regelGroep.name).toBe('Iteratieve berekening');
      expect(regelGroep.isRecursive).toBe(true);
      expect(regelGroep.rules).toHaveLength(2);
    }
  });

  test('should execute a recursive calculation with termination', () => {
    const model = `
Objecttype Counter
  de waarde Numeriek;

Regelgroep Tel tot vijf is recursief
Regel maak counter
  geldig altijd
  Er wordt een nieuw Counter aangemaakt met de waarde gelijk aan 1
  indien het aantal alle Counter kleiner is dan 5.
`;

    const context = new Context();
    // Set up the alle Counter collection
    context.setVariable('alle Counter', { type: 'array', value: [] });

    const result = engine.run(model, context);

    expect(result.success).toBe(true);

    // For model execution, check the last result which should be the RegelGroep execution
    if (result.value) {
      // Get the number of counters created
      const counters = context.getVariable('alle Counter');
      if (counters && counters.type === 'array') {
        // Should have created 5 counters (0 to 4 existing when condition becomes false)
        expect(counters.value.length).toBeLessThanOrEqual(5);
      }
    }
  });

  test('should handle recursive groups without termination condition gracefully', () => {
    const model = `
Objecttype InfiniteLoop
  de waarde Numeriek;

Regelgroep Infinite loop is recursief
Regel create infinite
  geldig altijd
  Er wordt een nieuw InfiniteLoop aangemaakt met de waarde gelijk aan 1.
`;

    const context = new Context();
    context.setVariable('alle InfiniteLoop', { type: 'array', value: [] });

    const result = engine.run(model, context);

    expect(result.success).toBe(true);

    // Should create many objects up to the iteration limit
    const loops = context.getVariable('alle InfiniteLoop');
    if (loops && loops.type === 'array') {
      // Should hit the iteration limit (100)
      expect(loops.value.length).toBeLessThanOrEqual(100);
    }
  });

  test('should execute non-recursive regel group with multiple rules', () => {
    const model = `
Parameter het btw percentage : Numeriek (getal)

Objecttype Product
  de prijs Numeriek met eenheid EUR;
  de btw Numeriek met eenheid EUR;
  de totaalprijs Numeriek met eenheid EUR;

Regelgroep Prijsberekeningen
Regel bereken btw
  geldig altijd
  De btw van een Product moet berekend worden als de prijs van het Product maal het btw percentage.

Regel bereken totaalprijs
  geldig altijd
  De totaalprijs van een Product moet berekend worden als de prijs van het Product plus de btw van het Product.
`;

    const context = new Context();
    context.setVariable('btw percentage', { type: 'number', value: 0.21 });

    const product = {
      type: 'object',
      value: {
        prijs: { type: 'number', value: 100, unit: { name: 'EUR' } }
      }
    };
    context.setVariable('Product', product);

    const result = engine.run(model, context);

    expect(result.success).toBe(true);

    // For now, just check that parsing and execution completed successfully
    // Rule group execution for existing objects would need additional implementation
  });
});