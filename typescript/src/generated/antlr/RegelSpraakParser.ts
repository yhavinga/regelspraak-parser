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
	public static readonly HET_IS_DE_PERIODE = 7;
	public static readonly WORDT_BEREKEND_ALS = 8;
	public static readonly WORDT_GESTELD_OP = 9;
	public static readonly WORDT_GEINITIALISEERD_OP = 10;
	public static readonly DE_ABSOLUTE_TIJDSDUUR_VAN = 11;
	public static readonly DE_ABSOLUTE_WAARDE_VAN = 12;
	public static readonly DE_MAXIMALE_WAARDE_VAN = 13;
	public static readonly DE_MINIMALE_WAARDE_VAN = 14;
	public static readonly HET_TOTAAL_VAN = 15;
	public static readonly HET_TIJDSEVENREDIG_DEEL_PER = 16;
	public static readonly DE_DATUM_MET = 17;
	public static readonly DE_EERSTE_PAASDAG_VAN = 18;
	public static readonly ALS_ONVERDEELDE_REST_BLIJFT = 19;
	public static readonly MET_EEN_MINIMUM_VAN = 20;
	public static readonly MET_EEN_MAXIMUM_VAN = 21;
	public static readonly GROTER_OF_GELIJK_AAN = 22;
	public static readonly KLEINER_OF_GELIJK_AAN = 23;
	public static readonly LATER_OF_GELIJK_AAN = 24;
	public static readonly EERDER_OF_GELIJK_AAN = 25;
	public static readonly WAARBIJ_WORDT_VERDEELD = 26;
	public static readonly BESTAANDE_UIT = 27;
	public static readonly WEDERKERIG_FEITTYPE = 28;
	public static readonly IS_VAN_HET_TYPE = 29;
	public static readonly CONCATENATIE_VAN = 30;
	public static readonly VOLGEND_CRITERIUM = 31;
	public static readonly VOLGENDE_CRITERIA = 32;
	public static readonly BIJ_EVEN_GROOT_CRITERIUM = 33;
	public static readonly OP_VOLGORDE_VAN = 34;
	public static readonly NAAR_RATO_VAN = 35;
	public static readonly NUMERIEK_MET_EXACT = 36;
	public static readonly AAN_DE_ELFPROEF = 37;
	public static readonly GROTER_IS_DAN = 38;
	public static readonly KLEINER_IS_DAN = 39;
	public static readonly WORDT_VOLDAAN = 40;
	public static readonly ER_WORDT_EEN_NIEUW = 41;
	public static readonly WORDT_EEN_NIEUW = 42;
	public static readonly AANGEMAAKT = 43;
	public static readonly CREEER = 44;
	public static readonly NIEUWE = 45;
	public static readonly ER_AAN = 46;
	public static readonly GELIJK_IS_AAN = 47;
	public static readonly IS_GELIJK_AAN = 48;
	public static readonly IS_ONGELIJK_AAN = 49;
	public static readonly IS_KLEINER_DAN = 50;
	public static readonly IS_KLEINER_OF_GELIJK_AAN = 51;
	public static readonly IS_GROTER_DAN = 52;
	public static readonly IS_GROTER_OF_GELIJK_AAN = 53;
	public static readonly ZIJN_GELIJK_AAN = 54;
	public static readonly ZIJN_ONGELIJK_AAN = 55;
	public static readonly ZIJN_GROTER_DAN = 56;
	public static readonly ZIJN_GROTER_OF_GELIJK_AAN = 57;
	public static readonly ZIJN_KLEINER_DAN = 58;
	public static readonly ZIJN_KLEINER_OF_GELIJK_AAN = 59;
	public static readonly IS_LATER_DAN = 60;
	public static readonly IS_LATER_OF_GELIJK_AAN = 61;
	public static readonly IS_EERDER_DAN = 62;
	public static readonly IS_EERDER_OF_GELIJK_AAN = 63;
	public static readonly ZIJN_LATER_DAN = 64;
	public static readonly ZIJN_LATER_OF_GELIJK_AAN = 65;
	public static readonly ZIJN_EERDER_DAN = 66;
	public static readonly ZIJN_EERDER_OF_GELIJK_AAN = 67;
	public static readonly IS_LEEG = 68;
	public static readonly IS_GEVULD = 69;
	public static readonly ZIJN_LEEG = 70;
	public static readonly ZIJN_GEVULD = 71;
	public static readonly IS_KENMERK = 72;
	public static readonly IS_ROL = 73;
	public static readonly ZIJN_KENMERK = 74;
	public static readonly ZIJN_ROL = 75;
	public static readonly IS_NIET_KENMERK = 76;
	public static readonly IS_NIET_ROL = 77;
	public static readonly ZIJN_NIET_KENMERK = 78;
	public static readonly ZIJN_NIET_ROL = 79;
	public static readonly VOLDOET_AAN_DE_ELFPROEF = 80;
	public static readonly VOLDOEN_AAN_DE_ELFPROEF = 81;
	public static readonly VOLDOET_NIET_AAN_DE_ELFPROEF = 82;
	public static readonly VOLDOEN_NIET_AAN_DE_ELFPROEF = 83;
	public static readonly IS_NUMERIEK_MET_EXACT = 84;
	public static readonly IS_NIET_NUMERIEK_MET_EXACT = 85;
	public static readonly ZIJN_NUMERIEK_MET_EXACT = 86;
	public static readonly ZIJN_NIET_NUMERIEK_MET_EXACT = 87;
	public static readonly IS_EEN_DAGSOORT = 88;
	public static readonly ZIJN_EEN_DAGSOORT = 89;
	public static readonly IS_GEEN_DAGSOORT = 90;
	public static readonly ZIJN_GEEN_DAGSOORT = 91;
	public static readonly MOETEN_UNIEK_ZIJN = 92;
	public static readonly IS_GEVUURD = 93;
	public static readonly IS_INCONSISTENT = 94;
	public static readonly CONSISTENTIEREGEL = 95;
	public static readonly REGEL = 96;
	public static readonly REGELGROEP = 97;
	public static readonly BESLISTABEL = 98;
	public static readonly OBJECTTYPE = 99;
	public static readonly DOMEIN = 100;
	public static readonly LIJST = 101;
	public static readonly DIMENSIE = 102;
	public static readonly EENHEIDSYSTEEM = 103;
	public static readonly PARAMETER = 104;
	public static readonly FEITTYPE = 105;
	public static readonly DAGSOORT = 106;
	public static readonly DAARBIJ_GELDT = 107;
	public static readonly GELDIG = 108;
	public static readonly HEBBEN = 109;
	public static readonly HEEFT = 110;
	public static readonly INDIEN = 111;
	public static readonly IS_RECURSIEF = 112;
	public static readonly IS = 113;
	public static readonly MOET = 114;
	public static readonly MOETEN = 115;
	public static readonly WORDT_VERDEELD_OVER = 116;
	public static readonly ZIJN = 117;
	public static readonly AAN = 118;
	public static readonly AFGEROND_OP = 119;
	public static readonly ALLE = 120;
	public static readonly EERDER_DAN = 121;
	public static readonly GEDEELD_DOOR = 122;
	public static readonly GEDEELD_DOOR_ABS = 123;
	public static readonly GELIJK_AAN = 124;
	public static readonly GEVULD = 125;
	public static readonly GEVUURD = 126;
	public static readonly GROTER_DAN = 127;
	public static readonly INCONSISTENT = 128;
	public static readonly KLEINER_DAN = 129;
	public static readonly LATER_DAN = 130;
	public static readonly LEEG = 131;
	public static readonly MAAL = 132;
	public static readonly MIN = 133;
	public static readonly NAAR_BENEDEN = 134;
	public static readonly NAAR_BOVEN = 135;
	public static readonly NIET = 136;
	public static readonly ONGELIJK_ZIJN_AAN = 137;
	public static readonly ONGELIJK_AAN = 138;
	public static readonly PLUS = 139;
	public static readonly REKENKUNDIG = 140;
	public static readonly RICHTING_NUL = 141;
	public static readonly TOT = 142;
	public static readonly TOT_DE_MACHT = 143;
	public static readonly TOT_EN_MET = 144;
	public static readonly UNIEK = 145;
	public static readonly VANAF = 146;
	public static readonly VERENIGD_MET = 147;
	public static readonly VERMINDERD_MET = 148;
	public static readonly VOLDOEN = 149;
	public static readonly VOLDOET = 150;
	public static readonly WEG_VAN_NUL = 151;
	public static readonly DE_WORTEL_VAN = 152;
	public static readonly TENMINSTE = 153;
	public static readonly TEN_MINSTE = 154;
	public static readonly TEN_HOOGSTE = 155;
	public static readonly PRECIES = 156;
	public static readonly VOORWAARDE = 157;
	public static readonly VOORWAARDEN = 158;
	public static readonly BEZITTELIJK = 159;
	public static readonly BIJVOEGLIJK = 160;
	public static readonly BEZIELD = 161;
	public static readonly BOOLEAN = 162;
	public static readonly CIJFERS = 163;
	public static readonly DATUM_IN_DAGEN = 164;
	public static readonly DECIMALEN = 165;
	public static readonly ENUMERATIE = 166;
	public static readonly GEDIMENSIONEERD_MET = 167;
	public static readonly GEHEEL_GETAL = 168;
	public static readonly GETAL = 169;
	public static readonly KENMERK = 170;
	public static readonly KENMERKEN = 171;
	public static readonly MET = 172;
	public static readonly MET_EENHEID = 173;
	public static readonly MV_START = 174;
	public static readonly NEGATIEF = 175;
	public static readonly NIET_NEGATIEF = 176;
	public static readonly NUMERIEK = 177;
	public static readonly PERCENTAGE = 178;
	public static readonly POSITIEF = 179;
	public static readonly ROL = 180;
	public static readonly ROLLEN = 181;
	public static readonly TEKST = 182;
	public static readonly VOOR_ELK_JAAR = 183;
	public static readonly VOOR_ELKE_DAG = 184;
	public static readonly VOOR_ELKE_MAAND = 185;
	public static readonly AANTAL = 186;
	public static readonly EERSTE_VAN = 187;
	public static readonly IN_HELE = 188;
	public static readonly LAATSTE_VAN = 189;
	public static readonly REEKS_VAN_TEKSTEN_EN_WAARDEN = 190;
	public static readonly SOM_VAN = 191;
	public static readonly TIJDSDUUR_VAN = 192;
	public static readonly AFNEMENDE = 193;
	public static readonly IN_GELIJKE_DELEN = 194;
	public static readonly OVER_VERDELING = 195;
	public static readonly TOENEMENDE = 196;
	public static readonly DRIE_TELWOORD = 197;
	public static readonly EEN_TELWOORD = 198;
	public static readonly GEEN_VAN_DE = 199;
	public static readonly GEEN = 200;
	public static readonly TWEE_TELWOORD = 201;
	public static readonly VIER_TELWOORD = 202;
	public static readonly ALTIJD = 203;
	public static readonly BIJ = 204;
	public static readonly DAG = 205;
	public static readonly DAGEN = 206;
	public static readonly DAT = 207;
	public static readonly DE = 208;
	public static readonly DD_PUNT = 209;
	public static readonly DIE = 210;
	public static readonly EEN = 211;
	public static readonly EN = 212;
	public static readonly HET = 213;
	public static readonly MEERDERE = 214;
	public static readonly HIJ = 215;
	public static readonly IN = 216;
	public static readonly JAAR = 217;
	public static readonly JAREN = 218;
	public static readonly KWARTAAL = 219;
	public static readonly MAAND = 220;
	public static readonly MAANDEN = 221;
	public static readonly MILLISECONDE = 222;
	public static readonly MINUUT = 223;
	public static readonly MINUTEN = 224;
	public static readonly OF = 225;
	public static readonly ONWAAR = 226;
	public static readonly OP = 227;
	public static readonly OUDER = 228;
	public static readonly OVER = 229;
	public static readonly PERIODE = 230;
	public static readonly REKENDATUM = 231;
	public static readonly REKENJAAR = 232;
	public static readonly REGELVERSIE = 233;
	public static readonly SECONDE = 234;
	public static readonly SECONDEN = 235;
	public static readonly TM = 236;
	public static readonly UIT = 237;
	public static readonly UUR = 238;
	public static readonly UREN = 239;
	public static readonly VAN = 240;
	public static readonly VOLGENDE_VOORWAARDE = 241;
	public static readonly VOLGENDE_VOORWAARDEN = 242;
	public static readonly VOLGENDE = 243;
	public static readonly VOOR = 244;
	public static readonly WAAR = 245;
	public static readonly WEEK = 246;
	public static readonly WEKEN = 247;
	public static readonly ER = 248;
	public static readonly METER = 249;
	public static readonly KILOGRAM = 250;
	public static readonly VOET = 251;
	public static readonly POND = 252;
	public static readonly MIJL = 253;
	public static readonly M = 254;
	public static readonly KG = 255;
	public static readonly S = 256;
	public static readonly FT = 257;
	public static readonly LB = 258;
	public static readonly MI = 259;
	public static readonly EURO_SYMBOL = 260;
	public static readonly DOLLAR_SYMBOL = 261;
	public static readonly DEGREE_SYMBOL = 262;
	public static readonly IDENTIFIER = 263;
	public static readonly NUMBER = 264;
	public static readonly EQUALS = 265;
	public static readonly DATE_TIME_LITERAL = 266;
	public static readonly PERCENTAGE_LITERAL = 267;
	public static readonly STRING_LITERAL = 268;
	public static readonly ENUM_LITERAL = 269;
	public static readonly LPAREN = 270;
	public static readonly RPAREN = 271;
	public static readonly LBRACE = 272;
	public static readonly RBRACE = 273;
	public static readonly COMMA = 274;
	public static readonly DOT = 275;
	public static readonly COLON = 276;
	public static readonly SEMICOLON = 277;
	public static readonly SLASH = 278;
	public static readonly PERCENT_SIGN = 279;
	public static readonly BULLET = 280;
	public static readonly ASTERISK = 281;
	public static readonly L_ANGLE_QUOTE = 282;
	public static readonly R_ANGLE_QUOTE = 283;
	public static readonly CARET = 284;
	public static readonly DOUBLE_DOT = 285;
	public static readonly WS = 286;
	public static readonly LINE_COMMENT = 287;
	public static readonly MINUS = 288;
	public static readonly PIPE = 289;
	public static readonly NVT = 290;
	public static readonly WORDT = 291;
	public static readonly VOLDAAN = 292;
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
	public static readonly RULE_simpleExpressie = 124;
	public static readonly RULE_logicalExpression = 125;
	public static readonly RULE_comparisonExpression = 126;
	public static readonly RULE_literalValue = 127;
	public static readonly RULE_gelijkIsAanOperator = 128;
	public static readonly RULE_comparisonOperator = 129;
	public static readonly RULE_additiveExpression = 130;
	public static readonly RULE_additiveOperator = 131;
	public static readonly RULE_multiplicativeExpression = 132;
	public static readonly RULE_multiplicativeOperator = 133;
	public static readonly RULE_powerExpression = 134;
	public static readonly RULE_powerOperator = 135;
	public static readonly RULE_primaryExpression = 136;
	public static readonly RULE_afronding = 137;
	public static readonly RULE_begrenzing = 138;
	public static readonly RULE_begrenzingMinimum = 139;
	public static readonly RULE_begrenzingMaximum = 140;
	public static readonly RULE_conditieBijExpressie = 141;
	public static readonly RULE_periodevergelijkingElementair = 142;
	public static readonly RULE_periodevergelijkingEnkelvoudig = 143;
	public static readonly RULE_periodeDefinitie = 144;
	public static readonly RULE_dateExpression = 145;
	public static readonly RULE_getalAggregatieFunctie = 146;
	public static readonly RULE_datumAggregatieFunctie = 147;
	public static readonly RULE_dimensieSelectie = 148;
	public static readonly RULE_aggregerenOverAlleDimensies = 149;
	public static readonly RULE_aggregerenOverVerzameling = 150;
	public static readonly RULE_aggregerenOverBereik = 151;
	public static readonly RULE_unaryCondition = 152;
	public static readonly RULE_regelStatusCondition = 153;
	public static readonly RULE_subordinateClauseExpression = 154;
	public static readonly RULE_dagsoortDefinition = 155;
	public static readonly RULE_tekstreeksExpr = 156;
	public static readonly RULE_verdelingResultaat = 157;
	public static readonly RULE_verdelingMethodeSimple = 158;
	public static readonly RULE_verdelingMethodeMultiLine = 159;
	public static readonly RULE_verdelingMethodeBulletList = 160;
	public static readonly RULE_verdelingMethodeBullet = 161;
	public static readonly RULE_verdelingMethode = 162;
	public static readonly RULE_verdelingRest = 163;
	public static readonly literalNames: (string | null)[] = [ null, "'(voor het attribuut zonder voorzetsel):'", 
                                                            "'(na het attribuut met voorzetsel'", 
                                                            "'Datum en tijd in millisecondes'", 
                                                            "'gedurende de tijd dat'", 
                                                            "'gedurende het gehele'", 
                                                            "'gedurende de gehele'", 
                                                            null, "'moet berekend worden als'", 
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
                                                             "HET_IS_DE_PERIODE", 
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
		"expressie", "simpleExpressie", "logicalExpression", "comparisonExpression", 
		"literalValue", "gelijkIsAanOperator", "comparisonOperator", "additiveExpression", 
		"additiveOperator", "multiplicativeExpression", "multiplicativeOperator", 
		"powerExpression", "powerOperator", "primaryExpression", "afronding", 
		"begrenzing", "begrenzingMinimum", "begrenzingMaximum", "conditieBijExpressie", 
		"periodevergelijkingElementair", "periodevergelijkingEnkelvoudig", "periodeDefinitie", 
		"dateExpression", "getalAggregatieFunctie", "datumAggregatieFunctie", 
		"dimensieSelectie", "aggregerenOverAlleDimensies", "aggregerenOverVerzameling", 
		"aggregerenOverBereik", "unaryCondition", "regelStatusCondition", "subordinateClauseExpression", 
		"dagsoortDefinition", "tekstreeksExpr", "verdelingResultaat", "verdelingMethodeSimple", 
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
			this.state = 336;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===28 || ((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 4031) !== 0)) {
				{
				this.state = 334;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 28:
				case 99:
				case 100:
				case 102:
				case 104:
				case 105:
				case 106:
					{
					this.state = 328;
					this.definitie();
					}
					break;
				case 96:
					{
					this.state = 329;
					this.regel();
					}
					break;
				case 97:
					{
					this.state = 330;
					this.regelGroep();
					}
					break;
				case 98:
					{
					this.state = 331;
					this.beslistabel();
					}
					break;
				case 95:
					{
					this.state = 332;
					this.consistentieregel();
					}
					break;
				case 103:
					{
					this.state = 333;
					this.eenheidsysteemDefinition();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 338;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 339;
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
			this.state = 347;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 99:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 341;
				this.objectTypeDefinition();
				}
				break;
			case 100:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 342;
				this.domeinDefinition();
				}
				break;
			case 104:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 343;
				this.parameterDefinition();
				}
				break;
			case 102:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 344;
				this.dimensieDefinition();
				}
				break;
			case 28:
			case 105:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 345;
				this.feitTypeDefinition();
				}
				break;
			case 106:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 346;
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
			this.state = 349;
			this.match(RegelSpraakParser.BESLISTABEL);
			this.state = 350;
			this.naamwoord();
			this.state = 352;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===108) {
				{
				this.state = 351;
				this.regelVersie();
				}
			}

			this.state = 354;
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
			this.state = 356;
			this.beslistabelHeader();
			this.state = 357;
			this.beslistabelSeparator();
			this.state = 359;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 358;
				this.beslistabelRow();
				}
				}
				this.state = 361;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===289);
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
			this.state = 363;
			this.match(RegelSpraakParser.PIPE);
			this.state = 365;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===289) {
				{
				this.state = 364;
				this.match(RegelSpraakParser.PIPE);
				}
			}

			this.state = 367;
			localctx._resultColumn = this.beslistabelColumnText();
			this.state = 368;
			this.match(RegelSpraakParser.PIPE);
			this.state = 369;
			localctx._beslistabelColumnText = this.beslistabelColumnText();
			localctx._conditionColumns.push(localctx._beslistabelColumnText);
			this.state = 374;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 6, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 370;
					this.match(RegelSpraakParser.PIPE);
					this.state = 371;
					localctx._beslistabelColumnText = this.beslistabelColumnText();
					localctx._conditionColumns.push(localctx._beslistabelColumnText);
					}
					}
				}
				this.state = 376;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 6, this._ctx);
			}
			this.state = 378;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				{
				this.state = 377;
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
			this.state = 381;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===289) {
				{
				this.state = 380;
				this.match(RegelSpraakParser.PIPE);
				}
			}

			this.state = 391;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 384;
					this._errHandler.sync(this);
					_alt = 1;
					do {
						switch (_alt) {
						case 1:
							{
							{
							this.state = 383;
							this.match(RegelSpraakParser.MINUS);
							}
							}
							break;
						default:
							throw new NoViableAltException(this);
						}
						this.state = 386;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 9, this._ctx);
					} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
					this.state = 389;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 10, this._ctx) ) {
					case 1:
						{
						this.state = 388;
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
				this.state = 393;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 11, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			this.state = 398;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===288) {
				{
				{
				this.state = 395;
				this.match(RegelSpraakParser.MINUS);
				}
				}
				this.state = 400;
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
			this.state = 401;
			this.match(RegelSpraakParser.PIPE);
			this.state = 402;
			localctx._rowNumber = this.match(RegelSpraakParser.NUMBER);
			this.state = 403;
			this.match(RegelSpraakParser.PIPE);
			this.state = 404;
			localctx._resultExpression = this.expressie();
			this.state = 405;
			this.match(RegelSpraakParser.PIPE);
			this.state = 406;
			localctx._beslistabelCellValue = this.beslistabelCellValue();
			localctx._conditionValues.push(localctx._beslistabelCellValue);
			this.state = 411;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 407;
					this.match(RegelSpraakParser.PIPE);
					this.state = 408;
					localctx._beslistabelCellValue = this.beslistabelCellValue();
					localctx._conditionValues.push(localctx._beslistabelCellValue);
					}
					}
				}
				this.state = 413;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
			}
			this.state = 415;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 14, this._ctx) ) {
			case 1:
				{
				this.state = 414;
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
			this.state = 419;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 7:
			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 16:
			case 17:
			case 18:
			case 30:
			case 45:
			case 96:
			case 110:
			case 113:
			case 117:
			case 120:
			case 128:
			case 133:
			case 136:
			case 152:
			case 157:
			case 186:
			case 187:
			case 189:
			case 191:
			case 192:
			case 197:
			case 198:
			case 201:
			case 202:
			case 205:
			case 206:
			case 208:
			case 211:
			case 213:
			case 215:
			case 217:
			case 219:
			case 220:
			case 226:
			case 228:
			case 230:
			case 231:
			case 233:
			case 245:
			case 249:
			case 263:
			case 264:
			case 266:
			case 267:
			case 268:
			case 269:
			case 270:
			case 288:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 417;
				this.expressie();
				}
				break;
			case 290:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 418;
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
			this.state = 422;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 421;
					_la = this._input.LA(1);
					if(_la<=0 || _la===289) {
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
				this.state = 424;
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
			this.state = 426;
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
			this.state = 428;
			_la = this._input.LA(1);
			if(!(((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16924673) !== 0) || _la===128 || _la===157 || ((((_la - 186)) & ~0x1F) === 0 && ((1 << (_la - 186)) & 2149160961) !== 0) || ((((_la - 219)) & ~0x1F) === 0 && ((1 << (_la - 219)) & 1073744387) !== 0) || _la===263)) {
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
			this.state = 430;
			_la = this._input.LA(1);
			if(!(((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16793601) !== 0) || _la===128 || _la===157 || ((((_la - 186)) & ~0x1F) === 0 && ((1 << (_la - 186)) & 2149160961) !== 0) || ((((_la - 219)) & ~0x1F) === 0 && ((1 << (_la - 219)) & 1073744387) !== 0) || _la===263)) {
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
			this.state = 489;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 27, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 433;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===117 || ((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0)) {
					{
					this.state = 432;
					_la = this._input.LA(1);
					if(!(_la===117 || ((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0))) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 436;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 435;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 438;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 18, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 441;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 440;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 443;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 19, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 445;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 447;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 446;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 449;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 20, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 451;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 453;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 452;
					this.identifierOrKeyword();
					}
					}
					this.state = 455;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16924673) !== 0) || _la===128 || _la===157 || ((((_la - 186)) & ~0x1F) === 0 && ((1 << (_la - 186)) & 2149160961) !== 0) || ((((_la - 219)) & ~0x1F) === 0 && ((1 << (_la - 219)) & 1073744387) !== 0) || _la===263);
				this.state = 457;
				this.match(RegelSpraakParser.MET);
				this.state = 459;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 458;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 461;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 22, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 464;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 463;
					this.identifierOrKeyword();
					}
					}
					this.state = 466;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16924673) !== 0) || _la===128 || _la===157 || ((((_la - 186)) & ~0x1F) === 0 && ((1 << (_la - 186)) & 2149160961) !== 0) || ((((_la - 219)) & ~0x1F) === 0 && ((1 << (_la - 219)) & 1073744387) !== 0) || _la===263);
				this.state = 468;
				this.match(RegelSpraakParser.MET);
				this.state = 470;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 469;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 472;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 24, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 474;
				this.match(RegelSpraakParser.NIET);
				this.state = 476;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 475;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 478;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 25, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 480;
				this.match(RegelSpraakParser.HET);
				this.state = 481;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 482;
				this.match(RegelSpraakParser.DAGEN);
				this.state = 483;
				this.match(RegelSpraakParser.IN);
				this.state = 485;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 484;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 487;
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
			this.state = 548;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 38, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 492;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===117 || ((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0)) {
					{
					this.state = 491;
					_la = this._input.LA(1);
					if(!(_la===117 || ((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0))) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 495;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 494;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 497;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 29, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 500;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 499;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 502;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 30, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 504;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 506;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 505;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 508;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 31, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 510;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 512;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 511;
					this.identifierOrKeywordWithNumbers();
					}
					}
					this.state = 514;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16924673) !== 0) || _la===128 || _la===157 || ((((_la - 186)) & ~0x1F) === 0 && ((1 << (_la - 186)) & 2149160961) !== 0) || ((((_la - 219)) & ~0x1F) === 0 && ((1 << (_la - 219)) & 1073744387) !== 0) || _la===263 || _la===264);
				this.state = 516;
				this.match(RegelSpraakParser.MET);
				this.state = 518;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 517;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 520;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 33, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 523;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 522;
					this.identifierOrKeywordWithNumbers();
					}
					}
					this.state = 525;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16924673) !== 0) || _la===128 || _la===157 || ((((_la - 186)) & ~0x1F) === 0 && ((1 << (_la - 186)) & 2149160961) !== 0) || ((((_la - 219)) & ~0x1F) === 0 && ((1 << (_la - 219)) & 1073744387) !== 0) || _la===263 || _la===264);
				this.state = 527;
				this.match(RegelSpraakParser.MET);
				this.state = 529;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 528;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 531;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 35, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 533;
				this.match(RegelSpraakParser.NIET);
				this.state = 535;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 534;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 537;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 36, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 539;
				this.match(RegelSpraakParser.HET);
				this.state = 540;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 541;
				this.match(RegelSpraakParser.DAGEN);
				this.state = 542;
				this.match(RegelSpraakParser.IN);
				this.state = 544;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 543;
						this.identifierOrKeywordWithNumbers();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 546;
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
			this.state = 552;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 96:
			case 110:
			case 113:
			case 120:
			case 128:
			case 157:
			case 186:
			case 197:
			case 198:
			case 201:
			case 202:
			case 205:
			case 206:
			case 217:
			case 219:
			case 220:
			case 228:
			case 230:
			case 249:
			case 263:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 550;
				this.identifierOrKeyword();
				}
				break;
			case 264:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 551;
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
			this.state = 602;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 49, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 555;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===117 || ((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0)) {
					{
					this.state = 554;
					_la = this._input.LA(1);
					if(!(_la===117 || ((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0))) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 558;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 557;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 560;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 41, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 563;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 562;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 565;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 42, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 567;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 569;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 568;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 571;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 573;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 575;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 574;
					this.identifierOrKeywordNoIs();
					}
					}
					this.state = 577;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16793601) !== 0) || _la===128 || _la===157 || ((((_la - 186)) & ~0x1F) === 0 && ((1 << (_la - 186)) & 2149160961) !== 0) || ((((_la - 219)) & ~0x1F) === 0 && ((1 << (_la - 219)) & 1073744387) !== 0) || _la===263);
				this.state = 579;
				this.match(RegelSpraakParser.MET);
				this.state = 581;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 580;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 583;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 45, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 586;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 585;
					this.identifierOrKeywordNoIs();
					}
					}
					this.state = 588;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16793601) !== 0) || _la===128 || _la===157 || ((((_la - 186)) & ~0x1F) === 0 && ((1 << (_la - 186)) & 2149160961) !== 0) || ((((_la - 219)) & ~0x1F) === 0 && ((1 << (_la - 219)) & 1073744387) !== 0) || _la===263);
				this.state = 590;
				this.match(RegelSpraakParser.MET);
				this.state = 592;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 591;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 594;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 47, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 596;
				this.match(RegelSpraakParser.NIET);
				this.state = 598;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 597;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 600;
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
			this.state = 604;
			this.naamPhrase();
			this.state = 610;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 50, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 605;
					this.voorzetsel();
					this.state = 606;
					this.naamPhrase();
					}
					}
				}
				this.state = 612;
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
			this.state = 613;
			this.naamPhraseWithNumbers();
			this.state = 619;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 51, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 614;
					this.voorzetsel();
					this.state = 615;
					this.naamPhraseWithNumbers();
					}
					}
				}
				this.state = 621;
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
			this.state = 622;
			this.naamPhraseNoIs();
			this.state = 628;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 52, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 623;
					this.voorzetsel();
					this.state = 624;
					this.naamPhraseNoIs();
					}
					}
				}
				this.state = 630;
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
			this.state = 631;
			_la = this._input.LA(1);
			if(!(((((_la - 142)) & ~0x1F) === 0 && ((1 << (_la - 142)) & 1073741829) !== 0) || ((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & 44044545) !== 0) || ((((_la - 237)) & ~0x1F) === 0 && ((1 << (_la - 237)) & 137) !== 0))) {
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
			this.state = 633;
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
			this.state = 635;
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
			this.state = 637;
			_la = this._input.LA(1);
			if(!(((((_la - 205)) & ~0x1F) === 0 && ((1 << (_la - 205)) & 1611509763) !== 0) || ((((_la - 238)) & ~0x1F) === 0 && ((1 << (_la - 238)) & 771) !== 0))) {
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
			this.state = 639;
			this.match(RegelSpraakParser.OBJECTTYPE);
			this.state = 640;
			this.naamwoordNoIs();
			this.state = 648;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===174) {
				{
				this.state = 641;
				this.match(RegelSpraakParser.MV_START);
				this.state = 643;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 642;
					localctx._IDENTIFIER = this.match(RegelSpraakParser.IDENTIFIER);
					localctx._plural.push(localctx._IDENTIFIER);
					}
					}
					this.state = 645;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===263);
				this.state = 647;
				this.match(RegelSpraakParser.RPAREN);
				}
			}

			this.state = 651;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===161) {
				{
				this.state = 650;
				this.match(RegelSpraakParser.BEZIELD);
				}
			}

			this.state = 656;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 56, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 653;
					this.objectTypeMember();
					}
					}
				}
				this.state = 658;
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
			this.state = 661;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 57, this._ctx) ) {
			case 1:
				{
				this.state = 659;
				this.kenmerkSpecificatie();
				}
				break;
			case 2:
				{
				this.state = 660;
				this.attribuutSpecificatie();
				}
				break;
			}
			this.state = 663;
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
			this.state = 670;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 59, this._ctx) ) {
			case 1:
				{
				this.state = 666;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===113) {
					{
					this.state = 665;
					this.match(RegelSpraakParser.IS);
					}
				}

				this.state = 668;
				this.identifier();
				}
				break;
			case 2:
				{
				this.state = 669;
				this.naamwoordWithNumbers();
				}
				break;
			}
			this.state = 672;
			this.match(RegelSpraakParser.KENMERK);
			this.state = 674;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===159 || _la===160) {
				{
				this.state = 673;
				_la = this._input.LA(1);
				if(!(_la===159 || _la===160)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 677;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 183)) & ~0x1F) === 0 && ((1 << (_la - 183)) & 7) !== 0)) {
				{
				this.state = 676;
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
			this.state = 679;
			this.naamwoordWithNumbers();
			this.state = 683;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 62, this._ctx) ) {
			case 1:
				{
				this.state = 680;
				this.datatype();
				}
				break;
			case 2:
				{
				this.state = 681;
				this.domeinRef();
				}
				break;
			case 3:
				{
				this.state = 682;
				this.objectTypeRef();
				}
				break;
			}
			this.state = 687;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===173) {
				{
				this.state = 685;
				this.match(RegelSpraakParser.MET_EENHEID);
				this.state = 686;
				this.unitIdentifier();
				}
			}

			this.state = 698;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===167) {
				{
				this.state = 689;
				this.match(RegelSpraakParser.GEDIMENSIONEERD_MET);
				this.state = 690;
				this.dimensieRef();
				this.state = 695;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===212) {
					{
					{
					this.state = 691;
					this.match(RegelSpraakParser.EN);
					this.state = 692;
					this.dimensieRef();
					}
					}
					this.state = 697;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 701;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 183)) & ~0x1F) === 0 && ((1 << (_la - 183)) & 7) !== 0)) {
				{
				this.state = 700;
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
			this.state = 709;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 177:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 703;
				this.numeriekDatatype();
				}
				break;
			case 182:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 704;
				this.tekstDatatype();
				}
				break;
			case 162:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 705;
				this.booleanDatatype();
				}
				break;
			case 3:
			case 164:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 706;
				this.datumTijdDatatype();
				}
				break;
			case 101:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 707;
				this.lijstDatatype();
				}
				break;
			case 178:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 708;
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
			this.state = 711;
			this.match(RegelSpraakParser.LIJST);
			this.state = 712;
			this.match(RegelSpraakParser.VAN);
			this.state = 716;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 68, this._ctx) ) {
			case 1:
				{
				this.state = 713;
				this.datatype();
				}
				break;
			case 2:
				{
				this.state = 714;
				this.domeinRef();
				}
				break;
			case 3:
				{
				this.state = 715;
				this.objectTypeRef();
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
	public numeriekDatatype(): NumeriekDatatypeContext {
		let localctx: NumeriekDatatypeContext = new NumeriekDatatypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 58, RegelSpraakParser.RULE_numeriekDatatype);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 718;
			this.match(RegelSpraakParser.NUMERIEK);
			this.state = 723;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===270) {
				{
				this.state = 719;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 720;
				this.getalSpecificatie();
				this.state = 721;
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
			this.state = 725;
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
			this.state = 727;
			this.match(RegelSpraakParser.PERCENTAGE);
			this.state = 732;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===270) {
				{
				this.state = 728;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 729;
				this.getalSpecificatie();
				this.state = 730;
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
			this.state = 734;
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
			this.state = 736;
			_la = this._input.LA(1);
			if(!(_la===3 || _la===164)) {
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
			this.state = 739;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 175)) & ~0x1F) === 0 && ((1 << (_la - 175)) & 19) !== 0)) {
				{
				this.state = 738;
				_la = this._input.LA(1);
				if(!(((((_la - 175)) & ~0x1F) === 0 && ((1 << (_la - 175)) & 19) !== 0))) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 747;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 72, this._ctx) ) {
			case 1:
				{
				this.state = 741;
				this.match(RegelSpraakParser.GEHEEL_GETAL);
				}
				break;
			case 2:
				{
				{
				this.state = 742;
				this.match(RegelSpraakParser.GETAL);
				this.state = 743;
				this.match(RegelSpraakParser.MET);
				this.state = 744;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 745;
				this.match(RegelSpraakParser.DECIMALEN);
				}
				}
				break;
			case 3:
				{
				this.state = 746;
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
			this.state = 749;
			this.match(RegelSpraakParser.DOMEIN);
			this.state = 750;
			localctx._name = this.match(RegelSpraakParser.IDENTIFIER);
			this.state = 751;
			this.match(RegelSpraakParser.IS_VAN_HET_TYPE);
			this.state = 752;
			this.domeinType();
			this.state = 755;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===173) {
				{
				this.state = 753;
				this.match(RegelSpraakParser.MET_EENHEID);
				this.state = 754;
				this.eenheidExpressie();
				}
			}

			this.state = 758;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===277) {
				{
				this.state = 757;
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
			this.state = 765;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 166:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 760;
				this.enumeratieSpecificatie();
				}
				break;
			case 177:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 761;
				this.numeriekDatatype();
				}
				break;
			case 182:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 762;
				this.tekstDatatype();
				}
				break;
			case 162:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 763;
				this.booleanDatatype();
				}
				break;
			case 3:
			case 164:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 764;
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
			this.state = 767;
			this.match(RegelSpraakParser.ENUMERATIE);
			this.state = 769;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 768;
				this.match(RegelSpraakParser.ENUM_LITERAL);
				}
				}
				this.state = 771;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===269);
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
			this.state = 773;
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
			this.state = 775;
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
			this.state = 777;
			this.match(RegelSpraakParser.EENHEIDSYSTEEM);
			this.state = 778;
			localctx._name = this.identifier();
			this.state = 782;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===208 || _la===213) {
				{
				{
				this.state = 779;
				this.eenheidEntry();
				}
				}
				this.state = 784;
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
			this.state = 785;
			_la = this._input.LA(1);
			if(!(_la===208 || _la===213)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 786;
			localctx._unitName = this.unitIdentifier();
			this.state = 791;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===174) {
				{
				this.state = 787;
				this.match(RegelSpraakParser.MV_START);
				this.state = 788;
				localctx._pluralName = this.unitIdentifier();
				this.state = 789;
				this.match(RegelSpraakParser.RPAREN);
				}
			}

			this.state = 793;
			localctx._abbrev = this.unitIdentifier();
			this.state = 795;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===133 || ((((_la - 205)) & ~0x1F) === 0 && ((1 << (_la - 205)) & 1611657219) !== 0) || ((((_la - 238)) & ~0x1F) === 0 && ((1 << (_la - 238)) & 67107587) !== 0)) {
				{
				this.state = 794;
				localctx._symbol_ = this.unitIdentifier();
				}
			}

			this.state = 803;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===265) {
				{
				this.state = 797;
				this.match(RegelSpraakParser.EQUALS);
				this.state = 799;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===278) {
					{
					this.state = 798;
					this.match(RegelSpraakParser.SLASH);
					}
				}

				this.state = 801;
				localctx._value = this.match(RegelSpraakParser.NUMBER);
				this.state = 802;
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
			this.state = 805;
			_la = this._input.LA(1);
			if(!(_la===133 || ((((_la - 205)) & ~0x1F) === 0 && ((1 << (_la - 205)) & 1611657219) !== 0) || ((((_la - 238)) & ~0x1F) === 0 && ((1 << (_la - 238)) & 67107587) !== 0))) {
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
			this.state = 816;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 83, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 807;
				this.eenheidMacht();
				this.state = 810;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===278) {
					{
					this.state = 808;
					this.match(RegelSpraakParser.SLASH);
					this.state = 809;
					this.eenheidMacht();
					}
				}

				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 812;
				this.match(RegelSpraakParser.NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 813;
				this.match(RegelSpraakParser.PERCENT_SIGN);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 814;
				this.match(RegelSpraakParser.EURO_SYMBOL);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 815;
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
			this.state = 818;
			this.unitIdentifier();
			this.state = 821;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===284) {
				{
				this.state = 819;
				this.match(RegelSpraakParser.CARET);
				this.state = 820;
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
			this.state = 823;
			this.match(RegelSpraakParser.DIMENSIE);
			this.state = 824;
			this.naamwoord();
			this.state = 826;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===274) {
				{
				this.state = 825;
				this.match(RegelSpraakParser.COMMA);
				}
			}

			this.state = 828;
			this.match(RegelSpraakParser.BESTAANDE_UIT);
			this.state = 829;
			localctx._dimensieNaamMeervoud = this.naamwoord();
			this.state = 830;
			this.voorzetselSpecificatie();
			this.state = 832;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 831;
				this.labelWaardeSpecificatie();
				}
				}
				this.state = 834;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===264);
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
			this.state = 843;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 2:
				this.enterOuterAlt(localctx, 1);
				{
				{
				this.state = 836;
				this.match(RegelSpraakParser.NA_HET_ATTRIBUUT_MET_VOORZETSEL);
				this.state = 837;
				localctx._vz = this.voorzetsel();
				this.state = 838;
				this.match(RegelSpraakParser.RPAREN);
				this.state = 840;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===276) {
					{
					this.state = 839;
					this.match(RegelSpraakParser.COLON);
					}
				}

				}
				}
				break;
			case 1:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 842;
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
			this.state = 845;
			this.match(RegelSpraakParser.NUMBER);
			this.state = 846;
			this.match(RegelSpraakParser.DOT);
			this.state = 847;
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
			this.state = 849;
			_la = this._input.LA(1);
			if(!(((((_la - 183)) & ~0x1F) === 0 && ((1 << (_la - 183)) & 7) !== 0))) {
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
			this.state = 851;
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
			this.state = 853;
			this.match(RegelSpraakParser.PARAMETER);
			this.state = 854;
			this.parameterNamePhrase();
			this.state = 855;
			this.match(RegelSpraakParser.COLON);
			this.state = 858;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 3:
			case 101:
			case 162:
			case 164:
			case 177:
			case 178:
			case 182:
				{
				this.state = 856;
				this.datatype();
				}
				break;
			case 263:
				{
				this.state = 857;
				this.domeinRef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 862;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===173) {
				{
				this.state = 860;
				this.match(RegelSpraakParser.MET_EENHEID);
				this.state = 861;
				this.eenheidExpressie();
				}
			}

			this.state = 866;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===113) {
				{
				this.state = 864;
				this.match(RegelSpraakParser.IS);
				this.state = 865;
				this.expressie();
				}
			}

			this.state = 869;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 183)) & ~0x1F) === 0 && ((1 << (_la - 183)) & 7) !== 0)) {
				{
				this.state = 868;
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
			this.state = 872;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===208 || _la===213) {
				{
				this.state = 871;
				_la = this._input.LA(1);
				if(!(_la===208 || _la===213)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 874;
			this.parameterNamePart();
			this.state = 880;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 142)) & ~0x1F) === 0 && ((1 << (_la - 142)) & 1073741829) !== 0) || ((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & 44044545) !== 0) || ((((_la - 237)) & ~0x1F) === 0 && ((1 << (_la - 237)) & 137) !== 0)) {
				{
				{
				this.state = 875;
				this.voorzetsel();
				this.state = 876;
				this.parameterNamePart();
				}
				}
				this.state = 882;
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
			this.state = 884;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 883;
					_la = this._input.LA(1);
					if(!(_la===186 || _la===263 || _la===264)) {
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
				this.state = 886;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 95, this._ctx);
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
			this.state = 901;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 98, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 889;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===208 || _la===213) {
					{
					this.state = 888;
					_la = this._input.LA(1);
					if(!(_la===208 || _la===213)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 891;
				this.parameterNamePart();
				this.state = 897;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 97, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 892;
						this.voorzetsel();
						this.state = 893;
						this.parameterNamePart();
						}
						}
					}
					this.state = 899;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 97, this._ctx);
				}
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 900;
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
			this.state = 918;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 105:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 903;
				this.match(RegelSpraakParser.FEITTYPE);
				this.state = 904;
				localctx._feittypenaam = this.naamwoord();
				this.state = 905;
				this.rolDefinition();
				this.state = 907;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 906;
						this.rolDefinition();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 909;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 99, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				this.state = 911;
				this.cardinalityLine();
				}
				break;
			case 28:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 913;
				this.match(RegelSpraakParser.WEDERKERIG_FEITTYPE);
				this.state = 914;
				localctx._feittypenaam = this.naamwoord();
				this.state = 915;
				this.rolDefinition();
				this.state = 916;
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
			this.state = 920;
			localctx._article = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(_la===208 || _la===213)) {
			    localctx._article = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 921;
			localctx._content = this.rolContentWords();
			this.state = 926;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 101, this._ctx) ) {
			case 1:
				{
				this.state = 922;
				this.match(RegelSpraakParser.MV_START);
				this.state = 923;
				localctx._meervoud = this.naamwoord();
				this.state = 924;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			}
			this.state = 929;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 102, this._ctx) ) {
			case 1:
				{
				this.state = 928;
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
			this.state = 932;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 931;
					this.identifierOrKeyword();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 934;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 103, this._ctx);
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
			this.state = 938;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 938;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 96:
					case 110:
					case 113:
					case 120:
					case 128:
					case 157:
					case 186:
					case 197:
					case 198:
					case 201:
					case 202:
					case 205:
					case 206:
					case 217:
					case 219:
					case 220:
					case 228:
					case 230:
					case 249:
					case 263:
						{
						this.state = 936;
						this.identifierOrKeyword();
						}
						break;
					case 142:
					case 144:
					case 172:
					case 204:
					case 212:
					case 216:
					case 225:
					case 227:
					case 229:
					case 237:
					case 240:
					case 244:
						{
						this.state = 937;
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
				this.state = 940;
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
	public cardinalityLine(): CardinalityLineContext {
		let localctx: CardinalityLineContext = new CardinalityLineContext(this, this._ctx, this.state);
		this.enterRule(localctx, 116, RegelSpraakParser.RULE_cardinalityLine);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 943;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 942;
					this.cardinalityWord();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 945;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 106, this._ctx);
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
			this.state = 947;
			_la = this._input.LA(1);
			if(_la<=0 || _la===28 || ((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 4027) !== 0) || _la===277) {
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
			this.state = 949;
			this.match(RegelSpraakParser.REGEL);
			this.state = 950;
			this.regelName();
			this.state = 952;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===264) {
				{
				this.state = 951;
				this.match(RegelSpraakParser.NUMBER);
				}
			}

			this.state = 954;
			this.regelVersie();
			this.state = 955;
			this.resultaatDeel();
			this.state = 961;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 111:
				{
				this.state = 956;
				this.voorwaardeDeel();
				this.state = 958;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===275) {
					{
					this.state = 957;
					this.match(RegelSpraakParser.DOT);
					}
				}

				}
				break;
			case 275:
				{
				this.state = 960;
				this.match(RegelSpraakParser.DOT);
				}
				break;
			case -1:
			case 28:
			case 95:
			case 96:
			case 97:
			case 98:
			case 99:
			case 100:
			case 102:
			case 103:
			case 104:
			case 105:
			case 106:
			case 107:
				break;
			default:
				break;
			}
			this.state = 964;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===107) {
				{
				this.state = 963;
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
			this.state = 966;
			this.match(RegelSpraakParser.REGELGROEP);
			this.state = 967;
			this.naamwoord();
			this.state = 969;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===112) {
				{
				this.state = 968;
				localctx._isRecursive = this.match(RegelSpraakParser.IS_RECURSIEF);
				}
			}

			this.state = 973;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 973;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 96:
						{
						this.state = 971;
						this.regel();
						}
						break;
					case 95:
						{
						this.state = 972;
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
				this.state = 975;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 113, this._ctx);
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
			this.state = 977;
			this.naamwoordWithNumbers();
			this.state = 981;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===113 || ((((_la - 194)) & ~0x1F) === 0 && ((1 << (_la - 194)) & 262209) !== 0) || _la===274) {
				{
				{
				this.state = 978;
				this.regelNameExtension();
				}
				}
				this.state = 983;
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
			this.state = 998;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 115, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 984;
				this.match(RegelSpraakParser.IN_GELIJKE_DELEN);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 985;
				this.match(RegelSpraakParser.COMMA);
				this.state = 986;
				this.naamwoordWithNumbers();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 987;
				this.match(RegelSpraakParser.COMMA);
				this.state = 988;
				this.match(RegelSpraakParser.MET);
				this.state = 989;
				this.naamwoordWithNumbers();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 990;
				this.match(RegelSpraakParser.EN);
				this.state = 991;
				this.naamwoordWithNumbers();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 992;
				this.match(RegelSpraakParser.IS);
				this.state = 993;
				this.naamwoordWithNumbers();
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 994;
				this.match(RegelSpraakParser.GEEN);
				this.state = 995;
				this.naamwoordWithNumbers();
				this.state = 996;
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
			this.state = 1000;
			this.match(RegelSpraakParser.GELDIG);
			this.state = 1001;
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
			this.state = 1010;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 203:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1003;
				this.match(RegelSpraakParser.ALTIJD);
				}
				break;
			case 146:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1004;
				this.match(RegelSpraakParser.VANAF);
				this.state = 1005;
				this.datumLiteral();
				this.state = 1008;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===144 || _la===236) {
					{
					this.state = 1006;
					_la = this._input.LA(1);
					if(!(_la===144 || _la===236)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					this.state = 1007;
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
			this.state = 1052;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 121, this._ctx) ) {
			case 1:
				localctx = new DagsoortdefinitieResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1012;
				this.match(RegelSpraakParser.EEN);
				this.state = 1013;
				this.match(RegelSpraakParser.DAG);
				this.state = 1014;
				this.match(RegelSpraakParser.IS);
				this.state = 1015;
				this.match(RegelSpraakParser.EEN);
				this.state = 1016;
				this.naamwoord();
				}
				break;
			case 2:
				localctx = new GelijkstellingResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1017;
				this.attribuutReferentie();
				this.state = 1024;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 8:
					{
					this.state = 1018;
					this.match(RegelSpraakParser.WORDT_BEREKEND_ALS);
					this.state = 1019;
					this.expressie();
					}
					break;
				case 9:
					{
					this.state = 1020;
					this.match(RegelSpraakParser.WORDT_GESTELD_OP);
					this.state = 1021;
					this.expressie();
					}
					break;
				case 10:
					{
					this.state = 1022;
					this.match(RegelSpraakParser.WORDT_GEINITIALISEERD_OP);
					this.state = 1023;
					this.expressie();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1027;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 142)) & ~0x1F) === 0 && ((1 << (_la - 142)) & 21) !== 0) || _la===240) {
					{
					this.state = 1026;
					this.periodeDefinitie();
					}
				}

				}
				break;
			case 3:
				localctx = new ConsistencyCheckResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1029;
				this.attribuutReferentie();
				this.state = 1030;
				this.match(RegelSpraakParser.MOET);
				this.state = 1031;
				this.consistencyOperator();
				this.state = 1032;
				this.expressie();
				}
				break;
			case 4:
				localctx = new FeitCreatieResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1034;
				this.feitCreatiePattern();
				}
				break;
			case 5:
				localctx = new KenmerkFeitResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1035;
				this.onderwerpReferentie();
				this.state = 1036;
				_la = this._input.LA(1);
				if(!(_la===110 || _la===113)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1037;
				this.kenmerkNaam();
				this.state = 1039;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 142)) & ~0x1F) === 0 && ((1 << (_la - 142)) & 21) !== 0) || _la===240) {
					{
					this.state = 1038;
					this.periodeDefinitie();
					}
				}

				}
				break;
			case 6:
				localctx = new RelationshipWithAttributeResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1041;
				this.onderwerpReferentie();
				this.state = 1042;
				this.match(RegelSpraakParser.HEEFT);
				this.state = 1043;
				_la = this._input.LA(1);
				if(!(_la===208 || _la===213)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1044;
				this.naamwoord();
				this.state = 1045;
				this.match(RegelSpraakParser.MET);
				this.state = 1046;
				this.attribuutMetLidwoord();
				this.state = 1047;
				_la = this._input.LA(1);
				if(!(_la===47 || _la===48 || _la===124)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1048;
				this.expressie();
				}
				break;
			case 7:
				localctx = new ObjectCreatieResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 1050;
				this.objectCreatie();
				}
				break;
			case 8:
				localctx = new VerdelingContext(this, localctx);
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 1051;
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
			this.state = 1054;
			_la = this._input.LA(1);
			if(!(((((_la - 48)) & ~0x1F) === 0 && ((1 << (_la - 48)) & 23) !== 0) || ((((_la - 124)) & ~0x1F) === 0 && ((1 << (_la - 124)) & 24617) !== 0))) {
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
			this.state = 1056;
			this.match(RegelSpraakParser.EEN);
			this.state = 1057;
			localctx._role1 = this.feitCreatieRolPhrase();
			this.state = 1058;
			this.match(RegelSpraakParser.VAN);
			this.state = 1059;
			this.match(RegelSpraakParser.EEN);
			this.state = 1060;
			localctx._subject1 = this.feitCreatieSubjectPhrase();
			this.state = 1061;
			this.match(RegelSpraakParser.IS);
			this.state = 1062;
			localctx._article2 = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0))) {
			    localctx._article2 = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1063;
			localctx._role2 = this.feitCreatieRolPhrase();
			this.state = 1064;
			this.match(RegelSpraakParser.VAN);
			this.state = 1065;
			localctx._article3 = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0))) {
			    localctx._article3 = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1066;
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
			this.state = 1069;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1068;
				this.feitCreatieWord();
				}
				}
				this.state = 1071;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16924673) !== 0) || ((((_la - 128)) & ~0x1F) === 0 && ((1 << (_la - 128)) & 536887297) !== 0) || ((((_la - 172)) & ~0x1F) === 0 && ((1 << (_la - 172)) & 1711292417) !== 0) || ((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & 125939975) !== 0) || ((((_la - 237)) & ~0x1F) === 0 && ((1 << (_la - 237)) & 67113089) !== 0));
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
			this.state = 1074;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1073;
					this.feitCreatieSubjectWord();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1076;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 123, this._ctx);
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
			this.state = 1083;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 96:
			case 110:
			case 113:
			case 120:
			case 128:
			case 157:
			case 186:
			case 197:
			case 198:
			case 201:
			case 202:
			case 205:
			case 206:
			case 217:
			case 219:
			case 220:
			case 228:
			case 230:
			case 249:
			case 263:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1078;
				this.identifierOrKeyword();
				}
				break;
			case 142:
			case 144:
			case 172:
			case 204:
			case 212:
			case 216:
			case 225:
			case 227:
			case 229:
			case 237:
			case 240:
			case 244:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1079;
				this.voorzetsel();
				}
				break;
			case 208:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1080;
				this.match(RegelSpraakParser.DE);
				}
				break;
			case 213:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1081;
				this.match(RegelSpraakParser.HET);
				}
				break;
			case 211:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1082;
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
			this.state = 1087;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 96:
			case 110:
			case 113:
			case 120:
			case 128:
			case 157:
			case 186:
			case 197:
			case 198:
			case 201:
			case 202:
			case 205:
			case 206:
			case 217:
			case 219:
			case 220:
			case 228:
			case 230:
			case 249:
			case 263:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1085;
				this.identifierOrKeyword();
				}
				break;
			case 142:
			case 172:
			case 204:
			case 212:
			case 216:
			case 227:
			case 229:
			case 237:
			case 244:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1086;
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
			this.state = 1089;
			_la = this._input.LA(1);
			if(!(_la===142 || _la===172 || ((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & 41947393) !== 0) || _la===237 || _la===244)) {
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
			this.state = 1110;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 41:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1091;
				this.match(RegelSpraakParser.ER_WORDT_EEN_NIEUW);
				this.state = 1092;
				localctx._objectType = this.naamwoord();
				this.state = 1093;
				this.match(RegelSpraakParser.AANGEMAAKT);
				this.state = 1095;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===172) {
					{
					this.state = 1094;
					this.objectAttributeInit();
					}
				}

				this.state = 1098;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 127, this._ctx) ) {
				case 1:
					{
					this.state = 1097;
					this.match(RegelSpraakParser.DOT);
					}
					break;
				}
				}
				break;
			case 44:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1100;
				this.match(RegelSpraakParser.CREEER);
				this.state = 1101;
				this.match(RegelSpraakParser.EEN);
				this.state = 1102;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 1103;
				localctx._objectType = this.naamwoord();
				this.state = 1105;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===172) {
					{
					this.state = 1104;
					this.objectAttributeInit();
					}
				}

				this.state = 1108;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 129, this._ctx) ) {
				case 1:
					{
					this.state = 1107;
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
			this.state = 1112;
			this.match(RegelSpraakParser.MET);
			this.state = 1113;
			localctx._attribuut = this.simpleNaamwoord();
			this.state = 1114;
			this.match(RegelSpraakParser.GELIJK_AAN);
			this.state = 1115;
			localctx._waarde = this.simpleExpressie();
			this.state = 1119;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===212) {
				{
				{
				this.state = 1116;
				this.attributeInitVervolg();
				}
				}
				this.state = 1121;
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
			this.state = 1122;
			this.match(RegelSpraakParser.EN);
			this.state = 1123;
			localctx._attribuut = this.simpleNaamwoord();
			this.state = 1124;
			this.match(RegelSpraakParser.GELIJK_AAN);
			this.state = 1125;
			localctx._waarde = this.simpleExpressie();
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
			this.state = 1127;
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
			this.state = 1129;
			this.match(RegelSpraakParser.CONSISTENTIEREGEL);
			this.state = 1130;
			this.naamwoord();
			this.state = 1140;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 134, this._ctx) ) {
			case 1:
				{
				this.state = 1131;
				this.uniekzijnResultaat();
				}
				break;
			case 2:
				{
				this.state = 1132;
				this.inconsistentResultaat();
				this.state = 1138;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 111:
					{
					this.state = 1133;
					this.voorwaardeDeel();
					this.state = 1135;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===275) {
						{
						this.state = 1134;
						this.match(RegelSpraakParser.DOT);
						}
					}

					}
					break;
				case 275:
					{
					this.state = 1137;
					this.match(RegelSpraakParser.DOT);
					}
					break;
				case -1:
				case 28:
				case 95:
				case 96:
				case 97:
				case 98:
				case 99:
				case 100:
				case 102:
				case 103:
				case 104:
				case 105:
				case 106:
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
			this.state = 1142;
			this.alleAttributenVanObjecttype();
			this.state = 1143;
			this.match(RegelSpraakParser.MOETEN_UNIEK_ZIJN);
			this.state = 1145;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===275) {
				{
				this.state = 1144;
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
			this.state = 1147;
			this.match(RegelSpraakParser.DE);
			this.state = 1148;
			this.naamwoord();
			this.state = 1149;
			this.match(RegelSpraakParser.VAN);
			this.state = 1150;
			this.match(RegelSpraakParser.ALLE);
			this.state = 1151;
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
			this.state = 1154;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 136, this._ctx) ) {
			case 1:
				{
				this.state = 1153;
				_la = this._input.LA(1);
				if(!(_la===208 || _la===213 || _la===248)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			}
			this.state = 1156;
			this.naamwoord();
			this.state = 1157;
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
			this.state = 1159;
			this.match(RegelSpraakParser.INDIEN);
			this.state = 1162;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 137, this._ctx) ) {
			case 1:
				{
				this.state = 1160;
				this.expressie();
				}
				break;
			case 2:
				{
				this.state = 1161;
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
			this.state = 1206;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 143, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1164;
				this.match(RegelSpraakParser.ER_AAN);
				this.state = 1165;
				this.voorwaardeKwantificatie();
				this.state = 1166;
				_la = this._input.LA(1);
				if(!(_la===241 || _la===242)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1167;
				this.match(RegelSpraakParser.WORDT_VOLDAAN);
				this.state = 1168;
				this.match(RegelSpraakParser.COLON);
				this.state = 1170;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1169;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					this.state = 1172;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 280)) & ~0x1F) === 0 && ((1 << (_la - 280)) & 291) !== 0));
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1178;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 139, this._ctx) ) {
				case 1:
					{
					this.state = 1174;
					this.onderwerpReferentie();
					}
					break;
				case 2:
					{
					this.state = 1175;
					this.match(RegelSpraakParser.HIJ);
					}
					break;
				case 3:
					{
					this.state = 1176;
					this.match(RegelSpraakParser.HET);
					}
					break;
				case 4:
					{
					this.state = 1177;
					this.match(RegelSpraakParser.ER);
					}
					break;
				}
				this.state = 1180;
				this.match(RegelSpraakParser.AAN);
				this.state = 1181;
				this.voorwaardeKwantificatie();
				this.state = 1182;
				_la = this._input.LA(1);
				if(!(_la===241 || _la===242)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1183;
				this.match(RegelSpraakParser.VOLDOET);
				this.state = 1184;
				this.match(RegelSpraakParser.COLON);
				this.state = 1186;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1185;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					this.state = 1188;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 280)) & ~0x1F) === 0 && ((1 << (_la - 280)) & 291) !== 0));
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1194;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 141, this._ctx) ) {
				case 1:
					{
					this.state = 1190;
					this.onderwerpReferentie();
					}
					break;
				case 2:
					{
					this.state = 1191;
					this.match(RegelSpraakParser.HIJ);
					}
					break;
				case 3:
					{
					this.state = 1192;
					this.match(RegelSpraakParser.HET);
					}
					break;
				case 4:
					{
					this.state = 1193;
					this.match(RegelSpraakParser.ER);
					}
					break;
				}
				this.state = 1196;
				this.match(RegelSpraakParser.VOLDOET);
				this.state = 1197;
				this.match(RegelSpraakParser.AAN);
				this.state = 1198;
				this.voorwaardeKwantificatie();
				this.state = 1199;
				_la = this._input.LA(1);
				if(!(_la===241 || _la===242)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1200;
				this.match(RegelSpraakParser.COLON);
				this.state = 1202;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1201;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					this.state = 1204;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 280)) & ~0x1F) === 0 && ((1 << (_la - 280)) & 291) !== 0));
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
			this.state = 1222;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 120:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1208;
				this.match(RegelSpraakParser.ALLE);
				}
				break;
			case 199:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1209;
				this.match(RegelSpraakParser.GEEN_VAN_DE);
				}
				break;
			case 153:
			case 154:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1210;
				_la = this._input.LA(1);
				if(!(_la===153 || _la===154)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1211;
				_la = this._input.LA(1);
				if(!(((((_la - 197)) & ~0x1F) === 0 && ((1 << (_la - 197)) & 16435) !== 0) || _la===264)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1212;
				this.match(RegelSpraakParser.VAN);
				this.state = 1213;
				this.match(RegelSpraakParser.DE);
				}
				break;
			case 155:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1214;
				this.match(RegelSpraakParser.TEN_HOOGSTE);
				this.state = 1215;
				_la = this._input.LA(1);
				if(!(((((_la - 197)) & ~0x1F) === 0 && ((1 << (_la - 197)) & 16435) !== 0) || _la===264)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1216;
				this.match(RegelSpraakParser.VAN);
				this.state = 1217;
				this.match(RegelSpraakParser.DE);
				}
				break;
			case 156:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1218;
				this.match(RegelSpraakParser.PRECIES);
				this.state = 1219;
				_la = this._input.LA(1);
				if(!(((((_la - 197)) & ~0x1F) === 0 && ((1 << (_la - 197)) & 16435) !== 0) || _la===264)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1220;
				this.match(RegelSpraakParser.VAN);
				this.state = 1221;
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
			this.state = 1224;
			this.bulletPrefix();
			this.state = 1227;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 145, this._ctx) ) {
			case 1:
				{
				this.state = 1225;
				this.elementaireVoorwaarde();
				}
				break;
			case 2:
				{
				this.state = 1226;
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
			this.state = 1230;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1229;
					_la = this._input.LA(1);
					if(!(((((_la - 280)) & ~0x1F) === 0 && ((1 << (_la - 280)) & 291) !== 0))) {
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
				this.state = 1232;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 146, this._ctx);
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
			this.state = 1234;
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
			this.state = 1239;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 147, this._ctx) ) {
			case 1:
				{
				this.state = 1236;
				this.onderwerpReferentie();
				}
				break;
			case 2:
				{
				this.state = 1237;
				this.match(RegelSpraakParser.HIJ);
				}
				break;
			case 3:
				{
				this.state = 1238;
				this.match(RegelSpraakParser.ER);
				}
				break;
			}
			this.state = 1241;
			this.match(RegelSpraakParser.VOLDOET);
			this.state = 1242;
			this.match(RegelSpraakParser.AAN);
			this.state = 1243;
			this.voorwaardeKwantificatie();
			this.state = 1244;
			_la = this._input.LA(1);
			if(!(_la===241 || _la===242)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1245;
			this.match(RegelSpraakParser.COLON);
			this.state = 1247;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1246;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1249;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 148, this._ctx);
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
			this.state = 1251;
			this.onderwerpBasis();
			this.state = 1254;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 149, this._ctx) ) {
			case 1:
				{
				this.state = 1252;
				_la = this._input.LA(1);
				if(!(_la===207 || _la===210)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1253;
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
			this.state = 1256;
			this.onderwerpBasisWithNumbers();
			this.state = 1259;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===207 || _la===210) {
				{
				this.state = 1257;
				_la = this._input.LA(1);
				if(!(_la===207 || _la===210)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1258;
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
			this.state = 1261;
			this.basisOnderwerp();
			this.state = 1267;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 151, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1262;
					this.voorzetsel();
					this.state = 1263;
					this.basisOnderwerp();
					}
					}
				}
				this.state = 1269;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 151, this._ctx);
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
			this.state = 1270;
			this.basisOnderwerpWithNumbers();
			this.state = 1276;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 142)) & ~0x1F) === 0 && ((1 << (_la - 142)) & 1073741829) !== 0) || ((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & 44044545) !== 0) || ((((_la - 237)) & ~0x1F) === 0 && ((1 << (_la - 237)) & 137) !== 0)) {
				{
				{
				this.state = 1271;
				this.voorzetsel();
				this.state = 1272;
				this.basisOnderwerpWithNumbers();
				}
				}
				this.state = 1278;
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
			this.state = 1286;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 117:
			case 208:
			case 211:
			case 213:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1279;
				_la = this._input.LA(1);
				if(!(_la===117 || ((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0))) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1281;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 1280;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 1283;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 153, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 215:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1285;
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
			this.state = 1295;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 117:
			case 208:
			case 211:
			case 213:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1288;
				_la = this._input.LA(1);
				if(!(_la===117 || ((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0))) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1290;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1289;
					this.identifierOrKeywordWithNumbers();
					}
					}
					this.state = 1292;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16924673) !== 0) || _la===128 || _la===157 || ((((_la - 186)) & ~0x1F) === 0 && ((1 << (_la - 186)) & 2149160961) !== 0) || ((((_la - 219)) & ~0x1F) === 0 && ((1 << (_la - 219)) & 1073744387) !== 0) || _la===263 || _la===264);
				}
				break;
			case 215:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1294;
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
			this.state = 1297;
			this.attribuutMetLidwoord();
			this.state = 1298;
			this.match(RegelSpraakParser.VAN);
			this.state = 1299;
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
			this.state = 1301;
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
			this.state = 1304;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 142)) & ~0x1F) === 0 && ((1 << (_la - 142)) & 1073741829) !== 0) || ((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & 44044545) !== 0) || ((((_la - 237)) & ~0x1F) === 0 && ((1 << (_la - 237)) & 137) !== 0)) {
				{
				this.state = 1303;
				this.voorzetsel();
				}
			}

			this.state = 1306;
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
			this.state = 1309;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 142)) & ~0x1F) === 0 && ((1 << (_la - 142)) & 1073741829) !== 0) || ((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & 44044545) !== 0) || ((((_la - 237)) & ~0x1F) === 0 && ((1 << (_la - 237)) & 137) !== 0)) {
				{
				this.state = 1308;
				this.voorzetsel();
				}
			}

			this.state = 1312;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0)) {
				{
				this.state = 1311;
				_la = this._input.LA(1);
				if(!(((((_la - 208)) & ~0x1F) === 0 && ((1 << (_la - 208)) & 41) !== 0))) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 1315;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1314;
				this.identifierOrKeywordWithNumbers();
				}
				}
				this.state = 1317;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 96)) & ~0x1F) === 0 && ((1 << (_la - 96)) & 16924673) !== 0) || _la===128 || _la===157 || ((((_la - 186)) & ~0x1F) === 0 && ((1 << (_la - 186)) & 2149160961) !== 0) || ((((_la - 219)) & ~0x1F) === 0 && ((1 << (_la - 219)) & 1073744387) !== 0) || _la===263 || _la===264);
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
			this.state = 1319;
			this.match(RegelSpraakParser.ZIJN);
			this.state = 1320;
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
			this.state = 1324;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 45:
			case 54:
			case 55:
			case 56:
			case 57:
			case 58:
			case 59:
			case 64:
			case 65:
			case 66:
			case 67:
			case 96:
			case 110:
			case 113:
			case 117:
			case 120:
			case 128:
			case 136:
			case 142:
			case 144:
			case 157:
			case 172:
			case 186:
			case 197:
			case 198:
			case 201:
			case 202:
			case 204:
			case 205:
			case 206:
			case 208:
			case 211:
			case 212:
			case 213:
			case 216:
			case 217:
			case 219:
			case 220:
			case 225:
			case 227:
			case 228:
			case 229:
			case 230:
			case 237:
			case 240:
			case 244:
			case 249:
			case 263:
			case 264:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1322;
				this.elementairPredicaat();
				}
				break;
			case 118:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1323;
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
			this.state = 1331;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 162, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1326;
				this.attribuutVergelijkingsPredicaat();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1327;
				this.objectPredicaat();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1328;
				this.getalPredicaat();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1329;
				this.tekstPredicaat();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1330;
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
			this.state = 1333;
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
			this.state = 1336;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 163, this._ctx) ) {
			case 1:
				{
				this.state = 1335;
				this.match(RegelSpraakParser.EEN);
				}
				break;
			}
			this.state = 1340;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 164, this._ctx) ) {
			case 1:
				{
				this.state = 1338;
				this.kenmerkNaam();
				}
				break;
			case 2:
				{
				this.state = 1339;
				this.rolNaam();
				}
				break;
			}
			this.state = 1342;
			_la = this._input.LA(1);
			if(!(_la===109 || _la===117)) {
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
			this.state = 1344;
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
			this.state = 1347;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 165, this._ctx) ) {
			case 1:
				{
				this.state = 1346;
				this.match(RegelSpraakParser.EEN);
				}
				break;
			}
			this.state = 1349;
			localctx._attribuutNaam = this.naamwoord();
			this.state = 1350;
			this.match(RegelSpraakParser.HEBBEN);
			this.state = 1351;
			this.comparisonOperator();
			this.state = 1352;
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
			this.state = 1354;
			this.getalVergelijkingsOperatorMeervoud();
			this.state = 1355;
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
			this.state = 1357;
			this.tekstVergelijkingsOperatorMeervoud();
			this.state = 1358;
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
			this.state = 1360;
			this.datumVergelijkingsOperatorMeervoud();
			this.state = 1361;
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
			this.state = 1363;
			this.match(RegelSpraakParser.AAN);
			this.state = 1364;
			this.voorwaardeKwantificatie();
			this.state = 1365;
			this.match(RegelSpraakParser.VOLGENDE);
			this.state = 1366;
			_la = this._input.LA(1);
			if(!(_la===157 || _la===158)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1367;
			_la = this._input.LA(1);
			if(!(_la===149 || _la===150)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1368;
			this.match(RegelSpraakParser.COLON);
			this.state = 1370;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1369;
					this.samengesteldeVoorwaardeOnderdeelInPredicaat();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1372;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 166, this._ctx);
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
			this.state = 1380;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 167, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1374;
				this.bulletPrefix();
				this.state = 1375;
				this.elementaireVoorwaardeInPredicaat();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1377;
				this.bulletPrefix();
				this.state = 1378;
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
			this.state = 1382;
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
			this.state = 1395;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 168, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1384;
				this.attribuutReferentie();
				this.state = 1385;
				this.comparisonOperator();
				this.state = 1386;
				this.expressie();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1388;
				this.onderwerpReferentie();
				this.state = 1389;
				this.eenzijdigeObjectVergelijking();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1391;
				this.attribuutReferentie();
				this.state = 1392;
				_la = this._input.LA(1);
				if(!(_la===113 || _la===117)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1393;
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
			this.state = 1401;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 150:
				{
				this.state = 1397;
				this.match(RegelSpraakParser.VOLDOET);
				}
				break;
			case 149:
				{
				this.state = 1398;
				this.match(RegelSpraakParser.VOLDOEN);
				}
				break;
			case 291:
				{
				this.state = 1399;
				this.match(RegelSpraakParser.WORDT);
				this.state = 1400;
				this.match(RegelSpraakParser.VOLDAAN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1403;
			this.match(RegelSpraakParser.AAN);
			this.state = 1404;
			this.voorwaardeKwantificatie();
			this.state = 1405;
			this.match(RegelSpraakParser.VOLGENDE);
			this.state = 1406;
			_la = this._input.LA(1);
			if(!(_la===157 || _la===158)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1407;
			this.match(RegelSpraakParser.COLON);
			this.state = 1409;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1408;
					this.samengesteldeVoorwaardeOnderdeelInPredicaat();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1411;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 170, this._ctx);
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
			this.state = 1413;
			_la = this._input.LA(1);
			if(!(((((_la - 54)) & ~0x1F) === 0 && ((1 << (_la - 54)) & 63) !== 0))) {
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
			this.state = 1415;
			_la = this._input.LA(1);
			if(!(_la===54 || _la===55)) {
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
			this.state = 1417;
			_la = this._input.LA(1);
			if(!(((((_la - 54)) & ~0x1F) === 0 && ((1 << (_la - 54)) & 15363) !== 0))) {
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
			this.state = 1419;
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
			this.state = 1421;
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
			this.state = 1423;
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
			this.state = 1425;
			this.match(RegelSpraakParser.DAARBIJ_GELDT);
			this.state = 1429;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===208 || _la===213 || _la===263) {
				{
				{
				this.state = 1426;
				this.variabeleToekenning();
				}
				}
				this.state = 1431;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1432;
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
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1435;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===208 || _la===213) {
				{
				this.state = 1434;
				localctx._article = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===208 || _la===213)) {
				    localctx._article = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 1437;
			localctx._varName = this.match(RegelSpraakParser.IDENTIFIER);
			this.state = 1438;
			this.match(RegelSpraakParser.IS);
			this.state = 1439;
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
			this.state = 1441;
			this.primaryExpression(0);
			this.state = 1450;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 122)) & ~0x1F) === 0 && ((1 << (_la - 122)) & 67243011) !== 0)) {
				{
				{
				this.state = 1444;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 133:
				case 139:
				case 148:
					{
					this.state = 1442;
					this.additiveOperator();
					}
					break;
				case 122:
				case 123:
				case 132:
					{
					this.state = 1443;
					this.multiplicativeOperator();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1446;
				this.primaryExpression(0);
				}
				}
				this.state = 1452;
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
			this.state = 1466;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 175, this._ctx) ) {
			case 1:
				localctx = new ExprBegrenzingAfrondingContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1453;
				this.logicalExpression();
				this.state = 1454;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1455;
				this.begrenzing();
				this.state = 1456;
				this.afronding();
				}
				break;
			case 2:
				localctx = new ExprBegrenzingContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1458;
				this.logicalExpression();
				this.state = 1459;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1460;
				this.begrenzing();
				}
				break;
			case 3:
				localctx = new ExprAfrondingContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1462;
				this.logicalExpression();
				this.state = 1463;
				this.afronding();
				}
				break;
			case 4:
				localctx = new SimpleExprContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1465;
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
	public simpleExpressie(): SimpleExpressieContext {
		let localctx: SimpleExpressieContext = new SimpleExpressieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 248, RegelSpraakParser.RULE_simpleExpressie);
		try {
			this.state = 1481;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 176, this._ctx) ) {
			case 1:
				localctx = new SimpleExprBegrenzingAfrondingContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1468;
				this.comparisonExpression();
				this.state = 1469;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1470;
				this.begrenzing();
				this.state = 1471;
				this.afronding();
				}
				break;
			case 2:
				localctx = new SimpleExprBegrenzingContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1473;
				this.comparisonExpression();
				this.state = 1474;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1475;
				this.begrenzing();
				}
				break;
			case 3:
				localctx = new SimpleExprAfrondingContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1477;
				this.comparisonExpression();
				this.state = 1478;
				this.afronding();
				}
				break;
			case 4:
				localctx = new SimpleExprBaseContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1480;
				this.comparisonExpression();
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
		this.enterRule(localctx, 250, RegelSpraakParser.RULE_logicalExpression);
		let _la: number;
		try {
			localctx = new LogicalExprContext(this, localctx);
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1483;
			(localctx as LogicalExprContext)._left = this.comparisonExpression();
			this.state = 1486;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 177, this._ctx) ) {
			case 1:
				{
				this.state = 1484;
				(localctx as LogicalExprContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===212 || _la===225)) {
				    (localctx as LogicalExprContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1485;
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
		this.enterRule(localctx, 252, RegelSpraakParser.RULE_comparisonExpression);
		let _la: number;
		try {
			this.state = 1519;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 180, this._ctx) ) {
			case 1:
				localctx = new SubordinateClauseExprContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1488;
				this.subordinateClauseExpression();
				}
				break;
			case 2:
				localctx = new PeriodeCheckExprContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1489;
				this.periodevergelijkingElementair();
				}
				break;
			case 3:
				localctx = new IsKenmerkExprContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1490;
				(localctx as IsKenmerkExprContext)._left = this.additiveExpression();
				this.state = 1491;
				this.match(RegelSpraakParser.IS);
				this.state = 1492;
				this.naamwoordWithNumbers();
				}
				break;
			case 4:
				localctx = new HeeftKenmerkExprContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1494;
				(localctx as HeeftKenmerkExprContext)._left = this.additiveExpression();
				this.state = 1495;
				this.match(RegelSpraakParser.HEEFT);
				this.state = 1496;
				this.naamwoordWithNumbers();
				}
				break;
			case 5:
				localctx = new GelijkIsAanOfExprContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1498;
				(localctx as GelijkIsAanOfExprContext)._left = this.additiveExpression();
				this.state = 1499;
				(localctx as GelijkIsAanOfExprContext)._op = this.gelijkIsAanOperator();
				this.state = 1500;
				(localctx as GelijkIsAanOfExprContext)._firstValue = this.literalValue();
				this.state = 1505;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===274) {
					{
					{
					this.state = 1501;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1502;
					(localctx as GelijkIsAanOfExprContext)._literalValue = this.literalValue();
					(localctx as GelijkIsAanOfExprContext)._middleValues.push((localctx as GelijkIsAanOfExprContext)._literalValue);
					}
					}
					this.state = 1507;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1508;
				this.match(RegelSpraakParser.OF);
				this.state = 1509;
				(localctx as GelijkIsAanOfExprContext)._lastValue = this.literalValue();
				}
				break;
			case 6:
				localctx = new BinaryComparisonExprContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1511;
				(localctx as BinaryComparisonExprContext)._left = this.additiveExpression();
				this.state = 1515;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 179, this._ctx) ) {
				case 1:
					{
					this.state = 1512;
					this.comparisonOperator();
					this.state = 1513;
					(localctx as BinaryComparisonExprContext)._right = this.additiveExpression();
					}
					break;
				}
				}
				break;
			case 7:
				localctx = new UnaryConditionExprContext(this, localctx);
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 1517;
				this.unaryCondition();
				}
				break;
			case 8:
				localctx = new RegelStatusConditionExprContext(this, localctx);
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 1518;
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
	public literalValue(): LiteralValueContext {
		let localctx: LiteralValueContext = new LiteralValueContext(this, this._ctx, this.state);
		this.enterRule(localctx, 254, RegelSpraakParser.RULE_literalValue);
		try {
			this.state = 1530;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 269:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1521;
				this.match(RegelSpraakParser.ENUM_LITERAL);
				}
				break;
			case 268:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1522;
				this.match(RegelSpraakParser.STRING_LITERAL);
				}
				break;
			case 264:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1523;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 1525;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 181, this._ctx) ) {
				case 1:
					{
					this.state = 1524;
					this.unitIdentifier();
					}
					break;
				}
				}
				break;
			case 267:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1527;
				this.match(RegelSpraakParser.PERCENTAGE_LITERAL);
				}
				break;
			case 266:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1528;
				this.datumLiteral();
				}
				break;
			case 263:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1529;
				this.identifier();
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
	public gelijkIsAanOperator(): GelijkIsAanOperatorContext {
		let localctx: GelijkIsAanOperatorContext = new GelijkIsAanOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 256, RegelSpraakParser.RULE_gelijkIsAanOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1532;
			_la = this._input.LA(1);
			if(!(((((_la - 47)) & ~0x1F) === 0 && ((1 << (_la - 47)) & 131) !== 0) || _la===124)) {
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
	public comparisonOperator(): ComparisonOperatorContext {
		let localctx: ComparisonOperatorContext = new ComparisonOperatorContext(this, this._ctx, this.state);
		this.enterRule(localctx, 258, RegelSpraakParser.RULE_comparisonOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1534;
			_la = this._input.LA(1);
			if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 62914560) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 1073741315) !== 0) || ((((_la - 113)) & ~0x1F) === 0 && ((1 << (_la - 113)) & 42158337) !== 0) || _la===216)) {
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
		this.enterRule(localctx, 260, RegelSpraakParser.RULE_additiveExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1536;
			localctx._left = this.multiplicativeExpression();
			this.state = 1542;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 183, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1537;
					this.additiveOperator();
					this.state = 1538;
					localctx._right = this.multiplicativeExpression();
					}
					}
				}
				this.state = 1544;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 183, this._ctx);
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
		this.enterRule(localctx, 262, RegelSpraakParser.RULE_additiveOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1545;
			_la = this._input.LA(1);
			if(!(((((_la - 133)) & ~0x1F) === 0 && ((1 << (_la - 133)) & 32833) !== 0))) {
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
		this.enterRule(localctx, 264, RegelSpraakParser.RULE_multiplicativeExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1547;
			localctx._left = this.powerExpression();
			this.state = 1553;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 184, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1548;
					this.multiplicativeOperator();
					this.state = 1549;
					localctx._right = this.powerExpression();
					}
					}
				}
				this.state = 1555;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 184, this._ctx);
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
		this.enterRule(localctx, 266, RegelSpraakParser.RULE_multiplicativeOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1556;
			_la = this._input.LA(1);
			if(!(((((_la - 122)) & ~0x1F) === 0 && ((1 << (_la - 122)) & 1027) !== 0))) {
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
		this.enterRule(localctx, 268, RegelSpraakParser.RULE_powerExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1558;
			localctx._left = this.primaryExpression(0);
			this.state = 1564;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 185, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1559;
					this.powerOperator();
					this.state = 1560;
					localctx._right = this.primaryExpression(0);
					}
					}
				}
				this.state = 1566;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 185, this._ctx);
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
		this.enterRule(localctx, 270, RegelSpraakParser.RULE_powerOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1567;
			_la = this._input.LA(1);
			if(!(_la===143 || _la===284)) {
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
		let _startState: number = 272;
		this.enterRecursionRule(localctx, 272, RegelSpraakParser.RULE_primaryExpression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1833;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 210, this._ctx) ) {
			case 1:
				{
				localctx = new UnaryMinusExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 1570;
				this.match(RegelSpraakParser.MIN);
				this.state = 1571;
				this.primaryExpression(58);
				}
				break;
			case 2:
				{
				localctx = new UnaryMinusExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1572;
				this.match(RegelSpraakParser.MINUS);
				this.state = 1573;
				this.primaryExpression(57);
				}
				break;
			case 3:
				{
				localctx = new UnaryNietExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1574;
				this.match(RegelSpraakParser.NIET);
				this.state = 1575;
				this.primaryExpression(56);
				}
				break;
			case 4:
				{
				localctx = new AbsTijdsduurFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1576;
				this.match(RegelSpraakParser.DE_ABSOLUTE_TIJDSDUUR_VAN);
				this.state = 1577;
				this.primaryExpression(0);
				this.state = 1578;
				this.match(RegelSpraakParser.TOT);
				this.state = 1579;
				this.primaryExpression(0);
				this.state = 1582;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 186, this._ctx) ) {
				case 1:
					{
					this.state = 1580;
					this.match(RegelSpraakParser.IN_HELE);
					this.state = 1581;
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
				this.state = 1584;
				this.match(RegelSpraakParser.TIJDSDUUR_VAN);
				this.state = 1585;
				this.primaryExpression(0);
				this.state = 1586;
				this.match(RegelSpraakParser.TOT);
				this.state = 1587;
				this.primaryExpression(0);
				this.state = 1590;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 187, this._ctx) ) {
				case 1:
					{
					this.state = 1588;
					this.match(RegelSpraakParser.IN_HELE);
					this.state = 1589;
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
				this.state = 1592;
				this.match(RegelSpraakParser.SOM_VAN);
				this.state = 1593;
				this.primaryExpression(0);
				this.state = 1598;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===274) {
					{
					{
					this.state = 1594;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1595;
					this.primaryExpression(0);
					}
					}
					this.state = 1600;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1601;
				this.match(RegelSpraakParser.EN);
				this.state = 1602;
				this.primaryExpression(53);
				}
				break;
			case 7:
				{
				localctx = new SomAlleExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1604;
				this.match(RegelSpraakParser.SOM_VAN);
				this.state = 1605;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1606;
				this.naamwoord();
				}
				break;
			case 8:
				{
				localctx = new SomAlleAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1607;
				this.match(RegelSpraakParser.SOM_VAN);
				this.state = 1608;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1609;
				this.attribuutReferentie();
				}
				break;
			case 9:
				{
				localctx = new AantalFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1610;
				this.match(RegelSpraakParser.HET);
				this.state = 1611;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1612;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1613;
				this.naamwoord();
				}
				break;
			case 10:
				{
				localctx = new AantalFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1614;
				this.match(RegelSpraakParser.HET);
				this.state = 1615;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1616;
				this.onderwerpReferentie();
				}
				break;
			case 11:
				{
				localctx = new AantalFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1617;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1618;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1619;
				this.naamwoord();
				}
				break;
			case 12:
				{
				localctx = new AantalFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1620;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1621;
				this.onderwerpReferentie();
				}
				break;
			case 13:
				{
				localctx = new AantalAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1622;
				this.match(RegelSpraakParser.HET);
				this.state = 1623;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1624;
				this.attribuutReferentie();
				}
				break;
			case 14:
				{
				localctx = new AantalAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1625;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1626;
				this.attribuutReferentie();
				}
				break;
			case 15:
				{
				localctx = new PercentageFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1633;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 264:
					{
					this.state = 1627;
					this.match(RegelSpraakParser.NUMBER);
					this.state = 1630;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 279:
						{
						this.state = 1628;
						this.match(RegelSpraakParser.PERCENT_SIGN);
						}
						break;
					case 263:
						{
						this.state = 1629;
						(localctx as PercentageFuncExprContext)._p = this.match(RegelSpraakParser.IDENTIFIER);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					break;
				case 267:
					{
					this.state = 1632;
					this.match(RegelSpraakParser.PERCENTAGE_LITERAL);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1635;
				this.match(RegelSpraakParser.VAN);
				this.state = 1636;
				this.primaryExpression(44);
				}
				break;
			case 16:
				{
				localctx = new PercentageOfExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1637;
				this.match(RegelSpraakParser.PERCENTAGE_LITERAL);
				this.state = 1638;
				this.match(RegelSpraakParser.VAN);
				this.state = 1639;
				this.primaryExpression(43);
				}
				break;
			case 17:
				{
				localctx = new ConcatenatieExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1640;
				this.match(RegelSpraakParser.CONCATENATIE_VAN);
				this.state = 1641;
				this.primaryExpression(0);
				this.state = 1646;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===274) {
					{
					{
					this.state = 1642;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1643;
					this.primaryExpression(0);
					}
					}
					this.state = 1648;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1649;
				_la = this._input.LA(1);
				if(!(_la===212 || _la===225)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1650;
				this.primaryExpression(39);
				}
				break;
			case 18:
				{
				localctx = new WortelFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1652;
				this.match(RegelSpraakParser.DE_WORTEL_VAN);
				this.state = 1653;
				this.primaryExpression(37);
				}
				break;
			case 19:
				{
				localctx = new AbsValFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1654;
				this.match(RegelSpraakParser.DE_ABSOLUTE_WAARDE_VAN);
				this.state = 1655;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1656;
				this.expressie();
				this.state = 1657;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			case 20:
				{
				localctx = new MinValFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1659;
				this.match(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN);
				this.state = 1660;
				this.primaryExpression(0);
				this.state = 1665;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===274) {
					{
					{
					this.state = 1661;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1662;
					this.primaryExpression(0);
					}
					}
					this.state = 1667;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1668;
				this.match(RegelSpraakParser.EN);
				this.state = 1669;
				this.primaryExpression(35);
				}
				break;
			case 21:
				{
				localctx = new MinAlleAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1671;
				this.match(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN);
				this.state = 1672;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1673;
				this.attribuutReferentie();
				}
				break;
			case 22:
				{
				localctx = new MaxValFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1674;
				this.match(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN);
				this.state = 1675;
				this.primaryExpression(0);
				this.state = 1680;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===274) {
					{
					{
					this.state = 1676;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1677;
					this.primaryExpression(0);
					}
					}
					this.state = 1682;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1683;
				this.match(RegelSpraakParser.EN);
				this.state = 1684;
				this.primaryExpression(33);
				}
				break;
			case 23:
				{
				localctx = new MaxAlleAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1686;
				this.match(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN);
				this.state = 1687;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1688;
				this.attribuutReferentie();
				}
				break;
			case 24:
				{
				localctx = new JaarUitFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1689;
				this.match(RegelSpraakParser.HET);
				this.state = 1690;
				this.match(RegelSpraakParser.JAAR);
				this.state = 1691;
				this.match(RegelSpraakParser.UIT);
				this.state = 1692;
				this.primaryExpression(31);
				}
				break;
			case 25:
				{
				localctx = new MaandUitFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1693;
				this.match(RegelSpraakParser.DE);
				this.state = 1694;
				this.match(RegelSpraakParser.MAAND);
				this.state = 1695;
				this.match(RegelSpraakParser.UIT);
				this.state = 1696;
				this.primaryExpression(30);
				}
				break;
			case 26:
				{
				localctx = new DagUitFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1697;
				this.match(RegelSpraakParser.DE);
				this.state = 1698;
				this.match(RegelSpraakParser.DAG);
				this.state = 1699;
				this.match(RegelSpraakParser.UIT);
				this.state = 1700;
				this.primaryExpression(29);
				}
				break;
			case 27:
				{
				localctx = new DatumMetFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1701;
				this.match(RegelSpraakParser.DE_DATUM_MET);
				this.state = 1702;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1703;
				this.primaryExpression(0);
				this.state = 1704;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1705;
				this.primaryExpression(0);
				this.state = 1706;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1707;
				this.primaryExpression(0);
				this.state = 1708;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			case 28:
				{
				localctx = new PasenFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1710;
				this.match(RegelSpraakParser.DE_EERSTE_PAASDAG_VAN);
				this.state = 1711;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1712;
				this.primaryExpression(0);
				this.state = 1713;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			case 29:
				{
				localctx = new EersteDatumFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1715;
				this.match(RegelSpraakParser.EERSTE_VAN);
				this.state = 1716;
				this.primaryExpression(0);
				this.state = 1721;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===274) {
					{
					{
					this.state = 1717;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1718;
					this.primaryExpression(0);
					}
					}
					this.state = 1723;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1724;
				this.match(RegelSpraakParser.EN);
				this.state = 1725;
				this.primaryExpression(25);
				}
				break;
			case 30:
				{
				localctx = new LaatsteDatumFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1727;
				this.match(RegelSpraakParser.LAATSTE_VAN);
				this.state = 1728;
				this.primaryExpression(0);
				this.state = 1733;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===274) {
					{
					{
					this.state = 1729;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1730;
					this.primaryExpression(0);
					}
					}
					this.state = 1735;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1736;
				this.match(RegelSpraakParser.EN);
				this.state = 1737;
				this.primaryExpression(24);
				}
				break;
			case 31:
				{
				localctx = new TotaalVanExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1739;
				this.match(RegelSpraakParser.HET_TOTAAL_VAN);
				this.state = 1740;
				this.expressie();
				this.state = 1742;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 196, this._ctx) ) {
				case 1:
					{
					this.state = 1741;
					this.conditieBijExpressie();
					}
					break;
				}
				}
				break;
			case 32:
				{
				localctx = new HetAantalDagenInExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1744;
				this.match(RegelSpraakParser.HET);
				this.state = 1745;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1746;
				this.match(RegelSpraakParser.DAGEN);
				this.state = 1747;
				this.match(RegelSpraakParser.IN);
				this.state = 1756;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 208:
				case 220:
					{
					this.state = 1749;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===208) {
						{
						this.state = 1748;
						this.match(RegelSpraakParser.DE);
						}
					}

					this.state = 1751;
					this.match(RegelSpraakParser.MAAND);
					}
					break;
				case 213:
				case 217:
					{
					this.state = 1753;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===213) {
						{
						this.state = 1752;
						this.match(RegelSpraakParser.HET);
						}
					}

					this.state = 1755;
					this.match(RegelSpraakParser.JAAR);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1758;
				this.match(RegelSpraakParser.DAT);
				this.state = 1759;
				this.expressie();
				}
				break;
			case 33:
				{
				localctx = new CapitalizedTotaalVanExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1761;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1760;
					this.identifier();
					}
					}
					this.state = 1763;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===263);
				this.state = 1765;
				this.match(RegelSpraakParser.HET_TOTAAL_VAN);
				this.state = 1766;
				this.expressie();
				this.state = 1768;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 201, this._ctx) ) {
				case 1:
					{
					this.state = 1767;
					this.conditieBijExpressie();
					}
					break;
				}
				}
				break;
			case 34:
				{
				localctx = new TijdsevenredigDeelExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1770;
				this.match(RegelSpraakParser.HET_TIJDSEVENREDIG_DEEL_PER);
				this.state = 1771;
				_la = this._input.LA(1);
				if(!(_la===217 || _la===220)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1772;
				this.match(RegelSpraakParser.VAN);
				this.state = 1773;
				this.expressie();
				this.state = 1775;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 202, this._ctx) ) {
				case 1:
					{
					this.state = 1774;
					this.conditieBijExpressie();
					}
					break;
				}
				}
				break;
			case 35:
				{
				localctx = new CapitalizedTijdsevenredigDeelExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1778;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1777;
					this.identifier();
					}
					}
					this.state = 1780;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===263);
				this.state = 1782;
				this.match(RegelSpraakParser.HET_TIJDSEVENREDIG_DEEL_PER);
				this.state = 1783;
				_la = this._input.LA(1);
				if(!(_la===217 || _la===220)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1784;
				this.match(RegelSpraakParser.VAN);
				this.state = 1785;
				this.expressie();
				this.state = 1787;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 204, this._ctx) ) {
				case 1:
					{
					this.state = 1786;
					this.conditieBijExpressie();
					}
					break;
				}
				}
				break;
			case 36:
				{
				localctx = new DimensieAggExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1791;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 13:
				case 14:
				case 186:
				case 191:
				case 213:
					{
					this.state = 1789;
					this.getalAggregatieFunctie();
					}
					break;
				case 187:
				case 189:
					{
					this.state = 1790;
					this.datumAggregatieFunctie();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1793;
				this.attribuutMetLidwoord();
				this.state = 1794;
				this.dimensieSelectie();
				}
				break;
			case 37:
				{
				localctx = new DimensieRangeAggExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1798;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 13:
				case 14:
				case 186:
				case 191:
				case 213:
					{
					this.state = 1796;
					this.getalAggregatieFunctie();
					}
					break;
				case 187:
				case 189:
					{
					this.state = 1797;
					this.datumAggregatieFunctie();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1802;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 207, this._ctx) ) {
				case 1:
					{
					this.state = 1800;
					this.bezieldeReferentie();
					}
					break;
				case 2:
					{
					this.state = 1801;
					this.attribuutReferentie();
					}
					break;
				}
				this.state = 1804;
				this.match(RegelSpraakParser.VANAF);
				this.state = 1805;
				this.naamwoord();
				this.state = 1806;
				this.match(RegelSpraakParser.TM);
				this.state = 1807;
				this.naamwoord();
				this.state = 1809;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 208, this._ctx) ) {
				case 1:
					{
					this.state = 1808;
					this.match(RegelSpraakParser.DOT);
					}
					break;
				}
				}
				break;
			case 38:
				{
				localctx = new NumberLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1811;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 1813;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 209, this._ctx) ) {
				case 1:
					{
					this.state = 1812;
					this.unitIdentifier();
					}
					break;
				}
				}
				break;
			case 39:
				{
				localctx = new RekendatumKeywordExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1815;
				this.match(RegelSpraakParser.REKENDATUM);
				}
				break;
			case 40:
				{
				localctx = new IdentifierExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1816;
				this.identifier();
				}
				break;
			case 41:
				{
				localctx = new BezieldeRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1817;
				this.bezieldeReferentie();
				}
				break;
			case 42:
				{
				localctx = new AttrRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1818;
				this.attribuutReferentie();
				}
				break;
			case 43:
				{
				localctx = new OnderwerpRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1819;
				this.onderwerpReferentie();
				}
				break;
			case 44:
				{
				localctx = new NaamwoordExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1820;
				this.naamwoord();
				}
				break;
			case 45:
				{
				localctx = new ParamRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1821;
				this.parameterMetLidwoord();
				}
				break;
			case 46:
				{
				localctx = new PercentageLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1822;
				this.match(RegelSpraakParser.PERCENTAGE_LITERAL);
				}
				break;
			case 47:
				{
				localctx = new StringLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1823;
				this.match(RegelSpraakParser.STRING_LITERAL);
				}
				break;
			case 48:
				{
				localctx = new EnumLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1824;
				this.match(RegelSpraakParser.ENUM_LITERAL);
				}
				break;
			case 49:
				{
				localctx = new DatumLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1825;
				this.datumLiteral();
				}
				break;
			case 50:
				{
				localctx = new BooleanTrueLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1826;
				this.match(RegelSpraakParser.WAAR);
				}
				break;
			case 51:
				{
				localctx = new BooleanFalseLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1827;
				this.match(RegelSpraakParser.ONWAAR);
				}
				break;
			case 52:
				{
				localctx = new PronounExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1828;
				this.match(RegelSpraakParser.HIJ);
				}
				break;
			case 53:
				{
				localctx = new ParenExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1829;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1830;
				this.expressie();
				this.state = 1831;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1862;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 213, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 1860;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 212, this._ctx) ) {
					case 1:
						{
						localctx = new SimpleConcatenatieExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1835;
						if (!(this.precpred(this._ctx, 38))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 38)");
						}
						this.state = 1838;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						do {
							{
							{
							this.state = 1836;
							this.match(RegelSpraakParser.COMMA);
							this.state = 1837;
							this.primaryExpression(0);
							}
							}
							this.state = 1840;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						} while (_la===274);
						this.state = 1842;
						_la = this._input.LA(1);
						if(!(_la===212 || _la===225)) {
						this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1843;
						this.primaryExpression(39);
						}
						break;
					case 2:
						{
						localctx = new AfrondingExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1845;
						if (!(this.precpred(this._ctx, 42))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 42)");
						}
						this.state = 1846;
						this.afronding();
						}
						break;
					case 3:
						{
						localctx = new BegrenzingAfrondingExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1847;
						if (!(this.precpred(this._ctx, 41))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 41)");
						}
						this.state = 1848;
						this.match(RegelSpraakParser.COMMA);
						this.state = 1849;
						this.begrenzing();
						this.state = 1850;
						this.afronding();
						}
						break;
					case 4:
						{
						localctx = new BegrenzingExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1852;
						if (!(this.precpred(this._ctx, 40))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 40)");
						}
						this.state = 1853;
						this.match(RegelSpraakParser.COMMA);
						this.state = 1854;
						this.begrenzing();
						}
						break;
					case 5:
						{
						localctx = new DateCalcExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1855;
						if (!(this.precpred(this._ctx, 26))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 26)");
						}
						this.state = 1856;
						_la = this._input.LA(1);
						if(!(_la===133 || _la===139)) {
						this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1857;
						this.primaryExpression(0);
						this.state = 1858;
						this.timeUnit();
						}
						break;
					}
					}
				}
				this.state = 1864;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 213, this._ctx);
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
		this.enterRule(localctx, 274, RegelSpraakParser.RULE_afronding);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1865;
			_la = this._input.LA(1);
			if(!(((((_la - 134)) & ~0x1F) === 0 && ((1 << (_la - 134)) & 131267) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1866;
			this.match(RegelSpraakParser.AFGEROND_OP);
			this.state = 1867;
			this.match(RegelSpraakParser.NUMBER);
			this.state = 1868;
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
		this.enterRule(localctx, 276, RegelSpraakParser.RULE_begrenzing);
		try {
			this.state = 1876;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 214, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1870;
				this.begrenzingMinimum();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1871;
				this.begrenzingMaximum();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1872;
				this.begrenzingMinimum();
				this.state = 1873;
				this.match(RegelSpraakParser.EN);
				this.state = 1874;
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
		this.enterRule(localctx, 278, RegelSpraakParser.RULE_begrenzingMinimum);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1878;
			this.match(RegelSpraakParser.MET_EEN_MINIMUM_VAN);
			this.state = 1879;
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
		this.enterRule(localctx, 280, RegelSpraakParser.RULE_begrenzingMaximum);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1881;
			this.match(RegelSpraakParser.MET_EEN_MAXIMUM_VAN);
			this.state = 1882;
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
		this.enterRule(localctx, 282, RegelSpraakParser.RULE_conditieBijExpressie);
		try {
			this.state = 1887;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 4:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1884;
				this.match(RegelSpraakParser.GEDURENDE_DE_TIJD_DAT);
				this.state = 1885;
				localctx._condition = this.expressie();
				}
				break;
			case 142:
			case 144:
			case 146:
			case 240:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1886;
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
	public periodevergelijkingElementair(): PeriodevergelijkingElementairContext {
		let localctx: PeriodevergelijkingElementairContext = new PeriodevergelijkingElementairContext(this, this._ctx, this.state);
		this.enterRule(localctx, 284, RegelSpraakParser.RULE_periodevergelijkingElementair);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1889;
			this.match(RegelSpraakParser.HET_IS_DE_PERIODE);
			this.state = 1890;
			this.periodevergelijkingEnkelvoudig();
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
		this.enterRule(localctx, 286, RegelSpraakParser.RULE_periodevergelijkingEnkelvoudig);
		try {
			this.state = 1908;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 216, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1892;
				this.match(RegelSpraakParser.VANAF);
				this.state = 1893;
				this.datumExpressie();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1894;
				this.match(RegelSpraakParser.VAN);
				this.state = 1895;
				this.datumExpressie();
				this.state = 1896;
				this.match(RegelSpraakParser.TOT);
				this.state = 1897;
				this.datumExpressie();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1899;
				this.match(RegelSpraakParser.VAN);
				this.state = 1900;
				this.datumExpressie();
				this.state = 1901;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1902;
				this.datumExpressie();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1904;
				this.match(RegelSpraakParser.TOT);
				this.state = 1905;
				this.datumExpressie();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1906;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1907;
				this.datumExpressie();
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
		this.enterRule(localctx, 288, RegelSpraakParser.RULE_periodeDefinitie);
		try {
			this.state = 1926;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 217, this._ctx) ) {
			case 1:
				localctx = new VanafPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1910;
				this.match(RegelSpraakParser.VANAF);
				this.state = 1911;
				this.dateExpression();
				}
				break;
			case 2:
				localctx = new TotPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1912;
				this.match(RegelSpraakParser.TOT);
				this.state = 1913;
				this.dateExpression();
				}
				break;
			case 3:
				localctx = new TotEnMetPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1914;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1915;
				this.dateExpression();
				}
				break;
			case 4:
				localctx = new VanTotPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1916;
				this.match(RegelSpraakParser.VAN);
				this.state = 1917;
				this.dateExpression();
				this.state = 1918;
				this.match(RegelSpraakParser.TOT);
				this.state = 1919;
				this.dateExpression();
				}
				break;
			case 5:
				localctx = new VanTotEnMetPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1921;
				this.match(RegelSpraakParser.VAN);
				this.state = 1922;
				this.dateExpression();
				this.state = 1923;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1924;
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
		this.enterRule(localctx, 290, RegelSpraakParser.RULE_dateExpression);
		try {
			this.state = 1932;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 266:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1928;
				this.datumLiteral();
				}
				break;
			case 231:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1929;
				this.match(RegelSpraakParser.REKENDATUM);
				}
				break;
			case 232:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1930;
				this.match(RegelSpraakParser.REKENJAAR);
				}
				break;
			case 45:
			case 96:
			case 110:
			case 117:
			case 120:
			case 128:
			case 136:
			case 157:
			case 186:
			case 197:
			case 198:
			case 201:
			case 202:
			case 205:
			case 206:
			case 208:
			case 211:
			case 213:
			case 217:
			case 219:
			case 220:
			case 228:
			case 230:
			case 249:
			case 263:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1931;
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
		this.enterRule(localctx, 292, RegelSpraakParser.RULE_getalAggregatieFunctie);
		try {
			this.state = 1940;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 213:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1934;
				this.match(RegelSpraakParser.HET);
				this.state = 1935;
				this.match(RegelSpraakParser.AANTAL);
				}
				break;
			case 186:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1936;
				this.match(RegelSpraakParser.AANTAL);
				}
				break;
			case 13:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1937;
				this.match(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN);
				}
				break;
			case 14:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1938;
				this.match(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN);
				}
				break;
			case 191:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1939;
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
		this.enterRule(localctx, 294, RegelSpraakParser.RULE_datumAggregatieFunctie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1942;
			_la = this._input.LA(1);
			if(!(_la===187 || _la===189)) {
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
		this.enterRule(localctx, 296, RegelSpraakParser.RULE_dimensieSelectie);
		try {
			this.state = 1954;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 229:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1944;
				this.match(RegelSpraakParser.OVER);
				this.state = 1948;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 220, this._ctx) ) {
				case 1:
					{
					this.state = 1945;
					this.aggregerenOverAlleDimensies();
					}
					break;
				case 2:
					{
					this.state = 1946;
					this.aggregerenOverVerzameling();
					}
					break;
				case 3:
					{
					this.state = 1947;
					this.aggregerenOverBereik();
					}
					break;
				}
				this.state = 1950;
				this.match(RegelSpraakParser.DOT);
				}
				break;
			case 240:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1952;
				this.match(RegelSpraakParser.VAN);
				this.state = 1953;
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
		this.enterRule(localctx, 298, RegelSpraakParser.RULE_aggregerenOverAlleDimensies);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1956;
			this.match(RegelSpraakParser.ALLE);
			this.state = 1957;
			this.naamwoord();
			this.state = 1960;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 222, this._ctx) ) {
			case 1:
				{
				this.state = 1958;
				_la = this._input.LA(1);
				if(!(_la===207 || _la===210)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1959;
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
		this.enterRule(localctx, 300, RegelSpraakParser.RULE_aggregerenOverVerzameling);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1962;
			this.match(RegelSpraakParser.DE);
			this.state = 1963;
			this.naamwoord();
			this.state = 1964;
			this.match(RegelSpraakParser.VANAF);
			this.state = 1965;
			this.naamwoord();
			this.state = 1966;
			this.match(RegelSpraakParser.TM);
			this.state = 1967;
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
		this.enterRule(localctx, 302, RegelSpraakParser.RULE_aggregerenOverBereik);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1969;
			this.match(RegelSpraakParser.DE);
			this.state = 1970;
			this.naamwoord();
			this.state = 1971;
			this.match(RegelSpraakParser.IN);
			this.state = 1972;
			this.match(RegelSpraakParser.LBRACE);
			this.state = 1973;
			this.naamwoord();
			this.state = 1978;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===274) {
				{
				{
				this.state = 1974;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1975;
				this.naamwoord();
				}
				}
				this.state = 1980;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1981;
			this.match(RegelSpraakParser.EN);
			this.state = 1982;
			this.naamwoord();
			this.state = 1983;
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
		this.enterRule(localctx, 304, RegelSpraakParser.RULE_unaryCondition);
		let _la: number;
		try {
			this.state = 2011;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 224, this._ctx) ) {
			case 1:
				localctx = new UnaryCheckConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1985;
				(localctx as UnaryCheckConditionContext)._expr = this.primaryExpression(0);
				this.state = 1986;
				(localctx as UnaryCheckConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 68)) & ~0x1F) === 0 && ((1 << (_la - 68)) & 61455) !== 0))) {
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
				this.state = 1988;
				(localctx as UnaryNumeriekExactConditionContext)._expr = this.primaryExpression(0);
				this.state = 1989;
				(localctx as UnaryNumeriekExactConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 84)) & ~0x1F) === 0 && ((1 << (_la - 84)) & 15) !== 0))) {
				    (localctx as UnaryNumeriekExactConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1990;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 1991;
				this.match(RegelSpraakParser.CIJFERS);
				}
				break;
			case 3:
				localctx = new UnaryDagsoortConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1993;
				(localctx as UnaryDagsoortConditionContext)._expr = this.primaryExpression(0);
				this.state = 1994;
				(localctx as UnaryDagsoortConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 88)) & ~0x1F) === 0 && ((1 << (_la - 88)) & 15) !== 0))) {
				    (localctx as UnaryDagsoortConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1995;
				(localctx as UnaryDagsoortConditionContext)._dagsoort = this.identifier();
				}
				break;
			case 4:
				localctx = new UnaryKenmerkConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1997;
				(localctx as UnaryKenmerkConditionContext)._expr = this.primaryExpression(0);
				this.state = 1998;
				(localctx as UnaryKenmerkConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 72)) & ~0x1F) === 0 && ((1 << (_la - 72)) & 85) !== 0))) {
				    (localctx as UnaryKenmerkConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1999;
				(localctx as UnaryKenmerkConditionContext)._kenmerk = this.identifier();
				}
				break;
			case 5:
				localctx = new UnaryRolConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2001;
				(localctx as UnaryRolConditionContext)._expr = this.primaryExpression(0);
				this.state = 2002;
				(localctx as UnaryRolConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 73)) & ~0x1F) === 0 && ((1 << (_la - 73)) & 85) !== 0))) {
				    (localctx as UnaryRolConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 2003;
				(localctx as UnaryRolConditionContext)._rol = this.identifier();
				}
				break;
			case 6:
				localctx = new UnaryUniekConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 2005;
				(localctx as UnaryUniekConditionContext)._ref = this.onderwerpReferentie();
				this.state = 2006;
				this.match(RegelSpraakParser.MOETEN_UNIEK_ZIJN);
				}
				break;
			case 7:
				localctx = new UnaryInconsistentDataConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 2008;
				(localctx as UnaryInconsistentDataConditionContext)._expr = this.primaryExpression(0);
				this.state = 2009;
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
		this.enterRule(localctx, 306, RegelSpraakParser.RULE_regelStatusCondition);
		try {
			this.state = 2021;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 225, this._ctx) ) {
			case 1:
				localctx = new RegelStatusGevuurdCheckContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2013;
				this.match(RegelSpraakParser.REGELVERSIE);
				this.state = 2014;
				(localctx as RegelStatusGevuurdCheckContext)._name = this.naamwoord();
				this.state = 2015;
				this.match(RegelSpraakParser.IS_GEVUURD);
				}
				break;
			case 2:
				localctx = new RegelStatusInconsistentCheckContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2017;
				this.match(RegelSpraakParser.REGELVERSIE);
				this.state = 2018;
				(localctx as RegelStatusInconsistentCheckContext)._name = this.naamwoord();
				this.state = 2019;
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
		this.enterRule(localctx, 308, RegelSpraakParser.RULE_subordinateClauseExpression);
		try {
			this.state = 2035;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 226, this._ctx) ) {
			case 1:
				localctx = new SubordinateHasExprContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2023;
				(localctx as SubordinateHasExprContext)._subject = this.onderwerpReferentie();
				this.state = 2024;
				(localctx as SubordinateHasExprContext)._object = this.naamwoordWithNumbers();
				this.state = 2025;
				(localctx as SubordinateHasExprContext)._verb = this.match(RegelSpraakParser.HEEFT);
				}
				break;
			case 2:
				localctx = new SubordinateIsWithExprContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2027;
				(localctx as SubordinateIsWithExprContext)._subject = this.onderwerpReferentie();
				this.state = 2028;
				(localctx as SubordinateIsWithExprContext)._prepPhrase = this.naamwoordWithNumbers();
				this.state = 2029;
				(localctx as SubordinateIsWithExprContext)._verb = this.match(RegelSpraakParser.IS);
				}
				break;
			case 3:
				localctx = new SubordinateIsKenmerkExprContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2031;
				(localctx as SubordinateIsKenmerkExprContext)._subject = this.onderwerpReferentie();
				this.state = 2032;
				(localctx as SubordinateIsKenmerkExprContext)._verb = this.match(RegelSpraakParser.IS);
				this.state = 2033;
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
		this.enterRule(localctx, 310, RegelSpraakParser.RULE_dagsoortDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2037;
			this.match(RegelSpraakParser.DAGSOORT);
			this.state = 2038;
			this.naamwoord();
			this.state = 2046;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===174) {
				{
				this.state = 2039;
				this.match(RegelSpraakParser.MV_START);
				this.state = 2041;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 2040;
					localctx._IDENTIFIER = this.match(RegelSpraakParser.IDENTIFIER);
					localctx._plural.push(localctx._IDENTIFIER);
					}
					}
					this.state = 2043;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===263);
				this.state = 2045;
				this.match(RegelSpraakParser.RPAREN);
				}
			}

			this.state = 2049;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===277) {
				{
				this.state = 2048;
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
	public tekstreeksExpr(): TekstreeksExprContext {
		let localctx: TekstreeksExprContext = new TekstreeksExprContext(this, this._ctx, this.state);
		this.enterRule(localctx, 312, RegelSpraakParser.RULE_tekstreeksExpr);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2051;
			this.match(RegelSpraakParser.STRING_LITERAL);
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
		this.enterRule(localctx, 314, RegelSpraakParser.RULE_verdelingResultaat);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2053;
			localctx._sourceAmount = this.expressie();
			this.state = 2054;
			this.match(RegelSpraakParser.WORDT_VERDEELD_OVER);
			this.state = 2055;
			localctx._targetCollection = this.expressie();
			this.state = 2056;
			this.match(RegelSpraakParser.COMMA);
			this.state = 2057;
			this.match(RegelSpraakParser.WAARBIJ_WORDT_VERDEELD);
			this.state = 2060;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 21:
			case 33:
			case 34:
			case 35:
			case 119:
			case 194:
				{
				this.state = 2058;
				this.verdelingMethodeSimple();
				}
				break;
			case 276:
				{
				this.state = 2059;
				this.verdelingMethodeMultiLine();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 2063;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===19) {
				{
				this.state = 2062;
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
		this.enterRule(localctx, 316, RegelSpraakParser.RULE_verdelingMethodeSimple);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2065;
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
		this.enterRule(localctx, 318, RegelSpraakParser.RULE_verdelingMethodeMultiLine);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2067;
			this.match(RegelSpraakParser.COLON);
			this.state = 2068;
			this.verdelingMethodeBulletList();
			this.state = 2070;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 232, this._ctx) ) {
			case 1:
				{
				this.state = 2069;
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
		this.enterRule(localctx, 320, RegelSpraakParser.RULE_verdelingMethodeBulletList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2072;
			this.verdelingMethodeBullet();
			this.state = 2076;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===288) {
				{
				{
				this.state = 2073;
				this.verdelingMethodeBullet();
				}
				}
				this.state = 2078;
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
		this.enterRule(localctx, 322, RegelSpraakParser.RULE_verdelingMethodeBullet);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2079;
			this.match(RegelSpraakParser.MINUS);
			this.state = 2080;
			this.verdelingMethode();
			this.state = 2082;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 234, this._ctx) ) {
			case 1:
				{
				this.state = 2081;
				_la = this._input.LA(1);
				if(!(_la===274 || _la===275)) {
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
		this.enterRule(localctx, 324, RegelSpraakParser.RULE_verdelingMethode);
		let _la: number;
		try {
			this.state = 2098;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 194:
				localctx = new VerdelingGelijkeDelenContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 2084;
				this.match(RegelSpraakParser.IN_GELIJKE_DELEN);
				}
				break;
			case 35:
				localctx = new VerdelingNaarRatoContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 2085;
				this.match(RegelSpraakParser.NAAR_RATO_VAN);
				this.state = 2086;
				(localctx as VerdelingNaarRatoContext)._ratioExpression = this.expressie();
				}
				break;
			case 34:
				localctx = new VerdelingOpVolgordeContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 2087;
				this.match(RegelSpraakParser.OP_VOLGORDE_VAN);
				this.state = 2088;
				(localctx as VerdelingOpVolgordeContext)._orderDirection = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===193 || _la===196)) {
				    (localctx as VerdelingOpVolgordeContext)._orderDirection = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 2089;
				(localctx as VerdelingOpVolgordeContext)._orderExpression = this.expressie();
				}
				break;
			case 33:
				localctx = new VerdelingTieBreakContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 2090;
				this.match(RegelSpraakParser.BIJ_EVEN_GROOT_CRITERIUM);
				this.state = 2091;
				(localctx as VerdelingTieBreakContext)._tieBreakMethod = this.verdelingMethode();
				}
				break;
			case 21:
				localctx = new VerdelingMaximumContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 2092;
				this.match(RegelSpraakParser.MET_EEN_MAXIMUM_VAN);
				this.state = 2093;
				(localctx as VerdelingMaximumContext)._maxExpression = this.expressie();
				}
				break;
			case 119:
				localctx = new VerdelingAfrondingContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 2094;
				this.match(RegelSpraakParser.AFGEROND_OP);
				this.state = 2095;
				(localctx as VerdelingAfrondingContext)._decimals = this.match(RegelSpraakParser.NUMBER);
				this.state = 2096;
				this.match(RegelSpraakParser.DECIMALEN);
				this.state = 2097;
				(localctx as VerdelingAfrondingContext)._roundDirection = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===134 || _la===135)) {
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
		this.enterRule(localctx, 326, RegelSpraakParser.RULE_verdelingRest);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 2100;
			this.match(RegelSpraakParser.ALS_ONVERDEELDE_REST_BLIJFT);
			this.state = 2101;
			localctx._remainderTarget = this.expressie();
			this.state = 2103;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===195) {
				{
				this.state = 2102;
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
		case 136:
			return this.primaryExpression_sempred(localctx as PrimaryExpressionContext, predIndex);
		}
		return true;
	}
	private primaryExpression_sempred(localctx: PrimaryExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 38);
		case 1:
			return this.precpred(this._ctx, 42);
		case 2:
			return this.precpred(this._ctx, 41);
		case 3:
			return this.precpred(this._ctx, 40);
		case 4:
			return this.precpred(this._ctx, 26);
		}
		return true;
	}

	public static readonly _serializedATN: number[] = [4,1,292,2106,2,0,7,0,
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
	7,157,2,158,7,158,2,159,7,159,2,160,7,160,2,161,7,161,2,162,7,162,2,163,
	7,163,1,0,1,0,1,0,1,0,1,0,1,0,5,0,335,8,0,10,0,12,0,338,9,0,1,0,1,0,1,1,
	1,1,1,1,1,1,1,1,1,1,3,1,348,8,1,1,2,1,2,1,2,3,2,353,8,2,1,2,1,2,1,3,1,3,
	1,3,4,3,360,8,3,11,3,12,3,361,1,4,1,4,3,4,366,8,4,1,4,1,4,1,4,1,4,1,4,5,
	4,373,8,4,10,4,12,4,376,9,4,1,4,3,4,379,8,4,1,5,3,5,382,8,5,1,5,4,5,385,
	8,5,11,5,12,5,386,1,5,3,5,390,8,5,4,5,392,8,5,11,5,12,5,393,1,5,5,5,397,
	8,5,10,5,12,5,400,9,5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,5,6,410,8,6,10,6,
	12,6,413,9,6,1,6,3,6,416,8,6,1,7,1,7,3,7,420,8,7,1,8,4,8,423,8,8,11,8,12,
	8,424,1,9,1,9,1,10,1,10,1,11,1,11,1,12,3,12,434,8,12,1,12,4,12,437,8,12,
	11,12,12,12,438,1,12,4,12,442,8,12,11,12,12,12,443,1,12,1,12,4,12,448,8,
	12,11,12,12,12,449,1,12,1,12,4,12,454,8,12,11,12,12,12,455,1,12,1,12,4,
	12,460,8,12,11,12,12,12,461,1,12,4,12,465,8,12,11,12,12,12,466,1,12,1,12,
	4,12,471,8,12,11,12,12,12,472,1,12,1,12,4,12,477,8,12,11,12,12,12,478,1,
	12,1,12,1,12,1,12,1,12,4,12,486,8,12,11,12,12,12,487,3,12,490,8,12,1,13,
	3,13,493,8,13,1,13,4,13,496,8,13,11,13,12,13,497,1,13,4,13,501,8,13,11,
	13,12,13,502,1,13,1,13,4,13,507,8,13,11,13,12,13,508,1,13,1,13,4,13,513,
	8,13,11,13,12,13,514,1,13,1,13,4,13,519,8,13,11,13,12,13,520,1,13,4,13,
	524,8,13,11,13,12,13,525,1,13,1,13,4,13,530,8,13,11,13,12,13,531,1,13,1,
	13,4,13,536,8,13,11,13,12,13,537,1,13,1,13,1,13,1,13,1,13,4,13,545,8,13,
	11,13,12,13,546,3,13,549,8,13,1,14,1,14,3,14,553,8,14,1,15,3,15,556,8,15,
	1,15,4,15,559,8,15,11,15,12,15,560,1,15,4,15,564,8,15,11,15,12,15,565,1,
	15,1,15,4,15,570,8,15,11,15,12,15,571,1,15,1,15,4,15,576,8,15,11,15,12,
	15,577,1,15,1,15,4,15,582,8,15,11,15,12,15,583,1,15,4,15,587,8,15,11,15,
	12,15,588,1,15,1,15,4,15,593,8,15,11,15,12,15,594,1,15,1,15,4,15,599,8,
	15,11,15,12,15,600,3,15,603,8,15,1,16,1,16,1,16,1,16,5,16,609,8,16,10,16,
	12,16,612,9,16,1,17,1,17,1,17,1,17,5,17,618,8,17,10,17,12,17,621,9,17,1,
	18,1,18,1,18,1,18,5,18,627,8,18,10,18,12,18,630,9,18,1,19,1,19,1,20,1,20,
	1,21,1,21,1,22,1,22,1,23,1,23,1,23,1,23,4,23,644,8,23,11,23,12,23,645,1,
	23,3,23,649,8,23,1,23,3,23,652,8,23,1,23,5,23,655,8,23,10,23,12,23,658,
	9,23,1,24,1,24,3,24,662,8,24,1,24,1,24,1,25,3,25,667,8,25,1,25,1,25,3,25,
	671,8,25,1,25,1,25,3,25,675,8,25,1,25,3,25,678,8,25,1,26,1,26,1,26,1,26,
	3,26,684,8,26,1,26,1,26,3,26,688,8,26,1,26,1,26,1,26,1,26,5,26,694,8,26,
	10,26,12,26,697,9,26,3,26,699,8,26,1,26,3,26,702,8,26,1,27,1,27,1,27,1,
	27,1,27,1,27,3,27,710,8,27,1,28,1,28,1,28,1,28,1,28,3,28,717,8,28,1,29,
	1,29,1,29,1,29,1,29,3,29,724,8,29,1,30,1,30,1,31,1,31,1,31,1,31,1,31,3,
	31,733,8,31,1,32,1,32,1,33,1,33,1,34,3,34,740,8,34,1,34,1,34,1,34,1,34,
	1,34,1,34,3,34,748,8,34,1,35,1,35,1,35,1,35,1,35,1,35,3,35,756,8,35,1,35,
	3,35,759,8,35,1,36,1,36,1,36,1,36,1,36,3,36,766,8,36,1,37,1,37,4,37,770,
	8,37,11,37,12,37,771,1,38,1,38,1,39,1,39,1,40,1,40,1,40,5,40,781,8,40,10,
	40,12,40,784,9,40,1,41,1,41,1,41,1,41,1,41,1,41,3,41,792,8,41,1,41,1,41,
	3,41,796,8,41,1,41,1,41,3,41,800,8,41,1,41,1,41,3,41,804,8,41,1,42,1,42,
	1,43,1,43,1,43,3,43,811,8,43,1,43,1,43,1,43,1,43,3,43,817,8,43,1,44,1,44,
	1,44,3,44,822,8,44,1,45,1,45,1,45,3,45,827,8,45,1,45,1,45,1,45,1,45,4,45,
	833,8,45,11,45,12,45,834,1,46,1,46,1,46,1,46,3,46,841,8,46,1,46,3,46,844,
	8,46,1,47,1,47,1,47,1,47,1,48,1,48,1,49,1,49,1,50,1,50,1,50,1,50,1,50,3,
	50,859,8,50,1,50,1,50,3,50,863,8,50,1,50,1,50,3,50,867,8,50,1,50,3,50,870,
	8,50,1,51,3,51,873,8,51,1,51,1,51,1,51,1,51,5,51,879,8,51,10,51,12,51,882,
	9,51,1,52,4,52,885,8,52,11,52,12,52,886,1,53,3,53,890,8,53,1,53,1,53,1,
	53,1,53,5,53,896,8,53,10,53,12,53,899,9,53,1,53,3,53,902,8,53,1,54,1,54,
	1,54,1,54,4,54,908,8,54,11,54,12,54,909,1,54,1,54,1,54,1,54,1,54,1,54,1,
	54,3,54,919,8,54,1,55,1,55,1,55,1,55,1,55,1,55,3,55,927,8,55,1,55,3,55,
	930,8,55,1,56,4,56,933,8,56,11,56,12,56,934,1,57,1,57,4,57,939,8,57,11,
	57,12,57,940,1,58,4,58,944,8,58,11,58,12,58,945,1,59,1,59,1,60,1,60,1,60,
	3,60,953,8,60,1,60,1,60,1,60,1,60,3,60,959,8,60,1,60,3,60,962,8,60,1,60,
	3,60,965,8,60,1,61,1,61,1,61,3,61,970,8,61,1,61,1,61,4,61,974,8,61,11,61,
	12,61,975,1,62,1,62,5,62,980,8,62,10,62,12,62,983,9,62,1,63,1,63,1,63,1,
	63,1,63,1,63,1,63,1,63,1,63,1,63,1,63,1,63,1,63,1,63,3,63,999,8,63,1,64,
	1,64,1,64,1,65,1,65,1,65,1,65,1,65,3,65,1009,8,65,3,65,1011,8,65,1,66,1,
	66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,3,66,1025,8,66,1,66,
	3,66,1028,8,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,3,66,1040,
	8,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,1,66,3,66,1053,8,
	66,1,67,1,67,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,1,68,
	1,69,4,69,1070,8,69,11,69,12,69,1071,1,70,4,70,1075,8,70,11,70,12,70,1076,
	1,71,1,71,1,71,1,71,1,71,3,71,1084,8,71,1,72,1,72,3,72,1088,8,72,1,73,1,
	73,1,74,1,74,1,74,1,74,3,74,1096,8,74,1,74,3,74,1099,8,74,1,74,1,74,1,74,
	1,74,1,74,3,74,1106,8,74,1,74,3,74,1109,8,74,3,74,1111,8,74,1,75,1,75,1,
	75,1,75,1,75,5,75,1118,8,75,10,75,12,75,1121,9,75,1,76,1,76,1,76,1,76,1,
	76,1,77,1,77,1,78,1,78,1,78,1,78,1,78,1,78,3,78,1136,8,78,1,78,3,78,1139,
	8,78,3,78,1141,8,78,1,79,1,79,1,79,3,79,1146,8,79,1,80,1,80,1,80,1,80,1,
	80,1,80,1,81,3,81,1155,8,81,1,81,1,81,1,81,1,82,1,82,1,82,3,82,1163,8,82,
	1,83,1,83,1,83,1,83,1,83,1,83,4,83,1171,8,83,11,83,12,83,1172,1,83,1,83,
	1,83,1,83,3,83,1179,8,83,1,83,1,83,1,83,1,83,1,83,1,83,4,83,1187,8,83,11,
	83,12,83,1188,1,83,1,83,1,83,1,83,3,83,1195,8,83,1,83,1,83,1,83,1,83,1,
	83,1,83,4,83,1203,8,83,11,83,12,83,1204,3,83,1207,8,83,1,84,1,84,1,84,1,
	84,1,84,1,84,1,84,1,84,1,84,1,84,1,84,1,84,1,84,1,84,3,84,1223,8,84,1,85,
	1,85,1,85,3,85,1228,8,85,1,86,4,86,1231,8,86,11,86,12,86,1232,1,87,1,87,
	1,88,1,88,1,88,3,88,1240,8,88,1,88,1,88,1,88,1,88,1,88,1,88,4,88,1248,8,
	88,11,88,12,88,1249,1,89,1,89,1,89,3,89,1255,8,89,1,90,1,90,1,90,3,90,1260,
	8,90,1,91,1,91,1,91,1,91,5,91,1266,8,91,10,91,12,91,1269,9,91,1,92,1,92,
	1,92,1,92,5,92,1275,8,92,10,92,12,92,1278,9,92,1,93,1,93,4,93,1282,8,93,
	11,93,12,93,1283,1,93,3,93,1287,8,93,1,94,1,94,4,94,1291,8,94,11,94,12,
	94,1292,1,94,3,94,1296,8,94,1,95,1,95,1,95,1,95,1,96,1,96,1,97,3,97,1305,
	8,97,1,97,1,97,1,98,3,98,1310,8,98,1,98,3,98,1313,8,98,1,98,4,98,1316,8,
	98,11,98,12,98,1317,1,99,1,99,1,99,1,100,1,100,3,100,1325,8,100,1,101,1,
	101,1,101,1,101,1,101,3,101,1332,8,101,1,102,1,102,1,103,3,103,1337,8,103,
	1,103,1,103,3,103,1341,8,103,1,103,1,103,1,104,1,104,1,105,3,105,1348,8,
	105,1,105,1,105,1,105,1,105,1,105,1,106,1,106,1,106,1,107,1,107,1,107,1,
	108,1,108,1,108,1,109,1,109,1,109,1,109,1,109,1,109,1,109,4,109,1371,8,
	109,11,109,12,109,1372,1,110,1,110,1,110,1,110,1,110,1,110,3,110,1381,8,
	110,1,111,1,111,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,112,1,
	112,1,112,3,112,1396,8,112,1,113,1,113,1,113,1,113,3,113,1402,8,113,1,113,
	1,113,1,113,1,113,1,113,1,113,4,113,1410,8,113,11,113,12,113,1411,1,114,
	1,114,1,115,1,115,1,116,1,116,1,117,1,117,1,118,1,118,1,119,1,119,1,120,
	1,120,5,120,1428,8,120,10,120,12,120,1431,9,120,1,120,1,120,1,121,3,121,
	1436,8,121,1,121,1,121,1,121,1,121,1,122,1,122,1,122,3,122,1445,8,122,1,
	122,1,122,5,122,1449,8,122,10,122,12,122,1452,9,122,1,123,1,123,1,123,1,
	123,1,123,1,123,1,123,1,123,1,123,1,123,1,123,1,123,1,123,3,123,1467,8,
	123,1,124,1,124,1,124,1,124,1,124,1,124,1,124,1,124,1,124,1,124,1,124,1,
	124,1,124,3,124,1482,8,124,1,125,1,125,1,125,3,125,1487,8,125,1,126,1,126,
	1,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,
	1,126,5,126,1504,8,126,10,126,12,126,1507,9,126,1,126,1,126,1,126,1,126,
	1,126,1,126,1,126,3,126,1516,8,126,1,126,1,126,3,126,1520,8,126,1,127,1,
	127,1,127,1,127,3,127,1526,8,127,1,127,1,127,1,127,3,127,1531,8,127,1,128,
	1,128,1,129,1,129,1,130,1,130,1,130,1,130,5,130,1541,8,130,10,130,12,130,
	1544,9,130,1,131,1,131,1,132,1,132,1,132,1,132,5,132,1552,8,132,10,132,
	12,132,1555,9,132,1,133,1,133,1,134,1,134,1,134,1,134,5,134,1563,8,134,
	10,134,12,134,1566,9,134,1,135,1,135,1,136,1,136,1,136,1,136,1,136,1,136,
	1,136,1,136,1,136,1,136,1,136,1,136,1,136,3,136,1583,8,136,1,136,1,136,
	1,136,1,136,1,136,1,136,3,136,1591,8,136,1,136,1,136,1,136,1,136,5,136,
	1597,8,136,10,136,12,136,1600,9,136,1,136,1,136,1,136,1,136,1,136,1,136,
	1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,
	1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,3,136,
	1631,8,136,1,136,3,136,1634,8,136,1,136,1,136,1,136,1,136,1,136,1,136,1,
	136,1,136,1,136,5,136,1645,8,136,10,136,12,136,1648,9,136,1,136,1,136,1,
	136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,5,
	136,1664,8,136,10,136,12,136,1667,9,136,1,136,1,136,1,136,1,136,1,136,1,
	136,1,136,1,136,1,136,1,136,5,136,1679,8,136,10,136,12,136,1682,9,136,1,
	136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,
	136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,
	136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,5,
	136,1720,8,136,10,136,12,136,1723,9,136,1,136,1,136,1,136,1,136,1,136,1,
	136,1,136,5,136,1732,8,136,10,136,12,136,1735,9,136,1,136,1,136,1,136,1,
	136,1,136,1,136,3,136,1743,8,136,1,136,1,136,1,136,1,136,1,136,3,136,1750,
	8,136,1,136,1,136,3,136,1754,8,136,1,136,3,136,1757,8,136,1,136,1,136,1,
	136,4,136,1762,8,136,11,136,12,136,1763,1,136,1,136,1,136,3,136,1769,8,
	136,1,136,1,136,1,136,1,136,1,136,3,136,1776,8,136,1,136,4,136,1779,8,136,
	11,136,12,136,1780,1,136,1,136,1,136,1,136,1,136,3,136,1788,8,136,1,136,
	1,136,3,136,1792,8,136,1,136,1,136,1,136,1,136,1,136,3,136,1799,8,136,1,
	136,1,136,3,136,1803,8,136,1,136,1,136,1,136,1,136,1,136,3,136,1810,8,136,
	1,136,1,136,3,136,1814,8,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,
	1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,3,136,
	1834,8,136,1,136,1,136,1,136,4,136,1839,8,136,11,136,12,136,1840,1,136,
	1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,1,136,
	1,136,1,136,1,136,1,136,1,136,5,136,1861,8,136,10,136,12,136,1864,9,136,
	1,137,1,137,1,137,1,137,1,137,1,138,1,138,1,138,1,138,1,138,1,138,3,138,
	1877,8,138,1,139,1,139,1,139,1,140,1,140,1,140,1,141,1,141,1,141,3,141,
	1888,8,141,1,142,1,142,1,142,1,143,1,143,1,143,1,143,1,143,1,143,1,143,
	1,143,1,143,1,143,1,143,1,143,1,143,1,143,1,143,1,143,3,143,1909,8,143,
	1,144,1,144,1,144,1,144,1,144,1,144,1,144,1,144,1,144,1,144,1,144,1,144,
	1,144,1,144,1,144,1,144,3,144,1927,8,144,1,145,1,145,1,145,1,145,3,145,
	1933,8,145,1,146,1,146,1,146,1,146,1,146,1,146,3,146,1941,8,146,1,147,1,
	147,1,148,1,148,1,148,1,148,3,148,1949,8,148,1,148,1,148,1,148,1,148,3,
	148,1955,8,148,1,149,1,149,1,149,1,149,3,149,1961,8,149,1,150,1,150,1,150,
	1,150,1,150,1,150,1,150,1,151,1,151,1,151,1,151,1,151,1,151,1,151,5,151,
	1977,8,151,10,151,12,151,1980,9,151,1,151,1,151,1,151,1,151,1,152,1,152,
	1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,
	1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,1,152,
	3,152,2012,8,152,1,153,1,153,1,153,1,153,1,153,1,153,1,153,1,153,3,153,
	2022,8,153,1,154,1,154,1,154,1,154,1,154,1,154,1,154,1,154,1,154,1,154,
	1,154,1,154,3,154,2036,8,154,1,155,1,155,1,155,1,155,4,155,2042,8,155,11,
	155,12,155,2043,1,155,3,155,2047,8,155,1,155,3,155,2050,8,155,1,156,1,156,
	1,157,1,157,1,157,1,157,1,157,1,157,1,157,3,157,2061,8,157,1,157,3,157,
	2064,8,157,1,158,1,158,1,159,1,159,1,159,3,159,2071,8,159,1,160,1,160,5,
	160,2075,8,160,10,160,12,160,2078,9,160,1,161,1,161,1,161,3,161,2083,8,
	161,1,162,1,162,1,162,1,162,1,162,1,162,1,162,1,162,1,162,1,162,1,162,1,
	162,1,162,1,162,3,162,2099,8,162,1,163,1,163,1,163,3,163,2104,8,163,1,163,
	0,1,272,164,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,
	44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,80,82,84,86,88,90,
	92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,122,124,126,128,
	130,132,134,136,138,140,142,144,146,148,150,152,154,156,158,160,162,164,
	166,168,170,172,174,176,178,180,182,184,186,188,190,192,194,196,198,200,
	202,204,206,208,210,212,214,216,218,220,222,224,226,228,230,232,234,236,
	238,240,242,244,246,248,250,252,254,256,258,260,262,264,266,268,270,272,
	274,276,278,280,282,284,286,288,290,292,294,296,298,300,302,304,306,308,
	310,312,314,316,318,320,322,324,326,0,51,1,0,289,289,16,0,96,96,110,110,
	113,113,120,120,128,128,157,157,186,186,197,198,201,202,205,206,217,217,
	219,220,228,228,230,230,249,249,263,263,15,0,96,96,110,110,120,120,128,
	128,157,157,186,186,197,198,201,202,205,206,217,217,219,220,228,228,230,
	230,249,249,263,263,4,0,117,117,208,208,211,211,213,213,12,0,142,142,144,
	144,172,172,204,204,212,212,216,216,225,225,227,227,229,229,237,237,240,
	240,244,244,7,0,205,206,217,218,220,221,223,224,234,235,238,239,246,247,
	1,0,159,160,2,0,3,3,164,164,2,0,175,176,179,179,2,0,208,208,213,213,7,0,
	133,133,205,206,217,224,234,235,238,239,246,247,249,263,1,0,183,185,2,0,
	186,186,263,264,5,0,28,28,95,96,98,100,102,106,277,277,2,0,144,144,236,
	236,2,0,110,110,113,113,2,0,47,48,124,124,6,0,48,50,52,52,124,124,127,127,
	129,129,137,138,3,0,208,208,211,211,213,213,9,0,142,142,172,172,204,204,
	212,212,216,216,227,227,229,229,237,237,244,244,3,0,208,208,213,213,248,
	248,1,0,241,242,1,0,153,154,4,0,197,198,201,202,211,211,264,264,3,0,280,
	281,285,285,288,288,2,0,207,207,210,210,2,0,109,109,117,117,1,0,157,158,
	1,0,149,150,2,0,113,113,117,117,1,0,54,59,1,0,54,55,2,0,54,55,64,67,2,0,
	212,212,225,225,3,0,47,48,54,54,124,124,11,0,22,25,38,39,47,67,113,113,
	121,121,124,124,127,127,129,130,136,136,138,138,216,216,3,0,133,133,139,
	139,148,148,2,0,122,123,132,132,2,0,143,143,284,284,2,0,217,217,220,220,
	2,0,133,133,139,139,3,0,134,135,140,141,151,151,2,0,187,187,189,189,2,0,
	68,71,80,83,1,0,84,87,1,0,88,91,4,0,72,72,74,74,76,76,78,78,4,0,73,73,75,
	75,77,77,79,79,1,0,274,275,2,0,193,193,196,196,1,0,134,135,2334,0,336,1,
	0,0,0,2,347,1,0,0,0,4,349,1,0,0,0,6,356,1,0,0,0,8,363,1,0,0,0,10,381,1,
	0,0,0,12,401,1,0,0,0,14,419,1,0,0,0,16,422,1,0,0,0,18,426,1,0,0,0,20,428,
	1,0,0,0,22,430,1,0,0,0,24,489,1,0,0,0,26,548,1,0,0,0,28,552,1,0,0,0,30,
	602,1,0,0,0,32,604,1,0,0,0,34,613,1,0,0,0,36,622,1,0,0,0,38,631,1,0,0,0,
	40,633,1,0,0,0,42,635,1,0,0,0,44,637,1,0,0,0,46,639,1,0,0,0,48,661,1,0,
	0,0,50,670,1,0,0,0,52,679,1,0,0,0,54,709,1,0,0,0,56,711,1,0,0,0,58,718,
	1,0,0,0,60,725,1,0,0,0,62,727,1,0,0,0,64,734,1,0,0,0,66,736,1,0,0,0,68,
	739,1,0,0,0,70,749,1,0,0,0,72,765,1,0,0,0,74,767,1,0,0,0,76,773,1,0,0,0,
	78,775,1,0,0,0,80,777,1,0,0,0,82,785,1,0,0,0,84,805,1,0,0,0,86,816,1,0,
	0,0,88,818,1,0,0,0,90,823,1,0,0,0,92,843,1,0,0,0,94,845,1,0,0,0,96,849,
	1,0,0,0,98,851,1,0,0,0,100,853,1,0,0,0,102,872,1,0,0,0,104,884,1,0,0,0,
	106,901,1,0,0,0,108,918,1,0,0,0,110,920,1,0,0,0,112,932,1,0,0,0,114,938,
	1,0,0,0,116,943,1,0,0,0,118,947,1,0,0,0,120,949,1,0,0,0,122,966,1,0,0,0,
	124,977,1,0,0,0,126,998,1,0,0,0,128,1000,1,0,0,0,130,1010,1,0,0,0,132,1052,
	1,0,0,0,134,1054,1,0,0,0,136,1056,1,0,0,0,138,1069,1,0,0,0,140,1074,1,0,
	0,0,142,1083,1,0,0,0,144,1087,1,0,0,0,146,1089,1,0,0,0,148,1110,1,0,0,0,
	150,1112,1,0,0,0,152,1122,1,0,0,0,154,1127,1,0,0,0,156,1129,1,0,0,0,158,
	1142,1,0,0,0,160,1147,1,0,0,0,162,1154,1,0,0,0,164,1159,1,0,0,0,166,1206,
	1,0,0,0,168,1222,1,0,0,0,170,1224,1,0,0,0,172,1230,1,0,0,0,174,1234,1,0,
	0,0,176,1239,1,0,0,0,178,1251,1,0,0,0,180,1256,1,0,0,0,182,1261,1,0,0,0,
	184,1270,1,0,0,0,186,1286,1,0,0,0,188,1295,1,0,0,0,190,1297,1,0,0,0,192,
	1301,1,0,0,0,194,1304,1,0,0,0,196,1309,1,0,0,0,198,1319,1,0,0,0,200,1324,
	1,0,0,0,202,1331,1,0,0,0,204,1333,1,0,0,0,206,1336,1,0,0,0,208,1344,1,0,
	0,0,210,1347,1,0,0,0,212,1354,1,0,0,0,214,1357,1,0,0,0,216,1360,1,0,0,0,
	218,1363,1,0,0,0,220,1380,1,0,0,0,222,1382,1,0,0,0,224,1395,1,0,0,0,226,
	1401,1,0,0,0,228,1413,1,0,0,0,230,1415,1,0,0,0,232,1417,1,0,0,0,234,1419,
	1,0,0,0,236,1421,1,0,0,0,238,1423,1,0,0,0,240,1425,1,0,0,0,242,1435,1,0,
	0,0,244,1441,1,0,0,0,246,1466,1,0,0,0,248,1481,1,0,0,0,250,1483,1,0,0,0,
	252,1519,1,0,0,0,254,1530,1,0,0,0,256,1532,1,0,0,0,258,1534,1,0,0,0,260,
	1536,1,0,0,0,262,1545,1,0,0,0,264,1547,1,0,0,0,266,1556,1,0,0,0,268,1558,
	1,0,0,0,270,1567,1,0,0,0,272,1833,1,0,0,0,274,1865,1,0,0,0,276,1876,1,0,
	0,0,278,1878,1,0,0,0,280,1881,1,0,0,0,282,1887,1,0,0,0,284,1889,1,0,0,0,
	286,1908,1,0,0,0,288,1926,1,0,0,0,290,1932,1,0,0,0,292,1940,1,0,0,0,294,
	1942,1,0,0,0,296,1954,1,0,0,0,298,1956,1,0,0,0,300,1962,1,0,0,0,302,1969,
	1,0,0,0,304,2011,1,0,0,0,306,2021,1,0,0,0,308,2035,1,0,0,0,310,2037,1,0,
	0,0,312,2051,1,0,0,0,314,2053,1,0,0,0,316,2065,1,0,0,0,318,2067,1,0,0,0,
	320,2072,1,0,0,0,322,2079,1,0,0,0,324,2098,1,0,0,0,326,2100,1,0,0,0,328,
	335,3,2,1,0,329,335,3,120,60,0,330,335,3,122,61,0,331,335,3,4,2,0,332,335,
	3,156,78,0,333,335,3,80,40,0,334,328,1,0,0,0,334,329,1,0,0,0,334,330,1,
	0,0,0,334,331,1,0,0,0,334,332,1,0,0,0,334,333,1,0,0,0,335,338,1,0,0,0,336,
	334,1,0,0,0,336,337,1,0,0,0,337,339,1,0,0,0,338,336,1,0,0,0,339,340,5,0,
	0,1,340,1,1,0,0,0,341,348,3,46,23,0,342,348,3,70,35,0,343,348,3,100,50,
	0,344,348,3,90,45,0,345,348,3,108,54,0,346,348,3,310,155,0,347,341,1,0,
	0,0,347,342,1,0,0,0,347,343,1,0,0,0,347,344,1,0,0,0,347,345,1,0,0,0,347,
	346,1,0,0,0,348,3,1,0,0,0,349,350,5,98,0,0,350,352,3,32,16,0,351,353,3,
	128,64,0,352,351,1,0,0,0,352,353,1,0,0,0,353,354,1,0,0,0,354,355,3,6,3,
	0,355,5,1,0,0,0,356,357,3,8,4,0,357,359,3,10,5,0,358,360,3,12,6,0,359,358,
	1,0,0,0,360,361,1,0,0,0,361,359,1,0,0,0,361,362,1,0,0,0,362,7,1,0,0,0,363,
	365,5,289,0,0,364,366,5,289,0,0,365,364,1,0,0,0,365,366,1,0,0,0,366,367,
	1,0,0,0,367,368,3,16,8,0,368,369,5,289,0,0,369,374,3,16,8,0,370,371,5,289,
	0,0,371,373,3,16,8,0,372,370,1,0,0,0,373,376,1,0,0,0,374,372,1,0,0,0,374,
	375,1,0,0,0,375,378,1,0,0,0,376,374,1,0,0,0,377,379,5,289,0,0,378,377,1,
	0,0,0,378,379,1,0,0,0,379,9,1,0,0,0,380,382,5,289,0,0,381,380,1,0,0,0,381,
	382,1,0,0,0,382,391,1,0,0,0,383,385,5,288,0,0,384,383,1,0,0,0,385,386,1,
	0,0,0,386,384,1,0,0,0,386,387,1,0,0,0,387,389,1,0,0,0,388,390,5,289,0,0,
	389,388,1,0,0,0,389,390,1,0,0,0,390,392,1,0,0,0,391,384,1,0,0,0,392,393,
	1,0,0,0,393,391,1,0,0,0,393,394,1,0,0,0,394,398,1,0,0,0,395,397,5,288,0,
	0,396,395,1,0,0,0,397,400,1,0,0,0,398,396,1,0,0,0,398,399,1,0,0,0,399,11,
	1,0,0,0,400,398,1,0,0,0,401,402,5,289,0,0,402,403,5,264,0,0,403,404,5,289,
	0,0,404,405,3,246,123,0,405,406,5,289,0,0,406,411,3,14,7,0,407,408,5,289,
	0,0,408,410,3,14,7,0,409,407,1,0,0,0,410,413,1,0,0,0,411,409,1,0,0,0,411,
	412,1,0,0,0,412,415,1,0,0,0,413,411,1,0,0,0,414,416,5,289,0,0,415,414,1,
	0,0,0,415,416,1,0,0,0,416,13,1,0,0,0,417,420,3,246,123,0,418,420,5,290,
	0,0,419,417,1,0,0,0,419,418,1,0,0,0,420,15,1,0,0,0,421,423,8,0,0,0,422,
	421,1,0,0,0,423,424,1,0,0,0,424,422,1,0,0,0,424,425,1,0,0,0,425,17,1,0,
	0,0,426,427,5,263,0,0,427,19,1,0,0,0,428,429,7,1,0,0,429,21,1,0,0,0,430,
	431,7,2,0,0,431,23,1,0,0,0,432,434,7,3,0,0,433,432,1,0,0,0,433,434,1,0,
	0,0,434,436,1,0,0,0,435,437,3,20,10,0,436,435,1,0,0,0,437,438,1,0,0,0,438,
	436,1,0,0,0,438,439,1,0,0,0,439,490,1,0,0,0,440,442,3,20,10,0,441,440,1,
	0,0,0,442,443,1,0,0,0,443,441,1,0,0,0,443,444,1,0,0,0,444,490,1,0,0,0,445,
	447,5,45,0,0,446,448,3,20,10,0,447,446,1,0,0,0,448,449,1,0,0,0,449,447,
	1,0,0,0,449,450,1,0,0,0,450,490,1,0,0,0,451,453,5,45,0,0,452,454,3,20,10,
	0,453,452,1,0,0,0,454,455,1,0,0,0,455,453,1,0,0,0,455,456,1,0,0,0,456,457,
	1,0,0,0,457,459,5,172,0,0,458,460,3,20,10,0,459,458,1,0,0,0,460,461,1,0,
	0,0,461,459,1,0,0,0,461,462,1,0,0,0,462,490,1,0,0,0,463,465,3,20,10,0,464,
	463,1,0,0,0,465,466,1,0,0,0,466,464,1,0,0,0,466,467,1,0,0,0,467,468,1,0,
	0,0,468,470,5,172,0,0,469,471,3,20,10,0,470,469,1,0,0,0,471,472,1,0,0,0,
	472,470,1,0,0,0,472,473,1,0,0,0,473,490,1,0,0,0,474,476,5,136,0,0,475,477,
	3,20,10,0,476,475,1,0,0,0,477,478,1,0,0,0,478,476,1,0,0,0,478,479,1,0,0,
	0,479,490,1,0,0,0,480,481,5,213,0,0,481,482,5,186,0,0,482,483,5,206,0,0,
	483,485,5,216,0,0,484,486,3,20,10,0,485,484,1,0,0,0,486,487,1,0,0,0,487,
	485,1,0,0,0,487,488,1,0,0,0,488,490,1,0,0,0,489,433,1,0,0,0,489,441,1,0,
	0,0,489,445,1,0,0,0,489,451,1,0,0,0,489,464,1,0,0,0,489,474,1,0,0,0,489,
	480,1,0,0,0,490,25,1,0,0,0,491,493,7,3,0,0,492,491,1,0,0,0,492,493,1,0,
	0,0,493,495,1,0,0,0,494,496,3,28,14,0,495,494,1,0,0,0,496,497,1,0,0,0,497,
	495,1,0,0,0,497,498,1,0,0,0,498,549,1,0,0,0,499,501,3,28,14,0,500,499,1,
	0,0,0,501,502,1,0,0,0,502,500,1,0,0,0,502,503,1,0,0,0,503,549,1,0,0,0,504,
	506,5,45,0,0,505,507,3,28,14,0,506,505,1,0,0,0,507,508,1,0,0,0,508,506,
	1,0,0,0,508,509,1,0,0,0,509,549,1,0,0,0,510,512,5,45,0,0,511,513,3,28,14,
	0,512,511,1,0,0,0,513,514,1,0,0,0,514,512,1,0,0,0,514,515,1,0,0,0,515,516,
	1,0,0,0,516,518,5,172,0,0,517,519,3,28,14,0,518,517,1,0,0,0,519,520,1,0,
	0,0,520,518,1,0,0,0,520,521,1,0,0,0,521,549,1,0,0,0,522,524,3,28,14,0,523,
	522,1,0,0,0,524,525,1,0,0,0,525,523,1,0,0,0,525,526,1,0,0,0,526,527,1,0,
	0,0,527,529,5,172,0,0,528,530,3,28,14,0,529,528,1,0,0,0,530,531,1,0,0,0,
	531,529,1,0,0,0,531,532,1,0,0,0,532,549,1,0,0,0,533,535,5,136,0,0,534,536,
	3,28,14,0,535,534,1,0,0,0,536,537,1,0,0,0,537,535,1,0,0,0,537,538,1,0,0,
	0,538,549,1,0,0,0,539,540,5,213,0,0,540,541,5,186,0,0,541,542,5,206,0,0,
	542,544,5,216,0,0,543,545,3,28,14,0,544,543,1,0,0,0,545,546,1,0,0,0,546,
	544,1,0,0,0,546,547,1,0,0,0,547,549,1,0,0,0,548,492,1,0,0,0,548,500,1,0,
	0,0,548,504,1,0,0,0,548,510,1,0,0,0,548,523,1,0,0,0,548,533,1,0,0,0,548,
	539,1,0,0,0,549,27,1,0,0,0,550,553,3,20,10,0,551,553,5,264,0,0,552,550,
	1,0,0,0,552,551,1,0,0,0,553,29,1,0,0,0,554,556,7,3,0,0,555,554,1,0,0,0,
	555,556,1,0,0,0,556,558,1,0,0,0,557,559,3,22,11,0,558,557,1,0,0,0,559,560,
	1,0,0,0,560,558,1,0,0,0,560,561,1,0,0,0,561,603,1,0,0,0,562,564,3,22,11,
	0,563,562,1,0,0,0,564,565,1,0,0,0,565,563,1,0,0,0,565,566,1,0,0,0,566,603,
	1,0,0,0,567,569,5,45,0,0,568,570,3,22,11,0,569,568,1,0,0,0,570,571,1,0,
	0,0,571,569,1,0,0,0,571,572,1,0,0,0,572,603,1,0,0,0,573,575,5,45,0,0,574,
	576,3,22,11,0,575,574,1,0,0,0,576,577,1,0,0,0,577,575,1,0,0,0,577,578,1,
	0,0,0,578,579,1,0,0,0,579,581,5,172,0,0,580,582,3,22,11,0,581,580,1,0,0,
	0,582,583,1,0,0,0,583,581,1,0,0,0,583,584,1,0,0,0,584,603,1,0,0,0,585,587,
	3,22,11,0,586,585,1,0,0,0,587,588,1,0,0,0,588,586,1,0,0,0,588,589,1,0,0,
	0,589,590,1,0,0,0,590,592,5,172,0,0,591,593,3,22,11,0,592,591,1,0,0,0,593,
	594,1,0,0,0,594,592,1,0,0,0,594,595,1,0,0,0,595,603,1,0,0,0,596,598,5,136,
	0,0,597,599,3,22,11,0,598,597,1,0,0,0,599,600,1,0,0,0,600,598,1,0,0,0,600,
	601,1,0,0,0,601,603,1,0,0,0,602,555,1,0,0,0,602,563,1,0,0,0,602,567,1,0,
	0,0,602,573,1,0,0,0,602,586,1,0,0,0,602,596,1,0,0,0,603,31,1,0,0,0,604,
	610,3,24,12,0,605,606,3,38,19,0,606,607,3,24,12,0,607,609,1,0,0,0,608,605,
	1,0,0,0,609,612,1,0,0,0,610,608,1,0,0,0,610,611,1,0,0,0,611,33,1,0,0,0,
	612,610,1,0,0,0,613,619,3,26,13,0,614,615,3,38,19,0,615,616,3,26,13,0,616,
	618,1,0,0,0,617,614,1,0,0,0,618,621,1,0,0,0,619,617,1,0,0,0,619,620,1,0,
	0,0,620,35,1,0,0,0,621,619,1,0,0,0,622,628,3,30,15,0,623,624,3,38,19,0,
	624,625,3,30,15,0,625,627,1,0,0,0,626,623,1,0,0,0,627,630,1,0,0,0,628,626,
	1,0,0,0,628,629,1,0,0,0,629,37,1,0,0,0,630,628,1,0,0,0,631,632,7,4,0,0,
	632,39,1,0,0,0,633,634,5,266,0,0,634,41,1,0,0,0,635,636,5,263,0,0,636,43,
	1,0,0,0,637,638,7,5,0,0,638,45,1,0,0,0,639,640,5,99,0,0,640,648,3,36,18,
	0,641,643,5,174,0,0,642,644,5,263,0,0,643,642,1,0,0,0,644,645,1,0,0,0,645,
	643,1,0,0,0,645,646,1,0,0,0,646,647,1,0,0,0,647,649,5,271,0,0,648,641,1,
	0,0,0,648,649,1,0,0,0,649,651,1,0,0,0,650,652,5,161,0,0,651,650,1,0,0,0,
	651,652,1,0,0,0,652,656,1,0,0,0,653,655,3,48,24,0,654,653,1,0,0,0,655,658,
	1,0,0,0,656,654,1,0,0,0,656,657,1,0,0,0,657,47,1,0,0,0,658,656,1,0,0,0,
	659,662,3,50,25,0,660,662,3,52,26,0,661,659,1,0,0,0,661,660,1,0,0,0,662,
	663,1,0,0,0,663,664,5,277,0,0,664,49,1,0,0,0,665,667,5,113,0,0,666,665,
	1,0,0,0,666,667,1,0,0,0,667,668,1,0,0,0,668,671,3,18,9,0,669,671,3,34,17,
	0,670,666,1,0,0,0,670,669,1,0,0,0,671,672,1,0,0,0,672,674,5,170,0,0,673,
	675,7,6,0,0,674,673,1,0,0,0,674,675,1,0,0,0,675,677,1,0,0,0,676,678,3,96,
	48,0,677,676,1,0,0,0,677,678,1,0,0,0,678,51,1,0,0,0,679,683,3,34,17,0,680,
	684,3,54,27,0,681,684,3,76,38,0,682,684,3,78,39,0,683,680,1,0,0,0,683,681,
	1,0,0,0,683,682,1,0,0,0,684,687,1,0,0,0,685,686,5,173,0,0,686,688,3,84,
	42,0,687,685,1,0,0,0,687,688,1,0,0,0,688,698,1,0,0,0,689,690,5,167,0,0,
	690,695,3,98,49,0,691,692,5,212,0,0,692,694,3,98,49,0,693,691,1,0,0,0,694,
	697,1,0,0,0,695,693,1,0,0,0,695,696,1,0,0,0,696,699,1,0,0,0,697,695,1,0,
	0,0,698,689,1,0,0,0,698,699,1,0,0,0,699,701,1,0,0,0,700,702,3,96,48,0,701,
	700,1,0,0,0,701,702,1,0,0,0,702,53,1,0,0,0,703,710,3,58,29,0,704,710,3,
	60,30,0,705,710,3,64,32,0,706,710,3,66,33,0,707,710,3,56,28,0,708,710,3,
	62,31,0,709,703,1,0,0,0,709,704,1,0,0,0,709,705,1,0,0,0,709,706,1,0,0,0,
	709,707,1,0,0,0,709,708,1,0,0,0,710,55,1,0,0,0,711,712,5,101,0,0,712,716,
	5,240,0,0,713,717,3,54,27,0,714,717,3,76,38,0,715,717,3,78,39,0,716,713,
	1,0,0,0,716,714,1,0,0,0,716,715,1,0,0,0,717,57,1,0,0,0,718,723,5,177,0,
	0,719,720,5,270,0,0,720,721,3,68,34,0,721,722,5,271,0,0,722,724,1,0,0,0,
	723,719,1,0,0,0,723,724,1,0,0,0,724,59,1,0,0,0,725,726,5,182,0,0,726,61,
	1,0,0,0,727,732,5,178,0,0,728,729,5,270,0,0,729,730,3,68,34,0,730,731,5,
	271,0,0,731,733,1,0,0,0,732,728,1,0,0,0,732,733,1,0,0,0,733,63,1,0,0,0,
	734,735,5,162,0,0,735,65,1,0,0,0,736,737,7,7,0,0,737,67,1,0,0,0,738,740,
	7,8,0,0,739,738,1,0,0,0,739,740,1,0,0,0,740,747,1,0,0,0,741,748,5,168,0,
	0,742,743,5,169,0,0,743,744,5,172,0,0,744,745,5,264,0,0,745,748,5,165,0,
	0,746,748,5,169,0,0,747,741,1,0,0,0,747,742,1,0,0,0,747,746,1,0,0,0,748,
	69,1,0,0,0,749,750,5,100,0,0,750,751,5,263,0,0,751,752,5,29,0,0,752,755,
	3,72,36,0,753,754,5,173,0,0,754,756,3,86,43,0,755,753,1,0,0,0,755,756,1,
	0,0,0,756,758,1,0,0,0,757,759,5,277,0,0,758,757,1,0,0,0,758,759,1,0,0,0,
	759,71,1,0,0,0,760,766,3,74,37,0,761,766,3,58,29,0,762,766,3,60,30,0,763,
	766,3,64,32,0,764,766,3,66,33,0,765,760,1,0,0,0,765,761,1,0,0,0,765,762,
	1,0,0,0,765,763,1,0,0,0,765,764,1,0,0,0,766,73,1,0,0,0,767,769,5,166,0,
	0,768,770,5,269,0,0,769,768,1,0,0,0,770,771,1,0,0,0,771,769,1,0,0,0,771,
	772,1,0,0,0,772,75,1,0,0,0,773,774,5,263,0,0,774,77,1,0,0,0,775,776,5,263,
	0,0,776,79,1,0,0,0,777,778,5,103,0,0,778,782,3,18,9,0,779,781,3,82,41,0,
	780,779,1,0,0,0,781,784,1,0,0,0,782,780,1,0,0,0,782,783,1,0,0,0,783,81,
	1,0,0,0,784,782,1,0,0,0,785,786,7,9,0,0,786,791,3,84,42,0,787,788,5,174,
	0,0,788,789,3,84,42,0,789,790,5,271,0,0,790,792,1,0,0,0,791,787,1,0,0,0,
	791,792,1,0,0,0,792,793,1,0,0,0,793,795,3,84,42,0,794,796,3,84,42,0,795,
	794,1,0,0,0,795,796,1,0,0,0,796,803,1,0,0,0,797,799,5,265,0,0,798,800,5,
	278,0,0,799,798,1,0,0,0,799,800,1,0,0,0,800,801,1,0,0,0,801,802,5,264,0,
	0,802,804,3,84,42,0,803,797,1,0,0,0,803,804,1,0,0,0,804,83,1,0,0,0,805,
	806,7,10,0,0,806,85,1,0,0,0,807,810,3,88,44,0,808,809,5,278,0,0,809,811,
	3,88,44,0,810,808,1,0,0,0,810,811,1,0,0,0,811,817,1,0,0,0,812,817,5,264,
	0,0,813,817,5,279,0,0,814,817,5,260,0,0,815,817,5,261,0,0,816,807,1,0,0,
	0,816,812,1,0,0,0,816,813,1,0,0,0,816,814,1,0,0,0,816,815,1,0,0,0,817,87,
	1,0,0,0,818,821,3,84,42,0,819,820,5,284,0,0,820,822,5,264,0,0,821,819,1,
	0,0,0,821,822,1,0,0,0,822,89,1,0,0,0,823,824,5,102,0,0,824,826,3,32,16,
	0,825,827,5,274,0,0,826,825,1,0,0,0,826,827,1,0,0,0,827,828,1,0,0,0,828,
	829,5,27,0,0,829,830,3,32,16,0,830,832,3,92,46,0,831,833,3,94,47,0,832,
	831,1,0,0,0,833,834,1,0,0,0,834,832,1,0,0,0,834,835,1,0,0,0,835,91,1,0,
	0,0,836,837,5,2,0,0,837,838,3,38,19,0,838,840,5,271,0,0,839,841,5,276,0,
	0,840,839,1,0,0,0,840,841,1,0,0,0,841,844,1,0,0,0,842,844,5,1,0,0,843,836,
	1,0,0,0,843,842,1,0,0,0,844,93,1,0,0,0,845,846,5,264,0,0,846,847,5,275,
	0,0,847,848,3,32,16,0,848,95,1,0,0,0,849,850,7,11,0,0,850,97,1,0,0,0,851,
	852,5,263,0,0,852,99,1,0,0,0,853,854,5,104,0,0,854,855,3,102,51,0,855,858,
	5,276,0,0,856,859,3,54,27,0,857,859,3,76,38,0,858,856,1,0,0,0,858,857,1,
	0,0,0,859,862,1,0,0,0,860,861,5,173,0,0,861,863,3,86,43,0,862,860,1,0,0,
	0,862,863,1,0,0,0,863,866,1,0,0,0,864,865,5,113,0,0,865,867,3,246,123,0,
	866,864,1,0,0,0,866,867,1,0,0,0,867,869,1,0,0,0,868,870,3,96,48,0,869,868,
	1,0,0,0,869,870,1,0,0,0,870,101,1,0,0,0,871,873,7,9,0,0,872,871,1,0,0,0,
	872,873,1,0,0,0,873,874,1,0,0,0,874,880,3,104,52,0,875,876,3,38,19,0,876,
	877,3,104,52,0,877,879,1,0,0,0,878,875,1,0,0,0,879,882,1,0,0,0,880,878,
	1,0,0,0,880,881,1,0,0,0,881,103,1,0,0,0,882,880,1,0,0,0,883,885,7,12,0,
	0,884,883,1,0,0,0,885,886,1,0,0,0,886,884,1,0,0,0,886,887,1,0,0,0,887,105,
	1,0,0,0,888,890,7,9,0,0,889,888,1,0,0,0,889,890,1,0,0,0,890,891,1,0,0,0,
	891,897,3,104,52,0,892,893,3,38,19,0,893,894,3,104,52,0,894,896,1,0,0,0,
	895,892,1,0,0,0,896,899,1,0,0,0,897,895,1,0,0,0,897,898,1,0,0,0,898,902,
	1,0,0,0,899,897,1,0,0,0,900,902,3,32,16,0,901,889,1,0,0,0,901,900,1,0,0,
	0,902,107,1,0,0,0,903,904,5,105,0,0,904,905,3,32,16,0,905,907,3,110,55,
	0,906,908,3,110,55,0,907,906,1,0,0,0,908,909,1,0,0,0,909,907,1,0,0,0,909,
	910,1,0,0,0,910,911,1,0,0,0,911,912,3,116,58,0,912,919,1,0,0,0,913,914,
	5,28,0,0,914,915,3,32,16,0,915,916,3,110,55,0,916,917,3,116,58,0,917,919,
	1,0,0,0,918,903,1,0,0,0,918,913,1,0,0,0,919,109,1,0,0,0,920,921,7,9,0,0,
	921,926,3,114,57,0,922,923,5,174,0,0,923,924,3,32,16,0,924,925,5,271,0,
	0,925,927,1,0,0,0,926,922,1,0,0,0,926,927,1,0,0,0,927,929,1,0,0,0,928,930,
	3,112,56,0,929,928,1,0,0,0,929,930,1,0,0,0,930,111,1,0,0,0,931,933,3,20,
	10,0,932,931,1,0,0,0,933,934,1,0,0,0,934,932,1,0,0,0,934,935,1,0,0,0,935,
	113,1,0,0,0,936,939,3,20,10,0,937,939,3,38,19,0,938,936,1,0,0,0,938,937,
	1,0,0,0,939,940,1,0,0,0,940,938,1,0,0,0,940,941,1,0,0,0,941,115,1,0,0,0,
	942,944,3,118,59,0,943,942,1,0,0,0,944,945,1,0,0,0,945,943,1,0,0,0,945,
	946,1,0,0,0,946,117,1,0,0,0,947,948,8,13,0,0,948,119,1,0,0,0,949,950,5,
	96,0,0,950,952,3,124,62,0,951,953,5,264,0,0,952,951,1,0,0,0,952,953,1,0,
	0,0,953,954,1,0,0,0,954,955,3,128,64,0,955,961,3,132,66,0,956,958,3,164,
	82,0,957,959,5,275,0,0,958,957,1,0,0,0,958,959,1,0,0,0,959,962,1,0,0,0,
	960,962,5,275,0,0,961,956,1,0,0,0,961,960,1,0,0,0,961,962,1,0,0,0,962,964,
	1,0,0,0,963,965,3,240,120,0,964,963,1,0,0,0,964,965,1,0,0,0,965,121,1,0,
	0,0,966,967,5,97,0,0,967,969,3,32,16,0,968,970,5,112,0,0,969,968,1,0,0,
	0,969,970,1,0,0,0,970,973,1,0,0,0,971,974,3,120,60,0,972,974,3,156,78,0,
	973,971,1,0,0,0,973,972,1,0,0,0,974,975,1,0,0,0,975,973,1,0,0,0,975,976,
	1,0,0,0,976,123,1,0,0,0,977,981,3,34,17,0,978,980,3,126,63,0,979,978,1,
	0,0,0,980,983,1,0,0,0,981,979,1,0,0,0,981,982,1,0,0,0,982,125,1,0,0,0,983,
	981,1,0,0,0,984,999,5,194,0,0,985,986,5,274,0,0,986,999,3,34,17,0,987,988,
	5,274,0,0,988,989,5,172,0,0,989,999,3,34,17,0,990,991,5,212,0,0,991,999,
	3,34,17,0,992,993,5,113,0,0,993,999,3,34,17,0,994,995,5,200,0,0,995,996,
	3,34,17,0,996,997,5,113,0,0,997,999,1,0,0,0,998,984,1,0,0,0,998,985,1,0,
	0,0,998,987,1,0,0,0,998,990,1,0,0,0,998,992,1,0,0,0,998,994,1,0,0,0,999,
	127,1,0,0,0,1000,1001,5,108,0,0,1001,1002,3,130,65,0,1002,129,1,0,0,0,1003,
	1011,5,203,0,0,1004,1005,5,146,0,0,1005,1008,3,40,20,0,1006,1007,7,14,0,
	0,1007,1009,3,40,20,0,1008,1006,1,0,0,0,1008,1009,1,0,0,0,1009,1011,1,0,
	0,0,1010,1003,1,0,0,0,1010,1004,1,0,0,0,1011,131,1,0,0,0,1012,1013,5,211,
	0,0,1013,1014,5,205,0,0,1014,1015,5,113,0,0,1015,1016,5,211,0,0,1016,1053,
	3,32,16,0,1017,1024,3,190,95,0,1018,1019,5,8,0,0,1019,1025,3,246,123,0,
	1020,1021,5,9,0,0,1021,1025,3,246,123,0,1022,1023,5,10,0,0,1023,1025,3,
	246,123,0,1024,1018,1,0,0,0,1024,1020,1,0,0,0,1024,1022,1,0,0,0,1025,1027,
	1,0,0,0,1026,1028,3,288,144,0,1027,1026,1,0,0,0,1027,1028,1,0,0,0,1028,
	1053,1,0,0,0,1029,1030,3,190,95,0,1030,1031,5,114,0,0,1031,1032,3,134,67,
	0,1032,1033,3,246,123,0,1033,1053,1,0,0,0,1034,1053,3,136,68,0,1035,1036,
	3,178,89,0,1036,1037,7,15,0,0,1037,1039,3,194,97,0,1038,1040,3,288,144,
	0,1039,1038,1,0,0,0,1039,1040,1,0,0,0,1040,1053,1,0,0,0,1041,1042,3,178,
	89,0,1042,1043,5,110,0,0,1043,1044,7,9,0,0,1044,1045,3,32,16,0,1045,1046,
	5,172,0,0,1046,1047,3,192,96,0,1047,1048,7,16,0,0,1048,1049,3,246,123,0,
	1049,1053,1,0,0,0,1050,1053,3,148,74,0,1051,1053,3,314,157,0,1052,1012,
	1,0,0,0,1052,1017,1,0,0,0,1052,1029,1,0,0,0,1052,1034,1,0,0,0,1052,1035,
	1,0,0,0,1052,1041,1,0,0,0,1052,1050,1,0,0,0,1052,1051,1,0,0,0,1053,133,
	1,0,0,0,1054,1055,7,17,0,0,1055,135,1,0,0,0,1056,1057,5,211,0,0,1057,1058,
	3,138,69,0,1058,1059,5,240,0,0,1059,1060,5,211,0,0,1060,1061,3,140,70,0,
	1061,1062,5,113,0,0,1062,1063,7,18,0,0,1063,1064,3,138,69,0,1064,1065,5,
	240,0,0,1065,1066,7,18,0,0,1066,1067,3,140,70,0,1067,137,1,0,0,0,1068,1070,
	3,144,72,0,1069,1068,1,0,0,0,1070,1071,1,0,0,0,1071,1069,1,0,0,0,1071,1072,
	1,0,0,0,1072,139,1,0,0,0,1073,1075,3,142,71,0,1074,1073,1,0,0,0,1075,1076,
	1,0,0,0,1076,1074,1,0,0,0,1076,1077,1,0,0,0,1077,141,1,0,0,0,1078,1084,
	3,20,10,0,1079,1084,3,38,19,0,1080,1084,5,208,0,0,1081,1084,5,213,0,0,1082,
	1084,5,211,0,0,1083,1078,1,0,0,0,1083,1079,1,0,0,0,1083,1080,1,0,0,0,1083,
	1081,1,0,0,0,1083,1082,1,0,0,0,1084,143,1,0,0,0,1085,1088,3,20,10,0,1086,
	1088,3,146,73,0,1087,1085,1,0,0,0,1087,1086,1,0,0,0,1088,145,1,0,0,0,1089,
	1090,7,19,0,0,1090,147,1,0,0,0,1091,1092,5,41,0,0,1092,1093,3,32,16,0,1093,
	1095,5,43,0,0,1094,1096,3,150,75,0,1095,1094,1,0,0,0,1095,1096,1,0,0,0,
	1096,1098,1,0,0,0,1097,1099,5,275,0,0,1098,1097,1,0,0,0,1098,1099,1,0,0,
	0,1099,1111,1,0,0,0,1100,1101,5,44,0,0,1101,1102,5,211,0,0,1102,1103,5,
	45,0,0,1103,1105,3,32,16,0,1104,1106,3,150,75,0,1105,1104,1,0,0,0,1105,
	1106,1,0,0,0,1106,1108,1,0,0,0,1107,1109,5,275,0,0,1108,1107,1,0,0,0,1108,
	1109,1,0,0,0,1109,1111,1,0,0,0,1110,1091,1,0,0,0,1110,1100,1,0,0,0,1111,
	149,1,0,0,0,1112,1113,5,172,0,0,1113,1114,3,154,77,0,1114,1115,5,124,0,
	0,1115,1119,3,248,124,0,1116,1118,3,152,76,0,1117,1116,1,0,0,0,1118,1121,
	1,0,0,0,1119,1117,1,0,0,0,1119,1120,1,0,0,0,1120,151,1,0,0,0,1121,1119,
	1,0,0,0,1122,1123,5,212,0,0,1123,1124,3,154,77,0,1124,1125,5,124,0,0,1125,
	1126,3,248,124,0,1126,153,1,0,0,0,1127,1128,3,24,12,0,1128,155,1,0,0,0,
	1129,1130,5,95,0,0,1130,1140,3,32,16,0,1131,1141,3,158,79,0,1132,1138,3,
	162,81,0,1133,1135,3,164,82,0,1134,1136,5,275,0,0,1135,1134,1,0,0,0,1135,
	1136,1,0,0,0,1136,1139,1,0,0,0,1137,1139,5,275,0,0,1138,1133,1,0,0,0,1138,
	1137,1,0,0,0,1138,1139,1,0,0,0,1139,1141,1,0,0,0,1140,1131,1,0,0,0,1140,
	1132,1,0,0,0,1141,157,1,0,0,0,1142,1143,3,160,80,0,1143,1145,5,92,0,0,1144,
	1146,5,275,0,0,1145,1144,1,0,0,0,1145,1146,1,0,0,0,1146,159,1,0,0,0,1147,
	1148,5,208,0,0,1148,1149,3,32,16,0,1149,1150,5,240,0,0,1150,1151,5,120,
	0,0,1151,1152,3,32,16,0,1152,161,1,0,0,0,1153,1155,7,20,0,0,1154,1153,1,
	0,0,0,1154,1155,1,0,0,0,1155,1156,1,0,0,0,1156,1157,3,32,16,0,1157,1158,
	5,94,0,0,1158,163,1,0,0,0,1159,1162,5,111,0,0,1160,1163,3,246,123,0,1161,
	1163,3,166,83,0,1162,1160,1,0,0,0,1162,1161,1,0,0,0,1163,165,1,0,0,0,1164,
	1165,5,46,0,0,1165,1166,3,168,84,0,1166,1167,7,21,0,0,1167,1168,5,40,0,
	0,1168,1170,5,276,0,0,1169,1171,3,170,85,0,1170,1169,1,0,0,0,1171,1172,
	1,0,0,0,1172,1170,1,0,0,0,1172,1173,1,0,0,0,1173,1207,1,0,0,0,1174,1179,
	3,178,89,0,1175,1179,5,215,0,0,1176,1179,5,213,0,0,1177,1179,5,248,0,0,
	1178,1174,1,0,0,0,1178,1175,1,0,0,0,1178,1176,1,0,0,0,1178,1177,1,0,0,0,
	1179,1180,1,0,0,0,1180,1181,5,118,0,0,1181,1182,3,168,84,0,1182,1183,7,
	21,0,0,1183,1184,5,150,0,0,1184,1186,5,276,0,0,1185,1187,3,170,85,0,1186,
	1185,1,0,0,0,1187,1188,1,0,0,0,1188,1186,1,0,0,0,1188,1189,1,0,0,0,1189,
	1207,1,0,0,0,1190,1195,3,178,89,0,1191,1195,5,215,0,0,1192,1195,5,213,0,
	0,1193,1195,5,248,0,0,1194,1190,1,0,0,0,1194,1191,1,0,0,0,1194,1192,1,0,
	0,0,1194,1193,1,0,0,0,1195,1196,1,0,0,0,1196,1197,5,150,0,0,1197,1198,5,
	118,0,0,1198,1199,3,168,84,0,1199,1200,7,21,0,0,1200,1202,5,276,0,0,1201,
	1203,3,170,85,0,1202,1201,1,0,0,0,1203,1204,1,0,0,0,1204,1202,1,0,0,0,1204,
	1205,1,0,0,0,1205,1207,1,0,0,0,1206,1164,1,0,0,0,1206,1178,1,0,0,0,1206,
	1194,1,0,0,0,1207,167,1,0,0,0,1208,1223,5,120,0,0,1209,1223,5,199,0,0,1210,
	1211,7,22,0,0,1211,1212,7,23,0,0,1212,1213,5,240,0,0,1213,1223,5,208,0,
	0,1214,1215,5,155,0,0,1215,1216,7,23,0,0,1216,1217,5,240,0,0,1217,1223,
	5,208,0,0,1218,1219,5,156,0,0,1219,1220,7,23,0,0,1220,1221,5,240,0,0,1221,
	1223,5,208,0,0,1222,1208,1,0,0,0,1222,1209,1,0,0,0,1222,1210,1,0,0,0,1222,
	1214,1,0,0,0,1222,1218,1,0,0,0,1223,169,1,0,0,0,1224,1227,3,172,86,0,1225,
	1228,3,174,87,0,1226,1228,3,176,88,0,1227,1225,1,0,0,0,1227,1226,1,0,0,
	0,1228,171,1,0,0,0,1229,1231,7,24,0,0,1230,1229,1,0,0,0,1231,1232,1,0,0,
	0,1232,1230,1,0,0,0,1232,1233,1,0,0,0,1233,173,1,0,0,0,1234,1235,3,246,
	123,0,1235,175,1,0,0,0,1236,1240,3,178,89,0,1237,1240,5,215,0,0,1238,1240,
	5,248,0,0,1239,1236,1,0,0,0,1239,1237,1,0,0,0,1239,1238,1,0,0,0,1240,1241,
	1,0,0,0,1241,1242,5,150,0,0,1242,1243,5,118,0,0,1243,1244,3,168,84,0,1244,
	1245,7,21,0,0,1245,1247,5,276,0,0,1246,1248,3,170,85,0,1247,1246,1,0,0,
	0,1248,1249,1,0,0,0,1249,1247,1,0,0,0,1249,1250,1,0,0,0,1250,177,1,0,0,
	0,1251,1254,3,182,91,0,1252,1253,7,25,0,0,1253,1255,3,200,100,0,1254,1252,
	1,0,0,0,1254,1255,1,0,0,0,1255,179,1,0,0,0,1256,1259,3,184,92,0,1257,1258,
	7,25,0,0,1258,1260,3,200,100,0,1259,1257,1,0,0,0,1259,1260,1,0,0,0,1260,
	181,1,0,0,0,1261,1267,3,186,93,0,1262,1263,3,38,19,0,1263,1264,3,186,93,
	0,1264,1266,1,0,0,0,1265,1262,1,0,0,0,1266,1269,1,0,0,0,1267,1265,1,0,0,
	0,1267,1268,1,0,0,0,1268,183,1,0,0,0,1269,1267,1,0,0,0,1270,1276,3,188,
	94,0,1271,1272,3,38,19,0,1272,1273,3,188,94,0,1273,1275,1,0,0,0,1274,1271,
	1,0,0,0,1275,1278,1,0,0,0,1276,1274,1,0,0,0,1276,1277,1,0,0,0,1277,185,
	1,0,0,0,1278,1276,1,0,0,0,1279,1281,7,3,0,0,1280,1282,3,20,10,0,1281,1280,
	1,0,0,0,1282,1283,1,0,0,0,1283,1281,1,0,0,0,1283,1284,1,0,0,0,1284,1287,
	1,0,0,0,1285,1287,5,215,0,0,1286,1279,1,0,0,0,1286,1285,1,0,0,0,1287,187,
	1,0,0,0,1288,1290,7,3,0,0,1289,1291,3,28,14,0,1290,1289,1,0,0,0,1291,1292,
	1,0,0,0,1292,1290,1,0,0,0,1292,1293,1,0,0,0,1293,1296,1,0,0,0,1294,1296,
	5,215,0,0,1295,1288,1,0,0,0,1295,1294,1,0,0,0,1296,189,1,0,0,0,1297,1298,
	3,192,96,0,1298,1299,5,240,0,0,1299,1300,3,178,89,0,1300,191,1,0,0,0,1301,
	1302,3,36,18,0,1302,193,1,0,0,0,1303,1305,3,38,19,0,1304,1303,1,0,0,0,1304,
	1305,1,0,0,0,1305,1306,1,0,0,0,1306,1307,3,34,17,0,1307,195,1,0,0,0,1308,
	1310,3,38,19,0,1309,1308,1,0,0,0,1309,1310,1,0,0,0,1310,1312,1,0,0,0,1311,
	1313,7,18,0,0,1312,1311,1,0,0,0,1312,1313,1,0,0,0,1313,1315,1,0,0,0,1314,
	1316,3,28,14,0,1315,1314,1,0,0,0,1316,1317,1,0,0,0,1317,1315,1,0,0,0,1317,
	1318,1,0,0,0,1318,197,1,0,0,0,1319,1320,5,117,0,0,1320,1321,3,32,16,0,1321,
	199,1,0,0,0,1322,1325,3,202,101,0,1323,1325,3,218,109,0,1324,1322,1,0,0,
	0,1324,1323,1,0,0,0,1325,201,1,0,0,0,1326,1332,3,210,105,0,1327,1332,3,
	204,102,0,1328,1332,3,212,106,0,1329,1332,3,214,107,0,1330,1332,3,216,108,
	0,1331,1326,1,0,0,0,1331,1327,1,0,0,0,1331,1328,1,0,0,0,1331,1329,1,0,0,
	0,1331,1330,1,0,0,0,1332,203,1,0,0,0,1333,1334,3,206,103,0,1334,205,1,0,
	0,0,1335,1337,5,211,0,0,1336,1335,1,0,0,0,1336,1337,1,0,0,0,1337,1340,1,
	0,0,0,1338,1341,3,194,97,0,1339,1341,3,208,104,0,1340,1338,1,0,0,0,1340,
	1339,1,0,0,0,1341,1342,1,0,0,0,1342,1343,7,26,0,0,1343,207,1,0,0,0,1344,
	1345,3,32,16,0,1345,209,1,0,0,0,1346,1348,5,211,0,0,1347,1346,1,0,0,0,1347,
	1348,1,0,0,0,1348,1349,1,0,0,0,1349,1350,3,32,16,0,1350,1351,5,109,0,0,
	1351,1352,3,258,129,0,1352,1353,3,246,123,0,1353,211,1,0,0,0,1354,1355,
	3,228,114,0,1355,1356,3,234,117,0,1356,213,1,0,0,0,1357,1358,3,230,115,
	0,1358,1359,3,236,118,0,1359,215,1,0,0,0,1360,1361,3,232,116,0,1361,1362,
	3,238,119,0,1362,217,1,0,0,0,1363,1364,5,118,0,0,1364,1365,3,168,84,0,1365,
	1366,5,243,0,0,1366,1367,7,27,0,0,1367,1368,7,28,0,0,1368,1370,5,276,0,
	0,1369,1371,3,220,110,0,1370,1369,1,0,0,0,1371,1372,1,0,0,0,1372,1370,1,
	0,0,0,1372,1373,1,0,0,0,1373,219,1,0,0,0,1374,1375,3,172,86,0,1375,1376,
	3,222,111,0,1376,1381,1,0,0,0,1377,1378,3,172,86,0,1378,1379,3,226,113,
	0,1379,1381,1,0,0,0,1380,1374,1,0,0,0,1380,1377,1,0,0,0,1381,221,1,0,0,
	0,1382,1383,3,224,112,0,1383,223,1,0,0,0,1384,1385,3,190,95,0,1385,1386,
	3,258,129,0,1386,1387,3,246,123,0,1387,1396,1,0,0,0,1388,1389,3,178,89,
	0,1389,1390,3,206,103,0,1390,1396,1,0,0,0,1391,1392,3,190,95,0,1392,1393,
	7,29,0,0,1393,1394,3,194,97,0,1394,1396,1,0,0,0,1395,1384,1,0,0,0,1395,
	1388,1,0,0,0,1395,1391,1,0,0,0,1396,225,1,0,0,0,1397,1402,5,150,0,0,1398,
	1402,5,149,0,0,1399,1400,5,291,0,0,1400,1402,5,292,0,0,1401,1397,1,0,0,
	0,1401,1398,1,0,0,0,1401,1399,1,0,0,0,1402,1403,1,0,0,0,1403,1404,5,118,
	0,0,1404,1405,3,168,84,0,1405,1406,5,243,0,0,1406,1407,7,27,0,0,1407,1409,
	5,276,0,0,1408,1410,3,220,110,0,1409,1408,1,0,0,0,1410,1411,1,0,0,0,1411,
	1409,1,0,0,0,1411,1412,1,0,0,0,1412,227,1,0,0,0,1413,1414,7,30,0,0,1414,
	229,1,0,0,0,1415,1416,7,31,0,0,1416,231,1,0,0,0,1417,1418,7,32,0,0,1418,
	233,1,0,0,0,1419,1420,3,246,123,0,1420,235,1,0,0,0,1421,1422,3,246,123,
	0,1422,237,1,0,0,0,1423,1424,3,246,123,0,1424,239,1,0,0,0,1425,1429,5,107,
	0,0,1426,1428,3,242,121,0,1427,1426,1,0,0,0,1428,1431,1,0,0,0,1429,1427,
	1,0,0,0,1429,1430,1,0,0,0,1430,1432,1,0,0,0,1431,1429,1,0,0,0,1432,1433,
	5,275,0,0,1433,241,1,0,0,0,1434,1436,7,9,0,0,1435,1434,1,0,0,0,1435,1436,
	1,0,0,0,1436,1437,1,0,0,0,1437,1438,5,263,0,0,1438,1439,5,113,0,0,1439,
	1440,3,244,122,0,1440,243,1,0,0,0,1441,1450,3,272,136,0,1442,1445,3,262,
	131,0,1443,1445,3,266,133,0,1444,1442,1,0,0,0,1444,1443,1,0,0,0,1445,1446,
	1,0,0,0,1446,1447,3,272,136,0,1447,1449,1,0,0,0,1448,1444,1,0,0,0,1449,
	1452,1,0,0,0,1450,1448,1,0,0,0,1450,1451,1,0,0,0,1451,245,1,0,0,0,1452,
	1450,1,0,0,0,1453,1454,3,250,125,0,1454,1455,5,274,0,0,1455,1456,3,276,
	138,0,1456,1457,3,274,137,0,1457,1467,1,0,0,0,1458,1459,3,250,125,0,1459,
	1460,5,274,0,0,1460,1461,3,276,138,0,1461,1467,1,0,0,0,1462,1463,3,250,
	125,0,1463,1464,3,274,137,0,1464,1467,1,0,0,0,1465,1467,3,250,125,0,1466,
	1453,1,0,0,0,1466,1458,1,0,0,0,1466,1462,1,0,0,0,1466,1465,1,0,0,0,1467,
	247,1,0,0,0,1468,1469,3,252,126,0,1469,1470,5,274,0,0,1470,1471,3,276,138,
	0,1471,1472,3,274,137,0,1472,1482,1,0,0,0,1473,1474,3,252,126,0,1474,1475,
	5,274,0,0,1475,1476,3,276,138,0,1476,1482,1,0,0,0,1477,1478,3,252,126,0,
	1478,1479,3,274,137,0,1479,1482,1,0,0,0,1480,1482,3,252,126,0,1481,1468,
	1,0,0,0,1481,1473,1,0,0,0,1481,1477,1,0,0,0,1481,1480,1,0,0,0,1482,249,
	1,0,0,0,1483,1486,3,252,126,0,1484,1485,7,33,0,0,1485,1487,3,250,125,0,
	1486,1484,1,0,0,0,1486,1487,1,0,0,0,1487,251,1,0,0,0,1488,1520,3,308,154,
	0,1489,1520,3,284,142,0,1490,1491,3,260,130,0,1491,1492,5,113,0,0,1492,
	1493,3,34,17,0,1493,1520,1,0,0,0,1494,1495,3,260,130,0,1495,1496,5,110,
	0,0,1496,1497,3,34,17,0,1497,1520,1,0,0,0,1498,1499,3,260,130,0,1499,1500,
	3,256,128,0,1500,1505,3,254,127,0,1501,1502,5,274,0,0,1502,1504,3,254,127,
	0,1503,1501,1,0,0,0,1504,1507,1,0,0,0,1505,1503,1,0,0,0,1505,1506,1,0,0,
	0,1506,1508,1,0,0,0,1507,1505,1,0,0,0,1508,1509,5,225,0,0,1509,1510,3,254,
	127,0,1510,1520,1,0,0,0,1511,1515,3,260,130,0,1512,1513,3,258,129,0,1513,
	1514,3,260,130,0,1514,1516,1,0,0,0,1515,1512,1,0,0,0,1515,1516,1,0,0,0,
	1516,1520,1,0,0,0,1517,1520,3,304,152,0,1518,1520,3,306,153,0,1519,1488,
	1,0,0,0,1519,1489,1,0,0,0,1519,1490,1,0,0,0,1519,1494,1,0,0,0,1519,1498,
	1,0,0,0,1519,1511,1,0,0,0,1519,1517,1,0,0,0,1519,1518,1,0,0,0,1520,253,
	1,0,0,0,1521,1531,5,269,0,0,1522,1531,5,268,0,0,1523,1525,5,264,0,0,1524,
	1526,3,84,42,0,1525,1524,1,0,0,0,1525,1526,1,0,0,0,1526,1531,1,0,0,0,1527,
	1531,5,267,0,0,1528,1531,3,40,20,0,1529,1531,3,18,9,0,1530,1521,1,0,0,0,
	1530,1522,1,0,0,0,1530,1523,1,0,0,0,1530,1527,1,0,0,0,1530,1528,1,0,0,0,
	1530,1529,1,0,0,0,1531,255,1,0,0,0,1532,1533,7,34,0,0,1533,257,1,0,0,0,
	1534,1535,7,35,0,0,1535,259,1,0,0,0,1536,1542,3,264,132,0,1537,1538,3,262,
	131,0,1538,1539,3,264,132,0,1539,1541,1,0,0,0,1540,1537,1,0,0,0,1541,1544,
	1,0,0,0,1542,1540,1,0,0,0,1542,1543,1,0,0,0,1543,261,1,0,0,0,1544,1542,
	1,0,0,0,1545,1546,7,36,0,0,1546,263,1,0,0,0,1547,1553,3,268,134,0,1548,
	1549,3,266,133,0,1549,1550,3,268,134,0,1550,1552,1,0,0,0,1551,1548,1,0,
	0,0,1552,1555,1,0,0,0,1553,1551,1,0,0,0,1553,1554,1,0,0,0,1554,265,1,0,
	0,0,1555,1553,1,0,0,0,1556,1557,7,37,0,0,1557,267,1,0,0,0,1558,1564,3,272,
	136,0,1559,1560,3,270,135,0,1560,1561,3,272,136,0,1561,1563,1,0,0,0,1562,
	1559,1,0,0,0,1563,1566,1,0,0,0,1564,1562,1,0,0,0,1564,1565,1,0,0,0,1565,
	269,1,0,0,0,1566,1564,1,0,0,0,1567,1568,7,38,0,0,1568,271,1,0,0,0,1569,
	1570,6,136,-1,0,1570,1571,5,133,0,0,1571,1834,3,272,136,58,1572,1573,5,
	288,0,0,1573,1834,3,272,136,57,1574,1575,5,136,0,0,1575,1834,3,272,136,
	56,1576,1577,5,11,0,0,1577,1578,3,272,136,0,1578,1579,5,142,0,0,1579,1582,
	3,272,136,0,1580,1581,5,188,0,0,1581,1583,3,84,42,0,1582,1580,1,0,0,0,1582,
	1583,1,0,0,0,1583,1834,1,0,0,0,1584,1585,5,192,0,0,1585,1586,3,272,136,
	0,1586,1587,5,142,0,0,1587,1590,3,272,136,0,1588,1589,5,188,0,0,1589,1591,
	3,84,42,0,1590,1588,1,0,0,0,1590,1591,1,0,0,0,1591,1834,1,0,0,0,1592,1593,
	5,191,0,0,1593,1598,3,272,136,0,1594,1595,5,274,0,0,1595,1597,3,272,136,
	0,1596,1594,1,0,0,0,1597,1600,1,0,0,0,1598,1596,1,0,0,0,1598,1599,1,0,0,
	0,1599,1601,1,0,0,0,1600,1598,1,0,0,0,1601,1602,5,212,0,0,1602,1603,3,272,
	136,53,1603,1834,1,0,0,0,1604,1605,5,191,0,0,1605,1606,5,120,0,0,1606,1834,
	3,32,16,0,1607,1608,5,191,0,0,1608,1609,5,120,0,0,1609,1834,3,190,95,0,
	1610,1611,5,213,0,0,1611,1612,5,186,0,0,1612,1613,5,120,0,0,1613,1834,3,
	32,16,0,1614,1615,5,213,0,0,1615,1616,5,186,0,0,1616,1834,3,178,89,0,1617,
	1618,5,186,0,0,1618,1619,5,120,0,0,1619,1834,3,32,16,0,1620,1621,5,186,
	0,0,1621,1834,3,178,89,0,1622,1623,5,213,0,0,1623,1624,5,186,0,0,1624,1834,
	3,190,95,0,1625,1626,5,186,0,0,1626,1834,3,190,95,0,1627,1630,5,264,0,0,
	1628,1631,5,279,0,0,1629,1631,5,263,0,0,1630,1628,1,0,0,0,1630,1629,1,0,
	0,0,1631,1634,1,0,0,0,1632,1634,5,267,0,0,1633,1627,1,0,0,0,1633,1632,1,
	0,0,0,1634,1635,1,0,0,0,1635,1636,5,240,0,0,1636,1834,3,272,136,44,1637,
	1638,5,267,0,0,1638,1639,5,240,0,0,1639,1834,3,272,136,43,1640,1641,5,30,
	0,0,1641,1646,3,272,136,0,1642,1643,5,274,0,0,1643,1645,3,272,136,0,1644,
	1642,1,0,0,0,1645,1648,1,0,0,0,1646,1644,1,0,0,0,1646,1647,1,0,0,0,1647,
	1649,1,0,0,0,1648,1646,1,0,0,0,1649,1650,7,33,0,0,1650,1651,3,272,136,39,
	1651,1834,1,0,0,0,1652,1653,5,152,0,0,1653,1834,3,272,136,37,1654,1655,
	5,12,0,0,1655,1656,5,270,0,0,1656,1657,3,246,123,0,1657,1658,5,271,0,0,
	1658,1834,1,0,0,0,1659,1660,5,14,0,0,1660,1665,3,272,136,0,1661,1662,5,
	274,0,0,1662,1664,3,272,136,0,1663,1661,1,0,0,0,1664,1667,1,0,0,0,1665,
	1663,1,0,0,0,1665,1666,1,0,0,0,1666,1668,1,0,0,0,1667,1665,1,0,0,0,1668,
	1669,5,212,0,0,1669,1670,3,272,136,35,1670,1834,1,0,0,0,1671,1672,5,14,
	0,0,1672,1673,5,120,0,0,1673,1834,3,190,95,0,1674,1675,5,13,0,0,1675,1680,
	3,272,136,0,1676,1677,5,274,0,0,1677,1679,3,272,136,0,1678,1676,1,0,0,0,
	1679,1682,1,0,0,0,1680,1678,1,0,0,0,1680,1681,1,0,0,0,1681,1683,1,0,0,0,
	1682,1680,1,0,0,0,1683,1684,5,212,0,0,1684,1685,3,272,136,33,1685,1834,
	1,0,0,0,1686,1687,5,13,0,0,1687,1688,5,120,0,0,1688,1834,3,190,95,0,1689,
	1690,5,213,0,0,1690,1691,5,217,0,0,1691,1692,5,237,0,0,1692,1834,3,272,
	136,31,1693,1694,5,208,0,0,1694,1695,5,220,0,0,1695,1696,5,237,0,0,1696,
	1834,3,272,136,30,1697,1698,5,208,0,0,1698,1699,5,205,0,0,1699,1700,5,237,
	0,0,1700,1834,3,272,136,29,1701,1702,5,17,0,0,1702,1703,5,270,0,0,1703,
	1704,3,272,136,0,1704,1705,5,274,0,0,1705,1706,3,272,136,0,1706,1707,5,
	274,0,0,1707,1708,3,272,136,0,1708,1709,5,271,0,0,1709,1834,1,0,0,0,1710,
	1711,5,18,0,0,1711,1712,5,270,0,0,1712,1713,3,272,136,0,1713,1714,5,271,
	0,0,1714,1834,1,0,0,0,1715,1716,5,187,0,0,1716,1721,3,272,136,0,1717,1718,
	5,274,0,0,1718,1720,3,272,136,0,1719,1717,1,0,0,0,1720,1723,1,0,0,0,1721,
	1719,1,0,0,0,1721,1722,1,0,0,0,1722,1724,1,0,0,0,1723,1721,1,0,0,0,1724,
	1725,5,212,0,0,1725,1726,3,272,136,25,1726,1834,1,0,0,0,1727,1728,5,189,
	0,0,1728,1733,3,272,136,0,1729,1730,5,274,0,0,1730,1732,3,272,136,0,1731,
	1729,1,0,0,0,1732,1735,1,0,0,0,1733,1731,1,0,0,0,1733,1734,1,0,0,0,1734,
	1736,1,0,0,0,1735,1733,1,0,0,0,1736,1737,5,212,0,0,1737,1738,3,272,136,
	24,1738,1834,1,0,0,0,1739,1740,5,15,0,0,1740,1742,3,246,123,0,1741,1743,
	3,282,141,0,1742,1741,1,0,0,0,1742,1743,1,0,0,0,1743,1834,1,0,0,0,1744,
	1745,5,213,0,0,1745,1746,5,186,0,0,1746,1747,5,206,0,0,1747,1756,5,216,
	0,0,1748,1750,5,208,0,0,1749,1748,1,0,0,0,1749,1750,1,0,0,0,1750,1751,1,
	0,0,0,1751,1757,5,220,0,0,1752,1754,5,213,0,0,1753,1752,1,0,0,0,1753,1754,
	1,0,0,0,1754,1755,1,0,0,0,1755,1757,5,217,0,0,1756,1749,1,0,0,0,1756,1753,
	1,0,0,0,1757,1758,1,0,0,0,1758,1759,5,207,0,0,1759,1834,3,246,123,0,1760,
	1762,3,18,9,0,1761,1760,1,0,0,0,1762,1763,1,0,0,0,1763,1761,1,0,0,0,1763,
	1764,1,0,0,0,1764,1765,1,0,0,0,1765,1766,5,15,0,0,1766,1768,3,246,123,0,
	1767,1769,3,282,141,0,1768,1767,1,0,0,0,1768,1769,1,0,0,0,1769,1834,1,0,
	0,0,1770,1771,5,16,0,0,1771,1772,7,39,0,0,1772,1773,5,240,0,0,1773,1775,
	3,246,123,0,1774,1776,3,282,141,0,1775,1774,1,0,0,0,1775,1776,1,0,0,0,1776,
	1834,1,0,0,0,1777,1779,3,18,9,0,1778,1777,1,0,0,0,1779,1780,1,0,0,0,1780,
	1778,1,0,0,0,1780,1781,1,0,0,0,1781,1782,1,0,0,0,1782,1783,5,16,0,0,1783,
	1784,7,39,0,0,1784,1785,5,240,0,0,1785,1787,3,246,123,0,1786,1788,3,282,
	141,0,1787,1786,1,0,0,0,1787,1788,1,0,0,0,1788,1834,1,0,0,0,1789,1792,3,
	292,146,0,1790,1792,3,294,147,0,1791,1789,1,0,0,0,1791,1790,1,0,0,0,1792,
	1793,1,0,0,0,1793,1794,3,192,96,0,1794,1795,3,296,148,0,1795,1834,1,0,0,
	0,1796,1799,3,292,146,0,1797,1799,3,294,147,0,1798,1796,1,0,0,0,1798,1797,
	1,0,0,0,1799,1802,1,0,0,0,1800,1803,3,198,99,0,1801,1803,3,190,95,0,1802,
	1800,1,0,0,0,1802,1801,1,0,0,0,1803,1804,1,0,0,0,1804,1805,5,146,0,0,1805,
	1806,3,32,16,0,1806,1807,5,236,0,0,1807,1809,3,32,16,0,1808,1810,5,275,
	0,0,1809,1808,1,0,0,0,1809,1810,1,0,0,0,1810,1834,1,0,0,0,1811,1813,5,264,
	0,0,1812,1814,3,84,42,0,1813,1812,1,0,0,0,1813,1814,1,0,0,0,1814,1834,1,
	0,0,0,1815,1834,5,231,0,0,1816,1834,3,18,9,0,1817,1834,3,198,99,0,1818,
	1834,3,190,95,0,1819,1834,3,178,89,0,1820,1834,3,32,16,0,1821,1834,3,106,
	53,0,1822,1834,5,267,0,0,1823,1834,5,268,0,0,1824,1834,5,269,0,0,1825,1834,
	3,40,20,0,1826,1834,5,245,0,0,1827,1834,5,226,0,0,1828,1834,5,215,0,0,1829,
	1830,5,270,0,0,1830,1831,3,246,123,0,1831,1832,5,271,0,0,1832,1834,1,0,
	0,0,1833,1569,1,0,0,0,1833,1572,1,0,0,0,1833,1574,1,0,0,0,1833,1576,1,0,
	0,0,1833,1584,1,0,0,0,1833,1592,1,0,0,0,1833,1604,1,0,0,0,1833,1607,1,0,
	0,0,1833,1610,1,0,0,0,1833,1614,1,0,0,0,1833,1617,1,0,0,0,1833,1620,1,0,
	0,0,1833,1622,1,0,0,0,1833,1625,1,0,0,0,1833,1633,1,0,0,0,1833,1637,1,0,
	0,0,1833,1640,1,0,0,0,1833,1652,1,0,0,0,1833,1654,1,0,0,0,1833,1659,1,0,
	0,0,1833,1671,1,0,0,0,1833,1674,1,0,0,0,1833,1686,1,0,0,0,1833,1689,1,0,
	0,0,1833,1693,1,0,0,0,1833,1697,1,0,0,0,1833,1701,1,0,0,0,1833,1710,1,0,
	0,0,1833,1715,1,0,0,0,1833,1727,1,0,0,0,1833,1739,1,0,0,0,1833,1744,1,0,
	0,0,1833,1761,1,0,0,0,1833,1770,1,0,0,0,1833,1778,1,0,0,0,1833,1791,1,0,
	0,0,1833,1798,1,0,0,0,1833,1811,1,0,0,0,1833,1815,1,0,0,0,1833,1816,1,0,
	0,0,1833,1817,1,0,0,0,1833,1818,1,0,0,0,1833,1819,1,0,0,0,1833,1820,1,0,
	0,0,1833,1821,1,0,0,0,1833,1822,1,0,0,0,1833,1823,1,0,0,0,1833,1824,1,0,
	0,0,1833,1825,1,0,0,0,1833,1826,1,0,0,0,1833,1827,1,0,0,0,1833,1828,1,0,
	0,0,1833,1829,1,0,0,0,1834,1862,1,0,0,0,1835,1838,10,38,0,0,1836,1837,5,
	274,0,0,1837,1839,3,272,136,0,1838,1836,1,0,0,0,1839,1840,1,0,0,0,1840,
	1838,1,0,0,0,1840,1841,1,0,0,0,1841,1842,1,0,0,0,1842,1843,7,33,0,0,1843,
	1844,3,272,136,39,1844,1861,1,0,0,0,1845,1846,10,42,0,0,1846,1861,3,274,
	137,0,1847,1848,10,41,0,0,1848,1849,5,274,0,0,1849,1850,3,276,138,0,1850,
	1851,3,274,137,0,1851,1861,1,0,0,0,1852,1853,10,40,0,0,1853,1854,5,274,
	0,0,1854,1861,3,276,138,0,1855,1856,10,26,0,0,1856,1857,7,40,0,0,1857,1858,
	3,272,136,0,1858,1859,3,44,22,0,1859,1861,1,0,0,0,1860,1835,1,0,0,0,1860,
	1845,1,0,0,0,1860,1847,1,0,0,0,1860,1852,1,0,0,0,1860,1855,1,0,0,0,1861,
	1864,1,0,0,0,1862,1860,1,0,0,0,1862,1863,1,0,0,0,1863,273,1,0,0,0,1864,
	1862,1,0,0,0,1865,1866,7,41,0,0,1866,1867,5,119,0,0,1867,1868,5,264,0,0,
	1868,1869,5,165,0,0,1869,275,1,0,0,0,1870,1877,3,278,139,0,1871,1877,3,
	280,140,0,1872,1873,3,278,139,0,1873,1874,5,212,0,0,1874,1875,3,280,140,
	0,1875,1877,1,0,0,0,1876,1870,1,0,0,0,1876,1871,1,0,0,0,1876,1872,1,0,0,
	0,1877,277,1,0,0,0,1878,1879,5,20,0,0,1879,1880,3,246,123,0,1880,279,1,
	0,0,0,1881,1882,5,21,0,0,1882,1883,3,246,123,0,1883,281,1,0,0,0,1884,1885,
	5,4,0,0,1885,1888,3,246,123,0,1886,1888,3,286,143,0,1887,1884,1,0,0,0,1887,
	1886,1,0,0,0,1888,283,1,0,0,0,1889,1890,5,7,0,0,1890,1891,3,286,143,0,1891,
	285,1,0,0,0,1892,1893,5,146,0,0,1893,1909,3,238,119,0,1894,1895,5,240,0,
	0,1895,1896,3,238,119,0,1896,1897,5,142,0,0,1897,1898,3,238,119,0,1898,
	1909,1,0,0,0,1899,1900,5,240,0,0,1900,1901,3,238,119,0,1901,1902,5,144,
	0,0,1902,1903,3,238,119,0,1903,1909,1,0,0,0,1904,1905,5,142,0,0,1905,1909,
	3,238,119,0,1906,1907,5,144,0,0,1907,1909,3,238,119,0,1908,1892,1,0,0,0,
	1908,1894,1,0,0,0,1908,1899,1,0,0,0,1908,1904,1,0,0,0,1908,1906,1,0,0,0,
	1909,287,1,0,0,0,1910,1911,5,146,0,0,1911,1927,3,290,145,0,1912,1913,5,
	142,0,0,1913,1927,3,290,145,0,1914,1915,5,144,0,0,1915,1927,3,290,145,0,
	1916,1917,5,240,0,0,1917,1918,3,290,145,0,1918,1919,5,142,0,0,1919,1920,
	3,290,145,0,1920,1927,1,0,0,0,1921,1922,5,240,0,0,1922,1923,3,290,145,0,
	1923,1924,5,144,0,0,1924,1925,3,290,145,0,1925,1927,1,0,0,0,1926,1910,1,
	0,0,0,1926,1912,1,0,0,0,1926,1914,1,0,0,0,1926,1916,1,0,0,0,1926,1921,1,
	0,0,0,1927,289,1,0,0,0,1928,1933,3,40,20,0,1929,1933,5,231,0,0,1930,1933,
	5,232,0,0,1931,1933,3,190,95,0,1932,1928,1,0,0,0,1932,1929,1,0,0,0,1932,
	1930,1,0,0,0,1932,1931,1,0,0,0,1933,291,1,0,0,0,1934,1935,5,213,0,0,1935,
	1941,5,186,0,0,1936,1941,5,186,0,0,1937,1941,5,13,0,0,1938,1941,5,14,0,
	0,1939,1941,5,191,0,0,1940,1934,1,0,0,0,1940,1936,1,0,0,0,1940,1937,1,0,
	0,0,1940,1938,1,0,0,0,1940,1939,1,0,0,0,1941,293,1,0,0,0,1942,1943,7,42,
	0,0,1943,295,1,0,0,0,1944,1948,5,229,0,0,1945,1949,3,298,149,0,1946,1949,
	3,300,150,0,1947,1949,3,302,151,0,1948,1945,1,0,0,0,1948,1946,1,0,0,0,1948,
	1947,1,0,0,0,1949,1950,1,0,0,0,1950,1951,5,275,0,0,1951,1955,1,0,0,0,1952,
	1953,5,240,0,0,1953,1955,3,298,149,0,1954,1944,1,0,0,0,1954,1952,1,0,0,
	0,1955,297,1,0,0,0,1956,1957,5,120,0,0,1957,1960,3,32,16,0,1958,1959,7,
	25,0,0,1959,1961,3,200,100,0,1960,1958,1,0,0,0,1960,1961,1,0,0,0,1961,299,
	1,0,0,0,1962,1963,5,208,0,0,1963,1964,3,32,16,0,1964,1965,5,146,0,0,1965,
	1966,3,32,16,0,1966,1967,5,236,0,0,1967,1968,3,32,16,0,1968,301,1,0,0,0,
	1969,1970,5,208,0,0,1970,1971,3,32,16,0,1971,1972,5,216,0,0,1972,1973,5,
	272,0,0,1973,1978,3,32,16,0,1974,1975,5,274,0,0,1975,1977,3,32,16,0,1976,
	1974,1,0,0,0,1977,1980,1,0,0,0,1978,1976,1,0,0,0,1978,1979,1,0,0,0,1979,
	1981,1,0,0,0,1980,1978,1,0,0,0,1981,1982,5,212,0,0,1982,1983,3,32,16,0,
	1983,1984,5,273,0,0,1984,303,1,0,0,0,1985,1986,3,272,136,0,1986,1987,7,
	43,0,0,1987,2012,1,0,0,0,1988,1989,3,272,136,0,1989,1990,7,44,0,0,1990,
	1991,5,264,0,0,1991,1992,5,163,0,0,1992,2012,1,0,0,0,1993,1994,3,272,136,
	0,1994,1995,7,45,0,0,1995,1996,3,18,9,0,1996,2012,1,0,0,0,1997,1998,3,272,
	136,0,1998,1999,7,46,0,0,1999,2000,3,18,9,0,2000,2012,1,0,0,0,2001,2002,
	3,272,136,0,2002,2003,7,47,0,0,2003,2004,3,18,9,0,2004,2012,1,0,0,0,2005,
	2006,3,178,89,0,2006,2007,5,92,0,0,2007,2012,1,0,0,0,2008,2009,3,272,136,
	0,2009,2010,5,94,0,0,2010,2012,1,0,0,0,2011,1985,1,0,0,0,2011,1988,1,0,
	0,0,2011,1993,1,0,0,0,2011,1997,1,0,0,0,2011,2001,1,0,0,0,2011,2005,1,0,
	0,0,2011,2008,1,0,0,0,2012,305,1,0,0,0,2013,2014,5,233,0,0,2014,2015,3,
	32,16,0,2015,2016,5,93,0,0,2016,2022,1,0,0,0,2017,2018,5,233,0,0,2018,2019,
	3,32,16,0,2019,2020,5,94,0,0,2020,2022,1,0,0,0,2021,2013,1,0,0,0,2021,2017,
	1,0,0,0,2022,307,1,0,0,0,2023,2024,3,178,89,0,2024,2025,3,34,17,0,2025,
	2026,5,110,0,0,2026,2036,1,0,0,0,2027,2028,3,178,89,0,2028,2029,3,34,17,
	0,2029,2030,5,113,0,0,2030,2036,1,0,0,0,2031,2032,3,178,89,0,2032,2033,
	5,113,0,0,2033,2034,3,34,17,0,2034,2036,1,0,0,0,2035,2023,1,0,0,0,2035,
	2027,1,0,0,0,2035,2031,1,0,0,0,2036,309,1,0,0,0,2037,2038,5,106,0,0,2038,
	2046,3,32,16,0,2039,2041,5,174,0,0,2040,2042,5,263,0,0,2041,2040,1,0,0,
	0,2042,2043,1,0,0,0,2043,2041,1,0,0,0,2043,2044,1,0,0,0,2044,2045,1,0,0,
	0,2045,2047,5,271,0,0,2046,2039,1,0,0,0,2046,2047,1,0,0,0,2047,2049,1,0,
	0,0,2048,2050,5,277,0,0,2049,2048,1,0,0,0,2049,2050,1,0,0,0,2050,311,1,
	0,0,0,2051,2052,5,268,0,0,2052,313,1,0,0,0,2053,2054,3,246,123,0,2054,2055,
	5,116,0,0,2055,2056,3,246,123,0,2056,2057,5,274,0,0,2057,2060,5,26,0,0,
	2058,2061,3,316,158,0,2059,2061,3,318,159,0,2060,2058,1,0,0,0,2060,2059,
	1,0,0,0,2061,2063,1,0,0,0,2062,2064,3,326,163,0,2063,2062,1,0,0,0,2063,
	2064,1,0,0,0,2064,315,1,0,0,0,2065,2066,3,324,162,0,2066,317,1,0,0,0,2067,
	2068,5,276,0,0,2068,2070,3,320,160,0,2069,2071,5,275,0,0,2070,2069,1,0,
	0,0,2070,2071,1,0,0,0,2071,319,1,0,0,0,2072,2076,3,322,161,0,2073,2075,
	3,322,161,0,2074,2073,1,0,0,0,2075,2078,1,0,0,0,2076,2074,1,0,0,0,2076,
	2077,1,0,0,0,2077,321,1,0,0,0,2078,2076,1,0,0,0,2079,2080,5,288,0,0,2080,
	2082,3,324,162,0,2081,2083,7,48,0,0,2082,2081,1,0,0,0,2082,2083,1,0,0,0,
	2083,323,1,0,0,0,2084,2099,5,194,0,0,2085,2086,5,35,0,0,2086,2099,3,246,
	123,0,2087,2088,5,34,0,0,2088,2089,7,49,0,0,2089,2099,3,246,123,0,2090,
	2091,5,33,0,0,2091,2099,3,324,162,0,2092,2093,5,21,0,0,2093,2099,3,246,
	123,0,2094,2095,5,119,0,0,2095,2096,5,264,0,0,2096,2097,5,165,0,0,2097,
	2099,7,50,0,0,2098,2084,1,0,0,0,2098,2085,1,0,0,0,2098,2087,1,0,0,0,2098,
	2090,1,0,0,0,2098,2092,1,0,0,0,2098,2094,1,0,0,0,2099,325,1,0,0,0,2100,
	2101,5,19,0,0,2101,2103,3,246,123,0,2102,2104,5,195,0,0,2103,2102,1,0,0,
	0,2103,2104,1,0,0,0,2104,327,1,0,0,0,237,334,336,347,352,361,365,374,378,
	381,386,389,393,398,411,415,419,424,433,438,443,449,455,461,466,472,478,
	487,489,492,497,502,508,514,520,525,531,537,546,548,552,555,560,565,571,
	577,583,588,594,600,602,610,619,628,645,648,651,656,661,666,670,674,677,
	683,687,695,698,701,709,716,723,732,739,747,755,758,765,771,782,791,795,
	799,803,810,816,821,826,834,840,843,858,862,866,869,872,880,886,889,897,
	901,909,918,926,929,934,938,940,945,952,958,961,964,969,973,975,981,998,
	1008,1010,1024,1027,1039,1052,1071,1076,1083,1087,1095,1098,1105,1108,1110,
	1119,1135,1138,1140,1145,1154,1162,1172,1178,1188,1194,1204,1206,1222,1227,
	1232,1239,1249,1254,1259,1267,1276,1283,1286,1292,1295,1304,1309,1312,1317,
	1324,1331,1336,1340,1347,1372,1380,1395,1401,1411,1429,1435,1444,1450,1466,
	1481,1486,1505,1515,1519,1525,1530,1542,1553,1564,1582,1590,1598,1630,1633,
	1646,1665,1680,1721,1733,1742,1749,1753,1756,1763,1768,1775,1780,1787,1791,
	1798,1802,1809,1813,1833,1840,1860,1862,1876,1887,1908,1926,1932,1940,1948,
	1954,1960,1978,2011,2021,2035,2043,2046,2049,2060,2063,2070,2076,2082,2098,
	2103];

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
	public domeinRef(): DomeinRefContext {
		return this.getTypedRuleContext(DomeinRefContext, 0) as DomeinRefContext;
	}
	public objectTypeRef(): ObjectTypeRefContext {
		return this.getTypedRuleContext(ObjectTypeRefContext, 0) as ObjectTypeRefContext;
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
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
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
	public MILLISECONDE(): TerminalNode {
		return this.getToken(RegelSpraakParser.MILLISECONDE, 0);
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
	public KWARTAAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.KWARTAAL, 0);
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
	public _waarde!: SimpleExpressieContext;
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
	public simpleExpressie(): SimpleExpressieContext {
		return this.getTypedRuleContext(SimpleExpressieContext, 0) as SimpleExpressieContext;
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
	public _waarde!: SimpleExpressieContext;
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
	public simpleExpressie(): SimpleExpressieContext {
		return this.getTypedRuleContext(SimpleExpressieContext, 0) as SimpleExpressieContext;
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
	public _article!: Token;
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
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
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


export class SimpleExpressieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_simpleExpressie;
	}
	public copyFrom(ctx: SimpleExpressieContext): void {
		super.copyFrom(ctx);
	}
}
export class SimpleExprBegrenzingContext extends SimpleExpressieContext {
	constructor(parser: RegelSpraakParser, ctx: SimpleExpressieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public comparisonExpression(): ComparisonExpressionContext {
		return this.getTypedRuleContext(ComparisonExpressionContext, 0) as ComparisonExpressionContext;
	}
	public COMMA(): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, 0);
	}
	public begrenzing(): BegrenzingContext {
		return this.getTypedRuleContext(BegrenzingContext, 0) as BegrenzingContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSimpleExprBegrenzing) {
	 		listener.enterSimpleExprBegrenzing(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSimpleExprBegrenzing) {
	 		listener.exitSimpleExprBegrenzing(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSimpleExprBegrenzing) {
			return visitor.visitSimpleExprBegrenzing(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SimpleExprAfrondingContext extends SimpleExpressieContext {
	constructor(parser: RegelSpraakParser, ctx: SimpleExpressieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public comparisonExpression(): ComparisonExpressionContext {
		return this.getTypedRuleContext(ComparisonExpressionContext, 0) as ComparisonExpressionContext;
	}
	public afronding(): AfrondingContext {
		return this.getTypedRuleContext(AfrondingContext, 0) as AfrondingContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSimpleExprAfronding) {
	 		listener.enterSimpleExprAfronding(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSimpleExprAfronding) {
	 		listener.exitSimpleExprAfronding(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSimpleExprAfronding) {
			return visitor.visitSimpleExprAfronding(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SimpleExprBegrenzingAfrondingContext extends SimpleExpressieContext {
	constructor(parser: RegelSpraakParser, ctx: SimpleExpressieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public comparisonExpression(): ComparisonExpressionContext {
		return this.getTypedRuleContext(ComparisonExpressionContext, 0) as ComparisonExpressionContext;
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
	    if(listener.enterSimpleExprBegrenzingAfronding) {
	 		listener.enterSimpleExprBegrenzingAfronding(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSimpleExprBegrenzingAfronding) {
	 		listener.exitSimpleExprBegrenzingAfronding(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSimpleExprBegrenzingAfronding) {
			return visitor.visitSimpleExprBegrenzingAfronding(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}
export class SimpleExprBaseContext extends SimpleExpressieContext {
	constructor(parser: RegelSpraakParser, ctx: SimpleExpressieContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public comparisonExpression(): ComparisonExpressionContext {
		return this.getTypedRuleContext(ComparisonExpressionContext, 0) as ComparisonExpressionContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterSimpleExprBase) {
	 		listener.enterSimpleExprBase(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitSimpleExprBase) {
	 		listener.exitSimpleExprBase(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitSimpleExprBase) {
			return visitor.visitSimpleExprBase(this);
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
export class GelijkIsAanOfExprContext extends ComparisonExpressionContext {
	public _left!: AdditiveExpressionContext;
	public _op!: GelijkIsAanOperatorContext;
	public _firstValue!: LiteralValueContext;
	public _literalValue!: LiteralValueContext;
	public _middleValues: LiteralValueContext[] = [];
	public _lastValue!: LiteralValueContext;
	constructor(parser: RegelSpraakParser, ctx: ComparisonExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public OF(): TerminalNode {
		return this.getToken(RegelSpraakParser.OF, 0);
	}
	public additiveExpression(): AdditiveExpressionContext {
		return this.getTypedRuleContext(AdditiveExpressionContext, 0) as AdditiveExpressionContext;
	}
	public gelijkIsAanOperator(): GelijkIsAanOperatorContext {
		return this.getTypedRuleContext(GelijkIsAanOperatorContext, 0) as GelijkIsAanOperatorContext;
	}
	public literalValue_list(): LiteralValueContext[] {
		return this.getTypedRuleContexts(LiteralValueContext) as LiteralValueContext[];
	}
	public literalValue(i: number): LiteralValueContext {
		return this.getTypedRuleContext(LiteralValueContext, i) as LiteralValueContext;
	}
	public COMMA_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.COMMA);
	}
	public COMMA(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.COMMA, i);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterGelijkIsAanOfExpr) {
	 		listener.enterGelijkIsAanOfExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitGelijkIsAanOfExpr) {
	 		listener.exitGelijkIsAanOfExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitGelijkIsAanOfExpr) {
			return visitor.visitGelijkIsAanOfExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
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
export class PeriodeCheckExprContext extends ComparisonExpressionContext {
	constructor(parser: RegelSpraakParser, ctx: ComparisonExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public periodevergelijkingElementair(): PeriodevergelijkingElementairContext {
		return this.getTypedRuleContext(PeriodevergelijkingElementairContext, 0) as PeriodevergelijkingElementairContext;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPeriodeCheckExpr) {
	 		listener.enterPeriodeCheckExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPeriodeCheckExpr) {
	 		listener.exitPeriodeCheckExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPeriodeCheckExpr) {
			return visitor.visitPeriodeCheckExpr(this);
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


export class LiteralValueContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ENUM_LITERAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.ENUM_LITERAL, 0);
	}
	public STRING_LITERAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.STRING_LITERAL, 0);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public unitIdentifier(): UnitIdentifierContext {
		return this.getTypedRuleContext(UnitIdentifierContext, 0) as UnitIdentifierContext;
	}
	public PERCENTAGE_LITERAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.PERCENTAGE_LITERAL, 0);
	}
	public datumLiteral(): DatumLiteralContext {
		return this.getTypedRuleContext(DatumLiteralContext, 0) as DatumLiteralContext;
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_literalValue;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterLiteralValue) {
	 		listener.enterLiteralValue(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitLiteralValue) {
	 		listener.exitLiteralValue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitLiteralValue) {
			return visitor.visitLiteralValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GelijkIsAanOperatorContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public GELIJK_IS_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GELIJK_IS_AAN, 0);
	}
	public IS_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GELIJK_AAN, 0);
	}
	public GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.GELIJK_AAN, 0);
	}
	public ZIJN_GELIJK_AAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN_GELIJK_AAN, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_gelijkIsAanOperator;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterGelijkIsAanOperator) {
	 		listener.enterGelijkIsAanOperator(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitGelijkIsAanOperator) {
	 		listener.exitGelijkIsAanOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitGelijkIsAanOperator) {
			return visitor.visitGelijkIsAanOperator(this);
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
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
	}
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
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
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
	}
	public attribuutReferentie(): AttribuutReferentieContext {
		return this.getTypedRuleContext(AttribuutReferentieContext, 0) as AttribuutReferentieContext;
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
	public PERCENTAGE_LITERAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.PERCENTAGE_LITERAL, 0);
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
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


export class PeriodevergelijkingElementairContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public HET_IS_DE_PERIODE(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET_IS_DE_PERIODE, 0);
	}
	public periodevergelijkingEnkelvoudig(): PeriodevergelijkingEnkelvoudigContext {
		return this.getTypedRuleContext(PeriodevergelijkingEnkelvoudigContext, 0) as PeriodevergelijkingEnkelvoudigContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_periodevergelijkingElementair;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterPeriodevergelijkingElementair) {
	 		listener.enterPeriodevergelijkingElementair(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitPeriodevergelijkingElementair) {
	 		listener.exitPeriodevergelijkingElementair(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitPeriodevergelijkingElementair) {
			return visitor.visitPeriodevergelijkingElementair(this);
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
	public datumExpressie_list(): DatumExpressieContext[] {
		return this.getTypedRuleContexts(DatumExpressieContext) as DatumExpressieContext[];
	}
	public datumExpressie(i: number): DatumExpressieContext {
		return this.getTypedRuleContext(DatumExpressieContext, i) as DatumExpressieContext;
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
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
	}
	public AANTAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.AANTAL, 0);
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


export class TekstreeksExprContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public STRING_LITERAL(): TerminalNode {
		return this.getToken(RegelSpraakParser.STRING_LITERAL, 0);
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_tekstreeksExpr;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterTekstreeksExpr) {
	 		listener.enterTekstreeksExpr(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitTekstreeksExpr) {
	 		listener.exitTekstreeksExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitTekstreeksExpr) {
			return visitor.visitTekstreeksExpr(this);
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
