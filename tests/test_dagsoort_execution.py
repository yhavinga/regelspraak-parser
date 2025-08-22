#!/usr/bin/env python3
"""Test Dagsoortdefinitie execution with model-driven evaluation."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from decimal import Decimal
from datetime import date, datetime

class TestDagsoortExecution(unittest.TestCase):
    
    def test_kerstdag_evaluation(self):
        """Test that Christmas day is correctly identified using model-driven rules."""
        regelspraak_code = """
        Dagsoort de kerstdag (mv: kerstdagen);
        
        Regel Kerstdag
            geldig altijd
                Een dag is een kerstdag
                indien de dag aan alle volgende voorwaarden voldoet:
                - de maand uit (de dag) is gelijk aan 12
                - de dag voldoet aan ten minste één van de volgende voorwaarden:
                    .. de dag uit (de dag) is gelijk aan 25
                    .. de dag uit (de dag) is gelijk aan 26.
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Create context and evaluator
        context = RuntimeContext(model)
        evaluator = Evaluator(context)
        
        # Test dates
        christmas_day = date(2024, 12, 25)
        boxing_day = date(2024, 12, 26)
        regular_day = date(2024, 11, 15)
        new_year = date(2024, 1, 1)
        
        # Create Values for dates
        christmas_value = Value(value=christmas_day, datatype="Datum")
        boxing_value = Value(value=boxing_day, datatype="Datum")
        regular_value = Value(value=regular_day, datatype="Datum")
        newyear_value = Value(value=new_year, datatype="Datum")
        
        # Test Christmas day (Dec 25)
        is_kerstdag = evaluator._dagsoort_check(christmas_value, "kerstdag", None)
        self.assertTrue(is_kerstdag, "December 25 should be identified as kerstdag")
        
        # Test Boxing day (Dec 26)
        is_kerstdag = evaluator._dagsoort_check(boxing_value, "kerstdag", None)
        self.assertTrue(is_kerstdag, "December 26 should be identified as kerstdag")
        
        # Test regular day
        is_kerstdag = evaluator._dagsoort_check(regular_value, "kerstdag", None)
        self.assertFalse(is_kerstdag, "November 15 should not be identified as kerstdag")
        
        # Test New Year
        is_kerstdag = evaluator._dagsoort_check(newyear_value, "kerstdag", None)
        self.assertFalse(is_kerstdag, "January 1 should not be identified as kerstdag")
    
    def test_werkdag_without_definition(self):
        """Test that undefined dagsoort returns false."""
        regelspraak_code = """
        Dagsoort de werkdag;
        """
        
        # Parse the code (no rule defining werkdag)
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Create context and evaluator
        context = RuntimeContext(model)
        evaluator = Evaluator(context)
        
        # Test a weekday
        weekday = date(2024, 11, 18)  # Monday
        weekday_value = Value(value=weekday, datatype="Datum")
        
        # Should return false since no definition exists
        is_werkdag = evaluator._dagsoort_check(weekday_value, "werkdag", None)
        self.assertFalse(is_werkdag, "Undefined werkdag should return false")
    
    def test_simple_dagsoort_always_true(self):
        """Test a dagsoort that's always true (no condition)."""
        regelspraak_code = """
        Dagsoort de testdag;
        
        Regel Testdag
            geldig altijd
                Een dag is een testdag.
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Create context and evaluator
        context = RuntimeContext(model)
        evaluator = Evaluator(context)
        
        # Test any date
        any_date = date(2024, 6, 15)
        date_value = Value(value=any_date, datatype="Datum")
        
        # Should always return true
        is_testdag = evaluator._dagsoort_check(date_value, "testdag", None)
        self.assertTrue(is_testdag, "Testdag with no condition should always return true")
    
    def test_complex_dagsoort_condition(self):
        """Test a dagsoort with complex nested conditions."""
        regelspraak_code = """
        Dagsoort de zomerdag;
        
        Regel Zomerdag
            geldig altijd
                Een dag is een zomerdag
                indien de dag voldoet aan ten minste één van de volgende voorwaarden:
                - de maand uit (de dag) is gelijk aan 6
                - de maand uit (de dag) is gelijk aan 7
                - de maand uit (de dag) is gelijk aan 8.
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Create context and evaluator
        context = RuntimeContext(model)
        evaluator = Evaluator(context)
        
        # Test dates
        june_day = date(2024, 6, 15)
        july_day = date(2024, 7, 20)
        august_day = date(2024, 8, 10)
        september_day = date(2024, 9, 5)
        december_day = date(2024, 12, 25)
        
        # Test summer months
        self.assertTrue(
            evaluator._dagsoort_check(Value(value=june_day, datatype="Datum"), "zomerdag", None),
            "June should be identified as zomerdag"
        )
        self.assertTrue(
            evaluator._dagsoort_check(Value(value=july_day, datatype="Datum"), "zomerdag", None),
            "July should be identified as zomerdag"
        )
        self.assertTrue(
            evaluator._dagsoort_check(Value(value=august_day, datatype="Datum"), "zomerdag", None),
            "August should be identified as zomerdag"
        )
        
        # Test non-summer months
        self.assertFalse(
            evaluator._dagsoort_check(Value(value=september_day, datatype="Datum"), "zomerdag", None),
            "September should not be identified as zomerdag"
        )
        self.assertFalse(
            evaluator._dagsoort_check(Value(value=december_day, datatype="Datum"), "zomerdag", None),
            "December should not be identified as zomerdag"
        )

if __name__ == "__main__":
    unittest.main()