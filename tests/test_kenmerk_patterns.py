#!/usr/bin/env python3
"""Test kenmerk definition patterns."""

import unittest
from tests.test_base import RegelSpraakTestCase

class TestKenmerkPatterns(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regelSpraakDocument'
    
    def test_kenmerk_with_het_recht_op(self):
        """Test 'het recht op korting kenmerk'."""
        regelspraak_code = """
        Objecttype Passagier
            het recht op korting kenmerk;
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()
    
    def test_expression_hij_heeft_recht(self):
        """Test expression 'hij heeft recht'."""
        regelspraak_code = """
        Objecttype Passagier
            het dagen aantal Numeriek;
            heeft recht kenmerk;
        
        Regel Test
            geldig altijd
                Het dagen aantal van een passagier moet gesteld worden op 1
                indien hij heeft recht.
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()
    
    def test_heeft_een_recht_pattern(self):
        """Test if 'heeft een recht' works as expression."""
        regelspraak_code = """
        Objecttype Passagier
            het dagen aantal Numeriek;
            heeft recht kenmerk;
        
        Regel Test
            geldig altijd
                Het dagen aantal van een passagier moet gesteld worden op 1
                indien hij heeft een recht.
        """
        tree = self.parse_text(regelspraak_code)
        self.assertNoParseErrors()


if __name__ == "__main__":
    unittest.main()