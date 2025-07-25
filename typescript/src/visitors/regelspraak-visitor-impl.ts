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
import { ObjectTypeDefinition, KenmerkSpecification, AttributeSpecification, DataType, DomainReference } from '../ast/object-types';

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
    try {
      // Extract rule name from regelName
      const nameCtx = ctx.regelName();
      if (!nameCtx) {
        throw new Error('Expected rule name');
      }
      const name = this.extractText(nameCtx);
      
      // Get version info
      const versionCtx = ctx.regelVersie();
      if (!versionCtx) {
        throw new Error('Expected "geldig" keyword');
      }
      const version = this.visit(versionCtx);
      
      // Get result part
      const resultCtx = ctx.resultaatDeel();
      if (!resultCtx) {
        throw new Error('Expected result part');
      }
      const result = this.visit(resultCtx);
      
      return {
        type: 'Rule',
        name,
        version,
        result
      };
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      throw new Error('Failed to parse rule');
    }
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

  visitResultaatDeel(ctx: any): any {
    // The grammar has labeled alternatives, so we check the context type
    if (ctx.constructor.name === 'GelijkstellingResultaatContext') {
      return this.visitGelijkstellingResultaat(ctx);
    } else if (ctx.constructor.name === 'DagsoortdefinitieResultaatContext') {
      throw new Error('DagsoortdefinitieResultaat not implemented');
    } else if (ctx.constructor.name === 'FeitCreatieResultaatContext') {
      throw new Error('FeitCreatieResultaat not implemented');
    } else if (ctx.constructor.name === 'KenmerkFeitResultaatContext') {
      // This is for patterns like "Het resultaat is 42"
      throw new Error('Expected gelijkstelling pattern (moet berekend worden als)');
    } else if (ctx.constructor.name === 'ObjectCreatieResultaatContext') {
      throw new Error('ObjectCreatieResultaat not implemented');
    }
    
    // Fallback to visitChildren
    return this.visitChildren(ctx);
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

  // Object type definition visitor methods
  visitObjectTypeDefinition(ctx: any): ObjectTypeDefinition {
    // Get the name (naamwoordNoIs)
    const nameCtx = ctx.naamwoordNoIs();
    const name = this.extractText(nameCtx).trim();
    
    
    // Check for plural form (in parentheses)
    const plural: string[] = [];
    if (ctx.MV_START()) {
      // The grammar uses plural+=IDENTIFIER+ which creates a list
      // In ANTLR4 TypeScript, this is accessed via ctx._plural
      const pluralList = ctx._plural || [];
      for (const identifier of pluralList) {
        // In ANTLR4 TypeScript, tokens are TerminalNode objects
        plural.push(identifier.text || identifier.getText());
      }
    }
    
    // Check if animated (bezield)
    const animated = !!ctx.BEZIELD();
    
    // Get all members using the _list() method
    const members = [];
    const memberCtxs = ctx.objectTypeMember_list();
    
    for (const memberCtx of memberCtxs) {
      members.push(this.visit(memberCtx));
    }
    
    return {
      type: 'ObjectTypeDefinition',
      name,
      plural: plural.length > 0 ? plural : undefined,
      animated,
      members
    };
  }

  visitObjectTypeMember(ctx: any): KenmerkSpecification | AttributeSpecification {
    // Check if it has kenmerkSpecificatie or attribuutSpecificatie
    const kenmerkCtx = ctx.kenmerkSpecificatie();
    if (kenmerkCtx) {
      return this.visit(kenmerkCtx);
    }
    
    const attribuutCtx = ctx.attribuutSpecificatie();
    if (attribuutCtx) {
      return this.visit(attribuutCtx);
    }
    
    throw new Error('Expected kenmerk or attribuut specification');
  }

  visitKenmerkSpecificatie(ctx: any): KenmerkSpecification {
    // Get the name - can be identifier or naamwoord
    let name: string;
    if (ctx.identifier()) {
      name = ctx.identifier().getText();
    } else {
      const naamwoordCtx = ctx.naamwoord();
      name = this.extractText(naamwoordCtx);
    }
    
    // Check for type (bijvoeglijk or bezittelijk)
    let kenmerkType: 'bijvoeglijk' | 'bezittelijk' | undefined;
    if (ctx.BIJVOEGLIJK && ctx.BIJVOEGLIJK()) {
      kenmerkType = 'bijvoeglijk';
    } else if (ctx.BEZITTELIJK && ctx.BEZITTELIJK()) {
      kenmerkType = 'bezittelijk';
    }
    
    const result: KenmerkSpecification = {
      type: 'KenmerkSpecification',
      name
    };
    
    if (kenmerkType) {
      result.kenmerkType = kenmerkType;
    }
    
    return result;
  }

  visitAttribuutSpecificatie(ctx: any): AttributeSpecification {
    // Get the name
    const nameCtx = ctx.naamwoord();
    const name = this.extractText(nameCtx);
    
    // Get data type or domain reference
    let dataType: DataType | DomainReference;
    const datatypeCtx = ctx.datatype();
    if (datatypeCtx) {
      dataType = this.visitDatatype(datatypeCtx);
    } else {
      const domainRefCtx = ctx.domeinRef();
      dataType = this.visitDomeinRef(domainRefCtx);
    }
    
    // Get unit if specified
    let unit: string | undefined;
    if (ctx.MET_EENHEID && ctx.MET_EENHEID()) {
      // Check for named unit (ctx._unitName is the captured IDENTIFIER)
      if (ctx._unitName) {
        unit = ctx._unitName.text || ctx._unitName.getText();
      } else if (ctx.PERCENT_SIGN && ctx.PERCENT_SIGN()) {
        unit = '%';
      } else if (ctx.EURO_SYMBOL && ctx.EURO_SYMBOL()) {
        unit = '€';
      } else if (ctx.DOLLAR_SYMBOL && ctx.DOLLAR_SYMBOL()) {
        unit = '$';
      }
    }
    
    // Get dimensions if specified
    const dimensions: string[] = [];
    if (ctx.GEDIMENSIONEERD_MET && ctx.GEDIMENSIONEERD_MET()) {
      const dimensionRefs = ctx.dimensieRef ? ctx.dimensieRef() : [];
      for (const dimRef of dimensionRefs) {
        dimensions.push(this.extractText(dimRef));
      }
    }
    
    // Check for timeline
    const timeline = ctx.tijdlijn && ctx.tijdlijn() ? true : undefined;
    
    return {
      type: 'AttributeSpecification',
      name,
      dataType,
      unit,
      dimensions: dimensions.length > 0 ? dimensions : undefined,
      timeline: timeline || undefined
    };
  }

  visitDatatype(ctx: any): DataType {
    // Check which specific datatype it is
    if (ctx.tekstDatatype && ctx.tekstDatatype()) {
      return { type: 'Tekst' };
    } else if (ctx.numeriekDatatype && ctx.numeriekDatatype()) {
      return this.visitNumeriekDatatype(ctx.numeriekDatatype());
    } else if (ctx.booleanDatatype && ctx.booleanDatatype()) {
      return { type: 'Boolean' };
    } else if (ctx.datumTijdDatatype && ctx.datumTijdDatatype()) {
      return this.visitDatumTijdDatatype(ctx.datumTijdDatatype());
    }
    
    // Try to determine from text as fallback
    const text = this.extractText(ctx);
    throw new Error(`Unknown data type: ${text}`);
  }
  
  visitNumeriekDatatype(ctx: any): DataType {
    // numeriekDatatype : NUMERIEK ( LPAREN getalSpecificatie RPAREN )?
    const result: DataType = { type: 'Numeriek' };
    
    if (ctx.getalSpecificatie && ctx.getalSpecificatie()) {
      const spec = this.extractText(ctx.getalSpecificatie());
      result.specification = spec;
    }
    
    return result;
  }
  
  visitDatumTijdDatatype(ctx: any): DataType {
    // Check if it's DATUM or DATUM_TIJD
    const text = this.extractText(ctx);
    if (text.toLowerCase().includes('tijd')) {
      return { type: 'DatumTijd' };
    }
    return { type: 'Datum' };
  }

  visitDomeinRef(ctx: any): DomainReference {
    const domain = this.extractText(ctx);
    return {
      type: 'DomainReference',
      domain
    };
  }

  // Default visitor - fall back to visitChildren
  visitChildren(node: any): any {
    if (!node.children || node.children.length === 0) {
      return null;
    }
    
    // Special case for ResultaatDeelContext - provide helpful error
    if (node.constructor.name === 'ResultaatDeelContext') {
      // Try to provide a more helpful error message
      const text = this.extractText(node).trim();
      if (text.includes(' is ')) {
        throw new Error('Expected gelijkstelling pattern (moet berekend worden als)');
      }
      throw new Error('Invalid result pattern');
    }
    
    // If only one child, visit it
    if (node.children.length === 1) {
      return this.visit(node.children[0]);
    }
    
    // Multiple children - not sure what to do
    throw new Error(`Don't know how to handle ${node.constructor.name} with ${node.children.length} children`);
  }
}