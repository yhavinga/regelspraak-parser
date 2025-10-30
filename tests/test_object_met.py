#!/usr/bin/env python3
from regelspraak.parsing import parse_text

# Test the 'met' syntax for object creation
tests = [
    ("Simple object creation", """
Regel test1
    geldig altijd
        Er wordt een nieuw x aangemaakt.
"""),
    ("Object creation with attribute", """
Regel test2
    geldig altijd
        Er wordt een nieuw x aangemaakt met attribuut gelijk aan 5.
"""),
    ("Relationship with 'heeft'", """
Regel test3
    geldig altijd
        Een x heeft de y.
"""),
    ("Relationship with 'heeft het'", """
Regel test4
    geldig altijd
        Een x heeft het y.
"""),
    ("TOKA pattern - simple", """
Regel test5
    geldig altijd
        Een vlucht heeft het vastgestelde contingent gelijk aan treinmiles.
"""),
    ("TOKA pattern - with 'met' on same line", """
Regel test6
    geldig altijd
        Een vlucht heeft het vastgestelde contingent treinmiles met aantal gelijk aan 5.
"""),
    ("TOKA pattern - with 'met' on next line", """
Regel test7
    geldig altijd
        Een vlucht heeft het vastgestelde contingent treinmiles met
        aantal gelijk aan 5.
"""),
    ("TOKA exact pattern", """
Objecttype de Vlucht
Objecttype het vastgestelde contingent treinmiles
    het aantal treinmiles op basis van aantal passagiers Numeriek;
    
Regel vastgestelde contingent treinmiles
    geldig altijd
        Een vlucht heeft het vastgestelde contingent treinmiles met
        aantal treinmiles op basis van aantal passagiers gelijk aan het aantal passagiers
        van de Vlucht maal het aantal treinmiles per passagier voor contingent.
"""),
]

for name, code in tests:
    print(f"\n{name}:")
    try:
        parse_text(code)
        print("  ✓ Success")
    except Exception as e:
        error_msg = str(e).split('\n')[0]
        print(f"  ✗ Failed: {error_msg}")