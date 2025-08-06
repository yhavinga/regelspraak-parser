import { CharStream, CommonTokenStream, ErrorListener, RecognitionException, Recognizer, Token } from 'antlr4';
import RegelSpraakLexer from '../generated/antlr/RegelSpraakLexer';
import RegelSpraakParser from '../generated/antlr/RegelSpraakParser';

/**
 * Parser-based autocomplete that uses error messages to extract expected tokens
 * 
 * This is a pragmatic approach that works around ANTLR4 JS limitations:
 * - getExpectedTokens() requires active parser context
 * - Parser context is cleared after parse completes
 * - Error messages contain the expected tokens
 */
export class ParserBasedAutocompleteService {
  
  /**
   * Get suggestions by parsing incomplete input and extracting from error messages
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
    const match = text.match(/\b(\w+)$/);
    return match ? match[1].toLowerCase() : null;
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