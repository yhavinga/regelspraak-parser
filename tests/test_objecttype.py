from tests.test_base import RegelSpraakTestCase

class ObjectTypeTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'objectTypeDefinition'

    def test_objecttype_file(self):
        """Test parsing a complete file with object type definitions."""
        tree = self.parse_file('objecttype.txt')
        self.assertNoParseErrors()

    def test_simple_objecttype(self):
        """Test parsing a simple object type definition."""
        input_text = """Objecttype de Persoon
            het naam Tekst;
            de leeftijd Numeriek (positief geheel getal);
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_objecttype_with_mv(self):
        """Test parsing an object type with plural form."""
        input_text = """Objecttype de Auto (mv: Auto's)
            het kenteken Tekst;
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_objecttype_with_bezield(self):
        """Test parsing an object type with bezield marker."""
        input_text = """Objecttype de Medewerker (mv: Medewerkers) (bezield)
            het personeelsnummer Tekst;
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_objecttype_with_kenmerk(self):
        """Test parsing an object type with kenmerk attributes."""
        input_text = """Objecttype de Product
            is actief kenmerk (bijvoeglijk);
            het eigenaar kenmerk (bezittelijk);
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_objecttype_with_dimensions(self):
        """Test parsing an object type with dimensioned attributes."""
        input_text = """Objecttype de Transactie
            het bedrag Numeriek (niet-negatief getal met 2 decimalen) met eenheid euro;
            de datum Datum in dagen;
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 