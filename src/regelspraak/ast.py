"""Data models for RegelSpraak constructs."""
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional, Union, Tuple
from enum import Enum
from datetime import datetime
from abc import ABC, abstractmethod

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
    GELIJK_IS_AAN = "gelijk is aan"  # Alternative form
    IS_GELIJK_AAN = "is gelijk aan"
    IS_ONGELIJK_AAN = "is ongelijk aan"
    ZIJN_GELIJK_AAN = "zijn gelijk aan"
    ZIJN_ONGELIJK_AAN = "zijn ongelijk aan"
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
    # Validation predicates
    VOLDOET_AAN_DE_ELFPROEF = "voldoet aan de elfproef"
    VOLDOET_NIET_AAN_DE_ELFPROEF = "voldoet niet aan de elfproef"
    
    # Dagsoort (day type) predicates
    IS_EEN_DAGSOORT = "is een dagsoort"
    ZIJN_EEN_DAGSOORT = "zijn een dagsoort"
    IS_GEEN_DAGSOORT = "is geen dagsoort"
    ZIJN_GEEN_DAGSOORT = "zijn geen dagsoort"
    
    # Numeric exact digits predicates
    IS_NUMERIEK_MET_EXACT = "is numeriek met exact"
    IS_NIET_NUMERIEK_MET_EXACT = "is niet numeriek met exact"
    ZIJN_NUMERIEK_MET_EXACT = "zijn numeriek met exact"
    ZIJN_NIET_NUMERIEK_MET_EXACT = "zijn niet numeriek met exact"
    
    # Uniqueness predicate
    MOETEN_UNIEK_ZIJN = "moeten uniek zijn"


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
class DimensionLabel:
    """Reference to a specific dimension label in expressions."""
    dimension_name: str
    label: str
    span: SourceSpan

@dataclass
class DimensionedAttributeReference(Expression):
    """Reference to attribute with dimension coordinates."""
    base_attribute: AttributeReference
    dimension_labels: List[DimensionLabel]  # Must match all dimensions
    
    @property
    def path(self) -> List[str]:
        """Return the path from the base attribute for backward compatibility."""
        return self.base_attribute.path

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

@dataclass
class DisjunctionExpression(Expression):
    """Represents a disjunction of values (OR operation).
    Example: "'Friesland', 'Groningen' of 'Limburg'"
    """
    values: List[Expression]  # The values to be ORed together

@dataclass
class Subselectie(Expression):
    """Filters a collection based on a predicate.
    Example: "passagiers van de reis die minderjarig zijn"
    """
    onderwerp: Expression  # The collection to filter
    predicaat: 'Predicaat'  # The filter condition

@dataclass
class RegelStatusExpression(Expression):
    """Represents a rule status check expression.
    Examples: "regelversie X is gevuurd", "regelversie Y is inconsistent"
    """
    regel_naam: str  # Name of the rule to check
    check: str  # "gevuurd" or "inconsistent"


# --- Predicaat Model ---

@dataclass
class Predicaat(ABC):
    """Abstract base for all predicate types."""
    span: SourceSpan

@dataclass
class ObjectPredicaat(Predicaat):
    """One-sided object predicate for kenmerk/role checks.
    Examples: 
    - "minderjarig zijn" (kenmerk)
    - "een passagier zijn" (role)
    """
    naam: str  # kenmerk or role name
    heeft_lidwoord: bool = False  # True if "een" present
    is_hebben: bool = False  # True for "hebben", False for "zijn"

@dataclass
class VergelijkingsPredicaat(Predicaat):
    """Comparison predicate for attributes.
    Example: "een leeftijd hebben groter dan 18"
    """
    attribuut: Optional[AttributeReference]  # Left side (implicit)
    operator: Operator  # Comparison operator
    waarde: Expression  # Right side value

@dataclass
class GetalPredicaat(VergelijkingsPredicaat):
    """Numeric comparison predicate."""
    pass

@dataclass
class TekstPredicaat(VergelijkingsPredicaat):
    """Text comparison predicate."""
    pass

@dataclass
class DatumPredicaat(VergelijkingsPredicaat):
    """Date comparison predicate."""
    pass

@dataclass
class SamengesteldPredicaat(Predicaat):
    """Compound predicate with quantifier and nested conditions.
    Example: "aan alle volgende voorwaarden voldoen: ..."
    """
    kwantificatie: 'Kwantificatie'
    voorwaarden: List['GenesteVoorwaardeInPredicaat']

@dataclass
class Kwantificatie:
    """Quantifier for compound conditions."""
    type: 'KwantificatieType'  # ALLE, GEEN, TEN_MINSTE, TEN_HOOGSTE, PRECIES
    aantal: Optional[int] = None  # For TEN_MINSTE etc.
    span: SourceSpan = field(default_factory=lambda: SourceSpan())

class KwantificatieType(Enum):
    ALLE = "alle"
    GEEN = "geen"
    TEN_MINSTE = "ten_minste"
    TEN_HOOGSTE = "ten_hoogste"  
    PRECIES = "precies"

@dataclass
class GenesteVoorwaardeInPredicaat:
    """Nested condition within a predicate with bullet level."""
    niveau: int  # Number of bullets (nesting level)
    voorwaarde: Union['VergelijkingInPredicaat', 'SamengesteldPredicaat']
    span: SourceSpan = field(default_factory=lambda: SourceSpan())

@dataclass
class VergelijkingInPredicaat:
    """Comparison within a compound predicate.
    Can be attribute comparison or object/kenmerk check.
    """
    type: str  # "attribuut_vergelijking", "object_check", "kenmerk_check"
    onderwerp: Optional[Expression] = None
    attribuut: Optional[AttributeReference] = None
    operator: Optional[Operator] = None
    waarde: Optional[Expression] = None
    kenmerk_naam: Optional[str] = None
    span: SourceSpan = field(default_factory=lambda: SourceSpan())


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
    dimensions: List[str] = field(default_factory=list)  # ["jaardimensie", "brutonettodimensie"]
    timeline: Optional[str] = None  # "dag", "maand", or "jaar" for time-dependent attributes
    # description: Optional[str] = None

@dataclass
class Kenmerk:
    """Represents a characteristic (kenmerk) definition."""
    naam: str
    span: SourceSpan
    tijdlijn: Optional[str] = None  # 'dag', 'maand', 'jaar' if timeline-based
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
    timeline: Optional[str] = None  # "dag", "maand", or "jaar" for time-dependent parameters
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

@dataclass
class Dagsoort:
    """Represents a day type declaration (§3.12).
    Example: Dagsoort de kerstdag (mv: kerstdagen)"""
    naam: str  # The name of the day type (e.g., "kerstdag")
    meervoud: Optional[str] = None  # Plural form (e.g., "kerstdagen")
    span: SourceSpan = field(default_factory=SourceSpan.unknown)

# --- Timeline Support ---

@dataclass
class Period:
    """Represents a single period in a timeline with a constant value.
    The period is from start_date (inclusive) to end_date (exclusive)."""
    start_date: datetime
    end_date: datetime  # Exclusive - the period ends just before this date
    value: Any  # The constant value during this period (will be a Value object at runtime)
    
@dataclass  
class Timeline:
    """Represents a time-dependent value as a sequence of periods.
    Each period has a constant value from start to end date."""
    periods: List[Period]
    granularity: str  # "dag", "maand", or "jaar" - determines when values can change

@dataclass
class PeriodDefinition(Expression):
    """Represents a timeline period definition (vanaf, tot, van...tot, etc.)."""
    period_type: str  # "vanaf", "tot", "tot_en_met", "van_tot", "van_tot_en_met"
    start_date: Optional[Expression] = None  # For vanaf, van...tot patterns
    end_date: Optional[Expression] = None    # For tot, van...tot patterns

# --- Rule Structure ---

@dataclass
class Voorwaarde:
    """Represents the condition part of a rule."""
    expressie: Union[Expression, 'SamengesteldeVoorwaarde']
    span: SourceSpan

@dataclass
class SamengesteldeVoorwaarde:
    """Compound condition with quantifier (alle, geen, ten minste N, etc)."""
    kwantificatie: Kwantificatie
    voorwaarden: List[Expression]
    span: SourceSpan = field(default_factory=lambda: SourceSpan())

@dataclass
class ResultaatDeel:
    """Base class for rule results."""
    span: SourceSpan

@dataclass
class Gelijkstelling(ResultaatDeel):
    """Represents an assignment (gelijkstelling: 'wordt berekend als')."""
    target: AttributeReference # The attribute being assigned to
    expressie: Expression
    period_definition: Optional['PeriodDefinition'] = None  # For timeline value assignments

@dataclass
class KenmerkToekenning(ResultaatDeel):
    """Represents a characteristic assignment ('is' / 'is niet')."""
    target: AttributeReference # Often refers to the object itself implicitly
    kenmerk_naam: str
    is_negated: bool = False # For 'is niet'
    period_definition: Optional['PeriodDefinition'] = None  # For timeline kenmerk assignments
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
class Dimension:
    """Represents a dimension definition (§3.6)."""
    naam: str
    meervoud: str  # Plural form
    labels: List[Tuple[int, str]]  # [(1, "vorig jaar"), (2, "huidig jaar")]
    usage_style: str  # "prepositional" or "adjectival"
    preposition: Optional[str] = None  # "van", "in", etc. if prepositional
    span: SourceSpan = field(default_factory=SourceSpan.unknown)

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
    period_definition: Optional['PeriodDefinition'] = None  # For timeline value initialization

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

@dataclass
class RegelGroep:
    """Represents a group of rules that can be marked as recursive (§9.9).
    
    Recursive rule groups allow deriving properties from other instances of
    the same object type, with proper termination conditions."""
    naam: str
    is_recursive: bool
    regels: List[Union[Regel, 'Consistentieregel']]
    span: SourceSpan

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


# --- Beslistabel (Decision Table) ---

@dataclass
class BeslistabelCondition:
    """Parsed condition from a decision table column header."""
    header_text: str  # Original column header text
    parsed_expression: Optional[Expression] = None  # Parsed condition template
    subject_path: Optional[List[str]] = None  # Attribute path being tested
    operator: Optional[Operator] = None  # Comparison operator
    is_kenmerk_check: bool = False  # True if checking a kenmerk

@dataclass
class BeslistabelResult:
    """Parsed result from a decision table result column header."""
    header_text: str  # Original column header text
    target_type: str = "attribute"  # "attribute" or "kenmerk"
    attribute_path: Optional[List[str]] = None  # For attribute assignments
    kenmerk_name: Optional[str] = None  # For kenmerk assignments
    object_type: Optional[str] = None  # Target object type

@dataclass
class BeslistabelRow:
    """Single row in a decision table."""
    row_number: int
    result_expression: Expression
    condition_values: List[Union[Expression, Literal]]  # Literal for "n.v.t."
    span: SourceSpan

@dataclass  
class Beslistabel:
    """Decision table with header columns and data rows.
    Result column defines what to set, condition columns define when."""
    naam: str
    result_column: str  # Header text for result column
    condition_columns: List[str]  # Header texts for condition columns
    rows: List[BeslistabelRow]  # Data rows
    span: SourceSpan
    versie_info: Optional[Any] = None  # Version/validity info
    # Enhanced fields for parsed headers
    parsed_result: Optional[BeslistabelResult] = None
    parsed_conditions: Optional[List[BeslistabelCondition]] = None


# --- Top-Level Container ---

@dataclass
class DomainModel:
    """Container for all parsed RegelSpraak elements."""
    span: SourceSpan
    objecttypes: Dict[str, ObjectType] = field(default_factory=dict)
    parameters: Dict[str, Parameter] = field(default_factory=dict)
    domeinen: Dict[str, Domein] = field(default_factory=dict)
    feittypen: Dict[str, FeitType] = field(default_factory=dict)
    dimensions: Dict[str, Dimension] = field(default_factory=dict)
    dagsoorten: Dict[str, Dagsoort] = field(default_factory=dict)
    regels: List[Regel] = field(default_factory=list)
    regelgroepen: List[RegelGroep] = field(default_factory=list)
    beslistabellen: List[Beslistabel] = field(default_factory=list)
    _parse_errors: List[str] = field(default_factory=list)  # Parse-time errors (e.g., duplicate parameters)
    # description: Optional[str] = None
    # name: Optional[str] = None # If there's a top-level domain name 