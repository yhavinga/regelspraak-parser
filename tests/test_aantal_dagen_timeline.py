#!/usr/bin/env python3
"""Test aantal dagen in conditional pattern with timeline support.

This test matches the example from specification section 7.2.
"""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, TimelineValue
from regelspraak.ast import Timeline, Period
from decimal import Decimal
from datetime import date

class TestAantalDagenTimeline(unittest.TestCase):
    
    def test_aantal_dagen_timeline_with_kenmerk(self):
        """Test counting days with timeline-aware kenmerk condition.
        
        This test matches the example from specification section 7.2:
        - Passenger has right from 1-1-2024 to 2-1-2024 (1 day in January)
        - Passenger has right from 10-1-2024 to 14-2-2024 (22 days in January + 13 days in February)
        Expected result:
        - 23 dagen/maand from 1-1-2024 to 1-2-2024
        - 13 dagen/maand from 1-2-2024 to 1-3-2024
        """
        regelspraak_code = """
        Objecttype de Passagier
            het aantal dagen recht op belastingvermindering Numeriek (geheel getal) voor elke maand;
            het recht op belastingvermindering kenmerk (bezittelijk) voor elke dag;
        
        Regel Aantal dagen recht op belastingvermindering
            geldig altijd
                Het aantal dagen recht op belastingvermindering van een passagier moet gesteld worden op 
                het aantal dagen in de maand dat hij een recht op belastingvermindering heeft.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a passagier object
        passagier = RuntimeObject("Passagier")
        context.add_object(passagier)
        
        # Set up timeline for recht op belastingvermindering kenmerk
        # The right exists from:
        # - 1-1-2024 to 2-1-2024 (1 day)
        # - 10-1-2024 to 14-2-2024 (36 days total)
        timeline_periods = [
            Period(
                start_date=date(2024, 1, 1),
                end_date=date(2024, 1, 2),
                value=Value(True, "Boolean", None)
            ),
            Period(
                start_date=date(2024, 1, 2),
                end_date=date(2024, 1, 10),
                value=Value(False, "Boolean", None)
            ),
            Period(
                start_date=date(2024, 1, 10),
                end_date=date(2024, 2, 14),
                value=Value(True, "Boolean", None)
            ),
            Period(
                start_date=date(2024, 2, 14),
                end_date=date(2024, 3, 1),
                value=Value(False, "Boolean", None)
            )
        ]
        
        timeline = Timeline(periods=timeline_periods, granularity="dag")
        timeline_value = TimelineValue(timeline=timeline)
        
        # Set the kenmerk as a timeline
        context.set_timeline_kenmerk(passagier, "recht op belastingvermindering", timeline_value)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Get the result timeline
        # The attribute should have been set as a timeline
        result = passagier.timeline_attributen.get("aantal dagen recht op belastingvermindering")
        
        # Verify it's a timeline
        self.assertIsInstance(result, TimelineValue)
        
        # Check the periods
        self.assertEqual(len(result.timeline.periods), 2)
        
        # First period: January 2024 - should have 23 days
        jan_period = result.timeline.periods[0]
        self.assertEqual(jan_period.start_date, date(2024, 1, 1))
        self.assertEqual(jan_period.end_date, date(2024, 2, 1))
        self.assertEqual(jan_period.value.value, Decimal(23))
        self.assertEqual(jan_period.value.unit, "dagen per maand")
        
        # Second period: February 2024 - should have 13 days
        feb_period = result.timeline.periods[1]
        self.assertEqual(feb_period.start_date, date(2024, 2, 1))
        self.assertEqual(feb_period.end_date, date(2024, 3, 1))
        self.assertEqual(feb_period.value.value, Decimal(13))
        self.assertEqual(feb_period.value.unit, "dagen per maand")
    
    def test_aantal_dagen_year_timeline(self):
        """Test counting days per year with timeline condition."""
        regelspraak_code = """
        Objecttype de Werknemer
            het aantal werkdagen Numeriek (geheel getal) voor elk jaar;
            is actief kenmerk voor elke dag;
        
        Regel Tel werkdagen
            geldig altijd
                Het aantal werkdagen van een werknemer moet gesteld worden op 
                het aantal dagen in het jaar dat hij is actief.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a werknemer object
        werknemer = RuntimeObject("Werknemer")
        context.add_object(werknemer)
        
        # Set up timeline for actief kenmerk
        # Active from 1-3-2024 to 1-10-2024 (214 days in 2024)
        timeline_periods = [
            Period(
                start_date=date(2024, 1, 1),
                end_date=date(2024, 3, 1),
                value=Value(False, "Boolean", None)
            ),
            Period(
                start_date=date(2024, 3, 1),
                end_date=date(2024, 10, 1),
                value=Value(True, "Boolean", None)
            ),
            Period(
                start_date=date(2024, 10, 1),
                end_date=date(2025, 1, 1),
                value=Value(False, "Boolean", None)
            )
        ]
        
        timeline = Timeline(periods=timeline_periods, granularity="dag")
        timeline_value = TimelineValue(timeline=timeline)
        
        # Set the kenmerk as a timeline
        context.set_timeline_kenmerk(werknemer, "actief", timeline_value)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Get the result timeline
        result = werknemer.timeline_attributen.get("aantal werkdagen")
        
        # Verify it's a timeline
        self.assertIsInstance(result, TimelineValue)
        
        # Check the period
        self.assertEqual(len(result.timeline.periods), 1)
        
        # Year 2024 - should have 214 days (March 1 to October 1)
        year_period = result.timeline.periods[0]
        self.assertEqual(year_period.start_date, date(2024, 1, 1))
        self.assertEqual(year_period.end_date, date(2025, 1, 1))
        self.assertEqual(year_period.value.value, Decimal(214))
        self.assertEqual(year_period.value.unit, "dagen per jaar")


if __name__ == "__main__":
    unittest.main()