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
        """Test traversing nested object references in expressions."""
        regelspraak_code = """
        Objecttype Adres
            de straat Tekst;
            het huisnummer Numeriek;
            de postcode Tekst;
            
        Objecttype Gebouw
            het adres Adres;
            de oppervlakte Numeriek met eenheid m2;
            
        Objecttype Persoon (bezield)
            de naam Tekst;
            het woonadres Adres;
            het kantoor Gebouw;
            
        Regel TestNestedNavigation
        geldig altijd
            De postcode van het woonadres van een persoon moet berekend worden als "1234AB".
        """
        
        # Parse and validate model
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Verify object types
        self.assertIn("Adres", model.objecttypes)
        self.assertIn("Gebouw", model.objecttypes)
        self.assertIn("Persoon", model.objecttypes)
        
        # Verify Persoon has object-type attributes
        persoon = model.objecttypes["Persoon"]
        self.assertIn("woonadres", persoon.attributen)
        self.assertIn("kantoor", persoon.attributen)
        
        # Verify datatypes before semantic analysis
        woonadres_attr = persoon.attributen["woonadres"]
        self.assertEqual(woonadres_attr.datatype, "Adres")
        
        kantoor_attr = persoon.attributen["kantoor"]
        self.assertEqual(kantoor_attr.datatype, "Gebouw")
        
        # Verify Gebouw has object-type attribute
        gebouw = model.objecttypes["Gebouw"]
        self.assertIn("adres", gebouw.attributen)
        adres_attr = gebouw.attributen["adres"]
        self.assertEqual(adres_attr.datatype, "Adres")
        
        # Run semantic analysis - this marks object references
        analyzer = SemanticAnalyzer()
        errors = analyzer.analyze(model)
        self.assertEqual(len(errors), 0, f"Semantic errors: {errors}")
        
        # Now verify attributes are marked as object references after semantic analysis
        self.assertTrue(woonadres_attr.is_object_ref)
        self.assertTrue(kantoor_attr.is_object_ref)
        self.assertTrue(adres_attr.is_object_ref)
        
        # Create runtime context and test objects
        context = RuntimeContext(model)
        
        # Create address
        adres1 = RuntimeObject("Adres", instance_id="adres_1")
        context.add_object(adres1)
        context.set_attribute(adres1, "straat", "Hoofdstraat")
        context.set_attribute(adres1, "huisnummer", 42)
        context.set_attribute(adres1, "postcode", "5678CD")
        
        # Create building with address
        gebouw1 = RuntimeObject("Gebouw", instance_id="gebouw_1")
        context.add_object(gebouw1)
        context.set_attribute(gebouw1, "adres", adres1)
        context.set_attribute(gebouw1, "oppervlakte", 250)
        
        # Create person with nested references
        persoon1 = RuntimeObject("Persoon", instance_id="persoon_1")
        context.add_object(persoon1)
        context.set_attribute(persoon1, "naam", "Jan")
        context.set_attribute(persoon1, "woonadres", adres1)
        context.set_attribute(persoon1, "kantoor", gebouw1)
        
        # Execute rule to test nested navigation
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Verify the rule correctly set the postcode through nested navigation
        postcode = context.get_attribute(adres1, "postcode")
        self.assertEqual(postcode.value, "1234AB")
        
        # Additional test: verify we can navigate through multiple levels
        kantoor_ref = context.get_attribute(persoon1, "kantoor")
        self.assertIsInstance(kantoor_ref.value, RuntimeObject)
        
        kantoor_adres_ref = context.get_attribute(kantoor_ref.value, "adres")
        self.assertIsInstance(kantoor_adres_ref.value, RuntimeObject)
        
        kantoor_postcode = context.get_attribute(kantoor_adres_ref.value, "postcode")
        self.assertEqual(kantoor_postcode.value, "1234AB")
    
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