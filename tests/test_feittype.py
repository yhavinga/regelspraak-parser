import unittest
from tests.test_base import RegelSpraakTestCase

class FeitTypeTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Use the main document rule to parse FeitType definitions
        cls.parser_rule = 'regelSpraakDocument'

    def test_simple_feittype(self):
        """Test parsing a simple FeitType definition within a document."""
        input_text = """Feittype eigenaarschap tussen persoon en voertuig
    de eigenaar Persoon
    het voertuig Voertuig
Een eigenaar heeft een voertuig"""

        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_wederkerig_feittype(self):
        """Test parsing a Wederkerig FeitType definition."""
        input_text = """Wederkerig feittype partnerrelatie
    de partner Persoon
Een partner heeft een partner
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 