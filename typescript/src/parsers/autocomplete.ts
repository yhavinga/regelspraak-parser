import { CharStream, CommonTokenStream } from 'antlr4';
import { CodeCompletionCore } from 'antlr4-c3';
import RegelSpraakLexer from '../generated/antlr/RegelSpraakLexer';
import RegelSpraakParser from '../generated/antlr/RegelSpraakParser';

/**
 * Autocomplete service using antlr4-c3 for proper ATN analysis
 */
export class AutocompleteService {
  
  /**
   * Get autocomplete suggestions at a specific position using antlr4-c3
   * 
   * This uses the Code Completion Core (c3) library which properly analyzes
   * the ATN without requiring an active parsing context.
   */
  getSuggestionsAt(text: string, position: number): string[] {
    const textUpToCursor = text.substring(0, position);
    
    // Create parser
    const chars = new CharStream(textUpToCursor);
    const lexer = new RegelSpraakLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new RegelSpraakParser(tokens);
    
    // Suppress errors
    parser.removeErrorListeners();
    
    // Start parsing but expect it to fail
    try {
      parser.regelSpraakDocument();
    } catch (e) {
      // Expected for incomplete input
    }
    
    // Create code completion core
    // Note: antlr4-c3 expects a different Parser type than what we have
    // This would need proper type mapping for production use
    const core = new CodeCompletionCore(parser as any);
    
    // Configure which tokens/rules we want to see as candidates
    // We're interested in keywords and identifiers
    core.ignoredTokens = new Set([
      RegelSpraakParser.EOF,
      RegelSpraakParser.WS,
      RegelSpraakParser.LINE_COMMENT
    ]);
    
    // Prefer rules that represent complete constructs
    core.preferredRules = new Set([
      RegelSpraakParser.RULE_parameterDefinition,
      RegelSpraakParser.RULE_regel,
      RegelSpraakParser.RULE_objectTypeDefinition,
      RegelSpraakParser.RULE_beslistabel,
      RegelSpraakParser.RULE_domeinDefinition
    ]);
    
    // Get the token index at cursor position
    const tokenIndex = tokens.index;
    
    // Collect candidates at this position
    const candidates = core.collectCandidates(tokenIndex);
    
    const suggestions: string[] = [];
    
    // Process token candidates
    for (const [tokenType, followList] of candidates.tokens) {
      const suggestion = this.tokenToReadableString(tokenType);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }
    
    // Process rule candidates (these are higher-level constructs)
    for (const [ruleIndex, followList] of candidates.rules) {
      const ruleName = parser.ruleNames[ruleIndex];
      // Add placeholders for common rules
      if (ruleName === 'naam' || ruleName === 'identifier') {
        suggestions.push('<naam>');
      }
    }
    
    return [...new Set(suggestions)].sort();
  }
  
  /**
   * Convert token type to readable Dutch string
   */
  private tokenToReadableString(tokenType: number): string {
    // Skip EOF
    if (tokenType === RegelSpraakParser.EOF) {
      return '';
    }
    
    // Get token name from vocabulary
    const literal = RegelSpraakParser.literalNames[tokenType];
    const symbolic = RegelSpraakParser.symbolicNames[tokenType];
    
    // Process literal tokens
    if (literal) {
      // Remove quotes
      const clean = literal.replace(/^'|'$/g, '');
      
      // Skip meta-annotations
      if (clean.startsWith('(') && clean.endsWith(')')) {
        return '';
      }
      
      return clean;
    }
    
    // Process symbolic tokens with better mappings
    if (symbolic) {
      // Skip internal tokens
      if (symbolic.startsWith('T__')) {
        return '';
      }
      
      // Common mappings
      const mappings: Record<string, string> = {
        'IDENTIFIER': '<naam>',
        'NUMBER': '<getal>',
        'STRING': '<tekst>',
        'PARAMETER': 'Parameter',
        'REGEL': 'Regel',
        'OBJECTTYPE': 'Objecttype',
        'BESLISTABEL': 'Beslistabel',
        'DOMEIN': 'Domein',
        'FEITTYPE': 'Feittype',
        'INDIEN': 'indien',
        'ALTIJD': 'altijd',
        'GELDIG': 'geldig',
        'NUMERIEK': 'Numeriek',
        'TEKST': 'Tekst',
        'BEDRAG': 'Bedrag',
        'DATUM': 'Datum',
        'BOOLEAN': 'Boolean'
      };
      
      if (mappings[symbolic]) {
        return mappings[symbolic];
      }
    }
    
    return '';
  }
}