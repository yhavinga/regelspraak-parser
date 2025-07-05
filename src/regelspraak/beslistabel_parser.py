"""Parser for Beslistabel (decision table) column headers.

This module handles parsing natural language patterns in decision table
column headers into proper AST expressions that can be evaluated.
"""

import re
from typing import Optional, Tuple, List, Union
from dataclasses import dataclass

from . import ast
from .ast import (
    Expression, BinaryExpression, AttributeReference, ParameterReference,
    VariableReference, Literal, Operator, SourceSpan
)


@dataclass
class ParsedCondition:
    """Result of parsing a condition column header."""
    subject_path: List[str]  # e.g., ["leeftijd"] or ["reisduur", "reis"]
    object_type: Optional[str]  # e.g., "Natuurlijk persoon" or "passagier"
    operator: Optional[Operator]  # e.g., GELIJK_AAN, GROTER_DAN
    is_kenmerk_check: bool = False  # True for "heeft" patterns
    kenmerk_name: Optional[str] = None  # For kenmerk checks


@dataclass  
class ParsedResult:
    """Result of parsing a result column header."""
    target_type: str  # "attribute" or "kenmerk"
    attribute_path: Optional[List[str]]  # For attribute assignments
    kenmerk_name: Optional[str]  # For kenmerk assignments
    object_type: str  # e.g., "Natuurlijk persoon", "passagier"


class BeslistabelParser:
    """Parser for decision table column headers."""
    
    # Condition patterns - ordered from most specific to least specific
    CONDITION_PATTERNS = [
        # "indien de [attribute] van zijn [object] [operator]" - MUST come before simple_attribute
        (r"indien\s+de\s+(.+?)\s+van\s+(?:zijn|haar|de|een)\s+(.+?)\s+(gelijk\s+is\s+aan|groter\s+is\s+dan|groter\s+of\s+gelijk\s+is\s+aan|kleiner\s+is\s+dan|kleiner\s+of\s+gelijk\s+is\s+aan)\s*$",
         "attribute_of_object"),
        # "indien zijn [attribute] gelijk is aan"
        (r"indien\s+(?:zijn|haar|de)\s+(.+?)\s+(gelijk\s+is\s+aan|groter\s+is\s+dan|groter\s+of\s+gelijk\s+is\s+aan|kleiner\s+is\s+dan|kleiner\s+of\s+gelijk\s+is\s+aan)\s*$",
         "simple_attribute"),
        # "indien hij een [kenmerk] heeft" or "indien hij [kenmerk] heeft"
        (r"indien\s+(?:hij|zij|het)\s+(?:een\s+)?(.+?)\s+heeft\s*$",
         "kenmerk_check"),
        # "indien [object] [operator]" (for simple object type checks)
        (r"indien\s+(.+?)\s+(is|gelijk\s+is\s+aan)\s*$",
         "object_check"),
    ]
    
    # Result patterns
    RESULT_PATTERNS = [
        # "de [attribute] van een [object] moet gesteld worden op"
        (r"de\s+(.+?)\s+van\s+een\s+(.+?)\s+moet\s+(?:gesteld\s+worden\s+op|berekend\s+worden\s+als)\s*$",
         "attribute_assignment"),
        # "de [attribute] moet gesteld worden op"
        (r"de\s+(.+?)\s+moet\s+(?:gesteld\s+worden\s+op|berekend\s+worden\s+als)\s*$",
         "simple_attribute_assignment"),
        # "een [object] is [kenmerk]"
        (r"een\s+(.+?)\s+is\s+(.+?)\s*$",
         "kenmerk_assignment"),
        # "[object] is [kenmerk]" (without "een")
        (r"(.+?)\s+is\s+(.+?)\s*$",
         "simple_kenmerk_assignment"),
    ]
    
    # Operator mapping
    OPERATOR_MAP = {
        "gelijk is aan": Operator.GELIJK_AAN,
        "is": Operator.GELIJK_AAN,
        "groter is dan": Operator.GROTER_DAN,
        "groter of gelijk is aan": Operator.GROTER_OF_GELIJK_AAN,
        "kleiner is dan": Operator.KLEINER_DAN,
        "kleiner of gelijk is aan": Operator.KLEINER_OF_GELIJK_AAN,
    }
    
    def parse_condition_column(self, header_text: str) -> Optional[ParsedCondition]:
        """Parse a condition column header into a structured form."""
        header_text = header_text.strip()
        
        for pattern, pattern_type in self.CONDITION_PATTERNS:
            match = re.match(pattern, header_text, re.IGNORECASE)
            if match:
                if pattern_type == "simple_attribute":
                    # e.g., "indien zijn leeftijd gelijk is aan"
                    attribute = match.group(1).strip()
                    operator_text = match.group(2).strip()
                    return ParsedCondition(
                        subject_path=[attribute],
                        object_type=None,  # Will be inferred from context
                        operator=self.OPERATOR_MAP.get(operator_text.lower()),
                        is_kenmerk_check=False
                    )
                    
                elif pattern_type == "attribute_of_object":
                    # e.g., "indien de reisduur per trein in minuten van zijn reis groter is dan"
                    attribute = match.group(1).strip()
                    object_ref = match.group(2).strip()
                    operator_text = match.group(3).strip()
                    
                    # Build path as [attribute, object]
                    return ParsedCondition(
                        subject_path=[attribute, object_ref],
                        object_type=None,
                        operator=self.OPERATOR_MAP.get(operator_text.lower()),
                        is_kenmerk_check=False
                    )
                    
                elif pattern_type == "kenmerk_check":
                    # e.g., "indien hij een recht op duurzaamheidskorting heeft"
                    kenmerk = match.group(1).strip()
                    return ParsedCondition(
                        subject_path=[],
                        object_type=None,
                        operator=None,
                        is_kenmerk_check=True,
                        kenmerk_name=kenmerk
                    )
                    
                elif pattern_type == "object_check":
                    # e.g., "indien provincie is"
                    subject = match.group(1).strip()
                    operator_text = match.group(2).strip()
                    return ParsedCondition(
                        subject_path=[subject],
                        object_type=None,
                        operator=self.OPERATOR_MAP.get(operator_text.lower()),
                        is_kenmerk_check=False
                    )
        
        return None
    
    def parse_result_column(self, header_text: str) -> Optional[ParsedResult]:
        """Parse a result column header to extract the target."""
        header_text = header_text.strip()
        
        for pattern, pattern_type in self.RESULT_PATTERNS:
            match = re.match(pattern, header_text, re.IGNORECASE)
            if match:
                if pattern_type == "attribute_assignment":
                    # e.g., "de woonregio factor van een Natuurlijk persoon moet gesteld worden op"
                    attribute = match.group(1).strip()
                    object_type = match.group(2).strip()
                    return ParsedResult(
                        target_type="attribute",
                        attribute_path=[attribute],
                        kenmerk_name=None,
                        object_type=object_type
                    )
                    
                elif pattern_type == "simple_attribute_assignment":
                    # e.g., "de belasting moet gesteld worden op"
                    attribute = match.group(1).strip()
                    return ParsedResult(
                        target_type="attribute",
                        attribute_path=[attribute],
                        kenmerk_name=None,
                        object_type=""  # Will be inferred from context
                    )
                    
                elif pattern_type in ["kenmerk_assignment", "simple_kenmerk_assignment"]:
                    # e.g., "een passagier is minderjarig"
                    if pattern_type == "kenmerk_assignment":
                        object_type = match.group(1).strip()
                        kenmerk = match.group(2).strip()
                    else:
                        object_type = match.group(1).strip()
                        kenmerk = match.group(2).strip()
                    
                    return ParsedResult(
                        target_type="kenmerk",
                        attribute_path=None,
                        kenmerk_name=kenmerk,
                        object_type=object_type
                    )
        
        return None
    
    def build_condition_expression(self, parsed_condition,
                                 cell_value: Expression,
                                 current_object_type: str,
                                 span: SourceSpan) -> Optional[Expression]:
        """Build an AST expression from a parsed condition and cell value."""
        if parsed_condition.is_kenmerk_check:
            # For kenmerk checks, we compare against the cell value (usually "waar" or "onwaar")
            # Build: current_object heeft kenmerk == cell_value
            kenmerk_ref = AttributeReference(
                span=span,
                path=[parsed_condition.kenmerk_name]
            )
            return BinaryExpression(
                span=span,
                left=kenmerk_ref,
                operator=Operator.GELIJK_AAN,
                right=cell_value
            )
        
        elif parsed_condition.operator:
            # Build attribute reference from subject path
            if len(parsed_condition.subject_path) == 1:
                # Simple attribute like "leeftijd" or "provincie"  
                left_expr = AttributeReference(
                    span=span,
                    path=parsed_condition.subject_path
                )
            else:
                # Complex path like ["reisduur per trein", "reis"]
                # For now, treat as attribute path
                left_expr = AttributeReference(
                    span=span,
                    path=parsed_condition.subject_path
                )
            
            # Build comparison expression
            return BinaryExpression(
                span=span,
                left=left_expr,
                operator=parsed_condition.operator,
                right=cell_value
            )
        
        return None