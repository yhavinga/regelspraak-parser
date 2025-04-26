"""Runtime representation of RegelSpraak concepts during evaluation."""

from dataclasses import dataclass, field
from typing import Any, Dict, Optional, List, TYPE_CHECKING

# Import AST and Error types using relative imports consistent with the project structure
from . import ast
from .errors import RuntimeError

if TYPE_CHECKING:
    # Use forward reference for type hint to avoid circular import
    from .engine import TraceSink 

# TODO: Potentially integrate with a units library later.

@dataclass(frozen=True)
class Value:
    """Represents a runtime value with its type and unit."""
    value: Any # The actual Python value (e.g., int, float, str, bool)
    datatype: str # RegelSpraak datatype (e.g., "Numeriek", "Tekst", "Boolean")
    eenheid: Optional[str] = None # Optional unit (e.g., "jr")

    # TODO: Add methods for type checking, unit conversions, and comparisons?


@dataclass
class RuntimeObject:
    """Represents an instance of an ObjectType in the runtime world."""
    object_type_naam: str
    # Attributes store their current Value
    attributen: Dict[str, Value] = field(default_factory=dict)
    # Kenmerken store their current boolean state (True if the object has the kenmerk)
    kenmerken: Dict[str, bool] = field(default_factory=dict)
    # Unique identifier for the object instance (optional but helpful)
    instance_id: Optional[str] = None # Could be auto-generated or assigned

@dataclass
class RuntimeContext:
    """Container for the runtime state during execution."""
    domain_model: ast.DomainModel # Link to the parsed model for definitions
    trace_sink: Optional['TraceSink'] = None # Optional sink for execution events

    # Stores parameter names mapped to their runtime Value
    parameters: Dict[str, Value] = field(default_factory=dict)
    # Stores object instances, keyed by object type name for easier lookup
    instances: Dict[str, List[RuntimeObject]] = field(default_factory=lambda: defaultdict(list))
    # Stores variables within the current rule execution scope
    variables: Dict[str, Any] = field(default_factory=dict) # Raw Python values for variables
    # Tracks the object instance currently being evaluated (e.g., by a rule)
    current_instance: Optional[RuntimeObject] = None

    # --- Parameter Handling ---

    def add_parameter(self, name: str, value: Value):
        """Adds or updates a parameter Value in the context."""
        # TODO: Validate against parameter definition in domain_model?
        self.parameters[name] = value
        # Maybe trace parameter loading?

    def get_parameter(self, name: str) -> Any:
        """Retrieves a parameter's raw value from the context."""
        param_value = self.parameters.get(name)
        if param_value is None:
             # Check definition? Or just fail? Fail for now.
             raise RuntimeError(f"Parameter '{name}' not found in runtime context.")
        # TODO: Trace value read?
        # if self.trace_sink: self.trace_sink.value_read(...) # Needs expr node
        return param_value.value

    def set_parameter(self, name: str, raw_value: Any, unit: Optional[str] = None):
         """Sets a parameter's value (constructs Value object). Requires definition lookup.
            Optionally overrides the unit defined in the model.
         """
         param_def = self.domain_model.parameters.get(name)
         if not param_def:
             raise RuntimeError(f"Cannot set parameter '{name}': Definition not found in domain model.")
         
         # Use the provided unit if given, otherwise fallback to definition's unit
         eenheid_to_use = unit if unit is not None else param_def.eenheid
         
         # TODO: Type check raw_value against param_def.datatype? Conversion?
         value_obj = Value(value=raw_value, datatype=param_def.datatype, eenheid=eenheid_to_use)
         self.parameters[name] = value_obj
         # TODO: Trace assignment?

    # --- Variable Handling (Rule Scope) ---

    def get_variable(self, name: str) -> Any:
        """Gets a variable's value from the current rule scope."""
        if name not in self.variables:
            raise RuntimeError(f"Variable '{name}' not defined in current scope.")
        # TODO: Trace value read?
        return self.variables[name]

    def set_variable(self, name: str, value: Any, span: Optional[ast.SourceSpan] = None):
        """Sets a variable's value in the current rule scope."""
        # TODO: Consider type checking based on rule variable definition?
        old_value = self.variables.get(name)
        self.variables[name] = value
        # TODO: Trace variable assignment? Needs more event details.
        # if self.trace_sink: self.trace_sink.variable_assignment(...)

    # --- Object Instance / Attribute / Kenmerk Handling ---

    def add_object(self, obj: RuntimeObject):
        """Adds an object instance to the context, grouped by type."""
        self.instances[obj.object_type_naam].append(obj)
        # Maybe trace object creation?

    def find_objects_by_type(self, object_type_naam: str) -> List[RuntimeObject]:
        """Finds all object instances of a specific type."""
        return self.instances.get(object_type_naam, [])

    def set_current_instance(self, instance: Optional[RuntimeObject]):
        """Sets the instance currently being processed (e.g., by a rule)."""
        self.current_instance = instance

    def get_attribute(self, instance: RuntimeObject, attr_name: str) -> Any:
        """Gets an attribute's raw value from a specific object instance."""
        attr_value = instance.attributen.get(attr_name)
        if attr_value is None:
            # Check definition? Default value? Fail for now.
            raise RuntimeError(f"Attribute '{attr_name}' not found on instance of '{instance.object_type_naam}'.")
        # TODO: Trace value read?
        return attr_value.value

    def set_attribute(self, instance: RuntimeObject, attr_name: str, raw_value: Any,
                        unit: Optional[str] = None, span: Optional[ast.SourceSpan] = None):
        """Sets an attribute's value on an instance (constructs Value object).
        Optionally overrides the unit defined in the model and provides a span for tracing.
        """
        # Find the ObjectType definition to get expected datatype and unit
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if not obj_type_def:
             raise RuntimeError(f"ObjectType '{instance.object_type_naam}' definition not found.")

        attr_def = obj_type_def.attributen.get(attr_name)
        if not attr_def:
             raise RuntimeError(f"Attribute '{attr_name}' not defined in ObjectType '{instance.object_type_naam}'.")

        # Use the provided unit if given, otherwise fallback to definition's unit
        eenheid_to_use = unit if unit is not None else attr_def.eenheid

        # TODO: Type check raw_value against attr_def.datatype? Conversion?
        datatype = attr_def.datatype

        value_obj = Value(value=raw_value, datatype=datatype, eenheid=eenheid_to_use)

        old_value_obj = instance.attributen.get(attr_name)
        old_raw_value = old_value_obj.value if old_value_obj else None

        instance.attributen[attr_name] = value_obj

        # Use the provided span for tracing if available
        if self.trace_sink:
            self.trace_sink.assignment(instance, attr_name, old_raw_value, raw_value, span)

    def get_kenmerk(self, instance: RuntimeObject, kenmerk_name: str) -> bool:
        """Gets a kenmerk's boolean state from an instance (defaults to False)."""
        # Check if kenmerk is defined for the type?
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if not obj_type_def or kenmerk_name not in obj_type_def.kenmerken:
             # Decide: error or default false? Default false seems more forgiving.
             # raise RuntimeError(f"Kenmerk '{kenmerk_name}' not defined for ObjectType '{instance.object_type_naam}'.")
             return False 
             
        # TODO: Trace value read?
        return instance.kenmerken.get(kenmerk_name, False) # Default to False if not explicitly set

    def set_kenmerk(self, instance: RuntimeObject, kenmerk_name: str, value: bool, span: Optional[ast.SourceSpan] = None):
        """Sets a kenmerk's boolean state on an instance."""
        # Check if kenmerk is defined for the type
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if not obj_type_def or kenmerk_name not in obj_type_def.kenmerken:
             raise RuntimeError(f"Cannot set Kenmerk '{kenmerk_name}': Not defined for ObjectType '{instance.object_type_naam}'.")

        old_value = instance.kenmerken.get(kenmerk_name, False)
        instance.kenmerken[kenmerk_name] = value
        
        if self.trace_sink and old_value != value: # Only trace change
            # TODO: Refine trace event for kenmerken
            self.trace_sink.assignment(instance, f"kenmerk:{kenmerk_name}", old_value, value, span)

    # --- Evaluation Helpers ('IS', 'IN') ---

    def check_is(self, instance: RuntimeObject, kenmerk_or_type: str) -> bool:
        """Handles the 'IS' operator for type or kenmerk checks."""
        if instance is None:
            raise RuntimeError("'IS' operator requires a valid object instance on the left.")
            
        # Is it a defined kenmerk for this object type?
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if obj_type_def and kenmerk_or_type in obj_type_def.kenmerken:
            return self.get_kenmerk(instance, kenmerk_or_type)
        
        # Is it a type check? (Simple name comparison for now)
        # TODO: Handle inheritance / subtyping if added later
        elif kenmerk_or_type == instance.object_type_naam:
             return True
        # TODO: Check against Domein types if applicable?
             
        else:
             # Assume it was intended as a kenmerk, but wasn't defined/set
             # raise RuntimeError(f"Right side of 'IS' ('{kenmerk_or_type}') is not a known kenmerk or the type name for instance of '{instance.object_type_naam}'.")
             return False # Treat undefined kenmerken as false for 'IS' check

    def check_in(self, value: Any, collection_expr: Any) -> bool:
        """Handles the 'IN' operator for membership checks (basic implementation)."""
        # The right side needs to be evaluated to a collection (list, set, range?)
        # The 'collection_expr' here is likely an AST node that needs evaluation,
        # this method might need restructuring or be called from the evaluator differently.
        # Assuming 'collection' is already the evaluated Python collection:
        collection = collection_expr # Placeholder - Needs actual evaluation result
        
        if isinstance(collection, (list, set, tuple, range)):
            return value in collection
        elif isinstance(collection, dict):
             return value in collection # Check keys by default? Or values? Assume keys.
        # TODO: Handle Domein enumerations?
        else:
            raise RuntimeError(f"'IN' operator requires a collection (list, set, dict keys, range) on the right, got {type(collection)}.")


# --- Helper for defaultdict ---
from collections import defaultdict

# Example Usage (needs update):
# domain = ast.DomainModel(...) # Load parsed model
# context = RuntimeContext(domain_model=domain)
# context.set_parameter("volwassenleeftijd", 18) # Needs definition lookup
# p1 = context.add_object(RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p1"))
# context.set_attribute(p1, "leeftijd", 15) # Needs definition lookup
