import { IEngine, ParseResult, RuntimeContext, ExecutionResult } from '../interfaces';
import { Context } from '../runtime/context';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { Expression, NumberLiteral, BinaryExpression, VariableReference } from '../ast/expressions';

/**
 * Main RegelSpraak engine
 */
export class Engine implements IEngine {
  private expressionEvaluator = new ExpressionEvaluator();

  parse(source: string): ParseResult {
    const trimmed = source.trim();
    const parser = new ExpressionParser(trimmed);
    
    try {
      const ast = parser.parseExpression();
      return {
        success: true,
        ast
      };
    } catch (error) {
      return {
        success: false,
        errors: [{
          line: 1,
          column: parser.position,
          message: error instanceof Error ? error.message : 'Parse error'
        }]
      };
    }
  }

  execute(program: any, context?: RuntimeContext): ExecutionResult {
    const ctx = context || new Context();
    
    try {
      const value = this.expressionEvaluator.evaluate(program, ctx);
      return {
        success: true,
        value
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error
      };
    }
  }

  run(source: string, context?: RuntimeContext): ExecutionResult {
    const parseResult = this.parse(source);
    
    if (!parseResult.success) {
      return {
        success: false,
        error: new Error(parseResult.errors![0].message)
      };
    }

    return this.execute(parseResult.ast!, context);
  }
}

/**
 * Simple recursive descent parser for expressions
 */
class ExpressionParser {
  private input: string;
  position: number = 0;

  constructor(input: string) {
    this.input = input;
  }

  parseExpression(): Expression {
    return this.parseAdditive();
  }

  // Handle + and - (lower precedence)
  private parseAdditive(): Expression {
    let left = this.parseMultiplicative();

    while (this.position < this.input.length) {
      this.skipWhitespace();
      const ch = this.input[this.position];
      
      if (ch === '+' || ch === '-') {
        this.position++;
        const operator = ch as '+' | '-';
        const right = this.parseMultiplicative();
        left = {
          type: 'BinaryExpression',
          operator,
          left,
          right
        } as BinaryExpression;
      } else {
        break;
      }
    }

    return left;
  }

  // Handle * and / (higher precedence)
  private parseMultiplicative(): Expression {
    let left = this.parsePrimary();

    while (this.position < this.input.length) {
      this.skipWhitespace();
      const ch = this.input[this.position];
      
      if (ch === '*' || ch === '/') {
        this.position++;
        const operator = ch as '*' | '/';
        const right = this.parsePrimary();
        left = {
          type: 'BinaryExpression',
          operator,
          left,
          right
        } as BinaryExpression;
      } else {
        break;
      }
    }

    return left;
  }

  // Parse primary expressions (numbers, parentheses)
  private parsePrimary(): Expression {
    this.skipWhitespace();

    // Handle parentheses
    if (this.input[this.position] === '(') {
      this.position++;
      const expr = this.parseExpression();
      this.skipWhitespace();
      if (this.input[this.position] !== ')') {
        throw new Error('Expected closing parenthesis');
      }
      this.position++;
      return expr;
    }

    // Try to parse identifier first
    if (this.isLetter(this.input[this.position])) {
      return this.parseIdentifier();
    }

    // Parse number
    const start = this.position;
    let hasDigit = false;
    
    // Optional negative sign
    if (this.input[this.position] === '-') {
      this.position++;
    }

    // Integer part
    while (this.position < this.input.length && 
           this.input[this.position] >= '0' && 
           this.input[this.position] <= '9') {
      hasDigit = true;
      this.position++;
    }

    // Decimal part
    if (this.position < this.input.length && this.input[this.position] === '.') {
      this.position++;
      while (this.position < this.input.length && 
             this.input[this.position] >= '0' && 
             this.input[this.position] <= '9') {
        hasDigit = true;
        this.position++;
      }
    }

    if (!hasDigit) {
      throw new Error(`Unexpected character: ${this.input[this.position] || 'EOF'}`);
    }

    const value = parseFloat(this.input.substring(start, this.position));
    return {
      type: 'NumberLiteral',
      value
    } as NumberLiteral;
  }

  private skipWhitespace(): void {
    while (this.position < this.input.length && 
           (this.input[this.position] === ' ' || 
            this.input[this.position] === '\t' || 
            this.input[this.position] === '\n' || 
            this.input[this.position] === '\r')) {
      this.position++;
    }
  }

  private parseIdentifier(): Expression {
    const start = this.position;
    
    // First character must be letter
    if (!this.isLetter(this.input[this.position])) {
      throw new Error(`Expected identifier at position ${this.position}`);
    }
    
    // Continue with letters, digits, underscore
    while (this.position < this.input.length && 
           (this.isLetter(this.input[this.position]) || 
            this.isDigit(this.input[this.position]) || 
            this.input[this.position] === '_')) {
      this.position++;
    }
    
    const variableName = this.input.substring(start, this.position);
    return {
      type: 'VariableReference',
      variableName
    } as VariableReference;
  }

  private isLetter(ch: string): boolean {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
  }

  private isDigit(ch: string): boolean {
    return ch >= '0' && ch <= '9';
  }
}