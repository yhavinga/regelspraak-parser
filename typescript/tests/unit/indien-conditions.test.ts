import { describe, it, expect } from '@jest/globals';
import { AntlrParser } from '../../src/parsers/antlr-parser';
import { SamengesteldeVoorwaarde, QuantifierType } from '../../src/ast/expressions';

describe('Indien Conditions', () => {
  const parser = new AntlrParser();

  it('should parse simple indien condition', () => {
    const code = `
Parameter de volwassenleeftijd: Numeriek (geheel getal) met eenheid jr

Objecttype de Natuurlijk persoon
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Regel Minderjarigheid
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.
`;

    const result = parser.parse(code) as any[];
    const rule = result.find((item: any) => item.type === 'Rule');
    
    expect(rule).toBeDefined();
    expect(rule.condition).toBeDefined();
    expect(rule.condition.expression.type).toBe('BinaryExpression');
  });

  it('should parse compound condition with ALLE quantifier', () => {
    const code = `
Parameter de minimum leeftijd: Numeriek (geheel getal) met eenheid jr

Objecttype de Natuurlijk persoon
    is geschikt kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    de nationaliteit Tekst;

Regel GeschiktheidsTest
    geldig altijd
        Een Natuurlijk persoon is geschikt
        indien hij aan alle volgende voorwaarden voldoet:
            • zijn leeftijd is groter of gelijk aan de minimum leeftijd
            • zijn nationaliteit is gelijk aan "Nederlandse".
`;

    const result = parser.parse(code) as any[];
    const rule = result.find((item: any) => item.type === 'Rule');
    
    expect(rule).toBeDefined();
    expect(rule.condition).toBeDefined();
    expect(rule.condition.expression.type).toBe('SamengesteldeVoorwaarde');
    
    const samengesteld = rule.condition.expression as SamengesteldeVoorwaarde;
    expect(samengesteld.kwantificatie.type).toBe(QuantifierType.ALLE);
    expect(samengesteld.voorwaarden).toHaveLength(2);
  });

  it('should parse compound condition with TEN_MINSTE quantifier', () => {
    const code = `
Parameter het basis salaris: Bedrag

Objecttype de Werknemer
    is bonus waardig kenmerk (bijvoeglijk);
    het salaris Bedrag;
    de bonus Bedrag;
    heeft ervaring kenmerk (bijvoeglijk);

Regel BonusWaardigheid
    geldig altijd
        Een Werknemer is bonus waardig
        indien er aan ten minste één van de volgende voorwaarden wordt voldaan:
            • zijn salaris is groter dan het basis salaris
            • hij heeft ervaring.
`;

    const result = parser.parse(code) as any[];
    const rule = result.find((item: any) => item.type === 'Rule');
    
    expect(rule).toBeDefined();
    expect(rule.condition).toBeDefined();
    expect(rule.condition.expression.type).toBe('SamengesteldeVoorwaarde');
    
    const samengesteld = rule.condition.expression as SamengesteldeVoorwaarde;
    expect(samengesteld.kwantificatie.type).toBe(QuantifierType.TEN_MINSTE);
    expect(samengesteld.kwantificatie.aantal).toBe(1);
    expect(samengesteld.voorwaarden).toHaveLength(2);
  });

  it('should parse nested compound conditions', () => {
    const code = `
Parameter de pensioen leeftijd: Numeriek (geheel getal) met eenheid jr

Objecttype de Natuurlijk persoon
    is complex kenmerk (bijvoeglijk);
    de nationaliteit Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    is student kenmerk (bijvoeglijk);

Regel ComplexeStatus
    geldig altijd
        Een Natuurlijk persoon is complex
        indien hij aan alle volgende voorwaarden voldoet:
            • zijn nationaliteit is gelijk aan "Nederlandse"
            • hij voldoet aan ten minste één van de volgende voorwaarden:
                •• hij is student
                •• zijn leeftijd is groter dan de pensioen leeftijd.
`;

    const result = parser.parse(code) as any[];
    const rule = result.find((item: any) => item.type === 'Rule');
    
    expect(rule).toBeDefined();
    expect(rule.condition).toBeDefined();
    expect(rule.condition.expression.type).toBe('SamengesteldeVoorwaarde');
    
    const samengesteld = rule.condition.expression as SamengesteldeVoorwaarde;
    expect(samengesteld.kwantificatie.type).toBe(QuantifierType.ALLE);
    expect(samengesteld.voorwaarden).toHaveLength(2);
    
    // Check nested condition
    const nestedCondition = samengesteld.voorwaarden[1] as SamengesteldeVoorwaarde;
    expect(nestedCondition.type).toBe('SamengesteldeVoorwaarde');
    expect(nestedCondition.kwantificatie.type).toBe(QuantifierType.TEN_MINSTE);
    expect(nestedCondition.kwantificatie.aantal).toBe(1);
    expect(nestedCondition.voorwaarden).toHaveLength(2);
  });

  it('should parse compound condition with GEEN_VAN_DE quantifier', () => {
    const code = `
Objecttype de Persoon
    is toegestaan kenmerk (bijvoeglijk);
    is geblokkeerd kenmerk (bijvoeglijk);
    is verbannen kenmerk (bijvoeglijk);

Regel Toegang
    geldig altijd
        Een Persoon is toegestaan
        indien hij aan geen van de volgende voorwaarden voldoet:
            • hij is geblokkeerd
            • hij is verbannen.
`;

    const result = parser.parse(code) as any[];
    const rule = result.find((item: any) => item.type === 'Rule');
    
    expect(rule).toBeDefined();
    expect(rule.condition).toBeDefined();
    expect(rule.condition.expression.type).toBe('SamengesteldeVoorwaarde');
    
    const samengesteld = rule.condition.expression as SamengesteldeVoorwaarde;
    expect(samengesteld.kwantificatie.type).toBe(QuantifierType.GEEN);
    expect(samengesteld.voorwaarden).toHaveLength(2);
  });

  it('should parse compound condition with PRECIES quantifier', () => {
    const code = `
Objecttype de Aanvraag
    is goedgekeurd kenmerk (bijvoeglijk);
    heeft handtekening A kenmerk (bijvoeglijk);
    heeft handtekening B kenmerk (bijvoeglijk);
    heeft handtekening C kenmerk (bijvoeglijk);

Regel Goedkeuring
    geldig altijd
        Een Aanvraag is goedgekeurd
        indien er aan precies twee van de volgende voorwaarden wordt voldaan:
            • zij heeft handtekening A
            • zij heeft handtekening B
            • zij heeft handtekening C.
`;

    const result = parser.parse(code) as any[];
    const rule = result.find((item: any) => item.type === 'Rule');
    
    expect(rule).toBeDefined();
    expect(rule.condition).toBeDefined();
    expect(rule.condition.expression.type).toBe('SamengesteldeVoorwaarde');
    
    const samengesteld = rule.condition.expression as SamengesteldeVoorwaarde;
    expect(samengesteld.kwantificatie.type).toBe(QuantifierType.PRECIES);
    expect(samengesteld.kwantificatie.aantal).toBe(2);
    expect(samengesteld.voorwaarden).toHaveLength(3);
  });

  it('should parse compound condition with TEN_HOOGSTE quantifier', () => {
    const code = `
Objecttype het Document
    is valide kenmerk (bijvoeglijk);
    heeft fout A kenmerk (bijvoeglijk);
    heeft fout B kenmerk (bijvoeglijk);
    heeft fout C kenmerk (bijvoeglijk);

Regel Validatie
    geldig altijd
        Een Document is valide
        indien er aan ten hoogste één van de volgende voorwaarden wordt voldaan:
            • het heeft fout A
            • het heeft fout B
            • het heeft fout C.
`;

    const result = parser.parse(code) as any[];
    const rule = result.find((item: any) => item.type === 'Rule');
    
    expect(rule).toBeDefined();
    expect(rule.condition).toBeDefined();
    expect(rule.condition.expression.type).toBe('SamengesteldeVoorwaarde');
    
    const samengesteld = rule.condition.expression as SamengesteldeVoorwaarde;
    expect(samengesteld.kwantificatie.type).toBe(QuantifierType.TEN_HOOGSTE);
    expect(samengesteld.kwantificatie.aantal).toBe(1);
    expect(samengesteld.voorwaarden).toHaveLength(3);
  });
});