"""Test multi-operand concatenation expressions preserve all operands.

This test verifies the fix for the bug where "X, Y en Z" only returned X
and dropped Y and Z.
"""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.ast import ConjunctionExpression, AttributeReference


class TestConcatenationFix(unittest.TestCase):
    """Test that concatenation with 'en' preserves all operands."""

    def test_multi_operand_concatenation_preserves_all_values(self):
        """Test that "X, Y en Z" preserves all three operands in parsing."""
        # Use raw parsing to test the ConjunctionExpression is created
        from regelspraak.parsing import RegelSpraakModelBuilder
        from regelspraak._antlr.RegelSpraakParser import RegelSpraakParser
        from regelspraak._antlr.RegelSpraakLexer import RegelSpraakLexer
        from antlr4 import InputStream, CommonTokenStream
        from regelspraak.ast import VariableReference

        # Test expression with concatenation
        text = "X, Y en Z"

        # Parse just the expression
        input_stream = InputStream(text)
        lexer = RegelSpraakLexer(input_stream)
        token_stream = CommonTokenStream(lexer)
        parser = RegelSpraakParser(token_stream)

        # Parse as expressie
        tree = parser.expressie()

        # Build the AST (in isolation, these will be VariableReferences)
        visitor = RegelSpraakModelBuilder()
        expr = visitor.visit(tree)

        # It should be a ConjunctionExpression with all three values
        self.assertIsInstance(expr, ConjunctionExpression)
        self.assertEqual(len(expr.values), 3)

        # Check all three values are preserved (as VariableReferences when parsed in isolation)
        var_names = []
        for val in expr.values:
            if isinstance(val, VariableReference):
                var_names.append(val.variable_name)

        self.assertEqual(sorted(var_names), ['X', 'Y', 'Z'])

    # NOTE: Concatenation expressions in RegelSpraak work within function contexts
    # (e.g., "de som van X, Y en Z") but may not be valid as standalone expressions
    # in gelijkstelling. The main test above verifies the core fix - that the parser
    # correctly creates ConjunctionExpression AST nodes preserving all operands.



if __name__ == '__main__':
    unittest.main()