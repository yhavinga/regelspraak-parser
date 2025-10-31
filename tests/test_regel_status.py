"""Test cases for regel status conditions (is gevuurd/is inconsistent)."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.units import UnitRegistry


class TestRegelStatus(unittest.TestCase):
    """Test regel status conditions functionality."""

    def setUp(self):
        """Set up test fixtures."""
        self.unit_registry = UnitRegistry()

    def test_regel_status_parsing(self):
        """Test parsing of regel status conditions."""
        # First test simple parsing to ensure grammar works
        code = """
        Objecttype de Persoon
            de leeftijd Numeriek;

        Regel test regel
            geldig altijd
                De leeftijd van een persoon moet berekend worden als 25 indien regelversie basisregel is gevuurd.
        """
        
        # Test that the model parses successfully 
        model = parse_text(code)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.regels), 1)
        
        # Test that the rule contains a regel status condition
        regel = model.regels[0]
        self.assertIsNotNone(regel.voorwaarde)
        # The condition should parse successfully (this tests the grammar fix)

    def test_regel_is_gevuurd_false(self):
        """Test 'regel X is gevuurd' when rule hasn't fired."""
        code = """
        Objecttype de Persoon
            de leeftijd Numeriek;
            het is volwassen kenmerk (bezittelijk);

        Regel basisregel
            geldig altijd
                Een persoon is volwassen indien zijn leeftijd groter is dan 18.

        Regel controleregel
            geldig altijd
                Een persoon is volwassen indien regelversie basisregel is gevuurd.
        """
        
        # Parse the model
        model = parse_text(code)
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        evaluator = Evaluator(context)
        
        # Create a person instance (young person, rule won't fire)
        person = RuntimeObject(
            object_type_naam="Persoon",
            instance_id="person1"
        )
        person.attributen["leeftijd"] = Value(value=16, datatype="Numeriek")
        context.add_object(person)
        
        # Execute rules for the person
        context.current_instance = person
        
        # Execute the basis regel first (should not fire due to age)
        basis_regel = model.regels[0]  # "basisregel"
        evaluator.evaluate_rule(basis_regel)
        
        # Check that the rule was NOT marked as executed
        self.assertFalse(context.is_rule_executed("basisregel"))
        
        # Execute the controle regel (should not fire because basis regel didn't fire)
        controle_regel = model.regels[1]  # "controleregel"  
        evaluator.evaluate_rule(controle_regel)
        
        # The controle regel should also not have executed
        self.assertFalse(context.is_rule_executed("controleregel"))
        
        # The person should NOT have is_volwassen = True
        self.assertFalse(context.get_kenmerk(person, "is volwassen"))

    def test_regel_is_inconsistent_uniek(self):
        """Test 'regel X is inconsistent' for uniqueness consistency rule."""
        code = """
        Objecttype de Persoon (mv: Personen)
            de burgerservicenummer Tekst;
            fout kenmerk (bezittelijk);

        Consistentieregel uniekheidcontrole
            De burgerservicenummers van alle Personen moeten uniek zijn.

        Regel controleregel
            geldig altijd
                Een persoon heeft fout indien regelversie uniekheidcontrole is inconsistent.
        """
        
        # Parse the model
        model = parse_text(code)
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        evaluator = Evaluator(context)
        
        # Create two persons with the same BSN (violates uniqueness)
        person1 = RuntimeObject(
            object_type_naam="Persoon",
            instance_id="person1"
        )
        person1.attributen["burgerservicenummer"] = Value(value="123456789", datatype="Tekst")
        context.add_object(person1)
        
        person2 = RuntimeObject(
            object_type_naam="Persoon", 
            instance_id="person2"
        )
        person2.attributen["burgerservicenummer"] = Value(value="123456789", datatype="Tekst")
        context.add_object(person2)
        
        # Execute the consistency rule
        consistency_rule = model.regels[0]  # "uniekheid controle"
        context.current_instance = person1  # Set current instance for rule execution
        evaluator.evaluate_rule(consistency_rule)
        
        # Check that the consistency rule found an inconsistency
        self.assertTrue(context.is_rule_inconsistent("uniekheidcontrole"))
        
        # Execute the controle regel to verify it detects the inconsistency
        controle_regel = model.regels[1]  # "controleregel"
        evaluator.evaluate_rule(controle_regel)
        
        # The controle regel should have executed
        self.assertTrue(context.is_rule_executed("controleregel"))


if __name__ == '__main__':
    unittest.main()