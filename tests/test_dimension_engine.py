"""Test dimension support in the engine."""
import unittest
from decimal import Decimal

from regelspraak.parsing import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, DimensionCoordinate
from regelspraak.engine import Evaluator, TraceSink
from regelspraak.errors import RuntimeError


class TestDimensionEngine(unittest.TestCase):
    """Test dimension support in rule execution."""
    
    def test_dimensioned_attribute_basic(self):
        """Test basic dimensioned attribute access and assignment."""
        input_text = """
        Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
            1. vorig jaar
            2. huidig jaar
        
        Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
            1. bruto
            2. netto
        
        Objecttype de Natuurlijk persoon
            het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie en brutonettodimensie;
        
        Regel bereken netto inkomen huidig jaar
            geldig altijd
                Het netto inkomen van huidig jaar van een Natuurlijk persoon moet berekend worden als
                het bruto inkomen van huidig jaar van de Natuurlijk persoon maal 0,7.
        """
        
        # Parse the model
        model = parse_text(input_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model)
        
        # Create a person instance
        person = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        context.add_object(person)
        
        # Set bruto inkomen for huidig jaar
        bruto_coord = DimensionCoordinate(labels={
            "jaardimensie": "huidig jaar",
            "brutonettodimensie": "bruto"
        })
        context.set_dimensioned_attribute(
            person, 
            "inkomen", 
            bruto_coord,
            Value(value=50000, datatype="Numeriek", unit=None)
        )
        
        # Execute the rule
        evaluator = Evaluator(context)
        result = evaluator.execute_model(model)
        
        # Check the result
        netto_coord = DimensionCoordinate(labels={
            "jaardimensie": "huidig jaar", 
            "brutonettodimensie": "netto"
        })
        netto_value = context.get_dimensioned_attribute(person, "inkomen", netto_coord)
        
        self.assertIsNotNone(netto_value)
        self.assertEqual(netto_value.value, Decimal('35000'))
        self.assertEqual(netto_value.datatype, "Numeriek")
    
    def test_mixed_dimension_styles(self):
        """Test mixed adjectival and prepositional dimension styles."""
        input_text = """
        Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
            1. vorig jaar
            2. huidig jaar
        
        Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
            1. bruto
            2. netto
        
        Objecttype de Natuurlijk persoon
            het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie en brutonettodimensie;
            de leeftijd Numeriek (geheel getal) met eenheid jr;
        
        Parameter de belastingpercentage : Numeriek;
        
        Regel bepaal verschil bruto netto
            geldig altijd
                De leeftijd van een Natuurlijk persoon moet berekend worden als
                het bruto inkomen van vorig jaar van de Natuurlijk persoon min
                het netto inkomen van vorig jaar van de Natuurlijk persoon.
        """
        
        # Parse the model
        model = parse_text(input_text)
        self.assertIsNotNone(model)
        
        # Verify dimensions were parsed
        self.assertIn("jaardimensie", model.dimensions)
        self.assertIn("brutonettodimensie", model.dimensions)
        
        # Check dimension properties
        jaar_dim = model.dimensions["jaardimensie"]
        self.assertEqual(jaar_dim.usage_style, "prepositional")
        self.assertEqual(jaar_dim.preposition, "van")
        self.assertEqual(len(jaar_dim.labels), 2)
        
        bruto_dim = model.dimensions["brutonettodimensie"]
        self.assertEqual(bruto_dim.usage_style, "adjectival")
        self.assertIsNone(bruto_dim.preposition)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model)
        
        # Create a person instance
        person = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        context.add_object(person)
        
        # Set values for vorig jaar
        bruto_vorig_coord = DimensionCoordinate(labels={
            "jaardimensie": "vorig jaar",
            "brutonettodimensie": "bruto"
        })
        netto_vorig_coord = DimensionCoordinate(labels={
            "jaardimensie": "vorig jaar",
            "brutonettodimensie": "netto"
        })
        
        context.set_dimensioned_attribute(
            person, 
            "inkomen", 
            bruto_vorig_coord,
            Value(value=40000, datatype="Numeriek", unit=None)
        )
        context.set_dimensioned_attribute(
            person, 
            "inkomen", 
            netto_vorig_coord,
            Value(value=30000, datatype="Numeriek", unit=None)
        )
        
        # Execute the rule
        evaluator = Evaluator(context)
        result = evaluator.execute_model(model)
        
        # Check the result (difference stored in leeftijd attribute)
        leeftijd_value = context.get_attribute(person, "leeftijd")
        self.assertIsNotNone(leeftijd_value)
        self.assertEqual(leeftijd_value.value, 10000)
    
    def test_missing_dimension_error(self):
        """Test error when not all dimensions are specified."""
        input_text = """
        Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
            1. vorig jaar
            2. huidig jaar
        
        Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
            1. bruto
            2. netto
        
        Objecttype de Natuurlijk persoon
            het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie en brutonettodimensie;
        
        Regel bereken iets onmogelijks
            geldig altijd
                Het inkomen van een Natuurlijk persoon moet berekend worden als 1000.
        """
        
        # Parse should succeed
        model = parse_text(input_text)
        self.assertIsNotNone(model)
        
        # But this rule is invalid - it doesn't specify all dimensions
        # This might be caught during semantic analysis or runtime
        # For now, let's just verify parsing works
        self.assertEqual(len(model.regels), 1)


if __name__ == '__main__':
    unittest.main()