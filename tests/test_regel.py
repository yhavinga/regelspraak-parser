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
                Het totaal van een factuur moet berekend worden als de som van alle bedragen van de factuur.
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
                Het tarief van een product moet gesteld worden op 21.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_with_open_validity(self):
        """Test parsing a rule with an open-ended validity period (vanaf)."""
        input_text = """Regel nieuwe regeling start
            geldig vanaf 15-07-2023
                Het starttarief van een dienst moet gesteld worden op 10.
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
                Het netto bedrag van een factuur moet berekend worden als het bruto bedrag van de factuur min A.
                Daarbij geldt:
                A is 10 procent van het bruto bedrag van de factuur.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_met_stelling(self):
        """Test parsing a rule using 'wordt gesteld op' for direct assignment."""
        input_text = """Regel stel standaard waarde
            geldig altijd
                Het standaard tarief van een product moet gesteld worden op 25.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_with_multiple_variables(self):
        """Test parsing a rule with multiple variable definitions."""
        input_text = """Regel bereken complex netto
            geldig altijd
                Het complex netto bedrag van een factuur moet berekend worden als het bruto bedrag van de factuur verminderd met A.
                Daarbij geldt:
                B is 10 procent van het bruto bedrag van de factuur;
                C is 5;
                D is 2;
                A is B plus C min D.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()

    def test_regel_verminderd_met(self):
        """Test parsing a rule using the 'verminderd met' operator."""
        tree = self.parse_file('regel_verminderd_met.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_regel_mult_div(self):
        """Test parsing rules with multiplication and division operators."""
        tree = self.parse_file('regel_mult_div.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_regel_pow(self):
        """Test parsing rules with the exponentiation operator ('tot de macht')."""
        tree = self.parse_file('regel_pow.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_regel_datetime_formats(self):
        """Test parsing rules with different date and date/time literal formats."""
        tree = self.parse_file('regel_datetime.rs')
        self.assertIsNotNone(tree)
        self.assertNoParseErrors()

    def test_regel_wortel_van(self):
        """Test parsing a rule using 'de wortel van' function."""
        input_text = """Regel bereken wortel
            geldig altijd
                Het resultaat van een berekening moet berekend worden als de wortel van het invoer getal van de berekening.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        self.assertIsNotNone(tree)

    def test_regel_absolute_waarde_van(self):
        """Test parsing a rule using 'de absolute waarde van' function."""
        input_text = """Regel bereken absolute waarde
            geldig altijd
                Het resultaat van een berekening moet berekend worden als de absolute waarde van (-5).
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        self.assertIsNotNone(tree)

    def test_regel_jaar_uit(self):
        """Test parsing a rule using 'het jaar uit' function."""
        input_text = """Regel haal_jaar_op
            geldig altijd
                Het geboortejaar van een persoon moet berekend worden als het jaar uit de geboortedatum van de persoon.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        self.assertIsNotNone(tree)

    def test_regel_maand_uit(self):
        """Test parsing a rule using 'de maand uit' function."""
        input_text = """Regel haal_maand_op
            geldig altijd
                De geboortemaand van een persoon moet berekend worden als de maand uit de geboortedatum van de persoon.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        self.assertIsNotNone(tree)

    def test_regel_dag_uit(self):
        """Test parsing a rule using 'de dag uit' function."""
        input_text = """Regel haal_dag_op
            geldig altijd
                De geboortedag van een persoon moet berekend worden als de dag uit de geboortedatum van de persoon.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        self.assertIsNotNone(tree)

    def test_regel_min_waarde(self):
        """Tests parsing a rule using 'minimale waarde van'."""
        rule_text = """
        Regel Bepaal Minimum
        geldig altijd
            Het resultaat van een vergelijking moet berekend worden als de minimale waarde van 10, 5, 8 en 12.
        """
        tree = self.parse_text(rule_text)
        self.assertNoParseErrors()

    def test_regel_max_waarde(self):
        """Tests parsing a rule using 'maximale waarde van'."""
        rule_text = """
        Regel Bepaal Maximum
        geldig altijd
            Het resultaat van een vergelijking moet berekend worden als de maximale waarde van 10, 5, 8 en 12.
        """
        tree = self.parse_text(rule_text)
        self.assertNoParseErrors()

    def test_regel_aantal(self):
        """Tests parsing a rule using 'het aantal'."""
        rule_text = """
        Regel Bepaal Aantal
        geldig altijd
            Het aantal personen van een groep moet berekend worden als het aantal personen van de groep.
        """
        tree = self.parse_text(rule_text)
        self.assertNoParseErrors()

    def test_regel_concatenatie(self):
        """Tests parsing a rule using string concatenation with 'en' and 'of'."""
        # Test with 'de concatenatie van' syntax
        rule_text_with_keyword = """
        Regel String Concatenatie Met Keyword
        geldig altijd
            De volledige naam van een persoon moet berekend worden als de concatenatie van de voornaam van de persoon, de tussenvoegsel van de persoon en de achternaam van de persoon.
        """
        tree = self.parse_text(rule_text_with_keyword)
        self.assertNoParseErrors()

        # Test with simple concatenation using 'en'
        rule_text_with_en = """
        Regel String Concatenatie Met En
        geldig altijd
            De naam van een persoon moet berekend worden als de voornaam van de persoon, de tussenvoegsel van de persoon en de achternaam van de persoon.
        """
        tree = self.parse_text(rule_text_with_en)
        self.assertNoParseErrors()

        # Test with simple concatenation using 'of'
        rule_text_with_of = """
        Regel String Concatenatie Met Of
        geldig altijd
            Het adres van een locatie moet berekend worden als de straat van de locatie, het nummer van de locatie of de postcode van de locatie.
        """
        tree = self.parse_text(rule_text_with_of)
        self.assertNoParseErrors()

    def test_regel_conditie_bij_expressie_gedurende(self):
        """Tests parsing TOTAAL_VAN with 'gedurende de tijd dat' condition."""
        rule_text = """
        Regel Bereken Totaal Inkomen Periode
        geldig altijd
            het totaal inkomen van een persoon moet berekend worden als het totaal van het maandinkomen van de persoon
            gedurende de tijd dat de status van de persoon gelijk is aan 'Actief'.
        """
        # Note: Assumes `toplevelElementaireVoorwaarde` or `toplevelSamengesteldeVoorwaarde` can parse "de status gelijk is aan 'Actief'"
        # This might require further grammar refinement or a simpler condition for the test
        tree = self.parse_text(rule_text)
        self.assertNoParseErrors()

    def test_regel_conditie_bij_expressie_periode(self):
        """Tests parsing TOTAAL_VAN with a date range condition."""
        rule_text = """
        Regel Bereken Totaal Bedrag In Q1
        geldig altijd
            het kwartaal bedrag van een rapportage moet berekend worden als het totaal van het bedrag van de rapportage
            vanaf 01-01-2024 tot en met 31-03-2024.
        """
        tree = self.parse_text(rule_text)
        self.assertNoParseErrors()

    def test_regel_aantal_dagen_in(self):
        """Tests parsing 'het aantal dagen in' function."""
        rule_text_maand = """
        Regel Aantal Dagen Maand
        geldig altijd
            het aantal dagen in maand van een persoon moet berekend worden als het aantal dagen in de maand dat de referentiedatum van de persoon.
        """
        tree = self.parse_text(rule_text_maand)
        self.assertNoParseErrors()

    def test_regel_tijdsevenredig_deel(self):
        """Tests parsing 'het tijdsevenredig deel per' function."""
        # Using a simpler pattern that focuses on just validating the function is recognized
        rule_text_simplified = """
        Regel Tijdsevenredig Deel
        geldig altijd
            het deel per maand van een berekening moet berekend worden als het tijdsevenredig deel per maand van de waarde van de berekening.
        """
        tree = self.parse_text(rule_text_simplified)
        self.assertNoParseErrors()

    # Placeholder for Dimension Aggregation Test - Needs more specific examples
    # def test_regel_dimensie_aggregatie(self):
    #     """Tests parsing dimension aggregations."""
    #     # Example needed based on a defined objecttype with dimensions
    #     # rule_text = """ ... """
    #     # tree = self.parse_text(rule_text)
    #     # self.assertNoParseErrors()
    #     pass

    def test_multi_rule_parsing(self):
        """
        Tests the flexibility of the grammar in handling multiple rules with varied formatting.
        
        This test verifies the parser's ability to correctly process documents where:
        
        1. Multiple rules appear in sequence in a single file
        
        2. Different statement termination styles are used:
           - Some statements end with explicit periods
           - Others rely on newlines as implicit terminators
        
        3. Whitespace appears in various positions:
           - Around bullet points
           - Between expressions and keywords
           - Within parenthesized expressions
           - Before/after statement terminators
        
        4. Single-letter variable names are used (e.g., "X is 500")
        
        5. Expressions span multiple lines with indentation
        
        The parser successfully handles all these cases because whitespace (including
        newlines) is treated as hidden tokens in the lexer via:
        `WS: [ \t\r\n]+ -> channel(HIDDEN);`
        
        This approach maintains clean grammar rules while supporting flexible document
        formatting that matches natural language writing styles.
        """
        # Switch to document parsing mode to process multiple rules
        original_parser_rule = self.parser_rule
        self.parser_rule = 'regelSpraakDocument'
        
        try:
            # Parse the file with multiple rules
            tree = self.parse_file('multi_rule_test.rs')
            self.assertIsNotNone(tree)
            self.assertNoParseErrors()
        finally:
            # Restore original parser rule
            self.parser_rule = original_parser_rule

if __name__ == '__main__':
    unittest.main()
