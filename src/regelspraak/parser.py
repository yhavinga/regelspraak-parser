"""RegelSpraak parser implementation."""
from pathlib import Path
from typing import Union, List, Dict, Optional
from antlr4 import CommonTokenStream, FileStream, InputStream
import math

from .ir.nodes import DomainModel as Domain, ObjectType, Regel
from .parse.antlr.RegelSpraakLexer import RegelSpraakLexer
from .parse.antlr.RegelSpraakParser import RegelSpraakParser as AntlrParser
from .parse.builder import RegelSpraakModelBuilder

class ParseError(Exception):
    """Raised when parsing RegelSpraak code fails."""
    pass

class RegelSpraakParser:
    """Parser for RegelSpraak code that produces model objects."""
    
    def __init__(self):
        self.variables = {}
        self.functions = {}

    def parse_file(self, file_path: Union[str, Path]) -> Domain:
        """Parse RegelSpraak code from a file.
        
        Args:
            file_path: Path to the file containing RegelSpraak code
            
        Returns:
            Domain object containing the parsed object types and rules
            
        Raises:
            ParseError: If parsing fails
            FileNotFoundError: If the file does not exist
        """
        try:
            input_stream = FileStream(str(file_path))
            return self._parse(input_stream)
        except Exception as e:
            raise ParseError(f"Failed to parse file {file_path}: {str(e)}")

    def parse_string(self, code: str) -> Domain:
        """Parse RegelSpraak code from a string.
        
        Args:
            code: String containing RegelSpraak code
            
        Returns:
            Domain object containing the parsed object types and rules
            
        Raises:
            ParseError: If parsing fails
        """
        try:
            input_stream = InputStream(code)
            return self._parse(input_stream)
        except Exception as e:
            raise ParseError(f"Failed to parse code: {str(e)}")

    def _parse(self, input_stream) -> Domain:
        """Internal method to parse RegelSpraak code from an input stream.
        
        Args:
            input_stream: ANTLR input stream containing RegelSpraak code
            
        Returns:
            Domain object containing the parsed object types and rules
        """
        lexer = RegelSpraakLexer(input_stream)
        token_stream = CommonTokenStream(lexer)
        parser = AntlrParser(token_stream)
        tree = parser.regelSpraakDocument()
        
        visitor = RegelSpraakModelBuilder()
        return visitor.visit(tree)

    def parse(self, text):
        """Parse RegelSpraak text and return the result."""
        # TODO: Implement full parsing
        return None

    def evaluate_expression(self, expr):
        """Evaluate a RegelSpraak expression."""
        if isinstance(expr, (int, float)):
            return expr
        elif isinstance(expr, str):
            if expr.lower() == 'waar':
                return True
            elif expr.lower() == 'onwaar':
                return False
            elif expr in self.variables:
                return self.variables[expr]
            try:
                return float(expr)
            except ValueError:
                raise ValueError(f"Unknown variable or invalid number: {expr}")

    def handle_arithmetic(self, left, operator, right):
        """Handle arithmetic operations."""
        left_val = self.evaluate_expression(left)
        right_val = self.evaluate_expression(right)

        if operator == 'plus':
            return left_val + right_val
        elif operator == 'min' or operator == 'verminderd met':
            return left_val - right_val
        elif operator == 'maal':
            return left_val * right_val
        elif operator == 'gedeeld door':
            if right_val == 0:
                raise ValueError("Division by zero")
            return left_val / right_val
        elif operator == 'gedeeld door (ABS)':
            if right_val == 0:
                raise ValueError("Division by zero")
            return abs(left_val / right_val)
        elif operator == 'tot de macht':
            return left_val ** right_val
        else:
            raise ValueError(f"Unknown arithmetic operator: {operator}")

    def handle_unary(self, operator, operand):
        """Handle unary operations."""
        val = self.evaluate_expression(operand)

        if operator == 'de wortel van':
            if val < 0:
                raise ValueError("Cannot take square root of negative number")
            return math.sqrt(val)
        elif operator == 'de absolute waarde van':
            return abs(val)
        elif operator == 'min':  # Unary minus
            return -val
        else:
            raise ValueError(f"Unknown unary operator: {operator}")

    def handle_comparison(self, left, operator, right):
        """Handle comparison operations."""
        left_val = self.evaluate_expression(left)
        right_val = self.evaluate_expression(right)

        if operator == 'gelijk aan':
            return left_val == right_val
        elif operator == 'ongelijk aan':
            return left_val != right_val
        elif operator == 'groter dan':
            return left_val > right_val
        elif operator == 'groter of gelijk aan':
            return left_val >= right_val
        elif operator == 'kleiner dan':
            return left_val < right_val
        elif operator == 'kleiner of gelijk aan':
            return left_val <= right_val
        else:
            raise ValueError(f"Unknown comparison operator: {operator}")

    def handle_logical(self, left, operator, right):
        """Handle logical operations."""
        left_val = self.evaluate_expression(left)
        right_val = self.evaluate_expression(right)

        if not isinstance(left_val, bool) or not isinstance(right_val, bool):
            raise ValueError("Logical operators require boolean operands")

        if operator == 'en':
            return left_val and right_val
        elif operator == 'of':
            return left_val or right_val
        else:
            raise ValueError(f"Unknown logical operator: {operator}")

    def set_variable(self, name, value):
        """Set a variable value."""
        self.variables[name] = value

    def get_variable(self, name):
        """Get a variable value."""
        if name not in self.variables:
            raise ValueError(f"Unknown variable: {name}")
        return self.variables[name] 