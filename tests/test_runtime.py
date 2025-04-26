import unittest
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.ast import DomainModel, Parameter, ObjectType, Attribuut, Kenmerk, SourceSpan
from regelspraak.runtime import RuntimeError

class RuntimeContextTests(unittest.TestCase):
    """Tests for the RuntimeContext class."""

    def setUp(self):
        """Set up a basic DomainModel and RuntimeContext for tests."""
        self.param_def_age = Parameter(naam="volwassenleeftijd", datatype="Numeriek", eenheid="jr", span=SourceSpan.unknown())
        self.attr_def_age = Attribuut(naam="leeftijd", datatype="Numeriek", eenheid="jr", span=SourceSpan.unknown())
        self.kenmerk_def_minor = Kenmerk(naam="minderjarig", span=SourceSpan.unknown())
        self.obj_type_person = ObjectType(
            naam="Natuurlijk persoon", 
            attributen={"leeftijd": self.attr_def_age},
            kenmerken={"minderjarig": self.kenmerk_def_minor},
            span=SourceSpan.unknown()
        )
        self.domain_model = DomainModel(
            span=SourceSpan.unknown(),
            parameters={"volwassenleeftijd": self.param_def_age},
            objecttypes={"Natuurlijk persoon": self.obj_type_person},
            regels=[], # Empty list for regels
            domeinen={} # Empty dict for domeinen
        )
        self.context = RuntimeContext(domain_model=self.domain_model)
        
        # Create a sample instance
        self.person1 = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="p1")
        self.context.add_object(self.person1)

    def test_set_attribute_with_unit_override(self):
        """Test setting an attribute value, overriding the unit."""
        # Set 'leeftijd' with unit 'decennia' instead of the default 'jr'
        self.context.set_attribute(self.person1, "leeftijd", 1.5, unit="decennia")
        attr_value = self.person1.attributen.get("leeftijd")
        self.assertIsNotNone(attr_value)
        self.assertEqual(attr_value.value, 1.5)
        self.assertEqual(attr_value.datatype, "Numeriek")
        self.assertEqual(attr_value.eenheid, "decennia") # Check the overridden unit

    # Optional: Add a test for setting attribute with span
    def test_set_attribute_with_span(self):
         """Test setting an attribute value with a specific span."""
         test_span = SourceSpan(10, 1, 10, 5)
         self.context.set_attribute(self.person1, "leeftijd", 30, span=test_span)
         attr_value = self.person1.attributen.get("leeftijd")
         self.assertIsNotNone(attr_value)
         self.assertEqual(attr_value.value, 30)
         self.assertEqual(attr_value.eenheid, "jr") # Default unit

    def test_set_parameter_without_unit(self):
        """Test setting a parameter value using the unit from the definition."""
        self.context.set_parameter("volwassenleeftijd", 18)
        param_value = self.context.parameters.get("volwassenleeftijd")
        self.assertIsNotNone(param_value)
        self.assertEqual(param_value.value, 18)
        self.assertEqual(param_value.datatype, "Numeriek")
        self.assertEqual(param_value.eenheid, "jr") # Unit from definition

    def test_set_parameter_with_unit_override(self):
        """Test setting a parameter value, overriding the unit from the definition."""
        self.context.set_parameter("volwassenleeftijd", 1.5, unit="decennia")
        param_value = self.context.parameters.get("volwassenleeftijd")
        self.assertIsNotNone(param_value)
        self.assertEqual(param_value.value, 1.5)
        self.assertEqual(param_value.datatype, "Numeriek")
        self.assertEqual(param_value.eenheid, "decennia") # Unit overridden

    def test_set_parameter_definition_not_found(self):
        """Test error when setting a parameter that is not defined."""
        with self.assertRaisesRegex(RuntimeError, "Definition not found"):
            self.context.set_parameter("unknown_param", 100)

    def test_get_parameter(self):
        """Test retrieving a parameter's raw value."""
        self.context.set_parameter("volwassenleeftijd", 21)
        raw_value = self.context.get_parameter("volwassenleeftijd")
        self.assertEqual(raw_value, 21)

    def test_get_parameter_not_found(self):
        """Test error when retrieving a non-existent parameter."""
        with self.assertRaisesRegex(RuntimeError, "not found in runtime context"):
            self.context.get_parameter("non_existent_param")

    def test_set_attribute(self):
        """Test setting an attribute on a RuntimeObject."""
        self.context.set_attribute(self.person1, "leeftijd", 15)
        attr_value = self.person1.attributen.get("leeftijd")
        self.assertIsNotNone(attr_value)
        self.assertEqual(attr_value.value, 15)
        self.assertEqual(attr_value.datatype, "Numeriek")
        self.assertEqual(attr_value.eenheid, "jr") # Unit from definition

    def test_set_attribute_definition_not_found(self):
        """Test error when setting an attribute not defined in the ObjectType."""
        with self.assertRaisesRegex(RuntimeError, "Attribute 'gewicht' not defined"):
            self.context.set_attribute(self.person1, "gewicht", 70)
            
    def test_set_attribute_object_type_not_found(self):
        """Test error when setting attribute on object with undefined type."""
        unknown_obj = RuntimeObject(object_type_naam="Voertuig", instance_id="v1")
        # Note: We don't add unknown_obj to context, but try to set directly
        with self.assertRaisesRegex(RuntimeError, "ObjectType 'Voertuig' definition not found"):
            self.context.set_attribute(unknown_obj, "snelheid", 100)


    def test_get_attribute(self):
        """Test retrieving an attribute's raw value."""
        self.context.set_attribute(self.person1, "leeftijd", 25)
        raw_value = self.context.get_attribute(self.person1, "leeftijd")
        self.assertEqual(raw_value, 25)

    def test_get_attribute_not_set(self):
        """Test error when retrieving an attribute that hasn't been set."""
        with self.assertRaisesRegex(RuntimeError, "Attribute 'leeftijd' not found"):
            self.context.get_attribute(self.person1, "leeftijd")

    # --- Kenmerk Tests ---
    def test_set_kenmerk(self):
        """Test setting a kenmerk on a RuntimeObject."""
        self.context.set_kenmerk(self.person1, "minderjarig", True)
        self.assertTrue(self.person1.kenmerken.get("minderjarig"))
        
        self.context.set_kenmerk(self.person1, "minderjarig", False)
        self.assertFalse(self.person1.kenmerken.get("minderjarig"))

    def test_set_kenmerk_definition_not_found(self):
        """Test error when setting a kenmerk not defined in the ObjectType."""
        with self.assertRaisesRegex(RuntimeError, "Cannot set Kenmerk 'volwassen'.*Not defined"):
            self.context.set_kenmerk(self.person1, "volwassen", True)
            
    def test_get_kenmerk_not_set(self):
        """Test getting a kenmerk that hasn't been set (defaults to False)."""
        value = self.context.get_kenmerk(self.person1, "minderjarig")
        self.assertFalse(value)

    def test_get_kenmerk_set_true(self):
        """Test getting a kenmerk after setting it to True."""
        self.context.set_kenmerk(self.person1, "minderjarig", True)
        value = self.context.get_kenmerk(self.person1, "minderjarig")
        self.assertTrue(value)

    def test_get_kenmerk_set_false(self):
        """Test getting a kenmerk after setting it to False."""
        # Set to true first, then false
        self.context.set_kenmerk(self.person1, "minderjarig", True)
        self.context.set_kenmerk(self.person1, "minderjarig", False)
        value = self.context.get_kenmerk(self.person1, "minderjarig")
        self.assertFalse(value)

    def test_get_kenmerk_definition_not_found(self):
         """Test getting a kenmerk that is not defined (should default False)."""
         # This kenmerk 'volwassen' is not defined in our dummy ObjectType
         value = self.context.get_kenmerk(self.person1, "volwassen")
         self.assertFalse(value) # Expect default False, not an error

    # --- Variable Tests ---
    def test_set_get_variable(self):
        """Test setting and getting a variable in the context."""
        self.context.set_variable("temp_var", 123)
        value = self.context.get_variable("temp_var")
        self.assertEqual(value, 123)

    def test_get_variable_not_defined(self):
        """Test error when getting a variable that is not defined."""
        with self.assertRaisesRegex(RuntimeError, "Variable 'undefined_var' not defined"):
            self.context.get_variable("undefined_var")

if __name__ == '__main__':
    unittest.main() 