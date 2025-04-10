grammar RegelSpraak;

// --- Lexer Rules ---

// --- Top-Level Keywords ---
REGEL: 'Regel';
BESLISTABEL: 'Beslistabel';
OBJECTTYPE: 'Objecttype';
DOMEIN: 'Domein';
DIMENSIE: 'Dimensie';
EENHEIDSYSTEEM: 'Eenheidsysteem';
PARAMETER: 'Parameter';
FEITTYPE: 'Feittype';
WEDERKERIG_FEITTYPE: 'Wederkerig feittype';
DAGSOORT: 'Dagsoort';

// --- Rule Keywords ---
GELDIG: 'geldig';
ALTIJD: 'altijd';
VANAF: 'vanaf';
TM: 't/m';
TOT_EN_MET: 'tot en met';
TOT: 'tot';
INDIEN: 'indien';
DAARBIJ_GELDT: 'Daarbij geldt:';
WORDT_BEREKEND_ALS: 'moet berekend worden als';
WORDT_GESTELD_OP: 'moet gesteld worden op';
WORDT_GEINITIALISEERD_OP: 'moet geïnitialiseerd worden op';
WORDT_VERDEELD_OVER: 'wordt verdeeld over';
IS: 'is';
ZIJN_WERKWOORD: 'zijn';
HEEFT: 'heeft';
HEBBEN: 'hebben';
MOET: 'moet';
MOETEN: 'moeten';
VOLDOET: 'voldoet';
VOLDOEN: 'voldoen';
AAN: 'aan';
DE: 'de';
HET: 'het';
EEN: 'een';
HIJ: 'hij';
ZIJN_BEZITTELIJK: 'zijn' WS+ {getText().equals("zijn ")};
GEDURENDE_DE_TIJD_DAT: 'gedurende de tijd dat';

// --- Data Types & Structures ---
BEZIELD: '(bezield)';
MV: '(mv:';
KENMERK: 'kenmerk';
BEZITTELIJK: '(bezittelijk)';
BIJVOEGLIJK: '(bijvoeglijk)';
GEDIMENSIONEERD_MET: 'gedimensioneerd met';
EN: 'en';
OF: 'of';
IS_VAN_HET_TYPE: 'is van het type';
ENUMERATIE: 'Enumeratie';
NUMERIEK: 'Numeriek';
TEKST: 'Tekst';
BOOLEAN: 'Boolean';
DATUM_IN_DAGEN: 'Datum in dagen';
DATUM_TIJD_MILLIS: 'Datum en tijd in millisecondes';
PERCENTAGE: 'Percentage';
MET_EENHEID: 'met eenheid';
DECIMALEN: 'decimalen';
GETAL: 'getal';
GEHEEL_GETAL: 'geheel getal';
NEGATIEF: 'negatief';
NIET_NEGATIEF: 'niet-negatief';
POSITIEF: 'positief';
VOOR_ELKE_DAG: 'voor elke dag';
VOOR_ELKE_MAAND: 'voor elke maand';
VOOR_ELK_JAAR: 'voor elk jaar';
BESTAANDE_UIT: ', bestaande uit de';

// --- Prepositions and Articles ---
VAN: 'van';
IN: 'in';
VOOR: 'voor';
OVER: 'over';
OP: 'op';
BIJ: 'bij';
UIT: 'uit';

// --- Time Units ---
DAG: 'dag';
MAAND: 'maand';
JAAR: 'jaar';
WEEK: 'week';
KWARTAAL: 'kwartaal';
MILLISECONDE: 'milliseconde';
SECONDE: 'seconde';
MINUUT: 'minuut';
UUR: 'uur';

// --- Operators ---
PLUS: 'plus';
MIN: 'min';
VERMINDERD_MET: 'verminderd met';
MAAL: 'maal';
GEDEELD_DOOR: 'gedeeld door';
GEDEELD_DOOR_ABS: 'gedeeld door (ABS)';
WORTEL_VAN: 'de wortel van';
TOT_DE_MACHT: 'tot de macht';
ABSOLUTE_WAARDE_VAN: 'de absolute waarde van';
TIJDSDUUR_VAN: 'de tijdsduur van';
ABSOLUTE_TIJDSDUUR_VAN: 'de absolute tijdsduur van';
IN_HELE: 'in hele';
EERSTE_PAASDAG_VAN: 'de eerste paasdag van';
NAAR_BENEDEN: 'naar beneden';
NAAR_BOVEN: 'naar boven';
REKENKUNDIG: 'rekenkundig';
AFGEROND_OP: 'afgerond op';
EQUALS: '=';

// --- Aggregation ---
AANTAL: 'het aantal';
SOM_VAN: 'de som van';
MAXIMALE_WAARDE_VAN: 'de maximale waarde van';
MINIMALE_WAARDE_VAN: 'de minimale waarde van';
EERSTE_VAN: 'de eerste van';
LAATSTE_VAN: 'de laatste van';
ALLE: 'alle';

// --- Conditions & Predicates ---
GELIJK_AAN: 'gelijk aan';
ONGELIJK_AAN: 'ongelijk aan';
GROTER_DAN: 'groter dan';
GROTER_OF_GELIJK_AAN: 'groter of gelijk aan';
KLEINER_DAN: 'kleiner dan';
KLEINER_OF_GELIJK_AAN: 'kleiner of gelijk aan';
LATER_DAN: 'later dan';
LATER_OF_GELIJK_AAN: 'later of gelijk aan';
EERDER_DAN: 'eerder dan';
EERDER_OF_GELIJK_AAN: 'eerder of gelijk aan';
LEEG: 'leeg';
GEVULD: 'gevuld';
NIET: 'niet';

// --- Quantifiers ---
GEEN_VAN_DE: 'geen van de';
TEN_MINSTE: 'ten minste';
TEN_HOOGSTE: 'ten hoogste';
PRECIES: 'precies';

// --- Punctuation ---
LPAREN: '(';
RPAREN: ')';
LBRACE: '{';
RBRACE: '}';
COMMA: ',';
DOT: '.';
COLON: ':';
SEMICOLON: ';';
SLASH: '/';
PERCENT_SIGN: '%';
BULLET: '•';
L_ANGLE_QUOTE: '«';
R_ANGLE_QUOTE: '»';
CARET: '^';

// --- Literals ---
fragment DIGIT: [0-9];
fragment LETTER: [a-zA-ZáàâéèêíìîóòôúùûüïÁÀÂÉÈÊÍÌÎÓÒÔÚÙÛÜÏ];
NUMBER: '-'? DIGIT+ (',' DIGIT+)? | '-'? DIGIT+ '_' DIGIT+ '/' DIGIT+ | '-'? DIGIT+ '/' DIGIT+;
IDENTIFIER: LETTER (LETTER | DIGIT | '_' | '-' | ' ')* LETTER | LETTER;
STRING_LITERAL: '"' (~["\r\n\\] | '\\' .)*? '"';
ENUM_LITERAL: '\'' (~['\r\n\\] | '\\' .)*? '\'';
DATE_TIME_LITERAL: 'dd.' WS? DIGIT DIGIT? '-' DIGIT DIGIT? '-' DIGIT DIGIT DIGIT DIGIT (WS? DIGIT DIGIT ':' DIGIT DIGIT ':' DIGIT DIGIT '.' DIGIT DIGIT DIGIT)?;

// --- Whitespace ---
WS: [ \t\r\n]+ -> skip;

// --- Parser Rules ---

// Top-level rules
regelSpraakDocument
    : (definition | regel | beslistabel)* EOF
    ;

definition
    : objectTypeDefinition
    | domeinDefinition
    | dimensieDefinition
    | eenheidsysteemDefinition
    | parameterDefinition
    | feitTypeDefinition
    | dagsoortDefinition
    ;

// Object Type Definition
objectTypeDefinition
    : OBJECTTYPE naamwoord BEZIELD? (NEWLINE objectTypeMember)+
    ;

objectTypeMember
    : kenmerkSpecificatie
    | attribuutSpecificatie
    ;

naamwoord
    : (DE | HET)? identifier (MV identifier RPAREN)?
    ;

identifier
    : IDENTIFIER
    ;

kenmerkSpecificatie
    : ((naamwoord KENMERK)
    | (naamwoord KENMERK BEZITTELIJK)
    | (IS identifier (MV identifier RPAREN)? KENMERK BIJVOEGLIJK))
    tijdlijn? SEMICOLON
    ;

attribuutSpecificatie
    : naamwoord (datatype | domeinNaam) (GEDIMENSIONEERD_MET dimensieNaam (EN dimensieNaam)*)? tijdlijn? SEMICOLON
    ;

// Data Types
datatype
    : numeriekDatatype
    | percentageDatatype
    | tekstDatatype
    | booleanDatatype
    | datumTijdDatatype
    ;

numeriekDatatype
    : NUMERIEK LPAREN getalSpecificatie RPAREN (MET_EENHEID eenheidExpressie)?
    ;

percentageDatatype
    : PERCENTAGE LPAREN getalSpecificatie RPAREN (MET_EENHEID PERCENT_SIGN (SLASH identifier)?)?
    ;

tekstDatatype
    : TEKST
    ;

booleanDatatype
    : BOOLEAN
    ;

datumTijdDatatype
    : DATUM_IN_DAGEN | DATUM_TIJD_MILLIS
    ;

getalSpecificatie
    : (NEGATIEF | NIET_NEGATIEF | POSITIEF)? (GEHEEL_GETAL | (GETAL MET NUMBER DECIMALEN) | GETAL)
    ;

// Time-related
tijdlijn
    : VOOR (VOOR_ELKE_DAG | VOOR_ELKE_MAAND | VOOR_ELK_JAAR)
    ;

// Rules
regel
    : REGEL regelNaam NEWLINE regelVersie+
    ;

regelVersie
    : versie NEWLINE regelSpraakRegel
    ;

versie
    : GELDIG versieGeldigheid
    ;

versieGeldigheid
    : ALTIJD
    | (VANAF datumOfJaar ((TM | TOT_EN_MET) datumOfJaar)?)
    | ((TM | TOT_EN_MET) datumOfJaar)
    ;

regelSpraakRegel
    : resultaatDeel NEWLINE? (voorwaardeDeel DOT)? NEWLINE? variabeleDeel?
    ;

// Result part
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

gelijkstelling
    : attribuutVanOnderwerp (WORDT_GESTELD_OP expressie | WORDT_BEREKEND_ALS (getalExpressie | datumExpressie))
    ;

kenmerkToekenning
    : onderwerpKeten (IS | HEEFT) EEN? kenmerkNaam
    ;

objectCreatie
    : EEN onderwerpKeten HEEFT EEN rolNaam (MET waardeToekenning (COMMA waardeToekenning)* (EN waardeToekenning))?
    ;

waardeToekenning
    : (attribuutNaam | kenmerkNaam) GELIJK_AAN expressie
    ;

feitCreatie
    : EEN rolNaam VAN EEN onderwerpKeten IS (DE | HET | EEN) rolNaam VAN (DE | HET | EEN) onderwerpKeten
    ;

consistentieRegel
    : expressie MOET NIET INCONSISTENT ZIJN_WERKWOORD
    ;

initialisatie
    : attribuutVanOnderwerp WORDT_GEINITIALISEERD_OP expressie
    ;

verdeling
    : attribuutVanOnderwerp WORDT_VERDEELD_OVER attribuutVanOnderwerp
    ;

dagsoortResultaatDefinitie
    : EEN DAG IS EEN dagsoortNaam
    ;

// Condition part
voorwaardeDeel
    : (INDIEN | GEDURENDE_DE_TIJD_DAT) (elementaireVoorwaarde | samengesteldeVoorwaarde)
    ;

elementaireVoorwaarde
    : voorwaardeVergelijking
    | consistentieVoorwaarde
    ;

voorwaardeVergelijking
    : expressie predicaatOperator expressie?
    ;

predicaatOperator
    : GELIJK_AAN | ONGELIJK_AAN | GROTER_DAN | KLEINER_DAN | LEEG | GEVULD
    ;

samengesteldeVoorwaarde
    : objectExpressie AAN voorwaardeKwantificatie VOLGENDE_VOORWAARDE VOLDOET COLON
      voorwaardeOnderdeel+
    ;

voorwaardeOnderdeel
    : BULLET elementaireVoorwaarde
    ;

voorwaardeKwantificatie
    : ALLE | TEN_MINSTE NUMBER | TEN_HOOGSTE NUMBER | PRECIES NUMBER
    ;

// Variable part
variabeleDeel
    : DAARBIJ_GELDT NEWLINE variabeleOnderdeel+ DOT
    ;

variabeleOnderdeel
    : (DE | HET)? variabeleNaam IS expressie NEWLINE
    ;

// Expression types
objectExpressie
    : kwantificatie? onderwerpKeten
    ;

datumExpressie
    : EERSTE_PAASDAG_VAN LPAREN NUMBER RPAREN
    | datumExpressie (PLUS | MIN) getalExpressie eenheidNaam
    | DATE_TIME_LITERAL
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabeleNaam
    | LPAREN datumExpressie RPAREN
    ;

tekstExpressie
    : tekstenWaardeReeks
    | STRING_LITERAL
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabeleNaam
    | LPAREN tekstExpressie RPAREN
    ;

tekstenWaardeReeks
    : STRING_LITERAL (L_ANGLE_QUOTE expressie R_ANGLE_QUOTE | STRING_LITERAL)*
    ;

booleanExpressie
    : WAAR | ONWAAR
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabeleNaam
    | LPAREN booleanExpressie RPAREN
    ;

// Subject and attribute references
onderwerpKeten
    : onderwerpBase (VAN onderwerpKeten)?
    ;

onderwerpBase
    : (DE | HET | EEN | ZIJN_BEZITTELIJK) (objectTypeNaam | rolNaam | kenmerkNaam)
    | selector
    | onderwerpBase DIE predicaat
    ;

selector
    : (DE | HET | EEN)? rolNaam
    ;

attribuutVanOnderwerp
    : kwantificatie? attribuutMetLidwoord VAN onderwerpKeten
    ;

attribuutMetLidwoord
    : (DE | HET | EEN)? attribuutNaam
    ;

kwantificatie
    : ALLE | GEEN_VAN_DE
    | (TEN_MINSTE | TEN_HOOGSTE | PRECIES) (NUMBER | EEN) (VAN DE)?
    ;

// Additional helper rules
attribuutNaam: identifier;
kenmerkNaam: identifier;
eenheidNaam: identifier;
consistentieVoorwaarde: expressie MOET NIET INCONSISTENT ZIJN_WERKWOORD;

// Constants
WAAR: 'waar';
ONWAAR: 'onwaar';
MEERDERE: 'meerdere';
INCONSISTENT: 'inconsistent';
VOLGENDE_VOORWAARDE: 'volgende voorwaarde';
DIE: 'die';
MET: 'met';
dagsoortNaam: identifier;

// Helper rules
NEWLINE: '\r'? '\n';
domeinNaam: identifier;
dimensieNaam: identifier;
regelNaam: identifier;
datumOfJaar: DATE_TIME_LITERAL | NUMBER;
variabeleNaam: identifier;
parameterMetLidwoord: (DE | HET)? identifier;
expressieTussenHaakjes: LPAREN expressie RPAREN;
eenheidExpressie: (eenheidMacht+ | '1') (SLASH eenheidMacht+)?;
eenheidMacht: identifier (CARET LPAREN NUMBER RPAREN)?;
afronding: (NAAR_BENEDEN | NAAR_BOVEN | REKENKUNDIG) AFGEROND_OP NUMBER DECIMALEN;
concatenatie
    : expressieAtom ((COMMA expressieAtom)* (EN | OF) expressieAtom)?
    ;

expressie
    : expressieAtom
    ;

expressieAtom
    : getalExpressie
    | objectExpressie
    | datumExpressie
    | tekstExpressie
    | booleanExpressie
    | expressieTussenHaakjes
    | parameterMetLidwoord
    | variabeleNaam
    | ENUM_LITERAL
    ;

// Add after expressieAtom rule
getalExpressie
    : getalTerm ((PLUS | MIN) getalTerm)*
    ;

getalTerm
    : getalFactor ((MAAL | GEDEELD_DOOR | GEDEELD_DOOR_ABS) getalFactor)*
    ;

getalFactor
    : getalPrimary (VERMINDERD_MET getalPrimary)*
    ;

getalPrimary
    : NUMBER
    | WORTEL_VAN getalExpressie afronding
    | ABSOLUTE_WAARDE_VAN LPAREN getalExpressie RPAREN
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabeleNaam
    | LPAREN getalExpressie RPAREN
    | getalPrimary TOT_DE_MACHT getalExpressie afronding
    ;

// Domain Definition
domeinDefinition
    : DOMEIN domeinNaam IS_VAN_HET_TYPE (datatype | enumeratieSpecificatie)
    ;

enumeratieSpecificatie
    : ENUMERATIE NEWLINE (ENUM_LITERAL NEWLINE)+
    ;

// Dimensie Definition
dimensieDefinition
    : DIMENSIE (DE | HET) dimensieNaam BESTAANDE_UIT dimensieNaamMeervoud voorzetselSpecificatie NEWLINE
      (labelWaardeSpecificatie NEWLINE)+
    ;

dimensieNaamMeervoud
    : identifier
    ;

voorzetselSpecificatie
    : VAN | IN | VOOR | OVER | OP | BIJ | UIT
    ;

labelWaardeSpecificatie
    : NUMBER DOT identifier
    ;

// Eenheidsysteem Definition
eenheidsysteemDefinition
    : EENHEIDSYSTEEM identifier COLON NEWLINE
      (eenheidDefinitie NEWLINE)+
    ;

eenheidDefinitie
    : identifier EQUALS NUMBER identifier
    ;

// Parameter Definition
parameterDefinition
    : PARAMETER parameterMetLidwoord COLON (datatype | domeinNaam) tijdlijn? SEMICOLON
    ;

// Feit Type Definition
feitTypeDefinition
    : (FEITTYPE | WEDERKERIG_FEITTYPE) feitTypeNaam NEWLINE
      rolSpecificatie NEWLINE
      (rolSpecificatie NEWLINE)?
      feitTypeCardinaliteit
    ;

feitTypeNaam
    : identifier
    ;

rolSpecificatie
    : (DE | HET)? rolNaam (MV identifier RPAREN)? objectTypeNaam
    ;

rolNaam
    : identifier
    ;

objectTypeNaam
    : identifier
    ;

feitTypeCardinaliteit
    : (EEN rolNaam | MEERDERE identifier) relatieBeschrijving (EEN rolNaam | MEERDERE identifier)
    ;

relatieBeschrijving
    : identifier+
    ;

// Dagsoort Definition
dagsoortDefinition
    : DAGSOORT naamwoord
    ;

// Beslistabel Definition
beslistabel
    : BESLISTABEL regelNaam NEWLINE versie NEWLINE
      beslisTabelStructuur
    ;

beslisTabelStructuur
    : // Placeholder for table structure
    ;

// Add after onderwerpBase rule
predicaat
    : elementairPredicaat | samengesteldPredicaat
    ;

elementairPredicaat
    : predicaatOperator expressie?
    ;

samengesteldPredicaat
    : AAN kwantificatie VOLGENDE_VOORWAARDE VOLDOET COLON
      voorwaardeOnderdeel+
    ; 