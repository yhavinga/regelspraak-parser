"""Tests for timeline period definition syntax (vanaf, tot, van...tot, etc.)."""
import unittest
from datetime import datetime, date
from regelspraak.parsing import parse_text
from regelspraak.ast import DomainModel, Period, Timeline
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, TimelineValue
from regelspraak.engine import Evaluator
from regelspraak.errors import RuntimeError


class TestTimelinePeriodDefinitions(unittest.TestCase):
    """Test timeline period definition functionality."""
    
    def _execute_rules_and_get_worker(self, rules_text):
        """Helper method to parse rules, execute them, and return the worker instance."""
        # Always include the base model definition
        model_text = f"""
        Parameter het rekenjaar : Numeriek;
        Parameter de rekendatum : Datum;
        
        Objecttype de Werknemer
            het salaris Numeriek (getal) met eenheid euro voor elke maand;
            de bonus Bedrag voor elk jaar;
            de naam Tekst;
        
        {rules_text}
        """
        model = parse_text(model_text)
        
        # Create context and evaluator
        context = RuntimeContext(domain_model=model)
        evaluator = Evaluator(context)
        
        # Set evaluation date and parameters
        context.evaluation_date = datetime(2024, 6, 15)
        context.set_parameter("rekenjaar", 2024)
        context.set_parameter("rekendatum", datetime(2024, 6, 15))
        # Set basisSalaris if it's defined in the model
        print(f"Model parameters: {list(model.parameters.keys())}")
        for param_name, param in model.parameters.items():
            if param_name.lower() == "basissalaris":
                context.set_parameter(param_name, Value(value=3000, datatype="Numeriek", unit="euro"))
                print(f"Set parameter {param_name} to 3000 euro")
        
        # Create a test worker
        worker = RuntimeObject(object_type_naam="Werknemer", instance_id="w1")
        context.add_object(worker)
        
        # Execute rules
        results = evaluator.execute_model(model)
        # Results is a dict - check if there were any errors
        for rule_name, rule_results in results.items():
            for result in rule_results:
                if result.get('status') == 'error':
                    self.fail(f"Rule execution error in {rule_name}: {result.get('message')}")
        
        return worker, context
    
    def test_basic_timeline_assignment(self):
        """Test basic timeline assignment without period definition."""
        rules_text = """
        Regel salarisverhoging
            geldig altijd
            Het salaris van de Werknemer moet gesteld worden op 3500.
        """
        worker, context = self._execute_rules_and_get_worker(rules_text)
        
        # This should work without period definitions
        # The value would apply to the entire timeline
        
    def test_vanaf_period_literal_date(self):
        """Test 'vanaf' period definition with literal date."""
        rules_text = """
        Regel salarisverhoging
            geldig altijd
            Het salaris van de Werknemer moet gesteld worden op 3500 vanaf 01-07-2024.
        """
        worker, context = self._execute_rules_and_get_worker(rules_text)
        
        # Check timeline value
        timeline_val = worker.timeline_attributen.get("salaris")
        self.assertIsNotNone(timeline_val)
        self.assertEqual(len(timeline_val.timeline.periods), 1)
        
        period = timeline_val.timeline.periods[0]
        self.assertEqual(period.start_date, datetime(2024, 7, 1))
        self.assertEqual(period.end_date, datetime(2200, 1, 1))  # Far future
        self.assertEqual(period.value.value, 3500)
        self.assertEqual(period.value.unit, "euro")
    
    def test_tot_period_literal_date(self):
        """Test 'tot' period definition with literal date."""
        rules_text = """
        Regel oude_salaris
            geldig altijd
            Het salaris van de Werknemer moet gesteld worden op 3000 tot 01-07-2024.
        """
        worker, context = self._execute_rules_and_get_worker(rules_text)
        
        # Check timeline value
        timeline_val = worker.timeline_attributen.get("salaris")
        self.assertIsNotNone(timeline_val)
        
        period = timeline_val.timeline.periods[0]
        self.assertEqual(period.start_date, datetime(1900, 1, 1))  # Far past
        self.assertEqual(period.end_date, datetime(2024, 7, 1))  # Exclusive
        self.assertEqual(period.value.value, 3000)
    
    def test_tot_en_met_period_literal_date(self):
        """Test 'tot en met' period definition with literal date."""
        rules_text = """
        Regel oude_salaris_inclusief
            geldig altijd
            Het salaris van de Werknemer moet gesteld worden op 3000 tot en met 30-06-2024.
        """
        worker, context = self._execute_rules_and_get_worker(rules_text)
        
        # Check timeline value
        timeline_val = worker.timeline_attributen.get("salaris")
        self.assertIsNotNone(timeline_val)
        
        period = timeline_val.timeline.periods[0]
        self.assertEqual(period.start_date, datetime(1900, 1, 1))
        # End date should be July 1st to include June 30th
        self.assertEqual(period.end_date, datetime(2024, 7, 1))
        self.assertEqual(period.value.value, 3000)
    
    def test_van_tot_period(self):
        """Test 'van...tot' period definition."""
        rules_text = """
        Regel tijdelijk_salaris
            geldig altijd
            Het salaris van de Werknemer moet gesteld worden op 3200 van 01-04-2024 tot 01-07-2024.
        """
        worker, context = self._execute_rules_and_get_worker(rules_text)
        
        # Check timeline value
        timeline_val = worker.timeline_attributen.get("salaris")
        self.assertIsNotNone(timeline_val)
        
        period = timeline_val.timeline.periods[0]
        self.assertEqual(period.start_date, datetime(2024, 4, 1))
        self.assertEqual(period.end_date, datetime(2024, 7, 1))  # Exclusive
        self.assertEqual(period.value.value, 3200)
    
    def test_van_tot_en_met_period(self):
        """Test 'van...tot en met' period definition."""
        rules_text = """
        Regel tijdelijk_salaris_inclusief
            geldig altijd
            Het salaris van de Werknemer moet gesteld worden op 3200 van 01-04-2024 tot en met 30-06-2024.
        """
        worker, context = self._execute_rules_and_get_worker(rules_text)
        
        # Check timeline value
        timeline_val = worker.timeline_attributen.get("salaris")
        self.assertIsNotNone(timeline_val)
        
        period = timeline_val.timeline.periods[0]
        self.assertEqual(period.start_date, datetime(2024, 4, 1))
        self.assertEqual(period.end_date, datetime(2024, 7, 1))  # Inclusive of June 30
        self.assertEqual(period.value.value, 3200)
    
    def test_vanaf_rekenjaar(self):
        """Test 'vanaf' with REKENJAAR."""
        rules_text = """
        Regel bonus_vanaf_rekenjaar
            geldig altijd
            De bonus van de Werknemer moet gesteld worden op 5000 vanaf Rekenjaar.
        """
        worker, context = self._execute_rules_and_get_worker(rules_text)
        
        # Check timeline value
        timeline_val = worker.timeline_attributen.get("bonus")
        self.assertIsNotNone(timeline_val)
        
        period = timeline_val.timeline.periods[0]
        # REKENJAAR 2024 should translate to January 1, 2024
        self.assertEqual(period.start_date, datetime(2024, 1, 1))
        self.assertEqual(period.value.value, 5000)
    
    def test_period_with_expression(self):
        """Test period definition with calculated expression."""
        rules_text = """
        Parameter het basisSalaris : Numeriek (getal) met eenheid euro;
        
        Regel salaris_met_toeslag
            geldig altijd
            Het salaris van de Werknemer moet berekend worden als het basisSalaris plus 500 euro vanaf 01-07-2024.
        """
        worker, context = self._execute_rules_and_get_worker(rules_text)
        
        # Check timeline value
        timeline_val = worker.timeline_attributen.get("salaris")
        self.assertIsNotNone(timeline_val)
        
        period = timeline_val.timeline.periods[0]
        self.assertEqual(period.start_date, datetime(2024, 7, 1))
        self.assertEqual(period.value.value, 3500)  # 3000 + 500
    
    def test_multiple_period_rules(self):
        """Test multiple rules setting different periods for same timeline attribute."""
        rules_text = """
        Regel salaris_eerste_helft
            geldig altijd
            Het salaris van de Werknemer moet gesteld worden op 3000 tot 01-07-2024.
        
        Regel salaris_tweede_helft
            geldig altijd
            Het salaris van de Werknemer moet gesteld worden op 3500 vanaf 01-07-2024.
        """
        worker, context = self._execute_rules_and_get_worker(rules_text)
        
        # Check timeline value - should have both periods
        timeline_val = worker.timeline_attributen.get("salaris")
        self.assertIsNotNone(timeline_val)
        
        # Note: The actual behavior depends on how set_timeline_attribute handles
        # multiple timeline assignments. This test documents the expected behavior.
        # The implementation may need to merge timeline periods appropriately.
    
    def test_period_with_attribute_reference(self):
        """Test period definition using attribute reference for date."""
        # This tests the grammar support for attribute references in dateExpression
        # The full implementation would require more complex date attribute handling
        pass  # Placeholder for future implementation


if __name__ == '__main__':
    unittest.main()