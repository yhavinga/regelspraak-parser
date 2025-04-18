import unittest
from tests.test_base import RegelSpraakTestCase

class RegelPhraseTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regel' # Test within the context of a 'regel'

    # --- Tests for Currently Used Phrase Tokens ---

    def test_is_gelijk_aan(self):
        """Tests 'is gelijk aan' used in objectVergelijking."""
        input_text = """Regel check status
            geldig altijd
                Het resultaat is WAAR
                indien de status is gelijk aan 'Actief'.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_is_ongelijk_aan(self):
        """Tests 'is ongelijk aan' used in objectVergelijking."""
        input_text = """Regel check niet-actief
            geldig altijd
                Het resultaat is WAAR
                indien de status is ongelijk aan 'Actief'.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_is_kleiner_dan(self):
        """Tests 'is kleiner dan' used in comparisonOp/getalVergelijking."""
        input_text = """Regel check leeftijd laag
            geldig altijd
                Het resultaat is WAAR
                indien de leeftijd is kleiner dan 18.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_is_kleiner_of_gelijk_aan(self):
        """Tests 'is kleiner of gelijk aan' used in comparisonOp/getalVergelijking."""
        input_text = """Regel check maximum leeftijd
            geldig altijd
                Het resultaat is WAAR
                indien de leeftijd is kleiner of gelijk aan 65.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    # --- Placeholder Tests for Unused Phrase Tokens (Require Grammar Updates) ---

    def test_zijn_groter_dan_hypothetical(self):
        """Hypothetical test for 'zijn groter dan'."""
        input_text = """Regel check bedragen
            geldig altijd
                Het resultaat is WAAR
                indien de bedragen zijn groter dan 100.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_is_leeg_hypothetical(self):
        """Hypothetical test for 'is leeg'. """
        input_text = """Regel check veld
            geldig altijd
                Het resultaat is WAAR
                indien het adres is leeg.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_is_gevuld_hypothetical(self):
        """Hypothetical test for 'is gevuld'. """
        input_text = """Regel check invoer
            geldig altijd
                Het resultaat is WAAR
                indien de invoer is gevuld.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_voldoet_aan_elfproef_hypothetical(self):
        """Hypothetical test for 'voldoet aan de elfproef'. """
        input_text = """Regel check BSN
            geldig altijd
                Het resultaat is WAAR
                indien het BSN voldoet aan de elfproef.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_is_numeriek_met_exact_hypothetical(self):
        """Hypothetical test for 'is numeriek met exact'. """
        input_text = """Regel check postcode format
            geldig altijd
                Het resultaat is WAAR
                indien de postcode is numeriek met exact 4 cijfers.
        """
        # Note: Grammar would need to handle "4 cijfers" part too.
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_is_een_dagsoort_hypothetical(self):
        """Hypothetical test for 'is een <Dagsoort>'. """
        input_text = """Regel check werkdag
            geldig altijd
                Het resultaat is WAAR
                indien de datum is een Werkdag.
        """
        # Note: Assumes 'Werkdag' is a defined Dagsoort identifier.
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_moeten_uniek_zijn_hypothetical(self):
        """Hypothetical test for 'moeten uniek zijn'. """
        input_text = """Regel check unieke emails
            geldig altijd
                Het resultaat is WAAR
                indien de email adressen moeten uniek zijn.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_is_gevuurd_hypothetical(self):
        """Hypothetical test for 'is gevuurd'. """
        input_text = """Regel check afhankelijkheid
            geldig altijd
                Het resultaat is WAAR
                indien Regel Basis Berekening is gevuurd.
        """
        # Note: Grammar needs to handle rule name references here.
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_is_inconsistent_hypothetical(self):
        """Hypothetical test for 'is inconsistent'. """
        input_text = """Regel check data validiteit
            geldig altijd
                De data is valide
                indien de invoer data is inconsistent.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()


if __name__ == '__main__':
    unittest.main()