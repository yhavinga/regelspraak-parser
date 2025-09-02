#!/usr/bin/env python3
"""Debug test for collection resolution."""

import sys
sys.path.insert(0, 'src')

from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext
from regelspraak.ast import AttributeReference, SourceSpan, FunctionCall
import logging

# Enable debug logging
logging.basicConfig(level=logging.DEBUG, format='%(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('test')

# Create a minimal test with just what we need
rules = '''
Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
    de leeftijd	Numeriek met eenheid jr;

Objecttype de Vlucht (mv: vluchten)
    de vluchtdatum	Datum in dagen;

Feittype vlucht van natuurlijke personen
    de reis	Vlucht
    de passagier	Natuurlijk persoon
'''

model = parse_text(rules)
context = RuntimeContext(model)
engine = Evaluator(context)

# Create test objects
vlucht = context.create_object('Vlucht', 'v1')
context.add_object(vlucht)
logger.info(f"Created vlucht: {vlucht.object_type_naam}")

from regelspraak.runtime import Value

p1 = context.create_object('Natuurlijk persoon', 'p1')
p1.attributen['leeftijd'] = Value(value=24, datatype='Numeriek', unit='jr')
context.add_object(p1)
logger.info(f"Created p1: {p1.object_type_naam} with age 24")

p2 = context.create_object('Natuurlijk persoon', 'p2')
p2.attributen['leeftijd'] = Value(value=64, datatype='Numeriek', unit='jr')
context.add_object(p2)
logger.info(f"Created p2: {p2.object_type_naam} with age 64")

# Create relationships
rel1 = context.add_relationship('vlucht van natuurlijke personen', vlucht, p1)
logger.info(f"Created relationship 1: {rel1.feittype_naam}, subject={rel1.subject.object_type_naam}, object={rel1.object.object_type_naam}")

rel2 = context.add_relationship('vlucht van natuurlijke personen', vlucht, p2)
logger.info(f"Created relationship 2: {rel2.feittype_naam}, subject={rel2.subject.object_type_naam}, object={rel2.object.object_type_naam}")

# Check FeitType definition
feittype = context.domain_model.feittypen.get('vlucht van natuurlijke personen')
if feittype:
    logger.info(f"\nFeitType '{feittype.naam}' has roles:")
    for rol in feittype.rollen:
        logger.info(f"  - Role '{rol.naam}' -> {rol.object_type}")

# Set current instance to vlucht for aggregation
context.current_instance = vlucht
logger.info(f"\nCurrent instance: {context.current_instance.object_type_naam}")

# Enable debug logging for the engine
import logging
logging.getLogger('src.regelspraak.engine').setLevel(logging.DEBUG)

# Try to resolve 'passagiers van de reis'
logger.info("\nTrying to resolve 'passagiers van de reis'...")
collection_expr = AttributeReference(span=SourceSpan(0,0,0,0), path=['passagiers', 'van', 'de', 'reis'])
collection = engine._resolve_collection_for_aggregation(collection_expr)

logger.info(f'\nCollection resolved: {len(collection)} objects')
for obj in collection:
    leeftijd = obj.attributen.get('leeftijd')
    logger.info(f'  - {obj.object_type_naam} with leeftijd={leeftijd}')

# Also test the 'leeftijden' collection directly
logger.info("\nTrying to get 'leeftijden' from collection...")
func_expr = FunctionCall(
    span=SourceSpan(0,0,0,0),
    function_name='maximale_waarde_van',
    arguments=[
        AttributeReference(span=SourceSpan(0,0,0,0), path=['leeftijden']),
        AttributeReference(span=SourceSpan(0,0,0,0), path=['alle', 'passagiers', 'van', 'de', 'reis'])
    ]
)

result = engine._handle_aggregation_collection_pattern(func_expr, 'maximale_waarde_van')
logger.info(f"Aggregation result: {result}")