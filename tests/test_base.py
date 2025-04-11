import os
import unittest
from antlr4 import FileStream, CommonTokenStream, InputStream
from regelspraak.generated.RegelSpraakLexer import RegelSpraakLexer
from regelspraak.generated.RegelSpraakParser import RegelSpraakParser

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
        return rule_method()

    def assertNoParseErrors(self):
        """Assert that no parse errors occurred."""
        if self.error_listener.errors:
            raise AssertionError(f"Parse errors occurred: {self.error_listener.errors}")

class TestErrorListener:
    def __init__(self):
        self.errors = []

    def syntaxError(self, recognizer, offendingSymbol, line, column, msg, e):
        self.errors.append(f"line {line}:{column} {msg}")

    def reportAmbiguity(self, recognizer, dfa, startIndex, stopIndex, exact, ambigAlts, configs):
        pass  # Ignore ambiguity reports

    def reportAttemptingFullContext(self, recognizer, dfa, startIndex, stopIndex, conflictingAlts, configs):
        pass  # Ignore full context attempts

    def reportContextSensitivity(self, recognizer, dfa, startIndex, stopIndex, prediction, configs):
        pass  # Ignore context sensitivity reports

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