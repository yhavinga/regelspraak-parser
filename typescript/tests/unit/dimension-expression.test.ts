import { Engine, Context } from '../../src';

describe('Engine - Dimension Expression Evaluation', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  test('should evaluate dimensional attribute with prepositional dimensions', () => {
    const model = `
Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
  1. vorig jaar
  2. huidig jaar

Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
  1. bruto
  2. netto

Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
  het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie en brutonettodimensie;


Regel bereken belasting huidig jaar
geldig altijd
De belasting van de persoon moet berekend worden als het netto inkomen van huidig jaar van de persoon maal 0,3.
`;
    
    const context = new Context();
    
    // Create a person object with dimensional income values
    const persoon = {
      type: 'object',
      value: {
        'inkomen': {
          'huidig jaar': {
            'bruto': 100000,
            'netto': 70000
          },
          'vorig jaar': {
            'bruto': 90000,
            'netto': 63000
          }
        }
      }
    };
    
    context.setVariable('persoon', persoon);
    
    const result = engine.run(model, context);
    
    if (!result.success) {
      console.error('Parse/execution error:', result.error);
    }
    
    expect(result.success).toBe(true);
    
    // Check that the rule calculated belasting based on netto inkomen van huidig jaar
    const persoonVar = context.getVariable('persoon');
    expect(persoonVar?.type).toBe('object');
    const persoonObj = persoonVar?.value as any;
    expect(persoonObj.belasting).toMatchObject({
      type: 'number',
      value: 21000 // 70000 * 0.3
    });
  });

  test('should evaluate dimensional attribute with adjectival dimensions', () => {
    const model = `
Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
  1. bruto
  2. netto

Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
  het salaris Numeriek (geheel getal) gedimensioneerd met brutonettodimensie;


Regel bereken verschil
geldig altijd
Het verschil van de persoon moet berekend worden als het bruto salaris van de persoon min het netto salaris van de persoon.
`;
    
    const context = new Context();
    
    // Create a person object with dimensional salary values
    const persoon = {
      type: 'object',
      value: {
        'salaris': {
          'bruto': 50000,
          'netto': 35000
        }
      }
    };
    
    context.setVariable('persoon', persoon);
    
    const result = engine.run(model, context);
    
    if (!result.success) {
      console.error('Parse/execution error:', result.error);
    }
    
    expect(result.success).toBe(true);
    
    // Check that the rule calculated verschil
    const persoonVar = context.getVariable('persoon');
    expect(persoonVar?.type).toBe('object');
    const persoonObj = persoonVar?.value as any;
    expect(persoonObj.verschil).toMatchObject({
      type: 'number',
      value: 15000 // 50000 - 35000
    });
  });

  test('should handle missing dimensional values gracefully', () => {
    const model = `
Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
  1. vorig jaar
  2. huidig jaar

Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
  het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie;


Regel bereken inkomen volgend jaar
geldig altijd
Het inkomen volgend jaar van de persoon moet berekend worden als 0.
`;
    
    const context = new Context();
    
    // Create a person object without volgend jaar dimension
    const persoon = {
      type: 'object',
      value: {
        'inkomen': {
          'huidig jaar': 100000,
          'vorig jaar': 90000
        }
      }
    };
    
    context.setVariable('persoon', persoon);
    
    const result = engine.run(model, context);
    
    if (!result.success) {
      console.error('Parse/execution error:', result.error);
    }
    
    // Should not throw error, but the dimension lookup should return null
    expect(result.success).toBe(true);
  });
});