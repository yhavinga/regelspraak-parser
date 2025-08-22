"""Tests for numeric exact digits predicate."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value


class TestNumericExact(unittest.TestCase):
    """Test cases for 'is numeriek met exact N cijfers' predicate."""
    
    def test_numeric_exact_positive(self):
        """Test positive cases for numeric exact check."""
        input_text = """
Objecttype de Persoon
    de postcode Tekst;
    heeft geldige postcode kenmerk (bezittelijk);

Regel check postcode
    geldig altijd
        Een persoon heeft geldige postcode
        indien zijn postcode is numeriek met exact 4 cijfers.
"""
        model = parse_text(input_text)
        
        # Test with exact 4 digits
        context = RuntimeContext(model)
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        context.set_attribute(persoon, "postcode", Value("1234", "Tekst"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result = context.get_kenmerk(persoon, "geldige postcode")
        self.assertTrue(result)
        
        # Test with leading zeros
        context = RuntimeContext(model)
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        context.set_attribute(persoon, "postcode", Value("0123", "Tekst"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result = context.get_kenmerk(persoon, "geldige postcode")
        self.assertTrue(result)
    
    def test_numeric_exact_negative(self):
        """Test negative cases for numeric exact check."""
        input_text = """
Objecttype de Persoon
    de postcode Tekst;
    heeft geldige postcode kenmerk (bezittelijk);

Regel check postcode
    geldig altijd
        Een persoon heeft geldige postcode
        indien zijn postcode is numeriek met exact 4 cijfers.
"""
        model = parse_text(input_text)
        
        # Test with too many digits
        context = RuntimeContext(model)
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        context.set_attribute(persoon, "postcode", Value("12345", "Tekst"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result = context.get_kenmerk(persoon, "geldige postcode")
        self.assertFalse(result)
        
        # Test with too few digits
        context = RuntimeContext(model)
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        context.set_attribute(persoon, "postcode", Value("123", "Tekst"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result = context.get_kenmerk(persoon, "geldige postcode")
        self.assertFalse(result)
        
        # Test with non-numeric characters
        context = RuntimeContext(model)
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        context.set_attribute(persoon, "postcode", Value("12a4", "Tekst"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result = context.get_kenmerk(persoon, "geldige postcode")
        self.assertFalse(result)
    
    def test_numeric_exact_negated(self):
        """Test negated numeric exact check."""
        input_text = """
Objecttype de Persoon
    het burgerservicenummer Tekst;
    heeft ongeldig bsn kenmerk (bezittelijk);

Regel check bsn
    geldig altijd
        Een persoon heeft ongeldig bsn
        indien zijn burgerservicenummer is niet numeriek met exact 9 cijfers.
"""
        model = parse_text(input_text)
        
        # Test with wrong number of digits (should be invalid)
        context = RuntimeContext(model)
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        context.set_attribute(persoon, "burgerservicenummer", Value("12345678", "Tekst"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result = context.get_kenmerk(persoon, "ongeldig bsn")
        self.assertTrue(result)
        
        # Test with correct number of digits (should not be invalid)
        context = RuntimeContext(model)
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        context.set_attribute(persoon, "burgerservicenummer", Value("123456789", "Tekst"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result = context.get_kenmerk(persoon, "ongeldig bsn")
        self.assertFalse(result)
    
    def test_numeric_exact_null_handling(self):
        """Test null/empty value handling in numeric exact check."""
        input_text = """
Objecttype de Persoon
    de postcode Tekst;
    heeft geldige postcode kenmerk (bezittelijk);

Regel check postcode
    geldig altijd
        Een persoon heeft geldige postcode
        indien zijn postcode is numeriek met exact 4 cijfers.
"""
        model = parse_text(input_text)
        
        # Test with null value
        context = RuntimeContext(model)
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        context.set_attribute(persoon, "postcode", Value(None, "Tekst"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result = context.get_kenmerk(persoon, "geldige postcode")
        # For a null value, the numeric exact check should return False
        self.assertFalse(result)
        
        # Test with empty string
        context = RuntimeContext(model)
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        context.set_attribute(persoon, "postcode", Value("", "Tekst"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result = context.get_kenmerk(persoon, "geldige postcode")
        self.assertFalse(result)


if __name__ == '__main__':
    unittest.main()