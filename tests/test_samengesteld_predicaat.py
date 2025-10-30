"""Tests for Samengesteld Predicaat (compound predicates) functionality."""
import unittest
from regelspraak.parsing import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.engine import Evaluator
from regelspraak.errors import ParseError, SemanticError


class TestSamengesteldPredicaat(unittest.TestCase):
    """Test suite for compound predicate functionality."""
    
    def test_alle_voorwaarden(self):
        """Test 'alle' quantifier - all conditions must be true."""
        input_text = """
Parameter de minimum leeftijd : Numeriek (geheel getal) met eenheid jr
Parameter de maximum leeftijd : Numeriek (geheel getal) met eenheid jr

Objecttype de Natuurlijk persoon (bezield)
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    de nationaliteit Tekst;
    is kandidaat kenmerk (bijvoeglijk);

Objecttype de Groep
    de aantal kandidaten Numeriek (geheel getal);

Feittype groep met personen
    de groep Groep
    de lid Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel bepaal kandidaat
    geldig altijd
        Een Natuurlijk persoon is kandidaat
        indien hij aan alle volgende voorwaarden voldoet:
        • zijn leeftijd is groter of gelijk aan de minimum leeftijd
        • zijn leeftijd is kleiner of gelijk aan de maximum leeftijd
        • zijn nationaliteit is gelijk aan "Nederlandse".

Regel tel kandidaten
    geldig altijd
        De aantal kandidaten van een groep moet berekend worden als 
        het aantal leden van de groep die kandidaat zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Set parameters
        context.set_parameter('minimum leeftijd', 18, unit='jr')
        context.set_parameter('maximum leeftijd', 65, unit='jr')
        
        # Create a group
        groep = RuntimeObject(object_type_naam='Groep', instance_id='groep1')
        context.add_object(groep)
        
        # Create test persons
        # Person 1: All conditions met (should be counted)
        persoon1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(persoon1, 'naam', 'Jan')
        context.set_attribute(persoon1, 'leeftijd', 25, unit='jr')
        context.set_attribute(persoon1, 'nationaliteit', 'Nederlandse')
        context.add_object(persoon1)
        
        # Person 2: Too young (should not be counted)
        persoon2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(persoon2, 'naam', 'Piet')
        context.set_attribute(persoon2, 'leeftijd', 16, unit='jr')
        context.set_attribute(persoon2, 'nationaliteit', 'Nederlandse')
        context.add_object(persoon2)
        
        # Person 3: Wrong nationality (should not be counted)
        persoon3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(persoon3, 'naam', 'John')
        context.set_attribute(persoon3, 'leeftijd', 30, unit='jr')
        context.set_attribute(persoon3, 'nationaliteit', 'Amerikaanse')
        context.add_object(persoon3)
        
        # Person 4: All conditions met (should be counted)
        persoon4 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p4')
        context.set_attribute(persoon4, 'naam', 'Marie')
        context.set_attribute(persoon4, 'leeftijd', 45, unit='jr')
        context.set_attribute(persoon4, 'nationaliteit', 'Nederlandse')
        context.add_object(persoon4)
        
        # Create relationships
        for persoon in [persoon1, persoon2, persoon3, persoon4]:
            context.add_relationship(
                feittype_naam='groep met personen',
                subject=groep,
                object=persoon,
                preposition="MET"
            )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if kenmerken were assigned correctly
        self.assertTrue(persoon1.kenmerken.get('kandidaat', False))  # All conditions met
        self.assertFalse(persoon2.kenmerken.get('kandidaat', False))  # Too young
        self.assertFalse(persoon3.kenmerken.get('kandidaat', False))  # Wrong nationality
        self.assertTrue(persoon4.kenmerken.get('kandidaat', False))  # All conditions met
        
        # Check if count is correct
        count_value = context.get_attribute(groep, 'aantal kandidaten')
        self.assertEqual(count_value.value, 2)  # Only persoon1 and persoon4 meet all conditions
    
    def test_geen_voorwaarden(self):
        """Test 'geen' quantifier - no conditions must be true."""
        input_text = """
Objecttype de Natuurlijk persoon (bezield)
    de naam Tekst;
    is student kenmerk (bijvoeglijk);
    is werknemer kenmerk (bijvoeglijk);
    is niet_actief kenmerk (bijvoeglijk);

Objecttype de Groep
    de aantal niet_actief Numeriek (geheel getal);

Feittype groep met personen
    de groep Groep
    de lid Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel bepaal niet_actief
    geldig altijd
        Een Natuurlijk persoon is niet_actief
        indien hij aan geen van de volgende voorwaarden voldoet:
        • hij is student
        • hij is werknemer.

Regel tel niet_actief
    geldig altijd
        De aantal niet_actief van een groep moet berekend worden als 
        het aantal leden van de groep die niet_actief zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Create a group
        groep = RuntimeObject(object_type_naam='Groep', instance_id='groep1')
        context.add_object(groep)
        
        # Create test persons
        # Person 1: Neither student nor employee (should be counted)
        persoon1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(persoon1, 'naam', 'Jan')
        persoon1.kenmerken['student'] = False
        persoon1.kenmerken['werknemer'] = False
        context.add_object(persoon1)
        
        # Person 2: Student (should not be counted)
        persoon2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(persoon2, 'naam', 'Piet')
        persoon2.kenmerken['student'] = True
        persoon2.kenmerken['werknemer'] = False
        context.add_object(persoon2)
        
        # Person 3: Employee (should not be counted)
        persoon3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(persoon3, 'naam', 'Marie')
        persoon3.kenmerken['student'] = False
        persoon3.kenmerken['werknemer'] = True
        context.add_object(persoon3)
        
        # Person 4: Neither (should be counted)
        persoon4 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p4')
        context.set_attribute(persoon4, 'naam', 'Lisa')
        persoon4.kenmerken['student'] = False
        persoon4.kenmerken['werknemer'] = False
        context.add_object(persoon4)
        
        # Create relationships
        for persoon in [persoon1, persoon2, persoon3, persoon4]:
            context.add_relationship(
                feittype_naam='groep met personen',
                subject=groep,
                object=persoon,
                preposition="MET"
            )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if kenmerken were assigned correctly
        self.assertTrue(persoon1.kenmerken.get('niet_actief', False))  # Neither student nor employee
        self.assertFalse(persoon2.kenmerken.get('niet_actief', False))  # Is student
        self.assertFalse(persoon3.kenmerken.get('niet_actief', False))  # Is employee
        self.assertTrue(persoon4.kenmerken.get('niet_actief', False))  # Neither
        
        # Check if count is correct
        count_value = context.get_attribute(groep, 'aantal niet_actief')
        self.assertEqual(count_value.value, 2)  # Only persoon1 and persoon4 meet criteria
    
    def test_ten_minste_voorwaarden(self):
        """Test 'ten minste' quantifier - at least N conditions must be true."""
        input_text = """
Objecttype de Natuurlijk persoon (bezield)
    de naam Tekst;
    is student kenmerk (bijvoeglijk);
    is werknemer kenmerk (bijvoeglijk);
    is vrijwilliger kenmerk (bijvoeglijk);
    is actief kenmerk (bijvoeglijk);

Objecttype de Groep
    de aantal actief Numeriek (geheel getal);

Feittype groep met personen
    de groep Groep
    de lid Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel bepaal actief
    geldig altijd
        Een Natuurlijk persoon is actief
        indien hij aan ten minste twee van de volgende voorwaarden voldoet:
        • hij is student
        • hij is werknemer
        • hij is vrijwilliger.

Regel tel actief
    geldig altijd
        De aantal actief van een groep moet berekend worden als 
        het aantal leden van de groep die actief zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Create a group
        groep = RuntimeObject(object_type_naam='Groep', instance_id='groep1')
        context.add_object(groep)
        
        # Create test persons
        # Person 1: All three activities (should be counted)
        persoon1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(persoon1, 'naam', 'Jan')
        persoon1.kenmerken['student'] = True
        persoon1.kenmerken['werknemer'] = True
        persoon1.kenmerken['vrijwilliger'] = True
        context.add_object(persoon1)
        
        # Person 2: Only student (should not be counted - only 1 condition)
        persoon2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(persoon2, 'naam', 'Piet')
        persoon2.kenmerken['student'] = True
        persoon2.kenmerken['werknemer'] = False
        persoon2.kenmerken['vrijwilliger'] = False
        context.add_object(persoon2)
        
        # Person 3: Student and employee (should be counted - 2 conditions)
        persoon3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(persoon3, 'naam', 'Marie')
        persoon3.kenmerken['student'] = True
        persoon3.kenmerken['werknemer'] = True
        persoon3.kenmerken['vrijwilliger'] = False
        context.add_object(persoon3)
        
        # Person 4: None (should not be counted - 0 conditions)
        persoon4 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p4')
        context.set_attribute(persoon4, 'naam', 'Lisa')
        persoon4.kenmerken['student'] = False
        persoon4.kenmerken['werknemer'] = False
        persoon4.kenmerken['vrijwilliger'] = False
        context.add_object(persoon4)
        
        # Create relationships
        for persoon in [persoon1, persoon2, persoon3, persoon4]:
            context.add_relationship(
                feittype_naam='groep met personen',
                subject=groep,
                object=persoon,
                preposition="MET"
            )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if kenmerken were assigned correctly
        self.assertTrue(persoon1.kenmerken.get('actief', False))  # All three activities (>= 2)
        self.assertFalse(persoon2.kenmerken.get('actief', False))  # Only one activity (< 2)
        self.assertTrue(persoon3.kenmerken.get('actief', False))  # Two activities (>= 2)
        self.assertFalse(persoon4.kenmerken.get('actief', False))  # No activities (< 2)
        
        # Check if count is correct
        count_value = context.get_attribute(groep, 'aantal actief')
        self.assertEqual(count_value.value, 2)  # persoon1 and persoon3 have at least 2
    
    def test_ten_hoogste_voorwaarden(self):
        """Test 'ten hoogste' quantifier - at most N conditions must be true."""
        input_text = """
Objecttype de Natuurlijk persoon (bezield)
    de naam Tekst;
    is roker kenmerk (bijvoeglijk);
    heeft overgewicht kenmerk (bijvoeglijk);
    heeft hoge bloeddruk kenmerk (bijvoeglijk);
    is gezond kenmerk (bijvoeglijk);

Objecttype de Groep
    de aantal gezond Numeriek (geheel getal);

Feittype groep met personen
    de groep Groep
    de lid Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel bepaal gezond
    geldig altijd
        Een Natuurlijk persoon is gezond
        indien hij aan ten hoogste één van de volgende voorwaarden voldoet:
        • hij is roker
        • hij heeft overgewicht
        • hij heeft hoge bloeddruk.

Regel tel gezond
    geldig altijd
        De aantal gezond van een groep moet berekend worden als 
        het aantal leden van de groep die gezond zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Create a group
        groep = RuntimeObject(object_type_naam='Groep', instance_id='groep1')
        context.add_object(groep)
        
        # Create test persons
        # Person 1: No risk factors (should be counted - 0 conditions)
        persoon1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(persoon1, 'naam', 'Jan')
        persoon1.kenmerken['roker'] = False
        persoon1.kenmerken['overgewicht'] = False
        persoon1.kenmerken['hoge bloeddruk'] = False
        context.add_object(persoon1)
        
        # Person 2: All risk factors (should not be counted - 3 conditions)
        persoon2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(persoon2, 'naam', 'Piet')
        persoon2.kenmerken['roker'] = True
        persoon2.kenmerken['overgewicht'] = True
        persoon2.kenmerken['hoge bloeddruk'] = True
        context.add_object(persoon2)
        
        # Person 3: One risk factor (should be counted - 1 condition)
        persoon3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(persoon3, 'naam', 'Marie')
        persoon3.kenmerken['roker'] = False
        persoon3.kenmerken['overgewicht'] = True
        persoon3.kenmerken['hoge bloeddruk'] = False
        context.add_object(persoon3)
        
        # Person 4: Two risk factors (should not be counted - 2 conditions)
        persoon4 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p4')
        context.set_attribute(persoon4, 'naam', 'Lisa')
        persoon4.kenmerken['roker'] = True
        persoon4.kenmerken['overgewicht'] = False
        persoon4.kenmerken['hoge bloeddruk'] = True
        context.add_object(persoon4)
        
        # Create relationships
        for persoon in [persoon1, persoon2, persoon3, persoon4]:
            context.add_relationship(
                feittype_naam='groep met personen',
                subject=groep,
                object=persoon,
                preposition="MET"
            )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if kenmerken were assigned correctly
        self.assertTrue(persoon1.kenmerken.get('gezond', False))  # No risk factors (<= 1)
        self.assertFalse(persoon2.kenmerken.get('gezond', False))  # All risk factors (> 1)
        self.assertTrue(persoon3.kenmerken.get('gezond', False))  # One risk factor (<= 1)
        self.assertFalse(persoon4.kenmerken.get('gezond', False))  # Two risk factors (> 1)
        
        # Check if count is correct
        count_value = context.get_attribute(groep, 'aantal gezond')
        self.assertEqual(count_value.value, 2)  # persoon1 and persoon3 have at most 1
    
    def test_precies_voorwaarden(self):
        """Test 'precies' quantifier - exactly N conditions must be true."""
        input_text = """
Objecttype de Natuurlijk persoon (bezield)
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    de nationaliteit Tekst;
    is student kenmerk (bijvoeglijk);
    is specifiek kenmerk (bijvoeglijk);

Objecttype de Groep
    de aantal specifiek Numeriek (geheel getal);

Feittype groep met personen
    de groep Groep
    de lid Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel bepaal specifiek
    geldig altijd
        Een Natuurlijk persoon is specifiek
        indien hij aan precies twee van de volgende voorwaarden voldoet:
        • zijn leeftijd is groter dan 25 jr
        • zijn nationaliteit is gelijk aan "Nederlandse"
        • hij is student.

Regel tel specifiek
    geldig altijd
        De aantal specifiek van een groep moet berekend worden als 
        het aantal leden van de groep die specifiek zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Create a group
        groep = RuntimeObject(object_type_naam='Groep', instance_id='groep1')
        context.add_object(groep)
        
        # Create test persons
        # Person 1: All conditions (should not be counted - 3 conditions)
        persoon1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(persoon1, 'naam', 'Jan')
        context.set_attribute(persoon1, 'leeftijd', 30, unit='jr')
        context.set_attribute(persoon1, 'nationaliteit', 'Nederlandse')
        persoon1.kenmerken['student'] = True
        context.add_object(persoon1)
        
        # Person 2: Exactly 2 conditions (should be counted)
        persoon2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(persoon2, 'naam', 'Piet')
        context.set_attribute(persoon2, 'leeftijd', 20, unit='jr')  # < 25
        context.set_attribute(persoon2, 'nationaliteit', 'Nederlandse')
        persoon2.kenmerken['student'] = True
        context.add_object(persoon2)
        
        # Person 3: One condition (should not be counted)
        persoon3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(persoon3, 'naam', 'Marie')
        context.set_attribute(persoon3, 'leeftijd', 35, unit='jr')
        context.set_attribute(persoon3, 'nationaliteit', 'Franse')
        persoon3.kenmerken['student'] = False
        context.add_object(persoon3)
        
        # Person 4: Exactly 2 conditions (should be counted)
        persoon4 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p4')
        context.set_attribute(persoon4, 'naam', 'Lisa')
        context.set_attribute(persoon4, 'leeftijd', 28, unit='jr')
        context.set_attribute(persoon4, 'nationaliteit', 'Nederlandse')
        persoon4.kenmerken['student'] = False
        context.add_object(persoon4)
        
        # Create relationships
        for persoon in [persoon1, persoon2, persoon3, persoon4]:
            context.add_relationship(
                feittype_naam='groep met personen',
                subject=groep,
                object=persoon,
                preposition="MET"
            )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if count is correct
        count_value = context.get_attribute(groep, 'aantal specifiek')
        self.assertEqual(count_value.value, 2)  # persoon2 and persoon4 have exactly 2
    
    def test_nested_samengesteld_predicaat(self):
        """Test nested compound predicates."""
        input_text = """
Objecttype de Natuurlijk persoon (bezield)
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    de nationaliteit Tekst;
    is student kenmerk (bijvoeglijk);
    is werknemer kenmerk (bijvoeglijk);
    is complex kenmerk (bijvoeglijk);

Objecttype de Groep
    de aantal complex Numeriek (geheel getal);

Feittype groep met personen
    de groep Groep
    de lid Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel bepaal complex
    geldig altijd
        Een Natuurlijk persoon is complex
        indien hij aan alle volgende voorwaarden voldoet:
        • zijn nationaliteit is gelijk aan "Nederlandse"
        • hij voldoet aan ten minste één van de volgende voorwaarden:
            •• hij is student
            •• hij is werknemer.

Regel tel complex
    geldig altijd
        De aantal complex van een groep moet berekend worden als 
        het aantal leden van de groep die complex zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Create a group
        groep = RuntimeObject(object_type_naam='Groep', instance_id='groep1')
        context.add_object(groep)
        
        # Create test persons
        # Person 1: Dutch student (should be counted)
        persoon1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(persoon1, 'naam', 'Jan')
        context.set_attribute(persoon1, 'nationaliteit', 'Nederlandse')
        persoon1.kenmerken['student'] = True
        persoon1.kenmerken['werknemer'] = False
        context.add_object(persoon1)
        
        # Person 2: Dutch neither student nor employee (should not be counted)
        persoon2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(persoon2, 'naam', 'Piet')
        context.set_attribute(persoon2, 'nationaliteit', 'Nederlandse')
        persoon2.kenmerken['student'] = False
        persoon2.kenmerken['werknemer'] = False
        context.add_object(persoon2)
        
        # Person 3: Foreign student (should not be counted)
        persoon3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(persoon3, 'naam', 'Marie')
        context.set_attribute(persoon3, 'nationaliteit', 'Franse')
        persoon3.kenmerken['student'] = True
        persoon3.kenmerken['werknemer'] = False
        context.add_object(persoon3)
        
        # Person 4: Dutch employee (should be counted)
        persoon4 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p4')
        context.set_attribute(persoon4, 'naam', 'Lisa')
        context.set_attribute(persoon4, 'nationaliteit', 'Nederlandse')
        persoon4.kenmerken['student'] = False
        persoon4.kenmerken['werknemer'] = True
        context.add_object(persoon4)
        
        # Create relationships
        for persoon in [persoon1, persoon2, persoon3, persoon4]:
            context.add_relationship(
                feittype_naam='groep met personen',
                subject=groep,
                object=persoon,
                preposition="MET"
            )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if kenmerken were assigned correctly
        self.assertTrue(persoon1.kenmerken.get('complex', False))  # Dutch student
        self.assertFalse(persoon2.kenmerken.get('complex', False))  # Dutch but neither student nor employee
        self.assertFalse(persoon3.kenmerken.get('complex', False))  # Foreign student
        self.assertTrue(persoon4.kenmerken.get('complex', False))  # Dutch employee
        
        # Check if count is correct
        count_value = context.get_attribute(groep, 'aantal complex')
        self.assertEqual(count_value.value, 2)  # persoon1 and persoon4 meet both criteria
    
    def test_mixed_condition_types(self):
        """Test compound predicate with mixed condition types."""
        input_text = """
Objecttype de Natuurlijk persoon (bezield)
    de naam Tekst;
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    is bijzonder kenmerk (bijvoeglijk);

Objecttype de Groep
    de aantal bijzonder Numeriek (geheel getal);

Feittype groep met personen
    de groep Groep
    de lid Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel bepaal bijzonder
    geldig altijd
        Een Natuurlijk persoon is bijzonder
        indien hij aan alle volgende voorwaarden voldoet:
        • zijn leeftijd is groter dan 30 jr
        • zijn naam is gelijk aan "Jan".

Regel tel bijzonder
    geldig altijd
        De aantal bijzonder van een groep moet berekend worden als 
        het aantal leden van de groep die bijzonder zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Create a group
        groep = RuntimeObject(object_type_naam='Groep', instance_id='groep1')
        context.add_object(groep)
        
        # Create test persons
        # Person 1: Age 35, name Jan (should be counted - both conditions met)
        persoon1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(persoon1, 'naam', 'Jan')
        context.set_attribute(persoon1, 'leeftijd', 35, unit='jr')
        context.add_object(persoon1)
        
        # Person 2: Age 25, name Jan (should not be counted - too young)
        persoon2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(persoon2, 'naam', 'Jan')
        context.set_attribute(persoon2, 'leeftijd', 25, unit='jr')
        context.add_object(persoon2)
        
        # Person 3: Age 40, name Piet (should not be counted - wrong name)
        persoon3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(persoon3, 'naam', 'Piet')
        context.set_attribute(persoon3, 'leeftijd', 40, unit='jr')
        context.add_object(persoon3)
        
        # Create relationships
        for persoon in [persoon1, persoon2, persoon3]:
            context.add_relationship(
                feittype_naam='groep met personen',
                subject=groep,
                object=persoon,
                preposition="MET"
            )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if kenmerken were assigned correctly
        self.assertTrue(persoon1.kenmerken.get('bijzonder', False))  # Age 35, name Jan (both conditions met)
        self.assertFalse(persoon2.kenmerken.get('bijzonder', False))  # Age 25, name Jan (too young)
        self.assertFalse(persoon3.kenmerken.get('bijzonder', False))  # Age 40, name Piet (wrong name)
        
        # Check if count is correct
        count_value = context.get_attribute(groep, 'aantal bijzonder')
        self.assertEqual(count_value.value, 1)  # Only persoon1 meets both criteria
    
    def test_semantic_validation_errors(self):
        """Test semantic validation of compound predicates."""
        # Test missing aantal for ten minste
        input_text1 = """
Objecttype de Natuurlijk persoon (bezield)
    de naam Tekst;

Objecttype de Groep
    de aantal test Numeriek (geheel getal);

Feittype groep met personen
    de groep Groep
    de lid Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel invalid_ten_minste
    geldig altijd
        De aantal test van een groep moet berekend worden als 
        het aantal leden van de groep die aan ten minste van de volgende voorwaarden voldoen:
        • student zijn.
"""
        
        with self.assertRaises(ParseError):
            parse_text(input_text1)
        
        # Test aantal exceeding number of conditions
        input_text2 = """
Objecttype de Natuurlijk persoon (bezield)
    de naam Tekst;
    is student kenmerk (bijvoeglijk);
    is invalid_test kenmerk (bijvoeglijk);

Objecttype de Groep
    de aantal test Numeriek (geheel getal);

Feittype groep met personen
    de groep Groep
    de lid Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel invalid_aantal
    geldig altijd
        Een Natuurlijk persoon is invalid_test
        indien hij aan ten minste twee van de volgende voorwaarden voldoet:
        • hij is student.

Regel tel test
    geldig altijd
        De aantal test van een groep moet berekend worden als 
        het aantal leden van de groep die invalid_test zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text2)
        
        # Semantic validation should catch the error
        from regelspraak.semantics import validate
        errors = validate(domain_model)
        self.assertTrue(any("exceeds number of conditions" in str(error) for error in errors))


if __name__ == '__main__':
    unittest.main()