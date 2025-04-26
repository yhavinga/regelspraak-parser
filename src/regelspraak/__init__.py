"""RegelSpraak Parser Package

Exposes the main public API components.
"""

__version__ = '0.2.0' # Updated version reflecting structure change

# Core parsing functions
from .parsing import parse_text, parse_file

# Core AST/IR node
from .ast import DomainModel

# Runtime components
from .runtime import RuntimeContext, RuntimeError, RuntimeObject, Value

# Execution engine components
from .engine import Evaluator, TraceEvent, TraceSink, PrintTraceSink

# Custom error types
from .errors import ParseError, SemanticError, RuntimeError, RegelspraakError

# Public API definition
__all__ = [
    # Parsing
    'parse_text',
    'parse_file',
    # AST/IR
    'DomainModel',
    # Runtime
    'RuntimeContext',
    'RuntimeError',
    'RuntimeObject',
    'Value',
    # Engine
    'Evaluator',
    'TraceEvent',
    'TraceSink',
    ''
    # Errors
    'RegelspraakError',
    'ParseError',
    'SemanticError',
    'RuntimeError',
] 