"""Tests for tijdsevenredig deel (time-proportional) functionality.

Based on specification section 7.3.2 - Omrekening met gebroken jaren of maanden.
"""

import unittest
from datetime import datetime, date
from decimal import Decimal

from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, TimelineValue
from regelspraak.ast import Timeline, Period


class TestTijdsevenredigDeel(unittest.TestCase):
    """Test tijdsevenredig deel calculations per specification examples."""
    
    def test_tijdsevenredig_per_maand_example_1(self):
        """Test Example 1 from spec: Monthly proportional with full and partial months."""
        code = """
        Objecttype de Passagier
            de belastingvermindering Numeriek (getal met 2 decimalen) met eenheid € voor elke maand;
            het recht op belastingvermindering kenmerk (bezittelijk) voor elke dag;

        Parameter de STANDAARD_BELASTINGVERMINDERING : Numeriek (getal met 2 decimalen) met eenheid € voor elk jaar;

        Regel Belastingvermindering
            geldig altijd
            De belastingvermindering van een passagier moet gesteld worden op
            (het tijdsevenredig deel per maand van de STANDAARD_BELASTINGVERMINDERING
            gedurende de tijd dat hij een recht op belastingvermindering heeft).
        """
        
        model = parse_text(code)
        context = RuntimeContext(model)
        
        # Create passagier
        passagier = RuntimeObject("Passagier")
        context.add_object(passagier)
        
        # Set STANDAARD_BELASTINGVERMINDERING timeline
        # 12 €/mnd from 1-1-2024 to 1-1-2025
        # 18 €/mnd from 1-1-2025
        param_timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2025, 1, 1),
                    value=Value(value=Decimal("12"), datatype="Numeriek", unit="€")
                ),
                Period(
                    start_date=datetime(2025, 1, 1),
                    end_date=datetime(2026, 1, 1),
                    value=Value(value=Decimal("18"), datatype="Numeriek", unit="€")
                )
            ],
            granularity="jaar"
        )
        context.set_timeline_parameter("STANDAARD_BELASTINGVERMINDERING", TimelineValue(timeline=param_timeline))
        
        # Set recht op belastingvermindering from 1-1-2024 to 8-2-2025
        recht_timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2025, 2, 8),
                    value=Value(value=True, datatype="Boolean", unit=None)
                ),
                Period(
                    start_date=datetime(2025, 2, 8),
                    end_date=datetime(2026, 1, 1),
                    value=Value(value=False, datatype="Boolean", unit=None)
                )
            ],
            granularity="dag"
        )
        context.set_timeline_kenmerk(passagier, "recht op belastingvermindering", TimelineValue(timeline=recht_timeline))
        
        # Execute the rule
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check results
        result = passagier.timeline_attributen.get("belastingvermindering")
        self.assertIsNotNone(result)
        self.assertIsInstance(result, TimelineValue)
        
        # From spec: Should have values:
        # - 12 €/mnd from 1-1-2024 to 1-1-2025 (full months)
        # - 18 €/mnd from 1-1-2025 to 1-2-2025 (full month)
        # - 4.5 €/mnd from 1-2-2025 to 1-3-2025 (7/28 * 18 = 4.5)
        
        # Check January 2024 (full month)
        # Set evaluation date and check value
        context.evaluation_date = datetime(2024, 1, 15)
        jan_2024_value = passagier.get_timeline_attribute("belastingvermindering", datetime(2024, 1, 15))
        self.assertEqual(jan_2024_value.value, Decimal("12"))
        
        # Check January 2025 (full month)
        # Check January 2025 (full month)
        jan_2025_value = passagier.get_timeline_attribute("belastingvermindering", datetime(2025, 1, 15))
        self.assertEqual(jan_2025_value.value, Decimal("18"))
        
        # Check February 2025 (partial month: 7 days out of 28)
        # 7/28 * 18 = 4.5
        # Check February 2025 (partial month: 7 days out of 28)
        feb_2025_value = passagier.get_timeline_attribute("belastingvermindering", datetime(2025, 2, 15))
        self.assertAlmostEqual(float(feb_2025_value.value), 4.5, places=2)
    
    def test_tijdsevenredig_per_jaar_example_2(self):
        """Test Example 2 from spec: Yearly proportional calculation."""
        code = """
        Objecttype de Passagier
            de belastingvermindering Numeriek (getal met 2 decimalen) met eenheid € voor elk jaar;
            het recht op belastingvermindering kenmerk (bezittelijk) voor elke dag;

        Parameter de STANDAARD_BELASTINGVERMINDERING : Numeriek (getal met 2 decimalen) met eenheid € voor elk jaar;

        Regel Belastingvermindering
            geldig altijd
            De belastingvermindering van een passagier moet gesteld worden op
            (het tijdsevenredig deel per jaar van de STANDAARD_BELASTINGVERMINDERING
            gedurende de tijd dat hij een recht op belastingvermindering heeft).
        """
        
        model = parse_text(code)
        context = RuntimeContext(model)
        
        # Create passagier
        passagier = RuntimeObject("Passagier")
        context.add_object(passagier)
        
        # Set STANDAARD_BELASTINGVERMINDERING timeline
        # 12 €/mnd from 1-1-2024 to 1-1-2025
        # 18 €/mnd from 1-1-2025
        param_timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2025, 1, 1),
                    value=Value(value=Decimal("12"), datatype="Numeriek", unit="€")
                ),
                Period(
                    start_date=datetime(2025, 1, 1),
                    end_date=datetime(2026, 1, 1),
                    value=Value(value=Decimal("18"), datatype="Numeriek", unit="€")
                )
            ],
            granularity="jaar"
        )
        context.set_timeline_parameter("STANDAARD_BELASTINGVERMINDERING", TimelineValue(timeline=param_timeline))
        
        # Set recht op belastingvermindering from 1-1-2024 to 8-2-2025 (38 days into 2025)
        recht_timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2025, 2, 8),
                    value=Value(value=True, datatype="Boolean", unit=None)
                ),
                Period(
                    start_date=datetime(2025, 2, 8),
                    end_date=datetime(2026, 1, 1),
                    value=Value(value=False, datatype="Boolean", unit=None)
                )
            ],
            granularity="dag"
        )
        context.set_timeline_kenmerk(passagier, "recht op belastingvermindering", TimelineValue(timeline=recht_timeline))
        
        # Execute the rule
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check results
        result = passagier.timeline_attributen.get("belastingvermindering")
        self.assertIsNotNone(result)
        self.assertIsInstance(result, TimelineValue)
        
        # From spec: Should have values:
        # - 12 €/mnd for year 2024 (full year)
        # - 1.875 €/mnd for year 2025 (38/365 * 18 ≈ 1.875)
        
        # Check 2024 (full year)
        # Check 2024 (full year)
        year_2024_value = passagier.get_timeline_attribute("belastingvermindering", datetime(2024, 6, 15))
        self.assertEqual(year_2024_value.value, Decimal("12"))
        
        # Check 2025 (partial year: 38 days out of 365)
        # 38/365 * 18 ≈ 1.875
        # Check 2025 (partial year: 38 days out of 365)
        year_2025_value = passagier.get_timeline_attribute("belastingvermindering", datetime(2025, 6, 15))
        self.assertAlmostEqual(float(year_2025_value.value), 1.875, places=2)
    
    def test_tijdsevenredig_with_unit_conversion(self):
        """Test Example 3 from spec: Tijdsevenredig with unit conversion €/jr to €/mnd."""
        code = """
        Objecttype de Passagier
            de belastingvermindering Numeriek (getal met 2 decimalen) met eenheid € voor elke maand;
            het recht op belastingvermindering kenmerk (bezittelijk) voor elke dag;

        Parameter de STANDAARD_BELASTINGVERMINDERING : Numeriek (getal met 2 decimalen) met eenheid € voor elk jaar;

        Regel Belastingvermindering
            geldig altijd
            De belastingvermindering van een passagier moet gesteld worden op
            (het tijdsevenredig deel per maand van de STANDAARD_BELASTINGVERMINDERING
            gedurende de tijd dat hij een recht op belastingvermindering heeft).
        """
        
        model = parse_text(code)
        context = RuntimeContext(model)
        
        # Create passagier
        passagier = RuntimeObject("Passagier")
        context.add_object(passagier)
        
        # Set STANDAARD_BELASTINGVERMINDERING timeline with €/jr unit
        # 120 €/jr from 1-1-2024 to 1-1-2025 (converts to 10 €/mnd)
        # 180 €/jr from 1-1-2025 (converts to 15 €/mnd)
        param_timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2025, 1, 1),
                    value=Value(value=Decimal("120"), datatype="Numeriek", unit="€")
                ),
                Period(
                    start_date=datetime(2025, 1, 1),
                    end_date=datetime(2026, 1, 1),
                    value=Value(value=Decimal("180"), datatype="Numeriek", unit="€")
                )
            ],
            granularity="jaar"
        )
        context.set_timeline_parameter("STANDAARD_BELASTINGVERMINDERING", TimelineValue(timeline=param_timeline))
        
        # Set recht op belastingvermindering from 1-1-2024 to 8-2-2025
        recht_timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2025, 2, 8),
                    value=Value(value=True, datatype="Boolean", unit=None)
                ),
                Period(
                    start_date=datetime(2025, 2, 8),
                    end_date=datetime(2026, 1, 1),
                    value=Value(value=False, datatype="Boolean", unit=None)
                )
            ],
            granularity="dag"
        )
        context.set_timeline_kenmerk(passagier, "recht op belastingvermindering", TimelineValue(timeline=recht_timeline))
        
        # Execute the rule
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check results - with unit conversion from €/jr to €/mnd
        result = passagier.timeline_attributen.get("belastingvermindering")
        self.assertIsNotNone(result)
        self.assertIsInstance(result, TimelineValue)
        
        # From spec: After unit conversion (divide by 12):
        # - 10 €/mnd from 1-1-2024 to 1-1-2025
        # - 15 €/mnd from 1-1-2025 to 1-2-2025
        # - 3.75 €/mnd from 1-2-2025 to 1-3-2025 (7/28 * 15 = 3.75)
        
        # Check January 2024 (after unit conversion)
        # Set evaluation date and check value
        context.evaluation_date = datetime(2024, 1, 15)
        jan_2024_value = passagier.get_timeline_attribute("belastingvermindering", datetime(2024, 1, 15))
        self.assertAlmostEqual(float(jan_2024_value.value), 10.0, places=2)
        
        # Check January 2025 (after unit conversion)
        # Check January 2025 (full month)
        jan_2025_value = passagier.get_timeline_attribute("belastingvermindering", datetime(2025, 1, 15))
        self.assertAlmostEqual(float(jan_2025_value.value), 15.0, places=2)
        
        # Check February 2025 (partial month with unit conversion)
        # 7/28 * 15 = 3.75
        # Check February 2025 (partial month: 7 days out of 28)
        feb_2025_value = passagier.get_timeline_attribute("belastingvermindering", datetime(2025, 2, 15))
        self.assertAlmostEqual(float(feb_2025_value.value), 3.75, places=2)


if __name__ == "__main__":
    unittest.main()