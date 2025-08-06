import { CharStream, CommonTokenStream, ErrorListener, RecognitionException, Recognizer } from 'antlr4';
import RegelSpraakLexer from '../generated/antlr/RegelSpraakLexer';
import RegelSpraakParser from '../generated/antlr/RegelSpraakParser';
import { RegelSpraakVisitorImpl } from '../visitors/regelspraak-visitor-impl';
import { Expression } from '../ast/expressions';
import { Rule } from '../ast/rules';
import { DecisionTable } from '../ast/decision-tables';
import { ObjectTypeDefinition } from '../ast/object-types';
import { ParameterDefinition } from '../ast/parameters';
import { DomainModel } from '../ast/domain-model';
import { LocationMap } from '../ast/location';
import { SimpleAutocompleteService } from './simple-autocomplete';
import { ParserBasedAutocompleteService } from './parser-based-autocomplete';

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
export interface ParseResult {
  model: DomainModel;
  locationMap: LocationMap;
}

export class AntlrParser {

  /**
   * Parse RegelSpraak source code and return array of definitions (backward compatibility)
   */
  parse(source: string): any {
    const model = this.parseModel(source);
    
    // Convert DomainModel back to array for backward compatibility
    const results = [];
    
    // Add object types
    for (const objectType of model.objectTypes) {
      results.push(objectType);
    }
    
    // Add parameters
    for (const param of model.parameters) {
      results.push(param);
    }
    
    // Add dimensions
    for (const dimension of model.dimensions) {
      results.push(dimension);
    }
    
    // Add rules
    for (const regel of model.regels) {
      results.push(regel);
    }
    
    // Add regel groups
    for (const regelGroep of model.regelGroepen) {
      results.push(regelGroep);
    }
    
    // Add decision tables
    for (const beslistabel of model.beslistabels) {
      results.push(beslistabel);
    }
    
    // Add domains
    for (const domain of model.domains) {
      results.push(domain);
    }
    
    // Add feit types
    for (const feitType of model.feitTypes) {
      results.push(feitType);
    }
    
    // Add unit systems
    for (const unitSystem of model.unitSystems) {
      results.push(unitSystem);
    }
    
    return results;
  }

  /**
   * Parse RegelSpraak source code and return both model and location map
   */
  parseWithLocations(source: string): ParseResult {
    const chars = new CharStream(source);
    const lexer = new RegelSpraakLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new RegelSpraakParser(tokens);
    
    // Set up custom error listener
    const errorListener = new CustomErrorListener();
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    
    // Parse starting from the root rule
    const tree = parser.regelSpraakDocument();
    
    // Check for parse errors
    const errors = errorListener.getErrors();
    if (errors.length > 0) {
      const firstError = errors[0];
      throw new Error(firstError);
    }
    
    // Visit the tree to build our AST
    try {
      const visitor = new RegelSpraakVisitorImpl();
      const model = visitor.visit(tree);
      const locationMap = visitor.getLocationMap();
      return { model, locationMap };
    } catch (error) {
      console.error('Visitor error:', error);
      console.error('Stack:', (error as Error).stack);
      throw error;
    }
  }

  /**
   * Parse RegelSpraak source code and return a DomainModel
   */
  parseModel(source: string): DomainModel {
    const chars = new CharStream(source);
    const lexer = new RegelSpraakLexer(chars);
    const tokens = new CommonTokenStream(lexer);
    const parser = new RegelSpraakParser(tokens);
    
    // Set up custom error listener
    const errorListener = new CustomErrorListener();
    parser.removeErrorListeners();
    parser.addErrorListener(errorListener);
    
    // Parse starting from the root rule
    const tree = parser.regelSpraakDocument();
    
    // Check for parse errors
    const errors = errorListener.getErrors();
    if (errors.length > 0) {
      const firstError = errors[0];
      throw new Error(firstError);
    }
    
    // Visit the tree to build our AST
    try {
      const visitor = new RegelSpraakVisitorImpl();
      return visitor.visit(tree);
    } catch (error) {
      console.error('Visitor error:', error);
      console.error('Stack:', (error as Error).stack);
      throw error;
    }
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
      
      // Set up custom error listener
      const errorListener = new CustomErrorListener();
      parser.removeErrorListeners();
      parser.addErrorListener(errorListener);
      
      // Parse just an expression
      const tree = parser.expressie();
      
      // Check for parse errors
      const errors = errorListener.getErrors();
      if (errors.length > 0) {
        const firstError = errors[0];
        // Map ANTLR errors to user-friendly messages
        if (firstError.includes('no viable alternative') && source.includes('de wortel van')) {
          throw new Error('Missing argument for "de wortel van"');
        }
        if (firstError.includes('no viable alternative') && source.includes('de absolute waarde van')) {
          throw new Error('Missing argument for "de absolute waarde van"');
        }
        throw new Error(firstError);
      }
      
      // Check if there's unparsed input (multiple arguments)
      const currentToken = parser.getCurrentToken();
      if (currentToken && currentToken.type !== RegelSpraakParser.EOF) {
        // Check specific patterns for better error messages
        if (source.includes('de wortel van') && currentToken.text === ',') {
          throw new Error('Multiple arguments not supported for "de wortel van"');
        }
        if (source.includes('de absolute waarde van') && currentToken.text === ',') {
          throw new Error('Multiple arguments not supported for "de absolute waarde van"');
        }
        // Generic error for other cases
        throw new Error(`Unexpected input after expression: ${currentToken.text}`);
      }
      
      if (!tree) {
        throw new Error('Failed to parse expression: parser returned null');
      }
      
      const visitor = new RegelSpraakVisitorImpl();
      return visitor.visit(tree);
    } catch (error) {
      // Don't add "Parse error: " prefix for specific error messages
      if (error instanceof Error && 
          (error.message === 'Expected "geldig" keyword' ||
           error.message.includes('Expected gelijkstelling pattern') ||
           error.message.includes('Missing argument for') ||
           error.message.includes('Multiple arguments not supported'))) {
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
      
      const visitor = new RegelSpraakVisitorImpl();
      return visitor.visit(tree);
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
   * Parse an object type definition
   */
  parseObjectType(source: string): ObjectTypeDefinition {
    try {
      const chars = new CharStream(source);
      const lexer = new RegelSpraakLexer(chars);
      const tokens = new CommonTokenStream(lexer);
      const parser = new RegelSpraakParser(tokens);
      
      // Set up custom error listener
      const errorListener = new CustomErrorListener();
      parser.removeErrorListeners();
      parser.addErrorListener(errorListener);
      
      // Parse an objectTypeDefinition
      const tree = parser.objectTypeDefinition();
      
      // Check for parse errors
      const errors = errorListener.getErrors();
      if (errors.length > 0) {
        throw new Error(errors[0]);
      }
      
      if (!tree) {
        throw new Error('Failed to parse object type: parser returned null');
      }
      
      const visitor = new RegelSpraakVisitorImpl();
      return visitor.visit(tree);
    } catch (error) {
      throw new Error(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse a parameter definition
   */
  parseParameter(source: string): ParameterDefinition {
    try {
      const chars = new CharStream(source);
      const lexer = new RegelSpraakLexer(chars);
      const tokens = new CommonTokenStream(lexer);
      const parser = new RegelSpraakParser(tokens);
      
      // Set up custom error listener
      const errorListener = new CustomErrorListener();
      parser.removeErrorListeners();
      parser.addErrorListener(errorListener);
      
      // Parse a parameterDefinition
      const tree = parser.parameterDefinition();
      
      // Check for parse errors
      const errors = errorListener.getErrors();
      if (errors.length > 0) {
        throw new Error(errors[0]);
      }
      
      if (!tree) {
        throw new Error('Failed to parse parameter: parser returned null');
      }
      
      const visitor = new RegelSpraakVisitorImpl();
      return visitor.visit(tree);
    } catch (error) {
      throw new Error(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse a decision table (beslistabel)
   */
  parseDecisionTable(source: string): DecisionTable {
    try {
      const chars = new CharStream(source);
      const lexer = new RegelSpraakLexer(chars);
      const tokens = new CommonTokenStream(lexer);
      const parser = new RegelSpraakParser(tokens);
      
      // Set up custom error listener
      const errorListener = new CustomErrorListener();
      parser.removeErrorListeners();
      parser.addErrorListener(errorListener);
      
      // Parse a beslistabel
      const tree = parser.beslistabel();
      
      // Check for parse errors
      const errors = errorListener.getErrors();
      if (errors.length > 0) {
        throw new Error(errors[0]);
      }
      
      if (!tree) {
        throw new Error('Failed to parse decision table: parser returned null');
      }
      
      const visitor = new RegelSpraakVisitorImpl();
      return visitor.visit(tree);
    } catch (error) {
      throw new Error(`Parse error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get expected tokens at a specific position in the text.
   * 
   * This uses a simple context-based approach. For production use with full
   * parser-based autocomplete, consider implementing antlr4-c3 properly or
   * using the ANTLR4 getExpectedTokens() with an active parse context.
   */
  getExpectedTokensAt(text: string, position: number): string[] {
    // Get parser-based suggestions (from error messages)
    const parserService = new ParserBasedAutocompleteService();
    const parserSuggestions = parserService.getSuggestionsAt(text, position);
    
    // Also get simple pattern-based suggestions for richer completions
    const simpleService = new SimpleAutocompleteService();
    const simpleSuggestions = simpleService.getSuggestionsAt(text, position);
    
    // Combine and deduplicate
    const allSuggestions = new Set([...parserSuggestions, ...simpleSuggestions]);
    return [...allSuggestions].sort();
  }

  /**
   * Convert ANTLR token information to readable Dutch text for autocomplete
   */
  private tokenToReadableString(tokenType: number, literal: string | null, symbolic: string | null): string {
    // Skip EOF token
    if (tokenType === RegelSpraakParser.EOF) {
      return '';
    }
    
    // Process literal tokens (actual text from grammar)
    if (literal) {
      // Remove surrounding quotes
      const clean = literal.replace(/^'|'$/g, '');
      
      // Skip meta-annotations and empty strings
      if (clean.startsWith('(') && clean.endsWith(')')) {
        return '';
      }
      if (!clean || clean === 'EOF') {
        return '';
      }
      
      return clean;
    }
    
    // Process symbolic tokens (named tokens like IDENTIFIER)
    if (symbolic) {
      // Skip internal ANTLR tokens
      if (symbolic.startsWith('T__')) {
        return '';
      }
      
      // Skip whitespace and comment tokens
      if (symbolic === 'WS' || symbolic === 'NEWLINE' || 
          symbolic === 'COMMENT' || symbolic === 'LINE_COMMENT') {
        return '';
      }
      
      // Provide placeholders for value tokens
      if (symbolic === 'IDENTIFIER') return '<naam>';
      if (symbolic === 'NUMBER') return '<getal>';
      if (symbolic === 'STRING') return '<tekst>';
      
      // For other symbolic names, we'd need a proper mapping
      // This would be expanded based on the actual grammar
      return '';
    }
    
    return '';
  }
}