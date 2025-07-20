"""Semantic analysis for RegelSpraak: symbol tables, type checking, and validation."""
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set, Union, Any
from enum import Enum
import logging

from .ast import (
    DomainModel, ObjectType, Parameter, Regel, RegelGroep, Expression, Literal,
    AttributeReference, VariableReference, ParameterReference,
    BinaryExpression, UnaryExpression, FunctionCall, Operator,
    Gelijkstelling, KenmerkToekenning, ObjectCreatie, FeitCreatie, Consistentieregel, Initialisatie, Dagsoortdefinitie, Dagsoort,
    Verdeling, VerdelingMethode, VerdelingNaarRato, VerdelingOpVolgorde, VerdelingTieBreak,
    VerdelingMaximum, VerdelingAfronding,
    Attribuut, Kenmerk, Beslistabel, BeslistabelRow,
    SourceSpan, Dimension,
    Subselectie, Predicaat, ObjectPredicaat, VergelijkingsPredicaat,
    GetalPredicaat, TekstPredicaat, DatumPredicaat, SamengesteldPredicaat,
    Kwantificatie, KwantificatieType, GenesteVoorwaardeInPredicaat, VergelijkingInPredicaat,
    SamengesteldeVoorwaarde
)
from .errors import RegelspraakError

logger = logging.getLogger(__name__)


class SymbolKind(Enum):
    """Kind of symbol in the symbol table."""
    PARAMETER = "parameter"
    OBJECT_TYPE = "object_type"
    ATTRIBUTE = "attribute"
    KENMERK = "kenmerk"
    VARIABLE = "variable"
    RULE = "rule"
    REGELGROEP = "regelgroep"
    DOMAIN = "domain"
    FEITTYPE = "feittype"
    DIMENSION = "dimension"
    DAGSOORT = "dagsoort"


@dataclass
class Symbol:
    """Represents a symbol in the symbol table."""
    name: str
    kind: SymbolKind
    datatype: Optional[str] = None  # For typed symbols
    definition: Any = None  # Reference to AST node
    scope: Optional['Scope'] = None  # Scope where defined


@dataclass
class SemanticError(RegelspraakError):
    """Error found during semantic analysis."""
    def __init__(self, message: str, span: Optional[SourceSpan] = None):
        super().__init__(message)
        self.span = span


class Scope:
    """Represents a scope in the symbol table."""
    
    def __init__(self, name: str, parent: Optional['Scope'] = None):
        self.name = name
        self.parent = parent
        self.symbols: Dict[str, Symbol] = {}
    
    def define(self, symbol: Symbol) -> None:
        """Define a symbol in this scope."""
        if symbol.name in self.symbols:
            raise SemanticError(
                f"Symbol '{symbol.name}' already defined in scope '{self.name}'",
                symbol.definition.span if symbol.definition else None
            )
        self.symbols[symbol.name] = symbol
        symbol.scope = self
        logger.debug(f"Defined {symbol.kind.value} '{symbol.name}' in scope '{self.name}'")
    
    def lookup(self, name: str, recursive: bool = True) -> Optional[Symbol]:
        """Look up a symbol in this scope (and parent scopes if recursive)."""
        if name in self.symbols:
            return self.symbols[name]
        if recursive and self.parent:
            return self.parent.lookup(name, recursive=True)
        return None


class SymbolTable:
    """Manages scopes and symbol resolution."""
    
    def __init__(self):
        self.global_scope = Scope("global")
        self.current_scope = self.global_scope
        self.object_types: Dict[str, ObjectType] = {}  # Quick lookup for type checking
    
    def enter_scope(self, name: str) -> Scope:
        """Create and enter a new scope."""
        new_scope = Scope(name, parent=self.current_scope)
        self.current_scope = new_scope
        logger.debug(f"Entered scope '{name}'")
        return new_scope
    
    def exit_scope(self) -> None:
        """Exit current scope and return to parent."""
        if self.current_scope.parent is None:
            raise RuntimeError("Cannot exit global scope")
        logger.debug(f"Exiting scope '{self.current_scope.name}'")
        self.current_scope = self.current_scope.parent
    
    def define(self, name: str, kind: SymbolKind, datatype: Optional[str] = None,
               definition: Any = None) -> Symbol:
        """Define a symbol in the current scope."""
        symbol = Symbol(name, kind, datatype, definition)
        self.current_scope.define(symbol)
        return symbol
    
    def lookup(self, name: str, recursive: bool = True) -> Optional[Symbol]:
        """Look up a symbol starting from current scope."""
        return self.current_scope.lookup(name, recursive)


class SemanticAnalyzer:
    """Performs semantic analysis on the AST."""
    
    def __init__(self):
        self.symbol_table = SymbolTable()
        self.errors: List[SemanticError] = []
        self.current_object_type: Optional[str] = None  # For resolving 'zijn' references
    
    def analyze(self, model: DomainModel) -> List[SemanticError]:
        """Analyze the domain model and return list of errors."""
        self.errors = []
        
        try:
            # Pass 1: Collect definitions
            self._collect_definitions(model)
            
            # Pass 2: Analyze rules
            self._analyze_rules(model)
            
            # Pass 3: Analyze decision tables
            self._analyze_beslistabellen(model)
            
        except SemanticError as e:
            self.errors.append(e)
        
        return self.errors
    
    def _collect_definitions(self, model: DomainModel) -> None:
        """First pass: collect all top-level definitions."""
        # Collect parameters
        for param_name, param in model.parameters.items():
            try:
                self.symbol_table.define(
                    param_name,
                    SymbolKind.PARAMETER,
                    datatype=param.datatype,
                    definition=param
                )
            except SemanticError as e:
                self.errors.append(e)
        
        # Collect domains
        for domein_name, domein in model.domeinen.items():
            try:
                self.symbol_table.define(
                    domein_name,
                    SymbolKind.DOMAIN,
                    datatype=domein.basis_type,
                    definition=domein
                )
            except SemanticError as e:
                self.errors.append(e)
        
        # Collect feittypen
        for feittype_name, feittype in model.feittypen.items():
            try:
                self.symbol_table.define(
                    feittype_name,
                    SymbolKind.FEITTYPE,
                    definition=feittype
                )
            except SemanticError as e:
                self.errors.append(e)
        
        # Collect object types and their members
        for obj_name, obj_type in model.objecttypes.items():
            try:
                self.symbol_table.define(
                    obj_name,
                    SymbolKind.OBJECT_TYPE,
                    definition=obj_type
                )
                self.symbol_table.object_types[obj_name] = obj_type
            except SemanticError as e:
                self.errors.append(e)
        
        # Second pass on object types: mark attributes as object references
        # when their datatype matches another object type
        for obj_name, obj_type in model.objecttypes.items():
            for attr_name, attribuut in obj_type.attributen.items():
                # Check if the attribute's datatype is an object type
                if attribuut.datatype in model.objecttypes:
                    # Mark this attribute as an object reference
                    attribuut.is_object_ref = True
                    logger.debug(f"Marked attribute '{attr_name}' of type '{obj_name}' as object reference to '{attribuut.datatype}'")
        
        # Third pass on object types: validate dimension references
        for obj_name, obj_type in model.objecttypes.items():
            for attr_name, attribuut in obj_type.attributen.items():
                # Check if the attribute has dimension references
                if hasattr(attribuut, 'dimensions') and attribuut.dimensions:
                    for dim_name in attribuut.dimensions:
                        if dim_name not in model.dimensions:
                            self.errors.append(
                                SemanticError(
                                    f"Unknown dimension '{dim_name}' referenced in attribute '{attr_name}' of type '{obj_name}'",
                                    attribuut.span
                                )
                            )
        
        # Collect dimensions
        for dimension_name, dimension in model.dimensions.items():
            try:
                self.symbol_table.define(
                    dimension_name,
                    SymbolKind.DIMENSION,
                    definition=dimension
                )
            except SemanticError as e:
                self.errors.append(e)
        
        # Collect dagsoorten
        for dagsoort_name, dagsoort in model.dagsoorten.items():
            try:
                self.symbol_table.define(
                    dagsoort_name,
                    SymbolKind.DAGSOORT,
                    definition=dagsoort
                )
            except SemanticError as e:
                self.errors.append(e)
        
        # Collect rule names (for future cross-rule references)
        for regel in model.regels:
            try:
                self.symbol_table.define(
                    regel.naam,
                    SymbolKind.RULE,
                    definition=regel
                )
            except SemanticError as e:
                self.errors.append(e)
        
        # Collect regel groups
        for regelgroep in model.regelgroepen:
            try:
                self.symbol_table.define(
                    regelgroep.naam,
                    SymbolKind.REGELGROEP,
                    definition=regelgroep
                )
            except SemanticError as e:
                self.errors.append(e)
    
    def _analyze_rules(self, model: DomainModel) -> None:
        """Second pass: analyze each rule."""
        for regel in model.regels:
            self._analyze_rule(regel)
        
        # Analyze regel groups
        for regelgroep in model.regelgroepen:
            self._analyze_regelgroep(regelgroep)
    
    def _analyze_rule(self, regel: Regel) -> None:
        """Analyze a single rule."""
        # Enter rule scope
        rule_scope = self.symbol_table.enter_scope(f"rule:{regel.naam}")
        
        try:
            # Collect rule variables from "Laat" declarations
            for var_name, var_expr in regel.variabelen.items():
                try:
                    # TODO: Infer type from expression
                    self.symbol_table.define(
                        var_name,
                        SymbolKind.VARIABLE,
                        definition=var_expr
                    )
                except SemanticError as e:
                    self.errors.append(e)
            
            # Analyze condition if present
            if regel.voorwaarde:
                self._analyze_expression(regel.voorwaarde.expressie)
            
            # Analyze result
            self._analyze_resultaat(regel.resultaat)
            
        finally:
            self.symbol_table.exit_scope()
    
    def _analyze_regelgroep(self, regelgroep: RegelGroep) -> None:
        """Analyze a rule group, especially validation for recursive groups."""
        # If it's marked as recursive, apply specific validation rules
        if regelgroep.is_recursive:
            # Per specification §9.9, recursive groups must have:
            # 1. An object creation rule
            # 2. Termination conditions in the object creation rule
            
            has_object_creation = False
            object_creation_rule = None
            
            # Check all rules in the group
            for regel in regelgroep.regels:
                if isinstance(regel.resultaat, ObjectCreatie):
                    has_object_creation = True
                    object_creation_rule = regel
                    break
            
            if not has_object_creation:
                self.errors.append(SemanticError(
                    f"Recursive rule group '{regelgroep.naam}' must contain an object creation rule",
                    regelgroep.span
                ))
            else:
                # Check if the object creation rule has proper termination conditions
                if not object_creation_rule.voorwaarde:
                    self.errors.append(SemanticError(
                        f"Object creation rule in recursive group '{regelgroep.naam}' must have termination conditions",
                        object_creation_rule.span
                    ))
                else:
                    # TODO: More sophisticated analysis to check for:
                    # - Maximum/minimum value conditions
                    # - Maximum iteration conditions
                    # This would require deeper expression analysis
                    pass
        
        # Analyze all rules in the group
        for regel in regelgroep.regels:
            self._analyze_rule(regel)
    
    def _analyze_resultaat(self, resultaat: Any) -> None:
        """Analyze rule result (Gelijkstelling, Initialisatie, or KenmerkToekenning)."""
        if isinstance(resultaat, (Gelijkstelling, Initialisatie)):
            # Validate target exists and get its type
            target_type = self._analyze_attribute_reference(resultaat.target)
            
            # Analyze expression and get its type
            expr_type = self._analyze_expression(resultaat.expressie)
            
            # TODO: Type checking when we have proper type inference
            
        elif isinstance(resultaat, KenmerkToekenning):
            # Special handling for KenmerkToekenning
            # The target is usually "Een ObjectType" which refers to the object type itself
            if resultaat.target.path and len(resultaat.target.path) == 1:
                # Check if this is an object type reference like "Een Natuurlijk persoon"
                potential_obj_ref = resultaat.target.path[0]
                if potential_obj_ref.startswith("Een "):
                    # Extract object type name
                    obj_type_name = potential_obj_ref[4:]  # Remove "Een "
                    if obj_type_name in self.symbol_table.object_types:
                        # Valid object type reference
                        # TODO: Validate kenmerk exists on this object type
                        obj_type = self.symbol_table.object_types[obj_type_name]
                        if resultaat.kenmerk_naam not in obj_type.kenmerken:
                            # Remove "is" prefix if present
                            kenmerk_base = resultaat.kenmerk_naam
                            if kenmerk_base.startswith("is "):
                                kenmerk_base = kenmerk_base[3:]
                            if kenmerk_base not in obj_type.kenmerken:
                                self.errors.append(SemanticError(
                                    f"Kenmerk '{kenmerk_base}' not defined for object type '{obj_type_name}'",
                                    resultaat.span
                                ))
                        return
                    else:
                        self.errors.append(SemanticError(
                            f"Unknown object type '{obj_type_name}'",
                            resultaat.target.span
                        ))
                        return
            
            # Otherwise validate as normal attribute reference
            self._analyze_attribute_reference(resultaat.target)
        
        elif isinstance(resultaat, ObjectCreatie):
            # Validate object type exists
            if resultaat.object_type not in self.symbol_table.object_types:
                self.errors.append(SemanticError(
                    f"Unknown object type: {resultaat.object_type}",
                    resultaat.span
                ))
            else:
                obj_type_def = self.symbol_table.object_types[resultaat.object_type]
                # Validate attribute initializations
                for attr_name, expr in resultaat.attribute_inits:
                    if attr_name not in obj_type_def.attributen:
                        self.errors.append(SemanticError(
                            f"Attribute '{attr_name}' not defined for type '{resultaat.object_type}'",
                            resultaat.span
                        ))
                    # Analyze the expression
                    self._analyze_expression(expr)
        
        elif isinstance(resultaat, FeitCreatie):
            # Validate FeitCreatie: Een [role1] van een [subject1] is de [role2] van de [subject2]
            # 1. Analyze both subject expressions to ensure they're valid
            subject1_type = self._analyze_expression(resultaat.subject1)
            subject2_type = self._analyze_expression(resultaat.subject2)
            
            # 2. TODO: Validate that the roles exist in a feittype
            # This would require:
            # - Finding a feittype that has both role1 and role2
            # - Checking that subject1/subject2 types match the expected object types for those roles
            # For now, we just check that the expressions are valid
            pass
        
        elif isinstance(resultaat, Consistentieregel):
            # Validate Consistentieregel
            if resultaat.criterium_type == "uniek":
                # For uniqueness checks, validate the target expression
                if resultaat.target:
                    self._analyze_expression(resultaat.target)
                    
                    # Additional validation for uniqueness pattern
                    if isinstance(resultaat.target, AttributeReference):
                        if len(resultaat.target.path) >= 3:
                            # Expected pattern: ["attribute", "alle", "ObjectType"]
                            attribute_name = resultaat.target.path[0]
                            object_type_name = resultaat.target.path[-1]
                            
                            # Check if object type exists
                            obj_type_symbol = self.symbol_table.lookup(object_type_name)
                            if obj_type_symbol and obj_type_symbol.kind == SymbolKind.OBJECT_TYPE:
                                # Check if attribute exists on object type
                                obj_type_def = self.domain_model.objecttypes.get(object_type_name)
                                if obj_type_def:
                                    attr_exists = any(attr.naam == attribute_name 
                                                     for attr in obj_type_def.attributen)
                                    if not attr_exists:
                                        self.errors.append(SemanticError(
                                            f"Attribute '{attribute_name}' not found on object type '{object_type_name}'",
                                            resultaat.target.span
                                        ))
                            else:
                                self.errors.append(SemanticError(
                                    f"Object type '{object_type_name}' not found for uniqueness check",
                                    resultaat.target.span
                                ))
            elif resultaat.criterium_type == "inconsistent":
                # For inconsistency checks, the condition is at rule level
                # No specific validation needed here
                pass
        
        elif isinstance(resultaat, Verdeling):
            # Validate source amount expression
            source_type = self._analyze_expression(resultaat.source_amount)
            
            # Validate target collection expression
            target_type = self._analyze_expression(resultaat.target_collection)
            
            # Validate distribution methods
            for method in resultaat.distribution_methods:
                self._validate_verdeling_method(method)
            
            # Validate remainder target if present
            if resultaat.remainder_target:
                self._analyze_expression(resultaat.remainder_target)
        
        elif isinstance(resultaat, Dagsoortdefinitie):
            # Validate dagsoort name exists (should be declared with Dagsoort statement)
            dagsoort_symbol = self.symbol_table.lookup(resultaat.dagsoort_naam)
            if not dagsoort_symbol or dagsoort_symbol.kind != SymbolKind.DAGSOORT:
                self.errors.append(SemanticError(
                    f"Dagsoort '{resultaat.dagsoort_naam}' not declared",
                    resultaat.span
                ))
    
    def _validate_verdeling_method(self, method: VerdelingMethode) -> None:
        """Validate a distribution method."""
        if isinstance(method, VerdelingNaarRato):
            # Validate ratio expression exists and is numeric
            self._analyze_expression(method.ratio_expression)
        
        elif isinstance(method, VerdelingOpVolgorde):
            # Validate order expression exists
            self._analyze_expression(method.order_expression)
        
        elif isinstance(method, VerdelingTieBreak):
            # Validate tie-break method
            if method.tie_break_method:
                self._validate_verdeling_method(method.tie_break_method)
        
        elif isinstance(method, VerdelingMaximum):
            # Validate maximum expression is numeric
            self._analyze_expression(method.max_expression)
        
        elif isinstance(method, VerdelingAfronding):
            # Validate decimals is reasonable (0-10)
            if method.decimals < 0 or method.decimals > 10:
                self.errors.append(SemanticError(
                    f"Invalid decimal places for rounding: {method.decimals}",
                    method.span
                ))
    
    def _analyze_expression(self, expr: Expression) -> Optional[str]:
        """Analyze an expression and return its type (if known)."""
        if isinstance(expr, Literal):
            return expr.datatype
        
        elif isinstance(expr, ParameterReference):
            symbol = self.symbol_table.lookup(expr.parameter_name)
            if not symbol:
                self.errors.append(SemanticError(
                    f"Undefined parameter '{expr.parameter_name}'",
                    expr.span
                ))
                return None
            if symbol.kind != SymbolKind.PARAMETER:
                self.errors.append(SemanticError(
                    f"'{expr.parameter_name}' is not a parameter",
                    expr.span
                ))
                return None
            return symbol.datatype
        
        elif isinstance(expr, VariableReference):
            symbol = self.symbol_table.lookup(expr.variable_name)
            if not symbol:
                self.errors.append(SemanticError(
                    f"Undefined variable '{expr.variable_name}'",
                    expr.span
                ))
                return None
            if symbol.kind != SymbolKind.VARIABLE:
                self.errors.append(SemanticError(
                    f"'{expr.variable_name}' is not a variable",
                    expr.span
                ))
                return None
            return symbol.datatype
        
        elif isinstance(expr, AttributeReference):
            return self._analyze_attribute_reference(expr)
        
        elif isinstance(expr, BinaryExpression):
            left_type = self._analyze_expression(expr.left)
            right_type = self._analyze_expression(expr.right)
            
            # Check dagsoort operators
            if expr.operator in [Operator.IS_EEN_DAGSOORT, Operator.ZIJN_EEN_DAGSOORT,
                                Operator.IS_GEEN_DAGSOORT, Operator.ZIJN_GEEN_DAGSOORT]:
                # Right side should be a literal with dagsoort name
                if isinstance(expr.right, Literal) and isinstance(expr.right.value, str):
                    dagsoort_name = expr.right.value
                    dagsoort_symbol = self.symbol_table.lookup(dagsoort_name)
                    if not dagsoort_symbol or dagsoort_symbol.kind != SymbolKind.DAGSOORT:
                        self.errors.append(SemanticError(
                            f"Dagsoort '{dagsoort_name}' not declared",
                            expr.right.span
                        ))
                # Left side should be a date expression
                # TODO: Validate left_type is a date type when type system is complete
                return "Boolean"
            
            # TODO: Type checking for operators
            # For now, just ensure both operands are valid
            return self._infer_binary_type(expr.operator, left_type, right_type)
        
        elif isinstance(expr, UnaryExpression):
            operand_type = self._analyze_expression(expr.operand)
            return self._infer_unary_type(expr.operator, operand_type)
        
        elif isinstance(expr, FunctionCall):
            # Analyze function arguments
            for arg in expr.arguments:
                self._analyze_expression(arg)
            # TODO: Validate function exists and arguments match
            return None  # Type depends on function
        
        elif isinstance(expr, Subselectie):
            # Analyze onderwerp expression
            onderwerp_type = self._analyze_expression(expr.onderwerp)
            
            # Analyze predicaat
            self._analyze_predicaat(expr.predicaat)
            
            # Subselectie returns a list of the onderwerp type
            return "Lijst"
        
        elif isinstance(expr, SamengesteldeVoorwaarde):
            # Analyze compound condition
            self._analyze_samengestelde_voorwaarde(expr)
            return "Boolean"
        
        return None
    
    def _analyze_attribute_reference(self, ref: AttributeReference) -> Optional[str]:
        """Analyze an attribute reference and return its type."""
        if not ref.path:
            self.errors.append(SemanticError(
                "Empty attribute reference path",
                ref.span
            ))
            return None
        
        # Special handling for single-element paths that might be parameters
        if len(ref.path) == 1:
            # Check if it exists in any scope
            symbol = self.symbol_table.lookup(ref.path[0])
            if symbol:
                if symbol.kind == SymbolKind.PARAMETER:
                    # This should have been a ParameterReference
                    self.errors.append(SemanticError(
                        f"Parameter '{ref.path[0]}' referenced as attribute",
                        ref.span
                    ))
                    return symbol.datatype
                elif symbol.kind == SymbolKind.VARIABLE:
                    # This is OK - variables can be referenced as single-element paths
                    return symbol.datatype
            else:
                # Not found - could be undefined parameter or attribute
                # Check if it looks like a parameter name (starts with article)
                if ref.path[0].startswith('de ') or ref.path[0].startswith('het '):
                    self.errors.append(SemanticError(
                        f"Undefined parameter or variable '{ref.path[0]}'",
                        ref.span
                    ))
                else:
                    self.errors.append(SemanticError(
                        f"Undefined reference '{ref.path[0]}'",
                        ref.span
                    ))
                return None
        
        # TODO: Validate full attribute path against object types
        # For now, just check if it looks reasonable
        if len(ref.path) > 3:  # Arbitrary limit
            self.errors.append(SemanticError(
                f"Attribute path too deep: {'.'.join(ref.path)}",
                ref.span
            ))
        
        return None  # TODO: Return actual attribute type
    
    def _infer_binary_type(self, op: Operator, left_type: Optional[str], 
                          right_type: Optional[str]) -> Optional[str]:
        """Infer result type of binary operation."""
        # Arithmetic operators generally preserve numeric type
        if op in {Operator.PLUS, Operator.MIN, Operator.MAAL, 
                  Operator.GEDEELD_DOOR, Operator.GEDEELD_DOOR_ABS}:
            if left_type == "Numeriek" and right_type == "Numeriek":
                return "Numeriek"
        
        # Comparison operators return boolean
        if op in {Operator.GELIJK_AAN, Operator.NIET_GELIJK_AAN,
                  Operator.KLEINER_DAN, Operator.GROTER_DAN,
                  Operator.KLEINER_OF_GELIJK_AAN, Operator.GROTER_OF_GELIJK_AAN}:
            return "Boolean"
        
        # Logical operators expect and return boolean
        if op in {Operator.EN, Operator.OF}:
            return "Boolean"
        
        return None
    
    def _infer_unary_type(self, op: Operator, operand_type: Optional[str]) -> Optional[str]:
        """Infer result type of unary operation."""
        if op == Operator.MIN and operand_type == "Numeriek":
            return "Numeriek"
        if op == Operator.NIET:  # Assuming NIET is boolean negation
            return "Boolean"
        if op in [Operator.VOLDOET_AAN_DE_ELFPROEF, Operator.VOLDOET_NIET_AAN_DE_ELFPROEF]:
            return "Boolean"
        if op == Operator.MOETEN_UNIEK_ZIJN:
            return "Boolean"
        return None
    
    def _analyze_predicaat(self, predicaat: Predicaat) -> None:
        """Analyze a predicaat for semantic correctness."""
        if isinstance(predicaat, ObjectPredicaat):
            # For object predicates, we check kenmerk/role names
            # This requires knowing the type of objects being filtered
            # For now, just register that it's used
            pass
        
        elif isinstance(predicaat, VergelijkingsPredicaat):
            # Analyze the comparison expression
            if predicaat.attribuut:
                self._analyze_expression(predicaat.attribuut)
            self._analyze_expression(predicaat.waarde)
            
            # TODO: Type check that the comparison is valid
            # (e.g., numeric comparison for GetalPredicaat)
        
        elif isinstance(predicaat, SamengesteldPredicaat):
            # Analyze compound predicate
            self._analyze_samengesteld_predicaat(predicaat)

    def _analyze_samengesteld_predicaat(self, predicaat: SamengesteldPredicaat) -> None:
        """Analyze a compound predicate for semantic correctness."""
        # Validate quantifier
        if predicaat.kwantificatie.type in [KwantificatieType.TEN_MINSTE, 
                                           KwantificatieType.TEN_HOOGSTE, 
                                           KwantificatieType.PRECIES]:
            if predicaat.kwantificatie.aantal is None:
                self.errors.append(SemanticError(
                    f"Kwantificatie '{predicaat.kwantificatie.type.value}' requires a number",
                    predicaat.kwantificatie.span
                ))
            elif predicaat.kwantificatie.aantal > len(predicaat.voorwaarden):
                self.errors.append(SemanticError(
                    f"Kwantificatie aantal ({predicaat.kwantificatie.aantal}) exceeds number of conditions ({len(predicaat.voorwaarden)})",
                    predicaat.kwantificatie.span
                ))
        
        # Analyze nested conditions
        for geneste in predicaat.voorwaarden:
            self._analyze_geneste_voorwaarde_in_predicaat(geneste)
    
    def _analyze_samengestelde_voorwaarde(self, voorwaarde: SamengesteldeVoorwaarde) -> None:
        """Analyze a compound condition for semantic correctness."""
        # Validate quantifier (same logic as for predicates)
        if voorwaarde.kwantificatie.type in [KwantificatieType.TEN_MINSTE, 
                                            KwantificatieType.TEN_HOOGSTE, 
                                            KwantificatieType.PRECIES]:
            if voorwaarde.kwantificatie.aantal is None:
                self.errors.append(SemanticError(
                    f"Kwantificatie '{voorwaarde.kwantificatie.type.value}' requires a number",
                    voorwaarde.kwantificatie.span
                ))
            elif voorwaarde.kwantificatie.aantal > len(voorwaarde.voorwaarden):
                self.errors.append(SemanticError(
                    f"Kwantificatie aantal ({voorwaarde.kwantificatie.aantal}) exceeds number of conditions ({len(voorwaarde.voorwaarden)})",
                    voorwaarde.kwantificatie.span
                ))
        
        # Analyze nested conditions
        for expr in voorwaarde.voorwaarden:
            self._analyze_expression(expr)
    
    def _analyze_geneste_voorwaarde_in_predicaat(self, geneste: GenesteVoorwaardeInPredicaat) -> None:
        """Analyze a nested condition within a predicate."""
        if isinstance(geneste.voorwaarde, VergelijkingInPredicaat):
            self._analyze_vergelijking_in_predicaat(geneste.voorwaarde)
        elif isinstance(geneste.voorwaarde, SamengesteldPredicaat):
            # Recursively analyze nested compound predicates
            self._analyze_samengesteld_predicaat(geneste.voorwaarde)
    
    def _analyze_vergelijking_in_predicaat(self, vergelijking: VergelijkingInPredicaat) -> None:
        """Analyze a comparison within a predicate."""
        if vergelijking.type == "attribuut_vergelijking":
            # Analyze attribute and value expressions
            if vergelijking.attribuut:
                self._analyze_expression(vergelijking.attribuut)
            if vergelijking.waarde:
                self._analyze_expression(vergelijking.waarde)
        
        elif vergelijking.type == "object_check":
            # Analyze subject expression
            if vergelijking.onderwerp:
                self._analyze_expression(vergelijking.onderwerp)
            # TODO: Validate kenmerk/role name exists
        
        elif vergelijking.type == "kenmerk_check":
            # Analyze attribute expression
            if vergelijking.attribuut:
                self._analyze_expression(vergelijking.attribuut)
            # TODO: Validate kenmerk name exists on the object type

    def _analyze_beslistabellen(self, model: DomainModel) -> None:
        """Analyze all decision tables in the model."""
        for beslistabel in model.beslistabellen:
            self._analyze_beslistabel(beslistabel)
    
    def _analyze_beslistabel(self, beslistabel: Beslistabel) -> None:
        """Analyze a single decision table."""
        # Enter table scope for analysis
        table_scope = self.symbol_table.enter_scope(f"beslistabel:{beslistabel.naam}")
        
        try:
            # Validate structure
            if not beslistabel.rows:
                self.errors.append(SemanticError(
                    f"Decision table '{beslistabel.naam}' has no rows",
                    beslistabel.span
                ))
                return
            
            # Check all rows have same number of condition values as condition columns
            expected_conditions = len(beslistabel.condition_columns)
            for row in beslistabel.rows:
                if len(row.condition_values) != expected_conditions:
                    self.errors.append(SemanticError(
                        f"Row {row.row_number} has {len(row.condition_values)} condition values "
                        f"but table has {expected_conditions} condition columns",
                        row.span
                    ))
            
            # Analyze result expressions in each row
            for row in beslistabel.rows:
                self._analyze_expression(row.result_expression)
                
                # Analyze condition values (skip n.v.t. literals)
                for condition_value in row.condition_values:
                    if not (isinstance(condition_value, Literal) and condition_value.value == "n.v.t."):
                        self._analyze_expression(condition_value)
            
            # TODO: Parse and validate condition column headers once we have more complex parsing
            
        finally:
            self.symbol_table.exit_scope()


def validate(model: DomainModel) -> List[SemanticError]:
    """Validate a domain model and return list of semantic errors."""
    analyzer = SemanticAnalyzer()
    return analyzer.analyze(model)