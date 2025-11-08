"""Test suite for Tekstreeks (Text Sequences) feature (spec §5.4).

Tests text interpolation using « » markers including:
- Plain strings without interpolation
- Simple expression interpolation
- Multiple interpolations
- Type conversions (numeric, date, boolean to text)
- Null handling
- Escaped characters
"""
import unittest
from datetime import date
from tests.test_base import RegelSpraakTestCase
from src.regelspraak.parsing import parse_text as parse_regelspraak
from src.regelspraak.runtime import RuntimeContext, Value
from src.regelspraak.engine import Evaluator


class TestTekstreeksBasics(RegelSpraakTestCase):
    """Test basic Tekstreeks functionality."""

    def test_plain_string_without_interpolation(self):
        """Test that plain strings work as before."""
        regelspraak = """
        Objecttype de Test
            het resultaat Tekst;

        Regel Test plain string
            geldig altijd
                Het resultaat van de test moet berekend worden als "Dit is een gewone tekst".
        """

        model = parse_regelspraak(regelspraak)
        self.assertIsNotNone(model)

        context = RuntimeContext(domain_model=model)
        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        # Check the attribute was set correctly
        self.assertEqual(test.attributen["resultaat"].value, "Dit is een gewone tekst")
        self.assertEqual(test.attributen["resultaat"].datatype, "Tekst")

    def test_simple_interpolation(self):
        """Test simple expression interpolation."""
        regelspraak = """
        Objecttype de Test
            het resultaat Tekst;

        Parameter het nummer : Numeriek

        Regel Test interpolation
            geldig altijd
                Het resultaat van de test moet berekend worden als "Het nummer is «het nummer»".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)
        context.set_parameter("nummer", Value(42, "Numeriek", None))

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        # Check the interpolated result
        self.assertEqual(test.attributen["resultaat"].value, "Het nummer is 42")

    def test_multiple_interpolations(self):
        """Test multiple interpolations in one string."""
        regelspraak = """
        Objecttype de Test
            het resultaat Tekst;

        Parameter de naam : Tekst
        Parameter de leeftijd : Numeriek

        Regel Test multiple interpolations
            geldig altijd
                Het resultaat van de test moet berekend worden als "«de naam» is «de leeftijd» jaar oud".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)
        context.set_parameter("naam", Value("Jan", "Tekst", None))
        context.set_parameter("leeftijd", Value(25, "Numeriek", None))

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        self.assertEqual(test.attributen["resultaat"].value, "Jan is 25 jaar oud")

    def test_expression_evaluation_in_interpolation(self):
        """Test that expressions are evaluated within interpolation."""
        regelspraak = """
        Objecttype de Test
            het resultaat Tekst;

        Parameter het nummer : Numeriek

        Regel Test expression evaluation
            geldig altijd
                Het resultaat van de test moet berekend worden als "10 plus 5 is «het nummer plus 5»".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)
        context.set_parameter("nummer", Value(10, "Numeriek", None))

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        self.assertEqual(test.attributen["resultaat"].value, "10 plus 5 is 15")


class TestTekstreeksTypeConversions(RegelSpraakTestCase):
    """Test type conversions in Tekstreeks interpolation."""

    def test_numeric_to_text_conversion(self):
        """Test numeric values are converted to text."""
        regelspraak = """
        Objecttype de Test
            het resultaat Tekst;

        Parameter het bedrag : Numeriek

        Regel Test numeric conversion
            geldig altijd
                Het resultaat van de test moet berekend worden als "Het bedrag is €«het bedrag»".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)
        context.set_parameter("bedrag", Value(1234.56, "Numeriek", None))

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        # Should use Dutch decimal separator
        self.assertIn("1234,56", test.attributen["resultaat"].value)

    def test_date_to_text_conversion(self):
        """Test date values are converted to text."""
        regelspraak = """
        Objecttype de Test
            de geboortedatum Datum in dagen;
            het resultaat Tekst;

        Regel Test date conversion
            geldig altijd
                De geboortedatum van de test moet berekend worden als 15-03-1990.

        Regel Format date
            geldig altijd
                Het resultaat van de test moet berekend worden als
                    "Geboren op «de geboortedatum van de test»".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)

        # Create test object
        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        self.assertIn("15-03-1990", test.attributen["resultaat"].value)

    def test_boolean_to_text_conversion(self):
        """Test boolean values are converted to Dutch text."""
        regelspraak = """
        Objecttype de Test
            het resultaat Tekst;

        Parameter de conditie : Boolean

        Regel Test boolean conversion
            geldig altijd
                Het resultaat van de test moet berekend worden als "De conditie is «de conditie»".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)
        context.set_parameter("conditie", Value(True, "Boolean", None))

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        self.assertEqual(test.attributen["resultaat"].value, "De conditie is waar")

    def test_percentage_to_text_conversion(self):
        """Test percentage values are converted to text."""
        regelspraak = """
        Objecttype de Test
            het resultaat Tekst;

        Parameter het percentage : Percentage

        Regel Test percentage conversion
            geldig altijd
                Het resultaat van de test moet berekend worden als "BTW is «het percentage»".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)
        context.set_parameter("percentage", Value(0.21, "Percentage", None))

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        # Accept either 21% or 21.0% format
        result = test.attributen["resultaat"].value
        self.assertTrue("21%" in result or "21.0%" in result, f"Expected 21% or 21.0% in '{result}'")


class TestTekstreeksNullHandling(RegelSpraakTestCase):
    """Test null value handling in Tekstreeks."""

    def test_null_value_becomes_empty_string(self):
        """Test that null values become empty strings."""
        regelspraak = """
        Objecttype de Test
            het resultaat Tekst;

        Parameter de optionele waarde : Numeriek

        Regel Test null handling
            geldig altijd
                Het resultaat van de test moet berekend worden als "Waarde: «de optionele waarde»!".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)
        # Set optionele waarde to None to ensure it exists but is null
        context.set_parameter("optionele waarde", None)

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        self.assertEqual(test.attributen["resultaat"].value, "Waarde: !")


class TestTekstreeksWithObjects(RegelSpraakTestCase):
    """Test Tekstreeks with object attributes."""

    def test_object_attribute_interpolation(self):
        """Test interpolating object attributes."""
        regelspraak = """
        Objecttype de Test
            de voornaam Tekst;
            de achternaam Tekst;
            de leeftijd Numeriek;
            het resultaat Tekst;

        Regel Initialiseer voornaam
            geldig altijd
                De voornaam van de test moet berekend worden als "Jan".

        Regel Initialiseer achternaam
            geldig altijd
                De achternaam van de test moet berekend worden als "Jansen".

        Regel Initialiseer leeftijd
            geldig altijd
                De leeftijd van de test moet berekend worden als 30.

        Regel Maak beschrijving
            geldig altijd
                Het resultaat van de test moet berekend worden als
                    "«de voornaam van de test» «de achternaam van de test» is «de leeftijd van de test» jaar".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        self.assertEqual(test.attributen["resultaat"].value, "Jan Jansen is 30 jaar")


class TestTekstreeksEdgeCases(RegelSpraakTestCase):
    """Test edge cases in Tekstreeks."""

    def test_empty_interpolation(self):
        """Test empty string interpolation."""
        regelspraak = """
        Objecttype de Test
            het resultaat Tekst;

        Regel Test empty interpolation
            geldig altijd
                Het resultaat van de test moet berekend worden als "".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        self.assertEqual(test.attributen["resultaat"].value, "")

    def test_escaped_characters(self):
        """Test escaped characters in Tekstreeks."""
        regelspraak = r'''
        Objecttype de Test
            het resultaat Tekst;

        Regel Test escaped characters
            geldig altijd
                Het resultaat van de test moet berekend worden als "Dit heeft \"aanhalingstekens\" erin".
        '''

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        # Note: escaped quotes are preserved as \\" in the output
        self.assertIn('\\"aanhalingstekens\\"', test.attributen["resultaat"].value)

    def test_adjacent_interpolations(self):
        """Test adjacent interpolations without text between them."""
        regelspraak = """
        Objecttype de Test
            het resultaat Tekst;

        Parameter het eerste : Tekst
        Parameter het tweede : Tekst

        Regel Test adjacent interpolations
            geldig altijd
                Het resultaat van de test moet berekend worden als "«het eerste»«het tweede»".
        """

        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)
        context.set_parameter("eerste", Value("Hallo", "Tekst", None))
        context.set_parameter("tweede", Value("Wereld", "Tekst", None))

        test = context.create_object("Test")
        context.add_object(test)

        engine = Evaluator(context)
        results = engine.execute_model(model)

        self.assertEqual(test.attributen["resultaat"].value, "HalloWereld")


if __name__ == '__main__':
    unittest.main()