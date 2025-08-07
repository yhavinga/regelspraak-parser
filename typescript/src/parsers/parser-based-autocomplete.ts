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
    const suggestions = new Set<string>();
    
    // For empty input, add invalid token to force parser error
    // Use 'INVALID' which is lexed as IDENTIFIER but not valid at document start
    const textToParse = textUpToCursor.trim() === '' ? 'INVALID' : textUpToCursor;
    
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
    
    // Add parameter names if we see 'identifier' or context suggests it
    if (singleTokens.includes('identifier') || this.shouldSuggestParameters(textUpToCursor)) {
      try {
        // Extract symbols from the full document
        const symbols = this.symbolExtractor.extractSymbols(text);
        symbols.parameters.forEach(p => suggestions.add(p));
      } catch (e) {
        // Ignore parse errors when extracting symbols
      }
    }
    
    return [...suggestions].sort();
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
      /indien\s+$/i,        // After "indien"
      /geldig\s+indien\s+$/i,  // After "geldig indien"
      /\bde\s+$/i,          // After "de" (could be "de salaris")
      /\bhet\s+$/i,         // After "het"
      /\bvan\s+$/i,         // After "van"
      /wordt\s+$/i,         // After "wordt"
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