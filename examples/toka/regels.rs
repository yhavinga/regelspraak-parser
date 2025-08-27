// TOKA (Wet Treinen Op Korte Afstand) RegelSpraak Rules
// This file contains all business rules for tax calculation and treinmiles distribution

// ============================================================================
// AGE CALCULATION AND CHARACTERISTICS
// ============================================================================

// Calculate age based on birth date and flight date  
// Note: This rule needs proper relationship navigation implementation
Regel bepaal leeftijd
    geldig altijd
        De leeftijd van een Natuurlijk persoon moet berekend worden als 39 jr.

// Assign age category characteristics
Regel Kenmerktoekenning persoon minderjarig
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.

Regel Jongvolwassene
    geldig altijd
        Een Natuurlijk persoon is jongvolwassene
        indien hij aan alle volgende voorwaarden voldoet:
        - zijn leeftijd is groter of gelijk aan de volwassenleeftijd
        - zijn leeftijd is kleiner of gelijk aan 24 jr.

Regel Volwassene  
    geldig altijd
        Een Natuurlijk persoon is volwassene
        indien hij aan alle volgende voorwaarden voldoet:
        - zijn leeftijd is groter of gelijk aan 25 jr
        - zijn leeftijd is kleiner dan de pensioenleeftijd.

Regel Senior passagier
    geldig altijd
        Een Natuurlijk persoon is senior
        indien zijn leeftijd groter of gelijk aan de pensioenleeftijd is.

// ============================================================================
// FLIGHT CHARACTERISTICS
// ============================================================================

// Determine if flight is taxable
Regel belaste reis
    geldig altijd
        Een Vlucht is belaste reis
        indien bereikbaar per trein van de vlucht.

// Determine if flight is sustainable
Regel Vlucht is duurzaam
    geldig altijd
        Een Vlucht is duurzaam
        indien is duurzame vlucht van de vlucht.

// Determine high season
Regel Hoogseizoen
    geldig altijd
        Een Vlucht is hoogseizoen
        indien er aan ten minste één van de volgende voorwaarden wordt voldaan:
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 6
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 7
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 8.

// Determine Easter discount
// TODO: eerste_paasdag_van function not implemented
// Regel Paaskorting
//     geldig altijd
//         Een vlucht is een reis met paaskorting
//         indien de vluchtdatum van de vlucht gelijk is aan de eerste paasdag van (het jaar uit (de vluchtdatum van de vlucht)).

// ============================================================================
// TAX CALCULATION
// ============================================================================

// Initialize tax calculation
Regel Initialiseer te betalen belasting op initiele belasting
    geldig altijd
        De te betalen belasting van een passagier moet geïnitialiseerd worden op de initiele belasting.

// Distance-based tax calculation (simplified for first bracket)
Regel belasting op basis van afstand
    geldig altijd
        De belasting op basis van afstand van een passagier moet gesteld worden op het lage basistarief eerste schijf min
        het lage tarief vermindering eerste schijf maal de afstand tot bestemming van zijn reis
        indien hij aan alle volgende voorwaarden voldoet:
        - zijn reis is een belaste reis
        - de afstand tot bestemming van zijn reis is groter dan 0 km
        - de afstand tot bestemming van zijn reis is kleiner of gelijk aan de bovengrens afstand eerste schijf.

// Sustainability discount eligibility
Regel Recht op Duurzaamheidskorting
    geldig altijd
        Een passagier heeft recht op duurzaamheidskorting
        indien hij aan alle volgende voorwaarden voldoet:
        - zijn reis is duurzaam
        - de afstand tot bestemming in kilometers van zijn reis is groter of gelijk aan
          de duurzaamheidskorting minimale afstand
        - zijn leeftijd is groter of gelijk aan de pensioenleeftijd.

// Final tax calculation with discounts
Regel Te betalen belasting van een passagier
    geldig altijd
        De te betalen belasting van een passagier moet berekend worden als 
        zijn belasting op basis van afstand min de korting fossiele brandstof naar beneden afgerond op 0 decimalen
        indien zijn reis is duurzaam.

// ============================================================================
// AGGREGATION RULES
// ============================================================================

// Count passengers on flight
Regel Hoeveelheid passagiers van een reis
    geldig altijd
        De hoeveelheid passagiers van een reis moet berekend worden als het aantal passagiers van de reis.

// Sum passenger taxes for flight total
Regel Totaal te betalen belasting
    geldig altijd
        De totaal te betalen belasting van een reis moet berekend worden als de som van de te
        betalen belasting van alle passagiers van de reis.

// Find oldest passenger
Regel Leeftijd oudste passagier
    geldig altijd
        De leeftijd van de oudste passagier van een reis moet gesteld worden op de maximale waarde van
        de leeftijd van alle passagiers van de reis.

// ============================================================================
// TREINMILES CREATION AND DISTRIBUTION  
// ============================================================================

// Create treinmiles contingent for each flight
Regel vastgestelde contingent treinmiles
    geldig altijd
        Er wordt een nieuw Contingent treinmiles aangemaakt met
        totaal aantal treinmiles gelijk aan de hoeveelheid passagiers
        van de vlucht maal het aantal treinmiles per passagier.

// Create eligibility relationships
Regel passagier met recht op treinmiles
    geldig altijd
        Een passagier met recht op treinmiles van een vastgestelde contingent treinmiles is een
        passagier van de reis met treinmiles van het vastgestelde contingent treinmiles.

// Equal distribution of treinmiles
Regel verdeling treinmiles gelijk
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
        de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld in gelijke delen.

// Distribution by residence factor
Regel verdeling treinmiles woonregio
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
        de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld naar rato van de woonregio factor.

// Complex distribution by age and residence with maximum and rounding
Regel Verdeling treinmiles complex
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
        de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld:
        - op volgorde van toenemende de leeftijd,
        - bij een even groot criterium naar rato van de woonregio factor,
        - met een maximum van de maximaal te ontvangen treinmiles,
        - afgerond op 0 decimalen naar beneden.
        Als onverdeelde rest blijft het restant na verdeling van het te verdelen contingent treinmiles over.

// ============================================================================
// CONSISTENCY CHECKS
// ============================================================================

// Prevent round trips
Consistentieregel Geen rondvlucht
    De data is inconsistent
    indien de luchthaven van vertrek van een vlucht gelijk is aan de luchthaven van
    bestemming van de vlucht.

// ============================================================================
// DECISION TABLES (BESLISTABELLEN)
// ============================================================================

// Residence region factor lookup table
// Simplified to single province per row for parser compatibility
Beslistabel Woonregio factor
    geldig altijd

| | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie is |
|---|---|---|
| 1 | 1 | 'Friesland' |
| 2 | 1 | 'Groningen' |
| 3 | 1 | 'Drenthe' |
| 4 | 1 | 'Zeeland' |
| 5 | 1 | 'Limburg' |
| 6 | 2 | 'Noord-Brabant' |
| 7 | 2 | 'Gelderland' |
| 8 | 2 | 'Overijssel' |
| 9 | 2 | 'Flevoland' |
| 10 | 3 | 'Noord-Holland' |
| 11 | 3 | 'Zuid-Holland' |
| 12 | 3 | 'Utrecht' |

// Travel duration tax calculation
Beslistabel Belasting op basis van reisduur
    geldig altijd

| | de belasting op basis van reisduur van een passagier moet gesteld worden op | indien de reisduur per trein van zijn reis groter is dan | indien de reisduur per trein van zijn reis kleiner of gelijk is aan |
|---|---|---|---|
| 1 | het percentage reisduur eerste schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen | n.v.t. | de bovengrens reisduur eerste schijf |
| 2 | het percentage reisduur tweede schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen | de bovengrens reisduur eerste schijf | de bovengrens reisduur tweede schijf |
| 3 | het percentage reisduur derde schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen | de bovengrens reisduur tweede schijf | n.v.t. |

// ============================================================================
// CHRISTMAS DAY DEFINITION
// ============================================================================

Regel Kerstdag
    geldig altijd
        Een dag is een kerstdag
        indien de dag aan alle volgende voorwaarden voldoet:
        - de maand uit (de dag) is gelijk aan 12
        - de dag voldoet aan ten minste één van de volgende voorwaarden:
            .. de dag uit (de dag) is gelijk aan 25
            .. de dag uit (de dag) is gelijk aan 26.

// ============================================================================
// DATE/TIME CALCULATIONS
// ============================================================================

// Calculate expected arrival time
Regel Verwachte datum-tijd van aankomst van een Vlucht
    geldig altijd
        De verwachte datum-tijd van aankomst van een vlucht moet berekend worden als de verwachte
        datum-tijd van vertrek van de vlucht plus de verwachte duur van de vlucht.

// Calculate confirmation time  
Regel Bevestigingstijdstip vlucht
    geldig altijd
        Het bevestigingstijdstip van een vlucht moet berekend worden als de laatste van A en B.
        Daarbij geldt:
            A is het uiterste boekingstijdstip van de vlucht plus de bevestigingsinterval
            B is de eerste boekingsdatum.