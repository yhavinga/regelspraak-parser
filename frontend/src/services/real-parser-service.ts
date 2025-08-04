// Real parser service using the browser bundles
import { AntlrParser } from '../lib/parser/bundles/parser.js';
import { SemanticAnalyzer } from '../lib/parser/bundles/analyzer.js';

export interface ParseError {
  message: string;
  severity: 'error' | 'warning';
  span?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface ParseResult {
  success: boolean;
  model?: any;
  errors: ParseError[];
  warnings: ParseError[];
  parseTime: number;
}

class RealParserService {
  private parser = new AntlrParser();
  private analyzer = new SemanticAnalyzer();

  async parse(code: string): Promise<ParseResult> {
    const startTime = performance.now();
    const errors: ParseError[] = [];
    let model: any = null;
    
    // Capture console errors during parsing
    const consoleErrors: string[] = [];
    const originalError = console.error;
    console.error = (...args: any[]) => {
      // Still log to console
      originalError.apply(console, args);
      // Capture ANTLR parse errors
      const message = args[0];
      if (typeof message === 'string' && message.includes('line ') && message.includes(':')) {
        consoleErrors.push(message);
        console.log('Captured ANTLR error:', message);
      }
    };
    
    try {
      console.log('Parsing with real parser...', { codeLength: code.length });
      console.log('Code to parse:', code);
      console.log('Code lines:', code.split('\n').map((line, i) => `${i+1}: ${line}`));
      
      // Parse the code using the real ANTLR parser
      try {
        model = this.parser.parseModel(code);
        console.log('Parse successful, model:', model);
      } catch (parseError: any) {
        console.error('Parse error:', parseError);
        // ANTLR parse error
        const errorMessage = parseError.message || 'Syntax error';
        const span = this.extractSpanFromError(errorMessage);
        
        // Clean up the error message for display
        let cleanMessage = errorMessage;
        // Remove the "line X:Y" prefix since we're showing it visually
        cleanMessage = cleanMessage.replace(/^line \d+:\d+\s*/, '');
        
        errors.push({
          message: cleanMessage,
          severity: 'error',
          span: span
        });
        
        // If we got a span, we should stop here and return the syntax error
        if (span) {
          return {
            success: false,
            errors,
            warnings: [],
            parseTime: performance.now() - startTime
          };
        }
      }
      
      // Only do semantic analysis if parsing succeeded
      if (model && errors.length === 0) {
        try {
          const validationResult = this.analyzer.analyze(model);
          console.log('Semantic analysis result:', validationResult);
          
          // Handle different possible return formats
          // The semantic analyzer returns errors as an array directly
          if (Array.isArray(validationResult)) {
            validationResult.forEach((err: any) => {
              if (typeof err === 'string') {
                // Simple string error
                errors.push({
                  message: err,
                  severity: 'error'
                });
              } else if (err && err.message) {
                // Error object with message
                errors.push({
                  message: err.message,
                  severity: 'error',
                  span: err.span || err.location || null
                });
              }
            });
          } else if (validationResult && validationResult.errors && Array.isArray(validationResult.errors)) {
            // Error object with errors array
            validationResult.errors.forEach((err: any) => {
              errors.push({
                message: err.message || 'Semantic error',
                severity: 'error',
                span: err.span || err.location || null
              });
            });
          }
        } catch (semError: any) {
          console.error('Semantic analysis error:', semError);
          // Skip semantic analysis errors for now
        }
      }
      
      // Always add console errors that have span information
      console.log('Checking console errors:', { errorsLength: errors.length, consoleErrorsLength: consoleErrors.length });
      if (consoleErrors.length > 0) {
        console.log('Processing console errors:', consoleErrors);
        // Add ANTLR errors to the beginning since they're usually more specific
        const antlrErrors: ParseError[] = [];
        for (const consoleError of consoleErrors) {
          const span = this.extractSpanFromError(consoleError);
          if (span) {
            let cleanMessage = consoleError;
            // Remove the "line X:Y" prefix
            cleanMessage = cleanMessage.replace(/^line \d+:\d+\s*/, '');
            antlrErrors.push({
              message: cleanMessage,
              severity: 'error',
              span: span
            });
          }
        }
        // Prepend ANTLR errors
        if (antlrErrors.length > 0) {
          errors.unshift(...antlrErrors);
        }
      }
      
      const parseTime = performance.now() - startTime;
      console.log('Parse completed in', parseTime, 'ms with', errors.length, 'errors');
      
      return {
        success: errors.length === 0,
        model: errors.length === 0 ? model : undefined,
        errors,
        warnings: [],
        parseTime
      };
    } catch (error: any) {
      console.error('Parse error:', error);
      
      // Handle parse errors
      const errorMessage = error.message || 'Unknown parse error';
      const errors: ParseError[] = [{
        message: errorMessage,
        severity: 'error'
      }];
      
      // Try to extract line/column info from ANTLR errors
      const match = errorMessage.match(/line (\d+):(\d+)/);
      if (match) {
        errors[0].span = {
          start: { line: parseInt(match[1]), column: parseInt(match[2]) },
          end: { line: parseInt(match[1]), column: parseInt(match[2]) + 1 }
        };
      }
      
      return {
        success: false,
        errors,
        warnings: [],
        parseTime: performance.now() - startTime
      };
    } finally {
      // Restore original console.error
      console.error = originalError;
    }
  }

  private extractSpanFromError(errorMessage: string): ParseError['span'] | undefined {
    // Try to extract line/column from ANTLR error messages like "line 5:25"
    const match = errorMessage.match(/line (\d+):(\d+)/);
    if (match) {
      const line = parseInt(match[1]);
      const column = parseInt(match[2]);
      console.log('Extracted span from error:', { line, column, message: errorMessage });
      
      // For better squiggle visibility, extend the end position based on the error type
      let endColumn = column + 10; // Default extension
      
      // If it's a token recognition error, usually just one character
      if (errorMessage.includes('token recognition error')) {
        endColumn = column + 1;
      }
      // If it's a missing/mismatched token, try to be more precise
      else if (errorMessage.includes('mismatched input') || errorMessage.includes('expecting')) {
        // Try to extract the problematic token
        const tokenMatch = errorMessage.match(/mismatched input '([^']+)'/);
        if (tokenMatch) {
          endColumn = column + tokenMatch[1].length;
        }
      }
      
      return {
        start: { line, column },
        end: { line, column: endColumn }
      };
    }
    console.log('No span extracted from error:', errorMessage);
    return undefined;
  }

  async validate(code: string): Promise<ParseResult> {
    return this.parse(code);
  }
}

export const parserService = new RealParserService();