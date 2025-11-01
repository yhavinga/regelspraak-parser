#!/usr/bin/env python3
"""Test TOKA eerste paasdag van function."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from datetime import date


class TestTokaEerstePaasdag(unittest.TestCase):
    
    def test_eerste_paasdag_function(self):
        """Test eerste paasdag van function from TOKA spec."""
        # From TOKA specification lines 245-250
        regelspraak_code = """
        Objecttype de Vlucht (mv: vluchten)
            de vluchtdatum Datum in dagen;
            is reis met paaskorting kenmerk;
        
        Regel Paaskorting
            geldig altijd
                Een vlucht is een reis met paaskorting
                indien de vluchtdatum van de vlucht gelijk is aan de eerste paasdag van (het jaar uit (de vluchtdatum van de vlucht)).
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model, "Failed to parse RegelSpraak code with eerste paasdag function")
        
        # Create runtime context
        context = RuntimeContext(model)
        
        # Create flight on Easter 2024 (March 31, 2024)
        flight_easter = RuntimeObject("Vlucht")
        context.add_object(flight_easter)
        context.set_attribute(flight_easter, "vluchtdatum", Value(date(2024, 3, 31), "Datum"))
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check that flight on Easter has the discount
        has_discount = context.get_kenmerk(flight_easter, "is_reis_met_paaskorting")
        self.assertTrue(has_discount)
        
        # Create flight not on Easter
        flight_regular = RuntimeObject("Vlucht")
        context.add_object(flight_regular)
        context.set_attribute(flight_regular, "vluchtdatum", Value(date(2024, 4, 1), "Datum"))
        
        evaluator.execute_model(model)
        
        # Check that regular flight doesn't have discount
        has_discount_regular = context.get_kenmerk(flight_regular, "is_reis_met_paaskorting")
        self.assertFalse(has_discount_regular)
    
    def test_eerste_paasdag_calculation(self):
        """Test that eerste paasdag calculation is correct for various years."""
        regelspraak_code = """
        Objecttype de Test
            het jaar Numeriek (geheel getal) met eenheid jr;
            de paasdag Datum in dagen;
        
        Regel bereken paasdag
            geldig altijd
                De paasdag van een Test moet berekend worden als de eerste paasdag van (het jaar van de test).
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(model)
        
        # Test known Easter dates
        easter_dates = {
            2020: date(2020, 4, 12),   # April 12, 2020
            2021: date(2021, 4, 4),     # April 4, 2021
            2022: date(2022, 4, 17),    # April 17, 2022
            2023: date(2023, 4, 9),     # April 9, 2023
            2024: date(2024, 3, 31),    # March 31, 2024
            2025: date(2025, 4, 20),    # April 20, 2025
        }
        
        for year, expected_date in easter_dates.items():
            test_obj = RuntimeObject("Test")
            context.add_object(test_obj)
            context.set_attribute(test_obj, "jaar", Value(year, "Numeriek", "jr"))
            
            # Execute rules
            evaluator = Evaluator(context)
            evaluator.execute_model(model)
            
            # Check calculated Easter date
            paasdag = context.get_attribute(test_obj, "paasdag")
            self.assertEqual(paasdag.value, expected_date,
                           f"Easter date for {year} should be {expected_date}, got {paasdag.value}")
    
    def test_eerste_paasdag_edge_cases(self):
        """Test edge cases for eerste paasdag function."""
        regelspraak_code = """
        Objecttype de Test
            het jaar Numeriek (geheel getal) met eenheid jr;
            de paasdag Datum in dagen;
        
        Regel bereken paasdag
            geldig altijd
                De paasdag van een Test moet berekend worden als de eerste paasdag van (het jaar van de test).
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(model)
        
        # Test year 1900 (historical)
        test_1900 = RuntimeObject("Test")
        context.add_object(test_1900)
        context.set_attribute(test_1900, "jaar", Value(1900, "Numeriek", "jr"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        paasdag_1900 = context.get_attribute(test_1900, "paasdag")
        # Easter 1900 was on April 15
        self.assertEqual(paasdag_1900.value, date(1900, 4, 15))
        
        # Test year 2100 (future)
        test_2100 = RuntimeObject("Test")
        context.add_object(test_2100)
        context.set_attribute(test_2100, "jaar", Value(2100, "Numeriek", "jr"))
        
        evaluator.execute_model(model)
        
        paasdag_2100 = context.get_attribute(test_2100, "paasdag")
        # Easter 2100 will be on March 28
        self.assertEqual(paasdag_2100.value, date(2100, 3, 28))


if __name__ == "__main__":
    unittest.main()