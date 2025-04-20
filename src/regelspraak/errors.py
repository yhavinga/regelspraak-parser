"""Custom exception types for the RegelSpraak parser and engine."""

class RegelspraakError(Exception):
    """Base class for all errors raised by this package."""
    pass

class ParseError(RegelspraakError):
    """Raised when parsing RegelSpraak code fails."""
    # Consider adding line/column information if available from ANTLR
    # def __init__(self, message, line=None, column=None):
    #     super().__init__(message)
    #     self.line = line
    #     self.column = column
    pass

# Placeholder for other potential error types
class SemanticError(RegelspraakError):
    """Raised during semantic analysis (e.g., type checking, symbol resolution)."""
    pass

class RuntimeError(RegelspraakError):
    """Raised during rule execution/evaluation."""
    pass
