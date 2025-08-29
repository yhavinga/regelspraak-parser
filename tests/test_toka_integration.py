#!/usr/bin/env python3
"""Integration test for complete TOKA case study.

This test verifies that the RegelSpraak parser and engine can handle
the complete TOKA specification as written in examples/toka/*.rs
"""

import unittest
import os
from regelspraak.parsing import parse_text, parse_file
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.semantics import SemanticAnalyzer
from datetime import date, datetime
from decimal import Decimal


class TestTokaIntegration(unittest.TestCase):
    
    def setUp(self):
        """Load TOKA gegevens and regels files."""
        base_path = os.path.dirname(os.path.dirname(__file__))
        self.gegevens_path = os.path.join(base_path, "examples/toka/gegevens.rs")
        self.regels_path = os.path.join(base_path, "examples/toka/regels.rs")
        
    def test_parse_complete_toka_files(self):
        """Test that both TOKA files parse successfully together."""
        # Read both files
        with open(self.gegevens_path, 'r') as f:
            gegevens_content = f.read()
        with open(self.regels_path, 'r') as f:
            regels_content = f.read()
        
        # Combine content
        complete_toka = gegevens_content + "\n\n" + regels_content
        
        # Parse combined content
        model = parse_text(complete_toka)
        self.assertIsNotNone(model, "Failed to parse complete TOKA specification")
        
        # Verify key components are present
        # Object types
        self.assertIn("Natuurlijk persoon", model.objecttypes)
        self.assertIn("Vlucht", model.objecttypes)
        self.assertIn("Contingent treinmiles", model.objecttypes)
        
        # Parameters with complex names
        params = {p.naam for p in model.parameters.values()}
        self.assertIn("korting bij gebruik niet-fossiele brandstof", params)
        self.assertIn("aantal treinmiles per passagier voor contingent", params)
        
        # Rules
        rule_names = {r.naam for r in model.regels}
        self.assertIn("Passagier van 18 tm 24 jaar", rule_names)
        self.assertIn("Te betalen belasting van een passagier", rule_names)
        self.assertIn("verdeling treinmiles in gelijke delen", rule_names)
        
        # Decision tables
        self.assertEqual(len(model.beslistabellen), 2)
        beslistabel_names = {b.naam for b in model.beslistabellen}
        self.assertIn("Woonregio factor", beslistabel_names)
        self.assertIn("Belasting op basis van reisduur", beslistabel_names)
        
    def test_complex_parameter_reference_in_calculation(self):
        """Test parameter reference: 'de korting bij gebruik niet-fossiele brandstof'."""
        regelspraak_code = """
        Domein Bedrag is van het type Numeriek (getal met 2 decimalen)
        
        Objecttype de Passagier (mv: passagiers) (bezield)
            de belasting op basis van afstand Bedrag;
            de te betalen belasting Bedrag;
        
        Parameter de korting bij gebruik niet-fossiele brandstof : Bedrag;
        
        Regel Te betalen belasting van een passagier
            geldig altijd
                De te betalen belasting van een passagier moet berekend worden als 
                zijn belasting op basis van afstand min de korting bij gebruik niet-fossiele brandstof, 
                met een minimum van 0 € naar beneden afgerond op 0 decimalen.
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Create runtime context with parameter value
        context = RuntimeContext(model)
        context.set_parameter("korting bij gebruik niet-fossiele brandstof", 
                             Value(Decimal("25.00"), "Bedrag"))
        
        # Create passenger with base tax
        passenger = RuntimeObject("Passagier")
        context.add_object(passenger)
        context.set_attribute(passenger, "belasting op basis van afstand", 
                            Value(Decimal("100.00"), "Bedrag"))
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result (100 - 25 = 75, with minimum 0, rounded down)
        tax = context.get_attribute(passenger, "te betalen belasting")
        self.assertEqual(tax.value, Decimal("75"))
        
    def test_begrenzing_and_afronding_combined(self):
        """Test combined begrenzing (minimum) and afronding (rounding)."""
        regelspraak_code = """
        Domein Bedrag is van het type Numeriek (getal met 2 decimalen)
        
        Objecttype de Test
            de waarde Bedrag;
            de resultaat Bedrag;
        
        Regel bereken met begrenzing en afronding
            geldig altijd
                De resultaat van een test moet berekend worden als 
                de waarde van de test min 100 €, 
                met een minimum van 0 € naar beneden afgerond op 0 decimalen.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Test case 1: Value that goes negative (should be bounded to 0)
        test1 = RuntimeObject("Test")
        context.add_object(test1)
        context.set_attribute(test1, "waarde", Value(Decimal("50.75"), "Bedrag"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        result1 = context.get_attribute(test1, "resultaat")
        self.assertEqual(result1.value, Decimal("0"))  # 50.75 - 100 = -49.25 -> minimum 0
        
        # Test case 2: Value that stays positive with rounding
        test2 = RuntimeObject("Test")
        context.add_object(test2)
        context.set_attribute(test2, "waarde", Value(Decimal("150.89"), "Bedrag"))
        
        evaluator.execute_model(model)
        
        result2 = context.get_attribute(test2, "resultaat")
        self.assertEqual(result2.value, Decimal("50"))  # 150.89 - 100 = 50.89 -> rounded down to 50
        
    def test_consistency_check_ongelijk(self):
        """Test consistency check with 'moet ongelijk zijn aan'."""
        regelspraak_code = """
        Domein Luchthavens is van het type Enumeratie
            'Amsterdam Schiphol'
            'Parijs Charles de Gaulle'
        
        Objecttype de Vlucht (mv: vluchten)
            de luchthaven van vertrek Luchthavens;
            de luchthaven van bestemming Luchthavens;
        
        Regel Controleer of vlucht geen rondvlucht is
            geldig altijd
                De luchthaven van vertrek van een vlucht moet ongelijk zijn aan 
                de luchthaven van bestemming van de vlucht.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Find the consistency check rule
        consistency_rule = None
        for regel in model.regels:
            if "Controleer" in regel.naam:
                consistency_rule = regel
                break
        
        self.assertIsNotNone(consistency_rule, "Consistency check rule not found")
        
        # The rule should have been parsed as a consistency check
        # (exact AST structure depends on implementation)
        
    def test_object_creation_with_met_syntax(self):
        """Test object creation: 'Een X heeft het Y met attribuut gelijk aan Z'."""
        regelspraak_code = """
        Objecttype de Vlucht (mv: vluchten)
        Objecttype het Contingent treinmiles (mv: contingenten treinmiles)
            het aantal treinmiles op basis van aantal passagiers Numeriek (positief geheel getal);
        
        Feittype reis met contingent treinmiles  
            de reis met treinmiles Vlucht
            het vastgestelde contingent treinmiles Contingent treinmiles
            één reis met treinmiles heeft één vastgestelde contingent treinmiles
        
        Parameter het aantal treinmiles per passagier voor contingent : Numeriek (positief geheel getal);
        
        Regel vastgestelde contingent treinmiles
            geldig altijd
                Een vlucht heeft het vastgestelde contingent treinmiles met
                aantal treinmiles op basis van aantal passagiers gelijk aan 100.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model, "Failed to parse object creation with 'met' syntax")
        
        # Verify rule was parsed
        rule_found = False
        for regel in model.regels:
            if "vastgestelde contingent treinmiles" in regel.naam:
                rule_found = True
                break
        
        self.assertTrue(rule_found, "Object creation rule not found")
        
    def test_distribution_rule_with_complex_name(self):
        """Test distribution rule: 'verdeling treinmiles in gelijke delen'."""
        regelspraak_code = """
        Objecttype het Contingent treinmiles (mv: contingenten treinmiles)
            het totaal aantal treinmiles Numeriek (positief geheel getal);
        
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de treinmiles Numeriek (geheel getal);
        
        Feittype verdeling contingent treinmiles over passagiers
            het te verdelen contingent treinmiles Contingent treinmiles
            de passagier met recht op treinmiles Natuurlijk persoon
            één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles
        
        Regel verdeling treinmiles in gelijke delen
            geldig altijd
                Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
                de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
                contingent treinmiles, waarbij wordt verdeeld in gelijke delen.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Verify distribution rule was parsed
        verdeling_rule = None
        for regel in model.regels:
            if "verdeling treinmiles in gelijke delen" == regel.naam:
                verdeling_rule = regel
                break
        
        self.assertIsNotNone(verdeling_rule, "Distribution rule not found")
        
    def test_decision_table_with_of_syntax(self):
        """Test decision table with 'of' for multiple values."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de woonprovincie Tekst;
            de woonregio factor Numeriek (geheel getal);
        
        Beslistabel Woonregio factor
            geldig altijd
        
        | | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie gelijk is aan |
        |---|---|---|
        | 1 | 1 | 'Friesland', 'Groningen', 'Drenthe', 'Zeeland' of 'Limburg' |
        | 2 | 2 | 'Noord-Brabant', 'Gelderland', 'Overijssel' of 'Flevoland' |
        | 3 | 3 | 'Noord-Holland', 'Zuid-Holland' of 'Utrecht' |
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(model)
        
        # Test person from each category
        test_cases = [
            ("Friesland", 1),
            ("Groningen", 1),
            ("Noord-Brabant", 2),
            ("Utrecht", 3),
        ]
        
        for provincie, expected_factor in test_cases:
            person = RuntimeObject("Natuurlijk persoon")
            context.add_object(person)
            context.set_attribute(person, "woonprovincie", Value(provincie, "Tekst"))
            
            evaluator = Evaluator(context)
            evaluator.execute_model(model)
            
            factor = context.get_attribute(person, "woonregio factor")
            self.assertEqual(factor.value, expected_factor,
                           f"Province {provincie} should have factor {expected_factor}")
            
    def test_eerste_paasdag_function(self):
        """Test eerste paasdag van function."""
        regelspraak_code = """
        Objecttype de Vlucht (mv: vluchten)
            de vluchtdatum Datum in dagen;
            is reis met paaskorting kenmerk;
        
        Regel Paaskorting
            geldig altijd
                Een vlucht is een reis met paaskorting
                indien de vluchtdatum van de vlucht gelijk is aan 
                de eerste paasdag van (het jaar uit (de vluchtdatum van de vlucht)).
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create flight on Easter 2024 (March 31, 2024)
        flight = RuntimeObject("Vlucht")
        context.add_object(flight)
        context.set_attribute(flight, "vluchtdatum", Value(date(2024, 3, 31), "Datum"))
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check Easter discount applied
        has_discount = context.get_kenmerk(flight, "reis met paaskorting")
        self.assertTrue(has_discount, "Flight on Easter should have discount")
        
    def test_age_calculation_with_tijdsduur(self):
        """Test age calculation using tijdsduur function."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de geboortedatum Datum in dagen;
            de leeftijd Numeriek (niet-negatief geheel getal) met eenheid jr;
        
        Objecttype de Vlucht (mv: vluchten)
            de vluchtdatum Datum in dagen;
        
        Feittype vlucht van natuurlijke personen
            de reis Vlucht
            de passagier Natuurlijk persoon
            Eén reis betreft de verplaatsing van meerdere passagiers
        
        Regel bepaal leeftijd
            geldig altijd
                De leeftijd van een Natuurlijk persoon moet berekend worden als de tijdsduur van zijn
                geboortedatum tot de vluchtdatum van zijn reis in hele jaren.
        """
        
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        
        # Create flight
        flight = RuntimeObject("Vlucht")
        context.add_object(flight)
        context.set_attribute(flight, "vluchtdatum", Value(date(2024, 6, 15), "Datum"))
        
        # Create passenger born on June 15, 2004 (exactly 20 years old on flight date)
        passenger = RuntimeObject("Natuurlijk persoon")
        context.add_object(passenger)
        context.set_attribute(passenger, "geboortedatum", Value(date(2004, 6, 15), "Datum"))
        
        # Create relationship between flight and passenger
        context.add_relationship("vlucht van natuurlijke personen", 
                               flight, passenger)
        
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check calculated age
        age = context.get_attribute(passenger, "leeftijd")
        self.assertEqual(age.value, 20)
        self.assertEqual(age.unit, "jr")


if __name__ == "__main__":
    unittest.main()