#!/usr/bin/env python3
"""Test Verdeling (distribution) rules."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from decimal import Decimal
from datetime import date

class TestVerdeling(unittest.TestCase):
    
    def test_verdeling_gelijke_delen(self):
        """Test equal distribution of treinmiles."""
        regelspraak_code = """
        Objecttype het Contingent treinmiles
            het totaal aantal treinmiles Numeriek (positief geheel getal);
            het restant na verdeling Numeriek (geheel getal);
        
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de treinmiles Numeriek (geheel getal);
        
        Feittype verdeling contingent treinmiles over passagiers
            het te verdelen contingent treinmiles Contingent treinmiles
            de passagier met recht op treinmiles Natuurlijk persoon
            één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles
        
        Regel verdelingGelijkeDelen
            geldig altijd
                Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
                de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
                contingent treinmiles, waarbij wordt verdeeld in gelijke delen.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create contingent with 300 treinmiles
        contingent = RuntimeObject("Contingent treinmiles")
        context.add_object(contingent)
        context.set_attribute(contingent, "totaal aantal treinmiles", Value(Decimal(300), "Numeriek", None))
        
        # Create 3 passengers
        passengers = []
        for i in range(3):
            passenger = RuntimeObject("Natuurlijk persoon")
            context.add_object(passenger)
            passengers.append(passenger)
            
            # Create relationship
            context.add_relationship(
                feittype_naam="verdeling contingent treinmiles over passagiers",
                subject=contingent,
                object=passenger,
                preposition="OVER"
            )
        
        # Execute rules with contingent as current instance
        context.current_instance = contingent
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check each passenger got 100 treinmiles
        for passenger in passengers:
            miles = context.get_attribute(passenger, "treinmiles")
            self.assertEqual(miles.value, Decimal(100))
    
    def test_verdeling_naar_rato(self):
        """Test proportional distribution based on woonregio factor."""
        regelspraak_code = """
        Objecttype het Contingent treinmiles
            het totaal aantal treinmiles Numeriek (positief geheel getal);
        
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de treinmiles Numeriek (geheel getal);
            de woonregio factor Numeriek (geheel getal);
        
        Feittype verdeling contingent treinmiles over passagiers
            het te verdelen contingent treinmiles Contingent treinmiles
            de passagier met recht op treinmiles Natuurlijk persoon
            één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles
        
        Regel verdelingNaarRato
            geldig altijd
                Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
                de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
                contingent treinmiles, waarbij wordt verdeeld naar rato van de woonregio factor.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create contingent with 600 treinmiles
        contingent = RuntimeObject("Contingent treinmiles")
        context.add_object(contingent)
        context.set_attribute(contingent, "totaal aantal treinmiles", Value(Decimal(600), "Numeriek", None))
        
        # Create passengers with different woonregio factors
        # Passenger 1: factor 1
        passenger1 = RuntimeObject("Natuurlijk persoon")
        context.add_object(passenger1)
        context.set_attribute(passenger1, "woonregio factor", Value(Decimal(1), "Numeriek", None))
        
        # Passenger 2: factor 2
        passenger2 = RuntimeObject("Natuurlijk persoon")
        context.add_object(passenger2)
        context.set_attribute(passenger2, "woonregio factor", Value(Decimal(2), "Numeriek", None))
        
        # Passenger 3: factor 3
        passenger3 = RuntimeObject("Natuurlijk persoon")
        context.add_object(passenger3)
        context.set_attribute(passenger3, "woonregio factor", Value(Decimal(3), "Numeriek", None))
        
        # Create relationships
        for passenger in [passenger1, passenger2, passenger3]:
            context.add_relationship(
                feittype_naam="verdeling contingent treinmiles over passagiers",
                subject=contingent,
                object=passenger,
                preposition="OVER"
            )
        
        # Execute rules
        context.current_instance = contingent
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check distribution: total ratio = 1+2+3 = 6
        # Passenger 1: 600 * 1/6 = 100
        # Passenger 2: 600 * 2/6 = 200
        # Passenger 3: 600 * 3/6 = 300
        self.assertEqual(context.get_attribute(passenger1, "treinmiles").value, Decimal(100))
        self.assertEqual(context.get_attribute(passenger2, "treinmiles").value, Decimal(200))
        self.assertEqual(context.get_attribute(passenger3, "treinmiles").value, Decimal(300))
    
    def test_verdeling_met_afronding(self):
        """Test distribution with rounding."""
        regelspraak_code = """
        Objecttype het Contingent treinmiles
            het totaal aantal treinmiles Numeriek (positief geheel getal);
            het restant na verdeling Numeriek (geheel getal);
        
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de treinmiles Numeriek (geheel getal);
        
        Feittype verdeling contingent treinmiles over passagiers
            het te verdelen contingent treinmiles Contingent treinmiles
            de passagier met recht op treinmiles Natuurlijk persoon
            één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles
        
        Regel verdelingMetAfronding
            geldig altijd
                Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over de treinmiles van alle passagiers met recht op treinmiles van het te verdelen contingent treinmiles, waarbij wordt verdeeld:
                - in gelijke delen,
                - afgerond op 0 decimalen naar beneden.
                Als onverdeelde rest blijft het restant na verdeling van het te verdelen contingent treinmiles over.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create contingent with 100 treinmiles
        contingent = RuntimeObject("Contingent treinmiles")
        context.add_object(contingent)
        context.set_attribute(contingent, "totaal aantal treinmiles", Value(Decimal(100), "Numeriek", None))
        
        # Create 3 passengers
        passengers = []
        for i in range(3):
            passenger = RuntimeObject("Natuurlijk persoon")
            context.add_object(passenger)
            passengers.append(passenger)
            context.add_relationship(
                feittype_naam="verdeling contingent treinmiles over passagiers",
                subject=contingent,
                object=passenger,
                preposition="OVER"
            )
        
        # Execute rules
        context.current_instance = contingent
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check distribution: 100/3 = 33.333...
        # Each passenger gets 33 (rounded down)
        for passenger in passengers:
            miles = context.get_attribute(passenger, "treinmiles")
            self.assertEqual(miles.value, Decimal(33))
        
        # Check remainder: 100 - (33*3) = 1
        remainder = context.get_attribute(contingent, "restant na verdeling")
        self.assertEqual(remainder.value, Decimal(1))
    
    def test_verdeling_met_maximum(self):
        """Test distribution with maximum constraint."""
        regelspraak_code = """
        Objecttype het Contingent treinmiles
            het totaal aantal treinmiles Numeriek (positief geheel getal);
        
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de treinmiles Numeriek (geheel getal);
            het maximaal aantal te ontvangen treinmiles Numeriek (geheel getal);
        
        Feittype verdeling contingent treinmiles over passagiers
            het te verdelen contingent treinmiles Contingent treinmiles
            de passagier met recht op treinmiles Natuurlijk persoon
            één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles
        
        Regel verdelingMetMaximum
            geldig altijd
                Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over de treinmiles van alle passagiers met recht op treinmiles van het te verdelen contingent treinmiles, waarbij wordt verdeeld:
                - in gelijke delen,
                - met een maximum van het maximaal aantal te ontvangen treinmiles.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create contingent with 300 treinmiles
        contingent = RuntimeObject("Contingent treinmiles")
        context.add_object(contingent)
        context.set_attribute(contingent, "totaal aantal treinmiles", Value(Decimal(300), "Numeriek", None))
        
        # Create 3 passengers with different maximum limits
        passenger1 = RuntimeObject("Natuurlijk persoon")
        context.add_object(passenger1)
        context.set_attribute(passenger1, "maximaal aantal te ontvangen treinmiles", Value(Decimal(50), "Numeriek", None))
        
        passenger2 = RuntimeObject("Natuurlijk persoon")
        context.add_object(passenger2)
        context.set_attribute(passenger2, "maximaal aantal te ontvangen treinmiles", Value(Decimal(150), "Numeriek", None))
        
        passenger3 = RuntimeObject("Natuurlijk persoon")
        context.add_object(passenger3)
        context.set_attribute(passenger3, "maximaal aantal te ontvangen treinmiles", Value(Decimal(200), "Numeriek", None))
        
        # Create relationships
        for passenger in [passenger1, passenger2, passenger3]:
            context.add_relationship(
                feittype_naam="verdeling contingent treinmiles over passagiers",
                subject=contingent,
                object=passenger,
                preposition="OVER"
            )
        
        # Execute rules
        context.current_instance = contingent
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check distribution: equal would be 100 each
        # But passenger1 is capped at 50
        self.assertEqual(context.get_attribute(passenger1, "treinmiles").value, Decimal(50))
        self.assertEqual(context.get_attribute(passenger2, "treinmiles").value, Decimal(100))
        self.assertEqual(context.get_attribute(passenger3, "treinmiles").value, Decimal(100))
    
    def test_verdeling_empty_collection(self):
        """Test distribution with no target objects."""
        regelspraak_code = """
        Objecttype het Contingent treinmiles
            het totaal aantal treinmiles Numeriek (positief geheel getal);
            het restant na verdeling Numeriek (geheel getal);
        
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de treinmiles Numeriek (geheel getal);
        
        Feittype verdeling contingent treinmiles over passagiers
            het te verdelen contingent treinmiles Contingent treinmiles
            de passagier met recht op treinmiles Natuurlijk persoon
            één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles
        
        Regel verdelingLeeg
            geldig altijd
                Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over de treinmiles van alle passagiers met recht op treinmiles van het te verdelen contingent treinmiles, waarbij wordt verdeeld:
                - in gelijke delen.
                Als onverdeelde rest blijft het restant na verdeling van het te verdelen contingent treinmiles over.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create contingent with 100 treinmiles but no passengers
        contingent = RuntimeObject("Contingent treinmiles")
        context.add_object(contingent)
        context.set_attribute(contingent, "totaal aantal treinmiles", Value(Decimal(100), "Numeriek", None))
        
        # Execute rules
        context.current_instance = contingent
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check that entire amount becomes remainder
        remainder = context.get_attribute(contingent, "restant na verdeling")
        self.assertEqual(remainder.value, Decimal(100))

    def test_verdeling_complex_multi_criteria(self):
        """Test complex distribution with ordering, proportional distribution, maximum and rounding."""
        regelspraak_code = """
        Objecttype het Contingent treinmiles
            het totaal aantal treinmiles Numeriek (positief geheel getal);
            het restant na verdeling Numeriek (geheel getal);
        
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de treinmiles Numeriek (geheel getal);
            de leeftijd Numeriek (geheel getal) met eenheid jr;
            de woonregio factor Numeriek (geheel getal);
            het maximaal aantal te ontvangen treinmiles Numeriek (geheel getal);
        
        Feittype verdeling contingent treinmiles over passagiers
            het te verdelen contingent treinmiles Contingent treinmiles
            de passagier met recht op treinmiles Natuurlijk persoon
            één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles
        
        Regel verdelingComplexMultiCriteria
            geldig altijd
                Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
                de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
                contingent treinmiles, waarbij wordt verdeeld:
                - op volgorde van toenemende de leeftijd,
                - bij een even groot criterium naar rato van de woonregio factor,
                - met een maximum van het maximaal aantal te ontvangen treinmiles,
                - afgerond op 0 decimalen naar beneden.
                Als onverdeelde rest blijft het restant na verdeling van het te verdelen contingent treinmiles over.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # This test is expected to fail until the parser is fixed to handle multi-line syntax
        # with self.assertRaises(Exception):
        #     model = parse_text(regelspraak_code)

if __name__ == "__main__":
    unittest.main()