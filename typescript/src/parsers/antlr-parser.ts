import { CharStream, CommonTokenStream, ErrorListener, RecognitionException, Recognizer } from 'antlr4';
import RegelSpraakLexer from '../generated/antlr/RegelSpraakLexer';
import RegelSpraakParser from '../generated/antlr/RegelSpraakParser';
import { RegelSpraakVisitorImpl } from '../visitors/regelspraak-visitor-impl';
import { Expression } from '../ast/expressions';
import { Rule } from '../ast/rules';
import { DecisionTable } from '../ast/decision-tables';

/**
 * Custom error listener to capture parse errors
 */
class CustomErrorListener extends ErrorListener<any> {
  private errors: string[] = [];

  syntaxError(recognizer: Recognizer<any>, offendingSymbol: any, line: number, column: number, msg: string, e: RecognitionException | undefined): void {
    this.errors.push(`line ${line}:${column} ${msg}`);
  }

  getErrors(): string[] {
    return this.errors;
  }
}

/**
 * Parser service using ANTLR4-generated parser
 */
export class AntlrParser {
  private visitor = new RegelSpraakVisitorImpl();

  /**
   * Parse RegelSpraak source code
   */
  parse(source: string): any {
    const chars = new CharStream(source);
    const lexer = new RegelSpraakLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new RegelSpraakParser(tokens);
    
    // Parse starting from the root rule
    const tree = parser.regelSpraakDocument();
    
    // Visit the tree to build our AST
    return this.visitor.visit(tree);
  }

  /**
   * Parse just an expression
   */
  parseExpression(source: string): Expression {
    try {
      const chars = new CharStream(source);
      const lexer = new RegelSpraakLexer(chars);
      const tokens = new CommonTokenStream(lexer);
      const parser = new RegelSpraakParser(tokens);
      
      // Parse just an expression
      const tree = parser.expressie();
      
      if (!tree) {
        throw new Error('Failed to parse expression: parser returned null');
      }
      
      return this.visitor.visit(tree);
    } catch (error) {
      // Don't add "Parse error: " prefix for specific error messages
      if (error instanceof Error && 
          (error.message === 'Expected "geldig" keyword' ||
           error.message.includes('Expected gelijkstelling pattern'))) {
        throw error;
      }
      throw new Error(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse a rule definition
   */
  parseRule(source: string): Rule {
    try {
      const chars = new CharStream(source);
      const lexer = new RegelSpraakLexer(chars);
      const tokens = new CommonTokenStream(lexer);
      const parser = new RegelSpraakParser(tokens);
      
      // Set up custom error listener
      const errorListener = new CustomErrorListener();
      parser.removeErrorListeners();
      parser.addErrorListener(errorListener);
      
      // Parse a regel (rule definition)
      const tree = parser.regel();
      
      // Check for parse errors
      const errors = errorListener.getErrors();
      if (errors.length > 0) {
        const firstError = errors[0];
        // Map ANTLR errors to user-friendly messages
        if (firstError.includes("expecting 'geldig'") || 
            (firstError.includes("no viable alternative") && !source.includes('geldig'))) {
          throw new Error('Expected "geldig" keyword');
        }
        if (firstError.includes("mismatched input 'is'") || 
            firstError.includes("expecting 'wordt")) {
          throw new Error('Expected gelijkstelling pattern (moet berekend worden als)');
        }
        throw new Error(firstError);
      }
      
      if (!tree) {
        throw new Error('Failed to parse rule: parser returned null');
      }
      
      return this.visitor.visit(tree);
    } catch (error) {
      // Don't add "Parse error: " prefix for specific error messages
      if (error instanceof Error && 
          (error.message === 'Expected "geldig" keyword' ||
           error.message.includes('Expected gelijkstelling pattern'))) {
        throw error;
      }
      throw new Error(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}