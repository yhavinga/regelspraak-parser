import unittest
from tests.test_base import RegelSpraakTestCase

class ObjectCreatieTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regel'  # Test within the context of a 'regel'

    def test_basic_object_creation(self):
        """Test basic object creation syntax."""
        input_text = """Regel nieuwe persoon aanmaken
            geldig altijd
                Er wordt een nieuw Persoon aangemaakt.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_object_creation_with_attribute(self):
        """Test object creation with attribute initialization."""
        input_text = """Regel nieuwe persoon met leeftijd
            geldig altijd
                Er wordt een nieuw Persoon aangemaakt met leeftijd gelijk aan 25.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_object_creation_with_multiple_attributes(self):
        """Test object creation with multiple attribute initializations."""
        input_text = """Regel nieuwe persoon volledig
            geldig altijd
                Er wordt een nieuw Persoon aangemaakt
                met naam gelijk aan "Jan Jansen"
                en leeftijd gelijk aan 30
                en woonplaats gelijk aan "Amsterdam".
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_object_creation_with_condition(self):
        """Test object creation with a condition."""
        input_text = """Regel nieuwe werknemer
            geldig altijd
                Er wordt een nieuw Werknemer aangemaakt
                met salaris gelijk aan 3000
                indien de leeftijd groter is dan 18.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_object_creation_alternative_syntax(self):
        """Test alternate object creation syntax with the keyword 'creëer'."""
        input_text = """Regel creëer klant
            geldig altijd
                Creëer een nieuwe Klant
                met klantnummer gelijk aan 12345
                en status gelijk aan 'Actief'.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 