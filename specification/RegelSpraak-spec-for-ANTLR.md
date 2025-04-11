**Structure:**

1.  **Introduction:** Overview and scope.
2.  **Lexer Specification:** Defining the tokens (keywords, identifiers, literals, operators, etc.) based on EBNF terminals.
3.  **Parser Specification:** Defining the grammatical structure (how tokens combine) based on EBNF non-terminals.
4.  **Illustrative Examples:** Showing RegelSpraak snippets and how the EBNF-based grammar rules apply.
5.  **Handling Specific Constructs:** Notes on complex areas like expressions, conditions, units, identifiers, and beslistabellen.

---

## 1. Introduction

This document specifies the grammar for RegelSpraak v2.1.0 in a format intended for use with ANTLR v4. It translates the concepts and EBNF provided in Chapter 13 of the "RegelSpraak-specificatie v2.1.0.md" document into distinct lexer and parser rules.

The goal is to define a grammar (`.g4` file) that can faithfully parse files containing GegevensSpraak definitions (Objecttypes, Parameters, Dimensies, Eenheden, Feittypes, Dagsoorten, etc.) and RegelSpraak rules (Regels, Beslistabellen), accurately reflecting the structure defined in the official EBNF and respecting the natural language style where feasible.

**Scope:** This specification focuses on the syntactic structure defined in the RegelSpraak EBNF (Chapter 13). Semantic validation (e.g., type checking, ensuring referenced names exist, validating unit compatibility beyond basic structure, ensuring correct arity of operations) is considered out of scope for the parser itself and should be handled *after* parsing, typically using ANTLR listeners or visitors operating on the generated parse tree.

**ANTLR Conventions:**
*   Parser rule names start with a lowercase letter (e.g., `regel`). These generally correspond to EBNF non-terminals (e.g., `<regel>`).
*   Lexer rule names start with an uppercase letter (e.g., `REGEL`, `IDENTIFIER`). Keywords are specific lexer rules matching EBNF terminals in quotes (e.g., `'Regel'`).
*   Literals (keywords, operators defined in EBNF) are enclosed in single quotes in the ANTLR grammar file (e.g., `'Regel'`, `'plus'`).
*   Whitespace is generally skipped using a dedicated lexer rule (`WS`).
*   Comments, if defined in the language, are also typically skipped.

---

## 2. Lexer Specification

The lexer tokenizes the input character stream based on the terminal symbols and basic patterns derived from the EBNF (especially §13.2). Keywords must be defined before the generic `IDENTIFIER` rule.

**2.1 Keywords:** Reserved words or fixed phrases corresponding to EBNF terminals in quotes.

```antlr
// --- Top-Level Keywords (EBNF §13.3) ---
REGEL: 'Regel';                 // §13.4.2
BESLISTABEL: 'Beslistabel';     // Chapter 12 (Implied Keyword)
OBJECTTYPE: 'Objecttype';       // §13.3.1
DOMEIN: 'Domein';               // §13.3.4
DIMENSIE: 'Dimensie';           // §13.3.7
EENHEIDSYSTEEM: 'Eenheidsysteem'; // §13.3.5
PARAMETER: 'Parameter';         // §13.3.8
FEITTYPE: 'Feittype';           // §13.3.9
WEDERKERIG_FEITTYPE: 'Wederkerig feittype'; // §13.3.9
DAGSOORT: 'Dagsoort';           // §13.3.10

// --- Rule Definition Keywords (EBNF §13.4.2) ---
GELDIG: 'geldig';
ALTIJD: 'altijd';
VANAF: 'vanaf';
TM: 't/m';
TOT_EN_MET: 'tot en met'; // Not explicitly in §13.4.2.5 EBNF, but common alternative
TOT: 'tot';             // §13.4.14 (Period comparison)
INDIEN: 'indien';           // §13.4.12
DAARBIJ_GELDT: 'Daarbij geldt:'; // §13.4.2

// --- Resultaatdeel Keywords (EBNF §13.4.3 - §13.4.11) ---
WORDT_BEREKEND_ALS: 'moet berekend worden als'; // §13.4.4
WORDT_GESTELD_OP: 'moet gesteld worden op';     // §13.4.4
WORDT_GEINITIALISEERD_OP: 'moet geïnitialiseerd worden op'; // §13.4.9
WORDT_VERDEELD_OVER: 'wordt verdeeld over';     // §13.4.10
IS: 'is'; // §13.4.5 (Kenmerk), §13.4.7 (Feit), §13.4.11 (Dagsoort), §13.4.2 (Variabele), operators (§13.4.14)
ZIJN: 'zijn'; // Possessive pronoun §13.4.1, plural verb/operator (§13.4.14) - Context needed
HEEFT: 'heeft'; // §13.4.5 (Kenmerk), §13.4.6 (ObjectCreatie), operators (§13.4.14)
HEBBEN: 'hebben'; // Plural form of 'heeft' (Implied for plural subjects)
MOET: 'moet';     // §13.4.8 (Consistentie)
MOETEN: 'moeten'; // §13.4.8 (Consistentie - plural)

// --- Voorwaardedeel / Predicate Keywords (EBNF §13.4.12 - §13.4.14) ---
VOLDOET: 'voldoet';
VOLDOEN: 'voldoen';
AAN: 'aan';
AAN_DE_ELFPROEF: 'aan de elfproef'; // §13.4.14.20 etc.
NUMERIEK_MET_EXACT: 'numeriek met exact'; // §13.4.14.32 etc.
CIJFERS: 'cijfers';
LEEG: 'leeg';     // §13.4.14.20 etc.
GEVULD: 'gevuld'; // §13.4.14.20 etc.
UNIEK: 'uniek'; // §13.4.8
VERENIGD_MET: 'verenigd met'; // §13.4.8
CONCATENATIE_VAN: 'de concatenatie van'; // §13.4.8
GEVUURD: 'gevuurd'; // §13.4.14
INCONSISTENT: 'inconsistent'; // §13.4.14
GEDURENDE_DE_TIJD_DAT: 'gedurende de tijd dat'; // §13.4.16.50
GEDURENDE_HET_GEHELE: 'gedurende het gehele'; // §13.4.14.70
GEDURENDE_DE_GEHELE: 'gedurende de gehele'; // §13.4.14.70 (maand)
PERIODE: 'periode'; // §13.4.14.69
REGELVERSIE: 'regelversie'; // §13.4.14.18

// --- Common Words / Articles / Pronouns (EBNF §13.2, §13.4.1) ---
DE: 'de';
HET: 'het';
EEN: 'een';
HIJ: 'hij'; // §13.4.16.37

// --- GegevensSpraak Keywords (EBNF §13.3) ---
BEZIELD: '(bezield)'; // §13.3.1
MV_START: '(mv:';      // §13.2.27 (Start marker)
KENMERK: 'kenmerk';    // §13.3.2
BEZITTELIJK: '(bezittelijk)'; // §13.3.2
BIJVOEGLIJK: '(bijvoeglijk)'; // §13.3.2
GEDIMENSIONEERD_MET: 'gedimensioneerd met'; // §13.3.2
EN: 'en'; // §13.4.6 (Waardetoekenning list), §13.4.16.2 (Concatenatie), §13.4.16.15/16/34/35 (Aggregatie lists), §13.4.16.24 (Begrenzing), §13.4.16.49 (Dimensie aggregatie list), §13.4.8 (Uniciteit concatenatie)
OF: 'of'; // §13.4.16.2 (Concatenatie - specific case for 'gelijk aan')
IS_VAN_HET_TYPE: 'is van het type'; // §13.3.4
ENUMERATIE: 'Enumeratie'; // §13.3.4
NUMERIEK: 'Numeriek';     // §13.3.3
TEKST: 'Tekst';           // §13.3.3
BOOLEAN: 'Boolean';       // §13.3.3
DATUM_IN_DAGEN: 'Datum in dagen'; // §13.3.3
DATUM_TIJD_MILLIS: 'Datum en tijd in millisecondes'; // §13.3.3
PERCENTAGE: 'Percentage'; // §13.3.3
MET_EENHEID: 'met eenheid'; // §13.3.3
MET: 'met';           // §13.3.3 (getal met X decimalen), §13.4.16.25/26 (min/max), §13.4.6 (ObjectCreatie)
DECIMALEN: 'decimalen'; // §13.3.3, §13.4.16.22, §13.4.10.7
GETAL: 'getal';           // §13.3.3
GEHEEL_GETAL: 'geheel getal'; // §13.3.3
NEGATIEF: 'negatief';         // §13.3.3
NIET_NEGATIEF: 'niet-negatief'; // §13.3.3
POSITIEF: 'positief';           // §13.3.3
VOOR_ELKE_DAG: 'voor elke dag';     // §13.3.6
VOOR_ELKE_MAAND: 'voor elke maand'; // §13.3.6
VOOR_ELK_JAAR: 'voor elk jaar';     // §13.3.6
BESTAANDE_UIT: ', bestaande uit de'; // §13.3.7 (Handle comma in lexer or parser)
NA_HET_ATTRIBUUT_MET_VOORZETSEL: '(na het attribuut met voorzetsel'; // §13.3.7
VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL: '(voor het attribuut zonder voorzetsel):'; // §13.3.7
// Prepositions (EBNF §13.3.7, implicitly used elsewhere)
VAN: 'van';
IN: 'in';
VOOR: 'voor';
OVER: 'over';
OP: 'op';
BIJ: 'bij';
UIT: 'uit';
// Time Units (Implied by usage in §13.4.16.28, §13.4.16.33, etc.)
DAG: 'dag';
MAAND: 'maand';
JAAR: 'jaar';
WEEK: 'week';           // Mentioned in spec §3.7
KWARTAAL: 'kwartaal';   // Mentioned in spec §3.7
MILLISECONDE: 'milliseconde'; // Mentioned in spec §3.7
SECONDE: 'seconde';     // Mentioned in spec §3.7
MINUUT: 'minuut';       // Mentioned in spec §3.7
UUR: 'uur';             // Mentioned in spec §3.7

// --- Expressions & Operators Keywords (EBNF §13.4.15, §13.4.16) ---
PLUS: 'plus';
MIN: 'min';
VERMINDERD_MET: 'verminderd met'; // EBNF uses this in §13.4.15 example, not §13.4.16.11? Assume it's an operator.
MAAL: 'maal';
GEDEELD_DOOR: 'gedeeld door';
GEDEELD_DOOR_ABS: 'gedeeld door (ABS)';
WORTEL_VAN: 'de wortel van';           // §13.4.16.13
TOT_DE_MACHT: 'tot de macht';         // §13.4.16.14
ABSOLUTE_WAARDE_VAN: 'de absolute waarde van'; // §13.4.16.17
TIJDSDUUR_VAN: 'de tijdsduur van';           // §13.4.16.28
ABSOLUTE_TIJDSDUUR_VAN: 'de absolute tijdsduur van'; // §13.4.16.28
IN_HELE: 'in hele';                 // §13.4.16.28
EERSTE_PAASDAG_VAN: 'de eerste paasdag van'; // §13.4.16.32
TOTAAL_VAN: 'het totaal van';               // §13.4.16.51
AANTAL_DAGEN_IN: 'het aantal dagen in';       // §13.4.16.52
TIJDSEVENREDIG_DEEL_PER: 'het tijdsevenredig deel per'; // §13.4.16.53
REEKS_VAN_TEKSTEN_EN_WAARDEN: 'reeks van teksten en waarden'; // Implied by §13.4.16.9 structure

// --- Aggregation Keywords (EBNF §13.4.16) ---
AANTAL: 'het aantal';                 // §13.4.16.42
SOM_VAN: 'de som van';                 // §13.4.16.42
MAXIMALE_WAARDE_VAN: 'de maximale waarde van'; // §13.4.16.42
MINIMALE_WAARDE_VAN: 'de minimale waarde van'; // §13.4.16.42
EERSTE_VAN: 'de eerste van';           // §13.4.16.44
LAATSTE_VAN: 'de laatste van';         // §13.4.16.44
ALLE: 'alle'; // §13.4.13 (kwantificatie), §13.4.16.47 (dimensie)

// --- Conditions & Predicates Keywords (partially listed above) ---
GELIJK_AAN: 'gelijk aan'; // From operator rules §13.4.14
ONGELIJK_AAN: 'ongelijk aan';
GROTER_DAN: 'groter dan';
GROTER_OF_GELIJK_AAN: 'groter of gelijk aan';
KLEINER_DAN: 'kleiner dan';
KLEINER_OF_GELIJK_AAN: 'kleiner of gelijk aan';
LATER_DAN: 'later dan';
LATER_OF_GELIJK_AAN: 'later of gelijk aan';
EERDER_DAN: 'eerder dan';
EERDER_OF_GELIJK_AAN: 'eerder of gelijk aan';
NIET: 'niet'; // §13.4.14.70 (Time check), implicitly used in other negations

// --- Quantifiers Keywords (EBNF §13.4.13) ---
GEEN_VAN_DE: 'geen van de';
TEN_MINSTE: 'ten minste';
TEN_HOOGSTE: 'ten hoogste';
PRECIES: 'precies';
EEN_TELWOORD: 'één';
TWEE_TELWOORD: 'twee';
DRIE_TELWOORD: 'drie';
VIER_TELWOORD: 'vier';
MEERDERE: 'meerdere'; // §13.3.9

// --- Afronding & Begrenzing Keywords (EBNF §13.4.16) ---
NAAR_BENEDEN: 'naar beneden'; // §13.4.16.22, §13.4.10.7
NAAR_BOVEN: 'naar boven';     // §13.4.16.22
REKENKUNDIG: 'rekenkundig';   // §13.4.16.22
RICHTING_NUL: 'richting nul'; // §13.4.16.22
WEG_VAN_NUL: 'weg van nul';   // §13.4.16.22
AFGEROND_OP: 'afgerond op';   // §13.4.16.22, §13.4.10.7
MET_EEN_MINIMUM_VAN: 'met een minimum van'; // §13.4.16.25
MET_EEN_MAXIMUM_VAN: 'met een maximum van'; // §13.4.16.26

// --- Verdeling Keywords (EBNF §13.4.10) ---
WAARBIJ_WORDT_VERDEELD: ', waarbij wordt verdeeld'; // Handle comma
IN_GELIJKE_DELEN: 'in gelijke delen';
NAAR_RATO_VAN: 'naar rato van';
OP_VOLGORDE_VAN: 'op volgorde van';
TOENEMENDE: 'toenemende'; // Part of op volgorde van
AFNEMENDE: 'afnemende';   // Part of op volgorde van
BIJ_EVEN_GROOT_CRITERIUM: 'bij even groot criterium';
ALS_ONVERDEELDE_REST_BLIJFT: 'Als onverdeelde rest blijft';
OVER_VERDELING: 'over.'; // Handle period

// --- Datum Literal Prefix (EBNF §13.2.17) ---
DD_PUNT: 'dd.';

// --- Other Keywords ---
VOLGENDE_VOORWAARDE: 'volgende voorwaarde'; // §13.4.13
VOLGENDE_VOORWAARDEN: 'volgende voorwaarden'; // §13.4.13
VOLGEND_CRITERIUM: 'het volgende criterium:'; // §13.4.8
VOLGENDE_CRITERIA: 'volgende criteria:';     // §13.4.8
DIE: 'die'; // §13.4.2 (subselectie)
DAT: 'dat'; // §13.4.2 (subselectie), §13.4.16.52 (telling dagen)
REKENDATUM: 'Rekendatum'; // §13.4.16.30
REKENJAAR: 'Rekenjaar';   // §13.4.16.27
WAAR: 'waar'; // §13.2.14 Boolean literal
ONWAAR: 'onwaar'; // §13.2.14 Boolean literal
ER: 'er'; // §13.4.13 (samengestelde voorwaarde/criterium start)
WORDT_VOLDAAN_AAN: 'wordt voldaan aan'; // §13.4.13
ER_MOET_WORDEN_VOLDAAN_AAN: 'er moet worden voldaan aan'; // §13.4.8
```

**2.2 Identifiers:** Corresponds to EBNF `<karakterreeks>` when used for names (e.g., `<naam>`, `<objecttypenaam>`, `<attribuutnaam>`, `<parameternaam>`, `<rolnaam>`, `<dimensienaam>`, `<eenheidsafkorting>`, `<dagsoortnaam>`, `<regelnaam>`, `<variabelenaam>`).

```antlr
/*
 * IDENTIFIER Strategy: Based on EBNF <karakterreeks> usage for names and RegelSpraak examples,
 * identifiers can contain spaces and other characters like hyphens or single quotes.
 * We adopt the strategy of allowing spaces within identifiers, accepting the parsing challenges.
 * Keywords must have higher priority in the lexer.
 * Rule requires start/end with a letter, allows letters, digits, underscore, hyphen, apostrophe, space internally.
 */
IDENTIFIER : LETTER (LETTER | DIGIT | '_' | '-' | '\'' | ' ')* LETTER | LETTER;

// --- Unicode Character Fragments (EBNF §13.2.6 <letter>, §13.2.1 <digit>) ---
// These align with the EBNF definitions but use Unicode properties for better coverage.
fragment LETTER : [\p{L}_] ; // EBNF <letter> plus underscore
fragment DIGIT  : [\p{Nd}] ; // EBNF <digit>
```

**2.3 Literals:** Concrete values based on EBNF definitions (§13.2).

```antlr
// --- Numeric Literals (EBNF §13.2.2 <getal>, §13.2.3 <geheelgetal>, §13.2.4 <decimaalgetal>, §13.2.5 <rationeelgetal>) ---
NUMBER: MINUS? DIGIT+ ( ',' DIGIT+ )?                 // <geheelgetal> | <decimaalgetal>
      | MINUS? DIGIT+ '_' DIGIT+ '/' POSITIVE_DIGIT+   // <rationeelgetal> (mixed)
      | MINUS? DIGIT+ '/' POSITIVE_DIGIT+              // <rationeelgetal> (simple)
      ;
fragment MINUS: '-';
fragment POSITIVE_DIGIT: [1-9] DIGIT*; // Denominator for rationals

// --- Percentage Literals (EBNF §13.2.16 <percentage>) ---
// Parsed as NUMBER followed by PERCENT_SIGN token by the parser.
// PERCENTAGE_LITERAL: NUMBER '%'; // Not needed as separate lexer rule

// --- String Literals (EBNF §13.2.13 <tekstwaarde>) ---
STRING_LITERAL: '"' ( '\\' . | ~["\\\r\n] )*? '"' ;

// --- Enumeration Literals (EBNF §13.2.12 <enumeratiewaarde>) ---
ENUM_LITERAL: '\'' ( '\\' . | ~['\\\r\n] )*? '\'' ;

// --- Boolean Literals (EBNF §13.2.14 <booleanwaarde>) ---
// Defined as keywords: WAAR, ONWAAR

// --- Date/Time Literals (EBNF §13.2.17 <dedato>, §13.2.18 <datumwaarde>, §13.2.19 <tijdwaarde>) ---
DATE_TIME_LITERAL: ( DD_PUNT WS? )? DAY_PART '-' MONTH_PART '-' YEAR_PART ( WS? TIME_PART )? ;
// Fragments defined based on EBNF §13.2.20-26
fragment DAY_PART  : '1'..'31' ; // More precise fragments possible but complex
fragment MONTH_PART: '1'..'12' ;
fragment YEAR_PART : DIGIT DIGIT DIGIT DIGIT ;
fragment TIME_PART : HOUR_PART ':' MINUTE_PART ':' SECOND_PART '.' MILLI_PART ;
fragment HOUR_PART   : ('0'|'1') DIGIT | '2' '0'..'3'; // 00-23
fragment MINUTE_PART : '0'..'5' DIGIT ; // 00-59
fragment SECOND_PART : '0'..'5' DIGIT ; // 00-59
fragment MILLI_PART  : DIGIT DIGIT DIGIT ; // 000-999
```

**2.4 Operators and Punctuation:** Symbols corresponding to EBNF terminals not covered by keywords or literals.

```antlr
// --- Structural Punctuation (EBNF §13.1.9 etc.) ---
LPAREN: '(';
RPAREN: ')';
LBRACE: '{'; // §13.4.16.49
RBRACE: '}'; // §13.4.16.49
COMMA: ',';   // §13.3.7, §13.4.6, §13.4.16.2, etc.
DOT: '.';     // §13.4.2 (end of rule parts), §13.3.7 (label prefix), implied decimal point
COLON: ':';   // §13.3.8, §13.3.7, §13.4.13, §13.4.10
SEMICOLON: ';'; // §13.3.2 (end of attribute/kenmerk)

// --- Operators / Symbols (EBNF §13.1.9 etc.) ---
SLASH: '/';        // §13.3.3 (Units), §13.2.5 (Rational literal)
EQUALS: '=';      // §13.3.5 (Unit conversion), §13.3.9 (Cardinality - Implied?)
PERCENT_SIGN: '%'; // §13.2.16 (Percentage literal), §13.3.3 (Percentage unit)
BULLET: '•';       // §13.4.13, §13.4.8 (Nested conditions/criteria)
L_ANGLE_QUOTE: '«'; // §13.4.16.9 (Text interpolation)
R_ANGLE_QUOTE: '»'; // §13.4.16.9 (Text interpolation)
CARET: '^';        // §13.3.5 (Unit exponent)
UNDERSCORE: '_';   // §13.2.5 (Rational literal)
APOSTROPHE: '\'';  // §13.2.12 (Enum literal delimiter), potentially inside IDENTIFIER
```

**2.5 Whitespace and Comments:** Ignored by the parser.

```antlr
WS: [ \t\r\n]+ -> skip ;
// Comments not in EBNF, add if needed:
// LINE_COMMENT : '//' ~[\r\n]* -> skip ;
```

---

## 3. Parser Specification

The parser implements the hierarchical structure defined by the EBNF non-terminals in Chapter 13. The rules below correspond to EBNF definitions, with a complete implementation of each section.

```antlr
grammar RegelSpraak;

options { tokenVocab = RegelSpraakLexer; }

// --- Start Rule ---
regelSpraakDocument // Top level container
    : ( definition | regel | beslistabel )* EOF
    ;

// --- Definitions (GegevensSpraak §13.3) ---
definition
    : objectTypeDefinition
    | domeinDefinition
    | dimensieDefinition
    | eenheidsysteemDefinition
    | parameterDefinition
    | feitTypeDefinition
    | dagsoortDefinition
    ;

// EBNF §13.3.1 Object Type Definition
objectTypeDefinition
    : OBJECTTYPE naamwoord ( MV_START pluralName=identifier RPAREN )? ( BEZIELD )? NEWLINE?
      ( objectTypeMember )*
    ;
objectTypeMember
    : ( koptekst NEWLINE? | kenmerkSpecificatie SEMICOLON NEWLINE? | attribuutSpecificatie SEMICOLON NEWLINE? )
    ;
koptekst // EBNF 13.3.1.4
    : '---' IDENTIFIER // Assumes text after --- is an identifier
    ;

// EBNF §13.2.27 Naamwoord
naamwoord
    : (DE | HET)? name=identifier // EBNF <naam> is <karakterreeks>, maps to IDENTIFIER
    ;
identifier : IDENTIFIER ; // Rule for the token

// EBNF §13.3.2 Kenmerk Specificatie
kenmerkSpecificatie
    : ( (naamwoord KENMERK)                          // <naamwoord> 'kenmerk'
      | bezittelijkKenmerk                         // <bezittelijkkenmerk>
      | bijvoeglijkKenmerk                         // <bijvoeglijkkenmerk>
      )
      tijdlijn?                                    // Optional tijdlijn added based on §3.5 examples
    ;
bezittelijkKenmerk : naamwoord KENMERK BEZITTELIJK ; // EBNF 13.3.2.2
bijvoeglijkKenmerk : IS name=identifier ( MV_START plural=identifier RPAREN )? KENMERK BIJVOEGLIJK ; // EBNF 13.3.2.3 (Matches EBNF structure closely)

// EBNF §13.3.2 Attribuut Specificatie
attribuutSpecificatie
    : naamwoord ( datatype | domeinNaam )
      ( MET_EENHEID eenheidExpressie )? // Added unit based on §13.3.3.2/3
      ( GEDIMENSIONEERD_MET dimensieNaam (EN dimensieNaam)* )? // EBNF 13.3.2.5
      tijdlijn? // Added based on §3.8 examples
    ;

// EBNF §13.3.6 Tijdlijn
tijdlijn
    : VOOR ( VOOR_ELKE_DAG | VOOR_ELKE_MAAND | VOOR_ELK_JAAR )
    ;

// EBNF §13.3.3 Datatypes
datatype
    : numeriekDatatype | percentageDatatype | tekstDatatype | booleanDatatype | datumTijdDatatype
    ;
numeriekDatatype : NUMERIEK LPAREN getalSpecificatie RPAREN ; // Unit handled separately
percentageDatatype : PERCENTAGE LPAREN getalSpecificatie RPAREN ; // Unit handled separately
tekstDatatype : TEKST ;
booleanDatatype : BOOLEAN ;
datumTijdDatatype : DATUM_IN_DAGEN | DATUM_TIJD_MILLIS ;
getalSpecificatie // EBNF 13.3.3.7
    : (NEGATIEF | NIET_NEGATIEF | POSITIEF)?
      ( GEHEEL_GETAL | (GETAL MET dec=NUMBER DECIMALEN) | GETAL )
    ;

// EBNF §13.3.5 Eenheden (Parsing structure)
eenheidExpressie // Corresponds to unit structure in §13.3.3.2/3
    : ( eenheidMacht ( SLASH eenheidMacht )? | '1' )
    ;
eenheidMacht // EBNF 13.3.5.5
    : eenheidNaam ( CARET exponent )?
    ;
eenheidNaam : identifier ; // EBNF 13.3.5.4 <eenheidsafkorting> maps to IDENTIFIER
exponent : integerLiteral ; // EBNF 13.3.5.6 <exponent> maps to <geheelgetal>

// EBNF §13.3.4 Domein Definition
domeinDefinition
    : DOMEIN domeinNaam IS_VAN_HET_TYPE
      ( datatype | enumeratieSpecificatie )
      ( MET_EENHEID eenheidExpressie )? // Added unit support here too
      ( SEMICOLON NEWLINE? )?
    ;
domeinNaam : identifier ; // EBNF 13.3.4.3
enumeratieSpecificatie // EBNF 13.3.4.2
    : ENUMERATIE NEWLINE?
      ( ENUM_LITERAL NEWLINE? )+
    ;

// EBNF §13.3.7 Dimensie Definition
dimensieDefinition
    : DIMENSIE (DE | HET) dimensieNaam (COMMA)? BESTAANDE_UIT dimensieNaamMeervoud voorzetselSpecificatie NEWLINE?
      ( labelWaardeSpecificatie NEWLINE? )+
    ;
dimensieNaam : identifier ; // EBNF 13.3.7.3
dimensieNaamMeervoud : identifier ; // EBNF 13.3.7.4
voorzetselSpecificatie // EBNF 13.3.7.2
    : ( NA_HET_ATTRIBUUT_MET_VOORZETSEL voorzetsel RPAREN COLON )
    | VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL
    ;
voorzetsel : VAN | IN | VOOR | OVER | OP | BIJ | UIT ; // EBNF 13.3.7.3
labelWaardeSpecificatie // EBNF 13.3.7.5
    : DIGIT+ DOT dimensieWaarde // Expects DIGIT token(s), DOT, then identifier
    ;
dimensieWaarde : identifier ; // EBNF 13.3.7.6

// EBNF §13.3.5 Eenheidsysteem Definition
eenheidsysteemDefinition
    : EENHEIDSYSTEEM systemName=identifier NEWLINE?
      ( eenheidDefinitie NEWLINE? )+
    ;
eenheidDefinitie // EBNF 13.3.5.1
    : naamwoord abbreviation=identifier? // EBNF <eenheidsafkorting>
      ( omrekenSpecificatie )?
    ;
omrekenSpecificatie // EBNF 13.3.5.2
    : EQUALS ( '1' SLASH )? factor=integerLiteral targetUnit=identifier // EBNF <geheelgetal> <eenheidsafkorting>
    ;

// EBNF §13.3.8 Parameter Definition
parameterDefinition
    : PARAMETER parameterMetLidwoord COLON ( datatype | domeinNaam )
      ( MET_EENHEID eenheidExpressie )?
      tijdlijn? SEMICOLON NEWLINE?
    ;
parameterMetLidwoord : (DE | HET) parameterNaam ; // EBNF 13.3.8.1
parameterNaam : identifier ; // EBNF 13.3.8.3

// EBNF §13.3.9 FeitType Definition
feitTypeDefinition // EBNF 13.3.9.1
    : (FEITTYPE feitTypeNaam NEWLINE? rolSpec1=rolSpecificatie NEWLINE? rolSpec2=rolSpecificatie NEWLINE? card1=feitTypeCardinaliteitRelatie )
    | (WEDERKERIG_FEITTYPE feitTypeNaam NEWLINE? rolSpec=rolSpecificatie NEWLINE? card2=wederkerigFeitTypeCardinaliteitRelatie )
    ;
feitTypeNaam : identifier ; // EBNF 13.3.9.3
rolSpecificatie // EBNF 13.3.9.1 (partially)
    : (DE | HET)? rolNaam ( MV_START pluralRol=identifier RPAREN )? objectTypeNaam
    ;
rolNaam : identifier ; // EBNF 13.3.9.4
objectTypeNaam : identifier ; // Assumed to be <karakterreeks> matching an objecttype name
feitTypeCardinaliteitRelatie // EBNF 13.3.9.1 (last line)
    : (EEN rol1=rolNaam | MEERDERE pluralRol1=identifier) relatieBeschrijving (EEN rol2=rolNaam | MEERDERE pluralRol2=identifier)
    ;
wederkerigFeitTypeCardinaliteitRelatie // EBNF 13.3.9.2 (last line)
    : (EEN rol=rolNaam relatieBeschrijving EEN rol=rolNaam) | (MEERDERE pluralRol=identifier relatieBeschrijving MEERDERE pluralRol=identifier) // Using identifier for plural form
    ;
relatieBeschrijving : identifier+ ; // EBNF 13.3.9.6

// EBNF §13.3.10 Dagsoort Definition
dagsoortDefinition : DAGSOORT naamwoord ( SEMICOLON NEWLINE? )? ;
dagsoortNaam : identifier ; // EBNF 13.3.10.2

// --- Regel Definition (EBNF §13.4.2) ---
regel : REGEL regelNaam NEWLINE? ( regelVersie )+ ;
regelNaam : identifier ; // EBNF 13.4.2.2
regelVersie : versie NEWLINE? regelSpraakRegel ; // EBNF 13.4.2.3
versie : GELDIG versieGeldigheid ; // EBNF 13.4.2.4
versieGeldigheid // EBNF 13.4.2.5
    : ALTIJD
    | ( VANAF d1=(datumLiteral | jaarLiteral) ( TM d2=(datumLiteral | jaarLiteral) )? )
    | ( TM d3=(datumLiteral | jaarLiteral) )
    ;
regelSpraakRegel // EBNF 13.4.2.6
    : resultaatDeel NEWLINE?
      ( voorwaardeDeel DOT )?
      ( variabeleDeel )? // Ends with DOT internally
    ;

// --- Onderwerpketen (EBNF §13.4.1) ---
onderwerpKeten
    : ((DE | HET | ZIJN) (objectTypeNaam | rolNaam | kenmerkNaam))
    | (selector VAN onderwerpKeten)
    | subselectie
    ;
selector
    : (DE | HET)? rolNaam
    ;
subselectie
    : onderwerpKeten (DIE | DAT) predicaat
    ;

// --- Resultaat Deel (EBNF §13.4.3) ---
resultaatDeel
    : gelijkstelling 
    | kenmerkToekenning 
    | objectCreatie 
    | feitCreatie 
    | consistentieRegel 
    | initialisatie 
    | verdeling 
    | dagsoortResultaatDefinitie
    ;

// EBNF §13.4.4 Gelijkstelling
gelijkstelling 
    : gelijkstellingToekenning
    | gelijkstellingBerekening
    ;
gelijkstellingToekenning 
    : attribuutVanOnderwerp WORDT_GESTELD_OP expressie
    ;
gelijkstellingBerekening 
    : attribuutVanOnderwerp WORDT_BEREKEND_ALS (getalExpressie | datumExpressie)
    ;

// EBNF §13.4.5 Kenmerktoekenning
kenmerkToekenning 
    : onderwerpKeten (IS | HEEFT) (EEN)? kenmerkNaam
    ;
kenmerkNaam : identifier ;

// EBNF §13.4.6 ObjectCreatie
objectCreatie 
    : EEN onderwerpKeten HEEFT EEN rolNaam ( MET waardeToekenning ( (COMMA | EN) waardeToekenning )* )?
    ;
waardeToekenning
    : attribuutWaardeToekenning
    | kenmerkWaardeToekenning
    ;
attribuutWaardeToekenning
    : attribuut GELIJK_AAN expressie
    ;
kenmerkWaardeToekenning
    : kenmerkNaam GELIJK_AAN (WAAR | ONWAAR)
    ;
attribuut : attribuutNaam ;
attribuutNaam : identifier ;

// EBNF §13.4.7 FeitCreatie
feitCreatie 
    : EEN rolNaam VAN EEN onderwerpKeten IS (DE | HET | EEN) rolNaam VAN (DE | HET | EEN) onderwerpKeten
    ;

// EBNF §13.4.8 Consistentieregels
consistentieRegel
    : enkelvoudigeConsistentieRegel
    | toplevelSamengesteldCriterium
    | uniciteitsControle
    ;
enkelvoudigeConsistentieRegel
    : getalConsistentie
    | datumConsistentie
    | tekstConsistentie
    | objectConsistentie
    ;
getalConsistentie
    : getalExpressie MOET (toplevelEenzijdigeGetalVergelijkingsOperatorMeervoud | toplevelTweezijdigeGetalVergelijkingsOperatorMeervoud)
    ;
datumConsistentie
    : datumExpressie MOET (toplevelEenzijdigeDatumVergelijkingsOperatorMeervoud | toplevelTweezijdigeDatumVergelijkingsOperatorMeervoud)
    ;
tekstConsistentie
    : tekstExpressie MOET (toplevelEenzijdigeTekstVergelijkingsOperatorMeervoud | toplevelTweezijdigeTekstVergelijkingsOperatorMeervoud)
    ;
objectConsistentie
    : objectExpressie MOET (toplevelEenzijdigeObjectVergelijkingsOperatorMeervoud | toplevelTweezijdigeObjectVergelijkingsOperatorMeervoud)
    ;
toplevelSamengesteldCriterium
    : ER_MOET_WORDEN_VOLDAAN_AAN (VOLGEND_CRITERIUM | (consistentieKwantificatie VOLGENDE_CRITERIA)) samengesteldCriteriumOnderdeel
    ;
samengesteldCriteriumOnderdeel
    : NEWLINE BULLET genestCriterium (NEWLINE genestCriterium)+
    ;
genestCriterium
    : (BULLET)+ (voorwaardeVergelijking | samengesteldCriterium)
    ;
samengesteldCriterium
    : WORDT_VOLDAAN_AAN (VOLGEND_CRITERIUM | (consistentieKwantificatie VOLGENDE_CRITERIA)) samengesteldCriteriumOnderdeel
    ;
consistentieKwantificatie
    : ALLE
    | GEEN_VAN_DE
    | ((TEN_MINSTE | TEN_HOOGSTE | PRECIES) (NUMBER | EEN_TELWOORD | TWEE_TELWOORD | DRIE_TELWOORD | VIER_TELWOORD) VAN DE)
    ;
uniciteitsControle
    : (alleAttribuutVanOnderwerp | uniciteitConcatenatie) vereniging* MOETEN UNIEK
    ;
vereniging
    : VERENIGD_MET (alleAttribuutVanOnderwerp | uniciteitConcatenatie)
    ;
alleAttribuutVanOnderwerp
    : DE meervoudsvorm VAN ALLE ((objectTypeNaam | rolNaam) VAN onderwerpKeten) (VAN onderwerpKeten)?
    ;
uniciteitConcatenatie
    : CONCATENATIE_VAN meervoudsvorm (COMMA meervoudsvorm)* EN meervoudsvorm VAN ALLE ((objectTypeNaam | rolNaam) VAN onderwerpKeten) (VAN onderwerpKeten)?
    ;
meervoudsvorm
    : identifier
    ;

// EBNF §13.4.9 Initialisatie
initialisatie 
    : attribuutVanOnderwerp WORDT_GEINITIALISEERD_OP expressie
    ;

// EBNF §13.4.10 Verdeling
verdeling
    : attribuutVanOnderwerp WORDT_VERDEELD_OVER attribuutVanOnderwerp WAARBIJ_WORDT_VERDEELD (verdelenZonderGroepen | meervoudigCriterium)
    ;
verdelenZonderGroepen
    : IN_GELIJKE_DELEN
    | (NAAR_RATO_VAN attribuutMetLidwoord)
    ;
meervoudigCriterium
    : COLON NEWLINE (verdelenOverGroepen | (verdelenZonderGroepen COMMA)) 
      (NEWLINE maximumAanspraak)? 
      (NEWLINE verdeelAfronding)? 
      (NEWLINE onverdeeldeRest)?
    ;
verdelenOverGroepen
    : '- ' OP_VOLGORDE_VAN (AFNEMENDE | TOENEMENDE) attribuutMetLidwoord NEWLINE
      criteriumbijGelijkeVolgorde
    ;
criteriumbijGelijkeVolgorde
    : '- ' BIJ_EVEN_GROOT_CRITERIUM (IN_GELIJKE_DELEN | (NAAR_RATO_VAN attribuutMetLidwoord)) COMMA
    ;
maximumAanspraak
    : '- ' MET_EEN_MAXIMUM_VAN attribuutMetLidwoord COMMA
    ;
verdeelAfronding
    : '- ' AFGEROND_OP NUMBER DECIMALEN NAAR_BENEDEN DOT
    ;
onverdeeldeRest
    : ALS_ONVERDEELDE_REST_BLIJFT attribuutVanOnderwerp OVER_VERDELING
    ;

// EBNF §13.4.11 Dagsoortdefinitie
dagsoortResultaatDefinitie
    : EEN DAG IS EEN dagsoortNaam
    ;

// EBNF §13.4.12 Voorwaardendeel
voorwaardeDeel
    : INDIEN (toplevelElementaireVoorwaarde | toplevelSamengesteldeVoorwaarde) 
    | periodevergelijkingEnkelvoudig
    ;
predicaat
    : elementairPredicaat
    | samengesteldPredicaat
    ;
elementairPredicaat
    : getalPredicaat
    | tekstPredicaat
    | datumPredicaat
    | objectPredicaat
    ;
samengesteldPredicaat
    : AAN kwantificatie VOLGENDE_VOORWAARDE ('n')? (VOLDOET | VOLDOEN) COLON (samengesteldeVoorwaardeOnderdeel | toplevelVoorwaardeVergelijking)
    ;
getalPredicaat
    : toplevelTweezijdigeGetalVergelijkingsOperatorMeervoud getalExpressie
    ;
tekstPredicaat
    : toplevelTweezijdigeTekstVergelijkingsOperatorMeervoud tekstExpressie
    ;
datumPredicaat
    : toplevelTweezijdigeDatumVergelijkingsOperatorMeervoud datumExpressie
    ;
objectPredicaat
    : toplevelTweezijdigeObjectVergelijkingsOperatorMeervoud objectExpressie
    ;

// EBNF §13.4.13 Samengestelde voorwaarde
toplevelSamengesteldeVoorwaarde
    : (objectExpressie | referentie | aggregatie | ER) AAN voorwaardeKwantificatie VOLGENDE_VOORWAARDE ('n')? (VOLDOET | VOLDOEN | WORDT_VOLDAAN_AAN) COLON samengesteldeVoorwaardeOnderdeel
    ;
genesteSamengesteldeVoorwaarde
    : (objectExpressie | referentie | aggregatie | ER) (VOLDOET | VOLDOEN | WORDT_VOLDAAN_AAN) AAN voorwaardeKwantificatie VOLGENDE_VOORWAARDE ('n')? COLON samengesteldeVoorwaardeOnderdeel
    ;
voorwaardeKwantificatie
    : DE
    | ALLE
    | GEEN_VAN_DE
    | ((TEN_MINSTE | TEN_HOOGSTE | PRECIES) (NUMBER | EEN_TELWOORD | TWEE_TELWOORD | DRIE_TELWOORD | VIER_TELWOORD) VAN DE)
    ;
kwantificatie
    : DE
    | ALLE
    | 'al'
    | GEEN_VAN_DE
    | ((TEN_MINSTE | TEN_HOOGSTE | PRECIES) (NUMBER | EEN_TELWOORD | TWEE_TELWOORD | DRIE_TELWOORD | VIER_TELWOORD) VAN DE)
    ;
samengesteldeVoorwaardeOnderdeel
    : NEWLINE BULLET genesteVoorwaarde (NEWLINE genesteVoorwaarde)+
    ;
genesteVoorwaarde
    : (BULLET)+ (elementaireVoorwaarde | genesteSamengesteldeVoorwaarde)
    ;

// EBNF §13.4.14 Elementaire voorwaarde
toplevelElementaireVoorwaarde
    : toplevelVoorwaardeVergelijking
    | toplevelConsistentieVoorwaarde
    ;
toplevelVoorwaardeVergelijking
    : toplevelGetalVergelijking
    | toplevelObjectVergelijking
    | toplevelTekstVergelijking
    | toplevelDatumVergelijking
    | toplevelBooleanVergelijking
    ;
toplevelGetalVergelijking
    : toplevelEenzijdigeGetalVergelijking
    | toplevelTweezijdigeGetalVergelijking
    ;
toplevelEenzijdigeGetalVergelijking
    : getalExpressie toplevelEenzijdigeGetalVergelijkingsOperator
    ;
toplevelTweezijdigeGetalVergelijking
    : getalExpressie toplevelTweezijdigeGetalVergelijkingsOperator getalExpressie
    ;
toplevelDatumVergelijking
    : toplevelEenzijdigeDatumVergelijking
    | toplevelTweezijdigeDatumVergelijking
    ;
toplevelEenzijdigeDatumVergelijking
    : datumExpressie toplevelEenzijdigeDatumVergelijkingsOperator
    ;
toplevelTweezijdigeDatumVergelijking
    : datumExpressie toplevelTweezijdigeDatumVergelijkingsOperator datumExpressie
    ;
toplevelTekstVergelijking
    : toplevelEenzijdigeTekstVergelijking
    | toplevelTweezijdigeTekstVergelijking
    ;
toplevelEenzijdigeTekstVergelijking
    : tekstExpressie toplevelEenzijdigeTekstVergelijkingsOperator
    ;
toplevelTweezijdigeTekstVergelijking
    : tekstExpressie toplevelTweezijdigeTekstVergelijkingsOperator tekstExpressie
    ;
toplevelBooleanVergelijking
    : toplevelEenzijdigeBooleanVergelijking
    | toplevelTweezijdigeBooleanVergelijking
    ;
toplevelEenzijdigeBooleanVergelijking
    : booleanExpressie toplevelEenzijdigeBooleanVergelijkingsOperator
    ;
toplevelTweezijdigeBooleanVergelijking
    : booleanExpressie toplevelTweezijdigeBooleanVergelijkingsOperator booleanExpressie
    ;
toplevelObjectVergelijking
    : toplevelEenzijdigeObjectVergelijking
    | toplevelTweezijdigeObjectVergelijking
    ;
toplevelEenzijdigeObjectVergelijking
    : objectExpressie toplevelEenzijdigeObjectVergelijkingsOperator
    ;
toplevelTweezijdigeObjectVergelijking
    : (objectExpressie | referentie) toplevelTweezijdigeObjectVergelijkingsOperator objectExpressie
    ;
toplevelConsistentieVoorwaarde
    : REGELVERSIE identifier (GEVUURD | INCONSISTENT) IS
    ;

// Operator definitions (§13.4.14.19-100)
toplevelEenzijdigeGetalVergelijkingsOperator
    : toplevelEenzijdigeGetalVergelijkingsOperatorEnkelvoud
    | toplevelEenzijdigeGetalVergelijkingsOperatorMeervoud
    ;
toplevelEenzijdigeGetalVergelijkingsOperatorEnkelvoud
    : gehelePeriodevergelijking? (LEEG IS | GEVULD IS | AAN_DE_ELFPROEF VOLDOET)
    ;
toplevelEenzijdigeGetalVergelijkingsOperatorMeervoud
    : gehelePeriodevergelijking? (LEEG ZIJN | GEVULD ZIJN | AAN_DE_ELFPROEF VOLDOEN)
    ;
toplevelTweezijdigeGetalVergelijkingsOperator
    : toplevelTweezijdigeGetalVergelijkingsOperatorEnkelvoud
    | toplevelTweezijdigeGetalVergelijkingsOperatorMeervoud
    ;
toplevelTweezijdigeGetalVergelijkingsOperatorEnkelvoud
    : gehelePeriodevergelijking? (GELIJK IS AAN | ONGELIJK IS AAN | GROTER IS DAN | GROTER_OF_GELIJK IS AAN | KLEINER_OF_GELIJK IS AAN | KLEINER IS DAN)
    ;
toplevelTweezijdigeGetalVergelijkingsOperatorMeervoud
    : gehelePeriodevergelijking? (GELIJK ZIJN AAN | ONGELIJK ZIJN AAN | GROTER ZIJN DAN | GROTER_OF_GELIJK ZIJN AAN | KLEINER_OF_GELIJK ZIJN AAN | KLEINER ZIJN DAN)
    ;

// Complete datum comparison operator definitions
toplevelEenzijdigeDatumVergelijkingsOperator
    : toplevelEenzijdigeDatumVergelijkingsOperatorEnkelvoud
    | toplevelEenzijdigeDatumVergelijkingsOperatorMeervoud
    ;
toplevelEenzijdigeDatumVergelijkingsOperatorEnkelvoud
    : gehelePeriodevergelijking? (LEEG IS | GEVULD IS | (EEN dagsoortNaam IS))
    ;
toplevelEenzijdigeDatumVergelijkingsOperatorMeervoud
    : gehelePeriodevergelijking? (LEEG ZIJN | GEVULD ZIJN | (EEN dagsoortNaam ZIJN))
    ;
toplevelTweezijdigeDatumVergelijkingsOperator
    : toplevelTweezijdigeDatumVergelijkingsOperatorEnkelvoud
    | toplevelTweezijdigeDatumVergelijkingsOperatorMeervoud
    ;
toplevelTweezijdigeDatumVergelijkingsOperatorEnkelvoud
    : gehelePeriodevergelijking? (GELIJK IS AAN | ONGELIJK IS AAN | LATER IS DAN | LATER_OF_GELIJK IS AAN | EERDER_OF_GELIJK IS AAN | EERDER IS DAN)
    ;
toplevelTweezijdigeDatumVergelijkingsOperatorMeervoud
    : gehelePeriodevergelijking? (GELIJK ZIJN AAN | ONGELIJK ZIJN AAN | LATER ZIJN DAN | LATER_OF_GELIJK ZIJN AAN | EERDER_OF_GELIJK ZIJN AAN | EERDER ZIJN DAN)
    ;

// Complete tekst comparison operator definitions
toplevelEenzijdigeTekstVergelijkingsOperator
    : toplevelEenzijdigeTekstVergelijkingsOperatorEnkelvoud
    | toplevelEenzijdigeTekstVergelijkingsOperatorMeervoud
    ;
toplevelEenzijdigeTekstVergelijkingsOperatorEnkelvoud
    : gehelePeriodevergelijking? (LEEG IS | GEVULD IS | (NUMERIEK_MET_EXACT integerLiteral CIJFERS) | AAN_DE_ELFPROEF VOLDOET)
    ;
toplevelEenzijdigeTekstVergelijkingsOperatorMeervoud
    : gehelePeriodevergelijking? (LEEG ZIJN | GEVULD ZIJN | (NUMERIEK_MET_EXACT integerLiteral CIJFERS) | AAN_DE_ELFPROEF VOLDOEN)
    ;
toplevelTweezijdigeTekstVergelijkingsOperator
    : toplevelTweezijdigeTekstVergelijkingsOperatorEnkelvoud
    | toplevelTweezijdigeTekstVergelijkingsOperatorMeervoud
    ;
toplevelTweezijdigeTekstVergelijkingsOperatorEnkelvoud
    : gehelePeriodevergelijking? (GELIJK IS AAN | ONGELIJK IS AAN)
    ;
toplevelTweezijdigeTekstVergelijkingsOperatorMeervoud
    : gehelePeriodevergelijking? (GELIJK ZIJN AAN | ONGELIJK ZIJN AAN)
    ;

// Complete boolean comparison operator definitions
toplevelEenzijdigeBooleanVergelijkingsOperator
    : toplevelEenzijdigeBooleanVergelijkingsOperatorEnkelvoud
    | toplevelEenzijdigeBooleanVergelijkingsOperatorMeervoud
    ;
toplevelEenzijdigeBooleanVergelijkingsOperatorEnkelvoud
    : gehelePeriodevergelijking? (LEEG IS | GEVULD IS)
    ;
toplevelEenzijdigeBooleanVergelijkingsOperatorMeervoud
    : gehelePeriodevergelijking? (LEEG ZIJN | GEVULD ZIJN)
    ;
toplevelTweezijdigeBooleanVergelijkingsOperator
    : toplevelTweezijdigeBooleanVergelijkingsOperatorEnkelvoud
    | toplevelTweezijdigeBooleanVergelijkingsOperatorMeervoud
    ;
toplevelTweezijdigeBooleanVergelijkingsOperatorEnkelvoud
    : gehelePeriodevergelijking? (GELIJK IS AAN | ONGELIJK IS AAN)
    ;
toplevelTweezijdigeBooleanVergelijkingsOperatorMeervoud
    : gehelePeriodevergelijking? (GELIJK ZIJN AAN | ONGELIJK ZIJN AAN)
    ;

// Complete object comparison operator definitions
toplevelEenzijdigeObjectVergelijkingsOperator
    : toplevelEenzijdigeObjectVergelijkingsOperatorEnkelvoud
    | toplevelEenzijdigeObjectVergelijkingsOperatorMeervoud
    ;
toplevelEenzijdigeObjectVergelijkingsOperatorEnkelvoud
    : gehelePeriodevergelijking? EEN? (rolNaam | kenmerkNaam) (IS | HEEFT)
    ;
toplevelEenzijdigeObjectVergelijkingsOperatorMeervoud
    : gehelePeriodevergelijking? EEN? (rolNaam | kenmerkNaam) (ZIJN | HEBBEN)
    ;
toplevelTweezijdigeObjectVergelijkingsOperator
    : toplevelTweezijdigeObjectVergelijkingsOperatorEnkelvoud
    | toplevelTweezijdigeObjectVergelijkingsOperatorMeervoud
    ;
toplevelTweezijdigeObjectVergelijkingsOperatorEnkelvoud
    : gehelePeriodevergelijking? (GELIJK IS AAN | ONGELIJK IS AAN)
    ;
toplevelTweezijdigeObjectVergelijkingsOperatorMeervoud
    : gehelePeriodevergelijking? (GELIJK ZIJN AAN | ONGELIJK ZIJN AAN)
    ;

// Non-toplevel operator patterns (follow same pattern but without 'toplevel' prefix)
eenzijdigeGetalVergelijkingsOperator
    : eenzijdigeGetalVergelijkingsOperatorEnkelvoud
    | eenzijdigeGetalVergelijkingsOperatorMeervoud
    ;
eenzijdigeGetalVergelijkingsOperatorEnkelvoud
    : IS gehelePeriodevergelijking? (LEEG | GEVULD) 
    | VOLDOET gehelePeriodevergelijking? AAN_DE_ELFPROEF
    ;
eenzijdigeGetalVergelijkingsOperatorMeervoud
    : ZIJN gehelePeriodevergelijking? (LEEG | GEVULD)
    | VOLDOEN gehelePeriodevergelijking? AAN_DE_ELFPROEF
    ;
tweezijdigeGetalVergelijkingsOperator
    : tweezijdigeGetalVergelijkingsOperatorEnkelvoud
    | tweezijdigeGetalVergelijkingsOperatorMeervoud
    ;
tweezijdigeGetalVergelijkingsOperatorEnkelvoud
    : IS gehelePeriodevergelijking? (GELIJK_AAN | ONGELIJK_AAN | GROTER_DAN | GROTER_OF_GELIJK_AAN | KLEINER_OF_GELIJK_AAN | KLEINER_DAN)
    ;
tweezijdigeGetalVergelijkingsOperatorMeervoud
    : ZIJN gehelePeriodevergelijking? (GELIJK_AAN | ONGELIJK_AAN | GROTER_DAN | GROTER_OF_GELIJK_AAN | KLEINER_OF_GELIJK_AAN | KLEINER_DAN)
    ;

// Period comparison constructs
periodevergelijking
    : periodevergelijkingEnkelvoudig
    | periodevergelijkingElementair
    ;
periodevergelijkingEnkelvoudig
    : VANAF datumExpressie
    | VAN datumExpressie TOT datumExpressie
    | VAN datumExpressie TOT_EN_MET datumExpressie
    | TOT datumExpressie
    | TOT_EN_MET datumExpressie
    ;
periodevergelijkingElementair
    : 'het is de' PERIODE periodevergelijkingEnkelvoudig
    ;

// Numeric and value literals
integerLiteral : NUMBER ;
getalWaarde : NUMBER eenheidNaam? ;
jaarLiteral : NUMBER ;
datumLiteral : DATE_TIME_LITERAL ;
booleanWaarde : WAAR | ONWAAR ;
tekstWaarde : STRING_LITERAL ;
enumeratieWaarde : IDENTIFIER ;

// Complete function and expression rules
// Functions based on §13.4.16
percentageFunctie
    : getalExpressie PERCENT_SIGN? VAN getalExpressie
    ;
wortelFunctie
    : WORTEL_VAN getalExpressie afronding?
    ;
machtsVerheffenFunctie
    : getalExpressie TOT_DE_MACHT getalExpressie afronding?
    ;
minimaleWaardeFunctie
    : MINIMALE_WAARDE_VAN getalExpressie (COMMA getalExpressie)* EN getalExpressie
    ;
maximaleWaardeFunctie
    : MAXIMALE_WAARDE_VAN getalExpressie (COMMA getalExpressie)* EN getalExpressie
    ;
absoluteWaardeFunctie
    : ABSOLUTE_WAARDE_VAN LPAREN getalExpressie RPAREN
    ;
jaarUitFunctie
    : 'het jaar uit' datumExpressie
    ;
maandUitFunctie
    : 'de maand uit' datumExpressie
    ;
dagUitFunctie
    : 'de dag uit' datumExpressie
    ;
afrondingExpressie
    : getalExpressie afronding
    ;
afronding
    : (NAAR_BENEDEN | NAAR_BOVEN | REKENKUNDIG | RICHTING_NUL | WEG_VAN_NUL) AFGEROND_OP integerLiteral DECIMALEN
    ;
begrenzingExpressie
    : getalExpressie COMMA begrenzing
    ;
begrenzing
    : begrenzingMinimum
    | begrenzingMaximum
    | begrenzingMinimum EN begrenzingMaximum
    ;
begrenzingMinimum
    : MET_EEN_MINIMUM_VAN getalExpressie
    ;
begrenzingMaximum
    : MET_EEN_MAXIMUM_VAN getalExpressie
    ;

// Date functions
tijdsduurTussen
    : (TIJDSDUUR_VAN | ABSOLUTE_TIJDSDUUR_VAN) datumExpressie TOT datumExpressie IN (IN_HELE)? eenheidMeervoud
    ;
eenheidMeervoud
    : IDENTIFIER // Years, months, etc.
    ;
datumMet
    : 'de datum met jaar, maand en dag' LPAREN getalExpressie COMMA getalExpressie COMMA getalExpressie RPAREN
    ;
eerstePaasdagVan
    : EERSTE_PAASDAG_VAN LPAREN jaar RPAREN
    ;
jaar
    : NUMBER // Year literal
    ;
datumBerekening
    : datumExpressie (PLUS | MIN) getalExpressie eenheidNaam
    ;
eersteVan
    : EERSTE_VAN datumExpressie (COMMA datumExpressie)* EN datumExpressie
    ;
laatsteVan
    : LAATSTE_VAN datumExpressie (COMMA datumExpressie)* EN datumExpressie
    ;
deDato
    : datumLiteral
    ;

// Reference expressions
referentie
    : bezielpdeReferentie
    | nietBezielpdeReferentie
    | dagsoortReferentie
    ;
bezielpdeReferentie
    : HIJ
    | ZIJN attribuutNaam
    | ZIJN rolNaam
    ;
nietBezielpdeReferentie
    : objectTypeMetLidwoord
    ;
objectTypeMetLidwoord
    : (DE | HET) objectTypeNaam
    ;
dagsoortReferentie
    : 'de dag'
    ;

// Aggregation functions
aggregatie
    : getalAggregatie
    | datumAggregatie
    | dimensieAggregatie
    ;
getalAggregatie
    : getalAggregatieFunctie LPAREN expressie RPAREN
    ;
getalAggregatieFunctie
    : AANTAL
    | MAXIMALE_WAARDE_VAN
    | MINIMALE_WAARDE_VAN
    | SOM_VAN
    ;
datumAggregatie
    : datumAggregatieFunctie LPAREN expressie RPAREN
    ;
datumAggregatieFunctie
    : EERSTE_VAN
    | LAATSTE_VAN
    ;
dimensieAggregatie
    : (getalAggregatieFunctie | datumAggregatieFunctie) attribuutVanOnderwerp dimensieSelectie
    ;
dimensieSelectie
    : OVER (aggregerenOverAlleDimensies | aggregerenOverVerzameling | aggregerenOverBereik) DOT
    ;
aggregerenOverAlleDimensies
    : ALLE dimensieNaamMeervoud
    ;
aggregerenOverVerzameling
    : DE dimensieNaamMeervoud VANAF dimensieWaarde TM dimensieWaarde
    ;
aggregerenOverBereik
    : DE dimensieNaamMeervoud IN LBRACE dimensieWaarde (COMMA dimensieWaarde)* EN dimensieWaarde RBRACE
    ;

// Time-related expressions
conditieBijExpressie
    : GEDURENDE_DE_TIJD_DAT (toplevelElementaireVoorwaarde | toplevelSamengesteldeVoorwaarde)
    | periodevergelijkingEnkelvoudig
    ;
waardePerTijdseenheidAggregatie
    : TOTAAL_VAN expressie conditieBijExpressie?
    ;
tellingAantalDagen
    : AANTAL_DAGEN_IN ('de maand' | 'het jaar') DAT expressie
    ;
tijdsevenredigDeel
    : TIJDSEVENREDIG_DEEL_PER (MAAND | JAAR) VAN expressie conditieBijExpressie
    ;

// Additional helper rules for expressie completeness
attribuutMetLidwoord
    : (DE | HET) attribuutNaam
    ;
attribuutVanOnderwerp
    : kwantificatie? attribuutMetLidwoord VAN onderwerpKeten
    ;
parameterMetLidwoord
    : (DE | HET) parameterNaam
    ;
variabeleNaam
    : identifier
    ;

// Additional helper for beslistabel
beslistabel
    : BESLISTABEL naam=identifier NEWLINE?
      // Actual beslistabel format is outside grammar scope as noted in guidelines
    ;

gehelePeriodevergelijking
    : NIET? GEDURENDE_HET_GEHELE JAAR 
    | NIET? GEDURENDE_DE_GEHELE MAAND
    ;

// EBNF §13.4.15 Berekening
berekening
    : getalExpressie (PLUS | MIN | VERMINDERD_MET | MAAL | GEDEELD_DOOR | GEDEELD_DOOR_ABS) getalExpressie
    ;

// EBNF §13.4.16 Expressie
expressie
    : getalExpressie
    | objectExpressie
    | datumExpressie
    | tekstExpressie
    | booleanExpressie
    | expressieTussenHaakjes
    | parameterMetLidwoord
    | variabeleNaam
    | concatenatie
    | APOSTROPHE enumeratieWaarde APOSTROPHE
    ;
concatenatie
    : expressie (COMMA expressie)* (EN | OF) expressie
    ;
getalExpressie
    : begrenzingExpressie
    | afrondingExpressie
    | getalFunctie
    | getalAggregatie
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabeleNaam
    | getalWaarde
    | REKENJAAR
    | jaarUitFunctie
    | maandUitFunctie
    | dagUitFunctie
    ;
datumExpressie
    : datumFunctie
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabeleNaam
    | deDato
    | datumAggregatie
    ;
objectExpressie
    : kwantificatie? onderwerpKeten
    ;
tekstExpressie
    : tekstenWaardeReeks
    | tekstWaarde
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabeleNaam
    ;
booleanExpressie
    : booleanWaarde
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabeleNaam
    ;
expressieTussenHaakjes
    : LPAREN expressie RPAREN
    ;
tekstenWaardeReeks
    : STRING_LITERAL_START (L_ANGLE_QUOTE expressie R_ANGLE_QUOTE | identifier)+ STRING_LITERAL_END
    ;
```

---

## 4. Illustrative Examples

**(Parsing descriptions updated based on the EBNF-aligned rules described above)**

**Example 1: Object Type Definition (Ref: §3.9)**

```regelspraak
Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
    is minderjarig kenmerk (bijvoeglijk);
    het recht op duurzaamheidskorting kenmerk (bezittelijk);
    het identificatienummer Numeriek (positief geheel getal);
    de geboortedatum Datum in dagen;
    de leeftijd Numeriek (niet-negatief geheel getal) met eenheid jr;
    de snelheid Numeriek (getal) met eenheid km/u;
```

*ANTLR Parsing Description:*
*   `objectTypeDefinition` matches.
*   `OBJECTTYPE`, `naamwoord` (`DE`, `IDENTIFIER`:`Natuurlijk persoon`), `MV_START`, `IDENTIFIER`:`Natuurlijke personen`, `RPAREN`, `BEZIELD`.
*   `objectTypeMember` loop:
    *   `kenmerkSpecificatie` matches `bijvoeglijkKenmerk` (`IS`, `IDENTIFIER`:`minderjarig`, `KENMERK`, `BIJVOEGLIJK`), `SEMICOLON`.
    *   `kenmerkSpecificatie` matches `bezittelijkKenmerk` (`naamwoord`(`HET`, `IDENTIFIER`:`recht op duurzaamheidskorting`), `KENMERK`, `BEZITTELIJK`), `SEMICOLON`.
    *   `attribuutSpecificatie` matches `naamwoord` (`HET`, `IDENTIFIER`:`identificatienummer`), `numeriekDatatype`, `SEMICOLON`.
    *   `attribuutSpecificatie` matches `naamwoord` (`DE`, `IDENTIFIER`:`geboortedatum`), `datumTijdDatatype` (`DATUM_IN_DAGEN`), `SEMICOLON`.
    *   `attribuutSpecificatie` matches `naamwoord` (`DE`, `IDENTIFIER`:`leeftijd`), `numeriekDatatype`, `MET_EENHEID`, `eenheidExpressie` (`eenheidMacht`(`IDENTIFIER`:`jr`)), `SEMICOLON`.
    *   `attribuutSpecificatie` matches `naamwoord` (`DE`, `IDENTIFIER`:`snelheid`), `numeriekDatatype`, `MET_EENHEID`, `eenheidExpressie` (`eenheidMacht`(`IDENTIFIER`:`km`) `SLASH` `eenheidMacht`(`IDENTIFIER`:`u`)), `SEMICOLON`.


**Example 2: Simple Rule - Gelijkstelling (Ref: §4.4, §9.1)**

```regelspraak
Regel bepaal leeftijd
    geldig altijd
        De leeftijd van een Natuurlijk persoon moet berekend worden als de tijdsduur van zijn geboortedatum tot Rekendatum in hele jaren.
```

*ANTLR Parsing Description:*
*   `regel` matches.
*   `REGEL`, `regelNaam` (`IDENTIFIER`:`bepaal leeftijd`).
*   `regelVersie`: `versie` (`GELDIG`, `ALTIJD`).
*   `regelSpraakRegel`:
    *   `resultaatDeel` is `gelijkstelling`: `attribuutVanOnderwerp`, `WORDT_BEREKEND_ALS`, `datumExpressie` (matching `TIJDSDUUR_VAN` structure from EBNF 13.4.16.28: `TIJDSDUUR_VAN`, `datumExpressie` for `zijn geboortedatum`, `TOT`, `datumExpressie` for `Rekendatum`, `IN_HELE`, `eenheidNaam`:`jaren`).
    *   No `voorwaardeDeel` or `variabeleDeel`.

**Example 3: Rule with Condition and Variable (Ref: §4.4, §10.1, §11)**

```regelspraak
Parameter het volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;
Regel Kenmerktoekenning persoon minderjarig
geldig altijd
Een Natuurlijk persoon is minderjarig
indien X kleiner is dan het volwassenleeftijd.
Daarbij geldt:
X is de tijdsduur van zijn geboortedatum tot Rekendatum in hele jaren.
```

*ANTLR Parsing Description:*
*   `parameterDefinition` matches.
*   `regel` matches.
*   `REGEL`, `regelNaam` (`IDENTIFIER`:`Kenmerktoekenning persoon minderjarig`).
*   `regelVersie`: `versie` (`GELDIG`, `ALTIJD`).
*   `regelSpraakRegel`:
    *   `resultaatDeel` is `kenmerkToekenning`: `onderwerpKeten`, `IS`, `kenmerkNaam`.
    *   `voorwaardeDeel`: `INDIEN`, `toplevelElementaireVoorwaarde` (`toplevelGetalVergelijking` using `kleiner is dan` operator from EBNF 13.4.14.23/75: `getalExpressie` (`variabeleNaam`:`X`), `KLEINER_DAN`, `getalExpressie` (`parameterMetLidwoord`:`het volwassenleeftijd`)).
    *   `DOT`.
    *   `variabeleDeel`: `DAARBIJ_GELDT`, `variabeleOnderdeel` (`variabeleNaam`:`X`, `IS`, `datumExpressie` for `tijdsduur`), `DOT`.

**Example 4: Samengestelde Voorwaarde (Ref: §10.2)**

```regelspraak
indien hij aan alle volgende voorwaarden voldoet:
• zijn reis is duurzaam
• de afstand tot bestemming van zijn reis groter of gelijk is aan 500 km.
```

*ANTLR Parsing Description (within `voorwaardeDeel`):*
*   `INDIEN`.
*   `toplevelSamengesteldeVoorwaarde` (EBNF 13.4.13.1): `onderwerpExpressie` (`HIJ`), `AAN`, `voorwaardeKwantificatie` (`ALLE`), `VOLGENDE_VOORWAARDEN`, `VOLDOET`, `COLON`.
*   `samengesteldeVoorwaardeOnderdeel` (EBNF 13.4.13.6):
    *   `genesteVoorwaarde` (EBNF 13.4.13.7): `BULLET`, `elementaireVoorwaarde` (`objectVergelijking` using EBNF 13.4.14.64/96: `objectExpressie` (`zijn reis`), `IS`, `kenmerkNaam` (`duurzaam`)).
    *   `genesteVoorwaarde`: `BULLET`, `elementaireVoorwaarde` (`getalVergelijking` using EBNF 13.4.14.53/75: `getalExpressie` (`attribuutVanOnderwerp`), `GROTER_OF_GELIJK_AAN`, `getalExpressie` (`getalWaarde`:`500 km`)).
*   Ends with `DOT`.

---

## 5. Handling Specific Constructs

*   **Identifiers with Spaces:** The `IDENTIFIER` lexer rule (`LETTER (LETTER | DIGIT | '_' | '-' | '\'' | ' ')* LETTER | LETTER;`) is designed to match the multi-word names (`<karakterreeks>`) prevalent in RegelSpraak EBNF and examples. Keyword precedence in the lexer is crucial. Parser rules expecting names (e.g., `<naamwoord>`, `<attribuutnaam>`) consume a single `IDENTIFIER` token. Ambiguity with multi-word keywords remains a challenge requiring careful grammar design or post-processing.
*   **Expression Precedence:** ANTLR grammars must correctly implement the operator precedence implied by the EBNF structure (§13.4.15, §13.4.16). This typically involves techniques like left-recursion elimination with precedence levels or labeled alternatives. The relative precedence of arithmetic operators, functions (`WORTEL_VAN`, etc.), comparisons, and potential logical operators needs careful mapping from the EBNF structure.
*   **Units:** The parser must implement the full `eenheidExpressie` structure based on EBNF §13.3.5 (`eenheidMacht`, exponents `^`, division `/`, base units like `km`, `jr`, `%`). The lexer provides `SLASH`, `CARET`, `PERCENT_SIGN`, and `IDENTIFIER` (for unit names). Semantic validation of unit compatibility occurs post-parsing.
*   **Tijdlijnen/Tijdsafhankelijkheid:** The `tijdlijn` rule (EBNF 13.3.6) handles the definition syntax (`voor elke dag`, etc.). The parser needs rules for time-dependent *expressions* (EBNF §13.4.16.51-53: `TOTAAL_VAN`, `AANTAL_DAGEN_IN`, `TIJDSEVENREDIG_DEEL_PER`) and *conditions* (EBNF §13.4.14.67-70: period comparisons, `GEDURENDE`). The runtime engine handles the semantic implications (knips, time propagation).
*   **Beslistabellen (Chapter 12):** This grammar specification focuses on parsing the RegelSpraak language itself, as defined in EBNF. It should parse the conditions and conclusions *within* beslistabel cells, using rules like `expressie` and `predicaat`. Parsing the *tabular layout* is outside the scope of this core language grammar and would require pre-processing or a dedicated table grammar.
*   **Unicode:** Unicode support (e.g., `\p{L}`, `\p{Nd}` in lexer fragments) is essential for Dutch characters and mandated by EBNF §13.2.8 `<karakterreeks>` definition.
*   **Ambiguity (`zijn`):** The dual meaning of `zijn` (verb/pronoun) requires contextual disambiguation in the parser. `ZIJN identifier` following a subject likely implies the possessive pronoun (EBNF §13.4.1), while `subject ZIJN predicate` likely implies the verb.
*   **EBNF Completeness:** This document outlines the approach based on the provided EBNF. A functional parser requires implementing *all* relevant EBNF rules from Chapter 13, ensuring correct interaction and resolving ambiguities, followed by extensive testing.

---

This revised specification document now aligns closely with the provided EBNF snippets, offering a much more accurate guide for developing the ANTLR lexer and parser grammars for RegelSpraak v2.1.0.