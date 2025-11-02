"""Test dimension support based on RegelSpraak v2.1.0 specification examples."""
import unittest
from decimal import Decimal

from regelspraak.parsing import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, DimensionCoordinate
from regelspraak.engine import Evaluator
from regelspraak.ast import DimensionedAttributeReference, DimensionLabel


class TestDimensionSpecExamples(unittest.TestCase):
    """Test cases from the RegelSpraak specification."""
    
    def test_jaardimensie_prepositional(self):
        """Test jaardimensie with prepositional style from spec example."""
        input_text = """
        Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
            1. vorig jaar
            2. huidig jaar
            3. volgend jaar
        
        Objecttype de Natuurlijk persoon
            het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie;
        
        Regel bereken inkomen huidig jaar
            geldig altijd
                Het inkomen van huidig jaar van een Natuurlijk persoon moet berekend worden als 50000.
        
        Regel bereken inkomen vorig jaar
            geldig altijd
                Het inkomen van vorig jaar van een Natuurlijk persoon moet berekend worden als 45000.
        """
        
        model = parse_text(input_text)
        self.assertIsNotNone(model)
        
        # Verify jaardimensie was parsed correctly
        self.assertIn("jaardimensie", model.dimensions)
        jaar_dim = model.dimensions["jaardimensie"]
        self.assertEqual(jaar_dim.usage_style, "prepositional")
        self.assertEqual(jaar_dim.preposition, "van")
        
        # Check rule targets are dimensioned
        for regel in model.regels:
            target = regel.resultaat.target
            self.assertIsInstance(target, DimensionedAttributeReference)
            # Object type specification - path includes object type and attribute
            self.assertEqual(target.base_attribute.path, ['Natuurlijk persoon', 'inkomen'])
            
            # Check dimension labels based on rule name
            if "huidig jaar" in regel.naam:
                self.assertEqual(target.dimension_labels[0].label, "huidig jaar")
            elif "vorig jaar" in regel.naam:
                self.assertEqual(target.dimension_labels[0].label, "vorig jaar")
        
        # Execute rules
        context = RuntimeContext(domain_model=model)
        person = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="person1")
        context.add_object(person)
        
        evaluator = Evaluator(context)
        result = evaluator.execute_model(model)
        
        # Verify values were set
        huidig_coord = DimensionCoordinate(labels={"jaardimensie": "huidig jaar"})
        vorig_coord = DimensionCoordinate(labels={"jaardimensie": "vorig jaar"})
        
        huidig_value = context.get_dimensioned_attribute(person, "inkomen", huidig_coord)
        self.assertEqual(huidig_value.value, 50000)
        
        vorig_value = context.get_dimensioned_attribute(person, "inkomen", vorig_coord)
        self.assertEqual(vorig_value.value, 45000)
    
    def test_brutonettodimensie_adjectival(self):
        """Test brutonettodimensie with adjectival style from spec example."""
        input_text = """
        Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
            1. bruto
            2. netto
        
        Objecttype de Natuurlijk persoon
            het inkomen Numeriek (geheel getal) gedimensioneerd met brutonettodimensie;
        
        Regel bereken bruto inkomen
            geldig altijd
                Het bruto inkomen van een Natuurlijk persoon moet berekend worden als 60000.
        
        Regel bereken netto inkomen
            geldig altijd
                Het netto inkomen van een Natuurlijk persoon moet berekend worden als 42000.
        """
        
        model = parse_text(input_text)
        self.assertIsNotNone(model)
        
        # Verify brutonettodimensie was parsed correctly
        self.assertIn("brutonettodimensie", model.dimensions)
        bruto_dim = model.dimensions["brutonettodimensie"]
        self.assertEqual(bruto_dim.usage_style, "adjectival")
        self.assertIsNone(bruto_dim.preposition)
        
        # Check rule targets are dimensioned
        for regel in model.regels:
            target = regel.resultaat.target
            self.assertIsInstance(target, DimensionedAttributeReference)
            # Object type specification - path includes object type and attribute
            self.assertEqual(target.base_attribute.path, ['Natuurlijk persoon', 'inkomen'])
            
            # Check dimension labels based on rule name
            if "bruto" in regel.naam:
                self.assertEqual(target.dimension_labels[0].label, "bruto")
            elif "netto" in regel.naam:
                self.assertEqual(target.dimension_labels[0].label, "netto")
        
        # Execute rules
        context = RuntimeContext(domain_model=model)
        person = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="person1")
        context.add_object(person)
        
        evaluator = Evaluator(context)
        result = evaluator.execute_model(model)
        
        # Verify values were set
        bruto_coord = DimensionCoordinate(labels={"brutonettodimensie": "bruto"})
        netto_coord = DimensionCoordinate(labels={"brutonettodimensie": "netto"})
        
        bruto_value = context.get_dimensioned_attribute(person, "inkomen", bruto_coord)
        self.assertEqual(bruto_value.value, 60000)
        
        netto_value = context.get_dimensioned_attribute(person, "inkomen", netto_coord)
        self.assertEqual(netto_value.value, 42000)
    
    def test_multi_dimensional_attribute(self):
        """Test attribute with multiple dimensions from spec example."""
        input_text = """
        Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
            1. vorig jaar
            2. huidig jaar
        
        Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
            1. bruto
            2. netto
        
        Objecttype de Natuurlijk persoon
            het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie en brutonettodimensie;
        
        Regel bereken bruto inkomen huidig jaar
            geldig altijd
                Het bruto inkomen van huidig jaar van een Natuurlijk persoon moet berekend worden als 60000.
        
        Regel bereken netto inkomen huidig jaar
            geldig altijd
                Het netto inkomen van huidig jaar van een Natuurlijk persoon moet berekend worden als 
                het bruto inkomen van huidig jaar van de Natuurlijk persoon maal 0,7.
        """
        
        model = parse_text(input_text)
        self.assertIsNotNone(model)
        
        # Check that inkomen has both dimensions
        persoon_type = model.objecttypes["Natuurlijk persoon"]
        inkomen_attr = persoon_type.attributen["inkomen"]
        self.assertEqual(set(inkomen_attr.dimensions), {"jaardimensie", "brutonettodimensie"})
        
        # Execute rules
        context = RuntimeContext(domain_model=model)
        person = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="person1")
        context.add_object(person)
        
        evaluator = Evaluator(context)
        result = evaluator.execute_model(model)
        
        # Verify multi-dimensional values
        bruto_huidig_coord = DimensionCoordinate(labels={
            "jaardimensie": "huidig jaar",
            "brutonettodimensie": "bruto"
        })
        netto_huidig_coord = DimensionCoordinate(labels={
            "jaardimensie": "huidig jaar",
            "brutonettodimensie": "netto"
        })
        
        bruto_value = context.get_dimensioned_attribute(person, "inkomen", bruto_huidig_coord)
        self.assertEqual(bruto_value.value, 60000)
        
        netto_value = context.get_dimensioned_attribute(person, "inkomen", netto_huidig_coord)
        self.assertEqual(netto_value.value, Decimal('42000'))  # 60000 * 0.7
    
    def test_dimension_in_expression(self):
        """Test using dimensioned attributes in expressions."""
        input_text = """
        Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
            1. vorig jaar
            2. huidig jaar
        
        Objecttype de Natuurlijk persoon
            het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie;
            de inkomen_groei Numeriek (geheel getal);
        
        Regel bereken inkomen groei
            geldig altijd
                De inkomen_groei van een Natuurlijk persoon moet berekend worden als het inkomen van huidig jaar van de Natuurlijk persoon min het inkomen van vorig jaar van de Natuurlijk persoon.
        """
        
        model = parse_text(input_text)
        
        # Set up test data
        context = RuntimeContext(domain_model=model)
        person = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="person1")
        context.add_object(person)
        
        # Set dimensional values
        vorig_coord = DimensionCoordinate(labels={"jaardimensie": "vorig jaar"})
        huidig_coord = DimensionCoordinate(labels={"jaardimensie": "huidig jaar"})
        
        context.set_dimensioned_attribute(
            person, "inkomen", vorig_coord,
            Value(value=45000, datatype="Numeriek", unit=None)
        )
        context.set_dimensioned_attribute(
            person, "inkomen", huidig_coord,
            Value(value=50000, datatype="Numeriek", unit=None)
        )
        
        # Execute rule
        evaluator = Evaluator(context)
        result = evaluator.execute_model(model)
        
        # Check result
        groei_value = context.get_attribute(person, "inkomen_groei")
        self.assertEqual(groei_value.value, 5000)  # 50000 - 45000


if __name__ == '__main__':
    unittest.main()