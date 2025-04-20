"""Data models for RegelSpraak constructs."""
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Union, Tuple
from enum import Enum

# --- Basic Types & Enums ---

@dataclass(frozen=True)
class SourceSpan:
    """Represents the start and end position of a node in the source code."""
    start_line: int
    start_col: int
    end_line: int
    end_col: int

    @classmethod
    def unknown(cls) -> 'SourceSpan':
        """Creates a SourceSpan instance representing an unknown location."""
        return cls(-1, -1, -1, -1)

class Operator(Enum):
    # Arithmetic
    PLUS = "+"
    MIN = "-"
    MAAL = "*"
    GEDEELD_DOOR = "/"
    MACHT = "^" # Power/Exponentiation
    # Comparison
    GELIJK_AAN = "=="
    NIET_GELIJK_AAN = "!="
    KLEINER_DAN = "<"
    GROTER_DAN = ">"
    KLEINER_OF_GELIJK_AAN = "<="
    GROTER_OF_GELIJK_AAN = ">="
    # Logical
    EN = "en"
    OF = "of"
    NIET = "niet"
    # Others related to TOKA/Specification
    IN = "in" # For collections/enumerations
    IS = "is" # For type/kenmerk checks


# --- Expression Model ---

@dataclass
class Expression:
    """Base class for all expressions."""
    span: SourceSpan

@dataclass
class Literal(Expression):
    """Represents a literal value (string, number, boolean, date, etc.)."""
    value: Any # Non-default must come first
    datatype: Optional[str] = None # e.g., "Numeriek", "Tekst", "Datum", "Boolean"
    eenheid: Optional[str] = None

@dataclass
class AttributeReference(Expression):
    """Represents a reference to an attribute, possibly nested."""
    path: List[str] # e.g., ["de persoon", "de leeftijd"] or ["de vlucht", "afstand"]

@dataclass
class VariableReference(Expression):
    """Represents a reference to a rule variable."""
    variable_name: str

@dataclass
class ParameterReference(Expression):
    """Represents a reference to a global parameter."""
    parameter_name: str

@dataclass
class BinaryExpression(Expression):
    """Represents a binary operation (e.g., +, -, ==, en, of)."""
    left: Expression
    operator: Operator
    right: Expression

@dataclass
class UnaryExpression(Expression):
    """Represents a unary operation (e.g., niet)."""
    operator: Operator
    operand: Expression

@dataclass
class FunctionCall(Expression):
    """Represents a function call (e.g., tijdsduur van)."""
    function_name: str
    arguments: List[Expression]
    # Specific arguments for functions like 'tijdsduur van ... in ...'
    unit_conversion: Optional[str] = None # e.g., "hele jr"


# --- Core Definitions ---

@dataclass
class Attribuut:
    """Represents an attribute definition within an ObjectType."""
    naam: str
    datatype: str # Could be a simple string or a reference to Domein
    span: SourceSpan
    eenheid: Optional[str] = None
    is_lijst: bool = False # Indicates if it's a list (e.g., 'lijst van ...')
    # Add other fields as needed: constraints, dimensions, tijdlijn, etc.
    # description: Optional[str] = None

@dataclass
class Kenmerk:
    """Represents a characteristic (kenmerk) definition."""
    naam: str
    span: SourceSpan
    # description: Optional[str] = None

@dataclass
class ObjectType:
    """Represents a RegelSpraak object type definition."""
    naam: str
    span: SourceSpan
    meervoud: Optional[str] = None
    bezield: bool = False
    attributen: Dict[str, Attribuut] = field(default_factory=dict)
    kenmerken: Dict[str, Kenmerk] = field(default_factory=dict)
    # description: Optional[str] = None
    # erf_van: Optional[str] = None # For inheritance

@dataclass
class Parameter:
    """Represents a RegelSpraak parameter definition."""
    naam: str
    datatype: str
    span: SourceSpan
    eenheid: Optional[str] = None
    waarde: Optional[Literal] = None # Parsed literal value
    # description: Optional[str] = None

@dataclass
class Domein:
    """Represents a RegelSpraak domain definition (Type or Enumeration)."""
    naam: str
    span: SourceSpan
    basis_type: Optional[str] = None # e.g., Numeriek, Tekst, Datum
    eenheid: Optional[str] = None
    constraints: List[Any] = field(default_factory=list) # e.g., range, pattern
    enumeratie_waarden: Optional[List[str]] = None
    # description: Optional[str] = None

# --- Rule Structure ---

@dataclass
class Voorwaarde:
    """Represents the condition part of a rule."""
    expressie: Expression
    span: SourceSpan

@dataclass
class ResultaatDeel:
    """Base class for rule results."""
    span: SourceSpan

@dataclass
class Gelijkstelling(ResultaatDeel):
    """Represents an assignment (gelijkstelling: 'wordt berekend als')."""
    target: AttributeReference # The attribute being assigned to
    expressie: Expression

@dataclass
class KenmerkToekenning(ResultaatDeel):
    """Represents a characteristic assignment ('is' / 'is niet')."""
    target: AttributeReference # Often refers to the object itself implicitly
    kenmerk_naam: str
    is_negated: bool = False # For 'is niet'
    # span inherited and now required

# Potentially add other ResultaatDeel types: Verdeling, Actie, etc.

@dataclass
class Regel:
    """Represents a RegelSpraak rule definition."""
    naam: str
    # versie_info: Any # TODO: Define structure for version/validity
    span: SourceSpan
    resultaat: ResultaatDeel
    voorwaarde: Optional[Voorwaarde] = None
    # Map variable name to its definition expression
    variabelen: Dict[str, Expression] = field(default_factory=dict)
    # description: Optional[str] = None
    # metadata: Dict[str, Any] = field(default_factory=dict)


# --- Top-Level Container ---

@dataclass
class DomainModel:
    """Container for all parsed RegelSpraak elements."""
    span: SourceSpan
    objecttypes: Dict[str, ObjectType] = field(default_factory=dict)
    parameters: Dict[str, Parameter] = field(default_factory=dict)
    domeinen: Dict[str, Domein] = field(default_factory=dict)
    regels: List[Regel] = field(default_factory=list)
    # Add other top-level elements like Feittype, Beslistabel as needed
    # description: Optional[str] = None
    # name: Optional[str] = None # If there's a top-level domain name 