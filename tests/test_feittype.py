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
        # Re-typed input just in case of hidden characters
        input_text = 'FeitType Persoon heeft Voertuig\n'
        input_text += '  (na het attribuut met voorzetsel van) Persoon\n'
        input_text += '  (voor het attribuut zonder voorzetsel): Voertuig'

        # Note: The colon placement in 'voor het attribuut' might differ slightly
        # from dimensie, depending on strict spec interpretation vs common usage.
        # Current grammar uses VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL token which includes the colon.
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_wederkerig_feittype(self):
        """Test parsing a Wederkerig FeitType definition."""
        input_text = """Wederkerig feittype Persoon is partner van Persoon
            (na het attribuut met voorzetsel van) PartnerA
            (voor het attribuut zonder voorzetsel): PartnerB
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 