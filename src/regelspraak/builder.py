"""RegelSpraak AST builder: Converts ANTLR parse trees to domain AST nodes."""
from typing import Dict, List, Any, Optional
import logging

# Import ANTLR generated files
from ._antlr.RegelSpraakParser import RegelSpraakParser as AntlrParser
from ._antlr.RegelSpraakVisitor import RegelSpraakVisitor
from antlr4.ParserRuleContext import ParserRuleContext
from antlr4.tree.Tree import TerminalNode

# Import AST nodes
from .ast import (
    DomainModel, ObjectType, Attribuut, Kenmerk, Regel, Parameter, Domein,
    FeitType, Rol, Voorwaarde, ResultaatDeel, Gelijkstelling, KenmerkToekenning,
    ObjectCreatie, FeitCreatie, Consistentieregel, Initialisatie, Dagsoortdefinitie, Verdeling,
    VerdelingMethode, VerdelingGelijkeDelen, VerdelingNaarRato, VerdelingOpVolgorde,
    VerdelingTieBreak, VerdelingMaximum, VerdelingAfronding,
    Expression, Literal, AttributeReference, VariableReference,
    BinaryExpression, UnaryExpression, FunctionCall, Operator,
    ParameterReference, SourceSpan, Beslistabel, BeslistabelRow,
    BeslistabelCondition, BeslistabelResult, Dimension, DimensionLabel,
    DimensionedAttributeReference
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
            # Directly process terminal children
            nodes_to_process = [child for child in name_ctx.children if isinstance(child, TerminalNode)]
            logger.debug(f"      Processing direct children for ParameterNamePhrase: {[safe_get_text(n) for n in nodes_to_process]}")

        elif isinstance(name_ctx, AntlrParser.RegelNameContext):
            # Check if it contains a naamwoord
            if hasattr(name_ctx, 'naamwoord') and name_ctx.naamwoord():
                # Delegate to naamwoord processing
                return self._extract_canonical_name(name_ctx.naamwoord())
            else:
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
                elif isinstance(definition, FeitType):
                    domain_model.feittypen[definition.naam] = definition
                elif isinstance(definition, Dimension):
                    domain_model.dimensions[definition.naam] = definition
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
    
    def visitNaamwoordNoIs(self, ctx: AntlrParser.NaamwoordNoIsContext) -> Optional[str]:
        """Visit a naamwoordNoIs context and extract the complete noun phrase including prepositions."""
        logger.debug(f"    Visiting NaamwoordNoIs: Text='{safe_get_text(ctx)}', Type={type(ctx).__name__}, ChildCount={ctx.getChildCount()}")
        
        # Process all parts of the naamwoordNoIs according to grammar:
        # naamwoordNoIs : naamPhraseNoIs ( voorzetsel naamPhraseNoIs )*
        all_parts = []
        
        # Get all naamPhraseNoIs contexts
        naam_phrases = ctx.naamPhraseNoIs()
        if not isinstance(naam_phrases, list):
            naam_phrases = [naam_phrases] if naam_phrases else []
        
        # Process the complete structure
        for i in range(ctx.getChildCount()):
            child = ctx.getChild(i)
            
            if type(child).__name__ == 'NaamPhraseNoIsContext':
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
                # Add the preposition
                all_parts.append(safe_get_text(child))
        
        # Join all parts with spaces
        final_noun = " ".join(all_parts) if all_parts else safe_get_text(ctx)
        
        logger.debug(f"    visitNaamwoordNoIs returning: '{final_noun}'")
        return final_noun
    

    def visitKenmerkNaam(self, ctx: AntlrParser.KenmerkNaamContext) -> str:
        """Extract the name string from a kenmerkNaam context."""
        # Can be identifier or naamwoord
        return safe_get_text(ctx)

    def visitBasisOnderwerpToString(self, ctx: AntlrParser.BasisOnderwerpContext) -> str:
        """Extracts a string representation from basisOnderwerp."""
        # Handles pronoun (HIJ) or identifierOrKeyword
        if ctx.HIJ():
            return "self" # Represent pronoun as 'self' or similar context key
        elif ctx.identifierOrKeyword():
            # Combine identifierOrKeyword tokens
            text = " ".join([id_token.getText() for id_token in ctx.identifierOrKeyword()])
            
            # If contains "van", only return first part
            # This handles cases where grammar groups "de burgemeester van de hoofdstad" as one basisOnderwerp
            if " van " in text:
                return text.split(" van ")[0].strip()
            
            return text
        return "<unknown_basis_onderwerp>"

    # 5. Reference Construction Methods
    def visitAttribuutReferentie(self, ctx: AntlrParser.AttribuutReferentieContext) -> Optional[Expression]:
        """Visit an attribute reference and build an AttributeReference or DimensionedAttributeReference object."""
        # Get the attribute part
        attribute_part = self.visitAttribuutMetLidwoord(ctx.attribuutMetLidwoord())
        
        # Also get the raw naamwoord text to check for dimension patterns and nested paths
        raw_attribute_text = None
        if ctx.attribuutMetLidwoord() and ctx.attribuutMetLidwoord().naamwoord():
            raw_attribute_text = self.visitNaamwoord(ctx.attribuutMetLidwoord().naamwoord())
        
        # Check if the raw attribute contains nested path info that was split off
        prepositional_dimension = None
        additional_path_elements = []
        if raw_attribute_text and " van " in raw_attribute_text and raw_attribute_text != attribute_part:
            # Extract the parts that were removed
            parts = raw_attribute_text.split(" van ")
            if len(parts) > 1:
                # Check if this is a dimension pattern or a nested path
                dimension_keywords = ["jaar", "maand", "dag", "kwartaal", "periode", "vorig", "huidig", "volgend"]
                remaining_parts = parts[1:]
                
                for part in remaining_parts:
                    part = part.strip()
                    if any(keyword in part.lower() for keyword in dimension_keywords):
                        # This is a dimension
                        prepositional_dimension = part
                    else:
                        # This is part of the path (e.g., "burgemeester" in "naam van burgemeester")
                        additional_path_elements.append(part)
        
        # Recursively build the path from the nested onderwerpReferentie
        base_path = self.visitOnderwerpReferentieToPath(ctx.onderwerpReferentie())
        if not base_path:
             logger.error(f"Could not parse base path for attribute reference: {safe_get_text(ctx)}")
             return None
        
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
        
        # Build the full path: [attribute_name] + additional_path_elements + base_path
        full_path = [actual_attribute_name] + additional_path_elements + final_base_path
        
        # Create the base attribute reference
        base_attr_ref = AttributeReference(path=full_path, span=self.get_span(ctx))
        
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
        # Now that attribuutMetLidwoord contains a naamwoord, delegate to it
        if ctx.naamwoord():
            # Get the full text via visitNaamwoord which already strips articles
            result = self.visitNaamwoord(ctx.naamwoord())
            # If the attribute name contains "van", extract just the first part
            # This handles both dimension patterns and nested path patterns
            if " van " in result:
                # For patterns like "naam van burgemeester", we want just "naam"
                parts = result.split(" van ", 1)  # Split only on first "van"
                return parts[0].strip()
            return result
        # Fallback to full text if no naamwoord (shouldn't happen with new grammar)
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
        
        Grammar: onderwerpReferentie : basisOnderwerp ( voorzetsel basisOnderwerp )*
        Example: "de straat van het adres van de persoon" -> ["straat", "adres", "persoon"]
        """
        path = []
        
        # Process all basisOnderwerp elements in the onderwerpReferentie
        basis_onderwerpen = ctx.basisOnderwerp()
        if not isinstance(basis_onderwerpen, list):
            basis_onderwerpen = [basis_onderwerpen] if basis_onderwerpen else []
        
        logger.debug(f"visitOnderwerpReferentieToPath: found {len(basis_onderwerpen)} basisOnderwerp elements")
        
        # Extract text from each basisOnderwerp
        for i, basis_ctx in enumerate(basis_onderwerpen):
            path_part = self.visitBasisOnderwerpToString(basis_ctx)
            logger.debug(f"  basisOnderwerp[{i}]: '{path_part}'")
            if path_part:
                path.append(path_part)
        
        # Path is built in the order of the grammar
        # For "de straat van het adres van de persoon", we get ["straat", "adres", "persoon"]
        logger.debug(f"  Final path: {path}")
        return path

    def visitOnderwerpReferentie(self, ctx: AntlrParser.OnderwerpReferentieContext) -> Optional[AttributeReference]:
        """Visit onderwerp referentie and convert to AttributeReference.
        
        This handles references like "hij", "de persoon", "het adres van de persoon", etc.
        """
        # Convert to path using existing helper
        path = self.visitOnderwerpReferentieToPath(ctx)
        
        if not path:
            logger.warning(f"Empty path from onderwerp referentie: {safe_get_text(ctx)}")
            return None
        
        # Special case: If path is just ["self"], create a special reference to current instance
        # The engine will handle this specially
        if path == ["self"]:
            # Return a special marker that the engine will recognize
            # For now, return AttributeReference with ["self"] and let engine handle it
            return AttributeReference(path=["self"], span=self.get_span(ctx))
        
        # Otherwise create normal AttributeReference
        return AttributeReference(path=path, span=self.get_span(ctx))
    
    # 6. Expression Hierarchy Visitors
    def visitExpressie(self, ctx: AntlrParser.ExpressieContext) -> Optional[Expression]:
        """Visit the top-level expressie rule. Always delegates to its single child."""
        # According to typical ANTLR grammar structure for expressions,
        # the 'expressie' rule usually just points to the start of the
        # precedence climbing (e.g., logicalExpression).
        if ctx.logicalExpression():
            return self.visitLogicalExpression(ctx.logicalExpression())
        else:
            # This case should generally not happen if the grammar is well-formed.
            logger.error(f"ExpressieContext has no logicalExpression child: {safe_get_text(ctx)}")
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
            # visitNaamwoord returns a string, so use it directly
            kenmerk_name = self.visitNaamwoord(ctx.naamwoord()) if hasattr(self, 'visitNaamwoord') else ctx.naamwoord().getText()
            # Create a Literal with the kenmerk name, not a VariableReference
            right_expr = Literal(value=kenmerk_name, datatype="Tekst", span=self.get_span(ctx.naamwoord()))
            if left_expr is None: return None
            # For now, just use IS operator. Negation should be handled at a different level
            op = Operator.IS
            return BinaryExpression(left=left_expr, operator=op, right=right_expr, span=self.get_span(ctx))
        elif isinstance(ctx, AntlrParser.HeeftKenmerkExprContext):
            left_expr = self.visitAdditiveExpression(ctx.left)
            # visitNaamwoord returns a string, so use it directly
            kenmerk_name = self.visitNaamwoord(ctx.naamwoord()) if hasattr(self, 'visitNaamwoord') else ctx.naamwoord().getText()
            # Create a Literal with the kenmerk name, not a VariableReference
            right_expr = Literal(value=kenmerk_name, datatype="Tekst", span=self.get_span(ctx.naamwoord()))
            if left_expr is None: return None
            # For now, just use HEEFT operator. Negation should be handled at a different level
            op = Operator.HEEFT
            return BinaryExpression(left=left_expr, operator=op, right=right_expr, span=self.get_span(ctx))
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
            left_expr = self.visit(ctx.primaryExpression(0))
            right_expr = self.visit(ctx.primaryExpression(1))
            operator = Operator.PLUS if ctx.PLUS() else Operator.MIN
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
        elif isinstance(ctx, AntlrParser.TijdsevenredigDeelExprContext):
            # HET_TIJDSEVENREDIG_DEEL_PER (MAAND | JAAR) VAN expressie (GEDURENDE_DE_TIJD_DAT condition=expressie)?
            expr = self.visitExpressie(ctx.expressie())
            if expr is None: return None
            
            # Determine period type
            period = "maand" if ctx.MAAND() else "jaar"
            
            # Check for condition
            args = [expr]
            if ctx.condition:
                condition = self.visitExpressie(ctx.condition)
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
            unit = ctx.unitName.text if hasattr(ctx, 'unitName') and ctx.unitName else None
            
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
            unit = ctx.unitName.text if hasattr(ctx, 'unitName') and ctx.unitName else None
            
            func_call = FunctionCall(
                function_name="absolute_tijdsduur_van",
                arguments=[from_expr, to_expr],
                unit_conversion=unit,
                span=self.get_span(ctx)
            )
            return func_call
            
        elif isinstance(ctx, AntlrParser.AantalFuncExprContext):
            # HET? AANTAL (ALLE? onderwerpReferentie)
            # Get the subject reference
            subject_ref = None
            if ctx.onderwerpReferentie():
                subject_ref = self.visitOnderwerpReferentie(ctx.onderwerpReferentie())
            
            if subject_ref is None:
                logger.warning(f"No subject reference found in aantal function: {safe_get_text(ctx)}")
                return None
                
            return FunctionCall(
                function_name="het_aantal",
                arguments=[subject_ref],
                span=self.get_span(ctx)
            )
            
        elif isinstance(ctx, AntlrParser.PercentageFuncExprContext) or \
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
            
            # Handle specific date function contexts
            if isinstance(ctx, AntlrParser.DateCalcExprContext):
                # This is a date calculation pattern like "date + 5 days"
                # But sometimes the grammar incorrectly matches complex expressions
                # If this doesn't look like a date calculation, return None to handle elsewhere
                identifier_text = ctx.identifier().getText() if ctx.identifier() else ""
                time_units = ["dagen", "maanden", "jaren", "weken", "uren", "minuten", "seconden"]
                
                if not any(unit in identifier_text.lower() for unit in time_units):
                    # This is not a date calculation, don't handle it here
                    return None
                
                # This is a date calculation
                left_expr = self.visit(ctx.primaryExpression(0))
                right_expr = self.visit(ctx.primaryExpression(1))
                operator = Operator.PLUS if ctx.PLUS() else Operator.MIN
                
                return FunctionCall(
                    function_name="datum_calc",
                    arguments=[left_expr, right_expr],
                    unit_conversion=identifier_text,
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
                
                # Process the optional time condition
                if hasattr(ctx, 'condition') and ctx.condition:
                    cond_ctx = ctx.condition
                    # Handle case where condition might be a list
                    if isinstance(cond_ctx, list):
                        cond_ctx = cond_ctx[0] if cond_ctx else None
                    if cond_ctx:
                        condition_expr = self.visitExpressie(cond_ctx)
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
                    # "alle X" pattern
                    alle_dim_ctx = dim_select_ctx.aggregerenOverAlleDimensies()
                    if alle_dim_ctx.naamwoord():
                        # Build an AttributeReference for the collection
                        collection_path = [self._extract_canonical_name(alle_dim_ctx.naamwoord())]
                        collection_ref = AttributeReference(
                            path=collection_path,
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
            
            # For other aggregation types, we already returned in the specific handlers above
            logger.warning(f"Unhandled aggregation context type: {type(ctx).__name__}")
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
            # Handle concatenation expressions (e.g., "X, Y en Z")
            return self.visitConcatenatieExpressie(ctx)
        elif isinstance(ctx, AntlrParser.DateCalcExprContext):
            # This is actually a date calculation pattern like "date + 5 days"
            # But sometimes the grammar incorrectly matches complex expressions
            # If this doesn't look like a date calculation, handle as binary expression
            left_expr = self.visit(ctx.primaryExpression(0))
            right_expr = self.visit(ctx.primaryExpression(1))
            
            # Check if the identifier looks like a time unit (dagen, maanden, jaren)
            identifier_text = ctx.identifier().getText() if ctx.identifier() else ""
            time_units = ["dagen", "maanden", "jaren", "weken", "uren", "minuten", "seconden"]
            
            if any(unit in identifier_text.lower() for unit in time_units):
                # This is a date calculation
                operator = Operator.PLUS if ctx.PLUS() else Operator.MIN
                # Create a function call for date arithmetic
                return FunctionCall(
                    function_name="datum_calc",
                    arguments=[left_expr, right_expr],
                    unit_conversion=identifier_text,
                    span=self.get_span(ctx)
                )
            else:
                # This is not a date calculation, handle as regular binary expression
                operator = Operator.PLUS if ctx.PLUS() else Operator.MIN
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
            param_name_ctx = ctx.parameterMetLidwoord().naamwoord() # Drill down
            param_name = self._extract_canonical_name(param_name_ctx)
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
            
            # Build path from onderwerp reference parts
            path = self.visitOnderwerpReferentieToPath(onderwerp_ref)
            logger.debug(f"    Built path: {path}")
            
            # Check if this is a single-element path that might be a parameter
            if len(path) == 1 and path[0] in self.parameter_names:
                logger.debug(f"    Recognized as parameter: '{path[0]}'")
                return ParameterReference(parameter_name=path[0], span=self.get_span(ctx))
            
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

    def visitConcatenatieExpressie(self, ctx) -> Optional[FunctionCall]:
        """Visit concatenation expression (e.g., "X, Y en Z")."""
        # This handles expressions like "het gemiddelde van X, Y en Z"
        # which becomes a function call with multiple arguments
        
        # The parent context should tell us what function we're in
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
        
        # Collect all expressions in the concatenation
        args = []
        for i in range(ctx.getChildCount()):
            child = ctx.getChild(i)
            # Skip commas and "en"
            if hasattr(child, 'accept'):  # It's a parse tree node
                if hasattr(child, 'getText') and child.getText() in [',', 'en']:
                    continue
                expr = self.visit(child)
                if expr:
                    args.append(expr)
        
        # If we have a function name, return a FunctionCall
        if func_name and args:
            return FunctionCall(
                function_name=func_name,
                arguments=args,
                span=self.get_span(ctx)
            )
        
        # Otherwise, just return the arguments as a special marker
        # This shouldn't happen in well-formed expressions
        logger.warning(f"Concatenation expression without clear function context: {safe_get_text(ctx)}")
        return None

    def visitSubordinateClauseExpression(self, ctx: AntlrParser.SubordinateClauseExpressionContext) -> Optional[Expression]:
        """Visit Dutch subordinate clause expressions (Subject-Object-Verb order)."""
        if isinstance(ctx, AntlrParser.SubordinateHasExprContext):
            # Pattern: subject object verb=HEEFT (e.g., "hij een recht op korting heeft")
            subject = self.visitOnderwerpReferentie(ctx.subject)
            # The 'object' field might be reserved in Python, check for object_
            object_ctx = ctx.object_ if hasattr(ctx, 'object_') else ctx.object
            object_name = object_ctx.getText()
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
            # Pattern: subject prepPhrase verb=IS (e.g., "hij met vakantie is")
            subject = self.visitOnderwerpReferentie(ctx.subject)
            prep_phrase = ctx.prepPhrase.getText()
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
            kenmerk_name = ctx.kenmerk.getText()
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
        else:
            # Log if the definition context contains something unexpected
            # Use safe_get_text helper function
            child_text = safe_get_text(ctx.getChild(0)) if ctx.getChildCount() > 0 else "empty"
            if ctx.getChildCount() > 0 and not isinstance(ctx.getChild(0), (AntlrParser.ObjectTypeDefinitionContext, AntlrParser.DomeinDefinitionContext, AntlrParser.ParameterDefinitionContext, AntlrParser.FeitTypeDefinitionContext, AntlrParser.DimensieDefinitionContext, TerminalNode)):
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
        naam = self.visitNaamwoord(ctx.naamwoord())
        datatype_str = None
        if ctx.datatype():
            datatype_str = safe_get_text(ctx.datatype()) # Further parsing might be needed
        elif ctx.domeinRef():
            # Visit the domain reference to get the domain name
            datatype_str = self.visitDomeinRef(ctx.domeinRef())

        eenheid = None
        if ctx.MET_EENHEID():
            if ctx.unitName:
                eenheid = ctx.unitName.text
            elif ctx.PERCENT_SIGN():
                eenheid = "%"
            elif ctx.EURO_SYMBOL():
                eenheid = "€"
            elif ctx.DOLLAR_SYMBOL():
                eenheid = "$"
        if not naam or not datatype_str:
             logger.error(f"Could not parse attribute: name='{naam}', datatype='{datatype_str}' in {safe_get_text(ctx)}")
             return None

        # Handle GEDIMENSIONEERD_MET for dimension references
        dimensions = []
        if ctx.GEDIMENSIONEERD_MET():
            for dim_ref_ctx in ctx.dimensieRef():
                if dim_ref_ctx.name:
                    dimensions.append(dim_ref_ctx.name.text)
        
        return Attribuut(naam=naam, datatype=datatype_str, eenheid=eenheid, dimensions=dimensions, span=self.get_span(ctx))

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
        for rol_ctx in ctx.rolDefinition():
            rol = self.visitRolDefinition(rol_ctx)
            if rol:
                # Check if this looks like a valid role definition
                # A valid role should have the object_type as a single identifier
                # and typically starts with "de" or "het" (though grammar allows optional)
                # The cardinality line will have multiple words after the first identifier
                if self._is_valid_role_definition(rol_ctx):
                    rollen.append(rol)
                else:
                    logger.debug(f"Found cardinality prefix parsed as role: {rol}")
                    # This is likely the start of the cardinality line
                    # Extract the full text of this context with spaces preserved
                    cardinality_prefix = get_text_with_spaces(rol_ctx)
        
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
            
        # Get all words from the content
        words = []
        for child in ctx.content.children:
            if hasattr(child, 'getText'):
                words.append(child.getText())
        
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
        if len(words) < 2:
            logger.error(f"Role definition must have at least 2 words, got: {words}")
            return None
        
        # Split into role name and object type
        # Strategy: Find the last contiguous sequence of capitalized words - that's the object type
        # Everything before is the role name
        
        # Find where the last capitalized sequence starts
        object_type_start = -1
        in_capitalized_sequence = False
        
        for i in range(len(words) - 1, -1, -1):
            word = words[i]
            # Skip prepositions in our check
            if word in ['van', 'met', 'op', 'in', 'voor', 'over', 'bij', 'uit', 'tot', 'en']:
                if in_capitalized_sequence:
                    # We hit a preposition after finding capitalized words, so we're done
                    break
                continue
            
            if word and word[0].isupper():
                # This is a capitalized word
                object_type_start = i
                in_capitalized_sequence = True
            else:
                # Non-capitalized word
                if in_capitalized_sequence:
                    # We were in a capitalized sequence but hit a non-cap word, so we're done
                    break
        
        # If we didn't find any capitalized words, take the last word as object type
        if object_type_start == -1:
            object_type_start = len(words) - 1
        
        # Split the words
        role_words = words[:object_type_start]
        object_type_words = words[object_type_start:]
        
        # Validate
        if not role_words:
            # If no role words, maybe the entire thing is the object type
            # This happens with simple roles like "reis Vlucht"
            if len(words) == 2 and words[1][0].isupper():
                role_words = [words[0]]
                object_type_words = [words[1]]
            else:
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
            datatype_str = self.visitDomeinRef(ctx.domeinRef())

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
            elif hasattr(ctx, 'EURO_SYMBOL') and ctx.EURO_SYMBOL():
                eenheid = "€"
            elif hasattr(ctx, 'DOLLAR_SYMBOL') and ctx.DOLLAR_SYMBOL():
                eenheid = "$"

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

        # TODO: Parse version/validity info from ctx.regelVersie()

        return Regel(
            naam=naam,
            resultaat=resultaat,
            voorwaarde=voorwaarde,
            variabelen=variabelen,
            span=self.get_span(ctx)
        )

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
            resultaat=resultaat,
            voorwaarde=voorwaarde,
            variabelen={},  # Consistency rules don't have variables
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
        # The path structure represents the navigation: [attribute, "alle", object_type]
        return AttributeReference(
            path=[attr_plural, "alle", obj_type],
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
        if isinstance(ctx, AntlrParser.GelijkstellingResultaatContext):
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
            
            if is_initialization:
                return Initialisatie(
                    target=target_ref,
                    expressie=expr,
                    span=self.get_span(ctx)
                )
            else:
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
        elif isinstance(ctx, AntlrParser.ObjectCreatieResultaatContext):
            # Handle object creation
            object_ctx = ctx.objectCreatie()
            object_type = self.visit(object_ctx.objectType)
            
            # Parse attribute initializations if present
            attribute_inits = []
            if object_ctx.objectAttributeInit():
                # Parse initial attribute and its value
                init_ctx = object_ctx.objectAttributeInit()
                attr_name = self.visit(init_ctx.attribuut)
                value_expr = self.visit(init_ctx.waarde)
                attribute_inits.append((attr_name, value_expr))
                
                # Parse additional attributes using EN connector
                for vervolg in init_ctx.attributeInitVervolg():
                    attr = self.visit(vervolg.attribuut)
                    val = self.visit(vervolg.waarde)
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
            
            # Include the article in the subject text if present
            if pattern_ctx.article1:
                article1_text = pattern_ctx.article1.text
                subject1_text = f"{article1_text} {subject1_text}"
            
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
            
            # Include the article in the subject text if present
            if pattern_ctx.article2:
                article2_text = pattern_ctx.article2.text
                subject2_text = f"{article2_text} {subject2_text}"
            
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

    def visitToplevelSamengesteldeVoorwaarde(self, ctx: AntlrParser.ToplevelSamengesteldeVoorwaardeContext) -> Optional[Expression]:
        """Visit a compound condition and build a logical expression."""
        # Extract the subject (onderwerpReferentie, HIJ, HET, ER, or ER_AAN)
        subject = None
        if ctx.onderwerpReferentie():
            subject = self.visitOnderwerpReferentie(ctx.onderwerpReferentie())
        elif ctx.HIJ():
            subject = VariableReference(variable_name="hij", span=self.get_span(ctx.HIJ()))
        elif ctx.HET():
            subject = VariableReference(variable_name="het", span=self.get_span(ctx.HET()))
        elif ctx.ER():
            subject = VariableReference(variable_name="er", span=self.get_span(ctx.ER()))
        elif ctx.ER_AAN():
            subject = VariableReference(variable_name="er", span=self.get_span(ctx.ER_AAN()))
        
        # Extract the quantification (alle, geen van de, ten minste één van de, etc.)
        quantifier = self.visitVoorwaardeKwantificatie(ctx.voorwaardeKwantificatie())
        
        # Extract all the condition parts
        conditions = []
        for onderdeel_ctx in ctx.samengesteldeVoorwaardeOnderdeel():
            condition = self.visitSamengesteldeVoorwaardeOnderdeel(onderdeel_ctx)
            if condition:
                conditions.append(condition)
        
        if not conditions:
            logger.error("No conditions found in compound condition")
            return None
        
        # Build the appropriate logical expression based on quantifier
        if quantifier == "alle":
            # All conditions must be true - use AND
            result = conditions[0]
            for condition in conditions[1:]:
                result = BinaryExpression(
                    left=result,
                    operator=Operator.EN,
                    right=condition,
                    span=self.get_span(ctx)
                )
            return result
        elif quantifier == "geen van de":
            # None of the conditions should be true - use NOT(OR)
            result = conditions[0]
            for condition in conditions[1:]:
                result = BinaryExpression(
                    left=result,
                    operator=Operator.OF,
                    right=condition,
                    span=self.get_span(ctx)
                )
            # Wrap in NOT
            return UnaryExpression(
                operator=Operator.NOT,
                operand=result,
                span=self.get_span(ctx)
            )
        elif quantifier.startswith("ten minste"):
            # At least one condition must be true - use OR
            result = conditions[0]
            for condition in conditions[1:]:
                result = BinaryExpression(
                    left=result,
                    operator=Operator.OF,
                    right=condition,
                    span=self.get_span(ctx)
                )
            return result
        else:
            logger.warning(f"Unknown quantifier: {quantifier}")
            return None

    def visitVoorwaardeKwantificatie(self, ctx: AntlrParser.VoorwaardeKwantificatieContext) -> str:
        """Extract the quantification type from the context."""
        if ctx.ALLE():
            return "alle"
        elif ctx.GEEN() and ctx.VAN() and ctx.DE():
            return "geen van de"
        elif ctx.TEN_MINSTE() or ctx.TENMINSTE():
            # Check which number is specified
            if ctx.EEN() or ctx.EEN_TELWOORD():
                return "ten minste één van de"
            elif ctx.TWEE_TELWOORD():
                return "ten minste twee van de"
            elif ctx.DRIE_TELWOORD():
                return "ten minste drie van de"
            elif ctx.VIER_TELWOORD():
                return "ten minste vier van de"
            else:
                return "ten minste één van de"  # Default
        elif ctx.TEN_HOOGSTE():
            # Similar logic for TEN_HOOGSTE
            if ctx.EEN() or ctx.EEN_TELWOORD():
                return "ten hoogste één van de"
            elif ctx.TWEE_TELWOORD():
                return "ten hoogste twee van de"
            elif ctx.DRIE_TELWOORD():
                return "ten hoogste drie van de"
            elif ctx.VIER_TELWOORD():
                return "ten hoogste vier van de"
            else:
                return "ten hoogste één van de"  # Default
        elif ctx.PRECIES():
            # Similar logic for PRECIES
            if ctx.EEN() or ctx.EEN_TELWOORD():
                return "precies één van de"
            elif ctx.TWEE_TELWOORD():
                return "precies twee van de"
            elif ctx.DRIE_TELWOORD():
                return "precies drie van de"
            elif ctx.VIER_TELWOORD():
                return "precies vier van de"
            else:
                return "precies één van de"  # Default
        else:
            return "unknown"

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

    def visitGenesteSamengesteldeVoorwaarde(self, ctx: AntlrParser.GenesteSamengesteldeVoorwaardeContext) -> Optional[Expression]:
        """Visit a nested compound condition."""
        # This is similar to toplevelSamengesteldeVoorwaarde but nested
        # Extract the subject
        subject = None
        if ctx.onderwerpReferentie():
            subject = self.visitOnderwerpReferentie(ctx.onderwerpReferentie())
        elif ctx.HIJ():
            subject = VariableReference(name="hij", span=self.get_span(ctx.HIJ()))
        elif ctx.ER():
            subject = VariableReference(name="er", span=self.get_span(ctx.ER()))
        
        # Extract the quantification
        quantifier = self.visitVoorwaardeKwantificatie(ctx.voorwaardeKwantificatie())
        
        # Extract all the condition parts
        conditions = []
        for onderdeel_ctx in ctx.samengesteldeVoorwaardeOnderdeel():
            condition = self.visitSamengesteldeVoorwaardeOnderdeel(onderdeel_ctx)
            if condition:
                conditions.append(condition)
        
        if not conditions:
            logger.error("No conditions found in nested compound condition")
            return None
        
        # Build the appropriate logical expression based on quantifier
        if quantifier == "alle":
            result = conditions[0]
            for condition in conditions[1:]:
                result = BinaryExpression(
                    left=result,
                    operator=Operator.EN,
                    right=condition,
                    span=self.get_span(ctx)
                )
            return result
        elif quantifier.startswith("ten minste"):
            result = conditions[0]
            for condition in conditions[1:]:
                result = BinaryExpression(
                    left=result,
                    operator=Operator.OF,
                    right=condition,
                    span=self.get_span(ctx)
                )
            return result
        else:
            logger.warning(f"Unknown quantifier in nested condition: {quantifier}")
            return None

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