import unittest
from tests.test_base import RegelSpraakTestCase

class RegelBegrenzingTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regel'

    def test_minimum_begrenzing(self):
        """Test that a minimum bounding expression can be parsed."""
        input_text = """
        Regel test minimum begrenzing
        geldig altijd
            de uitkomst van een berekening moet berekend worden als 10,567, met een minimum van 5.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_maximum_begrenzing(self):
        """Test that a maximum bounding expression can be parsed."""
        input_text = """
        Regel test maximum begrenzing
        geldig altijd
            de uitkomst van een berekening moet berekend worden als 10,567, met een maximum van 15.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_minimum_maximum_begrenzing(self):
        """Test that a combined min-max bounding expression can be parsed."""
        input_text = """
        Regel test combined begrenzing
        geldig altijd
            de uitkomst van een berekening moet berekend worden als 10,567, met een minimum van 5 en met een maximum van 15.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_begrenzing_with_expression(self):
        """Test bounding applied to an expression."""
        input_text = """
        Regel test begrenzing with expression
        geldig altijd
            de uitkomst van een berekening moet berekend worden als 
                (10 plus 5,42), met een minimum van (2 maal 3) en met een maximum van 20.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 