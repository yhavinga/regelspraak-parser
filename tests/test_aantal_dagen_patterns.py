#!/usr/bin/env python3
"""Test various patterns for aantal dagen in to understand what works."""

import unittest
from tests.test_base import RegelSpraakTestCase

class TestAantalDagenPatterns(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regelSpraakDocument'
    
    def test_pattern_1_simple_boolean(self):
        """Test with simple boolean expression after dat."""
        regelspraak_code = """
        Objecttype Test
            het dagen aantal Numeriek;
        
        Regel Test1
            geldig altijd
                Het dagen aantal van een test moet gesteld worden op
                het aantal dagen in de maand dat waar.
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()
    
    def test_pattern_2_is_kenmerk(self):
        """Test with 'is kenmerk' pattern after dat."""
        regelspraak_code = """
        Objecttype Test
            het dagen aantal Numeriek;
            is actief kenmerk;
        
        Regel Test2
            geldig altijd
                Het dagen aantal van een test moet gesteld worden op
                het aantal dagen in de maand dat hij is actief.
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()
    
    def test_pattern_3_heeft_kenmerk(self):
        """Test with 'heeft kenmerk' pattern after dat."""
        regelspraak_code = """
        Objecttype Test
            het dagen aantal Numeriek;
            heeft recht kenmerk;
        
        Regel Test3
            geldig altijd
                Het dagen aantal van een test moet gesteld worden op
                het aantal dagen in de maand dat hij heeft recht.
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()
    
    def test_pattern_4_attribute_reference(self):
        """Test with attribute reference after dat."""
        regelspraak_code = """
        Objecttype Test
            het dagen aantal Numeriek;
            het actief Boolean;
        
        Regel Test4
            geldig altijd
                Het dagen aantal van een test moet gesteld worden op
                het aantal dagen in de maand dat het actief van de test.
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()
    
    def test_pattern_5_comparison(self):
        """Test with comparison after dat."""
        regelspraak_code = """
        Objecttype Test
            het dagen aantal Numeriek;
            het waarde Numeriek;
        
        Regel Test5
            geldig altijd
                Het dagen aantal van een test moet gesteld worden op
                het aantal dagen in de maand dat zijn waarde groter is dan 10.
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()


if __name__ == "__main__":
    unittest.main()