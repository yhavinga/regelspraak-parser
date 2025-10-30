import unittest
import logging

from tests.test_base import RegelSpraakTestCase
from regelspraak.parsing import parse_text
from regelspraak.ast import DomainModel, Parameter, ObjectType, Kenmerk, Attribuut, Regel

from regelspraak.runtime import RuntimeContext, Value, RuntimeObject
from regelspraak.engine import Evaluator, PrintTraceSink

# Configure logging for visibility during tests
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class EngineSteelthreadTests(RegelSpraakTestCase):
    """Tests the Evaluator using the steel thread example."""

    def setUp(self):
        """Set up the test case with the steel thread RegelSpraak code."""
        super().setUp()
        self.steelthread_code = """
        Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr

        Objecttype de Natuurlijk persoon
            is minderjarig kenmerk (bijvoeglijk);
            de leeftijd Numeriek (geheel getal) met eenheid jr;

        Regel Kenmerktoekenning persoon minderjarig
            geldig altijd
                Een Natuurlijk persoon is minderjarig
                indien zijn leeftijd kleiner is dan de volwassenleeftijd.
        """
        # Parse the code to get the DomainModel
        try:
            self.domain_model = parse_text(self.steelthread_code)
            self.assertIsInstance(self.domain_model, DomainModel)
        except Exception as e:
            logger.error(f"Parsing failed during setUp: {e}")
            self.fail(f"Parsing failed during setUp: {e}")

        # Define expected parameter and object type names
        self.param_name = "volwassenleeftijd"
        self.object_type_name = "Natuurlijk persoon"
        self.attribute_name = "leeftijd"
        self.kenmerk_name = "minderjarig"

    def test_steelthread_evaluation(self):
        """Test evaluating the 'minderjarig' rule."""
        logger.info("Starting steelthread evaluation test...")

        # 1. Create RuntimeContext
        # Use PrintTraceSink for easy debugging during test runs
        trace_sink = PrintTraceSink() 
        context = RuntimeContext(domain_model=self.domain_model, trace_sink=trace_sink)

        # 2. Add Parameter value to context
        # Need to create Value object based on Parameter definition
        param_def = self.domain_model.parameters.get(self.param_name)
        self.assertIsNotNone(param_def, f"Parameter '{self.param_name}' definition not found in parsed model.")
        
        adult_age_value = 18 # The runtime value for the parameter
        context.add_parameter(
            self.param_name, 
            Value(value=adult_age_value, datatype=param_def.datatype, unit=param_def.eenheid)
        )
        logger.debug(f"Added parameter '{self.param_name}' with value {adult_age_value} to context.")

        # 3. Create RuntimeObject instances
        person_under_age = RuntimeObject(object_type_naam=self.object_type_name, instance_id="person_15")
        person_over_age = RuntimeObject(object_type_naam=self.object_type_name, instance_id="person_25")

        # Need attribute definition to create Value objects correctly
        obj_type_def = self.domain_model.objecttypes.get(self.object_type_name)
        self.assertIsNotNone(obj_type_def, f"ObjectType '{self.object_type_name}' definition not found.")
        attr_def = obj_type_def.attributen.get(self.attribute_name)
        self.assertIsNotNone(attr_def, f"Attribuut '{self.attribute_name}' definition not found.")

        # Set attribute values
        person_under_age.attributen[self.attribute_name] = Value(value=15, datatype=attr_def.datatype, unit=attr_def.eenheid)
        person_over_age.attributen[self.attribute_name] = Value(value=25, datatype=attr_def.datatype, unit=attr_def.eenheid)

        # Add instances to context
        context.add_object(person_under_age)
        context.add_object(person_over_age)
        logger.debug(f"Added RuntimeObjects: {person_under_age.instance_id} (leeftijd=15), {person_over_age.instance_id} (leeftijd=25)")

        # 4. Create Evaluator and execute
        evaluator = Evaluator(context)
        logger.info("Executing model...")
        execution_results = evaluator.execute_model(self.domain_model)
        logger.info(f"Execution finished. Results: {execution_results}")

        # 5. Assert results on the instances in the context
        
        # Retrieve instances *after* execution (context is mutated)
        instances_after = context.find_objects_by_type(self.object_type_name)
        instance_15 = next((inst for inst in instances_after if inst.instance_id == "person_15"), None)
        instance_25 = next((inst for inst in instances_after if inst.instance_id == "person_25"), None)

        self.assertIsNotNone(instance_15, "Instance person_15 not found in context after execution.")
        self.assertIsNotNone(instance_25, "Instance person_25 not found in context after execution.")

        # Check kenmerk 'minderjarig'
        logger.debug(f"Checking kenmerken for instance_15: {instance_15.kenmerken}")
        self.assertTrue(
            instance_15.kenmerken.get(self.kenmerk_name, False), # Use get with default False
            f"Instance {instance_15.instance_id} should have kenmerk '{self.kenmerk_name}' set to True."
        )

        logger.debug(f"Checking kenmerken for instance_25: {instance_25.kenmerken}")
        self.assertFalse(
            instance_25.kenmerken.get(self.kenmerk_name, False),
            f"Instance {instance_25.instance_id} should NOT have kenmerk '{self.kenmerk_name}' set to True."
        )
        logger.info("Steelthread evaluation test completed successfully.")


if __name__ == '__main__':
    unittest.main() 