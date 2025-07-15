"""Tests for timeline runtime functionality including storage and retrieval."""
import unittest
from datetime import datetime, date
from regelspraak.parsing import parse_text
from regelspraak.ast import DomainModel, Period, Timeline
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value, TimelineValue
from regelspraak.engine import Evaluator
from regelspraak.errors import RuntimeError


class TestTimelineRuntime(unittest.TestCase):
    """Test timeline storage and retrieval in runtime."""
    
    def setUp(self):
        """Set up test model and context."""
        # Create a simple domain model with timeline attributes
        model_text = """
        Parameter de dagkoers : Numeriek (getal) met eenheid euro voor elke dag;
        Parameter het maandbudget : Bedrag voor elke maand;
        
        Objecttype de Werknemer
            het salaris Numeriek (getal) met eenheid euro voor elke maand;
            de bonus Bedrag voor elk jaar;
            de naam Tekst;
        """
        self.model = parse_text(model_text)
        self.context = RuntimeContext(domain_model=self.model)
        self.evaluator = Evaluator(self.context)
    
    def test_timeline_value_creation(self):
        """Test creating a TimelineValue with periods."""
        # Create periods
        period1 = Period(
            start_date=datetime(2024, 1, 1),
            end_date=datetime(2024, 2, 1),
            value=Value(value=1000, datatype="Numeriek", unit="euro")
        )
        period2 = Period(
            start_date=datetime(2024, 2, 1),
            end_date=datetime(2024, 3, 1),
            value=Value(value=1100, datatype="Numeriek", unit="euro")
        )
        
        # Create timeline
        timeline = Timeline(periods=[period1, period2], granularity="maand")
        timeline_value = TimelineValue(timeline=timeline)
        
        # Test retrieval at different dates
        self.assertEqual(timeline_value.get_value_at(datetime(2024, 1, 15)).value, 1000)
        self.assertEqual(timeline_value.get_value_at(datetime(2024, 2, 15)).value, 1100)
        self.assertIsNone(timeline_value.get_value_at(datetime(2023, 12, 15)))
    
    def test_timeline_parameter_storage(self):
        """Test storing and retrieving timeline parameters."""
        # Create timeline for dagkoers
        periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 1, 2),
                value=Value(value=1.2, datatype="Numeriek(getal)", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 1, 2),
                end_date=datetime(2024, 1, 3),
                value=Value(value=1.3, datatype="Numeriek(getal)", unit="euro")
            )
        ]
        timeline = Timeline(periods=periods, granularity="dag")
        timeline_value = TimelineValue(timeline=timeline)
        
        # Set timeline parameter
        self.context.set_timeline_parameter("dagkoers", timeline_value)
        
        # Test retrieval with different dates
        self.context.evaluation_date = datetime(2024, 1, 1, 12, 0)  # Noon on Jan 1
        value = self.context.get_parameter("dagkoers")
        self.assertEqual(value.value, 1.2)
        self.assertEqual(value.unit, "euro")
        
        self.context.evaluation_date = datetime(2024, 1, 2, 12, 0)  # Noon on Jan 2
        value = self.context.get_parameter("dagkoers")
        self.assertEqual(value.value, 1.3)
    
    def test_timeline_attribute_storage(self):
        """Test storing and retrieving timeline attributes on objects."""
        # Create a worker instance
        worker = RuntimeObject(object_type_naam="Werknemer", instance_id="w1")
        self.context.add_object(worker)
        
        # Create timeline for salaris
        periods = [
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
        timeline = Timeline(periods=periods, granularity="maand")
        timeline_value = TimelineValue(timeline=timeline)
        
        # Set timeline attribute
        self.context.set_timeline_attribute(worker, "salaris", timeline_value)
        
        # Test retrieval
        self.context.evaluation_date = datetime(2024, 1, 15)
        value = self.context.get_attribute(worker, "salaris")
        self.assertEqual(value.value, 3000)
        
        self.context.evaluation_date = datetime(2024, 2, 15)
        value = self.context.get_attribute(worker, "salaris")
        self.assertEqual(value.value, 3100)
    
    def test_timeline_data_loading(self):
        """Test loading timeline data from dictionary."""
        data = {
            "timeline_parameters": {
                "dagkoers": {
                    "granularity": "dag",
                    "periods": [
                        {"from": "2024-01-01", "to": "2024-01-02", "value": 1.2, "unit": "euro"},
                        {"from": "2024-01-02", "to": "2024-01-03", "value": 1.3, "unit": "euro"}
                    ]
                }
            },
            "instances": [
                {
                    "object_type_naam": "Werknemer",
                    "instance_id": "w1",
                    "attributen": {
                        "naam": "Jan"
                    },
                    "timeline_attributen": {
                        "salaris": {
                            "granularity": "maand",
                            "periods": [
                                {"from": "2024-01-01", "to": "2024-02-01", "value": 3000},
                                {"from": "2024-02-01", "to": "2024-03-01", "value": 3100}
                            ]
                        }
                    }
                }
            ]
        }
        
        # Load data
        self.context.load_from_dict(data)
        
        # Test parameter loading
        self.context.evaluation_date = datetime(2024, 1, 1, 12, 0)
        param_value = self.context.get_parameter("dagkoers")
        self.assertEqual(param_value.value, 1.2)
        
        # Test instance loading
        workers = self.context.find_objects_by_type("Werknemer")
        self.assertEqual(len(workers), 1)
        worker = workers[0]
        
        # Test timeline attribute
        self.context.evaluation_date = datetime(2024, 1, 15)
        salary = self.context.get_attribute(worker, "salaris")
        self.assertEqual(salary.value, 3000)
        
        # Test regular attribute
        name = self.context.get_attribute(worker, "naam")
        self.assertEqual(name.value, "Jan")
    
    def test_missing_timeline_value_error(self):
        """Test error when timeline has no value at evaluation date."""
        # Create timeline with gap
        periods = [
            Period(
                start_date=datetime(2024, 1, 1),
                end_date=datetime(2024, 1, 10),
                value=Value(value=100, datatype="Numeriek", unit="euro")
            ),
            Period(
                start_date=datetime(2024, 1, 20),
                end_date=datetime(2024, 1, 31),
                value=Value(value=200, datatype="Numeriek", unit="euro")
            )
        ]
        timeline = Timeline(periods=periods, granularity="dag")
        timeline_value = TimelineValue(timeline=timeline)
        
        self.context.set_timeline_parameter("dagkoers", timeline_value)
        
        # Try to get value in the gap
        self.context.evaluation_date = datetime(2024, 1, 15)
        with self.assertRaises(RuntimeError) as cm:
            self.context.get_parameter("dagkoers")
        self.assertIn("has no value at date", str(cm.exception))
    
    def test_timeline_without_evaluation_date_error(self):
        """Test error when accessing timeline without evaluation date."""
        # Set timeline parameter
        periods = [Period(
            start_date=datetime(2024, 1, 1),
            end_date=datetime(2024, 2, 1),
            value=Value(value=100, datatype="Numeriek", unit="euro")
        )]
        timeline = Timeline(periods=periods, granularity="maand")
        timeline_value = TimelineValue(timeline=timeline)
        self.context.set_timeline_parameter("maandbudget", timeline_value)
        
        # Clear evaluation date
        self.context.evaluation_date = None
        
        # Should raise error
        with self.assertRaises(RuntimeError) as cm:
            self.context.get_parameter("maandbudget")
        self.assertIn("requires evaluation_date", str(cm.exception))
    
    def test_non_timeline_parameter_with_timeline_def(self):
        """Test that non-timeline parameters still work when timeline is defined."""
        # Set regular parameter (even though it has timeline in definition)
        self.context.set_parameter("dagkoers", 1.5, unit="euro")
        
        # Should work without evaluation date
        self.context.evaluation_date = None
        value = self.context.get_parameter("dagkoers")
        self.assertEqual(value.value, 1.5)
        self.assertEqual(value.unit, "euro")
    
    def test_period_ordering(self):
        """Test that periods are maintained in chronological order."""
        timeline_value = TimelineValue(timeline=Timeline(periods=[], granularity="dag"))
        
        # Add periods out of order
        period2 = Period(
            start_date=datetime(2024, 2, 1),
            end_date=datetime(2024, 3, 1),
            value=Value(value=200, datatype="Numeriek", unit=None)
        )
        period1 = Period(
            start_date=datetime(2024, 1, 1),
            end_date=datetime(2024, 2, 1),
            value=Value(value=100, datatype="Numeriek", unit=None)
        )
        period3 = Period(
            start_date=datetime(2024, 3, 1),
            end_date=datetime(2024, 4, 1),
            value=Value(value=300, datatype="Numeriek", unit=None)
        )
        
        timeline_value.add_period(period2)
        timeline_value.add_period(period1)
        timeline_value.add_period(period3)
        
        # Check periods are in order
        periods = timeline_value.timeline.periods
        self.assertEqual(len(periods), 3)
        self.assertEqual(periods[0].value.value, 100)
        self.assertEqual(periods[1].value.value, 200)
        self.assertEqual(periods[2].value.value, 300)


if __name__ == '__main__':
    unittest.main()