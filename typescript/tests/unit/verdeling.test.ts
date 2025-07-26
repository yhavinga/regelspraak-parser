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

    test.skip('should execute verdeling rule', () => {
      // TODO: Fix "alle personen" parsing to resolve to collection query
      const modelText = `
        Objecttype de Persoon (mv: Personen)
            de ontvangen aantal Numeriek (geheel getal);
        
        Regel simpele verdeling
            geldig altijd
                het totaal aantal wordt verdeeld over
                de ontvangen aantal van alle personen, waarbij wordt verdeeld in gelijke delen.
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

  describe.skip('distribution with ratio', () => {
    test('should distribute based on ratio expression', () => {
      const modelText = `
        Objecttype de Persoon
            de leeftijd Numeriek (geheel getal);
            de ontvangen bedrag Bedrag;
        
        Regel verdeling naar rato van leeftijd
            geldig altijd
                Het totaal bedrag wordt verdeeld over
                de ontvangen bedrag van alle personen,
                waarbij wordt verdeeld naar rato van de leeftijd.
      `;
      
      // TODO: Implement ratio-based distribution
    });
  });

  describe.skip('distribution with maximum', () => {
    test('should respect maximum constraint', () => {
      const modelText = `
        Regel verdeling met maximum
            geldig altijd
                Het totaal wordt verdeeld over
                de ontvangen van alle personen,
                waarbij wordt verdeeld:
                - in gelijke delen,
                - met een maximum van 30.
      `;
      
      // TODO: Implement maximum constraint
    });
  });
});