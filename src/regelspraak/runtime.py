"""Runtime representation of RegelSpraak concepts during evaluation."""

from dataclasses import dataclass, field
from typing import Any, Dict, Optional, List, TYPE_CHECKING, Union, Tuple, Set
from decimal import Decimal
from collections import defaultdict

# Import AST and Error types using relative imports consistent with the project structure
from . import ast
from .errors import RuntimeError
from .units import CompositeUnit, UnitRegistry
from datetime import datetime

if TYPE_CHECKING:
    # Use forward reference for type hint to avoid circular import
    from .engine import TraceSink 

@dataclass(frozen=True)
class Value:
    """Represents a runtime value with its type and unit."""
    value: Any # The actual Python value (e.g., int, float, str, bool, Decimal)
    datatype: str # RegelSpraak datatype (e.g., "Numeriek", "Tekst", "Boolean")
    unit: Optional[Union[str, CompositeUnit]] = None # Unit as string or CompositeUnit
    
    def to_decimal(self) -> Decimal:
        """Convert numeric value to Decimal for precise arithmetic."""
        if not any(self.datatype.startswith(t) for t in ["Numeriek", "Percentage", "Bedrag"]):
            raise RuntimeError(f"Cannot convert {self.datatype} to Decimal")
        
        if isinstance(self.value, Decimal):
            return self.value
        elif isinstance(self.value, (int, float)):
            return Decimal(str(self.value))
        elif isinstance(self.value, str):
            # Handle string representations of numbers
            try:
                return Decimal(self.value)
            except:
                raise RuntimeError(f"Cannot convert string '{self.value}' to Decimal")
        else:
            raise RuntimeError(f"Cannot convert {type(self.value)} to Decimal")
    
    def get_composite_unit(self, registry: UnitRegistry) -> CompositeUnit:
        """Get the unit as a CompositeUnit object."""
        if isinstance(self.unit, CompositeUnit):
            return self.unit
        elif isinstance(self.unit, str):
            return registry.parse_unit_string(self.unit)
        else:
            return CompositeUnit(numerator=[], denominator=[])


@dataclass
class TimelineValue:
    """Represents a timeline-aware value that changes over time.
    
    A timeline value consists of a sequence of periods, each with a constant value.
    The timeline's granularity (dag/maand/jaar) determines when values can change.
    """
    timeline: ast.Timeline  # Contains periods with Value objects
    
    def get_value_at(self, date: datetime) -> Optional[Value]:
        """Get the value that applies at a specific date.
        
        Returns None if no period covers the given date.
        """
        for period in self.timeline.periods:
            # Check if date falls within this period (inclusive start, exclusive end)
            if period.start_date <= date < period.end_date:
                return period.value
        return None
    
    def get_periods_between(self, start_date: datetime, end_date: datetime) -> List[ast.Period]:
        """Get all periods that overlap with the given date range."""
        overlapping = []
        for period in self.timeline.periods:
            # Check for overlap
            if period.start_date < end_date and period.end_date > start_date:
                overlapping.append(period)
        return overlapping
    
    def add_period(self, period: ast.Period) -> None:
        """Add a new period to the timeline, maintaining chronological order."""
        # Insert in the correct position to maintain order
        inserted = False
        for i, existing in enumerate(self.timeline.periods):
            if period.start_date < existing.start_date:
                self.timeline.periods.insert(i, period)
                inserted = True
                break
        if not inserted:
            self.timeline.periods.append(period)


@dataclass(frozen=True)
class DimensionCoordinate:
    """Coordinates for accessing multi-dimensional values."""
    labels: Dict[str, str]  # {dimension_name: label_value}
    
    def __hash__(self):
        """Make coordinates hashable for use as dict keys."""
        return hash(tuple(sorted(self.labels.items())))


@dataclass(frozen=True)
class DimensionedValue:
    """Container for values with dimension coordinates."""
    coordinates: DimensionCoordinate
    value: Value


@dataclass
class RuntimeObject:
    """Represents an instance of an ObjectType in the runtime world."""
    object_type_naam: str
    # Attributes store their current Value (for non-dimensioned attributes)
    attributen: Dict[str, Value] = field(default_factory=dict)
    # Timeline attributes store TimelineValue objects
    timeline_attributen: Dict[str, TimelineValue] = field(default_factory=dict)
    # Dimensioned attributes store lists of DimensionedValue
    dimensioned_attributen: Dict[str, List[DimensionedValue]] = field(default_factory=dict)
    # Kenmerken store their current boolean state (True if the object has the kenmerk)
    kenmerken: Dict[str, bool] = field(default_factory=dict)
    # Timeline kenmerken store TimelineValue objects with boolean values
    timeline_kenmerken: Dict[str, TimelineValue] = field(default_factory=dict)
    # Unique identifier for the object instance (optional but helpful)
    instance_id: Optional[str] = None # Could be auto-generated or assigned
    
    def get_dimensioned_attribute(self, attr_name: str, coordinates: DimensionCoordinate) -> Optional[Value]:
        """Get attribute value at specific dimension coordinates."""
        attr_storage = self.dimensioned_attributen.get(attr_name, [])
        for dv in attr_storage:
            if dv.coordinates.labels == coordinates.labels:
                return dv.value
        return None
    
    def set_dimensioned_attribute(self, attr_name: str, coordinates: DimensionCoordinate, value: Value):
        """Set attribute value at specific dimension coordinates."""
        if attr_name not in self.dimensioned_attributen:
            self.dimensioned_attributen[attr_name] = []
        
        attr_storage = self.dimensioned_attributen[attr_name]
        # Update existing or append new
        for i, dv in enumerate(attr_storage):
            if dv.coordinates.labels == coordinates.labels:
                attr_storage[i] = DimensionedValue(coordinates, value)
                return
        attr_storage.append(DimensionedValue(coordinates, value))
    
    def get_timeline_attribute(self, attr_name: str, date: datetime) -> Optional[Value]:
        """Get attribute value at a specific date from its timeline."""
        timeline_value = self.timeline_attributen.get(attr_name)
        if timeline_value:
            return timeline_value.get_value_at(date)
        return None
    
    def set_timeline_attribute(self, attr_name: str, timeline_value: TimelineValue):
        """Set a timeline value for an attribute."""
        self.timeline_attributen[attr_name] = timeline_value

@dataclass
class Relationship:
    """Represents a relationship instance between two objects."""
    feittype_naam: str  # The type of relationship
    subject: RuntimeObject  # The subject of the relationship
    object: RuntimeObject  # The object of the relationship
    preposition: str  # "MET" or "TOT"
    # Additional metadata could be added here

@dataclass
class RuntimeContext:
    """Container for the runtime state during execution."""
    domain_model: ast.DomainModel # Link to the parsed model for definitions
    trace_sink: Optional['TraceSink'] = None # Optional sink for execution events
    unit_registry: UnitRegistry = field(default_factory=UnitRegistry) # Unit system registry

    # Stores parameter names mapped to their runtime Value
    parameters: Dict[str, Value] = field(default_factory=dict)
    # Stores timeline parameters
    timeline_parameters: Dict[str, TimelineValue] = field(default_factory=dict)
    # Current evaluation date for timeline lookups
    evaluation_date: Optional[datetime] = None
    # Stores object instances, keyed by object type name for easier lookup
    instances: Dict[str, List[RuntimeObject]] = field(default_factory=lambda: defaultdict(list))
    # Stores variables within the current rule execution scope  
    variables: Dict[str, Value] = field(default_factory=dict) # Store Values, not raw values
    # Tracks the object instance currently being evaluated (e.g., by a rule)
    current_instance: Optional[RuntimeObject] = None
    # Stores relationships between objects
    relationships: List[Relationship] = field(default_factory=list)
    # Rule execution tracking for regel status conditions
    executed_rules: Set[str] = field(default_factory=set)  # Rules that have been executed (fired)
    inconsistent_rules: Set[str] = field(default_factory=set)  # Consistency rules that found inconsistencies

    # --- Rule Status Methods ---
    
    def is_rule_executed(self, rule_name: str) -> bool:
        """Check if a rule has been executed (fired)."""
        return rule_name in self.executed_rules
    
    def is_rule_inconsistent(self, rule_name: str) -> bool:
        """Check if a consistency rule found an inconsistency."""
        return rule_name in self.inconsistent_rules
    
    def mark_rule_executed(self, rule_name: str):
        """Mark a rule as executed."""
        self.executed_rules.add(rule_name)
    
    def mark_rule_inconsistent(self, rule_name: str):
        """Mark a consistency rule as inconsistent."""
        self.inconsistent_rules.add(rule_name)

    # --- Parameter Handling ---

    def add_parameter(self, name: str, value: Value):
        """Adds or updates a parameter Value in the context."""
        # TODO: Validate against parameter definition in domain_model?
        self.parameters[name] = value
        # Maybe trace parameter loading?

    def get_parameter(self, name: str) -> Value:
        """Retrieves a parameter's Value from the context.
        
        If the parameter has a timeline and evaluation_date is set,
        returns the value at that date. Otherwise returns the non-timeline value.
        """
        # First check if this is a timeline parameter
        timeline_value = self.timeline_parameters.get(name)
        if timeline_value and self.evaluation_date:
            # Get value at the evaluation date
            param_value = timeline_value.get_value_at(self.evaluation_date)
            if param_value is None:
                # Per specification: empty timeline values are treated as 0 for numeric types
                # Return an empty value instead of raising an error
                param_def = self.domain_model.parameters.get(name)
                if param_def:
                    if param_def.datatype.startswith(("Numeriek", "Bedrag")):
                        param_value = Value(value=0, datatype=param_def.datatype, unit=param_def.eenheid)
                    else:
                        # For non-numeric types, return appropriate empty value
                        param_value = Value(value="", datatype=param_def.datatype, unit=param_def.eenheid)
                else:
                    raise RuntimeError(f"Timeline parameter '{name}' has no value at date {self.evaluation_date}")
        else:
            # Fall back to non-timeline parameter
            param_value = self.parameters.get(name)
            if param_value is None:
                # Check if it exists as timeline but no evaluation date set
                if name in self.timeline_parameters:
                    raise RuntimeError(f"Timeline parameter '{name}' requires evaluation_date to be set")
                raise RuntimeError(f"Parameter '{name}' not found in runtime context.")
        
        # Trace parameter read
        if self.trace_sink:
            self.trace_sink.parameter_read(
                name=name, 
                value=param_value.value,
                instance_id=self.current_instance.instance_id if self.current_instance else None
            )
            
        return param_value

    def set_parameter(self, name: str, raw_value: Any, unit: Optional[str] = None):
         """Sets a parameter's value (constructs Value object). Requires definition lookup.
            Optionally overrides the unit defined in the model.
         """
         param_def = self.domain_model.parameters.get(name)
         if not param_def:
             raise RuntimeError(f"Cannot set parameter '{name}': Definition not found in domain model.")
         
         # Check if raw_value is already a Value object
         if isinstance(raw_value, Value):
             # Use the existing Value object, but validate/override datatype and unit
             value_obj = raw_value
             # TODO: Validate that value_obj.datatype matches param_def.datatype?
         else:
             # Use the provided unit if given, otherwise fallback to definition's unit
             unit_to_use = unit if unit is not None else param_def.eenheid
             
             # TODO: Type check raw_value against param_def.datatype? Conversion?
             value_obj = Value(value=raw_value, datatype=param_def.datatype, unit=unit_to_use)
         
         self.parameters[name] = value_obj
         # TODO: Trace assignment?
    
    def set_timeline_parameter(self, name: str, timeline_value: TimelineValue):
        """Sets a timeline parameter value."""
        param_def = self.domain_model.parameters.get(name)
        if not param_def:
            raise RuntimeError(f"Cannot set timeline parameter '{name}': Definition not found in domain model.")
        if not param_def.timeline:
            raise RuntimeError(f"Parameter '{name}' is not defined as a timeline parameter")
        
        self.timeline_parameters[name] = timeline_value

    # --- Rule Execution Tracking (for regel status conditions) ---

    def mark_rule_executed(self, regel_naam: str):
        """Mark a rule as having been executed (fired)."""
        self.executed_rules.add(regel_naam)

    def mark_rule_inconsistent(self, regel_naam: str):
        """Mark a consistency rule as having found an inconsistency."""
        self.inconsistent_rules.add(regel_naam)

    def is_rule_executed(self, regel_naam: str) -> bool:
        """Check if a rule has been executed (fired)."""
        return regel_naam in self.executed_rules

    def is_rule_inconsistent(self, regel_naam: str) -> bool:
        """Check if a consistency rule found an inconsistency."""
        return regel_naam in self.inconsistent_rules

    # --- Variable Handling (Rule Scope) ---

    def get_variable(self, name: str) -> Value:
        """Gets a variable's Value from the current rule scope."""
        if name not in self.variables:
            raise RuntimeError(f"Variable '{name}' not defined in current scope.")
        
        value = self.variables[name]
        
        # Trace the variable read
        if self.trace_sink:
            self.trace_sink.variable_read(
                name=name,
                value=value.value if isinstance(value, Value) else value,
                instance_id=self.current_instance.instance_id if self.current_instance else None
            )
            
        return value

    def set_variable(self, name: str, value: Value, span: Optional[ast.SourceSpan] = None):
        """Sets a variable's Value in the current rule scope."""
        # TODO: Consider type checking based on rule variable definition?
        old_value = self.variables.get(name)
        self.variables[name] = value
        
        # Trace the variable assignment
        if self.trace_sink:
            self.trace_sink.variable_write(
                name=name,
                old_value=old_value.value if isinstance(old_value, Value) else old_value,
                new_value=value.value if isinstance(value, Value) else value,
                span=span,
                instance_id=self.current_instance.instance_id if self.current_instance else None
            )

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

    def get_attribute(self, instance: RuntimeObject, attr_name: str) -> Value:
        """Gets an attribute's Value from a specific object instance.
        
        If the attribute has a timeline and evaluation_date is set,
        returns the value at that date. Otherwise returns the non-timeline value.
        """
        # Check if this attribute has a timeline in the definition
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if obj_type_def:
            attr_def = obj_type_def.attributen.get(attr_name)
            if attr_def and attr_def.timeline and self.evaluation_date:
                # This is a timeline attribute - get from timeline storage
                attr_value = instance.get_timeline_attribute(attr_name, self.evaluation_date)
                if attr_value is None:
                    # Per specification: empty timeline values are treated as 0 for numeric types
                    # Return an empty value instead of raising an error
                    if attr_def.datatype.startswith(("Numeriek", "Bedrag")):
                        attr_value = Value(value=0, datatype=attr_def.datatype, unit=attr_def.eenheid)
                    else:
                        # For non-numeric types, return appropriate empty value
                        attr_value = Value(value="", datatype=attr_def.datatype, unit=attr_def.eenheid)
            else:
                # Regular attribute
                attr_value = instance.attributen.get(attr_name)
        else:
            # No definition found, try regular attribute
            attr_value = instance.attributen.get(attr_name)
        
        if attr_value is None:
            # Check if it's a timeline attribute but no evaluation date
            if attr_name in instance.timeline_attributen:
                raise RuntimeError(f"Timeline attribute '{attr_name}' requires evaluation_date to be set")
            raise RuntimeError(f"Attribute '{attr_name}' not found on instance of '{instance.object_type_naam}'.")
        
        # Trace attribute read
        if self.trace_sink:
            self.trace_sink.attribute_read(
                instance=instance,
                attr_name=attr_name,
                value=attr_value.value
            )
            
        return attr_value

    def set_attribute(self, instance: RuntimeObject, attr_name: str, value: Union[Value, Any],
                        unit: Optional[str] = None, span: Optional[ast.SourceSpan] = None):
        """Sets an attribute's value on an instance.
        Can accept either a Value object or a raw value (which will be wrapped in a Value).
        Optionally overrides the unit defined in the model and provides a span for tracing.
        """
        # Find the ObjectType definition to get expected datatype and unit
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if not obj_type_def:
             raise RuntimeError(f"ObjectType '{instance.object_type_naam}' definition not found.")

        attr_def = obj_type_def.attributen.get(attr_name)
        if not attr_def:
             raise RuntimeError(f"Attribute '{attr_name}' not defined in ObjectType '{instance.object_type_naam}'.")

        # If value is already a Value object, use it; otherwise wrap it
        if isinstance(value, Value):
            value_obj = value
            # TODO: Validate that value_obj.datatype matches attr_def.datatype?
        else:
            # Use the provided unit if given, otherwise fallback to definition's unit
            unit_to_use = unit if unit is not None else attr_def.eenheid
            # TODO: Type check raw_value against attr_def.datatype? Conversion?
            
            # Check if this attribute is an object reference
            if attr_def.is_object_ref:
                # Value should be a RuntimeObject
                if isinstance(value, RuntimeObject):
                    # Store the object reference with special datatype
                    value_obj = Value(value=value, datatype="ObjectReference", unit=None)
                else:
                    raise RuntimeError(f"Attribute '{attr_name}' is an object reference but value is not a RuntimeObject")
            else:
                # Regular attribute
                datatype = attr_def.datatype
                value_obj = Value(value=value, datatype=datatype, unit=unit_to_use)

        old_value_obj = instance.attributen.get(attr_name)
        old_raw_value = old_value_obj.value if old_value_obj else None

        instance.attributen[attr_name] = value_obj

        # Use the provided span for tracing if available
        if self.trace_sink:
            self.trace_sink.assignment(instance, attr_name, old_raw_value, value_obj.value, span)
    
    def set_timeline_attribute(self, instance: RuntimeObject, attr_name: str, 
                              timeline_value: TimelineValue, span: Optional[ast.SourceSpan] = None):
        """Sets a timeline attribute value on an instance."""
        # Find the ObjectType definition to validate
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if not obj_type_def:
            raise RuntimeError(f"ObjectType '{instance.object_type_naam}' definition not found.")
        
        attr_def = obj_type_def.attributen.get(attr_name)
        if not attr_def:
            raise RuntimeError(f"Attribute '{attr_name}' not defined in ObjectType '{instance.object_type_naam}'.")
        
        if not attr_def.timeline:
            raise RuntimeError(f"Attribute '{attr_name}' is not defined as a timeline attribute")
        
        # Set the timeline value
        instance.set_timeline_attribute(attr_name, timeline_value)
        
        # Trace if available
        if self.trace_sink and hasattr(self.trace_sink, 'timeline_set'):
            self.trace_sink.timeline_set(instance, attr_name, timeline_value, span)

    def get_dimensioned_attribute(self, instance: RuntimeObject, attr_name: str, 
                                 coordinates: DimensionCoordinate) -> Value:
        """Gets an attribute's value at specific dimension coordinates."""
        # Find the ObjectType definition to check if attribute is dimensioned
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if not obj_type_def:
            raise RuntimeError(f"ObjectType '{instance.object_type_naam}' definition not found.")
        
        attr_def = obj_type_def.attributen.get(attr_name)
        if not attr_def:
            raise RuntimeError(f"Attribute '{attr_name}' not defined in ObjectType '{instance.object_type_naam}'.")
        
        # Check if attribute is dimensioned
        if not hasattr(attr_def, 'dimensions') or not attr_def.dimensions:
            raise RuntimeError(f"Attribute '{attr_name}' is not dimensioned.")
        
        # Validate that all required dimensions are provided
        for dim_name in attr_def.dimensions:
            if dim_name not in coordinates.labels:
                raise RuntimeError(f"Missing dimension '{dim_name}' in coordinates for attribute '{attr_name}'.")
        
        # Get the value from the instance
        value = instance.get_dimensioned_attribute(attr_name, coordinates)
        if value is None:
            raise RuntimeError(f"No value found for attribute '{attr_name}' at coordinates {coordinates.labels}.")
        
        # Trace attribute read
        if self.trace_sink:
            self.trace_sink.attribute_read(
                instance=instance,
                attr_name=f"{attr_name}[{coordinates.labels}]",
                value=value.value
            )
        
        return value

    def set_dimensioned_attribute(self, instance: RuntimeObject, attr_name: str,
                                coordinates: DimensionCoordinate, value: Union[Value, Any],
                                unit: Optional[str] = None, span: Optional[ast.SourceSpan] = None):
        """Sets an attribute's value at specific dimension coordinates."""
        # Find the ObjectType definition to get expected datatype and unit
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if not obj_type_def:
            raise RuntimeError(f"ObjectType '{instance.object_type_naam}' definition not found.")
        
        attr_def = obj_type_def.attributen.get(attr_name)
        if not attr_def:
            raise RuntimeError(f"Attribute '{attr_name}' not defined in ObjectType '{instance.object_type_naam}'.")
        
        # Check if attribute is dimensioned
        if not hasattr(attr_def, 'dimensions') or not attr_def.dimensions:
            raise RuntimeError(f"Attribute '{attr_name}' is not dimensioned.")
        
        # Validate that all required dimensions are provided
        for dim_name in attr_def.dimensions:
            if dim_name not in coordinates.labels:
                raise RuntimeError(f"Missing dimension '{dim_name}' in coordinates for attribute '{attr_name}'.")
        
        # If value is already a Value object, use it; otherwise wrap it
        if isinstance(value, Value):
            value_obj = value
        else:
            # Use the provided unit if given, otherwise fallback to definition's unit
            unit_to_use = unit if unit is not None else attr_def.eenheid
            datatype = attr_def.datatype
            value_obj = Value(value=value, datatype=datatype, unit=unit_to_use)
        
        # Get old value for tracing
        old_value = instance.get_dimensioned_attribute(attr_name, coordinates)
        old_raw_value = old_value.value if old_value else None
        
        # Set the new value
        instance.set_dimensioned_attribute(attr_name, coordinates, value_obj)
        
        # Use the provided span for tracing if available
        if self.trace_sink:
            self.trace_sink.assignment(
                instance, 
                f"{attr_name}[{coordinates.labels}]", 
                old_raw_value, 
                value_obj.value, 
                span
            )

    def get_kenmerk(self, instance: RuntimeObject, kenmerk_name: str) -> bool:
        """Gets a kenmerk's boolean state from an instance (defaults to False)."""
        # Check if kenmerk is defined for the type?
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if not obj_type_def or kenmerk_name not in obj_type_def.kenmerken:
             # Decide: error or default false? Default false seems more forgiving.
             # raise RuntimeError(f"Kenmerk '{kenmerk_name}' not defined for ObjectType '{instance.object_type_naam}'.")
             value = False
        else:
             value = instance.kenmerken.get(kenmerk_name, False) # Default to False if not explicitly set
        
        # Trace kenmerk read
        if self.trace_sink:
            self.trace_sink.kenmerk_read(
                instance=instance,
                kenmerk_name=kenmerk_name,
                value=value
            )
        
        return value

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
    
    def set_timeline_kenmerk(self, instance: RuntimeObject, kenmerk_name: str, timeline_value: TimelineValue, span: Optional[ast.SourceSpan] = None):
        """Sets a timeline kenmerk on an instance."""
        # Check if kenmerk is defined for the type with timeline
        obj_type_def = self.domain_model.objecttypes.get(instance.object_type_naam)
        if not obj_type_def or kenmerk_name not in obj_type_def.kenmerken:
            raise RuntimeError(f"Cannot set timeline Kenmerk '{kenmerk_name}': Not defined for ObjectType '{instance.object_type_naam}'.")
        
        kenmerk_def = obj_type_def.kenmerken[kenmerk_name]
        if not kenmerk_def.tijdlijn:
            raise RuntimeError(f"Cannot set timeline for Kenmerk '{kenmerk_name}': Not defined with timeline.")
        
        # Store the timeline kenmerk
        old_value = instance.timeline_kenmerken.get(kenmerk_name)
        instance.timeline_kenmerken[kenmerk_name] = timeline_value
        
        if self.trace_sink and old_value != timeline_value:
            self.trace_sink.assignment(instance, f"timeline_kenmerk:{kenmerk_name}", old_value, timeline_value, span)
    
    def get_timeline_kenmerk(self, instance: RuntimeObject, kenmerk_name: str, evaluation_date: Optional[datetime] = None) -> Optional[Value]:
        """Gets a timeline kenmerk's value at a specific date."""
        if kenmerk_name in instance.timeline_kenmerken:
            timeline_val = instance.timeline_kenmerken[kenmerk_name]
            if timeline_val and timeline_val.timeline:
                date_to_use = evaluation_date or self.evaluation_date or datetime.now()
                return timeline_val.timeline.get_value_at(date_to_use)
        return None

    # --- Data Loading ---
    
    def load_from_dict(self, data: Dict[str, Any]) -> None:
        """Load parameters, instances, and relationships from a dictionary.
        
        This centralizes all data loading logic that was previously spread
        across the CLI and other modules.
        """
        # Load Parameters
        if "parameters" in data and isinstance(data["parameters"], dict):
            for param_name, raw_value in data["parameters"].items():
                param_def = self.domain_model.parameters.get(param_name)
                if param_def:
                    param_value = Value(value=raw_value, datatype=param_def.datatype, unit=param_def.eenheid)
                    self.add_parameter(param_name, param_value)
                # Silently skip unknown parameters
        
        # Load Timeline Parameters
        if "timeline_parameters" in data and isinstance(data["timeline_parameters"], dict):
            for param_name, timeline_data in data["timeline_parameters"].items():
                param_def = self.domain_model.parameters.get(param_name)
                if param_def and param_def.timeline:
                    # Create timeline from the data
                    granularity = timeline_data.get("granularity", param_def.timeline)
                    periods_data = timeline_data.get("periods", [])
                    
                    # Build periods list
                    periods = []
                    for period_data in periods_data:
                        # Parse dates
                        from dateutil import parser as date_parser
                        start_date = date_parser.parse(period_data["from"])
                        end_date = date_parser.parse(period_data["to"])
                        
                        # Create Value object for this period
                        raw_value = period_data["value"]
                        unit = period_data.get("unit", param_def.eenheid)
                        value = Value(value=raw_value, datatype=param_def.datatype, unit=unit)
                        
                        # Create Period
                        period = ast.Period(start_date=start_date, end_date=end_date, value=value)
                        periods.append(period)
                    
                    # Create Timeline and TimelineValue
                    timeline = ast.Timeline(periods=periods, granularity=granularity)
                    timeline_value = TimelineValue(timeline=timeline)
                    
                    # Set the timeline parameter
                    self.set_timeline_parameter(param_name, timeline_value)
        
        # Load Instances
        if "instances" in data and isinstance(data["instances"], list):
            for instance_data in data["instances"]:
                if not isinstance(instance_data, dict):
                    raise RuntimeError(f"Invalid instance data format: Expected dictionary, got {type(instance_data).__name__}")
                if "object_type_naam" not in instance_data:
                    raise RuntimeError(f"Invalid instance data: Missing 'object_type_naam' field")
                
                obj_type_name = instance_data["object_type_naam"]
                obj_type_def = self.domain_model.objecttypes.get(obj_type_name)
                if not obj_type_def:
                    raise RuntimeError(f"Unknown object type: {obj_type_name}")
                
                # Create instance
                instance_id = instance_data.get("instance_id", None)
                new_instance = RuntimeObject(object_type_naam=obj_type_name, instance_id=instance_id)
                self.add_object(new_instance)
                
                # Set attributes
                if "attributen" in instance_data and isinstance(instance_data["attributen"], dict):
                    for attr_name, raw_value in instance_data["attributen"].items():
                        attr_def = obj_type_def.attributen.get(attr_name)
                        if attr_def:
                            self.set_attribute(new_instance, attr_name, raw_value)
                        # Silently skip unknown attributes
                
                # Set timeline attributes
                if "timeline_attributen" in instance_data and isinstance(instance_data["timeline_attributen"], dict):
                    for attr_name, timeline_data in instance_data["timeline_attributen"].items():
                        attr_def = obj_type_def.attributen.get(attr_name)
                        if attr_def and attr_def.timeline:
                            # Create timeline from the data
                            granularity = timeline_data.get("granularity", attr_def.timeline)
                            periods_data = timeline_data.get("periods", [])
                            
                            # Build periods list
                            periods = []
                            for period_data in periods_data:
                                # Parse dates
                                from dateutil import parser as date_parser
                                start_date = date_parser.parse(period_data["from"])
                                end_date = date_parser.parse(period_data["to"])
                                
                                # Create Value object for this period
                                raw_value = period_data["value"]
                                unit = period_data.get("unit", attr_def.eenheid)
                                value = Value(value=raw_value, datatype=attr_def.datatype, unit=unit)
                                
                                # Create Period
                                period = ast.Period(start_date=start_date, end_date=end_date, value=value)
                                periods.append(period)
                            
                            # Create Timeline and TimelineValue
                            timeline = ast.Timeline(periods=periods, granularity=granularity)
                            timeline_value = TimelineValue(timeline=timeline)
                            
                            # Set the timeline attribute
                            self.set_timeline_attribute(new_instance, attr_name, timeline_value)
        
        # Load Relationships
        if "relationships" in data and isinstance(data["relationships"], list):
            # First, we need to build a map of instance_id -> RuntimeObject
            instance_map = {}
            for obj_type, instances in self.instances.items():
                for instance in instances:
                    instance_map[instance.instance_id] = instance
            
            for rel_data in data["relationships"]:
                if not isinstance(rel_data, dict):
                    continue
                
                feittype = rel_data.get("feittype")
                subject_id = rel_data.get("subject")
                object_id = rel_data.get("object")
                
                if not all([feittype, subject_id, object_id]):
                    continue  # Skip incomplete relationships
                
                # Check if feittype exists
                if feittype not in self.domain_model.feittypen:
                    continue
                
                # Find instances
                subject_obj = instance_map.get(subject_id)
                object_obj = instance_map.get(object_id)
                
                if subject_obj and object_obj:
                    self.add_relationship(feittype, subject_obj, object_obj)
    
    # --- Relationship Handling ---

    def add_relationship(self, feittype_naam: str, subject: RuntimeObject, 
                        object: RuntimeObject, preposition: str = "MET") -> Relationship:
        """Creates and stores a relationship between two objects."""
        relationship = Relationship(
            feittype_naam=feittype_naam,
            subject=subject,
            object=object,
            preposition=preposition
        )
        self.relationships.append(relationship)
        
        # Trace relationship creation if trace sink is available
        if self.trace_sink and hasattr(self.trace_sink, 'relationship_created'):
            self.trace_sink.relationship_created(relationship)
            
        return relationship
    
    def find_relationships(self, subject: Optional[RuntimeObject] = None,
                          object: Optional[RuntimeObject] = None,
                          feittype_naam: Optional[str] = None) -> List[Relationship]:
        """Find relationships matching the given criteria."""
        results = []
        for rel in self.relationships:
            if subject and rel.subject != subject:
                continue
            if object and rel.object != object:
                continue
            if feittype_naam and rel.feittype_naam != feittype_naam:
                continue
            results.append(rel)
        return results
    
    def get_related_objects(self, subject: RuntimeObject, feittype_naam: str,
                           as_subject: bool = True) -> List[RuntimeObject]:
        """Get objects related to the given subject via the specified feittype.
        
        Args:
            subject: The object to find relationships for
            feittype_naam: The type of relationship
            as_subject: If True, find relationships where subject is the subject.
                       If False, find relationships where subject is the object.
        """
        related = []
        for rel in self.relationships:
            if rel.feittype_naam != feittype_naam:
                continue
            if as_subject and rel.subject == subject:
                related.append(rel.object)
            elif not as_subject and rel.object == subject:
                related.append(rel.subject)
        return related

    # --- Evaluation Helpers ('IS', 'IN') ---

    def get_kenmerken_for_type(self, object_type_naam: str) -> Set[str]:
        """Get all defined kenmerken for an object type."""
        obj_type = self.domain_model.objecttypes.get(object_type_naam)
        if not obj_type:
            return set()
        return set(obj_type.kenmerken.keys())

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
