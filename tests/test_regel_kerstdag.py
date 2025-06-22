import unittest
from tests.test_base import RegelSpraakTestCase

class RegelKerstdagTest(RegelSpraakTestCase):
    """Test the complete RegelSpraak definition for the 'kerstdag' regel."""

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regel'

    def test_kerstdag_regel_simple(self):
        """Test parsing a simple version first."""
        code = """Regel Kerstdag
    geldig altijd
        Een dag is een kerstdag."""
        tree = self.parse_text(code)
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()
    
    def test_kerstdag_regel_no_indent(self):
        """Test without indentation to isolate issue."""
        code = "Regel Kerstdag geldig altijd Een dag is een kerstdag."
        tree = self.parse_text(code)
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_kerstdag_regel(self):
        """Test parsing the full 'kerstdag' regel as in the specification."""
        code = """Regel Kerstdag
    geldig altijd
        Een dag is een kerstdag
        indien de dag aan alle volgende voorwaarden voldoet:
        - de maand uit (de dag) is gelijk aan 12
        - de dag voldoet aan ten minste één van de volgende voorwaarden:
            .. de dag uit (de dag) is gelijk aan 25
            .. de dag uit (de dag) is gelijk aan 26."""
        tree = self.parse_text(code)
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main()