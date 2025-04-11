import unittest
from tests.test_base import RegelSpraakTestCase

class DimensieTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'dimensieDefinition' # Target rule in the parser

    def test_simple_dimensie_na_attribuut(self):
        """Test parsing a simple Dimensie with NA_HET_ATTRIBUUT."""
        input_text = """Dimensie de leeftijdscategorie, bestaande uit de leeftijdscategorieen (na het attribuut met voorzetsel van):
            1. baby
            2. peuter
            3. kleuter
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_simple_dimensie_voor_attribuut(self):
        """Test parsing a simple Dimensie with VOOR_HET_ATTRIBUUT."""
        input_text = """Dimensie de belastinggroep, bestaande uit de belastinggroepen (voor het attribuut zonder voorzetsel):
            1. laag
            2. midden
            3. hoog
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    # Add test for multiple labelWaardeSpecificatie later

if __name__ == '__main__':
    unittest.main() 