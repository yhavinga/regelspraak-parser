"""Test unit-aware arithmetic operations."""
import unittest
from decimal import Decimal

from regelspraak.runtime import Value, RuntimeContext
from regelspraak.arithmetic import UnitArithmetic
from regelspraak.units import UnitRegistry
from regelspraak.errors import RuntimeError as RegelspraakRuntimeError


class TestUnitArithmetic(unittest.TestCase):
    
    def setUp(self):
        self.registry = UnitRegistry()
        self.arithmetic = UnitArithmetic(self.registry)
    
    def test_simple_addition_same_unit(self):
        """Test adding two values with the same unit."""
        val1 = Value(value=10, datatype="Numeriek", unit="euro")
        val2 = Value(value=20, datatype="Numeriek", unit="euro")
        
        result = self.arithmetic.add(val1, val2)
        
        self.assertEqual(result.value, Decimal("30"))
        self.assertEqual(result.datatype, "Numeriek")
        self.assertEqual(result.unit, "euro")
    
    def test_addition_incompatible_units(self):
        """Test that adding incompatible units raises an error."""
        val1 = Value(value=10, datatype="Numeriek", unit="euro")
        val2 = Value(value=20, datatype="Numeriek", unit="jaar")
        
        with self.assertRaises(RegelspraakRuntimeError) as cm:
            self.arithmetic.add(val1, val2)
        
        self.assertIn("incompatible units", str(cm.exception))
    
    def test_multiplication_creates_composite_unit(self):
        """Test that multiplication creates composite units."""
        val1 = Value(value=4, datatype="Numeriek", unit="euro")
        val2 = Value(value=3, datatype="Numeriek", unit="jaar")
        
        result = self.arithmetic.multiply(val1, val2)
        
        self.assertEqual(result.value, Decimal("12"))
        self.assertEqual(result.datatype, "Numeriek")
        # Result should have composite unit
        self.assertIsNotNone(result.unit)
        # TODO: Check composite unit structure when string representation is implemented
    
    def test_division_cancels_units(self):
        """Test that division cancels out matching units."""
        val1 = Value(value=12, datatype="Numeriek", unit="euro")
        val2 = Value(value=4, datatype="Numeriek", unit="euro")
        
        result = self.arithmetic.divide(val1, val2)
        
        self.assertEqual(result.value, Decimal("3"))
        self.assertEqual(result.datatype, "Numeriek")
        self.assertIsNone(result.unit)  # Units should cancel out
    
    def test_division_abs_style(self):
        """Test division with ABS style (5 decimal places)."""
        val1 = Value(value=10, datatype="Numeriek", unit="euro")
        val2 = Value(value=3, datatype="Numeriek", unit=None)
        
        result = self.arithmetic.divide(val1, val2, use_abs_style=True)
        
        # Should be 3.33333 (5 decimals, rounded down)
        self.assertEqual(result.value, Decimal("3.33333"))
        self.assertEqual(result.unit, "euro")
    
    def test_decimal_places_addition(self):
        """Test that addition preserves the highest number of decimal places."""
        val1 = Value(value=Decimal("1.01"), datatype="Numeriek", unit="euro")
        val2 = Value(value=Decimal("3.437"), datatype="Numeriek", unit="euro")
        
        result = self.arithmetic.add(val1, val2)
        
        self.assertEqual(result.value, Decimal("4.447"))
        # Check decimal places preserved
        self.assertEqual(str(result.value), "4.447")
    
    def test_empty_value_handling(self):
        """Test that empty values are treated as 0 in arithmetic."""
        val1 = Value(value=None, datatype="Numeriek", unit="euro")
        val2 = Value(value=Decimal("10"), datatype="Numeriek", unit="euro")
        
        result = self.arithmetic.add(val1, val2)
        
        self.assertEqual(result.value, Decimal("10"))
        self.assertEqual(result.unit, "euro")
    
    def test_percentage_multiplication_forbidden(self):
        """Test that percentage values cannot be used with multiplication."""
        val1 = Value(value=10, datatype="Percentage", unit="%")
        val2 = Value(value=20, datatype="Numeriek", unit=None)
        
        with self.assertRaises(RegelspraakRuntimeError) as cm:
            self.arithmetic.multiply(val1, val2)
        
        self.assertIn("percentage", str(cm.exception).lower())


if __name__ == '__main__':
    unittest.main()