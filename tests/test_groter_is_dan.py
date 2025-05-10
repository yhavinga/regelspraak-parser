import unittest
from pathlib import Path

from regelspraak.parsing import parse_file
from regelspraak.ast import DomainModel

class TestMinimalExample(unittest.TestCase):
    """Tests for parsing minimal_test_example.rs file with 'groter is dan' syntax."""

    def test_groter_is_dan_syntax(self):
        """Test parsing a rule with 'groter is dan' syntax."""
        # Load the example file from resources directory
        example_path = Path("tests/resources/groter_is_dan.rs")
        
        # Parse the file
        domain_model = parse_file(example_path)
        
        # Basic validation of the model
        self.assertIsInstance(domain_model, DomainModel)
        
        # Validate that the rule was parsed
        self.assertEqual(len(domain_model.regels), 1)
        
        # Get the rule
        rule = domain_model.regels[0]
        self.assertEqual(rule.naam, "TestGroterIsDanSyntax")
        
        # Validate that the rule has a condition with "groter is dan" comparison
        self.assertIsNotNone(rule.voorwaarde)
        condition_expr = rule.voorwaarde.expressie
        self.assertIsNotNone(condition_expr)
        
        # Print the condition for debugging
        print(f"Condition expression: {condition_expr}")

if __name__ == "__main__":
    unittest.main() 