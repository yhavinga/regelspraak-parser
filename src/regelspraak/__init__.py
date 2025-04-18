"""RegelSpraak Parser Package"""

from .parser import RegelSpraakParser, ParseError
from .model import ObjectType, Regel, DomainModel

__version__ = '0.1.0'
__all__ = ['RegelSpraakParser', 'ParseError', 'ObjectType', 'Regel', 'DomainModel'] 