"""RegelSpraak execution engine and evaluation logic."""
import math
from typing import Any, Dict
from dataclasses import dataclass

# Import AST nodes
from .ast import (
    Expression, Literal, VariableReference, AttributeReference,
    BinaryExpression, UnaryExpression, FunctionCall, Operator, DomainModel, Regel
)
# Import Runtime components (assuming a structure like this)
# from .runtime import RuntimeContext, Instance, Value
# Import custom error
from .errors import RuntimeError # Use the custom RuntimeError


class Evaluator:
    """Evaluates RegelSpraak AST nodes within a given context."""

    def __init__(self, context: Any): # TODO: Replace Any with actual RuntimeContext type
        """Initialize the Evaluator with a runtime context."""
        # The context should hold the state: variables, parameters, object instances, etc.
        self.context = context

    def execute_model(self, domain_model: DomainModel):
        """Executes all rules in the domain model."""
        # TODO: Implement rule execution logic
        # - Determine execution order (if necessary)
        # - Iterate through relevant object instances based on rule scope
        # - Evaluate conditions and apply results for each rule
        results = {}
        for rule in domain_model.regels:
             # This is a simplified placeholder; actual execution is complex
             # Needs to handle rule scope (Voor elke...), context, etc.
             try:
                 result = self.evaluate_rule(rule)
                 results[rule.naam] = result
             except Exception as e:
                 results[rule.naam] = RuntimeError(f"Error executing rule '{rule.naam}': {e}")
        return results

    def evaluate_rule(self, rule: Regel) -> Any:
        """Evaluates a single rule within the current context."""
        # TODO: Implement detailed rule evaluation
        # 1. Set up local context/variables from rule.variabelen
        # 2. Check rule.voorwaarde (condition) by evaluating the expression
        # 3. If condition is met (or no condition), evaluate rule.resultaat
        #    - For Gelijkstelling: evaluate expression, assign to target attribute
        #    - For KenmerkToekenning: assign kenmerk to target
        if rule.voorwaarde:
            condition_met = self.evaluate_expression(rule.voorwaarde.expressie)
            if not condition_met:
                return None # Condition not met
        
        # Evaluate and apply result (placeholder)
        if hasattr(rule.resultaat, 'expressie'):
            return self.evaluate_expression(rule.resultaat.expressie)
        # else handle KenmerkToekenning or other result types
        return None # Placeholder

    def evaluate_expression(self, expr: Expression) -> Any:
        """Evaluate an AST Expression node."""
        if isinstance(expr, Literal):
            # TODO: Potentially convert datatypes (e.g., date string to date object)
            return expr.value
        elif isinstance(expr, VariableReference):
            # Get variable from the context
            return self.context.get_variable(expr.variable_name)
        elif isinstance(expr, AttributeReference):
             # Get attribute value from the context (needs instance info)
             # Path might be e.g., ["persoon", "leeftijd"]
             return self.context.get_attribute(expr.path)
        elif isinstance(expr, BinaryExpression):
            return self._handle_binary(expr)
        elif isinstance(expr, UnaryExpression):
            return self._handle_unary(expr)
        elif isinstance(expr, FunctionCall):
            return self._handle_function_call(expr)
        else:
            raise RuntimeError(f"Unknown expression type: {type(expr)}")

    def _handle_binary(self, expr: BinaryExpression) -> Any:
        """Handle binary operations."""
        left_val = self.evaluate_expression(expr.left)
        right_val = self.evaluate_expression(expr.right)
        op = expr.operator

        # Arithmetic
        if op == Operator.PLUS:
            return left_val + right_val
        elif op == Operator.MIN:
            return left_val - right_val
        elif op == Operator.MAAL:
            return left_val * right_val
        elif op == Operator.GEDEELD_DOOR:
            if right_val == 0:
                raise RuntimeError("Division by zero")
            return left_val / right_val
        # TODO: Add power operator if needed

        # Comparison
        elif op == Operator.GELIJK_AAN:
            return left_val == right_val
        elif op == Operator.NIET_GELIJK_AAN:
            return left_val != right_val
        elif op == Operator.KLEINER_DAN:
            return left_val < right_val
        elif op == Operator.GROTER_DAN:
            return left_val > right_val
        elif op == Operator.KLEINER_OF_GELIJK_AAN:
            return left_val <= right_val
        elif op == Operator.GROTER_OF_GELIJK_AAN:
            return left_val >= right_val
        elif op == Operator.IS: # Type/Kenmerk check - needs context
             return self.context.check_is(left_val, right_val) # Placeholder
        elif op == Operator.IN: # Membership check - needs context
             return self.context.check_in(left_val, right_val) # Placeholder

        # Logical
        elif op == Operator.EN:
            # Ensure boolean operands for logical ops
            if not isinstance(left_val, bool) or not isinstance(right_val, bool):
                 raise RuntimeError(f"Operator 'EN' requires boolean operands, got {type(left_val)} and {type(right_val)}")
            return left_val and right_val
        elif op == Operator.OF:
            if not isinstance(left_val, bool) or not isinstance(right_val, bool):
                 raise RuntimeError(f"Operator 'OF' requires boolean operands, got {type(left_val)} and {type(right_val)}")
            return left_val or right_val
        else:
            raise RuntimeError(f"Unsupported binary operator: {op.name}")

    def _handle_unary(self, expr: UnaryExpression) -> Any:
        """Handle unary operations."""
        operand_val = self.evaluate_expression(expr.operand)
        op = expr.operator

        if op == Operator.NIET:
            if not isinstance(operand_val, bool):
                 raise RuntimeError(f"Operator 'NIET' requires a boolean operand, got {type(operand_val)}")
            return not operand_val
        # TODO: Add other unary ops like unary minus if needed by grammar/AST
        # elif op == Operator.MIN:
        #     return -operand_val
        else:
            raise RuntimeError(f"Unsupported unary operator: {op.name}")

    def _handle_function_call(self, expr: FunctionCall) -> Any:
        """Handle function calls."""
        # Evaluate arguments first
        args = [self.evaluate_expression(arg) for arg in expr.arguments]
        func_name = expr.function_name.lower()

        # TODO: Implement built-in functions (or allow registration)
        if func_name == "tijdsduur van":
            # Needs specific logic based on args and potential unit conversion
            if len(args) != 2:
                raise RuntimeError(f"Function 'tijdsduur van' expects 2 arguments, got {len(args)}")
            # Placeholder: Assume args are date-like, needs date handling
            # return args[1] - args[0] # Simplified difference
            raise NotImplementedError("Function 'tijdsduur van' not fully implemented")
        elif func_name == "som van":
            # Needs collection/iteration logic provided by context
            # return sum(self.context.resolve_collection(expr.arguments[0]))
            raise NotImplementedError("Function 'som van' not fully implemented")
        # ... other functions ...
        else:
            # Check context for user-defined functions?
            raise RuntimeError(f"Unknown function: {expr.function_name}")

# --- Tracing (Placeholder based on plan) ---

@dataclass
class TraceEvent:
    """Represents a single event during execution (e.g., rule start, expr eval)."""
    type: str # e.g., "RULE_START", "EXPR_EVAL", "VAR_ASSIGN"
    details: Dict[str, Any]
    # timestamp: datetime = field(default_factory=datetime.utcnow)

class TraceSink:
    """Abstract base class for handling trace events."""
    def record(self, event: TraceEvent):
        raise NotImplementedError

class PrintTraceSink(TraceSink):
    """Simple trace sink that prints events."""
    def record(self, event: TraceEvent):
        print(f"TRACE: {event.type} - {event.details}")

# TODO: Add Execution Context / Runtime class if not already defined in runtime.py
# This class would hold variables, parameters, instances, etc.
# class RuntimeContext:
#     def __init__(self):
#         self.variables = {}
#         self.parameters = {}
#         self.instances = {}
#
#     def get_variable(self, name):
#         if name not in self.variables:
#             raise RuntimeError(f"Unknown variable: {name}")
#         return self.variables[name]
#
#     def set_variable(self, name, value):
#         self.variables[name] = value
#
#     def get_attribute(self, path):
#         # Needs logic to traverse instance data based on path
#         raise NotImplementedError
#
#     def check_is(self, left, right):
#         # Needs logic for type/kenmerk checking
#         raise NotImplementedError
#
#     def check_in(self, left, right):
#         # Needs logic for membership checking
#         raise NotImplementedError
