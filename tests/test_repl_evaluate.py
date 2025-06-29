"""Unit tests for REPL evaluate command functionality."""
import unittest
from io import StringIO
import sys

from src.regelspraak.parsing import parse_text
from src.regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from src.regelspraak.repl import ReplState, handle_evaluate


class TestReplEvaluate(unittest.TestCase):
    """Test the REPL evaluate command."""
    
    def setUp(self):
        """Set up test context with sample data."""
        # Create a simple model
        model_text = """
        Objecttype de Persoon (mv: personen)
            de leeftijd Numeriek (geheel getal) met eenheid jr;
            de belasting Numeriek (getal met 2 decimalen) met eenheid €;
            is minderjarig kenmerk (bijvoeglijk);
            is student kenmerk (bijvoeglijk);
        """
        
        self.model = parse_text(model_text)
        self.context = RuntimeContext(self.model)
        
        # Create test instances
        self.p1 = RuntimeObject("Persoon", instance_id="p1")
        self.context.add_object(self.p1)
        self.context.set_attribute(self.p1, "leeftijd", Value(25, "Numeriek", "jr"))
        self.context.set_attribute(self.p1, "belasting", Value(150.50, "Numeriek", "€"))
        self.context.set_kenmerk(self.p1, "minderjarig", False)
        self.context.set_kenmerk(self.p1, "student", True)
        
        self.p2 = RuntimeObject("Persoon", instance_id="p2")
        self.context.add_object(self.p2)
        self.context.set_attribute(self.p2, "leeftijd", Value(16, "Numeriek", "jr"))
        self.context.set_attribute(self.p2, "belasting", Value(0.0, "Numeriek", "€"))
        self.context.set_kenmerk(self.p2, "minderjarig", True)
        self.context.set_kenmerk(self.p2, "student", False)
        
        # Create REPL state
        self.state = ReplState()
        self.state.model = self.model
        self.state.context = self.context
        
        # Capture stdout
        self.stdout = StringIO()
        self.saved_stdout = sys.stdout
        sys.stdout = self.stdout
        
    def tearDown(self):
        """Restore stdout."""
        sys.stdout = self.saved_stdout
        
    def get_output(self):
        """Get captured output and reset buffer."""
        output = self.stdout.getvalue()
        self.stdout.truncate(0)
        self.stdout.seek(0)
        return output.strip()
        
    def test_kenmerk_check_true(self):
        """Test checking a kenmerk that is true."""
        handle_evaluate("p2 is minderjarig", self.state)
        self.assertEqual(self.get_output(), "waar")
        
    def test_kenmerk_check_false(self):
        """Test checking a kenmerk that is false."""
        handle_evaluate("p1 is minderjarig", self.state)
        self.assertEqual(self.get_output(), "onwaar")
        
    def test_kenmerk_check_negated_true(self):
        """Test negated kenmerk check (niet)."""
        handle_evaluate("p1 is niet minderjarig", self.state)
        self.assertEqual(self.get_output(), "waar")
        
    def test_kenmerk_check_negated_false(self):
        """Test negated kenmerk check that results in false."""
        handle_evaluate("p2 is niet minderjarig", self.state)
        self.assertEqual(self.get_output(), "onwaar")
        
    def test_attribute_access_with_unit(self):
        """Test accessing an attribute with unit."""
        handle_evaluate("p1.leeftijd", self.state)
        self.assertEqual(self.get_output(), "25 jr")
        
    def test_attribute_access_currency(self):
        """Test accessing currency attribute."""
        handle_evaluate("p2.belasting", self.state)
        self.assertEqual(self.get_output(), "0.0 €")
        
    def test_invalid_instance(self):
        """Test referencing non-existent instance."""
        handle_evaluate("p3 is minderjarig", self.state)
        self.assertEqual(self.get_output(), "Instance 'p3' not found")
        
    def test_invalid_instance_attribute(self):
        """Test accessing attribute on non-existent instance."""
        handle_evaluate("p3.leeftijd", self.state)
        self.assertEqual(self.get_output(), "Instance 'p3' not found")
        
    def test_invalid_attribute(self):
        """Test accessing non-existent attribute."""
        handle_evaluate("p1.salaris", self.state)
        output = self.get_output()
        self.assertIn("Error getting attribute 'salaris'", output)
        
    def test_unsupported_pattern(self):
        """Test unsupported expression patterns."""
        handle_evaluate("p1.leeftijd > 18", self.state)
        output = self.get_output()
        self.assertIn("Supported patterns:", output)
        self.assertIn("Instance kenmerk check", output)
        self.assertIn("Instance attribute access", output)
        
    def test_kenmerk_undefined(self):
        """Test checking undefined kenmerk (should return false per spec)."""
        handle_evaluate("p1 is onbekend", self.state)
        self.assertEqual(self.get_output(), "onwaar")
        
    def test_multiple_word_kenmerk(self):
        """Test kenmerk check with is niet pattern."""
        handle_evaluate("p1 is student", self.state)
        self.assertEqual(self.get_output(), "waar")
        
        handle_evaluate("p1 is niet student", self.state)
        self.assertEqual(self.get_output(), "onwaar")


if __name__ == '__main__':
    unittest.main()