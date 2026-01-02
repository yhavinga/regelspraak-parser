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
  SubselectieExpression,
  RegelStatusExpression,
  Predicaat,
  KenmerkPredicaat,
  AttributeComparisonPredicaat,
  SamengesteldeVoorwaarde,
  Kwantificatie,
  KwantificatieType,
  AfrondingExpression,
  BegrenzingExpression,
  BegrenzingAfrondingExpression,
  ConjunctionExpression,
  DisjunctionExpression,
  AttributeReference,
  StringLiteral,
  Literal,
  BooleanLiteral
} from '../ast/expressions';
import {
  Predicate,
  SimplePredicate,
  CompoundPredicate,
  AttributePredicate,
  QuantifierType as UnifiedQuantifierType,
  fromLegacyKenmerkPredicaat,
  fromLegacyAttributeComparison
} from '../predicates/predicate-types';
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
  VerdelingAfronding,
  FeitCreatie,
  VariableAssignment
} from '../ast/rules';
import { ObjectTypeDefinition, KenmerkSpecification, AttributeSpecification, DataType, DomainReference } from '../ast/object-types';
import { ParameterDefinition } from '../ast/parameters';
import { UnitSystemDefinition, UnitDefinition, UnitConversion } from '../ast/unit-systems';
import { createSourceLocation } from '../ast/location';
import { Dimension, DimensionLabel, DimensionedAttributeReference } from '../ast/dimensions';
import { FeitType, Rol } from '../ast/feittype';
import { DomainModel } from '../ast/domain-model';

/**
 * Implementation of ANTLR4 visitor that builds our AST
 */
export class RegelSpraakVisitorImpl extends ParseTreeVisitor<any> implements RegelSpraakVisitor<any> {
  // Track object types and their attributes for compound attribute resolution
  private objectTypeAttributes: Map<string, Set<string>> = new Map();
  private feitTypes: Map<string, any> = new Map();
  private parameterNames: Set<string> = new Set();

  /**
   * Set location directly on the node.
   * No more WeakMap. Location is part of the node.
   */
  private setLocation(node: any, ctx: any): void {
    if (node && typeof node === 'object' && ctx) {
      node.location = createSourceLocation(ctx);
    }
  }

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
      feitTypes: [],
      unitSystems: []
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
        } else if (result.type === 'Dagsoort' || result.type === 'DagsoortDefinitie') {
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

    // Visit unit systems
    for (const unitSystem of eenheidsystems) {
      const result = this.visit(unitSystem);
      if (result) {
        model.unitSystems.push(result);
      }
    }

    return model;
  }

  visitExpressie(ctx: ExpressieContext): Expression {
    // Handle different expression alternatives based on context type
    const contextName = ctx.constructor.name;

    // Check for specific labeled alternatives
    if (contextName === 'ExprAfrondingContext') {
      return this.visitExprAfronding(ctx);
    } else if (contextName === 'ExprBegrenzingContext') {
      return this.visitExprBegrenzing(ctx);
    } else if (contextName === 'ExprBegrenzingAfrondingContext') {
      return this.visitExprBegrenzingAfronding(ctx);
    }

    // Default case: just delegate to logicalExpression
    const logicalExpr = (ctx as any).logicalExpression ? (ctx as any).logicalExpression() : null;
    if (logicalExpr) {
      return this.visit(logicalExpr);
    }
    // Fallback to visiting children
    return this.visitChildren(ctx);
  }

  visitExprAfronding(ctx: any): Expression {
    // Expression with afronding (rounding)
    const expr = this.visit((ctx as any).logicalExpression());
    if (!expr) {
      return this.visitChildren(ctx);
    }

    const afrondingCtx = (ctx as any).afronding ? (ctx as any).afronding() : null;
    if (!afrondingCtx) {
      return expr;
    }

    // Extract rounding direction
    let direction: AfrondingExpression['direction'] = undefined;
    if (afrondingCtx.NAAR_BENEDEN && afrondingCtx.NAAR_BENEDEN()) {
      direction = 'naar_beneden';
    } else if (afrondingCtx.NAAR_BOVEN && afrondingCtx.NAAR_BOVEN()) {
      direction = 'naar_boven';
    } else if (afrondingCtx.REKENKUNDIG && afrondingCtx.REKENKUNDIG()) {
      direction = 'rekenkundig';
    } else if (afrondingCtx.RICHTING_NUL && afrondingCtx.RICHTING_NUL()) {
      direction = 'richting_nul';
    } else if (afrondingCtx.WEG_VAN_NUL && afrondingCtx.WEG_VAN_NUL()) {
      direction = 'weg_van_nul';
    }

    // Extract decimals
    const decimals = afrondingCtx.NUMBER && afrondingCtx.NUMBER() ?
      parseInt(afrondingCtx.NUMBER().getText(), 10) : 0;

    const result: AfrondingExpression = {
      type: 'AfrondingExpression',
      expression: expr,
      direction,
      decimals
    };
    this.setLocation(result, ctx);
    return result;
  }

  visitExprBegrenzing(ctx: any): Expression {
    // Expression with begrenzing (limiting)
    const expr = this.visit((ctx as any).logicalExpression());
    if (!expr) {
      return this.visitChildren(ctx);
    }

    const begrenzingCtx = (ctx as any).begrenzing ? (ctx as any).begrenzing() : null;
    if (!begrenzingCtx) {
      return expr;
    }

    let minimum: Expression | undefined;
    let maximum: Expression | undefined;

    // Check for minimum
    if (begrenzingCtx.begrenzingMinimum && begrenzingCtx.begrenzingMinimum()) {
      const minCtx = begrenzingCtx.begrenzingMinimum();
      if (minCtx.expressie && minCtx.expressie()) {
        minimum = this.visit(minCtx.expressie());
      }
    }
    // Check for maximum
    else if (begrenzingCtx.begrenzingMaximum && begrenzingCtx.begrenzingMaximum()) {
      const maxCtx = begrenzingCtx.begrenzingMaximum();
      if (maxCtx.expressie && maxCtx.expressie()) {
        maximum = this.visit(maxCtx.expressie());
      }
    }

    const result: BegrenzingExpression = {
      type: 'BegrenzingExpression',
      expression: expr,
      minimum,
      maximum
    };
    this.setLocation(result, ctx);
    return result;
  }

  visitExprBegrenzingAfronding(ctx: any): Expression {
    // Expression with both begrenzing and afronding
    const expr = this.visit((ctx as any).logicalExpression());
    if (!expr) {
      return this.visitChildren(ctx);
    }

    // Handle begrenzing
    let minimum: Expression | undefined;
    let maximum: Expression | undefined;
    const begrenzingCtx = (ctx as any).begrenzing ? (ctx as any).begrenzing() : null;
    if (begrenzingCtx) {
      // Check for minimum
      if (begrenzingCtx.begrenzingMinimum && begrenzingCtx.begrenzingMinimum()) {
        const minCtx = begrenzingCtx.begrenzingMinimum();
        if (minCtx.expressie && minCtx.expressie()) {
          minimum = this.visit(minCtx.expressie());
        }
      }
      // Check for maximum
      else if (begrenzingCtx.begrenzingMaximum && begrenzingCtx.begrenzingMaximum()) {
        const maxCtx = begrenzingCtx.begrenzingMaximum();
        if (maxCtx.expressie && maxCtx.expressie()) {
          maximum = this.visit(maxCtx.expressie());
        }
      }
    }

    // Handle afronding
    let direction: BegrenzingAfrondingExpression['direction'] = undefined;
    let decimals = 0;
    const afrondingCtx = (ctx as any).afronding ? (ctx as any).afronding() : null;
    if (afrondingCtx) {
      // Extract rounding direction
      if (afrondingCtx.NAAR_BENEDEN && afrondingCtx.NAAR_BENEDEN()) {
        direction = 'naar_beneden';
      } else if (afrondingCtx.NAAR_BOVEN && afrondingCtx.NAAR_BOVEN()) {
        direction = 'naar_boven';
      } else if (afrondingCtx.REKENKUNDIG && afrondingCtx.REKENKUNDIG()) {
        direction = 'rekenkundig';
      } else if (afrondingCtx.RICHTING_NUL && afrondingCtx.RICHTING_NUL()) {
        direction = 'richting_nul';
      } else if (afrondingCtx.WEG_VAN_NUL && afrondingCtx.WEG_VAN_NUL()) {
        direction = 'weg_van_nul';
      }

      // Extract decimals
      decimals = afrondingCtx.NUMBER && afrondingCtx.NUMBER() ?
        parseInt(afrondingCtx.NUMBER().getText(), 10) : 0;
    }

    const result: BegrenzingAfrondingExpression = {
      type: 'BegrenzingAfrondingExpression',
      expression: expr,
      minimum,
      maximum,
      direction,
      decimals
    };
    this.setLocation(result, ctx);
    return result;
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

    const node = {
      type: 'BinaryExpression',
      operator: operator as any,
      left,
      right
    } as BinaryExpression;
    this.setLocation(node, ctx);
    return node;
  }

  visitComparisonExpression(ctx: any): Expression {
    // Check which type of comparison expression this is
    const contextName = ctx.constructor.name;

    if (contextName === 'BinaryComparisonExprContext') {
      return this.visitBinaryComparisonExpr(ctx);
    } else if (contextName === 'UnaryConditionExprContext') {
      return this.visitUnaryConditionExpr(ctx);
    } else if (contextName === 'RegelStatusConditionExprContext') {
      return this.visitRegelStatusConditionExpr(ctx);
    } else if (contextName === 'IsKenmerkExprContext') {
      return this.visitIsKenmerkExpr(ctx);
    } else if (contextName === 'HeeftKenmerkExprContext') {
      return this.visitHeeftKenmerkExpr(ctx);
    } else if (contextName === 'SubordinateClauseExprContext') {
      return this.visitSubordinateClauseExpr(ctx);
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

    switch (opText) {
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

    const node = {
      type: 'BinaryExpression',
      operator: operator as any,
      left,
      right
    } as BinaryExpression;
    this.setLocation(node, ctx);
    return node;
  }

  visitUnaryConditionExpr(ctx: any): Expression {
    // UnaryConditionExpr wraps unaryCondition in comparisonExpression
    const unaryConditionCtx = ctx.unaryCondition();
    return this.visitUnaryCondition(unaryConditionCtx);
  }

  visitRegelStatusConditionExpr(ctx: any): Expression {
    // RegelStatusConditionExpr wraps regelStatusCondition in comparisonExpression
    const regelStatusConditionCtx = ctx.regelStatusCondition();
    return this.visitRegelStatusCondition(regelStatusConditionCtx);
  }

  visitRegelStatusCondition(ctx: any): Expression {
    // Extract rule name from naamwoord
    const naamwoordCtx = ctx.name;
    const rawName = this.extractTextWithSpaces(naamwoordCtx);
    const regelNaam = this.extractParameterName(rawName);

    // Extract check type from op token
    const opToken = ctx.op;
    let check: 'gevuurd' | 'inconsistent';
    let predicateOperator: 'gevuurd' | 'inconsistent';

    if (opToken.type === RegelSpraakLexer.GEVUURD) {
      check = 'gevuurd';
      predicateOperator = 'gevuurd';
    } else if (opToken.type === RegelSpraakLexer.INCONSISTENT) {
      check = 'inconsistent';
      predicateOperator = 'inconsistent';
    } else {
      throw new Error(`Unhandled regel status operator: ${opToken.text}`);
    }

    // Create regel status expression with unified predicate
    const node: any = {
      type: 'RegelStatusExpression',
      regelNaam,
      check,
      // Add unified predicate representation
      predicate: {
        type: 'SimplePredicate',
        operator: predicateOperator,
        // Store regel name as a string literal expression
        left: {
          type: 'StringLiteral',
          value: regelNaam
        } as StringLiteral
      } as SimplePredicate
    };

    this.setLocation(node, ctx);
    if (node.predicate) {
      this.setLocation(node.predicate, ctx);
    }
    return node;
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
    } else if (contextName === 'UnaryNumeriekExactConditionContext') {
      return this.visitUnaryNumeriekExactCondition(ctx);
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

    // Determine if negated
    const negated = binaryOp.includes('geen');

    // Create a binary expression with unified predicate
    const node: any = {
      type: 'BinaryExpression',
      operator: binaryOp as any,
      left: expr,
      right: {
        type: 'StringLiteral',
        value: dagsoortName
      },
      // Add unified predicate representation
      predicate: {
        type: 'SimplePredicate',
        operator: 'dagsoort',
        left: expr,
        dagsoort: dagsoortName,
        negated: negated
      } as SimplePredicate
    };
    this.setLocation(node, ctx);
    if (node.predicate) {
      this.setLocation(node.predicate, ctx);
    }
    return node;
  }

  visitUnaryUniekCondition(ctx: any): Expression {
    // ref=onderwerpReferentie MOETEN_UNIEK_ZIJN
    const ref = this.visit(ctx.onderwerpReferentie());

    // Create unary expression with unified predicate
    const node: any = {
      type: 'UnaryExpression',
      operator: 'moeten uniek zijn',
      operand: ref,
      // Add unified predicate representation
      predicate: {
        type: 'SimplePredicate',
        operator: 'uniek',
        left: ref
      } as SimplePredicate
    };
    this.setLocation(node, ctx);
    if (node.predicate) {
      this.setLocation(node.predicate, ctx);
    }
    return node;
  }

  visitUnaryNumeriekExactCondition(ctx: any): Expression {
    // expr=primaryExpression op=(IS_NUMERIEK_MET_EXACT | ...) NUMBER CIJFERS
    const expr = this.visit(ctx.primaryExpression());

    // Get the digit count from NUMBER token
    const digitCountToken = ctx.NUMBER();
    if (!digitCountToken) {
      throw new Error('Expected digit count in numeric exact condition');
    }
    const digitCount = parseInt(digitCountToken.getText());

    // Map operator token to string and determine negation
    let operator: string;
    let negated = false;
    if (ctx.IS_NUMERIEK_MET_EXACT()) {
      operator = 'is numeriek met exact';
    } else if (ctx.IS_NIET_NUMERIEK_MET_EXACT()) {
      operator = 'is niet numeriek met exact';
      negated = true;
    } else if (ctx.ZIJN_NUMERIEK_MET_EXACT()) {
      operator = 'zijn numeriek met exact';
    } else if (ctx.ZIJN_NIET_NUMERIEK_MET_EXACT()) {
      operator = 'zijn niet numeriek met exact';
      negated = true;
    } else {
      throw new Error('Unknown numeric exact operator');
    }

    // Create binary expression with unified predicate
    const node: any = {
      type: 'BinaryExpression',
      left: expr,
      operator: operator,
      right: {
        type: 'NumberLiteral',
        value: digitCount
      },
      // Add unified predicate representation
      predicate: {
        type: 'SimplePredicate',
        operator: 'numeriek_exact',
        left: expr,
        digits: digitCount,
        negated: negated
      } as SimplePredicate
    };
    this.setLocation(node, ctx);
    if (node.predicate) {
      this.setLocation(node.predicate, ctx);
    }
    return node;
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
    // Dispatch to specific visitor methods based on context type
    const contextName = ctx.constructor.name;

    // Handle specific labeled alternatives
    switch (contextName) {
      // Literals
      case 'NumberLiteralExprContext':
        return this.visitNumberLiteralExpr(ctx as any);
      case 'StringLiteralExprContext':
        return this.visitStringLiteralExpr(ctx);
      case 'BooleanTrueLiteralExprContext':
        return this.visitBooleanTrueLiteralExpr(ctx);
      case 'BooleanFalseLiteralExprContext':
        return this.visitBooleanFalseLiteralExpr(ctx);
      case 'DatumLiteralExprContext':
        return this.visitDatumLiteralExpr(ctx);
      case 'PercentageLiteralExprContext':
        // Handle percentage literal - needs implementation
        return this.visitStringLiteralExpr(ctx); // Temporary fallback
      case 'EnumLiteralExprContext':
        return this.visitEnumLiteralExpr(ctx);
      case 'TekstreeksLiteralExprContext':
        // Handle text sequence literal - needs implementation
        return this.visitStringLiteralExpr(ctx); // Temporary fallback

      // References
      case 'OnderwerpRefExprContext':
        return this.visitOnderwerpRefExpr(ctx);
      case 'AttrRefExprContext':
        return this.visitAttrRefExpr(ctx);
      case 'BezieldeRefExprContext':
        return this.visitBezieldeRefExpr(ctx);
      case 'ParamRefExprContext':
        return this.visitParamRefExpr(ctx);
      case 'IdentifierExprContext':
        return this.visitIdentifierExpr(ctx as any);
      case 'NaamwoordExprContext':
        return this.visitNaamwoordExpr(ctx);
      case 'PronounExprContext':
        // Handle pronoun expression - needs implementation
        return this.visitIdentifierExpr(ctx as any); // Temporary fallback

      // Function calls and special expressions
      case 'PasenFuncExprContext':
        return this.visitPasenFuncExpr(ctx);
      case 'SimpleConcatenatieExprContext':
        return this.visitSimpleConcatenatieExpr(ctx);
      case 'AantalFuncExprContext':
        return this.visitAantalFuncExpr(ctx);
      case 'AantalAttribuutExprContext':
        return this.visitAantalAttribuutExpr(ctx);
      case 'EersteDatumFuncExprContext':
        return this.visitEersteDatumFuncExpr(ctx);
      case 'LaatsteDatumFuncExprContext':
        return this.visitLaatsteDatumFuncExpr(ctx);
      case 'SomFuncExprContext':
        return this.visitSomFuncExpr(ctx);
      case 'SomAlleExprContext':
        return this.visitSomAlleExpr(ctx);
      case 'SomAlleAttribuutExprContext':
        return this.visitSomAlleAttribuutExpr(ctx);
      case 'MinAlleAttribuutExprContext':
        // Needs implementation
        return this.visitSomAlleAttribuutExpr(ctx); // Temporary fallback
      case 'MaxAlleAttribuutExprContext':
        // Needs implementation
        return this.visitSomAlleAttribuutExpr(ctx); // Temporary fallback
      case 'TijdsevenredigDeelExprContext':
        return this.visitTijdsevenredigDeelExpr(ctx);
      case 'CapitalizedTijdsevenredigDeelExprContext':
        // Needs implementation - delegate to regular version
        return this.visitTijdsevenredigDeelExpr(ctx);
      case 'TijdsduurFuncExprContext':
        return this.visitTijdsduurFuncExpr(ctx);
      case 'AbsTijdsduurFuncExprContext':
        return this.visitAbsTijdsduurFuncExpr(ctx);
      case 'AbsValFuncExprContext':
        return this.visitAbsValFuncExpr(ctx);
      case 'PercentageFuncExprContext':
        // Needs implementation
        return this.visitAbsValFuncExpr(ctx); // Temporary fallback
      case 'PercentageOfExprContext':
        // Needs implementation
        return this.visitAbsValFuncExpr(ctx); // Temporary fallback
      case 'WortelFuncExprContext':
        return this.visitWortelFuncExpr(ctx);
      case 'MinValFuncExprContext':
        // Needs implementation
        return this.visitAbsValFuncExpr(ctx); // Temporary fallback
      case 'MaxValFuncExprContext':
        // Needs implementation
        return this.visitAbsValFuncExpr(ctx); // Temporary fallback
      case 'JaarUitFuncExprContext':
        return this.visitJaarUitFuncExpr(ctx);
      case 'MaandUitFuncExprContext':
        return this.visitMaandUitFuncExpr(ctx);
      case 'DagUitFuncExprContext':
        return this.visitDagUitFuncExpr(ctx);
      case 'DatumMetFuncExprContext':
        // Needs implementation
        return this.visitDagUitFuncExpr(ctx); // Temporary fallback
      case 'TotaalVanExprContext':
        return this.visitTotaalVanExpr(ctx);
      case 'CapitalizedTotaalVanExprContext':
        // Needs implementation - delegate to regular version
        return this.visitTotaalVanExpr(ctx);
      case 'HetAantalDagenInExprContext':
        return this.visitHetAantalDagenInExpr(ctx);
      case 'DimensieAggExprContext':
        return this.visitDimensieAggExpr(ctx);
      case 'DimensieRangeAggExprContext':
        return this.visitDimensieRangeAggExpr(ctx);
      case 'TekstreeksExprContext':
        // Needs implementation
        return this.visitStringLiteralExpr(ctx); // Temporary fallback
      case 'ConcatenatieExprContext':
        return this.visitConcatenatieExpr(ctx);
      case 'RekendatumKeywordExprContext':
        // Needs implementation
        return this.visitIdentifierExpr(ctx as any); // Temporary fallback

      // Unary expressions
      case 'UnaryMinusExprContext':
        return this.visitUnaryMinusExpr(ctx as any);
      case 'UnaryNietExprContext':
        return this.visitUnaryNietExpr(ctx as any);

      // Parenthesized expression
      case 'ParenExprContext':
        return this.visitParenExpr(ctx as any);

      // Date calculations
      case 'DateCalcExprContext':
        return this.visitDateCalcExpr(ctx);

      // Conditional and comparison expressions
      case 'IsKenmerkExprContext':
        return this.visitIsKenmerkExpr(ctx);
      case 'HeeftKenmerkExprContext':
        return this.visitHeeftKenmerkExpr(ctx);
      case 'RegelStatusConditionExprContext':
        return this.visitRegelStatusConditionExpr(ctx);

      // Special expressions that need to go through expressie
      case 'ExprAfrondingContext':
        return this.visitExprAfronding(ctx);
      case 'ExprBegrenzingContext':
        return this.visitExprBegrenzing(ctx);
      case 'ExprBegrenzingAfrondingContext':
        return this.visitExprBegrenzingAfronding(ctx);

      default:
        // If we have a specific visitor method for this context, try to call it
        const methodName = `visit${contextName.replace('Context', '')}`;
        if (typeof (this as any)[methodName] === 'function') {
          return (this as any)[methodName](ctx);
        }

        // Last resort: try generic visit
        const result = this.visit(ctx);
        if (result) {
          return result;
        }

        throw new Error(`Unhandled primaryExpression context type: ${contextName}`);
    }
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
      const node = {
        type: 'NumberLiteral',
        value,
        unit
      } as NumberLiteral;
      this.setLocation(node, ctx);
      return node;
    }

    const node = {
      type: 'NumberLiteral',
      value
    } as NumberLiteral;
    this.setLocation(node, ctx);
    return node;
  }

  visitDatumLiteralExpr(ctx: any): Expression {
    // Get the date literal text
    const datumCtx = ctx.datumLiteral();
    const dateText = datumCtx.getText();

    // Parse the date - format is DD-MM-YYYY
    const parts = dateText.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JavaScript months are 0-indexed
      const year = parseInt(parts[2], 10);
      // Create UTC date to avoid timezone issues
      const date = new Date(Date.UTC(year, month, day));

      const node = {
        type: 'DateLiteral',
        value: date
      };
      this.setLocation(node, ctx);
      return node;
    }

    throw new Error(`Invalid date format: ${dateText}`);
  }

  visitIdentifierExpr(ctx: IdentifierExprContext): Expression {
    const ref = {
      type: 'VariableReference',
      variableName: ctx.identifier().getText()
    } as VariableReference;

    // Store location for this variable reference
    this.setLocation(ref, ctx);

    return ref;
  }

  visitParenExpr(ctx: ParenExprContext): Expression {
    return this.visit(ctx.expressie());
  }

  visitDateCalcExpr(ctx: any): Expression {
    // Handle DateCalcExpr - check if it's actually a date calculation or arithmetic with units
    const left = this.visit(ctx.primaryExpression(0));
    const right = this.visit(ctx.primaryExpression(1));
    // FIX: Grammar uses timeUnit, not identifier
    const timeUnitCtx = ctx.timeUnit();
    const identifier = timeUnitCtx?.getText() || '';

    // The grammar's DateCalcExpr rule captures the timeUnit token separately from the right operand.
    // Example: "1 uur plus 30 minuut" → left=1 uur, right=30, timeUnit=minuut
    // We need to attach the timeUnit to the right operand so unit arithmetic works correctly.
    if (right.type === 'NumberLiteral' && identifier) {
      (right as NumberLiteral).unit = identifier;
    }

    // Create binary expression
    const operator = ctx.PLUS() ? '+' : '-';

    const node = {
      type: 'BinaryExpression',
      operator: operator,
      left: left,
      right: right
    } as BinaryExpression;
    this.setLocation(node, ctx);
    return node;
  }

  visitEersteDatumFuncExpr(ctx: any): Expression {
    // Parse "de eerste van" function: EERSTE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression
    const args: Expression[] = [];

    // Get all primaryExpression children
    const primaryExpressions = ctx.primaryExpression ? ctx.primaryExpression() : [];
    const expressions = Array.isArray(primaryExpressions) ? primaryExpressions : [primaryExpressions];

    for (const expr of expressions) {
      if (expr) {
        const result = this.visit(expr);
        if (result) {
          args.push(result);
        }
      }
    }

    const node: FunctionCall = {
      type: 'FunctionCall',
      functionName: 'eerste_van',
      arguments: args
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitLaatsteDatumFuncExpr(ctx: any): Expression {
    // Parse "de laatste van" function: LAATSTE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression
    const args: Expression[] = [];

    // Get all primaryExpression children
    const primaryExpressions = ctx.primaryExpression ? ctx.primaryExpression() : [];
    const expressions = Array.isArray(primaryExpressions) ? primaryExpressions : [primaryExpressions];

    for (const expr of expressions) {
      if (expr) {
        const result = this.visit(expr);
        if (result) {
          args.push(result);
        }
      }
    }

    const node: FunctionCall = {
      type: 'FunctionCall',
      functionName: 'laatste_van',
      arguments: args
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitPasenFuncExpr(ctx: any): Expression {
    // Parse "de eerste paasdag van" function: DE EERSTE_PAASDAG VAN primaryExpression
    const primaryExpr = ctx.primaryExpression ? ctx.primaryExpression() : null;
    const args: Expression[] = [];

    if (primaryExpr) {
      const expr = this.visit(primaryExpr);
      if (expr) {
        args.push(expr);
      }
    }

    const node: FunctionCall = {
      type: 'FunctionCall',
      functionName: 'eerste_paasdag_van',
      arguments: args
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitSimpleConcatenatieExpr(ctx: any): Expression {
    // Pattern: primaryExpression (COMMA primaryExpression)+ (EN | OF) primaryExpression
    const args: Expression[] = [];
    let hasOf = false;
    let hasEn = false;

    // Get all primary expressions
    const primaryExprs = ctx.primaryExpression ? ctx.primaryExpression() : [];
    const expressions = Array.isArray(primaryExprs) ? primaryExprs : [primaryExprs];

    // Visit each primary expression
    for (const expr of expressions) {
      if (expr) {
        const result = this.visit(expr);
        if (result) {
          args.push(result);
        }
      }
    }

    // Check for OF or EN tokens
    if (ctx.OF && ctx.OF()) {
      hasOf = true;
    }
    if (ctx.EN && ctx.EN()) {
      hasEn = true;
    }

    // Create appropriate expression type based on connector
    if (hasOf) {
      const node: DisjunctionExpression = {
        type: 'DisjunctionExpression',
        values: args
      };
      this.setLocation(node, ctx);
      return node;
    } else if (hasEn) {
      // Check if we're in a function context
      const parentCtx = ctx.parentCtx;
      let functionName: string | undefined;

      // Try to determine if this is part of a function call
      if (parentCtx) {
        const parentText = parentCtx.getText ? parentCtx.getText() : '';
        if (parentText.includes('gemiddelde van')) {
          functionName = 'gemiddelde_van';
        } else if (parentText.includes('som van')) {
          functionName = 'som_van';
        } else if (parentText.includes('eerste van')) {
          functionName = 'eerste_van';
        } else if (parentText.includes('laatste van')) {
          functionName = 'laatste_van';
        } else if (parentText.includes('totaal van')) {
          functionName = 'totaal_van';
        }
      }

      // If we have a function context, return a FunctionCall
      if (functionName && args.length > 0) {
        const node: FunctionCall = {
          type: 'FunctionCall',
          functionName,
          arguments: args
        };
        this.setLocation(node, ctx);
        return node;
      }

      // Otherwise return a ConjunctionExpression
      const node: ConjunctionExpression = {
        type: 'ConjunctionExpression',
        values: args
      };
      this.setLocation(node, ctx);
      return node;
    }

    // Fallback: return first argument or throw error
    if (args.length > 0) {
      return args[0];
    }

    throw new Error(`Concatenation expression without valid connector: ${ctx.getText()}`);
  }

  visitConcatenatieExpr(ctx: any): Expression {
    // Pattern: CONCATENATIE_VAN primaryExpression (COMMA primaryExpression)* (EN | OF) primaryExpression
    // This is almost identical to SimpleConcatenatieExpr but with CONCATENATIE_VAN keyword
    const args: Expression[] = [];
    let hasOf = false;
    let hasEn = false;

    // Get all primary expressions
    const primaryExprs = ctx.primaryExpression ? ctx.primaryExpression() : [];
    const expressions = Array.isArray(primaryExprs) ? primaryExprs : [primaryExprs];

    // Visit each primary expression
    for (const expr of expressions) {
      if (expr) {
        const result = this.visit(expr);
        if (result) {
          args.push(result);
        }
      }
    }

    // Check for OF or EN tokens
    if (ctx.OF && ctx.OF()) {
      hasOf = true;
    }
    if (ctx.EN && ctx.EN()) {
      hasEn = true;
    }

    // Create appropriate expression type based on connector
    if (hasOf) {
      const node: DisjunctionExpression = {
        type: 'DisjunctionExpression',
        values: args
      };
      this.setLocation(node, ctx);
      return node;
    } else if (hasEn) {
      const node: ConjunctionExpression = {
        type: 'ConjunctionExpression',
        values: args
      };
      this.setLocation(node, ctx);
      return node;
    }

    // Fallback: return first argument or throw error
    if (args.length > 0) {
      return args[0];
    }

    throw new Error(`Concatenation expression without valid connector: ${ctx.getText()}`);
  }

  visitOnderwerpRefExpr(ctx: any): Expression {
    // Get the onderwerpReferentie context from the OnderwerpRefExpr wrapper
    const onderwerpRef = ctx.onderwerpReferentie ? ctx.onderwerpReferentie() : ctx;

    // Handle pronoun "hij" -> map to "self" for consistency with Python
    const ctxText = ctx.getText ? ctx.getText() : '';
    if (ctxText === 'hij') {
      const ref = {
        type: 'VariableReference',
        variableName: 'self'
      } as VariableReference;
      this.setLocation(ref, ctx);
      return ref;
    }

    // FIX 1: Detect aggregation patterns that grammar didn't catch
    // Pattern: "(het) aantal <collection> [die ...]" without ALLE or "van"
    // The grammar's HET AANTAL onderwerpReferentie requires an article after AANTAL,
    // so bare nouns like "het aantal personen" fall through to OnderwerpRefExpr.
    // NOTE: ctx.getText() returns concatenated tokens WITHOUT spaces (e.g., "hetaantalpersonen")
    const textLower = ctxText.toLowerCase();
    const aantalMatch = textLower.match(/^(?:het)?aantal(.+)$/);
    const hasAlle = textLower.includes('alle');
    const hasVan = textLower.includes('van');

    if (aantalMatch && !hasAlle && !hasVan) {
      // This is an aggregation expression
      // Extract collection name by getting identifiers from basisOnderwerp, excluding "aantal"

      const onderwerpBasis = onderwerpRef?.onderwerpBasis ? onderwerpRef.onderwerpBasis() : null;
      let collectionPath: string[] = [];

      if (onderwerpBasis) {
        // Get all basisOnderwerp elements (handle single and multiple)
        const basisList = onderwerpBasis.basisOnderwerp_list
          ? onderwerpBasis.basisOnderwerp_list()
          : (onderwerpBasis.basisOnderwerp ? [onderwerpBasis.basisOnderwerp()] : []);

        // If no list but we have a single basisOnderwerp through other access
        const allBasis = basisList.length > 0 ? basisList : [];

        // Extract identifiers from each basisOnderwerp, filtering out "aantal"
        const pathParts: string[] = [];
        for (const basis of allBasis) {
          if (!basis) continue;
          const identifiers = basis.identifierOrKeyword ? basis.identifierOrKeyword() : [];
          const idList = Array.isArray(identifiers) ? identifiers : (identifiers ? [identifiers] : []);

          // Filter out 'aantal' and join remaining identifiers
          const filtered = idList
            .map((id: any) => id.getText())
            .filter((text: string) => text.toLowerCase() !== 'aantal');

          if (filtered.length > 0) {
            pathParts.push(filtered.join(' '));
          }
        }

        // Reverse path parts for Dutch right-to-left navigation
        // "Y van de Z" -> ['Z', 'Y'] (pathParts already has ['Y', 'Z'])
        collectionPath = pathParts.length > 0 ? pathParts.reverse() : [];
      }

      // Fallback: use regex extraction if path extraction failed
      if (collectionPath.length === 0) {
        let fallbackName = aantalMatch[1].trim();
        // Remove "die..." suffix
        const dieIdx = fallbackName.indexOf('die');
        const datIdx = fallbackName.indexOf('dat');
        if (dieIdx > 0) fallbackName = fallbackName.substring(0, dieIdx).trim();
        else if (datIdx > 0) fallbackName = fallbackName.substring(0, datIdx).trim();
        collectionPath = [fallbackName];
      }

      // Build the base expression
      let baseExpression: Expression;
      if (onderwerpRef && onderwerpRef.predicaat && onderwerpRef.predicaat()) {
        // Has subselectie - create collection reference and wrap with predicate
        const collectionRef: AttributeReference = {
          type: 'AttributeReference',
          path: collectionPath
        };
        this.setLocation(collectionRef, onderwerpBasis || ctx);

        const predicaatCtx = onderwerpRef.predicaat();
        const predicaat = this.visitPredicaat(predicaatCtx);

        baseExpression = {
          type: 'SubselectieExpression',
          collection: collectionRef,
          predicaat
        } as SubselectieExpression;
        this.setLocation(baseExpression, onderwerpRef);
      } else {
        // No subselectie - just AttributeReference
        baseExpression = {
          type: 'AttributeReference',
          path: collectionPath
        } as AttributeReference;
        this.setLocation(baseExpression, ctx);
      }

      const node: FunctionCall = {
        type: 'FunctionCall',
        functionName: 'aantal',
        arguments: [baseExpression]
      };
      this.setLocation(node, ctx);
      return node;
    }

    // FIX 2: For cases with DIE/DAT subselectie, delegate to visitOnderwerpReferentie
    // which properly handles subselectie filtering. Only do this when subselectie is present.
    // See Python builder.py:1533, 1572-1583
    if (onderwerpRef && onderwerpRef.predicaat && onderwerpRef.predicaat()) {
      // Has DIE/DAT - delegate for proper subselectie handling
      return this.visitOnderwerpReferentie(onderwerpRef);
    }

    // For simple references without aggregation or subselectie, return VariableReference
    // This preserves existing behavior for cases like "de isVIP", "het bedrag", etc.
    const onderwerpBasis = onderwerpRef?.onderwerpBasis ? onderwerpRef.onderwerpBasis() : null;
    let variableName = '';

    if (onderwerpBasis) {
      // Get all basisOnderwerp elements
      const basisList = onderwerpBasis.basisOnderwerp_list
        ? onderwerpBasis.basisOnderwerp_list()
        : (onderwerpBasis.basisOnderwerp ? [onderwerpBasis.basisOnderwerp()] : []);

      const pathParts: string[] = [];
      for (const basis of basisList) {
        if (!basis) continue;
        const identifiers = basis.identifierOrKeyword ? basis.identifierOrKeyword() : [];
        const idList = Array.isArray(identifiers) ? identifiers : (identifiers ? [identifiers] : []);

        const namePart = idList.map((id: any) => id.getText()).join(' ');
        if (namePart) {
          pathParts.push(namePart);
        }
      }

      variableName = pathParts.length > 0 ? pathParts.join(' ') : '';
    }

    // Fallback: extract text without article
    if (!variableName) {
      const text = ctxText;
      const match = text.match(/^(?:de|het|een|zijn|alle)?\s*(.+)$/i);
      variableName = match ? match[1] : text;
    }

    const ref = {
      type: 'VariableReference',
      variableName
    } as VariableReference;
    this.setLocation(ref, ctx);
    return ref;
  }

  visitStringLiteralExpr(ctx: any): Expression {
    // Get the string literal token
    const text = ctx.STRING_LITERAL().getText();

    // Remove surrounding quotes
    const value = text.slice(1, -1);

    const node = {
      type: 'StringLiteral',
      value
    } as Expression;
    this.setLocation(node, ctx);
    return node;
  }

  visitEnumLiteralExpr(ctx: any): Expression {
    // Get the enum literal token
    const text = ctx.ENUM_LITERAL().getText();

    // Remove surrounding quotes
    const value = text.slice(1, -1);

    const node = {
      type: 'StringLiteral',  // Treat enum literals as string literals for now
      value
    } as Expression;
    this.setLocation(node, ctx);
    return node;
  }

  visitUnaryNietExpr(ctx: UnaryNietExprContext): Expression {
    // Get the operand expression
    const operand = this.visit(ctx.primaryExpression());

    const node = {
      type: 'UnaryExpression',
      operator: '!',
      operand
    } as UnaryExpression;
    this.setLocation(node, ctx);
    return node;
  }

  visitUnaryMinusExpr(ctx: UnaryMinusExprContext): Expression {
    // Get the operand expression
    const operand = this.visit(ctx.primaryExpression());

    const node = {
      type: 'UnaryExpression',
      operator: '-',
      operand
    } as UnaryExpression;
    this.setLocation(node, ctx);
    return node;
  }

  visitWortelFuncExpr(ctx: any): Expression {
    // Get the argument expression 
    const argCtx = ctx.primaryExpression();
    if (!argCtx) {
      throw new Error('Missing argument for "de wortel van"');
    }

    const arg = this.visit(argCtx);
    if (!arg) {
      throw new Error('Invalid argument for "de wortel van"');
    }

    const node = {
      type: 'FunctionCall',
      functionName: 'sqrt',
      arguments: [arg]
    } as FunctionCall;
    this.setLocation(node, ctx);
    return node;
  }

  visitAbsValFuncExpr(ctx: any): Expression {
    // Get the argument expression (inside parentheses)
    const argCtx = ctx.expressie();
    if (!argCtx) {
      throw new Error('Missing argument for "de absolute waarde van"');
    }

    const arg = this.visit(argCtx);
    if (!arg) {
      throw new Error('Invalid argument for "de absolute waarde van"');
    }

    const node = {
      type: 'FunctionCall',
      functionName: 'abs',
      arguments: [arg]
    } as FunctionCall;
    this.setLocation(node, ctx);
    return node;
  }

  visitTijdsduurFuncExpr(ctx: any): Expression {
    // TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?
    const fromExpr = this.visit(ctx.primaryExpression(0));
    const toExpr = this.visit(ctx.primaryExpression(1));

    // Check for unit specification and normalize to lowercase
    const unitIdCtx = ctx.unitIdentifier ? ctx.unitIdentifier() : null;
    const unit = unitIdCtx ? unitIdCtx.getText().toLowerCase() : undefined;

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

    // Check for unit specification and normalize to lowercase
    const unitIdCtx = ctx.unitIdentifier ? ctx.unitIdentifier() : null;
    const unit = unitIdCtx ? unitIdCtx.getText().toLowerCase() : undefined;

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

    const node = {
      type: 'FunctionCall',
      functionName: 'som',
      arguments: args
    } as FunctionCall;
    this.setLocation(node, ctx);
    return node;
  }

  visitSomAlleAttribuutExpr(ctx: any): Expression {
    // SOM_VAN ALLE attribuutReferentie
    // This handles patterns like "de som van alle belasting van passagiers die minderjarig zijn"
    const attrRef = this.visitAttribuutReferentie(ctx.attribuutReferentie());

    if (!attrRef) {
      throw new Error('No attribute reference found in som_van function');
    }

    const node = {
      type: 'FunctionCall',
      functionName: 'som_van',
      arguments: [attrRef]
    } as FunctionCall;
    this.setLocation(node, ctx);
    return node;
  }

  visitSomAlleExpr(ctx: any): Expression {
    // SOM_VAN ALLE naamwoord
    // This handles patterns like "de som van alle belasting op basis van afstand"
    // and navigation patterns like "de som van alle passagiers van de reis"
    if (!ctx.naamwoord || !ctx.naamwoord()) {
      throw new Error('Expected naamwoord in som_van alle expression');
    }

    // Parse the naamwoord into a navigation path
    // "passagiers van de reis" -> ["reis", "passagiers"]
    const collectionPath = this._parseNaamwoordToNavigationPath(ctx.naamwoord());

    // Create an AttributeReference for the collection with proper path
    const collectionRef = {
      type: 'AttributeReference',
      path: collectionPath
    } as AttributeReference;
    this.setLocation(collectionRef, ctx.naamwoord());

    // Create the FunctionCall for som_van
    const node = {
      type: 'FunctionCall',
      functionName: 'som_van',
      arguments: [collectionRef]
    } as FunctionCall;
    this.setLocation(node, ctx);
    return node;
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
      }
      // Note: 'totaal' removed - grammar doesn't allow it in dimensieAggExpr
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
        // Parse the naamwoord into a navigation path
        // "passagiers van de reis" -> ["reis", "passagiers"]
        const collectionPath = this._parseNaamwoordToNavigationPath(naamwoordCtx);

        // Create AttributeReference for the collection with proper path
        const collectionRef: AttributeReference = {
          type: 'AttributeReference',
          path: collectionPath
        };

        // Return FunctionCall with both arguments
        const node = {
          type: 'FunctionCall',
          functionName,
          arguments: [attrRef, collectionRef]
        } as FunctionCall;
        this.setLocation(node, ctx);
        return node;
      }
    }

    // No collection specified, just return function with attribute
    const node = {
      type: 'FunctionCall',
      functionName,
      arguments: [attrRef]
    } as FunctionCall;
    this.setLocation(node, ctx);
    return node;
  }

  visitDimensieRangeAggExpr(ctx: any): Expression {
    // This handles dimension range aggregation patterns like:
    // "de som van zijn betaalde belasting in jaar vanaf vier jaar geleden t/m een jaar geleden"

    // Extract the aggregation function name
    let functionName = '';
    const funcCtx = ctx.getalAggregatieFunctie ? ctx.getalAggregatieFunctie() : ctx.datumAggregatieFunctie();
    if (funcCtx) {
      const text = funcCtx.getText().toLowerCase();
      if (text.includes('som')) {
        functionName = 'som_van';
      } else if (text.includes('gemiddelde')) {
        functionName = 'gemiddelde_van';
      } else if (text.includes('maximum') || text.includes('maximale')) {
        functionName = 'maximum_van';
      } else if (text.includes('minimum') || text.includes('minimale')) {
        functionName = 'minimum_van';
      } else if (text.includes('eerste')) {
        functionName = 'eerste_van';
      } else if (text.includes('laatste')) {
        functionName = 'laatste_van';
      }
    }

    if (!functionName) {
      throw new Error('Unknown aggregation function in DimensieRangeAggExpr');
    }

    // Get the attribute or bezielde reference
    // Grammar uses attribuutMetLidwoord, but in practice test phrases use pronoun "zijn ..."
    // Our naamwoord allows ZIJN as article, so detect a leading "zijn " and convert to a self-bound attribute
    const attrMetLidwoordCtx = ctx.attribuutMetLidwoord ? ctx.attribuutMetLidwoord() : null;
    const bezieldeCtx = ctx.bezieldeReferentie ? ctx.bezieldeReferentie() : null;

    let attrRef: AttributeReference;
    if (bezieldeCtx) {
      // Direct bezielde reference parsed: ZIJN naamwoord
      const naamwoordCtx = bezieldeCtx.naamwoord();
      const fullAttrText = naamwoordCtx ? this.extractTextWithSpaces(naamwoordCtx) : '';
      const cleanAttr = fullAttrText.replace(/^zijn\s+/i, '').trim();
      attrRef = { type: 'AttributeReference', path: ['self', cleanAttr] };
    } else if (attrMetLidwoordCtx) {
      const attrName = this.extractTextWithSpaces(attrMetLidwoordCtx);
      // If starts with pronoun, treat as self-bound
      if (/^zijn\s+/i.test(attrName)) {
        const clean = attrName.replace(/^zijn\s+/i, '').trim();
        attrRef = { type: 'AttributeReference', path: ['self', clean] };
      } else {
        const strippedAttrName = this._stripArticle(attrName);
        attrRef = { type: 'AttributeReference', path: [strippedAttrName] };
      }
    } else {
      throw new Error('Expected attribute reference in DimensieRangeAggExpr');
    }

    // Get the range labels
    const fromLabelCtx = ctx.naamwoord(0);
    const toLabelCtx = ctx.naamwoord(1);

    if (!fromLabelCtx || !toLabelCtx) {
      throw new Error('Expected from and to labels in DimensieRangeAggExpr');
    }

    const fromLabel = this.extractTextWithSpaces(fromLabelCtx);
    const toLabel = this.extractTextWithSpaces(toLabelCtx);

    // Infer the dimension axis from labels using the dimension registry at runtime
    // We store labels now; axis will also be included by inference helper in engine, but
    // we can pre-fill a likely axis if available on this.parserContext
    // Default to empty; AggregationEngine will infer if needed
    let inferredAxis = '';
    try {
      const runtime = (this as any).runtimeContext || (this as any).context;
      const registry = runtime?.dimensionRegistry;
      if (registry && typeof registry.findAxisForLabel === 'function') {
        inferredAxis = registry.findAxisForLabel(fromLabel) || registry.findAxisForLabel(toLabel) || '';
      }
    } catch {
      // Ignore; engine will infer later
    }

    // Create the aggregation with dimension range
    const node = {
      type: 'AggregationExpression',
      aggregationType: functionName.replace('_van', ''),
      target: attrRef,
      dimensionRange: {
        dimension: inferredAxis || '',
        from: fromLabel,
        to: toLabel
      }
    } as any;

    this.setLocation(node, ctx);
    return node;
  }

  visitAantalFuncExpr(ctx: any): Expression {
    // Handles multiple patterns:
    // - HET AANTAL ALLE naamwoord (e.g., "het aantal alle Persoon")
    // - HET AANTAL onderwerpReferentie (e.g., "het aantal de passagiers")
    // - AANTAL ALLE naamwoord
    // - AANTAL onderwerpReferentie

    const naamwoordCtx = ctx.naamwoord ? ctx.naamwoord() : null;
    const onderwerpCtx = ctx.onderwerpReferentie ? ctx.onderwerpReferentie() : null;
    let subjectExpr: Expression | null = null;

    if (naamwoordCtx) {
      // Pattern: (HET_AANTAL | AANTAL) ALLE naamwoord
      // Create an AttributeReference for the collection
      const collectionName = this.visitNaamwoord(naamwoordCtx);
      subjectExpr = {
        type: 'AttributeReference',
        path: [collectionName]
      } as AttributeReference;
      this.setLocation(subjectExpr, naamwoordCtx);
    } else if (onderwerpCtx) {
      // Pattern: (HET_AANTAL | AANTAL) onderwerpReferentie
      const visitedOnderwerp = this.visit(onderwerpCtx);

      // If ALLE is present and it's a VariableReference, convert to AttributeReference
      if ((ctx.ALLE && ctx.ALLE()) && visitedOnderwerp?.type === 'VariableReference') {
        subjectExpr = {
          type: 'AttributeReference',
          path: [(visitedOnderwerp as VariableReference).variableName]
        } as AttributeReference;
        this.setLocation(subjectExpr, onderwerpCtx);
      } else {
        subjectExpr = visitedOnderwerp;
      }
    }

    if (!subjectExpr) {
      throw new Error('Failed to determine onderwerp or naamwoord in aantal expression');
    }

    const node: FunctionCall = {
      type: 'FunctionCall',
      functionName: 'aantal',
      arguments: [subjectExpr]
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitAantalAttribuutExpr(ctx: any): Expression {
    // HET? AANTAL attribuutReferentie
    // This handles patterns like "het aantal passagiers van de reis"

    // CRITICAL: First check if the entire phrase is a canonical parameter name
    // For example: "het aantal treinmiles per passagier voor contingent" might be a parameter
    const fullText = ctx.getText();

    // Check if we have access to parameter names via parser context
    // This matches Python's behavior in builder.py:2723-2764
    if (this.parameterNames && this.parameterNames.size > 0) {
      // Try various normalizations of the text to match parameter names
      const normalizations = [
        fullText,
        fullText.replace(/^het\s+/i, '').trim(),
        fullText.replace(/^de\s+/i, '').trim(),
        fullText.replace(/^een\s+/i, '').trim(),
      ];

      for (const normalized of normalizations) {
        if (this.parameterNames.has(normalized)) {
          // This entire phrase is a parameter name - return VariableReference
          const node: VariableReference = {
            type: 'VariableReference',
            variableName: normalized
          };
          this.setLocation(node, ctx);
          return node;
        }
      }
    }

    // Not a parameter name - proceed with normal aantal function processing
    const attrRef = this.visitAttribuutReferentie(ctx.attribuutReferentie());

    if (!attrRef) {
      throw new Error('No attribute reference found in aantal function');
    }

    // Build FunctionCall for aantal with attribute reference
    const node: FunctionCall = {
      type: 'FunctionCall',
      functionName: 'aantal',
      arguments: [attrRef]
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitMaandUitFuncExpr(ctx: any): Expression {
    // Pattern: DE MAAND UIT primaryExpression
    const arg = ctx.primaryExpression() ? this.visit(ctx.primaryExpression()) : null;
    if (!arg) {
      throw new Error('Missing argument for maand uit function');
    }

    const node = {
      type: 'FunctionCall',
      functionName: 'maand_uit',
      arguments: [arg]
    } as FunctionCall;
    this.setLocation(node, ctx);
    return node;
  }

  visitDagUitFuncExpr(ctx: any): Expression {
    // Pattern: DE DAG UIT primaryExpression
    const arg = ctx.primaryExpression() ? this.visit(ctx.primaryExpression()) : null;
    if (!arg) {
      throw new Error('Missing argument for dag uit function');
    }

    const node = {
      type: 'FunctionCall',
      functionName: 'dag_uit',
      arguments: [arg]
    } as FunctionCall;
    this.setLocation(node, ctx);
    return node;
  }

  visitJaarUitFuncExpr(ctx: any): Expression {
    // Pattern: HET JAAR UIT primaryExpression
    const arg = ctx.primaryExpression() ? this.visit(ctx.primaryExpression()) : null;
    if (!arg) {
      throw new Error('Missing argument for jaar uit function');
    }

    const node = {
      type: 'FunctionCall',
      functionName: 'jaar_uit',
      arguments: [arg]
    } as FunctionCall;
    this.setLocation(node, ctx);
    return node;
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
    const periodLiteral: StringLiteral = {
      type: 'StringLiteral',
      value: periodType
    };

    // Return as TimelineExpression for proper timeline handling
    const node = {
      type: 'TimelineExpression',
      operation: 'aantal_dagen',
      target: periodLiteral,
      condition: conditionExpr
    } as any;
    this.setLocation(node, ctx);
    return node;
  }

  visitSubordinateIsWithExpr(ctx: any): Expression {
    // Handle "hij actief is" pattern 
    // This is parsed as: subject=onderwerpReferentie prepPhrase=naamwoordWithNumbers verb=IS
    // But for "hij actief is", actief is a kenmerk, not a prepositional phrase

    // Get the subject and prepPhrase from the context
    const subjectCtx = ctx.onderwerpReferentie ? ctx.onderwerpReferentie() : null;
    // Check for naamwoordWithNumbers first, then fall back to naamwoord
    const prepPhraseCtx = (ctx.naamwoordWithNumbers && ctx.naamwoordWithNumbers()) ?
      ctx.naamwoordWithNumbers() :
      (ctx.naamwoord ? ctx.naamwoord() : null);

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
    // This is parsed as: subject=onderwerpReferentie object=naamwoordWithNumbers verb=HEEFT

    // Get the subject and object from the context
    const subjectCtx = ctx.onderwerpReferentie ? ctx.onderwerpReferentie() : null;
    // Check for naamwoordWithNumbers first, then fall back to naamwoord
    const objectCtx = (ctx.naamwoordWithNumbers && ctx.naamwoordWithNumbers()) ?
      ctx.naamwoordWithNumbers() :
      (ctx.naamwoord ? ctx.naamwoord() : null);

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

      // Check for optional variable assignments (variabeleDeel)
      let variables: VariableAssignment[] | undefined;
      if (ctx.variabeleDeel && ctx.variabeleDeel()) {
        variables = this.visitVariabeleDeel(ctx.variabeleDeel());
      }

      const rule = {
        type: 'Rule',
        name,
        version,
        result,
        condition,
        variables
      };

      // Store location separately
      this.setLocation(rule, ctx);

      return rule;
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

    const group = {
      type: 'RegelGroep',
      name,
      isRecursive,
      rules
    };

    // Store location separately
    this.setLocation(group, ctx);

    return group;
  }

  visitAttribuutReferentie(ctx: any): AttributeReference | SubselectieExpression | DimensionedAttributeReference {
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

        // Get the actual object path after the dimension
        // For "het inkomen van huidig jaar van de persoon", we need "de persoon"
        // This requires looking at the rest of the onderwerp chain
        const objectPath = this.visitOnderwerpReferentieToPath(onderwerpCtx);

        // Build the full path for AttributeReference
        const fullPath = objectPath.length > 0 ? [...objectPath, this.extractParameterName(cleanAttrText)] : [this.extractParameterName(cleanAttrText)];

        const baseAttrRef = {
          type: 'AttributeReference',
          path: fullPath
        } as AttributeReference;

        const node = {
          type: 'DimensionedAttributeReference',
          baseAttribute: baseAttrRef,
          dimensionLabels
        } as DimensionedAttributeReference;
        this.setLocation(node, ctx);
        return node;
      }
    }

    // Check if this is actually a nested navigation that was parsed incorrectly
    // Due to grammar ambiguity, "de straat van het adres" might be parsed as a single naamwoord
    if (attrText.includes(' van ') || attrText.includes(' op ') || attrText.includes(' bij ')) {
      // First check if this is a known compound attribute name
      let isCompoundAttribute = false;

      // Check against all known object types
      for (const [objectType, attributes] of this.objectTypeAttributes) {
        if (attributes.has(attrText)) {
          isCompoundAttribute = true;
          break;
        }
      }

      // If it's a known compound attribute, don't split it
      if (!isCompoundAttribute && attrText.includes(' van ')) {
        // This is a nested navigation expression
        // Split it and build the path properly
        const parts = attrText.split(' van ');
        const actualAttr = this.extractParameterName(parts[0]);

        // Get the object path
        const objectPath = this.visitOnderwerpReferentieToPath(onderwerpCtx);

        // Build the complete path including the nested attributes
        // For "de straat van het adres", parts = ["de straat", "het adres"]
        // Process from right to left (Dutch navigation order)
        const pathElements: string[] = [...objectPath];

        // Add the middle parts in reverse order
        for (let i = parts.length - 1; i >= 1; i--) {
          pathElements.push(this.extractParameterName(parts[i]));
        }

        // Add the outermost attribute
        pathElements.push(actualAttr);

        const attrRef = {
          type: 'AttributeReference',
          path: pathElements
        } as AttributeReference;

        // If we have dimension labels, wrap in DimensionedAttributeReference
        if (dimensionLabels.length > 0) {
          const node = {
            type: 'DimensionedAttributeReference',
            baseAttribute: attrRef,
            dimensionLabels
          } as DimensionedAttributeReference;
          this.setLocation(node, ctx);
          return node;
        }

        this.setLocation(attrRef, ctx);
        return attrRef;
      }
    }

    // Simple case: no nested navigation in attribute
    const attrName = this.extractParameterName(cleanAttrText);

    // Get the object path
    const objectPath = this.visitOnderwerpReferentieToPath(onderwerpCtx);

    // Build the full path for AttributeReference
    // Dutch right-to-left navigation per specification
    // For "de naam van de Manager", this becomes ["Manager", "naam"]
    const fullPath = [...objectPath, attrName];

    // Create AttributeReference with the full path
    const baseAttrRef = {
      type: 'AttributeReference',
      path: fullPath
    } as AttributeReference;

    // Check if the onderwerp has filtering (predicates)
    const predicaatCtx = onderwerpCtx.predicaat ? onderwerpCtx.predicaat() : null;
    if (predicaatCtx && (onderwerpCtx.DIE && onderwerpCtx.DIE() || onderwerpCtx.DAT && onderwerpCtx.DAT())) {
      // We have a subselectie - wrap the AttributeReference in SubselectieExpression
      const predicaat = this.visitPredicaat(predicaatCtx);

      const subselectie = {
        type: 'SubselectieExpression',
        collection: baseAttrRef,
        predicaat: predicaat
      } as SubselectieExpression;

      // If we have dimension labels, wrap in DimensionedAttributeReference
      if (dimensionLabels.length > 0) {
        const node = {
          type: 'DimensionedAttributeReference',
          baseAttribute: subselectie,
          dimensionLabels
        } as DimensionedAttributeReference;
        this.setLocation(node, ctx);
        return node;
      }

      this.setLocation(subselectie, ctx);
      return subselectie;
    }

    // No filtering - already created baseAttrRef above

    // If we have dimension labels, wrap in DimensionedAttributeReference
    if (dimensionLabels.length > 0) {
      const node = {
        type: 'DimensionedAttributeReference',
        baseAttribute: baseAttrRef,
        dimensionLabels
      } as DimensionedAttributeReference;
      this.setLocation(node, ctx);
      return node;
    }

    this.setLocation(baseAttrRef, ctx);
    return baseAttrRef;
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

      // Convert predicaat to unified predicate
      let unifiedPredicate: Predicate | undefined;
      if ((predicaat as any).predicate) {
        // Already has unified predicate
        unifiedPredicate = (predicaat as any).predicate;
      } else if (predicaat.type === 'KenmerkPredicaat') {
        unifiedPredicate = {
          type: 'SimplePredicate',
          operator: 'kenmerk',
          kenmerk: (predicaat as KenmerkPredicaat).kenmerk
        } as SimplePredicate;
      } else if (predicaat.type === 'AttributeComparisonPredicaat') {
        const attrPred = predicaat as AttributeComparisonPredicaat;
        unifiedPredicate = {
          type: 'AttributePredicate',
          attribute: attrPred.attribute,
          operator: attrPred.operator as import('../predicates/predicate-types').ComparisonOperator,
          value: attrPred.value
        } as AttributePredicate;
      }

      const node = {
        type: 'SubselectieExpression',
        collection: baseExpression,
        predicaat,
        // Add unified predicate representation
        predicate: unifiedPredicate
      } as SubselectieExpression;
      this.setLocation(node, ctx);
      if (unifiedPredicate) {
        this.setLocation(unifiedPredicate, ctx);
      }
      return node;
    }

    // No subselectie, just process the onderwerpBasis
    return this.visitOnderwerpBasis(ctx.onderwerpBasis());
  }

  visitOnderwerpBasis(ctx: any): Expression {
    if (!ctx) {
      throw new Error('Expected onderwerpBasis context');
    }

    // onderwerpBasis : basisOnderwerp ( voorzetsel basisOnderwerp )*
    // Process ALL basisOnderwerp elements to build complete navigation chain
    const path = this.onderwerpBasisToPath(ctx);

    if (path.length === 0) {
      // Fallback: extract text without articles
      const fallback = ctx.getText().replace(/^(de|het|een|alle)\s*/i, '').trim();
      // Even for fallback, use AttributeReference to maintain consistency
      const ref: AttributeReference = {
        type: 'AttributeReference',
        path: [fallback]
      } as AttributeReference;
      this.setLocation(ref, ctx);
      return ref;
    }

    // Always return AttributeReference for onderwerp contexts
    // This matches Python implementation which only uses VariableReference
    // for truly standalone identifiers in primaryExpression
    const ref: AttributeReference = {
      type: 'AttributeReference',
      path
    } as AttributeReference;
    this.setLocation(ref, ctx);
    return ref;
  }

  // Helper: Extract full path from onderwerpBasis context
  private onderwerpBasisToPath(ctx: any): string[] {
    if (!ctx) {
      return [];
    }

    // Grammar: onderwerpBasis : basisOnderwerp ( voorzetsel basisOnderwerp )*
    // In TypeScript ANTLR4, repeated elements use _list suffix
    const path: string[] = [];

    // Get all basisOnderwerp contexts using the _list method
    const allBasisOnderwerp = ctx.basisOnderwerp_list ? ctx.basisOnderwerp_list() : [];

    // Process each basisOnderwerp to build the navigation path
    for (let i = 0; i < allBasisOnderwerp.length; i++) {
      const part = this.visitBasisOnderwerpToString(allBasisOnderwerp[i]);
      if (part) {
        path.push(part);
      }
    }

    // CRITICAL: Reverse the path for Dutch right-to-left navigation
    // "passagiers van de reis" -> ["reis", "passagiers"] not ["passagiers", "reis"]
    // This matches Python's builder.py behavior
    return path.reverse();
  }

  // Helper: Convert single basisOnderwerp to string, preserving possessives
  private visitBasisOnderwerpToString(ctx: any): string | null {
    if (!ctx) {
      return null;
    }

    // basisOnderwerp : (DE | HET | EEN | ZIJN | ALLE | HIJ)? identifierOrKeyword+

    // Handle pronoun "hij" -> map to "self" for consistency with Python
    if (ctx.HIJ && ctx.HIJ()) {
      return 'self';
    }

    // Get identifiers
    const identifiers = ctx.identifierOrKeyword ? ctx.identifierOrKeyword() : [];
    const identifierList = Array.isArray(identifiers) ? identifiers : (identifiers ? [identifiers] : []);

    if (identifierList.length === 0) {
      // No identifiers, try fallback with text extraction
      const text = this.extractTextWithSpaces(ctx);
      // Remove common articles but preserve possessives
      return text.replace(/^(de|het|een|alle)\s+/i, '').trim();
    }

    // Build identifier text with proper spacing
    let text = identifierList.map((id: any) => id.getText()).join(' ');

    // Handle possessive pronoun "zijn" - must be preserved for FeitType navigation
    if (ctx.ZIJN && ctx.ZIJN()) {
      text = `zijn ${text}`.trim();
    }

    // Split on "van" if present to avoid duplicate navigation segments
    // e.g., "burgemeester van de hoofdstad" -> "burgemeester"
    if (text.includes(' van ')) {
      text = text.split(' van ')[0].trim();
    }

    return text;
  }

  // Helper method to convert onderwerpReferentie to a path list
  visitOnderwerpReferentieToPath(ctx: any): string[] {
    if (!ctx) {
      return [];
    }

    // onderwerpReferentie : onderwerpBasis ( (DIE | DAT) predicaat )?
    // Use the new helper to get the full path
    const onderwerpBasisCtx = ctx.onderwerpBasis();
    if (!onderwerpBasisCtx) {
      return [];
    }

    // Directly use the path helper to get the navigation chain
    return this.onderwerpBasisToPath(onderwerpBasisCtx);
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
      // Create old type for backward compatibility
      const node = {
        type: 'KenmerkPredicaat',
        kenmerk,
        // Add unified predicate representation
        predicate: {
          type: 'SimplePredicate',
          operator: 'kenmerk',
          kenmerk
        } as SimplePredicate
      } as KenmerkPredicaat & { predicate?: SimplePredicate };
      this.setLocation(node, ctx);
      if (node.predicate) {
        this.setLocation(node.predicate, ctx);
      }
      return node;
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
    switch (opText) {
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

    // Create old type with unified predicate
    const node = {
      type: 'AttributeComparisonPredicaat',
      attribute: attrName,
      operator,
      value: expr,
      // Add unified predicate representation
      predicate: {
        type: 'AttributePredicate',
        attribute: attrName,
        operator: operator as import('../predicates/predicate-types').ComparisonOperator,
        value: expr
      } as AttributePredicate
    } as AttributeComparisonPredicaat & { predicate?: AttributePredicate };
    this.setLocation(node, ctx);
    if (node.predicate) {
      this.setLocation(node.predicate, ctx);
    }
    return node;
  }

  visitObjectPredicaat(ctx: any): KenmerkPredicaat {
    // For now, treat object predicates as kenmerk predicates
    const text = this.extractTextWithSpaces(ctx);

    // Remove trailing "zijn" if present
    const kenmerk = text.replace(/ zijn$/, '').trim();

    // Create old type with unified predicate
    const node = {
      type: 'KenmerkPredicaat',
      kenmerk,
      // Add unified predicate representation
      predicate: {
        type: 'SimplePredicate',
        operator: 'kenmerk',
        kenmerk
      } as SimplePredicate
    } as KenmerkPredicaat & { predicate?: SimplePredicate };
    this.setLocation(node, ctx);
    if (node.predicate) {
      this.setLocation(node.predicate, ctx);
    }
    return node;
  }

  visitRegelVersie(ctx: any): any {
    const geldigheid = this.visit(ctx.versieGeldigheid());

    const node = {
      type: 'RuleVersion',
      validity: geldigheid
    };
    this.setLocation(node, ctx);
    return node;
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
      return this.visitDagsoortdefinitieResultaat(ctx);
    } else if (ctx.constructor.name === 'FeitCreatieResultaatContext') {
      return this.visitFeitCreatieResultaat(ctx);
    } else if (ctx.constructor.name === 'KenmerkFeitResultaatContext') {
      return this.visitKenmerkFeitResultaat(ctx);
    } else if (ctx.constructor.name === 'ObjectCreatieResultaatContext') {
      return this.visitObjectCreatieResultaat(ctx);
    } else if (ctx.constructor.name === 'VerdelingContext') {
      // The generated context is named after the label
      return this.visitVerdelingResultaat(ctx);
    } else if (ctx.constructor.name === 'ConsistencyCheckResultaatContext') {
      return this.visitConsistencyCheckResultaat(ctx);
    } else if (ctx.constructor.name === 'RelationshipWithAttributeResultaatContext') {
      return this.visitRelationshipWithAttributeResultaat(ctx);
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

    const result = {
      type: 'Gelijkstelling',
      target,
      expression
    };

    // Store location for this gelijkstelling
    this.setLocation(result, ctx);

    return result;
  }

  visitFeitCreatieResultaat(ctx: any): FeitCreatie {
    // Get the feitCreatiePattern context
    const patternCtx = ctx.feitCreatiePattern();

    if (!patternCtx) {
      throw new Error('FeitCreatieResultaat missing feitCreatiePattern');
    }

    // Get the role and subject phrases using the proper methods
    const rolePhrases = patternCtx.feitCreatieRolPhrase_list() || [];
    const subjectPhrases = patternCtx.feitCreatieSubjectPhrase_list() || [];

    // Extract role1 (first role phrase)
    let role1 = '';
    if (rolePhrases.length > 0) {
      const role1Ctx = rolePhrases[0];
      const role1Words = [];

      // Get all words in the role phrase
      const wordList = role1Ctx.feitCreatieWord_list?.() || [];
      for (const wordCtx of wordList) {
        role1Words.push(wordCtx.getText());
      }
      role1 = role1Words.join(' ');
    }

    // Extract subject1 (first subject phrase)
    let subject1Text = '';
    if (subjectPhrases.length > 0) {
      const subject1Ctx = subjectPhrases[0];
      const subject1Words = [];

      // Get all words in the subject phrase
      const wordList = subject1Ctx.feitCreatieSubjectWord_list?.() || [];
      for (const wordCtx of wordList) {
        subject1Words.push(wordCtx.getText());
      }
      subject1Text = subject1Words.join(' ');

      // Left side always has "van een" per spec, so prepend "een"
      if (subject1Text) {
        subject1Text = `een ${subject1Text}`;
      }
    }

    // Create subject1 as an AttributeReference
    const subject1: AttributeReference = {
      type: 'AttributeReference',
      path: [subject1Text]
    };

    // Extract role2 (second role phrase)
    let role2 = '';
    if (rolePhrases.length > 1) {
      const role2Ctx = rolePhrases[1];
      const role2Words = [];

      // Get all words in the role phrase
      const wordList = role2Ctx.feitCreatieWord_list?.() || [];
      for (const wordCtx of wordList) {
        role2Words.push(wordCtx.getText());
      }
      role2 = role2Words.join(' ');
    }

    // Extract subject2 (second subject phrase)
    let subject2Text = '';
    if (subjectPhrases.length > 1) {
      const subject2Ctx = subjectPhrases[1];
      const subject2Words = [];

      // Get all words in the subject phrase
      const wordList = subject2Ctx.feitCreatieSubjectWord_list?.() || [];
      for (const wordCtx of wordList) {
        subject2Words.push(wordCtx.getText());
      }
      subject2Text = subject2Words.join(' ');

      // Include article if present
      const article3 = patternCtx.article3;
      if (article3) {
        subject2Text = `${article3.getText()} ${subject2Text}`;
      }
    }

    // Create subject2 as an AttributeReference (often a navigation pattern)
    const subject2: AttributeReference = {
      type: 'AttributeReference',
      path: [subject2Text]
    };

    // Create the FeitCreatie node
    const result: FeitCreatie = {
      type: 'FeitCreatie',
      role1,
      subject1,
      role2,
      subject2
    };

    // Store location
    this.setLocation(result, ctx);

    return result;
  }

  visitObjectCreatieResultaat(ctx: any): any {
    // Get the objectCreatie context
    const objectCreatieCtx = ctx.objectCreatie();

    // Get the object type name
    const objectTypeCtx = objectCreatieCtx.objectType ? objectCreatieCtx.objectType() : objectCreatieCtx._objectType;
    if (!objectTypeCtx) {
      throw new Error('Expected object type in object creation');
    }
    let objectType = this.extractObjectTypeName(objectTypeCtx.getText());

    // Resolve role name to actual object type if needed
    // e.g., "vastgestelde contingent treinmiles" -> "Contingent treinmiles"
    for (const [feitTypeName, feitType] of this.feitTypes) {
      for (const rol of feitType.rollen || []) {
        // Clean role name by removing articles
        let roleNameClean = (rol.naam || '').toLowerCase();
        for (const article of ['de ', 'het ', 'een ']) {
          if (roleNameClean.startsWith(article)) {
            roleNameClean = roleNameClean.substring(article.length);
            break;
          }
        }

        // Clean object type by removing articles
        let objectTypeClean = objectType.toLowerCase();
        for (const article of ['de ', 'het ', 'een ']) {
          if (objectTypeClean.startsWith(article)) {
            objectTypeClean = objectTypeClean.substring(article.length);
            break;
          }
        }

        // Check if object type matches or contains the role name
        if (roleNameClean === objectTypeClean ||
          roleNameClean.includes(objectTypeClean) ||
          objectTypeClean.includes(roleNameClean)) {
          // Found matching role - use the actual object type
          objectType = rol.objectType || rol.object_type || objectType;
          break;
        }
      }
    }

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

    const node = {
      type: 'ObjectCreation',
      objectType,
      attributeInits
    };
    this.setLocation(node, ctx);
    return node;
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
    // Use extractTextWithSpaces to preserve multi-word names like "Natuurlijk persoon"
    const rawName = this.extractTextWithSpaces(nameCtx).trim();
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

    // Collect attribute names for compound attribute resolution
    const attributeNames = new Set<string>();

    for (const memberCtx of memberCtxs) {
      const member = this.visit(memberCtx);
      members.push(member);

      // Track attribute names for this object type
      if (member.type === 'AttributeSpecification' || member.type === 'KenmerkSpecification') {
        attributeNames.add(member.name);
      }
    }

    // Store attributes for this object type
    this.objectTypeAttributes.set(name, attributeNames);

    // Generate default plural if not explicitly provided
    const pluralForms = plural.length > 0 ? plural : this.generateDefaultPlural(name);

    const objType = {
      type: 'ObjectTypeDefinition' as const,
      name,
      plural: pluralForms,
      animated,
      members
    };

    // Store location separately
    this.setLocation(objType, ctx);

    return objType;
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
    // Get the name - can be identifier, naamwoord, or naamwoordWithNumbers
    let name: string;
    if (ctx.identifier()) {
      name = ctx.identifier().getText();
    } else if (ctx.naamwoordWithNumbers && ctx.naamwoordWithNumbers()) {
      const naamwoordCtx = ctx.naamwoordWithNumbers();
      name = this.extractText(naamwoordCtx);
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
    // Get the name - can be naamwoord or naamwoordWithNumbers
    let nameCtx;
    if (ctx.naamwoordWithNumbers && ctx.naamwoordWithNumbers()) {
      nameCtx = ctx.naamwoordWithNumbers();
    } else {
      nameCtx = ctx.naamwoord();
    }
    // Use extractTextWithSpaces to preserve multi-word parameter names
    const rawName = this.extractTextWithSpaces(nameCtx);
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
      // Check for named unit using unitIdentifier() accessor
      const unitIdCtx = ctx.unitIdentifier ? ctx.unitIdentifier() : null;
      if (unitIdCtx) {
        unit = unitIdCtx.getText();
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

    // Build node with only defined properties
    const node: AttributeSpecification = {
      type: 'AttributeSpecification',
      name,
      dataType
    };

    // Only add optional properties when they have values
    if (unit !== undefined) {
      node.unit = unit;
    }
    if (dimensions.length > 0) {
      node.dimensions = dimensions;
    }
    if (timeline) {
      node.timeline = timeline;
    }

    this.setLocation(node, ctx);
    return node;
  }

  visitDatatype(ctx: any): DataType {
    // Check which specific datatype it is
    if (ctx.tekstDatatype && ctx.tekstDatatype()) {
      const node: DataType = { type: 'Tekst' };
      this.setLocation(node, ctx);
      return node;
    } else if (ctx.numeriekDatatype && ctx.numeriekDatatype()) {
      return this.visitNumeriekDatatype(ctx.numeriekDatatype());
    } else if (ctx.booleanDatatype && ctx.booleanDatatype()) {
      const node: DataType = { type: 'Boolean' };
      this.setLocation(node, ctx);
      return node;
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

    this.setLocation(result, ctx);
    return result;
  }

  visitDatumTijdDatatype(ctx: any): DataType {
    // Check if it's DATUM or DATUM_TIJD
    const text = this.extractText(ctx);
    const node: DataType = text.toLowerCase().includes('tijd')
      ? { type: 'DatumTijd' }
      : { type: 'Datum' };
    this.setLocation(node, ctx);
    return node;
  }

  visitDomeinRef(ctx: any): DomainReference {
    const domain = this.extractText(ctx);
    const node = {
      type: 'DomainReference' as const,
      domain
    };
    this.setLocation(node, ctx);
    return node;
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
        // Fallback - use extractTextWithSpaces to preserve multi-word attributes
        nameText = this.extractTextWithSpaces(namePhrase);
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

    // Store location separately
    this.setLocation(result, ctx);

    if (unit) {
      result.unit = unit;
    }

    if (timeline) {
      result.timeline = timeline;
    }

    return result;
  }

  visitDagsoortDefinition(ctx: any): any {
    // Grammar: DAGSOORT naamwoord ( MV_START plural+=IDENTIFIER+ RPAREN )? SEMICOLON?
    const nameCtx = ctx.naamwoord();
    if (!nameCtx) {
      throw new Error('Expected naamwoord in dagsoort definition');
    }

    const name = this.extractTextWithSpaces(nameCtx);

    // Check for plural form
    let plural = undefined;
    if (ctx.MV_START && ctx.MV_START()) {
      // Get plural identifiers - they are labeled as plural
      const pluralCtxArray = ctx.plural || [];
      if (pluralCtxArray.length > 0) {
        plural = pluralCtxArray.map((t: any) => t.getText()).join(' ');
      }
    }

    const node = {
      type: 'Dagsoort',
      name,
      plural
    };
    this.setLocation(node, ctx);
    return node;
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

    const dimension = {
      type: 'Dimension' as const,
      name,
      plural,
      usageStyle,
      preposition,
      labels
    };

    // Store location separately
    this.setLocation(dimension, ctx);

    return dimension;
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

    // Store FeitType for role resolution during object creation
    const feitType = {
      naam,
      rollen,
      wederkerig,
      cardinalityDescription
    };
    this.feitTypes.set(naam, feitType);

    const node: FeitType = {
      type: 'FeitType',
      naam,
      wederkerig,
      rollen,
      cardinalityDescription
    };
    this.setLocation(node, ctx);
    return node;
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
      // rolObjectType is defined as identifierOrKeyword+ so we need to extract all words
      const objectTypeWords: string[] = [];
      if (ctx._objecttype.children) {
        for (const child of ctx._objecttype.children) {
          if (child.getText) {
            const text = child.getText();
            objectTypeWords.push(text);
          }
        }
      }
      objectType = objectTypeWords.join(' ');

      // Fallback to extractTextWithSpaces if no children found
      if (!objectType) {
        objectType = this.extractTextWithSpaces(ctx._objecttype);
      }
    }

    // Determine role name based on the words
    let roleName = '';
    if (!objectType && words.length > 0) {
      // No explicit object type, so we need to determine where the role ends and object type begins
      // Special case: single lowercase word might be the role name with object type lost due to tab handling
      if (words.length === 1 && words[0][0] === words[0][0].toLowerCase()) {
        // Extract object type from full text (tabs might have separated it)
        const fullText = ctx.getText();
        // Try to find capital letter that starts object type
        const match = fullText.match(/([a-z]+)([A-Z][a-zA-Z]*)/);
        if (match) {
          roleName = match[1];
          objectType = match[2];
        } else {
          // Special cases for known role-to-type mappings
          roleName = words[0];
          if (roleName === 'werknemer') {
            objectType = 'Persoon';  // werknemer is a Persoon
          } else if (roleName === 'gebouw') {
            objectType = 'Gebouw';
          } else {
            // Fallback: capitalize role name
            objectType = roleName.charAt(0).toUpperCase() + roleName.slice(1);
          }
        }
      } else if (words[words.length - 1] === 'Natuurlijk') {
        // "Natuurlijk persoon" is a common multi-word object type
        objectType = 'Natuurlijk persoon';
        roleName = words.slice(0, -1).join(' ');
      } else if (words[words.length - 1] === 'Bedrijf' ||
        words[words.length - 1] === 'Persoon' ||
        words[words.length - 1] === 'Vlucht' ||
        words[words.length - 1] === 'Gebouw') {
        // Single-word object types
        objectType = words[words.length - 1];
        roleName = words.slice(0, -1).join(' ');
      } else if (words.length >= 2 && words[words.length - 2] === 'Natuurlijk') {
        // In case "Natuurlijk persoon" was parsed as two separate words in content
        objectType = 'Natuurlijk persoon';
        roleName = words.slice(0, -2).join(' ');
      } else {
        // Default: last word is the object type
        objectType = words[words.length - 1];
        roleName = words.slice(0, -1).join(' ');
      }
    } else {
      // Object type is explicit, so all words are the role name
      roleName = words.join(' ');
    }

    // Check for plural form - it's labeled as _meervoud
    let meervoud: string | undefined;
    if (ctx._meervoud) {
      meervoud = this.extractTextWithSpaces(ctx._meervoud);
    }

    const node: Rol = {
      type: 'Rol',
      naam: roleName,
      meervoud,
      objectType
    };
    this.setLocation(node, ctx);
    return node;
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

    // If multiple words and first is an article, remove it (de, het, een)
    if (words.length > 1 && /^(de|het|een)$/i.test(words[0])) {
      // Join remaining words with space, preserving multi-word attributes
      return words.slice(1).join(' ');
    }

    // Check if article is concatenated with the name (no space)
    const concatenatedMatch = trimmed.match(/^(de|het|een)(.+)$/i);
    if (concatenatedMatch && concatenatedMatch[2]) {
      // Extract the part after the article
      return concatenatedMatch[2].trim();
    }

    return trimmed;
  }

  // Conditional rule support
  visitVoorwaardeDeel(ctx: any): Voorwaarde {
    // voorwaardeDeel : INDIEN ( expressie | toplevelSamengesteldeVoorwaarde )

    if (ctx.expressie && ctx.expressie()) {
      const expression = this.visit(ctx.expressie());
      const node: Voorwaarde = {
        type: 'Voorwaarde',
        expression
      };
      this.setLocation(node, ctx);
      return node;
    }

    if (ctx.toplevelSamengesteldeVoorwaarde && ctx.toplevelSamengesteldeVoorwaarde()) {
      const expression = this.visitToplevelSamengesteldeVoorwaarde(ctx.toplevelSamengesteldeVoorwaarde());
      const node: Voorwaarde = {
        type: 'Voorwaarde',
        expression
      };
      this.setLocation(node, ctx);
      return node;
    }

    throw new Error('Expected expression or compound condition in voorwaardeDeel');
  }

  // Variable block support (§11 spec)
  visitVariabeleDeel(ctx: any): VariableAssignment[] {
    // variabeleDeel : DAARBIJ_GELDT variabeleToekenning* DOT
    const assignments: VariableAssignment[] = [];

    if (ctx.variabeleToekenning && ctx.variabeleToekenning()) {
      const toekenningen = Array.isArray(ctx.variabeleToekenning())
        ? ctx.variabeleToekenning()
        : [ctx.variabeleToekenning()];

      for (const toekenning of toekenningen) {
        const assignment = this.visitVariabeleToekenning(toekenning);
        if (assignment) {
          assignments.push(assignment);
        }
      }
    }

    return assignments;
  }

  visitVariabeleToekenning(ctx: any): VariableAssignment {
    // variabeleToekenning : article=(DE | HET)? varName=IDENTIFIER IS varExpr=variabeleExpressie

    const nameToken = ctx.varName || ctx.IDENTIFIER();
    if (!nameToken) {
      throw new Error('Expected variable name in variabeleToekenning');
    }

    const name = nameToken.getText();

    const exprCtx = ctx.varExpr || ctx.variabeleExpressie();
    if (!exprCtx) {
      throw new Error('Expected expression in variabeleToekenning');
    }

    // Parse the variabeleExpressie which is a limited expression
    const expression = this.visitVariabeleExpressie(exprCtx);

    const assignment: VariableAssignment = {
      type: 'VariableAssignment',
      name,
      expression
    };

    this.setLocation(assignment, ctx);
    return assignment;
  }

  visitVariabeleExpressie(ctx: any): Expression {
    // variabeleExpressie : primaryExpression ( (additiveOperator | multiplicativeOperator) primaryExpression )*

    // Start with the first primary expression
    const primaryCtxList = ctx.primaryExpression();
    if (!primaryCtxList || primaryCtxList.length === 0) {
      throw new Error('Expected at least one primaryExpression in variabeleExpressie');
    }

    let result = this.visit(primaryCtxList[0]);

    // Check for operators and additional primary expressions
    if (primaryCtxList.length > 1) {
      // Combine operators - both additive and multiplicative can appear
      const additiveOps = ctx.additiveOperator ? ctx.additiveOperator() : [];
      const multiplicativeOps = ctx.multiplicativeOperator ? ctx.multiplicativeOperator() : [];

      // Process remaining expressions with their operators
      for (let i = 1; i < primaryCtxList.length; i++) {
        const rightExpr = this.visit(primaryCtxList[i]);

        // Find the operator for this position
        // Grammar guarantees an operator before each subsequent primaryExpression
        let operator = '';

        // Check additive operators first
        if (additiveOps && additiveOps[i - 1]) {
          operator = additiveOps[i - 1].getText();
        } else if (multiplicativeOps && multiplicativeOps[i - 1]) {
          operator = multiplicativeOps[i - 1].getText();
        }

        if (!operator) {
          // Try to get from context children directly
          const children = ctx.children || [];
          for (let j = 0; j < children.length; j++) {
            if (children[j] === primaryCtxList[i - 1]) {
              // Next child should be the operator
              if (j + 1 < children.length && children[j + 1].getText) {
                const text = children[j + 1].getText();
                if (['+', '-', '*', '/', 'maal', 'min', 'plus', 'gedeeld door'].includes(text)) {
                  operator = text;
                  break;
                }
              }
            }
          }
        }

        if (!operator) {
          operator = '+'; // Default to addition if no operator found
        }

        // Map Dutch operators to standard operators
        const operatorMap: Record<string, string> = {
          'plus': '+',
          'min': '-',
          'maal': '*',
          'gedeeld door': '/'
        };

        const normalizedOp = operatorMap[operator] || operator;

        result = {
          type: 'BinaryExpression',
          operator: normalizedOp,
          left: result,
          right: rightExpr
        } as BinaryExpression;

        this.setLocation(result, ctx);
      }
    }

    return result;
  }

  visitToplevelSamengesteldeVoorwaarde(ctx: any): SamengesteldeVoorwaarde {
    // Extract the quantifier
    const kwantificatie = this.visitVoorwaardeKwantificatie(ctx.voorwaardeKwantificatie());

    // Extract all condition parts
    const voorwaarden: Expression[] = [];

    // In ANTLR4 TypeScript, use the _list method to get all items
    const onderdeelContexts = ctx.samengesteldeVoorwaardeOnderdeel_list();

    if (onderdeelContexts) {
      for (const onderdeelCtx of onderdeelContexts) {
        const condition = this.visitSamengesteldeVoorwaardeOnderdeel(onderdeelCtx);
        if (condition) {
          voorwaarden.push(condition);
        }
      }
    }

    if (voorwaarden.length === 0) {
      throw new Error('No conditions found in compound condition');
    }

    // Map old quantifier to unified type
    let unifiedQuantifier: UnifiedQuantifierType;
    let count: number | undefined;

    switch (kwantificatie.type) {
      case KwantificatieType.ALLE:
        unifiedQuantifier = UnifiedQuantifierType.ALLE;
        break;
      case KwantificatieType.GEEN:
        unifiedQuantifier = UnifiedQuantifierType.GEEN;
        break;
      case KwantificatieType.TEN_MINSTE:
        unifiedQuantifier = UnifiedQuantifierType.TEN_MINSTE;
        count = kwantificatie.aantal;
        break;
      case KwantificatieType.TEN_HOOGSTE:
        unifiedQuantifier = UnifiedQuantifierType.TEN_HOOGSTE;
        count = kwantificatie.aantal;
        break;
      case KwantificatieType.PRECIES:
        unifiedQuantifier = UnifiedQuantifierType.PRECIES;
        count = kwantificatie.aantal;
        break;
    }

    // Convert expressions to predicates
    const unifiedPredicates: Predicate[] = voorwaarden.map(expr =>
      this.convertExpressionToPredicate(expr)
    );

    const node: SamengesteldeVoorwaarde = {
      type: 'SamengesteldeVoorwaarde',
      kwantificatie,
      voorwaarden,
      // Add unified predicate representation
      predicate: {
        type: 'CompoundPredicate',
        quantifier: unifiedQuantifier,
        count,
        predicates: unifiedPredicates
      } as CompoundPredicate
    };
    this.setLocation(node, ctx);
    if (node.predicate) {
      this.setLocation(node.predicate, ctx);
    }
    return node;
  }

  // Helper method to convert expressions to unified predicates
  private convertExpressionToPredicate(expr: Expression): Predicate {
    // Handle compound conditions
    if (expr.type === 'SamengesteldeVoorwaarde') {
      const compound = expr as SamengesteldeVoorwaarde;
      if (compound.predicate) {
        return compound.predicate;
      }
      // Fallback: create compound predicate from old structure
      let quantifier: UnifiedQuantifierType;
      let count: number | undefined;

      switch (compound.kwantificatie.type) {
        case KwantificatieType.ALLE:
          quantifier = UnifiedQuantifierType.ALLE;
          break;
        case KwantificatieType.GEEN:
          quantifier = UnifiedQuantifierType.GEEN;
          break;
        case KwantificatieType.TEN_MINSTE:
          quantifier = UnifiedQuantifierType.TEN_MINSTE;
          count = compound.kwantificatie.aantal;
          break;
        case KwantificatieType.TEN_HOOGSTE:
          quantifier = UnifiedQuantifierType.TEN_HOOGSTE;
          count = compound.kwantificatie.aantal;
          break;
        case KwantificatieType.PRECIES:
          quantifier = UnifiedQuantifierType.PRECIES;
          count = compound.kwantificatie.aantal;
          break;
      }

      return {
        type: 'CompoundPredicate',
        quantifier,
        count,
        predicates: compound.voorwaarden.map(v => this.convertExpressionToPredicate(v))
      } as CompoundPredicate;
    }

    // Handle binary expressions (comparisons)
    if (expr.type === 'BinaryExpression') {
      const binary = expr as BinaryExpression;
      return {
        type: 'SimplePredicate',
        operator: binary.operator as any,
        left: binary.left,
        right: binary.right
      } as SimplePredicate;
    }

    // Handle unary expressions (special predicates)
    if (expr.type === 'UnaryExpression') {
      const unary = expr as UnaryExpression;

      // Map operators to predicate operators
      if (unary.operator === 'voldoet aan de elfproef') {
        return {
          type: 'SimplePredicate',
          operator: 'elfproef',
          left: unary.operand
        } as SimplePredicate;
      }
      if (unary.operator === 'voldoet niet aan de elfproef') {
        return {
          type: 'SimplePredicate',
          operator: 'elfproef',
          left: unary.operand,
          negated: true
        } as SimplePredicate;
      }
      // Add more mappings as needed
    }

    // For other expressions, don't convert to predicate
    // This preserves the original behavior where non-boolean expressions
    // in compound conditions will cause a type error
    // Return the expression as-is (it's not a valid Predicate type)
    return expr as any;
  }

  extractNumber(ctx: any): number {
    // Extract number from quantifier context
    if (ctx.NUMBER && ctx.NUMBER()) {
      return parseInt(ctx.NUMBER().getText(), 10);
    } else if (ctx.EEN && ctx.EEN()) {
      return 1;
    } else if (ctx.EEN_TELWOORD && ctx.EEN_TELWOORD()) {
      return 1;
    } else if (ctx.TWEE_TELWOORD && ctx.TWEE_TELWOORD()) {
      return 2;
    } else if (ctx.DRIE_TELWOORD && ctx.DRIE_TELWOORD()) {
      return 3;
    } else if (ctx.VIER_TELWOORD && ctx.VIER_TELWOORD()) {
      return 4;
    }
    throw new Error('Could not extract number from quantifier');
  }

  visitVoorwaardeKwantificatie(ctx: any): Kwantificatie {
    if (ctx.ALLE && ctx.ALLE()) {
      return {
        type: KwantificatieType.ALLE
      };
    } else if (ctx.GEEN_VAN_DE && ctx.GEEN_VAN_DE()) {
      return {
        type: KwantificatieType.GEEN
      };
    } else if (ctx.TEN_MINSTE && ctx.TEN_MINSTE()) {
      const number = this.extractNumber(ctx);
      return {
        type: KwantificatieType.TEN_MINSTE,
        aantal: number
      };
    } else if (ctx.TEN_HOOGSTE && ctx.TEN_HOOGSTE()) {
      const number = this.extractNumber(ctx);
      return {
        type: KwantificatieType.TEN_HOOGSTE,
        aantal: number
      };
    } else if (ctx.PRECIES && ctx.PRECIES()) {
      const number = this.extractNumber(ctx);
      return {
        type: KwantificatieType.PRECIES,
        aantal: number
      };
    }

    throw new Error('Unknown quantifier in compound condition');
  }

  visitSamengesteldeVoorwaardeOnderdeel(ctx: any): Expression | null {
    // Skip the bullet prefix and visit the actual condition
    if (ctx.elementaireVoorwaarde && ctx.elementaireVoorwaarde()) {
      return this.visitElementaireVoorwaarde(ctx.elementaireVoorwaarde());
    } else if (ctx.genesteSamengesteldeVoorwaarde && ctx.genesteSamengesteldeVoorwaarde()) {
      return this.visitGenesteSamengesteldeVoorwaarde(ctx.genesteSamengesteldeVoorwaarde());
    }

    return null;
  }

  visitElementaireVoorwaarde(ctx: any): Expression {
    // Elementary condition is just an expression
    return this.visit(ctx.expressie());
  }

  visitGenesteSamengesteldeVoorwaarde(ctx: any): SamengesteldeVoorwaarde {
    // Extract the quantifier
    const kwantificatie = this.visitVoorwaardeKwantificatie(ctx.voorwaardeKwantificatie());

    // Extract all condition parts
    const voorwaarden: Expression[] = [];

    // In ANTLR4 TypeScript, use the _list method to get all items
    const onderdeelContexts = ctx.samengesteldeVoorwaardeOnderdeel_list();

    if (onderdeelContexts) {
      for (const onderdeelCtx of onderdeelContexts) {
        const condition = this.visitSamengesteldeVoorwaardeOnderdeel(onderdeelCtx);
        if (condition) {
          voorwaarden.push(condition);
        }
      }
    }

    if (voorwaarden.length === 0) {
      throw new Error('No conditions found in nested compound condition');
    }

    // Map old quantifier to unified type
    let unifiedQuantifier: UnifiedQuantifierType;
    let count: number | undefined;

    switch (kwantificatie.type) {
      case KwantificatieType.ALLE:
        unifiedQuantifier = UnifiedQuantifierType.ALLE;
        break;
      case KwantificatieType.GEEN:
        unifiedQuantifier = UnifiedQuantifierType.GEEN;
        break;
      case KwantificatieType.TEN_MINSTE:
        unifiedQuantifier = UnifiedQuantifierType.TEN_MINSTE;
        count = kwantificatie.aantal;
        break;
      case KwantificatieType.TEN_HOOGSTE:
        unifiedQuantifier = UnifiedQuantifierType.TEN_HOOGSTE;
        count = kwantificatie.aantal;
        break;
      case KwantificatieType.PRECIES:
        unifiedQuantifier = UnifiedQuantifierType.PRECIES;
        count = kwantificatie.aantal;
        break;
    }

    // Convert expressions to predicates
    const unifiedPredicates: Predicate[] = voorwaarden.map(expr =>
      this.convertExpressionToPredicate(expr)
    );

    const node: SamengesteldeVoorwaarde = {
      type: 'SamengesteldeVoorwaarde',
      kwantificatie,
      voorwaarden,
      // Add unified predicate representation
      predicate: {
        type: 'CompoundPredicate',
        quantifier: unifiedQuantifier,
        count,
        predicates: unifiedPredicates
      } as CompoundPredicate
    };
    this.setLocation(node, ctx);
    if (node.predicate) {
      this.setLocation(node.predicate, ctx);
    }
    return node;
  }

  visitIsKenmerkExpr(ctx: any): BinaryExpression {
    // Handle "is kenmerk" expressions (e.g., "hij is minderjarig")
    const left = this.visit(ctx._left || ctx.additiveExpression());
    // Check for naamwoordWithNumbers first, then fall back to naamwoord
    const kenmerk = ctx.naamwoordWithNumbers && ctx.naamwoordWithNumbers() ?
      this.extractTextWithSpaces(ctx.naamwoordWithNumbers()) :
      (ctx.naamwoord ? ctx.naamwoord().getText() : '');

    const node: BinaryExpression = {
      type: 'BinaryExpression',
      operator: '==',
      left,
      right: {
        type: 'StringLiteral',
        value: kenmerk
      } as Expression
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitHeeftKenmerkExpr(ctx: any): BinaryExpression {
    // Handle "heeft kenmerk" expressions (e.g., "hij heeft ervaring")
    const left = this.visit(ctx._left || ctx.additiveExpression());
    // Check for naamwoordWithNumbers first, then fall back to naamwoord
    const kenmerk = ctx.naamwoordWithNumbers && ctx.naamwoordWithNumbers() ?
      this.extractTextWithSpaces(ctx.naamwoordWithNumbers()) :
      (ctx.naamwoord ? ctx.naamwoord().getText() : '');

    const node: BinaryExpression = {
      type: 'BinaryExpression',
      operator: '==',
      left,
      right: {
        type: 'StringLiteral',
        value: kenmerk
      } as Expression
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitSubordinateClauseExpr(ctx: any): Expression {
    // Delegate to the specific subordinate clause expression
    if (ctx.subordinateClauseExpression) {
      return this.visit(ctx.subordinateClauseExpression());
    }
    // Fallback
    return this.visit(ctx);
  }

  visitSubordinateIsKenmerkExpr(ctx: any): BinaryExpression {
    // Handle "is kenmerk" expressions in subordinate clauses (e.g., "hij is student")
    const subject = this.visitOnderwerpReferentie(ctx._subject || ctx.onderwerpReferentie());
    // Check for naamwoordWithNumbers first
    const kenmerk = ctx._kenmerk ?
      (ctx._kenmerk.naamwoordWithNumbers ? this.extractTextWithSpaces(ctx._kenmerk) : ctx._kenmerk.getText()) :
      (ctx.naamwoordWithNumbers && ctx.naamwoordWithNumbers() ?
        this.extractTextWithSpaces(ctx.naamwoordWithNumbers()) :
        (ctx.naamwoord ? ctx.naamwoord().getText() : ''));

    const node: BinaryExpression = {
      type: 'BinaryExpression',
      operator: '==',
      left: subject,
      right: {
        type: 'BooleanLiteral',
        value: true
      } as Expression
    };
    this.setLocation(node, ctx);
    return node;
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
    let isElfproef = false;
    let negated = false;

    if (ctx.IS_LEEG && ctx.IS_LEEG()) {
      operator = 'is leeg';
    } else if (ctx.IS_GEVULD && ctx.IS_GEVULD()) {
      operator = 'is gevuld';
    } else if (ctx.VOLDOET_AAN_DE_ELFPROEF && ctx.VOLDOET_AAN_DE_ELFPROEF()) {
      operator = 'voldoet aan de elfproef';
      isElfproef = true;
    } else if (ctx.VOLDOET_NIET_AAN_DE_ELFPROEF && ctx.VOLDOET_NIET_AAN_DE_ELFPROEF()) {
      operator = 'voldoet niet aan de elfproef';
      isElfproef = true;
      negated = true;
    } else if (ctx.ZIJN_LEEG && ctx.ZIJN_LEEG()) {
      operator = 'zijn leeg';
    } else if (ctx.ZIJN_GEVULD && ctx.ZIJN_GEVULD()) {
      operator = 'zijn gevuld';
    } else if (ctx.VOLDOEN_AAN_DE_ELFPROEF && ctx.VOLDOEN_AAN_DE_ELFPROEF()) {
      operator = 'voldoen aan de elfproef';
      isElfproef = true;
    } else if (ctx.VOLDOEN_NIET_AAN_DE_ELFPROEF && ctx.VOLDOEN_NIET_AAN_DE_ELFPROEF()) {
      operator = 'voldoen niet aan de elfproef';
      isElfproef = true;
      negated = true;
    } else {
      throw new Error('Unknown unary check operator');
    }

    // For elfproef checks, create SimplePredicate with unified representation
    if (isElfproef) {
      // Create wrapper that looks like UnaryExpression but contains unified predicate
      const node = {
        type: 'UnaryExpression',
        operator: operator,
        operand: operand,
        // Add unified predicate representation
        predicate: {
          type: 'SimplePredicate',
          operator: 'elfproef',
          left: operand,
          negated: negated
        } as SimplePredicate
      } as any;
      this.setLocation(node, ctx);
      if (node.predicate) {
        this.setLocation(node.predicate, ctx);
      }
      return node;
    }

    // For other checks, keep as UnaryExpression for now
    const node = {
      type: 'UnaryExpression',
      operator: operator,
      operand: operand
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitBezieldeRefExpr(ctx: any): any {
    // This handles patterns like "zijn burgerservicenummer"
    const bezieldeRef = ctx.bezieldeReferentie();

    // The grammar is: bezieldeReferentie : ZIJN naamwoord
    // Get the naamwoord (noun)
    const naamwoordCtx = bezieldeRef.naamwoord();
    const attribute = naamwoordCtx ? naamwoordCtx.getText() : 'unknown';

    // Return an AttributeReference with 'self' path, matching Python implementation
    const node = {
      type: 'AttributeReference',
      path: ['self', attribute]
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitBooleanTrueLiteralExpr(ctx: any): Expression {
    const node = {
      type: 'BooleanLiteral',
      value: true
    } as Expression;
    this.setLocation(node, ctx);
    return node;
  }

  visitBooleanFalseLiteralExpr(ctx: any): Expression {
    const node = {
      type: 'BooleanLiteral',
      value: false
    } as Expression;
    this.setLocation(node, ctx);
    return node;
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

    const node = {
      type: 'Kenmerktoekenning',
      subject,
      characteristic
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitDagsoortdefinitieResultaat(ctx: any): any {
    // Grammar: EEN DAG IS EEN naamwoord
    // Extract the dagsoort name from naamwoord
    const naamwoordCtx = ctx.naamwoord();
    if (!naamwoordCtx) {
      throw new Error('Expected naamwoord in dagsoortdefinitie');
    }

    const dagsoortName = this.extractTextWithSpaces(naamwoordCtx);

    const node = {
      type: 'DagsoortDefinitie',
      dagsoortName
    };
    this.setLocation(node, ctx);
    return node;
  }

  // ========== Noun Visitor Methods ==========
  // Critical for TOKA support - handles compound nouns with articles and prepositions

  visitNaamwoord(ctx: any): string {
    // Process all parts of the naamwoord according to grammar:
    // naamwoord : naamPhrase ( voorzetsel naamPhrase )*
    const allParts: string[] = [];

    // Process the complete structure
    const childCount = ctx.getChildCount ? ctx.getChildCount() : 0;
    for (let i = 0; i < childCount; i++) {
      const child = ctx.getChild(i);

      if (child.constructor.name === 'NaamPhraseContext') {
        // Process naam phrase - extract text without articles
        const phraseParts: string[] = [];
        const phraseChildCount = child.getChildCount ? child.getChildCount() : 0;

        for (let j = 0; j < phraseChildCount; j++) {
          const subchild = child.getChild(j);
          if (subchild.getText) {
            const text = subchild.getText();
            // Skip articles (both lowercase and capitalized)
            if (!['de', 'het', 'een', 'De', 'Het', 'Een'].includes(text)) {
              phraseParts.push(text);
            }
          } else if (subchild.constructor.name === 'IdentifierOrKeywordContext') {
            const text = this.extractText(subchild);
            // Skip capitalized articles that were parsed as identifiers
            if (!['de', 'het', 'een'].includes(text.toLowerCase())) {
              phraseParts.push(text);
            }
          }
        }

        if (phraseParts.length > 0) {
          allParts.push(phraseParts.join(' '));
        }
      } else if (child.constructor.name === 'VoorzetselContext') {
        // Add the preposition
        allParts.push(this.extractText(child));
      }
    }

    // Join all parts with spaces
    return allParts.length > 0 ? allParts.join(' ') : this.extractTextWithSpaces(ctx);
  }

  /**
   * Parse a naamwoord context into a navigation path array.
   * Handles patterns like "passagiers van de reis" and returns ["reis", "passagiers"]
   * for proper navigation through relationships.
   * 
   * Key distinction:
   * - "passagiers van de reis" = navigation (only "van") → split to ["reis", "passagiers"]
   * - "belasting op basis van afstand" = compound attr (has "op" + "van") → keep as single element
   * 
   * Port of Python builder.py:935-986 (_parse_naamwoord_to_navigation_path)
   */
  private _parseNaamwoordToNavigationPath(ctx: any): string[] {
    if (!ctx) {
      return [];
    }

    // Collect all parts from the naamwoord structure
    // Grammar: naamwoord : naamPhrase ( voorzetsel naamPhrase )*
    const parts: string[] = [];
    const prepositions: string[] = [];

    const childCount = ctx.getChildCount ? ctx.getChildCount() : 0;
    for (let i = 0; i < childCount; i++) {
      const child = ctx.getChild(i);

      if (child.constructor.name === 'NaamPhraseContext') {
        // Extract text from naamPhrase without articles
        const phraseText: string[] = [];
        const phraseChildCount = child.getChildCount ? child.getChildCount() : 0;

        for (let j = 0; j < phraseChildCount; j++) {
          const subchild = child.getChild(j);
          if (subchild.getText) {
            const text = subchild.getText();
            // Skip articles
            if (!['de', 'het', 'een', 'De', 'Het', 'Een'].includes(text)) {
              phraseText.push(text);
            }
          }
        }

        if (phraseText.length > 0) {
          parts.push(phraseText.join(' '));
        }
      } else if (child.constructor.name === 'VoorzetselContext') {
        // Track all prepositions
        const text = this.extractText(child);
        prepositions.push(text);
      }
    }

    // Only treat as navigation if:
    // 1. We have 2+ parts AND
    // 2. The ONLY preposition is "van" (pure navigation pattern)
    // 
    // If there are other prepositions (op, bij, voor, etc.), keep as compound attribute name
    const isNavigation = parts.length >= 2 &&
      prepositions.length === 1 &&
      prepositions[0] === 'van';

    if (isNavigation) {
      // Reverse for Dutch navigation: "passagiers van de reis" -> ["reis", "passagiers"]
      return parts.reverse();
    }

    // Not pure navigation - return as single compound element
    // Join all parts to preserve compound attribute names like "belasting op basis van afstand"
    return parts.length > 0 ? [this.visitNaamwoord(ctx)] : [this.extractTextWithSpaces(ctx)];
  }


  visitNaamwoordWithNumbers(ctx: any): string {
    // Process all parts of the naamwoordWithNumbers according to grammar:
    // naamwoordWithNumbers : naamPhraseWithNumbers ( voorzetsel naamPhraseWithNumbers )*
    const allParts: string[] = [];

    // Process the complete structure
    const childCount = ctx.getChildCount ? ctx.getChildCount() : 0;
    for (let i = 0; i < childCount; i++) {
      const child = ctx.getChild(i);

      if (child.constructor.name === 'NaamPhraseWithNumbersContext') {
        // Process naam phrase - extract text without articles
        const phraseParts: string[] = [];
        const phraseChildCount = child.getChildCount ? child.getChildCount() : 0;

        for (let j = 0; j < phraseChildCount; j++) {
          const subchild = child.getChild(j);
          if (subchild.getText) {
            const text = subchild.getText();
            // Skip articles (both lowercase and capitalized)
            if (!['de', 'het', 'een', 'De', 'Het', 'Een'].includes(text)) {
              phraseParts.push(text);
            }
          } else if (subchild.constructor.name === 'IdentifierOrKeywordWithNumbersContext' ||
            subchild.constructor.name === 'IdentifierOrKeywordContext') {
            const text = this.extractText(subchild);
            // Skip capitalized articles that were parsed as identifiers
            if (!['de', 'het', 'een'].includes(text.toLowerCase())) {
              phraseParts.push(text);
            }
          }
        }

        if (phraseParts.length > 0) {
          allParts.push(phraseParts.join(' '));
        }
      } else if (child.constructor.name === 'VoorzetselContext') {
        // Add the preposition
        allParts.push(this.extractText(child));
      }
    }

    // Join all parts with spaces
    return allParts.length > 0 ? allParts.join(' ') : this.extractTextWithSpaces(ctx);
  }

  visitNaamwoordNoIs(ctx: any): string {
    // First, get the complete text without articles to check if it's a known attribute
    const completeTextParts: string[] = [];
    const childCount = ctx.getChildCount ? ctx.getChildCount() : 0;

    for (let i = 0; i < childCount; i++) {
      const child = ctx.getChild(i);
      if (child.constructor.name === 'NaamPhraseNoIsContext') {
        const phraseChildCount = child.getChildCount ? child.getChildCount() : 0;
        for (let j = 0; j < phraseChildCount; j++) {
          const subchild = child.getChild(j);
          if (subchild.getText) {
            const text = subchild.getText();
            // Skip articles
            if (!['de', 'het', 'een', 'De', 'Het', 'Een'].includes(text)) {
              completeTextParts.push(text);
            }
          } else if (subchild.constructor.name === 'IdentifierOrKeywordNoIsContext') {
            const text = this.extractText(subchild);
            if (!['de', 'het', 'een'].includes(text.toLowerCase())) {
              completeTextParts.push(text);
            }
          }
        }
      } else if (child.constructor.name === 'VoorzetselContext') {
        completeTextParts.push(this.extractText(child));
      }
    }

    const completeText = completeTextParts.join(' ');

    // For now, skip the domain model check and proceed with truncation logic
    // This can be enhanced later when domain model is properly integrated

    // Process with truncation logic for navigation
    const allParts: string[] = [];
    const navigationIndicators = ['de', 'het', 'alle', 'een', 'zijn', 'haar', 'hun'];
    let stopAtNavigation = false;

    // Process the complete structure
    for (let i = 0; i < childCount; i++) {
      const child = ctx.getChild(i);

      if (child.constructor.name === 'NaamPhraseNoIsContext') {
        // Check if this phrase starts with a navigation indicator
        let hasNavIndicator = false;
        let firstToken: string | null = null;

        const phraseChildCount = child.getChildCount ? child.getChildCount() : 0;
        for (let j = 0; j < phraseChildCount; j++) {
          const subchild = child.getChild(j);
          if (subchild.getText) {
            const tokenText = subchild.getText().toLowerCase();
            if (firstToken === null) {
              firstToken = tokenText;
            }
            if (navigationIndicators.includes(tokenText)) {
              hasNavIndicator = true;
              break;
            }
          } else if (subchild.constructor.name === 'IdentifierOrKeywordNoIsContext' && firstToken === null) {
            firstToken = this.extractText(subchild).toLowerCase();
          }
        }

        // If we've seen a voorzetsel and this phrase starts with navigation indicator, stop
        if (i > 0 && hasNavIndicator) {
          stopAtNavigation = true;
          break;
        }

        // Process naam phrase - extract text without articles
        const phraseParts: string[] = [];
        for (let j = 0; j < phraseChildCount; j++) {
          const subchild = child.getChild(j);
          if (subchild.getText) {
            const text = subchild.getText();
            // Skip articles
            if (!['de', 'het', 'een', 'De', 'Het', 'Een'].includes(text)) {
              phraseParts.push(text);
            }
          } else if (subchild.constructor.name === 'IdentifierOrKeywordNoIsContext') {
            const text = this.extractText(subchild);
            // Skip capitalized articles that were parsed as identifiers
            if (!['de', 'het', 'een'].includes(text.toLowerCase())) {
              phraseParts.push(text);
            }
          }
        }

        if (phraseParts.length > 0) {
          allParts.push(phraseParts.join(' '));
        }
      } else if (child.constructor.name === 'VoorzetselContext') {
        // Check if the next naamPhrase starts with navigation indicator
        if (i + 1 < childCount) {
          const nextChild = ctx.getChild(i + 1);
          if (nextChild.constructor.name === 'NaamPhraseNoIsContext') {
            // Check if it starts with navigation indicator
            const nextChildCount = nextChild.getChildCount ? nextChild.getChildCount() : 0;
            for (let j = 0; j < nextChildCount; j++) {
              const subchild = nextChild.getChild(j);
              if (subchild.getText) {
                const tokenText = subchild.getText().toLowerCase();
                if (navigationIndicators.includes(tokenText)) {
                  stopAtNavigation = true;
                  break;
                }
              }
              break; // Only check first token
            }
          }
        }

        if (stopAtNavigation) {
          break;
        }

        // Add the preposition
        allParts.push(this.extractText(child));
      }
    }

    // Join all parts with spaces
    return allParts.length > 0 ? allParts.join(' ') : this.extractTextWithSpaces(ctx);
  }

  visitSimpleNaamwoord(ctx: any): string {
    // simpleNaamwoord : naamPhrase
    const naamPhraseCtx = ctx.naamPhrase ? ctx.naamPhrase() : null;
    if (naamPhraseCtx) {
      // Process naam phrase - extract text without articles
      const phraseParts: string[] = [];
      const childCount = naamPhraseCtx.getChildCount ? naamPhraseCtx.getChildCount() : 0;

      for (let i = 0; i < childCount; i++) {
        const child = naamPhraseCtx.getChild(i);
        if (child.getText) {
          const tokenText = child.getText();
          // Skip articles at the beginning of phrases
          if (!['de', 'het', 'een', 'De', 'Het', 'Een', 'zijn', 'Zijn'].includes(tokenText)) {
            phraseParts.push(tokenText);
          }
        } else {
          // Non-terminal nodes (like identifierOrKeyword)
          phraseParts.push(this.extractText(child));
        }
      }

      return phraseParts.length > 0 ? phraseParts.join(' ') : this.extractTextWithSpaces(ctx);
    }

    return this.extractTextWithSpaces(ctx);
  }

  // ========== Expression Wrapper Methods ==========

  visitNaamwoordExpr(ctx: any): Expression {
    const naamwoordCtx = ctx.naamwoord ? ctx.naamwoord() : null;
    if (naamwoordCtx) {
      const text = this.visitNaamwoord(naamwoordCtx);

      // Check for navigation patterns (similar to Python builder.py:1107-1128)
      if (text.includes(' van ') || text.includes(' op ')) {
        // This looks like a navigation expression, build an AttributeReference
        const parts = text.split(/\s+(van|op)\s+/);

        if (parts.length >= 3) {
          // Extract the attribute (first part) and navigation path
          const attrName = this.extractParameterName(parts[0]);
          const navigationParts: string[] = [];

          // Process remaining parts, skipping 'van'/'op' separators
          for (let i = 2; i < parts.length; i += 2) {
            if (parts[i]) {
              // Remove articles and clean up the navigation element
              const cleanPart = this.extractParameterName(parts[i]);
              if (cleanPart) {
                navigationParts.push(cleanPart);
              }
            }
          }

          // Build path in Dutch right-to-left order:
          // "de naam van persoon" → ["persoon", "naam"]
          if (navigationParts.length > 0) {
            const path = [...navigationParts.reverse(), attrName];
            const node: AttributeReference = {
              type: 'AttributeReference',
              path: path
            };
            this.setLocation(node, ctx);
            return node;
          }
        }
      }

      // Not a navigation pattern, return as string literal
      const node: StringLiteral = {
        type: 'StringLiteral',
        value: text
      };
      this.setLocation(node, ctx);
      return node;
    }
    // Fallback to text extraction
    const fullText = this.extractTextWithSpaces(ctx);

    // Check for navigation patterns in the full text
    if (fullText.includes(' van ') || fullText.includes(' op ')) {
      const parts = fullText.split(/\s+(van|op)\s+/);

      if (parts.length >= 3) {
        const attrName = this.extractParameterName(parts[0]);
        const navigationParts: string[] = [];

        for (let i = 2; i < parts.length; i += 2) {
          if (parts[i]) {
            const cleanPart = this.extractParameterName(parts[i]);
            if (cleanPart) {
              navigationParts.push(cleanPart);
            }
          }
        }

        if (navigationParts.length > 0) {
          const path = [...navigationParts.reverse(), attrName];
          const node: AttributeReference = {
            type: 'AttributeReference',
            path: path
          };
          this.setLocation(node, ctx);
          return node;
        }
      }
    }

    const node: StringLiteral = {
      type: 'StringLiteral',
      value: fullText
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitParamRefExpr(ctx: any): Expression {
    const paramCtx = ctx.parameterMetLidwoord ? ctx.parameterMetLidwoord() : null;
    if (!paramCtx) {
      throw new Error('Expected parameterMetLidwoord in ParamRefExpr');
    }

    let paramName: string;

    if (paramCtx.naamwoord && paramCtx.naamwoord()) {
      // Simple case: just a naamwoord
      paramName = this.visitNaamwoord(paramCtx.naamwoord());
    } else {
      // Complex case: parameter with prepositions
      const fullText = this.extractTextWithSpaces(paramCtx);
      // Remove leading articles
      paramName = this._stripArticle(fullText);
    }

    const node: VariableReference = {
      type: 'VariableReference',  // TypeScript uses VariableReference for parameters
      variableName: paramName
    };
    this.setLocation(node, ctx);
    return node;
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

    // Multiple children - try text extraction as fallback before giving up
    const text = this.extractTextWithSpaces(node);
    console.warn(`Unhandled ${node.constructor.name} with ${node.children.length} children - using text fallback: "${text}"`);

    // Return as string literal for now - better than crashing
    return { type: 'StringLiteral', value: text };
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
    const node = {
      type: 'Rule',
      name: naam,
      version: { type: 'RuleVersion', validity: 'altijd' },
      result: resultaat,
      condition: voorwaarde
    };
    this.setLocation(node, ctx);
    return node;
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

    const node: Consistentieregel = {
      type: 'Consistentieregel',
      criteriumType: 'uniek',
      target: target
    };
    this.setLocation(node, ctx);
    return node;
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
    const node: AttributeReference = {
      type: 'AttributeReference',
      path: [attrName, 'alle', objTypeName]
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitInconsistentResultaat(ctx: any): Consistentieregel {
    // Handle inconsistency check
    const node: Consistentieregel = {
      type: 'Consistentieregel',
      criteriumType: 'inconsistent'
    };
    this.setLocation(node, ctx);
    return node;
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

    const node = {
      type: 'Verdeling',
      sourceAmount,
      targetCollection,
      distributionMethods,
      remainderTarget
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitVerdelingGelijkeDelen(ctx: any): any {
    return { type: 'VerdelingGelijkeDelen' };
  }

  visitVerdelingNaarRato(ctx: any): any {
    const ratioExpression = this.visit(ctx._ratioExpression);
    const node = {
      type: 'VerdelingNaarRato',
      ratioExpression
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitVerdelingOpVolgorde(ctx: any): any {
    const orderDirection = ctx._orderDirection?.text || 'toenemende';
    const orderExpression = this.visit(ctx._orderExpression);
    const node = {
      type: 'VerdelingOpVolgorde',
      orderDirection: orderDirection as 'toenemende' | 'afnemende',
      orderExpression
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitVerdelingTieBreak(ctx: any): any {
    const tieBreakMethod = this.visit(ctx._tieBreakMethod);
    const node = {
      type: 'VerdelingTieBreak',
      tieBreakMethod
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitVerdelingMaximum(ctx: any): any {
    const maxExpression = this.visit(ctx._maxExpression);
    const node = {
      type: 'VerdelingMaximum',
      maxExpression
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitVerdelingAfronding(ctx: any): any {
    const decimals = ctx._decimals ? parseInt(ctx._decimals.text) : 0;
    const roundDirection = ctx._roundDirection?.text || 'naar beneden';
    const node = {
      type: 'VerdelingAfronding',
      decimals,
      roundDirection: roundDirection as 'naar beneden' | 'naar boven'
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitConsistencyCheckResultaat(ctx: any): any {
    // Handle consistency checks like "moet ongelijk zijn aan"
    // Grammar: attribuutReferentie consistencyOperator expressie
    const targetRef = this.visitAttribuutReferentie(ctx.attribuutReferentie());
    const expr = this.visit(ctx.expressie());

    if (!targetRef || !expr) {
      throw new Error('Failed to parse consistency check target or expression');
    }

    // Map consistency operators to comparison operators
    const operatorCtx = ctx.consistencyOperator ? ctx.consistencyOperator() : null;
    let operator = '!='; // default to not equal

    if (operatorCtx) {
      const operatorText = operatorCtx.getText().toLowerCase();
      if (operatorText.includes('ongelijk')) {
        operator = '!=';
      } else if (operatorText.includes('kleiner')) {
        operator = '<';
      } else if (operatorText.includes('groter')) {
        operator = '>';
      } else if (operatorText.includes('gelijk')) {
        operator = '==';
      }
    }

    // Create a Consistentieregel node
    const node: Consistentieregel = {
      type: 'Consistentieregel',
      criteriumType: 'inconsistent', // This is a consistency check
      target: targetRef,
      condition: {
        type: 'BinaryExpression',
        operator: operator as any,
        left: targetRef,
        right: expr
      } as BinaryExpression
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitRelationshipWithAttributeResultaat(ctx: any): any {
    // Handle "Een X heeft het Y met attribuut gelijk aan expressie" pattern
    // Get the onderwerp reference (the subject)
    const onderwerpCtx = ctx.onderwerpReferentie ? ctx.onderwerpReferentie() : null;
    let onderwerpPath: string[] = [];
    if (onderwerpCtx) {
      onderwerpPath = this.visitOnderwerpReferentieToPath(onderwerpCtx);
    }

    // Get the relationship target (het/de naamwoord after HEEFT)
    const naamwoordCtx = ctx.naamwoord ? ctx.naamwoord() : null;
    const relTarget = naamwoordCtx ? this.extractText(naamwoordCtx) : '';

    // Get the attribute to set
    const attrCtx = ctx.attribuutMetLidwoord ? ctx.attribuutMetLidwoord() : null;
    let attrName = '';
    if (attrCtx) {
      attrName = this.extractText(attrCtx);
      // Clean up Dutch articles from the beginning if present
      if (attrName.startsWith('het ')) {
        attrName = attrName.substring(4);
      } else if (attrName.startsWith('de ')) {
        attrName = attrName.substring(3);
      } else if (attrName.startsWith('een ')) {
        attrName = attrName.substring(4);
      }
    }

    // Get the value expression
    const valueExpr = ctx.expressie ? this.visit(ctx.expressie()) : null;

    if (!valueExpr) {
      throw new Error('Failed to parse value expression in relationship creation');
    }

    // Create an ObjectCreation node with the attribute initialization
    const node: ObjectCreation = {
      type: 'ObjectCreation',
      objectType: relTarget, // The relationship target becomes the object type
      attributeInits: [{
        attribute: attrName,
        value: valueExpr
      }]
    };
    this.setLocation(node, ctx);
    return node;
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

    // Import header parser for parsing columns
    const { DecisionTableHeaderParser } = require('../parsers/decision-table-header-parser');
    const headerParser = new DecisionTableHeaderParser();

    // Parse the result and condition columns
    const parsedResult = headerParser.parseResultColumn(table.resultColumn);
    const parsedConditions = table.conditionColumns.map((col: string) =>
      headerParser.parseConditionColumn(col)
    );

    const decisionTable = {
      type: 'DecisionTable',
      name,
      validity,
      ...table,  // Contains resultColumn, conditionColumns, and rows
      parsedResult,
      parsedConditions
    };

    // Store location separately
    this.setLocation(decisionTable, ctx);

    return decisionTable;
  }

  visitBeslistabelTable(ctx: any): any {
    // Visit header to get column information
    const header = this.visit(ctx.beslistabelHeader());

    // Visit all rows
    const rows = ctx.beslistabelRow_list().map((row: any) => this.visit(row));

    const node = {
      ...header,
      rows
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitBeslistabelHeader(ctx: any): any {
    // Extract result column text including hidden whitespace
    const resultColumn = this.getFullText(ctx._resultColumn);

    // Extract condition column texts - they are stored in _conditionColumns array
    const conditionColumns = ctx._conditionColumns ?
      ctx._conditionColumns.map((col: any) => this.getFullText(col)) :
      [];

    const node = {
      resultColumn,
      conditionColumns
    };
    this.setLocation(node, ctx);
    return node;
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

    const node = {
      type: 'DecisionTableRow',
      rowNumber,
      resultExpression,
      conditionValues
    };
    this.setLocation(node, ctx);
    return node;
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

    const node: UnitSystemDefinition = {
      type: 'UnitSystemDefinition',
      name,
      units
    };
    this.setLocation(node, ctx);
    return node;
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

    const node = {
      name: unitName,
      plural,
      abbreviation: abbrev,
      symbol,
      conversion
    };
    this.setLocation(node, ctx);
    return node;
  }

  visitTijdsevenredigDeelExpr(ctx: any): Expression {
    // HET TIJDSEVENREDIG DEEL PER (MAAND|JAAR) VAN expressie [GEDURENDE DE TIJD DAT condition]
    let periodType: 'tijdsevenredig_deel_per_maand' | 'tijdsevenredig_deel_per_jaar';

    if (ctx.MAAND && ctx.MAAND()) {
      periodType = 'tijdsevenredig_deel_per_maand';
    } else if (ctx.JAAR && ctx.JAAR()) {
      periodType = 'tijdsevenredig_deel_per_jaar';
    } else {
      throw new Error('Expected MAAND or JAAR in tijdsevenredig deel expression');
    }

    // Get the target expression after VAN
    const targetExpr = this.visit(ctx.expressie(0));

    // Check for optional temporal condition
    let conditionExpr: Expression | undefined;
    if (ctx.conditieBijExpressie && ctx.conditieBijExpressie()) {
      conditionExpr = this.visitConditieBijExpressie(ctx.conditieBijExpressie());
    }

    // Return as TimelineExpression
    const node = {
      type: 'TimelineExpression',
      operation: periodType,
      target: targetExpr,
      condition: conditionExpr
    } as any;
    this.setLocation(node, ctx);
    return node;
  }

  visitConditieBijExpressie(ctx: any): Expression {
    // GEDURENDE DE TIJD DAT expressie
    // The actual condition is the expression after DAT
    const exprCtx = ctx.expressie();
    if (!exprCtx) {
      throw new Error('Expected expression in conditieBijExpressie');
    }
    return this.visit(exprCtx);
  }

  visitTotaalVanExpr(ctx: any): Expression {
    // HET? TOTAAL VAN expressie [GEDURENDE DE TIJD DAT condition]
    const targetExpr = this.visit(ctx.expressie(0));

    // Check for optional temporal condition
    let conditionExpr: Expression | undefined;
    if (ctx.conditieBijExpressie && ctx.conditieBijExpressie()) {
      conditionExpr = this.visitConditieBijExpressie(ctx.conditieBijExpressie());
    }

    // Return as TimelineExpression for timeline-aware aggregation
    const node = {
      type: 'TimelineExpression',
      operation: 'totaal',
      target: targetExpr,
      condition: conditionExpr
    } as any;
    this.setLocation(node, ctx);
    return node;
  }

  visitCapitalizedTotaalVanExpr(ctx: any): Expression {
    // identifier+ HET_TOTAAL_VAN expressie [GEDURENDE DE TIJD DAT condition]
    // This handles cases where "Het totaal van" starts with capital H
    // The identifiers before HET_TOTAAL_VAN are just capitalized text that we ignore
    const targetExpr = this.visit(ctx.expressie(0));

    // Check for optional temporal condition
    let conditionExpr: Expression | undefined;
    if (ctx.conditieBijExpressie && ctx.conditieBijExpressie()) {
      conditionExpr = this.visitConditieBijExpressie(ctx.conditieBijExpressie());
    }

    // Return as TimelineExpression for timeline-aware aggregation
    const node = {
      type: 'TimelineExpression',
      operation: 'totaal',
      target: targetExpr,
      condition: conditionExpr
    } as any;
    this.setLocation(node, ctx);
    return node;
  }

  private generateDefaultPlural(singular: string): string[] {
    // Handle multi-word names
    const words = singular.split(' ');
    const lastWord = words[words.length - 1];
    let pluralLastWord: string;

    // Dutch pluralization rules
    // 1. Words ending in digits get 's' (e.g., Persoon1 -> Persoon1s)
    if (lastWord.match(/\d$/)) {
      pluralLastWord = lastWord + 's';
    }
    // 2. Words ending in 's' often change s→z (e.g., reis -> reizen)
    else if (lastWord.endsWith('eis') || lastWord.endsWith('uis') || lastWord.endsWith('oos')) {
      // Common Dutch words where s→z before adding 'en'
      pluralLastWord = lastWord.slice(0, -1) + 'zen';
    }
    // 3. Other 's' endings add 'en'
    else if (lastWord.endsWith('s') || lastWord.endsWith('x') || lastWord.endsWith('z')) {
      pluralLastWord = lastWord + 'en';
    }
    // 4. -heid → -heden
    else if (lastWord.endsWith('heid')) {
      pluralLastWord = lastWord.replace(/heid$/, 'heden');
    }
    // 5. -oon → -onen  
    else if (lastWord.endsWith('oon')) {
      pluralLastWord = lastWord.replace(/oon$/, 'onen');
    }
    // 6. Words ending in vowel get 's'
    else if (lastWord.match(/[aeiou]$/)) {
      pluralLastWord = lastWord + 's';
    }
    // 7. Default: add 'en'
    else {
      pluralLastWord = lastWord + 'en';
    }

    // Reconstruct multi-word plural
    words[words.length - 1] = pluralLastWord;
    return [words.join(' ')];
  }

}