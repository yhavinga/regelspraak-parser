// Mock parser for testing UI - will be replaced with real parser integration
export interface ParseError {
  message: string;
  severity: 'error' | 'warning';
  line?: number;
  column?: number;
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

class MockParser {
  async parse(code: string): Promise<ParseResult> {
    const startTime = performance.now();
    const errors: ParseError[] = [];
    
    // Basic syntax checking
    const lines = code.split('\n');
    
    // Check for common RegelSpraak patterns and errors
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Check for missing semicolons on attribute definitions
      if (trimmed.match(/^\s*de\s+\w+\s+\w+\s*$/)) {
        errors.push({
          message: 'Missing semicolon after attribute definition',
          severity: 'error',
          line: index + 1,
          column: line.length,
          span: {
            start: { line: index + 1, column: 0 },
            end: { line: index + 1, column: line.length }
          }
        });
      }
      
      // Check for unknown object types in rules
      if (trimmed.includes('OnbekendType')) {
        const col = line.indexOf('OnbekendType');
        errors.push({
          message: 'Unknown object type: OnbekendType',
          severity: 'error',
          line: index + 1,
          column: col,
          span: {
            start: { line: index + 1, column: col },
            end: { line: index + 1, column: col + 'OnbekendType'.length }
          }
        });
      }
    });
    
    // Mock AST if no errors
    const model = errors.length === 0 ? {
      objectTypes: new Map([
        ['Persoon', { 
          name: 'Persoon',
          attributes: new Map([
            ['naam', { name: 'naam', type: 'Tekst' }],
            ['leeftijd', { name: 'leeftijd', type: 'Numeriek', unit: 'jr' }]
          ])
        }]
      ]),
      parameters: new Map([
        ['pensioenleeftijd', {
          name: 'pensioenleeftijd',
          type: 'Numeriek',
          unit: 'jr'
        }]
      ]),
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
  }

  async validate(code: string): Promise<ParseResult> {
    return this.parse(code);
  }
}

export const parserService = new MockParser();