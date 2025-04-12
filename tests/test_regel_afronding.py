import unittest
from tests.test_base import RegelSpraakTestCase

class RegelAfrondingTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regel'

    def test_naar_beneden_afgerond(self):
        """Test that a simple rounding expression (naar beneden) can be parsed."""
        input_text = """
        Regel test afronding
        geldig altijd
            de uitkomst van een berekening moet berekend worden als 10,567 naar beneden afgerond op 2 decimalen.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_naar_boven_afgerond(self):
        """Test that a simple rounding expression (naar boven) can be parsed."""
        input_text = """
        Regel test afronding
        geldig altijd
            de uitkomst van een berekening moet berekend worden als 10,567 naar boven afgerond op 2 decimalen.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_rekenkundig_afgerond(self):
        """Test that a simple rounding expression (rekenkundig) can be parsed."""
        input_text = """
        Regel test afronding
        geldig altijd
            de uitkomst van een berekening moet berekend worden als 10,567 rekenkundig afgerond op 2 decimalen.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_richting_nul_afgerond(self):
        """Test that a simple rounding expression (richting nul) can be parsed."""
        input_text = """
        Regel test afronding
        geldig altijd
            de uitkomst van een berekening moet berekend worden als 10,567 richting nul afgerond op 2 decimalen.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_weg_van_nul_afgerond(self):
        """Test that a simple rounding expression (weg van nul) can be parsed."""
        input_text = """
        Regel test afronding
        geldig altijd
            de uitkomst van een berekening moet berekend worden als 10,567 weg van nul afgerond op 2 decimalen.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        
    def test_afronding_with_expression(self):
        """Test rounding combined with an expression."""
        input_text = """
        Regel test afronding
        geldig altijd
            de uitkomst van een berekening moet berekend worden als 
                (10 plus 5,42) naar beneden afgerond op 0 decimalen.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 