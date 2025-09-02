#!/usr/bin/env python3
import sys
sys.path.insert(0, 'src')

from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, Value
from regelspraak.ast import FunctionCall, AttributeReference, SourceSpan

# Parse minimal test
rules = '''
Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
    de leeftijd	Numeriek;

Objecttype de Vlucht (mv: vluchten)

Feittype vlucht van natuurlijke personen
    de reis	Vlucht
    de passagier	Natuurlijk persoon

Regel test
    geldig altijd
        De maximale waarde van de leeftijden van alle passagiers van de reis.
'''

model = parse_text(rules)
context = RuntimeContext(model)

v = context.create_object('Vlucht', 'v1')
context.add_object(v)
p1 = context.create_object('Natuurlijk persoon', 'p1')
context.add_object(p1)
context.set_attribute(p1, 'leeftijd', Value(30, 'Numeriek'))
p2 = context.create_object('Natuurlijk persoon', 'p2')
context.add_object(p2)
context.set_attribute(p2, 'leeftijd', Value(40, 'Numeriek'))

context.add_relationship('vlucht van natuurlijke personen', v, p1, 'VAN')
context.add_relationship('vlucht van natuurlijke personen', v, p2, 'VAN')

evaluator = Evaluator(context)
context.current_instance = v

expr = FunctionCall(
    span=SourceSpan(1,1,1,1),
    function_name='maximale_waarde_van',
    arguments=[
        AttributeReference(span=SourceSpan(1,1,1,1), path=['leeftijden']),
        AttributeReference(span=SourceSpan(1,1,1,1), path=['alle', 'passagiers', 'van', 'de', 'reis'])
    ]
)

# Enable debug logging
import logging
logging.basicConfig(level=logging.DEBUG)

# Test
result = evaluator._handle_function_call(expr)
print(f'Result: {result}')
if result:
    print(f'Result value: {result.value}')