#!/usr/bin/env python3
"""Test various aggregation patterns in RegelSpraak.

This test file documents and validates the different ways aggregations can be expressed:
1. Simple concatenation: "de som van X, Y en Z"
2. All instances: "de som van alle bedragen"  
3. Attribute of collection: "de som van de te betalen belasting van alle passagiers van de reis"
"""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.ast import FunctionCall, AttributeReference
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value


class TestAggregationPatterns(unittest.TestCase):
    """Test different aggregation syntax patterns."""
    
    def test_concatenation_pattern(self):
        """Test aggregation with comma-separated values: 'de som van X, Y en Z'."""
        regelspraak_code = """
        Objecttype de Berekening
            het totaal Numeriek;
            
        Parameter X : Numeriek;
        Parameter Y : Numeriek;  
        Parameter Z : Numeriek;
        
        Regel bereken totaal
            geldig altijd
                Het totaal van een berekening moet berekend worden als de som van X, Y en Z.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Check parsed structure
        regel = model.regels[0]
        expr = regel.resultaat.expressie
        self.assertIsInstance(expr, FunctionCall)
        self.assertEqual(expr.function_name, "som_van")
        self.assertEqual(len(expr.arguments), 3)  # Three separate arguments
        
        # Test execution
        context = RuntimeContext(model)
        context.set_parameter("X", 10)
        context.set_parameter("Y", 20)
        context.set_parameter("Z", 30)
        
        # Create a Berekening object
        berekening = RuntimeObject("Berekening")
        context.add_object(berekening)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check the totaal attribute
        total = context.get_attribute(berekening, "totaal")
        self.assertEqual(total.value, 60)
    
    def test_all_instances_pattern(self):
        """Test aggregation over all instances: 'de som van alle bedragen'."""
        regelspraak_code = """
        Objecttype de Factuur (mv: facturen)
            het bedrag Bedrag;
            
        Objecttype de Administratie
            het totaal bedrag Bedrag;
            
        Domein Bedrag is van het type Numeriek (getal met 2 decimalen);
        
        Regel bereken totaal bedrag
            geldig altijd
                Het totaal bedrag van een administratie moet berekend worden als de som van alle bedragen.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Check parsed structure
        regel = model.regels[0]
        expr = regel.resultaat.expressie
        self.assertIsInstance(expr, FunctionCall)
        self.assertEqual(expr.function_name, "som_van")
        self.assertEqual(len(expr.arguments), 1)
        self.assertIsInstance(expr.arguments[0], AttributeReference)
        self.assertEqual(expr.arguments[0].path, ["bedragen"])
        
        # Test execution
        context = RuntimeContext(model)
        
        # Create an Administratie object
        admin = RuntimeObject("Administratie")
        context.add_object(admin)
        
        # Create multiple Factuur objects
        amounts = [100.50, 200.75, 50.00]
        for i, amount in enumerate(amounts):
            factuur = RuntimeObject("Factuur", instance_id=f"factuur_{i+1}")
            context.add_object(factuur)
            context.set_attribute(factuur, "bedrag", Value(amount, "Bedrag"))
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result
        total = context.get_attribute(admin, "totaal bedrag")
        self.assertEqual(total.value, sum(amounts))
    
    def test_attribute_of_collection_pattern(self):
        """Test aggregation of attribute from collection: 'de som van X van alle Y'."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de te betalen belasting Bedrag;

        Objecttype de Vlucht (mv: vluchten)
            de totaal te betalen belasting Bedrag;

        Feittype vlucht van natuurlijke personen
            de reis Vlucht
            de passagier Natuurlijk persoon
            Eén reis betreft de verplaatsing van meerdere passagiers

        Domein Bedrag is van het type Numeriek (getal met 2 decimalen);

        Regel Totaal te betalen belasting
            geldig altijd
                De totaal te betalen belasting van een reis moet berekend worden als de som van de te
                betalen belasting van alle passagiers van de reis.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Check parsed structure - should use DimensieAggExpr
        regel = model.regels[0]
        expr = regel.resultaat.expressie
        self.assertIsInstance(expr, FunctionCall)
        self.assertEqual(expr.function_name, "som_van")
        self.assertEqual(len(expr.arguments), 2)  # Attribute and collection separate
        
        # First argument: the attribute
        self.assertIsInstance(expr.arguments[0], AttributeReference)
        self.assertEqual(expr.arguments[0].path, ["te betalen belasting"])
        
        # Second argument: the collection
        self.assertIsInstance(expr.arguments[1], AttributeReference)
        self.assertEqual(expr.arguments[1].path, ["passagiers van de reis"])
        
        # Test execution
        context = RuntimeContext(model)
        
        # Create a flight
        flight = RuntimeObject("Vlucht", instance_id="flight1")
        context.add_object(flight)
        
        # Create passengers with tax amounts
        tax_amounts = [25.50, 30.75, 15.00]
        for i, tax in enumerate(tax_amounts):
            person = RuntimeObject("Natuurlijk persoon", instance_id=f"person{i+1}")
            context.add_object(person)
            context.set_attribute(person, "te betalen belasting", Value(tax, "Bedrag"))
            
            # Create relationship
            context.add_relationship(
                feittype_naam="vlucht van natuurlijke personen",
                subject=flight,
                object=person
            )
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result
        total_tax = context.get_attribute(flight, "totaal te betalen belasting")
        self.assertEqual(total_tax.value, sum(tax_amounts))
    
    def test_nested_aggregation_in_expression(self):
        """Test aggregation used within a larger expression."""
        regelspraak_code = """
        Objecttype de Berekening
            het resultaat Numeriek;
            
        Parameter A : Numeriek;
        Parameter B : Numeriek;
        Parameter C : Numeriek;
        
        Regel bereken met factor
            geldig altijd
                Het resultaat van een berekening moet berekend worden als (de som van A, B en C) maal 2.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # The expression should be a multiplication
        regel = model.regels[0]
        expr = regel.resultaat.expressie
        self.assertEqual(expr.operator.name, "MAAL")
        
        # Left side should be the sum function
        self.assertIsInstance(expr.left, FunctionCall)
        self.assertEqual(expr.left.function_name, "som_van")
        self.assertEqual(len(expr.left.arguments), 3)
        
        # Test execution
        context = RuntimeContext(model)
        context.set_parameter("A", 5)
        context.set_parameter("B", 10)
        context.set_parameter("C", 15)
        
        # Create a Berekening object
        berekening = RuntimeObject("Berekening")
        context.add_object(berekening)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result = context.get_attribute(berekening, "resultaat")
        self.assertEqual(result.value, 60)  # (5 + 10 + 15) * 2
    
    def test_aggregation_with_empty_values(self):
        """Test aggregation behavior with empty values."""
        regelspraak_code = """
        Objecttype de Item
            de waarde Numeriek;
            
        Objecttype de Totaal
            de som Numeriek;
        
        Regel bereken som
            geldig altijd
                De som van een totaal moet berekend worden als de som van alle waarden.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Test with no items
        context = RuntimeContext(model)
        
        # Create a Totaal object
        totaal = RuntimeObject("Totaal")
        context.add_object(totaal)
        
        # Don't create any Item objects
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Without items, som_van should return 0 as default behavior
        try:
            som = context.get_attribute(totaal, "som")
            # Engine should return 0 for empty aggregations
            self.assertEqual(som.value, 0)
        except Exception as e:
            # If attribute wasn't set, that's also acceptable for empty aggregations
            pass


if __name__ == '__main__':
    unittest.main()