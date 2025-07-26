import { ParseTreeVisitor } from 'antlr4';
import RegelSpraakVisitor from '../generated/antlr/RegelSpraakVisitor';
import {
  RegelSpraakDocumentContext,
  ExpressieContext,
  LogicalExprContext,
  BinaryComparisonExprContext,
  UnaryConditionExprContext,
  AdditiveExpressionContext,
  MultiplicativeExpressionContext,
  PowerExpressionContext,
  PrimaryExpressionContext,
  NumberLiteralExprContext,
  IdentifierExprContext,
  ParenExprContext,
  UnaryNietExprContext,
  UnaryMinusExprContext
} from '../generated/antlr/RegelSpraakParser';
import RegelSpraakLexer from '../generated/antlr/RegelSpraakLexer';
import { 
  Expression, 
  NumberLiteral, 
  BinaryExpression,
  UnaryExpression,
  VariableReference,
  FunctionCall,
  NavigationExpression,
  SubselectieExpression,
  Predicaat,
  KenmerkPredicaat,
  AttributeComparisonPredicaat
} from '../ast/expressions';
import { 
  Voorwaarde, 
  ObjectCreation, 
  Consistentieregel,
  Verdeling,
  VerdelingMethode,
  VerdelingGelijkeDelen,
  VerdelingNaarRato,
  VerdelingOpVolgorde,
  VerdelingTieBreak,
  VerdelingMaximum,
  VerdelingAfronding
} from '../ast/rules';
import { ObjectTypeDefinition, KenmerkSpecification, AttributeSpecification, DataType, DomainReference } from '../ast/object-types';
import { ParameterDefinition } from '../ast/parameters';
import { AttributeReference } from '../ast/expressions';

/**
 * Implementation of ANTLR4 visitor that builds our AST
 */
export class RegelSpraakVisitorImpl extends ParseTreeVisitor<any> implements RegelSpraakVisitor<any> {
  
  visitRegelSpraakDocument(ctx: RegelSpraakDocumentContext): any {
    // Visit all top-level elements (definitions, rules, etc.)
    const results = [];
    
    // Get all top-level elements
    const definitions = ctx.definitie_list() || [];
    const rules = ctx.regel_list() || [];
    const regelGroups = ctx.regelGroep_list() || [];
    const beslistabels = ctx.beslistabel_list() || [];
    const consistentieregels = ctx.consistentieregel_list() || [];
    const eenheidsystems = ctx.eenheidsysteemDefinition_list() || [];
    
    // console.log('Document has', definitions.length, 'definitions and', rules.length, 'rules');
    
    // Visit definitions
    for (const def of definitions) {
      const result = this.visit(def);
      if (result) {
        results.push(result);
      }
    }
    
    // Visit rules
    for (const rule of rules) {
      const result = this.visit(rule);
      if (result) {
        results.push(result);
      }
    }
    
    // Visit consistency rules
    for (const consistentieregel of consistentieregels) {
      const result = this.visit(consistentieregel);
      if (result) {
        results.push(result);
      }
    }
    
    // Visit other top-level elements as needed
    // TODO: Add support for regelGroep, beslistabel, etc.
    
    return results;
  }

  visitExpressie(ctx: ExpressieContext): Expression {
    // The expressie rule just delegates to logicalExpression
    return this.visit(ctx.logicalExpression());
  }

  visitLogicalExpr(ctx: LogicalExprContext): Expression {
    // Get the left comparison expression
    const left = this.visitComparisonExpression(ctx.comparisonExpression());
    
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

  visitComparisonExpression(ctx: any): Expression {
    // Check which type of comparison expression this is
    const contextName = ctx.constructor.name;
    
    if (contextName === 'BinaryComparisonExprContext') {
      return this.visitBinaryComparisonExpr(ctx);
    } else if (contextName === 'UnaryConditionExprContext') {
      return this.visitUnaryConditionExpr(ctx);
    } else {
      // Fallback - try to visit it generically
      return this.visit(ctx);
    }
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
      case 'gelijk is aan':
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
      case 'groter is dan':
      case 'is groter dan':
      case 'zijn groter dan':
        operator = '>';
        break;
      case 'groter of gelijk aan':
      case 'groter of gelijk is aan':
      case 'is groter of gelijk aan':
      case 'zijn groter of gelijk aan':
        operator = '>=';
        break;
      case 'kleiner dan':
      case 'kleiner is dan':
      case 'is kleiner dan':
      case 'zijn kleiner dan':
        operator = '<';
        break;
      case 'kleiner of gelijk aan':
      case 'kleiner of gelijk is aan':
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

  visitUnaryConditionExpr(ctx: any): Expression {
    // UnaryConditionExpr wraps unaryCondition in comparisonExpression
    const unaryConditionCtx = ctx.unaryCondition();
    return this.visitUnaryCondition(unaryConditionCtx);
  }

  visitUnaryCondition(ctx: any): Expression {
    // Check which type of unary condition this is
    const contextName = ctx.constructor.name;
    
    if (contextName === 'UnaryCheckConditionContext') {
      return this.visitUnaryCheckCondition(ctx);
    } else if (contextName === 'UnaryDagsoortConditionContext') {
      return this.visitUnaryDagsoortCondition(ctx);
    } else if (contextName === 'UnaryUniekConditionContext') {
      return this.visitUnaryUniekCondition(ctx);
    } else {
      throw new Error(`Unsupported unary condition type: ${contextName}`);
    }
  }

  visitUnaryDagsoortCondition(ctx: any): Expression {
    // expr=primaryExpression op=(IS_EEN_DAGSOORT | ...) dagsoort=identifier
    const expr = this.visit(ctx.primaryExpression());
    
    // Get the dagsoort identifier
    const dagsoortCtx = ctx.identifier();
    if (!dagsoortCtx) {
      throw new Error('Expected dagsoort identifier');
    }
    const dagsoortName = dagsoortCtx.getText();
    
    // Get the operator - use the private _op property
    const opToken = ctx._op;
    if (!opToken) {
      throw new Error('Expected operator token in dagsoort condition');
    }
    
    let binaryOp: string;
    
    if (opToken.type === RegelSpraakLexer.IS_EEN_DAGSOORT) {
      binaryOp = 'is een dagsoort';
    } else if (opToken.type === RegelSpraakLexer.ZIJN_EEN_DAGSOORT) {
      binaryOp = 'zijn een dagsoort';
    } else if (opToken.type === RegelSpraakLexer.IS_GEEN_DAGSOORT) {
      binaryOp = 'is geen dagsoort';
    } else if (opToken.type === RegelSpraakLexer.ZIJN_GEEN_DAGSOORT) {
      binaryOp = 'zijn geen dagsoort';
    } else {
      throw new Error(`Unknown dagsoort operator token type: ${opToken.type}`);
    }
    
    // Create a binary expression with the dagsoort name as right side
    return {
      type: 'BinaryExpression',
      operator: binaryOp as any,
      left: expr,
      right: {
        type: 'StringLiteral',
        value: dagsoortName
      }
    } as BinaryExpression;
  }

  visitUnaryUniekCondition(ctx: any): Expression {
    // ref=onderwerpReferentie MOETEN_UNIEK_ZIJN
    const ref = this.visit(ctx.onderwerpReferentie());
    
    return {
      type: 'UnaryExpression',
      operator: 'moeten uniek zijn',
      operand: ref
    } as UnaryExpression;
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
    // The grammar structure is: onderwerpReferentie -> onderwerpBasis -> basisOnderwerp
    const onderwerpRef = ctx.onderwerpReferentie ? ctx.onderwerpReferentie() : ctx;
    const onderwerpBasis = onderwerpRef.onderwerpBasis ? onderwerpRef.onderwerpBasis() : onderwerpRef;
    const basisOnderwerp = onderwerpBasis.basisOnderwerp ? onderwerpBasis.basisOnderwerp() : onderwerpBasis;
    
    // basisOnderwerp : (DE | HET | EEN | ZIJN | ALLE)? identifierOrKeyword+
    if (basisOnderwerp && basisOnderwerp.identifierOrKeyword) {
      // Collect all identifier tokens (skip article)
      const identifiers = basisOnderwerp.identifierOrKeyword();
      if (Array.isArray(identifiers)) {
        // Join multiple identifiers with space, preserving case
        const variableName = identifiers.map(id => id.getText()).join(' ');
        return {
          type: 'VariableReference',
          variableName
        } as VariableReference;
      } else if (identifiers) {
        // Single identifier
        return {
          type: 'VariableReference',
          variableName: identifiers.getText()
        } as VariableReference;
      }
    }
    
    // Fallback: extract text without article, preserving case
    const text = ctx.getText();
    const match = text.match(/^(?:de|het|een|zijn|alle)?\s*(.+)$/i);
    const variableName = match ? match[1] : text;
    
    return {
      type: 'VariableReference',
      variableName
    } as VariableReference;
  }

  visitStringLiteralExpr(ctx: any): Expression {
    // Get the string literal token
    const text = ctx.STRING_LITERAL().getText();
    
    // Remove surrounding quotes
    const value = text.slice(1, -1);
    
    return {
      type: 'StringLiteral',
      value
    } as Expression;
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
  
  visitAantalFuncExpr(ctx: any): Expression {
    // HET? AANTAL (ALLE? onderwerpReferentie)
    // Get the onderwerp reference (which might include subselectie)
    const onderwerpCtx = ctx.onderwerpReferentie();
    
    if (!onderwerpCtx) {
      throw new Error('Expected onderwerpReferentie in aantal expression');
    }
    
    const onderwerpExpr = this.visit(onderwerpCtx);
    
    // For now, just return a function call expression
    // We'll need to enhance this to handle subselectie properly
    return {
      type: 'FunctionCall',
      functionName: 'aantal',
      arguments: [onderwerpExpr]
    } as FunctionCall;
  }

  // Rule parsing visitor methods
  visitRegel(ctx: any): any {
    try {
      // Extract rule name - regelName returns a naamwoord
      const nameCtx = ctx.regelName();
      if (!nameCtx) {
        throw new Error('Expected rule name');
      }
      
      // Get the text with spaces preserved
      const name = this.extractTextWithSpaces(nameCtx).trim();
      
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
      
      // Check for optional condition (voorwaardeDeel)
      let condition: Voorwaarde | undefined;
      if (ctx.voorwaardeDeel && ctx.voorwaardeDeel()) {
        condition = this.visitVoorwaardeDeel(ctx.voorwaardeDeel());
      }
      
      return {
        type: 'Rule',
        name,
        version,
        result,
        condition
      };
    } catch (e) {
      if (e instanceof Error) {
        throw e;
      }
      throw new Error('Failed to parse rule');
    }
  }

  visitAttribuutReferentie(ctx: any): NavigationExpression {
    // attribuutReferentie : attribuutMetLidwoord VAN onderwerpReferentie
    const attrCtx = ctx.attribuutMetLidwoord();
    const attrText = this.extractTextWithSpaces(attrCtx);
    
    // Check if this is actually a nested navigation that was parsed incorrectly
    // Due to grammar ambiguity, "de straat van het adres" might be parsed as a single naamwoord
    if (attrText.includes(' van ')) {
      // This is a nested navigation expression
      // We need to recursively parse it
      // For now, just take the first part before "van"
      const parts = attrText.split(' van ');
      const actualAttr = this.extractParameterName(parts[0]);
      
      // The rest after "van" should be combined with the onderwerpReferentie
      // This is a workaround for the grammar ambiguity
      const onderwerpCtx = ctx.onderwerpReferentie();
      const baseObjectExpr = this.visit(onderwerpCtx);
      
      // Create a nested navigation if we have multiple parts
      if (parts.length > 1) {
        // For "de straat van het adres", parts = ["de straat", "het adres"]
        // We need to create: { attribute: "straat", object: { attribute: "adres", object: persoon } }
        
        // Start with the base object (persoon)
        let currentObject = baseObjectExpr;
        
        // Process middle parts from right to left
        // Skip the first part (actualAttr) as it will be the outermost attribute
        for (let i = parts.length - 1; i >= 1; i--) {
          const nestedAttr = this.extractParameterName(parts[i]);
          currentObject = {
            type: 'NavigationExpression',
            attribute: nestedAttr,
            object: currentObject
          } as NavigationExpression;
        }
        
        return {
          type: 'NavigationExpression',
          attribute: actualAttr,
          object: currentObject
        } as NavigationExpression;
      }
      
      return {
        type: 'NavigationExpression',
        attribute: actualAttr,
        object: baseObjectExpr
      } as NavigationExpression;
    }
    
    // Simple case: no nested navigation in attribute
    const attrName = this.extractParameterName(attrText);
    
    // Get the object expression (onderwerpReferentie)
    const onderwerpCtx = ctx.onderwerpReferentie();
    const objectExpr = this.visit(onderwerpCtx);
    
    return {
      type: 'NavigationExpression',
      attribute: attrName,
      object: objectExpr
    } as NavigationExpression;
  }
  
  visitAttrRefExpr(ctx: any): Expression {
    // AttrRefExpr wraps attribuutReferentie in primaryExpression
    const attrRefCtx = ctx.attribuutReferentie();
    return this.visit(attrRefCtx);
  }
  
  visitOnderwerpReferentie(ctx: any): Expression {
    // onderwerpReferentie : onderwerpBasis ( (DIE | DAT) predicaat )?
    
    // Check if there's a subselectie (DIE/DAT predicaat)
    const predicaatCtx = ctx.predicaat ? ctx.predicaat() : null;
    if (predicaatCtx && (ctx.DIE && ctx.DIE() || ctx.DAT && ctx.DAT())) {
      // We have a subselectie!
      const baseExpression = this.visitOnderwerpBasis(ctx.onderwerpBasis());
      const predicaat = this.visitPredicaat(predicaatCtx);
      
      return {
        type: 'SubselectieExpression',
        collection: baseExpression,
        predicaat
      } as SubselectieExpression;
    }
    
    // No subselectie, just process the onderwerpBasis
    return this.visitOnderwerpBasis(ctx.onderwerpBasis());
  }
  
  visitOnderwerpBasis(ctx: any): Expression {
    if (!ctx) {
      throw new Error('Expected onderwerpBasis context');
    }
    
    // onderwerpBasis : basisOnderwerp ( voorzetsel basisOnderwerp )*
    // For now, just handle the simple case without voorzetsel chaining
    const basisOnderwerpList = ctx.basisOnderwerp();
    if (!basisOnderwerpList || basisOnderwerpList.length === 0) {
      // Fallback
      const text = ctx.getText();
      const variableName = text.replace(/^(de|het|een|zijn|alle)\s*/i, '');
      return {
        type: 'VariableReference',
        variableName
      } as VariableReference;
    }
    
    const basisOnderwerpCtx = basisOnderwerpList[0];
    
    // basisOnderwerp : (DE | HET | EEN | ZIJN | ALLE)? identifierOrKeyword+
    // Extract the identifier(s) without article
    const identifiers = basisOnderwerpCtx.identifierOrKeyword ? basisOnderwerpCtx.identifierOrKeyword() : [];
    
    if (identifiers.length > 0) {
      const variableName = Array.isArray(identifiers) 
        ? identifiers.map(id => id.getText()).join(' ')
        : identifiers.getText();
        
      return {
        type: 'VariableReference',
        variableName
      } as VariableReference;
    }
    
    // Check for HIJ pronoun
    if (basisOnderwerpCtx.HIJ && basisOnderwerpCtx.HIJ()) {
      return {
        type: 'VariableReference',
        variableName: 'hij'
      } as VariableReference;
    }
    
    // Fallback
    const text = ctx.getText();
    const variableName = text.replace(/^(de|het|een|zijn|alle)\s*/i, '');
    return {
      type: 'VariableReference',
      variableName
    } as VariableReference;
  }
  
  visitPredicaat(ctx: any): Predicaat {
    // predicaat : elementairPredicaat | samengesteldPredicaat
    
    // First check if we have elementairPredicaat
    const elementairPredicaatCtx = ctx.elementairPredicaat ? ctx.elementairPredicaat() : null;
    if (elementairPredicaatCtx) {
      return this.visitElementairPredicaat(elementairPredicaatCtx);
    }
    
    // Try to get text and check if it's a simple kenmerk
    const text = this.extractTextWithSpaces(ctx);
    
    // Simple kenmerk pattern like "minderjarig zijn"
    if (text.endsWith(' zijn')) {
      const kenmerk = text.replace(/ zijn$/, '').trim();
      return {
        type: 'KenmerkPredicaat',
        kenmerk
      } as KenmerkPredicaat;
    }
    
    // TODO: Handle samengesteldPredicaat
    throw new Error(`Unsupported predicate type: ${text}`);
  }
  
  visitElementairPredicaat(ctx: any): Predicaat {
    // elementairPredicaat : objectPredicaat | attribuutVergelijkingsPredicaat
    
    // Check for attribuutVergelijkingsPredicaat first
    const attrVergelijkingCtx = ctx.attribuutVergelijkingsPredicaat ? ctx.attribuutVergelijkingsPredicaat() : null;
    if (attrVergelijkingCtx) {
      return this.visitAttribuutVergelijkingsPredicaat(attrVergelijkingCtx);
    }
    
    // Check for objectPredicaat
    const objectPredicaatCtx = ctx.objectPredicaat ? ctx.objectPredicaat() : null;
    if (objectPredicaatCtx) {
      return this.visitObjectPredicaat(objectPredicaatCtx);
    }
    
    throw new Error('Expected objectPredicaat or attribuutVergelijkingsPredicaat in elementairPredicaat');
  }
  
  visitAttribuutVergelijkingsPredicaat(ctx: any): AttributeComparisonPredicaat {
    // attribuutVergelijkingsPredicaat : EEN? attribuutNaam=naamwoord HEBBEN comparisonOperator expressie
    
    // Get attribute name
    const attrNaamCtx = ctx.naamwoord ? ctx.naamwoord() : ctx._attribuutNaam;
    const attrName = this.extractTextWithSpaces(attrNaamCtx).trim();
    
    // Get comparison operator
    const compOpCtx = ctx.comparisonOperator();
    const opText = compOpCtx.getText();
    
    // Map operator text to standard operator
    let operator: string;
    switch(opText) {
      case 'kleiner dan':
      case 'kleiner is dan':
        operator = '<';
        break;
      case 'groter dan':
      case 'groter is dan':
        operator = '>';
        break;
      case 'gelijk aan':
      case 'is gelijk aan':
        operator = '==';
        break;
      default:
        throw new Error(`Unsupported comparison operator in predicaat: ${opText}`);
    }
    
    // Get the expression
    const exprCtx = ctx.expressie();
    const expr = this.visit(exprCtx);
    
    return {
      type: 'AttributeComparisonPredicaat',
      attribute: attrName,
      operator,
      value: expr
    } as AttributeComparisonPredicaat;
  }
  
  visitObjectPredicaat(ctx: any): KenmerkPredicaat {
    // For now, treat object predicates as kenmerk predicates
    const text = this.extractTextWithSpaces(ctx);
    
    // Remove trailing "zijn" if present
    const kenmerk = text.replace(/ zijn$/, '').trim();
    
    return {
      type: 'KenmerkPredicaat',
      kenmerk
    } as KenmerkPredicaat;
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
      return this.visitKenmerkFeitResultaat(ctx);
    } else if (ctx.constructor.name === 'ObjectCreatieResultaatContext') {
      return this.visitObjectCreatieResultaat(ctx);
    } else if (ctx.constructor.name === 'VerdelingContext') {
      // The generated context is named after the label
      return this.visitVerdelingResultaat(ctx);
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

  visitObjectCreatieResultaat(ctx: any): any {
    // Get the objectCreatie context
    const objectCreatieCtx = ctx.objectCreatie();
    
    // Get the object type name
    const objectTypeCtx = objectCreatieCtx.objectType ? objectCreatieCtx.objectType() : objectCreatieCtx._objectType;
    if (!objectTypeCtx) {
      throw new Error('Expected object type in object creation');
    }
    const objectType = this.extractObjectTypeName(objectTypeCtx.getText());
    
    // Parse attribute initializations if present
    const attributeInits = [];
    const objectAttrInitCtx = objectCreatieCtx.objectAttributeInit();
    
    if (objectAttrInitCtx) {
      // Get the first attribute
      const firstAttrCtx = objectAttrInitCtx.attribuut ? objectAttrInitCtx.attribuut() : objectAttrInitCtx._attribuut;
      const firstValueCtx = objectAttrInitCtx.waarde ? objectAttrInitCtx.waarde() : objectAttrInitCtx._waarde;
      
      if (firstAttrCtx && firstValueCtx) {
        const firstAttr = this.extractAttributeName(firstAttrCtx.getText());
        const firstValue = this.visit(firstValueCtx);
        attributeInits.push({ attribute: firstAttr, value: firstValue });
      }
      
      // Get additional attributes (EN syntax)
      const vervolgList = objectAttrInitCtx.attributeInitVervolg_list();
      for (const vervolg of vervolgList) {
        const attrCtx = vervolg.attribuut ? vervolg.attribuut() : vervolg._attribuut;
        const valueCtx = vervolg.waarde ? vervolg.waarde() : vervolg._waarde;
        
        if (attrCtx && valueCtx) {
          const attr = this.extractAttributeName(attrCtx.getText());
          const value = this.visit(valueCtx);
          attributeInits.push({ attribute: attr, value });
        }
      }
    }
    
    return {
      type: 'ObjectCreation',
      objectType,
      attributeInits
    };
  }

  extractObjectTypeName(text: string): string {
    // Remove any articles and clean up the text
    const words = text.split(/\s+/);
    const cleaned = words.filter(w => !['de', 'het', 'een'].includes(w.toLowerCase()));
    return cleaned.join(' ');
  }

  extractAttributeName(text: string): string {
    // Clean up attribute name, removing articles if present
    const words = text.split(/\s+/);
    const cleaned = words.filter(w => !['de', 'het', 'een'].includes(w.toLowerCase()));
    return cleaned.join(' ');
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
  
  // Helper to extract text with spaces preserved between tokens
  private extractTextWithSpaces(ctx: any): string {
    if (!ctx) return '';
    
    // If it's a terminal node, just return its text
    if (ctx.symbol) {
      return ctx.getText();
    }
    
    // For parser rule contexts, reconstruct with spaces
    const parts: string[] = [];
    const childCount = ctx.getChildCount ? ctx.getChildCount() : 0;
    // console.log('extractTextWithSpaces childCount:', childCount);
    
    for (let i = 0; i < childCount; i++) {
      const child = ctx.getChild(i);
      // console.log('Child', i, ':', child ? child.constructor.name : 'null');
      if (!child) {
        // console.log('Child is null!');
        continue;
      }
      if (child.symbol) {
        // Terminal node
        try {
          const text = child.getText();
          // console.log('Terminal node text:', text);
          parts.push(text);
        } catch (e) {
          // console.log('Error getting terminal node text:', e);
          throw e;
        }
      } else {
        // Recursively get text from child contexts
        const childText = this.extractTextWithSpaces(child);
        if (childText) {
          parts.push(childText);
        }
      }
    }
    
    return parts.join(' ');
  }

  // Object type definition visitor methods
  visitObjectTypeDefinition(ctx: any): ObjectTypeDefinition {
    // Get the name (naamwoordNoIs)
    const nameCtx = ctx.naamwoordNoIs();
    const rawName = this.extractText(nameCtx).trim();
    const name = this.extractParameterName(rawName);
    
    
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
    const rawName = this.extractText(nameCtx);
    const name = this.extractParameterName(rawName);
    
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
      const dimensionRefs = ctx.dimensieRef_list ? ctx.dimensieRef_list() : [];
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

  // Parameter parsing visitor methods
  visitParameterDefinition(ctx: any): ParameterDefinition {
    // Get parameter name phrase (with article)
    const namePhrase = ctx.parameterNamePhrase();
    
    // Extract the full text with spaces preserved
    let nameText = '';
    if (namePhrase) {
      // Get the text with spaces from the original input stream
      const startToken = namePhrase.start;
      const stopToken = namePhrase.stop;
      
      if (startToken && stopToken && startToken.source) {
        // Access the input stream through the token's source
        const inputStream = startToken.source[1]; // TokenSource tuple: [lexer, inputStream]
        if (inputStream) {
          const startIndex = startToken.start;
          const stopIndex = stopToken.stop;
          nameText = inputStream.getText(startIndex, stopIndex);
        }
      }
      
      if (!nameText) {
        // Fallback to extractText
        nameText = this.extractText(namePhrase);
      }
    }
    
    // Extract name without article
    const name = this.extractParameterName(nameText);
    
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
      // Use eenheidExpressie which supports complex units
      const unitExpr = ctx.eenheidExpressie();
      if (unitExpr) {
        unit = this.extractText(unitExpr);
      }
    }
    
    // Check for timeline
    const timeline = ctx.tijdlijn && ctx.tijdlijn() ? true : undefined;
    
    const result: ParameterDefinition = {
      type: 'ParameterDefinition',
      name,
      dataType
    };
    
    if (unit) {
      result.unit = unit;
    }
    
    if (timeline) {
      result.timeline = timeline;
    }
    
    return result;
  }
  
  // Helper to extract parameter name from full reference with article
  private extractParameterName(fullReference: string): string {
    const trimmed = fullReference.trim();
    
    // First try to split by spaces
    const words = trimmed.split(/\s+/);
    
    // If multiple words and first is an article, remove it
    if (words.length > 1 && /^(de|het)$/i.test(words[0])) {
      // Join remaining words with space, preserving multi-word attributes
      return words.slice(1).join(' ');
    }
    
    // Check if article is concatenated with the name (no space)
    const concatenatedMatch = trimmed.match(/^(de|het)(.+)$/i);
    if (concatenatedMatch && concatenatedMatch[2]) {
      // Extract the part after the article
      return concatenatedMatch[2].trim();
    }
    
    return trimmed;
  }

  // Conditional rule support
  visitVoorwaardeDeel(ctx: any): Voorwaarde {
    // voorwaardeDeel : INDIEN ( expressie | toplevelSamengesteldeVoorwaarde )
    
    // For now, we only support simple expressions
    // Complex compound conditions (toplevelSamengesteldeVoorwaarde) can be added later
    if (ctx.expressie && ctx.expressie()) {
      const expression = this.visit(ctx.expressie());
      return {
        type: 'Voorwaarde',
        expression
      };
    }
    
    // TODO: Support toplevelSamengesteldeVoorwaarde for compound conditions
    if (ctx.toplevelSamengesteldeVoorwaarde && ctx.toplevelSamengesteldeVoorwaarde()) {
      throw new Error('Compound conditions (samengestelde voorwaarde) not yet supported');
    }
    
    throw new Error('Expected expression in voorwaardeDeel');
  }

  visitUnaryCheckCondition(ctx: any): any {
    // Visit the expression - it should be a primaryExpression
    const exprCtx = ctx.primaryExpression();
    if (!exprCtx) {
      throw new Error('No expression found in unaryCheckCondition');
    }
    const operand = this.visit(exprCtx);
    
    // Get the operator text - check which token is present
    let operator: string;
    
    if (ctx.IS_LEEG && ctx.IS_LEEG()) {
      operator = 'is leeg';
    } else if (ctx.IS_GEVULD && ctx.IS_GEVULD()) {
      operator = 'is gevuld';
    } else if (ctx.VOLDOET_AAN_DE_ELFPROEF && ctx.VOLDOET_AAN_DE_ELFPROEF()) {
      operator = 'voldoet aan de elfproef';
    } else if (ctx.VOLDOET_NIET_AAN_DE_ELFPROEF && ctx.VOLDOET_NIET_AAN_DE_ELFPROEF()) {
      operator = 'voldoet niet aan de elfproef';
    } else if (ctx.ZIJN_LEEG && ctx.ZIJN_LEEG()) {
      operator = 'zijn leeg';
    } else if (ctx.ZIJN_GEVULD && ctx.ZIJN_GEVULD()) {
      operator = 'zijn gevuld';
    } else if (ctx.VOLDOEN_AAN_DE_ELFPROEF && ctx.VOLDOEN_AAN_DE_ELFPROEF()) {
      operator = 'voldoen aan de elfproef';
    } else if (ctx.VOLDOEN_NIET_AAN_DE_ELFPROEF && ctx.VOLDOEN_NIET_AAN_DE_ELFPROEF()) {
      operator = 'voldoen niet aan de elfproef';
    } else {
      throw new Error('Unknown unary check operator');
    }
    
    return {
      type: 'UnaryExpression',
      operator: operator,
      operand: operand
    };
  }

  visitBezieldeRefExpr(ctx: any): any {
    // This handles patterns like "zijn burgerservicenummer"
    const bezieldeRef = ctx.bezieldeReferentie();
    
    // The grammar is: bezieldeReferentie : ZIJN identifier
    // Get the identifier
    const identifierCtx = bezieldeRef.identifier();
    const attribute = identifierCtx ? identifierCtx.getText() : 'unknown';
    
    // For now, we'll return a navigation expression that references the attribute
    // of the current object in scope
    return {
      type: 'NavigationExpression',
      object: {
        type: 'VariableReference',
        variableName: '_subject' // This will need to be resolved to the actual subject
      },
      attribute: attribute
    };
  }

  visitKenmerkFeitResultaat(ctx: any): any {
    // Extract subject (onderwerpReferentie)
    const onderwerpCtx = ctx.onderwerpReferentie();
    const subject = this.visit(onderwerpCtx);
    
    // Extract characteristic name (kenmerkNaam)
    const kenmerkCtx = ctx.kenmerkNaam();
    let characteristic: string;
    
    if (kenmerkCtx) {
      characteristic = this.extractTextWithSpaces(kenmerkCtx);
    } else {
      throw new Error('Could not extract characteristic from kenmerktoekenning');
    }
    
    return {
      type: 'Kenmerktoekenning',
      subject,
      characteristic
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
      console.log('ResultaatDeelContext text:', text);
      console.log('ResultaatDeelContext children:', node.children?.length);
      if (text.includes(' is ')) {
        throw new Error('Expected gelijkstelling pattern (moet berekend worden als)');
      }
      if (text.includes('wordt verdeeld over')) {
        // This is a verdeling pattern, but we shouldn't be in visitChildren
        throw new Error('Verdeling pattern not being handled correctly in visitResultaatDeel');
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
  
  visitConsistentieregel(ctx: any): any {
    // Get the rule name
    const naam = ctx.naamwoord() ? this.extractText(ctx.naamwoord()) : '<unknown_consistentieregel>';
    
    // Determine which type of consistency result we have
    let resultaat = null;
    let voorwaarde = undefined;
    
    if (ctx.uniekzijnResultaat()) {
      // Handle uniqueness check
      resultaat = this.visitUniekzijnResultaat(ctx.uniekzijnResultaat());
    } else if (ctx.inconsistentResultaat()) {
      // Handle inconsistency check
      resultaat = this.visitInconsistentResultaat(ctx.inconsistentResultaat());
      // Check if there's a condition
      if (ctx.voorwaardeDeel()) {
        voorwaarde = this.visit(ctx.voorwaardeDeel());
      }
    }
    
    if (!resultaat) {
      throw new Error(`Could not parse consistency rule result for '${naam}'`);
    }
    
    // Return as a Rule with Consistentieregel as the result
    return {
      type: 'Rule',
      name: naam,
      version: { type: 'RuleVersion', validity: 'altijd' },
      result: resultaat,
      condition: voorwaarde
    };
  }
  
  visitUniekzijnResultaat(ctx: any): Consistentieregel {
    // Get the target expression (what must be unique)
    const alleAttrCtx = ctx.alleAttributenVanObjecttype();
    if (!alleAttrCtx) {
      throw new Error('Failed to parse uniqueness target');
    }
    
    const target = this.visitAlleAttributenVanObjecttype(alleAttrCtx);
    if (!target) {
      throw new Error('Failed to parse uniqueness target');
    }
    
    return {
      type: 'Consistentieregel',
      criteriumType: 'uniek',
      target: target
    };
  }
  
  visitAlleAttributenVanObjecttype(ctx: any): AttributeReference {
    // Pattern: DE naamwoord VAN ALLE naamwoord
    // Extract the attribute name (plural form)
    const attrPlural = ctx.naamwoord(0) ? this.extractText(ctx.naamwoord(0)) : null;
    // Extract the object type name
    const objType = ctx.naamwoord(1) ? this.extractText(ctx.naamwoord(1)) : null;
    
    if (!attrPlural || !objType) {
      throw new Error('Failed to parse alle attributen pattern');
    }
    
    // Extract canonical names (remove articles)
    const attrName = this.extractParameterName(attrPlural);
    const objTypeName = this.extractParameterName(objType);
    
    // Create an AttributeReference that represents "attribute of all ObjectType"
    // The path structure represents the navigation: [attribute, "alle", object_type]
    return {
      type: 'AttributeReference',
      path: [attrName, 'alle', objTypeName]
    };
  }
  
  visitInconsistentResultaat(ctx: any): Consistentieregel {
    // Handle inconsistency check
    return {
      type: 'Consistentieregel',
      criteriumType: 'inconsistent'
    };
  }
  
  visitVerdelingResultaat(ctx: any): any {
    // Parse source amount expression
    const sourceAmount = this.visit(ctx._sourceAmount);
    
    // Parse target collection expression
    const targetCollection = this.visit(ctx._targetCollection);
    
    // Parse distribution methods
    const distributionMethods: any[] = [];
    
    // Check for simple single-line format
    if (ctx.verdelingMethodeSimple && ctx.verdelingMethodeSimple()) {
      const simpleCtx = ctx.verdelingMethodeSimple();
      if (simpleCtx.verdelingMethode && simpleCtx.verdelingMethode()) {
        const method = this.visitVerdelingMethode(simpleCtx.verdelingMethode());
        if (method) {
          distributionMethods.push(method);
        }
      }
    }
    
    // Check for multi-line format with bullet points
    else if (ctx.verdelingMethodeMultiLine && ctx.verdelingMethodeMultiLine()) {
      const multiCtx = ctx.verdelingMethodeMultiLine();
      if (multiCtx.verdelingMethodeBulletList && multiCtx.verdelingMethodeBulletList()) {
        const bulletListCtx = multiCtx.verdelingMethodeBulletList();
        const bulletContexts = bulletListCtx.verdelingMethodeBullet_list ? bulletListCtx.verdelingMethodeBullet_list() : [];
        for (const bulletCtx of bulletContexts) {
          if (bulletCtx.verdelingMethode && bulletCtx.verdelingMethode()) {
            const method = this.visitVerdelingMethode(bulletCtx.verdelingMethode());
            if (method) {
              distributionMethods.push(method);
            }
          }
        }
      }
    }
    
    // Parse remainder target if present
    let remainderTarget = undefined;
    if (ctx.verdelingRest && ctx.verdelingRest()) {
      const restCtx = ctx.verdelingRest();
      if (restCtx._remainderTarget) {
        remainderTarget = this.visit(restCtx._remainderTarget);
      }
    }
    
    return {
      type: 'Verdeling',
      sourceAmount,
      targetCollection,
      distributionMethods,
      remainderTarget
    };
  }
  
  visitVerdelingMethode(ctx: any): any {
    // Check the context type to determine which method it is
    const ctxName = ctx.constructor.name;
    
    if (ctxName === 'VerdelingGelijkeDelenContext') {
      return { type: 'VerdelingGelijkeDelen' };
    }
    else if (ctxName === 'VerdelingNaarRatoContext') {
      const ratioExpression = this.visit(ctx.ratioExpression);
      return {
        type: 'VerdelingNaarRato',
        ratioExpression
      };
    }
    else if (ctxName === 'VerdelingOpVolgordeContext') {
      const orderDirection = ctx.orderDirection?.text || 'toenemende';
      const orderExpression = this.visit(ctx.orderExpression);
      return {
        type: 'VerdelingOpVolgorde',
        orderDirection: orderDirection as 'toenemende' | 'afnemende',
        orderExpression
      };
    }
    else if (ctxName === 'VerdelingTieBreakContext') {
      const tieBreakMethod = this.visitVerdelingMethode(ctx.tieBreakMethod);
      return {
        type: 'VerdelingTieBreak',
        tieBreakMethod
      };
    }
    else if (ctxName === 'VerdelingMaximumContext') {
      const maxExpression = this.visit(ctx.maxExpression);
      return {
        type: 'VerdelingMaximum',
        maxExpression
      };
    }
    else if (ctxName === 'VerdelingAfrondingContext') {
      const decimals = ctx.decimals ? parseInt(ctx.decimals.text) : 0;
      const roundDirection = ctx.roundDirection?.text || 'naar beneden';
      return {
        type: 'VerdelingAfronding',
        decimals,
        roundDirection: roundDirection as 'naar beneden' | 'naar boven'
      };
    }
    
    // Handle comma-separated methods
    if (ctx.verdelingMethode && ctx.verdelingMethode()) {
      return this.visitVerdelingMethode(ctx.verdelingMethode());
    }
    
    console.warn(`Unknown verdeling method type: ${ctxName}`);
    return null;
  }
}