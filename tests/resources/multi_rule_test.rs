// This file tests multiple aspects of the parser's flexibility:
// 1. Multiple rules in a single file
// 2. Different termination styles (periods, newlines)
// 3. Spacing around bullet points and in expressions
// 4. Single-letter variable names
// 5. Newlines within expressions

// Test Rule 1: Tests period termination and basic calculation
Regel Bepaal belastingkorting
    geldig vanaf 01-01-2023
        De belastingkorting van een Belastingplichtige moet berekend worden als
        het basisbedrag verminderd met de inkomensafhankelijke vermindering.

// Test Rule 2: Tests bullet points with extra spacing, and single-letter variables
Regel Bepaal recht op toeslag
    geldig altijd
        Een Belastingplichtige heeft recht op toeslag
        indien hij aan alle volgende voorwaarden voldoet:
        
        • zijn inkomen is kleiner dan 30000
        • zijn leeftijd is groter dan 18.
        Daarbij geldt:
        X is 500.

// Test Rule 3: Tests expressions with newlines and rounding functions
Regel Forfaitaire verrekening
    geldig vanaf 01-01-2023 t/m 31-12-2023
        Het forfait moet gesteld worden op 
            (het basisbedrag plus het toeslagbedrag) naar beneden afgerond op 0 decimalen. 