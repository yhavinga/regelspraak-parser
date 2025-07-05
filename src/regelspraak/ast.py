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
    VERMINDERD_MET = "-v" # Subtraction with special empty value handling
    MAAL = "*"
    GEDEELD_DOOR = "/"
    GEDEELD_DOOR_ABS = "/ABS" # Division with ABS-style rounding (5 decimals)
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
    IS_NIET = "is niet" # For negated type/kenmerk checks
    HEEFT = "heeft" # For possession/bezittelijk kenmerk checks
    HEEFT_NIET = "heeft niet" # For negated possession checks


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
    is_object_ref: bool = False # Indicates if this attribute references another object type
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

# Supporting classes for Verdeling
@dataclass
class VerdelingMethode:
    """Base class for distribution methods."""
    span: SourceSpan

@dataclass  
class VerdelingGelijkeDelen(VerdelingMethode):
    """Equal distribution."""
    pass

@dataclass
class VerdelingNaarRato(VerdelingMethode):
    """Proportional distribution."""
    ratio_expression: Expression

@dataclass
class VerdelingOpVolgorde(VerdelingMethode):
    """Ordered distribution."""
    order_direction: str  # "toenemende" or "afnemende"
    order_expression: Expression

@dataclass
class VerdelingTieBreak(VerdelingMethode):
    """Tie-breaking method."""
    tie_break_method: VerdelingMethode

@dataclass
class VerdelingMaximum(VerdelingMethode):
    """Maximum constraint."""
    max_expression: Expression

@dataclass
class VerdelingAfronding(VerdelingMethode):
    """Rounding constraint."""
    decimals: int
    round_direction: str  # "naar beneden" or "naar boven"

@dataclass
class Verdeling(ResultaatDeel):
    """Distributes a total amount over target attributes (§13.4.10).
    Pattern: X wordt verdeeld over Y, waarbij wordt verdeeld: ..."""
    source_amount: Expression  # What to distribute
    target_collection: Expression  # Collection to distribute over  
    distribution_methods: List[VerdelingMethode]  # Methods and constraints
    remainder_target: Optional[Expression] = None  # Where to store remainder

@dataclass
class ObjectCreatie(ResultaatDeel):
    """Creates a new instance of an object type (§13.4.6)."""
    object_type: str  # Name of the object type to create
    attribute_inits: List[Tuple[str, Expression]]  # [(attr_name, value_expr), ...]

@dataclass
class FeitCreatie(ResultaatDeel):
    """Creates new fact instances (relationships) by navigation (§9.4).
    Pattern: Een [role1] van een [subject1] is een [role2] van een [subject2]
    This creates new relationships where objects found via the right side navigation
    are given the role specified on the left side.
    """
    role1: str  # First role name (e.g., "klant")
    subject1: Expression  # First subject (e.g., "een contract")
    role2: str  # Second role name (e.g., "persoon")  
    subject2: Expression  # Second subject (e.g., "de persoon")

@dataclass
class Consistentieregel(ResultaatDeel):
    """Consistency rule that validates data integrity (§9.5).
    Returns false (inconsistent) if criteria are not met.
    Two types: uniqueness checks and conditional inconsistency."""
    criterium_type: str  # "uniek" or "inconsistent"
    target: Optional[Expression] = None  # For uniqueness checks (e.g., "de BSN")
    condition: Optional[Expression] = None  # For conditional inconsistency

@dataclass
class Initialisatie(ResultaatDeel):
    """Represents an initialization (initialisatie: 'wordt geïnitialiseerd op').
    Only sets the value if the attribute is currently empty (§9.6)."""
    target: AttributeReference  # The attribute being initialized
    expressie: Expression

@dataclass
class Dagsoortdefinitie(ResultaatDeel):
    """Represents a day type definition (dagsoortdefinitie: 'Een dag is een X').
    Defines when a day is of a certain day type (§9.8)."""
    dagsoort_naam: str  # The name of the day type (e.g., "kerstdag")

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

# --- Feittype Definitions ---

@dataclass
class Rol:
    """Represents a role in a feittype relationship."""
    naam: str # Role name (e.g., "passagier", "reis")
    meervoud: Optional[str] = None # Plural form of role name (e.g., "passagiers")
    object_type: str = None # Object type that fulfills this role (e.g., "Natuurlijk persoon", "Vlucht")
    span: Optional[SourceSpan] = None

@dataclass
class FeitType:
    """Represents a feittype (relationship type) between object types."""
    naam: str # Feittype name (e.g., "vlucht van natuurlijke personen")
    wederkerig: bool # Whether reciprocal (e.g., partner relationship)
    rollen: List[Rol] # Roles in the relationship (1 for reciprocal, 2+ for regular)
    cardinality_description: Optional[str] = None # e.g., "Eén reis betreft de verplaatsing van meerdere passagiers"
    span: Optional[SourceSpan] = None


# --- Top-Level Container ---

@dataclass
class DomainModel:
    """Container for all parsed RegelSpraak elements."""
    span: SourceSpan
    objecttypes: Dict[str, ObjectType] = field(default_factory=dict)
    parameters: Dict[str, Parameter] = field(default_factory=dict)
    domeinen: Dict[str, Domein] = field(default_factory=dict)
    feittypen: Dict[str, FeitType] = field(default_factory=dict)
    regels: List[Regel] = field(default_factory=list)
    # Add other top-level elements like Beslistabel as needed
    # description: Optional[str] = None
    # name: Optional[str] = None # If there's a top-level domain name 