// Simple parser service - we'll add Web Worker later for performance
// @ts-ignore - Using pre-built CommonJS modules
import AntlrParser from '@regelspraak/parser/dist/parsers/antlr-parser.js';
// @ts-ignore
import SemanticAnalyzer from '@regelspraak/parser/dist/semantic-analyzer.js';

export interface ParseError {
  message: string;
  severity: 'error' | 'warning';
  span?: any; // Simplified for now
}

export interface ParseResult {
  success: boolean;
  model?: any; // Simplified for now
  errors: ParseError[];
  warnings: ParseError[];
  parseTime: number;
}

class ParserService {
  private parser = new AntlrParser();
  private analyzer = new SemanticAnalyzer();

  async parse(code: string): Promise<ParseResult> {
    const startTime = performance.now();
    
    try {
      // Parse the code
      const model = this.parser.parseModel(code);
      
      // Perform semantic analysis
      const validationResult = this.analyzer.analyze(model);
      
      // Convert semantic errors
      const errors: ParseError[] = validationResult.errors.map(err => ({
        message: err.message,
        severity: 'error' as const,
        span: err.span
      }));
      
      return {
        success: errors.length === 0,
        model: errors.length === 0 ? model : undefined,
        errors,
        warnings: [],
        parseTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          message: error instanceof Error ? error.message : 'Unknown parse error',
          severity: 'error'
        }],
        warnings: [],
        parseTime: performance.now() - startTime
      };
    }
  }

  async validate(code: string): Promise<ParseResult> {
    // For now, same as parse but we could optimize later
    return this.parse(code);
  }
}

export const parserService = new ParserService();