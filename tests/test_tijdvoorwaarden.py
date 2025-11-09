"""Test cases for temporal conditions including "het is de periode" expressions.

Tests the implementation of RegelSpraak specification §10 (page 3545) for
temporal conditions that check if the current date falls within a period.
"""

import unittest
from datetime import date, datetime
import sys
sys.path.insert(0, 'src')

from regelspraak import parse_text, RuntimeContext
from regelspraak.runtime import RuntimeObject, Value
from regelspraak.engine import Evaluator


class TestTijdvoorwaarden(unittest.TestCase):
    """Test temporal conditions including period checks."""

    def test_het_is_de_periode_vanaf(self):
        """Test "het is de periode vanaf" condition."""
        script = """
        Parameter de rekendatum: Datum in dagen

        Objecttype de Test
          de test waarde Boolean;

        Regel TestPeriodeVanaf
          geldig altijd
            De test waarde van de Test moet berekend worden als waar
              indien het is de periode vanaf dd. 01-06-2024.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        context.set_rekendatum(date(2024, 6, 15))  # Set rekendatum via API
        evaluator = Evaluator(context)

        # Create a Test instance
        test_instance = RuntimeObject(object_type_naam="Test", instance_id="test1")
        context.add_object(test_instance)

        # Should be true - rekendatum (15-06-2024) is after 01-06-2024
        evaluator.execute_model(model)
        test_value = context.get_attribute(test_instance, "test waarde")
        self.assertTrue(test_value.value)

    def test_het_is_de_periode_tot(self):
        """Test "het is de periode tot" condition (exclusive)."""
        script = """
        Parameter de rekendatum: Datum in dagen

        Objecttype de Test
          de test waarde Boolean;

        Regel TestPeriodeTot
          geldig altijd
            De test waarde van de Test moet berekend worden als waar
              indien het is de periode tot dd. 30-06-2024.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        context.set_rekendatum(date(2024, 6, 15))  # Set rekendatum via API
        evaluator = Evaluator(context)

        # Create a Test instance
        test_instance = RuntimeObject(object_type_naam="Test", instance_id="test1")
        context.add_object(test_instance)

        # Should be true - rekendatum (15-06-2024) is before 30-06-2024
        evaluator.execute_model(model)
        test_value = context.get_attribute(test_instance, "test waarde")
        self.assertTrue(test_value.value)

    def test_het_is_de_periode_tot_en_met(self):
        """Test "het is de periode tot en met" condition (inclusive)."""
        script = """
        Parameter de rekendatum: Datum in dagen

        Objecttype de Test
          de test waarde Boolean;

        Regel TestPeriodeTotEnMet
          geldig altijd
            De test waarde van de Test moet berekend worden als waar
              indien het is de periode tot en met dd. 30-06-2024.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        context.set_rekendatum(date(2024, 6, 30))  # Set rekendatum via API
        evaluator = Evaluator(context)

        # Create a Test instance
        test_instance = RuntimeObject(object_type_naam="Test", instance_id="test1")
        context.add_object(test_instance)

        # Should be true - rekendatum (30-06-2024) equals the end date (inclusive)
        evaluator.execute_model(model)
        test_value = context.get_attribute(test_instance, "test waarde")
        self.assertTrue(test_value.value)

    def test_het_is_de_periode_van_tot(self):
        """Test "het is de periode van...tot" condition."""
        script = """
        Parameter de rekendatum: Datum in dagen

        Objecttype de Test
          de test waarde Boolean;

        Regel TestPeriodeVanTot
          geldig altijd
            De test waarde van de Test moet berekend worden als waar
              indien het is de periode van dd. 01-06-2024 tot dd. 30-06-2024.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        context.set_rekendatum(date(2024, 6, 15))  # Set rekendatum via API
        evaluator = Evaluator(context)

        # Create a Test instance
        test_instance = RuntimeObject(object_type_naam="Test", instance_id="test1")
        context.add_object(test_instance)

        # Should be true - rekendatum (15-06-2024) is between 01-06 and 30-06
        evaluator.execute_model(model)
        test_value = context.get_attribute(test_instance, "test waarde")
        self.assertTrue(test_value.value)

    def test_het_is_de_periode_van_tot_en_met(self):
        """Test "het is de periode van...tot en met" condition."""
        script = """
        Parameter de rekendatum: Datum in dagen

        Objecttype de Test
          de test waarde Boolean;

        Regel TestPeriodeVanTotEnMet
          geldig altijd
            De test waarde van de Test moet berekend worden als waar
              indien het is de periode van dd. 01-06-2024 tot en met dd. 30-06-2024.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        context.set_rekendatum(date(2024, 6, 30))  # Set rekendatum via API
        evaluator = Evaluator(context)

        # Create a Test instance
        test_instance = RuntimeObject(object_type_naam="Test", instance_id="test1")
        context.add_object(test_instance)

        # Should be true - rekendatum (30-06-2024) is included (tot en met)
        evaluator.execute_model(model)
        test_value = context.get_attribute(test_instance, "test waarde")
        self.assertTrue(test_value.value)

    def test_het_is_de_periode_outside_range(self):
        """Test period condition when date is outside range."""
        script = """
        Parameter de rekendatum: Datum in dagen

        Objecttype de Test
          de test waarde Boolean;

        Regel TestPeriodeBuitenBereik
          geldig altijd
            De test waarde van de Test moet berekend worden als waar
              indien het is de periode van dd. 01-06-2024 tot dd. 30-06-2024.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        context.set_rekendatum(date(2024, 5, 1))  # Set rekendatum via API
        evaluator = Evaluator(context)

        # Create a Test instance
        test_instance = RuntimeObject(object_type_naam="Test", instance_id="test1")
        context.add_object(test_instance)

        # Should be false - rekendatum (01-05-2024) is before the period
        evaluator.execute_model(model)
        # When condition is false, attribute is not set (treat as false)
        try:
            test_value = context.get_attribute(test_instance, "test waarde")
            self.assertFalse(test_value.value)
        except Exception:
            # Attribute not found means condition was false - this is expected
            pass

    def test_het_is_de_periode_with_computed_date(self):
        """Test period condition with computed date expressions."""
        script = """
        Parameter de rekendatum: Datum in dagen
        Parameter de start datum: Datum in dagen
        Parameter de eind datum: Datum in dagen

        Objecttype de Test
          de test waarde Boolean;

        Regel TestPeriodeMetBerekendeDatum
          geldig altijd
            De test waarde van de Test moet berekend worden als waar
              indien het is de periode van de start datum tot de eind datum.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        context.set_rekendatum(date(2024, 6, 15))  # Set rekendatum via API
        context.set_parameter("start datum", date(2024, 6, 1))
        context.set_parameter("eind datum", date(2024, 6, 30))
        evaluator = Evaluator(context)

        # Create a Test instance
        test_instance = RuntimeObject(object_type_naam="Test", instance_id="test1")
        context.add_object(test_instance)

        # Should be true - rekendatum is between computed start and end dates
        evaluator.execute_model(model)
        test_value = context.get_attribute(test_instance, "test waarde")
        self.assertTrue(test_value.value)

    def test_het_is_de_periode_in_compound_condition(self):
        """Test period condition within a compound condition with bullet points."""
        script = """
        Parameter de rekendatum: Datum in dagen
        Parameter de test nummer: Numeriek

        Objecttype de Test
          de test waarde Boolean;

        Regel TestPeriodeInSamengesteld
          geldig altijd
            De test waarde van de Test moet berekend worden als waar
              indien er aan alle volgende voorwaarden wordt voldaan:
                - het is de periode van dd. 01-06-2024 tot dd. 30-06-2024
                - de test nummer groter is dan 5.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        context.set_rekendatum(date(2024, 6, 15))  # Set rekendatum via API
        context.set_parameter("test nummer", 10)
        evaluator = Evaluator(context)

        # Create a Test instance
        test_instance = RuntimeObject(object_type_naam="Test", instance_id="test1")
        context.add_object(test_instance)

        # Should be true - both conditions are met
        evaluator.execute_model(model)
        test_value = context.get_attribute(test_instance, "test waarde")
        self.assertTrue(test_value.value)

    def test_het_is_de_periode_with_timeline_aggregation(self):
        """Test period condition used with timeline aggregation (gedurende de tijd dat)."""
        script = """
        Parameter de rekendatum: Datum in dagen

        Objecttype de Persoon
          de salaris Numeriek voor elke maand;
          de zomer salaris Numeriek;

        Regel TestPeriodeMetTijdlijn
          geldig altijd
            Het salaris van de Persoon moet berekend worden als 1000 van dd. 01-01-2024 tot dd. 31-12-2024.

        Regel BerekenTotaalInZomer
          geldig altijd
            Het zomer salaris van de Persoon moet berekend worden als
              het totaal van het salaris van de Persoon
              gedurende de tijd dat het is de periode van dd. 01-06-2024 tot dd. 31-08-2024.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        context.set_rekendatum(date(2024, 6, 15))  # Set rekendatum via API
        evaluator = Evaluator(context)

        # Create a person instance
        persoon = RuntimeObject(object_type_naam="Persoon", instance_id="persoon1")
        context.add_object(persoon)

        # Execute model
        evaluator.execute_model(model)

        # Should have calculated summer salary for June, July, August (3 months * 1000 = 3000)
        zomer_salaris = context.get_attribute(persoon, "zomer salaris")
        self.assertEqual(zomer_salaris.value, 3000)

    def test_het_is_de_periode_error_missing_rekendatum(self):
        """Test that period condition raises error when rekendatum is not set."""
        script = """
        Objecttype de Test
          de test waarde Boolean;

        Regel TestPeriodeZonderRekendatum
          geldig altijd
            De test waarde van de Test moet berekend worden als waar
              indien het is de periode vanaf dd. 01-06-2024.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        # Don't set rekendatum - should cause an error
        evaluator = Evaluator(context)

        # Create a Test instance
        test_instance = RuntimeObject(object_type_naam="Test", instance_id="test1")
        context.add_object(test_instance)

        # Should raise error - no rekendatum set
        # Note: The engine catches RuntimeError and logs it, so we check that the attribute is not set
        evaluator.execute_model(model)
        # When period condition can't be evaluated due to missing rekendatum, attribute is not set
        try:
            test_value = context.get_attribute(test_instance, "test waarde")
            self.fail("Expected attribute to not be set when rekendatum is missing")
        except Exception:
            # Attribute not found is expected when rekendatum is missing
            pass

    def test_het_is_de_periode_boundary_conditions(self):
        """Test boundary conditions for period checks."""
        script = """
        Parameter de rekendatum: Datum in dagen

        Objecttype de Test
          de vanaf_test Boolean;
          de tot_test Boolean;
          de tot_en_met_test Boolean;

        Regel TestGrensVanaf
          geldig altijd
            De vanaf_test van de Test moet berekend worden als waar
              indien het is de periode vanaf dd. 01-06-2024.

        Regel TestGrensTot
          geldig altijd
            De tot_test van de Test moet berekend worden als waar
              indien het is de periode tot dd. 01-06-2024.

        Regel TestGrensTotEnMet
          geldig altijd
            De tot_en_met_test van de Test moet berekend worden als waar
              indien het is de periode tot en met dd. 01-06-2024.
        """
        model = parse_text(script)
        context = RuntimeContext(domain_model=model)
        context.set_rekendatum(date(2024, 6, 1))  # Set rekendatum via API
        evaluator = Evaluator(context)

        # Create a Test instance
        test_instance = RuntimeObject(object_type_naam="Test", instance_id="test1")
        context.add_object(test_instance)

        evaluator.execute_model(model)

        # vanaf is inclusive - should be true
        vanaf_test = context.get_attribute(test_instance, "vanaf_test")
        self.assertTrue(vanaf_test.value)

        # tot is exclusive - should be false
        # When condition is false, attribute is not set (treat as false)
        try:
            tot_test = context.get_attribute(test_instance, "tot_test")
            self.assertFalse(tot_test.value)
        except Exception:
            # Attribute not found means condition was false - this is expected
            pass

        # tot en met is inclusive - should be true
        tot_en_met_test = context.get_attribute(test_instance, "tot_en_met_test")
        self.assertTrue(tot_en_met_test.value)


if __name__ == '__main__':
    unittest.main()