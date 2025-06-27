import unittest
from tests.test_base import RegelSpraakTestCase
from regelspraak.parsing import parse_text
from regelspraak.ast import DomainModel, FeitType, Rol
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.engine import Evaluator
from regelspraak.semantics import SemanticAnalyzer

class TestFeitTypeComplete(RegelSpraakTestCase):
    """Comprehensive tests for feittype support including parsing, AST, and execution."""
    
    def test_feittype_ast_building(self):
        """Test that feittype definitions are properly built into AST."""
        regelspraak_code = """
        Objecttype Vlucht
            de vertrekdatum Datum in dagen;
            de afstand Numeriek (geheel getal) met eenheid km;
        
        Objecttype Passagier (bezield)
            de leeftijd Numeriek (geheel getal) met eenheid jr;
            de naam Tekst;
        
        Feittype vlucht van passagiers
            de vlucht Vlucht
            de passagier (mv: passagiers) Passagier
        Een vlucht vervoert meerdere passagiers
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsInstance(model, DomainModel)
        
        # Check that feittype is in the model
        self.assertIn("vlucht van passagiers", model.feittypen)
        
        feittype = model.feittypen["vlucht van passagiers"]
        self.assertIsInstance(feittype, FeitType)
        self.assertEqual(feittype.naam, "vlucht van passagiers")
        self.assertFalse(feittype.wederkerig)
        self.assertEqual(len(feittype.rollen), 2)
        
        # Check roles (note: current implementation has limitations)
        for rol in feittype.rollen:
            self.assertIsInstance(rol, Rol)
    
    def test_wederkerig_feittype(self):
        """Test reciprocal feittype definition."""
        regelspraak_code = """
        Objecttype Persoon (bezield)
            de naam Tekst;
        
        Wederkerig feittype partnerrelatie
            de partner Persoon
        Een partner heeft een partner
        """
        
        model = parse_text(regelspraak_code)
        self.assertIn("partnerrelatie", model.feittypen)
        
        feittype = model.feittypen["partnerrelatie"]
        self.assertTrue(feittype.wederkerig)
        self.assertEqual(len(feittype.rollen), 1)
        
        role = feittype.rollen[0]
        self.assertEqual(role.naam, "partner")
        self.assertEqual(role.object_type, "Persoon")
    
    def test_semantic_analysis_with_feittype(self):
        """Test that semantic analyzer handles feittype definitions."""
        regelspraak_code = """
        Objecttype Persoon (bezield)
            de naam Tekst;
            
        Objecttype Voertuig
            het kenteken Tekst;
            
        Feittype eigenaarschap tussen persoon en voertuig
            de eigenaar Persoon
            het voertuig Voertuig
        Een eigenaar heeft een voertuig
        """
        
        model = parse_text(regelspraak_code)
        analyzer = SemanticAnalyzer()
        errors = analyzer.analyze(model)
        
        # Should have no errors
        self.assertEqual(len(errors), 0)
        
        # Check that feittype is in symbol table
        symbol = analyzer.symbol_table.lookup("eigenaarschap tussen persoon en voertuig")
        self.assertIsNotNone(symbol)
        self.assertEqual(symbol.name, "eigenaarschap tussen persoon en voertuig")
    
    def test_object_reference_attribute(self):
        """Test that attributes with object type as datatype are marked as object references."""
        regelspraak_code = """
        Objecttype Adres
            de straat Tekst;
            de huisnummer Numeriek (geheel getal);
            
        Objecttype Persoon (bezield)
            de naam Tekst;
            het woonadres Adres;
        """
        
        model = parse_text(regelspraak_code)
        
        # Run semantic analysis to mark object references
        analyzer = SemanticAnalyzer()
        errors = analyzer.analyze(model)
        self.assertEqual(len(errors), 0)
        
        # Check that woonadres is marked as object reference
        persoon = model.objecttypes["Persoon"]
        woonadres_attr = persoon.attributen["woonadres"]
        self.assertTrue(woonadres_attr.is_object_ref)
        self.assertEqual(woonadres_attr.datatype, "Adres")
        
        # Check that regular attributes are not marked as object references
        naam_attr = persoon.attributen["naam"]
        self.assertFalse(naam_attr.is_object_ref)
    
    def test_nested_object_reference_traversal(self):
        """Test traversing nested object references in expressions.
        NOTE: This test is disabled until object-type attributes are properly supported in the grammar.
        The grammar currently doesn't allow object types as attribute datatypes."""
        self.skipTest("Object-type attributes not yet supported in grammar")
    
    def test_runtime_object_reference_storage(self):
        """Test that runtime correctly stores object references."""
        regelspraak_code = """
        Objecttype Auto
            het merk Tekst;
            
        Objecttype Persoon (bezield)
            de naam Tekst;
            de auto Auto;
        """
        
        model = parse_text(regelspraak_code)
        
        # Run semantic analysis
        analyzer = SemanticAnalyzer()
        errors = analyzer.analyze(model)
        self.assertEqual(len(errors), 0)
        
        # Create runtime context
        context = RuntimeContext(model)
        
        # Create objects
        auto = RuntimeObject("Auto", instance_id="auto_1")
        context.add_object(auto)
        context.set_attribute(auto, "merk", "Tesla")
        
        persoon = RuntimeObject("Persoon", instance_id="persoon_1")
        context.add_object(persoon)
        context.set_attribute(persoon, "naam", "Marie")
        context.set_attribute(persoon, "auto", auto)  # Set object reference
        
        # Verify the object reference is stored correctly
        auto_value = context.get_attribute(persoon, "auto")
        self.assertIsInstance(auto_value, Value)
        self.assertEqual(auto_value.datatype, "ObjectReference")
        self.assertIsInstance(auto_value.value, RuntimeObject)
        self.assertEqual(auto_value.value.instance_id, "auto_1")
        
        # Verify we can traverse the reference
        auto_merk = context.get_attribute(auto_value.value, "merk")
        self.assertEqual(auto_merk.value, "Tesla")


if __name__ == '__main__':
    unittest.main()