from tests.test_base import RegelSpraakTestCase
import unittest

class BeslistabelTests(RegelSpraakTestCase):
    def test_beslistabel_definitions(self):
        """Test parsing a simple Beslistabel definition."""
        tree = self.parse_file('test_beslistabel.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()
        # Optional: Add assertions about the tree structure

if __name__ == '__main__':
    unittest.main() 