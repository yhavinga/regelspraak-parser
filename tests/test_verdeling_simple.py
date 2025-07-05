#!/usr/bin/env python3
"""Simple test for Verdeling to debug issues."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from decimal import Decimal

class TestVerdelingSimple(unittest.TestCase):
    
    def test_simple_verdeling(self):
        """Test simplest possible Verdeling."""
        regelspraak_code = """
        Objecttype het Contingent treinmiles
            het totaal aantal treinmiles Numeriek (positief geheel getal);
        
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de treinmiles Numeriek (geheel getal);
        
        Feittype verdeling contingent treinmiles over passagiers
            het te verdelen contingent treinmiles Contingent treinmiles
            de passagier met recht op treinmiles Natuurlijk persoon
            één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles
        
        Regel simpeleVerdeling
            geldig altijd
                Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
                de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
                contingent treinmiles, waarbij wordt verdeeld in gelijke delen.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Print the parsed rule for debugging
        for regel in model.regels:
            print(f"Rule: {regel.naam}")
            print(f"Result type: {type(regel.resultaat)}")
            if hasattr(regel.resultaat, 'source_amount'):
                print(f"Source amount: {regel.resultaat.source_amount}")
                if hasattr(regel.resultaat.source_amount, 'path'):
                    print(f"Source path: {regel.resultaat.source_amount.path}")
            if hasattr(regel.resultaat, 'target_collection'):
                print(f"Target collection: {regel.resultaat.target_collection}")
                if hasattr(regel.resultaat.target_collection, 'path'):
                    print(f"Target path: {regel.resultaat.target_collection.path}")
        
        # Setup context and execute
        context = RuntimeContext(model)
        
        # Create contingent
        contingent = RuntimeObject("Contingent treinmiles")
        context.add_object(contingent)
        context.set_attribute(contingent, "totaal aantal treinmiles", Value(Decimal(300), "Numeriek", None))
        
        # Create passengers
        passengers = []
        for i in range(3):
            passenger = RuntimeObject("Natuurlijk persoon")
            context.add_object(passenger)
            passengers.append(passenger)
            
            # Create relationship using the feittype
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
        
        # Check results
        for i, passenger in enumerate(passengers):
            miles = context.get_attribute(passenger, "treinmiles")
            print(f"Passenger {i+1} got {miles.value} treinmiles")
            self.assertEqual(miles.value, Decimal(100))

if __name__ == "__main__":
    unittest.main()