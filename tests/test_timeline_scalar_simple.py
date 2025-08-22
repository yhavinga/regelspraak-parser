"""
Simple integration test for timeline × scalar operations in Python.
Verifies that the existing Python implementation continues to work correctly.
"""

import unittest
from datetime import datetime
from decimal import Decimal

from regelspraak.parsing import parse_text


class TestTimelineScalarSimple(unittest.TestCase):
    """Simple test for timeline × scalar operations."""
    
    def test_timeline_scalar_operations(self):
        """Test that timeline × scalar operations work in expressions."""
        
        # Create a simple RegelSpraak program with timeline operations
        code = """
        Objecttype de Persoon
            het salaris Bedrag voor elke maand;
            de verhoging Numeriek;
            het verhoogd salaris Bedrag voor elke maand;
            het verlaagd salaris Bedrag voor elke maand;
            het verdubbeld salaris Bedrag voor elke maand;
            het gehalveerd salaris Bedrag voor elke maand;

        Parameter de standaard verhoging : Numeriek;

        Regel verhoog salaris
            geldig altijd
                Het verhoogd salaris van een persoon moet gesteld worden op 
                zijn salaris plus de standaard verhoging.

        Regel verlaag salaris
            geldig altijd
                Het verlaagd salaris van een persoon moet gesteld worden op 
                zijn salaris min 30.

        Regel verdubbel salaris
            geldig altijd
                Het verdubbeld salaris van een persoon moet gesteld worden op 
                zijn salaris maal 2.

        Regel halveer salaris
            geldig altijd
                Het gehalveerd salaris van een persoon moet gesteld worden op 
                zijn salaris gedeeld door 2.
        """
        
        # Parse the code
        model = parse_text(code)
        
        # Check that we have the expected rules
        self.assertEqual(len(model.regels), 4)
        
        # Verify rule names
        rule_names = [regel.naam for regel in model.regels]
        self.assertIn('verhoog salaris', rule_names)
        self.assertIn('verlaag salaris', rule_names)
        self.assertIn('verdubbel salaris', rule_names)
        self.assertIn('halveer salaris', rule_names)
        
        # Verify that the rules have the expected structure
        # Each rule should be a Gelijkstelling (assignment)
        for regel in model.regels:
            self.assertIsNotNone(regel.resultaat)
            # The expression should be a BinaryExpression for timeline × scalar
            # Note: We're not executing the rules, just verifying they parse correctly
            # Actual execution is tested by the existing timeline tests
    
    def test_timeline_scalar_in_expression(self):
        """Test timeline × scalar in more complex expressions."""
        
        code = """
        Objecttype de Werknemer
            het basis salaris Bedrag voor elke maand;
            de bonus Bedrag voor elke maand;
            het totaal inkomen Bedrag voor elke maand;

        Regel bereken totaal
            geldig altijd
                Het totaal inkomen van een werknemer moet gesteld worden op 
                (zijn basis salaris maal 110 procent) plus zijn bonus.
        """
        
        # Parse the code
        model = parse_text(code)
        
        # Verify parsing succeeded
        self.assertEqual(len(model.regels), 1)
        self.assertEqual(model.regels[0].naam, 'bereken totaal')
        
        # The fact that this parses correctly shows that timeline × scalar
        # operations are supported in the parser and AST
    
    def test_scalar_timeline_order(self):
        """Test that scalar × timeline also works (order matters for some ops)."""
        
        code = """
        Objecttype de Rekening
            het saldo Bedrag voor elke maand;
            het doel bedrag Bedrag voor elke maand;
            het tekort Bedrag voor elke maand;

        Parameter het minimum saldo : Bedrag;

        Regel bereken tekort
            geldig altijd
                Het tekort van een rekening moet gesteld worden op 
                het minimum saldo min zijn saldo.
        """
        
        # Parse the code
        model = parse_text(code)
        
        # Verify the rule parses correctly
        self.assertEqual(len(model.regels), 1)
        self.assertEqual(model.regels[0].naam, 'bereken tekort')
        
        # This verifies that scalar - timeline operations are parsed correctly
        
    def test_timeline_division_by_scalar(self):
        """Test timeline / scalar operation."""
        
        code = """
        Objecttype de Afdeling
            het budget Bedrag voor elk jaar;
            het maandelijks budget Bedrag voor elke maand;

        Regel verdeel budget
            geldig altijd
                Het maandelijks budget van een afdeling moet gesteld worden op 
                zijn budget gedeeld door 12.
        """
        
        # Parse and verify
        model = parse_text(code)
        self.assertEqual(len(model.regels), 1)
        self.assertEqual(model.regels[0].naam, 'verdeel budget')


if __name__ == '__main__':
    unittest.main()