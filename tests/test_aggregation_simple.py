#!/usr/bin/env python3
"""Test aggregation functions with simpler patterns."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from decimal import Decimal
from datetime import date

class TestSimpleAggregation(unittest.TestCase):
    
    def test_som_van_with_relationship(self):
        """Test som van with a simple relationship pattern."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de belasting Bedrag;
        
        Objecttype de Vlucht (mv: vluchten)
            de totale belasting Bedrag;
        
        Feittype vlucht van natuurlijke personen
            de reis Vlucht
            de passagier Natuurlijk persoon
            Eén reis betreft de verplaatsing van meerdere passagiers
        
        Regel Totale belasting
            geldig altijd
                De totale belasting van een vlucht moet berekend worden als 
                de som van de belasting van alle passagiers van de reis.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a flight
        flight = RuntimeObject("Vlucht")
        context.add_object(flight)
        
        # Create passengers
        p1 = RuntimeObject("Natuurlijk persoon")
        context.add_object(p1)
        context.set_attribute(p1, "belasting", Value(Decimal(100), "Bedrag", "€"))
        
        p2 = RuntimeObject("Natuurlijk persoon")
        context.add_object(p2)
        context.set_attribute(p2, "belasting", Value(Decimal(200), "Bedrag", "€"))
        
        # Create relationships
        context.add_relationship(
            feittype_naam="vlucht van natuurlijke personen",
            subject=flight,
            object=p1,
            preposition="VAN"
        )
        context.add_relationship(
            feittype_naam="vlucht van natuurlijke personen",
            subject=flight,
            object=p2,
            preposition="VAN"
        )
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result
        total = context.get_attribute(flight, "totale belasting")
        self.assertEqual(total.value, Decimal(300))
        self.assertEqual(total.unit, "€")
    
    def test_tijdsduur_calculation(self):
        """Test that tijdsduur calculation still works."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de geboortedatum Datum;
            de leeftijd Numeriek met eenheid jr;
        
        Objecttype de Vlucht (mv: vluchten)
            de vluchtdatum Datum;
        
        Feittype vlucht van natuurlijke personen
            de reis Vlucht
            de passagier Natuurlijk persoon
            Eén reis betreft de verplaatsing van meerdere passagiers
        
        Regel bepaal leeftijd
            geldig altijd
                De leeftijd van een Natuurlijk persoon moet berekend worden als 
                de tijdsduur van zijn geboortedatum tot de vluchtdatum van zijn reis in hele jaren.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create person and flight
        person = RuntimeObject("Natuurlijk persoon")
        context.add_object(person)
        context.set_attribute(person, "geboortedatum", Value(date(1990, 3, 15), "Datum"))
        
        flight = RuntimeObject("Vlucht")
        context.add_object(flight)
        context.set_attribute(flight, "vluchtdatum", Value(date(2024, 6, 20), "Datum"))
        
        # Create relationship
        context.add_relationship(
            feittype_naam="vlucht van natuurlijke personen",
            subject=flight,
            object=person,
            preposition="VAN"
        )
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result
        age = context.get_attribute(person, "leeftijd")
        self.assertEqual(age.value, 34)
        self.assertEqual(age.unit, "jaren")

if __name__ == "__main__":
    unittest.main()