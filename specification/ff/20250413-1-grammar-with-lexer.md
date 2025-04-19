Okay, creating the *complete* ANTLR grammar (`.g4` file) directly from such a large EBNF specification is a substantial task. It requires careful translation of each rule, handling keywords, identifiers, literals, operators, whitespace significance, and potential ambiguities inherent in natural-language-like syntax.

I will provide a comprehensive ANTLR v4 grammar (`RegelSpraak.g4`) based on the provided EBNF (Chapter 13). This grammar aims to be as accurate as possible, but complex languages like this often require iterative refinement and testing against real examples to catch all nuances and ambiguities.

**Assumptions Made:**

1.  **Unicode:** Identifiers (`<karakterreeks>` used for names) will allow Unicode letters.
2.  **Whitespace:** Standard spaces and tabs are generally ignored, except where `\t` or `\n` are explicitly mentioned in the EBNF, where `TAB` and `NEWLINE` tokens will be used.
3.  **Comments:** The specification doesn't define comments. I'll add a simple `--` line comment rule for practical use.
4.  **Error Recovery:** This grammar focuses on recognition. Advanced error recovery strategies are not explicitly built-in but can be added later.
5.  **Ambiguity:** Natural-language-like grammars can be inherently ambiguous. ANTLR's LL(*) algorithm is powerful, but some constructs might require semantic predicates or restructuring based on real-world usage if ambiguities arise during testing. I've used labels (`#labelName`) extensively to help visitors/listeners distinguish between alternatives.
6.  **Bullets:** The `•` character used for nested lists is treated as a `BULLET` token.
7.  **EBNF Mapping:** The mapping from the provided EBNF (OMG/W3C style) to ANTLR syntax is done as follows:
    *   `::=` -> `:`
    *   `|` -> `|`
    *   `[...]` -> `(...)?`
    *   `(...)*` -> `(...)*`
    *   `(...)+` -> `(...)+`
    *   `"text"` -> `'text'` (ANTLR convention) or dedicated Lexer rule.
    *   `<name>` -> `name` (parser rule) or `NAME` (lexer rule).

```antlr
// RegelSpraak.g4
// ANTLR v4 grammar for RegelSpraak v2.1.0
// Based on the EBNF specification dated 25-1-2025

grammar RegelSpraak;

// ----- Entry Point -----
// Assuming a file can contain multiple definitions (object types, parameters, rules, etc.)
compilationUnit
    : definition* EOF
    ;

definition
    : objecttypedefinitie
    | domeindefinitie
    | eenheidsysteem
    | dimensie
    | parameterdefinitie
    | feittypedefinitie
    | wederkerigfeittypedefinitie
    | dagsoort
    | regel
    | beslistabel // Added based on Chapter 12 description
    ;

// ----- 13.3 Objecten en parameters -----

// 13.3.1 Objecttypen
objecttypedefinitie
    : OBJECTTYPE naamwoord (BEZIELD)? NEWLINE (objectTypeMember NEWLINE)+
    ;

objectTypeMember
    : koptekst
    | kenmerk
    | attribuut
    ;

objecttypenaam : IDENTIFIER; // Assuming names are identifiers

objecttypemetlidwoord : bepaaldlidwoord objecttypenaam;

koptekst : KOPTEKST_MARKER karakterreeks; // Simple marker for '---'

// 13.3.2 Attributen en kenmerken
kenmerk
    : ( (naamwoord KENMERK)
      | bezittelijkkenmerk
      | bijvoeglijkkenmerk
      ) (tijdlijn)? SEMI
    ;

bezittelijkkenmerk : naamwoord KENMERK LPAREN BEZITTELIJK RPAREN;
bijvoeglijkkenmerk : IS naam (LPAREN MV COLON meervoudsvorm RPAREN)? KENMERK LPAREN BIJVOEGLIJK RPAREN;

kenmerknaam : IDENTIFIER; // Assuming names are identifiers

attribuut
    : naamwoord TAB (datatype | domeinnaam) (GEDIMENSIONEERD_MET dimensienaam (EN dimensienaam)*)? (tijdlijn)? SEMI
    ;

attribuutmetlidwoord : bepaaldlidwoord? attribuutnaam;
attribuutnaam : IDENTIFIER; // Assuming names are identifiers

// 13.3.3 Datatypen
datatype
    : numeriekdatatype
    | percentagedatatype
    | tekstdatatype
    | booleandatatype
    | datumtijddatatype
    ;

numeriekdatatype
    : NUMERIEK LPAREN getalspecificatie RPAREN (MET_EENHEID ( (eenheidmacht+ | '1') SLASH)? eenheidmacht+ )?
    ;

percentagedatatype
    : PERCENTAGE LPAREN getalspecificatie RPAREN (MET_EENHEID PERCENT (SLASH eenheidsafkorting)?)?
    ;

tekstdatatype : TEKST;
booleandatatype : BOOLEAN;
datumtijddatatype : DATUM_IN_DAGEN | DATUM_EN_TIJD_IN_MILLISECONDES;

getalspecificatie
    : (NEGATIEF | NIET_NEGATIEF | POSITIEF)?
      ( GEHEEL_GETAL_SPEC
      | GETAL_MET aantaldecimalen DECIMALEN
      | GETAL_SPEC
      )
    ;

aantaldecimalen : positiefgeheelgetal; // Assuming positive integer literal

// 13.3.4 Domeinen
domeindefinitie
    : DOMEIN domeinnaam IS_VAN_HET_TYPE (datatype | enumeratiespecificatie)
    ;

enumeratiespecificatie
    : ENUMERATIE NEWLINE (TAB enumeratiewaarde NEWLINE)+
    ;

domeinnaam : IDENTIFIER;

// 13.3.5 Eenheden
eenheidsysteem
    : EENHEIDSSYSTEEM eenheidssysteemnaam (NEWLINE naamwoord eenheidsafkorting (omrekenspecificatie)?) +
    ;

omrekenspecificatie : EQ ('1' SLASH)? geheelgetal eenheidsafkorting;
eenheidsysteemnaam : IDENTIFIER;
eenheidsafkorting : IDENTIFIER; // Or allow symbols like €? Needs refinement based on examples. Use TEXT for now.
eenheidsafkorting : TEXT; // More flexible than IDENTIFIER for symbols like '%' or '€' or 'jr'
eenheidmacht : eenheidsafkorting (CARET LPAREN exponent RPAREN)?; // Use CARET for ^
exponent : geheelgetal;

// 13.3.6 Tijdlijnen
tijdlijn : VOOR (ELKE_DAG | ELKE_MAAND | ELK_JAAR);

// 13.3.7 Dimensies
dimensie
    : DIMENSIE bepaaldlidwoord dimensienaam COMMA BESTAANDE_UIT_DE dimensienaammeervoud voorzetselspecificatie NEWLINE (labelwaardespecificatie NEWLINE)+
    ;

voorzetselspecificatie
    : ( LPAREN NA_HET_ATTRIBUUT_MET_VOORZETSEL (VAN | IN | VOOR | OVER | OP | BIJ | UIT) RPAREN COLON )
    | ( LPAREN VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL RPAREN COLON )
    ;

dimensienaam : IDENTIFIER;
dimensienaammeervoud : IDENTIFIER;
labelwaardespecificatie : DIGIT+ DOT dimensiewaarde;
dimensiewaarde : karakterreeks; // Often quoted strings or identifiers

// 13.3.8 Parameters
parameterdefinitie
    : PARAMETER parametermetlidwoord COLON (datatype | domeinnaam) (tijdlijn)? SEMI
    ;

parametermetlidwoord : bepaaldlidwoord parameternaam;
parameternaam : IDENTIFIER;

// 13.3.9 Feittypen
feittypedefinitie
    : FEITTYPE feittypenaam NEWLINE
      bepaaldlidwoord? rolnaam (LPAREN MV COLON meervoudrolnaam RPAREN)? TAB objecttypenaam NEWLINE
      bepaaldlidwoord? rolnaam (LPAREN MV COLON meervoudrolnaam RPAREN)? TAB objecttypenaam NEWLINE
      (EEN rolnaam | MEERDERE meervoudrolnaam) relatiebeschrijving (EEN rolnaam | MEERDERE meervoudrolnaam)
    ;

wederkerigfeittypedefinitie
    : WEDERKERIG_FEITTYPE feittypenaam NEWLINE
      bepaaldlidwoord? rolnaam (LPAREN MV COLON meervoudrolnaam RPAREN)? TAB objecttypenaam NEWLINE
      ( (EEN rolnaam relatiebeschrijving EEN rolnaam)
      | (MEERDERE rolnaam relatiebeschrijving MEERDERE rolnaam) // Doc says enkelvoudig for wederkerig? Check spec vs EBNF
      )
    ;

feittypenaam : IDENTIFIER;
rolnaam : IDENTIFIER;
meervoudrolnaam : IDENTIFIER;
relatiebeschrijving : karakterreeks+ ; // Allow multi-word descriptions

// 13.3.10 Dagsoort
dagsoort : DAGSOORT naamwoord;
dagsoortnaam : IDENTIFIER;

// ----- 13.4 RegelSpraak -----

// 13.4.1 Onderwerpketen
onderwerpketen // ANTLR handles left recursion
    : ( (lidwoord | ZIJN) (objecttypenaam | rolnaam | kenmerknaam) ) # SimpleOnderwerp
    | ( selector VAN onderwerpketen )                             # ChainedSelectionOnderwerp
    | subselectie                                                 # SubSelectOnderwerp
    | referentie                                                  # ReferenceOnderwerp // Added for 'hij', 'zijn', 'de dag'
    ;

selector : lidwoord? rolnaam;

subselectie : onderwerpketen (DIE | DAT) predicaat;

attribuutvanonderwerp
    : kwantificatie? attribuutmetlidwoord VAN onderwerpketen (dimensiespecificatiebijattribuut)? // Added dimension spec
    ;

dimensiespecificatiebijattribuut // Added based on example 'bruto inkomen VAN huidig jaar'
    : VAN dimensiewaarde // Assuming 'na het attribuut met voorzetsel van'
    // | IN dimensiewaarde // etc for other prepositions if needed
    // | dimensiewaarde // For 'voor het attribuut zonder voorzetsel'
    ;


// 13.4.2 RegelSpraak-regel
regel
    : REGEL regelnaam (NEWLINE regelversie)+
    ;

regelnaam : karakterreeks;

regelversie
    : versie NEWLINE regelSpraakregel
    ;

versie
    : GELDIG versiegeldigheid
    ;

versiegeldigheid
    : ALTIJD
    | (VANAF datumofjaar (T_M datumofjaar)?)
    | (T_M datumofjaar)
    ;

datumofjaar
    : datumwaarde | jaar
    ;

regelSpraakregel
    : resultaatdeel (NEWLINE voorwaardendeel)? DOT (NEWLINE variabelendeel)?
    ;


variabelendeel
    : DAARBIJ_GELDT (NEWLINE TAB variabeleonderdeel)+ DOT? // Allow optional final dot based on examples
    ;

variabeleonderdeel
    : bepaaldlidwoord? variabelenaam IS expressie
    ;

variabelenaam : IDENTIFIER;

// 13.4.3 Resultaatdeel
resultaatdeel
    : gelijkstelling
    | kenmerktoekenning
    | objectcreatie
    | feitcreatie
    | consistentieregel
    | initialisatie
    | verdeling
    | dagsoortdefinitie
    ;

// 13.4.4 Gelijkstelling
gelijkstelling
    : attribuutvanonderwerp MOET_GESTELD_WORDEN_OP expressie              # GelijkstellingToekenning
    | attribuutvanonderwerp MOET_BEREKEND_WORDEN_ALS (getalexpressie | datumexpressie) # GelijkstellingBerekening
    ;

// 13.4.5 Kenmerktoekenning
kenmerktoekenning
    : onderwerpketen (IS | HEEFT) EEN? kenmerknaam // Optional EEN based on examples
    ;

// 13.4.6 ObjectCreatie
objectcreatie
    : EEN onderwerpketen HEEFT EEN rolnaam ( MET waardetoekenning (COMMA waardetoekenning)* (EN waardetoekenning)? )? // Changed to allow single 'met'
    ;

waardetoekenning
    : attribuutwaardetoekenning
    | kenmerkwaardetoekenning
    ;

attribuutwaardetoekenning : attribuutnaam GELIJK_AAN expressie;
kenmerkwaardetoekenning : kenmerknaam GELIJK_AAN booleanwaarde;

// 13.4.7 FeitCreatie
// EBNF: "Een" <rolnaam> "van een" <onderwerpketen> "is een" <rolnaam> "van een" <onderwerpketen>
// Seems potentially ambiguous or overly specific. Let's try to match the example structure:
// "Een passagier met recht op treinmiles van een vastgestelde contingent treinmiles is een passagier van de reis met treinmiles van het vastgestelde contingent treinmiles."
feitcreatie // This rule needs careful checking against more examples if available
    : EEN rolnaam VAN EEN onderwerpketen IS (EEN | bepaaldlidwoord) rolnaam VAN (EEN | bepaaldlidwoord) onderwerpketen
    ;


// 13.4.8 Consistentieregels
consistentieregel
    : enkelvoudigeconsistentieregel
    | toplevelsamengesteldcriterium
    | uniciteitscontrole
    ;

enkelvoudigeconsistentieregel
    : (getalexpressie | datumexpressie | tekstexpressie | objectexpressie) MOET consistenteOperator (expressie)? // Combine various consistentie rules
    ;

// Define a combined operator rule for consistency checks
consistenteOperator
    : topleveleenzijdigegetalvergelijkingsoperatormeervoud
    | topleveltweezijdigegetalvergelijkingsoperatormeervoud
    | topleveleenzijdigedatumvergelijkingsoperatormeervoud
    | topleveltweezijdigedatumvergelijkingsoperatormeervoud
    | topleveleenzijdigetekstvergelijkingsoperatormeervoud
    | topleveltweezijdigetekstvergelijkingsoperatormeervoud
    // | topleveleenzijdigeobjectvergelijkingsoperatormeervoud // This seems redundant with kenmerk/rol checks
    | topleveltweezijdigeobjectvergelijkingsoperatormeervoud
    ;


toplevelsamengesteldcriterium
    : (objectexpressie | referentie | aggregatie | ER) MOET_WORDEN_VOLDAAN_AAN
      ( HET_VOLGENDE_CRITERIUM COLON | (consistentiekwantificatie VOLGENDE_CRITERIA COLON) )
      samengesteldcriteriumonderdeel
    ;

samengesteldcriteriumonderdeel
    : (NEWLINE TAB? genestcriterium)+ // Allow optional tab for readability
    ;

genestcriterium
    : BULLET+ (voorwaardevergelijking | samengesteldcriterium) // Use BULLET token
    ;

samengesteldcriterium
    : (objectexpressie | referentie | aggregatie | ER) WORDT_VOLDAAN_AAN
      ( HET_VOLGENDE_CRITERIUM COLON | (consistentiekwantificatie VOLGENDE_CRITERIA COLON) )
      samengesteldcriteriumonderdeel
    ;

uniciteitscontrole
    : (alleattribuutvanonderwerp | uniciteitconcatenatie) (vereniging)* MOETEN_UNIEK_ZIJN DOT
    ;

vereniging
    : VERENIGD_MET (alleattribuutvanonderwerp | uniciteitconcatenatie)
    ;

alleattribuutvanonderwerp
    : bepaaldlidwoord meervoudsvorm VAN ALLE ((objecttypenaam | rolnaam) (VAN onderwerpketen)?) (VAN onderwerpketen)? // Adjusted structure
    ;

uniciteitconcatenatie
    : DE_CONCATENATIE_VAN meervoudsvorm (COMMA meervoudsvorm)* EN meervoudsvorm
      VAN ALLE ((objecttypenaam | rolnaam) (VAN onderwerpketen)?) (VAN onderwerpketen)? // Adjusted structure
    ;

// 13.4.9 Initialisatie
initialisatie
    : attribuutvanonderwerp MOET_GEINITIALISEERD_WORDEN_OP expressie
    ;

// 13.4.10 Verdeling
verdeling
    : attribuutvanonderwerp WORDT_VERDEELD_OVER attribuutvanonderwerp COMMA
      WAARBIJ_WORDT_VERDEELD (verdelenzondergroepen | meervoudigverdeelcriterium)
    ;

verdelenzondergroepen
    : IN_GELIJKE_DELEN
    | (NAAR_RATO_VAN attribuutmetlidwoord)
    ;

meervoudigverdeelcriterium
    : COLON NEWLINE
      ( TAB? (verdelenovergroepen | (verdelenzondergroepen COMMA)) )
      ( NEWLINE TAB? maximumaanspraak )?
      ( NEWLINE TAB? verdeelafronding )?
      ( NEWLINE TAB? onverdeelderest )?
    ;

verdelenovergroepen
    : MINUS OP_VOLGORDE_VAN (AFNEMENDE | TOENEMENDE) attribuutmetlidwoord (NEWLINE TAB?)? criteriumbijgelijkevolgorde COMMA
    ;

criteriumbijgelijkevolgorde
    : MINUS BIJ_EVEN_GROOT_CRITERIUM (IN_GELIJKE_DELEN | (NAAR_RATO_VAN attribuutmetlidwoord)) COMMA
    ;

maximumaanspraak
    : MINUS MET_EEN_MAXIMUM_VAN attribuutmetlidwoord COMMA? // Allow optional comma
    ;

verdeelafronding
    : MINUS AFGEROND_OP geheelgetal DECIMALEN NAAR_BENEDEN DOT? // Allow optional dot
    ;

onverdeelderest
    : ALS_ONVERDEELDE_REST BLIJFT attribuutvanonderwerp OVER DOT
    ;

// 13.4.11 Dagsoortdefinitie
dagsoortdefinitie
    : EEN DAG IS EEN dagsoortnaam
    ;

// ----- 13.4.12 Voorwaardendeel -----
voorwaardendeel
    : ( ( INDIEN | GEDURENDE_DE_TIJD_DAT ) (toplevelelementairevoorwaarde | toplevelsamengesteldevoorwaarde) )
    | periodevergelijkingenkelvoudig // Used directly without 'indien' for time bounds
    ;

predicaat
    : elementairpredicaat
    | samengesteldpredicaat
    ;

elementairpredicaat // Used within subselectie
    : getalpredicaat
    | tekstpredicaat
    | datumpredicaat
    | objectpredicaat
    ;

samengesteldpredicaat // Used within subselectie
    : AAN kwantificatie VOLGENDE_VOORWAARDE N?
      LPAREN (VOLDOET | VOLDOEN) RPAREN COLON
      (samengesteldevoorwaardeonderdeel | toplevelvoorwaardevergelijking) // Is this correct? EBNF seems circular here
    ;

// Predicates used within subselectie seem to use the 'meervoud' form directly
getalpredicaat : topleveltweezijdigegetalvergelijkingsoperatormeervoud getalexpressie;
tekstpredicaat : topleveltweezijdigetekstvergelijkingsoperatormeervoud tekstexpressie;
datumpredicaat : topleveltweezijdigedatumvergelijkingsoperatormeervoud datumexpressie;
objectpredicaat : topleveltweezijdigeobjectvergelijkingsoperatormeervoud objectexpressie;


// 13.4.13 Samengestelde voorwaarde
toplevelsamengesteldevoorwaarde
    : (objectexpressie | referentie | aggregatie | ER)
      AAN voorwaardekwantificatie VOLGENDE_VOORWAARDE N?
      (VOLDOET | VOLDOEN | WORDT_VOLDAAN) COLON
      samengesteldevoorwaardeonderdeel
    ;

genestesamengesteldevoorwaarde // Used inside samengesteldevoorwaardeonderdeel
    : (objectexpressie | referentie | aggregatie | ER)
      (VOLDOET | VOLDOEN | WORDT_VOLDAAN)
      AAN voorwaardekwantificatie VOLGENDE_VOORWAARDE N? COLON
      samengesteldevoorwaardeonderdeel
    ;

consistentiekwantificatie // Used in consisteny rules
    : ALLE | GEEN_VAN_DE
    | ((TEN_MINSTE | TEN_HOOGSTE | PRECIES) (aantalwoord | getal) VAN_DE)
    ;

voorwaardekwantificatie // Used in conditions
    : DE | ALLE | GEEN_VAN_DE
    | ((TEN_MINSTE | TEN_HOOGSTE | PRECIES) (aantalwoord | getal) VAN_DE)
    ;

kwantificatie // Used for aggregations like 'alle passagiers' or 'ten minste één' in subselecties?
    : DE | ALLE | AL | GEEN_VAN_DE
    | ((TEN_MINSTE | TEN_HOOGSTE | PRECIES) (aantalwoord | getal) VAN_DE?) // EBNF seems inconsistent here (VAN_DE is optional?)
    ;

aantalwoord : EEN_AANTAL | TWEE_AANTAL | DRIE_AANTAL | VIER_AANTAL;

samengesteldevoorwaardeonderdeel
    : (NEWLINE TAB? genestevoorwaarde)+ // Allow optional tab
    ;

genestevoorwaarde
    : BULLET+ (elementairevoorwaarde | genestesamengesteldevoorwaarde)
    ;


// 13.4.14 Elementaire voorwaarde
toplevelelementairevoorwaarde
    : toplevelvoorwaardevergelijking
    | toplevelconsistentievoorwaarde
    ;

toplevelvoorwaardevergelijking // Used after 'indien' or 'gedurende de tijd dat'
    : toplevelgetalvergelijking
    | toplevelobjectvergelijking
    | topleveltekstvergelijking
    | topleveldatumvergelijking
    | toplevelbooleanvergelijking
    | periodevergelijkingelementair // e.g., 'het is de periode van ... tot ...'
    ;

toplevelgetalvergelijking : (getalexpressie topleveleenzijdigegetalvergelijkingsoperator) | (getalexpressie topleveltweezijdigegetalvergelijkingsoperator getalexpressie);
topleveldatumvergelijking : (datumexpressie topleveleenzijdigedatumvergelijkingsoperator) | (datumexpressie topleveltweezijdigedatumvergelijkingsoperator datumexpressie);
topleveltekstvergelijking : (tekstexpressie topleveleenzijdigetekstvergelijkingsoperator) | (tekstexpressie topleveltweezijdigetekstvergelijkingsoperator tekstexpressie);
toplevelbooleanvergelijking : (booleanexpressie topleveleenzijdigebooleanvergelijkingsoperator) | (booleanexpressie topleveltweezijdigebooleanvergelijkingsoperator booleanexpressie);
toplevelobjectvergelijking : (objectexpressie topleveleenzijdigeobjectvergelijkingsoperator) | ((objectexpressie | referentie) topleveltweezijdigeobjectvergelijkingsoperator objectexpressie);

toplevelconsistentievoorwaarde : REGELVERSIE karakterreeks IS (GEVUURD | INCONSISTENT);

// Operators for 'toplevel' conditions (using 'is', 'zijn', 'voldoet', 'voldoen')
topleveleenzijdigegetalvergelijkingsoperator : topleveleenzijdigegetalvergelijkingsoperatorenkelvoud | topleveleenzijdigegetalvergelijkingsoperatormeervoud;
topleveleenzijdigegetalvergelijkingsoperatorenkelvoud : geheleperiodevergelijking? (LEEG IS | GEVULD IS | AAN_DE_ELFPROEF VOLDOET);
topleveleenzijdigegetalvergelijkingsoperatormeervoud : geheleperiodevergelijking? (LEEG ZIJN | GEVULD ZIJN | AAN_DE_ELFPROEF VOLDOEN);

topleveltweezijdigegetalvergelijkingsoperator : topleveltweezijdigegetalvergelijkingsoperatorenkelvoud | topleveltweezijdigegetalvergelijkingsoperatormeervoud;
topleveltweezijdigegetalvergelijkingsoperatorenkelvoud : geheleperiodevergelijking? (GELIJK_IS_AAN | ONGELIJK_IS_AAN | GROTER_IS_DAN | GROTER_OF_GELIJK_IS_AAN | KLEINER_OF_GELIJK_IS_AAN | KLEINER_IS_DAN);
topleveltweezijdigegetalvergelijkingsoperatormeervoud : geheleperiodevergelijking? (GELIJK_ZIJN_AAN | ONGELIJK_ZIJN_AAN | GROTER_ZIJN_DAN | GROTER_OF_GELIJK_ZIJN_AAN | KLEINER_OF_GELIJK_ZIJN_AAN | KLEINER_ZIJN_DAN);

topleveleenzijdigedatumvergelijkingsoperator : topleveleenzijdigedatumvergelijkingsoperatorenkelvoud | topleveleenzijdigedatumvergelijkingsoperatormeervoud;
topleveleenzijdigedatumvergelijkingsoperatorenkelvoud : geheleperiodevergelijking? (LEEG IS | GEVULD IS | (EEN dagsoortnaam IS));
topleveleenzijdigedatumvergelijkingsoperatormeervoud : geheleperiodevergelijking? (LEEG ZIJN | GEVULD ZIJN | (EEN dagsoortnaam ZIJN));

topleveltweezijdigedatumvergelijkingsoperator : topleveltweezijdigedatumvergelijkingsoperatorenkelvoud | topleveltweezijdigedatumvergelijkingsoperatormeervoud;
topleveltweezijdigedatumvergelijkingsoperatorenkelvoud : geheleperiodevergelijking? (GELIJK_IS_AAN | ONGELIJK_IS_AAN | LATER_IS_DAN | LATER_OF_GELIJK_IS_AAN | EERDER_OF_GELIJK_IS_AAN | EERDER_IS_DAN);
topleveltweezijdigedatumvergelijkingsoperatormeervoud : geheleperiodevergelijking? (GELIJK_ZIJN_AAN | ONGELIJK_ZIJN_AAN | LATER_ZIJN_DAN | LATER_OF_GELIJK_ZIJN_AAN | EERDER_OF_GELIJK_ZIJN_AAN | EERDER_ZIJN_DAN);

topleveleenzijdigetekstvergelijkingsoperator : topleveleenzijdigetekstvergelijkingsoperatorenkelvoud | topleveleenzijdigetekstvergelijkingsoperatormeervoud;
topleveleenzijdigetekstvergelijkingsoperatorenkelvoud : geheleperiodevergelijking? (LEEG IS | GEVULD IS | (NUMERIEK_IS_MET_EXACT geheelgetal CIJFERS) | AAN_DE_ELFPROEF VOLDOET);
topleveleenzijdigetekstvergelijkingsoperatormeervoud : geheleperiodevergelijking? (LEEG ZIJN | GEVULD ZIJN | (NUMERIEK_ZIJN_MET_EXACT geheelgetal CIJFERS) | AAN_DE_ELFPROEF VOLDOEN);

topleveltweezijdigetekstvergelijkingsoperator : topleveltweezijdigetekstvergelijkingsoperatorenkelvoud | topleveltweezijdigetekstvergelijkingsoperatormeervoud;
topleveltweezijdigetekstvergelijkingsoperatorenkelvoud : geheleperiodevergelijking? (GELIJK_IS_AAN | ONGELIJK_IS_AAN);
topleveltweezijdigetekstvergelijkingsoperatormeervoud : geheleperiodevergelijking? (GELIJK_ZIJN_AAN | ONGELIJK_ZIJN_AAN);

topleveleenzijdigebooleanvergelijkingsoperator : topleveleenzijdigebooleanvergelijkingsoperatorenkelvoud | topleveleenzijdigebooleanvergelijkingsoperatormeervoud;
topleveleenzijdigebooleanvergelijkingsoperatorenkelvoud : geheleperiodevergelijking? (LEEG IS | GEVULD IS);
topleveleenzijdigebooleanvergelijkingsoperatormeervoud : geheleperiodevergelijking? (LEEG ZIJN | GEVULD ZIJN);

topleveltweezijdigebooleanvergelijkingsoperator : topleveltweezijdigebooleanvergelijkingsoperatorenkelvoud | topleveltweezijdigebooleanvergelijkingsoperatormeervoud;
topleveltweezijdigebooleanvergelijkingsoperatorenkelvoud : geheleperiodevergelijking? (GELIJK_IS_AAN | ONGELIJK_IS_AAN);
topleveltweezijdigebooleanvergelijkingsoperatormeervoud : geheleperiodevergelijking? (GELIJK_ZIJN_AAN | ONGELIJK_ZIJN_AAN);

topleveleenzijdigeobjectvergelijkingsoperator : topleveleenzijdigeobjectvergelijkingsoperatorenkelvoud | topleveleenzijdigeobjectvergelijkingsoperatormeervoud;
topleveleenzijdigeobjectvergelijkingsoperatorenkelvoud : geheleperiodevergelijking? EEN? (rolnaam | kenmerknaam) (IS | HEEFT); // Optional EEN
topleveleenzijdigeobjectvergelijkingsoperatormeervoud : geheleperiodevergelijking? EEN? (rolnaam | kenmerknaam) (ZIJN | HEBBEN); // Optional EEN

topleveltweezijdigeobjectvergelijkingsoperator : topleveltweezijdigeobjectvergelijkingsoperatorenkelvoud | topleveltweezijdigeobjectvergelijkingsoperatormeervoud;
topleveltweezijdigeobjectvergelijkingsoperatorenkelvoud : geheleperiodevergelijking? (GELIJK_IS_AAN | ONGELIJK_IS_AAN);
topleveltweezijdigeobjectvergelijkingsoperatormeervoud : geheleperiodevergelijking? (GELIJK_ZIJN_AAN | ONGELIJK_ZIJN_AAN);

// Operators for conditions inside lists (using 'is', 'zijn', 'voldoet', 'voldoen')
elementairevoorwaarde // Used inside lists (genestevoorwaarde)
    : voorwaardevergelijking
    | consistentievoorwaarde
    ;

voorwaardevergelijking // Used inside lists
    : getalvergelijking
    | objectvergelijking
    | tekstvergelijking
    | datumvergelijking
    | booleanvergelijking
    | periodevergelijkingelementair
    ;

getalvergelijking : (getalexpressie eenzijdigegetalvergelijkingsoperator) | (getalexpressie tweezijdigegetalvergelijkingsoperator getalexpressie);
datumvergelijking : (datumexpressie eenzijdigedatumvergelijkingsoperator) | (datumexpressie tweezijdigedatumvergelijkingsoperator datumexpressie);
tekstvergelijking : (tekstexpressie eenzijdigetekstvergelijkingsoperator) | (tekstexpressie tweezijdigetekstvergelijkingsoperator tekstexpressie);
booleanvergelijking : (booleanexpressie eenzijdigebooleanvergelijkingsoperator) | (booleanexpressie tweezijdigebooleanvergelijkingsoperator booleanexpressie);
objectvergelijking : (objectexpressie eenzijdigeobjectvergelijkingsoperator) | ((objectexpressie | referentie) tweezijdigeobjectvergelijkingsoperator objectexpressie);

consistentievoorwaarde : REGELVERSIE karakterreeks IS (GEVUURD | INCONSISTENT);

periodevergelijkingenkelvoudig // Standalone time condition
    : (VANAF datumexpressie)
    | (VAN datumexpressie TOT datumexpressie)
    | (VAN datumexpressie TOT_EN_MET datumexpressie)
    | (TOT datumexpressie)
    | (TOT_EN_MET datumexpressie)
    ;

periodevergelijkingelementair // Time condition inside a list
    : HET IS_DE_PERIODE periodevergelijkingenkelvoudig
    ;

geheleperiodevergelijking : NIET? GEDURENDE (HET_GEHELE_JAAR | DE_GEHELE_MAAND);

// Operators for conditions inside lists (stellende vorm: 'is', 'zijn', 'heeft', 'hebben', 'voldoet')
eenzijdigegetalvergelijkingsoperator : eenzijdigegetalvergelijkingsoperatorenkelvoud_stellend | eenzijdigegetalvergelijkingsoperatormeervoud_stellend;
eenzijdigegetalvergelijkingsoperatorenkelvoud_stellend : IS geheleperiodevergelijking? (LEEG | GEVULD) | VOLDOET geheleperiodevergelijking? AAN_DE_ELFPROEF;
eenzijdigegetalvergelijkingsoperatormeervoud_stellend : ZIJN geheleperiodevergelijking? (LEEG | GEVULD) | VOLDOEN geheleperiodevergelijking? AAN_DE_ELFPROEF;

tweezijdigegetalvergelijkingsoperator : tweezijdigegetalvergelijkingsoperatorenkelvoud_stellend | tweezijdigegetalvergelijkingsoperatormeervoud_stellend;
tweezijdigegetalvergelijkingsoperatorenkelvoud_stellend : IS geheleperiodevergelijking? (GELIJK_AAN | ONGELIJK_AAN | GROTER_DAN | GROTER_OF_GELIJK_AAN | KLEINER_OF_GELIJK_AAN | KLEINER_DAN);
tweezijdigegetalvergelijkingsoperatormeervoud_stellend : ZIJN geheleperiodevergelijking? (GELIJK_AAN | ONGELIJK_AAN | GROTER_DAN | GROTER_OF_GELIJK_AAN | KLEINER_OF_GELIJK_AAN | KLEINER_DAN);

eenzijdigedatumvergelijkingsoperator : eenzijdigedatumvergelijkingsoperatorenkelvoud_stellend | eenzijdigedatumvergelijkingsoperatormeervoud_stellend;
eenzijdigedatumvergelijkingsoperatorenkelvoud_stellend : IS geheleperiodevergelijking? (LEEG | GEVULD | EEN dagsoortnaam);
eenzijdigedatumvergelijkingsoperatormeervoud_stellend : ZIJN geheleperiodevergelijking? (LEEG | GEVULD | EEN dagsoortnaam);

tweezijdigedatumvergelijkingsoperator : tweezijdigedatumvergelijkingsoperatorenkelvoud_stellend | tweezijdigedatumvergelijkingsoperatormeervoud_stellend;
tweezijdigedatumvergelijkingsoperatorenkelvoud_stellend : IS geheleperiodevergelijking? (GELIJK_AAN | ONGELIJK_AAN | LATER_DAN | LATER_OF_GELIJK_AAN | EERDER_OF_GELIJK_AAN | EERDER_DAN);
tweezijdigedatumvergelijkingsoperatormeervoud_stellend : ZIJN geheleperiodevergelijking? (GELIJK_AAN | ONGELIJK_AAN | LATER_DAN | LATER_OF_GELIJK_AAN | EERDER_OF_GELIJK_AAN | EERDER_DAN);

eenzijdigetekstvergelijkingsoperator : eenzijdigetekstvergelijkingsoperatorenkelvoud_stellend | eenzijdigetekstvergelijkingsoperatormeervoud_stellend;
eenzijdigetekstvergelijkingsoperatorenkelvoud_stellend : IS geheleperiodevergelijking? (LEEG | GEVULD | (NUMERIEK_MET_EXACT geheelgetal CIJFERS)) | VOLDOET geheleperiodevergelijking? AAN_DE_ELFPROEF;
eenzijdigetekstvergelijkingsoperatormeervoud_stellend : ZIJN geheleperiodevergelijking? (LEEG | GEVULD | (NUMERIEK_MET_EXACT geheelgetal CIJFERS)) | VOLDOEN geheleperiodevergelijking? AAN_DE_ELFPROEF;

tweezijdigetekstvergelijkingsoperator : tweezijdigetekstvergelijkingsoperatorenkelvoud_stellend | tweezijdigetekstvergelijkingsoperatormeervoud_stellend;
tweezijdigetekstvergelijkingsoperatorenkelvoud_stellend : IS geheleperiodevergelijking? (GELIJK_AAN | ONGELIJK_AAN);
tweezijdigetekstvergelijkingsoperatormeervoud_stellend : ZIJN geheleperiodevergelijking? (GELIJK_AAN | ONGELIJK_AAN);

eenzijdigebooleanvergelijkingsoperator : eenzijdigebooleanvergelijkingsoperatorenkelvoud_stellend | eenzijdigebooleanvergelijkingsoperatormeervoud_stellend;
eenzijdigebooleanvergelijkingsoperatorenkelvoud_stellend : IS geheleperiodevergelijking? (LEEG | GEVULD);
eenzijdigebooleanvergelijkingsoperatormeervoud_stellend : ZIJN geheleperiodevergelijking? (LEEG | GEVULD);

tweezijdigebooleanvergelijkingsoperator : tweezijdigebooleanvergelijkingsoperatorenkelvoud_stellend | tweezijdigebooleanvergelijkingsoperatormeervoud_stellend;
tweezijdigebooleanvergelijkingsoperatorenkelvoud_stellend : IS geheleperiodevergelijking? (GELIJK_AAN | ONGELIJK_AAN);
tweezijdigebooleanvergelijkingsoperatormeervoud_stellend : ZIJN geheleperiodevergelijking? (GELIJK_AAN | ONGELIJK_AAN);

eenzijdigeobjectvergelijkingsoperator : eenzijdigeobjectvergelijkingsoperatorenkelvoud_stellend | eenzijdigeobjectvergelijkingsoperatormeervoud_stellend;
eenzijdigeobjectvergelijkingsoperatorenkelvoud_stellend : (IS | HEEFT) geheleperiodevergelijking? EEN? (rolnaam | kenmerknaam); // Optional EEN
eenzijdigeobjectvergelijkingsoperatormeervoud_stellend : (ZIJN | HEBBEN) geheleperiodevergelijking? EEN? (rolnaam | kenmerknaam); // Optional EEN

tweezijdigeobjectvergelijkingsoperator : tweezijdigeobjectvergelijkingsoperatorenkelvoud_stellend | tweezijdigeobjectvergelijkingsoperatormeervoud_stellend;
tweezijdigeobjectvergelijkingsoperatorenkelvoud_stellend : IS geheleperiodevergelijking? (GELIJK_AAN | ONGELIJK_AAN);
tweezijdigeobjectvergelijkingsoperatormeervoud_stellend : ZIJN geheleperiodevergelijking? (GELIJK_AAN | ONGELIJK_AAN);

// ----- 13.4.15 Berekening -----
// Incorporated into expression hierarchy for precedence

// ----- 13.4.16 Expressie -----
expressie
    : concatenatie                              # ConcatenationExpr // Handle this at a higher level if needed
    | getalexpressie                            # NumberExpr
    | objectexpressie                           # ObjectExpr
    | datumexpressie                            # DateExpr
    | tekstexpressie                            # TextExpr
    | booleanexpressie                          # BooleanExpr
    | parametermetlidwoord                      # ParameterExpr
    | variabelenaam                             # VariableExpr
    | enumeratiewaarde                          # EnumLiteralExpr // EBNF uses single quotes here
    | LPAREN expressie RPAREN                   # ParenthesizedExpr
    ;

// Handle concatenation at the point of use, e.g., in predicates or initializations
// Example: '<expr1>, <expr2>, ... en <exprN>' or '<expr1>, <expr2>, ... of <exprN>'
concatenatie
    : expressie (COMMA expressie)* (EN | OF) expressie // 'OF' used only in specific 'gelijk aan' context? Handled semantically.
    ;

// Expression hierarchy for precedence (simplified example, expand as needed)
getalexpressie
    : getalexpressie (PLUS | MIN | VERMINDERD_MET) getalexpressie                 # AddSubExpr
    | getalexpressie (MAAL | GEDEELD_DOOR | GEDEELD_DOOR_ABS) getalexpressie      # MulDivExpr
    | getalexpressie TOT_DE_MACHT getalexpressie afronding                       # PowerExpr // Requires afronding
    | DE_WORTEL_VAN getalexpressie afronding                                     # SqrtExpr // Requires afronding
    | getalexpressie PERCENT VAN getalexpressie                                  # PercentageOfExpr // EBNF allows % before 'van'?
    | getalexpressie VAN getalexpressie                                          # PercentageOfExprNoSign // EBNF alternative
    | DE_ABSOLUTE_WAARDE_VAN LPAREN getalexpressie RPAREN                        # AbsValueExpr
    | getalexpressie COMMA begrenzing                                            # BoundedExpr // Added begrenzing
    | getalexpressie afronding                                                   # RoundedExpr // Added afronding
    | (DE_TIJDSDUUR_VAN | DE_ABSOLUTE_TIJDSDUUR_VAN) datumexpressie TOT datumexpressie IN HELE? eenheidmeervoud # TimeDurationExpr
    | HET_JAAR_UIT datumexpressie                                                # YearFromDateExpr
    | DE_MAAND_UIT datumexpressie                                                # MonthFromDateExpr
    | DE_DAG_UIT datumexpressie                                                  # DayFromDateExpr
    | getalaggregatie                                                            # AggregationNumberExpr
    | attribuutvanonderwerp                                                      # AttributeNumberExpr
    | parametermetlidwoord                                                       # ParameterNumberExpr
    | variabelenaam                                                              # VariableNumberExpr
    | getalwaarde                                                                # LiteralNumberExpr
    | REKENJAAR                                                                  # RekenjaarExpr
    | LPAREN getalexpressie RPAREN                                               # ParenthesizedNumberExpr
    // Tijdsafhankelijk specifiek
    | HET_AANTAL_DAGEN_IN (DE_MAAND | HET_JAAR) DAT expressie                    # CountDaysExpr
    ;


datumexpressie
    : datumexpressie (PLUS | MIN) getalexpressie eenheidsafkorting               # DateAddSubTimeExpr
    | DE_EERSTE_PAASDAG_VAN LPAREN jaar RPAREN                                   # EasterDateExpr
    | DE_DATUM_MET_JAAR_MAAND_EN_DAG LPAREN getalexpressie COMMA getalexpressie COMMA getalexpressie RPAREN # DateFromPartsExpr
    | datumaggregatie                                                            # AggregationDateExpr
    | attribuutvanonderwerp                                                      # AttributeDateExpr
    | parametermetlidwoord                                                       # ParameterDateExpr
    | variabelenaam                                                              # VariableDateExpr
    | dedato                                                                     # LiteralDateExpr
    | REKENDATUM                                                                 # RekendatumExpr
    | LPAREN datumexpressie RPAREN                                               # ParenthesizedDateExpr
    ;

objectexpressie
    : kwantificatie? onderwerpketen                                              # ObjectSelectionExpr
    ;

tekstexpressie
    : tekstenwaardereeks                                                         # StringTemplateExpr
    | tekstwaarde                                                                # LiteralStringExpr
    | attribuutvanonderwerp                                                      # AttributeStringExpr
    | parametermetlidwoord                                                       # ParameterStringExpr
    | variabelenaam                                                              # VariableStringExpr
    | LPAREN tekstexpressie RPAREN                                               # ParenthesizedStringExpr
    ;

booleanexpressie
    : booleanwaarde                                                              # LiteralBooleanExpr
    | attribuutvanonderwerp                                                      # AttributeBooleanExpr
    | parametermetlidwoord                                                       # ParameterBooleanExpr
    | variabelenaam                                                              # VariableBooleanExpr
    | LPAREN booleanexpressie RPAREN                                             # ParenthesizedBooleanExpr
    ;


tekstenwaardereeks : TEKSTWAARDE_START (teksttemplate | karakterreeks_no_quotes)+ TEKSTWAARDE_END; // More robust parsing
teksttemplate : TEMPLATE_START expressie TEMPLATE_END;

// Functions are integrated into the expression hierarchy above

afrondingexpressie : getalexpressie afronding; // Handled within getalexpressie
afronding
    : (NAAR_BENEDEN | NAAR_BOVEN | REKENKUNDIG | RICHTING_NUL | WEG_VAN_NUL)
      AFGEROND_OP geheelgetal DECIMALEN
    ;

begrenzingexpressie : getalexpressie COMMA begrenzing; // Handled within getalexpressie
begrenzing
    : (begrenzingminimum EN begrenzingmaximum)
    | begrenzingminimum
    | begrenzingmaximum
    ;
begrenzingminimum : MET_EEN_MINIMUM_VAN getalexpressie;
begrenzingmaximum : MET_EEN_MAXIMUM_VAN getalexpressie;

referentie
    : HIJ                               # BezieldRefPronoun
    | ZIJN attribuutnaam                # BezieldRefPossessiveAttr
    | ZIJN rolnaam                      # BezieldRefPossessiveRole
    | DE DAG                            # DagRef // Used in Dagsoortdefinitie
    | bepaaldlidwoord objecttypenaam    # NietBezieldRef // Or use objecttypemetlidwoord?
    ;


aggregatie
    : getalaggregatie
    | datumaggregatie
    | dimensieaggregatie
    // Tijdsafhankelijk specifiek
    | waardepertijdseenheidaggregatie
    ;

getalaggregatie : getalaggregatiefunctie expressie (OF_NUL_ALS_DIE_ER_NIET_ZIJN)?; // Added optional part
getalaggregatiefunctie : HET_AANTAL | DE_MAXIMALE_WAARDE_VAN | DE_MINIMALE_WAARDE_VAN | DE_SOM_VAN;

datumaggregatie : datumaggregatiefunctie expressie;
datumaggregatiefunctie : DE_EERSTE_VAN | DE_LAATSTE_VAN; // These often take lists via concatenation

dimensieaggregatie : (getalaggregatiefunctie | datumaggregatiefunctie) attribuutvanonderwerp dimensieselectie DOT?; // Allow opt dot

dimensieselectie : OVER (aggregerenoveralledimensies | aggregerenoververzameling | aggregerenoverbereik);
aggregerenoveralledimensies : ALLE dimensienaammeervoud;
aggregerenoververzameling : DE dimensienaammeervoud VANAF dimensiewaarde T_M dimensiewaarde;
aggregerenoverbereik : DE dimensienaammeervoud IN LBRACE dimensiewaarde (COMMA dimensiewaarde)* (EN dimensiewaarde)? RBRACE; // Changed to allow single element

// Tijdsafhankelijke aggregaties/expressies
waardepertijdseenheidaggregatie
    : HET_TOTAAL_VAN expressie (conditiebijexpressie)?
    ;
// tellingaantaldagen is within getalexpressie
tijdsevenredigdeel // Belongs in getalexpressie? Needs context. Assume top-level for now.
    : HET_TIJDSEVENREDIG_DEEL_PER (MAAND | JAAR) VAN expressie conditiebijexpressie
    ;

conditiebijexpressie // Used for time-based expressions like totaal_van, tijdsevenredig_deel
    : (GEDURENDE_DE_TIJD_DAT (toplevelelementairevoorwaarde | toplevelsamengesteldevoorwaarde))
    | periodevergelijkingenkelvoudig
    ;


// ----- 13.2 Standaard syntax patronen -----
// These are used within other rules or directly as literals/tokens

getal : geheelgetal | decimaalgetal | rationeelgetal;

// Base types used in Lexer
geheelgetal : MINUS? DIGIT+;
positiefgeheelgetal : DIGIT+; // Used for number of decimals
decimaalgetal : MINUS? DIGIT+ COMMA DIGIT+;
rationeelgetal : geheelgetal (UNDERSCORE geheelgetal)? SLASH geheelgetal;

letter : UNICODE_LETTER; // Defined in Lexer fragments
leesteken : COMMA | DOT | BANG | QMARK | COLON | SEMI | LPAREN | RPAREN | MINUS;
karakterreeks : TEXT+; // Simple text sequence, potentially multi-word
karakterreeks_no_quotes : ( ~['"'] | '\\"' )+; // Used inside string templates

lidwoord : bepaaldlidwoord | onbepaaldlidwoord;
bepaaldlidwoord : DE | HET;
onbepaaldlidwoord : EEN;

literalexpressie // Handled within main expression rules by type
    : booleanwaarde
    | getalwaarde
    | dedato
    | enumeratiewaarde
    | tekstwaarde
    ;

//enumeratiewaarde : ENUMERATIEWAARDE; // Lexer token
//tekstwaarde : TEKSTWAARDE; // Lexer token
booleanwaarde : WAAR | ONWAAR;
getalwaarde : getal (eenheidsafkorting+ | (eenheidmacht+ SLASH eenheidmacht+))?; // Check unit structure
percentage : getal PERCENT; // Handled within getalwaarde?

dedato : DATO_PREFIX datumwaarde (tijdwaarde)?;
datumwaarde : dag MINUS maand MINUS jaar;
tijdwaarde : uur COLON minuut COLON seconde DOT milliseconde;

dag : DIGIT+; // Validate range semantically
maand : DIGIT+; // Validate range semantically
jaar : DIGIT+; // Validate format semantically
uur : DIGIT DIGIT; // Validate range semantically
minuut : DIGIT DIGIT; // Validate range semantically
seconde : DIGIT DIGIT; // Validate range semantically
milliseconde : DIGIT DIGIT DIGIT; // Validate range semantically

naamwoord : bepaaldlidwoord? naam (LPAREN MV COLON meervoudsvorm RPAREN)?;
naam : IDENTIFIER;
meervoudsvorm : IDENTIFIER;

// ----- Beslistabel Structure (Chapter 12) -----
// Requires more complex parsing, potentially outside the core grammar
// or using semantic actions if trying to embed it.
// Basic structure:
beslistabel
    : BESLISTABEL regelnaam NEWLINE geldigAltijd? tableStructure // Simplify geldig for now
    ;

geldigAltijd : GELDIG ALTIJD;

tableStructure : // Placeholder - ANTLR isn't ideal for table layout parsing
                 // Typically handled by pre-processing or specialized parsing logic
                 // after identifying the BESLISTABEL keyword.
                 // Could attempt to parse rows/columns if format is very strict.
                 NEWLINE tableHeader NEWLINE tableRow+
                 ;

tableHeader : PIPE? tableCellContent (PIPE tableCellContent)* PIPE? ; // Very basic header assumption
tableRow : PIPE? tableCellContent (PIPE tableCellContent)* PIPE? ; // Very basic row assumption
tableCellContent : expressie | karakterreeks+ ; // Content could be anything


// =============================================================================
// Lexer Rules
// =============================================================================

// ----- Keywords (Order matters! Place before IDENTIFIER) -----
// Object/Data Modeling Keywords
OBJECTTYPE : 'Objecttype';
KENMERK : 'kenmerk';
ATTRIBUUT : 'Attribuut'; // Check casing in spec, seems inconsistent? Assume lowercase 'attribuut' generally
BEZIELD : 'bezield';
BIJVOEGLIJK : 'bijvoeglijk';
BEZITTELIJK : 'bezittelijk';
GEDIMENSIONEERD_MET : 'gedimensioneerd met';
NUMERIEK : 'Numeriek';
PERCENTAGE : 'Percentage';
TEKST : 'Tekst';
BOOLEAN : 'Boolean';
DATUM_IN_DAGEN : 'Datum in dagen';
DATUM_EN_TIJD_IN_MILLISECONDES : 'Datum en tijd in millisecondes';
NEGATIEF : 'negatief';
NIET_NEGATIEF : 'niet-negatief';
POSITIEF : 'positief';
GEHEEL_GETAL_SPEC : 'geheel getal'; // Use _SPEC to avoid clash with rule name
GETAL_MET : 'getal met';
DECIMALEN : 'decimalen';
GETAL_SPEC : 'getal'; // Use _SPEC to avoid clash with rule name
MET_EENHEID : 'met eenheid';
DOMEIN : 'Domein';
IS_VAN_HET_TYPE : 'is van het type';
ENUMERATIE : 'Enumeratie';
EENHEIDSSYSTEEM : 'Eenheidsysteem'; // Note single 's' in spec
DIMENSIE : 'Dimensie';
BESTAANDE_UIT_DE : 'bestaande uit de';
NA_HET_ATTRIBUUT_MET_VOORZETSEL : 'na het attribuut met voorzetsel';
VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL : 'voor het attribuut zonder voorzetsel';
PARAMETER : 'Parameter';
FEITTYPE : 'Feittype';
WEDERKERIG_FEITTYPE : 'Wederkerig feittype';
DAGSOORT : 'Dagsoort';
VOOR : 'voor';
ELKE_DAG : 'elke dag';
ELKE_MAAND : 'elke maand';
ELK_JAAR : 'elk jaar';
DAG : 'dag'; // For 'Een dag is ...'

// Rule Keywords
REGEL : 'Regel';
GELDIG : 'geldig';
ALTIJD : 'altijd';
VANAF : 'vanaf';
T_M : 't/m'; // Needs careful lexing if '-' is also an operator
TOT_EN_MET : 'tot en met'; // Multi-word
TOT : 'tot';
IS : 'is';
ZIJN : 'zijn'; // Verb
HEEFT : 'heeft';
HEBBEN : 'hebben'; // Verb
DAARBIJ_GELDT : 'Daarbij geldt:'; // Include colon?
MOET_GESTELD_WORDEN_OP : 'moet gesteld worden op'; // Multi-word
MOET_BEREKEND_WORDEN_ALS : 'moet berekend worden als'; // Multi-word
MET : 'met';
INDIEN : 'indien';
ER : 'er'; // For 'indien er aan...'
AAN : 'aan';
VOLGENDE_VOORWAARDE : 'volgende voorwaarde'; // Multi-word
VOLGENDE_VOORWAARDEN : 'volgende voorwaarden'; // Check if 'n' is optional or separate token needed
VOLGENDE_CRITERIA : 'volgende criteria'; // Multi-word
HET_VOLGENDE_CRITERIUM : 'het volgende criterium'; // Multi-word
VOLDOET : 'voldoet';
VOLDOEN : 'voldoen';
WORDT_VOLDAAN : 'wordt voldaan'; // Multi-word
MOET : 'moet'; // For consistency checks
MOET_WORDEN_VOLDAAN_AAN : 'moet worden voldaan aan'; // Multi-word
MOETEN_UNIEK_ZIJN : 'moeten uniek zijn'; // Multi-word
VERENIGD_MET : 'verenigd met'; // Multi-word
DE_CONCATENATIE_VAN : 'de concatenatie van'; // Multi-word
MOET_GEINITIALISEERD_WORDEN_OP : 'moet geïnitialiseerd worden op'; // Multi-word
WORDT_VERDEELD_OVER : 'wordt verdeeld over'; // Multi-word
WAARBIJ_WORDT_VERDEELD : 'waarbij wordt verdeeld'; // Multi-word
IN_GELIJKE_DELEN : 'in gelijke delen'; // Multi-word
NAAR_RATO_VAN : 'naar rato van'; // Multi-word
OP_VOLGORDE_VAN : 'op volgorde van'; // Multi-word
AFNEMENDE : 'afnemende';
TOENEMENDE : 'toenemende';
BIJ_EVEN_GROOT_CRITERIUM : 'bij even groot criterium'; // Multi-word
MET_EEN_MAXIMUM_VAN : 'met een maximum van'; // Multi-word
AFGEROND_OP : 'afgerond op'; // Multi-word
NAAR_BENEDEN : 'naar beneden'; // Multi-word
NAAR_BOVEN : 'naar boven'; // Multi-word
REKENKUNDIG : 'rekenkundig';
RICHTING_NUL : 'richting nul'; // Multi-word
WEG_VAN_NUL : 'weg van nul'; // Multi-word
ALS_ONVERDEELDE_REST : 'Als onverdeelde rest'; // Multi-word
BLIJFT : 'blijft';
OVER : 'over';
HIJ : 'hij'; // Pronoun
ZIJN : 'zijn'; // Possessive pronoun
DE : 'de';
HET : 'het';
EEN : 'een'; // Article, also used as number 1 word

// Operators and Predicates
PLUS : 'plus';
MIN : 'min';
VERMINDERD_MET : 'verminderd met'; // Multi-word
MAAL : 'maal';
GEDEELD_DOOR : 'gedeeld door'; // Multi-word
GEDEELD_DOOR_ABS : 'gedeeld door (ABS)'; // Special case
TOT_DE_MACHT : 'tot de macht'; // Multi-word
DE_WORTEL_VAN : 'de wortel van'; // Multi-word
VAN : 'van'; // Preposition, also percentage 'van'
PERCENT : '%';
DE_ABSOLUTE_WAARDE_VAN : 'de absolute waarde van'; // Multi-word
DE_TIJDSDUUR_VAN : 'de tijdsduur van'; // Multi-word
DE_ABSOLUTE_TIJDSDUUR_VAN : 'de absolute tijdsduur van'; // Multi-word
IN : 'in';
HELE : 'hele';
DE_EERSTE_PAASDAG_VAN : 'de eerste paasdag van'; // Multi-word
DE_DATUM_MET_JAAR_MAAND_EN_DAG : 'de datum met jaar, maand en dag'; // Multi-word
HET_JAAR_UIT : 'het jaar uit'; // Multi-word
DE_MAAND_UIT : 'de maand uit'; // Multi-word
DE_DAG_UIT : 'de dag uit'; // Multi-word
REKENDATUM : 'Rekendatum';
REKENJAAR : 'Rekenjaar';
HET_AANTAL : 'het aantal';
DE_MAXIMALE_WAARDE_VAN : 'de maximale waarde van'; // Multi-word
DE_MINIMALE_WAARDE_VAN : 'de minimale waarde van'; // Multi-word
DE_SOM_VAN : 'de som van'; // Multi-word
DE_EERSTE_VAN : 'de eerste van'; // Multi-word
DE_LAATSTE_VAN : 'de laatste van'; // Multi-word
OF_NUL_ALS_DIE_ER_NIET_ZIJN : 'of 0 als die er niet zijn'; // For sum aggregation
ALLE : 'alle';
AL : 'al'; // Kwantificatie?
GEEN_VAN_DE : 'geen van de'; // Multi-word
TEN_MINSTE : 'ten minste'; // Multi-word
TEN_HOOGSTE : 'ten hoogste'; // Multi-word
PRECIES : 'precies';
EEN_AANTAL : 'één'; // Keyword for number one
TWEE_AANTAL : 'twee';
DRIE_AANTAL : 'drie';
VIER_AANTAL : 'vier';
GELIJK_IS_AAN : 'gelijk is aan'; // Multi-word
ONGELIJK_IS_AAN : 'ongelijk is aan'; // Multi-word
GROTER_IS_DAN : 'groter is dan'; // Multi-word
GROTER_OF_GELIJK_IS_AAN : 'groter of gelijk is aan'; // Multi-word
KLEINER_IS_DAN : 'kleiner is dan'; // Multi-word
KLEINER_OF_GELIJK_IS_AAN : 'kleiner of gelijk is aan'; // Multi-word
LATER_IS_DAN : 'later is dan'; // Multi-word
LATER_OF_GELIJK_IS_AAN : 'later of gelijk is aan'; // Multi-word
EERDER_IS_DAN : 'eerder is dan'; // Multi-word
EERDER_OF_GELIJK_IS_AAN : 'eerder of gelijk is aan'; // Multi-word
LEEG : 'leeg'; // Keyword for empty value check
GEVULD : 'gevuld';
AAN_DE_ELFPROEF : 'aan de elfproef'; // Multi-word
NUMERIEK_IS_MET_EXACT : 'numeriek is met exact'; // Multi-word
NUMERIEK_ZIJN_MET_EXACT : 'numeriek zijn met exact'; // Multi-word
CIJFERS : 'cijfers';
GELIJK_ZIJN_AAN : 'gelijk zijn aan'; // Plural
ONGELIJK_ZIJN_AAN : 'ongelijk zijn aan'; // Plural
GROTER_ZIJN_DAN : 'groter zijn dan'; // Plural
GROTER_OF_GELIJK_ZIJN_AAN : 'groter of gelijk zijn aan'; // Plural
KLEINER_ZIJN_DAN : 'kleiner zijn dan'; // Plural
KLEINER_OF_GELIJK_ZIJN_AAN : 'kleiner of gelijk zijn aan'; // Plural
LATER_ZIJN_DAN : 'later zijn dan'; // Plural
LATER_OF_GELIJK_ZIJN_AAN : 'later of gelijk zijn aan'; // Plural
EERDER_ZIJN_DAN : 'eerder zijn dan'; // Plural
EERDER_OF_GELIJK_ZIJN_AAN : 'eerder of gelijk zijn aan'; // Plural
LEEG_IS : 'leeg is'; // For toplevel condition
GEVULD_IS : 'gevuld is';
LEEG_ZIJN : 'leeg zijn';
GEVULD_ZIJN : 'gevuld zijn';
REGELVERSIE : 'regelversie';
GEVUURD : 'gevuurd';
INCONSISTENT : 'inconsistent';
GEDURENDE : 'gedurende';
HET_GEHELE_JAAR : 'het gehele jaar'; // Multi-word
DE_GEHELE_MAAND : 'de gehele maand'; // Multi-word
NIET : 'niet'; // For negation
HET_IS_DE_PERIODE : 'het is de periode'; // Multi-word
GEDURENDE_DE_TIJD_DAT : 'gedurende de tijd dat'; // Multi-word
DIE : 'die'; // Subselectie
DAT : 'dat'; // Subselectie
OF : 'of'; // Concatenation alternative in 'gelijk aan'
EN : 'en'; // Concatenation default / logic / list separator

// Tijdsafhankelijke Keywords
HET_TOTAAL_VAN : 'het totaal van'; // Multi-word
HET_AANTAL_DAGEN_IN : 'het aantal dagen in'; // Multi-word
HET_TIJDSEVENREDIG_DEEL_PER : 'het tijdsevenredig deel per'; // Multi-word
MAAND : 'maand';
JAAR : 'jaar';

// Beslistabel Keywords
BESLISTABEL : 'Beslistabel';

// ----- Punctuation & Symbols -----
LPAREN : '(';
RPAREN : ')';
LBRACE : '{';
RBRACE : '}';
SEMI : ';';
COLON : ':';
COMMA : ',';
DOT : '.';
QMARK : '?';
BANG : '!';
PIPE : '|'; // For beslistabel syntax attempt
UNDERSCORE : '_'; // Used in rational numbers
SLASH : '/';
CARET : '^'; // For exponentiation
MINUS : '-'; // Also unary minus? Or part of number literal? Needs care.
BULLET : '•'; // The bullet character
MV : 'mv'; // For plural marker

// String Templates
TEKSTWAARDE_START : '"' -> pushMode(TEMPLATE_MODE);
TEMPLATE_START: '«' -> pushMode(DEFAULT_MODE); // Switch back for expression
fragment TEMPLATE_CHARS: ~[«"]+ ; // Characters inside template string part

mode TEMPLATE_MODE;
    TEMPLATE_END: '»' -> popMode;
    TEMPLATE_STRING_PART: TEMPLATE_CHARS;
    TEKSTWAARDE_END : '"' -> popMode;

// ----- Literals -----
ENUMERATIEWAARDE: '\'' ( ~['\\] | '\\' . )*? '\''; // Single quoted string
TEKSTWAARDE : '"' ( ~["\\] | '\\' . )*? '"'; // Double quoted string (used if not in template mode)
DATO_PREFIX : 'dd.';

// Number literals require careful ordering to avoid ambiguity (e.g., integer vs part of decimal)
// Let parser handle composition from simpler number tokens.
NUMBER : DIGIT+ (',' DIGIT+)?; // Combine integer and decimal format initially

// ----- Identifiers -----
IDENTIFIER
    : UNICODE_LETTER (UNICODE_LETTER | UNICODE_DIGIT | '_')* // Allow underscore
    ;

// ----- Whitespace and Comments -----
WS : [ \t]+ -> skip; // Skip spaces and tabs
NEWLINE : [\r\n]+ ; // Keep newlines as tokens for the parser
TAB : '\t' ; // Keep tabs as tokens where needed by the parser (e.g., 'Daarbij geldt:')

COMMENT : '--' ~[\r\n]* -> skip; // Simple line comment

// ----- Fragments for Lexer Rules -----
fragment UNICODE_LETTER : [\p{L}]; // Any Unicode letter
fragment UNICODE_DIGIT : [\p{Nd}]; // Any Unicode decimal digit
fragment DIGIT : [0-9];

// Basic text fragment for multi-word keywords or descriptions where quotes aren't used
fragment TEXT : (UNICODE_LETTER | UNICODE_DIGIT | '_' | '.' | '-' | '/' | '(' | ')' | '%' | '€')+; // Adjust allowed chars as needed

```

**Explanation and Important Notes:**

1.  **Completeness:** This grammar attempts to cover *all* rules specified in Chapter 13.
2.  **Keywords:** All RegelSpraak keywords identified in the EBNF have been defined as Lexer rules (uppercase). This is crucial for correct parsing. Multi-word keywords are handled as single tokens.
3.  **Identifiers:** A flexible `IDENTIFIER` rule using Unicode letters is included.
4.  **Literals:** Specific lexer rules for different literal types (strings, numbers, booleans) are defined. `NUMBER` might need refinement depending on how `rationeelgetal` interacts with `geheelgetal` and `decimaalgetal`. Parsing them distinctly or combining and letting the parser sort it out are options. The current approach favors distinct parsing rules (`getal`, `decimaalgetal`, etc.). Date/time parsing is complex and relies on the specific `dd.` prefix and format.
5.  **Whitespace/Newlines:** `WS` is skipped, but `NEWLINE` and `TAB` are preserved as tokens for parser rules that depend on them (like object definitions, `Daarbij geldt:`, enumerations).
6.  **Precedence:** Basic precedence for arithmetic operators is suggested using rule hierarchy (`AddSubExpr`, `MulDivExpr`, etc.). You might need to refine this based on the exact rules in Chapter 6.
7.  **Expression Complexity:** The `expressie` rule and its sub-rules (`getalexpressie`, `datumexpressie`, etc.) are the most complex part, reflecting the richness of RegelSpraak expressions. Labels (`#...`) are used to distinguish alternatives for visitor/listener implementation.
8.  **Ambiguity:** The natural language style (`van`, `is`, etc.) means potential ambiguities are high. Testing with real examples is essential. ANTLR will report ambiguities it detects.
9.  **Beslistabels:** Parsing table structures based purely on layout is generally outside the scope of standard context-free grammars like ANTLR's core functionality. The `beslistabel` rule provided is a basic placeholder. You would typically pre-process the input to extract table data or use semantic actions/predicates, which makes the grammar much more complex.
10. **Tijdlijnen/Dimensies:** The syntax for specifying and using these (`gedimensioneerd met`, `voor elke dag`, `over alle dimensies`) is included.
11. **Recursie:** ANTLR handles left-recursion in parser rules like `onderwerpketen` and the expression hierarchy. The note about *semantic* recursion (Section 9.9) being handled by grouping rules is an external constraint, not something directly enforced by this context-free grammar.
12. **Error Messages:** ANTLR provides default error messages. Customizing them requires implementing custom error listeners/strategies.
13. **Testing:** This grammar *must* be tested and refined against actual RegelSpraak examples from the TOKA-casus and other parts of the specification document.

**Next Steps:**

1.  Save this code as `RegelSpraak.g4`.
2.  Use the ANTLR tool to generate the parser in Python or Java (e.g., `antlr4 -Dlanguage=Python3 RegelSpraak.g4 -visitor -o generated`).
3.  Write test code that feeds RegelSpraak text (ensure UTF-8 encoding) to the generated lexer and parser.
4.  Implement a Visitor or Listener to walk the parse tree and build your AST or perform actions.
5.  Refine the grammar based on parsing errors or ambiguities encountered during testing.