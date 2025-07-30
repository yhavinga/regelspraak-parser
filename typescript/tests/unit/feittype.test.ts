import { Engine, Context } from '../../src';

describe('Feittype', () => {
  let engine: Engine;
  let context: Context;

  beforeEach(() => {
    engine = new Engine();
    context = new Context();
  });

  test('should parse basic feittype definition', () => {
    const code = `
      Feittype vlucht van passagiers
        de vlucht	Vlucht
        de passagier	Passagier
      Een vlucht vervoert passagiers
    `;

    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);
    
    const feittype = parseResult.ast;
    expect(feittype).toBeDefined();
    expect(feittype.type).toBe('FeitType');
    expect(feittype.naam).toBe('vlucht van passagiers');
    expect(feittype.wederkerig).toBe(false);
    expect(feittype.rollen).toHaveLength(2);
    
    // Check roles
    expect(feittype.rollen[0].naam).toBe('vlucht');
    expect(feittype.rollen[0].objectType).toBe('Vlucht');
    
    expect(feittype.rollen[1].naam).toBe('passagier');
    expect(feittype.rollen[1].objectType).toBe('Passagier');
    
    // Check cardinality description
    expect(feittype.cardinalityDescription).toBe('Een vlucht vervoert passagiers');
  });

  test('should parse feittype with plural role names', () => {
    const code = `
      Feittype vlucht van passagiers
        de vlucht	Vlucht
        de passagier (mv: passagiers)	Passagier
      Een vlucht vervoert meerdere passagiers
    `;

    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);
    
    const feittype = parseResult.ast;
    expect(feittype.rollen[1].naam).toBe('passagier');
    expect(feittype.rollen[1].meervoud).toBe('passagiers');
    expect(feittype.rollen[1].objectType).toBe('Passagier');
  });

  test('should parse wederkerig feittype', () => {
    const code = `
      Wederkerig feittype partnerrelatie
        de partner	Persoon
      Een partner heeft een partner
    `;

    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);
    
    const feittype = parseResult.ast;
    expect(feittype.type).toBe('FeitType');
    expect(feittype.naam).toBe('partnerrelatie');
    expect(feittype.wederkerig).toBe(true);
    expect(feittype.rollen).toHaveLength(1);
    
    expect(feittype.rollen[0].naam).toBe('partner');
    expect(feittype.rollen[0].objectType).toBe('Persoon');
  });

  test('should parse complete model with feittype', () => {
    const code = `
      Objecttype Passagier (bezield)
        de naam Tekst;
        de leeftijd Numeriek (geheel getal) met eenheid jr;
      
      Objecttype Vlucht
        het vluchtnummer Tekst;
        de bestemming Tekst;
      
      Feittype vlucht van passagiers
        de vlucht	Vlucht
        de passagier	Passagier
      Een vlucht vervoert passagiers
      
      Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;
    `;

    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);
    
    const model = parseResult.ast;
    expect(model.type).toBe('Model');
    expect(model.objectTypes).toHaveLength(2);
    expect(model.feittypen).toHaveLength(1);
    expect(model.parameters).toHaveLength(1);
    
    // Check feittype
    const feittype = model.feittypen[0];
    expect(feittype.naam).toBe('vlucht van passagiers');
  });

  test('should execute feittype definition', () => {
    const code = `
      Feittype eigenaarschap
        de eigenaar	Persoon
        het voertuig	Voertuig
      Een eigenaar heeft een voertuig
    `;

    const result = engine.run(code, context);
    expect(result.success).toBe(true);
    expect(result.value?.value).toBe("FeitType 'eigenaarschap' registered");
  });

  // TODO: Add tests for relationship navigation once that's implemented
  test.skip('should navigate through feittype relationships', () => {
    const code = `
      Objecttype Passagier (bezield)
        de naam Tekst;
      
      Objecttype Vlucht
        het vluchtnummer Tekst;
      
      Feittype vlucht van passagiers
        de vlucht Vlucht
        de passagier Passagier
      Een vlucht vervoert passagiers
      
      Regel tel passagiers
        geldig altijd
          Het aantal passagiers van een vlucht moet berekend worden als het aantal passagiers van de vlucht.
    `;
    
    // This test will be implemented once relationship navigation is complete
  });
});