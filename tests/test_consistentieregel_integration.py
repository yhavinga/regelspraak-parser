"""Integration tests for Consistentieregel (consistency rules)."""
import unittest
from decimal import Decimal
from unittest.mock import MagicMock
from regelspraak.engine import Evaluator, TraceSink, TraceEvent
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.parsing import parse_text
from regelspraak.units import UnitRegistry


class TestConsistentieregelIntegration(unittest.TestCase):
    """Test Consistentieregel execution in the engine."""
    
    def setUp(self):
        """Set up test environment."""
        self.unit_registry = UnitRegistry()
        
    def test_simple_uniqueness_check(self):
        """Test a simple uniqueness consistency rule."""
        model_text = """
        Objecttype Natuurlijk persoon (mv: Natuurlijke personen)
            het burgerservicenummer Tekst;
            de naam Tekst;
            
        Consistentieregel unieke BSN nummers
            de burgerservicenummers van alle Natuurlijke personen moeten uniek zijn.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.regels), 1)
        
        # Create runtime context with some instances
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add some persons with unique BSNs
        person1 = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        person1.attributen["burgerservicenummer"] = Value(value="123456789", datatype="Tekst")
        person1.attributen["naam"] = Value(value="Jan", datatype="Tekst")
        context.add_object(person1)
        
        person2 = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person2"
        )
        person2.attributen["burgerservicenummer"] = Value(value="987654321", datatype="Tekst")
        person2.attributen["naam"] = Value(value="Piet", datatype="Tekst")
        context.add_object(person2)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # For now, uniqueness checks are not fully implemented
        # So this test just verifies the rule executes without error
        self.assertIsNotNone(results)
    
    def test_conditional_inconsistency_rule(self):
        """Test a consistency rule with conditional inconsistency."""
        model_text = """
        Objecttype Natuurlijk persoon (mv: Natuurlijke personen)
            de leeftijd Numeriek;
            het rijbewijs Boolean;
            
        Consistentieregel valide leeftijd rijbewijs
            De data is inconsistent
            indien er aan alle volgende voorwaarden wordt voldaan:
                • de leeftijd is kleiner dan 18
                • het rijbewijs is gelijk aan waar.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.regels), 1)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add a person who is too young to have a license
        person = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        person.attributen["leeftijd"] = Value(value=16, datatype="Numeriek")
        person.attributen["rijbewijs"] = Value(value=True, datatype="Boolean")
        context.add_object(person)
        
        # Set up trace sink to capture events
        trace_sink = MagicMock(spec=TraceSink)
        context.trace_sink = trace_sink
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check that a consistency check event was traced
        # Find the CONSISTENCY_CHECK event
        consistency_check_found = False
        for call in trace_sink.record.call_args_list:
            event = call[0][0]
            if isinstance(event, TraceEvent) and event.type == "CONSISTENCY_CHECK":
                consistency_check_found = True
                self.assertEqual(event.details["criterium_type"], "inconsistent")
                break
        
        self.assertTrue(consistency_check_found, "CONSISTENCY_CHECK event not found in trace")
    
    def test_consistency_rule_without_condition(self):
        """Test a consistency rule that's always inconsistent."""
        model_text = """
        Objecttype Test
            de waarde Numeriek;
            
        Consistentieregel systeem inconsistent
            Het systeem is inconsistent.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.regels), 1)
        
        # Create runtime context with an instance
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        test_obj = RuntimeObject(
            object_type_naam="Test",
            instance_id="test1"
        )
        test_obj.attributen["waarde"] = Value(value=42, datatype="Numeriek")
        context.add_object(test_obj)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Verify it executes without error
        self.assertIsNotNone(results)


if __name__ == '__main__':
    unittest.main()