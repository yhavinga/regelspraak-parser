// Simplified parser service - no direct imports to avoid ESM/CJS issues
export interface ParseError {
  message: string;
  severity: 'error' | 'warning';
  line?: number;
  column?: number;
}

export interface ParseResult {
  success: boolean;
  model?: any;
  errors: ParseError[];
  warnings: ParseError[];
  parseTime: number;
}

class ParserService {
  async parse(code: string): Promise<ParseResult> {
    const startTime = performance.now();
    
    try {
      // For now, just do basic validation
      // We'll add real parser integration in the next iteration
      const errors: ParseError[] = [];
      
      // Simple validation rules
      if (!code.trim()) {
        errors.push({
          message: 'Empty document',
          severity: 'warning'
        });
      }
      
      // Check for basic syntax patterns
      const lines = code.split('\n');
      lines.forEach((line, index) => {
        // Check for unterminated statements
        if (line.trim() && !line.trim().endsWith(';') && !line.trim().endsWith(':') && 
            !line.includes('//') && line.trim() !== '' && !line.trim().startsWith('indien')) {
          // This is a very simple check - the real parser will do better
          if (line.includes('Objecttype') || line.includes('Parameter') || line.includes('Regel')) {
            // These don't need semicolons
          } else if (index === lines.length - 1 || (index < lines.length - 1 && lines[index + 1].trim() === '')) {
            errors.push({
              message: 'Statement may be missing semicolon',
              severity: 'warning',
              line: index + 1,
              column: line.length
            });
          }
        }
      });
      
      // Mock AST for testing
      const model = errors.length === 0 ? {
        objectTypes: new Map(),
        parameters: new Map(),
        rules: [],
        domains: new Map()
      } : undefined;
      
      return {
        success: errors.length === 0,
        model,
        errors,
        warnings: [],
        parseTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          message: error instanceof Error ? error.message : 'Unknown error',
          severity: 'error'
        }],
        warnings: [],
        parseTime: performance.now() - startTime
      };
    }
  }

  async validate(code: string): Promise<ParseResult> {
    return this.parse(code);
  }
}

export const parserService = new ParserService();