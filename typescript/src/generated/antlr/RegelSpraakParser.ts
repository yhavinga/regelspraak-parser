// Generated from RegelSpraak.g4 by ANTLR 4.13.1
// noinspection ES6UnusedImports,JSUnusedGlobalSymbols,JSUnusedLocalSymbols

import {
	ATN,
	ATNDeserializer, DecisionState, DFA, FailedPredicateException,
	RecognitionException, NoViableAltException, BailErrorStrategy,
	Parser, ParserATNSimulator,
	RuleContext, ParserRuleContext, PredictionMode, PredictionContextCache,
	TerminalNode, RuleNode,
	Token, TokenStream,
	Interval, IntervalSet
} from 'antlr4';
import RegelSpraakListener from "./RegelSpraakListener.js";
import RegelSpraakVisitor from "./RegelSpraakVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;

export default class RegelSpraakParser extends Parser {
	public static readonly VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL = 1;
	public static readonly NA_HET_ATTRIBUUT_MET_VOORZETSEL = 2;
	public static readonly DATUM_TIJD_MILLIS = 3;
	public static readonly GEDURENDE_DE_TIJD_DAT = 4;
	public static readonly GEDURENDE_HET_GEHELE = 5;
	public static readonly GEDURENDE_DE_GEHELE = 6;
	public static readonly WORDT_BEREKEND_ALS = 7;
	public static readonly WORDT_GESTELD_OP = 8;
	public static readonly WORDT_GEINITIALISEERD_OP = 9;
	public static readonly DE_ABSOLUTE_TIJDSDUUR_VAN = 10;
	public static readonly DE_ABSOLUTE_WAARDE_VAN = 11;
	public static readonly DE_MAXIMALE_WAARDE_VAN = 12;
	public static readonly DE_MINIMALE_WAARDE_VAN = 13;
	public static readonly HET_TOTAAL_VAN = 14;
	public static readonly HET_TIJDSEVENREDIG_DEEL_PER = 15;
	public static readonly DE_DATUM_MET = 16;
	public static readonly DE_EERSTE_PAASDAG_VAN = 17;
	public static readonly ALS_ONVERDEELDE_REST_BLIJFT = 18;
	public static readonly MET_EEN_MINIMUM_VAN = 19;
	public static readonly MET_EEN_MAXIMUM_VAN = 20;
	public static readonly GROTER_OF_GELIJK_AAN = 21;
	public static readonly KLEINER_OF_GELIJK_AAN = 22;
	public static readonly LATER_OF_GELIJK_AAN = 23;
	public static readonly EERDER_OF_GELIJK_AAN = 24;
	public static readonly WAARBIJ_WORDT_VERDEELD = 25;
	public static readonly BESTAANDE_UIT = 26;
	public static readonly WEDERKERIG_FEITTYPE = 27;
	public static readonly IS_VAN_HET_TYPE = 28;
	public static readonly CONCATENATIE_VAN = 29;
	public static readonly VOLGEND_CRITERIUM = 30;
	public static readonly VOLGENDE_CRITERIA = 31;
	public static readonly BIJ_EVEN_GROOT_CRITERIUM = 32;
	public static readonly OP_VOLGORDE_VAN = 33;
	public static readonly NAAR_RATO_VAN = 34;
	public static readonly NUMERIEK_MET_EXACT = 35;
	public static readonly AAN_DE_ELFPROEF = 36;
	public static readonly GROTER_IS_DAN = 37;
	public static readonly KLEINER_IS_DAN = 38;
	public static readonly WORDT_VOLDAAN = 39;
	public static readonly ER_WORDT_EEN_NIEUW = 40;
	public static readonly WORDT_EEN_NIEUW = 41;
	public static readonly AANGEMAAKT = 42;
	public static readonly CREEER = 43;
	public static readonly NIEUWE = 44;
	public static readonly ER_AAN = 45;
	public static readonly GELIJK_IS_AAN = 46;
	public static readonly IS_GELIJK_AAN = 47;
	public static readonly IS_ONGELIJK_AAN = 48;
	public static readonly IS_KLEINER_DAN = 49;
	public static readonly IS_KLEINER_OF_GELIJK_AAN = 50;
	public static readonly IS_GROTER_DAN = 51;
	public static readonly IS_GROTER_OF_GELIJK_AAN = 52;
	public static readonly ZIJN_GELIJK_AAN = 53;
	public static readonly ZIJN_ONGELIJK_AAN = 54;
	public static readonly ZIJN_GROTER_DAN = 55;
	public static readonly ZIJN_GROTER_OF_GELIJK_AAN = 56;
	public static readonly ZIJN_KLEINER_DAN = 57;
	public static readonly ZIJN_KLEINER_OF_GELIJK_AAN = 58;
	public static readonly IS_LATER_DAN = 59;
	public static readonly IS_LATER_OF_GELIJK_AAN = 60;
	public static readonly IS_EERDER_DAN = 61;
	public static readonly IS_EERDER_OF_GELIJK_AAN = 62;
	public static readonly ZIJN_LATER_DAN = 63;
	public static readonly ZIJN_LATER_OF_GELIJK_AAN = 64;
	public static readonly ZIJN_EERDER_DAN = 65;
	public static readonly ZIJN_EERDER_OF_GELIJK_AAN = 66;
	public static readonly IS_LEEG = 67;
	public static readonly IS_GEVULD = 68;
	public static readonly ZIJN_LEEG = 69;
	public static readonly ZIJN_GEVULD = 70;
	public static readonly IS_KENMERK = 71;
	public static readonly IS_ROL = 72;
	public static readonly ZIJN_KENMERK = 73;
	public static readonly ZIJN_ROL = 74;
	public static readonly IS_NIET_KENMERK = 75;
	public static readonly IS_NIET_ROL = 76;
	public static readonly ZIJN_NIET_KENMERK = 77;
	public static readonly ZIJN_NIET_ROL = 78;
	public static readonly VOLDOET_AAN_DE_ELFPROEF = 79;
	public static readonly VOLDOEN_AAN_DE_ELFPROEF = 80;
	public static readonly VOLDOET_NIET_AAN_DE_ELFPROEF = 81;
	public static readonly VOLDOEN_NIET_AAN_DE_ELFPROEF = 82;
	public static readonly IS_NUMERIEK_MET_EXACT = 83;
	public static readonly IS_NIET_NUMERIEK_MET_EXACT = 84;
	public static readonly ZIJN_NUMERIEK_MET_EXACT = 85;
	public static readonly ZIJN_NIET_NUMERIEK_MET_EXACT = 86;
	public static readonly IS_EEN_DAGSOORT = 87;
	public static readonly ZIJN_EEN_DAGSOORT = 88;
	public static readonly IS_GEEN_DAGSOORT = 89;
	public static readonly ZIJN_GEEN_DAGSOORT = 90;
	public static readonly MOETEN_UNIEK_ZIJN = 91;
	public static readonly IS_GEVUURD = 92;
	public static readonly IS_INCONSISTENT = 93;
	public static readonly CONSISTENTIEREGEL = 94;
	public static readonly REGEL = 95;
	public static readonly REGELGROEP = 96;
	public static readonly BESLISTABEL = 97;
	public static readonly OBJECTTYPE = 98;
	public static readonly DOMEIN = 99;
	public static readonly LIJST = 100;
	public static readonly DIMENSIE = 101;
	public static readonly EENHEIDSYSTEEM = 102;
	public static readonly PARAMETER = 103;
	public static readonly FEITTYPE = 104;
	public static readonly DAGSOORT = 105;
	public static readonly DAARBIJ_GELDT = 106;
	public static readonly GELDIG = 107;
	public static readonly HEBBEN = 108;
	public static readonly HEEFT = 109;
	public static readonly INDIEN = 110;
	public static readonly IS_RECURSIEF = 111;
	public static readonly IS = 112;
	public static readonly MOET = 113;
	public static readonly MOETEN = 114;
	public static readonly WORDT_VERDEELD_OVER = 115;
	public static readonly ZIJN = 116;
	public static readonly AAN = 117;
	public static readonly AFGEROND_OP = 118;
	public static readonly ALLE = 119;
	public static readonly EERDER_DAN = 120;
	public static readonly GEDEELD_DOOR = 121;
	public static readonly GEDEELD_DOOR_ABS = 122;
	public static readonly GELIJK_AAN = 123;
	public static readonly GEVULD = 124;
	public static readonly GEVUURD = 125;
	public static readonly GROTER_DAN = 126;
	public static readonly INCONSISTENT = 127;
	public static readonly KLEINER_DAN = 128;
	public static readonly LATER_DAN = 129;
	public static readonly LEEG = 130;
	public static readonly MAAL = 131;
	public static readonly MIN = 132;
	public static readonly NAAR_BENEDEN = 133;
	public static readonly NAAR_BOVEN = 134;
	public static readonly NIET = 135;
	public static readonly ONGELIJK_ZIJN_AAN = 136;
	public static readonly ONGELIJK_AAN = 137;
	public static readonly PLUS = 138;
	public static readonly REKENKUNDIG = 139;
	public static readonly RICHTING_NUL = 140;
	public static readonly TOT = 141;
	public static readonly TOT_DE_MACHT = 142;
	public static readonly TOT_EN_MET = 143;
	public static readonly UNIEK = 144;
	public static readonly VANAF = 145;
	public static readonly VERENIGD_MET = 146;
	public static readonly VERMINDERD_MET = 147;
	public static readonly VOLDOEN = 148;
	public static readonly VOLDOET = 149;
	public static readonly WEG_VAN_NUL = 150;
	public static readonly DE_WORTEL_VAN = 151;
	public static readonly TENMINSTE = 152;
	public static readonly TEN_MINSTE = 153;
	public static readonly TEN_HOOGSTE = 154;
	public static readonly PRECIES = 155;
	public static readonly VOORWAARDE = 156;
	public static readonly VOORWAARDEN = 157;
	public static readonly BEZITTELIJK = 158;
	public static readonly BIJVOEGLIJK = 159;
	public static readonly BEZIELD = 160;
	public static readonly BOOLEAN = 161;
	public static readonly CIJFERS = 162;
	public static readonly DATUM_IN_DAGEN = 163;
	public static readonly DECIMALEN = 164;
	public static readonly ENUMERATIE = 165;
	public static readonly GEDIMENSIONEERD_MET = 166;
	public static readonly GEHEEL_GETAL = 167;
	public static readonly GETAL = 168;
	public static readonly KENMERK = 169;
	public static readonly KENMERKEN = 170;
	public static readonly MET = 171;
	public static readonly MET_EENHEID = 172;
	public static readonly MV_START = 173;
	public static readonly NEGATIEF = 174;
	public static readonly NIET_NEGATIEF = 175;
	public static readonly NUMERIEK = 176;
	public static readonly PERCENTAGE = 177;
	public static readonly POSITIEF = 178;
	public static readonly ROL = 179;
	public static readonly ROLLEN = 180;
	public static readonly TEKST = 181;
	public static readonly VOOR_ELK_JAAR = 182;
	public static readonly VOOR_ELKE_DAG = 183;
	public static readonly VOOR_ELKE_MAAND = 184;
	public static readonly AANTAL = 185;
	public static readonly EERSTE_VAN = 186;
	public static readonly IN_HELE = 187;
	public static readonly LAATSTE_VAN = 188;
	public static readonly REEKS_VAN_TEKSTEN_EN_WAARDEN = 189;
	public static readonly SOM_VAN = 190;
	public static readonly TIJDSDUUR_VAN = 191;
	public static readonly AFNEMENDE = 192;
	public static readonly IN_GELIJKE_DELEN = 193;
	public static readonly OVER_VERDELING = 194;
	public static readonly TOENEMENDE = 195;
	public static readonly DRIE_TELWOORD = 196;
	public static readonly EEN_TELWOORD = 197;
	public static readonly GEEN_VAN_DE = 198;
	public static readonly GEEN = 199;
	public static readonly TWEE_TELWOORD = 200;
	public static readonly VIER_TELWOORD = 201;
	public static readonly ALTIJD = 202;
	public static readonly BIJ = 203;
	public static readonly DAG = 204;
	public static readonly DAGEN = 205;
	public static readonly DAT = 206;
	public static readonly DE = 207;
	public static readonly DD_PUNT = 208;
	public static readonly DIE = 209;
	public static readonly EEN = 210;
	public static readonly EN = 211;
	public static readonly HET = 212;
	public static readonly MEERDERE = 213;
	public static readonly HIJ = 214;
	public static readonly IN = 215;
	public static readonly JAAR = 216;
	public static readonly JAREN = 217;
	public static readonly KWARTAAL = 218;
	public static readonly MAAND = 219;
	public static readonly MAANDEN = 220;
	public static readonly MILLISECONDE = 221;
	public static readonly MINUUT = 222;
	public static readonly MINUTEN = 223;
	public static readonly OF = 224;
	public static readonly ONWAAR = 225;
	public static readonly OP = 226;
	public static readonly OUDER = 227;
	public static readonly OVER = 228;
	public static readonly PERIODE = 229;
	public static readonly REKENDATUM = 230;
	public static readonly REKENJAAR = 231;
	public static readonly REGELVERSIE = 232;
	public static readonly SECONDE = 233;
	public static readonly SECONDEN = 234;
	public static readonly TM = 235;
	public static readonly UIT = 236;
	public static readonly UUR = 237;
	public static readonly UREN = 238;
	public static readonly VAN = 239;
	public static readonly VOLGENDE_VOORWAARDE = 240;
	public static readonly VOLGENDE_VOORWAARDEN = 241;
	public static readonly VOLGENDE = 242;
	public static readonly VOOR = 243;
	public static readonly WAAR = 244;
	public static readonly WEEK = 245;
	public static readonly WEKEN = 246;
	public static readonly ER = 247;
	public static readonly METER = 248;
	public static readonly KILOGRAM = 249;
	public static readonly VOET = 250;
	public static readonly POND = 251;
	public static readonly MIJL = 252;
	public static readonly M = 253;
	public static readonly KG = 254;
	public static readonly S = 255;
	public static readonly FT = 256;
	public static readonly LB = 257;
	public static readonly MI = 258;
	public static readonly EURO_SYMBOL = 259;
	public static readonly DOLLAR_SYMBOL = 260;
	public static readonly DEGREE_SYMBOL = 261;
	public static readonly IDENTIFIER = 262;
	public static readonly NUMBER = 263;
	public static readonly EQUALS = 264;
	public static readonly DATE_TIME_LITERAL = 265;
	public static readonly PERCENTAGE_LITERAL = 266;
	public static readonly STRING_LITERAL = 267;
	public static readonly ENUM_LITERAL = 268;
	public static readonly LPAREN = 269;
	public static readonly RPAREN = 270;
	public static readonly LBRACE = 271;
	public static readonly RBRACE = 272;
	public static readonly COMMA = 273;
	public static readonly DOT = 274;
	public static readonly COLON = 275;
	public static readonly SEMICOLON = 276;
	public static readonly SLASH = 277;
	public static readonly PERCENT_SIGN = 278;
	public static readonly BULLET = 279;
	public static readonly ASTERISK = 280;
	public static readonly L_ANGLE_QUOTE = 281;
	public static readonly R_ANGLE_QUOTE = 282;
	public static readonly CARET = 283;
	public static readonly DOUBLE_DOT = 284;
	public static readonly WS = 285;
	public static readonly LINE_COMMENT = 286;
	public static readonly MINUS = 287;
	public static readonly PIPE = 288;
	public static readonly NVT = 289;
	public static readonly WORDT = 290;
	public static readonly VOLDAAN = 291;
	public static readonly EOF = Token.EOF;
	public static readonly RULE_regelSpraakDocument = 0;
	public static readonly RULE_definitie = 1;
	public static readonly RULE_beslistabel = 2;
	public static readonly RULE_beslistabelTable = 3;
	public static readonly RULE_beslistabelHeader = 4;
	public static readonly RULE_beslistabelSeparator = 5;
	public static readonly RULE_beslistabelRow = 6;
	public static readonly RULE_beslistabelCellValue = 7;
	public static readonly RULE_beslistabelColumnText = 8;
	public static readonly RULE_identifier = 9;
	public static readonly RULE_identifierOrKeyword = 10;
	public static readonly RULE_identifierOrKeywordNoIs = 11;
	public static readonly RULE_naamPhrase = 12;
	public static readonly RULE_naamPhraseWithNumbers = 13;
	public static readonly RULE_identifierOrKeywordWithNumbers = 14;
	public static readonly RULE_naamPhraseNoIs = 15;
	public static readonly RULE_naamwoord = 16;
	public static readonly RULE_naamwoordWithNumbers = 17;
	public static readonly RULE_naamwoordNoIs = 18;
	public static readonly RULE_voorzetsel = 19;
	public static readonly RULE_datumLiteral = 20;
	public static readonly RULE_unit = 21;
	public static readonly RULE_timeUnit = 22;
	public static readonly RULE_objectTypeDefinition = 23;
	public static readonly RULE_objectTypeMember = 24;
	public static readonly RULE_kenmerkSpecificatie = 25;
	public static readonly RULE_attribuutSpecificatie = 26;
	public static readonly RULE_datatype = 27;
	public static readonly RULE_lijstDatatype = 28;
	public static readonly RULE_numeriekDatatype = 29;
	public static readonly RULE_tekstDatatype = 30;
	public static readonly RULE_percentageDatatype = 31;
	public static readonly RULE_booleanDatatype = 32;
	public static readonly RULE_datumTijdDatatype = 33;
	public static readonly RULE_getalSpecificatie = 34;
	public static readonly RULE_domeinDefinition = 35;
	public static readonly RULE_domeinType = 36;
	public static readonly RULE_enumeratieSpecificatie = 37;
	public static readonly RULE_domeinRef = 38;
	public static readonly RULE_objectTypeRef = 39;
	public static readonly RULE_eenheidsysteemDefinition = 40;
	public static readonly RULE_eenheidEntry = 41;
	public static readonly RULE_unitIdentifier = 42;
	public static readonly RULE_eenheidExpressie = 43;
	public static readonly RULE_eenheidMacht = 44;
	public static readonly RULE_dimensieDefinition = 45;
	public static readonly RULE_voorzetselSpecificatie = 46;
	public static readonly RULE_labelWaardeSpecificatie = 47;
	public static readonly RULE_tijdlijn = 48;
	public static readonly RULE_dimensieRef = 49;
	public static readonly RULE_parameterDefinition = 50;
	public static readonly RULE_parameterNamePhrase = 51;
	public static readonly RULE_parameterNamePart = 52;
	public static readonly RULE_parameterMetLidwoord = 53;
	public static readonly RULE_feitTypeDefinition = 54;
	public static readonly RULE_rolDefinition = 55;
	public static readonly RULE_rolObjectType = 56;
	public static readonly RULE_rolContentWords = 57;
	public static readonly RULE_cardinalityLine = 58;
	public static readonly RULE_cardinalityWord = 59;
	public static readonly RULE_regel = 60;
	public static readonly RULE_regelGroep = 61;
	public static readonly RULE_regelName = 62;
	public static readonly RULE_regelNameExtension = 63;
	public static readonly RULE_regelVersie = 64;
	public static readonly RULE_versieGeldigheid = 65;
	public static readonly RULE_resultaatDeel = 66;
	public static readonly RULE_consistencyOperator = 67;
	public static readonly RULE_feitCreatiePattern = 68;
	public static readonly RULE_feitCreatieRolPhrase = 69;
	public static readonly RULE_feitCreatieSubjectPhrase = 70;
	public static readonly RULE_feitCreatieSubjectWord = 71;
	public static readonly RULE_feitCreatieWord = 72;
	public static readonly RULE_voorzetselNietVan = 73;
	public static readonly RULE_objectCreatie = 74;
	public static readonly RULE_objectAttributeInit = 75;
	public static readonly RULE_attributeInitVervolg = 76;
	public static readonly RULE_simpleNaamwoord = 77;
	public static readonly RULE_consistentieregel = 78;
	public static readonly RULE_uniekzijnResultaat = 79;
	public static readonly RULE_alleAttributenVanObjecttype = 80;
	public static readonly RULE_inconsistentResultaat = 81;
	public static readonly RULE_voorwaardeDeel = 82;
	public static readonly RULE_toplevelSamengesteldeVoorwaarde = 83;
	public static readonly RULE_voorwaardeKwantificatie = 84;
	public static readonly RULE_samengesteldeVoorwaardeOnderdeel = 85;
	public static readonly RULE_bulletPrefix = 86;
	public static readonly RULE_elementaireVoorwaarde = 87;
	public static readonly RULE_genesteSamengesteldeVoorwaarde = 88;
	public static readonly RULE_onderwerpReferentie = 89;
	public static readonly RULE_onderwerpReferentieWithNumbers = 90;
	public static readonly RULE_onderwerpBasis = 91;
	public static readonly RULE_onderwerpBasisWithNumbers = 92;
	public static readonly RULE_basisOnderwerp = 93;
	public static readonly RULE_basisOnderwerpWithNumbers = 94;
	public static readonly RULE_attribuutReferentie = 95;
	public static readonly RULE_attribuutMetLidwoord = 96;
	public static readonly RULE_kenmerkNaam = 97;
	public static readonly RULE_kenmerkPhrase = 98;
	public static readonly RULE_bezieldeReferentie = 99;
	public static readonly RULE_predicaat = 100;
	public static readonly RULE_elementairPredicaat = 101;
	public static readonly RULE_objectPredicaat = 102;
	public static readonly RULE_eenzijdigeObjectVergelijking = 103;
	public static readonly RULE_rolNaam = 104;
	public static readonly RULE_attribuutVergelijkingsPredicaat = 105;
	public static readonly RULE_getalPredicaat = 106;
	public static readonly RULE_tekstPredicaat = 107;
	public static readonly RULE_datumPredicaat = 108;
	public static readonly RULE_samengesteldPredicaat = 109;
	public static readonly RULE_samengesteldeVoorwaardeOnderdeelInPredicaat = 110;
	public static readonly RULE_elementaireVoorwaardeInPredicaat = 111;
	public static readonly RULE_vergelijkingInPredicaat = 112;
	public static readonly RULE_genesteSamengesteldeVoorwaardeInPredicaat = 113;
	public static readonly RULE_getalVergelijkingsOperatorMeervoud = 114;
	public static readonly RULE_tekstVergelijkingsOperatorMeervoud = 115;
	public static readonly RULE_datumVergelijkingsOperatorMeervoud = 116;
	public static readonly RULE_getalExpressie = 117;
	public static readonly RULE_tekstExpressie = 118;
	public static readonly RULE_datumExpressie = 119;
	public static readonly RULE_variabeleDeel = 120;
	public static readonly RULE_variabeleToekenning = 121;
	public static readonly RULE_variabeleExpressie = 122;
	public static readonly RULE_expressie = 123;
	public static readonly RULE_logicalExpression = 124;
	public static readonly RULE_comparisonExpression = 125;
	public static readonly RULE_comparisonOperator = 126;
	public static readonly RULE_additiveExpression = 127;
	public static readonly RULE_additiveOperator = 128;
	public static readonly RULE_multiplicativeExpression = 129;
	public static readonly RULE_multiplicativeOperator = 130;
	public static readonly RULE_powerExpression = 131;
	public static readonly RULE_powerOperator = 132;
	public static readonly RULE_primaryExpression = 133;
	public static readonly RULE_afronding = 134;
	public static readonly RULE_begrenzing = 135;
	public static readonly RULE_begrenzingMinimum = 136;
	public static readonly RULE_begrenzingMaximum = 137;
	public static readonly RULE_conditieBijExpressie = 138;
	public static readonly RULE_periodevergelijkingEnkelvoudig = 139;
	public static readonly RULE_periodeDefinitie = 140;
	public static readonly RULE_dateExpression = 141;
	public static readonly RULE_getalAggregatieFunctie = 142;
	public static readonly RULE_datumAggregatieFunctie = 143;
	public static readonly RULE_dimensieSelectie = 144;
	public static readonly RULE_aggregerenOverAlleDimensies = 145;
	public static readonly RULE_aggregerenOverVerzameling = 146;
	public static readonly RULE_aggregerenOverBereik = 147;
	public static readonly RULE_unaryCondition = 148;
	public static readonly RULE_regelStatusCondition = 149;
	public static readonly RULE_subordinateClauseExpression = 150;
	public static readonly RULE_dagsoortDefinition = 151;
	public static readonly RULE_verdelingResultaat = 152;
	public static readonly RULE_verdelingMethodeSimple = 153;
	public static readonly RULE_verdelingMethodeMultiLine = 154;
	public static readonly RULE_verdelingMethodeBulletList = 155;
	public static readonly RULE_verdelingMethodeBullet = 156;
	public static readonly RULE_verdelingMethode = 157;
	public static readonly RULE_verdelingRest = 158;
	public static readonly literalNames: (string | null)[] = [ null, "'(voor het attribuut zonder voorzetsel):'", 
                                                            "'(na het attribuut met voorzetsel'", 
                                                            "'Datum en tijd in millisecondes'", 
                                                            "'gedurende de tijd dat'", 
                                                            "'gedurende het gehele'", 
                                                            "'gedurende de gehele'", 
                                                            "'moet berekend worden als'", 
                                                            "'moet gesteld worden op'", 
                                                            "'moet ge\\u00EFnitialiseerd worden op'", 
                                                            "'de absolute tijdsduur van'", 
                                                            "'de absolute waarde van'", 
                                                            "'de maximale waarde van'", 
                                                            "'de minimale waarde van'", 
                                                            "'het totaal van'", 
                                                            "'het tijdsevenredig deel per'", 
                                                            "'de datum met jaar, maand en dag'", 
                                                            "'de eerste paasdag van'", 
                                                            "'Als onverdeelde rest blijft'", 
                                                            "'met een minimum van'", 
                                                            "'met een maximum van'", 
                                                            "'groter of gelijk aan'", 
                                                            "'kleiner of gelijk aan'", 
                                                            "'later of gelijk aan'", 
                                                            "'eerder of gelijk aan'", 
                                                            "'waarbij wordt verdeeld'", 
                                                            "', bestaande uit de'", 
                                                            "'Wederkerig feittype'", 
                                                            "'is van het type'", 
                                                            "'de concatenatie van'", 
                                                            "'het volgende criterium:'", 
                                                            "'volgende criteria:'", 
                                                            "'bij een even groot criterium'", 
                                                            "'op volgorde van'", 
                                                            "'naar rato van'", 
                                                            "'numeriek met exact'", 
                                                            "'aan de elfproef'", 
                                                            "'groter is dan'", 
                                                            "'kleiner is dan'", 
                                                            "'wordt voldaan'", 
                                                            null, "'wordt een nieuw'", 
                                                            "'aangemaakt'", 
                                                            "'Cre\\u00EBer'", 
                                                            "'nieuwe'", 
                                                            null, "'gelijk is aan'", 
                                                            "'is gelijk aan'", 
                                                            "'is ongelijk aan'", 
                                                            "'is kleiner dan'", 
                                                            "'is kleiner of gelijk aan'", 
                                                            "'is groter dan'", 
                                                            "'is groter of gelijk aan'", 
                                                            "'zijn gelijk aan'", 
                                                            "'zijn ongelijk aan'", 
                                                            "'zijn groter dan'", 
                                                            "'zijn groter of gelijk aan'", 
                                                            "'zijn kleiner dan'", 
                                                            "'zijn kleiner of gelijk aan'", 
                                                            "'is later dan'", 
                                                            "'is later of gelijk aan'", 
                                                            "'is eerder dan'", 
                                                            "'is eerder of gelijk aan'", 
                                                            "'zijn later dan'", 
                                                            "'zijn later of gelijk aan'", 
                                                            "'zijn eerder dan'", 
                                                            "'zijn eerder of gelijk aan'", 
                                                            "'is leeg'", 
                                                            "'is gevuld'", 
                                                            "'zijn leeg'", 
                                                            "'zijn gevuld'", 
                                                            "'is kenmerk'", 
                                                            "'is rol'", 
                                                            "'zijn kenmerk'", 
                                                            "'zijn rol'", 
                                                            "'is niet kenmerk'", 
                                                            "'is niet rol'", 
                                                            "'zijn niet kenmerk'", 
                                                            "'zijn niet rol'", 
                                                            "'voldoet aan de elfproef'", 
                                                            "'voldoen aan de elfproef'", 
                                                            "'voldoet niet aan de elfproef'", 
                                                            "'voldoen niet aan de elfproef'", 
                                                            "'is numeriek met exact'", 
                                                            "'is niet numeriek met exact'", 
                                                            "'zijn numeriek met exact'", 
                                                            "'zijn niet numeriek met exact'", 
                                                            "'is een dagsoort'", 
                                                            "'zijn een dagsoort'", 
                                                            "'is geen dagsoort'", 
                                                            "'zijn geen dagsoort'", 
                                                            "'moeten uniek zijn'", 
                                                            "'is gevuurd'", 
                                                            "'is inconsistent'", 
                                                            "'Consistentieregel'", 
                                                            "'Regel'", "'Regelgroep'", 
                                                            "'Beslistabel'", 
                                                            "'Objecttype'", 
                                                            "'Domein'", 
                                                            "'Lijst'", "'Dimensie'", 
                                                            "'Eenheidsysteem'", 
                                                            "'Parameter'", 
                                                            "'Feittype'", 
                                                            "'Dagsoort'", 
                                                            "'Daarbij geldt:'", 
                                                            "'geldig'", 
                                                            "'hebben'", 
                                                            "'heeft'", "'indien'", 
                                                            "'is recursief'", 
                                                            "'is'", "'moet'", 
                                                            "'moeten'", 
                                                            "'wordt verdeeld over'", 
                                                            "'zijn'", "'aan'", 
                                                            "'afgerond op'", 
                                                            "'alle'", "'eerder dan'", 
                                                            "'gedeeld door'", 
                                                            "'gedeeld door (ABS)'", 
                                                            "'gelijk aan'", 
                                                            "'gevuld'", 
                                                            "'gevuurd'", 
                                                            "'groter dan'", 
                                                            "'inconsistent'", 
                                                            "'kleiner dan'", 
                                                            "'later dan'", 
                                                            "'leeg'", "'maal'", 
                                                            "'min'", "'naar beneden'", 
                                                            "'naar boven'", 
                                                            "'niet'", "'ongelijk zijn aan'", 
                                                            "'ongelijk aan'", 
                                                            "'plus'", "'rekenkundig'", 
                                                            "'richting nul'", 
                                                            "'tot'", "'tot de macht'", 
                                                            "'tot en met'", 
                                                            "'uniek'", "'vanaf'", 
                                                            "'verenigd met'", 
                                                            "'verminderd met'", 
                                                            "'voldoen'", 
                                                            "'voldoet'", 
                                                            "'weg van nul'", 
                                                            "'de wortel van'", 
                                                            "'tenminste'", 
                                                            "'ten minste'", 
                                                            "'ten hoogste'", 
                                                            "'precies'", 
                                                            "'voorwaarde'", 
                                                            "'voorwaarden'", 
                                                            "'(bezittelijk)'", 
                                                            "'(bijvoeglijk)'", 
                                                            "'(bezield)'", 
                                                            "'Boolean'", 
                                                            "'cijfers'", 
                                                            "'Datum in dagen'", 
                                                            "'decimalen'", 
                                                            "'Enumeratie'", 
                                                            "'gedimensioneerd met'", 
                                                            "'geheel getal'", 
                                                            "'getal'", "'kenmerk'", 
                                                            "'kenmerken'", 
                                                            "'met'", "'met eenheid'", 
                                                            "'(mv:'", "'negatief'", 
                                                            "'niet-negatief'", 
                                                            "'Numeriek'", 
                                                            "'Percentage'", 
                                                            "'positief'", 
                                                            "'rol'", "'rollen'", 
                                                            "'Tekst'", "'voor elk jaar'", 
                                                            "'voor elke dag'", 
                                                            "'voor elke maand'", 
                                                            "'aantal'", 
                                                            "'de eerste van'", 
                                                            "'in hele'", 
                                                            "'de laatste van'", 
                                                            "'reeks van teksten en waarden'", 
                                                            "'de som van'", 
                                                            "'de tijdsduur van'", 
                                                            "'afnemende'", 
                                                            "'in gelijke delen'", 
                                                            "'over.'", "'toenemende'", 
                                                            "'drie'", "'\\u00E9\\u00E9n'", 
                                                            "'geen van de'", 
                                                            "'geen'", "'twee'", 
                                                            "'vier'", "'altijd'", 
                                                            "'bij'", "'dag'", 
                                                            "'dagen'", "'dat'", 
                                                            null, "'dd.'", 
                                                            "'die'", null, 
                                                            "'en'", null, 
                                                            "'meerdere'", 
                                                            "'hij'", "'in'", 
                                                            "'jaar'", "'jaren'", 
                                                            "'kwartaal'", 
                                                            "'maand'", "'maanden'", 
                                                            "'milliseconde'", 
                                                            "'minuut'", 
                                                            "'minuten'", 
                                                            "'of'", "'onwaar'", 
                                                            "'op'", "'ouder'", 
                                                            "'over'", "'periode'", 
                                                            "'Rekendatum'", 
                                                            "'Rekenjaar'", 
                                                            "'regelversie'", 
                                                            "'seconde'", 
                                                            "'seconden'", 
                                                            "'t/m'", "'uit'", 
                                                            "'uur'", "'uren'", 
                                                            "'van'", "'volgende voorwaarde'", 
                                                            "'volgende voorwaarden'", 
                                                            "'volgende'", 
                                                            "'voor'", "'waar'", 
                                                            "'week'", "'weken'", 
                                                            "'er'", "'meter'", 
                                                            "'kilogram'", 
                                                            "'voet'", "'pond'", 
                                                            "'mijl'", "'m'", 
                                                            "'kg'", "'s'", 
                                                            "'ft'", "'lb'", 
                                                            "'mi'", "'\\u20AC'", 
                                                            "'$'", "'\\u00B0'", 
                                                            null, null, 
                                                            "'='", null, 
                                                            null, null, 
                                                            null, "'('", 
                                                            "')'", "'{'", 
                                                            "'}'", "','", 
                                                            "'.'", "':'", 
                                                            "';'", "'/'", 
                                                            "'%'", "'\\u2022'", 
                                                            "'*'", "'\\u00AB'", 
                                                            "'\\u00BB'", 
                                                            "'^'", "'..'", 
                                                            null, null, 
                                                            "'-'", "'|'", 
                                                            "'n.v.t.'" ];
	public static readonly symbolicNames: (string | null)[] = [ null, "VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL", 
                                                             "NA_HET_ATTRIBUUT_MET_VOORZETSEL", 
                                                             "DATUM_TIJD_MILLIS", 
                                                             "GEDURENDE_DE_TIJD_DAT", 
                                                             "GEDURENDE_HET_GEHELE", 
                                                             "GEDURENDE_DE_GEHELE", 
                                                             "WORDT_BEREKEND_ALS", 
                                                             "WORDT_GESTELD_OP", 
                                                             "WORDT_GEINITIALISEERD_OP", 
                                                             "DE_ABSOLUTE_TIJDSDUUR_VAN", 
                                                             "DE_ABSOLUTE_WAARDE_VAN", 
                                                             "DE_MAXIMALE_WAARDE_VAN", 
                                                             "DE_MINIMALE_WAARDE_VAN", 
                                                             "HET_TOTAAL_VAN", 
                                                             "HET_TIJDSEVENREDIG_DEEL_PER", 
                                                             "DE_DATUM_MET", 
                                                             "DE_EERSTE_PAASDAG_VAN", 
                                                             "ALS_ONVERDEELDE_REST_BLIJFT", 
                                                             "MET_EEN_MINIMUM_VAN", 
                                                             "MET_EEN_MAXIMUM_VAN", 
                                                             "GROTER_OF_GELIJK_AAN", 
                                                             "KLEINER_OF_GELIJK_AAN", 
                                                             "LATER_OF_GELIJK_AAN", 
                                                             "EERDER_OF_GELIJK_AAN", 
                                                             "WAARBIJ_WORDT_VERDEELD", 
                                                             "BESTAANDE_UIT", 
                                                             "WEDERKERIG_FEITTYPE", 
                                                             "IS_VAN_HET_TYPE", 
                                                             "CONCATENATIE_VAN", 
                                                             "VOLGEND_CRITERIUM", 
                                                             "VOLGENDE_CRITERIA", 
                                                             "BIJ_EVEN_GROOT_CRITERIUM", 
                                                             "OP_VOLGORDE_VAN", 
                                                             "NAAR_RATO_VAN", 
                                                             "NUMERIEK_MET_EXACT", 
                                                             "AAN_DE_ELFPROEF", 
                                                             "GROTER_IS_DAN", 
                                                             "KLEINER_IS_DAN", 
                                                             "WORDT_VOLDAAN", 
                                                             "ER_WORDT_EEN_NIEUW", 
                                                             "WORDT_EEN_NIEUW", 
                                                             "AANGEMAAKT", 
                                                             "CREEER", "NIEUWE", 
                                                             "ER_AAN", "GELIJK_IS_AAN", 
                                                             "IS_GELIJK_AAN", 
                                                             "IS_ONGELIJK_AAN", 
                                                             "IS_KLEINER_DAN", 
                                                             "IS_KLEINER_OF_GELIJK_AAN", 
                                                             "IS_GROTER_DAN", 
                                                             "IS_GROTER_OF_GELIJK_AAN", 
                                                             "ZIJN_GELIJK_AAN", 
                                                             "ZIJN_ONGELIJK_AAN", 
                                                             "ZIJN_GROTER_DAN", 
                                                             "ZIJN_GROTER_OF_GELIJK_AAN", 
                                                             "ZIJN_KLEINER_DAN", 
                                                             "ZIJN_KLEINER_OF_GELIJK_AAN", 
                                                             "IS_LATER_DAN", 
                                                             "IS_LATER_OF_GELIJK_AAN", 
                                                             "IS_EERDER_DAN", 
                                                             "IS_EERDER_OF_GELIJK_AAN", 
                                                             "ZIJN_LATER_DAN", 
                                                             "ZIJN_LATER_OF_GELIJK_AAN", 
                                                             "ZIJN_EERDER_DAN", 
                                                             "ZIJN_EERDER_OF_GELIJK_AAN", 
                                                             "IS_LEEG", 
                                                             "IS_GEVULD", 
                                                             "ZIJN_LEEG", 
                                                             "ZIJN_GEVULD", 
                                                             "IS_KENMERK", 
                                                             "IS_ROL", "ZIJN_KENMERK", 
                                                             "ZIJN_ROL", 
                                                             "IS_NIET_KENMERK", 
                                                             "IS_NIET_ROL", 
                                                             "ZIJN_NIET_KENMERK", 
                                                             "ZIJN_NIET_ROL", 
                                                             "VOLDOET_AAN_DE_ELFPROEF", 
                                                             "VOLDOEN_AAN_DE_ELFPROEF", 
                                                             "VOLDOET_NIET_AAN_DE_ELFPROEF", 
                                                             "VOLDOEN_NIET_AAN_DE_ELFPROEF", 
                                                             "IS_NUMERIEK_MET_EXACT", 
                                                             "IS_NIET_NUMERIEK_MET_EXACT", 
                                                             "ZIJN_NUMERIEK_MET_EXACT", 
                                                             "ZIJN_NIET_NUMERIEK_MET_EXACT", 
                                                             "IS_EEN_DAGSOORT", 
                                                             "ZIJN_EEN_DAGSOORT", 
                                                             "IS_GEEN_DAGSOORT", 
                                                             "ZIJN_GEEN_DAGSOORT", 
                                                             "MOETEN_UNIEK_ZIJN", 
                                                             "IS_GEVUURD", 
                                                             "IS_INCONSISTENT", 
                                                             "CONSISTENTIEREGEL", 
                                                             "REGEL", "REGELGROEP", 
                                                             "BESLISTABEL", 
                                                             "OBJECTTYPE", 
                                                             "DOMEIN", "LIJST", 
                                                             "DIMENSIE", 
                                                             "EENHEIDSYSTEEM", 
                                                             "PARAMETER", 
                                                             "FEITTYPE", 
                                                             "DAGSOORT", 
                                                             "DAARBIJ_GELDT", 
                                                             "GELDIG", "HEBBEN", 
                                                             "HEEFT", "INDIEN", 
                                                             "IS_RECURSIEF", 
                                                             "IS", "MOET", 
                                                             "MOETEN", "WORDT_VERDEELD_OVER", 
                                                             "ZIJN", "AAN", 
                                                             "AFGEROND_OP", 
                                                             "ALLE", "EERDER_DAN", 
                                                             "GEDEELD_DOOR", 
                                                             "GEDEELD_DOOR_ABS", 
                                                             "GELIJK_AAN", 
                                                             "GEVULD", "GEVUURD", 
                                                             "GROTER_DAN", 
                                                             "INCONSISTENT", 
                                                             "KLEINER_DAN", 
                                                             "LATER_DAN", 
                                                             "LEEG", "MAAL", 
                                                             "MIN", "NAAR_BENEDEN", 
                                                             "NAAR_BOVEN", 
                                                             "NIET", "ONGELIJK_ZIJN_AAN", 
                                                             "ONGELIJK_AAN", 
                                                             "PLUS", "REKENKUNDIG", 
                                                             "RICHTING_NUL", 
                                                             "TOT", "TOT_DE_MACHT", 
                                                             "TOT_EN_MET", 
                                                             "UNIEK", "VANAF", 
                                                             "VERENIGD_MET", 
                                                             "VERMINDERD_MET", 
                                                             "VOLDOEN", 
                                                             "VOLDOET", 
                                                             "WEG_VAN_NUL", 
                                                             "DE_WORTEL_VAN", 
                                                             "TENMINSTE", 
                                                             "TEN_MINSTE", 
                                                             "TEN_HOOGSTE", 
                                                             "PRECIES", 
                                                             "VOORWAARDE", 
                                                             "VOORWAARDEN", 
                                                             "BEZITTELIJK", 
                                                             "BIJVOEGLIJK", 
                                                             "BEZIELD", 
                                                             "BOOLEAN", 
                                                             "CIJFERS", 
                                                             "DATUM_IN_DAGEN", 
                                                             "DECIMALEN", 
                                                             "ENUMERATIE", 
                                                             "GEDIMENSIONEERD_MET", 
                                                             "GEHEEL_GETAL", 
                                                             "GETAL", "KENMERK", 
                                                             "KENMERKEN", 
                                                             "MET", "MET_EENHEID", 
                                                             "MV_START", 
                                                             "NEGATIEF", 
                                                             "NIET_NEGATIEF", 
                                                             "NUMERIEK", 
                                                             "PERCENTAGE", 
                                                             "POSITIEF", 
                                                             "ROL", "ROLLEN", 
                                                             "TEKST", "VOOR_ELK_JAAR", 
                                                             "VOOR_ELKE_DAG", 
                                                             "VOOR_ELKE_MAAND", 
                                                             "AANTAL", "EERSTE_VAN", 
                                                             "IN_HELE", 
                                                             "LAATSTE_VAN", 
                                                             "REEKS_VAN_TEKSTEN_EN_WAARDEN", 
                                                             "SOM_VAN", 
                                                             "TIJDSDUUR_VAN", 
                                                             "AFNEMENDE", 
                                                             "IN_GELIJKE_DELEN", 
                                                             "OVER_VERDELING", 
                                                             "TOENEMENDE", 
                                                             "DRIE_TELWOORD", 
                                                             "EEN_TELWOORD", 
                                                             "GEEN_VAN_DE", 
                                                             "GEEN", "TWEE_TELWOORD", 
                                                             "VIER_TELWOORD", 
                                                             "ALTIJD", "BIJ", 
                                                             "DAG", "DAGEN", 
                                                             "DAT", "DE", 
                                                             "DD_PUNT", 
                                                             "DIE", "EEN", 
                                                             "EN", "HET", 
                                                             "MEERDERE", 
                                                             "HIJ", "IN", 
                                                             "JAAR", "JAREN", 
                                                             "KWARTAAL", 
                                                             "MAAND", "MAANDEN", 
                                                             "MILLISECONDE", 
                                                             "MINUUT", "MINUTEN", 
                                                             "OF", "ONWAAR", 
                                                             "OP", "OUDER", 
                                                             "OVER", "PERIODE", 
                                                             "REKENDATUM", 
                                                             "REKENJAAR", 
                                                             "REGELVERSIE", 
                                                             "SECONDE", 
                                                             "SECONDEN", 
                                                             "TM", "UIT", 
                                                             "UUR", "UREN", 
                                                             "VAN", "VOLGENDE_VOORWAARDE", 
                                                             "VOLGENDE_VOORWAARDEN", 
                                                             "VOLGENDE", 
                                                             "VOOR", "WAAR", 
                                                             "WEEK", "WEKEN", 
                                                             "ER", "METER", 
                                                             "KILOGRAM", 
                                                             "VOET", "POND", 
                                                             "MIJL", "M", 
                                                             "KG", "S", 
                                                             "FT", "LB", 
                                                             "MI", "EURO_SYMBOL", 
                                                             "DOLLAR_SYMBOL", 
                                                             "DEGREE_SYMBOL", 
                                                             "IDENTIFIER", 
                                                             "NUMBER", "EQUALS", 
                                                             "DATE_TIME_LITERAL", 
                                                             "PERCENTAGE_LITERAL", 
                                                             "STRING_LITERAL", 
                                                             "ENUM_LITERAL", 
                                                             "LPAREN", "RPAREN", 
                                                             "LBRACE", "RBRACE", 
                                                             "COMMA", "DOT", 
                                                             "COLON", "SEMICOLON", 
                                                             "SLASH", "PERCENT_SIGN", 
                                                             "BULLET", "ASTERISK", 
                                                             "L_ANGLE_QUOTE", 
                                                             "R_ANGLE_QUOTE", 
                                                             "CARET", "DOUBLE_DOT", 
                                                             "WS", "LINE_COMMENT", 
                                                             "MINUS", "PIPE", 
                                                             "NVT", "WORDT", 
                                                             "VOLDAAN" ];
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"regelSpraakDocument", "definitie", "beslistabel", "beslistabelTable", 
		"beslistabelHeader", "beslistabelSeparator", "beslistabelRow", "beslistabelCellValue", 
		"beslistabelColumnText", "identifier", "identifierOrKeyword", "identifierOrKeywordNoIs", 
		"naamPhrase", "naamPhraseWithNumbers", "identifierOrKeywordWithNumbers", 
		"naamPhraseNoIs", "naamwoord", "naamwoordWithNumbers", "naamwoordNoIs", 
		"voorzetsel", "datumLiteral", "unit", "timeUnit", "objectTypeDefinition", 
		"objectTypeMember", "kenmerkSpecificatie", "attribuutSpecificatie", "datatype", 
		"lijstDatatype", "numeriekDatatype", "tekstDatatype", "percentageDatatype", 
		"booleanDatatype", "datumTijdDatatype", "getalSpecificatie", "domeinDefinition", 
		"domeinType", "enumeratieSpecificatie", "domeinRef", "objectTypeRef", 
		"eenheidsysteemDefinition", "eenheidEntry", "unitIdentifier", "eenheidExpressie", 
		"eenheidMacht", "dimensieDefinition", "voorzetselSpecificatie", "labelWaardeSpecificatie", 
		"tijdlijn", "dimensieRef", "parameterDefinition", "parameterNamePhrase", 
		"parameterNamePart", "parameterMetLidwoord", "feitTypeDefinition", "rolDefinition", 
		"rolObjectType", "rolContentWords", "cardinalityLine", "cardinalityWord", 
		"regel", "regelGroep", "regelName", "regelNameExtension", "regelVersie", 
		"versieGeldigheid", "resultaatDeel", "consistencyOperator", "feitCreatiePattern", 
		"feitCreatieRolPhrase", "feitCreatieSubjectPhrase", "feitCreatieSubjectWord", 
		"feitCreatieWord", "voorzetselNietVan", "objectCreatie", "objectAttributeInit", 
		"attributeInitVervolg", "simpleNaamwoord", "consistentieregel", "uniekzijnResultaat", 
		"alleAttributenVanObjecttype", "inconsistentResultaat", "voorwaardeDeel", 
		"toplevelSamengesteldeVoorwaarde", "voorwaardeKwantificatie", "samengesteldeVoorwaardeOnderdeel", 
		"bulletPrefix", "elementaireVoorwaarde", "genesteSamengesteldeVoorwaarde", 
		"onderwerpReferentie", "onderwerpReferentieWithNumbers", "onderwerpBasis", 
		"onderwerpBasisWithNumbers", "basisOnderwerp", "basisOnderwerpWithNumbers", 
		"attribuutReferentie", "attribuutMetLidwoord", "kenmerkNaam", "kenmerkPhrase", 
		"bezieldeReferentie", "predicaat", "elementairPredicaat", "objectPredicaat", 
		"eenzijdigeObjectVergelijking", "rolNaam", "attribuutVergelijkingsPredicaat", 
		"getalPredicaat", "tekstPredicaat", "datumPredicaat", "samengesteldPredicaat", 
		"samengesteldeVoorwaardeOnderdeelInPredicaat", "elementaireVoorwaardeInPredicaat", 
		"vergelijkingInPredicaat", "genesteSamengesteldeVoorwaardeInPredicaat", 
		"getalVergelijkingsOperatorMeervoud", "tekstVergelijkingsOperatorMeervoud", 
		"datumVergelijkingsOperatorMeervoud", "getalExpressie", "tekstExpressie", 
		"datumExpressie", "variabeleDeel", "variabeleToekenning", "variabeleExpressie", 
		"expressie", "logicalExpression", "comparisonExpression", "comparisonOperator", 
		"additiveExpression", "additiveOperator", "multiplicativeExpression", 
		"multiplicativeOperator", "powerExpression", "powerOperator", "primaryExpression", 
		"afronding", "begrenzing", "begrenzingMinimum", "begrenzingMaximum", "conditieBijExpressie", 
		"periodevergelijkingEnkelvoudig", "periodeDefinitie", "dateExpression", 
		"getalAggregatieFunctie", "datumAggregatieFunctie", "dimensieSelectie", 
		"aggregerenOverAlleDimensies", "aggregerenOverVerzameling", "aggregerenOverBereik", 
		"unaryCondition", "regelStatusCondition", "subordinateClauseExpression", 
		"dagsoortDefinition", "verdelingResultaat", "verdelingMethodeSimple", 
		"verdelingMethodeMultiLine", "verdelingMethodeBulletList", "verdelingMethodeBullet", 
		"verdelingMethode", "verdelingRest",
	];
	public get grammarFileName(): string { return "RegelSpraak.g4"; }
	public get literalNames(): (string | null)[] { return RegelSpraakParser.literalNames; }
	public get symbolicNames(): (string | null)[] { return RegelSpraakParser.symbolicNames; }
	public get ruleNames(): string[] { return RegelSpraakParser.ruleNames; }
	public get serializedATN(): number[] { return RegelSpraakParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(this, RegelSpraakParser._ATN, RegelSpraakParser.DecisionsToDFA, new PredictionContextCache());
	}
	// @RuleVersion(0)
	public regelSpraakDocument(): RegelSpraakDocumentContext {
		let localctx: RegelSpraakDocumentContext = new RegelSpraakDocumentContext(this, this._ctx, this.state);
		this.enterRule(localctx, 0, RegelSpraakParser.RULE_regelSpraakDocument);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 326;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===27 || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 4031) !== 0)) {
				{
				this.state = 324;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 27:
				case 98:
				case 99:
				case 101:
				case 103:
				case 104:
				case 105:
					{
					this.state = 318;
					this.definitie();
					}
					break;
				case 95:
					{
					this.state = 319;
					this.regel();
					}
					break;
				case 96:
					{
					this.state = 320;
					this.regelGroep();
					}
					break;
				case 97:
					{
					this.state = 321;
					this.beslistabel();
					}
					break;
				case 94:
					{
					this.state = 322;
					this.consistentieregel();
					}
					break;
				case 102:
					{
					this.state = 323;
					this.eenheidsysteemDefinition();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 328;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 329;
			this.match(RegelSpraakParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public definitie(): DefinitieContext {
		let localctx: DefinitieContext = new DefinitieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 2, RegelSpraakParser.RULE_definitie);
		try {
			this.state = 337;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 98:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 331;
				this.objectTypeDefinition();
				}
				break;
			case 99:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 332;
				this.domeinDefinition();
				}
				break;
			case 103:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 333;
				this.parameterDefinition();
				}
				break;
			case 101:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 334;
				this.dimensieDefinition();
				}
				break;
			case 27:
			case 104:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 335;
				this.feitTypeDefinition();
				}
				break;
			case 105:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 336;
				this.dagsoortDefinition();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public beslistabel(): BeslistabelContext {
		let localctx: BeslistabelContext = new BeslistabelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 4, RegelSpraakParser.RULE_beslistabel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 339;
			this.match(RegelSpraakParser.BESLISTABEL);
			this.state = 340;
			this.naamwoord();
			this.state = 342;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===107) {
				{
				this.state = 341;
				this.regelVersie();
				}
			}

			this.state = 344;
			this.beslistabelTable();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public beslistabelTable(): BeslistabelTableContext {
		let localctx: BeslistabelTableContext = new BeslistabelTableContext(this, this._ctx, this.state);
		this.enterRule(localctx, 6, RegelSpraakParser.RULE_beslistabelTable);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 346;
			this.beslistabelHeader();
			this.state = 347;
			this.beslistabelSeparator();
			this.state = 349;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 348;
				this.beslistabelRow();
				}
				}
				this.state = 351;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===288);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public beslistabelHeader(): BeslistabelHeaderContext {
		let localctx: BeslistabelHeaderContext = new BeslistabelHeaderContext(this, this._ctx, this.state);
		this.enterRule(localctx, 8, RegelSpraakParser.RULE_beslistabelHeader);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 353;
			this.match(RegelSpraakParser.PIPE);
			this.state = 355;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===288) {
				{
				this.state = 354;
				this.match(RegelSpraakParser.PIPE);
				}
			}

			this.state = 357;
			localctx._resultColumn = this.beslistabelColumnText();
			this.state = 358;
			this.match(RegelSpraakParser.PIPE);
			this.state = 359;
			localctx._beslistabelColumnText = this.beslistabelColumnText();
			localctx._conditionColumns.push(localctx._beslistabelColumnText);
			this.state = 364;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 6, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 360;
					this.match(RegelSpraakParser.PIPE);
					this.state = 361;
					localctx._beslistabelColumnText = this.beslistabelColumnText();
					localctx._conditionColumns.push(localctx._beslistabelColumnText);
					}
					}
				}
				this.state = 366;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 6, this._ctx);
			}
			this.state = 368;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				{
				this.state = 367;
				this.match(RegelSpraakParser.PIPE);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public beslistabelSeparator(): BeslistabelSeparatorContext {
		let localctx: BeslistabelSeparatorContext = new BeslistabelSeparatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 10, RegelSpraakParser.RULE_beslistabelSeparator);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 371;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===288) {
				{
				this.state = 370;
				this.match(RegelSpraakParser.PIPE);
				}
			}

			this.state = 381;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 374;
					this._errHandler.sync(this);
					_alt = 1;
					do {
						switch (_alt) {
						case 1:
							{
							{
							this.state = 373;
							this.match(RegelSpraakParser.MINUS);
							}
							}
							break;
						default:
							throw new NoViableAltException(this);
						}
						this.state = 376;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 9, this._ctx);
					} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
					this.state = 379;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 10, this._ctx) ) {
					case 1:
						{
						this.state = 378;
						this.match(RegelSpraakParser.PIPE);
						}
						break;
					}
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 383;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 11, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			this.state = 388;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===287) {
				{
				{
				this.state = 385;
				this.match(RegelSpraakParser.MINUS);
				}
				}
				this.state = 390;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public beslistabelRow(): BeslistabelRowContext {
		let localctx: BeslistabelRowContext = new BeslistabelRowContext(this, this._ctx, this.state);
		this.enterRule(localctx, 12, RegelSpraakParser.RULE_beslistabelRow);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 391;
			this.match(RegelSpraakParser.PIPE);
			this.state = 392;
			localctx._rowNumber = this.match(RegelSpraakParser.NUMBER);
			this.state = 393;
			this.match(RegelSpraakParser.PIPE);
			this.state = 394;
			localctx._resultExpression = this.expressie();
			this.state = 395;
			this.match(RegelSpraakParser.PIPE);
			this.state = 396;
			localctx._beslistabelCellValue = this.beslistabelCellValue();
			localctx._conditionValues.push(localctx._beslistabelCellValue);
			this.state = 401;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 397;
					this.match(RegelSpraakParser.PIPE);
					this.state = 398;
					localctx._beslistabelCellValue = this.beslistabelCellValue();
					localctx._conditionValues.push(localctx._beslistabelCellValue);
					}
					}
				}
				this.state = 403;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
			}
			this.state = 405;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 14, this._ctx) ) {
			case 1:
				{
				this.state = 404;
				this.match(RegelSpraakParser.PIPE);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public beslistabelCellValue(): BeslistabelCellValueContext {
		let localctx: BeslistabelCellValueContext = new BeslistabelCellValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 14, RegelSpraakParser.RULE_beslistabelCellValue);
		try {
			this.state = 409;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 10:
			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
			case 29:
			case 44:
			case 95:
			case 109:
			case 112:
			case 116:
			case 119:
			case 127:
			case 132:
			case 135:
			case 151:
			case 156:
			case 185:
			case 186:
			case 188:
			case 190:
			case 191:
			case 196:
			case 197:
			case 200:
			case 201:
			case 204:
			case 205:
			case 207:
			case 210:
			case 212:
			case 214:
			case 216:
			case 218:
			case 219:
			case 225:
			case 227:
			case 229:
			case 230:
			case 232:
			case 244:
			case 248:
			case 262:
			case 263:
			case 265:
			case 266:
			case 267:
			case 268:
			case 269:
			case 287:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 407;
				this.expressie();
				}
				break;
			case 289:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 408;
				this.match(RegelSpraakParser.NVT);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public beslistabelColumnText(): BeslistabelColumnTextContext {
		let localctx: BeslistabelColumnTextContext = new BeslistabelColumnTextContext(this, this._ctx, this.state);
		this.enterRule(localctx, 16, RegelSpraakParser.RULE_beslistabelColumnText);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 412;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 411;
					_la = this._input.LA(1);
					if(_la<=0 || _la===288) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 414;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 16, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public identifier(): IdentifierContext {
		let localctx: IdentifierContext = new IdentifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 18, RegelSpraakParser.RULE_identifier);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 416;
			this.match(RegelSpraakParser.IDENTIFIER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public identifierOrKeyword(): IdentifierOrKeywordContext {
		let localctx: IdentifierOrKeywordContext = new IdentifierOrKeywordContext(this, this._ctx, this.state);
		this.enterRule(localctx, 20, RegelSpraakParser.RULE_identifierOrKeyword);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 418;
			_la = this._input.LA(1);
			if(!(((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || _la===127 || _la===156 || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & 2149160961) !== 0) || ((((_la - 218)) & ~0x1F) === 0 && ((1 << (_la - 218)) & 1073744387) !== 0) || _la===262)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public identifierOrKeywordNoIs(): IdentifierOrKeywordNoIsContext {
		let localctx: IdentifierOrKeywordNoIsContext = new IdentifierOrKeywordNoIsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 22, RegelSpraakParser.RULE_identifierOrKeywordNoIs);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 420;
			_la = this._input.LA(1);
			if(!(((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16793601) !== 0) || _la===127 || _la===156 || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & 2149160961) !== 0) || ((((_la - 218)) & ~0x1F) === 0 && ((1 << (_la - 218)) & 1073744387) !== 0) || _la===262)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public naamPhrase(): NaamPhraseContext {
		let localctx: NaamPhraseContext = new NaamPhraseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 24, RegelSpraakParser.RULE_naamPhrase);
		let _la: number;
		try {
			let _alt: number;
			this.state = 479;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 27, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 423;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116 || ((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0)) {
					{
					this.state = 422;
					_la = this._input.LA(1);
					if(!(_la===116 || ((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0))) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 426;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 425;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 428;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 18, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 431;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 430;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 433;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 19, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 435;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 437;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 436;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 439;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 20, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 441;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 443;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 442;
					this.identifierOrKeyword();
					}
					}
					this.state = 445;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || _la===127 || _la===156 || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & 2149160961) !== 0) || ((((_la - 218)) & ~0x1F) === 0 && ((1 << (_la - 218)) & 1073744387) !== 0) || _la===262);
				this.state = 447;
				this.match(RegelSpraakParser.MET);
				this.state = 449;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 448;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 451;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 22, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 454;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 453;
					this.identifierOrKeyword();
					}
					}
					this.state = 456;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || _la===127 || _la===156 || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & 2149160961) !== 0) || ((((_la - 218)) & ~0x1F) === 0 && ((1 << (_la - 218)) & 1073744387) !== 0) || _la===262);
				this.state = 458;
				this.match(RegelSpraakParser.MET);
				this.state = 460;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 459;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 462;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 24, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 464;
				this.match(RegelSpraakParser.NIET);
				this.state = 466;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 465;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 468;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 25, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 470;
				this.match(RegelSpraakParser.HET);
				this.state = 471;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 472;
				this.match(RegelSpraakParser.DAGEN);
				this.state = 473;
				this.match(RegelSpraakParser.IN);
				this.state = 475;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 474;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 477;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 26, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public naamPhraseWithNumbers(): NaamPhraseWithNumbersContext {
		let localctx: NaamPhraseWithNumbersContext = new NaamPhraseWithNumbersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, RegelSpraakParser.RULE_naamPhraseWithNumbers);
		let _la: number;
		try {
			let _alt: number;
			this.state = 538;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 38, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 482;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116 || ((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0)) {
					{
					this.state = 481;
					_la = this._input.LA(1);
					if(!(_la===116 || ((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0))) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 485;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 484;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 487;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 29, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 490;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 489;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 492;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 30, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 494;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 496;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 495;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 498;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 31, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 500;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 502;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 501;
					this.identifierOrKeywordWithNumbers();
					}
					}
					this.state = 504;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || _la===127 || _la===156 || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & 2149160961) !== 0) || ((((_la - 218)) & ~0x1F) === 0 && ((1 << (_la - 218)) & 1073744387) !== 0) || _la===262 || _la===263);
				this.state = 506;
				this.match(RegelSpraakParser.MET);
				this.state = 508;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 507;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 510;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 33, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 513;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 512;
					this.identifierOrKeywordWithNumbers();
					}
					}
					this.state = 515;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || _la===127 || _la===156 || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & 2149160961) !== 0) || ((((_la - 218)) & ~0x1F) === 0 && ((1 << (_la - 218)) & 1073744387) !== 0) || _la===262 || _la===263);
				this.state = 517;
				this.match(RegelSpraakParser.MET);
				this.state = 519;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 518;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 521;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 35, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 523;
				this.match(RegelSpraakParser.NIET);
				this.state = 525;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 524;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 527;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 36, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 529;
				this.match(RegelSpraakParser.HET);
				this.state = 530;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 531;
				this.match(RegelSpraakParser.DAGEN);
				this.state = 532;
				this.match(RegelSpraakParser.IN);
				this.state = 534;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 533;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 536;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 37, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public identifierOrKeywordWithNumbers(): IdentifierOrKeywordWithNumbersContext {
		let localctx: IdentifierOrKeywordWithNumbersContext = new IdentifierOrKeywordWithNumbersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 28, RegelSpraakParser.RULE_identifierOrKeywordWithNumbers);
		try {
			this.state = 542;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 95:
			case 109:
			case 112:
			case 119:
			case 127:
			case 156:
			case 185:
			case 196:
			case 197:
			case 200:
			case 201:
			case 204:
			case 205:
			case 216:
			case 218:
			case 219:
			case 227:
			case 229:
			case 248:
			case 262:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 540;
				this.identifierOrKeyword();
				}
				break;
			case 263:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 541;
				this.match(RegelSpraakParser.NUMBER);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public naamPhraseNoIs(): NaamPhraseNoIsContext {
		let localctx: NaamPhraseNoIsContext = new NaamPhraseNoIsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 30, RegelSpraakParser.RULE_naamPhraseNoIs);
		let _la: number;
		try {
			let _alt: number;
			this.state = 592;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 49, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 545;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116 || ((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0)) {
					{
					this.state = 544;
					_la = this._input.LA(1);
					if(!(_la===116 || ((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0))) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 548;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 547;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 550;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 41, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 553;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 552;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 555;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 42, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 557;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 559;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 558;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 561;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 563;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 565;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 564;
					this.identifierOrKeywordNoIs();
					}
					}
					this.state = 567;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16793601) !== 0) || _la===127 || _la===156 || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & 2149160961) !== 0) || ((((_la - 218)) & ~0x1F) === 0 && ((1 << (_la - 218)) & 1073744387) !== 0) || _la===262);
				this.state = 569;
				this.match(RegelSpraakParser.MET);
				this.state = 571;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 570;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 573;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 45, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 576;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 575;
					this.identifierOrKeywordNoIs();
					}
					}
					this.state = 578;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16793601) !== 0) || _la===127 || _la===156 || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & 2149160961) !== 0) || ((((_la - 218)) & ~0x1F) === 0 && ((1 << (_la - 218)) & 1073744387) !== 0) || _la===262);
				this.state = 580;
				this.match(RegelSpraakParser.MET);
				this.state = 582;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 581;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 584;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 47, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 586;
				this.match(RegelSpraakParser.NIET);
				this.state = 588;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 587;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 590;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 48, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public naamwoord(): NaamwoordContext {
		let localctx: NaamwoordContext = new NaamwoordContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, RegelSpraakParser.RULE_naamwoord);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 594;
			this.naamPhrase();
			this.state = 600;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 50, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 595;
					this.voorzetsel();
					this.state = 596;
					this.naamPhrase();
					}
					}
				}
				this.state = 602;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 50, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		let localctx: NaamwoordWithNumbersContext = new NaamwoordWithNumbersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 34, RegelSpraakParser.RULE_naamwoordWithNumbers);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 603;
			this.naamPhraseWithNumbers();
			this.state = 609;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 51, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 604;
					this.voorzetsel();
					this.state = 605;
					this.naamPhraseWithNumbers();
					}
					}
				}
				this.state = 611;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 51, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public naamwoordNoIs(): NaamwoordNoIsContext {
		let localctx: NaamwoordNoIsContext = new NaamwoordNoIsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 36, RegelSpraakParser.RULE_naamwoordNoIs);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 612;
			this.naamPhraseNoIs();
			this.state = 618;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 52, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 613;
					this.voorzetsel();
					this.state = 614;
					this.naamPhraseNoIs();
					}
					}
				}
				this.state = 620;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 52, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public voorzetsel(): VoorzetselContext {
		let localctx: VoorzetselContext = new VoorzetselContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, RegelSpraakParser.RULE_voorzetsel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 621;
			_la = this._input.LA(1);
			if(!(((((_la - 141)) & ~0x1F) === 0 && ((1 << (_la - 141)) & 1073741829) !== 0) || ((((_la - 203)) & ~0x1F) === 0 && ((1 << (_la - 203)) & 44044545) !== 0) || ((((_la - 236)) & ~0x1F) === 0 && ((1 << (_la - 236)) & 137) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public datumLiteral(): DatumLiteralContext {
		let localctx: DatumLiteralContext = new DatumLiteralContext(this, this._ctx, this.state);
		this.enterRule(localctx, 40, RegelSpraakParser.RULE_datumLiteral);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 623;
			this.match(RegelSpraakParser.DATE_TIME_LITERAL);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public unit(): UnitContext {
		let localctx: UnitContext = new UnitContext(this, this._ctx, this.state);
		this.enterRule(localctx, 42, RegelSpraakParser.RULE_unit);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 625;
			this.match(RegelSpraakParser.IDENTIFIER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public timeUnit(): TimeUnitContext {
		let localctx: TimeUnitContext = new TimeUnitContext(this, this._ctx, this.state);
		this.enterRule(localctx, 44, RegelSpraakParser.RULE_timeUnit);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 627;
			_la = this._input.LA(1);
			if(!(((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & 1611509763) !== 0) || ((((_la - 237)) & ~0x1F) === 0 && ((1 << (_la - 237)) & 771) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public objectTypeDefinition(): ObjectTypeDefinitionContext {
		let localctx: ObjectTypeDefinitionContext = new ObjectTypeDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 46, RegelSpraakParser.RULE_objectTypeDefinition);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 629;
			this.match(RegelSpraakParser.OBJECTTYPE);
			this.state = 630;
			this.naamwoordNoIs();
			this.state = 638;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===173) {
				{
				this.state = 631;
				this.match(RegelSpraakParser.MV_START);
				this.state = 633;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 632;
					localctx._IDENTIFIER = this.match(RegelSpraakParser.IDENTIFIER);
					localctx._plural.push(localctx._IDENTIFIER);
					}
					}
					this.state = 635;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===262);
				this.state = 637;
				this.match(RegelSpraakParser.RPAREN);
				}
			}

			this.state = 641;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===160) {
				{
				this.state = 640;
				this.match(RegelSpraakParser.BEZIELD);
				}
			}

			this.state = 646;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 56, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 643;
					this.objectTypeMember();
					}
					}
				}
				this.state = 648;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 56, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public objectTypeMember(): ObjectTypeMemberContext {
		let localctx: ObjectTypeMemberContext = new ObjectTypeMemberContext(this, this._ctx, this.state);
		this.enterRule(localctx, 48, RegelSpraakParser.RULE_objectTypeMember);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 651;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 57, this._ctx) ) {
			case 1:
				{
				this.state = 649;
				this.kenmerkSpecificatie();
				}
				break;
			case 2:
				{
				this.state = 650;
				this.attribuutSpecificatie();
				}
				break;
			}
			this.state = 653;
			this.match(RegelSpraakParser.SEMICOLON);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public kenmerkSpecificatie(): KenmerkSpecificatieContext {
		let localctx: KenmerkSpecificatieContext = new KenmerkSpecificatieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 50, RegelSpraakParser.RULE_kenmerkSpecificatie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 660;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 59, this._ctx) ) {
			case 1:
				{
				this.state = 656;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===112) {
					{
					this.state = 655;
					this.match(RegelSpraakParser.IS);
					}
				}

				this.state = 658;
				this.identifier();
				}
				break;
			case 2:
				{
				this.state = 659;
				this.naamwoordWithNumbers();
				}
				break;
			}
			this.state = 662;
			this.match(RegelSpraakParser.KENMERK);
			this.state = 664;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===158 || _la===159) {
				{
				this.state = 663;
				_la = this._input.LA(1);
				if(!(_la===158 || _la===159)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 667;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 182)) & ~0x1F) === 0 && ((1 << (_la - 182)) & 7) !== 0)) {
				{
				this.state = 666;
				this.tijdlijn();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public attribuutSpecificatie(): AttribuutSpecificatieContext {
		let localctx: AttribuutSpecificatieContext = new AttribuutSpecificatieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 52, RegelSpraakParser.RULE_attribuutSpecificatie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 669;
			this.naamwoordWithNumbers();
			this.state = 673;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 62, this._ctx) ) {
			case 1:
				{
				this.state = 670;
				this.datatype();
				}
				break;
			case 2:
				{
				this.state = 671;
				this.domeinRef();
				}
				break;
			case 3:
				{
				this.state = 672;
				this.objectTypeRef();
				}
				break;
			}
			this.state = 677;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===172) {
				{
				this.state = 675;
				this.match(RegelSpraakParser.MET_EENHEID);
				this.state = 676;
				this.unitIdentifier();
				}
			}

			this.state = 688;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===166) {
				{
				this.state = 679;
				this.match(RegelSpraakParser.GEDIMENSIONEERD_MET);
				this.state = 680;
				this.dimensieRef();
				this.state = 685;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===211) {
					{
					{
					this.state = 681;
					this.match(RegelSpraakParser.EN);
					this.state = 682;
					this.dimensieRef();
					}
					}
					this.state = 687;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 691;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 182)) & ~0x1F) === 0 && ((1 << (_la - 182)) & 7) !== 0)) {
				{
				this.state = 690;
				this.tijdlijn();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public datatype(): DatatypeContext {
		let localctx: DatatypeContext = new DatatypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, RegelSpraakParser.RULE_datatype);
		try {
			this.state = 699;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 176:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 693;
				this.numeriekDatatype();
				}
				break;
			case 181:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 694;
				this.tekstDatatype();
				}
				break;
			case 161:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 695;
				this.booleanDatatype();
				}
				break;
			case 3:
			case 163:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 696;
				this.datumTijdDatatype();
				}
				break;
			case 100:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 697;
				this.lijstDatatype();
				}
				break;
			case 177:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 698;
				this.percentageDatatype();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public lijstDatatype(): LijstDatatypeContext {
		let localctx: LijstDatatypeContext = new LijstDatatypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 56, RegelSpraakParser.RULE_lijstDatatype);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 701;
			this.match(RegelSpraakParser.LIJST);
			this.state = 702;
			this.match(RegelSpraakParser.VAN);
			this.state = 703;
			this.datatype();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public numeriekDatatype(): NumeriekDatatypeContext {
		let localctx: NumeriekDatatypeContext = new NumeriekDatatypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 58, RegelSpraakParser.RULE_numeriekDatatype);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 705;
			this.match(RegelSpraakParser.NUMERIEK);
			this.state = 710;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===269) {
				{
				this.state = 706;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 707;
				this.getalSpecificatie();
				this.state = 708;
				this.match(RegelSpraakParser.RPAREN);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tekstDatatype(): TekstDatatypeContext {
		let localctx: TekstDatatypeContext = new TekstDatatypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 60, RegelSpraakParser.RULE_tekstDatatype);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 712;
			this.match(RegelSpraakParser.TEKST);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public percentageDatatype(): PercentageDatatypeContext {
		let localctx: PercentageDatatypeContext = new PercentageDatatypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 62, RegelSpraakParser.RULE_percentageDatatype);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 714;
			this.match(RegelSpraakParser.PERCENTAGE);
			this.state = 719;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===269) {
				{
				this.state = 715;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 716;
				this.getalSpecificatie();
				this.state = 717;
				this.match(RegelSpraakParser.RPAREN);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public booleanDatatype(): BooleanDatatypeContext {
		let localctx: BooleanDatatypeContext = new BooleanDatatypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 64, RegelSpraakParser.RULE_booleanDatatype);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 721;
			this.match(RegelSpraakParser.BOOLEAN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public datumTijdDatatype(): DatumTijdDatatypeContext {
		let localctx: DatumTijdDatatypeContext = new DatumTijdDatatypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 66, RegelSpraakParser.RULE_datumTijdDatatype);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 723;
			_la = this._input.LA(1);
			if(!(_la===3 || _la===163)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public getalSpecificatie(): GetalSpecificatieContext {
		let localctx: GetalSpecificatieContext = new GetalSpecificatieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 68, RegelSpraakParser.RULE_getalSpecificatie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 726;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 174)) & ~0x1F) === 0 && ((1 << (_la - 174)) & 19) !== 0)) {
				{
				this.state = 725;
				_la = this._input.LA(1);
				if(!(((((_la - 174)) & ~0x1F) === 0 && ((1 << (_la - 174)) & 19) !== 0))) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 734;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 71, this._ctx) ) {
			case 1:
				{
				this.state = 728;
				this.match(RegelSpraakParser.GEHEEL_GETAL);
				}
				break;
			case 2:
				{
				{
				this.state = 729;
				this.match(RegelSpraakParser.GETAL);
				this.state = 730;
				this.match(RegelSpraakParser.MET);
				this.state = 731;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 732;
				this.match(RegelSpraakParser.DECIMALEN);
				}
				}
				break;
			case 3:
				{
				this.state = 733;
				this.match(RegelSpraakParser.GETAL);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public domeinDefinition(): DomeinDefinitionContext {
		let localctx: DomeinDefinitionContext = new DomeinDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 70, RegelSpraakParser.RULE_domeinDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 736;
			this.match(RegelSpraakParser.DOMEIN);
			this.state = 737;
			localctx._name = this.match(RegelSpraakParser.IDENTIFIER);
			this.state = 738;
			this.match(RegelSpraakParser.IS_VAN_HET_TYPE);
			this.state = 739;
			this.domeinType();
			this.state = 742;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===172) {
				{
				this.state = 740;
				this.match(RegelSpraakParser.MET_EENHEID);
				this.state = 741;
				this.eenheidExpressie();
				}
			}

			this.state = 745;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===276) {
				{
				this.state = 744;
				this.match(RegelSpraakParser.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public domeinType(): DomeinTypeContext {
		let localctx: DomeinTypeContext = new DomeinTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 72, RegelSpraakParser.RULE_domeinType);
		try {
			this.state = 752;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 165:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 747;
				this.enumeratieSpecificatie();
				}
				break;
			case 176:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 748;
				this.numeriekDatatype();
				}
				break;
			case 181:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 749;
				this.tekstDatatype();
				}
				break;
			case 161:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 750;
				this.booleanDatatype();
				}
				break;
			case 3:
			case 163:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 751;
				this.datumTijdDatatype();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public enumeratieSpecificatie(): EnumeratieSpecificatieContext {
		let localctx: EnumeratieSpecificatieContext = new EnumeratieSpecificatieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 74, RegelSpraakParser.RULE_enumeratieSpecificatie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 754;
			this.match(RegelSpraakParser.ENUMERATIE);
			this.state = 756;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 755;
				this.match(RegelSpraakParser.ENUM_LITERAL);
				}
				}
				this.state = 758;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===268);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public domeinRef(): DomeinRefContext {
		let localctx: DomeinRefContext = new DomeinRefContext(this, this._ctx, this.state);
		this.enterRule(localctx, 76, RegelSpraakParser.RULE_domeinRef);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 760;
			localctx._name = this.match(RegelSpraakParser.IDENTIFIER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public objectTypeRef(): ObjectTypeRefContext {
		let localctx: ObjectTypeRefContext = new ObjectTypeRefContext(this, this._ctx, this.state);
		this.enterRule(localctx, 78, RegelSpraakParser.RULE_objectTypeRef);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 762;
			this.match(RegelSpraakParser.IDENTIFIER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eenheidsysteemDefinition(): EenheidsysteemDefinitionContext {
		let localctx: EenheidsysteemDefinitionContext = new EenheidsysteemDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 80, RegelSpraakParser.RULE_eenheidsysteemDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 764;
			this.match(RegelSpraakParser.EENHEIDSYSTEEM);
			this.state = 765;
			localctx._name = this.identifier();
			this.state = 769;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===207) {
				{
				{
				this.state = 766;
				this.eenheidEntry();
				}
				}
				this.state = 771;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eenheidEntry(): EenheidEntryContext {
		let localctx: EenheidEntryContext = new EenheidEntryContext(this, this._ctx, this.state);
		this.enterRule(localctx, 82, RegelSpraakParser.RULE_eenheidEntry);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 772;
			this.match(RegelSpraakParser.DE);
			this.state = 773;
			localctx._unitName = this.unitIdentifier();
			this.state = 778;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===173) {
				{
				this.state = 774;
				this.match(RegelSpraakParser.MV_START);
				this.state = 775;
				localctx._pluralName = this.unitIdentifier();
				this.state = 776;
				this.match(RegelSpraakParser.RPAREN);
				}
			}

			this.state = 780;
			localctx._abbrev = this.unitIdentifier();
			this.state = 782;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===132 || ((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & 1611509763) !== 0) || ((((_la - 237)) & ~0x1F) === 0 && ((1 << (_la - 237)) & 67107587) !== 0)) {
				{
				this.state = 781;
				localctx._symbol_ = this.unitIdentifier();
				}
			}

			this.state = 790;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===264) {
				{
				this.state = 784;
				this.match(RegelSpraakParser.EQUALS);
				this.state = 786;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===277) {
					{
					this.state = 785;
					this.match(RegelSpraakParser.SLASH);
					}
				}

				this.state = 788;
				localctx._value = this.match(RegelSpraakParser.NUMBER);
				this.state = 789;
				localctx._targetUnit = this.unitIdentifier();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public unitIdentifier(): UnitIdentifierContext {
		let localctx: UnitIdentifierContext = new UnitIdentifierContext(this, this._ctx, this.state);
		this.enterRule(localctx, 84, RegelSpraakParser.RULE_unitIdentifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 792;
			_la = this._input.LA(1);
			if(!(_la===132 || ((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & 1611509763) !== 0) || ((((_la - 237)) & ~0x1F) === 0 && ((1 << (_la - 237)) & 67107587) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eenheidExpressie(): EenheidExpressieContext {
		let localctx: EenheidExpressieContext = new EenheidExpressieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 86, RegelSpraakParser.RULE_eenheidExpressie);
		let _la: number;
		try {
			this.state = 803;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 82, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 794;
				this.eenheidMacht();
				this.state = 797;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===277) {
					{
					this.state = 795;
					this.match(RegelSpraakParser.SLASH);
					this.state = 796;
					this.eenheidMacht();
					}
				}

				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 799;
				this.match(RegelSpraakParser.NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 800;
				this.match(RegelSpraakParser.PERCENT_SIGN);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 801;
				this.match(RegelSpraakParser.EURO_SYMBOL);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 802;
				this.match(RegelSpraakParser.DOLLAR_SYMBOL);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eenheidMacht(): EenheidMachtContext {
		let localctx: EenheidMachtContext = new EenheidMachtContext(this, this._ctx, this.state);
		this.enterRule(localctx, 88, RegelSpraakParser.RULE_eenheidMacht);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 805;
			this.unitIdentifier();
			this.state = 808;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===283) {
				{
				this.state = 806;
				this.match(RegelSpraakParser.CARET);
				this.state = 807;
				this.match(RegelSpraakParser.NUMBER);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dimensieDefinition(): DimensieDefinitionContext {
		let localctx: DimensieDefinitionContext = new DimensieDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 90, RegelSpraakParser.RULE_dimensieDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 810;
			this.match(RegelSpraakParser.DIMENSIE);
			this.state = 811;
			this.naamwoord();
			this.state = 813;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===273) {
				{
				this.state = 812;
				this.match(RegelSpraakParser.COMMA);
				}
			}

			this.state = 815;
			this.match(RegelSpraakParser.BESTAANDE_UIT);
			this.state = 816;
			localctx._dimensieNaamMeervoud = this.naamwoord();
			this.state = 817;
			this.voorzetselSpecificatie();
			this.state = 819;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 818;
				this.labelWaardeSpecificatie();
				}
				}
				this.state = 821;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===263);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public voorzetselSpecificatie(): VoorzetselSpecificatieContext {
		let localctx: VoorzetselSpecificatieContext = new VoorzetselSpecificatieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 92, RegelSpraakParser.RULE_voorzetselSpecificatie);
		let _la: number;
		try {
			this.state = 830;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 2:
				this.enterOuterAlt(localctx, 1);
				{
				{
				this.state = 823;
				this.match(RegelSpraakParser.NA_HET_ATTRIBUUT_MET_VOORZETSEL);
				this.state = 824;
				localctx._vz = this.voorzetsel();
				this.state = 825;
				this.match(RegelSpraakParser.RPAREN);
				this.state = 827;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===275) {
					{
					this.state = 826;
					this.match(RegelSpraakParser.COLON);
					}
				}

				}
				}
				break;
			case 1:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 829;
				this.match(RegelSpraakParser.VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public labelWaardeSpecificatie(): LabelWaardeSpecificatieContext {
		let localctx: LabelWaardeSpecificatieContext = new LabelWaardeSpecificatieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 94, RegelSpraakParser.RULE_labelWaardeSpecificatie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 832;
			this.match(RegelSpraakParser.NUMBER);
			this.state = 833;
			this.match(RegelSpraakParser.DOT);
			this.state = 834;
			localctx._dimWaarde = this.naamwoord();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tijdlijn(): TijdlijnContext {
		let localctx: TijdlijnContext = new TijdlijnContext(this, this._ctx, this.state);
		this.enterRule(localctx, 96, RegelSpraakParser.RULE_tijdlijn);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 836;
			_la = this._input.LA(1);
			if(!(((((_la - 182)) & ~0x1F) === 0 && ((1 << (_la - 182)) & 7) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dimensieRef(): DimensieRefContext {
		let localctx: DimensieRefContext = new DimensieRefContext(this, this._ctx, this.state);
		this.enterRule(localctx, 98, RegelSpraakParser.RULE_dimensieRef);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 838;
			localctx._name = this.match(RegelSpraakParser.IDENTIFIER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parameterDefinition(): ParameterDefinitionContext {
		let localctx: ParameterDefinitionContext = new ParameterDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 100, RegelSpraakParser.RULE_parameterDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 840;
			this.match(RegelSpraakParser.PARAMETER);
			this.state = 841;
			this.parameterNamePhrase();
			this.state = 842;
			this.match(RegelSpraakParser.COLON);
			this.state = 845;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 3:
			case 100:
			case 161:
			case 163:
			case 176:
			case 177:
			case 181:
				{
				this.state = 843;
				this.datatype();
				}
				break;
			case 262:
				{
				this.state = 844;
				this.domeinRef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 849;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===172) {
				{
				this.state = 847;
				this.match(RegelSpraakParser.MET_EENHEID);
				this.state = 848;
				this.eenheidExpressie();
				}
			}

			this.state = 853;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===112) {
				{
				this.state = 851;
				this.match(RegelSpraakParser.IS);
				this.state = 852;
				this.expressie();
				}
			}

			this.state = 856;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 182)) & ~0x1F) === 0 && ((1 << (_la - 182)) & 7) !== 0)) {
				{
				this.state = 855;
				this.tijdlijn();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parameterNamePhrase(): ParameterNamePhraseContext {
		let localctx: ParameterNamePhraseContext = new ParameterNamePhraseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 102, RegelSpraakParser.RULE_parameterNamePhrase);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 859;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===207 || _la===212) {
				{
				this.state = 858;
				_la = this._input.LA(1);
				if(!(_la===207 || _la===212)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 861;
			this.parameterNamePart();
			this.state = 867;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 141)) & ~0x1F) === 0 && ((1 << (_la - 141)) & 1073741829) !== 0) || ((((_la - 203)) & ~0x1F) === 0 && ((1 << (_la - 203)) & 44044545) !== 0) || ((((_la - 236)) & ~0x1F) === 0 && ((1 << (_la - 236)) & 137) !== 0)) {
				{
				{
				this.state = 862;
				this.voorzetsel();
				this.state = 863;
				this.parameterNamePart();
				}
				}
				this.state = 869;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parameterNamePart(): ParameterNamePartContext {
		let localctx: ParameterNamePartContext = new ParameterNamePartContext(this, this._ctx, this.state);
		this.enterRule(localctx, 104, RegelSpraakParser.RULE_parameterNamePart);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 871;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 870;
					_la = this._input.LA(1);
					if(!(_la===185 || _la===262 || _la===263)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 873;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 94, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public parameterMetLidwoord(): ParameterMetLidwoordContext {
		let localctx: ParameterMetLidwoordContext = new ParameterMetLidwoordContext(this, this._ctx, this.state);
		this.enterRule(localctx, 106, RegelSpraakParser.RULE_parameterMetLidwoord);
		let _la: number;
		try {
			let _alt: number;
			this.state = 888;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 97, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 876;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===207 || _la===212) {
					{
					this.state = 875;
					_la = this._input.LA(1);
					if(!(_la===207 || _la===212)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 878;
				this.parameterNamePart();
				this.state = 884;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 96, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 879;
						this.voorzetsel();
						this.state = 880;
						this.parameterNamePart();
						}
						}
					}
					this.state = 886;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 96, this._ctx);
				}
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 887;
				this.naamwoord();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public feitTypeDefinition(): FeitTypeDefinitionContext {
		let localctx: FeitTypeDefinitionContext = new FeitTypeDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 108, RegelSpraakParser.RULE_feitTypeDefinition);
		try {
			let _alt: number;
			this.state = 905;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 104:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 890;
				this.match(RegelSpraakParser.FEITTYPE);
				this.state = 891;
				localctx._feittypenaam = this.naamwoord();
				this.state = 892;
				this.rolDefinition();
				this.state = 894;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 893;
						this.rolDefinition();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 896;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 98, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				this.state = 898;
				this.cardinalityLine();
				}
				break;
			case 27:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 900;
				this.match(RegelSpraakParser.WEDERKERIG_FEITTYPE);
				this.state = 901;
				localctx._feittypenaam = this.naamwoord();
				this.state = 902;
				this.rolDefinition();
				this.state = 903;
				this.cardinalityLine();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public rolDefinition(): RolDefinitionContext {
		let localctx: RolDefinitionContext = new RolDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 110, RegelSpraakParser.RULE_rolDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 907;
			localctx._article = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(_la===207 || _la===212)) {
			    localctx._article = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 908;
			localctx._content = this.rolContentWords();
			this.state = 913;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 100, this._ctx) ) {
			case 1:
				{
				this.state = 909;
				this.match(RegelSpraakParser.MV_START);
				this.state = 910;
				localctx._meervoud = this.naamwoord();
				this.state = 911;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			}
			this.state = 916;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 101, this._ctx) ) {
			case 1:
				{
				this.state = 915;
				localctx._objecttype = this.rolObjectType();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public rolObjectType(): RolObjectTypeContext {
		let localctx: RolObjectTypeContext = new RolObjectTypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 112, RegelSpraakParser.RULE_rolObjectType);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 919;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 918;
					this.identifierOrKeyword();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 921;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 102, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public rolContentWords(): RolContentWordsContext {
		let localctx: RolContentWordsContext = new RolContentWordsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 114, RegelSpraakParser.RULE_rolContentWords);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 925;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 925;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 95:
					case 109:
					case 112:
					case 119:
					case 127:
					case 156:
					case 185:
					case 196:
					case 197:
					case 200:
					case 201:
					case 204:
					case 205:
					case 216:
					case 218:
					case 219:
					case 227:
					case 229:
					case 248:
					case 262:
						{
						this.state = 923;
						this.identifierOrKeyword();
						}
						break;
					case 141:
					case 143:
					case 171:
					case 203:
					case 211:
					case 215:
					case 224:
					case 226:
					case 228:
					case 236:
					case 239:
					case 243:
						{
						this.state = 924;
						this.voorzetsel();
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 927;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 104, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public cardinalityLine(): CardinalityLineContext {
		let localctx: CardinalityLineContext = new CardinalityLineContext(this, this._ctx, this.state);
		this.enterRule(localctx, 116, RegelSpraakParser.RULE_cardinalityLine);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 930;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 929;
					this.cardinalityWord();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 932;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 105, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public cardinalityWord(): CardinalityWordContext {
		let localctx: CardinalityWordContext = new CardinalityWordContext(this, this._ctx, this.state);
		this.enterRule(localctx, 118, RegelSpraakParser.RULE_cardinalityWord);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 934;
			_la = this._input.LA(1);
			if(_la<=0 || _la===27 || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 4027) !== 0) || _la===276) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public regel(): RegelContext {
		let localctx: RegelContext = new RegelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 120, RegelSpraakParser.RULE_regel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 936;
			this.match(RegelSpraakParser.REGEL);
			this.state = 937;
			this.regelName();
			this.state = 939;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===263) {
				{
				this.state = 938;
				this.match(RegelSpraakParser.NUMBER);
				}
			}

			this.state = 941;
			this.regelVersie();
			this.state = 942;
			this.resultaatDeel();
			this.state = 948;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 110:
				{
				this.state = 943;
				this.voorwaardeDeel();
				this.state = 945;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===274) {
					{
					this.state = 944;
					this.match(RegelSpraakParser.DOT);
					}
				}

				}
				break;
			case 274:
				{
				this.state = 947;
				this.match(RegelSpraakParser.DOT);
				}
				break;
			case -1:
			case 27:
			case 94:
			case 95:
			case 96:
			case 97:
			case 98:
			case 99:
			case 101:
			case 102:
			case 103:
			case 104:
			case 105:
			case 106:
				break;
			default:
				break;
			}
			this.state = 951;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===106) {
				{
				this.state = 950;
				this.variabeleDeel();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public regelGroep(): RegelGroepContext {
		let localctx: RegelGroepContext = new RegelGroepContext(this, this._ctx, this.state);
		this.enterRule(localctx, 122, RegelSpraakParser.RULE_regelGroep);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 953;
			this.match(RegelSpraakParser.REGELGROEP);
			this.state = 954;
			this.naamwoord();
			this.state = 956;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===111) {
				{
				this.state = 955;
				localctx._isRecursive = this.match(RegelSpraakParser.IS_RECURSIEF);
				}
			}

			this.state = 960;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 960;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 95:
						{
						this.state = 958;
						this.regel();
						}
						break;
					case 94:
						{
						this.state = 959;
						this.consistentieregel();
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 962;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 112, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public regelName(): RegelNameContext {
		let localctx: RegelNameContext = new RegelNameContext(this, this._ctx, this.state);
		this.enterRule(localctx, 124, RegelSpraakParser.RULE_regelName);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 964;
			this.naamwoordWithNumbers();
			this.state = 968;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===112 || ((((_la - 193)) & ~0x1F) === 0 && ((1 << (_la - 193)) & 262209) !== 0) || _la===273) {
				{
				{
				this.state = 965;
				this.regelNameExtension();
				}
				}
				this.state = 970;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public regelNameExtension(): RegelNameExtensionContext {
		let localctx: RegelNameExtensionContext = new RegelNameExtensionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 126, RegelSpraakParser.RULE_regelNameExtension);
		try {
			this.state = 985;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 114, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 971;
				this.match(RegelSpraakParser.IN_GELIJKE_DELEN);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 972;
				this.match(RegelSpraakParser.COMMA);
				this.state = 973;
				this.naamwoordWithNumbers();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 974;
				this.match(RegelSpraakParser.COMMA);
				this.state = 975;
				this.match(RegelSpraakParser.MET);
				this.state = 976;
				this.naamwoordWithNumbers();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 977;
				this.match(RegelSpraakParser.EN);
				this.state = 978;
				this.naamwoordWithNumbers();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 979;
				this.match(RegelSpraakParser.IS);
				this.state = 980;
				this.naamwoordWithNumbers();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 981;
				this.match(RegelSpraakParser.GEEN);
				this.state = 982;
				this.naamwoordWithNumbers();
				this.state = 983;
				this.match(RegelSpraakParser.IS);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public regelVersie(): RegelVersieContext {
		let localctx: RegelVersieContext = new RegelVersieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 128, RegelSpraakParser.RULE_regelVersie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 987;
			this.match(RegelSpraakParser.GELDIG);
			this.state = 988;
			this.versieGeldigheid();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public versieGeldigheid(): VersieGeldigheidContext {
		let localctx: VersieGeldigheidContext = new VersieGeldigheidContext(this, this._ctx, this.state);
		this.enterRule(localctx, 130, RegelSpraakParser.RULE_versieGeldigheid);
		let _la: number;
		try {
			this.state = 997;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 202:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 990;
				this.match(RegelSpraakParser.ALTIJD);
				}
				break;
			case 145:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 991;
				this.match(RegelSpraakParser.VANAF);
				this.state = 992;
				this.datumLiteral();
				this.state = 995;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===143 || _la===235) {
					{
					this.state = 993;
					_la = this._input.LA(1);
					if(!(_la===143 || _la===235)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					this.state = 994;
					this.datumLiteral();
					}
				}

				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public resultaatDeel(): ResultaatDeelContext {
		let localctx: ResultaatDeelContext = new ResultaatDeelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 132, RegelSpraakParser.RULE_resultaatDeel);
		let _la: number;
		try {
			this.state = 1039;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 120, this._ctx) ) {
			case 1:
				localctx = new DagsoortdefinitieResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 999;
				this.match(RegelSpraakParser.EEN);
				this.state = 1000;
				this.match(RegelSpraakParser.DAG);
				this.state = 1001;
				this.match(RegelSpraakParser.IS);
				this.state = 1002;
				this.match(RegelSpraakParser.EEN);
				this.state = 1003;
				this.naamwoord();
				}
				break;
			case 2:
				localctx = new GelijkstellingResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1004;
				this.attribuutReferentie();
				this.state = 1011;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 7:
					{
					this.state = 1005;
					this.match(RegelSpraakParser.WORDT_BEREKEND_ALS);
					this.state = 1006;
					this.expressie();
					}
					break;
				case 8:
					{
					this.state = 1007;
					this.match(RegelSpraakParser.WORDT_GESTELD_OP);
					this.state = 1008;
					this.expressie();
					}
					break;
				case 9:
					{
					this.state = 1009;
					this.match(RegelSpraakParser.WORDT_GEINITIALISEERD_OP);
					this.state = 1010;
					this.expressie();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1014;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 141)) & ~0x1F) === 0 && ((1 << (_la - 141)) & 21) !== 0) || _la===239) {
					{
					this.state = 1013;
					this.periodeDefinitie();
					}
				}

				}
				break;
			case 3:
				localctx = new ConsistencyCheckResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1016;
				this.attribuutReferentie();
				this.state = 1017;
				this.match(RegelSpraakParser.MOET);
				this.state = 1018;
				this.consistencyOperator();
				this.state = 1019;
				this.expressie();
				}
				break;
			case 4:
				localctx = new FeitCreatieResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1021;
				this.feitCreatiePattern();
				}
				break;
			case 5:
				localctx = new KenmerkFeitResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1022;
				this.onderwerpReferentie();
				this.state = 1023;
				_la = this._input.LA(1);
				if(!(_la===109 || _la===112)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1024;
				this.kenmerkNaam();
				this.state = 1026;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 141)) & ~0x1F) === 0 && ((1 << (_la - 141)) & 21) !== 0) || _la===239) {
					{
					this.state = 1025;
					this.periodeDefinitie();
					}
				}

				}
				break;
			case 6:
				localctx = new RelationshipWithAttributeResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1028;
				this.onderwerpReferentie();
				this.state = 1029;
				this.match(RegelSpraakParser.HEEFT);
				this.state = 1030;
				_la = this._input.LA(1);
				if(!(_la===207 || _la===212)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1031;
				this.naamwoord();
				this.state = 1032;
				this.match(RegelSpraakParser.MET);
				this.state = 1033;
				this.attribuutMetLidwoord();
				this.state = 1034;
				_la = this._input.LA(1);
				if(!(_la===46 || _la===47 || _la===123)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1035;
				this.expressie();
				}
				break;
			case 7:
				localctx = new ObjectCreatieResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 1037;
				this.objectCreatie();
				}
				break;
			case 8:
				localctx = new VerdelingContext(this, localctx);
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 1038;
				this.verdelingResultaat();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public consistencyOperator(): ConsistencyOperatorContext {
		let localctx: ConsistencyOperatorContext = new ConsistencyOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 134, RegelSpraakParser.RULE_consistencyOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1041;
			_la = this._input.LA(1);
			if(!(((((_la - 47)) & ~0x1F) === 0 && ((1 << (_la - 47)) & 23) !== 0) || ((((_la - 123)) & ~0x1F) === 0 && ((1 << (_la - 123)) & 24617) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public feitCreatiePattern(): FeitCreatiePatternContext {
		let localctx: FeitCreatiePatternContext = new FeitCreatiePatternContext(this, this._ctx, this.state);
		this.enterRule(localctx, 136, RegelSpraakParser.RULE_feitCreatiePattern);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1043;
			this.match(RegelSpraakParser.EEN);
			this.state = 1044;
			localctx._role1 = this.feitCreatieRolPhrase();
			this.state = 1045;
			this.match(RegelSpraakParser.VAN);
			this.state = 1046;
			this.match(RegelSpraakParser.EEN);
			this.state = 1047;
			localctx._subject1 = this.feitCreatieSubjectPhrase();
			this.state = 1048;
			this.match(RegelSpraakParser.IS);
			this.state = 1049;
			localctx._article2 = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0))) {
			    localctx._article2 = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1050;
			localctx._role2 = this.feitCreatieRolPhrase();
			this.state = 1051;
			this.match(RegelSpraakParser.VAN);
			this.state = 1052;
			localctx._article3 = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0))) {
			    localctx._article3 = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1053;
			localctx._subject2 = this.feitCreatieSubjectPhrase();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public feitCreatieRolPhrase(): FeitCreatieRolPhraseContext {
		let localctx: FeitCreatieRolPhraseContext = new FeitCreatieRolPhraseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 138, RegelSpraakParser.RULE_feitCreatieRolPhrase);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1056;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1055;
				this.feitCreatieWord();
				}
				}
				this.state = 1058;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || ((((_la - 127)) & ~0x1F) === 0 && ((1 << (_la - 127)) & 536887297) !== 0) || ((((_la - 171)) & ~0x1F) === 0 && ((1 << (_la - 171)) & 1711292417) !== 0) || ((((_la - 203)) & ~0x1F) === 0 && ((1 << (_la - 203)) & 125939975) !== 0) || ((((_la - 236)) & ~0x1F) === 0 && ((1 << (_la - 236)) & 67113089) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public feitCreatieSubjectPhrase(): FeitCreatieSubjectPhraseContext {
		let localctx: FeitCreatieSubjectPhraseContext = new FeitCreatieSubjectPhraseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 140, RegelSpraakParser.RULE_feitCreatieSubjectPhrase);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1061;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1060;
					this.feitCreatieSubjectWord();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1063;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 122, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public feitCreatieSubjectWord(): FeitCreatieSubjectWordContext {
		let localctx: FeitCreatieSubjectWordContext = new FeitCreatieSubjectWordContext(this, this._ctx, this.state);
		this.enterRule(localctx, 142, RegelSpraakParser.RULE_feitCreatieSubjectWord);
		try {
			this.state = 1070;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 95:
			case 109:
			case 112:
			case 119:
			case 127:
			case 156:
			case 185:
			case 196:
			case 197:
			case 200:
			case 201:
			case 204:
			case 205:
			case 216:
			case 218:
			case 219:
			case 227:
			case 229:
			case 248:
			case 262:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1065;
				this.identifierOrKeyword();
				}
				break;
			case 141:
			case 143:
			case 171:
			case 203:
			case 211:
			case 215:
			case 224:
			case 226:
			case 228:
			case 236:
			case 239:
			case 243:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1066;
				this.voorzetsel();
				}
				break;
			case 207:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1067;
				this.match(RegelSpraakParser.DE);
				}
				break;
			case 212:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1068;
				this.match(RegelSpraakParser.HET);
				}
				break;
			case 210:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1069;
				this.match(RegelSpraakParser.EEN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public feitCreatieWord(): FeitCreatieWordContext {
		let localctx: FeitCreatieWordContext = new FeitCreatieWordContext(this, this._ctx, this.state);
		this.enterRule(localctx, 144, RegelSpraakParser.RULE_feitCreatieWord);
		try {
			this.state = 1074;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 95:
			case 109:
			case 112:
			case 119:
			case 127:
			case 156:
			case 185:
			case 196:
			case 197:
			case 200:
			case 201:
			case 204:
			case 205:
			case 216:
			case 218:
			case 219:
			case 227:
			case 229:
			case 248:
			case 262:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1072;
				this.identifierOrKeyword();
				}
				break;
			case 141:
			case 171:
			case 203:
			case 211:
			case 215:
			case 226:
			case 228:
			case 236:
			case 243:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1073;
				this.voorzetselNietVan();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public voorzetselNietVan(): VoorzetselNietVanContext {
		let localctx: VoorzetselNietVanContext = new VoorzetselNietVanContext(this, this._ctx, this.state);
		this.enterRule(localctx, 146, RegelSpraakParser.RULE_voorzetselNietVan);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1076;
			_la = this._input.LA(1);
			if(!(_la===141 || _la===171 || ((((_la - 203)) & ~0x1F) === 0 && ((1 << (_la - 203)) & 41947393) !== 0) || _la===236 || _la===243)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public objectCreatie(): ObjectCreatieContext {
		let localctx: ObjectCreatieContext = new ObjectCreatieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 148, RegelSpraakParser.RULE_objectCreatie);
		let _la: number;
		try {
			this.state = 1097;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 40:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1078;
				this.match(RegelSpraakParser.ER_WORDT_EEN_NIEUW);
				this.state = 1079;
				localctx._objectType = this.naamwoord();
				this.state = 1080;
				this.match(RegelSpraakParser.AANGEMAAKT);
				this.state = 1082;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===171) {
					{
					this.state = 1081;
					this.objectAttributeInit();
					}
				}

				this.state = 1085;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 126, this._ctx) ) {
				case 1:
					{
					this.state = 1084;
					this.match(RegelSpraakParser.DOT);
					}
					break;
				}
				}
				break;
			case 43:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1087;
				this.match(RegelSpraakParser.CREEER);
				this.state = 1088;
				this.match(RegelSpraakParser.EEN);
				this.state = 1089;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 1090;
				localctx._objectType = this.naamwoord();
				this.state = 1092;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===171) {
					{
					this.state = 1091;
					this.objectAttributeInit();
					}
				}

				this.state = 1095;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 128, this._ctx) ) {
				case 1:
					{
					this.state = 1094;
					this.match(RegelSpraakParser.DOT);
					}
					break;
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public objectAttributeInit(): ObjectAttributeInitContext {
		let localctx: ObjectAttributeInitContext = new ObjectAttributeInitContext(this, this._ctx, this.state);
		this.enterRule(localctx, 150, RegelSpraakParser.RULE_objectAttributeInit);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1099;
			this.match(RegelSpraakParser.MET);
			this.state = 1100;
			localctx._attribuut = this.simpleNaamwoord();
			this.state = 1101;
			this.match(RegelSpraakParser.GELIJK_AAN);
			this.state = 1102;
			localctx._waarde = this.expressie();
			this.state = 1106;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===211) {
				{
				{
				this.state = 1103;
				this.attributeInitVervolg();
				}
				}
				this.state = 1108;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public attributeInitVervolg(): AttributeInitVervolgContext {
		let localctx: AttributeInitVervolgContext = new AttributeInitVervolgContext(this, this._ctx, this.state);
		this.enterRule(localctx, 152, RegelSpraakParser.RULE_attributeInitVervolg);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1109;
			this.match(RegelSpraakParser.EN);
			this.state = 1110;
			localctx._attribuut = this.simpleNaamwoord();
			this.state = 1111;
			this.match(RegelSpraakParser.GELIJK_AAN);
			this.state = 1112;
			localctx._waarde = this.expressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public simpleNaamwoord(): SimpleNaamwoordContext {
		let localctx: SimpleNaamwoordContext = new SimpleNaamwoordContext(this, this._ctx, this.state);
		this.enterRule(localctx, 154, RegelSpraakParser.RULE_simpleNaamwoord);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1114;
			this.naamPhrase();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public consistentieregel(): ConsistentieregelContext {
		let localctx: ConsistentieregelContext = new ConsistentieregelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 156, RegelSpraakParser.RULE_consistentieregel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1116;
			this.match(RegelSpraakParser.CONSISTENTIEREGEL);
			this.state = 1117;
			this.naamwoord();
			this.state = 1127;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 133, this._ctx) ) {
			case 1:
				{
				this.state = 1118;
				this.uniekzijnResultaat();
				}
				break;
			case 2:
				{
				this.state = 1119;
				this.inconsistentResultaat();
				this.state = 1125;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 110:
					{
					this.state = 1120;
					this.voorwaardeDeel();
					this.state = 1122;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===274) {
						{
						this.state = 1121;
						this.match(RegelSpraakParser.DOT);
						}
					}

					}
					break;
				case 274:
					{
					this.state = 1124;
					this.match(RegelSpraakParser.DOT);
					}
					break;
				case -1:
				case 27:
				case 94:
				case 95:
				case 96:
				case 97:
				case 98:
				case 99:
				case 101:
				case 102:
				case 103:
				case 104:
				case 105:
					break;
				default:
					break;
				}
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public uniekzijnResultaat(): UniekzijnResultaatContext {
		let localctx: UniekzijnResultaatContext = new UniekzijnResultaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 158, RegelSpraakParser.RULE_uniekzijnResultaat);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1129;
			this.alleAttributenVanObjecttype();
			this.state = 1130;
			this.match(RegelSpraakParser.MOETEN_UNIEK_ZIJN);
			this.state = 1132;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===274) {
				{
				this.state = 1131;
				this.match(RegelSpraakParser.DOT);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public alleAttributenVanObjecttype(): AlleAttributenVanObjecttypeContext {
		let localctx: AlleAttributenVanObjecttypeContext = new AlleAttributenVanObjecttypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 160, RegelSpraakParser.RULE_alleAttributenVanObjecttype);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1134;
			this.match(RegelSpraakParser.DE);
			this.state = 1135;
			this.naamwoord();
			this.state = 1136;
			this.match(RegelSpraakParser.VAN);
			this.state = 1137;
			this.match(RegelSpraakParser.ALLE);
			this.state = 1138;
			this.naamwoord();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public inconsistentResultaat(): InconsistentResultaatContext {
		let localctx: InconsistentResultaatContext = new InconsistentResultaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 162, RegelSpraakParser.RULE_inconsistentResultaat);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1141;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 135, this._ctx) ) {
			case 1:
				{
				this.state = 1140;
				_la = this._input.LA(1);
				if(!(_la===207 || _la===212 || _la===247)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			}
			this.state = 1143;
			this.naamwoord();
			this.state = 1144;
			this.match(RegelSpraakParser.IS_INCONSISTENT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public voorwaardeDeel(): VoorwaardeDeelContext {
		let localctx: VoorwaardeDeelContext = new VoorwaardeDeelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 164, RegelSpraakParser.RULE_voorwaardeDeel);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1146;
			this.match(RegelSpraakParser.INDIEN);
			this.state = 1149;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 136, this._ctx) ) {
			case 1:
				{
				this.state = 1147;
				this.expressie();
				}
				break;
			case 2:
				{
				this.state = 1148;
				this.toplevelSamengesteldeVoorwaarde();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public toplevelSamengesteldeVoorwaarde(): ToplevelSamengesteldeVoorwaardeContext {
		let localctx: ToplevelSamengesteldeVoorwaardeContext = new ToplevelSamengesteldeVoorwaardeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 166, RegelSpraakParser.RULE_toplevelSamengesteldeVoorwaarde);
		let _la: number;
		try {
			this.state = 1193;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 142, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1151;
				this.match(RegelSpraakParser.ER_AAN);
				this.state = 1152;
				this.voorwaardeKwantificatie();
				this.state = 1153;
				_la = this._input.LA(1);
				if(!(_la===240 || _la===241)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1154;
				this.match(RegelSpraakParser.WORDT_VOLDAAN);
				this.state = 1155;
				this.match(RegelSpraakParser.COLON);
				this.state = 1157;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1156;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					this.state = 1159;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 279)) & ~0x1F) === 0 && ((1 << (_la - 279)) & 291) !== 0));
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1165;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 138, this._ctx) ) {
				case 1:
					{
					this.state = 1161;
					this.onderwerpReferentie();
					}
					break;
				case 2:
					{
					this.state = 1162;
					this.match(RegelSpraakParser.HIJ);
					}
					break;
				case 3:
					{
					this.state = 1163;
					this.match(RegelSpraakParser.HET);
					}
					break;
				case 4:
					{
					this.state = 1164;
					this.match(RegelSpraakParser.ER);
					}
					break;
				}
				this.state = 1167;
				this.match(RegelSpraakParser.AAN);
				this.state = 1168;
				this.voorwaardeKwantificatie();
				this.state = 1169;
				_la = this._input.LA(1);
				if(!(_la===240 || _la===241)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1170;
				this.match(RegelSpraakParser.VOLDOET);
				this.state = 1171;
				this.match(RegelSpraakParser.COLON);
				this.state = 1173;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1172;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					this.state = 1175;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 279)) & ~0x1F) === 0 && ((1 << (_la - 279)) & 291) !== 0));
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1181;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 140, this._ctx) ) {
				case 1:
					{
					this.state = 1177;
					this.onderwerpReferentie();
					}
					break;
				case 2:
					{
					this.state = 1178;
					this.match(RegelSpraakParser.HIJ);
					}
					break;
				case 3:
					{
					this.state = 1179;
					this.match(RegelSpraakParser.HET);
					}
					break;
				case 4:
					{
					this.state = 1180;
					this.match(RegelSpraakParser.ER);
					}
					break;
				}
				this.state = 1183;
				this.match(RegelSpraakParser.VOLDOET);
				this.state = 1184;
				this.match(RegelSpraakParser.AAN);
				this.state = 1185;
				this.voorwaardeKwantificatie();
				this.state = 1186;
				_la = this._input.LA(1);
				if(!(_la===240 || _la===241)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1187;
				this.match(RegelSpraakParser.COLON);
				this.state = 1189;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1188;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					this.state = 1191;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 279)) & ~0x1F) === 0 && ((1 << (_la - 279)) & 291) !== 0));
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public voorwaardeKwantificatie(): VoorwaardeKwantificatieContext {
		let localctx: VoorwaardeKwantificatieContext = new VoorwaardeKwantificatieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 168, RegelSpraakParser.RULE_voorwaardeKwantificatie);
		let _la: number;
		try {
			this.state = 1209;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 119:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1195;
				this.match(RegelSpraakParser.ALLE);
				}
				break;
			case 198:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1196;
				this.match(RegelSpraakParser.GEEN_VAN_DE);
				}
				break;
			case 152:
			case 153:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1197;
				_la = this._input.LA(1);
				if(!(_la===152 || _la===153)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1198;
				_la = this._input.LA(1);
				if(!(((((_la - 196)) & ~0x1F) === 0 && ((1 << (_la - 196)) & 16435) !== 0) || _la===263)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1199;
				this.match(RegelSpraakParser.VAN);
				this.state = 1200;
				this.match(RegelSpraakParser.DE);
				}
				break;
			case 154:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1201;
				this.match(RegelSpraakParser.TEN_HOOGSTE);
				this.state = 1202;
				_la = this._input.LA(1);
				if(!(((((_la - 196)) & ~0x1F) === 0 && ((1 << (_la - 196)) & 16435) !== 0) || _la===263)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1203;
				this.match(RegelSpraakParser.VAN);
				this.state = 1204;
				this.match(RegelSpraakParser.DE);
				}
				break;
			case 155:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1205;
				this.match(RegelSpraakParser.PRECIES);
				this.state = 1206;
				_la = this._input.LA(1);
				if(!(((((_la - 196)) & ~0x1F) === 0 && ((1 << (_la - 196)) & 16435) !== 0) || _la===263)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1207;
				this.match(RegelSpraakParser.VAN);
				this.state = 1208;
				this.match(RegelSpraakParser.DE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public samengesteldeVoorwaardeOnderdeel(): SamengesteldeVoorwaardeOnderdeelContext {
		let localctx: SamengesteldeVoorwaardeOnderdeelContext = new SamengesteldeVoorwaardeOnderdeelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 170, RegelSpraakParser.RULE_samengesteldeVoorwaardeOnderdeel);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1211;
			this.bulletPrefix();
			this.state = 1214;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 144, this._ctx) ) {
			case 1:
				{
				this.state = 1212;
				this.elementaireVoorwaarde();
				}
				break;
			case 2:
				{
				this.state = 1213;
				this.genesteSamengesteldeVoorwaarde();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public bulletPrefix(): BulletPrefixContext {
		let localctx: BulletPrefixContext = new BulletPrefixContext(this, this._ctx, this.state);
		this.enterRule(localctx, 172, RegelSpraakParser.RULE_bulletPrefix);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1217;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1216;
					_la = this._input.LA(1);
					if(!(((((_la - 279)) & ~0x1F) === 0 && ((1 << (_la - 279)) & 291) !== 0))) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1219;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 145, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public elementaireVoorwaarde(): ElementaireVoorwaardeContext {
		let localctx: ElementaireVoorwaardeContext = new ElementaireVoorwaardeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 174, RegelSpraakParser.RULE_elementaireVoorwaarde);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1221;
			this.expressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public genesteSamengesteldeVoorwaarde(): GenesteSamengesteldeVoorwaardeContext {
		let localctx: GenesteSamengesteldeVoorwaardeContext = new GenesteSamengesteldeVoorwaardeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 176, RegelSpraakParser.RULE_genesteSamengesteldeVoorwaarde);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1226;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 146, this._ctx) ) {
			case 1:
				{
				this.state = 1223;
				this.onderwerpReferentie();
				}
				break;
			case 2:
				{
				this.state = 1224;
				this.match(RegelSpraakParser.HIJ);
				}
				break;
			case 3:
				{
				this.state = 1225;
				this.match(RegelSpraakParser.ER);
				}
				break;
			}
			this.state = 1228;
			this.match(RegelSpraakParser.VOLDOET);
			this.state = 1229;
			this.match(RegelSpraakParser.AAN);
			this.state = 1230;
			this.voorwaardeKwantificatie();
			this.state = 1231;
			_la = this._input.LA(1);
			if(!(_la===240 || _la===241)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1232;
			this.match(RegelSpraakParser.COLON);
			this.state = 1234;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1233;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1236;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 147, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public onderwerpReferentie(): OnderwerpReferentieContext {
		let localctx: OnderwerpReferentieContext = new OnderwerpReferentieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 178, RegelSpraakParser.RULE_onderwerpReferentie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1238;
			this.onderwerpBasis();
			this.state = 1241;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 148, this._ctx) ) {
			case 1:
				{
				this.state = 1239;
				_la = this._input.LA(1);
				if(!(_la===206 || _la===209)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1240;
				this.predicaat();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public onderwerpReferentieWithNumbers(): OnderwerpReferentieWithNumbersContext {
		let localctx: OnderwerpReferentieWithNumbersContext = new OnderwerpReferentieWithNumbersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 180, RegelSpraakParser.RULE_onderwerpReferentieWithNumbers);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1243;
			this.onderwerpBasisWithNumbers();
			this.state = 1246;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===206 || _la===209) {
				{
				this.state = 1244;
				_la = this._input.LA(1);
				if(!(_la===206 || _la===209)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1245;
				this.predicaat();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public onderwerpBasis(): OnderwerpBasisContext {
		let localctx: OnderwerpBasisContext = new OnderwerpBasisContext(this, this._ctx, this.state);
		this.enterRule(localctx, 182, RegelSpraakParser.RULE_onderwerpBasis);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1248;
			this.basisOnderwerp();
			this.state = 1254;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 150, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1249;
					this.voorzetsel();
					this.state = 1250;
					this.basisOnderwerp();
					}
					}
				}
				this.state = 1256;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 150, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public onderwerpBasisWithNumbers(): OnderwerpBasisWithNumbersContext {
		let localctx: OnderwerpBasisWithNumbersContext = new OnderwerpBasisWithNumbersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 184, RegelSpraakParser.RULE_onderwerpBasisWithNumbers);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1257;
			this.basisOnderwerpWithNumbers();
			this.state = 1263;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 141)) & ~0x1F) === 0 && ((1 << (_la - 141)) & 1073741829) !== 0) || ((((_la - 203)) & ~0x1F) === 0 && ((1 << (_la - 203)) & 44044545) !== 0) || ((((_la - 236)) & ~0x1F) === 0 && ((1 << (_la - 236)) & 137) !== 0)) {
				{
				{
				this.state = 1258;
				this.voorzetsel();
				this.state = 1259;
				this.basisOnderwerpWithNumbers();
				}
				}
				this.state = 1265;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public basisOnderwerp(): BasisOnderwerpContext {
		let localctx: BasisOnderwerpContext = new BasisOnderwerpContext(this, this._ctx, this.state);
		this.enterRule(localctx, 186, RegelSpraakParser.RULE_basisOnderwerp);
		let _la: number;
		try {
			let _alt: number;
			this.state = 1273;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 116:
			case 207:
			case 210:
			case 212:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1266;
				_la = this._input.LA(1);
				if(!(_la===116 || ((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0))) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1268;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 1267;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 1270;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 152, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 214:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1272;
				this.match(RegelSpraakParser.HIJ);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public basisOnderwerpWithNumbers(): BasisOnderwerpWithNumbersContext {
		let localctx: BasisOnderwerpWithNumbersContext = new BasisOnderwerpWithNumbersContext(this, this._ctx, this.state);
		this.enterRule(localctx, 188, RegelSpraakParser.RULE_basisOnderwerpWithNumbers);
		let _la: number;
		try {
			this.state = 1282;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 116:
			case 207:
			case 210:
			case 212:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1275;
				_la = this._input.LA(1);
				if(!(_la===116 || ((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0))) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1277;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1276;
					this.identifierOrKeywordWithNumbers();
					}
					}
					this.state = 1279;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || _la===127 || _la===156 || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & 2149160961) !== 0) || ((((_la - 218)) & ~0x1F) === 0 && ((1 << (_la - 218)) & 1073744387) !== 0) || _la===262 || _la===263);
				}
				break;
			case 214:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1281;
				this.match(RegelSpraakParser.HIJ);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public attribuutReferentie(): AttribuutReferentieContext {
		let localctx: AttribuutReferentieContext = new AttribuutReferentieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 190, RegelSpraakParser.RULE_attribuutReferentie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1284;
			this.attribuutMetLidwoord();
			this.state = 1285;
			this.match(RegelSpraakParser.VAN);
			this.state = 1286;
			this.onderwerpReferentie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public attribuutMetLidwoord(): AttribuutMetLidwoordContext {
		let localctx: AttribuutMetLidwoordContext = new AttribuutMetLidwoordContext(this, this._ctx, this.state);
		this.enterRule(localctx, 192, RegelSpraakParser.RULE_attribuutMetLidwoord);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1288;
			this.naamwoordNoIs();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public kenmerkNaam(): KenmerkNaamContext {
		let localctx: KenmerkNaamContext = new KenmerkNaamContext(this, this._ctx, this.state);
		this.enterRule(localctx, 194, RegelSpraakParser.RULE_kenmerkNaam);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1291;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 141)) & ~0x1F) === 0 && ((1 << (_la - 141)) & 1073741829) !== 0) || ((((_la - 203)) & ~0x1F) === 0 && ((1 << (_la - 203)) & 44044545) !== 0) || ((((_la - 236)) & ~0x1F) === 0 && ((1 << (_la - 236)) & 137) !== 0)) {
				{
				this.state = 1290;
				this.voorzetsel();
				}
			}

			this.state = 1293;
			this.naamwoordWithNumbers();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public kenmerkPhrase(): KenmerkPhraseContext {
		let localctx: KenmerkPhraseContext = new KenmerkPhraseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 196, RegelSpraakParser.RULE_kenmerkPhrase);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1296;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 141)) & ~0x1F) === 0 && ((1 << (_la - 141)) & 1073741829) !== 0) || ((((_la - 203)) & ~0x1F) === 0 && ((1 << (_la - 203)) & 44044545) !== 0) || ((((_la - 236)) & ~0x1F) === 0 && ((1 << (_la - 236)) & 137) !== 0)) {
				{
				this.state = 1295;
				this.voorzetsel();
				}
			}

			this.state = 1299;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0)) {
				{
				this.state = 1298;
				_la = this._input.LA(1);
				if(!(((((_la - 207)) & ~0x1F) === 0 && ((1 << (_la - 207)) & 41) !== 0))) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 1302;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1301;
				this.identifierOrKeywordWithNumbers();
				}
				}
				this.state = 1304;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || _la===127 || _la===156 || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & 2149160961) !== 0) || ((((_la - 218)) & ~0x1F) === 0 && ((1 << (_la - 218)) & 1073744387) !== 0) || _la===262 || _la===263);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public bezieldeReferentie(): BezieldeReferentieContext {
		let localctx: BezieldeReferentieContext = new BezieldeReferentieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 198, RegelSpraakParser.RULE_bezieldeReferentie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1306;
			this.match(RegelSpraakParser.ZIJN);
			this.state = 1307;
			this.naamwoord();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public predicaat(): PredicaatContext {
		let localctx: PredicaatContext = new PredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 200, RegelSpraakParser.RULE_predicaat);
		try {
			this.state = 1311;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 44:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:
			case 58:
			case 63:
			case 64:
			case 65:
			case 66:
			case 95:
			case 109:
			case 112:
			case 116:
			case 119:
			case 127:
			case 135:
			case 141:
			case 143:
			case 156:
			case 171:
			case 185:
			case 196:
			case 197:
			case 200:
			case 201:
			case 203:
			case 204:
			case 205:
			case 207:
			case 210:
			case 211:
			case 212:
			case 215:
			case 216:
			case 218:
			case 219:
			case 224:
			case 226:
			case 227:
			case 228:
			case 229:
			case 236:
			case 239:
			case 243:
			case 248:
			case 262:
			case 263:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1309;
				this.elementairPredicaat();
				}
				break;
			case 117:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1310;
				this.samengesteldPredicaat();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public elementairPredicaat(): ElementairPredicaatContext {
		let localctx: ElementairPredicaatContext = new ElementairPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 202, RegelSpraakParser.RULE_elementairPredicaat);
		try {
			this.state = 1318;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 161, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1313;
				this.attribuutVergelijkingsPredicaat();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1314;
				this.objectPredicaat();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1315;
				this.getalPredicaat();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1316;
				this.tekstPredicaat();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1317;
				this.datumPredicaat();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public objectPredicaat(): ObjectPredicaatContext {
		let localctx: ObjectPredicaatContext = new ObjectPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 204, RegelSpraakParser.RULE_objectPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1320;
			this.eenzijdigeObjectVergelijking();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public eenzijdigeObjectVergelijking(): EenzijdigeObjectVergelijkingContext {
		let localctx: EenzijdigeObjectVergelijkingContext = new EenzijdigeObjectVergelijkingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 206, RegelSpraakParser.RULE_eenzijdigeObjectVergelijking);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1323;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 162, this._ctx) ) {
			case 1:
				{
				this.state = 1322;
				this.match(RegelSpraakParser.EEN);
				}
				break;
			}
			this.state = 1327;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 163, this._ctx) ) {
			case 1:
				{
				this.state = 1325;
				this.kenmerkNaam();
				}
				break;
			case 2:
				{
				this.state = 1326;
				this.rolNaam();
				}
				break;
			}
			this.state = 1329;
			_la = this._input.LA(1);
			if(!(_la===108 || _la===116)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public rolNaam(): RolNaamContext {
		let localctx: RolNaamContext = new RolNaamContext(this, this._ctx, this.state);
		this.enterRule(localctx, 208, RegelSpraakParser.RULE_rolNaam);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1331;
			this.naamwoord();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public attribuutVergelijkingsPredicaat(): AttribuutVergelijkingsPredicaatContext {
		let localctx: AttribuutVergelijkingsPredicaatContext = new AttribuutVergelijkingsPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 210, RegelSpraakParser.RULE_attribuutVergelijkingsPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1334;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 164, this._ctx) ) {
			case 1:
				{
				this.state = 1333;
				this.match(RegelSpraakParser.EEN);
				}
				break;
			}
			this.state = 1336;
			localctx._attribuutNaam = this.naamwoord();
			this.state = 1337;
			this.match(RegelSpraakParser.HEBBEN);
			this.state = 1338;
			this.comparisonOperator();
			this.state = 1339;
			this.expressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public getalPredicaat(): GetalPredicaatContext {
		let localctx: GetalPredicaatContext = new GetalPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 212, RegelSpraakParser.RULE_getalPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1341;
			this.getalVergelijkingsOperatorMeervoud();
			this.state = 1342;
			this.getalExpressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tekstPredicaat(): TekstPredicaatContext {
		let localctx: TekstPredicaatContext = new TekstPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 214, RegelSpraakParser.RULE_tekstPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1344;
			this.tekstVergelijkingsOperatorMeervoud();
			this.state = 1345;
			this.tekstExpressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public datumPredicaat(): DatumPredicaatContext {
		let localctx: DatumPredicaatContext = new DatumPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 216, RegelSpraakParser.RULE_datumPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1347;
			this.datumVergelijkingsOperatorMeervoud();
			this.state = 1348;
			this.datumExpressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public samengesteldPredicaat(): SamengesteldPredicaatContext {
		let localctx: SamengesteldPredicaatContext = new SamengesteldPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 218, RegelSpraakParser.RULE_samengesteldPredicaat);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1350;
			this.match(RegelSpraakParser.AAN);
			this.state = 1351;
			this.voorwaardeKwantificatie();
			this.state = 1352;
			this.match(RegelSpraakParser.VOLGENDE);
			this.state = 1353;
			_la = this._input.LA(1);
			if(!(_la===156 || _la===157)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1354;
			_la = this._input.LA(1);
			if(!(_la===148 || _la===149)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1355;
			this.match(RegelSpraakParser.COLON);
			this.state = 1357;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1356;
					this.samengesteldeVoorwaardeOnderdeelInPredicaat();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1359;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 165, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public samengesteldeVoorwaardeOnderdeelInPredicaat(): SamengesteldeVoorwaardeOnderdeelInPredicaatContext {
		let localctx: SamengesteldeVoorwaardeOnderdeelInPredicaatContext = new SamengesteldeVoorwaardeOnderdeelInPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 220, RegelSpraakParser.RULE_samengesteldeVoorwaardeOnderdeelInPredicaat);
		try {
			this.state = 1367;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 166, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1361;
				this.bulletPrefix();
				this.state = 1362;
				this.elementaireVoorwaardeInPredicaat();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1364;
				this.bulletPrefix();
				this.state = 1365;
				this.genesteSamengesteldeVoorwaardeInPredicaat();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public elementaireVoorwaardeInPredicaat(): ElementaireVoorwaardeInPredicaatContext {
		let localctx: ElementaireVoorwaardeInPredicaatContext = new ElementaireVoorwaardeInPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 222, RegelSpraakParser.RULE_elementaireVoorwaardeInPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1369;
			this.vergelijkingInPredicaat();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public vergelijkingInPredicaat(): VergelijkingInPredicaatContext {
		let localctx: VergelijkingInPredicaatContext = new VergelijkingInPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 224, RegelSpraakParser.RULE_vergelijkingInPredicaat);
		let _la: number;
		try {
			this.state = 1382;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 167, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1371;
				this.attribuutReferentie();
				this.state = 1372;
				this.comparisonOperator();
				this.state = 1373;
				this.expressie();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1375;
				this.onderwerpReferentie();
				this.state = 1376;
				this.eenzijdigeObjectVergelijking();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1378;
				this.attribuutReferentie();
				this.state = 1379;
				_la = this._input.LA(1);
				if(!(_la===112 || _la===116)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1380;
				this.kenmerkNaam();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public genesteSamengesteldeVoorwaardeInPredicaat(): GenesteSamengesteldeVoorwaardeInPredicaatContext {
		let localctx: GenesteSamengesteldeVoorwaardeInPredicaatContext = new GenesteSamengesteldeVoorwaardeInPredicaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 226, RegelSpraakParser.RULE_genesteSamengesteldeVoorwaardeInPredicaat);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1388;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 149:
				{
				this.state = 1384;
				this.match(RegelSpraakParser.VOLDOET);
				}
				break;
			case 148:
				{
				this.state = 1385;
				this.match(RegelSpraakParser.VOLDOEN);
				}
				break;
			case 290:
				{
				this.state = 1386;
				this.match(RegelSpraakParser.WORDT);
				this.state = 1387;
				this.match(RegelSpraakParser.VOLDAAN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1390;
			this.match(RegelSpraakParser.AAN);
			this.state = 1391;
			this.voorwaardeKwantificatie();
			this.state = 1392;
			this.match(RegelSpraakParser.VOLGENDE);
			this.state = 1393;
			_la = this._input.LA(1);
			if(!(_la===156 || _la===157)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1394;
			this.match(RegelSpraakParser.COLON);
			this.state = 1396;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1395;
					this.samengesteldeVoorwaardeOnderdeelInPredicaat();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1398;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 169, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public getalVergelijkingsOperatorMeervoud(): GetalVergelijkingsOperatorMeervoudContext {
		let localctx: GetalVergelijkingsOperatorMeervoudContext = new GetalVergelijkingsOperatorMeervoudContext(this, this._ctx, this.state);
		this.enterRule(localctx, 228, RegelSpraakParser.RULE_getalVergelijkingsOperatorMeervoud);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1400;
			_la = this._input.LA(1);
			if(!(((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & 63) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tekstVergelijkingsOperatorMeervoud(): TekstVergelijkingsOperatorMeervoudContext {
		let localctx: TekstVergelijkingsOperatorMeervoudContext = new TekstVergelijkingsOperatorMeervoudContext(this, this._ctx, this.state);
		this.enterRule(localctx, 230, RegelSpraakParser.RULE_tekstVergelijkingsOperatorMeervoud);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1402;
			_la = this._input.LA(1);
			if(!(_la===53 || _la===54)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public datumVergelijkingsOperatorMeervoud(): DatumVergelijkingsOperatorMeervoudContext {
		let localctx: DatumVergelijkingsOperatorMeervoudContext = new DatumVergelijkingsOperatorMeervoudContext(this, this._ctx, this.state);
		this.enterRule(localctx, 232, RegelSpraakParser.RULE_datumVergelijkingsOperatorMeervoud);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1404;
			_la = this._input.LA(1);
			if(!(((((_la - 53)) & ~0x1F) === 0 && ((1 << (_la - 53)) & 15363) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public getalExpressie(): GetalExpressieContext {
		let localctx: GetalExpressieContext = new GetalExpressieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 234, RegelSpraakParser.RULE_getalExpressie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1406;
			this.expressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public tekstExpressie(): TekstExpressieContext {
		let localctx: TekstExpressieContext = new TekstExpressieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 236, RegelSpraakParser.RULE_tekstExpressie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1408;
			this.expressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public datumExpressie(): DatumExpressieContext {
		let localctx: DatumExpressieContext = new DatumExpressieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 238, RegelSpraakParser.RULE_datumExpressie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1410;
			this.expressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variabeleDeel(): VariabeleDeelContext {
		let localctx: VariabeleDeelContext = new VariabeleDeelContext(this, this._ctx, this.state);
		this.enterRule(localctx, 240, RegelSpraakParser.RULE_variabeleDeel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1412;
			this.match(RegelSpraakParser.DAARBIJ_GELDT);
			this.state = 1416;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===262) {
				{
				{
				this.state = 1413;
				this.variabeleToekenning();
				}
				}
				this.state = 1418;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1419;
			this.match(RegelSpraakParser.DOT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variabeleToekenning(): VariabeleToekenningContext {
		let localctx: VariabeleToekenningContext = new VariabeleToekenningContext(this, this._ctx, this.state);
		this.enterRule(localctx, 242, RegelSpraakParser.RULE_variabeleToekenning);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1421;
			localctx._varName = this.match(RegelSpraakParser.IDENTIFIER);
			this.state = 1422;
			this.match(RegelSpraakParser.IS);
			this.state = 1423;
			localctx._varExpr = this.variabeleExpressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public variabeleExpressie(): VariabeleExpressieContext {
		let localctx: VariabeleExpressieContext = new VariabeleExpressieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 244, RegelSpraakParser.RULE_variabeleExpressie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1425;
			this.primaryExpression(0);
			this.state = 1434;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 121)) & ~0x1F) === 0 && ((1 << (_la - 121)) & 67243011) !== 0)) {
				{
				{
				this.state = 1428;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 132:
				case 138:
				case 147:
					{
					this.state = 1426;
					this.additiveOperator();
					}
					break;
				case 121:
				case 122:
				case 131:
					{
					this.state = 1427;
					this.multiplicativeOperator();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1430;
				this.primaryExpression(0);
				}
				}
				this.state = 1436;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public expressie(): ExpressieContext {
		let localctx: ExpressieContext = new ExpressieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 246, RegelSpraakParser.RULE_expressie);
		try {
			this.state = 1450;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 173, this._ctx) ) {
			case 1:
				localctx = new ExprBegrenzingAfrondingContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1437;
				this.logicalExpression();
				this.state = 1438;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1439;
				this.begrenzing();
				this.state = 1440;
				this.afronding();
				}
				break;
			case 2:
				localctx = new ExprBegrenzingContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1442;
				this.logicalExpression();
				this.state = 1443;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1444;
				this.begrenzing();
				}
				break;
			case 3:
				localctx = new ExprAfrondingContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1446;
				this.logicalExpression();
				this.state = 1447;
				this.afronding();
				}
				break;
			case 4:
				localctx = new SimpleExprContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1449;
				this.logicalExpression();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public logicalExpression(): LogicalExpressionContext {
		let localctx: LogicalExpressionContext = new LogicalExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 248, RegelSpraakParser.RULE_logicalExpression);
		let _la: number;
		try {
			localctx = new LogicalExprContext(this, localctx);
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1452;
			(localctx as LogicalExprContext)._left = this.comparisonExpression();
			this.state = 1455;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 174, this._ctx) ) {
			case 1:
				{
				this.state = 1453;
				(localctx as LogicalExprContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===211 || _la===224)) {
				    (localctx as LogicalExprContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1454;
				(localctx as LogicalExprContext)._right = this.logicalExpression();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public comparisonExpression(): ComparisonExpressionContext {
		let localctx: ComparisonExpressionContext = new ComparisonExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 250, RegelSpraakParser.RULE_comparisonExpression);
		try {
			this.state = 1474;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 176, this._ctx) ) {
			case 1:
				localctx = new SubordinateClauseExprContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1457;
				this.subordinateClauseExpression();
				}
				break;
			case 2:
				localctx = new IsKenmerkExprContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1458;
				(localctx as IsKenmerkExprContext)._left = this.additiveExpression();
				this.state = 1459;
				this.match(RegelSpraakParser.IS);
				this.state = 1460;
				this.naamwoordWithNumbers();
				}
				break;
			case 3:
				localctx = new HeeftKenmerkExprContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1462;
				(localctx as HeeftKenmerkExprContext)._left = this.additiveExpression();
				this.state = 1463;
				this.match(RegelSpraakParser.HEEFT);
				this.state = 1464;
				this.naamwoordWithNumbers();
				}
				break;
			case 4:
				localctx = new BinaryComparisonExprContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1466;
				(localctx as BinaryComparisonExprContext)._left = this.additiveExpression();
				this.state = 1470;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 175, this._ctx) ) {
				case 1:
					{
					this.state = 1467;
					this.comparisonOperator();
					this.state = 1468;
					(localctx as BinaryComparisonExprContext)._right = this.additiveExpression();
					}
					break;
				}
				}
				break;
			case 5:
				localctx = new UnaryConditionExprContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1472;
				this.unaryCondition();
				}
				break;
			case 6:
				localctx = new RegelStatusConditionExprContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1473;
				this.regelStatusCondition();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public comparisonOperator(): ComparisonOperatorContext {
		let localctx: ComparisonOperatorContext = new ComparisonOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 252, RegelSpraakParser.RULE_comparisonOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1476;
			_la = this._input.LA(1);
			if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 31457280) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 1073741315) !== 0) || ((((_la - 112)) & ~0x1F) === 0 && ((1 << (_la - 112)) & 42158337) !== 0) || _la===215)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public additiveExpression(): AdditiveExpressionContext {
		let localctx: AdditiveExpressionContext = new AdditiveExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 254, RegelSpraakParser.RULE_additiveExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1478;
			localctx._left = this.multiplicativeExpression();
			this.state = 1484;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 177, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1479;
					this.additiveOperator();
					this.state = 1480;
					localctx._right = this.multiplicativeExpression();
					}
					}
				}
				this.state = 1486;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 177, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public additiveOperator(): AdditiveOperatorContext {
		let localctx: AdditiveOperatorContext = new AdditiveOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 256, RegelSpraakParser.RULE_additiveOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1487;
			_la = this._input.LA(1);
			if(!(((((_la - 132)) & ~0x1F) === 0 && ((1 << (_la - 132)) & 32833) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multiplicativeExpression(): MultiplicativeExpressionContext {
		let localctx: MultiplicativeExpressionContext = new MultiplicativeExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 258, RegelSpraakParser.RULE_multiplicativeExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1489;
			localctx._left = this.powerExpression();
			this.state = 1495;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 178, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1490;
					this.multiplicativeOperator();
					this.state = 1491;
					localctx._right = this.powerExpression();
					}
					}
				}
				this.state = 1497;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 178, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public multiplicativeOperator(): MultiplicativeOperatorContext {
		let localctx: MultiplicativeOperatorContext = new MultiplicativeOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 260, RegelSpraakParser.RULE_multiplicativeOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1498;
			_la = this._input.LA(1);
			if(!(((((_la - 121)) & ~0x1F) === 0 && ((1 << (_la - 121)) & 1027) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public powerExpression(): PowerExpressionContext {
		let localctx: PowerExpressionContext = new PowerExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 262, RegelSpraakParser.RULE_powerExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1500;
			localctx._left = this.primaryExpression(0);
			this.state = 1506;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 179, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1501;
					this.powerOperator();
					this.state = 1502;
					localctx._right = this.primaryExpression(0);
					}
					}
				}
				this.state = 1508;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 179, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public powerOperator(): PowerOperatorContext {
		let localctx: PowerOperatorContext = new PowerOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 264, RegelSpraakParser.RULE_powerOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1509;
			_la = this._input.LA(1);
			if(!(_la===142 || _la===283)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public primaryExpression(): PrimaryExpressionContext;
	public primaryExpression(_p: number): PrimaryExpressionContext;
	// @RuleVersion(0)
	public primaryExpression(_p?: number): PrimaryExpressionContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let localctx: PrimaryExpressionContext = new PrimaryExpressionContext(this, this._ctx, _parentState);
		let _prevctx: PrimaryExpressionContext = localctx;
		let _startState: number = 266;
		this.enterRecursionRule(localctx, 266, RegelSpraakParser.RULE_primaryExpression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1768;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 207, this._ctx) ) {
			case 1:
				{
				localctx = new UnaryMinusExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 1512;
				this.match(RegelSpraakParser.MIN);
				this.state = 1513;
				this.primaryExpression(54);
				}
				break;
			case 2:
				{
				localctx = new UnaryMinusExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1514;
				this.match(RegelSpraakParser.MINUS);
				this.state = 1515;
				this.primaryExpression(53);
				}
				break;
			case 3:
				{
				localctx = new UnaryNietExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1516;
				this.match(RegelSpraakParser.NIET);
				this.state = 1517;
				this.primaryExpression(52);
				}
				break;
			case 4:
				{
				localctx = new AbsTijdsduurFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1518;
				this.match(RegelSpraakParser.DE_ABSOLUTE_TIJDSDUUR_VAN);
				this.state = 1519;
				this.primaryExpression(0);
				this.state = 1520;
				this.match(RegelSpraakParser.TOT);
				this.state = 1521;
				this.primaryExpression(0);
				this.state = 1524;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 180, this._ctx) ) {
				case 1:
					{
					this.state = 1522;
					this.match(RegelSpraakParser.IN_HELE);
					this.state = 1523;
					this.unitIdentifier();
					}
					break;
				}
				}
				break;
			case 5:
				{
				localctx = new TijdsduurFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1526;
				this.match(RegelSpraakParser.TIJDSDUUR_VAN);
				this.state = 1527;
				this.primaryExpression(0);
				this.state = 1528;
				this.match(RegelSpraakParser.TOT);
				this.state = 1529;
				this.primaryExpression(0);
				this.state = 1532;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 181, this._ctx) ) {
				case 1:
					{
					this.state = 1530;
					this.match(RegelSpraakParser.IN_HELE);
					this.state = 1531;
					this.unitIdentifier();
					}
					break;
				}
				}
				break;
			case 6:
				{
				localctx = new SomFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1534;
				this.match(RegelSpraakParser.SOM_VAN);
				this.state = 1535;
				this.primaryExpression(0);
				this.state = 1540;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===273) {
					{
					{
					this.state = 1536;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1537;
					this.primaryExpression(0);
					}
					}
					this.state = 1542;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1543;
				this.match(RegelSpraakParser.EN);
				this.state = 1544;
				this.primaryExpression(49);
				}
				break;
			case 7:
				{
				localctx = new SomAlleExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1546;
				this.match(RegelSpraakParser.SOM_VAN);
				this.state = 1547;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1548;
				this.naamwoord();
				}
				break;
			case 8:
				{
				localctx = new SomAlleAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1549;
				this.match(RegelSpraakParser.SOM_VAN);
				this.state = 1550;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1551;
				this.attribuutReferentie();
				}
				break;
			case 9:
				{
				localctx = new AantalFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1553;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===212) {
					{
					this.state = 1552;
					this.match(RegelSpraakParser.HET);
					}
				}

				this.state = 1555;
				this.match(RegelSpraakParser.AANTAL);
				{
				this.state = 1557;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===119) {
					{
					this.state = 1556;
					this.match(RegelSpraakParser.ALLE);
					}
				}

				this.state = 1559;
				this.onderwerpReferentie();
				}
				}
				break;
			case 10:
				{
				localctx = new AantalAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1561;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===212) {
					{
					this.state = 1560;
					this.match(RegelSpraakParser.HET);
					}
				}

				this.state = 1563;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1564;
				this.attribuutReferentie();
				}
				break;
			case 11:
				{
				localctx = new PercentageFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1571;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 263:
					{
					this.state = 1565;
					this.match(RegelSpraakParser.NUMBER);
					this.state = 1568;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 278:
						{
						this.state = 1566;
						this.match(RegelSpraakParser.PERCENT_SIGN);
						}
						break;
					case 262:
						{
						this.state = 1567;
						(localctx as PercentageFuncExprContext)._p = this.match(RegelSpraakParser.IDENTIFIER);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					break;
				case 266:
					{
					this.state = 1570;
					this.match(RegelSpraakParser.PERCENTAGE_LITERAL);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1573;
				this.match(RegelSpraakParser.VAN);
				this.state = 1574;
				this.primaryExpression(44);
				}
				break;
			case 12:
				{
				localctx = new ConcatenatieExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1575;
				this.match(RegelSpraakParser.CONCATENATIE_VAN);
				this.state = 1576;
				this.primaryExpression(0);
				this.state = 1581;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===273) {
					{
					{
					this.state = 1577;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1578;
					this.primaryExpression(0);
					}
					}
					this.state = 1583;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1584;
				_la = this._input.LA(1);
				if(!(_la===211 || _la===224)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1585;
				this.primaryExpression(39);
				}
				break;
			case 13:
				{
				localctx = new WortelFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1587;
				this.match(RegelSpraakParser.DE_WORTEL_VAN);
				this.state = 1588;
				this.primaryExpression(37);
				}
				break;
			case 14:
				{
				localctx = new AbsValFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1589;
				this.match(RegelSpraakParser.DE_ABSOLUTE_WAARDE_VAN);
				this.state = 1590;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1591;
				this.expressie();
				this.state = 1592;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			case 15:
				{
				localctx = new MinValFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1594;
				this.match(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN);
				this.state = 1595;
				this.primaryExpression(0);
				this.state = 1600;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===273) {
					{
					{
					this.state = 1596;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1597;
					this.primaryExpression(0);
					}
					}
					this.state = 1602;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1603;
				this.match(RegelSpraakParser.EN);
				this.state = 1604;
				this.primaryExpression(35);
				}
				break;
			case 16:
				{
				localctx = new MinAlleAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1606;
				this.match(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN);
				this.state = 1607;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1608;
				this.attribuutReferentie();
				}
				break;
			case 17:
				{
				localctx = new MaxValFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1609;
				this.match(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN);
				this.state = 1610;
				this.primaryExpression(0);
				this.state = 1615;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===273) {
					{
					{
					this.state = 1611;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1612;
					this.primaryExpression(0);
					}
					}
					this.state = 1617;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1618;
				this.match(RegelSpraakParser.EN);
				this.state = 1619;
				this.primaryExpression(33);
				}
				break;
			case 18:
				{
				localctx = new MaxAlleAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1621;
				this.match(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN);
				this.state = 1622;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1623;
				this.attribuutReferentie();
				}
				break;
			case 19:
				{
				localctx = new JaarUitFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1624;
				this.match(RegelSpraakParser.HET);
				this.state = 1625;
				this.match(RegelSpraakParser.JAAR);
				this.state = 1626;
				this.match(RegelSpraakParser.UIT);
				this.state = 1627;
				this.primaryExpression(31);
				}
				break;
			case 20:
				{
				localctx = new MaandUitFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1628;
				this.match(RegelSpraakParser.DE);
				this.state = 1629;
				this.match(RegelSpraakParser.MAAND);
				this.state = 1630;
				this.match(RegelSpraakParser.UIT);
				this.state = 1631;
				this.primaryExpression(30);
				}
				break;
			case 21:
				{
				localctx = new DagUitFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1632;
				this.match(RegelSpraakParser.DE);
				this.state = 1633;
				this.match(RegelSpraakParser.DAG);
				this.state = 1634;
				this.match(RegelSpraakParser.UIT);
				this.state = 1635;
				this.primaryExpression(29);
				}
				break;
			case 22:
				{
				localctx = new DatumMetFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1636;
				this.match(RegelSpraakParser.DE_DATUM_MET);
				this.state = 1637;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1638;
				this.primaryExpression(0);
				this.state = 1639;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1640;
				this.primaryExpression(0);
				this.state = 1641;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1642;
				this.primaryExpression(0);
				this.state = 1643;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			case 23:
				{
				localctx = new PasenFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1645;
				this.match(RegelSpraakParser.DE_EERSTE_PAASDAG_VAN);
				this.state = 1646;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1647;
				this.primaryExpression(0);
				this.state = 1648;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			case 24:
				{
				localctx = new EersteDatumFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1650;
				this.match(RegelSpraakParser.EERSTE_VAN);
				this.state = 1651;
				this.primaryExpression(0);
				this.state = 1656;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===273) {
					{
					{
					this.state = 1652;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1653;
					this.primaryExpression(0);
					}
					}
					this.state = 1658;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1659;
				this.match(RegelSpraakParser.EN);
				this.state = 1660;
				this.primaryExpression(25);
				}
				break;
			case 25:
				{
				localctx = new LaatsteDatumFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1662;
				this.match(RegelSpraakParser.LAATSTE_VAN);
				this.state = 1663;
				this.primaryExpression(0);
				this.state = 1668;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===273) {
					{
					{
					this.state = 1664;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1665;
					this.primaryExpression(0);
					}
					}
					this.state = 1670;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1671;
				this.match(RegelSpraakParser.EN);
				this.state = 1672;
				this.primaryExpression(24);
				}
				break;
			case 26:
				{
				localctx = new TotaalVanExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1674;
				this.match(RegelSpraakParser.HET_TOTAAL_VAN);
				this.state = 1675;
				this.expressie();
				this.state = 1677;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 193, this._ctx) ) {
				case 1:
					{
					this.state = 1676;
					this.conditieBijExpressie();
					}
					break;
				}
				}
				break;
			case 27:
				{
				localctx = new HetAantalDagenInExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1679;
				this.match(RegelSpraakParser.HET);
				this.state = 1680;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1681;
				this.match(RegelSpraakParser.DAGEN);
				this.state = 1682;
				this.match(RegelSpraakParser.IN);
				this.state = 1691;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 207:
				case 219:
					{
					this.state = 1684;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===207) {
						{
						this.state = 1683;
						this.match(RegelSpraakParser.DE);
						}
					}

					this.state = 1686;
					this.match(RegelSpraakParser.MAAND);
					}
					break;
				case 212:
				case 216:
					{
					this.state = 1688;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===212) {
						{
						this.state = 1687;
						this.match(RegelSpraakParser.HET);
						}
					}

					this.state = 1690;
					this.match(RegelSpraakParser.JAAR);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1693;
				this.match(RegelSpraakParser.DAT);
				this.state = 1694;
				this.expressie();
				}
				break;
			case 28:
				{
				localctx = new CapitalizedTotaalVanExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1696;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1695;
					this.identifier();
					}
					}
					this.state = 1698;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===262);
				this.state = 1700;
				this.match(RegelSpraakParser.HET_TOTAAL_VAN);
				this.state = 1701;
				this.expressie();
				this.state = 1703;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 198, this._ctx) ) {
				case 1:
					{
					this.state = 1702;
					this.conditieBijExpressie();
					}
					break;
				}
				}
				break;
			case 29:
				{
				localctx = new TijdsevenredigDeelExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1705;
				this.match(RegelSpraakParser.HET_TIJDSEVENREDIG_DEEL_PER);
				this.state = 1706;
				_la = this._input.LA(1);
				if(!(_la===216 || _la===219)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1707;
				this.match(RegelSpraakParser.VAN);
				this.state = 1708;
				this.expressie();
				this.state = 1710;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 199, this._ctx) ) {
				case 1:
					{
					this.state = 1709;
					this.conditieBijExpressie();
					}
					break;
				}
				}
				break;
			case 30:
				{
				localctx = new CapitalizedTijdsevenredigDeelExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1713;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1712;
					this.identifier();
					}
					}
					this.state = 1715;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===262);
				this.state = 1717;
				this.match(RegelSpraakParser.HET_TIJDSEVENREDIG_DEEL_PER);
				this.state = 1718;
				_la = this._input.LA(1);
				if(!(_la===216 || _la===219)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1719;
				this.match(RegelSpraakParser.VAN);
				this.state = 1720;
				this.expressie();
				this.state = 1722;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 201, this._ctx) ) {
				case 1:
					{
					this.state = 1721;
					this.conditieBijExpressie();
					}
					break;
				}
				}
				break;
			case 31:
				{
				localctx = new DimensieAggExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1726;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 12:
				case 13:
				case 185:
				case 190:
				case 212:
					{
					this.state = 1724;
					this.getalAggregatieFunctie();
					}
					break;
				case 186:
				case 188:
					{
					this.state = 1725;
					this.datumAggregatieFunctie();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1728;
				this.attribuutMetLidwoord();
				this.state = 1729;
				this.dimensieSelectie();
				}
				break;
			case 32:
				{
				localctx = new DimensieRangeAggExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1733;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 12:
				case 13:
				case 185:
				case 190:
				case 212:
					{
					this.state = 1731;
					this.getalAggregatieFunctie();
					}
					break;
				case 186:
				case 188:
					{
					this.state = 1732;
					this.datumAggregatieFunctie();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1737;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 204, this._ctx) ) {
				case 1:
					{
					this.state = 1735;
					this.bezieldeReferentie();
					}
					break;
				case 2:
					{
					this.state = 1736;
					this.attribuutReferentie();
					}
					break;
				}
				this.state = 1739;
				this.match(RegelSpraakParser.VANAF);
				this.state = 1740;
				this.naamwoord();
				this.state = 1741;
				this.match(RegelSpraakParser.TM);
				this.state = 1742;
				this.naamwoord();
				this.state = 1744;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 205, this._ctx) ) {
				case 1:
					{
					this.state = 1743;
					this.match(RegelSpraakParser.DOT);
					}
					break;
				}
				}
				break;
			case 33:
				{
				localctx = new NumberLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1746;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 1748;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 206, this._ctx) ) {
				case 1:
					{
					this.state = 1747;
					this.unitIdentifier();
					}
					break;
				}
				}
				break;
			case 34:
				{
				localctx = new RekendatumKeywordExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1750;
				this.match(RegelSpraakParser.REKENDATUM);
				}
				break;
			case 35:
				{
				localctx = new IdentifierExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1751;
				this.identifier();
				}
				break;
			case 36:
				{
				localctx = new BezieldeRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1752;
				this.bezieldeReferentie();
				}
				break;
			case 37:
				{
				localctx = new AttrRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1753;
				this.attribuutReferentie();
				}
				break;
			case 38:
				{
				localctx = new OnderwerpRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1754;
				this.onderwerpReferentie();
				}
				break;
			case 39:
				{
				localctx = new NaamwoordExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1755;
				this.naamwoord();
				}
				break;
			case 40:
				{
				localctx = new ParamRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1756;
				this.parameterMetLidwoord();
				}
				break;
			case 41:
				{
				localctx = new PercentageLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1757;
				this.match(RegelSpraakParser.PERCENTAGE_LITERAL);
				}
				break;
			case 42:
				{
				localctx = new StringLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1758;
				this.match(RegelSpraakParser.STRING_LITERAL);
				}
				break;
			case 43:
				{
				localctx = new EnumLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1759;
				this.match(RegelSpraakParser.ENUM_LITERAL);
				}
				break;
			case 44:
				{
				localctx = new DatumLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1760;
				this.datumLiteral();
				}
				break;
			case 45:
				{
				localctx = new BooleanTrueLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1761;
				this.match(RegelSpraakParser.WAAR);
				}
				break;
			case 46:
				{
				localctx = new BooleanFalseLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1762;
				this.match(RegelSpraakParser.ONWAAR);
				}
				break;
			case 47:
				{
				localctx = new PronounExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1763;
				this.match(RegelSpraakParser.HIJ);
				}
				break;
			case 48:
				{
				localctx = new ParenExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1764;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1765;
				this.expressie();
				this.state = 1766;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1800;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 210, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 1798;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 209, this._ctx) ) {
					case 1:
						{
						localctx = new PercentageOfExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1770;
						if (!(this.precpred(this._ctx, 43))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 43)");
						}
						this.state = 1771;
						this.match(RegelSpraakParser.VAN);
						this.state = 1772;
						this.primaryExpression(44);
						}
						break;
					case 2:
						{
						localctx = new SimpleConcatenatieExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1773;
						if (!(this.precpred(this._ctx, 38))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 38)");
						}
						this.state = 1776;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						do {
							{
							{
							this.state = 1774;
							this.match(RegelSpraakParser.COMMA);
							this.state = 1775;
							this.primaryExpression(0);
							}
							}
							this.state = 1778;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						} while (_la===273);
						this.state = 1780;
						_la = this._input.LA(1);
						if(!(_la===211 || _la===224)) {
						this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1781;
						this.primaryExpression(39);
						}
						break;
					case 3:
						{
						localctx = new AfrondingExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1783;
						if (!(this.precpred(this._ctx, 42))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 42)");
						}
						this.state = 1784;
						this.afronding();
						}
						break;
					case 4:
						{
						localctx = new BegrenzingAfrondingExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1785;
						if (!(this.precpred(this._ctx, 41))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 41)");
						}
						this.state = 1786;
						this.match(RegelSpraakParser.COMMA);
						this.state = 1787;
						this.begrenzing();
						this.state = 1788;
						this.afronding();
						}
						break;
					case 5:
						{
						localctx = new BegrenzingExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1790;
						if (!(this.precpred(this._ctx, 40))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 40)");
						}
						this.state = 1791;
						this.match(RegelSpraakParser.COMMA);
						this.state = 1792;
						this.begrenzing();
						}
						break;
					case 6:
						{
						localctx = new DateCalcExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1793;
						if (!(this.precpred(this._ctx, 26))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 26)");
						}
						this.state = 1794;
						_la = this._input.LA(1);
						if(!(_la===132 || _la===138)) {
						this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1795;
						this.primaryExpression(0);
						this.state = 1796;
						this.timeUnit();
						}
						break;
					}
					}
				}
				this.state = 1802;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 210, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public afronding(): AfrondingContext {
		let localctx: AfrondingContext = new AfrondingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 268, RegelSpraakParser.RULE_afronding);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1803;
			_la = this._input.LA(1);
			if(!(((((_la - 133)) & ~0x1F) === 0 && ((1 << (_la - 133)) & 131267) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1804;
			this.match(RegelSpraakParser.AFGEROND_OP);
			this.state = 1805;
			this.match(RegelSpraakParser.NUMBER);
			this.state = 1806;
			this.match(RegelSpraakParser.DECIMALEN);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public begrenzing(): BegrenzingContext {
		let localctx: BegrenzingContext = new BegrenzingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 270, RegelSpraakParser.RULE_begrenzing);
		try {
			this.state = 1814;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 211, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1808;
				this.begrenzingMinimum();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1809;
				this.begrenzingMaximum();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1810;
				this.begrenzingMinimum();
				this.state = 1811;
				this.match(RegelSpraakParser.EN);
				this.state = 1812;
				this.begrenzingMaximum();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public begrenzingMinimum(): BegrenzingMinimumContext {
		let localctx: BegrenzingMinimumContext = new BegrenzingMinimumContext(this, this._ctx, this.state);
		this.enterRule(localctx, 272, RegelSpraakParser.RULE_begrenzingMinimum);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1816;
			this.match(RegelSpraakParser.MET_EEN_MINIMUM_VAN);
			this.state = 1817;
			this.expressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public begrenzingMaximum(): BegrenzingMaximumContext {
		let localctx: BegrenzingMaximumContext = new BegrenzingMaximumContext(this, this._ctx, this.state);
		this.enterRule(localctx, 274, RegelSpraakParser.RULE_begrenzingMaximum);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1819;
			this.match(RegelSpraakParser.MET_EEN_MAXIMUM_VAN);
			this.state = 1820;
			this.expressie();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public conditieBijExpressie(): ConditieBijExpressieContext {
		let localctx: ConditieBijExpressieContext = new ConditieBijExpressieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 276, RegelSpraakParser.RULE_conditieBijExpressie);
		try {
			this.state = 1825;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 4:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1822;
				this.match(RegelSpraakParser.GEDURENDE_DE_TIJD_DAT);
				this.state = 1823;
				localctx._condition = this.expressie();
				}
				break;
			case 141:
			case 143:
			case 145:
			case 239:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1824;
				this.periodevergelijkingEnkelvoudig();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public periodevergelijkingEnkelvoudig(): PeriodevergelijkingEnkelvoudigContext {
		let localctx: PeriodevergelijkingEnkelvoudigContext = new PeriodevergelijkingEnkelvoudigContext(this, this._ctx, this.state);
		this.enterRule(localctx, 278, RegelSpraakParser.RULE_periodevergelijkingEnkelvoudig);
		try {
			this.state = 1843;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 213, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1827;
				this.match(RegelSpraakParser.VANAF);
				this.state = 1828;
				this.datumLiteral();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1829;
				this.match(RegelSpraakParser.VAN);
				this.state = 1830;
				this.datumLiteral();
				this.state = 1831;
				this.match(RegelSpraakParser.TOT);
				this.state = 1832;
				this.datumLiteral();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1834;
				this.match(RegelSpraakParser.VAN);
				this.state = 1835;
				this.datumLiteral();
				this.state = 1836;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1837;
				this.datumLiteral();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1839;
				this.match(RegelSpraakParser.TOT);
				this.state = 1840;
				this.datumLiteral();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1841;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1842;
				this.datumLiteral();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public periodeDefinitie(): PeriodeDefinitieContext {
		let localctx: PeriodeDefinitieContext = new PeriodeDefinitieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 280, RegelSpraakParser.RULE_periodeDefinitie);
		try {
			this.state = 1861;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 214, this._ctx) ) {
			case 1:
				localctx = new VanafPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1845;
				this.match(RegelSpraakParser.VANAF);
				this.state = 1846;
				this.dateExpression();
				}
				break;
			case 2:
				localctx = new TotPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1847;
				this.match(RegelSpraakParser.TOT);
				this.state = 1848;
				this.dateExpression();
				}
				break;
			case 3:
				localctx = new TotEnMetPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1849;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1850;
				this.dateExpression();
				}
				break;
			case 4:
				localctx = new VanTotPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1851;
				this.match(RegelSpraakParser.VAN);
				this.state = 1852;
				this.dateExpression();
				this.state = 1853;
				this.match(RegelSpraakParser.TOT);
				this.state = 1854;
				this.dateExpression();
				}
				break;
			case 5:
				localctx = new VanTotEnMetPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1856;
				this.match(RegelSpraakParser.VAN);
				this.state = 1857;
				this.dateExpression();
				this.state = 1858;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1859;
				this.dateExpression();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dateExpression(): DateExpressionContext {
		let localctx: DateExpressionContext = new DateExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 282, RegelSpraakParser.RULE_dateExpression);
		try {
			this.state = 1867;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 265:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1863;
				this.datumLiteral();
				}
				break;
			case 230:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1864;
				this.match(RegelSpraakParser.REKENDATUM);
				}
				break;
			case 231:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1865;
				this.match(RegelSpraakParser.REKENJAAR);
				}
				break;
			case 44:
			case 95:
			case 109:
			case 116:
			case 119:
			case 127:
			case 135:
			case 156:
			case 185:
			case 196:
			case 197:
			case 200:
			case 201:
			case 204:
			case 205:
			case 207:
			case 210:
			case 212:
			case 216:
			case 218:
			case 219:
			case 227:
			case 229:
			case 248:
			case 262:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1866;
				this.attribuutReferentie();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public getalAggregatieFunctie(): GetalAggregatieFunctieContext {
		let localctx: GetalAggregatieFunctieContext = new GetalAggregatieFunctieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 284, RegelSpraakParser.RULE_getalAggregatieFunctie);
		let _la: number;
		try {
			this.state = 1876;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 185:
			case 212:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1870;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===212) {
					{
					this.state = 1869;
					this.match(RegelSpraakParser.HET);
					}
				}

				this.state = 1872;
				this.match(RegelSpraakParser.AANTAL);
				}
				break;
			case 12:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1873;
				this.match(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN);
				}
				break;
			case 13:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1874;
				this.match(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN);
				}
				break;
			case 190:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1875;
				this.match(RegelSpraakParser.SOM_VAN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public datumAggregatieFunctie(): DatumAggregatieFunctieContext {
		let localctx: DatumAggregatieFunctieContext = new DatumAggregatieFunctieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 286, RegelSpraakParser.RULE_datumAggregatieFunctie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1878;
			_la = this._input.LA(1);
			if(!(_la===186 || _la===188)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dimensieSelectie(): DimensieSelectieContext {
		let localctx: DimensieSelectieContext = new DimensieSelectieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 288, RegelSpraakParser.RULE_dimensieSelectie);
		try {
			this.state = 1890;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 228:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1880;
				this.match(RegelSpraakParser.OVER);
				this.state = 1884;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 218, this._ctx) ) {
				case 1:
					{
					this.state = 1881;
					this.aggregerenOverAlleDimensies();
					}
					break;
				case 2:
					{
					this.state = 1882;
					this.aggregerenOverVerzameling();
					}
					break;
				case 3:
					{
					this.state = 1883;
					this.aggregerenOverBereik();
					}
					break;
				}
				this.state = 1886;
				this.match(RegelSpraakParser.DOT);
				}
				break;
			case 239:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1888;
				this.match(RegelSpraakParser.VAN);
				this.state = 1889;
				this.aggregerenOverAlleDimensies();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public aggregerenOverAlleDimensies(): AggregerenOverAlleDimensiesContext {
		let localctx: AggregerenOverAlleDimensiesContext = new AggregerenOverAlleDimensiesContext(this, this._ctx, this.state);
		this.enterRule(localctx, 290, RegelSpraakParser.RULE_aggregerenOverAlleDimensies);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1892;
			this.match(RegelSpraakParser.ALLE);
			this.state = 1893;
			this.naamwoord();
			this.state = 1896;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 220, this._ctx) ) {
			case 1:
				{
				this.state = 1894;
				_la = this._input.LA(1);
				if(!(_la===206 || _la===209)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1895;
				this.predicaat();
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public aggregerenOverVerzameling(): AggregerenOverVerzamelingContext {
		let localctx: AggregerenOverVerzamelingContext = new AggregerenOverVerzamelingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 292, RegelSpraakParser.RULE_aggregerenOverVerzameling);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1898;
			this.match(RegelSpraakParser.DE);
			this.state = 1899;
			this.naamwoord();
			this.state = 1900;
			this.match(RegelSpraakParser.VANAF);
			this.state = 1901;
			this.naamwoord();
			this.state = 1902;
			this.match(RegelSpraakParser.TM);
			this.state = 1903;
			this.naamwoord();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public aggregerenOverBereik(): AggregerenOverBereikContext {
		let localctx: AggregerenOverBereikContext = new AggregerenOverBereikContext(this, this._ctx, this.state);
		this.enterRule(localctx, 294, RegelSpraakParser.RULE_aggregerenOverBereik);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1905;
			this.match(RegelSpraakParser.DE);
			this.state = 1906;
			this.naamwoord();
			this.state = 1907;
			this.match(RegelSpraakParser.IN);
			this.state = 1908;
			this.match(RegelSpraakParser.LBRACE);
			this.state = 1909;
			this.naamwoord();
			this.state = 1914;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===273) {
				{
				{
				this.state = 1910;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1911;
				this.naamwoord();
				}
				}
				this.state = 1916;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1917;
			this.match(RegelSpraakParser.EN);
			this.state = 1918;
			this.naamwoord();
			this.state = 1919;
			this.match(RegelSpraakParser.RBRACE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public unaryCondition(): UnaryConditionContext {
		let localctx: UnaryConditionContext = new UnaryConditionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 296, RegelSpraakParser.RULE_unaryCondition);
		let _la: number;
		try {
			this.state = 1947;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 222, this._ctx) ) {
			case 1:
				localctx = new UnaryCheckConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1921;
				(localctx as UnaryCheckConditionContext)._expr = this.primaryExpression(0);
				this.state = 1922;
				(localctx as UnaryCheckConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 67)) & ~0x1F) === 0 && ((1 << (_la - 67)) & 61455) !== 0))) {
				    (localctx as UnaryCheckConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			case 2:
				localctx = new UnaryNumeriekExactConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1924;
				(localctx as UnaryNumeriekExactConditionContext)._expr = this.primaryExpression(0);
				this.state = 1925;
				(localctx as UnaryNumeriekExactConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 83)) & ~0x1F) === 0 && ((1 << (_la - 83)) & 15) !== 0))) {
				    (localctx as UnaryNumeriekExactConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1926;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 1927;
				this.match(RegelSpraakParser.CIJFERS);
				}
				break;
			case 3:
				localctx = new UnaryDagsoortConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1929;
				(localctx as UnaryDagsoortConditionContext)._expr = this.primaryExpression(0);
				this.state = 1930;
				(localctx as UnaryDagsoortConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & 15) !== 0))) {
				    (localctx as UnaryDagsoortConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1931;
				(localctx as UnaryDagsoortConditionContext)._dagsoort = this.identifier();
				}
				break;
			case 4:
				localctx = new UnaryKenmerkConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1933;
				(localctx as UnaryKenmerkConditionContext)._expr = this.primaryExpression(0);
				this.state = 1934;
				(localctx as UnaryKenmerkConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 71)) & ~0x1F) === 0 && ((1 << (_la - 71)) & 85) !== 0))) {
				    (localctx as UnaryKenmerkConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1935;
				(localctx as UnaryKenmerkConditionContext)._kenmerk = this.identifier();
				}
				break;
			case 5:
				localctx = new UnaryRolConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1937;
				(localctx as UnaryRolConditionContext)._expr = this.primaryExpression(0);
				this.state = 1938;
				(localctx as UnaryRolConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 72)) & ~0x1F) === 0 && ((1 << (_la - 72)) & 85) !== 0))) {
				    (localctx as UnaryRolConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1939;
				(localctx as UnaryRolConditionContext)._rol = this.identifier();
				}
				break;
			case 6:
				localctx = new UnaryUniekConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1941;
				(localctx as UnaryUniekConditionContext)._ref = this.onderwerpReferentie();
				this.state = 1942;
				this.match(RegelSpraakParser.MOETEN_UNIEK_ZIJN);
				}
				break;
			case 7:
				localctx = new UnaryInconsistentDataConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 1944;
				(localctx as UnaryInconsistentDataConditionContext)._expr = this.primaryExpression(0);
				this.state = 1945;
				this.match(RegelSpraakParser.IS_INCONSISTENT);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public regelStatusCondition(): RegelStatusConditionContext {
		let localctx: RegelStatusConditionContext = new RegelStatusConditionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 298, RegelSpraakParser.RULE_regelStatusCondition);
		try {
			this.state = 1957;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 223, this._ctx) ) {
			case 1:
				localctx = new RegelStatusGevuurdCheckContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1949;
				this.match(RegelSpraakParser.REGELVERSIE);
				this.state = 1950;
				(localctx as RegelStatusGevuurdCheckContext)._name = this.naamwoord();
				this.state = 1951;
				this.match(RegelSpraakParser.IS_GEVUURD);
				}
				break;
			case 2:
				localctx = new RegelStatusInconsistentCheckContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1953;
				this.match(RegelSpraakParser.REGELVERSIE);
				this.state = 1954;
				(localctx as RegelStatusInconsistentCheckContext)._name = this.naamwoord();
				this.state = 1955;
				this.match(RegelSpraakParser.IS_INCONSISTENT);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public subordinateClauseExpression(): SubordinateClauseExpressionContext {
		let localctx: SubordinateClauseExpressionContext = new SubordinateClauseExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 300, RegelSpraakParser.RULE_subordinateClauseExpression);
		try {
			this.state = 1971;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 224, this._ctx) ) {
			case 1:
				localctx = new SubordinateHasExprContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1959;
				(localctx as SubordinateHasExprContext)._subject = this.onderwerpReferentie();
				this.state = 1960;
				(localctx as SubordinateHasExprContext)._object = this.naamwoordWithNumbers();
				this.state = 1961;
				(localctx as SubordinateHasExprContext)._verb = this.match(RegelSpraakParser.HEEFT);
				}
				break;
			case 2:
				localctx = new SubordinateIsWithExprContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1963;
				(localctx as SubordinateIsWithExprContext)._subject = this.onderwerpReferentie();
				this.state = 1964;
				(localctx as SubordinateIsWithExprContext)._prepPhrase = this.naamwoordWithNumbers();
				this.state = 1965;
				(localctx as SubordinateIsWithExprContext)._verb = this.match(RegelSpraakParser.IS);
				}
				break;
			case 3:
				localctx = new SubordinateIsKenmerkExprContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1967;
				(localctx as SubordinateIsKenmerkExprContext)._subject = this.onderwerpReferentie();
				this.state = 1968;
				(localctx as SubordinateIsKenmerkExprContext)._verb = this.match(RegelSpraakParser.IS);
				this.state = 1969;
				(localctx as SubordinateIsKenmerkExprContext)._kenmerk = this.naamwoordWithNumbers();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public dagsoortDefinition(): DagsoortDefinitionContext {
		let localctx: DagsoortDefinitionContext = new DagsoortDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 302, RegelSpraakParser.RULE_dagsoortDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1973;
			this.match(RegelSpraakParser.DAGSOORT);
			this.state = 1974;
			this.naamwoord();
			this.state = 1982;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===173) {
				{
				this.state = 1975;
				this.match(RegelSpraakParser.MV_START);
				this.state = 1977;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1976;
					localctx._IDENTIFIER = this.match(RegelSpraakParser.IDENTIFIER);
					localctx._plural.push(localctx._IDENTIFIER);
					}
					}
					this.state = 1979;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===262);
				this.state = 1981;
				this.match(RegelSpraakParser.RPAREN);
				}
			}

			this.state = 1985;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===276) {
				{
				this.state = 1984;
				this.match(RegelSpraakParser.SEMICOLON);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public verdelingResultaat(): VerdelingResultaatContext {
		let localctx: VerdelingResultaatContext = new VerdelingResultaatContext(this, this._ctx, this.state);
		this.enterRule(localctx, 304, RegelSpraakParser.RULE_verdelingResultaat);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1987;
			localctx._sourceAmount = this.expressie();
			this.state = 1988;
			this.match(RegelSpraakParser.WORDT_VERDEELD_OVER);
			this.state = 1989;
			localctx._targetCollection = this.expressie();
			this.state = 1990;
			this.match(RegelSpraakParser.COMMA);
			this.state = 1991;
			this.match(RegelSpraakParser.WAARBIJ_WORDT_VERDEELD);
			this.state = 1994;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 20:
			case 32:
			case 33:
			case 34:
			case 118:
			case 193:
				{
				this.state = 1992;
				this.verdelingMethodeSimple();
				}
				break;
			case 275:
				{
				this.state = 1993;
				this.verdelingMethodeMultiLine();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1997;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===18) {
				{
				this.state = 1996;
				this.verdelingRest();
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public verdelingMethodeSimple(): VerdelingMethodeSimpleContext {
		let localctx: VerdelingMethodeSimpleContext = new VerdelingMethodeSimpleContext(this, this._ctx, this.state);
		this.enterRule(localctx, 306, RegelSpraakParser.RULE_verdelingMethodeSimple);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1999;
			this.verdelingMethode();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public verdelingMethodeMultiLine(): VerdelingMethodeMultiLineContext {
		let localctx: VerdelingMethodeMultiLineContext = new VerdelingMethodeMultiLineContext(this, this._ctx, this.state);
		this.enterRule(localctx, 308, RegelSpraakParser.RULE_verdelingMethodeMultiLine);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2001;
			this.match(RegelSpraakParser.COLON);
			this.state = 2002;
			this.verdelingMethodeBulletList();
			this.state = 2004;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 230, this._ctx) ) {
			case 1:
				{
				this.state = 2003;
				this.match(RegelSpraakParser.DOT);
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public verdelingMethodeBulletList(): VerdelingMethodeBulletListContext {
		let localctx: VerdelingMethodeBulletListContext = new VerdelingMethodeBulletListContext(this, this._ctx, this.state);
		this.enterRule(localctx, 310, RegelSpraakParser.RULE_verdelingMethodeBulletList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2006;
			this.verdelingMethodeBullet();
			this.state = 2010;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===287) {
				{
				{
				this.state = 2007;
				this.verdelingMethodeBullet();
				}
				}
				this.state = 2012;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public verdelingMethodeBullet(): VerdelingMethodeBulletContext {
		let localctx: VerdelingMethodeBulletContext = new VerdelingMethodeBulletContext(this, this._ctx, this.state);
		this.enterRule(localctx, 312, RegelSpraakParser.RULE_verdelingMethodeBullet);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2013;
			this.match(RegelSpraakParser.MINUS);
			this.state = 2014;
			this.verdelingMethode();
			this.state = 2016;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 232, this._ctx) ) {
			case 1:
				{
				this.state = 2015;
				_la = this._input.LA(1);
				if(!(_la===273 || _la===274)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public verdelingMethode(): VerdelingMethodeContext {
		let localctx: VerdelingMethodeContext = new VerdelingMethodeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 314, RegelSpraakParser.RULE_verdelingMethode);
		let _la: number;
		try {
			this.state = 2032;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 193:
				localctx = new VerdelingGelijkeDelenContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2018;
				this.match(RegelSpraakParser.IN_GELIJKE_DELEN);
				}
				break;
			case 34:
				localctx = new VerdelingNaarRatoContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2019;
				this.match(RegelSpraakParser.NAAR_RATO_VAN);
				this.state = 2020;
				(localctx as VerdelingNaarRatoContext)._ratioExpression = this.expressie();
				}
				break;
			case 33:
				localctx = new VerdelingOpVolgordeContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2021;
				this.match(RegelSpraakParser.OP_VOLGORDE_VAN);
				this.state = 2022;
				(localctx as VerdelingOpVolgordeContext)._orderDirection = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===192 || _la===195)) {
				    (localctx as VerdelingOpVolgordeContext)._orderDirection = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 2023;
				(localctx as VerdelingOpVolgordeContext)._orderExpression = this.expressie();
				}
				break;
			case 32:
				localctx = new VerdelingTieBreakContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2024;
				this.match(RegelSpraakParser.BIJ_EVEN_GROOT_CRITERIUM);
				this.state = 2025;
				(localctx as VerdelingTieBreakContext)._tieBreakMethod = this.verdelingMethode();
				}
				break;
			case 20:
				localctx = new VerdelingMaximumContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2026;
				this.match(RegelSpraakParser.MET_EEN_MAXIMUM_VAN);
				this.state = 2027;
				(localctx as VerdelingMaximumContext)._maxExpression = this.expressie();
				}
				break;
			case 118:
				localctx = new VerdelingAfrondingContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 2028;
				this.match(RegelSpraakParser.AFGEROND_OP);
				this.state = 2029;
				(localctx as VerdelingAfrondingContext)._decimals = this.match(RegelSpraakParser.NUMBER);
				this.state = 2030;
				this.match(RegelSpraakParser.DECIMALEN);
				this.state = 2031;
				(localctx as VerdelingAfrondingContext)._roundDirection = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===133 || _la===134)) {
				    (localctx as VerdelingAfrondingContext)._roundDirection = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}
	// @RuleVersion(0)
	public verdelingRest(): VerdelingRestContext {
		let localctx: VerdelingRestContext = new VerdelingRestContext(this, this._ctx, this.state);
		this.enterRule(localctx, 316, RegelSpraakParser.RULE_verdelingRest);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2034;
			this.match(RegelSpraakParser.ALS_ONVERDEELDE_REST_BLIJFT);
			this.state = 2035;
			localctx._remainderTarget = this.expressie();
			this.state = 2037;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===194) {
				{
				this.state = 2036;
				this.match(RegelSpraakParser.OVER_VERDELING);
				}
			}

			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return localctx;
	}

	public sempred(localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 133:
			return this.primaryExpression_sempred(localctx as PrimaryExpressionContext, predIndex);
		}
		return true;
	}
	private primaryExpression_sempred(localctx: PrimaryExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 43);
		case 1:
			return this.precpred(this._ctx, 38);
		case 2:
			return this.precpred(this._ctx, 42);
		case 3:
			return this.precpred(this._ctx, 41);
		case 4:
			return this.precpred(this._ctx, 40);
		case 5:
			return this.precpred(this._ctx, 26);
		}
		return true;
	}

	public static readonly _serializedATN: number[] = [4,1,291,2040,2,0,7,0,
	2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,6,2,7,7,7,2,8,7,8,2,9,7,9,
	2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,2,14,7,14,2,15,7,15,2,16,7,16,2,
	17,7,17,2,18,7,18,2,19,7,19,2,20,7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,
	7,24,2,25,7,25,2,26,7,26,2,27,7,27,2,28,7,28,2,29,7,29,2,30,7,30,2,31,7,
	31,2,32,7,32,2,33,7,33,2,34,7,34,2,35,7,35,2,36,7,36,2,37,7,37,2,38,7,38,
	2,39,7,39,2,40,7,40,2,41,7,41,2,42,7,42,2,43,7,43,2,44,7,44,2,45,7,45,2,
	46,7,46,2,47,7,47,2,48,7,48,2,49,7,49,2,50,7,50,2,51,7,51,2,52,7,52,2,53,
	7,53,2,54,7,54,2,55,7,55,2,56,7,56,2,57,7,57,2,58,7,58,2,59,7,59,2,60,7,
	60,2,61,7,61,2,62,7,62,2,63,7,63,2,64,7,64,2,65,7,65,2,66,7,66,2,67,7,67,
	2,68,7,68,2,69,7,69,2,70,7,70,2,71,7,71,2,72,7,72,2,73,7,73,2,74,7,74,2,
	75,7,75,2,76,7,76,2,77,7,77,2,78,7,78,2,79,7,79,2,80,7,80,2,81,7,81,2,82,
	7,82,2,83,7,83,2,84,7,84,2,85,7,85,2,86,7,86,2,87,7,87,2,88,7,88,2,89,7,
	89,2,90,7,90,2,91,7,91,2,92,7,92,2,93,7,93,2,94,7,94,2,95,7,95,2,96,7,96,
	2,97,7,97,2,98,7,98,2,99,7,99,2,100,7,100,2,101,7,101,2,102,7,102,2,103,
	7,103,2,104,7,104,2,105,7,105,2,106,7,106,2,107,7,107,2,108,7,108,2,109,
	7,109,2,110,7,110,2,111,7,111,2,112,7,112,2,113,7,113,2,114,7,114,2,115,
	7,115,2,116,7,116,2,117,7,117,2,118,7,118,2,119,7,119,2,120,7,120,2,121,
	7,121,2,122,7,122,2,123,7,123,2,124,7,124,2,125,7,125,2,126,7,126,2,127,
	7,127,2,128,7,128,2,129,7,129,2,130,7,130,2,131,7,131,2,132,7,132,2,133,
	7,133,2,134,7,134,2,135,7,135,2,136,7,136,2,137,7,137,2,138,7,138,2,139,
	7,139,2,140,7,140,2,141,7,141,2,142,7,142,2,143,7,143,2,144,7,144,2,145,
	7,145,2,146,7,146,2,147,7,147,2,148,7,148,2,149,7,149,2,150,7,150,2,151,
	7,151,2,152,7,152,2,153,7,153,2,154,7,154,2,155,7,155,2,156,7,156,2,157,
	7,157,2,158,7,158,1,0,1,0,1,0,1,0,1,0,1,0,5,0,325,8,0,10,0,12,0,328,9,0,
	1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,3,1,338,8,1,1,2,1,2,1,2,3,2,343,8,2,1,2,
	1,2,1,3,1,3,1,3,4,3,350,8,3,11,3,12,3,351,1,4,1,4,3,4,356,8,4,1,4,1,4,1,
	4,1,4,1,4,5,4,363,8,4,10,4,12,4,366,9,4,1,4,3,4,369,8,4,1,5,3,5,372,8,5,
	1,5,4,5,375,8,5,11,5,12,5,376,1,5,3,5,380,8,5,4,5,382,8,5,11,5,12,5,383,
	1,5,5,5,387,8,5,10,5,12,5,390,9,5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,5,6,400,
	8,6,10,6,12,6,403,9,6,1,6,3,6,406,8,6,1,7,1,7,3,7,410,8,7,1,8,4,8,413,8,
	8,11,8,12,8,414,1,9,1,9,1,10,1,10,1,11,1,11,1,12,3,12,424,8,12,1,12,4,12,
	427,8,12,11,12,12,12,428,1,12,4,12,432,8,12,11,12,12,12,433,1,12,1,12,4,
	12,438,8,12,11,12,12,12,439,1,12,1,12,4,12,444,8,12,11,12,12,12,445,1,12,
	1,12,4,12,450,8,12,11,12,12,12,451,1,12,4,12,455,8,12,11,12,12,12,456,1,
	12,1,12,4,12,461,8,12,11,12,12,12,462,1,12,1,12,4,12,467,8,12,11,12,12,
	12,468,1,12,1,12,1,12,1,12,1,12,4,12,476,8,12,11,12,12,12,477,3,12,480,
	8,12,1,13,3,13,483,8,13,1,13,4,13,486,8,13,11,13,12,13,487,1,13,4,13,491,
	8,13,11,13,12,13,492,1,13,1,13,4,13,497,8,13,11,13,12,13,498,1,13,1,13,
	4,13,503,8,13,11,13,12,13,504,1,13,1,13,4,13,509,8,13,11,13,12,13,510,1,
	13,4,13,514,8,13,11,13,12,13,515,1,13,1,13,4,13,520,8,13,11,13,12,13,521,
	1,13,1,13,4,13,526,8,13,11,13,12,13,527,1,13,1,13,1,13,1,13,1,13,4,13,535,
	8,13,11,13,12,13,536,3,13,539,8,13,1,14,1,14,3,14,543,8,14,1,15,3,15,546,
	8,15,1,15,4,15,549,8,15,11,15,12,15,550,1,15,4,15,554,8,15,11,15,12,15,
	555,1,15,1,15,4,15,560,8,15,11,15,12,15,561,1,15,1,15,4,15,566,8,15,11,
	15,12,15,567,1,15,1,15,4,15,572,8,15,11,15,12,15,573,1,15,4,15,577,8,15,
	11,15,12,15,578,1,15,1,15,4,15,583,8,15,11,15,12,15,584,1,15,1,15,4,15,
	589,8,15,11,15,12,15,590,3,15,593,8,15,1,16,1,16,1,16,1,16,5,16,599,8,16,
	10,16,12,16,602,9,16,1,17,1,17,1,17,1,17,5,17,608,8,17,10,17,12,17,611,
	9,17,1,18,1,18,1,18,1,18,5,18,617,8,18,10,18,12,18,620,9,18,1,19,1,19,1,
	20,1,20,1,21,1,21,1,22,1,22,1,23,1,23,1,23,1,23,4,23,634,8,23,11,23,12,
	23,635,1,23,3,23,639,8,23,1,23,3,23,642,8,23,1,23,5,23,645,8,23,10,23,12,
	23,648,9,23,1,24,1,24,3,24,652,8,24,1,24,1,24,1,25,3,25,657,8,25,1,25,1,
	25,3,25,661,8,25,1,25,1,25,3,25,665,8,25,1,25,3,25,668,8,25,1,26,1,26,1,
	26,1,26,3,26,674,8,26,1,26,1,26,3,26,678,8,26,1,26,1,26,1,26,1,26,5,26,
	684,8,26,10,26,12,26,687,9,26,3,26,689,8,26,1,26,3,26,692,8,26,1,27,1,27,
	1,27,1,27,1,27,1,27,3,27,700,8,27,1,28,1,28,1,28,1,28,1,29,1,29,1,29,1,
	29,1,29,3,29,711,8,29,1,30,1,30,1,31,1,31,1,31,1,31,1,31,3,31,720,8,31,
	1,32,1,32,1,33,1,33,1,34,3,34,727,8,34,1,34,1,34,1,34,1,34,1,34,1,34,3,
	34,735,8,34,1,35,1,35,1,35,1,35,1,35,1,35,3,35,743,8,35,1,35,3,35,746,8,
	35,1,36,1,36,1,36,1,36,1,36,3,36,753,8,36,1,37,1,37,4,37,757,8,37,11,37,
	12,37,758,1,38,1,38,1,39,1,39,1,40,1,40,1,40,5,40,768,8,40,10,40,12,40,
	771,9,40,1,41,1,41,1,41,1,41,1,41,1,41,3,41,779,8,41,1,41,1,41,3,41,783,
	8,41,1,41,1,41,3,41,787,8,41,1,41,1,41,3,41,791,8,41,1,42,1,42,1,43,1,43,
	1,43,3,43,798,8,43,1,43,1,43,1,43,1,43,3,43,804,8,43,1,44,1,44,1,44,3,44,
	809,8,44,1,45,1,45,1,45,3,45,814,8,45,1,45,1,45,1,45,1,45,4,45,820,8,45,
	11,45,12,45,821,1,46,1,46,1,46,1,46,3,46,828,8,46,1,46,3,46,831,8,46,1,
	47,1,47,1,47,1,47,1,48,1,48,1,49,1,49,1,50,1,50,1,50,1,50,1,50,3,50,846,
	8,50,1,50,1,50,3,50,850,8,50,1,50,1,50,3,50,854,8,50,1,50,3,50,857,8,50,
	1,51,3,51,860,8,51,1,51,1,51,1,51,1,51,5,51,866,8,51,10,51,12,51,869,9,
	51,1,52,4,52,872,8,52,11,52,12,52,873,1,53,3,53,877,8,53,1,53,1,53,1,53,
	1,53,5,53,883,8,53,10,53,12,53,886,9,53,1,53,3,53,889,8,53,1,54,1,54,1,
	54,1,54,4,54,895,8,54,11,54,12,54,896,1,54,1,54,1,54,1,54,1,54,1,54,1,54,
	3,54,906,8,54,1,55,1,55,1,55,1,55,1,55,1,55,3,55,914,8,55,1,55,3,55,917,
	8,55,1,56,4,56,920,8,56,11,56,12,56,921,1,57,1,57,4,57,926,8,57,11,57,12,
	57,927,1,58,4,58,931,8,58,11,58,12,58,932,1,59,1,59,1,60,1,60,1,60,3,60,
	940,8,60,1,60,1,60,1,60,1,60,3,60,946,8,60,1,60,3,60,949,8,60,1,60,3,60,
	952,8,60,1,61,1,61,1,61,3,61,957,8,61,1,61,1,61,4,61,961,8,61,11,61,12,
	61,962,1,62,1,62,5,62,967,8,62,10,62,12,62,970,9,62,1,63,1,63,1,63,1,63,
	1,63,1,63,1,63,1,63,1,63,1,63,1,63,1,63,1,63,1,63,3,63,986,8,63,1,64,1,
	64,1,64,1,65,1,65,1,65,1,65,1,65,3,65,996,8,65,3,65,998,8,65,1,66,1,66,
	1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,3,66,1012,8,66,1,66,3,
	66,1015,8,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,3,66,1027,
	8,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,3,66,1040,8,
	66,1,67,1,67,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,
	1,69,4,69,1057,8,69,11,69,12,69,1058,1,70,4,70,1062,8,70,11,70,12,70,1063,
	1,71,1,71,1,71,1,71,1,71,3,71,1071,8,71,1,72,1,72,3,72,1075,8,72,1,73,1,
	73,1,74,1,74,1,74,1,74,3,74,1083,8,74,1,74,3,74,1086,8,74,1,74,1,74,1,74,
	1,74,1,74,3,74,1093,8,74,1,74,3,74,1096,8,74,3,74,1098,8,74,1,75,1,75,1,
	75,1,75,1,75,5,75,1105,8,75,10,75,12,75,1108,9,75,1,76,1,76,1,76,1,76,1,
	76,1,77,1,77,1,78,1,78,1,78,1,78,1,78,1,78,3,78,1123,8,78,1,78,3,78,1126,
	8,78,3,78,1128,8,78,1,79,1,79,1,79,3,79,1133,8,79,1,80,1,80,1,80,1,80,1,
	80,1,80,1,81,3,81,1142,8,81,1,81,1,81,1,81,1,82,1,82,1,82,3,82,1150,8,82,
	1,83,1,83,1,83,1,83,1,83,1,83,4,83,1158,8,83,11,83,12,83,1159,1,83,1,83,
	1,83,1,83,3,83,1166,8,83,1,83,1,83,1,83,1,83,1,83,1,83,4,83,1174,8,83,11,
	83,12,83,1175,1,83,1,83,1,83,1,83,3,83,1182,8,83,1,83,1,83,1,83,1,83,1,
	83,1,83,4,83,1190,8,83,11,83,12,83,1191,3,83,1194,8,83,1,84,1,84,1,84,1,
	84,1,84,1,84,1,84,1,84,1,84,1,84,1,84,1,84,1,84,1,84,3,84,1210,8,84,1,85,
	1,85,1,85,3,85,1215,8,85,1,86,4,86,1218,8,86,11,86,12,86,1219,1,87,1,87,
	1,88,1,88,1,88,3,88,1227,8,88,1,88,1,88,1,88,1,88,1,88,1,88,4,88,1235,8,
	88,11,88,12,88,1236,1,89,1,89,1,89,3,89,1242,8,89,1,90,1,90,1,90,3,90,1247,
	8,90,1,91,1,91,1,91,1,91,5,91,1253,8,91,10,91,12,91,1256,9,91,1,92,1,92,
	1,92,1,92,5,92,1262,8,92,10,92,12,92,1265,9,92,1,93,1,93,4,93,1269,8,93,
	11,93,12,93,1270,1,93,3,93,1274,8,93,1,94,1,94,4,94,1278,8,94,11,94,12,
	94,1279,1,94,3,94,1283,8,94,1,95,1,95,1,95,1,95,1,96,1,96,1,97,3,97,1292,
	8,97,1,97,1,97,1,98,3,98,1297,8,98,1,98,3,98,1300,8,98,1,98,4,98,1303,8,
	98,11,98,12,98,1304,1,99,1,99,1,99,1,100,1,100,3,100,1312,8,100,1,101,1,
	101,1,101,1,101,1,101,3,101,1319,8,101,1,102,1,102,1,103,3,103,1324,8,103,
	1,103,1,103,3,103,1328,8,103,1,103,1,103,1,104,1,104,1,105,3,105,1335,8,
	105,1,105,1,105,1,105,1,105,1,105,1,106,1,106,1,106,1,107,1,107,1,107,1,
	108,1,108,1,108,1,109,1,109,1,109,1,109,1,109,1,109,1,109,4,109,1358,8,
	109,11,109,12,109,1359,1,110,1,110,1,110,1,110,1,110,1,110,3,110,1368,8,
	110,1,111,1,111,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,
	112,1,112,3,112,1383,8,112,1,113,1,113,1,113,1,113,3,113,1389,8,113,1,113,
	1,113,1,113,1,113,1,113,1,113,4,113,1397,8,113,11,113,12,113,1398,1,114,
	1,114,1,115,1,115,1,116,1,116,1,117,1,117,1,118,1,118,1,119,1,119,1,120,
	1,120,5,120,1415,8,120,10,120,12,120,1418,9,120,1,120,1,120,1,121,1,121,
	1,121,1,121,1,122,1,122,1,122,3,122,1429,8,122,1,122,1,122,5,122,1433,8,
	122,10,122,12,122,1436,9,122,1,123,1,123,1,123,1,123,1,123,1,123,1,123,
	1,123,1,123,1,123,1,123,1,123,1,123,3,123,1451,8,123,1,124,1,124,1,124,
	3,124,1456,8,124,1,125,1,125,1,125,1,125,1,125,1,125,1,125,1,125,1,125,
	1,125,1,125,1,125,1,125,3,125,1471,8,125,1,125,1,125,3,125,1475,8,125,1,
	126,1,126,1,127,1,127,1,127,1,127,5,127,1483,8,127,10,127,12,127,1486,9,
	127,1,128,1,128,1,129,1,129,1,129,1,129,5,129,1494,8,129,10,129,12,129,
	1497,9,129,1,130,1,130,1,131,1,131,1,131,1,131,5,131,1505,8,131,10,131,
	12,131,1508,9,131,1,132,1,132,1,133,1,133,1,133,1,133,1,133,1,133,1,133,
	1,133,1,133,1,133,1,133,1,133,1,133,3,133,1525,8,133,1,133,1,133,1,133,
	1,133,1,133,1,133,3,133,1533,8,133,1,133,1,133,1,133,1,133,5,133,1539,8,
	133,10,133,12,133,1542,9,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,
	1,133,1,133,1,133,3,133,1554,8,133,1,133,1,133,3,133,1558,8,133,1,133,1,
	133,3,133,1562,8,133,1,133,1,133,1,133,1,133,1,133,3,133,1569,8,133,1,133,
	3,133,1572,8,133,1,133,1,133,1,133,1,133,1,133,1,133,5,133,1580,8,133,10,
	133,12,133,1583,9,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,
	133,1,133,1,133,1,133,1,133,1,133,5,133,1599,8,133,10,133,12,133,1602,9,
	133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,5,133,1614,
	8,133,10,133,12,133,1617,9,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,
	1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,
	1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,
	1,133,1,133,1,133,1,133,1,133,5,133,1655,8,133,10,133,12,133,1658,9,133,
	1,133,1,133,1,133,1,133,1,133,1,133,1,133,5,133,1667,8,133,10,133,12,133,
	1670,9,133,1,133,1,133,1,133,1,133,1,133,1,133,3,133,1678,8,133,1,133,1,
	133,1,133,1,133,1,133,3,133,1685,8,133,1,133,1,133,3,133,1689,8,133,1,133,
	3,133,1692,8,133,1,133,1,133,1,133,4,133,1697,8,133,11,133,12,133,1698,
	1,133,1,133,1,133,3,133,1704,8,133,1,133,1,133,1,133,1,133,1,133,3,133,
	1711,8,133,1,133,4,133,1714,8,133,11,133,12,133,1715,1,133,1,133,1,133,
	1,133,1,133,3,133,1723,8,133,1,133,1,133,3,133,1727,8,133,1,133,1,133,1,
	133,1,133,1,133,3,133,1734,8,133,1,133,1,133,3,133,1738,8,133,1,133,1,133,
	1,133,1,133,1,133,3,133,1745,8,133,1,133,1,133,3,133,1749,8,133,1,133,1,
	133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,
	133,1,133,1,133,1,133,1,133,3,133,1769,8,133,1,133,1,133,1,133,1,133,1,
	133,1,133,4,133,1777,8,133,11,133,12,133,1778,1,133,1,133,1,133,1,133,1,
	133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,133,1,
	133,1,133,5,133,1799,8,133,10,133,12,133,1802,9,133,1,134,1,134,1,134,1,
	134,1,134,1,135,1,135,1,135,1,135,1,135,1,135,3,135,1815,8,135,1,136,1,
	136,1,136,1,137,1,137,1,137,1,138,1,138,1,138,3,138,1826,8,138,1,139,1,
	139,1,139,1,139,1,139,1,139,1,139,1,139,1,139,1,139,1,139,1,139,1,139,1,
	139,1,139,1,139,3,139,1844,8,139,1,140,1,140,1,140,1,140,1,140,1,140,1,
	140,1,140,1,140,1,140,1,140,1,140,1,140,1,140,1,140,1,140,3,140,1862,8,
	140,1,141,1,141,1,141,1,141,3,141,1868,8,141,1,142,3,142,1871,8,142,1,142,
	1,142,1,142,1,142,3,142,1877,8,142,1,143,1,143,1,144,1,144,1,144,1,144,
	3,144,1885,8,144,1,144,1,144,1,144,1,144,3,144,1891,8,144,1,145,1,145,1,
	145,1,145,3,145,1897,8,145,1,146,1,146,1,146,1,146,1,146,1,146,1,146,1,
	147,1,147,1,147,1,147,1,147,1,147,1,147,5,147,1913,8,147,10,147,12,147,
	1916,9,147,1,147,1,147,1,147,1,147,1,148,1,148,1,148,1,148,1,148,1,148,
	1,148,1,148,1,148,1,148,1,148,1,148,1,148,1,148,1,148,1,148,1,148,1,148,
	1,148,1,148,1,148,1,148,1,148,1,148,1,148,1,148,3,148,1948,8,148,1,149,
	1,149,1,149,1,149,1,149,1,149,1,149,1,149,3,149,1958,8,149,1,150,1,150,
	1,150,1,150,1,150,1,150,1,150,1,150,1,150,1,150,1,150,1,150,3,150,1972,
	8,150,1,151,1,151,1,151,1,151,4,151,1978,8,151,11,151,12,151,1979,1,151,
	3,151,1983,8,151,1,151,3,151,1986,8,151,1,152,1,152,1,152,1,152,1,152,1,
	152,1,152,3,152,1995,8,152,1,152,3,152,1998,8,152,1,153,1,153,1,154,1,154,
	1,154,3,154,2005,8,154,1,155,1,155,5,155,2009,8,155,10,155,12,155,2012,
	9,155,1,156,1,156,1,156,3,156,2017,8,156,1,157,1,157,1,157,1,157,1,157,
	1,157,1,157,1,157,1,157,1,157,1,157,1,157,1,157,1,157,3,157,2033,8,157,
	1,158,1,158,1,158,3,158,2038,8,158,1,158,0,1,266,159,0,2,4,6,8,10,12,14,
	16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,
	64,66,68,70,72,74,76,78,80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,
	110,112,114,116,118,120,122,124,126,128,130,132,134,136,138,140,142,144,
	146,148,150,152,154,156,158,160,162,164,166,168,170,172,174,176,178,180,
	182,184,186,188,190,192,194,196,198,200,202,204,206,208,210,212,214,216,
	218,220,222,224,226,228,230,232,234,236,238,240,242,244,246,248,250,252,
	254,256,258,260,262,264,266,268,270,272,274,276,278,280,282,284,286,288,
	290,292,294,296,298,300,302,304,306,308,310,312,314,316,0,50,1,0,288,288,
	16,0,95,95,109,109,112,112,119,119,127,127,156,156,185,185,196,197,200,
	201,204,205,216,216,218,219,227,227,229,229,248,248,262,262,15,0,95,95,
	109,109,119,119,127,127,156,156,185,185,196,197,200,201,204,205,216,216,
	218,219,227,227,229,229,248,248,262,262,4,0,116,116,207,207,210,210,212,
	212,12,0,141,141,143,143,171,171,203,203,211,211,215,215,224,224,226,226,
	228,228,236,236,239,239,243,243,7,0,204,205,216,217,219,220,222,223,233,
	234,237,238,245,246,1,0,158,159,2,0,3,3,163,163,2,0,174,175,178,178,9,0,
	132,132,204,205,216,217,219,220,222,223,233,234,237,238,245,246,248,262,
	1,0,182,184,2,0,207,207,212,212,2,0,185,185,262,263,5,0,27,27,94,95,97,
	99,101,105,276,276,2,0,143,143,235,235,2,0,109,109,112,112,2,0,46,47,123,
	123,6,0,47,49,51,51,123,123,126,126,128,128,136,137,3,0,207,207,210,210,
	212,212,9,0,141,141,171,171,203,203,211,211,215,215,226,226,228,228,236,
	236,243,243,3,0,207,207,212,212,247,247,1,0,240,241,1,0,152,153,4,0,196,
	197,200,201,210,210,263,263,3,0,279,280,284,284,287,287,2,0,206,206,209,
	209,2,0,108,108,116,116,1,0,156,157,1,0,148,149,2,0,112,112,116,116,1,0,
	53,58,1,0,53,54,2,0,53,54,63,66,2,0,211,211,224,224,11,0,21,24,37,38,46,
	66,112,112,120,120,123,123,126,126,128,129,135,135,137,137,215,215,3,0,
	132,132,138,138,147,147,2,0,121,122,131,131,2,0,142,142,283,283,2,0,216,
	216,219,219,2,0,132,132,138,138,3,0,133,134,139,140,150,150,2,0,186,186,
	188,188,2,0,67,70,79,82,1,0,83,86,1,0,87,90,4,0,71,71,73,73,75,75,77,77,
	4,0,72,72,74,74,76,76,78,78,1,0,273,274,2,0,192,192,195,195,1,0,133,134,
	2257,0,326,1,0,0,0,2,337,1,0,0,0,4,339,1,0,0,0,6,346,1,0,0,0,8,353,1,0,
	0,0,10,371,1,0,0,0,12,391,1,0,0,0,14,409,1,0,0,0,16,412,1,0,0,0,18,416,
	1,0,0,0,20,418,1,0,0,0,22,420,1,0,0,0,24,479,1,0,0,0,26,538,1,0,0,0,28,
	542,1,0,0,0,30,592,1,0,0,0,32,594,1,0,0,0,34,603,1,0,0,0,36,612,1,0,0,0,
	38,621,1,0,0,0,40,623,1,0,0,0,42,625,1,0,0,0,44,627,1,0,0,0,46,629,1,0,
	0,0,48,651,1,0,0,0,50,660,1,0,0,0,52,669,1,0,0,0,54,699,1,0,0,0,56,701,
	1,0,0,0,58,705,1,0,0,0,60,712,1,0,0,0,62,714,1,0,0,0,64,721,1,0,0,0,66,
	723,1,0,0,0,68,726,1,0,0,0,70,736,1,0,0,0,72,752,1,0,0,0,74,754,1,0,0,0,
	76,760,1,0,0,0,78,762,1,0,0,0,80,764,1,0,0,0,82,772,1,0,0,0,84,792,1,0,
	0,0,86,803,1,0,0,0,88,805,1,0,0,0,90,810,1,0,0,0,92,830,1,0,0,0,94,832,
	1,0,0,0,96,836,1,0,0,0,98,838,1,0,0,0,100,840,1,0,0,0,102,859,1,0,0,0,104,
	871,1,0,0,0,106,888,1,0,0,0,108,905,1,0,0,0,110,907,1,0,0,0,112,919,1,0,
	0,0,114,925,1,0,0,0,116,930,1,0,0,0,118,934,1,0,0,0,120,936,1,0,0,0,122,
	953,1,0,0,0,124,964,1,0,0,0,126,985,1,0,0,0,128,987,1,0,0,0,130,997,1,0,
	0,0,132,1039,1,0,0,0,134,1041,1,0,0,0,136,1043,1,0,0,0,138,1056,1,0,0,0,
	140,1061,1,0,0,0,142,1070,1,0,0,0,144,1074,1,0,0,0,146,1076,1,0,0,0,148,
	1097,1,0,0,0,150,1099,1,0,0,0,152,1109,1,0,0,0,154,1114,1,0,0,0,156,1116,
	1,0,0,0,158,1129,1,0,0,0,160,1134,1,0,0,0,162,1141,1,0,0,0,164,1146,1,0,
	0,0,166,1193,1,0,0,0,168,1209,1,0,0,0,170,1211,1,0,0,0,172,1217,1,0,0,0,
	174,1221,1,0,0,0,176,1226,1,0,0,0,178,1238,1,0,0,0,180,1243,1,0,0,0,182,
	1248,1,0,0,0,184,1257,1,0,0,0,186,1273,1,0,0,0,188,1282,1,0,0,0,190,1284,
	1,0,0,0,192,1288,1,0,0,0,194,1291,1,0,0,0,196,1296,1,0,0,0,198,1306,1,0,
	0,0,200,1311,1,0,0,0,202,1318,1,0,0,0,204,1320,1,0,0,0,206,1323,1,0,0,0,
	208,1331,1,0,0,0,210,1334,1,0,0,0,212,1341,1,0,0,0,214,1344,1,0,0,0,216,
	1347,1,0,0,0,218,1350,1,0,0,0,220,1367,1,0,0,0,222,1369,1,0,0,0,224,1382,
	1,0,0,0,226,1388,1,0,0,0,228,1400,1,0,0,0,230,1402,1,0,0,0,232,1404,1,0,
	0,0,234,1406,1,0,0,0,236,1408,1,0,0,0,238,1410,1,0,0,0,240,1412,1,0,0,0,
	242,1421,1,0,0,0,244,1425,1,0,0,0,246,1450,1,0,0,0,248,1452,1,0,0,0,250,
	1474,1,0,0,0,252,1476,1,0,0,0,254,1478,1,0,0,0,256,1487,1,0,0,0,258,1489,
	1,0,0,0,260,1498,1,0,0,0,262,1500,1,0,0,0,264,1509,1,0,0,0,266,1768,1,0,
	0,0,268,1803,1,0,0,0,270,1814,1,0,0,0,272,1816,1,0,0,0,274,1819,1,0,0,0,
	276,1825,1,0,0,0,278,1843,1,0,0,0,280,1861,1,0,0,0,282,1867,1,0,0,0,284,
	1876,1,0,0,0,286,1878,1,0,0,0,288,1890,1,0,0,0,290,1892,1,0,0,0,292,1898,
	1,0,0,0,294,1905,1,0,0,0,296,1947,1,0,0,0,298,1957,1,0,0,0,300,1971,1,0,
	0,0,302,1973,1,0,0,0,304,1987,1,0,0,0,306,1999,1,0,0,0,308,2001,1,0,0,0,
	310,2006,1,0,0,0,312,2013,1,0,0,0,314,2032,1,0,0,0,316,2034,1,0,0,0,318,
	325,3,2,1,0,319,325,3,120,60,0,320,325,3,122,61,0,321,325,3,4,2,0,322,325,
	3,156,78,0,323,325,3,80,40,0,324,318,1,0,0,0,324,319,1,0,0,0,324,320,1,
	0,0,0,324,321,1,0,0,0,324,322,1,0,0,0,324,323,1,0,0,0,325,328,1,0,0,0,326,
	324,1,0,0,0,326,327,1,0,0,0,327,329,1,0,0,0,328,326,1,0,0,0,329,330,5,0,
	0,1,330,1,1,0,0,0,331,338,3,46,23,0,332,338,3,70,35,0,333,338,3,100,50,
	0,334,338,3,90,45,0,335,338,3,108,54,0,336,338,3,302,151,0,337,331,1,0,
	0,0,337,332,1,0,0,0,337,333,1,0,0,0,337,334,1,0,0,0,337,335,1,0,0,0,337,
	336,1,0,0,0,338,3,1,0,0,0,339,340,5,97,0,0,340,342,3,32,16,0,341,343,3,
	128,64,0,342,341,1,0,0,0,342,343,1,0,0,0,343,344,1,0,0,0,344,345,3,6,3,
	0,345,5,1,0,0,0,346,347,3,8,4,0,347,349,3,10,5,0,348,350,3,12,6,0,349,348,
	1,0,0,0,350,351,1,0,0,0,351,349,1,0,0,0,351,352,1,0,0,0,352,7,1,0,0,0,353,
	355,5,288,0,0,354,356,5,288,0,0,355,354,1,0,0,0,355,356,1,0,0,0,356,357,
	1,0,0,0,357,358,3,16,8,0,358,359,5,288,0,0,359,364,3,16,8,0,360,361,5,288,
	0,0,361,363,3,16,8,0,362,360,1,0,0,0,363,366,1,0,0,0,364,362,1,0,0,0,364,
	365,1,0,0,0,365,368,1,0,0,0,366,364,1,0,0,0,367,369,5,288,0,0,368,367,1,
	0,0,0,368,369,1,0,0,0,369,9,1,0,0,0,370,372,5,288,0,0,371,370,1,0,0,0,371,
	372,1,0,0,0,372,381,1,0,0,0,373,375,5,287,0,0,374,373,1,0,0,0,375,376,1,
	0,0,0,376,374,1,0,0,0,376,377,1,0,0,0,377,379,1,0,0,0,378,380,5,288,0,0,
	379,378,1,0,0,0,379,380,1,0,0,0,380,382,1,0,0,0,381,374,1,0,0,0,382,383,
	1,0,0,0,383,381,1,0,0,0,383,384,1,0,0,0,384,388,1,0,0,0,385,387,5,287,0,
	0,386,385,1,0,0,0,387,390,1,0,0,0,388,386,1,0,0,0,388,389,1,0,0,0,389,11,
	1,0,0,0,390,388,1,0,0,0,391,392,5,288,0,0,392,393,5,263,0,0,393,394,5,288,
	0,0,394,395,3,246,123,0,395,396,5,288,0,0,396,401,3,14,7,0,397,398,5,288,
	0,0,398,400,3,14,7,0,399,397,1,0,0,0,400,403,1,0,0,0,401,399,1,0,0,0,401,
	402,1,0,0,0,402,405,1,0,0,0,403,401,1,0,0,0,404,406,5,288,0,0,405,404,1,
	0,0,0,405,406,1,0,0,0,406,13,1,0,0,0,407,410,3,246,123,0,408,410,5,289,
	0,0,409,407,1,0,0,0,409,408,1,0,0,0,410,15,1,0,0,0,411,413,8,0,0,0,412,
	411,1,0,0,0,413,414,1,0,0,0,414,412,1,0,0,0,414,415,1,0,0,0,415,17,1,0,
	0,0,416,417,5,262,0,0,417,19,1,0,0,0,418,419,7,1,0,0,419,21,1,0,0,0,420,
	421,7,2,0,0,421,23,1,0,0,0,422,424,7,3,0,0,423,422,1,0,0,0,423,424,1,0,
	0,0,424,426,1,0,0,0,425,427,3,20,10,0,426,425,1,0,0,0,427,428,1,0,0,0,428,
	426,1,0,0,0,428,429,1,0,0,0,429,480,1,0,0,0,430,432,3,20,10,0,431,430,1,
	0,0,0,432,433,1,0,0,0,433,431,1,0,0,0,433,434,1,0,0,0,434,480,1,0,0,0,435,
	437,5,44,0,0,436,438,3,20,10,0,437,436,1,0,0,0,438,439,1,0,0,0,439,437,
	1,0,0,0,439,440,1,0,0,0,440,480,1,0,0,0,441,443,5,44,0,0,442,444,3,20,10,
	0,443,442,1,0,0,0,444,445,1,0,0,0,445,443,1,0,0,0,445,446,1,0,0,0,446,447,
	1,0,0,0,447,449,5,171,0,0,448,450,3,20,10,0,449,448,1,0,0,0,450,451,1,0,
	0,0,451,449,1,0,0,0,451,452,1,0,0,0,452,480,1,0,0,0,453,455,3,20,10,0,454,
	453,1,0,0,0,455,456,1,0,0,0,456,454,1,0,0,0,456,457,1,0,0,0,457,458,1,0,
	0,0,458,460,5,171,0,0,459,461,3,20,10,0,460,459,1,0,0,0,461,462,1,0,0,0,
	462,460,1,0,0,0,462,463,1,0,0,0,463,480,1,0,0,0,464,466,5,135,0,0,465,467,
	3,20,10,0,466,465,1,0,0,0,467,468,1,0,0,0,468,466,1,0,0,0,468,469,1,0,0,
	0,469,480,1,0,0,0,470,471,5,212,0,0,471,472,5,185,0,0,472,473,5,205,0,0,
	473,475,5,215,0,0,474,476,3,20,10,0,475,474,1,0,0,0,476,477,1,0,0,0,477,
	475,1,0,0,0,477,478,1,0,0,0,478,480,1,0,0,0,479,423,1,0,0,0,479,431,1,0,
	0,0,479,435,1,0,0,0,479,441,1,0,0,0,479,454,1,0,0,0,479,464,1,0,0,0,479,
	470,1,0,0,0,480,25,1,0,0,0,481,483,7,3,0,0,482,481,1,0,0,0,482,483,1,0,
	0,0,483,485,1,0,0,0,484,486,3,28,14,0,485,484,1,0,0,0,486,487,1,0,0,0,487,
	485,1,0,0,0,487,488,1,0,0,0,488,539,1,0,0,0,489,491,3,28,14,0,490,489,1,
	0,0,0,491,492,1,0,0,0,492,490,1,0,0,0,492,493,1,0,0,0,493,539,1,0,0,0,494,
	496,5,44,0,0,495,497,3,28,14,0,496,495,1,0,0,0,497,498,1,0,0,0,498,496,
	1,0,0,0,498,499,1,0,0,0,499,539,1,0,0,0,500,502,5,44,0,0,501,503,3,28,14,
	0,502,501,1,0,0,0,503,504,1,0,0,0,504,502,1,0,0,0,504,505,1,0,0,0,505,506,
	1,0,0,0,506,508,5,171,0,0,507,509,3,28,14,0,508,507,1,0,0,0,509,510,1,0,
	0,0,510,508,1,0,0,0,510,511,1,0,0,0,511,539,1,0,0,0,512,514,3,28,14,0,513,
	512,1,0,0,0,514,515,1,0,0,0,515,513,1,0,0,0,515,516,1,0,0,0,516,517,1,0,
	0,0,517,519,5,171,0,0,518,520,3,28,14,0,519,518,1,0,0,0,520,521,1,0,0,0,
	521,519,1,0,0,0,521,522,1,0,0,0,522,539,1,0,0,0,523,525,5,135,0,0,524,526,
	3,28,14,0,525,524,1,0,0,0,526,527,1,0,0,0,527,525,1,0,0,0,527,528,1,0,0,
	0,528,539,1,0,0,0,529,530,5,212,0,0,530,531,5,185,0,0,531,532,5,205,0,0,
	532,534,5,215,0,0,533,535,3,28,14,0,534,533,1,0,0,0,535,536,1,0,0,0,536,
	534,1,0,0,0,536,537,1,0,0,0,537,539,1,0,0,0,538,482,1,0,0,0,538,490,1,0,
	0,0,538,494,1,0,0,0,538,500,1,0,0,0,538,513,1,0,0,0,538,523,1,0,0,0,538,
	529,1,0,0,0,539,27,1,0,0,0,540,543,3,20,10,0,541,543,5,263,0,0,542,540,
	1,0,0,0,542,541,1,0,0,0,543,29,1,0,0,0,544,546,7,3,0,0,545,544,1,0,0,0,
	545,546,1,0,0,0,546,548,1,0,0,0,547,549,3,22,11,0,548,547,1,0,0,0,549,550,
	1,0,0,0,550,548,1,0,0,0,550,551,1,0,0,0,551,593,1,0,0,0,552,554,3,22,11,
	0,553,552,1,0,0,0,554,555,1,0,0,0,555,553,1,0,0,0,555,556,1,0,0,0,556,593,
	1,0,0,0,557,559,5,44,0,0,558,560,3,22,11,0,559,558,1,0,0,0,560,561,1,0,
	0,0,561,559,1,0,0,0,561,562,1,0,0,0,562,593,1,0,0,0,563,565,5,44,0,0,564,
	566,3,22,11,0,565,564,1,0,0,0,566,567,1,0,0,0,567,565,1,0,0,0,567,568,1,
	0,0,0,568,569,1,0,0,0,569,571,5,171,0,0,570,572,3,22,11,0,571,570,1,0,0,
	0,572,573,1,0,0,0,573,571,1,0,0,0,573,574,1,0,0,0,574,593,1,0,0,0,575,577,
	3,22,11,0,576,575,1,0,0,0,577,578,1,0,0,0,578,576,1,0,0,0,578,579,1,0,0,
	0,579,580,1,0,0,0,580,582,5,171,0,0,581,583,3,22,11,0,582,581,1,0,0,0,583,
	584,1,0,0,0,584,582,1,0,0,0,584,585,1,0,0,0,585,593,1,0,0,0,586,588,5,135,
	0,0,587,589,3,22,11,0,588,587,1,0,0,0,589,590,1,0,0,0,590,588,1,0,0,0,590,
	591,1,0,0,0,591,593,1,0,0,0,592,545,1,0,0,0,592,553,1,0,0,0,592,557,1,0,
	0,0,592,563,1,0,0,0,592,576,1,0,0,0,592,586,1,0,0,0,593,31,1,0,0,0,594,
	600,3,24,12,0,595,596,3,38,19,0,596,597,3,24,12,0,597,599,1,0,0,0,598,595,
	1,0,0,0,599,602,1,0,0,0,600,598,1,0,0,0,600,601,1,0,0,0,601,33,1,0,0,0,
	602,600,1,0,0,0,603,609,3,26,13,0,604,605,3,38,19,0,605,606,3,26,13,0,606,
	608,1,0,0,0,607,604,1,0,0,0,608,611,1,0,0,0,609,607,1,0,0,0,609,610,1,0,
	0,0,610,35,1,0,0,0,611,609,1,0,0,0,612,618,3,30,15,0,613,614,3,38,19,0,
	614,615,3,30,15,0,615,617,1,0,0,0,616,613,1,0,0,0,617,620,1,0,0,0,618,616,
	1,0,0,0,618,619,1,0,0,0,619,37,1,0,0,0,620,618,1,0,0,0,621,622,7,4,0,0,
	622,39,1,0,0,0,623,624,5,265,0,0,624,41,1,0,0,0,625,626,5,262,0,0,626,43,
	1,0,0,0,627,628,7,5,0,0,628,45,1,0,0,0,629,630,5,98,0,0,630,638,3,36,18,
	0,631,633,5,173,0,0,632,634,5,262,0,0,633,632,1,0,0,0,634,635,1,0,0,0,635,
	633,1,0,0,0,635,636,1,0,0,0,636,637,1,0,0,0,637,639,5,270,0,0,638,631,1,
	0,0,0,638,639,1,0,0,0,639,641,1,0,0,0,640,642,5,160,0,0,641,640,1,0,0,0,
	641,642,1,0,0,0,642,646,1,0,0,0,643,645,3,48,24,0,644,643,1,0,0,0,645,648,
	1,0,0,0,646,644,1,0,0,0,646,647,1,0,0,0,647,47,1,0,0,0,648,646,1,0,0,0,
	649,652,3,50,25,0,650,652,3,52,26,0,651,649,1,0,0,0,651,650,1,0,0,0,652,
	653,1,0,0,0,653,654,5,276,0,0,654,49,1,0,0,0,655,657,5,112,0,0,656,655,
	1,0,0,0,656,657,1,0,0,0,657,658,1,0,0,0,658,661,3,18,9,0,659,661,3,34,17,
	0,660,656,1,0,0,0,660,659,1,0,0,0,661,662,1,0,0,0,662,664,5,169,0,0,663,
	665,7,6,0,0,664,663,1,0,0,0,664,665,1,0,0,0,665,667,1,0,0,0,666,668,3,96,
	48,0,667,666,1,0,0,0,667,668,1,0,0,0,668,51,1,0,0,0,669,673,3,34,17,0,670,
	674,3,54,27,0,671,674,3,76,38,0,672,674,3,78,39,0,673,670,1,0,0,0,673,671,
	1,0,0,0,673,672,1,0,0,0,674,677,1,0,0,0,675,676,5,172,0,0,676,678,3,84,
	42,0,677,675,1,0,0,0,677,678,1,0,0,0,678,688,1,0,0,0,679,680,5,166,0,0,
	680,685,3,98,49,0,681,682,5,211,0,0,682,684,3,98,49,0,683,681,1,0,0,0,684,
	687,1,0,0,0,685,683,1,0,0,0,685,686,1,0,0,0,686,689,1,0,0,0,687,685,1,0,
	0,0,688,679,1,0,0,0,688,689,1,0,0,0,689,691,1,0,0,0,690,692,3,96,48,0,691,
	690,1,0,0,0,691,692,1,0,0,0,692,53,1,0,0,0,693,700,3,58,29,0,694,700,3,
	60,30,0,695,700,3,64,32,0,696,700,3,66,33,0,697,700,3,56,28,0,698,700,3,
	62,31,0,699,693,1,0,0,0,699,694,1,0,0,0,699,695,1,0,0,0,699,696,1,0,0,0,
	699,697,1,0,0,0,699,698,1,0,0,0,700,55,1,0,0,0,701,702,5,100,0,0,702,703,
	5,239,0,0,703,704,3,54,27,0,704,57,1,0,0,0,705,710,5,176,0,0,706,707,5,
	269,0,0,707,708,3,68,34,0,708,709,5,270,0,0,709,711,1,0,0,0,710,706,1,0,
	0,0,710,711,1,0,0,0,711,59,1,0,0,0,712,713,5,181,0,0,713,61,1,0,0,0,714,
	719,5,177,0,0,715,716,5,269,0,0,716,717,3,68,34,0,717,718,5,270,0,0,718,
	720,1,0,0,0,719,715,1,0,0,0,719,720,1,0,0,0,720,63,1,0,0,0,721,722,5,161,
	0,0,722,65,1,0,0,0,723,724,7,7,0,0,724,67,1,0,0,0,725,727,7,8,0,0,726,725,
	1,0,0,0,726,727,1,0,0,0,727,734,1,0,0,0,728,735,5,167,0,0,729,730,5,168,
	0,0,730,731,5,171,0,0,731,732,5,263,0,0,732,735,5,164,0,0,733,735,5,168,
	0,0,734,728,1,0,0,0,734,729,1,0,0,0,734,733,1,0,0,0,735,69,1,0,0,0,736,
	737,5,99,0,0,737,738,5,262,0,0,738,739,5,28,0,0,739,742,3,72,36,0,740,741,
	5,172,0,0,741,743,3,86,43,0,742,740,1,0,0,0,742,743,1,0,0,0,743,745,1,0,
	0,0,744,746,5,276,0,0,745,744,1,0,0,0,745,746,1,0,0,0,746,71,1,0,0,0,747,
	753,3,74,37,0,748,753,3,58,29,0,749,753,3,60,30,0,750,753,3,64,32,0,751,
	753,3,66,33,0,752,747,1,0,0,0,752,748,1,0,0,0,752,749,1,0,0,0,752,750,1,
	0,0,0,752,751,1,0,0,0,753,73,1,0,0,0,754,756,5,165,0,0,755,757,5,268,0,
	0,756,755,1,0,0,0,757,758,1,0,0,0,758,756,1,0,0,0,758,759,1,0,0,0,759,75,
	1,0,0,0,760,761,5,262,0,0,761,77,1,0,0,0,762,763,5,262,0,0,763,79,1,0,0,
	0,764,765,5,102,0,0,765,769,3,18,9,0,766,768,3,82,41,0,767,766,1,0,0,0,
	768,771,1,0,0,0,769,767,1,0,0,0,769,770,1,0,0,0,770,81,1,0,0,0,771,769,
	1,0,0,0,772,773,5,207,0,0,773,778,3,84,42,0,774,775,5,173,0,0,775,776,3,
	84,42,0,776,777,5,270,0,0,777,779,1,0,0,0,778,774,1,0,0,0,778,779,1,0,0,
	0,779,780,1,0,0,0,780,782,3,84,42,0,781,783,3,84,42,0,782,781,1,0,0,0,782,
	783,1,0,0,0,783,790,1,0,0,0,784,786,5,264,0,0,785,787,5,277,0,0,786,785,
	1,0,0,0,786,787,1,0,0,0,787,788,1,0,0,0,788,789,5,263,0,0,789,791,3,84,
	42,0,790,784,1,0,0,0,790,791,1,0,0,0,791,83,1,0,0,0,792,793,7,9,0,0,793,
	85,1,0,0,0,794,797,3,88,44,0,795,796,5,277,0,0,796,798,3,88,44,0,797,795,
	1,0,0,0,797,798,1,0,0,0,798,804,1,0,0,0,799,804,5,263,0,0,800,804,5,278,
	0,0,801,804,5,259,0,0,802,804,5,260,0,0,803,794,1,0,0,0,803,799,1,0,0,0,
	803,800,1,0,0,0,803,801,1,0,0,0,803,802,1,0,0,0,804,87,1,0,0,0,805,808,
	3,84,42,0,806,807,5,283,0,0,807,809,5,263,0,0,808,806,1,0,0,0,808,809,1,
	0,0,0,809,89,1,0,0,0,810,811,5,101,0,0,811,813,3,32,16,0,812,814,5,273,
	0,0,813,812,1,0,0,0,813,814,1,0,0,0,814,815,1,0,0,0,815,816,5,26,0,0,816,
	817,3,32,16,0,817,819,3,92,46,0,818,820,3,94,47,0,819,818,1,0,0,0,820,821,
	1,0,0,0,821,819,1,0,0,0,821,822,1,0,0,0,822,91,1,0,0,0,823,824,5,2,0,0,
	824,825,3,38,19,0,825,827,5,270,0,0,826,828,5,275,0,0,827,826,1,0,0,0,827,
	828,1,0,0,0,828,831,1,0,0,0,829,831,5,1,0,0,830,823,1,0,0,0,830,829,1,0,
	0,0,831,93,1,0,0,0,832,833,5,263,0,0,833,834,5,274,0,0,834,835,3,32,16,
	0,835,95,1,0,0,0,836,837,7,10,0,0,837,97,1,0,0,0,838,839,5,262,0,0,839,
	99,1,0,0,0,840,841,5,103,0,0,841,842,3,102,51,0,842,845,5,275,0,0,843,846,
	3,54,27,0,844,846,3,76,38,0,845,843,1,0,0,0,845,844,1,0,0,0,846,849,1,0,
	0,0,847,848,5,172,0,0,848,850,3,86,43,0,849,847,1,0,0,0,849,850,1,0,0,0,
	850,853,1,0,0,0,851,852,5,112,0,0,852,854,3,246,123,0,853,851,1,0,0,0,853,
	854,1,0,0,0,854,856,1,0,0,0,855,857,3,96,48,0,856,855,1,0,0,0,856,857,1,
	0,0,0,857,101,1,0,0,0,858,860,7,11,0,0,859,858,1,0,0,0,859,860,1,0,0,0,
	860,861,1,0,0,0,861,867,3,104,52,0,862,863,3,38,19,0,863,864,3,104,52,0,
	864,866,1,0,0,0,865,862,1,0,0,0,866,869,1,0,0,0,867,865,1,0,0,0,867,868,
	1,0,0,0,868,103,1,0,0,0,869,867,1,0,0,0,870,872,7,12,0,0,871,870,1,0,0,
	0,872,873,1,0,0,0,873,871,1,0,0,0,873,874,1,0,0,0,874,105,1,0,0,0,875,877,
	7,11,0,0,876,875,1,0,0,0,876,877,1,0,0,0,877,878,1,0,0,0,878,884,3,104,
	52,0,879,880,3,38,19,0,880,881,3,104,52,0,881,883,1,0,0,0,882,879,1,0,0,
	0,883,886,1,0,0,0,884,882,1,0,0,0,884,885,1,0,0,0,885,889,1,0,0,0,886,884,
	1,0,0,0,887,889,3,32,16,0,888,876,1,0,0,0,888,887,1,0,0,0,889,107,1,0,0,
	0,890,891,5,104,0,0,891,892,3,32,16,0,892,894,3,110,55,0,893,895,3,110,
	55,0,894,893,1,0,0,0,895,896,1,0,0,0,896,894,1,0,0,0,896,897,1,0,0,0,897,
	898,1,0,0,0,898,899,3,116,58,0,899,906,1,0,0,0,900,901,5,27,0,0,901,902,
	3,32,16,0,902,903,3,110,55,0,903,904,3,116,58,0,904,906,1,0,0,0,905,890,
	1,0,0,0,905,900,1,0,0,0,906,109,1,0,0,0,907,908,7,11,0,0,908,913,3,114,
	57,0,909,910,5,173,0,0,910,911,3,32,16,0,911,912,5,270,0,0,912,914,1,0,
	0,0,913,909,1,0,0,0,913,914,1,0,0,0,914,916,1,0,0,0,915,917,3,112,56,0,
	916,915,1,0,0,0,916,917,1,0,0,0,917,111,1,0,0,0,918,920,3,20,10,0,919,918,
	1,0,0,0,920,921,1,0,0,0,921,919,1,0,0,0,921,922,1,0,0,0,922,113,1,0,0,0,
	923,926,3,20,10,0,924,926,3,38,19,0,925,923,1,0,0,0,925,924,1,0,0,0,926,
	927,1,0,0,0,927,925,1,0,0,0,927,928,1,0,0,0,928,115,1,0,0,0,929,931,3,118,
	59,0,930,929,1,0,0,0,931,932,1,0,0,0,932,930,1,0,0,0,932,933,1,0,0,0,933,
	117,1,0,0,0,934,935,8,13,0,0,935,119,1,0,0,0,936,937,5,95,0,0,937,939,3,
	124,62,0,938,940,5,263,0,0,939,938,1,0,0,0,939,940,1,0,0,0,940,941,1,0,
	0,0,941,942,3,128,64,0,942,948,3,132,66,0,943,945,3,164,82,0,944,946,5,
	274,0,0,945,944,1,0,0,0,945,946,1,0,0,0,946,949,1,0,0,0,947,949,5,274,0,
	0,948,943,1,0,0,0,948,947,1,0,0,0,948,949,1,0,0,0,949,951,1,0,0,0,950,952,
	3,240,120,0,951,950,1,0,0,0,951,952,1,0,0,0,952,121,1,0,0,0,953,954,5,96,
	0,0,954,956,3,32,16,0,955,957,5,111,0,0,956,955,1,0,0,0,956,957,1,0,0,0,
	957,960,1,0,0,0,958,961,3,120,60,0,959,961,3,156,78,0,960,958,1,0,0,0,960,
	959,1,0,0,0,961,962,1,0,0,0,962,960,1,0,0,0,962,963,1,0,0,0,963,123,1,0,
	0,0,964,968,3,34,17,0,965,967,3,126,63,0,966,965,1,0,0,0,967,970,1,0,0,
	0,968,966,1,0,0,0,968,969,1,0,0,0,969,125,1,0,0,0,970,968,1,0,0,0,971,986,
	5,193,0,0,972,973,5,273,0,0,973,986,3,34,17,0,974,975,5,273,0,0,975,976,
	5,171,0,0,976,986,3,34,17,0,977,978,5,211,0,0,978,986,3,34,17,0,979,980,
	5,112,0,0,980,986,3,34,17,0,981,982,5,199,0,0,982,983,3,34,17,0,983,984,
	5,112,0,0,984,986,1,0,0,0,985,971,1,0,0,0,985,972,1,0,0,0,985,974,1,0,0,
	0,985,977,1,0,0,0,985,979,1,0,0,0,985,981,1,0,0,0,986,127,1,0,0,0,987,988,
	5,107,0,0,988,989,3,130,65,0,989,129,1,0,0,0,990,998,5,202,0,0,991,992,
	5,145,0,0,992,995,3,40,20,0,993,994,7,14,0,0,994,996,3,40,20,0,995,993,
	1,0,0,0,995,996,1,0,0,0,996,998,1,0,0,0,997,990,1,0,0,0,997,991,1,0,0,0,
	998,131,1,0,0,0,999,1000,5,210,0,0,1000,1001,5,204,0,0,1001,1002,5,112,
	0,0,1002,1003,5,210,0,0,1003,1040,3,32,16,0,1004,1011,3,190,95,0,1005,1006,
	5,7,0,0,1006,1012,3,246,123,0,1007,1008,5,8,0,0,1008,1012,3,246,123,0,1009,
	1010,5,9,0,0,1010,1012,3,246,123,0,1011,1005,1,0,0,0,1011,1007,1,0,0,0,
	1011,1009,1,0,0,0,1012,1014,1,0,0,0,1013,1015,3,280,140,0,1014,1013,1,0,
	0,0,1014,1015,1,0,0,0,1015,1040,1,0,0,0,1016,1017,3,190,95,0,1017,1018,
	5,113,0,0,1018,1019,3,134,67,0,1019,1020,3,246,123,0,1020,1040,1,0,0,0,
	1021,1040,3,136,68,0,1022,1023,3,178,89,0,1023,1024,7,15,0,0,1024,1026,
	3,194,97,0,1025,1027,3,280,140,0,1026,1025,1,0,0,0,1026,1027,1,0,0,0,1027,
	1040,1,0,0,0,1028,1029,3,178,89,0,1029,1030,5,109,0,0,1030,1031,7,11,0,
	0,1031,1032,3,32,16,0,1032,1033,5,171,0,0,1033,1034,3,192,96,0,1034,1035,
	7,16,0,0,1035,1036,3,246,123,0,1036,1040,1,0,0,0,1037,1040,3,148,74,0,1038,
	1040,3,304,152,0,1039,999,1,0,0,0,1039,1004,1,0,0,0,1039,1016,1,0,0,0,1039,
	1021,1,0,0,0,1039,1022,1,0,0,0,1039,1028,1,0,0,0,1039,1037,1,0,0,0,1039,
	1038,1,0,0,0,1040,133,1,0,0,0,1041,1042,7,17,0,0,1042,135,1,0,0,0,1043,
	1044,5,210,0,0,1044,1045,3,138,69,0,1045,1046,5,239,0,0,1046,1047,5,210,
	0,0,1047,1048,3,140,70,0,1048,1049,5,112,0,0,1049,1050,7,18,0,0,1050,1051,
	3,138,69,0,1051,1052,5,239,0,0,1052,1053,7,18,0,0,1053,1054,3,140,70,0,
	1054,137,1,0,0,0,1055,1057,3,144,72,0,1056,1055,1,0,0,0,1057,1058,1,0,0,
	0,1058,1056,1,0,0,0,1058,1059,1,0,0,0,1059,139,1,0,0,0,1060,1062,3,142,
	71,0,1061,1060,1,0,0,0,1062,1063,1,0,0,0,1063,1061,1,0,0,0,1063,1064,1,
	0,0,0,1064,141,1,0,0,0,1065,1071,3,20,10,0,1066,1071,3,38,19,0,1067,1071,
	5,207,0,0,1068,1071,5,212,0,0,1069,1071,5,210,0,0,1070,1065,1,0,0,0,1070,
	1066,1,0,0,0,1070,1067,1,0,0,0,1070,1068,1,0,0,0,1070,1069,1,0,0,0,1071,
	143,1,0,0,0,1072,1075,3,20,10,0,1073,1075,3,146,73,0,1074,1072,1,0,0,0,
	1074,1073,1,0,0,0,1075,145,1,0,0,0,1076,1077,7,19,0,0,1077,147,1,0,0,0,
	1078,1079,5,40,0,0,1079,1080,3,32,16,0,1080,1082,5,42,0,0,1081,1083,3,150,
	75,0,1082,1081,1,0,0,0,1082,1083,1,0,0,0,1083,1085,1,0,0,0,1084,1086,5,
	274,0,0,1085,1084,1,0,0,0,1085,1086,1,0,0,0,1086,1098,1,0,0,0,1087,1088,
	5,43,0,0,1088,1089,5,210,0,0,1089,1090,5,44,0,0,1090,1092,3,32,16,0,1091,
	1093,3,150,75,0,1092,1091,1,0,0,0,1092,1093,1,0,0,0,1093,1095,1,0,0,0,1094,
	1096,5,274,0,0,1095,1094,1,0,0,0,1095,1096,1,0,0,0,1096,1098,1,0,0,0,1097,
	1078,1,0,0,0,1097,1087,1,0,0,0,1098,149,1,0,0,0,1099,1100,5,171,0,0,1100,
	1101,3,154,77,0,1101,1102,5,123,0,0,1102,1106,3,246,123,0,1103,1105,3,152,
	76,0,1104,1103,1,0,0,0,1105,1108,1,0,0,0,1106,1104,1,0,0,0,1106,1107,1,
	0,0,0,1107,151,1,0,0,0,1108,1106,1,0,0,0,1109,1110,5,211,0,0,1110,1111,
	3,154,77,0,1111,1112,5,123,0,0,1112,1113,3,246,123,0,1113,153,1,0,0,0,1114,
	1115,3,24,12,0,1115,155,1,0,0,0,1116,1117,5,94,0,0,1117,1127,3,32,16,0,
	1118,1128,3,158,79,0,1119,1125,3,162,81,0,1120,1122,3,164,82,0,1121,1123,
	5,274,0,0,1122,1121,1,0,0,0,1122,1123,1,0,0,0,1123,1126,1,0,0,0,1124,1126,
	5,274,0,0,1125,1120,1,0,0,0,1125,1124,1,0,0,0,1125,1126,1,0,0,0,1126,1128,
	1,0,0,0,1127,1118,1,0,0,0,1127,1119,1,0,0,0,1128,157,1,0,0,0,1129,1130,
	3,160,80,0,1130,1132,5,91,0,0,1131,1133,5,274,0,0,1132,1131,1,0,0,0,1132,
	1133,1,0,0,0,1133,159,1,0,0,0,1134,1135,5,207,0,0,1135,1136,3,32,16,0,1136,
	1137,5,239,0,0,1137,1138,5,119,0,0,1138,1139,3,32,16,0,1139,161,1,0,0,0,
	1140,1142,7,20,0,0,1141,1140,1,0,0,0,1141,1142,1,0,0,0,1142,1143,1,0,0,
	0,1143,1144,3,32,16,0,1144,1145,5,93,0,0,1145,163,1,0,0,0,1146,1149,5,110,
	0,0,1147,1150,3,246,123,0,1148,1150,3,166,83,0,1149,1147,1,0,0,0,1149,1148,
	1,0,0,0,1150,165,1,0,0,0,1151,1152,5,45,0,0,1152,1153,3,168,84,0,1153,1154,
	7,21,0,0,1154,1155,5,39,0,0,1155,1157,5,275,0,0,1156,1158,3,170,85,0,1157,
	1156,1,0,0,0,1158,1159,1,0,0,0,1159,1157,1,0,0,0,1159,1160,1,0,0,0,1160,
	1194,1,0,0,0,1161,1166,3,178,89,0,1162,1166,5,214,0,0,1163,1166,5,212,0,
	0,1164,1166,5,247,0,0,1165,1161,1,0,0,0,1165,1162,1,0,0,0,1165,1163,1,0,
	0,0,1165,1164,1,0,0,0,1166,1167,1,0,0,0,1167,1168,5,117,0,0,1168,1169,3,
	168,84,0,1169,1170,7,21,0,0,1170,1171,5,149,0,0,1171,1173,5,275,0,0,1172,
	1174,3,170,85,0,1173,1172,1,0,0,0,1174,1175,1,0,0,0,1175,1173,1,0,0,0,1175,
	1176,1,0,0,0,1176,1194,1,0,0,0,1177,1182,3,178,89,0,1178,1182,5,214,0,0,
	1179,1182,5,212,0,0,1180,1182,5,247,0,0,1181,1177,1,0,0,0,1181,1178,1,0,
	0,0,1181,1179,1,0,0,0,1181,1180,1,0,0,0,1182,1183,1,0,0,0,1183,1184,5,149,
	0,0,1184,1185,5,117,0,0,1185,1186,3,168,84,0,1186,1187,7,21,0,0,1187,1189,
	5,275,0,0,1188,1190,3,170,85,0,1189,1188,1,0,0,0,1190,1191,1,0,0,0,1191,
	1189,1,0,0,0,1191,1192,1,0,0,0,1192,1194,1,0,0,0,1193,1151,1,0,0,0,1193,
	1165,1,0,0,0,1193,1181,1,0,0,0,1194,167,1,0,0,0,1195,1210,5,119,0,0,1196,
	1210,5,198,0,0,1197,1198,7,22,0,0,1198,1199,7,23,0,0,1199,1200,5,239,0,
	0,1200,1210,5,207,0,0,1201,1202,5,154,0,0,1202,1203,7,23,0,0,1203,1204,
	5,239,0,0,1204,1210,5,207,0,0,1205,1206,5,155,0,0,1206,1207,7,23,0,0,1207,
	1208,5,239,0,0,1208,1210,5,207,0,0,1209,1195,1,0,0,0,1209,1196,1,0,0,0,
	1209,1197,1,0,0,0,1209,1201,1,0,0,0,1209,1205,1,0,0,0,1210,169,1,0,0,0,
	1211,1214,3,172,86,0,1212,1215,3,174,87,0,1213,1215,3,176,88,0,1214,1212,
	1,0,0,0,1214,1213,1,0,0,0,1215,171,1,0,0,0,1216,1218,7,24,0,0,1217,1216,
	1,0,0,0,1218,1219,1,0,0,0,1219,1217,1,0,0,0,1219,1220,1,0,0,0,1220,173,
	1,0,0,0,1221,1222,3,246,123,0,1222,175,1,0,0,0,1223,1227,3,178,89,0,1224,
	1227,5,214,0,0,1225,1227,5,247,0,0,1226,1223,1,0,0,0,1226,1224,1,0,0,0,
	1226,1225,1,0,0,0,1227,1228,1,0,0,0,1228,1229,5,149,0,0,1229,1230,5,117,
	0,0,1230,1231,3,168,84,0,1231,1232,7,21,0,0,1232,1234,5,275,0,0,1233,1235,
	3,170,85,0,1234,1233,1,0,0,0,1235,1236,1,0,0,0,1236,1234,1,0,0,0,1236,1237,
	1,0,0,0,1237,177,1,0,0,0,1238,1241,3,182,91,0,1239,1240,7,25,0,0,1240,1242,
	3,200,100,0,1241,1239,1,0,0,0,1241,1242,1,0,0,0,1242,179,1,0,0,0,1243,1246,
	3,184,92,0,1244,1245,7,25,0,0,1245,1247,3,200,100,0,1246,1244,1,0,0,0,1246,
	1247,1,0,0,0,1247,181,1,0,0,0,1248,1254,3,186,93,0,1249,1250,3,38,19,0,
	1250,1251,3,186,93,0,1251,1253,1,0,0,0,1252,1249,1,0,0,0,1253,1256,1,0,
	0,0,1254,1252,1,0,0,0,1254,1255,1,0,0,0,1255,183,1,0,0,0,1256,1254,1,0,
	0,0,1257,1263,3,188,94,0,1258,1259,3,38,19,0,1259,1260,3,188,94,0,1260,
	1262,1,0,0,0,1261,1258,1,0,0,0,1262,1265,1,0,0,0,1263,1261,1,0,0,0,1263,
	1264,1,0,0,0,1264,185,1,0,0,0,1265,1263,1,0,0,0,1266,1268,7,3,0,0,1267,
	1269,3,20,10,0,1268,1267,1,0,0,0,1269,1270,1,0,0,0,1270,1268,1,0,0,0,1270,
	1271,1,0,0,0,1271,1274,1,0,0,0,1272,1274,5,214,0,0,1273,1266,1,0,0,0,1273,
	1272,1,0,0,0,1274,187,1,0,0,0,1275,1277,7,3,0,0,1276,1278,3,28,14,0,1277,
	1276,1,0,0,0,1278,1279,1,0,0,0,1279,1277,1,0,0,0,1279,1280,1,0,0,0,1280,
	1283,1,0,0,0,1281,1283,5,214,0,0,1282,1275,1,0,0,0,1282,1281,1,0,0,0,1283,
	189,1,0,0,0,1284,1285,3,192,96,0,1285,1286,5,239,0,0,1286,1287,3,178,89,
	0,1287,191,1,0,0,0,1288,1289,3,36,18,0,1289,193,1,0,0,0,1290,1292,3,38,
	19,0,1291,1290,1,0,0,0,1291,1292,1,0,0,0,1292,1293,1,0,0,0,1293,1294,3,
	34,17,0,1294,195,1,0,0,0,1295,1297,3,38,19,0,1296,1295,1,0,0,0,1296,1297,
	1,0,0,0,1297,1299,1,0,0,0,1298,1300,7,18,0,0,1299,1298,1,0,0,0,1299,1300,
	1,0,0,0,1300,1302,1,0,0,0,1301,1303,3,28,14,0,1302,1301,1,0,0,0,1303,1304,
	1,0,0,0,1304,1302,1,0,0,0,1304,1305,1,0,0,0,1305,197,1,0,0,0,1306,1307,
	5,116,0,0,1307,1308,3,32,16,0,1308,199,1,0,0,0,1309,1312,3,202,101,0,1310,
	1312,3,218,109,0,1311,1309,1,0,0,0,1311,1310,1,0,0,0,1312,201,1,0,0,0,1313,
	1319,3,210,105,0,1314,1319,3,204,102,0,1315,1319,3,212,106,0,1316,1319,
	3,214,107,0,1317,1319,3,216,108,0,1318,1313,1,0,0,0,1318,1314,1,0,0,0,1318,
	1315,1,0,0,0,1318,1316,1,0,0,0,1318,1317,1,0,0,0,1319,203,1,0,0,0,1320,
	1321,3,206,103,0,1321,205,1,0,0,0,1322,1324,5,210,0,0,1323,1322,1,0,0,0,
	1323,1324,1,0,0,0,1324,1327,1,0,0,0,1325,1328,3,194,97,0,1326,1328,3,208,
	104,0,1327,1325,1,0,0,0,1327,1326,1,0,0,0,1328,1329,1,0,0,0,1329,1330,7,
	26,0,0,1330,207,1,0,0,0,1331,1332,3,32,16,0,1332,209,1,0,0,0,1333,1335,
	5,210,0,0,1334,1333,1,0,0,0,1334,1335,1,0,0,0,1335,1336,1,0,0,0,1336,1337,
	3,32,16,0,1337,1338,5,108,0,0,1338,1339,3,252,126,0,1339,1340,3,246,123,
	0,1340,211,1,0,0,0,1341,1342,3,228,114,0,1342,1343,3,234,117,0,1343,213,
	1,0,0,0,1344,1345,3,230,115,0,1345,1346,3,236,118,0,1346,215,1,0,0,0,1347,
	1348,3,232,116,0,1348,1349,3,238,119,0,1349,217,1,0,0,0,1350,1351,5,117,
	0,0,1351,1352,3,168,84,0,1352,1353,5,242,0,0,1353,1354,7,27,0,0,1354,1355,
	7,28,0,0,1355,1357,5,275,0,0,1356,1358,3,220,110,0,1357,1356,1,0,0,0,1358,
	1359,1,0,0,0,1359,1357,1,0,0,0,1359,1360,1,0,0,0,1360,219,1,0,0,0,1361,
	1362,3,172,86,0,1362,1363,3,222,111,0,1363,1368,1,0,0,0,1364,1365,3,172,
	86,0,1365,1366,3,226,113,0,1366,1368,1,0,0,0,1367,1361,1,0,0,0,1367,1364,
	1,0,0,0,1368,221,1,0,0,0,1369,1370,3,224,112,0,1370,223,1,0,0,0,1371,1372,
	3,190,95,0,1372,1373,3,252,126,0,1373,1374,3,246,123,0,1374,1383,1,0,0,
	0,1375,1376,3,178,89,0,1376,1377,3,206,103,0,1377,1383,1,0,0,0,1378,1379,
	3,190,95,0,1379,1380,7,29,0,0,1380,1381,3,194,97,0,1381,1383,1,0,0,0,1382,
	1371,1,0,0,0,1382,1375,1,0,0,0,1382,1378,1,0,0,0,1383,225,1,0,0,0,1384,
	1389,5,149,0,0,1385,1389,5,148,0,0,1386,1387,5,290,0,0,1387,1389,5,291,
	0,0,1388,1384,1,0,0,0,1388,1385,1,0,0,0,1388,1386,1,0,0,0,1389,1390,1,0,
	0,0,1390,1391,5,117,0,0,1391,1392,3,168,84,0,1392,1393,5,242,0,0,1393,1394,
	7,27,0,0,1394,1396,5,275,0,0,1395,1397,3,220,110,0,1396,1395,1,0,0,0,1397,
	1398,1,0,0,0,1398,1396,1,0,0,0,1398,1399,1,0,0,0,1399,227,1,0,0,0,1400,
	1401,7,30,0,0,1401,229,1,0,0,0,1402,1403,7,31,0,0,1403,231,1,0,0,0,1404,
	1405,7,32,0,0,1405,233,1,0,0,0,1406,1407,3,246,123,0,1407,235,1,0,0,0,1408,
	1409,3,246,123,0,1409,237,1,0,0,0,1410,1411,3,246,123,0,1411,239,1,0,0,
	0,1412,1416,5,106,0,0,1413,1415,3,242,121,0,1414,1413,1,0,0,0,1415,1418,
	1,0,0,0,1416,1414,1,0,0,0,1416,1417,1,0,0,0,1417,1419,1,0,0,0,1418,1416,
	1,0,0,0,1419,1420,5,274,0,0,1420,241,1,0,0,0,1421,1422,5,262,0,0,1422,1423,
	5,112,0,0,1423,1424,3,244,122,0,1424,243,1,0,0,0,1425,1434,3,266,133,0,
	1426,1429,3,256,128,0,1427,1429,3,260,130,0,1428,1426,1,0,0,0,1428,1427,
	1,0,0,0,1429,1430,1,0,0,0,1430,1431,3,266,133,0,1431,1433,1,0,0,0,1432,
	1428,1,0,0,0,1433,1436,1,0,0,0,1434,1432,1,0,0,0,1434,1435,1,0,0,0,1435,
	245,1,0,0,0,1436,1434,1,0,0,0,1437,1438,3,248,124,0,1438,1439,5,273,0,0,
	1439,1440,3,270,135,0,1440,1441,3,268,134,0,1441,1451,1,0,0,0,1442,1443,
	3,248,124,0,1443,1444,5,273,0,0,1444,1445,3,270,135,0,1445,1451,1,0,0,0,
	1446,1447,3,248,124,0,1447,1448,3,268,134,0,1448,1451,1,0,0,0,1449,1451,
	3,248,124,0,1450,1437,1,0,0,0,1450,1442,1,0,0,0,1450,1446,1,0,0,0,1450,
	1449,1,0,0,0,1451,247,1,0,0,0,1452,1455,3,250,125,0,1453,1454,7,33,0,0,
	1454,1456,3,248,124,0,1455,1453,1,0,0,0,1455,1456,1,0,0,0,1456,249,1,0,
	0,0,1457,1475,3,300,150,0,1458,1459,3,254,127,0,1459,1460,5,112,0,0,1460,
	1461,3,34,17,0,1461,1475,1,0,0,0,1462,1463,3,254,127,0,1463,1464,5,109,
	0,0,1464,1465,3,34,17,0,1465,1475,1,0,0,0,1466,1470,3,254,127,0,1467,1468,
	3,252,126,0,1468,1469,3,254,127,0,1469,1471,1,0,0,0,1470,1467,1,0,0,0,1470,
	1471,1,0,0,0,1471,1475,1,0,0,0,1472,1475,3,296,148,0,1473,1475,3,298,149,
	0,1474,1457,1,0,0,0,1474,1458,1,0,0,0,1474,1462,1,0,0,0,1474,1466,1,0,0,
	0,1474,1472,1,0,0,0,1474,1473,1,0,0,0,1475,251,1,0,0,0,1476,1477,7,34,0,
	0,1477,253,1,0,0,0,1478,1484,3,258,129,0,1479,1480,3,256,128,0,1480,1481,
	3,258,129,0,1481,1483,1,0,0,0,1482,1479,1,0,0,0,1483,1486,1,0,0,0,1484,
	1482,1,0,0,0,1484,1485,1,0,0,0,1485,255,1,0,0,0,1486,1484,1,0,0,0,1487,
	1488,7,35,0,0,1488,257,1,0,0,0,1489,1495,3,262,131,0,1490,1491,3,260,130,
	0,1491,1492,3,262,131,0,1492,1494,1,0,0,0,1493,1490,1,0,0,0,1494,1497,1,
	0,0,0,1495,1493,1,0,0,0,1495,1496,1,0,0,0,1496,259,1,0,0,0,1497,1495,1,
	0,0,0,1498,1499,7,36,0,0,1499,261,1,0,0,0,1500,1506,3,266,133,0,1501,1502,
	3,264,132,0,1502,1503,3,266,133,0,1503,1505,1,0,0,0,1504,1501,1,0,0,0,1505,
	1508,1,0,0,0,1506,1504,1,0,0,0,1506,1507,1,0,0,0,1507,263,1,0,0,0,1508,
	1506,1,0,0,0,1509,1510,7,37,0,0,1510,265,1,0,0,0,1511,1512,6,133,-1,0,1512,
	1513,5,132,0,0,1513,1769,3,266,133,54,1514,1515,5,287,0,0,1515,1769,3,266,
	133,53,1516,1517,5,135,0,0,1517,1769,3,266,133,52,1518,1519,5,10,0,0,1519,
	1520,3,266,133,0,1520,1521,5,141,0,0,1521,1524,3,266,133,0,1522,1523,5,
	187,0,0,1523,1525,3,84,42,0,1524,1522,1,0,0,0,1524,1525,1,0,0,0,1525,1769,
	1,0,0,0,1526,1527,5,191,0,0,1527,1528,3,266,133,0,1528,1529,5,141,0,0,1529,
	1532,3,266,133,0,1530,1531,5,187,0,0,1531,1533,3,84,42,0,1532,1530,1,0,
	0,0,1532,1533,1,0,0,0,1533,1769,1,0,0,0,1534,1535,5,190,0,0,1535,1540,3,
	266,133,0,1536,1537,5,273,0,0,1537,1539,3,266,133,0,1538,1536,1,0,0,0,1539,
	1542,1,0,0,0,1540,1538,1,0,0,0,1540,1541,1,0,0,0,1541,1543,1,0,0,0,1542,
	1540,1,0,0,0,1543,1544,5,211,0,0,1544,1545,3,266,133,49,1545,1769,1,0,0,
	0,1546,1547,5,190,0,0,1547,1548,5,119,0,0,1548,1769,3,32,16,0,1549,1550,
	5,190,0,0,1550,1551,5,119,0,0,1551,1769,3,190,95,0,1552,1554,5,212,0,0,
	1553,1552,1,0,0,0,1553,1554,1,0,0,0,1554,1555,1,0,0,0,1555,1557,5,185,0,
	0,1556,1558,5,119,0,0,1557,1556,1,0,0,0,1557,1558,1,0,0,0,1558,1559,1,0,
	0,0,1559,1769,3,178,89,0,1560,1562,5,212,0,0,1561,1560,1,0,0,0,1561,1562,
	1,0,0,0,1562,1563,1,0,0,0,1563,1564,5,185,0,0,1564,1769,3,190,95,0,1565,
	1568,5,263,0,0,1566,1569,5,278,0,0,1567,1569,5,262,0,0,1568,1566,1,0,0,
	0,1568,1567,1,0,0,0,1569,1572,1,0,0,0,1570,1572,5,266,0,0,1571,1565,1,0,
	0,0,1571,1570,1,0,0,0,1572,1573,1,0,0,0,1573,1574,5,239,0,0,1574,1769,3,
	266,133,44,1575,1576,5,29,0,0,1576,1581,3,266,133,0,1577,1578,5,273,0,0,
	1578,1580,3,266,133,0,1579,1577,1,0,0,0,1580,1583,1,0,0,0,1581,1579,1,0,
	0,0,1581,1582,1,0,0,0,1582,1584,1,0,0,0,1583,1581,1,0,0,0,1584,1585,7,33,
	0,0,1585,1586,3,266,133,39,1586,1769,1,0,0,0,1587,1588,5,151,0,0,1588,1769,
	3,266,133,37,1589,1590,5,11,0,0,1590,1591,5,269,0,0,1591,1592,3,246,123,
	0,1592,1593,5,270,0,0,1593,1769,1,0,0,0,1594,1595,5,13,0,0,1595,1600,3,
	266,133,0,1596,1597,5,273,0,0,1597,1599,3,266,133,0,1598,1596,1,0,0,0,1599,
	1602,1,0,0,0,1600,1598,1,0,0,0,1600,1601,1,0,0,0,1601,1603,1,0,0,0,1602,
	1600,1,0,0,0,1603,1604,5,211,0,0,1604,1605,3,266,133,35,1605,1769,1,0,0,
	0,1606,1607,5,13,0,0,1607,1608,5,119,0,0,1608,1769,3,190,95,0,1609,1610,
	5,12,0,0,1610,1615,3,266,133,0,1611,1612,5,273,0,0,1612,1614,3,266,133,
	0,1613,1611,1,0,0,0,1614,1617,1,0,0,0,1615,1613,1,0,0,0,1615,1616,1,0,0,
	0,1616,1618,1,0,0,0,1617,1615,1,0,0,0,1618,1619,5,211,0,0,1619,1620,3,266,
	133,33,1620,1769,1,0,0,0,1621,1622,5,12,0,0,1622,1623,5,119,0,0,1623,1769,
	3,190,95,0,1624,1625,5,212,0,0,1625,1626,5,216,0,0,1626,1627,5,236,0,0,
	1627,1769,3,266,133,31,1628,1629,5,207,0,0,1629,1630,5,219,0,0,1630,1631,
	5,236,0,0,1631,1769,3,266,133,30,1632,1633,5,207,0,0,1633,1634,5,204,0,
	0,1634,1635,5,236,0,0,1635,1769,3,266,133,29,1636,1637,5,16,0,0,1637,1638,
	5,269,0,0,1638,1639,3,266,133,0,1639,1640,5,273,0,0,1640,1641,3,266,133,
	0,1641,1642,5,273,0,0,1642,1643,3,266,133,0,1643,1644,5,270,0,0,1644,1769,
	1,0,0,0,1645,1646,5,17,0,0,1646,1647,5,269,0,0,1647,1648,3,266,133,0,1648,
	1649,5,270,0,0,1649,1769,1,0,0,0,1650,1651,5,186,0,0,1651,1656,3,266,133,
	0,1652,1653,5,273,0,0,1653,1655,3,266,133,0,1654,1652,1,0,0,0,1655,1658,
	1,0,0,0,1656,1654,1,0,0,0,1656,1657,1,0,0,0,1657,1659,1,0,0,0,1658,1656,
	1,0,0,0,1659,1660,5,211,0,0,1660,1661,3,266,133,25,1661,1769,1,0,0,0,1662,
	1663,5,188,0,0,1663,1668,3,266,133,0,1664,1665,5,273,0,0,1665,1667,3,266,
	133,0,1666,1664,1,0,0,0,1667,1670,1,0,0,0,1668,1666,1,0,0,0,1668,1669,1,
	0,0,0,1669,1671,1,0,0,0,1670,1668,1,0,0,0,1671,1672,5,211,0,0,1672,1673,
	3,266,133,24,1673,1769,1,0,0,0,1674,1675,5,14,0,0,1675,1677,3,246,123,0,
	1676,1678,3,276,138,0,1677,1676,1,0,0,0,1677,1678,1,0,0,0,1678,1769,1,0,
	0,0,1679,1680,5,212,0,0,1680,1681,5,185,0,0,1681,1682,5,205,0,0,1682,1691,
	5,215,0,0,1683,1685,5,207,0,0,1684,1683,1,0,0,0,1684,1685,1,0,0,0,1685,
	1686,1,0,0,0,1686,1692,5,219,0,0,1687,1689,5,212,0,0,1688,1687,1,0,0,0,
	1688,1689,1,0,0,0,1689,1690,1,0,0,0,1690,1692,5,216,0,0,1691,1684,1,0,0,
	0,1691,1688,1,0,0,0,1692,1693,1,0,0,0,1693,1694,5,206,0,0,1694,1769,3,246,
	123,0,1695,1697,3,18,9,0,1696,1695,1,0,0,0,1697,1698,1,0,0,0,1698,1696,
	1,0,0,0,1698,1699,1,0,0,0,1699,1700,1,0,0,0,1700,1701,5,14,0,0,1701,1703,
	3,246,123,0,1702,1704,3,276,138,0,1703,1702,1,0,0,0,1703,1704,1,0,0,0,1704,
	1769,1,0,0,0,1705,1706,5,15,0,0,1706,1707,7,38,0,0,1707,1708,5,239,0,0,
	1708,1710,3,246,123,0,1709,1711,3,276,138,0,1710,1709,1,0,0,0,1710,1711,
	1,0,0,0,1711,1769,1,0,0,0,1712,1714,3,18,9,0,1713,1712,1,0,0,0,1714,1715,
	1,0,0,0,1715,1713,1,0,0,0,1715,1716,1,0,0,0,1716,1717,1,0,0,0,1717,1718,
	5,15,0,0,1718,1719,7,38,0,0,1719,1720,5,239,0,0,1720,1722,3,246,123,0,1721,
	1723,3,276,138,0,1722,1721,1,0,0,0,1722,1723,1,0,0,0,1723,1769,1,0,0,0,
	1724,1727,3,284,142,0,1725,1727,3,286,143,0,1726,1724,1,0,0,0,1726,1725,
	1,0,0,0,1727,1728,1,0,0,0,1728,1729,3,192,96,0,1729,1730,3,288,144,0,1730,
	1769,1,0,0,0,1731,1734,3,284,142,0,1732,1734,3,286,143,0,1733,1731,1,0,
	0,0,1733,1732,1,0,0,0,1734,1737,1,0,0,0,1735,1738,3,198,99,0,1736,1738,
	3,190,95,0,1737,1735,1,0,0,0,1737,1736,1,0,0,0,1738,1739,1,0,0,0,1739,1740,
	5,145,0,0,1740,1741,3,32,16,0,1741,1742,5,235,0,0,1742,1744,3,32,16,0,1743,
	1745,5,274,0,0,1744,1743,1,0,0,0,1744,1745,1,0,0,0,1745,1769,1,0,0,0,1746,
	1748,5,263,0,0,1747,1749,3,84,42,0,1748,1747,1,0,0,0,1748,1749,1,0,0,0,
	1749,1769,1,0,0,0,1750,1769,5,230,0,0,1751,1769,3,18,9,0,1752,1769,3,198,
	99,0,1753,1769,3,190,95,0,1754,1769,3,178,89,0,1755,1769,3,32,16,0,1756,
	1769,3,106,53,0,1757,1769,5,266,0,0,1758,1769,5,267,0,0,1759,1769,5,268,
	0,0,1760,1769,3,40,20,0,1761,1769,5,244,0,0,1762,1769,5,225,0,0,1763,1769,
	5,214,0,0,1764,1765,5,269,0,0,1765,1766,3,246,123,0,1766,1767,5,270,0,0,
	1767,1769,1,0,0,0,1768,1511,1,0,0,0,1768,1514,1,0,0,0,1768,1516,1,0,0,0,
	1768,1518,1,0,0,0,1768,1526,1,0,0,0,1768,1534,1,0,0,0,1768,1546,1,0,0,0,
	1768,1549,1,0,0,0,1768,1553,1,0,0,0,1768,1561,1,0,0,0,1768,1571,1,0,0,0,
	1768,1575,1,0,0,0,1768,1587,1,0,0,0,1768,1589,1,0,0,0,1768,1594,1,0,0,0,
	1768,1606,1,0,0,0,1768,1609,1,0,0,0,1768,1621,1,0,0,0,1768,1624,1,0,0,0,
	1768,1628,1,0,0,0,1768,1632,1,0,0,0,1768,1636,1,0,0,0,1768,1645,1,0,0,0,
	1768,1650,1,0,0,0,1768,1662,1,0,0,0,1768,1674,1,0,0,0,1768,1679,1,0,0,0,
	1768,1696,1,0,0,0,1768,1705,1,0,0,0,1768,1713,1,0,0,0,1768,1726,1,0,0,0,
	1768,1733,1,0,0,0,1768,1746,1,0,0,0,1768,1750,1,0,0,0,1768,1751,1,0,0,0,
	1768,1752,1,0,0,0,1768,1753,1,0,0,0,1768,1754,1,0,0,0,1768,1755,1,0,0,0,
	1768,1756,1,0,0,0,1768,1757,1,0,0,0,1768,1758,1,0,0,0,1768,1759,1,0,0,0,
	1768,1760,1,0,0,0,1768,1761,1,0,0,0,1768,1762,1,0,0,0,1768,1763,1,0,0,0,
	1768,1764,1,0,0,0,1769,1800,1,0,0,0,1770,1771,10,43,0,0,1771,1772,5,239,
	0,0,1772,1799,3,266,133,44,1773,1776,10,38,0,0,1774,1775,5,273,0,0,1775,
	1777,3,266,133,0,1776,1774,1,0,0,0,1777,1778,1,0,0,0,1778,1776,1,0,0,0,
	1778,1779,1,0,0,0,1779,1780,1,0,0,0,1780,1781,7,33,0,0,1781,1782,3,266,
	133,39,1782,1799,1,0,0,0,1783,1784,10,42,0,0,1784,1799,3,268,134,0,1785,
	1786,10,41,0,0,1786,1787,5,273,0,0,1787,1788,3,270,135,0,1788,1789,3,268,
	134,0,1789,1799,1,0,0,0,1790,1791,10,40,0,0,1791,1792,5,273,0,0,1792,1799,
	3,270,135,0,1793,1794,10,26,0,0,1794,1795,7,39,0,0,1795,1796,3,266,133,
	0,1796,1797,3,44,22,0,1797,1799,1,0,0,0,1798,1770,1,0,0,0,1798,1773,1,0,
	0,0,1798,1783,1,0,0,0,1798,1785,1,0,0,0,1798,1790,1,0,0,0,1798,1793,1,0,
	0,0,1799,1802,1,0,0,0,1800,1798,1,0,0,0,1800,1801,1,0,0,0,1801,267,1,0,
	0,0,1802,1800,1,0,0,0,1803,1804,7,40,0,0,1804,1805,5,118,0,0,1805,1806,
	5,263,0,0,1806,1807,5,164,0,0,1807,269,1,0,0,0,1808,1815,3,272,136,0,1809,
	1815,3,274,137,0,1810,1811,3,272,136,0,1811,1812,5,211,0,0,1812,1813,3,
	274,137,0,1813,1815,1,0,0,0,1814,1808,1,0,0,0,1814,1809,1,0,0,0,1814,1810,
	1,0,0,0,1815,271,1,0,0,0,1816,1817,5,19,0,0,1817,1818,3,246,123,0,1818,
	273,1,0,0,0,1819,1820,5,20,0,0,1820,1821,3,246,123,0,1821,275,1,0,0,0,1822,
	1823,5,4,0,0,1823,1826,3,246,123,0,1824,1826,3,278,139,0,1825,1822,1,0,
	0,0,1825,1824,1,0,0,0,1826,277,1,0,0,0,1827,1828,5,145,0,0,1828,1844,3,
	40,20,0,1829,1830,5,239,0,0,1830,1831,3,40,20,0,1831,1832,5,141,0,0,1832,
	1833,3,40,20,0,1833,1844,1,0,0,0,1834,1835,5,239,0,0,1835,1836,3,40,20,
	0,1836,1837,5,143,0,0,1837,1838,3,40,20,0,1838,1844,1,0,0,0,1839,1840,5,
	141,0,0,1840,1844,3,40,20,0,1841,1842,5,143,0,0,1842,1844,3,40,20,0,1843,
	1827,1,0,0,0,1843,1829,1,0,0,0,1843,1834,1,0,0,0,1843,1839,1,0,0,0,1843,
	1841,1,0,0,0,1844,279,1,0,0,0,1845,1846,5,145,0,0,1846,1862,3,282,141,0,
	1847,1848,5,141,0,0,1848,1862,3,282,141,0,1849,1850,5,143,0,0,1850,1862,
	3,282,141,0,1851,1852,5,239,0,0,1852,1853,3,282,141,0,1853,1854,5,141,0,
	0,1854,1855,3,282,141,0,1855,1862,1,0,0,0,1856,1857,5,239,0,0,1857,1858,
	3,282,141,0,1858,1859,5,143,0,0,1859,1860,3,282,141,0,1860,1862,1,0,0,0,
	1861,1845,1,0,0,0,1861,1847,1,0,0,0,1861,1849,1,0,0,0,1861,1851,1,0,0,0,
	1861,1856,1,0,0,0,1862,281,1,0,0,0,1863,1868,3,40,20,0,1864,1868,5,230,
	0,0,1865,1868,5,231,0,0,1866,1868,3,190,95,0,1867,1863,1,0,0,0,1867,1864,
	1,0,0,0,1867,1865,1,0,0,0,1867,1866,1,0,0,0,1868,283,1,0,0,0,1869,1871,
	5,212,0,0,1870,1869,1,0,0,0,1870,1871,1,0,0,0,1871,1872,1,0,0,0,1872,1877,
	5,185,0,0,1873,1877,5,12,0,0,1874,1877,5,13,0,0,1875,1877,5,190,0,0,1876,
	1870,1,0,0,0,1876,1873,1,0,0,0,1876,1874,1,0,0,0,1876,1875,1,0,0,0,1877,
	285,1,0,0,0,1878,1879,7,41,0,0,1879,287,1,0,0,0,1880,1884,5,228,0,0,1881,
	1885,3,290,145,0,1882,1885,3,292,146,0,1883,1885,3,294,147,0,1884,1881,
	1,0,0,0,1884,1882,1,0,0,0,1884,1883,1,0,0,0,1885,1886,1,0,0,0,1886,1887,
	5,274,0,0,1887,1891,1,0,0,0,1888,1889,5,239,0,0,1889,1891,3,290,145,0,1890,
	1880,1,0,0,0,1890,1888,1,0,0,0,1891,289,1,0,0,0,1892,1893,5,119,0,0,1893,
	1896,3,32,16,0,1894,1895,7,25,0,0,1895,1897,3,200,100,0,1896,1894,1,0,0,
	0,1896,1897,1,0,0,0,1897,291,1,0,0,0,1898,1899,5,207,0,0,1899,1900,3,32,
	16,0,1900,1901,5,145,0,0,1901,1902,3,32,16,0,1902,1903,5,235,0,0,1903,1904,
	3,32,16,0,1904,293,1,0,0,0,1905,1906,5,207,0,0,1906,1907,3,32,16,0,1907,
	1908,5,215,0,0,1908,1909,5,271,0,0,1909,1914,3,32,16,0,1910,1911,5,273,
	0,0,1911,1913,3,32,16,0,1912,1910,1,0,0,0,1913,1916,1,0,0,0,1914,1912,1,
	0,0,0,1914,1915,1,0,0,0,1915,1917,1,0,0,0,1916,1914,1,0,0,0,1917,1918,5,
	211,0,0,1918,1919,3,32,16,0,1919,1920,5,272,0,0,1920,295,1,0,0,0,1921,1922,
	3,266,133,0,1922,1923,7,42,0,0,1923,1948,1,0,0,0,1924,1925,3,266,133,0,
	1925,1926,7,43,0,0,1926,1927,5,263,0,0,1927,1928,5,162,0,0,1928,1948,1,
	0,0,0,1929,1930,3,266,133,0,1930,1931,7,44,0,0,1931,1932,3,18,9,0,1932,
	1948,1,0,0,0,1933,1934,3,266,133,0,1934,1935,7,45,0,0,1935,1936,3,18,9,
	0,1936,1948,1,0,0,0,1937,1938,3,266,133,0,1938,1939,7,46,0,0,1939,1940,
	3,18,9,0,1940,1948,1,0,0,0,1941,1942,3,178,89,0,1942,1943,5,91,0,0,1943,
	1948,1,0,0,0,1944,1945,3,266,133,0,1945,1946,5,93,0,0,1946,1948,1,0,0,0,
	1947,1921,1,0,0,0,1947,1924,1,0,0,0,1947,1929,1,0,0,0,1947,1933,1,0,0,0,
	1947,1937,1,0,0,0,1947,1941,1,0,0,0,1947,1944,1,0,0,0,1948,297,1,0,0,0,
	1949,1950,5,232,0,0,1950,1951,3,32,16,0,1951,1952,5,92,0,0,1952,1958,1,
	0,0,0,1953,1954,5,232,0,0,1954,1955,3,32,16,0,1955,1956,5,93,0,0,1956,1958,
	1,0,0,0,1957,1949,1,0,0,0,1957,1953,1,0,0,0,1958,299,1,0,0,0,1959,1960,
	3,178,89,0,1960,1961,3,34,17,0,1961,1962,5,109,0,0,1962,1972,1,0,0,0,1963,
	1964,3,178,89,0,1964,1965,3,34,17,0,1965,1966,5,112,0,0,1966,1972,1,0,0,
	0,1967,1968,3,178,89,0,1968,1969,5,112,0,0,1969,1970,3,34,17,0,1970,1972,
	1,0,0,0,1971,1959,1,0,0,0,1971,1963,1,0,0,0,1971,1967,1,0,0,0,1972,301,
	1,0,0,0,1973,1974,5,105,0,0,1974,1982,3,32,16,0,1975,1977,5,173,0,0,1976,
	1978,5,262,0,0,1977,1976,1,0,0,0,1978,1979,1,0,0,0,1979,1977,1,0,0,0,1979,
	1980,1,0,0,0,1980,1981,1,0,0,0,1981,1983,5,270,0,0,1982,1975,1,0,0,0,1982,
	1983,1,0,0,0,1983,1985,1,0,0,0,1984,1986,5,276,0,0,1985,1984,1,0,0,0,1985,
	1986,1,0,0,0,1986,303,1,0,0,0,1987,1988,3,246,123,0,1988,1989,5,115,0,0,
	1989,1990,3,246,123,0,1990,1991,5,273,0,0,1991,1994,5,25,0,0,1992,1995,
	3,306,153,0,1993,1995,3,308,154,0,1994,1992,1,0,0,0,1994,1993,1,0,0,0,1995,
	1997,1,0,0,0,1996,1998,3,316,158,0,1997,1996,1,0,0,0,1997,1998,1,0,0,0,
	1998,305,1,0,0,0,1999,2000,3,314,157,0,2000,307,1,0,0,0,2001,2002,5,275,
	0,0,2002,2004,3,310,155,0,2003,2005,5,274,0,0,2004,2003,1,0,0,0,2004,2005,
	1,0,0,0,2005,309,1,0,0,0,2006,2010,3,312,156,0,2007,2009,3,312,156,0,2008,
	2007,1,0,0,0,2009,2012,1,0,0,0,2010,2008,1,0,0,0,2010,2011,1,0,0,0,2011,
	311,1,0,0,0,2012,2010,1,0,0,0,2013,2014,5,287,0,0,2014,2016,3,314,157,0,
	2015,2017,7,47,0,0,2016,2015,1,0,0,0,2016,2017,1,0,0,0,2017,313,1,0,0,0,
	2018,2033,5,193,0,0,2019,2020,5,34,0,0,2020,2033,3,246,123,0,2021,2022,
	5,33,0,0,2022,2023,7,48,0,0,2023,2033,3,246,123,0,2024,2025,5,32,0,0,2025,
	2033,3,314,157,0,2026,2027,5,20,0,0,2027,2033,3,246,123,0,2028,2029,5,118,
	0,0,2029,2030,5,263,0,0,2030,2031,5,164,0,0,2031,2033,7,49,0,0,2032,2018,
	1,0,0,0,2032,2019,1,0,0,0,2032,2021,1,0,0,0,2032,2024,1,0,0,0,2032,2026,
	1,0,0,0,2032,2028,1,0,0,0,2033,315,1,0,0,0,2034,2035,5,18,0,0,2035,2037,
	3,246,123,0,2036,2038,5,194,0,0,2037,2036,1,0,0,0,2037,2038,1,0,0,0,2038,
	317,1,0,0,0,235,324,326,337,342,351,355,364,368,371,376,379,383,388,401,
	405,409,414,423,428,433,439,445,451,456,462,468,477,479,482,487,492,498,
	504,510,515,521,527,536,538,542,545,550,555,561,567,573,578,584,590,592,
	600,609,618,635,638,641,646,651,656,660,664,667,673,677,685,688,691,699,
	710,719,726,734,742,745,752,758,769,778,782,786,790,797,803,808,813,821,
	827,830,845,849,853,856,859,867,873,876,884,888,896,905,913,916,921,925,
	927,932,939,945,948,951,956,960,962,968,985,995,997,1011,1014,1026,1039,
	1058,1063,1070,1074,1082,1085,1092,1095,1097,1106,1122,1125,1127,1132,1141,
	1149,1159,1165,1175,1181,1191,1193,1209,1214,1219,1226,1236,1241,1246,1254,
	1263,1270,1273,1279,1282,1291,1296,1299,1304,1311,1318,1323,1327,1334,1359,
	1367,1382,1388,1398,1416,1428,1434,1450,1455,1470,1474,1484,1495,1506,1524,
	1532,1540,1553,1557,1561,1568,1571,1581,1600,1615,1656,1668,1677,1684,1688,
	1691,1698,1703,1710,1715,1722,1726,1733,1737,1744,1748,1768,1778,1798,1800,
	1814,1825,1843,1861,1867,1870,1876,1884,1890,1896,1914,1947,1957,1971,1979,
	1982,1985,1994,1997,2004,2010,2016,2032,2037];

	private static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!RegelSpraakParser.__ATN) {
			RegelSpraakParser.__ATN = new ATNDeserializer().deserialize(RegelSpraakParser._serializedATN);
		}

		return RegelSpraakParser.__ATN;
	}


	static DecisionsToDFA = RegelSpraakParser._ATN.decisionToState.map( (ds: DecisionState, index: number) => new DFA(ds, index) );

}

export class RegelSpraakDocumentContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EOF(): TerminalNode {
		return this.getToken(RegelSpraakParser.EOF, 0);
	}
	public definitie_list(): DefinitieContext[] {
		return this.getTypedRuleContexts(DefinitieContext) as DefinitieContext[];
	}
	public definitie(i: number): DefinitieContext {
		return this.getTypedRuleContext(DefinitieContext, i) as DefinitieContext;
	}
	public regel_list(): RegelContext[] {
		return this.getTypedRuleContexts(RegelContext) as RegelContext[];
	}
	public regel(i: number): RegelContext {
		return this.getTypedRuleContext(RegelContext, i) as RegelContext;
	}
	public regelGroep_list(): RegelGroepContext[] {
		return this.getTypedRuleContexts(RegelGroepContext) as RegelGroepContext[];
	}
	public regelGroep(i: number): RegelGroepContext {
		return this.getTypedRuleContext(RegelGroepContext, i) as RegelGroepContext;
	}
	public beslistabel_list(): BeslistabelContext[] {
		return this.getTypedRuleContexts(BeslistabelContext) as BeslistabelContext[];
	}
	public beslistabel(i: number): BeslistabelContext {
		return this.getTypedRuleContext(BeslistabelContext, i) as BeslistabelContext;
	}
	public consistentieregel_list(): ConsistentieregelContext[] {
		return this.getTypedRuleContexts(ConsistentieregelContext) as ConsistentieregelContext[];
	}
	public consistentieregel(i: number): ConsistentieregelContext {
		return this.getTypedRuleContext(ConsistentieregelContext, i) as ConsistentieregelContext;
	}
	public eenheidsysteemDefinition_list(): EenheidsysteemDefinitionContext[] {
		return this.getTypedRuleContexts(EenheidsysteemDefinitionContext) as EenheidsysteemDefinitionContext[];
	}
	public eenheidsysteemDefinition(i: number): EenheidsysteemDefinitionContext {
		return this.getTypedRuleContext(EenheidsysteemDefinitionContext, i) as EenheidsysteemDefinitionContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_regelSpraakDocument;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRegelSpraakDocument) {
	 		listener.enterRegelSpraakDocument(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRegelSpraakDocument) {
	 		listener.exitRegelSpraakDocument(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRegelSpraakDocument) {
			return visitor.visitRegelSpraakDocument(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DefinitieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public objectTypeDefinition(): ObjectTypeDefinitionContext {
		return this.getTypedRuleContext(ObjectTypeDefinitionContext, 0) as ObjectTypeDefinitionContext;
	}
	public domeinDefinition(): DomeinDefinitionContext {
		return this.getTypedRuleContext(DomeinDefinitionContext, 0) as DomeinDefinitionContext;
	}
	public parameterDefinition(): ParameterDefinitionContext {
		return this.getTypedRuleContext(ParameterDefinitionContext, 0) as ParameterDefinitionContext;
	}
	public dimensieDefinition(): DimensieDefinitionContext {
		return this.getTypedRuleContext(DimensieDefinitionContext, 0) as DimensieDefinitionContext;
	}
	public feitTypeDefinition(): FeitTypeDefinitionContext {
		return this.getTypedRuleContext(FeitTypeDefinitionContext, 0) as FeitTypeDefinitionContext;
	}
	public dagsoortDefinition(): DagsoortDefinitionContext {
		return this.getTypedRuleContext(DagsoortDefinitionContext, 0) as DagsoortDefinitionContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_definitie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDefinitie) {
	 		listener.enterDefinitie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDefinitie) {
	 		listener.exitDefinitie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDefinitie) {
			return visitor.visitDefinitie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BeslistabelContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BESLISTABEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.BESLISTABEL, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public beslistabelTable(): BeslistabelTableContext {
		return this.getTypedRuleContext(BeslistabelTableContext, 0) as BeslistabelTableContext;
	}
	public regelVersie(): RegelVersieContext {
		return this.getTypedRuleContext(RegelVersieContext, 0) as RegelVersieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_beslistabel;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBeslistabel) {
	 		listener.enterBeslistabel(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBeslistabel) {
	 		listener.exitBeslistabel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBeslistabel) {
			return visitor.visitBeslistabel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BeslistabelTableContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public beslistabelHeader(): BeslistabelHeaderContext {
		return this.getTypedRuleContext(BeslistabelHeaderContext, 0) as BeslistabelHeaderContext;
	}
	public beslistabelSeparator(): BeslistabelSeparatorContext {
		return this.getTypedRuleContext(BeslistabelSeparatorContext, 0) as BeslistabelSeparatorContext;
	}
	public beslistabelRow_list(): BeslistabelRowContext[] {
		return this.getTypedRuleContexts(BeslistabelRowContext) as BeslistabelRowContext[];
	}
	public beslistabelRow(i: number): BeslistabelRowContext {
		return this.getTypedRuleContext(BeslistabelRowContext, i) as BeslistabelRowContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_beslistabelTable;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBeslistabelTable) {
	 		listener.enterBeslistabelTable(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBeslistabelTable) {
	 		listener.exitBeslistabelTable(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBeslistabelTable) {
			return visitor.visitBeslistabelTable(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BeslistabelHeaderContext extends ParserRuleContext {
	public _resultColumn!: BeslistabelColumnTextContext;
	public _beslistabelColumnText!: BeslistabelColumnTextContext;
	public _conditionColumns: BeslistabelColumnTextContext[] = [];
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PIPE_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.PIPE);
	}
	public PIPE(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.PIPE, i);
	}
	public beslistabelColumnText_list(): BeslistabelColumnTextContext[] {
		return this.getTypedRuleContexts(BeslistabelColumnTextContext) as BeslistabelColumnTextContext[];
	}
	public beslistabelColumnText(i: number): BeslistabelColumnTextContext {
		return this.getTypedRuleContext(BeslistabelColumnTextContext, i) as BeslistabelColumnTextContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_beslistabelHeader;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBeslistabelHeader) {
	 		listener.enterBeslistabelHeader(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBeslistabelHeader) {
	 		listener.exitBeslistabelHeader(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBeslistabelHeader) {
			return visitor.visitBeslistabelHeader(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BeslistabelSeparatorContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PIPE_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.PIPE);
	}
	public PIPE(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.PIPE, i);
	}
	public MINUS_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.MINUS);
	}
	public MINUS(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.MINUS, i);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_beslistabelSeparator;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBeslistabelSeparator) {
	 		listener.enterBeslistabelSeparator(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBeslistabelSeparator) {
	 		listener.exitBeslistabelSeparator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBeslistabelSeparator) {
			return visitor.visitBeslistabelSeparator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BeslistabelRowContext extends ParserRuleContext {
	public _rowNumber!: Token;
	public _resultExpression!: ExpressieContext;
	public _beslistabelCellValue!: BeslistabelCellValueContext;
	public _conditionValues: BeslistabelCellValueContext[] = [];
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PIPE_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.PIPE);
	}
	public PIPE(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.PIPE, i);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public beslistabelCellValue_list(): BeslistabelCellValueContext[] {
		return this.getTypedRuleContexts(BeslistabelCellValueContext) as BeslistabelCellValueContext[];
	}
	public beslistabelCellValue(i: number): BeslistabelCellValueContext {
		return this.getTypedRuleContext(BeslistabelCellValueContext, i) as BeslistabelCellValueContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_beslistabelRow;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBeslistabelRow) {
	 		listener.enterBeslistabelRow(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBeslistabelRow) {
	 		listener.exitBeslistabelRow(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBeslistabelRow) {
			return visitor.visitBeslistabelRow(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BeslistabelCellValueContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public NVT(): TerminalNode {
		return this.getToken(RegelSpraakParser.NVT, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_beslistabelCellValue;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBeslistabelCellValue) {
	 		listener.enterBeslistabelCellValue(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBeslistabelCellValue) {
	 		listener.exitBeslistabelCellValue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBeslistabelCellValue) {
			return visitor.visitBeslistabelCellValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BeslistabelColumnTextContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PIPE_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.PIPE);
	}
	public PIPE(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.PIPE, i);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_beslistabelColumnText;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBeslistabelColumnText) {
	 		listener.enterBeslistabelColumnText(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBeslistabelColumnText) {
	 		listener.exitBeslistabelColumnText(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBeslistabelColumnText) {
			return visitor.visitBeslistabelColumnText(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_identifier;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterIdentifier) {
	 		listener.enterIdentifier(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitIdentifier) {
	 		listener.exitIdentifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitIdentifier) {
			return visitor.visitIdentifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierOrKeywordContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
	public DAG(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAG, 0);
	}
	public DAGEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAGEN, 0);
	}
	public MAAND(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAAND, 0);
	}
	public JAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.JAAR, 0);
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
	}
	public PERIODE(): TerminalNode {
		return this.getToken(RegelSpraakParser.PERIODE, 0);
	}
	public REGEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.REGEL, 0);
	}
	public VOORWAARDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOORWAARDE, 0);
	}
	public HEEFT(): TerminalNode {
		return this.getToken(RegelSpraakParser.HEEFT, 0);
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
	public INCONSISTENT(): TerminalNode {
		return this.getToken(RegelSpraakParser.INCONSISTENT, 0);
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public KWARTAAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.KWARTAAL, 0);
	}
	public METER(): TerminalNode {
		return this.getToken(RegelSpraakParser.METER, 0);
	}
	public EEN_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN_TELWOORD, 0);
	}
	public TWEE_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.TWEE_TELWOORD, 0);
	}
	public DRIE_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.DRIE_TELWOORD, 0);
	}
	public VIER_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.VIER_TELWOORD, 0);
	}
	public OUDER(): TerminalNode {
		return this.getToken(RegelSpraakParser.OUDER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_identifierOrKeyword;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterIdentifierOrKeyword) {
	 		listener.enterIdentifierOrKeyword(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitIdentifierOrKeyword) {
	 		listener.exitIdentifierOrKeyword(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitIdentifierOrKeyword) {
			return visitor.visitIdentifierOrKeyword(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierOrKeywordNoIsContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
	public DAG(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAG, 0);
	}
	public DAGEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAGEN, 0);
	}
	public MAAND(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAAND, 0);
	}
	public JAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.JAAR, 0);
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
	}
	public PERIODE(): TerminalNode {
		return this.getToken(RegelSpraakParser.PERIODE, 0);
	}
	public REGEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.REGEL, 0);
	}
	public VOORWAARDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOORWAARDE, 0);
	}
	public HEEFT(): TerminalNode {
		return this.getToken(RegelSpraakParser.HEEFT, 0);
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
	public INCONSISTENT(): TerminalNode {
		return this.getToken(RegelSpraakParser.INCONSISTENT, 0);
	}
	public KWARTAAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.KWARTAAL, 0);
	}
	public METER(): TerminalNode {
		return this.getToken(RegelSpraakParser.METER, 0);
	}
	public EEN_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN_TELWOORD, 0);
	}
	public TWEE_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.TWEE_TELWOORD, 0);
	}
	public DRIE_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.DRIE_TELWOORD, 0);
	}
	public VIER_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.VIER_TELWOORD, 0);
	}
	public OUDER(): TerminalNode {
		return this.getToken(RegelSpraakParser.OUDER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_identifierOrKeywordNoIs;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterIdentifierOrKeywordNoIs) {
	 		listener.enterIdentifierOrKeywordNoIs(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitIdentifierOrKeywordNoIs) {
	 		listener.exitIdentifierOrKeywordNoIs(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitIdentifierOrKeywordNoIs) {
			return visitor.visitIdentifierOrKeywordNoIs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NaamPhraseContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierOrKeyword_list(): IdentifierOrKeywordContext[] {
		return this.getTypedRuleContexts(IdentifierOrKeywordContext) as IdentifierOrKeywordContext[];
	}
	public identifierOrKeyword(i: number): IdentifierOrKeywordContext {
		return this.getTypedRuleContext(IdentifierOrKeywordContext, i) as IdentifierOrKeywordContext;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
	public ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN, 0);
	}
	public NIEUWE(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIEUWE, 0);
	}
	public MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET, 0);
	}
	public NIET(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIET, 0);
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
	}
	public DAGEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAGEN, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_naamPhrase;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterNaamPhrase) {
	 		listener.enterNaamPhrase(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitNaamPhrase) {
	 		listener.exitNaamPhrase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitNaamPhrase) {
			return visitor.visitNaamPhrase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NaamPhraseWithNumbersContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierOrKeywordWithNumbers_list(): IdentifierOrKeywordWithNumbersContext[] {
		return this.getTypedRuleContexts(IdentifierOrKeywordWithNumbersContext) as IdentifierOrKeywordWithNumbersContext[];
	}
	public identifierOrKeywordWithNumbers(i: number): IdentifierOrKeywordWithNumbersContext {
		return this.getTypedRuleContext(IdentifierOrKeywordWithNumbersContext, i) as IdentifierOrKeywordWithNumbersContext;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
	public ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN, 0);
	}
	public NIEUWE(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIEUWE, 0);
	}
	public MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET, 0);
	}
	public NIET(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIET, 0);
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
	}
	public DAGEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAGEN, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_naamPhraseWithNumbers;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterNaamPhraseWithNumbers) {
	 		listener.enterNaamPhraseWithNumbers(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitNaamPhraseWithNumbers) {
	 		listener.exitNaamPhraseWithNumbers(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitNaamPhraseWithNumbers) {
			return visitor.visitNaamPhraseWithNumbers(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierOrKeywordWithNumbersContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierOrKeyword(): IdentifierOrKeywordContext {
		return this.getTypedRuleContext(IdentifierOrKeywordContext, 0) as IdentifierOrKeywordContext;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_identifierOrKeywordWithNumbers;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterIdentifierOrKeywordWithNumbers) {
	 		listener.enterIdentifierOrKeywordWithNumbers(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitIdentifierOrKeywordWithNumbers) {
	 		listener.exitIdentifierOrKeywordWithNumbers(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitIdentifierOrKeywordWithNumbers) {
			return visitor.visitIdentifierOrKeywordWithNumbers(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NaamPhraseNoIsContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierOrKeywordNoIs_list(): IdentifierOrKeywordNoIsContext[] {
		return this.getTypedRuleContexts(IdentifierOrKeywordNoIsContext) as IdentifierOrKeywordNoIsContext[];
	}
	public identifierOrKeywordNoIs(i: number): IdentifierOrKeywordNoIsContext {
		return this.getTypedRuleContext(IdentifierOrKeywordNoIsContext, i) as IdentifierOrKeywordNoIsContext;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
	public ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN, 0);
	}
	public NIEUWE(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIEUWE, 0);
	}
	public MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET, 0);
	}
	public NIET(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIET, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_naamPhraseNoIs;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterNaamPhraseNoIs) {
	 		listener.enterNaamPhraseNoIs(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitNaamPhraseNoIs) {
	 		listener.exitNaamPhraseNoIs(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitNaamPhraseNoIs) {
			return visitor.visitNaamPhraseNoIs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NaamwoordContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamPhrase_list(): NaamPhraseContext[] {
		return this.getTypedRuleContexts(NaamPhraseContext) as NaamPhraseContext[];
	}
	public naamPhrase(i: number): NaamPhraseContext {
		return this.getTypedRuleContext(NaamPhraseContext, i) as NaamPhraseContext;
	}
	public voorzetsel_list(): VoorzetselContext[] {
		return this.getTypedRuleContexts(VoorzetselContext) as VoorzetselContext[];
	}
	public voorzetsel(i: number): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, i) as VoorzetselContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_naamwoord;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterNaamwoord) {
	 		listener.enterNaamwoord(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitNaamwoord) {
	 		listener.exitNaamwoord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitNaamwoord) {
			return visitor.visitNaamwoord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NaamwoordWithNumbersContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamPhraseWithNumbers_list(): NaamPhraseWithNumbersContext[] {
		return this.getTypedRuleContexts(NaamPhraseWithNumbersContext) as NaamPhraseWithNumbersContext[];
	}
	public naamPhraseWithNumbers(i: number): NaamPhraseWithNumbersContext {
		return this.getTypedRuleContext(NaamPhraseWithNumbersContext, i) as NaamPhraseWithNumbersContext;
	}
	public voorzetsel_list(): VoorzetselContext[] {
		return this.getTypedRuleContexts(VoorzetselContext) as VoorzetselContext[];
	}
	public voorzetsel(i: number): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, i) as VoorzetselContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_naamwoordWithNumbers;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterNaamwoordWithNumbers) {
	 		listener.enterNaamwoordWithNumbers(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitNaamwoordWithNumbers) {
	 		listener.exitNaamwoordWithNumbers(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitNaamwoordWithNumbers) {
			return visitor.visitNaamwoordWithNumbers(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NaamwoordNoIsContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamPhraseNoIs_list(): NaamPhraseNoIsContext[] {
		return this.getTypedRuleContexts(NaamPhraseNoIsContext) as NaamPhraseNoIsContext[];
	}
	public naamPhraseNoIs(i: number): NaamPhraseNoIsContext {
		return this.getTypedRuleContext(NaamPhraseNoIsContext, i) as NaamPhraseNoIsContext;
	}
	public voorzetsel_list(): VoorzetselContext[] {
		return this.getTypedRuleContexts(VoorzetselContext) as VoorzetselContext[];
	}
	public voorzetsel(i: number): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, i) as VoorzetselContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_naamwoordNoIs;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterNaamwoordNoIs) {
	 		listener.enterNaamwoordNoIs(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitNaamwoordNoIs) {
	 		listener.exitNaamwoordNoIs(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitNaamwoordNoIs) {
			return visitor.visitNaamwoordNoIs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VoorzetselContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN, 0);
	}
	public VOOR(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOOR, 0);
	}
	public OVER(): TerminalNode {
		return this.getToken(RegelSpraakParser.OVER, 0);
	}
	public OP(): TerminalNode {
		return this.getToken(RegelSpraakParser.OP, 0);
	}
	public BIJ(): TerminalNode {
		return this.getToken(RegelSpraakParser.BIJ, 0);
	}
	public UIT(): TerminalNode {
		return this.getToken(RegelSpraakParser.UIT, 0);
	}
	public TOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT, 0);
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET, 0);
	}
	public OF(): TerminalNode {
		return this.getToken(RegelSpraakParser.OF, 0);
	}
	public TOT_EN_MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT_EN_MET, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_voorzetsel;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVoorzetsel) {
	 		listener.enterVoorzetsel(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVoorzetsel) {
	 		listener.exitVoorzetsel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVoorzetsel) {
			return visitor.visitVoorzetsel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DatumLiteralContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DATE_TIME_LITERAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.DATE_TIME_LITERAL, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_datumLiteral;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDatumLiteral) {
	 		listener.enterDatumLiteral(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDatumLiteral) {
	 		listener.exitDatumLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDatumLiteral) {
			return visitor.visitDatumLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnitContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_unit;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnit) {
	 		listener.enterUnit(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnit) {
	 		listener.exitUnit(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnit) {
			return visitor.visitUnit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TimeUnitContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DAG(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAG, 0);
	}
	public DAGEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAGEN, 0);
	}
	public MAAND(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAAND, 0);
	}
	public MAANDEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAANDEN, 0);
	}
	public JAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.JAAR, 0);
	}
	public JAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.JAREN, 0);
	}
	public WEEK(): TerminalNode {
		return this.getToken(RegelSpraakParser.WEEK, 0);
	}
	public WEKEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.WEKEN, 0);
	}
	public UUR(): TerminalNode {
		return this.getToken(RegelSpraakParser.UUR, 0);
	}
	public UREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.UREN, 0);
	}
	public MINUUT(): TerminalNode {
		return this.getToken(RegelSpraakParser.MINUUT, 0);
	}
	public MINUTEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MINUTEN, 0);
	}
	public SECONDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.SECONDE, 0);
	}
	public SECONDEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.SECONDEN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_timeUnit;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTimeUnit) {
	 		listener.enterTimeUnit(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTimeUnit) {
	 		listener.exitTimeUnit(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTimeUnit) {
			return visitor.visitTimeUnit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectTypeDefinitionContext extends ParserRuleContext {
	public _IDENTIFIER!: Token;
	public _plural: Token[] = [];
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OBJECTTYPE(): TerminalNode {
		return this.getToken(RegelSpraakParser.OBJECTTYPE, 0);
	}
	public naamwoordNoIs(): NaamwoordNoIsContext {
		return this.getTypedRuleContext(NaamwoordNoIsContext, 0) as NaamwoordNoIsContext;
	}
	public MV_START(): TerminalNode {
		return this.getToken(RegelSpraakParser.MV_START, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
	public BEZIELD(): TerminalNode {
		return this.getToken(RegelSpraakParser.BEZIELD, 0);
	}
	public objectTypeMember_list(): ObjectTypeMemberContext[] {
		return this.getTypedRuleContexts(ObjectTypeMemberContext) as ObjectTypeMemberContext[];
	}
	public objectTypeMember(i: number): ObjectTypeMemberContext {
		return this.getTypedRuleContext(ObjectTypeMemberContext, i) as ObjectTypeMemberContext;
	}
	public IDENTIFIER_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.IDENTIFIER);
	}
	public IDENTIFIER(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, i);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_objectTypeDefinition;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterObjectTypeDefinition) {
	 		listener.enterObjectTypeDefinition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitObjectTypeDefinition) {
	 		listener.exitObjectTypeDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitObjectTypeDefinition) {
			return visitor.visitObjectTypeDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectTypeMemberContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.SEMICOLON, 0);
	}
	public kenmerkSpecificatie(): KenmerkSpecificatieContext {
		return this.getTypedRuleContext(KenmerkSpecificatieContext, 0) as KenmerkSpecificatieContext;
	}
	public attribuutSpecificatie(): AttribuutSpecificatieContext {
		return this.getTypedRuleContext(AttribuutSpecificatieContext, 0) as AttribuutSpecificatieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_objectTypeMember;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterObjectTypeMember) {
	 		listener.enterObjectTypeMember(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitObjectTypeMember) {
	 		listener.exitObjectTypeMember(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitObjectTypeMember) {
			return visitor.visitObjectTypeMember(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class KenmerkSpecificatieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public KENMERK(): TerminalNode {
		return this.getToken(RegelSpraakParser.KENMERK, 0);
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		return this.getTypedRuleContext(NaamwoordWithNumbersContext, 0) as NaamwoordWithNumbersContext;
	}
	public tijdlijn(): TijdlijnContext {
		return this.getTypedRuleContext(TijdlijnContext, 0) as TijdlijnContext;
	}
	public BIJVOEGLIJK(): TerminalNode {
		return this.getToken(RegelSpraakParser.BIJVOEGLIJK, 0);
	}
	public BEZITTELIJK(): TerminalNode {
		return this.getToken(RegelSpraakParser.BEZITTELIJK, 0);
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_kenmerkSpecificatie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterKenmerkSpecificatie) {
	 		listener.enterKenmerkSpecificatie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitKenmerkSpecificatie) {
	 		listener.exitKenmerkSpecificatie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitKenmerkSpecificatie) {
			return visitor.visitKenmerkSpecificatie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AttribuutSpecificatieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		return this.getTypedRuleContext(NaamwoordWithNumbersContext, 0) as NaamwoordWithNumbersContext;
	}
	public datatype(): DatatypeContext {
		return this.getTypedRuleContext(DatatypeContext, 0) as DatatypeContext;
	}
	public domeinRef(): DomeinRefContext {
		return this.getTypedRuleContext(DomeinRefContext, 0) as DomeinRefContext;
	}
	public objectTypeRef(): ObjectTypeRefContext {
		return this.getTypedRuleContext(ObjectTypeRefContext, 0) as ObjectTypeRefContext;
	}
	public MET_EENHEID(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET_EENHEID, 0);
	}
	public unitIdentifier(): UnitIdentifierContext {
		return this.getTypedRuleContext(UnitIdentifierContext, 0) as UnitIdentifierContext;
	}
	public GEDIMENSIONEERD_MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.GEDIMENSIONEERD_MET, 0);
	}
	public dimensieRef_list(): DimensieRefContext[] {
		return this.getTypedRuleContexts(DimensieRefContext) as DimensieRefContext[];
	}
	public dimensieRef(i: number): DimensieRefContext {
		return this.getTypedRuleContext(DimensieRefContext, i) as DimensieRefContext;
	}
	public tijdlijn(): TijdlijnContext {
		return this.getTypedRuleContext(TijdlijnContext, 0) as TijdlijnContext;
	}
	public EN_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.EN);
	}
	public EN(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, i);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_attribuutSpecificatie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAttribuutSpecificatie) {
	 		listener.enterAttribuutSpecificatie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAttribuutSpecificatie) {
	 		listener.exitAttribuutSpecificatie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAttribuutSpecificatie) {
			return visitor.visitAttribuutSpecificatie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DatatypeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public numeriekDatatype(): NumeriekDatatypeContext {
		return this.getTypedRuleContext(NumeriekDatatypeContext, 0) as NumeriekDatatypeContext;
	}
	public tekstDatatype(): TekstDatatypeContext {
		return this.getTypedRuleContext(TekstDatatypeContext, 0) as TekstDatatypeContext;
	}
	public booleanDatatype(): BooleanDatatypeContext {
		return this.getTypedRuleContext(BooleanDatatypeContext, 0) as BooleanDatatypeContext;
	}
	public datumTijdDatatype(): DatumTijdDatatypeContext {
		return this.getTypedRuleContext(DatumTijdDatatypeContext, 0) as DatumTijdDatatypeContext;
	}
	public lijstDatatype(): LijstDatatypeContext {
		return this.getTypedRuleContext(LijstDatatypeContext, 0) as LijstDatatypeContext;
	}
	public percentageDatatype(): PercentageDatatypeContext {
		return this.getTypedRuleContext(PercentageDatatypeContext, 0) as PercentageDatatypeContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_datatype;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDatatype) {
	 		listener.enterDatatype(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDatatype) {
	 		listener.exitDatatype(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDatatype) {
			return visitor.visitDatatype(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LijstDatatypeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public LIJST(): TerminalNode {
		return this.getToken(RegelSpraakParser.LIJST, 0);
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public datatype(): DatatypeContext {
		return this.getTypedRuleContext(DatatypeContext, 0) as DatatypeContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_lijstDatatype;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterLijstDatatype) {
	 		listener.enterLijstDatatype(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitLijstDatatype) {
	 		listener.exitLijstDatatype(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitLijstDatatype) {
			return visitor.visitLijstDatatype(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NumeriekDatatypeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMERIEK(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMERIEK, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.LPAREN, 0);
	}
	public getalSpecificatie(): GetalSpecificatieContext {
		return this.getTypedRuleContext(GetalSpecificatieContext, 0) as GetalSpecificatieContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_numeriekDatatype;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterNumeriekDatatype) {
	 		listener.enterNumeriekDatatype(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitNumeriekDatatype) {
	 		listener.exitNumeriekDatatype(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitNumeriekDatatype) {
			return visitor.visitNumeriekDatatype(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TekstDatatypeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TEKST(): TerminalNode {
		return this.getToken(RegelSpraakParser.TEKST, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_tekstDatatype;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTekstDatatype) {
	 		listener.enterTekstDatatype(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTekstDatatype) {
	 		listener.exitTekstDatatype(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTekstDatatype) {
			return visitor.visitTekstDatatype(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PercentageDatatypeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PERCENTAGE(): TerminalNode {
		return this.getToken(RegelSpraakParser.PERCENTAGE, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.LPAREN, 0);
	}
	public getalSpecificatie(): GetalSpecificatieContext {
		return this.getTypedRuleContext(GetalSpecificatieContext, 0) as GetalSpecificatieContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_percentageDatatype;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPercentageDatatype) {
	 		listener.enterPercentageDatatype(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPercentageDatatype) {
	 		listener.exitPercentageDatatype(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPercentageDatatype) {
			return visitor.visitPercentageDatatype(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BooleanDatatypeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public BOOLEAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.BOOLEAN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_booleanDatatype;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBooleanDatatype) {
	 		listener.enterBooleanDatatype(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBooleanDatatype) {
	 		listener.exitBooleanDatatype(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBooleanDatatype) {
			return visitor.visitBooleanDatatype(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DatumTijdDatatypeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DATUM_IN_DAGEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DATUM_IN_DAGEN, 0);
	}
	public DATUM_TIJD_MILLIS(): TerminalNode {
		return this.getToken(RegelSpraakParser.DATUM_TIJD_MILLIS, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_datumTijdDatatype;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDatumTijdDatatype) {
	 		listener.enterDatumTijdDatatype(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDatumTijdDatatype) {
	 		listener.exitDatumTijdDatatype(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDatumTijdDatatype) {
			return visitor.visitDatumTijdDatatype(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GetalSpecificatieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GEHEEL_GETAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.GEHEEL_GETAL, 0);
	}
	public GETAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.GETAL, 0);
	}
	public NEGATIEF(): TerminalNode {
		return this.getToken(RegelSpraakParser.NEGATIEF, 0);
	}
	public NIET_NEGATIEF(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIET_NEGATIEF, 0);
	}
	public POSITIEF(): TerminalNode {
		return this.getToken(RegelSpraakParser.POSITIEF, 0);
	}
	public MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET, 0);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public DECIMALEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DECIMALEN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_getalSpecificatie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterGetalSpecificatie) {
	 		listener.enterGetalSpecificatie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitGetalSpecificatie) {
	 		listener.exitGetalSpecificatie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitGetalSpecificatie) {
			return visitor.visitGetalSpecificatie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DomeinDefinitionContext extends ParserRuleContext {
	public _name!: Token;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DOMEIN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOMEIN, 0);
	}
	public IS_VAN_HET_TYPE(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_VAN_HET_TYPE, 0);
	}
	public domeinType(): DomeinTypeContext {
		return this.getTypedRuleContext(DomeinTypeContext, 0) as DomeinTypeContext;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
	public MET_EENHEID(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET_EENHEID, 0);
	}
	public eenheidExpressie(): EenheidExpressieContext {
		return this.getTypedRuleContext(EenheidExpressieContext, 0) as EenheidExpressieContext;
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.SEMICOLON, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_domeinDefinition;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDomeinDefinition) {
	 		listener.enterDomeinDefinition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDomeinDefinition) {
	 		listener.exitDomeinDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDomeinDefinition) {
			return visitor.visitDomeinDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DomeinTypeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public enumeratieSpecificatie(): EnumeratieSpecificatieContext {
		return this.getTypedRuleContext(EnumeratieSpecificatieContext, 0) as EnumeratieSpecificatieContext;
	}
	public numeriekDatatype(): NumeriekDatatypeContext {
		return this.getTypedRuleContext(NumeriekDatatypeContext, 0) as NumeriekDatatypeContext;
	}
	public tekstDatatype(): TekstDatatypeContext {
		return this.getTypedRuleContext(TekstDatatypeContext, 0) as TekstDatatypeContext;
	}
	public booleanDatatype(): BooleanDatatypeContext {
		return this.getTypedRuleContext(BooleanDatatypeContext, 0) as BooleanDatatypeContext;
	}
	public datumTijdDatatype(): DatumTijdDatatypeContext {
		return this.getTypedRuleContext(DatumTijdDatatypeContext, 0) as DatumTijdDatatypeContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_domeinType;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDomeinType) {
	 		listener.enterDomeinType(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDomeinType) {
	 		listener.exitDomeinType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDomeinType) {
			return visitor.visitDomeinType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumeratieSpecificatieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ENUMERATIE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ENUMERATIE, 0);
	}
	public ENUM_LITERAL_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.ENUM_LITERAL);
	}
	public ENUM_LITERAL(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.ENUM_LITERAL, i);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_enumeratieSpecificatie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterEnumeratieSpecificatie) {
	 		listener.enterEnumeratieSpecificatie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitEnumeratieSpecificatie) {
	 		listener.exitEnumeratieSpecificatie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitEnumeratieSpecificatie) {
			return visitor.visitEnumeratieSpecificatie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DomeinRefContext extends ParserRuleContext {
	public _name!: Token;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_domeinRef;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDomeinRef) {
	 		listener.enterDomeinRef(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDomeinRef) {
	 		listener.exitDomeinRef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDomeinRef) {
			return visitor.visitDomeinRef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectTypeRefContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_objectTypeRef;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterObjectTypeRef) {
	 		listener.enterObjectTypeRef(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitObjectTypeRef) {
	 		listener.exitObjectTypeRef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitObjectTypeRef) {
			return visitor.visitObjectTypeRef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EenheidsysteemDefinitionContext extends ParserRuleContext {
	public _name!: IdentifierContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EENHEIDSYSTEEM(): TerminalNode {
		return this.getToken(RegelSpraakParser.EENHEIDSYSTEEM, 0);
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public eenheidEntry_list(): EenheidEntryContext[] {
		return this.getTypedRuleContexts(EenheidEntryContext) as EenheidEntryContext[];
	}
	public eenheidEntry(i: number): EenheidEntryContext {
		return this.getTypedRuleContext(EenheidEntryContext, i) as EenheidEntryContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_eenheidsysteemDefinition;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterEenheidsysteemDefinition) {
	 		listener.enterEenheidsysteemDefinition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitEenheidsysteemDefinition) {
	 		listener.exitEenheidsysteemDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitEenheidsysteemDefinition) {
			return visitor.visitEenheidsysteemDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EenheidEntryContext extends ParserRuleContext {
	public _unitName!: UnitIdentifierContext;
	public _pluralName!: UnitIdentifierContext;
	public _abbrev!: UnitIdentifierContext;
	public _symbol_!: UnitIdentifierContext;
	public _value!: Token;
	public _targetUnit!: UnitIdentifierContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public unitIdentifier_list(): UnitIdentifierContext[] {
		return this.getTypedRuleContexts(UnitIdentifierContext) as UnitIdentifierContext[];
	}
	public unitIdentifier(i: number): UnitIdentifierContext {
		return this.getTypedRuleContext(UnitIdentifierContext, i) as UnitIdentifierContext;
	}
	public MV_START(): TerminalNode {
		return this.getToken(RegelSpraakParser.MV_START, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
	public EQUALS(): TerminalNode {
		return this.getToken(RegelSpraakParser.EQUALS, 0);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public SLASH(): TerminalNode {
		return this.getToken(RegelSpraakParser.SLASH, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_eenheidEntry;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterEenheidEntry) {
	 		listener.enterEenheidEntry(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitEenheidEntry) {
	 		listener.exitEenheidEntry(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitEenheidEntry) {
			return visitor.visitEenheidEntry(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnitIdentifierContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
	public METER(): TerminalNode {
		return this.getToken(RegelSpraakParser.METER, 0);
	}
	public KILOGRAM(): TerminalNode {
		return this.getToken(RegelSpraakParser.KILOGRAM, 0);
	}
	public SECONDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.SECONDE, 0);
	}
	public MINUUT(): TerminalNode {
		return this.getToken(RegelSpraakParser.MINUUT, 0);
	}
	public MINUTEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MINUTEN, 0);
	}
	public UUR(): TerminalNode {
		return this.getToken(RegelSpraakParser.UUR, 0);
	}
	public UREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.UREN, 0);
	}
	public VOET(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOET, 0);
	}
	public POND(): TerminalNode {
		return this.getToken(RegelSpraakParser.POND, 0);
	}
	public MIJL(): TerminalNode {
		return this.getToken(RegelSpraakParser.MIJL, 0);
	}
	public M(): TerminalNode {
		return this.getToken(RegelSpraakParser.M, 0);
	}
	public KG(): TerminalNode {
		return this.getToken(RegelSpraakParser.KG, 0);
	}
	public S(): TerminalNode {
		return this.getToken(RegelSpraakParser.S, 0);
	}
	public FT(): TerminalNode {
		return this.getToken(RegelSpraakParser.FT, 0);
	}
	public LB(): TerminalNode {
		return this.getToken(RegelSpraakParser.LB, 0);
	}
	public MIN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MIN, 0);
	}
	public MI(): TerminalNode {
		return this.getToken(RegelSpraakParser.MI, 0);
	}
	public EURO_SYMBOL(): TerminalNode {
		return this.getToken(RegelSpraakParser.EURO_SYMBOL, 0);
	}
	public DOLLAR_SYMBOL(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOLLAR_SYMBOL, 0);
	}
	public DEGREE_SYMBOL(): TerminalNode {
		return this.getToken(RegelSpraakParser.DEGREE_SYMBOL, 0);
	}
	public DAG(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAG, 0);
	}
	public DAGEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAGEN, 0);
	}
	public MAAND(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAAND, 0);
	}
	public MAANDEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAANDEN, 0);
	}
	public JAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.JAAR, 0);
	}
	public JAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.JAREN, 0);
	}
	public WEEK(): TerminalNode {
		return this.getToken(RegelSpraakParser.WEEK, 0);
	}
	public WEKEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.WEKEN, 0);
	}
	public SECONDEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.SECONDEN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_unitIdentifier;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnitIdentifier) {
	 		listener.enterUnitIdentifier(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnitIdentifier) {
	 		listener.exitUnitIdentifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnitIdentifier) {
			return visitor.visitUnitIdentifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EenheidExpressieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public eenheidMacht_list(): EenheidMachtContext[] {
		return this.getTypedRuleContexts(EenheidMachtContext) as EenheidMachtContext[];
	}
	public eenheidMacht(i: number): EenheidMachtContext {
		return this.getTypedRuleContext(EenheidMachtContext, i) as EenheidMachtContext;
	}
	public SLASH(): TerminalNode {
		return this.getToken(RegelSpraakParser.SLASH, 0);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public PERCENT_SIGN(): TerminalNode {
		return this.getToken(RegelSpraakParser.PERCENT_SIGN, 0);
	}
	public EURO_SYMBOL(): TerminalNode {
		return this.getToken(RegelSpraakParser.EURO_SYMBOL, 0);
	}
	public DOLLAR_SYMBOL(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOLLAR_SYMBOL, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_eenheidExpressie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterEenheidExpressie) {
	 		listener.enterEenheidExpressie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitEenheidExpressie) {
	 		listener.exitEenheidExpressie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitEenheidExpressie) {
			return visitor.visitEenheidExpressie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EenheidMachtContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public unitIdentifier(): UnitIdentifierContext {
		return this.getTypedRuleContext(UnitIdentifierContext, 0) as UnitIdentifierContext;
	}
	public CARET(): TerminalNode {
		return this.getToken(RegelSpraakParser.CARET, 0);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_eenheidMacht;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterEenheidMacht) {
	 		listener.enterEenheidMacht(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitEenheidMacht) {
	 		listener.exitEenheidMacht(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitEenheidMacht) {
			return visitor.visitEenheidMacht(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DimensieDefinitionContext extends ParserRuleContext {
	public _dimensieNaamMeervoud!: NaamwoordContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DIMENSIE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DIMENSIE, 0);
	}
	public naamwoord_list(): NaamwoordContext[] {
		return this.getTypedRuleContexts(NaamwoordContext) as NaamwoordContext[];
	}
	public naamwoord(i: number): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, i) as NaamwoordContext;
	}
	public BESTAANDE_UIT(): TerminalNode {
		return this.getToken(RegelSpraakParser.BESTAANDE_UIT, 0);
	}
	public voorzetselSpecificatie(): VoorzetselSpecificatieContext {
		return this.getTypedRuleContext(VoorzetselSpecificatieContext, 0) as VoorzetselSpecificatieContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, 0);
	}
	public labelWaardeSpecificatie_list(): LabelWaardeSpecificatieContext[] {
		return this.getTypedRuleContexts(LabelWaardeSpecificatieContext) as LabelWaardeSpecificatieContext[];
	}
	public labelWaardeSpecificatie(i: number): LabelWaardeSpecificatieContext {
		return this.getTypedRuleContext(LabelWaardeSpecificatieContext, i) as LabelWaardeSpecificatieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_dimensieDefinition;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDimensieDefinition) {
	 		listener.enterDimensieDefinition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDimensieDefinition) {
	 		listener.exitDimensieDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDimensieDefinition) {
			return visitor.visitDimensieDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VoorzetselSpecificatieContext extends ParserRuleContext {
	public _vz!: VoorzetselContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NA_HET_ATTRIBUUT_MET_VOORZETSEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.NA_HET_ATTRIBUUT_MET_VOORZETSEL, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
	public voorzetsel(): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, 0) as VoorzetselContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.COLON, 0);
	}
	public VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_voorzetselSpecificatie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVoorzetselSpecificatie) {
	 		listener.enterVoorzetselSpecificatie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVoorzetselSpecificatie) {
	 		listener.exitVoorzetselSpecificatie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVoorzetselSpecificatie) {
			return visitor.visitVoorzetselSpecificatie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LabelWaardeSpecificatieContext extends ParserRuleContext {
	public _dimWaarde!: NaamwoordContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public DOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOT, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_labelWaardeSpecificatie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterLabelWaardeSpecificatie) {
	 		listener.enterLabelWaardeSpecificatie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitLabelWaardeSpecificatie) {
	 		listener.exitLabelWaardeSpecificatie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitLabelWaardeSpecificatie) {
			return visitor.visitLabelWaardeSpecificatie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TijdlijnContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VOOR_ELKE_DAG(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOOR_ELKE_DAG, 0);
	}
	public VOOR_ELKE_MAAND(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOOR_ELKE_MAAND, 0);
	}
	public VOOR_ELK_JAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOOR_ELK_JAAR, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_tijdlijn;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTijdlijn) {
	 		listener.enterTijdlijn(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTijdlijn) {
	 		listener.exitTijdlijn(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTijdlijn) {
			return visitor.visitTijdlijn(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DimensieRefContext extends ParserRuleContext {
	public _name!: Token;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_dimensieRef;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDimensieRef) {
	 		listener.enterDimensieRef(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDimensieRef) {
	 		listener.exitDimensieRef(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDimensieRef) {
			return visitor.visitDimensieRef(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterDefinitionContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PARAMETER(): TerminalNode {
		return this.getToken(RegelSpraakParser.PARAMETER, 0);
	}
	public parameterNamePhrase(): ParameterNamePhraseContext {
		return this.getTypedRuleContext(ParameterNamePhraseContext, 0) as ParameterNamePhraseContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.COLON, 0);
	}
	public datatype(): DatatypeContext {
		return this.getTypedRuleContext(DatatypeContext, 0) as DatatypeContext;
	}
	public domeinRef(): DomeinRefContext {
		return this.getTypedRuleContext(DomeinRefContext, 0) as DomeinRefContext;
	}
	public MET_EENHEID(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET_EENHEID, 0);
	}
	public eenheidExpressie(): EenheidExpressieContext {
		return this.getTypedRuleContext(EenheidExpressieContext, 0) as EenheidExpressieContext;
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public tijdlijn(): TijdlijnContext {
		return this.getTypedRuleContext(TijdlijnContext, 0) as TijdlijnContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_parameterDefinition;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterParameterDefinition) {
	 		listener.enterParameterDefinition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitParameterDefinition) {
	 		listener.exitParameterDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitParameterDefinition) {
			return visitor.visitParameterDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterNamePhraseContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public parameterNamePart_list(): ParameterNamePartContext[] {
		return this.getTypedRuleContexts(ParameterNamePartContext) as ParameterNamePartContext[];
	}
	public parameterNamePart(i: number): ParameterNamePartContext {
		return this.getTypedRuleContext(ParameterNamePartContext, i) as ParameterNamePartContext;
	}
	public voorzetsel_list(): VoorzetselContext[] {
		return this.getTypedRuleContexts(VoorzetselContext) as VoorzetselContext[];
	}
	public voorzetsel(i: number): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, i) as VoorzetselContext;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_parameterNamePhrase;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterParameterNamePhrase) {
	 		listener.enterParameterNamePhrase(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitParameterNamePhrase) {
	 		listener.exitParameterNamePhrase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitParameterNamePhrase) {
			return visitor.visitParameterNamePhrase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterNamePartContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IDENTIFIER_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.IDENTIFIER);
	}
	public IDENTIFIER(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, i);
	}
	public AANTAL_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.AANTAL);
	}
	public AANTAL(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, i);
	}
	public NUMBER_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.NUMBER);
	}
	public NUMBER(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, i);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_parameterNamePart;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterParameterNamePart) {
	 		listener.enterParameterNamePart(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitParameterNamePart) {
	 		listener.exitParameterNamePart(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitParameterNamePart) {
			return visitor.visitParameterNamePart(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterMetLidwoordContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public parameterNamePart_list(): ParameterNamePartContext[] {
		return this.getTypedRuleContexts(ParameterNamePartContext) as ParameterNamePartContext[];
	}
	public parameterNamePart(i: number): ParameterNamePartContext {
		return this.getTypedRuleContext(ParameterNamePartContext, i) as ParameterNamePartContext;
	}
	public voorzetsel_list(): VoorzetselContext[] {
		return this.getTypedRuleContexts(VoorzetselContext) as VoorzetselContext[];
	}
	public voorzetsel(i: number): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, i) as VoorzetselContext;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_parameterMetLidwoord;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterParameterMetLidwoord) {
	 		listener.enterParameterMetLidwoord(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitParameterMetLidwoord) {
	 		listener.exitParameterMetLidwoord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitParameterMetLidwoord) {
			return visitor.visitParameterMetLidwoord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FeitTypeDefinitionContext extends ParserRuleContext {
	public _feittypenaam!: NaamwoordContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public FEITTYPE(): TerminalNode {
		return this.getToken(RegelSpraakParser.FEITTYPE, 0);
	}
	public rolDefinition_list(): RolDefinitionContext[] {
		return this.getTypedRuleContexts(RolDefinitionContext) as RolDefinitionContext[];
	}
	public rolDefinition(i: number): RolDefinitionContext {
		return this.getTypedRuleContext(RolDefinitionContext, i) as RolDefinitionContext;
	}
	public cardinalityLine(): CardinalityLineContext {
		return this.getTypedRuleContext(CardinalityLineContext, 0) as CardinalityLineContext;
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public WEDERKERIG_FEITTYPE(): TerminalNode {
		return this.getToken(RegelSpraakParser.WEDERKERIG_FEITTYPE, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_feitTypeDefinition;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterFeitTypeDefinition) {
	 		listener.enterFeitTypeDefinition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitFeitTypeDefinition) {
	 		listener.exitFeitTypeDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitFeitTypeDefinition) {
			return visitor.visitFeitTypeDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RolDefinitionContext extends ParserRuleContext {
	public _article!: Token;
	public _content!: RolContentWordsContext;
	public _meervoud!: NaamwoordContext;
	public _objecttype!: RolObjectTypeContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public rolContentWords(): RolContentWordsContext {
		return this.getTypedRuleContext(RolContentWordsContext, 0) as RolContentWordsContext;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public MV_START(): TerminalNode {
		return this.getToken(RegelSpraakParser.MV_START, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public rolObjectType(): RolObjectTypeContext {
		return this.getTypedRuleContext(RolObjectTypeContext, 0) as RolObjectTypeContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_rolDefinition;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRolDefinition) {
	 		listener.enterRolDefinition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRolDefinition) {
	 		listener.exitRolDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRolDefinition) {
			return visitor.visitRolDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RolObjectTypeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierOrKeyword_list(): IdentifierOrKeywordContext[] {
		return this.getTypedRuleContexts(IdentifierOrKeywordContext) as IdentifierOrKeywordContext[];
	}
	public identifierOrKeyword(i: number): IdentifierOrKeywordContext {
		return this.getTypedRuleContext(IdentifierOrKeywordContext, i) as IdentifierOrKeywordContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_rolObjectType;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRolObjectType) {
	 		listener.enterRolObjectType(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRolObjectType) {
	 		listener.exitRolObjectType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRolObjectType) {
			return visitor.visitRolObjectType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RolContentWordsContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierOrKeyword_list(): IdentifierOrKeywordContext[] {
		return this.getTypedRuleContexts(IdentifierOrKeywordContext) as IdentifierOrKeywordContext[];
	}
	public identifierOrKeyword(i: number): IdentifierOrKeywordContext {
		return this.getTypedRuleContext(IdentifierOrKeywordContext, i) as IdentifierOrKeywordContext;
	}
	public voorzetsel_list(): VoorzetselContext[] {
		return this.getTypedRuleContexts(VoorzetselContext) as VoorzetselContext[];
	}
	public voorzetsel(i: number): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, i) as VoorzetselContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_rolContentWords;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRolContentWords) {
	 		listener.enterRolContentWords(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRolContentWords) {
	 		listener.exitRolContentWords(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRolContentWords) {
			return visitor.visitRolContentWords(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CardinalityLineContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public cardinalityWord_list(): CardinalityWordContext[] {
		return this.getTypedRuleContexts(CardinalityWordContext) as CardinalityWordContext[];
	}
	public cardinalityWord(i: number): CardinalityWordContext {
		return this.getTypedRuleContext(CardinalityWordContext, i) as CardinalityWordContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_cardinalityLine;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterCardinalityLine) {
	 		listener.enterCardinalityLine(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitCardinalityLine) {
	 		listener.exitCardinalityLine(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitCardinalityLine) {
			return visitor.visitCardinalityLine(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CardinalityWordContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OBJECTTYPE(): TerminalNode {
		return this.getToken(RegelSpraakParser.OBJECTTYPE, 0);
	}
	public PARAMETER(): TerminalNode {
		return this.getToken(RegelSpraakParser.PARAMETER, 0);
	}
	public REGEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.REGEL, 0);
	}
	public FEITTYPE(): TerminalNode {
		return this.getToken(RegelSpraakParser.FEITTYPE, 0);
	}
	public WEDERKERIG_FEITTYPE(): TerminalNode {
		return this.getToken(RegelSpraakParser.WEDERKERIG_FEITTYPE, 0);
	}
	public DIMENSIE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DIMENSIE, 0);
	}
	public DOMEIN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOMEIN, 0);
	}
	public BESLISTABEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.BESLISTABEL, 0);
	}
	public CONSISTENTIEREGEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.CONSISTENTIEREGEL, 0);
	}
	public EENHEIDSYSTEEM(): TerminalNode {
		return this.getToken(RegelSpraakParser.EENHEIDSYSTEEM, 0);
	}
	public DAGSOORT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAGSOORT, 0);
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.SEMICOLON, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_cardinalityWord;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterCardinalityWord) {
	 		listener.enterCardinalityWord(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitCardinalityWord) {
	 		listener.exitCardinalityWord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitCardinalityWord) {
			return visitor.visitCardinalityWord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RegelContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public REGEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.REGEL, 0);
	}
	public regelName(): RegelNameContext {
		return this.getTypedRuleContext(RegelNameContext, 0) as RegelNameContext;
	}
	public regelVersie(): RegelVersieContext {
		return this.getTypedRuleContext(RegelVersieContext, 0) as RegelVersieContext;
	}
	public resultaatDeel(): ResultaatDeelContext {
		return this.getTypedRuleContext(ResultaatDeelContext, 0) as ResultaatDeelContext;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public voorwaardeDeel(): VoorwaardeDeelContext {
		return this.getTypedRuleContext(VoorwaardeDeelContext, 0) as VoorwaardeDeelContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOT, 0);
	}
	public variabeleDeel(): VariabeleDeelContext {
		return this.getTypedRuleContext(VariabeleDeelContext, 0) as VariabeleDeelContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_regel;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRegel) {
	 		listener.enterRegel(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRegel) {
	 		listener.exitRegel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRegel) {
			return visitor.visitRegel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RegelGroepContext extends ParserRuleContext {
	public _isRecursive!: Token;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public REGELGROEP(): TerminalNode {
		return this.getToken(RegelSpraakParser.REGELGROEP, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public regel_list(): RegelContext[] {
		return this.getTypedRuleContexts(RegelContext) as RegelContext[];
	}
	public regel(i: number): RegelContext {
		return this.getTypedRuleContext(RegelContext, i) as RegelContext;
	}
	public consistentieregel_list(): ConsistentieregelContext[] {
		return this.getTypedRuleContexts(ConsistentieregelContext) as ConsistentieregelContext[];
	}
	public consistentieregel(i: number): ConsistentieregelContext {
		return this.getTypedRuleContext(ConsistentieregelContext, i) as ConsistentieregelContext;
	}
	public IS_RECURSIEF(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_RECURSIEF, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_regelGroep;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRegelGroep) {
	 		listener.enterRegelGroep(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRegelGroep) {
	 		listener.exitRegelGroep(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRegelGroep) {
			return visitor.visitRegelGroep(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RegelNameContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		return this.getTypedRuleContext(NaamwoordWithNumbersContext, 0) as NaamwoordWithNumbersContext;
	}
	public regelNameExtension_list(): RegelNameExtensionContext[] {
		return this.getTypedRuleContexts(RegelNameExtensionContext) as RegelNameExtensionContext[];
	}
	public regelNameExtension(i: number): RegelNameExtensionContext {
		return this.getTypedRuleContext(RegelNameExtensionContext, i) as RegelNameExtensionContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_regelName;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRegelName) {
	 		listener.enterRegelName(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRegelName) {
	 		listener.exitRegelName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRegelName) {
			return visitor.visitRegelName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RegelNameExtensionContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IN_GELIJKE_DELEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN_GELIJKE_DELEN, 0);
	}
	public COMMA(): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, 0);
	}
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		return this.getTypedRuleContext(NaamwoordWithNumbersContext, 0) as NaamwoordWithNumbersContext;
	}
	public MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET, 0);
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public GEEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GEEN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_regelNameExtension;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRegelNameExtension) {
	 		listener.enterRegelNameExtension(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRegelNameExtension) {
	 		listener.exitRegelNameExtension(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRegelNameExtension) {
			return visitor.visitRegelNameExtension(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RegelVersieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GELDIG(): TerminalNode {
		return this.getToken(RegelSpraakParser.GELDIG, 0);
	}
	public versieGeldigheid(): VersieGeldigheidContext {
		return this.getTypedRuleContext(VersieGeldigheidContext, 0) as VersieGeldigheidContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_regelVersie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRegelVersie) {
	 		listener.enterRegelVersie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRegelVersie) {
	 		listener.exitRegelVersie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRegelVersie) {
			return visitor.visitRegelVersie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VersieGeldigheidContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALTIJD(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALTIJD, 0);
	}
	public VANAF(): TerminalNode {
		return this.getToken(RegelSpraakParser.VANAF, 0);
	}
	public datumLiteral_list(): DatumLiteralContext[] {
		return this.getTypedRuleContexts(DatumLiteralContext) as DatumLiteralContext[];
	}
	public datumLiteral(i: number): DatumLiteralContext {
		return this.getTypedRuleContext(DatumLiteralContext, i) as DatumLiteralContext;
	}
	public TM(): TerminalNode {
		return this.getToken(RegelSpraakParser.TM, 0);
	}
	public TOT_EN_MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT_EN_MET, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_versieGeldigheid;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVersieGeldigheid) {
	 		listener.enterVersieGeldigheid(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVersieGeldigheid) {
	 		listener.exitVersieGeldigheid(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVersieGeldigheid) {
			return visitor.visitVersieGeldigheid(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ResultaatDeelContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_resultaatDeel;
	}
	public copyFrom(ctx: ResultaatDeelContext): void {
		super.copyFrom(ctx);
	}
}
export class GelijkstellingResultaatContext extends ResultaatDeelContext {
	constructor(parser: RegelSpraakParser, ctx: ResultaatDeelContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
	}
	public WORDT_BEREKEND_ALS(): TerminalNode {
		return this.getToken(RegelSpraakParser.WORDT_BEREKEND_ALS, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public WORDT_GESTELD_OP(): TerminalNode {
		return this.getToken(RegelSpraakParser.WORDT_GESTELD_OP, 0);
	}
	public WORDT_GEINITIALISEERD_OP(): TerminalNode {
		return this.getToken(RegelSpraakParser.WORDT_GEINITIALISEERD_OP, 0);
	}
	public periodeDefinitie(): PeriodeDefinitieContext {
		return this.getTypedRuleContext(PeriodeDefinitieContext, 0) as PeriodeDefinitieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterGelijkstellingResultaat) {
	 		listener.enterGelijkstellingResultaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitGelijkstellingResultaat) {
	 		listener.exitGelijkstellingResultaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitGelijkstellingResultaat) {
			return visitor.visitGelijkstellingResultaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RelationshipWithAttributeResultaatContext extends ResultaatDeelContext {
	constructor(parser: RegelSpraakParser, ctx: ResultaatDeelContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public HEEFT(): TerminalNode {
		return this.getToken(RegelSpraakParser.HEEFT, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET, 0);
	}
	public attribuutMetLidwoord(): AttribuutMetLidwoordContext {
		return this.getTypedRuleContext(AttribuutMetLidwoordContext, 0) as AttribuutMetLidwoordContext;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GELIJK_AAN, 0);
	}
	public IS_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GELIJK_AAN, 0);
	}
	public GELIJK_IS_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GELIJK_IS_AAN, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRelationshipWithAttributeResultaat) {
	 		listener.enterRelationshipWithAttributeResultaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRelationshipWithAttributeResultaat) {
	 		listener.exitRelationshipWithAttributeResultaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRelationshipWithAttributeResultaat) {
			return visitor.visitRelationshipWithAttributeResultaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ConsistencyCheckResultaatContext extends ResultaatDeelContext {
	constructor(parser: RegelSpraakParser, ctx: ResultaatDeelContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
	}
	public MOET(): TerminalNode {
		return this.getToken(RegelSpraakParser.MOET, 0);
	}
	public consistencyOperator(): ConsistencyOperatorContext {
		return this.getTypedRuleContext(ConsistencyOperatorContext, 0) as ConsistencyOperatorContext;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterConsistencyCheckResultaat) {
	 		listener.enterConsistencyCheckResultaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitConsistencyCheckResultaat) {
	 		listener.exitConsistencyCheckResultaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitConsistencyCheckResultaat) {
			return visitor.visitConsistencyCheckResultaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VerdelingContext extends ResultaatDeelContext {
	constructor(parser: RegelSpraakParser, ctx: ResultaatDeelContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public verdelingResultaat(): VerdelingResultaatContext {
		return this.getTypedRuleContext(VerdelingResultaatContext, 0) as VerdelingResultaatContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdeling) {
	 		listener.enterVerdeling(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdeling) {
	 		listener.exitVerdeling(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdeling) {
			return visitor.visitVerdeling(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ObjectCreatieResultaatContext extends ResultaatDeelContext {
	constructor(parser: RegelSpraakParser, ctx: ResultaatDeelContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public objectCreatie(): ObjectCreatieContext {
		return this.getTypedRuleContext(ObjectCreatieContext, 0) as ObjectCreatieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterObjectCreatieResultaat) {
	 		listener.enterObjectCreatieResultaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitObjectCreatieResultaat) {
	 		listener.exitObjectCreatieResultaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitObjectCreatieResultaat) {
			return visitor.visitObjectCreatieResultaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DagsoortdefinitieResultaatContext extends ResultaatDeelContext {
	constructor(parser: RegelSpraakParser, ctx: ResultaatDeelContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public EEN_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.EEN);
	}
	public EEN(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, i);
	}
	public DAG(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAG, 0);
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDagsoortdefinitieResultaat) {
	 		listener.enterDagsoortdefinitieResultaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDagsoortdefinitieResultaat) {
	 		listener.exitDagsoortdefinitieResultaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDagsoortdefinitieResultaat) {
			return visitor.visitDagsoortdefinitieResultaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class KenmerkFeitResultaatContext extends ResultaatDeelContext {
	constructor(parser: RegelSpraakParser, ctx: ResultaatDeelContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public kenmerkNaam(): KenmerkNaamContext {
		return this.getTypedRuleContext(KenmerkNaamContext, 0) as KenmerkNaamContext;
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public HEEFT(): TerminalNode {
		return this.getToken(RegelSpraakParser.HEEFT, 0);
	}
	public periodeDefinitie(): PeriodeDefinitieContext {
		return this.getTypedRuleContext(PeriodeDefinitieContext, 0) as PeriodeDefinitieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterKenmerkFeitResultaat) {
	 		listener.enterKenmerkFeitResultaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitKenmerkFeitResultaat) {
	 		listener.exitKenmerkFeitResultaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitKenmerkFeitResultaat) {
			return visitor.visitKenmerkFeitResultaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class FeitCreatieResultaatContext extends ResultaatDeelContext {
	constructor(parser: RegelSpraakParser, ctx: ResultaatDeelContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public feitCreatiePattern(): FeitCreatiePatternContext {
		return this.getTypedRuleContext(FeitCreatiePatternContext, 0) as FeitCreatiePatternContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterFeitCreatieResultaat) {
	 		listener.enterFeitCreatieResultaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitFeitCreatieResultaat) {
	 		listener.exitFeitCreatieResultaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitFeitCreatieResultaat) {
			return visitor.visitFeitCreatieResultaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConsistencyOperatorContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ONGELIJK_ZIJN_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ONGELIJK_ZIJN_AAN, 0);
	}
	public ONGELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ONGELIJK_AAN, 0);
	}
	public IS_ONGELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_ONGELIJK_AAN, 0);
	}
	public GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GELIJK_AAN, 0);
	}
	public IS_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GELIJK_AAN, 0);
	}
	public GROTER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GROTER_DAN, 0);
	}
	public IS_GROTER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GROTER_DAN, 0);
	}
	public KLEINER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.KLEINER_DAN, 0);
	}
	public IS_KLEINER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_KLEINER_DAN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_consistencyOperator;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterConsistencyOperator) {
	 		listener.enterConsistencyOperator(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitConsistencyOperator) {
	 		listener.exitConsistencyOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitConsistencyOperator) {
			return visitor.visitConsistencyOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FeitCreatiePatternContext extends ParserRuleContext {
	public _role1!: FeitCreatieRolPhraseContext;
	public _subject1!: FeitCreatieSubjectPhraseContext;
	public _article2!: Token;
	public _role2!: FeitCreatieRolPhraseContext;
	public _article3!: Token;
	public _subject2!: FeitCreatieSubjectPhraseContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EEN_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.EEN);
	}
	public EEN(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, i);
	}
	public VAN_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.VAN);
	}
	public VAN(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, i);
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public feitCreatieRolPhrase_list(): FeitCreatieRolPhraseContext[] {
		return this.getTypedRuleContexts(FeitCreatieRolPhraseContext) as FeitCreatieRolPhraseContext[];
	}
	public feitCreatieRolPhrase(i: number): FeitCreatieRolPhraseContext {
		return this.getTypedRuleContext(FeitCreatieRolPhraseContext, i) as FeitCreatieRolPhraseContext;
	}
	public feitCreatieSubjectPhrase_list(): FeitCreatieSubjectPhraseContext[] {
		return this.getTypedRuleContexts(FeitCreatieSubjectPhraseContext) as FeitCreatieSubjectPhraseContext[];
	}
	public feitCreatieSubjectPhrase(i: number): FeitCreatieSubjectPhraseContext {
		return this.getTypedRuleContext(FeitCreatieSubjectPhraseContext, i) as FeitCreatieSubjectPhraseContext;
	}
	public DE_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.DE);
	}
	public DE(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, i);
	}
	public HET_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.HET);
	}
	public HET(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, i);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_feitCreatiePattern;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterFeitCreatiePattern) {
	 		listener.enterFeitCreatiePattern(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitFeitCreatiePattern) {
	 		listener.exitFeitCreatiePattern(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitFeitCreatiePattern) {
			return visitor.visitFeitCreatiePattern(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FeitCreatieRolPhraseContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public feitCreatieWord_list(): FeitCreatieWordContext[] {
		return this.getTypedRuleContexts(FeitCreatieWordContext) as FeitCreatieWordContext[];
	}
	public feitCreatieWord(i: number): FeitCreatieWordContext {
		return this.getTypedRuleContext(FeitCreatieWordContext, i) as FeitCreatieWordContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_feitCreatieRolPhrase;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterFeitCreatieRolPhrase) {
	 		listener.enterFeitCreatieRolPhrase(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitFeitCreatieRolPhrase) {
	 		listener.exitFeitCreatieRolPhrase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitFeitCreatieRolPhrase) {
			return visitor.visitFeitCreatieRolPhrase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FeitCreatieSubjectPhraseContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public feitCreatieSubjectWord_list(): FeitCreatieSubjectWordContext[] {
		return this.getTypedRuleContexts(FeitCreatieSubjectWordContext) as FeitCreatieSubjectWordContext[];
	}
	public feitCreatieSubjectWord(i: number): FeitCreatieSubjectWordContext {
		return this.getTypedRuleContext(FeitCreatieSubjectWordContext, i) as FeitCreatieSubjectWordContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_feitCreatieSubjectPhrase;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterFeitCreatieSubjectPhrase) {
	 		listener.enterFeitCreatieSubjectPhrase(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitFeitCreatieSubjectPhrase) {
	 		listener.exitFeitCreatieSubjectPhrase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitFeitCreatieSubjectPhrase) {
			return visitor.visitFeitCreatieSubjectPhrase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FeitCreatieSubjectWordContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierOrKeyword(): IdentifierOrKeywordContext {
		return this.getTypedRuleContext(IdentifierOrKeywordContext, 0) as IdentifierOrKeywordContext;
	}
	public voorzetsel(): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, 0) as VoorzetselContext;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_feitCreatieSubjectWord;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterFeitCreatieSubjectWord) {
	 		listener.enterFeitCreatieSubjectWord(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitFeitCreatieSubjectWord) {
	 		listener.exitFeitCreatieSubjectWord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitFeitCreatieSubjectWord) {
			return visitor.visitFeitCreatieSubjectWord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FeitCreatieWordContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public identifierOrKeyword(): IdentifierOrKeywordContext {
		return this.getTypedRuleContext(IdentifierOrKeywordContext, 0) as IdentifierOrKeywordContext;
	}
	public voorzetselNietVan(): VoorzetselNietVanContext {
		return this.getTypedRuleContext(VoorzetselNietVanContext, 0) as VoorzetselNietVanContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_feitCreatieWord;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterFeitCreatieWord) {
	 		listener.enterFeitCreatieWord(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitFeitCreatieWord) {
	 		listener.exitFeitCreatieWord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitFeitCreatieWord) {
			return visitor.visitFeitCreatieWord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VoorzetselNietVanContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN, 0);
	}
	public VOOR(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOOR, 0);
	}
	public OVER(): TerminalNode {
		return this.getToken(RegelSpraakParser.OVER, 0);
	}
	public OP(): TerminalNode {
		return this.getToken(RegelSpraakParser.OP, 0);
	}
	public BIJ(): TerminalNode {
		return this.getToken(RegelSpraakParser.BIJ, 0);
	}
	public UIT(): TerminalNode {
		return this.getToken(RegelSpraakParser.UIT, 0);
	}
	public TOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT, 0);
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_voorzetselNietVan;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVoorzetselNietVan) {
	 		listener.enterVoorzetselNietVan(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVoorzetselNietVan) {
	 		listener.exitVoorzetselNietVan(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVoorzetselNietVan) {
			return visitor.visitVoorzetselNietVan(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectCreatieContext extends ParserRuleContext {
	public _objectType!: NaamwoordContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ER_WORDT_EEN_NIEUW(): TerminalNode {
		return this.getToken(RegelSpraakParser.ER_WORDT_EEN_NIEUW, 0);
	}
	public AANGEMAAKT(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANGEMAAKT, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public objectAttributeInit(): ObjectAttributeInitContext {
		return this.getTypedRuleContext(ObjectAttributeInitContext, 0) as ObjectAttributeInitContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOT, 0);
	}
	public CREEER(): TerminalNode {
		return this.getToken(RegelSpraakParser.CREEER, 0);
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
	public NIEUWE(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIEUWE, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_objectCreatie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterObjectCreatie) {
	 		listener.enterObjectCreatie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitObjectCreatie) {
	 		listener.exitObjectCreatie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitObjectCreatie) {
			return visitor.visitObjectCreatie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectAttributeInitContext extends ParserRuleContext {
	public _attribuut!: SimpleNaamwoordContext;
	public _waarde!: ExpressieContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET, 0);
	}
	public GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GELIJK_AAN, 0);
	}
	public simpleNaamwoord(): SimpleNaamwoordContext {
		return this.getTypedRuleContext(SimpleNaamwoordContext, 0) as SimpleNaamwoordContext;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public attributeInitVervolg_list(): AttributeInitVervolgContext[] {
		return this.getTypedRuleContexts(AttributeInitVervolgContext) as AttributeInitVervolgContext[];
	}
	public attributeInitVervolg(i: number): AttributeInitVervolgContext {
		return this.getTypedRuleContext(AttributeInitVervolgContext, i) as AttributeInitVervolgContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_objectAttributeInit;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterObjectAttributeInit) {
	 		listener.enterObjectAttributeInit(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitObjectAttributeInit) {
	 		listener.exitObjectAttributeInit(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitObjectAttributeInit) {
			return visitor.visitObjectAttributeInit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AttributeInitVervolgContext extends ParserRuleContext {
	public _attribuut!: SimpleNaamwoordContext;
	public _waarde!: ExpressieContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GELIJK_AAN, 0);
	}
	public simpleNaamwoord(): SimpleNaamwoordContext {
		return this.getTypedRuleContext(SimpleNaamwoordContext, 0) as SimpleNaamwoordContext;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_attributeInitVervolg;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAttributeInitVervolg) {
	 		listener.enterAttributeInitVervolg(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAttributeInitVervolg) {
	 		listener.exitAttributeInitVervolg(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAttributeInitVervolg) {
			return visitor.visitAttributeInitVervolg(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SimpleNaamwoordContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamPhrase(): NaamPhraseContext {
		return this.getTypedRuleContext(NaamPhraseContext, 0) as NaamPhraseContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_simpleNaamwoord;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSimpleNaamwoord) {
	 		listener.enterSimpleNaamwoord(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSimpleNaamwoord) {
	 		listener.exitSimpleNaamwoord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSimpleNaamwoord) {
			return visitor.visitSimpleNaamwoord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConsistentieregelContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public CONSISTENTIEREGEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.CONSISTENTIEREGEL, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public uniekzijnResultaat(): UniekzijnResultaatContext {
		return this.getTypedRuleContext(UniekzijnResultaatContext, 0) as UniekzijnResultaatContext;
	}
	public inconsistentResultaat(): InconsistentResultaatContext {
		return this.getTypedRuleContext(InconsistentResultaatContext, 0) as InconsistentResultaatContext;
	}
	public voorwaardeDeel(): VoorwaardeDeelContext {
		return this.getTypedRuleContext(VoorwaardeDeelContext, 0) as VoorwaardeDeelContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOT, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_consistentieregel;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterConsistentieregel) {
	 		listener.enterConsistentieregel(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitConsistentieregel) {
	 		listener.exitConsistentieregel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitConsistentieregel) {
			return visitor.visitConsistentieregel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UniekzijnResultaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public alleAttributenVanObjecttype(): AlleAttributenVanObjecttypeContext {
		return this.getTypedRuleContext(AlleAttributenVanObjecttypeContext, 0) as AlleAttributenVanObjecttypeContext;
	}
	public MOETEN_UNIEK_ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MOETEN_UNIEK_ZIJN, 0);
	}
	public DOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOT, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_uniekzijnResultaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUniekzijnResultaat) {
	 		listener.enterUniekzijnResultaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUniekzijnResultaat) {
	 		listener.exitUniekzijnResultaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUniekzijnResultaat) {
			return visitor.visitUniekzijnResultaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AlleAttributenVanObjecttypeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public naamwoord_list(): NaamwoordContext[] {
		return this.getTypedRuleContexts(NaamwoordContext) as NaamwoordContext[];
	}
	public naamwoord(i: number): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, i) as NaamwoordContext;
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_alleAttributenVanObjecttype;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAlleAttributenVanObjecttype) {
	 		listener.enterAlleAttributenVanObjecttype(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAlleAttributenVanObjecttype) {
	 		listener.exitAlleAttributenVanObjecttype(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAlleAttributenVanObjecttype) {
			return visitor.visitAlleAttributenVanObjecttype(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InconsistentResultaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public IS_INCONSISTENT(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_INCONSISTENT, 0);
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public ER(): TerminalNode {
		return this.getToken(RegelSpraakParser.ER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_inconsistentResultaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterInconsistentResultaat) {
	 		listener.enterInconsistentResultaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitInconsistentResultaat) {
	 		listener.exitInconsistentResultaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitInconsistentResultaat) {
			return visitor.visitInconsistentResultaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VoorwaardeDeelContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public INDIEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.INDIEN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public toplevelSamengesteldeVoorwaarde(): ToplevelSamengesteldeVoorwaardeContext {
		return this.getTypedRuleContext(ToplevelSamengesteldeVoorwaardeContext, 0) as ToplevelSamengesteldeVoorwaardeContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_voorwaardeDeel;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVoorwaardeDeel) {
	 		listener.enterVoorwaardeDeel(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVoorwaardeDeel) {
	 		listener.exitVoorwaardeDeel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVoorwaardeDeel) {
			return visitor.visitVoorwaardeDeel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ToplevelSamengesteldeVoorwaardeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ER_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ER_AAN, 0);
	}
	public voorwaardeKwantificatie(): VoorwaardeKwantificatieContext {
		return this.getTypedRuleContext(VoorwaardeKwantificatieContext, 0) as VoorwaardeKwantificatieContext;
	}
	public WORDT_VOLDAAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.WORDT_VOLDAAN, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.COLON, 0);
	}
	public VOLGENDE_VOORWAARDEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLGENDE_VOORWAARDEN, 0);
	}
	public VOLGENDE_VOORWAARDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLGENDE_VOORWAARDE, 0);
	}
	public samengesteldeVoorwaardeOnderdeel_list(): SamengesteldeVoorwaardeOnderdeelContext[] {
		return this.getTypedRuleContexts(SamengesteldeVoorwaardeOnderdeelContext) as SamengesteldeVoorwaardeOnderdeelContext[];
	}
	public samengesteldeVoorwaardeOnderdeel(i: number): SamengesteldeVoorwaardeOnderdeelContext {
		return this.getTypedRuleContext(SamengesteldeVoorwaardeOnderdeelContext, i) as SamengesteldeVoorwaardeOnderdeelContext;
	}
	public AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.AAN, 0);
	}
	public VOLDOET(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDOET, 0);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public HIJ(): TerminalNode {
		return this.getToken(RegelSpraakParser.HIJ, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public ER(): TerminalNode {
		return this.getToken(RegelSpraakParser.ER, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_toplevelSamengesteldeVoorwaarde;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterToplevelSamengesteldeVoorwaarde) {
	 		listener.enterToplevelSamengesteldeVoorwaarde(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitToplevelSamengesteldeVoorwaarde) {
	 		listener.exitToplevelSamengesteldeVoorwaarde(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitToplevelSamengesteldeVoorwaarde) {
			return visitor.visitToplevelSamengesteldeVoorwaarde(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VoorwaardeKwantificatieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
	public GEEN_VAN_DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.GEEN_VAN_DE, 0);
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public TEN_MINSTE(): TerminalNode {
		return this.getToken(RegelSpraakParser.TEN_MINSTE, 0);
	}
	public TENMINSTE(): TerminalNode {
		return this.getToken(RegelSpraakParser.TENMINSTE, 0);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
	public EEN_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN_TELWOORD, 0);
	}
	public TWEE_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.TWEE_TELWOORD, 0);
	}
	public DRIE_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.DRIE_TELWOORD, 0);
	}
	public VIER_TELWOORD(): TerminalNode {
		return this.getToken(RegelSpraakParser.VIER_TELWOORD, 0);
	}
	public TEN_HOOGSTE(): TerminalNode {
		return this.getToken(RegelSpraakParser.TEN_HOOGSTE, 0);
	}
	public PRECIES(): TerminalNode {
		return this.getToken(RegelSpraakParser.PRECIES, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_voorwaardeKwantificatie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVoorwaardeKwantificatie) {
	 		listener.enterVoorwaardeKwantificatie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVoorwaardeKwantificatie) {
	 		listener.exitVoorwaardeKwantificatie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVoorwaardeKwantificatie) {
			return visitor.visitVoorwaardeKwantificatie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SamengesteldeVoorwaardeOnderdeelContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public bulletPrefix(): BulletPrefixContext {
		return this.getTypedRuleContext(BulletPrefixContext, 0) as BulletPrefixContext;
	}
	public elementaireVoorwaarde(): ElementaireVoorwaardeContext {
		return this.getTypedRuleContext(ElementaireVoorwaardeContext, 0) as ElementaireVoorwaardeContext;
	}
	public genesteSamengesteldeVoorwaarde(): GenesteSamengesteldeVoorwaardeContext {
		return this.getTypedRuleContext(GenesteSamengesteldeVoorwaardeContext, 0) as GenesteSamengesteldeVoorwaardeContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_samengesteldeVoorwaardeOnderdeel;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSamengesteldeVoorwaardeOnderdeel) {
	 		listener.enterSamengesteldeVoorwaardeOnderdeel(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSamengesteldeVoorwaardeOnderdeel) {
	 		listener.exitSamengesteldeVoorwaardeOnderdeel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSamengesteldeVoorwaardeOnderdeel) {
			return visitor.visitSamengesteldeVoorwaardeOnderdeel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BulletPrefixContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MINUS_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.MINUS);
	}
	public MINUS(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.MINUS, i);
	}
	public DOUBLE_DOT_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.DOUBLE_DOT);
	}
	public DOUBLE_DOT(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.DOUBLE_DOT, i);
	}
	public BULLET_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.BULLET);
	}
	public BULLET(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.BULLET, i);
	}
	public ASTERISK_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.ASTERISK);
	}
	public ASTERISK(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.ASTERISK, i);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_bulletPrefix;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBulletPrefix) {
	 		listener.enterBulletPrefix(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBulletPrefix) {
	 		listener.exitBulletPrefix(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBulletPrefix) {
			return visitor.visitBulletPrefix(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementaireVoorwaardeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_elementaireVoorwaarde;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterElementaireVoorwaarde) {
	 		listener.enterElementaireVoorwaarde(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitElementaireVoorwaarde) {
	 		listener.exitElementaireVoorwaarde(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitElementaireVoorwaarde) {
			return visitor.visitElementaireVoorwaarde(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenesteSamengesteldeVoorwaardeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VOLDOET(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDOET, 0);
	}
	public AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.AAN, 0);
	}
	public voorwaardeKwantificatie(): VoorwaardeKwantificatieContext {
		return this.getTypedRuleContext(VoorwaardeKwantificatieContext, 0) as VoorwaardeKwantificatieContext;
	}
	public COLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.COLON, 0);
	}
	public VOLGENDE_VOORWAARDEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLGENDE_VOORWAARDEN, 0);
	}
	public VOLGENDE_VOORWAARDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLGENDE_VOORWAARDE, 0);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public HIJ(): TerminalNode {
		return this.getToken(RegelSpraakParser.HIJ, 0);
	}
	public ER(): TerminalNode {
		return this.getToken(RegelSpraakParser.ER, 0);
	}
	public samengesteldeVoorwaardeOnderdeel_list(): SamengesteldeVoorwaardeOnderdeelContext[] {
		return this.getTypedRuleContexts(SamengesteldeVoorwaardeOnderdeelContext) as SamengesteldeVoorwaardeOnderdeelContext[];
	}
	public samengesteldeVoorwaardeOnderdeel(i: number): SamengesteldeVoorwaardeOnderdeelContext {
		return this.getTypedRuleContext(SamengesteldeVoorwaardeOnderdeelContext, i) as SamengesteldeVoorwaardeOnderdeelContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_genesteSamengesteldeVoorwaarde;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterGenesteSamengesteldeVoorwaarde) {
	 		listener.enterGenesteSamengesteldeVoorwaarde(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitGenesteSamengesteldeVoorwaarde) {
	 		listener.exitGenesteSamengesteldeVoorwaarde(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitGenesteSamengesteldeVoorwaarde) {
			return visitor.visitGenesteSamengesteldeVoorwaarde(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OnderwerpReferentieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public onderwerpBasis(): OnderwerpBasisContext {
		return this.getTypedRuleContext(OnderwerpBasisContext, 0) as OnderwerpBasisContext;
	}
	public predicaat(): PredicaatContext {
		return this.getTypedRuleContext(PredicaatContext, 0) as PredicaatContext;
	}
	public DIE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DIE, 0);
	}
	public DAT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAT, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_onderwerpReferentie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterOnderwerpReferentie) {
	 		listener.enterOnderwerpReferentie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitOnderwerpReferentie) {
	 		listener.exitOnderwerpReferentie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitOnderwerpReferentie) {
			return visitor.visitOnderwerpReferentie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OnderwerpReferentieWithNumbersContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public onderwerpBasisWithNumbers(): OnderwerpBasisWithNumbersContext {
		return this.getTypedRuleContext(OnderwerpBasisWithNumbersContext, 0) as OnderwerpBasisWithNumbersContext;
	}
	public predicaat(): PredicaatContext {
		return this.getTypedRuleContext(PredicaatContext, 0) as PredicaatContext;
	}
	public DIE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DIE, 0);
	}
	public DAT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAT, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_onderwerpReferentieWithNumbers;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterOnderwerpReferentieWithNumbers) {
	 		listener.enterOnderwerpReferentieWithNumbers(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitOnderwerpReferentieWithNumbers) {
	 		listener.exitOnderwerpReferentieWithNumbers(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitOnderwerpReferentieWithNumbers) {
			return visitor.visitOnderwerpReferentieWithNumbers(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OnderwerpBasisContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public basisOnderwerp_list(): BasisOnderwerpContext[] {
		return this.getTypedRuleContexts(BasisOnderwerpContext) as BasisOnderwerpContext[];
	}
	public basisOnderwerp(i: number): BasisOnderwerpContext {
		return this.getTypedRuleContext(BasisOnderwerpContext, i) as BasisOnderwerpContext;
	}
	public voorzetsel_list(): VoorzetselContext[] {
		return this.getTypedRuleContexts(VoorzetselContext) as VoorzetselContext[];
	}
	public voorzetsel(i: number): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, i) as VoorzetselContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_onderwerpBasis;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterOnderwerpBasis) {
	 		listener.enterOnderwerpBasis(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitOnderwerpBasis) {
	 		listener.exitOnderwerpBasis(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitOnderwerpBasis) {
			return visitor.visitOnderwerpBasis(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OnderwerpBasisWithNumbersContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public basisOnderwerpWithNumbers_list(): BasisOnderwerpWithNumbersContext[] {
		return this.getTypedRuleContexts(BasisOnderwerpWithNumbersContext) as BasisOnderwerpWithNumbersContext[];
	}
	public basisOnderwerpWithNumbers(i: number): BasisOnderwerpWithNumbersContext {
		return this.getTypedRuleContext(BasisOnderwerpWithNumbersContext, i) as BasisOnderwerpWithNumbersContext;
	}
	public voorzetsel_list(): VoorzetselContext[] {
		return this.getTypedRuleContexts(VoorzetselContext) as VoorzetselContext[];
	}
	public voorzetsel(i: number): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, i) as VoorzetselContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_onderwerpBasisWithNumbers;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterOnderwerpBasisWithNumbers) {
	 		listener.enterOnderwerpBasisWithNumbers(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitOnderwerpBasisWithNumbers) {
	 		listener.exitOnderwerpBasisWithNumbers(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitOnderwerpBasisWithNumbers) {
			return visitor.visitOnderwerpBasisWithNumbers(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BasisOnderwerpContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
	public ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN, 0);
	}
	public identifierOrKeyword_list(): IdentifierOrKeywordContext[] {
		return this.getTypedRuleContexts(IdentifierOrKeywordContext) as IdentifierOrKeywordContext[];
	}
	public identifierOrKeyword(i: number): IdentifierOrKeywordContext {
		return this.getTypedRuleContext(IdentifierOrKeywordContext, i) as IdentifierOrKeywordContext;
	}
	public HIJ(): TerminalNode {
		return this.getToken(RegelSpraakParser.HIJ, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_basisOnderwerp;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBasisOnderwerp) {
	 		listener.enterBasisOnderwerp(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBasisOnderwerp) {
	 		listener.exitBasisOnderwerp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBasisOnderwerp) {
			return visitor.visitBasisOnderwerp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BasisOnderwerpWithNumbersContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
	public ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN, 0);
	}
	public identifierOrKeywordWithNumbers_list(): IdentifierOrKeywordWithNumbersContext[] {
		return this.getTypedRuleContexts(IdentifierOrKeywordWithNumbersContext) as IdentifierOrKeywordWithNumbersContext[];
	}
	public identifierOrKeywordWithNumbers(i: number): IdentifierOrKeywordWithNumbersContext {
		return this.getTypedRuleContext(IdentifierOrKeywordWithNumbersContext, i) as IdentifierOrKeywordWithNumbersContext;
	}
	public HIJ(): TerminalNode {
		return this.getToken(RegelSpraakParser.HIJ, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_basisOnderwerpWithNumbers;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBasisOnderwerpWithNumbers) {
	 		listener.enterBasisOnderwerpWithNumbers(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBasisOnderwerpWithNumbers) {
	 		listener.exitBasisOnderwerpWithNumbers(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBasisOnderwerpWithNumbers) {
			return visitor.visitBasisOnderwerpWithNumbers(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AttribuutReferentieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public attribuutMetLidwoord(): AttribuutMetLidwoordContext {
		return this.getTypedRuleContext(AttribuutMetLidwoordContext, 0) as AttribuutMetLidwoordContext;
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_attribuutReferentie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAttribuutReferentie) {
	 		listener.enterAttribuutReferentie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAttribuutReferentie) {
	 		listener.exitAttribuutReferentie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAttribuutReferentie) {
			return visitor.visitAttribuutReferentie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AttribuutMetLidwoordContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamwoordNoIs(): NaamwoordNoIsContext {
		return this.getTypedRuleContext(NaamwoordNoIsContext, 0) as NaamwoordNoIsContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_attribuutMetLidwoord;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAttribuutMetLidwoord) {
	 		listener.enterAttribuutMetLidwoord(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAttribuutMetLidwoord) {
	 		listener.exitAttribuutMetLidwoord(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAttribuutMetLidwoord) {
			return visitor.visitAttribuutMetLidwoord(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class KenmerkNaamContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		return this.getTypedRuleContext(NaamwoordWithNumbersContext, 0) as NaamwoordWithNumbersContext;
	}
	public voorzetsel(): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, 0) as VoorzetselContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_kenmerkNaam;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterKenmerkNaam) {
	 		listener.enterKenmerkNaam(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitKenmerkNaam) {
	 		listener.exitKenmerkNaam(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitKenmerkNaam) {
			return visitor.visitKenmerkNaam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class KenmerkPhraseContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public voorzetsel(): VoorzetselContext {
		return this.getTypedRuleContext(VoorzetselContext, 0) as VoorzetselContext;
	}
	public identifierOrKeywordWithNumbers_list(): IdentifierOrKeywordWithNumbersContext[] {
		return this.getTypedRuleContexts(IdentifierOrKeywordWithNumbersContext) as IdentifierOrKeywordWithNumbersContext[];
	}
	public identifierOrKeywordWithNumbers(i: number): IdentifierOrKeywordWithNumbersContext {
		return this.getTypedRuleContext(IdentifierOrKeywordWithNumbersContext, i) as IdentifierOrKeywordWithNumbersContext;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_kenmerkPhrase;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterKenmerkPhrase) {
	 		listener.enterKenmerkPhrase(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitKenmerkPhrase) {
	 		listener.exitKenmerkPhrase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitKenmerkPhrase) {
			return visitor.visitKenmerkPhrase(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BezieldeReferentieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_bezieldeReferentie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBezieldeReferentie) {
	 		listener.enterBezieldeReferentie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBezieldeReferentie) {
	 		listener.exitBezieldeReferentie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBezieldeReferentie) {
			return visitor.visitBezieldeReferentie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public elementairPredicaat(): ElementairPredicaatContext {
		return this.getTypedRuleContext(ElementairPredicaatContext, 0) as ElementairPredicaatContext;
	}
	public samengesteldPredicaat(): SamengesteldPredicaatContext {
		return this.getTypedRuleContext(SamengesteldPredicaatContext, 0) as SamengesteldPredicaatContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_predicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPredicaat) {
	 		listener.enterPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPredicaat) {
	 		listener.exitPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPredicaat) {
			return visitor.visitPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementairPredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public attribuutVergelijkingsPredicaat(): AttribuutVergelijkingsPredicaatContext {
		return this.getTypedRuleContext(AttribuutVergelijkingsPredicaatContext, 0) as AttribuutVergelijkingsPredicaatContext;
	}
	public objectPredicaat(): ObjectPredicaatContext {
		return this.getTypedRuleContext(ObjectPredicaatContext, 0) as ObjectPredicaatContext;
	}
	public getalPredicaat(): GetalPredicaatContext {
		return this.getTypedRuleContext(GetalPredicaatContext, 0) as GetalPredicaatContext;
	}
	public tekstPredicaat(): TekstPredicaatContext {
		return this.getTypedRuleContext(TekstPredicaatContext, 0) as TekstPredicaatContext;
	}
	public datumPredicaat(): DatumPredicaatContext {
		return this.getTypedRuleContext(DatumPredicaatContext, 0) as DatumPredicaatContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_elementairPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterElementairPredicaat) {
	 		listener.enterElementairPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitElementairPredicaat) {
	 		listener.exitElementairPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitElementairPredicaat) {
			return visitor.visitElementairPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectPredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public eenzijdigeObjectVergelijking(): EenzijdigeObjectVergelijkingContext {
		return this.getTypedRuleContext(EenzijdigeObjectVergelijkingContext, 0) as EenzijdigeObjectVergelijkingContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_objectPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterObjectPredicaat) {
	 		listener.enterObjectPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitObjectPredicaat) {
	 		listener.exitObjectPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitObjectPredicaat) {
			return visitor.visitObjectPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EenzijdigeObjectVergelijkingContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN, 0);
	}
	public HEBBEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.HEBBEN, 0);
	}
	public kenmerkNaam(): KenmerkNaamContext {
		return this.getTypedRuleContext(KenmerkNaamContext, 0) as KenmerkNaamContext;
	}
	public rolNaam(): RolNaamContext {
		return this.getTypedRuleContext(RolNaamContext, 0) as RolNaamContext;
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_eenzijdigeObjectVergelijking;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterEenzijdigeObjectVergelijking) {
	 		listener.enterEenzijdigeObjectVergelijking(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitEenzijdigeObjectVergelijking) {
	 		listener.exitEenzijdigeObjectVergelijking(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitEenzijdigeObjectVergelijking) {
			return visitor.visitEenzijdigeObjectVergelijking(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RolNaamContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_rolNaam;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRolNaam) {
	 		listener.enterRolNaam(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRolNaam) {
	 		listener.exitRolNaam(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRolNaam) {
			return visitor.visitRolNaam(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AttribuutVergelijkingsPredicaatContext extends ParserRuleContext {
	public _attribuutNaam!: NaamwoordContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public HEBBEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.HEBBEN, 0);
	}
	public comparisonOperator(): ComparisonOperatorContext {
		return this.getTypedRuleContext(ComparisonOperatorContext, 0) as ComparisonOperatorContext;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public EEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EEN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_attribuutVergelijkingsPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAttribuutVergelijkingsPredicaat) {
	 		listener.enterAttribuutVergelijkingsPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAttribuutVergelijkingsPredicaat) {
	 		listener.exitAttribuutVergelijkingsPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAttribuutVergelijkingsPredicaat) {
			return visitor.visitAttribuutVergelijkingsPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GetalPredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public getalVergelijkingsOperatorMeervoud(): GetalVergelijkingsOperatorMeervoudContext {
		return this.getTypedRuleContext(GetalVergelijkingsOperatorMeervoudContext, 0) as GetalVergelijkingsOperatorMeervoudContext;
	}
	public getalExpressie(): GetalExpressieContext {
		return this.getTypedRuleContext(GetalExpressieContext, 0) as GetalExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_getalPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterGetalPredicaat) {
	 		listener.enterGetalPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitGetalPredicaat) {
	 		listener.exitGetalPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitGetalPredicaat) {
			return visitor.visitGetalPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TekstPredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public tekstVergelijkingsOperatorMeervoud(): TekstVergelijkingsOperatorMeervoudContext {
		return this.getTypedRuleContext(TekstVergelijkingsOperatorMeervoudContext, 0) as TekstVergelijkingsOperatorMeervoudContext;
	}
	public tekstExpressie(): TekstExpressieContext {
		return this.getTypedRuleContext(TekstExpressieContext, 0) as TekstExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_tekstPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTekstPredicaat) {
	 		listener.enterTekstPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTekstPredicaat) {
	 		listener.exitTekstPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTekstPredicaat) {
			return visitor.visitTekstPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DatumPredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public datumVergelijkingsOperatorMeervoud(): DatumVergelijkingsOperatorMeervoudContext {
		return this.getTypedRuleContext(DatumVergelijkingsOperatorMeervoudContext, 0) as DatumVergelijkingsOperatorMeervoudContext;
	}
	public datumExpressie(): DatumExpressieContext {
		return this.getTypedRuleContext(DatumExpressieContext, 0) as DatumExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_datumPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDatumPredicaat) {
	 		listener.enterDatumPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDatumPredicaat) {
	 		listener.exitDatumPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDatumPredicaat) {
			return visitor.visitDatumPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SamengesteldPredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.AAN, 0);
	}
	public voorwaardeKwantificatie(): VoorwaardeKwantificatieContext {
		return this.getTypedRuleContext(VoorwaardeKwantificatieContext, 0) as VoorwaardeKwantificatieContext;
	}
	public VOLGENDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLGENDE, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.COLON, 0);
	}
	public VOORWAARDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOORWAARDE, 0);
	}
	public VOORWAARDEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOORWAARDEN, 0);
	}
	public VOLDOET(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDOET, 0);
	}
	public VOLDOEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDOEN, 0);
	}
	public samengesteldeVoorwaardeOnderdeelInPredicaat_list(): SamengesteldeVoorwaardeOnderdeelInPredicaatContext[] {
		return this.getTypedRuleContexts(SamengesteldeVoorwaardeOnderdeelInPredicaatContext) as SamengesteldeVoorwaardeOnderdeelInPredicaatContext[];
	}
	public samengesteldeVoorwaardeOnderdeelInPredicaat(i: number): SamengesteldeVoorwaardeOnderdeelInPredicaatContext {
		return this.getTypedRuleContext(SamengesteldeVoorwaardeOnderdeelInPredicaatContext, i) as SamengesteldeVoorwaardeOnderdeelInPredicaatContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_samengesteldPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSamengesteldPredicaat) {
	 		listener.enterSamengesteldPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSamengesteldPredicaat) {
	 		listener.exitSamengesteldPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSamengesteldPredicaat) {
			return visitor.visitSamengesteldPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SamengesteldeVoorwaardeOnderdeelInPredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public bulletPrefix(): BulletPrefixContext {
		return this.getTypedRuleContext(BulletPrefixContext, 0) as BulletPrefixContext;
	}
	public elementaireVoorwaardeInPredicaat(): ElementaireVoorwaardeInPredicaatContext {
		return this.getTypedRuleContext(ElementaireVoorwaardeInPredicaatContext, 0) as ElementaireVoorwaardeInPredicaatContext;
	}
	public genesteSamengesteldeVoorwaardeInPredicaat(): GenesteSamengesteldeVoorwaardeInPredicaatContext {
		return this.getTypedRuleContext(GenesteSamengesteldeVoorwaardeInPredicaatContext, 0) as GenesteSamengesteldeVoorwaardeInPredicaatContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_samengesteldeVoorwaardeOnderdeelInPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSamengesteldeVoorwaardeOnderdeelInPredicaat) {
	 		listener.enterSamengesteldeVoorwaardeOnderdeelInPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSamengesteldeVoorwaardeOnderdeelInPredicaat) {
	 		listener.exitSamengesteldeVoorwaardeOnderdeelInPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSamengesteldeVoorwaardeOnderdeelInPredicaat) {
			return visitor.visitSamengesteldeVoorwaardeOnderdeelInPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElementaireVoorwaardeInPredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public vergelijkingInPredicaat(): VergelijkingInPredicaatContext {
		return this.getTypedRuleContext(VergelijkingInPredicaatContext, 0) as VergelijkingInPredicaatContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_elementaireVoorwaardeInPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterElementaireVoorwaardeInPredicaat) {
	 		listener.enterElementaireVoorwaardeInPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitElementaireVoorwaardeInPredicaat) {
	 		listener.exitElementaireVoorwaardeInPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitElementaireVoorwaardeInPredicaat) {
			return visitor.visitElementaireVoorwaardeInPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VergelijkingInPredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
	}
	public comparisonOperator(): ComparisonOperatorContext {
		return this.getTypedRuleContext(ComparisonOperatorContext, 0) as ComparisonOperatorContext;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public eenzijdigeObjectVergelijking(): EenzijdigeObjectVergelijkingContext {
		return this.getTypedRuleContext(EenzijdigeObjectVergelijkingContext, 0) as EenzijdigeObjectVergelijkingContext;
	}
	public kenmerkNaam(): KenmerkNaamContext {
		return this.getTypedRuleContext(KenmerkNaamContext, 0) as KenmerkNaamContext;
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_vergelijkingInPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVergelijkingInPredicaat) {
	 		listener.enterVergelijkingInPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVergelijkingInPredicaat) {
	 		listener.exitVergelijkingInPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVergelijkingInPredicaat) {
			return visitor.visitVergelijkingInPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenesteSamengesteldeVoorwaardeInPredicaatContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.AAN, 0);
	}
	public voorwaardeKwantificatie(): VoorwaardeKwantificatieContext {
		return this.getTypedRuleContext(VoorwaardeKwantificatieContext, 0) as VoorwaardeKwantificatieContext;
	}
	public VOLGENDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLGENDE, 0);
	}
	public COLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.COLON, 0);
	}
	public VOORWAARDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOORWAARDE, 0);
	}
	public VOORWAARDEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOORWAARDEN, 0);
	}
	public VOLDOET(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDOET, 0);
	}
	public VOLDOEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDOEN, 0);
	}
	public WORDT(): TerminalNode {
		return this.getToken(RegelSpraakParser.WORDT, 0);
	}
	public VOLDAAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDAAN, 0);
	}
	public samengesteldeVoorwaardeOnderdeelInPredicaat_list(): SamengesteldeVoorwaardeOnderdeelInPredicaatContext[] {
		return this.getTypedRuleContexts(SamengesteldeVoorwaardeOnderdeelInPredicaatContext) as SamengesteldeVoorwaardeOnderdeelInPredicaatContext[];
	}
	public samengesteldeVoorwaardeOnderdeelInPredicaat(i: number): SamengesteldeVoorwaardeOnderdeelInPredicaatContext {
		return this.getTypedRuleContext(SamengesteldeVoorwaardeOnderdeelInPredicaatContext, i) as SamengesteldeVoorwaardeOnderdeelInPredicaatContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_genesteSamengesteldeVoorwaardeInPredicaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterGenesteSamengesteldeVoorwaardeInPredicaat) {
	 		listener.enterGenesteSamengesteldeVoorwaardeInPredicaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitGenesteSamengesteldeVoorwaardeInPredicaat) {
	 		listener.exitGenesteSamengesteldeVoorwaardeInPredicaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitGenesteSamengesteldeVoorwaardeInPredicaat) {
			return visitor.visitGenesteSamengesteldeVoorwaardeInPredicaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GetalVergelijkingsOperatorMeervoudContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ZIJN_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GELIJK_AAN, 0);
	}
	public ZIJN_ONGELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_ONGELIJK_AAN, 0);
	}
	public ZIJN_GROTER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GROTER_DAN, 0);
	}
	public ZIJN_GROTER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GROTER_OF_GELIJK_AAN, 0);
	}
	public ZIJN_KLEINER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_KLEINER_DAN, 0);
	}
	public ZIJN_KLEINER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_KLEINER_OF_GELIJK_AAN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_getalVergelijkingsOperatorMeervoud;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterGetalVergelijkingsOperatorMeervoud) {
	 		listener.enterGetalVergelijkingsOperatorMeervoud(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitGetalVergelijkingsOperatorMeervoud) {
	 		listener.exitGetalVergelijkingsOperatorMeervoud(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitGetalVergelijkingsOperatorMeervoud) {
			return visitor.visitGetalVergelijkingsOperatorMeervoud(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TekstVergelijkingsOperatorMeervoudContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ZIJN_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GELIJK_AAN, 0);
	}
	public ZIJN_ONGELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_ONGELIJK_AAN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_tekstVergelijkingsOperatorMeervoud;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTekstVergelijkingsOperatorMeervoud) {
	 		listener.enterTekstVergelijkingsOperatorMeervoud(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTekstVergelijkingsOperatorMeervoud) {
	 		listener.exitTekstVergelijkingsOperatorMeervoud(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTekstVergelijkingsOperatorMeervoud) {
			return visitor.visitTekstVergelijkingsOperatorMeervoud(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DatumVergelijkingsOperatorMeervoudContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ZIJN_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GELIJK_AAN, 0);
	}
	public ZIJN_ONGELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_ONGELIJK_AAN, 0);
	}
	public ZIJN_LATER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_LATER_DAN, 0);
	}
	public ZIJN_LATER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_LATER_OF_GELIJK_AAN, 0);
	}
	public ZIJN_EERDER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_EERDER_DAN, 0);
	}
	public ZIJN_EERDER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_EERDER_OF_GELIJK_AAN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_datumVergelijkingsOperatorMeervoud;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDatumVergelijkingsOperatorMeervoud) {
	 		listener.enterDatumVergelijkingsOperatorMeervoud(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDatumVergelijkingsOperatorMeervoud) {
	 		listener.exitDatumVergelijkingsOperatorMeervoud(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDatumVergelijkingsOperatorMeervoud) {
			return visitor.visitDatumVergelijkingsOperatorMeervoud(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GetalExpressieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_getalExpressie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterGetalExpressie) {
	 		listener.enterGetalExpressie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitGetalExpressie) {
	 		listener.exitGetalExpressie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitGetalExpressie) {
			return visitor.visitGetalExpressie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TekstExpressieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_tekstExpressie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTekstExpressie) {
	 		listener.enterTekstExpressie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTekstExpressie) {
	 		listener.exitTekstExpressie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTekstExpressie) {
			return visitor.visitTekstExpressie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DatumExpressieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_datumExpressie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDatumExpressie) {
	 		listener.enterDatumExpressie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDatumExpressie) {
	 		listener.exitDatumExpressie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDatumExpressie) {
			return visitor.visitDatumExpressie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariabeleDeelContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DAARBIJ_GELDT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAARBIJ_GELDT, 0);
	}
	public DOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOT, 0);
	}
	public variabeleToekenning_list(): VariabeleToekenningContext[] {
		return this.getTypedRuleContexts(VariabeleToekenningContext) as VariabeleToekenningContext[];
	}
	public variabeleToekenning(i: number): VariabeleToekenningContext {
		return this.getTypedRuleContext(VariabeleToekenningContext, i) as VariabeleToekenningContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_variabeleDeel;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVariabeleDeel) {
	 		listener.enterVariabeleDeel(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVariabeleDeel) {
	 		listener.exitVariabeleDeel(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVariabeleDeel) {
			return visitor.visitVariabeleDeel(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariabeleToekenningContext extends ParserRuleContext {
	public _varName!: Token;
	public _varExpr!: VariabeleExpressieContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
	public variabeleExpressie(): VariabeleExpressieContext {
		return this.getTypedRuleContext(VariabeleExpressieContext, 0) as VariabeleExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_variabeleToekenning;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVariabeleToekenning) {
	 		listener.enterVariabeleToekenning(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVariabeleToekenning) {
	 		listener.exitVariabeleToekenning(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVariabeleToekenning) {
			return visitor.visitVariabeleToekenning(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VariabeleExpressieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public additiveOperator_list(): AdditiveOperatorContext[] {
		return this.getTypedRuleContexts(AdditiveOperatorContext) as AdditiveOperatorContext[];
	}
	public additiveOperator(i: number): AdditiveOperatorContext {
		return this.getTypedRuleContext(AdditiveOperatorContext, i) as AdditiveOperatorContext;
	}
	public multiplicativeOperator_list(): MultiplicativeOperatorContext[] {
		return this.getTypedRuleContexts(MultiplicativeOperatorContext) as MultiplicativeOperatorContext[];
	}
	public multiplicativeOperator(i: number): MultiplicativeOperatorContext {
		return this.getTypedRuleContext(MultiplicativeOperatorContext, i) as MultiplicativeOperatorContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_variabeleExpressie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVariabeleExpressie) {
	 		listener.enterVariabeleExpressie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVariabeleExpressie) {
	 		listener.exitVariabeleExpressie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVariabeleExpressie) {
			return visitor.visitVariabeleExpressie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_expressie;
	}
	public copyFrom(ctx: ExpressieContext): void {
		super.copyFrom(ctx);
	}
}
export class SimpleExprContext extends ExpressieContext {
	constructor(parser: RegelSpraakParser, ctx: ExpressieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public logicalExpression(): LogicalExpressionContext {
		return this.getTypedRuleContext(LogicalExpressionContext, 0) as LogicalExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSimpleExpr) {
	 		listener.enterSimpleExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSimpleExpr) {
	 		listener.exitSimpleExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSimpleExpr) {
			return visitor.visitSimpleExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ExprBegrenzingAfrondingContext extends ExpressieContext {
	constructor(parser: RegelSpraakParser, ctx: ExpressieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public logicalExpression(): LogicalExpressionContext {
		return this.getTypedRuleContext(LogicalExpressionContext, 0) as LogicalExpressionContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, 0);
	}
	public begrenzing(): BegrenzingContext {
		return this.getTypedRuleContext(BegrenzingContext, 0) as BegrenzingContext;
	}
	public afronding(): AfrondingContext {
		return this.getTypedRuleContext(AfrondingContext, 0) as AfrondingContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterExprBegrenzingAfronding) {
	 		listener.enterExprBegrenzingAfronding(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitExprBegrenzingAfronding) {
	 		listener.exitExprBegrenzingAfronding(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitExprBegrenzingAfronding) {
			return visitor.visitExprBegrenzingAfronding(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ExprBegrenzingContext extends ExpressieContext {
	constructor(parser: RegelSpraakParser, ctx: ExpressieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public logicalExpression(): LogicalExpressionContext {
		return this.getTypedRuleContext(LogicalExpressionContext, 0) as LogicalExpressionContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, 0);
	}
	public begrenzing(): BegrenzingContext {
		return this.getTypedRuleContext(BegrenzingContext, 0) as BegrenzingContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterExprBegrenzing) {
	 		listener.enterExprBegrenzing(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitExprBegrenzing) {
	 		listener.exitExprBegrenzing(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitExprBegrenzing) {
			return visitor.visitExprBegrenzing(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ExprAfrondingContext extends ExpressieContext {
	constructor(parser: RegelSpraakParser, ctx: ExpressieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public logicalExpression(): LogicalExpressionContext {
		return this.getTypedRuleContext(LogicalExpressionContext, 0) as LogicalExpressionContext;
	}
	public afronding(): AfrondingContext {
		return this.getTypedRuleContext(AfrondingContext, 0) as AfrondingContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterExprAfronding) {
	 		listener.enterExprAfronding(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitExprAfronding) {
	 		listener.exitExprAfronding(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitExprAfronding) {
			return visitor.visitExprAfronding(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class LogicalExpressionContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_logicalExpression;
	}
	public copyFrom(ctx: LogicalExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class LogicalExprContext extends LogicalExpressionContext {
	public _left!: ComparisonExpressionContext;
	public _op!: Token;
	public _right!: LogicalExpressionContext;
	constructor(parser: RegelSpraakParser, ctx: LogicalExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public comparisonExpression(): ComparisonExpressionContext {
		return this.getTypedRuleContext(ComparisonExpressionContext, 0) as ComparisonExpressionContext;
	}
	public logicalExpression(): LogicalExpressionContext {
		return this.getTypedRuleContext(LogicalExpressionContext, 0) as LogicalExpressionContext;
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public OF(): TerminalNode {
		return this.getToken(RegelSpraakParser.OF, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterLogicalExpr) {
	 		listener.enterLogicalExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitLogicalExpr) {
	 		listener.exitLogicalExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitLogicalExpr) {
			return visitor.visitLogicalExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ComparisonExpressionContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_comparisonExpression;
	}
	public copyFrom(ctx: ComparisonExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class SubordinateClauseExprContext extends ComparisonExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: ComparisonExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public subordinateClauseExpression(): SubordinateClauseExpressionContext {
		return this.getTypedRuleContext(SubordinateClauseExpressionContext, 0) as SubordinateClauseExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSubordinateClauseExpr) {
	 		listener.enterSubordinateClauseExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSubordinateClauseExpr) {
	 		listener.exitSubordinateClauseExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSubordinateClauseExpr) {
			return visitor.visitSubordinateClauseExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BinaryComparisonExprContext extends ComparisonExpressionContext {
	public _left!: AdditiveExpressionContext;
	public _right!: AdditiveExpressionContext;
	constructor(parser: RegelSpraakParser, ctx: ComparisonExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public additiveExpression_list(): AdditiveExpressionContext[] {
		return this.getTypedRuleContexts(AdditiveExpressionContext) as AdditiveExpressionContext[];
	}
	public additiveExpression(i: number): AdditiveExpressionContext {
		return this.getTypedRuleContext(AdditiveExpressionContext, i) as AdditiveExpressionContext;
	}
	public comparisonOperator(): ComparisonOperatorContext {
		return this.getTypedRuleContext(ComparisonOperatorContext, 0) as ComparisonOperatorContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBinaryComparisonExpr) {
	 		listener.enterBinaryComparisonExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBinaryComparisonExpr) {
	 		listener.exitBinaryComparisonExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBinaryComparisonExpr) {
			return visitor.visitBinaryComparisonExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryConditionExprContext extends ComparisonExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: ComparisonExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public unaryCondition(): UnaryConditionContext {
		return this.getTypedRuleContext(UnaryConditionContext, 0) as UnaryConditionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnaryConditionExpr) {
	 		listener.enterUnaryConditionExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnaryConditionExpr) {
	 		listener.exitUnaryConditionExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnaryConditionExpr) {
			return visitor.visitUnaryConditionExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class HeeftKenmerkExprContext extends ComparisonExpressionContext {
	public _left!: AdditiveExpressionContext;
	constructor(parser: RegelSpraakParser, ctx: ComparisonExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HEEFT(): TerminalNode {
		return this.getToken(RegelSpraakParser.HEEFT, 0);
	}
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		return this.getTypedRuleContext(NaamwoordWithNumbersContext, 0) as NaamwoordWithNumbersContext;
	}
	public additiveExpression(): AdditiveExpressionContext {
		return this.getTypedRuleContext(AdditiveExpressionContext, 0) as AdditiveExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterHeeftKenmerkExpr) {
	 		listener.enterHeeftKenmerkExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitHeeftKenmerkExpr) {
	 		listener.exitHeeftKenmerkExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitHeeftKenmerkExpr) {
			return visitor.visitHeeftKenmerkExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IsKenmerkExprContext extends ComparisonExpressionContext {
	public _left!: AdditiveExpressionContext;
	constructor(parser: RegelSpraakParser, ctx: ComparisonExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		return this.getTypedRuleContext(NaamwoordWithNumbersContext, 0) as NaamwoordWithNumbersContext;
	}
	public additiveExpression(): AdditiveExpressionContext {
		return this.getTypedRuleContext(AdditiveExpressionContext, 0) as AdditiveExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterIsKenmerkExpr) {
	 		listener.enterIsKenmerkExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitIsKenmerkExpr) {
	 		listener.exitIsKenmerkExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitIsKenmerkExpr) {
			return visitor.visitIsKenmerkExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RegelStatusConditionExprContext extends ComparisonExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: ComparisonExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public regelStatusCondition(): RegelStatusConditionContext {
		return this.getTypedRuleContext(RegelStatusConditionContext, 0) as RegelStatusConditionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRegelStatusConditionExpr) {
	 		listener.enterRegelStatusConditionExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRegelStatusConditionExpr) {
	 		listener.exitRegelStatusConditionExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRegelStatusConditionExpr) {
			return visitor.visitRegelStatusConditionExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ComparisonOperatorContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GELIJK_AAN, 0);
	}
	public ONGELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ONGELIJK_AAN, 0);
	}
	public GELIJK_IS_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GELIJK_IS_AAN, 0);
	}
	public GROTER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GROTER_DAN, 0);
	}
	public GROTER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GROTER_OF_GELIJK_AAN, 0);
	}
	public KLEINER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.KLEINER_DAN, 0);
	}
	public KLEINER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.KLEINER_OF_GELIJK_AAN, 0);
	}
	public KLEINER_IS_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.KLEINER_IS_DAN, 0);
	}
	public GROTER_IS_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GROTER_IS_DAN, 0);
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN, 0);
	}
	public LATER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.LATER_DAN, 0);
	}
	public LATER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.LATER_OF_GELIJK_AAN, 0);
	}
	public EERDER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EERDER_DAN, 0);
	}
	public EERDER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EERDER_OF_GELIJK_AAN, 0);
	}
	public NIET(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIET, 0);
	}
	public IS_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GELIJK_AAN, 0);
	}
	public IS_ONGELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_ONGELIJK_AAN, 0);
	}
	public IS_KLEINER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_KLEINER_DAN, 0);
	}
	public IS_KLEINER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_KLEINER_OF_GELIJK_AAN, 0);
	}
	public IS_GROTER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GROTER_DAN, 0);
	}
	public IS_GROTER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GROTER_OF_GELIJK_AAN, 0);
	}
	public ZIJN_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GELIJK_AAN, 0);
	}
	public ZIJN_ONGELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_ONGELIJK_AAN, 0);
	}
	public ZIJN_KLEINER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_KLEINER_DAN, 0);
	}
	public ZIJN_KLEINER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_KLEINER_OF_GELIJK_AAN, 0);
	}
	public ZIJN_GROTER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GROTER_DAN, 0);
	}
	public ZIJN_GROTER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GROTER_OF_GELIJK_AAN, 0);
	}
	public IS_LATER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_LATER_DAN, 0);
	}
	public IS_LATER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_LATER_OF_GELIJK_AAN, 0);
	}
	public IS_EERDER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_EERDER_DAN, 0);
	}
	public IS_EERDER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_EERDER_OF_GELIJK_AAN, 0);
	}
	public ZIJN_LATER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_LATER_DAN, 0);
	}
	public ZIJN_LATER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_LATER_OF_GELIJK_AAN, 0);
	}
	public ZIJN_EERDER_DAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_EERDER_DAN, 0);
	}
	public ZIJN_EERDER_OF_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_EERDER_OF_GELIJK_AAN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_comparisonOperator;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterComparisonOperator) {
	 		listener.enterComparisonOperator(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitComparisonOperator) {
	 		listener.exitComparisonOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitComparisonOperator) {
			return visitor.visitComparisonOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AdditiveExpressionContext extends ParserRuleContext {
	public _left!: MultiplicativeExpressionContext;
	public _right!: MultiplicativeExpressionContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public multiplicativeExpression_list(): MultiplicativeExpressionContext[] {
		return this.getTypedRuleContexts(MultiplicativeExpressionContext) as MultiplicativeExpressionContext[];
	}
	public multiplicativeExpression(i: number): MultiplicativeExpressionContext {
		return this.getTypedRuleContext(MultiplicativeExpressionContext, i) as MultiplicativeExpressionContext;
	}
	public additiveOperator_list(): AdditiveOperatorContext[] {
		return this.getTypedRuleContexts(AdditiveOperatorContext) as AdditiveOperatorContext[];
	}
	public additiveOperator(i: number): AdditiveOperatorContext {
		return this.getTypedRuleContext(AdditiveOperatorContext, i) as AdditiveOperatorContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_additiveExpression;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAdditiveExpression) {
	 		listener.enterAdditiveExpression(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAdditiveExpression) {
	 		listener.exitAdditiveExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAdditiveExpression) {
			return visitor.visitAdditiveExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AdditiveOperatorContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public PLUS(): TerminalNode {
		return this.getToken(RegelSpraakParser.PLUS, 0);
	}
	public MIN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MIN, 0);
	}
	public VERMINDERD_MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.VERMINDERD_MET, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_additiveOperator;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAdditiveOperator) {
	 		listener.enterAdditiveOperator(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAdditiveOperator) {
	 		listener.exitAdditiveOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAdditiveOperator) {
			return visitor.visitAdditiveOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicativeExpressionContext extends ParserRuleContext {
	public _left!: PowerExpressionContext;
	public _right!: PowerExpressionContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public powerExpression_list(): PowerExpressionContext[] {
		return this.getTypedRuleContexts(PowerExpressionContext) as PowerExpressionContext[];
	}
	public powerExpression(i: number): PowerExpressionContext {
		return this.getTypedRuleContext(PowerExpressionContext, i) as PowerExpressionContext;
	}
	public multiplicativeOperator_list(): MultiplicativeOperatorContext[] {
		return this.getTypedRuleContexts(MultiplicativeOperatorContext) as MultiplicativeOperatorContext[];
	}
	public multiplicativeOperator(i: number): MultiplicativeOperatorContext {
		return this.getTypedRuleContext(MultiplicativeOperatorContext, i) as MultiplicativeOperatorContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_multiplicativeExpression;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterMultiplicativeExpression) {
	 		listener.enterMultiplicativeExpression(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitMultiplicativeExpression) {
	 		listener.exitMultiplicativeExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitMultiplicativeExpression) {
			return visitor.visitMultiplicativeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicativeOperatorContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MAAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAAL, 0);
	}
	public GEDEELD_DOOR(): TerminalNode {
		return this.getToken(RegelSpraakParser.GEDEELD_DOOR, 0);
	}
	public GEDEELD_DOOR_ABS(): TerminalNode {
		return this.getToken(RegelSpraakParser.GEDEELD_DOOR_ABS, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_multiplicativeOperator;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterMultiplicativeOperator) {
	 		listener.enterMultiplicativeOperator(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitMultiplicativeOperator) {
	 		listener.exitMultiplicativeOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitMultiplicativeOperator) {
			return visitor.visitMultiplicativeOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PowerExpressionContext extends ParserRuleContext {
	public _left!: PrimaryExpressionContext;
	public _right!: PrimaryExpressionContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public powerOperator_list(): PowerOperatorContext[] {
		return this.getTypedRuleContexts(PowerOperatorContext) as PowerOperatorContext[];
	}
	public powerOperator(i: number): PowerOperatorContext {
		return this.getTypedRuleContext(PowerOperatorContext, i) as PowerOperatorContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_powerExpression;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPowerExpression) {
	 		listener.enterPowerExpression(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPowerExpression) {
	 		listener.exitPowerExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPowerExpression) {
			return visitor.visitPowerExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PowerOperatorContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public TOT_DE_MACHT(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT_DE_MACHT, 0);
	}
	public CARET(): TerminalNode {
		return this.getToken(RegelSpraakParser.CARET, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_powerOperator;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPowerOperator) {
	 		listener.enterPowerOperator(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPowerOperator) {
	 		listener.exitPowerOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPowerOperator) {
			return visitor.visitPowerOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimaryExpressionContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_primaryExpression;
	}
	public copyFrom(ctx: PrimaryExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class WortelFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE_WORTEL_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_WORTEL_VAN, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterWortelFuncExpr) {
	 		listener.enterWortelFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitWortelFuncExpr) {
	 		listener.exitWortelFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitWortelFuncExpr) {
			return visitor.visitWortelFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BooleanTrueLiteralExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public WAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.WAAR, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBooleanTrueLiteralExpr) {
	 		listener.enterBooleanTrueLiteralExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBooleanTrueLiteralExpr) {
	 		listener.exitBooleanTrueLiteralExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBooleanTrueLiteralExpr) {
			return visitor.visitBooleanTrueLiteralExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AbsValFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE_ABSOLUTE_WAARDE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_ABSOLUTE_WAARDE_VAN, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.LPAREN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAbsValFuncExpr) {
	 		listener.enterAbsValFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAbsValFuncExpr) {
	 		listener.exitAbsValFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAbsValFuncExpr) {
			return visitor.visitAbsValFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MaxValFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE_MAXIMALE_WAARDE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN, 0);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, i);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterMaxValFuncExpr) {
	 		listener.enterMaxValFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitMaxValFuncExpr) {
	 		listener.exitMaxValFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitMaxValFuncExpr) {
			return visitor.visitMaxValFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RekendatumKeywordExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public REKENDATUM(): TerminalNode {
		return this.getToken(RegelSpraakParser.REKENDATUM, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRekendatumKeywordExpr) {
	 		listener.enterRekendatumKeywordExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRekendatumKeywordExpr) {
	 		listener.exitRekendatumKeywordExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRekendatumKeywordExpr) {
			return visitor.visitRekendatumKeywordExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class EnumLiteralExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public ENUM_LITERAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.ENUM_LITERAL, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterEnumLiteralExpr) {
	 		listener.enterEnumLiteralExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitEnumLiteralExpr) {
	 		listener.exitEnumLiteralExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitEnumLiteralExpr) {
			return visitor.visitEnumLiteralExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NumberLiteralExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public unitIdentifier(): UnitIdentifierContext {
		return this.getTypedRuleContext(UnitIdentifierContext, 0) as UnitIdentifierContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterNumberLiteralExpr) {
	 		listener.enterNumberLiteralExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitNumberLiteralExpr) {
	 		listener.exitNumberLiteralExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitNumberLiteralExpr) {
			return visitor.visitNumberLiteralExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DatumLiteralExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public datumLiteral(): DatumLiteralContext {
		return this.getTypedRuleContext(DatumLiteralContext, 0) as DatumLiteralContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDatumLiteralExpr) {
	 		listener.enterDatumLiteralExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDatumLiteralExpr) {
	 		listener.exitDatumLiteralExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDatumLiteralExpr) {
			return visitor.visitDatumLiteralExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AantalFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAantalFuncExpr) {
	 		listener.enterAantalFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAantalFuncExpr) {
	 		listener.exitAantalFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAantalFuncExpr) {
			return visitor.visitAantalFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryNietExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NIET(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIET, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnaryNietExpr) {
	 		listener.enterUnaryNietExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnaryNietExpr) {
	 		listener.exitUnaryNietExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnaryNietExpr) {
			return visitor.visitUnaryNietExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ConcatenatieExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public CONCATENATIE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.CONCATENATIE_VAN, 0);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public OF(): TerminalNode {
		return this.getToken(RegelSpraakParser.OF, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, i);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterConcatenatieExpr) {
	 		listener.enterConcatenatieExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitConcatenatieExpr) {
	 		listener.exitConcatenatieExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitConcatenatieExpr) {
			return visitor.visitConcatenatieExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SomAlleAttribuutExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public SOM_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.SOM_VAN, 0);
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSomAlleAttribuutExpr) {
	 		listener.enterSomAlleAttribuutExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSomAlleAttribuutExpr) {
	 		listener.exitSomAlleAttribuutExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSomAlleAttribuutExpr) {
			return visitor.visitSomAlleAttribuutExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AttrRefExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAttrRefExpr) {
	 		listener.enterAttrRefExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAttrRefExpr) {
	 		listener.exitAttrRefExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAttrRefExpr) {
			return visitor.visitAttrRefExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DagUitFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public DAG(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAG, 0);
	}
	public UIT(): TerminalNode {
		return this.getToken(RegelSpraakParser.UIT, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDagUitFuncExpr) {
	 		listener.enterDagUitFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDagUitFuncExpr) {
	 		listener.exitDagUitFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDagUitFuncExpr) {
			return visitor.visitDagUitFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BegrenzingExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, 0);
	}
	public begrenzing(): BegrenzingContext {
		return this.getTypedRuleContext(BegrenzingContext, 0) as BegrenzingContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBegrenzingExpr) {
	 		listener.enterBegrenzingExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBegrenzingExpr) {
	 		listener.exitBegrenzingExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBegrenzingExpr) {
			return visitor.visitBegrenzingExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class NaamwoordExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterNaamwoordExpr) {
	 		listener.enterNaamwoordExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitNaamwoordExpr) {
	 		listener.exitNaamwoordExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitNaamwoordExpr) {
			return visitor.visitNaamwoordExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BooleanFalseLiteralExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public ONWAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.ONWAAR, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBooleanFalseLiteralExpr) {
	 		listener.enterBooleanFalseLiteralExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBooleanFalseLiteralExpr) {
	 		listener.exitBooleanFalseLiteralExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBooleanFalseLiteralExpr) {
			return visitor.visitBooleanFalseLiteralExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class JaarUitFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public JAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.JAAR, 0);
	}
	public UIT(): TerminalNode {
		return this.getToken(RegelSpraakParser.UIT, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterJaarUitFuncExpr) {
	 		listener.enterJaarUitFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitJaarUitFuncExpr) {
	 		listener.exitJaarUitFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitJaarUitFuncExpr) {
			return visitor.visitJaarUitFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TotaalVanExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HET_TOTAAL_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET_TOTAAL_VAN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public conditieBijExpressie(): ConditieBijExpressieContext {
		return this.getTypedRuleContext(ConditieBijExpressieContext, 0) as ConditieBijExpressieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTotaalVanExpr) {
	 		listener.enterTotaalVanExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTotaalVanExpr) {
	 		listener.exitTotaalVanExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTotaalVanExpr) {
			return visitor.visitTotaalVanExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TijdsevenredigDeelExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HET_TIJDSEVENREDIG_DEEL_PER(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET_TIJDSEVENREDIG_DEEL_PER, 0);
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public MAAND(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAAND, 0);
	}
	public JAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.JAAR, 0);
	}
	public conditieBijExpressie(): ConditieBijExpressieContext {
		return this.getTypedRuleContext(ConditieBijExpressieContext, 0) as ConditieBijExpressieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTijdsevenredigDeelExpr) {
	 		listener.enterTijdsevenredigDeelExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTijdsevenredigDeelExpr) {
	 		listener.exitTijdsevenredigDeelExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTijdsevenredigDeelExpr) {
			return visitor.visitTijdsevenredigDeelExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class CapitalizedTijdsevenredigDeelExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HET_TIJDSEVENREDIG_DEEL_PER(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET_TIJDSEVENREDIG_DEEL_PER, 0);
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public MAAND(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAAND, 0);
	}
	public JAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.JAAR, 0);
	}
	public identifier_list(): IdentifierContext[] {
		return this.getTypedRuleContexts(IdentifierContext) as IdentifierContext[];
	}
	public identifier(i: number): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, i) as IdentifierContext;
	}
	public conditieBijExpressie(): ConditieBijExpressieContext {
		return this.getTypedRuleContext(ConditieBijExpressieContext, 0) as ConditieBijExpressieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterCapitalizedTijdsevenredigDeelExpr) {
	 		listener.enterCapitalizedTijdsevenredigDeelExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitCapitalizedTijdsevenredigDeelExpr) {
	 		listener.exitCapitalizedTijdsevenredigDeelExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitCapitalizedTijdsevenredigDeelExpr) {
			return visitor.visitCapitalizedTijdsevenredigDeelExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AantalAttribuutExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAantalAttribuutExpr) {
	 		listener.enterAantalAttribuutExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAantalAttribuutExpr) {
	 		listener.exitAantalAttribuutExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAantalAttribuutExpr) {
			return visitor.visitAantalAttribuutExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParenExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.LPAREN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterParenExpr) {
	 		listener.enterParenExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitParenExpr) {
	 		listener.exitParenExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitParenExpr) {
			return visitor.visitParenExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DimensieRangeAggExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public VANAF(): TerminalNode {
		return this.getToken(RegelSpraakParser.VANAF, 0);
	}
	public naamwoord_list(): NaamwoordContext[] {
		return this.getTypedRuleContexts(NaamwoordContext) as NaamwoordContext[];
	}
	public naamwoord(i: number): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, i) as NaamwoordContext;
	}
	public TM(): TerminalNode {
		return this.getToken(RegelSpraakParser.TM, 0);
	}
	public getalAggregatieFunctie(): GetalAggregatieFunctieContext {
		return this.getTypedRuleContext(GetalAggregatieFunctieContext, 0) as GetalAggregatieFunctieContext;
	}
	public datumAggregatieFunctie(): DatumAggregatieFunctieContext {
		return this.getTypedRuleContext(DatumAggregatieFunctieContext, 0) as DatumAggregatieFunctieContext;
	}
	public bezieldeReferentie(): BezieldeReferentieContext {
		return this.getTypedRuleContext(BezieldeReferentieContext, 0) as BezieldeReferentieContext;
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOT, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDimensieRangeAggExpr) {
	 		listener.enterDimensieRangeAggExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDimensieRangeAggExpr) {
	 		listener.exitDimensieRangeAggExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDimensieRangeAggExpr) {
			return visitor.visitDimensieRangeAggExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DatumMetFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE_DATUM_MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_DATUM_MET, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.LPAREN, 0);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, i);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDatumMetFuncExpr) {
	 		listener.enterDatumMetFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDatumMetFuncExpr) {
	 		listener.exitDatumMetFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDatumMetFuncExpr) {
			return visitor.visitDatumMetFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PercentageLiteralExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public PERCENTAGE_LITERAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.PERCENTAGE_LITERAL, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPercentageLiteralExpr) {
	 		listener.enterPercentageLiteralExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPercentageLiteralExpr) {
	 		listener.exitPercentageLiteralExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPercentageLiteralExpr) {
			return visitor.visitPercentageLiteralExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class StringLiteralExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public STRING_LITERAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.STRING_LITERAL, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterStringLiteralExpr) {
	 		listener.enterStringLiteralExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitStringLiteralExpr) {
	 		listener.exitStringLiteralExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitStringLiteralExpr) {
			return visitor.visitStringLiteralExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PercentageFuncExprContext extends PrimaryExpressionContext {
	public _p!: Token;
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public PERCENTAGE_LITERAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.PERCENTAGE_LITERAL, 0);
	}
	public PERCENT_SIGN(): TerminalNode {
		return this.getToken(RegelSpraakParser.PERCENT_SIGN, 0);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPercentageFuncExpr) {
	 		listener.enterPercentageFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPercentageFuncExpr) {
	 		listener.exitPercentageFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPercentageFuncExpr) {
			return visitor.visitPercentageFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class EersteDatumFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public EERSTE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EERSTE_VAN, 0);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, i);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterEersteDatumFuncExpr) {
	 		listener.enterEersteDatumFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitEersteDatumFuncExpr) {
	 		listener.exitEersteDatumFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitEersteDatumFuncExpr) {
			return visitor.visitEersteDatumFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PasenFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE_EERSTE_PAASDAG_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_EERSTE_PAASDAG_VAN, 0);
	}
	public LPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.LPAREN, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPasenFuncExpr) {
	 		listener.enterPasenFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPasenFuncExpr) {
	 		listener.exitPasenFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPasenFuncExpr) {
			return visitor.visitPasenFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AbsTijdsduurFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE_ABSOLUTE_TIJDSDUUR_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_ABSOLUTE_TIJDSDUUR_VAN, 0);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public TOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT, 0);
	}
	public IN_HELE(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN_HELE, 0);
	}
	public unitIdentifier(): UnitIdentifierContext {
		return this.getTypedRuleContext(UnitIdentifierContext, 0) as UnitIdentifierContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAbsTijdsduurFuncExpr) {
	 		listener.enterAbsTijdsduurFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAbsTijdsduurFuncExpr) {
	 		listener.exitAbsTijdsduurFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAbsTijdsduurFuncExpr) {
			return visitor.visitAbsTijdsduurFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MaandUitFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public MAAND(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAAND, 0);
	}
	public UIT(): TerminalNode {
		return this.getToken(RegelSpraakParser.UIT, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterMaandUitFuncExpr) {
	 		listener.enterMaandUitFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitMaandUitFuncExpr) {
	 		listener.exitMaandUitFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitMaandUitFuncExpr) {
			return visitor.visitMaandUitFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class CapitalizedTotaalVanExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HET_TOTAAL_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET_TOTAAL_VAN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public identifier_list(): IdentifierContext[] {
		return this.getTypedRuleContexts(IdentifierContext) as IdentifierContext[];
	}
	public identifier(i: number): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, i) as IdentifierContext;
	}
	public conditieBijExpressie(): ConditieBijExpressieContext {
		return this.getTypedRuleContext(ConditieBijExpressieContext, 0) as ConditieBijExpressieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterCapitalizedTotaalVanExpr) {
	 		listener.enterCapitalizedTotaalVanExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitCapitalizedTotaalVanExpr) {
	 		listener.exitCapitalizedTotaalVanExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitCapitalizedTotaalVanExpr) {
			return visitor.visitCapitalizedTotaalVanExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class IdentifierExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterIdentifierExpr) {
	 		listener.enterIdentifierExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitIdentifierExpr) {
	 		listener.exitIdentifierExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitIdentifierExpr) {
			return visitor.visitIdentifierExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DimensieAggExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public attribuutMetLidwoord(): AttribuutMetLidwoordContext {
		return this.getTypedRuleContext(AttribuutMetLidwoordContext, 0) as AttribuutMetLidwoordContext;
	}
	public dimensieSelectie(): DimensieSelectieContext {
		return this.getTypedRuleContext(DimensieSelectieContext, 0) as DimensieSelectieContext;
	}
	public getalAggregatieFunctie(): GetalAggregatieFunctieContext {
		return this.getTypedRuleContext(GetalAggregatieFunctieContext, 0) as GetalAggregatieFunctieContext;
	}
	public datumAggregatieFunctie(): DatumAggregatieFunctieContext {
		return this.getTypedRuleContext(DatumAggregatieFunctieContext, 0) as DatumAggregatieFunctieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDimensieAggExpr) {
	 		listener.enterDimensieAggExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDimensieAggExpr) {
	 		listener.exitDimensieAggExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDimensieAggExpr) {
			return visitor.visitDimensieAggExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TijdsduurFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public TIJDSDUUR_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.TIJDSDUUR_VAN, 0);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public TOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT, 0);
	}
	public IN_HELE(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN_HELE, 0);
	}
	public unitIdentifier(): UnitIdentifierContext {
		return this.getTypedRuleContext(UnitIdentifierContext, 0) as UnitIdentifierContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTijdsduurFuncExpr) {
	 		listener.enterTijdsduurFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTijdsduurFuncExpr) {
	 		listener.exitTijdsduurFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTijdsduurFuncExpr) {
			return visitor.visitTijdsduurFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class OnderwerpRefExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterOnderwerpRefExpr) {
	 		listener.enterOnderwerpRefExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitOnderwerpRefExpr) {
	 		listener.exitOnderwerpRefExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitOnderwerpRefExpr) {
			return visitor.visitOnderwerpRefExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SomFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public SOM_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.SOM_VAN, 0);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, i);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSomFuncExpr) {
	 		listener.enterSomFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSomFuncExpr) {
	 		listener.exitSomFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSomFuncExpr) {
			return visitor.visitSomFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SomAlleExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public SOM_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.SOM_VAN, 0);
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSomAlleExpr) {
	 		listener.enterSomAlleExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSomAlleExpr) {
	 		listener.exitSomAlleExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSomAlleExpr) {
			return visitor.visitSomAlleExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SimpleConcatenatieExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public OF(): TerminalNode {
		return this.getToken(RegelSpraakParser.OF, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, i);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSimpleConcatenatieExpr) {
	 		listener.enterSimpleConcatenatieExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSimpleConcatenatieExpr) {
	 		listener.exitSimpleConcatenatieExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSimpleConcatenatieExpr) {
			return visitor.visitSimpleConcatenatieExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BegrenzingAfrondingExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, 0);
	}
	public begrenzing(): BegrenzingContext {
		return this.getTypedRuleContext(BegrenzingContext, 0) as BegrenzingContext;
	}
	public afronding(): AfrondingContext {
		return this.getTypedRuleContext(AfrondingContext, 0) as AfrondingContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBegrenzingAfrondingExpr) {
	 		listener.enterBegrenzingAfrondingExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBegrenzingAfrondingExpr) {
	 		listener.exitBegrenzingAfrondingExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBegrenzingAfrondingExpr) {
			return visitor.visitBegrenzingAfrondingExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PercentageOfExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPercentageOfExpr) {
	 		listener.enterPercentageOfExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPercentageOfExpr) {
	 		listener.exitPercentageOfExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPercentageOfExpr) {
			return visitor.visitPercentageOfExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MinValFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE_MINIMALE_WAARDE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN, 0);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, i);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterMinValFuncExpr) {
	 		listener.enterMinValFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitMinValFuncExpr) {
	 		listener.exitMinValFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitMinValFuncExpr) {
			return visitor.visitMinValFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MaxAlleAttribuutExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE_MAXIMALE_WAARDE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN, 0);
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterMaxAlleAttribuutExpr) {
	 		listener.enterMaxAlleAttribuutExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitMaxAlleAttribuutExpr) {
	 		listener.exitMaxAlleAttribuutExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitMaxAlleAttribuutExpr) {
			return visitor.visitMaxAlleAttribuutExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class BezieldeRefExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public bezieldeReferentie(): BezieldeReferentieContext {
		return this.getTypedRuleContext(BezieldeReferentieContext, 0) as BezieldeReferentieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBezieldeRefExpr) {
	 		listener.enterBezieldeRefExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBezieldeRefExpr) {
	 		listener.exitBezieldeRefExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBezieldeRefExpr) {
			return visitor.visitBezieldeRefExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class DateCalcExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public timeUnit(): TimeUnitContext {
		return this.getTypedRuleContext(TimeUnitContext, 0) as TimeUnitContext;
	}
	public PLUS(): TerminalNode {
		return this.getToken(RegelSpraakParser.PLUS, 0);
	}
	public MIN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MIN, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDateCalcExpr) {
	 		listener.enterDateCalcExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDateCalcExpr) {
	 		listener.exitDateCalcExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDateCalcExpr) {
			return visitor.visitDateCalcExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class MinAlleAttribuutExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public DE_MINIMALE_WAARDE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN, 0);
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterMinAlleAttribuutExpr) {
	 		listener.enterMinAlleAttribuutExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitMinAlleAttribuutExpr) {
	 		listener.exitMinAlleAttribuutExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitMinAlleAttribuutExpr) {
			return visitor.visitMinAlleAttribuutExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class AfrondingExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public afronding(): AfrondingContext {
		return this.getTypedRuleContext(AfrondingContext, 0) as AfrondingContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAfrondingExpr) {
	 		listener.enterAfrondingExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAfrondingExpr) {
	 		listener.exitAfrondingExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAfrondingExpr) {
			return visitor.visitAfrondingExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class LaatsteDatumFuncExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public LAATSTE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.LAATSTE_VAN, 0);
	}
	public primaryExpression_list(): PrimaryExpressionContext[] {
		return this.getTypedRuleContexts(PrimaryExpressionContext) as PrimaryExpressionContext[];
	}
	public primaryExpression(i: number): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, i) as PrimaryExpressionContext;
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, i);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterLaatsteDatumFuncExpr) {
	 		listener.enterLaatsteDatumFuncExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitLaatsteDatumFuncExpr) {
	 		listener.exitLaatsteDatumFuncExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitLaatsteDatumFuncExpr) {
			return visitor.visitLaatsteDatumFuncExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class HetAantalDagenInExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HET_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.HET);
	}
	public HET(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, i);
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
	}
	public DAGEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAGEN, 0);
	}
	public IN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN, 0);
	}
	public DAT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAT, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public MAAND(): TerminalNode {
		return this.getToken(RegelSpraakParser.MAAND, 0);
	}
	public JAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.JAAR, 0);
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterHetAantalDagenInExpr) {
	 		listener.enterHetAantalDagenInExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitHetAantalDagenInExpr) {
	 		listener.exitHetAantalDagenInExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitHetAantalDagenInExpr) {
			return visitor.visitHetAantalDagenInExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryMinusExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public MIN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MIN, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public MINUS(): TerminalNode {
		return this.getToken(RegelSpraakParser.MINUS, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnaryMinusExpr) {
	 		listener.enterUnaryMinusExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnaryMinusExpr) {
	 		listener.exitUnaryMinusExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnaryMinusExpr) {
			return visitor.visitUnaryMinusExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class ParamRefExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public parameterMetLidwoord(): ParameterMetLidwoordContext {
		return this.getTypedRuleContext(ParameterMetLidwoordContext, 0) as ParameterMetLidwoordContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterParamRefExpr) {
	 		listener.enterParamRefExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitParamRefExpr) {
	 		listener.exitParamRefExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitParamRefExpr) {
			return visitor.visitParamRefExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class PronounExprContext extends PrimaryExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: PrimaryExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public HIJ(): TerminalNode {
		return this.getToken(RegelSpraakParser.HIJ, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPronounExpr) {
	 		listener.enterPronounExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPronounExpr) {
	 		listener.exitPronounExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPronounExpr) {
			return visitor.visitPronounExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AfrondingContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AFGEROND_OP(): TerminalNode {
		return this.getToken(RegelSpraakParser.AFGEROND_OP, 0);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public DECIMALEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DECIMALEN, 0);
	}
	public NAAR_BENEDEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.NAAR_BENEDEN, 0);
	}
	public NAAR_BOVEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.NAAR_BOVEN, 0);
	}
	public REKENKUNDIG(): TerminalNode {
		return this.getToken(RegelSpraakParser.REKENKUNDIG, 0);
	}
	public RICHTING_NUL(): TerminalNode {
		return this.getToken(RegelSpraakParser.RICHTING_NUL, 0);
	}
	public WEG_VAN_NUL(): TerminalNode {
		return this.getToken(RegelSpraakParser.WEG_VAN_NUL, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_afronding;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAfronding) {
	 		listener.enterAfronding(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAfronding) {
	 		listener.exitAfronding(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAfronding) {
			return visitor.visitAfronding(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BegrenzingContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public begrenzingMinimum(): BegrenzingMinimumContext {
		return this.getTypedRuleContext(BegrenzingMinimumContext, 0) as BegrenzingMinimumContext;
	}
	public begrenzingMaximum(): BegrenzingMaximumContext {
		return this.getTypedRuleContext(BegrenzingMaximumContext, 0) as BegrenzingMaximumContext;
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_begrenzing;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBegrenzing) {
	 		listener.enterBegrenzing(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBegrenzing) {
	 		listener.exitBegrenzing(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBegrenzing) {
			return visitor.visitBegrenzing(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BegrenzingMinimumContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MET_EEN_MINIMUM_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET_EEN_MINIMUM_VAN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_begrenzingMinimum;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBegrenzingMinimum) {
	 		listener.enterBegrenzingMinimum(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBegrenzingMinimum) {
	 		listener.exitBegrenzingMinimum(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBegrenzingMinimum) {
			return visitor.visitBegrenzingMinimum(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BegrenzingMaximumContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MET_EEN_MAXIMUM_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET_EEN_MAXIMUM_VAN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_begrenzingMaximum;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterBegrenzingMaximum) {
	 		listener.enterBegrenzingMaximum(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitBegrenzingMaximum) {
	 		listener.exitBegrenzingMaximum(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitBegrenzingMaximum) {
			return visitor.visitBegrenzingMaximum(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConditieBijExpressieContext extends ParserRuleContext {
	public _condition!: ExpressieContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GEDURENDE_DE_TIJD_DAT(): TerminalNode {
		return this.getToken(RegelSpraakParser.GEDURENDE_DE_TIJD_DAT, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public periodevergelijkingEnkelvoudig(): PeriodevergelijkingEnkelvoudigContext {
		return this.getTypedRuleContext(PeriodevergelijkingEnkelvoudigContext, 0) as PeriodevergelijkingEnkelvoudigContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_conditieBijExpressie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterConditieBijExpressie) {
	 		listener.enterConditieBijExpressie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitConditieBijExpressie) {
	 		listener.exitConditieBijExpressie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitConditieBijExpressie) {
			return visitor.visitConditieBijExpressie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PeriodevergelijkingEnkelvoudigContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public VANAF(): TerminalNode {
		return this.getToken(RegelSpraakParser.VANAF, 0);
	}
	public datumLiteral_list(): DatumLiteralContext[] {
		return this.getTypedRuleContexts(DatumLiteralContext) as DatumLiteralContext[];
	}
	public datumLiteral(i: number): DatumLiteralContext {
		return this.getTypedRuleContext(DatumLiteralContext, i) as DatumLiteralContext;
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public TOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT, 0);
	}
	public TOT_EN_MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT_EN_MET, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_periodevergelijkingEnkelvoudig;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPeriodevergelijkingEnkelvoudig) {
	 		listener.enterPeriodevergelijkingEnkelvoudig(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPeriodevergelijkingEnkelvoudig) {
	 		listener.exitPeriodevergelijkingEnkelvoudig(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPeriodevergelijkingEnkelvoudig) {
			return visitor.visitPeriodevergelijkingEnkelvoudig(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PeriodeDefinitieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_periodeDefinitie;
	}
	public copyFrom(ctx: PeriodeDefinitieContext): void {
		super.copyFrom(ctx);
	}
}
export class VanafPeriodeContext extends PeriodeDefinitieContext {
	constructor(parser: RegelSpraakParser, ctx: PeriodeDefinitieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public VANAF(): TerminalNode {
		return this.getToken(RegelSpraakParser.VANAF, 0);
	}
	public dateExpression(): DateExpressionContext {
		return this.getTypedRuleContext(DateExpressionContext, 0) as DateExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVanafPeriode) {
	 		listener.enterVanafPeriode(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVanafPeriode) {
	 		listener.exitVanafPeriode(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVanafPeriode) {
			return visitor.visitVanafPeriode(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VanTotPeriodeContext extends PeriodeDefinitieContext {
	constructor(parser: RegelSpraakParser, ctx: PeriodeDefinitieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public dateExpression_list(): DateExpressionContext[] {
		return this.getTypedRuleContexts(DateExpressionContext) as DateExpressionContext[];
	}
	public dateExpression(i: number): DateExpressionContext {
		return this.getTypedRuleContext(DateExpressionContext, i) as DateExpressionContext;
	}
	public TOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVanTotPeriode) {
	 		listener.enterVanTotPeriode(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVanTotPeriode) {
	 		listener.exitVanTotPeriode(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVanTotPeriode) {
			return visitor.visitVanTotPeriode(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VanTotEnMetPeriodeContext extends PeriodeDefinitieContext {
	constructor(parser: RegelSpraakParser, ctx: PeriodeDefinitieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public dateExpression_list(): DateExpressionContext[] {
		return this.getTypedRuleContexts(DateExpressionContext) as DateExpressionContext[];
	}
	public dateExpression(i: number): DateExpressionContext {
		return this.getTypedRuleContext(DateExpressionContext, i) as DateExpressionContext;
	}
	public TOT_EN_MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT_EN_MET, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVanTotEnMetPeriode) {
	 		listener.enterVanTotEnMetPeriode(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVanTotEnMetPeriode) {
	 		listener.exitVanTotEnMetPeriode(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVanTotEnMetPeriode) {
			return visitor.visitVanTotEnMetPeriode(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TotPeriodeContext extends PeriodeDefinitieContext {
	constructor(parser: RegelSpraakParser, ctx: PeriodeDefinitieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public TOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT, 0);
	}
	public dateExpression(): DateExpressionContext {
		return this.getTypedRuleContext(DateExpressionContext, 0) as DateExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTotPeriode) {
	 		listener.enterTotPeriode(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTotPeriode) {
	 		listener.exitTotPeriode(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTotPeriode) {
			return visitor.visitTotPeriode(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class TotEnMetPeriodeContext extends PeriodeDefinitieContext {
	constructor(parser: RegelSpraakParser, ctx: PeriodeDefinitieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public TOT_EN_MET(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOT_EN_MET, 0);
	}
	public dateExpression(): DateExpressionContext {
		return this.getTypedRuleContext(DateExpressionContext, 0) as DateExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTotEnMetPeriode) {
	 		listener.enterTotEnMetPeriode(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTotEnMetPeriode) {
	 		listener.exitTotEnMetPeriode(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTotEnMetPeriode) {
			return visitor.visitTotEnMetPeriode(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DateExpressionContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public datumLiteral(): DatumLiteralContext {
		return this.getTypedRuleContext(DatumLiteralContext, 0) as DatumLiteralContext;
	}
	public REKENDATUM(): TerminalNode {
		return this.getToken(RegelSpraakParser.REKENDATUM, 0);
	}
	public REKENJAAR(): TerminalNode {
		return this.getToken(RegelSpraakParser.REKENJAAR, 0);
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_dateExpression;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDateExpression) {
	 		listener.enterDateExpression(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDateExpression) {
	 		listener.exitDateExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDateExpression) {
			return visitor.visitDateExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GetalAggregatieFunctieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public DE_MAXIMALE_WAARDE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN, 0);
	}
	public DE_MINIMALE_WAARDE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN, 0);
	}
	public SOM_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.SOM_VAN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_getalAggregatieFunctie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterGetalAggregatieFunctie) {
	 		listener.enterGetalAggregatieFunctie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitGetalAggregatieFunctie) {
	 		listener.exitGetalAggregatieFunctie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitGetalAggregatieFunctie) {
			return visitor.visitGetalAggregatieFunctie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DatumAggregatieFunctieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public EERSTE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EERSTE_VAN, 0);
	}
	public LAATSTE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.LAATSTE_VAN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_datumAggregatieFunctie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDatumAggregatieFunctie) {
	 		listener.enterDatumAggregatieFunctie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDatumAggregatieFunctie) {
	 		listener.exitDatumAggregatieFunctie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDatumAggregatieFunctie) {
			return visitor.visitDatumAggregatieFunctie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DimensieSelectieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public OVER(): TerminalNode {
		return this.getToken(RegelSpraakParser.OVER, 0);
	}
	public DOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOT, 0);
	}
	public aggregerenOverAlleDimensies(): AggregerenOverAlleDimensiesContext {
		return this.getTypedRuleContext(AggregerenOverAlleDimensiesContext, 0) as AggregerenOverAlleDimensiesContext;
	}
	public aggregerenOverVerzameling(): AggregerenOverVerzamelingContext {
		return this.getTypedRuleContext(AggregerenOverVerzamelingContext, 0) as AggregerenOverVerzamelingContext;
	}
	public aggregerenOverBereik(): AggregerenOverBereikContext {
		return this.getTypedRuleContext(AggregerenOverBereikContext, 0) as AggregerenOverBereikContext;
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_dimensieSelectie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDimensieSelectie) {
	 		listener.enterDimensieSelectie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDimensieSelectie) {
	 		listener.exitDimensieSelectie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDimensieSelectie) {
			return visitor.visitDimensieSelectie(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AggregerenOverAlleDimensiesContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public predicaat(): PredicaatContext {
		return this.getTypedRuleContext(PredicaatContext, 0) as PredicaatContext;
	}
	public DIE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DIE, 0);
	}
	public DAT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAT, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_aggregerenOverAlleDimensies;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAggregerenOverAlleDimensies) {
	 		listener.enterAggregerenOverAlleDimensies(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAggregerenOverAlleDimensies) {
	 		listener.exitAggregerenOverAlleDimensies(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAggregerenOverAlleDimensies) {
			return visitor.visitAggregerenOverAlleDimensies(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AggregerenOverVerzamelingContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public naamwoord_list(): NaamwoordContext[] {
		return this.getTypedRuleContexts(NaamwoordContext) as NaamwoordContext[];
	}
	public naamwoord(i: number): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, i) as NaamwoordContext;
	}
	public VANAF(): TerminalNode {
		return this.getToken(RegelSpraakParser.VANAF, 0);
	}
	public TM(): TerminalNode {
		return this.getToken(RegelSpraakParser.TM, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_aggregerenOverVerzameling;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAggregerenOverVerzameling) {
	 		listener.enterAggregerenOverVerzameling(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAggregerenOverVerzameling) {
	 		listener.exitAggregerenOverVerzameling(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAggregerenOverVerzameling) {
			return visitor.visitAggregerenOverVerzameling(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AggregerenOverBereikContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public naamwoord_list(): NaamwoordContext[] {
		return this.getTypedRuleContexts(NaamwoordContext) as NaamwoordContext[];
	}
	public naamwoord(i: number): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, i) as NaamwoordContext;
	}
	public IN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN, 0);
	}
	public LBRACE(): TerminalNode {
		return this.getToken(RegelSpraakParser.LBRACE, 0);
	}
	public EN(): TerminalNode {
		return this.getToken(RegelSpraakParser.EN, 0);
	}
	public RBRACE(): TerminalNode {
		return this.getToken(RegelSpraakParser.RBRACE, 0);
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, i);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_aggregerenOverBereik;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterAggregerenOverBereik) {
	 		listener.enterAggregerenOverBereik(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitAggregerenOverBereik) {
	 		listener.exitAggregerenOverBereik(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitAggregerenOverBereik) {
			return visitor.visitAggregerenOverBereik(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnaryConditionContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_unaryCondition;
	}
	public copyFrom(ctx: UnaryConditionContext): void {
		super.copyFrom(ctx);
	}
}
export class UnaryCheckConditionContext extends UnaryConditionContext {
	public _expr!: PrimaryExpressionContext;
	public _op!: Token;
	constructor(parser: RegelSpraakParser, ctx: UnaryConditionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public IS_LEEG(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_LEEG, 0);
	}
	public IS_GEVULD(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GEVULD, 0);
	}
	public VOLDOET_AAN_DE_ELFPROEF(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDOET_AAN_DE_ELFPROEF, 0);
	}
	public VOLDOET_NIET_AAN_DE_ELFPROEF(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDOET_NIET_AAN_DE_ELFPROEF, 0);
	}
	public ZIJN_LEEG(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_LEEG, 0);
	}
	public ZIJN_GEVULD(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GEVULD, 0);
	}
	public VOLDOEN_AAN_DE_ELFPROEF(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDOEN_AAN_DE_ELFPROEF, 0);
	}
	public VOLDOEN_NIET_AAN_DE_ELFPROEF(): TerminalNode {
		return this.getToken(RegelSpraakParser.VOLDOEN_NIET_AAN_DE_ELFPROEF, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnaryCheckCondition) {
	 		listener.enterUnaryCheckCondition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnaryCheckCondition) {
	 		listener.exitUnaryCheckCondition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnaryCheckCondition) {
			return visitor.visitUnaryCheckCondition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryKenmerkConditionContext extends UnaryConditionContext {
	public _expr!: PrimaryExpressionContext;
	public _op!: Token;
	public _kenmerk!: IdentifierContext;
	constructor(parser: RegelSpraakParser, ctx: UnaryConditionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public IS_KENMERK(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_KENMERK, 0);
	}
	public ZIJN_KENMERK(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_KENMERK, 0);
	}
	public IS_NIET_KENMERK(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_NIET_KENMERK, 0);
	}
	public ZIJN_NIET_KENMERK(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_NIET_KENMERK, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnaryKenmerkCondition) {
	 		listener.enterUnaryKenmerkCondition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnaryKenmerkCondition) {
	 		listener.exitUnaryKenmerkCondition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnaryKenmerkCondition) {
			return visitor.visitUnaryKenmerkCondition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryNumeriekExactConditionContext extends UnaryConditionContext {
	public _expr!: PrimaryExpressionContext;
	public _op!: Token;
	constructor(parser: RegelSpraakParser, ctx: UnaryConditionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public CIJFERS(): TerminalNode {
		return this.getToken(RegelSpraakParser.CIJFERS, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public IS_NUMERIEK_MET_EXACT(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_NUMERIEK_MET_EXACT, 0);
	}
	public IS_NIET_NUMERIEK_MET_EXACT(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_NIET_NUMERIEK_MET_EXACT, 0);
	}
	public ZIJN_NUMERIEK_MET_EXACT(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_NUMERIEK_MET_EXACT, 0);
	}
	public ZIJN_NIET_NUMERIEK_MET_EXACT(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_NIET_NUMERIEK_MET_EXACT, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnaryNumeriekExactCondition) {
	 		listener.enterUnaryNumeriekExactCondition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnaryNumeriekExactCondition) {
	 		listener.exitUnaryNumeriekExactCondition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnaryNumeriekExactCondition) {
			return visitor.visitUnaryNumeriekExactCondition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryRolConditionContext extends UnaryConditionContext {
	public _expr!: PrimaryExpressionContext;
	public _op!: Token;
	public _rol!: IdentifierContext;
	constructor(parser: RegelSpraakParser, ctx: UnaryConditionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public IS_ROL(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_ROL, 0);
	}
	public ZIJN_ROL(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_ROL, 0);
	}
	public IS_NIET_ROL(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_NIET_ROL, 0);
	}
	public ZIJN_NIET_ROL(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_NIET_ROL, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnaryRolCondition) {
	 		listener.enterUnaryRolCondition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnaryRolCondition) {
	 		listener.exitUnaryRolCondition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnaryRolCondition) {
			return visitor.visitUnaryRolCondition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryDagsoortConditionContext extends UnaryConditionContext {
	public _expr!: PrimaryExpressionContext;
	public _op!: Token;
	public _dagsoort!: IdentifierContext;
	constructor(parser: RegelSpraakParser, ctx: UnaryConditionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
	public IS_EEN_DAGSOORT(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_EEN_DAGSOORT, 0);
	}
	public ZIJN_EEN_DAGSOORT(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_EEN_DAGSOORT, 0);
	}
	public IS_GEEN_DAGSOORT(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GEEN_DAGSOORT, 0);
	}
	public ZIJN_GEEN_DAGSOORT(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GEEN_DAGSOORT, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnaryDagsoortCondition) {
	 		listener.enterUnaryDagsoortCondition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnaryDagsoortCondition) {
	 		listener.exitUnaryDagsoortCondition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnaryDagsoortCondition) {
			return visitor.visitUnaryDagsoortCondition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryInconsistentDataConditionContext extends UnaryConditionContext {
	public _expr!: PrimaryExpressionContext;
	constructor(parser: RegelSpraakParser, ctx: UnaryConditionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public IS_INCONSISTENT(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_INCONSISTENT, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnaryInconsistentDataCondition) {
	 		listener.enterUnaryInconsistentDataCondition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnaryInconsistentDataCondition) {
	 		listener.exitUnaryInconsistentDataCondition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnaryInconsistentDataCondition) {
			return visitor.visitUnaryInconsistentDataCondition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class UnaryUniekConditionContext extends UnaryConditionContext {
	public _ref!: OnderwerpReferentieContext;
	constructor(parser: RegelSpraakParser, ctx: UnaryConditionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public MOETEN_UNIEK_ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MOETEN_UNIEK_ZIJN, 0);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterUnaryUniekCondition) {
	 		listener.enterUnaryUniekCondition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitUnaryUniekCondition) {
	 		listener.exitUnaryUniekCondition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitUnaryUniekCondition) {
			return visitor.visitUnaryUniekCondition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RegelStatusConditionContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_regelStatusCondition;
	}
	public copyFrom(ctx: RegelStatusConditionContext): void {
		super.copyFrom(ctx);
	}
}
export class RegelStatusInconsistentCheckContext extends RegelStatusConditionContext {
	public _name!: NaamwoordContext;
	constructor(parser: RegelSpraakParser, ctx: RegelStatusConditionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public REGELVERSIE(): TerminalNode {
		return this.getToken(RegelSpraakParser.REGELVERSIE, 0);
	}
	public IS_INCONSISTENT(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_INCONSISTENT, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRegelStatusInconsistentCheck) {
	 		listener.enterRegelStatusInconsistentCheck(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRegelStatusInconsistentCheck) {
	 		listener.exitRegelStatusInconsistentCheck(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRegelStatusInconsistentCheck) {
			return visitor.visitRegelStatusInconsistentCheck(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class RegelStatusGevuurdCheckContext extends RegelStatusConditionContext {
	public _name!: NaamwoordContext;
	constructor(parser: RegelSpraakParser, ctx: RegelStatusConditionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public REGELVERSIE(): TerminalNode {
		return this.getToken(RegelSpraakParser.REGELVERSIE, 0);
	}
	public IS_GEVUURD(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GEVUURD, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRegelStatusGevuurdCheck) {
	 		listener.enterRegelStatusGevuurdCheck(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRegelStatusGevuurdCheck) {
	 		listener.exitRegelStatusGevuurdCheck(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRegelStatusGevuurdCheck) {
			return visitor.visitRegelStatusGevuurdCheck(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SubordinateClauseExpressionContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_subordinateClauseExpression;
	}
	public copyFrom(ctx: SubordinateClauseExpressionContext): void {
		super.copyFrom(ctx);
	}
}
export class SubordinateIsWithExprContext extends SubordinateClauseExpressionContext {
	public _subject!: OnderwerpReferentieContext;
	public _prepPhrase!: NaamwoordWithNumbersContext;
	public _verb!: Token;
	constructor(parser: RegelSpraakParser, ctx: SubordinateClauseExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		return this.getTypedRuleContext(NaamwoordWithNumbersContext, 0) as NaamwoordWithNumbersContext;
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSubordinateIsWithExpr) {
	 		listener.enterSubordinateIsWithExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSubordinateIsWithExpr) {
	 		listener.exitSubordinateIsWithExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSubordinateIsWithExpr) {
			return visitor.visitSubordinateIsWithExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SubordinateHasExprContext extends SubordinateClauseExpressionContext {
	public _subject!: OnderwerpReferentieContext;
	public _object!: NaamwoordWithNumbersContext;
	public _verb!: Token;
	constructor(parser: RegelSpraakParser, ctx: SubordinateClauseExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		return this.getTypedRuleContext(NaamwoordWithNumbersContext, 0) as NaamwoordWithNumbersContext;
	}
	public HEEFT(): TerminalNode {
		return this.getToken(RegelSpraakParser.HEEFT, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSubordinateHasExpr) {
	 		listener.enterSubordinateHasExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSubordinateHasExpr) {
	 		listener.exitSubordinateHasExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSubordinateHasExpr) {
			return visitor.visitSubordinateHasExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SubordinateIsKenmerkExprContext extends SubordinateClauseExpressionContext {
	public _subject!: OnderwerpReferentieContext;
	public _verb!: Token;
	public _kenmerk!: NaamwoordWithNumbersContext;
	constructor(parser: RegelSpraakParser, ctx: SubordinateClauseExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public naamwoordWithNumbers(): NaamwoordWithNumbersContext {
		return this.getTypedRuleContext(NaamwoordWithNumbersContext, 0) as NaamwoordWithNumbersContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSubordinateIsKenmerkExpr) {
	 		listener.enterSubordinateIsKenmerkExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSubordinateIsKenmerkExpr) {
	 		listener.exitSubordinateIsKenmerkExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSubordinateIsKenmerkExpr) {
			return visitor.visitSubordinateIsKenmerkExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DagsoortDefinitionContext extends ParserRuleContext {
	public _IDENTIFIER!: Token;
	public _plural: Token[] = [];
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public DAGSOORT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DAGSOORT, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public MV_START(): TerminalNode {
		return this.getToken(RegelSpraakParser.MV_START, 0);
	}
	public RPAREN(): TerminalNode {
		return this.getToken(RegelSpraakParser.RPAREN, 0);
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.SEMICOLON, 0);
	}
	public IDENTIFIER_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.IDENTIFIER);
	}
	public IDENTIFIER(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, i);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_dagsoortDefinition;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterDagsoortDefinition) {
	 		listener.enterDagsoortDefinition(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitDagsoortDefinition) {
	 		listener.exitDagsoortDefinition(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitDagsoortDefinition) {
			return visitor.visitDagsoortDefinition(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerdelingResultaatContext extends ParserRuleContext {
	public _sourceAmount!: ExpressieContext;
	public _targetCollection!: ExpressieContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public WORDT_VERDEELD_OVER(): TerminalNode {
		return this.getToken(RegelSpraakParser.WORDT_VERDEELD_OVER, 0);
	}
	public COMMA(): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, 0);
	}
	public WAARBIJ_WORDT_VERDEELD(): TerminalNode {
		return this.getToken(RegelSpraakParser.WAARBIJ_WORDT_VERDEELD, 0);
	}
	public expressie_list(): ExpressieContext[] {
		return this.getTypedRuleContexts(ExpressieContext) as ExpressieContext[];
	}
	public expressie(i: number): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, i) as ExpressieContext;
	}
	public verdelingMethodeSimple(): VerdelingMethodeSimpleContext {
		return this.getTypedRuleContext(VerdelingMethodeSimpleContext, 0) as VerdelingMethodeSimpleContext;
	}
	public verdelingMethodeMultiLine(): VerdelingMethodeMultiLineContext {
		return this.getTypedRuleContext(VerdelingMethodeMultiLineContext, 0) as VerdelingMethodeMultiLineContext;
	}
	public verdelingRest(): VerdelingRestContext {
		return this.getTypedRuleContext(VerdelingRestContext, 0) as VerdelingRestContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_verdelingResultaat;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingResultaat) {
	 		listener.enterVerdelingResultaat(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingResultaat) {
	 		listener.exitVerdelingResultaat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingResultaat) {
			return visitor.visitVerdelingResultaat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerdelingMethodeSimpleContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public verdelingMethode(): VerdelingMethodeContext {
		return this.getTypedRuleContext(VerdelingMethodeContext, 0) as VerdelingMethodeContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_verdelingMethodeSimple;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingMethodeSimple) {
	 		listener.enterVerdelingMethodeSimple(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingMethodeSimple) {
	 		listener.exitVerdelingMethodeSimple(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingMethodeSimple) {
			return visitor.visitVerdelingMethodeSimple(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerdelingMethodeMultiLineContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public COLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.COLON, 0);
	}
	public verdelingMethodeBulletList(): VerdelingMethodeBulletListContext {
		return this.getTypedRuleContext(VerdelingMethodeBulletListContext, 0) as VerdelingMethodeBulletListContext;
	}
	public DOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOT, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_verdelingMethodeMultiLine;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingMethodeMultiLine) {
	 		listener.enterVerdelingMethodeMultiLine(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingMethodeMultiLine) {
	 		listener.exitVerdelingMethodeMultiLine(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingMethodeMultiLine) {
			return visitor.visitVerdelingMethodeMultiLine(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerdelingMethodeBulletListContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public verdelingMethodeBullet_list(): VerdelingMethodeBulletContext[] {
		return this.getTypedRuleContexts(VerdelingMethodeBulletContext) as VerdelingMethodeBulletContext[];
	}
	public verdelingMethodeBullet(i: number): VerdelingMethodeBulletContext {
		return this.getTypedRuleContext(VerdelingMethodeBulletContext, i) as VerdelingMethodeBulletContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_verdelingMethodeBulletList;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingMethodeBulletList) {
	 		listener.enterVerdelingMethodeBulletList(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingMethodeBulletList) {
	 		listener.exitVerdelingMethodeBulletList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingMethodeBulletList) {
			return visitor.visitVerdelingMethodeBulletList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerdelingMethodeBulletContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public MINUS(): TerminalNode {
		return this.getToken(RegelSpraakParser.MINUS, 0);
	}
	public verdelingMethode(): VerdelingMethodeContext {
		return this.getTypedRuleContext(VerdelingMethodeContext, 0) as VerdelingMethodeContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, 0);
	}
	public DOT(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOT, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_verdelingMethodeBullet;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingMethodeBullet) {
	 		listener.enterVerdelingMethodeBullet(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingMethodeBullet) {
	 		listener.exitVerdelingMethodeBullet(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingMethodeBullet) {
			return visitor.visitVerdelingMethodeBullet(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerdelingMethodeContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_verdelingMethode;
	}
	public copyFrom(ctx: VerdelingMethodeContext): void {
		super.copyFrom(ctx);
	}
}
export class VerdelingNaarRatoContext extends VerdelingMethodeContext {
	public _ratioExpression!: ExpressieContext;
	constructor(parser: RegelSpraakParser, ctx: VerdelingMethodeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public NAAR_RATO_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.NAAR_RATO_VAN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingNaarRato) {
	 		listener.enterVerdelingNaarRato(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingNaarRato) {
	 		listener.exitVerdelingNaarRato(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingNaarRato) {
			return visitor.visitVerdelingNaarRato(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VerdelingGelijkeDelenContext extends VerdelingMethodeContext {
	constructor(parser: RegelSpraakParser, ctx: VerdelingMethodeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public IN_GELIJKE_DELEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN_GELIJKE_DELEN, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingGelijkeDelen) {
	 		listener.enterVerdelingGelijkeDelen(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingGelijkeDelen) {
	 		listener.exitVerdelingGelijkeDelen(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingGelijkeDelen) {
			return visitor.visitVerdelingGelijkeDelen(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VerdelingMaximumContext extends VerdelingMethodeContext {
	public _maxExpression!: ExpressieContext;
	constructor(parser: RegelSpraakParser, ctx: VerdelingMethodeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public MET_EEN_MAXIMUM_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.MET_EEN_MAXIMUM_VAN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingMaximum) {
	 		listener.enterVerdelingMaximum(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingMaximum) {
	 		listener.exitVerdelingMaximum(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingMaximum) {
			return visitor.visitVerdelingMaximum(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VerdelingOpVolgordeContext extends VerdelingMethodeContext {
	public _orderDirection!: Token;
	public _orderExpression!: ExpressieContext;
	constructor(parser: RegelSpraakParser, ctx: VerdelingMethodeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public OP_VOLGORDE_VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.OP_VOLGORDE_VAN, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public TOENEMENDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.TOENEMENDE, 0);
	}
	public AFNEMENDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.AFNEMENDE, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingOpVolgorde) {
	 		listener.enterVerdelingOpVolgorde(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingOpVolgorde) {
	 		listener.exitVerdelingOpVolgorde(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingOpVolgorde) {
			return visitor.visitVerdelingOpVolgorde(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VerdelingTieBreakContext extends VerdelingMethodeContext {
	public _tieBreakMethod!: VerdelingMethodeContext;
	constructor(parser: RegelSpraakParser, ctx: VerdelingMethodeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public BIJ_EVEN_GROOT_CRITERIUM(): TerminalNode {
		return this.getToken(RegelSpraakParser.BIJ_EVEN_GROOT_CRITERIUM, 0);
	}
	public verdelingMethode(): VerdelingMethodeContext {
		return this.getTypedRuleContext(VerdelingMethodeContext, 0) as VerdelingMethodeContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingTieBreak) {
	 		listener.enterVerdelingTieBreak(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingTieBreak) {
	 		listener.exitVerdelingTieBreak(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingTieBreak) {
			return visitor.visitVerdelingTieBreak(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class VerdelingAfrondingContext extends VerdelingMethodeContext {
	public _decimals!: Token;
	public _roundDirection!: Token;
	constructor(parser: RegelSpraakParser, ctx: VerdelingMethodeContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public AFGEROND_OP(): TerminalNode {
		return this.getToken(RegelSpraakParser.AFGEROND_OP, 0);
	}
	public DECIMALEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.DECIMALEN, 0);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public NAAR_BENEDEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.NAAR_BENEDEN, 0);
	}
	public NAAR_BOVEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.NAAR_BOVEN, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingAfronding) {
	 		listener.enterVerdelingAfronding(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingAfronding) {
	 		listener.exitVerdelingAfronding(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingAfronding) {
			return visitor.visitVerdelingAfronding(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VerdelingRestContext extends ParserRuleContext {
	public _remainderTarget!: ExpressieContext;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ALS_ONVERDEELDE_REST_BLIJFT(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALS_ONVERDEELDE_REST_BLIJFT, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public OVER_VERDELING(): TerminalNode {
		return this.getToken(RegelSpraakParser.OVER_VERDELING, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_verdelingRest;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterVerdelingRest) {
	 		listener.enterVerdelingRest(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitVerdelingRest) {
	 		listener.exitVerdelingRest(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitVerdelingRest) {
			return visitor.visitVerdelingRest(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
