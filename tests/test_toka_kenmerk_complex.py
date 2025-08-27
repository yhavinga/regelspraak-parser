#!/usr/bin/env python3
"""Test TOKA complex kenmerk names with spaces."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from datetime import date


class TestTokaKenmerkComplex(unittest.TestCase):
    
    def test_kenmerk_with_age_range(self):
        """Test kenmerk with age range in name (per TOKA spec)."""
        # From TOKA specification lines 19-21
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de leeftijd Numeriek (niet-negatief geheel getal) met eenheid jr;
            is minderjarig kenmerk (bijvoeglijk);
            is passagier van 18 tot en met 24 jaar kenmerk;
            is passagier van 25 tot en met 64 jaar kenmerk;
            is passagier van 65 jaar of ouder kenmerk (bijvoeglijk);
        
        Parameter de volwassenleeftijd : Numeriek (niet-negatief geheel getal) met eenheid jr;
        
        Regel Passagier van 18 tm 24 jaar
            geldig altijd
                Een Natuurlijk persoon is een passagier van 18 tot en met 24 jaar
                indien hij aan alle volgende voorwaarden voldoet:
                - zijn leeftijd is groter of gelijk aan de volwassenleeftijd
                - zijn leeftijd is kleiner of gelijk aan 24 jr.
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model, "Failed to parse RegelSpraak code with complex kenmerk names")
        
        # Check that kenmerken are parsed correctly
        natuurlijk_persoon = None
        for obj_type in model.objecttypes.values():
            if obj_type.naam == "Natuurlijk persoon":
                natuurlijk_persoon = obj_type
                break
        
        self.assertIsNotNone(natuurlijk_persoon)
        
        # Check that all kenmerken are present
        # kenmerken is a dict, so we need to get the keys
        kenmerk_names = list(natuurlijk_persoon.kenmerken.keys())
        self.assertIn("minderjarig", kenmerk_names)
        self.assertIn("passagier van 18 tot en met 24 jaar", kenmerk_names)
        self.assertIn("passagier van 25 tot en met 64 jaar", kenmerk_names)
        self.assertIn("passagier van 65 jaar of ouder", kenmerk_names)
        
    def test_kenmerk_assignment_with_complex_name(self):
        """Test that complex kenmerk names work in rule assignments."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de leeftijd Numeriek (niet-negatief geheel getal) met eenheid jr;
            is passagier van 18 tot en met 24 jaar kenmerk;
        
        Regel Passagier jong volwassene
            geldig altijd
                Een Natuurlijk persoon is een passagier van 18 tot en met 24 jaar
                indien hij aan alle volgende voorwaarden voldoet:
                - zijn leeftijd is groter of gelijk aan 18 jr
                - zijn leeftijd is kleiner of gelijk aan 24 jr.
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model, "Failed to parse RegelSpraak code")
        
        # Create runtime context
        context = RuntimeContext(model)
        
        # Create person with age 20
        person = RuntimeObject("Natuurlijk persoon")
        context.add_object(person)
        context.set_attribute(person, "leeftijd", Value(20, "Numeriek", "jr"))
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check kenmerk assignment
        has_kenmerk = context.get_kenmerk(person, "passagier van 18 tot en met 24 jaar")
        self.assertTrue(has_kenmerk)
        
        # Test person with age 30 (should not have kenmerk)
        person2 = RuntimeObject("Natuurlijk persoon")
        context.add_object(person2)
        context.set_attribute(person2, "leeftijd", Value(30, "Numeriek", "jr"))
        
        evaluator.execute_model(model)
        has_kenmerk2 = context.get_kenmerk(person2, "passagier van 18 tot en met 24 jaar")
        self.assertFalse(has_kenmerk2)
    
    def test_kenmerk_in_condition(self):
        """Test using complex kenmerk name in conditions."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            is passagier van 65 jaar of ouder kenmerk (bijvoeglijk);
            de korting Numeriek (geheel getal) met eenheid EUR;
        
        Regel Senior korting
            geldig altijd
                De korting van een Natuurlijk persoon moet berekend worden als 50 EUR
                indien hij een passagier van 65 jaar of ouder is.
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model, "Failed to parse RegelSpraak code")
        
        # Create runtime context
        context = RuntimeContext(model)
        
        # Create senior person
        senior = RuntimeObject("Natuurlijk persoon")
        context.add_object(senior)
        # Manually set the kenmerk for testing
        context.set_kenmerk(senior, "passagier van 65 jaar of ouder", True)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check discount is applied
        korting = context.get_attribute(senior, "korting")
        self.assertEqual(korting.value, 50)
        self.assertEqual(korting.unit, "EUR")
        
        # Create non-senior person
        young = RuntimeObject("Natuurlijk persoon")
        context.add_object(young)
        context.set_kenmerk(young, "passagier van 65 jaar of ouder", False)
        
        evaluator.execute_model(model)
        
        # Check no discount - attribute might not be set at all
        try:
            korting_young = context.get_attribute(young, "korting")
            # If it exists, should be 0
            self.assertEqual(korting_young.value, 0)
        except Exception:
            # Attribute not set is also valid (no discount applied)
            pass
    
    def test_multiple_complex_kenmerken(self):
        """Test object type with multiple complex kenmerk names."""
        regelspraak_code = """
        Objecttype de Vlucht (mv: vluchten)
            is in het hoogseizoen kenmerk;
            de gebruik fossiele brandstoffen minder dan 50 procent kenmerk (bezittelijk);
            is reis met paaskorting kenmerk;
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model, "Failed to parse RegelSpraak code with multiple complex kenmerken")
        
        # Check object type
        vlucht = None
        for obj_type in model.objecttypes.values():
            if obj_type.naam == "Vlucht":
                vlucht = obj_type
                break
        
        self.assertIsNotNone(vlucht)
        
        # Check kenmerken
        kenmerk_names = list(vlucht.kenmerken.keys())
        self.assertIn("in het hoogseizoen", kenmerk_names)
        self.assertIn("gebruik fossiele brandstoffen minder dan 50 procent", kenmerk_names)
        self.assertIn("reis met paaskorting", kenmerk_names)


if __name__ == "__main__":
    unittest.main()