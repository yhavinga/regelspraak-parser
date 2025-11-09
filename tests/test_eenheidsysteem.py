"""Test Eenheidsysteem (unit system) parsing and runtime registration."""

from tests.test_base import RegelSpraakTestCase
import unittest
import sys
sys.path.insert(0, 'src')

from regelspraak import parse_text
from regelspraak.runtime import RuntimeContext
from decimal import Decimal

class EenheidSysteemTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Parse the whole document, focus is on eenheidsysteem
        cls.parser_rule = 'regelSpraakDocument'

    def test_eenheidsysteem_definitions(self):
        """Test parsing various Eenheidsysteem definitions."""
        tree = self.parse_file('eenheidsysteem.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()
        # Optional: Add assertions about the tree structure

    def test_simplified_eenheidsysteem(self):
        """Test parsing a simplified Eenheidsysteem definition with custom identifiers."""
        tree = self.parse_file('test_eenheidsysteem_specialized.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_eenheidsysteem_runtime_registration(self):
        """Test that Eenheidsysteem definitions are registered in RuntimeContext."""
        script = """
        Eenheidsysteem Tijd
            de milliseconde ms = /1000 s
            de seconde s = /60 minuut
            de minuut minuut = /60 u
            het uur u = /24 dg
            de dag dg
            de week wk = 7 dg
            de maand mnd
            het kwartaal kw = 3 mnd
            het jaar jr = 12 mnd

        Eenheidsysteem Valuta
            de euro (mv: euros) EUR €

        Eenheidsysteem afstand
            de meter (mv: meters) m
            de kilometer (mv: kilometers) km = 1000 m

        Parameter de test waarde: Numeriek (geheel getal) met eenheid km
        """

        model = parse_text(script)
        context = RuntimeContext(domain_model=model)

        # Check that unit systems were registered
        self.assertIn("Tijd", context.unit_registry.systems)
        self.assertIn("Valuta", context.unit_registry.systems)
        self.assertIn("afstand", context.unit_registry.systems)

        # Check specific units
        tijd_system = context.unit_registry.systems["Tijd"]
        self.assertIn("uur", tijd_system.base_units)
        self.assertIn("dag", tijd_system.base_units)
        self.assertIn("milliseconde", tijd_system.base_units)

        # Check "het uur" is properly registered
        uur_unit = tijd_system.base_units["uur"]
        self.assertEqual(uur_unit.name, "uur")
        self.assertEqual(uur_unit.abbreviation, "u")
        # Verify conversion factor (1 hour = 3600 seconds, but stored as /24 day)
        # Since the spec says "het uur u = /24 dg", it's 1/24 of a day
        self.assertEqual(uur_unit.to_base_factor, Decimal("3600"))

        # Check kilometer has proper conversion
        afstand_system = context.unit_registry.systems["afstand"]
        km_unit = afstand_system.base_units["kilometer"]
        self.assertEqual(km_unit.to_base_factor, Decimal("1000"))

    def test_het_article_parsing(self):
        """Test that 'het' article is parsed correctly in unit definitions."""
        script = """
        Eenheidsysteem TestSysteem
            het uur u = /24 dg
            het kwartaal kw = 3 mnd
        """

        model = parse_text(script)
        self.assertIn("TestSysteem", model.eenheidsystemen)

        system = model.eenheidsystemen["TestSysteem"]
        self.assertEqual(len(system.units), 2)

        # Check that "het uur" has correct article
        for unit in system.units:
            if unit.unit_name == "uur":
                self.assertEqual(unit.article, "het")
            elif unit.unit_name == "kwartaal":
                self.assertEqual(unit.article, "het")

    def test_unit_conversion_factors(self):
        """Test that conversion factors are correctly parsed."""
        script = """
        Eenheidsysteem TestConversions
            de milliseconde ms = /1000 s
            de kilometer km = 1000 m
        """

        model = parse_text(script)
        system = model.eenheidsystemen["TestConversions"]

        # Check fraction conversion (divide)
        for unit in system.units:
            if unit.unit_name == "milliseconde":
                self.assertTrue(unit.conversion_fraction)
                self.assertEqual(unit.conversion_factor, 1000.0)
                self.assertEqual(unit.conversion_target, "s")
            elif unit.unit_name == "kilometer":
                self.assertFalse(unit.conversion_fraction)
                self.assertEqual(unit.conversion_factor, 1000.0)
                self.assertEqual(unit.conversion_target, "m")

if __name__ == '__main__':
    unittest.main()
