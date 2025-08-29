#!/usr/bin/env python3
"""Test TOKA decision table with 'of' syntax for multiple values."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from decimal import Decimal


class TestTokaBeslistabelOf(unittest.TestCase):
    
    def test_woonregio_factor_with_of_syntax(self):
        """Test decision table with 'of' combining multiple provinces per row (per spec)."""
        # From TOKA specification lines 452-459
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de woonprovincie Tekst;
            de woonregio factor Numeriek (geheel getal);
        
        Beslistabel Woonregio factor
            geldig altijd
        |   | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie gelijk is aan |
        |---|-----------------------------------------------------------------------|------------------------------------------|
        | 1 | 1                                                                     | 'Friesland', 'Groningen', 'Drenthe', 'Zeeland' of 'Limburg' |
        | 2 | 2                                                                     | 'Noord-Brabant', 'Gelderland', 'Overijssel' of 'Flevoland' |
        | 3 | 3                                                                     | 'Noord-Holland', 'Zuid-Holland' of 'Utrecht' |
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model, "Failed to parse RegelSpraak code with 'of' syntax")
        
        # Check that we have a beslistabel
        self.assertEqual(len(model.beslistabellen), 1)
        beslistabel = model.beslistabellen[0]
        self.assertEqual(beslistabel.naam, "Woonregio factor")
        
        # Check structure
        self.assertEqual(beslistabel.result_column, 
                        "de woonregio factor van een Natuurlijk persoon moet gesteld worden op")
        self.assertEqual(len(beslistabel.condition_columns), 1)
        self.assertEqual(beslistabel.condition_columns[0], 
                        "indien zijn woonprovincie gelijk is aan")
        
        # Check that we have 3 rows (not 12 individual rows)
        self.assertEqual(len(beslistabel.rows), 3)
        
        # Row 1 should have multiple provinces with 'of'
        row1_condition = beslistabel.rows[0].condition_values[0]
        # The condition should contain multiple values combined with 'of'
        self.assertIn("Friesland", str(row1_condition))
        self.assertIn("Groningen", str(row1_condition))
        self.assertIn("Drenthe", str(row1_condition))
        
    def test_beslistabel_execution_with_of_syntax(self):
        """Test that decision table with 'of' syntax executes correctly."""
        regelspraak_code = """
        Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
            de woonprovincie Tekst;
            de woonregio factor Numeriek (geheel getal);
        
        Beslistabel Woonregio factor
            geldig altijd
        |   | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie gelijk is aan |
        |---|-----------------------------------------------------------------------|------------------------------------------|
        | 1 | 1                                                                     | 'Friesland', 'Groningen', 'Drenthe', 'Zeeland' of 'Limburg' |
        | 2 | 2                                                                     | 'Noord-Brabant', 'Gelderland', 'Overijssel' of 'Flevoland' |
        | 3 | 3                                                                     | 'Noord-Holland', 'Zuid-Holland' of 'Utrecht' |
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model, "Failed to parse RegelSpraak code")
        
        # Create runtime context
        context = RuntimeContext(model)
        
        # Test person from Friesland (should get factor 1)
        person1 = RuntimeObject("Natuurlijk persoon")
        context.add_object(person1)
        context.set_attribute(person1, "woonprovincie", Value("Friesland", "Tekst"))
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check result
        factor1 = context.get_attribute(person1, "woonregio factor")
        self.assertEqual(factor1.value, 1)
        
        # Test person from Groningen (also should get factor 1)
        person2 = RuntimeObject("Natuurlijk persoon")
        context.add_object(person2)
        context.set_attribute(person2, "woonprovincie", Value("Groningen", "Tekst"))
        
        evaluator.execute_model(model)
        factor2 = context.get_attribute(person2, "woonregio factor")
        self.assertEqual(factor2.value, 1)
        
        # Test person from Utrecht (should get factor 3)
        person3 = RuntimeObject("Natuurlijk persoon")
        context.add_object(person3)
        context.set_attribute(person3, "woonprovincie", Value("Utrecht", "Tekst"))
        
        evaluator.execute_model(model)
        factor3 = context.get_attribute(person3, "woonregio factor")
        self.assertEqual(factor3.value, 3)
    
    def test_comparison_predicate_with_of_syntax(self):
        """Test that 'of' works in regular comparison predicates too."""
        regelspraak_code = """
        Objecttype de Vlucht (mv: vluchten)
            de luchthaven van vertrek Tekst;
            is binnenlands kenmerk (bijvoeglijk);
        
        Regel binnenlandse vlucht
            geldig altijd
                Een Vlucht is binnenlands
                indien de luchthaven van vertrek van de vlucht gelijk is aan 'Amsterdam Schiphol' of 'Groningen Eelde'.
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model, "Failed to parse comparison with 'of'")
        
        # Create runtime context
        context = RuntimeContext(model)
        
        # Test flight from Amsterdam
        flight1 = RuntimeObject("Vlucht")
        context.add_object(flight1)
        context.set_attribute(flight1, "luchthaven van vertrek", 
                            Value("Amsterdam Schiphol", "Tekst"))
        
        # Execute rules
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check that flight is marked as binnenlands
        is_binnenlands = context.get_kenmerk(flight1, "is_binnenlands")
        self.assertTrue(is_binnenlands)
        
        # Test flight from Groningen
        flight2 = RuntimeObject("Vlucht")
        context.add_object(flight2)
        context.set_attribute(flight2, "luchthaven van vertrek", 
                            Value("Groningen Eelde", "Tekst"))
        
        evaluator.execute_model(model)
        is_binnenlands2 = context.get_kenmerk(flight2, "is_binnenlands")
        self.assertTrue(is_binnenlands2)
        
        # Test flight from Paris (should not be binnenlands)
        flight3 = RuntimeObject("Vlucht")
        context.add_object(flight3)
        context.set_attribute(flight3, "luchthaven van vertrek", 
                            Value("Parijs Charles de Gaulle", "Tekst"))
        
        evaluator.execute_model(model)
        is_binnenlands3 = context.get_kenmerk(flight3, "is_binnenlands")
        self.assertFalse(is_binnenlands3)


if __name__ == "__main__":
    unittest.main()