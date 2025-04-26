#!/usr/bin/env python3
"""The example from the README.md."""

from regelspraak.parsing import parse_text
from regelspraak.ast import DomainModel
from regelspraak.runtime import RuntimeContext, Value, RuntimeObject
from regelspraak.engine import Evaluator, PrintTraceSink
from regelspraak.errors import ParseError, SemanticError, RuntimeError


def process_regelspraak_code(text: str):
    try:
        # Parse the text directly into the IR/AST DomainModel
        model: DomainModel = parse_text(text)
        print("Successfully parsed into IR.")

        # Example: You could now validate or execute the model
        # Use PrintTraceSink to see execution details
        trace_sink = PrintTraceSink()
        context = RuntimeContext(
            domain_model=model, trace_sink=trace_sink
        )  # Initialize context with trace

        # Add parameter values
        context.add_parameter(
            "volwassenleeftijd",
            Value(value=18, datatype="Numeriek(geheel getal)", eenheid="jr"),
        )
        print(f"Parameters: {context.parameters}")

        # Create object instances
        person_young = RuntimeObject(
            object_type_naam="Natuurlijk persoon", instance_id="person_15"
        )
        person_young.attributen["leeftijd"] = Value(
            value=15, datatype="Numeriek(geheel getal)", eenheid="jr"
        )

        person_adult = RuntimeObject(
            object_type_naam="Natuurlijk persoon", instance_id="person_25"
        )
        person_adult.attributen["leeftijd"] = Value(
            value=25, datatype="Numeriek(geheel getal)", eenheid="jr"
        )

        # Add instances to context
        context.add_object(person_young)
        context.add_object(person_adult)

        # Print initial state
        print("Initial state:")
        for instance in context.find_objects_by_type("Natuurlijk persoon"):
            print(f"  {instance.instance_id} kenmerken: {instance.kenmerken}")

        # Create evaluator and execute rules
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)

        # Access execution results
        print(f"Execution complete: {results}")

        # Access updated state
        print("Final state:")
        instances = context.find_objects_by_type("Natuurlijk persoon")
        for instance in instances:
            print(f"Instance {instance.instance_id}:")
            for attr_name, attr_value in instance.attributen.items():
                print(f"  - {attr_name}: {attr_value.value}")
            print(f"  - kenmerken: {instance.kenmerken}")

        return instances

    except (ParseError, SemanticError, RuntimeError) as e:
        print(f"Failed to process RegelSpraak: {e}")
        return None


# Example using the steelthread code from test_engine.py
regelspraak_code = """
Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;

Objecttype de Natuurlijk persoon
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Regel Kenmerktoekenning persoon minderjarig
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.
"""
instances = process_regelspraak_code(regelspraak_code)
