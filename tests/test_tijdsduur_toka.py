#!/usr/bin/env python3
"""Test tijdsduur van implementation with TOKA age calculation example."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from datetime import date


class TestTijdsduurTOKA(unittest.TestCase):
    
    def test_toka_age_calculation(self):
        """Test age calculation in TOKA context with feittype relationships."""
        # TOKA age calculation rule
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de geboortedatum Datum in dagen;
            de leeftijd Numeriek (niet-negatief geheel getal) met eenheid jr;

        Objecttype de Vlucht (mv: vluchten)
            de vluchtdatum Datum in dagen;

        Feittype vlucht van natuurlijke personen
            de reis Vlucht
            de passagier Natuurlijk persoon
            Eén reis betreft de verplaatsing van meerdere passagiers

        Regel bepaal leeftijd
            geldig altijd
                De leeftijd van een Natuurlijk persoon moet berekend worden als de tijdsduur van zijn
                geboortedatum tot de vluchtdatum van zijn reis in hele jaren.
        """

        # Parse the RegelSpraak code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model, "Failed to parse RegelSpraak code")

        # Create runtime context
        context = RuntimeContext(model)

        # Create a person with birthdate
        person = RuntimeObject("Natuurlijk persoon")
        context.add_object(person)
        context.set_attribute(person, "geboortedatum", Value(date(1990, 3, 15), "Datum"))

        # Create a flight with flight date
        flight = RuntimeObject("Vlucht")
        context.add_object(flight)
        context.set_attribute(flight, "vluchtdatum", Value(date(2024, 6, 20), "Datum"))

        # Create relationship between person and flight
        context.add_relationship(
            feittype_naam="vlucht van natuurlijke personen",
            subject=flight,
            object=person,
            preposition="VAN"
        )

        # Execute rules
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)

        # Check results
        age = context.get_attribute(person, 'leeftijd')
        
        # Verify the age is correct (34 years from 1990-03-15 to 2024-06-20)
        self.assertEqual(age.value, 34)
        self.assertEqual(age.unit, "jr")


if __name__ == "__main__":
    unittest.main()