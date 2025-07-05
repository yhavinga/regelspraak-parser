#!/usr/bin/env python3
"""Test Dagsoortdefinitie (day type definition) rules."""

import unittest
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from decimal import Decimal
from datetime import date

class TestDagsoortdefinitie(unittest.TestCase):
    
    def test_kerstdag_definition(self):
        """Test Christmas day definition from TOKA example."""
        regelspraak_code = """
        Dagsoort de kerstdag (mv: kerstdagen);
        
        Regel Kerstdag
            geldig altijd
                Een dag is een kerstdag
                indien de dag aan alle volgende voorwaarden voldoet:
                - de maand uit (de dag) is gelijk aan 12
                - de dag voldoet aan ten minste één van de volgende voorwaarden:
                    .. de dag uit (de dag) is gelijk aan 25
                    .. de dag uit (de dag) is gelijk aan 26.
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Create context
        context = RuntimeContext(model)
        
        # For now, let's test that it parses correctly
        # The full execution would require implementing date types
        # and the "maand uit" and "dag uit" functions
        
        # Check that we have a regel with Dagsoortdefinitie
        self.assertEqual(len(model.regels), 1)
        regel = model.regels[0]
        self.assertEqual(regel.naam, "Kerstdag")
        
        # Check the resultaat is a Dagsoortdefinitie
        from regelspraak.ast import Dagsoortdefinitie
        self.assertIsInstance(regel.resultaat, Dagsoortdefinitie)
        self.assertEqual(regel.resultaat.dagsoort_naam, "kerstdag")
    
    def test_simple_dagsoort_rule(self):
        """Test a simple day type definition without complex conditions."""
        regelspraak_code = """
        Dagsoort de werkdag;
        
        Regel Werkdag
            geldig altijd
                Een dag is een werkdag.
        """
        
        # Parse the code
        model = parse_text(regelspraak_code)
        self.assertIsNotNone(model)
        
        # Check that we have a regel with Dagsoortdefinitie
        self.assertEqual(len(model.regels), 1)
        regel = model.regels[0]
        self.assertEqual(regel.naam, "Werkdag")
        
        # Check the resultaat is a Dagsoortdefinitie
        from regelspraak.ast import Dagsoortdefinitie
        self.assertIsInstance(regel.resultaat, Dagsoortdefinitie)
        self.assertEqual(regel.resultaat.dagsoort_naam, "werkdag")
        
        # No condition for this rule
        self.assertIsNone(regel.voorwaarde)

if __name__ == "__main__":
    unittest.main()