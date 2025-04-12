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

if __name__ == '__main__':
    unittest.main()
