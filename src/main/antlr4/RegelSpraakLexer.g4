lexer grammar RegelSpraakLexer;

// --- Top-Level Keywords (Order matters: Keywords before IDENTIFIER) ---
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

// --- Multi-word Keywords/Phrases ---
IS_VAN_HET_TYPE: 'is van het type';
DATUM_IN_DAGEN: 'Datum in dagen';
DATUM_TIJD_MILLIS: 'Datum en tijd in millisecondes';
GEHEEL_GETAL: 'geheel getal';
WORDT_BEREKEND_ALS: 'moet berekend worden als';
WORDT_GESTELD_OP: 'moet gesteld worden op';
DAARBIJ_GELDT: 'Daarbij geldt:';
ABSOLUTE_TIJDSDUUR_VAN: 'de absolute tijdsduur van';
IN_HELE: 'in hele';
// TIJDSDUUR_VAN: 'de tijdsduur van'; // Remove duplicate
// SOM_VAN: 'de som van'; // Remove duplicate

// --- Rule Keywords ---
GELDIG: 'geldig';
ALTIJD: 'altijd';
VANAF: 'vanaf';
TM: 't/m';
TOT_EN_MET: 'tot en met';
TOT: 'tot';
INDIEN: 'indien';
WORDT_GEINITIALISEERD_OP: 'moet geïnitialiseerd worden op';
WORDT_VERDEELD_OVER: 'wordt verdeeld over';
IS: 'is';
ZIJN: 'zijn';
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
// ZIJN_BEZITTELIJK: 'zijn'; // Remove ambiguous token

// --- Data Types & Structures ---
BEZIELD: '(bezield)';
MV_START : '(mv:'; // Needs space handling or parser adjustment if space inside
KENMERK: 'kenmerk';
BEZITTELIJK: '(bezittelijk)';
BIJVOEGLIJK: '(bijvoeglijk)';
GEDIMENSIONEERD_MET: 'gedimensioneerd met';
EN: 'en';
OF: 'of';
ENUMERATIE: 'Enumeratie';
NUMERIEK: 'Numeriek';
TEKST: 'Tekst';
BOOLEAN: 'Boolean';
PERCENTAGE: 'Percentage';
MET_EENHEID: 'met eenheid';
MET: 'met';
DECIMALEN: 'decimalen';
GETAL: 'getal';
NEGATIEF: 'negatief';
NIET_NEGATIEF: 'niet-negatief';
POSITIEF: 'positief';
VOOR: 'voor';
VOOR_ELKE_DAG: 'voor elke dag';
VOOR_ELKE_MAAND: 'voor elke maand';
VOOR_ELK_JAAR: 'voor elk jaar';
BESTAANDE_UIT: ', bestaande uit de';
NA_HET_ATTRIBUUT_MET_VOORZETSEL: '(na het attribuut met voorzetsel';
VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL: '(voor het attribuut zonder voorzetsel):';
VAN: 'van';
IN: 'in';
OVER: 'over';
OP: 'op';
BIJ: 'bij';
UIT: 'uit';
DAG: 'dag';
MAAND: 'maand';
JAAR: 'jaar';
WEEK: 'week';
KWARTAAL: 'kwartaal';
MILLISECONDE: 'milliseconde';
SECONDE: 'seconde';
MINUUT: 'minuut';
UUR: 'uur';

// --- Expressions & Operators ---
PLUS: 'plus';
MIN: 'min';
VERMINDERD_MET: 'verminderd met';
MAAL: 'maal';
GEDEELD_DOOR: 'gedeeld door';
GEDEELD_DOOR_ABS: 'gedeeld door (ABS)';
WORTEL_VAN: 'de wortel van';
TOT_DE_MACHT: 'tot de macht';
ABSOLUTE_WAARDE_VAN: 'de absolute waarde van';
TIJDSDUUR_VAN: 'de tijdsduur van'; // Keep original definition here
INCONSISTENT: 'inconsistent';
GEDURENDE_DE_TIJD_DAT: 'gedurende de tijd dat';
GEDURENDE_HET_GEHELE: 'gedurende het gehele';
GEDURENDE_DE_GEHELE: 'gedurende de gehele';
PERIODE: 'periode';

// --- Aggregation ---
SOM_VAN: 'de som van'; // Keep original definition here
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
AAN_DE_ELFPROEF: 'aan de elfproef';
NIET: 'niet';
NUMERIEK_MET_EXACT: 'numeriek met exact';
CIJFERS: 'cijfers';
UNIEK: 'uniek';
VERENIGD_MET: 'verenigd met';
CONCATENATIE_VAN: 'de concatenatie van';
GEVUURD: 'gevuurd';

// --- Quantifiers ---
GEEN_VAN_DE: 'geen van de';
TEN_MINSTE: 'ten minste';
TEN_HOOGSTE: 'ten hoogste';
PRECIES: 'precies';
EEN_TELWOORD: 'één';
TWEE_TELWOORD: 'twee';
DRIE_TELWOORD: 'drie';
VIER_TELWOORD: 'vier';

// --- Afronding & Begrenzing ---
NAAR_BENEDEN: 'naar beneden';
NAAR_BOVEN: 'naar boven';
REKENKUNDIG: 'rekenkundig';
RICHTING_NUL: 'richting nul';
WEG_VAN_NUL: 'weg van nul';
AFGEROND_OP: 'afgerond op';
MET_EEN_MINIMUM_VAN: 'met een minimum van';
MET_EEN_MAXIMUM_VAN: 'met een maximum van';

// --- Verdeling ---
WAARBIJ_WORDT_VERDEELD: ', waarbij wordt verdeeld';
IN_GELIJKE_DELEN: 'in gelijke delen';
NAAR_RATO_VAN: 'naar rato van';
OP_VOLGORDE_VAN: 'op volgorde van';
TOENEMENDE: 'toenemende';
AFNEMENDE: 'afnemende';
BIJ_EVEN_GROOT_CRITERIUM: 'bij even groot criterium';
ALS_ONVERDEELDE_REST_BLIJFT: 'Als onverdeelde rest blijft';
OVER_VERDELING: 'over.';

// --- Datum Literals ---
DD_PUNT: 'dd.';

// --- Other ---
REGELVERSIE: 'regelversie';
VOLGENDE_VOORWAARDE: 'volgende voorwaarde';
VOLGENDE_VOORWAARDEN: 'volgende voorwaarden';
VOLGEND_CRITERIUM: 'het volgende criterium:';
VOLGENDE_CRITERIA: 'volgende criteria:';
DIE: 'die';
DAT: 'dat';
REKENDATUM: 'Rekendatum';
REKENJAAR: 'Rekenjaar';
WAAR: 'waar'; // Boolean Literal
ONWAAR: 'onwaar'; // Boolean Literal

// --- Punctuation & Operators ---
LPAREN: '(';
RPAREN: ')';
LBRACE: '{';
RBRACE: '}';
COMMA: ',';
DOT: '.';
COLON: ':';
SEMICOLON: ';';
SLASH: '/';
EQUALS: '=';
PERCENT_SIGN: '%';
BULLET: '•';
L_ANGLE_QUOTE: '«';
R_ANGLE_QUOTE: '»';
CARET: '^';
// APOSTROPHE: '\''; // Likely not needed as a separate token, handled by literals/identifier

// --- Literals ---
// Define DATE_TIME_LITERAL before NUMBER using fragments
fragment DAY : DIGIT DIGIT? ;
fragment MONTH : DIGIT DIGIT? ;
fragment YEAR : DIGIT DIGIT DIGIT DIGIT ;
DATE_TIME_LITERAL: (DD_PUNT)? DAY '-' MONTH '-' YEAR;

NUMBER: MINUS? DIGIT+ (',' DIGIT+)? // Simple decimal/integer
       | MINUS? DIGIT+ '_' DIGIT+ '/' DIGIT+ // Integer part of fraction
       | MINUS? DIGIT+ '/' DIGIT+;          // Simple fraction

PERCENTAGE_LITERAL: NUMBER PERCENT_SIGN; // Use PERCENT_SIGN token

// Ensure no newline characters inside the character set `[]`
STRING_LITERAL: '"' ( '\\' . | ~["\\] )*? '"'; // Handles escapes, avoids newline issues

// Ensure no newline characters inside the character set `[]`
ENUM_LITERAL: '\'' ( '\\' . | ~['\\] )*? '\''; // Handles escapes, avoids newline issues

// --- Identifiers (Must come AFTER all keywords and literals) ---
// Disallow spaces
IDENTIFIER : LETTER (LETTER | DIGIT | '_' | '\'')* ; // No spaces allowed

// --- Whitespace and Comments ---
WS: [ \t\r\n]+ -> skip;
LINE_COMMENT: '//' ~[\r\n]* -> skip;

// --- Fragments ---
fragment MINUS: '-';
fragment LETTER: [a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸ];
fragment DIGIT : [0-9] ;

// Removed conflicting MV token
// MV : '(mv:' ; // Match the starting parenthesis 

KLEINER_IS_DAN: 'kleiner is dan'; 
IS_GROTER_OF_GELIJK_AAN: 'is groter of gelijk aan'; 
IS_GROTER_DAN: 'is groter dan'; 