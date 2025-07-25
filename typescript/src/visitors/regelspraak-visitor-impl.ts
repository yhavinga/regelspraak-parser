import { ParseTreeVisitor } from 'antlr4';
import RegelSpraakVisitor from '../generated/antlr/RegelSpraakVisitor';
import RegelSpraakParser, {
  RegelSpraakDocumentContext,
  RegelContext,
  ExpressieContext,
  LogicalExprContext,
  BinaryComparisonExprContext,
  AdditiveExpressionContext,
  MultiplicativeExpressionContext,
  PowerExpressionContext,
  PrimaryExpressionContext,
  NumberLiteralExprContext,
  IdentifierExprContext,
  ParenExprContext,
  IdentifierContext,
  UnaryNietExprContext,
  UnaryMinusExprContext
} from '../generated/antlr/RegelSpraakParser';
import { 
  Expression, 
  NumberLiteral, 
  StringLiteral, 
  BinaryExpression,
  UnaryExpression,
  VariableReference,
  FunctionCall 
} from '../ast/expressions';
import { Rule } from '../ast/rules';

/**
 * Implementation of ANTLR4 visitor that builds our AST
 */
export class RegelSpraakVisitorImpl extends ParseTreeVisitor<any> implements RegelSpraakVisitor<any> {
  
  visitRegelSpraakDocument(ctx: RegelSpraakDocumentContext): any {
    // Visit all definitions in the document
    const definitions = ctx.definitie_list();
    const results = [];
    
    for (const def of definitions) {
      const result = this.visit(def);
      if (result) {
        results.push(result);
      }
    }
    
    return results;
  }

  visitExpressie(ctx: ExpressieContext): Expression {
    // The expressie rule just delegates to logicalExpression
    return this.visit(ctx.logicalExpression());
  }

  visitLogicalExpr(ctx: LogicalExprContext): Expression {
    // Get the left comparison expression
    const left = this.visit(ctx.comparisonExpression());
    
    // Check if there's a logical operator
    const logicalExpr = ctx.logicalExpression();
    if (!logicalExpr) {
      // No logical operator, just return the comparison expression
      return left;
    }
    
    // Get the right logical expression
    const right = this.visit(logicalExpr);
    
    // Get the logical operator (EN or OF)
    const opToken = ctx.EN() || ctx.OF();
    if (!opToken) {
      throw new Error('Expected logical operator EN or OF');
    }
    
    // Map Dutch operators to standard operators
    const opText = opToken.getText();
    const operator = opText.toLowerCase() === 'en' ? '&&' : '||';
    
    return {
      type: 'BinaryExpression',
      operator: operator as any,
      left,
      right
    } as BinaryExpression;
  }

  visitBinaryComparisonExpr(ctx: BinaryComparisonExprContext): Expression {
    // Get the additive expressions
    const additiveExprs = ctx.additiveExpression_list();
    
    if (additiveExprs.length === 1) {
      // No comparison operator, just return the single expression
      return this.visit(additiveExprs[0]);
    }
    
    // Get the left and right expressions
    const left = this.visit(additiveExprs[0]);
    const right = this.visit(additiveExprs[1]);
    
    // Get the comparison operator
    const compOp = ctx.comparisonOperator();
    
    // Map Dutch operators to standard operators
    const opText = compOp.getText();
    let operator: string;
    
    switch(opText) {
      case 'gelijk aan':
      case 'is gelijk aan':
      case 'zijn gelijk aan':
        operator = '==';
        break;
      case 'ongelijk aan':
      case 'is ongelijk aan':
      case 'zijn ongelijk aan':
        operator = '!=';
        break;
      case 'groter dan':
      case 'is groter dan':
      case 'zijn groter dan':
        operator = '>';
        break;
      case 'groter of gelijk aan':
      case 'is groter of gelijk aan':
      case 'zijn groter of gelijk aan':
        operator = '>=';
        break;
      case 'kleiner dan':
      case 'is kleiner dan':
      case 'zijn kleiner dan':
        operator = '<';
        break;
      case 'kleiner of gelijk aan':
      case 'is kleiner of gelijk aan':
      case 'zijn kleiner of gelijk aan':
        operator = '<=';
        break;
      default:
        throw new Error(`Unknown comparison operator: ${opText}`);
    }
    
    return {
      type: 'BinaryExpression',
      operator: operator as any,
      left,
      right
    } as BinaryExpression;
  }

  visitAdditiveExpression(ctx: AdditiveExpressionContext): Expression {
    // Get all multiplicative expressions
    const multiplicativeExprs = ctx.multiplicativeExpression_list();
    
    if (multiplicativeExprs.length === 1) {
      return this.visit(multiplicativeExprs[0]);
    }
    
    // Build left-associative tree
    let result = this.visit(multiplicativeExprs[0]);
    
    // Get operators between expressions
    const operators = ctx.additiveOperator_list();
    
    for (let i = 0; i < operators.length; i++) {
      const opText = operators[i].getText();
      const operator = opText === 'plus' ? '+' : '-';
      const right = this.visit(multiplicativeExprs[i + 1]);
      
      result = {
        type: 'BinaryExpression',
        operator: operator as '+' | '-',
        left: result,
        right
      } as BinaryExpression;
    }
    
    return result;
  }

  visitMultiplicativeExpression(ctx: MultiplicativeExpressionContext): Expression {
    // Get all power expressions
    const powerExprs = ctx.powerExpression_list();
    
    if (powerExprs.length === 1) {
      return this.visit(powerExprs[0]);
    }
    
    // Build left-associative tree
    let result = this.visit(powerExprs[0]);
    
    // Get operators between expressions
    const operators = ctx.multiplicativeOperator_list();
    
    for (let i = 0; i < operators.length; i++) {
      const opText = operators[i].getText();
      const operator = opText === 'maal' ? '*' : '/';
      const right = this.visit(powerExprs[i + 1]);
      
      result = {
        type: 'BinaryExpression',
        operator: operator as '*' | '/',
        left: result,
        right
      } as BinaryExpression;
    }
    
    return result;
  }

  visitPowerExpression(ctx: PowerExpressionContext): Expression {
    // For now, just pass through to primary
    const primaryExprs = ctx.primaryExpression_list();
    if (primaryExprs.length > 1) {
      throw new Error('Power operator not yet supported');
    }
    return this.visit(primaryExprs[0]);
  }

  visitPrimaryExpression(ctx: PrimaryExpressionContext): Expression {
    // This should not be called directly - specific context types should be handled
    throw new Error(`Generic visitPrimaryExpression called - should use specific visitor method for ${ctx.constructor.name}`);
  }

  visitNumberLiteralExpr(ctx: NumberLiteralExprContext): Expression {
    const text = ctx.NUMBER().getText();
    // Convert Dutch decimal notation (comma) to JavaScript notation (dot)
    const normalizedText = text.replace(',', '.');
    const value = parseFloat(normalizedText);
    return {
      type: 'NumberLiteral',
      value
    } as NumberLiteral;
  }

  visitIdentifierExpr(ctx: IdentifierExprContext): Expression {
    return {
      type: 'VariableReference',
      variableName: ctx.identifier().getText()
    } as VariableReference;
  }

  visitParenExpr(ctx: ParenExprContext): Expression {
    return this.visit(ctx.expressie());
  }

  visitOnderwerpRefExpr(ctx: any): Expression {
    // For now, treat simple onderwerp references as variable references
    const text = ctx.getText();
    return {
      type: 'VariableReference',
      variableName: text
    } as VariableReference;
  }

  visitUnaryNietExpr(ctx: UnaryNietExprContext): Expression {
    // Get the operand expression
    const operand = this.visit(ctx.primaryExpression());
    
    return {
      type: 'UnaryExpression',
      operator: '!',
      operand
    } as UnaryExpression;
  }

  visitUnaryMinusExpr(ctx: UnaryMinusExprContext): Expression {
    // Get the operand expression
    const operand = this.visit(ctx.primaryExpression());
    
    return {
      type: 'UnaryExpression',
      operator: '-',
      operand
    } as UnaryExpression;
  }

  visitWortelFuncExpr(ctx: any): Expression {
    // Get the argument expression 
    const arg = this.visit(ctx.primaryExpression());
    
    return {
      type: 'FunctionCall',
      functionName: 'sqrt',
      arguments: [arg]
    } as FunctionCall;
  }

  visitAbsValFuncExpr(ctx: any): Expression {
    // Get the argument expression (inside parentheses)
    const arg = this.visit(ctx.primaryExpression());
    
    return {
      type: 'FunctionCall',
      functionName: 'abs',
      arguments: [arg]
    } as FunctionCall;
  }

  // Rule parsing visitor methods
  visitRegel(ctx: any): any {
    // Extract rule name from regelName
    const nameCtx = ctx.regelName();
    const name = this.extractText(nameCtx);
    
    // Get version info
    const version = this.visit(ctx.regelVersie());
    
    // Get result part (gelijkstelling)
    const result = this.visit(ctx.resultaatDeel());
    
    return {
      type: 'Rule',
      name,
      version,
      result
    };
  }

  visitAttribuutReferentie(ctx: any): string {
    // Get the attribute with article
    const attrCtx = ctx.attribuutMetLidwoord();
    const attrText = this.extractText(attrCtx);
    
    // For now, just return the full text
    return attrText;
  }

  visitRegelVersie(ctx: any): any {
    const geldigheid = this.visit(ctx.versieGeldigheid());
    
    return {
      type: 'RuleVersion',
      validity: geldigheid
    };
  }

  visitVersieGeldigheid(ctx: any): string {
    if (ctx.ALTIJD()) {
      return 'altijd';
    } else if (ctx.VANAF()) {
      return 'vanaf';
    } else if (ctx.TOT()) {
      return 'tot';
    }
    return 'altijd'; // default
  }

  visitGelijkstellingResultaat(ctx: any): any {
    // Get the target attribute reference
    const targetCtx = ctx.attribuutReferentie();
    
    // Visit the attribute reference to get its parts
    const attrRefCtx = targetCtx.attribuutMetLidwoord();
    
    // Get the naamwoord context which contains the attribute name
    const naamwoordCtx = attrRefCtx.naamwoord();
    
    // The naamwoord might have a naamPhrase with an article and identifier
    // Let's try to extract just the identifier part
    let target = 'unknown';
    
    // Get the text and parse it
    const fullText = naamwoordCtx.getText();
    target = this.extractTargetName(fullText);
    
    // Get the expression - check which operator is used
    let expression;
    if (ctx.WORDT_BEREKEND_ALS()) {
      expression = this.visit(ctx.expressie());
    } else if (ctx.WORDT_GESTELD_OP()) {
      expression = this.visit(ctx.expressie());
    } else if (ctx.WORDT_GEINITIALISEERD_OP()) {
      expression = this.visit(ctx.expressie());
    } else {
      throw new Error('Expected gelijkstelling operator');
    }
    
    return {
      type: 'Gelijkstelling',
      target,
      expression
    };
  }

  // Helper to extract target attribute name from full reference
  private extractTargetName(fullReference: string): string {
    // Handle case where article is concatenated with the attribute (e.g., "Hetresultaat")
    const articlePrefixes = /^(het|de|een)/i;
    const match = fullReference.match(articlePrefixes);
    
    if (match) {
      // Remove the article prefix and return the rest
      const withoutArticle = fullReference.substring(match[0].length);
      return withoutArticle.toLowerCase();
    }
    
    // If there are spaces, try the original logic
    const words = fullReference.split(/\s+/);
    if (words.length > 1 && /^(het|de|een)$/i.test(words[0])) {
      return words[1].toLowerCase();
    }
    
    return fullReference.toLowerCase();
  }

  // Helper to extract text from a context
  private extractText(ctx: any): string {
    if (!ctx) return '';
    
    // Use getText() method if available
    if (ctx.getText) {
      return ctx.getText();
    }
    
    // Fallback for contexts without getText
    const start = ctx.start?.start ?? 0;
    const stop = ctx.stop?.stop ?? 0;
    const inputStream = ctx.parser?.inputStream;
    
    if (inputStream && start <= stop) {
      return inputStream.getText(start, stop);
    }
    
    return '';
  }

  // Default visitor - fall back to visitChildren
  visitChildren(node: any): any {
    if (!node.children || node.children.length === 0) {
      return null;
    }
    
    
    // If only one child, visit it
    if (node.children.length === 1) {
      return this.visit(node.children[0]);
    }
    
    // Multiple children - not sure what to do
    throw new Error(`Don't know how to handle ${node.constructor.name} with ${node.children.length} children`);
  }
}