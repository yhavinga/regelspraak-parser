"""Utilities for timeline operations including date alignment and knip merging."""

from datetime import datetime, date, timedelta
from dateutil.relativedelta import relativedelta
from typing import List, Set, Tuple, Optional
from . import ast


def align_to_day(dt: datetime) -> datetime:
    """Align a datetime to the start of the day (00:00:00)."""
    return datetime(dt.year, dt.month, dt.day)


def align_to_month(dt: datetime) -> datetime:
    """Align a datetime to the start of the month (first day at 00:00:00)."""
    return datetime(dt.year, dt.month, 1)


def align_to_year(dt: datetime) -> datetime:
    """Align a datetime to the start of the year (January 1st at 00:00:00)."""
    return datetime(dt.year, 1, 1)


def next_day(dt: datetime) -> datetime:
    """Get the next day at 00:00:00."""
    return align_to_day(dt + timedelta(days=1))


def next_month(dt: datetime) -> datetime:
    """Get the first day of the next month at 00:00:00."""
    return align_to_month(dt + relativedelta(months=1))


def next_year(dt: datetime) -> datetime:
    """Get January 1st of the next year at 00:00:00."""
    return align_to_year(dt + relativedelta(years=1))


def align_date(dt: datetime, granularity: str) -> datetime:
    """Align a date to the start of its period based on granularity.
    
    Args:
        dt: The datetime to align
        granularity: One of "dag", "maand", or "jaar"
    
    Returns:
        The aligned datetime
    """
    if granularity == "dag":
        return align_to_day(dt)
    elif granularity == "maand":
        return align_to_month(dt)
    elif granularity == "jaar":
        return align_to_year(dt)
    else:
        raise ValueError(f"Unknown granularity: {granularity}")


def next_period(dt: datetime, granularity: str) -> datetime:
    """Get the start of the next period based on granularity.
    
    Args:
        dt: The current datetime
        granularity: One of "dag", "maand", or "jaar"
    
    Returns:
        The start of the next period
    """
    if granularity == "dag":
        return next_day(dt)
    elif granularity == "maand":
        return next_month(dt)
    elif granularity == "jaar":
        return next_year(dt)
    else:
        raise ValueError(f"Unknown granularity: {granularity}")


def get_knips_from_timeline(timeline: ast.Timeline) -> List[datetime]:
    """Extract all knips (change points) from a timeline.
    
    Returns a sorted list of unique dates where the timeline value changes.
    """
    knips = set()
    for period in timeline.periods:
        knips.add(period.start_date)
        knips.add(period.end_date)
    return sorted(list(knips))


def merge_knips(*timelines: ast.Timeline) -> List[datetime]:
    """Merge knips from multiple timelines into a single sorted list.
    
    When evaluating expressions with multiple timeline operands,
    we need all the knips from all timelines to determine evaluation periods.
    """
    all_knips = set()
    for timeline in timelines:
        knips = get_knips_from_timeline(timeline)
        all_knips.update(knips)
    return sorted(list(all_knips))


def get_evaluation_periods(knips: List[datetime]) -> List[Tuple[datetime, datetime]]:
    """Convert a list of knips into evaluation periods.
    
    Each period is represented as (start_date, end_date) where the value
    is constant within that period.
    
    Args:
        knips: Sorted list of datetime knips
    
    Returns:
        List of (start, end) tuples representing periods between knips
    """
    if not knips:
        return []
    
    periods = []
    for i in range(len(knips) - 1):
        periods.append((knips[i], knips[i + 1]))
    
    return periods


def remove_redundant_knips(timeline: ast.Timeline) -> ast.Timeline:
    """Remove knips where the value doesn't actually change.
    
    Per specification, if calculated values are the same across a knip,
    that knip should be removed from the result timeline.
    """
    if len(timeline.periods) <= 1:
        return timeline
    
    # Build new periods list, merging consecutive periods with same value
    new_periods = []
    current_period = timeline.periods[0]
    
    for next_period in timeline.periods[1:]:
        # Check if values are equal (comparing Value objects)
        if (current_period.value.value == next_period.value.value and
            current_period.value.datatype == next_period.value.datatype and
            current_period.value.unit == next_period.value.unit):
            # Merge periods by extending current period's end date
            current_period = ast.Period(
                start_date=current_period.start_date,
                end_date=next_period.end_date,
                value=current_period.value
            )
        else:
            # Values differ, save current period and start new one
            new_periods.append(current_period)
            current_period = next_period
    
    # Don't forget the last period
    new_periods.append(current_period)
    
    return ast.Timeline(periods=new_periods, granularity=timeline.granularity)


def periods_overlap(period1: ast.Period, period2: ast.Period) -> bool:
    """Check if two periods overlap in time."""
    return period1.start_date < period2.end_date and period2.start_date < period1.end_date


def calculate_proportional_value(base_value: 'Value', start_date: datetime, end_date: datetime, period_type: str) -> 'Value':
    """Calculate time-proportional value for a partial period.
    
    Per specification section 7.3.2:
    - For months: proportion = days_in_period / total_days_in_month
    - For years: proportion = days_in_period / total_days_in_year
    
    Args:
        base_value: The value to calculate proportion of
        start_date: Start of the period
        end_date: End of the period
        period_type: "maand" or "jaar"
    
    Returns:
        Value with proportional amount
    """
    from decimal import Decimal
    from .runtime import Value
    import calendar
    
    if base_value.value is None:
        return base_value
    
    # Calculate the number of days in the period
    period_days = (end_date - start_date).days
    
    # Determine the full period boundaries
    if period_type == "maand":
        # Find the month this period belongs to
        # Use the start date's month as the reference
        month_start = align_to_month(start_date)
        month_year = month_start.year
        month_num = month_start.month
        
        # Get total days in the month
        total_days = calendar.monthrange(month_year, month_num)[1]
        
        # Check if this is a full month
        if month_start == start_date:
            # Check if end_date is the start of next month
            next_month_start = next_month(month_start)
            if end_date == next_month_start:
                # Full month - return value as-is
                return base_value
    
    elif period_type == "jaar":
        # Find the year this period belongs to
        year_start = align_to_year(start_date)
        year_num = year_start.year
        
        # Get total days in the year (account for leap years)
        if calendar.isleap(year_num):
            total_days = 366
        else:
            total_days = 365
        
        # Check if this is a full year
        if year_start == start_date:
            next_year_start = next_year(year_start)
            if end_date == next_year_start:
                # Full year - return value as-is
                return base_value
    
    else:
        raise ValueError(f"Invalid period type: {period_type}")
    
    # Calculate proportion
    proportion = Decimal(period_days) / Decimal(total_days)
    
    # Apply proportion to the value
    base_decimal = base_value.to_decimal()
    proportional_amount = base_decimal * proportion
    
    # Return new value with proportional amount
    return Value(
        value=proportional_amount,
        datatype=base_value.datatype,
        unit=base_value.unit
    )


def create_infinite_period(value: 'Value', before: bool = True) -> ast.Period:
    """Create a period that extends to infinity in one direction.
    
    Args:
        value: The Value for this period
        before: If True, creates period from -infinity to epoch.
                If False, creates period from far future to +infinity.
    """
    if before:
        # Period from distant past to epoch
        return ast.Period(
            start_date=datetime(1900, 1, 1),  # Arbitrary distant past
            end_date=datetime(1970, 1, 1),    # Epoch
            value=value
        )
    else:
        # Period from far future onwards
        return ast.Period(
            start_date=datetime(2100, 1, 1),  # Arbitrary far future
            end_date=datetime(2200, 1, 1),    # Even further future
            value=value
        )