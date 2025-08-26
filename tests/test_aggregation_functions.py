#!/usr/bin/env python3
"""Test aggregation functions with collection patterns."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from decimal import Decimal
from datetime import date

class TestAggregationFunctions(unittest.TestCase):
    
    def test_som_van_collection_pattern(self):
        """Test 'som van X van alle Y' pattern."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de te betalen belasting Bedrag;
        
        Objecttype de Vlucht (mv: vluchten)
            de totaal te betalen belasting Bedrag;
        
        Feittype vlucht van natuurlijke personen
            de reis Vlucht
            de passagier Natuurlijk persoon
            Eén reis betreft de verplaatsing van meerdere passagiers
        
        Regel Totaal te betalen belasting
            geldig altijd
                De totaal te betalen belasting van een reis moet berekend worden als de som van 
                de te betalen belasting van alle passagiers van de reis.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a flight
        flight = RuntimeObject("Vlucht")
        context.add_object(flight)
        
        # Create passengers with tax amounts
        passenger1 = RuntimeObject("Natuurlijk persoon")
        context.add_object(passenger1)
        context.set_attribute(passenger1, "te betalen belasting", Value(Decimal(100), "Bedrag", "€"))
        
        passenger2 = RuntimeObject("Natuurlijk persoon")
        context.add_object(passenger2)
        context.set_attribute(passenger2, "te betalen belasting", Value(Decimal(150), "Bedrag", "€"))
        
        passenger3 = RuntimeObject("Natuurlijk persoon")
        context.add_object(passenger3)
        context.set_attribute(passenger3, "te betalen belasting", Value(Decimal(200), "Bedrag", "€"))
        
        # Create relationships
        context.add_relationship(
            feittype_naam="vlucht van natuurlijke personen",
            subject=flight,
            object=passenger1,
            preposition="VAN"
        )
        context.add_relationship(
            feittype_naam="vlucht van natuurlijke personen",
            subject=flight,
            object=passenger2,
            preposition="VAN"
        )
        context.add_relationship(
            feittype_naam="vlucht van natuurlijke personen",
            subject=flight,
            object=passenger3,
            preposition="VAN"
        )
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result
        total_tax = context.get_attribute(flight, "totaal te betalen belasting")
        self.assertEqual(total_tax.value, Decimal(450))
        self.assertEqual(total_tax.unit, "€")
    
    def test_eerste_laatste_van_dates(self):
        """Test first/last date functions."""
        regelspraak_code = """
        Objecttype de Planning
            de start datum Datum;
            de eind datum Datum;
        
        Parameter datum1 : Datum;
        Parameter datum2 : Datum;
        Parameter datum3 : Datum;
        
        Regel bepaal start
            geldig altijd
                De start datum van een planning moet berekend worden als de eerste van datum1, datum2 en datum3.
        
        Regel bepaal eind
            geldig altijd
                De eind datum van een planning moet berekend worden als de laatste van datum1, datum2 en datum3.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        context.set_parameter("datum1", date(2024, 3, 15))
        context.set_parameter("datum2", date(2024, 1, 1))
        context.set_parameter("datum3", date(2024, 6, 30))
        
        planning = RuntimeObject("Planning")
        context.add_object(planning)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        start = context.get_attribute(planning, "start datum")
        eind = context.get_attribute(planning, "eind datum")
        
        self.assertEqual(start.value, date(2024, 1, 1))
        self.assertEqual(eind.value, date(2024, 6, 30))
    
    def test_som_van_empty_collection(self):
        """Test sum over empty collection returns 0."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de te betalen belasting Bedrag;
        
        Objecttype de Vlucht (mv: vluchten)
            de totaal te betalen belasting Bedrag;
        
        Feittype vlucht van natuurlijke personen
            de reis Vlucht
            de passagier Natuurlijk persoon
            Eén reis betreft de verplaatsing van meerdere passagiers
        
        Regel Totaal te betalen belasting
            geldig altijd
                De totaal te betalen belasting van een reis moet berekend worden als de som van 
                de te betalen belasting van alle passagiers van de reis.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create a flight with no passengers
        flight = RuntimeObject("Vlucht")
        context.add_object(flight)
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result - should be 0 for empty collection
        total_tax = context.get_attribute(flight, "totaal te betalen belasting")
        self.assertEqual(total_tax.value, Decimal(0))
        self.assertEqual(total_tax.datatype, "Bedrag")

if __name__ == "__main__":
    unittest.main()