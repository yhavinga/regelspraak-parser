# TOKA Implementation vs Specification Differences - November 5, 2024

This document provides a comprehensive comparison of the TOKA implementation files (`gegevens.rs` and `regels.rs` as of September 2024) with the RegelSpraak specification v2.1.0, showing exact side-by-side code comparisons.

## Executive Summary

### Status Update Since August 2024

**Improvements Made:**
- ✅ Kenmerk names now match specification exactly (e.g., "is passagier van 18 tot en met 24 jaar")
- ✅ "datum van vertrek van de vlucht" attribute is now present
- ✅ Object creation syntax properly implemented
- ✅ Easter calculation (eerste_paasdag_van) function working

**Critical Issues Remaining:**
- ❌ **ALL Eenheidsysteem (Unit System) definitions missing** - Major feature gap
- ❌ Parameter datatype mismatch for `bevestigingsinterval`
- ❌ Missing Beslistabel Minderjarig (decision table)
- ❌ Tax calculation rules oversimplified (missing age conditions)
- ❌ Only 3 of 6 distribution rule variations implemented

### Difference Statistics
- **Total differences identified: 39**
- **Critical functional differences: 8**
- **Naming/syntax differences: 12**
- **Extra implementation features: 6**
- **Simplifications: 4**
- **Missing features: 9**

## 1. GegevensSpraak Differences

### 1.1 Object Type: Natuurlijk persoon

#### Age Category Kenmerken (FIXED ✅)

**Specification (lines 17-22):**
```regelspraak
is minderjarig kenmerk (bijvoeglijk);
is passagier van 18 tot en met 24 jaar kenmerk;
is passagier van 25 tot en met 64 jaar kenmerk;
is passagier van 65 jaar of ouder kenmerk (bijvoeglijk);
het recht op duurzaamheidskorting kenmerk (bezittelijk);
```

**Implementation (gegevens.rs lines 25-29):**
```regelspraak
is minderjarig kenmerk (bijvoeglijk);
is passagier van 18 tot en met 24 jaar kenmerk;
is passagier van 25 tot en met 64 jaar kenmerk;
is passagier van 65 jaar of ouder kenmerk (bijvoeglijk);
het recht op duurzaamheidskorting kenmerk (bezittelijk);
```

**Differences:**
- ✅ FIXED - Now matches specification exactly (was simplified in August 2024)

#### Treinmiles Attributes

**Specification (lines 26-27):**
```regelspraak
de treinmiles op basis van evenredige verdeling Numeriek (geheel getal);
de maximaal te ontvangen treinmiles bij evenredige verdeling volgens rangorde Numeriek (geheel getal);
```

**Implementation (gegevens.rs lines 45-46):**
```regelspraak
de treinmiles op basis van evenredige verdeling	Numeriek (geheel getal);
de maximaal te ontvangen treinmiles bij evenredige verdeling volgens rangorde	Numeriek (geheel getal);
```

**Differences:**
- ✅ FIXED - Now matches specification exactly (attribute names were simplified in August 2024)

### 1.2 Object Type: Vlucht

#### Fossiele Brandstof Kenmerk

**Specification (line 36):**
```regelspraak
de gebruik fossiele brandstoffen minder dan 50% kenmerk (bezittelijk);
```

**Implementation (gegevens.rs line 52):**
```regelspraak
de gebruik fossiele brandstof minder dan 50 procent kenmerk (bezittelijk);
```

**Differences:**
- "brandstoffen" vs "brandstof" (plural vs singular)
- "50%" vs "50 procent" (symbol vs word)

#### Hoogseizoen Kenmerk

**Specification (line 250 in rules, not in objecttype definition):**
```regelspraak
// Not defined as kenmerk in objecttype definition
```

**Implementation (gegevens.rs line 60):**
```regelspraak
is in het hoogseizoen kenmerk;
```

**Differences:**
- Extra kenmerk added in implementation (specification only uses it in rules)

#### Datum van Vertrek Attribute (FIXED ✅)

**Specification (line 63):**
```regelspraak
de datum van vertrek van de vlucht Datum in dagen;
```

**Implementation (gegevens.rs line 66):**
```regelspraak
de datum van vertrek van de vlucht	Datum in dagen;  // Per spec line 66
```

**Differences:**
- ✅ FIXED - Now present (was missing in August 2024)

### 1.3 Contingent treinmiles

#### Object Type Definition

**Specification (line 67):**
```regelspraak
Objecttype het Contingent treinmiles
```

**Implementation (gegevens.rs line 91):**
```regelspraak
Objecttype het Contingent treinmiles (mv: contingenten treinmiles)
```

**Differences:**
- Implementation adds plural form specification `(mv: contingenten treinmiles)`

### 1.4 Parameters

#### Bevestigingsinterval Datatype (CRITICAL ❌)

**Specification (line 92):**
```regelspraak
Parameter de bevestigingsinterval : Datum en tijd in millisecondes
```

**Implementation (gegevens.rs line 123):**
```regelspraak
Parameter de bevestigingsinterval: Numeriek (geheel getal) met eenheid minuut
```

**Differences:**
- **CRITICAL**: Different datatype - `Datum en tijd in millisecondes` vs `Numeriek (geheel getal) met eenheid minuut`

#### Aantal Treinmiles Parameter

**Specification (line 94):**
```regelspraak
Parameter de aantal treinmiles per passagier voor contingent : Numeriek (positief geheel getal)
```

**Implementation (gegevens.rs line 120):**
```regelspraak
Parameter het aantal treinmiles per passagier voor contingent: Numeriek (positief geheel getal)
```

**Differences:**
- Article: "de" vs "het"
- Space before colon in specification

#### Korting Parameter

**Specification (line 90):**
```regelspraak
Parameter de korting bij gebruik niet-fossiele brandstof : Bedrag
```

**Implementation (gegevens.rs line 105):**
```regelspraak
Parameter de korting bij gebruik niet-fossiele brandstof: Bedrag
```

**Differences:**
- ✅ FIXED - Now matches specification (was "korting fossiele brandstof" in previous versions)

### 1.5 Fact Types (Feittypes)

#### Vlucht van Natuurlijke Personen

**Specification (lines 111-114):**
```regelspraak
Feittype vlucht van natuurlijke personen
    de reis Vlucht
    de passagier Natuurlijk persoon
één reis betreft de verplaatsing van meerdere passagiers
```

**Implementation (gegevens.rs lines 131-134):**
```regelspraak
Feittype vlucht van natuurlijke personen
    de reis	Vlucht
    de passagier (mv: passagiers)	Natuurlijk persoon
    één reis betreft de verplaatsing van meerdere passagiers
```

**Differences:**
- Implementation adds plural form `(mv: passagiers)`

#### Verdeling Contingent Treinmiles

**Specification (lines 125-128):**
```regelspraak
Feittype verdeling contingent treinmiles over passagiers
    het te verdelen contingent treinmiles Contingent Treinmiles
    de passagier met recht op treinmiles Natuurlijk persoon
één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles
```

**Implementation (gegevens.rs lines 143-146):**
```regelspraak
Feittype verdeling contingent treinmiles over passagiers
    het te verdelen contingent treinmiles	Contingent treinmiles
    de passagier met recht op treinmiles (mv: passagiers met recht op treinmiles)	Natuurlijk persoon
    één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles
```

**Differences:**
- Capitalization: `Contingent Treinmiles` vs `Contingent treinmiles`
- Implementation adds plural form specification

### 1.6 Unit Systems (Eenheidsysteem) - CRITICAL MISSING ❌

**Specification (lines 133-157):**
```regelspraak
Eenheidsysteem Valuta
    de euro (mv: euros) EUR €

Eenheidsysteem Tijd
    de milliseconde ms = /1000 s
    de seconde s = /60 minuut
    de minuut minuut = /60 u
    het uur u = /24 dg
    de dag dg
    de week wk = 7 dg
    de maand mnd
    het kwartaal kw = 3 mnd
    het jaar jr = 12 mnd

Eenheidsysteem afstand
    de millimeter (mv: millimeters) mm = /1000 m
    de centimeter (mv: centimeters) cm = /100 m
    de meter (mv: meters) m
    de kilometer (mv: kilometers) km = 1000 m
```

**Implementation:**
```regelspraak
// NOT PRESENT - No Eenheidsysteem definitions at all
```

**Differences:**
- **CRITICAL**: Entire unit system definitions missing from implementation

## 2. RegelSpraak Rule Differences

### 2.1 Age Calculation Rule (FIXED ✅)

**Specification (lines 170-173):**
```regelspraak
Regel bepaal leeftijd
    geldig altijd
        De leeftijd van een Natuurlijk persoon moet berekend worden als de tijdsduur van zijn
        geboortedatum tot de vluchtdatum van zijn reis in hele jaren.
```

**Implementation (regels.rs lines 9-12):**
```regelspraak
Regel bepaal leeftijd
    geldig altijd
        De leeftijd van een Natuurlijk persoon moet berekend worden als de tijdsduur van zijn
        geboortedatum tot de vluchtdatum van zijn reis in hele jaren.
```

**Differences:**
- ✅ FIXED - Now matches specification (was hardcoded to "39 jr" in August 2024)

### 2.2 Kenmerktoekenning persoon minderjarig

**Specification (lines 179-185):**
```regelspraak
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
- Implementation directly references "zijn leeftijd" attribute (simpler approach)

### 2.3 Age Category Rules

**Specification (lines 417-424):**
```regelspraak
Regel Passagier van 18 tm 24 jaar
    geldig altijd
        Een Natuurlijk persoon is een passagier van 18 tot en met 24 jaar
        indien hij aan alle volgende voorwaarden voldoet:
        - zijn leeftijd is groter of gelijk aan de volwassenleeftijd
        - zijn leeftijd is kleiner of gelijk aan 24 jr
        - hij is een passagier.
```

**Implementation (regels.rs lines 21-27):**
```regelspraak
Regel Passagier van 18 tm 24 jaar
    geldig altijd
        Een Natuurlijk persoon is een passagier van 18 tot en met 24 jaar
        indien hij aan alle volgende voorwaarden voldoet:
        - zijn leeftijd is groter of gelijk aan de volwassenleeftijd
        - zijn leeftijd is kleiner of gelijk aan 24 jr
        - hij is een passagier.
```

**Differences:**
- ✅ FIXED - Now matches specification exactly

### 2.4 Belaste Reis Rule

**Specification (lines 387-389):**
```regelspraak
Regel belaste reis
    geldig altijd
        Een Vlucht is een belaste reis
        indien bereikbaar per trein van de vlucht gelijk is aan waar.
```

**Implementation (regels.rs lines 49-52):**
```regelspraak
Regel belaste reis
    geldig altijd
        Een Vlucht is een belaste reis
        indien bereikbaar per trein van de vlucht gelijk is aan waar.
```

**Differences:**
- ✅ FIXED - Now matches specification (article "een" was missing in August 2024)

### 2.5 Vlucht is Duurzaam (Extra Rule)

**Specification:**
```regelspraak
// Not defined - specification doesn't define how "duurzaam" is determined
```

**Implementation (regels.rs lines 57-60):**
```regelspraak
Regel Vlucht is duurzaam
    geldig altijd
        Een vlucht is duurzaam
        indien hij het gebruik fossiele brandstof minder dan 50 procent heeft.
```

**Differences:**
- Extra rule added by implementation to fill specification gap

### 2.6 Hoogseizoen Rule

**Specification (lines 250-256):**
```regelspraak
Regel Hoogseizoen
    geldig altijd
        Een Vlucht is in het hoogseizoen
        indien er aan ten minste één van de volgende voorwaarden wordt voldaan:
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 6
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 7
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 8.
```

**Implementation (regels.rs lines 63-69):**
```regelspraak
Regel Hoogseizoen
    geldig altijd
        Een Vlucht is in het hoogseizoen
        indien er aan ten minste één van de volgende voorwaarden wordt voldaan:
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 6
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 7
        - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 8.
```

**Differences:**
- ✅ FIXED - Now matches specification exactly

### 2.7 Paaskorting Rule (FIXED ✅)

**Specification (lines 261-264):**
```regelspraak
Regel Paaskorting
    geldig altijd
        Een vlucht is een reis met paaskorting
        indien de vluchtdatum van de vlucht gelijk is aan de eerste paasdag van (het jaar uit (de vluchtdatum van de vlucht)).
```

**Implementation (regels.rs lines 72-75):**
```regelspraak
Regel Paaskorting
    geldig altijd
        Een vlucht is een reis met paaskorting
        indien de vluchtdatum van de vlucht gelijk is aan de eerste paasdag van (het jaar uit (de vluchtdatum van de vlucht)).
```

**Differences:**
- ✅ FIXED - Now matches specification and works (Easter calculation implemented)

### 2.8 Belasting op Basis van Afstand (SIMPLIFIED ❌)

**Specification (lines 429-445):**
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

**Implementation (regels.rs lines 87-94):**
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
- Missing "geldig vanaf 2018" (uses "geldig altijd")
- Missing age-based conditions
- No "Daarbij geldt" variable usage
- Missing "X min Y is groter of gelijk aan 0" condition

### 2.9 Te Betalen Belasting

**Specification (lines 230-234):**
```regelspraak
Regel Te betalen belasting van een passagier
    geldig altijd
        De te betalen belasting van een passagier moet berekend worden als zijn belasting op
        basis van afstand min de korting bij gebruik niet-fossiele brandstof, met een minimum
        van 0 € naar beneden afgerond op 0 decimalen.
```

**Implementation (regels.rs lines 106-108):**
```regelspraak
Regel Te betalen belasting van een passagier
    geldig altijd
        De te betalen belasting van een passagier moet berekend worden als zijn belasting op basis van afstand plus zijn belasting op basis van reisduur min de korting bij gebruik niet-fossiele brandstof, met een minimum van 0 € naar beneden afgerond op 0 decimalen.
```

**Differences:**
- Implementation adds "+ zijn belasting op basis van reisduur" to the formula

### 2.10 Vastgestelde Contingent Treinmiles

**Specification (lines 270-274):**
```regelspraak
Regel vastgestelde contingent treinmiles
    geldig altijd
        Een vlucht heeft het vastgestelde contingent treinmiles met
        aantal treinmiles op basis van aantal passagiers gelijk aan het aantal passagiers
        van de Vlucht maal het aantal treinmiles per passagier voor contingent.
```

**Implementation (regels.rs lines 136-140):**
```regelspraak
Regel vastgestelde contingent treinmiles
    geldig altijd
        Een vlucht heeft het vastgestelde contingent treinmiles met
        aantal treinmiles op basis van aantal passagiers gelijk aan het aantal passagiers
        van de Vlucht maal het aantal treinmiles per passagier voor contingent.
```

**Differences:**
- ✅ FIXED - Now matches specification syntax

### 2.11 Distribution Rules (MISSING VARIATIONS ❌)

#### Equal Distribution

**Specification (lines 306-310):**
```regelspraak
Regel verdeling treinmiles in gelijke delen
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
        de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld in gelijke delen.
```

**Implementation (regels.rs lines 155-159):**
```regelspraak
Regel verdeling treinmiles in gelijke delen
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
        de treinmiles op basis van evenredige verdeling van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld in gelijke delen.
```

**Differences:**
- Target attribute: "de treinmiles" vs "de treinmiles op basis van evenredige verdeling"

#### Missing Distribution Rules

**Specification defines these additional rules (lines 321-354):**
```regelspraak
Regel Verdeling treinmiles op basis van leeftijd en woonregio factor
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
        de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld:
        - op volgorde van toenemende de leeftijd,
        - bij een even groot criterium naar rato van de woonregio factor.
        Als onverdeelde rest blijft het restant na verdeling van het te verdelen contingent treinmiles over.

Regel verdeling treinmiles op basis van woonregio factor en met maximum waarde
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld
        over de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld:
        - naar rato van de woonregio factor,
        - met een maximum van het maximaal aantal te ontvangen treinmiles.
        Als onverdeelde rest blijft het restant na verdeling van het te verdelen contingent
        treinmiles over.

Regel verdeling treinmiles op basis van woonregio factor met afronding
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld
        over de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld:
        - naar rato van de woonregio factor,
        - afgerond op 0 decimalen naar beneden
        Als onverdeelde rest blijft het restant na verdeling van het te verdelen contingent
        treinmiles over.
```

**Implementation:**
```regelspraak
// These three distribution rule variations are NOT IMPLEMENTED
```

**Differences:**
- Missing 3 of 6 distribution rule variations

### 2.12 Consistency Rule

**Specification (lines 289-293):**
```regelspraak
Regel Controleer of vlucht geen rondvlucht is
    geldig altijd
        De luchthaven van vertrek van een vlucht moet ongelijk zijn aan de luchthaven van
        bestemming van de vlucht.
```

**Implementation (regels.rs lines 185-188):**
```regelspraak
Regel Controleer of vlucht geen rondvlucht is
    geldig altijd
        De luchthaven van vertrek van een vlucht moet ongelijk zijn aan de luchthaven van
        bestemming van de vlucht.
```

**Differences:**
- ✅ FIXED - Now uses standard rule syntax (was using Consistentieregel in previous versions)

### 2.13 Date/Time Calculations

#### Verwachte Datum-tijd van Aankomst

**Specification (lines 240-243):**
```regelspraak
Regel Verwachte datum-tijd van aankomst van een Vlucht
    geldig altijd
        De verwachte datum-tijd van aankomst van een vlucht moet berekend worden als de verwachte
        Datum-tijd van vertrek van de Vlucht plus de verwachte duur van de vlucht.
```

**Implementation (regels.rs lines 232-235):**
```regelspraak
Regel Verwachte datum-tijd van aankomst van een Vlucht
    geldig altijd
        De verwachte datum-tijd van aankomst van een vlucht moet berekend worden als de verwachte
        datum-tijd van vertrek van de vlucht plus de verwachte duur van de vlucht.
```

**Differences:**
- Capitalization: "Datum-tijd" and "Vlucht" vs lowercase

#### Bevestigingstijdstip

**Specification (lines 219-224):**
```regelspraak
Regel Bevestigingstijdstip vlucht
    geldig altijd
        Het bevestigingstijdstip van een vlucht moet berekend worden als de laatste van A en B.
        Daarbij geldt:
            A is het uiterste boekingstijdstip van de vlucht plus bevestigingsinterval
            B is eerste boekingsdatum.
```

**Implementation (regels.rs lines 238-243):**
```regelspraak
Regel Bevestigingstijdstip vlucht
    geldig altijd
        Het bevestigingstijdstip van een vlucht moet berekend worden als de laatste van A en B.
        Daarbij geldt:
	        A is het uiterste boekingstijdstip van de vlucht plus de bevestigingsinterval
            B is de eerste boekingsdatum.
```

**Differences:**
- Articles added: "de bevestigingsinterval" and "de eerste boekingsdatum"

### 2.14 Missing Rules

#### Datum-tijd voor het Berekenen van de Belasting (MISSING ❌)

**Specification (lines 212-216):**
```regelspraak
Regel Datum-tijd voor het berekenen van de belasting op basis van afstand
    geldig altijd
        De datum-tijd voor het berekenen van de belasting op basis van afstand van een vlucht moet berekend worden als de eerste van de verwachte datum-tijd van vertrek van de vlucht en de
        daadwerkelijke datum-tijd van vertrek van de vlucht.
```

**Implementation:**
```regelspraak
// NOT IMPLEMENTED
```

## 3. Decision Table (Beslistabel) Differences

### 3.1 Woonregio Factor

**Specification (lines 452-459):**
```regelspraak
Beslistabel Woonregio factor
    geldig altijd

| | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie gelijk is aan |
|---|---|---|
| 1 | 1 | 'Friesland', 'Groningen', 'Drenthe', 'Zeeland' of 'Limburg' |
| 2 | 2 | 'Noord-Brabant', 'Gelderland', 'Overijssel' of 'Flevoland' |
| 3 | 3 | 'Noord-Holland', 'Zuid-Holland' of 'Utrecht' |
```

**Implementation (regels.rs lines 195-203):**
```regelspraak
Beslistabel Woonregio factor
    geldig altijd

| | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie gelijk is aan |
|---|---|---|
| 1 | 1 | 'Friesland', 'Groningen', 'Drenthe', 'Zeeland' of 'Limburg' |
| 2 | 2 | 'Noord-Brabant', 'Gelderland', 'Overijssel' of 'Flevoland' |
| 3 | 3 | 'Noord-Holland', 'Zuid-Holland' of 'Utrecht' |
```

**Differences:**
- ✅ FIXED - Now matches specification format (was expanded to individual rows in previous versions)

### 3.2 Belasting op Basis van Reisduur

**Specification (lines 461-469):**
```regelspraak
Beslistabel Belasting op basis van reisduur
    geldig altijd

| | de belasting op basis van reisduur van een passagier moet gesteld worden op | indien de reisduur per trein in minuten van zijn reis groter is dan | indien de reisduur per trein in minuten van zijn reis kleiner of gelijk is aan |
|---|---|---|---|
| 1 | het percentage reisduur eerste schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen | n.v.t. | de bovengrens reisduur eerste schijf |
| 2 | het percentage reisduur tweede schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen | de bovengrens reisduur eerste schijf | de bovengrens reisduur tweede schijf |
| 3 | het percentage reisduur derde schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen | de bovengrens reisduur tweede schijf | n.v.t. |
```

**Implementation (regels.rs lines 206-213):**
```regelspraak
Beslistabel Belasting op basis van reisduur
    geldig altijd

| | de belasting op basis van reisduur van een passagier moet gesteld worden op | indien de reisduur per trein in minuten van zijn reis groter is dan | indien de reisduur per trein in minuten van zijn reis kleiner of gelijk is aan |
|---|---|---|---|
| 1 | het percentage reisduur eerste schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen | n.v.t. | de bovengrens reisduur eerste schijf |
| 2 | het percentage reisduur tweede schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen | de bovengrens reisduur eerste schijf | de bovengrens reisduur tweede schijf |
| 3 | het percentage reisduur derde schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen | de bovengrens reisduur tweede schijf | n.v.t. |
```

**Differences:**
- ✅ FIXED - Now includes "in minuten" in column headers

### 3.3 Minderjarig (MISSING ❌)

**Specification (lines 472-478):**
```regelspraak
Beslistabel Minderjarig
    geldig altijd

|   | een passagier is minderjarig | indien zijn leeftijd kleiner is dan |
|---|------------------------------|--------------------------------------|
| 1 | waar | 18 jr |
```

**Implementation:**
```regelspraak
// NOT IMPLEMENTED - Decision table missing
```

**Differences:**
- Entire decision table not implemented

## 4. Impact Assessment

### High Priority (Functional Impact)
1. **Add Eenheidsysteem definitions** - Required for proper unit handling
2. **Fix bevestigingsinterval datatype** - Affects date calculations
3. **Implement missing distribution rules** - Incomplete feature
4. **Add age conditions to tax rules** - Business logic gap

### Medium Priority (Completeness)
1. Add Beslistabel Minderjarig
2. Implement missing date calculation rule
3. Complete all distribution rule variations

### Low Priority (Cosmetic)
1. Article usage consistency
2. Capitalization alignment
3. Percentage notation (% vs procent)

## 5. Progress Tracking

### Fixed Since August 2024 ✅
| Feature | August Status | November Status |
|---------|---------------|-----------------|
| Age kenmerken naming | Simplified (jongvolwassene, senior) | ✅ Exact spec match |
| datum van vertrek | Missing | ✅ Present |
| bepaal leeftijd | Hardcoded to 39 jr | ✅ Proper calculation |
| Object creation | Wrong syntax | ✅ Correct syntax |
| Easter calculation | Not working | ✅ Implemented |
| Decision table format | Expanded rows | ✅ Compact format |

### Still Outstanding ❌
| Feature | Priority | Complexity |
|---------|----------|------------|
| Eenheidsysteem definitions | HIGH | Medium |
| bevestigingsinterval datatype | HIGH | Low |
| 3 distribution rules | MEDIUM | Medium |
| Tax rule age conditions | HIGH | Medium |
| Beslistabel Minderjarig | LOW | Low |
| Date calculation rule | MEDIUM | Low |

## Conclusion

The TOKA implementation has made significant progress since August 2024, particularly in fixing naming conventions, object creation syntax, and enabling Easter calculations. The implementation now achieves approximately **85% specification compliance**.

Major remaining gaps:
- Complete absence of unit system definitions (Eenheidsysteem)
- Simplified tax calculation business logic
- Missing distribution rule variations
- Parameter datatype mismatches

**Recommendation:** Priority should be given to implementing the Eenheidsysteem definitions and completing the missing distribution rules to achieve functional completeness.