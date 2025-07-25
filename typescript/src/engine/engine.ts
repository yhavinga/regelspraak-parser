import { IEngine, ParseResult, RuntimeContext, ExecutionResult } from '../interfaces';
import { Context } from '../runtime/context';
import { ExpressionEvaluator } from '../evaluators/expression-evaluator';
import { Expression, NumberLiteral, BinaryExpression, VariableReference, FunctionCall } from '../ast/expressions';
import { RuleParser } from '../parsers/rule-parser';
import { RuleExecutor } from '../executors/rule-executor';
import { DecisionTableParser } from '../parsers/decision-table-parser';
import { DecisionTableExecutor } from '../executors/decision-table-executor';

/**
 * Main RegelSpraak engine
 */
export class Engine implements IEngine {
  private expressionEvaluator = new ExpressionEvaluator();
  private ruleExecutor = new RuleExecutor();
  private decisionTableExecutor = new DecisionTableExecutor();

  parse(source: string): ParseResult {
    const trimmed = source.trim();
    
    try {
      // Check if this is a rule, decision table, or just an expression
      if (trimmed.startsWith('Regel ')) {
        const ruleParser = new RuleParser(trimmed);
        const ast = ruleParser.parseRule();
        return {
          success: true,
          ast
        };
      } else if (trimmed.startsWith('Beslistabel ')) {
        const dtParser = new DecisionTableParser(trimmed);
        const ast = dtParser.parseDecisionTable();
        return {
          success: true,
          ast
        };
      } else {
        // Parse as expression
        const parser = new ExpressionParser(trimmed);
        const ast = parser.parseExpression();
        return {
          success: true,
          ast
        };
      }
    } catch (error) {
      return {
        success: false,
        errors: [{
          line: 1,
          column: 0, // TODO: track position properly
          message: error instanceof Error ? error.message : 'Parse error'
        }]
      };
    }
  }

  execute(program: any, context?: RuntimeContext): ExecutionResult {
    const ctx = context || new Context();
    
    try {
      // Check if this is a rule, decision table, or expression
      if (program.type === 'Rule') {
        const result = this.ruleExecutor.execute(program, ctx);
        if (result.success && result.value) {
          return {
            success: true,
            value: result.value
          };
        } else {
          return {
            success: false,
            error: result.error || new Error('Rule execution failed')
          };
        }
      } else if (program.type === 'DecisionTable') {
        const result = this.decisionTableExecutor.execute(program, ctx);
        if (result.success && result.value) {
          return {
            success: true,
            value: result.value
          };
        } else {
          return {
            success: false,
            error: result.error || new Error('Decision table execution failed')
          };
        }
      } else {
        // Execute as expression
        const value = this.expressionEvaluator.evaluate(program, ctx);
        return {
          success: true,
          value
        };
      }
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
    
    const name = this.input.substring(start, this.position);
    
    // Check if this is a function call
    this.skipWhitespace();
    if (this.position < this.input.length && this.input[this.position] === '(') {
      this.position++; // consume '('
      const args: Expression[] = [];
      
      this.skipWhitespace();
      
      // Parse arguments
      if (this.input[this.position] !== ')') {
        args.push(this.parseExpression());
        
        while (this.position < this.input.length) {
          this.skipWhitespace();
          if (this.input[this.position] === ',') {
            this.position++; // consume ','
            this.skipWhitespace();
            args.push(this.parseExpression());
          } else {
            break;
          }
        }
      }
      
      this.skipWhitespace();
      if (this.input[this.position] !== ')') {
        throw new Error('Expected closing parenthesis in function call');
      }
      this.position++; // consume ')'
      
      return {
        type: 'FunctionCall',
        functionName: name,
        arguments: args
      } as FunctionCall;
    }
    
    // Just a variable reference
    return {
      type: 'VariableReference',
      variableName: name
    } as VariableReference;
  }

  private isLetter(ch: string): boolean {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z');
  }

  private isDigit(ch: string): boolean {
    return ch >= '0' && ch <= '9';
  }
}