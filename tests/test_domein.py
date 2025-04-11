from tests.test_base import RegelSpraakTestCase

class DomeinTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'domeinDefinition'

    def test_domein_file(self):
        """Test parsing a complete file with domain definitions."""
        tree = self.parse_file('domein.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_enumeratie_domein(self):
        """Test parsing an enumeration domain."""
        input_text = """Domein Status is van het type Enumeratie
            'Actief'
            'Inactief'
            'Geblokkeerd'
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_numeriek_domein(self):
        """Test parsing a numeric domain."""
        input_text = """Domein MijnPercentage is van het type Numeriek (niet-negatief getal met 2 decimalen) met eenheid %"""
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_numeriek_domein_with_unit(self):
        """Test parsing a numeric domain with a unit."""
        input_text = """Domein Gewicht is van het type Numeriek (positief getal met 3 decimalen) met eenheid kg"""
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_tekst_domein(self):
        """Test parsing a text domain."""
        input_text = """Domein Naam is van het type Tekst"""
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_boolean_domein(self):
        """Test parsing a boolean domain."""
        input_text = """Domein Vlag is van het type Boolean"""
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_datum_domein(self):
        """Test parsing a date domain."""
        input_text = """Domein Datum is van het type Datum in dagen"""
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 