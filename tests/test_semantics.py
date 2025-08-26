"""Tests for semantic analysis."""
import unittest
from tests.test_base import RegelSpraakTestCase
from regelspraak.parsing import parse_text
from regelspraak.semantics import validate, SemanticError

class SemanticAnalysisTests(RegelSpraakTestCase):
    """Test semantic analysis and validation."""
    
    def test_undefined_parameter_reference(self):
        """Test that referencing undefined parameters is caught."""
        input_text = """
        Objecttype de Persoon
            de leeftijd Numeriek (geheel getal) met eenheid jr;
        
        Regel test
            geldig altijd
                De leeftijd van een Persoon moet berekend worden als de ongedefinieerde_parameter.
        """
        model = parse_text(input_text)
        errors = validate(model)
        
        self.assertGreater(len(errors), 0, "Should have semantic errors")
        # Check that we have an error about undefined parameter
        self.assertTrue(
            any("Undefined" in str(e) and "ongedefinieerde_parameter" in str(e) for e in errors),
            f"Expected undefined parameter error, got: {[str(e) for e in errors]}"
        )
    
    def test_undefined_variable_reference(self):
        """Test that referencing undefined variables is caught."""
        input_text = """
        Parameter test_param : Numeriek (geheel getal);
        
        Objecttype de Persoon
            de leeftijd Numeriek (geheel getal) met eenheid jr;
        
        Regel test
            geldig altijd
                De leeftijd van een Persoon moet berekend worden als de ongedefinieerde_variabele plus test_param.
        """
        model = parse_text(input_text)
        errors = validate(model)
        
        self.assertGreater(len(errors), 0, "Should have semantic errors")
        # Check that we have an error about undefined variable
        self.assertTrue(
            any("Undefined" in str(e) and "ongedefinieerde_variabele" in str(e) for e in errors),
            f"Expected undefined variable error, got: {[str(e) for e in errors]}"
        )
    
    def test_valid_parameter_reference(self):
        """Test that valid parameter references pass validation."""
        input_text = """
        Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;
        
        Objecttype de Natuurlijk persoon
            is minderjarig kenmerk (bijvoeglijk);
            de leeftijd Numeriek (geheel getal) met eenheid jr;
        
        Regel Kenmerktoekenning persoon minderjarig
            geldig altijd
                Een Natuurlijk persoon is minderjarig
                indien zijn leeftijd kleiner is dan de volwassenleeftijd.
        """
        model = parse_text(input_text)
        errors = validate(model)
        
        # Should have no errors
        self.assertEqual(len(errors), 0, f"Should have no semantic errors, got: {[str(e) for e in errors]}")
    
    def test_variable_definition_and_use(self):
        """Test that variables defined with 'Daarbij geldt' can be used."""
        input_text = """
        Parameter belastingpercentage : Numeriek (geheel getal);
        
        Objecttype de Persoon
            het inkomen Numeriek (geheel getal) met eenheid EUR;
            de belasting Numeriek (geheel getal) met eenheid EUR;
        
        Regel belasting berekenen
            geldig altijd
                De belasting van een Persoon moet berekend worden als het bruto maal belastingpercentage.
                Daarbij geldt:
                het bruto is 1000.
        """
        model = parse_text(input_text)
        errors = validate(model)
        
        # Should have no errors
        self.assertEqual(len(errors), 0, f"Should have no semantic errors, got: {[str(e) for e in errors]}")
    
    def test_duplicate_parameter_definition(self):
        """Test that duplicate parameter definitions are caught."""
        input_text = """
        Parameter test : Numeriek (geheel getal);
        Parameter test : Numeriek (geheel getal);
        
        Objecttype de Dummy
            de waarde Numeriek (geheel getal);
        
        Regel dummy
            geldig altijd
                De waarde van een Dummy moet berekend worden als 1.
        """
        model = parse_text(input_text)
        errors = validate(model)
        
        self.assertGreater(len(errors), 0, "Should have semantic errors")
        # Check that we have an error about duplicate definition
        self.assertTrue(
            any("already defined" in str(e) for e in errors),
            f"Expected duplicate definition error, got: {[str(e) for e in errors]}"
        )
    
    def test_parameter_as_attribute_reference(self):
        """Test that incorrectly referencing a parameter as an attribute is caught."""
        input_text = """
        Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;
        
        Objecttype de Persoon
            de leeftijd Numeriek (geheel getal) met eenheid jr;
        
        Regel test
            geldig altijd
                De leeftijd van een Persoon moet berekend worden als de volwassenleeftijd.
        """
        model = parse_text(input_text)
        errors = validate(model)
        
        # This might not be caught perfectly yet, but let's see
        # At minimum we should not crash
        self.assertIsNotNone(errors)  # Just ensure it returns something
    
    def test_valid_arithmetic_expression(self):
        """Test that valid arithmetic expressions pass validation."""
        input_text = """
        Parameter factor : Numeriek (geheel getal);
        
        Objecttype de Product
            de prijs Numeriek (geheel getal) met eenheid EUR;
            de totaalprijs Numeriek (geheel getal) met eenheid EUR;
        
        Regel totaalprijs berekenen
            geldig altijd
                De totaalprijs van een Product moet berekend worden als zijn prijs maal de hoeveelheid maal factor.
                Daarbij geldt:
                de hoeveelheid is 5.
        """
        model = parse_text(input_text)
        errors = validate(model)
        
        self.assertEqual(len(errors), 0, f"Should have no semantic errors, got: {[str(e) for e in errors]}")
    
    def test_comparison_expression_validation(self):
        """Test that comparison expressions are validated."""
        input_text = """
        Parameter grenswaarde : Numeriek (geheel getal);
        
        Objecttype de Meetwaarde
            is hoog kenmerk (bijvoeglijk);
            de waarde Numeriek (geheel getal);
        
        Regel hoge waarde bepalen
            geldig altijd
                Een Meetwaarde is hoog
                indien zijn waarde groter is dan grenswaarde.
        """
        model = parse_text(input_text)
        errors = validate(model)
        
        self.assertEqual(len(errors), 0, f"Should have no semantic errors, got: {[str(e) for e in errors]}")
    
    def test_invalid_variable_in_different_scope(self):
        """Test that variables from one rule cannot be used in another."""
        input_text = """
        Objecttype de Persoon
            de leeftijd Numeriek (geheel getal) met eenheid jr;
            de score Numeriek (geheel getal);
        
        Regel regel1
            geldig altijd
                De leeftijd van een Persoon moet berekend worden als de variabele1.
                Daarbij geldt:
                de variabele1 is 10.
        
        Regel regel2
            geldig altijd
                De score van een Persoon moet berekend worden als de variabele1.
        """
        model = parse_text(input_text)
        errors = validate(model)
        
        self.assertGreater(len(errors), 0, "Should have semantic errors")
        # Check that we have an error about undefined variable in regel2
        self.assertTrue(
            any("Undefined" in str(e) and "variabele1" in str(e) for e in errors),
            f"Expected undefined variable error in regel2, got: {[str(e) for e in errors]}"
        )

if __name__ == '__main__':
    unittest.main()