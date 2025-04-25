"""RegelSpraak parser frontend: functions to parse text/files into an AST/IR."""
from pathlib import Path
from typing import Union, Dict, List, Any, Optional
import logging

from antlr4 import CommonTokenStream, FileStream, InputStream

# Import AST nodes (using DomainModel for now as in existing builder)
from .ast import DomainModel
# Import ANTLR generated files from the _antlr directory
from ._antlr.RegelSpraakLexer import RegelSpraakLexer
from ._antlr.RegelSpraakParser import RegelSpraakParser as AntlrParser
from ._antlr.RegelSpraakVisitor import RegelSpraakVisitor
from antlr4.Token import CommonToken
from antlr4.tree.Tree import TerminalNode
from antlr4.ParserRuleContext import ParserRuleContext # Import for type hint
# Import custom error type
from .errors import ParseError

# Import enhanced models (assuming these are now in ast.py or runtime.py)
# TODO: Verify these imports after ast.py and runtime.py are finalized
from .ast import (
    ObjectType, Attribuut, Kenmerk, Regel, Parameter, Domein,
    Voorwaarde, ResultaatDeel, Gelijkstelling, KenmerkToekenning,
    Expression, Literal, AttributeReference, VariableReference,
    BinaryExpression, UnaryExpression, FunctionCall, Operator,
    ParameterReference, SourceSpan # Added ParameterReference, SourceSpan
)

logger = logging.getLogger(__name__)

# --- Public Parsing API ---

def parse_file(file_path: Union[str, Path]) -> DomainModel:
    """Parse RegelSpraak code from a file.

    Args:
        file_path: Path to the file containing RegelSpraak code.

    Returns:
        DomainModel object representing the parsed content.

    Raises:
        ParseError: If parsing fails.
        FileNotFoundError: If the file does not exist.
    """
    try:
        # Ensure file_path is a string for FileStream
        input_stream = FileStream(str(file_path), encoding='utf-8')
        return _parse_stream(input_stream)
    except FileNotFoundError: # Re-raise specific error
        raise
    except Exception as e:
        # Catch potential ANTLR errors or builder errors
        raise ParseError(f"Failed to parse file {file_path}: {e}") from e

def parse_text(text: str) -> DomainModel:
    """Parse RegelSpraak code from a string.

    Args:
        text: String containing RegelSpraak code.

    Returns:
        DomainModel object representing the parsed content.

    Raises:
        ParseError: If parsing fails.
    """
    try:
        input_stream = InputStream(text)
        return _parse_stream(input_stream)
    except Exception as e:
        # Catch potential ANTLR errors or builder errors
        raise ParseError(f"Failed to parse text: {e}") from e

# --- Internal Parsing Logic ---

def _parse_stream(input_stream) -> DomainModel:
    """Core parsing function using ANTLR lexer, parser, and custom visitor."""
    lexer = RegelSpraakLexer(input_stream)
    token_stream = CommonTokenStream(lexer)
    parser = AntlrParser(token_stream)
    # TODO: Add error listener for more detailed errors
    # parser.removeErrorListeners() # Remove default console listener
    # error_listener = MyErrorListener() # Replace with your custom listener
    # parser.addErrorListener(error_listener)

    tree = parser.regelSpraakDocument() # Start parsing from the root rule

    # TODO: Check for syntax errors collected by the listener here
    # if error_listener.errors:
    #     raise ParseError(...)

    # Build the AST/IR using the visitor
    visitor = RegelSpraakModelBuilder()
    domain_model = visitor.visit(tree)

    # Ensure domain_model has top-level span
    if domain_model and not domain_model.span:
        domain_model.span = visitor.get_span(tree)

    if not isinstance(domain_model, DomainModel):
         # This might happen if the visitor returns None or something unexpected
         logger.error(f"Visitor did not return a DomainModel object, got: {type(domain_model)}")
         raise ParseError("Internal error: Failed to build the domain model from the parse tree.")

    return domain_model


# --- CST to AST/IR Builder Visitor ---
# (The RegelSpraakModelBuilder class originally from builder.py remains below)

# Helper function to get text safely
def safe_get_text(ctx):
    return ctx.getText() if ctx else None

# Helper to map tokens to Operator enum
OPERATOR_MAP = {
    # --- Arithmetic ---
    AntlrParser.PLUS: Operator.PLUS,
    AntlrParser.MIN: Operator.MIN,
    AntlrParser.VERMINDERD_MET: Operator.MIN, # Phrase mapping
    AntlrParser.MAAL: Operator.MAAL,
    AntlrParser.GEDEELD_DOOR: Operator.GEDEELD_DOOR,
    AntlrParser.TOT_DE_MACHT: Operator.MACHT,
    AntlrParser.CARET: Operator.MACHT,

    # --- Comparison (Base Forms) ---
    AntlrParser.GELIJK_AAN: Operator.GELIJK_AAN,
    AntlrParser.ONGELIJK_AAN: Operator.NIET_GELIJK_AAN,
    AntlrParser.KLEINER_DAN: Operator.KLEINER_DAN,
    AntlrParser.GROTER_DAN: Operator.GROTER_DAN,
    AntlrParser.KLEINER_OF_GELIJK_AAN: Operator.KLEINER_OF_GELIJK_AAN,
    AntlrParser.GROTER_OF_GELIJK_AAN: Operator.GROTER_OF_GELIJK_AAN,

    # --- Comparison (Singular Phrase Forms) ---
    # Note: IS_GELIJK_AAN == GELIJK_AAN, IS_ONGELIJK_AAN == ONGELIJK_AAN
    AntlrParser.IS_KLEINER_DAN: Operator.KLEINER_DAN,             # Exists
    AntlrParser.KLEINER_IS_DAN: Operator.KLEINER_DAN,             # Exists
    AntlrParser.IS_GROTER_DAN: Operator.GROTER_DAN,               # Exists
    # AntlrParser.GROTER_IS_DAN does not exist
    AntlrParser.IS_KLEINER_OF_GELIJK_AAN: Operator.KLEINER_OF_GELIJK_AAN, # Exists
    AntlrParser.IS_GROTER_OF_GELIJK_AAN: Operator.GROTER_OF_GELIJK_AAN, # Exists

    # --- Comparison (Plural Phrase Forms) ---
    AntlrParser.ZIJN_GELIJK_AAN: Operator.GELIJK_AAN,
    AntlrParser.ZIJN_ONGELIJK_AAN: Operator.NIET_GELIJK_AAN,
    AntlrParser.ZIJN_KLEINER_DAN: Operator.KLEINER_DAN,
    AntlrParser.ZIJN_KLEINER_OF_GELIJK_AAN: Operator.KLEINER_OF_GELIJK_AAN,
    AntlrParser.ZIJN_GROTER_DAN: Operator.GROTER_DAN,
    AntlrParser.ZIJN_GROTER_OF_GELIJK_AAN: Operator.GROTER_OF_GELIJK_AAN,

    # --- Date/Time Comparison Phrases (Singular) ---
    AntlrParser.IS_LATER_DAN: Operator.GROTER_DAN,
    AntlrParser.IS_LATER_OF_GELIJK_AAN: Operator.GROTER_OF_GELIJK_AAN,
    AntlrParser.IS_EERDER_DAN: Operator.KLEINER_DAN,
    AntlrParser.IS_EERDER_OF_GELIJK_AAN: Operator.KLEINER_OF_GELIJK_AAN,

    # --- Date/Time Comparison Phrases (Plural) ---
    AntlrParser.ZIJN_LATER_DAN: Operator.GROTER_DAN,
    AntlrParser.ZIJN_LATER_OF_GELIJK_AAN: Operator.GROTER_OF_GELIJK_AAN,
    AntlrParser.ZIJN_EERDER_DAN: Operator.KLEINER_DAN,
    AntlrParser.ZIJN_EERDER_OF_GELIJK_AAN: Operator.KLEINER_OF_GELIJK_AAN,

    # --- Identity/Type Checks ---
    AntlrParser.IS: Operator.IS,
    AntlrParser.ZIJN: Operator.IS, # Map ZIJN also to IS?

    # --- Logical Operators ---
    AntlrParser.EN: Operator.EN,
    AntlrParser.OF: Operator.OF,
    AntlrParser.NIET: Operator.NIET, # Unary

    # --- Set/Membership Operators ---
    AntlrParser.IN: Operator.IN,
    # Add NIET_IN if defined in grammar
}

# Helper map for phrasal operators identified by their context node text
OPERATOR_TEXT_MAP = {
    # --- Comparison Phrases --- 
    "is gelijk aan": Operator.GELIJK_AAN,
    "zijn gelijk aan": Operator.GELIJK_AAN,
    "is ongelijk aan": Operator.NIET_GELIJK_AAN,
    "zijn ongelijk aan": Operator.NIET_GELIJK_AAN,
    "kleiner is dan": Operator.KLEINER_DAN,
    "is kleiner dan": Operator.KLEINER_DAN,
    "zijn kleiner dan": Operator.KLEINER_DAN,
    "groter is dan": Operator.GROTER_DAN, # Assuming this might exist
    "is groter dan": Operator.GROTER_DAN,
    "zijn groter dan": Operator.GROTER_DAN,
    "is kleiner of gelijk aan": Operator.KLEINER_OF_GELIJK_AAN,
    "zijn kleiner of gelijk aan": Operator.KLEINER_OF_GELIJK_AAN,
    "is groter of gelijk aan": Operator.GROTER_OF_GELIJK_AAN,
    "zijn groter of gelijk aan": Operator.GROTER_OF_GELIJK_AAN,

    # --- Date/Time Comparison Phrases --- 
    "is later dan": Operator.GROTER_DAN,
    "zijn later dan": Operator.GROTER_DAN,
    "is later of gelijk aan": Operator.GROTER_OF_GELIJK_AAN,
    "zijn later of gelijk aan": Operator.GROTER_OF_GELIJK_AAN,
    "is eerder dan": Operator.KLEINER_DAN,
    "zijn eerder dan": Operator.KLEINER_DAN,
    "is eerder of gelijk aan": Operator.KLEINER_OF_GELIJK_AAN,
    "zijn eerder of gelijk aan": Operator.KLEINER_OF_GELIJK_AAN,

    # --- Other Phrases (Add as needed) ---
    "verminderd met": Operator.MIN,
    "gedeeld door": Operator.GEDEELD_DOOR,
    "tot de macht": Operator.MACHT,
}

# Helper to get SourceSpan from ANTLR context
def get_span_from_ctx(ctx: Optional[ParserRuleContext]) -> SourceSpan:
    if not ctx or not hasattr(ctx, 'start') or not hasattr(ctx, 'stop') or not ctx.start or not ctx.stop:
        return SourceSpan.unknown()
    start_token = ctx.start
    stop_token = ctx.stop
    # Adjust stop column for multi-character tokens
    stop_col = stop_token.column + len(stop_token.text)
    return SourceSpan(
        start_line=start_token.line,
        start_col=start_token.column,
        end_line=stop_token.line,
        end_col=stop_col
    )

class RegelSpraakModelBuilder(RegelSpraakVisitor):
    """Visitor that builds model objects from a RegelSpraak parse tree."""

    def __init__(self):
        """Initialize the model builder with tracking for parameter names."""
        super().__init__()
        # Set to track parameter names for differentiating ParameterReference from VariableReference
        self.parameter_names = set()

    # Helper method to get span from context
    def get_span(self, ctx) -> SourceSpan:
        # This now always returns a valid SourceSpan (real or unknown)
        return get_span_from_ctx(ctx)

    def visitRegelSpraakDocument(self, ctx: AntlrParser.RegelSpraakDocumentContext) -> DomainModel:
        """Visit the root document node and build the DomainModel."""
        domain_model = DomainModel(span=self.get_span(ctx))
        # Reset parameter names for new document
        self.parameter_names = set()
        
        for child in ctx.children:
            if isinstance(child, AntlrParser.DefinitieContext):
                definition = self.visit(child)
                if isinstance(definition, ObjectType):
                    domain_model.objecttypes[definition.naam] = definition
                elif isinstance(definition, Domein):
                    domain_model.domeinen[definition.naam] = definition
                elif isinstance(definition, Parameter):
                    domain_model.parameters[definition.naam] = definition
                    # Add parameter name to our tracking set
                    self.parameter_names.add(definition.naam)
                elif definition is not None:
                     logger.warning(f"Unhandled definition type: {type(definition)} from {safe_get_text(child)}")
            elif isinstance(child, AntlrParser.RegelContext):
                rule = self.visitRegel(child)
                if rule:
                    domain_model.regels.append(rule)
        return domain_model

    # --- Visit Definitions ---

    def visitDefinitie(self, ctx: AntlrParser.DefinitieContext) -> Any:
        """Visit a definition node and delegate to specific definition visitors."""
        if ctx.objectTypeDefinition():
            return self.visitObjectTypeDefinition(ctx.objectTypeDefinition())
        elif ctx.domeinDefinition():
            return self.visitDomeinDefinition(ctx.domeinDefinition())
        elif ctx.parameterDefinition(): # Added Parameter Definition
            return self.visitParameterDefinition(ctx.parameterDefinition())
        else:
            # Log if the definition context contains something unexpected
            # Use safe_get_text helper function
            child_text = safe_get_text(ctx.getChild(0)) if ctx.getChildCount() > 0 else "empty"
            if ctx.getChildCount() > 0 and not isinstance(ctx.getChild(0), (AntlrParser.ObjectTypeDefinitionContext, AntlrParser.DomeinDefinitionContext, AntlrParser.ParameterDefinitionContext, TerminalNode)):
                 logger.warning(f"Unknown definition type encountered: {child_text}")
            # It might be an empty definition context or whitespace (TerminalNode), which is fine.
            return None

    def visitNaamwoord(self, ctx: AntlrParser.NaamwoordContext) -> Optional[str]:
        """Visit a naamwoord context and extract the core noun, handling lists and terminal nodes."""
        logger.debug(f"    Visiting Naamwoord: Text='{safe_get_text(ctx)}', Type={type(ctx).__name__}, ChildCount={ctx.getChildCount()}")
        core_noun_parts = []

        # --- Logic to find the core noun based on grammar ---
        # Option 1: Check for a direct identifier child? (Less likely now)
        # ... (keep existing logic if needed, but Option 2 seems primary) ...

        # Option 2: Check for a naamPhrase child?
        if hasattr(ctx, 'naamPhrase'):
            potential_naam_phrase = ctx.naamPhrase()
            if potential_naam_phrase: # Ensure it's not None or empty list
                naam_phrase_ctx = None
                # Handle list possibility
                if isinstance(potential_naam_phrase, list):
                    if len(potential_naam_phrase) > 0:
                         naam_phrase_ctx = potential_naam_phrase[0] # Use the first phrase
                         # ... (warning log for multiple phrases) ...
                    # ... (warning log for empty list) ...
                else:
                     naam_phrase_ctx = potential_naam_phrase # Assume single context

                if naam_phrase_ctx: # Proceed only if we have a context to process
                    logger.debug(f"      Processing naamPhrase child: Text='{safe_get_text(naam_phrase_ctx)}', Type={type(naam_phrase_ctx).__name__}, ChildCount={naam_phrase_ctx.getChildCount()}")
                    # --- Iterate children (TerminalNodes) of naamPhrase ---
                    for child in naam_phrase_ctx.children:
                         if isinstance(child, TerminalNode):
                              token_type = child.getSymbol().type
                              token_text = safe_get_text(child)
                              logger.debug(f"        naamPhrase Child: Type=TerminalNode, Text='{token_text}', TokenType={token_type}, SymName='{AntlrParser.symbolicNames[token_type] if token_type >= 0 else 'N/A'}'")
                              # --- Filter out articles (adjust types as needed) ---
                              if token_type not in [AntlrParser.DE, AntlrParser.HET, AntlrParser.EEN]: # Add other non-noun tokens if necessary
                                  core_noun_parts.append(token_text)
                                  logger.debug(f"          Appending token text: '{token_text}'")
                              else:
                                   logger.debug(f"          Ignoring article/non-noun token: '{token_text}'")
                         else:
                              logger.warning(f"        Unexpected non-TerminalNode child in naamPhrase: Type={type(child).__name__}")
                # ... (else block for no valid context) ...
            # ... (else block for call returning None/empty) ...

        # Option 3: Fallback if ctx is just an identifier?
        # ... (keep existing logic) ...

        # --- Combine parts or use fallback ---
        final_core_noun = None
        if core_noun_parts:
            final_core_noun = " ".join(core_noun_parts) # Join parts with space
        elif not core_noun_parts: # Check if Option 3 might have found something (if it exists)
             # ... (check if Option 1 or 3 yielded a result) ...
             # if core_noun_from_option1_or_3: final_core_noun = ...
            pass # For now, stick to naamPhrase logic result

        # Fallback if still no noun found
        if final_core_noun is None:
            logger.warning(f"      Could not determine specific noun structure in visitNaamwoord for '{safe_get_text(ctx)}'. Falling back to full text.")
            final_core_noun = safe_get_text(ctx) # Keep existing behavior as fallback

        logger.debug(f"    visitNaamwoord returning: '{final_core_noun}'")
        return final_core_noun

    def visitObjectTypeDefinition(self, ctx: AntlrParser.ObjectTypeDefinitionContext) -> ObjectType:
        """Visit an object type definition and build an ObjectType object."""
        naam_ctx = ctx.naamwoord()
        naam = self._extract_canonical_name(naam_ctx)
        if not naam: # Add error handling if name extraction fails
                logger.error(f"Could not extract canonical name for ObjectType in {safe_get_text(ctx)}")
                # Decide how to handle: return None, raise error, or default name?
                # For now, let's maybe allow creation with a placeholder if needed downstream
                naam = "<error_extracting_object_name>" # Or return None?
        meervoud = " ".join([id_token.text for id_token in ctx.plural]) if ctx.plural else None
        bezield = bool(ctx.BEZIELD())

        obj_type = ObjectType(naam=naam, meervoud=meervoud, bezield=bezield, span=self.get_span(ctx))

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

    def visitAttribuutSpecificatie(self, ctx: AntlrParser.AttribuutSpecificatieContext) -> Optional[Attribuut]:
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
        return Attribuut(naam=naam, datatype=datatype_str, eenheid=eenheid, span=self.get_span(ctx))

    def visitKenmerkSpecificatie(self, ctx: AntlrParser.KenmerkSpecificatieContext) -> Optional[Kenmerk]:
        """Visit a kenmerk specification and build a Kenmerk object."""
        naam = None
        if ctx.identifier():
            # Use helper which handles IdentifierContext directly
            naam = self._extract_canonical_name(ctx.identifier())
        elif ctx.naamwoord():
            naam = self._extract_canonical_name(ctx.naamwoord())
        if not naam:
             logger.error(f"Could not parse kenmerk name in {safe_get_text(ctx)}")
             return None

        # TODO: Potentially handle BIJVOEGLIJK / BEZITTELIJK if needed by the model
        return Kenmerk(naam=naam, span=self.get_span(ctx))

    def visitDomeinDefinition(self, ctx: AntlrParser.DomeinDefinitionContext) -> Domein:
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
             # constraints=constraints,
             span=self.get_span(ctx)
         )

    # --- Visit Parameter Definition (New) ---
    def visitParameterDefinition(self, ctx: AntlrParser.ParameterDefinitionContext) -> Optional[Parameter]:
        """Visit a parameter definition and build a Parameter object."""
        # Access the name via parameterNamePhrase rule
        name_phrase_ctx = ctx.parameterNamePhrase()
        if not name_phrase_ctx:
            logger.error(f"Could not find parameterNamePhrase in {safe_get_text(ctx)}")
            return None
        naam = self._extract_canonical_name(name_phrase_ctx)
        datatype_str = None
        if ctx.datatype():
            datatype_str = safe_get_text(ctx.datatype()) # Needs detail parsing
        elif ctx.domeinRef():
            datatype_str = safe_get_text(ctx.domeinRef().name) if ctx.domeinRef().name else None

        eenheid = None
        if ctx.MET_EENHEID():
            # Assuming eenheidExpressie gives text directly or needs visitor
            if ctx.eenheidExpressie():
                 eenheid = safe_get_text(ctx.eenheidExpressie()) # Simple text, might need visitEenheidExpressie
            # Handle old grammar elements if still present
            elif hasattr(ctx, 'unitName') and ctx.unitName:
                eenheid = ctx.unitName.text
            elif hasattr(ctx, 'PERCENT_SIGN') and ctx.PERCENT_SIGN():
                eenheid = "%"

        if not naam or not datatype_str:
             logger.error(f"Could not parse parameter: name='{naam}', datatype='{datatype_str}' in {safe_get_text(ctx)}")
             return None

        # Add parameter name to our tracking set
        if naam:
            self.parameter_names.add(naam)
            logger.debug(f"Added parameter name to tracking: '{naam}'")

        # TODO: Parse literal value if present (e.g., Parameter x : Numeriek is 5)

        return Parameter(
            naam=naam,
            datatype=datatype_str,
            eenheid=eenheid,
            span=self.get_span(ctx)
        )

    # --- Visit Rule Components ---

    def visitRegel(self, ctx: AntlrParser.RegelContext) -> Optional[Regel]:
        """Visit a rule definition and build a Regel object."""
        # Get name from regelName context
        name_ctx = ctx.regelName()
        if not name_ctx:
            logger.error(f"Could not find regelName in {safe_get_text(ctx)}")
            # Try getting text from older name structure if necessary
            # name_legacy = safe_get_text(ctx.getChild(1)) # Assuming name is second child after REGEL token
            # naam = name_legacy or "<unknown_rule>"
            naam = "<unknown_rule>" # Default if no name context found
        else:
            naam = self._extract_canonical_name(name_ctx)
            if not naam: # Add error handling if name extraction fails
                 logger.error(f"Could not extract canonical name for Regel in {safe_get_text(ctx)}")
                 naam = "<error_extracting_rule_name>"

        resultaat = self.visitResultaatDeel(ctx.resultaatDeel())
        voorwaarde = self.visitVoorwaardeDeel(ctx.voorwaardeDeel()) if ctx.voorwaardeDeel() else None
        variabelen = self.visitVariabeleDeel(ctx.variabeleDeel()) if ctx.variabeleDeel() else {}

        if not resultaat:
             logger.error(f"Could not parse resultaatDeel for rule '{naam}'. Skipping rule.")
             return None

        # TODO: Parse version/validity info from ctx.regelVersie()

        return Regel(
            naam=naam,
            resultaat=resultaat,
            voorwaarde=voorwaarde,
            variabelen=variabelen,
            span=self.get_span(ctx)
        )

    def visitResultaatDeel(self, ctx: AntlrParser.ResultaatDeelContext) -> Optional[ResultaatDeel]:
        """Visit a result part (gelijkstelling, kenmerk toekenning, etc.)."""
        # Determine the type of result based on the matched alternative
        if isinstance(ctx, AntlrParser.GelijkstellingResultaatContext):
            # Handle GelijkstellingResultaat (wordt berekend als / gesteld op)
            target_ref = None
            if ctx.naamwoord():
                # Handle cases where target is a simple naamwoord (e.g., variable?)
                # This might need refinement depending on semantic context
                target_name = self.visitNaamwoord(ctx.naamwoord())
                target_ref = AttributeReference(path=[target_name], span=self.get_span(ctx.naamwoord()))
            elif ctx.attribuutReferentie():
                target_ref = self.visitAttribuutReferentie(ctx.attribuutReferentie())

            expr = self.visitExpressie(ctx.expressie())
            if not target_ref or not expr:
                logger.error(f"Failed to parse gelijkstelling target or expression in {safe_get_text(ctx)}")
                return None
            return Gelijkstelling(
                target=target_ref,
                expressie=expr,
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.KenmerkFeitResultaatContext):
            # Handle KenmerkFeitResultaat (onderwerp IS/HEEFT kenmerk)
            # Convert onderwerpReferentie to path, then to AttributeReference
            onderwerp_path = self.visitOnderwerpReferentieToPath(ctx.onderwerpReferentie())
            if not onderwerp_path:
                 logger.error(f"Failed to parse onderwerpReferentie path in {safe_get_text(ctx)}")
                 return None
            target_ref = AttributeReference(path=onderwerp_path, span=self.get_span(ctx.onderwerpReferentie()))
            
            kenmerk_naam = self.visitKenmerkNaam(ctx.kenmerkNaam())
            # Negation is typically handled in the condition (e.g., IS NIET), not directly here.
            # The KenmerkToekenning AST node has is_negated, but we set it based on condition usually.
            is_negated = False # Default for simple IS/HEEFT

            if not target_ref or not kenmerk_naam:
                logger.error(f"Failed to parse kenmerk toekenning target or name in {safe_get_text(ctx)}")
                return None
            return KenmerkToekenning(
                target=target_ref,
                kenmerk_naam=kenmerk_naam,
                is_negated=is_negated,
                span=self.get_span(ctx)
            )
        # Add elif blocks for FeitCreatieResultaatContext, etc. as needed
        # elif isinstance(ctx, AntlrParser.FeitCreatieResultaatContext):
        #     ...
        else:
            logger.warning(f"Unknown or unhandled resultaat deel type: {type(ctx).__name__} in {safe_get_text(ctx)}")
            return None

    def visitVoorwaardeDeel(self, ctx: AntlrParser.VoorwaardeDeelContext) -> Optional[Voorwaarde]:
        """Visit a condition part and build a Voorwaarde object."""
        expressie = self.visitExpressie(ctx.expressie())
        if not expressie:
             logger.error(f"Could not parse expression in voorwaardeDeel: {safe_get_text(ctx)}")
             return None
        return Voorwaarde(expressie=expressie, span=self.get_span(ctx))

    def visitVariabeleDeel(self, ctx: AntlrParser.VariabeleDeelContext) -> Dict[str, Expression]:
        """Visit a variable part and build a dictionary of variable assignments."""
        variables = {}
        for toekenning_ctx in ctx.variabeleToekenning():
            var_name = self._extract_canonical_name(toekenning_ctx.naamwoord())
            expression = self.visitExpressie(toekenning_ctx.expressie())
            if var_name and expression:
                variables[var_name] = expression
            else:
                logger.warning(f"Could not parse variable assignment in {safe_get_text(toekenning_ctx)}")
        return variables

    # --- Visit Expressions ---

    def visitExpressie(self, ctx: AntlrParser.ExpressieContext) -> Optional[Expression]:
        """Visit the top-level expressie rule. Always delegates to its single child."""
        # According to typical ANTLR grammar structure for expressions,
        # the 'expressie' rule usually just points to the start of the
        # precedence climbing (e.g., logicalExpression).
        if ctx.getChildCount() == 1:
             child = ctx.getChild(0)
             logger.debug(f"Visiting child of ExpressieContext: {type(child).__name__}")
             return self.visit(child)
        else:
             # This case should generally not happen if the grammar is well-formed.
             logger.error(f"ExpressieContext has unexpected child count: {ctx.getChildCount()} in {safe_get_text(ctx)}")
             # Attempt to visit first child as a desperate fallback
             if ctx.getChildCount() > 0:
                 return self.visit(ctx.getChild(0))
             return None

    def visitAttribuutReferentie(self, ctx: AntlrParser.AttribuutReferentieContext) -> Optional[AttributeReference]:
        """Visit an attribute reference and build an AttributeReference object."""
        attribute_name = self.visitNaamwoord(ctx.naamwoord())
        # Recursively build the path from the nested onderwerpReferentie
        base_path = self.visitOnderwerpReferentieToPath(ctx.onderwerpReferentie())
        if not base_path:
             logger.error(f"Could not parse base path for attribute reference: {safe_get_text(ctx)}")
             return None
        # Prepend the attribute name to the path
        full_path = [attribute_name] + base_path
        return AttributeReference(path=full_path, span=self.get_span(ctx))

    def visitOnderwerpReferentieToPath(self, ctx: AntlrParser.OnderwerpReferentieContext) -> List[str]:
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

    def visitBasisOnderwerpToString(self, ctx: AntlrParser.BasisOnderwerpContext) -> str:
        """Extracts a string representation from basisOnderwerp."""
        # Handles pronoun (HIJ), identifier, or naamwoord
        if ctx.HIJ():
            return "self" # Represent pronoun as 'self' or similar context key
        elif ctx.IDENTIFIER():
            # Combine identifiers, ignore DE/HET/EEN/ZIJN for the path key
            return " ".join([id_token.getText() for id_token in ctx.IDENTIFIER()])
        return "<unknown_basis_onderwerp>"

    def visitKenmerkNaam(self, ctx: AntlrParser.KenmerkNaamContext) -> str:
        """Extract the name string from a kenmerkNaam context."""
        # Can be identifier or naamwoord
        return safe_get_text(ctx)

    def visitBezieldeReferentie(self, ctx: AntlrParser.BezieldeReferentieContext) -> Optional[AttributeReference]:
        """Visit bezielde referentie (e.g., 'zijn leeftijd') and create an AttributeReference,
           explicitly checking the pronoun."""
        logger.debug(f"  Visiting BezieldeReferentie: Text='{safe_get_text(ctx)}'")

        pronoun_text = None
        attribute_name = None
        base_name = None # Determine based on pronoun

        # Iterate children to find pronoun and identifier/naamwoord
        for child in ctx.children:
            if isinstance(child, TerminalNode):
                # Assuming the first TerminalNode is the pronoun (like ZIJN, HAAR)
                # We might need a more robust check based on token type if grammar allows other terminals
                token_type = child.getSymbol().type
                # Check if it's a known possessive pronoun type (add others as needed)
                if token_type == AntlrParser.ZIJN: # Or check HAAR, MIJN etc.
                    pronoun_text = safe_get_text(child)
                    # --- Determine base based on pronoun ---
                    # For 'zijn', 'haar' etc., 'self' is often the intended base context.
                    # This mapping could be more complex if needed.
                    if pronoun_text in ["zijn", "haar"]: # Add other relevant pronouns
                        base_name = "self"
                    else:
                        # Handle other pronouns or default case if necessary
                        logger.warning(f"Unhandled pronoun '{pronoun_text}' in BezieldeReferentie. Defaulting base to 'self'.")
                        base_name = "self" # Or potentially raise error / return None

            elif isinstance(child, AntlrParser.IdentifierContext):
                attribute_name = safe_get_text(child)
            elif isinstance(child, AntlrParser.NaamwoordContext):
                 attribute_name = self.visitNaamwoord(child) # Assuming visitNaamwoord exists and returns str

        # Ensure both parts were found
        if base_name and attribute_name:
            full_path = [base_name, attribute_name]
            result = AttributeReference(path=full_path, span=self.get_span(ctx))
            logger.debug(f"    BezieldeReferentie (Pronoun: '{pronoun_text}') returning: {result} (Path: {full_path})")
            return result
        else:
            logger.error(f"Could not extract pronoun/base ('{pronoun_text}') or attribute ('{attribute_name}') from BezieldeReferentieContext: {safe_get_text(ctx)}")
            logger.debug(f"    BezieldeReferentie returning: None")
            return None

    # --- Expression Visitors ---

    def _build_binary_expression(self, ctx, operator_map, sub_visitor_func, operator_rule_name: Optional[str] = None) -> Optional[Expression]:
        """Generic helper to build BinaryExpression nodes for left-associative rules.

        Handles rules of the form: left=sub_rule (op right=sub_rule)*

        Args:
            ctx: The ANTLR context object for the expression (e.g., AdditiveExpressionContext).
            operator_map: The dictionary mapping ANTLR token types to Operator enums.
            sub_visitor_func: The visitor method to call for the sub-expressions (left/right operands).
                                Example: self.visitMultiplicativeExpression
            operator_rule_name: Optional name of the specific operator rule context (e.g., 'comparisonOperator')
                                to help identify the operator node accurately.
        """
        # Base case: context has only one child, which is the sub-expression itself
        if ctx.getChildCount() == 1 and isinstance(ctx.getChild(0), ParserRuleContext):
            return sub_visitor_func(ctx.getChild(0))
        elif ctx.getChildCount() < 3:
            # Not a binary expression structure (e.g., primary expression passed down)
            # Might happen if a higher precedence rule only has one child.
            # Attempt to visit the first child using the sub-visitor.
            if ctx.getChildCount() > 0 and isinstance(ctx.getChild(0), ParserRuleContext):
                return sub_visitor_func(ctx.getChild(0))
            else:
                 logger.warning(f"_build_binary_expression called on unexpected context with < 3 children: {safe_get_text(ctx)}")
                 return None # Or attempt self.visit(ctx.getChild(0))?

        # Process the chain of binary operations: operand operator operand operator operand ...
        left = sub_visitor_func(ctx.getChild(0))
        op_idx = 1       # Operator nodes are at indices 1, 3, 5, ...
        operand_idx = 2  # Right operand nodes are at indices 2, 4, 6, ...

        while op_idx < ctx.getChildCount():
            op_node = ctx.getChild(op_idx)
            if operand_idx >= ctx.getChildCount():
                logger.error(f"Missing right operand for operator {safe_get_text(op_node)} in {safe_get_text(ctx)}")
                return left # Return parsed part
            right_node = ctx.getChild(operand_idx)

            # --- Operator Identification ---
            operator = None
            op_type = -1
            op_text = safe_get_text(op_node)
            op_sym_name = 'N/A' # Default symbolic name

            # Strategy 1: Handle specific operator rule contexts if name provided
            if operator_rule_name:
                 expected_op_class = getattr(AntlrParser, operator_rule_name[0].upper() + f"{operator_rule_name}Context"[1:], None)
                 logger.debug(f"Checking op_node type: {type(op_node).__name__}, Text: '{op_text}', Expected class: {expected_op_class.__name__ if expected_op_class else 'None'}") # Enhanced log
                 if expected_op_class and isinstance(op_node, expected_op_class):
                     # --- NEW: Use text-based lookup for specific operator contexts --- 
                     logger.debug(f"Operator node '{op_text}' matches expected type {expected_op_class.__name__}. Attempting text-based lookup in OPERATOR_TEXT_MAP.")
                     operator = OPERATOR_TEXT_MAP.get(op_text) # Use the full text
                     if operator:
                         op_type = -2 # Indicate found via text map (no single token type)
                         op_sym_name = f"TEXT_MAP:{op_text}"
                         logger.debug(f"  Found operator '{operator}' via text lookup for '{op_text}'. Setting op_type={op_type}, op_sym_name='{op_sym_name}'")
                     else:
                         # If text not found, log warning and child details for debugging
                         logger.warning(f"Operator node '{op_text}' ({type(op_node).__name__}) text not found in OPERATOR_TEXT_MAP. Operator remains None.")
                         logger.warning(f"  Logging children of '{op_text}':")
                         for i in range(op_node.getChildCount()):
                             child = op_node.getChild(i)
                             child_text = safe_get_text(child)
                             child_type_name = type(child).__name__
                             child_symbol_type = -1
                             child_symbol_name = 'N/A'
                             if isinstance(child, TerminalNode):
                                 child_symbol_type = child.getSymbol().type
                                 child_symbol_name = AntlrParser.symbolicNames[child_symbol_type] if child_symbol_type >= 0 and child_symbol_type < len(AntlrParser.symbolicNames) else 'INVALID'
                             logger.warning(f"    Child {i}: Type={child_type_name}, Text='{child_text}', SymbolType={child_symbol_type}, SymbolName='{child_symbol_name}'")
                     # --- END NEW LOGIC ---
                 else:
                      logger.debug(f"Operator node '{op_text}' ({type(op_node).__name__}) did NOT match expected type {expected_op_class.__name__ if expected_op_class else 'None'}.") # Added log

            # Strategy 2: Handle simple terminal operators if operator is still None after Strategy 1
            if operator is None and isinstance(op_node, TerminalNode):
                 op_type = op_node.getSymbol().type
                 op_sym_name = AntlrParser.symbolicNames[op_type] if op_type >= 0 and op_type < len(AntlrParser.symbolicNames) else 'INVALID'
                 logger.debug(f"Attempting lookup for TerminalNode operator.")
                 logger.debug(f"  op_node text: '{safe_get_text(op_node)}'")
                 logger.debug(f"  op_type: {op_type}")
                 logger.debug(f"  op_sym_name: {op_sym_name}")
                 logger.debug(f"  Key {op_type} in OPERATOR_MAP? {op_type in operator_map}")
                 operator = operator_map.get(op_type)
                 logger.debug(f"  Lookup result (operator): {operator}")

            # If operator is still None after targeted checks, then it's unknown
            if operator is None:
                logger.error(f"Unknown binary operator after targeted checks: '{op_text}' (Type: {op_type}, SymName: {op_sym_name}) Node: {type(op_node).__name__} in {safe_get_text(ctx)}")
                return left # Or raise error
            # --- End Operator Identification ---

            right = sub_visitor_func(right_node)
            if left is None or right is None:
                 logger.error(f"Failed to parse operand for operator {operator.name} in {safe_get_text(ctx)}")
                 return left # Return parsed part

            # Combine spans of operands and operator
            combined_span = self.get_span(ctx) # Approximate with full context span for now
            # More precise span calculation:
            # start_span = left.span if left and left.span else SourceSpan.unknown()
            # end_span = right.span if right and right.span else SourceSpan.unknown()
            # combined_span = SourceSpan(start_span.start_line, start_span.start_col, end_span.end_line, end_span.end_col)

            left = BinaryExpression(
                left=left,
                operator=operator,
                right=right,
                span=combined_span
            )

            op_idx += 2       # Step over operator AND operand
            operand_idx += 2  # Step over operator AND operand

        return left

    def visitLogicalExpression(self, ctx: AntlrParser.LogicalExpressionContext) -> Optional[Expression]:
        """Visit logical expression. Delegates to comparisonExpression if no EN/OF is present."""
        # Grammar: logicalExpression: comparisonExpression ( (EN | OF) comparisonExpression )* ;

        # Check if EN or OF operators are present
        has_logical_op = False
        for i in range(ctx.getChildCount()):
            child = ctx.getChild(i)
            if isinstance(child, TerminalNode):
                if child.getSymbol().type in [AntlrParser.EN, AntlrParser.OF]:
                    has_logical_op = True
                    break
        
        if has_logical_op:
            # If EN/OF present, use the binary builder with visitComparisonExpression for operands
             logger.debug(f"Handling LogicalExpression with EN/OF operators: {safe_get_text(ctx)}")
             return self._build_binary_expression(ctx, OPERATOR_MAP, self.visitComparisonExpression)
        elif ctx.comparisonExpression():
             # If no EN/OF, just visit the single comparisonExpression child
             logger.debug(f"Handling LogicalExpression by delegating to ComparisonExpression: {safe_get_text(ctx)}")
             return self.visitComparisonExpression(ctx.comparisonExpression())
        else:
             logger.warning(f"Unexpected logicalExpression structure (no EN/OF and no comparisonExpression child): {safe_get_text(ctx)}")
             # Fallback: try visiting children generically, though likely incorrect
             if ctx.getChildCount() > 0:
                 return self.visit(ctx.getChild(0))
             return None

    def visitComparisonExpression(self, ctx: AntlrParser.ComparisonExpressionContext) -> Optional[Expression]:
        """Visit comparison expression (==, !=, <, >, <=, >=, is, etc.). Handles alternatives."""
        # This rule might have multiple alternatives (# labels in grammar) OR
        # be a chain like `additive op additive op additive`
        # The _build_binary_expression handles the chained case.
        # We need to handle specific labeled alternatives first.

        if isinstance(ctx, AntlrParser.BinaryComparisonExprContext):
            # This label should NOT exist if the grammar is simply `expr op expr`.
            # If it DOES exist, it suggests the grammar might be `left=additiveExpr op=comparisonOperator right=additiveExpr`.
            # Let's assume the standard precedence chain and use _build_binary_expression directly on the context.
             logger.debug(f"Handling ComparisonExpression potentially via BinaryComparisonExprContext label: {safe_get_text(ctx)}")
             # Ensure the operator is extracted from the comparisonOperator rule context if present
             return self._build_binary_expression(ctx, OPERATOR_MAP, self.visitAdditiveExpression, operator_rule_name='comparisonOperator')

        elif isinstance(ctx, AntlrParser.UnaryConditionExprContext):
            return self.visitUnaryCondition(ctx.unaryCondition())
        elif isinstance(ctx, AntlrParser.RegelStatusConditionExprContext):
            return self.visitRegelStatusCondition(ctx.regelStatusCondition())
        elif isinstance(ctx, AntlrParser.IsKenmerkExprContext):
            left_expr = self.visitAdditiveExpression(ctx.left)
            kenmerk_name = ctx.identifier().getText()
            right_expr = VariableReference(variable_name=kenmerk_name, span=self.get_span(ctx.identifier()))
            if left_expr is None: return None
            op = Operator.IS_NIET if ctx.IS_NIET() or ctx.ZIJN_NIET() else Operator.IS
            return BinaryExpression(left=left_expr, operator=op, right=right_expr, span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.HeeftKenmerkExprContext):
            left_expr = self.visitAdditiveExpression(ctx.left)
            kenmerk_name = ctx.identifier().getText()
            right_expr = VariableReference(variable_name=kenmerk_name, span=self.get_span(ctx.identifier()))
            if left_expr is None: return None
            op = Operator.HEEFT_NIET if ctx.IS_NIET() or ctx.ZIJN_NIET() else Operator.HEEFT # Needs HEEFT_NIET
            return BinaryExpression(left=left_expr, operator=op, right=right_expr, span=self.get_span(ctx))
        else:
             # Default case: Assume it's a chain like `additive op additive...`
             # Check if it *looks* like a standard binary operation chain
             if ctx.getChildCount() > 1 and any(isinstance(child, AntlrParser.ComparisonOperatorContext) for child in ctx.children):
                  logger.debug(f"Handling ComparisonExpression as a potential chain: {safe_get_text(ctx)}")
                  return self._build_binary_expression(ctx, OPERATOR_MAP, self.visitAdditiveExpression, operator_rule_name='comparisonOperator')
             else:
                  # If it's not a recognized label and doesn't look like a chain, log error.
                  logger.error(f"Unknown or unhandled comparisonExpression structure/alternative: {type(ctx).__name__} in {safe_get_text(ctx)}")
                  # Attempt to visit the first child as a fallback, assuming it might delegate correctly
                  # Example: comparisonExpression might directly contain an additiveExpression if no comparison op is used.
                  if ctx.getChildCount() == 1:
                      return self.visit(ctx.getChild(0))
                  return None # Give up

    def visitAdditiveExpression(self, ctx: AntlrParser.AdditiveExpressionContext) -> Optional[Expression]:
        """Visit additive expression (+, -, verminderd met)."""
        # Use the generic binary expression builder helper, specifying the operator rule name
        return self._build_binary_expression(ctx, OPERATOR_MAP, self.visitMultiplicativeExpression, operator_rule_name='additiveOperator')

    def visitMultiplicativeExpression(self, ctx: AntlrParser.MultiplicativeExpressionContext) -> Optional[Expression]:
        """Visit multiplicative expression (*, /)."""
        # Use the generic binary expression builder helper, specifying the operator rule name
        return self._build_binary_expression(ctx, OPERATOR_MAP, self.visitPowerExpression, operator_rule_name='multiplicativeOperator')

    def visitPowerExpression(self, ctx: AntlrParser.PowerExpressionContext) -> Optional[Expression]:
        """Visit power expression (^, tot de macht)."""
        # Use the generic binary expression builder helper, specifying the operator rule name
        return self._build_binary_expression(ctx, OPERATOR_MAP, self.visitPrimaryExpression, operator_rule_name='powerOperator')

    def visitPrimaryExpression(self, ctx: AntlrParser.PrimaryExpressionContext) -> Optional[Expression]:
        """Visit a primary expression (literal, reference, function call, parenthesized expr)."""
        # --- Add logging --- 
        logger.debug(f"Visiting PrimaryExpression: Type={type(ctx).__name__}, Text='{safe_get_text(ctx)}'")
        # --- End logging ---

        # --- Handle Labeled Alternatives FIRST ---
        if isinstance(ctx, AntlrParser.BezieldeRefExprContext):
             logger.debug("  -> Matched BezieldeRefExprContext")
             return self.visitBezieldeReferentie(ctx.bezieldeReferentie())
        elif isinstance(ctx, AntlrParser.AttrRefExprContext):
             logger.debug("  -> Matched AttrRefExprContext")
             return self.visitAttribuutReferentie(ctx.attribuutReferentie())
        elif isinstance(ctx, AntlrParser.ParamRefExprContext):
            logger.debug("  -> Matched ParamRefExprContext")
            param_name_ctx = ctx.parameterMetLidwoord().naamwoord() # Drill down
            param_name = self._extract_canonical_name(param_name_ctx)
            if not param_name:
                    logger.error(f"Could not extract canonical name for parameter reference in {safe_get_text(ctx)}")
                    param_name = "<unknown_param>" # Keep fallback
            logger.debug(f"    Extracted param_name: '{param_name}'")
            result = ParameterReference(parameter_name=param_name, span=self.get_span(ctx))
            logger.debug(f"    Returning: {result}")
            return result
        elif isinstance(ctx, AntlrParser.ParenExprContext):
             logger.debug("  -> Matched ParenExprContext")
             return self.visitExpressie(ctx.expressie())
        elif isinstance(ctx, AntlrParser.NaamwoordExprContext):
            logger.debug("  -> Matched NaamwoordExprContext")
            # --- Call dedicated visitNaamwoord ---
            name = self.visitNaamwoord(ctx.naamwoord())
            # -------------------------------------
            logger.debug(f"    Name returned by visitNaamwoord: '{name}'")
            if name:
                # Check if this is a parameter name
                if name in self.parameter_names:
                    logger.debug(f"    Name '{name}' is a known parameter, creating ParameterReference")
                    result = ParameterReference(parameter_name=name, span=self.get_span(ctx))
                else:
                    # Not a parameter, assume variable reference
                    logger.debug(f"    Name '{name}' is not a known parameter, creating VariableReference")
                    result = VariableReference(variable_name=name, span=self.get_span(ctx))
                logger.debug(f"    Returning: {result}")
                return result
            else:
                logger.error(f"visitNaamwoord returned None for {safe_get_text(ctx)}")
                return None
        elif isinstance(ctx, AntlrParser.RekendatumKeywordExprContext):
            logger.debug("  -> Matched RekendatumKeywordExprContext")
            result = VariableReference(variable_name="rekendatum", span=self.get_span(ctx))
            logger.debug(f"    Returning: {result}")
            return result
        elif isinstance(ctx, AntlrParser.IdentifierExprContext):
            logger.debug("  -> Matched IdentifierExprContext")
            name = ctx.identifier().getText()
            logger.debug(f"    Extracted identifier: '{name}'")
            # Check if this is a parameter name
            if name in self.parameter_names:
                logger.debug(f"    Identifier '{name}' is a known parameter, creating ParameterReference")
                result = ParameterReference(parameter_name=name, span=self.get_span(ctx))
            else:
                # Not a parameter, assume variable reference
                logger.debug(f"    Identifier '{name}' is not a known parameter, creating VariableReference")
                result = VariableReference(variable_name=name, span=self.get_span(ctx))
            logger.debug(f"    Returning: {result}")
            return result
        elif isinstance(ctx, AntlrParser.NumberLiteralExprContext):
            logger.debug("  -> Matched NumberLiteralExprContext")
            num_text = ctx.NUMBER().getText().replace(',', '.')
            try:
                value = float(num_text) if '.' in num_text or 'e' in num_text or 'E' in num_text else int(num_text)
                return Literal(value=value, datatype="Numeriek", span=self.get_span(ctx))
            except ValueError:
                 logger.error(f"Invalid numeric literal: {ctx.NUMBER().getText()} in {safe_get_text(ctx)}")
                 return None
        elif isinstance(ctx, AntlrParser.StringLiteralExprContext):
            return Literal(value=ctx.STRING_LITERAL().getText().strip("\'"), datatype="Tekst", span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.EnumLiteralExprContext):
             return Literal(value=ctx.ENUM_LITERAL().getText(), datatype="Enumeratie", span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.DatumLiteralExprContext):
             # Assuming datumLiteral itself holds the text directly or via DATE_TIME_LITERAL
             date_text = safe_get_text(ctx.datumLiteral().DATE_TIME_LITERAL()) if ctx.datumLiteral().DATE_TIME_LITERAL() else safe_get_text(ctx.datumLiteral())
             return Literal(value=date_text, datatype="Datum", span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.BooleanTrueLiteralExprContext):
            return Literal(value=True, datatype="Boolean", span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.BooleanFalseLiteralExprContext):
             return Literal(value=False, datatype="Boolean", span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.PronounExprContext):
             return AttributeReference(path=["self"], span=self.get_span(ctx))
        # --- Handle Labeled Function Calls --- 
        elif isinstance(ctx, AntlrParser.AbsTijdsduurFuncExprContext) or \
             isinstance(ctx, AntlrParser.TijdsduurFuncExprContext) or \
             isinstance(ctx, AntlrParser.SomFuncExprContext) or \
             isinstance(ctx, AntlrParser.AantalFuncExprContext) or \
             isinstance(ctx, AntlrParser.PercentageFuncExprContext) or \
             isinstance(ctx, AntlrParser.WortelFuncExprContext) or \
             isinstance(ctx, AntlrParser.AbsValFuncExprContext) or \
             isinstance(ctx, AntlrParser.MinValFuncExprContext) or \
             isinstance(ctx, AntlrParser.MaxValFuncExprContext) or \
             isinstance(ctx, AntlrParser.JaarUitFuncExprContext) or \
             isinstance(ctx, AntlrParser.MaandUitFuncExprContext) or \
             isinstance(ctx, AntlrParser.DagUitFuncExprContext) or \
             isinstance(ctx, AntlrParser.DatumMetFuncExprContext) or \
             isinstance(ctx, AntlrParser.PasenFuncExprContext) or \
             isinstance(ctx, AntlrParser.DateCalcExprContext) or \
             isinstance(ctx, AntlrParser.EersteDatumFuncExprContext) or \
             isinstance(ctx, AntlrParser.LaatsteDatumFuncExprContext) or \
             isinstance(ctx, AntlrParser.TotaalVanExprContext) or \
             isinstance(ctx, AntlrParser.HetAantalDagenInExprContext) or \
             isinstance(ctx, AntlrParser.TijdsevenredigDeelExprContext) or \
             isinstance(ctx, AntlrParser.DimensieAggExprContext):
             # TODO: Implement specific function visitors or a more robust visitFunctionCall
             # return self.visitFunctionCall(ctx) # Generic call needs implementation
             logger.warning(f"Unhandled function call type via label: {type(ctx).__name__} in {safe_get_text(ctx)}")
             return None
        # --- Handle Other Labeled Expressions --- 
        elif isinstance(ctx, AntlrParser.AfrondingExprContext): # Example
            # TODO: Implement visitAfronding
            logger.warning(f"AfrondingExpr needs specific visitor: {safe_get_text(ctx)}")
            return self.visit(ctx.primaryExpression()) if hasattr(ctx, 'primaryExpression') else None
        elif isinstance(ctx, AntlrParser.BegrenzingExprContext):
            logger.warning(f"BegrenzingExpr needs specific visitor: {safe_get_text(ctx)}")
            return None # Placeholder
        elif isinstance(ctx, AntlrParser.ConcatenatieExprContext) or isinstance(ctx, AntlrParser.SimpleConcatenatieExprContext):
            logger.warning(f"Concatenation Expr needs specific visitor: {safe_get_text(ctx)}")
            return None # Placeholder
        
        # --- Fallback / Deprecated Checks (Should ideally be covered by labels) ---
        # These might catch cases if grammar labels are incomplete or visitor is missing cases
        else:
            # Check for parentheses using attribute access (less reliable than label)
            if hasattr(ctx, 'LPAREN') and ctx.LPAREN() and hasattr(ctx, 'RPAREN') and ctx.RPAREN() and hasattr(ctx, 'expressie') and ctx.expressie():
                return self.visitExpressie(ctx.expressie())
            # Add other fallback checks if needed, but they are less robust
            
            logger.warning(f"Unknown or unhandled primary expression type (no specific label matched): {type(ctx).__name__} -> {safe_get_text(ctx)}")
            return None

    def visitAttribuutReferentie(self, ctx: AntlrParser.AttribuutReferentieContext) -> Optional[AttributeReference]:
        """Visit an attribute reference and build an AttributeReference object."""
        attribute_name = self.visitNaamwoord(ctx.naamwoord())
        # Recursively build the path from the nested onderwerpReferentie
        base_path = self.visitOnderwerpReferentieToPath(ctx.onderwerpReferentie())
        if not base_path:
             logger.error(f"Could not parse base path for attribute reference: {safe_get_text(ctx)}")
             return None
        # Prepend the attribute name to the path
        full_path = [attribute_name] + base_path
        return AttributeReference(path=full_path, span=self.get_span(ctx))

    def visitOnderwerpReferentieToPath(self, ctx: AntlrParser.OnderwerpReferentieContext) -> List[str]:
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

    def visitBasisOnderwerpToString(self, ctx: AntlrParser.BasisOnderwerpContext) -> str:
        """Extracts a string representation from basisOnderwerp."""
        # Handles pronoun (HIJ), identifier, or naamwoord
        if ctx.HIJ():
            return "self" # Represent pronoun as 'self' or similar context key
        elif ctx.IDENTIFIER():
            # Combine identifiers, ignore DE/HET/EEN/ZIJN for the path key
            return " ".join([id_token.getText() for id_token in ctx.IDENTIFIER()])
        return "<unknown_basis_onderwerp>"

    def visitKenmerkNaam(self, ctx: AntlrParser.KenmerkNaamContext) -> str:
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

    # --- Expression Visitors ---
   

    def _extract_canonical_name(self, name_ctx: Optional[ParserRuleContext]) -> Optional[str]:
        """
        Extracts a canonical name from various name-related contexts,
        stripping articles (DE, HET, EEN) and joining parts with spaces.
        Handles NaamwoordContext, ParameterNamePhraseContext, RegelNameContext,
        and IdentifierContext directly. Returns None on failure.
        """
        if name_ctx is None:
            logger.warning("_extract_canonical_name called with None context.")
            return None

        logger.debug(f"    _extract_canonical_name called for: Type={type(name_ctx).__name__}, Text='{safe_get_text(name_ctx)}'")
        name_parts = []
        nodes_to_process = []
        ignore_tokens = [AntlrParser.DE, AntlrParser.HET, AntlrParser.EEN]

        # --- Identify the terminal nodes containing the actual name tokens ---
        if isinstance(name_ctx, AntlrParser.NaamwoordContext):
            # For Naamwoord, process the children of the first NaamPhrase
            if hasattr(name_ctx, 'naamPhrase'):
                potential_naam_phrase = name_ctx.naamPhrase()
                if potential_naam_phrase:
                    # Handle list possibility robustly
                    naam_phrase_ctx = potential_naam_phrase[0] if isinstance(potential_naam_phrase, list) and potential_naam_phrase else \
                                      potential_naam_phrase if not isinstance(potential_naam_phrase, list) else None
                    if naam_phrase_ctx:
                        nodes_to_process = [child for child in naam_phrase_ctx.children if isinstance(child, TerminalNode)]
                        logger.debug(f"      Processing NaamPhrase children for Naamwoord: {[safe_get_text(n) for n in nodes_to_process]}")
                    else: logger.warning(f"      _extract_canonical_name: No valid naamPhrase context found within NaamwoordContext '{safe_get_text(name_ctx)}'.")
                else: logger.warning(f"      _extract_canonical_name: naamPhrase() returned None/empty within NaamwoordContext '{safe_get_text(name_ctx)}'.")
            else: logger.warning(f"      _extract_canonical_name: NaamwoordContext '{safe_get_text(name_ctx)}' lacks naamPhrase attribute.")

        elif isinstance(name_ctx, AntlrParser.ParameterNamePhraseContext):
            # Directly process terminal children
            nodes_to_process = [child for child in name_ctx.children if isinstance(child, TerminalNode)]
            logger.debug(f"      Processing direct children for ParameterNamePhrase: {[safe_get_text(n) for n in nodes_to_process]}")

        elif isinstance(name_ctx, AntlrParser.RegelNameContext):
            # Directly process terminal children, add NUMBER to ignore list for rules
            ignore_tokens.append(AntlrParser.NUMBER)
            nodes_to_process = [child for child in name_ctx.children if isinstance(child, TerminalNode)]
            logger.debug(f"      Processing direct children for RegelName: {[safe_get_text(n) for n in nodes_to_process]}")
            # Note: This might need refinement if RegelName can contain non-terminals

        elif isinstance(name_ctx, AntlrParser.IdentifierContext):
             # If passed an identifier context directly, return its text
             logger.debug("      _extract_canonical_name: Input is IdentifierContext, returning its text directly.")
             return safe_get_text(name_ctx)

        else:
            # Fallback for unknown types - try getting raw text? Or fail? Let's fail for now.
            logger.error(f"    _extract_canonical_name: Unsupported context type: {type(name_ctx).__name__} for text '{safe_get_text(name_ctx)}'")
            return None # Indicate failure for unsupported types

        # --- Process the identified terminal nodes ---
        if not nodes_to_process:
             logger.warning(f"    _extract_canonical_name: No terminal nodes identified to process for name extraction from {type(name_ctx).__name__}: '{safe_get_text(name_ctx)}'")
             # Fallback? Let's return None if no parts identified.
             return None

        for node in nodes_to_process:
            token_type = node.getSymbol().type
            token_text = safe_get_text(node)

            if token_type not in ignore_tokens:
                name_parts.append(token_text)
                logger.debug(f"        _extract_canonical_name: Appending name part: '{token_text}'")
            else:
                logger.debug(f"        _extract_canonical_name: Ignoring token: '{token_text}' (Type: {token_type})")

        # --- Finalize Name ---
        if not name_parts:
            logger.error(f"    _extract_canonical_name: No valid name parts extracted from {type(name_ctx).__name__} context: '{safe_get_text(name_ctx)}'")
            return None # Indicate failure

        final_name = " ".join(name_parts)
        logger.debug(f"    _extract_canonical_name returning: '{final_name}'")
        return final_name