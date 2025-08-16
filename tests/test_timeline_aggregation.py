#!/usr/bin/env python3
"""Test timeline aggregation functions that return scalar sums per specification."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, TimelineValue
from regelspraak.ast import Timeline, Period
from decimal import Decimal
from datetime import date, datetime

class TestTimelineAggregation(unittest.TestCase):
    
    def test_totaal_van_timeline_returns_scalar(self):
        """Test that 'het totaal van' with timeline input returns a scalar sum.
        
        Per specification section 7.1:
        - 'het totaal van' sums ALL values across ALL time periods
        - Returns a NON-time-dependent scalar value
        """
        regelspraak_code = """
        Objecttype de Persoon
            de dagelijkse kosten Bedrag voor elke dag;
            de totale kosten Bedrag;
        
        Regel bereken totale kosten
            geldig altijd
                De totale kosten van een persoon moet berekend worden als 
                het totaal van zijn dagelijkse kosten.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a person object
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        
        # Set up timeline for dagelijkse kosten - values across 4 days
        kosten_periods = [
            Period(date(2024, 1, 1), date(2024, 1, 2), 
                   Value(Decimal(100), "Bedrag", "€")),
            Period(date(2024, 1, 2), date(2024, 1, 3), 
                   Value(Decimal(150), "Bedrag", "€")),
            Period(date(2024, 1, 3), date(2024, 1, 4), 
                   Value(Decimal(200), "Bedrag", "€")),
            Period(date(2024, 1, 4), date(2024, 1, 5), 
                   Value(Decimal(120), "Bedrag", "€")),
        ]
        kosten_timeline = TimelineValue(Timeline(periods=kosten_periods, granularity="dag"))
        context.set_timeline_attribute(persoon, "dagelijkse kosten", kosten_timeline)
        
        # Set evaluation date
        context.evaluation_date = date(2024, 1, 3)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be a scalar Value with the total sum
        # Total = 100 + 150 + 200 + 120 = 570
        self.assertIn("totale kosten", persoon.attributen)
        result = persoon.attributen["totale kosten"]
        self.assertIsInstance(result, Value)
        self.assertNotIsInstance(result, TimelineValue)
        self.assertEqual(result.value, Decimal(570))
        self.assertEqual(result.datatype, "Bedrag")
        self.assertEqual(result.unit, "€")
    
    def test_totaal_van_multiple_periods(self):
        """Test aggregating values across multiple time periods.
        
        Per specification: total should be the sum of ALL values across ALL periods.
        """
        regelspraak_code = """
        Objecttype de Persoon
            de dagelijkse uitgaven Bedrag voor elke dag;
            de totale uitgaven Bedrag;
        
        Regel bereken totale uitgaven
            geldig altijd
                De totale uitgaven van een persoon moet berekend worden als 
                het totaal van zijn dagelijkse uitgaven.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a person object
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        
        # Set up timeline for daily expenses spanning two months
        uitgaven_periods = [
            # January days
            Period(date(2024, 1, 29), date(2024, 1, 30), 
                   Value(Decimal(50), "Bedrag", "€")),
            Period(date(2024, 1, 30), date(2024, 1, 31), 
                   Value(Decimal(60), "Bedrag", "€")),
            Period(date(2024, 1, 31), date(2024, 2, 1), 
                   Value(Decimal(70), "Bedrag", "€")),
            # February days
            Period(date(2024, 2, 1), date(2024, 2, 2), 
                   Value(Decimal(80), "Bedrag", "€")),
            Period(date(2024, 2, 2), date(2024, 2, 3), 
                   Value(Decimal(90), "Bedrag", "€")),
        ]
        uitgaven_timeline = TimelineValue(Timeline(periods=uitgaven_periods, granularity="dag"))
        context.set_timeline_attribute(persoon, "dagelijkse uitgaven", uitgaven_timeline)
        
        # Set evaluation date
        context.evaluation_date = date(2024, 2, 1)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be scalar sum of all periods
        # Total: 50 + 60 + 70 + 80 + 90 = 350
        self.assertIn("totale uitgaven", persoon.attributen)
        result = persoon.attributen["totale uitgaven"]
        self.assertIsInstance(result, Value)
        self.assertNotIsInstance(result, TimelineValue)
        self.assertEqual(result.value, Decimal(350))
        self.assertEqual(result.datatype, "Bedrag")
        self.assertEqual(result.unit, "€")
    
    def test_totaal_van_with_empty_periods(self):
        """Test timeline aggregation with some empty periods.
        
        Empty periods (None values) are skipped in the sum.
        """
        regelspraak_code = """
        Objecttype de Persoon
            de inkomen Bedrag voor elke maand;
            de totale inkomen Bedrag;
        
        Regel bereken totale inkomen
            geldig altijd
                De totale inkomen van een persoon moet berekend worden als 
                het totaal van zijn inkomen.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a person object
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        
        # Set up timeline with gaps (None values)
        inkomen_periods = [
            Period(date(2024, 1, 1), date(2024, 2, 1), 
                   Value(Decimal(1000), "Bedrag", "€")),
            Period(date(2024, 2, 1), date(2024, 3, 1), 
                   Value(None, "Bedrag", "€")),  # Empty period - skipped in sum
            Period(date(2024, 3, 1), date(2024, 4, 1), 
                   Value(Decimal(1200), "Bedrag", "€")),
        ]
        inkomen_timeline = TimelineValue(Timeline(periods=inkomen_periods, granularity="maand"))
        context.set_timeline_attribute(persoon, "inkomen", inkomen_timeline)
        
        # Set evaluation date
        context.evaluation_date = date(2024, 2, 15)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be scalar sum, skipping None values
        # Total: 1000 + 0 (None) + 1200 = 2200
        self.assertIn("totale inkomen", persoon.attributen)
        result = persoon.attributen["totale inkomen"]
        self.assertIsInstance(result, Value)
        self.assertNotIsInstance(result, TimelineValue)
        self.assertEqual(result.value, Decimal(2200))
        self.assertEqual(result.datatype, "Bedrag")
        self.assertEqual(result.unit, "€")

if __name__ == "__main__":
    unittest.main()