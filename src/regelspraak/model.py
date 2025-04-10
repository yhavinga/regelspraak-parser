"""Data models for RegelSpraak constructs."""
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional

@dataclass
class ObjectType:
    """Represents a RegelSpraak object type definition."""
    name: str
    attributes: Dict[str, str]
    description: Optional[str] = None

@dataclass
class Rule:
    """Represents a RegelSpraak rule definition."""
    name: str
    condition: str
    consequence: str
    description: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class Domain:
    """Represents a RegelSpraak domain containing object types and rules."""
    name: str
    object_types: List[ObjectType] = field(default_factory=list)
    rules: List[Rule] = field(default_factory=list)
    description: Optional[str] = None 