import { describe, it, expect } from '@jest/globals';
import { ParserBasedAutocompleteService } from '../src/parsers/parser-based-autocomplete';

describe('Symbol-aware Autocomplete', () => {
  let service: ParserBasedAutocompleteService;

  beforeEach(() => {
    service = new ParserBasedAutocompleteService();
  });

  it('should suggest parameter names after "indien"', () => {
    const text = `
Parameter salaris: Bedrag;
Parameter leeftijd: Aantal;

Regel test
  geldig indien `;
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    // Should include defined parameters
    expect(suggestions).toContain('salaris');
    expect(suggestions).toContain('leeftijd');
  });

  it('should suggest parameters in partial context', () => {
    const text = `
Parameter inkomen: Bedrag;
Parameter belasting: Bedrag;

de `;
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    // Should include parameters after "de"
    expect(suggestions).toContain('inkomen');
    expect(suggestions).toContain('belasting');
  });

  it('should complete partial parameter names', () => {
    const text = `
Parameter salaris_bruto: Bedrag;
Parameter salaris_netto: Bedrag;

indien sal`;
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    // Should include parameters starting with "sal"
    expect(suggestions).toContain('salaris_bruto');
    expect(suggestions).toContain('salaris_netto');
  });

  it('should not suggest parameters when not appropriate', () => {
    const text = `
Parameter test: Bedrag;

Regel `;
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    // Should not include parameter "test" after "Regel"
    expect(suggestions).not.toContain('test');
  });

  it('should handle empty parameter list gracefully', () => {
    const text = 'indien ';
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    // Should return suggestions but no parameters (none defined)
    expect(suggestions).toBeDefined();
    expect(suggestions.length).toBeGreaterThan(0);
  });

  it('should work with multi-line parameter definitions', () => {
    const text = `
Parameter basis_salaris: Bedrag;
Parameter bonus: Bedrag;
Parameter totaal_inkomen: Bedrag;

Regel bereken_inkomen
  totaal_inkomen wordt basis_salaris + `;
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    // Should suggest other parameters for addition
    expect(suggestions).toContain('bonus');
  });
});