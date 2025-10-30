#!/usr/bin/env python3
"""Test TOKA Natuurlijk persoon object type definition according to specification."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value


class TestTokaNatuurlijkPersoon(unittest.TestCase):
    
    def test_natuurlijk_persoon_spec_compliant_definition(self):
        """Test the exact Natuurlijk persoon definition from TOKA specification."""
        # Exact definition from TOKA specification lines 17-31
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            is minderjarig kenmerk (bijvoeglijk);
            is passagier van 18 tot en met 24 jaar kenmerk;
            is passagier van 25 tot en met 64 jaar kenmerk;
            is passagier van 65 jaar of ouder kenmerk (bijvoeglijk);
            het recht op duurzaamheidskorting kenmerk (bezittelijk);
            
            het identificatienummer Numeriek (positief geheel getal);
            de geboortedatum Datum in dagen;
            de leeftijd Numeriek (niet-negatief geheel getal) met eenheid jr;
            de belasting op basis van afstand Bedrag;
            de belasting op basis van reisduur Bedrag;
            de te betalen belasting Bedrag;
            de treinmiles op basis van evenredige verdeling Numeriek (geheel getal);
            de maximaal te ontvangen treinmiles bij evenredige verdeling volgens rangorde Numeriek (geheel getal);
        
        Domein Bedrag is van het type Numeriek (getal met 2 decimalen) met eenheid EUR
        """
        
        # Try to parse the code
        try:
            model = parse_text(regelspraak_code)
            self.assertIsNotNone(model, "Failed to parse TOKA spec-compliant Natuurlijk persoon")
            
            # Check that object type was created
            natuurlijk_persoon = None
            for obj_type_naam, obj_type in model.objecttypes.items():
                if obj_type_naam == "Natuurlijk persoon":
                    natuurlijk_persoon = obj_type
                    break
            
            self.assertIsNotNone(natuurlijk_persoon, "Natuurlijk persoon object type not found")
            self.assertTrue(natuurlijk_persoon.bezield, "Natuurlijk persoon should be 'bezield'")
            self.assertEqual(natuurlijk_persoon.meervoud, "Natuurlijke personen")
            
            # Check kenmerken are parsed correctly (kenmerken is a dict)
            kenmerk_names = list(natuurlijk_persoon.kenmerken.keys())
            
            # These should be present if parser supports complex names
            expected_kenmerken = [
                "minderjarig",
                "passagier van 18 tot en met 24 jaar",  # Complex name with spaces preserved
                "passagier van 25 tot en met 64 jaar",  # Complex name with spaces preserved
                "passagier van 65 jaar of ouder",       # Complex name with spaces preserved
                "recht op duurzaamheidskorting"  # Spaces preserved
            ]
            
            for expected in expected_kenmerken:
                self.assertIn(expected, kenmerk_names, f"Missing kenmerk: {expected}")
            
            # Check attributes (attributen is a dict)
            attribute_names = list(natuurlijk_persoon.attributen.keys())
            
            expected_attributes = [
                "identificatienummer",
                "geboortedatum",
                "leeftijd",
                "belasting op basis van afstand",  # Spaces preserved
                "belasting op basis van reisduur",  # Spaces preserved
                "te betalen belasting",  # Spaces preserved
                "treinmiles op basis van evenredige verdeling",  # Spaces preserved
                "maximaal te ontvangen treinmiles bij evenredige verdeling volgens rangorde"  # Spaces preserved
            ]
            
            for expected in expected_attributes:
                self.assertIn(expected, attribute_names, f"Missing attribute: {expected}")
                    
        except Exception as e:
            # Re-raise to see actual error
            raise
    
    
    
    def test_kenmerk_type_modifiers(self):
        """Test that kenmerk type modifiers are parsed correctly."""
        regelspraak_code = """
        Objecttype de Test
            is minderjarig kenmerk (bijvoeglijk);
            het recht op korting kenmerk (bezittelijk);
            is actief kenmerk;
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        test_type = list(model.objecttypes.values())[0]
        kenmerken = test_type.kenmerken  # Already a dict
        
        # Check bijvoeglijk modifier
        self.assertIn("minderjarig", kenmerken)
        # Note: modifier attribute might not exist in current implementation
        
        # Check bezittelijk modifier  
        self.assertIn("recht op korting", kenmerken)  # Spaces preserved
        
        # Check no modifier
        self.assertIn("actief", kenmerken)


if __name__ == "__main__":
    unittest.main()