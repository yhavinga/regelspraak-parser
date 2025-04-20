"""RegelSpraak Parser Package

Exposes the main public API components.
"""

__version__ = '0.2.0' # Updated version reflecting structure change

# Core parsing functions
from .parsing import parse_text, parse_file

# Core AST/IR node (the main container)
from .ast import DomainModel # Renamed from Module in the plan

# Execution engine components
from .engine import Evaluator, TraceEvent, TraceSink

# Runtime components (placeholders until implemented in runtime.py)
# from .runtime import Runtime, Instance, ParameterStore

# Custom error types
from .errors import ParseError, SemanticError, RuntimeError, RegelspraakError

# Public API definition
__all__ = [
    # Parsing
    'parse_text',
    'parse_file',
    # AST/IR
    'DomainModel',
    # Engine
    'Evaluator',
    'TraceEvent',
    'TraceSink',
    # Runtime (when implemented)
    # 'Runtime',
    # 'Instance',
    # 'ParameterStore',
    # Errors
    'RegelspraakError',
    'ParseError',
    'SemanticError',
    'RuntimeError',
] 