import { Engine } from '../../src/engine/engine';
import { Context } from '../../src/runtime/context';

describe('Verdeling (Distribution)', () => {
  let engine: Engine;
  
  beforeEach(() => {
    engine = new Engine();
  });

  describe('simple equal distribution', () => {
    test('should parse verdeling rule', () => {
      const modelText = `
        Regel simpele verdeling
            geldig altijd
                het totaal aantal wordt verdeeld over
                de ontvangen aantal van alle personen, waarbij wordt verdeeld in gelijke delen.
      `;
      
      const parseResult = engine.parse(modelText);
      if (!parseResult.success) {
        console.error('Parse failed:', parseResult.errors);
        throw new Error('Parse failed');
      }
      
      console.log('Parsed AST:', JSON.stringify(parseResult.ast, null, 2));
      
      // Check that we parsed a verdeling rule
      expect(parseResult.ast).toBeDefined();
      expect(parseResult.ast.type).toBe('Rule');
      expect(parseResult.ast.result.type).toBe('Verdeling');
    });

    test('should execute verdeling rule with workaround', () => {
      // Workaround: Use a different pattern that works with current implementation
      const modelText = `
        Objecttype de Persoon (mv: Personen)
            de ontvangen aantal Numeriek (geheel getal);
        
        Regel simpele verdeling
            geldig altijd
                het totaal aantal wordt verdeeld over
                de ontvangen aantal van de personen, waarbij wordt verdeeld in gelijke delen.
      `;
      
      const context = new Context();
      
      // Set up the total amount as a variable
      context.setVariable('totaalaantal', { type: 'number', value: 100 });
      
      // Create 4 persons
      for (let i = 0; i < 4; i++) {
        const personId = context.generateObjectId('Persoon');
        context.createObject('Persoon', personId, {
          'ontvangen aantal': { type: 'number', value: 0 }
        });
      }
      
      // Get all persons as a collection and set as variable
      const personObjects = context.getObjectsByType('Persoon');
      context.setVariable('personen', { type: 'array', value: personObjects });
      
      const parseResult = engine.parse(modelText);
      expect(parseResult.success).toBe(true);
      
      const result = engine.execute(parseResult.ast!, context);
      
      if (!result.success) {
        console.error('Engine run failed:', result.error);
      }
      
      expect(result.success).toBe(true);
      
      // Each person should receive 25 (100/4)
      const persons = context.getObjectsByType('Persoon');
      expect(persons.length).toBe(4);
      for (const person of persons) {
        expect(person.value['ontvangen aantal']).toEqual({ type: 'number', value: 25 });
      }
    });
  });

  describe('distribution with ratio', () => {
    test('should distribute based on ratio expression', () => {
      const modelText = `
        Objecttype de Persoon (mv: Personen)
            de leeftijd Numeriek (geheel getal);
            de ontvangen bedrag Numeriek (geheel getal);
        
        Regel verdeling rato
            geldig altijd
                het totaal bedrag wordt verdeeld over
                de ontvangen bedrag van de personen,
                waarbij wordt verdeeld naar rato van de leeftijd.
      `;
      
      const context = new Context();
      
      // Set up the total amount as a variable
      context.setVariable('totaalbedrag', { type: 'number', value: 1000 });
      
      // Create 3 persons with different ages
      const person1Id = context.generateObjectId('Persoon');
      context.createObject('Persoon', person1Id, {
        'leeftijd': { type: 'number', value: 20 },
        'ontvangen bedrag': { type: 'number', value: 0 }
      });
      
      const person2Id = context.generateObjectId('Persoon');
      context.createObject('Persoon', person2Id, {
        'leeftijd': { type: 'number', value: 30 },
        'ontvangen bedrag': { type: 'number', value: 0 }
      });
      
      const person3Id = context.generateObjectId('Persoon');
      context.createObject('Persoon', person3Id, {
        'leeftijd': { type: 'number', value: 50 },
        'ontvangen bedrag': { type: 'number', value: 0 }
      });
      
      // Get all persons as a collection and set as variable
      const personObjects = context.getObjectsByType('Persoon');
      context.setVariable('personen', { type: 'array', value: personObjects });
      
      const parseResult = engine.parse(modelText);
      expect(parseResult.success).toBe(true);
      
      const result = engine.execute(parseResult.ast!, context);
      
      if (!result.success) {
        console.error('Engine run failed:', result.error);
      }
      
      expect(result.success).toBe(true);
      
      // Verify ratio-based distribution
      // Total ratio: 20 + 30 + 50 = 100
      // Person 1: 20/100 * 1000 = 200
      // Person 2: 30/100 * 1000 = 300
      // Person 3: 50/100 * 1000 = 500
      const persons = context.getObjectsByType('Persoon');
      expect(persons.length).toBe(3);
      
      const p1 = persons.find(p => p.value['leeftijd'].value === 20);
      const p2 = persons.find(p => p.value['leeftijd'].value === 30);
      const p3 = persons.find(p => p.value['leeftijd'].value === 50);
      
      expect(p1!.value['ontvangen bedrag']).toEqual({ type: 'number', value: 200 });
      expect(p2!.value['ontvangen bedrag']).toEqual({ type: 'number', value: 300 });
      expect(p3!.value['ontvangen bedrag']).toEqual({ type: 'number', value: 500 });
    });
  });

  describe('distribution with maximum', () => {
    test('should respect maximum constraint', () => {
      const modelText = `
        Objecttype de Persoon (mv: Personen)
            de ontvangen Numeriek (geheel getal);
        
        Regel verdeling met maximum
            geldig altijd
                het totaal wordt verdeeld over
                de ontvangen van de personen,
                waarbij wordt verdeeld:
                - in gelijke delen,
                - met een maximum van 30.
      `;
      
      const context = new Context();
      
      // Set up the total amount as a variable
      context.setVariable('totaal', { type: 'number', value: 150 });
      
      // Create 4 persons
      for (let i = 0; i < 4; i++) {
        const personId = context.generateObjectId('Persoon');
        context.createObject('Persoon', personId, {
          'ontvangen': { type: 'number', value: 0 }
        });
      }
      
      // Get all persons as a collection and set as variable
      const personObjects = context.getObjectsByType('Persoon');
      context.setVariable('personen', { type: 'array', value: personObjects });
      
      const parseResult = engine.parse(modelText);
      expect(parseResult.success).toBe(true);
      
      const result = engine.execute(parseResult.ast!, context);
      
      if (!result.success) {
        console.error('Engine run failed:', result.error);
      }
      
      expect(result.success).toBe(true);
      
      // Without maximum: 150/4 = 37.5 each
      // With maximum of 30: each gets 30
      const persons = context.getObjectsByType('Persoon');
      expect(persons.length).toBe(4);
      for (const person of persons) {
        expect(person.value['ontvangen']).toEqual({ type: 'number', value: 30 });
      }
    });
    
    test('should handle remainder with maximum constraint', () => {
      const modelText = `
        Objecttype de Persoon (mv: Personen)
            de ontvangen Numeriek (geheel getal);
        
        Objecttype het Verdeling resultaat
            de rest Numeriek (geheel getal);
        
        Regel verdeling met maximum en rest
            geldig altijd
                het totaal wordt verdeeld over
                de ontvangen van de personen,
                waarbij wordt verdeeld:
                - in gelijke delen,
                - met een maximum van 50.
                Als onverdeelde rest blijft de rest van het verdeling resultaat over.
      `;
      
      const context = new Context();
      
      // Set up the total amount
      context.setVariable('totaal', { type: 'number', value: 200 });
      
      // Create verdeling resultaat object
      const verdelingId = context.generateObjectId('Verdeling resultaat');
      context.createObject('Verdeling resultaat', verdelingId, {
        'rest': { type: 'number', value: 0 }
      });
      const verdelingResultaat = context.getObjectsByType('Verdeling resultaat')[0];
      context.setCurrentInstance(verdelingResultaat);
      // Also set as variable since the parser converts "het verdeling resultaat" to "verdelingresultaat"
      context.setVariable('verdelingresultaat', verdelingResultaat);
      
      // Create 3 persons
      for (let i = 0; i < 3; i++) {
        const personId = context.generateObjectId('Persoon');
        context.createObject('Persoon', personId, {
          'ontvangen': { type: 'number', value: 0 }
        });
      }
      
      // Get all persons as a collection and set as variable
      const personObjects = context.getObjectsByType('Persoon');
      context.setVariable('personen', { type: 'array', value: personObjects });
      
      const parseResult = engine.parse(modelText);
      expect(parseResult.success).toBe(true);
      
      const result = engine.execute(parseResult.ast!, context);
      
      if (!result.success) {
        console.error('Engine run failed:', result.error);
      }
      
      expect(result.success).toBe(true);
      
      // Without maximum: 200/3 = 66.67 each
      // With maximum of 50: each gets 50
      // Remainder: 200 - (3 * 50) = 50
      const persons = context.getObjectsByType('Persoon');
      expect(persons.length).toBe(3);
      for (const person of persons) {
        expect(person.value['ontvangen']).toEqual({ type: 'number', value: 50 });
      }
      
      // Check remainder
      const resultObj = context.getObjectsByType('Verdeling resultaat')[0];
      expect(resultObj.value['rest']).toEqual({ type: 'number', value: 50 });
    });
  });
});