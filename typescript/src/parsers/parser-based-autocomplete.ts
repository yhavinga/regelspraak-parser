import { CharStream, CommonTokenStream, ErrorListener, RecognitionException, Recognizer, Token } from 'antlr4';
import RegelSpraakLexer from '../generated/antlr/RegelSpraakLexer';
import RegelSpraakParser from '../generated/antlr/RegelSpraakParser';
import { MultiWordHandler } from './multiword-handler';
import { SymbolExtractor } from './symbol-extractor';

/**
 * Parser-based autocomplete that uses error messages to extract expected tokens
 * 
 * This is a pragmatic approach that works around ANTLR4 JS limitations:
 * - getExpectedTokens() requires active parser context
 * - Parser context is cleared after parse completes
 * - Error messages contain the expected tokens
 */
export class ParserBasedAutocompleteService {
  private multiWordHandler: MultiWordHandler;
  private symbolExtractor: SymbolExtractor;
  
  constructor() {
    this.multiWordHandler = new MultiWordHandler();
    this.symbolExtractor = new SymbolExtractor();
  }
  
  /**
   * Get suggestions by parsing incomplete input and extracting from error messages
   * 
   * @param text The full document text
   * @param position The cursor position in the document
   */
  getSuggestionsAt(text: string, position: number): string[] {
    const textUpToCursor = text.substring(0, position);
    const textAfterCursor = text.substring(position);
    const suggestions = new Set<string>();
    
    // For mid-line editing, we need to handle the complete context
    // Strategy: Replace current token at cursor with a placeholder
    const textToParse = this.prepareTextForParsing(text, position);
    
    // Try parsing and capture error message
    const errorMsg = this.parseAndGetError(textToParse);
    if (errorMsg) {
      // Extract expected tokens from error message
      // Format: "expecting {<EOF>, 'Token1', 'Token2', ...}"
      const match = errorMsg.match(/expecting \{([^}]+)\}/);
      if (match) {
        const tokensStr = match[1];
        const tokens = tokensStr.split(',').map(t => t.trim());
        
        for (const token of tokens) {
          // Remove quotes and angle brackets
          const cleaned = token.replace(/[<>']/g, '').trim();
          // Skip EOF
          if (cleaned !== 'EOF' && cleaned) {
            // Convert to lowercase for consistency
            suggestions.add(cleaned.toLowerCase());
          }
        }
      }
    }
    
    // Also try with partial word completion
    const lastWord = this.getLastPartialWord(textUpToCursor);
    if (lastWord) {
      // Get suggestions for partial match
      const partialSuggestions = this.getPartialMatches(lastWord);
      partialSuggestions.forEach(s => suggestions.add(s));
      
      // Also check for multi-word completions
      const multiWordCompletions = this.multiWordHandler.completeMultiWord(lastWord);
      multiWordCompletions.forEach(s => suggestions.add(s));
    }
    
    // Expand single tokens to include multi-word suggestions
    const singleTokens = [...suggestions];
    const expandedSuggestions = this.multiWordHandler.expandToMultiWord(singleTokens);
    
    // Combine original and expanded suggestions
    expandedSuggestions.forEach(s => suggestions.add(s));
    
    // Check if we should suggest domain values
    const domainContext = this.getDomainContext(text, textUpToCursor);
    if (domainContext) {
      if (domainContext === '__DOMAIN_DEFINITION__') {
        // Inside domain definition - suggest placeholder for more values
        suggestions.add("'<value>'");
      } else {
        // Extract symbols to get domain values
        const symbols = this.symbolExtractor.extractSymbols(text);
        const domainValues = symbols.domains[domainContext.toLowerCase()];
        if (domainValues) {
          domainValues.forEach(v => suggestions.add(`'${v}'`));
        }
      }
    }
    
    // Add parameter names if context suggests it
    // Note: Don't add just because 'identifier' is expected - that's too broad
    const shouldSuggest = this.shouldSuggestParameters(textUpToCursor);
    
    // Debug output for testing
    if (process.env.DEBUG_AUTOCOMPLETE) {
      console.log('Debug autocomplete:', {
        textUpToCursor: textUpToCursor.slice(-50), // Last 50 chars
        shouldSuggest,
        hasIdentifier: singleTokens.includes('identifier'),
        singleTokens
      });
    }
    
    if (shouldSuggest) {
      try {
        // Extract symbols from the full document
        const symbols = this.symbolExtractor.extractSymbols(text);
        
        // If we have a partial word, filter parameters by prefix
        if (lastWord && lastWord.length > 0) {
          const filtered = symbols.parameters.filter(p => 
            p.toLowerCase().startsWith(lastWord.toLowerCase())
          );
          filtered.forEach(p => suggestions.add(p));
        } else {
          // Add all parameters if no partial word
          symbols.parameters.forEach(p => suggestions.add(p));
        }
      } catch (e) {
        // Ignore parse errors when extracting symbols
      }
    }
    
    return [...suggestions].sort();
  }
  
  /**
   * Prepare text for parsing by handling mid-line cursor positions
   * 
   * Strategy:
   * 1. If cursor is at end of text, use text as-is
   * 2. If cursor is in middle, find current token and replace with placeholder
   * 3. For empty positions, insert 'INVALID' to trigger parser error
   */
  private prepareTextForParsing(text: string, position: number): string {
    const textUpToCursor = text.substring(0, position);
    const textAfterCursor = text.substring(position);
    
    // If at end of document, just use text up to cursor
    if (textAfterCursor.trim() === '') {
      return textUpToCursor.trim() === '' ? 'INVALID' : textUpToCursor;
    }
    
    // Find the current token boundaries
    // Look backward for token start
    let tokenStart = position;
    while (tokenStart > 0 && /\w/.test(text[tokenStart - 1])) {
      tokenStart--;
    }
    
    // Look forward for token end
    let tokenEnd = position;
    while (tokenEnd < text.length && /\w/.test(text[tokenEnd])) {
      tokenEnd++;
    }
    
    // If we're in the middle of a token, replace it with a placeholder
    if (tokenStart < position || tokenEnd > position) {
      // Use 'PLACEHOLDER' which will trigger expected tokens at this position
      return text.substring(0, tokenStart) + 'PLACEHOLDER' + text.substring(tokenEnd);
    }
    
    // If between tokens, insert placeholder at cursor
    return text.substring(0, position) + 'PLACEHOLDER' + text.substring(position);
  }
  
  private parseAndGetError(text: string): string | null {
    try {
      const chars = new CharStream(text);
      const lexer = new RegelSpraakLexer(chars);
      
      // Capture lexer errors too
      let lexerError: string | null = null;
      class LexerErrorCapture extends ErrorListener<any> {
        syntaxError(
          recognizer: Recognizer<any>,
          offendingSymbol: any,
          line: number,
          column: number,
          msg: string,
          e: RecognitionException | undefined
        ): void {
          // Ignore token recognition errors
          if (!msg.includes('token recognition error')) {
            lexerError = msg;
          }
        }
      }
      
      lexer.removeErrorListeners();
      lexer.addErrorListener(new LexerErrorCapture());
      
      const tokens = new CommonTokenStream(lexer);
      const parser = new RegelSpraakParser(tokens);
      
      // Capture parser errors
      let parserError: string | null = null;
      
      class ParserErrorCapture extends ErrorListener<any> {
        syntaxError(
          recognizer: Recognizer<any>,
          offendingSymbol: any,
          line: number,
          column: number,
          msg: string,
          e: RecognitionException | undefined
        ): void {
          parserError = msg;
        }
      }
      
      parser.removeErrorListeners();
      parser.addErrorListener(new ParserErrorCapture());
      
      // Try to parse
      try {
        parser.regelSpraakDocument();
      } catch (e) {
        // Expected to fail
      }
      
      // Return parser error if available, otherwise lexer error
      return parserError || lexerError;
    } catch (e) {
      return null;
    }
  }
  
  private getLastPartialWord(text: string): string | null {
    // First check for partial multi-word phrase (e.g., "is gelijk")
    const lastLine = text.split('\n').pop() || '';
    const trimmed = lastLine.trim();
    
    // Check if we have multiple words that might be part of a multi-word keyword
    const words = trimmed.split(/\s+/);
    if (words.length >= 2) {
      // Try the last 2-3 words as a potential partial multi-word
      const twoWords = words.slice(-2).join(' ').toLowerCase();
      const threeWords = words.slice(-3).join(' ').toLowerCase();
      
      // Return the longer match if it could be a partial multi-word
      if (words.length >= 3 && this.couldBePartialMultiWord(threeWords)) {
        return threeWords;
      }
      if (this.couldBePartialMultiWord(twoWords)) {
        return twoWords;
      }
    }
    
    // Fall back to single word
    const match = text.match(/\b(\w+)$/);
    return match ? match[1].toLowerCase() : null;
  }
  
  private couldBePartialMultiWord(text: string): boolean {
    // Use the multi-word handler to check if this could be a partial
    return this.multiWordHandler.couldBePartialMultiWord(text);
  }
  
  private shouldSuggestParameters(text: string): boolean {
    // Suggest parameters after common patterns
    const patterns = [
      /indien\s+\w*$/i,        // After "indien" (with optional partial word)
      /geldig\s+indien\s+\w*$/i,  // After "geldig indien" (with optional partial)
      /\bde\s+\w*$/i,          // After "de" (could be "de salaris")
      /\bhet\s+\w*$/i,         // After "het"
      /\bvan\s+\w*$/i,         // After "van"
      /wordt\s+\w*$/i,         // After "wordt"
      /\+\s*\w*$/i,            // After "+" operator
      /\-\s*\w*$/i,            // After "-" operator
      /\*\s*\w*$/i,            // After "*" operator
      /\/\s*\w*$/i,            // After "/" operator
      /=\s*\w*$/i,             // After "=" assignment
    ];
    
    return patterns.some(p => p.test(text));
  }
  
  private getPartialMatches(partial: string): string[] {
    // Common RegelSpraak keywords
    const keywords = [
      'parameter', 'regel', 'feittype', 'objecttype', 'domein',
      'dimensie', 'eenheidsysteem', 'beslistabel', 'regelgroep',
      'consistentieregel', 'wederkerig', 'dagsoort',
      'is', 'een', 'de', 'het', 'van', 'met', 'als', 'dan',
      'indien', 'anders', 'waarde', 'tekst', 'datum', 'bedrag',
      'percentage', 'aantal', 'waar', 'onwaar', 'leeg'
    ];
    
    return keywords.filter(k => k.startsWith(partial));
  }
  
  /**
   * Determine if we're in a context that expects domain values
   * Returns the domain name if we should suggest its values, null otherwise
   */
  private getDomainContext(fullText: string, textUpToCursor: string): string | null {
    // 1. Inside domain definition - suggest more values
    const domainDefMatch = /Domein\s+(\w+)\s*\{[^}]*$/i.exec(textUpToCursor);
    if (domainDefMatch) {
      // We're inside a domain definition but don't know what values to suggest
      // Return a placeholder to suggest generic value format
      return '__DOMAIN_DEFINITION__';
    }
    
    // 2. After "is gelijk aan" with a domain-typed parameter
    // Extract parameter types first
    const paramTypes = this.extractParameterTypes(fullText);
    
    // Check if we're after a comparison operator with a parameter
    const patterns = [
      /(\w+)\s+is\s+gelijk\s+aan\s*$/i,
      /(\w+)\s+is\s*$/i,
      /indien\s+(\w+)\s+is\s+gelijk\s+aan\s*$/i,
      /indien\s+(\w+)\s+is\s*$/i,
    ];
    
    for (const pattern of patterns) {
      const match = pattern.exec(textUpToCursor);
      if (match) {
        const paramName = match[1].toLowerCase();
        const domainName = paramTypes[paramName];
        if (domainName) {
          return domainName;
        }
      }
    }
    
    // 3. In wanneer/case statement with domain parameter
    const wanneerMatch = /wanneer\s+(\w+)\s*$/i.exec(textUpToCursor);
    if (wanneerMatch) {
      const paramName = wanneerMatch[1].toLowerCase();
      const domainName = paramTypes[paramName];
      if (domainName) {
        return domainName;
      }
    }
    
    return null;
  }
  
  /**
   * Extract parameter types from the document
   * Returns a map of parameter name -> domain name
   */
  private extractParameterTypes(text: string): Record<string, string> {
    const types: Record<string, string> = {};
    
    // Pattern: Parameter <name>: <type>;
    // Type could be a domain name (not Numeriek, Tekst, etc.)
    const paramPattern = /Parameter\s+(\w+)\s*:\s*(\w+)/gi;
    let match;
    
    // First collect all standard types
    const standardTypes = new Set(['numeriek', 'tekst', 'bedrag', 'datum', 'boolean', 'percentage', 'aantal']);
    
    while ((match = paramPattern.exec(text)) !== null) {
      const paramName = match[1].toLowerCase();
      const typeName = match[2].toLowerCase();
      
      // If it's not a standard type, it might be a domain
      if (!standardTypes.has(typeName)) {
        types[paramName] = typeName;
      }
    }
    
    return types;
  }
  
  /**
   * Get detailed info about completions
   */
  getCompletionInfo(text: string, position: number): {
    suggestions: string[],
    errorMessage: string | null,
    lastWord: string | null
  } {
    const textUpToCursor = text.substring(0, position);
    const suggestions = this.getSuggestionsAt(text, position);
    const errorMessage = this.parseAndGetError(textUpToCursor);
    const lastWord = this.getLastPartialWord(textUpToCursor);
    
    return {
      suggestions,
      errorMessage,
      lastWord
    };
  }
}