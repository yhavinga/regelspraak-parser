![](https://cdn.mathpix.com/cropped/2025_04_10_683efbf7587961be1c26g-01.jpg?height=272&width=261&top_left_y=732&top_left_x=252)

## Belastingdienst

## RegelSpraak-specificatie

## typeringen

```
Datum: 24-1-2025
Versie
    2.1.0
```


## © 2024 Belastingdienst

Alle rechten voorbehouden.
Niets uit deze uitgave mag worden verveelvoudigd, opgeslagen in een geautomatiseerd gegevensbestand en/of openbaar gemaakt in enige vorm of op enige wijze, hetzij elektronisch, mechanisch, door fotokopieën, opnamen of op enige andere manier zonder voorafgaande schriftelijke toestemming van de auteur.

## Inhoudsopgave:

1. Versiebeheer ..... 4
2. Introductie ..... 5
3. Tijdsafhankelijkheid ..... 6
4. Operatoren ..... 7
4.1 Optellen: plus ..... 7
4.2 Aftrekken: min ..... 8
4.3 Aftrekken: verminderd met ..... 9
4.4 Vermenigvuldigen: maal ..... 11
4.5 Delen: gedeeld door en gedeeld door (ABS) ..... 12
4.6 Worteltrekken: de wortel van ..... 13
4.7 Machtsverheffen: tot de macht ..... 14
4.8 Percentage bepalen: van ..... 15
4.9 Absolute waarde van ..... 15
4.10 Sommatie: som van ..... 16
4.11 Telling van instanties: aantal ..... 17
4.12 Minimale waarde van ..... 17
4.13 Maximale waarde van ..... 18
4.14 Eerste waarde: eerste van ..... 18
4.15 Laatste waarde: laatste van ..... 19
4.16 Tijdsduur van ... tot ..... 19
4.17 Absolute tijdsduur van ... tot ..... 20
4.18 Dag/maand/jaar uit ..... 20
4.19 Eerste paasdag van ..... 21
4.20 Aggregeren in de tijd: totaal van ..... 21
4.21 Tellen van dagen: aantal dagen in ... dat ..... 22
4.22 Omrekening met gebroken jaren of maanden: tijdsevenredig deel ..... 22
5. Condities en predicaten ..... 24
5.1 Kleiner dan ..... 24
5.2 Kleiner of gelijk aan ..... 25
5.3 Gelijk aan ..... 26
5.4 Groter of gelijk aan ..... 27
5.5 Groter dan ..... 28
5.6 Ongelijk aan ..... 29
5.7 Eerder dan ..... 30
5.8 Eerder of gelijk aan ..... 30
5.9 Later of gelijk aan ..... 31
5.10 Later dan ..... 31
5.11 Is gevuld ..... 32
5.12 Is leeg. ..... 32
5.13 Voldoet aan de elfproef ..... 33
5.14 Is kenmerk/ is rol ..... 34
5.15 Is dagsoort ..... 34
5.16 Is numeriek ..... 35
6. Resultaatdeel ..... 36
6.1 Gelijkstelling ..... 36
6.2 Initialisatie ..... 37
6.3 Kenmerktoekenning ..... 38
6.4 Feitcreatie ..... 38
6.5 ObjectCreatie ..... 38
6.6 Consistentieregel ..... 38
6.7 Dagsoortdefinitie ..... 38

## 1. Versiebeheer

Onderstaande tabel bevat het overzicht van definitieve versies. In de omschrijving staan de wijzigingen ten opzichte van de vorige versie.

| Versie | Status | Datum | Omschrijving |
| :---: | :---: | :---: | :---: |
| 1.00 | Definitief | 01-05-2023 | Initiële versie. |
| 1.0.1 | Definitief | 16-05-2023 | Aanpassingen t.b.v. publicatie. Namen en informatie over concept-versies en mogelijke toekomstige aanpassingen verwijderd. |
| 1.1.0 | Definitief | 24-10-2023 | Ophoging versienummer voor aansluiting bij overige documenten. |
| 1.2.0 | Definitief | 11-04-2024 | - Par. 3.7 Typeringen voor expressie machtsverheffen toegevoegd. <br> - Par. 3.9 Typeringen voor expresssie "absolute waarde van" toegevoegd. <br> - Par. 3.17 Typeringen voor expressie "absolute tijdsduur van ... tot ..." toegevoegd. |
| 2.0.0 | Definitief | 27-09-2024 | Hoofdstuk 3 met toelichting op tijdsafhankelijkheid toegevoegd. Specifieke tijdsafhankelijke expressies toegevoegd: <br> - Par. 4.20 - totaal van. <br> - Par. 4.21 - aantal dagen in ... dat .... <br> - Par. 4.22 - tijdsevenredig deel. |
| 2.1.0 | Definitief | 24-1-2025 | Ophoging versienummer om aan te sluiten op set met generieke specificatiedocumenten. |

Tabel 1

## 2. Introductie

In dit document wordt de werking van de verschillende operatoren, predicaten en acties op een gestructureerde manier vastgelegd. Waar van toepassing wordt voor ieder taalpatroon beschreven:

1. met welke expressies dit taalpatroon gebruikt kan worden,
2. wat de eenheid restricties zijn bij gebruik van numerieke expressies,
3. hoe omgegaan moet worden met leegwaarden, en
4. met welke decimale precisie berekeningen met numerieke expressies worden uitgevoerd.

Voor een nadere detailuitleg van gebruikte termen en concepten wordt verwezen naar het hoofddocument 'RegelSpraak specificatie'.

## 3. Tijdsafhankelijkheid

Tijdsafhankelijkheid is een algemeen aspect dat van invloed is op de datatypes. Een expressie heeft een type met tijdsdimensie als er sprake is van een gegeven met een tijdlijn, of als er een periode (van ... tot) in voorkomt.

Generiek geldt dat de granulariteit van de tijdlijn van de resultaatexpressie kleiner of gelijk moet zijn aan de kleinste granulariteit van de expressies van de argumenten.

Aanvullend geldt hierbij dat als in een expressie een periode wordt opgegeven dat dan een tijdlijn voor elke dag geldt, tenzij de periodegrenzen worden gespecificeerd met datum-tijdliterals die precies op maand- of jaargrenzen vallen.

## 4. Operatoren

### 4.1 Optellen: plus

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

In de volgende tabel wordt voor de plus operator weergegeven welke expressies gebruikt kunnen worden in combinatie met de betreffende operator. Bij de plus operator is het mogelijk om numerieke expressies zonder eenheden bij elkaar op te tellen en een numerieke tijdswaarde op te tellen bij een datum.
N.B. Dit soort tabellen zullen in de rest van het document terugkomen, waarbij de getallen in de eerste kolom de verschillende mogelijke scenario's weergeven. Verder staat, wanneer het om numerieke expressies gaat, in de laatste kolom ook beschreven welke eenheden gebruikt mogen worden en hoe deze zich verhouden tot het resultaat dat volgt na het uitvoeren van de betreffende operator. Het gebruik van eenheden is optioneel maar zodra een expressie in het taalpatroon een eenheid gebruikt, moeten de andere expressies ook een eenheid gebruiken.

| plus |  |  | Eenheid restrictie |
| :--- | :--- | :--- | :--- |
|  | Datatype | Numeriek | Eenheid1 |
| 1 | Linkerexpressie | Rechterexpressie | plus |
|  | Numeriek | Eenheid2 die om te rekenen is in <br> Eenheid1 |  |
|  | Resultaatexpressie | Numeriek | Eenheid3 die om te rekenen is in <br> Eenheid1 |


| 2 | Linkerexpressie | Datum-tijd | - |
| :--- | :--- | :--- | :--- |
|  | Operator | plus | - |
|  | Rechterexpressie | Numeriek | Eenheid1 uit Tijdseenheidsysteem |
|  | Resultaatexpressie | Datum-tijd | - |

Tabel 2

## Rekentabel

In de volgende tabel wordt weergegeven hoe leegwaarden het resultaat beïnvloeden na het uitvoeren van de aangegeven operator. In de regel wordt een leegwaarde als 0 beschouwd bij het uitvoeren van de plus operator.

| plus | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{y}$ |
| Linkerexpressie | 0 | Y |
| Leeg | X | $\mathrm{X}+\mathrm{Y}$ |
| $\mathbf{X}$ |  |  |

Tabel 3

## Precisie

In de volgende tabel wordt uitgebeeld hoeveel decimalen het resultaat krijgt bij het uitvoeren van de aangegeven operator op decimale getallen. In de regel krijgt het resultaat evenveel
decimalen als het aantal decimalen van de waarde met de meeste decimalen.

Wanneer er met waarden met ongelijke eenheden wordt gerekend maar wel eenheden die in elkaar omgerekend kunnen worden, worden de waarden eerst omgerekend naar eenzelfde eenheid waarna vervolgens de standaardregel wordt toegepast. Het kan hierbij echter voorkomen dat er door een omrekening decimalen wegvallen: bij het omzetten van uren naar seconden bijvoorbeeld wordt met 3600 vermenigvuldigd, waardoor er 2 decimalen wegvallen ( 0,123 uur $=442,8$ seconden).

| plus | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | $\mathbf{x}, \mathbf{X}$ | $\mathbf{X}$ |
| Linkerexpressie | $\mathbf{X X X}$ |  |
| $\mathbf{X}, \mathbf{X}$ | $\mathrm{X}, \mathrm{X}$ | $\mathrm{X}, \mathrm{XXX}$ |
| $\mathbf{X}, \mathbf{X X X X}$ | $\mathrm{X}, \mathrm{XXXX}$ | $\mathrm{X}, \mathrm{XXXX}$ |

Tabel 4
Wanneer een expressie met tijdseenheid bij een datum(-tijd)expressie opgeteld wordt, is de precisie afhankelijk van de tijdeenheid en de datum(-tijd)expressie:

1) Het resultaat zal een datumexpressie zijn wanneer er bij een datumexpressie een expressie met een tijdseenheid groter dan 'dag' wordt opgeteld.
2) Het resultaat zal altijd een datum-tijdexpressie zijn wanneer er opgeteld wordt bij een datum-tijdexpressie óf wanneer de expressie die opgeteld wordt een tijdseenheid kleiner dan 'dag' is.

### 4.2 Aftrekken: min

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de (nagenoeg) gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de min operator is het mogelijk om numerieke expressies zonder en met eenheden van elkaar af te trekken, en een numerieke tijdswaarde af te trekken van een datum.

| min |  |  |  |
| :--- | :--- | :--- | :--- |
|  | Datatype | Eenheid restrictie |  |
| 1 | Linkerexpressie | Numeriek | Eenheid1 |
|  | Operator | min | - |
|  | Rechterexpressie | Numeriek | Eenheid2 die om te rekenen is in <br> Eenheid1 |
|  | Resultaatexpressie | Numeriek | Eenheid3 die om te rekenen is in <br> Eenheid1 |


| 2 | Linkerexpressie | Datum-tijd | - |
| :--- | :--- | :--- | :--- |
|  | Operator | min | - |
|  | Rechterexpressie | Numeriek | Eenheid1 uit Tijdseenheidsysteem |
|  | Resultaatexpressie | Datum-tijd | - |

Tabel 5
Rekentabel

In de regel wordt een leegwaarde als 0 beschouwd bij het uitvoeren van de min operator.

| min | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | 0 | -Y |
| Leeg | X | $\mathrm{X}-\mathrm{Y}$ |
| $\mathbf{X}$ |  |  |

Tabel 6

## Precisie

In de regel krijgt het resultaat evenveel decimalen als het aantal decimalen van de waarde met de meeste decimalen. Wanneer er met waarden met ongelijke eenheden wordt gerekend maar wel met eenheden die in elkaar omgerekend kunnen worden, worden de waarden eerst omgerekend naar dezelfde eenheid waarna vervolgens de standaardregel wordt toegepast.

| min | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | $\mathbf{X}, \mathbf{X}$ | $\mathbf{X}, \mathbf{X X X}$ |
| Linkerexpressie | $\mathbf{X}, \mathrm{X}$ | $\mathbf{X}, \mathrm{XXX}$ |
| $\mathbf{X}, \mathbf{X}$ | $\mathbf{X}, \mathrm{XXXX}$ | $\mathrm{X}, \mathrm{XXXX}$ |

Tabel 7
Wanneer een expressie met tijdseenheid van een datum(-tijd)expressie afgetrokken wordt, is de precisie afhankelijk van de tijdeenheid en de datum(-tijd)expressie:

1) Het resultaat zal een datumexpressie zijn wanneer er van een datumexpressie een expressie met een tijdseenheid groter dan 'dag' wordt afgetrokken.
2) Het resultaat zal altijd een datum-tijdexpressie zijn wanneer er afgetrokken wordt van een datum-tijdexpressie óf wanneer de expressie die afgetrokken wordt een tijdseenheid kleiner dan 'dag' is.

### 4.3 Aftrekken: verminderd met

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de (nagenoeg) gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de verminderd met operator is het mogelijk om numerieke expressies zonder eenheden van elkaar af te trekken.

| 1 | Linkerexpressie | Numeriek | Eenheid1 |
| :---: | :---: | :---: | :---: |
|  | Operator | verminderd met | - |
|  | Rechterexpressie | Numeriek | Eenheid2 die om te rekenen is in Eenheid1 |
|  | Resultaatexpressie | Numeriek | Eenheid3 die om te rekenen is in Eenheid1 |

## Rekentabel

In de regel krijgt het resultaat een leegwaarde wanneer de waarde van de linkerexpressie leeg is en wordt een leegwaarde van de rechterexpressie als 0 beschouwd.

| verminderd met | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | leeg | leeg |
| Leeg | $X$ | $X-Y$ |
| $\mathbf{X}$ | Tabel 9 |  |

## Precisie

In de regel krijgt het resultaat evenveel decimalen als het aantal decimalen van de waarde met de meeste decimalen.
Wanneer er met waarden met ongelijke eenheden wordt gerekend maar wel met eenheden die in elkaar omgerekend kunnen worden, worden de waarden eerst omgerekend naar dezelfde eenheid waarna vervolgens de standaardregel wordt toegepast.

| verminderd met | Rechterexpressie |  |
| :---: | :---: | :---: |
| Linkerexpressie | X, x | x,xxx |
| X,x | X, X | X, XXX |
| $\mathbf{X , X X X X}$ | X, XXXX | X, XXXX |

### 4.4 Vermenigvuldigen: maal

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de maal operator is het mogelijk om een numerieke expressie met een eenheid te vermenigvuldigen met een numerieke expressie die een andere, dezelfde of géén eenheid heeft. Ook is het mogelijk om twee numerieke expressies die beide géén eenheid hebben met elkaar te vermenigvuldigen.

| maal |  |  |  |
| :--- | :--- | :--- | :--- |
|  | Datatype | Eenheid restrictie |  |
| 1 | Linkerexpressie | Numeriek | Eenheid1 |
|  | Operator | maal | - |
|  | Rechterexpressie | Numeriek | Eenheid2 |
|  | Resultaatexpressie | Numeriek | Eenheid1 * Eenheid2 |


| 2 | Linkerexpressie | Numeriek | Eenheid1 |
| :--- | :--- | :--- | :--- |
|  | Operator | maal | - |
|  | Rechterexpressie | Numeriek | Eenheid1 |
|  | Resultaatexpressie | Numeriek | Eenheid1 * Eenheid1 |


| 3 | Linkerexpressie | Numeriek | Eenheid1 |
| :--- | :--- | :--- | :--- |
|  | Operator | maal | - |
|  | Rechterexpressie | Numeriek | - |
|  | Resultaatexpressie | Numeriek | Eenheid1 |


| 4 | Linkerexpressie | Numeriek | - |
| :--- | :--- | :--- | :--- |
|  | Operator | maal | - |
|  | Rechterexpressie | Numeriek | Eenheid1 |
|  | Resultaatexpressie | Numeriek | Eenheid1 |


| 5 | Linkerexpressie | Numeriek | - |
| :--- | :--- | :--- | :--- |
|  | Operator | maal | - |
|  | Rechterexpressie | Numeriek | - |
|  | Resultaatexpressie | Numeriek | - |

Tabel 11

## Rekentabel

In de regel wordt een leegwaarde als 0 beschouwd bij het uitvoeren van de maal operator.

| maal | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | 0 | 0 |
| Leeg | 0 | $X^{*} \mathrm{Y}$ |
| $\mathbf{X}$ |  |  |

Tabel 12

## Precisie

In de regel krijgt het resultaat evenveel decimalen als de som van het aantal decimalen van de twee expressies die vermenigvuldigd worden.

Wanneer er met waarden met ongelijke eenheden wordt gerekend maar wel met eenheden die in elkaar omgerekend kunnen worden, worden de waarden eerst omgerekend naar dezelfde eenheid waarna vervolgens de standaardregel wordt toegepast. Het kan hierbij voorkomen dat er door vermenigvuldiging met constanten decimalen wegvallen: bijvoorbeeld bij het vermenigvuldigen van bijvoorbeeld een attribuutwaarde 0,123 met 1000 komen 3 decimalen te vervallen.

| maal | Rechterexpressie |  |
| :---: | :---: | :---: |
| Linkerexpressie | X,XX | X,XXX |
| X, X | X, XXX | X, XXXX |
| X,XXXX | X, XXXXXX | X, XXXXXXX |

Tabel 13

### 4.5 Delen: gedeeld door en gedeeld door (ABS)

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de gedeeld door en gedeeld door (ABS) operatoren is het mogelijk om een numerieke expressie met een eenheid te delen door een numerieke expressie die een andere, dezelfde of géén eenheid heeft. Ook is het mogelijk om twee numerieke expressies die beide géén eenheid hebben door elkaar te delen.

| gedeeld door gedeeld door (ABS) |  |  |  |
| :---: | :---: | :---: | :---: |
|  |  | Datatype | Eenheid restrictie |
| 1 | Linkerexpressie | Numeriek | Eenheid1 |
|  | Operator | gedeeld door gedeeld door (ABS) | - |
|  | Rechterexpressie | Numeriek | Eenheid2 |
|  | Resultaatexpressie | Numeriek | Eenheid1/Eenheid2 |
|  |  |  |  |
| 2 | Linkerexpressie | Numeriek | Eenheid1 |
|  | Operator | gedeeld door gedeeld door (ABS) | - |
|  | Rechterexpressie | Numeriek | Eenheid1 |
|  | Resultaatexpressie | Numeriek | - |
|  |  |  |  |
| 3 | Linkerexpressie | Numeriek | Eenheid1 |
|  | Operator | gedeeld door gedeeld door (ABS) | - |
|  | Rechterexpressie | Numeriek | - |
|  | Resultaatexpressie | Numeriek | Eenheid1 |


| 4 | Linkerexpressie | Numeriek | - |
| :---: | :--- | :--- | :--- |
|  | Operator | gedeeld door <br> gedeeld door (ABS) | - |
|  | Rechterexpressie | Numeriek | Eenheid1 |
|  | Resultaatexpressie | Numeriek | Eenheid1 |
| 5 | Linkerexpressie | Operator | Numeriek |
|  |  | gedeeld door <br> gedeeld door (ABS) | - |
|  | Rechterexpressie | Numeriek | - |
|  | Resultaatexpressie | Numeriek | - |

Tabel 14

## Rekentabel

In de regel wordt een leegwaarde als 0 beschouwd bij het uitvoeren van de gedeeld door operator. Als uitzondering geldt wanneer een leegwaarde door een andere leegwaarde gedeeld wordt, dan is het resultaat geen error maar gelijk aan 0.

| gedeeld door | Rechterexpressie |  |
| :---: | :---: | :---: |
| gedeeld door (ABS) | Leeg | $\mathbf{y}$ |
| Linkerexpressie |  |  |
| Leeg | 0 | 0 |
| $\mathbf{X}$ | Error | $\mathrm{X} / \mathrm{Y}$ |

Tabel 15

## Precisie

Bij de gedeeld door en gedeeld door (ABS) operatoren is het resultaat in basis altijd een geheel getal of een breuk. Hierbij wordt dus geen decimale precisie gebruikt voor. Slechts in de gevallen wanneer een breuk ook te schrijven is als een decimaal getal zonder verlies van precisie wordt de decimale notatie gebruikt en dit zal dan altijd het exacte getal zijn.

Merk op dat specifiek voor de gedeeld door (ABS) operator het aantal decimalen van het resultaat (waar nodig) altijd gelijk is aan 5 waarbij het resultaat richting 0 is/wordt afgerond.

Het kan hierbij voorkomen dat er door te delen met constanten er decimalen ontstaan: bijvoorbeeld door de attribuutwaarde 1 te delen door 1000 zullen er 3 decimalen extra ontstaan.

### 4.6 Worteltrekken: de wortel van

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij een wortel van expressie wordt slechts één expressie gebruikt. Dit is namelijk de expressie waarvan de wortel genomen wordt. Deze expressie kan wel of geen eenheid hebben. Welke resultaten er dan mogelijk zijn, volgt in de navolgende tabel.

| wortel van |  | Datatype | Eenheid restrictie |
| :---: | :---: | :---: | :---: |
| 1 | Operator | wortel van | - |
|  | Expressie | Numeriek | - |
|  | Resultaatexpressie | Numeriek | - |
|  |  |  |  |
| 2 | Operator | wortel van | - |
|  | Expressie | Numeriek | Eenheid1 |
|  | Resultaatexpressie | Numeriek | Eenheid1 |

## Rekentabel

Wanneer van een leegwaarde de wortel wordt genomen, levert dit ook een leegwaarde als resultaat.

## Precisie

Bij de wortel van operator is het verplicht om een afronding te doen. De precisie wordt dus bepaald door te specificeren op hoeveel decimalen afgerond moet worden. Wanneer het resultaat minder decimalen heeft dan het opgegeven aantal decimalen worden er geen (achterloop)nullen geïntroduceerd.

### 4.7 Machtsverheffen: tot de macht

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij een tot de macht expressie mogen uitsluitend expressies gebruikt worden met een numeriek datatype zonder eenheid.

| tot de macht |  |  |  |
| :--- | :--- | :--- | :--- |
|  | Datatype | Eenheid restrictie |  |
| 1 | Linkerexpressie | Numeriek | - |
|  | Operator | tot de macht |  |
|  | Rechterexpressie | Numeriek | - |
|  | Resultaatexpressie | Numeriek | - |

Tabel 17

## Rekentabel

Als sprake is van een leegwaarde voor de linker- of rechterexpressie of voor beide expressies, dan levert dit ook een leegwaarde als resultaat.

## Precisie

Bij de tot de macht operator is het verplicht om een afronding toe te voegen. De precisie wordt dus bepaald door te specificeren op hoeveel decimalen afgerond moet worden. Wanneer het resultaat minder decimalen heeft dan het opgegeven aantal decimalen worden er geen (achterloop)nullen geïntroduceerd.

### 4.8 Percentage bepalen: van

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de percentage van operator is de eenheid van de linkerexpressie altijd van het soort procent ' $\%$ '. De rechterexpressie mag hierbij geen afwijkende eenheid hebben.

| percentage van |  | Datatype | Eenheid restrictie |
| :---: | :---: | :---: | :---: |
| 1 | Linkerexpressie | Numeriek | \% |
|  | Operator | van | - |
|  | Rechterexpressie | Numeriek | - |
|  | Resultaatexpressie | Numeriek | - |
|  |  |  |  |
| 2 | Linkerexpressie | Numeriek | \% |
|  | Operator | van | - |
|  | Rechterexpressie | Numeriek | Eenheid1 |
|  | Resultaatexpressie | Numeriek | Eenheid1 |

## Rekentabel

In de regel wordt een leegwaarde als 0 beschouwd bij het uitvoeren van de percentage van operator. Zie verder de navolgende tabel.

| percentage van | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | 0 | 0 |
| Leeg | 0 | $(X * Y) / 100$ |
| $\mathbf{X}$ |  |  |

Tabel 19

## Precisie

Bij de percentage van operator is het resultaat in basis altijd een geheel getal of een breuk. Hierbij wordt dus geen decimale precisie gebruikt. Slechts in de gevallen wanneer een breuk ook te schrijven is als een decimaal getal zonder verlies van precisie wordt de decimale notatie gebruikt, en dit zal dan altijd het exacte getal zijn.

### 4.9 Absolute waarde van

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij een absolute waarde van expressie wordt slechts één expressie gebruikt. Dit is namelijk de expressie waarvan de absolute waarde genomen wordt. Deze expressie kan wel of geen eenheid hebben. Welke resultaten er dan mogelijk zijn, volgt in de navolgende tabel.

| absolute waarde van |  | Datatype | Eenheid restrictie |
| :---: | :---: | :---: | :---: |
| 1 | Operator | absolute waarde van | - |
|  | Expressie | Numeriek | - |
|  | Resultaatexpressie | Numeriek | - |
|  |  |  |  |
| 2 | Operator | absolute waarde van | - |
|  | Expressie | Numeriek | Eenheid1 |
|  | Resultaatexpressie | Numeriek | Eenheid1 |

## Rekentabel

Wanneer van een leegwaarde de absolute waarde wordt genomen, levert dit ook een leegwaarde als resultaat.

## Precisie

Bij de absolute warde van operator komt de precisie van het resultaat overeen met de precisie van de expressie waarvan de absolute waarde wordt genomen.

### 4.10 Sommatie: som van

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de getalaggregatie som van operator kan een concatenatie van expressies gebruikt worden. De hoeveelheid expressies is niet vooraf gedefinieerd maar de expressies moeten wel allemaal numeriek zijn. Verder moeten, wanneer er eenheden worden gebruikt, deze in elkaar om te rekenen zijn.
![](https://cdn.mathpix.com/cropped/2025_04_10_683efbf7587961be1c26g-16.jpg?height=503&width=1603&top_left_y=1696&top_left_x=209)

Tabel 21

## Rekentabel

In de regel worden leegwaarden van expressies in de som als zijnde 0 geteld. Wanneer alle expressies een leegwaarde bevatten zal het resultaat ook een leegwaarde zijn, tenzij gebruik is gemaakt van het 'of 0 als die er niet zijn' patroon.

## Precisie

Net als bij de plus operator krijgt het resultaat bij de som van operator evenveel decimalen als het aantal decimalen van de waarde met de meeste decimalen.
Wanneer er met waarden met ongelijke eenheden wordt gerekend maar wel met eenheden die in elkaar omgerekend kunnen worden, dan worden de waarden eerst omgerekend naar dezelfde eenheid waarna vervolgens de standaardregel wordt toegepast.

### 4.11 Telling van instanties: aantal

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de aantal operator kan een concatenatie van expressies gebruikt worden. De hoeveelheid expressies is niet vooraf gedefinieerd. De aantal operator kan alleen gebruik maken van onderwerpexpressies.

## Rekentabel

Aangezien alleen onderwerpexpressies gebruikt kunnen worden, zijn leegwaarden niet van toepassing bij de aantal operator.

## Precisie

Het resultaat van de aantal operator zal altijd een niet-negatief geheel getal zijn.

### 4.12 Minimale waarde van

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de (nagenoeg) gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de getalaggregatiefunctie minimale waarde van operator kan een concatenatie van expressies gebruikt worden. De hoeveelheid expressies is niet vooraf gedefinieerd maar het moeten wel allemaal numerieke expressies zijn. Verder moeten wanneer eenheden worden gebruikt, deze in elkaar om te rekenen zijn.

| minimale waarde van |  | Datatype | Eenheid restrictie |
| :---: | :---: | :---: | :---: |
| 1 | Operator | minimale waarde van | - |
|  | Expressies | Numeriek | - |
|  | Resultaatexpressie | Numeriek | - |
| 2 | Operator | minimale waarde van | - |
|  | Expressies | Numeriek | Eenheden die om te rekenen zijn naar Eenheid1 (resultaat eenheid) |
|  | Resultaatexpressie | Numeriek | Eenheid1 |

## Rekentabel

In de regel worden leegwaarden van expressies in de minimale waarde van operator niet meegeteld. Wanneer alle expressies een leegwaarde bevatten, zal het resultaat ook een
leegwaarde zijn.

## Precisie

Het aantal decimalen van het resultaat zal gelijk zijn aan het aantal decimalen van de waarde van de numerieke expressie met de kleinste waarde.

### 4.13 Maximale waarde van

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de (nagenoeg) gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de getalaggregatiefunctie maximale waarde van operator kan een concatenatie van expressies gebruikt worden. De hoeveelheid expressies is niet vooraf gedefinieerd maar het moeten wel allemaal numerieke expressies zijn. Verder moeten, wanneer er eenheden worden gebruikt, deze in elkaar om te rekenen zijn.

| maximale waarde van |  | Datatype | Eenheid restrictie |
| :---: | :---: | :---: | :---: |
| 1 | Operator | maximale waarde van | - |
|  | Expressies | Numeriek | - |
|  | Resultaatexpressie | Numeriek | - |
|  |  |  |  |
| 2 | Operator | maximale waarde van | - |
|  | Expressies | Numeriek | Eenheden die om te rekenen zijn naar Eenheid1 (resultaat eenheid) |
|  | Resultaatexpressie | Numeriek | Eenheid1 |

Tabel 23

## Rekentabel

In de regel worden leegwaarden van expressies in de maximale waarde van operator niet meegeteld. Wanneer alle expressies een leegwaarde bevatten, zal het resultaat ook een leegwaarde zijn.

## Precisie

Het aantal decimalen van het resultaat zal gelijk zijn aan het aantal decimalen van de waarde van de numerieke expressie met de grootste waarde.

### 4.14 Eerste waarde: eerste van

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de (nagenoeg) gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de datumaggregatiefunctie eerste van operator kan een concatenatie van expressies gebruikt worden. De hoeveelheid expressies is niet vooraf gedefinieerd maar het moeten wel allemaal datumexpressies zijn. Verder moeten alle expressies dezelfde tijd-precisie bevatten.

| eerste van |  |  |
| :--- | :--- | :--- |
| 1 | Operator | Datatype |
|  | Expressies | eerste van |
|  | Resultaatexpressie | Datum-tijd |

Tabel 24

## Rekentabel

In de regel worden leegwaarden van expressies in de eerste van operator niet meegeteld.
Wanneer alle expressies een leegwaarde bevatten, zal het resultaat ook een leegwaarde zijn.

## Precisie

Het aantal decimalen is niet van toepassing bij het bepalen van de eerste datum.

### 4.15 Laatste waarde: laatste van

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de (nagenoeg) gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de datumaggregatiefunctie laatste van operator kan een concatenatie van expressies gebruikt worden. De hoeveelheid expressies is niet vooraf gedefinieerd maar het moeten wel allemaal datumexpressies zijn. Verder moeten alle expressies dezelfde tijd-precisie bevatten.

| laatste van |  |  |
| :--- | :--- | :--- |
|  | Datatype |  |
| 1 | Operator | Laatste van |
|  | Expressies | Datum-tijd |
|  | Resultaatexpressie | Datum-tijd |

## Rekentabel

In de regel worden leegwaarden van expressies in de laatste van operator niet meegeteld.
Wanneer alle expressies een leegwaarde bevatten, zal het resultaat ook een leegwaarde zijn.

## Precisie

Het aantal decimalen is niet van toepassing bij het bepalen van de laatste datum.

### 4.16 Tijdsduur van ... tot ...

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de (nagenoeg) gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de tijdsduur van ... tot ...operator/functie worden twee expressies gebruikt, beide van het datatype datum. Beide expressies moeten dezelfde tijd-precisie bevatten. Het resultaat is een Numerieke expressie met een tijdseenheid.

| tijdsduur van tot |  |  | Datatype |
| :--- | :--- | :--- | :--- |
| 13 | Linkerexpressie | Datum-tijd | - |
|  | Operator | tijdsduur van ... tot ... | - |
|  | Rechterexpressie | Datum-tijd | - |
|  | Resultaatexpressie | Numeriek | Tijdseenheid |
| Tabel 26 |  |  |  |

## Rekentabel

Als sprake is van een leegwaarde voor de linker- of rechterexpressie of voor beide expressies, dan levert dit ook een leegwaarde als resultaat.

## Precisie

Het aantal decimalen is niet van toepassing bij het bepalen van de tijdsduur.

### 4.17 Absolute tijdsduur van ... tot ...

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de (nagenoeg) gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de absolute tijdsduur van ... tot ... operator/functie worden twee expressies gebruikt, beide van het datatype datum. Beide expressies moeten dezelfde tijd-precisie bevatten. Het resultaat is een Numerieke expressie met een tijdseenheid.

| absolute tijdsduur van tot |  | Datatype | Eenheid restrictie |
| :---: | :---: | :---: | :---: |
| 1 | Linkerexpressie | Datum-tijd | - |
|  | Operator | absolute tijdsduur van ... tot ... | - |
|  | Rechterexpressie | Datum-tijd | - |
|  | Resultaatexpressie | Numeriek | Tijdseenheid |

## Rekentabel

Als sprake is van een leegwaarde voor de linker- of rechterexpressie of voor beide expressies, dan levert dit ook een leegwaarde als resultaat.

## Precisie

Het aantal decimalen is niet van toepassing bij het bepalen van de tijdsduur.

### 4.18 Dag/maand/jaar uit

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de dag/maand/jaar uit operatoren/functies wordt één datumexpressie als invoer gebruikt.

Het resultaat is een numerieke expressie zonder eenheid.

| dag/maand/jaar uit |  |  |
| :--- | :--- | :--- |
| 1 | Operator | Datatype |
|  | Expressie | dag/maand/jaar uit |
|  | Resultaatexpressie | Datum |
| Tabel 28 |  |  |

## Rekentabel

Als de inputexpressie een leegwaarde bevat, krijgt het resultaat ook een leegwaarde.

## Precisie

Het resultaat zal altijd een geheel getal zijn.

### 4.19 Eerste paasdag van

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de eerste paasdag van operator/functie wordt één numerieke expressie zonder eenheid gebruikt. De expressie is altijd een geheel getal met 4 cijfers. Het resultaat is een datumexpressie.

| eerste paasdag van |  |  |
| :---: | :--- | :--- |
| 1 | Operator | Datatype |
|  | Expressie | eerste paasdag van |
|  | Resultaatexpressie | Numeriek |
| Tabel 29 |  |  |

## Rekentabel

Als de inputexpressie een leegwaarde bevat, krijgt het resultaat ook een leegwaarde. Het resultaat zal de datum van de eerste paasdag in het jaar dat uitgedrukt wordt door het getal met 4 cijfers.

## Precisie

Het aantal decimalen is niet van toepassing bij het bepalen van de eerste paasdag.

### 4.20 Aggregeren in de tijd: totaal van

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij het aggregeren van waarden in de tijd met de totaal van operator moet de expressie numeriek zijn met een eenheid per tijdseenheid.

| totaal van |  |  |  |
| :--- | :--- | :--- | :--- |
|  | Datatype | Eenheid restrictie |  |
| 1 | Operator | Expressies | totaal van |
|  | Resultaatexpressie | Numeriek | $1 /$ tijdseenheid |
|  | Resiek | - |  |


| 2 | Operator | som van | - |
| :--- | :--- | :--- | :--- |
|  | Expressies | Numeriek | Eenheden die om te rekenen zijn <br> naar Eenheid1 (resultaat <br> eenheid)/tijdseenheid |
|  | Resultaatexpressie | Numeriek | Eenheid1 |
| Tabel $\mathbf{3 0}$ |  |  |  |

## Rekentabel

In de regel worden leegwaarden van expressies in de tijd in de som als zijnde 0 geteld. Wanneer alle expressies een leegwaarde bevatten zal het resultaat 0 zijn.

## Precisie

Net als bij de plus operator krijgt het resultaat bij de totaal van operator evenveel decimalen als het aantal decimalen van de waarde met de meeste decimalen.
Wanneer er met waarden met ongelijke eenheden wordt gerekend maar wel met eenheden die in elkaar omgerekend kunnen worden, dan worden de waarden eerst omgerekend naar dezelfde eenheid waarna vervolgens de standaardregel wordt toegepast.

### 4.21 Tellen van dagen: aantal dagen in ... dat ...

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij de aantal dagen dat operator heeft het resultaat altijd een numeriek datatype met als eenheid dagen per tijdseenheid. Deze tijdseenheid moet overeenkomen met de in de operator gekozen tijdseenheid (de tijdseenheid na "aantal dagen in...")

## Rekentabel

Leegwaarden zijn niet van toepassing bij de aantal dagen dat operator. Als er geen dagen zijn waarop de voorwaarde geldt, dan is het resultaat 0 dagen per tijdseenheid.

## Precisie

Het resultaat van de aantal dagen dat operator zal altijd een niet-negatief geheel getal per tijdseenheid zijn.

### 4.22 Omrekening met gebroken jaren of maanden: tijdsevenredig deel

Vooraf: voor meer (basis) informatie over deze operator wordt verwezen naar de gelijknamige paragraaf in het RegelSpraak specificatiedocument.

## Datatypen en eenheden

Bij het berekenen van een tijdsevenredig deel met de tijdsevenredig deel van operator moet de
expressie numeriek zijn met een eenheid per tijdseenheid.
![](https://cdn.mathpix.com/cropped/2025_04_10_683efbf7587961be1c26g-23.jpg?height=720&width=1592&top_left_y=388&top_left_x=215)

Tabel 31

## Rekentabel

Wanneer de expressie een leegwaarde bevat dan zal het resultaat ook leeg zijn.

## Precisie

Bij de tijdsevenredig deel van operator is het resultaat in basis altijd een geheel getal of een breuk. Hierbij wordt dus geen decimale precisie gebruikt. Slechts in de gevallen wanneer een breuk ook te schrijven is als een decimaal getal zonder verlies van precisie wordt de decimale notatie gebruikt, en dit zal dan altijd het exacte getal zijn.

## 5. Condities en predicaten

Vooraf: voor meer (basis) informatie over dit onderwerp wordt verwezen naar het gelijknamige hoofdstuk in het RegelSpraak specificatiedocument.
Daarbij zijn predicaten die uitsluitend gebruikt worden in combinatie met consistentieregels niet in dit hoofdstuk niet uitgewerkt. Dit zijn de predicaten: is uniek, is gevuurd en is inconsistent.

### 5.1 Kleiner dan

## Datatypen en eenheden

De kleiner dan vergelijking kan alleen worden toegepast op numerieke en percentage expressies. Als er bij numerieke expressies gebruik wordt gemaakt van eenheden, dan moeten deze eenheden gelijk zijn aan elkaar of in elkaar om te rekenen zijn.
![](https://cdn.mathpix.com/cropped/2025_04_10_683efbf7587961be1c26g-24.jpg?height=829&width=1606&top_left_y=976&top_left_x=208)

Tabel 32

## Rekentabel

Wanneer met leegwaarden wordt vergeleken, zal dit altijd resulteren in een vergelijking die niet kan worden uitgevoerd en dus een 'onwaar' opleveren.

| kleiner dan | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie |  | onwaar |
| Leeg | onwaar | $\mathrm{X}<\mathrm{Y} ?$ |
| $\mathbf{X}$ |  |  |

Tabel 33

### 5.2 Kleiner of gelijk aan

## Datatypen en eenheden

De kleiner of gelijk aan vergelijking kan alleen worden toegepast op numerieke en percentage expressies. Als er bij numerieke expressies gebruik wordt gemaakt van eenheden, dan moeten deze eenheden gelijk zijn aan elkaar of in elkaar om te rekenen zijn.

| kleiner of gelijk aan |  | Datatype |  |
| :--- | :--- | :--- | :--- |
| 1 | Linkerexpressie | Numeriek | Eenheid restrictie |
|  | Operator | kleiner of gelijk aan (<=) | Eenheid1 |
|  | Rechterexpressie | Numeriek | Eenheid1 |
|  | Resultaatexpressie | Boolean | - |


| 2 | Linkerexpressie | Numeriek | Eenheid1 |
| :--- | :--- | :--- | :--- |
|  | Operator | kleiner of gelijk aan (<=) | - |
|  | Rechterexpressie | Numeriek | Eenheid2 die om te <br> rekenen is in Eenheid1 |
|  | Resultaatexpressie | Boolean | - |


| 3 | Linkerexpressie | Percentage | $\%$ |
| :--- | :--- | :--- | :--- |
|  | Operator | kleiner of gelijk aan $(<=)$ | - |
|  | Rechterexpressie | Percentage | $\%$ |
|  | Resultaatexpressie | Boolean | - |

Tabel 34

## Rekentabel

Wanneer met leegwaarden wordt vergeleken, zal dit altijd resulteren in een vergelijking die niet kan worden uitgevoerd en dus een 'onwaar' opleveren.

| kleiner of gelijk aan | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | y |  |
| Leeg | onwarar | onwaar |
| $\mathbf{X}$ | onwaar | $\mathrm{X}<=\mathrm{Y} ?$ |

Tabel 35

### 5.3 Gelijk aan

## Datatypen en eenheden

De gelijk aan vergelijking kan op expressies met ieder soort datatype toegepast worden. Belangrijk is wel dat de linker- en rechterexpressie hetzelfde datatype hebben. Als bij numeriek expressies eenheden gebruikt worden, is het tevens belangrijk dat deze eenheden aan elkaar gelijk zijn of in elkaar om te rekenen zijn.

| gelijk aan |  | Datatype | Eenheid restrictie |
| :---: | :---: | :---: | :---: |
| 1 | Linkerexpressie | Numeriek | Eenheid1 |
|  | Operator | gelijk aan (==) | - |
|  | Rechterexpressie | Numeriek | Eenheid1 |
|  | Resultaatexpressie | Boolean | - |
|  |  |  |  |
| 2 | Linkerexpressie | Numeriek | Eenheid1 |
|  | Operator | gelijk aan (==) | - |
|  | Rechterexpressie | Numeriek | Eenheid2 die om te rekenen is in Eenheid1 |
|  | Resultaatexpressie | Boolean | - |
|  |  |  |  |
| 3 | Linkerexpressie | Tekst | - |
|  | Operator | gelijk aan (==) | - |
|  | Rechterexpressie | Tekst | - |
|  | Resultaatexpressie | Boolean | - |
|  |  |  |  |
| 4 | Linkerexpressie | Datum-tijd | - |
|  | Operator | gelijk aan (==) | - |
|  | Rechterexpressie | Datum-tijd | - |
|  | Resultaatexpressie | Boolean | - |
|  |  |  |  |
| 5 | Linkerexpressie | Boolean | - |
|  | Operator | gelijk aan (==) | - |
|  | Rechterexpressie | Boolean | - |
|  | Resultaatexpressie | Boolean | - |
|  |  |  |  |
| 6 | Linkerexpressie | Percentage | \% |
|  | Operator | gelijk aan (==) | - |
|  | Rechterexpressie | Percentage | \% |
|  | Resultaatexpressie | Boolean | - |
|  |  |  |  |
| 7 | Linkerexpressie | Enumeratie | - |
|  | Operator | gelijk aan (==) | - |
|  | Rechterexpressie | Enumeratie | - |
|  | Resultaatexpressie | Boolean | - |

Tabel 36

## Rekentabel

Wanneer met leegwaarden wordt vergeleken, is het resultaat afhankelijk van het datatype van de expressies die vergeleken worden. In die situatie geldt voor expressies met datatype numeriek en percentage dat het resultaat 'waar' (eerste tabel) is en in alle andere situaties geeft dit een fout (tweede tabel).

| gelijk aan | Rechterexpressie |  |
| :---: | :---: | :---: |
| (Numeriek \& Percentage) | Leeg | $\mathbf{Y}$ |
| Linkerexpressie |  |  |
| Leeg | waar | onwaar |
| $\mathbf{X}$ | onwar | $\mathrm{X}==\mathrm{Y} ?$ |

Tabel 37

| gelijk aan | Rechterexpressie |  |
| :---: | :---: | :---: |
| (Anders) | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | fout | onwaar |
| Leeg | onwar | $\mathrm{X}==\mathrm{Y} ?$ |
| $\mathbf{X}$ |  |  |

Tabel 38

### 5.4 Groter of gelijk aan

## Datatypen en eenheden

De groter of gelijk aan vergelijking kan alleen worden toegepast op numerieke en percentage expressies. Als er bij numerieke expressies gebruik wordt gemaakt van eenheden, dan moeten deze eenheden gelijk zijn aan elkaar of in elkaar om te rekenen zijn.
![](https://cdn.mathpix.com/cropped/2025_04_10_683efbf7587961be1c26g-27.jpg?height=309&width=1603&top_left_y=1556&top_left_x=209)

| 2 | Linkerexpressie | Numeriek | Eenheid1 |
| :--- | :--- | :--- | :--- |
|  | Operator | groter of gelijk aan (>=) | - |
|  | Rechterexpressie | Numeriek | Eenheid2 die om te rekenen <br> is in Eenheid1 |
|  | Resultaatexpressie | Boolean | - |


| 3 | Linkerexpressie | Percentage | $\%$ |
| :--- | :--- | :--- | :--- |
|  | Operator | groter of gelijk aan (>=) | - |
|  | Rechterexpressie | Percentage | $\%$ |
|  | Resultaatexpressie | Boolean | - |

Tabel 39

## Rekentabel

Wanneer met leegwaarden wordt vergeleken zal dit altijd resulteren in een vergelijking die niet kan worden uitgevoerd en dus een 'onwaar' opleveren.

| groter of gelijk aan | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | onwar | onwaar |
| Leeg | onwar | $\mathrm{X}>=\mathrm{Y} ?$ |
| $\mathbf{X}$ |  |  |

Tabel 40

### 5.5 Groter dan

## Datatypen en eenheden

De groter dan vergelijking kan alleen worden toegepast op numerieke en percentage expressies. Als er bij numerieke expressies gebruik gemaakt wordt van eenheden moeten deze eenheden aan elkaar gelijk zijn of in elkaar om te rekenen zijn.

| groter dan |  |  |  |
| :--- | :--- | :--- | :--- |
|  | Datatype | Eenheid restrictie |  |
| 1 | Linkerexpressie | Numeriek | Eenheid1 |
|  | Operator | groter dan $(>)$ | - |
|  | Rechterexpressie | Numeriek | Eenheid1 |
|  | Resultaatexpressie | Boolean | - |


| 2 | Linkerexpressie | Numeriek | Eenheid1 |
| :---: | :--- | :--- | :--- |
|  | Operator | groter dan ( $>$ ) | - |
|  | Rechterexpressie | Numeriek | Eenheid2 die om te rekenen is in <br> Eenheid1 |
|  | Resultaatexpressie | Boolean | - |


| 3 | Linkerexpressie | Percentage | $\%$ |
| :--- | :--- | :--- | :--- |
|  | Operator | groter dan (>) | - |
|  | Rechterexpressie | Percentage | $\%$ |
|  | Resultaatexpressie | Boolean | - |

Tabel 41

## Rekentabel

Wanneer met leegwaarden wordt vergeleken zal dit altijd resulteren in een vergelijking die niet kan worden uitgevoerd en dus een 'onwaar' opleveren.

| groter dan | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | onwaar | onwaar |
| Leeg | onwaar | $\mathrm{X}>\mathrm{Y} ?$ |
| $\mathbf{X}$ |  |  |

Tabel 42

### 5.6 Ongelijk aan

## Datatypen en eenheden

De ongelijk aan vergelijking kan op expressies met ieder soort datatype toegepast worden.
Belangrijk is wel dat de linker- en rechterexpressie hetzelfde datatype hebben. Als bij numerieke expressies eenheden gebruikt worden, is het tevens belangrijk dat deze eenheden gelijk zijn aan elkaar of in elkaar om te rekenen zijn.
![](https://cdn.mathpix.com/cropped/2025_04_10_683efbf7587961be1c26g-29.jpg?height=1771&width=1594&top_left_y=622&top_left_x=214)

Tabel 43

## Rekentabel

Wanneer met leegwaarden wordt vergeleken zal dit altijd resulteren in 'onwaar' wanneer beide expressie een leeg waarde bevatten en 'waar' zijn wanneer exact één van de twee een leeg waarde bevat.

| Ongelijk aan | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | onwaar | waar |
| Leeg | waar | $\mathrm{X}!=Y ?$ |

Tabel 44

### 5.7 Eerder dan

Datatypen en eenheden
De eerder dan vergelijking kan alleen worden toegepast op Datum(-tijd)expressies.

| eerder dan |  |  |  |
| :--- | :--- | :--- | :--- |
|  | Datatype | Eenheid restrictie |  |
| 1. | Linkerexpressie | Datum-tijd | - |
|  | Operator | eerder dan | - |
|  | Rechterexpressie | Datum-tijd | - |
|  | Resultaatexpressie | Boolean | - |
| Tabel 45 |  |  |  |

## Rekentabel

Wanneer met leegwaarden wordt vergeleken zal dit altijd resulteren in een vergelijking die niet kan worden uitgevoerd en dus een 'onwaar' opleveren. Als beide waarden leeg zijn, dan levert dit een fout op.

| eerder dan | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | fout | onwaar |
| Leeg | onwarar | $X$ eerder dan Y? |

Tabel 46

### 5.8 Eerder of gelijk aan

## Datatypen en eenheden

De eerder of gelijk aan vergelijking kan alleen worden toegepast op Datum(-tijd)expressies.

| eerder of gelijk aan |  | Datatype | Eenheid restrictie |
| :---: | :---: | :---: | :---: |
| 1 | Linkerexpressie | Datum-tijd | - |
|  | Operator | eerder of gelijk aan | - |
|  | Rechterexpressie | Datum-tijd | - |
|  | Resultaatexpressie | Boolean | - |

## Rekentabel

Wanneer met leegwaarden wordt vergeleken, zal dit altijd resulteren in een vergelijking die niet kan worden uitgevoerd en dus een 'onwaar' opleveren. Als beide waarden leeg zijn levert dit een fout op.

| eerder of gelijk aan | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | fout | onwaar |
| Leeg | onwaar | X eerder of gelijk aan Y? |
| $\mathbf{X}$ |  |  |

Tabel 48

### 5.9 Later of gelijk aan

## Datatypen en eenheden

De later of gelijk aan vergelijking kan alleen worden toegepast op Datum(-tijd)expressies.

| later of gelijk aan |  |  | Eenheid restrictie |
| :--- | :--- | :--- | :--- |
| 1 | Linkerexpressie | Datatype | - |
|  | Operator | later of gelijk aan | - |
|  | Rechterexpressie | Datum-tijd | - |
|  | Resultaatexpressie | Boolean | - |
| Tabel 49 |  |  |  |

## Rekentabel

Wanneer met leegwaarden wordt vergeleken, dan zal dit altijd resulteren in een vergelijking die niet kan worden uitgevoerd en dus een 'onwaar' opleveren. Als beide waarden leeg zijn, dan levert dit een fout op.

| Later of gelijk aan | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Leeg | fout | onwaar |
| $\mathbf{X}$ | onwaar | X later of gelijk aan Y? |

Tabel 50

### 5.10 Later dan

## Datatypen en eenheden

De later dan vergelijking kan alleen worden toegepast op Datum(-tijd)expressies.

| later dan |  |  |  |
| :--- | :--- | :--- | :--- |
|  | Datatype | Eenheid restrictie |  |
| 1 | Linkerexpressie | Datum-tijd | - |
|  | Operator | later dan | - |
|  | Rechterexpressie | Datum-tijd | - |
|  | Resultaatexpressie | Boolean | - |
| Tabel 51 |  |  |  |

## Rekentabel

Wanneer met leegwaarden wordt vergeleken, dan zal dit altijd resulteren in een vergelijking die niet kan worden uitgevoerd en dus een 'onwaar' opleveren. Als beide waarden leeg zijn, dan levert dit een fout op.

| later dan | Rechterexpressie |  |
| :---: | :---: | :---: |
|  | Leeg | $\mathbf{Y}$ |
| Linkerexpressie | fout | onwaar |
| Leeg | onwar | X later dan $\mathrm{Y} ?$ |
| $\mathbf{X}$ |  |  |

Tabel 52

### 5.11 Is gevuld

## Datatypen en eenheden

Het is gevuld predicaat kan alleen op één enkele onderwerpexpressie toegepast worden. Het resultaat zal altijd een Booleaanse waarde opleveren.

## Rekentabel

Het is gevuld predicaat is speciaal om te controleren of een onderwerpexpressie géén leegwaarde bevat.

| is gevuld |  |
| :---: | :---: |
| Linkerexpressie | Resultaat |
| Leeg | onwaar |
| $\mathbf{X}$ | waar |
|  | Tabel 53 |

### 5.12 Is leeg

Datatypen en eenheden
Het is leeg predicaat kan alleen op één enkele onderwerpexpressie toegepast worden. Het resultaat zal altijd een Booleaanse waarde opleveren.

## Rekentabel

Het is leeg predicaat is speciaal om te controleren of een onderwerpexpressie een leegwaarde bevat.

| is leeg |  |
| :---: | :---: |
| Linkerexpressie | Resultaat |
| Leeg | waar |
| $\mathbf{X}$ | onwaar |

Tabel 54

### 5.13 Voldoet aan de elfproef

De elfproef is een toets om te controleren of een identificatienummer geldig is. Hierbij wordt ieder cijfer "gewogen" en bij elkaar opgeteld. Gewogen betekent dat een cijfer vermenigvuldigd wordt met een afgesproken waarde, afhankelijk van zijn positie in de cijferreeks. Het toekennen van een weging begint bij het laatste cijfer in de reeks: het laatste cijfer in de reeks (het controlecijfer) krijgt een gewicht van -1 , het een-na-laatste cijfer een gewicht van 2 , het twee-na-laatste cijfer een gewicht van 3, etc. Als de gebruikte cijferreeks bijvoorbeeld een geldig BSN-nummer is, moet de som hiervan bij delen door 11 (vandaar de naam "elfproef") een positief geheel getal opleveren en het getal mag niet uitsluitend uit nullen bestaan.

De genoemde weging van cijfers bij het toepassen van de elfproef impliceert dat slechts enkele datatypen mogelijk zijn: het datatype Numeriek (geheel getal) en Tekst zijn toegestaan, met als kanttekening dat bij het datatype Tekst alleen cijfers in de waarde mogen voorkomen (dit kan bijvoorbeeld het geval zijn bij het gebruik van eventuele voor-of achterloopnullen).

Om de werking van de elfproef te verduidelijken, is hierna een uitgewerkt voorbeeld gegeven aan de hand van fictief BSN-nummer 192837465. Eerst wordt zoals hierboven aangegeven voor ieder cijfer een gewicht toegekend, waarna het cijfer met zijn gewicht wordt vermenigvuldigd. De som van deze producten wordt berekend en vervolgens gedeeld door 11. De som is 205 en delen door 11 geeft 18 rest 7. Dit betekent dat het fictief BSN-nummer 192837465 geen geldig burgerservicenummer is.

| BSN | 1 | 9 | 2 | 8 | 3 | 7 | 4 | 6 | 5 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Gewicht | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | -1 |
| Product | 9 | 72 | 14 | 48 | 15 | 28 | 12 | 12 | -5 |
| Som | 9 | 81 | 95 | 143 | 158 | 186 | 198 | 210 | 205 |

## Datatypen en eenheden

Het voldoet aan de elfproef predicaat kan worden toegepast op numerieke en tekstuele expressies.

Datatypen en eenheden

| voldoet aan de elfproef |  | Datatype | Eenheid restrictie |
| :---: | :---: | :---: | :---: |
| 1 | Expressie | Numeriek | - |
|  | Operator | voldoet aan de elfproef | - |
|  | Resultaatexpressie | Boolean | - |
|  |  |  |  |
| 2 | Expressie | Tekst | - |
|  | Operator | voldoet aan de elfproef | - |
|  | Resultaatexpressie | Boolean | - |

## Rekentabel

Een leegwaarde voldoet nooit aan de elfproef.

| voldoet aan de elfproef |  |
| :---: | :---: |
| Linkerexpressie | Resultaat |
| Leeg | onwaar |
| $\mathbf{x}$ | X voldoet an de <br> elfproef? |

Tabel 56

### 5.14 Is kenmerk/ is rol

## Datatypen en eenheden

De is kenmerk en is rol predicaten checken of een instantie van een objecttype of rol een bepaald kenmerk bevat of een bepaalde rol is. Er hangt dus geen datatype beperking aan de is kenmerk en is rol predicaten.

## Rekentabel

Er hoeft geen rekening gehouden te worden met leegwaarden omdat in deze context objecten of rollen niet leeg kunnen zijn.

### 5.15 Is dagsoort

## Datatypen en eenheden

Het is dagsoort predicaat checkt of een datumexpressie een bepaalde dagsoort is. Het te gebruiken datatype is het datum(-tijd)datatype.

Datatypen en eenheden

| is dagSoort |  |  |  |
| :--- | :--- | :--- | :--- |
|  | Datatype | Eenheid restrictie |  |
| 1. | Expressie | Datum-tijd | - |
|  | Operator | is dagsoort | - |
|  | Resultaatexpressie | Boolean | - |

Tabel 57

## Rekentabel

Een leegwaarde is nooit een bepaalde dagsoort.

| is dagsoort |  |
| :---: | :---: |
| Linkerexpressie | Resultaat |
| Leeg | onwaar |
| $\mathbf{X}$ | X is dagsoort? |

Tabel 58

### 5.16 Is numeriek

## Datatypen en eenheden

Het is numeriek predicaat checkt of een tekstexpressie een numerieke waarde representeert. Het te gebruiken datatype is het Tekst datatype.

Datatypen en eenheden

| is numeriek |  |  | Datatype |
| :--- | :--- | :--- | :--- |
| 1 | Expressie | Tekst | - |
|  | Operator | is numeriek | - |
|  | Resultaatexpressie | Boolean | - |

Tabel 59

## Rekentabel

Een leegwaarde is nooit een numerieke waarde.

| is numeriek |  |
| :---: | :---: |
| Linkerexpressie | Resultaat |
| Leeg | onwaar |
| $\mathbf{X}$ | X is numeriek? |

Tabel 60

## 6. Resultaatdeel

Vooraf: voor meer (basis) informatie over dit onderwerp wordt verwezen naar het gelijknamige hoofdstuk in het RegelSpraak specificatiedocument.

### 6.1 Gelijkstelling

## Datatypen en eenheden

Een gelijkstelling kan gebruik maken van ieder soort datatype. Het datatype van het resultaat en de expressie waaraan het resultaat gelijkgesteld wordt (rechterexpressie) moeten wel overeenkomen. Bij numerieke expressies is het belangrijk dat wanneer eenheden gebruikt worden, deze aan elkaar gelijk zijn of in elkaar om te rekenen zijn.

| Gelijkstelling |  | Datatype | Eenheid restrictie |
| :---: | :---: | :---: | :---: |
| 1 | Resultaatexpressie | Numeriek | Eenheid1 |
|  | Rechterexpressie | Numeriek | Eenheid1 |
| 2 | Resultaatexpressie | Numeriek | Eenheid1 |
|  | Rechterexpressie | Numeriek | Eenheid2 die om te rekenen is in Eenheid1 |
| 3 | Resultaatexpressie | Tekst | - |
|  | Rechterexpressie | Tekst | - |
| 4 | Resultaatexpressie | Datum-tijd | - |
|  | Rechterexpressie | Datum-tijd | - |
| 5 | Resultaatexpressie | Boolean | - |
|  | Rechterexpressie | Boolean | - |
| 6 | Resultaatexpressie | Percentage | \% |
|  | Rechterexpressie | Percentage | \% |
| 7 | Resultaatexpressie | Enumeratie | - |
|  | Rechterexpressie | Enumeratie | - |

## Rekentabel

Wanneer gelijkgesteld wordt aan een leegwaarde zal het resultaat ook een leegwaarde zijn.
![](https://cdn.mathpix.com/cropped/2025_04_10_683efbf7587961be1c26g-36.jpg?height=255&width=1606&top_left_y=2163&top_left_x=205)

Tabel 62

### 6.2 Initialisatie

## Datatypen en eenheden

Net als bij een gelijkstelling kan een initialisatie gebruik maken van ieder soort datatype. Het datatype van het resultaat en de expressie waarmee het resultaat geïnitialiseerd wordt (rechterexpressie) moeten wel overeenkomen. Bij numerieke expressies is het belangrijk dat wanneer eenheden gebruikt worden, deze aan elkaar gelijk zijn of in elkaar om te rekenen zijn.
![](https://cdn.mathpix.com/cropped/2025_04_10_683efbf7587961be1c26g-37.jpg?height=1132&width=1597&top_left_y=633&top_left_x=207)

## Rekentabel

Wanneer geïnitialiseerd wordt met een leegwaarde zal het resultaat ook een leegwaarde zijn.

| Initialisatie |  |  |  |  |
| :--- | :--- | :--- | :---: | :---: |
| Links | Rechts | Output |  |  |
| X | Y | $\mathrm{X}:=\mathrm{Y}$ |  |  |
| X | Leeg | $\mathrm{X}:=$ leeg |  |  |
|  |  |  |  |  |

### 6.3 Kenmerktoekenning

## Datatypen en eenheden

Een kenmerktoekenning maakt alleen gebruik van objecttypen, rollen en kenmerken en heeft dus geen restricties op datatypen en eenheden.

## Rekentabel

Een kenmerk kan geen leegwaarde bevatten. Wanneer een kenmerk wordt toegekend aan een object, krijgt dit object automatisch dat kenmerk.

### 6.4 Feitcreatie

## Datatypen en eenheden

Een feitcreatie maakt alleen gebruik van objecttypen en rollen, deze actie heeft dus geen restricties op datatypen en eenheden.

## Rekentabel

Een rol kan nooit een leegwaarde zijn, de rol bestaat voor een objecttype of hij bestaat niet. Wanneer alle rollen in de feitcreatie bestaan kan ook het additionele feit (twee rollen) gecreëerd worden.

### 6.5 ObjectCreatie

## Datatypen en eenheden

Een constructie heeft geen directe beperking op datatypen en eenheden. Bij een constructie kunnen wel attributen van het objecttype van het geconstrueerde object geïnitialiseerd worden. Dit gaat volgens dezelfde beperkingen als bij initialisatie.

## Rekentabel

De initialisatie van attributen in een constructie-actie volgen ook dezelfde regels voor het omgaan met leegwaarden als de initialisatie-actie.

### 6.6 Consistentieregel

Consistentieregels volgen dezelfde regels als de regels van predicaten die in het hoofdstuk over predicaten zijn uitgewerkt.

### 6.7 Dagsoortdefinitie

## Datatypen en eenheden

Een dagsoortdefinitie maakt geen gebruik van elementen die een datatype of eenheid hebben.

## Rekentabel

Leegwaarden zijn niet van toepassing op een dagsoortdefinitie, de dag bestaat in principe altijd.

