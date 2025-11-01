"""Test complex navigation in Gelijkstelling targets."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject
from regelspraak.engine import Evaluator
from regelspraak.runtime import Value


class TestGelijkstellingComplexNavigation(unittest.TestCase):
    """Test that Gelijkstelling can navigate through complex paths to set attributes."""
    
    def test_simple_navigation_through_relationship(self):
        """Test setting an attribute through a single relationship navigation."""
        code = """
        Feittype eigendom relatie
            de eigenaar	Persoon
            het gebouw	Gebouw
            Eén eigenaar heeft één of meerdere gebouwen
        
        Objecttype de Persoon
            de naam Tekst;
            de leeftijd Numeriek;
        
        Objecttype het Gebouw  
            het adres Tekst;
            het bouwjaar Numeriek;
        
        Regel stel_eigenaar_naam_in
            geldig altijd
                De naam van de eigenaar van het gebouw moet berekend worden als "Jan de Vries".
        """
        
        # Parse the model
        model = parse_text(code)
        
        # Create runtime context and engine
        context = RuntimeContext(model)
        engine = Evaluator(context)
        
        # Create test objects
        persoon = RuntimeObject("Persoon", {})
        gebouw = RuntimeObject("Gebouw", {})
        
        # Add to context
        context.add_object(persoon)
        context.add_object(gebouw)
        
        # Create the relationship
        context.add_relationship("eigendom relatie", persoon, gebouw)
        
        # Execute rule with gebouw as current instance
        context.current_instance = gebouw
        
        # Get the rule and evaluate it properly
        rule = model.regels[0]
        engine.evaluate_rule(rule)
        
        # Check that the eigenaar's name was updated
        naam_value = context.get_attribute(persoon, "naam")
        self.assertEqual(naam_value.value, "Jan de Vries")
    
    def test_deep_navigation_through_multiple_relationships(self):
        """Test setting an attribute through multiple relationship navigations."""
        code = """
        Feittype eigendom relatie
            de eigenaar	Persoon
            het gebouw	Gebouw
            Eén eigenaar heeft één of meerdere gebouwen
            
        Feittype werkrelatie
            de werkgever	Bedrijf
            de werknemer	Persoon
            Eén werkgever heeft meerdere werknemers
        
        Objecttype de Persoon
            de naam Tekst;
        
        Objecttype het Gebouw  
            het adres Tekst;
        
        Objecttype het Bedrijf
            de bedrijfsnaam Tekst;
            het kvk nummer Numeriek;
        
        Regel stel_bedrijfsnaam_in
            geldig altijd
                De bedrijfsnaam van de werkgever van de eigenaar van het gebouw 
                moet berekend worden als "Acme Corp".
        """
        
        # Parse the model
        model = parse_text(code)
        
        # Create runtime context and engine
        context = RuntimeContext(model)
        engine = Evaluator(context)
        
        # Create test objects
        persoon = RuntimeObject("Persoon", {})
        gebouw = RuntimeObject("Gebouw", {})
        bedrijf = RuntimeObject("Bedrijf", {})
        
        # Add to context
        context.add_object(persoon)
        context.add_object(gebouw)
        context.add_object(bedrijf)
        
        # Create the relationships
        context.add_relationship("eigendom relatie", persoon, gebouw)
        context.add_relationship("werkrelatie", bedrijf, persoon)
        
        # Execute rule with gebouw as current instance
        context.current_instance = gebouw
        
        # Get the rule and evaluate it properly
        rule = model.regels[0]
        engine.evaluate_rule(rule)
        
        # Check that the bedrijf's name was updated
        naam_value = context.get_attribute(bedrijf, "bedrijfsnaam")
        self.assertEqual(naam_value.value, "Acme Corp")
    
    def test_navigation_with_initialization(self):
        """Test that Initialisatie also works with complex navigation."""
        code = """
        Feittype eigendom relatie
            de eigenaar	Persoon
            het gebouw	Gebouw
            Eén eigenaar heeft één of meerdere gebouwen
        
        Objecttype de Persoon
            de naam Tekst;
            de leeftijd Numeriek;
        
        Objecttype het Gebouw  
            het adres Tekst;
        
        Regel initialiseer_eigenaar_leeftijd
            geldig altijd
                De leeftijd van de eigenaar van het gebouw moet geïnitialiseerd worden op 25.
        """
        
        # Parse the model
        model = parse_text(code)
        
        # Create runtime context and engine
        context = RuntimeContext(model)
        engine = Evaluator(context)
        
        # Create test objects - leeftijd not initialized
        persoon = RuntimeObject("Persoon", {"naam": "Test"})
        gebouw = RuntimeObject("Gebouw", {})
        
        # Add to context
        context.add_object(persoon)
        context.add_object(gebouw)
        
        # Create the relationship
        context.add_relationship("eigendom relatie", persoon, gebouw)
        
        # Execute rule with gebouw as current instance
        context.current_instance = gebouw
        
        # Get the rule and evaluate it properly
        rule = model.regels[0]
        engine.evaluate_rule(rule)
        
        # Check that the eigenaar's leeftijd was initialized
        leeftijd_value = context.get_attribute(persoon, "leeftijd")
        self.assertEqual(leeftijd_value.value, 25)
        
        # Run again - should not overwrite (Initialisatie only sets if empty)
        context.set_attribute(persoon, "leeftijd", Value(30, "Numeriek"))
        engine.evaluate_rule(rule)
        leeftijd_value = context.get_attribute(persoon, "leeftijd")
        self.assertEqual(leeftijd_value.value, 30)  # Should remain 30


if __name__ == '__main__':
    unittest.main()