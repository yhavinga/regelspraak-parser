## RegelSpraak-specificatie

## syntaxdiagrammen

```
Datum: 24-1-2025
Versie 2.1.0
```


## © 2024 Belastingdienst

Alle rechten voorbehouden.
Niets uit deze uitgave mag worden verveelvoudigd, opgeslagen in een geautomatiseerd gegevensbestand en/of openbaar gemaakt in enige vorm of op enige wijze, hetzij elektronisch, mechanisch, door fotokopieën, opnamen of op enige andere manier zonder voorafgaande schriftelijke toestemming van de auteur.

## Inhoudsopgave:

Versiebeheer ..... 4
Syntaxdiagrammen ..... 5
13.2 Standaard syntax patronen ..... 7
13.2.1 Digit ..... 7
13.2.2 Getal ..... 7
13.2.3 Geheel getal ..... 7
13.2.4 Decimaal getal ..... 7
13.2.5 Rationeel getal ..... 8
13.2.6 Letter ..... 8
13.2.7 Leesteken ..... 9
13.2.8 Karakterreeks ..... 9
13.2.9 Lidwoord ..... 9
13.2.10 Bepaallidwoord ..... 10
13.2.11 Onbepaaldlidwoord ..... 10
13.2.13 Waarde ..... 10
13.2.13 Enumeratiewaarde ..... 10
13.2.14 Tekstwaarde ..... 10
13.2.15 Boolean waarde ..... 10
13.2.16 Getalwaarde ..... 11
13.2.17 Percentage ..... 11
13.2.18 De dato ..... 11
13.2.19 Datumwaarde ..... 11
13.2.20 Tijdwaarde ..... 11
13.2.21 Dag ..... 11
13.2.22 Maand ..... 12
13.2.23 Jaar. ..... 13
13.2.24 Uur ..... 14
13.2.25 Minuut ..... 15
13.2.26 Seconde ..... 16
13.2.27 Milliseconde ..... 17
13.2.28 Naamwoord ..... 18
13.2.29 Naam ..... 18
13.2.30 Meervoudsvorm ..... 18
13.3 Objecten en parameters ..... 19
13.3.1 Objecttypen ..... 19
13.3.2 Attributen en kenmerken ..... 19
13.3.3 Datatypen ..... 20
13.3.4 Domeinen ..... 22
13.3.5 Eenheden ..... 23
13.3.6 Tijdlijnen ..... 24
13.3.7 Dimensies ..... 24
13.3.8 Parameters ..... 26
13.3.9 Feittypen ..... 26
13.3.10 Dagsoort ..... 27
13.4 RegelSpraak. ..... 28
13.4.1 Onderwerpketen ..... 28
13.4.2 RegeISpraak-regel. ..... 28
13.4.3 Resultaatdeel ..... 30
13.4.4 Gelijkstelling ..... 31
13.4.5 Kenmerktoekenning ..... 31
13.4.6 ObjectCreatie ..... 31
13.4.7 FeitCreatie ..... 32
13.4.8 Consistentieregels ..... 32
13.4.9 Initialisatie ..... 35
13.4.10 Verdeling ..... 35
13.4.11 Dagsoortdefinitie ..... 37
13.4.12 Voorwaardendeel ..... 37
13.4.13 Samengestelde voorwaarde ..... 39
13.4.14 Elementaire voorwaarde ..... 41
13.4.15 Berekening ..... 63
13.4.16 Expressie ..... 64

## Versiebeheer

Onderstaande tabel bevat het overzicht van gepubliceerde versies. In de omschrijving staan de wijzigingen ten opzichte van de vorige versie.

| Versie | Status | Datum | Omschrijving |
| :---: | :---: | :---: | :---: |
| 1.00 | Definitief | 01-05-2023 | Initiële versie. |
| 1.0.1 | Definitief | 16-05-2023 | Aanpassingen t.b.v. publicatie. <br> Namen en informatie over concept-versies en mogelijke toekomstige aanpassingen verwijderd. |
| 1.1.0 | Definitief | 24-10-2023 | - Par. 12.2.13-Enumeratiewaarde als aparte literal expressie toegevoegd in verband met presentatie met enkele aanhalingstekens. <br> - Par. 12.3.3.7 - In getalspecificatie "reëel getal" gewijzigd in "getal". <br> - Par. 12.3.8 - Aanduiding "binair" verwijderd bij feittype. <br> - Par. 12.4.16.2 - Specificatie syntax Concatenatie expressie aangescherpt met gebruik "of". <br> - Par. 12.4.16.21/22/23 - Begrenzingexpressie en expressies voor minimum en maximum begrenzing toegevoegd. |
| 1.2.0 | Definitief | 11-04-2024 | - Specificatie van de expressie renteberekening verwijderd. Deze expressie maakt geen deel meer uit van RegelSpraak. <br> - Par. 12.4.16.14 Machtsverheffenfunctie toegevoegd. <br> - Par 12.4.16.17 Specificatie rekenkundige expressie "absolute waarde van" toegevoegd <br> - 12.4.16.28 Alternatief "de absolute tijdsduur van" toegevoegd. <br> - Par. 12.4.16.40-49 Specificaties syntax van aggregatie gecorrigeerd. |
| 2.0.0 | Definitief | 27-09-2024 | - Groot aantal aanvullingen op de syntax in verband met het toevoegen van tijdsafhankelijk rekenen. |
| 2.1.0 | Definitief | 24-1-2025 | - Par. 13.4.2.11 Mogelijkheid van lidwoord bij naam variabele toegevoegd. <br> - Par 13.4.14.44/45 Mogelijkheid om "heeft" te gebruiken bij rolcheck toegevoegd. |

Tabel 1

## Syntaxdiagrammen

In hoofdstuk 13 van het RegelSpraak specificatie document is de RegelSpraak Syntax formeel vastgelegd met gebruik van de CORBA scripting taal. Om deze formele vastlegging inzichtelijker te maken, is ervoor gekozen om deze in dit document ook weer te geven in syntaxdiagrammen. Bij de opbouw van dit document is daarom gekozen voor het aanhouden van de hoofdstukstructuur en (sub)nummering zoals gebruikt in het RegelSpraak specificatie document.

Voor het genereren van syntaxdiagrammen uit syntax is gebruik gemaakt van de website Railroad Diagram Generator: https://rr.red-dove.com/ui. Deze website kan EBNF syntax omzetten in syntaxdiagrammen en is gebaseerd op de GitHub-pagina https://github.com/GuntherRademacher/rr. Voor de syntaxspecificatie van RegelSpraak is gekozen voor de notatiewijze die de OMG voor de CORBA scripting taal hanteert, waardoor een aantal transformaties nodig was om voor de website bruikbare input te leveren. Deze transformaties staan beschreven in onderstaande tabel. Bij de syntaxdiagrammen van paragraaf 13.3.1 zal ter illustratie de syntax, zoals die in dit document gebruikt wordt, worden weergegeven samen met de gewijzigde input die is ingegeven op de website.

| Symbool | Is vervangen door |
| :--- | :--- |
| $<$ |  |
| $>$ | $($ |
| $\{$ | l |
| $\}$ | $($ |
| $[$ | $) ?$ |
| $]$ | " $\mathrm{n} "$ |
| In | "t" |
| $\backslash t$ |  |

Tabel 1: benodigde transformaties van de syntax voor de generatie van syntaxdiagrammen.
Hoewel syntaxdiagrammen voor velen intuïtiever te lezen zijn dan de syntax zelf is een toelichting van de elementen die voorkomen in een syntaxdiagram van belang om eventuele misverstanden te voorkomen. Een legenda is daarom toegevoegd in onderstaande tabel.

| Symbool/Weergave | Betekenis |
| :---: | :---: |
| $\cdots$ | Begin van het diagram |
| $\rightarrow$ | Eind van het diagram |
| -... | Diagram gaat verder op de volgende regel |
| ...- | Vervolg van het diagram op de vorige regel |
| A) | Element bestaat uit karakter ' A ' |
| A | Element A is op een andere plek gedefinieerd |

Er zijn meerdere keuzemogelijkheden,
waarvan A de default optie is. B of C kan
gekozen worden door deze expliciet te
vermelden

Tabel 2: Legenda syntaxdiagrammen.

### 13.2 Standaard syntax patronen

### 13.2.1 Digit

<digit> ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-07.jpg?height=677&width=215&top_left_y=484&top_left_x=235)

### 13.2.2 Getal

<getal> ::= <geheelgetal> | <decimaalgetal> | <rationeelgetal>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-07.jpg?height=301&width=518&top_left_y=1340&top_left_x=238)

### 13.2.3 Geheel getal

<geheelgetal> ::= ["-"]<digit>+
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-07.jpg?height=215&width=555&top_left_y=1840&top_left_x=234)

### 13.2.4 Decimaal getal

<decimaalgetal> ::= ["-"]<digit>+ "," <digit>+
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-07.jpg?height=223&width=941&top_left_y=2267&top_left_x=232)

### 13.2.5 Rationeel getal

<rationeelgetal> : := <geheelgetal>["_"<geheelgetal>]"/"<geheelgetal>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-08.jpg?height=169&width=1266&top_left_y=378&top_left_x=235)

### 13.2.6 Letter

```
<letter> ::= "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "o"
| "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z" | "A" | "B" | "C" | "D" |
"E"| "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T"
| "U" | "V" | "W" | "X" | "Y" | "Z" | "á" | "à" | "â" | "ä" | "é" | "è" | "ê" | "ë" | "ó" |
```

![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-08.jpg?height=1737&width=75&top_left_y=839&top_left_x=242)

### 13.2.7 Leesteken

<leesteken> ::= "," | "." | "!" | "?" | ":" | ";" | "(" | ")" | "-"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-09.jpg?height=820&width=275&top_left_y=384&top_left_x=231)

### 13.2.8 Karakterreeks

<karakterreeks> : := (<digit> | <letter> | " " | <leesteken> | <unicode>) +
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-09.jpg?height=575&width=569&top_left_y=1414&top_left_x=232)

Let op: zoals hierboven is te zien, kunnen in RegelSpraak Unicode karakters gebruikt worden. Unicode omvat (in 2023) bijna 150 duizend karakters. Deze karakters zijn vanwege de omvang niet volledig uitgewerkt in de syntax specificaties.

### 13.2.9 Lidwoord

<lidwoord> ::= <bepaaldlidwoord> | <onbepaaldlidwoord>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-09.jpg?height=204&width=595&top_left_y=2348&top_left_x=231)

### 13.2.10 Bepaallidwoord

<bepaaldlidwoord> ::= "de" | "het"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-10.jpg?height=195&width=335&top_left_y=385&top_left_x=238)

### 13.2.11 Onbepaaldlidwoord

<onbepaaldlidwoord> ::= "een"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-10.jpg?height=83&width=272&top_left_y=798&top_left_x=235)

### 13.2.13 Waarde

<waarde> ::= <tekstwaarde> | <booleanwaarde> | <getalwaarde> | <dedato>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-10.jpg?height=417&width=546&top_left_y=1125&top_left_x=227)

### 13.2.13 Enumeratiewaarde

<enumeratiewaarde> ::= "'" <karakterreeks> "い"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-10.jpg?height=121&width=692&top_left_y=1753&top_left_x=231)

### 13.2.14 Tekstwaarde

<tekstwaarde> : := "\"" <karakterreeks> "\""
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-10.jpg?height=119&width=701&top_left_y=2025&top_left_x=232)

### 13.2.15 Boolean waarde

<booleanwaarde> ::= ("waar" | "onwaar")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-10.jpg?height=192&width=406&top_left_y=2360&top_left_x=231)

### 13.2.16 Getalwaarde

```
<getalwaarde> : := <getal> [(<eenheidsafkorting>+) | (<eenheidsafkorting>+ "/"
```

<eenheidsafkorting>+)]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-11.jpg?height=215&width=1457&top_left_y=429&top_left_x=231)

### 13.2.17 Percentage

<percentage> ::= <getal> "\%"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-11.jpg?height=98&width=409&top_left_y=859&top_left_x=235)

### 13.2.18 De dato

<dedato> ::= "dd. "<datumwaarde> [<tijdwaarde>]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-11.jpg?height=187&width=932&top_left_y=1180&top_left_x=231)

### 13.2.19 Datumwaarde

<datumwaarde> : := <dag>"-"<maand>"-"<jaar>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-11.jpg?height=115&width=909&top_left_y=1573&top_left_x=237)

### 13.2.20 Tijdwaarde

<tijdwaarde> : := <uur>":"<minuut>":"<seconde>"."<milliseconde>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-11.jpg?height=123&width=1380&top_left_y=1886&top_left_x=235)

### 13.2.21 Dag

<dag> : := "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "24" | "25" | "26" |
"27" | "28" | "29" | "30" | "31"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-12.jpg?height=2080&width=233&top_left_y=296&top_left_x=232)
13.2.22 Maand
<maand> : := "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-13.jpg?height=1112&width=307&top_left_y=249&top_left_x=235)

### 13.2.23 Jaar

<jaar> ::= ("0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9") ("0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9") ("0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9") ("0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-14.jpg?height=1152&width=1046&top_left_y=292&top_left_x=231)
13.2.24 Uur
<uur> : : = "00" | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-15.jpg?height=2132&width=292&top_left_y=299&top_left_x=237)
13.2.25 Minuut
<minuut> : := ("0" | "1" | "2" | "3" | "4" | "5") ("0" | "1" | "2" | "3" | "4" | "5" | "6" |
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-16.jpg?height=1144&width=575&top_left_y=296&top_left_x=238)

### 13.2.26 Seconde

<seconde> ::= ("0" | "1" | "2" | "3" | "4" | "5") ("0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-17.jpg?height=1149&width=577&top_left_y=294&top_left_x=237)

### 13.2.27 Milliseconde

<milliseconde> : := ("0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9") ("0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9") ("0" | "1" | "2" | "3" | "4" | "5" | "6" | "7"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-18.jpg?height=1106&width=787&top_left_y=292&top_left_x=229)
13.2.28 Naamwoord
<naamwoord> : := [<bepaaldlidwoord>] <naam> ["(mv:" <meervoudsvorm> ")"]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-18.jpg?height=187&width=1454&top_left_y=1557&top_left_x=227)

### 13.2.29 Naam

<naam> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-18.jpg?height=107&width=457&top_left_y=1957&top_left_x=237)

### 13.2.30 Meervoudsvorm

<meervoudsvorm> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-18.jpg?height=119&width=467&top_left_y=2282&top_left_x=229)

### 13.3 Objecten en parameters

### 13.3.1 Objecttypen

### 13.3.1.1 Objecttypedefinitie

<objecttypedefinitie> ::= "Objecttype" <naamwoord> ["(bezield)"] \n ((<koptekst> | <kenmerk> | <attribuut>) \n) +
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-19.jpg?height=347&width=1577&top_left_y=563&top_left_x=228)
13.3.1.2 Objecttype met lidwoord
<objecttypemetlidwoord> ::= <bepaaldlidwoord> <objecttypenaam>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-19.jpg?height=110&width=809&top_left_y=1096&top_left_x=235)
13.3.1.3 Objecttypenaam
<objecttypenaam> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-19.jpg?height=103&width=421&top_left_y=1399&top_left_x=235)

### 13.3.1.4 Koptekst

<koptekst> : := "---" <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-19.jpg?height=107&width=549&top_left_y=1694&top_left_x=231)

### 13.3.2 Attributen en kenmerken

### 13.3.2.1 Kenmerk

<kenmerk> : := ((<naamwoord> "kenmerk") | <bezittelijkkenmerk> | <bijvoeglijkkenmerk>)";"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-19.jpg?height=298&width=787&top_left_y=2075&top_left_x=229)

### 13.3.2.2 Bezittelijk kenmerk

<bezittelijkkenmerk> ::= <naamwoord> "kenmerk (bezittelijk)"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-20.jpg?height=101&width=806&top_left_y=298&top_left_x=237)
13.3.2.3 Bijvoeglijk kenmerk
<bijvoeglijkkenmerk> ::= "is" <naam> ["(mv: " <meervoudsvorm> ")"] "kenmerk (bijvoeglijk)"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-20.jpg?height=167&width=1511&top_left_y=593&top_left_x=238)

### 13.3.2.4 Kenmerknaam

<kenmerknaam> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-20.jpg?height=106&width=455&top_left_y=958&top_left_x=235)

### 13.3.2.5 Attribuut

<attribuut> : := <naamwoord> \t (<datatype> | <domeinnaam>) ["gedimensioneerd met" <dimensienaam>] ";"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-20.jpg?height=192&width=1600&top_left_y=1289&top_left_x=228)

### 13.3.2.6 Attribuut met lidwoord

<attribuutmetlidwoord> ::= [<bepaaldlidwoord>] <attribuutnaam>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-20.jpg?height=207&width=947&top_left_y=1664&top_left_x=229)

### 13.3.2.7 Attribuutnaam

<attribuutnaam> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-20.jpg?height=112&width=449&top_left_y=2057&top_left_x=238)

### 13.3.3 Datatypen

### 13.3.3.1 Datatype

<datatype> ::= <numeriekdatatype> | <percentagedatatype> | <tekstdatatype> | <booleandatatype> | <datumtijddatatype>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-21.jpg?height=583&width=663&top_left_y=288&top_left_x=234)

### 13.3.3.2 Numeriek datatype

<numeriekdatatype> ::= "Numeriek (" <getalspecificatie> ")" ["met eenheid" [(<eenheidmacht>+ | "1") "/"] (<eenheidmacht>+)]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-21.jpg?height=235&width=1598&top_left_y=1079&top_left_x=229)
13.3.3.3 Percentage datatype
<percentagedatatype> ::= "Percentage (" <getalspecificatie> ")" ["met eenheid \%" ["/" <eenheidsafkorting>]]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-21.jpg?height=229&width=1609&top_left_y=1530&top_left_x=229)

### 13.3.3.4 Tekst datatype

<tekstdatatype> ::= "Tekst"

Tekst

### 13.3.3.5 Boolean datatype

<booleandatatype> ::= "Boolean"

## Boolean

### 13.3.3.6 Datum-tijd datatype

<datumtijddatatype> ::= "Datum in dagen" | "Datum en tijd in millisecondes"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-22.jpg?height=221&width=863&top_left_y=295&top_left_x=234)

### 13.3.3.7 Getalspecificatie

<getalspecificatie> : := ["negatief" | "niet-negatief" | "positief"] ("geheel getal" | "getal met " <aantaldecimalen> " decimalen" | "getal")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-22.jpg?height=432&width=1606&top_left_y=778&top_left_x=228)
13.3.3.8 Aantal decimalen
<aantaldecimalen> ::= <positiefgeheelgetal>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-22.jpg?height=122&width=541&top_left_y=1401&top_left_x=232)

### 13.3.4 Domeinen

### 13.3.4.1 Domeindefinitie

<domeindefinitie> : := "Domein" <domeinnaam> "is van het type" (<datatype> |
<enumeratiespecificatie>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-22.jpg?height=235&width=1602&top_left_y=1824&top_left_x=227)
13.3.4.2 Enumeratiespecificatie
<enumeratiespecificatie> : := "Enumeratie" \n (\t <enumeratiewaarde> \n)+
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-22.jpg?height=167&width=1383&top_left_y=2235&top_left_x=228)

### 13.3.4.3 Domeinnaam

<domeinnaam> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-23.jpg?height=107&width=453&top_left_y=255&top_left_x=239)
13.3.4.4 Enumeratiewaarde
<enumeratiewaarde> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-23.jpg?height=98&width=449&top_left_y=559&top_left_x=238)

### 13.3.5 Eenheden

### 13.3.5.1 Eenheidsysteem

<eenheidsysteem> : := "Eenheidsysteem" <eenheidsysteemnaam>
(\n <naamwoord> <eenheidsafkorting> [<omrekenspecificatie>]) +
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-23.jpg?height=155&width=1588&top_left_y=973&top_left_x=234)

### 13.3.5.2 Omrekenspecificatie

<omrekenspecificatie> ::= "=" ["1/"]<geheelgetal> <eenheidsafkorting>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-23.jpg?height=204&width=1209&top_left_y=1320&top_left_x=229)

### 13.3.5.3 Eenheidsysteemnaam

<eenheidsysteemnaam> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-23.jpg?height=113&width=458&top_left_y=1714&top_left_x=234)

### 13.3.5.4 Eenheidsafkorting

<eenheidsafkorting> : := <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-23.jpg?height=104&width=455&top_left_y=2021&top_left_x=235)

### 13.3.5.5 Eenheidmacht

<eenheidmacht> ::= <eenheidsafkorting>[^ (<exponent>)]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-23.jpg?height=229&width=1075&top_left_y=2310&top_left_x=228)

### 13.3.5.6 Exponent

<exponent> ::= <geheelgetal>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-24.jpg?height=104&width=396&top_left_y=368&top_left_x=236)

### 13.3.6 Tijdlijnen

### 13.3.6.1 Tijdlijn

<tijdlijn> : := "voor" ("elke dag" | "elke maand" | "elk jaar")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-24.jpg?height=341&width=724&top_left_y=749&top_left_x=232)

### 13.3.7 Dimensies

### 13.3.7.1 Dimensie

<dimensie> : := "Dimensie" <bepaaldlidwoord> <dimensienaam> ", bestaande uit de " <dimensienaammeervoud> <voorzetselspecificatie> \n (<labelwaardespecificatie> \n)+
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-24.jpg?height=216&width=1594&top_left_y=1360&top_left_x=231)

### 13.3.7.2 Voorzetselspecificatie

<voorzetselspecificatie> : := (" (na het attribuut met voorzetsel" ( "van" | "in" | "voor" | "over" | "op" | "bij" | "uit" ) "):" | "(voor het attribuut zonder voorzetsel):")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-25.jpg?height=921&width=1312&top_left_y=245&top_left_x=235)

### 13.3.7.3 Dimensienaam

<dimensienaam> : := <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-25.jpg?height=80&width=416&top_left_y=1362&top_left_x=243)
13.3.7.4 Dimensienaam meervoud
<dimensienaammeervoud> : := <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-25.jpg?height=83&width=415&top_left_y=1666&top_left_x=244)

### 13.3.7.5 Labelwaardespecificatie

<labelwaardespecificatie> ::= <digit>+". " <dimensiewaarde>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-25.jpg?height=147&width=901&top_left_y=1954&top_left_x=235)

### 13.3.7.6 Dimensiewaarde

<dimensiewaarde> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-25.jpg?height=109&width=452&top_left_y=2304&top_left_x=237)

### 13.3.8 Parameters

13.3.7.1 Parameterdefinitie
<parameterdefinitie> ::= "Parameter" <parametermetlidwoord> ":" (<datatype> | <domeinnaam>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-26.jpg?height=232&width=1428&top_left_y=455&top_left_x=234)

### 13.3.8.2 Parameter met lidwoord

<parametermetlidwoord> : := <bepaaldlidwoord> <parameternaam>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-26.jpg?height=109&width=849&top_left_y=868&top_left_x=244)

### 13.3.8.3 Parameternaam

<parameternaam> ::= <karakterreeks>

## karakterreeks

### 13.3.9 Feittypen

### 13.3.9.1 Feittype definitie

<feittypedefinitie> : := "Feittype" <feittypenaam> \n [<bepaaldlidwoord>] <rolnaam> ["(mv: " <meervoudrolnaam> ")"] \t <objecttypenaam> \n [<bepaaldlidwoord>] <rolnaam> [" (mv: " <meervoudrolnaam> ")"] \t <objecttypenaam> \n ("één" <rolnaam> | "meerdere" <meervoudrolnaam>) <relatiebeschrijving> ("één" <rolnaam> | "meerdere" <meervoudrolnaam>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-26.jpg?height=662&width=1599&top_left_y=1694&top_left_x=228)

### 13.3.9.2 Wederkerig feittype definitie

<wederkerigfeittypedefinitie> ::= "Wederkerig feittype" <feittypenaam> \n [<bepaaldlidwoord>]
<rolnaam> ["(mv: " <meervoudrolnaam> ")"] \t <objecttypenaam> \n (("één" <rolnaam>
<relatiebeschrijving> "één" <rolnaam>) | ("meerdere" <rolnaam> <relatiebeschrijving>
"meerdere" <rolnaam>))
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-27.jpg?height=295&width=1586&top_left_y=349&top_left_x=241)

### 13.3.9.3 Feittypenaam

<feittypenaam> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-27.jpg?height=107&width=449&top_left_y=843&top_left_x=238)

### 13.3.9.4 Rolnaam

<rolnaam> : := <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-27.jpg?height=113&width=458&top_left_y=1137&top_left_x=234)

### 13.3.9.5 Meervoudrolnaam

<meervoudrolnaam> : := <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-27.jpg?height=108&width=451&top_left_y=1445&top_left_x=240)

### 13.3.9.6 Relatiebeschrijving

<relatiebeschrijving> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-27.jpg?height=110&width=458&top_left_y=1758&top_left_x=234)

### 13.3.10 Dagsoort

### 13.3.10.1 Dagsoort

<dagsoort> ::= "Dagsoort" <naamwoord>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-27.jpg?height=112&width=678&top_left_y=2143&top_left_x=232)
13.3.10.2 Dagsoortnaam
<dagsoortnaam> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-27.jpg?height=95&width=455&top_left_y=2454&top_left_x=235)

### 13.4 RegelSpraak

### 13.4.1 Onderwerpketen

### 13.4.1.1 Onderwerpketen

<onderwerpketen> : := ((<lidwoord> | "zijn") (<objecttypenaam> | <rolnaam> | <kenmerknaam>)) | ((<selector> "van" <onderwerpketen>) | <subselectie>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-28.jpg?height=575&width=1052&top_left_y=558&top_left_x=228)

### 13.4.2 RegelSpraak-regel

### 13.4.2.1 Regel

<regel> ::= "Regel" <regelnaam> (\n <regelversie>)+
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-28.jpg?height=150&width=1149&top_left_y=1404&top_left_x=231)

### 13.4.2.2 RegeInaam

<regelnaam> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-28.jpg?height=113&width=458&top_left_y=1748&top_left_x=234)

### 13.4.2.3 Regelversie

<regelversie> ::= <versie> \n <regelspraakregel>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-28.jpg?height=121&width=861&top_left_y=2047&top_left_x=232)

### 13.4.2.4 Versie

<versie> ::= "geldig" <versiegeldigheid>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-28.jpg?height=115&width=707&top_left_y=2355&top_left_x=232)

### 13.4.2.5 Versiegeldigheid

<versiegeldigheid> ::= "altijd" | ("vanaf " (<datumwaarde> | <jaar>) ["t/m " (<datumwaarde> | <jaar>)]) | ("t/m " (<datumwaarde> | <jaar>))
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-29.jpg?height=490&width=1594&top_left_y=309&top_left_x=234)

### 13.4.2.6 RegelSpraakregel

<regelSpraakregel> ::= <resultaatdeel> \n [<voorwaardendeel>] "." [<variabelendeel>]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-29.jpg?height=192&width=1592&top_left_y=989&top_left_x=232)

### 13.4.2.7 Selector

<selector> ::= [<lidwoord>] <rolnaam>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-29.jpg?height=226&width=1018&top_left_y=1372&top_left_x=239)

### 13.4.2.8 Subselectie

<subselectie> ::= <onderwerpketen> ("die" | "dat") <predicaat>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-29.jpg?height=221&width=1026&top_left_y=1791&top_left_x=235)
13.4.2.9 Attribuut van onderwerp
<attribuutvanonderwerp> : := [<kwantificatie>] <attribuutmetlidwoord> "van" <onderwerpketen>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-29.jpg?height=192&width=1488&top_left_y=2211&top_left_x=227)

### 13.4.2.10 Variabelendeel

<variabelendeel> ::= "Daarbij geldt:" (\n \t <variabeleonderdeel>)* "."
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-30.jpg?height=206&width=1503&top_left_y=291&top_left_x=228)
13.4.2.11 Variabele onderdeel
<variabeleonderdeel> ::= [ <bepaaldlidwoord> ] <variabelenaam> "is" <expressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-30.jpg?height=207&width=1346&top_left_y=679&top_left_x=229)

### 13.4.2.12 Variabelenaam

<variabelenaam> ::= <karakterreeks>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-30.jpg?height=112&width=449&top_left_y=1075&top_left_x=238)

### 13.4.3 Resultaatdeel

### 13.4.3.1 Resultaatdeel

<resultaatdeel> ::= <gelijkstelling> | <kenmerktoekenning> | <objectcreatie> | <feitcreatie> | <consistentieregel> | <initialisatie> | <verdeling> | <dagsoortdefinitie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-30.jpg?height=915&width=661&top_left_y=1496&top_left_x=235)

### 13.4.4 Gelijkstelling

13.4.4.1 Gelijkstelling
<gelijkstelling> : := (<gelijkstellingtoekenning> | <gelijkstellingberekening>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-31.jpg?height=232&width=726&top_left_y=455&top_left_x=231)
13.4.4.2 Gelijkstellingtoekenning <gelijkstellingtoekenning> : := <attribuutvanonderwerp> "moet gesteld worden op" <expressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-31.jpg?height=115&width=1394&top_left_y=865&top_left_x=237)

### 13.4.4.3 Gelijkstellingberekening

<gelijkstellingberekening> ::= <attribuutvanonderwerp> "moet berekend worden als" (<getalexpressie> | <datumexpressie>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-31.jpg?height=218&width=1588&top_left_y=1207&top_left_x=237)

### 13.4.5 Kenmerktoekenning

### 13.4.5.1 Kenmerktoekenning

<kenmerktoekenning> ::= <onderwerpketen> ("is" | "heeft") ["een"] <kenmerknaam>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-31.jpg?height=213&width=1397&top_left_y=1704&top_left_x=238)

### 13.4.6 ObjectCreatie

### 13.4.6.1 Objectcreatie

<objectcreatie> : := "Een" <onderwerpketen> "heeft een" <rolnaam> [ "met" <waardetoekenning> [("," <waardetoekenning>) * "en" <waardetoekenning>] ]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-31.jpg?height=329&width=1586&top_left_y=2234&top_left_x=241)
13.4.6.2 Waarde toekenning
<waardetoekenning> ::= <attribuutwaardetoekenning> | <kenmerkwaardetoekenning>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-32.jpg?height=221&width=777&top_left_y=369&top_left_x=237)
13.4.6.3 Attribuutwaarde toekenning
<attribuutwaardetoekenning> ::= <attribuut> "gelijk aan" <expressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-32.jpg?height=123&width=909&top_left_y=738&top_left_x=231)
13.4.6.4 Kenmerkwaarde toekenning
<kenmerkwaardetoekenning> : := <kenmerknaam> "gelijk aan" ("waar" | "onwaar")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-32.jpg?height=227&width=1072&top_left_y=1000&top_left_x=235)

### 13.4.7 FeitCreatie

### 13.4.7.1 Feitcreatie

<feitcreatie> : := "Een" <rolnaam> "van een" <onderwerpketen> "is een" <rolnaam> "van een" <onderwerpketen>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-32.jpg?height=90&width=1597&top_left_y=1537&top_left_x=235)

### 13.4.8 Consistentieregels

### 13.4.8.1 Consistentieregel

<consistentieregel> ::= <enkelvoudigeconsistentieregel | <toplevelsamengesteldcriterium> |
<uniciteitscontrole>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-32.jpg?height=357&width=855&top_left_y=1926&top_left_x=218)
13.4.8.2 Enkelvoudige consistentieregel
<enkelvoudigeconsistentieregel> : := <getalconsistentie> | <datumconsistentie> | <tekstconsistentie> | <objectconsistentie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-33.jpg?height=469&width=640&top_left_y=288&top_left_x=231)

### 13.4.8.3 Getalconsistentie

<getalconsistentie> ::= <getalexpressie> "moet"
(<topleveleenzijdigegetalvergelijkingsoperatormeervoud> |
<topleveltweezijdigegetalvergelijkingsoperatormeervoud>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-33.jpg?height=210&width=1600&top_left_y=1000&top_left_x=234)

### 13.4.8.4 Datumconsistentie

<datumconsistentie> ::= <datumexpressie> "moet"
(<topleveleenzijdigedatumvergelijkingsoperatormeervoud> |
<topleveltweezijdigedatumvergelijkingsoperatormeervoud>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-33.jpg?height=206&width=1594&top_left_y=1459&top_left_x=237)

### 13.4.8.5 Tekstconsistentie

<tekstconsistentie> : := <tekstexpressie> "moet"
(<topleveleenzijdigetekstvergelijkingsoperatormeervoud> )
topleveltweezijdigetekstvergelijkingsoperatormeervoud>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-33.jpg?height=212&width=1597&top_left_y=1916&top_left_x=235)

### 13.4.8.6 Objectconsistentie

<objectconsistentie> : := <objectexpressie> "moet"
(<topleveleenzijdigeobjectvergelijkingsoperatormeervoud> |
<topleveltweezijdigeobjectvergelijkingsoperatormeervoud>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-33.jpg?height=209&width=1597&top_left_y=2374&top_left_x=235)

### 13.4.8.7 Toplevel samengesteld criterium

<toplevelsamengesteldcriterium> : := "er moet worden voldaan aan" ("het volgende criterium:" |
(<consistentiekwantificatie> "volgende criteria:") <samengesteldcriteriumonderdeel>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-34.jpg?height=204&width=1588&top_left_y=406&top_left_x=237)
13.4.8.8 Samengesteld criterium onderdeel
<samengesteldcriteriumonderdeel> ::= \n \t <genestcriterium> (\n <genestcriterium>) +
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-34.jpg?height=164&width=1392&top_left_y=795&top_left_x=229)
13.4.8.9 Genest criterium
<genestcriterium> : := ("•") + (<voorwaardevergelijking> | <samengesteldcriterium>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-34.jpg?height=272&width=946&top_left_y=1143&top_left_x=235)

### 13.4.8.10 Samengesteld criterium

<samengesteldcriterium> : := "er wordt voldaan aan" ("het volgende criterium:" | (<consistentiekwantificatie> "volgende criteria:") <samengesteldcriteriumonderdeel>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-34.jpg?height=233&width=1595&top_left_y=1634&top_left_x=233)

### 13.4.8.11 Uniciteitscontrole

<uniciteitscontrole> : := (<alleattribuutvanonderwerp> | <uniciteitconcatenatie>) <vereniging>* "moeten uniek zijn."
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-34.jpg?height=321&width=1583&top_left_y=2081&top_left_x=228)

### 13.4.8.12 Vereniging

<vereniging> ::= "verenigd met" (<alleattribuutvanonderwerp> | <uniciteitconcatenatie>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-35.jpg?height=238&width=1108&top_left_y=292&top_left_x=237)
13.4.8.13 Alle attribuut van onderwerp
<alleattribuutvanonderwerp> : : = "de" <meervoudsvorm> "van alle" (<objecttypenaam> | <rolnaam>) "van" <onderwerpketen>) ["van" <onderwerpketen>]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-35.jpg?height=141&width=1594&top_left_y=746&top_left_x=234)

### 13.4.8.14 Uniciteitsconcatenatie

<uniciteitconcatenatie> ::= "de concatenatie van" <meervoudsvorm> ("," <meervoudsvorm>)* "en" <meervoudsvorm> "van alle" ((<objecttypenaam> | <rolnaam>) "van" <onderwerpketen>) ["van" <onderwerpketen>]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-35.jpg?height=407&width=1594&top_left_y=1147&top_left_x=234)

### 13.4.9 Initialisatie

### 13.4.9.1 Initialisatie

<initialisatie> : := <attribuutvanonderwerp> "moet geïnitialiseerd worden op" <expressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-35.jpg?height=115&width=1523&top_left_y=1824&top_left_x=232)

### 13.4.10 Verdeling

Opmerkingen:

* Als <maximumaanspraak> of <verdeelafronding> worden gebruikt, dan is <onverdeelderest> verplicht.
* <maximumaanspraak> kan alleen worden gebruikt als <verdelenzondergroepen> of <criteriumbijgelijkevolgorde> gelijk zijn aan "naar rato van".


### 13.4.10.1 Verdeling

<verdeling> : := <attribuutvanonderwerp> "wordt verdeeld over" <attribuutvanonderwerp> ", waarbij wordt verdeeld" (<verdelenzondergroepen> | <meervoudigcriterium>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-36.jpg?height=307&width=1586&top_left_y=249&top_left_x=238)
13.4.10.2 Verdelen zonder groepen
<verdelenzondergroepen> ::= "in gelijke delen" | ("naar rato van" <attribuutmetlidwoord>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-36.jpg?height=229&width=1021&top_left_y=748&top_left_x=232)

### 13.4.10.3 Meervoudig criterium

<meervoudigcriterium> ::= ":" \n (<verdelenovergroepen> | (<verdelenzondergroepen> ",")) [\n <maximumaanspraak>] [\n <veldeelafronding>] [\n <onverdeelderest>]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-36.jpg?height=302&width=1590&top_left_y=1205&top_left_x=235)
13.4.10.4 Verdelen over groepen
<verdelenovergroepen> ::= "- op volgorde van" (afnemende | toenemende) <attribuutmetlidwoord> \n <criteriumbijgelijkevolgorde> ","
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-36.jpg?height=172&width=1594&top_left_y=1733&top_left_x=234)

### 13.4.10.5 Criterium bij gelijke volgorde

<criteriumbijgelijkevolgorde> ::= "- bij even groot criterium" ("in gelijke delen" | ("naar rato van" <attribuutmetlidwoord>)) ","
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-36.jpg?height=224&width=1592&top_left_y=2121&top_left_x=232)

### 13.4.10.6 Maximum aanspraak

<maximumaanspraak> : := "- met een maximum van" <attribuutmetlidwoord> ","
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-37.jpg?height=119&width=1221&top_left_y=246&top_left_x=235)
13.4.10.7 Verdeelafronding <verdeelafronding> : := "- afgerond op" <geheelgetal> "decimalen naar beneden."
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-37.jpg?height=113&width=1286&top_left_y=546&top_left_x=248)

### 13.4.10.8 Onverdeelde rest

<onverdeelderest> ::= "Als onverdeelde rest blijft" <attribuutvanonderwerp> "over."
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-37.jpg?height=115&width=1354&top_left_y=862&top_left_x=237)

### 13.4.11 Dagsoortdefinitie

13.4.11.1 Dagsoortdefinitie
<dagsoortdefinitie> ::= "Een dag is een" <dagsoortnaam>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-37.jpg?height=106&width=807&top_left_y=1249&top_left_x=239)

### 13.4.12 Voorwaardendee

### 13.4.12.1 Voorwaardendeel

<voorwaardendeel> ::= "indien" (<toplevelelementairevoorwaarde> | <toplevelsamengesteldevoorwaarde>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-37.jpg?height=238&width=1124&top_left_y=1660&top_left_x=232)

### 13.4.12.2 Predicaat

<predicaat> : := <elementairpredicaat> | <samengesteldpredicaat>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-37.jpg?height=218&width=720&top_left_y=2095&top_left_x=234)
13.4.12.3 Elementair predicaat
<elementairpredicaat> ::= <getalpredicaat> | <tekstpredicaat> | <datumpredicaat> | <objectpredicaat>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-38.jpg?height=461&width=592&top_left_y=295&top_left_x=229)
13.4.12.4 Samengesteld predicaat
<samengesteldpredicaat> ::= "aan" <kwantificatie> "volgende voorwaarde"["n"]" voldoen:" (<samengesteldevoorwaardeonderdeel> | <toplevelvoorwaardevergelijking>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-38.jpg?height=172&width=1602&top_left_y=968&top_left_x=227)

### 13.4.12.5 Getalpredicaat

<getalpredicaat> ::= <topleveltweezijdigegetalvergelijkingsoperatormeervoud> <getalexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-38.jpg?height=113&width=1494&top_left_y=1320&top_left_x=235)
13.4.12.6 Tekstpredicaat
<tekstpredicaat> : := <topleveltweezijdigetekstvergelijkingsoperatormeervoud> <tekstexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-38.jpg?height=106&width=1506&top_left_y=1626&top_left_x=235)

### 13.4.12.7 Datumpredicaat

<datumpredicaat> ::= <topleveltweezijdigedatumvergelijkingsoperatormeervoud> <datumexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-38.jpg?height=123&width=1543&top_left_y=1926&top_left_x=231)

### 13.4.12.8 Objectpredicaat

<objectpredicaat> : := <topleveltweezijdigeobjectvergelijkingsoperatormeervoud> <objectexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-38.jpg?height=109&width=1535&top_left_y=2267&top_left_x=232)

### 13.4.13 Samengestelde voorwaarde

13.4.13.1 Toplevel samengestelde voorwaarde
<toplevelsamengesteldevoorwaarde> ::= (<objectexpressie> | <referentie> | <aggregatie> | "er") "aan" <voorwaardekwantificatie> "volgende voorwaarde"["n"] ("voldoet" | "voldoen" | "wordt voldaan") ":" <samengesteldevoorwaardeonderdeel>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-39.jpg?height=407&width=1596&top_left_y=516&top_left_x=230)

### 13.4.13.2 Geneste samengestelde voorwaarde

<genestesamengesteldevoorwaarde> ::= (<objectexpressie> | <referentie> | <aggregatie> | "er") ("voldoet" | "voldoen" | "wordt voldaan") "aan" <voorwaardekwantificatie> "volgende voorwaarde"["n"]":" <samengesteldevoorwaardeonderdeel>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-39.jpg?height=289&width=1594&top_left_y=1175&top_left_x=234)
13.4.13.3 Consistentiekwantificatie
<consistentiekwantificatie> : := "alle" | "geen van de" | ("ten minste" | "ten hoogste" | "precies") (<getal> | "één" | "twee" | "drie" | "vier") "van de")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-39.jpg?height=743&width=1069&top_left_y=1793&top_left_x=225)

### 13.4.13.4 Voorwaardekwantificatie

<voorwaardekwantificatie> : := "de" | "alle" | "geen van de" | (("ten minste" | "ten hoogste" | "precies") (<getal> | "één" | "twee" | "drie" | "vier") "van de")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-40.jpg?height=841&width=1052&top_left_y=396&top_left_x=231)

### 13.4.13.5 Kwantificatie

<kwantificatie> : := "de" | "alle" | "al" | "geen van de" | (("ten minste" | "ten hoogste" | "precies") (<getal> | "één" | "twee" | "drie" | "vier") "van de")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-40.jpg?height=952&width=1075&top_left_y=1449&top_left_x=228)
13.4.13.6 Samengestelde voorwaarde onderdeel
<samengesteldevoorwaardeonderdeel> : := \n \t <genestevoorwaarde> (\n <genestevoorwaarde>) +
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-41.jpg?height=170&width=1528&top_left_y=286&top_left_x=227)
13.4.13.7 Geneste voorwaarde
<genestevoorwaarde> ::= ("•")+ (<elementairevoorwaarde> | <genestesamengesteldevoorwaarde>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-41.jpg?height=281&width=1143&top_left_y=636&top_left_x=231)

### 13.4.14 Elementaire voorwaarde

13.4.14.1 Toplevel elementaire voorwaarde
<toplevelelementairevoorwaarde> ::= <toplevelvoorwaardevergelijking> | <consistentievoorwaarde>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-41.jpg?height=222&width=813&top_left_y=1217&top_left_x=233)
13.4.14.2 Toplevel voorwaardevergelijking
<toplevelvoorwaardevergelijking> : := <toplevelgetalvergelijking> |
<toplevelobjectvergelijking> | <topleveltekstvergelijking> | <topleveldatumvergelijking> | <toplevelbooleanvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-41.jpg?height=536&width=729&top_left_y=1682&top_left_x=227)
13.4.14.3 Toplevel getalvergelijking
<toplevelgetalvergelijking> : := <topleveleenzijdigegetalvergelijking> | <topleveltweezijdigegetalvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-42.jpg?height=245&width=935&top_left_y=286&top_left_x=232)
13.4.14.4 Toplevel eenzijdige getalvergelijking
<topleveleenzijdigegetalvergelijking> ::= <getalexpressie>
<topleveleenzijdigegetalvergelijkingsoperator>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-42.jpg?height=121&width=1308&top_left_y=739&top_left_x=237)
13.4.14.5 Toplevel tweezijdige getalvergelijking
<topleveltweezijdigegetalvergelijking> ::= <getalexpressie>
<topleveltweezijdigegetalvergelijkingsoperator> <getalexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-42.jpg?height=104&width=1586&top_left_y=1079&top_left_x=235)

### 13.4.14.6 Toplevel datumvergelijking

<topleveldatumvergelijking> ::= <topleveleenzijdigedatumvergelijking> |
<topleveltweezijdigedatumvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-42.jpg?height=235&width=966&top_left_y=1410&top_left_x=225)
13.4.14.7 Toplevel eenzijdige datumvergelijking
<topleveleenzijdigedatumvergelijking> : := <datumexpressie>
<topleveleenzijdigedatumvergelijkingsoperator>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-42.jpg?height=126&width=1360&top_left_y=1850&top_left_x=231)
13.4.14.8 Toplevel tweezijdige datumvergelijking
<topleveltweezijdigedatumvergelijking> : := <datumexpressie>
<topleveltweezijdigedatumvergelijkingsoperator> <datumexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-42.jpg?height=98&width=1588&top_left_y=2201&top_left_x=237)
13.4.14.9 Toplevel tekstvergelijking
<topleveltekstvergelijking> : := <topleveleenzijdigetekstvergelijking> |
<topleveltweezijdigetekstvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-43.jpg?height=238&width=935&top_left_y=292&top_left_x=229)
13.4.14.10 Toplevel eenzijdige tekstvergelijking
<topleveleenzijdigetekstvergelijking> ::= <tekstexpressie>
<topleveleenzijdigetekstvergelijkingsoperator>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-43.jpg?height=123&width=1312&top_left_y=738&top_left_x=235)
13.4.14.11 Toplevel tweezijdige tekstvergelijking
<topleveltweezijdigetekstvergelijking> : := <tekstexpressie>
<topleveltweezijdigetekstvergelijkingsoperator> <tekstexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-43.jpg?height=104&width=1592&top_left_y=1082&top_left_x=232)

### 13.4.14.12 Toplevel booleanvergelijking

<toplevelbooleanvergelijking> ::= <topleveleenzijdigebooleanvergelijking> |
<topleveltweezijdigebooleanvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-43.jpg?height=226&width=986&top_left_y=1412&top_left_x=227)
13.4.14.13 Toplevel eenzijdige booleanvergelijking
<topleveleenzijdigebooleanvergelijking> ::= <booleanexpressie>
<topleveleenzijdigebooleanvergelijkingsoperator>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-43.jpg?height=124&width=1409&top_left_y=1851&top_left_x=232)
13.4.14.14 Toplevel tweezijdige booleanvergelijking
<topleveltweezijdigebooleanvergelijking> ::= <booleanexpressie>
<topleveltweezijdigebooleanvergelijkingsoperator> <booleanexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-43.jpg?height=92&width=1586&top_left_y=2207&top_left_x=235)
13.4.14.15 Toplevel objectvergelijking
<toplevelobjectvergelijking> : := <topleveleenzijdigeobjectvergelijking> |
<topleveltweezijdigeobjectvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-44.jpg?height=238&width=964&top_left_y=292&top_left_x=232)
13.4.14.16 Toplevel eenzijdige objectvergelijking
<topleveleenzijdigeobjectvergelijking> ::= <objectexpressie>
<topleveleenzijdigeobjectvergelijkingsoperator>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-44.jpg?height=121&width=1343&top_left_y=739&top_left_x=231)
13.4.14.17 Toplevel tweezijdige objectvergelijking
<topleveltweezijdigeobjectvergelijking> : := (<objectexpressie> | <referentie>) <topleveltweezijdigeobjectvergelijkingsoperator> <objectexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-44.jpg?height=209&width=1612&top_left_y=1072&top_left_x=225)

### 13.4.14.18 Consistentievoorwaarde

<consistentievoorwaarde> ::= "regelversie" <karakterreeks> "is" ("gevuurd" | "inconsistent")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-44.jpg?height=238&width=1314&top_left_y=1463&top_left_x=231)
13.4.14.19 Toplevel eenzijdige getalvergelijkingsoperator
<topleveleenzijdigegetalvergelijkingsoperator> ::=
<topleveleenzijdigegetalvergelijkingsoperatorenkelvoud> |
<topleveleenzijdigegetalvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-44.jpg?height=235&width=1257&top_left_y=1958&top_left_x=225)
13.4.14.20 Toplevel eenzijdige getalvergelijkingsoperator enkelvoud <topleveleenzijdigegetalvergelijkingsoperatorenkelvoud> ::= [<geheleperiodevergelijking>] ("leeg is" | "gevuld is" | "aan de elfproef voldoet")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-45.jpg?height=347&width=1383&top_left_y=295&top_left_x=234)
13.4.14.21 Toplevel eenzijdige getalvergelijkingsoperator meervoud
<topleveleenzijdigegetalvergelijkingsoperatormeervoud> ::= [<geheleperiodevergelijking>]
("leeg zijn" | "gevuld zijn" | "aan de elfproef voldoen")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-45.jpg?height=364&width=1395&top_left_y=846&top_left_x=222)
13.4.14.22 Toplevel tweezijdige getalvergelijkingsoperator <topleveltweezijdigegetalvergelijkingsoperator> : := <toplevel tweezijdigegetalvergelijkingsoperatorenkelvoud> | <topleveltweezijdigegetalvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-45.jpg?height=192&width=954&top_left_y=1452&top_left_x=234)
13.4.14.23 Toplevel tweezijdige getalvergelijkingsoperator enkelvoud
<topleveltweezijdigegetalvergelijkingsoperatorenkelvoud> ::= [<geheleperiodevergelijking>] ("gelijk is aan" | "ongelijk is aan" | "groter is dan" | "groter of gelijk is aan" | "kleiner of gelijk is aan" | "kleiner is dan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-46.jpg?height=695&width=1357&top_left_y=246&top_left_x=235)
13.4.14.24 Toplevel tweezijdige getalvergelijkingsoperator meervoud
<topleveltweezijdigegetalvergelijkingsoperatormeervoud> ::= [<geheleperiodevergelijking>]
("gelijk zijn aan" | "ongelijk zijn aan" | "groter zijn dan" | "groter of gelijk zijn aan" |
"kleiner of gelijk zijn aan" | "kleiner zijn dan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-46.jpg?height=689&width=1380&top_left_y=1186&top_left_x=241)
13.4.14.25 Toplevel eenzijdige datumvergelijkingsoperator
<topleveleenzijdigedatumvergelijkingsoperator> ::=
<topleveleenzijdigedatumvergelijkingsoperatorenkelvoud> |
<topleveleenzijdigedatumvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-46.jpg?height=189&width=1032&top_left_y=2130&top_left_x=238)
13.4.14.26 Toplevel eenzijdige datumvergelijkingsoperator enkelvoud <topleveleenzijdigedatumvergelijkingsoperatorenkelvoud> ::= [<geheleperiodevergelijking>] ("leeg is" | "gevuld is" | ("een" <dagsoort> "is"))
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-47.jpg?height=347&width=1417&top_left_y=249&top_left_x=228)
13.4.14.27 Toplevel eenzijdige datumvergelijkingsoperator meervoud <topleveleenzijdigedatumvergelijkingsoperatormeervoud> ::= [<geheleperiodevergelijking>] ("leeg zijn" | "gevuld zijn" | ("een" <dagsoort> "zijn"))
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-47.jpg?height=361&width=1469&top_left_y=802&top_left_x=225)
13.4.14.28 Toplevel tweezijdige datumvergelijkingsoperator <topleveltweezijdigedatumvergelijkingsoperator> ::=
<topleveltweezijdigedatumvergelijkingsoperatorenkelvoud> |
<topleveltweezijdigedatumvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-47.jpg?height=209&width=1141&top_left_y=1409&top_left_x=229)
13.4.14.29 Toplevel tweezijdige datumvergelijkingsoperator enkelvoud <topleveltweezijdigedatumvergelijkingsoperatorenkelvoud> ::= [<geheleperiodevergelijking>] ("gelijk is aan" | "ongelijk is aan" | "later is dan" | "later of gelijk is aan" | "eerder of gelijk is aan" | "eerder is dan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-47.jpg?height=692&width=1355&top_left_y=1867&top_left_x=225)
13.4.14.30 Toplevel tweezijdige datumvergelijkingsoperator meervoud <topleveltweezijdigedatumvergelijkingsoperatormeervoud> : := [<geheleperiodevergelijking>]
("gelijk zijn aan" | "ongelijk zijn aan" | "later zijn dan" | "later of gelijk zijn aan" | "eerder of gelijk zijn aan" | "eerder zijn dan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-48.jpg?height=692&width=1389&top_left_y=431&top_left_x=231)
13.4.14.31 Toplevel eenzijdige tekstvergelijkingsoperator
<topleveleenzijdigetekstvergelijkingsoperator> ::=
<topleveleenzijdigetekstvergelijkingsoperatorenkelvoud> |
<topleveleenzijdigetekstvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-48.jpg?height=203&width=1086&top_left_y=1372&top_left_x=237)
13.4.14.32 Toplevel eenzijdige tekstvergelijkingsoperator enkelvoud
<topleveleenzijdigetekstvergelijkingsoperatorenkelvoud> ::= [<geheleperiodevergelijking>]
("leeg is" | "gevuld is" | ("numeriek is met exact" <geheelgetal> "cijfers") | "aan de elfproef voldoet")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-48.jpg?height=404&width=1600&top_left_y=1817&top_left_x=228)
13.4.14.33 Toplevel eenzijdige tekstvergelijkingsoperator meervoud
<topleveleenzijdigetekstvergelijkingsoperatormeervoud> ::= [<geheleperiodevergelijking>] ("leeg zijn" | "gevuld zijn" | ("numeriek zijn met exact" <geheelgetal> "cijfers") | "aan de elfproef voldoen")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-49.jpg?height=364&width=1594&top_left_y=255&top_left_x=234)
13.4.14.34 Toplevel tweezijdige tekstvergelijkingsoperator <topleveltweezijdigetekstvergelijkingsoperator> ::=
<topleveltweezijdigetekstvergelijkingsoperatorenkelvoud> |
<topleveltweezijdigetekstvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-49.jpg?height=221&width=1164&top_left_y=883&top_left_x=229)
13.4.14.35 Toplevel tweezijdige tekstvergelijkingsoperator enkelvoud <topleveltweezijdigetekstvergelijkingsoperatorenkelvoud> ::= [<geheleperiodevergelijking>] ("gelijk is aan" | "ongelijk is aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-49.jpg?height=229&width=1229&top_left_y=1319&top_left_x=231)
13.4.14.36 Toplevel tweezijdige tekstvergelijkingsoperator meervoud <topleveltweezijdigetekstvergelijkingsoperatormeervoud> ::= [<geheleperiodevergelijking>] ("gelijk zijn aan" | "ongelijk zijn aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-49.jpg?height=243&width=1271&top_left_y=1763&top_left_x=227)
13.4.14.37 Toplevel eenzijdige booleanvergelijkingsoperator <topleveleenzijdigebooleanvergelijkingsoperator> ::= <topleveleenzijdigebooleanvergelijkingsoperatorenkelvoud> | <topleveleenzijdigebooleanvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-49.jpg?height=209&width=1189&top_left_y=2254&top_left_x=228)
13.4.14.38 Toplevel eenzijdige booleanvergelijkingsoperator enkelvoud <topleveleenzijdigebooleanvergelijkingsoperatorenkelvoud> : := [<geheleperiodevergelijking>] ("leeg is" | "gevuld is")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-50.jpg?height=246&width=1135&top_left_y=394&top_left_x=226)
13.4.14.39 Toplevel eenzijdige booleanvergelijkingsoperator meervoud
<topleveleenzijdigebooleanvergelijkingsoperatormeervoud> ::= [<geheleperiodevergelijking>] ("leeg zijn" | "gevuld zijn")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-50.jpg?height=229&width=1166&top_left_y=848&top_left_x=231)
13.4.14.40 Toplevel tweezijdige booleanvergelijkingsoperator
<topleveltweezijdigebooleanvergelijkingsoperator> ::=
<topleveltweezijdigebooleanvergelijkingsoperatorenkelvoud> |
<topleveltweezijdigebooleanvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-50.jpg?height=232&width=1314&top_left_y=1329&top_left_x=234)
13.4.14.41 Toplevel tweezijdige booleanvergelijkingsoperator enkelvoud
<topleveltweezijdigebooleanvergelijkingsoperatorenkelvoud> ::= [<geheleperiodevergelijking>] ("gelijk is aan" | "ongelijk is aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-50.jpg?height=236&width=1228&top_left_y=1778&top_left_x=234)
13.4.14.42 Toplevel tweezijdige booleanvergelijkingsoperator meervoud
<topleveltweezijdigebooleanvergelijkingsoperatormeervoud> ::= [<geheleperiodevergelijking>] ("gelijk zijn aan" | "ongelijk zijn aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-50.jpg?height=232&width=1271&top_left_y=2231&top_left_x=227)
13.4.14.43 Toplevel eenzijdige objectvergelijkingsoperator <topleveleenzijdigeobjectvergelijkingsoperator> ::=
<topleveleenzijdigeobjectvergelijkingsoperatorenkelvoud> |
<topleveleenzijdigeobjectvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-51.jpg?height=232&width=1263&top_left_y=358&top_left_x=231)
13.4.14.44 Toplevel eenzijdige objectvergelijkingsoperator enkelvoud <topleveleenzijdigeobjectvergelijkingsoperatorenkelvoud> ::= [<geheleperiodevergelijking>] ["een"] (<rolnaam> | <kenmerknaam>) ("is" | "heeft")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-51.jpg?height=224&width=1606&top_left_y=799&top_left_x=225)
13.4.14.45 Toplevel eenzijdige objectvergelijkingsoperator meervoud <topleveleenzijdigeobjectvergelijkingsoperatormeervoud> : := [<geheleperiodevergelijking>] ["een"] (<rolnaam> | <kenmerknaam>) ("zijn" | "hebben")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-51.jpg?height=215&width=1608&top_left_y=1229&top_left_x=224)
13.4.14.46 Toplevel tweezijdige objectvergelijkingsoperator
<topleveltweezijdigeobjectvergelijkingsoperator> ::=
<topleveltweezijdigeobjectvergelijkingsoperatorenkelvoud> |
<topleveltweezijdigeobjectvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-51.jpg?height=241&width=1280&top_left_y=1693&top_left_x=231)
13.4.14.47 Toplevel tweezijdige objectvergelijkingsoperator enkelvoud <topleveltweezijdigeobjectvergelijkingsoperatorenkelvoud> ::= [<geheleperiodevergelijking>] ("gelijk is aan" | "ongelijk is aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-51.jpg?height=229&width=1228&top_left_y=2147&top_left_x=234)
13.4.14.48 Toplevel tweezijdige objectvergelijkingsoperator meervoud <topleveltweezijdigeobjectvergelijkingsoperatormeervoud> ::= [<geheleperiodevergelijking>] ("gelijk zijn aan" | "ongelijk zijn aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-52.jpg?height=229&width=1266&top_left_y=251&top_left_x=235)
13.4.14.49 Elementaire voorwaarde <elementairevoorwaarde> : := <voorwaardevergelijking> | <consistentievoorwaarde>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-52.jpg?height=218&width=720&top_left_y=671&top_left_x=237)

### 13.4.14.50 Voorwaardevergelijking

<voorwaardevergelijking> ::= <getalvergelijking> | <objectvergelijking> | <tekstvergelijking> | <datumvergelijking> | <booleanvergelijking> | <periodevergelijkingelementair>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-52.jpg?height=692&width=823&top_left_y=1113&top_left_x=237)
13.4.14.51 Getalvergelijking
<getalvergelijking> ::= <eenzijdigegetalvergelijking> | <tweezijdigegetalvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-52.jpg?height=218&width=795&top_left_y=2004&top_left_x=231)

### 13.4.14.52 Eenzijdige getalvergelijking

<eenzijdigegetalvergelijking> ::= <getalexpressie> <eenzijdigegetalvergelijkingsoperator>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-52.jpg?height=124&width=1191&top_left_y=2411&top_left_x=227)
13.4.14.53 Tweezijdige getalvergelijking
<tweezijdigegetalvergelijking> : := <getalexpressie> <tweezijdigegetalvergelijkingsoperator> <getalexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-53.jpg?height=106&width=1543&top_left_y=404&top_left_x=234)
13.4.14.54 Datumvergelijking
<datumvergelijking> : := <eenzijdigedatumvergelijking> | <tweezijdigedatumvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-53.jpg?height=229&width=821&top_left_y=705&top_left_x=229)
13.4.14.55 Eenzijdige datumvergelijking
<eenzijdigedatumvergelijking> : := <datumexpressie> <eenzijdigedatumvergelijkingsoperator>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-53.jpg?height=107&width=1220&top_left_y=1123&top_left_x=235)
13.4.14.56 Tweezijdige datumvergelijking
<tweezijdigedatumvergelijking> : := <datumexpressie> <tweezijdigedatumvergelijkingsoperator> <datumexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-53.jpg?height=115&width=1592&top_left_y=1456&top_left_x=232)
13.4.14.57 Tekstvergelijking
<tekstvergelijking> : := <eenzijdigetekstvergelijking> | <tweezijdigetekstvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-53.jpg?height=226&width=792&top_left_y=1760&top_left_x=229)
13.4.14.58 Eenzijdige tekstvergelijking
<eenzijdigetekstvergelijking> ::= <tekstexpressie> <eenzijdigetekstvergelijkingsoperator>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-53.jpg?height=112&width=1177&top_left_y=2177&top_left_x=234)

[^0]![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-54.jpg?height=110&width=1540&top_left_y=296&top_left_x=241)
13.4.14.60 Booleanvergelijking
<booleanvergelijking> : := <eenzijdigebooleanvergelijking> | <tweezijdigebooleanvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-54.jpg?height=215&width=829&top_left_y=606&top_left_x=242)
13.4.14.61 Eenzijdige booleanvergelijking
<eenzijdigebooleanvergelijking> ::= <booleanexpressie>
<eenzijdigebooleanvergelijkingsoperator>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-54.jpg?height=112&width=1268&top_left_y=1046&top_left_x=237)
13.4.14.62 Tweezijdige booleanvergelijking
<tweezijdigebooleanvergelijking> ::= <booleanexpressie>
<tweezijdigebooleanvergelijkingsoperator> <booleanexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-54.jpg?height=104&width=1586&top_left_y=1384&top_left_x=235)
13.4.14.63 Objectvergelijking
<objectvergelijking> ::= <eenzijdigeobjectvergelijking> | <tweezijdigeobjectvergelijking>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-54.jpg?height=226&width=815&top_left_y=1686&top_left_x=232)
13.4.14.64 Eenzijdige objectvergelijking
<eenzijdigeobjectvergelijking> ::= <objectexpressie> <eenzijdigeobjectvergelijkingsoperator>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-54.jpg?height=107&width=1201&top_left_y=2105&top_left_x=242)

### 13.4.14.65 Tweezijdige objectvergelijking

<tweezijdigeobjectvergelijking> ::= (<objectexpressie> | <referentie>)
<tweezijdigeobjectvergelijkingsoperator> <objectexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-55.jpg?height=216&width=1598&top_left_y=246&top_left_x=229)
13.4.14.66 Consistentievoorwaarde
<consistentievoorwaarde> ::= "regelversie" <karakterreeks> "is" ("gevuurd" | "inconsistent")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-55.jpg?height=241&width=1320&top_left_y=645&top_left_x=228)

### 13.4.14.67 Periodevergelijking

<periodevergelijking> ::= <periodevergelijkingenkelvoudig> | <periodevergelijkingelementair>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-55.jpg?height=221&width=843&top_left_y=1083&top_left_x=235)

### 13.4.14.68 Periodevergelijking enkelvoudig

<periodevergelijkingenkelvoudig> : := ("vanaf" <datumexpressie>) | ("van" <datumexpressie> "tot" <datumexpressie>) | ("van" <datumexpressie> "tot en met" <datumexpressie>) | ("tot" <datumexpressie>) | ("tot en met" <datumexpressie>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-55.jpg?height=338&width=1602&top_left_y=1507&top_left_x=227)

### 13.4.14.69 Periodevergelijking elementair

<periodevergelijkingelementair> : := "het is de periode" <periodevergelijkingenkelvoudig>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-55.jpg?height=112&width=1135&top_left_y=1983&top_left_x=232)

### 13.4.14.70 Gehele periodevergelijking

<geheleperiodevergelijking> ::= ["niet"] "gedurende" ("het gehele jaar" | "de gehele maand")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-55.jpg?height=223&width=1212&top_left_y=2347&top_left_x=228)
13.4.14.71 Eenzijdige getalvergelijkingsoperator
<eenzijdigegetalvergelijkingsoperator> : := <eenzijdigegetalvergelijkingsoperatorenkelvoud> | <eenzijdigegetalvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-56.jpg?height=232&width=1112&top_left_y=398&top_left_x=232)

### 13.4.14.72 Eenzijdige getalvergelijkingsoperator enkelvoud

<eenzijdigegetalvergelijkingsoperatorenkelvoud> ::= ("is" [<geheleperiodevergelijking>]
("leeg" | "gevuld")) | ("voldoet" [<geheleperiodevergelijking>] "aan de elfproef")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-56.jpg?height=435&width=1469&top_left_y=845&top_left_x=231)

### 13.4.14.73 Eenzijdige getalvergelijkingsoperator meervoud

<eenzijdigegetalvergelijkingsoperatormeervoud> ::= ("zijn" [<geheleperiodevergelijking>] ("leeg" | "gevuld")) | ("voldoen" [<geheleperiodevergelijking>] "aan de elfproef")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-56.jpg?height=452&width=1492&top_left_y=1490&top_left_x=225)
13.4.14.74 Tweezijdige getalvergelijkingsoperator
<tweezijdigegetalvergelijkingsoperator> ::= <tweezijdigegetalvergelijkingsoperatorenkelvoud> | <tweezijdigegetalvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-56.jpg?height=227&width=1131&top_left_y=2154&top_left_x=234)
13.4.14.75 Tweezijdige getalvergelijkingsoperator enkelvoud
<tweezijdigegetalvergelijkingsoperatorenkelvoud> ::= "is" [<geheleperiodevergelijking>] ("gelijk aan" | "ongelijk aan" | "groter dan" | "groter of gelijk aan" | "kleiner of gelijk aan" | "kleiner dan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-57.jpg?height=695&width=1445&top_left_y=292&top_left_x=237)
13.4.14.76 Tweezijdige getalvergelijkingsoperator meervoud
<tweezijdigegetalvergelijkingsoperatormeervoud> ::= "zijn" [<geheleperiodevergelijking>] ("gelijk aan" | "ongelijk aan" | "groter dan" | "groter of gelijk aan" | "kleiner of gelijk aan" | "kleiner dan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-57.jpg?height=698&width=1480&top_left_y=1227&top_left_x=234)
13.4.14.77 Eenzijdige datumvergelijkingsoperator
<eenzijdigedatumvergelijkingsoperator> ::= <eenzijdigedatumvergelijkingsoperatorenkelvoud> | <eenzijdigedatumvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-57.jpg?height=235&width=1137&top_left_y=2141&top_left_x=231)
13.4.14.78 Eenzijdige datumvergelijkingsoperator enkelvoud
<eenzijdigedatumvergelijkingsoperatorenkelvoud> ::= ("is" [<geheleperiodevergelijking>] ("leeg" | "gevuld")) | ([<geheleperiodevergelijking>] "een" <dagsoort> "is")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-58.jpg?height=432&width=1417&top_left_y=252&top_left_x=228)
13.4.14.79 Eenzijdige datumvergelijkingsoperator meervoud
<eenzijdigedatumvergelijkingsoperatormeervoud> ::= ("zijn" [<geheleperiodevergelijking>] ("leeg" | "gevuld")) | ([<geheleperiodevergelijking>] "een" <dagsoort> "zijn")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-58.jpg?height=426&width=1465&top_left_y=895&top_left_x=227)
13.4.14.80 Tweezijdige datumvergelijkingsoperator
<tweezijdigedatumvergelijkingsoperator> ::= <tweezijdigedatumvergelijkingsoperatorenkelvoud> | <tweezijdigedatumvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-58.jpg?height=210&width=1072&top_left_y=1551&top_left_x=229)
13.4.14.81 Tweezijdige datumvergelijkingsoperator enkelvoud
<tweezijdigedatumvergelijkingsoperatorenkelvoud> ::= "is" [<geheleperiodevergelijking>] ("gelijk aan" | "ongelijk aan" | "later dan" | "later of gelijk aan" | "eerder of gelijk aan" | "eerder dan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-59.jpg?height=698&width=1440&top_left_y=245&top_left_x=234)
13.4.14.82 Tweezijdige datumvergelijkingsoperator meervoud
<tweezijdigedatumvergelijkingsoperatormeervoud> ::= "zijn" [<geheleperiodevergelijking>] ("gelijk aan" | "ongelijk aan" | "later dan" | "later of gelijk aan" | "eerder of gelijk aan" | "eerder dan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-59.jpg?height=686&width=1472&top_left_y=1182&top_left_x=235)
13.4.14.83 Eenzijdige tekstvergelijkingsoperator
<eenzijdigetekstvergelijkingsoperator> ::= <eenzijdigetekstvergelijkingsoperatorenkelvoud> | <eenzijdigetekstvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-59.jpg?height=232&width=1075&top_left_y=2091&top_left_x=228)

### 13.4.14.84 Eenzijdige tekstvergelijkingsoperator enkelvoud

<eenzijdigetekstvergelijkingsoperatorenkelvoud> ::= ("is" [<geheleperiodevergelijking>]
("leeg" | "gevuld" | ("numeriek met exact" <geheelgetal> "cijfers"))) | ("voldoet"
[<geheleperiodevergelijking>] "aan de elfproef")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-60.jpg?height=423&width=1600&top_left_y=251&top_left_x=228)
13.4.14.85 Eenzijdige tekstvergelijkingsoperator meervoud
<eenzijdigetekstvergelijkingsoperatormeervoud> ::= ("zijn" [<geheleperiodevergelijking>]
("leeg" | "gevuld" | ("numeriek met exact" <geheelgetal> "cijfers"))) | ("voldoen" [<geheleperiodevergelijking>] "aan de elfproef")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-60.jpg?height=432&width=1611&top_left_y=915&top_left_x=228)
13.4.14.86 Tweezijdige tekstvergelijkingsoperator
<tweezijdigetekstvergelijkingsoperator> ::= <tweezijdigetekstvergelijkingsoperatorenkelvoud> | <tweezijdigetekstvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-60.jpg?height=223&width=1072&top_left_y=1559&top_left_x=229)
13.4.14.87 Tweezijdige tekstvergelijkingsoperator enkelvoud <tweezijdigetekstvergelijkingsoperatorenkelvoud> ::= "is" [<geheleperiodevergelijking>] ("gelijk aan" | "ongelijk aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-60.jpg?height=241&width=1324&top_left_y=1984&top_left_x=229)

### 13.4.14.88 Tweezijdige tekstvergelijkingsoperator meervoud

<tweezijdigetekstvergelijkingsoperatormeervoud> ::= "zijn" [<geheleperiodevergelijking>] ("gelijk aan" | "ongelijk aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-61.jpg?height=233&width=1354&top_left_y=249&top_left_x=231)
13.4.14.89 Eenzijdige booleanvergelijkingsoperator
<eenzijdigebooleanvergelijkingsoperator> ::= <eenzijdigebooleanvergelijkingsoperatorenkelvoud> | <eenzijdigebooleanvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-61.jpg?height=223&width=1095&top_left_y=691&top_left_x=229)
13.4.14.90 Eenzijdige booleanvergelijkingsoperator enkelvoud
<eenzijdigebooleanvergelijkingsoperatorenkelvoud> ::= "is" [<geheleperiodevergelijking>] ("leeg" | "gevuld")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-61.jpg?height=245&width=1229&top_left_y=1131&top_left_x=222)
13.4.14.91 Eenzijdige booleanvergelijkingsoperator meervoud
<eenzijdigebooleanvergelijkingsoperatormeervoud> ::= "zijn" [<geheleperiodevergelijking>] ("leeg" | "gevuld")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-61.jpg?height=246&width=1260&top_left_y=1573&top_left_x=227)

## 13.4-14.92 Tweezijdige booleanvergelijkingsoperator

<tweezijdigebooleanvergelijkingsoperator> ::=
<tweezijdigebooleanvergelijkingsoperatorenkelvoud> ।
<tweezijdigebooleanvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-61.jpg?height=253&width=1189&top_left_y=2055&top_left_x=225)
13.4.14.93 Tweezijdige booleanvergelijkingsoperator enkelvoud <tweezijdigebooleanvergelijkingsoperatorenkelvoud> ::= "is" [<geheleperiodevergelijking>] ("gelijk aan" | "ongelijk aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-62.jpg?height=235&width=1320&top_left_y=245&top_left_x=234)
13.4.14.94 Tweezijdige booleanvergelijkingsoperator meervoud
<tweezijdigebooleanvergelijkingsoperatormeervoud> ::= "zijn" [<geheleperiodevergelijking>]
("gelijk aan" | "ongelijk aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-62.jpg?height=236&width=1343&top_left_y=690&top_left_x=231)

### 13.4.14.95 Eenzijdige objectvergelijkingsoperator

<eenzijdigeobjectvergelijkingsoperator> ::= <eenzijdigeobjectvergelijkingsoperatorenkelvoud> | <eenzijdigeobjectvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-62.jpg?height=190&width=935&top_left_y=1147&top_left_x=235)
13.4.14.96 Eenzijdige objectvergelijkingsoperator enkelvoud
<eenzijdigeobjectvergelijkingsoperatorenkelvoud> ::= ("is" | "heeft")
[<geheleperiodevergelijking>] ["een"] <kenmerknaam>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-62.jpg?height=218&width=1600&top_left_y=1553&top_left_x=228)
13.4.14.97 Eenzijdige objectvergelijkingsoperator meervoud
<eenzijdigeobjectvergelijkingsoperatormeervoud> ::= ("zijn" | "hebben")
[<geheleperiodevergelijking>] ["een"] <kenmerknaam>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-62.jpg?height=212&width=1606&top_left_y=2004&top_left_x=228)

### 13.4.14.98 Tweezijdige objectvergelijkingsoperator

<tweezijdigeobjectvergelijkingsoperator> ::= <tweezijdigeobjectvergelijkingsoperatorenkelvoud> | <tweezijdigeobjectvergelijkingsoperatormeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-63.jpg?height=184&width=952&top_left_y=296&top_left_x=238)
13.4.14.99 Tweezijdige objectvergelijkingsoperator enkelvoud
<tweezijdigeobjectvergelijkingsoperatorenkelvoud> ::= "is" [<geheleperiodevergelijking>] ("gelijk aan" | "ongelijk aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-63.jpg?height=235&width=1306&top_left_y=702&top_left_x=238)
13.4.14.100 Tweezijdige objectvergelijkingsoperator meervoud
<tweezijdigeobjectvergelijkingsoperatormeervoud> ::= "zijn" [<geheleperiodevergelijking>] ("gelijk aan" | "ongelijk aan")
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-63.jpg?height=227&width=1343&top_left_y=1160&top_left_x=237)

### 13.4.15 Berekening

### 13.4.15.1 Berekening

<berekening> ::= <getalexpressie> ("plus" | "min" | "verminderd met" | "maal" | "gedeeld door" | "gedeeld door (ABS)") <getalexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-63.jpg?height=678&width=1384&top_left_y=1694&top_left_x=236)

### 13.4.16 Expressie

### 13.4.16.1 Expressie

<expressie> ::= <getalexpressie> | <objectexpressie> | <datumexpressie> | <tekstexpressie> | <booleanexpressie> | <expressietussenhaakjes> | <parametermetlidwoord> | <variabelenaam> | <concatenatie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-64.jpg?height=1041&width=732&top_left_y=513&top_left_x=228)

### 13.4.16.2 Concatenatie

<concatenatie> : := <expressie> [ (", " <expressie>)*] ("en " | " of ") <expressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-64.jpg?height=361&width=1040&top_left_y=1773&top_left_x=228)

### 13.4.16.3 Getal expressie

<getalexpressie> : := <begrenzingexpressie> | afrondingexpressie> | <getalfunctie> | <getalaggregatie> | <attribuutvanonderwerp> | <getalwaarde> | <rekenjaar> | <jaaruitfunctie> | <maanduitfunctie> | <daguitfunctie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-65.jpg?height=1146&width=703&top_left_y=295&top_left_x=237)
13.4.16.4 Datumexpressie
<datumexpressie> $::=$ <datumfunctie> | <attribuutvanonderwerp> | <dedato> | <datumaggregatie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-65.jpg?height=683&width=723&top_left_y=1640&top_left_x=227)
13.4.16.5 Objectexpressie
<objectexpressie> ::= [<kwantificatie>] <onderwerpketen>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-66.jpg?height=187&width=846&top_left_y=249&top_left_x=228)
13.4.16.6 Tekstexpressie
<tekstexpressie> : := <tekstenwaardereeks> | <tekstwaarde> | <attribuutvanonderwerp>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-66.jpg?height=569&width=721&top_left_y=629&top_left_x=228)
13.4.16.7 Boolean expressie
<booleanexpressie> : := <booleanwaarde> | <attribuutvanonderwerp>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-66.jpg?height=466&width=727&top_left_y=1383&top_left_x=222)
13.4.16.8 Expressie tussen haakjes
<expressietussenhaakjes> ::= "(" <expressie> ")"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-66.jpg?height=118&width=632&top_left_y=2031&top_left_x=232)
13.4.16.9 Tekst en waardereeks
<tekstenwaardereeks> ::= "\"" (("«" <expressie> "»") | <karakterreeks>)+ "\""
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-66.jpg?height=264&width=1017&top_left_y=2338&top_left_x=228)
13.4.16.10 Functie
<functie> ::= <datumfunctie> | <getalfunctie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-67.jpg?height=216&width=495&top_left_y=366&top_left_x=238)
13.4.16.11 Getalfunctie
<getalfunctie>::= <percentagefunctie> | <wortelfunctie> | <minimalewaardefunctie> | <maximalewaardefunctie> | <verminderdmetfunctie> | <tijdsduurtussen>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-67.jpg?height=675&width=720&top_left_y=816&top_left_x=234)

### 13.4.16.12 Percentagefunctie

<percentagefunctie> ::= <getalexpressie> ["\%"] "van" <getalexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-67.jpg?height=212&width=1234&top_left_y=1676&top_left_x=228)

### 13.4.16.13 Wortelfunctie

<wortelfunctie> ::= "de wortel van" <getalexpressie> <afronding>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-67.jpg?height=116&width=1080&top_left_y=2075&top_left_x=231)

### 13.4.16.14 Machtsverheffenfunctie

<machtsverheffenfunctie> : := <getalexpressie> "tot de macht" <getalexpressie> <afronding>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-67.jpg?height=118&width=1409&top_left_y=2374&top_left_x=232)
13.4.16.15 Minimale waardefunctie
<minimalewaardefunctie> : := "de minimale waarde van" <getalexpressie> (", " <getalexpressie>)* "en " <getalexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-68.jpg?height=232&width=1592&top_left_y=478&top_left_x=235)
13.4.16.16 Maximale waardefunctie
<maximalewaardefunctie> ::= "de maximale waarde van" <getalexpressie> (", " <getalexpressie>)* "en " <getalexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-68.jpg?height=207&width=1511&top_left_y=933&top_left_x=238)

### 13.4.16.17 Absolute waarde functie

<absolutewaardefunctie> ::= "de absolute waarde van (" <getalexpressie> ")"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-68.jpg?height=116&width=1137&top_left_y=1344&top_left_x=237)

### 13.4.16.18 Jaar uit functie

<jaaruitfunctie> ::= "het jaar uit" <datumexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-68.jpg?height=106&width=778&top_left_y=1603&top_left_x=242)

### 13.4.16.19 Maand uit functie

<maanduitfunctie> ::= "de maand uit" <datumexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-68.jpg?height=103&width=815&top_left_y=1913&top_left_x=238)
13.4.16.20 Dag uit functie
<daguitfunctie> ::= "de dag uit" <datumexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-68.jpg?height=112&width=766&top_left_y=2211&top_left_x=234)
13.4.16.21 Afronding expressie
<afrondingexpressie> ::= <getalexpressie> <afronding>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-69.jpg?height=119&width=729&top_left_y=246&top_left_x=235)
13.4.16.22 Afronding
<afronding> ::= ("naar beneden" | "naar boven" | "rekenkundig" | "richting nul" | "weg van nul") "afgerond op" <geheelgetal> "decimalen"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-69.jpg?height=521&width=1343&top_left_y=582&top_left_x=234)

### 13.4.16.23 Begrenzing expressie

<begrenzingexpressie> ::= <getalexpressie> "," <begrenzing>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-69.jpg?height=115&width=869&top_left_y=1299&top_left_x=234)

### 13.4.16.24 Begrenzing

<begrenzing> : : (<begrenzingminimum> | <begrenzingmaximum> | <begrenzingminimum> "en" <begrenzingmaximum>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-69.jpg?height=303&width=1372&top_left_y=1653&top_left_x=228)

### 13.4.16.25 Begrenzingminimum

<begrenzingminimum> $::=$ "met een minimum van" <getalexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-69.jpg?height=110&width=961&top_left_y=2149&top_left_x=239)

### 13.4.16.26 Begrenzingmaximum

<begrenzingmaximum> ::= "met een maximum van" <getalexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-69.jpg?height=113&width=969&top_left_y=2439&top_left_x=235)

### 13.4.16.27 Rekenjaar

<rekenjaar> ::= "Rekenjaar"

## Rekenjaar

### 13.4.16.28 Tijdsduur tussen

<tijdsduurtussen> ::= ("de tijdsduur van " | "de absolute tijdsduur van ") <datumexpressie> "tot" <datumexpressie> "in" ["hele"] <eenheidmeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-70.jpg?height=144&width=1594&top_left_y=702&top_left_x=234)

### 13.4.16.29 Datumfunctie

<datumfunctie>::= <datummet> | <eerstepaasdagvan> | <dedato> | <datumberekening> | <eerstevan> | <laatstevan> | <rekendatum>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-70.jpg?height=706&width=560&top_left_y=1075&top_left_x=231)

### 13.4.16.30 Rekendatum

<rekendatum> ::= "Rekendatum"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-70.jpg?height=90&width=446&top_left_y=1965&top_left_x=234)
13.4.16.31 Datum met
<datummet> : := "de datum met jaar, maand en dag(" <getalexpressie> ", " <getalexpressie> ", " <getalexpressie> ")"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-70.jpg?height=89&width=1594&top_left_y=2297&top_left_x=237)

### 13.4.16.32 Eerste paasdag van

<eerstepaasdagvan> ::= "de eerste paasdag van (" <jaar> ")"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-71.jpg?height=115&width=923&top_left_y=248&top_left_x=241)
13.4.16.33 Datumberekening
<datumberekening> : := <datumexpressie> ("plus" | "min") <getalexpressie> <eenheidsafkorting>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-71.jpg?height=212&width=1409&top_left_y=548&top_left_x=238)
13.4.16.34 Eerste van
<eerstevan> $::=$ "de eerste van" <datumexpressie> (", " <datumexpressie>)* "en" <datumexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-71.jpg?height=223&width=1346&top_left_y=985&top_left_x=229)
13.4.16.35 Laatste van
<laatstevan> : : = "de laatste van" <datumexpressie> (", " <datumexpressie>)* "en" <datumexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-71.jpg?height=224&width=1351&top_left_y=1416&top_left_x=227)
13.4.16.36 Referentie
<referentie> ::= <bezieldereferentie> | <nietbezieldereferentie> | <dagsoortreferentie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-71.jpg?height=309&width=623&top_left_y=1827&top_left_x=231)
13.4.16.37 Bezielde referentie
<bezieldereferentie> ::= "hij" | ("zijn" <attribuutnaam>) | ("zijn" <rolnaam>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-72.jpg?height=349&width=732&top_left_y=245&top_left_x=231)
13.4.16.38 Niet bezielde referentie
<nietbezieldereferentie> ::= <objecttypemetlidwoord>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-72.jpg?height=101&width=600&top_left_y=783&top_left_x=237)

### 13.4.16.39 Dagsoort referentie

<dagsoortreferentie> ::= "de dag"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-72.jpg?height=123&width=343&top_left_y=1075&top_left_x=234)

### 13.4.16.40 Aggregatie

<aggregatie> ::= <getalaggregatie> | <datumaggregatie> | <dimensieaggregatie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-72.jpg?height=356&width=673&top_left_y=1381&top_left_x=226)
13.4.16.41 Getalaggregatie
<getalaggregatie> : := <getalaggregatiefunctie> <expressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-72.jpg?height=118&width=872&top_left_y=1917&top_left_x=232)
13.4.16.42 Getalaggregatiefunctie
<getalaggregatiefunctie> ::= "het aantal" | "de maximale waarde van" | "de minimale waarde van" | "de som van"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-73.jpg?height=458&width=772&top_left_y=251&top_left_x=231)

### 13.4.16.43 Datumaggregatie

<datumaggregatie> ::= <datumaggregatiefunctie> <expressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-73.jpg?height=138&width=896&top_left_y=919&top_left_x=226)
13.4.16.44 Datumaggregatiefunctie <datumaggregatiefunctie> $::=$ "de eerste van" | "de laatste van"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-73.jpg?height=221&width=569&top_left_y=1237&top_left_x=232)

### 13.4.16.45 Dimensieaggregatie

<dimensieaggregatie> ::= (<getalaggregatiefunctie> | <datumaggregatiefunctie>)
<attribuutvanonderwerp> <dimensieselectie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-73.jpg?height=230&width=1600&top_left_y=1687&top_left_x=225)
13.4.16.46 Dimensieselectie
<dimensieselectie> : := "over" (<aggregerenoveralledimensies> | <aggregerenoververzameling> | <aggregerenoverbereik>)
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-73.jpg?height=361&width=1008&top_left_y=2078&top_left_x=227)
13.4.16.47 Aggregatie over alle dimensies
<aggregerenoveralledimensies> : := "alle" <dimensienaammeervoud>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-74.jpg?height=115&width=798&top_left_y=362&top_left_x=235)
13.4.16.48 Aggregatie over verzameling
<aggregerenoververzameling> ::= "de" <dimensienaammeervoud> "vanaf" <> "t/m" <>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-74.jpg?height=113&width=1148&top_left_y=663&top_left_x=237)

### 13.4.16.49 Aggregeren over bereik

<aggregerenoverbereik> ::= "de" <dimensienaammeervoud> "in \{" <dimensiewaarde> [(", " <dimensiewaarde>)* "en" <dimensiewaarde>] "\}"
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-74.jpg?height=411&width=1557&top_left_y=1002&top_left_x=232)
4.16.50 Conditie bij expressie
<conditiebijexpressie> ::= "gedurende de tijd dat" (<toplevelelementairevoorwaarde> । <toplevelsamengesteldevoorwaarde>) | <periodevergelijkingenkelvoudig>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-74.jpg?height=364&width=1517&top_left_y=1651&top_left_x=224)
4.16.50 Aggregeren over waarden per tijdseenheid
<waardepertijdseenheidaggregatie> : := "het totaal van" <expressie> [<conditiebijexpressie>]
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-74.jpg?height=212&width=1283&top_left_y=2187&top_left_x=227)

### 4.16.51 Telling aantal dagen

<tellingaantaldagen> : := "het aantal dagen in" ("de maand" | "het jaar") "dat" <expressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-75.jpg?height=229&width=1369&top_left_y=248&top_left_x=235)

### 4.16.52 Tijdsevenredig deel

<tijdsevenredigdeel> ::= "het tijdsevenredig deel per" ("maand" | "jaar") "van" <expressie> <conditiebijexpressie>
![](https://cdn.mathpix.com/cropped/2025_04_10_dec9226f6a005bca49dbg-75.jpg?height=186&width=1592&top_left_y=661&top_left_x=232)


[^0]:    13.4.14.59 Tweezijdige tekstvergelijking
    <tweezijdigetekstvergelijking> : := <tekstexpressie> <tweezijdigetekstvergelijkingsoperator> <tekstexpressie>

