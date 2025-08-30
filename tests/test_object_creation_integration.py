import unittest
from decimal import Decimal
from regelspraak.parsing import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.engine import Evaluator

class ObjectCreationIntegrationTests(unittest.TestCase):
    """Integration tests for object creation functionality."""
    
    def test_simple_object_creation(self):
        """Test creating a simple object without attributes."""
        model_text = """
        Objecttype de Persoon
            de naam Tekst;
            is actief kenmerk;
        
        Regel MaakNieuwePersoon
        geldig altijd
            Er wordt een nieuw Persoon aangemaakt.
        """
        
        # Parse and validate
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        self.assertEqual(len(model.regels), 1)
        
        # Set up runtime
        context = RuntimeContext(domain_model=model)
        
        # Create a dummy instance to trigger the rule
        dummy = RuntimeObject(object_type_naam="Persoon", instance_id="dummy")
        context.add_object(dummy)
        
        # Execute
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check that a new object was created
        persons = context.find_objects_by_type("Persoon")
        self.assertEqual(len(persons), 2)  # dummy + created
        
        # Find the new one (not dummy)
        new_person = next(p for p in persons if p.instance_id != "dummy")
        self.assertIsNotNone(new_person)
        self.assertEqual(new_person.object_type_naam, "Persoon")
    
    def test_object_creation_with_attributes(self):
        """Test creating an object with initial attribute values."""
        model_text = """
        Objecttype de Klant
            de naam Tekst;
            de leeftijd Numeriek;
            de email Tekst;
        
        Regel MaakVasteKlant
        geldig altijd
            Er wordt een nieuw Klant aangemaakt 
            met naam gelijk aan "Jan Jansen"
            en leeftijd gelijk aan 35
            en email gelijk aan "jan@example.com".
        """
        
        # Parse and validate
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Set up runtime - need dummy to trigger rule
        context = RuntimeContext(domain_model=model)
        dummy = RuntimeObject(object_type_naam="Klant", instance_id="dummy")
        context.add_object(dummy)
        
        # Execute
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check results
        klanten = context.find_objects_by_type("Klant")
        self.assertEqual(len(klanten), 2)
        
        new_klant = next(k for k in klanten if k.instance_id != "dummy")
        self.assertEqual(new_klant.attributen["naam"].value, "Jan Jansen")
        self.assertEqual(new_klant.attributen["leeftijd"].value, 35)
        self.assertEqual(new_klant.attributen["email"].value, "jan@example.com")
    
    def test_object_creation_with_expression(self):
        """Test creating an object with computed attribute values."""
        model_text = """
        Objecttype de Product
            de naam Tekst;
            de prijs Numeriek met eenheid EUR;
            de btw_tarief Percentage;
            de prijs_incl Numeriek met eenheid EUR;
        
        Parameter de standaard_btw_tarief : Percentage is 21%;
        
        Regel MaakProduct
        geldig altijd
            Er wordt een nieuw Product aangemaakt
            met naam gelijk aan "Laptop"
            en prijs gelijk aan 1000 EUR
            en btw_tarief gelijk aan de standaard_btw_tarief
            en prijs_incl gelijk aan 1000 EUR plus (21% van 1000 EUR).
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Set up runtime
        context = RuntimeContext(domain_model=model)
        context.set_parameter("standaard_btw_tarief", Decimal("0.21"), unit="%")
        
        # Need dummy to trigger rule
        dummy = RuntimeObject(object_type_naam="Product", instance_id="dummy")
        context.add_object(dummy)
        
        # Execute
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check results
        products = context.find_objects_by_type("Product")
        self.assertEqual(len(products), 2)
        
        new_product = next(p for p in products if p.instance_id != "dummy")
        self.assertEqual(new_product.attributen["naam"].value, "Laptop")
        self.assertEqual(new_product.attributen["prijs"].value, 1000)
        self.assertEqual(new_product.attributen["btw_tarief"].value, Decimal("0.21"))
        self.assertEqual(new_product.attributen["prijs_incl"].value, 1210)
    
    def test_conditional_object_creation(self):
        """Test object creation with condition."""
        model_text = """
        Objecttype de Bonus
            de bedrag Numeriek met eenheid EUR;
            de ontvanger Tekst;
        
        Objecttype de Werknemer
            de naam Tekst;
            de salaris Numeriek met eenheid EUR;
        
        Parameter de bonus_drempel : Numeriek met eenheid EUR is 3000 EUR;
        
        Regel BonusVoorHoogSalaris
        geldig altijd
            Er wordt een nieuw Bonus aangemaakt
            met bedrag gelijk aan 500 EUR
            en ontvanger gelijk aan de naam
            indien het salaris groter is dan de bonus_drempel.
        """
        
        # Parse model
        model = parse_text(model_text)
        self.assertIsNotNone(model)
        
        # Set up runtime with two employees
        context = RuntimeContext(domain_model=model)
        context.set_parameter("bonus_drempel", 3000, unit="EUR")
        
        # Low salary employee
        w1 = RuntimeObject(object_type_naam="Werknemer", instance_id="w1")
        w1.attributen["naam"] = Value("Alice", "Tekst")
        w1.attributen["salaris"] = Value(2500, "Numeriek", "EUR")
        context.add_object(w1)
        
        # High salary employee
        w2 = RuntimeObject(object_type_naam="Werknemer", instance_id="w2")
        w2.attributen["naam"] = Value("Bob", "Tekst")
        w2.attributen["salaris"] = Value(4000, "Numeriek", "EUR")
        context.add_object(w2)
        
        # Execute
        evaluator = Evaluator(context)
        evaluator.execute_model(model)
        
        # Check that only one bonus was created
        bonuses = context.find_objects_by_type("Bonus")
        self.assertEqual(len(bonuses), 1)
        
        bonus = bonuses[0]
        self.assertEqual(bonus.attributen["bedrag"].value, 500)
        self.assertEqual(bonus.attributen["ontvanger"].value, "Bob")
    
    def test_error_unknown_object_type(self):
        """Test error when creating object of unknown type."""
        model_text = """
        Objecttype de Persoon
            de naam Tekst;
        
        Regel MaakOnbekend
        geldig altijd
            Er wordt een nieuw OnbekendType aangemaakt.
        """
        
        model = parse_text(model_text)
        context = RuntimeContext(domain_model=model)
        
        # Need dummy to trigger rule
        dummy = RuntimeObject(object_type_naam="Persoon", instance_id="dummy")
        context.add_object(dummy)
        
        evaluator = Evaluator(context)
        
        # Execute - should log error but not raise exception
        results = evaluator.execute_model(model)
        
        # Check that the rule failed
        self.assertIn('MaakOnbekend', results)
        self.assertEqual(results['MaakOnbekend'][0]['status'], 'error')
        self.assertIn("Unknown object type: OnbekendType", results['MaakOnbekend'][0]['message'])
    
    def test_error_unknown_attribute(self):
        """Test error when initializing unknown attribute."""
        model_text = """
        Objecttype de Product
            de naam Tekst;
            de prijs Numeriek;
        
        Regel MaakProductFout
        geldig altijd
            Er wordt een nieuw Product aangemaakt
            met naam gelijk aan "Test"
            en onbekend_attribuut gelijk aan 123.
        """
        
        model = parse_text(model_text)
        context = RuntimeContext(domain_model=model)
        
        # Need dummy to trigger rule
        dummy = RuntimeObject(object_type_naam="Product", instance_id="dummy")
        context.add_object(dummy)
        
        evaluator = Evaluator(context)
        
        # Execute - should log error but not raise exception
        results = evaluator.execute_model(model)
        
        # Check that the rule failed
        self.assertIn('MaakProductFout', results)
        self.assertEqual(results['MaakProductFout'][0]['status'], 'error')
        self.assertIn("Attribute 'onbekend_attribuut' not defined", results['MaakProductFout'][0]['message'])

if __name__ == '__main__':
    unittest.main()