"""RegelSpraak parse tree visitor that builds model objects."""
from typing import Dict, List, Any, Optional, Union
import logging

# Import enhanced models
from .model import (
    DomainModel, ObjectType, Attribuut, Kenmerk, Regel, Parameter, Domein,
    Voorwaarde, ResultaatDeel, Gelijkstelling, KenmerkToekenning,
    Expression, Literal, AttributeReference, VariableReference,
    BinaryExpression, UnaryExpression, FunctionCall, Operator
)
# Import ANTLR generated files
from .generated.RegelSpraakParser import RegelSpraakParser
# ADD explicit import for context classes used in type hints
# from .generated.RegelSpraakParser import (
#     # RegelSpraakParser, # Already imported above
#     DefinitieContext,
#     ObjectTypeDefinitionContext,
#     DomeinDefinitionContext,
#     AttribuutSpecificatieContext,
#     KenmerkSpecificatieContext,
#     NaamwoordContext,
#     RegelSpraakDocumentContext,
#     RegelContext,
#     ResultaatDeelContext,
#     AttribuutReferentieContext,
#     OnderwerpReferentieContext,
#     # BasisOnderwerpContext, # Not directly used in hints?
#     KenmerkNaamContext,
#     VoorwaardeDeelContext,
#     VariabeleDeelContext,
#     VariabeleToekenningContext,
#     ExpressieContext,
#     ComparisonExpressionContext,
#     AdditiveExpressionContext,
#     # MultiplicativeExpressionContext, # Not in grammar
#     # UnaryExpressionContext,        # Not in grammar
#     PrimaryExpressionContext,
#     # LiteralContext, # Not a rule in grammar
#     FunctionCallContext,
#     DatumLiteralContext, # Added for primary expression
#     # ArgumentListContext, # Used internally in visitFunctionCall
#     # EenheidSpecificatieContext, # Used internally in visitLiteral/visitFunctionCall
#     # Add any other specific contexts used in method signatures...
# )
from .generated.RegelSpraakVisitor import RegelSpraakVisitor

logger = logging.getLogger(__name__)

# Helper function to get text safely
def safe_get_text(ctx):
    return ctx.getText() if ctx else None

# Helper to map tokens to Operator enum
OPERATOR_MAP = {
    RegelSpraakParser.PLUS: Operator.PLUS,
    RegelSpraakParser.MIN: Operator.MIN,
    RegelSpraakParser.VERMINDERD_MET: Operator.MIN, # Assuming VERMINDERD_MET maps to MINUS
    RegelSpraakParser.MAAL: Operator.MAAL,           # Added MAAL
    RegelSpraakParser.GEDEELD_DOOR: Operator.GEDEELD_DOOR, # Added GEDEELD_DOOR
    RegelSpraakParser.GELIJK_AAN: Operator.GELIJK_AAN,
    RegelSpraakParser.ONGELIJK_AAN: Operator.NIET_GELIJK_AAN, # Assuming ONGELIJK_AAN maps to !=
    RegelSpraakParser.KLEINER_DAN: Operator.KLEINER_DAN,
    RegelSpraakParser.GROTER_DAN: Operator.GROTER_DAN,
    RegelSpraakParser.KLEINER_OF_GELIJK_AAN: Operator.KLEINER_OF_GELIJK_AAN,
    RegelSpraakParser.GROTER_OF_GELIJK_AAN: Operator.GROTER_OF_GELIJK_AAN,
    RegelSpraakParser.IS: Operator.IS,
    RegelSpraakParser.EN: Operator.EN,             # Added EN
    RegelSpraakParser.OF: Operator.OF,             # Added OF
    RegelSpraakParser.NIET: Operator.NIET,           # Added NIET (for unary)
    RegelSpraakParser.IN: Operator.IN              # Added IN
}

class RegelSpraakModelBuilder(RegelSpraakVisitor):
    """Visitor that builds model objects from a RegelSpraak parse tree."""

    def visitRegelSpraakDocument(self, ctx: RegelSpraakParser.RegelSpraakDocumentContext) -> DomainModel:
        """Visit the root document node and build the DomainModel."""
        domain_model = DomainModel()
        for child in ctx.children:
            if isinstance(child, RegelSpraakParser.DefinitieContext):
                definition = self.visit(child)
                if isinstance(definition, ObjectType):
                    domain_model.objecttypes[definition.naam] = definition
                elif isinstance(definition, Domein):
                    domain_model.domeinen[definition.naam] = definition
                else:
                     logger.warning(f"Unhandled definition type: {type(definition)}")
            elif isinstance(child, RegelSpraakParser.RegelContext):
                rule = self.visitRegel(child)
                if rule:
                    domain_model.regels.append(rule)
        return domain_model

    # --- Visit Definitions ---

    def visitDefinitie(self, ctx: RegelSpraakParser.DefinitieContext) -> Any:
        """Visit a definition node and delegate to specific definition visitors."""
        if ctx.objectTypeDefinition():
            return self.visitObjectTypeDefinition(ctx.objectTypeDefinition())
        elif ctx.domeinDefinition():
            return self.visitDomeinDefinition(ctx.domeinDefinition())
        else:
            # Log if the definition context contains something unexpected
            if ctx.getChildCount() > 0 and not isinstance(ctx.getChild(0), (ObjectTypeDefinitionContext, DomeinDefinitionContext)):
                 logger.warning(f"Unknown definition type encountered: {ctx.getText()}")
            # It might be an empty definition context or whitespace, which is fine.
            return None

    def visitNaamwoord(self, ctx: RegelSpraakParser.NaamwoordContext) -> str:
        """Extracts the core name string from a naamwoord context."""
        # Simplified: concatenates all identifiers. Needs refinement for complex cases.
        name_parts = [id_token.getText() for id_token in ctx.IDENTIFIER()]
        return " ".join(name_parts)
        # TODO: Handle voorzetsel parts if needed for disambiguation or structure

    def visitObjectTypeDefinition(self, ctx: RegelSpraakParser.ObjectTypeDefinitionContext) -> ObjectType:
        """Visit an object type definition and build an ObjectType object."""
        naam_ctx = ctx.naamwoord()
        naam = self.visitNaamwoord(naam_ctx)
        meervoud = " ".join([id_token.text for id_token in ctx.plural]) if ctx.plural else None
        bezield = bool(ctx.BEZIELD())

        obj_type = ObjectType(naam=naam, meervoud=meervoud, bezield=bezield)

        for member_ctx in ctx.objectTypeMember():
            if member_ctx.attribuutSpecificatie():
                attribuut = self.visitAttribuutSpecificatie(member_ctx.attribuutSpecificatie())
                if attribuut:
                    obj_type.attributen[attribuut.naam] = attribuut
            elif member_ctx.kenmerkSpecificatie():
                kenmerk = self.visitKenmerkSpecificatie(member_ctx.kenmerkSpecificatie())
                if kenmerk:
                    obj_type.kenmerken[kenmerk.naam] = kenmerk
        return obj_type

    def visitAttribuutSpecificatie(self, ctx: RegelSpraakParser.AttribuutSpecificatieContext) -> Optional[Attribuut]:
        """Visit an attribute specification and build an Attribuut object."""
        naam = self.visitNaamwoord(ctx.naamwoord())
        datatype_str = None
        if ctx.datatype():
            datatype_str = safe_get_text(ctx.datatype()) # Further parsing might be needed
        elif ctx.domeinRef():
             # Assumes domeinRef gives the name directly
            datatype_str = ctx.domeinRef().name.text # Use .text

        eenheid = None
        if ctx.MET_EENHEID():
            if ctx.unitName:
                eenheid = ctx.unitName.text
            elif ctx.PERCENT_SIGN():
                eenheid = "%"

        if not naam or not datatype_str:
             logger.error(f"Could not parse attribute: name='{naam}', datatype='{datatype_str}' in {safe_get_text(ctx)}")
             return None

        # TODO: Handle GEDIMENSIONEERD_MET if needed
        return Attribuut(naam=naam, datatype=datatype_str, eenheid=eenheid)

    def visitKenmerkSpecificatie(self, ctx: RegelSpraakParser.KenmerkSpecificatieContext) -> Optional[Kenmerk]:
        """Visit a kenmerk specification and build a Kenmerk object."""
        naam = None
        if ctx.identifier():
            naam = safe_get_text(ctx.identifier())
        elif ctx.naamwoord():
            naam = self.visitNaamwoord(ctx.naamwoord())

        if not naam:
             logger.error(f"Could not parse kenmerk name in {safe_get_text(ctx)}")
             return None

        # TODO: Potentially handle BIJVOEGLIJK / BEZITTELIJK if needed by the model
        return Kenmerk(naam=naam)

    def visitDomeinDefinition(self, ctx: RegelSpraakParser.DomeinDefinitionContext) -> Domein:
         """Visit a domain definition and build a Domein object."""
         naam = " ".join([id_token.getText() for id_token in ctx.name])
         basis_type = None
         eenheid = None
         enumeratie_waarden = None
         # constraints = [] # TODO: Parse constraints if grammar supports them

         if ctx.MET_EENHEID():
             if ctx.unitName:
                 eenheid = ctx.unitName.getText()
             elif ctx.PERCENT_SIGN():
                 eenheid = "%"

         if ctx.domeinType().numeriekDatatype():
             basis_type = "Numeriek" # TODO: Parse details like geheel, niet-negatief
         elif ctx.domeinType().tekstDatatype():
             basis_type = "Tekst"
         elif ctx.domeinType().booleanDatatype():
             basis_type = "Boolean"
         elif ctx.domeinType().datumTijdDatatype():
             basis_type = safe_get_text(ctx.domeinType().datumTijdDatatype()) # e.g., DATUM_IN_DAGEN
         elif ctx.domeinType().enumeratieSpecificatie():
             basis_type = "Enumeratie"
             enum_spec = ctx.domeinType().enumeratieSpecificatie()
             enumeratie_waarden = [safe_get_text(val) for val in enum_spec.ENUM_LITERAL()]

         return Domein(
             naam=naam,
             basis_type=basis_type,
             eenheid=eenheid,
             enumeratie_waarden=enumeratie_waarden,
             # constraints=constraints
         )

    # --- Visit Rule Components ---

    def visitRegel(self, ctx: RegelSpraakParser.RegelContext) -> Optional[Regel]:
        """Visit a rule definition and build a Regel object."""
        naam = " ".join([id_token.text for id_token in ctx.name])
        resultaat = self.visitResultaatDeel(ctx.resultaatDeel())
        voorwaarde = self.visitVoorwaardeDeel(ctx.voorwaardeDeel()) if ctx.voorwaardeDeel() else None
        variabelen = self.visitVariabeleDeel(ctx.variabeleDeel()) if ctx.variabeleDeel() else {}

        if not resultaat:
             logger.error(f"Could not parse resultaatDeel for rule '{naam}'. Skipping rule.")
             return None

        # TODO: Parse regelVersie if needed for filtering/execution logic
        # versie_info = self.visitRegelVersie(ctx.regelVersie())

        return Regel(
            naam=naam,
            resultaat=resultaat,
            voorwaarde=voorwaarde,
            variabelen=variabelen
        )

    def visitResultaatDeel(self, ctx: RegelSpraakParser.ResultaatDeelContext) -> Optional[ResultaatDeel]:
        """Visit a result part and build Gelijkstelling or KenmerkToekenning."""
        target_ref: Optional[AttributeReference] = None
        if ctx.attribuutReferentie():
            target_ref = self.visitAttribuutReferentie(ctx.attribuutReferentie())
        elif ctx.onderwerpReferentie():
            # If result is on onderwerp, create a reference pointing to 'self' or base object
            # This might need refinement based on how interpreter context works.
            path = self.visitOnderwerpReferentieToPath(ctx.onderwerpReferentie())
            target_ref = AttributeReference(path=path)

        if not target_ref:
            logger.error(f"Could not parse target reference in resultaatDeel: {safe_get_text(ctx)}")
            return None

        if ctx.WORDT_BEREKEND_ALS() or ctx.WORDT_GESTELD_OP():
            expressie = self.visitExpressie(ctx.expressie())
            if not expressie:
                 logger.error(f"Could not parse expression in gelijkstelling: {safe_get_text(ctx)}")
                 return None
            return Gelijkstelling(target=target_ref, expressie=expressie)

        elif ctx.IS() or ctx.HEEFT(): # Assuming HEEFT implies kenmerk assignment
            kenmerk_naam = self.visitKenmerkNaam(ctx.kenmerkNaam())
            if not kenmerk_naam:
                logger.error(f"Could not parse kenmerkNaam in kenmerkToekenning: {safe_get_text(ctx)}")
                return None
            # Check for negation (e.g., "is niet") - Grammar needs update if 'niet' is possible here
            is_negated = False
            return KenmerkToekenning(target=target_ref, kenmerk_naam=kenmerk_naam, is_negated=is_negated)
        else:
            logger.warning(f"Unknown resultaatDeel structure: {safe_get_text(ctx)}")
            return None

    def visitVoorwaardeDeel(self, ctx: RegelSpraakParser.VoorwaardeDeelContext) -> Optional[Voorwaarde]:
        """Visit a condition part and build a Voorwaarde object."""
        expressie = self.visitExpressie(ctx.expressie())
        if not expressie:
             logger.error(f"Could not parse expression in voorwaardeDeel: {safe_get_text(ctx)}")
             return None
        return Voorwaarde(expressie=expressie)

    def visitVariabeleDeel(self, ctx: RegelSpraakParser.VariabeleDeelContext) -> Dict[str, Expression]:
        """Visit a variable part and build a dictionary of variable assignments."""
        variables = {}
        for toekenning_ctx in ctx.variabeleToekenning():
            var_name = self.visitNaamwoord(toekenning_ctx.naamwoord())
            expression = self.visitExpressie(toekenning_ctx.expressie())
            if var_name and expression:
                variables[var_name] = expression
            else:
                logger.warning(f"Could not parse variable assignment in {safe_get_text(toekenning_ctx)}")
        return variables

    # --- Visit Expressions ---

    def visitExpressie(self, ctx: RegelSpraakParser.ExpressieContext) -> Optional[Expression]:
        """Visit a generic expression context and delegate based on structure."""
        # This needs to handle the precedence and structure defined in the grammar.
        # Example: Start with the lowest precedence (like logical OR) and work upwards.
        # This implementation assumes a simplified structure or relies on ANTLR's default visit order.
        # A more robust implementation would mirror the grammar's precedence rules.

        # Check for logical OR first (assuming it's lowest precedence shown here)
        if hasattr(ctx, 'OF') and ctx.OF():
            left = self.visitExpressie(ctx.expressie(0))
            right = self.visitExpressie(ctx.expressie(1))
            if left and right:
                return BinaryExpression(left=left, operator=Operator.OF, right=right)
            else:
                logger.error(f"Failed to parse operands for OF: {safe_get_text(ctx)}")
                return None

        # Check for logical AND
        if hasattr(ctx, 'EN') and ctx.EN():
            left = self.visitExpressie(ctx.expressie(0)) # Adjust index based on grammar
            right = self.visitExpressie(ctx.expressie(1)) # Adjust index based on grammar
            if left and right:
                return BinaryExpression(left=left, operator=Operator.EN, right=right)
            else:
                logger.error(f"Failed to parse operands for EN: {safe_get_text(ctx)}")
                return None

        # If not logical, delegate to comparison (or next level of precedence)
        if hasattr(ctx, 'comparisonExpression') and ctx.comparisonExpression():
             return self.visitComparisonExpression(ctx.comparisonExpression())

        # Fallback or handle other expression types defined directly under 'expressie'
        # This needs careful matching with the actual grammar structure.
        logger.warning(f"Unhandled expression structure: {safe_get_text(ctx)}. Trying children.")
        if ctx.getChildCount() == 1: # Simple delegation if only one child (like primary)
            # Check the type of the child before visiting
            child = ctx.getChild(0)
            if isinstance(child, RegelSpraakParser.ComparisonExpressionContext):
                 return self.visitComparisonExpression(child)
            else:
                 # If it's not comparison, it might be something else the grammar allows
                 # directly under expressie, or an error.
                 logger.warning(f"Unexpected child type under ExpressieContext: {type(child)}")
                 # Attempt to visit anyway, might lead to errors downstream
                 return self.visit(child)

        # Handle potential logical operators (EN/OF) if they were added to the expressie rule directly
        # Example (assuming grammar was: expressie: expressie (EN|OF) expressie | comparisonExpression)
        if ctx.getChildCount() == 3 and ctx.getChild(1).symbol.type in [RegelSpraakParser.EN, RegelSpraakParser.OF]:
            left = self.visitExpressie(ctx.expressie(0))
            right = self.visitExpressie(ctx.expressie(1))
            op_token = ctx.getChild(1).symbol
            operator = OPERATOR_MAP.get(op_token.type)
            if left and right and operator:
                return BinaryExpression(left=left, operator=operator, right=right)
            else:
                logger.error(f"Failed to parse logical expression: {safe_get_text(ctx)}")
                return None

        # Default fallback if structure doesn't match expected patterns
        logger.warning(f"Unhandled expression structure in visitExpressie: {safe_get_text(ctx)}")
        return None

    def visitComparisonExpression(self, ctx: RegelSpraakParser.ComparisonExpressionContext) -> Optional[Expression]:
        """Visit a comparison expression (==, !=, <, >, <=, >=, is)."""
        # Grammar: left=additiveExpression ( comparisonOperator right=additiveExpression )?
        left_expr = self.visitAdditiveExpression(ctx.additiveExpression(0))
        if not left_expr:
             logger.error(f"Could not parse left operand of comparison: {safe_get_text(ctx.additiveExpression(0))}")
             return None

        if ctx.comparisonOperator():
            right_expr = self.visitAdditiveExpression(ctx.additiveExpression(1))
            if not right_expr:
                 logger.error(f"Could not parse right operand of comparison: {safe_get_text(ctx.additiveExpression(1))}")
                 return None

            op_token_type = ctx.comparisonOperator().getChild(0).symbol.type
            operator = OPERATOR_MAP.get(op_token_type)

            if operator:
                return BinaryExpression(left=left_expr, operator=operator, right=right_expr)
            else:
                logger.error(f"Unknown comparison operator: {safe_get_text(ctx.comparisonOperator())}")
                return None
        else:
            # If no operator, it's just the left additive expression
            return left_expr

    def visitAdditiveExpression(self, ctx: RegelSpraakParser.AdditiveExpressionContext) -> Optional[Expression]:
        """Visit an additive expression (+, -). Handles left associativity."""
        # Grammar: left=primaryExpression ( additiveOperator right=primaryExpression )*

        # Start with the first primary expression
        current_expr = self.visitPrimaryExpression(ctx.primaryExpression(0))
        if not current_expr:
             logger.error(f"Could not parse initial primary expression in additiveExpr: {safe_get_text(ctx.primaryExpression(0))}")
             return None

        # Iterate through subsequent operator + primaryExpression pairs
        op_index = 0
        for i in range(1, len(ctx.primaryExpression())):
            primary_expr_ctx = ctx.primaryExpression(i)
            # Ensure additiveOperator exists at the expected index
            if op_index < len(ctx.additiveOperator()):
                operator_ctx = ctx.additiveOperator(op_index)
                op_index += 1
            else:
                # Should not happen if grammar is correct and lists are populated
                logger.error(f"Mismatch between primary expressions and operators in additiveExpr: {safe_get_text(ctx)}")
                return current_expr # Return what we have so far

            right_expr = self.visitPrimaryExpression(primary_expr_ctx)
            if not right_expr:
                 logger.error(f"Could not parse subsequent primary expression in additiveExpr: {safe_get_text(primary_expr_ctx)}")
                 return current_expr # Return what we have so far

            op_token_type = operator_ctx.getChild(0).symbol.type
            operator = OPERATOR_MAP.get(op_token_type)

            if operator:
                current_expr = BinaryExpression(left=current_expr, operator=operator, right=right_expr)
            else:
                logger.error(f"Unknown additive operator: {safe_get_text(operator_ctx)}")
                # Optionally continue parsing or return None/current_expr
                return current_expr # Return parsed part

        return current_expr

    # Removed visitMultiplicativeExpression as it's not in the grammar
    # def visitMultiplicativeExpression(self, ctx: RegelSpraakParser.MultiplicativeExpressionContext) -> Optional[Expression]:
    #     ...

    # Removed visitUnaryExpression as it's not explicitly in the grammar's expression hierarchy
    # def visitUnaryExpression(self, ctx: RegelSpraakParser.UnaryExpressionContext) -> Optional[Expression]:
    #    ...


    def visitPrimaryExpression(self, ctx: RegelSpraakParser.PrimaryExpressionContext) -> Optional[Expression]:
        """Visit a primary expression (literal, reference, function call, parens)."""
        # Grammar: primaryExpression
        # : ABSOLUTE_TIJDSDUUR_VAN ...
        # | TIJDSDUUR_VAN ...
        # | SOM_VAN ...
        # | NUMBER (PERCENT_SIGN | p=IDENTIFIER) VAN primaryExpression
        # | attribuutReferentie
        # | naamwoord
        # | REKENDATUM
        # | identifier
        # | NUMBER
        # | STRING_LITERAL
        # | WAAR | ONWAAR
        # | HIJ
        # | LPAREN expressie RPAREN

        if ctx.LPAREN() and ctx.RPAREN() and ctx.expressie(): # Parenthesized expression
            return self.visitExpressie(ctx.expressie())

        # Handle specific primary forms based on grammar
        elif ctx.attribuutReferentie():
            return self.visitAttribuutReferentie(ctx.attribuutReferentie())

        elif ctx.naamwoord(): # Could be Variable/Parameter or start of other construct
             # Need context or symbol table lookup here ideally
             # Simple approach: assume variable/parameter reference
             return VariableReference(variable_name=self.visitNaamwoord(ctx.naamwoord()))

        elif ctx.identifier(): # Variable/Parameter reference
             return VariableReference(variable_name=safe_get_text(ctx.identifier()))

        elif ctx.NUMBER():
            value = None
            try:
                # ANTLR might parse as string, convert cautiously
                num_text = safe_get_text(ctx.NUMBER()).replace(',', '.') # Handle comma decimal
                if '.' in num_text:
                    value = float(num_text)
                else:
                    value = int(num_text)
            except (ValueError, TypeError):
                 logger.error(f"Invalid number format: {safe_get_text(ctx.NUMBER())}")
                 return None
            # TODO: Check for unit (% or identifier) or % VAN construct
            return Literal(value=value, datatype="Numeriek")

        elif ctx.STRING_LITERAL():
            return Literal(value=safe_get_text(ctx.STRING_LITERAL()).strip("'"), datatype="Tekst")

        elif ctx.WAAR():
             return Literal(value=True, datatype="Boolean")
        elif ctx.ONWAAR():
             return Literal(value=False, datatype="Boolean")

        # Check for the datumLiteral rule context first
        elif ctx.datumLiteral():
            # Access the specific token within the datumLiteral context
            token_node = ctx.datumLiteral().DATE_TIME_LITERAL()
            if token_node:
                date_str = safe_get_text(token_node)
                return Literal(value=date_str, datatype="Datum")
            else:
                logger.error(f"Could not find DATE_TIME_LITERAL token within datumLiteral context: {safe_get_text(ctx.datumLiteral())}")
                return None

        elif ctx.HIJ(): # Pronoun reference to self/current context
             # Represent as a special reference, interpreter resolves
             return AttributeReference(path=["self"]) # Or VariableReference("self")?

        elif ctx.REKENDATUM():
            return VariableReference(variable_name="rekendatum") # Special context variable

        elif ctx.functionCall(): # Check if grammar was updated to use a 'functionCall' rule
            return self.visitFunctionCall(ctx.functionCall())

        # --- Handle functions defined directly in primaryExpression --- 
        elif ctx.TIJDSDUUR_VAN():
            # Grammar: TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?
            args = [self.visitPrimaryExpression(p_ctx) for p_ctx in ctx.primaryExpression()]
            args = [arg for arg in args if arg] # Filter out None results
            if len(args) != 2:
                logger.error(f"TIJDSDUUR_VAN expects 2 primaryExpression arguments, found {len(args)}")
                return None
            unit = safe_get_text(ctx.unitName) if ctx.unitName else None
            return FunctionCall(function_name="tijdsduur van", arguments=args, unit_conversion=unit)
        
        # Add similar elif blocks for ABSOLUTE_TIJDSDUUR_VAN, SOM_VAN, etc.
        # based on their structure in the primaryExpression rule

        else:
            logger.warning(f"Unknown primary expression type: {safe_get_text(ctx)}")
            return None

    def visitAttribuutReferentie(self, ctx: RegelSpraakParser.AttribuutReferentieContext) -> Optional[AttributeReference]:
        """Visit an attribute reference and build an AttributeReference object."""
        attribute_name = self.visitNaamwoord(ctx.naamwoord())
        # Recursively build the path from the nested onderwerpReferentie
        base_path = self.visitOnderwerpReferentieToPath(ctx.onderwerpReferentie())
        if not base_path:
             logger.error(f"Could not parse base path for attribute reference: {safe_get_text(ctx)}")
             return None
        # Prepend the attribute name to the path
        full_path = [attribute_name] + base_path
        return AttributeReference(path=full_path)

    def visitOnderwerpReferentieToPath(self, ctx: RegelSpraakParser.OnderwerpReferentieContext) -> List[str]:
        """Helper to convert onderwerpReferentie into a path list for AttributeReference."""
        path = []
        # Simplified: extracts text from basisOnderwerp parts. Needs refinement.
        current_ctx = ctx
        while current_ctx is not None:
            # Check if basisOnderwerp is a method returning a list or single item
            basis_onderwerpen = None
            if hasattr(current_ctx, 'basisOnderwerp'):
                potential_basis = current_ctx.basisOnderwerp()
                if isinstance(potential_basis, list):
                    basis_onderwerpen = potential_basis
                elif potential_basis is not None:
                    basis_onderwerpen = [potential_basis] # Wrap single item in list
            
            if basis_onderwerpen:
                for basis_ctx in basis_onderwerpen:
                     # Pass the individual context object
                     path_part = self.visitBasisOnderwerpToString(basis_ctx)
                     if path_part:
                         path.append(path_part)
            
            # Navigate deeper if possible (simplified navigation)
            if hasattr(current_ctx, 'onderwerpReferentie') and current_ctx.onderwerpReferentie():
                # This logic seems incorrect based on the grammar `onderwerpReferentie: basisOnderwerp ( voorzetsel basisOnderwerp )*`
                # There isn't a nested `onderwerpReferentie` within itself directly.
                # Let's remove this recursive descent attempt within the loop.
                # current_ctx = current_ctx.onderwerpReferentie()
                current_ctx = None # Stop after processing direct children
            else:
                 current_ctx = None # Stop if no further basisOnderwerp or nesting

        # Path should be built in order: basis ( voorzetsel basis )*
        # No reversal needed based on grammar structure if loop processes correctly.
        # return list(reversed(path))
        return path

    def visitBasisOnderwerpToString(self, ctx: RegelSpraakParser.BasisOnderwerpContext) -> str:
        """Extracts a string representation from basisOnderwerp."""
        # Handles pronoun (HIJ), identifier, or naamwoord
        if ctx.HIJ():
            return "self" # Represent pronoun as 'self' or similar context key
        elif ctx.IDENTIFIER():
            # Combine identifiers, ignore DE/HET/EEN/ZIJN for the path key
            return " ".join([id_token.getText() for id_token in ctx.IDENTIFIER()])
        return "<unknown_basis_onderwerp>"

    def visitKenmerkNaam(self, ctx: RegelSpraakParser.KenmerkNaamContext) -> str:
        """Extract the name string from a kenmerkNaam context."""
        # Can be identifier or naamwoord
        return safe_get_text(ctx)

    # --- Default Visit ---
    def visitChildren(self, node):
        """Override default visitChildren to potentially collect results differently if needed."""
        result = []
        n = node.getChildCount()
        for i in range(n):
            child_result = self.visit(node.getChild(i))
            if child_result is not None:
                # Decide how to aggregate results (list, dict, single value?)
                # Default behavior is often not useful for model building.
                # Specific visit methods handle aggregation.
                 if isinstance(child_result, list):
                     result.extend(child_result)
                 else:
                     result.append(child_result)
        # Usually, specific visit methods return the built model object directly,
        # making the aggregated result here less relevant unless needed for lists.
        # Return None or a specific aggregation if required by a parent rule.
        # For our purpose, returning the list might be okay for debugging,
        # but specific visitors should return the actual model objects.
        if len(result) == 1:
            return result[0]
        elif len(result) > 1:
            # This case might indicate an unhandled aggregation scenario
             logger.debug(f"visitChildren aggregated multiple results: {result}")
             return result
        return None # No significant children visited

    # Catch-all for unhandled nodes (optional)
    # def visitTerminal(self, node):
    #     pass 