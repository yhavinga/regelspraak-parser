# TOKA Implementation vs Specification Differences

This document comprehensively compares the TOKA implementation in `gegevens.rs` and `regels.rs` with the specification examples in `RegelSpraak-TOKA-casus-v2.1.0.md`.

## 1. GegevensSpraak Differences

### 1.1 Object Type: Natuurlijk persoon - Kenmerken

#### Kenmerk: Age Category Characteristics

**Specification (lines 17-22):**
```regelspraak
is minderjarig kenmerk (bijvoeglijk);
is passagier van 18 tot en met 24 jaar kenmerk;
is passagier van 25 tot en met 64 jaar kenmerk;
is passagier van 65 jaar of ouder kenmerk (bijvoeglijk);
het recht op duurzaamheidskorting kenmerk (bezittelijk);
```

**Implementation (gegevens.rs lines 25-30):**
```regelspraak
is minderjarig kenmerk (bijvoeglijk);
is jongere kenmerk;
is jongvolwassene kenmerk;
is volwassene kenmerk;
is senior kenmerk (bijvoeglijk);
het recht op duurzaamheidskorting kenmerk (bezittelijk);
```

**Differences:**
- Specification uses descriptive age ranges: "passagier van 18 tot en met 24 jaar"
- Implementation uses simplified names: "jongvolwassene", "volwassene", "senior"
- Implementation adds "is jongere" which is not in the specification
- Specification's "passagier van 65 jaar of ouder" becomes "is senior" in implementation

#### Attribute: treinmiles

**Specification (lines 30-31):**
```regelspraak
de treinmiles op basis van evenredige verdeling Numeriek (geheel getal);
de maximaal te ontvangen treinmiles bij evenredige verdeling volgens rangorde Numeriek (geheel getal);
```

**Implementation (gegevens.rs lines 46-47):**
```regelspraak
de treinmiles Numeriek (geheel getal);
de maximaal te ontvangen treinmiles Numeriek (geheel getal);
```

**Differences:**
- Specification has longer, more specific attribute names
- Implementation simplifies to "treinmiles" and "maximaal te ontvangen treinmiles"

### 1.2 Object Type: Vlucht - Kenmerken

#### Missing/Different Kenmerken

**Specification (lines 38-45):**
```regelspraak
de gebruik fossiele brandstoffen minder dan 50% kenmerk (bezittelijk);
de reiziger kenmerk;
de reis met paaskorting kenmerk;
```
Note: Specification also mentions "is in het hoogseizoen" in line 236

**Implementation (gegevens.rs lines 52-59):**
```regelspraak
is bereikbaar per trein kenmerk (bijvoeglijk);
is duurzaam kenmerk (bijvoeglijk);
is belaste reis kenmerk;
is belast kenmerk (bijvoeglijk);
is rondvlucht kenmerk;
is bestemd voor minderjarigen kenmerk;
is reis met paaskorting kenmerk;
is hoogseizoen kenmerk;
```

**Differences:**
- Specification has typo: "de gebruik fossiele..." should likely be "is gebruik..." 
- Specification has typo: "de reiziger kenmerk" should likely be "is reiziger"
- Specification has typo: "de reis met paaskorting" should be "is reis met paaskorting"
- Implementation doesn't include "gebruik fossiele brandstoffen" or "reiziger" kenmerken
- Specification uses "is in het hoogseizoen", implementation uses "is hoogseizoen"

#### Attribute: reisduur per trein

**Specification (line 53):**
```regelspraak
de reisduur per trein Numeriek (geheel getal);
```

**Implementation (gegevens.rs line 66):**
```regelspraak
de reisduur per trein Numeriek (geheel getal);
```

**Differences:**
- No unit specified in either (specification examples in decision tables suggest "minuten")

#### Missing Attribute

**Specification (line 66):**
```regelspraak
de datum van vertrek van de vlucht Datum in dagen;
```

**Implementation:**
Not present (uses `de vluchtdatum` instead)

**Differences:**
- Specification mentions both "vluchtdatum" and "datum van vertrek van de vlucht"
- Implementation only has "vluchtdatum"

### 1.3 Parameters

#### Parameter Names and Types

**Specification (line 82):**
```regelspraak
Parameter de korting bij gebruik niet-fossiele brandstof : Bedrag
```

**Implementation (gegevens.rs line 103):**
```regelspraak
Parameter de korting fossiele brandstof: Bedrag;
```

**Differences:**
- Different parameter name: specification uses "korting bij gebruik niet-fossiele brandstof"
- Implementation uses shorter "korting fossiele brandstof"

**Specification (line 86):**
```regelspraak
Parameter de aantal treinmiles per passagier voor contingent: Numeriek (positief geheel getal)
```

**Implementation (gegevens.rs line 118):**
```regelspraak
Parameter het aantal treinmiles per passagier: Numeriek (positief geheel getal);
```

**Differences:**
- Specification: "de aantal treinmiles per passagier voor contingent"
- Implementation: "het aantal treinmiles per passagier" (shorter, corrected article)

#### Missing Unit Specifications

**Specification (lines 96-97):**
```regelspraak
Parameter de bovengrens reisduur eerste schijf : Numeriek (geheel getal)
Parameter de bovengrens reisduur tweede schijf : Numeriek (geheel getal)
```

**Implementation (gegevens.rs lines 114-115):**
```regelspraak
Parameter de bovengrens reisduur eerste schijf: Numeriek (geheel getal);
Parameter de bovengrens reisduur tweede schijf: Numeriek (geheel getal);
```

**Differences:**
- Neither specifies unit, but decision table examples suggest "minuten" should be used

## 2. RegelSpraak Rules Differences

### 2.1 Age Calculation Rule

**Specification (lines 138-142):**
```regelspraak
Regel bepaal leeftijd
    geldig altijd
        De leeftijd van een Natuurlijk persoon moet berekend worden als de tijdsduur van zijn
        geboortedatum tot de vluchtdatum van zijn reis in hele jaren.
```

**Implementation (regels.rs lines 10-12):**
```regelspraak
Regel bepaal leeftijd
    geldig altijd
        De leeftijd van een Natuurlijk persoon moet berekend worden als 39 jr.
```

**Differences:**
- Specification uses proper calculation with relationship navigation
- Implementation hardcodes value to "39 jr" with a comment noting navigation needs implementation

### 2.2 Kenmerktoekenning Rules

#### Minderjarig Rule with Variable

**Specification (lines 147-154):**
```regelspraak
Parameter de volwassenleeftijd : Numeriek (niet-negatief geheel getal) met eenheid jr
Regel Kenmerktoekenning persoon minderjarig
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien X kleiner is dan de volwassenleeftijd.
        Daarbij geldt:
            X is de tijdsduur van zijn geboortedatum tot de vluchtdatum van zijn reis in hele jaren.
```

**Implementation (regels.rs lines 15-18):**
```regelspraak
Regel Kenmerktoekenning persoon minderjarig
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.
```

**Differences:**
- Specification uses variable X with "Daarbij geldt" clause
- Implementation directly references "zijn leeftijd" attribute (simpler)

#### Missing Age Category Rules

**Specification (lines 417-425):**
```regelspraak
Regel Passagier van 18 tm 24 jaar
    geldig altijd
        Een Natuurlijk persoon is een passagier van 18 tot en met 24 jaar
        indien hij aan alle volgende voorwaarden voldoet:
        - zijn leeftijd is groter of gelijk aan de volwassenleeftijd
        - zijn leeftijd is kleiner of gelijk aan 24 jr
        - hij is een passagier.
```

**Implementation (regels.rs lines 20-26):**
```regelspraak
Regel Jongvolwassene
    geldig altijd
        Een Natuurlijk persoon is jongvolwassene
        indien hij aan alle volgende voorwaarden voldoet:
        - zijn leeftijd is groter of gelijk aan de volwassenleeftijd
        - zijn leeftijd is kleiner of gelijk aan 24 jr.
```

**Differences:**
- Different kenmerk names as noted earlier
- Specification includes "hij is een passagier" condition
- Implementation doesn't check passenger role

### 2.3 Flight Characteristic Rules

#### Belaste Reis Rule

**Specification (lines 381-386):**
```regelspraak
Regel belaste reis
    geldig altijd
        Een Vlucht is een belaste reis
        indien bereikbaar per trein van de vlucht gelijk is aan waar.
```

**Implementation (regels.rs lines 44-47):**
```regelspraak
Regel belaste reis
    geldig altijd
        Een Vlucht is belaste reis
        indien bereikbaar per trein van de vlucht.
```

**Differences:**
- Specification: "is een belaste reis" vs Implementation: "is belaste reis"
- Specification explicitly compares to "waar", implementation uses implicit boolean

#### High Season Rule

**Specification (lines 234-241):**
```regelspraak
Regel Hoogseizoen
    geldig altijd
        Een Vlucht is in het hoogseizoen
        indien er aan ten minste één van de volgende voorwaarden wordt voldaan:
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 6
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 7
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 8.
```

**Implementation (regels.rs lines 56-62):**
```regelspraak
Regel Hoogseizoen
    geldig altijd
        Een Vlucht is hoogseizoen
        indien er aan ten minste één van de volgende voorwaarden wordt voldaan:
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 6
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 7
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 8.
```

**Differences:**
- Specification: "is in het hoogseizoen" vs Implementation: "is hoogseizoen"

#### Easter Discount Rule

**Specification (lines 245-250):**
```regelspraak
Regel Paaskorting
    geldig altijd
        Een vlucht is een reis met paaskorting
        indien de vluchtdatum van de vlucht gelijk is aan de eerste paasdag van (het jaar uit (de vluchtdatum van de vlucht)).
```

**Implementation (regels.rs lines 69-72):**
```regelspraak
Regel Paaskorting
    geldig altijd
        Een vlucht is reis met paaskorting
        indien de vluchtdatum van de vlucht gelijk is aan de eerste paasdag van (het jaar uit (de vluchtdatum van de vlucht)).
```

**Differences:**
- Minor difference: "is een reis met paaskorting" vs "is reis met paaskorting" (missing article)
- Function eerste_paasdag_van is now implemented (as of 2025-08-27)

### 2.4 Tax Calculation Rules

#### Tax Bounding Rule

**Specification (lines 217-222):**
```regelspraak
Regel Te betalen belasting van een passagier
    geldig altijd
        De te betalen belasting van een passagier moet berekend worden als zijn belasting op
        basis van afstand min de korting bij gebruik niet-fossiele brandstof, met een minimum
        van 0 € naar beneden afgerond op 0 decimalen.
```

**Implementation (regels.rs lines 101-105):**
```regelspraak
Regel Te betalen belasting van een passagier
    geldig altijd
        De te betalen belasting van een passagier moet berekend worden als 
        zijn belasting op basis van afstand min de korting fossiele brandstof naar beneden afgerond op 0 decimalen
        indien zijn reis is duurzaam.
```

**Differences:**
- Specification uses "korting bij gebruik niet-fossiele brandstof", implementation uses "korting fossiele brandstof"
- Specification includes "met een minimum van 0 €", implementation doesn't
- Implementation adds condition "indien zijn reis is duurzaam"

#### Complex Tax Calculation

**Specification (lines 429-446):**
```regelspraak
Regel belasting op basis van afstand
    geldig vanaf 2018
        De belasting op basis van afstand van een passagier moet gesteld worden op X min Y
        indien hij aan alle volgende voorwaarden voldoet:
        - zijn reis is een belaste reis
        - hij voldoet aan ten minste één van de volgende voorwaarden:
            .. hij is een passagier jonger dan 18 jaar
            .. hij is een passagier van 25 tot en met 64 jaar
        - de afstand tot bestemming in kilometers van zijn reis is groter dan 0
        - de afstand tot bestemming in kilometers van zijn reis is kleiner of gelijk aan de
          bovengrens afstand eerste schijf
        - X min Y is groter of gelijk aan 0.
        Daarbij geldt:
            X is het lage basistarief eerste schijf
            Y is het lage tarief vermindering eerste schijf maal
                  de afstand tot bestemming in kilometers van zijn reis.
```

**Implementation (regels.rs lines 81-88):**
```regelspraak
Regel belasting op basis van afstand
    geldig altijd
        De belasting op basis van afstand van een passagier moet gesteld worden op het lage basistarief eerste schijf min
        het lage tarief vermindering eerste schijf maal de afstand tot bestemming van zijn reis
        indien hij aan alle volgende voorwaarden voldoet:
        - zijn reis is een belaste reis
        - de afstand tot bestemming van zijn reis is groter dan 0 km
        - de afstand tot bestemming van zijn reis is kleiner of gelijk aan de bovengrens afstand eerste schijf.
```

**Differences:**
- Specification uses "geldig vanaf 2018", implementation uses "geldig altijd"
- Specification uses variables X and Y with "Daarbij geldt", implementation inlines the calculation
- Specification includes age-based conditions, implementation doesn't
- Specification includes "X min Y is groter of gelijk aan 0" condition, implementation doesn't
- Specification uses "in kilometers", implementation uses "km" unit

### 2.5 Object Creation Rules

#### Contingent Treinmiles Creation

**Specification (lines 266-272):**
```regelspraak
Parameter de aantal treinmiles per passagier voor contingent: Numeriek (positief geheel getal)
Regel vastgestelde contingent treinmiles
    geldig altijd
        Een vlucht heeft het vastgestelde contingent treinmiles met
        aantal treinmiles op basis van aantal passagiers gelijk aan het aantal passagiers
        van de Vlucht maal het aantal treinmiles per passagier voor contingent.
```

**Implementation (regels.rs lines 133-137):**
```regelspraak
Regel vastgestelde contingent treinmiles
    geldig altijd
        Er wordt een nieuw Contingent treinmiles aangemaakt met
        totaal aantal treinmiles gelijk aan de hoeveelheid passagiers
        van de vlucht maal het aantal treinmiles per passagier.
```

**Differences:**
- Specification: "Een vlucht heeft het vastgestelde contingent treinmiles met"
- Implementation: "Er wordt een nieuw Contingent treinmiles aangemaakt met"
- Specification sets "aantal treinmiles op basis van aantal passagiers"
- Implementation sets "totaal aantal treinmiles"
- Parameter name differs as noted earlier

### 2.6 Distribution Rules

#### Equal Distribution

**Specification (lines 299-305):**
```regelspraak
Regel verdeling treinmiles in gelijke delen
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
        de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld in gelijke delen.
```

**Implementation (regels.rs lines 146-150):**
```regelspraak
Regel verdeling treinmiles gelijk
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
        de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld in gelijke delen.
```

**Differences:**
- Rule name: "verdeling treinmiles in gelijke delen" vs "verdeling treinmiles gelijk"

#### Complex Distribution

**Specification (lines 355-366):**
```regelspraak
Regel Verdeling treinmiles op basis van leeftijd, woonregio factor, met maximum waarde en afronding
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
        de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld:
        - op volgorde van toenemende de leeftijd,
        - bij een even groot criterium naar rato van de woonregio factor,
        - met een maximum van het maximaal aantal te ontvangen treinmiles,
        - afgerond op 0 decimalen naar beneden.
        Als onverdeelde rest blijft het restant na verdeling van het te verdelen contingent treinmiles over.
```

**Implementation (regels.rs lines 160-169):**
```regelspraak
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
```

**Differences:**
- Rule name simplified from descriptive name to "Verdeling treinmiles complex"
- Content is identical

### 2.7 Consistency Rules

**Specification (lines 283-288):**
```regelspraak
Regel Controleer of vlucht geen rondvlucht is
    geldig altijd
        De luchthaven van vertrek van een vlucht moet ongelijk zijn aan de luchthaven van
        bestemming van de vlucht.
```

**Implementation (regels.rs lines 176-179):**
```regelspraak
Consistentieregel Geen rondvlucht
    De data is inconsistent
    indien de luchthaven van vertrek van een vlucht gelijk is aan de luchthaven van
    bestemming van de vlucht.
```

**Differences:**
- Specification uses standard rule with "moet ongelijk zijn"
- Implementation uses "Consistentieregel" keyword with "De data is inconsistent indien"
- Logic is inverted but equivalent

### 2.8 Decision Tables

#### Woonregio Factor Table

**Specification (lines 452-459):**
```regelspraak
Beslistabel Woonregio factor
    geldig altijd
```
| | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie gelijk is aan |
|---|---|---|
| 1 | 1 | 'Friesland', 'Groningen', 'Drenthe', 'Zeeland' of 'Limburg' |
| 2 | 2 | 'Noord-Brabant', 'Gelderland', 'Overijssel' of 'Flevoland' |
| 3 | 3 | 'Noord-Holland', 'Zuid-Holland' of 'Utrecht' |

**Implementation (regels.rs lines 187-203):**
```regelspraak
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
```

**Differences:**
- Specification uses "of" to combine multiple provinces in one row
- Implementation splits into individual rows (one province per row)
- Specification column: "indien zijn woonprovincie gelijk is aan"
- Implementation column: "indien zijn woonprovincie is" (shorter)

#### Travel Duration Tax Table

**Specification (lines 463-470):**
```regelspraak
Beslistabel Belasting op basis van reisduur
    geldig altijd
```
Column headers: "indien de reisduur per trein **in minuten** van zijn reis"

**Implementation (regels.rs lines 206-213):**
```regelspraak
Beslistabel Belasting op basis van reisduur
    geldig altijd
```
Column headers: "indien de reisduur per trein van zijn reis" (no "in minuten")

**Differences:**
- Specification explicitly includes "in minuten" in column headers
- Implementation omits the unit specification

### 2.9 Date/Time Calculations

#### Arrival Time Calculation

**Specification (lines 225-230):**
```regelspraak
Regel Verwachte datum-tijd van aankomst van een Vlucht
    geldig altijd
        De verwachte datum-tijd van aankomst van een vlucht moet berekend worden als de verwachte
        Datum-tijd van vertrek van de Vlucht plus de verwachte duur van de vlucht.
```

**Implementation (regels.rs lines 233-236):**
```regelspraak
Regel Verwachte datum-tijd van aankomst van een Vlucht
    geldig altijd
        De verwachte datum-tijd van aankomst van een vlucht moet berekend worden als de verwachte
        datum-tijd van vertrek van de vlucht plus de verwachte duur van de vlucht.
```

**Differences:**
- Specification capitalizes "Datum-tijd" and "Vlucht" inconsistently
- Implementation uses lowercase consistently

#### Confirmation Time with Variables

**Specification (lines 204-213):**
```regelspraak
Parameter de bevestigingsinterval : Datum en tijd in millisecondes
Parameter de eerste boekingsdatum : Datum in dagen
Regel Bevestigingstijdstip vlucht
    geldig altijd
        Het bevestigingstijdstip van een vlucht moet berekend worden als de laatste van A en B.
        Daarbij geldt:
            A is het uiterste boekingstijdstip van de vlucht plus bevestigingsinterval
            B is eerste boekingsdatum.
```

**Implementation (regels.rs lines 239-244):**
```regelspraak
Regel Bevestigingstijdstip vlucht
    geldig altijd
        Het bevestigingstijdstip van een vlucht moet berekend worden als de laatste van A en B.
        Daarbij geldt:
            A is het uiterste boekingstijdstip van de vlucht plus de bevestigingsinterval
            B is de eerste boekingsdatum.
```

**Differences:**
- Implementation adds articles: "de bevestigingsinterval" and "de eerste boekingsdatum"
- Specification omits articles in the variable definitions

## 3. Summary of Major Differences

### 3.1 Systematic Simplifications
- Kenmerk names simplified (e.g., "passagier van 18 tot en met 24 jaar" → "jongvolwassene")
- Parameter names shortened and corrected
- Decision tables expanded from multi-value to single-value rows

### 3.2 Missing Functionality
- Age calculation hardcoded instead of using relationship navigation
- Paaskorting rule commented out (missing eerste_paasdag_van function)
- Some attributes from specification not implemented

### 3.3 Syntax Variations
- Boolean conditions simplified (implicit vs explicit "waar" comparison)
- Article usage more consistent in implementation
- Consistency rule uses different syntax pattern

### 3.4 Parser Compatibility Changes
- Decision tables can't handle "of" syntax for multiple values
- Object creation syntax adjusted for parser
- Some complex navigation patterns simplified

These differences reflect both parser limitations and deliberate simplifications made during implementation. The core business logic remains largely intact, but some advanced features need further development.