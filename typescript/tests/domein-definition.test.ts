/**
 * Tests for DomainDefinition parsing
 *
 * Validates that domain definitions (Domein) are properly parsed
 * without falling back to text extraction and console.warn
 */

import { Engine } from '../src/engine/engine';

describe('DomainDefinition parsing', () => {
  let engine: Engine;

  beforeEach(() => {
    engine = new Engine();
  });

  it('should parse numeric domain with decimals', () => {
    const source = `Domein Bedrag is van het type Numeriek (getal met 2 decimalen);`;
    const result = engine.parseModel(source);

    expect(result.success).toBe(true);
    expect(result.model).toBeDefined();
    expect(result.model.domains).toHaveLength(1);
    expect(result.model.domains[0]).toMatchObject({
      type: 'DomainDefinition',
      name: 'Bedrag',
      baseType: 'Numeriek',
      decimals: 2
    });
  });

  it('should parse simple numeric domain without specification', () => {
    const source = `Domein Aantal is van het type Numeriek;`;
    const result = engine.parseModel(source);

    expect(result.success).toBe(true);
    expect(result.model.domains).toHaveLength(1);
    expect(result.model.domains[0]).toMatchObject({
      type: 'DomainDefinition',
      name: 'Aantal',
      baseType: 'Numeriek'
    });
    expect(result.model.domains[0].decimals).toBeUndefined();
  });

  it('should parse enumeration domain', () => {
    const source = `Domein Luchthavens is van het type Enumeratie 'Amsterdam Schiphol' 'Parijs CDG';`;
    const result = engine.parseModel(source);

    expect(result.success).toBe(true);
    expect(result.model.domains).toHaveLength(1);
    expect(result.model.domains[0]).toMatchObject({
      type: 'DomainDefinition',
      name: 'Luchthavens',
      baseType: 'Enumeratie',
      enumerationValues: ['Amsterdam Schiphol', 'Parijs CDG']
    });
  });

  it('should parse tekst domain', () => {
    const source = `Domein Naam is van het type Tekst;`;
    const result = engine.parseModel(source);

    expect(result.success).toBe(true);
    expect(result.model.domains).toHaveLength(1);
    expect(result.model.domains[0]).toMatchObject({
      type: 'DomainDefinition',
      name: 'Naam',
      baseType: 'Tekst'
    });
  });

  it('should parse boolean domain', () => {
    const source = `Domein Vlag is van het type Boolean;`;
    const result = engine.parseModel(source);

    expect(result.success).toBe(true);
    expect(result.model.domains).toHaveLength(1);
    expect(result.model.domains[0]).toMatchObject({
      type: 'DomainDefinition',
      name: 'Vlag',
      baseType: 'Boolean'
    });
  });

  it('should parse datum domain', () => {
    const source = `Domein Geboortedatum is van het type Datum in dagen;`;
    const result = engine.parseModel(source);

    expect(result.success).toBe(true);
    expect(result.model.domains).toHaveLength(1);
    expect(result.model.domains[0]).toMatchObject({
      type: 'DomainDefinition',
      name: 'Geboortedatum',
      baseType: 'Datum in dagen'
    });
  });

  it('should parse datum-tijd domain', () => {
    const source = `Domein Tijdstempel is van het type Datum en tijd in millisecondes;`;
    const result = engine.parseModel(source);

    expect(result.success).toBe(true);
    expect(result.model.domains).toHaveLength(1);
    expect(result.model.domains[0]).toMatchObject({
      type: 'DomainDefinition',
      name: 'Tijdstempel',
      baseType: 'Datum en tijd in millisecondes'
    });
  });

  it('should parse domain with unit', () => {
    const source = `Domein Afstand is van het type Numeriek met eenheid m;`;
    const result = engine.parseModel(source);

    expect(result.success).toBe(true);
    expect(result.model.domains).toHaveLength(1);
    expect(result.model.domains[0]).toMatchObject({
      type: 'DomainDefinition',
      name: 'Afstand',
      baseType: 'Numeriek',
      unit: 'm'
    });
  });

  it('should not emit console.warn for domain definitions', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const source = `Domein Bedrag is van het type Numeriek;`;

    engine.parseModel(source);

    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('DomeinDefinitionContext')
    );
    warnSpy.mockRestore();
  });

  it('should parse multiple domains', () => {
    const source = `
      Domein Bedrag is van het type Numeriek (getal met 2 decimalen);
      Domein Status is van het type Enumeratie 'actief' 'inactief';
    `;
    const result = engine.parseModel(source);

    expect(result.success).toBe(true);
    expect(result.model.domains).toHaveLength(2);
    expect(result.model.domains[0].name).toBe('Bedrag');
    expect(result.model.domains[1].name).toBe('Status');
  });
});
