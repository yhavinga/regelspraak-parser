"""Integration tests for dagsoort (day type) predicate."""
import unittest
from datetime import date, datetime
from src.regelspraak.parsing import parse_text
from src.regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from src.regelspraak.engine import Evaluator
from src.regelspraak.units import UnitRegistry


class TestDagsoortIntegration(unittest.TestCase):
    """Test dagsoort predicate functionality."""
    
    def setUp(self):
        """Set up test environment."""
        self.unit_registry = UnitRegistry()
    
    def test_dagsoort_declaration_and_definition(self):
        """Test declaring a dagsoort and defining when a day is that type."""
        model_text = """
        Dagsoort de kerstdag (mv: kerstdagen);
        
        Regel Kerstdag
            geldig altijd
                Een dag is een kerstdag
                indien de dag aan alle volgende voorwaarden voldoet:
                - de maand uit (de dag) is gelijk aan 12
                - de dag voldoet aan ten minste één van de volgende voorwaarden:
                    .. de dag uit (de dag) is gelijk aan 25
                    .. de dag uit (de dag) is gelijk aan 26.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Check dagsoort was parsed
        self.assertIn("kerstdag", model.dagsoorten)
        dagsoort = model.dagsoorten["kerstdag"]
        self.assertEqual(dagsoort.naam, "kerstdag")
        self.assertEqual(dagsoort.meervoud, "kerstdagen")
        
        # Check rule was parsed
        self.assertEqual(len(model.regels), 1)
        regel = model.regels[0]
        self.assertEqual(regel.naam, "Kerstdag")
    
    def test_dagsoort_predicate_positive(self):
        """Test that dates matching dagsoort definition return true."""
        model_text = """
        Objecttype de Vlucht
            de vluchtdatum Datum in dagen;
            is op_kerstdag kenmerk (bijvoeglijk);
        
        Dagsoort de kerstdag (mv: kerstdagen);
        
        Regel Kerstdag definitie
            geldig altijd
                Een dag is een kerstdag
                indien de dag aan alle volgende voorwaarden voldoet:
                - de maand uit (de dag) is gelijk aan 12
                - de dag voldoet aan ten minste één van de volgende voorwaarden:
                    .. de dag uit (de dag) is gelijk aan 25
                    .. de dag uit (de dag) is gelijk aan 26.
        
        Regel Vlucht op kerstdag
            geldig altijd
                Een Vlucht is op_kerstdag indien de vluchtdatum van de vlucht is een dagsoort kerstdag.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add flight on December 25th
        flight1 = RuntimeObject(
            object_type_naam="Vlucht",
            instance_id="flight1"
        )
        flight1.attributen["vluchtdatum"] = Value(
            value=date(2023, 12, 25),
            datatype="Datum in dagen"
        )
        context.add_object(flight1)
        
        # Add flight on December 26th
        flight2 = RuntimeObject(
            object_type_naam="Vlucht",
            instance_id="flight2"
        )
        flight2.attributen["vluchtdatum"] = Value(
            value=date(2023, 12, 26),
            datatype="Datum in dagen"
        )
        context.add_object(flight2)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check results
        self.assertEqual(flight1.kenmerken.get("op_kerstdag"), True)
        self.assertEqual(flight2.kenmerken.get("op_kerstdag"), True)
    
    def test_dagsoort_predicate_negative(self):
        """Test that dates not matching dagsoort definition return false."""
        model_text = """
        Objecttype de Vlucht
            de vluchtdatum Datum in dagen;
            is op_kerstdag kenmerk (bijvoeglijk);
        
        Dagsoort de kerstdag (mv: kerstdagen);
        
        Regel Kerstdag definitie
            geldig altijd
                Een dag is een kerstdag
                indien de dag aan alle volgende voorwaarden voldoet:
                - de maand uit (de dag) is gelijk aan 12
                - de dag voldoet aan ten minste één van de volgende voorwaarden:
                    .. de dag uit (de dag) is gelijk aan 25
                    .. de dag uit (de dag) is gelijk aan 26.
        
        Regel Vlucht op kerstdag
            geldig altijd
                Een Vlucht is op_kerstdag indien de vluchtdatum van de vlucht is een dagsoort kerstdag.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add flight on December 24th (not Christmas)
        flight = RuntimeObject(
            object_type_naam="Vlucht",
            instance_id="flight1"
        )
        flight.attributen["vluchtdatum"] = Value(
            value=date(2023, 12, 24),
            datatype="Datum in dagen"
        )
        context.add_object(flight)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check result - should not have kenmerk set to true
        self.assertNotEqual(flight.kenmerken.get("op_kerstdag"), True)
    
    def test_geen_dagsoort_predicate(self):
        """Test 'is geen dagsoort' predicate."""
        model_text = """
        Objecttype de Vlucht
            de vluchtdatum Datum in dagen;
            is niet_op_kerstdag kenmerk (bijvoeglijk);
        
        Dagsoort de kerstdag (mv: kerstdagen);
        
        Regel Kerstdag definitie
            geldig altijd
                Een dag is een kerstdag
                indien de dag aan alle volgende voorwaarden voldoet:
                - de maand uit (de dag) is gelijk aan 12
                - de dag voldoet aan ten minste één van de volgende voorwaarden:
                    .. de dag uit (de dag) is gelijk aan 25
                    .. de dag uit (de dag) is gelijk aan 26.
        
        Regel Geen kerstdag vlucht
            geldig altijd
                Een Vlucht is niet_op_kerstdag indien de vluchtdatum van de vlucht is geen dagsoort kerstdag.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add flight NOT on December 25th
        flight = RuntimeObject(
            object_type_naam="Vlucht",
            instance_id="flight1"
        )
        flight.attributen["vluchtdatum"] = Value(
            value=date(2023, 12, 24),
            datatype="Datum in dagen"
        )
        context.add_object(flight)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check result - should have kenmerk set to true
        self.assertEqual(flight.kenmerken.get("niet_op_kerstdag"), True)
    
    def test_datetime_dagsoort_check(self):
        """Test dagsoort check with datetime values."""
        model_text = """
        Objecttype het Evenement
            het tijdstip Datum en tijd in millisecondes;
            is op_nieuwjaarsdag kenmerk (bijvoeglijk);
        
        Dagsoort de nieuwjaarsdag (mv: nieuwjaarsdagen);
        
        Regel Nieuwjaarsdag definitie
            geldig altijd
                Een dag is een nieuwjaarsdag
                indien de dag aan alle volgende voorwaarden voldoet:
                - de maand uit (de dag) is gelijk aan 1
                - de dag uit (de dag) is gelijk aan 1.
        
        Regel Evenement op nieuwjaarsdag
            geldig altijd
                Een Evenement is op_nieuwjaarsdag indien het tijdstip van het evenement is een dagsoort nieuwjaarsdag.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add event on New Year's Day
        event = RuntimeObject(
            object_type_naam="Evenement",
            instance_id="event1"
        )
        # Use timestamp in milliseconds for January 1, 2024
        event.attributen["tijdstip"] = Value(
            value=datetime(2024, 1, 1, 0, 0, 0).timestamp() * 1000,
            datatype="Datum en tijd in millisecondes"
        )
        context.add_object(event)
        
        # Execute model
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check result
        self.assertEqual(event.kenmerken.get("op_nieuwjaarsdag"), True)
    
    def test_undefined_dagsoort_error(self):
        """Test that using undefined dagsoort raises appropriate error."""
        model_text = """
        Objecttype de Vlucht
            de vluchtdatum Datum in dagen;
            is op_feestdag kenmerk (bijvoeglijk);
        
        // Note: No dagsoort 'feestdag' is declared
        
        Regel Vlucht op feestdag
            geldig altijd
                Een Vlucht is op_feestdag indien de vluchtdatum van de vlucht is een dagsoort feestdag.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Create runtime context
        context = RuntimeContext(domain_model=model, unit_registry=self.unit_registry)
        
        # Add a flight
        flight = RuntimeObject(
            object_type_naam="Vlucht",
            instance_id="flight1"
        )
        flight.attributen["vluchtdatum"] = Value(
            value=date(2023, 12, 25),
            datatype="Datum in dagen"
        )
        context.add_object(flight)
        
        # Execute model - should not crash but log warning
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        
        # Check result - should not have kenmerk set
        self.assertNotEqual(flight.kenmerken.get("op_feestdag"), True)
    
    def test_complex_dagsoort_definition(self):
        """Test more complex dagsoort definitions with multiple conditions."""
        model_text = """
        Objecttype de Vlucht
            de vluchtdatum Datum in dagen;
            is op_weekend kenmerk (bijvoeglijk);
        
        Dagsoort de weekenddag (mv: weekenddagen);
        
        Regel Weekenddag definitie
            geldig altijd
                Een dag is een weekenddag
                indien de dag aan ten minste één van de volgende voorwaarden voldoet:
                - de dag uit (de dag) is gelijk aan 6
                - de dag uit (de dag) is gelijk aan 7.
        
        Regel Vlucht op weekend
            geldig altijd
                Een Vlucht is op_weekend indien de vluchtdatum van de vlucht is een dagsoort weekenddag.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Check dagsoort was parsed
        self.assertIn("weekenddag", model.dagsoorten)
        self.assertEqual(len(model.regels), 2)


if __name__ == '__main__':
    unittest.main()