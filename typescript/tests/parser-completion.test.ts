import { AntlrParser } from '../src/parsers/antlr-parser';

describe('Parser Autocomplete', () => {
  let parser: AntlrParser;

  beforeEach(() => {
    parser = new AntlrParser();
  });

  test('returns array of suggestions', () => {
    const text = '';
    const suggestions = parser.getExpectedTokensAt(text, 0);
    
    // Should return an array
    expect(Array.isArray(suggestions)).toBe(true);
  });

  test('suggests something at empty document', () => {
    const text = '';
    const suggestions = parser.getExpectedTokensAt(text, 0);
    
    // Should have some suggestions
    expect(suggestions.length).toBeGreaterThan(0);
    
    // Log what we actually get
    console.log('Suggestions at empty doc:', suggestions);
  });

  test('suggests something after Parameter keyword', () => {
    const text = 'Parameter '
    const suggestions = parser.getExpectedTokensAt(text, text.length);
    
    // Should have suggestions
    expect(suggestions.length).toBeGreaterThan(0);
    
    console.log('Suggestions after Parameter:', suggestions);
  });

  test('no empty strings in suggestions', () => {
    const text = 'Parameter '
    const suggestions = parser.getExpectedTokensAt(text, text.length);
    
    // Should not contain empty strings
    expect(suggestions).not.toContain('');
  });

  test('removes duplicates', () => {
    const text = 'Parameter '
    const suggestions = parser.getExpectedTokensAt(text, text.length);
    
    // Check no duplicates
    const uniqueSuggestions = [...new Set(suggestions)];
    expect(suggestions.length).toBe(uniqueSuggestions.length);
  });

  test('returns sorted results', () => {
    const text = 'Parameter '
    const suggestions = parser.getExpectedTokensAt(text, text.length);
    
    // Check sorted
    const sorted = [...suggestions].sort();
    expect(suggestions).toEqual(sorted);
  });
});