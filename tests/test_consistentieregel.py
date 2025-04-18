from tests.test_base import RegelSpraakTestCase
import unittest

class ConsistentieregelTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regelSpraakDocument'  # Test at top level

    def test_simple_consistentieregel(self):
        """Test parsing a simple Consistentieregel with uniek zijn."""
        input_text = """Consistentieregel unieke BSN nummers
            De BSN moeten uniek zijn.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
    
    def test_complex_consistentieregel(self):
        """Test parsing a more complex Consistentieregel with data consistency check."""
        input_text = """Consistentieregel valide leeftijd rijbewijs
            De data is inconsistent
            indien er aan alle volgende voorwaarden wordt voldaan:
                • de leeftijd is kleiner dan 18
                • het rijbewijs is gevuld.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 