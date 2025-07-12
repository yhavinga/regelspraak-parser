#!/usr/bin/env python3
"""Test the specific failing patterns to understand the issue."""

import unittest
from tests.test_base import RegelSpraakTestCase

class TestFailingPatterns(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regelSpraakDocument'
    
    def test_subordinate_clause_pattern(self):
        """Test the pattern 'dat hij een recht op korting heeft'."""
        regelspraak_code = """
        Objecttype Passagier
            het dagen aantal Numeriek;
            het recht op korting kenmerk;
        
        Regel Test
            geldig altijd
                Het dagen aantal van een passagier moet gesteld worden op
                het aantal dagen in de maand dat hij een recht op korting heeft.
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()
    
    def test_multi_word_kenmerk_definition(self):
        """Test defining a kenmerk with multiple words."""
        regelspraak_code = """
        Objecttype Test
            is met vakantie kenmerk;
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()
    
    def test_alternative_kenmerk_pattern(self):
        """Test if we can work around with different kenmerk naming."""
        regelspraak_code = """
        Objecttype Passagier
            het dagen aantal Numeriek;
            heeft korting kenmerk;
        
        Regel Test
            geldig altijd
                Het dagen aantal van een passagier moet gesteld worden op
                het aantal dagen in de maand dat hij heeft korting.
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()


if __name__ == "__main__":
    unittest.main()