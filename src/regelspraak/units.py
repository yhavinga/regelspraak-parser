"""Unit system handling for RegelSpraak.

This module implements unit systems, conversions, and arithmetic operations
according to the RegelSpraak v2.1.0 specification.
"""

from dataclasses import dataclass, field
from typing import Dict, Optional, List, Tuple, Union
from decimal import Decimal, ROUND_DOWN
import re

from .errors import RuntimeError


@dataclass(frozen=True)
class BaseUnit:
    """Represents a base unit within a unit system."""
    name: str  # e.g., "meter"
    plural: Optional[str] = None  # e.g., "meters"
    abbreviation: Optional[str] = None  # e.g., "m"
    symbol: Optional[str] = None  # e.g., "m" or "€"
    # Conversion factor to the system's base unit (multiply by this to get base unit value)
    to_base_factor: Decimal = Decimal("1")  # Default 1 for base units themselves


@dataclass
class UnitSystem:
    """Represents a unit system (eenheidssysteem) with its base units."""
    name: str  # e.g., "Tijd", "Valuta", "Afstand"
    base_units: Dict[str, BaseUnit] = field(default_factory=dict)
    # Map from abbreviations/symbols to unit names for lookup
    abbreviation_map: Dict[str, str] = field(default_factory=dict)
    symbol_map: Dict[str, str] = field(default_factory=dict)
    
    def add_unit(self, unit: BaseUnit):
        """Add a base unit to the system."""
        self.base_units[unit.name] = unit
        if unit.abbreviation:
            self.abbreviation_map[unit.abbreviation] = unit.name
        if unit.symbol:
            self.symbol_map[unit.symbol] = unit.name
    
    def find_unit(self, identifier: str) -> Optional[BaseUnit]:
        """Find a unit by name, abbreviation, or symbol."""
        # Direct name lookup
        if identifier in self.base_units:
            return self.base_units[identifier]
        # Abbreviation lookup
        if identifier in self.abbreviation_map:
            return self.base_units[self.abbreviation_map[identifier]]
        # Symbol lookup
        if identifier in self.symbol_map:
            return self.base_units[self.symbol_map[identifier]]
        return None
    
    def can_convert(self, from_unit: str, to_unit: str) -> bool:
        """Check if conversion is possible between two units."""
        if from_unit == to_unit:
            return True
        # Both units must exist in this system
        from_base = self.find_unit(from_unit)
        to_base = self.find_unit(to_unit)
        return from_base is not None and to_base is not None

    def convert(self, value: Decimal, from_unit: str, to_unit: str) -> Decimal:
        """Convert a value from one unit to another within this system using hub-and-spoke pattern."""
        if from_unit == to_unit:
            return value

        from_unit_obj = self.find_unit(from_unit)
        to_unit_obj = self.find_unit(to_unit)

        if not from_unit_obj or not to_unit_obj:
            raise RuntimeError(f"Cannot convert between '{from_unit}' and '{to_unit}': units not found in system '{self.name}'")

        # Hub-and-spoke conversion:
        # Step 1: Convert from source unit to base unit
        base_value = value * from_unit_obj.to_base_factor

        # Step 2: Convert from base unit to target unit
        result = base_value / to_unit_obj.to_base_factor

        return result


@dataclass(frozen=True) 
class CompositeUnit:
    """Represents a composite unit (e.g., km/u, m/s^2)."""
    numerator: List[Tuple[str, int]]  # List of (unit_name, power) in numerator
    denominator: List[Tuple[str, int]]  # List of (unit_name, power) in denominator
    
    @staticmethod
    def from_simple(unit: str) -> 'CompositeUnit':
        """Create a CompositeUnit from a simple unit string."""
        return CompositeUnit(numerator=[(unit, 1)], denominator=[])
    
    def normalize(self) -> 'CompositeUnit':
        """Normalize by canceling out matching units above and below."""
        # Count occurrences in numerator and denominator
        num_counts = {}
        for unit, power in self.numerator:
            num_counts[unit] = num_counts.get(unit, 0) + power
        
        den_counts = {}
        for unit, power in self.denominator:
            den_counts[unit] = den_counts.get(unit, 0) + power
        
        # Cancel out matching units
        new_num = []
        new_den = []
        
        # Process remaining numerator units
        for unit, total_power in num_counts.items():
            den_power = den_counts.get(unit, 0)
            remaining = total_power - den_power
            if remaining > 0:
                new_num.append((unit, remaining))
            elif remaining < 0:
                new_den.append((unit, -remaining))
        
        # Process denominator units not in numerator
        for unit, power in den_counts.items():
            if unit not in num_counts:
                new_den.append((unit, power))
        
        return CompositeUnit(numerator=new_num, denominator=new_den)
    
    def multiply(self, other: 'CompositeUnit') -> 'CompositeUnit':
        """Multiply two composite units."""
        # Combine numerators and denominators
        new_num = self.numerator + other.numerator
        new_den = self.denominator + other.denominator
        return CompositeUnit(numerator=new_num, denominator=new_den).normalize()
    
    def divide(self, other: 'CompositeUnit') -> 'CompositeUnit':
        """Divide by another composite unit."""
        # Flip the other unit and multiply
        new_num = self.numerator + other.denominator
        new_den = self.denominator + other.numerator
        return CompositeUnit(numerator=new_num, denominator=new_den).normalize()
    
    def is_dimensionless(self) -> bool:
        """Check if this is a dimensionless unit (all canceled out)."""
        normalized = self.normalize()
        return not normalized.numerator and not normalized.denominator
    
    def to_string(self) -> str:
        """Convert to a readable string representation."""
        if self.is_dimensionless():
            return ""
        
        num_parts = []
        for unit, power in self.numerator:
            if power == 1:
                num_parts.append(unit)
            else:
                num_parts.append(f"{unit}^{power}")
        
        if not self.denominator:
            return "*".join(num_parts) if num_parts else ""
        
        den_parts = []
        for unit, power in self.denominator:
            if power == 1:
                den_parts.append(unit)
            else:
                den_parts.append(f"{unit}^{power}")
        
        num_str = "*".join(num_parts) if num_parts else "1"
        den_str = "*".join(den_parts)
        
        return f"{num_str}/{den_str}"


class UnitRegistry:
    """Registry of all unit systems in the domain."""
    
    def __init__(self):
        self.systems: Dict[str, UnitSystem] = {}
        self._init_standard_systems()
    
    def _init_standard_systems(self):
        """Initialize standard unit systems from the specification."""
        # Time system (Tijd) - using seconds as base unit
        time_system = UnitSystem("Tijd")

        # Base unit: seconde (factor = 1)
        time_system.add_unit(BaseUnit("seconde", "seconden", "s",
                                     to_base_factor=Decimal("1")))

        # Other units with conversion factors TO seconds
        time_system.add_unit(BaseUnit("milliseconde", "milliseconden", "ms",
                                     to_base_factor=Decimal("0.001")))
        time_system.add_unit(BaseUnit("minuut", "minuten", "minuut",
                                     to_base_factor=Decimal("60")))
        time_system.add_unit(BaseUnit("uur", "uren", "u",
                                     to_base_factor=Decimal("3600")))
        time_system.add_unit(BaseUnit("dag", "dagen", "dg",
                                     to_base_factor=Decimal("86400")))
        time_system.add_unit(BaseUnit("week", "weken", "wk",
                                     to_base_factor=Decimal("604800")))
        # Average month (30.44 days)
        time_system.add_unit(BaseUnit("maand", "maanden", "mnd",
                                     to_base_factor=Decimal("2629746")))
        # Quarter (3 months)
        time_system.add_unit(BaseUnit("kwartaal", "kwartalen", "kw",
                                     to_base_factor=Decimal("7889238")))
        # Average year (365.25 days)
        time_system.add_unit(BaseUnit("jaar", "jaren", "jr",
                                     to_base_factor=Decimal("31556952")))
        self.systems["Tijd"] = time_system

        # Currency system (Valuta) - no conversions between currencies
        currency_system = UnitSystem("Valuta")
        currency_system.add_unit(BaseUnit("euro", "euros", "EUR", "€"))
        currency_system.add_unit(BaseUnit("dollar", "dollars", "USD", "$"))
        self.systems["Valuta"] = currency_system
    
    def add_system(self, system: UnitSystem):
        """Add a unit system to the registry."""
        self.systems[system.name] = system
    
    def find_unit_system(self, unit_name: str) -> Optional[UnitSystem]:
        """Find which system contains a given unit."""
        for system in self.systems.values():
            if system.find_unit(unit_name):
                return system
        return None
    
    def parse_unit_string(self, unit_str: str) -> CompositeUnit:
        """Parse a unit string like 'km/u' or 'm/s^2' into a CompositeUnit."""
        # Simple parser for unit expressions
        # Format: unit1*unit2*.../unit3*unit4*...
        if not unit_str:
            return CompositeUnit(numerator=[], denominator=[])
        
        # Split by division
        parts = unit_str.split('/')
        
        # Parse numerator
        numerator = []
        if parts[0]:
            for unit_part in parts[0].split('*'):
                unit_part = unit_part.strip()
                # Check for power notation
                if '^' in unit_part:
                    unit, power_str = unit_part.split('^', 1)
                    power = int(power_str)
                else:
                    unit = unit_part
                    power = 1
                numerator.append((unit, power))
        
        # Parse denominator if present
        denominator = []
        if len(parts) > 1:
            for unit_part in parts[1].split('*'):
                unit_part = unit_part.strip()
                if '^' in unit_part:
                    unit, power_str = unit_part.split('^', 1) 
                    power = int(power_str)
                else:
                    unit = unit_part
                    power = 1
                denominator.append((unit, power))
        
        return CompositeUnit(numerator=numerator, denominator=denominator)