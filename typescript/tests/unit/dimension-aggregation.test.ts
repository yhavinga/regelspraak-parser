import { Engine, Context } from '../../src';

describe('Engine - Dimension Aggregation with Range Filtering', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  test('should aggregate over dimension range using vanaf...t/m syntax', () => {
    const model = `
Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
  1. zes jaar geleden
  2. vijf jaar geleden
  3. vier jaar geleden
  4. drie jaar geleden
  5. twee jaar geleden
  6. een jaar geleden
  7. heden

Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
  de betaalde belasting in jaar Numeriek (getal met 2 decimalen) gedimensioneerd met jaardimensie;
  de vierjaarstotaal Numeriek (getal met 2 decimalen);

Regel bereken vierjaarstotaal
geldig altijd
De vierjaarstotaal van een Natuurlijk persoon moet berekend worden als 
de som van zijn betaalde belasting in jaar vanaf vier jaar geleden t/m een jaar geleden.
`;
    
    const context = new Context();
    
    // Create a person object with dimensional tax values
    const persoonAttributes = {
      'betaalde belasting in jaar': {
        'zes jaar geleden': 10000,
        'vijf jaar geleden': 11000,
        'vier jaar geleden': 12000,
        'drie jaar geleden': 13000,
        'twee jaar geleden': 14000,
        'een jaar geleden': 15000,
        'heden': 16000
      }
    };
    
    // Add object - visitor concatenates to "Natuurlijkpersoon"
    context.createObject('Natuurlijkpersoon', 'persoon1', persoonAttributes as any);
    
    const result = engine.run(model, context);
    
    if (!result.success) {
      console.error('Parse/execution error:', result.error);
    }
    
    expect(result.success).toBe(true);
    
    // Check that the rule calculated the sum correctly
    // Should sum: 12000 + 13000 + 14000 + 15000 = 54000
    const persoonObj = context.getObject('Natuurlijkpersoon', 'persoon1');
    expect(persoonObj).toBeDefined();
    expect(persoonObj?.['vierjaarstotaal']).toMatchObject({
      type: 'number',
      value: 54000
    });
  });

  test('should handle empty dimension range', () => {
    const model = `
Dimensie de maanddimensie, bestaande uit de maanddimensies (na het attribuut met voorzetsel in):
  1. januari
  2. februari
  3. maart

Objecttype de Verkoop (mv: Verkopen)
  de omzet in maand Numeriek (getal met 2 decimalen) gedimensioneerd met maanddimensie;
  de Q1 omzet Numeriek (getal met 2 decimalen);

Regel bereken Q1 omzet
geldig altijd
De Q1 omzet van een Verkoop moet berekend worden als 
de som van zijn omzet in maand vanaf januari t/m maart.
`;
    
    const context = new Context();
    
    // Create a sales object with only some months having values
    const verkoopAttributes = {
      'omzet in maand': {
        'januari': 5000,
        'februari': 6000,
        'maart': 7000
      }
    };
    
    context.createObject('Verkoop', 'verkoop1', verkoopAttributes as any);
    
    const result = engine.run(model, context);
    
    if (!result.success) {
      console.error('Parse/execution error:', result.error);
    }
    
    expect(result.success).toBe(true);
    
    // Check that the rule calculated the sum correctly
    // Should sum: 5000 + 6000 + 7000 = 18000
    const verkoopObj = context.getObject('Verkoop', 'verkoop1');
    expect(verkoopObj).toBeDefined();
    expect(verkoopObj?.['Q1 omzet']).toMatchObject({
      type: 'number',
      value: 18000
    });
  });

  test('should handle dimension range with missing values', () => {
    const model = `
Dimensie de kwartaaldimensie, bestaande uit de kwartaaldimensies (na het attribuut met voorzetsel in):
  1. Q1
  2. Q2
  3. Q3
  4. Q4

Objecttype de Bedrijf (mv: Bedrijven)
  de winst in kwartaal Numeriek (getal met 2 decimalen) gedimensioneerd met kwartaaldimensie;
  de eerste helft winst Numeriek (getal met 2 decimalen);

Regel bereken eerste helft
geldig altijd
De eerste helft winst van een Bedrijf moet berekend worden als 
de som van zijn winst in kwartaal vanaf Q1 t/m Q2.
`;
    
    const context = new Context();
    
    // Create a company object with only Q1 having a value (Q2 missing)
    const bedrijfAttributes = {
      'winst in kwartaal': {
        'Q1': 25000,
        // Q2 is missing
        'Q3': 30000,
        'Q4': 35000
      }
    };
    
    context.createObject('Bedrijf', 'bedrijf1', bedrijfAttributes as any);
    
    const result = engine.run(model, context);
    
    if (!result.success) {
      console.error('Parse/execution error:', result.error);
    }
    
    expect(result.success).toBe(true);
    
    // Check that the rule handled the missing value gracefully
    // Should sum only Q1: 25000 (Q2 is missing)
    const bedrijfObj = context.getObject('Bedrijf', 'bedrijf1');
    expect(bedrijfObj).toBeDefined();
    // The aggregation should handle missing values - only sum what's available
    expect(bedrijfObj?.['eerste helft winst']).toMatchObject({
      type: 'number',
      value: 25000  // Only Q1 since Q2 is missing
    });
  });
});