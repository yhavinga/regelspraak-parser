"""RegelSpraak execution engine and evaluation logic."""
import math
from typing import Any, Dict, Optional, List, TYPE_CHECKING
from dataclasses import dataclass, field
import logging

# Import AST nodes
from . import ast
from .ast import (
    Expression, Literal, VariableReference, AttributeReference, ParameterReference, # Added ParameterReference
    BinaryExpression, UnaryExpression, FunctionCall, Operator, DomainModel, Regel,
    Gelijkstelling, KenmerkToekenning # Added ResultaatDeel types
)
# Import Runtime components
from .runtime import RuntimeContext, RuntimeObject # Use actual RuntimeContext
# Import custom error
from .errors import RuntimeError # Use the custom RuntimeError

if TYPE_CHECKING:
    from .runtime import Value # For type checking if needed elsewhere

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
                    
                condition_met = self.evaluate_expression(rule.voorwaarde.expressie)
                
                if not isinstance(condition_met, bool):
                    error_msg = f"Rule '{rule.naam}' condition evaluated to non-boolean value: {condition_met} ({type(condition_met)})"
                    raise RegelspraakError(error_msg, span=rule.voorwaarde.span)
                
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


    def evaluate_expression(self, expr: Expression) -> Any:
        """Evaluate an AST Expression node, returning the raw Python value."""
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
                # TODO: Potentially convert datatypes based on expr.datatype?
                result = expr.value

            elif isinstance(expr, VariableReference):
                value = self.context.get_variable(expr.variable_name)
                
                # Trace variable read
                if self.context.trace_sink:
                    self.context.trace_sink.variable_read(
                        expr.variable_name, 
                        value, 
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
                        value, 
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
                            value,
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
                        # Handle accessing attributes of related objects (needs context traversal)
                        raise RegelspraakError(f"Accessing attributes via path '{'.'.join(expr.path)}' not yet implemented.", span=expr.span)

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

    def _handle_binary(self, expr: BinaryExpression) -> Any:
        """Handle binary operations."""
        left_val = self.evaluate_expression(expr.left)
        op = expr.operator

        # Handle IS and IN specially as right side might need different eval
        if op == Operator.IS:
            # Right side should be a kenmerk name (string) or type name (string)
            # We assume the right side AST node represents this directly (e.g., a Literal string or specific identifier node)
            # Let's assume `evaluate_expression` on the right side gives the name string.
            # This might be too simplistic if right side can be complex expr yielding a string.
            right_name = self.evaluate_expression(expr.right) # Assumes this yields the string name
            if not isinstance(right_name, str):
                raise RegelspraakError(f"Right side of 'IS' must evaluate to a string (kenmerk/type name), got {type(right_name)}", span=expr.right.span)
            if not isinstance(left_val, RuntimeObject):
                 # Check if left_val is an instance held in a variable? Requires lookup.
                 # For now, assume left_val *is* the instance if rule is structured correctly
                 # This needs review based on how rule context/scoping works.
                 # Let's try getting current instance if left_val isn't one directly.
                 instance = self.context.current_instance 
                 # raise RegelspraakError(f"Left side of 'IS' must be an object instance, got {type(left_val)}", span=expr.left.span)
            else: 
                 instance = left_val # If eval(left) directly yields an instance
            
            if instance is None: # Check after attempting retrieval
                 raise RegelspraakError("Could not determine object instance for 'IS' check.", span=expr.left.span)
                 
            return self.context.check_is(instance, right_name)

        elif op == Operator.IN:
            right_val = self.evaluate_expression(expr.right) # Evaluate to get the collection
            return self.context.check_in(left_val, right_val)

        # Standard evaluation for other operators where both sides are simple values
        right_val = self.evaluate_expression(expr.right)

        # Arithmetic (TODO: Consider type/unit checks?)
        if op == Operator.PLUS: return left_val + right_val
        elif op == Operator.MIN: return left_val - right_val
        elif op == Operator.MAAL: return left_val * right_val
        elif op == Operator.GEDEELD_DOOR:
            # TODO: Handle potential type errors before division
            if isinstance(right_val, (int, float)) and right_val == 0:
                raise RegelspraakError("Division by zero", span=expr.span)
            try:
                return left_val / right_val
            except Exception as e:
                raise RegelspraakError(f"Type error during division: {e}", span=expr.span)
        elif op == Operator.MACHT:
             return left_val ** right_val # Python's power operator

        # Comparison
        elif op == Operator.GELIJK_AAN: return left_val == right_val
        elif op == Operator.NIET_GELIJK_AAN: return left_val != right_val
        elif op == Operator.KLEINER_DAN: return left_val < right_val
        elif op == Operator.GROTER_DAN: return left_val > right_val
        elif op == Operator.KLEINER_OF_GELIJK_AAN: return left_val <= right_val
        elif op == Operator.GROTER_OF_GELIJK_AAN: return left_val >= right_val

        # Logical
        elif op == Operator.EN:
            if not isinstance(left_val, bool) or not isinstance(right_val, bool):
                 raise RegelspraakError(f"Operator 'en' requires boolean operands, got {type(left_val)} and {type(right_val)}", span=expr.span)
            return left_val and right_val
        elif op == Operator.OF:
            if not isinstance(left_val, bool) or not isinstance(right_val, bool):
                 raise RegelspraakError(f"Operator 'of' requires boolean operands, got {type(left_val)} and {type(right_val)}", span=expr.span)
            return left_val or right_val

        else:
            # Should not happen if IS/IN handled above
            raise RegelspraakError(f"Unsupported or unhandled binary operator: {op.name}", span=expr.span)

    def _handle_unary(self, expr: UnaryExpression) -> Any:
        """Handle unary operations."""
        operand_val = self.evaluate_expression(expr.operand)
        op = expr.operator

        if op == Operator.NIET:
            if not isinstance(operand_val, bool):
                 raise RegelspraakError(f"Operator 'niet' requires a boolean operand, got {type(operand_val)}", span=expr.operand.span)
            return not operand_val
        elif op == Operator.MIN: # Handle unary minus
             if not isinstance(operand_val, (int, float)): # Add other numeric types? Decimal?
                 raise RegelspraakError(f"Unary minus requires a numeric operand, got {type(operand_val)}", span=expr.operand.span)
             return -operand_val
        else:
            raise RegelspraakError(f"Unsupported unary operator: {op.name}", span=expr.span)

    def _handle_function_call(self, expr: FunctionCall) -> Any:
        """Handle function calls (basic built-ins)."""
        current_instance = self.context.current_instance
        instance_id = current_instance.instance_id if current_instance else None
        
        # Evaluate arguments first
        args = [self.evaluate_expression(arg) for arg in expr.arguments]
        func_name = expr.function_name.lower() # Normalize name
        
        # Trace function call start
        if self.context.trace_sink:
            self.context.trace_sink.function_call_start(
                expr, 
                args, 
                instance_id=instance_id
            )
        
        result = None
        try:
            # TODO: Implement more robust function handling (registry?)
            # Basic built-ins:
            if func_name == "abs":
                if len(args) != 1: raise RegelspraakError(f"Function 'abs' expects 1 argument, got {len(args)}", span=expr.span)
                result = abs(args[0])
            elif func_name == "max":
                if not args: raise RegelspraakError("Function 'max' requires at least one argument", span=expr.span)
                result = max(args)
            elif func_name == "min":
                if not args: raise RegelspraakError("Function 'min' requires at least one argument", span=expr.span)
                result = min(args)
            elif func_name == "len": # Example: length of list/string
                if len(args) != 1: raise RegelspraakError(f"Function 'len' expects 1 argument, got {len(args)}", span=expr.span)
                try: result = len(args[0])
                except TypeError: raise RegelspraakError(f"Argument to 'len' does not support length calculation ({type(args[0])})", span=expr.arguments[0].span)
            # --- RegelSpraak specific (Placeholders) ---
            elif func_name == "tijdsduur van":
                # Use RegelspraakError instead of NotImplementedError with keyword args
                raise RegelspraakError(f"Function '{expr.function_name}' not fully implemented", span=expr.span)
            elif func_name == "som van":
                # Use RegelspraakError instead of NotImplementedError with keyword args
                raise RegelspraakError(f"Function '{expr.function_name}' not fully implemented", span=expr.span)
            # ... other functions like 'gemiddelde van', 'aantal' ...
            else:
                # Check context for user-defined functions? TBD
                raise RegelspraakError(f"Unknown function: {expr.function_name}", span=expr.span)
                
        finally:
            # Trace function call end (even if there was an error)
            if self.context.trace_sink:
                self.context.trace_sink.function_call_end(
                    expr, 
                    result, 
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
