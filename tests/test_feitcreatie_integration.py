"""Integration tests for FeitCreatie functionality."""
import unittest
import logging
from regelspraak.parsing import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.engine import Evaluator
from regelspraak import ast
from regelspraak.errors import RegelspraakError

logger = logging.getLogger(__name__)

class TestFeitCreatieIntegration(unittest.TestCase):
    """Test FeitCreatie rule type which creates new relationships by navigation."""
    
    def test_feitcreatie_contingent_passagiers(self):
        """Test the specification example: creating passenger rights to train miles."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen)
            de naam Tekst;
            de treinmiles Numeriek (geheel getal);

        Objecttype de Vlucht
            de vluchtnummer Tekst;
            het aantal passagiers Numeriek (geheel getal);

        Objecttype het Contingent treinmiles
            het totaal aantal treinmiles Numeriek (geheel getal);
            het aantal treinmiles op basis van aantal passagiers Numeriek (geheel getal);

        Feittype vlucht van natuurlijke personen
            de reis Vlucht
            de passagier Natuurlijk persoon
        Eén reis betreft de verplaatsing van meerdere passagiers

        Feittype reis met contingent treinmiles
            de reis met treinmiles Vlucht
            het vastgestelde contingent treinmiles Contingent treinmiles
        één reis met treinmiles heeft één vastgestelde contingent treinmiles

        Feittype verdeling contingent treinmiles over passagiers
            het te verdelen contingent treinmiles Contingent treinmiles
            de passagier met recht op treinmiles Natuurlijk persoon
        één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles

        Regel passagier met recht op treinmiles
            geldig altijd
                Een passagier met recht op treinmiles van een vastgestelde contingent treinmiles is een passagier van de reis met treinmiles van het vastgestelde contingent treinmiles.
        """
        
        # Parse and validate
        domain_model = parse_text(regelspraak_code)
        self.assertIsInstance(domain_model, ast.DomainModel)
        
        # Verify feittypen were parsed
        self.assertEqual(len(domain_model.feittypen), 3)
        
        
        # Create runtime context
        context = RuntimeContext(domain_model=domain_model)
        
        # Create a flight
        vlucht = RuntimeObject(object_type_naam="Vlucht", instance_id="v1")
        vlucht.attributen["vluchtnummer"] = Value(value="KL123", datatype="Tekst")
        vlucht.attributen["aantal passagiers"] = Value(value=2, datatype="Numeriek")
        context.add_object(vlucht)
        
        # Create passengers
        passagier1 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p1")
        passagier1.attributen["naam"] = Value(value="Jan Jansen", datatype="Tekst")
        context.add_object(passagier1)
        
        passagier2 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p2")
        passagier2.attributen["naam"] = Value(value="Marie de Vries", datatype="Tekst")
        context.add_object(passagier2)
        
        # Create relationships between passengers and flight
        # Use the exact feittype name
        vlucht_feittype = "vlucht van natuurlijke personen"
        self.assertIn(vlucht_feittype, domain_model.feittypen)
        
        context.add_relationship(
            feittype_naam=vlucht_feittype,
            subject=vlucht,
            object=passagier1,
            preposition="VAN"
        )
        context.add_relationship(
            feittype_naam=vlucht_feittype,
            subject=vlucht,
            object=passagier2,
            preposition="VAN"
        )
        
        # Create contingent
        contingent = RuntimeObject(object_type_naam="Contingent treinmiles", instance_id="c1")
        contingent.attributen["totaal aantal treinmiles"] = Value(value=1000, datatype="Numeriek")
        contingent.attributen["aantal treinmiles op basis van aantal passagiers"] = Value(value=500, datatype="Numeriek")
        context.add_object(contingent)
        
        # Create relationship between contingent and flight
        # Use the exact feittype name
        reis_contingent_feittype = "reis met contingent treinmiles"
        self.assertIn(reis_contingent_feittype, domain_model.feittypen)
        
        context.add_relationship(
            feittype_naam=reis_contingent_feittype,
            subject=vlucht,
            object=contingent,
            preposition="VAN"
        )
        
        # Set contingent as current instance for rule evaluation
        context.set_current_instance(contingent)
        
        # Execute the model
        evaluator = Evaluator(context)
        
        # Check if the FeitCreatie regel was parsed
        self.assertEqual(len(domain_model.regels), 1, "Should have 1 regel")
        
        # Execute without special tracing for now
        evaluator.execute_model(domain_model)
        
        # Verify new relationships were created
        # Each passenger should now be a "passagier met recht op treinmiles" of the contingent
        # Use the exact feittype name
        verdeling_feittype = "verdeling contingent treinmiles over passagiers"
        self.assertIn(verdeling_feittype, domain_model.feittypen)
        
        relationships = context.find_relationships(subject=contingent, feittype_naam=verdeling_feittype)
        self.assertEqual(len(relationships), 2, "Should have created 2 relationships")
        
        # Check that both passengers are now related to the contingent
        related_passengers = [rel.object for rel in relationships]
        passenger_ids = [p.instance_id for p in related_passengers]
        self.assertIn("p1", passenger_ids)
        self.assertIn("p2", passenger_ids)
    
    def test_feitcreatie_no_matching_objects(self):
        """Test FeitCreatie when no objects match the navigation criteria."""
        regelspraak_code = """
        Objecttype de Klant
            de naam Tekst;
            is premium kenmerk;

        Objecttype de Dienst
            de dienstnaam Tekst;

        Objecttype het Abonnement
            de abonnementsnaam Tekst;

        Feittype klant heeft abonnement
            de abonnee Klant
            het abonnement Abonnement
        Een abonnee heeft een abonnement

        Feittype abonnement voor dienst
            het dienst abonnement Abonnement
            de aangeboden dienst Dienst
        Een dienst abonnement is voor een aangeboden dienst

        Feittype premium klant voor dienst
            de premium abonnee Klant
            de premium dienst Dienst
        Een premium abonnee heeft toegang tot een premium dienst

        Regel maak premium klant relatie
            geldig altijd
                Een premium abonnee van een premium dienst is een abonnee van een dienst abonnement van de aangeboden dienst.
        """
        
        # Parse and validate
        domain_model = parse_text(regelspraak_code)
        self.assertIsInstance(domain_model, ast.DomainModel)
        
        # Create runtime context
        context = RuntimeContext(domain_model=domain_model)
        
        # Create a dienst but no abonnement or klant
        dienst = RuntimeObject(object_type_naam="Dienst", instance_id="d1")
        dienst.attributen["dienstnaam"] = Value(value="Premium Service", datatype="Tekst")
        context.add_object(dienst)
        
        # Set dienst as current instance
        context.set_current_instance(dienst)
        
        # Execute the model - should not create any relationships
        evaluator = Evaluator(context)
        evaluator.execute_model(domain_model)
        
        # Verify no relationships were created
        relationships = context.find_relationships(subject=dienst, feittype_naam="premium klant voor dienst")
        self.assertEqual(len(relationships), 0, "Should not have created any relationships")
    
    def test_feitcreatie_indirect_navigation(self):
        """Test FeitCreatie with more complex navigation through multiple relationships."""
        regelspraak_code = """
        Objecttype de Organisatie
            de naam Tekst;

        Objecttype de Afdeling
            de afdelingsnaam Tekst;

        Objecttype de Medewerker
            de naam Tekst;
            het salaris Numeriek (geheel getal);

        Objecttype de Bonus
            het bonusbedrag Numeriek (geheel getal);

        Feittype organisatie heeft afdelingen
            de hoofdorganisatie Organisatie
            de afdeling Afdeling
        Een hoofdorganisatie heeft meerdere afdelingen

        Feittype afdeling heeft medewerkers
            de werkafdeling Afdeling
            de medewerker Medewerker
        Een werkafdeling heeft meerdere medewerkers

        Feittype organisatie kent bonus toe
            de bonusgever Organisatie
            de toegekende bonus Bonus
        Een bonusgever kent een toegekende bonus toe

        Feittype medewerker ontvangt bonus
            de bonusontvanger Medewerker
            de ontvangen bonus Bonus
        Een bonusontvanger ontvangt een ontvangen bonus

        Regel bonus voor alle medewerkers
            geldig altijd
                Een bonusontvanger van een toegekende bonus is een medewerker van een afdeling van de bonusgever van de toegekende bonus.
        """
        
        # Parse and validate
        domain_model = parse_text(regelspraak_code)
        self.assertIsInstance(domain_model, ast.DomainModel)
        
        # Create runtime context
        context = RuntimeContext(domain_model=domain_model)
        
        # Create organisatie
        org = RuntimeObject(object_type_naam="Organisatie", instance_id="org1")
        org.attributen["naam"] = Value(value="TechCorp", datatype="Tekst")
        context.add_object(org)
        
        # Create afdelingen
        afd1 = RuntimeObject(object_type_naam="Afdeling", instance_id="afd1")
        afd1.attributen["afdelingsnaam"] = Value(value="IT", datatype="Tekst")
        context.add_object(afd1)
        
        afd2 = RuntimeObject(object_type_naam="Afdeling", instance_id="afd2")
        afd2.attributen["afdelingsnaam"] = Value(value="HR", datatype="Tekst")
        context.add_object(afd2)
        
        # Link afdelingen to organisatie
        context.add_relationship("organisatie heeft afdelingen", org, afd1, "VAN")
        context.add_relationship("organisatie heeft afdelingen", org, afd2, "VAN")
        
        # Create medewerkers
        med1 = RuntimeObject(object_type_naam="Medewerker", instance_id="med1")
        med1.attributen["naam"] = Value(value="Alice", datatype="Tekst")
        context.add_object(med1)
        
        med2 = RuntimeObject(object_type_naam="Medewerker", instance_id="med2")
        med2.attributen["naam"] = Value(value="Bob", datatype="Tekst")
        context.add_object(med2)
        
        med3 = RuntimeObject(object_type_naam="Medewerker", instance_id="med3")
        med3.attributen["naam"] = Value(value="Charlie", datatype="Tekst")
        context.add_object(med3)
        
        # Link medewerkers to afdelingen
        context.add_relationship("afdeling heeft medewerkers", afd1, med1, "VAN")
        context.add_relationship("afdeling heeft medewerkers", afd1, med2, "VAN")
        context.add_relationship("afdeling heeft medewerkers", afd2, med3, "VAN")
        
        # Create bonus
        bonus = RuntimeObject(object_type_naam="Bonus", instance_id="b1")
        bonus.attributen["bonusbedrag"] = Value(value=5000, datatype="Numeriek")
        context.add_object(bonus)
        
        # Link bonus to organisatie
        context.add_relationship("organisatie kent bonus toe", org, bonus, "VAN")
        
        # Set bonus as current instance
        context.set_current_instance(bonus)
        
        # Execute the model
        evaluator = Evaluator(context)
        evaluator.execute_model(domain_model)
        
        # Verify relationships were created for all medewerkers
        relationships = context.find_relationships(subject=bonus, feittype_naam="medewerker ontvangt bonus")
        
        self.assertEqual(len(relationships), 3, "Should have created 3 relationships (one per medewerker)")
        
        # Check that all medewerkers are related to the bonus
        related_medewerkers = [rel.object for rel in relationships]
        medewerker_ids = [m.instance_id for m in related_medewerkers]
        self.assertIn("med1", medewerker_ids)
        self.assertIn("med2", medewerker_ids)
        self.assertIn("med3", medewerker_ids)
    
    def test_feitcreatie_reciprocal_relationship(self):
        """Test FeitCreatie with reciprocal relationships."""
        regelspraak_code = """
        Objecttype de Persoon
            de naam Tekst;

        Wederkerig feittype Partnerrelatie
            de partner Persoon
        Een partner heeft een partner

        Feittype huwelijk
            de echtgenoot Persoon
            de echtgenote Persoon
        Een echtgenoot is getrouwd met een echtgenote

        Regel maak partners van echtgenoten
            geldig altijd
                Een partner van een echtgenoot is een echtgenote van het huwelijk.
        """
        
        # Parse and validate
        domain_model = parse_text(regelspraak_code)
        self.assertIsInstance(domain_model, ast.DomainModel)
        
        # Verify reciprocal feittype
        self.assertIn("Partnerrelatie", domain_model.feittypen)
        self.assertTrue(domain_model.feittypen["Partnerrelatie"].wederkerig)
        
        # Create runtime context
        context = RuntimeContext(domain_model=domain_model)
        
        # Create persons
        person1 = RuntimeObject(object_type_naam="Persoon", instance_id="p1")
        person1.attributen["naam"] = Value(value="Jan", datatype="Tekst")
        context.add_object(person1)
        
        person2 = RuntimeObject(object_type_naam="Persoon", instance_id="p2")
        person2.attributen["naam"] = Value(value="Marie", datatype="Tekst")
        context.add_object(person2)
        
        # Create huwelijk relationship
        context.add_relationship("huwelijk", person1, person2, "VAN")
        
        # Set person1 as current instance
        context.set_current_instance(person1)
        
        # Execute the model
        evaluator = Evaluator(context)
        evaluator.execute_model(domain_model)
        
        # Verify partner relationship was created
        relationships = context.find_relationships(subject=person1, feittype_naam="Partnerrelatie")
        self.assertEqual(len(relationships), 1, "Should have created 1 partner relationship")
        self.assertEqual(relationships[0].object.instance_id, "p2")
        
        # For reciprocal relationships, the reverse should also exist
        reverse_relationships = context.find_relationships(subject=person2, feittype_naam="Partnerrelatie")
        self.assertEqual(len(reverse_relationships), 1, "Should have reciprocal relationship")
        self.assertEqual(reverse_relationships[0].object.instance_id, "p1")
    
    def test_feitcreatie_with_conditions(self):
        """Test FeitCreatie within a conditional rule."""
        regelspraak_code = """
        Objecttype de Klant
            de naam Tekst;
            is actief kenmerk;
            de klantscore Numeriek (geheel getal);

        Objecttype de Product
            de productnaam Tekst;
            is premium kenmerk;

        Objecttype de Aanbieding
            de aanbiedingsnaam Tekst;
            het kortingspercentage Numeriek (geheel getal);

        Feittype klant koopt product
            de koper Klant
            het gekochte product Product
        Een koper koopt een gekochte product

        Feittype aanbieding voor product
            de product aanbieding Aanbieding
            het aangeboden product Product
        Een product aanbieding is voor een aangeboden product

        Feittype klant krijgt aanbieding
            de gelukkige klant Klant
            de verkregen aanbieding Aanbieding
        Een gelukkige klant krijgt een verkregen aanbieding

        Regel premium aanbiedingen voor actieve klanten
            geldig altijd
                Een gelukkige klant van een product aanbieding is een koper van het aangeboden product van de product aanbieding
                indien de koper is actief en zijn klantscore groter is dan 80.
        """
        
        # Parse and validate
        domain_model = parse_text(regelspraak_code)
        self.assertIsInstance(domain_model, ast.DomainModel)
        
        # Create runtime context
        context = RuntimeContext(domain_model=domain_model)
        
        # Create products
        product1 = RuntimeObject(object_type_naam="Product", instance_id="prod1")
        product1.attributen["productnaam"] = Value(value="Premium Widget", datatype="Tekst")
        product1.kenmerken["premium"] = True
        context.add_object(product1)
        
        # Create klanten
        klant1 = RuntimeObject(object_type_naam="Klant", instance_id="k1")
        klant1.attributen["naam"] = Value(value="VIP Customer", datatype="Tekst")
        klant1.attributen["klantscore"] = Value(value=90, datatype="Numeriek")
        klant1.kenmerken["actief"] = True
        context.add_object(klant1)
        
        klant2 = RuntimeObject(object_type_naam="Klant", instance_id="k2")
        klant2.attributen["naam"] = Value(value="Regular Customer", datatype="Tekst")
        klant2.attributen["klantscore"] = Value(value=70, datatype="Numeriek")
        klant2.kenmerken["actief"] = True
        context.add_object(klant2)
        
        klant3 = RuntimeObject(object_type_naam="Klant", instance_id="k3")
        klant3.attributen["naam"] = Value(value="Inactive Customer", datatype="Tekst")
        klant3.attributen["klantscore"] = Value(value=95, datatype="Numeriek")
        klant3.kenmerken["actief"] = False
        context.add_object(klant3)
        
        # Create purchase relationships
        context.add_relationship("klant koopt product", klant1, product1, "VAN")
        context.add_relationship("klant koopt product", klant2, product1, "VAN")
        context.add_relationship("klant koopt product", klant3, product1, "VAN")
        
        # Create aanbieding
        aanbieding = RuntimeObject(object_type_naam="Aanbieding", instance_id="a1")
        aanbieding.attributen["aanbiedingsnaam"] = Value(value="Premium Discount", datatype="Tekst")
        aanbieding.attributen["kortingspercentage"] = Value(value=20, datatype="Numeriek")
        context.add_object(aanbieding)
        
        # Link aanbieding to product
        context.add_relationship("aanbieding voor product", aanbieding, product1, "VAN")
        
        # Set aanbieding as current instance
        context.set_current_instance(aanbieding)
        
        
        # Execute the model
        evaluator = Evaluator(context)
        evaluator.execute_model(domain_model)
        
        # Verify only klant1 got the aanbieding (active AND score > 80)
        relationships = context.find_relationships(subject=aanbieding, feittype_naam="klant krijgt aanbieding")
        self.assertEqual(len(relationships), 1, "Only one klant should get the aanbieding")
        self.assertEqual(relationships[0].object.instance_id, "k1")

if __name__ == '__main__':
    unittest.main()