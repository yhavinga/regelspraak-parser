/**
 * Simple autocomplete service for RegelSpraak
 * 
 * This is a pragmatic implementation that provides basic keyword suggestions
 * based on the current context. For a parser-based solution, consider using
 * antlr4-c3 with proper configuration.
 */
export class SimpleAutocompleteService {
  
  /**
   * Get suggestions based on text context
   */
  getSuggestionsAt(text: string, position: number): string[] {
    const textUpToCursor = text.substring(0, position);
    const lastLine = textUpToCursor.split('\n').pop() || '';
    
    // Empty document - suggest top-level definitions
    if (textUpToCursor.trim() === '') {
      return [
        'Beslistabel',
        'Domein',
        'Feittype',
        'Objecttype',
        'Parameter',
        'Regel',
        'Regelgroep'
      ];
    }
    
    // After "Parameter " - suggest identifier placeholder
    if (lastLine.match(/Parameter\s*$/)) {
      return ['<naam>'];
    }
    
    // After colon in parameter - suggest types
    if (lastLine.match(/^Parameter\s+\w+\s*:\s*$/)) {
      return [
        'Bedrag',
        'Boolean',
        'Datum',
        'Numeriek',
        'Tekst'
      ];
    }
    
    // After "Regel " - suggest name
    if (lastLine.match(/^Regel\s*$/)) {
      return ['<naam>'];
    }
    
    // Inside rule, at indentation - suggest "geldig"
    if (textUpToCursor.includes('Regel ') && lastLine.match(/^\s+$/) && !textUpToCursor.includes('geldig')) {
      return ['geldig'];
    }
    
    // After "geldig " - suggest conditions
    if (lastLine.match(/geldig\s+$/)) {
      return ['altijd', 'indien'];
    }
    
    // After "indien " - suggest parameter names or articles
    if (lastLine.match(/indien\s*$/)) {
      // Extract parameter names from document
      const parameterMatches = text.matchAll(/Parameter\s+(\w+)/g);
      const parameters = Array.from(parameterMatches).map(m => m[1]);
      
      return [
        ...parameters,
        'de',
        'een',
        'het'
      ].sort();
    }
    
    // After "is " - suggest comparison operators
    if (lastLine.match(/\bis\s*$/)) {
      return [
        'een',
        'gelijk aan',
        'groter dan',
        'groter of gelijk aan',
        'kleiner dan',
        'kleiner of gelijk aan',
        'leeg',
        'niet leeg',
        'ongelijk aan'
      ];
    }
    
    // After "moet " - suggest assignment patterns
    if (lastLine.match(/moet\s*$/)) {
      return [
        'berekend worden als',
        'geinitialiseerd worden op',
        'gesteld worden op'
      ];
    }
    
    // After articles - suggest parameter names or functions
    if (lastLine.match(/\b(de|het|een)\s*$/)) {
      // Extract parameter names
      const parameterMatches = text.matchAll(/Parameter\s+(\w+)/g);
      const parameters = Array.from(parameterMatches).map(m => m[1]);
      
      return [
        ...parameters,
        'absolute waarde van',
        'aantal',
        'eerste van',
        'laatste van',
        'maximale waarde van',
        'minimale waarde van',
        'som van',
        'wortel van'
      ].sort();
    }
    
    // Default: return empty array
    return [];
  }
}