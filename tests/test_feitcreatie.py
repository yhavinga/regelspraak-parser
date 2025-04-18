import unittest
from tests.test_base import RegelSpraakTestCase

class FeitCreatieTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regel'  # Test within the context of a 'regel'

    def test_basic_feitcreatie(self):
        """Tests basic fact creation between two objects."""
        input_text = """Regel create relatie
            geldig altijd
                De persoon heeft relatie met bedrijf
                indien de persoon is werknemer.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_feitcreatie_with_conditions(self):
        """Tests fact creation with multiple conditions."""
        input_text = """Regel create klantrelatie
            geldig altijd
                De klant heeft contract met leverancier
                indien het aan alle volgende voorwaarden voldoet:
                  • de klant is actief
                  • de leverancier is beschikbaar.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_feitcreatie_with_date(self):
        """Tests fact creation with date conditions."""
        input_text = """Regel create tijdelijke relatie
            geldig altijd
                De persoon heeft tijdelijke toegang tot systeem
                indien de huidige datum is eerder dan 01-01-2026.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 