import { AntlrParser } from '../src/parsers/antlr-parser';

describe('Mid-line editing autocomplete', () => {
  let parser: AntlrParser;
  
  beforeEach(() => {
    parser = new AntlrParser();
  });
  
  it('should provide suggestions when editing in middle of line', () => {
    // Full line: "Parameter salaris: Bedrag;"
    // Cursor after "Parameter " (position 10)
    const text = 'Parameter salaris: Bedrag;';
    const position = 10; // After "Parameter ", before "salaris"
    
    const suggestions = parser.getExpectedTokensAt(text, position);
    
    // Should suggest parameter name placeholder or identifier
    expect(suggestions).toContain('<naam>');
  });
  
  it('should suggest types when editing after colon', () => {
    // Editing in middle: changing type
    const text = 'Parameter loon: Tekst;';
    const position = 16; // After colon and space, before "Tekst"
    
    const suggestions = parser.getExpectedTokensAt(text, position);
    
    // Should suggest types (note: types come back capitalized from grammar)
    expect(suggestions.map(s => s.toLowerCase())).toContain('bedrag');
    expect(suggestions.map(s => s.toLowerCase())).toContain('datum');
    expect(suggestions.map(s => s.toLowerCase())).toContain('numeriek');
  });
  
  it('should handle partial word replacement in middle', () => {
    // User wants to change "indien" to "altijd"
    const text = 'Regel Test\n  geldig indien x > 0;';
    const position = 20; // After "geldig " with space, before "indien"
    
    const suggestions = parser.getExpectedTokensAt(text, position);
    
    // Should suggest available options (indien comes from simple autocomplete)
    expect(suggestions).toContain('altijd');
    expect(suggestions).toContain('vanaf');
  });
  
  it('should complete partial parameter name in expression', () => {
    const fullDoc = `Parameter salaris_bruto: Bedrag;
Parameter salaris_netto: Bedrag;
Regel Test
  geldig indien sal > 0;`;
    
    // Cursor after "sal" in the condition (find in "indien sal")
    const position = fullDoc.indexOf('indien sal') + 'indien '.length + 3;
    
    const suggestions = parser.getExpectedTokensAt(fullDoc, position);
    
    // Should suggest both salary parameters
    expect(suggestions).toContain('salaris_bruto');
    expect(suggestions).toContain('salaris_netto');
  });
});