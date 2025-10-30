from src.regelspraak.parsing import parse_text
from src.regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from datetime import date

code = """
Objecttype de Natuurlijk persoon
    de geboortedatum Datum;

Objecttype de Vlucht  
    de vluchtdatum Datum;

Feittype vlucht van natuurlijke personen
    de reis Vlucht
    de passagier Natuurlijk persoon
    Eén reis betreft de verplaatsing van meerdere passagiers
"""

model = parse_text(code)
context = RuntimeContext(model)

# Create objects
passenger = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p1")
context.add_object(passenger)

flight = RuntimeObject(object_type_naam="Vlucht", instance_id="f1")
context.add_object(flight)

# Add relationship
print("Creating relationship:")
print(f"  feittype: 'vlucht van natuurlijke personen'")
print(f"  subject: {flight.object_type_naam}")
print(f"  object: {passenger.object_type_naam}")

context.add_relationship(
    feittype_naam="vlucht van natuurlijke personen",
    subject=flight,
    object=passenger,
    preposition="VAN"
)

# Test navigation
print("\nTesting get_related_objects:")
print(f"  From: {passenger.object_type_naam}")
print(f"  FeitType: 'vlucht van natuurlijke personen'")
print(f"  as_subject: False")

related = context.get_related_objects(passenger, "vlucht van natuurlijke personen", as_subject=False)
print(f"  Result: {[r.object_type_naam for r in related]}")

# Also test the reverse
print("\nReverse test:")
print(f"  From: {flight.object_type_naam}")
print(f"  as_subject: True")
related2 = context.get_related_objects(flight, "vlucht van natuurlijke personen", as_subject=True)
print(f"  Result: {[r.object_type_naam for r in related2]}")
