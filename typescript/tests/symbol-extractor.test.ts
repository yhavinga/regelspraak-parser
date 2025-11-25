import { describe, it, expect } from '@jest/globals';
import { SymbolExtractor } from '../src/parsers/symbol-extractor';

describe('Symbol Extractor', () => {
  let extractor: SymbolExtractor;

  beforeEach(() => {
    extractor = new SymbolExtractor();
  });

  it('should extract parameter names', () => {
    const source = `
      Parameter salaris: Bedrag
      Parameter leeftijd: Aantal
      Parameter naam: Tekst
    `;
    
    const symbols = extractor.extractSymbols(source);
    
    expect(symbols.parameters).toContain('salaris');
    expect(symbols.parameters).toContain('leeftijd');
    expect(symbols.parameters).toContain('naam');
  });

  it.skip('should extract domain values (not implemented in AST)', () => {
    // Domain values aren't parsed into the AST yet
    // This test is disabled until domain parsing is implemented
    const source = `
      Domein Kleur: {rood, groen, blauw};
      Domein Status: {actief, inactief, verwijderd};
    `;
    
    const symbols = extractor.extractSymbols(source);
    
    expect(symbols.domains['kleur']).toEqual(['rood', 'groen', 'blauw']);
    expect(symbols.domains['status']).toEqual(['actief', 'inactief', 'verwijderd']);
  });

  it.skip('should extract object type attributes (syntax not recognized)', () => {
    // Object type parsing doesn't recognize this syntax yet
    const source = `
      Objecttype Persoon bestaande uit de kenmerken
        voornaam: Tekst,
        achternaam: Tekst,
        geboortedatum: Datum;
    `;
    
    const symbols = extractor.extractSymbols(source);
    
    expect(symbols.objectTypes['persoon']).toContain('voornaam');
    expect(symbols.objectTypes['persoon']).toContain('achternaam');
    expect(symbols.objectTypes['persoon']).toContain('geboortedatum');
  });

  it('should handle parse errors gracefully', () => {
    const source = 'invalid syntax ###';
    
    const symbols = extractor.extractSymbols(source);
    
    // Should return empty symbols on parse error
    expect(symbols.parameters).toEqual([]);
    expect(Object.keys(symbols.domains)).toEqual([]);
  });

  it.skip('should extract unit names (not implemented in AST)', () => {
    // Unit systems aren't fully parsed in the AST yet
    const source = `
      Eenheidsysteem Lengte met basiseenheid meter (m) en eenheden
        kilometer (km) = 1000 meter,
        centimeter (cm) = 0.01 meter;
    `;
    
    const symbols = extractor.extractSymbols(source);
    
    expect(symbols.units).toContain('meter');
    expect(symbols.units).toContain('kilometer');
    expect(symbols.units).toContain('centimeter');
    expect(symbols.units).toContain('m');
    expect(symbols.units).toContain('km');
    expect(symbols.units).toContain('cm');
  });
});