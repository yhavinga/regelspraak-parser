from tests.test_base import RegelSpraakTestCase
import unittest

class BeslistabelTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Parse the whole document, focus is on beslistabel
        cls.parser_rule = 'regelSpraakDocument' 

    def test_beslistabel_definitions(self):
        """Test parsing a simple Beslistabel definition."""
        tree = self.parse_file('test_beslistabel.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()
        # Optional: Add assertions about the tree structure

if __name__ == '__main__':
    unittest.main() 