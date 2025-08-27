// TOKA (Wet Treinen Op Korte Afstand) GegevensSpraak Definitions
// This file contains all object types, domains, parameters, and fact types for the TOKA case study

// ============================================================================
// DOMAINS
// ============================================================================

// Currency amounts in euros with 2 decimal places
Domein Bedrag is van het type Numeriek (getal met 2 decimalen)

// Enumeration of airports
Domein Luchthavens is van het type Enumeratie
    'Amsterdam Schiphol'
    'Groningen Eelde'
    'Parijs Charles de Gaulle'
    'Londen Heathrow'

// ============================================================================
// OBJECT TYPES
// ============================================================================

// Natural person with all TOKA-related attributes and characteristics
Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
    // Characteristics (kenmerken) for age categories
    is minderjarig kenmerk (bijvoeglijk);
    is jongere kenmerk;
    is jongvolwassene kenmerk;
    is volwassene kenmerk;
    is senior kenmerk (bijvoeglijk);
    het recht op duurzaamheidskorting kenmerk (bezittelijk);
    
    // Identity and demographic attributes
    het identificatienummer Numeriek (positief geheel getal);
    de geboortedatum Datum in dagen;
    de leeftijd Numeriek (niet-negatief geheel getal) met eenheid jr;
    het burgerservicenummer Tekst;
    de woonprovincie Tekst;
    de woonregio factor Numeriek (geheel getal);
    
    // Tax calculation attributes
    de belasting op basis van afstand Bedrag;
    de belasting op basis van reisduur Bedrag; 
    de te betalen belasting Bedrag;
    
    // Treinmiles attributes
    de treinmiles Numeriek (geheel getal);
    de maximaal te ontvangen treinmiles Numeriek (geheel getal);

// Flight object with all flight-related attributes and characteristics  
Objecttype de Vlucht (mv: vluchten)
    // Characteristics
    is bereikbaar per trein kenmerk (bijvoeglijk);
    is duurzaam kenmerk (bijvoeglijk);
    is belaste reis kenmerk;
    is belast kenmerk (bijvoeglijk);
    is rondvlucht kenmerk;
    is bestemd voor minderjarigen kenmerk;
    is reis met paaskorting kenmerk;
    is in het hoogseizoen kenmerk;
    
    // Basic flight attributes
    de luchthaven van vertrek Luchthavens;
    de luchthaven van bestemming Luchthavens;
    de vluchtdatum Datum in dagen;
    de afstand tot bestemming Numeriek (geheel getal) met eenheid km;
    de reisduur per trein Numeriek (geheel getal);
    bereikbaar per trein Boolean;
    is duurzame vlucht Boolean;
    
    // Passenger information
    de hoeveelheid passagiers Numeriek (geheel getal);
    de hoeveelheid uitzonderingspassagiers Numeriek (geheel getal);
    de leeftijd van de oudste passagier Numeriek (niet-negatief geheel getal) met eenheid jr;
    
    // Tax calculation attributes
    de totale belasting op basis van afstand Bedrag;
    de totale belasting op basis van reisduur Bedrag;
    de totaal te betalen belasting Bedrag;
    
    // Timing attributes
    de verwachte datum-tijd van aankomst Datum en tijd in millisecondes;
    de verwachte datum-tijd van vertrek Datum en tijd in millisecondes;
    de verwachte duur Numeriek (geheel getal);
    de datum-tijd voor het berekenen van de belasting op basis van afstand Datum en tijd in millisecondes;
    het bevestigingstijdstip Datum en tijd in millisecondes;
    het uiterste boekingstijdstip Datum en tijd in millisecondes;

// Contingent of treinmiles for distribution
Objecttype het Contingent treinmiles (mv: contingenten treinmiles)
    het totaal aantal treinmiles Numeriek (positief geheel getal);
    het aantal treinmiles op basis van aantal passagiers Numeriek (positief geheel getal);
    het restant na verdeling Numeriek (positief geheel getal);

// ============================================================================
// PARAMETERS
// ============================================================================

// Age and demographic parameters
Parameter de volwassenleeftijd: Numeriek (niet-negatief geheel getal) met eenheid jr;
Parameter de pensioenleeftijd: Numeriek (geheel getal) met eenheid jr;

// Tax calculation parameters
Parameter de korting fossiele brandstof: Bedrag;
Parameter de initiele belasting: Bedrag;
Parameter de duurzaamheidskorting minimale afstand: Numeriek (geheel getal) met eenheid km;
Parameter de bovengrens afstand eerste schijf: Numeriek (geheel getal) met eenheid km;
Parameter het lage basistarief eerste schijf: Bedrag;
Parameter het lage tarief vermindering eerste schijf: Bedrag;

// Travel time calculation parameters  
Parameter het percentage reisduur eerste schijf: Percentage (geheel getal);
Parameter het percentage reisduur tweede schijf: Percentage (geheel getal);
Parameter het percentage reisduur derde schijf: Percentage (geheel getal);
Parameter de bovengrens reisduur eerste schijf: Numeriek (geheel getal);
Parameter de bovengrens reisduur tweede schijf: Numeriek (geheel getal);

// Treinmiles parameters
Parameter het aantal treinmiles per passagier: Numeriek (positief geheel getal);

// Date calculation parameters
Parameter de bevestigingsinterval: Datum en tijd in millisecondes;
Parameter de eerste boekingsdatum: Datum in dagen;

// ============================================================================
// FACT TYPES (FEITTYPES)
// ============================================================================

// Core relationship between passengers and flights
Feittype vlucht van natuurlijke personen
    de reis Vlucht
    de passagier Natuurlijk persoon
    Eén reis betreft de verplaatsing van meerdere passagiers

// Relationship between flights and treinmiles contingents
Feittype reis met contingent treinmiles  
    de reis met treinmiles Vlucht
    het vastgestelde contingent treinmiles Contingent treinmiles
    één reis met treinmiles heeft één vastgestelde contingent treinmiles

// Distribution relationship for treinmiles allocation
Feittype verdeling contingent treinmiles over passagiers
    het te verdelen contingent treinmiles Contingent treinmiles
    de passagier met recht op treinmiles Natuurlijk persoon
    één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles

// ============================================================================
// DAY TYPES
// ============================================================================

Dagsoort de kerstdag (mv: kerstdagen)