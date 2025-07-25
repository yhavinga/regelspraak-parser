import { AggregationExpression, Expression, VariableReference } from '../ast/expressions';

/**
 * Parser for RegelSpraak aggregation expressions
 */
export class AggregationParser {
  private input: string;
  private position: number = 0;

  constructor(input: string) {
    this.input = input;
  }

  /**
   * Parse aggregation expressions like:
   * - "de som van X, Y en Z"
   * - "het aantal personen"
   * - "de maximale waarde van alle bedragen"
   */
  parseAggregation(): AggregationExpression | null {
    this.skipWhitespace();
    
    // Try to match aggregation patterns
    const aggregationType = this.parseAggregationType();
    if (!aggregationType) {
      return null;
    }
    
    // Skip "van" if present
    this.skipWhitespace();
    if (this.matchWord('van')) {
      this.skipWhitespace();
    }
    
    // Parse target expressions
    const target = this.parseTarget();
    
    return {
      type: 'AggregationExpression',
      aggregationType,
      target
    };
  }

  private parseAggregationType(): 'som' | 'aantal' | 'maximum' | 'minimum' | 'eerste' | 'laatste' | null {
    const patterns = [
      { pattern: 'de som', type: 'som' as const },
      { pattern: 'het aantal', type: 'aantal' as const },
      { pattern: 'de maximale waarde', type: 'maximum' as const },
      { pattern: 'de minimale waarde', type: 'minimum' as const },
      { pattern: 'de eerste', type: 'eerste' as const },
      { pattern: 'de laatste', type: 'laatste' as const }
    ];
    
    for (const { pattern, type } of patterns) {
      if (this.match(pattern)) {
        return type;
      }
    }
    
    return null;
  }

  private parseTarget(): Expression | Expression[] {
    const expressions: Expression[] = [];
    
    // Parse first expression
    const expr = this.parseSimpleExpression();
    if (expr) {
      expressions.push(expr);
    }
    
    // Check for comma-separated list
    while (this.position < this.input.length) {
      this.skipWhitespace();
      
      if (this.matchChar(',')) {
        this.skipWhitespace();
        const nextExpr = this.parseSimpleExpression();
        if (nextExpr) {
          expressions.push(nextExpr);
        }
      } else if (this.matchWord('en')) {
        this.skipWhitespace();
        const lastExpr = this.parseSimpleExpression();
        if (lastExpr) {
          expressions.push(lastExpr);
        }
        break;
      } else {
        break;
      }
    }
    
    return expressions.length === 1 ? expressions[0] : expressions;
  }

  private parseSimpleExpression(): Expression | null {
    // For now, just parse variable references
    // In a full implementation, this would parse more complex expressions
    const start = this.position;
    
    while (this.position < this.input.length && 
           this.isLetter(this.input[this.position])) {
      this.position++;
    }
    
    if (this.position === start) {
      return null;
    }
    
    const name = this.input.substring(start, this.position);
    return {
      type: 'VariableReference',
      variableName: name
    } as VariableReference;
  }

  private match(pattern: string): boolean {
    const remaining = this.input.substring(this.position);
    if (remaining.toLowerCase().startsWith(pattern.toLowerCase())) {
      this.position += pattern.length;
      return true;
    }
    return false;
  }

  private matchWord(word: string): boolean {
    const remaining = this.input.substring(this.position);
    const pattern = new RegExp(`^${word}\\b`, 'i');
    const match = remaining.match(pattern);
    if (match) {
      this.position += match[0].length;
      return true;
    }
    return false;
  }

  private matchChar(char: string): boolean {
    if (this.input[this.position] === char) {
      this.position++;
      return true;
    }
    return false;
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length && 
           /\s/.test(this.input[this.position])) {
      this.position++;
    }
  }

  private isLetter(ch: string): boolean {
    return /[a-zA-Z]/.test(ch);
  }
}