from tests.test_base import RegelSpraakTestCase
import unittest

class EenheidSysteemTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Parse the whole document, focus is on eenheidsysteem
        cls.parser_rule = 'regelSpraakDocument' 

    def test_eenheidsysteem_definitions(self):
        """Test parsing various Eenheidsysteem definitions."""
        tree = self.parse_file('eenheidsysteem.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()
        # Optional: Add assertions about the tree structure

    def test_simplified_eenheidsysteem(self):
        """Test parsing a simplified Eenheidsysteem definition with custom identifiers."""
        tree = self.parse_file('test_eenheidsysteem_specialized.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main()
