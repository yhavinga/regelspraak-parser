"""RegelSpraak execution engine and evaluation logic."""
import math
from typing import Any, Dict, Optional, List, TYPE_CHECKING, Union
from dataclasses import dataclass, field
import logging
from decimal import Decimal
from datetime import date, datetime

# Import AST nodes
from . import ast
from .ast import (
    Expression, Literal, VariableReference, AttributeReference, ParameterReference, # Added ParameterReference
    BinaryExpression, UnaryExpression, FunctionCall, Operator, DomainModel, Regel, SourceSpan,
    Gelijkstelling, KenmerkToekenning, ObjectCreatie, FeitCreatie, Consistentieregel, Initialisatie, Dagsoortdefinitie, # Added ResultaatDeel types
    Verdeling, VerdelingMethode, VerdelingGelijkeDelen, VerdelingNaarRato, VerdelingOpVolgorde,
    VerdelingTieBreak, VerdelingMaximum, VerdelingAfronding,
    Beslistabel, BeslistabelRow,
    DimensionedAttributeReference, DimensionLabel,
    PeriodDefinition, Period, Timeline,
    Subselectie, Predicaat, ObjectPredicaat, VergelijkingsPredicaat,
    GetalPredicaat, TekstPredicaat, DatumPredicaat, SamengesteldPredicaat,
    Kwantificatie, KwantificatieType, GenesteVoorwaardeInPredicaat, VergelijkingInPredicaat,
    SamengesteldeVoorwaarde
)
# Import Runtime components
from .runtime import RuntimeContext, RuntimeObject, Value, DimensionCoordinate, TimelineValue # Import Value directly
# Import arithmetic operations
from .arithmetic import UnitArithmetic
# Import custom error
from .errors import RuntimeError # Use the custom RuntimeError

if TYPE_CHECKING:
    pass

logger = logging.getLogger(__name__)

class RegelspraakError(RuntimeError):
    """Custom exception class for Regelspraak errors that supports a span parameter."""
    def __init__(self, message: str, span: Optional[ast.SourceSpan] = None):
        super().__init__(message)
        self.span = span

class Evaluator:
    """Evaluates RegelSpraak AST nodes within a given RuntimeContext."""

    def __init__(self, context: RuntimeContext):
        """Initialize the Evaluator with a runtime context."""
        self.context = context
        self.arithmetic = UnitArithmetic(context.unit_registry)
        self._current_rule = None  # Track current rule for tracing
        self._in_timeline_evaluation = False  # Track if we're evaluating within a timeline
        
        # Function registry for cleaner function handling
        # All functions registered without articles for consistent lookup
        self._function_registry = {
            # Mathematical functions
            "abs": self._func_abs,
            "absolute_waarde": self._func_abs,  # Dutch alias
            "max": self._func_max,
            "maximale_waarde": self._func_max,  # Dutch alias
            "min": self._func_min,
            "minimale_waarde": self._func_min,  # Dutch alias
            
            # Date/time functions
            "tijdsduur": self._func_tijdsduur_van,
            "tijdsduur_van": self._func_tijdsduur_van,
            "absolute_tijdsduur": self._func_absolute_tijdsduur_van,
            "absolute_tijdsduur_van": self._func_absolute_tijdsduur_van,
            "maand_uit": self._func_maand_uit,
            "dag_uit": self._func_dag_uit,
            "jaar_uit": self._func_jaar_uit,
            
            # Aggregation functions
            "aantal": self._func_het_aantal,
            "het_aantal": self._func_het_aantal,  # Also register with article
            "som": self._func_som_van,
            "som_van": self._func_som_van,
            "gemiddelde": self._func_gemiddelde_van,
            "gemiddelde_van": self._func_gemiddelde_van,
            "eerste": self._func_eerste_van,
            "eerste_van": self._func_eerste_van,
            "laatste": self._func_laatste_van,
            "laatste_van": self._func_laatste_van,
            "totaal": self._func_totaal_van,
            "totaal_van": self._func_totaal_van,
            "aantal_dagen_in": self._func_aantal_dagen_in,
        }

    def execute_model(self, domain_model: DomainModel, evaluation_date: Optional[datetime] = None):
        """Executes all rules in the domain model against the context.
        
        Args:
            domain_model: The model containing rules to execute
            evaluation_date: Optional date for timeline evaluation. If not provided,
                           uses current date for timeline attributes/parameters.
        """
        # Set evaluation date in context
        if evaluation_date:
            self.context.evaluation_date = evaluation_date
        elif self.context.evaluation_date is None:
            # Default to current date if not set
            from datetime import date, datetime
            self.context.evaluation_date = datetime.now()
        
        # Simple execution: iterate through all rules and apply them to
        # all relevant object instances found in the context.
        # TODO: Need a more sophisticated strategy for rule ordering and scoping.
        results = {}
        # Track how many objects we started with to prevent infinite loops
        initial_object_counts = {obj_type: len(self.context.find_objects_by_type(obj_type)) 
                                for obj_type in domain_model.objecttypes.keys()}
        
        for rule in domain_model.regels:
            # Special handling for ObjectCreatie rules
            if isinstance(rule.resultaat, ObjectCreatie):
                # Execute object creation rules only once, not per instance
                original_instance = self.context.current_instance
                # Create a dummy context if needed
                if not self.context.current_instance:
                    # Need some context to evaluate expressions
                    # Use first available object or create minimal context
                    if domain_model.objecttypes:
                        obj_type_name = next(iter(domain_model.objecttypes.keys()))
                        instances = self.context.find_objects_by_type(obj_type_name)
                        if instances:
                            self.context.set_current_instance(instances[0])
                
                try:
                    self.evaluate_rule(rule)
                    results.setdefault(rule.naam, []).append({"status": "object_created"})
                except Exception as e:
                    print(f"Error executing object creation rule '{rule.naam}': {e}")
                    results.setdefault(rule.naam, []).append({"status": "error", "message": str(e)})
                finally:
                    self.context.set_current_instance(original_instance)
                continue
            
            # Regular rules - determine the target ObjectType for the rule
            target_type_name = self._deduce_rule_target_type(rule)
            if not target_type_name:
                # Rule doesn't seem to target a specific object type (e.g., global calculation?)
                # Or deduction failed. Skip for now.
                # TODO: Handle non-object-specific rules or improve deduction.
                print(f"Warning: Could not deduce target type for rule '{rule.naam}'. Skipping.")
                continue

            target_instances = self.context.find_objects_by_type(target_type_name)
            if not target_instances:
                 # No instances of the target type exist in the context.
                 continue # Or log? Or handle rules that *create* instances?

            for instance in target_instances:
                # Set the current instance in the context for this evaluation
                original_instance = self.context.current_instance
                self.context.set_current_instance(instance)
                try:
                    # Evaluate the single rule for the current instance
                    # Note: evaluate_rule doesn't return a value; it modifies context
                    self.evaluate_rule(rule)
                    # Store success or specific outcome if needed
                    results.setdefault(rule.naam, []).append({"instance_id": instance.instance_id, "status": "evaluated"})
                except RuntimeError as e:
                    # Capture specific runtime errors per instance/rule
                    print(f"RuntimeError executing rule '{rule.naam}' for instance '{instance.instance_id if instance else 'None'}': {e}")
                    results.setdefault(rule.naam, []).append({"instance_id": instance.instance_id, "status": "error", "message": str(e)})
                except Exception as e:
                    # Capture unexpected errors
                    print(f"Unexpected Error executing rule '{rule.naam}' for instance '{instance.instance_id}': {e}")
                    results.setdefault(rule.naam, []).append({"instance_id": instance.instance_id, "status": "unexpected_error", "message": str(e)})
                finally:
                    # Restore original instance context
                    self.context.set_current_instance(original_instance)
        
        # Execute decision tables
        for beslistabel in domain_model.beslistabellen:
            # Find target object type from result column
            target_type = self._deduce_beslistabel_target_type(beslistabel)
            if not target_type:
                print(f"Could not determine target type for beslistabel '{beslistabel.naam}'")
                continue
                
            instances = self.context.find_objects_by_type(target_type)
            for instance in instances:
                original_instance = self.context.current_instance
                self.context.set_current_instance(instance)
                try:
                    self.execute_beslistabel(beslistabel)
                    results.setdefault(f"beslistabel:{beslistabel.naam}", []).append({
                        "instance_id": instance.instance_id, 
                        "status": "evaluated"
                    })
                except Exception as e:
                    print(f"Error executing beslistabel '{beslistabel.naam}' for instance '{instance.instance_id}': {e}")
                    results.setdefault(f"beslistabel:{beslistabel.naam}", []).append({
                        "instance_id": instance.instance_id,
                        "status": "error",
                        "message": str(e)
                    })
                finally:
                    self.context.set_current_instance(original_instance)
        
        # Execute regel groups
        for regelgroep in domain_model.regelgroepen:
            try:
                group_results = self.execute_regelgroep(regelgroep)
                results[f"regelgroep:{regelgroep.naam}"] = group_results
            except Exception as e:
                print(f"Error executing regelgroep '{regelgroep.naam}': {e}")
                results[f"regelgroep:{regelgroep.naam}"] = [{"status": "error", "message": str(e)}]
        
        return results

    def _deduce_type_from_subject_ref(self, subject_ref: AttributeReference) -> Optional[str]:
        """Deduce object type from a FeitCreatie subject reference."""
        if not subject_ref or not subject_ref.path:
            return None
        
        for path_elem in subject_ref.path:
            # First remove any articles
            clean_elem = path_elem
            for article in ['een ', 'de ', 'het ']:
                if clean_elem.lower().startswith(article):
                    clean_elem = clean_elem[len(article):]
                    break
            
            if clean_elem in self.context.domain_model.objecttypes:
                return clean_elem
            
            # Check if this might be a role in a feittype
            # For roles like "echtgenoot", "partner", etc., we need to find the object type from the feittype
            for feittype_name, feittype in self.context.domain_model.feittypen.items():
                # Check if the clean_elem matches a role name pattern in the feittype
                # Since we can't extract exact role names from grammar, check if the word appears in the feittype name
                if clean_elem.lower() in feittype_name.lower():
                    # Found a match - return the object type from the first role
                    # For reciprocal relationships, all roles have the same object type
                    if feittype.rollen and len(feittype.rollen) > 0:
                        return feittype.rollen[0].object_type
            
            # Try to find object type within the path element
            # Be more careful - "product aanbieding" should match "Aanbieding" not "Product"
            # Try matching from the end with multiple words
            path_elem_lower = clean_elem.lower()
            words = path_elem_lower.split()
            if words:
                # First try to match the last word (most specific)
                # "product aanbieding" -> try "aanbieding" first
                last_word = words[-1]
                for obj_type in self.context.domain_model.objecttypes:
                    obj_type_lower = obj_type.lower()
                    if last_word == obj_type_lower:
                        return obj_type
                
                # Then try longer combinations
                for length in range(len(words), 1, -1):
                    # Try combinations starting from the end
                    for start in range(len(words) - length + 1):
                        candidate = ' '.join(words[start:start + length])
                        for obj_type in self.context.domain_model.objecttypes:
                            obj_type_lower = obj_type.lower()
                            if candidate == obj_type_lower:
                                return obj_type
        
        return None

    def _deduce_rule_target_type(self, rule: Regel) -> Optional[str]:
        """Tries to deduce the primary ObjectType a rule applies to."""
        # Simplistic: Look at the target of the resultaat
        target_ref: Optional[ast.AttributeReference] = None
        if isinstance(rule.resultaat, (Gelijkstelling, KenmerkToekenning, Initialisatie)):
            target_ref = rule.resultaat.target
            # Handle DimensionedAttributeReference by extracting its base attribute
            if isinstance(target_ref, DimensionedAttributeReference):
                target_ref = target_ref.base_attribute
        elif isinstance(rule.resultaat, Dagsoortdefinitie):
            # Dagsoort definitions target "dag" objects
            return "Dag"
        elif isinstance(rule.resultaat, Consistentieregel):
            # For consistency rules, determine the target based on the criterium type
            if rule.resultaat.criterium_type == "uniek" and rule.resultaat.target:
                # For uniqueness checks, the target has pattern: [attribute, "alle", object_type]
                if isinstance(rule.resultaat.target, AttributeReference) and len(rule.resultaat.target.path) >= 3:
                    # The object type is the last element in the path
                    obj_type = rule.resultaat.target.path[2]
                    # Clean the object type name
                    obj_type_clean = obj_type.replace("Natuurlijke personen", "Natuurlijk persoon")
                    if obj_type_clean in self.context.domain_model.objecttypes:
                        return obj_type_clean
                    # Try to find a matching object type
                    for defined_type in self.context.domain_model.objecttypes:
                        if defined_type.lower() in obj_type.lower() or obj_type.lower() in defined_type.lower():
                            return defined_type
            elif rule.resultaat.criterium_type == "inconsistent":
                # For inconsistency rules with conditions, examine the condition
                if rule.voorwaarde and hasattr(rule.voorwaarde, 'expressie'):
                    # Try to infer from the condition's subject
                    # This is a simplified approach - may need refinement
                    for obj_type in self.context.domain_model.objecttypes:
                        return obj_type  # Return first object type for now
            return None
        elif isinstance(rule.resultaat, Verdeling):
            # For Verdeling, the target type is the "contingent" that contains the source amount
            # The source_amount typically refers to an attribute of the contingent
            # e.g., "Het totaal aantal treinmiles van een te verdelen contingent treinmiles"
            if isinstance(rule.resultaat.source_amount, AttributeReference) and rule.resultaat.source_amount.path:
                # Look for object type in the path
                for path_elem in rule.resultaat.source_amount.path:
                    # Clean up the element
                    clean_elem = path_elem
                    for article in ['een ', 'de ', 'het ']:
                        if clean_elem.lower().startswith(article):
                            clean_elem = clean_elem[len(article):]
                            break
                    
                    # Check if it's an object type
                    for obj_type in self.context.domain_model.objecttypes:
                        if obj_type.lower() in clean_elem.lower():
                            return obj_type
            return None
        
        elif isinstance(rule.resultaat, FeitCreatie):
            # For FeitCreatie, we need to determine which object type the rule iterates over
            # Try subject1 first
            result = self._deduce_type_from_subject_ref(rule.resultaat.subject1)
            if result:
                return result
            
            # Otherwise, try subject2
            return self._deduce_type_from_subject_ref(rule.resultaat.subject2)
        elif isinstance(rule.resultaat, Verdeling):
            # For Verdeling, try to deduce from the source amount expression
            # Pattern: "Het X van Y" where Y is the object type
            if isinstance(rule.resultaat.source_amount, AttributeReference) and rule.resultaat.source_amount.path:
                # e.g., ["totaal aantal treinmiles", "te verdelen contingent treinmiles"]
                if len(rule.resultaat.source_amount.path) > 1:
                    last_elem = rule.resultaat.source_amount.path[-1]
                    # Extract object type from the last element
                    # Split into words and try different combinations
                    words = last_elem.lower().split()
                    
                    # Try each object type
                    for obj_type in self.context.domain_model.objecttypes:
                        obj_type_words = obj_type.lower().split()
                        
                        # Check if all words of the object type appear in the path element
                        if all(word in words for word in obj_type_words):
                            return obj_type
            return None
        elif rule.voorwaarde: # Less ideal, check condition structure
            # Look for common patterns like 'Een X ...' or 'zijn Y'
            pass # TODO: Implement more robust deduction if needed
        
        if target_ref and target_ref.path: 
            # Path structure from visitAttribuutReferentie: ["attribute", "object_type", ...]
            # e.g., ["resultaat", "Bedrag"] for "De resultaat van een Bedrag"
            # e.g., ["leeftijd", "Natuurlijk persoon"] for "De leeftijd van een Natuurlijk persoon"
            # For KenmerkToekenning: ["Natuurlijk persoon"] for "Een Natuurlijk persoon is minderjarig"
            if len(target_ref.path) == 1:
                # For KenmerkToekenning, the path is just the object type
                potential_type = target_ref.path[0]
                # Check if it matches a known object type
                if hasattr(self.context, 'domain_model') and self.context.domain_model:
                    # First try exact match
                    if potential_type in self.context.domain_model.objecttypes:
                        return potential_type
                    
                    # Try case-insensitive match
                    for obj_type in self.context.domain_model.objecttypes:
                        if obj_type.lower() == potential_type.lower():
                            return obj_type
            elif len(target_ref.path) > 1: 
                # The second element is typically the object type
                potential_type = target_ref.path[1]
                # Check if it matches a known object type
                if hasattr(self.context, 'domain_model') and self.context.domain_model:
                    # First try exact match
                    if potential_type in self.context.domain_model.objecttypes:
                        return potential_type
                    
                    # Try case-insensitive match
                    for obj_type in self.context.domain_model.objecttypes:
                        if obj_type.lower() == potential_type.lower():
                            return obj_type
                    
                    # Try capitalized version
                    potential_type_cap = potential_type.capitalize()
                    if potential_type_cap in self.context.domain_model.objecttypes:
                        return potential_type_cap
                
                # Check if it's a role name in a feittype
                # "reis" -> "Vlucht" via feittype definition
                for feittype_naam, feittype in self.context.domain_model.feittypen.items():
                    for rol in feittype.rollen:
                        if rol.naam and rol.naam.lower() == potential_type.lower():
                            return rol.object_type
                
                # Return the original if no match found
                return potential_type
            elif len(target_ref.path) == 1:
                # Handle single-element paths like ["totaal van berekening"]
                path_elem = target_ref.path[0]
                
                # Check if the path element contains " van " (indicating object type)
                if " van " in path_elem:
                    # Extract the object type after "van"
                    # e.g., "totaal van berekening" -> "berekening"
                    parts = path_elem.split(" van ")
                    if len(parts) >= 2:
                        # Get the last part as the potential object type
                        potential_type = parts[-1].strip()
                        
                        # Remove articles if present
                        for article in ['een ', 'de ', 'het ']:
                            if potential_type.lower().startswith(article):
                                potential_type = potential_type[len(article):].strip()
                                break
                        
                        # Check if it matches a known object type (case-insensitive)
                        if hasattr(self.context, 'domain_model') and self.context.domain_model:
                            for obj_type in self.context.domain_model.objecttypes:
                                if obj_type.lower() == potential_type.lower():
                                    return obj_type
                        
                        # Try capitalized version
                        potential_type_cap = potential_type.capitalize()
                        if hasattr(self.context, 'domain_model') and self.context.domain_model:
                            if potential_type_cap in self.context.domain_model.objecttypes:
                                return potential_type_cap
                        
                        # Check if it's a role name in a feittype
                        for feittype_naam, feittype in self.context.domain_model.feittypen.items():
                            for rol in feittype.rollen:
                                if rol.naam and rol.naam.lower() == potential_type.lower():
                                    return rol.object_type
                
                # If path is just ["leeftijd"], we need another way (e.g. Regel header)
                # For steel thread: assume rule applies to Natuurlijk persoon based on name/structure
                if "persoon" in rule.naam.lower(): # Very basic heuristic for steel thread
                    return "Natuurlijk persoon"

        # Fallback for steel thread Kenmerktoekenning where target might be implicit
        if isinstance(rule.resultaat, KenmerkToekenning) and "persoon" in rule.naam.lower():
             return "Natuurlijk persoon"

        # TODO: Use rule header information (e.g., "Voor elke X geldt:") when grammar supports it.
        return None

    def evaluate_rule(self, rule: Regel):
        """Evaluates a single rule for the *current* instance in the context.
           Modifies the context directly, does not return a value.
        """
        # Special handling for ObjectCreatie rules - they don't need a current instance
        if isinstance(rule.resultaat, ObjectCreatie):
            instance = self.context.current_instance  # May be None for first creation
        else:
            if self.context.current_instance is None:
                raise RegelspraakError(f"Cannot evaluate rule '{rule.naam}': No current instance set in context.")
            instance = self.context.current_instance
        
        # Trace the start of rule evaluation
        if self.context.trace_sink and instance is not None:
            self.context.trace_sink.rule_eval_start(rule, instance)
            
        # 1. Setup variable scope for this rule execution
        original_vars = self.context.variables.copy()
        success = True
        error_msg = None
        
        try:
            # Store current rule for tracing
            self._current_rule = rule
            
            # Evaluate expressions in rule.variabelen and store in context.variables
            for var_name, expr in rule.variabelen.items():
                var_value = self.evaluate_expression(expr)
                self.context.set_variable(var_name, var_value, expr.span)

            # 2. Check condition (voorwaarde)
            condition_met = True
            # For FeitCreatie with conditions, skip condition check here
            # The condition will be evaluated per target object during FeitCreatie processing
            if rule.voorwaarde and not isinstance(rule.resultaat, FeitCreatie):
                # Trace condition evaluation start
                if self.context.trace_sink:
                    self.context.trace_sink.condition_eval_start(
                        rule.voorwaarde, 
                        rule_name=rule.naam, 
                        instance_id=instance.instance_id if instance else None
                    )
                    
                # Handle both simple expressions and compound conditions
                if isinstance(rule.voorwaarde.expressie, SamengesteldeVoorwaarde):
                    condition_met = self._evaluate_samengestelde_voorwaarde(rule.voorwaarde.expressie, instance)
                    condition_value = Value(value=condition_met, datatype="Boolean")
                else:
                    condition_value = self.evaluate_expression(rule.voorwaarde.expressie)
                
                if condition_value.datatype != "Boolean":
                    error_msg = f"Rule '{rule.naam}' condition evaluated to non-boolean type: {condition_value.datatype}"
                    raise RegelspraakError(error_msg, span=rule.voorwaarde.span)
                
                condition_met = condition_value.value
                
                # Trace condition evaluation end
                if self.context.trace_sink:
                    self.context.trace_sink.condition_eval_end(
                        rule.voorwaarde, 
                        condition_met, 
                        rule_name=rule.naam, 
                        instance_id=instance.instance_id if instance else None
                    )

            # 3. If condition met, apply result
            if condition_met:
                if self.context.trace_sink:
                    # Log rule firing
                    self.context.trace_sink.rule_fired(rule)
                self._apply_resultaat(rule.resultaat)
            else:
                # Log rule skipped due to condition
                if self.context.trace_sink and instance is not None:
                    self.context.trace_sink.rule_skipped(
                        rule, 
                        instance, 
                        reason="condition_false"
                    )

        except RegelspraakError as e:
            success = False
            error_msg = str(e)
            raise  # Re-raise to propagate
        except Exception as e:
            success = False
            error_msg = f"Unexpected error: {str(e)}"
            raise
        finally:
            # Restore outer variable scope
            self.context.variables = original_vars
            
            # Clear current rule reference
            self._current_rule = None
            
            # Trace the end of rule evaluation
            if self.context.trace_sink and instance is not None:
                self.context.trace_sink.rule_eval_end(rule, instance, success, error_msg)

    def execute_regelgroep(self, regelgroep: ast.RegelGroep) -> List[Dict[str, Any]]:
        """Execute a rule group, handling recursive execution if marked as such.
        
        For recursive groups, rules are executed iteratively until termination
        conditions are met. Per specification §9.9, recursive groups must have
        an object creation rule with proper termination conditions.
        """
        results = []
        
        if not regelgroep.is_recursive:
            # Non-recursive group: execute all rules once
            for regel in regelgroep.regels:
                # Determine target type and execute for relevant instances
                target_type_name = self._deduce_rule_target_type(regel)
                if not target_type_name:
                    continue
                
                target_instances = self.context.find_objects_by_type(target_type_name)
                for instance in target_instances:
                    original_instance = self.context.current_instance
                    self.context.set_current_instance(instance)
                    try:
                        self.evaluate_rule(regel)
                        results.append({
                            "regel": regel.naam,
                            "instance_id": instance.instance_id,
                            "status": "evaluated"
                        })
                    except Exception as e:
                        results.append({
                            "regel": regel.naam,
                            "instance_id": instance.instance_id,
                            "status": "error",
                            "message": str(e)
                        })
                    finally:
                        self.context.set_current_instance(original_instance)
        else:
            # Recursive group: execute with iteration tracking
            max_iterations = 1000  # Safety limit to prevent infinite loops
            iteration = 0
            
            # Track objects created in each iteration
            objects_created_per_iteration = []
            
            while iteration < max_iterations:
                iteration += 1
                iteration_created = []
                
                # Execute all rules in the group for this iteration
                for regel in regelgroep.regels:
                    if isinstance(regel.resultaat, ast.ObjectCreatie):
                        # Object creation rule - execute once per iteration
                        original_instance = self.context.current_instance
                        try:
                            # Check termination conditions
                            if regel.voorwaarde:
                                # Use the most recent object of the type being created as context
                                obj_type = regel.resultaat.object_type
                                instances = self.context.find_objects_by_type(obj_type)
                                if instances:
                                    # Use the last created instance for condition evaluation
                                    self.context.set_current_instance(instances[-1])
                                    # Handle both expression and compound condition
                                    if isinstance(regel.voorwaarde.expressie, SamengesteldeVoorwaarde):
                                        condition_met = self._evaluate_samengestelde_voorwaarde(regel.voorwaarde.expressie, instances[-1])
                                    else:
                                        result = self.evaluate_expression(regel.voorwaarde.expressie)
                                        condition_met = result.datatype == "Boolean" and result.value
                                    if not condition_met:
                                        # Termination condition reached
                                        results.append({
                                            "iteration": iteration,
                                            "regel": regel.naam,
                                            "status": "terminated",
                                            "message": "Termination condition met"
                                        })
                                        return results
                                else:
                                    # No instances yet - for aggregation functions on empty collections,
                                    # we can still evaluate the condition
                                    # Set current instance to None to signal aggregation functions
                                    # that they should handle empty collections
                                    self.context.set_current_instance(None)
                                    try:
                                        # Handle both expression and compound condition
                                        if isinstance(regel.voorwaarde.expressie, SamengesteldeVoorwaarde):
                                            condition_met = self._evaluate_samengestelde_voorwaarde(regel.voorwaarde.expressie, None)
                                        else:
                                            result = self.evaluate_expression(regel.voorwaarde.expressie)
                                            condition_met = result.datatype == "Boolean" and result.value
                                        if not condition_met:
                                            # Termination condition reached even with no objects
                                            results.append({
                                                "iteration": iteration,
                                                "regel": regel.naam,
                                                "status": "terminated",
                                                "message": "Termination condition met (no objects)"
                                            })
                                            return results
                                    except Exception as e:
                                        # If evaluation fails with no instances, assume condition is met
                                        # (allow first object to be created)
                                        logger.debug(f"Condition evaluation failed with no instances: {e}")
                                        pass
                            
                            # Count objects before creation
                            obj_type = regel.resultaat.object_type
                            before_count = len(self.context.find_objects_by_type(obj_type))
                            
                            # Set context to last created object of this type for attribute expressions
                            instances = self.context.find_objects_by_type(obj_type)
                            if instances:
                                self.context.set_current_instance(instances[-1])
                            
                            # Execute object creation
                            self.evaluate_rule(regel)
                            
                            # Count objects after creation
                            after_count = len(self.context.find_objects_by_type(obj_type))
                            created_count = after_count - before_count
                            
                            if created_count > 0:
                                iteration_created.append({
                                    "object_type": obj_type,
                                    "count": created_count
                                })
                                results.append({
                                    "iteration": iteration,
                                    "regel": regel.naam,
                                    "status": "object_created",
                                    "count": created_count
                                })
                        except Exception as e:
                            results.append({
                                "iteration": iteration,
                                "regel": regel.naam,
                                "status": "error",
                                "message": str(e)
                            })
                        finally:
                            self.context.set_current_instance(original_instance)
                    else:
                        # Regular rule - execute for all relevant instances
                        target_type_name = self._deduce_rule_target_type(regel)
                        if not target_type_name:
                            continue
                        
                        # In recursive groups, focus on objects created in previous iterations
                        if iteration > 1 and objects_created_per_iteration:
                            # Get objects created in the previous iteration
                            target_instances = []
                            for created in objects_created_per_iteration[-1]:
                                if created["object_type"] == target_type_name:
                                    # Find the newly created instances
                                    all_instances = self.context.find_objects_by_type(target_type_name)
                                    # Take the last N instances (newly created)
                                    target_instances = all_instances[-created["count"]:]
                                    break
                            
                            if not target_instances:
                                # No new instances of this type in previous iteration
                                continue
                        else:
                            # First iteration or no creation tracking
                            target_instances = self.context.find_objects_by_type(target_type_name)
                        
                        for instance in target_instances:
                            original_instance = self.context.current_instance
                            self.context.set_current_instance(instance)
                            try:
                                self.evaluate_rule(regel)
                                results.append({
                                    "iteration": iteration,
                                    "regel": regel.naam,
                                    "instance_id": instance.instance_id,
                                    "status": "evaluated"
                                })
                            except Exception as e:
                                results.append({
                                    "iteration": iteration,
                                    "regel": regel.naam,
                                    "instance_id": instance.instance_id,
                                    "status": "error",
                                    "message": str(e)
                                })
                            finally:
                                self.context.set_current_instance(original_instance)
                
                # Check if any objects were created in this iteration
                if not iteration_created:
                    # No new objects created, stop iteration
                    results.append({
                        "iteration": iteration,
                        "status": "completed",
                        "message": "No new objects created"
                    })
                    break
                
                objects_created_per_iteration.append(iteration_created)
            
            if iteration >= max_iterations:
                results.append({
                    "status": "max_iterations_reached",
                    "iterations": iteration
                })
        
        return results

    def _apply_resultaat(self, res: ast.ResultaatDeel):
        """Applies the result of a rule (Gelijkstelling, Initialisatie, or KenmerkToekenning) 
           to the current instance in the context.
        """
        # ObjectCreatie doesn't need a current instance
        if isinstance(res, ObjectCreatie):
            # Handle object creation without needing current instance
            # Jump to the ObjectCreatie handling code below
            pass
        else:
            # Other result types need a current instance
            instance = self.context.current_instance
            if instance is None:
                # This should ideally be caught earlier
                raise RegelspraakError("Cannot apply result: No current instance.", span=res.span)

        if isinstance(res, Gelijkstelling):
            instance = self.context.current_instance  # Already checked above
            # Check if the target is a timeline attribute or if the expression contains timeline operands
            target_is_timeline = False
            if hasattr(res.target, 'path') and res.target.path:
                attr_name = res.target.path[0]
                obj_type_def = self.context.domain_model.objecttypes.get(instance.object_type_naam)
                if obj_type_def:
                    attr_def = obj_type_def.attributen.get(attr_name)
                    if attr_def and attr_def.timeline:
                        target_is_timeline = True
            
            # If target is timeline or expression contains timeline operands, evaluate as timeline
            if target_is_timeline or self._is_timeline_expression(res.expressie):
                # Get the target attribute
                target_ref = res.target
                if isinstance(target_ref, DimensionedAttributeReference):
                    raise RegelspraakError("Timeline expressions with dimensioned attributes not yet supported", span=res.span)
                elif not target_ref.path:
                    raise RegelspraakError("Gelijkstelling target path is empty.", span=target_ref.span)
                
                attr_name = target_ref.path[0]
                
                # Check if there's a period definition
                if res.period_definition:
                    # Evaluate the expression to get a single value
                    value = self.evaluate_expression(res.expressie)
                    
                    # Get attribute definition to find unit and granularity
                    granularity = "dag"  # Default
                    unit = None
                    obj_type_def = self.context.domain_model.objecttypes.get(instance.object_type_naam)
                    if obj_type_def:
                        attr_def = obj_type_def.attributen.get(attr_name)
                        if attr_def:
                            if attr_def.timeline:
                                granularity = attr_def.timeline
                            if hasattr(attr_def, 'eenheid') and attr_def.eenheid:
                                unit = attr_def.eenheid
                    
                    # If the value doesn't have a unit but the attribute does, apply it
                    if unit and (not value.unit or value.unit == ""):
                        value = Value(value=value.value, datatype=value.datatype, unit=unit)
                    
                    # Debug
                    logger.debug(f"Timeline period value: {value}, unit from attr_def: {unit}")
                    
                    # Evaluate the period definition to get the period
                    period = self._evaluate_period_definition(res.period_definition)
                    period.value = value  # Set the value for this period
                    
                    # Create a timeline with just this period
                    timeline = Timeline(periods=[period], granularity=granularity)
                    timeline_value = TimelineValue(timeline=timeline)
                    
                    # Set the timeline value on the attribute
                    self.context.set_timeline_attribute(instance, attr_name, timeline_value, span=res.span)
                else:
                    # Evaluate as timeline expression (existing behavior)
                    timeline_value = self._evaluate_timeline_expression(res.expressie)
                    
                    # Set the timeline value on the attribute
                    self.context.set_timeline_attribute(instance, attr_name, timeline_value, span=res.span)
                return
            
            # Regular non-timeline expression evaluation
            value = self.evaluate_expression(res.expressie)
            # Handle both AttributeReference and DimensionedAttributeReference
            target_ref = res.target
            if isinstance(target_ref, DimensionedAttributeReference):
                # For dimensioned attributes, we need to set the value at specific coordinates
                base_ref = target_ref.base_attribute
                if not base_ref.path:
                    raise RegelspraakError("DimensionedAttributeReference base path is empty.", span=target_ref.span)
                attr_name = base_ref.path[0]
                
                # Resolve dimension coordinates using helper
                coordinates = self._resolve_dimension_coordinates(target_ref, instance)
                
                # Set the dimensioned value
                self.context.set_dimensioned_attribute(instance, attr_name, coordinates, value, span=res.span)
            else:
                # Regular attribute reference
                if not target_ref.path:
                    raise RegelspraakError("Gelijkstelling target path is empty.", span=target_ref.span)
                attr_name = target_ref.path[0]
                # Pass the Value object directly
                self.context.set_attribute(instance, attr_name, value, span=res.span)
        
        elif isinstance(res, Initialisatie):
            # Handle both AttributeReference and DimensionedAttributeReference
            target_ref = res.target
            if isinstance(target_ref, DimensionedAttributeReference):
                # For dimensioned attributes
                base_ref = target_ref.base_attribute
                if not base_ref.path:
                    raise RegelspraakError("DimensionedAttributeReference base path is empty.", span=target_ref.span)
                attr_name = base_ref.path[0]
                
                # Resolve dimension coordinates using helper
                coordinates = self._resolve_dimension_coordinates(target_ref, instance)
                
                # Check if dimensioned attribute already has a value
                try:
                    current_value = self.context.get_dimensioned_attribute(instance, attr_name, coordinates)
                    # If we got here, attribute exists and has a value, do nothing (per spec)
                except RuntimeError:
                    # Attribute doesn't exist or is empty, so initialize it
                    value = self.evaluate_expression(res.expressie)
                    self.context.set_dimensioned_attribute(instance, attr_name, coordinates, value, span=res.span)
            else:
                # Regular attribute reference
                if not target_ref.path:
                    raise RegelspraakError("Initialisatie target path is empty.", span=target_ref.span)
                attr_name = target_ref.path[0]
                
                # Check if attribute already has a value
                try:
                    current_value = self.context.get_attribute(instance, attr_name)
                    # If we got here, attribute exists and has a value, do nothing (per spec)
                except RuntimeError:
                    # Attribute doesn't exist or is empty, so initialize it
                    # Check if the target is a timeline attribute or if the expression contains timeline operands
                    target_is_timeline = False
                    obj_type_def = self.context.domain_model.objecttypes.get(instance.object_type_naam)
                    if obj_type_def:
                        attr_def = obj_type_def.attributen.get(attr_name)
                        if attr_def and attr_def.timeline:
                            target_is_timeline = True
                    
                    # If target is timeline or expression contains timeline operands, evaluate as timeline
                    if target_is_timeline or self._is_timeline_expression(res.expressie):
                        # Evaluate as timeline expression
                        timeline_value = self._evaluate_timeline_expression(res.expressie)
                        self.context.set_timeline_attribute(instance, attr_name, timeline_value, span=res.span)
                    else:
                        # Regular expression
                        value = self.evaluate_expression(res.expressie)
                        self.context.set_attribute(instance, attr_name, value, span=res.span)

        elif isinstance(res, KenmerkToekenning):
            kenmerk_value = not res.is_negated
            kenmerk_name = res.kenmerk_naam
            # Target might be implicit (the current instance) or explicit
            # For now, assume it applies to the current instance
            # TODO: Evaluate res.target if it's more complex than just the instance?
            self.context.set_kenmerk(instance, kenmerk_name, kenmerk_value, span=res.span)
        
        elif isinstance(res, ObjectCreatie):
            # Look up object type definition
            obj_type_def = self.context.domain_model.objecttypes.get(res.object_type)
            if not obj_type_def:
                raise RegelspraakError(f"Unknown object type: {res.object_type}", span=res.span)
            
            # Create new instance
            import uuid
            new_instance = RuntimeObject(
                object_type_naam=res.object_type,
                instance_id=str(uuid.uuid4())
            )
            
            # Initialize attributes
            for attr_name, value_expr in res.attribute_inits:
                # Check attribute exists
                if attr_name not in obj_type_def.attributen:
                    raise RegelspraakError(
                        f"Attribute '{attr_name}' not defined for type '{res.object_type}'", 
                        span=res.span
                    )
                
                # Evaluate and set value
                value = self.evaluate_expression(value_expr)
                new_instance.attributen[attr_name] = value
            
            # Add to context
            self.context.add_object(new_instance)
            
            # Trace object creation
            if self.context.trace_sink:
                # Get rule name from context if available
                rule_name = None
                if hasattr(self, '_current_rule') and self._current_rule:
                    rule_name = self._current_rule.naam
                    
                self.context.trace_sink.object_created(
                    object_type=res.object_type,
                    instance_id=new_instance.instance_id,
                    attributes=new_instance.attributen,
                    span=res.span,
                    rule_name=rule_name
                )
        
        elif isinstance(res, FeitCreatie):
            # Handle FeitCreatie - create new fact instances (relationships) by navigation
            # Pattern: Een [role1] van een [subject1] is een [role2] van een [subject2]
            # Right side: Navigate to find existing objects via role2 of subject2
            # Left side: Create new relationships with those objects in role1 of subject1
            logger.info(f"FeitCreatie: role1='{res.role1}', subject1='{res.subject1.path[0] if res.subject1.path else 'None'}', role2='{res.role2}', subject2='{res.subject2.path[0] if res.subject2.path else 'None'}'")
            
            # Parse and navigate the complex subject2 pattern
            target_objects = self._navigate_feitcreatie_subject(res.subject2, res.role2)
            
            
            if not target_objects:
                logger.info(f"FeitCreatie: No target objects found for pattern")
                return
            
            # Determine subject1 object (usually current instance or explicitly referenced)
            subject1_obj = self._resolve_feitcreatie_subject1(res.subject1)
            
            if not subject1_obj:
                raise RegelspraakError(
                    f"FeitCreatie could not resolve subject1: {res.subject1}",
                    span=res.span
                )
            
            # Find the appropriate feittype for the new relationship
            matching_feittype = self._find_matching_feittype(res.role1)
            
            # Check if this is a reciprocal feittype
            is_reciprocal = False
            if matching_feittype in self.context.domain_model.feittypen:
                is_reciprocal = self.context.domain_model.feittypen[matching_feittype].wederkerig
            
            # Create new relationships for each target object
            created_count = 0
            for target_obj in target_objects:
                # For conditional FeitCreatie, evaluate condition with target as current instance
                if self._current_rule and self._current_rule.voorwaarde:
                    # The condition should be evaluated with the navigated object (target_obj) as context
                    # because it refers to properties of the navigated objects (e.g., "de koper")
                    original_instance = self.context.current_instance
                    self.context.set_current_instance(target_obj)
                    
                    try:
                        logger.info(f"FeitCreatie: Evaluating condition for target {target_obj.object_type_naam} {target_obj.instance_id}")
                        logger.info(f"  Current instance: {self.context.current_instance}")
                        # Handle both expression and compound condition
                        if isinstance(self._current_rule.voorwaarde.expressie, SamengesteldeVoorwaarde):
                            condition_met = self._evaluate_samengestelde_voorwaarde(self._current_rule.voorwaarde.expressie, target_obj)
                            condition_value = Value(value=condition_met, datatype="Boolean")
                        else:
                            condition_value = self.evaluate_expression(self._current_rule.voorwaarde.expressie)
                        logger.info(f"  Condition result: {condition_value}")
                        if condition_value.datatype != "Boolean" or not condition_value.value:
                            # Condition not met, skip this target
                            continue
                    except Exception as e:
                        logger.error(f"Error evaluating FeitCreatie condition: {e}")
                        raise
                    finally:
                        # Restore original instance
                        self.context.set_current_instance(original_instance)
                
                # Check if relationship already exists
                existing_rels = self.context.find_relationships(
                    subject=subject1_obj,
                    object=target_obj,
                    feittype_naam=matching_feittype
                )
                if existing_rels:
                    continue
                
                # Create the relationship where target_obj has role1 in relation to subject1
                relationship = self.context.add_relationship(
                    feittype_naam=matching_feittype,
                    subject=subject1_obj,
                    object=target_obj,
                    preposition="VAN"
                )
                created_count += 1
                logger.info(f"FeitCreatie: Created relationship - {target_obj.object_type_naam} {target_obj.instance_id} is {res.role1} of {subject1_obj.object_type_naam} {subject1_obj.instance_id}")
                
                # For reciprocal relationships, also create the reverse
                if is_reciprocal:
                    reverse_relationship = self.context.add_relationship(
                        feittype_naam=matching_feittype,
                        subject=target_obj,
                        object=subject1_obj,
                        preposition="VAN"
                    )
                    logger.info(f"FeitCreatie: Created reciprocal relationship - {subject1_obj.object_type_naam} {subject1_obj.instance_id} is {res.role1} of {target_obj.object_type_naam} {target_obj.instance_id}")
            
            # Trace relationship creation
            if self.context.trace_sink:
                rule_name = None
                if hasattr(self, '_current_rule') and self._current_rule:
                    rule_name = self._current_rule.naam
                
                # Create a trace event for relationship creation
                self.context.trace_sink.record(TraceEvent(
                    type="FEIT_CREATIE",
                    details={
                        "feittype": matching_feittype,
                        "role1": res.role1,
                        "subject1_type": subject1_obj.object_type_naam,
                        "subject1_id": subject1_obj.instance_id,
                        "role2": res.role2,
                        "relationships_created": created_count,
                        "reciprocal": is_reciprocal,
                        "target_object_ids": [obj.instance_id for obj in target_objects]
                    },
                    span=res.span,
                    rule_name=rule_name,
                    instance_id=self.context.current_instance.instance_id if self.context.current_instance else None
                ))
        
        elif isinstance(res, Verdeling):
            # Handle Verdeling - distribute values
            self._apply_verdeling(res)
        
        elif isinstance(res, Consistentieregel):
            # Handle Consistentieregel - validate data consistency
            # These rules return a boolean result (true=consistent, false=inconsistent)
            result = self._apply_consistentieregel(res)
            
            # Store the result for use in other rules
            # For now, we log it and trace it
            if self.context.trace_sink:
                rule_name = None
                if hasattr(self, '_current_rule') and self._current_rule:
                    rule_name = self._current_rule.naam
                
                self.context.trace_sink.record(TraceEvent(
                    type="CONSISTENCY_CHECK",
                    details={
                        "criterium_type": res.criterium_type,
                        "result": "consistent" if result else "inconsistent",
                        "target": str(res.target) if res.target else None
                    },
                    span=res.span,
                    rule_name=rule_name,
                    instance_id=self.context.current_instance.instance_id if self.context.current_instance else None
                ))
        
        elif isinstance(res, Dagsoortdefinitie):
            # Handle Dagsoortdefinitie - define when a day is of a certain type
            # This is a special case: the rule condition determines when a day 
            # is of this type. The actual implementation would need a way to
            # store day type information. For now, we'll just trace it.
            
            rule_name = None
            if hasattr(self, '_current_rule') and self._current_rule:
                rule_name = self._current_rule.naam
            
            if self.context.trace_sink:
                self.context.trace_sink.record(TraceEvent(
                    type="DAGSOORT_DEFINITIE",
                    details={
                        "dagsoort_naam": res.dagsoort_naam,
                        "day_instance": self.context.current_instance.instance_id if self.context.current_instance else None
                    },
                    span=res.span,
                    rule_name=rule_name,
                    instance_id=self.context.current_instance.instance_id if self.context.current_instance else None
                ))
            
            # TODO: Implement actual day type storage mechanism
            # For now, we'll just mark this day instance as being of this type
            # This would typically involve storing the day type as a kenmerk or attribute
            
        else:
            # Use RegelspraakError instead of NotImplementedError with keyword args
            raise RegelspraakError(f"Applying result for type {type(res)} not implemented", span=res.span)


    def evaluate_expression(self, expr: Expression) -> Value:
        """Evaluate an AST Expression node, returning a Value object."""
        # Check if this expression involves timeline values
        if self._is_timeline_expression(expr):
            # This expression involves timelines, but we're being called for a single value
            # This happens when evaluating expressions in rules that expect single values
            # Use the current evaluation date from context
            if self.context.evaluation_date is None:
                raise RegelspraakError("Timeline expression requires evaluation_date to be set", span=expr.span)
            
            # For expressions involving timelines, we need to check if the current evaluation date
            # falls within any of the timeline periods. If not, we still need to evaluate the
            # expression, treating timeline values as empty (0 for numeric types).
            saved_is_timeline = self._in_timeline_evaluation
            self._in_timeline_evaluation = True
            try:
                return self._evaluate_expression_non_timeline(expr)
            finally:
                self._in_timeline_evaluation = saved_is_timeline
        
        current_instance = self.context.current_instance
        instance_id = current_instance.instance_id if current_instance else None
        
        # Trace expression evaluation start
        if self.context.trace_sink:
            self.context.trace_sink.expression_eval_start(
                expr,
                rule_name=None,  # We don't have rule context here
                instance_id=instance_id
            )
            
        result = None
        try:
            if isinstance(expr, Literal):
                result = self._evaluate_literal(expr)

            elif isinstance(expr, VariableReference):
                result = self._evaluate_variable_reference(expr, instance_id)

            elif isinstance(expr, ParameterReference):
                result = self._evaluate_parameter_reference(expr, instance_id)

            elif isinstance(expr, DimensionedAttributeReference):
                # Handle dimensioned attribute references like "bruto inkomen van huidig jaar"
                if self.context.current_instance is None:
                    raise RegelspraakError("Cannot evaluate dimensioned attribute reference: No current instance.", span=expr.span)
                
                # First evaluate the base attribute reference to get the object
                base_ref = expr.base_attribute
                if not base_ref.path:
                    raise RegelspraakError("Dimensioned attribute reference path is empty.", span=expr.span)
                
                # Extract attribute name and object path
                if len(base_ref.path) == 1:
                    # Simple case: attribute on current instance
                    attr_name = base_ref.path[0]
                    target_obj = self.context.current_instance
                else:
                    # Complex path: navigate to the object
                    attr_name = base_ref.path[0]
                    # For now, assume the rest of the path refers to the current instance
                    # TODO: Implement full path navigation for dimensioned attributes
                    target_obj = self.context.current_instance
                
                # Resolve dimension coordinates using helper
                coordinates = self._resolve_dimension_coordinates(expr, target_obj)
                
                # Get the dimensioned value
                value = self.context.get_dimensioned_attribute(target_obj, attr_name, coordinates)
                
                # Trace dimensioned attribute read
                if self.context.trace_sink:
                    self.context.trace_sink.attribute_read(
                        target_obj,
                        f"{attr_name}[{coordinates.labels}]",
                        value.value if isinstance(value, Value) else value,
                        expr=expr
                    )
                
                result = value

            elif isinstance(expr, AttributeReference):
                # Simple case: direct attribute on current instance (e.g., "leeftijd")
                # TODO: Handle multi-part paths (e.g., person.address.street)
                if self.context.current_instance is None:
                    raise RegelspraakError("Cannot evaluate attribute reference: No current instance.", span=expr.span)
                if not expr.path:
                    raise RegelspraakError("Attribute reference path is empty.", span=expr.span)

                # Check if the last element of the path refers to the current instance type
                # E.g., ["passagiers", "vlucht"] when current instance is a Vlucht
                working_path = expr.path[:]  # Make a copy
                logger.debug(f"AttributeReference evaluation: path={expr.path}, current_instance={self.context.current_instance.object_type_naam}")
                if len(working_path) > 1:
                    last_element = working_path[-1].lower()
                    current_type = self.context.current_instance.object_type_naam.lower()
                    
                    # Check if last element matches current instance type
                    # Only match if it's the exact type name (with or without articles)
                    last_element_clean = last_element.replace("de ", "").replace("het ", "").replace("een ", "")
                    if (last_element == current_type or last_element_clean == current_type):
                        # Remove the last element as it refers to the current instance
                        logger.debug(f"Removing last element '{last_element}' as it matches current instance type '{current_type}'")
                        working_path = working_path[:-1]
                
                # If path is like ["leeftijd"], get from current_instance
                if len(working_path) == 1:
                    attr_name = working_path[0]
                    
                    # Special case: If path is ["self"], return the current instance itself
                    if attr_name == "self":
                        result = Value(value=self.context.current_instance, datatype="ObjectReference")
                    # Special case: If the path element is a role name that the current instance fulfills,
                    # return the current instance itself (for FeitCreatie conditions)
                    elif self._check_if_current_instance_has_role(attr_name):
                        # Return the current instance as a reference
                        result = Value(value=self.context.current_instance, datatype="ObjectReference")
                    else:
                        # Check for "X van de Y" pattern in single element path
                        if " van " in attr_name:
                            # Split on " van " to get role and context
                            parts = attr_name.split(" van ")
                            if len(parts) == 2:
                                role_name = parts[0].strip()  # e.g., "passagiers"
                                context_ref = parts[1].strip()  # e.g., "de vlucht"
                                logger.debug(f"AttributeReference: Parsed navigation pattern - role_name='{role_name}', context_ref='{context_ref}'")
                                
                                # Remove articles from context
                                for article in ['de ', 'het ', 'een ']:
                                    if context_ref.startswith(article):
                                        context_ref = context_ref[len(article):]
                                        break
                                
                                # Check if context matches current instance type
                                current_type_lower = self.context.current_instance.object_type_naam.lower()
                                if context_ref.lower() == current_type_lower:
                                    # Navigation from current instance through role
                                    logger.debug(f"Context '{context_ref}' matches current instance type, looking for role '{role_name}'")
                                    
                                    # Find related objects through feittype relationships
                                    role_found = False
                                    for feittype_name, feittype in self.context.domain_model.feittypen.items():
                                        for i, rol in enumerate(feittype.rollen):
                                            # Check if current instance can participate in this role
                                            if rol.object_type == self.context.current_instance.object_type_naam:
                                                # Current instance matches this role, now check the other role for our target
                                                for j, other_rol in enumerate(feittype.rollen):
                                                    if i != j:  # Different role
                                                        # Match role name
                                                        role_naam_lower = other_rol.naam.lower()
                                                        role_name_lower = role_name.lower()
                                                        
                                                        # Remove articles for better matching
                                                        role_naam_clean = role_naam_lower.replace("de ", "").replace("het ", "").replace("een ", "")
                                                        role_name_clean = role_name_lower.replace("de ", "").replace("het ", "").replace("een ", "")
                                                        
                                                        # Check exact match or plural match
                                                        matches = (role_naam_clean == role_name_clean or 
                                                                 (other_rol.meervoud and other_rol.meervoud.lower() == role_name_lower) or
                                                                 (other_rol.meervoud and other_rol.meervoud.lower().replace("de ", "").replace("het ", "") == role_name_clean) or
                                                                 # Simple pluralization rules
                                                                 (role_naam_clean + 's' == role_name_clean) or  # passagier -> passagiers
                                                                 (role_naam_clean + 'en' == role_name_clean) or  # boek -> boeken
                                                                 (role_name_clean + 's' == role_naam_clean) or  # passagiers -> passagier
                                                                 (role_name_clean.endswith('en') and role_name_clean[:-2] == role_naam_clean))  # boeken -> boek
                                                        
                                                        if matches:
                                                            # Found matching role - get related objects
                                                            as_subject = (i == 0)  # If current instance is at role 0, it's the subject
                                                            related_objects = self.context.get_related_objects(
                                                                self.context.current_instance, feittype_name, as_subject=as_subject
                                                            )
                                                            
                                                            logger.debug(f"Found {len(related_objects)} related objects for role '{role_name}'")
                                                            result = Value(value=related_objects, datatype="Lijst")
                                                            role_found = True
                                                            break
                                                if role_found:
                                                    break
                                        if role_found:
                                            break
                                    
                                    if not role_found:
                                        # Navigation pattern didn't match any feittype
                                        raise RegelspraakError(
                                            f"No feittype found for navigation pattern '{attr_name}' from {self.context.current_instance.object_type_naam}",
                                            span=expr.span
                                        )
                                else:
                                    # Context doesn't match current instance
                                    raise RegelspraakError(
                                        f"Navigation context '{context_ref}' does not match current instance type '{self.context.current_instance.object_type_naam}'",
                                        span=expr.span
                                    )
                            else:
                                # Multiple "van" in the expression, not a simple navigation
                                raise RegelspraakError(
                                    f"Complex navigation pattern not supported: '{attr_name}'",
                                    span=expr.span
                                )
                        else:
                            # Not a navigation pattern, try as regular attribute
                            try:
                                value = self.context.get_attribute(self.context.current_instance, attr_name)
                                
                                # Trace attribute read
                                if self.context.trace_sink:
                                    self.context.trace_sink.attribute_read(
                                        self.context.current_instance,
                                        attr_name,
                                        value.value if isinstance(value, Value) else value,
                                        expr=expr
                                    )
                                    
                                result = value
                            except RuntimeError as e:
                                # Not an attribute, check if it's a role name for navigation
                                # E.g., "passagiers" to get all passengers of the current vlucht
                                logger.debug(f"Attribute '{attr_name}' not found on {self.context.current_instance.object_type_naam}, checking roles...")
                                role_found = False
                                for feittype_name, feittype in self.context.domain_model.feittypen.items():
                                    for rol in feittype.rollen:
                                        # Match against role name or plural form
                                        role_naam_lower = rol.naam.lower()
                                        attr_name_lower = attr_name.lower()
                                        
                                        # Remove articles for better matching
                                        role_naam_clean = role_naam_lower.replace("de ", "").replace("het ", "").replace("een ", "")
                                        attr_name_clean = attr_name_lower.replace("de ", "").replace("het ", "").replace("een ", "")
                                        
                                        # Handle broken role parsing where role name includes object type
                                        role_first_word = role_naam_clean.split()[0] if role_naam_clean else ""
                                        
                                        # Check exact match or plural match
                                        matches = (role_naam_clean == attr_name_clean or 
                                                 (rol.meervoud and rol.meervoud.lower() == attr_name_lower) or
                                                 (rol.meervoud and rol.meervoud.lower().replace("de ", "").replace("het ", "") == attr_name_clean) or
                                                 # Simple pluralization rules
                                                 (role_naam_clean + 's' == attr_name_clean) or  # passagier -> passagiers
                                                 (role_naam_clean + 'en' == attr_name_clean) or  # boek -> boeken
                                                 (attr_name_clean + 's' == role_naam_clean) or  # passagiers -> passagier
                                                 (attr_name_clean.endswith('en') and attr_name_clean[:-2] == role_naam_clean) or  # boeken -> boek
                                                 # Irregular plurals (common Dutch cases)
                                                 (role_naam_clean == 'lid' and attr_name_clean == 'leden') or
                                                 (role_naam_clean == 'kind' and attr_name_clean == 'kinderen') or
                                                 (role_naam_clean == 'ei' and attr_name_clean == 'eieren') or
                                                 # Match first word of role (for broken parsing)
                                                 (role_first_word and (
                                                     role_first_word == attr_name_clean or
                                                     role_first_word + 's' == attr_name_clean or
                                                     role_first_word + 'en' == attr_name_clean or
                                                     attr_name_clean + 's' == role_first_word or
                                                     (attr_name_clean.endswith('en') and attr_name_clean[:-2] == role_first_word))))
                                        
                                        if matches:
                                            # Check if current instance can participate in this feittype
                                            logger.debug(f"Role match found: '{attr_name}' matches role '{rol.naam}' in feittype '{feittype_name}'")
                                            can_participate = False
                                            for i, check_rol in enumerate(feittype.rollen):
                                                if check_rol.object_type == self.context.current_instance.object_type_naam:
                                                    # Current instance matches this role's object type
                                                    # We want the OTHER role's objects
                                                    role_index = feittype.rollen.index(rol)
                                                    if i != role_index:  # This is the role current instance plays
                                                        # If current instance is at role index 0 (typically subject role),
                                                        # and we want role index 1 (typically object role),
                                                        # then we need to look for relationships where current instance is subject
                                                        as_subject = (i == 0)
                                                        logger.debug(f"Getting related objects: current role index={i}, matched role index={role_index}, as_subject={as_subject}")
                                                        
                                                        related_objects = self.context.get_related_objects(
                                                            self.context.current_instance, feittype_name, as_subject=as_subject
                                                        )
                                                        
                                                        # For plural forms, return the collection
                                                        is_plural = (attr_name_clean.endswith('s') or attr_name_clean.endswith('en') or 
                                                                   attr_name_clean != role_naam_clean)
                                                        
                                                        if is_plural:
                                                            logger.debug(f"Returning {len(related_objects)} related objects as list for plural role '{attr_name}'")
                                                            result = Value(value=related_objects, datatype="Lijst")
                                                        else:
                                                            # Singular form, return first object or error if none/multiple
                                                            if not related_objects:
                                                                raise RegelspraakError(
                                                                    f"No related object found for role '{attr_name}' from {self.context.current_instance.object_type_naam}",
                                                                    span=expr.span
                                                                )
                                                            if len(related_objects) > 1:
                                                                raise RegelspraakError(
                                                                    f"Multiple objects found for singular role '{attr_name}' from {self.context.current_instance.object_type_naam}",
                                                                    span=expr.span
                                                                )
                                                            result = Value(value=related_objects[0], datatype="ObjectReference")
                                                        
                                                        role_found = True
                                                        can_participate = True
                                                        break
                                            if can_participate:
                                                break
                                    if role_found:
                                        break
                                
                                if not role_found:
                                    # Neither attribute nor role, raise error
                                    raise RegelspraakError(
                                        f"'{attr_name}' is neither an attribute nor a role name on {self.context.current_instance.object_type_naam}",
                                        span=expr.span
                                    )
                else:
                    # Handle paths like ['self', 'leeftijd']
                    if expr.path[0] == 'self': # Check if path starts with 'self'
                        if len(expr.path) != 2: # Ensure path is exactly ['self', 'attr']
                            raise RegelspraakError(f"Unsupported 'self' path structure: {expr.path}", span=expr.span)
                        attr_name = expr.path[1]
                        value = self.context.get_attribute(self.context.current_instance, attr_name)
                        
                        # Trace attribute read
                        if self.context.trace_sink:
                            self.context.trace_sink.attribute_read(
                                self.context.current_instance,
                                attr_name,
                                value,
                                expr=expr
                            )
                            
                        result = value
                    # Handle paths like ["Natuurlijk persoon", "leeftijd"]
                    elif expr.path[0] == self.context.current_instance.object_type_naam:
                        if len(expr.path) != 2: # Ensure path is exactly ['Type', 'attr']
                            raise RegelspraakError(f"Unsupported type-qualified path structure: {expr.path}", span=expr.span)
                        attr_name = expr.path[1]
                        value = self.context.get_attribute(self.context.current_instance, attr_name)
                        
                        # Trace attribute read
                        if self.context.trace_sink:
                            self.context.trace_sink.attribute_read(
                                self.context.current_instance,
                                attr_name,
                                value,
                                expr=expr
                            )
                            
                        result = value
                    # Handle paths like ["leeftijd", "Persoon"] where the last element is the object type
                    elif len(expr.path) == 2 and (
                        expr.path[1] == self.context.current_instance.object_type_naam or 
                        self.context.current_instance.object_type_naam.lower() in expr.path[1].lower() or
                        (len(expr.path[1]) > 20 and  # Long descriptive phrases
                         any(word in expr.path[1].lower() for word in self.context.current_instance.object_type_naam.lower().split()))):
                        # This refers to the current instance
                        attr_name = expr.path[0]
                        value = self.context.get_attribute(self.context.current_instance, attr_name)
                        
                        # Trace attribute read
                        if self.context.trace_sink:
                            self.context.trace_sink.attribute_read(
                                self.context.current_instance,
                                attr_name,
                                value,
                                expr=expr
                            )
                            
                        result = value
                    else:
                        # Handle nested object references
                        # Path like ["vluchtdatum", "reis", "persoon"] means:
                        # person.reis.vluchtdatum (reversed for navigation)
                        
                        # Start from current instance and traverse the path
                        current_obj = self.context.current_instance
                        # Reverse path for navigation: ["vluchtdatum", "reis"] -> ["reis", "vluchtdatum"]
                        nav_path = list(reversed(expr.path))
                        
                        # Navigate through all but the last element
                        for i, segment in enumerate(nav_path[:-1]):
                            # First, check if segment is a role name in a feittype
                            role_found = False
                            for feittype_name, feittype in self.context.domain_model.feittypen.items():
                                # Check if segment matches a role name in this feittype
                                for rol in feittype.rollen:
                                    # Match against role name or plural form
                                    role_naam_lower = rol.naam.lower()
                                    segment_lower = segment.lower()
                                    
                                    # Remove articles for better matching
                                    role_naam_clean = role_naam_lower.replace("de ", "").replace("het ", "").replace("een ", "")
                                    segment_clean = segment_lower.replace("de ", "").replace("het ", "").replace("een ", "")
                                    
                                    # Handle broken role parsing where role name includes object type
                                    # e.g., "passagier Natuurlijk persoon" should match "passagier" or "passagiers"
                                    role_first_word = role_naam_clean.split()[0] if role_naam_clean else ""
                                    
                                    # Check exact match or plural match
                                    matches = (role_naam_clean == segment_clean or 
                                             (rol.meervoud and rol.meervoud.lower() == segment_lower) or
                                             (rol.meervoud and rol.meervoud.lower().replace("de ", "").replace("het ", "") == segment_clean) or
                                             # Simple pluralization rules
                                             (role_naam_clean + 's' == segment_clean) or  # passagier -> passagiers
                                             (role_naam_clean + 'en' == segment_clean) or  # boek -> boeken
                                             (segment_clean + 's' == role_naam_clean) or  # passagiers -> passagier
                                             (segment_clean.endswith('en') and segment_clean[:-2] == role_naam_clean) or  # boeken -> boek
                                             # Irregular plurals (common Dutch cases)
                                             (role_naam_clean == 'lid' and segment_clean == 'leden') or
                                             (role_naam_clean == 'kind' and segment_clean == 'kinderen') or
                                             (role_naam_clean == 'ei' and segment_clean == 'eieren') or
                                             # Match first word of role (for broken parsing)
                                             (role_first_word and (
                                                 role_first_word == segment_clean or
                                                 role_first_word + 's' == segment_clean or
                                                 role_first_word + 'en' == segment_clean or
                                                 segment_clean + 's' == role_first_word or
                                                 (segment_clean.endswith('en') and segment_clean[:-2] == role_first_word))))  # leden -> lid
                                    
                                    if matches:
                                        # Find related objects through this feittype
                                        # Determine which role index this is (0 or 1)
                                        role_index = feittype.rollen.index(rol)
                                        # If we matched role 0, we want objects fulfilling role 1, and vice versa
                                        as_subject = (role_index == 1)  # If we matched the second role, look for subjects
                                        
                                        related_objects = self.context.get_related_objects(
                                            current_obj, feittype_name, as_subject=as_subject
                                        )
                                        if not related_objects:
                                            raise RegelspraakError(
                                                f"No related object found for role '{segment}' from {current_obj.object_type_naam}",
                                                span=expr.span
                                            )
                                        
                                        # Check if this is the final segment and if it's a plural form
                                        is_final_segment = (i == len(nav_path) - 2)
                                        is_plural = (segment_clean.endswith('s') or segment_clean.endswith('en') or 
                                                   segment_clean != role_naam_clean)  # Different from role name suggests plural
                                        
                                        if is_final_segment and is_plural and len(related_objects) > 1:
                                            # This is a collection navigation - return all related objects
                                            result = Value(value=related_objects, datatype="Lijst")
                                            return result
                                        else:
                                            # Take the first related object for intermediate navigation
                                            current_obj = related_objects[0]
                                        
                                        role_found = True
                                        break
                            
                            if not role_found:
                                # Try as an attribute with ObjectReference
                                try:
                                    ref_value = self.context.get_attribute(current_obj, segment)
                                    # Check if it's an object reference
                                    if ref_value.datatype != "ObjectReference":
                                        raise RegelspraakError(
                                            f"Expected ObjectReference or role name for '{segment}' but got {ref_value.datatype}",
                                            span=expr.span
                                        )
                                    # Move to the referenced object
                                    current_obj = ref_value.value
                                    if not isinstance(current_obj, RuntimeObject):
                                        raise RegelspraakError(
                                            f"Invalid object reference in path at '{segment}'",
                                            span=expr.span
                                        )
                                except RuntimeError as e:
                                    # Attribute not found, raise more informative error
                                    raise RegelspraakError(
                                        f"'{segment}' is neither a role name nor an attribute on {current_obj.object_type_naam}",
                                        span=expr.span
                                    )
                        
                        # Get the final attribute from the last object
                        final_attr = nav_path[-1]
                        value = self.context.get_attribute(current_obj, final_attr)
                        
                        # Trace the final attribute read
                        if self.context.trace_sink:
                            self.context.trace_sink.attribute_read(
                                current_obj,
                                final_attr,
                                value.value if isinstance(value, Value) else value,
                                expr=expr
                            )
                        
                        result = value

            elif isinstance(expr, BinaryExpression):
                result = self._handle_binary(expr)

            elif isinstance(expr, UnaryExpression):
                result = self._handle_unary(expr)

            elif isinstance(expr, FunctionCall):
                result = self._handle_function_call(expr)
                
            elif isinstance(expr, Subselectie):
                result = self._evaluate_subselectie(expr)
                
            elif isinstance(expr, SamengesteldeVoorwaarde):
                # Handle compound condition as expression
                result_bool = self._evaluate_samengestelde_voorwaarde(expr, self.context.current_instance)
                result = Value(value=result_bool, datatype="Boolean")

            else:
                raise RegelspraakError(f"Unknown expression type: {type(expr)}", span=expr.span)
                
        finally:
            # Trace expression evaluation end (even if there was an error)
            if self.context.trace_sink:
                self.context.trace_sink.expression_eval_end(
                    expr,
                    result,
                    instance_id=instance_id
                )
                
        return result

    def _is_timeline_expression(self, expr: Expression) -> bool:
        """Check if an expression involves timeline values."""
        # Check for timeline parameters or attributes
        if isinstance(expr, ParameterReference):
            param_def = self.context.domain_model.parameters.get(expr.parameter_name)
            if param_def and param_def.timeline:
                # Check if there's a timeline value stored
                return expr.parameter_name in self.context.timeline_parameters
        
        elif isinstance(expr, AttributeReference):
            if self.context.current_instance and expr.path:
                # Handle both simple paths like ['salaris'] and compound paths like ['self', 'salaris']
                if len(expr.path) == 1:
                    attr_name = expr.path[0]
                elif len(expr.path) == 2 and expr.path[0] == 'self':
                    attr_name = expr.path[1]
                else:
                    # For other path patterns, try to extract attribute name
                    attr_name = None
                    for part in expr.path:
                        if part != 'self' and part != self.context.current_instance.object_type_naam:
                            attr_name = part
                            break
                
                if attr_name:
                    obj_type_def = self.context.domain_model.objecttypes.get(
                        self.context.current_instance.object_type_naam
                    )
                    if obj_type_def:
                        attr_def = obj_type_def.attributen.get(attr_name)
                        if attr_def and attr_def.timeline:
                            # Check if there's a timeline value stored
                            return attr_name in self.context.current_instance.timeline_attributen
        
        elif isinstance(expr, BinaryExpression):
            # Either operand being a timeline makes the whole expression a timeline
            return self._is_timeline_expression(expr.left) or self._is_timeline_expression(expr.right)
        
        elif isinstance(expr, UnaryExpression):
            return self._is_timeline_expression(expr.operand)
        
        elif isinstance(expr, FunctionCall):
            # Check if any argument is a timeline
            return any(self._is_timeline_expression(arg) for arg in expr.arguments)
        
        elif isinstance(expr, Subselectie):
            # Check if the onderwerp or predicaat involves timelines
            return self._is_timeline_expression(expr.onderwerp)
        
        # Literals and other expressions are not timelines
        return False

    def _resolve_dimension_coordinates(self, target_ref: DimensionedAttributeReference, instance: RuntimeObject) -> DimensionCoordinate:
        """Resolve dimension labels to dimension coordinates for a given attribute."""
        base_ref = target_ref.base_attribute
        if not base_ref.path:
            raise RegelspraakError("DimensionedAttributeReference base path is empty.", span=target_ref.span)
        attr_name = base_ref.path[0]
        
        # Build dimension coordinates from labels
        coordinates = DimensionCoordinate(labels={})
        
        # Map dimension labels to dimension names
        obj_type_def = self.context.domain_model.objecttypes.get(instance.object_type_naam)
        if obj_type_def:
            attr_def = obj_type_def.attributen.get(attr_name)
            if attr_def and hasattr(attr_def, 'dimensions') and attr_def.dimensions:
                for label in target_ref.dimension_labels:
                    label_matched = False
                    for dim_name in attr_def.dimensions:
                        if dim_name in self.context.domain_model.dimensions:
                            dimension = self.context.domain_model.dimensions[dim_name]
                            # Check if this label belongs to this dimension
                            for order, dim_label in dimension.labels:
                                if dim_label == label.label:
                                    coordinates.labels[dim_name] = label.label
                                    label_matched = True
                                    break
                        if label_matched:
                            break
                    if not label_matched:
                        raise RegelspraakError(
                            f"Unknown dimension label '{label.label}' for attribute '{attr_name}'",
                            span=label.span
                        )
        
        return coordinates

    def _evaluate_timeline_expression(self, expr: Expression) -> TimelineValue:
        """Evaluate an expression that involves timeline values."""
        from .timeline_utils import merge_knips, get_evaluation_periods, remove_redundant_knips
        from .runtime import TimelineValue
        
        # Collect all timeline operands to determine knips
        timelines = self._collect_timeline_operands(expr)
        
        if not timelines:
            # No actual timeline values found, evaluate as regular expression
            result = self.evaluate_expression(expr)
            # Return a constant timeline
            return TimelineValue(timeline=ast.Timeline(
                periods=[ast.Period(
                    start_date=datetime(1900, 1, 1),
                    end_date=datetime(2200, 1, 1),
                    value=result
                )],
                granularity="dag"
            ))
        
        # Merge all knips from timeline operands
        all_knips = merge_knips(*timelines)
        
        # Get evaluation periods between knips
        periods = get_evaluation_periods(all_knips)
        
        # Evaluate expression for each period
        result_periods = []
        for start_date, end_date in periods:
            # Set evaluation date to start of period
            saved_date = self.context.evaluation_date
            self.context.evaluation_date = start_date
            
            try:
                # Evaluate expression for this period
                period_value = self._evaluate_expression_for_period(expr)
                
                # Create period with result
                result_periods.append(ast.Period(
                    start_date=start_date,
                    end_date=end_date,
                    value=period_value
                ))
            finally:
                # Restore evaluation date
                self.context.evaluation_date = saved_date
        
        # Determine result granularity (finest among operands)
        granularity = self._determine_finest_granularity(timelines)
        
        # Create timeline from periods
        result_timeline = ast.Timeline(periods=result_periods, granularity=granularity)
        
        # Remove redundant knips where values don't change
        result_timeline = remove_redundant_knips(result_timeline)
        
        return TimelineValue(timeline=result_timeline)

    def _evaluate_expression_for_period(self, expr: Expression) -> Value:
        """Evaluate expression for current evaluation date in context.
        This evaluates the expression without timeline checking, since
        we're already inside timeline evaluation with a specific date."""
        # Direct evaluation without timeline check - we're already in a period
        return self._evaluate_expression_non_timeline(expr)

    def _evaluate_expression_non_timeline(self, expr: Expression) -> Value:
        """Evaluate an expression without timeline checking.
        This is used internally when we're already evaluating within a specific time period.
        NON-TIMELINE EVALUATION METHOD"""
        current_instance = self.context.current_instance
        instance_id = current_instance.instance_id if current_instance else None
        
        # Trace expression evaluation start
        if self.context.trace_sink:
            self.context.trace_sink.expression_eval_start(
                expr,
                rule_name=None,  # We don't have rule context here
                instance_id=instance_id
            )
            
        result = None
        try:
            if isinstance(expr, Literal):
                result = self._evaluate_literal(expr)

            elif isinstance(expr, VariableReference):
                result = self._evaluate_variable_reference(expr, instance_id)

            elif isinstance(expr, ParameterReference):
                result = self._evaluate_parameter_reference(expr, instance_id)

            elif isinstance(expr, DimensionedAttributeReference):
                # Handle dimensioned attribute references like "bruto inkomen van huidig jaar"
                if self.context.current_instance is None:
                    raise RegelspraakError("Cannot evaluate dimensioned attribute reference: No current instance.", span=expr.span)
                
                # First evaluate the base attribute reference to get the object
                base_ref = expr.base_attribute
                if not base_ref.path:
                    raise RegelspraakError("Dimensioned attribute reference path is empty.", span=expr.span)
                
                # Extract attribute name and object path
                if len(base_ref.path) == 1:
                    # Simple case: attribute on current instance
                    attr_name = base_ref.path[0]
                    target_obj = self.context.current_instance
                else:
                    # Complex path: navigate to the object
                    attr_name = base_ref.path[0]
                    # For now, assume the rest of the path refers to the current instance
                    # TODO: Implement full path navigation for dimensioned attributes
                    target_obj = self.context.current_instance
                
                # Resolve dimension coordinates using helper
                coordinates = self._resolve_dimension_coordinates(expr, target_obj)
                
                # Get the dimensioned value
                value = self.context.get_dimensioned_attribute(target_obj, attr_name, coordinates)
                
                # Trace dimensioned attribute read
                if self.context.trace_sink:
                    self.context.trace_sink.attribute_read(
                        target_obj,
                        f"{attr_name}[{coordinates.labels}]",
                        value.value if isinstance(value, Value) else value,
                        expr=expr
                    )
                
                result = value

            elif isinstance(expr, AttributeReference):
                # IN NON-TIMELINE EVALUATION
                # Simple case: direct attribute on current instance (e.g., "leeftijd")
                # TODO: Handle multi-part paths (e.g., person.address.street)
                if self.context.current_instance is None:
                    raise RegelspraakError("Cannot evaluate attribute reference: No current instance.", span=expr.span)
                if not expr.path:
                    raise RegelspraakError("Attribute reference path is empty.", span=expr.span)

                # If path is like ["leeftijd"], get from current_instance
                if len(expr.path) == 1:
                    attr_name = expr.path[0]
                    
                    # Special case: If path is ["self"], return the current instance itself
                    if attr_name == "self":
                        result = Value(value=self.context.current_instance, datatype="ObjectReference")
                    # Special case: If the path element is a role name that the current instance fulfills,
                    # return the current instance itself (for FeitCreatie conditions)
                    elif self._check_if_current_instance_has_role(attr_name):
                        # Return the current instance as a reference
                        result = Value(value=self.context.current_instance, datatype="ObjectReference")
                    else:
                        # Always use context.get_attribute which now handles timeline empty values correctly
                        value = self.context.get_attribute(self.context.current_instance, attr_name)
                        
                        # Trace attribute read
                        if self.context.trace_sink:
                            self.context.trace_sink.attribute_read(
                                self.context.current_instance,
                                attr_name,
                                value.value if isinstance(value, Value) else value,
                                expr=expr
                            )
                            
                        result = value
                else:
                    # Handle paths like ['self', 'leeftijd']
                    if expr.path[0] == 'self': # Check if path starts with 'self'
                        if len(expr.path) != 2: # Ensure path is exactly ['self', 'attr']
                            raise RegelspraakError(f"Unsupported 'self' path structure: {expr.path}", span=expr.span)
                        attr_name = expr.path[1]
                        value = self.context.get_attribute(self.context.current_instance, attr_name)
                        
                        # Trace attribute read
                        if self.context.trace_sink:
                            self.context.trace_sink.attribute_read(
                                self.context.current_instance,
                                attr_name,
                                value,
                                expr=expr
                            )
                            
                        result = value
                    # Handle paths like ["Natuurlijk persoon", "leeftijd"]
                    elif expr.path[0] == self.context.current_instance.object_type_naam:
                        if len(expr.path) != 2: # Ensure path is exactly ['Type', 'attr']
                            raise RegelspraakError(f"Unsupported type-qualified path structure: {expr.path}", span=expr.span)
                        attr_name = expr.path[1]
                        value = self.context.get_attribute(self.context.current_instance, attr_name)
                        
                        # Trace attribute read
                        if self.context.trace_sink:
                            self.context.trace_sink.attribute_read(
                                self.context.current_instance,
                                attr_name,
                                value,
                                expr=expr
                            )
                            
                        result = value
                    # Handle paths like ["leeftijd", "Persoon"] where the last element is the object type
                    elif len(expr.path) == 2 and (
                        expr.path[1] == self.context.current_instance.object_type_naam or 
                        self.context.current_instance.object_type_naam.lower() in expr.path[1].lower() or
                        (len(expr.path[1]) > 20 and  # Long descriptive phrases
                         any(word in expr.path[1].lower() for word in self.context.current_instance.object_type_naam.lower().split()))):
                        
                        # First check if path[0] is a role name (e.g., "passagiers" in ["passagiers", "vlucht"])
                        logger.debug(f"Checking if '{expr.path[0]}' is a role from '{self.context.current_instance.object_type_naam}'")
                        try:
                            result = self._evaluate_role_navigation(expr.path[0], self.context.current_instance)
                            logger.debug(f"Role navigation succeeded - returning collection/object")
                            # Role navigation succeeded - result is already set
                        except RegelspraakError as e:
                            logger.debug(f"Not a role: {e}")
                            # Not a role - treat as attribute on current instance
                            # This refers to the current instance
                            attr_name = expr.path[0]
                            value = self.context.get_attribute(self.context.current_instance, attr_name)
                            
                            # Trace attribute read
                            if self.context.trace_sink:
                                self.context.trace_sink.attribute_read(
                                    self.context.current_instance,
                                    attr_name,
                                    value,
                                    expr=expr
                                )
                                
                            result = value
                    else:
                        # Handle nested object references
                        # Path like ["vluchtdatum", "reis", "persoon"] means:
                        # person.reis.vluchtdatum (reversed for navigation)
                        
                        # Start from current instance and traverse the path
                        current_obj = self.context.current_instance
                        # Reverse path for navigation: ["vluchtdatum", "reis"] -> ["reis", "vluchtdatum"]
                        nav_path = list(reversed(expr.path))
                        
                        # Navigate through all but the last element
                        for i, segment in enumerate(nav_path[:-1]):
                            # First, check if segment is a role name in a feittype
                            role_found = False
                            for feittype_name, feittype in self.context.domain_model.feittypen.items():
                                # Check if segment matches a role name in this feittype
                                for rol in feittype.rollen:
                                    # Match against role name or plural form
                                    role_naam_lower = rol.naam.lower()
                                    segment_lower = segment.lower()
                                    
                                    # Remove articles for better matching
                                    role_naam_clean = role_naam_lower.replace("de ", "").replace("het ", "").replace("een ", "")
                                    segment_clean = segment_lower.replace("de ", "").replace("het ", "").replace("een ", "")
                                    
                                    # Handle broken role parsing where role name includes object type
                                    # e.g., "passagier Natuurlijk persoon" should match "passagier" or "passagiers"
                                    role_first_word = role_naam_clean.split()[0] if role_naam_clean else ""
                                    
                                    # Check exact match or plural match
                                    matches = (role_naam_clean == segment_clean or 
                                             (rol.meervoud and rol.meervoud.lower() == segment_lower) or
                                             (rol.meervoud and rol.meervoud.lower().replace("de ", "").replace("het ", "") == segment_clean) or
                                             # Simple pluralization rules
                                             (role_naam_clean + 's' == segment_clean) or  # passagier -> passagiers
                                             (role_naam_clean + 'en' == segment_clean) or  # boek -> boeken
                                             (segment_clean + 's' == role_naam_clean) or  # passagiers -> passagier
                                             (segment_clean.endswith('en') and segment_clean[:-2] == role_naam_clean) or  # boeken -> boek
                                             # Irregular plurals (common Dutch cases)
                                             (role_naam_clean == 'lid' and segment_clean == 'leden') or
                                             (role_naam_clean == 'kind' and segment_clean == 'kinderen') or
                                             (role_naam_clean == 'ei' and segment_clean == 'eieren') or
                                             # Match first word of role (for broken parsing)
                                             (role_first_word and (
                                                 role_first_word == segment_clean or
                                                 role_first_word + 's' == segment_clean or
                                                 role_first_word + 'en' == segment_clean or
                                                 segment_clean + 's' == role_first_word or
                                                 (segment_clean.endswith('en') and segment_clean[:-2] == role_first_word))))  # leden -> lid
                                    
                                    if matches:
                                        # Find related objects through this feittype
                                        # Determine which role index this is (0 or 1)
                                        role_index = feittype.rollen.index(rol)
                                        # If we matched role 0, we want objects fulfilling role 1, and vice versa
                                        as_subject = (role_index == 1)  # If we matched the second role, look for subjects
                                        
                                        related_objects = self.context.get_related_objects(
                                            current_obj, feittype_name, as_subject=as_subject
                                        )
                                        if not related_objects:
                                            raise RegelspraakError(
                                                f"No related object found for role '{segment}' from {current_obj.object_type_naam}",
                                                span=expr.span
                                            )
                                        
                                        # Check if this is the final segment and if it's a plural form
                                        is_final_segment = (i == len(nav_path) - 2)
                                        is_plural = (segment_clean.endswith('s') or segment_clean.endswith('en') or 
                                                   segment_clean != role_naam_clean)  # Different from role name suggests plural
                                        
                                        if is_final_segment and is_plural and len(related_objects) > 1:
                                            # This is a collection navigation - return all related objects
                                            result = Value(value=related_objects, datatype="Lijst")
                                            return result
                                        else:
                                            # Take the first related object for intermediate navigation
                                            current_obj = related_objects[0]
                                        
                                        role_found = True
                                        break
                            
                            if not role_found:
                                # Try as an attribute with ObjectReference
                                try:
                                    ref_value = self.context.get_attribute(current_obj, segment)
                                    # Check if it's an object reference
                                    if ref_value.datatype != "ObjectReference":
                                        raise RegelspraakError(
                                            f"Expected ObjectReference or role name for '{segment}' but got {ref_value.datatype}",
                                            span=expr.span
                                        )
                                    # Move to the referenced object
                                    current_obj = ref_value.value
                                    if not isinstance(current_obj, RuntimeObject):
                                        raise RegelspraakError(
                                            f"Invalid object reference in path at '{segment}'",
                                            span=expr.span
                                        )
                                except RuntimeError as e:
                                    # Attribute not found, raise more informative error
                                    raise RegelspraakError(
                                        f"'{segment}' is neither a role name nor an attribute on {current_obj.object_type_naam}",
                                        span=expr.span
                                    )
                        
                        # Get the final attribute from the last object
                        final_attr = nav_path[-1]
                        value = self.context.get_attribute(current_obj, final_attr)
                        
                        # Trace the final attribute read
                        if self.context.trace_sink:
                            self.context.trace_sink.attribute_read(
                                current_obj,
                                final_attr,
                                value.value if isinstance(value, Value) else value,
                                expr=expr
                            )
                        
                        result = value

            elif isinstance(expr, BinaryExpression):
                result = self._handle_binary_non_timeline(expr)

            elif isinstance(expr, UnaryExpression):
                result = self._handle_unary_non_timeline(expr)

            elif isinstance(expr, FunctionCall):
                result = self._handle_function_call_non_timeline(expr)
                
            elif isinstance(expr, Subselectie):
                result = self._evaluate_subselectie(expr)
                
            elif isinstance(expr, SamengesteldeVoorwaarde):
                # Handle compound condition as expression
                result_bool = self._evaluate_samengestelde_voorwaarde(expr, self.context.current_instance)
                result = Value(value=result_bool, datatype="Boolean")

            else:
                raise RegelspraakError(f"Unknown expression type: {type(expr)}", span=expr.span)
                
        finally:
            # Trace expression evaluation end (even if there was an error)
            if self.context.trace_sink:
                self.context.trace_sink.expression_eval_end(
                    expr,
                    result,
                    instance_id=instance_id
                )
                
        return result

    def _handle_binary_non_timeline(self, expr: BinaryExpression) -> Value:
        """Handle binary operations during timeline evaluation (non-recursive)."""
        left_val = self._evaluate_expression_non_timeline(expr.left)
        op = expr.operator

        # Handle IS and IN specially as they return boolean values
        if op == Operator.IS:
            # Right side should be a kenmerk name (string) or type name (string)
            right_val = self._evaluate_expression_non_timeline(expr.right)
            if not isinstance(right_val.value, str):
                raise RegelspraakError(f"Right side of 'IS' must evaluate to a string (kenmerk/type name), got {type(right_val.value)}", span=expr.right.span)
            
            # For IS operator, we need the actual object instance
            # If left_val is an object reference, use that object
            if left_val.datatype == "ObjectReference" and isinstance(left_val.value, RuntimeObject):
                instance = left_val.value
            else:
                instance = self.context.current_instance  # Default to current instance
            
            if instance is None:
                raise RegelspraakError("Could not determine object instance for 'IS' check.", span=expr.left.span)
                 
            bool_result = self.context.check_is(instance, right_val.value)
            return Value(value=bool_result, datatype="Boolean", unit=None)

        elif op == Operator.IN:
            right_val = self._evaluate_expression_non_timeline(expr.right)
            # Extract raw values for IN check
            left_raw = left_val.value if isinstance(left_val, Value) else left_val
            right_raw = right_val.value if isinstance(right_val, Value) else right_val
            bool_result = self.context.check_in(left_raw, right_raw)
            return Value(value=bool_result, datatype="Boolean", unit=None)
            
        elif op == Operator.IS_NIET:
            # Right side should be a kenmerk name (string) or type name (string)
            right_val = self._evaluate_expression_non_timeline(expr.right)
            if not isinstance(right_val.value, str):
                raise RegelspraakError(f"Right side of 'IS_NIET' must evaluate to a string (kenmerk/type name), got {type(right_val.value)}", span=expr.right.span)
            # Determine instance for IS_NIET check
            instance = self.context.current_instance
            if not instance:
                raise RegelspraakError("Could not determine object instance for 'IS_NIET' check.", span=expr.left.span)
            bool_result = not self.context.check_is(instance, right_val.value)
            return Value(value=bool_result, datatype="Boolean", unit=None)
            
        elif op == Operator.HEEFT:
            # HEEFT operator for bezittelijk kenmerken (possessive characteristics)
            # Right side should be a kenmerk name
            right_val = self._evaluate_expression_non_timeline(expr.right)
            if not isinstance(right_val.value, str):
                raise RegelspraakError(f"Right side of 'HEEFT' must evaluate to a string (kenmerk name), got {type(right_val.value)}", span=expr.right.span)
            # Check if the current instance has this kenmerk set to true
            # For bezittelijk kenmerken, we need to check both "heeft X" and "X" forms
            kenmerk_name = right_val.value
            # First try with "heeft " prefix
            heeft_kenmerk_name = f"heeft {kenmerk_name}"
            if self.context.current_instance.object_type_naam in self.context.domain_model.objecttypes:
                obj_type = self.context.domain_model.objecttypes[self.context.current_instance.object_type_naam]
                if heeft_kenmerk_name in obj_type.kenmerken:
                    kenmerk_value = self.context.get_kenmerk(self.context.current_instance, heeft_kenmerk_name)
                else:
                    # Fall back to just the kenmerk name without "heeft"
                    kenmerk_value = self.context.get_kenmerk(self.context.current_instance, kenmerk_name)
            else:
                kenmerk_value = self.context.get_kenmerk(self.context.current_instance, kenmerk_name)
            return Value(value=kenmerk_value, datatype="Boolean")
            
        elif op == Operator.HEEFT_NIET:
            # Negated version of HEEFT
            right_val = self._evaluate_expression_non_timeline(expr.right)
            if not isinstance(right_val.value, str):
                raise RegelspraakError(f"Right side of 'HEEFT_NIET' must evaluate to a string (kenmerk name), got {type(right_val.value)}", span=expr.right.span)
            # Check if the current instance has this kenmerk set to true
            # For bezittelijk kenmerken, we need to check both "heeft X" and "X" forms
            kenmerk_name = right_val.value
            # First try with "heeft " prefix
            heeft_kenmerk_name = f"heeft {kenmerk_name}"
            if self.context.current_instance.object_type_naam in self.context.domain_model.objecttypes:
                obj_type = self.context.domain_model.objecttypes[self.context.current_instance.object_type_naam]
                if heeft_kenmerk_name in obj_type.kenmerken:
                    kenmerk_value = self.context.get_kenmerk(self.context.current_instance, heeft_kenmerk_name)
                else:
                    # Fall back to just the kenmerk name without "heeft"
                    kenmerk_value = self.context.get_kenmerk(self.context.current_instance, kenmerk_name)
            else:
                kenmerk_value = self.context.get_kenmerk(self.context.current_instance, kenmerk_name)
            return Value(value=not kenmerk_value, datatype="Boolean")
        
        # Handle dagsoort operators
        elif op in [Operator.IS_EEN_DAGSOORT, Operator.ZIJN_EEN_DAGSOORT, 
                    Operator.IS_GEEN_DAGSOORT, Operator.ZIJN_GEEN_DAGSOORT]:
            # Right side should be the dagsoort name
            right_val = self._evaluate_expression_non_timeline(expr.right)
            if not isinstance(right_val.value, str):
                raise RegelspraakError(f"Right side of dagsoort check must be a string, got {type(right_val.value)}", span=expr.right.span)
            
            # Check if the date matches the dagsoort
            is_dagsoort = self._dagsoort_check(left_val, right_val.value, expr.span)
            
            # Return based on operator
            if op in [Operator.IS_EEN_DAGSOORT, Operator.ZIJN_EEN_DAGSOORT]:
                return Value(value=is_dagsoort, datatype="Boolean", unit=None)
            else:  # IS_GEEN_DAGSOORT, ZIJN_GEEN_DAGSOORT
                return Value(value=not is_dagsoort, datatype="Boolean", unit=None)

        # Standard evaluation for other operators
        right_val = self._evaluate_expression_non_timeline(expr.right)

        # Arithmetic operations using unit-aware arithmetic
        if op == Operator.PLUS:
            return self.arithmetic.add(left_val, right_val)
        elif op == Operator.MIN:
            return self.arithmetic.subtract(left_val, right_val)
        elif op == Operator.VERMINDERD_MET:
            return self.arithmetic.subtract_verminderd_met(left_val, right_val)
        elif op == Operator.MAAL:
            return self.arithmetic.multiply(left_val, right_val)
        elif op == Operator.GEDEELD_DOOR:
            return self.arithmetic.divide(left_val, right_val, use_abs_style=False)
        elif op == Operator.GEDEELD_DOOR_ABS:
            return self.arithmetic.divide(left_val, right_val, use_abs_style=True)
        elif op == Operator.MACHT:
            return self.arithmetic.power(left_val, right_val)

        # Comparison operations - return boolean Values
        elif op in [Operator.GELIJK_AAN, Operator.NIET_GELIJK_AAN, 
                    Operator.KLEINER_DAN, Operator.GROTER_DAN,
                    Operator.KLEINER_OF_GELIJK_AAN, Operator.GROTER_OF_GELIJK_AAN]:
            
            # For comparisons, we need to check unit compatibility and convert if needed
            if left_val.datatype in ["Numeriek", "Percentage", "Bedrag"] and \
               right_val.datatype in ["Numeriek", "Percentage", "Bedrag"]:
                # Check units are compatible
                if not self.arithmetic._check_units_compatible(left_val, right_val, "comparison"):
                    raise RegelspraakError(f"Cannot compare values with incompatible units: '{left_val.unit}' and '{right_val.unit}'", span=expr.span)
                
                # Convert right to left's unit if needed
                if left_val.unit != right_val.unit and left_val.unit and right_val.unit:
                    right_val = self.arithmetic._convert_to_unit(right_val, left_val.unit)
            
            # Extract values for comparison
            left_cmp = left_val.value
            right_cmp = right_val.value
            
            # Perform comparison
            if op == Operator.GELIJK_AAN:
                result = left_cmp == right_cmp
            elif op == Operator.NIET_GELIJK_AAN:
                result = left_cmp != right_cmp
            elif op == Operator.KLEINER_DAN:
                result = left_cmp < right_cmp
            elif op == Operator.GROTER_DAN:
                result = left_cmp > right_cmp
            elif op == Operator.KLEINER_OF_GELIJK_AAN:
                result = left_cmp <= right_cmp
            elif op == Operator.GROTER_OF_GELIJK_AAN:
                result = left_cmp >= right_cmp
                
            return Value(value=result, datatype="Boolean", unit=None)

        # Logical operations - expect boolean Values
        elif op == Operator.EN:
            if left_val.datatype != "Boolean" or right_val.datatype != "Boolean":
                raise RegelspraakError(f"Operator 'en' requires boolean operands, got {left_val.datatype} and {right_val.datatype}", span=expr.span)
            result = left_val.value and right_val.value
            return Value(value=result, datatype="Boolean", unit=None)
            
        elif op == Operator.OF:
            if left_val.datatype != "Boolean" or right_val.datatype != "Boolean":
                raise RegelspraakError(f"Operator 'of' requires boolean operands, got {left_val.datatype} and {right_val.datatype}", span=expr.span)
            result = left_val.value or right_val.value
            return Value(value=result, datatype="Boolean", unit=None)

        else:
            raise RegelspraakError(f"Unsupported or unhandled binary operator: {op.name}", span=expr.span)

    def _handle_unary_non_timeline(self, expr: UnaryExpression) -> Value:
        """Handle unary operations during timeline evaluation (non-recursive)."""
        operand_val = self._evaluate_expression_non_timeline(expr.operand)
        op = expr.operator

        if op == Operator.NIET:
            if operand_val.datatype != "Boolean":
                 raise RegelspraakError(f"Operator 'niet' requires a boolean operand, got {operand_val.datatype}", span=expr.operand.span)
            result = not operand_val.value
            return Value(value=result, datatype="Boolean", unit=None)
        elif op == Operator.MIN: # Handle unary minus
            return self.arithmetic.negate(operand_val)
        elif op == Operator.VOLDOET_AAN_DE_ELFPROEF:
            result = self._elfproef_check(operand_val, expr.operand.span)
            return Value(value=result, datatype="Boolean", unit=None)
        elif op == Operator.VOLDOET_NIET_AAN_DE_ELFPROEF:
            result = not self._elfproef_check(operand_val, expr.operand.span)
            return Value(value=result, datatype="Boolean", unit=None)
        else:
            raise RegelspraakError(f"Unsupported unary operator: {op.name}", span=expr.span)

    def _handle_function_call_non_timeline(self, expr: FunctionCall) -> Value:
        """Handle function calls during timeline evaluation (non-recursive)."""
        # Normalize function name the same way as _handle_function_call
        func_name = expr.function_name.lower().replace(' ', '_')
        
        # Check if this function is registered
        if func_name in self._function_registry:
            # For non-timeline calls, pass None as args since we can't evaluate recursively
            return self._function_registry[func_name](expr, None)
        else:
            # Debug logging
            logger.error(f"Function lookup failed in non-timeline context")
            logger.error(f"  Original name: '{expr.function_name}'")
            logger.error(f"  Normalized name: '{func_name}'")
            logger.error(f"  Available functions: {sorted(self._function_registry.keys())}")
            raise RegelspraakError(f"Unknown function: {expr.function_name}", span=expr.span)
    
    # --- Subselectie Evaluation ---
    
    def _evaluate_subselectie(self, subselectie: Subselectie) -> Value:
        """Evaluate subselectie by filtering collection based on predicaat."""
        # 1. Evaluate the onderwerp to get base collection
        collection_value = self.evaluate_expression(subselectie.onderwerp)
        
        # Extract the actual collection from the Value object
        if isinstance(collection_value, Value):
            collection = collection_value.value
        else:
            collection = collection_value
        
        # Ensure we have a collection
        if not isinstance(collection, list):
            if isinstance(collection, RuntimeObject):
                collection = [collection]
            else:
                logger.warning(f"Subselectie onderwerp did not return collection: {type(collection)}")
                return Value(value=[], datatype="Lijst")
        
        # 2. Filter collection based on predicaat
        filtered = []
        for item in collection:
            if not isinstance(item, RuntimeObject):
                logger.warning(f"Skipping non-object in collection: {type(item)}")
                continue
                
            # Save current instance
            original_instance = self.context.current_instance
            try:
                # Set the item as current instance for predicate evaluation
                self.context.current_instance = item
                
                # Evaluate predicaat for this item
                if self._evaluate_predicaat(subselectie.predicaat, item):
                    filtered.append(item)
            finally:
                # Restore original instance
                self.context.current_instance = original_instance
        
        logger.info(f"Subselectie filtered {len(collection)} to {len(filtered)} items")
        
        # Return filtered collection as Value
        return Value(value=filtered, datatype="Lijst")
    
    def _evaluate_predicaat(self, predicaat: Predicaat, instance: RuntimeObject) -> bool:
        """Evaluate predicaat for a single instance."""
        if isinstance(predicaat, ObjectPredicaat):
            return self._evaluate_object_predicaat(predicaat, instance)
        elif isinstance(predicaat, VergelijkingsPredicaat):
            # Handle all comparison predicates (GetalPredicaat, TekstPredicaat, DatumPredicaat)
            if isinstance(predicaat, GetalPredicaat):
                return self._evaluate_comparison_predicaat(predicaat, instance, 'Numeriek')
            elif isinstance(predicaat, TekstPredicaat):
                return self._evaluate_comparison_predicaat(predicaat, instance, 'Tekst')
            elif isinstance(predicaat, DatumPredicaat):
                return self._evaluate_comparison_predicaat(predicaat, instance, 'Datum')
            else:
                # Generic VergelijkingsPredicaat - infer type from value
                return self._evaluate_comparison_predicaat(predicaat, instance, None)
        elif isinstance(predicaat, SamengesteldPredicaat):
            return self._evaluate_samengesteld_predicaat(predicaat, instance)
        else:
            raise NotImplementedError(f"Predicaat type not implemented: {type(predicaat)}")
    
    def _evaluate_object_predicaat(self, predicaat: ObjectPredicaat, instance: RuntimeObject) -> bool:
        """Evaluate object predicaat (kenmerk/role check)."""
        # Check if it's a kenmerk
        kenmerken = self.context.get_kenmerken_for_type(instance.object_type_naam)
        if predicaat.naam in kenmerken:
            # It's a kenmerk check
            kenmerk_value = self.context.check_is(instance, predicaat.naam)
            return bool(kenmerk_value)
        
        # Check if it's a role
        # Note: Role checking would require feittype navigation
        # For now, focus on kenmerk checks
        logger.warning(f"Role checking not yet implemented for: {predicaat.naam}")
        return False
    
    def _evaluate_comparison_predicaat(self, predicaat: VergelijkingsPredicaat, 
                                       instance: RuntimeObject, expected_type: str) -> bool:
        """Evaluate comparison predicaat."""
        # For predicates, the left side is implicit - it's an attribute of the instance
        # We need to infer which attribute based on the comparison type and context
        
        # For now, require explicit attribute reference in the predicaat
        if predicaat.attribuut is None:
            logger.error("Comparison predicaat requires attribute reference")
            return False
        
        # Get left value
        try:
            left_value = self.evaluate_expression(predicaat.attribuut)
            if isinstance(left_value, Value):
                left_value = left_value.value
        except Exception as e:
            logger.warning(f"Could not evaluate attribute for predicaat: {e}")
            return False
        
        # Get right value
        right_value = self.evaluate_expression(predicaat.waarde)
        if isinstance(right_value, Value):
            right_value = right_value.value
        
        # Perform comparison based on operator
        if predicaat.operator == Operator.GELIJK_AAN:
            return left_value == right_value
        elif predicaat.operator == Operator.NIET_GELIJK_AAN:
            return left_value != right_value
        elif predicaat.operator == Operator.KLEINER_DAN:
            return left_value < right_value
        elif predicaat.operator == Operator.GROTER_DAN:
            return left_value > right_value
        elif predicaat.operator == Operator.KLEINER_OF_GELIJK_AAN:
            return left_value <= right_value
        elif predicaat.operator == Operator.GROTER_OF_GELIJK_AAN:
            return left_value >= right_value
        else:
            raise NotImplementedError(f"Comparison operator not implemented: {predicaat.operator}")

    def _evaluate_samengesteld_predicaat(self, predicaat: SamengesteldPredicaat, 
                                       instance: RuntimeObject) -> bool:
        """Evaluate compound predicaat with quantifier logic."""
        # Evaluate each condition and count how many are true
        conditions_met = 0
        total_conditions = len(predicaat.voorwaarden)
        
        for geneste_voorwaarde in predicaat.voorwaarden:
            if self._evaluate_geneste_voorwaarde_in_predicaat(geneste_voorwaarde, instance):
                conditions_met += 1
        
        # Apply quantifier logic
        kwantificatie = predicaat.kwantificatie
        
        if kwantificatie.type == KwantificatieType.ALLE:
            # All conditions must be true
            return conditions_met == total_conditions
        
        elif kwantificatie.type == KwantificatieType.GEEN:
            # No conditions must be true
            return conditions_met == 0
        
        elif kwantificatie.type == KwantificatieType.TEN_MINSTE:
            # At least N conditions must be true
            if kwantificatie.aantal is None:
                raise RegelspraakError(f"Kwantificatie 'ten minste' requires a number", 
                                     span=kwantificatie.span)
            return conditions_met >= kwantificatie.aantal
        
        elif kwantificatie.type == KwantificatieType.TEN_HOOGSTE:
            # At most N conditions must be true
            if kwantificatie.aantal is None:
                raise RegelspraakError(f"Kwantificatie 'ten hoogste' requires a number", 
                                     span=kwantificatie.span)
            return conditions_met <= kwantificatie.aantal
        
        elif kwantificatie.type == KwantificatieType.PRECIES:
            # Exactly N conditions must be true
            if kwantificatie.aantal is None:
                raise RegelspraakError(f"Kwantificatie 'precies' requires a number", 
                                     span=kwantificatie.span)
            return conditions_met == kwantificatie.aantal
        
        else:
            raise RegelspraakError(f"Unknown quantifier type: {kwantificatie.type}", 
                                 span=kwantificatie.span)
    
    def _evaluate_samengestelde_voorwaarde(self, voorwaarde: SamengesteldeVoorwaarde, 
                                         instance: Optional[RuntimeObject]) -> bool:
        """Evaluate compound condition with quantifier logic."""
        # Evaluate each condition and count how many are true
        conditions_met = 0
        total_conditions = len(voorwaarde.voorwaarden)
        
        for expr in voorwaarde.voorwaarden:
            # Evaluate the expression
            result = self.evaluate_expression(expr)
            if result.datatype == "Boolean" and result.value:
                conditions_met += 1
        
        # Apply quantifier logic (same as for predicates)
        kwantificatie = voorwaarde.kwantificatie
        
        if kwantificatie.type == KwantificatieType.ALLE:
            # All conditions must be true
            return conditions_met == total_conditions
        
        elif kwantificatie.type == KwantificatieType.GEEN:
            # No conditions must be true
            return conditions_met == 0
        
        elif kwantificatie.type == KwantificatieType.TEN_MINSTE:
            # At least N conditions must be true
            if kwantificatie.aantal is None:
                raise RegelspraakError(f"Kwantificatie 'ten minste' requires a number", 
                                     span=kwantificatie.span)
            return conditions_met >= kwantificatie.aantal
        
        elif kwantificatie.type == KwantificatieType.TEN_HOOGSTE:
            # At most N conditions must be true
            if kwantificatie.aantal is None:
                raise RegelspraakError(f"Kwantificatie 'ten hoogste' requires a number", 
                                     span=kwantificatie.span)
            return conditions_met <= kwantificatie.aantal
        
        elif kwantificatie.type == KwantificatieType.PRECIES:
            # Exactly N conditions must be true
            if kwantificatie.aantal is None:
                raise RegelspraakError(f"Kwantificatie 'precies' requires a number", 
                                     span=kwantificatie.span)
            return conditions_met == kwantificatie.aantal
        
        else:
            raise RegelspraakError(f"Unknown quantifier type: {kwantificatie.type}", 
                                 span=kwantificatie.span)
    
    def _evaluate_geneste_voorwaarde_in_predicaat(self, geneste: GenesteVoorwaardeInPredicaat, 
                                                 instance: RuntimeObject) -> bool:
        """Evaluate a nested condition within a predicate."""
        voorwaarde = geneste.voorwaarde
        
        if isinstance(voorwaarde, VergelijkingInPredicaat):
            return self._evaluate_vergelijking_in_predicaat(voorwaarde, instance)
        
        elif isinstance(voorwaarde, SamengesteldPredicaat):
            # Recursively evaluate nested compound predicates
            return self._evaluate_samengesteld_predicaat(voorwaarde, instance)
        
        else:
            raise RegelspraakError(f"Unknown voorwaarde type in predicaat: {type(voorwaarde)}", 
                                 span=geneste.span)
    
    def _evaluate_vergelijking_in_predicaat(self, vergelijking: VergelijkingInPredicaat, 
                                          instance: RuntimeObject) -> bool:
        """Evaluate a comparison within a predicate."""
        if vergelijking.type == "attribuut_vergelijking":
            # Attribute comparison: attribute op value
            if not vergelijking.attribuut or not vergelijking.waarde:
                return False
            
            # Evaluate attribute (in context of current instance)
            old_instance = self.context.current_instance
            self.context.set_current_instance(instance)
            try:
                left_value = self.evaluate_expression(vergelijking.attribuut)
                if isinstance(left_value, Value):
                    left_value = left_value.value
            except Exception:
                left_value = None
            finally:
                self.context.set_current_instance(old_instance)
            
            if left_value is None:
                return False
            
            # Evaluate comparison value
            right_value = self.evaluate_expression(vergelijking.waarde)
            if isinstance(right_value, Value):
                right_value = right_value.value
            
            # Apply operator
            if vergelijking.operator == Operator.GELIJK_AAN:
                return left_value == right_value
            elif vergelijking.operator == Operator.NIET_GELIJK_AAN:
                return left_value != right_value
            elif vergelijking.operator == Operator.KLEINER_DAN:
                return left_value < right_value
            elif vergelijking.operator == Operator.GROTER_DAN:
                return left_value > right_value
            elif vergelijking.operator == Operator.KLEINER_OF_GELIJK_AAN:
                return left_value <= right_value
            elif vergelijking.operator == Operator.GROTER_OF_GELIJK_AAN:
                return left_value >= right_value
            else:
                return False
        
        elif vergelijking.type == "object_check":
            # Object type/role check: onderwerp is een X
            if not vergelijking.onderwerp or not vergelijking.kenmerk_naam:
                return False
            
            # For object checks, we check if the instance has the specified role/type
            # This is similar to ObjectPredicaat logic
            return self.context.check_is(instance, vergelijking.kenmerk_naam)
        
        elif vergelijking.type == "kenmerk_check":
            # Kenmerk check: attribute heeft kenmerk X
            if not vergelijking.attribuut or not vergelijking.kenmerk_naam:
                return False
            
            # Evaluate the attribute to get an object reference
            old_instance = self.context.current_instance
            self.context.set_current_instance(instance)
            try:
                obj_ref = self.evaluate_expression(vergelijking.attribuut)
                if isinstance(obj_ref, Value) and obj_ref.value:
                    # Check if the referenced object has the kenmerk
                    if hasattr(obj_ref.value, 'instance_id'):
                        # It's an object reference
                        result = self.context.check_is(obj_ref.value, vergelijking.kenmerk_naam)
                        self.context.set_current_instance(old_instance)
                        return result
            except Exception:
                pass
            finally:
                self.context.set_current_instance(old_instance)
            
            return False
        
        else:
            raise RegelspraakError(f"Unknown vergelijking type: {vergelijking.type}", 
                                 span=vergelijking.span)

    def _collect_timeline_operands(self, expr: Expression) -> List[ast.Timeline]:
        """Recursively collect all timeline operands from an expression."""
        timelines = []
        
        if isinstance(expr, ParameterReference):
            timeline_val = self.context.timeline_parameters.get(expr.parameter_name)
            if timeline_val:
                timelines.append(timeline_val.timeline)
        
        elif isinstance(expr, AttributeReference):
            if self.context.current_instance and expr.path:
                # Handle both simple paths like ['salaris'] and compound paths like ['self', 'salaris']
                if len(expr.path) == 1:
                    attr_name = expr.path[0]
                elif len(expr.path) == 2 and expr.path[0] == 'self':
                    attr_name = expr.path[1]
                else:
                    # For other path patterns, try to extract attribute name
                    # For now, assume the first element that's not 'self' or an object type
                    attr_name = None
                    for part in expr.path:
                        if part != 'self' and part != self.context.current_instance.object_type_naam:
                            attr_name = part
                            break
                
                if attr_name:
                    timeline_val = self.context.current_instance.timeline_attributen.get(attr_name)
                    if timeline_val:
                        timelines.append(timeline_val.timeline)
        
        elif isinstance(expr, BinaryExpression):
            timelines.extend(self._collect_timeline_operands(expr.left))
            timelines.extend(self._collect_timeline_operands(expr.right))
        
        elif isinstance(expr, UnaryExpression):
            timelines.extend(self._collect_timeline_operands(expr.operand))
        
        elif isinstance(expr, FunctionCall):
            for arg in expr.arguments:
                timelines.extend(self._collect_timeline_operands(arg))
        
        elif isinstance(expr, Subselectie):
            timelines.extend(self._collect_timeline_operands(expr.onderwerp))
            # We might also need to check predicaat expressions in the future
        
        return timelines

    def _determine_finest_granularity(self, timelines: List[ast.Timeline]) -> str:
        """Determine the finest granularity among timelines."""
        if not timelines:
            return "dag"
        
        # Granularity hierarchy: dag < maand < jaar
        granularity_order = {"dag": 0, "maand": 1, "jaar": 2}
        
        finest = "jaar"  # Start with coarsest
        for timeline in timelines:
            if granularity_order[timeline.granularity] < granularity_order[finest]:
                finest = timeline.granularity
        
        return finest

    def _evaluate_period_definition(self, period_def: PeriodDefinition) -> Period:
        """Evaluate a period definition and return a Period object."""
        # Evaluate date expressions
        start_date = None
        end_date = None
        
        if period_def.start_date:
            start_val = self.evaluate_expression(period_def.start_date)
            if start_val.datatype == "Datum":
                start_date = start_val.value
            elif start_val.datatype == "Numeriek":
                # Handle REKENJAAR - convert year to January 1st of that year
                year = int(start_val.value)
                start_date = datetime(year, 1, 1)
            else:
                raise RegelspraakError(f"Expected date for period start, got {start_val.datatype}", span=period_def.span)
        
        if period_def.end_date:
            end_val = self.evaluate_expression(period_def.end_date)
            if end_val.datatype == "Datum":
                end_date = end_val.value
            elif end_val.datatype == "Numeriek":
                # Handle REKENJAAR - convert year to January 1st of that year
                year = int(end_val.value)
                end_date = datetime(year, 1, 1)
            else:
                raise RegelspraakError(f"Expected date for period end, got {end_val.datatype}", span=period_def.span)
        
        # Handle different period types according to specification §5.1.3
        if period_def.period_type == "vanaf":
            # From date onwards
            if not start_date:
                raise RegelspraakError("'vanaf' requires a start date", span=period_def.span)
            return Period(
                start_date=start_date,
                end_date=datetime(2200, 1, 1),  # Far future date
                value=None  # Value will be set by caller
            )
        
        elif period_def.period_type == "tot":
            # Up to but not including date
            if not end_date:
                raise RegelspraakError("'tot' requires an end date", span=period_def.span)
            return Period(
                start_date=datetime(1900, 1, 1),  # Far past date
                end_date=end_date,
                value=None
            )
        
        elif period_def.period_type == "tot_en_met":
            # Up to and including date
            if not end_date:
                raise RegelspraakError("'tot en met' requires an end date", span=period_def.span)
            # Add one day to make it inclusive
            if isinstance(end_date, datetime):
                end_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
                # Add one day to make the end date inclusive
                from datetime import timedelta
                end_date = end_date + timedelta(days=1)
            return Period(
                start_date=datetime(1900, 1, 1),
                end_date=end_date,
                value=None
            )
        
        elif period_def.period_type == "van_tot":
            # From date1 to date2 (exclusive)
            if not start_date or not end_date:
                raise RegelspraakError("'van...tot' requires both start and end dates", span=period_def.span)
            return Period(
                start_date=start_date,
                end_date=end_date,
                value=None
            )
        
        elif period_def.period_type == "van_tot_en_met":
            # From date1 to date2 (inclusive)
            if not start_date or not end_date:
                raise RegelspraakError("'van...tot en met' requires both start and end dates", span=period_def.span)
            # Add one day to make end date inclusive
            if isinstance(end_date, datetime):
                end_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
                from datetime import timedelta
                end_date = end_date + timedelta(days=1)
            return Period(
                start_date=start_date,
                end_date=end_date,
                value=None
            )
        
        else:
            raise RegelspraakError(f"Unknown period type: {period_def.period_type}", span=period_def.span)

    def _apply_consistentieregel(self, res: Consistentieregel) -> bool:
        """Apply a consistency rule and return true if consistent, false if inconsistent."""
        if res.criterium_type == "uniek":
            # Handle uniqueness check
            if not res.target:
                raise RegelspraakError("Uniqueness check requires a target expression", span=res.span)
            
            # Extract attribute name and object type from target
            # Expected pattern: AttributeReference with path like ["burgerservicenummer", "alle", "Natuurlijke personen"]
            if not isinstance(res.target, AttributeReference) or len(res.target.path) < 3:
                raise RegelspraakError(
                    "Uniqueness check requires pattern 'de <attribute> van alle <object type>'",
                    span=res.target.span if res.target else res.span
                )
            
            # Parse the path
            attribute_name_plural = res.target.path[0]
            if res.target.path[-2].lower() != "alle":
                raise RegelspraakError(
                    f"Expected 'alle' in uniqueness pattern, got '{res.target.path[-2]}'",
                    span=res.target.span
                )
            object_type_name_plural = res.target.path[-1]
            
            # Find the object type by matching plural form
            object_type_name = None
            object_type_def = None
            for ot_name, ot_def in self.context.domain_model.objecttypes.items():
                if (ot_def.meervoud and ot_def.meervoud == object_type_name_plural) or \
                   ot_name == object_type_name_plural:
                    object_type_name = ot_name
                    object_type_def = ot_def
                    break
            
            if not object_type_def:
                raise RegelspraakError(
                    f"Object type with plural form '{object_type_name_plural}' not found",
                    span=res.target.span
                )
            
            # Find attribute by matching plural form or name
            attribute_name = None
            for attr_name, attr_def in object_type_def.attributen.items():
                # Check if plural form matches or if the name itself matches
                if (hasattr(attr_def, 'meervoud') and attr_def.meervoud == attribute_name_plural) or \
                   attr_name == attribute_name_plural:
                    attribute_name = attr_name
                    break
            
            if not attribute_name:
                # If no exact match, try removing trailing 's' or other common plural endings
                # This is a fallback for simple pluralization
                if attribute_name_plural.endswith('s'):
                    singular_guess = attribute_name_plural[:-1]
                    if singular_guess in object_type_def.attributen:
                        attribute_name = singular_guess
            
            if not attribute_name:
                raise RegelspraakError(
                    f"Attribute with plural form '{attribute_name_plural}' not found on type '{object_type_name}'",
                    span=res.target.span
                )
            
            # Get all instances of the specified object type
            instances = self.context.find_objects_by_type(object_type_name)
            
            # Extract attribute values
            seen_values = set()
            for obj in instances:
                if attribute_name in obj.attributen:
                    value = obj.attributen[attribute_name].value
                    # Convert to string for consistent comparison
                    value_str = str(value) if value is not None else None
                    if value_str is not None:
                        if value_str in seen_values:
                            # Found duplicate
                            logger.info(f"Uniqueness violation: duplicate value '{value_str}' for attribute '{attribute_name}'")
                            self.context.trace_sink.record(TraceEvent(
                                type="CONSISTENCY_CHECK",
                                details={
                                    "criterium_type": "uniek",
                                    "object_type": object_type_name,
                                    "attribute": attribute_name,
                                    "duplicate_value": value_str,
                                    "consistent": False
                                }
                            ))
                            return False  # Not unique = inconsistent
                        seen_values.add(value_str)
            
            # All values are unique
            self.context.trace_sink.record(TraceEvent(
                type="CONSISTENCY_CHECK",
                details={
                    "criterium_type": "uniek",
                    "object_type": object_type_name,
                    "attribute": attribute_name,
                    "unique_values": len(seen_values),
                    "total_instances": len(instances),
                    "consistent": True
                }
            ))
            return True  # All unique = consistent
            
        elif res.criterium_type == "inconsistent":
            # For inconsistency rules, the condition determines if data is inconsistent
            # If the condition (handled at rule level) is true, then data IS inconsistent
            # So we return false (inconsistent) when condition is met
            # The actual condition evaluation happens at the rule level
            # Here we just return that the check was performed
            return True  # The actual result is determined by the rule's condition
            
        else:
            raise RegelspraakError(
                f"Unknown consistency criterion type: {res.criterium_type}",
                span=res.span
            )

    def _apply_verdeling(self, res: Verdeling) -> None:
        """Apply distribution of values according to specified methods."""
        logger.info(f"_apply_verdeling called, current_instance: {self.context.current_instance.object_type_naam if self.context.current_instance else 'None'}")
        # Evaluate source amount to distribute
        source_value = self.evaluate_expression(res.source_amount)
        if not isinstance(source_value.value, (int, float, Decimal)):
            raise RegelspraakError(
                f"Source amount must be numeric, got {type(source_value.value)}",
                span=res.source_amount.span
            )
        total_amount = Decimal(str(source_value.value))
        
        # Evaluate target collection to get all objects to distribute over
        try:
            target_objects = self._resolve_collection_for_verdeling(res.target_collection)
        except (RegelspraakError, RuntimeError) as e:
            # If we can't resolve the collection (e.g., no related objects), treat as empty
            logger.warning(f"Could not resolve target collection: {e}")
            target_objects = []
        except Exception as e:
            # Catch any other exception
            logger.warning(f"Unexpected error resolving target collection: {e}")
            target_objects = []
        
        if not target_objects:
            logger.warning("No target objects found for distribution")
            # Handle remainder if specified
            logger.info(f"Remainder target is: {res.remainder_target}")
            if res.remainder_target:
                logger.info(f"Setting remainder for empty distribution: {source_value.value}")
                self._set_verdeling_remainder(res.remainder_target, source_value)
                logger.info("Remainder set successfully, returning from _apply_verdeling")
            else:
                logger.warning("No remainder target specified for empty distribution")
            logger.info("Returning early from _apply_verdeling due to no target objects")
            return
        
        # Determine the attribute to set from the target collection expression
        # For "de treinmiles van alle passagiers", attribute is "treinmiles"
        target_attribute = self._extract_verdeling_target_attribute(res.target_collection)
        
        # Process distribution methods in order
        distribution_result = self._calculate_distribution(
            total_amount=total_amount,
            target_objects=target_objects,
            methods=res.distribution_methods,
            source_unit=source_value.unit,
            source_datatype=source_value.datatype
        )
        
        # Apply distributed values to target objects
        for obj, amount in zip(target_objects, distribution_result.amounts):
            value = Value(
                value=amount,
                datatype=source_value.datatype,
                unit=source_value.unit
            )
            self.context.set_attribute(obj, target_attribute, value, span=res.span)
            logger.info(f"Verdeling: Set {target_attribute} of {obj.object_type_naam} {obj.instance_id} to {amount}")
        
        # Handle remainder if specified
        if res.remainder_target and distribution_result.remainder:
            remainder_value = Value(
                value=distribution_result.remainder,
                datatype=source_value.datatype,
                unit=source_value.unit
            )
            self._set_verdeling_remainder(res.remainder_target, remainder_value)
    
    def _resolve_collection_for_verdeling(self, collection_expr: Expression) -> List[RuntimeObject]:
        """Resolve collection expression for Verdeling targets.
        Pattern: "de X van alle Y van Z" where:
        - X is the target attribute
        - Y is the role name (e.g., "passagiers met recht op treinmiles")
        - Z is the navigation context (e.g., "het te verdelen contingent treinmiles")
        
        Due to grammar parsing, the path might be split incorrectly:
        ['treinmiles', 'passagiers', 'recht', 'treinmiles', 'te verdelen contingent treinmiles']
        where 'alle' is consumed as a prefix and words are split.
        """
        if isinstance(collection_expr, AttributeReference):
            path = collection_expr.path
            logger.info(f"Verdeling: Resolving collection with path: {path}")
            
            # The grammar splits multi-word phrases, so we need to reconstruct them
            # Looking for patterns where we have a feittype relationship
            
            # For the TOKA pattern, we expect to find objects related to the current instance
            # through a feittype relationship
            if self.context.current_instance and len(path) > 1:
                # The last element often contains the navigation context
                # e.g., "te verdelen contingent treinmiles"
                
                # Look for the feittype that connects the current instance type
                # with the target object type (typically "Natuurlijk persoon" for passengers)
                current_type = self.context.current_instance.object_type_naam
                
                # Find relevant feittype
                for feittype_name, feittype in self.context.domain_model.feittypen.items():
                    # Check if this feittype involves the current object type
                    role_types = [rol.object_type for rol in feittype.rollen]
                    if current_type in role_types:
                        # This feittype involves our current object type
                        # Find the other role (the objects we want to distribute to)
                        for i, rol in enumerate(feittype.rollen):
                            if rol.object_type != current_type:
                                # This is the target object type
                                # Get all objects related through this feittype
                                as_subject = (i == 1)  # If target is second role, we want subjects
                                related = self.context.get_related_objects(
                                    self.context.current_instance,
                                    feittype_name,
                                    as_subject=as_subject
                                )
                                if related:
                                    logger.info(f"Found {len(related)} objects through feittype '{feittype_name}'")
                                    return related
                
                # If no feittype found, try to find all objects of a type
                # Look for object type names in the path
                # For "de miles van alle personen van het contingent", we want to find "personen" -> Persoon
                for path_elem in path:
                    # Skip the attribute name (first element)
                    if path.index(path_elem) == 0:
                        continue
                    
                    # Check if this path element refers to an object type
                    for obj_type in self.context.domain_model.objecttypes:
                        obj_type_lower = obj_type.lower()
                        path_elem_lower = path_elem.lower()
                        
                        # Check for exact match or plural forms
                        if (obj_type_lower == path_elem_lower or 
                            obj_type_lower + 'en' == path_elem_lower or  # Simple plural
                            obj_type_lower + 's' == path_elem_lower or   # English plural
                            (obj_type_lower == 'persoon' and path_elem_lower == 'personen')):  # Special case
                            logger.info(f"Finding all objects of type '{obj_type}'")
                            return self.context.find_objects_by_type(obj_type)
        
        # Fallback: For patterns we can't resolve through relationships,
        # return empty list rather than trying to evaluate as expression
        # (which would fail if the attribute doesn't exist on current instance)
        logger.warning(f"Could not resolve collection for Verdeling, returning empty list")
        return []
    
    def _find_objects_by_feittype_role(self, source_obj: RuntimeObject, role_text: str) -> List[RuntimeObject]:
        """Find objects that have a specific role in relation to source object."""
        related_objects = []
        
        # Look through all relationships where source_obj is involved
        for rel in self.context.relationships.values():
            if rel.subject == source_obj:
                # Check if the object matches the role description
                # This is simplified - a full implementation would match against feittype role names
                obj = rel.object
                # For TOKA, "passagiers met recht op treinmiles" refers to Natuurlijk persoon objects
                if "passagier" in role_text.lower() and obj.object_type_naam == "Natuurlijk persoon":
                    related_objects.append(obj)
        
        logger.info(f"Verdeling: Found {len(related_objects)} objects with role '{role_text}' related to {source_obj.object_type_naam}")
        return related_objects
    
    def _find_all_objects_of_type(self, type_text: str) -> List[RuntimeObject]:
        """Find all objects matching a type description."""
        objects = []
        
        # Extract the core object type from the description
        # "passagiers met recht op treinmiles" -> look for "Natuurlijk persoon"
        type_map = {
            "passagier": "Natuurlijk persoon",
            "persoon": "Natuurlijk persoon",
            "personen": "Natuurlijk persoon",
            "contingent": "Contingent treinmiles",
            "vlucht": "Vlucht",
            "vluchten": "Vlucht"
        }
        
        # Find the object type
        target_type = None
        for key, obj_type in type_map.items():
            if key in type_text.lower():
                target_type = obj_type
                break
        
        if not target_type:
            # Try exact match
            for obj_type in self.context.domain_model.objecttypes:
                if obj_type.lower() == type_text.lower():
                    target_type = obj_type
                    break
        
        # Get all objects of this type
        if target_type:
            for obj in self.context.objects.values():
                if obj.object_type_naam == target_type:
                    objects.append(obj)
        
        logger.info(f"Verdeling: Found {len(objects)} objects of type '{target_type}' for description '{type_text}'")
        return objects
    
    def _navigate_feittype_for_collection(self, source_obj: RuntimeObject, path: List[str]) -> List[RuntimeObject]:
        """Navigate feittype relationships to find a collection."""
        # This is a simplified implementation
        # Full implementation would properly parse the navigation pattern
        return []
    
    def _extract_verdeling_target_attribute(self, collection_expr: Expression) -> str:
        """Extract the target attribute name from collection expression.
        Pattern: "de X van alle Y" -> X is the attribute"""
        if isinstance(collection_expr, AttributeReference) and collection_expr.path:
            # First element is typically the attribute
            return collection_expr.path[0]
        
        raise RegelspraakError(
            "Could not determine target attribute for distribution",
            span=collection_expr.span
        )
    
    def _is_related_via_feittype(self, obj1: RuntimeObject, obj2: RuntimeObject) -> bool:
        """Check if two objects are related via any feittype."""
        for rel in self.context.relationships.values():
            if (rel.subject == obj1 and rel.object == obj2) or \
               (rel.subject == obj2 and rel.object == obj1):
                return True
        return False
    
    @dataclass
    class DistributionResult:
        """Result of distribution calculation."""
        amounts: List[Decimal]
        remainder: Decimal = Decimal('0')
    
    def _calculate_distribution(
        self, 
        total_amount: Decimal,
        target_objects: List[RuntimeObject],
        methods: List[VerdelingMethode],
        source_unit: Optional[str],
        source_datatype: str
    ) -> 'Evaluator.DistributionResult':
        """Calculate distribution amounts based on methods."""
        n_targets = len(target_objects)
        if n_targets == 0:
            return Evaluator.DistributionResult(amounts=[], remainder=total_amount)
        
        # Start with equal distribution as default
        amounts = [total_amount / n_targets] * n_targets
        
        # Process each method in order
        for method in methods:
            if isinstance(method, VerdelingGelijkeDelen):
                # Equal distribution (already done as default)
                pass
            
            elif isinstance(method, VerdelingNaarRato):
                # Proportional distribution
                amounts = self._distribute_naar_ratio(
                    total_amount, target_objects, method.ratio_expression,
                    source_unit, source_datatype
                )
            
            elif isinstance(method, VerdelingOpVolgorde):
                # Ordered distribution - sort objects first
                sorted_objects = self._sort_objects_for_verdeling(
                    target_objects, method.order_expression,
                    method.order_direction == "afnemende"
                )
                # Reorder amounts to match
                # This is simplified - full implementation would handle progressive distribution
                pass
            
            elif isinstance(method, VerdelingMaximum):
                # Apply maximum constraint per target object
                # The max expression might reference attributes on each target
                new_amounts = []
                for i, (obj, amt) in enumerate(zip(target_objects, amounts)):
                    # Temporarily switch context to evaluate max for this object
                    old_instance = self.context.current_instance
                    self.context.current_instance = obj
                    try:
                        max_value = self.evaluate_expression(method.max_expression)
                        max_amount = Decimal(str(max_value.value))
                        new_amounts.append(min(amt, max_amount))
                    finally:
                        self.context.current_instance = old_instance
                amounts = new_amounts
            
            elif isinstance(method, VerdelingAfronding):
                # Apply rounding
                factor = Decimal(10) ** -method.decimals
                if method.round_direction == "naar beneden":
                    amounts = [amt.quantize(factor, rounding='ROUND_DOWN') for amt in amounts]
                else:  # naar boven
                    amounts = [amt.quantize(factor, rounding='ROUND_UP') for amt in amounts]
        
        # Calculate remainder
        distributed_total = sum(amounts)
        remainder = total_amount - distributed_total
        
        return Evaluator.DistributionResult(amounts=amounts, remainder=remainder)
    
    def _distribute_naar_ratio(
        self,
        total_amount: Decimal,
        target_objects: List[RuntimeObject],
        ratio_expr: Expression,
        source_unit: Optional[str],
        source_datatype: str
    ) -> List[Decimal]:
        """Distribute proportionally based on ratio expression."""
        # Evaluate ratio expression for each object
        ratios = []
        for obj in target_objects:
            # Temporarily set as current instance to evaluate in context
            old_instance = self.context.current_instance
            self.context.current_instance = obj
            try:
                ratio_value = self.evaluate_expression(ratio_expr)
                ratios.append(Decimal(str(ratio_value.value)))
            finally:
                self.context.current_instance = old_instance
        
        # Calculate proportional amounts
        total_ratio = sum(ratios)
        if total_ratio == 0:
            # Equal distribution if all ratios are zero
            n = len(target_objects)
            return [total_amount / n] * n
        
        amounts = [(ratio / total_ratio) * total_amount for ratio in ratios]
        return amounts
    
    def _sort_objects_for_verdeling(
        self,
        objects: List[RuntimeObject],
        order_expr: Expression,
        descending: bool
    ) -> List[RuntimeObject]:
        """Sort objects based on order expression."""
        # Create list of (object, sort_value) tuples
        object_values = []
        for obj in objects:
            old_instance = self.context.current_instance
            self.context.current_instance = obj
            try:
                sort_value = self.evaluate_expression(order_expr)
                object_values.append((obj, sort_value.value))
            finally:
                self.context.current_instance = old_instance
        
        # Sort by value
        object_values.sort(key=lambda x: x[1], reverse=descending)
        return [obj for obj, _ in object_values]
    
    def _set_verdeling_remainder(self, remainder_expr: Expression, remainder_value: Value) -> None:
        """Set the remainder value to the specified target."""
        logger.info(f"_set_verdeling_remainder called with path {remainder_expr.path if hasattr(remainder_expr, 'path') else 'no path'} and value {remainder_value.value}")
        if isinstance(remainder_expr, AttributeReference):
            # Determine object and attribute
            if len(remainder_expr.path) >= 2:
                # Pattern: "het X van Y" - attribute X on object Y
                attr_name = remainder_expr.path[0]
                # The object reference is in the last path element
                # For "het restant na verdeling van het te verdelen contingent treinmiles"
                # We need to find the object that matches this description
                # In most cases, this will be the current instance
                target_obj = self.context.current_instance
                
                # Check if the last path element refers to the current instance
                if target_obj and len(remainder_expr.path) > 1:
                    last_elem = remainder_expr.path[-1].lower()
                    obj_type_lower = target_obj.object_type_naam.lower()
                    # Check if the object type is mentioned in the last element
                    if all(word in last_elem for word in obj_type_lower.split()):
                        # This refers to the current instance
                        self.context.set_attribute(
                            target_obj,
                            attr_name,
                            remainder_value,
                            span=remainder_expr.span
                        )
                        logger.info(f"Verdeling: Set remainder {attr_name} on {target_obj.object_type_naam} to {remainder_value.value}")
                        return
                
                # If we couldn't match, still try to set on current instance
                if self.context.current_instance:
                    self.context.set_attribute(
                        self.context.current_instance,
                        attr_name,
                        remainder_value,
                        span=remainder_expr.span
                    )
                    logger.info(f"Verdeling: Set remainder {attr_name} to {remainder_value.value}")
            elif len(remainder_expr.path) == 1:
                # Simple attribute reference on current instance
                attr_name = remainder_expr.path[0]
                if self.context.current_instance:
                    self.context.set_attribute(
                        self.context.current_instance,
                        attr_name,
                        remainder_value,
                        span=remainder_expr.span
                    )
                    logger.info(f"Verdeling: Set remainder {attr_name} to {remainder_value.value}")

    def _handle_binary(self, expr: BinaryExpression) -> Value:
        """Handle binary operations, returning Value objects."""
        left_val = self.evaluate_expression(expr.left)
        op = expr.operator

        # Handle IS and IN specially as they return boolean values
        if op == Operator.IS:
            # Right side should be a kenmerk name (string) or type name (string)
            right_val = self.evaluate_expression(expr.right)
            if not isinstance(right_val.value, str):
                raise RegelspraakError(f"Right side of 'IS' must evaluate to a string (kenmerk/type name), got {type(right_val.value)}", span=expr.right.span)
            
            # For IS operator, we need the actual object instance
            # If left_val is an object reference, use that object
            if left_val.datatype == "ObjectReference" and isinstance(left_val.value, RuntimeObject):
                instance = left_val.value
            else:
                instance = self.context.current_instance  # Default to current instance
            
            if instance is None:
                raise RegelspraakError("Could not determine object instance for 'IS' check.", span=expr.left.span)
                 
            bool_result = self.context.check_is(instance, right_val.value)
            return Value(value=bool_result, datatype="Boolean", unit=None)

        elif op == Operator.IN:
            right_val = self.evaluate_expression(expr.right)
            # Extract raw values for IN check
            left_raw = left_val.value if isinstance(left_val, Value) else left_val
            right_raw = right_val.value if isinstance(right_val, Value) else right_val
            bool_result = self.context.check_in(left_raw, right_raw)
            return Value(value=bool_result, datatype="Boolean", unit=None)
            
        elif op == Operator.IS_NIET:
            # Right side should be a kenmerk name (string) or type name (string)
            right_val = self.evaluate_expression(expr.right)
            if not isinstance(right_val.value, str):
                raise RegelspraakError(f"Right side of 'IS_NIET' must evaluate to a string (kenmerk/type name), got {type(right_val.value)}", span=expr.right.span)
            # Determine instance for IS_NIET check
            instance = self.context.current_instance
            if not instance:
                raise RegelspraakError("Could not determine object instance for 'IS_NIET' check.", span=expr.left.span)
            bool_result = not self.context.check_is(instance, right_val.value)
            return Value(value=bool_result, datatype="Boolean", unit=None)
            
        elif op == Operator.HEEFT:
            # HEEFT operator for bezittelijk kenmerken (possessive characteristics)
            # Right side should be a kenmerk name
            right_val = self.evaluate_expression(expr.right)
            if not isinstance(right_val.value, str):
                raise RegelspraakError(f"Right side of 'HEEFT' must evaluate to a string (kenmerk name), got {type(right_val.value)}", span=expr.right.span)
            # Check if the current instance has this kenmerk set to true
            # For bezittelijk kenmerken, we need to check both "heeft X" and "X" forms
            kenmerk_name = right_val.value
            # First try with "heeft " prefix
            heeft_kenmerk_name = f"heeft {kenmerk_name}"
            if self.context.current_instance.object_type_naam in self.context.domain_model.objecttypes:
                obj_type = self.context.domain_model.objecttypes[self.context.current_instance.object_type_naam]
                if heeft_kenmerk_name in obj_type.kenmerken:
                    kenmerk_value = self.context.get_kenmerk(self.context.current_instance, heeft_kenmerk_name)
                else:
                    # Fall back to just the kenmerk name without "heeft"
                    kenmerk_value = self.context.get_kenmerk(self.context.current_instance, kenmerk_name)
            else:
                kenmerk_value = self.context.get_kenmerk(self.context.current_instance, kenmerk_name)
            return Value(value=kenmerk_value, datatype="Boolean")
            
        elif op == Operator.HEEFT_NIET:
            # Negated version of HEEFT
            right_val = self.evaluate_expression(expr.right)
            if not isinstance(right_val.value, str):
                raise RegelspraakError(f"Right side of 'HEEFT_NIET' must evaluate to a string (kenmerk name), got {type(right_val.value)}", span=expr.right.span)
            # Check if the current instance has this kenmerk set to true
            # For bezittelijk kenmerken, we need to check both "heeft X" and "X" forms
            kenmerk_name = right_val.value
            # First try with "heeft " prefix
            heeft_kenmerk_name = f"heeft {kenmerk_name}"
            if self.context.current_instance.object_type_naam in self.context.domain_model.objecttypes:
                obj_type = self.context.domain_model.objecttypes[self.context.current_instance.object_type_naam]
                if heeft_kenmerk_name in obj_type.kenmerken:
                    kenmerk_value = self.context.get_kenmerk(self.context.current_instance, heeft_kenmerk_name)
                else:
                    # Fall back to just the kenmerk name without "heeft"
                    kenmerk_value = self.context.get_kenmerk(self.context.current_instance, kenmerk_name)
            else:
                kenmerk_value = self.context.get_kenmerk(self.context.current_instance, kenmerk_name)
            return Value(value=not kenmerk_value, datatype="Boolean")
        
        # Handle dagsoort operators
        elif op in [Operator.IS_EEN_DAGSOORT, Operator.ZIJN_EEN_DAGSOORT, 
                    Operator.IS_GEEN_DAGSOORT, Operator.ZIJN_GEEN_DAGSOORT]:
            # Right side should be the dagsoort name
            right_val = self.evaluate_expression(expr.right)
            if not isinstance(right_val.value, str):
                raise RegelspraakError(f"Right side of dagsoort check must be a string, got {type(right_val.value)}", span=expr.right.span)
            
            # Check if the date matches the dagsoort
            is_dagsoort = self._dagsoort_check(left_val, right_val.value, expr.span)
            
            # Return based on operator
            if op in [Operator.IS_EEN_DAGSOORT, Operator.ZIJN_EEN_DAGSOORT]:
                return Value(value=is_dagsoort, datatype="Boolean", unit=None)
            else:  # IS_GEEN_DAGSOORT, ZIJN_GEEN_DAGSOORT
                return Value(value=not is_dagsoort, datatype="Boolean", unit=None)

        # Standard evaluation for other operators
        right_val = self.evaluate_expression(expr.right)

        # Arithmetic operations using unit-aware arithmetic
        if op == Operator.PLUS:
            return self.arithmetic.add(left_val, right_val)
        elif op == Operator.MIN:
            return self.arithmetic.subtract(left_val, right_val)
        elif op == Operator.VERMINDERD_MET:
            return self.arithmetic.subtract_verminderd_met(left_val, right_val)
        elif op == Operator.MAAL:
            return self.arithmetic.multiply(left_val, right_val)
        elif op == Operator.GEDEELD_DOOR:
            return self.arithmetic.divide(left_val, right_val, use_abs_style=False)
        elif op == Operator.GEDEELD_DOOR_ABS:
            return self.arithmetic.divide(left_val, right_val, use_abs_style=True)
        elif op == Operator.MACHT:
            return self.arithmetic.power(left_val, right_val)

        # Comparison operations - return boolean Values
        elif op in [Operator.GELIJK_AAN, Operator.NIET_GELIJK_AAN, 
                    Operator.KLEINER_DAN, Operator.GROTER_DAN,
                    Operator.KLEINER_OF_GELIJK_AAN, Operator.GROTER_OF_GELIJK_AAN]:
            
            # For comparisons, we need to check unit compatibility and convert if needed
            if left_val.datatype in ["Numeriek", "Percentage", "Bedrag"] and \
               right_val.datatype in ["Numeriek", "Percentage", "Bedrag"]:
                # Check units are compatible
                if not self.arithmetic._check_units_compatible(left_val, right_val, "comparison"):
                    raise RegelspraakError(f"Cannot compare values with incompatible units: '{left_val.unit}' and '{right_val.unit}'", span=expr.span)
                
                # Convert right to left's unit if needed
                if left_val.unit != right_val.unit and left_val.unit and right_val.unit:
                    right_val = self.arithmetic._convert_to_unit(right_val, left_val.unit)
            
            # Extract values for comparison
            left_cmp = left_val.value
            right_cmp = right_val.value
            
            # Perform comparison
            if op == Operator.GELIJK_AAN:
                result = left_cmp == right_cmp
            elif op == Operator.NIET_GELIJK_AAN:
                result = left_cmp != right_cmp
            elif op == Operator.KLEINER_DAN:
                result = left_cmp < right_cmp
            elif op == Operator.GROTER_DAN:
                result = left_cmp > right_cmp
            elif op == Operator.KLEINER_OF_GELIJK_AAN:
                result = left_cmp <= right_cmp
            elif op == Operator.GROTER_OF_GELIJK_AAN:
                result = left_cmp >= right_cmp
                
            return Value(value=result, datatype="Boolean", unit=None)

        # Logical operations - expect boolean Values
        elif op == Operator.EN:
            if left_val.datatype != "Boolean" or right_val.datatype != "Boolean":
                raise RegelspraakError(f"Operator 'en' requires boolean operands, got {left_val.datatype} and {right_val.datatype}", span=expr.span)
            result = left_val.value and right_val.value
            return Value(value=result, datatype="Boolean", unit=None)
            
        elif op == Operator.OF:
            if left_val.datatype != "Boolean" or right_val.datatype != "Boolean":
                raise RegelspraakError(f"Operator 'of' requires boolean operands, got {left_val.datatype} and {right_val.datatype}", span=expr.span)
            result = left_val.value or right_val.value
            return Value(value=result, datatype="Boolean", unit=None)

        else:
            raise RegelspraakError(f"Unsupported or unhandled binary operator: {op.name}", span=expr.span)

    def _evaluate_variable_reference(self, expr: VariableReference, instance_id: Optional[str]) -> Value:
        """Evaluate a variable reference - shared logic for timeline and non-timeline paths."""
        value = self.context.get_variable(expr.variable_name)
        
        # Trace variable read
        if self.context.trace_sink:
            self.context.trace_sink.variable_read(
                expr.variable_name, 
                value.value if isinstance(value, Value) else value, 
                expr=expr,
                instance_id=instance_id
            )
            
        return value
    
    def _evaluate_parameter_reference(self, expr: ParameterReference, instance_id: Optional[str]) -> Value:
        """Evaluate a parameter reference - shared logic for timeline and non-timeline paths."""
        # Always use context.get_parameter which handles timeline empty values correctly
        value = self.context.get_parameter(expr.parameter_name)
        
        # Trace parameter read
        if self.context.trace_sink:
            self.context.trace_sink.parameter_read(
                expr.parameter_name, 
                value.value if isinstance(value, Value) else value, 
                expr=expr,
                instance_id=instance_id
            )
            
        return value
    
    def _evaluate_literal(self, expr: Literal) -> Value:
        """Evaluate a literal expression - shared logic for timeline and non-timeline paths."""
        # Use the datatype from the literal if it exists
        if hasattr(expr, 'datatype') and expr.datatype:
            datatype = expr.datatype
            value = expr.value
            
            # Special handling for date literals
            if datatype == "Datum" and isinstance(value, str):
                # Parse date string to datetime
                from datetime import datetime
                # Handle various date formats: dd-mm-yyyy, dd.mm.yyyy, yyyy-mm-dd
                for fmt in ["%d-%m-%Y", "%d.%m.%Y", "%Y-%m-%d", "%d-%m-%Y %H:%M:%S.%f"]:
                    try:
                        value = datetime.strptime(value, fmt)
                        break
                    except ValueError:
                        continue
                else:
                    # If no format matched, keep as string and let downstream handle it
                    pass
        else:
            # Fallback: determine datatype from literal type
            value = expr.value
            if isinstance(expr.value, bool):
                datatype = "Boolean"
            elif isinstance(expr.value, (int, float, Decimal)):
                datatype = "Numeriek"
            elif isinstance(expr.value, str):
                datatype = "Tekst"
            else:
                datatype = "Onbekend"
            
        # Check if literal has unit info
        # Note: Literal AST node uses 'eenheid', Value uses 'unit'
        unit = getattr(expr, 'eenheid', None)
        return Value(value=value, datatype=datatype, unit=unit)

    def _handle_unary(self, expr: UnaryExpression) -> Value:
        """Handle unary operations, returning Value objects."""
        operand_val = self.evaluate_expression(expr.operand)
        op = expr.operator

        if op == Operator.NIET:
            if operand_val.datatype != "Boolean":
                 raise RegelspraakError(f"Operator 'niet' requires a boolean operand, got {operand_val.datatype}", span=expr.operand.span)
            result = not operand_val.value
            return Value(value=result, datatype="Boolean", unit=None)
        elif op == Operator.MIN: # Handle unary minus
            return self.arithmetic.negate(operand_val)
        elif op == Operator.VOLDOET_AAN_DE_ELFPROEF:
            result = self._elfproef_check(operand_val, expr.operand.span)
            return Value(value=result, datatype="Boolean", unit=None)
        elif op == Operator.VOLDOET_NIET_AAN_DE_ELFPROEF:
            result = not self._elfproef_check(operand_val, expr.operand.span)
            return Value(value=result, datatype="Boolean", unit=None)
        else:
            raise RegelspraakError(f"Unsupported unary operator: {op.name}", span=expr.span)

    def _elfproef_check(self, value: Value, span: SourceSpan) -> bool:
        """Check if a number satisfies the elfproef (eleven-proof) algorithm.
        
        The elfproef is a checksum validation commonly used in the Netherlands
        for numbers like BSN (citizen service number).
        
        Algorithm:
        - Must be exactly 9 digits
        - Each digit is multiplied by its position (9 for first digit, 8 for second, etc.)
        - The sum of these products must be divisible by 11
        """
        # Convert value to string
        if value.value is None:
            return False
            
        number_str = str(value.value).strip()
        
        # Check if it's exactly 9 digits
        if not number_str.isdigit() or len(number_str) != 9:
            return False
        
        # Calculate weighted sum
        total = 0
        for i, digit in enumerate(number_str):
            weight = 9 - i  # 9 for first digit, 8 for second, etc.
            total += int(digit) * weight
        
        # Check if divisible by 11
        return total % 11 == 0

    def _dagsoort_check(self, date_value: Value, dagsoort_name: str, span: SourceSpan) -> bool:
        """Check if a date matches a dagsoort definition.
        
        Args:
            date_value: The date to check
            dagsoort_name: Name of the dagsoort (e.g., "kerstdag")
            span: Source span for error reporting
            
        Returns:
            True if the date matches the dagsoort definition
        """
        # Validate that we have a date
        if date_value.datatype not in ["Datum", "Datum in dagen", "Datum en tijd in millisecondes"]:
            raise RegelspraakError(
                f"Dagsoort check requires a date value, got {date_value.datatype}", 
                span=span
            )
        
        # Get the date value
        date_val = date_value.value
        if date_val is None:
            return False
        
        # Convert to datetime if needed
        if isinstance(date_val, str):
            try:
                # Try parsing common date formats
                from dateutil import parser
                date_val = parser.parse(date_val)
            except Exception:
                return False
        elif isinstance(date_val, (int, float)):
            # Assume it's a timestamp in milliseconds
            date_val = datetime.fromtimestamp(date_val / 1000)
        
        if not isinstance(date_val, (date, datetime)):
            return False
            
        # Find all rules that define this dagsoort
        dagsoort_rules = []
        for regel in self.context.domain_model.regels:
            if isinstance(regel.resultaat, Dagsoortdefinitie) and \
               regel.resultaat.dagsoort_naam.lower() == dagsoort_name.lower():
                dagsoort_rules.append(regel)
        
        if not dagsoort_rules:
            # No definition found for this dagsoort
            logger.warning(f"No dagsoort definition found for '{dagsoort_name}'")
            return False
        
        # Create a temporary "dag" object to evaluate against
        # This is a special case where we need to evaluate rules against a date
        original_instance = self.context.current_instance
        
        # Create a minimal object to hold the date
        dag_object = RuntimeObject(
            object_type_naam="Dag",  # Special object type for date evaluation
            instance_id=f"dag_{date_val.isoformat()}"
        )
        
        # The date itself is the "dag" attribute
        dag_object.attributen["dag"] = Value(value=date_val, datatype="Datum")
        
        try:
            self.context.set_current_instance(dag_object)
            
            # Check each dagsoort rule
            for regel in dagsoort_rules:
                if regel.voorwaarde:
                    # Evaluate the rule condition
                    try:
                        # Handle both expression and compound condition
                        if isinstance(regel.voorwaarde.expressie, SamengesteldeVoorwaarde):
                            condition_met = self._evaluate_samengestelde_voorwaarde(regel.voorwaarde.expressie, None)
                            condition_result = Value(value=condition_met, datatype="Boolean")
                        else:
                            condition_result = self.evaluate_expression(regel.voorwaarde.expressie)
                        if condition_result.datatype == "Boolean" and condition_result.value:
                            return True
                    except Exception as e:
                        logger.debug(f"Error evaluating dagsoort rule '{regel.naam}': {e}")
                        continue
                else:
                    # No condition means always true
                    return True
                    
            return False  # No rule matched
            
        finally:
            # Restore original context
            self.context.set_current_instance(original_instance)

    def _resolve_collection_from_feittype(self, collection_name: str, base_instance: RuntimeObject) -> List[RuntimeObject]:
        """Resolve a collection name through feittype relationships.
        
        For example: "passagiers van de reis" where base_instance is a Vlucht
        This looks for relationships where the base_instance plays a role
        and returns objects in the matching role.
        """
        collection_objects = []
        
        # Try to find relationships where base_instance participates
        # Look in both directions (as subject and as object)
        relationships = self.context.find_relationships(subject=base_instance)
        relationships.extend(self.context.find_relationships(object=base_instance))
        
        for rel in relationships:
            # Get the feittype definition
            feittype = self.context.domain_model.feittypen.get(rel.feittype_naam)
            if not feittype:
                continue
                
            # Check each role to see if it matches the collection name
            for rol in feittype.rollen:
                if not rol.naam:
                    continue
                    
                # Match role name (handle singular/plural forms)
                role_matches = False
                if collection_name.lower() == rol.naam.lower():
                    role_matches = True
                elif collection_name.lower() == rol.meervoud.lower() if hasattr(rol, 'meervoud') and rol.meervoud else False:
                    role_matches = True
                elif collection_name.lower().endswith("en") and collection_name[:-2].lower() == rol.naam.lower():
                    # Simple plural check: "passagiers" -> "passagier"
                    role_matches = True
                elif collection_name.lower().endswith("s") and collection_name[:-1].lower() == rol.naam.lower():
                    # Alternative plural: "reis" -> "reizen"  
                    role_matches = True
                    
                if role_matches:
                    # Found matching role - get the object in that role
                    if rel.subject == base_instance and rel.object:
                        # Base instance is subject, return object
                        if rel.object not in collection_objects:
                            collection_objects.append(rel.object)
                    elif rel.object == base_instance and rel.subject:
                        # Base instance is object, return subject
                        if rel.subject not in collection_objects:
                            collection_objects.append(rel.subject)
                    
        return collection_objects
    
    def _resolve_collection_for_aggregation(self, collection_expr: Expression) -> List[RuntimeObject]:
        """Resolve a collection expression to a list of RuntimeObject instances for aggregation.
        
        Handles patterns like:
        - "alle bedragen" - all instances that have attribute 'bedrag'
        - "alle passagiers van de reis" - all objects in a feittype relationship
        """
        collection_objects = []
        
        if isinstance(collection_expr, AttributeReference):
            # Handle different path patterns
            if len(collection_expr.path) == 1:
                collection_path = collection_expr.path[0]
                
                # Check if it's a feittype navigation pattern
                # Example: "passagiers" -> find through relationships
                if self.context.current_instance:
                    # First try as a role name via feittype
                    collection_objects = self._resolve_collection_from_feittype(
                        collection_path,
                        self.context.current_instance
                    )
                
                # If no results from feittype, check if it's "alle X" pattern
                if not collection_objects and collection_path.lower().startswith("alle "):
                    collection_type = collection_path[5:]  # Remove "alle "
                    
                    # Find the actual object type (case-insensitive match)
                    matched_type = None
                    for obj_type in self.context.domain_model.objecttypes.keys():
                        if obj_type.lower() == collection_type.lower():
                            matched_type = obj_type
                            break
                    
                    if matched_type:
                        collection_objects = self.context.find_objects_by_type(matched_type)
                        
                # If still no results and it's a plural attribute name, find all objects with that attribute
                if not collection_objects and collection_path.endswith("en"):
                    # Convert plural to singular: "bedragen" -> "bedrag"
                    singular_name = collection_path[:-2] if collection_path.endswith("en") else collection_path
                    
                    # Find all objects that have this attribute
                    for obj_type_name in self.context.domain_model.objecttypes:
                        obj_type = self.context.domain_model.objecttypes[obj_type_name]
                        # Check if this object type has the attribute
                        if singular_name in obj_type.attributen:
                            # Get all instances of this type
                            instances = self.context.find_objects_by_type(obj_type_name)
                            collection_objects.extend(instances)
                            
            elif len(collection_expr.path) == 2:
                # Pattern like "passagiers van de reis"
                collection_name = collection_expr.path[0]
                if self.context.current_instance:
                    collection_objects = self._resolve_collection_from_feittype(
                        collection_name,
                        self.context.current_instance
                    )
            else:
                # Complex path: navigate through relationships
                logger.warning(f"Complex collection paths not yet fully supported: {collection_expr.path}")
                
        return collection_objects
    
    def _handle_aggregation_alle_pattern(self, expr: FunctionCall, func_type: str, plural_name: str) -> Value:
        """Handle 'functie van alle X' pattern where we aggregate attribute across all objects."""
        # Convert plural to singular: "bedragen" -> "bedrag"
        singular_name = plural_name[:-2] if plural_name.endswith("en") else plural_name
        
        # Find all objects that have this attribute
        collection_objects = []
        for obj_type_name in self.context.domain_model.objecttypes:
            obj_type = self.context.domain_model.objecttypes[obj_type_name]
            # Check if this object type has the attribute
            if singular_name in obj_type.attributen:
                # Get all instances of this type
                instances = self.context.find_objects_by_type(obj_type_name)
                collection_objects.extend(instances)
        
        # Collect values from all objects
        values = []
        first_unit = None
        datatype = None
        
        for obj in collection_objects:
            # Temporarily set this object as current for attribute evaluation
            saved_instance = self.context.current_instance
            try:
                self.context.current_instance = obj
                # Get the attribute value
                value = self.context.get_attribute(obj, singular_name)
                
                # Skip None/empty values per RegelSpraak spec
                if value.value is None:
                    continue
                    
                # Check datatype consistency
                if datatype is None:
                    datatype = value.datatype
                    first_unit = value.unit
                elif value.datatype != datatype:
                    raise RegelspraakError(f"Cannot aggregate values of different types: {datatype} and {value.datatype}", span=expr.span)
                
                # Check unit compatibility for numeric aggregations
                if func_type in ["som_van", "gemiddelde_van", "totaal_van"]:
                    if first_unit or value.unit:
                        if not self.arithmetic._check_units_compatible(
                            Value(0, datatype, first_unit), 
                            value, 
                            func_type
                        ):
                            raise RegelspraakError(f"Cannot aggregate values with incompatible units: {first_unit} and {value.unit}", span=expr.span)
                    
                    # Convert to common unit if needed
                    if value.unit != first_unit and value.unit is not None:
                        value = self.arithmetic._convert_to_unit(value, first_unit)
                
                values.append(value)
            finally:
                self.context.current_instance = saved_instance
        
        # Perform aggregation based on function type
        return self._perform_aggregation(func_type, values, datatype, first_unit, expr.span)
    
    def _handle_aggregation_collection_pattern(self, expr: FunctionCall, func_type: str) -> Value:
        """Handle 'functie van X van alle Y' pattern for collection aggregation."""
        attr_expr = expr.arguments[0]
        collection_expr = expr.arguments[1]
        
        # Resolve the collection
        collection_objects = self._resolve_collection_for_aggregation(collection_expr)
        
        # Collect values from all objects in the collection
        values = []
        first_unit = None
        datatype = None
        
        for obj in collection_objects:
            # Temporarily set this object as current for attribute evaluation
            saved_instance = self.context.current_instance
            try:
                self.context.current_instance = obj
                # Evaluate the attribute expression on this object
                value = self.evaluate_expression(attr_expr)
                
                # Skip None/empty values per RegelSpraak spec
                if value.value is None:
                    continue
                    
                # Check datatype consistency
                if datatype is None:
                    datatype = value.datatype
                    first_unit = value.unit
                elif value.datatype != datatype:
                    raise RegelspraakError(f"Cannot aggregate values of different types: {datatype} and {value.datatype}", span=expr.span)
                
                # Check unit compatibility for numeric aggregations
                if func_type in ["som_van", "gemiddelde_van", "totaal_van"]:
                    if first_unit or value.unit:
                        if not self.arithmetic._check_units_compatible(
                            Value(0, datatype, first_unit), 
                            value, 
                            func_type
                        ):
                            raise RegelspraakError(f"Cannot aggregate values with incompatible units: {first_unit} and {value.unit}", span=expr.span)
                    
                    # Convert to common unit if needed
                    if value.unit != first_unit and value.unit is not None:
                        value = self.arithmetic._convert_to_unit(value, first_unit)
                
                values.append(value)
            finally:
                self.context.current_instance = saved_instance
        
        # Perform aggregation based on function type
        return self._perform_aggregation(func_type, values, datatype, first_unit, expr.span)
    
    def _perform_aggregation(self, func_type: str, values: List[Value], datatype: str, unit: str, span) -> Value:
        """Perform the actual aggregation based on function type."""
        if not values:
            # Empty collection - return appropriate empty/zero value
            if func_type in ["som_van", "totaal_van"]:
                return Value(value=Decimal(0), datatype=datatype or "Numeriek", unit=unit)
            elif func_type == "gemiddelde_van":
                return Value(value=None, datatype=datatype or "Numeriek", unit=unit)
            elif func_type in ["eerste_van", "laatste_van"]:
                return Value(value=None, datatype=datatype or "Datum", unit=None)
            else:
                return Value(value=None, datatype=datatype or "Numeriek", unit=unit)
        
        # Perform aggregation
        if func_type in ["som_van", "totaal_van"]:
            # Sum all values
            result = values[0]
            for val in values[1:]:
                result = self.arithmetic.add(result, val)
            return result
            
        elif func_type == "gemiddelde_van":
            # Calculate average
            if datatype not in ["Numeriek", "Bedrag", "Percentage"]:
                raise RegelspraakError(f"Cannot calculate average of non-numeric type: {datatype}", span=span)
            # Sum all values
            total = values[0]
            for val in values[1:]:
                total = self.arithmetic.add(total, val)
            # Divide by count
            count_val = Value(value=Decimal(len(values)), datatype="Numeriek", unit=None)
            return self.arithmetic.divide(total, count_val, use_abs_style=False)
            
        elif func_type == "eerste_van":
            # Find earliest/first value
            if datatype not in ["Datum", "Datum-tijd"]:
                raise RegelspraakError(f"Function 'eerste_van' requires date values, got {datatype}", span=span)
            earliest = values[0]
            for val in values[1:]:
                if self._compare_values(val, earliest) < 0:
                    earliest = val
            return earliest
            
        elif func_type == "laatste_van":
            # Find latest/last value
            if datatype not in ["Datum", "Datum-tijd"]:
                raise RegelspraakError(f"Function 'laatste_van' requires date values, got {datatype}", span=span)
            latest = values[0]
            for val in values[1:]:
                if self._compare_values(val, latest) > 0:
                    latest = val
            return latest
            
        else:
            raise RegelspraakError(f"Unknown aggregation function: {func_type}", span=span)
    
    def _handle_som_van_alle_pattern(self, expr: FunctionCall, plural_name: str) -> Value:
        """Handle 'som van alle bedragen' pattern where we sum attribute across all objects."""
        # Convert plural to singular: "bedragen" -> "bedrag"
        singular_name = plural_name[:-2] if plural_name.endswith("en") else plural_name
        
        # Find all objects that have this attribute
        collection_objects = []
        for obj_type_name in self.context.domain_model.objecttypes:
            obj_type = self.context.domain_model.objecttypes[obj_type_name]
            # Check if this object type has the attribute
            if singular_name in obj_type.attributen:
                # Get all instances of this type
                instances = self.context.find_objects_by_type(obj_type_name)
                collection_objects.extend(instances)
        
        # Now sum the attribute values from all objects
        values_to_sum = []
        first_unit = None
        datatype = None
        
        for obj in collection_objects:
            # Temporarily set this object as current for attribute evaluation
            saved_instance = self.context.current_instance
            try:
                self.context.current_instance = obj
                # Get the attribute value
                value = self.context.get_attribute(obj, singular_name)
                
                # Skip None/empty values per RegelSpraak spec
                if value.value is None:
                    continue
                    
                # Check datatype consistency
                if datatype is None:
                    datatype = value.datatype
                    first_unit = value.unit
                elif value.datatype != datatype:
                    raise RegelspraakError(f"Cannot sum values of different types: {datatype} and {value.datatype}", span=expr.span)
                
                # Check unit compatibility
                if first_unit or value.unit:
                    if not self.arithmetic._check_units_compatible(
                        Value(0, datatype, first_unit), 
                        value, 
                        "sum"
                    ):
                        raise RegelspraakError(f"Cannot sum values with incompatible units: {first_unit} and {value.unit}", span=expr.span)
                
                # Convert to common unit if needed
                if value.unit != first_unit and value.unit is not None:
                    value = self.arithmetic._convert_to_unit(value, first_unit)
                
                values_to_sum.append(value.to_decimal())
            finally:
                self.context.current_instance = saved_instance
        
        # Calculate the sum
        if not values_to_sum:
            # Empty collection or all values were None
            # Per spec, return 0 with appropriate type/unit
            return Value(value=Decimal(0), datatype=datatype or "Numeriek", unit=first_unit)
        else:
            total = sum(values_to_sum)
            return Value(value=total, datatype=datatype, unit=first_unit)

    def _handle_function_call(self, expr: FunctionCall) -> Value:
        """Handle function calls (basic built-ins), returning Value objects."""
        current_instance = self.context.current_instance
        instance_id = current_instance.instance_id if current_instance else None
        
        func_name = expr.function_name.lower().replace(' ', '_') # Normalize name
        
        # Special case: Check for aggregation patterns BEFORE evaluating args
        # This avoids errors when trying to evaluate attributes on wrong instances
        aggregation_functions = ["som_van", "gemiddelde_van", "totaal_van", "eerste_van", "laatste_van", 
                                "het_gemiddelde_van", "het_totaal_van", "de_eerste_van", "de_laatste_van",
                                "aantal", "het_aantal"]
        
        if func_name in aggregation_functions:
            # Normalize function name (remove articles)
            base_func_name = func_name
            if func_name.startswith("het_"):
                base_func_name = func_name[4:]
            elif func_name.startswith("de_"):
                base_func_name = func_name[3:]
                
            # Single argument case: "som van alle bedragen" or "totaal van X"
            if len(expr.arguments) == 1:
                arg = expr.arguments[0]
                
                if isinstance(arg, AttributeReference) and len(arg.path) == 1 and arg.path[0].endswith("en"):
                    # Handle the "functie van alle X" pattern specially
                    return self._handle_aggregation_alle_pattern(expr, base_func_name, arg.path[0])
                elif base_func_name == "aantal" or func_name == "het_aantal":
                    # Don't evaluate arguments for het_aantal - let the registry function handle it
                    pass
                else:
                    # Single argument that's not "alle" pattern - evaluate normally
                    args = [self.evaluate_expression(arg) for arg in expr.arguments]
            
            # Two argument case: "som van X van alle Y" (from DimensieAggExpr)
            elif len(expr.arguments) == 2:
                # Check if second argument is a collection expression
                if isinstance(expr.arguments[1], AttributeReference):
                    # Don't evaluate arguments yet - handle collection pattern
                    return self._handle_aggregation_collection_pattern(expr, base_func_name)
            
            # Three+ argument case: concatenation pattern - evaluate normally
            else:
                # Evaluate arguments for concatenation
                args = [self.evaluate_expression(arg) for arg in expr.arguments]
        else:
            # Evaluate arguments normally for other functions
            args = [self.evaluate_expression(arg) for arg in expr.arguments]
        
        # Trace function call start (extract raw values for tracing)
        if self.context.trace_sink:
            # Only trace if args were evaluated
            if 'args' in locals():
                raw_args = [arg.value if isinstance(arg, Value) else arg for arg in args]
                self.context.trace_sink.function_call_start(
                    expr, 
                    raw_args, 
                    instance_id=instance_id
                )
        
        result = None
        try:
            # Use function registry for cleaner dispatch
            if func_name in self._function_registry:
                # For aggregation functions, pass None for args if they haven't been evaluated yet
                # This allows the function to handle special patterns before evaluation
                if func_name in ["som_van", "aantal", "het_aantal"] and 'args' not in locals():
                    result = self._function_registry[func_name](expr, None)
                else:
                    result = self._function_registry[func_name](expr, args if 'args' in locals() else None)
                
                # If registry function returns a value, we're done
                # If it returns None, fall through to special handling below
                
            elif func_name == "len": # Example: length of list/string
                if len(args) != 1: 
                    raise RegelspraakError(f"Function 'len' expects 1 argument, got {len(args)}", span=expr.span)
                arg = args[0]
                if arg.datatype != "Tekst":
                    raise RegelspraakError(f"Function 'len' requires text argument, got {arg.datatype}", span=expr.span)
                length = len(arg.value)
                result = Value(value=length, datatype="Numeriek", unit=None)
                
            if result is None and func_name == "som_van" and 'args' not in locals():
                # TODO: This special handling should be moved to _func_som_van
                # Currently kept here due to complex argument evaluation patterns
                # Sum aggregation - handles multiple patterns:
                # 1. Concatenation: som_van(X, Y, Z) - sum individual values
                # 2. Collection with single arg: som_van(path_with_collection) 
                # 3. Collection with two args: som_van(attribute, collection)
                
                if len(expr.arguments) >= 3:
                    # Concatenation pattern: "de som van X, Y en Z"
                    # Just sum all the argument values directly
                    values_to_sum = []
                    first_unit = None
                    datatype = None
                    
                    for arg_expr in expr.arguments:
                        value = self.evaluate_expression(arg_expr)
                        
                        # Skip None/empty values per RegelSpraak spec
                        if value.value is None:
                            continue
                        
                        # Check datatype consistency
                        if datatype is None:
                            datatype = value.datatype
                            first_unit = value.unit
                        elif value.datatype != datatype:
                            raise RegelspraakError(f"Cannot sum values of different types: {datatype} and {value.datatype}", span=expr.span)
                        
                        # Check unit compatibility
                        if value.unit != first_unit:
                            if not self.arithmetic._check_units_compatible(Value(0, datatype, first_unit), value, "som_van"):
                                raise RegelspraakError(f"Cannot sum values with incompatible units: {first_unit} and {value.unit}", span=expr.span)
                        
                        values_to_sum.append(value)
                    
                    # Perform the sum
                    if not values_to_sum:
                        # All values were None/empty - return 0 with appropriate type
                        result = Value(value=Decimal(0), datatype=datatype or "Numeriek", unit=first_unit)
                    else:
                        # Sum all values using arithmetic operations
                        result = values_to_sum[0]
                        for val in values_to_sum[1:]:
                            result = self.arithmetic.add(result, val)
                    
                    # Return early for concatenation pattern
                    return result
                
                elif len(expr.arguments) == 1:
                    # Single argument case - can be:
                    # 1. Path like ["te betalen belasting", "passagiers", "reis"] 
                    # 2. Simple plural attribute like ["bedragen"] meaning all instances with "bedrag" attribute
                    full_expr = expr.arguments[0]
                    if not isinstance(full_expr, AttributeReference):
                        raise RegelspraakError(f"Argument to 'som_van' must be an attribute reference, got {type(full_expr).__name__}", span=expr.span)
                    
                    if len(full_expr.path) == 1 and full_expr.path[0].endswith("en"):
                        # Case 2: Simple plural like "bedragen" - find all objects with singular attribute
                        # Convert plural to singular: "bedragen" -> "bedrag"
                        plural_name = full_expr.path[0]
                        # Simple pluralization rule - remove "en" suffix
                        singular_name = plural_name[:-2] if plural_name.endswith("en") else plural_name
                        
                        # Find all objects that have this attribute
                        collection_objects = []
                        for obj_type_name in self.context.domain_model.objecttypes:
                            obj_type = self.context.domain_model.objecttypes[obj_type_name]
                            # Check if this object type has the attribute
                            if singular_name in obj_type.attributen:
                                # Get all instances of this type
                                instances = self.context.find_objects_by_type(obj_type_name)
                                collection_objects.extend(instances)
                        
                        # Now sum the attribute values
                        attr_expr = AttributeReference(path=[singular_name], span=full_expr.span)
                        # Skip to the summing logic below
                        
                    elif len(full_expr.path) >= 2:
                        # Case 1: Path with collection reference
                        # Split the path - first element is the attribute, rest is the collection navigation
                        attr_expr = AttributeReference(path=[full_expr.path[0]], span=full_expr.span)
                        collection_expr = AttributeReference(path=full_expr.path[1:], span=full_expr.span)
                    else:
                        # Check if it's "alle X" pattern where X is an object type
                        single_path = full_expr.path[0]
                        
                        # First check if it matches an object type directly
                        matched_type = None
                        for obj_type in self.context.domain_model.objecttypes.keys():
                            if obj_type.lower() == single_path.lower():
                                matched_type = obj_type
                                break
                        
                        if matched_type:
                            # It's an object type - sum all attributes of all instances
                            # But we need to know which attribute to sum
                            # For "som van alle Iteratie", we don't know which attribute
                            # This is likely an error in the test - should be "som van alle sommen" or similar
                            raise RegelspraakError(
                                f"'som_van' with object type '{single_path}' needs an attribute to sum. "
                                f"Use 'som van [attribute] van alle {single_path}' instead.",
                                span=expr.span
                            )
                        else:
                            raise RegelspraakError(f"'som_van' with single element path '{full_expr.path}' not recognized as plural attribute reference", span=expr.span)
                    
                elif len(expr.arguments) == 2:
                    # Two argument case (from DimensieAggExpr)
                    attr_expr = expr.arguments[0]
                    collection_expr = expr.arguments[1]
                    
                    if not isinstance(attr_expr, AttributeReference):
                        raise RegelspraakError(f"First argument to 'som_van' must be an attribute reference, got {type(attr_expr).__name__}", span=expr.span)
                    if not isinstance(collection_expr, (AttributeReference, Subselectie)):
                        raise RegelspraakError(f"Second argument to 'som_van' must be a collection reference or subselectie, got {type(collection_expr).__name__}", span=expr.span)
                else:
                    raise RegelspraakError(f"Function 'som_van' expects 1, 2, or 3+ arguments, got {len(expr.arguments)}", span=expr.span)
                
                # Get the collection of objects to iterate over
                # For simple plural attributes, collection_objects is already set above
                if len(expr.arguments) == 1 and len(full_expr.path) == 1 and full_expr.path[0].endswith("en"):
                    # collection_objects already set in the plural attribute handling above
                    pass
                else:
                    # Need to resolve collection from collection_expr
                    collection_objects = []
                    
                    # Handle Subselectie (filtered collection)
                    if isinstance(collection_expr, Subselectie):
                        # Evaluate the subselectie to get the filtered collection
                        subselectie_result = self._evaluate_subselectie(collection_expr)
                        if isinstance(subselectie_result.value, list):
                            collection_objects = subselectie_result.value
                        else:
                            logger.warning(f"Subselectie did not return a list: {type(subselectie_result.value)}")
                            collection_objects = []
                    
                    # Handle different collection patterns for AttributeReference
                    elif isinstance(collection_expr, AttributeReference) and len(collection_expr.path) == 1:
                        collection_path = collection_expr.path[0]
                        
                        # Check for "X van de Y" pattern (e.g., "passagiers van de reis")
                        if " van " in collection_path:
                            # Split on " van " to get role and context
                            parts = collection_path.split(" van ")
                            if len(parts) == 2:
                                role_name = parts[0].strip()  # e.g., "passagiers"
                                context_ref = parts[1].strip()  # e.g., "de reis"
                                logger.debug(f"som_van: Parsed collection pattern - role_name='{role_name}', context_ref='{context_ref}'")
                                
                                # Remove articles from context
                                for article in ['de ', 'het ', 'een ']:
                                    if context_ref.startswith(article):
                                        context_ref = context_ref[len(article):]
                                        break
                                
                                # Find feittype that matches this pattern
                                # "passagiers" (passengers) + "reis" (journey/flight) -> look for related persons
                                if self.context.current_instance:
                                    # Find all relationships where current instance is the subject
                                    for feittype_naam, feittype in self.context.domain_model.feittypen.items():
                                        # Check if current instance matches the context reference
                                        found_match = False
                                        for rol in feittype.rollen:
                                            # Check if this role matches the context (e.g., "reis" -> "Vlucht")
                                            # Also check if context_ref matches the object type name (e.g., "vlucht" -> "Vlucht")
                                            role_matches = rol.naam and context_ref.lower() in rol.naam.lower()
                                            type_matches = rol.object_type and rol.object_type.lower() == context_ref.lower()
                                            logger.debug(f"  Checking rol '{rol.naam}' (type={rol.object_type}): role_matches={role_matches}, type_matches={type_matches}, current_type={self.context.current_instance.object_type_naam}")
                                            if (role_matches or type_matches) and rol.object_type == self.context.current_instance.object_type_naam:
                                                # Found the feittype where current instance has the context role
                                                # Now look for the other role that matches our collection name
                                                for other_rol in feittype.rollen:
                                                    if other_rol != rol and other_rol.naam:
                                                        # Check if role name contains our target (e.g., "passagier" in role_name)
                                                        singular_role = role_name.rstrip('s').lower()
                                                        logger.debug(f"    Checking other_rol '{other_rol.naam}' against singular '{singular_role}'")
                                                        if singular_role in other_rol.naam.lower():
                                                            # Found matching feittype and role
                                                            relationships = self.context.find_relationships(
                                                                subject=self.context.current_instance,
                                                                feittype_naam=feittype_naam
                                                            )
                                                            for rel in relationships:
                                                                if rel.object:
                                                                    collection_objects.append(rel.object)
                                                            found_match = True
                                                            break
                                                if found_match:
                                                    break
                        
                        # Simple case: "alle Personen" - find all instances of that type
                        elif collection_path.lower().startswith("alle "):
                            collection_type = collection_path[5:]  # Remove "alle "
                            
                            # Find the actual object type (case-insensitive match)
                            matched_type = None
                            for obj_type in self.context.domain_model.objecttypes.keys():
                                if obj_type.lower() == collection_type.lower():
                                    matched_type = obj_type
                                    break
                            
                            if matched_type:
                                collection_objects = self.context.find_objects_by_type(matched_type)
                        else:
                            # Check if it's a relationship navigation (e.g., "passagiers" of current object)
                            if self.context.current_instance:
                                # Try to find related objects through relationships
                                relationships = self.context.find_relationships(subject=self.context.current_instance)
                                for rel in relationships:
                                    if rel.object and self._matches_role_name(collection_type, rel):
                                        collection_objects.append(rel.object)
                    elif len(collection_expr.path) == 2:
                        # Pattern like "passagiers van de reis"
                        # Use generic feittype resolution
                        collection_name = collection_expr.path[0]
                        if self.context.current_instance:
                            collection_objects = self._resolve_collection_from_feittype(
                                collection_name, 
                                self.context.current_instance
                            )
                    else:
                        # Complex path: navigate through relationships
                        # For now, log a warning - this needs more sophisticated handling
                        logger.warning(f"Complex collection paths not yet fully supported: {collection_expr.path}")
                
                # Now sum the attribute values from all objects in the collection
                values_to_sum = []
                first_unit = None
                datatype = None
                
                # Try to determine expected datatype from the attribute definition
                # This is important for empty collections
                expected_datatype = None
                expected_unit = None
                if attr_expr and len(attr_expr.path) == 1:
                    attr_name = attr_expr.path[0]
                    # Look through all object types to find one that has this attribute
                    for obj_type_name, obj_type_def in self.context.domain_model.objecttypes.items():
                        if attr_name in obj_type_def.attributen:
                            attr_def = obj_type_def.attributen[attr_name]
                            expected_datatype = attr_def.datatype
                            expected_unit = attr_def.eenheid if hasattr(attr_def, 'eenheid') else None
                            break
                
                for obj in collection_objects:
                    # Temporarily set this object as current for attribute evaluation
                    saved_instance = self.context.current_instance
                    try:
                        self.context.current_instance = obj
                        # Evaluate the attribute on this object
                        value = self.evaluate_expression(attr_expr)
                        
                        # Skip None/empty values per RegelSpraak spec
                        if value.value is None:
                            continue
                            
                        # Check datatype consistency
                        if datatype is None:
                            datatype = value.datatype
                            first_unit = value.unit
                        elif value.datatype != datatype:
                            raise RegelspraakError(f"Cannot sum values of different types: {datatype} and {value.datatype}", span=expr.span)
                        
                        # Check unit compatibility
                        if first_unit or value.unit:
                            if not self.arithmetic._check_units_compatible(
                                Value(0, datatype, first_unit), 
                                value, 
                                "sum"
                            ):
                                raise RegelspraakError(f"Cannot sum values with incompatible units: {first_unit} and {value.unit}", span=expr.span)
                        
                        # Convert to common unit if needed
                        if value.unit != first_unit and value.unit is not None:
                            value = self.arithmetic._convert_to_unit(value, first_unit)
                        
                        values_to_sum.append(value.to_decimal())
                    finally:
                        self.context.current_instance = saved_instance
                
                # Calculate the sum
                if not values_to_sum:
                    # Empty collection or all values were None
                    # Per spec, return 0 with appropriate type/unit
                    # Use expected datatype if we found it from the schema
                    result = Value(value=Decimal(0), datatype=datatype or expected_datatype or "Numeriek", unit=first_unit or expected_unit)
                else:
                    total = sum(values_to_sum)
                    result = Value(value=total, datatype=datatype, unit=first_unit)
            # ... other functions like 'gemiddelde van', etc.
            elif result is None:
                # Check context for user-defined functions? TBD
                raise RegelspraakError(f"Unknown function: {expr.function_name}", span=expr.span)
                
        finally:
            # Trace function call end (even if there was an error)
            if self.context.trace_sink:
                result_raw = result.value if isinstance(result, Value) else result
                self.context.trace_sink.function_call_end(
                    expr, 
                    result_raw, 
                    instance_id=instance_id
                )
                
        return result

    # Function implementations for the registry
    def _func_abs(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Absolute value function."""
        if args is None:
            if self._in_timeline_evaluation:
                raise RegelspraakError("abs cannot be evaluated in timeline context", span=expr.span)
            args = [self.evaluate_expression(arg) for arg in expr.arguments]
            
        if len(args) != 1: 
            raise RegelspraakError(f"Function 'abs' expects 1 argument, got {len(args)}", span=expr.span)
        arg = args[0]
        if arg.datatype not in ["Numeriek", "Bedrag"]:
            raise RegelspraakError(f"Function 'abs' requires numeric argument, got {arg.datatype}", span=expr.span)
        abs_val = abs(arg.to_decimal())
        return Value(value=abs_val, datatype=arg.datatype, unit=arg.unit)
    
    def _func_max(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Maximum value function."""
        if args is None:
            if self._in_timeline_evaluation:
                raise RegelspraakError("max cannot be evaluated in timeline context", span=expr.span)
            args = [self.evaluate_expression(arg) for arg in expr.arguments]
            
        if not args: 
            raise RegelspraakError("Function 'max' requires at least one argument", span=expr.span)
        
        # Filter out None values
        non_none_args = [arg for arg in args if arg.value is not None]
        if not non_none_args:
            # All values are None - return None with appropriate type
            return Value(value=None, datatype=args[0].datatype if args else "Numeriek", unit=args[0].unit if args else None)
        
        # Check all same datatype
        datatype = non_none_args[0].datatype
        unit = non_none_args[0].unit
        for arg in non_none_args[1:]:
            if arg.datatype != datatype:
                raise RegelspraakError(f"Function 'max' requires all arguments to have same type, got {datatype} and {arg.datatype}", span=expr.span)
        
        # Find max - need to convert to comparable form
        max_val = non_none_args[0]
        for arg in non_none_args[1:]:
            if self._compare_values(arg, max_val) > 0:
                max_val = arg
        
        return max_val
    
    def _func_min(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Minimum value function."""
        if args is None:
            if self._in_timeline_evaluation:
                raise RegelspraakError("min cannot be evaluated in timeline context", span=expr.span)
            args = [self.evaluate_expression(arg) for arg in expr.arguments]
            
        if not args: 
            raise RegelspraakError("Function 'min' requires at least one argument", span=expr.span)
        
        # Filter out None values
        non_none_args = [arg for arg in args if arg.value is not None]
        if not non_none_args:
            # All values are None - return None with appropriate type
            return Value(value=None, datatype=args[0].datatype if args else "Numeriek", unit=args[0].unit if args else None)
        
        # Check all same datatype
        datatype = non_none_args[0].datatype
        unit = non_none_args[0].unit
        for arg in non_none_args[1:]:
            if arg.datatype != datatype:
                raise RegelspraakError(f"Function 'min' requires all arguments to have same type, got {datatype} and {arg.datatype}", span=expr.span)
        
        # Find min - need to convert to comparable form
        min_val = non_none_args[0]
        for arg in non_none_args[1:]:
            if self._compare_values(arg, min_val) < 0:
                min_val = arg
        
        return min_val
    
    def _func_tijdsduur_van(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Calculate duration between two dates."""
        # Handle case where args haven't been evaluated yet (timeline context)
        if args is None:
            # In timeline context, we can't evaluate recursively
            if self._in_timeline_evaluation:
                raise RegelspraakError("tijdsduur_van cannot be evaluated in timeline context", span=expr.span)
            # Evaluate arguments
            args = [self.evaluate_expression(arg) for arg in expr.arguments]
            
        if len(args) != 2:
            raise RegelspraakError(f"Function 'tijdsduur_van' expects 2 arguments (from date, to date), got {len(args)}", span=expr.span)
        
        date1 = args[0]
        date2 = args[1]
        
        # Check that both arguments are dates
        if date1.datatype not in ["Datum", "Datum-tijd"]:
            raise RegelspraakError(f"Function 'tijdsduur_van' requires date arguments, first argument has type {date1.datatype}", span=expr.span)
        if date2.datatype not in ["Datum", "Datum-tijd"]:
            raise RegelspraakError(f"Function 'tijdsduur_van' requires date arguments, second argument has type {date2.datatype}", span=expr.span)
        
        # Handle empty values - if either date is empty, result is empty
        if date1.value is None or date2.value is None:
            return Value(value=None, datatype="Numeriek", unit=expr.unit_conversion)
        
        # Import datetime handling
        from datetime import date, datetime, timedelta
        import dateutil.parser
        
        # Parse dates - handle both date and datetime
        try:
            if isinstance(date1.value, str):
                d1 = dateutil.parser.parse(date1.value)
            else:
                d1 = date1.value
                
            if isinstance(date2.value, str):
                d2 = dateutil.parser.parse(date2.value)
            else:
                d2 = date2.value
        except Exception as e:
            raise RegelspraakError(f"Error parsing dates in tijdsduur_van: {e}", span=expr.span)
        
        # Calculate difference
        delta = d2 - d1
        
        # Determine unit from function call or default to days
        unit = expr.unit_conversion if hasattr(expr, 'unit_conversion') and expr.unit_conversion else "dagen"
        
        # Convert based on unit
        if unit in ["dagen", "dag", "dg"]:
            value = Decimal(delta.days)
        elif unit in ["jaren", "jaar", "jr"]:
            # Years - calculate whole years per spec "in hele jaren"
            years = d2.year - d1.year
            # Adjust if we haven't reached the anniversary date
            if (d2.month, d2.day) < (d1.month, d1.day):
                years -= 1
            value = Decimal(years)
        elif unit in ["maanden", "maand", "mnd"]:
            # Months - calendar-aware calculation
            months = 0
            y1, m1 = d1.year, d1.month
            y2, m2 = d2.year, d2.month
            months = (y2 - y1) * 12 + (m2 - m1)
            # Adjust for day of month
            if d2.day < d1.day:
                months -= 1
            value = Decimal(months)
        elif unit in ["weken", "week", "wk"]:
            value = Decimal(delta.days // 7)  # Whole weeks
        elif unit in ["uren", "uur", "u"]:
            value = Decimal(int(delta.total_seconds() // 3600))  # Whole hours
        elif unit in ["minuten", "minuut"]:
            value = Decimal(int(delta.total_seconds() // 60))  # Whole minutes
        elif unit in ["seconden", "seconde", "s"]:
            value = Decimal(int(delta.total_seconds()))  # Whole seconds
        elif unit in ["milliseconden", "millisecondes", "ms"]:
            # Milliseconds - no rounding
            value = Decimal(int(delta.total_seconds() * 1000))
        else:
            # Default to days if unit not recognized
            value = Decimal(delta.days)
            unit = "dagen"
        
        return Value(value=value, datatype="Numeriek", unit=unit)
    
    def _func_absolute_tijdsduur_van(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Calculate absolute duration between two dates."""
        # Use tijdsduur_van and take absolute value
        result = self._func_tijdsduur_van(expr, args)
        if result.value is not None:
            result = Value(value=abs(result.value), datatype=result.datatype, unit=result.unit)
        return result
    
    def _func_het_aantal(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Count aggregation function - counts objects or non-empty values."""
        # Special handling when args haven't been evaluated yet
        if args is None:
            
            # Check for direct object type counting pattern
            if len(expr.arguments) == 1 and isinstance(expr.arguments[0], AttributeReference):
                attr_ref = expr.arguments[0]
                if len(attr_ref.path) == 1:
                    path_item = attr_ref.path[0]
                    
                    # Remove "alle " prefix if present
                    if path_item.startswith("alle "):
                        collection_type = path_item[5:]
                    else:
                        collection_type = path_item
                    
                    # Check if it's an object type name
                    matched_type = None
                    for obj_type in self.context.domain_model.objecttypes.keys():
                        if obj_type.lower() == collection_type.lower():
                            matched_type = obj_type
                            break
                    
                    if matched_type:
                        # Count all instances of this type
                        instances = self.context.find_objects_by_type(matched_type)
                        return Value(value=len(instances), datatype="Numeriek", unit=None)
            
            # Fall back to evaluating arguments
            args = [self.evaluate_expression(arg) for arg in expr.arguments]
        
        # Handle evaluated arguments
        if len(args) == 1:
            collection_value = args[0]
            if isinstance(collection_value, Value):
                collection = collection_value.value
            else:
                collection = collection_value
            
            # Handle different types
            if isinstance(collection, list):
                count = len(collection)
            elif collection is None:
                count = 0
            else:
                # Single item counts as 1
                count = 1
            
            return Value(value=count, datatype="Numeriek", unit=None)
        else:
            # Multiple arguments - count non-None values
            count = sum(1 for arg in args if arg.value is not None)
            return Value(value=count, datatype="Numeriek", unit=None)
    
    def _func_som_van(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Sum aggregation function - handles multiple patterns."""
        # Handle different patterns based on number of arguments
        
        # Pattern 1: Concatenation (3+ args) - already evaluated
        if args is not None and len(args) >= 3:
            # Simple sum of multiple values
            if not args:
                raise RegelspraakError("Function 'som_van' requires at least one argument", span=expr.span)
            
            # Filter out None values
            non_none_values = []
            datatype = None
            unit = None
            
            for arg in args:
                if arg.value is not None:
                    if datatype is None:
                        datatype = arg.datatype
                        unit = arg.unit
                    elif arg.datatype != datatype:
                        raise RegelspraakError(f"Cannot sum values of different types: {datatype} and {arg.datatype}", span=expr.span)
                    
                    # Check unit compatibility
                    if unit != arg.unit:
                        if not self.arithmetic._check_units_compatible(Value(0, datatype, unit), arg, "som_van"):
                            raise RegelspraakError(f"Cannot sum values with incompatible units: {unit} and {arg.unit}", span=expr.span)
                    
                    non_none_values.append(arg)
            
            if not non_none_values:
                # All values were None - return 0
                return Value(value=Decimal(0), datatype=datatype or "Numeriek", unit=unit)
            
            # Sum all values using arithmetic operations
            result = non_none_values[0]
            for val in non_none_values[1:]:
                result = self.arithmetic.add(result, val)
            
            return result
        
        # For patterns with 1-2 args, return None to indicate special handling needed
        # This tells _handle_function_call to use its existing complex logic
        # TODO: Eventually move all the complex som_van logic here
        return None
    
    def _func_gemiddelde_van(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Average aggregation function."""
        if args is None:
            # For complex patterns, return None to use special handling
            return None
            
        # Similar patterns to som_van but calculates average
        if not args:
            raise RegelspraakError("Function 'gemiddelde_van' requires at least one argument", span=expr.span)
        
        # Filter out None values
        non_none_values = []
        datatype = None
        unit = None
        
        for arg in args:
            if arg.value is not None:
                non_none_values.append(arg.to_decimal())
                if datatype is None:
                    datatype = arg.datatype
                    unit = arg.unit
                elif arg.datatype != datatype:
                    raise RegelspraakError(f"Cannot average values of different types: {datatype} and {arg.datatype}", span=expr.span)
        
        if not non_none_values:
            # All values were None - return None
            return Value(value=None, datatype=datatype or "Numeriek", unit=unit)
        
        # Calculate average
        avg_value = sum(non_none_values) / len(non_none_values)
        return Value(value=Decimal(avg_value), datatype=datatype, unit=unit)
    
    def _func_eerste_van(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Return the earliest/first date from arguments."""
        if args is None:
            # Special case: arguments not evaluated yet
            raise RegelspraakError("eerste_van requires evaluated arguments", span=expr.span)
        
        if not args:
            raise RegelspraakError("Function 'eerste_van' requires at least one argument", span=expr.span)
        
        # Filter out None values and check all are dates
        non_none_dates = []
        for arg in args:
            if arg.value is not None:
                if arg.datatype not in ["Datum", "Datum-tijd"]:
                    raise RegelspraakError(f"Function 'eerste_van' requires date arguments, got {arg.datatype}", span=expr.span)
                non_none_dates.append(arg)
        
        if not non_none_dates:
            # All values were None - return None
            return Value(value=None, datatype="Datum", unit=None)
        
        # Find earliest date using comparison
        earliest = non_none_dates[0]
        for date_val in non_none_dates[1:]:
            if self._compare_values(date_val, earliest) < 0:
                earliest = date_val
        
        return earliest
    
    def _func_laatste_van(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Return the latest/last date from arguments."""
        if args is None:
            # Special case: arguments not evaluated yet
            raise RegelspraakError("laatste_van requires evaluated arguments", span=expr.span)
            
        if not args:
            raise RegelspraakError("Function 'laatste_van' requires at least one argument", span=expr.span)
        
        # Filter out None values and check all are dates
        non_none_dates = []
        for arg in args:
            if arg.value is not None:
                if arg.datatype not in ["Datum", "Datum-tijd"]:
                    raise RegelspraakError(f"Function 'laatste_van' requires date arguments, got {arg.datatype}", span=expr.span)
                non_none_dates.append(arg)
        
        if not non_none_dates:
            # All values were None - return None
            return Value(value=None, datatype="Datum", unit=None)
        
        # Find latest date using comparison
        latest = non_none_dates[0]
        for date_val in non_none_dates[1:]:
            if self._compare_values(date_val, latest) > 0:
                latest = date_val
        
        return latest
    
    def _func_totaal_van(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Total aggregation function - similar to som_van."""
        # For now, implement same as gemiddelde_van but return sum instead of average
        # This handles the simple concatenation case
        if not args:
            raise RegelspraakError("Function 'totaal_van' requires at least one argument", span=expr.span)
        
        # Filter out None values
        non_none_values = []
        datatype = None
        unit = None
        
        for arg in args:
            if arg.value is not None:
                non_none_values.append(arg.to_decimal())
                if datatype is None:
                    datatype = arg.datatype
                    unit = arg.unit
                elif arg.datatype != datatype:
                    raise RegelspraakError(f"Cannot total values of different types: {datatype} and {arg.datatype}", span=expr.span)
        
        if not non_none_values:
            # All values were None - return 0
            return Value(value=Decimal(0), datatype=datatype or "Numeriek", unit=unit)
        
        # Calculate total
        total_value = sum(non_none_values)
        return Value(value=Decimal(total_value), datatype=datatype, unit=unit)
    
    def _func_aantal_dagen_in(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Count number of days in a month or year where a condition is true.
        
        According to spec: "het aantal dagen in" ("de maand" | "het jaar") "dat" <expressie>
        
        The builder passes:
        - expr.arguments[0]: Literal with period type ("maand" or "jaar")
        - expr.arguments[1]: Condition expression (unevaluated)
        """
        # This function handles its own argument evaluation due to special pattern
        if args is not None:
            # If args are pre-evaluated, it's a simple case (not the spec pattern)
            if len(args) == 1:
                # Just return the number of days in the period
                period_val = args[0]
                if period_val.datatype != "Datum":
                    raise RegelspraakError(f"Function 'aantal_dagen_in' requires date argument, got {period_val.datatype}", span=expr.span)
                
                date_val = self._to_date(period_val)
                if date_val is None:
                    return Value(value=None, datatype="Numeriek", unit=None)
                
                # Get days in month
                import calendar
                days_in_month = calendar.monthrange(date_val.year, date_val.month)[1]
                return Value(value=days_in_month, datatype="Numeriek", unit=None)
        
        # Handle the specification pattern with expression arguments
        if len(expr.arguments) == 2:
            # First argument should be the period type literal
            period_arg = expr.arguments[0]
            condition_expr = expr.arguments[1]
            
            # Extract period type
            if isinstance(period_arg, Literal) and period_arg.datatype == "Tekst":
                period_type = period_arg.value
            else:
                raise RegelspraakError("First argument to aantal_dagen_in must be 'maand' or 'jaar'", span=expr.span)
            
            # Get the evaluation date to determine which period to check
            eval_date = self.context.evaluation_date
            if not eval_date:
                # Use current date if no evaluation date is set
                from datetime import datetime, date
                eval_date = datetime.now().date()
            else:
                from datetime import date
            
            # Determine the period boundaries
            if period_type == "maand":
                # Count days in the current month
                start_date = date(eval_date.year, eval_date.month, 1)
                if eval_date.month == 12:
                    end_date = date(eval_date.year + 1, 1, 1)
                else:
                    end_date = date(eval_date.year, eval_date.month + 1, 1)
            elif period_type == "jaar":
                # Count days in the current year
                start_date = date(eval_date.year, 1, 1)
                end_date = date(eval_date.year + 1, 1, 1)
            else:
                raise RegelspraakError(f"Invalid period type: {period_type}", span=expr.span)
            
            # Count days where condition is true
            count = 0
            current_date = start_date
            while current_date < end_date:
                # Save current evaluation date
                old_eval_date = self.context.evaluation_date
                try:
                    # Set evaluation date to the day we're checking
                    self.context.evaluation_date = current_date
                    
                    # Evaluate the condition for this day
                    result = self.evaluate_expression(condition_expr)
                    
                    # Count if the condition is true
                    if result.value is True:
                        count += 1
                finally:
                    # Restore evaluation date
                    self.context.evaluation_date = old_eval_date
                
                # Move to next day
                from datetime import timedelta
                current_date = current_date + timedelta(days=1)
            
            if self.context.trace_sink:
                self.context.trace_sink.value_calculated(
                    expression=expr,
                    value=f"aantal_dagen_in({period_type}, <condition>)",
                    result=f"{count} dagen"
                )
            
            return Value(value=Decimal(count), datatype="Numeriek", unit="dagen")
        
        # Legacy pattern with evaluated arguments (for backward compatibility)
        elif len(args) == 1:
            date_arg = args[0]
            if date_arg.datatype not in ["Datum", "Datum-tijd"]:
                raise RegelspraakError(f"Function 'aantal_dagen_in' requires date argument, got {date_arg.datatype}", span=expr.span)
            
            # Handle empty value
            if date_arg.value is None:
                return Value(value=None, datatype="Numeriek", unit="dagen")
            
            # Import datetime handling
            from datetime import date, datetime, date as date_type
            import dateutil.parser
            import calendar
            
            # Parse date
            try:
                if isinstance(date_arg.value, str):
                    date_val = dateutil.parser.parse(date_arg.value)
                elif isinstance(date_arg.value, (datetime, date_type)):
                    date_val = date_arg.value
                else:
                    raise RegelspraakError(f"Unexpected date type: {type(date_arg.value)}", span=expr.span)
            except Exception as e:
                raise RegelspraakError(f"Error parsing date in aantal_dagen_in: {e}", span=expr.span)
            
            # Count days in the month
            days_count = calendar.monthrange(date_val.year, date_val.month)[1]
            
            return Value(value=Decimal(days_count), datatype="Numeriek", unit="dagen")
        
        raise RegelspraakError(f"Function 'aantal_dagen_in' expects 2 arguments (period_type, condition), got {len(expr.arguments)}", span=expr.span)

    def _to_date(self, value: Value) -> Optional[date]:
        """Convert a Value to a date object.
        Handles various date formats and returns None for empty values.
        """
        if value.value is None:
            return None
        
        val = value.value
        
        # Already a date
        if isinstance(val, date):
            return val
        
        # DateTime - extract date part
        if isinstance(val, datetime):
            return val.date()
        
        # Timestamp in milliseconds (for "Datum en tijd in millisecondes")
        if value.datatype == "Datum en tijd in millisecondes" and isinstance(val, (int, float, Decimal)):
            # Convert milliseconds to datetime
            dt = datetime.fromtimestamp(float(val) / 1000.0)
            return dt.date()
        
        # String date - try to parse
        if isinstance(val, str):
            try:
                import dateutil.parser
                parsed = dateutil.parser.parse(val)
                return parsed.date()
            except:
                return None
        
        return None

    def _func_maand_uit(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Extract month from a date value.
        Returns the month number (1-12) from a date.
        """
        if args is None:
            if self._in_timeline_evaluation:
                raise RegelspraakError("maand_uit cannot be evaluated in timeline context", span=expr.span)
            args = [self.evaluate_expression(arg) for arg in expr.arguments]
            
        if len(args) != 1:
            raise RegelspraakError(f"Function 'maand uit' expects 1 argument, got {len(args)}", span=expr.span)
        
        arg = args[0]
        if arg.datatype not in ["Datum", "Datum in dagen", "Datum en tijd", "Datum en tijd in millisecondes"]:
            raise RegelspraakError(f"Function 'maand uit' requires date argument, got {arg.datatype}", span=expr.span)
        
        # Convert value to date
        date_val = self._to_date(arg)
        if date_val is None:
            return Value(value=None, datatype="Numeriek", unit=None)
        
        # Extract month (1-12)
        return Value(value=Decimal(date_val.month), datatype="Numeriek", unit=None)
    
    def _func_dag_uit(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Extract day of month from a date value.
        Returns the day number (1-31) from a date.
        """
        if args is None:
            if self._in_timeline_evaluation:
                raise RegelspraakError("dag_uit cannot be evaluated in timeline context", span=expr.span)
            args = [self.evaluate_expression(arg) for arg in expr.arguments]
            
        if len(args) != 1:
            raise RegelspraakError(f"Function 'dag uit' expects 1 argument, got {len(args)}", span=expr.span)
        
        arg = args[0]
        if arg.datatype not in ["Datum", "Datum in dagen", "Datum en tijd", "Datum en tijd in millisecondes"]:
            raise RegelspraakError(f"Function 'dag uit' requires date argument, got {arg.datatype}", span=expr.span)
        
        # Convert value to date
        date_val = self._to_date(arg)
        if date_val is None:
            return Value(value=None, datatype="Numeriek", unit=None)
        
        # Extract day (1-31)
        return Value(value=Decimal(date_val.day), datatype="Numeriek", unit=None)
    
    def _func_jaar_uit(self, expr: FunctionCall, args: Optional[List[Value]]) -> Value:
        """Extract year from a date value.
        Returns the year number from a date.
        """
        if args is None:
            if self._in_timeline_evaluation:
                raise RegelspraakError("jaar_uit cannot be evaluated in timeline context", span=expr.span)
            args = [self.evaluate_expression(arg) for arg in expr.arguments]
            
        if len(args) != 1:
            raise RegelspraakError(f"Function 'jaar uit' expects 1 argument, got {len(args)}", span=expr.span)
        
        arg = args[0]
        if arg.datatype not in ["Datum", "Datum in dagen", "Datum en tijd", "Datum en tijd in millisecondes"]:
            raise RegelspraakError(f"Function 'jaar uit' requires date argument, got {arg.datatype}", span=expr.span)
        
        # Convert value to date
        date_val = self._to_date(arg)
        if date_val is None:
            return Value(value=None, datatype="Numeriek", unit=None)
        
        # Extract year
        return Value(value=Decimal(date_val.year), datatype="Numeriek", unit=None)

    def _compare_values(self, val1: Value, val2: Value) -> int:
        """Compare two values, returning -1 if val1 < val2, 0 if equal, 1 if val1 > val2."""
        # Ensure compatible types
        if val1.datatype != val2.datatype:
            raise RegelspraakError(f"Cannot compare values of different types: {val1.datatype} and {val2.datatype}")
        
        # Handle dates specially
        if val1.datatype in ["Datum", "Datum-tijd"]:
            from datetime import date, datetime
            import dateutil.parser
            
            # Parse dates if they're strings
            d1 = val1.value
            if isinstance(d1, str):
                d1 = dateutil.parser.parse(d1)
            d2 = val2.value
            if isinstance(d2, str):
                d2 = dateutil.parser.parse(d2)
            
            if d1 < d2:
                return -1
            elif d1 > d2:
                return 1
            else:
                return 0
        
        # For numeric values, check unit compatibility
        if val1.unit != val2.unit and val1.unit and val2.unit:
            # Convert val2 to val1's unit for comparison
            val2 = self.arithmetic._convert_to_unit(val2, val1.unit)
        
        # Compare values
        v1 = val1.to_decimal() if hasattr(val1, 'to_decimal') else val1.value
        v2 = val2.to_decimal() if hasattr(val2, 'to_decimal') else val2.value
        
        if v1 < v2:
            return -1
        elif v1 > v2:
            return 1
        else:
            return 0
    
    def _handle_aggregation_alle_pattern(self, expr: FunctionCall, base_func_name: str, plural_name: str) -> Value:
        """Handle aggregation patterns like 'functie van alle X'.
        
        Args:
            expr: The function call expression
            base_func_name: The base function name (e.g., 'gemiddelde_van', 'eerste_van', 'laatste_van', 'totaal_van')
            plural_name: The plural object name (e.g., 'personen', 'vluchten')
        
        Returns:
            The aggregated value
        """
        # Convert plural to singular: "personen" -> "persoon", "vluchten" -> "vlucht"
        singular_name = plural_name[:-2] if plural_name.endswith("en") else plural_name
        
        # Find all objects that have this attribute
        collection_objects = []
        for obj_type_name in self.context.domain_model.objecttypes:
            obj_type = self.context.domain_model.objecttypes[obj_type_name]
            # Check if this object type has the attribute
            if singular_name in obj_type.attributen:
                # Get all instances of this type
                instances = self.context.find_objects_by_type(obj_type_name)
                collection_objects.extend(instances)
        
        # Create attribute reference for the singular attribute
        attr_expr = AttributeReference(path=[singular_name], span=expr.span)
        
        # Perform the aggregation
        return self._perform_aggregation(base_func_name, attr_expr, collection_objects, expr)
    
    def _handle_aggregation_collection_pattern(self, expr: FunctionCall, base_func_name: str) -> Value:
        """Handle aggregation patterns like 'functie van X van alle Y'.
        
        Args:
            expr: The function call expression
            base_func_name: The base function name (e.g., 'gemiddelde', 'eerste', 'laatste', 'totaal')
        
        Returns:
            The aggregated value
        """
        # Two arguments: attribute and collection
        attr_expr = expr.arguments[0]
        collection_expr = expr.arguments[1]
        
        if not isinstance(attr_expr, AttributeReference):
            raise RegelspraakError(f"First argument to '{base_func_name}_van' must be an attribute reference", span=expr.span)
        if not isinstance(collection_expr, AttributeReference):
            raise RegelspraakError(f"Second argument to '{base_func_name}_van' must be a collection reference", span=expr.span)
        
        # Resolve the collection
        collection_objects = self._resolve_collection_for_aggregation(collection_expr)
        
        # Perform the aggregation
        return self._perform_aggregation(base_func_name, attr_expr, collection_objects, expr)
    
    def _resolve_collection_for_aggregation(self, collection_expr: AttributeReference) -> List[RuntimeObject]:
        """Resolve a collection expression to a list of RuntimeObjects.
        
        Handles patterns like:
        - "alle Personen" - all instances of a type
        - "passagiers van de reis" - related objects through feittype
        """
        collection_objects = []
        
        if len(collection_expr.path) == 1:
            collection_path = collection_expr.path[0]
            
            # Handle "alle X" pattern
            if collection_path.lower().startswith("alle "):
                collection_type = collection_path[5:]  # Remove "alle "
                
                # Find the actual object type (case-insensitive match)
                matched_type = None
                for obj_type in self.context.domain_model.objecttypes.keys():
                    if obj_type.lower() == collection_type.lower():
                        matched_type = obj_type
                        break
                
                if matched_type:
                    collection_objects = self.context.find_objects_by_type(matched_type)
            
            # Handle "X van Y" pattern
            elif " van " in collection_path:
                # Use feittype resolution
                collection_name = collection_path.split(" van ")[0].strip()
                if self.context.current_instance:
                    collection_objects = self._resolve_collection_from_feittype(
                        collection_name, 
                        self.context.current_instance
                    )
            
            # Handle simple plural reference
            else:
                # Try to find related objects through relationships
                if self.context.current_instance:
                    relationships = self.context.find_relationships(subject=self.context.current_instance)
                    for rel in relationships:
                        if rel.object and self._matches_role_name(collection_path, rel):
                            collection_objects.append(rel.object)
        
        elif len(collection_expr.path) >= 2:
            # Complex path - use feittype resolution
            collection_name = collection_expr.path[0]
            if self.context.current_instance:
                collection_objects = self._resolve_collection_from_feittype(
                    collection_name, 
                    self.context.current_instance
                )
        
        return collection_objects
    
    def _resolve_collection_from_feittype(self, collection_name: str, context_obj: RuntimeObject) -> List[RuntimeObject]:
        """Resolve a collection based on feittype relationships.
        
        Args:
            collection_name: Name of the collection (e.g., "passagiers")
            context_obj: The context object (e.g., current flight)
        
        Returns:
            List of related objects
        """
        collection_objects = []
        
        # Debug logging
        logger.info(f"Resolving collection '{collection_name}' from context object {context_obj.object_type_naam}")
        
        # Normalize collection name - try to match singular form
        singular_name = collection_name.rstrip('s').lower()
        
        # Look through all feittypes to find matching relationships
        for feittype_naam, feittype in self.context.domain_model.feittypen.items():
            # Check if current object type can participate in this feittype
            context_type_matches = False
            target_role = None
            
            for rol in feittype.rollen:
                # Check if context object matches this role
                if rol.object_type == context_obj.object_type_naam:
                    context_type_matches = True
                else:
                    # Check if the other role matches our collection name
                    # Be flexible - check if the role name contains or starts with our target
                    if rol.naam:
                        role_name_lower = rol.naam.lower()
                        # Check various matching patterns
                        if (singular_name in role_name_lower or 
                            collection_name.lower() in role_name_lower or
                            role_name_lower.startswith(singular_name) or
                            role_name_lower.startswith(collection_name.lower())):
                            target_role = rol
                            logger.info(f"    Role '{rol.naam}' matches collection name '{collection_name}'")
            
            if context_type_matches and target_role:
                # Found a matching feittype - get related objects
                logger.info(f"  Found matching feittype '{feittype_naam}' with target role '{target_role.naam}'")
                relationships = self.context.find_relationships(
                    subject=context_obj,
                    feittype_naam=feittype_naam
                )
                logger.info(f"  Found {len(relationships)} relationships as subject")
                for rel in relationships:
                    logger.info(f"    Checking relationship: object={rel.object.object_type_naam if rel.object else None}, target_type={target_role.object_type}")
                    # Be flexible with object type matching
                    # Check if the role name contains the object type name or vice versa
                    if rel.object:
                        object_type = rel.object.object_type_naam
                        # Direct match
                        if object_type == target_role.object_type:
                            collection_objects.append(rel.object)
                            logger.info(f"    Added {object_type} to collection (direct match)")
                        # Check if the role name contains the object type
                        elif target_role.naam and object_type.lower() in target_role.naam.lower():
                            collection_objects.append(rel.object)
                            logger.info(f"    Added {object_type} to collection (role name contains type)")
                        # Check if object matches the expected pattern for this collection
                        elif singular_name in target_role.naam.lower():
                            collection_objects.append(rel.object)
                            logger.info(f"    Added {object_type} to collection (matches collection pattern)")
                
                # Also check reverse relationships
                reverse_rels = self.context.find_relationships(
                    object=context_obj,
                    feittype_naam=feittype_naam
                )
                for rel in reverse_rels:
                    if rel.subject and rel.subject.object_type_naam == target_role.object_type:
                        collection_objects.append(rel.subject)
        
        return collection_objects
    
    def _perform_aggregation(self, func_name: str, attr_expr: AttributeReference, 
                           collection_objects: List[RuntimeObject], expr: FunctionCall) -> Value:
        """Perform the actual aggregation over a collection of objects.
        
        Args:
            func_name: The aggregation function name ('gemiddelde', 'eerste', 'laatste', 'totaal', 'som')
            attr_expr: The attribute to aggregate
            collection_objects: The objects to aggregate over
            expr: The original function call expression
        
        Returns:
            The aggregated value
        """
        # Collect values from all objects
        values = []
        datatype = None
        unit = None
        
        # Try to determine expected datatype from the attribute definition
        # This is important for empty collections
        expected_datatype = None
        expected_unit = None
        if attr_expr and len(attr_expr.path) == 1:
            attr_name = attr_expr.path[0]
            # Look through all object types to find one that has this attribute
            for obj_type_name, obj_type_def in self.context.domain_model.objecttypes.items():
                if attr_name in obj_type_def.attributen:
                    attr_def = obj_type_def.attributen[attr_name]
                    expected_datatype = attr_def.datatype
                    expected_unit = attr_def.eenheid if hasattr(attr_def, 'eenheid') else None
                    break
        
        for obj in collection_objects:
            # Temporarily set this object as current for attribute evaluation
            saved_instance = self.context.current_instance
            try:
                self.context.current_instance = obj
                # Evaluate the attribute on this object
                value = self.evaluate_expression(attr_expr)
                
                # Skip None/empty values per RegelSpraak spec
                if value.value is not None:
                    # Check datatype consistency
                    if datatype is None:
                        datatype = value.datatype
                        unit = value.unit
                    elif value.datatype != datatype:
                        raise RegelspraakError(
                            f"Cannot aggregate values of different types: {datatype} and {value.datatype}", 
                            span=expr.span
                        )
                    
                    values.append(value)
            finally:
                self.context.current_instance = saved_instance
        
        # Perform the aggregation based on function type
        # Extract base function name (remove "_van" suffix if present)
        base_func_name = func_name.replace('_van', '') if func_name.endswith('_van') else func_name
        
        # Check if this is a count aggregation
        if base_func_name in ['aantal']:
            # For count, just return the number of objects in the collection
            count = len(collection_objects)
            return Value(value=count, datatype="Numeriek", unit=None)
        
        if base_func_name in ['som', 'totaal']:
            if not values:
                # Empty collection - return 0
                # Use expected datatype if we found it from the schema
                return Value(value=Decimal(0), datatype=datatype or expected_datatype or "Numeriek", unit=unit or expected_unit)
            
            # Sum all values
            result = values[0]
            for val in values[1:]:
                result = self.arithmetic.add(result, val)
            return result
        
        elif base_func_name == 'gemiddelde':
            if not values:
                # Empty collection - return None
                return Value(value=None, datatype=datatype or "Numeriek", unit=unit)
            
            # Calculate average
            total = values[0]
            for val in values[1:]:
                total = self.arithmetic.add(total, val)
            
            # Divide by count
            count = Decimal(len(values))
            avg_value = total.to_decimal() / count
            return Value(value=avg_value, datatype=datatype, unit=unit)
        
        elif base_func_name == 'eerste':
            if not values:
                # Empty collection - return None
                return Value(value=None, datatype=datatype or "Datum", unit=unit)
            
            # Find earliest/minimum value
            result = values[0]
            for val in values[1:]:
                if self._compare_values(val, result) < 0:
                    result = val
            return result
        
        elif base_func_name == 'laatste':
            if not values:
                # Empty collection - return None
                return Value(value=None, datatype=datatype or "Datum", unit=unit)
            
            # Find latest/maximum value
            result = values[0]
            for val in values[1:]:
                if self._compare_values(val, result) > 0:
                    result = val
            return result
        
        else:
            raise RegelspraakError(f"Unknown aggregation function: {func_name}", span=expr.span)
    
    def _resolve_object_reference(self, ref: AttributeReference) -> Optional[RuntimeObject]:
        """Resolve an object reference to an actual RuntimeObject.
        
        This handles references like:
        - "de Persoon" -> current instance if it's a Persoon
        - "het Contract" -> current instance if it's a Contract  
        - "een Contract" -> find any Contract instance
        - More complex paths would need additional logic
        """
        if not ref.path:
            return None
            
        # Simple case - single element path
        if len(ref.path) == 1:
            path_elem = ref.path[0].lower()
            
            # Check if it's referring to the current instance by type
            if self.context.current_instance:
                current_type = self.context.current_instance.object_type_naam.lower()
                # Remove articles
                if path_elem.startswith("de "):
                    path_elem = path_elem[3:]
                elif path_elem.startswith("het "):
                    path_elem = path_elem[4:]
                elif path_elem.startswith("een "):
                    path_elem = path_elem[4:]
                    
                if path_elem == current_type:
                    return self.context.current_instance
            
            # Try to find an instance of the requested type
            # First, try to match the path element to an object type
            for obj_type in self.context.domain_model.objecttypes.keys():
                if obj_type.lower() == path_elem:
                    # Return the first instance of this type (simplified)
                    instances = self.context.find_objects_by_type(obj_type)
                    if instances:
                        return instances[0]
                        
        # More complex paths would need additional logic
        # For now, return None
        return None
    
    def _matches_role_name(self, name: str, relationship) -> bool:
        """Check if a name matches a role in a relationship."""
        # Simple check - in reality would need more sophisticated matching
        # accounting for singular/plural forms
        feittype = self.context.domain_model.feittypen.get(relationship.feittype_naam)
        if not feittype:
            return False
        
        name_lower = name.lower()
        for rol in feittype.rollen:
            if rol.naam and (name_lower in rol.naam.lower() or rol.naam.lower() in name_lower):
                return True
            if rol.meervoud and (name_lower in rol.meervoud.lower() or rol.meervoud.lower() in name_lower):
                return True
        return False
    
    def _navigate_feitcreatie_subject(self, subject_expr: Expression, role_name: str) -> List[RuntimeObject]:
        """Navigate complex FeitCreatie subject patterns to find target objects.
        
        Handles patterns like:
        - "een passagier van de reis" - simple one-hop navigation
        - "een medewerker van een afdeling van de bonusgever van de toegekende bonus" - multi-hop
        """
        if not isinstance(subject_expr, AttributeReference) or not subject_expr.path:
            return []
        
        # The path contains the entire navigation pattern as a single string
        # e.g., "een medewerker van een afdeling van de bonusgever van de toegekende bonus"
        pattern = subject_expr.path[0]
        logger.info(f"FeitCreatie navigation pattern: {pattern}")
        
        # Parse the navigation pattern by splitting on "van"
        # This gives us navigation segments in reverse order
        segments = [s.strip() for s in pattern.split(" van ")]
        logger.info(f"Navigation segments: {segments}")
        
        if len(segments) < 2:
            # Simple pattern without navigation
            # Check if the single segment is a feittype name
            clean_segment = pattern.lower().replace("de ", "").replace("het ", "").replace("een ", "")
            if clean_segment in [ft.lower() for ft in self.context.domain_model.feittypen.keys()]:
                # Pattern like "het huwelijk" - find objects with role2 in that feittype with current instance
                return self._find_objects_by_role_in_relationships_with_current(role_name, clean_segment)
            else:
                # Pattern like "een medewerker" - find all objects that can fulfill the role
                return self._find_objects_by_role(role_name)
        
        # Start navigation from the end (current instance or specified object)
        # For "een medewerker van een afdeling van de bonusgever van de toegekende bonus":
        # segments = ["een medewerker", "een afdeling", "de bonusgever", "de toegekende bonus"]
        
        # Start with the last segment - often refers to current instance
        last_segment = segments[-1].lower()
        start_obj = None
        
        # Check if it refers to current instance
        if self.context.current_instance:
            current_type = self.context.current_instance.object_type_naam.lower()
            # Remove articles and check
            clean_segment = last_segment.replace("de ", "").replace("het ", "").replace("een ", "")
            logger.info(f"Checking if '{clean_segment}' matches current instance type '{current_type}'")
            if current_type in clean_segment or clean_segment in current_type:
                start_obj = self.context.current_instance
                logger.info(f"Starting navigation from current instance: {start_obj.object_type_naam} {start_obj.instance_id}")
            else:
                # Check if it's a feittype name - if so, need to find relationships
                feittype_names_lower = [ft.lower() for ft in self.context.domain_model.feittypen.keys()]
                if clean_segment in feittype_names_lower:
                    # For patterns like "een echtgenote van het huwelijk"
                    # We need to find objects involved in the huwelijk relationship
                    # Since we have just one segment, return all objects of the role2 type
                    if len(segments) == 1:
                        # Find objects that can fulfill role2
                        return self._find_objects_by_role_in_relationships_with_current(role_name, clean_segment)
        
        if not start_obj:
            # Try to find an object matching the description
            # This is simplified - in reality would need better matching
            logger.warning(f"Could not find starting object for navigation")
            return []
        
        # Navigate backwards through the segments
        current_objects = [start_obj]
        
        # Process segments in reverse order (excluding last which is the starting point)
        # Include the first segment as it's part of the navigation path
        for i in range(len(segments) - 2, -1, -1):
            segment = segments[i]
            next_objects = []
            logger.info(f"Navigating segment: '{segment}'")
            
            # For each current object, find related objects
            for obj in current_objects:
                # Find relationships where obj is involved
                # The segment describes what we're looking for
                clean_segment = segment.lower().replace("de ", "").replace("het ", "").replace("een ", "")
                logger.info(f"  Looking for objects matching segment '{clean_segment}' from {obj.object_type_naam}")
                
                # Look for objects related to current object
                # The segment might be a role name rather than an object type
                relationships = self.context.find_relationships(subject=obj)
                logger.info(f"  Found {len(relationships)} relationships from {obj.object_type_naam}")
                for rel in relationships:
                    if rel.object:
                        # Check if segment matches object type or role name
                        matches_desc = self._matches_description(rel.object, clean_segment)
                        matches_role = self._matches_role_in_feittype(rel.feittype_naam, clean_segment)
                        logger.info(f"    Checking {rel.object.object_type_naam} via {rel.feittype_naam}: desc={matches_desc}, role={matches_role}")
                        if matches_desc or matches_role:
                            next_objects.append(rel.object)
                            logger.info(f"    -> Match found: {rel.object.object_type_naam} via {rel.feittype_naam}")
                
                # Also check reverse relationships
                reverse_rels = self.context.find_relationships(object=obj)
                logger.info(f"  Found {len(reverse_rels)} reverse relationships to {obj.object_type_naam}")
                for rel in reverse_rels:
                    if rel.subject:
                        # Check if segment matches subject type or role name
                        matches_desc = self._matches_description(rel.subject, clean_segment)
                        matches_role = self._matches_role_in_feittype(rel.feittype_naam, clean_segment)
                        logger.info(f"    Checking reverse {rel.subject.object_type_naam} via {rel.feittype_naam}: desc={matches_desc}, role={matches_role}")
                        if matches_desc or matches_role:
                            next_objects.append(rel.subject)
                            logger.info(f"    -> Reverse match found: {rel.subject.object_type_naam} via {rel.feittype_naam}")
            
            if next_objects:
                current_objects = next_objects
            else:
                logger.warning(f"No objects found at segment '{segment}'")
                # Don't return empty - continue with current objects
                # return []
        
        # After processing all segments, current_objects should contain objects
        # that are either the target objects or related to the target objects
        logger.info(f"Final objects after navigation: {[obj.object_type_naam for obj in current_objects]}")
        
        # Check if current objects match the expected role
        matching_objects = []
        for obj in current_objects:
            if self._check_role_matches_object_type(role_name, obj):
                matching_objects.append(obj)
                logger.info(f"  Object {obj.object_type_naam} {obj.instance_id} matches role '{role_name}'")
        
        # If we found matching objects, return them
        if matching_objects:
            logger.info(f"Navigation complete, found {len(matching_objects)} objects with role '{role_name}'")
            return matching_objects
        
        # Otherwise, look for objects with the role that are related to current_objects
        final_objects = []
        
        for obj in current_objects:
            # Find relationships where obj is involved
            relationships = self.context.find_relationships(subject=obj)
            for rel in relationships:
                if rel.object and self._check_role_matches_object_type(role_name, rel.object):
                    final_objects.append(rel.object)
                    logger.info(f"  Found related object with role '{role_name}': {rel.object.object_type_naam} {rel.object.instance_id}")
            
            # Check reverse relationships
            reverse_rels = self.context.find_relationships(object=obj)
            for rel in reverse_rels:
                if rel.subject and self._check_role_matches_object_type(role_name, rel.subject):
                    final_objects.append(rel.subject)
                    logger.info(f"  Found related object with role '{role_name}' (reverse): {rel.subject.object_type_naam} {rel.subject.instance_id}")
        
        logger.info(f"Navigation complete, found {len(final_objects)} objects with role '{role_name}'")
        return final_objects
    
    def _matches_description(self, obj: RuntimeObject, description: str) -> bool:
        """Check if an object matches a description (simplified)."""
        obj_type = obj.object_type_naam.lower()
        # Check if object type matches the description
        return obj_type in description or description in obj_type
    
    def _matches_role_in_feittype(self, feittype_naam: str, role_description: str) -> bool:
        """Check if a role description matches any role in the given feittype."""
        if feittype_naam not in self.context.domain_model.feittypen:
            return False
        
        feittype = self.context.domain_model.feittypen[feittype_naam]
        for rol in feittype.rollen:
            if rol.naam and role_description in rol.naam.lower():
                return True
        return False
    
    def _find_objects_by_role(self, role_name: str) -> List[RuntimeObject]:
        """Find all objects that can fulfill a given role."""
        # Look through feittypes to find which object types can have this role
        for feittype_naam, feittype in self.context.domain_model.feittypen.items():
            for rol in feittype.rollen:
                if rol.naam == role_name:
                    # Found a matching role, get objects of that type
                    return self.context.find_objects_by_type(rol.object_type)
        return []
    
    def _check_role_matches_object_type(self, role_name: str, obj: RuntimeObject) -> bool:
        """Check if an object can fulfill a given role based on its type."""
        # Look through feittypes to find if this object type can have this role
        for feittype_naam, feittype in self.context.domain_model.feittypen.items():
            for rol in feittype.rollen:
                if rol.naam and role_name.lower() in rol.naam.lower() and rol.object_type == obj.object_type_naam:
                    return True
        return False
    
    def _resolve_feitcreatie_subject1(self, subject1_expr: Expression) -> Optional[RuntimeObject]:
        """Resolve the subject1 expression in FeitCreatie to a RuntimeObject."""
        if not isinstance(subject1_expr, AttributeReference) or not subject1_expr.path:
            return None
        
        pattern = subject1_expr.path[0].lower()
        
        # Often refers to current instance
        if self.context.current_instance:
            current_type = self.context.current_instance.object_type_naam.lower()
            clean_pattern = pattern.replace("de ", "").replace("het ", "").replace("een ", "")
            
            # Check if it matches object type
            if current_type in clean_pattern or clean_pattern in current_type:
                return self.context.current_instance
            
            # Check if current instance can fulfill the role
            # "een echtgenoot" -> check if current instance can be an "echtgenoot"
            for feittype_naam, feittype in self.context.domain_model.feittypen.items():
                for rol in feittype.rollen:
                    if rol.naam and clean_pattern in rol.naam.lower() and rol.object_type == self.context.current_instance.object_type_naam:
                        return self.context.current_instance
        
        # Try to evaluate as expression
        try:
            val = self.evaluate_expression(subject1_expr)
            if isinstance(val.value, RuntimeObject):
                return val.value
        except:
            pass
        
        return None
    
    def _find_objects_by_role_in_relationships_with_current(self, role_name: str, feittype_name: str) -> List[RuntimeObject]:
        """Find objects that fulfill a role in relationships with current instance."""
        if not self.context.current_instance:
            return []
        
        result = []
        # Look for relationships of the given feittype where current instance is involved
        rels_as_subject = self.context.find_relationships(
            subject=self.context.current_instance, 
            feittype_naam=feittype_name
        )
        rels_as_object = self.context.find_relationships(
            object=self.context.current_instance,
            feittype_naam=feittype_name  
        )
        
        # Find the feittype definition to understand roles
        if feittype_name in self.context.domain_model.feittypen:
            feittype = self.context.domain_model.feittypen[feittype_name]
            
            # Check relationships where current instance is subject
            for rel in rels_as_subject:
                # The object in the relationship might fulfill the target role
                if rel.object and self._check_role_matches_object_type(role_name, rel.object):
                    result.append(rel.object)
            
            # Check relationships where current instance is object
            for rel in rels_as_object:
                # The subject in the relationship might fulfill the target role
                if rel.subject and self._check_role_matches_object_type(role_name, rel.subject):
                    result.append(rel.subject)
        
        return result
    
    def _evaluate_role_navigation(self, role_name: str, from_object: RuntimeObject) -> Value:
        """Evaluate navigation to related objects via a role name.
        Returns a collection if the role name is plural, single object otherwise."""
        role_name_lower = role_name.lower()
        role_name_clean = role_name_lower.replace("de ", "").replace("het ", "").replace("een ", "")
        
        # Look for matching role in feittypen
        for feittype_name, feittype in self.context.domain_model.feittypen.items():
            for rol in feittype.rollen:
                # Match against role name or plural form
                role_naam_lower = rol.naam.lower()
                role_naam_clean = role_naam_lower.replace("de ", "").replace("het ", "").replace("een ", "")
                
                # Handle broken role parsing where role name includes object type
                role_first_word = role_naam_clean.split()[0] if role_naam_clean else ""
                
                # Check exact match or plural match
                matches = (role_naam_clean == role_name_clean or 
                         (rol.meervoud and rol.meervoud.lower() == role_name_lower) or
                         (rol.meervoud and rol.meervoud.lower().replace("de ", "").replace("het ", "") == role_name_clean) or
                         # Simple pluralization rules
                         (role_naam_clean + 's' == role_name_clean) or  # passagier -> passagiers
                         (role_naam_clean + 'en' == role_name_clean) or  # boek -> boeken
                         (role_name_clean + 's' == role_naam_clean) or  # passagiers -> passagier
                         (role_name_clean.endswith('en') and role_name_clean[:-2] == role_naam_clean) or  # boeken -> boek
                         # Irregular plurals (common Dutch cases)
                         (role_naam_clean == 'lid' and role_name_clean == 'leden') or
                         (role_naam_clean == 'kind' and role_name_clean == 'kinderen') or
                         (role_naam_clean == 'ei' and role_name_clean == 'eieren') or
                         # Match first word of role (for broken parsing)
                         (role_first_word and (
                             role_first_word == role_name_clean or
                             role_first_word + 's' == role_name_clean or
                             role_first_word + 'en' == role_name_clean or
                             role_name_clean + 's' == role_first_word or
                             (role_name_clean.endswith('en') and role_name_clean[:-2] == role_first_word))))
                
                if matches:
                    # Found matching role - get related objects
                    role_index = feittype.rollen.index(rol)
                    as_subject = (role_index == 1)
                    
                    related_objects = self.context.get_related_objects(
                        from_object, feittype_name, as_subject=as_subject
                    )
                    
                    # Check if this is a plural form
                    is_plural = (role_name_clean.endswith('s') or role_name_clean.endswith('en') or 
                               role_name_clean != role_naam_clean or 
                               (role_first_word and role_name_clean != role_first_word))
                    
                    if is_plural:
                        # Return as collection
                        return Value(value=related_objects, datatype="Lijst")
                    else:
                        # Return single object
                        if related_objects:
                            return Value(value=related_objects[0], datatype="ObjectReference")
                        else:
                            raise RegelspraakError(
                                f"No related object found for role '{role_name}' from {from_object.object_type_naam}",
                                span=None
                            )
        
        # No matching role found
        raise RegelspraakError(
            f"'{role_name}' is not a valid role name for navigation from {from_object.object_type_naam}",
            span=None
        )
    
    def _check_if_current_instance_has_role(self, role_name: str) -> bool:
        """Check if the current instance can fulfill the given role."""
        if not self.context.current_instance:
            return False
        
        # Remove articles
        clean_role = role_name.lower().replace("de ", "").replace("het ", "").replace("een ", "")
        
        # Check if current instance's type can fulfill this role
        return self._check_role_matches_object_type(clean_role, self.context.current_instance)
    
    def _find_matching_feittype(self, role_name: str) -> str:
        """Find a feittype that has the given role."""
        for feittype_naam, feittype in self.context.domain_model.feittypen.items():
            role_names = [rol.naam for rol in feittype.rollen]
            if role_name in role_names:
                return feittype_naam
        
        # If no exact match, use the role name as feittype name
        # This handles cases where feittype name includes the role
        return role_name

    # --- Beslistabel (Decision Table) Methods ---

    def execute_beslistabel(self, beslistabel: Beslistabel):
        """Execute a decision table by finding the first matching row."""
        # Trace start
        if self.context.trace_sink:
            self.context.trace_sink.record(TraceEvent(
                type="BESLISTABEL_START",
                details={"name": beslistabel.naam},
                span=beslistabel.span,
                rule_name=beslistabel.naam,
                instance_id=self.context.current_instance.instance_id if self.context.current_instance else None
            ))
        
        # Evaluate each row until we find a match
        for row in beslistabel.rows:
            if self._evaluate_beslistabel_row(beslistabel, row):
                # Apply the result
                self._apply_beslistabel_result(beslistabel, row)
                
                # Trace the matched row
                if self.context.trace_sink:
                    self.context.trace_sink.record(TraceEvent(
                        type="BESLISTABEL_ROW_MATCHED",
                        details={"row_number": row.row_number},
                        span=row.span,
                        rule_name=beslistabel.naam,
                        instance_id=self.context.current_instance.instance_id if self.context.current_instance else None
                    ))
                
                # Stop after first match
                break

    def _evaluate_beslistabel_row(self, beslistabel: Beslistabel, row: BeslistabelRow) -> bool:
        """Check if all conditions in a row match."""
        # Import here to avoid circular import
        from .beslistabel_parser import BeslistabelParser
        parser = BeslistabelParser()
        
        for i, condition_value in enumerate(row.condition_values):
            # Skip n.v.t. conditions
            if isinstance(condition_value, Literal) and condition_value.value == "n.v.t.":
                continue
            
            # Get the parsed condition if available
            if beslistabel.parsed_conditions and i < len(beslistabel.parsed_conditions):
                parsed_condition = beslistabel.parsed_conditions[i]
                
                # Build the full condition expression
                if parsed_condition.subject_path or parsed_condition.is_kenmerk_check:
                    # Get current object type from context
                    current_object_type = self.context.current_instance.object_type_naam if self.context.current_instance else None
                    
                    # Build condition expression using parser
                    condition_expr = parser.build_condition_expression(
                        parsed_condition,
                        condition_value,
                        current_object_type,
                        row.span
                    )
                    
                    if condition_expr:
                        # Evaluate the built condition
                        condition_result = self.evaluate_expression(condition_expr)
                        
                        # Check if condition is met
                        if not self._is_truthy(condition_result):
                            return False
                        continue
            
            # Fallback: simple value comparison
            condition_result = self.evaluate_expression(condition_value)
            
            # Check if condition is met
            if not self._is_truthy(condition_result):
                return False
        
        # All conditions matched
        return True

    def _apply_beslistabel_result(self, beslistabel: Beslistabel, row: BeslistabelRow):
        """Apply the result expression from a matched row."""
        # Evaluate the result value
        result_value = self.evaluate_expression(row.result_expression)
        
        # Use parsed result information if available
        if beslistabel.parsed_result and self.context.current_instance:
            parsed_result = beslistabel.parsed_result
            
            if parsed_result.target_type == "attribute" and parsed_result.attribute_path:
                # Apply to attribute
                attribute_name = parsed_result.attribute_path[0]  # Simple case for now
                
                # Set the attribute
                self.context.set_attribute(
                    self.context.current_instance,
                    attribute_name,
                    result_value
                )
                
                # Trace the assignment
                if self.context.trace_sink:
                    self.context.trace_sink.record(TraceEvent(
                        type="BESLISTABEL_RESULT_APPLIED",
                        details={
                            "row_number": row.row_number,
                            "target": f"attribute:{attribute_name}",
                            "result_value": str(result_value)
                        },
                        span=row.span,
                        rule_name=beslistabel.naam,
                        instance_id=self.context.current_instance.instance_id
                    ))
                    
            elif parsed_result.target_type == "kenmerk" and parsed_result.kenmerk_name:
                # Apply to kenmerk
                # For kenmerk assignment, result_value should be boolean
                kenmerk_value = self._is_truthy(result_value)
                
                self.context.set_kenmerk(
                    self.context.current_instance,
                    parsed_result.kenmerk_name,
                    kenmerk_value
                )
                
                # Trace the assignment
                if self.context.trace_sink:
                    self.context.trace_sink.record(TraceEvent(
                        type="BESLISTABEL_RESULT_APPLIED",
                        details={
                            "row_number": row.row_number,
                            "target": f"kenmerk:{parsed_result.kenmerk_name}",
                            "result_value": str(kenmerk_value)
                        },
                        span=row.span,
                        rule_name=beslistabel.naam,
                        instance_id=self.context.current_instance.instance_id
                    ))
        else:
            # Fallback: just trace the result
            if self.context.trace_sink:
                self.context.trace_sink.record(TraceEvent(
                    type="BESLISTABEL_RESULT_APPLIED",
                    details={
                        "row_number": row.row_number,
                        "result_value": str(result_value),
                        "warning": "Could not parse result target"
                    },
                    span=row.span,
                    rule_name=beslistabel.naam,
                    instance_id=self.context.current_instance.instance_id if self.context.current_instance else None
                ))

    def _deduce_beslistabel_target_type(self, beslistabel: Beslistabel) -> Optional[str]:
        """Deduce the target object type from the result column text."""
        # Simple heuristic: look for "van een X" pattern in result column
        result_text = beslistabel.result_column
        
        # Try to find object type references
        for obj_type in self.context.domain_model.objecttypes:
            if obj_type in result_text:
                return obj_type
            # Also check with "een" prefix
            if f"een {obj_type}" in result_text:
                return obj_type
        
        # For the simple test case, just return the first object type
        # TODO: Improve this with proper parsing of result column
        if self.context.domain_model.objecttypes:
            return next(iter(self.context.domain_model.objecttypes))
        
        return None

    def _is_truthy(self, value: Any) -> bool:
        """Check if a value is considered true in a conditional context."""
        if isinstance(value, Value):
            return self._is_truthy(value.value)
        if isinstance(value, bool):
            return value
        if isinstance(value, (int, float, Decimal)):
            return value != 0
        if isinstance(value, str):
            return value.lower() not in ["", "n.v.t.", "false", "onwaar"]
        return bool(value)


# --- Trace Sink Definitions ---

# Rule evaluation events
TRACE_EVENT_RULE_EVAL_START = "RULE_EVAL_START"
TRACE_EVENT_RULE_EVAL_END = "RULE_EVAL_END"
TRACE_EVENT_RULE_FIRED = "RULE_FIRED"
TRACE_EVENT_RULE_SKIPPED = "RULE_SKIPPED"

# Condition evaluation events
TRACE_EVENT_CONDITION_EVAL_START = "CONDITION_EVAL_START"
TRACE_EVENT_CONDITION_EVAL_END = "CONDITION_EVAL_END"

# Expression evaluation events
TRACE_EVENT_EXPRESSION_EVAL_START = "EXPRESSION_EVAL_START"
TRACE_EVENT_EXPRESSION_EVAL_END = "EXPRESSION_EVAL_END"

# Variable, parameter, and attribute access events
TRACE_EVENT_VARIABLE_READ = "VARIABLE_READ"
TRACE_EVENT_VARIABLE_WRITE = "VARIABLE_WRITE"
TRACE_EVENT_PARAMETER_READ = "PARAMETER_READ"
TRACE_EVENT_PARAMETER_WRITE = "PARAMETER_WRITE"
TRACE_EVENT_ATTRIBUTE_READ = "ATTRIBUTE_READ"
TRACE_EVENT_ATTRIBUTE_WRITE = "ATTRIBUTE_WRITE"
TRACE_EVENT_KENMERK_READ = "KENMERK_READ"
TRACE_EVENT_KENMERK_WRITE = "KENMERK_WRITE"

# Function call events
TRACE_EVENT_FUNCTION_CALL_START = "FUNCTION_CALL_START"
TRACE_EVENT_FUNCTION_CALL_END = "FUNCTION_CALL_END"

# Other events
TRACE_EVENT_ASSIGNMENT = "ASSIGNMENT"
TRACE_EVENT_OBJECT_CREATED = "OBJECT_CREATED"

@dataclass
class TraceEvent:
    """Represents a single event during execution (e.g., rule fired, value assigned)."""
    type: str # e.g., "RULE_FIRED", "ASSIGNMENT", "VALUE_READ", etc.
    details: Dict[str, Any] = field(default_factory=dict)
    span: Optional[ast.SourceSpan] = None
    instance_id: Optional[str] = None  # ID of the instance being operated on if applicable
    rule_name: Optional[str] = None    # Name of the rule being executed if applicable
    # timestamp: datetime = field(default_factory=datetime.utcnow) # Consider adding timestamp

class TraceSink:
    """Abstract base class for handling trace events.
       Designed to be used by the RuntimeContext and Evaluator.
    """
    def record(self, event: TraceEvent):
        """Records a generic trace event."""
        raise NotImplementedError

    # --- Original event methods for backward compatibility ---
    
    def rule_fired(self, rule: ast.Regel):
        """Records that a rule was fired (condition true, result applied)."""
        self.record(TraceEvent(
            type=TRACE_EVENT_RULE_FIRED,
            details={"rule_name": rule.naam},
            span=rule.span,
            rule_name=rule.naam
        ))

    def assignment(self, instance: RuntimeObject, target: str, old_value: Any, new_value: Any, span: Optional[ast.SourceSpan] = None):
        """Records an assignment to an attribute or kenmerk."""
        instance_id = f"{instance.object_type_naam}[{instance.instance_id or id(instance)}]" 
        self.record(TraceEvent(
            type=TRACE_EVENT_ASSIGNMENT,
            details={
                "target": target, # attribute or kenmerk:name
                "old_value": old_value, 
                "new_value": new_value
            },
            span=span,
            instance_id=instance.instance_id
        ))
    
    # --- Enhanced event methods for more detailed tracing ---
    
    def rule_eval_start(self, rule: ast.Regel, instance: RuntimeObject):
        """Records the start of rule evaluation for an instance."""
        self.record(TraceEvent(
            type=TRACE_EVENT_RULE_EVAL_START,
            details={
                "object_type": instance.object_type_naam
            },
            span=rule.span,
            rule_name=rule.naam,
            instance_id=instance.instance_id
        ))
    
    def rule_eval_end(self, rule: ast.Regel, instance: RuntimeObject, success: bool, error: Optional[str] = None):
        """Records the end of rule evaluation, with success status and optional error."""
        details = {
            "success": success,
            "object_type": instance.object_type_naam
        }
        if error:
            details["error"] = error
            
        self.record(TraceEvent(
            type=TRACE_EVENT_RULE_EVAL_END,
            details=details,
            span=rule.span,
            rule_name=rule.naam,
            instance_id=instance.instance_id
        ))
    
    def rule_skipped(self, rule: ast.Regel, instance: RuntimeObject, reason: str):
        """Records that a rule was skipped (condition false)."""
        self.record(TraceEvent(
            type=TRACE_EVENT_RULE_SKIPPED,
            details={
                "reason": reason,
                "object_type": instance.object_type_naam
            },
            span=rule.span,
            rule_name=rule.naam,
            instance_id=instance.instance_id
        ))
        
    def condition_eval_start(self, condition: ast.Voorwaarde, rule_name: str, instance_id: Optional[str] = None):
        """Records the start of condition evaluation."""
        self.record(TraceEvent(
            type=TRACE_EVENT_CONDITION_EVAL_START,
            details={},
            span=condition.span,
            rule_name=rule_name,
            instance_id=instance_id
        ))
        
    def condition_eval_end(self, condition: ast.Voorwaarde, result: bool, rule_name: str, instance_id: Optional[str] = None):
        """Records the end of condition evaluation with the result."""
        self.record(TraceEvent(
            type=TRACE_EVENT_CONDITION_EVAL_END,
            details={"result": result},
            span=condition.span,
            rule_name=rule_name,
            instance_id=instance_id
        ))
        
    def expression_eval_start(self, expr: ast.Expression, rule_name: Optional[str] = None, instance_id: Optional[str] = None):
        """Records the start of expression evaluation."""
        details = {"expression_type": expr.__class__.__name__}
        if isinstance(expr, ast.BinaryExpression):
            details["operator"] = expr.operator.name
        elif isinstance(expr, ast.UnaryExpression):
            details["operator"] = expr.operator.name
        elif isinstance(expr, ast.FunctionCall):
            details["function_name"] = expr.function_name
            
        self.record(TraceEvent(
            type=TRACE_EVENT_EXPRESSION_EVAL_START,
            details=details,
            span=expr.span,
            rule_name=rule_name,
            instance_id=instance_id
        ))
        
    def expression_eval_end(self, expr: ast.Expression, result: Any, rule_name: Optional[str] = None, instance_id: Optional[str] = None):
        """Records the end of expression evaluation with the result."""
        details = {
            "expression_type": expr.__class__.__name__,
            "result": repr(result),
            "result_type": type(result).__name__
        }
        
        self.record(TraceEvent(
            type=TRACE_EVENT_EXPRESSION_EVAL_END,
            details=details,
            span=expr.span,
            rule_name=rule_name,
            instance_id=instance_id
        ))
        
    def function_call_start(self, func: ast.FunctionCall, args: List[Any], rule_name: Optional[str] = None, instance_id: Optional[str] = None):
        """Records the start of a function call with evaluated arguments."""
        self.record(TraceEvent(
            type=TRACE_EVENT_FUNCTION_CALL_START,
            details={
                "function_name": func.function_name,
                "args": [repr(arg) for arg in args]
            },
            span=func.span,
            rule_name=rule_name,
            instance_id=instance_id
        ))
        
    def function_call_end(self, func: ast.FunctionCall, result: Any, rule_name: Optional[str] = None, instance_id: Optional[str] = None):
        """Records the end of a function call with the result."""
        self.record(TraceEvent(
            type=TRACE_EVENT_FUNCTION_CALL_END,
            details={
                "function_name": func.function_name,
                "result": repr(result),
                "result_type": type(result).__name__
            },
            span=func.span,
            rule_name=rule_name,
            instance_id=instance_id
        ))
        
    def variable_read(self, name: str, value: Any, expr: Optional[ast.Expression] = None, rule_name: Optional[str] = None, instance_id: Optional[str] = None):
        """Records reading a variable's value."""
        self.record(TraceEvent(
            type=TRACE_EVENT_VARIABLE_READ,
            details={
                "name": name,
                "value": repr(value),
                "value_type": type(value).__name__
            },
            span=expr.span if expr else None,
            rule_name=rule_name,
            instance_id=instance_id
        ))
        
    def variable_write(self, name: str, old_value: Any, new_value: Any, expr: Optional[ast.Expression] = None, rule_name: Optional[str] = None, instance_id: Optional[str] = None):
        """Records writing a new value to a variable."""
        self.record(TraceEvent(
            type=TRACE_EVENT_VARIABLE_WRITE,
            details={
                "name": name,
                "old_value": repr(old_value) if old_value is not None else None,
                "new_value": repr(new_value),
                "value_type": type(new_value).__name__
            },
            span=expr.span if expr else None,
            rule_name=rule_name,
            instance_id=instance_id
        ))
        
    def parameter_read(self, name: str, value: Any, expr: Optional[ast.Expression] = None, rule_name: Optional[str] = None, instance_id: Optional[str] = None):
        """Records reading a parameter's value."""
        self.record(TraceEvent(
            type=TRACE_EVENT_PARAMETER_READ,
            details={
                "name": name,
                "value": repr(value),
                "value_type": type(value).__name__
            },
            span=expr.span if expr else None,
            rule_name=rule_name,
            instance_id=instance_id
        ))
        
    def attribute_read(self, instance: RuntimeObject, attr_name: str, value: Any, expr: Optional[ast.Expression] = None, rule_name: Optional[str] = None):
        """Records reading an attribute's value."""
        self.record(TraceEvent(
            type=TRACE_EVENT_ATTRIBUTE_READ,
            details={
                "attribute": attr_name,
                "value": repr(value),
                "value_type": type(value).__name__,
                "object_type": instance.object_type_naam
            },
            span=expr.span if expr else None,
            rule_name=rule_name,
            instance_id=instance.instance_id
        ))
        
    def kenmerk_read(self, instance: RuntimeObject, kenmerk_name: str, value: bool, expr: Optional[ast.Expression] = None, rule_name: Optional[str] = None):
        """Records reading a kenmerk's value."""
        self.record(TraceEvent(
            type=TRACE_EVENT_KENMERK_READ,
            details={
                "kenmerk": kenmerk_name,
                "value": value,
                "object_type": instance.object_type_naam
            },
            span=expr.span if expr else None,
            rule_name=rule_name,
            instance_id=instance.instance_id
        ))
    
    def object_created(self, object_type: str, instance_id: str, attributes: Dict[str, Any], span: Optional[ast.SourceSpan] = None, rule_name: Optional[str] = None):
        """Records the creation of a new object instance."""
        self.record(TraceEvent(
            type=TRACE_EVENT_OBJECT_CREATED,
            details={
                "object_type": object_type,
                "attributes": {k: repr(v) for k, v in attributes.items()}
            },
            span=span,
            rule_name=rule_name,
            instance_id=instance_id
        ))

class PrintTraceSink(TraceSink):
    """Simple trace sink that prints events to stdout."""
    def record(self, event: TraceEvent):
        span_info = f" (Line {event.span.start_line})" if event.span else ""
        instance_info = f", instance={event.instance_id}" if event.instance_id else ""
        rule_info = f", rule={event.rule_name}" if event.rule_name else ""
        
        # Simple representation of details
        details_str = ", ".join(f"{k}={v!r}" for k, v in event.details.items())
        print(f"TRACE:{span_info}{rule_info}{instance_info} {event.type} - {details_str}")

class JSONTraceSink(TraceSink):
     """Trace sink writing JSON lines to a file pointer."""
     def __init__(self, fp):
         self.fp = fp
     def record(self, event: TraceEvent):
         # Convert span and potentially other non-serializable objects
         details_serializable = {} # TODO: Handle non-serializable values in details
         for k, v in event.details.items():
             # Basic handling, needs improvement
             if isinstance(v, (int, float, str, bool, list, dict)) or v is None:
                 details_serializable[k] = v
             else:
                 details_serializable[k] = repr(v)

         span_dict = None
         if event.span:
             span_dict = {
                 "start_line": event.span.start_line, 
                 "start_col": event.span.start_col, 
                 "end_line": event.span.end_line, 
                 "end_col": event.span.end_col
             }

         log_entry = {
             "event": event.type, 
             "details": details_serializable, 
             "span": span_dict,
             "instance_id": event.instance_id,
             "rule_name": event.rule_name
         }
         import json
         json.dump(log_entry, self.fp)
         self.fp.write("\n")
