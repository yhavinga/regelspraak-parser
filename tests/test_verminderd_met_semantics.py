"""Test operator semantics for 'min' vs 'verminderd met' per spec 6.3."""
import unittest
from decimal import Decimal

from tests.test_base import RegelSpraakTestCase
from regelspraak.parsing import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.engine import Evaluator


class TestVerminderdMetSemantics(RegelSpraakTestCase):
    """Test different empty value handling for 'min' vs 'verminderd met' operators."""
    
    def setUp(self):
        """Set up test cases."""
        super().setUp()
        
    def test_min_operator_empty_values(self):
        """Test 'min' operator treats empty as 0."""
        model_text = """
        Objecttype de Bedrag
            de waarde Numeriek met eenheid EUR;
            de korting Numeriek met eenheid EUR;
            de resultaat_min Numeriek met eenheid EUR;
        
        Regel TestMin
        geldig altijd
            De resultaat_min van een Bedrag moet gesteld worden op zijn waarde min zijn korting.
        """
        
        model = parse_text(model_text)
        context = RuntimeContext(domain_model=model)
        
        # Test case 1: leeg min leeg = 0
        bedrag1 = RuntimeObject(object_type_naam="Bedrag", instance_id="b1")
        # Initialize attributes as empty (None value)
        bedrag1.attributen["waarde"] = Value(None, "Numeriek", "EUR")
        bedrag1.attributen["korting"] = Value(None, "Numeriek", "EUR")
        context.add_object(bedrag1)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # min operator should treat empty as 0, so leeg min leeg = 0
        self.assertEqual(bedrag1.attributen["resultaat_min"].value, 0)
        self.assertEqual(bedrag1.attributen["resultaat_min"].unit, "EUR")
        
        # Test case 2: leeg min 4 = -4
        bedrag2 = RuntimeObject(object_type_naam="Bedrag", instance_id="b2")
        bedrag2.attributen["waarde"] = Value(None, "Numeriek", "EUR")
        bedrag2.attributen["korting"] = Value(4, "Numeriek", "EUR")
        context.add_object(bedrag2)
        
        evaluator.execute_model(model)
        self.assertEqual(bedrag2.attributen["resultaat_min"].value, -4)
        
        # Test case 3: 5 min leeg = 5
        bedrag3 = RuntimeObject(object_type_naam="Bedrag", instance_id="b3")
        bedrag3.attributen["waarde"] = Value(5, "Numeriek", "EUR")
        bedrag3.attributen["korting"] = Value(None, "Numeriek", "EUR")
        context.add_object(bedrag3)
        
        evaluator.execute_model(model)
        self.assertEqual(bedrag3.attributen["resultaat_min"].value, 5)
        
    def test_verminderd_met_operator_empty_values(self):
        """Test 'verminderd met' returns empty when left is empty."""
        model_text = """
        Objecttype de Bedrag
            de waarde Numeriek met eenheid EUR;
            de korting Numeriek met eenheid EUR;
            de resultaat_verminderd Numeriek met eenheid EUR;
        
        Regel TestVerminderdMet
        geldig altijd
            De resultaat_verminderd van een Bedrag moet gesteld worden op zijn waarde verminderd met zijn korting.
        """
        
        model = parse_text(model_text)
        context = RuntimeContext(domain_model=model)
        
        # Test case 1: leeg verminderd met leeg = leeg
        bedrag1 = RuntimeObject(object_type_naam="Bedrag", instance_id="b1")
        # Initialize attributes as empty (None value)
        bedrag1.attributen["waarde"] = Value(None, "Numeriek", "EUR")
        bedrag1.attributen["korting"] = Value(None, "Numeriek", "EUR")
        context.add_object(bedrag1)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # verminderd met should return empty when left is empty
        self.assertIsNone(bedrag1.attributen["resultaat_verminderd"].value)
        
        # Test case 2: leeg verminderd met 4 = leeg
        bedrag2 = RuntimeObject(object_type_naam="Bedrag", instance_id="b2")
        bedrag2.attributen["waarde"] = Value(None, "Numeriek", "EUR")
        bedrag2.attributen["korting"] = Value(4, "Numeriek", "EUR")
        context.add_object(bedrag2)
        
        evaluator.execute_model(model)
        self.assertIsNone(bedrag2.attributen["resultaat_verminderd"].value)
        
        # Test case 3: 7 verminderd met leeg = 7
        bedrag3 = RuntimeObject(object_type_naam="Bedrag", instance_id="b3")
        bedrag3.attributen["waarde"] = Value(7, "Numeriek", "EUR")
        bedrag3.attributen["korting"] = Value(None, "Numeriek", "EUR")
        context.add_object(bedrag3)
        
        evaluator.execute_model(model)
        self.assertEqual(bedrag3.attributen["resultaat_verminderd"].value, 7)
        
        # Test case 4: 7 verminderd met 4 = 3
        bedrag4 = RuntimeObject(object_type_naam="Bedrag", instance_id="b4")
        bedrag4.attributen["waarde"] = Value(7, "Numeriek", "EUR")
        bedrag4.attributen["korting"] = Value(4, "Numeriek", "EUR")
        context.add_object(bedrag4)
        
        evaluator.execute_model(model)
        self.assertEqual(bedrag4.attributen["resultaat_verminderd"].value, 3)
    
    def test_verminderd_met_decimal_places(self):
        """Test that 'verminderd met' preserves highest decimal places."""
        model_text = """
        Objecttype de Prijs
            de basis Numeriek met eenheid EUR;
            de korting Numeriek met eenheid EUR;
            de eindprijs Numeriek met eenheid EUR;
        
        Regel BerekenEindprijs
        geldig altijd
            De eindprijs van een Prijs moet gesteld worden op zijn basis verminderd met zijn korting.
        """
        
        model = parse_text(model_text)
        context = RuntimeContext(domain_model=model)
        
        prijs = RuntimeObject(object_type_naam="Prijs", instance_id="p1")
        prijs.attributen["basis"] = Value(Decimal("10.50"), "Numeriek", "EUR")
        prijs.attributen["korting"] = Value(Decimal("2.125"), "Numeriek", "EUR")
        context.add_object(prijs)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Result should have 3 decimal places (highest from inputs)
        self.assertEqual(prijs.attributen["eindprijs"].value, Decimal("8.375"))


if __name__ == '__main__':
    unittest.main()