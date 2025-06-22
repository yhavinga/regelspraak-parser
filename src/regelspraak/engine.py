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
    Gelijkstelling, KenmerkToekenning # Added ResultaatDeel types
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

    def execute_model(self, domain_model: DomainModel):
        """Executes all rules in the domain model against the context."""
        # Simple execution: iterate through all rules and apply them to
        # all relevant object instances found in the context.
        # TODO: Need a more sophisticated strategy for rule ordering and scoping.
        results = {}
        for rule in domain_model.regels:
            # Determine the target ObjectType for the rule (simplistic deduction)
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
        elif rule.voorwaarde: # Less ideal, check condition structure
            # Look for common patterns like 'Een X ...' or 'zijn Y'
            pass # TODO: Implement more robust deduction if needed
        
        if target_ref and target_ref.path: 
            # Assume the first part of the path *might* be the type name
            # e.g., "Natuurlijk persoon".leeftijd -> "Natuurlijk persoon"
            # This is fragile and depends on grammar/parsing conventions.
            # It might only contain the attribute like "leeftijd" if context is implicit
            if len(target_ref.path) > 1: 
                 # Check if first part matches a known object type? Needs refinement.
                 # return target_ref.path[0] # Example: Assume first element is type
                 pass
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
            # Evaluate expressions in rule.variabelen and store in context.variables
            for var_name, expr in rule.variabelen.items():
                var_value = self.evaluate_expression(expr)
                self.context.set_variable(var_name, var_value, expr.span)

            # 2. Check condition (voorwaarde)
            condition_met = True
            if rule.voorwaarde:
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
            # Assume target path is just the attribute name for simplicity for now
            # TODO: Handle nested paths correctly (e.g., contactpersoon.adres.straatnaam)
            if not res.target.path:
                raise RegelspraakError("Gelijkstelling target path is empty.", span=res.target.span)
            attr_name = res.target.path[-1]
            # Pass the Value object directly
            self.context.set_attribute(instance, attr_name, value, span=res.span)

        elif isinstance(res, KenmerkToekenning):
            kenmerk_value = not res.is_negated
            kenmerk_name = res.kenmerk_naam
            # Target might be implicit (the current instance) or explicit
            # For now, assume it applies to the current instance
            # TODO: Evaluate res.target if it's more complex than just the instance?
            self.context.set_kenmerk(instance, kenmerk_name, kenmerk_value, span=res.span)
        
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
