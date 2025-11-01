# tests/test_expressions.py
import unittest
from tests.test_base import RegelSpraakTestCase
from regelspraak.parsing import parse_text # For direct AST inspection
from regelspraak.ast import (
    DomainModel, Regel, Expression, Literal, UnaryExpression, BinaryExpression,
    FunctionCall, AttributeReference, ParameterReference, VariableReference,
    Operator, SourceSpan, Gelijkstelling
)

# Helper function to get a default span
def unknown_span():
    return SourceSpan.unknown()

class TestAllExpressions(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Most expressions will be tested within a Regel context,
        # so parse the whole document to include necessary definitions.
        cls.parser_rule = 'regelSpraakDocument'

    def get_main_expression_from_rule(self, model: DomainModel) -> Expression:
        """Helper to extract the main expression from the 'De waarde moet ...' rule."""
        self.assertIsInstance(model, DomainModel)
        self.assertTrue(len(model.regels) > 0, "No rules found in parsed model.")
        
        rule_node = model.regels[0] # Assuming the target rule is the first one
        self.assertIsInstance(rule_node, Regel, f"Expected Regel, got {type(rule_node)}")
        self.assertIsNotNone(rule_node.resultaat, "Rule has no resultaatDeel.")
        
        # Check if resultaat is Gelijkstelling and has an expressie
        self.assertIsInstance(rule_node.resultaat, Gelijkstelling, f"Expected Gelijkstelling, got {type(rule_node.resultaat)}")
        self.assertTrue(hasattr(rule_node.resultaat, 'expressie'), "Gelijkstelling result has no 'expressie' attribute.")
        
        return rule_node.resultaat.expressie

#     def assertExpressionParsesAndAST(self, expression_snippet: str, 
#                                      expected_ast_type: type, 
#                                      ast_check_fn=None,
#                                      extra_definitions: str = ""):
#         """
#         Parses a RegelSpraak rule containing the given expression snippet
#         and optionally performs AST checks on the parsed expression.
#         Returns the parsed Expression AST node.
#         """
#         # Standard preamble for context
#         regel_text = f"""
# Parameter de NumeriekeParam : Numeriek (geheel getal) met eenheid jr;
# Parameter de TekstParam : Tekst;
# Parameter de BooleanParam : Boolean;
# Parameter de DatumParam : Datum in dagen;
# Parameter de DatumTijdParam : Datum en tijd in millisecondes;

# Objecttype TestPersoon (bezield)
#     de leeftijd Numeriek (geheel getal) met eenheid jr;
#     de naam Tekst;
#     isActief kenmerk (bijvoeglijk);
#     heeftRijbewijs kenmerk (bezittelijk);
#     geboortedatum Datum in dagen;
#     salaris Bedrag; 
#     status TestStatusDomein;
#     scores Lijst van Numeriek;

# Objecttype TestVlucht
#     de vertrekdatum Datum in dagen;
#     de afstand Numeriek (geheel getal) met eenheid km;

# Domein Bedrag is van het type Numeriek (getal met 2 decimalen)
# Domein TestStatusDomein is van het type Enumeratie
#     'Actief'
#     'Inactief'
#     'Onbekend';

# Lijst TestLijst van Numeriek; // Assuming simple list type for IN operator test

# {extra_definitions}

# Regel TestRegelVoorExpressie
#     geldig altijd
#         De waarde van een TestPersoon moet berekend worden als {expression_snippet}.
#     Daarbij geldt:
#         X is 10;
#         Y is 20;
#         Z is zijn leeftijd;
#         S is "initiële tekst";
#         B is waar;
#         D is 01-01-2023;
#         DT is dd. 01-01-2023 10:00:00.000;
#         STATUS_A is 'Actief';
#         D1 is 01-01-2023;
#         D2 is 02-01-2023;
#         S1 is "eerste";
#         S2 is "tweede";
#         S3 is "derde";
# """
#         # This will use the _parse_stream method from parsing.py which includes the ModelBuilder
#         model = parse_text(regel_text) 
#         parsed_expression = self.get_main_expression_from_rule(model)
        
#         self.assertIsInstance(parsed_expression, expected_ast_type, 
#                               f"Expression '{expression_snippet}' parsed to {type(parsed_expression).__name__}, expected {expected_ast_type.__name__}")
        
#         if ast_check_fn:
#             ast_check_fn(parsed_expression)
        
#         return parsed_expression

    def _test_expression_in_rule(self, expression_snippet: str, extra_definitions: str = ""):
        """Helper to test an expression within a rule context."""
        regel_text = f"""
Parameter de NumeriekeParam : Numeriek (geheel getal) met eenheid jr
Parameter de TekstParam : Tekst
Parameter de BooleanParam : Boolean
Parameter de DatumParam : Datum in dagen
Parameter de DatumTijdParam : Datum en tijd in millisecondes

Domein Bedrag is van het type Numeriek (getal met 2 decimalen);

Domein TestStatusDomein is van het type Enumeratie
    'Actief'
    'Inactief'
    'Onbekend';

Objecttype TestPersoon (bezield)
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    de naam Tekst;
    de status TestStatusDomein;
    het salaris Bedrag met eenheid €;
    isActief kenmerk (bijvoeglijk);
    heeftRijbewijs kenmerk (bezittelijk);
    het resultaat Tekst;
    het numeriek resultaat Numeriek;
    het datum resultaat Datum in dagen;

Objecttype TestVlucht
    de vertrekdatum Datum in dagen;
    de afstand Numeriek (geheel getal) met eenheid km;

{extra_definitions}

Regel DeTestRegel
    geldig altijd
        het resultaat van een TestPersoon moet gesteld worden op {expression_snippet}.
    Daarbij geldt:
        X is 10
        Y is 20
        S is "initiële tekst"
        B is waar
        DatumParam1 is 01-01-2023
        DatumParam2 is 02-01-2023
        S1 is "eerste"
        S2 is "tweede"
        S3 is "derde".
"""
        tree = self.parse_text(regel_text)
        # for i, line in enumerate(regel_text.split('\n')):
        #     print(f"{i+1}: {line}")
        self.assertNoParseErrors()
        return tree

    # --- 1. Literal Expressions ---
    def test_literal_integer(self):
        """Test integer literal parsing."""
        self._test_expression_in_rule("123")

    def test_literal_negative_integer(self):
        """Test negative integer literal parsing."""
        self._test_expression_in_rule("-45")

    def test_literal_decimal_comma(self):
        """Test decimal literal with comma parsing."""
        self._test_expression_in_rule("12,34")

    def test_literal_rational_simple_fraction(self):
        """Test simple rational fraction parsing."""
        self._test_expression_in_rule("3/4")

    def test_literal_rational_mixed_fraction(self):
        """Test mixed fraction parsing."""
        self._test_expression_in_rule("1_1/2")

    def test_literal_numeric_with_unit(self):
        """Test numeric literal with unit parsing."""
        self._test_expression_in_rule("100 km")

    def test_literal_tekst(self):
        """Test text literal parsing."""
        self._test_expression_in_rule("\"Hallo RegelSpraak!\"")

    def test_literal_boolean_waar(self):
        """Test boolean true literal parsing."""
        self._test_expression_in_rule("waar")

    def test_literal_boolean_onwaar(self):
        """Test boolean false literal parsing."""
        self._test_expression_in_rule("onwaar")

    def test_literal_datum_no_dd(self):
        """Test date literal without 'dd.' prefix parsing."""
        self._test_expression_in_rule("01-03-2024")

    def test_literal_datum_with_dd(self):
        """Test date literal with 'dd.' prefix parsing."""
        self._test_expression_in_rule("dd. 15-08-2023")

    def test_literal_datum_tijd(self):
        """Test datetime literal parsing."""
        self._test_expression_in_rule("dd. 01-01-2024 10:30:00.123")

    def test_literal_enumeratiewaarde(self):
        """Test enumeration value literal parsing."""
        self._test_expression_in_rule("'Actief'")

    # --- 2. References ---
    def test_reference_attribuut_simple(self):
        """Test simple attribute reference parsing."""
        self._test_expression_in_rule("de leeftijd van een TestPersoon")

    def test_reference_attribuut_bezittelijk(self):
        """Test possessive attribute reference parsing."""
        self._test_expression_in_rule("zijn leeftijd")

    def test_reference_parameter(self):
        """Test parameter reference parsing."""
        self._test_expression_in_rule("de NumeriekeParam")

    def test_reference_variabele(self):
        """Test variable reference parsing."""
        self._test_expression_in_rule("X")

    # --- 3. Unary Operations ---
    def test_unary_niet_boolean(self):
        """Test 'niet' unary operator with boolean."""
        self._test_expression_in_rule("niet B")

    def test_unary_niet_comparison(self):
        """Test 'niet' unary operator with comparison."""
        self._test_expression_in_rule("niet (X is gelijk aan Y)")

    def test_unary_minus_variable(self):
        """Test unary minus operator."""
        self._test_expression_in_rule("-X")

    # --- 4. Binary Arithmetic Operations ---
    def test_arithmetic_plus(self):
        """Test plus arithmetic operator."""
        self._test_expression_in_rule("X plus Y")

    def test_arithmetic_min(self):
        """Test minus arithmetic operator."""
        self._test_expression_in_rule("X min Y")

    def test_arithmetic_verminderd_met(self):
        """Test 'verminderd met' phrase operator."""
        self._test_expression_in_rule("X verminderd met Y")

    def test_arithmetic_maal(self):
        """Test multiplication operator."""
        self._test_expression_in_rule("X maal Y")

    def test_arithmetic_gedeeld_door(self):
        """Test division operator."""
        self._test_expression_in_rule("X gedeeld door Y")

    def test_arithmetic_tot_de_macht(self):
        """Test power operator."""
        self._test_expression_in_rule("X tot de macht Y")

    # --- 5. Binary Logical Operations ---
    def test_logical_en(self):
        """Test logical 'en' operator."""
        self._test_expression_in_rule("B en (X is gelijk aan Y)")

    def test_logical_of(self):
        """Test logical 'of' operator."""
        self._test_expression_in_rule("B of (X is kleiner dan Y)")

    # --- 6. Binary Comparison Operations ---
    def test_comparison_is_gelijk_aan(self):
        """Test 'is gelijk aan' comparison."""
        self._test_expression_in_rule("X is gelijk aan Y")

    def test_comparison_zijn_gelijk_aan(self):
        """Test 'zijn gelijk aan' comparison phrase."""
        self._test_expression_in_rule("de getallen zijn gelijk aan Y")

    def test_comparison_is_ongelijk_aan(self):
        """Test 'is ongelijk aan' comparison."""
        self._test_expression_in_rule("X is ongelijk aan Y")

    def test_comparison_zijn_ongelijk_aan(self):
        """Test 'zijn ongelijk aan' comparison phrase."""
        self._test_expression_in_rule("de getallen zijn ongelijk aan Y")

    def test_comparison_is_kleiner_dan(self):
        """Test 'is kleiner dan' comparison."""
        self._test_expression_in_rule("X is kleiner dan Y")

    def test_comparison_kleiner_is_dan(self):
        """Test 'kleiner is dan' alternate phrasing."""
        self._test_expression_in_rule("X kleiner is dan Y")

    def test_comparison_is_groter_dan(self):
        """Test 'is groter dan' comparison."""
        self._test_expression_in_rule("X is groter dan Y")

    def test_comparison_groter_is_dan(self):
        """Test 'groter is dan' alternate phrasing."""
        self._test_expression_in_rule("X groter is dan Y")

    def test_comparison_is_kleiner_of_gelijk_aan(self):
        """Test 'is kleiner of gelijk aan' comparison."""
        self._test_expression_in_rule("X is kleiner of gelijk aan Y")

    def test_comparison_is_groter_of_gelijk_aan(self):
        """Test 'is groter of gelijk aan' comparison."""
        self._test_expression_in_rule("X is groter of gelijk aan Y")

    # Date comparisons (phrases)
    def test_date_is_later_dan(self):
        """Test 'is later dan' date comparison."""
        self._test_expression_in_rule("de DatumParam is later dan de DatumTijdParam")

    def test_date_zijn_later_of_gelijk_aan(self):
        """Test 'zijn later of gelijk aan' date comparison phrase."""
        self._test_expression_in_rule("de data zijn later of gelijk aan de DatumParam")

    def test_date_is_eerder_dan(self):
        """Test 'is eerder dan' date comparison."""
        self._test_expression_in_rule("de DatumParam is eerder dan de DatumTijdParam")

    def test_date_zijn_eerder_of_gelijk_aan(self):
        """Test 'zijn eerder of gelijk aan' date comparison phrase."""
        self._test_expression_in_rule("de data zijn eerder of gelijk aan de DatumParam")

    # --- 7. Special Binary Operations ---
    def test_special_is_kenmerk(self):
        """Test 'is kenmerk' special operator."""
        self._test_expression_in_rule("een TestPersoon is isActief")

    def test_special_heeft_kenmerk(self):
        """Test 'heeft kenmerk' special operator."""
        self._test_expression_in_rule("een TestPersoon heeft heeftRijbewijs")

    def test_special_in_operator(self):
        """Test 'in' operator for collections."""
        extra_defs = "Parameter DeTestLijst : Lijst van Numeriek"
        self._test_expression_in_rule("X in de DeTestLijst", extra_defs)

    # --- 8. Function Calls ---
    def test_function_de_wortel_van(self):
        """Test 'de wortel van' function."""
        self._test_expression_in_rule("de wortel van X")

    def test_function_de_wortel_van_met_afronding(self):
        """Test 'de wortel van' function with rounding."""
        self._test_expression_in_rule("de wortel van X naar beneden afgerond op 2 decimalen")

    def test_function_absolute_waarde_van(self):
        """Test 'de absolute waarde van' function."""
        self._test_expression_in_rule("de absolute waarde van (X)")

    def test_function_tijdsduur_van_in_eenheid(self):
        """Test 'de tijdsduur van' function with unit conversion."""
        self._test_expression_in_rule("de tijdsduur van de DatumParam tot de DatumTijdParam in hele jaren")

    def test_function_datum_plus_tijd(self):
        """Test date plus time duration."""
        self._test_expression_in_rule("de DatumParam plus 5 dagen")

    def test_function_het_jaar_uit(self):
        """Test 'het jaar uit' date function."""
        self._test_expression_in_rule("het jaar uit de DatumParam")

    def test_function_de_maand_uit(self):
        """Test 'de maand uit' date function."""
        self._test_expression_in_rule("de maand uit de DatumParam")

    def test_function_de_dag_uit(self):
        """Test 'de dag uit' date function."""
        self._test_expression_in_rule("de dag uit de DatumParam")

    def test_function_de_eerste_paasdag_van(self):
        """Test 'de eerste paasdag van' function."""
        self._test_expression_in_rule("de eerste paasdag van (2024)")

    def test_function_de_datum_met(self):
        """Test 'de datum met' constructor function."""
        self._test_expression_in_rule("de datum met jaar, maand en dag (X, Y, Z)")

    def test_function_de_eerste_van(self):
        """Test 'de eerste van' min function."""
        self._test_expression_in_rule("de eerste van de DatumParam, de DatumTijdParam en 31-12-2024")

    def test_function_de_laatste_van(self):
        """Test 'de laatste van' max function."""
        self._test_expression_in_rule("de laatste van de DatumParam, de DatumTijdParam en 31-12-2024")
            
    def test_function_het_aantal(self):
        """Test 'het aantal' count function."""
        self._test_expression_in_rule("het aantal TestPersonen")

    def test_function_de_som_van(self):
        """Test 'de som van' sum function."""
        self._test_expression_in_rule("de som van de leeftijd van alle TestPersonen")

    def test_function_concatenatie_van(self):
        """Test 'de concatenatie van' string function."""
        self._test_expression_in_rule("de concatenatie van S1, S2 en S3")
            
    def test_function_het_totaal_van(self):
        """Test 'het totaal van' function with condition."""
        self._test_expression_in_rule("het totaal van X gedurende de tijd dat B")

    def test_function_aantal_dagen_in(self):
        """Test 'het aantal dagen in' function."""
        self._test_expression_in_rule("het aantal dagen in de maand dat B")

    def test_function_tijdsevenredig_deel(self):
        """Test 'het tijdsevenredig deel' function."""
        # TODO: According to spec section 13.4.16.53, the syntax "vanaf D1 tot D2" should also be supported
        # as a periodevergelijkingenkelvoudig form of conditiebijexpressie. Currently only 
        # "gedurende de tijd dat" is implemented in the grammar.
        self._test_expression_in_rule("het tijdsevenredig deel per jaar van X gedurende de tijd dat B")

    # --- 9. Afronding Expressions ---
    def test_afronding_naar_beneden(self):
        """Test 'naar beneden afgerond' rounding."""
        self._test_expression_in_rule("X naar beneden afgerond op 2 decimalen")

    def test_afronding_naar_boven(self):
        """Test 'naar boven afgerond' rounding."""
        self._test_expression_in_rule("X naar boven afgerond op 2 decimalen")

    def test_afronding_rekenkundig(self):
        """Test 'rekenkundig afgerond' rounding."""
        self._test_expression_in_rule("X rekenkundig afgerond op 0 decimalen")

    def test_afronding_richting_nul(self):
        """Test 'richting nul afgerond' rounding."""
        self._test_expression_in_rule("X richting nul afgerond op 2 decimalen")

    def test_afronding_weg_van_nul(self):
        """Test 'weg van nul afgerond' rounding."""
        self._test_expression_in_rule("X weg van nul afgerond op 2 decimalen")

    # --- 10. Begrenzing Expressions ---
    def test_begrenzing_minimum(self):
        """Test minimum bounding expression."""
        self._test_expression_in_rule("X, met een minimum van Y")

    def test_begrenzing_maximum(self):
        """Test maximum bounding expression."""
        self._test_expression_in_rule("X, met een maximum van Z")

    def test_begrenzing_minimum_maximum(self):
        """Test combined min-max bounding expression."""
        self._test_expression_in_rule("X, met een minimum van Y en met een maximum van Z")

    # --- 11. Parenthesized Expressions & Precedence ---
    def test_parenthesized_expression(self):
        """Test parenthesized expressions."""
        self._test_expression_in_rule("(X plus Y)")

    def test_precedence_mul_over_plus(self):
        """Test operator precedence: multiplication over addition."""
        self._test_expression_in_rule("X plus Y maal Z")

    def test_precedence_plus_plus_left_assoc(self):
        """Test left associativity of addition."""
        self._test_expression_in_rule("X plus Y plus Z")

    def test_precedence_comparison_with_arithmetic(self):
        """Test precedence of comparison with arithmetic."""
        self._test_expression_in_rule("X plus Y is groter dan Z")

    def test_precedence_logical_with_comparison(self):
        """Test precedence of logical with comparison."""
        self._test_expression_in_rule("X is groter dan Y en Z is kleiner dan X")

    # --- 12. Complex Expressions ---
    def test_complex_nested_functions(self):
        """Test nested function calls."""
        self._test_expression_in_rule("de absolute waarde van (de som van X, Y en Z)")

    def test_complex_arithmetic_with_functions(self):
        """Test arithmetic combined with functions."""
        self._test_expression_in_rule("(de wortel van X) plus (het jaar uit de DatumParam)")

    def test_complex_comparison_with_functions(self):
        """Test comparisons with function results."""
        self._test_expression_in_rule("(de tijdsduur van de DatumParam tot de DatumTijdParam in dagen) is groter dan 30")

    def test_complex_logical_combinations(self):
        """Test complex logical combinations."""
        self._test_expression_in_rule("(X is groter dan Y) en (Z is kleiner dan X) of (B)")

    # --- 13. Percentage Expressions ---
    def test_percentage_van(self):
        """Test percentage 'van' expression."""
        self._test_expression_in_rule("10 % van X")

    def test_percentage_complex(self):
        """Test percentage with complex expression."""
        self._test_expression_in_rule("15 % van (X plus Y)")

if __name__ == '__main__':
    unittest.main() 