#!/usr/bin/env python3
"""Test aantal dagen in conditional pattern."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.ast import Timeline, Period
from decimal import Decimal
from datetime import date, datetime

class TestAantalDagenConditional(unittest.TestCase):
    
    def test_aantal_dagen_simple_boolean_true(self):
        """Test counting days with a simple boolean condition that's always true."""
        regelspraak_code = """
        Objecttype de Berekening
            het resultaat Numeriek (geheel getal);
        
        Parameter de test waarde : Boolean;
        
        Regel tel dagen
            geldig altijd
                Het resultaat van een berekening moet gesteld worden op 
                het aantal dagen in de maand dat de test waarde.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a berekening object
        berekening = RuntimeObject("Berekening")
        context.add_object(berekening)
        
        # Set parameter to true
        context.set_parameter("test waarde", Value(True, "Boolean", None))
        
        # Set evaluation date to February 2024 (29 days - leap year)
        context.evaluation_date = date(2024, 2, 15)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be 29 (all days in Feb 2024)
        result = context.get_attribute(berekening, "resultaat")
        self.assertEqual(result.value, Decimal(29))
    
    def test_aantal_dagen_simple_boolean_false(self):
        """Test counting days when condition is always false."""
        regelspraak_code = """
        Objecttype de Berekening
            het resultaat Numeriek (geheel getal);
        
        Parameter de test waarde : Boolean;
        
        Regel tel dagen
            geldig altijd
                Het resultaat van een berekening moet gesteld worden op 
                het aantal dagen in het jaar dat de test waarde.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a berekening object
        berekening = RuntimeObject("Berekening")
        context.add_object(berekening)
        
        # Set parameter to false
        context.set_parameter("test waarde", Value(False, "Boolean", None))
        
        # Set evaluation date to 2024 (366 days - leap year)
        context.evaluation_date = date(2024, 6, 15)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be 0 (no days match)
        result = context.get_attribute(berekening, "resultaat")
        self.assertEqual(result.value, Decimal(0))

    def test_aantal_dagen_with_comparison(self):
        """Test counting days with a comparison condition."""
        regelspraak_code = """
        Objecttype de Berekening
            het resultaat Numeriek (geheel getal);
        
        Parameter de drempel waarde : Numeriek (geheel getal);
        Parameter de test waarde : Numeriek (geheel getal);
        
        Regel dagen tellen met vergelijking
            geldig altijd
                Het resultaat van een berekening moet gesteld worden op 
                het aantal dagen in de maand dat de test waarde groter is dan de drempel waarde.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a berekening object
        berekening = RuntimeObject("Berekening")
        context.add_object(berekening)
        
        # Set parameters
        context.set_parameter("drempel waarde", Value(Decimal(50), "Numeriek", None))
        context.set_parameter("test waarde", Value(Decimal(100), "Numeriek", None))
        
        # Set evaluation date to March 2024 (31 days)
        context.evaluation_date = date(2024, 3, 15)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be 31 (test value > threshold for all days)
        result = context.get_attribute(berekening, "resultaat")
        self.assertEqual(result.value, Decimal(31))

    def test_aantal_dagen_non_leap_year(self):
        """Test counting days in February of a non-leap year."""
        regelspraak_code = """
        Objecttype de Berekening
            het resultaat Numeriek (geheel getal);
        
        Parameter de test waarde : Boolean;
        
        Regel tel dagen
            geldig altijd
                Het resultaat van een berekening moet gesteld worden op 
                het aantal dagen in de maand dat de test waarde.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a berekening object
        berekening = RuntimeObject("Berekening")
        context.add_object(berekening)
        
        # Set parameter to true
        context.set_parameter("test waarde", Value(True, "Boolean", None))
        
        # Set evaluation date to February 2023 (28 days - non-leap year)
        context.evaluation_date = date(2023, 2, 15)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be 28 (all days in Feb 2023)
        result = context.get_attribute(berekening, "resultaat")
        self.assertEqual(result.value, Decimal(28))

if __name__ == "__main__":
    unittest.main()