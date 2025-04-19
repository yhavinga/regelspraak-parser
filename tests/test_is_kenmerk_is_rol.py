import unittest
from tests.test_base import RegelSpraakTestCase
from regelspraak.parse.antlr.RegelSpraakParser import RegelSpraakParser

class IsKenmerkIsRolTests(RegelSpraakTestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.parser_rule = 'regel'  # Test within the context of a 'regel'

    def test_is_kenmerk_singular(self):
        """Tests 'is kenmerk' predicate in singular form."""
        input_text = """Regel check kenmerk
            geldig altijd
                Het resultaat is WAAR
                indien de persoon is kenmerk Student.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        kenmerk_node = self.find_node_of_type(tree, RegelSpraakParser.UnaryKenmerkConditionContext)
        self.assertIsNotNone(kenmerk_node, "UnaryKenmerkConditionContext node not found")
        self.assertEqual(kenmerk_node.op.text, "is kenmerk") # Check the operator token text
        self.assertEqual(kenmerk_node.kenmerk.IDENTIFIER().getText(), "Student") # Check the kenmerk identifier text

    def test_is_kenmerk_plural(self):
        """Tests 'zijn kenmerk' predicate in plural form."""
        input_text = """Regel check kenmerken meervoud
            geldig altijd
                Het resultaat is WAAR
                indien de personen zijn kenmerk Student.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        kenmerk_node = self.find_node_of_type(tree, RegelSpraakParser.UnaryKenmerkConditionContext)
        self.assertIsNotNone(kenmerk_node, "UnaryKenmerkConditionContext node not found")
        self.assertEqual(kenmerk_node.op.text, "zijn kenmerk") # Check the operator token text
        self.assertEqual(kenmerk_node.kenmerk.IDENTIFIER().getText(), "Student") # Check the kenmerk identifier text

    def test_is_rol_singular(self):
        """Tests 'is rol' predicate in singular form."""
        input_text = """Regel check rol
            geldig altijd
                Het resultaat is WAAR
                indien de persoon is rol Aanvrager.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        rol_node = self.find_node_of_type(tree, RegelSpraakParser.UnaryRolConditionContext)
        self.assertIsNotNone(rol_node, "UnaryRolConditionContext node not found")
        self.assertEqual(rol_node.op.text, "is rol") # Check the operator token text
        self.assertEqual(rol_node.rol.IDENTIFIER().getText(), "Aanvrager") # Check the rol identifier text

    def test_is_rol_plural(self):
        """Tests 'zijn rol' predicate in plural form."""
        input_text = """Regel check rollen meervoud
            geldig altijd
                Het resultaat is WAAR
                indien de personen zijn rol Aanvrager.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        rol_node = self.find_node_of_type(tree, RegelSpraakParser.UnaryRolConditionContext)
        self.assertIsNotNone(rol_node, "UnaryRolConditionContext node not found")
        self.assertEqual(rol_node.op.text, "zijn rol") # Check the operator token text
        self.assertEqual(rol_node.rol.IDENTIFIER().getText(), "Aanvrager") # Check the rol identifier text

    def test_is_not_kenmerk(self):
        """Tests 'is niet kenmerk' predicate with negation."""
        input_text = """Regel check niet kenmerk
            geldig altijd
                Het resultaat is WAAR
                indien de persoon is niet kenmerk Student.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        kenmerk_node = self.find_node_of_type(tree, RegelSpraakParser.UnaryKenmerkConditionContext)
        self.assertIsNotNone(kenmerk_node, "UnaryKenmerkConditionContext node not found")
        self.assertEqual(kenmerk_node.op.text, "is niet kenmerk") # Check the operator token text
        self.assertEqual(kenmerk_node.kenmerk.IDENTIFIER().getText(), "Student") # Check the kenmerk identifier text

    def test_is_not_rol(self):
        """Tests 'is niet rol' predicate with negation."""
        input_text = """Regel check niet rol
            geldig altijd
                Het resultaat is WAAR
                indien de persoon is niet rol Aanvrager.
        """
        tree = self.parse_text(input_text)
        self.assertNoParseErrors()
        rol_node = self.find_node_of_type(tree, RegelSpraakParser.UnaryRolConditionContext)
        self.assertIsNotNone(rol_node, "UnaryRolConditionContext node not found")
        self.assertEqual(rol_node.op.text, "is niet rol") # Check the operator token text
        self.assertEqual(rol_node.rol.IDENTIFIER().getText(), "Aanvrager") # Check the rol identifier text

if __name__ == '__main__':
    unittest.main() 