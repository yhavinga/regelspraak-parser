"""Test decision table navigation through relationships."""

import unittest
from datetime import date
from decimal import Decimal
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.semantics import SemanticAnalyzer


class TestBeslistabelNavigation(unittest.TestCase):
    """Test navigation in decision tables, especially with compound attributes."""

    def test_compound_attribute_navigation(self):
        """Test navigation with compound attribute names like 'belasting op basis van reisduur'."""
        # Create a minimal test case
        rs_code = """
// Define object types
Objecttype de Natuurlijk persoon
    de geboortedatum Datum;
    de leeftijd Numeriek(geheel getal) met eenheid jr;
    de woonprovincie Tekst;
    de belasting op basis van afstand Bedrag;
    de belasting op basis van reisduur Bedrag;

Objecttype de Vlucht
    de reisduur per trein Numeriek met eenheid min;
    de afstand tot bestemming Numeriek met eenheid km;

// Define relationship
Feittype vlucht van natuurlijke personen
    de reis	Vlucht
    de passagier	Natuurlijk persoon
    één reis betreft de verplaatsing van één passagier

// Parameters
Parameter het percentage reisduur tweede schijf: Percentage
Parameter de bovengrens reisduur eerste schijf: Numeriek(geheel getal) met eenheid min
Parameter de bovengrens reisduur tweede schijf: Numeriek(geheel getal) met eenheid min

// Decision table with compound attribute name and navigation
Beslistabel Belasting op basis van reisduur
    geldig altijd

| | de belasting op basis van reisduur van een passagier moet gesteld worden op | indien de reisduur per trein van zijn reis groter is dan | indien de reisduur per trein van zijn reis kleiner of gelijk is aan |
|---|---|---|---|
| 1 | 0 € | n.v.t. | de bovengrens reisduur eerste schijf |
| 2 | het percentage reisduur tweede schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen | de bovengrens reisduur eerste schijf | de bovengrens reisduur tweede schijf |
| 3 | 100 € | de bovengrens reisduur tweede schijf | n.v.t. |
"""

        # Parse the RegelSpraak code
        ast = parse_text(rs_code)

        # Perform semantic analysis
        analyzer = SemanticAnalyzer()
        analyzer.analyze(ast)

        # Create runtime context
        context = RuntimeContext(ast)

        # Set parameters
        context.set_parameter('percentage reisduur tweede schijf', Value(15, 'Percentage', None))
        context.set_parameter('bovengrens reisduur eerste schijf', Value(120, 'Numeriek(geheel getal)', 'min'))
        context.set_parameter('bovengrens reisduur tweede schijf', Value(240, 'Numeriek(geheel getal)', 'min'))

        # Create passenger
        passenger = RuntimeObject('Natuurlijk persoon')
        context.add_object(passenger)
        context.set_attribute(passenger, 'geboortedatum', Value(date(1985, 3, 15), 'Datum', None))
        context.set_attribute(passenger, 'woonprovincie', Value('Noord-Holland', 'Tekst', None))
        context.set_attribute(passenger, 'belasting op basis van afstand', Value(Decimal('50.00'), 'Bedrag', '€'))

        # Create flight
        flight = RuntimeObject('Vlucht')
        context.add_object(flight)
        context.set_attribute(flight, 'reisduur per trein', Value(180, 'Numeriek', 'min'))
        context.set_attribute(flight, 'afstand tot bestemming', Value(450, 'Numeriek', 'km'))

        # Create relationship between passenger and flight
        context.add_relationship(
            feittype_naam='vlucht van natuurlijke personen',
            subject=flight,  # flight is the subject (reis)
            object=passenger,  # passenger is the object (passagier)
            preposition='VAN'
        )

        # Create evaluator and execute
        evaluator = Evaluator(context)
        evaluator.execute_model(ast)

        # Check that the compound attribute was set correctly
        tax_value = context.get_attribute(passenger, 'belasting op basis van reisduur')

        self.assertIsNotNone(tax_value,
                           "Decision table should set 'belasting op basis van reisduur' attribute")

        # Expected: 15% of 50.00 = 7.50, rounded down to 7.0
        expected_tax = 7.0
        actual_tax = float(tax_value.value) if tax_value else 0.0

        self.assertAlmostEqual(actual_tax, expected_tax, places=1,
                              msg=f"Expected tax {expected_tax}, got {actual_tax}")

    def test_navigation_with_possessive_pronouns(self):
        """Test that possessive pronouns (zijn/haar/hun) are handled correctly in navigation."""
        rs_code = """
Objecttype de Persoon
    de naam Tekst;
    het basisinkomen Bedrag;
    de toelage Bedrag;

Objecttype de Werkgever
    de naam Tekst;
    het salarisniveau Numeriek;

Feittype werkrelatie tussen persoon en werkgever
    de persoon	Persoon
    de werkgever	Werkgever
    één persoon heeft één werkgever

// Test "van haar" pattern
Beslistabel Toelage berekening
    geldig altijd

| | de toelage van een persoon moet gesteld worden op | indien het salarisniveau van haar werkgever groter is dan |
|---|---|---|
| 1 | 100 € | 1 |
| 2 | 200 € | 2 |
"""

        # Parse the RegelSpraak code
        ast = parse_text(rs_code)

        # Perform semantic analysis
        analyzer = SemanticAnalyzer()
        analyzer.analyze(ast)

        # Create runtime context
        context = RuntimeContext(ast)

        # Create person (female context implied by "haar")
        person = RuntimeObject('Persoon')
        context.add_object(person)
        context.set_attribute(person, 'naam', Value('Maria', 'Tekst', None))
        context.set_attribute(person, 'basisinkomen', Value(Decimal('2000'), 'Bedrag', '€'))

        # Create employer
        employer = RuntimeObject('Werkgever')
        context.add_object(employer)
        context.set_attribute(employer, 'naam', Value('Bedrijf B.V.', 'Tekst', None))
        context.set_attribute(employer, 'salarisniveau', Value(3, 'Numeriek', None))

        # Create relationship between person and employer
        context.add_relationship(
            feittype_naam='werkrelatie tussen persoon en werkgever',
            subject=person,  # person is the subject
            object=employer,  # employer is the object
            preposition='TUSSEN'
        )

        # Create evaluator and execute
        evaluator = Evaluator(context)
        evaluator.execute_model(ast)

        # Check that navigation worked despite "haar" pronoun
        toelage_value = context.get_attribute(person, 'toelage')

        self.assertIsNotNone(toelage_value,
                        "Decision table should set 'toelage' attribute")

        # Decision tables use "first matching row" semantics
        # Since salarisniveau=3, row 1 (3>1) matches first, giving 100€
        expected_toelage = 100.0
        actual_toelage = float(toelage_value.value) if toelage_value else 0.0

        self.assertEqual(actual_toelage, expected_toelage,
                        "Decision table should navigate through 'haar werkgever' correctly")


if __name__ == '__main__':
    unittest.main()