lexer grammar RegelSpraakLexer;

// --- Keywords (Order matters: Longest matches first, then categories, then IDENTIFIER) ---

// --- Longest Multi-Word Keywords First ---
NA_HET_ATTRIBUUT_MET_VOORZETSEL: '(na het attribuut met voorzetsel';
DATUM_TIJD_MILLIS: 'Datum en tijd in millisecondes';
GEDURENDE_DE_TIJD_DAT: 'gedurende de tijd dat';
GEDURENDE_HET_GEHELE: 'gedurende het gehele';
GEDURENDE_DE_GEHELE: 'gedurende de gehele';
WORDT_BEREKEND_ALS: 'moet berekend worden als';
WORDT_GESTELD_OP: 'moet gesteld worden op';
WORDT_GEINITIALISEERD_OP: 'moet geïnitialiseerd worden op';
ABSOLUTE_TIJDSDUUR_VAN: 'de absolute tijdsduur van';
ABSOLUTE_WAARDE_VAN: 'de absolute waarde van';
MAXIMALE_WAARDE_VAN: 'de maximale waarde van';
MINIMALE_WAARDE_VAN: 'de minimale waarde van';
ALS_ONVERDEELDE_REST_BLIJFT: 'Als onverdeelde rest blijft';
MET_EEN_MINIMUM_VAN: 'met een minimum van';
MET_EEN_MAXIMUM_VAN: 'met een maximum van';
GROTER_OF_GELIJK_AAN: 'groter of gelijk aan';
KLEINER_OF_GELIJK_AAN: 'kleiner of gelijk aan';
LATER_OF_GELIJK_AAN: 'later of gelijk aan';
EERDER_OF_GELIJK_AAN: 'eerder of gelijk aan';
WAARBIJ_WORDT_VERDEELD: ', waarbij wordt verdeeld';
BESTAANDE_UIT: ', bestaande uit de';
WEDERKERIG_FEITTYPE: 'Wederkerig feittype';
IS_VAN_HET_TYPE: 'is van het type';
CONCATENATIE_VAN: 'de concatenatie van';
VOLGEND_CRITERIUM: 'het volgende criterium:';
VOLGENDE_CRITERIA: 'volgende criteria:';
BIJ_EVEN_GROOT_CRITERIUM: 'bij even groot criterium';
OP_VOLGORDE_VAN: 'op volgorde van';
NAAR_RATO_VAN: 'naar rato van';
NUMERIEK_MET_EXACT: 'numeriek met exact';
AAN_DE_ELFPROEF: 'aan de elfproef';
IS_GROTER_OF_GELIJK_AAN: 'is groter of gelijk aan';
IS_GROTER_DAN: 'is groter dan';
KLEINER_IS_DAN: 'kleiner is dan';

// --- Other Keywords (Grouped by category) ---

// Top-Level & Definition Keywords
REGEL: 'Regel';
BESLISTABEL: 'Beslistabel';
OBJECTTYPE: 'Objecttype';
DOMEIN: 'Domein';
DIMENSIE: 'Dimensie';
EENHEIDSYSTEEM: 'Eenheidsysteem';
PARAMETER: 'Parameter';
FEITTYPE: 'Feittype';
DAGSOORT: 'Dagsoort';

// Rule Structure & Result Keywords
DAARBIJ_GELDT: 'Daarbij geldt:';
GELDIG: 'geldig';
HEBBEN: 'hebben';
HEEFT: 'heeft';
INDIEN: 'indien';
IS: 'is';
MOET: 'moet';
MOETEN: 'moeten';
WORDT_VERDEELD_OVER: 'wordt verdeeld over';
ZIJN: 'zijn';

// Conditions & Operator Keywords
AAN: 'aan';
AFGEROND_OP: 'afgerond op';
ALLE: 'alle';
EERDER_DAN: 'eerder dan';
GEDEELD_DOOR: 'gedeeld door';
GEDEELD_DOOR_ABS: 'gedeeld door (ABS)';
GELIJK_AAN: 'gelijk aan';
GEVULD: 'gevuld';
GEVUURD: 'gevuurd';
GROTER_DAN: 'groter dan';
INCONSISTENT: 'inconsistent';
KLEINER_DAN: 'kleiner dan';
LATER_DAN: 'later dan';
LEEG: 'leeg';
MAAL: 'maal';
MIN: 'min';
NAAR_BENEDEN: 'naar beneden';
NAAR_BOVEN: 'naar boven';
NIET: 'niet';
ONGELIJK_AAN: 'ongelijk aan';
PLUS: 'plus';
REKENKUNDIG: 'rekenkundig';
RICHTING_NUL: 'richting nul';
TOT: 'tot';
TOT_DE_MACHT: 'tot de macht';
TOT_EN_MET: 'tot en met';
UNIEK: 'uniek';
VANAF: 'vanaf';
VERENIGD_MET: 'verenigd met';
VERMINDERD_MET: 'verminderd met';
VOLDOEN: 'voldoen';
VOLDOET: 'voldoet';
WEG_VAN_NUL: 'weg van nul';
WORTEL_VAN: 'de wortel van';

// GegevensSpraak Detail Keywords
BEZIELD: '(bezield)';
BEZITTELIJK: '(bezittelijk)';
BIJVOEGLIJK: '(bijvoeglijk)';
BOOLEAN: 'Boolean';
CIJFERS: 'cijfers';
DATUM_IN_DAGEN: 'Datum in dagen';
DECIMALEN: 'decimalen';
ENUMERATIE: 'Enumeratie';
GEDIMENSIONEERD_MET: 'gedimensioneerd met';
GEHEEL_GETAL: 'geheel getal';
GETAL: 'getal';
KENMERK: 'kenmerk';
MET: 'met';
MET_EENHEID: 'met eenheid';
MV_START : '(mv:';
NEGATIEF: 'negatief';
NIET_NEGATIEF: 'niet-negatief';
NUMERIEK: 'Numeriek';
PERCENTAGE: 'Percentage';
POSITIEF: 'positief';
TEKST: 'Tekst';
VOOR_ELK_JAAR: 'voor elk jaar';
VOOR_ELKE_DAG: 'voor elke dag';
VOOR_ELKE_MAAND: 'voor elke maand';

// Functions & Aggregation Keywords
EERSTE_VAN: 'de eerste van';
IN_HELE: 'in hele';
LAATSTE_VAN: 'de laatste van';
SOM_VAN: 'de som van';
TIJDSDUUR_VAN: 'de tijdsduur van';

// Verdeling Detail Keywords
AFNEMENDE: 'afnemende';
IN_GELIJKE_DELEN: 'in gelijke delen';
OVER_VERDELING: 'over.';
TOENEMENDE: 'toenemende';

// Quantifier Keywords
DRIE_TELWOORD: 'drie';
EEN_TELWOORD: 'één';
GEEN_VAN_DE: 'geen van de';
PRECIES: 'precies';
TEN_HOOGSTE: 'ten hoogste';
TEN_MINSTE: 'ten minste';
TWEE_TELWOORD: 'twee';
VIER_TELWOORD: 'vier';

// Common words, Dates, Misc Keywords
ALTIJD: 'altijd';
BIJ: 'bij';
DAG: 'dag';
DAT: 'dat';
DE: 'de';
DD_PUNT: 'dd.';
DIE: 'die';
EEN: 'een';
EN: 'en';
HET: 'het';
HIJ: 'hij';
IN: 'in';
JAAR: 'jaar';
KWARTAAL: 'kwartaal';
MAAND: 'maand';
MILLISECONDE: 'milliseconde';
MINUUT: 'minuut';
OF: 'of';
ONWAAR: 'onwaar';
OP: 'op';
OVER: 'over';
PERIODE: 'periode';
REKENDATUM: 'Rekendatum';
REKENJAAR: 'Rekenjaar';
REGELVERSIE: 'regelversie';
SECONDE: 'seconde';
TM: 't/m';
UIT: 'uit';
UUR: 'uur';
VAN: 'van';
VOLGENDE_VOORWAARDE: 'volgende voorwaarde';
VOLGENDE_VOORWAARDEN: 'volgende voorwaarden';
VOOR: 'voor';
WAAR: 'waar';
WEEK: 'week';

// --- Identifiers (Must come AFTER all keywords) ---
IDENTIFIER : LETTER (LETTER | DIGIT | '_' | '\'')* ;

// --- Literals ---
fragment DAY : DIGIT DIGIT? ;
fragment MONTH : DIGIT DIGIT? ;
fragment YEAR : DIGIT DIGIT DIGIT DIGIT ;
DATE_TIME_LITERAL: (DD_PUNT)? DAY '-' MONTH '-' YEAR;

NUMBER: MINUS? DIGIT+ (',' DIGIT+)?
       | MINUS? DIGIT+ '_' DIGIT+ '/' DIGIT+
       | MINUS? DIGIT+ '/' DIGIT+;

PERCENTAGE_LITERAL: NUMBER PERCENT_SIGN;

STRING_LITERAL: '"' ( '\\' . | ~["\\] )*? '"';

ENUM_LITERAL: '\'' ( '\\' . | ~['\\] )*? '\'';

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

// --- Whitespace and Comments ---
WS: [ \t\r\n]+ -> skip;
LINE_COMMENT: '//' ~[\r\n]* -> skip;

// --- Fragments ---
fragment MINUS: '-';
fragment LETTER: [a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸ];
fragment DIGIT : [0-9] ;