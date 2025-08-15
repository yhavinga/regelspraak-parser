#!/usr/bin/env python3
"""Test timeline-aware aggregation functions that return TimelineValue results."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, TimelineValue
from regelspraak.ast import Timeline, Period
from decimal import Decimal
from datetime import date, datetime

class TestTimelineAggregation(unittest.TestCase):
    
    def test_totaal_van_timeline_returns_timeline(self):
        """Test that 'het totaal van' with timeline input returns a TimelineValue."""
        regelspraak_code = """
        Objecttype de Persoon
            de dagelijkse kosten Bedrag voor elke dag;
            de cumulatieve kosten Bedrag voor elke dag;
        
        Regel bereken cumulatieve kosten
            geldig altijd
                De cumulatieve kosten van een persoon moet berekend worden als 
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
        
        # Check result - should be a TimelineValue with running totals
        # Get the timeline value directly from timeline_attributen
        self.assertIn("cumulatieve kosten", persoon.timeline_attributen)
        result = persoon.timeline_attributen["cumulatieve kosten"]
        self.assertIsInstance(result, TimelineValue)
        
        # Check running totals at each date
        # Day 1: 100
        self.assertEqual(result.get_value_at(date(2024, 1, 1)).value, Decimal(100))
        # Day 2: 100 + 150 = 250
        self.assertEqual(result.get_value_at(date(2024, 1, 2)).value, Decimal(250))
        # Day 3: 100 + 150 + 200 = 450
        self.assertEqual(result.get_value_at(date(2024, 1, 3)).value, Decimal(450))
        # Day 4: 100 + 150 + 200 + 120 = 570
        self.assertEqual(result.get_value_at(date(2024, 1, 4)).value, Decimal(570))
    
    def test_totaal_van_monthly_aggregation(self):
        """Test aggregating daily values into monthly totals."""
        regelspraak_code = """
        Objecttype de Persoon
            de dagelijkse uitgaven Bedrag voor elke dag;
            de maandelijkse uitgaven Bedrag voor elke maand;
        
        Regel bereken maandelijkse uitgaven
            geldig altijd
                De maandelijkse uitgaven van een persoon moet berekend worden als 
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
        
        # Check result
        # Get the timeline value directly from timeline_attributen
        self.assertIn("maandelijkse uitgaven", persoon.timeline_attributen)
        result = persoon.timeline_attributen["maandelijkse uitgaven"]
        self.assertIsInstance(result, TimelineValue)
        
        # The timeline should have running totals
        # After processing Jan 29-31: 50 + 60 + 70 = 180
        jan_total = result.get_value_at(date(2024, 1, 31))
        self.assertEqual(jan_total.value, Decimal(180))
        
        # After processing Feb 1-2: 180 + 80 + 90 = 350
        feb_total = result.get_value_at(date(2024, 2, 2))
        self.assertEqual(feb_total.value, Decimal(350))
    
    def test_totaal_van_with_empty_periods(self):
        """Test timeline aggregation with some empty periods."""
        regelspraak_code = """
        Objecttype de Persoon
            de inkomen Bedrag voor elke maand;
            de totale inkomen Bedrag voor elke maand;
        
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
                   Value(None, "Bedrag", "€")),  # Empty period
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
        
        # Check result
        # Get the timeline value directly from timeline_attributen
        self.assertIn("totale inkomen", persoon.timeline_attributen)
        result = persoon.timeline_attributen["totale inkomen"]
        self.assertIsInstance(result, TimelineValue)
        
        # Jan: 1000
        self.assertEqual(result.get_value_at(date(2024, 1, 15)).value, Decimal(1000))
        # Feb: 1000 (no change, empty period)
        self.assertEqual(result.get_value_at(date(2024, 2, 15)).value, Decimal(1000))
        # Mar: 1000 + 1200 = 2200
        self.assertEqual(result.get_value_at(date(2024, 3, 15)).value, Decimal(2200))

if __name__ == "__main__":
    unittest.main()