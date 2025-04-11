**Objective:** Provide the developer with the necessary GegevensSpraak definitions, RegelSpraak rule examples (specifically for the TOKA case), and the formal EBNF syntax specification to implement a RegelSpraak parser and processing logic (e.g., ANTLR visitor/listener) illustrated by the TOKA example.

**1. TOKA Casus Overview (Context)**

*   **Fictive Law:** "Wet Treinen Op Korte Afstand" (TOKA). Aims to tax short flights to stimulate train travel.
*   **Two Parts:**
    *   **TOKA Tax:** Levied on passengers (or the airline for round trips) based on distance, train accessibility, flight type, passenger age, train travel time, and potential sustainability discounts. Booking date affects applicable rates.
    *   **Treinmiles:** Distributed to passengers based on flight details and passenger age/province. Used as currency for public transport.
*   **Additional Concepts:** The specification uses TOKA but sometimes introduces extra concepts (like specific booking/processing times) not strictly in the fictive law text (Appendix 1) to illustrate broader RegelSpraak features.

**2. GegevensSpraak Definitions for TOKA**

These define the data structures (object model) the TOKA rules operate on.

*   **Object Types:**
    *   `Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)` (Section 3.1.1, 3.9)
        *   *Kenmerken (Characteristics):*
            *   `is minderjarig kenmerk (bijvoeglijk);`
            *   `is passagier van 18 tot en met 24 jaar kenmerk;`
            *   `is passagier van 25 tot en met 64 jaar kenmerk;`
            *   `is passagier van 65 jaar of ouder kenmerk (bijvoeglijk);`
            *   `het recht op duurzaamheidskorting kenmerk (bezittelijk);`
        *   *Attributen (Attributes):*
            *   `het identificatienummer Numeriek (positief geheel getal);`
            *   `de geboortedatum Datum in dagen;`
            *   `de leeftijd Numeriek (niet-negatief geheel getal) met eenheid jr;`
            *   `de belasting op basis van afstand Bedrag;`
            *   `de belasting op basis van reisduur Bedrag;`
            *   `de te betalen belasting Bedrag;`
            *   `de treinmiles op basis van evenredige verdeling Numeriek (geheel getal);`
            *   `de maximaal te ontvangen treinmiles bij evenredige verdeling volgens rangorde Numeriek (geheel getal);`
            *   `het burgerservicenummer Tekst;` (Example from 3.3.2)
            *   `de woonprovincie Tekst;` (Implied by Beslistabel example in Ch 12)
            *   `de woonregio factor Numeriek (geheel getal);` (Implied by Beslistabel example in Ch 12)
    *   `Objecttype de Vlucht (mv: vluchten)` (Section 3.9)
        *   *Kenmerken (Characteristics):*
            *   `is bereikbaar per trein kenmerk (bijvoeglijk);`
            *   `de gebruik fossiele brandstoffen minder dan 50% kenmerk (bezittelijk);` (Typo in spec likely intended: `is gebruik...`)
            *   `de reiziger kenmerk;` (Typo in spec likely intended: `is reiziger` or similar)
            *   `is duurzaam kenmerk (bijvoeglijk);`
            *   `is belaste reis kenmerk;`
            *   `is belast kenmerk (bijvoeglijk);`
            *   `is rondvlucht kenmerk;`
            *   `is bestemd voor minderjarigen kenmerk;`
            *   `de reis met paaskorting kenmerk;` (Mentioned in example 3.9, definition missing, likely `is reis met paaskorting kenmerk;`)
        *   *Attributen (Attributes):*
            *   `de luchthaven van vertrek Luchthavens;`
            *   `de luchthaven van bestemming Luchthavens;`
            *   `de vluchtdatum Datum in dagen;`
            *   `de afstand tot bestemming Numeriek (geheel getal);`
            *   `bereikbaar per trein Boolean;`
            *   `gebruik fossiele brandstof minder dan 50 procent Boolean;`
            *   `de reisduur per trein Numeriek (geheel getal);`
            *   `de hoeveelheid passagiers Numeriek (geheel getal);`
            *   `de hoeveelheid uitzonderingspassagiers Numeriek (geheel getal);`
            *   `de leeftijd van de oudste passagier Numeriek (niet-negatief geheel getal) met eenheid jr;`
            *   `de totale belasting op basis van afstand Bedrag;`
            *   `de totale belasting op basis van reisduur Bedrag;`
            *   `de totaal te betalen belasting Bedrag;`
            *   `de verwachte datum-tijd van aankomst Datum en tijd in millisecondes;`
            *   `de verwachte datum-tijd van vertrek Datum en tijd in millisecondes;`
            *   `de verwachte duur Numeriek (geheel getal);` (Unit likely time, e.g., minutes/seconds, missing in spec)
            *   `de datum-tijd voor het berekenen van de belasting op basis van afstand Datum en tijd in millisecondes;`
            *   `het bevestigingstijdstip Datum en tijd in millisecondes;`
            *   `het uiterste boekingstijdstip Datum en tijd in millisecondes;`
            *   `de datum van vertrek van de vlucht Datum in dagen;` (Used in examples, likely same as `de vluchtdatum`)
    *   `Objecttype het Contingent treinmiles` (Section 9.3)
        *   *Attributen:*
            *   `het totaal aantal treinmiles Numeriek (positief geheel getal);`
            *   `het aantal treinmiles op basis van aantal passagiers Numeriek (positief geheel getal);`
            *   `het restant na verdeling Numeriek (positief geheel getal);`

*   **Domains:**
    *   `Domein Bedrag is van het type Numeriek (getal met 2 decimalen)` (Section 3.4.1, 3.9) - Implied unit `€` from examples.
    *   `Domein Luchthavens is van het type Enumeratie` (Section 3.4.2, 3.9)
        *   `'Amsterdam Schiphol'`
        *   `'Groningen Eelde'`
        *   `'Parijs Charles de Gaulle'`
        *   `'Londen Heathrow'`

*   **Parameters:**
    *   `Parameter de korting bij gebruik niet-fossiele brandstof : Bedrag` (Section 3.10)
    *   `Parameter de volwassenleeftijd : Numeriek (niet-negatief geheel getal) met eenheid jr` (Section 4.4, 10.1)
    *   `Parameter de bevestigingsinterval : Datum en tijd in millisecondes` (Section 5.8.4)
    *   `Parameter de eerste boekingsdatum : Datum in dagen` (Section 5.8.4)
    *   `Parameter de aantal treinmiles per passagier voor contingent: Numeriek (positief geheel getal)` (Section 9.3)
    *   `Parameter de initiele belasting : Bedrag` (Section 9.6)
    *   `Parameter de pensioenleeftijd : Numeriek (geheel getal) met eenheid jr` (Section 10.2)
    *   `Parameter de duurzaamheidskorting minimale afstand : Numeriek (geheel getal) met eenheid km` (Section 10.2)
    *   `Parameter de bovengrens afstand eerste schijf : Numeriek (geheel getal) met eenheid km` (Implied by example 8.1.1)
    *   `Parameter het lage basistarief eerste schijf : Bedrag` (Implied by example 11)
    *   `Parameter het lage tarief vermindering eerste schijf : Bedrag` (Implied by example 11, unit likely per km)
    *   `Parameter het percentage reisduur eerste schijf : Percentage (geheel getal)` (Implied by example 3.3.5, Ch 12)
    *   `Parameter het percentage reisduur tweede schijf : Percentage (geheel getal)` (Implied by example 3.3.5, Ch 12)
    *   `Parameter het percentage reisduur derde schijf : Percentage (geheel getal)` (Implied by Ch 12)
    *   `Parameter de bovengrens reisduur eerste schijf : Numeriek (geheel getal)` (Implied by Ch 12, unit likely minutes)
    *   `Parameter de bovengrens reisduur tweede schijf : Numeriek (geheel getal)` (Implied by Ch 12, unit likely minutes)

*   **Fact Types (Feittypen):**
    *   `Feittype vlucht van natuurlijke personen` (Section 3.11)
        *   `de reis Vlucht`
        *   `de passagier Natuurlijk persoon`
        *   `Eén reis betreft de verplaatsing van meerdere passagiers`
    *   `Feittype reis met contingent treinmiles` (Section 9.3)
        *   `de reis met treinmiles Vlucht`
        *   `het vastgestelde contingent treinmiles Contingent treinmiles`
        *   `één reis met treinmiles heeft één vastgestelde contingent treinmiles`
    *   `Feittype verdeling contingent treinmiles over passagiers` (Section 9.4)
        *   `het te verdelen contingent treinmiles Contingent Treinmiles`
        *   `de passagier met recht op treinmiles Natuurlijk persoon`
        *   `één te verdelen contingent treinmiles wordt verdeeld over meerdere passagiers met recht op treinmiles`

*   **Eenheidssystemen (Relevant Defaults):**
    *   `Eenheidsysteem Valuta` (e.g., `€`) (Section 3.7)
    *   `Eenheidsysteem Tijd` (`ms`, `s`, `minuut`, `u`, `dg`, `wk`, `mnd`, `kw`, `jr`) (Section 3.7)
    *   `Eenheidsysteem afstand` (example with `mm`, `cm`, `m`, `km`) (Section 3.7)

*   **Dagsoorten:**
    *   `Dagsoort de kerstdag (mv: kerstdagen)` (Example in 3.12)

**3. RegelSpraak Rule Examples for TOKA**

These are specific examples from the document illustrating how rules are written for the TOKA case.

*   **Basic Rule Structure:**
    ```RegelSpraak
    Regel <regelnaam>
        geldig <geldigheidsperiode>
            <Resultaatdeel>
            [indien <Voorwaardendeel>.]
            [Daarbij geldt:
                <Variabele> is <Expressie>
                ... .]
    ```

*   **Calculating Age (Gelijkstelling, Tijdsduur):** (Section 4.4, slightly adapted from original non-bezield version for correctness)
    ```RegelSpraak
    Regel bepaal leeftijd
        geldig altijd
            De leeftijd van een Natuurlijk persoon moet berekend worden als de tijdsduur van zijn
            geboortedatum tot de vluchtdatum van zijn reis in hele jaren.
    ```
    *(Note: `vluchtdatum van zijn reis` uses the `reis` role from `Feittype vlucht van natuurlijke personen` to navigate from `Natuurlijk persoon` to the related `Vlucht`)*

*   **Assigning Minderjarig Kenmerk (Kenmerktoekenning, Variabele):** (Section 4.4)
    ```RegelSpraak
    Parameter de volwassenleeftijd : Numeriek (niet-negatief geheel getal) met eenheid jr
    Regel Kenmerktoekenning persoon minderjarig
        geldig altijd
            Een Natuurlijk persoon is minderjarig
            indien X kleiner is dan de volwassenleeftijd.
            Daarbij geldt:
                X is de tijdsduur van zijn geboortedatum tot de vluchtdatum van zijn reis in hele jaren.
    ```

*   **Calculating Age using Rekendatum:** (Section 5.3, adapted slightly for TOKA context)
    ```RegelSpraak
    Regel bepaal leeftijd op rekendatum
        geldig altijd
            De leeftijd van een Natuurlijk persoon moet berekend worden als de tijdsduur van zijn
            geboortedatum tot de Rekendatum in hele jaren.
    ```

*   **Counting Passengers (Aggregatie `aantal`):** (Section 5.8.1)
    ```RegelSpraak
    Regel Hoeveelheid passagiers van een reis
        geldig altijd
            De hoeveelheid passagiers van een reis moet berekend worden als het aantal passagiers van de reis.
    ```

*   **Summing Passenger Tax (Aggregatie `som van`):** (Section 5.8.2)
    ```RegelSpraak
    Regel Totaal te betalen belasting
        geldig altijd
            De totaal te betalen belasting van een reis moet berekend worden als de som van de te
            betalen belasting van alle passagiers van de reis.
    ```
    *Alternative with empty check:*
    ```RegelSpraak
    Regel Totaal te betalen belasting, controleer voor leegwaarde
        geldig altijd
            De totaal te betalen belasting van een reis moet berekend worden als de som van de te
            betalen belasting van alle passagiers van de reis of 0 als die er niet zijn.
    ```

*   **Finding Oldest Passenger (Aggregatie `maximale waarde van`):** (Section 5.8.3)
    ```RegelSpraak
    Regel Leeftijd oudste passagier
        geldig altijd
            De leeftijd van de oudste passagier van een reis moet gesteld worden op de maximale waarde van
            de leeftijden van alle passagiers van de reis.
    ```

*   **Calculating Tax Date (Aggregatie `eerste van`):** (Section 5.8.4)
    ```RegelSpraak
    Regel Datum-tijd voor het berekenen van de belasting op basis van afstand
        geldig altijd
            De datum-tijd voor het berekenen van de belasting op basis van afstand van een vlucht moet berekend worden als de eerste van de verwachte datum-tijd van vertrek van de vlucht en de
            daadwerkelijke datum-tijd van vertrek van de vlucht.
    ```
    *(Note: `daadwerkelijke datum-tijd van vertrek` is not defined in 3.9, assuming it exists for the example)*

*   **Calculating Confirmation Time (Aggregatie `laatste van`, Variabelen):** (Section 5.8.4)
    ```RegelSpraak
    Parameter de bevestigingsinterval : Datum en tijd in millisecondes
    Parameter de eerste boekingsdatum : Datum in dagen
    Regel Bevestigingstijdstip vlucht
        geldig altijd
            Het bevestigingstijdstip van een vlucht moet berekend worden als de laatste van A en B.
            Daarbij geldt:
                A is het uiterste boekingstijdstip van de vlucht plus bevestigingsinterval
                B is eerste boekingsdatum.
    ```

*   **Calculating Tax with Bounding (Begrenzing):** (Section 6.1.4)
    ```RegelSpraak
    Regel Te betalen belasting van een passagier
        geldig altijd
            De te betalen belasting van een passagier moet berekend worden als zijn belasting op
            basis van afstand min de korting bij gebruik niet-fossiele brandstof, met een minimum
            van 0 € naar beneden afgerond op 0 decimalen.
    ```

*   **Calculating Arrival Time (Datum `plus` Tijdseenheid):** (Section 6.11)
    ```RegelSpraak
    Regel Verwachte datum-tijd van aankomst van een Vlucht
        geldig altijd
            De verwachte datum-tijd van aankomst van een vlucht moet berekend worden als de verwachte
            Datum-tijd van vertrek van de Vlucht plus de verwachte duur van de vlucht.
    ```

*   **Determining High Season (Dag/Maand/Jaar Uit):** (Section 6.12)
    ```RegelSpraak
    Regel Hoogseizoen
        geldig altijd
            Een Vlucht is in het hoogseizoen
            indien er aan ten minste één van de volgende voorwaarden wordt voldaan:
            - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 6
            - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 7
            - de maand uit (de vluchtdatum van de vlucht) is gelijk aan 8.
    ```
    *(Note: Kenmerk `is in het hoogseizoen` is not defined in 3.9, assuming it exists for the example)*

*   **Determining Easter Discount (Eerste Paasdag Van):** (Section 6.13)
    ```RegelSpraak
    Regel Paaskorting
        geldig altijd
            Een vlucht is een reis met paaskorting
            indien de vluchtdatum van de vlucht gelijk is aan de eerste paasdag van (het jaar uit (de vluchtdatum van de vlucht)).
    ```

*   **Assigning Duurzaam Kenmerk (Kenmerktoekenning):** (Section 9.2)
    ```RegelSpraak
    Een vlucht is duurzaam
    ```
    *(Note: This is just the result part, a condition would typically follow)*

*   **Assigning Recht op Korting Kenmerk (Kenmerktoekenning):** (Section 9.2)
    ```RegelSpraak
    Een passagier heeft recht op korting
    ```
    *(Note: This is just the result part, a condition would typically follow)*

*   **Creating Contingent Object (ObjectCreatie):** (Section 9.3)
    ```RegelSpraak
    Parameter de aantal treinmiles per passagier voor contingent: Numeriek (positief geheel getal)
    Regel vastgestelde contingent treinmiles
        geldig altijd
            Een vlucht heeft het vastgestelde contingent treinmiles met
            aantal treinmiles op basis van aantal passagiers gelijk aan het aantal passagiers
            van de Vlucht maal het aantal treinmiles per passagier voor contingent.
    ```

*   **Creating Fact between Contingent and Passenger (FeitCreatie):** (Section 9.4)
    ```RegelSpraak
    Regel passagier met recht op treinmiles
        geldig altijd
            Een passagier met recht op treinmiles van een vastgestelde contingent treinmiles is een
            passagier van de reis met treinmiles van het vastgestelde contingent treinmiles.
    ```

*   **Consistency Check - Round Trip (Consistentieregel):** (Section 9.5)
    ```RegelSpraak
    Regel Controleer of vlucht geen rondvlucht is
        geldig altijd
            De luchthaven van vertrek van een vlucht moet ongelijk zijn aan de luchthaven van
            bestemming van de vlucht.
    ```

*   **Initializing Tax (Initialisatie):** (Section 9.6)
    ```RegelSpraak
    Parameter de initiele belasting : Bedrag
    Regel Initialiseer te betalen belasting op initiele belasting
        geldig altijd
            De te betalen belasting van een passagier moet geïnitialiseerd worden op de initiele belasting.
    ```

*   **Distributing Treinmiles Equally (Verdeling):** (Section 9.7.1)
    ```RegelSpraak
    Regel verdeling treinmiles in gelijke delen
        geldig altijd
            Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
            de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
            contingent treinmiles, waarbij wordt verdeeld in gelijke delen.
    ```

*   **Distributing Treinmiles by Woonregio Factor (Verdeling `naar rato van`):** (Section 9.7.1)
    ```RegelSpraak
    Regel verdeling treinmiles op basis van woonregio factor
        geldig altijd
            Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
            de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
            contingent treinmiles, waarbij wordt verdeeld naar rato van de woonregio factor.
    ```

*   **Distributing Treinmiles by Age/Woonregio (Verdeling with Groups):** (Section 9.7.2)
    ```RegelSpraak
    Regel Verdeling treinmiles op basis van leeftijd en woonregio factor
        geldig altijd
            Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over
            de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
            contingent treinmiles, waarbij wordt verdeeld:
            - op volgorde van toenemende de leeftijd,
            - bij een even groot criterium naar rato van de woonregio factor.
            Als onverdeelde rest blijft het restant na verdeling van het te verdelen contingent treinmiles over.
    ```

*   **Distributing Treinmiles with Max Claim (Verdeling with `maximum van`):** (Section 9.7.3)
    ```RegelSpraak
    Regel verdeling treinmiles op basis van woonregio factor en met maximum waarde
        geldig altijd
            Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld
            over de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
            contingent treinmiles, waarbij wordt verdeeld:
            - naar rato van de woonregio factor,
            - met een maximum van het maximaal aantal te ontvangen treinmiles.
            Als onverdeelde rest blijft het restant na verdeling van het te verdelen contingent
            treinmiles over.
    ```

*   **Distributing Treinmiles with Rounding (Verdeling with `afgerond op`):** (Section 9.7.4)
    ```RegelSpraak
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

*   **Complex Treinmiles Distribution (Full Verdeling Example):** (Section 9.7.5)
    ```RegelSpraak
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

*   **Defining Christmas Day (Dagsoortdefinitie):** (Section 9.8)
    ```RegelSpraak
    Regel Kerstdag
        geldig altijd
            Een dag is een kerstdag
            indien de dag aan alle volgende voorwaarden voldoet:
            - de maand uit (de dag) is gelijk aan 12
            - de dag voldoet aan ten minste één van de volgende voorwaarden:
                .. de dag uit (de dag) is gelijk aan 25
                .. de dag uit (de dag) is gelijk aan 26.
    ```

*   **Assigning Belaste Reis Kenmerk (Kenmerktoekenning, Elementaire Voorwaarde):** (Section 10.1)
    ```RegelSpraak
    Regel belaste reis
        geldig altijd
            Een Vlucht is een belaste reis
            indien bereikbaar per trein van de vlucht gelijk is aan waar.
    ```

*   **Determining Recht op Duurzaamheidskorting (Kenmerktoekenning, Samengestelde Voorwaarde):** (Section 10.2)
    ```RegelSpraak
    Parameter de pensioenleeftijd : Numeriek (geheel getal) met eenheid jr
    Parameter de duurzaamheidskorting minimale afstand : Numeriek (geheel getal) met eenheid km
    Regel Recht op Duurzaamheidskorting
        geldig altijd
            Een passagier heeft recht op duurzaamheidskorting
            indien hij aan alle volgende voorwaarden voldoet:
            - zijn reis is duurzaam
            - de afstand tot bestemming in kilometers van zijn reis is groter of gelijk aan
              de duurzaamheidskorting minimale afstand.
            - zijn leeftijd is groter of gelijk aan de pensioenleeftijd
    ```
    *Alternative using Kenmerken (Nested):*
    ```RegelSpraak
    Regel Recht op Duurzaamheidskorting
        geldig altijd
            Een passagier heeft recht op duurzaamheidskorting
            indien hij aan alle volgende voorwaarden voldoet:
            - zijn reis is duurzaam
            - de afstand tot bestemming in kilometers van zijn reis is groter of gelijk aan
              de duurzaamheidskorting minimale afstand
            - hij voldoet aan geen van de volgende voorwaarden:
                .. hij is een passagier jonger dan 18 jaar
                .. hij is een passagier van 18 tot en met 24 jaar
                .. hij is een passagier van 24 tot en met 64 jaar.
    ```

*   **Determining Passagier 18-24 Kenmerk (Kenmerktoekenning, Samengestelde Voorwaarde):** (Section 10.2)
    ```RegelSpraak
    Regel Passagier van 18 tm 24 jaar
        geldig altijd
            Een Natuurlijk persoon is een passagier van 18 tot en met 24 jaar
            indien hij aan alle volgende voorwaarden voldoet:
            - zijn leeftijd is groter of gelijk aan de volwassenleeftijd
            - zijn leeftijd is kleiner of gelijk aan 24 jr
            - hij is een passagier.
    ```
    *(Note: `hij is een passagier` checks if the Natuurlijk persoon fulfills the 'passagier' role)*

*   **Calculating Tax based on Distance (Gelijkstelling, Samengestelde Voorwaarde, Variabelen):** (Section 11)
    ```RegelSpraak
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

**4. Beslistabellen Examples for TOKA**

*   **Woonregio Factor:** (Section 12)
    ```RegelSpraak
    Beslistabel Woonregio factor
        geldig altijd
    ```
    |   | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie gelijk is aan                                                               |
    |---|-------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|
    | 1 | 1                                                                 | 'Friesland', 'Groningen', 'Drenthe', 'Zeeland' of 'Limburg'                                            |
    | 2 | 2                                                                 | 'Noord-Brabant', 'Gelderland', 'Overijssel' of 'Flevoland'                                             |
    | 3 | 3                                                                 | 'Noord-Holland', 'Zuid-Holland' of 'Utrecht'                                                          |

*   **Belasting op basis van reisduur (Multiple Condition Columns):** (Section 12)
    ```RegelSpraak
    Beslistabel Belasting op basis van reisduur
        geldig altijd
    ```
    |   | de belasting op basis van reisduur van een passagier moet gesteld worden op                                           | indien de reisduur per trein in minuten van zijn reis groter is dan | indien de reisduur per trein in minuten van zijn reis kleiner of gelijk is aan |
    |---|---------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|------------------------------------------------------------------------------|
    | 1 | het percentage reisduur eerste schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen    | n.v.t.                                                            | de bovengrens reisduur eerste schijf                                         |
    | 2 | het percentage reisduur tweede schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen   | de bovengrens reisduur eerste schijf                              | de bovengrens reisduur tweede schijf                                         |
    | 3 | het percentage reisduur derde schijf van zijn belasting op basis van afstand naar beneden afgerond op 0 decimalen    | de bovengrens reisduur tweede schijf                              | n.v.t.                                                                       |

*   **Kenmerk Toekenning in Beslistabel:** (Section 12, adapted slightly)
    ```RegelSpraak
    Beslistabel Minderjarig
        geldig altijd
    ```
    |   | een passagier is minderjarig | indien zijn leeftijd kleiner is dan |
    |---|------------------------------|-----------------------------------|
    | 1 | waar                         | 18 jr                             |

*   **Kenmerk Voorwaarde in Beslistabel:** (Section 12, partial example)
    ```RegelSpraak
    Beslistabel Belasting op basis van reisduur met Duurzaamheid
        geldig altijd
    ```
    |   | de belasting op basis van reisduur van een passagier moet gesteld worden op | indien hij een recht op duurzaamheidskorting heeft | indien de reisduur ... groter is dan | indien de reisduur ... kleiner of gelijk is aan |
    |---|---|---|---|---|
    | 1 | ...                                                                         | waar                                               | n.v.t.                             | de bovengrens reisduur eerste schijf            |
    | 2 | ...                                                                         | waar                                               | de bovengrens reisduur eerste schijf | de bovengrens reisduur tweede schijf            |
    | 3 | ...                                                                         | n.v.t.                                             | de bovengrens reisduur tweede schijf | n.v.t.                                          |

**5. Formal EBNF Syntax Specification**

This is the core grammar definition needed for ANTLR. The document uses a notation based on OMG CORBA Scripting / W3C EBNF (explained in 13.1).

*(Note: The full EBNF is very long. Copying the complete sections 13.2, 13.3, and 13.4 verbatim as provided in the specification document is required for the developer.)*

**Key EBNF Sections to copy:**

*   **13.1 Gebruikte notatie:** Explains the EBNF symbols used (::=, |, *, +, (), [], "", <>, \n, \t).
*   **13.2 Standaard syntax patronen:** Basic building blocks like `<digit>`, `<getal>`, `<naamwoord>`, `<literalexpressie>`.
*   **13.3 Objecten en parameters:** Syntax for defining `Objecttype`, `Attribuut`, `Kenmerk`, `Datatype`, `Domein`, `Eenheid`, `Tijdlijn`, `Dimensie`, `Parameter`, `Feittype`, `Dagsoort`.
*   **13.4 RegelSpraak:** The main syntax rules.
    *   13.4.1 `Onderwerpketen`
    *   13.4.2 `RegelSpraak-regel` (Top-level rule structure)
    *   13.4.3 `Resultaatdeel` (Alternatives)
    *   13.4.4 `Gelijkstelling`
    *   13.4.5 `Kenmerktoekenning`
    *   13.4.6 `ObjectCreatie`
    *   13.4.7 `FeitCreatie`
    *   13.4.8 `Consistentieregels`
    *   13.4.9 `Initialisatie`
    *   13.4.10 `Verdeling`
    *   13.4.11 `Dagsoortdefinitie`
    *   13.4.12 `Voorwaardendeel` (Overall conditional part)
    *   13.4.13 `Samengestelde voorwaarde`
    *   13.4.14 `Elementaire voorwaarde` (Includes all predicate syntax)
    *   13.4.15 `Berekening` (Basic arithmetic operations)
    *   13.4.16 `Expressie` (All expression types, functions, aggregations)

**6. Implementation Notes for Developer**

*   **ANTLR Visitor/Listener:** The extracted examples and EBNF form the basis for creating an ANTLR grammar file (`.g4`). The developer will then implement either a Visitor or Listener pattern to traverse the parse tree generated by ANTLR and execute the logic defined by the RegelSpraak rules (e.g., perform calculations, update object attributes, check conditions).
*   **Data Model:** The GegevensSpraak definitions need to be mapped to classes or data structures in the target language (Python). The visitor/listener will interact with instances of these structures.
*   **Time Dependency:** Pay close attention to sections 5.1, 7, 8.2, 8.4, and 10.3 regarding time-dependent attributes/kenmerken/parameters and rules. This adds complexity, involving tracking values over periods and handling "knips" (points where values change). The implementation needs a mechanism to manage and query these time-sliced values.
*   **Empty Values:** RegelSpraak has specific rules for handling empty (`leeg`) values in calculations and comparisons, which vary between operators (e.g., `plus` vs `som van`, `min` vs `verminderd met`). These need careful implementation (see tables in Ch 6, 8).
*   **Data Types and Units:** The system must enforce type compatibility and handle unit conversions (based on defined `Eenheidsysteem`) during calculations and assignments.
*   **Recursion:** Section 9.9 describes allowed recursion patterns within designated `regelgroep`s, requiring checks for termination conditions. This needs specific handling if implemented.
*   **Beslistabellen:** These are an alternative representation. The parser might need to handle this syntax, or they could be pre-processed into standard `Regel` format. The core logic they represent is the same as standard rules.
*   **EBNF Variant:** Ensure the ANTLR grammar correctly reflects the specific EBNF notation used in Chapter 13.
*   **Color Coding:** The color conventions mentioned in Section 2.2 (purple for Objecttype, green for Attribuut/Enum, orange for Kenmerk/Dimensie, blue for Rol/Parameter) might be useful for IDE syntax highlighting or debugging output.

This structured information should provide the developer with a comprehensive starting point for implementing the RegelSpraak parser and interpreter, using the TOKA case as the primary guide and test set.