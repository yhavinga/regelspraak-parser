"""Test simple dimension support."""
import unittest
from decimal import Decimal

from regelspraak.parsing import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, DimensionCoordinate
from regelspraak.engine import Evaluator
from regelspraak.ast import Dimension


class TestDimensionSimple(unittest.TestCase):
    """Test basic dimension parsing and model structure."""
    
    def test_dimension_parsing(self):
        """Test that dimensions are parsed correctly."""
        input_text = """
        Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
            1. vorig jaar
            2. huidig jaar
            3. volgend jaar
        
        Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
            1. bruto
            2. netto
        
        Objecttype de Natuurlijk persoon
            het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie en brutonettodimensie;
            de naam Tekst;
        """
        
        # Parse the model
        model = parse_text(input_text)
        self.assertIsNotNone(model)
        
        # Check dimensions were parsed
        self.assertIn("jaardimensie", model.dimensions)
        self.assertIn("brutonettodimensie", model.dimensions)
        
        # Check jaardimensie properties
        jaar_dim = model.dimensions["jaardimensie"]
        self.assertIsInstance(jaar_dim, Dimension)
        self.assertEqual(jaar_dim.naam, "jaardimensie")
        self.assertEqual(jaar_dim.meervoud, "jaardimensies")
        self.assertEqual(jaar_dim.usage_style, "prepositional")
        self.assertEqual(jaar_dim.preposition, "van")
        self.assertEqual(len(jaar_dim.labels), 3)
        self.assertEqual(jaar_dim.labels[0], (1, "vorig jaar"))
        self.assertEqual(jaar_dim.labels[1], (2, "huidig jaar"))
        self.assertEqual(jaar_dim.labels[2], (3, "volgend jaar"))
        
        # Check brutonettodimensie properties
        bruto_dim = model.dimensions["brutonettodimensie"]
        self.assertIsInstance(bruto_dim, Dimension)
        self.assertEqual(bruto_dim.naam, "brutonettodimensie")
        self.assertEqual(bruto_dim.meervoud, "brutonettodimensies")
        self.assertEqual(bruto_dim.usage_style, "adjectival")
        self.assertIsNone(bruto_dim.preposition)
        self.assertEqual(len(bruto_dim.labels), 2)
        self.assertEqual(bruto_dim.labels[0], (1, "bruto"))
        self.assertEqual(bruto_dim.labels[1], (2, "netto"))
        
        # Check that inkomen attribute has dimensions
        persoon_type = model.objecttypes["Natuurlijk persoon"]
        self.assertIn("inkomen", persoon_type.attributen)
        inkomen_attr = persoon_type.attributen["inkomen"]
        self.assertEqual(inkomen_attr.dimensions, ["jaardimensie", "brutonettodimensie"])
    
    def test_runtime_dimension_storage(self):
        """Test that runtime can store and retrieve dimensioned values."""
        input_text = """
        Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
            1. vorig jaar
            2. huidig jaar
        
        Objecttype de Natuurlijk persoon
            het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie;
        """
        
        model = parse_text(input_text)
        context = RuntimeContext(domain_model=model)
        
        # Create a person
        person = RuntimeObject(
            object_type_naam="Natuurlijk persoon",
            instance_id="person1"
        )
        context.add_object(person)
        
        # Set dimensioned values
        vorig_coord = DimensionCoordinate(labels={"jaardimensie": "vorig jaar"})
        huidig_coord = DimensionCoordinate(labels={"jaardimensie": "huidig jaar"})
        
        context.set_dimensioned_attribute(
            person, "inkomen", vorig_coord,
            Value(value=40000, datatype="Numeriek", unit=None)
        )
        context.set_dimensioned_attribute(
            person, "inkomen", huidig_coord,
            Value(value=45000, datatype="Numeriek", unit=None)
        )
        
        # Retrieve values
        vorig_value = context.get_dimensioned_attribute(person, "inkomen", vorig_coord)
        self.assertEqual(vorig_value.value, 40000)
        
        huidig_value = context.get_dimensioned_attribute(person, "inkomen", huidig_coord)
        self.assertEqual(huidig_value.value, 45000)
    
    def test_adjectival_dimension_recognition(self):
        """Test that adjectival dimensions are recognized in expressions."""
        input_text = """
        Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
            1. bruto
            2. netto
        
        Objecttype de Natuurlijk persoon
            het inkomen Numeriek (geheel getal) gedimensioneerd met brutonettodimensie;
        
        Regel test bruto
            geldig altijd
                Het bruto inkomen van een Natuurlijk persoon moet berekend worden als 50000.
        """
        
        model = parse_text(input_text)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.regels), 1)
        
        # Check that the rule target is recognized as dimensioned
        regel = model.regels[0]
        target = regel.resultaat.target
        self.assertEqual(type(target).__name__, "DimensionedAttributeReference")
        
        # Check that "bruto" was recognized as a dimension label
        if hasattr(target, 'dimension_labels'):
            labels = [l.label for l in target.dimension_labels]
            self.assertIn("bruto", labels)


if __name__ == '__main__':
    unittest.main()