#!/usr/bin/env python3
"""Debug timeline aggregation issue."""

from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, TimelineValue
from regelspraak.ast import Timeline, Period
from decimal import Decimal
from datetime import date
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)

regelspraak_code = '''
Objecttype de Persoon
    de dagelijkse kosten Bedrag voor elke dag;
    de cumulatieve kosten Bedrag voor elke dag;

Regel bereken cumulatieve kosten
    geldig altijd
        De cumulatieve kosten van een persoon moet berekend worden als 
        het totaal van zijn dagelijkse kosten.
'''

print("Parsing model...")
model = parse_text(regelspraak_code)
context = RuntimeContext(model)
context.trace_sink = None  # Disable tracing

print("Creating person...")
persoon = RuntimeObject('Persoon')
context.add_object(persoon)

print("Setting up timeline...")
kosten_periods = [
    Period(date(2024, 1, 1), date(2024, 1, 2), 
           Value(Decimal(100), 'Bedrag', '€')),
    Period(date(2024, 1, 2), date(2024, 1, 3), 
           Value(Decimal(150), 'Bedrag', '€')),
]
kosten_timeline = TimelineValue(Timeline(periods=kosten_periods, granularity='dag'))
context.set_timeline_attribute(persoon, 'dagelijkse kosten', kosten_timeline)

print("Setting evaluation date...")
context.evaluation_date = date(2024, 1, 1)

print("Executing model...")
evaluator = Evaluator(context)
try:
    evaluator.execute_model(model)
    print("Model executed successfully")
except Exception as e:
    print(f"Error during execution: {e}")
    import traceback
    traceback.print_exc()

print("Fetching result...")
# Get the timeline value directly
if 'cumulatieve kosten' in persoon.timeline_attributen:
    result = persoon.timeline_attributen['cumulatieve kosten']
    print(f"Result type: {type(result)}")
    print(f"Result value: {result}")
    
    if isinstance(result, TimelineValue):
        print("SUCCESS: Result is a TimelineValue")
        print(f"Timeline has {len(result.timeline.periods)} periods")
        # Print the values at each period
        for period in result.timeline.periods:
            print(f"  {period.start_date} to {period.end_date}: {period.value}")
    else:
        print("FAILURE: Result is not a TimelineValue")
else:
    print("FAILURE: No timeline attribute found")
    # Try getting scalar value
    scalar_result = context.get_attribute(persoon, 'cumulatieve kosten')
    print(f"Scalar result: {scalar_result}")