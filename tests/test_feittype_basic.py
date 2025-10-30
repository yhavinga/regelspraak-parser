import unittest
from tests.test_base import RegelSpraakTestCase
from regelspraak.parsing import parse_text
from regelspraak.ast import DomainModel, FeitType, Rol
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.semantics import SemanticAnalyzer


class TestFeitTypeBasic(RegelSpraakTestCase):
    """Basic test for feittype functionality with TOKA-inspired examples."""
    
    def test_basic_feittype_parsing(self):
        """Test basic feittype parsing with simplified TOKA example."""
        regelspraak_code = """
        Objecttype Passagier (bezield)
            de naam Tekst;
            de leeftijd Numeriek (geheel getal) met eenheid jr;
        
        Objecttype Vlucht
            het vluchtnummer Tekst;
            de bestemming Tekst;
        
        Feittype vlucht van passagiers
            de vlucht Vlucht
            de passagier Passagier
        Een vlucht vervoert passagiers
        
        Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr
        """
        
        # Parse and verify
        model = parse_text(regelspraak_code)
        self.assertIsInstance(model, DomainModel)
        
        # Check feittype
        self.assertIn("vlucht van passagiers", model.feittypen)
        feittype = model.feittypen["vlucht van passagiers"]
        self.assertEqual(len(feittype.rollen), 2)
        
        # Semantic analysis
        analyzer = SemanticAnalyzer()
        errors = analyzer.analyze(model)
        self.assertEqual(len(errors), 0)
    
    def test_domain_with_feittype(self):
        """Test domains work with feittype."""
        regelspraak_code = """
        Domein Bedrag is van het type Numeriek (getal met 2 decimalen)
        
        Objecttype Passagier
            de naam Tekst
            het ticket bedrag Bedrag;
        
        Objecttype Vlucht
            het vluchtnummer Tekst;
            de totale omzet Bedrag;
        
        Feittype vlucht van passagiers
            de vlucht Vlucht
            de passagier Passagier
        Een vlucht vervoert passagiers
        """
        
        model = parse_text(regelspraak_code)
        
        # Verify domain
        self.assertIn("Bedrag", model.domeinen)
        
        # Verify feittype
        self.assertIn("vlucht van passagiers", model.feittypen)
    
    def test_feittype_with_rule(self):
        """Test that KenmerkToekenning rules work with objects in feittype relationships.
        
        This verifies that kenmerken can be assigned to objects that participate
        in feittype relationships, confirming the integration works correctly.
        """
        regelspraak_code = """
        Objecttype Natuurlijk persoon (bezield)
            de naam Tekst;
            de leeftijd Numeriek (geheel getal) met eenheid jr;
            is minderjarig kenmerk (bijvoeglijk);
        
        Objecttype Vlucht
            het vluchtnummer Tekst;
        
        Feittype vlucht van passagiers
            de vlucht Vlucht
            de passagier Natuurlijk persoon
            Een vlucht vervoert passagiers
        
        Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr
        
        Regel kenmerktoekenning minderjarig
            geldig altijd
                Een Natuurlijk persoon is minderjarig
                indien zijn leeftijd kleiner is dan de volwassenleeftijd.
        """
        
        # Parse and verify model
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Verify semantic analysis passes
        analyzer = SemanticAnalyzer()
        errors = analyzer.analyze(model)
        self.assertEqual(len(errors), 0, f"Semantic errors: {errors}")
        
        # Create runtime context
        from regelspraak.engine import Evaluator
        context = RuntimeContext(model)
        context.set_parameter('volwassenleeftijd', 18, unit='jr')
        
        # Create test instances
        vlucht = RuntimeObject('Vlucht', instance_id='KL123')
        context.add_object(vlucht)
        context.set_attribute(vlucht, 'vluchtnummer', 'KL123')
        
        # Create adult passenger
        adult = RuntimeObject('Natuurlijk persoon', instance_id='adult1')
        context.add_object(adult)
        context.set_attribute(adult, 'naam', 'Jan')
        context.set_attribute(adult, 'leeftijd', 25, unit='jr')
        
        # Create minor passenger
        minor = RuntimeObject('Natuurlijk persoon', instance_id='minor1')
        context.add_object(minor)
        context.set_attribute(minor, 'naam', 'Lisa')
        context.set_attribute(minor, 'leeftijd', 12, unit='jr')
        
        # Create feittype relationships
        context.add_relationship(
            feittype_naam='vlucht van passagiers',
            subject=vlucht,
            object=adult,
            preposition='VAN'
        )
        context.add_relationship(
            feittype_naam='vlucht van passagiers',
            subject=vlucht,
            object=minor,
            preposition='VAN'
        )
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Verify kenmerken are correctly assigned
        self.assertFalse(adult.kenmerken.get('minderjarig', False), 
                        "Adult should not be minderjarig")
        self.assertTrue(minor.kenmerken.get('minderjarig', False),
                       "Minor should be minderjarig")
        
        # Verify that the rule executed for both passengers regardless of feittype
        # The kenmerk assignment is based on the condition, not the relationship


if __name__ == '__main__':
    unittest.main()