"""RegelSpraak AST builder: Converts ANTLR parse trees to domain AST nodes."""
from typing import Dict, List, Any, Optional, Tuple
import logging
from decimal import Decimal

# Import ANTLR generated files
from ._antlr.RegelSpraakParser import RegelSpraakParser as AntlrParser
from ._antlr.RegelSpraakLexer import RegelSpraakLexer as AntlrLexer
from ._antlr.RegelSpraakVisitor import RegelSpraakVisitor
from antlr4.ParserRuleContext import ParserRuleContext
from antlr4.tree.Tree import TerminalNode

# Import AST nodes
from .ast import (
    DomainModel, ObjectType, Attribuut, Kenmerk, Regel, RegelVersie, RegelGroep, Parameter, Domein,
    FeitType, Rol, Voorwaarde, ResultaatDeel, Gelijkstelling, KenmerkToekenning,
    ObjectCreatie, FeitCreatie, Consistentieregel, Initialisatie, Dagsoortdefinitie, Dagsoort, Verdeling,
    VerdelingMethode, VerdelingGelijkeDelen, VerdelingNaarRato, VerdelingOpVolgorde,
    VerdelingTieBreak, VerdelingMaximum, VerdelingAfronding,
    Expression, Literal, AttributeReference, VariableReference,
    BinaryExpression, UnaryExpression, FunctionCall, Operator,
    ParameterReference, SourceSpan, Beslistabel, BeslistabelRow,
    BeslistabelCondition, BeslistabelResult, Dimension, DimensionLabel,
    DimensionedAttributeReference, PeriodDefinition, DisjunctionExpression, ConjunctionExpression,
    Subselectie, RegelStatusExpression, Predicaat, ObjectPredicaat, VergelijkingsPredicaat,
    GetalPredicaat, TekstPredicaat, DatumPredicaat, SamengesteldPredicaat,
    Kwantificatie, KwantificatieType, GenesteVoorwaardeInPredicaat, VergelijkingInPredicaat,
    SamengesteldeVoorwaarde
)
from .beslistabel_parser import BeslistabelParser

logger = logging.getLogger(__name__)

# --- Helper Functions ---

def safe_get_text(ctx):
    """Helper function to get text safely from ANTLR context."""
    return ctx.getText() if ctx else None

def get_text_with_spaces(ctx):
    """Helper function to get text from ANTLR context with spaces preserved between tokens."""
    if not ctx:
        return None
    
    # If it's a terminal node, just return its text
    if isinstance(ctx, TerminalNode):
        return ctx.getText()
    
    # For parser rule contexts, reconstruct with spaces
    parts = []
    for i in range(ctx.getChildCount()):
        child = ctx.getChild(i)
        if isinstance(child, TerminalNode):
            parts.append(child.getText())
        else:
            # Recursively get text from child contexts
            child_text = get_text_with_spaces(child)
            if child_text:
                parts.append(child_text)
    
    return " ".join(parts)

def get_span_from_ctx(ctx: Optional[ParserRuleContext]) -> SourceSpan:
    """Helper to get SourceSpan from ANTLR context."""
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

# --- Operator Mapping Configuration ---

# Helper to map tokens to Operator enum
OPERATOR_MAP = {
    # --- Arithmetic ---
    AntlrParser.PLUS: Operator.PLUS,
    AntlrParser.MIN: Operator.MIN,
    AntlrParser.VERMINDERD_MET: Operator.VERMINDERD_MET, # Different empty value handling than MIN
    AntlrParser.MAAL: Operator.MAAL,
    AntlrParser.GEDEELD_DOOR: Operator.GEDEELD_DOOR,
    AntlrParser.TOT_DE_MACHT: Operator.MACHT,
    AntlrParser.CARET: Operator.MACHT,

    # --- Comparison (Base Forms) ---
    AntlrParser.GELIJK_AAN: Operator.GELIJK_AAN,
    AntlrParser.GELIJK_IS_AAN: Operator.GELIJK_AAN,  # Alternative word order
    AntlrParser.ONGELIJK_AAN: Operator.NIET_GELIJK_AAN,
    AntlrParser.KLEINER_DAN: Operator.KLEINER_DAN,
    AntlrParser.GROTER_DAN: Operator.GROTER_DAN,
    AntlrParser.KLEINER_OF_GELIJK_AAN: Operator.KLEINER_OF_GELIJK_AAN,
    AntlrParser.GROTER_OF_GELIJK_AAN: Operator.GROTER_OF_GELIJK_AAN,

    # --- Comparison (Singular Phrase Forms) ---
    # Note: IS_GELIJK_AAN == GELIJK_AAN, IS_ONGELIJK_AAN == ONGELIJK_AAN
    AntlrParser.IS_GELIJK_AAN: Operator.GELIJK_AAN,
    AntlrParser.IS_ONGELIJK_AAN: Operator.NIET_GELIJK_AAN,
    AntlrParser.IS_KLEINER_DAN: Operator.KLEINER_DAN,             # Exists
    AntlrParser.KLEINER_IS_DAN: Operator.KLEINER_DAN,             # Exists
    AntlrParser.IS_GROTER_DAN: Operator.GROTER_DAN,               # Exists
    AntlrParser.GROTER_IS_DAN: Operator.GROTER_DAN,               # Added for new syntax
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
    AntlrParser.HEEFT: Operator.HEEFT,

    # --- Logical Operators ---
    AntlrParser.EN: Operator.EN,
    AntlrParser.OF: Operator.OF,
    
    # --- Collection Operators ---
    AntlrParser.IN: Operator.IN,
    AntlrParser.NIET: Operator.NIET, # Unary
    # Add NIET_IN if defined in grammar
}

# --- AST Builder Class ---

class RegelSpraakModelBuilder(RegelSpraakVisitor):
    """Visitor that builds model objects from a RegelSpraak parse tree."""

    # 1. Initialization
    def __init__(self):
        """Initialize the model builder with tracking for parameter names."""
        super().__init__()
        # Set to track parameter names for differentiating ParameterReference from VariableReference
        self.parameter_names = set()

    # 2. Core Internal Helper Methods
    def get_span(self, ctx) -> SourceSpan:
        """Helper to get SourceSpan from an ANTLR context, delegating to the global helper."""
        return get_span_from_ctx(ctx)

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
            # For Naamwoord, use get_text_with_spaces to get the full text
            full_text = get_text_with_spaces(name_ctx)
            if full_text:
                # Remove leading articles
                for article in ['de ', 'het ', 'een ']:
                    if full_text.lower().startswith(article):
                        full_text = full_text[len(article):]
                        break
                return full_text
            
            # Fallback: process the children of the first NaamPhrase
            if hasattr(name_ctx, 'naamPhrase'):
                potential_naam_phrase = name_ctx.naamPhrase()
                if potential_naam_phrase:
                    # Handle list possibility robustly
                    naam_phrase_ctx = potential_naam_phrase[0] if isinstance(potential_naam_phrase, list) and potential_naam_phrase else \
                                      potential_naam_phrase if not isinstance(potential_naam_phrase, list) else None
                    if naam_phrase_ctx:
                        # Process both terminal nodes and identifierOrKeyword contexts
                        for child in naam_phrase_ctx.children:
                            if isinstance(child, TerminalNode):
                                # Only add non-article terminal nodes
                                token_type = child.getSymbol().type
                                if token_type not in ignore_tokens:
                                    nodes_to_process.append(child)
                            elif hasattr(child, 'identifierOrKeyword') and callable(child.identifierOrKeyword):
                                # This is an identifierOrKeyword context - get its terminal node
                                id_or_kw_ctx = child
                                if hasattr(id_or_kw_ctx, 'IDENTIFIER') and id_or_kw_ctx.IDENTIFIER():
                                    nodes_to_process.append(id_or_kw_ctx.IDENTIFIER())
                                elif hasattr(id_or_kw_ctx, 'DAG') and id_or_kw_ctx.DAG():
                                    nodes_to_process.append(id_or_kw_ctx.DAG())
                                elif hasattr(id_or_kw_ctx, 'MAAND') and id_or_kw_ctx.MAAND():
                                    nodes_to_process.append(id_or_kw_ctx.MAAND())
                                elif hasattr(id_or_kw_ctx, 'JAAR') and id_or_kw_ctx.JAAR():
                                    nodes_to_process.append(id_or_kw_ctx.JAAR())
                                elif hasattr(id_or_kw_ctx, 'AANTAL') and id_or_kw_ctx.AANTAL():
                                    nodes_to_process.append(id_or_kw_ctx.AANTAL())
                                elif hasattr(id_or_kw_ctx, 'PERIODE') and id_or_kw_ctx.PERIODE():
                                    nodes_to_process.append(id_or_kw_ctx.PERIODE())
                                elif hasattr(id_or_kw_ctx, 'REGEL') and id_or_kw_ctx.REGEL():
                                    nodes_to_process.append(id_or_kw_ctx.REGEL())
                                elif hasattr(id_or_kw_ctx, 'VOORWAARDE') and id_or_kw_ctx.VOORWAARDE():
                                    nodes_to_process.append(id_or_kw_ctx.VOORWAARDE())
                            elif type(child).__name__ == 'IdentifierOrKeywordContext':
                                # Direct identifierOrKeyword context
                                if hasattr(child, 'IDENTIFIER') and child.IDENTIFIER():
                                    nodes_to_process.append(child.IDENTIFIER())
                                elif hasattr(child, 'DAG') and child.DAG():
                                    nodes_to_process.append(child.DAG())
                                elif hasattr(child, 'MAAND') and child.MAAND():
                                    nodes_to_process.append(child.MAAND())
                                elif hasattr(child, 'JAAR') and child.JAAR():
                                    nodes_to_process.append(child.JAAR())
                                elif hasattr(child, 'AANTAL') and child.AANTAL():
                                    nodes_to_process.append(child.AANTAL())
                                elif hasattr(child, 'PERIODE') and child.PERIODE():
                                    nodes_to_process.append(child.PERIODE())
                                elif hasattr(child, 'REGEL') and child.REGEL():
                                    nodes_to_process.append(child.REGEL())
                                elif hasattr(child, 'VOORWAARDE') and child.VOORWAARDE():
                                    nodes_to_process.append(child.VOORWAARDE())
                        logger.debug(f"      Processing NaamPhrase children for Naamwoord: {[safe_get_text(n) for n in nodes_to_process]}")
                    else: logger.warning(f"      _extract_canonical_name: No valid naamPhrase context found within NaamwoordContext '{safe_get_text(name_ctx)}'.")
                else: logger.warning(f"      _extract_canonical_name: naamPhrase() returned None/empty within NaamwoordContext '{safe_get_text(name_ctx)}'.")
            else: logger.warning(f"      _extract_canonical_name: NaamwoordContext '{safe_get_text(name_ctx)}' lacks naamPhrase attribute.")

        elif isinstance(name_ctx, AntlrParser.ParameterNamePhraseContext):
            # Handle new structure with parameterNamePart and voorzetsel
            # Get all text including prepositions, but skip initial articles
            full_text = get_text_with_spaces(name_ctx)
            if full_text:
                # Remove leading articles
                for article in ['de ', 'het ', 'een ']:
                    if full_text.lower().startswith(article):
                        full_text = full_text[len(article):]
                        break
                return full_text
            # Fallback: process terminal children
            nodes_to_process = [child for child in name_ctx.children if isinstance(child, TerminalNode)]
            logger.debug(f"      Processing direct children for ParameterNamePhrase: {[safe_get_text(n) for n in nodes_to_process]}")

        elif isinstance(name_ctx, AntlrParser.RegelNameContext):
            # For RegelName, we need to include both the base name and any extensions
            # Use get_text_with_spaces to preserve the complete rule name
            full_text = get_text_with_spaces(name_ctx)
            if full_text:
                return full_text
            
            # Fallback: manually build from parts
            parts = []
            
            # Get the base name from naamwoordWithNumbers
            if hasattr(name_ctx, 'naamwoordWithNumbers') and name_ctx.naamwoordWithNumbers():
                base_name = self._extract_canonical_name(name_ctx.naamwoordWithNumbers())
                if base_name:
                    parts.append(base_name)
            # Or from naamwoord
            elif hasattr(name_ctx, 'naamwoord') and name_ctx.naamwoord():
                base_name = self._extract_canonical_name(name_ctx.naamwoord())
                if base_name:
                    parts.append(base_name)
            
            # Include any regelNameExtension parts
            if hasattr(name_ctx, 'regelNameExtension') and name_ctx.regelNameExtension():
                extensions = name_ctx.regelNameExtension()
                if not isinstance(extensions, list):
                    extensions = [extensions]
                for ext in extensions:
                    ext_text = safe_get_text(ext)
                    if ext_text:
                        parts.append(ext_text)
            
            if parts:
                return ' '.join(parts)
            else:
                # Last resort: directly process terminal children, add NUMBER to ignore list for rules
                ignore_tokens.append(AntlrParser.NUMBER)
                nodes_to_process = [child for child in name_ctx.children if isinstance(child, TerminalNode)]
                logger.debug(f"      Processing direct children for RegelName: {[safe_get_text(n) for n in nodes_to_process]}")

        elif isinstance(name_ctx, AntlrParser.IdentifierContext):
             # If passed an identifier context directly, return its text
             logger.debug("      _extract_canonical_name: Input is IdentifierContext, returning its text directly.")
             return safe_get_text(name_ctx)

        elif isinstance(name_ctx, AntlrParser.NaamwoordWithNumbersContext):
            # Handle NaamwoordWithNumbers which can contain numbers
            # Use get_text_with_spaces to get the full text including numbers
            full_text = get_text_with_spaces(name_ctx)
            if full_text:
                # Remove leading articles
                for article in ['de ', 'het ', 'een ', 'is ']:
                    if full_text.lower().startswith(article):
                        full_text = full_text[len(article):]
                        break
                return full_text
            # Fallback to getting raw text
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

    def _extract_canonical_name_from_text(self, text: str) -> str:
        """Extract canonical name from a text string by removing common articles.
        
        This is a simpler version of _extract_canonical_name that works on plain text
        rather than ANTLR contexts. Used when we have a string that may contain articles.
        """
        if not text:
            return text
            
        # Split the text into words
        words = text.split()
        if not words:
            return text
            
        # Check if first word is an article to remove
        articles = {'de', 'het', 'een', 'De', 'Het', 'Een'}
        if words[0] in articles:
            # Remove the article and rejoin
            return ' '.join(words[1:])

        return text

    def _parse_datatype(self, ctx) -> Tuple[bool, str, Optional[str]]:
        """Parse a datatype context and return structured information.

        Returns:
            Tuple of (is_lijst, datatype, element_datatype)
            - is_lijst: True if this is a list type
            - datatype: The main datatype (e.g., 'Lijst' for lists, 'Numeriek' for simple types)
            - element_datatype: The element type for lists (e.g., 'Numeriek' for 'lijst van Numeriek')
        """
        if ctx is None:
            return False, None, None

        # Get the context type name
        context_type = type(ctx).__name__

        # Check if this is a DatatypeContext with a lijstDatatype child
        if context_type == 'DatatypeContext' and hasattr(ctx, 'lijstDatatype') and ctx.lijstDatatype():
            # This is a list type - drill down to the lijstDatatype
            return self._parse_datatype(ctx.lijstDatatype())

        # Check if this is directly a lijstDatatype context
        elif context_type == 'LijstDatatypeContext':
            # This is a list type - check what type of element it has
            element_ctx = ctx.datatype() if hasattr(ctx, 'datatype') and callable(ctx.datatype) else None
            domain_ref_ctx = ctx.domeinRef() if hasattr(ctx, 'domeinRef') and callable(ctx.domeinRef) else None
            object_ref_ctx = ctx.objectTypeRef() if hasattr(ctx, 'objectTypeRef') and callable(ctx.objectTypeRef) else None

            if element_ctx:
                # Recursively handle nested lists or datatypes
                is_nested_lijst, element_type, nested_element = self._parse_datatype(element_ctx)
                if is_nested_lijst:
                    # This is a list of lists
                    return True, "Lijst", "Lijst"
                else:
                    # This is a simple list of a datatype
                    return True, "Lijst", element_type
            elif domain_ref_ctx:
                # List of domain type (e.g., Lijst van MyDomain)
                if hasattr(domain_ref_ctx, 'name'):
                    domain_name = domain_ref_ctx.name.text if hasattr(domain_ref_ctx.name, 'text') else str(domain_ref_ctx.name)
                else:
                    domain_name = safe_get_text(domain_ref_ctx)
                return True, "Lijst", domain_name
            elif object_ref_ctx:
                # List of object type (e.g., Lijst van Persoon)
                if hasattr(object_ref_ctx, 'IDENTIFIER') and callable(object_ref_ctx.IDENTIFIER):
                    id_token = object_ref_ctx.IDENTIFIER()
                    object_type_name = id_token.getText() if hasattr(id_token, 'getText') else id_token.text
                else:
                    object_type_name = safe_get_text(object_ref_ctx)
                return True, "Lijst", object_type_name
            else:
                # Shouldn't happen with valid grammar
                return True, "Lijst", None

        # Check if this is a DatatypeContext with other child types
        if context_type == 'DatatypeContext':
            # Check for each possible child type
            if hasattr(ctx, 'numeriekDatatype') and ctx.numeriekDatatype():
                return self._parse_datatype(ctx.numeriekDatatype())
            elif hasattr(ctx, 'tekstDatatype') and ctx.tekstDatatype():
                return self._parse_datatype(ctx.tekstDatatype())
            elif hasattr(ctx, 'datumTijdDatatype') and ctx.datumTijdDatatype():
                return self._parse_datatype(ctx.datumTijdDatatype())
            elif hasattr(ctx, 'booleanDatatype') and ctx.booleanDatatype():
                return self._parse_datatype(ctx.booleanDatatype())
            elif hasattr(ctx, 'percentageDatatype') and ctx.percentageDatatype():
                return self._parse_datatype(ctx.percentageDatatype())

        # Check for simple datatypes
        datatype_text = safe_get_text(ctx)

        # Handle simple datatypes
        if context_type == 'NumeriekDatatypeContext':
            return False, datatype_text, None
        elif context_type == 'TekstDatatypeContext':
            return False, datatype_text, None
        elif context_type == 'DatumTijdDatatypeContext':
            # Need to get the actual datatype text (e.g., "Datum in dagen")
            return False, datatype_text, None
        elif context_type == 'BooleanDatatypeContext':
            return False, datatype_text, None
        elif context_type == 'PercentageDatatypeContext':
            return False, datatype_text, None
        else:
            # Default: return the text as is (could be domain reference)
            return False, datatype_text, None

    def visitDatatype(self, ctx) -> Tuple[bool, str, Optional[str]]:
        """Visit a datatype node and return structured datatype information."""
        return self._parse_datatype(ctx)

    def visitLijstDatatype(self, ctx: AntlrParser.LijstDatatypeContext) -> Tuple[bool, str, Optional[str]]:
        """Visit a list datatype node and extract element type."""
        return self._parse_datatype(ctx)

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

            # If operator node is a context (like comparisonOperator), extract the terminal node
            if operator_rule_name and hasattr(op_node, 'children') and op_node.getChildCount() == 1:
                # Operator context typically has a single terminal child
                potential_terminal = op_node.getChild(0)
                if isinstance(potential_terminal, TerminalNode):
                    op_node = potential_terminal
                    logger.debug(f"Extracted terminal operator from {operator_rule_name} context: '{safe_get_text(op_node)}'")

            # Handle terminal operators
            if isinstance(op_node, TerminalNode):
                 op_type = op_node.getSymbol().type
                 op_sym_name = AntlrParser.symbolicNames[op_type] if op_type >= 0 and op_type < len(AntlrParser.symbolicNames) else 'INVALID'
                 logger.debug(f"Attempting lookup for TerminalNode operator.")
                 logger.debug(f"  op_node text: '{safe_get_text(op_node)}'")
                 logger.debug(f"  op_type: {op_type}")
                 logger.debug(f"  op_sym_name: {op_sym_name}")
                 logger.debug(f"  Key {op_type} in OPERATOR_MAP? {op_type in operator_map}")
                 operator = operator_map.get(op_type)
                 logger.debug(f"  Lookup result (operator): {operator}")

            # If operator is still None, then it's unknown
            if operator is None:
                logger.error(f"Unknown binary operator: '{op_text}' (Type: {op_type}, SymName: {op_sym_name}) Node: {type(op_node).__name__} in {safe_get_text(ctx)}")
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

    # 3. Main Visitor Entry Point & Generic ANTLR Overrides
    def visitRegelSpraakDocument(self, ctx: AntlrParser.RegelSpraakDocumentContext) -> DomainModel:
        """Visit the root document node and build the DomainModel."""
        self.domain_model = domain_model = DomainModel(span=self.get_span(ctx))
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
                    if definition.naam in domain_model.parameters:
                        # Duplicate parameter detected - add to parse errors
                        domain_model._parse_errors.append(
                            f"Parameter '{definition.naam}' already defined"
                        )
                    else:
                        domain_model.parameters[definition.naam] = definition
                    # Add parameter name to our tracking set (always, for consistency)
                    self.parameter_names.add(definition.naam)
                elif isinstance(definition, FeitType):
                    domain_model.feittypen[definition.naam] = definition
                elif isinstance(definition, Dimension):
                    domain_model.dimensions[definition.naam] = definition
                elif isinstance(definition, Dagsoort):
                    domain_model.dagsoorten[definition.naam] = definition
                elif definition is not None:
                     logger.warning(f"Unhandled definition type: {type(definition)} from {safe_get_text(child)}")
            elif isinstance(child, AntlrParser.RegelContext):
                rule = self.visitRegel(child)
                if rule:
                    domain_model.regels.append(rule)
            elif isinstance(child, AntlrParser.ConsistentieregelContext):
                consistentieregel = self.visitConsistentieregel(child)
                if consistentieregel:
                    # Consistentieregels are special types of rules, add to regels list
                    domain_model.regels.append(consistentieregel)
            elif isinstance(child, AntlrParser.RegelGroepContext):
                regelgroep = self.visitRegelGroep(child)
                if regelgroep:
                    domain_model.regelgroepen.append(regelgroep)
            elif isinstance(child, AntlrParser.BeslistabelContext):
                beslistabel = self.visitBeslistabel(child)
                if beslistabel:
                    domain_model.beslistabellen.append(beslistabel)
        return domain_model

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

    # 4. Atomic Name and Leaf-Node Processing Methods
    def visitNaamwoord(self, ctx: AntlrParser.NaamwoordContext) -> Optional[str]:
        """Visit a naamwoord context and extract the complete noun phrase including prepositions."""
        logger.debug(f"    Visiting Naamwoord: Text='{safe_get_text(ctx)}', Type={type(ctx).__name__}, ChildCount={ctx.getChildCount()}")
        
        # Process all parts of the naamwoord according to grammar:
        # naamwoord : naamPhrase ( voorzetsel naamPhrase )*
        all_parts = []
        
        # Get all naamPhrase contexts
        naam_phrases = ctx.naamPhrase()
        if not isinstance(naam_phrases, list):
            naam_phrases = [naam_phrases] if naam_phrases else []
        
        # Process the complete structure
        for i in range(ctx.getChildCount()):
            child = ctx.getChild(i)
            
            if type(child).__name__ == 'NaamPhraseContext':
                # Process naam phrase - extract text without articles
                phrase_parts = []
                for subchild in child.children:
                    if isinstance(subchild, TerminalNode):
                        token_type = subchild.getSymbol().type
                        token_text = safe_get_text(subchild)
                        # Skip articles
                        if token_type not in [AntlrParser.DE, AntlrParser.HET, AntlrParser.EEN]:
                            phrase_parts.append(token_text)
                    elif type(subchild).__name__ == 'IdentifierOrKeywordContext':
                        text = safe_get_text(subchild)
                        # Skip capitalized articles that were parsed as identifiers
                        if text.lower() not in ['de', 'het', 'een']:
                            phrase_parts.append(text)
                
                if phrase_parts:
                    all_parts.append(" ".join(phrase_parts))
                    
            elif type(child).__name__ == 'VoorzetselContext':
                # Add the preposition
                all_parts.append(safe_get_text(child))
        
        # Join all parts with spaces
        final_noun = " ".join(all_parts) if all_parts else safe_get_text(ctx)
        
        logger.debug(f"    visitNaamwoord returning: '{final_noun}'")
        return final_noun
    
    def visitNaamwoordWithNumbers(self, ctx: AntlrParser.NaamwoordWithNumbersContext) -> Optional[str]:
        """Visit a naamwoordWithNumbers context and extract the complete noun phrase including prepositions and numbers."""
        logger.debug(f"    Visiting NaamwoordWithNumbers: Text='{safe_get_text(ctx)}', Type={type(ctx).__name__}, ChildCount={ctx.getChildCount()}")
        
        # Process all parts of the naamwoordWithNumbers according to grammar:
        # naamwoordWithNumbers : naamPhraseWithNumbers ( voorzetsel naamPhraseWithNumbers )*
        all_parts = []
        
        # Process the complete structure
        for i in range(ctx.getChildCount()):
            child = ctx.getChild(i)
            
            if type(child).__name__ == 'NaamPhraseWithNumbersContext':
                # Process naam phrase - extract text without articles
                phrase_parts = []
                for subchild in child.children:
                    if isinstance(subchild, TerminalNode):
                        token_type = subchild.getSymbol().type
                        token_text = safe_get_text(subchild)
                        # Skip articles
                        if token_type not in [AntlrParser.DE, AntlrParser.HET, AntlrParser.EEN]:
                            phrase_parts.append(token_text)
                    elif type(subchild).__name__ in ['IdentifierOrKeywordWithNumbersContext', 'IdentifierOrKeywordContext']:
                        text = safe_get_text(subchild)
                        # Skip capitalized articles that were parsed as identifiers
                        if text.lower() not in ['de', 'het', 'een']:
                            phrase_parts.append(text)
                
                if phrase_parts:
                    all_parts.append(" ".join(phrase_parts))
                    
            elif type(child).__name__ == 'VoorzetselContext':
                # Add the preposition
                all_parts.append(safe_get_text(child))
        
        # Join all parts with spaces
        final_noun = " ".join(all_parts) if all_parts else safe_get_text(ctx)
        
        logger.debug(f"    visitNaamwoordWithNumbers returning: '{final_noun}'")
        return final_noun
    
    def visitNaamwoordNoIs(self, ctx: AntlrParser.NaamwoordNoIsContext) -> Optional[str]:
        """Visit a naamwoordNoIs context and extract the complete noun phrase including prepositions."""
        logger.debug(f"    Visiting NaamwoordNoIs: Text='{safe_get_text(ctx)}', Type={type(ctx).__name__}, ChildCount={ctx.getChildCount()}")

        # First, get the complete text without articles to check if it's a known attribute
        complete_text_parts = []
        for i in range(ctx.getChildCount()):
            child = ctx.getChild(i)
            if type(child).__name__ == 'NaamPhraseNoIsContext':
                for subchild in child.children:
                    if isinstance(subchild, TerminalNode):
                        token_type = subchild.getSymbol().type
                        token_text = safe_get_text(subchild)
                        # Skip articles
                        if token_type not in [AntlrParser.DE, AntlrParser.HET, AntlrParser.EEN]:
                            complete_text_parts.append(token_text)
                    elif type(subchild).__name__ == 'IdentifierOrKeywordNoIsContext':
                        text = safe_get_text(subchild)
                        if text.lower() not in ['de', 'het', 'een']:
                            complete_text_parts.append(text)
            elif type(child).__name__ == 'VoorzetselContext':
                complete_text_parts.append(safe_get_text(child))

        complete_text = " ".join(complete_text_parts)

        # Check if the complete text is a known attribute in any object type
        is_known_attribute = False
        if hasattr(self, 'domain_model') and self.domain_model:
            for obj_type in self.domain_model.objecttypes.values():
                if complete_text in obj_type.attributen:
                    is_known_attribute = True
                    break

        # If it's a known attribute, return the complete text
        if is_known_attribute:
            logger.debug(f"    visitNaamwoordNoIs: '{complete_text}' is a known attribute, returning complete")
            return complete_text

        # Otherwise, process with truncation logic for navigation
        # Process all parts of the naamwoordNoIs according to grammar:
        # naamwoordNoIs : naamPhraseNoIs ( voorzetsel naamPhraseNoIs )*
        all_parts = []

        # Get all naamPhraseNoIs contexts
        naam_phrases = ctx.naamPhraseNoIs()
        if not isinstance(naam_phrases, list):
            naam_phrases = [naam_phrases] if naam_phrases else []

        # Navigation indicators that suggest "van" starts navigation, not part of attribute
        navigation_indicators = ["de", "het", "alle", "een", "zijn", "haar", "hun"]
        stop_at_navigation = False

        # Process the complete structure
        for i in range(ctx.getChildCount()):
            child = ctx.getChild(i)

            if type(child).__name__ == 'NaamPhraseNoIsContext':
                # Check if this phrase starts with a navigation indicator
                has_nav_indicator = False
                first_token = None

                for subchild in child.children:
                    if isinstance(subchild, TerminalNode):
                        token_text = safe_get_text(subchild).lower()
                        if first_token is None:
                            first_token = token_text
                        if token_text in navigation_indicators:
                            has_nav_indicator = True
                            break
                    elif type(subchild).__name__ == 'IdentifierOrKeywordNoIsContext' and first_token is None:
                        first_token = safe_get_text(subchild).lower()

                # If we've seen a voorzetsel and this phrase starts with navigation indicator, stop
                if i > 0 and has_nav_indicator:
                    stop_at_navigation = True
                    break

                # Process naam phrase - extract text without articles
                phrase_parts = []
                for subchild in child.children:
                    if isinstance(subchild, TerminalNode):
                        token_type = subchild.getSymbol().type
                        token_text = safe_get_text(subchild)
                        # Skip articles
                        if token_type not in [AntlrParser.DE, AntlrParser.HET, AntlrParser.EEN]:
                            phrase_parts.append(token_text)
                    elif type(subchild).__name__ == 'IdentifierOrKeywordNoIsContext':
                        text = safe_get_text(subchild)
                        # Skip capitalized articles that were parsed as identifiers
                        if text.lower() not in ['de', 'het', 'een']:
                            phrase_parts.append(text)

                if phrase_parts:
                    all_parts.append(" ".join(phrase_parts))

            elif type(child).__name__ == 'VoorzetselContext':
                # Check if the next naamPhrase starts with navigation indicator
                # If so, don't include this voorzetsel and what follows
                if i + 1 < ctx.getChildCount():
                    next_child = ctx.getChild(i + 1)
                    if type(next_child).__name__ == 'NaamPhraseNoIsContext':
                        # Check if it starts with navigation indicator
                        for subchild in next_child.children:
                            if isinstance(subchild, TerminalNode):
                                token_text = safe_get_text(subchild).lower()
                                if token_text in navigation_indicators:
                                    stop_at_navigation = True
                                    break
                            break  # Only check first token

                if stop_at_navigation:
                    break

                # Add the preposition
                all_parts.append(safe_get_text(child))

        # Join all parts with spaces
        final_noun = " ".join(all_parts) if all_parts else safe_get_text(ctx)

        logger.debug(f"    visitNaamwoordNoIs returning: '{final_noun}'")
        return final_noun
    
    def visitSimpleNaamwoord(self, ctx: AntlrParser.SimpleNaamwoordContext) -> Optional[str]:
        """Visit a simpleNaamwoord context - just a naamPhrase without prepositions."""
        logger.debug(f"    Visiting SimpleNaamwoord: Text='{safe_get_text(ctx)}', Type={type(ctx).__name__}")
        
        # simpleNaamwoord : naamPhrase
        if ctx.naamPhrase():
            # Process naam phrase - extract text without articles
            phrase_ctx = ctx.naamPhrase()
            phrase_parts = []
            
            for child in phrase_ctx.children:
                if isinstance(child, TerminalNode):
                    # Skip articles at the beginning of phrases
                    token_text = child.getText()
                    if token_text not in ["de", "het", "een", "De", "Het", "Een", "zijn", "Zijn"]:
                        phrase_parts.append(token_text)
                else:
                    # Non-terminal nodes (like identifierOrKeyword)
                    phrase_parts.append(safe_get_text(child))
            
            result = " ".join(phrase_parts) if phrase_parts else safe_get_text(ctx)
            logger.debug(f"    visitSimpleNaamwoord returning: '{result}'")
            return result
        
        # Fallback
        return safe_get_text(ctx)

    def _normalize_kenmerk_name(self, text: str) -> str:
        """Normalize kenmerk names by stripping verb and article prefixes.
        
        Removes leading verbs like 'is', 'heeft', 'zijn', 'hebben' and
        articles like 'een', 'de', 'het' to ensure consistent kenmerk 
        naming between definition and usage.
        """
        # Strip common verb and article prefixes
        prefixes = ["is ", "heeft ", "zijn ", "hebben ", "een ", "de ", "het "]
        normalized = text.strip()
        for prefix in prefixes:
            if normalized.lower().startswith(prefix):
                # Remove prefix preserving the rest of the case
                normalized = normalized[len(prefix):]
                break
        return normalized

    def _normalize_time_unit(self, unit_text: str) -> str:
        """Normalize plural time units to singular form.

        Maps plural Dutch time units to their singular forms as expected
        by the engine's _add_time_to_date method.
        """
        unit_map = {
            "dagen": "dag",
            "maanden": "maand",
            "jaren": "jaar",
            "weken": "week",
            "uren": "uur",
            "minuten": "minuut",
            "seconden": "seconde",
            "milliseconden": "milliseconde",
            # Also handle singular forms (no-op)
            "dag": "dag",
            "maand": "maand",
            "jaar": "jaar",
            "week": "week",
            "uur": "uur",
            "minuut": "minuut",
            "seconde": "seconde",
            "milliseconde": "milliseconde"
        }
        return unit_map.get(unit_text.lower(), unit_text.lower())

    def visitKenmerkNaam(self, ctx: AntlrParser.KenmerkNaamContext) -> str:
        """Extract the name string from a kenmerkNaam context."""
        # Can be identifier or naamwoord
        # Use get_text_with_spaces to preserve spaces in multi-word kenmerk names
        raw_name = get_text_with_spaces(ctx)
        # Normalize to ensure consistent reference
        return self._normalize_kenmerk_name(raw_name)

    def _parse_naamwoord_to_navigation_path(self, ctx: AntlrParser.NaamwoordContext) -> List[str]:
        """Parse a naamwoord context into a navigation path.

        Handles patterns like "passagiers van de reis" and returns ["reis", "passagiers"]
        for proper navigation through relationships.
        """
        if not ctx:
            return []

        # Collect all parts from the naamwoord structure
        # Grammar: naamwoord : naamPhrase ( voorzetsel naamPhrase )*
        parts = []

        # Get all naamPhrase contexts
        naam_phrases = ctx.naamPhrase()
        if not isinstance(naam_phrases, list):
            naam_phrases = [naam_phrases] if naam_phrases else []

        # Extract text from each naamPhrase (without articles)
        for naam_phrase in naam_phrases:
            phrase_text = []
            for child in naam_phrase.children:
                if isinstance(child, TerminalNode):
                    token_text = child.getText()
                    # Skip articles
                    if token_text.lower() not in ['de', 'het', 'een']:
                        phrase_text.append(token_text)
                elif hasattr(child, 'getText'):
                    # Get text from non-terminal nodes
                    text = child.getText()
                    if text.lower() not in ['de', 'het', 'een']:
                        phrase_text.append(text)

            if phrase_text:
                parts.append(' '.join(phrase_text))

        # For navigation patterns with "van", we need to reverse the order
        # "passagiers van de reis" -> ["reis", "passagiers"]
        if len(parts) >= 2:
            # Check if there's a "van" preposition indicating navigation
            has_van = False
            for i in range(ctx.getChildCount()):
                child = ctx.getChild(i)
                if isinstance(child, TerminalNode) and child.getText() == 'van':
                    has_van = True
                    break

            if has_van:
                # Reverse for Dutch navigation pattern
                parts.reverse()

        return parts if len(parts) > 1 else [' '.join(parts)] if parts else []

    def visitBasisOnderwerpToString(self, ctx: AntlrParser.BasisOnderwerpContext) -> str:
        """Extracts a string representation from basisOnderwerp."""
        # Check for possessive pronoun "zijn" - preserve it in the path
        # This fixes navigation through relationships like "zijn reis"
        # Note: Grammar only allows ZIJN as possessive, not HAAR or HUN
        if ctx.ZIJN():
            # Possessive "zijn" (his/its)
            # Get the following identifier
            if ctx.identifierOrKeyword():
                identifiers = [id_token.getText() for id_token in ctx.identifierOrKeyword()]
                text = " ".join(identifiers)
                # Prepend the possessive to preserve it
                result = f"zijn {text}"
                logger.debug(f"visitBasisOnderwerpToString: possessive ZIJN with '{text}', returning '{result}'")
                return result
            else:
                # Just the possessive alone
                return "zijn"
        elif ctx.HIJ():
            return "self" # Represent pronoun as 'self' or similar context key
        elif ctx.identifierOrKeyword():
            # Combine identifierOrKeyword tokens
            identifiers = [id_token.getText() for id_token in ctx.identifierOrKeyword()]
            text = " ".join(identifiers)

            # DEBUG: Add temporary debug logging
            logger.debug(f"visitBasisOnderwerpToString: identifiers={identifiers}, text='{text}'")

            # If contains "van", only return first part
            # This handles cases where grammar groups "de burgemeester van de hoofdstad" as one basisOnderwerp
            if " van " in text:
                result = text.split(" van ")[0].strip()
                logger.debug(f"visitBasisOnderwerpToString: split on 'van', returning '{result}'")
                return result

            logger.debug(f"visitBasisOnderwerpToString: returning '{text}'")
            return text
        return "<unknown_basis_onderwerp>"

    # 5. Reference Construction Methods
    def visitAttribuutReferentie(self, ctx: AntlrParser.AttribuutReferentieContext) -> Optional[Expression]:
        """Visit an attribute reference and build an AttributeReference or DimensionedAttributeReference object."""
        # Get the attribute part - this may be truncated if navigation was detected
        attribute_part = self.visitAttribuutMetLidwoord(ctx.attribuutMetLidwoord())

        # Check if this is actually a known parameter
        # First try the full attribute_part
        if attribute_part and attribute_part in self.parameter_names:
            logger.debug(f"visitAttribuutReferentie: '{attribute_part}' is a known parameter, creating ParameterReference")
            return ParameterReference(parameter_name=attribute_part, span=self.get_span(ctx))

        # Get the full raw text to check what was truncated
        raw_attribute_text = None
        extracted_nav_parts = []
        if ctx.attribuutMetLidwoord() and ctx.attribuutMetLidwoord().naamwoordNoIs():
            # Get the full context text WITH SPACES to see what was there originally
            full_text = get_text_with_spaces(ctx.attribuutMetLidwoord().naamwoordNoIs())
            raw_attribute_text = self.visitNaamwoordNoIs(ctx.attribuutMetLidwoord().naamwoordNoIs())

            # Check if something was truncated by comparing lengths and content
            if raw_attribute_text and full_text and " van " in full_text:
                logger.debug(f"Checking for truncated navigation: full_text='{full_text}', raw_attribute_text='{raw_attribute_text}'")

                # If the raw_attribute_text is shorter or doesn't contain all the "van" parts, something was truncated
                full_parts = full_text.split(" van ")

                # Find where raw_attribute_text ends in the full text
                # The attribute might be just the first part before "van"
                if raw_attribute_text in full_parts[0]:
                    # The attribute is just the first part, everything after first "van" is navigation
                    for i in range(1, len(full_parts)):
                        part = full_parts[i].strip()
                        # Remove articles and extract the navigation element
                        words = part.split()
                        nav_words = []
                        for word in words:
                            if word.lower() not in ['de', 'het', 'een']:
                                nav_words.append(word)
                        if nav_words:
                            extracted_nav_parts.append(' '.join(nav_words))
                            logger.debug(f"  Extracted navigation part: '{' '.join(nav_words)}'")

                logger.debug(f"  Final extracted_nav_parts={extracted_nav_parts}")
        
        # Check if the raw attribute contains nested path info that was split off
        # BUT first check if this is a known compound attribute name that should NOT be split
        prepositional_dimension = None
        additional_path_elements = []
        
        # Check if this attribute exists in the domain model as a compound name
        # Look for attributes that contain "van" or "op" that are defined as single attributes
        is_compound_attribute = False
        if raw_attribute_text and (" van " in raw_attribute_text or " op " in raw_attribute_text or " bij " in raw_attribute_text):
            # Check if this compound name exists as an attribute in any object type
            if hasattr(self, 'domain_model') and self.domain_model:
                for obj_type in self.domain_model.objecttypes.values():
                    if raw_attribute_text in obj_type.attributen:
                        is_compound_attribute = True
                        # Use the full raw_attribute_text as the attribute name
                        attribute_part = raw_attribute_text
                        break
        
        # Handle dimension extraction for attributes containing "van" pattern
        # This applies to both cases: when attribute_part has been modified or when it hasn't
        if not is_compound_attribute and attribute_part and " van " in attribute_part:
            # Split the attribute_part itself to extract dimension labels
            parts = attribute_part.split(" van ")
            if len(parts) > 1:
                # Check if parts after "van" contain dimension keywords
                dimension_keywords = ["jaar", "maand", "dag", "kwartaal", "periode", "vorig", "huidig", "volgend"]
                # Navigation indicators - these suggest "van" starts a navigation path, not part of attribute
                navigation_indicators = ["alle", "de", "het", "een", "zijn", "haar", "hun"]

                # Find the rightmost "van" that starts a navigation pattern
                nav_start_idx = -1
                for i in range(len(parts) - 1, 0, -1):
                    part_strip = parts[i].strip()
                    if not part_strip:
                        continue
                    part_words = part_strip.split()
                    if part_words:
                        first_word = part_words[0].lower()
                        # Check for dimension pattern
                        if any(keyword in part_strip.lower() for keyword in dimension_keywords):
                            # This is a dimension, not navigation
                            if i == 1 and nav_start_idx == -1:
                                # Only "van" after the attribute, this is a dimension
                                prepositional_dimension = part_strip
                                attribute_part = parts[0].strip()
                                # Any remaining parts after dimension are navigation
                                if len(parts) > 2:
                                    nav_parts = parts[2:]
                                    additional_path_elements = list(reversed([p.strip() for p in nav_parts]))
                                break
                        elif first_word in navigation_indicators:
                            # Found navigation start
                            nav_start_idx = i
                            # Keep looking - we want the rightmost navigation indicator

                if nav_start_idx > 0:
                    # Everything before this "van" is the attribute name
                    attribute_part = " van ".join(parts[:nav_start_idx])
                    nav_parts = parts[nav_start_idx:]
                    additional_path_elements = list(reversed([p.strip() for p in nav_parts]))
                elif prepositional_dimension:
                    # Already handled in the dimension check above
                    pass
                else:
                    # No clear navigation indicators found
                    # Check if the first part after "van" looks like an object reference
                    first_part = parts[1].strip() if len(parts) > 1 else ""
                    # If it's a capitalized word (likely object type), treat as navigation
                    if first_part and first_part[0].isupper():
                        attribute_part = parts[0].strip()
                        nav_parts = [part.strip() for part in parts[1:]]
                        additional_path_elements = list(reversed(nav_parts))
                    else:
                        # Keep the whole thing as attribute name
                        pass

        # Also handle case where raw_attribute_text differs from attribute_part
        elif not is_compound_attribute and raw_attribute_text and " van " in raw_attribute_text and raw_attribute_text != attribute_part:
            # This handles nested navigation patterns that were stripped from attribute_part
            parts = raw_attribute_text.split(" van ")
            if len(parts) > 1:
                dimension_keywords = ["jaar", "maand", "dag", "kwartaal", "periode", "vorig", "huidig", "volgend"]
                remaining_parts = parts[1:]

                nav_parts = []
                for part in remaining_parts:
                    part = part.strip()
                    if any(keyword in part.lower() for keyword in dimension_keywords):
                        # This is a dimension
                        if not prepositional_dimension:  # Only set if not already found
                            prepositional_dimension = part
                    else:
                        # This is part of the navigation path
                        nav_parts.append(part)

                # For Dutch navigation, reverse the order
                additional_path_elements = list(reversed(nav_parts))
        
        # Check if the onderwerpReferentie has a predicaat that should filter the result
        onderwerp_ctx = ctx.onderwerpReferentie()
        has_predicaat = onderwerp_ctx and (onderwerp_ctx.DIE() or onderwerp_ctx.DAT()) and onderwerp_ctx.predicaat()

        # Recursively build the path from the nested onderwerpReferentie
        base_path = self.visitOnderwerpReferentieToPath(onderwerp_ctx)
        if not base_path:
             logger.error(f"Could not parse base path for attribute reference: {safe_get_text(ctx)}")
             return None

        # Add any navigation parts that were extracted from the truncated attribute
        if extracted_nav_parts:
            # The extracted parts are in left-to-right order from the text
            # But Dutch navigation is right-to-left, so reverse them
            reversed_extracted = list(reversed(extracted_nav_parts))
            additional_path_elements = reversed_extracted + (additional_path_elements or [])
        
        # WORKAROUND for grammar bug in binary expressions:
        # When parsing the right operand of a binary expression, ANTLR sometimes
        # incorrectly splits "de Natuurlijk persoon" into just ["Natuurlijk"]
        # Fix this by checking if we have an incomplete object type name
        if len(base_path) > 0 and base_path[-1].lower() == "natuurlijk":
            # This is likely the incomplete "Natuurlijk persoon" issue
            # Since the onderwerp context is already split, check the parent context
            full_text = safe_get_text(ctx)  # Get the full attribute reference context
            logger.debug(f"  WORKAROUND CHECK: base_path={base_path}, full_text='{full_text}'")
            if "natuurlijk persoon" in full_text.lower():
                logger.debug(f"  WORKAROUND: Correcting incomplete 'Natuurlijk' to 'Natuurlijk persoon' in path {base_path}")
                base_path[-1] = "Natuurlijk persoon"
        
        logger.debug(f"visitAttribuutReferentie: attribute_part='{attribute_part}', raw_base_path={base_path}, prepositional_dimension='{prepositional_dimension}'")
        
        # Now we need to analyze the attribute part and base path to extract dimension labels
        # For dimensioned attributes, the pattern is:
        # "bruto inkomen" where "bruto" is adjectival dimension label
        # And base_path might start with dimension label like ["huidig jaar", "Natuurlijk persoon"]
        
        dimension_labels = []
        actual_attribute_name = attribute_part
        
        # First, check if we found a prepositional dimension in the attribute itself
        if prepositional_dimension:
            dimension_labels.append(DimensionLabel(
                dimension_name="",  # Will be resolved in engine
                label=prepositional_dimension,
                span=self.get_span(ctx)
            ))
        
        # Check if attribute_part contains multiple words (possible adjectival dimension)
        # Only treat as dimensioned if we have dimension keywords
        attr_words = attribute_part.split()
        if len(attr_words) > 1:
            # Check if first word is actually a known dimension label
            # Common dimension labels based on specification examples
            known_dimension_labels = ["bruto", "netto", "vorig", "huidig", "volgend"]
            potential_label = attr_words[0].lower()
            
            # Only create dimension label if it's a known dimension keyword
            if potential_label in known_dimension_labels:
                dimension_labels.append(DimensionLabel(
                    dimension_name="",  # Will be resolved in engine
                    label=attr_words[0],  # Use original case
                    span=self.get_span(ctx)
                ))
                actual_attribute_name = " ".join(attr_words[1:])
            # Otherwise, keep the full attribute name intact
            # Multi-word attributes like "totaal te betalen belasting" are NOT dimensioned
        
        # Special handling for complex dimension patterns
        # The onderwerpReferentie might contain "huidig jaar van een Natuurlijk persoon"
        # which gets parsed as a single naamwoord due to grammar rules
        processed_path = []
        dimension_found = False
        
        for i, path_elem in enumerate(base_path):
            # Check if this element contains dimension patterns
            if " van " in path_elem and not dimension_found:
                # Split on " van " to separate potential dimension from object reference
                parts = path_elem.split(" van ")
                
                # Check each part for dimension keywords
                dimension_keywords = ["jaar", "maand", "dag", "kwartaal", "periode", "vorig", "huidig", "volgend"]
                dimension_part = None
                remaining_parts = []
                
                for j, part in enumerate(parts):
                    part = part.strip()
                    if any(keyword in part.lower() for keyword in dimension_keywords) and not dimension_found:
                        # This part is likely a dimension label
                        dimension_labels.append(DimensionLabel(
                            dimension_name="",  # Will be resolved in engine
                            label=part,
                            span=self.get_span(ctx)
                        ))
                        dimension_found = True
                    else:
                        # This part is likely an object reference
                        # Remove common articles
                        if part.startswith(("een ", "de ", "het ")):
                            part = part[4:].strip() if part.startswith("een ") else part[3:].strip()
                        if part:  # Only add non-empty parts
                            remaining_parts.append(part)
                
                # Add remaining parts to processed path
                processed_path.extend(remaining_parts)
            else:
                # No dimension pattern detected, keep as is
                processed_path.append(path_elem)
        
        # If we didn't find dimensions but base_path starts with dimension keywords, check again
        if not dimension_found and len(base_path) >= 1:
            first_elem = base_path[0]
            dimension_keywords = ["jaar", "maand", "dag", "kwartaal", "periode", "vorig", "huidig", "volgend"]
            if any(keyword in first_elem.lower() for keyword in dimension_keywords):
                dimension_labels.append(DimensionLabel(
                    dimension_name="",  # Will be resolved in engine
                    label=first_elem,
                    span=self.get_span(ctx)
                ))
                processed_path = base_path[1:] if len(base_path) > 1 else []
        
        # Use processed path if we found dimensions, otherwise use original
        final_base_path = processed_path if dimension_found or not base_path else base_path
        
        # Check if the onderwerpReferentie is an object type specification (not navigation)
        is_object_type_spec = self._is_object_type_specification(ctx.onderwerpReferentie())
        
        
        # Build the full path
        if is_compound_attribute:
            # Compound attribute - the attribute name is complete, no navigation needed
            # But we still need to include the object type for target type deduction
            # Example: "belasting op basis van afstand van een passagier" → ['passagier', 'belasting op basis van afstand']
            if is_object_type_spec and final_base_path:
                full_path = final_base_path + [actual_attribute_name]
            else:
                full_path = [actual_attribute_name]
        elif is_object_type_spec:
            # Object type specification - include both attribute and object type
            # Example: "Het inkomen van een Natuurlijk persoon" → ['Natuurlijk persoon', 'inkomen']
            # Example with nested navigation: "De postcode van het woonadres van een persoon" → ['persoon', 'woonadres', 'postcode']
            # This allows the engine to resolve role names via FeitType
            full_path = final_base_path + additional_path_elements + [actual_attribute_name]
        elif final_base_path or additional_path_elements:
            # Navigation case: use Dutch right-to-left order per specification
            # Example: "De naam van de eigenaar van het gebouw" → ['gebouw', 'eigenaar', 'naam']
            # Example: "de naam van de burgemeester van de hoofdstad" → ['hoofdstad', 'burgemeester', 'naam']
            full_path = final_base_path + additional_path_elements + [actual_attribute_name]
        else:
            # Simple attribute without navigation
            # Example: "De leeftijd" → ['leeftijd']
            full_path = [actual_attribute_name]
        
        
        # Create the base attribute reference
        base_attr_ref = AttributeReference(path=full_path, span=self.get_span(ctx))

        # If the onderwerpReferentie has a predicaat, create a Subselectie
        # This handles cases like "passagiers van de reis die minderjarig zijn"
        if has_predicaat:
            predicaat = self.visitPredicaat(onderwerp_ctx.predicaat())
            if predicaat:
                # The predicaat should apply to the collection of passagiers, not just the reis
                # So we create a Subselectie with the full attribute reference
                logger.debug(f"Creating Subselectie for attribute with predicaat: {full_path}")
                base_attr_ref = Subselectie(
                    onderwerp=base_attr_ref,
                    predicaat=predicaat,
                    span=self.get_span(ctx)
                )

        # If we have dimension labels, create a DimensionedAttributeReference
        if dimension_labels:
            logger.debug(f"visitAttribuutReferentie: Creating DimensionedAttributeReference with labels={[l.label for l in dimension_labels]}")
            return DimensionedAttributeReference(
                base_attribute=base_attr_ref,
                dimension_labels=dimension_labels,
                span=self.get_span(ctx)
            )
        else:
            logger.debug(f"visitAttribuutReferentie: attribute_name='{actual_attribute_name}', base_path={base_path}, full_path={full_path}")
            return base_attr_ref
    
    def visitAttribuutMetLidwoord(self, ctx: AntlrParser.AttribuutMetLidwoordContext) -> str:
        """Extract the attribute name from attribuutMetLidwoord context."""
        logger.debug(f"visitAttribuutMetLidwoord called with: {safe_get_text(ctx)}")
        # Now that attribuutMetLidwoord uses naamwoordNoIs, delegate to it
        if ctx.naamwoordNoIs():
            # Get the full text via visitNaamwoordNoIs which already strips articles
            result = self.visitNaamwoordNoIs(ctx.naamwoordNoIs())
            # Return the full attribute name without splitting on "van"
            # Attribute names like "belasting op basis van afstand" should be kept intact
            return result
        # Fallback to full text if no naamwoordNoIs (shouldn't happen with new grammar)
        return get_text_with_spaces(ctx)

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

    def visitOnderwerpReferentieToPath(self, ctx: AntlrParser.OnderwerpReferentieContext) -> List[str]:
        """Helper to convert onderwerpReferentie into a path list for AttributeReference.
        
        This method was refactored to handle the visitor refactoring where
        visitOnderwerpReferentie returns an Expression instead of a path.
        """
        if not ctx:
            return []
        
        # With the new grammar structure, we need to get the onderwerpBasis first
        onderwerp_basis_ctx = ctx.onderwerpBasis()
        if onderwerp_basis_ctx:
            return self.visitOnderwerpBasisToPath(onderwerp_basis_ctx)
        
        return []

    def visitNumberLiteralExpr(self, ctx: AntlrParser.NumberLiteralExprContext) -> Optional[Expression]:
        """Visit NumberLiteralExpr labeled alternative in primaryExpression."""
        logger.debug(f"visitNumberLiteralExpr called: {safe_get_text(ctx)}")
        num_text = ctx.NUMBER().getText().replace(',', '.')
        try:
            value = float(num_text) if '.' in num_text or 'e' in num_text or 'E' in num_text else int(num_text)
            
            # Check if there's a unit
            unit = None
            if ctx.unitIdentifier():
                unit = ctx.unitIdentifier().getText()
                logger.debug(f"  Found unit in visitNumberLiteralExpr: '{unit}'")
            
            result = Literal(value=value, datatype="Numeriek", eenheid=unit, span=self.get_span(ctx))
            logger.debug(f"  Returning from visitNumberLiteralExpr: {result}")
            return result
        except ValueError:
            logger.error(f"Invalid numeric literal: {ctx.NUMBER().getText()} in {safe_get_text(ctx)}")
            return None

    def visitOnderwerpRefExpr(self, ctx: AntlrParser.OnderwerpRefExprContext) -> Optional[Expression]:
        """Visit OnderwerpRefExpr labeled alternative in primaryExpression.
        
        This is called when an onderwerpReferentie appears as a primary expression.
        We need to check if it's actually a parameter reference.
        """
        logger.debug(f"visitOnderwerpRefExpr called: {safe_get_text(ctx)}")
        onderwerp_ref = ctx.onderwerpReferentie()
        
        # First check if the full text matches a parameter name
        # This handles cases where parameter names contain prepositions that get split
        # We need to reconstruct the text properly from the input stream
        start_token = onderwerp_ref.start
        stop_token = onderwerp_ref.stop
        if start_token and stop_token:
            # Get the input stream from the token source
            input_stream = start_token.getTokenSource().inputStream
            # Get text from the input stream between start and stop positions
            start_idx = start_token.start
            stop_idx = stop_token.stop
            full_text_with_spaces = input_stream.getText(start_idx, stop_idx)
            canonical_name = self._extract_canonical_name_from_text(full_text_with_spaces)
            logger.debug(f"  Checking reconstructed text '{full_text_with_spaces}' -> canonical '{canonical_name}' against parameter names")
            if canonical_name in self.parameter_names:
                logger.debug(f"  Recognized as parameter: '{canonical_name}'")
                return ParameterReference(parameter_name=canonical_name, span=self.get_span(ctx))
        
        # Build path from onderwerp reference parts
        path = self.visitOnderwerpReferentieToPath(onderwerp_ref)
        logger.debug(f"  Built path in visitOnderwerpRefExpr: {path}")
        
        # Check if this is a single-element path that might be a parameter
        if len(path) == 1:
            # Extract canonical name (without article) to check against parameter names
            canonical_name = self._extract_canonical_name_from_text(path[0])
            logger.debug(f"  Checking if '{canonical_name}' (from '{path[0]}') is a parameter")
            if canonical_name in self.parameter_names:
                logger.debug(f"  Recognized as parameter: '{canonical_name}'")
                return ParameterReference(parameter_name=canonical_name, span=self.get_span(ctx))
        
        # Otherwise treat as attribute reference
        result = AttributeReference(path=path, span=self.get_span(ctx))
        logger.debug(f"  Returning from visitOnderwerpRefExpr: {result}")
        return result

    def visitOnderwerpReferentie(self, ctx: AntlrParser.OnderwerpReferentieContext) -> Optional[Expression]:
        """Visit onderwerp referentie and convert to AttributeReference or Subselectie.
        
        This handles references like "hij", "de persoon", "het adres van de persoon", 
        as well as filtered collections like "passagiers die minderjarig zijn".
        """
        # First get the base onderwerp from onderwerpBasis
        onderwerp_basis_ctx = ctx.onderwerpBasis()
        if not onderwerp_basis_ctx:
            logger.warning(f"No onderwerpBasis in onderwerpReferentie: {safe_get_text(ctx)}")
            return None
            
        # Build the base AttributeReference from onderwerpBasis
        path = self.visitOnderwerpBasisToPath(onderwerp_basis_ctx)
        
        if not path:
            logger.warning(f"Empty path from onderwerp basis: {safe_get_text(onderwerp_basis_ctx)}")
            return None
        
        # Create the base AttributeReference
        base_ref = AttributeReference(path=path, span=self.get_span(onderwerp_basis_ctx))
        
        # Check if there's a predicaat (DIE/DAT followed by predicaat)
        if ctx.DIE() or ctx.DAT():
            predicaat_ctx = ctx.predicaat()
            if predicaat_ctx:
                predicaat = self.visitPredicaat(predicaat_ctx)
                if predicaat:
                    # Create Subselectie with the base reference and predicaat
                    return Subselectie(
                        onderwerp=base_ref,
                        predicaat=predicaat,
                        span=self.get_span(ctx)
                    )
                else:
                    logger.warning(f"Failed to parse predicaat in subselectie: {safe_get_text(predicaat_ctx)}")
        
        # No predicaat, just return the base reference
        return base_ref
    
    def visitOnderwerpBasisToPath(self, ctx: AntlrParser.OnderwerpBasisContext) -> List[str]:
        """Convert onderwerp basis to a path list."""
        if not ctx:
            return []
        
        # Build path from basisOnderwerp elements
        path = []
        
        # Process all basisOnderwerp elements in the onderwerpBasis
        basis_onderwerpen = ctx.basisOnderwerp()
        if not isinstance(basis_onderwerpen, list):
            basis_onderwerpen = [basis_onderwerpen] if basis_onderwerpen else []
        
        logger.debug(f"visitOnderwerpBasisToPath: found {len(basis_onderwerpen)} basisOnderwerp elements")
        
        # Extract text from each basisOnderwerp
        for i, basis_ctx in enumerate(basis_onderwerpen):
            path_part = self.visitBasisOnderwerpToString(basis_ctx)
            logger.debug(f"  basisOnderwerp[{i}]: '{path_part}'")
            if path_part:
                # Don't exclude role names here - they might be part of object type specs
                # The decision to treat as object type spec is made in _is_object_type_specification
                path.append(path_part)
        
        logger.debug(f"visitOnderwerpBasisToPath final path: {path}")
        return path
    
    def _is_object_type_specification(self, ctx: AntlrParser.OnderwerpReferentieContext) -> bool:
        """Determine if an onderwerpReferentie is an object type specification vs navigation.
        
        Object type specification patterns:
        - "van een X" (indefinite article)
        - "van Natuurlijk persoon" (capitalized type name)
        
        Navigation patterns:
        - "van de X" (definite article)
        - "van het X" (definite article)
        - "van zijn X" (possessive)
        """
        if not ctx or not ctx.onderwerpBasis():
            return False
        
        # Get the first basisOnderwerp to check the article
        basis_onderwerpen = ctx.onderwerpBasis().basisOnderwerp()
        if not basis_onderwerpen:
            return False
        
        first_basis = basis_onderwerpen[0] if isinstance(basis_onderwerpen, list) else basis_onderwerpen
        
        # Check for indefinite article "een"
        if first_basis.EEN():
            logger.debug("Found indefinite article 'een' - treating as object type specification")
            return True
        
        # Check for definite articles "de" or "het"
        if first_basis.DE() or first_basis.HET():
            logger.debug("Found definite article 'de/het' - treating as navigation")
            return False
        
        # Check for possessive "zijn"
        if first_basis.ZIJN():
            logger.debug("Found possessive 'zijn' - treating as navigation")
            return False
        
        # No article - check if it's a capitalized type name
        if first_basis.identifierOrKeyword():
            first_word = first_basis.identifierOrKeyword()[0].getText()
            if first_word and first_word[0].isupper():
                logger.debug(f"Found capitalized name '{first_word}' - treating as object type specification")
                return True
        
        # Default to navigation
        return False
    
    def _is_role_name(self, text: str) -> bool:
        """Check if text matches a known role name from FeitTypes.
        
        Common role patterns:
        - "te verdelen contingent treinmiles"
        - "passagier met recht op treinmiles"
        - Similar multi-word role names
        """
        # Common role name patterns from the specification
        known_role_patterns = [
            "te verdelen contingent treinmiles",
            "passagier met recht op treinmiles",
            "reis met treinmiles",
            "vastgestelde contingent treinmiles"
        ]
        
        # Check if the text matches any known role pattern
        text_lower = text.lower()
        for pattern in known_role_patterns:
            if pattern in text_lower:
                return True
        
        # Additional heuristic: role names often contain "met" or participles like "te"
        if " met " in text_lower or text_lower.startswith("te "):
            return True
        
        return False
    
    # --- Predicaat Visitors ---
    
    def visitPredicaat(self, ctx: AntlrParser.PredicaatContext) -> Optional[Predicaat]:
        """Dispatch to specific predicaat type."""
        if ctx.elementairPredicaat():
            return self.visitElementairPredicaat(ctx.elementairPredicaat())
        elif ctx.samengesteldPredicaat():
            return self.visitSamengesteldPredicaat(ctx.samengesteldPredicaat())
        else:
            logger.warning(f"Unsupported predicaat type: {safe_get_text(ctx)}")
            return None
    
    def visitElementairPredicaat(self, ctx: AntlrParser.ElementairPredicaatContext) -> Optional[Predicaat]:
        """Visit elementair predicaat and dispatch to specific type."""
        if ctx.objectPredicaat():
            return self.visitObjectPredicaat(ctx.objectPredicaat())
        elif ctx.attribuutVergelijkingsPredicaat():
            return self.visitAttribuutVergelijkingsPredicaat(ctx.attribuutVergelijkingsPredicaat())
        elif ctx.getalPredicaat():
            return self.visitGetalPredicaat(ctx.getalPredicaat())
        elif ctx.tekstPredicaat():
            return self.visitTekstPredicaat(ctx.tekstPredicaat())
        elif ctx.datumPredicaat():
            return self.visitDatumPredicaat(ctx.datumPredicaat())
        else:
            logger.warning(f"Unknown elementair predicaat type: {safe_get_text(ctx)}")
            return None
    
    def visitObjectPredicaat(self, ctx: AntlrParser.ObjectPredicaatContext) -> Optional[ObjectPredicaat]:
        """Visit object predicaat for kenmerk/role checks."""
        if ctx.eenzijdigeObjectVergelijking():
            eenzijdig = ctx.eenzijdigeObjectVergelijking()
            heeft_lidwoord = eenzijdig.EEN() is not None
            
            # Get the kenmerk or role name
            if eenzijdig.kenmerkNaam():
                naam = self.visitKenmerkNaam(eenzijdig.kenmerkNaam())
            elif eenzijdig.rolNaam():
                naam = self.visitNaamwoord(eenzijdig.rolNaam())
            else:
                logger.warning("No kenmerk or role name in eenzijdige object vergelijking")
                return None
            
            is_hebben = eenzijdig.HEBBEN() is not None
            
            return ObjectPredicaat(
                naam=naam,
                heeft_lidwoord=heeft_lidwoord,
                is_hebben=is_hebben,
                span=self.get_span(ctx)
            )
        else:
            # Handle tweezijdige if needed
            logger.warning("Tweezijdige object vergelijking not yet implemented")
            return None
    
    def visitAttribuutVergelijkingsPredicaat(self, ctx: AntlrParser.AttribuutVergelijkingsPredicaatContext) -> Optional[VergelijkingsPredicaat]:
        """Visit attribute comparison predicate.
        Example: 'een leeftijd hebben kleiner dan 18'
        """
        # Get attribute name
        attribuut_naam = self.visitNaamwoord(ctx.attribuutNaam)
        if not attribuut_naam:
            logger.error("No attribute name in attribuutVergelijkingsPredicaat")
            return None
        
        # Create AttributeReference for the attribute
        # The attribuut field will be resolved during evaluation to use the current instance
        attribuut_ref = AttributeReference(
            path=[attribuut_naam],
            span=self.get_span(ctx.attribuutNaam)
        )
        
        # Get comparison operator
        comp_op = ctx.comparisonOperator()
        if not comp_op:
            logger.error("No comparison operator in attribuutVergelijkingsPredicaat")
            return None
        
        # Extract the operator token from the comparisonOperator context
        if comp_op.getChildCount() == 1:
            op_node = comp_op.getChild(0)
            if isinstance(op_node, TerminalNode):
                op_type = op_node.symbol.type
                operator = OPERATOR_MAP.get(op_type)
                if not operator:
                    logger.error(f"Unknown comparison operator token type: {op_type} (text: '{safe_get_text(op_node)}')")
                    return None
            else:
                logger.error(f"Expected terminal node in comparisonOperator, got {type(op_node)}")
                return None
        else:
            logger.error(f"Unexpected child count in comparisonOperator: {comp_op.getChildCount()}")
            return None
        
        # Get value expression
        waarde = self.visitExpressie(ctx.expressie())
        if not waarde:
            logger.error("No value expression in attribuutVergelijkingsPredicaat")
            return None
        
        # Return VergelijkingsPredicaat (can be used for any datatype)
        return VergelijkingsPredicaat(
            attribuut=attribuut_ref,
            operator=operator,
            waarde=waarde,
            span=self.get_span(ctx)
        )
    
    def visitGetalPredicaat(self, ctx: AntlrParser.GetalPredicaatContext) -> Optional[GetalPredicaat]:
        """Visit numeric comparison predicate."""
        operator = self._map_comparison_operator_meervoud(ctx.getalVergelijkingsOperatorMeervoud())
        if not operator:
            return None
            
        waarde = self.visitExpressie(ctx.getalExpressie())
        if not waarde:
            return None
            
        # Note: attribuut will be inferred from context during evaluation
        return GetalPredicaat(
            attribuut=None,  # To be resolved in engine
            operator=operator,
            waarde=waarde,
            span=self.get_span(ctx)
        )
    
    def visitTekstPredicaat(self, ctx: AntlrParser.TekstPredicaatContext) -> Optional[TekstPredicaat]:
        """Visit text comparison predicate."""
        operator = self._map_comparison_operator_meervoud(ctx.tekstVergelijkingsOperatorMeervoud())
        if not operator:
            return None
            
        waarde = self.visitExpressie(ctx.tekstExpressie())
        if not waarde:
            return None
            
        return TekstPredicaat(
            attribuut=None,  # To be resolved in engine
            operator=operator,
            waarde=waarde,
            span=self.get_span(ctx)
        )
    
    def visitDatumPredicaat(self, ctx: AntlrParser.DatumPredicaatContext) -> Optional[DatumPredicaat]:
        """Visit date comparison predicate."""
        operator = self._map_comparison_operator_meervoud(ctx.datumVergelijkingsOperatorMeervoud())
        if not operator:
            return None
            
        waarde = self.visitExpressie(ctx.datumExpressie())
        if not waarde:
            return None
            
        return DatumPredicaat(
            attribuut=None,  # To be resolved in engine
            operator=operator,
            waarde=waarde,
            span=self.get_span(ctx)
        )
    
    def visitSamengesteldPredicaat(self, ctx: AntlrParser.SamengesteldPredicaatContext) -> Optional[SamengesteldPredicaat]:
        """Visit compound predicate with quantifier."""
        kwantificatie = self.visitVoorwaardeKwantificatie(ctx.voorwaardeKwantificatie())
        if not kwantificatie:
            return None
            
        voorwaarden = []
        for onderdeel_ctx in ctx.samengesteldeVoorwaardeOnderdeelInPredicaat():
            voorwaarde = self.visitSamengesteldeVoorwaardeOnderdeelInPredicaat(onderdeel_ctx)
            if voorwaarde:
                voorwaarden.append(voorwaarde)
        
        if not voorwaarden:
            logger.warning(f"Samengesteld predicaat has no valid conditions: {safe_get_text(ctx)}")
            return None
            
        return SamengesteldPredicaat(
            kwantificatie=kwantificatie,
            voorwaarden=voorwaarden,
            span=self.get_span(ctx)
        )
    
    def visitSamengesteldeVoorwaardeOnderdeelInPredicaat(self, ctx: AntlrParser.SamengesteldeVoorwaardeOnderdeelInPredicaatContext) -> Optional[GenesteVoorwaardeInPredicaat]:
        """Visit a single condition within compound predicate."""
        # Get bullet level
        niveau = len(ctx.bulletPrefix().getText())
        
        # Visit the condition
        if ctx.elementaireVoorwaardeInPredicaat():
            voorwaarde = self.visitElementaireVoorwaardeInPredicaat(ctx.elementaireVoorwaardeInPredicaat())
        elif ctx.genesteSamengesteldeVoorwaardeInPredicaat():
            voorwaarde = self.visitGenesteSamengesteldeVoorwaardeInPredicaat(ctx.genesteSamengesteldeVoorwaardeInPredicaat())
        else:
            return None
            
        if voorwaarde:
            return GenesteVoorwaardeInPredicaat(
                niveau=niveau,
                voorwaarde=voorwaarde,
                span=self.get_span(ctx)
            )
        
        return None
    
    def visitElementaireVoorwaardeInPredicaat(self, ctx: AntlrParser.ElementaireVoorwaardeInPredicaatContext) -> Optional[VergelijkingInPredicaat]:
        """Visit elementary condition within predicate."""
        return self.visitVergelijkingInPredicaat(ctx.vergelijkingInPredicaat())
    
    def visitVergelijkingInPredicaat(self, ctx: AntlrParser.VergelijkingInPredicaatContext) -> Optional[VergelijkingInPredicaat]:
        """Visit comparison within predicate."""
        if ctx.attribuutReferentie() and ctx.comparisonOperator() and ctx.expressie():
            # Attribute comparison: "zijn leeftijd is groter dan 65"
            attribuut = self.visitAttribuutReferentie(ctx.attribuutReferentie())
            operator = self.visitComparisonOperator(ctx.comparisonOperator())
            waarde = self.visitExpressie(ctx.expressie())
            
            if attribuut and operator and waarde:
                return VergelijkingInPredicaat(
                    type="attribuut_vergelijking",
                    attribuut=attribuut,
                    operator=operator,
                    waarde=waarde,
                    span=self.get_span(ctx)
                )
        
        elif ctx.onderwerpReferentie() and ctx.eenzijdigeObjectVergelijking():
            # Object check: "hij is een passagier"
            onderwerp = self.visitOnderwerpReferentie(ctx.onderwerpReferentie())
            obj_verg = ctx.eenzijdigeObjectVergelijking()
            
            heeft_lidwoord = obj_verg.EEN() is not None
            if obj_verg.kenmerkNaam():
                naam = self.visitKenmerkNaam(obj_verg.kenmerkNaam())
            elif obj_verg.rolNaam():
                naam = self.visitNaamwoord(obj_verg.rolNaam())
            else:
                return None
                
            if onderwerp and naam:
                return VergelijkingInPredicaat(
                    type="object_check",
                    onderwerp=onderwerp,
                    kenmerk_naam=naam,
                    span=self.get_span(ctx)
                )
        
        elif ctx.attribuutReferentie() and ctx.kenmerkNaam():
            # Kenmerk check: "zijn reis is duurzaam"
            attribuut = self.visitAttribuutReferentie(ctx.attribuutReferentie())
            kenmerk = self.visitKenmerkNaam(ctx.kenmerkNaam())
            
            if attribuut and kenmerk:
                return VergelijkingInPredicaat(
                    type="kenmerk_check",
                    attribuut=attribuut,
                    kenmerk_naam=kenmerk,
                    span=self.get_span(ctx)
                )
        
        logger.warning(f"Unknown vergelijking in predicaat pattern: {safe_get_text(ctx)}")
        return None
    
    def visitGenesteSamengesteldeVoorwaardeInPredicaat(self, ctx: AntlrParser.GenesteSamengesteldeVoorwaardeInPredicaatContext) -> Optional[SamengesteldPredicaat]:
        """Visit nested compound condition within predicate."""
        kwantificatie = self.visitVoorwaardeKwantificatie(ctx.voorwaardeKwantificatie())
        if not kwantificatie:
            return None
            
        voorwaarden = []
        for onderdeel_ctx in ctx.samengesteldeVoorwaardeOnderdeelInPredicaat():
            voorwaarde = self.visitSamengesteldeVoorwaardeOnderdeelInPredicaat(onderdeel_ctx)
            if voorwaarde:
                voorwaarden.append(voorwaarde)
        
        if not voorwaarden:
            return None
            
        return SamengesteldPredicaat(
            kwantificatie=kwantificatie,
            voorwaarden=voorwaarden,
            span=self.get_span(ctx)
        )
    
    def visitVoorwaardeKwantificatie(self, ctx: AntlrParser.VoorwaardeKwantificatieContext) -> Optional[Kwantificatie]:
        """Visit quantifier for compound conditions."""
        if ctx.ALLE():
            return Kwantificatie(
                type=KwantificatieType.ALLE,
                span=self.get_span(ctx)
            )
        elif ctx.GEEN_VAN_DE():
            return Kwantificatie(
                type=KwantificatieType.GEEN,
                span=self.get_span(ctx)
            )
        elif ctx.TEN_MINSTE() or ctx.TEN_HOOGSTE() or ctx.PRECIES():
            # Get quantifier type
            if ctx.TEN_MINSTE():
                kwant_type = KwantificatieType.TEN_MINSTE
            elif ctx.TEN_HOOGSTE():
                kwant_type = KwantificatieType.TEN_HOOGSTE
            else:
                kwant_type = KwantificatieType.PRECIES
            
            # Get number
            aantal = None
            if ctx.NUMBER():
                aantal = int(ctx.NUMBER().getText())
            elif ctx.EEN() or ctx.EEN_TELWOORD():
                aantal = 1
            elif ctx.TWEE_TELWOORD():
                aantal = 2
            elif ctx.DRIE_TELWOORD():
                aantal = 3
            elif ctx.VIER_TELWOORD():
                aantal = 4
            
            return Kwantificatie(
                type=kwant_type,
                aantal=aantal,
                span=self.get_span(ctx)
            )
        
        logger.warning(f"Unknown kwantificatie: {safe_get_text(ctx)}")
        return None
    
    def _map_comparison_operator_meervoud(self, ctx) -> Optional[Operator]:
        """Map comparison operator tokens (meervoud form) to Operator enum."""
        if not ctx:
            return None
            
        if ctx.ZIJN_GELIJK_AAN():
            return Operator.GELIJK_AAN
        elif ctx.ZIJN_ONGELIJK_AAN():
            return Operator.NIET_GELIJK_AAN
        elif ctx.ZIJN_GROTER_DAN():
            return Operator.GROTER_DAN
        elif ctx.ZIJN_GROTER_OF_GELIJK_AAN():
            return Operator.GROTER_OF_GELIJK_AAN
        elif ctx.ZIJN_KLEINER_DAN():
            return Operator.KLEINER_DAN
        elif ctx.ZIJN_KLEINER_OF_GELIJK_AAN():
            return Operator.KLEINER_OF_GELIJK_AAN
        elif ctx.ZIJN_LATER_DAN():
            return Operator.GROTER_DAN  # For dates
        elif ctx.ZIJN_LATER_OF_GELIJK_AAN():
            return Operator.GROTER_OF_GELIJK_AAN  # For dates
        elif ctx.ZIJN_EERDER_DAN():
            return Operator.KLEINER_DAN  # For dates
        elif ctx.ZIJN_EERDER_OF_GELIJK_AAN():
            return Operator.KLEINER_OF_GELIJK_AAN  # For dates
        else:
            logger.warning(f"Unknown comparison operator: {safe_get_text(ctx)}")
            return None
    
    # 6. Expression Hierarchy Visitors
    def visitExpressie(self, ctx: AntlrParser.ExpressieContext) -> Optional[Expression]:
        """Visit the top-level expressie rule."""
        # Handle different expression alternatives
        if isinstance(ctx, AntlrParser.SimpleExprContext):
            # Simple expression without begrenzing/afronding
            return self.visitLogicalExpression(ctx.logicalExpression())
            
        elif isinstance(ctx, AntlrParser.ExprAfrondingContext):
            # Expression with afronding
            expr = self.visitLogicalExpression(ctx.logicalExpression())
            if expr is None:
                return None
            
            afronding_ctx = ctx.afronding()
            if afronding_ctx:
                # Extract rounding direction
                direction = None
                if afronding_ctx.NAAR_BENEDEN():
                    direction = "naar_beneden"
                elif afronding_ctx.NAAR_BOVEN():
                    direction = "naar_boven"
                elif afronding_ctx.REKENKUNDIG():
                    direction = "rekenkundig"
                elif afronding_ctx.RICHTING_NUL():
                    direction = "richting_nul"
                elif afronding_ctx.WEG_VAN_NUL():
                    direction = "weg_van_nul"
                
                # Extract decimals
                decimals = int(afronding_ctx.NUMBER().getText()) if afronding_ctx.NUMBER() else 0
                
                from regelspraak.ast import AfrondingExpression
                return AfrondingExpression(
                    expression=expr,
                    direction=direction,
                    decimals=decimals,
                    span=self.get_span(ctx)
                )
            return expr
            
        elif isinstance(ctx, AntlrParser.ExprBegrenzingContext):
            # Expression with begrenzing
            expr = self.visitLogicalExpression(ctx.logicalExpression())
            if expr is None:
                return None
                
            begrenzing_ctx = ctx.begrenzing()
            if begrenzing_ctx:
                minimum = None
                maximum = None
                
                if hasattr(begrenzing_ctx, 'begrenzingMinimum') and begrenzing_ctx.begrenzingMinimum():
                    min_ctx = begrenzing_ctx.begrenzingMinimum()
                    minimum = self.visit(min_ctx.expressie())
                elif hasattr(begrenzing_ctx, 'begrenzingMaximum') and begrenzing_ctx.begrenzingMaximum():
                    max_ctx = begrenzing_ctx.begrenzingMaximum()
                    maximum = self.visit(max_ctx.expressie())
                
                from regelspraak.ast import BegrenzingExpression
                return BegrenzingExpression(
                    expression=expr,
                    minimum=minimum,
                    maximum=maximum,
                    span=self.get_span(ctx)
                )
            return expr
            
        elif isinstance(ctx, AntlrParser.ExprBegrenzingAfrondingContext):
            # Expression with both begrenzing and afronding
            expr = self.visitLogicalExpression(ctx.logicalExpression())
            if expr is None:
                return None
                
            # Handle begrenzing
            minimum = None
            maximum = None
            begrenzing_ctx = ctx.begrenzing()
            if begrenzing_ctx:
                if hasattr(begrenzing_ctx, 'begrenzingMinimum') and begrenzing_ctx.begrenzingMinimum():
                    min_ctx = begrenzing_ctx.begrenzingMinimum()
                    minimum = self.visit(min_ctx.expressie())
                elif hasattr(begrenzing_ctx, 'begrenzingMaximum') and begrenzing_ctx.begrenzingMaximum():
                    max_ctx = begrenzing_ctx.begrenzingMaximum()
                    maximum = self.visit(max_ctx.expressie())
            
            # Handle afronding
            direction = None
            decimals = 0
            afronding_ctx = ctx.afronding()
            if afronding_ctx:
                # Extract rounding direction
                if afronding_ctx.NAAR_BENEDEN():
                    direction = "naar_beneden"
                elif afronding_ctx.NAAR_BOVEN():
                    direction = "naar_boven"
                elif afronding_ctx.REKENKUNDIG():
                    direction = "rekenkundig"
                elif afronding_ctx.RICHTING_NUL():
                    direction = "richting_nul"
                elif afronding_ctx.WEG_VAN_NUL():
                    direction = "weg_van_nul"
                
                # Extract decimals
                decimals = int(afronding_ctx.NUMBER().getText()) if afronding_ctx.NUMBER() else 0
            
            from regelspraak.ast import BegrenzingAfrondingExpression
            return BegrenzingAfrondingExpression(
                expression=expr,
                minimum=minimum,
                maximum=maximum,
                direction=direction,
                decimals=decimals,
                span=self.get_span(ctx)
            )
            
        # Fallback to default handling
        if ctx.logicalExpression():
            return self.visitLogicalExpression(ctx.logicalExpression())
        else:
            # This case should generally not happen if the grammar is well-formed.
            logger.error(f"ExpressieContext has no logicalExpression child: {safe_get_text(ctx)}")
            return None

    def visitSimpleExpressie(self, ctx: AntlrParser.SimpleExpressieContext) -> Optional[Expression]:
        """Visit simpleExpressie rule (expression without logical operators).
        Used in attribute initialization to avoid EN/OF ambiguity."""

        # Handle different alternatives
        if isinstance(ctx, AntlrParser.SimpleExprBaseContext):
            # Simple expression without begrenzing/afronding
            return self.visitComparisonExpression(ctx.comparisonExpression())

        elif isinstance(ctx, AntlrParser.SimpleExprAfrondingContext):
            # Expression with afronding
            expr = self.visitComparisonExpression(ctx.comparisonExpression())
            if expr is None:
                return None

            afronding_ctx = ctx.afronding()
            if afronding_ctx:
                # Extract rounding direction
                direction = None
                if afronding_ctx.NAAR_BENEDEN():
                    direction = "naar_beneden"
                elif afronding_ctx.NAAR_BOVEN():
                    direction = "naar_boven"
                elif afronding_ctx.REKENKUNDIG():
                    direction = "rekenkundig"
                elif afronding_ctx.RICHTING_NUL():
                    direction = "richting_nul"
                elif afronding_ctx.WEG_VAN_NUL():
                    direction = "weg_van_nul"

                # Extract decimals
                decimals = int(afronding_ctx.NUMBER().getText()) if afronding_ctx.NUMBER() else 0

                from regelspraak.ast import AfrondingExpression
                return AfrondingExpression(
                    expression=expr,
                    direction=direction,
                    decimals=decimals,
                    span=self.get_span(ctx)
                )
            return expr

        elif isinstance(ctx, AntlrParser.SimpleExprBegrenzingContext):
            # Expression with begrenzing
            expr = self.visitComparisonExpression(ctx.comparisonExpression())
            if expr is None:
                return None

            begrenzing = self._extract_begrenzing(ctx.begrenzing())

            from regelspraak.ast import BegrenzingExpression
            return BegrenzingExpression(
                expression=expr,
                minimum=begrenzing.get('minimum'),
                maximum=begrenzing.get('maximum'),
                span=self.get_span(ctx)
            )

        elif isinstance(ctx, AntlrParser.SimpleExprBegrenzingAfrondingContext):
            # Expression with both begrenzing and afronding
            expr = self.visitComparisonExpression(ctx.comparisonExpression())
            if expr is None:
                return None

            # Handle begrenzing
            begrenzing = self._extract_begrenzing(ctx.begrenzing())

            # Handle afronding
            direction = None
            decimals = 0
            afronding_ctx = ctx.afronding()
            if afronding_ctx:
                # Extract rounding direction
                if afronding_ctx.NAAR_BENEDEN():
                    direction = "naar_beneden"
                elif afronding_ctx.NAAR_BOVEN():
                    direction = "naar_boven"
                elif afronding_ctx.REKENKUNDIG():
                    direction = "rekenkundig"
                elif afronding_ctx.RICHTING_NUL():
                    direction = "richting_nul"
                elif afronding_ctx.WEG_VAN_NUL():
                    direction = "weg_van_nul"

                # Extract decimals
                decimals = int(afronding_ctx.NUMBER().getText()) if afronding_ctx.NUMBER() else 0

            # Create combined expression
            from regelspraak.ast import BegrenzingExpression, AfrondingExpression
            begr_expr = BegrenzingExpression(
                expression=expr,
                minimum=begrenzing.get('minimum'),
                maximum=begrenzing.get('maximum'),
                span=self.get_span(ctx)
            )

            if direction:
                return AfrondingExpression(
                    expression=begr_expr,
                    direction=direction,
                    decimals=decimals,
                    span=self.get_span(ctx)
                )
            return begr_expr

        # Fallback to default handling
        if ctx.comparisonExpression():
            return self.visitComparisonExpression(ctx.comparisonExpression())
        else:
            logger.error(f"SimpleExpressieContext has no comparisonExpression child: {safe_get_text(ctx)}")
            return None

    def visitLiteralValue(self, ctx: AntlrParser.LiteralValueContext) -> Optional[Expression]:
        """Visit literalValue context to extract literal values for concatenation syntax."""
        if ctx.ENUM_LITERAL():
            text = ctx.ENUM_LITERAL().getText()
            # Remove quotes from enum literals
            value = text.strip("'\"") if text else text
            return Literal(value=value, datatype="Enumeratie", span=self.get_span(ctx))
        elif ctx.STRING_LITERAL():
            text = ctx.STRING_LITERAL().getText()
            # Remove quotes
            value = text.strip("'\"") if text else text
            return Literal(value=value, datatype="Tekst", span=self.get_span(ctx))
        elif ctx.NUMBER():
            value = float(ctx.NUMBER().getText())
            unit = None
            if ctx.unitIdentifier():
                unit = safe_get_text(ctx.unitIdentifier())
            return Literal(value=value, datatype="Numeriek", eenheid=unit, span=self.get_span(ctx))
        elif ctx.PERCENTAGE_LITERAL():
            text = ctx.PERCENTAGE_LITERAL().getText()
            percent_value = text[:-1].replace(',', '.')  # Remove % and handle comma
            decimal_value = Decimal(percent_value) / 100
            return Literal(value=float(decimal_value), datatype="Percentage", eenheid="%", span=self.get_span(ctx))
        elif ctx.datumLiteral():
            date_text = safe_get_text(ctx.datumLiteral())
            return Literal(value=date_text, datatype="Datum", span=self.get_span(ctx))
        elif ctx.identifier():
            # For simple identifier references (parameters, constants)
            id_text = ctx.identifier().getText()
            # Check if it's a parameter
            if id_text in self.parameter_names:
                return ParameterReference(parameter_name=id_text, span=self.get_span(ctx))
            else:
                # Treat as a variable reference
                return VariableReference(variable_name=id_text, span=self.get_span(ctx))
        else:
            logger.warning(f"Unknown literalValue type: {safe_get_text(ctx)}")
            return None

    def visitLogicalExpression(self, ctx: AntlrParser.LogicalExpressionContext) -> Optional[Expression]:
        """Visit logical expression. Handles LogicalExpr labeled alternative."""
        # Grammar: logicalExpression: left=comparisonExpression ( op=(EN | OF) right=logicalExpression )? # LogicalExpr
        
        if isinstance(ctx, AntlrParser.LogicalExprContext):
            # Handle the labeled alternative
            left = self.visitComparisonExpression(ctx.left)
            if left is None:
                return None
                
            # Check if there's a logical operator
            if ctx.op:
                op_token = ctx.op
                if op_token.type not in OPERATOR_MAP:
                    logger.warning(f"Unknown logical operator token type: {op_token.type}")
                    return left
                    
                operator = OPERATOR_MAP[op_token.type]
                right = self.visitLogicalExpression(ctx.right)
                
                if right is None:
                    logger.warning(f"Right side of logical expression is None")
                    return left
                    
                return BinaryExpression(
                    left=left,
                    operator=operator,
                    right=right,
                    span=self.get_span(ctx)
                )
            else:
                # No operator, just return the comparison expression
                return left
        else:
            # Fallback for unlabeled alternative (shouldn't happen with new grammar)
            logger.warning(f"Unexpected logicalExpression structure: {safe_get_text(ctx)}")
            if ctx.getChildCount() > 0:
                return self.visit(ctx.getChild(0))
            return None

    def visitComparisonExpression(self, ctx: AntlrParser.ComparisonExpressionContext) -> Optional[Expression]:
        """Visit comparison expression (==, !=, <, >, <=, >=, is, etc.). Handles alternatives."""
        # This rule might have multiple alternatives (# labels in grammar) OR
        # be a chain like `additive op additive op additive`
        # The _build_binary_expression handles the chained case.
        # We need to handle specific labeled alternatives first.

        if isinstance(ctx, AntlrParser.SubordinateClauseExprContext):
            return self.visitSubordinateClauseExpression(ctx.subordinateClauseExpression())
        elif isinstance(ctx, AntlrParser.IsKenmerkExprContext):
            left_expr = self.visitAdditiveExpression(ctx.left)
            # Check for naamwoordWithNumbers first, then fall back to naamwoord
            if hasattr(ctx, 'naamwoordWithNumbers') and ctx.naamwoordWithNumbers():
                kenmerk_name = get_text_with_spaces(ctx.naamwoordWithNumbers())
                kenmerk_name = self._normalize_kenmerk_name(kenmerk_name)
                name_ctx = ctx.naamwoordWithNumbers()
            else:
                kenmerk_name = self.visitNaamwoord(ctx.naamwoord()) if hasattr(self, 'visitNaamwoord') else ctx.naamwoord().getText()
                name_ctx = ctx.naamwoord()
            # Create a Literal with the kenmerk name, not a VariableReference
            right_expr = Literal(value=kenmerk_name, datatype="Tekst", span=self.get_span(name_ctx))
            if left_expr is None: return None
            # For now, just use IS operator. Negation should be handled at a different level
            op = Operator.IS
            return BinaryExpression(left=left_expr, operator=op, right=right_expr, span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.HeeftKenmerkExprContext):
            left_expr = self.visitAdditiveExpression(ctx.left)
            # Check for naamwoordWithNumbers first, then fall back to naamwoord
            if hasattr(ctx, 'naamwoordWithNumbers') and ctx.naamwoordWithNumbers():
                kenmerk_name = get_text_with_spaces(ctx.naamwoordWithNumbers())
                kenmerk_name = self._normalize_kenmerk_name(kenmerk_name)
                name_ctx = ctx.naamwoordWithNumbers()
            else:
                kenmerk_name = self.visitNaamwoord(ctx.naamwoord()) if hasattr(self, 'visitNaamwoord') else ctx.naamwoord().getText()
                name_ctx = ctx.naamwoord()
            # Create a Literal with the kenmerk name, not a VariableReference
            right_expr = Literal(value=kenmerk_name, datatype="Tekst", span=self.get_span(name_ctx))
            if left_expr is None: return None
            # For now, just use HEEFT operator. Negation should be handled at a different level
            op = Operator.HEEFT
            return BinaryExpression(left=left_expr, operator=op, right=right_expr, span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.GelijkIsAanOfExprContext):
            # Handle the special "x gelijk is aan 'A', 'B' of 'C'" pattern per spec §5.6
            # This should expand to: (x gelijk is aan 'A') of (x gelijk is aan 'B') of (x gelijk is aan 'C')
            left_expr = self.visitAdditiveExpression(ctx.left)
            if left_expr is None:
                return None

            # Get the operator - all variants map to GELIJK_AAN
            # The gelijkIsAanOperator rule only includes equality operators
            op = Operator.GELIJK_AAN

            # Collect all literal values
            values = []
            if ctx.firstValue:
                first_val = self.visitLiteralValue(ctx.firstValue)
                if first_val:
                    values.append(first_val)

            if ctx.middleValues:
                for middle_val in ctx.middleValues:
                    val = self.visitLiteralValue(middle_val)
                    if val:
                        values.append(val)

            if ctx.lastValue:
                last_val = self.visitLiteralValue(ctx.lastValue)
                if last_val:
                    values.append(last_val)

            if not values:
                logger.warning(f"No values found in GelijkIsAanOfExpr: {safe_get_text(ctx)}")
                return None

            # Create comparison expressions for each value
            comparisons = []
            for value in values:
                comparisons.append(BinaryExpression(
                    left=left_expr,
                    operator=op,
                    right=value,
                    span=self.get_span(ctx)
                ))

            # Chain them with OR operators
            if len(comparisons) == 1:
                return comparisons[0]
            else:
                # Build a left-associative chain of OR operations
                result = comparisons[0]
                for comp in comparisons[1:]:
                    result = BinaryExpression(
                        left=result,
                        operator=Operator.OF,
                        right=comp,
                        span=self.get_span(ctx)
                    )
                return result
        elif isinstance(ctx, AntlrParser.BinaryComparisonExprContext):
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
        # Check if this is actually a SimpleConcatenatieExpr or ConcatenatieExpr
        # These can appear as children of PowerExpression per the grammar
        if ctx.getChildCount() == 1:
            child = ctx.getChild(0)
            if isinstance(child, AntlrParser.SimpleConcatenatieExprContext):
                return self.visitSimpleConcatenatieExpr(child)
            elif isinstance(child, AntlrParser.ConcatenatieExprContext):
                return self.visitConcatenatieExpr(child)

        # Use the generic binary expression builder helper, specifying the operator rule name
        return self._build_binary_expression(ctx, OPERATOR_MAP, self.visitPrimaryExpression, operator_rule_name='powerOperator')

    def visitPrimaryExpression(self, ctx: AntlrParser.PrimaryExpressionContext) -> Optional[Expression]:
        """Visit a primary expression (literal, reference, function call, parenthesized expr)."""
        # --- Add logging --- 
        logger.debug(f"Visiting PrimaryExpression: Type={type(ctx).__name__}, Text='{safe_get_text(ctx)}'")
        # --- End logging ---

        # --- Handle Labeled Alternatives FIRST ---
        # Handle unary operators
        unary_result = self._handle_unary_operators(ctx)
        if unary_result is not None:
            return unary_result
        
        # --- Handle References ---
        ref_result = self._handle_references(ctx)
        if ref_result is not None:
            return ref_result
        
        # --- Handle Literals ---
        literal_result = self._handle_literals(ctx)
        if literal_result is not None:
            return literal_result
        
        # --- Handle Function Calls ---
        func_result = self._handle_function_calls(ctx)
        if func_result is not None:
            return func_result
        
        # --- Handle Parenthesized Expression ---
        if isinstance(ctx, AntlrParser.ParenExprContext):
            logger.debug("  -> Matched ParenExprContext")
            return self.visitExpressie(ctx.expressie())
        
        # --- Fallback / Deprecated Checks (Should ideally be covered by labels) ---
        # These might catch cases if grammar labels are incomplete or visitor is missing cases
        # Check for parentheses using attribute access (less reliable than label)
        if hasattr(ctx, 'LPAREN') and ctx.LPAREN() and hasattr(ctx, 'RPAREN') and ctx.RPAREN() and hasattr(ctx, 'expressie') and ctx.expressie():
            return self.visitExpressie(ctx.expressie())
        
        # Special case: DateCalcExpr that's not a date calculation
        if isinstance(ctx, AntlrParser.DateCalcExprContext):
            # The grammar matched this as a date calc, but it's not
            # Handle as regular binary expression
            logger.debug(f"  -> Handling DateCalcExprContext as binary expression")
            left_ctx = ctx.primaryExpression(0)
            right_ctx = ctx.primaryExpression(1)
            logger.debug(f"    Left context type: {type(left_ctx).__name__}")
            logger.debug(f"    Right context type: {type(right_ctx).__name__}")
            
            # Check if there's an identifier that might be a unit
            identifier_text = ctx.identifier().getText() if ctx.identifier() else ""
            logger.debug(f"    DateCalcExpr identifier: '{identifier_text}'")
            
            left_expr = self.visit(left_ctx)
            right_expr = self.visit(right_ctx)
            
            # If the right expression is a number literal and we have an identifier that's not a time unit,
            # treat the identifier as the unit for the number
            if right_expr and isinstance(right_expr, Literal) and right_expr.datatype == "Numeriek" and identifier_text:
                time_units = ["dagen", "maanden", "jaren", "weken", "uren", "minuten", "seconden"]
                if identifier_text not in time_units:
                    logger.debug(f"    Treating identifier '{identifier_text}' as unit for number literal")
                    right_expr.eenheid = identifier_text
            
            operator = Operator.PLUS if ctx.PLUS() else Operator.MIN
            logger.debug(f"    Left expr: {left_expr}")
            logger.debug(f"    Right expr: {right_expr}")
            return BinaryExpression(
                left=left_expr,
                operator=operator,
                right=right_expr,
                span=self.get_span(ctx)
            )
        
        # Add other fallback checks if needed, but they are less robust
        logger.warning(f"Unknown or unhandled primary expression type (no specific label matched): {type(ctx).__name__} -> {safe_get_text(ctx)}")
        return None

    def _handle_function_calls(self, ctx) -> Optional[Expression]:
        """Handle all function call contexts from primaryExpression."""
        if isinstance(ctx, AntlrParser.AbsValFuncExprContext):
            # de absolute waarde van (expression)
            expr = self.visitPrimaryExpression(ctx.primaryExpression())
            if expr is None: return None
            return FunctionCall(
                function_name="absolute_waarde_van",
                arguments=[expr],
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.PasenFuncExprContext):
            # de eerste paasdag van (expression)
            expr = self.visitPrimaryExpression(ctx.primaryExpression())
            if expr is None: return None
            return FunctionCall(
                function_name="eerste_paasdag_van",
                arguments=[expr],
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.SomFuncExprContext):
            # SOM_VAN expr1, expr2, ... EN exprN
            args = []
            # Collect all primaryExpression children
            for child in ctx.getChildren():
                if isinstance(child, AntlrParser.PrimaryExpressionContext):
                    expr = self.visitPrimaryExpression(child)
                    if expr:
                        args.append(expr)
            
            if not args:
                return None
                
            return FunctionCall(
                function_name="som_van",
                arguments=args,
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.SomAlleExprContext):
            # SOM_VAN ALLE naamwoord
            collection_name = self._extract_canonical_name(ctx.naamwoord())
            collection_ref = AttributeReference(
                path=[collection_name],
                span=self.get_span(ctx.naamwoord())
            )
            
            return FunctionCall(
                function_name="som_van",
                arguments=[collection_ref],
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.SomAlleAttribuutExprContext):
            # SOM_VAN ALLE attribuutReferentie
            # This handles patterns like "som van alle belasting van passagiers die minderjarig zijn"
            attr_ref = self.visitAttribuutReferentie(ctx.attribuutReferentie())
            if attr_ref is None:
                logger.warning(f"No attribute reference found in som_van function: {safe_get_text(ctx)}")
                return None
                
            return FunctionCall(
                function_name="som_van",
                arguments=[attr_ref],
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.TijdsevenredigDeelExprContext):
            # HET_TIJDSEVENREDIG_DEEL_PER (MAAND | JAAR) VAN expressie conditieBijExpressie?
            expr = self.visitExpressie(ctx.expressie())
            if expr is None: return None
            
            # Determine period type
            period = "maand" if ctx.MAAND() else "jaar"
            
            # Check for conditional expression
            args = [expr]
            if ctx.conditieBijExpressie():
                condition = self.visitConditieBijExpressie(ctx.conditieBijExpressie())
                if condition:
                    args.append(condition)
            
            return FunctionCall(
                function_name=f"tijdsevenredig_deel_per_{period}",
                arguments=args,
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.TijdsduurFuncExprContext):
            # TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?
            from_expr = self.visitPrimaryExpression(ctx.primaryExpression(0))
            to_expr = self.visitPrimaryExpression(ctx.primaryExpression(1))
            if from_expr is None or to_expr is None:
                return None
            
            # Check for unit specification
            unit = None
            if ctx.unitIdentifier():
                unit = safe_get_text(ctx.unitIdentifier())
            
            func_call = FunctionCall(
                function_name="tijdsduur_van",
                arguments=[from_expr, to_expr],
                unit_conversion=unit,
                span=self.get_span(ctx)
            )
            return func_call
            
        elif isinstance(ctx, AntlrParser.AbsTijdsduurFuncExprContext):
            # DE_ABSOLUTE_TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?
            from_expr = self.visitPrimaryExpression(ctx.primaryExpression(0))
            to_expr = self.visitPrimaryExpression(ctx.primaryExpression(1))
            if from_expr is None or to_expr is None:
                return None
            
            # Check for unit specification
            unit = None
            if ctx.unitIdentifier():
                unit = safe_get_text(ctx.unitIdentifier())
            
            func_call = FunctionCall(
                function_name="absolute_tijdsduur_van",
                arguments=[from_expr, to_expr],
                unit_conversion=unit,
                span=self.get_span(ctx)
            )
            return func_call
            
        elif isinstance(ctx, AntlrParser.AantalFuncExprContext):
            # Handles multiple patterns:
            # - HET_AANTAL ALLE naamwoord (e.g., "het aantal alle Iteratie")
            # - HET_AANTAL onderwerpReferentie (e.g., "het aantal de passagiers")
            # - AANTAL ALLE naamwoord
            # - AANTAL onderwerpReferentie

            # First check if the entire expression is a parameter name
            # This handles cases like "het aantal treinmiles per passagier voor contingent"
            full_text = get_text_with_spaces(ctx)
            canonical_name = self._extract_canonical_name_from_text(full_text)

            if canonical_name in self.parameter_names:
                # This is actually a parameter reference, not a function call
                return ParameterReference(parameter_name=canonical_name, span=self.get_span(ctx))

            # Not a parameter - proceed with function call interpretation
            subject_ref = None

            # Check which pattern we have
            if ctx.naamwoord():
                # Pattern: (HET_AANTAL | AANTAL) ALLE naamwoord
                # Create an AttributeReference for the collection
                collection_name = self._extract_canonical_name(ctx.naamwoord())
                subject_ref = AttributeReference(
                    path=[collection_name],
                    span=self.get_span(ctx.naamwoord())
                )
            elif ctx.onderwerpReferentie():
                # Pattern: (HET_AANTAL | AANTAL) onderwerpReferentie
                subject_ref = self.visitOnderwerpReferentie(ctx.onderwerpReferentie())

            if subject_ref is None:
                logger.warning(f"No subject reference found in aantal function: {safe_get_text(ctx)}")
                return None

            return FunctionCall(
                function_name="het_aantal",
                arguments=[subject_ref],
                span=self.get_span(ctx)
            )
            
        elif isinstance(ctx, AntlrParser.AantalAttribuutExprContext):
            # HET? AANTAL attribuutReferentie
            # This handles patterns like "het aantal leden van de groep die minderjarig zijn"
            attr_ref = self.visitAttribuutReferentie(ctx.attribuutReferentie())
            if attr_ref is None:
                logger.warning(f"No attribute reference found in aantal function: {safe_get_text(ctx)}")
                return None
                
            # Build FunctionCall for aantal with attribute reference
            func_call = FunctionCall(
                function_name="het_aantal",
                arguments=[attr_ref],
                span=self.get_span(ctx)
            )
            return func_call
            
        elif isinstance(ctx, AntlrParser.PercentageFuncExprContext) or \
             isinstance(ctx, AntlrParser.PercentageOfExprContext) or \
             isinstance(ctx, AntlrParser.WortelFuncExprContext) or \
             isinstance(ctx, AntlrParser.MinValFuncExprContext) or \
             isinstance(ctx, AntlrParser.MaxValFuncExprContext) or \
             isinstance(ctx, AntlrParser.JaarUitFuncExprContext) or \
             isinstance(ctx, AntlrParser.MaandUitFuncExprContext) or \
             isinstance(ctx, AntlrParser.DagUitFuncExprContext) or \
             isinstance(ctx, AntlrParser.DatumMetFuncExprContext) or \
             isinstance(ctx, AntlrParser.DateCalcExprContext) or \
             isinstance(ctx, AntlrParser.EersteDatumFuncExprContext) or \
             isinstance(ctx, AntlrParser.LaatsteDatumFuncExprContext) or \
             isinstance(ctx, AntlrParser.TotaalVanExprContext) or \
             isinstance(ctx, AntlrParser.HetAantalDagenInExprContext) or \
             isinstance(ctx, AntlrParser.DimensieAggExprContext):
            
            # Handle different aggregation context types
            func_name = None
            
            # Handle percentage function first
            if isinstance(ctx, AntlrParser.PercentageFuncExprContext):
                # Handle percentage calculation: 21% van 1000 EUR
                percentage_value = None
                if ctx.PERCENTAGE_LITERAL():
                    # Parse percentage literal (e.g., "21%")
                    text = ctx.PERCENTAGE_LITERAL().getText()
                    percent_value = text[:-1].replace(',', '.')  # Remove % and handle comma
                    percentage_value = float(percent_value) / 100  # Convert to decimal
                elif ctx.NUMBER():
                    # Parse number with percent sign or identifier
                    num_text = ctx.NUMBER().getText().replace(',', '.')
                    percentage_value = float(num_text) / 100
                
                # Parse the base expression (what the percentage is of)
                base_expr = self.visit(ctx.primaryExpression())
                
                if percentage_value is not None and base_expr:
                    # Create a multiplication expression: percentage * base
                    return BinaryExpression(
                        operator=Operator.MAAL,
                        left=Literal(value=percentage_value, datatype="Numeriek", span=self.get_span(ctx)),
                        right=base_expr,
                        span=self.get_span(ctx)
                    )
                else:
                    logger.warning(f"Could not parse percentage function: {safe_get_text(ctx)}")
                    return None
            
            # Handle percentage-typed expression: param VAN expr
            elif isinstance(ctx, AntlrParser.PercentageOfExprContext):
                # This handles cases where a percentage-typed parameter is used
                # e.g., "het percentage reisduur eerste schijf van zijn belasting op basis van afstand"
                left_expr = self.visit(ctx.primaryExpression(0))  # The percentage expression
                right_expr = self.visit(ctx.primaryExpression(1))  # The base expression
                
                if left_expr and right_expr:
                    # Create: (left_expr / 100) * right_expr
                    # This assumes the left expression evaluates to a percentage value
                    percentage_decimal = BinaryExpression(
                        operator=Operator.GEDEELD_DOOR,
                        left=left_expr,
                        right=Literal(value=100, datatype="Numeriek", span=self.get_span(ctx)),
                        span=self.get_span(ctx)
                    )
                    return BinaryExpression(
                        operator=Operator.MAAL,
                        left=percentage_decimal,
                        right=right_expr,
                        span=self.get_span(ctx)
                    )
                else:
                    logger.warning(f"Could not parse percentage-of expression: {safe_get_text(ctx)}")
                    return None
            
            # Handle specific date function contexts
            elif isinstance(ctx, AntlrParser.DateCalcExprContext):
                # This is a date calculation pattern like "date + 5 days"
                # Grammar: primaryExpression (PLUS | MIN) primaryExpression timeUnit

                left_expr = self.visitPrimaryExpression(ctx.primaryExpression(0))
                right_expr = self.visitPrimaryExpression(ctx.primaryExpression(1))
                operator = Operator.PLUS if ctx.PLUS() else Operator.MIN

                # Get and normalize the time unit
                time_unit_text = ctx.timeUnit().getText() if ctx.timeUnit() else ""
                normalized_unit = self._normalize_time_unit(time_unit_text)

                # Attach the unit to the right expression
                # If it's a literal, create a new literal with unit
                if isinstance(right_expr, Literal):
                    right_expr = Literal(
                        value=right_expr.value,
                        datatype=right_expr.datatype,
                        eenheid=normalized_unit,  # Attach the time unit
                        span=right_expr.span
                    )
                else:
                    # For non-literal expressions, wrap in a function to apply unit
                    # This ensures the Value at runtime has the correct unit
                    right_expr = FunctionCall(
                        function_name="with_unit",
                        arguments=[right_expr],
                        unit_conversion=normalized_unit,
                        span=right_expr.span
                    )

                return BinaryExpression(
                    left=left_expr,
                    operator=operator,
                    right=right_expr,
                    span=self.get_span(ctx)
                )
            elif isinstance(ctx, AntlrParser.EersteDatumFuncExprContext):
                func_name = "eerste_van"
                # Parse arguments - grammar: EERSTE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression
                args = []
                # Visit all children to collect primary expressions
                for i in range(ctx.getChildCount()):
                    child = ctx.getChild(i)
                    # Skip terminals like EERSTE_VAN, COMMA, EN
                    if isinstance(child, AntlrParser.PrimaryExpressionContext):
                        expr = self.visitPrimaryExpression(child)
                        if expr:
                            args.append(expr)
                
                return FunctionCall(
                    function_name=func_name,
                    arguments=args,
                    span=self.get_span(ctx)
                )
            elif isinstance(ctx, AntlrParser.LaatsteDatumFuncExprContext):
                func_name = "laatste_van"
                # Parse arguments - grammar: LAATSTE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression
                args = []
                # Visit all children to collect primary expressions
                for i in range(ctx.getChildCount()):
                    child = ctx.getChild(i)
                    # Skip terminals like LAATSTE_VAN, COMMA, EN
                    if isinstance(child, AntlrParser.PrimaryExpressionContext):
                        expr = self.visitPrimaryExpression(child)
                        if expr:
                            args.append(expr)
                
                return FunctionCall(
                    function_name=func_name,
                    arguments=args,
                    span=self.get_span(ctx)
                )
            elif isinstance(ctx, AntlrParser.TotaalVanExprContext) or isinstance(ctx, AntlrParser.CapitalizedTotaalVanExprContext):
                func_name = "totaal_van"
                # TotaalVan has structure: HET_TOTAAL_VAN expressie (GEDURENDE_DE_TIJD_DAT condition)?
                args = []
                
                # Process the main expression
                if hasattr(ctx, 'expressie') and ctx.expressie():
                    expr_ctx = ctx.expressie()
                    # Handle case where expressie() returns a list
                    if isinstance(expr_ctx, list):
                        expr_ctx = expr_ctx[0] if expr_ctx else None
                    if expr_ctx:
                        expr = self.visitExpressie(expr_ctx)
                        if expr:
                            args.append(expr)
                
                # Process the optional time condition (conditieBijExpressie)
                if hasattr(ctx, 'conditieBijExpressie') and ctx.conditieBijExpressie():
                    cond_bij_ctx = ctx.conditieBijExpressie()
                    # Handle case where conditieBijExpressie() returns a list
                    if isinstance(cond_bij_ctx, list):
                        cond_bij_ctx = cond_bij_ctx[0] if cond_bij_ctx else None
                    if cond_bij_ctx:
                        # Check if it's GEDURENDE_DE_TIJD_DAT with a condition expression
                        if hasattr(cond_bij_ctx, 'condition') and cond_bij_ctx.condition:
                            condition_expr = self.visitExpressie(cond_bij_ctx.condition)
                            if condition_expr:
                                args.append(condition_expr)
                
                return FunctionCall(
                    function_name=func_name,
                    arguments=args,
                    span=self.get_span(ctx)
                )
            elif isinstance(ctx, AntlrParser.HetAantalDagenInExprContext):
                func_name = "aantal_dagen_in"
                # Grammar: HET_AANTAL_DAGEN_IN (DE MAAND | HET JAAR) DAT expressie
                args = []
                
                # Determine period type (month or year)
                period_type = None
                for i in range(ctx.getChildCount()):
                    child = ctx.getChild(i)
                    if hasattr(child, 'getSymbol'):
                        token = child.getSymbol()
                        if token.type == AntlrParser.MAAND:
                            period_type = "maand"
                            break
                        elif token.type == AntlrParser.JAAR:
                            period_type = "jaar"
                            break
                
                # Create a literal for the period type
                if period_type:
                    args.append(Literal(value=period_type, datatype="Tekst", span=self.get_span(ctx)))
                
                # Get the condition expression after DAT
                if hasattr(ctx, 'expressie') and ctx.expressie():
                    condition = self.visitExpressie(ctx.expressie())
                    if condition:
                        args.append(condition)
                
                return FunctionCall(
                    function_name=func_name,
                    arguments=args,
                    span=self.get_span(ctx)
                )
            
            # Handle date extraction functions
            elif isinstance(ctx, AntlrParser.JaarUitFuncExprContext):
                func_name = "jaar_uit"
                # Grammar: HET JAAR UIT primaryExpression
                args = []
                if ctx.primaryExpression():
                    expr = self.visitPrimaryExpression(ctx.primaryExpression())
                    if expr:
                        args.append(expr)
                return FunctionCall(
                    function_name=func_name,
                    arguments=args,
                    span=self.get_span(ctx)
                )
            
            elif isinstance(ctx, AntlrParser.MaandUitFuncExprContext):
                func_name = "maand_uit"
                # Grammar: DE MAAND UIT primaryExpression
                args = []
                if ctx.primaryExpression():
                    expr = self.visitPrimaryExpression(ctx.primaryExpression())
                    if expr:
                        args.append(expr)
                return FunctionCall(
                    function_name=func_name,
                    arguments=args,
                    span=self.get_span(ctx)
                )
            
            elif isinstance(ctx, AntlrParser.DagUitFuncExprContext):
                func_name = "dag_uit"
                # Grammar: DE DAG UIT primaryExpression
                args = []
                if ctx.primaryExpression():
                    expr = self.visitPrimaryExpression(ctx.primaryExpression())
                    if expr:
                        args.append(expr)
                return FunctionCall(
                    function_name=func_name,
                    arguments=args,
                    span=self.get_span(ctx)
                )

            elif isinstance(ctx, AntlrParser.DatumMetFuncExprContext):
                # Grammar: DE_DATUM_MET LPAREN primaryExpression COMMA primaryExpression COMMA primaryExpression RPAREN
                # Per spec §13.4.16.31: "de datum met jaar, maand en dag(year, month, day)"
                args = []
                for i in range(3):  # Expect exactly 3 arguments
                    expr = self.visitPrimaryExpression(ctx.primaryExpression(i))
                    if expr is None:
                        return None
                    args.append(expr)
                return FunctionCall(
                    function_name="datum_met",
                    arguments=args,
                    span=self.get_span(ctx)
                )

            # Handle DimensieAggExpr which covers "som van", "gemiddelde van", etc.
            elif isinstance(ctx, AntlrParser.DimensieAggExprContext):
                # Get the aggregation function type
                if hasattr(ctx, 'getalAggregatieFunctie') and ctx.getalAggregatieFunctie():
                    func_ctx = ctx.getalAggregatieFunctie()
                    if func_ctx.SOM_VAN():
                        func_name = "som_van"
                    elif func_ctx.AANTAL():
                        func_name = "het_aantal"
                    elif func_ctx.DE_MAXIMALE_WAARDE_VAN():
                        func_name = "maximale_waarde_van"
                    elif func_ctx.DE_MINIMALE_WAARDE_VAN():
                        func_name = "minimale_waarde_van"
                    elif hasattr(func_ctx, 'HET_GEMIDDELDE_VAN') and func_ctx.HET_GEMIDDELDE_VAN():
                        func_name = "gemiddelde_van"
                    elif hasattr(func_ctx, 'HET_TOTAAL_VAN') and func_ctx.HET_TOTAAL_VAN():
                        func_name = "totaal_van"
                    else:
                        logger.warning(f"Unknown getal aggregation function: {safe_get_text(func_ctx)}")
                        return None
                elif hasattr(ctx, 'datumAggregatieFunctie') and ctx.datumAggregatieFunctie():
                    func_ctx = ctx.datumAggregatieFunctie()
                    if func_ctx.EERSTE_VAN():
                        func_name = "eerste_van"
                    elif func_ctx.LAATSTE_VAN():
                        func_name = "laatste_van"
                    else:
                        logger.warning(f"Unknown datum aggregation function: {safe_get_text(func_ctx)}")
                        return None
                else:
                    logger.warning(f"No aggregation function found in DimensieAggExpr: {safe_get_text(ctx)}")
                    return None
            
            # If we still don't have a function name, we can't proceed
            if not func_name:
                logger.warning(f"Could not determine function name for context: {type(ctx).__name__}")
                return None
            
            # Get the attribute (what to aggregate)
            # Grammar now uses attribuutMetLidwoord instead of full attribuutReferentie
            attr_ref = None
            if hasattr(ctx, 'attribuutMetLidwoord') and ctx.attribuutMetLidwoord():
                # Build a simple AttributeReference from the attribute name
                attr_name = self.visitAttribuutMetLidwoord(ctx.attribuutMetLidwoord())
                attr_ref = AttributeReference(
                    path=[attr_name],
                    span=self.get_span(ctx.attribuutMetLidwoord())
                )
            
            # Special case: if no attribute specified but we have "van alle X",
            # then we're aggregating all instances that have attribute X (singular)
            # e.g., "de som van alle bedragen" means sum all "bedrag" attributes
            if attr_ref is None and hasattr(ctx, 'dimensieSelectie') and ctx.dimensieSelectie() and ctx.dimensieSelectie().aggregerenOverAlleDimensies():
                # This will be handled as a special case - return a FunctionCall
                # with just the collection name, and let the engine handle it
                alle_dim_ctx = ctx.dimensieSelectie().aggregerenOverAlleDimensies()
                if alle_dim_ctx.naamwoord():
                    collection_name = self._extract_canonical_name(alle_dim_ctx.naamwoord())
                    # Return a FunctionCall with the plural collection name
                    # The engine will handle converting plural to singular
                    return FunctionCall(
                        function_name=func_name,
                        arguments=[AttributeReference(path=[collection_name], span=self.get_span(alle_dim_ctx))],
                        span=self.get_span(ctx)
                    )
                
                logger.warning(f"No attribute found in aggregation: {safe_get_text(ctx)}")
                return None
            
            # Only process dimension selection for DimensieAggExpr contexts
            if isinstance(ctx, AntlrParser.DimensieAggExprContext):
                # Get the dimension selection (what to aggregate over)
                dim_select_ctx = ctx.dimensieSelectie() if hasattr(ctx, 'dimensieSelectie') else None
                if not dim_select_ctx:
                    logger.warning(f"No dimension selection found in aggregation: {safe_get_text(ctx)}")
                    return None
                
                # Parse the dimension selection to get the collection reference
                # For now, we'll focus on the common case: "van alle X"
                collection_ref = None
                if dim_select_ctx.aggregerenOverAlleDimensies():
                    # "alle X" pattern, possibly with filtering
                    alle_dim_ctx = dim_select_ctx.aggregerenOverAlleDimensies()
                    if alle_dim_ctx.naamwoord():
                        # Build an AttributeReference for the collection
                        # Parse the naamwoord to build a proper navigation path
                        naamwoord_ctx = alle_dim_ctx.naamwoord()

                        # Parse navigation pattern like "passagiers van de reis" -> ["reis", "passagiers"]
                        collection_path = self._parse_naamwoord_to_navigation_path(naamwoord_ctx)
                        if not collection_path:
                            # Fallback to extracting as single text if parsing fails
                            naamwoord_text = self._extract_canonical_name(naamwoord_ctx)
                            collection_path = [naamwoord_text] if naamwoord_text else []

                        collection_ref = AttributeReference(
                            path=collection_path,
                            span=self.get_span(alle_dim_ctx)
                        )

                        # Check if there's a filtering predicate
                        if alle_dim_ctx.predicaat():
                            # Create a Subselectie to filter the collection
                            predicaat = self.visitPredicaat(alle_dim_ctx.predicaat())
                            collection_ref = Subselectie(
                                onderwerp=collection_ref,
                                predicaat=predicaat,
                                span=self.get_span(alle_dim_ctx)
                            )
                
                if collection_ref is None:
                    logger.warning(f"Could not parse dimension selection: {safe_get_text(dim_select_ctx)}")
                    return None
                
                # Create a FunctionCall with both the attribute and collection as arguments
                func_call = FunctionCall(
                    function_name=func_name,
                    arguments=[attr_ref, collection_ref],
                    span=self.get_span(ctx)
                )
                return func_call
            
        elif isinstance(ctx, AntlrParser.MinAlleAttribuutExprContext):
            # DE_MINIMALE_WAARDE_VAN ALLE attribuutReferentie
            attr_ref = self.visitAttribuutReferentie(ctx.attribuutReferentie())
            if attr_ref is None:
                logger.warning(f"No attribute reference found in min function: {safe_get_text(ctx)}")
                return None
                
            return FunctionCall(
                function_name="minimale_waarde_van",
                arguments=[attr_ref],
                span=self.get_span(ctx)
            )
            
        elif isinstance(ctx, AntlrParser.MaxAlleAttribuutExprContext):
            # DE_MAXIMALE_WAARDE_VAN ALLE attribuutReferentie
            attr_ref = self.visitAttribuutReferentie(ctx.attribuutReferentie())
            if attr_ref is None:
                logger.warning(f"No attribute reference found in max function: {safe_get_text(ctx)}")
                return None
                
            return FunctionCall(
                function_name="maximale_waarde_van",
                arguments=[attr_ref],
                span=self.get_span(ctx)
            )
            
            # For other aggregation types, we already returned in the specific handlers above
            logger.warning(f"Unhandled aggregation context type: {type(ctx).__name__}")
            return None
        # --- Handle Other Labeled Expressions --- 
        elif isinstance(ctx, AntlrParser.AfrondingExprContext):
            # Handle afronding (rounding) expressions
            expr = self.visit(ctx.primaryExpression())
            if expr is None:
                return None
            
            afronding_ctx = ctx.afronding()
            if afronding_ctx:
                # Extract rounding direction
                direction = None
                if afronding_ctx.NAAR_BENEDEN():
                    direction = "naar_beneden"
                elif afronding_ctx.NAAR_BOVEN():
                    direction = "naar_boven"
                elif afronding_ctx.REKENKUNDIG():
                    direction = "rekenkundig"
                elif afronding_ctx.RICHTING_NUL():
                    direction = "richting_nul"
                elif afronding_ctx.WEG_VAN_NUL():
                    direction = "weg_van_nul"
                
                # Extract decimals
                decimals = int(afronding_ctx.NUMBER().getText()) if afronding_ctx.NUMBER() else 0
                
                from regelspraak.ast import AfrondingExpression
                return AfrondingExpression(
                    expression=expr,
                    direction=direction,
                    decimals=decimals,
                    span=self.get_span(ctx)
                )
            return expr
            
        elif isinstance(ctx, AntlrParser.BegrenzingExprContext):
            # Handle begrenzing (bounding) expressions
            expr = self.visit(ctx.primaryExpression())
            if expr is None:
                return None
                
            begrenzing_ctx = ctx.begrenzing()
            if begrenzing_ctx:
                minimum = None
                maximum = None
                
                if hasattr(begrenzing_ctx, 'begrenzingMinimum') and begrenzing_ctx.begrenzingMinimum():
                    min_ctx = begrenzing_ctx.begrenzingMinimum()
                    minimum = self.visit(min_ctx.expressie())
                elif hasattr(begrenzing_ctx, 'begrenzingMaximum') and begrenzing_ctx.begrenzingMaximum():
                    max_ctx = begrenzing_ctx.begrenzingMaximum()
                    maximum = self.visit(max_ctx.expressie())
                
                from regelspraak.ast import BegrenzingExpression
                return BegrenzingExpression(
                    expression=expr,
                    minimum=minimum,
                    maximum=maximum,
                    span=self.get_span(ctx)
                )
            return expr
            
        elif isinstance(ctx, AntlrParser.BegrenzingAfrondingExprContext):
            # Handle combined begrenzing and afronding expressions
            expr = self.visit(ctx.primaryExpression())
            if expr is None:
                return None
                
            # Handle begrenzing
            minimum = None
            maximum = None
            begrenzing_ctx = ctx.begrenzing()
            if begrenzing_ctx:
                if hasattr(begrenzing_ctx, 'begrenzingMinimum') and begrenzing_ctx.begrenzingMinimum():
                    min_ctx = begrenzing_ctx.begrenzingMinimum()
                    minimum = self.visit(min_ctx.expressie())
                elif hasattr(begrenzing_ctx, 'begrenzingMaximum') and begrenzing_ctx.begrenzingMaximum():
                    max_ctx = begrenzing_ctx.begrenzingMaximum()
                    maximum = self.visit(max_ctx.expressie())
            
            # Handle afronding
            direction = None
            decimals = 0
            afronding_ctx = ctx.afronding()
            if afronding_ctx:
                # Extract rounding direction
                if afronding_ctx.NAAR_BENEDEN():
                    direction = "naar_beneden"
                elif afronding_ctx.NAAR_BOVEN():
                    direction = "naar_boven"
                elif afronding_ctx.REKENKUNDIG():
                    direction = "rekenkundig"
                elif afronding_ctx.RICHTING_NUL():
                    direction = "richting_nul"
                elif afronding_ctx.WEG_VAN_NUL():
                    direction = "weg_van_nul"
                
                # Extract decimals
                decimals = int(afronding_ctx.NUMBER().getText()) if afronding_ctx.NUMBER() else 0
            
            from regelspraak.ast import BegrenzingAfrondingExpression
            return BegrenzingAfrondingExpression(
                expression=expr,
                minimum=minimum,
                maximum=maximum,
                direction=direction,
                decimals=decimals,
                span=self.get_span(ctx)
            )
            
        elif isinstance(ctx, AntlrParser.ConcatenatieExprContext) or isinstance(ctx, AntlrParser.SimpleConcatenatieExprContext):
            # Handle concatenation expressions (e.g., "X, Y en Z")
            logger.debug(f"Detected concatenation expression: {safe_get_text(ctx)}, type: {type(ctx).__name__}")
            return self.visitConcatenatieExpressie(ctx)
        elif isinstance(ctx, AntlrParser.DateCalcExprContext):
            # This is a date calculation pattern like "date + 5 days"
            # Grammar: primaryExpression (PLUS | MIN) primaryExpression timeUnit
            left_expr = self.visitPrimaryExpression(ctx.primaryExpression(0))
            right_expr = self.visitPrimaryExpression(ctx.primaryExpression(1))
            operator = Operator.PLUS if ctx.PLUS() else Operator.MIN

            # Get and normalize the time unit
            time_unit_text = ctx.timeUnit().getText() if ctx.timeUnit() else ""
            normalized_unit = self._normalize_time_unit(time_unit_text)

            # Attach the unit to the right expression
            # If it's a literal, create a new literal with unit
            if isinstance(right_expr, Literal):
                right_expr = Literal(
                    value=right_expr.value,
                    datatype=right_expr.datatype,
                    eenheid=normalized_unit,  # Attach the time unit
                    span=right_expr.span
                )
            else:
                # For non-literal expressions, wrap in a function to apply unit
                # This ensures the Value at runtime has the correct unit
                right_expr = FunctionCall(
                    function_name="with_unit",
                    arguments=[right_expr],
                    unit_conversion=normalized_unit,
                    span=right_expr.span
                )

            return BinaryExpression(
                left=left_expr,
                operator=operator,
                right=right_expr,
                span=self.get_span(ctx)
            )
        
        # No function call matched
        return None

    def _handle_literals(self, ctx) -> Optional[Expression]:
        """Handle all literal contexts from primaryExpression."""
        if isinstance(ctx, AntlrParser.NumberLiteralExprContext):
            logger.debug("  -> Matched NumberLiteralExprContext")
            num_text = ctx.NUMBER().getText().replace(',', '.')
            try:
                value = float(num_text) if '.' in num_text or 'e' in num_text or 'E' in num_text else int(num_text)
                
                # Check if there's a unit
                unit = None
                if ctx.unitIdentifier():
                    unit = ctx.unitIdentifier().getText()
                    logger.debug(f"    Found unit: '{unit}'")
                
                return Literal(value=value, datatype="Numeriek", eenheid=unit, span=self.get_span(ctx))
            except ValueError:
                 logger.error(f"Invalid numeric literal: {ctx.NUMBER().getText()} in {safe_get_text(ctx)}")
                 return None
        elif isinstance(ctx, AntlrParser.StringLiteralExprContext):
            # Strip both single and double quotes
            text = ctx.STRING_LITERAL().getText()
            if text.startswith('"') and text.endswith('"'):
                text = text[1:-1]
            elif text.startswith("'") and text.endswith("'"):
                text = text[1:-1]
            return Literal(value=text, datatype="Tekst", span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.PercentageLiteralExprContext):
            # Convert percentage to decimal: 21% -> 0.21
            text = ctx.PERCENTAGE_LITERAL().getText()
            percent_value = text[:-1].replace(',', '.')  # Remove % and handle comma
            decimal_value = Decimal(percent_value) / 100
            return Literal(value=float(decimal_value), datatype="Percentage", eenheid="%", span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.EnumLiteralExprContext):
             text = ctx.ENUM_LITERAL().getText()
             # Remove quotes from enum literals
             value = text.strip("'\"") if text else text
             return Literal(value=value, datatype="Enumeratie", span=self.get_span(ctx))
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
        
        # No literal matched
        return None

    def _handle_references(self, ctx) -> Optional[Expression]:
        """Handle all reference contexts from primaryExpression."""
        if isinstance(ctx, AntlrParser.BezieldeRefExprContext):
             logger.debug("  -> Matched BezieldeRefExprContext")
             return self.visitBezieldeReferentie(ctx.bezieldeReferentie())
        elif isinstance(ctx, AntlrParser.AttrRefExprContext):
             logger.debug("  -> Matched AttrRefExprContext")
             return self.visitAttribuutReferentie(ctx.attribuutReferentie())
        elif isinstance(ctx, AntlrParser.ParamRefExprContext):
            logger.debug("  -> Matched ParamRefExprContext")
            param_met_lidwoord = ctx.parameterMetLidwoord()
            
            # Handle complex parameter names with prepositions
            if param_met_lidwoord.naamwoord():
                # Simple case: just a naamwoord
                param_name_ctx = param_met_lidwoord.naamwoord()
                param_name = self._extract_canonical_name(param_name_ctx)
            else:
                # Complex case: parameter with prepositions
                # Get full text and strip article
                full_text = get_text_with_spaces(param_met_lidwoord)
                # Remove leading articles
                for article in ['de ', 'het ']:
                    if full_text.lower().startswith(article):
                        param_name = full_text[len(article):]
                        break
                else:
                    param_name = full_text
                    
            if not param_name:
                    logger.error(f"Could not extract canonical name for parameter reference in {safe_get_text(ctx)}")
                    param_name = "<unknown_param>" # Keep fallback
            logger.debug(f"    Extracted param_name: '{param_name}'")
            result = ParameterReference(parameter_name=param_name, span=self.get_span(ctx))
            logger.debug(f"    Returning: {result}")
            return result
        elif isinstance(ctx, AntlrParser.OnderwerpRefExprContext):
            logger.debug("  -> Matched OnderwerpRefExprContext")
            onderwerp_ref = ctx.onderwerpReferentie()
            
            # First check if the full text matches a parameter name
            # This handles cases where parameter names contain prepositions that get split
            # We need to reconstruct the text properly from the input stream
            start_token = onderwerp_ref.start
            stop_token = onderwerp_ref.stop
            if start_token and stop_token:
                # Get the input stream from the token source
                input_stream = start_token.getTokenSource().inputStream
                # Get text from the input stream between start and stop positions
                start_idx = start_token.start
                stop_idx = stop_token.stop
                full_text_with_spaces = input_stream.getText(start_idx, stop_idx)
                canonical_name = self._extract_canonical_name_from_text(full_text_with_spaces)
                logger.debug(f"    Checking reconstructed text '{full_text_with_spaces}' -> canonical '{canonical_name}' against parameter names")
                if canonical_name in self.parameter_names:
                    logger.debug(f"    Recognized as parameter: '{canonical_name}'")
                    return ParameterReference(parameter_name=canonical_name, span=self.get_span(ctx))
            
            # Build path from onderwerp reference parts
            path = self.visitOnderwerpReferentieToPath(onderwerp_ref)
            logger.debug(f"    Built path: {path}")
            
            # Check if this is a single-element path that might be a parameter
            if len(path) == 1:
                # Extract canonical name (without article) to check against parameter names
                canonical_name = self._extract_canonical_name_from_text(path[0])
                logger.debug(f"    Checking if '{canonical_name}' (from '{path[0]}') is a parameter")
                if canonical_name in self.parameter_names:
                    logger.debug(f"    Recognized as parameter: '{canonical_name}'")
                    return ParameterReference(parameter_name=canonical_name, span=self.get_span(ctx))
            
            # Otherwise treat as attribute reference
            result = AttributeReference(path=path, span=self.get_span(ctx))
            logger.debug(f"    Returning: {result}")
            return result
        elif isinstance(ctx, AntlrParser.NaamwoordExprContext):
            logger.debug("  -> Matched NaamwoordExprContext")
            # Use _extract_canonical_name for consistent canonicalization
            canonical_name = self._extract_canonical_name(ctx.naamwoord())
            logger.debug(f"    Canonical name: '{canonical_name}'")
            if canonical_name:
                # Check if this is a parameter name
                if canonical_name in self.parameter_names:
                    logger.debug(f"    Name '{canonical_name}' is a known parameter, creating ParameterReference")
                    result = ParameterReference(parameter_name=canonical_name, span=self.get_span(ctx))
                else:
                    # Not a parameter, assume variable reference
                    logger.debug(f"    Name '{canonical_name}' is not a known parameter, creating VariableReference")
                    result = VariableReference(variable_name=canonical_name, span=self.get_span(ctx))
                logger.debug(f"    Returning: {result}")
                return result
            else:
                logger.error(f"_extract_canonical_name returned None for {safe_get_text(ctx)}")
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
        
        # No reference matched
        return None

    def _handle_unary_operators(self, ctx) -> Optional[Expression]:
        """Handle unary operator contexts from primaryExpression."""
        if isinstance(ctx, AntlrParser.UnaryMinusExprContext):
            logger.debug("  -> Matched UnaryMinusExprContext")
            operand = self.visitPrimaryExpression(ctx.primaryExpression())
            if operand is None: return None
            return UnaryExpression(operator=Operator.MIN, operand=operand, span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.UnaryNietExprContext):
            logger.debug("  -> Matched UnaryNietExprContext")
            operand = self.visitPrimaryExpression(ctx.primaryExpression())
            if operand is None: return None
            return UnaryExpression(operator=Operator.NIET, operand=operand, span=self.get_span(ctx))
        
        # No unary operator matched
        return None

    def visitUnaryCondition(self, ctx: AntlrParser.UnaryConditionContext) -> Optional[Expression]:
        """Visit unary condition expressions."""
        logger.debug(f"Visiting unary condition: {safe_get_text(ctx)}")
        
        # Handle unaryCheckCondition alternative
        if isinstance(ctx, AntlrParser.UnaryCheckConditionContext):
            expr = self.visitPrimaryExpression(ctx.expr)
            if expr is None:
                return None
            
            # Map token to operator
            op_token = ctx.op
            if op_token.type == AntlrLexer.VOLDOET_AAN_DE_ELFPROEF:
                operator = Operator.VOLDOET_AAN_DE_ELFPROEF
            elif op_token.type == AntlrLexer.VOLDOET_NIET_AAN_DE_ELFPROEF:
                operator = Operator.VOLDOET_NIET_AAN_DE_ELFPROEF
            else:
                # Handle other unary check operators if needed
                logger.warning(f"Unhandled unary check operator: {op_token.text}")
                return None
            
            return UnaryExpression(
                operator=operator,
                operand=expr,
                span=self.get_span(ctx)
            )
        
        # Handle unaryDagsoortCondition alternative
        elif isinstance(ctx, AntlrParser.UnaryDagsoortConditionContext):
            expr = self.visitPrimaryExpression(ctx.expr)
            if expr is None:
                return None
            
            # Get the dagsoort name
            dagsoort_name = ctx.dagsoort.getText() if ctx.dagsoort else None
            if not dagsoort_name:
                logger.error(f"No dagsoort name found in {safe_get_text(ctx)}")
                return None
            
            # Map token to operator
            op_token = ctx.op
            if op_token.type == AntlrLexer.IS_EEN_DAGSOORT:
                operator = Operator.IS_EEN_DAGSOORT
            elif op_token.type == AntlrLexer.ZIJN_EEN_DAGSOORT:
                operator = Operator.ZIJN_EEN_DAGSOORT
            elif op_token.type == AntlrLexer.IS_GEEN_DAGSOORT:
                operator = Operator.IS_GEEN_DAGSOORT
            elif op_token.type == AntlrLexer.ZIJN_GEEN_DAGSOORT:
                operator = Operator.ZIJN_GEEN_DAGSOORT
            else:
                logger.warning(f"Unhandled dagsoort operator: {op_token.text}")
                return None
            
            # Create binary expression with date on left, dagsoort name on right
            return BinaryExpression(
                left=expr,
                operator=operator,
                right=Literal(value=dagsoort_name, datatype="Tekst", span=self.get_span(ctx.dagsoort)),
                span=self.get_span(ctx)
            )
        
        # Handle unaryUniekCondition alternative
        elif isinstance(ctx, AntlrParser.UnaryUniekConditionContext):
            # This handles expressions like "de BSNs van alle personen moeten uniek zijn"
            ref = self.visitOnderwerpReferentie(ctx.ref)
            if ref is None:
                return None
            
            # Create a unary expression with MOETEN_UNIEK_ZIJN operator
            return UnaryExpression(
                operator=Operator.MOETEN_UNIEK_ZIJN,
                operand=ref,
                span=self.get_span(ctx)
            )
        
        # Handle unaryNumeriekExactCondition alternative
        elif isinstance(ctx, AntlrParser.UnaryNumeriekExactConditionContext):
            # This handles "is numeriek met exact N cijfers"
            expr = self.visitPrimaryExpression(ctx.expr)
            if expr is None:
                return None
            
            # Get the digit count from the NUMBER token
            digit_count = int(ctx.NUMBER().getText())
            
            # Map token to operator
            op_token = ctx.op
            if op_token.type == AntlrLexer.IS_NUMERIEK_MET_EXACT:
                operator = Operator.IS_NUMERIEK_MET_EXACT
            elif op_token.type == AntlrLexer.IS_NIET_NUMERIEK_MET_EXACT:
                operator = Operator.IS_NIET_NUMERIEK_MET_EXACT
            elif op_token.type == AntlrLexer.ZIJN_NUMERIEK_MET_EXACT:
                operator = Operator.ZIJN_NUMERIEK_MET_EXACT
            elif op_token.type == AntlrLexer.ZIJN_NIET_NUMERIEK_MET_EXACT:
                operator = Operator.ZIJN_NIET_NUMERIEK_MET_EXACT
            else:
                logger.warning(f"Unhandled numeric exact operator: {op_token.text}")
                return None
            
            # Create binary expression with digit count as right operand
            return BinaryExpression(
                left=expr,
                operator=operator,
                right=Literal(value=digit_count, datatype="Numeriek", span=self.get_span(ctx)),
                span=self.get_span(ctx)
            )
        
        # TODO: Handle other unaryCondition alternatives
        logger.warning(f"Unhandled unary condition type: {type(ctx).__name__}")
        return None

    def visitRegelStatusCondition(self, ctx: AntlrParser.RegelStatusConditionContext) -> Optional[Expression]:
        """Visit rule status condition expressions (regelversie X is gevuurd/inconsistent)."""
        logger.debug(f"Visiting regel status condition: {safe_get_text(ctx)}")
        
        # Handle regelStatusGevuurdCheck alternative  
        if isinstance(ctx, AntlrParser.RegelStatusGevuurdCheckContext):
            # Extract rule name from naamwoord
            regel_naam_text = self._extract_canonical_name(ctx.name)
            if not regel_naam_text:
                logger.error(f"Could not extract rule name from: {safe_get_text(ctx.name)}")
                return None
            
            check_type = "gevuurd"
            
            return RegelStatusExpression(
                regel_naam=regel_naam_text,
                check=check_type,
                span=self.get_span(ctx)
            )
        
        # Handle regelStatusInconsistentCheck alternative
        if isinstance(ctx, AntlrParser.RegelStatusInconsistentCheckContext):
            # Extract rule name from naamwoord
            regel_naam_text = self._extract_canonical_name(ctx.name)
            if not regel_naam_text:
                logger.error(f"Could not extract rule name from: {safe_get_text(ctx.name)}")
                return None
            
            check_type = "inconsistent"
            
            return RegelStatusExpression(
                regel_naam=regel_naam_text,
                check=check_type,
                span=self.get_span(ctx)
            )
        
        logger.warning(f"Unhandled regel status condition type: {type(ctx).__name__}")
        return None

    def visitEnumLiteralExpr(self, ctx) -> Optional[Expression]:
        """Visit EnumLiteralExpr context to handle string literals."""
        text = ctx.ENUM_LITERAL().getText()
        # Remove quotes
        value = text.strip("'\"")
        return Literal(
            value=value,
            datatype="Tekst",
            span=self.get_span(ctx)
        )
    
    def visitSimpleConcatenatieExpr(self, ctx) -> Optional[Expression]:
        """Visit SimpleConcatenatieExpr context specifically."""
        return self.visitConcatenatieExpressie(ctx)
    
    def visitConcatenatieExpr(self, ctx) -> Optional[Expression]:
        """Visit ConcatenatieExpr context specifically."""
        return self.visitConcatenatieExpressie(ctx)

    def visitIdentifierExpr(self, ctx) -> Optional[Expression]:
        """Visit IdentifierExpr context (bare identifier as expression)."""
        # This is a labeled alternative of primaryExpression, so delegate to it
        return self.visitPrimaryExpression(ctx)

    def visitConcatenatieExpressie(self, ctx) -> Optional[Expression]:
        """Visit concatenation expression (e.g., "X, Y en Z" or "X, Y of Z")."""

        # Check if this is a disjunction (uses "of")
        has_of = False
        has_en = False
        args = []

        # Handle different concatenation context types properly
        if isinstance(ctx, AntlrParser.SimpleConcatenatieExprContext):
            # For SimpleConcatenatieExprContext
            # Pattern: primaryExpression (COMMA primaryExpression)+ (EN | OF) primaryExpression
            # Get all primary expressions
            primary_exprs = ctx.primaryExpression()
            if primary_exprs:
                if not isinstance(primary_exprs, list):
                    primary_exprs = [primary_exprs]
            else:
                primary_exprs = []

            # Visit each primary expression
            for pe in primary_exprs:
                expr = self.visit(pe)
                if expr:
                    args.append(expr)

            # Check for OF or EN tokens
            if ctx.OF():
                has_of = True
            if ctx.EN():
                has_en = True

        elif isinstance(ctx, AntlrParser.ConcatenatieExprContext):
            # For ConcatenatieExprContext with CONCATENATIE_VAN keyword
            # Pattern: CONCATENATIE_VAN primaryExpression (COMMA primaryExpression)* (EN | OF) primaryExpression
            # Get all primary expressions
            primary_exprs = ctx.primaryExpression()

            # Visit each primary expression
            for pe in primary_exprs:
                expr = self.visit(pe)
                if expr:
                    args.append(expr)

            # Check for OF or EN tokens
            if ctx.OF():
                has_of = True
            if ctx.EN():
                has_en = True
        else:
            # This shouldn't happen if we're called from the right visitor methods
            logger.warning(f"visitConcatenatieExpressie called with unexpected context type: {type(ctx).__name__}")
            return None
        
        # If this is a disjunction with "of", create a DisjunctionExpression
        if has_of:
            return DisjunctionExpression(
                values=args,
                span=self.get_span(ctx)
            )
        
        # Otherwise, check if we're in a function context
        parent = ctx.parentCtx
        if parent and hasattr(parent, 'function_name'):
            func_name = parent.function_name
        else:
            # Try to infer from parent context
            func_name = None
            if parent:
                parent_text = safe_get_text(parent)
                if 'gemiddelde van' in parent_text:
                    func_name = 'gemiddelde_van'
                elif 'som van' in parent_text:
                    func_name = 'som_van'
                elif 'eerste van' in parent_text:
                    func_name = 'eerste_van'
                elif 'laatste van' in parent_text:
                    func_name = 'laatste_van'
                elif 'totaal van' in parent_text:
                    func_name = 'totaal_van'
        
        # If we have a function name, return a FunctionCall
        if func_name and args:
            return FunctionCall(
                function_name=func_name,
                arguments=args,
                span=self.get_span(ctx)
            )
        
        # If it's a conjunction with "en" and no function context,
        # create a ConjunctionExpression to preserve all operands
        if has_en and args:
            # Return a ConjunctionExpression with all arguments
            return ConjunctionExpression(
                values=args,
                span=self.get_span(ctx)
            )

        # Otherwise, just return the first argument or None
        logger.warning(f"Concatenation expression without clear context: {safe_get_text(ctx)}")
        logger.warning(f"  has_en={has_en}, has_of={has_of}, args={args}")
        return args[0] if args else None

    def visitSubordinateClauseExpression(self, ctx: AntlrParser.SubordinateClauseExpressionContext) -> Optional[Expression]:
        """Visit Dutch subordinate clause expressions (Subject-Object-Verb order)."""
        if isinstance(ctx, AntlrParser.SubordinateHasExprContext):
            # Pattern: subject object verb=HEEFT (e.g., "hij een recht op korting heeft")
            subject = self.visitOnderwerpReferentie(ctx.subject)
            # The 'object' field might be reserved in Python, check for object_
            object_ctx = ctx.object_ if hasattr(ctx, 'object_') else ctx.object
            # Use get_text_with_spaces to preserve spaces and handle articles
            object_text = get_text_with_spaces(object_ctx)
            # Remove common articles from the beginning if present
            for article in ["een ", "het ", "de "]:
                if object_text.startswith(article):
                    object_name = object_text[len(article):]
                    break
            else:
                object_name = object_text
            # Transform to normal word order: subject HEEFT object
            left_expr = subject
            right_expr = Literal(value=object_name, datatype="Tekst", span=self.get_span(object_ctx))
            return BinaryExpression(
                left=left_expr,
                operator=Operator.HEEFT,
                right=right_expr,
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.SubordinateIsWithExprContext):
            # Pattern: subject prepPhrase verb=IS (e.g., "hij met vakantie is" or "hij een passagier van 65 jaar of ouder is")
            subject = self.visitOnderwerpReferentie(ctx.subject)
            # Use get_text_with_spaces to preserve spaces in complex phrases
            prep_phrase = get_text_with_spaces(ctx.prepPhrase)
            # Normalize the phrase by removing leading articles for kenmerk checks
            prep_phrase = self._normalize_kenmerk_name(prep_phrase)
            # Transform to: subject IS prep_phrase (as kenmerk check)
            left_expr = subject
            right_expr = Literal(value=prep_phrase, datatype="Tekst", span=self.get_span(ctx.prepPhrase))
            return BinaryExpression(
                left=left_expr,
                operator=Operator.IS,
                right=right_expr,
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.SubordinateIsKenmerkExprContext):
            # Pattern: subject verb=IS kenmerk (e.g., "hij is minderjarig")
            # This is already in normal word order but included for completeness
            subject = self.visitOnderwerpReferentie(ctx.subject)
            # Use get_text_with_spaces to preserve spaces in complex kenmerk names
            kenmerk_name = get_text_with_spaces(ctx.kenmerk)
            # Normalize the kenmerk name by removing leading articles
            kenmerk_name = self._normalize_kenmerk_name(kenmerk_name)
            left_expr = subject
            right_expr = Literal(value=kenmerk_name, datatype="Tekst", span=self.get_span(ctx.kenmerk))
            return BinaryExpression(
                left=left_expr,
                operator=Operator.IS,
                right=right_expr,
                span=self.get_span(ctx)
            )
        else:
            logger.error(f"Unknown subordinate clause type: {type(ctx).__name__}")
            return None

    # 7. Definition Structure Visitors
    def visitDefinitie(self, ctx: AntlrParser.DefinitieContext) -> Any:
        """Visit a definition node and delegate to specific definition visitors."""
        if ctx.objectTypeDefinition():
            return self.visitObjectTypeDefinition(ctx.objectTypeDefinition())
        elif ctx.domeinDefinition():
            return self.visitDomeinDefinition(ctx.domeinDefinition())
        elif ctx.parameterDefinition(): # Added Parameter Definition
            return self.visitParameterDefinition(ctx.parameterDefinition())
        elif ctx.feitTypeDefinition():
            return self.visitFeitTypeDefinition(ctx.feitTypeDefinition())
        elif ctx.dimensieDefinition():
            return self.visitDimensieDefinition(ctx.dimensieDefinition())
        elif ctx.dagsoortDefinition():
            return self.visitDagsoortDefinition(ctx.dagsoortDefinition())
        else:
            # Log if the definition context contains something unexpected
            # Use safe_get_text helper function
            child_text = safe_get_text(ctx.getChild(0)) if ctx.getChildCount() > 0 else "empty"
            if ctx.getChildCount() > 0 and not isinstance(ctx.getChild(0), (AntlrParser.ObjectTypeDefinitionContext, AntlrParser.DomeinDefinitionContext, AntlrParser.ParameterDefinitionContext, AntlrParser.FeitTypeDefinitionContext, AntlrParser.DimensieDefinitionContext, AntlrParser.DagsoortDefinitionContext, TerminalNode)):
                 logger.warning(f"Unknown definition type encountered: {child_text}")
            # It might be an empty definition context or whitespace (TerminalNode), which is fine.
            return None

    def visitObjectTypeDefinition(self, ctx: AntlrParser.ObjectTypeDefinitionContext) -> ObjectType:
        """Visit an object type definition and build an ObjectType object."""
        naam_ctx = ctx.naamwoordNoIs()
        naam = self.visitNaamwoordNoIs(naam_ctx)
        if not naam: # Add error handling if name extraction fails
                logger.error(f"Could not extract name for ObjectType in {safe_get_text(ctx)}")
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
        naam = self.visitNaamwoordWithNumbers(ctx.naamwoordWithNumbers())
        datatype_str = None
        is_lijst = False
        element_datatype = None

        if ctx.datatype():
            # Use structured datatype parsing
            is_lijst, datatype_str, element_datatype = self._parse_datatype(ctx.datatype())
        elif ctx.domeinRef():
            # Visit the domain reference to get the domain name
            datatype_str = self.visitDomeinRef(ctx.domeinRef())
        elif ctx.objectTypeRef():
            # Handle object type reference - just get the identifier text
            datatype_str = ctx.objectTypeRef().IDENTIFIER().getText()

        eenheid = None
        if ctx.MET_EENHEID():
            if ctx.unitIdentifier():
                eenheid = safe_get_text(ctx.unitIdentifier())
        if not naam or not datatype_str:
             logger.error(f"Could not parse attribute: name='{naam}', datatype='{datatype_str}' in {safe_get_text(ctx)}")
             return None

        # Handle GEDIMENSIONEERD_MET for dimension references
        dimensions = []
        if ctx.GEDIMENSIONEERD_MET():
            for dim_ref_ctx in ctx.dimensieRef():
                if dim_ref_ctx.name:
                    dimensions.append(dim_ref_ctx.name.text)

        # Handle timeline specification
        timeline = None
        if ctx.tijdlijn():
            tijdlijn_ctx = ctx.tijdlijn()
            if tijdlijn_ctx.VOOR_ELKE_DAG():
                timeline = "dag"
            elif tijdlijn_ctx.VOOR_ELKE_MAAND():
                timeline = "maand"
            elif tijdlijn_ctx.VOOR_ELK_JAAR():
                timeline = "jaar"

        return Attribuut(
            naam=naam,
            datatype=datatype_str,
            eenheid=eenheid,
            is_lijst=is_lijst,
            element_datatype=element_datatype,
            dimensions=dimensions,
            timeline=timeline,
            span=self.get_span(ctx)
        )

    def visitKenmerkSpecificatie(self, ctx: AntlrParser.KenmerkSpecificatieContext) -> Optional[Kenmerk]:
        """Visit a kenmerk specification and build a Kenmerk object."""
        naam = None
        if ctx.identifier():
            # Use helper which handles IdentifierContext directly
            naam = self._extract_canonical_name(ctx.identifier())
        elif ctx.naamwoordWithNumbers():
            naam = self._extract_canonical_name(ctx.naamwoordWithNumbers())
        if not naam:
             logger.error(f"Could not parse kenmerk name in {safe_get_text(ctx)}")
             return None
        
        # Normalize kenmerk name to strip verb prefixes
        naam = self._normalize_kenmerk_name(naam)

        # Handle timeline if present
        tijdlijn = None
        if ctx.tijdlijn():
            tijdlijn_ctx = ctx.tijdlijn()
            if tijdlijn_ctx.VOOR_ELKE_DAG():
                tijdlijn = "dag"
            elif tijdlijn_ctx.VOOR_ELKE_MAAND():
                tijdlijn = "maand"
            elif tijdlijn_ctx.VOOR_ELK_JAAR():
                tijdlijn = "jaar"

        # TODO: Potentially handle BIJVOEGLIJK / BEZITTELIJK if needed by the model
        return Kenmerk(naam=naam, span=self.get_span(ctx), tijdlijn=tijdlijn)

    def visitDomeinDefinition(self, ctx: AntlrParser.DomeinDefinitionContext) -> Domein:
         """Visit a domain definition and build a Domein object."""
         naam = ctx.name.text
         basis_type = None
         eenheid = None
         enumeratie_waarden = None
         # constraints = [] # TODO: Parse constraints if grammar supports them

         if ctx.MET_EENHEID() and ctx.eenheidExpressie():
             # Get the unit expression text
             eenheid = safe_get_text(ctx.eenheidExpressie())

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

    def visitDomeinRef(self, ctx: AntlrParser.DomeinRefContext) -> str:
        """Visit a domain reference and return the domain name."""
        return ctx.name.text

    def visitFeitTypeDefinition(self, ctx: AntlrParser.FeitTypeDefinitionContext) -> Optional[FeitType]:
        """Visit a feittype definition and build a FeitType object."""
        # Check if it's wederkerig (reciprocal)
        wederkerig = bool(ctx.WEDERKERIG_FEITTYPE())
        
        # Extract the feittype name
        naam = self.visitNaamwoord(ctx.feittypenaam)
        logger.debug(f"Processing FeitType: naam='{naam}', wederkerig={wederkerig}")
        
        # Extract roles from rolDefinition elements
        # Note: Due to grammar ambiguity, the cardinality line might be parsed as a role
        # We need to filter out invalid roles and track the cardinality prefix
        rollen = []
        cardinality_prefix = None
        rol_definitions = ctx.rolDefinition()
        
        # For non-wederkerig feittype, we expect exactly 2 roles
        # Any additional "roles" are likely part of the cardinality description
        expected_roles = 1 if wederkerig else 2
        
        for i, rol_ctx in enumerate(rol_definitions):
            if i < expected_roles:
                # Process as a real role
                rol = self.visitRolDefinition(rol_ctx)
                if rol:
                    rollen.append(rol)
            else:
                # This is part of the cardinality line that was misparsed as a role
                logger.debug(f"Ignoring role definition {i+1} as it's likely part of cardinality")
                if not cardinality_prefix:
                    cardinality_prefix = ""
                cardinality_prefix += " " + get_text_with_spaces(rol_ctx)
        
        # Validate role count
        if wederkerig and len(rollen) != 1:
            logger.error(f"Wederkerig FeitType '{naam}' must have exactly 1 role, found {len(rollen)}")
            return None
        elif not wederkerig and len(rollen) < 2:
            logger.error(f"FeitType '{naam}' must have at least 2 roles, found {len(rollen)}")
            return None
        
        # Extract cardinality description from the cardinalityLine
        # If we have a cardinality prefix (from misparse role), combine it with the cardinalityLine
        cardinality_description = None
        if ctx.cardinalityLine():
            cardinality_line_text = self._extract_cardinality_line(ctx.cardinalityLine())
            if cardinality_prefix and cardinality_line_text:
                # Combine the prefix with the rest of the line
                cardinality_description = f"{cardinality_prefix} {cardinality_line_text}"
            else:
                cardinality_description = cardinality_line_text
        
        return FeitType(
            naam=naam,
            wederkerig=wederkerig,
            rollen=rollen,
            cardinality_description=cardinality_description,
            span=self.get_span(ctx)
        )
    
    def _is_valid_role_definition(self, ctx) -> bool:
        """Check if a rolDefinition context represents a valid role definition.
        
        Valid role definitions typically:
        - Start with "de" or "het" (or no article)
        - Have a role name that's a single identifier (not "Een")
        - Have an object type that's a single identifier
        - Don't have additional text after the object type
        """
        # If the role name is "Een", it's likely the cardinality line
        if hasattr(ctx, 'rolnaam') and ctx.rolnaam and ctx.rolnaam.getText() == "Een":
            return False
        
        # Check that we have expected number of children
        # A valid role definition should have limited tokens
        # Allow up to 7 for: article + rolnaam + (mv: + meervoud + ) + objecttype
        if ctx.getChildCount() > 7:
            return False
            
        return True
    
    def visitRolDefinition(self, ctx: AntlrParser.RolDefinitionContext) -> Optional[Rol]:
        """Visit a role definition and build a Rol object."""
        # Extract all content words
        if not ctx.content:
            logger.error("No content found in role definition")
            return None
            
        # Get the full text including hidden channel tokens (whitespace/tabs)
        # This allows us to detect tab separators even though they're on HIDDEN channel
        input_stream = ctx.start.getInputStream()
        start_idx = ctx.content.start.start
        
        # Get the full input text and find the end of the current line
        full_input = input_stream.getText(0, input_stream.size)
        
        # Find where this role starts in the full input
        role_start_in_full = start_idx
        
        # Find the next newline after the role start
        next_newline = full_input.find('\n', role_start_in_full)
        if next_newline == -1:
            next_newline = len(full_input)
        
        # Extract the full line text
        full_text = full_input[role_start_in_full:next_newline].rstrip()
        
        # Check if there's a tab separator
        if '\t' in full_text:
            # Split on tab - role name before tab, object type after
            parts = full_text.split('\t', 1)
            rol_naam_full = parts[0].strip()
            object_type = parts[1].strip() if len(parts) > 1 else ""
            
            logger.debug(f"Tab-separated role raw: full_text='{repr(full_text)}', parts={parts}")
            
            # Extract plural form from rol_naam if present (e.g., "de passagier (mv: passagiers)")
            meervoud = None
            rol_naam = rol_naam_full
            if '(mv:' in rol_naam_full:
                # Extract the plural form
                mv_start = rol_naam_full.index('(mv:')
                mv_end = rol_naam_full.index(')', mv_start)
                meervoud_part = rol_naam_full[mv_start+4:mv_end].strip()
                # Remove articles from plural
                if meervoud_part.startswith('de '):
                    meervoud = meervoud_part[3:]
                elif meervoud_part.startswith('het '):
                    meervoud = meervoud_part[4:]
                else:
                    meervoud = meervoud_part
                # Clean up the rol_naam by removing the (mv: ...) part
                rol_naam = rol_naam_full[:mv_start].strip()
                logger.debug(f"Extracted plural from tab-separated: meervoud='{meervoud}'")
            
            # Handle any cardinality text that might be included in object_type
            # Stop at cardinality indicators
            for indicator in ['één', 'meerdere', 'vele', 'enkele', 'Eén', 'Een', 'Één', 'Meerdere']:
                if indicator in object_type.lower():
                    object_type = object_type[:object_type.lower().index(indicator)].strip()
                    break
            
            logger.debug(f"Parsed tab-separated role: name='{rol_naam}', meervoud='{meervoud}', type='{object_type}'")
            
            return Rol(
                naam=rol_naam,
                meervoud=meervoud,
                object_type=object_type,
                span=self.get_span(ctx)
            )
        
        # Fallback to original word-based parsing for backward compatibility
        # Get all words from the content
        words = []
        for child in ctx.content.children:
            if hasattr(child, 'getText'):
                word = child.getText()
                # Stop if we hit a cardinality starter
                if word in ['Eén', 'Een', 'Één', 'Meerdere', 'Vele', 'Enkele']:
                    break
                words.append(word)
        
        logger.debug(f"visitRolDefinition: extracted words from content: {words}")
        logger.debug(f"visitRolDefinition: ctx.objecttype present: {ctx.objecttype is not None}")
        if ctx.objecttype:
            logger.debug(f"visitRolDefinition: objecttype text: {ctx.objecttype.getText()}")
        
        # Check if there's an explicit object type after plural form
        if ctx.objecttype:
            # Object type is explicitly specified after plural
            object_type_words = []
            for child in ctx.objecttype.children:
                if hasattr(child, 'getText'):
                    object_type_words.append(child.getText())
            
            if object_type_words:
                # All content words are the role name
                rol_naam = " ".join(words)
                object_type = " ".join(object_type_words)

                # Filter out cardinality indicators per specification §4.3
                # The spec only defines "één" and "meerdere" as cardinality indicators
                for indicator in ['één', 'meerdere']:
                    if indicator in object_type.lower():
                        object_type = object_type[:object_type.lower().index(indicator)].strip()
                        break

                # Extract plural form if present
                meervoud = None
                if ctx.meervoud:
                    meervoud = self.visitNaamwoord(ctx.meervoud)

                logger.debug(f"Parsed role with explicit object type: name='{rol_naam}', type='{object_type}'")
                
                return Rol(
                    naam=rol_naam,
                    meervoud=meervoud,
                    object_type=object_type,
                    span=self.get_span(ctx)
                )
        
        # Original logic for when object type is part of content
        # The pattern is typically: "role_name ObjectType"
        # But when on separate lines, we might only get the role name
        if len(words) < 1:
            logger.error(f"Role definition must have at least 1 word, got: {words}")
            return None
        
        # Split into role name and object type
        # Strategy: Look for capitalized words which are likely object types
        
        # Find where the object type starts (last capitalized word or sequence)
        object_type_start = -1
        
        # Look for capitalized words that could be object types
        if len(words) >= 2:
            # Multiple words - look for last capitalized sequence
            for i in range(len(words) - 1, -1, -1):
                if words[i] and words[i][0].isupper():
                    # Found a capitalized word - this could be the object type
                    object_type_start = i
                    # Check if there are more capitalized words before it
                    for j in range(i - 1, -1, -1):
                        if words[j] and words[j][0].isupper():
                            object_type_start = j
                        else:
                            break
                    break
        elif len(words) == 1:
            # Single word - this is a problem case
            # If it's "gebouw" alone, we can't determine the object type
            # But we need to handle it gracefully for the parser
            if words[0] and words[0][0].isupper():
                # Single capitalized word like "Gebouw" - treat as object type
                # The role name would be the lowercase version
                object_type_start = 0
            else:
                # Single lowercase word - assume it's a role name without object type
                # This will cause validation to fail later, but won't crash the parser
                logger.debug(f"Single word '{words[0]}' - treating as role name without explicit object type")
                # Use the capitalized version as a guess for object type
                role_words = words
                object_type_words = [words[0].capitalize()]
                
                rol_naam = " ".join(role_words)
                object_type = " ".join(object_type_words)
                
                # Extract plural form if present
                meervoud = None
                if ctx.meervoud:
                    meervoud = self.visitNaamwoord(ctx.meervoud)
                
                logger.debug(f"Parsed role (guessed): name='{rol_naam}', type='{object_type}' from words: {words}")
                
                return Rol(
                    naam=rol_naam,
                    meervoud=meervoud,
                    object_type=object_type,
                    span=self.get_span(ctx)
                )
        
        # Split the words
        role_words = words[:object_type_start]
        object_type_words = words[object_type_start:]
        
        # Validate and handle special cases
        if not role_words and object_type_start == 0:
            # Single capitalized word - use lowercase version as role name
            if len(words) == 1 and words[0][0].isupper():
                role_words = [words[0].lower()]
                object_type_words = [words[0]]
            else:
                logger.error(f"Could not determine role name from: {words}")
                return None
        elif not role_words:
            logger.error(f"Could not determine role name from: {words}")
            return None
        
        if not object_type_words:
            logger.error(f"Could not determine object type from: {words}")
            return None
        
        rol_naam = " ".join(role_words)
        object_type = " ".join(object_type_words)
        
        # Extract plural form if present
        meervoud = None
        if ctx.meervoud:
            meervoud = self.visitNaamwoord(ctx.meervoud)
        
        logger.debug(f"Parsed role: name='{rol_naam}', type='{object_type}' from words: {words}")
        
        return Rol(
            naam=rol_naam,
            meervoud=meervoud,
            object_type=object_type,
            span=self.get_span(ctx)
        )
    
    def _extract_cardinality_line(self, ctx) -> str:
        """Extract cardinality description from the cardinalityLine context."""
        # The cardinalityLine rule is just a sequence of cardinalityWord tokens
        # We need to collect all the text from these tokens
        parts = []
        
        # Iterate through all children which should be cardinalityWord contexts
        for word_ctx in ctx.cardinalityWord():
            # Each cardinalityWord is a single token (not a keyword/semicolon)
            if word_ctx.getChildCount() > 0:
                token = word_ctx.getChild(0)
                if isinstance(token, TerminalNode):
                    parts.append(token.getText())
        
        # Join all words with spaces to form the complete cardinality description
        return " ".join(parts) if parts else None

    def visitDimensieDefinition(self, ctx: AntlrParser.DimensieDefinitionContext) -> Optional[Dimension]:
        """Visit a dimension definition and build a Dimension AST node."""
        # Extract dimension name (first naamwoord)
        naamwoord_list = ctx.naamwoord()
        if not naamwoord_list or len(naamwoord_list) < 1:
            logger.error(f"No dimension name found in {safe_get_text(ctx)}")
            return None
        
        naam = self._extract_canonical_name(naamwoord_list[0])
        if not naam:
            logger.error(f"Could not extract dimension name from {safe_get_text(ctx)}")
            return None
        
        # Extract plural form (meervoud) - from the label after dimensieNaamMeervoud
        meervoud = None
        if ctx.dimensieNaamMeervoud:
            meervoud = self._extract_canonical_name(ctx.dimensieNaamMeervoud)
        
        # Determine usage style and preposition from voorzetselSpecificatie
        usage_style = None
        preposition = None
        voorzetsel_ctx = ctx.voorzetselSpecificatie()
        if voorzetsel_ctx:
            if voorzetsel_ctx.NA_HET_ATTRIBUUT_MET_VOORZETSEL():
                usage_style = "prepositional"
                # Extract the preposition from the context
                if voorzetsel_ctx.vz:
                    preposition = voorzetsel_ctx.vz.getText()
            elif voorzetsel_ctx.VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL():
                usage_style = "adjectival"
        
        # Extract labels with their order numbers
        labels = []
        for label_ctx in ctx.labelWaardeSpecificatie():
            # Get the number and dimension value
            if label_ctx.NUMBER() and label_ctx.dimWaarde:
                number = int(label_ctx.NUMBER().getText())
                value = self._extract_canonical_name(label_ctx.dimWaarde)
                if value:
                    labels.append((number, value))
        
        # Sort labels by their number to ensure correct order
        labels.sort(key=lambda x: x[0])
        
        return Dimension(
            naam=naam,
            meervoud=meervoud if meervoud else naam + "s",  # Default plural
            labels=labels,
            usage_style=usage_style if usage_style else "prepositional",  # Default
            preposition=preposition,
            span=self.get_span(ctx)
        )
    
    def visitDagsoortDefinition(self, ctx: AntlrParser.DagsoortDefinitionContext) -> Optional[Dagsoort]:
        """Visit a dagsoort (day type) definition and build a Dagsoort object."""
        # Extract the name from naamwoord
        naamwoord_ctx = ctx.naamwoord()
        if not naamwoord_ctx:
            logger.error(f"No dagsoort name found in {safe_get_text(ctx)}")
            return None
        
        naam = self._extract_canonical_name(naamwoord_ctx)
        if not naam:
            logger.error(f"Could not extract dagsoort name from {safe_get_text(ctx)}")
            return None
        
        # Extract plural form if present
        meervoud = None
        if ctx.MV_START() and ctx.plural:
            meervoud_parts = [token.text for token in ctx.plural]
            meervoud = " ".join(meervoud_parts) if meervoud_parts else None
        
        return Dagsoort(
            naam=naam,
            meervoud=meervoud,
            span=self.get_span(ctx)
        )
    
    def visitParameterDefinition(self, ctx: AntlrParser.ParameterDefinitionContext) -> Optional[Parameter]:
        """Visit a parameter definition and build a Parameter object."""
        # Access the name via parameterNamePhrase rule
        name_phrase_ctx = ctx.parameterNamePhrase()
        if not name_phrase_ctx:
            logger.error(f"Could not find parameterNamePhrase in {safe_get_text(ctx)}")
            return None
        naam = self._extract_canonical_name(name_phrase_ctx)
        datatype_str = None
        is_lijst = False
        element_datatype = None

        if ctx.datatype():
            # Use structured datatype parsing
            is_lijst, datatype_str, element_datatype = self._parse_datatype(ctx.datatype())
        elif ctx.domeinRef():
            datatype_str = self.visitDomeinRef(ctx.domeinRef())

        eenheid = None
        if ctx.MET_EENHEID():
            # Assuming eenheidExpressie gives text directly or needs visitor
            if ctx.eenheidExpressie():
                 eenheid = safe_get_text(ctx.eenheidExpressie()) # Simple text, might need visitEenheidExpressie
            # Handle unit identifier if present
            elif hasattr(ctx, 'unitIdentifier') and ctx.unitIdentifier():
                eenheid = safe_get_text(ctx.unitIdentifier())

        if not naam or not datatype_str:
             logger.error(f"Could not parse parameter: name='{naam}', datatype='{datatype_str}' in {safe_get_text(ctx)}")
             return None

        # Add parameter name to our tracking set
        if naam:
            self.parameter_names.add(naam)
            logger.debug(f"Added parameter to tracking: {naam}")
            logger.debug(f"Added parameter name to tracking: '{naam}'")

        # Handle timeline specification
        timeline = None
        if ctx.tijdlijn():
            tijdlijn_ctx = ctx.tijdlijn()
            if tijdlijn_ctx.VOOR_ELKE_DAG():
                timeline = "dag"
            elif tijdlijn_ctx.VOOR_ELKE_MAAND():
                timeline = "maand"
            elif tijdlijn_ctx.VOOR_ELK_JAAR():
                timeline = "jaar"

        # Parse initial value if present (e.g., Parameter x : Percentage is 21%)
        initial_value = None
        if ctx.IS() and ctx.expressie():
            initial_value = self.visit(ctx.expressie())

        param = Parameter(
            naam=naam,
            datatype=datatype_str,
            eenheid=eenheid,
            is_lijst=is_lijst,
            element_datatype=element_datatype,
            timeline=timeline,
            span=self.get_span(ctx)
        )

        # Add initial value if present
        if initial_value:
            param.initial_value = initial_value

        return param

    # 8. Rule Structure Visitors
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

        # Parse version/validity info
        versie_info = self.visitRegelVersie(ctx.regelVersie()) if ctx.regelVersie() else None

        return Regel(
            naam=naam,
            span=self.get_span(ctx),
            resultaat=resultaat,
            versie_info=versie_info,
            voorwaarde=voorwaarde,
            variabelen=variabelen
        )

    def visitRegelVersie(self, ctx: AntlrParser.RegelVersieContext) -> Optional[RegelVersie]:
        """Visit a rule version specification and build a RegelVersie object."""
        if not ctx or not ctx.versieGeldigheid():
            return None

        versie_ctx = ctx.versieGeldigheid()

        # Determine geldigheid type and dates
        if versie_ctx.ALTIJD():
            return RegelVersie(
                geldigheid_type="altijd",
                span=self.get_span(ctx)
            )
        elif versie_ctx.VANAF():
            # "vanaf <date>" pattern
            vanaf_datum = None
            if versie_ctx.datumLiteral(0):
                # Parse the date literal
                date_ctx = versie_ctx.datumLiteral(0)
                if date_ctx.DATE_TIME_LITERAL():
                    date_text = date_ctx.DATE_TIME_LITERAL().getText()
                else:
                    date_text = safe_get_text(date_ctx)

                # Parse date string to datetime
                from dateutil import parser as date_parser
                try:
                    vanaf_datum = date_parser.parse(date_text)
                except (ValueError, TypeError):
                    logger.error(f"Could not parse date: {date_text}")

            # Check if there's also a "t/m" or "tot en met" clause
            tot_datum = None
            if (versie_ctx.TM() or versie_ctx.TOT_EN_MET()) and versie_ctx.datumLiteral(1):
                date_ctx = versie_ctx.datumLiteral(1)
                if date_ctx.DATE_TIME_LITERAL():
                    date_text = date_ctx.DATE_TIME_LITERAL().getText()
                else:
                    date_text = safe_get_text(date_ctx)

                # Parse date string to datetime
                from dateutil import parser as date_parser
                try:
                    tot_datum = date_parser.parse(date_text)
                except (ValueError, TypeError):
                    logger.error(f"Could not parse date: {date_text}")

                geldigheid_type = "vanaf_tot"
            else:
                geldigheid_type = "vanaf"

            return RegelVersie(
                geldigheid_type=geldigheid_type,
                vanaf_datum=vanaf_datum,
                tot_datum=tot_datum,
                span=self.get_span(ctx)
            )
        else:
            logger.warning(f"Unexpected versieGeldigheid format: {safe_get_text(versie_ctx)}")
            return None

    def visitConsistentieregel(self, ctx: AntlrParser.ConsistentieregelContext) -> Optional[Regel]:
        """Visit a consistency rule and build a Regel object with Consistentieregel result."""
        # Get the rule name
        naam = self.visitNaamwoord(ctx.naamwoord()) if ctx.naamwoord() else "<unknown_consistentieregel>"
        
        # Determine which type of consistency result we have
        resultaat = None
        voorwaarde = None
        
        if ctx.uniekzijnResultaat():
            # Handle uniqueness check
            resultaat = self.visitUniekzijnResultaat(ctx.uniekzijnResultaat())
        elif ctx.inconsistentResultaat():
            # Handle inconsistency check
            resultaat = self.visitInconsistentResultaat(ctx.inconsistentResultaat())
            # Check if there's a condition
            if ctx.voorwaardeDeel():
                voorwaarde = self.visitVoorwaardeDeel(ctx.voorwaardeDeel())
        
        if not resultaat:
            logger.error(f"Could not parse consistency rule result for '{naam}'")
            return None
        
        # Return as a Regel with Consistentieregel as the result
        return Regel(
            naam=naam,
            span=self.get_span(ctx),
            resultaat=resultaat,
            versie_info=None,  # Consistency rules can have versions too, but not implemented yet
            voorwaarde=voorwaarde,
            variabelen={}  # Consistency rules don't have variables
        )
    
    def visitRegelGroep(self, ctx: AntlrParser.RegelGroepContext) -> Optional[RegelGroep]:
        """Visit a rule group definition and build a RegelGroep object."""
        # Get the name of the group
        naam_ctx = ctx.naamwoord()
        if not naam_ctx:
            logger.error(f"RegelGroep without name in {safe_get_text(ctx)}")
            return None
        
        naam = self.visitNaamwoord(naam_ctx)
        if not naam:
            logger.error(f"Could not parse RegelGroep name from {safe_get_text(naam_ctx)}")
            return None
        
        # Check if it's marked as recursive
        is_recursive = ctx.isRecursive is not None
        
        # Collect all rules in the group
        regels = []
        for child in ctx.children:
            if isinstance(child, AntlrParser.RegelContext):
                regel = self.visitRegel(child)
                if regel:
                    regels.append(regel)
            elif isinstance(child, AntlrParser.ConsistentieregelContext):
                consistentieregel = self.visitConsistentieregel(child)
                if consistentieregel:
                    regels.append(consistentieregel)
        
        if not regels:
            logger.warning(f"RegelGroep '{naam}' has no rules")
        
        return RegelGroep(
            naam=naam,
            is_recursive=is_recursive,
            regels=regels,
            span=self.get_span(ctx)
        )
    
    def visitUniekzijnResultaat(self, ctx: AntlrParser.UniekzijnResultaatContext) -> Optional[Consistentieregel]:
        """Visit a uniqueness check result."""
        # Get the target expression (what must be unique)
        alle_attr_ctx = ctx.alleAttributenVanObjecttype()
        if alle_attr_ctx:
            target = self.visitAlleAttributenVanObjecttype(alle_attr_ctx)
        else:
            logger.error(f"Failed to parse uniqueness target in {safe_get_text(ctx)}")
            return None
        
        if not target:
            logger.error(f"Failed to parse uniqueness target in {safe_get_text(ctx)}")
            return None
        
        return Consistentieregel(
            criterium_type="uniek",
            target=target,
            condition=None,  # Uniqueness checks don't have conditions
            span=self.get_span(ctx)
        )
    
    def visitAlleAttributenVanObjecttype(self, ctx: AntlrParser.AlleAttributenVanObjecttypeContext) -> Optional[Expression]:
        """Visit pattern: de attributen van alle ObjectType."""
        # Extract the attribute name (plural form)
        attr_plural = self.visitNaamwoord(ctx.naamwoord(0)) if ctx.naamwoord(0) else None
        # Extract the object type name
        obj_type = self.visitNaamwoord(ctx.naamwoord(1)) if ctx.naamwoord(1) else None
        
        if not attr_plural or not obj_type:
            logger.error(f"Failed to parse alle attributen pattern in {safe_get_text(ctx)}")
            return None
        
        # Create an AttributeReference that represents "attribute of all ObjectType"
        # The path structure represents the navigation: ["alle", object_type, attribute]
        return AttributeReference(
            path=["alle", obj_type, attr_plural],
            span=self.get_span(ctx)
        )
    
    def visitInconsistentResultaat(self, ctx: AntlrParser.InconsistentResultaatContext) -> Optional[Consistentieregel]:
        """Visit an inconsistency result."""
        # The naamwoord here is descriptive (e.g., "de data")
        # For now we don't use it, but it could be stored for error messages
        
        return Consistentieregel(
            criterium_type="inconsistent",
            target=None,  # Inconsistency checks don't have a specific target
            condition=None,  # Condition is handled at the consistentieregel level
            span=self.get_span(ctx)
        )

    def visitResultaatDeel(self, ctx: AntlrParser.ResultaatDeelContext) -> Optional[ResultaatDeel]:
        """Visit a result part (gelijkstelling, kenmerk toekenning, etc.)."""
        # Determine the type of result based on the matched alternative
        if isinstance(ctx, AntlrParser.ConsistencyCheckResultaatContext):
            # Handle consistency checks like "moet ongelijk zijn aan"
            target_ref = self.visitAttribuutReferentie(ctx.attribuutReferentie())
            expr = self.visitExpressie(ctx.expressie())
            
            if not target_ref or not expr:
                logger.error(f"Failed to parse consistency check target or expression in {safe_get_text(ctx)}")
                return None
            
            # Map consistency operators to comparison operators
            operator_text = safe_get_text(ctx.consistencyOperator())
            
            if 'ongelijk' in operator_text.lower():
                op = Operator.IS_ONGELIJK_AAN
            elif 'kleiner' in operator_text.lower():
                op = Operator.KLEINER_DAN
            elif 'groter' in operator_text.lower():
                op = Operator.GROTER_DAN
            else:
                op = Operator.GELIJK_AAN
            
            # Create a comparison assertion
            comparison = BinaryExpression(
                left=target_ref,
                operator=op,
                right=expr,
                span=self.get_span(ctx)
            )
            
            # SPEC COMPLIANT: Section 9.5 requires Consistentieregel for "moet ongelijk zijn aan"
            # Consistency rules validate data integrity, they don't assign values
            return Consistentieregel(
                criterium_type="inconsistent",  # Spec: consistency check type
                condition=comparison,  # The BinaryExpression with IS_ONGELIJK_AAN
                target=None,  # Spec: no specific target for inconsistency checks
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.GelijkstellingResultaatContext):
            # Handle GelijkstellingResultaat (wordt berekend als / gesteld op)
            # According to spec, gelijkstelling always uses attribuutReferentie
            target_ref = None
            if ctx.attribuutReferentie():
                target_ref = self.visitAttribuutReferentie(ctx.attribuutReferentie())

            expr = self.visitExpressie(ctx.expressie())
            if not target_ref or not expr:
                logger.error(f"Failed to parse gelijkstelling target or expression in {safe_get_text(ctx)}")
                return None
            
            # Fix for aantal dagen in parsing issue
            # If we have a BinaryExpression where left is FunctionCall for aantal_dagen_in
            # and operator is IS, we need to merge them into a single FunctionCall
            if (isinstance(expr, BinaryExpression) and 
                expr.operator == Operator.IS and
                isinstance(expr.left, FunctionCall) and
                expr.left.function_name == "aantal_dagen_in" and
                len(expr.left.arguments) == 2):
                # The second argument should be a pronoun or reference
                # We need to create a new expression that combines the pronoun with the IS comparison
                second_arg = expr.left.arguments[1]
                if isinstance(second_arg, AttributeReference) and second_arg.path == ["self"]:
                    # Create the correct condition expression: "hij is minderjarig"
                    condition_expr = BinaryExpression(
                        left=second_arg,
                        operator=Operator.IS,
                        right=expr.right,
                        span=expr.span
                    )
                    # Create corrected FunctionCall
                    expr = FunctionCall(
                        function_name=expr.left.function_name,
                        arguments=[expr.left.arguments[0], condition_expr],
                        span=expr.left.span
                    )
                    logger.debug(f"Fixed aantal_dagen_in parsing: merged IS expression into function call")
            
            # Check if this is an initialization (WORDT_GEINITIALISEERD_OP) or regular assignment
            # Look for the WORDT_GEINITIALISEERD_OP token in the context
            is_initialization = False
            for child in ctx.children:
                if isinstance(child, TerminalNode) and child.getSymbol().type == AntlrParser.WORDT_GEINITIALISEERD_OP:
                    is_initialization = True
                    break
            
            # Check for optional period definition
            period_def = None
            if hasattr(ctx, 'periodeDefinitie') and ctx.periodeDefinitie():
                period_def = self.visit(ctx.periodeDefinitie())
            
            if is_initialization:
                return Initialisatie(
                    target=target_ref,
                    expressie=expr,
                    period_definition=period_def,
                    span=self.get_span(ctx)
                )
            else:
                return Gelijkstelling(
                    target=target_ref,
                    expressie=expr,
                    period_definition=period_def,
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
            
            # Check for optional period definition
            period_def = None
            if hasattr(ctx, 'periodeDefinitie') and ctx.periodeDefinitie():
                period_def = self.visit(ctx.periodeDefinitie())
            
            return KenmerkToekenning(
                target=target_ref,
                kenmerk_naam=kenmerk_naam,
                is_negated=is_negated,
                period_definition=period_def,
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.RelationshipWithAttributeResultaatContext):
            # Handle "Een X heeft het Y met attribuut gelijk aan expressie" pattern
            onderwerp_path = self.visitOnderwerpReferentieToPath(ctx.onderwerpReferentie())
            if not onderwerp_path:
                logger.error(f"Failed to parse onderwerpReferentie in relationship: {safe_get_text(ctx)}")
                return None
                
            # Get the relationship target (het/de naamwoord after HEEFT)
            rel_target = self.visit(ctx.naamwoord())
            if not rel_target:
                logger.error(f"Failed to parse relationship target: {safe_get_text(ctx)}")
                return None
            
            # The rel_target is a role name like "vastgestelde contingent treinmiles"
            # We need to find the actual object type from the FeitType definition
            # This will be resolved in the engine which has access to the domain model
            
            # Get the attribute to set (now using attribuutMetLidwoord instead of attribuutReferentie)
            attr_ctx = ctx.attribuutMetLidwoord()
            if attr_ctx:
                # Visit attribuutMetLidwoord which should give us just the attribute name
                attr_name = self.visit(attr_ctx)
            else:
                attr_name = None
            
            if not attr_name:
                logger.error(f"Failed to parse attribute: {safe_get_text(ctx)}")
                return None
            
            # attr_name is now directly the attribute name string from attribuutMetLidwoord
            # No need to extract from a complex AttributeReference object
            
            # Clean up Dutch articles from the beginning if present
            if attr_name and isinstance(attr_name, str):
                if attr_name.startswith("het "):
                    attr_name = attr_name[4:]
                elif attr_name.startswith("de "):
                    attr_name = attr_name[3:]
                elif attr_name.startswith("een "):
                    attr_name = attr_name[4:]
            
            # Get the value expression
            value_expr = self.visitExpressie(ctx.expressie())
            if not value_expr:
                logger.error(f"Failed to parse value expression: {safe_get_text(ctx)}")
                return None
            
            # Create a compound result that establishes relationship and sets attribute
            # For now, treat this as an object creation with initialization
            # This is a simplified handling - proper implementation would create
            # a new AST node type for relationship creation with attribute initialization
            return ObjectCreatie(
                object_type=rel_target,
                attribute_inits=[(attr_name, value_expr)],
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.ObjectCreatieResultaatContext):
            # Handle object creation
            object_ctx = ctx.objectCreatie()
            object_type = self.visit(object_ctx.objectType)
            
            # Resolve role name to actual object type if needed
            # e.g., "vastgestelde contingent treinmiles" -> "Contingent treinmiles"
            if hasattr(self, 'domain_model') and self.domain_model:
                # Check if object_type is actually a role name that needs to be resolved
                for feittype_name, feittype in self.domain_model.feittypen.items():
                    for rol in feittype.rollen:
                        # Clean role name by removing articles
                        role_name_clean = rol.naam.lower()
                        for article in ['de ', 'het ', 'een ']:
                            if role_name_clean.startswith(article):
                                role_name_clean = role_name_clean[len(article):]
                                break
                        
                        # Clean object_type by removing articles
                        object_type_clean = object_type.lower()
                        for article in ['de ', 'het ', 'een ']:
                            if object_type_clean.startswith(article):
                                object_type_clean = object_type_clean[len(article):]
                                break
                        
                        # Check if object_type matches or contains the role name
                        if (role_name_clean == object_type_clean or 
                            role_name_clean in object_type_clean or
                            object_type_clean in role_name_clean):
                            # Found matching role - use the actual object type
                            object_type = rol.object_type
                            break
                    if object_type != self.visit(object_ctx.objectType):  # If we found a match
                        break
            
            # Parse attribute initializations if present
            attribute_inits = []
            if object_ctx.objectAttributeInit():
                # Parse initial attribute and its value
                init_ctx = object_ctx.objectAttributeInit()
                # Access attribuut and waarde as properties (they're already contexts, not methods)
                # attribuut is a SimpleNaamwoordContext, waarde is a SimpleExpressieContext
                attr_name = self.visitSimpleNaamwoord(init_ctx.attribuut) if init_ctx.attribuut else None
                value_expr = self.visitSimpleExpressie(init_ctx.waarde) if init_ctx.waarde else None

                # Special handling: the parser may incorrectly parse multiple attribute initializations
                # as a single logical expression with EN operators. We need to detect and split these.
                if attr_name and value_expr:
                    # Check if value_expr is a BinaryExpression with EN that should be split
                    if isinstance(value_expr, BinaryExpression) and value_expr.operator == Operator.EN:
                        # This might be multiple attribute initializations parsed as one expression
                        # Split them apart by walking the expression tree
                        all_attrs = []
                        all_attrs.append((attr_name, value_expr.left))  # First attr gets the left side

                        # Process the right side which may contain more attributes
                        current = value_expr.right
                        while current:
                            if isinstance(current, BinaryExpression):
                                if current.operator == Operator.GELIJK_AAN:
                                    # Pattern: attribute GELIJK_AAN value
                                    if isinstance(current.left, VariableReference):
                                        # The left side is the attribute name
                                        all_attrs.append((current.left.variable_name, current.right))
                                        break
                                    else:
                                        # Left side is not a variable reference, can't process further
                                        break
                                elif current.operator == Operator.EN:
                                    # Another EN expression, continue splitting
                                    # The left side should be an attribute assignment
                                    if isinstance(current.left, BinaryExpression) and current.left.operator == Operator.GELIJK_AAN:
                                        if isinstance(current.left.left, VariableReference):
                                            all_attrs.append((current.left.left.variable_name, current.left.right))
                                    # Continue with the right side
                                    current = current.right
                                else:
                                    break
                            else:
                                break

                        attribute_inits.extend(all_attrs)
                    else:
                        # Simple case: just one attribute initialization
                        attribute_inits.append((attr_name, value_expr))

                # Parse additional attributes using EN connector (though usually empty due to grammar issue)
                vervolg_list = init_ctx.attributeInitVervolg()
                if vervolg_list:
                    for vervolg in vervolg_list:
                        # Handle case where vervolg might be a list (due to visitor default behavior)
                        if isinstance(vervolg, list):
                            logger.warning(f"attributeInitVervolg returned list instead of context: {vervolg}")
                            continue

                        # Process the attribute and value
                        attr = None
                        val = None

                        if hasattr(vervolg, 'attribuut') and vervolg.attribuut:
                            attr_ctx = vervolg.attribuut
                            # Defensive check in case attribuut also returns a list
                            if not isinstance(attr_ctx, list):
                                attr = self.visitSimpleNaamwoord(attr_ctx)
                            else:
                                logger.warning(f"vervolg.attribuut returned list: {attr_ctx}")

                        if hasattr(vervolg, 'waarde') and vervolg.waarde:
                            val_ctx = vervolg.waarde
                            # Defensive check in case waarde also returns a list
                            if not isinstance(val_ctx, list):
                                val = self.visitSimpleExpressie(val_ctx)
                            else:
                                logger.warning(f"vervolg.waarde returned list: {val_ctx}")

                        if attr and val:
                            attribute_inits.append((attr, val))
            
            return ObjectCreatie(
                object_type=object_type,
                attribute_inits=attribute_inits,
                span=self.get_span(ctx)
            )
        # Add elif blocks for FeitCreatieResultaatContext, etc. as needed
        elif isinstance(ctx, AntlrParser.FeitCreatieResultaatContext):
            # Handle FeitCreatieResultaat
            # Grammar: feitCreatiePattern
            
            pattern_ctx = ctx.feitCreatiePattern()
            if not pattern_ctx:
                logger.error(f"Failed to parse FeitCreatie pattern")
                return None
            
            # Extract first role
            role1 = get_text_with_spaces(pattern_ctx.role1)
            if not role1:
                logger.error(f"Failed to parse first role name in {safe_get_text(ctx)}")
                return None
            
            # Extract first subject
            subject1_text = get_text_with_spaces(pattern_ctx.subject1)
            if not subject1_text:
                logger.error(f"Failed to parse first subject in {safe_get_text(ctx)}")
                return None
            
            # First subject always has "een" in front of it in the pattern
            # Pattern: EEN role1 VAN EEN subject1 IS article2 role2 VAN article3 subject2
            # So subject1 already has its article (EEN) in the pattern
            
            # For FeitCreatie, subjects are treated as single references
            subject1_ref = AttributeReference(path=[subject1_text], span=self.get_span(pattern_ctx.subject1))
            
            # Extract second role name
            role2 = get_text_with_spaces(pattern_ctx.role2)
            if not role2:
                logger.error(f"Failed to parse second role name in {safe_get_text(ctx)}")
                return None
            
            # Extract second subject
            subject2_text = get_text_with_spaces(pattern_ctx.subject2)
            if not subject2_text:
                logger.error(f"Failed to parse second subject in {safe_get_text(ctx)}")
                return None
            
            # Include the article3 in the subject text if present
            if pattern_ctx.article3:
                article3_text = pattern_ctx.article3.text
                subject2_text = f"{article3_text} {subject2_text}"
            
            # For FeitCreatie, subjects are treated as single references
            subject2_ref = AttributeReference(path=[subject2_text], span=self.get_span(pattern_ctx.subject2))
            
            return FeitCreatie(
                role1=role1,
                subject1=subject1_ref,
                role2=role2,
                subject2=subject2_ref,
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.VerdelingContext):
            # Handle Verdeling
            verdeling_ctx = ctx.verdelingResultaat()
            
            # Parse source amount expression
            source_amount = self.visit(verdeling_ctx.sourceAmount)
            
            # Parse target collection expression
            target_collection = self.visit(verdeling_ctx.targetCollection)
            
            # Parse distribution methods
            distribution_methods = []
            
            # Check for simple single-line format
            if verdeling_ctx.verdelingMethodeSimple():
                simple_ctx = verdeling_ctx.verdelingMethodeSimple()
                if simple_ctx.verdelingMethode():
                    method = self.visitVerdelingMethode(simple_ctx.verdelingMethode())
                    if method:
                        distribution_methods.append(method)
            
            # Check for multi-line format with bullet points
            elif verdeling_ctx.verdelingMethodeMultiLine():
                multi_ctx = verdeling_ctx.verdelingMethodeMultiLine()
                if multi_ctx.verdelingMethodeBulletList():
                    bullet_list_ctx = multi_ctx.verdelingMethodeBulletList()
                    for bullet_ctx in bullet_list_ctx.verdelingMethodeBullet():
                        if bullet_ctx.verdelingMethode():
                            method = self.visitVerdelingMethode(bullet_ctx.verdelingMethode())
                            if method:
                                distribution_methods.append(method)
            
            # Parse remainder target if present
            remainder_target = None
            if verdeling_ctx.verdelingRest():
                rest_ctx = verdeling_ctx.verdelingRest()
                if rest_ctx.remainderTarget:
                    remainder_target = self.visit(rest_ctx.remainderTarget)
            
            return Verdeling(
                source_amount=source_amount,
                target_collection=target_collection,
                distribution_methods=distribution_methods,
                remainder_target=remainder_target,
                span=self.get_span(ctx)
            )
        elif isinstance(ctx, AntlrParser.DagsoortdefinitieResultaatContext):
            # Handle day type definition: "Een dag is een X"
            dagsoort_naam = self.visitNaamwoord(ctx.naamwoord())
            return Dagsoortdefinitie(
                dagsoort_naam=dagsoort_naam,
                span=self.get_span(ctx)
            )
        else:
            logger.warning(f"Unknown or unhandled resultaat deel type: {type(ctx).__name__} in {safe_get_text(ctx)}")
            return None

    def visitVerdelingMethode(self, ctx: AntlrParser.VerdelingMethodeContext) -> Optional[VerdelingMethode]:
        """Visit a distribution method and return appropriate VerdelingMethode subclass."""
        if isinstance(ctx, AntlrParser.VerdelingGelijkeDelenContext):
            return VerdelingGelijkeDelen(span=self.get_span(ctx))
        
        elif isinstance(ctx, AntlrParser.VerdelingNaarRatoContext):
            ratio_expr = self.visit(ctx.ratioExpression)
            return VerdelingNaarRato(
                ratio_expression=ratio_expr,
                span=self.get_span(ctx)
            )
        
        elif isinstance(ctx, AntlrParser.VerdelingOpVolgordeContext):
            order_dir = ctx.orderDirection.text if ctx.orderDirection else "toenemende"
            order_expr = self.visit(ctx.orderExpression)
            return VerdelingOpVolgorde(
                order_direction=order_dir,
                order_expression=order_expr,
                span=self.get_span(ctx)
            )
        
        elif isinstance(ctx, AntlrParser.VerdelingTieBreakContext):
            tie_break_method = self.visitVerdelingMethode(ctx.tieBreakMethod)
            return VerdelingTieBreak(
                tie_break_method=tie_break_method,
                span=self.get_span(ctx)
            )
        
        elif isinstance(ctx, AntlrParser.VerdelingMaximumContext):
            max_expr = self.visit(ctx.maxExpression)
            # Per specification §9.7.2: maximum should reference attributes on receiver objects
            # If the expression is a VariableReference, convert it to an AttributeReference
            if isinstance(max_expr, VariableReference):
                # Convert variable name to attribute path on the receiver objects
                attr_path = [max_expr.variable_name]
                max_expr = AttributeReference(path=attr_path, span=max_expr.span)
                logger.debug(f"Converted VerdelingMaximum VariableReference to AttributeReference: {attr_path}")
            return VerdelingMaximum(
                max_expression=max_expr,
                span=self.get_span(ctx)
            )
        
        elif isinstance(ctx, AntlrParser.VerdelingAfrondingContext):
            decimals = int(ctx.decimals.text) if ctx.decimals else 0
            round_dir = ctx.roundDirection.text if ctx.roundDirection else "naar beneden"
            return VerdelingAfronding(
                decimals=decimals,
                round_direction=round_dir,
                span=self.get_span(ctx)
            )
        
        elif isinstance(ctx, AntlrParser.VerdelingMethodeCommaContext):
            # Handle comma-separated methods
            return self.visitVerdelingMethode(ctx.verdelingMethode())
        
        else:
            logger.warning(f"Unknown verdeling method type: {type(ctx).__name__}")
            return None

    def visitVoorwaardeDeel(self, ctx: AntlrParser.VoorwaardeDeelContext) -> Optional[Voorwaarde]:
        """Visit a condition part and build a Voorwaarde object."""
        # Check if we have an expression or a complex condition
        if ctx.expressie():
            expressie = self.visitExpressie(ctx.expressie())
            if not expressie:
                logger.error(f"Could not parse expression in voorwaardeDeel: {safe_get_text(ctx)}")
                return None
        elif ctx.toplevelSamengesteldeVoorwaarde():
            expressie = self.visitToplevelSamengesteldeVoorwaarde(ctx.toplevelSamengesteldeVoorwaarde())
            if not expressie:
                logger.error(f"Could not parse compound condition in voorwaardeDeel: {safe_get_text(ctx)}")
                return None
        else:
            logger.error(f"No expression found in voorwaardeDeel: {safe_get_text(ctx)}")
            return None
            
        return Voorwaarde(expressie=expressie, span=self.get_span(ctx))

    def visitToplevelSamengesteldeVoorwaarde(self, ctx: AntlrParser.ToplevelSamengesteldeVoorwaardeContext) -> Optional[SamengesteldeVoorwaarde]:
        """Visit a compound condition and build a SamengesteldeVoorwaarde object."""
        # Extract the quantification using the same method as for predicates
        kwantificatie = self.visitVoorwaardeKwantificatie(ctx.voorwaardeKwantificatie())
        if not kwantificatie:
            logger.error("No quantification found in compound condition")
            return None
        
        # Extract all the condition parts
        voorwaarden = []
        for onderdeel_ctx in ctx.samengesteldeVoorwaardeOnderdeel():
            condition = self.visitSamengesteldeVoorwaardeOnderdeel(onderdeel_ctx)
            if condition:
                voorwaarden.append(condition)
        
        if not voorwaarden:
            logger.error("No conditions found in compound condition")
            return None
        
        # Return a SamengesteldeVoorwaarde object that can handle all quantifier types
        return SamengesteldeVoorwaarde(
            kwantificatie=kwantificatie,
            voorwaarden=voorwaarden,
            span=self.get_span(ctx)
        )


    def visitSamengesteldeVoorwaardeOnderdeel(self, ctx: AntlrParser.SamengesteldeVoorwaardeOnderdeelContext) -> Optional[Expression]:
        """Visit a single condition part (with bullet prefix)."""
        # Skip the bullet prefix and visit the actual condition
        if ctx.elementaireVoorwaarde():
            return self.visitElementaireVoorwaarde(ctx.elementaireVoorwaarde())
        elif ctx.genesteSamengesteldeVoorwaarde():
            return self.visitGenesteSamengesteldeVoorwaarde(ctx.genesteSamengesteldeVoorwaarde())
        else:
            logger.error("No condition found in samengesteldeVoorwaardeOnderdeel")
            return None

    def visitElementaireVoorwaarde(self, ctx: AntlrParser.ElementaireVoorwaardeContext) -> Optional[Expression]:
        """Visit an elementary condition (just an expression)."""
        return self.visitExpressie(ctx.expressie())

    def visitGenesteSamengesteldeVoorwaarde(self, ctx: AntlrParser.GenesteSamengesteldeVoorwaardeContext) -> Optional[SamengesteldeVoorwaarde]:
        """Visit a nested compound condition and build a SamengesteldeVoorwaarde object."""
        # Extract the quantification using the same method as for predicates
        kwantificatie = self.visitVoorwaardeKwantificatie(ctx.voorwaardeKwantificatie())
        if not kwantificatie:
            logger.error("No quantification found in nested compound condition")
            return None
        
        # Extract all the condition parts
        voorwaarden = []
        for onderdeel_ctx in ctx.samengesteldeVoorwaardeOnderdeel():
            condition = self.visitSamengesteldeVoorwaardeOnderdeel(onderdeel_ctx)
            if condition:
                voorwaarden.append(condition)
        
        if not voorwaarden:
            logger.error("No conditions found in nested compound condition")
            return None
        
        # Return a SamengesteldeVoorwaarde object that can handle all quantifier types
        return SamengesteldeVoorwaarde(
            kwantificatie=kwantificatie,
            voorwaarden=voorwaarden,
            span=self.get_span(ctx)
        )

    def visitVariabeleDeel(self, ctx: AntlrParser.VariabeleDeelContext) -> Dict[str, Expression]:
        """Visit a variable part and build a dictionary of variable assignments."""
        variables = {}
        for toekenning_ctx in ctx.variabeleToekenning():
            # Variable names can have optional articles per spec §11
            # Extract just the variable name, ignoring the optional article (de/het)
            var_name = toekenning_ctx.varName.text if toekenning_ctx.varName else None
            expression = self.visitVariabeleExpressie(toekenning_ctx.varExpr) if toekenning_ctx.varExpr else None
            if var_name and expression:
                variables[var_name] = expression
            else:
                logger.warning(f"Could not parse variable assignment in {safe_get_text(toekenning_ctx)}")
        return variables
    
    def visitVariabeleExpressie(self, ctx: AntlrParser.VariabeleExpressieContext) -> Expression:
        """Visit a variable expression (limited expression that doesn't cross lines)."""
        # Start with the first primary expression
        result = self.visitPrimaryExpression(ctx.primaryExpression(0))
        
        # Process operators and operands in sequence
        # The grammar ensures operators and operands alternate
        op_index = 0
        for i in range(1, len(ctx.primaryExpression())):
            # Find the next operator (additive or multiplicative)
            operator = None
            
            # Check if we have an additive operator at this position
            if op_index < len(ctx.additiveOperator()):
                op_ctx = ctx.additiveOperator(op_index)
                if op_ctx.PLUS():
                    operator = Operator.PLUS
                elif op_ctx.MIN():
                    operator = Operator.MIN
                elif op_ctx.VERENIGD_MET():
                    operator = Operator.UNION
                elif op_ctx.VERMINDERD_MET():
                    operator = Operator.DIFFERENCE
                op_index += 1
            
            # Check if we have a multiplicative operator at this position  
            if operator is None and op_index - len(ctx.additiveOperator()) < len(ctx.multiplicativeOperator()):
                mult_index = op_index - len(ctx.additiveOperator())
                op_ctx = ctx.multiplicativeOperator(mult_index)
                if op_ctx.MAAL():
                    operator = Operator.MULTIPLY
                elif op_ctx.GEDEELD_DOOR():
                    operator = Operator.DIVIDE
                elif op_ctx.GEDEELD_DOOR_ABS():
                    operator = Operator.DIVIDE_ABS
                op_index += 1
                
            if operator is None:
                continue
                
            right = self.visitPrimaryExpression(ctx.primaryExpression(i))
            # Combine spans from left and right expressions
            if hasattr(result, 'span') and hasattr(right, 'span') and result.span and right.span:
                combined_span = SourceSpan(
                    result.span.start_line, result.span.start_col,
                    right.span.end_line, right.span.end_col
                )
            else:
                combined_span = self.get_span(ctx)
            
            result = BinaryExpression(
                operator=operator,
                left=result,
                right=right,
                span=combined_span
            )
        
        return result

    # --- Beslistabel (Decision Table) Methods ---

    def visitBeslistabel(self, ctx: AntlrParser.BeslistabelContext) -> Beslistabel:
        """Visit a decision table and build a Beslistabel AST node."""
        naam = self._extract_canonical_name(ctx.naamwoord())
        versie_info = self.visitRegelVersie(ctx.regelVersie()) if ctx.regelVersie() else None
        
        # Visit the table structure
        table_data = self.visitBeslistabelTable(ctx.beslistabelTable())
        
        # Parse column headers
        parser = BeslistabelParser()
        
        # Parse result column
        parsed_result = parser.parse_result_column(table_data['result_column'])
        if parsed_result:
            parsed_result = BeslistabelResult(
                header_text=table_data['result_column'],
                target_type=parsed_result.target_type,
                attribute_path=parsed_result.attribute_path,
                kenmerk_name=parsed_result.kenmerk_name,
                object_type=parsed_result.object_type
            )
        
        # Parse condition columns
        parsed_conditions = []
        for condition_text in table_data['condition_columns']:
            parsed_cond = parser.parse_condition_column(condition_text)
            if parsed_cond:
                parsed_conditions.append(BeslistabelCondition(
                    header_text=condition_text,
                    subject_path=parsed_cond.subject_path,
                    operator=parsed_cond.operator,
                    is_kenmerk_check=parsed_cond.is_kenmerk_check
                ))
            else:
                # Keep unparsed condition for debugging
                parsed_conditions.append(BeslistabelCondition(
                    header_text=condition_text
                ))
        
        return Beslistabel(
            naam=naam,
            versie_info=versie_info,
            result_column=table_data['result_column'],
            condition_columns=table_data['condition_columns'],
            rows=table_data['rows'],
            span=self.get_span(ctx),
            parsed_result=parsed_result,
            parsed_conditions=parsed_conditions if parsed_conditions else None
        )

    def visitBeslistabelTable(self, ctx: AntlrParser.BeslistabelTableContext) -> dict:
        """Visit the table structure and extract header and rows."""
        header = self.visitBeslistabelHeader(ctx.beslistabelHeader())
        rows = [self.visitBeslistabelRow(row) for row in ctx.beslistabelRow()]
        
        return {
            'result_column': header['result_column'],
            'condition_columns': header['condition_columns'],
            'rows': rows
        }

    def visitBeslistabelHeader(self, ctx: AntlrParser.BeslistabelHeaderContext) -> dict:
        """Visit the header row to extract column titles."""
        # Extract result column text
        result_column_text = self._extract_column_text(ctx.resultColumn)
        
        # Extract condition column texts
        condition_columns = []
        if ctx.conditionColumns:
            for col_ctx in ctx.conditionColumns:
                col_text = self._extract_column_text(col_ctx)
                condition_columns.append(col_text)
        
        return {
            'result_column': result_column_text,
            'condition_columns': condition_columns
        }

    def visitBeslistabelRow(self, ctx: AntlrParser.BeslistabelRowContext) -> BeslistabelRow:
        """Visit a data row and build a BeslistabelRow AST node."""
        row_number = int(ctx.rowNumber.text)
        result_expression = self.visitExpressie(ctx.resultExpression)
        
        # Visit each cell value
        condition_values = []
        if ctx.conditionValues:
            for cell_ctx in ctx.conditionValues:
                cell_value = self.visitBeslistabelCellValue(cell_ctx)
                condition_values.append(cell_value)
        
        return BeslistabelRow(
            row_number=row_number,
            result_expression=result_expression,
            condition_values=condition_values,
            span=self.get_span(ctx)
        )

    def visitBeslistabelCellValue(self, ctx: AntlrParser.BeslistabelCellValueContext):
        """Visit a cell value which can be an expression or n.v.t."""
        if ctx.NVT():
            # Return a special literal for "n.v.t."
            return Literal(
                value="n.v.t.",
                datatype="Tekst",
                span=self.get_span(ctx)
            )
        else:
            # Regular expression
            return self.visitExpressie(ctx.expressie())

    def _extract_column_text(self, ctx) -> str:
        """Extract text from a column header context, preserving spaces."""
        if not ctx:
            return ""
        
        # Get all tokens between pipes
        text_parts = []
        for child in ctx.children:
            if isinstance(child, TerminalNode):
                text_parts.append(child.getText())
            else:
                text_parts.append(get_text_with_spaces(child))
        
        # Join and clean up
        text = " ".join(text_parts).strip()
        return text
    
    # Timeline Period Definition Visitors
    
    def visitVanafPeriode(self, ctx: AntlrParser.VanafPeriodeContext) -> PeriodDefinition:
        """Handle 'vanaf [date]' period definition."""
        date_expr = self.visit(ctx.dateExpression())
        logger.debug(f"visitVanafPeriode: date_expr = {date_expr}")
        return PeriodDefinition(
            period_type="vanaf",
            start_date=date_expr,
            end_date=None,
            span=self.get_span(ctx)
        )
    
    def visitTotPeriode(self, ctx: AntlrParser.TotPeriodeContext) -> PeriodDefinition:
        """Handle 'tot [date]' period definition."""
        date_expr = self.visit(ctx.dateExpression())
        return PeriodDefinition(
            period_type="tot",
            start_date=None,
            end_date=date_expr,
            span=self.get_span(ctx)
        )
    
    def visitTotEnMetPeriode(self, ctx: AntlrParser.TotEnMetPeriodeContext) -> PeriodDefinition:
        """Handle 'tot en met [date]' period definition."""
        date_expr = self.visit(ctx.dateExpression())
        return PeriodDefinition(
            period_type="tot_en_met",
            start_date=None,
            end_date=date_expr,
            span=self.get_span(ctx)
        )
    
    def visitVanTotPeriode(self, ctx: AntlrParser.VanTotPeriodeContext) -> PeriodDefinition:
        """Handle 'van [date] tot [date]' period definition."""
        date_exprs = [self.visit(de) for de in ctx.dateExpression()]
        return PeriodDefinition(
            period_type="van_tot",
            start_date=date_exprs[0] if len(date_exprs) > 0 else None,
            end_date=date_exprs[1] if len(date_exprs) > 1 else None,
            span=self.get_span(ctx)
        )
    
    def visitVanTotEnMetPeriode(self, ctx: AntlrParser.VanTotEnMetPeriodeContext) -> PeriodDefinition:
        """Handle 'van [date] tot en met [date]' period definition."""
        date_exprs = [self.visit(de) for de in ctx.dateExpression()]
        return PeriodDefinition(
            period_type="van_tot_en_met",
            start_date=date_exprs[0] if len(date_exprs) > 0 else None,
            end_date=date_exprs[1] if len(date_exprs) > 1 else None,
            span=self.get_span(ctx)
        )
    
    def visitDateExpression(self, ctx: AntlrParser.DateExpressionContext) -> Expression:
        """Handle date expressions (literal dates, REKENDATUM, REKENJAAR, or attribute references)."""
        logger.debug(f"visitDateExpression called with: {safe_get_text(ctx)}")
        if ctx.datumLiteral():
            # Extract the date literal value
            date_ctx = ctx.datumLiteral()
            if date_ctx.DATE_TIME_LITERAL():
                date_text = date_ctx.DATE_TIME_LITERAL().getText()
            else:
                date_text = safe_get_text(date_ctx)
            result = Literal(value=date_text, datatype="Datum", span=self.get_span(ctx))
            logger.debug(f"  -> datumLiteral result: {result}")
            return result
        elif ctx.REKENDATUM():
            # REKENDATUM is a parameter reference
            result = ParameterReference(parameter_name="rekendatum", span=self.get_span(ctx))
            logger.debug(f"  -> REKENDATUM result: {result}")
            return result
        elif ctx.REKENJAAR():
            # REKENJAAR is a parameter reference
            result = ParameterReference(parameter_name="rekenjaar", span=self.get_span(ctx))
            logger.debug(f"  -> REKENJAAR result: {result}")
            return result
        elif ctx.attribuutReferentie():
            result = self.visitAttribuutReferentie(ctx.attribuutReferentie())
            logger.debug(f"  -> attribuutReferentie result: {result}")
            return result
        else:
            logger.error(f"Unknown date expression type: {safe_get_text(ctx)}")
            return None

    def visitConditieBijExpressie(self, ctx: AntlrParser.ConditieBijExpressieContext) -> Expression:
        """Handle conditional expressions for aggregations and tijdsevenredig functions."""
        logger.debug(f"visitConditieBijExpressie called with: {safe_get_text(ctx)}")

        # Check if it's a "gedurende de tijd dat" condition
        if ctx.GEDURENDE_DE_TIJD_DAT():
            # Return the condition expression directly
            condition = ctx.expressie()
            if condition:
                result = self.visitExpressie(condition)
                logger.debug(f"  -> GEDURENDE_DE_TIJD_DAT result: {result}")
                return result

        # Check if it's a period comparison (VANAF, VAN...TOT, etc.)
        elif ctx.periodevergelijkingEnkelvoudig():
            period_ctx = ctx.periodevergelijkingEnkelvoudig()
            # For now, we'll create a placeholder expression for period comparisons
            # This may need more sophisticated handling depending on engine requirements
            logger.warning(f"Period comparison in conditieBijExpressie not fully implemented: {safe_get_text(period_ctx)}")
            # Return a placeholder literal to avoid the list issue
            return Literal(value=safe_get_text(period_ctx), datatype="Tekst", span=self.get_span(ctx))

        # Fallback - should not happen if grammar is correct
        logger.error(f"Unknown conditieBijExpressie type: {safe_get_text(ctx)}")
        # Return a placeholder to avoid list issues
        return Literal(value="unknown_condition", datatype="Tekst", span=self.get_span(ctx)) 