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
  UnaryMinusExprContext,
  DateCalcExprContext
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
import { AttributeReference, StringLiteral, Literal } from '../ast/expressions';
import { UnitSystemDefinition, UnitDefinition, UnitConversion } from '../ast/unit-systems';
import { Dimension, DimensionLabel, DimensionedAttributeReference } from '../ast/dimensions';
import { FeitType, Rol } from '../ast/feittype';
import { DomainModel } from '../ast/domain-model';

/**
 * Implementation of ANTLR4 visitor that builds our AST
 */
export class RegelSpraakVisitorImpl extends ParseTreeVisitor<any> implements RegelSpraakVisitor<any> {
  
  visitRegelSpraakDocument(ctx: RegelSpraakDocumentContext): DomainModel {
    // Create a proper DomainModel
    const model: DomainModel = {
      objectTypes: [],
      parameters: [],
      regels: [],
      regelGroepen: [],
      beslistabels: [],
      dimensions: [],
      dagsoortDefinities: [],
      domains: [],
      feitTypes: []
    };
    
    // Get all top-level elements
    const definitions = ctx.definitie_list() || [];
    const rules = ctx.regel_list() || [];
    const regelGroups = ctx.regelGroep_list() || [];
    const beslistabels = ctx.beslistabel_list() || [];
    const consistentieregels = ctx.consistentieregel_list() || [];
    const eenheidsystems = ctx.eenheidsysteemDefinition_list() || [];
    
    // Visit definitions and categorize them
    for (const def of definitions) {
      const result = this.visit(def);
      if (result) {
        // Categorize based on type
        if (result.type === 'ObjectTypeDefinition') {
          model.objectTypes.push(result);
        } else if (result.type === 'ParameterDefinition') {
          model.parameters.push(result);
        } else if (result.type === 'Dimension') {
          model.dimensions.push(result);
        } else if (result.type === 'DagsoortDefinitie') {
          model.dagsoortDefinities.push(result);
        } else if (result.type === 'DomainReference') {
          model.domains.push(result);
        } else if (result.type === 'FeitType') {
          model.feitTypes.push(result);
        }
      }
    }
    
    // Visit rules and add to regels
    for (const rule of rules) {
      const result = this.visit(rule);
      if (result) {
        model.regels.push(result);
      }
    }
    
    // Visit consistency rules and add to regels
    for (const consistentieregel of consistentieregels) {
      const result = this.visit(consistentieregel);
      if (result) {
        model.regels.push(result);
      }
    }
    
    // Visit beslistabels
    for (const beslistabel of beslistabels) {
      const result = this.visit(beslistabel);
      if (result) {
        model.beslistabels.push(result);
      }
    }
    
    // Visit regel groups
    for (const regelGroup of regelGroups) {
      const result = this.visit(regelGroup);
      if (result) {
        model.regelGroepen.push(result);
      }
    }
    
    return model;
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
    
    // Check for optional unit
    const unitCtx = ctx.unitIdentifier();
    if (unitCtx) {
      const unit = unitCtx.getText();
      return {
        type: 'NumberLiteral',
        value,
        unit
      } as NumberLiteral;
    }
    
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

  visitDateCalcExpr(ctx: any): Expression {
    // Handle DateCalcExpr - check if it's actually a date calculation or arithmetic with units
    const left = this.visit(ctx.primaryExpression(0));
    const right = this.visit(ctx.primaryExpression(1));
    const identifier = ctx.identifier()?.getText() || '';
    
    // Check if the identifier is a time unit
    const timeUnits = ['dagen', 'dag', 'maanden', 'maand', 'jaren', 'jaar', 'weken', 'week', 
                       'uren', 'uur', 'minuten', 'minuut', 'seconden', 'seconde'];
    
    if (!timeUnits.includes(identifier.toLowerCase())) {
      // Not a date calculation - treat as arithmetic with the identifier as unit
      // If right is a number literal, add the unit to it
      if (right.type === 'NumberLiteral' && identifier) {
        (right as NumberLiteral).unit = identifier;
      }
    }
    
    // Create binary expression
    const operator = ctx.PLUS() ? '+' : '-';
    
    return {
      type: 'BinaryExpression',
      operator: operator,
      left: left,
      right: right
    } as BinaryExpression;
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

  visitEnumLiteralExpr(ctx: any): Expression {
    // Get the enum literal token
    const text = ctx.ENUM_LITERAL().getText();
    
    // Remove surrounding quotes
    const value = text.slice(1, -1);
    
    return {
      type: 'StringLiteral',  // Treat enum literals as string literals for now
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

  visitTijdsduurFuncExpr(ctx: any): Expression {
    // TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?
    const fromExpr = this.visit(ctx.primaryExpression(0));
    const toExpr = this.visit(ctx.primaryExpression(1));
    
    // Check for unit specification
    const unit = ctx._unitName ? ctx._unitName.text : undefined;
    
    const funcCall: FunctionCall = {
      type: 'FunctionCall',
      functionName: 'tijdsduur_van',
      arguments: [fromExpr, toExpr],
      unitConversion: unit
    };
    
    return funcCall;
  }

  visitAbsTijdsduurFuncExpr(ctx: any): Expression {
    // DE_ABSOLUTE_TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?
    const fromExpr = this.visit(ctx.primaryExpression(0));
    const toExpr = this.visit(ctx.primaryExpression(1));
    
    // Check for unit specification
    const unit = ctx.unitName ? ctx.unitName.text : undefined;
    
    const funcCall: FunctionCall = {
      type: 'FunctionCall',
      functionName: 'abs_tijdsduur_van',
      arguments: [fromExpr, toExpr],
      unitConversion: unit
    };
    
    return funcCall;
  }
  
  visitSomFuncExpr(ctx: any): Expression {
    // SOM_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression
    // This handles "de som van X, Y en Z" pattern
    
    const args: Expression[] = [];
    
    // Get all primary expressions
    const primaryExprs = ctx.primaryExpression_list();
    if (primaryExprs && primaryExprs.length > 0) {
      for (const expr of primaryExprs) {
        args.push(this.visit(expr));
      }
    }
    
    return {
      type: 'FunctionCall',
      functionName: 'som',
      arguments: args
    } as FunctionCall;
  }
  
  visitSomAlleAttribuutExpr(ctx: any): Expression {
    // SOM_VAN ALLE attribuutReferentie
    // This handles patterns like "de som van alle belasting van passagiers die minderjarig zijn"
    const attrRef = this.visitAttribuutReferentie(ctx.attribuutReferentie());
    
    if (!attrRef) {
      throw new Error('No attribute reference found in som_van function');
    }
    
    return {
      type: 'FunctionCall',
      functionName: 'som_van',
      arguments: [attrRef]
    } as FunctionCall;
  }
  
  private _stripArticle(text: string): string {
    // Strip leading articles like Python does
    const articles = ['de ', 'het ', 'een '];
    const lowerText = text.toLowerCase();
    
    for (const article of articles) {
      if (lowerText.startsWith(article)) {
        return text.substring(article.length);
      }
    }
    
    return text;
  }

  visitDimensieAggExpr(ctx: any): Expression {
    // This handles aggregation patterns like:
    // "de som van het salaris van alle personen"
    // "het maximum van de leeftijd van alle personen"
    
    // Pattern: <aggregation_function> <attribute_reference> <optional: van alle objecttype>
    if (ctx.getChildCount() < 2) {
      throw new Error(`DimensieAggExpr must have at least 2 children, got ${ctx.getChildCount()}`);
    }
    
    // Extract the aggregation function name by looking at the first child
    let functionName = '';
    const firstChild = ctx.getChild(0);
    if (firstChild) {
      const text = firstChild.getText().toLowerCase();
      if (text.includes('som')) {
        functionName = 'som_van';
      } else if (text.includes('gemiddelde')) {
        functionName = 'gemiddelde_van';
      } else if (text.includes('maximale')) {
        functionName = 'maximum_van';
      } else if (text.includes('minimale')) {
        functionName = 'minimum_van';
      } else if (text.includes('totaal')) {
        functionName = 'totaal_van';
      }
    }
    
    if (!functionName) {
      throw new Error('Unknown aggregation function in DimensieAggExpr');
    }
    
    // Get the attribute reference using attribuutMetLidwoord
    const attrMetLidwoordCtx = ctx.attribuutMetLidwoord ? ctx.attribuutMetLidwoord() : null;
    
    if (!attrMetLidwoordCtx) {
      throw new Error('Expected attribuutMetLidwoord in DimensieAggExpr');
    }
    
    // Get attribute name and strip article
    const attrName = this.extractTextWithSpaces(attrMetLidwoordCtx);
    const strippedAttrName = this._stripArticle(attrName);
    
    // Create AttributeReference for the attribute
    const attrRef: AttributeReference = {
      type: 'AttributeReference',
      path: [strippedAttrName]
    };
    
    // Look for dimensieSelectie context which contains the collection reference
    const dimensieSelectieCtx = ctx.dimensieSelectie ? ctx.dimensieSelectie() : null;
    
    if (dimensieSelectieCtx && dimensieSelectieCtx.aggregerenOverAlleDimensies && 
        dimensieSelectieCtx.aggregerenOverAlleDimensies()) {
      // Has "alle" pattern - get the collection name
      const aggCtx = dimensieSelectieCtx.aggregerenOverAlleDimensies();
      const naamwoordCtx = aggCtx.naamwoord ? aggCtx.naamwoord() : null;
      
      if (naamwoordCtx) {
        const collectionName = this.extractTextWithSpaces(naamwoordCtx);
        
        // Create AttributeReference for the collection
        const collectionRef: AttributeReference = {
          type: 'AttributeReference',
          path: [collectionName]
        };
        
        // Return FunctionCall with both arguments
        return {
          type: 'FunctionCall',
          functionName,
          arguments: [attrRef, collectionRef]
        } as FunctionCall;
      }
    }
    
    // No collection specified, just return function with attribute
    return {
      type: 'FunctionCall',
      functionName,
      arguments: [attrRef]
    } as FunctionCall;
  }
  
  visitAantalFuncExpr(ctx: any): Expression {
    // HET? AANTAL (ALLE? onderwerpReferentie)
    // Check if ALLE token is present
    const hasAlle = ctx.ALLE && ctx.ALLE();
    
    // Get the onderwerp reference (which might include subselectie)
    const onderwerpCtx = ctx.onderwerpReferentie();
    
    if (!onderwerpCtx) {
      throw new Error('Expected onderwerpReferentie in aantal expression');
    }
    
    // If ALLE is present, we need to handle this specially
    if (hasAlle) {
      // Visit the onderwerpReferentie to get the object type
      const onderwerpExpr = this.visit(onderwerpCtx);
      
      // If it's a VariableReference, convert to AttributeReference
      if (onderwerpExpr && onderwerpExpr.type === 'VariableReference') {
        const objectType = onderwerpExpr.variableName;
        // Create an AttributeReference representing "alle <objectType>"
        const attrRef = {
          type: 'AttributeReference',
          path: [objectType]
        } as AttributeReference;
        
        return {
          type: 'FunctionCall',
          functionName: 'aantal',
          arguments: [attrRef]
        } as FunctionCall;
      }
    }
    
    // Normal case: just visit the onderwerp reference
    const onderwerpExpr = this.visit(onderwerpCtx);
    
    return {
      type: 'FunctionCall',
      functionName: 'aantal',
      arguments: [onderwerpExpr]
    } as FunctionCall;
  }

  visitHetAantalDagenInExpr(ctx: any): Expression {
    // HET AANTAL DAGEN IN (DE? MAAND | HET? JAAR) DAT expressie
    let periodType: string;
    
    // Check if MAAND or JAAR token is present
    if (ctx.MAAND && ctx.MAAND()) {
      periodType = 'maand';
    } else if (ctx.JAAR && ctx.JAAR()) {
      periodType = 'jaar';
    } else {
      throw new Error('Expected MAAND or JAAR in aantal dagen expression');
    }
    
    // Get the condition expression after DAT
    const conditionCtx = ctx.expressie();
    if (!conditionCtx) {
      throw new Error('Expected condition expression after DAT');
    }
    
    const conditionExpr = this.visit(conditionCtx);
    
    // Create literal for period type
    const periodLiteral = {
      type: 'Literal',
      value: periodType,
      datatype: 'string'
    };
    
    return {
      type: 'FunctionCall',
      functionName: 'aantal_dagen_in',
      arguments: [periodLiteral, conditionExpr]
    } as FunctionCall;
  }

  visitSubordinateIsWithExpr(ctx: any): Expression {
    // Handle "hij actief is" pattern 
    // This is parsed as: subject=onderwerpReferentie prepPhrase=naamwoord verb=IS
    // But for "hij actief is", actief is a kenmerk, not a prepositional phrase
    
    // Get the subject and prepPhrase from the context
    const subjectCtx = ctx.onderwerpReferentie ? ctx.onderwerpReferentie() : null;
    const prepPhraseCtx = ctx.naamwoord ? ctx.naamwoord() : null;
    
    if (!subjectCtx || !prepPhraseCtx) {
      throw new Error('Invalid SubordinateIsWithExpr context');
    }
    
    const subject = this.visit(subjectCtx);
    const prepPhrase = this.extractTextWithSpaces(prepPhraseCtx);
    
    // Check if this is actually a kenmerk pattern
    // For now, assume it's a boolean kenmerk check
    const kenmerkKey = `is ${prepPhrase}`;
    
    // Create an attribute reference for the kenmerk
    const kenmerkRef: AttributeReference = {
      type: 'AttributeReference',
      path: ['self', kenmerkKey]
    };
    
    // Return a boolean expression that's always true if the kenmerk exists
    // This is a simplification - in reality we'd check the actual value
    return kenmerkRef;
  }

  visitSubordinateHasExpr(ctx: any): Expression {
    // Handle "hij een recht op belastingvermindering heeft" pattern
    // This is parsed as: subject=onderwerpReferentie object=naamwoord verb=HEEFT
    
    // Get the subject and object from the context
    const subjectCtx = ctx.onderwerpReferentie ? ctx.onderwerpReferentie() : null;
    const objectCtx = ctx.naamwoord ? ctx.naamwoord() : null;
    
    if (!subjectCtx || !objectCtx) {
      throw new Error('Invalid SubordinateHasExpr context');
    }
    
    const subject = this.visit(subjectCtx);
    let objectText = this.extractTextWithSpaces(objectCtx);
    
    // Strip leading articles from the attribute name
    // "een recht op belastingvermindering" -> "recht op belastingvermindering"
    const articles = ['de ', 'het ', 'een '];
    for (const article of articles) {
      if (objectText.startsWith(article)) {
        objectText = objectText.substring(article.length);
        break;
      }
    }
    
    // If subject is "hij", it refers to the current instance (pronoun resolution)
    // The object becomes the attribute name we want to check
    
    // Create an attribute reference for the attribute
    const attributeRef: AttributeReference = {
      type: 'AttributeReference',
      path: ['self', objectText]
    };
    
    // Return the attribute reference - it will be evaluated as truthy/falsy
    return attributeRef;
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

  visitRegelGroep(ctx: any): any {
    // Extract group name
    const nameCtx = ctx.naamwoord();
    if (!nameCtx) {
      throw new Error('Expected regel group name');
    }
    const name = this.extractTextWithSpaces(nameCtx).trim();
    
    // Check if it's marked as recursive
    const isRecursive = ctx.IS_RECURSIEF() !== null;
    
    // Visit all rules in the group
    const rules: any[] = [];
    const regelContexts = ctx.regel_list() || [];
    const consistentieCtxs = ctx.consistentieregel_list() || [];
    
    // Visit regular rules
    for (const regelCtx of regelContexts) {
      const rule = this.visit(regelCtx);
      if (rule) {
        rules.push(rule);
      }
    }
    
    // Visit consistency rules
    for (const consistentieCtx of consistentieCtxs) {
      const rule = this.visit(consistentieCtx);
      if (rule) {
        rules.push(rule);
      }
    }
    
    return {
      type: 'RegelGroep',
      name,
      isRecursive,
      rules
    };
  }

  visitAttribuutReferentie(ctx: any): AttributeReference | NavigationExpression | DimensionedAttributeReference {
    // attribuutReferentie : attribuutMetLidwoord VAN onderwerpReferentie
    const attrCtx = ctx.attribuutMetLidwoord();
    const attrText = this.extractTextWithSpaces(attrCtx);
    
    // Check for dimensional patterns like "het bruto inkomen" or "het inkomen van huidig jaar"
    const dimensionKeywords = ['bruto', 'netto', 'huidig jaar', 'vorig jaar', 'volgend jaar'];
    const dimensionLabels: string[] = [];
    
    // Check if attribute contains dimension keywords (adjectival style)
    let cleanAttrText = attrText;
    for (const keyword of dimensionKeywords) {
      if (attrText.includes(keyword)) {
        dimensionLabels.push(keyword);
        // Remove the dimension keyword from the attribute text
        cleanAttrText = cleanAttrText.replace(keyword, '').trim();
      }
    }
    
    // Handle prepositional dimensions: "het inkomen van huidig jaar van de persoon"
    // Need to detect if the first part of onderwerpReferentie is a dimension label
    const onderwerpCtx = ctx.onderwerpReferentie();
    const onderwerpBasisCtx = onderwerpCtx.onderwerpBasis ? onderwerpCtx.onderwerpBasis() : null;
    if (onderwerpBasisCtx) {
      const onderwerpText = this.extractTextWithSpaces(onderwerpBasisCtx);
      
      // Check if this is a dimension keyword
      let isDimensionKeyword = false;
      let matchedKeyword = '';
      for (const keyword of dimensionKeywords) {
        if (onderwerpText.includes(keyword)) {
          isDimensionKeyword = true;
          matchedKeyword = keyword;
          break;
        }
      }
      
      if (isDimensionKeyword && !dimensionLabels.includes(matchedKeyword)) {
        dimensionLabels.push(matchedKeyword);
        
        // Now we need to modify the parsing to skip this dimension part
        // The actual object reference is after the dimension
        // For "het inkomen van huidig jaar van de persoon", we need to get "de persoon"
        
        // This is a complex case - let's handle it by manually visiting the rest
        // For now, return a simplified structure
        const navExpr = {
          type: 'NavigationExpression',
          attribute: this.extractParameterName(cleanAttrText),
          object: {
            type: 'VariableReference',
            variableName: 'persoon' // TODO: Extract this properly
          }
        } as NavigationExpression;
        
        return {
          type: 'DimensionedAttributeReference',
          baseAttribute: navExpr,
          dimensionLabels
        } as DimensionedAttributeReference;
      }
    }
    
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
        
        const navExpr = {
          type: 'NavigationExpression',
          attribute: actualAttr,
          object: currentObject
        } as NavigationExpression;
        
        // If we have dimension labels, wrap in DimensionedAttributeReference
        if (dimensionLabels.length > 0) {
          return {
            type: 'DimensionedAttributeReference',
            baseAttribute: navExpr,
            dimensionLabels
          } as DimensionedAttributeReference;
        }
        
        return navExpr;
      }
      
      const navExpr = {
        type: 'NavigationExpression',
        attribute: actualAttr,
        object: baseObjectExpr
      } as NavigationExpression;
      
      // If we have dimension labels, wrap in DimensionedAttributeReference
      if (dimensionLabels.length > 0) {
        return {
          type: 'DimensionedAttributeReference',
          baseAttribute: navExpr,
          dimensionLabels
        } as DimensionedAttributeReference;
      }
      
      return navExpr;
    }
    
    // Simple case: no nested navigation in attribute
    const attrName = this.extractParameterName(cleanAttrText);
    
    // Check if the onderwerp has filtering (predicates)
    const predicaatCtx = onderwerpCtx.predicaat ? onderwerpCtx.predicaat() : null;
    if (predicaatCtx && (onderwerpCtx.DIE && onderwerpCtx.DIE() || onderwerpCtx.DAT && onderwerpCtx.DAT())) {
      // We have a subselectie - use NavigationExpression instead of AttributeReference
      const objectExpr = this.visitOnderwerpReferentie(onderwerpCtx);
      
      const navExpr = {
        type: 'NavigationExpression',
        attribute: attrName,
        object: objectExpr
      } as NavigationExpression;
      
      // If we have dimension labels, wrap in DimensionedAttributeReference
      if (dimensionLabels.length > 0) {
        return {
          type: 'DimensionedAttributeReference',
          baseAttribute: navExpr,
          dimensionLabels
        } as DimensionedAttributeReference;
      }
      
      return navExpr;
    }
    
    // No filtering - use AttributeReference with path
    const objectPath = this.visitOnderwerpReferentieToPath(onderwerpCtx);
    
    // Build the full path for AttributeReference
    // For "Het dagen aantal van een Test", this becomes ["dagen aantal", "Test"]
    const fullPath = [attrName, ...objectPath];
    
    // Create AttributeReference with the full path
    const attrRef = {
      type: 'AttributeReference',
      path: fullPath
    } as AttributeReference;
    
    // If we have dimension labels, wrap in DimensionedAttributeReference
    if (dimensionLabels.length > 0) {
      return {
        type: 'DimensionedAttributeReference',
        baseAttribute: attrRef,
        dimensionLabels
      } as DimensionedAttributeReference;
    }
    
    return attrRef;
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
    // Check if ALLE token is present
    const hasAlle = basisOnderwerpCtx.ALLE && basisOnderwerpCtx.ALLE();
    
    // Extract the identifier(s)
    const identifiers = basisOnderwerpCtx.identifierOrKeyword ? basisOnderwerpCtx.identifierOrKeyword() : [];
    
    if (identifiers.length > 0) {
      const objectTypeName = Array.isArray(identifiers) 
        ? identifiers.map(id => id.getText()).join(' ')
        : identifiers.getText();
        
      // Note: If hasAlle is true, we still return a regular VariableReference
      // The handling of "alle" is done by the parent context (e.g., in aggregation functions)
        
      return {
        type: 'VariableReference',
        variableName: objectTypeName
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
  
  // Helper method to convert onderwerpReferentie to a path list
  visitOnderwerpReferentieToPath(ctx: any): string[] {
    if (!ctx) {
      return [];
    }
    
    // onderwerpReferentie : onderwerpBasis ( (DIE | DAT) predicaat )?
    // For now, just handle the simple case without predicates
    const onderwerpBasisCtx = ctx.onderwerpBasis();
    if (!onderwerpBasisCtx) {
      return [];
    }
    
    const expr = this.visitOnderwerpBasis(onderwerpBasisCtx);
    
    // Convert the expression to a path
    if (expr.type === 'VariableReference') {
      const varRef = expr as VariableReference;
      return [varRef.variableName];
    }
    
    // For other expression types, we'd need more complex handling
    return [];
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
    console.log('visitResultaatDeel context type:', ctx.constructor.name);
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
    
    // Visit the attribute reference to get the full AttributeReference
    const target = this.visitAttribuutReferentie(targetCtx);
    
    if (!target) {
      throw new Error('Failed to parse gelijkstelling target');
    }
    
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
    const trimmed = fullReference.trim();
    
    // First try to split by spaces
    const words = trimmed.split(/\s+/);
    
    // If multiple words and first is an article, remove it
    if (words.length > 1 && /^(de|het|een)$/i.test(words[0])) {
      // Join remaining words with space, preserving multi-word attributes
      return words.slice(1).join(' ').toLowerCase();
    }
    
    // Check if article is concatenated with the name (no space)
    const concatenatedMatch = trimmed.match(/^(de|het|een)(.+)$/i);
    if (concatenatedMatch && concatenatedMatch[2]) {
      // Extract the part after the article
      return concatenatedMatch[2].toLowerCase();
    }
    
    return trimmed.toLowerCase();
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
  
  visitDimensieDefinition(ctx: any): Dimension {
    // Get dimension name
    const nameCtx = ctx.naamwoord(0); // First naamwoord is the dimension name
    const nameText = this.extractTextWithSpaces(nameCtx);
    const name = this.extractParameterName(nameText);
    
    // Get plural form - it's labeled as dimensieNaamMeervoud
    const pluralCtx = ctx._dimensieNaamMeervoud;
    let plural = '';
    if (pluralCtx) {
      const pluralText = this.extractTextWithSpaces(pluralCtx);
      plural = this.extractParameterName(pluralText);
    }
    
    // Determine usage style and preposition
    let usageStyle: 'prepositional' | 'adjectival';
    let preposition: string | undefined;
    
    const voorzetselSpec = ctx.voorzetselSpecificatie();
    
    if (voorzetselSpec && voorzetselSpec.NA_HET_ATTRIBUUT_MET_VOORZETSEL && voorzetselSpec.NA_HET_ATTRIBUUT_MET_VOORZETSEL()) {
      usageStyle = 'prepositional';
      // Get the preposition (voorzetsel) - it's labeled as vz
      const vzCtx = voorzetselSpec._vz;
      if (vzCtx) {
        preposition = this.extractText(vzCtx);
      }
    } else if (voorzetselSpec && voorzetselSpec.VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL && voorzetselSpec.VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL()) {
      usageStyle = 'adjectival';
    } else {
      // Default to prepositional with 'van' if not specified
      usageStyle = 'prepositional';
      preposition = 'van';
    }
    
    // Get labels
    const labels: DimensionLabel[] = [];
    const labelSpecs = ctx.labelWaardeSpecificatie_list() || [];
    
    for (const labelSpec of labelSpecs) {
      const position = parseInt(labelSpec.NUMBER().getText());
      const labelCtx = labelSpec.naamwoord();
      const label = this.extractTextWithSpaces(labelCtx);
      
      labels.push({
        position,
        label
      });
    }
    
    return {
      type: 'Dimension',
      name,
      plural,
      usageStyle,
      preposition,
      labels
    };
  }

  visitFeitTypeDefinition(ctx: any): FeitType {
    // Check if it's wederkerig (reciprocal)
    const wederkerig = Boolean(ctx.WEDERKERIG_FEITTYPE && ctx.WEDERKERIG_FEITTYPE());
    
    // Extract the feittype name - _feittypenaam is a naamwoord context
    const naamCtx = ctx._feittypenaam;
    let naam = '';
    if (naamCtx) {
      naam = this.extractTextWithSpaces(naamCtx);
    }
    
    // Extract roles from rolDefinition elements
    const rollen: Rol[] = [];
    const rolDefs = ctx.rolDefinition_list() || [];
    
    for (const rolDef of rolDefs) {
      const rol = this.visitRolDefinition(rolDef);
      if (rol) {
        rollen.push(rol);
      }
    }
    
    // Extract cardinality description from cardinalityLine
    let cardinalityDescription: string | undefined;
    const cardinalityLineCtx = ctx.cardinalityLine();
    if (cardinalityLineCtx) {
      cardinalityDescription = this.extractCardinalityLine(cardinalityLineCtx);
    }
    
    return {
      type: 'FeitType',
      naam,
      wederkerig,
      rollen,
      cardinalityDescription
    };
  }

  visitRolDefinition(ctx: any): Rol | null {
    // Extract role name from _content field
    const contentCtx = ctx._content;
    if (!contentCtx) {
      return null;
    }
    
    // Parse the content more carefully - it contains multiple words
    const words: string[] = [];
    if (contentCtx.children) {
      for (const child of contentCtx.children) {
        if (child.getText) {
          words.push(child.getText());
        }
      }
    }
    
    // Get object type - it's labeled as _objecttype
    let objectType = '';
    if (ctx._objecttype) {
      objectType = this.extractText(ctx._objecttype);
    }
    
    // Determine role name based on the words
    let roleName = '';
    if (!objectType && words.length > 0) {
      // No explicit object type, so last word is the object type
      objectType = words[words.length - 1];
      roleName = words.slice(0, -1).join(' ');
    } else {
      // Object type is explicit, so all words are the role name
      roleName = words.join(' ');
    }
    
    // Check for plural form - it's labeled as _meervoud
    let meervoud: string | undefined;
    if (ctx._meervoud) {
      meervoud = this.extractTextWithSpaces(ctx._meervoud);
    }
    
    return {
      type: 'Rol',
      naam: roleName,
      meervoud,
      objectType
    };
  }

  private extractCardinalityLine(ctx: any): string {
    // Extract the full text of the cardinality line
    const tokens: string[] = [];
    
    // Traverse all children to get text
    if (ctx.children) {
      for (const child of ctx.children) {
        if (child.getText) {
          const text = child.getText();
          if (text && text.trim()) {
            tokens.push(text);
          }
        }
      }
    }
    
    return tokens.join(' ');
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
    
    // Return an AttributeReference with 'self' path, matching Python implementation
    return {
      type: 'AttributeReference',
      path: ['self', attribute]
    };
  }
  
  visitBooleanTrueLiteralExpr(ctx: any): Expression {
    return {
      type: 'BooleanLiteral',
      value: true
    } as Expression;
  }
  
  visitBooleanFalseLiteralExpr(ctx: any): Expression {
    return {
      type: 'BooleanLiteral',
      value: false
    } as Expression;
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
      const text = this.extractTextWithSpaces(node).trim();
      console.log('ResultaatDeelContext text:', text);
      console.log('ResultaatDeelContext children:', node.children?.length);
      console.log('ResultaatDeelContext child types:', node.children?.map((c: any) => c.constructor.name));
      if (text.includes(' is ')) {
        throw new Error('Expected gelijkstelling pattern (moet berekend worden als)');
      }
      if (text.includes('wordt verdeeld over')) {
        // This is a verdeling pattern, but we shouldn't be in visitChildren
        throw new Error('Verdeling pattern not being handled correctly in visitResultaatDeel');
      }
      throw new Error('Invalid result pattern in ResultaatDeelContext: ' + text);
    }
    
    // Debug when we hit visitChildren for ExpressieContext  
    if (node.constructor.name === 'ExpressieContext') {
      // ExpressieContext should be handled by visitExpressie
      // If we're here, the visitor dispatch is not working correctly
      // Try to handle it directly
      const logicalExpr = node.logicalExpression ? node.logicalExpression() : null;
      if (logicalExpr) {
        return this.visit(logicalExpr);
      }
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
        const method = this.visit(simpleCtx.verdelingMethode());
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
            const method = this.visit(bulletCtx.verdelingMethode());
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
  
  visitVerdelingGelijkeDelen(ctx: any): any {
    return { type: 'VerdelingGelijkeDelen' };
  }
  
  visitVerdelingNaarRato(ctx: any): any {
    const ratioExpression = this.visit(ctx._ratioExpression);
    return {
      type: 'VerdelingNaarRato',
      ratioExpression
    };
  }
  
  visitVerdelingOpVolgorde(ctx: any): any {
    const orderDirection = ctx._orderDirection?.text || 'toenemende';
    const orderExpression = this.visit(ctx._orderExpression);
    return {
      type: 'VerdelingOpVolgorde',
      orderDirection: orderDirection as 'toenemende' | 'afnemende',
      orderExpression
    };
  }
  
  visitVerdelingTieBreak(ctx: any): any {
    const tieBreakMethod = this.visit(ctx._tieBreakMethod);
    return {
      type: 'VerdelingTieBreak',
      tieBreakMethod
    };
  }
  
  visitVerdelingMaximum(ctx: any): any {
    const maxExpression = this.visit(ctx._maxExpression);
    return {
      type: 'VerdelingMaximum',
      maxExpression
    };
  }
  
  visitVerdelingAfronding(ctx: any): any {
    const decimals = ctx._decimals ? parseInt(ctx._decimals.text) : 0;
    const roundDirection = ctx._roundDirection?.text || 'naar beneden';
    return {
      type: 'VerdelingAfronding',
      decimals,
      roundDirection: roundDirection as 'naar beneden' | 'naar boven'
    };
  }

  // --- Decision Table (Beslistabel) Visitor Methods ---
  
  visitBeslistabel(ctx: any): any {
    const name = this.extractText(ctx.naamwoord()).trim();
    
    // Check if there's a regelVersie (validity rule)
    let validity = 'altijd';  // default
    if (ctx.regelVersie && ctx.regelVersie()) {
      const versie = this.visit(ctx.regelVersie());
      validity = versie.validity || 'altijd';
    }
    
    // Visit the table structure
    const table = this.visit(ctx.beslistabelTable());
    
    return {
      type: 'DecisionTable',
      name,
      validity,
      ...table  // Contains resultColumn, conditionColumns, and rows
    };
  }
  
  visitBeslistabelTable(ctx: any): any {
    // Visit header to get column information
    const header = this.visit(ctx.beslistabelHeader());
    
    // Visit all rows
    const rows = ctx.beslistabelRow_list().map((row: any) => this.visit(row));
    
    return {
      ...header,
      rows
    };
  }
  
  visitBeslistabelHeader(ctx: any): any {
    // Extract result column text including hidden whitespace
    const resultColumn = this.getFullText(ctx._resultColumn);
    
    // Extract condition column texts - they are stored in _conditionColumns array
    const conditionColumns = ctx._conditionColumns ? 
      ctx._conditionColumns.map((col: any) => this.getFullText(col)) : 
      [];
    
    return {
      resultColumn,
      conditionColumns
    };
  }
  
  // Helper to get full text including hidden whitespace
  private getFullText(ctx: any): string {
    if (!ctx) return '';
    
    // Access the input stream directly to get original text with spaces
    if (ctx.start && ctx.stop && ctx.parser) {
      const inputStream = ctx.parser.getInputStream();
      if (inputStream) {
        // Get the text directly from input stream
        const startIndex = ctx.start.startIndex;
        const stopIndex = ctx.stop.stopIndex;
        if (startIndex >= 0 && stopIndex >= startIndex) {
          return inputStream.getText(startIndex, stopIndex);
        }
      }
    }
    
    // Fallback to extractTextWithSpaces
    return this.extractTextWithSpaces(ctx);
  }
  
  visitBeslistabelRow(ctx: any): any {
    const rowNumber = parseInt(ctx._rowNumber.text);
    const resultExpression = this.visit(ctx._resultExpression);
    
    // Visit all condition values - they are stored in _conditionValues array
    const conditionValues = ctx._conditionValues ? 
      ctx._conditionValues.map((value: any) => this.visit(value)) : 
      [];
    
    return {
      type: 'DecisionTableRow',
      rowNumber,
      resultExpression,
      conditionValues
    };
  }
  
  visitBeslistabelCellValue(ctx: any): any {
    // Check if this is n.v.t. or an expression
    if (ctx.NVT && ctx.NVT()) {
      return 'n.v.t.';
    } 
    
    // Otherwise it should be an expression
    const exprCtx = ctx.expressie();
    if (exprCtx) {
      // Direct call to visitExpressie to avoid dispatch issues
      return this.visitExpressie(exprCtx);
    }
    
    // Shouldn't happen with proper grammar
    throw new Error('Invalid decision table cell value');
  }

  // --- Unit System (Eenheidsysteem) Visitor Methods ---
  
  visitEenheidsysteemDefinition(ctx: any): UnitSystemDefinition {
    // Get the name from the identifier (ctx._name holds the labeled identifier context)
    const name = this.extractText(ctx._name);
    
    // Visit all unit entries
    const units = ctx.eenheidEntry_list().map((entry: any) => this.visit(entry));
    
    return {
      type: 'UnitSystemDefinition',
      name,
      units
    };
  }
  
  visitEenheidEntry(ctx: any): UnitDefinition {
    // Extract unit name (e.g., "meter") - labeled as _unitName
    const unitName = this.extractText(ctx._unitName);
    
    // Extract abbreviation (e.g., "m") - labeled as _abbrev
    const abbrev = this.extractText(ctx._abbrev);
    
    // Check for symbol (optional, fourth position) - labeled as _symbol
    let symbol: string | undefined;
    if (ctx._symbol) {
      symbol = this.extractText(ctx._symbol);
    }
    
    // Check for plural form - labeled as _pluralName
    let plural: string | undefined;
    if (ctx._pluralName) {
      plural = this.extractText(ctx._pluralName);
    }
    
    // Check for conversion specification - labeled as _value and _targetUnit
    let conversion: UnitConversion | undefined;
    if (ctx._value && ctx._targetUnit) {
      const isFraction = ctx.SLASH && ctx.SLASH();
      // _value is a token, so use getText() or text property
      const valueText = ctx._value.getText ? ctx._value.getText() : ctx._value.text;
      const numberValue = parseFloat(valueText.replace(',', '.'));
      
      const factor = isFraction ? 1 / numberValue : numberValue;
      // _targetUnit might already be extracted
      const toUnit = ctx._targetUnit.getText ? ctx._targetUnit.getText() : this.extractText(ctx._targetUnit);
      
      conversion = {
        factor,
        toUnit
      };
    }
    
    return {
      name: unitName,
      plural,
      abbreviation: abbrev,
      symbol,
      conversion
    };
  }
  
}