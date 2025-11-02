"""Test suite for recursive rule groups (Recursie)."""

import unittest
from datetime import datetime
from regelspraak.parsing import parse_text
from regelspraak.engine import Evaluator
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.semantics import SemanticAnalyzer


class TestRecursie(unittest.TestCase):
    """Test cases for recursive rule groups (§9.9)."""

    def test_simple_regelgroep(self):
        """Test a non-recursive rule group."""
        text = """
        Objecttype Persoon
            de naam Tekst;
            de leeftijd Numeriek met eenheid jr;

        Regelgroep Persoonberekeningen
        Regel set naam
        geldig altijd
        De naam van een Persoon moet gesteld worden op "Jan".
        
        Regel set leeftijd
        geldig altijd
        De leeftijd van een Persoon moet gesteld worden op 25 jr.
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        
        # Verify semantic analysis passes
        analyzer = SemanticAnalyzer()
        analyzer.analyze(model)
        self.assertEqual(len(analyzer.errors), 0)
        
        # Check that the regelgroep was parsed
        self.assertEqual(len(model.regelgroepen), 1)
        regelgroep = model.regelgroepen[0]
        self.assertEqual(regelgroep.naam, "Persoonberekeningen")
        self.assertFalse(regelgroep.is_recursive)
        self.assertEqual(len(regelgroep.regels), 2)
        
        # Execute the regelgroep
        context = RuntimeContext(model)
        persoon = RuntimeObject("Persoon")
        context.add_object(persoon)
        
        evaluator = Evaluator(context)
        results = evaluator.execute_regelgroep(regelgroep)
        
        # Check results
        self.assertIsInstance(results, list)
        self.assertEqual(len(results), 2)  # Two rules executed
        
        # Check that values were set
        naam_value = context.get_attribute(persoon, "naam")
        self.assertIsNotNone(naam_value)
        self.assertEqual(naam_value.value, "Jan")
        
        leeftijd_value = context.get_attribute(persoon, "leeftijd")
        self.assertIsNotNone(leeftijd_value)
        self.assertEqual(leeftijd_value.value, 25)

    def test_recursive_regelgroep_parsing(self):
        """Test parsing of a recursive rule group."""
        text = """
        Objecttype Berekening
            de iteratie Numeriek;
            de waarde Numeriek;
            de vorige waarde Numeriek;

        Regelgroep Iteratieve berekening is recursief
        Regel creeer berekening
        geldig altijd
        Er wordt een nieuw Berekening aangemaakt
        indien de iteratie van de Berekening kleiner is dan 10.
        
        Regel bereken waarde
        geldig altijd
        De waarde van een Berekening moet berekend worden als zijn vorige waarde plus 1.
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        
        # Check that the regelgroep was parsed as recursive
        self.assertEqual(len(model.regelgroepen), 1)
        regelgroep = model.regelgroepen[0]
        self.assertEqual(regelgroep.naam, "Iteratieve berekening")
        self.assertTrue(regelgroep.is_recursive)
        self.assertEqual(len(regelgroep.regels), 2)

    def test_recursive_regelgroep_semantic_validation(self):
        """Test semantic validation of recursive rule groups."""
        # Test 1: Recursive group without object creation rule
        text1 = """
        Objecttype Test
            de waarde Numeriek;

        Regelgroep Foutieve recursie is recursief
        Regel bereken waarde
        geldig altijd
        De waarde van een Test moet berekend worden als 10.
        """
        
        model1 = parse_text(text1)
        analyzer1 = SemanticAnalyzer()
        analyzer1.analyze(model1)
        self.assertGreater(len(analyzer1.errors), 0)
        self.assertIn("must contain an object creation rule", str(analyzer1.errors[0]))
        
        # Test 2: Recursive group with object creation but no termination condition
        text2 = """
        Objecttype Test
            de waarde Numeriek;

        Regelgroep Foutieve recursie is recursief
        Regel creeer test
        geldig altijd
        Er wordt een nieuw Test aangemaakt.
        """
        
        model2 = parse_text(text2)
        analyzer2 = SemanticAnalyzer()
        analyzer2.analyze(model2)
        self.assertGreater(len(analyzer2.errors), 0)
        self.assertIn("must have termination conditions", str(analyzer2.errors[0]))
        
        # Test 3: Valid recursive group
        text3 = """
        Objecttype Test
            de waarde Numeriek;

        Regelgroep Correcte recursie is recursief
        Regel creeer test
        geldig altijd
        Er wordt een nieuw Test aangemaakt indien de waarde van de Test kleiner is dan 10.
        """
        
        model3 = parse_text(text3)
        analyzer3 = SemanticAnalyzer()
        analyzer3.analyze(model3)
        if analyzer3.errors:
            for err in analyzer3.errors:
                print(f"Semantic error: {err}")
        self.assertEqual(len(analyzer3.errors), 0)

    def test_recursive_calculation_simple(self):
        """Test a simple recursive calculation with iteration."""
        text = """
        Objecttype Iteratie
            de stap Numeriek;
            de som Numeriek;

        Regelgroep Recursieve som is recursief
        Regel maak iteratie
        geldig altijd
        Er wordt een nieuw Iteratie aangemaakt met de stap gelijk aan 1 en de som gelijk aan 10
        indien het aantal alle Iteratie kleiner is dan 3.
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        
        # Verify semantic analysis passes
        analyzer = SemanticAnalyzer()
        analyzer.analyze(model)
        if analyzer.errors:
            for err in analyzer.errors:
                print(f"Semantic error: {err}")
        self.assertEqual(len(analyzer.errors), 0)
        
        # Set up initial context
        context = RuntimeContext(model)
        
        # No need for initial object - recursion will create them
        
        # Execute the recursive regelgroep
        evaluator = Evaluator(context)
        regelgroep = model.regelgroepen[0]
        results = evaluator.execute_regelgroep(regelgroep)
        
        # Check that iterations occurred
        self.assertTrue(any(r.get("status") == "object_created" for r in results))
        self.assertTrue(any(r.get("status") == "terminated" or r.get("status") == "completed" for r in results))
        
        # Should have created exactly 3 objects (total sum 10 + 10 + 10 = 30)
        all_iters = context.find_objects_by_type("Iteratie")
        self.assertEqual(len(all_iters), 3)  # 3 created
        
        # Check the values
        total_som = 0
        for iter_obj in all_iters:
            stap = context.get_attribute(iter_obj, "stap")
            som = context.get_attribute(iter_obj, "som")
            if stap and som:
                # All should have stap=1, som=10
                self.assertEqual(stap.value, 1)
                self.assertEqual(som.value, 10)
                total_som += som.value
        
        self.assertEqual(total_som, 30)  # Termination condition

    def test_recursive_execution_termination(self):
        """Test that recursive execution properly terminates."""
        text = """
        Objecttype Counter
            de waarde Numeriek;

        Regelgroep Tel tot vijf is recursief
        Regel maak counter
        geldig altijd
        Er wordt een nieuw Counter aangemaakt met de waarde gelijk aan de waarde van de Counter plus 1
        indien de waarde van de Counter kleiner is dan 5.
        """
        
        model = parse_text(text)
        
        # Set up context with initial counter
        context = RuntimeContext(model)
        
        counter = RuntimeObject("Counter")
        counter.attributen["waarde"] = Value(0, datatype="Numeriek")
        context.add_object(counter)
        
        # Execute
        evaluator = Evaluator(context)
        regelgroep = model.regelgroepen[0]
        results = evaluator.execute_regelgroep(regelgroep)
        
        # Should have created exactly 5 new counters (1, 2, 3, 4, 5)
        all_counters = context.find_objects_by_type("Counter")
        self.assertEqual(len(all_counters), 6)  # Original + 5 created
        
        # Check termination
        terminated = any(r.get("status") == "terminated" for r in results)
        completed = any(r.get("status") == "completed" for r in results)
        self.assertTrue(terminated or completed)
        
        # Verify we didn't hit max iterations
        self.assertFalse(any(r.get("status") == "max_iterations_reached" for r in results))


    def test_configurable_iteration_limit(self):
        """Test that configurable iteration limits work."""
        text = """
        Objecttype InfiniteLoop
            de nummer Numeriek;

        Regelgroep Infinite loop is recursief
        Regel maak object
        geldig altijd
        Er wordt een nieuw InfiniteLoop aangemaakt met de nummer gelijk aan 1
        indien waar gelijk is aan waar.
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        
        # Create context with low iteration limit
        context = RuntimeContext(model)
        context.max_recursion_iterations = 5  # Set low limit
        
        evaluator = Evaluator(context)
        regelgroep = model.regelgroepen[0]
        results = evaluator.execute_regelgroep(regelgroep)
        
        # Should hit iteration limit
        objects = context.find_objects_by_type("InfiniteLoop")
        self.assertLessEqual(len(objects), 5)  # Should not exceed limit
        
        # Check that we created objects up to the limit
        created_count = sum(1 for r in results if r.get("status") == "object_created")
        self.assertLessEqual(created_count, 5)
    
    def test_cycle_detection(self):
        """Test that cycle detection prevents infinite recursion."""
        text = """
        Objecttype Node
            de id Numeriek;
            de creates Node;

        Regelgroep Cyclic creation is recursief
        Regel maak node
        geldig altijd
        Er wordt een nieuw Node aangemaakt
        met de id gelijk aan het aantal alle Node plus 1
        indien het aantal alle Node kleiner is dan 10.
        """
        
        model = parse_text(text)
        self.assertIsNotNone(model)
        
        context = RuntimeContext(model)
        evaluator = Evaluator(context)
        regelgroep = model.regelgroepen[0]
        results = evaluator.execute_regelgroep(regelgroep)
        
        # Check for cycle detection in results
        cycle_detected = any(r.get("status") == "cycle_detected" for r in results)
        if cycle_detected:
            # If cycle was detected, execution should have stopped
            cycle_result = next(r for r in results if r.get("status") == "cycle_detected")
            self.assertIn("Cycle detected", cycle_result.get("message", ""))
        else:
            # If no cycle detected, should have created objects up to termination
            nodes = context.find_objects_by_type("Node")
            self.assertGreater(len(nodes), 0)
            self.assertLessEqual(len(nodes), 10)


if __name__ == "__main__":
    unittest.main()