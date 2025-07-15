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