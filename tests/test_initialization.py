import unittest
from tests.test_base import RegelSpraakTestCase

class InitializationTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regel'  # Test within the context of a 'regel'

    def test_initialization_statement(self):
        """Tests 'moet geïnitialiseerd worden op' statement in resultaatDeel."""
        input_text = """Regel initialiseer variabele
            geldig altijd
                De aanvangsdatum moet geïnitialiseerd worden op '01-01-2025'.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_initialization_with_condition(self):
        """Tests 'moet geïnitialiseerd worden op' with a condition."""
        input_text = """Regel initialiseer met voorwaarde
            geldig altijd
                De aanvangsdatum moet geïnitialiseerd worden op '01-01-2025'
                indien de werknemer is gevuld.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_initialization_with_expression(self):
        """Tests 'moet geïnitialiseerd worden op' with a complex expression."""
        input_text = """Regel initialiseer met expressie
            geldig altijd
                De woonplaats moet geïnitialiseerd worden op de geboorteplaats van de persoon.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_initialization_with_variable(self):
        """Tests 'moet geïnitialiseerd worden op' with a variable assignment."""
        input_text = """Regel initialiseer met variabele
            geldig altijd
                De laatste afleesdatum moet geïnitialiseerd worden op de huidige datum.
                
            Daarbij geldt:
                de huidige datum is '15-03-2025'.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 