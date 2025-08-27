// TOKA (Wet Treinen Op Korte Afstand) RegelSpraak Rules
// This file contains all business rules for tax calculation and treinmiles distribution

// ============================================================================
// AGE CALCULATION AND CHARACTERISTICS
// ============================================================================

// Calculate age based on birth date and flight date
Regel bepaal leeftijd
    geldig altijd
        De leeftijd van een Natuurlijk persoon moet berekend worden als de tijdsduur van zijn
        geboortedatum tot de vluchtdatum van zijn reis in hele jaren.

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
        Een Vlucht is een belaste reis
        indien bereikbaar per trein van de vlucht.

// Determine if flight is sustainable
Regel Vlucht is duurzaam
    geldig altijd
        Een Vlucht is duurzaam
        indien is duurzame vlucht van de vlucht.

// Determine high season
// TODO: Fix date extraction rule
// Regel Hoogseizoen
//     geldig altijd
//         Een Vlucht is in het hoogseizoen
//         indien er aan ten minste één van de volgende voorwaarden wordt voldaan:
//         - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 6
//         - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 7
//         - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 8.

// Determine Easter discount
// TODO: Fix date extraction rule
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
        (het lage tarief vermindering eerste schijf maal de afstand tot bestemming van zijn reis)
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
        (zijn belasting op basis van afstand min de korting fossiele brandstof) naar beneden afgerond op 0 decimalen
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
// TODO: Fix object creation syntax for contingent treinmiles

// Create eligibility relationships
Regel passagier met recht op treinmiles
    geldig altijd
        Een passagier met recht op treinmiles van een vastgestelde contingent treinmiles is een
        passagier van de reis met treinmiles van het vastgestelde contingent treinmiles.

// Equal distribution of treinmiles  
// TODO: Implement verdeling rules with correct syntax

// Distribution rules
// TODO: Implement verdeling rules with correct syntax

// ============================================================================
// CONSISTENCY CHECKS
// ============================================================================

// Prevent round trips  
// TODO: Fix consistency rule - need proper syntax for "must not equal"

// ============================================================================
// DECISION TABLES (BESLISTABELLEN)
// ============================================================================

// Residence region factor lookup table
Beslistabel Woonregio factor
    geldig altijd

| | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie is |
|---|---|---|
| 1 | 1 | 'Friesland', 'Groningen', 'Drenthe', 'Zeeland' of 'Limburg' |
| 2 | 2 | 'Noord-Brabant', 'Gelderland', 'Overijssel' of 'Flevoland' |  
| 3 | 3 | 'Noord-Holland', 'Zuid-Holland' of 'Utrecht' |

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

// TODO: Fix dagsoort definition syntax
// Regel Kerstdag
//     geldig altijd
//         Een dag is een kerstdag
//         indien de dag aan alle volgende voorwaarden voldoet:
//         - de maand uit (de dag) is gelijk aan 12
//         - de dag voldoet aan ten minste één van de volgende voorwaarden:
//             .. de dag uit (de dag) is gelijk aan 25
//             .. de dag uit (de dag) is gelijk aan 26.

// ============================================================================
// DATE/TIME CALCULATIONS
// ============================================================================

// TODO: Implement date/time calculation rules with correct syntax