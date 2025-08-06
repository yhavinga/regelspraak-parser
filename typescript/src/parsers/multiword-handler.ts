/**
 * Handles multi-word keyword suggestions for RegelSpraak
 * 
 * RegelSpraak has 128+ multi-word keywords. When the parser expects 'groter',
 * users actually want to see 'groter dan' or 'groter of gelijk aan'.
 * 
 * This is not elegant. It's a giant lookup table. But it works and it's fast.
 */
export class MultiWordHandler {
  // Map from first word to complete multi-word phrases
  private readonly multiWordMap: Map<string, string[]>;
  
  constructor() {
    this.multiWordMap = this.buildMultiWordMap();
  }
  
  /**
   * Expand single tokens to include multi-word suggestions
   */
  expandToMultiWord(tokens: string[]): string[] {
    const results = new Set<string>();
    
    for (const token of tokens) {
      // Always include the original token
      results.add(token);
      
      // Add multi-word expansions if they exist
      const expansions = this.multiWordMap.get(token.toLowerCase());
      if (expansions) {
        expansions.forEach(e => results.add(e));
      }
    }
    
    return Array.from(results).sort();
  }
  
  /**
   * Complete a partial multi-word phrase
   */
  completeMultiWord(partial: string): string[] {
    const results: string[] = [];
    const partialLower = partial.toLowerCase();
    
    // Check all multi-word phrases
    for (const [_, phrases] of this.multiWordMap) {
      for (const phrase of phrases) {
        if (phrase.startsWith(partialLower)) {
          results.push(phrase);
        }
      }
    }
    
    return results;
  }
  
  private buildMultiWordMap(): Map<string, string[]> {
    const map = new Map<string, string[]>();
    
    // These are extracted from RegelSpraakLexer.g4
    // Grouped by first word for efficient lookup
    
    // "is" patterns
    map.set('is', [
      'is gelijk aan',
      'is groter dan',
      'is kleiner dan',
      'is groter of gelijk aan',
      'is kleiner of gelijk aan',
      'is later dan',
      'is eerder dan',
      'is later of gelijk aan',
      'is eerder of gelijk aan',
      'is van het type',
      'is een',
      'is niet gelijk aan',
      'is ongelijk aan'
    ]);
    
    // "groter" patterns
    map.set('groter', [
      'groter dan',
      'groter of gelijk aan'
    ]);
    
    // "kleiner" patterns
    map.set('kleiner', [
      'kleiner dan',
      'kleiner of gelijk aan'
    ]);
    
    // "de" patterns (functions and operators)
    map.set('de', [
      'de som van',
      'de absolute waarde van',
      'de absolute tijdsduur van',
      'de maximale waarde van',
      'de minimale waarde van',
      'de eerste van',
      'de laatste van',
      'de eerste paasdag van',
      'de datum met jaar, maand en dag',
      'de wortel van',
      'de concatenatie van',
      'de tijdsduur van'
    ]);
    
    // "het" patterns
    map.set('het', [
      'het aantal',
      'het totaal van',
      'het tijdsevenredig deel per',
      'het volgende criterium:'
    ]);
    
    // "moet" patterns
    map.set('moet', [
      'moet berekend worden als',
      'moet gesteld worden op',
      'moet geïnitialiseerd worden op'
    ]);
    
    // "later" patterns
    map.set('later', [
      'later dan',
      'later of gelijk aan'
    ]);
    
    // "eerder" patterns
    map.set('eerder', [
      'eerder dan',
      'eerder of gelijk aan'
    ]);
    
    // "van" patterns
    map.set('van', [
      'van het type'
    ]);
    
    // "met" patterns
    map.set('met', [
      'met een minimum van',
      'met een maximum van'
    ]);
    
    // "indien" patterns
    map.set('indien', [
      'indien en alleen als'
    ]);
    
    // "gedurende" patterns
    map.set('gedurende', [
      'gedurende de tijd dat',
      'gedurende het gehele',
      'gedurende de gehele'
    ]);
    
    // "voldoet" patterns
    map.set('voldoet', [
      'voldoet aan de elfproef',
      'voldoet niet aan de elfproef'
    ]);
    
    // Other important phrases
    map.set('afgerond', ['afgerond op']);
    map.set('per', ['per direct']);
    map.set('datum', ['datum en tijd in millisecondes', 'datum in dagen']);
    map.set('bestaande', ['bestaande uit de']);
    map.set('waarbij', ['waarbij wordt verdeeld']);
    map.set('als', ['als onverdeelde rest blijft']);
    
    return map;
  }
}