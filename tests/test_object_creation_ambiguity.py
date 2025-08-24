"""Unit tests for ObjectCreatie grammar ambiguity fix."""
import unittest
from src.regelspraak.parsing import parse_text
from src.regelspraak.ast import ObjectCreatie, AttributeReference, Literal
from src.regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from src.regelspraak.engine import Evaluator


class TestObjectCreationAmbiguity(unittest.TestCase):
    """Test cases for ObjectCreatie attribute initialization ambiguity resolution."""
    
    def test_attribute_name_vs_expression_ambiguity(self):
        """Test that 'met de naam de naam' correctly parses attribute='naam', value=AttributeReference."""
        model_text = """
        Objecttype de Persoon
            de naam Tekst;
            de voornaam Tekst;
        
        Regel TestAmbiguity
        geldig altijd
            Er wordt een nieuw Persoon aangemaakt
            met de naam de naam.
        """
        
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        regel = model.regels[0]
        self.assertIsInstance(regel.resultaat, ObjectCreatie)
        
        # Check attribute initialization
        attrs = regel.resultaat.attribute_inits
        self.assertEqual(len(attrs), 1)
        
        attr_name, expr = attrs[0]
        self.assertEqual(attr_name, "naam")  # Should be "naam", not "de naam"
        self.assertIsInstance(expr, AttributeReference)
        self.assertEqual(expr.path, ["naam"])  # The expression is "de naam"
    
    def test_multi_word_attribute_names(self):
        """Test that multi-word attribute names like 'standaard prijs' are correctly parsed."""
        model_text = """
        Objecttype de Product
            de naam Tekst;
            de standaard prijs Numeriek;
            de korting percentage Numeriek;
        
        Regel MaakProduct
        geldig altijd
            Er wordt een nieuw Product aangemaakt
            met naam "Test Product"
            en standaard prijs 100
            en korting percentage 10.
        """
        
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        regel = model.regels[0]
        attrs = regel.resultaat.attribute_inits
        self.assertEqual(len(attrs), 3)
        
        # Check each attribute
        self.assertEqual(attrs[0][0], "naam")
        self.assertIsInstance(attrs[0][1], Literal)
        
        self.assertEqual(attrs[1][0], "standaard prijs")
        self.assertIsInstance(attrs[1][1], Literal)
        self.assertEqual(attrs[1][1].value, 100)
        
        self.assertEqual(attrs[2][0], "korting percentage")
        self.assertIsInstance(attrs[2][1], Literal)
        self.assertEqual(attrs[2][1].value, 10)
    
    def test_attribute_with_expression_value(self):
        """Test attribute initialization with complex expressions."""
        model_text = """
        Objecttype de Werknemer
            de naam Tekst;
            de salaris Numeriek;
            de manager Tekst;
        
        Objecttype de Manager
            de naam Tekst;
        
        Regel MaakWerknemer
        geldig altijd
            Er wordt een nieuw Werknemer aangemaakt
            met naam "Jan"
            en salaris 3000
            en manager de naam van de Manager.
        """
        
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        regel = model.regels[0]
        attrs = regel.resultaat.attribute_inits
        self.assertEqual(len(attrs), 3)
        
        # Check manager attribute with complex expression
        self.assertEqual(attrs[2][0], "manager")
        self.assertIsInstance(attrs[2][1], AttributeReference)
        # Path follows spec: object-first navigation "de naam van de Manager" -> ["Manager", "naam"]
        self.assertEqual(attrs[2][1].path, ["Manager", "naam"])
    
    def test_parsing_preserves_attribute_structure(self):
        """Test that parsing correctly identifies attribute names vs expressions in edge cases."""
        # Test case 1: "de X" as attribute name followed by "de Y" as expression
        model_text = """
        Objecttype de Test
            de naam Tekst;
            de waarde Tekst;
        
        Regel TestCase1
        geldig altijd
            Er wordt een nieuw Test aangemaakt
            met de naam de waarde.
        """
        
        model = parse_text(model_text)
        regel = model.regels[0]
        attrs = regel.resultaat.attribute_inits
        
        # Should parse as: attribute="naam", value=AttributeReference(["waarde"])
        self.assertEqual(len(attrs), 1)
        self.assertEqual(attrs[0][0], "naam")
        self.assertIsInstance(attrs[0][1], AttributeReference)
        self.assertEqual(attrs[0][1].path, ["waarde"])
        
        # Test case 2: Complex multi-word attribute followed by expression
        model_text2 = """
        Objecttype de Product
            de standaard catalogus prijs Numeriek;
            de actuele prijs Numeriek;
        
        Regel TestCase2
        geldig altijd
            Er wordt een nieuw Product aangemaakt
            met standaard catalogus prijs de actuele prijs.
        """
        
        model2 = parse_text(model_text2)
        regel2 = model2.regels[0]
        attrs2 = regel2.resultaat.attribute_inits
        
        # Should parse as: attribute="standaard catalogus prijs", value=AttributeReference
        self.assertEqual(len(attrs2), 1)
        self.assertEqual(attrs2[0][0], "standaard catalogus prijs")
        self.assertIsInstance(attrs2[0][1], AttributeReference)
        # The path might be parsed as one element or multiple, depending on grammar
        # Just check it's an AttributeReference with the correct content
        path_str = " ".join(attrs2[0][1].path)
        self.assertEqual(path_str, "actuele prijs")
    
    def test_no_ambiguity_with_simple_attributes(self):
        """Test that simple attribute names without articles work as before."""
        model_text = """
        Objecttype de Klant
            de naam Tekst;
            de email Tekst;
            de leeftijd Numeriek;
        
        Regel MaakKlant
        geldig altijd
            Er wordt een nieuw Klant aangemaakt
            met naam "Test"
            en email "test@example.com"
            en leeftijd 25.
        """
        
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        regel = model.regels[0]
        attrs = regel.resultaat.attribute_inits
        
        # All should be parsed as simple attribute names
        self.assertEqual(attrs[0][0], "naam")
        self.assertEqual(attrs[1][0], "email")
        self.assertEqual(attrs[2][0], "leeftijd")
        
        # All values should be literals
        for _, expr in attrs:
            self.assertIsInstance(expr, Literal)


if __name__ == '__main__':
    unittest.main()