import { describe, it, expect } from '@jest/globals';
import { ParserBasedAutocompleteService } from '../src/parsers/parser-based-autocomplete';

describe('Parser Multi-word Integration', () => {
  let service: ParserBasedAutocompleteService;

  beforeEach(() => {
    service = new ParserBasedAutocompleteService();
  });

  it('should suggest multi-word keywords at document start', () => {
    const suggestions = service.getSuggestionsAt('', 0);
    
    // Should have both single and multi-word suggestions
    expect(suggestions).toContain('parameter');
    expect(suggestions).toContain('wederkerig feittype'); // Multi-word top-level
  });

  it('should complete "is gelijk" to "is gelijk aan"', () => {
    const text = 'Parameter x: Number\nRegel test\n  geldig indien x is gelijk';
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    expect(suggestions).toContain('is gelijk aan');
  });

  it('should suggest multi-word comparisons after "is"', () => {
    const text = 'Parameter x: Number\nRegel test\n  geldig indien x is';
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    // Should suggest various comparison operators
    expect(suggestions).toContain('is gelijk aan');
    expect(suggestions).toContain('is groter dan');
    expect(suggestions).toContain('is kleiner dan');
  });

  it('should complete partial "groter o" to "groter of gelijk aan"', () => {
    const text = 'groter o';
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    expect(suggestions).toContain('groter of gelijk aan');
  });

  it('should suggest function multi-words after "de"', () => {
    const text = 'Parameter salaris: Bedrag\nRegel test\n  x wordt de';
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    expect(suggestions).toContain('de som van');
    expect(suggestions).toContain('de absolute waarde van');
  });

  it('should handle "het" expansions', () => {
    const text = 'het';
    const position = text.length;
    
    const suggestions = service.getSuggestionsAt(text, position);
    
    // "het aantal" is two separate tokens, not a multi-word token
    // Only actual multi-word tokens from lexer are expanded
    expect(suggestions).toContain('het totaal van');
    expect(suggestions).toContain('het tijdsevenredig deel per');
  });
});