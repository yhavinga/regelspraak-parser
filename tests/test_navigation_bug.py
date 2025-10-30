#!/usr/bin/env python3
"""Test to reproduce the navigation bug in 'het aantal passagiers van de reis'."""

from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from datetime import date

def test_navigation_bug():
    """Test the exact pattern that's failing in TOKA."""
    
    # Simplified version of the TOKA rule that's failing
    regelspraak_code = """
    Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
        de leeftijd Numeriek (geheel getal) met eenheid jr;

    Objecttype de Vlucht (mv: vluchten)
        de hoeveelheid passagiers Numeriek (geheel getal);

    Feittype vlucht van natuurlijke personen
        de reis Vlucht
        de passagier Natuurlijk persoon
        Eén reis betreft de verplaatsing van meerdere passagiers

    Regel Hoeveelheid passagiers van een reis
        geldig altijd
            De hoeveelheid passagiers van een reis moet berekend worden als het aantal passagiers van de reis.
    """
    
    # Parse the code
    model = parse_text(regelspraak_code)
    print("✓ Parsing successful")
    
    # Create runtime context
    context = RuntimeContext(model)
    
    # Create a flight
    flight = RuntimeObject("Vlucht", instance_id="flight1")
    context.add_object(flight)
    
    # Create passengers
    passengers = []
    for i in range(3):
        passenger = RuntimeObject("Natuurlijk persoon", instance_id=f"passenger{i}")
        context.set_attribute(passenger, "leeftijd", Value(25 + i, "Numeriek", "jr"))
        context.add_object(passenger)
        passengers.append(passenger)
        
        # Create relationship between flight and passenger
        gelijk aan context.add_relationship("vlucht van natuurlijke personen", flight, passenger)
    
    print(f"✓ Created {len(passengers)} passengers with relationships")
    
    # Set current instance to the flight
    context.current_instance = flight
    print("✓ Set current instance to flight")
    
    # Execute the rule
    evaluator = Evaluator(context)
    try:
        evaluator.execute_model(model)
        print("✓ Rule execution successful")
        
        # Check the result
        count = context.get_attribute(flight, "hoeveelheid passagiers")
        print(f"✓ Result: {count.value} passengers")
        
    except Exception as e:
        print(f"✗ Rule execution failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_navigation_bug()