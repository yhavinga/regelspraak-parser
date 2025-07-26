import { Engine } from '../../src/engine/engine';
import { Context } from '../../src/runtime/context';

describe('Verdeling (Distribution)', () => {
  let engine: Engine;
  
  beforeEach(() => {
    engine = new Engine();
  });

  describe('simple equal distribution', () => {
    test('should distribute amount equally over collection', () => {
      const modelText = `
        Objecttype het Contingent
            het totaal aantal Numeriek (positief geheel getal);
        
        Objecttype de Persoon (mv: Personen)
            de ontvangen aantal Numeriek (geheel getal);
        
        Parameter het te verdelen totaal : Numeriek;
        
        Regel initialiseer totaal
            geldig altijd
                Het te verdelen totaal wordt berekend als 100.
        
        Regel simpele verdeling
            geldig altijd
                Het te verdelen totaal wordt verdeeld over
                de ontvangen aantal van alle personen, waarbij wordt verdeeld in gelijke delen.
      `;
      
      const context = new Context();
      
      // Create a contingent with total amount
      const contingentId = context.generateObjectId('Contingent');
      context.createObject('Contingent', contingentId, {
        'totaal aantal': { type: 'number', value: 100 }
      });
      
      // Create 4 persons linked to the contingent
      const person1Id = context.generateObjectId('Persoon');
      const person2Id = context.generateObjectId('Persoon');
      const person3Id = context.generateObjectId('Persoon');
      const person4Id = context.generateObjectId('Persoon');
      
      context.createObject('Persoon', person1Id, {
        'ontvangen aantal': { type: 'number', value: 0 }
      });
      context.createObject('Persoon', person2Id, {
        'ontvangen aantal': { type: 'number', value: 0 }
      });
      context.createObject('Persoon', person3Id, {
        'ontvangen aantal': { type: 'number', value: 0 }
      });
      context.createObject('Persoon', person4Id, {
        'ontvangen aantal': { type: 'number', value: 0 }
      });
      
      // Create relationships (simplified - normally would use Feittype)
      // For now, we'll assume the engine can find "personen van het contingent"
      
      const parseResult = engine.parse(modelText);
      if (!parseResult.success) {
        console.error('Parse failed:', parseResult.errors);
        throw new Error('Parse failed');
      }
      
      console.log('Parsed AST:', JSON.stringify(parseResult.ast, null, 2));
      
      const result = engine.execute(parseResult.ast!, context);
      
      if (!result.success) {
        console.error('Engine run failed:', result.error);
      }
      
      // Debug: check context state
      console.log('Parameter value:', context.getVariable('te verdelen totaal'));
      console.log('Persons:', context.getObjectsByType('Persoon').length);
      
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