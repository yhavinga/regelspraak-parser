lexer grammar RegelSpraakLexer;

// NO @lexer::members

// --- Keywords (Order matters: Longest matches first, then categories, then IDENTIFIER) ---

// --- Longest Multi-Word Keywords First ---
HET_AANTAL_DAGEN_IN: 'het aantal dagen in';
HET_KWARTAAL: 'het kwartaal';
HET_DEEL_PER_MAAND: 'het deel per maand';
HET_DEEL_PER_JAAR: 'het deel per jaar';
VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL: '(voor het attribuut zonder voorzetsel):';
NA_HET_ATTRIBUUT_MET_VOORZETSEL: '(na het attribuut met voorzetsel';
DATUM_TIJD_MILLIS: 'Datum en tijd in millisecondes';
GEDURENDE_DE_TIJD_DAT: 'gedurende de tijd dat';
GEDURENDE_HET_GEHELE: 'gedurende het gehele';
GEDURENDE_DE_GEHELE: 'gedurende de gehele';
WORDT_BEREKEND_ALS: 'moet berekend worden als';
WORDT_GESTELD_OP: 'moet gesteld worden op';
WORDT_GEINITIALISEERD_OP: 'moet geïnitialiseerd worden op';
DE_ABSOLUTE_TIJDSDUUR_VAN: 'de absolute tijdsduur van';
DE_ABSOLUTE_WAARDE_VAN: 'de absolute waarde van';
DE_MAXIMALE_WAARDE_VAN: 'de maximale waarde van';
DE_MINIMALE_WAARDE_VAN: 'de minimale waarde van';
HET_TOTAAL_VAN: 'het totaal van';
HET_TIJDSEVENREDIG_DEEL_PER: 'het tijdsevenredig deel per';
DE_DATUM_MET: 'de datum met jaar, maand en dag';
DE_EERSTE_PAASDAG_VAN: 'de eerste paasdag van';
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
GROTER_IS_DAN: 'groter is dan';
KLEINER_IS_DAN: 'kleiner is dan';
WORDT_VOLDAAN: 'wordt voldaan';

// Object creation tokens
ER_WORDT_EEN_NIEUW: [Ee] 'r wordt een nieuw';
WORDT_EEN_NIEUW: 'wordt een nieuw';
AANGEMAAKT: 'aangemaakt';
CREEER: 'Creëer';
NIEUWE: 'nieuwe';
ER_AAN: [Ee] 'r aan';

// --- Comparison Phrase Tokens ---
IS_GELIJK_AAN: 'is gelijk aan';
IS_ONGELIJK_AAN: 'is ongelijk aan';
IS_KLEINER_DAN: 'is kleiner dan';
IS_KLEINER_OF_GELIJK_AAN: 'is kleiner of gelijk aan';
IS_GROTER_DAN: 'is groter dan';
IS_GROTER_OF_GELIJK_AAN: 'is groter of gelijk aan';
ZIJN_GELIJK_AAN: 'zijn gelijk aan';
ZIJN_ONGELIJK_AAN: 'zijn ongelijk aan';
ZIJN_GROTER_DAN: 'zijn groter dan';
ZIJN_GROTER_OF_GELIJK_AAN: 'zijn groter of gelijk aan';
ZIJN_KLEINER_DAN: 'zijn kleiner dan';
ZIJN_KLEINER_OF_GELIJK_AAN: 'zijn kleiner of gelijk aan';
IS_LATER_DAN: 'is later dan';
IS_LATER_OF_GELIJK_AAN: 'is later of gelijk aan';
IS_EERDER_DAN: 'is eerder dan';
IS_EERDER_OF_GELIJK_AAN: 'is eerder of gelijk aan';
ZIJN_LATER_DAN: 'zijn later dan';
ZIJN_LATER_OF_GELIJK_AAN: 'zijn later of gelijk aan';
ZIJN_EERDER_DAN: 'zijn eerder dan';
ZIJN_EERDER_OF_GELIJK_AAN: 'zijn eerder of gelijk aan';

// --- Condition Phrase Tokens ---
IS_LEEG: 'is leeg';
IS_GEVULD: 'is gevuld';
ZIJN_LEEG: 'zijn leeg';
ZIJN_GEVULD: 'zijn gevuld';
IS_KENMERK: 'is kenmerk';
IS_ROL: 'is rol';
ZIJN_KENMERK: 'zijn kenmerk';
ZIJN_ROL: 'zijn rol';
IS_NIET_KENMERK: 'is niet kenmerk';
IS_NIET_ROL: 'is niet rol';
ZIJN_NIET_KENMERK: 'zijn niet kenmerk';
ZIJN_NIET_ROL: 'zijn niet rol';
VOLDOET_AAN_DE_ELFPROEF: 'voldoet aan de elfproef';
VOLDOEN_AAN_DE_ELFPROEF: 'voldoen aan de elfproef';
VOLDOET_NIET_AAN_DE_ELFPROEF: 'voldoet niet aan de elfproef';
VOLDOEN_NIET_AAN_DE_ELFPROEF: 'voldoen niet aan de elfproef';
IS_NUMERIEK_MET_EXACT: 'is numeriek met exact';
IS_NIET_NUMERIEK_MET_EXACT: 'is niet numeriek met exact';
ZIJN_NUMERIEK_MET_EXACT: 'zijn numeriek met exact';
ZIJN_NIET_NUMERIEK_MET_EXACT: 'zijn niet numeriek met exact';
IS_EEN_DAGSOORT: 'is een dagsoort';
ZIJN_EEN_DAGSOORT: 'zijn een dagsoort';
IS_GEEN_DAGSOORT: 'is geen dagsoort';
ZIJN_GEEN_DAGSOORT: 'zijn geen dagsoort';
MOETEN_UNIEK_ZIJN: 'moeten uniek zijn';
IS_GEVUURD: 'is gevuurd';
IS_INCONSISTENT: 'is inconsistent';

// --- Other Keywords (Grouped by category) ---

// Top-Level & Definition Keywords
CONSISTENTIEREGEL: 'Consistentieregel';
REGEL: 'Regel';
BESLISTABEL: 'Beslistabel';
OBJECTTYPE: 'Objecttype';
DOMEIN: 'Domein';
DIMENSIE: 'Dimensie';
EENHEIDSYSTEEM: 'Eenheidsysteem';
PARAMETER: 'Parameter';
FEITTYPE: 'FeitType';
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
DE_WORTEL_VAN: 'de wortel van';
TENMINSTE: 'tenminste';
TEN_MINSTE: 'ten minste';

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
KENMERKEN: 'kenmerken';
MET: 'met';
MET_EENHEID: 'met eenheid';
MV_START : '(mv:';
NEGATIEF: 'negatief';
NIET_NEGATIEF: 'niet-negatief';
NUMERIEK: 'Numeriek';
PERCENTAGE: 'Percentage';
POSITIEF: 'positief';
ROL: 'rol';
ROLLEN: 'rollen';
TEKST: 'Tekst';
VOOR_ELK_JAAR: 'voor elk jaar';
VOOR_ELKE_DAG: 'voor elke dag';
VOOR_ELKE_MAAND: 'voor elke maand';

// Functions & Aggregation Keywords
AANTAL: 'aantal';
EERSTE_VAN: 'de eerste van';
IN_HELE: 'in hele';
LAATSTE_VAN: 'de laatste van';
REEKS_VAN_TEKSTEN_EN_WAARDEN: 'reeks van teksten en waarden';
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
ER: 'er';

// Units and Common Measurements
METER: 'meter';
KILOGRAM: 'kilogram';
VOET: 'voet';
POND: 'pond';
MIJL: 'mijl';

// Add Abbreviations (Place before IDENTIFIER)
M: 'm';
KG: 'kg';
S: 's';
FT: 'ft';
LB: 'lb';
MI: 'mi';

// --- Standard Tokens (No predicates) ---
IDENTIFIER : LETTER (LETTER | DIGIT | '_' | '\'' | '-')* ;
NUMBER: (MINUS? DIGIT+ (',' DIGIT+)? | MINUS? DIGIT+ '_' DIGIT+ '/' DIGIT+ | MINUS? DIGIT+ '/' DIGIT+);
EQUALS: '=';

// --- Other Literals, Punctuation, WS, Comments, Fragments ---
fragment DAY_PART  : ('0'?[1-9] | [12] DIGIT | '3'[01]) ;
fragment MONTH_PART: ('0'?[1-9] | '1'[0-2]) ;
fragment YEAR_PART : DIGIT DIGIT DIGIT DIGIT ;
fragment HOUR_PART   : ('0'|'1') DIGIT | '2' [0-3];
fragment MINUTE_PART : [0-5] DIGIT ;
fragment SECOND_PART : [0-5] DIGIT ;
fragment MILLI_PART  : DIGIT DIGIT DIGIT ;
fragment TIME_PART : HOUR_PART ':' MINUTE_PART ':' SECOND_PART '.' MILLI_PART ;
DATE_TIME_LITERAL: (DD_PUNT WS)? DAY_PART '-' MONTH_PART '-' YEAR_PART ( WS TIME_PART )? ;
PERCENTAGE_LITERAL: NUMBER PERCENT_SIGN;
STRING_LITERAL: '"' ( '\\' . | ~["\\] )*? '"' ;
ENUM_LITERAL: '\'' ( '\\' . | ~['\\] )*? '\'' ;
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
ASTERISK: '*';
L_ANGLE_QUOTE: '«';
R_ANGLE_QUOTE: '»';
CARET: '^';
WS: [ \t\r\n]+ -> channel(HIDDEN);
LINE_COMMENT: '//' ~[\r\n]* -> skip;
MINUS: '-';
fragment LETTER: [a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸ];
fragment DIGIT : [0-9] ;

// NO modes

// New keywords
