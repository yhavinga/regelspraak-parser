import unittest
from tests.test_base import RegelSpraakTestCase

class RegelSpraakDatumFunctiesTest(RegelSpraakTestCase):
    """Test date-related functions in RegelSpraak."""
    
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regel'

    def test_datum_met(self):
        """Test 'de datum met jaar, maand en dag' function (§13.4.16.31)."""
        code = """Regel testDatumMet
            geldig altijd
                de datum van een persoon moet gesteld worden op de datum met jaar, maand en dag(2024, 4, 15).
        """
        tree = self.parse_text(code)
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()
        
    def test_eerste_paasdag(self):
        """Test 'de eerste paasdag van' function (§13.4.16.32)."""
        code = """Regel testPaasdagFunctie
            geldig altijd
                de paasdag van een persoon moet gesteld worden op de eerste paasdag van(2024).
        """
        tree = self.parse_text(code)
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()
        
    def test_datum_berekening_plus(self):
        """Test date addition calculation (§13.4.16.33)."""
        code = """Regel testDatumPlus
            geldig altijd
                de vervaldatum van een factuur moet gesteld worden op Rekendatum plus 30 dagen.
        """
        tree = self.parse_text(code)
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()
        
    def test_datum_berekening_min(self):
        """Test date subtraction calculation (§13.4.16.33)."""
        code = """Regel testDatumMin
            geldig altijd
                de ingangsdatum van een contract moet gesteld worden op Rekendatum min 1 jaar.
        """
        tree = self.parse_text(code)
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()
        
    def test_complex_date_calculation(self):
        """Test more complex date calculations combining multiple functions."""
        code = """Regel testComplexDatum
            geldig altijd
                de speciale datum moet gesteld worden op de eerste paasdag van(het jaar uit Rekendatum) plus 40 dagen.
        """
        tree = self.parse_text(code)
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 