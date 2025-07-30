import { Engine, Context } from '../../src';
import { ExpressionEvaluator } from '../../src/evaluators/expression-evaluator';

describe('Tijdsduur', () => {
  let engine: Engine;
  let context: Context;

  beforeEach(() => {
    engine = new Engine();
    context = new Context();
  });

  test('should calculate tijdsduur in days', () => {
    // Test just the expression directly
    const expr = 'de tijdsduur van startdatum tot einddatum';
    
    // Set variables
    context.setVariable('startdatum', {
      type: 'date',
      value: new Date('2024-01-01')
    });
    context.setVariable('einddatum', {
      type: 'date',
      value: new Date('2024-01-10')
    });

    // Parse and evaluate the expression directly
    const parseResult = engine.parse(expr);
    if (!parseResult.success) {
      console.error('Parse errors:', parseResult.errors);
    }
    expect(parseResult.success).toBe(true);
    
    // The parsed AST should be a function call
    const ast = parseResult.ast;
    expect(ast.type).toBe('FunctionCall');
    expect((ast as any).functionName).toBe('tijdsduur_van');
    
    // Evaluate the expression
    const evaluator = new ExpressionEvaluator();
    const result = evaluator.evaluate(ast as any, context);
    
    // By default tijdsduur returns dagen as a unit
    expect(result.type).toBe('number');
    expect(result.value).toBe(9);
    expect((result as any).unit).toEqual({ name: 'dagen' });
  });

  test('should calculate tijdsduur in years', () => {
    const code = `
      Regel test tijdsduur jaren
        geldig altijd
            Het resultaat moet berekend worden als de tijdsduur van geboortedatum tot peildatum in hele jaren.
    `;
    
    // Set variables
    context.setVariable('geboortedatum', {
      type: 'date',
      value: new Date('1990-03-15')
    });
    context.setVariable('peildatum', {
      type: 'date',
      value: new Date('2024-06-20')
    });

    const parseResult = engine.parse(code);
    if (!parseResult.success) {
      console.error('Parse error:', parseResult.errors);
    }
    expect(parseResult.success).toBe(true);
    
    const runResult = engine.run(code, context);
    expect(runResult.success).toBe(true);
    
    const result = context.getVariable('resultaat');
    expect(result).toBeDefined();
    expect(result!.type).toBe('unit');
    expect(result!.value).toEqual({ value: 34, unit: 'jaren' });
  });

  test('should calculate tijdsduur in months', () => {
    const code = `
      Regel test tijdsduur maanden
        geldig altijd
            Het resultaat moet berekend worden als de tijdsduur van start tot eind in hele maanden.
    `;
    
    // Set variables
    context.setVariable('start', {
      type: 'date',
      value: new Date('2024-01-15')
    });
    context.setVariable('eind', {
      type: 'date',
      value: new Date('2024-04-10')
    });

    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);
    
    const runResult = engine.run(code, context);
    expect(runResult.success).toBe(true);
    
    const result = context.getVariable('resultaat');
    expect(result).toBeDefined();
    expect(result!.type).toBe('unit');
    expect(result!.value).toEqual({ value: 2, unit: 'maanden' });
  });

  test('should calculate negative tijdsduur', () => {
    const code = `
      Regel test negatieve tijdsduur
        geldig altijd
            Het resultaat moet berekend worden als de tijdsduur van start tot eind.
    `;
    
    // Set variables (end before start)
    context.setVariable('start', {
      type: 'date',
      value: new Date('2024-01-10')
    });
    context.setVariable('eind', {
      type: 'date',
      value: new Date('2024-01-01')
    });

    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);
    
    const runResult = engine.run(code, context);
    expect(runResult.success).toBe(true);
    
    const result = context.getVariable('resultaat');
    expect(result).toBeDefined();
    expect(result!.type).toBe('unit');
    expect(result!.value).toEqual({ value: -9, unit: 'dagen' });
  });

  test('should calculate absolute tijdsduur', () => {
    const code = `
      Regel test absolute tijdsduur
        geldig altijd
            Het resultaat moet berekend worden als de absolute tijdsduur van datum1 tot datum2.
    `;
    
    // Set variables (end before start)
    context.setVariable('datum1', {
      type: 'date',
      value: new Date('2024-01-10')
    });
    context.setVariable('datum2', {
      type: 'date',
      value: new Date('2024-01-01')
    });

    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);
    
    const runResult = engine.run(code, context);
    expect(runResult.success).toBe(true);
    
    const result = context.getVariable('resultaat');
    expect(result).toBeDefined();
    expect(result!.type).toBe('unit');
    expect(result!.value).toEqual({ value: 9, unit: 'dagen' });
  });

  test('should handle leap years correctly', () => {
    const code = `
      Regel test leeftijd berekening
        geldig altijd
            Het resultaat moet berekend worden als de tijdsduur van geboorte tot peil in hele jaren.
    `;
    
    // Test case: birthday not yet reached
    context.setVariable('geboorte', {
      type: 'date',
      value: new Date('2000-06-15')
    });
    context.setVariable('peil', {
      type: 'date',
      value: new Date('2024-06-14')
    });

    let parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);
    
    let runResult = engine.run(code, context);
    expect(runResult.success).toBe(true);
    
    let result = context.getVariable('resultaat');
    expect(result).toBeDefined();
    expect(result!.type).toBe('unit');
    expect(result!.value).toEqual({ value: 23, unit: 'jaren' });

    // Test case: birthday just passed
    context.setVariable('peil', {
      type: 'date',
      value: new Date('2024-06-16')
    });

    runResult = engine.run(code, context);
    expect(runResult.success).toBe(true);
    
    result = context.getVariable('resultaat');
    expect(result).toBeDefined();
    expect(result!.type).toBe('unit');
    expect(result!.value).toEqual({ value: 24, unit: 'jaren' });
  });

  test('should calculate tijdsduur with weeks', () => {
    const code = `
      Regel test tijdsduur weken
        geldig altijd
            Het resultaat moet berekend worden als de tijdsduur van start tot eind in hele weken.
    `;
    
    context.setVariable('start', {
      type: 'date',
      value: new Date('2024-01-01')
    });
    context.setVariable('eind', {
      type: 'date',
      value: new Date('2024-01-29')
    });

    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);
    
    const runResult = engine.run(code, context);
    expect(runResult.success).toBe(true);
    
    const result = context.getVariable('resultaat');
    expect(result).toBeDefined();
    expect(result!.type).toBe('unit');
    expect(result!.value).toEqual({ value: 4, unit: 'weken' });
  });

  test('should calculate tijdsduur with hours', () => {
    const code = `
      Regel test tijdsduur uren
        geldig altijd
            Het resultaat moet berekend worden als de tijdsduur van start tot eind in hele uren.
    `;
    
    context.setVariable('start', {
      type: 'date',
      value: new Date('2024-01-01T10:00:00')
    });
    context.setVariable('eind', {
      type: 'date',
      value: new Date('2024-01-01T15:30:00')
    });

    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);
    
    const runResult = engine.run(code, context);
    expect(runResult.success).toBe(true);
    
    const result = context.getVariable('resultaat');
    expect(result).toBeDefined();
    expect(result!.type).toBe('unit');
    expect(result!.value).toEqual({ value: 5, unit: 'uren' });
  });

  test('should work with navigation expression', () => {
    const code = `
      Objecttype de Persoon
        de geboortedatum Datum;
        de leeftijd Numeriek (geheel getal) met eenheid jr;
        
      Objecttype de Vlucht
        de vluchtdatum Datum;
        de passagier Persoon;
      
      Regel bereken leeftijd voor vlucht
        geldig altijd
            De leeftijd van de passagier van een Vlucht moet berekend worden als 
            de tijdsduur van de geboortedatum van zijn passagier tot zijn vluchtdatum in hele jaren.
    `;

    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);

    // Create person object with id and attributes
    const person = {
      geboortedatum: {
        type: 'date' as const,
        value: new Date('1990-03-15')
      }
    };
    context.createObject('Persoon', 'person1', person);
    
    // Create vlucht object
    const vlucht = {
      vluchtdatum: {
        type: 'date' as const,
        value: new Date('2024-06-20')
      },
      passagier: {
        type: 'object' as const,
        objectType: 'Persoon',
        objectId: 'person1',
        value: person
      }
    };
    context.createObject('Vlucht', 'vlucht1', vlucht);

    const runResult = engine.run(code, context);
    expect(runResult.success).toBe(true);
    
    // Check if person's age was calculated
    const personObj = context.getObject('Persoon', 'person1');
    expect(personObj).toBeDefined();
    expect(personObj.leeftijd).toBeDefined();
    expect(personObj.leeftijd.type).toBe('unit');
    expect(personObj.leeftijd.value).toEqual({ value: 34, unit: 'jaren' });
  });
});