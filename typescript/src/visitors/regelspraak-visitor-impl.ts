import { ParseTreeVisitor } from 'antlr4';
import RegelSpraakVisitor from '../generated/antlr/RegelSpraakVisitor';
import RegelSpraakParser, {
  RegelSpraakDocumentContext,
  RegelContext,
  ExpressieContext,
  AdditiveExpressionContext,
  MultiplicativeExpressionContext,
  PrimaryExpressionContext,
  NumberLiteralContext,
  StringLiteralContext,
  IdentifierContext
} from '../generated/antlr/RegelSpraakParser';
import { 
  Expression, 
  NumberLiteral, 
  StringLiteral, 
  BinaryExpression,
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

  visitLogicalExpr(ctx: any): Expression {
    // For now, just pass through to comparison
    if (ctx.right) {
      // Has logical operator, not supported yet
      throw new Error('Logical operators not yet supported');
    }
    return this.visit(ctx.left);
  }

  visitBinaryComparisonExpr(ctx: any): Expression {
    // For simple expressions without comparison, just return the additive expression
    if (!ctx.right) {
      return this.visit(ctx.left);
    }
    // Comparison not supported yet
    throw new Error('Comparison operators not yet supported');
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
      const operator = operators[i].getText() === '+' ? '+' : '-';
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
      const operator = opText === '*' || opText === 'maal' ? '*' : '/';
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

  visitPowerExpression(ctx: any): Expression {
    // For now, just pass through to primary
    const primaryExprs = ctx.primaryExpression_list();
    if (primaryExprs.length > 1) {
      throw new Error('Power operator not yet supported');
    }
    return this.visit(primaryExprs[0]);
  }

  visitPrimaryExpression(ctx: PrimaryExpressionContext): Expression {
    // Handle literals
    if (ctx.getalLiteral()) {
      const value = parseFloat(ctx.getalLiteral().getText());
      return {
        type: 'NumberLiteral',
        value
      } as NumberLiteral;
    }
    
    // Handle identifier
    if (ctx.identifier()) {
      return {
        type: 'VariableReference',
        variableName: ctx.identifier().getText()
      } as VariableReference;
    }
    
    // Handle parentheses
    if (ctx.expressie()) {
      return this.visit(ctx.expressie());
    }
    
    throw new Error(`Unsupported primary expression: ${ctx.getText()}`);
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