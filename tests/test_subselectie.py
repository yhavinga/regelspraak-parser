"""Tests for Subselectie (filtering collections based on predicates)."""
import unittest
from regelspraak.parsing import parse_text
from regelspraak.runtime import RuntimeContext, RuntimeObject, Value
from regelspraak.engine import Evaluator
from regelspraak.errors import ParseError


class TestSubselectie(unittest.TestCase):
    """Test suite for Subselectie functionality."""
    
    def test_kenmerk_filtering(self):
        """Test filtering by kenmerk: 'passagiers die minderjarig zijn'"""
        input_text = """
Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr

Objecttype de Natuurlijk persoon (bezield)
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Feittype vlucht van natuurlijke personen
    de reis	Vlucht
    de passagier (mv: passagiers)	Natuurlijk persoon
    Eén reis betreft de verplaatsing van meerdere passagiers

Objecttype de Vlucht
    de hoeveelheid minderjarige passagiers Numeriek (geheel getal);

Regel kenmerktoekenning minderjarig
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.

Regel tel minderjarigen
    geldig altijd
        De hoeveelheid minderjarige passagiers van een vlucht moet berekend worden als
        het aantal passagiers van de reis die minderjarig zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Set parameter
        context.set_parameter('volwassenleeftijd', 18, unit='jr')
        
        # Create a flight
        vlucht = RuntimeObject(object_type_naam='Vlucht', instance_id='vlucht1')
        context.add_object(vlucht)
        
        # Create passengers with different ages
        passagier1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(passagier1, 'leeftijd', 15, unit='jr')  # Minor
        context.add_object(passagier1)
        
        passagier2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(passagier2, 'leeftijd', 25, unit='jr')  # Adult
        context.add_object(passagier2)
        
        passagier3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(passagier3, 'leeftijd', 10, unit='jr')  # Minor
        context.add_object(passagier3)
        
        # Create relationships
        context.add_relationship(
            feittype_naam='vlucht van natuurlijke personen',
            subject=vlucht,
            object=passagier1,
            preposition="VAN"
        )
        context.add_relationship(
            feittype_naam='vlucht van natuurlijke personen',
            subject=vlucht,
            object=passagier2,
            preposition="VAN"
        )
        context.add_relationship(
            feittype_naam='vlucht van natuurlijke personen',
            subject=vlucht,
            object=passagier3,
            preposition="VAN"
        )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if kenmerken were assigned correctly
        self.assertTrue(passagier1.kenmerken.get('minderjarig', False))
        self.assertFalse(passagier2.kenmerken.get('minderjarig', False))
        self.assertTrue(passagier3.kenmerken.get('minderjarig', False))
        
        # Check if count is correct
        count_value = context.get_attribute(vlucht, 'hoeveelheid minderjarige passagiers')
        self.assertEqual(count_value.value, 2)  # Two minors
    
    def test_attribute_comparison(self):
        """Test filtering by attribute: 'personen die een leeftijd hebben kleiner dan 18'"""
        input_text = """
Parameter de leeftijdsgrens : Numeriek (geheel getal) met eenheid jr

Objecttype de Natuurlijk persoon (bezield)
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Objecttype de Groep
    de aantal jongeren Numeriek (geheel getal);

Feittype groep met personen
    de groep	Groep
    de lid (mv: leden)	Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel tel jongeren
    geldig altijd
        De aantal jongeren van een groep moet berekend worden als 
        het aantal leden van de groep die een leeftijd hebben kleiner dan de leeftijdsgrens.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Set parameter
        context.set_parameter('leeftijdsgrens', 18, unit='jr')
        
        # Create a group
        groep = RuntimeObject(object_type_naam='Groep', instance_id='groep1')
        context.add_object(groep)
        
        # Create people with different ages
        persoon1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(persoon1, 'leeftijd', 15, unit='jr')
        context.add_object(persoon1)
        
        persoon2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(persoon2, 'leeftijd', 20, unit='jr')
        context.add_object(persoon2)
        
        persoon3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(persoon3, 'leeftijd', 17, unit='jr')
        context.add_object(persoon3)
        
        # Create relationships
        context.add_relationship(
            feittype_naam='groep met personen',
            subject=groep,
            object=persoon1,
            preposition="MET"
        )
        context.add_relationship(
            feittype_naam='groep met personen',
            subject=groep,
            object=persoon2,
            preposition="MET"
        )
        context.add_relationship(
            feittype_naam='groep met personen',
            subject=groep,
            object=persoon3,
            preposition="MET"
        )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if count is correct
        count_value = context.get_attribute(groep, 'aantal jongeren')
        self.assertEqual(count_value.value, 2)  # Two people under 18
    
    def test_empty_result(self):
        """Test subselectie returning empty collection."""
        input_text = """
Objecttype de Natuurlijk persoon (bezield)
    is senior kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Objecttype de Club
    de aantal senioren Numeriek (geheel getal);

Feittype club met leden
    de club	Club
    de lid (mv: leden)	Natuurlijk persoon
    Eén club heeft meerdere leden

Regel kenmerktoekenning senior
    geldig altijd
        Een Natuurlijk persoon is senior
        indien zijn leeftijd is groter of gelijk aan 65 jr.

Regel tel senioren
    geldig altijd
        De aantal senioren van een club moet berekend worden als 
        het aantal leden van de club die senior zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Create a club
        club = RuntimeObject(object_type_naam='Club', instance_id='club1')
        context.add_object(club)
        
        # Create only young people
        for i in range(3):
            persoon = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id=f'p{i}')
            context.set_attribute(persoon, 'leeftijd', 20 + i * 5, unit='jr')  # Ages: 20, 25, 30
            context.add_object(persoon)
            context.add_relationship(
                feittype_naam='club met leden',
                subject=club,
                object=persoon,
                preposition="MET"
            )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if count is 0 (no seniors)
        count_value = context.get_attribute(club, 'aantal senioren')
        self.assertEqual(count_value.value, 0)
    
    def test_with_aggregation(self):
        """Test subselectie with aggregation function."""
        input_text = """
Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr

Objecttype de Natuurlijk persoon (bezield)
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    de belasting Bedrag;

Feittype vlucht van natuurlijke personen
    de reis	Vlucht
    de passagier (mv: passagiers)	Natuurlijk persoon
    Eén reis betreft de verplaatsing van meerdere passagiers

Objecttype de Vlucht
    de totale belasting minderjarigen Bedrag;

Regel kenmerktoekenning minderjarig
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.

Regel som belasting minderjarigen
    geldig altijd
        De totale belasting minderjarigen van een vlucht moet berekend worden als
        de som van de belasting van alle passagiers van de reis die minderjarig zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Set parameter
        context.set_parameter('volwassenleeftijd', 18, unit='jr')
        
        # Create a flight
        vlucht = RuntimeObject(object_type_naam='Vlucht', instance_id='vlucht1')
        context.add_object(vlucht)
        
        # Create passengers with different ages and taxes
        passagier1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(passagier1, 'leeftijd', 15, unit='jr')  # Minor
        context.set_attribute(passagier1, 'belasting', 10.50, unit='€')
        context.add_object(passagier1)
        
        passagier2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(passagier2, 'leeftijd', 25, unit='jr')  # Adult
        context.set_attribute(passagier2, 'belasting', 25.00, unit='€')
        context.add_object(passagier2)
        
        passagier3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(passagier3, 'leeftijd', 10, unit='jr')  # Minor
        context.set_attribute(passagier3, 'belasting', 8.25, unit='€')
        context.add_object(passagier3)
        
        # Create relationships
        context.add_relationship(
            feittype_naam='vlucht van natuurlijke personen',
            subject=vlucht,
            object=passagier1,
            preposition="VAN"
        )
        context.add_relationship(
            feittype_naam='vlucht van natuurlijke personen',
            subject=vlucht,
            object=passagier2,
            preposition="VAN"
        )
        context.add_relationship(
            feittype_naam='vlucht van natuurlijke personen',
            subject=vlucht,
            object=passagier3,
            preposition="VAN"
        )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if sum is correct (only minors: 10.50 + 8.25)
        sum_value = context.get_attribute(vlucht, 'totale belasting minderjarigen')
        self.assertEqual(sum_value.value, 18.75)
    
    def test_text_predicate(self):
        """Test text comparison predicate."""
        input_text = """
Objecttype de Natuurlijk persoon (bezield)
    de naam Tekst;
    de nationaliteit Tekst;

Objecttype de Groep
    de aantal nederlanders Numeriek (geheel getal);

Feittype groep met personen
    de groep	Groep
    de lid (mv: leden)	Natuurlijk persoon
    Eén groep heeft meerdere leden

Regel tel nederlanders
    geldig altijd
        De aantal nederlanders van een groep moet berekend worden als 
        het aantal leden van de groep die een nationaliteit hebben gelijk aan "Nederlandse".
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Create a group
        groep = RuntimeObject(object_type_naam='Groep', instance_id='groep1')
        context.add_object(groep)
        
        # Create people with different nationalities
        persoon1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
        context.set_attribute(persoon1, 'naam', 'Jan')
        context.set_attribute(persoon1, 'nationaliteit', 'Nederlandse')
        context.add_object(persoon1)
        
        persoon2 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p2')
        context.set_attribute(persoon2, 'naam', 'John')
        context.set_attribute(persoon2, 'nationaliteit', 'Amerikaanse')
        context.add_object(persoon2)
        
        persoon3 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p3')
        context.set_attribute(persoon3, 'naam', 'Piet')
        context.set_attribute(persoon3, 'nationaliteit', 'Nederlandse')
        context.add_object(persoon3)
        
        # Create relationships
        context.add_relationship(
            feittype_naam='groep met personen',
            subject=groep,
            object=persoon1,
            preposition="MET"
        )
        context.add_relationship(
            feittype_naam='groep met personen',
            subject=groep,
            object=persoon2,
            preposition="MET"
        )
        context.add_relationship(
            feittype_naam='groep met personen',
            subject=groep,
            object=persoon3,
            preposition="MET"
        )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if count is correct
        count_value = context.get_attribute(groep, 'aantal nederlanders')
        self.assertEqual(count_value.value, 2)  # Two Dutch people
    
    def test_nested_subselectie_path(self):
        """Test subselectie with nested path: 'passagiers van de reis'"""
        input_text = """
Objecttype de Natuurlijk persoon (bezield)
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Objecttype de Vlucht

Objecttype de Reis
    de vlucht Vlucht;
    de aantal minderjarige reizigers Numeriek (geheel getal);

Feittype reis met passagiers
    de reis	Reis
    de passagier (mv: passagiers)	Natuurlijk persoon
    Eén reis heeft meerdere passagiers

Regel kenmerktoekenning minderjarig
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan 18 jr.

Regel tel minderjarigen op reis
    geldig altijd
        De aantal minderjarige reizigers van een reis moet berekend worden als 
        het aantal passagiers van de reis die minderjarig zijn.
"""
        
        # Parse the RegelSpraak code
        domain_model = parse_text(input_text)
        
        # Create runtime context and evaluator
        context = RuntimeContext(domain_model)
        evaluator = Evaluator(context)
        
        # Create a reis
        reis = RuntimeObject(object_type_naam='Reis', instance_id='reis1')
        context.add_object(reis)
        
        # Create passengers
        ages = [15, 25, 10, 30, 12]  # 3 minors, 2 adults
        for i, age in enumerate(ages):
            passagier = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id=f'p{i}')
            context.set_attribute(passagier, 'leeftijd', age, unit='jr')
            context.add_object(passagier)
            context.add_relationship(
                feittype_naam='reis met passagiers',
                subject=reis,
                object=passagier,
                preposition="MET"
            )
        
        # Execute rules
        evaluator.execute_model(domain_model)
        
        # Check if count is correct
        count_value = context.get_attribute(reis, 'aantal minderjarige reizigers')
        self.assertEqual(count_value.value, 3)  # Three minors


if __name__ == '__main__':
    unittest.main()