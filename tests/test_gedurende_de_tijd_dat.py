#!/usr/bin/env python3
"""Test gedurende de tijd dat temporal conditions."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, TimelineValue
from regelspraak.ast import Timeline, Period
from decimal import Decimal
from datetime import date, datetime

class TestGedurendeDeTijdDat(unittest.TestCase):
    
    def test_totaal_van_with_temporal_condition(self):
        """Test 'het totaal van' with 'gedurende de tijd dat' condition."""
        regelspraak_code = """
        Objecttype de Persoon
            de belastingvermindering Bedrag voor elke maand;
            de maand inkomen Bedrag voor elke maand;
            het recht op belastingvermindering kenmerk (bezittelijk);
            de totale belastingvermindering Bedrag;
        
        Parameter de inkomen drempel : Bedrag
        
        Regel bereken totale belastingvermindering
            geldig altijd
                De totale belastingvermindering van een persoon moet berekend worden als 
                het totaal van zijn belastingvermindering 
                gedurende de tijd dat zijn maand inkomen groter is dan de inkomen drempel.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Set parameter  
        context.set_parameter("inkomen drempel", Value(Decimal(2000), "Bedrag", "€"))
        
        # Create a person object
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        
        # Set up timeline for belastingvermindering - values across 4 months
        belasting_periods = [
            Period(date(2024, 1, 1), date(2024, 2, 1), 
                   Value(Decimal(100), "Bedrag", "€")),
            Period(date(2024, 2, 1), date(2024, 3, 1), 
                   Value(Decimal(150), "Bedrag", "€")),
            Period(date(2024, 3, 1), date(2024, 4, 1), 
                   Value(Decimal(200), "Bedrag", "€")),
            Period(date(2024, 4, 1), date(2024, 5, 1), 
                   Value(Decimal(120), "Bedrag", "€")),
        ]
        belasting_timeline = TimelineValue(Timeline(periods=belasting_periods, granularity="maand"))
        context.set_timeline_attribute(persoon, "belastingvermindering", belasting_timeline)
        
        # Set up timeline for maand inkomen - varies above and below threshold
        inkomen_periods = [
            Period(date(2024, 1, 1), date(2024, 2, 1),
                   Value(Decimal(1800), "Bedrag", "€")),  # Below threshold
            Period(date(2024, 2, 1), date(2024, 3, 1),
                   Value(Decimal(2500), "Bedrag", "€")),  # Above threshold
            Period(date(2024, 3, 1), date(2024, 4, 1),
                   Value(Decimal(3000), "Bedrag", "€")),  # Above threshold
            Period(date(2024, 4, 1), date(2024, 5, 1),
                   Value(Decimal(1500), "Bedrag", "€")),  # Below threshold
        ]
        inkomen_timeline = TimelineValue(Timeline(periods=inkomen_periods, granularity="maand"))
        context.set_timeline_attribute(persoon, "maand inkomen", inkomen_timeline)
        
        # Set evaluation date (needed for timeline evaluation)
        context.evaluation_date = date(2024, 3, 15)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be 150 (Feb) + 200 (March) = 350
        # January (100) and April (120) should be excluded due to condition
        result = context.get_attribute(persoon, "totale belastingvermindering")
        self.assertEqual(result.value, Decimal(350))
        self.assertEqual(result.unit, "€")
    
    def test_totaal_van_with_always_false_condition(self):
        """Test 'het totaal van' when temporal condition is always false."""
        regelspraak_code = """
        Objecttype de Persoon
            de inkomen Bedrag voor elke maand;
            de status score Numeriek voor elke maand;
            de totale inkomen Bedrag;
        
        Parameter de minimum score : Numeriek
        
        Regel bereken totale inkomen
            geldig altijd
                De totale inkomen van een persoon moet berekend worden als 
                het totaal van zijn inkomen 
                gedurende de tijd dat zijn status score groter is dan de minimum score.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Set parameter to high value so condition is always false
        context.set_parameter("minimum score", Value(Decimal(100), "Numeriek", None))
        
        # Create a person object
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        
        # Set up timeline for inkomen
        inkomen_periods = [
            Period(date(2024, 1, 1), date(2024, 4, 1),
                   Value(Decimal(1000), "Bedrag", "€"))
        ]
        inkomen_timeline = TimelineValue(Timeline(periods=inkomen_periods, granularity="maand"))
        context.set_timeline_attribute(persoon, "inkomen", inkomen_timeline)
        
        # Set up timeline for status score - always below threshold
        score_periods = [
            Period(date(2024, 1, 1), date(2024, 4, 1),
                   Value(Decimal(50), "Numeriek", None))  # Always below 100
        ]
        score_timeline = TimelineValue(Timeline(periods=score_periods, granularity="maand"))
        context.set_timeline_attribute(persoon, "status score", score_timeline)
        
        # Set evaluation date
        context.evaluation_date = date(2024, 2, 15)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be 0 since condition is always false
        result = context.get_attribute(persoon, "totale inkomen")
        self.assertEqual(result.value, Decimal(0))
        self.assertEqual(result.unit, "€")
    
    def test_totaal_van_with_complex_expression_condition(self):
        """Test 'het totaal van' with a complex expression as temporal condition."""
        regelspraak_code = """
        Objecttype de Persoon
            de uitgaven Bedrag voor elke maand;
            de inkomen Bedrag voor elke maand;
            de totale uitgaven Bedrag;
        
        Parameter de drempel waarde : Bedrag
        
        Regel bereken totale uitgaven
            geldig altijd
                De totale uitgaven van een persoon moet berekend worden als 
                het totaal van zijn uitgaven 
                gedurende de tijd dat zijn inkomen groter is dan de drempel waarde.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Set parameter
        context.set_parameter("drempel waarde", Value(Decimal(2000), "Bedrag", "€"))
        
        # Create a person object
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        
        # Set up timeline for uitgaven
        uitgaven_periods = [
            Period(date(2024, 1, 1), date(2024, 2, 1),
                   Value(Decimal(500), "Bedrag", "€")),
            Period(date(2024, 2, 1), date(2024, 3, 1),
                   Value(Decimal(600), "Bedrag", "€")),
            Period(date(2024, 3, 1), date(2024, 4, 1),
                   Value(Decimal(700), "Bedrag", "€")),
        ]
        uitgaven_timeline = TimelineValue(Timeline(periods=uitgaven_periods, granularity="maand"))
        context.set_timeline_attribute(persoon, "uitgaven", uitgaven_timeline)
        
        # Set up timeline for inkomen - varying above and below threshold
        inkomen_periods = [
            Period(date(2024, 1, 1), date(2024, 2, 1),
                   Value(Decimal(1500), "Bedrag", "€")),  # Below threshold
            Period(date(2024, 2, 1), date(2024, 3, 1),
                   Value(Decimal(2500), "Bedrag", "€")),  # Above threshold
            Period(date(2024, 3, 1), date(2024, 4, 1),
                   Value(Decimal(3000), "Bedrag", "€")),  # Above threshold
        ]
        inkomen_timeline = TimelineValue(Timeline(periods=inkomen_periods, granularity="maand"))
        context.set_timeline_attribute(persoon, "inkomen", inkomen_timeline)
        
        # Set evaluation date
        context.evaluation_date = date(2024, 2, 15)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be 600 (Feb) + 700 (March) = 1300
        # January (500) excluded as income < threshold
        result = context.get_attribute(persoon, "totale uitgaven")
        self.assertEqual(result.value, Decimal(1300))
        self.assertEqual(result.unit, "€")

if __name__ == "__main__":
    unittest.main()