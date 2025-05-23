"""RegelSpraak parser frontend: functions to parse text/files into an AST/IR."""
from pathlib import Path
from typing import Union
import logging

from antlr4 import CommonTokenStream, FileStream, InputStream
from antlr4.error.ErrorListener import ErrorListener

# Import AST nodes
from .ast import DomainModel
# Import ANTLR generated files
from ._antlr.RegelSpraakLexer import RegelSpraakLexer
from ._antlr.RegelSpraakParser import RegelSpraakParser as AntlrParser
# Import custom error type
from .errors import ParseError
# Import the AST builder
from .builder import RegelSpraakModelBuilder

logger = logging.getLogger(__name__)

# --- Custom ANTLR Error Listener ---
class RegelspraakErrorListener(ErrorListener):
    """Custom ANTLR Error Listener to collect syntax errors."""
    def __init__(self):
        super().__init__()
        self.errors = []

    def syntaxError(self, recognizer, offendingSymbol, line, column, msg, e):
        """Called by ANTLR when a syntax error is detected."""
        # Add line, column, and message for better reporting
        self.errors.append({'line': line, 'column': column, 'msg': msg})
        # Log the error immediately as well
        logger.warning(f"Syntax Error at Line {line}:{column} - {msg}")

    # Optional: Implement reportAmbiguity, reportAttemptingFullContext, reportContextSensitivity
    # if needed for more detailed grammar debugging.

# --- Public Parsing API ---

def parse_file(file_path: Union[str, Path]) -> DomainModel:
    """Parse RegelSpraak code from a file.

    Args:
        file_path: Path to the file containing RegelSpraak code.

    Returns:
        DomainModel object representing the parsed content.

    Raises:
        ParseError: If parsing fails.
        FileNotFoundError: If the file does not exist.
    """
    try:
        # Ensure file_path is a string for FileStream
        input_stream = FileStream(str(file_path), encoding='utf-8')
        return _parse_stream(input_stream)
    except FileNotFoundError: # Re-raise specific error
        raise
    except Exception as e:
        # Catch potential ANTLR errors or builder errors
        raise ParseError(f"Failed to parse file {file_path}: {e}") from e

def parse_text(text: str) -> DomainModel:
    """Parse RegelSpraak code from a string.

    Args:
        text: String containing RegelSpraak code.

    Returns:
        DomainModel object representing the parsed content.

    Raises:
        ParseError: If parsing fails.
    """
    try:
        input_stream = InputStream(text)
        return _parse_stream(input_stream)
    except Exception as e:
        # Catch potential ANTLR errors or builder errors
        raise ParseError(f"Failed to parse text: {e}") from e

# --- Internal Parsing Logic ---

def _parse_stream(input_stream) -> DomainModel:
    """Core parsing function using ANTLR lexer, parser, and custom visitor."""
    lexer = RegelSpraakLexer(input_stream)
    token_stream = CommonTokenStream(lexer)
    parser = AntlrParser(token_stream)
    
    # Remove default listener and add our custom one
    parser.removeErrorListeners()
    error_listener = RegelspraakErrorListener()
    parser.addErrorListener(error_listener)

    tree = parser.regelSpraakDocument() # Start parsing from the root rule

    # Check for syntax errors collected by the listener *before* visiting
    if error_listener.errors:
        # Combine collected errors into a single message or use the first one
        first_error = error_listener.errors[0]
        error_msg = f"Line {first_error['line']}:{first_error['column']}: {first_error['msg']}"
        # Add details if needed
        # error_details = "\n".join([f"  Line {e['line']}:{e['column']}: {e['msg']}" for e in error_listener.errors])
        # raise ParseError(f"Syntax errors found:\n{error_details}")
        # Raise ParseError with info from the first error found
        raise ParseError(error_msg) 

    # Build the AST/IR using the visitor only if no syntax errors
    visitor = RegelSpraakModelBuilder()
    domain_model = visitor.visit(tree)

    # Ensure domain_model has top-level span
    if domain_model and not domain_model.span:
        domain_model.span = visitor.get_span(tree)

    if not isinstance(domain_model, DomainModel):
         # This might happen if the visitor returns None or something unexpected
         logger.error(f"Visitor did not return a DomainModel object, got: {type(domain_model)}")
         raise ParseError("Internal error: Failed to build the domain model from the parse tree.")

    return domain_model