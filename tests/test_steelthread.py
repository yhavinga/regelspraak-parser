import unittest
from tests.test_base import RegelSpraakTestCase
# Import necessary AST nodes for type checking and clarity
from regelspraak.ast import (
    Parameter, ObjectType, Regel, Voorwaarde, BinaryExpression, 
    AttributeReference, ParameterReference, KenmerkToekenning, DomainModel
)
# Import the visitor
from regelspraak.parsing import RegelSpraakModelBuilder

import logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

class SteelthreadTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        # Parse the entire document containing multiple definitions
        cls.parser_rule = 'regelSpraakDocument' 

    def test_steelthread_parsing_and_spans(self):
        """Test parsing the steelthread example and print key spans."""
        input_text = """
        Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;

        Objecttype de Natuurlijk persoon
            is minderjarig kenmerk (bijvoeglijk);
            de leeftijd Numeriek (geheel getal) met eenheid jr;

        Regel Kenmerktoekenning persoon minderjarig
            geldig altijd
            Een Natuurlijk persoon is minderjarig
            indien zijn leeftijd kleiner is dan de volwassenleeftijd.
        """ # Note: Line numbers start from 1 for the input_text block itself
        
        # 1. Get the ANTLR parse tree
        tree = self.parse_text(input_text)
        self.assertIsNotNone(tree, "Parser should produce a parse tree.")
        self.assertNoParseErrors()

        # 2. Run the visitor to build the DomainModel (AST)
        visitor = RegelSpraakModelBuilder()
        model = visitor.visit(tree)
        self.assertIsInstance(model, DomainModel, "Visitor should produce a DomainModel.")

        print("\n--- Steelthread Span Info ---")
        print(f"DomainModel: {model.span}")

        # Parameter
        param_name = "volwassenleeftijd"
        if param_name in model.parameters:
            param = model.parameters[param_name]
            self.assertIsInstance(param, Parameter)
            print(f"Parameter '{param.naam}': {param.span}")
        else:
            print(f"Parameter '{param_name}' not found.")

        # ObjectType
        obj_name = "Natuurlijk persoon"
        if obj_name in model.objecttypes:
            obj_type = model.objecttypes[obj_name]
            self.assertIsInstance(obj_type, ObjectType)
            print(f"ObjectType '{obj_type.naam}': {obj_type.span}")

            # Attribuut
            attr_name = "leeftijd"
            if attr_name in obj_type.attributen:
                 print(f"  Attribuut '{attr_name}': {obj_type.attributen[attr_name].span}")
            else:
                 print(f"  Attribuut '{attr_name}' not found.")

            # Kenmerk
            kenmerk_name = "minderjarig"
            if kenmerk_name in obj_type.kenmerken:
                 print(f"  Kenmerk '{kenmerk_name}': {obj_type.kenmerken[kenmerk_name].span}")
            else:
                 print(f"  Kenmerk '{kenmerk_name}' not found.")

        else:
            print(f"ObjectType '{obj_name}' not found.")

        # Regel
        rule_name = "Kenmerktoekenning persoon minderjarig"
        rule = next((r for r in model.regels if r.naam == rule_name), None)
        if rule:
            self.assertIsInstance(rule, Regel)
            print(f"Regel '{rule.naam}': {rule.span}")
            if isinstance(rule.resultaat, KenmerkToekenning):
                print(f"  Resultaat (KenmerkToekenning '{rule.resultaat.kenmerk_naam}'): {rule.resultaat.span}")
                # Optional: self.assertEqual(rule.resultaat.kenmerk_naam, "is minderjarig")
            if rule.voorwaarde:
                self.assertIsInstance(rule.voorwaarde, Voorwaarde)
                print(f"  Voorwaarde: {rule.voorwaarde.span}")
                if isinstance(rule.voorwaarde.expressie, BinaryExpression):
                    bin_expr = rule.voorwaarde.expressie
                    print(f"    Condition Expression (Binary '{bin_expr.operator.value}'): {bin_expr.span}")
                    if isinstance(bin_expr.left, AttributeReference):
                        print(f"      Left Operand (AttrRef '{''.join(bin_expr.left.path)}'): {bin_expr.left.span}")
                    if isinstance(bin_expr.right, ParameterReference):
                         print(f"      Right Operand (ParamRef '{bin_expr.right.parameter_name}'): {bin_expr.right.span}")
        else:
            print(f"Regel '{rule_name}' not found.")

        print("---------------------------\n")

if __name__ == '__main__':
    unittest.main() 