"""Decimal arithmetic utilities for RegelSpraak financial calculations.

This module provides centralized Decimal operations with proper rounding modes
aligned with Dutch financial rules and tax calculations. All monetary and
percentage calculations should use these utilities to ensure precision.
"""

from decimal import Decimal, Context, localcontext, ROUND_FLOOR, ROUND_CEILING, ROUND_HALF_UP, ROUND_DOWN, ROUND_UP
from typing import Optional, Union


# Higher precision than default 28 to survive chained operations
DECIMAL_CONTEXT = Context(prec=34, rounding=ROUND_HALF_UP)

# Map RegelSpraak rounding directions to Python Decimal rounding modes
ROUNDING_MAP = {
    "naar_beneden": ROUND_FLOOR,      # Always round down (toward negative infinity)
    "naar_boven": ROUND_CEILING,       # Always round up (toward positive infinity)
    "rekenkundig": ROUND_HALF_UP,      # Standard arithmetic rounding (0.5 rounds up)
    "richting_nul": ROUND_DOWN,        # Round toward zero (truncate)
    "weg_van_nul": ROUND_UP            # Round away from zero
}


def ensure_decimal(value: Union[int, float, str, Decimal]) -> Decimal:
    """Convert a value to Decimal, preserving precision.

    Args:
        value: The value to convert (int, float, str, or Decimal)

    Returns:
        Decimal representation of the value
    """
    if isinstance(value, Decimal):
        return value
    # Convert to string first to avoid binary float representation issues
    if isinstance(value, float):
        return Decimal(str(value))
    return Decimal(value)


def quantize_decimal(value: Union[Decimal, 'Value'], decimals: int, direction: str = "rekenkundig") -> Decimal:
    """Round a Decimal value to specified decimal places using Dutch rounding rules.

    Args:
        value: The value to round (Decimal or Value object)
        decimals: Number of decimal places to round to
        direction: Rounding direction (Dutch keywords from RegelSpraak spec)

    Returns:
        Rounded Decimal value

    Raises:
        ValueError: If direction is not recognized
    """
    # Handle Value objects by extracting their decimal representation
    if hasattr(value, 'to_decimal'):
        dec_value = value.to_decimal()
    elif hasattr(value, 'value'):
        dec_value = ensure_decimal(value.value)
    else:
        dec_value = ensure_decimal(value)

    if direction not in ROUNDING_MAP:
        raise ValueError(f"Unknown rounding direction: {direction}")

    # Create quantizer with the appropriate scale
    quantizer = Decimal(1).scaleb(-decimals)

    with localcontext(DECIMAL_CONTEXT):
        return dec_value.quantize(quantizer, rounding=ROUNDING_MAP[direction])


def decimal_floor(value: Union[Decimal, 'Value'], decimals: int = 0) -> Decimal:
    """Floor a Decimal value to specified decimal places.

    Args:
        value: The value to floor
        decimals: Number of decimal places (default 0 for integer floor)

    Returns:
        Floored Decimal value
    """
    return quantize_decimal(value, decimals, "naar_beneden")


def decimal_ceil(value: Union[Decimal, 'Value'], decimals: int = 0) -> Decimal:
    """Ceiling a Decimal value to specified decimal places.

    Args:
        value: The value to ceil
        decimals: Number of decimal places (default 0 for integer ceiling)

    Returns:
        Ceiled Decimal value
    """
    return quantize_decimal(value, decimals, "naar_boven")


def decimal_round(value: Union[Decimal, 'Value'], decimals: int = 0) -> Decimal:
    """Round a Decimal value using standard arithmetic rounding (0.5 rounds up).

    Args:
        value: The value to round
        decimals: Number of decimal places (default 0 for integer rounding)

    Returns:
        Rounded Decimal value
    """
    return quantize_decimal(value, decimals, "rekenkundig")


def decimal_power(base: Union[Decimal, 'Value'], exponent: Union[Decimal, 'Value']) -> Decimal:
    """Compute base raised to exponent using Decimal arithmetic.

    Args:
        base: The base value
        exponent: The exponent value

    Returns:
        Result of base ** exponent as Decimal

    Raises:
        RuntimeError: If base is negative with non-integer exponent
    """
    # Extract decimal values
    if hasattr(base, 'to_decimal'):
        base_dec = base.to_decimal()
    elif hasattr(base, 'value'):
        base_dec = ensure_decimal(base.value)
    else:
        base_dec = ensure_decimal(base)

    if hasattr(exponent, 'to_decimal'):
        exp_dec = exponent.to_decimal()
    elif hasattr(exponent, 'value'):
        exp_dec = ensure_decimal(exponent.value)
    else:
        exp_dec = ensure_decimal(exponent)

    with localcontext(DECIMAL_CONTEXT):
        # Check if exponent is an integer
        if exp_dec == exp_dec.to_integral_value():
            # Use direct power for integer exponents
            return base_dec ** int(exp_dec)
        else:
            # Non-integer exponent requires positive base
            if base_dec <= 0:
                raise RuntimeError(f"Non-integer exponents require positive base, got {base_dec}")
            # Use logarithm method: base^exp = e^(exp * ln(base))
            # Note: ln() and exp() require Python 3.11+ or we need to implement via log10
            try:
                # Try Python 3.11+ methods
                return (exp_dec * base_dec.ln()).exp()
            except AttributeError:
                # Fallback for older Python versions using change of base formula
                # ln(x) = log10(x) / log10(e)
                import math
                e = Decimal(str(math.e))
                ln_base = base_dec.log10() / e.log10()
                result_exp = exp_dec * ln_base
                # e^x using power series or approximation
                # For now, fall back to float conversion (to be improved)
                return Decimal(str(math.exp(float(result_exp))))


def decimal_min(value1: Union[Decimal, 'Value'], value2: Union[Decimal, 'Value']) -> Decimal:
    """Return the minimum of two Decimal values.

    Args:
        value1: First value
        value2: Second value

    Returns:
        The smaller of the two values as Decimal
    """
    dec1 = value1.to_decimal() if hasattr(value1, 'to_decimal') else ensure_decimal(value1.value if hasattr(value1, 'value') else value1)
    dec2 = value2.to_decimal() if hasattr(value2, 'to_decimal') else ensure_decimal(value2.value if hasattr(value2, 'value') else value2)

    with localcontext(DECIMAL_CONTEXT):
        return min(dec1, dec2)


def decimal_max(value1: Union[Decimal, 'Value'], value2: Union[Decimal, 'Value']) -> Decimal:
    """Return the maximum of two Decimal values.

    Args:
        value1: First value
        value2: Second value

    Returns:
        The larger of the two values as Decimal
    """
    dec1 = value1.to_decimal() if hasattr(value1, 'to_decimal') else ensure_decimal(value1.value if hasattr(value1, 'value') else value1)
    dec2 = value2.to_decimal() if hasattr(value2, 'to_decimal') else ensure_decimal(value2.value if hasattr(value2, 'value') else value2)

    with localcontext(DECIMAL_CONTEXT):
        return max(dec1, dec2)


def is_numeric_type(value) -> bool:
    """Check if a value is a numeric type (int, float, or Decimal).

    Args:
        value: Value to check

    Returns:
        True if value is numeric, False otherwise
    """
    return isinstance(value, (int, float, Decimal))