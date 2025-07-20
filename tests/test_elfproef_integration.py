"""Integration tests for elfproef validation predicate."""
import unittest
from src.regelspraak.parsing import parse_text
from src.regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from src.regelspraak.engine import Evaluator
from src.regelspraak.units import UnitRegistry


class TestElfproefIntegration(unittest.TestCase):
    """Test elfproef validation functionality."""
    
    def setUp(self):
        """Set up test environment."""
        self.unit_registry = UnitRegistry()
    
    def test_valid_bsn_passes_elfproef(self):
        """Test that a valid BSN passes the elfproef check."""
        model_text = """
        Objecttype de Natuurlijk persoon
            het burgerservicenummer Tekst;
            is BSNgeldig kenmerk (bijvoeglijk);
            
        Regel check BSN validiteit
            geldig altijd
                Een Natuurlijk persoon is BSNgeldig
                indien zijn burgerservicenummer voldoet aan de elfproef.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add person with valid BSN
        # Example valid BSN: 123456782
        # Validation: 1*9 + 2*8 + 3*7 + 4*6 + 5*5 + 6*4 + 7*3 + 8*2 + 2*1 = 9+16+21+24+25+24+21+16+2 = 158
        # 158 % 11 = 4 (not valid, let me recalculate)
        # Actually, let's use a known valid test BSN: 999999990
        # 9*9 + 9*8 + 9*7 + 9*6 + 9*5 + 9*4 + 9*3 + 9*2 + 0*1 = 81+72+63+54+45+36+27+18+0 = 396
        # 396 % 11 = 0 (valid!)
        person = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        person.attributen["burgerservicenummer"] = Value(value="999999990", datatype="Tekst")
        context.add_object(person)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check result
        self.assertEqual(person.kenmerken.get("BSNgeldig"), True)
    
    def test_invalid_bsn_fails_elfproef(self):
        """Test that an invalid BSN fails the elfproef check."""
        model_text = """
        Objecttype de Natuurlijk persoon
            het burgerservicenummer Tekst;
            is BSNgeldig kenmerk (bijvoeglijk);
            
        Regel check BSN validiteit
            geldig altijd
                Een Natuurlijk persoon is BSNgeldig
                indien zijn burgerservicenummer voldoet aan de elfproef.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add person with invalid BSN
        # Example: 111111111 -> 1*9 + 1*8 + 1*7 + 1*6 + 1*5 + 1*4 + 1*3 + 1*2 + 1*1 = 45
        # 45 % 11 = 1 (not 0, so invalid)
        person = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        person.attributen["burgerservicenummer"] = Value(value="111111111", datatype="Tekst")
        context.add_object(person)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check result - should not have set heeft geldig BSN to true
        self.assertNotEqual(person.kenmerken.get("BSNgeldig"), True)
    
    def test_elfproef_with_negative_check(self):
        """Test 'voldoet niet aan de elfproef' predicate."""
        model_text = """
        Objecttype de Natuurlijk persoon
            het burgerservicenummer Tekst;
            is BSNongeldig kenmerk (bijvoeglijk);
            
        Regel check BSN ongeldigheid
            geldig altijd
                Een Natuurlijk persoon is BSNongeldig
                indien zijn burgerservicenummer voldoet niet aan de elfproef.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add person with invalid BSN
        # Example: 111111111 -> 1*9 + 1*8 + 1*7 + 1*6 + 1*5 + 1*4 + 1*3 + 1*2 + 1*1 = 45
        # 45 % 11 = 1 (not 0, so invalid)
        person = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        person.attributen["burgerservicenummer"] = Value(value="111111111", datatype="Tekst")
        context.add_object(person)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check result - should have set heeft ongeldig BSN to true
        self.assertEqual(person.kenmerken.get("BSNongeldig"), True)
    
    def test_elfproef_with_non_numeric_input(self):
        """Test elfproef with non-numeric input."""
        model_text = """
        Objecttype de Natuurlijk persoon
            het burgerservicenummer Tekst;
            is BSNgeldig kenmerk (bijvoeglijk);
            
        Regel check BSN validiteit
            geldig altijd
                Een Natuurlijk persoon is BSNgeldig
                indien zijn burgerservicenummer voldoet aan de elfproef.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add person with non-numeric BSN
        person = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        person.attributen["burgerservicenummer"] = Value(value="ABC123DEF", datatype="Tekst")
        context.add_object(person)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check result - should not have set heeft geldig BSN to true
        self.assertNotEqual(person.kenmerken.get("BSNgeldig"), True)
    
    def test_elfproef_with_wrong_length(self):
        """Test elfproef with wrong length number."""
        model_text = """
        Objecttype de Natuurlijk persoon
            het burgerservicenummer Tekst;
            is BSNgeldig kenmerk (bijvoeglijk);
            
        Regel check BSN validiteit
            geldig altijd
                Een Natuurlijk persoon is BSNgeldig
                indien zijn burgerservicenummer voldoet aan de elfproef.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add person with too short BSN
        person = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        person.attributen["burgerservicenummer"] = Value(value="1234567", datatype="Tekst")  # Only 7 digits
        context.add_object(person)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check result - should not have set heeft geldig BSN to true
        self.assertNotEqual(person.kenmerken.get("BSNgeldig"), True)
    
    def test_elfproef_with_empty_value(self):
        """Test elfproef with empty/None value."""
        model_text = """
        Objecttype de Natuurlijk persoon
            het burgerservicenummer Tekst;
            is BSNgeldig kenmerk (bijvoeglijk);
            
        Regel check BSN validiteit
            geldig altijd
                Een Natuurlijk persoon is BSNgeldig
                indien zijn burgerservicenummer voldoet aan de elfproef.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add person without BSN
        person = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        # Don't set burgerservicenummer
        context.add_object(person)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check result - should not have set heeft geldig BSN to true
        self.assertNotEqual(person.kenmerken.get("BSNgeldig"), True)


if __name__ == '__main__':
    unittest.main()