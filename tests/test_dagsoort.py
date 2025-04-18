from tests.test_base import RegelSpraakTestCase
import unittest

class DagsoortTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Although we parse the whole document, focus is on dagsoort
        cls.parser_rule = 'regelSpraakDocument' 

    def test_dagsoort_definitions(self):
        """Test parsing various Dagsoort definitions."""
        tree = self.parse_file('dagsoort.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()
        # Optional: Add assertions about the tree structure if needed

class DagsoortDefinitionUnitTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'dagsoortDefinition'

    def test_simple_dagsoort(self):
        tree = self.parse_text("Dagsoort de Werkdag;")
        self.assertNoParseErrors()

    def test_dagsoort_without_semicolon(self):
        tree = self.parse_text("Dagsoort de Zaterdag")
        self.assertNoParseErrors()

    def test_dagsoort_with_plural(self):
        tree = self.parse_text("Dagsoort de Kerstdag (mv: Kerstdagen);")
        self.assertNoParseErrors()

    def test_dagsoort_multiword(self):
        tree = self.parse_text("Dagsoort de Goede Vrijdag;")
        self.assertNoParseErrors()

    def test_dagsoort_edge_case(self):
        tree = self.parse_text("Dagsoort de Dag;")
        self.assertNoParseErrors()


if __name__ == '__main__':
    unittest.main()
