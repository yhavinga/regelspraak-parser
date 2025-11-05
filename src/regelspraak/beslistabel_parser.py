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
        # "indien de/het [attribute] van zijn [object] [operator]" - MUST come before simple_attribute
        (r"indien\s+(?:de|het)\s+(.+?)\s+van\s+(?:zijn|haar|de|een)\s+(.+?)\s+(gelijk\s+is\s+aan|groter\s+is\s+dan|groter\s+of\s+gelijk\s+is\s+aan|kleiner\s+is\s+dan|kleiner\s+of\s+gelijk\s+is\s+aan)\s*$",
         "attribute_of_object"),
        # "indien zijn [attribute] gelijk is aan"
        (r"indien\s+(?:zijn|haar|de|het)\s+(.+?)\s+(gelijk\s+is\s+aan|groter\s+is\s+dan|groter\s+of\s+gelijk\s+is\s+aan|kleiner\s+is\s+dan|kleiner\s+of\s+gelijk\s+is\s+aan)\s*$",
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
                    
                    # Remove unit specifications from attribute name (e.g., "in jaren")
                    attribute = re.sub(r"\s+in\s+\w+$", "", attribute)
                    
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
                    
                    # Remove unit specifications from attribute name (e.g., "in minuten", "in euro")
                    # Common pattern: attribute ends with "in [unit]"
                    attribute = re.sub(r"\s+in\s+\w+$", "", attribute)
                    
                    # Check if there's a possessive pronoun before the object reference
                    # The regex captured "zijn|haar|de|een" but we need to check which one
                    full_match = match.group(0)
                    # Extract the part between "van" and the object
                    van_part = full_match[full_match.index(" van "):]
                    if " van zijn " in van_part:
                        object_ref_with_pronoun = "zijn " + object_ref
                    elif " van haar " in van_part:
                        object_ref_with_pronoun = "haar " + object_ref
                    elif " van hun " in van_part:
                        object_ref_with_pronoun = "hun " + object_ref
                    else:
                        object_ref_with_pronoun = object_ref
                    
                    # Build path as [object with possessive, attribute] - Dutch right-to-left navigation
                    return ParsedCondition(
                        subject_path=[object_ref_with_pronoun, attribute],
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
    
    def _parse_navigation_segments(self, text: str) -> List[str]:
        """Parse multi-segment navigation like 'postcode van het adres' into ['adres', 'postcode'].

        Handles patterns like:
        - 'postcode' → ['postcode']
        - 'postcode van het adres' → ['adres', 'postcode']
        - 'nummer van de kamer van het gebouw' → ['gebouw', 'kamer', 'nummer']
        - 'belasting op basis van reisduur' → ['belasting op basis van reisduur'] (protected)

        Returns segments in Dutch navigation order (outermost to innermost).
        """
        # Special case: check if this is a compound phrase that shouldn't be split
        # These patterns indicate a single attribute name, not navigation
        compound_patterns = [
            r'.*\s+op\s+basis\s+van\s+\w+',  # "X op basis van Y"
            r'.*\s+met\s+betrekking\s+tot\s+\w+',  # "X met betrekking tot Y"
            r'.*\s+ten\s+opzichte\s+van\s+\w+',  # "X ten opzichte van Y"
        ]

        # Check if this looks like a compound attribute (not navigation)
        # Only split if there's a "van" that's clearly navigation
        text_lower = text.lower()
        for pattern in compound_patterns:
            if re.match(pattern, text_lower):
                # This is a compound attribute, treat as single segment
                # But still check for navigation after it
                # e.g. "belasting op basis van reisduur van een passagier"
                # should become ["passagier", "belasting op basis van reisduur"]

                # Find the last "van" that's actually navigation
                # Split on "van een" or "van de" etc. but not "op basis van"
                nav_pattern = r'\s+van\s+(?:het|de|een|zijn|haar|hun|mijn|jouw|uw|onze|jullie|deze|die|dat|dit)\s+'
                nav_match = list(re.finditer(nav_pattern, text, re.IGNORECASE))

                if nav_match:
                    # Split at the last navigation "van"
                    last_match = nav_match[-1]
                    before_nav = text[:last_match.start()].strip()
                    after_nav = text[last_match.end():].strip()

                    # Return in Dutch order (rightmost is outermost)
                    return [after_nav, before_nav] if after_nav else [before_nav]
                else:
                    # No navigation, just a compound attribute
                    return [text.strip()]

        # Standard navigation parsing
        # Split by "van" with optional articles/possessives
        pattern = r'\s+van\s+(?:het|de|een|zijn|haar|hun|mijn|jouw|uw|onze|jullie|deze|die|dat|dit)?\s*'
        parts = re.split(pattern, text, flags=re.IGNORECASE)

        # Clean up parts and reverse to get Dutch order (rightmost is outermost)
        segments = []
        for part in reversed(parts):
            part = part.strip()
            if part:
                segments.append(part)

        return segments if segments else [text.strip()]

    def parse_result_column(self, header_text: str) -> Optional[ParsedResult]:
        """Parse a result column header to extract the target."""
        header_text = header_text.strip()

        for pattern, pattern_type in self.RESULT_PATTERNS:
            match = re.match(pattern, header_text, re.IGNORECASE)
            if match:
                if pattern_type == "attribute_assignment":
                    # e.g., "de woonregio factor van een Natuurlijk persoon moet gesteld worden op"
                    # or "de postcode van het adres van een Natuurlijk persoon moet gesteld worden op"
                    attribute_text = match.group(1).strip()
                    object_type = match.group(2).strip()

                    # Parse navigation segments from attribute text
                    segments = self._parse_navigation_segments(attribute_text)

                    # Build full path: [object_type, ...segments]
                    full_path = [object_type] + segments[:-1] + [segments[-1]]

                    return ParsedResult(
                        target_type="attribute",
                        attribute_path=full_path,
                        kenmerk_name=None,
                        object_type=object_type
                    )
                    
                elif pattern_type == "simple_attribute_assignment":
                    # e.g., "de belasting moet gesteld worden op"
                    # or "de postcode van het adres moet gesteld worden op"
                    attribute_text = match.group(1).strip()

                    # Parse navigation segments from attribute text
                    segments = self._parse_navigation_segments(attribute_text)

                    return ParsedResult(
                        target_type="attribute",
                        attribute_path=segments,
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