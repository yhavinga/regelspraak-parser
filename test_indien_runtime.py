#!/usr/bin/env python3
"""Test runtime execution of indien conditional rules."""

import sys
sys.path.insert(0, 'src')

from regelspraak import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.engine import Evaluator

# Test 1: Simple indien condition
print("Test 1: Simple indien condition")
print("-" * 40)

text = """
Parameter de volwassenleeftijd: Numeriek (geheel getal) met eenheid jr;

Objecttype de Natuurlijk persoon
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Regel Minderjarigheid
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.
"""

model = parse_text(text)
context = RuntimeContext(domain_model=model)
context.set_parameter("volwassenleeftijd", 18, unit="jr")

# Test with a minor (age 15)
person1 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p1")
context.add_object(person1)
context.set_attribute(person1, "leeftijd", Value(15, datatype="Numeriek", unit="jr"))
context.set_current_instance(person1)

evaluator = Evaluator(context)
evaluator.execute_model(model)

print(f"Person 1 (age 15):")
print(f"  minderjarig: {person1.kenmerken.get('minderjarig', False)}")
assert person1.kenmerken.get('minderjarig') == True, "Person with age 15 should be minderjarig"

# Test with an adult (age 20)
person2 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p2")
context.add_object(person2)
context.set_attribute(person2, "leeftijd", Value(20, datatype="Numeriek", unit="jr"))
context.set_current_instance(person2)

evaluator.execute_model(model)

print(f"Person 2 (age 20):")
print(f"  minderjarig: {person2.kenmerken.get('minderjarig', False)}")
# When condition is false, kenmerk is not assigned (None/False are equivalent)
assert person2.kenmerken.get('minderjarig', False) == False, "Person with age 20 should not be minderjarig"

print("\nTest 1 PASSED ✓")

# Test 2: Compound conditions
print("\nTest 2: Compound conditions")
print("-" * 40)

text2 = """
Parameter de volwassenleeftijd: Numeriek (geheel getal) met eenheid jr;
Parameter de pensioenleeftijd: Numeriek (geheel getal) met eenheid jr;

Objecttype de Natuurlijk persoon
    is volwassen kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Regel KenmerkVolwassen
    geldig altijd
        Een Natuurlijk persoon is volwassen
        indien hij aan alle volgende voorwaarden voldoet:
            • zijn leeftijd is groter of gelijk aan de volwassenleeftijd
            • zijn leeftijd is kleiner dan de pensioenleeftijd.
"""

model2 = parse_text(text2)
context2 = RuntimeContext(domain_model=model2)
context2.set_parameter("volwassenleeftijd", 18, unit="jr")
context2.set_parameter("pensioenleeftijd", 65, unit="jr")

# Test with age 30 (should be volwassen)
person3 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p3")
context2.add_object(person3)
context2.set_attribute(person3, "leeftijd", Value(30, datatype="Numeriek", unit="jr"))
context2.set_current_instance(person3)

evaluator2 = Evaluator(context2)
evaluator2.execute_model(model2)

print(f"Person 3 (age 30):")
print(f"  volwassen: {person3.kenmerken.get('volwassen', False)}")
assert person3.kenmerken.get('volwassen') == True, "Person with age 30 should be volwassen"

# Test with age 70 (should not be volwassen)
person4 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p4")
context2.add_object(person4)
context2.set_attribute(person4, "leeftijd", Value(70, datatype="Numeriek", unit="jr"))
context2.set_current_instance(person4)

evaluator2.execute_model(model2)

print(f"Person 4 (age 70):")
print(f"  volwassen: {person4.kenmerken.get('volwassen', False)}")
assert person4.kenmerken.get('volwassen', False) == False, "Person with age 70 should not be volwassen (too old)"

# Test with age 10 (should not be volwassen)
person5 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p5")
context2.add_object(person5)
context2.set_attribute(person5, "leeftijd", Value(10, datatype="Numeriek", unit="jr"))
context2.set_current_instance(person5)

evaluator2.execute_model(model2)

print(f"Person 5 (age 10):")
print(f"  volwassen: {person5.kenmerken.get('volwassen', False)}")
assert person5.kenmerken.get('volwassen', False) == False, "Person with age 10 should not be volwassen (too young)"

print("\nTest 2 PASSED ✓")

print("\n" + "=" * 40)
print("All indien runtime tests PASSED! ✓")
print("=" * 40)