import { Engine, Context, Value } from '../../src';
import { AttributeReference } from '../../src/ast/expressions';

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
      
      Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr
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

  test('should navigate through feittype relationships', () => {
    const code = `
      Objecttype Passagier (bezield)
        de naam Tekst;
        de leeftijd Numeriek (geheel getal) met eenheid jr;
      
      Objecttype Vlucht
        het vluchtnummer Tekst;
        de bestemming Tekst;
      
      Feittype vlucht van passagiers
        de vlucht	Vlucht
        de passagier (mv: passagiers)	Passagier
      Een vlucht vervoert passagiers
    `;

    // Parse and execute the model to register the feittype
    const parseResult = engine.parse(code);
    expect(parseResult.success).toBe(true);

    // Execute each definition in the model
    const model = parseResult.ast;
    for (const feittype of model.feittypen || []) {
      (context as any).registerFeittype(feittype);
    }

    // Create some test objects
    const vlucht1 = {
      vluchtnummer: { type: 'string', value: 'KL1234' },
      bestemming: { type: 'string', value: 'Amsterdam' }
    };
    context.createObject('Vlucht', 'vlucht1', vlucht1);
    const vluchtObj = { type: 'object', objectType: 'Vlucht', objectId: 'vlucht1', value: vlucht1 } as Value;

    const passagier1 = {
      naam: { type: 'string', value: 'Jan' },
      leeftijd: { type: 'number', value: 25, unit: { name: 'jaar' } }
    };
    context.createObject('Passagier', 'passagier1', passagier1);
    const passagier1Obj = { type: 'object', objectType: 'Passagier', objectId: 'passagier1', value: passagier1 } as Value;

    const passagier2 = {
      naam: { type: 'string', value: 'Marie' },
      leeftijd: { type: 'number', value: 30, unit: { name: 'jaar' } }
    };
    context.createObject('Passagier', 'passagier2', passagier2);
    const passagier2Obj = { type: 'object', objectType: 'Passagier', objectId: 'passagier2', value: passagier2 } as Value;

    // Create relationships
    (context as any).addRelationship('vlucht van passagiers', vluchtObj, passagier1Obj);
    (context as any).addRelationship('vlucht van passagiers', vluchtObj, passagier2Obj);

    // Test direct navigation through expression evaluation
    const evaluator = (engine as any).expressionEvaluator;
    // Use AttributeReference with 'alle' pattern which triggers FeitType relationship lookup
    const attrRef: AttributeReference = {
      type: 'AttributeReference',
      path: ['vlucht', 'alle passagiers']
    };

    // Set the current vlucht as context
    context.setVariable('vlucht', vluchtObj);

    const passagiers = evaluator.evaluate(attrRef, context);
    expect(passagiers.type).toBe('array');
    expect(passagiers.value).toHaveLength(2);
    expect((passagiers.value as Value[])[0]).toEqual(passagier1Obj);
    expect((passagiers.value as Value[])[1]).toEqual(passagier2Obj);
  });

  test('should get related objects through feittype', () => {
    const code = `
      Objecttype Eigenaar
        de naam Tekst;
      
      Objecttype Voertuig
        het kenteken Tekst;
      
      Feittype eigenaarschap
        de eigenaar	Eigenaar
        het voertuig	Voertuig
      Een eigenaar heeft een voertuig
    `;

    const result = engine.run(code, context);
    expect(result.success).toBe(true);

    // Create test objects
    const eigenaar1 = { naam: { type: 'string', value: 'Pietje' } };
    context.createObject('Eigenaar', 'eigenaar1', eigenaar1);
    const eigenaarObj = { type: 'object', objectType: 'Eigenaar', objectId: 'eigenaar1', value: eigenaar1 };

    const voertuig1 = { kenteken: { type: 'string', value: 'AA-BB-11' } };
    context.createObject('Voertuig', 'voertuig1', voertuig1);
    const voertuigObj = { type: 'object', objectType: 'Voertuig', objectId: 'voertuig1', value: voertuig1 };

    // Add relationship
    (context as any).addRelationship('eigenaarschap', eigenaarObj, voertuigObj);

    // Test getRelatedObjects
    const relatedVoertuigen = (context as any).getRelatedObjects(eigenaarObj, 'eigenaarschap', true);
    expect(relatedVoertuigen).toHaveLength(1);
    expect(relatedVoertuigen[0]).toEqual(voertuigObj);

    const relatedEigenaren = (context as any).getRelatedObjects(voertuigObj, 'eigenaarschap', false);
    expect(relatedEigenaren).toHaveLength(1);
    expect(relatedEigenaren[0]).toEqual(eigenaarObj);
  });
});