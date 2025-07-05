#!/usr/bin/env python3
"""Test Beslistabel (decision table) functionality."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from decimal import Decimal

class TestBeslistabel(unittest.TestCase):
    
    def test_simple_woonregio_factor(self):
        """Test basic decision table from TOKA example."""
        regelspraak_code = """
        Objecttype Natuurlijk persoon
            de woonprovincie Tekst;
            de woonregio factor Numeriek (geheel getal);
        
        Beslistabel Woonregio factor
            geldig altijd
        |   | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie gelijk is aan |
        |---|-----------------------------------------------------------------------|------------------------------------------|
        | 1 | 1                                                                     | 'Friesland'                              |
        | 2 | 2                                                                     | 'Noord-Brabant'                          |
        | 3 | 3                                                                     | 'Noord-Holland'                          |
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Check that we have a beslistabel
        self.assertEqual(len(model.beslistabellen), 1)
        beslistabel = model.beslistabellen[0]
        self.assertEqual(beslistabel.naam, "Woonregio factor")
        
        # Check structure
        self.assertEqual(beslistabel.result_column, "de woonregio factor van een Natuurlijk persoon moet gesteld worden op")
        self.assertEqual(len(beslistabel.condition_columns), 1)
        self.assertEqual(beslistabel.condition_columns[0], "indien zijn woonprovincie gelijk is aan")
        
        # Check rows
        self.assertEqual(len(beslistabel.rows), 3)
        self.assertEqual(beslistabel.rows[0].row_number, 1)
        self.assertEqual(beslistabel.rows[0].result_expression.value, 1)
        self.assertEqual(beslistabel.rows[0].condition_values[0].value, "'Friesland'")

    def test_beslistabel_with_nvt(self):
        """Test decision table with n.v.t. conditions."""
        regelspraak_code = """
        Objecttype Passagier
            de reisduur per trein Numeriek (geheel getal) met eenheid minuten;
            de belasting op basis van reisduur Bedrag;
        
        Domein Bedrag is van het type Numeriek (getal met 2 decimalen) met eenheid EUR;
        
        Parameter de bovengrens reisduur eerste schijf : Numeriek (geheel getal) met eenheid minuten;
        Parameter de bovengrens reisduur tweede schijf : Numeriek (geheel getal) met eenheid minuten;
        
        Beslistabel Belasting op basis van reisduur
            geldig altijd
        |   | de belasting van een Passagier | indien reisduur groter is dan | indien reisduur kleiner of gelijk is aan |
        |---|----------------------------------|-------------------------------|------------------------------------------|
        | 1 | 10 EUR                           | n.v.t.                        | de bovengrens eerste schijf              |
        | 2 | 20 EUR                           | de bovengrens eerste schijf   | de bovengrens tweede schijf              |
        | 3 | 30 EUR                           | de bovengrens tweede schijf   | n.v.t.                                   |
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Check structure
        beslistabel = model.beslistabellen[0]
        self.assertEqual(len(beslistabel.rows), 3)
        
        # Check n.v.t. handling
        # Row 1 has n.v.t. in first condition
        self.assertEqual(beslistabel.rows[0].condition_values[0].value, "n.v.t.")
        self.assertEqual(beslistabel.rows[0].condition_values[0].datatype, "Tekst")
        
        # Row 3 has n.v.t. in second condition
        self.assertEqual(beslistabel.rows[2].condition_values[1].value, "n.v.t.")

    def test_beslistabel_parsing_errors(self):
        """Test error handling for malformed tables."""
        # Missing separator line
        regelspraak_code1 = """
        Objecttype Test
            de waarde Numeriek;
        
        Beslistabel Fout
            geldig altijd
        |   | de waarde | indien x |
        | 1 | 1         | 2        |
        """
        
        # This should parse but might have structural issues
        # For now, just check it doesn't crash
        try:
            model = parse_text(regelspraak_code1)
        except Exception as e:
            # Expected - grammar might reject this
            pass

    def test_beslistabel_execution(self):
        """Test basic execution of a decision table."""
        regelspraak_code = """
        Objecttype Persoon
            de naam Tekst;
            de provincie Tekst;
            de regio factor Numeriek (geheel getal);
        
        Beslistabel Regio bepaling
            geldig altijd
        |   | de regio factor | indien provincie is |
        |---|-----------------|---------------------|
        | 1 | 1               | 'Friesland'         |
        | 2 | 2               | 'Utrecht'           |
        | 3 | 3               | 'Limburg'           |
        """
        
        # Parse and create context
        model = parse_text(regelspraak_code)
        context = RuntimeContext(model)
        
        # Create test person
        person = RuntimeObject("Persoon")
        context.add_object(person)
        context.set_attribute(person, "naam", Value("Jan", datatype="Tekst"))
        context.set_attribute(person, "provincie", Value("Utrecht", datatype="Tekst"))
        
        # Execute
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # For now, just check execution doesn't crash
        # Full implementation would need proper result parsing
        self.assertIn("beslistabel:Regio bepaling", results)


if __name__ == "__main__":
    unittest.main() 