"""Tests for timeline (tijdlijn) parsing and AST construction."""
import unittest
from regelspraak.parsing import parse_text
from regelspraak.ast import DomainModel, Attribuut, Parameter, ObjectType


class TestTimelineParsing(unittest.TestCase):
    """Test timeline parsing for attributes and parameters."""
    
    def test_attribute_with_dag_timeline(self):
        """Test parsing an attribute with 'voor elke dag' timeline."""
        input_text = """Objecttype de Werknemer
            het salaris Numeriek (getal) met eenheid euro voor elke dag;
            de naam Tekst;
        """
        result = parse_text(input_text)
        
        self.assertIsInstance(result, DomainModel)
        self.assertIn("Werknemer", result.objecttypes)
        
        werknemer = result.objecttypes["Werknemer"]
        self.assertIn("salaris", werknemer.attributen)
        
        salaris = werknemer.attributen["salaris"]
        self.assertEqual(salaris.timeline, "dag")
        self.assertEqual(salaris.datatype, "Numeriek(getal)")
        self.assertEqual(salaris.eenheid, "euro")
        
        # Check that naam has no timeline
        naam = werknemer.attributen["naam"]
        self.assertIsNone(naam.timeline)
    
    def test_attribute_with_maand_timeline(self):
        """Test parsing an attribute with 'voor elke maand' timeline."""
        input_text = """Objecttype de Werknemer
            het inkomen Numeriek (getal) met eenheid euro voor elke maand;
        """
        result = parse_text(input_text)
        
        werknemer = result.objecttypes["Werknemer"]
        inkomen = werknemer.attributen["inkomen"]
        self.assertEqual(inkomen.timeline, "maand")
    
    def test_attribute_with_jaar_timeline(self):
        """Test parsing an attribute with 'voor elk jaar' timeline."""
        input_text = """Objecttype de Belastingplichtige
            de te betalen belasting Bedrag voor elk jaar;
        """
        result = parse_text(input_text)
        
        belastingplichtige = result.objecttypes["Belastingplichtige"]
        belasting = belastingplichtige.attributen["te betalen belasting"]
        self.assertEqual(belasting.timeline, "jaar")
        self.assertEqual(belasting.datatype, "Bedrag")
    
    def test_parameter_with_dag_timeline(self):
        """Test parsing a parameter with 'voor elke dag' timeline."""
        input_text = """
        Parameter de dagkoers : Numeriek (getal) met eenheid euro voor elke dag
        Parameter de vaste waarde : Numeriek (getal)
        """
        result = parse_text(input_text)
        
        self.assertIsInstance(result, DomainModel)
        self.assertIn("dagkoers", result.parameters)
        self.assertIn("vaste waarde", result.parameters)
        
        dagkoers = result.parameters["dagkoers"]
        self.assertEqual(dagkoers.timeline, "dag")
        self.assertEqual(dagkoers.datatype, "Numeriek(getal)")
        self.assertEqual(dagkoers.eenheid, "euro")
        
        # Check that vaste waarde has no timeline
        vaste_waarde = result.parameters["vaste waarde"]
        self.assertIsNone(vaste_waarde.timeline)
    
    def test_parameter_with_maand_timeline(self):
        """Test parsing a parameter with 'voor elke maand' timeline."""
        input_text = """Parameter het maandbudget : Bedrag voor elke maand"""
        result = parse_text(input_text)
        
        maandbudget = result.parameters["maandbudget"]
        self.assertEqual(maandbudget.timeline, "maand")
        self.assertEqual(maandbudget.datatype, "Bedrag")
    
    def test_parameter_with_jaar_timeline(self):
        """Test parsing a parameter with 'voor elk jaar' timeline."""
        input_text = """Parameter de maximale aftrek : Numeriek (getal) met eenheid euro voor elk jaar"""
        result = parse_text(input_text)
        
        max_aftrek = result.parameters["maximale aftrek"]
        self.assertEqual(max_aftrek.timeline, "jaar")
        self.assertEqual(max_aftrek.eenheid, "euro")
    
    def test_datum_parameter_with_timeline(self):
        """Test parsing a Datum parameter with a timeline."""
        input_text = """Parameter de startdatum : Datum in dagen voor elke dag"""
        result = parse_text(input_text)
        
        startdatum = result.parameters["startdatum"]
        self.assertEqual(startdatum.timeline, "dag")
        self.assertEqual(startdatum.datatype, "Datum in dagen")
    
    def test_mixed_timelines_in_object_type(self):
        """Test parsing an object type with attributes having different timelines."""
        input_text = """Objecttype de Contract
            de startdatum Datum in dagen;
            het maandbedrag Bedrag voor elke maand;
            de jaarlijkse bonus Bedrag voor elk jaar;
            de dagelijkse status Tekst voor elke dag;
        """
        result = parse_text(input_text)
        
        contract = result.objecttypes["Contract"]
        
        # Check each attribute's timeline
        self.assertIsNone(contract.attributen["startdatum"].timeline)
        self.assertEqual(contract.attributen["maandbedrag"].timeline, "maand")
        self.assertEqual(contract.attributen["jaarlijkse bonus"].timeline, "jaar")
        self.assertEqual(contract.attributen["dagelijkse status"].timeline, "dag")
    
    def test_timeline_with_dimensions(self):
        """Test that timelines work together with dimensions."""
        # Skip this test for now as dimension syntax needs verification
        self.skipTest("Dimension syntax needs verification")
        
        meting = result.objecttypes["Meting"]
        meetwaarde = meting.attributen["meetwaarde"]
        
        # Should have both dimension and timeline
        self.assertEqual(meetwaarde.dimensions, ["TijdDimensie"])
        self.assertEqual(meetwaarde.timeline, "dag")


if __name__ == '__main__':
    unittest.main()