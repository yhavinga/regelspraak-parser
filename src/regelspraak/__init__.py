"""RegelSpraak parser package for parsing and analyzing RegelSpraak documents."""

from .parser import RegelSpraakParser, ParseError
from .model import ObjectType, Rule, Domain

__version__ = '0.1.0'
__all__ = ['RegelSpraakParser', 'ParseError', 'ObjectType', 'Rule', 'Domain'] 