"""Tests for 'indien' conditional syntax in RegelSpraak rules."""

import unittest
from decimal import Decimal

from regelspraak import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.engine import Evaluator
from regelspraak.errors import ParseError


class TestIndienConditions(unittest.TestCase):
    """Test suite for the 'indien' conditional syntax."""
    
    def test_simple_indien_condition(self):
        """Test a simple 'indien' condition with parameter comparison."""
        text = """
        Parameter de volwassenleeftijd: Numeriek (geheel getal) met eenheid jr
        
        Objecttype de Natuurlijk persoon
            is minderjarig kenmerk (bijvoeglijk);
            de leeftijd Numeriek (geheel getal) met eenheid jr;
        
        Regel Minderjarigheid
            geldig altijd
                Een Natuurlijk persoon is minderjarig
                indien zijn leeftijd kleiner is dan de volwassenleeftijd.
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.regels), 1)
        self.assertIsNotNone(model.regels[0].voorwaarde)
        
        # Test runtime execution
        context = RuntimeContext(domain_model=model)
        context.set_parameter("volwassenleeftijd", 18, unit="jr")
        
        # Test with minor (age 15)
        person1 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p1")
        context.add_object(person1)
        context.set_attribute(person1, "leeftijd", Value(15, datatype="Numeriek", unit="jr"))
        context.set_current_instance(person1)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        self.assertTrue(person1.kenmerken.get('minderjarig'))
        
        # Test with adult (age 20)
        person2 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p2")
        context.add_object(person2)
        context.set_attribute(person2, "leeftijd", Value(20, datatype="Numeriek", unit="jr"))
        context.set_current_instance(person2)
        
        evaluator.execute_model(model)
        
        self.assertFalse(person2.kenmerken.get('minderjarig', False))
    
    def test_indien_with_compound_conditions(self):
        """Test 'indien' with compound conditions using 'alle volgende voorwaarden'."""
        text = """
        Parameter de minimum leeftijd: Numeriek (geheel getal) met eenheid jr
        Parameter de maximum leeftijd: Numeriek (geheel getal) met eenheid jr
        
        Objecttype de Natuurlijk persoon
            is geschikt kenmerk (bijvoeglijk);
            de leeftijd Numeriek (geheel getal) met eenheid jr;
            de nationaliteit Tekst;
        
        Regel GeschiktheidsTest
            geldig altijd
                Een Natuurlijk persoon is geschikt
                indien hij aan alle volgende voorwaarden voldoet:
                    • zijn leeftijd is groter of gelijk aan de minimum leeftijd
                    • zijn leeftijd is kleiner of gelijk aan de maximum leeftijd
                    • zijn nationaliteit is gelijk aan "Nederlandse".
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.regels), 1)
        self.assertIsNotNone(model.regels[0].voorwaarde)
        
        # Test runtime
        context = RuntimeContext(domain_model=model)
        context.set_parameter("minimum leeftijd", 18, unit="jr")
        context.set_parameter("maximum leeftijd", 65, unit="jr")
        
        # Test person who meets all conditions
        person1 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p1")
        context.add_object(person1)
        context.set_attribute(person1, "leeftijd", Value(30, datatype="Numeriek", unit="jr"))
        context.set_attribute(person1, "nationaliteit", Value("Nederlandse", datatype="Tekst"))
        context.set_current_instance(person1)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        self.assertTrue(person1.kenmerken.get('geschikt'))
        
        # Test person who fails age condition
        person2 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p2")
        context.add_object(person2)
        context.set_attribute(person2, "leeftijd", Value(70, datatype="Numeriek", unit="jr"))
        context.set_attribute(person2, "nationaliteit", Value("Nederlandse", datatype="Tekst"))
        context.set_current_instance(person2)
        
        evaluator.execute_model(model)
        
        self.assertFalse(person2.kenmerken.get('geschikt', False))
    
    def test_indien_with_or_conditions(self):
        """Test 'indien' with 'ten minste één van de volgende voorwaarden'."""
        text = """
        Objecttype de Natuurlijk persoon
            is bijzonder kenmerk (bijvoeglijk);
            is student kenmerk (bijvoeglijk);
            is werknemer kenmerk (bijvoeglijk);
            de leeftijd Numeriek (geheel getal) met eenheid jr;
        
        Regel BijzondereStatus
            geldig altijd
                Een Natuurlijk persoon is bijzonder
                indien hij aan ten minste één van de volgende voorwaarden voldoet:
                    • hij is student
                    • hij is werknemer
                    • zijn leeftijd is groter dan 65 jr.
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(domain_model=model)
        
        # Test student (should be bijzonder)
        person1 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p1")
        context.add_object(person1)
        person1.kenmerken['student'] = True
        context.set_attribute(person1, "leeftijd", Value(25, datatype="Numeriek", unit="jr"))
        context.set_current_instance(person1)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        self.assertTrue(person1.kenmerken.get('bijzonder'))
        
        # Test elderly person (should be bijzonder)
        person2 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p2")
        context.add_object(person2)
        context.set_attribute(person2, "leeftijd", Value(70, datatype="Numeriek", unit="jr"))
        context.set_current_instance(person2)
        
        evaluator.execute_model(model)
        
        self.assertTrue(person2.kenmerken.get('bijzonder'))
        
        # Test person who meets no conditions
        person3 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p3")
        context.add_object(person3)
        context.set_attribute(person3, "leeftijd", Value(30, datatype="Numeriek", unit="jr"))
        context.set_current_instance(person3)
        
        evaluator.execute_model(model)
        
        self.assertFalse(person3.kenmerken.get('bijzonder', False))
    
    def test_indien_with_gelijkstelling(self):
        """Test 'indien' with Gelijkstelling (moet berekend worden als)."""
        text = """
        Parameter de basiskorting: Numeriek (getal)
        Parameter de extrakorting: Numeriek (getal)
        
        Objecttype de Klant
            is vip kenmerk (bijvoeglijk);
            de korting Numeriek (getal);
        
        Regel BerekenKorting
            geldig altijd
                De korting van een Klant moet berekend worden als 
                    de basiskorting plus de extrakorting
                indien hij vip is.
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.regels), 1)
        
        context = RuntimeContext(domain_model=model)
        context.set_parameter("basiskorting", Decimal("5"))
        context.set_parameter("extrakorting", Decimal("10"))
        
        # Test VIP customer - should get extra korting
        vip = RuntimeObject(object_type_naam="Klant", instance_id="vip1")
        context.add_object(vip)
        vip.kenmerken['vip'] = True
        context.set_current_instance(vip)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        self.assertEqual(vip.attributen['korting'].value, Decimal("15"))
        
        # Test regular customer - should not get korting (rule condition not met)
        regular = RuntimeObject(object_type_naam="Klant", instance_id="reg1")
        context.add_object(regular)
        # Don't set vip kenmerk, so it's not vip
        context.set_current_instance(regular)
        
        evaluator.execute_model(model)
        
        # Should not have korting attribute set since condition was not met
        self.assertNotIn('korting', regular.attributen)
    
    def disabled_test_indien_with_variables(self):
        """Test 'indien' with variables in 'Daarbij geldt' section."""
        text = """
        Parameter de grens: Numeriek (geheel getal)
        
        Objecttype de Item
            is speciaal kenmerk (bijvoeglijk);
            de waarde Numeriek (geheel getal);
            de score Numeriek (geheel getal);
        
        Regel SpeciaalItem
            geldig altijd
                Een Item is speciaal
                indien X groter is dan de grens.
                Daarbij geldt:
                    X is zijn waarde plus zijn score.
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.regels[0].variabelen), 1)
        
        context = RuntimeContext(domain_model=model)
        context.set_parameter("grens", 100)
        
        # Test item with high combined value
        item1 = RuntimeObject(object_type_naam="Item", instance_id="i1")
        context.add_object(item1)
        context.set_attribute(item1, "waarde", Value(60, datatype="Numeriek"))
        context.set_attribute(item1, "score", Value(50, datatype="Numeriek"))
        context.set_current_instance(item1)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        self.assertTrue(item1.kenmerken.get('speciaal'))
        
        # Test item with low combined value
        item2 = RuntimeObject(object_type_naam="Item", instance_id="i2")
        context.add_object(item2)
        context.set_attribute(item2, "waarde", Value(30, datatype="Numeriek"))
        context.set_attribute(item2, "score", Value(40, datatype="Numeriek"))
        context.set_current_instance(item2)
        
        evaluator.execute_model(model)
        
        self.assertFalse(item2.kenmerken.get('speciaal', False))
    
    def test_indien_with_nested_compound_conditions(self):
        """Test 'indien' with nested compound conditions."""
        text = """
        Objecttype de Natuurlijk persoon
            is complex kenmerk (bijvoeglijk);
            is student kenmerk (bijvoeglijk);
            is werknemer kenmerk (bijvoeglijk);
            de leeftijd Numeriek (geheel getal) met eenheid jr;
            de nationaliteit Tekst;
        
        Regel ComplexeStatus
            geldig altijd
                Een Natuurlijk persoon is complex
                indien hij aan alle volgende voorwaarden voldoet:
                    • zijn nationaliteit is gelijk aan "Nederlandse"
                    • hij voldoet aan ten minste één van de volgende voorwaarden:
                        •• hij is student
                        •• hij is werknemer
                        •• zijn leeftijd is groter dan 65 jr.
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(domain_model=model)
        
        # Test Dutch student (should be complex)
        person1 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p1")
        context.add_object(person1)
        context.set_attribute(person1, "nationaliteit", Value("Nederlandse", datatype="Tekst"))
        person1.kenmerken['student'] = True
        context.set_attribute(person1, "leeftijd", Value(25, datatype="Numeriek", unit="jr"))
        context.set_current_instance(person1)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        self.assertTrue(person1.kenmerken.get('complex'))
        
        # Test non-Dutch student (should not be complex)
        person2 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p2")
        context.add_object(person2)
        context.set_attribute(person2, "nationaliteit", Value("Duitse", datatype="Tekst"))
        person2.kenmerken['student'] = True
        context.set_attribute(person2, "leeftijd", Value(25, datatype="Numeriek", unit="jr"))
        context.set_current_instance(person2)
        
        evaluator.execute_model(model)
        
        self.assertFalse(person2.kenmerken.get('complex', False))


if __name__ == '__main__':
    unittest.main()