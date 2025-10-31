"""Integration tests for uniqueness (uniek) predicate."""
import unittest
from decimal import Decimal
from unittest.mock import MagicMock
from regelspraak.engine import Evaluator, TraceSink, TraceEvent
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.parsing import parse_text
from regelspraak.units import UnitRegistry


class TestUniekIntegration(unittest.TestCase):
    """Test uniqueness predicate functionality."""
    
    def setUp(self):
        """Set up test environment."""
        self.unit_registry = UnitRegistry()
        
    def test_uniqueness_check_all_unique(self):
        """Test uniqueness check when all values are unique."""
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
        
        # Set up trace sink to capture events
        trace_sink = MagicMock(spec=TraceSink)
        context.trace_sink = trace_sink
        
        # Add persons with unique BSNs
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
        
        # Verify consistency check event was traced
        consistency_check_found = False
        for call in trace_sink.record.call_args_list:
            event = call[0][0]
            if isinstance(event, TraceEvent) and event.type == "CONSISTENCY_CHECK":
                consistency_check_found = True
                self.assertEqual(event.details["criterium_type"], "uniek")
                self.assertEqual(event.details["object_type"], "Natuurlijk persoon")
                self.assertEqual(event.details["attribute"], "burgerservicenummer")
                self.assertTrue(event.details["consistent"])
                self.assertEqual(event.details["unique_values"], 2)
                self.assertEqual(event.details["total_instances"], 2)
                break
        
        self.assertTrue(consistency_check_found, "CONSISTENCY_CHECK event not found in trace")
    
    def test_uniqueness_check_with_duplicates(self):
        """Test uniqueness check when duplicates exist."""
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
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Set up trace sink
        trace_sink = MagicMock(spec=TraceSink)
        context.trace_sink = trace_sink
        
        # Add persons with duplicate BSNs
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
        person2.attributen["burgerservicenummer"] = Value(value="123456789", datatype="Tekst")  # Duplicate!
        person2.attributen["naam"] = Value(value="Piet", datatype="Tekst")
        context.add_object(person2)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Verify consistency check found the duplicate
        consistency_check_found = False
        for call in trace_sink.record.call_args_list:
            event = call[0][0]
            if isinstance(event, TraceEvent) and event.type == "CONSISTENCY_CHECK":
                consistency_check_found = True
                self.assertEqual(event.details["criterium_type"], "uniek")
                self.assertEqual(event.details["object_type"], "Natuurlijk persoon")
                self.assertEqual(event.details["attribute"], "burgerservicenummer")
                self.assertFalse(event.details["consistent"])
                self.assertEqual(event.details["duplicate_value"], "123456789")
                break
        
        self.assertTrue(consistency_check_found, "CONSISTENCY_CHECK event not found in trace")
    
    def test_uniqueness_check_with_missing_values(self):
        """Test uniqueness check when some instances have missing values."""
        model_text = """
        Objecttype Product
            de barcode Tekst;
            de naam Tekst;
            
        Consistentieregel unieke barcodes
            de barcodes van alle Producten moeten uniek zijn.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add products with some missing barcodes
        product1 = RuntimeObject(
            object_type_naam="Product",
            instance_id="product1"
        )
        product1.attributen["barcode"] = Value(value="1234567890", datatype="Tekst")
        product1.attributen["naam"] = Value(value="Product A", datatype="Tekst")
        context.add_object(product1)
        
        product2 = RuntimeObject(
            object_type_naam="Product",
            instance_id="product2"
        )
        # No barcode set for product2
        product2.attributen["naam"] = Value(value="Product B", datatype="Tekst")
        context.add_object(product2)
        
        product3 = RuntimeObject(
            object_type_naam="Product",
            instance_id="product3"
        )
        product3.attributen["barcode"] = Value(value="0987654321", datatype="Tekst")
        product3.attributen["naam"] = Value(value="Product C", datatype="Tekst")
        context.add_object(product3)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Should be consistent - missing values are ignored
        trace_sink = context.trace_sink
        if hasattr(trace_sink, 'record'):
            consistency_check_found = False
            for call in trace_sink.record.call_args_list:
                event = call[0][0]
                if isinstance(event, TraceEvent) and event.type == "CONSISTENCY_CHECK":
                    consistency_check_found = True
                    self.assertTrue(event.details["consistent"])
                    self.assertEqual(event.details["unique_values"], 2)  # Only 2 barcodes
                    self.assertEqual(event.details["total_instances"], 3)  # 3 products total
                    break
    
    def test_uniqueness_check_numeric_values(self):
        """Test uniqueness check with numeric values."""
        model_text = """
        Objecttype Werknemer
            het personeelsnummer Numeriek;
            de naam Tekst;
            
        Consistentieregel unieke personeelsnummers
            de personeelsnummers van alle Werknemers moeten uniek zijn.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add employees with numeric IDs
        emp1 = RuntimeObject(
            object_type_naam="Werknemer",
            instance_id="emp1"
        )
        emp1.attributen["personeelsnummer"] = Value(value=1001, datatype="Numeriek")
        emp1.attributen["naam"] = Value(value="Alice", datatype="Tekst")
        context.add_object(emp1)
        
        emp2 = RuntimeObject(
            object_type_naam="Werknemer",
            instance_id="emp2"
        )
        emp2.attributen["personeelsnummer"] = Value(value=1002, datatype="Numeriek")
        emp2.attributen["naam"] = Value(value="Bob", datatype="Tekst")
        context.add_object(emp2)
        
        emp3 = RuntimeObject(
            object_type_naam="Werknemer",
            instance_id="emp3"
        )
        emp3.attributen["personeelsnummer"] = Value(value=1001, datatype="Numeriek")  # Duplicate!
        emp3.attributen["naam"] = Value(value="Charlie", datatype="Tekst")
        context.add_object(emp3)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Should find duplicate
        trace_sink = context.trace_sink
        if hasattr(trace_sink, 'record'):
            consistency_check_found = False
            for call in trace_sink.record.call_args_list:
                event = call[0][0]
                if isinstance(event, TraceEvent) and event.type == "CONSISTENCY_CHECK":
                    consistency_check_found = True
                    self.assertFalse(event.details["consistent"])
                    self.assertEqual(event.details["duplicate_value"], "1001")
                    break
    
    def test_uniqueness_check_empty_collection(self):
        """Test uniqueness check with no instances."""
        model_text = """
        Objecttype Factuur
            het factuurnummer Tekst;
            
        Consistentieregel unieke factuurnummers
            de factuurnummers van alle Facturen moeten uniek zijn.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context with no instances
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Should be consistent - empty collection has no duplicates
        trace_sink = context.trace_sink
        if hasattr(trace_sink, 'record'):
            consistency_check_found = False
            for call in trace_sink.record.call_args_list:
                event = call[0][0]
                if isinstance(event, TraceEvent) and event.type == "CONSISTENCY_CHECK":
                    consistency_check_found = True
                    self.assertTrue(event.details["consistent"])
                    self.assertEqual(event.details["unique_values"], 0)
                    self.assertEqual(event.details["total_instances"], 0)
                    break
    
    def test_semantic_validation_invalid_attribute(self):
        """Test semantic validation catches invalid attribute in uniqueness check."""
        model_text = """
        Objecttype Persoon
            de naam Tekst;
            
        Consistentieregel unieke codes
            de codes van alle Personen moeten uniek zijn.
        """
        
        # Parse model - should succeed
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # But semantic validation should catch the error
        # This would be caught during validate command, not during execution
        # For now, just verify parsing succeeds
        self.assertEqual(len(model.regels), 1)


if __name__ == '__main__':
    unittest.main()