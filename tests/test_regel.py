from tests.test_base import RegelSpraakTestCase

class RegelTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regel'

    def test_regel_file(self):
        """Test parsing a complete file with rule definitions."""
        tree = self.parse_file('regel.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_simple_regel(self):
        """Test parsing a simple rule with calculation."""
        input_text = """Regel bereken totaal
            geldig altijd
                Het totaal moet berekend worden als de som van alle bedragen.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_with_condition(self):
        """Test parsing a rule with a condition."""
        input_text = """Regel check leeftijd
            geldig altijd
                Een persoon is minderjarig
                indien zijn leeftijd kleiner is dan 18.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_with_validity_period(self):
        """Test parsing a rule with a validity period."""
        input_text = """Regel nieuwe regeling
            geldig vanaf 01-01-2024 t/m 31-12-2024
                Het tarief moet gesteld worden op 21.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_with_open_validity(self):
        """Test parsing a rule with an open-ended validity period (vanaf)."""
        input_text = """Regel nieuwe regeling start
            geldig vanaf 15-07-2023
                Het starttarief moet gesteld worden op 10.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_with_complex_conditions(self):
        """Test parsing a rule with complex conditions."""
        input_text = """Regel bepaal korting
            geldig altijd
                Een klant heeft een recht op korting
                indien hij aan alle volgende voorwaarden voldoet:
                • zijn leeftijd is groter of gelijk aan 65
                • het totaal bedrag is groter dan 100.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_with_variables(self):
        """Test parsing a rule with variable definitions."""
        input_text = """Regel bereken netto
            geldig altijd
                Het netto bedrag moet berekend worden als het bruto bedrag min de korting.
                Daarbij geldt:
                de korting is 10 procent van het bruto bedrag;
        ."""
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_met_stelling(self):
        """Test parsing a rule using 'wordt gesteld op' for direct assignment."""
        input_text = """Regel stel standaard waarde
            geldig altijd
                Het standaard tarief moet gesteld worden op 25.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_with_multiple_variables(self):
        """Test parsing a rule with multiple variable definitions."""
        input_text = """Regel bereken complex netto
            geldig altijd
                Het complex netto bedrag moet berekend worden als het bruto bedrag verminderd met de totale aftrek.
                Daarbij geldt:
                de basis korting is 10 procent van het bruto bedrag;
                de extra aftrek is 5;
                de bonus is 2;
                de totale aftrek is de basis korting plus de extra aftrek min de bonus;
        ."""
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

if __name__ == '__main__':
    unittest.main() 