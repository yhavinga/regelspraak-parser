"""Test list datatype support in RegelSpraak parser."""

import unittest
from decimal import Decimal

from regelspraak.parsing import parse_text as parse_regelspraak
from regelspraak.ast import (
    DomainModel, Parameter, Attribuut, ObjectType,
    AttributeReference, BinaryExpression, Operator, Literal
)
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, Value
from regelspraak.errors import RuntimeError


class TestListDatatype(unittest.TestCase):
    """Test parsing and evaluation of list datatypes."""

    def test_parse_list_parameter(self):
        """Test that list parameters are correctly parsed with is_lijst flag set."""
        regelspraak = """
Parameter TestLijst : Lijst van Numeriek
"""
        model = parse_regelspraak(regelspraak)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.parameters), 1)

        param = model.parameters["TestLijst"]
        self.assertIsNotNone(param)
        self.assertTrue(param.is_lijst, "Parameter should have is_lijst=True")
        self.assertEqual(param.datatype, "Lijst", "List parameter should have datatype='Lijst'")
        self.assertEqual(param.element_datatype, "Numeriek", "Element type should be 'Numeriek'")

    def test_parse_list_attribute(self):
        """Test that list attributes are correctly parsed with is_lijst flag set."""
        regelspraak = """
Objecttype Persoon
    Scores Lijst van Numeriek;
"""
        model = parse_regelspraak(regelspraak)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.objecttypes), 1)

        obj_type = model.objecttypes["Persoon"]
        self.assertIsNotNone(obj_type)
        self.assertIn("Scores", obj_type.attributen)

        attr = obj_type.attributen["Scores"]
        self.assertTrue(attr.is_lijst, "Attribute should have is_lijst=True")
        self.assertEqual(attr.datatype, "Lijst", "List attribute should have datatype='Lijst'")
        self.assertEqual(attr.element_datatype, "Numeriek", "Element type should be 'Numeriek'")

    def test_parse_nested_list(self):
        """Test parsing of nested lists (lijst van lijst van X)."""
        regelspraak = """
Parameter NestedList : Lijst van Lijst van Tekst
"""
        model = parse_regelspraak(regelspraak)
        self.assertIsNotNone(model)

        param = model.parameters["NestedList"]
        self.assertTrue(param.is_lijst, "Nested list should have is_lijst=True")
        self.assertEqual(param.datatype, "Lijst", "Nested list should have datatype='Lijst'")
        self.assertEqual(param.element_datatype, "Lijst", "Element type should be 'Lijst' for nested list")

    def test_list_of_different_types(self):
        """Test list of various datatypes."""
        test_cases = [
            ("Lijst van Tekst", "Tekst"),
            ("Lijst van Datum in dagen", "Datum in dagen"),
            ("Lijst van Boolean", "Boolean"),
            ("Lijst van Percentage", "Percentage"),
        ]

        for list_type, expected_element in test_cases:
            with self.subTest(list_type=list_type):
                regelspraak = f"""
Parameter TestParam : {list_type}
"""
                model = parse_regelspraak(regelspraak)
                param = model.parameters["TestParam"]

                self.assertTrue(param.is_lijst)
                self.assertEqual(param.datatype, "Lijst")
                self.assertEqual(param.element_datatype, expected_element)

    @unittest.skip("IN operator with parameters in rules requires proper attribuutReferentie syntax")
    def test_list_in_operator_expression(self):
        """Test using IN operator with list."""
        regelspraak = """
Parameter AllowedValues : Lijst van Numeriek
Parameter TestValue : Numeriek

Regel check_in_list
    geldig altijd
    De TestValue moet berekend worden als 1
    indien de TestValue in de AllowedValues.
"""
        model = parse_regelspraak(regelspraak)
        self.assertIsNotNone(model)

        # Check that the parameter is parsed as a list
        param = model.parameters["AllowedValues"]
        self.assertTrue(param.is_lijst)

        # Check that the rule parses correctly with IN operator
        self.assertEqual(len(model.regels), 1)
        regel = model.regels[0]
        self.assertIsNotNone(regel.voorwaarde)

        # The condition should be a BinaryExpression with IN operator
        expr = regel.voorwaarde.expressie
        self.assertIsInstance(expr, BinaryExpression)
        self.assertEqual(expr.operator, Operator.IN)

    def test_list_runtime_value_wrapping(self):
        """Test that list values are properly wrapped in Value objects at runtime."""
        regelspraak = """
Parameter NumberList : Lijst van Numeriek
"""
        model = parse_regelspraak(regelspraak)

        # Create runtime context
        context = RuntimeContext(domain_model=model)

        # Set a list parameter value
        list_values = [1, 2, 3, 4, 5]
        context.set_parameter("NumberList", list_values)

        # Get the parameter value back
        value = context.get_parameter("NumberList")
        self.assertIsInstance(value, Value)
        self.assertEqual(value.datatype, "Lijst")
        self.assertEqual(value.value, list_values)

    def test_list_attribute_runtime(self):
        """Test setting and getting list attributes at runtime."""
        regelspraak = """
Objecttype Student
    Grades Lijst van Numeriek;
"""
        model = parse_regelspraak(regelspraak)

        # Create runtime context and object
        context = RuntimeContext(domain_model=model)
        student = context.create_object("Student", instance_id="s1")
        context.add_object(student)

        # Set list attribute
        grades = [8.5, 9.0, 7.5, 8.0]
        context.set_attribute(student, "Grades", grades)

        # Get attribute value back
        value = context.get_attribute(student, "Grades")
        self.assertIsInstance(value, Value)
        self.assertEqual(value.datatype, "Lijst")
        self.assertEqual(value.value, grades)

    @unittest.skip("IN operator with parameters in rules requires proper attribuutReferentie syntax")
    def test_in_operator_runtime_evaluation(self):
        """Test IN operator evaluation with lists at runtime."""
        regelspraak = """
Parameter ValidCodes : Lijst van Numeriek
Parameter CheckCode : Numeriek
Parameter Result : Numeriek

Regel validate_code
    geldig altijd
    De Result moet berekend worden als 1
    indien de CheckCode in de ValidCodes.
"""
        model = parse_regelspraak(regelspraak)

        # Create runtime context
        context = RuntimeContext(domain_model=model)

        # Set up test data
        context.set_parameter("ValidCodes", [10, 20, 30, 40])
        context.set_parameter("CheckCode", 20)
        context.set_parameter("Result", 0)

        # Execute the rule
        engine = Evaluator(context)
        engine.execute_regel(model.regels[0])

        # Check that the rule fired and Result was set
        result = context.get_parameter("Result")
        self.assertEqual(result.value, 1, "Rule should have fired when value is in list")

    def test_list_object_references(self):
        """Test that list of object references doesn't get misclassified."""
        regelspraak = """
Objecttype Persoon
    Naam Tekst;

Objecttype Team
    Members Lijst van Persoon;
"""
        model = parse_regelspraak(regelspraak)

        team_type = model.objecttypes["Team"]
        members_attr = team_type.attributen["Members"]

        # Should be marked as list
        self.assertTrue(members_attr.is_lijst)
        self.assertEqual(members_attr.datatype, "Lijst")
        self.assertEqual(members_attr.element_datatype, "Persoon")

        # After semantic analysis, it should be marked as object ref list
        from regelspraak.semantics import SemanticAnalyzer
        analyzer = SemanticAnalyzer()
        errors = analyzer.analyze(model)
        self.assertEqual(len(errors), 0, f"Semantic analysis should have no errors, got: {errors}")

        # Re-check after semantic analysis
        members_attr = model.objecttypes["Team"].attributen["Members"]
        self.assertTrue(members_attr.is_lijst, "Should still be a list after semantic analysis")
        self.assertTrue(members_attr.is_object_ref, "Should be marked as object reference list")

    def test_single_value_wrapped_as_list(self):
        """Test that single values are automatically wrapped in lists when needed."""
        regelspraak = """
Parameter SingleToList : Lijst van Numeriek
"""
        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)

        # Set a single value (not a list)
        context.set_parameter("SingleToList", 42)

        # Should be wrapped in a list automatically
        value = context.get_parameter("SingleToList")
        self.assertEqual(value.datatype, "Lijst")
        self.assertEqual(value.value, [42])

    def test_empty_list_handling(self):
        """Test handling of empty lists."""
        regelspraak = """
Parameter EmptyList : Lijst van Tekst
"""
        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)

        # Set an empty list
        context.set_parameter("EmptyList", [])

        value = context.get_parameter("EmptyList")
        self.assertEqual(value.datatype, "Lijst")
        self.assertEqual(value.value, [])

        # Set None (should become empty list)
        context.set_parameter("EmptyList", None)
        value = context.get_parameter("EmptyList")
        self.assertEqual(value.value, [])

    def test_in_operator_with_value_objects(self):
        """Test IN operator with Value-wrapped collections (positive runtime test)."""
        regelspraak = """
Parameter NumberList : Lijst van Numeriek
Parameter TestValue : Numeriek

Domein StatusCodes is van het type Enumeratie
    'OK'
    'ERROR'
    'PENDING';
"""
        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)

        # Test 1: IN with list of raw values
        context.set_parameter("NumberList", [10, 20, 30, 40])
        context.set_parameter("TestValue", 20)

        number_list = context.get_parameter("NumberList")
        test_value = context.get_parameter("TestValue")

        # Pass Value objects directly - no premature unwrapping
        result = context.check_in(test_value, number_list)
        self.assertTrue(result, "20 should be in [10, 20, 30, 40]")

        # Test 2: IN with Value not in list
        context.set_parameter("TestValue", 50)
        test_value = context.get_parameter("TestValue")
        result = context.check_in(test_value, number_list)
        self.assertFalse(result, "50 should not be in [10, 20, 30, 40]")

        # Test 3: IN with list of Value objects
        value_list = Value(
            value=[Value(value=10, datatype="Numeriek"),
                   Value(value=20, datatype="Numeriek"),
                   Value(value=30, datatype="Numeriek")],
            datatype="Lijst"
        )
        test_val = Value(value=20, datatype="Numeriek")
        result = context.check_in(test_val, value_list)
        self.assertTrue(result, "Value(20) should be in list of Value objects")

        # Test 4: IN with string containment
        string_val = Value(value="test string", datatype="Tekst")
        substring = Value(value="test", datatype="Tekst")
        result = context.check_in(substring, string_val)
        self.assertTrue(result, "'test' should be in 'test string'")

        # Test 5: IN with domain enumeration
        # The domain name "StatusCodes" should work as a collection
        status_val = Value(value="OK", datatype="Tekst")
        result = context.check_in(status_val, "StatusCodes")
        self.assertTrue(result, "'OK' should be in StatusCodes enumeration")

        # Test invalid status
        invalid_status = Value(value="INVALID", datatype="Tekst")
        result = context.check_in(invalid_status, "StatusCodes")
        self.assertFalse(result, "'INVALID' should not be in StatusCodes enumeration")

        # Test 6: IN with range
        range_collection = range(1, 10)
        value_in_range = Value(value=5, datatype="Numeriek")
        result = context.check_in(value_in_range, range_collection)
        self.assertTrue(result, "5 should be in range(1, 10)")

        value_out_range = Value(value=15, datatype="Numeriek")
        result = context.check_in(value_out_range, range_collection)
        self.assertFalse(result, "15 should not be in range(1, 10)")

    def test_in_operator_error_handling(self):
        """Test IN operator error handling for invalid collections."""
        regelspraak = """
Parameter TestValue : Numeriek
"""
        model = parse_regelspraak(regelspraak)
        context = RuntimeContext(domain_model=model)

        context.set_parameter("TestValue", 10)
        test_value = context.get_parameter("TestValue")

        # Test with invalid collection type (integer)
        with self.assertRaises(RuntimeError) as cm:
            context.check_in(test_value, 42)  # 42 is not a collection

        self.assertIn("IN' operator requires a collection", str(cm.exception))


if __name__ == "__main__":
    unittest.main()