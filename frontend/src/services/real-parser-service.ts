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
    
    try {
      console.log('Parsing with real parser...', { codeLength: code.length });
      
      // Parse the code using the real ANTLR parser
      try {
        model = this.parser.parseModel(code);
        console.log('Parse successful, model:', model);
      } catch (parseError: any) {
        console.error('Parse error:', parseError);
        // ANTLR parse error
        const errorMessage = parseError.message || 'Syntax error';
        errors.push({
          message: errorMessage,
          severity: 'error',
          span: this.extractSpanFromError(errorMessage)
        });
      }
      
      // Only do semantic analysis if parsing succeeded
      if (model && errors.length === 0) {
        try {
          const validationResult = this.analyzer.analyze(model);
          console.log('Semantic analysis result:', validationResult);
          
          // Handle different possible return formats
          if (validationResult && validationResult.errors && Array.isArray(validationResult.errors)) {
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
    }
  }

  private extractSpanFromError(errorMessage: string): ParseError['span'] | undefined {
    // Try to extract line/column from ANTLR error messages like "line 5:25"
    const match = errorMessage.match(/line (\d+):(\d+)/);
    if (match) {
      const line = parseInt(match[1]);
      const column = parseInt(match[2]);
      return {
        start: { line, column },
        end: { line, column: column + 1 }
      };
    }
    return undefined;
  }

  async validate(code: string): Promise<ParseResult> {
    return this.parse(code);
  }
}

export const parserService = new RealParserService();