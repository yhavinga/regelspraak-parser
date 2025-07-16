"""Tests for timeline-aware expression evaluation including knip merging."""
import unittest
from datetime import datetime
from decimal import Decimal

from regelspraak.parsing import parse_text
from regelspraak.ast import DomainModel, Period, Timeline
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, TimelineValue
from regelspraak.engine import Evaluator
from regelspraak.errors import RuntimeError


class TestTimelineExpressions(unittest.TestCase):
    """Test timeline expression evaluation with knip merging."""
    
    def setUp(self):
        """Set up test model and context."""
        # Create a domain model with timeline attributes and parameters
        model_text = """
        Parameter de dagkoers : Numeriek (getal) met eenheid euro voor elke dag;
        Parameter het maandbudget : Bedrag voor elke maand;
        Parameter de vaste waarde : Numeriek (getal) met eenheid euro;
        
        Objecttype de Werknemer
            het salaris Numeriek (getal) met eenheid euro voor elke maand;
            het daginkomen Numeriek (getal) met eenheid euro voor elke dag;
            de bonus Bedrag voor elk jaar;
            het totaal inkomen Numeriek (getal) met eenheid euro voor elke dag;
            de naam Tekst;
        
        Regel bereken totaal inkomen
            geldig altijd
                Het totaal inkomen van een Werknemer moet berekend worden als
                zijn salaris plus zijn daginkomen.
        """
        self.model = parse_text(model_text)
        self.context = RuntimeContext(domain_model=self.model)
        self.evaluator = Evaluator(self.context)
    
    def test_simple_timeline_addition(self):
        """Test adding two timeline values with same granularity."""
        # Create a worker
        worker = RuntimeObject(object_type_naam="Werknemer", instance_id="w1")
        self.context.add_object(worker)
        
        # Set timeline for salaris (monthly)
        salaris_periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 2, 1),
                value=Value(value=3000, datatype="Numeriek(getal)", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 2, 1),
                end_date=datetime(2024, 3, 1),
                value=Value(value=3100, datatype="Numeriek(getal)", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 3, 1),
                end_date=datetime(2024, 4, 1),
                value=Value(value=3200, datatype="Numeriek(getal)", unit="euro")
            )
        ]
        salaris_timeline = Timeline(periods=salaris_periods, granularity="maand")
        salaris_value = TimelineValue(timeline=salaris_timeline)
        self.context.set_timeline_attribute(worker, "salaris", salaris_value)
        
        # Set timeline for bonus (yearly) - same granularity test first
        bonus_periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 2, 1),
                value=Value(value=500, datatype="Bedrag", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 2, 1),
                end_date=datetime(2024, 3, 1),
                value=Value(value=600, datatype="Bedrag", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 3, 1),
                end_date=datetime(2024, 4, 1),
                value=Value(value=700, datatype="Bedrag", unit="euro")
            )
        ]
        bonus_timeline = Timeline(periods=bonus_periods, granularity="maand")
        bonus_value = TimelineValue(timeline=bonus_timeline)
        # Store timeline value for bonus (which is actually yearly in the model, but we're testing with monthly for simplicity)
        self.context.set_timeline_attribute(worker, "bonus", bonus_value)
        
        # Create an expression to add salaris + bonus
        from regelspraak.ast import BinaryExpression, AttributeReference, Operator
        
        salaris_ref = AttributeReference(path=["salaris"], span=None)
        bonus_ref = AttributeReference(path=["bonus"], span=None)
        add_expr = BinaryExpression(
            left=salaris_ref,
            right=bonus_ref,
            operator=Operator.PLUS,
            span=None
        )
        
        # Evaluate the timeline expression
        self.context.current_instance = worker
        result = self.evaluator._evaluate_timeline_expression(add_expr)
        
        # Check that result is a TimelineValue
        self.assertIsInstance(result, TimelineValue)
        
        # Check periods and values
        self.assertEqual(len(result.timeline.periods), 3)
        
        # Period 1: 3000 + 500 = 3500
        self.assertEqual(result.timeline.periods[0].value.value, 3500)
        self.assertEqual(result.timeline.periods[0].start_date, datetime(2024, 1, 1))
        self.assertEqual(result.timeline.periods[0].end_date, datetime(2024, 2, 1))
        
        # Period 2: 3100 + 600 = 3700
        self.assertEqual(result.timeline.periods[1].value.value, 3700)
        
        # Period 3: 3200 + 700 = 3900
        self.assertEqual(result.timeline.periods[2].value.value, 3900)
    
    def test_timeline_scalar_addition(self):
        """Test adding a timeline value and a scalar constant."""
        # Create a worker
        worker = RuntimeObject(object_type_naam="Werknemer", instance_id="w1")
        self.context.add_object(worker)
        
        # Set timeline for salaris
        salaris_periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 2, 1),
                value=Value(value=3000, datatype="Numeriek(getal)", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 2, 1),
                end_date=datetime(2024, 3, 1),
                value=Value(value=3100, datatype="Numeriek(getal)", unit="euro")
            )
        ]
        salaris_timeline = Timeline(periods=salaris_periods, granularity="maand")
        salaris_value = TimelineValue(timeline=salaris_timeline)
        self.context.set_timeline_attribute(worker, "salaris", salaris_value)
        
        # Set a scalar parameter
        self.context.set_parameter("vaste waarde", 200, unit="euro")
        
        # Create expression: salaris + vaste waarde
        from regelspraak.ast import BinaryExpression, AttributeReference, ParameterReference, Operator
        
        salaris_ref = AttributeReference(path=["salaris"], span=None)
        vaste_ref = ParameterReference(parameter_name="vaste waarde", span=None)
        add_expr = BinaryExpression(
            left=salaris_ref,
            right=vaste_ref,
            operator=Operator.PLUS,
            span=None
        )
        
        # Evaluate the timeline expression
        self.context.current_instance = worker
        result = self.evaluator._evaluate_timeline_expression(add_expr)
        
        # Check that result is a TimelineValue
        self.assertIsInstance(result, TimelineValue)
        
        # Check periods - should have same structure as input timeline
        self.assertEqual(len(result.timeline.periods), 2)
        
        # Period 1: 3000 + 200 = 3200
        self.assertEqual(result.timeline.periods[0].value.value, 3200)
        
        # Period 2: 3100 + 200 = 3300
        self.assertEqual(result.timeline.periods[1].value.value, 3300)
    
    def test_mixed_granularity_timelines(self):
        """Test operations on timelines with different granularities (dag + maand)."""
        # Create a worker
        worker = RuntimeObject(object_type_naam="Werknemer", instance_id="w1")
        self.context.add_object(worker)
        
        # Set timeline for salaris (monthly)
        salaris_periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 2, 1),
                value=Value(value=3000, datatype="Numeriek(getal)", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 2, 1),
                end_date=datetime(2024, 3, 1),
                value=Value(value=3100, datatype="Numeriek(getal)", unit="euro")
            )
        ]
        salaris_timeline = Timeline(periods=salaris_periods, granularity="maand")
        salaris_value = TimelineValue(timeline=salaris_timeline)
        self.context.set_timeline_attribute(worker, "salaris", salaris_value)
        
        # Set timeline for daginkomen (daily) - spans part of the month
        dag_periods = [
            Period(
                start_date=datetime(2024, 1, 15),
                end_date=datetime(2024, 1, 20),
                value=Value(value=50, datatype="Numeriek(getal)", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 1, 20),
                end_date=datetime(2024, 2, 10),
                value=Value(value=75, datatype="Numeriek(getal)", unit="euro")
            )
        ]
        dag_timeline = Timeline(periods=dag_periods, granularity="dag")
        dag_value = TimelineValue(timeline=dag_timeline)
        self.context.set_timeline_attribute(worker, "daginkomen", dag_value)
        
        # Create expression: salaris + daginkomen
        from regelspraak.ast import BinaryExpression, AttributeReference, Operator
        
        salaris_ref = AttributeReference(path=["salaris"], span=None)
        dag_ref = AttributeReference(path=["daginkomen"], span=None)
        add_expr = BinaryExpression(
            left=salaris_ref,
            right=dag_ref,
            operator=Operator.PLUS,
            span=None
        )
        
        # Evaluate the timeline expression
        self.context.current_instance = worker
        result = self.evaluator._evaluate_timeline_expression(add_expr)
        
        # Check that result has finest granularity (dag)
        self.assertEqual(result.timeline.granularity, "dag")
        
        # Should have knips at all transition points:
        # - 2024-01-01 (salaris start)
        # - 2024-01-15 (daginkomen start)
        # - 2024-01-20 (daginkomen change)
        # - 2024-02-01 (salaris change)
        # - 2024-02-10 (daginkomen end)
        # - 2024-03-01 (salaris end)
        
        # Verify some key periods
        # From Jan 1-15: salaris=3000, daginkomen=empty(0)
        period_jan1_15 = next(p for p in result.timeline.periods 
                             if p.start_date == datetime(2024, 1, 1))
        self.assertEqual(period_jan1_15.value.value, 3000)
        
        # From Jan 15-20: salaris=3000, daginkomen=50
        period_jan15_20 = next(p for p in result.timeline.periods 
                              if p.start_date == datetime(2024, 1, 15))
        self.assertEqual(period_jan15_20.value.value, 3050)
        
        # From Jan 20-Feb 1: salaris=3000, daginkomen=75
        period_jan20_feb1 = next(p for p in result.timeline.periods 
                                if p.start_date == datetime(2024, 1, 20))
        self.assertEqual(period_jan20_feb1.value.value, 3075)
    
    def test_rule_with_timeline_expression(self):
        """Test executing a rule that creates a timeline result."""
        # Create a worker
        worker = RuntimeObject(object_type_naam="Werknemer", instance_id="w1")
        self.context.add_object(worker)
        
        # Set timeline values
        salaris_periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 2, 1),
                value=Value(value=3000, datatype="Numeriek(getal)", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 2, 1),
                end_date=datetime(2024, 3, 1),
                value=Value(value=3200, datatype="Numeriek(getal)", unit="euro")
            )
        ]
        salaris_timeline = Timeline(periods=salaris_periods, granularity="maand")
        salaris_value = TimelineValue(timeline=salaris_timeline)
        self.context.set_timeline_attribute(worker, "salaris", salaris_value)
        
        dag_periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 1, 15),
                value=Value(value=100, datatype="Numeriek(getal)", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 1, 15),
                end_date=datetime(2024, 3, 1),
                value=Value(value=150, datatype="Numeriek(getal)", unit="euro")
            )
        ]
        dag_timeline = Timeline(periods=dag_periods, granularity="dag")
        dag_value = TimelineValue(timeline=dag_timeline)
        self.context.set_timeline_attribute(worker, "daginkomen", dag_value)
        
        # Execute the model - the rule should calculate totaal inkomen
        self.evaluator.execute_model(self.model)
        
        # Check that totaal inkomen is a timeline
        self.assertIn("totaal inkomen", worker.timeline_attributen)
        totaal_timeline = worker.timeline_attributen["totaal inkomen"]
        
        # Should have dag granularity (finest)
        self.assertEqual(totaal_timeline.timeline.granularity, "dag")
        
        # Check some values
        # Jan 1-15: 3000 + 100 = 3100
        val_jan1 = totaal_timeline.get_value_at(datetime(2024, 1, 5))
        self.assertEqual(val_jan1.value, 3100)
        
        # Jan 15-Feb 1: 3000 + 150 = 3150
        val_jan20 = totaal_timeline.get_value_at(datetime(2024, 1, 20))
        self.assertEqual(val_jan20.value, 3150)
        
        # Feb 1-Mar 1: 3200 + 150 = 3350
        val_feb15 = totaal_timeline.get_value_at(datetime(2024, 2, 15))
        self.assertEqual(val_feb15.value, 3350)
    
    def test_knip_merging_removes_redundant(self):
        """Test that redundant knips are removed when values don't change."""
        # Create a worker
        worker = RuntimeObject(object_type_naam="Werknemer", instance_id="w1")
        self.context.add_object(worker)
        
        # Set timeline with redundant values
        periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 2, 1),
                value=Value(value=1000, datatype="Numeriek(getal)", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 2, 1),
                end_date=datetime(2024, 3, 1),
                value=Value(value=1000, datatype="Numeriek(getal)", unit="euro")  # Same value
            ),
            Period(
                start_date=datetime(2024, 3, 1),
                end_date=datetime(2024, 4, 1),
                value=Value(value=2000, datatype="Numeriek(getal)", unit="euro")  # Different
            )
        ]
        timeline = Timeline(periods=periods, granularity="maand")
        timeline_value = TimelineValue(timeline=timeline)
        self.context.set_timeline_attribute(worker, "salaris", timeline_value)
        
        # Add a constant to force evaluation
        from regelspraak.ast import BinaryExpression, AttributeReference, Literal, Operator
        
        salaris_ref = AttributeReference(path=["salaris"], span=None)
        zero_lit = Literal(value=0, span=None)
        add_expr = BinaryExpression(
            left=salaris_ref,
            right=zero_lit,
            operator=Operator.PLUS,
            span=None
        )
        
        # Evaluate
        self.context.current_instance = worker
        result = self.evaluator._evaluate_timeline_expression(add_expr)
        
        # Should have merged the first two periods
        self.assertEqual(len(result.timeline.periods), 2)
        
        # First period: Jan-Mar with value 1000
        self.assertEqual(result.timeline.periods[0].start_date, datetime(2024, 1, 1))
        self.assertEqual(result.timeline.periods[0].end_date, datetime(2024, 3, 1))
        self.assertEqual(result.timeline.periods[0].value.value, 1000)
        
        # Second period: Mar-Apr with value 2000
        self.assertEqual(result.timeline.periods[1].start_date, datetime(2024, 3, 1))
        self.assertEqual(result.timeline.periods[1].end_date, datetime(2024, 4, 1))
        self.assertEqual(result.timeline.periods[1].value.value, 2000)
    
    def test_empty_period_handling_addition(self):
        """Test that empty periods in timeline addition are treated as 0."""
        # Create a worker
        worker = RuntimeObject(object_type_naam="Werknemer", instance_id="w1")
        self.context.add_object(worker)
        
        # Set timeline with limited range
        periods = [
            Period(
                start_date=datetime(2024, 2, 1),
                end_date=datetime(2024, 3, 1),
                value=Value(value=1000, datatype="Numeriek(getal)", unit="euro")
            )
        ]
        timeline = Timeline(periods=periods, granularity="maand")
        timeline_value = TimelineValue(timeline=timeline)
        self.context.set_timeline_attribute(worker, "salaris", timeline_value)
        
        # Set constant parameter
        self.context.set_parameter("vaste waarde", 500, unit="euro")
        
        # Create expression
        from regelspraak.ast import BinaryExpression, AttributeReference, ParameterReference, Operator
        
        salaris_ref = AttributeReference(path=["salaris"], span=None)
        param_ref = ParameterReference(parameter_name="vaste waarde", span=None)
        add_expr = BinaryExpression(
            left=salaris_ref,
            right=param_ref,
            operator=Operator.PLUS,
            span=None
        )
        
        # Set evaluation date in empty period (before timeline data)
        self.context.current_instance = worker
        self.context.evaluation_date = datetime(2024, 1, 15)
        
        # Should treat empty timeline value as 0
        result = self.evaluator.evaluate_expression(add_expr)
        self.assertEqual(result.value, 500)  # 0 + 500
        
        # Set evaluation date within timeline range
        self.context.evaluation_date = datetime(2024, 2, 15)
        result = self.evaluator.evaluate_expression(add_expr)
        self.assertEqual(result.value, 1500)  # 1000 + 500


if __name__ == '__main__':
    unittest.main()