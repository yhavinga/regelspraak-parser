#!/usr/bin/env python3
"""Test aantal dagen in function with simpler patterns."""

import unittest
from tests.test_base import RegelSpraakTestCase

class TestAantalDagenSimple(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regelSpraakDocument'
    
    def test_aantal_dagen_in_maand_with_standard_heeft_pattern(self):
        """Test aantal dagen in with standard 'heeft' pattern."""
        regelspraak_code = """
        Objecttype Passagier
            het aantal dagen korting Numeriek (geheel getal);
            het recht op korting kenmerk;
        
        Regel Aantal dagen korting
            geldig altijd
                Het aantal dagen korting van een passagier moet gesteld worden op
                het aantal dagen in de maand dat hij heeft recht op korting.
        """
        
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()
    
    def test_aantal_dagen_in_jaar_with_is_pattern(self):
        """Test aantal dagen in with 'is' kenmerk pattern."""
        regelspraak_code = """
        Objecttype Passagier
            het vakantiedagen Numeriek (geheel getal);
            is minderjarig kenmerk;
        
        Regel Vakantiedagen
            geldig altijd
                Het vakantiedagen van een passagier moet gesteld worden op
                het aantal dagen in het jaar dat hij is minderjarig.
        """
        
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()
    
    def test_aantal_dagen_with_true_expression(self):
        """Test aantal dagen in with always-true expression."""
        regelspraak_code = """
        Objecttype Persoon
            het werkdagen Numeriek (geheel getal);
        
        Regel Tel werkdagen
            geldig altijd
                Het werkdagen van een persoon moet gesteld worden op
                het aantal dagen in de maand dat waar.
        """
        
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()


if __name__ == "__main__":
    unittest.main()