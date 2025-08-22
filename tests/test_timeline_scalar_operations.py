"""
Tests for timeline × scalar operations to ensure correct behavior.

Per RegelSpraak v2.1.0 specification:
- Section 6.2-6.5: Binary arithmetic operations work with numeric values
- Section 5.1.4: Timeline expressions evaluate per period
- Scalar values should be broadcast across all timeline periods
"""

import unittest
from datetime import datetime
from decimal import Decimal

from regelspraak.ast import (
    BinaryExpression, Literal, AttributeReference, Operator,
    Period, Timeline
)
from regelspraak.runtime import Value, TimelineValue, RuntimeObject, RuntimeContext
from regelspraak.engine import Evaluator
from regelspraak.ast import DomainModel, ObjectType, Attribuut


class TestTimelineScalarOperations(unittest.TestCase):
    """Test timeline × scalar operations."""
    
    def setUp(self):
        """Set up test environment."""
        self.domain_model = DomainModel(
            parameters={},
            domeinen={},
            objecttypes={
                'TestObject': ObjectType(
                    naam='TestObject',
                    attributen={
                        'maandBedrag': Attribuut(
                            naam='maandBedrag',
                            datatype='Bedrag',
                            eenheid='€/maand',
                            timeline=Timeline(
                                periods=[],
                                granularity='maand'
                            ),
                            span=None
                        ),
                        'factor': Attribuut(
                            naam='factor',
                            datatype='Numeriek',
                            eenheid=None,
                            timeline=None,
                            span=None
                        )
                    },
                    kenmerken={},
                    meervoud='TestObjecten',
                    bezield=False,
                    span=None
                )
            },
            feittypes={},
            regels=[]
        )
        
        self.context = RuntimeContext(domain_model=self.domain_model)
        self.engine = Evaluator(self.context)
        
        # Create test instance
        self.test_obj = RuntimeObject(
            object_type_naam='TestObject',
            instance_id='test1'
        )
        self.context.objects['test1'] = self.test_obj
        self.context.current_instance = self.test_obj
    
    def test_timeline_plus_scalar(self):
        """Test timeline + scalar operation."""
        # Create timeline with two periods
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('100'), datatype='Bedrag', unit='€/maand')
                ),
                Period(
                    start_date=datetime(2024, 2, 1),
                    end_date=datetime(2024, 3, 1),
                    value=Value(value=Decimal('200'), datatype='Bedrag', unit='€/maand')
                )
            ],
            granularity='maand'
        )
        
        # Set timeline attribute
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: maandBedrag + 50
        expr = BinaryExpression(
            left=AttributeReference(path=['maandBedrag'], span=None),
            operator=Operator.PLUS,
            right=Literal(value=Decimal('50'), datatype='Bedrag', unit='€/maand', span=None),
            span=None
        )
        
        # Evaluate as timeline expression
        result = self.engine._evaluate_timeline_expression(expr)
        
        # Check result
        self.assertIsInstance(result, TimelineValue)
        self.assertEqual(len(result.timeline.periods), 2)
        
        # First period: 100 + 50 = 150
        self.assertEqual(result.timeline.periods[0].value.value, Decimal('150'))
        self.assertEqual(result.timeline.periods[0].value.unit, '€/maand')
        
        # Second period: 200 + 50 = 250
        self.assertEqual(result.timeline.periods[1].value.value, Decimal('250'))
        self.assertEqual(result.timeline.periods[1].value.unit, '€/maand')
    
    def test_scalar_plus_timeline(self):
        """Test scalar + timeline operation (commutative)."""
        # Create timeline
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('100'), datatype='Bedrag', unit='€')
                )
            ],
            granularity='maand'
        )
        
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: 50 + maandBedrag
        expr = BinaryExpression(
            left=Literal(value=Decimal('50'), datatype='Bedrag', unit='€', span=None),
            operator=Operator.PLUS,
            right=AttributeReference(path=['maandBedrag'], span=None),
            span=None
        )
        
        result = self.engine._evaluate_timeline_expression(expr)
        
        self.assertIsInstance(result, TimelineValue)
        # 50 + 100 = 150
        self.assertEqual(result.timeline.periods[0].value.value, Decimal('150'))
    
    def test_timeline_minus_scalar(self):
        """Test timeline - scalar operation."""
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('100'), datatype='Bedrag', unit='€')
                )
            ],
            granularity='maand'
        )
        
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: maandBedrag - 30
        expr = BinaryExpression(
            left=AttributeReference(path=['maandBedrag'], span=None),
            operator=Operator.MIN,
            right=Literal(value=Decimal('30'), datatype='Bedrag', unit='€', span=None),
            span=None
        )
        
        result = self.engine._evaluate_timeline_expression(expr)
        
        # 100 - 30 = 70
        self.assertEqual(result.timeline.periods[0].value.value, Decimal('70'))
    
    def test_scalar_minus_timeline(self):
        """Test scalar - timeline operation (non-commutative)."""
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('30'), datatype='Bedrag', unit='€')
                )
            ],
            granularity='maand'
        )
        
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: 100 - maandBedrag
        expr = BinaryExpression(
            left=Literal(value=Decimal('100'), datatype='Bedrag', unit='€', span=None),
            operator=Operator.MIN,
            right=AttributeReference(path=['maandBedrag'], span=None),
            span=None
        )
        
        result = self.engine._evaluate_timeline_expression(expr)
        
        # 100 - 30 = 70
        self.assertEqual(result.timeline.periods[0].value.value, Decimal('70'))
    
    def test_timeline_times_scalar(self):
        """Test timeline * scalar operation."""
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('100'), datatype='Bedrag', unit='€/maand')
                ),
                Period(
                    start_date=datetime(2024, 2, 1),
                    end_date=datetime(2024, 3, 1),
                    value=Value(value=Decimal('200'), datatype='Bedrag', unit='€/maand')
                )
            ],
            granularity='maand'
        )
        
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: maandBedrag * 2
        expr = BinaryExpression(
            left=AttributeReference(path=['maandBedrag'], span=None),
            operator=Operator.MAAL,
            right=Literal(value=Decimal('2'), datatype='Numeriek', unit=None, span=None),
            span=None
        )
        
        result = self.engine._evaluate_timeline_expression(expr)
        
        # First period: 100 * 2 = 200
        self.assertEqual(result.timeline.periods[0].value.value, Decimal('200'))
        # Second period: 200 * 2 = 400
        self.assertEqual(result.timeline.periods[1].value.value, Decimal('400'))
        # Unit should be preserved
        self.assertEqual(result.timeline.periods[0].value.unit, '€/maand')
    
    def test_scalar_times_timeline(self):
        """Test scalar * timeline operation (commutative)."""
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('100'), datatype='Bedrag', unit='€')
                )
            ],
            granularity='maand'
        )
        
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: 3 * maandBedrag
        expr = BinaryExpression(
            left=Literal(value=Decimal('3'), datatype='Numeriek', unit=None, span=None),
            operator=Operator.MAAL,
            right=AttributeReference(path=['maandBedrag'], span=None),
            span=None
        )
        
        result = self.engine._evaluate_timeline_expression(expr)
        
        # 3 * 100 = 300
        self.assertEqual(result.timeline.periods[0].value.value, Decimal('300'))
    
    def test_timeline_divided_by_scalar(self):
        """Test timeline / scalar operation."""
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('100'), datatype='Bedrag', unit='€')
                )
            ],
            granularity='maand'
        )
        
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: maandBedrag / 2
        expr = BinaryExpression(
            left=AttributeReference(path=['maandBedrag'], span=None),
            operator=Operator.GEDEELD_DOOR,
            right=Literal(value=Decimal('2'), datatype='Numeriek', unit=None, span=None),
            span=None
        )
        
        result = self.engine._evaluate_timeline_expression(expr)
        
        # 100 / 2 = 50
        self.assertEqual(result.timeline.periods[0].value.value, Decimal('50'))
    
    def test_scalar_divided_by_timeline(self):
        """Test scalar / timeline operation (non-commutative)."""
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('2'), datatype='Numeriek', unit=None)
                )
            ],
            granularity='maand'
        )
        
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: 100 / maandBedrag
        expr = BinaryExpression(
            left=Literal(value=Decimal('100'), datatype='Numeriek', unit=None, span=None),
            operator=Operator.GEDEELD_DOOR,
            right=AttributeReference(path=['maandBedrag'], span=None),
            span=None
        )
        
        result = self.engine._evaluate_timeline_expression(expr)
        
        # 100 / 2 = 50
        self.assertEqual(result.timeline.periods[0].value.value, Decimal('50'))
    
    def test_timeline_with_empty_periods(self):
        """Test timeline operations with empty periods."""
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('100'), datatype='Bedrag', unit='€')
                ),
                Period(
                    start_date=datetime(2024, 2, 1),
                    end_date=datetime(2024, 3, 1),
                    value=None  # Empty period
                )
            ],
            granularity='maand'
        )
        
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: maandBedrag + 50
        expr = BinaryExpression(
            left=AttributeReference(path=['maandBedrag'], span=None),
            operator=Operator.PLUS,
            right=Literal(value=Decimal('50'), datatype='Bedrag', unit='€', span=None),
            span=None
        )
        
        result = self.engine._evaluate_timeline_expression(expr)
        
        # First period: 100 + 50 = 150
        self.assertEqual(result.timeline.periods[0].value.value, Decimal('150'))
        
        # Second period should have a value since scalar is added
        # In Python, empty + scalar = scalar (per spec tables in section 6)
        self.assertEqual(result.timeline.periods[1].value.value, Decimal('50'))
    
    def test_timeline_division_by_zero(self):
        """Test timeline / 0 should raise error."""
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('100'), datatype='Bedrag', unit='€')
                )
            ],
            granularity='maand'
        )
        
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: maandBedrag / 0
        expr = BinaryExpression(
            left=AttributeReference(path=['maandBedrag'], span=None),
            operator=Operator.GEDEELD_DOOR,
            right=Literal(value=Decimal('0'), datatype='Numeriek', unit=None, span=None),
            span=None
        )
        
        # Should raise division by zero error
        with self.assertRaises(Exception) as context:
            self.engine._evaluate_timeline_expression(expr)
        
        self.assertIn('division', str(context.exception).lower())
    
    def test_multiple_knips_with_scalar(self):
        """Test that scalar operations preserve timeline structure."""
        # Create timeline with multiple change points
        timeline = Timeline(
            periods=[
                Period(
                    start_date=datetime(2024, 1, 1),
                    end_date=datetime(2024, 1, 15),
                    value=Value(value=Decimal('100'), datatype='Bedrag', unit='€')
                ),
                Period(
                    start_date=datetime(2024, 1, 15),
                    end_date=datetime(2024, 2, 1),
                    value=Value(value=Decimal('150'), datatype='Bedrag', unit='€')
                ),
                Period(
                    start_date=datetime(2024, 2, 1),
                    end_date=datetime(2024, 3, 1),
                    value=Value(value=Decimal('200'), datatype='Bedrag', unit='€')
                )
            ],
            granularity='dag'
        )
        
        self.context.set_timeline_attribute(
            self.test_obj,
            'maandBedrag',
            TimelineValue(timeline=timeline),
            span=None
        )
        
        # Create expression: maandBedrag * 1.1 (10% increase)
        expr = BinaryExpression(
            left=AttributeReference(path=['maandBedrag'], span=None),
            operator=Operator.MAAL,
            right=Literal(value=Decimal('1.1'), datatype='Numeriek', unit=None, span=None),
            span=None
        )
        
        result = self.engine._evaluate_timeline_expression(expr)
        
        # Check all periods are preserved with correct values
        self.assertEqual(len(result.timeline.periods), 3)
        self.assertEqual(result.timeline.periods[0].value.value, Decimal('110'))  # 100 * 1.1
        self.assertEqual(result.timeline.periods[1].value.value, Decimal('165'))  # 150 * 1.1
        self.assertEqual(result.timeline.periods[2].value.value, Decimal('220'))  # 200 * 1.1
        
        # Check dates are preserved
        self.assertEqual(result.timeline.periods[0].start_date, datetime(2024, 1, 1))
        self.assertEqual(result.timeline.periods[0].end_date, datetime(2024, 1, 15))
        self.assertEqual(result.timeline.periods[1].start_date, datetime(2024, 1, 15))
        self.assertEqual(result.timeline.periods[2].end_date, datetime(2024, 3, 1))


if __name__ == '__main__':
    unittest.main()