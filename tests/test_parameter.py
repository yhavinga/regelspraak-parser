import unittest
from tests.test_base import RegelSpraakTestCase

class ParameterTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'parameterDefinition' # Target rule in the parser

    def test_parameter_file(self):
        """Test parsing a complete file with parameter definitions."""
        # Use the existing resource file
        tree = self.parse_file('parameter.rs')
        self.assertIsNotNone(tree, "Parser should produce a tree.")
        # We should ideally check for the number of definitions, but let's start simple.
        self.assertNoParseErrors()

    def test_numeriek_parameter_with_unit(self):
        """Test parsing a Numeriek parameter with a simple unit."""
        input_text = "Parameter het volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;"
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        # Add more specific assertions later if needed, e.g., checking node types

    def test_numeriek_parameter_with_complex_unit(self):
        """Test parsing a Numeriek parameter with a compound unit."""
        # Note: The current grammar might simplify 'km/u' - this test checks parsing success
        input_text = "Parameter het maximum snelheid : Numeriek (getal) met eenheid km/u;"
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_domein_parameter(self):
        """Test parsing a parameter referencing a Domein."""
        input_text = "Parameter het aantal kinderen : Domein AantalKinderen;"
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_datum_parameter_with_tijdlijn(self):
        """Test parsing a Datum parameter with a tijdlijn."""
        input_text = "Parameter de startdatum : Datum in dagen voor elke dag;"
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_parameter_name_with_multiple_words(self):
        """Test parsing a parameter with a multi-word name."""
        input_text = "Parameter de maximale wachttijd : Numeriek (geheel getal) met eenheid dagen;"
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()


if __name__ == '__main__':
    unittest.main() 