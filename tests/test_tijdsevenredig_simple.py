"""Simple test for tijdsevenredig deel functionality without temporal conditions."""

import unittest
from datetime import datetime, date
from decimal import Decimal

from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, TimelineValue
from regelspraak.ast import Timeline, Period


class TestTijdsevenredigSimple(unittest.TestCase):
    """Test basic tijdsevenredig deel calculations."""
    
    def test_tijdsevenredig_basic_monthly(self):
        """Test basic monthly proportional calculation without conditions."""
        code = """
        Objecttype de Passagier
            de belastingvermindering Numeriek (getal met 2 decimalen) met eenheid € voor elke maand;
            de standaard_vermindering Numeriek (getal met 2 decimalen) met eenheid € voor elk jaar;

        Regel Belastingvermindering
            geldig altijd
            De belastingvermindering van een passagier moet berekend worden als
            het tijdsevenredig deel per maand van zijn standaard_vermindering.
        """
        
        model = parse_text(code)
        context = RuntimeContext(model)
        
        # Create passagier
        passagier = RuntimeObject("Passagier")
        context.add_object(passagier)
        
        # Set standaard_vermindering timeline (yearly values)
        vermindering_periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2025, 1, 1),
                value=Value(value=Decimal("12"), datatype="Numeriek", unit="€")
            ),
            Period(
                start_date=datetime(2025, 1, 1),
                end_date=datetime(2025, 3, 1),
                value=Value(value=Decimal("18"), datatype="Numeriek", unit="€")
            )
        ]
        vermindering_timeline = TimelineValue(Timeline(periods=vermindering_periods, granularity="jaar"))
        context.set_timeline_attribute(passagier, "standaard_vermindering", vermindering_timeline)
        
        # Execute the rule
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check results
        result = passagier.timeline_attributen.get("belastingvermindering")
        self.assertIsNotNone(result)
        self.assertIsInstance(result, TimelineValue)
        
        # Check January 2024 value
        jan_2024_value = result.get_value_at(datetime(2024, 1, 15))
        self.assertIsNotNone(jan_2024_value)
        # Full month, so value should be 12
        self.assertEqual(jan_2024_value.value, Decimal("12"))
        
        # Check January 2025 value
        jan_2025_value = result.get_value_at(datetime(2025, 1, 15))
        self.assertIsNotNone(jan_2025_value)
        # Full month, so value should be 18
        self.assertEqual(jan_2025_value.value, Decimal("18"))
    
    def test_tijdsevenredig_basic_yearly(self):
        """Test basic yearly proportional calculation."""
        code = """
        Objecttype de Passagier
            de belastingvermindering Numeriek (getal met 2 decimalen) met eenheid € voor elk jaar;
            de standaard_vermindering Numeriek (getal met 2 decimalen) met eenheid € voor elk jaar;

        Regel Belastingvermindering
            geldig altijd
            De belastingvermindering van een passagier moet berekend worden als
            het tijdsevenredig deel per jaar van zijn standaard_vermindering.
        """
        
        model = parse_text(code)
        context = RuntimeContext(model)
        
        # Create passagier
        passagier = RuntimeObject("Passagier")
        context.add_object(passagier)
        
        # Set standaard_vermindering timeline
        vermindering_periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 6, 1),  # Half year
                value=Value(value=Decimal("100"), datatype="Numeriek", unit="€")
            ),
            Period(
                start_date=datetime(2024, 6, 1),
                end_date=datetime(2025, 1, 1),  # Other half year
                value=Value(value=Decimal("200"), datatype="Numeriek", unit="€")
            )
        ]
        vermindering_timeline = TimelineValue(Timeline(periods=vermindering_periods, granularity="jaar"))
        context.set_timeline_attribute(passagier, "standaard_vermindering", vermindering_timeline)
        
        # Execute the rule
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check results
        result = passagier.timeline_attributen.get("belastingvermindering")
        self.assertIsNotNone(result)
        self.assertIsInstance(result, TimelineValue)
        
        # Check value for first half of 2024
        # 152 days (Jan-May) out of 366 (leap year) * 100 ≈ 41.53
        h1_2024_value = result.get_value_at(datetime(2024, 3, 15))
        self.assertIsNotNone(h1_2024_value)
        self.assertAlmostEqual(float(h1_2024_value.value), 41.53, places=1)
        
        # Check value for second half of 2024
        # 214 days (June-Dec) out of 366 * 200 ≈ 116.94
        h2_2024_value = result.get_value_at(datetime(2024, 9, 15))
        self.assertIsNotNone(h2_2024_value)
        self.assertAlmostEqual(float(h2_2024_value.value), 116.94, places=0)


if __name__ == "__main__":
    unittest.main()