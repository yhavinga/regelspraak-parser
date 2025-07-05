"""RegelSpraak execution engine and evaluation logic."""
import math
from typing import Any, Dict, Optional, List, TYPE_CHECKING, Union
from dataclasses import dataclass, field
import logging
from decimal import Decimal
from datetime import date

# Import AST nodes
from . import ast
from .ast import (
    Expression, Literal, VariableReference, AttributeReference, ParameterReference, # Added ParameterReference
    BinaryExpression, UnaryExpression, FunctionCall, Operator, DomainModel, Regel,
    Gelijkstelling, KenmerkToekenning, ObjectCreatie, FeitCreatie, Consistentieregel, Initialisatie, # Added ResultaatDeel types
    Verdeling, VerdelingMethode, VerdelingGelijkeDelen, VerdelingNaarRato, VerdelingOpVolgorde,
    VerdelingTieBreak, VerdelingMaximum, VerdelingAfronding
)
# Import Runtime components
from .runtime import RuntimeContext, RuntimeObject, Value # Import Value directly
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
        
        # Function registry for cleaner function handling
        self._function_registry = {
            "abs": self._func_abs,
            "max": self._func_max,
            "min": self._func_min,
            "tijdsduur_van": self._func_tijdsduur_van,
            "absolute_tijdsduur_van": self._func_absolute_tijdsduur_van,
            "som_van": self._func_som_van,
            "gemiddelde_van": self._func_gemiddelde_van,
            "eerste_van": self._func_eerste_van,
            "laatste_van": self._func_laatste_van,
            "totaal_van": self._func_totaal_van,
            "aantal_dagen_in": self._func_aantal_dagen_in,
            "het_aantal_dagen_in": self._func_aantal_dagen_in,
            "de_eerste_van": self._func_eerste_van,
            "de_laatste_van": self._func_laatste_van,
            "het_gemiddelde_van": self._func_gemiddelde_van,
            "het_totaal_van": self._func_totaal_van,
        }

    def execute_model(self, domain_model: DomainModel):
        """Executes all rules in the domain model against the context."""
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
        return results

    def _deduce_rule_target_type(self, rule: Regel) -> Optional[str]:
        """Tries to deduce the primary ObjectType a rule applies to."""
        # Simplistic: Look at the target of the resultaat
        target_ref: Optional[ast.AttributeReference] = None
        if isinstance(rule.resultaat, (Gelijkstelling, KenmerkToekenning, Initialisatie)):
            target_ref = rule.resultaat.target
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
            # This is complex - for now, try to deduce from subject1
            if isinstance(rule.resultaat.subject1, AttributeReference) and rule.resultaat.subject1.path:
                # If subject1 refers to an object type, use that
                for path_elem in rule.resultaat.subject1.path:
                    # First remove any articles
                    clean_elem = path_elem
                    for article in ['een ', 'de ', 'het ']:
                        if clean_elem.lower().startswith(article):
                            clean_elem = clean_elem[len(article):]
                            break
                    
                    if clean_elem in self.context.domain_model.objecttypes:
                        return clean_elem
                    
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
            # Otherwise, check subject2
            if isinstance(rule.resultaat.subject2, AttributeReference) and rule.resultaat.subject2.path:
                for path_elem in rule.resultaat.subject2.path:
                    # First remove any articles
                    clean_elem = path_elem
                    for article in ['een ', 'de ', 'het ']:
                        if clean_elem.lower().startswith(article):
                            clean_elem = clean_elem[len(article):]
                            break
                    
                    if clean_elem in self.context.domain_model.objecttypes:
                        return clean_elem
                    
                    # Try to find object type within the path element
                    # Try matching from the end with multiple words
                    path_elem_lower = clean_elem.lower()
                    words = path_elem_lower.split()
                    if words:
                        # First try to match the last word (most specific)
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
            # Try to find object type from roles in feittypes
            # Check if subject1 or subject2 contain role names
            if isinstance(rule.resultaat.subject1, AttributeReference) and rule.resultaat.subject1.path:
                for path_elem in rule.resultaat.subject1.path:
                    # Remove articles
                    clean_elem = path_elem.lower().replace("een ", "").replace("de ", "").replace("het ", "")
                    # Check if it's a role name in any feittype
                    for feittype_naam, feittype in self.context.domain_model.feittypen.items():
                        for rol in feittype.rollen:
                            if rol.naam and clean_elem in rol.naam.lower():
                                return rol.object_type
            
            # For FeitCreatie, default to checking all object types that have relationships
            # This allows the rule to iterate over all instances that might participate
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
            if len(target_ref.path) > 1: 
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
        if self.context.current_instance is None:
            raise RegelspraakError(f"Cannot evaluate rule '{rule.naam}': No current instance set in context.")

        instance = self.context.current_instance
        
        # Trace the start of rule evaluation
        if self.context.trace_sink:
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
                        instance_id=instance.instance_id
                    )
                    
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
                        instance_id=instance.instance_id
                    )

            # 3. If condition met, apply result
            if condition_met:
                if self.context.trace_sink:
                    # Log rule firing
                    self.context.trace_sink.rule_fired(rule)
                self._apply_resultaat(rule.resultaat)
            else:
                # Log rule skipped due to condition
                if self.context.trace_sink:
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
            if self.context.trace_sink:
                self.context.trace_sink.rule_eval_end(rule, instance, success, error_msg)

    def _apply_resultaat(self, res: ast.ResultaatDeel):
        """Applies the result of a rule (Gelijkstelling, Initialisatie, or KenmerkToekenning) 
           to the current instance in the context.
        """
        instance = self.context.current_instance
        if instance is None:
            # This should ideally be caught earlier
            raise RegelspraakError("Cannot apply result: No current instance.", span=res.span)

        if isinstance(res, Gelijkstelling):
            value = self.evaluate_expression(res.expressie)
            # Path structure from builder: ["attribute", "object_type", ...]
            # For "De resultaat van een Bedrag": ["resultaat", "Bedrag"]
            # The first element is the attribute name
            if not res.target.path:
                raise RegelspraakError("Gelijkstelling target path is empty.", span=res.target.span)
            attr_name = res.target.path[0]
            # Pass the Value object directly
            self.context.set_attribute(instance, attr_name, value, span=res.span)
        
        elif isinstance(res, Initialisatie):
            # First check if the attribute is empty (None or not set)
            if not res.target.path:
                raise RegelspraakError("Initialisatie target path is empty.", span=res.target.span)
            attr_name = res.target.path[0]
            
            # Check if attribute already has a value
            try:
                current_value = self.context.get_attribute(instance, attr_name)
                # If we got here, attribute exists and has a value, do nothing (per spec)
            except RuntimeError:
                # Attribute doesn't exist or is empty, so initialize it
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
                        condition_value = self.evaluate_expression(self._current_rule.voorwaarde.expressie)
                        if condition_value.datatype != "Boolean" or not condition_value.value:
                            # Condition not met, skip this target
                            continue
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
        
        else:
            # Use RegelspraakError instead of NotImplementedError with keyword args
            raise RegelspraakError(f"Applying result for type {type(res)} not implemented", span=res.span)


    def evaluate_expression(self, expr: Expression) -> Value:
        """Evaluate an AST Expression node, returning a Value object."""
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
                # Wrap literal in Value object
                # Determine datatype from literal type
                if isinstance(expr.value, bool):
                    datatype = "Boolean"
                elif isinstance(expr.value, (int, float, Decimal)):
                    datatype = "Numeriek"
                elif isinstance(expr.value, str):
                    datatype = "Tekst"
                else:
                    datatype = "Onbekend"
                    
                # Check if literal has unit info (would need to be added to AST)
                unit = getattr(expr, 'unit', None)
                result = Value(value=expr.value, datatype=datatype, unit=unit)

            elif isinstance(expr, VariableReference):
                value = self.context.get_variable(expr.variable_name)
                
                # Trace variable read
                if self.context.trace_sink:
                    self.context.trace_sink.variable_read(
                        expr.variable_name, 
                        value.value if isinstance(value, Value) else value, 
                        expr=expr,
                        instance_id=instance_id
                    )
                    
                result = value

            elif isinstance(expr, ParameterReference):
                value = self.context.get_parameter(expr.parameter_name)
                
                # Trace parameter read
                if self.context.trace_sink:
                    self.context.trace_sink.parameter_read(
                        expr.parameter_name, 
                        value.value if isinstance(value, Value) else value, 
                        expr=expr,
                        instance_id=instance_id
                    )
                    
                result = value

            elif isinstance(expr, AttributeReference):
                # Simple case: direct attribute on current instance (e.g., "leeftijd")
                # TODO: Handle multi-part paths (e.g., person.address.street)
                if self.context.current_instance is None:
                    raise RegelspraakError("Cannot evaluate attribute reference: No current instance.", span=expr.span)
                if not expr.path:
                    raise RegelspraakError("Attribute reference path is empty.", span=expr.span)

                # If path is like ["leeftijd"], get from current_instance
                if len(expr.path) == 1:
                    attr_name = expr.path[0]
                    
                    # Special case: If the path element is a role name that the current instance fulfills,
                    # return the current instance itself (for FeitCreatie conditions)
                    if self._check_if_current_instance_has_role(attr_name):
                        # Return the current instance as a reference
                        result = Value(value=self.context.current_instance, datatype="ObjectReference")
                    else:
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
                                    if rol.naam.lower() == segment.lower():
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
                                        # Take the first related object (simplified for now)
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

    def _apply_consistentieregel(self, res: Consistentieregel) -> bool:
        """Apply a consistency rule and return true if consistent, false if inconsistent."""
        if res.criterium_type == "uniek":
            # Handle uniqueness check
            if not res.target:
                raise RegelspraakError("Uniqueness check requires a target expression", span=res.span)
            
            # For uniqueness, we need to check all instances of the same type
            # The target expression should reference a collection like "alle Natuurlijke personen"
            # For now, implement a simple check
            logger.warning("Uniqueness checks not fully implemented yet")
            return True  # Assume consistent for now
            
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
            # If left_val is an object reference, we need to resolve it
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
        else:
            raise RegelspraakError(f"Unsupported unary operator: {op.name}", span=expr.span)

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
                                "het_gemiddelde_van", "het_totaal_van", "de_eerste_van", "de_laatste_van"]
        
        if func_name in aggregation_functions:
            # Normalize function name (remove articles)
            base_func_name = func_name
            if func_name.startswith("het_"):
                base_func_name = func_name[4:]
            elif func_name.startswith("de_"):
                base_func_name = func_name[3:]
                
            # Single argument case: "som van alle bedragen"
            if len(expr.arguments) == 1:
                arg = expr.arguments[0]
                if isinstance(arg, AttributeReference) and len(arg.path) == 1 and arg.path[0].endswith("en"):
                    # Handle the "functie van alle X" pattern specially
                    return self._handle_aggregation_alle_pattern(expr, base_func_name, arg.path[0])
            
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
            if func_name in self._function_registry and func_name != "som_van":
                # Special case: som_van has complex handling below, skip registry
                result = self._function_registry[func_name](expr, args if 'args' in locals() else None)
                
            elif func_name == "len": # Example: length of list/string
                if len(args) != 1: 
                    raise RegelspraakError(f"Function 'len' expects 1 argument, got {len(args)}", span=expr.span)
                arg = args[0]
                if arg.datatype != "Tekst":
                    raise RegelspraakError(f"Function 'len' requires text argument, got {arg.datatype}", span=expr.span)
                length = len(arg.value)
                result = Value(value=length, datatype="Numeriek", unit=None)
                
            elif func_name == "som_van":
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
                        raise RegelspraakError(f"'som_van' with single element path '{full_expr.path}' not recognized as plural attribute reference", span=expr.span)
                    
                elif len(expr.arguments) == 2:
                    # Two argument case (from DimensieAggExpr)
                    attr_expr = expr.arguments[0]
                    collection_expr = expr.arguments[1]
                    
                    if not isinstance(attr_expr, AttributeReference):
                        raise RegelspraakError(f"First argument to 'som_van' must be an attribute reference, got {type(attr_expr).__name__}", span=expr.span)
                    if not isinstance(collection_expr, AttributeReference):
                        raise RegelspraakError(f"Second argument to 'som_van' must be a collection reference, got {type(collection_expr).__name__}", span=expr.span)
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
                    
                    # Handle different collection patterns
                    if len(collection_expr.path) == 1:
                        collection_path = collection_expr.path[0]
                        
                        # Check for "X van de Y" pattern (e.g., "passagiers van de reis")
                        if " van " in collection_path:
                            # Split on " van " to get role and context
                            parts = collection_path.split(" van ")
                            if len(parts) == 2:
                                role_name = parts[0].strip()  # e.g., "passagiers"
                                context_ref = parts[1].strip()  # e.g., "de reis"
                                
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
                                            if rol.naam and context_ref.lower() in rol.naam.lower() and rol.object_type == self.context.current_instance.object_type_naam:
                                                # Found the feittype where current instance has the context role
                                                # Now look for the other role that matches our collection name
                                                for other_rol in feittype.rollen:
                                                    if other_rol != rol and other_rol.naam:
                                                        # Check if role name contains our target (e.g., "passagier" in role_name)
                                                        if role_name.rstrip('s').lower() in other_rol.naam.lower():
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
            elif func_name == "het_aantal":
                # TODO: Implement count aggregation
                raise RegelspraakError(f"Function '{expr.function_name}' not fully implemented", span=expr.span)
            # ... other functions like 'gemiddelde van', etc.
            else:
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
    def _func_abs(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Absolute value function."""
        if len(args) != 1: 
            raise RegelspraakError(f"Function 'abs' expects 1 argument, got {len(args)}", span=expr.span)
        arg = args[0]
        if arg.datatype not in ["Numeriek", "Bedrag"]:
            raise RegelspraakError(f"Function 'abs' requires numeric argument, got {arg.datatype}", span=expr.span)
        abs_val = abs(arg.to_decimal())
        return Value(value=abs_val, datatype=arg.datatype, unit=arg.unit)
    
    def _func_max(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Maximum value function."""
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
    
    def _func_min(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Minimum value function."""
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
    
    def _func_tijdsduur_van(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Calculate duration between two dates."""
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
        from datetime import datetime, timedelta
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
    
    def _func_absolute_tijdsduur_van(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Calculate absolute duration between two dates."""
        # Use tijdsduur_van and take absolute value
        result = self._func_tijdsduur_van(expr, args)
        if result.value is not None:
            result = Value(value=abs(result.value), datatype=result.datatype, unit=result.unit)
        return result
    
    def _func_som_van(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Sum aggregation function - handled specially in _handle_function_call."""
        # This is a placeholder - the actual implementation is in _handle_function_call
        # due to special argument evaluation requirements
        # If we reach here, it means it's being called from the registry with already evaluated args
        # This would be the simple concatenation case (3+ args)
        if args is None:
            # Special case: som_van with special patterns is handled in _handle_function_call
            # This should not be reached
            raise RegelspraakError("som_van special patterns should be handled in _handle_function_call", span=expr.span)
            
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
    
    def _func_gemiddelde_van(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Average aggregation function."""
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
    
    def _func_aantal_dagen_in(self, expr: FunctionCall, args: List[Value]) -> Value:
        """Count number of days in a month or year."""
        if len(args) != 1:
            raise RegelspraakError(f"Function 'aantal_dagen_in' expects 1 argument (date), got {len(args)}", span=expr.span)
        
        date_arg = args[0]
        if date_arg.datatype not in ["Datum", "Datum-tijd"]:
            raise RegelspraakError(f"Function 'aantal_dagen_in' requires date argument, got {date_arg.datatype}", span=expr.span)
        
        # Handle empty value
        if date_arg.value is None:
            return Value(value=None, datatype="Numeriek", unit="dagen")
        
        # Import datetime handling
        from datetime import datetime
        import dateutil.parser
        import calendar
        
        # Parse date
        try:
            if isinstance(date_arg.value, str):
                date = dateutil.parser.parse(date_arg.value)
            else:
                date = date_arg.value
        except Exception as e:
            raise RegelspraakError(f"Error parsing date in aantal_dagen_in: {e}", span=expr.span)
        
        # Determine if we're counting days in month or year based on context
        # This would need to be passed from the parser - for now assume month
        # TODO: Get actual period type from expression context
        
        # Count days in the month
        days_in_month = calendar.monthrange(date.year, date.month)[1]
        
        return Value(value=Decimal(days_in_month), datatype="Numeriek", unit="dagen")

    def _compare_values(self, val1: Value, val2: Value) -> int:
        """Compare two values, returning -1 if val1 < val2, 0 if equal, 1 if val1 > val2."""
        # Ensure compatible types
        if val1.datatype != val2.datatype:
            raise RegelspraakError(f"Cannot compare values of different types: {val1.datatype} and {val2.datatype}")
        
        # Handle dates specially
        if val1.datatype in ["Datum", "Datum-tijd"]:
            from datetime import datetime
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

# --- Tracing --- (Keep TraceSink definitions as they are useful)

# Event type constants for structured tracing
TRACE_EVENT_RULE_EVAL_START = "RULE_EVAL_START"
TRACE_EVENT_RULE_EVAL_END = "RULE_EVAL_END"
TRACE_EVENT_CONDITION_EVAL_START = "CONDITION_EVAL_START"
TRACE_EVENT_CONDITION_EVAL_END = "CONDITION_EVAL_END"
TRACE_EVENT_EXPRESSION_EVAL_START = "EXPRESSION_EVAL_START"
TRACE_EVENT_EXPRESSION_EVAL_END = "EXPRESSION_EVAL_END"
TRACE_EVENT_VARIABLE_READ = "VARIABLE_READ"
TRACE_EVENT_VARIABLE_WRITE = "VARIABLE_WRITE"
TRACE_EVENT_PARAMETER_READ = "PARAMETER_READ"
TRACE_EVENT_PARAMETER_WRITE = "PARAMETER_WRITE"
TRACE_EVENT_ATTRIBUTE_READ = "ATTRIBUTE_READ"
TRACE_EVENT_ATTRIBUTE_WRITE = "ATTRIBUTE_WRITE"
TRACE_EVENT_KENMERK_READ = "KENMERK_READ"
TRACE_EVENT_KENMERK_WRITE = "KENMERK_WRITE"
TRACE_EVENT_FUNCTION_CALL_START = "FUNCTION_CALL_START"
TRACE_EVENT_FUNCTION_CALL_END = "FUNCTION_CALL_END"
TRACE_EVENT_RULE_FIRED = "RULE_FIRED"
TRACE_EVENT_RULE_SKIPPED = "RULE_SKIPPED"
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
