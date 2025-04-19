// === RegelSpraakLexer.g4 ===
lexer grammar RegelSpraakLexer;

options { caseInsensitive = true; }

@lexer::header {
package com.example.regelspraak.parser; // Adjust package name as needed
}

@lexer::members {
    // Add helper methods or fields if needed, e.g., for custom error reporting.
    // Example: Override default error reporting to add more context.
    // @Override
    // public void notifyListeners(LexerNoViableAltException e) {
    //     String text = _input.getText(Interval.of(_tokenStartCharIndex, _input.index()));
    //     String msg = "lexer line "+ getLine()+":"+getCharPositionInLine()+" token recognition error at: '" + getErrorDisplay(text) + "'";
    //
    //     ANTLRErrorListener listener = getErrorListenerDispatch();
    //     listener.syntaxError(this, null, _tokenStartLine, _tokenStartCharPositionInLine, msg, e);
    // }
}

// === Keywords ===
// Structure
OBJECTTYPE: 'Objecttype';
DOMEIN: 'Domein';
DIMENSIE: 'Dimensie';
FEITTYPE: 'Feittype';
WEDERKERIG_FEITTYPE: 'Wederkerig' 'feittype';
DAGSOORT: 'Dagsoort';
EENHEIDSYSTEEM: 'Eenheidsysteem'; // Note: spec uses 'Eenheidsysteem' (one s)
PARAMETER: 'Parameter';
REGEL: 'Regel';
BESLISTABEL: 'Beslistabel';

// Modifiers / Structure parts
BEZIELD: 'bezield';
MV: 'mv';
KENMERK: 'kenmerk';
BEZITTELIJK: 'bezittelijk';
BIJVOEGLIJK: 'bijvoeglijk';
ATTRIBUUT: 'attribuut';
GEDIMENSIONEERD: 'gedimensioneerd';
BESTAANDE: 'bestaande';
UIT: 'uit';
TYPE: 'type';
ENUMERATIE: 'Enumeratie';
VOOR: 'voor';
ELKE: 'elke';
NA: 'na';
ZONDER: 'zonder';
VOORZETSEL: 'voorzetsel';

// Datatypes
NUMERIEK: 'Numeriek';
PERCENTAGE: 'Percentage';
TEKST: 'Tekst';
BOOLEAN: 'Boolean';
DATUM: 'Datum';
DAGEN: 'dagen';
MAANDEN: 'maanden';
JAREN: 'jaren';
TIJD: 'tijd';
MILLISECONDES: 'millisecondes';
GEHEEL: 'geheel';
GETAL: 'getal';
DECIMALEN: 'decimalen';
NEGATIEF: 'negatief';
NIET_NEGATIEF: 'niet-negatief';
POSITIEF: 'positief';

// Units / Time
EENHEID: 'eenheid';
MAAND: 'maand';
JAAR: 'jaar';
DAG: 'dag';
JR: 'jr';
KM: 'km';
EURO_SIGN: '€';
M: 'm';
S: 's';
MINUUT: 'minuut';
U: 'u';
WK: 'wk';
MND: 'mnd';
KW: 'kw';
MS: 'ms';
MM: 'mm';
CM: 'cm';
EUR: 'EUR';

// Regel structure
GELDIG: 'geldig';
ALTĲD: 'altijd';
VANAF: 'vanaf';
TM: 't/m';
INDIEN: 'indien';
DAARBĲ: 'Daarbij';
GELDT: 'geldt';
MOET: 'moet';
WORDEN: 'worden';
GESTELD: 'gesteld';
BEREKEND: 'berekend';
GEINITIEERD: 'geïnitialiseerd';
IS: 'is';
HEEFT: 'heeft';
AAN: 'aan';
VOLDOET: 'voldoet';
VOLDOEN: 'voldoen';
WORDT: 'wordt';
VOLDAAN: 'voldaan';
ALLE: 'alle';
GEEN: 'geen';
VOLGENDE: 'volgende';
VOORWAARDE: 'voorwaarde';
VOORWAARDEN: 'voorwaarden';
CRITERIUM: 'criterium';
CRITERIA: 'criteria';

// Operators / Expressions / Conditions
PLUS: 'plus';
MIN: 'min';
MAAL: 'maal';
VAN: 'van';
NAAR: 'naar';
BENEDEN: 'beneden';
BOVEN: 'boven';
REKENKUNDIG: 'rekenkundig';
RICHTING: 'richting';
NUL: 'nul';
WEG: 'weg';
AFGEROND: 'afgerond';
TIJDSDUUR: 'tijdsduur';
TOT: 'tot';
IN: 'in';
HELE: 'hele';
ABSOLUTE: 'absolute';
REKENDATUM: 'Rekendatum';
REKENJAAR: 'Rekenjaar';
REEKS: 'reeks';
TEKSTEN: 'teksten';
WAARDEN: 'waarden';
HĲ: 'hij';
ZIJN: 'zijn';
DIE: 'die';
DAT: 'dat';
OF: 'of';
EN: 'en';
AANTAL: 'aantal';
SOM: 'som';
MAXIMALE: 'maximale';
MINIMALE: 'minimale';
WAARDE: 'waarde';
EERSTE: 'eerste';
LAATSTE: 'laatste';
OVER: 'over';
TOTAAL: 'totaal';
TIJDSEVENREDIG: 'tijdsevenredig';
DEEL: 'deel';
PER: 'per';
GEDURENDE: 'gedurende';
GELIJK: 'gelijk';
ONGELIJK: 'ongelijk';
GROTER: 'groter';
KLEINER: 'kleiner';
LATER: 'later';
EERDER: 'eerder';
LEEG: 'leeg';
GEVULD: 'gevuld';
ELFPROEF: 'elfproef';
EXACT: 'exact';
CIJFERS: 'cijfers';
UNIEK: 'uniek';
GEVUURD: 'gevuurd';
INCONSISTENT: 'inconsistent';
NIET: 'niet';
VERDEELD: 'verdeeld';
GELIJKE: 'gelijke';
DELEN: 'delen';
RATO: 'rato';
VOLGORDE: 'volgorde';
AFNEMENDE: 'afnemende';
TOENEMENDE: 'toenemende';
BĲ: 'bij';
EVEN: 'even';
GROOT: 'groot';
MAXIMUM: 'maximum';
REST: 'rest';
ALS: 'als';
ONVERDEELDE: 'onverdeelde';
BLĲFT: 'blijft';
VERENIGD: 'verenigd';
MOETEN: 'moeten';
DE: 'de';
HET: 'het';
EEN: 'een';
MET: 'met';
ER: 'er';
CONCATENATIE: 'concatenatie';
REGELVERSIE: 'regelversie';
EEN_KW: 'één';
TWEE: 'twee';
DRIE: 'drie';
VIER: 'vier';
NVT: 'n.v.t.';
ABS: 'ABS';

// Literals
WAAR: 'waar';
ONWAAR: 'onwaar';

// === Multi-word phrase tokens (Order matters: most specific first) ===
MOET_GESTELD_WORDEN_OP: 'moet' 'gesteld' 'worden' 'op';
MOET_BEREKEND_WORDEN_ALS: 'moet' 'berekend' 'worden' 'als';
MOET_GEINITIEERD_WORDEN_OP: 'moet' 'geïnitialiseerd' 'worden' 'op';
ZIJN_GELIJK_AAN: 'zijn' 'gelijk' 'aan';
IS_GELIJK_AAN: 'is' 'gelijk' 'aan';
ZIJN_ONGELIJK_AAN: 'zijn' 'ongelijk' 'aan';
IS_ONGELIJK_AAN: 'is' 'ongelijk' 'aan';
ZIJN_GROTER_DAN: 'zijn' 'groter' 'dan';
IS_GROTER_DAN: 'is' 'groter' 'dan';
ZIJN_GROTER_OF_GELIJK_AAN: 'zijn' 'groter' 'of' 'gelijk' 'aan';
IS_GROTER_OF_GELIJK_AAN: 'is' 'groter' 'of' 'gelijk' 'aan';
ZIJN_KLEINER_DAN: 'zijn' 'kleiner' 'dan';
IS_KLEINER_DAN: 'is' 'kleiner' 'dan';
ZIJN_KLEINER_OF_GELIJK_AAN: 'zijn' 'kleiner' 'of' 'gelijk' 'aan';
IS_KLEINER_OF_GELIJK_AAN: 'is' 'kleiner' 'of' 'gelijk' 'aan';
ZIJN_LATER_DAN: 'zijn' 'later' 'dan';
IS_LATER_DAN: 'is' 'later' 'dan';
ZIJN_LATER_OF_GELIJK_AAN: 'zijn' 'later' 'of' 'gelijk' 'aan';
IS_LATER_OF_GELIJK_AAN: 'is' 'later' 'of' 'gelijk' 'aan';
ZIJN_EERDER_DAN: 'zijn' 'eerder' 'dan';
IS_EERDER_DAN: 'is' 'eerder' 'dan';
ZIJN_EERDER_OF_GELIJK_AAN: 'zijn' 'eerder' 'of' 'gelijk' 'aan';
IS_EERDER_OF_GELIJK_AAN: 'is' 'eerder' 'of' 'gelijk' 'aan';
ZIJN_LEEG: 'zijn' 'leeg';
IS_LEEG: 'is' 'leeg';
ZIJN_GEVULD: 'zijn' 'gevuld';
IS_GEVULD: 'is' 'gevuld';
VOLDOEN_AAN_DE_ELFPROEF: 'voldoen' 'aan' 'de' 'elfproef';
VOLDOET_AAN_DE_ELFPROEF: 'voldoet' 'aan' 'de' 'elfproef';
VOLDOEN_NIET_AAN_DE_ELFPROEF: 'voldoen' 'niet' 'aan' 'de' 'elfproef';
VOLDOET_NIET_AAN_DE_ELFPROEF: 'voldoet' 'niet' 'aan' 'de' 'elfproef';
ZIJN_NUMERIEK_MET_EXACT: 'zijn' 'numeriek' 'met' 'exact';
IS_NUMERIEK_MET_EXACT: 'is' 'numeriek' 'met' 'exact';
ZIJN_NIET_NUMERIEK_MET_EXACT: 'zijn' 'niet' 'numeriek' 'met' 'exact';
IS_NIET_NUMERIEK_MET_EXACT: 'is' 'niet' 'numeriek' 'met' 'exact';
ZIJN_EEN_DAGSOORT: 'zijn' 'een';
IS_EEN_DAGSOORT: 'is' 'een';
ZIJN_GEEN_DAGSOORT: 'zijn' 'geen';
IS_GEEN_DAGSOORT: 'is' 'geen';
MOETEN_UNIEK_ZIJN: 'moeten' 'uniek' 'zijn';
IS_GEVUURD: 'is' 'gevuurd';
IS_INCONSISTENT: 'is' 'inconsistent';
GEDURENDE_DE_TIJD_DAT: 'gedurende' 'de' 'tijd' 'dat';
GEDURENDE_HET_GEHELE_JAAR: 'gedurende' 'het' 'gehele' 'jaar';
GEDURENDE_DE_GEHELE_MAAND: 'gedurende' 'de' 'gehele' 'maand';
DE_ABSOLUTE_WAARDE_VAN: 'de' 'absolute' 'waarde' 'van';
DE_DATUM_MET_JAAR_MAAND_DAG: 'de' 'datum' 'met' 'jaar' COMMA 'maand' 'en' 'dag';
DE_EERSTE_PAASDAG_VAN: 'de' 'eerste' 'paasdag' 'van';
DE_EERSTE_VAN: 'de' 'eerste' 'van';
DE_LAATSTE_VAN: 'de' 'laatste' 'van';
HET_AANTAL: 'het' 'aantal';
DE_MAXIMALE_WAARDE_VAN: 'de' 'maximale' 'waarde' 'van';
DE_MINIMALE_WAARDE_VAN: 'de' 'minimale' 'waarde' 'van';
DE_SOM_VAN: 'de' 'som' 'van';
HET_AANTAL_DAGEN_IN: 'het' 'aantal' 'dagen' 'in';
HET_TIJDSEVENREDIG_DEEL_PER: 'het' 'tijdsevenredig' 'deel' 'per';
HET_TOTAAL_VAN: 'het' 'totaal' 'van';
ALS_DIE_ER_NIET_ZIJN: 'als' 'die' 'er' 'niet' 'zijn';
VERMINDERD_MET: 'verminderd' 'met';
GEDEELD_DOOR: 'gedeeld' 'door';
GEDEELD_DOOR_ABS: 'gedeeld' 'door' LPAREN ABS RPAREN;
DE_WORTEL_VAN: 'de' 'wortel' 'van';
TOT_DE_MACHT: 'tot' 'de' 'macht';
MET_EEN_MINIMUM_VAN: 'met' 'een' 'minimum' 'van';
MET_EEN_MAXIMUM_VAN: 'met' 'een' 'maximum' 'van';
TEN_MINSTE: 'ten' 'minste';
TEN_HOOGSTE: 'ten' 'hoogste';
HET_IS_DE_PERIODE: 'het' 'is' 'de' 'periode';

// === Single Character Tokens and Separators ===
LPAREN: '(';
RPAREN: ')';
LBRACE: '{';
RBRACE: '}';
COMMA: ',';
SEMI: ';';
DOT: '.';
COLON: ':';
SLASH: '/';
PERCENT_SIGN: '%';
EQUALS: '=';
QUOTE: '\'';
DQUOTE: '"';
BULLET: '•';
UNDERSCORE: '_';
CARET: '^';
PIPE: '|';
MINUS: '-'; // Needs to be before NUM_INT, NUM_DEC for correct precedence if used standalone

// Literals (Order matters: Place longer/more specific ones first)
NUM_DEC: MINUS? DIGIT+ ',' DIGIT+;
NUM_INT: MINUS? DIGIT+;
DATE_DDMMYYYY: DIGIT DIGIT '-' DIGIT DIGIT '-' DIGIT DIGIT DIGIT DIGIT;
TIME_HHMMSSMS: DIGIT DIGIT ':' DIGIT DIGIT ':' DIGIT DIGIT '.' DIGIT DIGIT DIGIT;
STRING: '"' ( ~["\\\r\n] | EscapeSequence )*? '"'; // Non-greedy match
ENUMSTRING: '\'' ( ~['\\\r\n] | EscapeSequence )*? '\''; // Non-greedy match

// Identifier: Must be placed after keywords and multi-word tokens
IDENTIFIER: UNICODE_LETTER_OR_UNDERSCORE (UNICODE_LETTER_OR_DIGIT_OR_UNDERSCORE)*;

// === Whitespace and Comments ===
WS: [ \t\r\n]+ -> skip;
COMMENT: '//' ~[\r\n]* -> skip;

// === Fragments ===
fragment DIGIT: [0-9];
fragment NON_ZERO_DIGIT: [1-9];
fragment LETTER: [a-zA-Z]; // Handles ASCII part of case-insensitive matching
fragment UNICODE_LETTER: '\\p'{L}; // Handles full Unicode letter range
fragment UNICODE_NUMBER: '\\p'{N};
fragment UNICODE_MARK: '\\p'{M};
fragment UNICODE_LETTER_OR_UNDERSCORE: UNICODE_LETTER | '_';
fragment UNICODE_LETTER_OR_DIGIT_OR_UNDERSCORE: UNICODE_LETTER | UNICODE_NUMBER | UNICODE_MARK | '_';
fragment EscapeSequence
    :   '\\' ( DQUOTE | QUOTE | '\\' | 'n' | 'r' | 't' | 'b' | 'f'
             | 'u' HexDigit HexDigit HexDigit HexDigit
             )
    ;
fragment HexDigit: [0-9a-fA-F];