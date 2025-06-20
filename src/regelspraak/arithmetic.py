"""Unit-aware arithmetic operations for RegelSpraak.

Implements arithmetic operations according to the RegelSpraak v2.1.0 specification,
including unit checking, conversions, and decimal handling.
"""

from decimal import Decimal, ROUND_DOWN, ROUND_HALF_UP
from typing import Union, Optional, Tuple
from fractions import Fraction

from .runtime import Value
from .units import UnitRegistry, CompositeUnit
from .errors import RuntimeError


class UnitArithmetic:
    """Handles unit-aware arithmetic operations."""
    
    def __init__(self, registry: UnitRegistry):
        self.registry = registry
    
    def _ensure_decimal(self, value: Value) -> Decimal:
        """Convert a Value to Decimal for arithmetic."""
        return value.to_decimal()
    
    def _get_decimal_places(self, decimal: Decimal) -> int:
        """Get the number of decimal places in a Decimal."""
        # Convert to string and find decimal places
        str_val = str(decimal)
        if '.' in str_val:
            return len(str_val.split('.')[1])
        return 0
    
    def _check_units_compatible(self, left: Value, right: Value, operation: str) -> bool:
        """Check if units are compatible for addition/subtraction."""
        if left.unit == right.unit:
            return True
        
        # Check if both units are in the same system and convertible
        if isinstance(left.unit, str) and isinstance(right.unit, str):
            left_system = self.registry.find_unit_system(left.unit)
            right_system = self.registry.find_unit_system(right.unit)
            
            if left_system and right_system and left_system == right_system:
                return left_system.can_convert(left.unit, right.unit)
        
        return False
    
    def _convert_to_unit(self, value: Value, target_unit: str) -> Value:
        """Convert a value to a different unit in the same system."""
        if value.unit == target_unit:
            return value
        
        if not isinstance(value.unit, str):
            raise RuntimeError(f"Cannot convert composite unit to '{target_unit}'")
        
        system = self.registry.find_unit_system(value.unit)
        if not system:
            raise RuntimeError(f"Unit system not found for unit '{value.unit}'")
        
        converted = system.convert(value.to_decimal(), value.unit, target_unit)
        return Value(value=converted, datatype=value.datatype, unit=target_unit)
    
    def add(self, left: Value, right: Value) -> Value:
        """Add two values with unit checking."""
        # Type checking
        if left.datatype not in ["Numeriek", "Percentage", "Bedrag"]:
            raise RuntimeError(f"Cannot add {left.datatype} values")
        if right.datatype not in ["Numeriek", "Percentage", "Bedrag"]:
            raise RuntimeError(f"Cannot add {right.datatype} values")
        
        # Handle empty values (treat as 0)
        left_dec = self._ensure_decimal(left) if left.value is not None else Decimal('0')
        right_dec = self._ensure_decimal(right) if right.value is not None else Decimal('0')
        
        # Unit checking and conversion
        if not self._check_units_compatible(left, right, "addition"):
            raise RuntimeError(f"Cannot add values with incompatible units: '{left.unit}' and '{right.unit}'")
        
        # Convert right to left's unit if needed
        if left.unit != right.unit and left.unit and right.unit:
            right_converted = self._convert_to_unit(right, left.unit)
            right_dec = right_converted.to_decimal()
        
        # Perform addition
        result_dec = left_dec + right_dec
        
        # Result has the highest number of decimal places
        left_places = self._get_decimal_places(left_dec)
        right_places = self._get_decimal_places(right_dec)
        max_places = max(left_places, right_places)
        
        # Quantize to maintain decimal places
        if max_places > 0:
            quantizer = Decimal('0.1') ** max_places
            result_dec = result_dec.quantize(quantizer)
        
        return Value(value=result_dec, datatype=left.datatype, unit=left.unit)
    
    def subtract(self, left: Value, right: Value) -> Value:
        """Subtract two values with unit checking."""
        # Type checking
        if left.datatype not in ["Numeriek", "Percentage", "Bedrag"]:
            raise RuntimeError(f"Cannot subtract {left.datatype} values")
        if right.datatype not in ["Numeriek", "Percentage", "Bedrag"]:
            raise RuntimeError(f"Cannot subtract {right.datatype} values")
        
        # Handle empty values (treat as 0)
        left_dec = self._ensure_decimal(left) if left.value is not None else Decimal('0')
        right_dec = self._ensure_decimal(right) if right.value is not None else Decimal('0')
        
        # Unit checking and conversion
        if not self._check_units_compatible(left, right, "subtraction"):
            raise RuntimeError(f"Cannot subtract values with incompatible units: '{left.unit}' and '{right.unit}'")
        
        # Convert right to left's unit if needed
        if left.unit != right.unit and left.unit and right.unit:
            right_converted = self._convert_to_unit(right, left.unit)
            right_dec = right_converted.to_decimal()
        
        # Perform subtraction
        result_dec = left_dec - right_dec
        
        # Result has the highest number of decimal places
        left_places = self._get_decimal_places(left_dec)
        right_places = self._get_decimal_places(right_dec)
        max_places = max(left_places, right_places)
        
        # Quantize to maintain decimal places
        if max_places > 0:
            quantizer = Decimal('0.1') ** max_places
            result_dec = result_dec.quantize(quantizer)
        
        return Value(value=result_dec, datatype=left.datatype, unit=left.unit)
    
    def multiply(self, left: Value, right: Value) -> Value:
        """Multiply two values, creating composite units."""
        # Type checking
        if left.datatype not in ["Numeriek", "Bedrag"]:
            raise RuntimeError(f"Cannot multiply {left.datatype} values")
        if right.datatype not in ["Numeriek", "Bedrag"]:
            raise RuntimeError(f"Cannot multiply {right.datatype} values")
        
        # Percentage cannot be used with multiplication
        if left.datatype == "Percentage" or right.datatype == "Percentage":
            raise RuntimeError("Cannot use percentage values with multiplication operator")
        
        # Handle empty values (treat as 0)
        left_dec = self._ensure_decimal(left) if left.value is not None else Decimal('0')
        right_dec = self._ensure_decimal(right) if right.value is not None else Decimal('0')
        
        # Perform multiplication
        result_dec = left_dec * right_dec
        
        # Handle units - create composite unit
        left_comp = left.get_composite_unit(self.registry)
        right_comp = right.get_composite_unit(self.registry)
        result_unit = left_comp.multiply(right_comp)
        
        # Result has sum of decimal places (max)
        left_places = self._get_decimal_places(left_dec)
        right_places = self._get_decimal_places(right_dec)
        total_places = left_places + right_places
        
        # Quantize to maintain decimal places
        if total_places > 0:
            quantizer = Decimal('0.1') ** total_places
            result_dec = result_dec.quantize(quantizer)
        
        # Determine result datatype
        result_datatype = left.datatype if left.datatype == "Bedrag" else right.datatype
        
        # Convert dimensionless unit to None, or simple units to string
        if result_unit.is_dimensionless():
            final_unit = None
        elif len(result_unit.numerator) == 1 and not result_unit.denominator and result_unit.numerator[0][1] == 1:
            # Simple unit like ("euro", 1) -> "euro"
            final_unit = result_unit.numerator[0][0]
        else:
            final_unit = result_unit
        
        return Value(value=result_dec, datatype=result_datatype, unit=final_unit)
    
    def divide(self, left: Value, right: Value, use_abs_style: bool = False) -> Value:
        """Divide two values, creating composite units.
        
        Args:
            left: Dividend value
            right: Divisor value  
            use_abs_style: If True, use "gedeeld door (ABS)" style with 5 decimal places
        """
        # Type checking
        if left.datatype not in ["Numeriek", "Bedrag"]:
            raise RuntimeError(f"Cannot divide {left.datatype} values")
        if right.datatype not in ["Numeriek", "Bedrag"]:
            raise RuntimeError(f"Cannot divide {right.datatype} values")
        
        # Handle empty values
        right_dec = self._ensure_decimal(right) if right.value is not None else None
        if right_dec is None or right_dec == 0:
            raise RuntimeError("Division by zero")
        
        left_dec = self._ensure_decimal(left) if left.value is not None else Decimal('0')
        
        # Handle units - create composite unit
        left_comp = left.get_composite_unit(self.registry)
        right_comp = right.get_composite_unit(self.registry)
        result_unit = left_comp.divide(right_comp)
        
        if use_abs_style:
            # ABS style: always 5 decimal places, round toward 0
            result_dec = left_dec / right_dec
            # Round to 5 decimal places toward 0
            result_dec = result_dec.quantize(Decimal('0.00001'), rounding=ROUND_DOWN if result_dec >= 0 else ROUND_DOWN)
        else:
            # Standard division: maintain highest decimal places, use fractions if needed
            left_places = self._get_decimal_places(left_dec)
            right_places = self._get_decimal_places(right_dec)
            max_places = max(left_places, right_places)
            
            # Try to get exact result
            result_dec = left_dec / right_dec
            
            # Check if result is exact with max_places decimals
            if max_places > 0:
                quantizer = Decimal('0.1') ** max_places
                quantized = result_dec.quantize(quantizer)
                # If quantizing changes the value, we need a fraction
                if quantized != result_dec:
                    # Return as Fraction for exact representation
                    # This would need special handling in the engine
                    # For now, just return the decimal
                    result_dec = quantized
            else:
                # Integer decimal places
                if result_dec % 1 != 0:
                    # Not a whole number, would need fraction representation
                    # For now, keep as decimal
                    pass
        
        # Determine result datatype  
        result_datatype = left.datatype if left.datatype == "Bedrag" else "Numeriek"
        
        # Convert dimensionless unit to None, or simple units to string
        if result_unit.is_dimensionless():
            final_unit = None
        elif len(result_unit.numerator) == 1 and not result_unit.denominator and result_unit.numerator[0][1] == 1:
            # Simple unit like ("euro", 1) -> "euro"
            final_unit = result_unit.numerator[0][0]
        else:
            final_unit = result_unit
        
        return Value(value=result_dec, datatype=result_datatype, unit=final_unit)
    
    def power(self, base: Value, exponent: Value) -> Value:
        """Raise a value to a power."""
        # Type checking
        if base.datatype not in ["Numeriek"]:
            raise RuntimeError(f"Cannot raise {base.datatype} values to a power")
        if exponent.datatype not in ["Numeriek"]:
            raise RuntimeError(f"Exponent must be numeric, got {exponent.datatype}")
        
        # Exponent should not have units
        if exponent.unit:
            raise RuntimeError("Exponent cannot have units")
        
        base_dec = self._ensure_decimal(base)
        exp_dec = self._ensure_decimal(exponent)
        
        # Convert to float for power operation (Decimal doesn't support non-integer powers directly)
        result_float = float(base_dec) ** float(exp_dec)
        result_dec = Decimal(str(result_float))
        
        # Handle units - power affects the unit
        if base.unit:
            # For now, only handle integer exponents for units
            if exp_dec % 1 == 0:
                exp_int = int(exp_dec)
                base_comp = base.get_composite_unit(self.registry)
                # Multiply unit by itself exp_int times
                result_unit = base_comp
                for _ in range(abs(exp_int) - 1):
                    if exp_int > 0:
                        result_unit = result_unit.multiply(base_comp)
                    else:
                        result_unit = CompositeUnit([], []).divide(result_unit)
                
                if exp_int < 0:
                    result_unit = CompositeUnit([], []).divide(result_unit)
                    
                # Convert dimensionless unit to None, or simple units to string
                if result_unit.is_dimensionless():
                    final_unit = None
                elif len(result_unit.numerator) == 1 and not result_unit.denominator and result_unit.numerator[0][1] == 1:
                    # Simple unit like ("euro", 1) -> "euro"
                    final_unit = result_unit.numerator[0][0]
                else:
                    final_unit = result_unit
            else:
                raise RuntimeError("Non-integer exponents not supported for values with units")
        else:
            final_unit = None
        
        return Value(value=result_dec, datatype=base.datatype, unit=final_unit)
    
    def negate(self, value: Value) -> Value:
        """Negate a numeric value (unary minus)."""
        if value.datatype not in ["Numeriek", "Percentage", "Bedrag"]:
            raise RuntimeError(f"Cannot negate {value.datatype} values")
        
        dec_val = self._ensure_decimal(value)
        return Value(value=-dec_val, datatype=value.datatype, unit=value.unit)