import { CharStream, CommonTokenStream } from 'antlr4';
import RegelSpraakLexer from '../generated/antlr/RegelSpraakLexer';
import RegelSpraakParser from '../generated/antlr/RegelSpraakParser';
import { RegelSpraakVisitorImpl } from '../visitors/regelspraak-visitor-impl';
import { Expression } from '../ast/expressions';
import { Rule } from '../ast/rules';
import { DecisionTable } from '../ast/decision-tables';

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
    const chars = new CharStream(source);
    const lexer = new RegelSpraakLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new RegelSpraakParser(tokens);
    
    // Parse just an expression
    const tree = parser.expressie();
    
    return this.visitor.visit(tree);
  }

  /**
   * Parse a rule definition
   */
  parseRule(source: string): Rule {
    const chars = new CharStream(source);
    const lexer = new RegelSpraakLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new RegelSpraakParser(tokens);
    
    // Parse a regel definition
    const tree = parser.regelDefinition();
    
    return this.visitor.visit(tree);
  }
}