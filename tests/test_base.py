import os
import unittest
from antlr4 import FileStream, CommonTokenStream, InputStream
from antlr4.error.ErrorListener import ErrorListener
from antlr4.tree.Tree import ParseTree, TerminalNode  # Import ParseTree and TerminalNode
from regelspraak.generated.RegelSpraakLexer import RegelSpraakLexer
from regelspraak.generated.RegelSpraakParser import RegelSpraakParser

# --- Test Framework Code ---
class RegelSpraakTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up test class by defining paths."""
        cls.test_resources = os.path.join(os.path.dirname(__file__), 'resources')
        cls.parser_rule = 'regelSpraakDocument'  # Default rule

    def parse_file(self, filename):
        """Parse a file and return the parse tree."""
        file_path = os.path.join(self.test_resources, filename)
        input_stream = FileStream(file_path, encoding='utf-8')
        return self._parse(input_stream)

    def parse_text(self, text):
        """Parse a string and return the parse tree."""
        input_stream = InputStream(text)
        return self._parse(input_stream)

    def _parse(self, input_stream):
        """Internal method to create lexer and parser."""
        lexer = RegelSpraakLexer(input_stream)
        stream = CommonTokenStream(lexer)
        parser = RegelSpraakParser(stream)
        parser.removeErrorListeners()  # Remove default error listener
        self.error_listener = TestErrorListener()
        parser.addErrorListener(self.error_listener)

        # Get the parser rule method by name
        rule_method = getattr(parser, self.parser_rule)
        tree = rule_method() # Execute parsing
        return tree

    def assertNoParseErrors(self):
        """Assert that no parse errors occurred."""
        if self.error_listener.errors:
            raise AssertionError(f"Parse errors occurred: {self.error_listener.errors}")

    def find_node_of_type(self, node: ParseTree, target_type):
        """
        Recursively searches the parse tree for the first node of the specified type.

        Args:
            node: The current node in the parse tree (starts with the root).
            target_type: The ANTLR context class to search for (e.g., RegelSpraakParser.UnaryKenmerkConditionContext).

        Returns:
            The first node found matching the target_type, or None if not found.
        """
        if isinstance(node, target_type):
            return node

        if not isinstance(node, TerminalNode) and hasattr(node, 'children'):
            for child in node.children:
                found = self.find_node_of_type(child, target_type)
                if found:
                    return found
        return None


class TestErrorListener(ErrorListener): # Inherit from ErrorListener
    def __init__(self):
        self.errors = []

    def syntaxError(self, recognizer, offendingSymbol, line, column, msg, e):
        self.errors.append(f"line {line}:{column} {msg}")

    # Keep stubs for other ErrorListener methods if needed, otherwise inheriting is enough
    # def reportAmbiguity(...): pass
    # def reportAttemptingFullContext(...): pass
    # def reportContextSensitivity(...): pass


class RegelSpraakParserTests(RegelSpraakTestCase):
    # Basic syntax tests for individual files
    def test_parse_objecttype(self):
        tree = self.parse_file('objecttype.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_parse_domein(self):
        tree = self.parse_file('domein.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_parse_parameter(self):
        tree = self.parse_file('parameter.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_parse_regel(self):
        tree = self.parse_file('regel.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

# Add more specific test classes if needed

if __name__ == '__main__':
    unittest.main() 