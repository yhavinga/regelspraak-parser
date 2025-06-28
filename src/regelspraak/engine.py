"""RegelSpraak execution engine and evaluation logic."""
import math
from typing import Any, Dict, Optional, List, TYPE_CHECKING, Union
from dataclasses import dataclass, field
import logging
from decimal import Decimal

# Import AST nodes
from . import ast
from .ast import (
    Expression, Literal, VariableReference, AttributeReference, ParameterReference, # Added ParameterReference
    BinaryExpression, UnaryExpression, FunctionCall, Operator, DomainModel, Regel,
    Gelijkstelling, KenmerkToekenning, ObjectCreatie, FeitCreatie, Consistentieregel # Added ResultaatDeel types
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
                    print(f"RuntimeError executing rule '{rule.naam}' for instance '{instance.instance_id}': {e}")
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
        if isinstance(rule.resultaat, (Gelijkstelling, KenmerkToekenning)):
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
                    if potential_type in self.context.domain_model.objecttypes:
                        return potential_type
                # Return it anyway - let the caller validate
                return potential_type
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
        """Applies the result of a rule (Gelijkstelling or KenmerkToekenning) 
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
                            # Get the attribute value which should be an object reference
                            ref_value = self.context.get_attribute(current_obj, segment)
                            
                            # Check if it's an object reference
                            if ref_value.datatype != "ObjectReference":
                                raise RegelspraakError(
                                    f"Expected ObjectReference for '{segment}' but got {ref_value.datatype}",
                                    span=expr.span
                                )
                            
                            # Move to the referenced object
                            current_obj = ref_value.value
                            if not isinstance(current_obj, RuntimeObject):
                                raise RegelspraakError(
                                    f"Invalid object reference in path at '{segment}'",
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

    def _handle_function_call(self, expr: FunctionCall) -> Value:
        """Handle function calls (basic built-ins), returning Value objects."""
        current_instance = self.context.current_instance
        instance_id = current_instance.instance_id if current_instance else None
        
        # Evaluate arguments first
        args = [self.evaluate_expression(arg) for arg in expr.arguments]
        func_name = expr.function_name.lower() # Normalize name
        
        # Trace function call start (extract raw values for tracing)
        if self.context.trace_sink:
            raw_args = [arg.value if isinstance(arg, Value) else arg for arg in args]
            self.context.trace_sink.function_call_start(
                expr, 
                raw_args, 
                instance_id=instance_id
            )
        
        result = None
        try:
            # TODO: Implement more robust function handling (registry?)
            # Basic built-ins:
            if func_name == "abs":
                if len(args) != 1: 
                    raise RegelspraakError(f"Function 'abs' expects 1 argument, got {len(args)}", span=expr.span)
                arg = args[0]
                if arg.datatype not in ["Numeriek", "Bedrag"]:
                    raise RegelspraakError(f"Function 'abs' requires numeric argument, got {arg.datatype}", span=expr.span)
                abs_val = abs(arg.to_decimal())
                result = Value(value=abs_val, datatype=arg.datatype, unit=arg.unit)
                
            elif func_name == "max":
                if not args: 
                    raise RegelspraakError("Function 'max' requires at least one argument", span=expr.span)
                # Check all args have compatible types and units
                first_type = args[0].datatype
                first_unit = args[0].unit
                for arg in args[1:]:
                    if arg.datatype != first_type:
                        raise RegelspraakError(f"Function 'max' requires all arguments to have same type", span=expr.span)
                    if not self.arithmetic._check_units_compatible(args[0], arg, "max"):
                        raise RegelspraakError(f"Function 'max' requires compatible units", span=expr.span)
                # Convert all to first unit and find max
                values = [self.arithmetic._convert_to_unit(arg, first_unit).to_decimal() if arg.unit != first_unit 
                         else arg.to_decimal() for arg in args]
                max_val = max(values)
                result = Value(value=max_val, datatype=first_type, unit=first_unit)
                
            elif func_name == "min":
                if not args: 
                    raise RegelspraakError("Function 'min' requires at least one argument", span=expr.span)
                # Similar to max
                first_type = args[0].datatype
                first_unit = args[0].unit
                for arg in args[1:]:
                    if arg.datatype != first_type:
                        raise RegelspraakError(f"Function 'min' requires all arguments to have same type", span=expr.span)
                    if not self.arithmetic._check_units_compatible(args[0], arg, "min"):
                        raise RegelspraakError(f"Function 'min' requires compatible units", span=expr.span)
                values = [self.arithmetic._convert_to_unit(arg, first_unit).to_decimal() if arg.unit != first_unit 
                         else arg.to_decimal() for arg in args]
                min_val = min(values)
                result = Value(value=min_val, datatype=first_type, unit=first_unit)
                
            elif func_name == "len": # Example: length of list/string
                if len(args) != 1: 
                    raise RegelspraakError(f"Function 'len' expects 1 argument, got {len(args)}", span=expr.span)
                arg = args[0]
                if arg.datatype != "Tekst":
                    raise RegelspraakError(f"Function 'len' requires text argument, got {arg.datatype}", span=expr.span)
                length = len(arg.value)
                result = Value(value=length, datatype="Numeriek", unit=None)
                
            # --- RegelSpraak specific (Placeholders) ---
            elif func_name == "tijdsduur van":
                raise RegelspraakError(f"Function '{expr.function_name}' not fully implemented", span=expr.span)
            elif func_name == "som van":
                raise RegelspraakError(f"Function '{expr.function_name}' not fully implemented", span=expr.span)
            # ... other functions like 'gemiddelde van', 'aantal' ...
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
                    instances = self.context.get_instances(obj_type)
                    if instances:
                        return instances[0]
                        
        # More complex paths would need additional logic
        # For now, return None
        return None
    
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
