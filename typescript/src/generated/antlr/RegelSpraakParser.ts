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
	public static readonly ONGELIJK_AAN = 136;
	public static readonly PLUS = 137;
	public static readonly REKENKUNDIG = 138;
	public static readonly RICHTING_NUL = 139;
	public static readonly TOT = 140;
	public static readonly TOT_DE_MACHT = 141;
	public static readonly TOT_EN_MET = 142;
	public static readonly UNIEK = 143;
	public static readonly VANAF = 144;
	public static readonly VERENIGD_MET = 145;
	public static readonly VERMINDERD_MET = 146;
	public static readonly VOLDOEN = 147;
	public static readonly VOLDOET = 148;
	public static readonly WEG_VAN_NUL = 149;
	public static readonly DE_WORTEL_VAN = 150;
	public static readonly TENMINSTE = 151;
	public static readonly TEN_MINSTE = 152;
	public static readonly TEN_HOOGSTE = 153;
	public static readonly PRECIES = 154;
	public static readonly VOORWAARDE = 155;
	public static readonly VOORWAARDEN = 156;
	public static readonly BEZITTELIJK = 157;
	public static readonly BIJVOEGLIJK = 158;
	public static readonly BEZIELD = 159;
	public static readonly BOOLEAN = 160;
	public static readonly CIJFERS = 161;
	public static readonly DATUM_IN_DAGEN = 162;
	public static readonly DECIMALEN = 163;
	public static readonly ENUMERATIE = 164;
	public static readonly GEDIMENSIONEERD_MET = 165;
	public static readonly GEHEEL_GETAL = 166;
	public static readonly GETAL = 167;
	public static readonly KENMERK = 168;
	public static readonly KENMERKEN = 169;
	public static readonly MET = 170;
	public static readonly MET_EENHEID = 171;
	public static readonly MV_START = 172;
	public static readonly NEGATIEF = 173;
	public static readonly NIET_NEGATIEF = 174;
	public static readonly NUMERIEK = 175;
	public static readonly PERCENTAGE = 176;
	public static readonly POSITIEF = 177;
	public static readonly ROL = 178;
	public static readonly ROLLEN = 179;
	public static readonly TEKST = 180;
	public static readonly VOOR_ELK_JAAR = 181;
	public static readonly VOOR_ELKE_DAG = 182;
	public static readonly VOOR_ELKE_MAAND = 183;
	public static readonly AANTAL = 184;
	public static readonly EERSTE_VAN = 185;
	public static readonly IN_HELE = 186;
	public static readonly LAATSTE_VAN = 187;
	public static readonly REEKS_VAN_TEKSTEN_EN_WAARDEN = 188;
	public static readonly SOM_VAN = 189;
	public static readonly TIJDSDUUR_VAN = 190;
	public static readonly AFNEMENDE = 191;
	public static readonly IN_GELIJKE_DELEN = 192;
	public static readonly OVER_VERDELING = 193;
	public static readonly TOENEMENDE = 194;
	public static readonly DRIE_TELWOORD = 195;
	public static readonly EEN_TELWOORD = 196;
	public static readonly GEEN_VAN_DE = 197;
	public static readonly GEEN = 198;
	public static readonly TWEE_TELWOORD = 199;
	public static readonly VIER_TELWOORD = 200;
	public static readonly ALTIJD = 201;
	public static readonly BIJ = 202;
	public static readonly DAG = 203;
	public static readonly DAGEN = 204;
	public static readonly DAT = 205;
	public static readonly DE = 206;
	public static readonly DD_PUNT = 207;
	public static readonly DIE = 208;
	public static readonly EEN = 209;
	public static readonly EN = 210;
	public static readonly HET = 211;
	public static readonly MEERDERE = 212;
	public static readonly HIJ = 213;
	public static readonly IN = 214;
	public static readonly JAAR = 215;
	public static readonly KWARTAAL = 216;
	public static readonly MAAND = 217;
	public static readonly MILLISECONDE = 218;
	public static readonly MINUUT = 219;
	public static readonly OF = 220;
	public static readonly ONWAAR = 221;
	public static readonly OP = 222;
	public static readonly OVER = 223;
	public static readonly PERIODE = 224;
	public static readonly REKENDATUM = 225;
	public static readonly REKENJAAR = 226;
	public static readonly REGELVERSIE = 227;
	public static readonly SECONDE = 228;
	public static readonly TM = 229;
	public static readonly UIT = 230;
	public static readonly UUR = 231;
	public static readonly VAN = 232;
	public static readonly VOLGENDE_VOORWAARDE = 233;
	public static readonly VOLGENDE_VOORWAARDEN = 234;
	public static readonly VOLGENDE = 235;
	public static readonly VOOR = 236;
	public static readonly WAAR = 237;
	public static readonly WEEK = 238;
	public static readonly ER = 239;
	public static readonly METER = 240;
	public static readonly KILOGRAM = 241;
	public static readonly VOET = 242;
	public static readonly POND = 243;
	public static readonly MIJL = 244;
	public static readonly M = 245;
	public static readonly KG = 246;
	public static readonly S = 247;
	public static readonly FT = 248;
	public static readonly LB = 249;
	public static readonly MI = 250;
	public static readonly EURO_SYMBOL = 251;
	public static readonly DOLLAR_SYMBOL = 252;
	public static readonly IDENTIFIER = 253;
	public static readonly NUMBER = 254;
	public static readonly EQUALS = 255;
	public static readonly DATE_TIME_LITERAL = 256;
	public static readonly PERCENTAGE_LITERAL = 257;
	public static readonly STRING_LITERAL = 258;
	public static readonly ENUM_LITERAL = 259;
	public static readonly LPAREN = 260;
	public static readonly RPAREN = 261;
	public static readonly LBRACE = 262;
	public static readonly RBRACE = 263;
	public static readonly COMMA = 264;
	public static readonly DOT = 265;
	public static readonly COLON = 266;
	public static readonly SEMICOLON = 267;
	public static readonly SLASH = 268;
	public static readonly PERCENT_SIGN = 269;
	public static readonly BULLET = 270;
	public static readonly ASTERISK = 271;
	public static readonly L_ANGLE_QUOTE = 272;
	public static readonly R_ANGLE_QUOTE = 273;
	public static readonly CARET = 274;
	public static readonly DOUBLE_DOT = 275;
	public static readonly WS = 276;
	public static readonly LINE_COMMENT = 277;
	public static readonly MINUS = 278;
	public static readonly PIPE = 279;
	public static readonly NVT = 280;
	public static readonly WORDT = 281;
	public static readonly VOLDAAN = 282;
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
	public static readonly RULE_naamPhraseNoIs = 13;
	public static readonly RULE_naamwoord = 14;
	public static readonly RULE_naamwoordNoIs = 15;
	public static readonly RULE_voorzetsel = 16;
	public static readonly RULE_datumLiteral = 17;
	public static readonly RULE_unit = 18;
	public static readonly RULE_objectTypeDefinition = 19;
	public static readonly RULE_objectTypeMember = 20;
	public static readonly RULE_kenmerkSpecificatie = 21;
	public static readonly RULE_attribuutSpecificatie = 22;
	public static readonly RULE_datatype = 23;
	public static readonly RULE_lijstDatatype = 24;
	public static readonly RULE_numeriekDatatype = 25;
	public static readonly RULE_tekstDatatype = 26;
	public static readonly RULE_booleanDatatype = 27;
	public static readonly RULE_datumTijdDatatype = 28;
	public static readonly RULE_getalSpecificatie = 29;
	public static readonly RULE_domeinDefinition = 30;
	public static readonly RULE_domeinType = 31;
	public static readonly RULE_enumeratieSpecificatie = 32;
	public static readonly RULE_domeinRef = 33;
	public static readonly RULE_eenheidsysteemDefinition = 34;
	public static readonly RULE_eenheidEntry = 35;
	public static readonly RULE_unitIdentifier = 36;
	public static readonly RULE_eenheidExpressie = 37;
	public static readonly RULE_eenheidMacht = 38;
	public static readonly RULE_dimensieDefinition = 39;
	public static readonly RULE_voorzetselSpecificatie = 40;
	public static readonly RULE_labelWaardeSpecificatie = 41;
	public static readonly RULE_tijdlijn = 42;
	public static readonly RULE_dimensieRef = 43;
	public static readonly RULE_parameterDefinition = 44;
	public static readonly RULE_parameterNamePhrase = 45;
	public static readonly RULE_parameterMetLidwoord = 46;
	public static readonly RULE_feitTypeDefinition = 47;
	public static readonly RULE_rolDefinition = 48;
	public static readonly RULE_rolObjectType = 49;
	public static readonly RULE_rolContentWords = 50;
	public static readonly RULE_cardinalityLine = 51;
	public static readonly RULE_cardinalityWord = 52;
	public static readonly RULE_regel = 53;
	public static readonly RULE_regelGroep = 54;
	public static readonly RULE_regelName = 55;
	public static readonly RULE_regelVersie = 56;
	public static readonly RULE_versieGeldigheid = 57;
	public static readonly RULE_resultaatDeel = 58;
	public static readonly RULE_feitCreatiePattern = 59;
	public static readonly RULE_feitCreatieRolPhrase = 60;
	public static readonly RULE_feitCreatieSubjectPhrase = 61;
	public static readonly RULE_feitCreatieSubjectWord = 62;
	public static readonly RULE_feitCreatieWord = 63;
	public static readonly RULE_voorzetselNietVan = 64;
	public static readonly RULE_objectCreatie = 65;
	public static readonly RULE_objectAttributeInit = 66;
	public static readonly RULE_attributeInitVervolg = 67;
	public static readonly RULE_simpleNaamwoord = 68;
	public static readonly RULE_consistentieregel = 69;
	public static readonly RULE_uniekzijnResultaat = 70;
	public static readonly RULE_alleAttributenVanObjecttype = 71;
	public static readonly RULE_inconsistentResultaat = 72;
	public static readonly RULE_voorwaardeDeel = 73;
	public static readonly RULE_toplevelSamengesteldeVoorwaarde = 74;
	public static readonly RULE_voorwaardeKwantificatie = 75;
	public static readonly RULE_samengesteldeVoorwaardeOnderdeel = 76;
	public static readonly RULE_bulletPrefix = 77;
	public static readonly RULE_elementaireVoorwaarde = 78;
	public static readonly RULE_genesteSamengesteldeVoorwaarde = 79;
	public static readonly RULE_onderwerpReferentie = 80;
	public static readonly RULE_onderwerpBasis = 81;
	public static readonly RULE_basisOnderwerp = 82;
	public static readonly RULE_attribuutReferentie = 83;
	public static readonly RULE_attribuutMetLidwoord = 84;
	public static readonly RULE_kenmerkNaam = 85;
	public static readonly RULE_bezieldeReferentie = 86;
	public static readonly RULE_predicaat = 87;
	public static readonly RULE_elementairPredicaat = 88;
	public static readonly RULE_objectPredicaat = 89;
	public static readonly RULE_eenzijdigeObjectVergelijking = 90;
	public static readonly RULE_rolNaam = 91;
	public static readonly RULE_attribuutVergelijkingsPredicaat = 92;
	public static readonly RULE_getalPredicaat = 93;
	public static readonly RULE_tekstPredicaat = 94;
	public static readonly RULE_datumPredicaat = 95;
	public static readonly RULE_samengesteldPredicaat = 96;
	public static readonly RULE_samengesteldeVoorwaardeOnderdeelInPredicaat = 97;
	public static readonly RULE_elementaireVoorwaardeInPredicaat = 98;
	public static readonly RULE_vergelijkingInPredicaat = 99;
	public static readonly RULE_genesteSamengesteldeVoorwaardeInPredicaat = 100;
	public static readonly RULE_getalVergelijkingsOperatorMeervoud = 101;
	public static readonly RULE_tekstVergelijkingsOperatorMeervoud = 102;
	public static readonly RULE_datumVergelijkingsOperatorMeervoud = 103;
	public static readonly RULE_getalExpressie = 104;
	public static readonly RULE_tekstExpressie = 105;
	public static readonly RULE_datumExpressie = 106;
	public static readonly RULE_variabeleDeel = 107;
	public static readonly RULE_variabeleToekenning = 108;
	public static readonly RULE_expressie = 109;
	public static readonly RULE_logicalExpression = 110;
	public static readonly RULE_comparisonExpression = 111;
	public static readonly RULE_comparisonOperator = 112;
	public static readonly RULE_additiveExpression = 113;
	public static readonly RULE_additiveOperator = 114;
	public static readonly RULE_multiplicativeExpression = 115;
	public static readonly RULE_multiplicativeOperator = 116;
	public static readonly RULE_powerExpression = 117;
	public static readonly RULE_powerOperator = 118;
	public static readonly RULE_primaryExpression = 119;
	public static readonly RULE_afronding = 120;
	public static readonly RULE_begrenzing = 121;
	public static readonly RULE_begrenzingMinimum = 122;
	public static readonly RULE_begrenzingMaximum = 123;
	public static readonly RULE_conditieBijExpressie = 124;
	public static readonly RULE_periodevergelijkingEnkelvoudig = 125;
	public static readonly RULE_periodeDefinitie = 126;
	public static readonly RULE_dateExpression = 127;
	public static readonly RULE_getalAggregatieFunctie = 128;
	public static readonly RULE_datumAggregatieFunctie = 129;
	public static readonly RULE_dimensieSelectie = 130;
	public static readonly RULE_aggregerenOverAlleDimensies = 131;
	public static readonly RULE_aggregerenOverVerzameling = 132;
	public static readonly RULE_aggregerenOverBereik = 133;
	public static readonly RULE_unaryCondition = 134;
	public static readonly RULE_regelStatusCondition = 135;
	public static readonly RULE_subordinateClauseExpression = 136;
	public static readonly RULE_dagsoortDefinition = 137;
	public static readonly RULE_verdelingResultaat = 138;
	public static readonly RULE_verdelingMethodeSimple = 139;
	public static readonly RULE_verdelingMethodeMultiLine = 140;
	public static readonly RULE_verdelingMethodeBulletList = 141;
	public static readonly RULE_verdelingMethodeBullet = 142;
	public static readonly RULE_verdelingMethode = 143;
	public static readonly RULE_verdelingRest = 144;
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
                                                            "'niet'", "'ongelijk aan'", 
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
                                                            "'jaar'", "'kwartaal'", 
                                                            "'maand'", "'milliseconde'", 
                                                            "'minuut'", 
                                                            "'of'", "'onwaar'", 
                                                            "'op'", "'over'", 
                                                            "'periode'", 
                                                            "'Rekendatum'", 
                                                            "'Rekenjaar'", 
                                                            "'regelversie'", 
                                                            "'seconde'", 
                                                            "'t/m'", "'uit'", 
                                                            "'uur'", "'van'", 
                                                            "'volgende voorwaarde'", 
                                                            "'volgende voorwaarden'", 
                                                            "'volgende'", 
                                                            "'voor'", "'waar'", 
                                                            "'week'", "'er'", 
                                                            "'meter'", "'kilogram'", 
                                                            "'voet'", "'pond'", 
                                                            "'mijl'", "'m'", 
                                                            "'kg'", "'s'", 
                                                            "'ft'", "'lb'", 
                                                            "'mi'", "'\\u20AC'", 
                                                            "'$'", null, 
                                                            null, "'='", 
                                                            null, null, 
                                                            null, null, 
                                                            "'('", "')'", 
                                                            "'{'", "'}'", 
                                                            "','", "'.'", 
                                                            "':'", "';'", 
                                                            "'/'", "'%'", 
                                                            "'\\u2022'", 
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
                                                             "NIET", "ONGELIJK_AAN", 
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
                                                             "JAAR", "KWARTAAL", 
                                                             "MAAND", "MILLISECONDE", 
                                                             "MINUUT", "OF", 
                                                             "ONWAAR", "OP", 
                                                             "OVER", "PERIODE", 
                                                             "REKENDATUM", 
                                                             "REKENJAAR", 
                                                             "REGELVERSIE", 
                                                             "SECONDE", 
                                                             "TM", "UIT", 
                                                             "UUR", "VAN", 
                                                             "VOLGENDE_VOORWAARDE", 
                                                             "VOLGENDE_VOORWAARDEN", 
                                                             "VOLGENDE", 
                                                             "VOOR", "WAAR", 
                                                             "WEEK", "ER", 
                                                             "METER", "KILOGRAM", 
                                                             "VOET", "POND", 
                                                             "MIJL", "M", 
                                                             "KG", "S", 
                                                             "FT", "LB", 
                                                             "MI", "EURO_SYMBOL", 
                                                             "DOLLAR_SYMBOL", 
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
		"naamPhrase", "naamPhraseNoIs", "naamwoord", "naamwoordNoIs", "voorzetsel", 
		"datumLiteral", "unit", "objectTypeDefinition", "objectTypeMember", "kenmerkSpecificatie", 
		"attribuutSpecificatie", "datatype", "lijstDatatype", "numeriekDatatype", 
		"tekstDatatype", "booleanDatatype", "datumTijdDatatype", "getalSpecificatie", 
		"domeinDefinition", "domeinType", "enumeratieSpecificatie", "domeinRef", 
		"eenheidsysteemDefinition", "eenheidEntry", "unitIdentifier", "eenheidExpressie", 
		"eenheidMacht", "dimensieDefinition", "voorzetselSpecificatie", "labelWaardeSpecificatie", 
		"tijdlijn", "dimensieRef", "parameterDefinition", "parameterNamePhrase", 
		"parameterMetLidwoord", "feitTypeDefinition", "rolDefinition", "rolObjectType", 
		"rolContentWords", "cardinalityLine", "cardinalityWord", "regel", "regelGroep", 
		"regelName", "regelVersie", "versieGeldigheid", "resultaatDeel", "feitCreatiePattern", 
		"feitCreatieRolPhrase", "feitCreatieSubjectPhrase", "feitCreatieSubjectWord", 
		"feitCreatieWord", "voorzetselNietVan", "objectCreatie", "objectAttributeInit", 
		"attributeInitVervolg", "simpleNaamwoord", "consistentieregel", "uniekzijnResultaat", 
		"alleAttributenVanObjecttype", "inconsistentResultaat", "voorwaardeDeel", 
		"toplevelSamengesteldeVoorwaarde", "voorwaardeKwantificatie", "samengesteldeVoorwaardeOnderdeel", 
		"bulletPrefix", "elementaireVoorwaarde", "genesteSamengesteldeVoorwaarde", 
		"onderwerpReferentie", "onderwerpBasis", "basisOnderwerp", "attribuutReferentie", 
		"attribuutMetLidwoord", "kenmerkNaam", "bezieldeReferentie", "predicaat", 
		"elementairPredicaat", "objectPredicaat", "eenzijdigeObjectVergelijking", 
		"rolNaam", "attribuutVergelijkingsPredicaat", "getalPredicaat", "tekstPredicaat", 
		"datumPredicaat", "samengesteldPredicaat", "samengesteldeVoorwaardeOnderdeelInPredicaat", 
		"elementaireVoorwaardeInPredicaat", "vergelijkingInPredicaat", "genesteSamengesteldeVoorwaardeInPredicaat", 
		"getalVergelijkingsOperatorMeervoud", "tekstVergelijkingsOperatorMeervoud", 
		"datumVergelijkingsOperatorMeervoud", "getalExpressie", "tekstExpressie", 
		"datumExpressie", "variabeleDeel", "variabeleToekenning", "expressie", 
		"logicalExpression", "comparisonExpression", "comparisonOperator", "additiveExpression", 
		"additiveOperator", "multiplicativeExpression", "multiplicativeOperator", 
		"powerExpression", "powerOperator", "primaryExpression", "afronding", 
		"begrenzing", "begrenzingMinimum", "begrenzingMaximum", "conditieBijExpressie", 
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
			this.state = 298;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===27 || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 4031) !== 0)) {
				{
				this.state = 296;
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
					this.state = 290;
					this.definitie();
					}
					break;
				case 95:
					{
					this.state = 291;
					this.regel();
					}
					break;
				case 96:
					{
					this.state = 292;
					this.regelGroep();
					}
					break;
				case 97:
					{
					this.state = 293;
					this.beslistabel();
					}
					break;
				case 94:
					{
					this.state = 294;
					this.consistentieregel();
					}
					break;
				case 102:
					{
					this.state = 295;
					this.eenheidsysteemDefinition();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				this.state = 300;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 301;
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
			this.state = 309;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 98:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 303;
				this.objectTypeDefinition();
				}
				break;
			case 99:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 304;
				this.domeinDefinition();
				}
				break;
			case 103:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 305;
				this.parameterDefinition();
				}
				break;
			case 101:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 306;
				this.dimensieDefinition();
				}
				break;
			case 27:
			case 104:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 307;
				this.feitTypeDefinition();
				}
				break;
			case 105:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 308;
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
			this.state = 311;
			this.match(RegelSpraakParser.BESLISTABEL);
			this.state = 312;
			this.naamwoord();
			this.state = 314;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===107) {
				{
				this.state = 313;
				this.regelVersie();
				}
			}

			this.state = 316;
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
			this.state = 318;
			this.beslistabelHeader();
			this.state = 319;
			this.beslistabelSeparator();
			this.state = 321;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 320;
				this.beslistabelRow();
				}
				}
				this.state = 323;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===279);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
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
			this.state = 325;
			this.match(RegelSpraakParser.PIPE);
			this.state = 327;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===279) {
				{
				this.state = 326;
				this.match(RegelSpraakParser.PIPE);
				}
			}

			this.state = 329;
			localctx._resultColumn = this.beslistabelColumnText();
			this.state = 330;
			this.match(RegelSpraakParser.PIPE);
			this.state = 331;
			localctx._beslistabelColumnText = this.beslistabelColumnText();
			localctx._conditionColumns.push(localctx._beslistabelColumnText);
			this.state = 336;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 6, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 332;
					this.match(RegelSpraakParser.PIPE);
					this.state = 333;
					localctx._beslistabelColumnText = this.beslistabelColumnText();
					localctx._conditionColumns.push(localctx._beslistabelColumnText);
					}
					}
				}
				this.state = 338;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 6, this._ctx);
			}
			this.state = 340;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 7, this._ctx) ) {
			case 1:
				{
				this.state = 339;
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
			this.state = 343;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===279) {
				{
				this.state = 342;
				this.match(RegelSpraakParser.PIPE);
				}
			}

			this.state = 353;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 346;
					this._errHandler.sync(this);
					_alt = 1;
					do {
						switch (_alt) {
						case 1:
							{
							{
							this.state = 345;
							this.match(RegelSpraakParser.MINUS);
							}
							}
							break;
						default:
							throw new NoViableAltException(this);
						}
						this.state = 348;
						this._errHandler.sync(this);
						_alt = this._interp.adaptivePredict(this._input, 9, this._ctx);
					} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
					this.state = 351;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 10, this._ctx) ) {
					case 1:
						{
						this.state = 350;
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
				this.state = 355;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 11, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			this.state = 360;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===278) {
				{
				{
				this.state = 357;
				this.match(RegelSpraakParser.MINUS);
				}
				}
				this.state = 362;
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
			this.state = 363;
			this.match(RegelSpraakParser.PIPE);
			this.state = 364;
			localctx._rowNumber = this.match(RegelSpraakParser.NUMBER);
			this.state = 365;
			this.match(RegelSpraakParser.PIPE);
			this.state = 366;
			localctx._resultExpression = this.expressie();
			this.state = 367;
			this.match(RegelSpraakParser.PIPE);
			this.state = 368;
			localctx._beslistabelCellValue = this.beslistabelCellValue();
			localctx._conditionValues.push(localctx._beslistabelCellValue);
			this.state = 373;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 369;
					this.match(RegelSpraakParser.PIPE);
					this.state = 370;
					localctx._beslistabelCellValue = this.beslistabelCellValue();
					localctx._conditionValues.push(localctx._beslistabelCellValue);
					}
					}
				}
				this.state = 375;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 13, this._ctx);
			}
			this.state = 377;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 14, this._ctx) ) {
			case 1:
				{
				this.state = 376;
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
			this.state = 381;
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
			case 150:
			case 155:
			case 184:
			case 185:
			case 187:
			case 189:
			case 190:
			case 203:
			case 204:
			case 206:
			case 209:
			case 211:
			case 213:
			case 215:
			case 216:
			case 217:
			case 221:
			case 224:
			case 225:
			case 237:
			case 240:
			case 253:
			case 254:
			case 256:
			case 258:
			case 259:
			case 260:
			case 278:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 379;
				this.expressie();
				}
				break;
			case 280:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 380;
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
			this.state = 384;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 383;
					_la = this._input.LA(1);
					if(_la<=0 || _la===279) {
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
				this.state = 386;
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
			this.state = 388;
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
			this.state = 390;
			_la = this._input.LA(1);
			if(!(((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || _la===127 || _la===155 || ((((_la - 184)) & ~0x1F) === 0 && ((1 << (_la - 184)) & 2149056513) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 16777475) !== 0) || _la===253)) {
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
			this.state = 392;
			_la = this._input.LA(1);
			if(!(((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16793601) !== 0) || _la===127 || _la===155 || ((((_la - 184)) & ~0x1F) === 0 && ((1 << (_la - 184)) & 2149056513) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 16777475) !== 0) || _la===253)) {
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
			this.state = 451;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 27, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 395;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116 || ((((_la - 206)) & ~0x1F) === 0 && ((1 << (_la - 206)) & 41) !== 0)) {
					{
					this.state = 394;
					_la = this._input.LA(1);
					if(!(_la===116 || ((((_la - 206)) & ~0x1F) === 0 && ((1 << (_la - 206)) & 41) !== 0))) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 398;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 397;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 400;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 18, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 403;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 402;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 405;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 19, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 407;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 409;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 408;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 411;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 20, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 413;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 415;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 414;
					this.identifierOrKeyword();
					}
					}
					this.state = 417;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || _la===127 || _la===155 || ((((_la - 184)) & ~0x1F) === 0 && ((1 << (_la - 184)) & 2149056513) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 16777475) !== 0) || _la===253);
				this.state = 419;
				this.match(RegelSpraakParser.MET);
				this.state = 421;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 420;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 423;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 22, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 426;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 425;
					this.identifierOrKeyword();
					}
					}
					this.state = 428;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || _la===127 || _la===155 || ((((_la - 184)) & ~0x1F) === 0 && ((1 << (_la - 184)) & 2149056513) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 16777475) !== 0) || _la===253);
				this.state = 430;
				this.match(RegelSpraakParser.MET);
				this.state = 432;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 431;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 434;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 24, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 436;
				this.match(RegelSpraakParser.NIET);
				this.state = 438;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 437;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 440;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 25, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 442;
				this.match(RegelSpraakParser.HET);
				this.state = 443;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 444;
				this.match(RegelSpraakParser.DAGEN);
				this.state = 445;
				this.match(RegelSpraakParser.IN);
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
	public naamPhraseNoIs(): NaamPhraseNoIsContext {
		let localctx: NaamPhraseNoIsContext = new NaamPhraseNoIsContext(this, this._ctx, this.state);
		this.enterRule(localctx, 26, RegelSpraakParser.RULE_naamPhraseNoIs);
		let _la: number;
		try {
			let _alt: number;
			this.state = 501;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 37, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 454;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===116 || ((((_la - 206)) & ~0x1F) === 0 && ((1 << (_la - 206)) & 41) !== 0)) {
					{
					this.state = 453;
					_la = this._input.LA(1);
					if(!(_la===116 || ((((_la - 206)) & ~0x1F) === 0 && ((1 << (_la - 206)) & 41) !== 0))) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
				}

				this.state = 457;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 456;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 459;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 29, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 462;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 461;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 464;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 30, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 466;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 468;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 467;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 470;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 31, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 472;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 474;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 473;
					this.identifierOrKeywordNoIs();
					}
					}
					this.state = 476;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16793601) !== 0) || _la===127 || _la===155 || ((((_la - 184)) & ~0x1F) === 0 && ((1 << (_la - 184)) & 2149056513) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 16777475) !== 0) || _la===253);
				this.state = 478;
				this.match(RegelSpraakParser.MET);
				this.state = 480;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 479;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 482;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 33, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 485;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 484;
					this.identifierOrKeywordNoIs();
					}
					}
					this.state = 487;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16793601) !== 0) || _la===127 || _la===155 || ((((_la - 184)) & ~0x1F) === 0 && ((1 << (_la - 184)) & 2149056513) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 16777475) !== 0) || _la===253);
				this.state = 489;
				this.match(RegelSpraakParser.MET);
				this.state = 491;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 490;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 493;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 35, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 495;
				this.match(RegelSpraakParser.NIET);
				this.state = 497;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 496;
						this.identifierOrKeywordNoIs();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 499;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 36, this._ctx);
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
		this.enterRule(localctx, 28, RegelSpraakParser.RULE_naamwoord);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 503;
			this.naamPhrase();
			this.state = 509;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 38, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 504;
					this.voorzetsel();
					this.state = 505;
					this.naamPhrase();
					}
					}
				}
				this.state = 511;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 38, this._ctx);
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
		this.enterRule(localctx, 30, RegelSpraakParser.RULE_naamwoordNoIs);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 512;
			this.naamPhraseNoIs();
			this.state = 518;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===140 || _la===170 || ((((_la - 202)) & ~0x1F) === 0 && ((1 << (_la - 202)) & 1345327361) !== 0) || _la===236) {
				{
				{
				this.state = 513;
				this.voorzetsel();
				this.state = 514;
				this.naamPhraseNoIs();
				}
				}
				this.state = 520;
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
	public voorzetsel(): VoorzetselContext {
		let localctx: VoorzetselContext = new VoorzetselContext(this, this._ctx, this.state);
		this.enterRule(localctx, 32, RegelSpraakParser.RULE_voorzetsel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 521;
			_la = this._input.LA(1);
			if(!(_la===140 || _la===170 || ((((_la - 202)) & ~0x1F) === 0 && ((1 << (_la - 202)) & 1345327361) !== 0) || _la===236)) {
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
		this.enterRule(localctx, 34, RegelSpraakParser.RULE_datumLiteral);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 523;
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
		this.enterRule(localctx, 36, RegelSpraakParser.RULE_unit);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 525;
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
	public objectTypeDefinition(): ObjectTypeDefinitionContext {
		let localctx: ObjectTypeDefinitionContext = new ObjectTypeDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 38, RegelSpraakParser.RULE_objectTypeDefinition);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 527;
			this.match(RegelSpraakParser.OBJECTTYPE);
			this.state = 528;
			this.naamwoordNoIs();
			this.state = 536;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===172) {
				{
				this.state = 529;
				this.match(RegelSpraakParser.MV_START);
				this.state = 531;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 530;
					localctx._IDENTIFIER = this.match(RegelSpraakParser.IDENTIFIER);
					localctx._plural.push(localctx._IDENTIFIER);
					}
					}
					this.state = 533;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				this.state = 535;
				this.match(RegelSpraakParser.RPAREN);
				}
			}

			this.state = 539;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===159) {
				{
				this.state = 538;
				this.match(RegelSpraakParser.BEZIELD);
				}
			}

			this.state = 544;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 541;
					this.objectTypeMember();
					}
					}
				}
				this.state = 546;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 43, this._ctx);
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
		this.enterRule(localctx, 40, RegelSpraakParser.RULE_objectTypeMember);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 549;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 44, this._ctx) ) {
			case 1:
				{
				this.state = 547;
				this.kenmerkSpecificatie();
				}
				break;
			case 2:
				{
				this.state = 548;
				this.attribuutSpecificatie();
				}
				break;
			}
			this.state = 551;
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
		this.enterRule(localctx, 42, RegelSpraakParser.RULE_kenmerkSpecificatie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 558;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 46, this._ctx) ) {
			case 1:
				{
				this.state = 554;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===112) {
					{
					this.state = 553;
					this.match(RegelSpraakParser.IS);
					}
				}

				this.state = 556;
				this.identifier();
				}
				break;
			case 2:
				{
				this.state = 557;
				this.naamwoord();
				}
				break;
			}
			this.state = 560;
			this.match(RegelSpraakParser.KENMERK);
			this.state = 562;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===157 || _la===158) {
				{
				this.state = 561;
				_la = this._input.LA(1);
				if(!(_la===157 || _la===158)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
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
		this.enterRule(localctx, 44, RegelSpraakParser.RULE_attribuutSpecificatie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 564;
			this.naamwoord();
			this.state = 567;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 3:
			case 100:
			case 160:
			case 162:
			case 175:
			case 180:
				{
				this.state = 565;
				this.datatype();
				}
				break;
			case 253:
				{
				this.state = 566;
				this.domeinRef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 576;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===171) {
				{
				this.state = 569;
				this.match(RegelSpraakParser.MET_EENHEID);
				this.state = 574;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 253:
					{
					this.state = 570;
					localctx._unitName = this.match(RegelSpraakParser.IDENTIFIER);
					}
					break;
				case 269:
					{
					this.state = 571;
					this.match(RegelSpraakParser.PERCENT_SIGN);
					}
					break;
				case 251:
					{
					this.state = 572;
					this.match(RegelSpraakParser.EURO_SYMBOL);
					}
					break;
				case 252:
					{
					this.state = 573;
					this.match(RegelSpraakParser.DOLLAR_SYMBOL);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
			}

			this.state = 587;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===165) {
				{
				this.state = 578;
				this.match(RegelSpraakParser.GEDIMENSIONEERD_MET);
				this.state = 579;
				this.dimensieRef();
				this.state = 584;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===210) {
					{
					{
					this.state = 580;
					this.match(RegelSpraakParser.EN);
					this.state = 581;
					this.dimensieRef();
					}
					}
					this.state = 586;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 590;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 181)) & ~0x1F) === 0 && ((1 << (_la - 181)) & 7) !== 0)) {
				{
				this.state = 589;
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
		this.enterRule(localctx, 46, RegelSpraakParser.RULE_datatype);
		try {
			this.state = 597;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 175:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 592;
				this.numeriekDatatype();
				}
				break;
			case 180:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 593;
				this.tekstDatatype();
				}
				break;
			case 160:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 594;
				this.booleanDatatype();
				}
				break;
			case 3:
			case 162:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 595;
				this.datumTijdDatatype();
				}
				break;
			case 100:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 596;
				this.lijstDatatype();
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
		this.enterRule(localctx, 48, RegelSpraakParser.RULE_lijstDatatype);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 599;
			this.match(RegelSpraakParser.LIJST);
			this.state = 600;
			this.match(RegelSpraakParser.VAN);
			this.state = 601;
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
		this.enterRule(localctx, 50, RegelSpraakParser.RULE_numeriekDatatype);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 603;
			this.match(RegelSpraakParser.NUMERIEK);
			this.state = 608;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===260) {
				{
				this.state = 604;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 605;
				this.getalSpecificatie();
				this.state = 606;
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
		this.enterRule(localctx, 52, RegelSpraakParser.RULE_tekstDatatype);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 610;
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
	public booleanDatatype(): BooleanDatatypeContext {
		let localctx: BooleanDatatypeContext = new BooleanDatatypeContext(this, this._ctx, this.state);
		this.enterRule(localctx, 54, RegelSpraakParser.RULE_booleanDatatype);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 612;
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
		this.enterRule(localctx, 56, RegelSpraakParser.RULE_datumTijdDatatype);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 614;
			_la = this._input.LA(1);
			if(!(_la===3 || _la===162)) {
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
		this.enterRule(localctx, 58, RegelSpraakParser.RULE_getalSpecificatie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 617;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 173)) & ~0x1F) === 0 && ((1 << (_la - 173)) & 19) !== 0)) {
				{
				this.state = 616;
				_la = this._input.LA(1);
				if(!(((((_la - 173)) & ~0x1F) === 0 && ((1 << (_la - 173)) & 19) !== 0))) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 625;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 57, this._ctx) ) {
			case 1:
				{
				this.state = 619;
				this.match(RegelSpraakParser.GEHEEL_GETAL);
				}
				break;
			case 2:
				{
				{
				this.state = 620;
				this.match(RegelSpraakParser.GETAL);
				this.state = 621;
				this.match(RegelSpraakParser.MET);
				this.state = 622;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 623;
				this.match(RegelSpraakParser.DECIMALEN);
				}
				}
				break;
			case 3:
				{
				this.state = 624;
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
		this.enterRule(localctx, 60, RegelSpraakParser.RULE_domeinDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 627;
			this.match(RegelSpraakParser.DOMEIN);
			this.state = 628;
			localctx._name = this.match(RegelSpraakParser.IDENTIFIER);
			this.state = 629;
			this.match(RegelSpraakParser.IS_VAN_HET_TYPE);
			this.state = 630;
			this.domeinType();
			this.state = 633;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===171) {
				{
				this.state = 631;
				this.match(RegelSpraakParser.MET_EENHEID);
				this.state = 632;
				this.eenheidExpressie();
				}
			}

			this.state = 636;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===267) {
				{
				this.state = 635;
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
		this.enterRule(localctx, 62, RegelSpraakParser.RULE_domeinType);
		try {
			this.state = 643;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 164:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 638;
				this.enumeratieSpecificatie();
				}
				break;
			case 175:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 639;
				this.numeriekDatatype();
				}
				break;
			case 180:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 640;
				this.tekstDatatype();
				}
				break;
			case 160:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 641;
				this.booleanDatatype();
				}
				break;
			case 3:
			case 162:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 642;
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
		this.enterRule(localctx, 64, RegelSpraakParser.RULE_enumeratieSpecificatie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 645;
			this.match(RegelSpraakParser.ENUMERATIE);
			this.state = 647;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 646;
				this.match(RegelSpraakParser.ENUM_LITERAL);
				}
				}
				this.state = 649;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===259);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
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
		this.enterRule(localctx, 66, RegelSpraakParser.RULE_domeinRef);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 651;
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
	public eenheidsysteemDefinition(): EenheidsysteemDefinitionContext {
		let localctx: EenheidsysteemDefinitionContext = new EenheidsysteemDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 68, RegelSpraakParser.RULE_eenheidsysteemDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 653;
			this.match(RegelSpraakParser.EENHEIDSYSTEEM);
			this.state = 654;
			localctx._name = this.identifier();
			this.state = 658;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===206) {
				{
				{
				this.state = 655;
				this.eenheidEntry();
				}
				}
				this.state = 660;
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
		this.enterRule(localctx, 70, RegelSpraakParser.RULE_eenheidEntry);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 661;
			this.match(RegelSpraakParser.DE);
			this.state = 662;
			localctx._unitName = this.unitIdentifier();
			this.state = 663;
			localctx._abbrev = this.unitIdentifier();
			this.state = 667;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===255) {
				{
				this.state = 664;
				this.match(RegelSpraakParser.EQUALS);
				this.state = 665;
				localctx._value = this.match(RegelSpraakParser.NUMBER);
				this.state = 666;
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
		this.enterRule(localctx, 72, RegelSpraakParser.RULE_unitIdentifier);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 669;
			_la = this._input.LA(1);
			if(!(_la===132 || ((((_la - 203)) & ~0x1F) === 0 && ((1 << (_la - 203)) & 302075907) !== 0) || ((((_la - 238)) & ~0x1F) === 0 && ((1 << (_la - 238)) & 65533) !== 0))) {
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
		this.enterRule(localctx, 74, RegelSpraakParser.RULE_eenheidExpressie);
		let _la: number;
		try {
			this.state = 680;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 65, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 671;
				this.eenheidMacht();
				this.state = 674;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===268) {
					{
					this.state = 672;
					this.match(RegelSpraakParser.SLASH);
					this.state = 673;
					this.eenheidMacht();
					}
				}

				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 676;
				this.match(RegelSpraakParser.NUMBER);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 677;
				this.match(RegelSpraakParser.PERCENT_SIGN);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 678;
				this.match(RegelSpraakParser.EURO_SYMBOL);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 679;
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
		this.enterRule(localctx, 76, RegelSpraakParser.RULE_eenheidMacht);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 682;
			this.unitIdentifier();
			this.state = 685;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===274) {
				{
				this.state = 683;
				this.match(RegelSpraakParser.CARET);
				this.state = 684;
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
		this.enterRule(localctx, 78, RegelSpraakParser.RULE_dimensieDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 687;
			this.match(RegelSpraakParser.DIMENSIE);
			this.state = 688;
			this.naamwoord();
			this.state = 690;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===264) {
				{
				this.state = 689;
				this.match(RegelSpraakParser.COMMA);
				}
			}

			this.state = 692;
			this.match(RegelSpraakParser.BESTAANDE_UIT);
			this.state = 693;
			localctx._dimensieNaamMeervoud = this.naamwoord();
			this.state = 694;
			this.voorzetselSpecificatie();
			this.state = 696;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 695;
				this.labelWaardeSpecificatie();
				}
				}
				this.state = 698;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===254);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
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
		this.enterRule(localctx, 80, RegelSpraakParser.RULE_voorzetselSpecificatie);
		let _la: number;
		try {
			this.state = 707;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 2:
				this.enterOuterAlt(localctx, 1);
				{
				{
				this.state = 700;
				this.match(RegelSpraakParser.NA_HET_ATTRIBUUT_MET_VOORZETSEL);
				this.state = 701;
				localctx._vz = this.voorzetsel();
				this.state = 702;
				this.match(RegelSpraakParser.RPAREN);
				this.state = 704;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===266) {
					{
					this.state = 703;
					this.match(RegelSpraakParser.COLON);
					}
				}

				}
				}
				break;
			case 1:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 706;
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
		this.enterRule(localctx, 82, RegelSpraakParser.RULE_labelWaardeSpecificatie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 709;
			this.match(RegelSpraakParser.NUMBER);
			this.state = 710;
			this.match(RegelSpraakParser.DOT);
			this.state = 711;
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
		this.enterRule(localctx, 84, RegelSpraakParser.RULE_tijdlijn);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 713;
			_la = this._input.LA(1);
			if(!(((((_la - 181)) & ~0x1F) === 0 && ((1 << (_la - 181)) & 7) !== 0))) {
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
		this.enterRule(localctx, 86, RegelSpraakParser.RULE_dimensieRef);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 715;
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
		this.enterRule(localctx, 88, RegelSpraakParser.RULE_parameterDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 717;
			this.match(RegelSpraakParser.PARAMETER);
			this.state = 718;
			this.parameterNamePhrase();
			this.state = 719;
			this.match(RegelSpraakParser.COLON);
			this.state = 722;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 3:
			case 100:
			case 160:
			case 162:
			case 175:
			case 180:
				{
				this.state = 720;
				this.datatype();
				}
				break;
			case 253:
				{
				this.state = 721;
				this.domeinRef();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 726;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===171) {
				{
				this.state = 724;
				this.match(RegelSpraakParser.MET_EENHEID);
				this.state = 725;
				this.eenheidExpressie();
				}
			}

			this.state = 729;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 181)) & ~0x1F) === 0 && ((1 << (_la - 181)) & 7) !== 0)) {
				{
				this.state = 728;
				this.tijdlijn();
				}
			}

			this.state = 731;
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
	public parameterNamePhrase(): ParameterNamePhraseContext {
		let localctx: ParameterNamePhraseContext = new ParameterNamePhraseContext(this, this._ctx, this.state);
		this.enterRule(localctx, 90, RegelSpraakParser.RULE_parameterNamePhrase);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 734;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===206 || _la===211) {
				{
				this.state = 733;
				_la = this._input.LA(1);
				if(!(_la===206 || _la===211)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
			}

			this.state = 737;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 736;
				_la = this._input.LA(1);
				if(!(_la===184 || _la===253)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				}
				this.state = 739;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la===184 || _la===253);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
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
		this.enterRule(localctx, 92, RegelSpraakParser.RULE_parameterMetLidwoord);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 741;
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
	public feitTypeDefinition(): FeitTypeDefinitionContext {
		let localctx: FeitTypeDefinitionContext = new FeitTypeDefinitionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 94, RegelSpraakParser.RULE_feitTypeDefinition);
		try {
			let _alt: number;
			this.state = 758;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 104:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 743;
				this.match(RegelSpraakParser.FEITTYPE);
				this.state = 744;
				localctx._feittypenaam = this.naamwoord();
				this.state = 745;
				this.rolDefinition();
				this.state = 747;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 746;
						this.rolDefinition();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 749;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 76, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				this.state = 751;
				this.cardinalityLine();
				}
				break;
			case 27:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 753;
				this.match(RegelSpraakParser.WEDERKERIG_FEITTYPE);
				this.state = 754;
				localctx._feittypenaam = this.naamwoord();
				this.state = 755;
				this.rolDefinition();
				this.state = 756;
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
		this.enterRule(localctx, 96, RegelSpraakParser.RULE_rolDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 760;
			localctx._article = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(_la===206 || _la===211)) {
			    localctx._article = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 761;
			localctx._content = this.rolContentWords();
			this.state = 766;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 78, this._ctx) ) {
			case 1:
				{
				this.state = 762;
				this.match(RegelSpraakParser.MV_START);
				this.state = 763;
				localctx._meervoud = this.naamwoord();
				this.state = 764;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			}
			this.state = 769;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 79, this._ctx) ) {
			case 1:
				{
				this.state = 768;
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
		this.enterRule(localctx, 98, RegelSpraakParser.RULE_rolObjectType);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 772;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 771;
					this.identifierOrKeyword();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 774;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 80, this._ctx);
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
		this.enterRule(localctx, 100, RegelSpraakParser.RULE_rolContentWords);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 778;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 778;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 95:
					case 109:
					case 112:
					case 119:
					case 127:
					case 155:
					case 184:
					case 203:
					case 204:
					case 215:
					case 216:
					case 217:
					case 224:
					case 240:
					case 253:
						{
						this.state = 776;
						this.identifierOrKeyword();
						}
						break;
					case 140:
					case 170:
					case 202:
					case 210:
					case 214:
					case 222:
					case 223:
					case 230:
					case 232:
					case 236:
						{
						this.state = 777;
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
				this.state = 780;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 82, this._ctx);
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
		this.enterRule(localctx, 102, RegelSpraakParser.RULE_cardinalityLine);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 783;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 782;
					this.cardinalityWord();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 785;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 83, this._ctx);
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
		this.enterRule(localctx, 104, RegelSpraakParser.RULE_cardinalityWord);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 787;
			_la = this._input.LA(1);
			if(_la<=0 || _la===27 || ((((_la - 94)) & ~0x1F) === 0 && ((1 << (_la - 94)) & 4027) !== 0) || _la===267) {
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
		this.enterRule(localctx, 106, RegelSpraakParser.RULE_regel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 789;
			this.match(RegelSpraakParser.REGEL);
			this.state = 790;
			this.regelName();
			this.state = 792;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===254) {
				{
				this.state = 791;
				this.match(RegelSpraakParser.NUMBER);
				}
			}

			this.state = 794;
			this.regelVersie();
			this.state = 795;
			this.resultaatDeel();
			this.state = 801;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 110:
				{
				this.state = 796;
				this.voorwaardeDeel();
				this.state = 798;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===265) {
					{
					this.state = 797;
					this.match(RegelSpraakParser.DOT);
					}
				}

				}
				break;
			case 265:
				{
				this.state = 800;
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
			this.state = 804;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===106) {
				{
				this.state = 803;
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
		this.enterRule(localctx, 108, RegelSpraakParser.RULE_regelGroep);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 806;
			this.match(RegelSpraakParser.REGELGROEP);
			this.state = 807;
			this.naamwoord();
			this.state = 809;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===111) {
				{
				this.state = 808;
				localctx._isRecursive = this.match(RegelSpraakParser.IS_RECURSIEF);
				}
			}

			this.state = 813;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 813;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case 95:
						{
						this.state = 811;
						this.regel();
						}
						break;
					case 94:
						{
						this.state = 812;
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
				this.state = 815;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 90, this._ctx);
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
		this.enterRule(localctx, 110, RegelSpraakParser.RULE_regelName);
		let _la: number;
		try {
			this.state = 871;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 100, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 817;
				this.naamwoord();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 819;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 818;
					this.match(RegelSpraakParser.IDENTIFIER);
					}
					}
					this.state = 821;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				this.state = 823;
				this.match(RegelSpraakParser.KENMERK);
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 825;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 824;
					this.match(RegelSpraakParser.IDENTIFIER);
					}
					}
					this.state = 827;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				this.state = 829;
				this.match(RegelSpraakParser.ROL);
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 831;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 830;
					this.match(RegelSpraakParser.IDENTIFIER);
					}
					}
					this.state = 833;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				this.state = 835;
				this.match(RegelSpraakParser.NIET);
				this.state = 836;
				this.match(RegelSpraakParser.KENMERK);
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 838;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 837;
					this.match(RegelSpraakParser.IDENTIFIER);
					}
					}
					this.state = 840;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				this.state = 842;
				this.match(RegelSpraakParser.NIET);
				this.state = 843;
				this.match(RegelSpraakParser.ROL);
				}
				break;
			case 6:
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 845;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 844;
					this.match(RegelSpraakParser.IDENTIFIER);
					}
					}
					this.state = 847;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				this.state = 849;
				this.match(RegelSpraakParser.KENMERKEN);
				this.state = 851;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 850;
					this.match(RegelSpraakParser.IDENTIFIER);
					}
					}
					this.state = 853;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				}
				break;
			case 7:
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 856;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 855;
					this.match(RegelSpraakParser.IDENTIFIER);
					}
					}
					this.state = 858;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				this.state = 860;
				this.match(RegelSpraakParser.ROLLEN);
				this.state = 862;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 861;
					this.match(RegelSpraakParser.IDENTIFIER);
					}
					}
					this.state = 864;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				}
				break;
			case 8:
				this.enterOuterAlt(localctx, 8);
				{
				this.state = 867;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 866;
					this.match(RegelSpraakParser.IDENTIFIER);
					}
					}
					this.state = 869;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
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
		this.enterRule(localctx, 112, RegelSpraakParser.RULE_regelVersie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 873;
			this.match(RegelSpraakParser.GELDIG);
			this.state = 874;
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
		this.enterRule(localctx, 114, RegelSpraakParser.RULE_versieGeldigheid);
		let _la: number;
		try {
			this.state = 883;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 201:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 876;
				this.match(RegelSpraakParser.ALTIJD);
				}
				break;
			case 144:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 877;
				this.match(RegelSpraakParser.VANAF);
				this.state = 878;
				this.datumLiteral();
				this.state = 881;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===142 || _la===229) {
					{
					this.state = 879;
					_la = this._input.LA(1);
					if(!(_la===142 || _la===229)) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					this.state = 880;
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
		this.enterRule(localctx, 116, RegelSpraakParser.RULE_resultaatDeel);
		let _la: number;
		try {
			this.state = 911;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 106, this._ctx) ) {
			case 1:
				localctx = new DagsoortdefinitieResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 885;
				this.match(RegelSpraakParser.EEN);
				this.state = 886;
				this.match(RegelSpraakParser.DAG);
				this.state = 887;
				this.match(RegelSpraakParser.IS);
				this.state = 888;
				this.match(RegelSpraakParser.EEN);
				this.state = 889;
				this.naamwoord();
				}
				break;
			case 2:
				localctx = new GelijkstellingResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 890;
				this.attribuutReferentie();
				this.state = 897;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 7:
					{
					this.state = 891;
					this.match(RegelSpraakParser.WORDT_BEREKEND_ALS);
					this.state = 892;
					this.expressie();
					}
					break;
				case 8:
					{
					this.state = 893;
					this.match(RegelSpraakParser.WORDT_GESTELD_OP);
					this.state = 894;
					this.expressie();
					}
					break;
				case 9:
					{
					this.state = 895;
					this.match(RegelSpraakParser.WORDT_GEINITIALISEERD_OP);
					this.state = 896;
					this.expressie();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 900;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 140)) & ~0x1F) === 0 && ((1 << (_la - 140)) & 21) !== 0) || _la===232) {
					{
					this.state = 899;
					this.periodeDefinitie();
					}
				}

				}
				break;
			case 3:
				localctx = new FeitCreatieResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 902;
				this.feitCreatiePattern();
				}
				break;
			case 4:
				localctx = new KenmerkFeitResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 903;
				this.onderwerpReferentie();
				this.state = 904;
				_la = this._input.LA(1);
				if(!(_la===109 || _la===112)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 905;
				this.kenmerkNaam();
				this.state = 907;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 140)) & ~0x1F) === 0 && ((1 << (_la - 140)) & 21) !== 0) || _la===232) {
					{
					this.state = 906;
					this.periodeDefinitie();
					}
				}

				}
				break;
			case 5:
				localctx = new ObjectCreatieResultaatContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 909;
				this.objectCreatie();
				}
				break;
			case 6:
				localctx = new VerdelingContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 910;
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
	public feitCreatiePattern(): FeitCreatiePatternContext {
		let localctx: FeitCreatiePatternContext = new FeitCreatiePatternContext(this, this._ctx, this.state);
		this.enterRule(localctx, 118, RegelSpraakParser.RULE_feitCreatiePattern);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 913;
			this.match(RegelSpraakParser.EEN);
			this.state = 914;
			localctx._role1 = this.feitCreatieRolPhrase();
			this.state = 915;
			this.match(RegelSpraakParser.VAN);
			this.state = 916;
			localctx._article1 = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(((((_la - 206)) & ~0x1F) === 0 && ((1 << (_la - 206)) & 41) !== 0))) {
			    localctx._article1 = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 917;
			localctx._subject1 = this.feitCreatieSubjectPhrase();
			this.state = 918;
			this.match(RegelSpraakParser.IS);
			this.state = 919;
			this.match(RegelSpraakParser.EEN);
			this.state = 920;
			localctx._role2 = this.feitCreatieRolPhrase();
			this.state = 921;
			this.match(RegelSpraakParser.VAN);
			this.state = 922;
			localctx._article2 = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(((((_la - 206)) & ~0x1F) === 0 && ((1 << (_la - 206)) & 41) !== 0))) {
			    localctx._article2 = this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 923;
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
		this.enterRule(localctx, 120, RegelSpraakParser.RULE_feitCreatieRolPhrase);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 926;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 925;
				this.feitCreatieWord();
				}
				}
				this.state = 928;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 16924673) !== 0) || ((((_la - 127)) & ~0x1F) === 0 && ((1 << (_la - 127)) & 268443649) !== 0) || _la===170 || _la===184 || ((((_la - 202)) & ~0x1F) === 0 && ((1 << (_la - 202)) & 275837191) !== 0) || ((((_la - 236)) & ~0x1F) === 0 && ((1 << (_la - 236)) & 131089) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
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
		this.enterRule(localctx, 122, RegelSpraakParser.RULE_feitCreatieSubjectPhrase);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 931;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 930;
					this.feitCreatieSubjectWord();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 933;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 108, this._ctx);
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
		this.enterRule(localctx, 124, RegelSpraakParser.RULE_feitCreatieSubjectWord);
		try {
			this.state = 940;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 95:
			case 109:
			case 112:
			case 119:
			case 127:
			case 155:
			case 184:
			case 203:
			case 204:
			case 215:
			case 216:
			case 217:
			case 224:
			case 240:
			case 253:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 935;
				this.identifierOrKeyword();
				}
				break;
			case 140:
			case 170:
			case 202:
			case 210:
			case 214:
			case 222:
			case 223:
			case 230:
			case 232:
			case 236:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 936;
				this.voorzetsel();
				}
				break;
			case 206:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 937;
				this.match(RegelSpraakParser.DE);
				}
				break;
			case 211:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 938;
				this.match(RegelSpraakParser.HET);
				}
				break;
			case 209:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 939;
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
		this.enterRule(localctx, 126, RegelSpraakParser.RULE_feitCreatieWord);
		try {
			this.state = 944;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 95:
			case 109:
			case 112:
			case 119:
			case 127:
			case 155:
			case 184:
			case 203:
			case 204:
			case 215:
			case 216:
			case 217:
			case 224:
			case 240:
			case 253:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 942;
				this.identifierOrKeyword();
				}
				break;
			case 140:
			case 170:
			case 202:
			case 210:
			case 214:
			case 222:
			case 223:
			case 230:
			case 236:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 943;
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
		this.enterRule(localctx, 128, RegelSpraakParser.RULE_voorzetselNietVan);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 946;
			_la = this._input.LA(1);
			if(!(_la===140 || _la===170 || ((((_la - 202)) & ~0x1F) === 0 && ((1 << (_la - 202)) & 271585537) !== 0) || _la===236)) {
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
		this.enterRule(localctx, 130, RegelSpraakParser.RULE_objectCreatie);
		let _la: number;
		try {
			this.state = 967;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 40:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 948;
				this.match(RegelSpraakParser.ER_WORDT_EEN_NIEUW);
				this.state = 949;
				localctx._objectType = this.naamwoord();
				this.state = 950;
				this.match(RegelSpraakParser.AANGEMAAKT);
				this.state = 952;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===170) {
					{
					this.state = 951;
					this.objectAttributeInit();
					}
				}

				this.state = 955;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 112, this._ctx) ) {
				case 1:
					{
					this.state = 954;
					this.match(RegelSpraakParser.DOT);
					}
					break;
				}
				}
				break;
			case 43:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 957;
				this.match(RegelSpraakParser.CREEER);
				this.state = 958;
				this.match(RegelSpraakParser.EEN);
				this.state = 959;
				this.match(RegelSpraakParser.NIEUWE);
				this.state = 960;
				localctx._objectType = this.naamwoord();
				this.state = 962;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===170) {
					{
					this.state = 961;
					this.objectAttributeInit();
					}
				}

				this.state = 965;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 114, this._ctx) ) {
				case 1:
					{
					this.state = 964;
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
		this.enterRule(localctx, 132, RegelSpraakParser.RULE_objectAttributeInit);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 969;
			this.match(RegelSpraakParser.MET);
			this.state = 970;
			localctx._attribuut = this.simpleNaamwoord();
			this.state = 971;
			localctx._waarde = this.expressie();
			this.state = 975;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===210) {
				{
				{
				this.state = 972;
				this.attributeInitVervolg();
				}
				}
				this.state = 977;
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
		this.enterRule(localctx, 134, RegelSpraakParser.RULE_attributeInitVervolg);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 978;
			this.match(RegelSpraakParser.EN);
			this.state = 979;
			localctx._attribuut = this.simpleNaamwoord();
			this.state = 980;
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
		this.enterRule(localctx, 136, RegelSpraakParser.RULE_simpleNaamwoord);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 982;
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
		this.enterRule(localctx, 138, RegelSpraakParser.RULE_consistentieregel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 984;
			this.match(RegelSpraakParser.CONSISTENTIEREGEL);
			this.state = 985;
			this.naamwoord();
			this.state = 995;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 119, this._ctx) ) {
			case 1:
				{
				this.state = 986;
				this.uniekzijnResultaat();
				}
				break;
			case 2:
				{
				this.state = 987;
				this.inconsistentResultaat();
				this.state = 993;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 110:
					{
					this.state = 988;
					this.voorwaardeDeel();
					this.state = 990;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===265) {
						{
						this.state = 989;
						this.match(RegelSpraakParser.DOT);
						}
					}

					}
					break;
				case 265:
					{
					this.state = 992;
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
		this.enterRule(localctx, 140, RegelSpraakParser.RULE_uniekzijnResultaat);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 997;
			this.alleAttributenVanObjecttype();
			this.state = 998;
			this.match(RegelSpraakParser.MOETEN_UNIEK_ZIJN);
			this.state = 1000;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===265) {
				{
				this.state = 999;
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
		this.enterRule(localctx, 142, RegelSpraakParser.RULE_alleAttributenVanObjecttype);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1002;
			this.match(RegelSpraakParser.DE);
			this.state = 1003;
			this.naamwoord();
			this.state = 1004;
			this.match(RegelSpraakParser.VAN);
			this.state = 1005;
			this.match(RegelSpraakParser.ALLE);
			this.state = 1006;
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
		this.enterRule(localctx, 144, RegelSpraakParser.RULE_inconsistentResultaat);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1009;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 121, this._ctx) ) {
			case 1:
				{
				this.state = 1008;
				_la = this._input.LA(1);
				if(!(_la===206 || _la===211 || _la===239)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				}
				break;
			}
			this.state = 1011;
			this.naamwoord();
			this.state = 1012;
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
		this.enterRule(localctx, 146, RegelSpraakParser.RULE_voorwaardeDeel);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1014;
			this.match(RegelSpraakParser.INDIEN);
			this.state = 1017;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 122, this._ctx) ) {
			case 1:
				{
				this.state = 1015;
				this.expressie();
				}
				break;
			case 2:
				{
				this.state = 1016;
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
		this.enterRule(localctx, 148, RegelSpraakParser.RULE_toplevelSamengesteldeVoorwaarde);
		let _la: number;
		try {
			this.state = 1061;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 128, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1019;
				this.match(RegelSpraakParser.ER_AAN);
				this.state = 1020;
				this.voorwaardeKwantificatie();
				this.state = 1021;
				_la = this._input.LA(1);
				if(!(_la===233 || _la===234)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1022;
				this.match(RegelSpraakParser.WORDT_VOLDAAN);
				this.state = 1023;
				this.match(RegelSpraakParser.COLON);
				this.state = 1025;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1024;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					this.state = 1027;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 270)) & ~0x1F) === 0 && ((1 << (_la - 270)) & 291) !== 0));
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1033;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 124, this._ctx) ) {
				case 1:
					{
					this.state = 1029;
					this.onderwerpReferentie();
					}
					break;
				case 2:
					{
					this.state = 1030;
					this.match(RegelSpraakParser.HIJ);
					}
					break;
				case 3:
					{
					this.state = 1031;
					this.match(RegelSpraakParser.HET);
					}
					break;
				case 4:
					{
					this.state = 1032;
					this.match(RegelSpraakParser.ER);
					}
					break;
				}
				this.state = 1035;
				this.match(RegelSpraakParser.AAN);
				this.state = 1036;
				this.voorwaardeKwantificatie();
				this.state = 1037;
				_la = this._input.LA(1);
				if(!(_la===233 || _la===234)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1038;
				this.match(RegelSpraakParser.VOLDOET);
				this.state = 1039;
				this.match(RegelSpraakParser.COLON);
				this.state = 1041;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1040;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					this.state = 1043;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 270)) & ~0x1F) === 0 && ((1 << (_la - 270)) & 291) !== 0));
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1049;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 126, this._ctx) ) {
				case 1:
					{
					this.state = 1045;
					this.onderwerpReferentie();
					}
					break;
				case 2:
					{
					this.state = 1046;
					this.match(RegelSpraakParser.HIJ);
					}
					break;
				case 3:
					{
					this.state = 1047;
					this.match(RegelSpraakParser.HET);
					}
					break;
				case 4:
					{
					this.state = 1048;
					this.match(RegelSpraakParser.ER);
					}
					break;
				}
				this.state = 1051;
				this.match(RegelSpraakParser.VOLDOET);
				this.state = 1052;
				this.match(RegelSpraakParser.AAN);
				this.state = 1053;
				this.voorwaardeKwantificatie();
				this.state = 1054;
				_la = this._input.LA(1);
				if(!(_la===233 || _la===234)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1055;
				this.match(RegelSpraakParser.COLON);
				this.state = 1057;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1056;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					this.state = 1059;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (((((_la - 270)) & ~0x1F) === 0 && ((1 << (_la - 270)) & 291) !== 0));
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
		this.enterRule(localctx, 150, RegelSpraakParser.RULE_voorwaardeKwantificatie);
		let _la: number;
		try {
			this.state = 1077;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 119:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1063;
				this.match(RegelSpraakParser.ALLE);
				}
				break;
			case 197:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1064;
				this.match(RegelSpraakParser.GEEN_VAN_DE);
				}
				break;
			case 151:
			case 152:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1065;
				_la = this._input.LA(1);
				if(!(_la===151 || _la===152)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1066;
				_la = this._input.LA(1);
				if(!(((((_la - 195)) & ~0x1F) === 0 && ((1 << (_la - 195)) & 16435) !== 0) || _la===254)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1067;
				this.match(RegelSpraakParser.VAN);
				this.state = 1068;
				this.match(RegelSpraakParser.DE);
				}
				break;
			case 153:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1069;
				this.match(RegelSpraakParser.TEN_HOOGSTE);
				this.state = 1070;
				_la = this._input.LA(1);
				if(!(((((_la - 195)) & ~0x1F) === 0 && ((1 << (_la - 195)) & 16435) !== 0) || _la===254)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1071;
				this.match(RegelSpraakParser.VAN);
				this.state = 1072;
				this.match(RegelSpraakParser.DE);
				}
				break;
			case 154:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1073;
				this.match(RegelSpraakParser.PRECIES);
				this.state = 1074;
				_la = this._input.LA(1);
				if(!(((((_la - 195)) & ~0x1F) === 0 && ((1 << (_la - 195)) & 16435) !== 0) || _la===254)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1075;
				this.match(RegelSpraakParser.VAN);
				this.state = 1076;
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
		this.enterRule(localctx, 152, RegelSpraakParser.RULE_samengesteldeVoorwaardeOnderdeel);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1079;
			this.bulletPrefix();
			this.state = 1082;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 130, this._ctx) ) {
			case 1:
				{
				this.state = 1080;
				this.elementaireVoorwaarde();
				}
				break;
			case 2:
				{
				this.state = 1081;
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
		this.enterRule(localctx, 154, RegelSpraakParser.RULE_bulletPrefix);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1085;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1084;
					_la = this._input.LA(1);
					if(!(((((_la - 270)) & ~0x1F) === 0 && ((1 << (_la - 270)) & 291) !== 0))) {
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
				this.state = 1087;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 131, this._ctx);
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
		this.enterRule(localctx, 156, RegelSpraakParser.RULE_elementaireVoorwaarde);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1089;
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
		this.enterRule(localctx, 158, RegelSpraakParser.RULE_genesteSamengesteldeVoorwaarde);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1094;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 132, this._ctx) ) {
			case 1:
				{
				this.state = 1091;
				this.onderwerpReferentie();
				}
				break;
			case 2:
				{
				this.state = 1092;
				this.match(RegelSpraakParser.HIJ);
				}
				break;
			case 3:
				{
				this.state = 1093;
				this.match(RegelSpraakParser.ER);
				}
				break;
			}
			this.state = 1096;
			this.match(RegelSpraakParser.VOLDOET);
			this.state = 1097;
			this.match(RegelSpraakParser.AAN);
			this.state = 1098;
			this.voorwaardeKwantificatie();
			this.state = 1099;
			_la = this._input.LA(1);
			if(!(_la===233 || _la===234)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1100;
			this.match(RegelSpraakParser.COLON);
			this.state = 1102;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1101;
					this.samengesteldeVoorwaardeOnderdeel();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1104;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 133, this._ctx);
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
		this.enterRule(localctx, 160, RegelSpraakParser.RULE_onderwerpReferentie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1106;
			this.onderwerpBasis();
			this.state = 1109;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 134, this._ctx) ) {
			case 1:
				{
				this.state = 1107;
				_la = this._input.LA(1);
				if(!(_la===205 || _la===208)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1108;
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
	public onderwerpBasis(): OnderwerpBasisContext {
		let localctx: OnderwerpBasisContext = new OnderwerpBasisContext(this, this._ctx, this.state);
		this.enterRule(localctx, 162, RegelSpraakParser.RULE_onderwerpBasis);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1111;
			this.basisOnderwerp();
			this.state = 1117;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 135, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1112;
					this.voorzetsel();
					this.state = 1113;
					this.basisOnderwerp();
					}
					}
				}
				this.state = 1119;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 135, this._ctx);
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
		this.enterRule(localctx, 164, RegelSpraakParser.RULE_basisOnderwerp);
		let _la: number;
		try {
			let _alt: number;
			this.state = 1129;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 95:
			case 109:
			case 112:
			case 116:
			case 119:
			case 127:
			case 155:
			case 184:
			case 203:
			case 204:
			case 206:
			case 209:
			case 211:
			case 215:
			case 216:
			case 217:
			case 224:
			case 240:
			case 253:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1121;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 136, this._ctx) ) {
				case 1:
					{
					this.state = 1120;
					_la = this._input.LA(1);
					if(!(_la===116 || _la===119 || ((((_la - 206)) & ~0x1F) === 0 && ((1 << (_la - 206)) & 41) !== 0))) {
					this._errHandler.recoverInline(this);
					}
					else {
						this._errHandler.reportMatch(this);
					    this.consume();
					}
					}
					break;
				}
				this.state = 1124;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 1123;
						this.identifierOrKeyword();
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 1126;
					this._errHandler.sync(this);
					_alt = this._interp.adaptivePredict(this._input, 137, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				}
				break;
			case 213:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1128;
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
		this.enterRule(localctx, 166, RegelSpraakParser.RULE_attribuutReferentie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1131;
			this.attribuutMetLidwoord();
			this.state = 1132;
			this.match(RegelSpraakParser.VAN);
			this.state = 1133;
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
		this.enterRule(localctx, 168, RegelSpraakParser.RULE_attribuutMetLidwoord);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1135;
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
	public kenmerkNaam(): KenmerkNaamContext {
		let localctx: KenmerkNaamContext = new KenmerkNaamContext(this, this._ctx, this.state);
		this.enterRule(localctx, 170, RegelSpraakParser.RULE_kenmerkNaam);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1137;
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
	public bezieldeReferentie(): BezieldeReferentieContext {
		let localctx: BezieldeReferentieContext = new BezieldeReferentieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 172, RegelSpraakParser.RULE_bezieldeReferentie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1139;
			this.match(RegelSpraakParser.ZIJN);
			this.state = 1140;
			this.identifier();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
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
		this.enterRule(localctx, 174, RegelSpraakParser.RULE_predicaat);
		try {
			this.state = 1144;
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
			case 155:
			case 184:
			case 203:
			case 204:
			case 206:
			case 209:
			case 211:
			case 213:
			case 215:
			case 216:
			case 217:
			case 224:
			case 240:
			case 253:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1142;
				this.elementairPredicaat();
				}
				break;
			case 117:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1143;
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
		this.enterRule(localctx, 176, RegelSpraakParser.RULE_elementairPredicaat);
		try {
			this.state = 1151;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 140, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1146;
				this.attribuutVergelijkingsPredicaat();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1147;
				this.objectPredicaat();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1148;
				this.getalPredicaat();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1149;
				this.tekstPredicaat();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1150;
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
		this.enterRule(localctx, 178, RegelSpraakParser.RULE_objectPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1153;
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
		this.enterRule(localctx, 180, RegelSpraakParser.RULE_eenzijdigeObjectVergelijking);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1156;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 141, this._ctx) ) {
			case 1:
				{
				this.state = 1155;
				this.match(RegelSpraakParser.EEN);
				}
				break;
			}
			this.state = 1160;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 142, this._ctx) ) {
			case 1:
				{
				this.state = 1158;
				this.kenmerkNaam();
				}
				break;
			case 2:
				{
				this.state = 1159;
				this.rolNaam();
				}
				break;
			}
			this.state = 1162;
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
		this.enterRule(localctx, 182, RegelSpraakParser.RULE_rolNaam);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1164;
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
		this.enterRule(localctx, 184, RegelSpraakParser.RULE_attribuutVergelijkingsPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1167;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 143, this._ctx) ) {
			case 1:
				{
				this.state = 1166;
				this.match(RegelSpraakParser.EEN);
				}
				break;
			}
			this.state = 1169;
			localctx._attribuutNaam = this.naamwoord();
			this.state = 1170;
			this.match(RegelSpraakParser.HEBBEN);
			this.state = 1171;
			this.comparisonOperator();
			this.state = 1172;
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
		this.enterRule(localctx, 186, RegelSpraakParser.RULE_getalPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1174;
			this.getalVergelijkingsOperatorMeervoud();
			this.state = 1175;
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
		this.enterRule(localctx, 188, RegelSpraakParser.RULE_tekstPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1177;
			this.tekstVergelijkingsOperatorMeervoud();
			this.state = 1178;
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
		this.enterRule(localctx, 190, RegelSpraakParser.RULE_datumPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1180;
			this.datumVergelijkingsOperatorMeervoud();
			this.state = 1181;
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
		this.enterRule(localctx, 192, RegelSpraakParser.RULE_samengesteldPredicaat);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1183;
			this.match(RegelSpraakParser.AAN);
			this.state = 1184;
			this.voorwaardeKwantificatie();
			this.state = 1185;
			this.match(RegelSpraakParser.VOLGENDE);
			this.state = 1186;
			_la = this._input.LA(1);
			if(!(_la===155 || _la===156)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1187;
			_la = this._input.LA(1);
			if(!(_la===147 || _la===148)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1188;
			this.match(RegelSpraakParser.COLON);
			this.state = 1190;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1189;
					this.samengesteldeVoorwaardeOnderdeelInPredicaat();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1192;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 144, this._ctx);
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
		this.enterRule(localctx, 194, RegelSpraakParser.RULE_samengesteldeVoorwaardeOnderdeelInPredicaat);
		try {
			this.state = 1200;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 145, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1194;
				this.bulletPrefix();
				this.state = 1195;
				this.elementaireVoorwaardeInPredicaat();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1197;
				this.bulletPrefix();
				this.state = 1198;
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
		this.enterRule(localctx, 196, RegelSpraakParser.RULE_elementaireVoorwaardeInPredicaat);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1202;
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
		this.enterRule(localctx, 198, RegelSpraakParser.RULE_vergelijkingInPredicaat);
		let _la: number;
		try {
			this.state = 1215;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 146, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1204;
				this.attribuutReferentie();
				this.state = 1205;
				this.comparisonOperator();
				this.state = 1206;
				this.expressie();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1208;
				this.onderwerpReferentie();
				this.state = 1209;
				this.eenzijdigeObjectVergelijking();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1211;
				this.attribuutReferentie();
				this.state = 1212;
				_la = this._input.LA(1);
				if(!(_la===112 || _la===116)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1213;
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
		this.enterRule(localctx, 200, RegelSpraakParser.RULE_genesteSamengesteldeVoorwaardeInPredicaat);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1221;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 148:
				{
				this.state = 1217;
				this.match(RegelSpraakParser.VOLDOET);
				}
				break;
			case 147:
				{
				this.state = 1218;
				this.match(RegelSpraakParser.VOLDOEN);
				}
				break;
			case 281:
				{
				this.state = 1219;
				this.match(RegelSpraakParser.WORDT);
				this.state = 1220;
				this.match(RegelSpraakParser.VOLDAAN);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1223;
			this.match(RegelSpraakParser.AAN);
			this.state = 1224;
			this.voorwaardeKwantificatie();
			this.state = 1225;
			this.match(RegelSpraakParser.VOLGENDE);
			this.state = 1226;
			_la = this._input.LA(1);
			if(!(_la===155 || _la===156)) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1227;
			this.match(RegelSpraakParser.COLON);
			this.state = 1229;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 1228;
					this.samengesteldeVoorwaardeOnderdeelInPredicaat();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1231;
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
	public getalVergelijkingsOperatorMeervoud(): GetalVergelijkingsOperatorMeervoudContext {
		let localctx: GetalVergelijkingsOperatorMeervoudContext = new GetalVergelijkingsOperatorMeervoudContext(this, this._ctx, this.state);
		this.enterRule(localctx, 202, RegelSpraakParser.RULE_getalVergelijkingsOperatorMeervoud);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1233;
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
		this.enterRule(localctx, 204, RegelSpraakParser.RULE_tekstVergelijkingsOperatorMeervoud);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1235;
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
		this.enterRule(localctx, 206, RegelSpraakParser.RULE_datumVergelijkingsOperatorMeervoud);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1237;
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
		this.enterRule(localctx, 208, RegelSpraakParser.RULE_getalExpressie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1239;
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
		this.enterRule(localctx, 210, RegelSpraakParser.RULE_tekstExpressie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1241;
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
		this.enterRule(localctx, 212, RegelSpraakParser.RULE_datumExpressie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1243;
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
		this.enterRule(localctx, 214, RegelSpraakParser.RULE_variabeleDeel);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1245;
			this.match(RegelSpraakParser.DAARBIJ_GELDT);
			this.state = 1249;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===44 || ((((_la - 95)) & ~0x1F) === 0 && ((1 << (_la - 95)) & 19021825) !== 0) || ((((_la - 127)) & ~0x1F) === 0 && ((1 << (_la - 127)) & 268435713) !== 0) || ((((_la - 184)) & ~0x1F) === 0 && ((1 << (_la - 184)) & 2321022977) !== 0) || ((((_la - 216)) & ~0x1F) === 0 && ((1 << (_la - 216)) & 16777475) !== 0) || _la===253) {
				{
				{
				this.state = 1246;
				this.variabeleToekenning();
				}
				}
				this.state = 1251;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1252;
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
		this.enterRule(localctx, 216, RegelSpraakParser.RULE_variabeleToekenning);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1254;
			this.naamwoord();
			this.state = 1255;
			this.match(RegelSpraakParser.IS);
			this.state = 1256;
			this.expressie();
			this.state = 1258;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===267) {
				{
				this.state = 1257;
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
	public expressie(): ExpressieContext {
		let localctx: ExpressieContext = new ExpressieContext(this, this._ctx, this.state);
		this.enterRule(localctx, 218, RegelSpraakParser.RULE_expressie);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1260;
			this.logicalExpression();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
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
		this.enterRule(localctx, 220, RegelSpraakParser.RULE_logicalExpression);
		let _la: number;
		try {
			localctx = new LogicalExprContext(this, localctx);
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1262;
			(localctx as LogicalExprContext)._left = this.comparisonExpression();
			this.state = 1265;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 151, this._ctx) ) {
			case 1:
				{
				this.state = 1263;
				(localctx as LogicalExprContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===210 || _la===220)) {
				    (localctx as LogicalExprContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1264;
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
		this.enterRule(localctx, 222, RegelSpraakParser.RULE_comparisonExpression);
		try {
			this.state = 1284;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 153, this._ctx) ) {
			case 1:
				localctx = new SubordinateClauseExprContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1267;
				this.subordinateClauseExpression();
				}
				break;
			case 2:
				localctx = new IsKenmerkExprContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1268;
				(localctx as IsKenmerkExprContext)._left = this.additiveExpression();
				this.state = 1269;
				this.match(RegelSpraakParser.IS);
				this.state = 1270;
				this.naamwoord();
				}
				break;
			case 3:
				localctx = new HeeftKenmerkExprContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1272;
				(localctx as HeeftKenmerkExprContext)._left = this.additiveExpression();
				this.state = 1273;
				this.match(RegelSpraakParser.HEEFT);
				this.state = 1274;
				this.naamwoord();
				}
				break;
			case 4:
				localctx = new BinaryComparisonExprContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1276;
				(localctx as BinaryComparisonExprContext)._left = this.additiveExpression();
				this.state = 1280;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 152, this._ctx) ) {
				case 1:
					{
					this.state = 1277;
					this.comparisonOperator();
					this.state = 1278;
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
				this.state = 1282;
				this.unaryCondition();
				}
				break;
			case 6:
				localctx = new RegelStatusConditionExprContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1283;
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
		this.enterRule(localctx, 224, RegelSpraakParser.RULE_comparisonOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1286;
			_la = this._input.LA(1);
			if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 31457280) !== 0) || ((((_la - 37)) & ~0x1F) === 0 && ((1 << (_la - 37)) & 1073741315) !== 0) || ((((_la - 112)) & ~0x1F) === 0 && ((1 << (_la - 112)) & 25381121) !== 0) || _la===214)) {
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
		this.enterRule(localctx, 226, RegelSpraakParser.RULE_additiveExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1288;
			localctx._left = this.multiplicativeExpression();
			this.state = 1294;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 154, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1289;
					this.additiveOperator();
					this.state = 1290;
					localctx._right = this.multiplicativeExpression();
					}
					}
				}
				this.state = 1296;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 154, this._ctx);
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
		this.enterRule(localctx, 228, RegelSpraakParser.RULE_additiveOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1297;
			_la = this._input.LA(1);
			if(!(((((_la - 132)) & ~0x1F) === 0 && ((1 << (_la - 132)) & 16417) !== 0))) {
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
		this.enterRule(localctx, 230, RegelSpraakParser.RULE_multiplicativeExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1299;
			localctx._left = this.powerExpression();
			this.state = 1305;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 155, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1300;
					this.multiplicativeOperator();
					this.state = 1301;
					localctx._right = this.powerExpression();
					}
					}
				}
				this.state = 1307;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 155, this._ctx);
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
		this.enterRule(localctx, 232, RegelSpraakParser.RULE_multiplicativeOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1308;
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
		this.enterRule(localctx, 234, RegelSpraakParser.RULE_powerExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1310;
			localctx._left = this.primaryExpression(0);
			this.state = 1316;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 156, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1311;
					this.powerOperator();
					this.state = 1312;
					localctx._right = this.primaryExpression(0);
					}
					}
				}
				this.state = 1318;
				this._errHandler.sync(this);
				_alt = this._interp.adaptivePredict(this._input, 156, this._ctx);
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
		this.enterRule(localctx, 236, RegelSpraakParser.RULE_powerOperator);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1319;
			_la = this._input.LA(1);
			if(!(_la===141 || _la===274)) {
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
		let _startState: number = 238;
		this.enterRecursionRule(localctx, 238, RegelSpraakParser.RULE_primaryExpression, _p);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1559;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 180, this._ctx) ) {
			case 1:
				{
				localctx = new UnaryMinusExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;

				this.state = 1322;
				this.match(RegelSpraakParser.MIN);
				this.state = 1323;
				this.primaryExpression(50);
				}
				break;
			case 2:
				{
				localctx = new UnaryMinusExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1324;
				this.match(RegelSpraakParser.MINUS);
				this.state = 1325;
				this.primaryExpression(49);
				}
				break;
			case 3:
				{
				localctx = new UnaryNietExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1326;
				this.match(RegelSpraakParser.NIET);
				this.state = 1327;
				this.primaryExpression(48);
				}
				break;
			case 4:
				{
				localctx = new AbsTijdsduurFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1328;
				this.match(RegelSpraakParser.DE_ABSOLUTE_TIJDSDUUR_VAN);
				this.state = 1329;
				this.primaryExpression(0);
				this.state = 1330;
				this.match(RegelSpraakParser.TOT);
				this.state = 1331;
				this.primaryExpression(0);
				this.state = 1334;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 157, this._ctx) ) {
				case 1:
					{
					this.state = 1332;
					this.match(RegelSpraakParser.IN_HELE);
					this.state = 1333;
					(localctx as AbsTijdsduurFuncExprContext)._unitName = this.match(RegelSpraakParser.IDENTIFIER);
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
				this.state = 1336;
				this.match(RegelSpraakParser.TIJDSDUUR_VAN);
				this.state = 1337;
				this.primaryExpression(0);
				this.state = 1338;
				this.match(RegelSpraakParser.TOT);
				this.state = 1339;
				this.primaryExpression(0);
				this.state = 1342;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 158, this._ctx) ) {
				case 1:
					{
					this.state = 1340;
					this.match(RegelSpraakParser.IN_HELE);
					this.state = 1341;
					(localctx as TijdsduurFuncExprContext)._unitName = this.match(RegelSpraakParser.IDENTIFIER);
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
				this.state = 1344;
				this.match(RegelSpraakParser.SOM_VAN);
				this.state = 1345;
				this.primaryExpression(0);
				this.state = 1350;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===264) {
					{
					{
					this.state = 1346;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1347;
					this.primaryExpression(0);
					}
					}
					this.state = 1352;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1353;
				this.match(RegelSpraakParser.EN);
				this.state = 1354;
				this.primaryExpression(45);
				}
				break;
			case 7:
				{
				localctx = new SomAlleExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1356;
				this.match(RegelSpraakParser.SOM_VAN);
				this.state = 1357;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1358;
				this.naamwoord();
				}
				break;
			case 8:
				{
				localctx = new SomAlleAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1359;
				this.match(RegelSpraakParser.SOM_VAN);
				this.state = 1360;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1361;
				this.attribuutReferentie();
				}
				break;
			case 9:
				{
				localctx = new AantalFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1363;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===211) {
					{
					this.state = 1362;
					this.match(RegelSpraakParser.HET);
					}
				}

				this.state = 1365;
				this.match(RegelSpraakParser.AANTAL);
				{
				this.state = 1367;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 161, this._ctx) ) {
				case 1:
					{
					this.state = 1366;
					this.match(RegelSpraakParser.ALLE);
					}
					break;
				}
				this.state = 1369;
				this.onderwerpReferentie();
				}
				}
				break;
			case 10:
				{
				localctx = new AantalAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1371;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===211) {
					{
					this.state = 1370;
					this.match(RegelSpraakParser.HET);
					}
				}

				this.state = 1373;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1374;
				this.attribuutReferentie();
				}
				break;
			case 11:
				{
				localctx = new PercentageFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1375;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 1378;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 269:
					{
					this.state = 1376;
					this.match(RegelSpraakParser.PERCENT_SIGN);
					}
					break;
				case 253:
					{
					this.state = 1377;
					(localctx as PercentageFuncExprContext)._p = this.match(RegelSpraakParser.IDENTIFIER);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1380;
				this.match(RegelSpraakParser.VAN);
				this.state = 1381;
				this.primaryExpression(40);
				}
				break;
			case 12:
				{
				localctx = new ConcatenatieExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1382;
				this.match(RegelSpraakParser.CONCATENATIE_VAN);
				this.state = 1383;
				this.primaryExpression(0);
				this.state = 1388;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===264) {
					{
					{
					this.state = 1384;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1385;
					this.primaryExpression(0);
					}
					}
					this.state = 1390;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1391;
				_la = this._input.LA(1);
				if(!(_la===210 || _la===220)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1392;
				this.primaryExpression(37);
				}
				break;
			case 13:
				{
				localctx = new WortelFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1394;
				this.match(RegelSpraakParser.DE_WORTEL_VAN);
				this.state = 1395;
				this.primaryExpression(35);
				}
				break;
			case 14:
				{
				localctx = new AbsValFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1396;
				this.match(RegelSpraakParser.DE_ABSOLUTE_WAARDE_VAN);
				this.state = 1397;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1398;
				this.primaryExpression(0);
				this.state = 1399;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			case 15:
				{
				localctx = new MinValFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1401;
				this.match(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN);
				this.state = 1402;
				this.primaryExpression(0);
				this.state = 1407;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===264) {
					{
					{
					this.state = 1403;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1404;
					this.primaryExpression(0);
					}
					}
					this.state = 1409;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1410;
				this.match(RegelSpraakParser.EN);
				this.state = 1411;
				this.primaryExpression(33);
				}
				break;
			case 16:
				{
				localctx = new MinAlleAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1413;
				this.match(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN);
				this.state = 1414;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1415;
				this.attribuutReferentie();
				}
				break;
			case 17:
				{
				localctx = new MaxValFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1416;
				this.match(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN);
				this.state = 1417;
				this.primaryExpression(0);
				this.state = 1422;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===264) {
					{
					{
					this.state = 1418;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1419;
					this.primaryExpression(0);
					}
					}
					this.state = 1424;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1425;
				this.match(RegelSpraakParser.EN);
				this.state = 1426;
				this.primaryExpression(31);
				}
				break;
			case 18:
				{
				localctx = new MaxAlleAttribuutExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1428;
				this.match(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN);
				this.state = 1429;
				this.match(RegelSpraakParser.ALLE);
				this.state = 1430;
				this.attribuutReferentie();
				}
				break;
			case 19:
				{
				localctx = new JaarUitFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1431;
				this.match(RegelSpraakParser.HET);
				this.state = 1432;
				this.match(RegelSpraakParser.JAAR);
				this.state = 1433;
				this.match(RegelSpraakParser.UIT);
				this.state = 1434;
				this.primaryExpression(29);
				}
				break;
			case 20:
				{
				localctx = new MaandUitFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1435;
				this.match(RegelSpraakParser.DE);
				this.state = 1436;
				this.match(RegelSpraakParser.MAAND);
				this.state = 1437;
				this.match(RegelSpraakParser.UIT);
				this.state = 1438;
				this.primaryExpression(28);
				}
				break;
			case 21:
				{
				localctx = new DagUitFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1439;
				this.match(RegelSpraakParser.DE);
				this.state = 1440;
				this.match(RegelSpraakParser.DAG);
				this.state = 1441;
				this.match(RegelSpraakParser.UIT);
				this.state = 1442;
				this.primaryExpression(27);
				}
				break;
			case 22:
				{
				localctx = new DatumMetFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1443;
				this.match(RegelSpraakParser.DE_DATUM_MET);
				this.state = 1444;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1445;
				this.primaryExpression(0);
				this.state = 1446;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1447;
				this.primaryExpression(0);
				this.state = 1448;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1449;
				this.primaryExpression(0);
				this.state = 1450;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			case 23:
				{
				localctx = new PasenFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1452;
				this.match(RegelSpraakParser.DE_EERSTE_PAASDAG_VAN);
				this.state = 1453;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1454;
				this.primaryExpression(0);
				this.state = 1455;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			case 24:
				{
				localctx = new EersteDatumFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1457;
				this.match(RegelSpraakParser.EERSTE_VAN);
				this.state = 1458;
				this.primaryExpression(0);
				this.state = 1463;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===264) {
					{
					{
					this.state = 1459;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1460;
					this.primaryExpression(0);
					}
					}
					this.state = 1465;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1466;
				this.match(RegelSpraakParser.EN);
				this.state = 1467;
				this.primaryExpression(23);
				}
				break;
			case 25:
				{
				localctx = new LaatsteDatumFuncExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1469;
				this.match(RegelSpraakParser.LAATSTE_VAN);
				this.state = 1470;
				this.primaryExpression(0);
				this.state = 1475;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la===264) {
					{
					{
					this.state = 1471;
					this.match(RegelSpraakParser.COMMA);
					this.state = 1472;
					this.primaryExpression(0);
					}
					}
					this.state = 1477;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1478;
				this.match(RegelSpraakParser.EN);
				this.state = 1479;
				this.primaryExpression(22);
				}
				break;
			case 26:
				{
				localctx = new TotaalVanExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1481;
				this.match(RegelSpraakParser.HET_TOTAAL_VAN);
				this.state = 1482;
				this.expressie();
				this.state = 1484;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 169, this._ctx) ) {
				case 1:
					{
					this.state = 1483;
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
				this.state = 1486;
				this.match(RegelSpraakParser.HET);
				this.state = 1487;
				this.match(RegelSpraakParser.AANTAL);
				this.state = 1488;
				this.match(RegelSpraakParser.DAGEN);
				this.state = 1489;
				this.match(RegelSpraakParser.IN);
				this.state = 1498;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 206:
				case 217:
					{
					this.state = 1491;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===206) {
						{
						this.state = 1490;
						this.match(RegelSpraakParser.DE);
						}
					}

					this.state = 1493;
					this.match(RegelSpraakParser.MAAND);
					}
					break;
				case 211:
				case 215:
					{
					this.state = 1495;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					if (_la===211) {
						{
						this.state = 1494;
						this.match(RegelSpraakParser.HET);
						}
					}

					this.state = 1497;
					this.match(RegelSpraakParser.JAAR);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1500;
				this.match(RegelSpraakParser.DAT);
				this.state = 1501;
				this.expressie();
				}
				break;
			case 28:
				{
				localctx = new CapitalizedTotaalVanExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1503;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1502;
					this.identifier();
					}
					}
					this.state = 1505;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				this.state = 1507;
				this.match(RegelSpraakParser.HET_TOTAAL_VAN);
				this.state = 1508;
				this.expressie();
				this.state = 1510;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 174, this._ctx) ) {
				case 1:
					{
					this.state = 1509;
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
				this.state = 1512;
				this.match(RegelSpraakParser.HET_TIJDSEVENREDIG_DEEL_PER);
				this.state = 1513;
				_la = this._input.LA(1);
				if(!(_la===215 || _la===217)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1514;
				this.match(RegelSpraakParser.VAN);
				this.state = 1515;
				this.expressie();
				this.state = 1517;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 175, this._ctx) ) {
				case 1:
					{
					this.state = 1516;
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
				this.state = 1520;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1519;
					this.identifier();
					}
					}
					this.state = 1522;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				this.state = 1524;
				this.match(RegelSpraakParser.HET_TIJDSEVENREDIG_DEEL_PER);
				this.state = 1525;
				_la = this._input.LA(1);
				if(!(_la===215 || _la===217)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1526;
				this.match(RegelSpraakParser.VAN);
				this.state = 1527;
				this.expressie();
				this.state = 1529;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 177, this._ctx) ) {
				case 1:
					{
					this.state = 1528;
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
				this.state = 1533;
				this._errHandler.sync(this);
				switch (this._input.LA(1)) {
				case 12:
				case 13:
				case 184:
				case 189:
				case 211:
					{
					this.state = 1531;
					this.getalAggregatieFunctie();
					}
					break;
				case 185:
				case 187:
					{
					this.state = 1532;
					this.datumAggregatieFunctie();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 1535;
				this.attribuutMetLidwoord();
				this.state = 1536;
				this.dimensieSelectie();
				}
				break;
			case 32:
				{
				localctx = new AttrRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1538;
				this.attribuutReferentie();
				}
				break;
			case 33:
				{
				localctx = new BezieldeRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1539;
				this.bezieldeReferentie();
				}
				break;
			case 34:
				{
				localctx = new OnderwerpRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1540;
				this.onderwerpReferentie();
				}
				break;
			case 35:
				{
				localctx = new NaamwoordExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1541;
				this.naamwoord();
				}
				break;
			case 36:
				{
				localctx = new ParamRefExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1542;
				this.parameterMetLidwoord();
				}
				break;
			case 37:
				{
				localctx = new RekendatumKeywordExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1543;
				this.match(RegelSpraakParser.REKENDATUM);
				}
				break;
			case 38:
				{
				localctx = new IdentifierExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1544;
				this.identifier();
				}
				break;
			case 39:
				{
				localctx = new NumberLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1545;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 1547;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 179, this._ctx) ) {
				case 1:
					{
					this.state = 1546;
					this.unitIdentifier();
					}
					break;
				}
				}
				break;
			case 40:
				{
				localctx = new StringLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1549;
				this.match(RegelSpraakParser.STRING_LITERAL);
				}
				break;
			case 41:
				{
				localctx = new EnumLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1550;
				this.match(RegelSpraakParser.ENUM_LITERAL);
				}
				break;
			case 42:
				{
				localctx = new DatumLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1551;
				this.datumLiteral();
				}
				break;
			case 43:
				{
				localctx = new BooleanTrueLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1552;
				this.match(RegelSpraakParser.WAAR);
				}
				break;
			case 44:
				{
				localctx = new BooleanFalseLiteralExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1553;
				this.match(RegelSpraakParser.ONWAAR);
				}
				break;
			case 45:
				{
				localctx = new PronounExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1554;
				this.match(RegelSpraakParser.HIJ);
				}
				break;
			case 46:
				{
				localctx = new ParenExprContext(this, localctx);
				this._ctx = localctx;
				_prevctx = localctx;
				this.state = 1555;
				this.match(RegelSpraakParser.LPAREN);
				this.state = 1556;
				this.expressie();
				this.state = 1557;
				this.match(RegelSpraakParser.RPAREN);
				}
				break;
			}
			this._ctx.stop = this._input.LT(-1);
			this.state = 1583;
			this._errHandler.sync(this);
			_alt = this._interp.adaptivePredict(this._input, 183, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = localctx;
					{
					this.state = 1581;
					this._errHandler.sync(this);
					switch ( this._interp.adaptivePredict(this._input, 182, this._ctx) ) {
					case 1:
						{
						localctx = new SimpleConcatenatieExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1561;
						if (!(this.precpred(this._ctx, 36))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 36)");
						}
						this.state = 1564;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
						do {
							{
							{
							this.state = 1562;
							this.match(RegelSpraakParser.COMMA);
							this.state = 1563;
							this.primaryExpression(0);
							}
							}
							this.state = 1566;
							this._errHandler.sync(this);
							_la = this._input.LA(1);
						} while (_la===264);
						this.state = 1568;
						_la = this._input.LA(1);
						if(!(_la===210 || _la===220)) {
						this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1569;
						this.primaryExpression(37);
						}
						break;
					case 2:
						{
						localctx = new AfrondingExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1571;
						if (!(this.precpred(this._ctx, 39))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 39)");
						}
						this.state = 1572;
						this.afronding();
						}
						break;
					case 3:
						{
						localctx = new BegrenzingExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1573;
						if (!(this.precpred(this._ctx, 38))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 38)");
						}
						this.state = 1574;
						this.match(RegelSpraakParser.COMMA);
						this.state = 1575;
						this.begrenzing();
						}
						break;
					case 4:
						{
						localctx = new DateCalcExprContext(this, new PrimaryExpressionContext(this, _parentctx, _parentState));
						this.pushNewRecursionContext(localctx, _startState, RegelSpraakParser.RULE_primaryExpression);
						this.state = 1576;
						if (!(this.precpred(this._ctx, 24))) {
							throw this.createFailedPredicateException("this.precpred(this._ctx, 24)");
						}
						this.state = 1577;
						_la = this._input.LA(1);
						if(!(_la===132 || _la===137)) {
						this._errHandler.recoverInline(this);
						}
						else {
							this._errHandler.reportMatch(this);
						    this.consume();
						}
						this.state = 1578;
						this.primaryExpression(0);
						this.state = 1579;
						this.identifier();
						}
						break;
					}
					}
				}
				this.state = 1585;
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
			this.unrollRecursionContexts(_parentctx);
		}
		return localctx;
	}
	// @RuleVersion(0)
	public afronding(): AfrondingContext {
		let localctx: AfrondingContext = new AfrondingContext(this, this._ctx, this.state);
		this.enterRule(localctx, 240, RegelSpraakParser.RULE_afronding);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1586;
			_la = this._input.LA(1);
			if(!(((((_la - 133)) & ~0x1F) === 0 && ((1 << (_la - 133)) & 65635) !== 0))) {
			this._errHandler.recoverInline(this);
			}
			else {
				this._errHandler.reportMatch(this);
			    this.consume();
			}
			this.state = 1587;
			this.match(RegelSpraakParser.AFGEROND_OP);
			this.state = 1588;
			this.match(RegelSpraakParser.NUMBER);
			this.state = 1589;
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
		this.enterRule(localctx, 242, RegelSpraakParser.RULE_begrenzing);
		try {
			this.state = 1597;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 184, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1591;
				this.begrenzingMinimum();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1592;
				this.begrenzingMaximum();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1593;
				this.begrenzingMinimum();
				this.state = 1594;
				this.match(RegelSpraakParser.EN);
				this.state = 1595;
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
		this.enterRule(localctx, 244, RegelSpraakParser.RULE_begrenzingMinimum);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1599;
			this.match(RegelSpraakParser.MET_EEN_MINIMUM_VAN);
			this.state = 1600;
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
		this.enterRule(localctx, 246, RegelSpraakParser.RULE_begrenzingMaximum);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1602;
			this.match(RegelSpraakParser.MET_EEN_MAXIMUM_VAN);
			this.state = 1603;
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
		this.enterRule(localctx, 248, RegelSpraakParser.RULE_conditieBijExpressie);
		try {
			this.state = 1608;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 4:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1605;
				this.match(RegelSpraakParser.GEDURENDE_DE_TIJD_DAT);
				this.state = 1606;
				localctx._condition = this.expressie();
				}
				break;
			case 140:
			case 142:
			case 144:
			case 232:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1607;
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
		this.enterRule(localctx, 250, RegelSpraakParser.RULE_periodevergelijkingEnkelvoudig);
		try {
			this.state = 1626;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 186, this._ctx) ) {
			case 1:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1610;
				this.match(RegelSpraakParser.VANAF);
				this.state = 1611;
				this.datumLiteral();
				}
				break;
			case 2:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1612;
				this.match(RegelSpraakParser.VAN);
				this.state = 1613;
				this.datumLiteral();
				this.state = 1614;
				this.match(RegelSpraakParser.TOT);
				this.state = 1615;
				this.datumLiteral();
				}
				break;
			case 3:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1617;
				this.match(RegelSpraakParser.VAN);
				this.state = 1618;
				this.datumLiteral();
				this.state = 1619;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1620;
				this.datumLiteral();
				}
				break;
			case 4:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1622;
				this.match(RegelSpraakParser.TOT);
				this.state = 1623;
				this.datumLiteral();
				}
				break;
			case 5:
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1624;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1625;
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
		this.enterRule(localctx, 252, RegelSpraakParser.RULE_periodeDefinitie);
		try {
			this.state = 1644;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 187, this._ctx) ) {
			case 1:
				localctx = new VanafPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1628;
				this.match(RegelSpraakParser.VANAF);
				this.state = 1629;
				this.dateExpression();
				}
				break;
			case 2:
				localctx = new TotPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1630;
				this.match(RegelSpraakParser.TOT);
				this.state = 1631;
				this.dateExpression();
				}
				break;
			case 3:
				localctx = new TotEnMetPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1632;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1633;
				this.dateExpression();
				}
				break;
			case 4:
				localctx = new VanTotPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1634;
				this.match(RegelSpraakParser.VAN);
				this.state = 1635;
				this.dateExpression();
				this.state = 1636;
				this.match(RegelSpraakParser.TOT);
				this.state = 1637;
				this.dateExpression();
				}
				break;
			case 5:
				localctx = new VanTotEnMetPeriodeContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1639;
				this.match(RegelSpraakParser.VAN);
				this.state = 1640;
				this.dateExpression();
				this.state = 1641;
				this.match(RegelSpraakParser.TOT_EN_MET);
				this.state = 1642;
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
		this.enterRule(localctx, 254, RegelSpraakParser.RULE_dateExpression);
		try {
			this.state = 1650;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 256:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1646;
				this.datumLiteral();
				}
				break;
			case 225:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1647;
				this.match(RegelSpraakParser.REKENDATUM);
				}
				break;
			case 226:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1648;
				this.match(RegelSpraakParser.REKENJAAR);
				}
				break;
			case 44:
			case 95:
			case 109:
			case 112:
			case 116:
			case 119:
			case 127:
			case 135:
			case 155:
			case 184:
			case 203:
			case 204:
			case 206:
			case 209:
			case 211:
			case 215:
			case 216:
			case 217:
			case 224:
			case 240:
			case 253:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1649;
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
		this.enterRule(localctx, 256, RegelSpraakParser.RULE_getalAggregatieFunctie);
		let _la: number;
		try {
			this.state = 1659;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 184:
			case 211:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1653;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la===211) {
					{
					this.state = 1652;
					this.match(RegelSpraakParser.HET);
					}
				}

				this.state = 1655;
				this.match(RegelSpraakParser.AANTAL);
				}
				break;
			case 12:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1656;
				this.match(RegelSpraakParser.DE_MAXIMALE_WAARDE_VAN);
				}
				break;
			case 13:
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1657;
				this.match(RegelSpraakParser.DE_MINIMALE_WAARDE_VAN);
				}
				break;
			case 189:
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1658;
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
		this.enterRule(localctx, 258, RegelSpraakParser.RULE_datumAggregatieFunctie);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1661;
			_la = this._input.LA(1);
			if(!(_la===185 || _la===187)) {
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
		this.enterRule(localctx, 260, RegelSpraakParser.RULE_dimensieSelectie);
		try {
			this.state = 1673;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 223:
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1663;
				this.match(RegelSpraakParser.OVER);
				this.state = 1667;
				this._errHandler.sync(this);
				switch ( this._interp.adaptivePredict(this._input, 191, this._ctx) ) {
				case 1:
					{
					this.state = 1664;
					this.aggregerenOverAlleDimensies();
					}
					break;
				case 2:
					{
					this.state = 1665;
					this.aggregerenOverVerzameling();
					}
					break;
				case 3:
					{
					this.state = 1666;
					this.aggregerenOverBereik();
					}
					break;
				}
				this.state = 1669;
				this.match(RegelSpraakParser.DOT);
				}
				break;
			case 232:
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1671;
				this.match(RegelSpraakParser.VAN);
				this.state = 1672;
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
		this.enterRule(localctx, 262, RegelSpraakParser.RULE_aggregerenOverAlleDimensies);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1675;
			this.match(RegelSpraakParser.ALLE);
			this.state = 1676;
			this.naamwoord();
			this.state = 1679;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 193, this._ctx) ) {
			case 1:
				{
				this.state = 1677;
				_la = this._input.LA(1);
				if(!(_la===205 || _la===208)) {
				this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1678;
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
		this.enterRule(localctx, 264, RegelSpraakParser.RULE_aggregerenOverVerzameling);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1681;
			this.match(RegelSpraakParser.DE);
			this.state = 1682;
			this.naamwoord();
			this.state = 1683;
			this.match(RegelSpraakParser.VANAF);
			this.state = 1684;
			this.identifier();
			this.state = 1685;
			this.match(RegelSpraakParser.TM);
			this.state = 1686;
			this.identifier();
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
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
		this.enterRule(localctx, 266, RegelSpraakParser.RULE_aggregerenOverBereik);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1688;
			this.match(RegelSpraakParser.DE);
			this.state = 1689;
			this.naamwoord();
			this.state = 1690;
			this.match(RegelSpraakParser.IN);
			this.state = 1691;
			this.match(RegelSpraakParser.LBRACE);
			this.state = 1692;
			this.identifier();
			this.state = 1697;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===264) {
				{
				{
				this.state = 1693;
				this.match(RegelSpraakParser.COMMA);
				this.state = 1694;
				this.identifier();
				}
				}
				this.state = 1699;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1700;
			this.match(RegelSpraakParser.EN);
			this.state = 1701;
			this.identifier();
			this.state = 1702;
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
		this.enterRule(localctx, 268, RegelSpraakParser.RULE_unaryCondition);
		let _la: number;
		try {
			this.state = 1730;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 195, this._ctx) ) {
			case 1:
				localctx = new UnaryCheckConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1704;
				(localctx as UnaryCheckConditionContext)._expr = this.primaryExpression(0);
				this.state = 1705;
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
				this.state = 1707;
				(localctx as UnaryNumeriekExactConditionContext)._expr = this.primaryExpression(0);
				this.state = 1708;
				(localctx as UnaryNumeriekExactConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 83)) & ~0x1F) === 0 && ((1 << (_la - 83)) & 15) !== 0))) {
				    (localctx as UnaryNumeriekExactConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1709;
				this.match(RegelSpraakParser.NUMBER);
				this.state = 1710;
				this.match(RegelSpraakParser.CIJFERS);
				}
				break;
			case 3:
				localctx = new UnaryDagsoortConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1712;
				(localctx as UnaryDagsoortConditionContext)._expr = this.primaryExpression(0);
				this.state = 1713;
				(localctx as UnaryDagsoortConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 87)) & ~0x1F) === 0 && ((1 << (_la - 87)) & 15) !== 0))) {
				    (localctx as UnaryDagsoortConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1714;
				(localctx as UnaryDagsoortConditionContext)._dagsoort = this.identifier();
				}
				break;
			case 4:
				localctx = new UnaryKenmerkConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1716;
				(localctx as UnaryKenmerkConditionContext)._expr = this.primaryExpression(0);
				this.state = 1717;
				(localctx as UnaryKenmerkConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 71)) & ~0x1F) === 0 && ((1 << (_la - 71)) & 85) !== 0))) {
				    (localctx as UnaryKenmerkConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1718;
				(localctx as UnaryKenmerkConditionContext)._kenmerk = this.identifier();
				}
				break;
			case 5:
				localctx = new UnaryRolConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1720;
				(localctx as UnaryRolConditionContext)._expr = this.primaryExpression(0);
				this.state = 1721;
				(localctx as UnaryRolConditionContext)._op = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(((((_la - 72)) & ~0x1F) === 0 && ((1 << (_la - 72)) & 85) !== 0))) {
				    (localctx as UnaryRolConditionContext)._op = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1722;
				(localctx as UnaryRolConditionContext)._rol = this.identifier();
				}
				break;
			case 6:
				localctx = new UnaryUniekConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1724;
				(localctx as UnaryUniekConditionContext)._ref = this.onderwerpReferentie();
				this.state = 1725;
				this.match(RegelSpraakParser.MOETEN_UNIEK_ZIJN);
				}
				break;
			case 7:
				localctx = new UnaryInconsistentDataConditionContext(this, localctx);
				this.enterOuterAlt(localctx, 7);
				{
				this.state = 1727;
				(localctx as UnaryInconsistentDataConditionContext)._expr = this.primaryExpression(0);
				this.state = 1728;
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
		this.enterRule(localctx, 270, RegelSpraakParser.RULE_regelStatusCondition);
		let _la: number;
		try {
			localctx = new RegelStatusCheckContext(this, localctx);
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1732;
			this.match(RegelSpraakParser.REGEL);
			this.state = 1733;
			(localctx as RegelStatusCheckContext)._name = this.naamwoord();
			this.state = 1734;
			(localctx as RegelStatusCheckContext)._op = this._input.LT(1);
			_la = this._input.LA(1);
			if(!(_la===92 || _la===93)) {
			    (localctx as RegelStatusCheckContext)._op = this._errHandler.recoverInline(this);
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
	public subordinateClauseExpression(): SubordinateClauseExpressionContext {
		let localctx: SubordinateClauseExpressionContext = new SubordinateClauseExpressionContext(this, this._ctx, this.state);
		this.enterRule(localctx, 272, RegelSpraakParser.RULE_subordinateClauseExpression);
		try {
			this.state = 1748;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 196, this._ctx) ) {
			case 1:
				localctx = new SubordinateHasExprContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1736;
				(localctx as SubordinateHasExprContext)._subject = this.onderwerpReferentie();
				this.state = 1737;
				(localctx as SubordinateHasExprContext)._object = this.naamwoord();
				this.state = 1738;
				(localctx as SubordinateHasExprContext)._verb = this.match(RegelSpraakParser.HEEFT);
				}
				break;
			case 2:
				localctx = new SubordinateIsWithExprContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1740;
				(localctx as SubordinateIsWithExprContext)._subject = this.onderwerpReferentie();
				this.state = 1741;
				(localctx as SubordinateIsWithExprContext)._prepPhrase = this.naamwoord();
				this.state = 1742;
				(localctx as SubordinateIsWithExprContext)._verb = this.match(RegelSpraakParser.IS);
				}
				break;
			case 3:
				localctx = new SubordinateIsKenmerkExprContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1744;
				(localctx as SubordinateIsKenmerkExprContext)._subject = this.onderwerpReferentie();
				this.state = 1745;
				(localctx as SubordinateIsKenmerkExprContext)._verb = this.match(RegelSpraakParser.IS);
				this.state = 1746;
				(localctx as SubordinateIsKenmerkExprContext)._kenmerk = this.naamwoord();
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
		this.enterRule(localctx, 274, RegelSpraakParser.RULE_dagsoortDefinition);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1750;
			this.match(RegelSpraakParser.DAGSOORT);
			this.state = 1751;
			this.naamwoord();
			this.state = 1759;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===172) {
				{
				this.state = 1752;
				this.match(RegelSpraakParser.MV_START);
				this.state = 1754;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				do {
					{
					{
					this.state = 1753;
					localctx._IDENTIFIER = this.match(RegelSpraakParser.IDENTIFIER);
					localctx._plural.push(localctx._IDENTIFIER);
					}
					}
					this.state = 1756;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				} while (_la===253);
				this.state = 1758;
				this.match(RegelSpraakParser.RPAREN);
				}
			}

			this.state = 1762;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===267) {
				{
				this.state = 1761;
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
		this.enterRule(localctx, 276, RegelSpraakParser.RULE_verdelingResultaat);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1764;
			localctx._sourceAmount = this.expressie();
			this.state = 1765;
			this.match(RegelSpraakParser.WORDT_VERDEELD_OVER);
			this.state = 1766;
			localctx._targetCollection = this.expressie();
			this.state = 1767;
			this.match(RegelSpraakParser.COMMA);
			this.state = 1768;
			this.match(RegelSpraakParser.WAARBIJ_WORDT_VERDEELD);
			this.state = 1771;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 20:
			case 32:
			case 33:
			case 34:
			case 118:
			case 192:
				{
				this.state = 1769;
				this.verdelingMethodeSimple();
				}
				break;
			case 266:
				{
				this.state = 1770;
				this.verdelingMethodeMultiLine();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this.state = 1774;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===18) {
				{
				this.state = 1773;
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
		this.enterRule(localctx, 278, RegelSpraakParser.RULE_verdelingMethodeSimple);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1776;
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
		this.enterRule(localctx, 280, RegelSpraakParser.RULE_verdelingMethodeMultiLine);
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1778;
			this.match(RegelSpraakParser.COLON);
			this.state = 1779;
			this.verdelingMethodeBulletList();
			this.state = 1781;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 202, this._ctx) ) {
			case 1:
				{
				this.state = 1780;
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
		this.enterRule(localctx, 282, RegelSpraakParser.RULE_verdelingMethodeBulletList);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1783;
			this.verdelingMethodeBullet();
			this.state = 1787;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la===278) {
				{
				{
				this.state = 1784;
				this.verdelingMethodeBullet();
				}
				}
				this.state = 1789;
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
		this.enterRule(localctx, 284, RegelSpraakParser.RULE_verdelingMethodeBullet);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1790;
			this.match(RegelSpraakParser.MINUS);
			this.state = 1791;
			this.verdelingMethode();
			this.state = 1793;
			this._errHandler.sync(this);
			switch ( this._interp.adaptivePredict(this._input, 204, this._ctx) ) {
			case 1:
				{
				this.state = 1792;
				_la = this._input.LA(1);
				if(!(_la===264 || _la===265)) {
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
		this.enterRule(localctx, 286, RegelSpraakParser.RULE_verdelingMethode);
		let _la: number;
		try {
			this.state = 1809;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case 192:
				localctx = new VerdelingGelijkeDelenContext(this, localctx);
				this.enterOuterAlt(localctx, 1);
				{
				this.state = 1795;
				this.match(RegelSpraakParser.IN_GELIJKE_DELEN);
				}
				break;
			case 34:
				localctx = new VerdelingNaarRatoContext(this, localctx);
				this.enterOuterAlt(localctx, 2);
				{
				this.state = 1796;
				this.match(RegelSpraakParser.NAAR_RATO_VAN);
				this.state = 1797;
				(localctx as VerdelingNaarRatoContext)._ratioExpression = this.expressie();
				}
				break;
			case 33:
				localctx = new VerdelingOpVolgordeContext(this, localctx);
				this.enterOuterAlt(localctx, 3);
				{
				this.state = 1798;
				this.match(RegelSpraakParser.OP_VOLGORDE_VAN);
				this.state = 1799;
				(localctx as VerdelingOpVolgordeContext)._orderDirection = this._input.LT(1);
				_la = this._input.LA(1);
				if(!(_la===191 || _la===194)) {
				    (localctx as VerdelingOpVolgordeContext)._orderDirection = this._errHandler.recoverInline(this);
				}
				else {
					this._errHandler.reportMatch(this);
				    this.consume();
				}
				this.state = 1800;
				(localctx as VerdelingOpVolgordeContext)._orderExpression = this.expressie();
				}
				break;
			case 32:
				localctx = new VerdelingTieBreakContext(this, localctx);
				this.enterOuterAlt(localctx, 4);
				{
				this.state = 1801;
				this.match(RegelSpraakParser.BIJ_EVEN_GROOT_CRITERIUM);
				this.state = 1802;
				(localctx as VerdelingTieBreakContext)._tieBreakMethod = this.verdelingMethode();
				}
				break;
			case 20:
				localctx = new VerdelingMaximumContext(this, localctx);
				this.enterOuterAlt(localctx, 5);
				{
				this.state = 1803;
				this.match(RegelSpraakParser.MET_EEN_MAXIMUM_VAN);
				this.state = 1804;
				(localctx as VerdelingMaximumContext)._maxExpression = this.expressie();
				}
				break;
			case 118:
				localctx = new VerdelingAfrondingContext(this, localctx);
				this.enterOuterAlt(localctx, 6);
				{
				this.state = 1805;
				this.match(RegelSpraakParser.AFGEROND_OP);
				this.state = 1806;
				(localctx as VerdelingAfrondingContext)._decimals = this.match(RegelSpraakParser.NUMBER);
				this.state = 1807;
				this.match(RegelSpraakParser.DECIMALEN);
				this.state = 1808;
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
		this.enterRule(localctx, 288, RegelSpraakParser.RULE_verdelingRest);
		let _la: number;
		try {
			this.enterOuterAlt(localctx, 1);
			{
			this.state = 1811;
			this.match(RegelSpraakParser.ALS_ONVERDEELDE_REST_BLIJFT);
			this.state = 1812;
			localctx._remainderTarget = this.expressie();
			this.state = 1814;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la===193) {
				{
				this.state = 1813;
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
		case 119:
			return this.primaryExpression_sempred(localctx as PrimaryExpressionContext, predIndex);
		}
		return true;
	}
	private primaryExpression_sempred(localctx: PrimaryExpressionContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 36);
		case 1:
			return this.precpred(this._ctx, 39);
		case 2:
			return this.precpred(this._ctx, 38);
		case 3:
			return this.precpred(this._ctx, 24);
		}
		return true;
	}

	public static readonly _serializedATN: number[] = [4,1,282,1817,2,0,7,0,
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
	7,139,2,140,7,140,2,141,7,141,2,142,7,142,2,143,7,143,2,144,7,144,1,0,1,
	0,1,0,1,0,1,0,1,0,5,0,297,8,0,10,0,12,0,300,9,0,1,0,1,0,1,1,1,1,1,1,1,1,
	1,1,1,1,3,1,310,8,1,1,2,1,2,1,2,3,2,315,8,2,1,2,1,2,1,3,1,3,1,3,4,3,322,
	8,3,11,3,12,3,323,1,4,1,4,3,4,328,8,4,1,4,1,4,1,4,1,4,1,4,5,4,335,8,4,10,
	4,12,4,338,9,4,1,4,3,4,341,8,4,1,5,3,5,344,8,5,1,5,4,5,347,8,5,11,5,12,
	5,348,1,5,3,5,352,8,5,4,5,354,8,5,11,5,12,5,355,1,5,5,5,359,8,5,10,5,12,
	5,362,9,5,1,6,1,6,1,6,1,6,1,6,1,6,1,6,1,6,5,6,372,8,6,10,6,12,6,375,9,6,
	1,6,3,6,378,8,6,1,7,1,7,3,7,382,8,7,1,8,4,8,385,8,8,11,8,12,8,386,1,9,1,
	9,1,10,1,10,1,11,1,11,1,12,3,12,396,8,12,1,12,4,12,399,8,12,11,12,12,12,
	400,1,12,4,12,404,8,12,11,12,12,12,405,1,12,1,12,4,12,410,8,12,11,12,12,
	12,411,1,12,1,12,4,12,416,8,12,11,12,12,12,417,1,12,1,12,4,12,422,8,12,
	11,12,12,12,423,1,12,4,12,427,8,12,11,12,12,12,428,1,12,1,12,4,12,433,8,
	12,11,12,12,12,434,1,12,1,12,4,12,439,8,12,11,12,12,12,440,1,12,1,12,1,
	12,1,12,1,12,4,12,448,8,12,11,12,12,12,449,3,12,452,8,12,1,13,3,13,455,
	8,13,1,13,4,13,458,8,13,11,13,12,13,459,1,13,4,13,463,8,13,11,13,12,13,
	464,1,13,1,13,4,13,469,8,13,11,13,12,13,470,1,13,1,13,4,13,475,8,13,11,
	13,12,13,476,1,13,1,13,4,13,481,8,13,11,13,12,13,482,1,13,4,13,486,8,13,
	11,13,12,13,487,1,13,1,13,4,13,492,8,13,11,13,12,13,493,1,13,1,13,4,13,
	498,8,13,11,13,12,13,499,3,13,502,8,13,1,14,1,14,1,14,1,14,5,14,508,8,14,
	10,14,12,14,511,9,14,1,15,1,15,1,15,1,15,5,15,517,8,15,10,15,12,15,520,
	9,15,1,16,1,16,1,17,1,17,1,18,1,18,1,19,1,19,1,19,1,19,4,19,532,8,19,11,
	19,12,19,533,1,19,3,19,537,8,19,1,19,3,19,540,8,19,1,19,5,19,543,8,19,10,
	19,12,19,546,9,19,1,20,1,20,3,20,550,8,20,1,20,1,20,1,21,3,21,555,8,21,
	1,21,1,21,3,21,559,8,21,1,21,1,21,3,21,563,8,21,1,22,1,22,1,22,3,22,568,
	8,22,1,22,1,22,1,22,1,22,1,22,3,22,575,8,22,3,22,577,8,22,1,22,1,22,1,22,
	1,22,5,22,583,8,22,10,22,12,22,586,9,22,3,22,588,8,22,1,22,3,22,591,8,22,
	1,23,1,23,1,23,1,23,1,23,3,23,598,8,23,1,24,1,24,1,24,1,24,1,25,1,25,1,
	25,1,25,1,25,3,25,609,8,25,1,26,1,26,1,27,1,27,1,28,1,28,1,29,3,29,618,
	8,29,1,29,1,29,1,29,1,29,1,29,1,29,3,29,626,8,29,1,30,1,30,1,30,1,30,1,
	30,1,30,3,30,634,8,30,1,30,3,30,637,8,30,1,31,1,31,1,31,1,31,1,31,3,31,
	644,8,31,1,32,1,32,4,32,648,8,32,11,32,12,32,649,1,33,1,33,1,34,1,34,1,
	34,5,34,657,8,34,10,34,12,34,660,9,34,1,35,1,35,1,35,1,35,1,35,1,35,3,35,
	668,8,35,1,36,1,36,1,37,1,37,1,37,3,37,675,8,37,1,37,1,37,1,37,1,37,3,37,
	681,8,37,1,38,1,38,1,38,3,38,686,8,38,1,39,1,39,1,39,3,39,691,8,39,1,39,
	1,39,1,39,1,39,4,39,697,8,39,11,39,12,39,698,1,40,1,40,1,40,1,40,3,40,705,
	8,40,1,40,3,40,708,8,40,1,41,1,41,1,41,1,41,1,42,1,42,1,43,1,43,1,44,1,
	44,1,44,1,44,1,44,3,44,723,8,44,1,44,1,44,3,44,727,8,44,1,44,3,44,730,8,
	44,1,44,1,44,1,45,3,45,735,8,45,1,45,4,45,738,8,45,11,45,12,45,739,1,46,
	1,46,1,47,1,47,1,47,1,47,4,47,748,8,47,11,47,12,47,749,1,47,1,47,1,47,1,
	47,1,47,1,47,1,47,3,47,759,8,47,1,48,1,48,1,48,1,48,1,48,1,48,3,48,767,
	8,48,1,48,3,48,770,8,48,1,49,4,49,773,8,49,11,49,12,49,774,1,50,1,50,4,
	50,779,8,50,11,50,12,50,780,1,51,4,51,784,8,51,11,51,12,51,785,1,52,1,52,
	1,53,1,53,1,53,3,53,793,8,53,1,53,1,53,1,53,1,53,3,53,799,8,53,1,53,3,53,
	802,8,53,1,53,3,53,805,8,53,1,54,1,54,1,54,3,54,810,8,54,1,54,1,54,4,54,
	814,8,54,11,54,12,54,815,1,55,1,55,4,55,820,8,55,11,55,12,55,821,1,55,1,
	55,4,55,826,8,55,11,55,12,55,827,1,55,1,55,4,55,832,8,55,11,55,12,55,833,
	1,55,1,55,1,55,4,55,839,8,55,11,55,12,55,840,1,55,1,55,1,55,4,55,846,8,
	55,11,55,12,55,847,1,55,1,55,4,55,852,8,55,11,55,12,55,853,1,55,4,55,857,
	8,55,11,55,12,55,858,1,55,1,55,4,55,863,8,55,11,55,12,55,864,1,55,4,55,
	868,8,55,11,55,12,55,869,3,55,872,8,55,1,56,1,56,1,56,1,57,1,57,1,57,1,
	57,1,57,3,57,882,8,57,3,57,884,8,57,1,58,1,58,1,58,1,58,1,58,1,58,1,58,
	1,58,1,58,1,58,1,58,1,58,3,58,898,8,58,1,58,3,58,901,8,58,1,58,1,58,1,58,
	1,58,1,58,3,58,908,8,58,1,58,1,58,3,58,912,8,58,1,59,1,59,1,59,1,59,1,59,
	1,59,1,59,1,59,1,59,1,59,1,59,1,59,1,60,4,60,927,8,60,11,60,12,60,928,1,
	61,4,61,932,8,61,11,61,12,61,933,1,62,1,62,1,62,1,62,1,62,3,62,941,8,62,
	1,63,1,63,3,63,945,8,63,1,64,1,64,1,65,1,65,1,65,1,65,3,65,953,8,65,1,65,
	3,65,956,8,65,1,65,1,65,1,65,1,65,1,65,3,65,963,8,65,1,65,3,65,966,8,65,
	3,65,968,8,65,1,66,1,66,1,66,1,66,5,66,974,8,66,10,66,12,66,977,9,66,1,
	67,1,67,1,67,1,67,1,68,1,68,1,69,1,69,1,69,1,69,1,69,1,69,3,69,991,8,69,
	1,69,3,69,994,8,69,3,69,996,8,69,1,70,1,70,1,70,3,70,1001,8,70,1,71,1,71,
	1,71,1,71,1,71,1,71,1,72,3,72,1010,8,72,1,72,1,72,1,72,1,73,1,73,1,73,3,
	73,1018,8,73,1,74,1,74,1,74,1,74,1,74,1,74,4,74,1026,8,74,11,74,12,74,1027,
	1,74,1,74,1,74,1,74,3,74,1034,8,74,1,74,1,74,1,74,1,74,1,74,1,74,4,74,1042,
	8,74,11,74,12,74,1043,1,74,1,74,1,74,1,74,3,74,1050,8,74,1,74,1,74,1,74,
	1,74,1,74,1,74,4,74,1058,8,74,11,74,12,74,1059,3,74,1062,8,74,1,75,1,75,
	1,75,1,75,1,75,1,75,1,75,1,75,1,75,1,75,1,75,1,75,1,75,1,75,3,75,1078,8,
	75,1,76,1,76,1,76,3,76,1083,8,76,1,77,4,77,1086,8,77,11,77,12,77,1087,1,
	78,1,78,1,79,1,79,1,79,3,79,1095,8,79,1,79,1,79,1,79,1,79,1,79,1,79,4,79,
	1103,8,79,11,79,12,79,1104,1,80,1,80,1,80,3,80,1110,8,80,1,81,1,81,1,81,
	1,81,5,81,1116,8,81,10,81,12,81,1119,9,81,1,82,3,82,1122,8,82,1,82,4,82,
	1125,8,82,11,82,12,82,1126,1,82,3,82,1130,8,82,1,83,1,83,1,83,1,83,1,84,
	1,84,1,85,1,85,1,86,1,86,1,86,1,87,1,87,3,87,1145,8,87,1,88,1,88,1,88,1,
	88,1,88,3,88,1152,8,88,1,89,1,89,1,90,3,90,1157,8,90,1,90,1,90,3,90,1161,
	8,90,1,90,1,90,1,91,1,91,1,92,3,92,1168,8,92,1,92,1,92,1,92,1,92,1,92,1,
	93,1,93,1,93,1,94,1,94,1,94,1,95,1,95,1,95,1,96,1,96,1,96,1,96,1,96,1,96,
	1,96,4,96,1191,8,96,11,96,12,96,1192,1,97,1,97,1,97,1,97,1,97,1,97,3,97,
	1201,8,97,1,98,1,98,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,99,1,
	99,3,99,1216,8,99,1,100,1,100,1,100,1,100,3,100,1222,8,100,1,100,1,100,
	1,100,1,100,1,100,1,100,4,100,1230,8,100,11,100,12,100,1231,1,101,1,101,
	1,102,1,102,1,103,1,103,1,104,1,104,1,105,1,105,1,106,1,106,1,107,1,107,
	5,107,1248,8,107,10,107,12,107,1251,9,107,1,107,1,107,1,108,1,108,1,108,
	1,108,3,108,1259,8,108,1,109,1,109,1,110,1,110,1,110,3,110,1266,8,110,1,
	111,1,111,1,111,1,111,1,111,1,111,1,111,1,111,1,111,1,111,1,111,1,111,1,
	111,3,111,1281,8,111,1,111,1,111,3,111,1285,8,111,1,112,1,112,1,113,1,113,
	1,113,1,113,5,113,1293,8,113,10,113,12,113,1296,9,113,1,114,1,114,1,115,
	1,115,1,115,1,115,5,115,1304,8,115,10,115,12,115,1307,9,115,1,116,1,116,
	1,117,1,117,1,117,1,117,5,117,1315,8,117,10,117,12,117,1318,9,117,1,118,
	1,118,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,
	1,119,1,119,3,119,1335,8,119,1,119,1,119,1,119,1,119,1,119,1,119,3,119,
	1343,8,119,1,119,1,119,1,119,1,119,5,119,1349,8,119,10,119,12,119,1352,
	9,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,3,119,
	1364,8,119,1,119,1,119,3,119,1368,8,119,1,119,1,119,3,119,1372,8,119,1,
	119,1,119,1,119,1,119,1,119,3,119,1379,8,119,1,119,1,119,1,119,1,119,1,
	119,1,119,5,119,1387,8,119,10,119,12,119,1390,9,119,1,119,1,119,1,119,1,
	119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,5,119,1406,
	8,119,10,119,12,119,1409,9,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,
	1,119,1,119,1,119,5,119,1421,8,119,10,119,12,119,1424,9,119,1,119,1,119,
	1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,
	1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,
	1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,5,119,1462,
	8,119,10,119,12,119,1465,9,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,
	5,119,1474,8,119,10,119,12,119,1477,9,119,1,119,1,119,1,119,1,119,1,119,
	1,119,3,119,1485,8,119,1,119,1,119,1,119,1,119,1,119,3,119,1492,8,119,1,
	119,1,119,3,119,1496,8,119,1,119,3,119,1499,8,119,1,119,1,119,1,119,4,119,
	1504,8,119,11,119,12,119,1505,1,119,1,119,1,119,3,119,1511,8,119,1,119,
	1,119,1,119,1,119,1,119,3,119,1518,8,119,1,119,4,119,1521,8,119,11,119,
	12,119,1522,1,119,1,119,1,119,1,119,1,119,3,119,1530,8,119,1,119,1,119,
	3,119,1534,8,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,
	1,119,1,119,1,119,3,119,1548,8,119,1,119,1,119,1,119,1,119,1,119,1,119,
	1,119,1,119,1,119,1,119,3,119,1560,8,119,1,119,1,119,1,119,4,119,1565,8,
	119,11,119,12,119,1566,1,119,1,119,1,119,1,119,1,119,1,119,1,119,1,119,
	1,119,1,119,1,119,1,119,1,119,5,119,1582,8,119,10,119,12,119,1585,9,119,
	1,120,1,120,1,120,1,120,1,120,1,121,1,121,1,121,1,121,1,121,1,121,3,121,
	1598,8,121,1,122,1,122,1,122,1,123,1,123,1,123,1,124,1,124,1,124,3,124,
	1609,8,124,1,125,1,125,1,125,1,125,1,125,1,125,1,125,1,125,1,125,1,125,
	1,125,1,125,1,125,1,125,1,125,1,125,3,125,1627,8,125,1,126,1,126,1,126,
	1,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,1,126,
	1,126,3,126,1645,8,126,1,127,1,127,1,127,1,127,3,127,1651,8,127,1,128,3,
	128,1654,8,128,1,128,1,128,1,128,1,128,3,128,1660,8,128,1,129,1,129,1,130,
	1,130,1,130,1,130,3,130,1668,8,130,1,130,1,130,1,130,1,130,3,130,1674,8,
	130,1,131,1,131,1,131,1,131,3,131,1680,8,131,1,132,1,132,1,132,1,132,1,
	132,1,132,1,132,1,133,1,133,1,133,1,133,1,133,1,133,1,133,5,133,1696,8,
	133,10,133,12,133,1699,9,133,1,133,1,133,1,133,1,133,1,134,1,134,1,134,
	1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,
	1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,1,134,3,134,
	1731,8,134,1,135,1,135,1,135,1,135,1,136,1,136,1,136,1,136,1,136,1,136,
	1,136,1,136,1,136,1,136,1,136,1,136,3,136,1749,8,136,1,137,1,137,1,137,
	1,137,4,137,1755,8,137,11,137,12,137,1756,1,137,3,137,1760,8,137,1,137,
	3,137,1763,8,137,1,138,1,138,1,138,1,138,1,138,1,138,1,138,3,138,1772,8,
	138,1,138,3,138,1775,8,138,1,139,1,139,1,140,1,140,1,140,3,140,1782,8,140,
	1,141,1,141,5,141,1786,8,141,10,141,12,141,1789,9,141,1,142,1,142,1,142,
	3,142,1794,8,142,1,143,1,143,1,143,1,143,1,143,1,143,1,143,1,143,1,143,
	1,143,1,143,1,143,1,143,1,143,3,143,1810,8,143,1,144,1,144,1,144,3,144,
	1815,8,144,1,144,0,1,238,145,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,
	32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70,72,74,76,78,
	80,82,84,86,88,90,92,94,96,98,100,102,104,106,108,110,112,114,116,118,120,
	122,124,126,128,130,132,134,136,138,140,142,144,146,148,150,152,154,156,
	158,160,162,164,166,168,170,172,174,176,178,180,182,184,186,188,190,192,
	194,196,198,200,202,204,206,208,210,212,214,216,218,220,222,224,226,228,
	230,232,234,236,238,240,242,244,246,248,250,252,254,256,258,260,262,264,
	266,268,270,272,274,276,278,280,282,284,286,288,0,49,1,0,279,279,12,0,95,
	95,109,109,112,112,119,119,127,127,155,155,184,184,203,204,215,217,224,
	224,240,240,253,253,11,0,95,95,109,109,119,119,127,127,155,155,184,184,
	203,204,215,217,224,224,240,240,253,253,4,0,116,116,206,206,209,209,211,
	211,9,0,140,140,170,170,202,202,210,210,214,214,222,223,230,230,232,232,
	236,236,1,0,157,158,2,0,3,3,162,162,2,0,173,174,177,177,9,0,132,132,203,
	204,215,215,217,217,219,219,228,228,231,231,238,238,240,253,1,0,181,183,
	2,0,206,206,211,211,2,0,184,184,253,253,5,0,27,27,94,95,97,99,101,105,267,
	267,2,0,142,142,229,229,2,0,109,109,112,112,3,0,206,206,209,209,211,211,
	8,0,140,140,170,170,202,202,210,210,214,214,222,223,230,230,236,236,3,0,
	206,206,211,211,239,239,1,0,233,234,1,0,151,152,4,0,195,196,199,200,209,
	209,254,254,3,0,270,271,275,275,278,278,2,0,205,205,208,208,5,0,116,116,
	119,119,206,206,209,209,211,211,2,0,108,108,116,116,1,0,155,156,1,0,147,
	148,2,0,112,112,116,116,1,0,53,58,1,0,53,54,2,0,53,54,63,66,2,0,210,210,
	220,220,10,0,21,24,37,38,46,66,112,112,120,120,123,123,126,126,128,129,
	135,136,214,214,3,0,132,132,137,137,146,146,2,0,121,122,131,131,2,0,141,
	141,274,274,2,0,215,215,217,217,2,0,132,132,137,137,3,0,133,134,138,139,
	149,149,2,0,185,185,187,187,2,0,67,70,79,82,1,0,83,86,1,0,87,90,4,0,71,
	71,73,73,75,75,77,77,4,0,72,72,74,74,76,76,78,78,1,0,92,93,1,0,264,265,
	2,0,191,191,194,194,1,0,133,134,2009,0,298,1,0,0,0,2,309,1,0,0,0,4,311,
	1,0,0,0,6,318,1,0,0,0,8,325,1,0,0,0,10,343,1,0,0,0,12,363,1,0,0,0,14,381,
	1,0,0,0,16,384,1,0,0,0,18,388,1,0,0,0,20,390,1,0,0,0,22,392,1,0,0,0,24,
	451,1,0,0,0,26,501,1,0,0,0,28,503,1,0,0,0,30,512,1,0,0,0,32,521,1,0,0,0,
	34,523,1,0,0,0,36,525,1,0,0,0,38,527,1,0,0,0,40,549,1,0,0,0,42,558,1,0,
	0,0,44,564,1,0,0,0,46,597,1,0,0,0,48,599,1,0,0,0,50,603,1,0,0,0,52,610,
	1,0,0,0,54,612,1,0,0,0,56,614,1,0,0,0,58,617,1,0,0,0,60,627,1,0,0,0,62,
	643,1,0,0,0,64,645,1,0,0,0,66,651,1,0,0,0,68,653,1,0,0,0,70,661,1,0,0,0,
	72,669,1,0,0,0,74,680,1,0,0,0,76,682,1,0,0,0,78,687,1,0,0,0,80,707,1,0,
	0,0,82,709,1,0,0,0,84,713,1,0,0,0,86,715,1,0,0,0,88,717,1,0,0,0,90,734,
	1,0,0,0,92,741,1,0,0,0,94,758,1,0,0,0,96,760,1,0,0,0,98,772,1,0,0,0,100,
	778,1,0,0,0,102,783,1,0,0,0,104,787,1,0,0,0,106,789,1,0,0,0,108,806,1,0,
	0,0,110,871,1,0,0,0,112,873,1,0,0,0,114,883,1,0,0,0,116,911,1,0,0,0,118,
	913,1,0,0,0,120,926,1,0,0,0,122,931,1,0,0,0,124,940,1,0,0,0,126,944,1,0,
	0,0,128,946,1,0,0,0,130,967,1,0,0,0,132,969,1,0,0,0,134,978,1,0,0,0,136,
	982,1,0,0,0,138,984,1,0,0,0,140,997,1,0,0,0,142,1002,1,0,0,0,144,1009,1,
	0,0,0,146,1014,1,0,0,0,148,1061,1,0,0,0,150,1077,1,0,0,0,152,1079,1,0,0,
	0,154,1085,1,0,0,0,156,1089,1,0,0,0,158,1094,1,0,0,0,160,1106,1,0,0,0,162,
	1111,1,0,0,0,164,1129,1,0,0,0,166,1131,1,0,0,0,168,1135,1,0,0,0,170,1137,
	1,0,0,0,172,1139,1,0,0,0,174,1144,1,0,0,0,176,1151,1,0,0,0,178,1153,1,0,
	0,0,180,1156,1,0,0,0,182,1164,1,0,0,0,184,1167,1,0,0,0,186,1174,1,0,0,0,
	188,1177,1,0,0,0,190,1180,1,0,0,0,192,1183,1,0,0,0,194,1200,1,0,0,0,196,
	1202,1,0,0,0,198,1215,1,0,0,0,200,1221,1,0,0,0,202,1233,1,0,0,0,204,1235,
	1,0,0,0,206,1237,1,0,0,0,208,1239,1,0,0,0,210,1241,1,0,0,0,212,1243,1,0,
	0,0,214,1245,1,0,0,0,216,1254,1,0,0,0,218,1260,1,0,0,0,220,1262,1,0,0,0,
	222,1284,1,0,0,0,224,1286,1,0,0,0,226,1288,1,0,0,0,228,1297,1,0,0,0,230,
	1299,1,0,0,0,232,1308,1,0,0,0,234,1310,1,0,0,0,236,1319,1,0,0,0,238,1559,
	1,0,0,0,240,1586,1,0,0,0,242,1597,1,0,0,0,244,1599,1,0,0,0,246,1602,1,0,
	0,0,248,1608,1,0,0,0,250,1626,1,0,0,0,252,1644,1,0,0,0,254,1650,1,0,0,0,
	256,1659,1,0,0,0,258,1661,1,0,0,0,260,1673,1,0,0,0,262,1675,1,0,0,0,264,
	1681,1,0,0,0,266,1688,1,0,0,0,268,1730,1,0,0,0,270,1732,1,0,0,0,272,1748,
	1,0,0,0,274,1750,1,0,0,0,276,1764,1,0,0,0,278,1776,1,0,0,0,280,1778,1,0,
	0,0,282,1783,1,0,0,0,284,1790,1,0,0,0,286,1809,1,0,0,0,288,1811,1,0,0,0,
	290,297,3,2,1,0,291,297,3,106,53,0,292,297,3,108,54,0,293,297,3,4,2,0,294,
	297,3,138,69,0,295,297,3,68,34,0,296,290,1,0,0,0,296,291,1,0,0,0,296,292,
	1,0,0,0,296,293,1,0,0,0,296,294,1,0,0,0,296,295,1,0,0,0,297,300,1,0,0,0,
	298,296,1,0,0,0,298,299,1,0,0,0,299,301,1,0,0,0,300,298,1,0,0,0,301,302,
	5,0,0,1,302,1,1,0,0,0,303,310,3,38,19,0,304,310,3,60,30,0,305,310,3,88,
	44,0,306,310,3,78,39,0,307,310,3,94,47,0,308,310,3,274,137,0,309,303,1,
	0,0,0,309,304,1,0,0,0,309,305,1,0,0,0,309,306,1,0,0,0,309,307,1,0,0,0,309,
	308,1,0,0,0,310,3,1,0,0,0,311,312,5,97,0,0,312,314,3,28,14,0,313,315,3,
	112,56,0,314,313,1,0,0,0,314,315,1,0,0,0,315,316,1,0,0,0,316,317,3,6,3,
	0,317,5,1,0,0,0,318,319,3,8,4,0,319,321,3,10,5,0,320,322,3,12,6,0,321,320,
	1,0,0,0,322,323,1,0,0,0,323,321,1,0,0,0,323,324,1,0,0,0,324,7,1,0,0,0,325,
	327,5,279,0,0,326,328,5,279,0,0,327,326,1,0,0,0,327,328,1,0,0,0,328,329,
	1,0,0,0,329,330,3,16,8,0,330,331,5,279,0,0,331,336,3,16,8,0,332,333,5,279,
	0,0,333,335,3,16,8,0,334,332,1,0,0,0,335,338,1,0,0,0,336,334,1,0,0,0,336,
	337,1,0,0,0,337,340,1,0,0,0,338,336,1,0,0,0,339,341,5,279,0,0,340,339,1,
	0,0,0,340,341,1,0,0,0,341,9,1,0,0,0,342,344,5,279,0,0,343,342,1,0,0,0,343,
	344,1,0,0,0,344,353,1,0,0,0,345,347,5,278,0,0,346,345,1,0,0,0,347,348,1,
	0,0,0,348,346,1,0,0,0,348,349,1,0,0,0,349,351,1,0,0,0,350,352,5,279,0,0,
	351,350,1,0,0,0,351,352,1,0,0,0,352,354,1,0,0,0,353,346,1,0,0,0,354,355,
	1,0,0,0,355,353,1,0,0,0,355,356,1,0,0,0,356,360,1,0,0,0,357,359,5,278,0,
	0,358,357,1,0,0,0,359,362,1,0,0,0,360,358,1,0,0,0,360,361,1,0,0,0,361,11,
	1,0,0,0,362,360,1,0,0,0,363,364,5,279,0,0,364,365,5,254,0,0,365,366,5,279,
	0,0,366,367,3,218,109,0,367,368,5,279,0,0,368,373,3,14,7,0,369,370,5,279,
	0,0,370,372,3,14,7,0,371,369,1,0,0,0,372,375,1,0,0,0,373,371,1,0,0,0,373,
	374,1,0,0,0,374,377,1,0,0,0,375,373,1,0,0,0,376,378,5,279,0,0,377,376,1,
	0,0,0,377,378,1,0,0,0,378,13,1,0,0,0,379,382,3,218,109,0,380,382,5,280,
	0,0,381,379,1,0,0,0,381,380,1,0,0,0,382,15,1,0,0,0,383,385,8,0,0,0,384,
	383,1,0,0,0,385,386,1,0,0,0,386,384,1,0,0,0,386,387,1,0,0,0,387,17,1,0,
	0,0,388,389,5,253,0,0,389,19,1,0,0,0,390,391,7,1,0,0,391,21,1,0,0,0,392,
	393,7,2,0,0,393,23,1,0,0,0,394,396,7,3,0,0,395,394,1,0,0,0,395,396,1,0,
	0,0,396,398,1,0,0,0,397,399,3,20,10,0,398,397,1,0,0,0,399,400,1,0,0,0,400,
	398,1,0,0,0,400,401,1,0,0,0,401,452,1,0,0,0,402,404,3,20,10,0,403,402,1,
	0,0,0,404,405,1,0,0,0,405,403,1,0,0,0,405,406,1,0,0,0,406,452,1,0,0,0,407,
	409,5,44,0,0,408,410,3,20,10,0,409,408,1,0,0,0,410,411,1,0,0,0,411,409,
	1,0,0,0,411,412,1,0,0,0,412,452,1,0,0,0,413,415,5,44,0,0,414,416,3,20,10,
	0,415,414,1,0,0,0,416,417,1,0,0,0,417,415,1,0,0,0,417,418,1,0,0,0,418,419,
	1,0,0,0,419,421,5,170,0,0,420,422,3,20,10,0,421,420,1,0,0,0,422,423,1,0,
	0,0,423,421,1,0,0,0,423,424,1,0,0,0,424,452,1,0,0,0,425,427,3,20,10,0,426,
	425,1,0,0,0,427,428,1,0,0,0,428,426,1,0,0,0,428,429,1,0,0,0,429,430,1,0,
	0,0,430,432,5,170,0,0,431,433,3,20,10,0,432,431,1,0,0,0,433,434,1,0,0,0,
	434,432,1,0,0,0,434,435,1,0,0,0,435,452,1,0,0,0,436,438,5,135,0,0,437,439,
	3,20,10,0,438,437,1,0,0,0,439,440,1,0,0,0,440,438,1,0,0,0,440,441,1,0,0,
	0,441,452,1,0,0,0,442,443,5,211,0,0,443,444,5,184,0,0,444,445,5,204,0,0,
	445,447,5,214,0,0,446,448,3,20,10,0,447,446,1,0,0,0,448,449,1,0,0,0,449,
	447,1,0,0,0,449,450,1,0,0,0,450,452,1,0,0,0,451,395,1,0,0,0,451,403,1,0,
	0,0,451,407,1,0,0,0,451,413,1,0,0,0,451,426,1,0,0,0,451,436,1,0,0,0,451,
	442,1,0,0,0,452,25,1,0,0,0,453,455,7,3,0,0,454,453,1,0,0,0,454,455,1,0,
	0,0,455,457,1,0,0,0,456,458,3,22,11,0,457,456,1,0,0,0,458,459,1,0,0,0,459,
	457,1,0,0,0,459,460,1,0,0,0,460,502,1,0,0,0,461,463,3,22,11,0,462,461,1,
	0,0,0,463,464,1,0,0,0,464,462,1,0,0,0,464,465,1,0,0,0,465,502,1,0,0,0,466,
	468,5,44,0,0,467,469,3,22,11,0,468,467,1,0,0,0,469,470,1,0,0,0,470,468,
	1,0,0,0,470,471,1,0,0,0,471,502,1,0,0,0,472,474,5,44,0,0,473,475,3,22,11,
	0,474,473,1,0,0,0,475,476,1,0,0,0,476,474,1,0,0,0,476,477,1,0,0,0,477,478,
	1,0,0,0,478,480,5,170,0,0,479,481,3,22,11,0,480,479,1,0,0,0,481,482,1,0,
	0,0,482,480,1,0,0,0,482,483,1,0,0,0,483,502,1,0,0,0,484,486,3,22,11,0,485,
	484,1,0,0,0,486,487,1,0,0,0,487,485,1,0,0,0,487,488,1,0,0,0,488,489,1,0,
	0,0,489,491,5,170,0,0,490,492,3,22,11,0,491,490,1,0,0,0,492,493,1,0,0,0,
	493,491,1,0,0,0,493,494,1,0,0,0,494,502,1,0,0,0,495,497,5,135,0,0,496,498,
	3,22,11,0,497,496,1,0,0,0,498,499,1,0,0,0,499,497,1,0,0,0,499,500,1,0,0,
	0,500,502,1,0,0,0,501,454,1,0,0,0,501,462,1,0,0,0,501,466,1,0,0,0,501,472,
	1,0,0,0,501,485,1,0,0,0,501,495,1,0,0,0,502,27,1,0,0,0,503,509,3,24,12,
	0,504,505,3,32,16,0,505,506,3,24,12,0,506,508,1,0,0,0,507,504,1,0,0,0,508,
	511,1,0,0,0,509,507,1,0,0,0,509,510,1,0,0,0,510,29,1,0,0,0,511,509,1,0,
	0,0,512,518,3,26,13,0,513,514,3,32,16,0,514,515,3,26,13,0,515,517,1,0,0,
	0,516,513,1,0,0,0,517,520,1,0,0,0,518,516,1,0,0,0,518,519,1,0,0,0,519,31,
	1,0,0,0,520,518,1,0,0,0,521,522,7,4,0,0,522,33,1,0,0,0,523,524,5,256,0,
	0,524,35,1,0,0,0,525,526,5,253,0,0,526,37,1,0,0,0,527,528,5,98,0,0,528,
	536,3,30,15,0,529,531,5,172,0,0,530,532,5,253,0,0,531,530,1,0,0,0,532,533,
	1,0,0,0,533,531,1,0,0,0,533,534,1,0,0,0,534,535,1,0,0,0,535,537,5,261,0,
	0,536,529,1,0,0,0,536,537,1,0,0,0,537,539,1,0,0,0,538,540,5,159,0,0,539,
	538,1,0,0,0,539,540,1,0,0,0,540,544,1,0,0,0,541,543,3,40,20,0,542,541,1,
	0,0,0,543,546,1,0,0,0,544,542,1,0,0,0,544,545,1,0,0,0,545,39,1,0,0,0,546,
	544,1,0,0,0,547,550,3,42,21,0,548,550,3,44,22,0,549,547,1,0,0,0,549,548,
	1,0,0,0,550,551,1,0,0,0,551,552,5,267,0,0,552,41,1,0,0,0,553,555,5,112,
	0,0,554,553,1,0,0,0,554,555,1,0,0,0,555,556,1,0,0,0,556,559,3,18,9,0,557,
	559,3,28,14,0,558,554,1,0,0,0,558,557,1,0,0,0,559,560,1,0,0,0,560,562,5,
	168,0,0,561,563,7,5,0,0,562,561,1,0,0,0,562,563,1,0,0,0,563,43,1,0,0,0,
	564,567,3,28,14,0,565,568,3,46,23,0,566,568,3,66,33,0,567,565,1,0,0,0,567,
	566,1,0,0,0,568,576,1,0,0,0,569,574,5,171,0,0,570,575,5,253,0,0,571,575,
	5,269,0,0,572,575,5,251,0,0,573,575,5,252,0,0,574,570,1,0,0,0,574,571,1,
	0,0,0,574,572,1,0,0,0,574,573,1,0,0,0,575,577,1,0,0,0,576,569,1,0,0,0,576,
	577,1,0,0,0,577,587,1,0,0,0,578,579,5,165,0,0,579,584,3,86,43,0,580,581,
	5,210,0,0,581,583,3,86,43,0,582,580,1,0,0,0,583,586,1,0,0,0,584,582,1,0,
	0,0,584,585,1,0,0,0,585,588,1,0,0,0,586,584,1,0,0,0,587,578,1,0,0,0,587,
	588,1,0,0,0,588,590,1,0,0,0,589,591,3,84,42,0,590,589,1,0,0,0,590,591,1,
	0,0,0,591,45,1,0,0,0,592,598,3,50,25,0,593,598,3,52,26,0,594,598,3,54,27,
	0,595,598,3,56,28,0,596,598,3,48,24,0,597,592,1,0,0,0,597,593,1,0,0,0,597,
	594,1,0,0,0,597,595,1,0,0,0,597,596,1,0,0,0,598,47,1,0,0,0,599,600,5,100,
	0,0,600,601,5,232,0,0,601,602,3,46,23,0,602,49,1,0,0,0,603,608,5,175,0,
	0,604,605,5,260,0,0,605,606,3,58,29,0,606,607,5,261,0,0,607,609,1,0,0,0,
	608,604,1,0,0,0,608,609,1,0,0,0,609,51,1,0,0,0,610,611,5,180,0,0,611,53,
	1,0,0,0,612,613,5,160,0,0,613,55,1,0,0,0,614,615,7,6,0,0,615,57,1,0,0,0,
	616,618,7,7,0,0,617,616,1,0,0,0,617,618,1,0,0,0,618,625,1,0,0,0,619,626,
	5,166,0,0,620,621,5,167,0,0,621,622,5,170,0,0,622,623,5,254,0,0,623,626,
	5,163,0,0,624,626,5,167,0,0,625,619,1,0,0,0,625,620,1,0,0,0,625,624,1,0,
	0,0,626,59,1,0,0,0,627,628,5,99,0,0,628,629,5,253,0,0,629,630,5,28,0,0,
	630,633,3,62,31,0,631,632,5,171,0,0,632,634,3,74,37,0,633,631,1,0,0,0,633,
	634,1,0,0,0,634,636,1,0,0,0,635,637,5,267,0,0,636,635,1,0,0,0,636,637,1,
	0,0,0,637,61,1,0,0,0,638,644,3,64,32,0,639,644,3,50,25,0,640,644,3,52,26,
	0,641,644,3,54,27,0,642,644,3,56,28,0,643,638,1,0,0,0,643,639,1,0,0,0,643,
	640,1,0,0,0,643,641,1,0,0,0,643,642,1,0,0,0,644,63,1,0,0,0,645,647,5,164,
	0,0,646,648,5,259,0,0,647,646,1,0,0,0,648,649,1,0,0,0,649,647,1,0,0,0,649,
	650,1,0,0,0,650,65,1,0,0,0,651,652,5,253,0,0,652,67,1,0,0,0,653,654,5,102,
	0,0,654,658,3,18,9,0,655,657,3,70,35,0,656,655,1,0,0,0,657,660,1,0,0,0,
	658,656,1,0,0,0,658,659,1,0,0,0,659,69,1,0,0,0,660,658,1,0,0,0,661,662,
	5,206,0,0,662,663,3,72,36,0,663,667,3,72,36,0,664,665,5,255,0,0,665,666,
	5,254,0,0,666,668,3,72,36,0,667,664,1,0,0,0,667,668,1,0,0,0,668,71,1,0,
	0,0,669,670,7,8,0,0,670,73,1,0,0,0,671,674,3,76,38,0,672,673,5,268,0,0,
	673,675,3,76,38,0,674,672,1,0,0,0,674,675,1,0,0,0,675,681,1,0,0,0,676,681,
	5,254,0,0,677,681,5,269,0,0,678,681,5,251,0,0,679,681,5,252,0,0,680,671,
	1,0,0,0,680,676,1,0,0,0,680,677,1,0,0,0,680,678,1,0,0,0,680,679,1,0,0,0,
	681,75,1,0,0,0,682,685,3,72,36,0,683,684,5,274,0,0,684,686,5,254,0,0,685,
	683,1,0,0,0,685,686,1,0,0,0,686,77,1,0,0,0,687,688,5,101,0,0,688,690,3,
	28,14,0,689,691,5,264,0,0,690,689,1,0,0,0,690,691,1,0,0,0,691,692,1,0,0,
	0,692,693,5,26,0,0,693,694,3,28,14,0,694,696,3,80,40,0,695,697,3,82,41,
	0,696,695,1,0,0,0,697,698,1,0,0,0,698,696,1,0,0,0,698,699,1,0,0,0,699,79,
	1,0,0,0,700,701,5,2,0,0,701,702,3,32,16,0,702,704,5,261,0,0,703,705,5,266,
	0,0,704,703,1,0,0,0,704,705,1,0,0,0,705,708,1,0,0,0,706,708,5,1,0,0,707,
	700,1,0,0,0,707,706,1,0,0,0,708,81,1,0,0,0,709,710,5,254,0,0,710,711,5,
	265,0,0,711,712,3,28,14,0,712,83,1,0,0,0,713,714,7,9,0,0,714,85,1,0,0,0,
	715,716,5,253,0,0,716,87,1,0,0,0,717,718,5,103,0,0,718,719,3,90,45,0,719,
	722,5,266,0,0,720,723,3,46,23,0,721,723,3,66,33,0,722,720,1,0,0,0,722,721,
	1,0,0,0,723,726,1,0,0,0,724,725,5,171,0,0,725,727,3,74,37,0,726,724,1,0,
	0,0,726,727,1,0,0,0,727,729,1,0,0,0,728,730,3,84,42,0,729,728,1,0,0,0,729,
	730,1,0,0,0,730,731,1,0,0,0,731,732,5,267,0,0,732,89,1,0,0,0,733,735,7,
	10,0,0,734,733,1,0,0,0,734,735,1,0,0,0,735,737,1,0,0,0,736,738,7,11,0,0,
	737,736,1,0,0,0,738,739,1,0,0,0,739,737,1,0,0,0,739,740,1,0,0,0,740,91,
	1,0,0,0,741,742,3,28,14,0,742,93,1,0,0,0,743,744,5,104,0,0,744,745,3,28,
	14,0,745,747,3,96,48,0,746,748,3,96,48,0,747,746,1,0,0,0,748,749,1,0,0,
	0,749,747,1,0,0,0,749,750,1,0,0,0,750,751,1,0,0,0,751,752,3,102,51,0,752,
	759,1,0,0,0,753,754,5,27,0,0,754,755,3,28,14,0,755,756,3,96,48,0,756,757,
	3,102,51,0,757,759,1,0,0,0,758,743,1,0,0,0,758,753,1,0,0,0,759,95,1,0,0,
	0,760,761,7,10,0,0,761,766,3,100,50,0,762,763,5,172,0,0,763,764,3,28,14,
	0,764,765,5,261,0,0,765,767,1,0,0,0,766,762,1,0,0,0,766,767,1,0,0,0,767,
	769,1,0,0,0,768,770,3,98,49,0,769,768,1,0,0,0,769,770,1,0,0,0,770,97,1,
	0,0,0,771,773,3,20,10,0,772,771,1,0,0,0,773,774,1,0,0,0,774,772,1,0,0,0,
	774,775,1,0,0,0,775,99,1,0,0,0,776,779,3,20,10,0,777,779,3,32,16,0,778,
	776,1,0,0,0,778,777,1,0,0,0,779,780,1,0,0,0,780,778,1,0,0,0,780,781,1,0,
	0,0,781,101,1,0,0,0,782,784,3,104,52,0,783,782,1,0,0,0,784,785,1,0,0,0,
	785,783,1,0,0,0,785,786,1,0,0,0,786,103,1,0,0,0,787,788,8,12,0,0,788,105,
	1,0,0,0,789,790,5,95,0,0,790,792,3,110,55,0,791,793,5,254,0,0,792,791,1,
	0,0,0,792,793,1,0,0,0,793,794,1,0,0,0,794,795,3,112,56,0,795,801,3,116,
	58,0,796,798,3,146,73,0,797,799,5,265,0,0,798,797,1,0,0,0,798,799,1,0,0,
	0,799,802,1,0,0,0,800,802,5,265,0,0,801,796,1,0,0,0,801,800,1,0,0,0,801,
	802,1,0,0,0,802,804,1,0,0,0,803,805,3,214,107,0,804,803,1,0,0,0,804,805,
	1,0,0,0,805,107,1,0,0,0,806,807,5,96,0,0,807,809,3,28,14,0,808,810,5,111,
	0,0,809,808,1,0,0,0,809,810,1,0,0,0,810,813,1,0,0,0,811,814,3,106,53,0,
	812,814,3,138,69,0,813,811,1,0,0,0,813,812,1,0,0,0,814,815,1,0,0,0,815,
	813,1,0,0,0,815,816,1,0,0,0,816,109,1,0,0,0,817,872,3,28,14,0,818,820,5,
	253,0,0,819,818,1,0,0,0,820,821,1,0,0,0,821,819,1,0,0,0,821,822,1,0,0,0,
	822,823,1,0,0,0,823,872,5,168,0,0,824,826,5,253,0,0,825,824,1,0,0,0,826,
	827,1,0,0,0,827,825,1,0,0,0,827,828,1,0,0,0,828,829,1,0,0,0,829,872,5,178,
	0,0,830,832,5,253,0,0,831,830,1,0,0,0,832,833,1,0,0,0,833,831,1,0,0,0,833,
	834,1,0,0,0,834,835,1,0,0,0,835,836,5,135,0,0,836,872,5,168,0,0,837,839,
	5,253,0,0,838,837,1,0,0,0,839,840,1,0,0,0,840,838,1,0,0,0,840,841,1,0,0,
	0,841,842,1,0,0,0,842,843,5,135,0,0,843,872,5,178,0,0,844,846,5,253,0,0,
	845,844,1,0,0,0,846,847,1,0,0,0,847,845,1,0,0,0,847,848,1,0,0,0,848,849,
	1,0,0,0,849,851,5,169,0,0,850,852,5,253,0,0,851,850,1,0,0,0,852,853,1,0,
	0,0,853,851,1,0,0,0,853,854,1,0,0,0,854,872,1,0,0,0,855,857,5,253,0,0,856,
	855,1,0,0,0,857,858,1,0,0,0,858,856,1,0,0,0,858,859,1,0,0,0,859,860,1,0,
	0,0,860,862,5,179,0,0,861,863,5,253,0,0,862,861,1,0,0,0,863,864,1,0,0,0,
	864,862,1,0,0,0,864,865,1,0,0,0,865,872,1,0,0,0,866,868,5,253,0,0,867,866,
	1,0,0,0,868,869,1,0,0,0,869,867,1,0,0,0,869,870,1,0,0,0,870,872,1,0,0,0,
	871,817,1,0,0,0,871,819,1,0,0,0,871,825,1,0,0,0,871,831,1,0,0,0,871,838,
	1,0,0,0,871,845,1,0,0,0,871,856,1,0,0,0,871,867,1,0,0,0,872,111,1,0,0,0,
	873,874,5,107,0,0,874,875,3,114,57,0,875,113,1,0,0,0,876,884,5,201,0,0,
	877,878,5,144,0,0,878,881,3,34,17,0,879,880,7,13,0,0,880,882,3,34,17,0,
	881,879,1,0,0,0,881,882,1,0,0,0,882,884,1,0,0,0,883,876,1,0,0,0,883,877,
	1,0,0,0,884,115,1,0,0,0,885,886,5,209,0,0,886,887,5,203,0,0,887,888,5,112,
	0,0,888,889,5,209,0,0,889,912,3,28,14,0,890,897,3,166,83,0,891,892,5,7,
	0,0,892,898,3,218,109,0,893,894,5,8,0,0,894,898,3,218,109,0,895,896,5,9,
	0,0,896,898,3,218,109,0,897,891,1,0,0,0,897,893,1,0,0,0,897,895,1,0,0,0,
	898,900,1,0,0,0,899,901,3,252,126,0,900,899,1,0,0,0,900,901,1,0,0,0,901,
	912,1,0,0,0,902,912,3,118,59,0,903,904,3,160,80,0,904,905,7,14,0,0,905,
	907,3,170,85,0,906,908,3,252,126,0,907,906,1,0,0,0,907,908,1,0,0,0,908,
	912,1,0,0,0,909,912,3,130,65,0,910,912,3,276,138,0,911,885,1,0,0,0,911,
	890,1,0,0,0,911,902,1,0,0,0,911,903,1,0,0,0,911,909,1,0,0,0,911,910,1,0,
	0,0,912,117,1,0,0,0,913,914,5,209,0,0,914,915,3,120,60,0,915,916,5,232,
	0,0,916,917,7,15,0,0,917,918,3,122,61,0,918,919,5,112,0,0,919,920,5,209,
	0,0,920,921,3,120,60,0,921,922,5,232,0,0,922,923,7,15,0,0,923,924,3,122,
	61,0,924,119,1,0,0,0,925,927,3,126,63,0,926,925,1,0,0,0,927,928,1,0,0,0,
	928,926,1,0,0,0,928,929,1,0,0,0,929,121,1,0,0,0,930,932,3,124,62,0,931,
	930,1,0,0,0,932,933,1,0,0,0,933,931,1,0,0,0,933,934,1,0,0,0,934,123,1,0,
	0,0,935,941,3,20,10,0,936,941,3,32,16,0,937,941,5,206,0,0,938,941,5,211,
	0,0,939,941,5,209,0,0,940,935,1,0,0,0,940,936,1,0,0,0,940,937,1,0,0,0,940,
	938,1,0,0,0,940,939,1,0,0,0,941,125,1,0,0,0,942,945,3,20,10,0,943,945,3,
	128,64,0,944,942,1,0,0,0,944,943,1,0,0,0,945,127,1,0,0,0,946,947,7,16,0,
	0,947,129,1,0,0,0,948,949,5,40,0,0,949,950,3,28,14,0,950,952,5,42,0,0,951,
	953,3,132,66,0,952,951,1,0,0,0,952,953,1,0,0,0,953,955,1,0,0,0,954,956,
	5,265,0,0,955,954,1,0,0,0,955,956,1,0,0,0,956,968,1,0,0,0,957,958,5,43,
	0,0,958,959,5,209,0,0,959,960,5,44,0,0,960,962,3,28,14,0,961,963,3,132,
	66,0,962,961,1,0,0,0,962,963,1,0,0,0,963,965,1,0,0,0,964,966,5,265,0,0,
	965,964,1,0,0,0,965,966,1,0,0,0,966,968,1,0,0,0,967,948,1,0,0,0,967,957,
	1,0,0,0,968,131,1,0,0,0,969,970,5,170,0,0,970,971,3,136,68,0,971,975,3,
	218,109,0,972,974,3,134,67,0,973,972,1,0,0,0,974,977,1,0,0,0,975,973,1,
	0,0,0,975,976,1,0,0,0,976,133,1,0,0,0,977,975,1,0,0,0,978,979,5,210,0,0,
	979,980,3,136,68,0,980,981,3,218,109,0,981,135,1,0,0,0,982,983,3,24,12,
	0,983,137,1,0,0,0,984,985,5,94,0,0,985,995,3,28,14,0,986,996,3,140,70,0,
	987,993,3,144,72,0,988,990,3,146,73,0,989,991,5,265,0,0,990,989,1,0,0,0,
	990,991,1,0,0,0,991,994,1,0,0,0,992,994,5,265,0,0,993,988,1,0,0,0,993,992,
	1,0,0,0,993,994,1,0,0,0,994,996,1,0,0,0,995,986,1,0,0,0,995,987,1,0,0,0,
	996,139,1,0,0,0,997,998,3,142,71,0,998,1000,5,91,0,0,999,1001,5,265,0,0,
	1000,999,1,0,0,0,1000,1001,1,0,0,0,1001,141,1,0,0,0,1002,1003,5,206,0,0,
	1003,1004,3,28,14,0,1004,1005,5,232,0,0,1005,1006,5,119,0,0,1006,1007,3,
	28,14,0,1007,143,1,0,0,0,1008,1010,7,17,0,0,1009,1008,1,0,0,0,1009,1010,
	1,0,0,0,1010,1011,1,0,0,0,1011,1012,3,28,14,0,1012,1013,5,93,0,0,1013,145,
	1,0,0,0,1014,1017,5,110,0,0,1015,1018,3,218,109,0,1016,1018,3,148,74,0,
	1017,1015,1,0,0,0,1017,1016,1,0,0,0,1018,147,1,0,0,0,1019,1020,5,45,0,0,
	1020,1021,3,150,75,0,1021,1022,7,18,0,0,1022,1023,5,39,0,0,1023,1025,5,
	266,0,0,1024,1026,3,152,76,0,1025,1024,1,0,0,0,1026,1027,1,0,0,0,1027,1025,
	1,0,0,0,1027,1028,1,0,0,0,1028,1062,1,0,0,0,1029,1034,3,160,80,0,1030,1034,
	5,213,0,0,1031,1034,5,211,0,0,1032,1034,5,239,0,0,1033,1029,1,0,0,0,1033,
	1030,1,0,0,0,1033,1031,1,0,0,0,1033,1032,1,0,0,0,1034,1035,1,0,0,0,1035,
	1036,5,117,0,0,1036,1037,3,150,75,0,1037,1038,7,18,0,0,1038,1039,5,148,
	0,0,1039,1041,5,266,0,0,1040,1042,3,152,76,0,1041,1040,1,0,0,0,1042,1043,
	1,0,0,0,1043,1041,1,0,0,0,1043,1044,1,0,0,0,1044,1062,1,0,0,0,1045,1050,
	3,160,80,0,1046,1050,5,213,0,0,1047,1050,5,211,0,0,1048,1050,5,239,0,0,
	1049,1045,1,0,0,0,1049,1046,1,0,0,0,1049,1047,1,0,0,0,1049,1048,1,0,0,0,
	1050,1051,1,0,0,0,1051,1052,5,148,0,0,1052,1053,5,117,0,0,1053,1054,3,150,
	75,0,1054,1055,7,18,0,0,1055,1057,5,266,0,0,1056,1058,3,152,76,0,1057,1056,
	1,0,0,0,1058,1059,1,0,0,0,1059,1057,1,0,0,0,1059,1060,1,0,0,0,1060,1062,
	1,0,0,0,1061,1019,1,0,0,0,1061,1033,1,0,0,0,1061,1049,1,0,0,0,1062,149,
	1,0,0,0,1063,1078,5,119,0,0,1064,1078,5,197,0,0,1065,1066,7,19,0,0,1066,
	1067,7,20,0,0,1067,1068,5,232,0,0,1068,1078,5,206,0,0,1069,1070,5,153,0,
	0,1070,1071,7,20,0,0,1071,1072,5,232,0,0,1072,1078,5,206,0,0,1073,1074,
	5,154,0,0,1074,1075,7,20,0,0,1075,1076,5,232,0,0,1076,1078,5,206,0,0,1077,
	1063,1,0,0,0,1077,1064,1,0,0,0,1077,1065,1,0,0,0,1077,1069,1,0,0,0,1077,
	1073,1,0,0,0,1078,151,1,0,0,0,1079,1082,3,154,77,0,1080,1083,3,156,78,0,
	1081,1083,3,158,79,0,1082,1080,1,0,0,0,1082,1081,1,0,0,0,1083,153,1,0,0,
	0,1084,1086,7,21,0,0,1085,1084,1,0,0,0,1086,1087,1,0,0,0,1087,1085,1,0,
	0,0,1087,1088,1,0,0,0,1088,155,1,0,0,0,1089,1090,3,218,109,0,1090,157,1,
	0,0,0,1091,1095,3,160,80,0,1092,1095,5,213,0,0,1093,1095,5,239,0,0,1094,
	1091,1,0,0,0,1094,1092,1,0,0,0,1094,1093,1,0,0,0,1095,1096,1,0,0,0,1096,
	1097,5,148,0,0,1097,1098,5,117,0,0,1098,1099,3,150,75,0,1099,1100,7,18,
	0,0,1100,1102,5,266,0,0,1101,1103,3,152,76,0,1102,1101,1,0,0,0,1103,1104,
	1,0,0,0,1104,1102,1,0,0,0,1104,1105,1,0,0,0,1105,159,1,0,0,0,1106,1109,
	3,162,81,0,1107,1108,7,22,0,0,1108,1110,3,174,87,0,1109,1107,1,0,0,0,1109,
	1110,1,0,0,0,1110,161,1,0,0,0,1111,1117,3,164,82,0,1112,1113,3,32,16,0,
	1113,1114,3,164,82,0,1114,1116,1,0,0,0,1115,1112,1,0,0,0,1116,1119,1,0,
	0,0,1117,1115,1,0,0,0,1117,1118,1,0,0,0,1118,163,1,0,0,0,1119,1117,1,0,
	0,0,1120,1122,7,23,0,0,1121,1120,1,0,0,0,1121,1122,1,0,0,0,1122,1124,1,
	0,0,0,1123,1125,3,20,10,0,1124,1123,1,0,0,0,1125,1126,1,0,0,0,1126,1124,
	1,0,0,0,1126,1127,1,0,0,0,1127,1130,1,0,0,0,1128,1130,5,213,0,0,1129,1121,
	1,0,0,0,1129,1128,1,0,0,0,1130,165,1,0,0,0,1131,1132,3,168,84,0,1132,1133,
	5,232,0,0,1133,1134,3,160,80,0,1134,167,1,0,0,0,1135,1136,3,28,14,0,1136,
	169,1,0,0,0,1137,1138,3,160,80,0,1138,171,1,0,0,0,1139,1140,5,116,0,0,1140,
	1141,3,18,9,0,1141,173,1,0,0,0,1142,1145,3,176,88,0,1143,1145,3,192,96,
	0,1144,1142,1,0,0,0,1144,1143,1,0,0,0,1145,175,1,0,0,0,1146,1152,3,184,
	92,0,1147,1152,3,178,89,0,1148,1152,3,186,93,0,1149,1152,3,188,94,0,1150,
	1152,3,190,95,0,1151,1146,1,0,0,0,1151,1147,1,0,0,0,1151,1148,1,0,0,0,1151,
	1149,1,0,0,0,1151,1150,1,0,0,0,1152,177,1,0,0,0,1153,1154,3,180,90,0,1154,
	179,1,0,0,0,1155,1157,5,209,0,0,1156,1155,1,0,0,0,1156,1157,1,0,0,0,1157,
	1160,1,0,0,0,1158,1161,3,170,85,0,1159,1161,3,182,91,0,1160,1158,1,0,0,
	0,1160,1159,1,0,0,0,1161,1162,1,0,0,0,1162,1163,7,24,0,0,1163,181,1,0,0,
	0,1164,1165,3,28,14,0,1165,183,1,0,0,0,1166,1168,5,209,0,0,1167,1166,1,
	0,0,0,1167,1168,1,0,0,0,1168,1169,1,0,0,0,1169,1170,3,28,14,0,1170,1171,
	5,108,0,0,1171,1172,3,224,112,0,1172,1173,3,218,109,0,1173,185,1,0,0,0,
	1174,1175,3,202,101,0,1175,1176,3,208,104,0,1176,187,1,0,0,0,1177,1178,
	3,204,102,0,1178,1179,3,210,105,0,1179,189,1,0,0,0,1180,1181,3,206,103,
	0,1181,1182,3,212,106,0,1182,191,1,0,0,0,1183,1184,5,117,0,0,1184,1185,
	3,150,75,0,1185,1186,5,235,0,0,1186,1187,7,25,0,0,1187,1188,7,26,0,0,1188,
	1190,5,266,0,0,1189,1191,3,194,97,0,1190,1189,1,0,0,0,1191,1192,1,0,0,0,
	1192,1190,1,0,0,0,1192,1193,1,0,0,0,1193,193,1,0,0,0,1194,1195,3,154,77,
	0,1195,1196,3,196,98,0,1196,1201,1,0,0,0,1197,1198,3,154,77,0,1198,1199,
	3,200,100,0,1199,1201,1,0,0,0,1200,1194,1,0,0,0,1200,1197,1,0,0,0,1201,
	195,1,0,0,0,1202,1203,3,198,99,0,1203,197,1,0,0,0,1204,1205,3,166,83,0,
	1205,1206,3,224,112,0,1206,1207,3,218,109,0,1207,1216,1,0,0,0,1208,1209,
	3,160,80,0,1209,1210,3,180,90,0,1210,1216,1,0,0,0,1211,1212,3,166,83,0,
	1212,1213,7,27,0,0,1213,1214,3,170,85,0,1214,1216,1,0,0,0,1215,1204,1,0,
	0,0,1215,1208,1,0,0,0,1215,1211,1,0,0,0,1216,199,1,0,0,0,1217,1222,5,148,
	0,0,1218,1222,5,147,0,0,1219,1220,5,281,0,0,1220,1222,5,282,0,0,1221,1217,
	1,0,0,0,1221,1218,1,0,0,0,1221,1219,1,0,0,0,1222,1223,1,0,0,0,1223,1224,
	5,117,0,0,1224,1225,3,150,75,0,1225,1226,5,235,0,0,1226,1227,7,25,0,0,1227,
	1229,5,266,0,0,1228,1230,3,194,97,0,1229,1228,1,0,0,0,1230,1231,1,0,0,0,
	1231,1229,1,0,0,0,1231,1232,1,0,0,0,1232,201,1,0,0,0,1233,1234,7,28,0,0,
	1234,203,1,0,0,0,1235,1236,7,29,0,0,1236,205,1,0,0,0,1237,1238,7,30,0,0,
	1238,207,1,0,0,0,1239,1240,3,218,109,0,1240,209,1,0,0,0,1241,1242,3,218,
	109,0,1242,211,1,0,0,0,1243,1244,3,218,109,0,1244,213,1,0,0,0,1245,1249,
	5,106,0,0,1246,1248,3,216,108,0,1247,1246,1,0,0,0,1248,1251,1,0,0,0,1249,
	1247,1,0,0,0,1249,1250,1,0,0,0,1250,1252,1,0,0,0,1251,1249,1,0,0,0,1252,
	1253,5,265,0,0,1253,215,1,0,0,0,1254,1255,3,28,14,0,1255,1256,5,112,0,0,
	1256,1258,3,218,109,0,1257,1259,5,267,0,0,1258,1257,1,0,0,0,1258,1259,1,
	0,0,0,1259,217,1,0,0,0,1260,1261,3,220,110,0,1261,219,1,0,0,0,1262,1265,
	3,222,111,0,1263,1264,7,31,0,0,1264,1266,3,220,110,0,1265,1263,1,0,0,0,
	1265,1266,1,0,0,0,1266,221,1,0,0,0,1267,1285,3,272,136,0,1268,1269,3,226,
	113,0,1269,1270,5,112,0,0,1270,1271,3,28,14,0,1271,1285,1,0,0,0,1272,1273,
	3,226,113,0,1273,1274,5,109,0,0,1274,1275,3,28,14,0,1275,1285,1,0,0,0,1276,
	1280,3,226,113,0,1277,1278,3,224,112,0,1278,1279,3,226,113,0,1279,1281,
	1,0,0,0,1280,1277,1,0,0,0,1280,1281,1,0,0,0,1281,1285,1,0,0,0,1282,1285,
	3,268,134,0,1283,1285,3,270,135,0,1284,1267,1,0,0,0,1284,1268,1,0,0,0,1284,
	1272,1,0,0,0,1284,1276,1,0,0,0,1284,1282,1,0,0,0,1284,1283,1,0,0,0,1285,
	223,1,0,0,0,1286,1287,7,32,0,0,1287,225,1,0,0,0,1288,1294,3,230,115,0,1289,
	1290,3,228,114,0,1290,1291,3,230,115,0,1291,1293,1,0,0,0,1292,1289,1,0,
	0,0,1293,1296,1,0,0,0,1294,1292,1,0,0,0,1294,1295,1,0,0,0,1295,227,1,0,
	0,0,1296,1294,1,0,0,0,1297,1298,7,33,0,0,1298,229,1,0,0,0,1299,1305,3,234,
	117,0,1300,1301,3,232,116,0,1301,1302,3,234,117,0,1302,1304,1,0,0,0,1303,
	1300,1,0,0,0,1304,1307,1,0,0,0,1305,1303,1,0,0,0,1305,1306,1,0,0,0,1306,
	231,1,0,0,0,1307,1305,1,0,0,0,1308,1309,7,34,0,0,1309,233,1,0,0,0,1310,
	1316,3,238,119,0,1311,1312,3,236,118,0,1312,1313,3,238,119,0,1313,1315,
	1,0,0,0,1314,1311,1,0,0,0,1315,1318,1,0,0,0,1316,1314,1,0,0,0,1316,1317,
	1,0,0,0,1317,235,1,0,0,0,1318,1316,1,0,0,0,1319,1320,7,35,0,0,1320,237,
	1,0,0,0,1321,1322,6,119,-1,0,1322,1323,5,132,0,0,1323,1560,3,238,119,50,
	1324,1325,5,278,0,0,1325,1560,3,238,119,49,1326,1327,5,135,0,0,1327,1560,
	3,238,119,48,1328,1329,5,10,0,0,1329,1330,3,238,119,0,1330,1331,5,140,0,
	0,1331,1334,3,238,119,0,1332,1333,5,186,0,0,1333,1335,5,253,0,0,1334,1332,
	1,0,0,0,1334,1335,1,0,0,0,1335,1560,1,0,0,0,1336,1337,5,190,0,0,1337,1338,
	3,238,119,0,1338,1339,5,140,0,0,1339,1342,3,238,119,0,1340,1341,5,186,0,
	0,1341,1343,5,253,0,0,1342,1340,1,0,0,0,1342,1343,1,0,0,0,1343,1560,1,0,
	0,0,1344,1345,5,189,0,0,1345,1350,3,238,119,0,1346,1347,5,264,0,0,1347,
	1349,3,238,119,0,1348,1346,1,0,0,0,1349,1352,1,0,0,0,1350,1348,1,0,0,0,
	1350,1351,1,0,0,0,1351,1353,1,0,0,0,1352,1350,1,0,0,0,1353,1354,5,210,0,
	0,1354,1355,3,238,119,45,1355,1560,1,0,0,0,1356,1357,5,189,0,0,1357,1358,
	5,119,0,0,1358,1560,3,28,14,0,1359,1360,5,189,0,0,1360,1361,5,119,0,0,1361,
	1560,3,166,83,0,1362,1364,5,211,0,0,1363,1362,1,0,0,0,1363,1364,1,0,0,0,
	1364,1365,1,0,0,0,1365,1367,5,184,0,0,1366,1368,5,119,0,0,1367,1366,1,0,
	0,0,1367,1368,1,0,0,0,1368,1369,1,0,0,0,1369,1560,3,160,80,0,1370,1372,
	5,211,0,0,1371,1370,1,0,0,0,1371,1372,1,0,0,0,1372,1373,1,0,0,0,1373,1374,
	5,184,0,0,1374,1560,3,166,83,0,1375,1378,5,254,0,0,1376,1379,5,269,0,0,
	1377,1379,5,253,0,0,1378,1376,1,0,0,0,1378,1377,1,0,0,0,1379,1380,1,0,0,
	0,1380,1381,5,232,0,0,1381,1560,3,238,119,40,1382,1383,5,29,0,0,1383,1388,
	3,238,119,0,1384,1385,5,264,0,0,1385,1387,3,238,119,0,1386,1384,1,0,0,0,
	1387,1390,1,0,0,0,1388,1386,1,0,0,0,1388,1389,1,0,0,0,1389,1391,1,0,0,0,
	1390,1388,1,0,0,0,1391,1392,7,31,0,0,1392,1393,3,238,119,37,1393,1560,1,
	0,0,0,1394,1395,5,150,0,0,1395,1560,3,238,119,35,1396,1397,5,11,0,0,1397,
	1398,5,260,0,0,1398,1399,3,238,119,0,1399,1400,5,261,0,0,1400,1560,1,0,
	0,0,1401,1402,5,13,0,0,1402,1407,3,238,119,0,1403,1404,5,264,0,0,1404,1406,
	3,238,119,0,1405,1403,1,0,0,0,1406,1409,1,0,0,0,1407,1405,1,0,0,0,1407,
	1408,1,0,0,0,1408,1410,1,0,0,0,1409,1407,1,0,0,0,1410,1411,5,210,0,0,1411,
	1412,3,238,119,33,1412,1560,1,0,0,0,1413,1414,5,13,0,0,1414,1415,5,119,
	0,0,1415,1560,3,166,83,0,1416,1417,5,12,0,0,1417,1422,3,238,119,0,1418,
	1419,5,264,0,0,1419,1421,3,238,119,0,1420,1418,1,0,0,0,1421,1424,1,0,0,
	0,1422,1420,1,0,0,0,1422,1423,1,0,0,0,1423,1425,1,0,0,0,1424,1422,1,0,0,
	0,1425,1426,5,210,0,0,1426,1427,3,238,119,31,1427,1560,1,0,0,0,1428,1429,
	5,12,0,0,1429,1430,5,119,0,0,1430,1560,3,166,83,0,1431,1432,5,211,0,0,1432,
	1433,5,215,0,0,1433,1434,5,230,0,0,1434,1560,3,238,119,29,1435,1436,5,206,
	0,0,1436,1437,5,217,0,0,1437,1438,5,230,0,0,1438,1560,3,238,119,28,1439,
	1440,5,206,0,0,1440,1441,5,203,0,0,1441,1442,5,230,0,0,1442,1560,3,238,
	119,27,1443,1444,5,16,0,0,1444,1445,5,260,0,0,1445,1446,3,238,119,0,1446,
	1447,5,264,0,0,1447,1448,3,238,119,0,1448,1449,5,264,0,0,1449,1450,3,238,
	119,0,1450,1451,5,261,0,0,1451,1560,1,0,0,0,1452,1453,5,17,0,0,1453,1454,
	5,260,0,0,1454,1455,3,238,119,0,1455,1456,5,261,0,0,1456,1560,1,0,0,0,1457,
	1458,5,185,0,0,1458,1463,3,238,119,0,1459,1460,5,264,0,0,1460,1462,3,238,
	119,0,1461,1459,1,0,0,0,1462,1465,1,0,0,0,1463,1461,1,0,0,0,1463,1464,1,
	0,0,0,1464,1466,1,0,0,0,1465,1463,1,0,0,0,1466,1467,5,210,0,0,1467,1468,
	3,238,119,23,1468,1560,1,0,0,0,1469,1470,5,187,0,0,1470,1475,3,238,119,
	0,1471,1472,5,264,0,0,1472,1474,3,238,119,0,1473,1471,1,0,0,0,1474,1477,
	1,0,0,0,1475,1473,1,0,0,0,1475,1476,1,0,0,0,1476,1478,1,0,0,0,1477,1475,
	1,0,0,0,1478,1479,5,210,0,0,1479,1480,3,238,119,22,1480,1560,1,0,0,0,1481,
	1482,5,14,0,0,1482,1484,3,218,109,0,1483,1485,3,248,124,0,1484,1483,1,0,
	0,0,1484,1485,1,0,0,0,1485,1560,1,0,0,0,1486,1487,5,211,0,0,1487,1488,5,
	184,0,0,1488,1489,5,204,0,0,1489,1498,5,214,0,0,1490,1492,5,206,0,0,1491,
	1490,1,0,0,0,1491,1492,1,0,0,0,1492,1493,1,0,0,0,1493,1499,5,217,0,0,1494,
	1496,5,211,0,0,1495,1494,1,0,0,0,1495,1496,1,0,0,0,1496,1497,1,0,0,0,1497,
	1499,5,215,0,0,1498,1491,1,0,0,0,1498,1495,1,0,0,0,1499,1500,1,0,0,0,1500,
	1501,5,205,0,0,1501,1560,3,218,109,0,1502,1504,3,18,9,0,1503,1502,1,0,0,
	0,1504,1505,1,0,0,0,1505,1503,1,0,0,0,1505,1506,1,0,0,0,1506,1507,1,0,0,
	0,1507,1508,5,14,0,0,1508,1510,3,218,109,0,1509,1511,3,248,124,0,1510,1509,
	1,0,0,0,1510,1511,1,0,0,0,1511,1560,1,0,0,0,1512,1513,5,15,0,0,1513,1514,
	7,36,0,0,1514,1515,5,232,0,0,1515,1517,3,218,109,0,1516,1518,3,248,124,
	0,1517,1516,1,0,0,0,1517,1518,1,0,0,0,1518,1560,1,0,0,0,1519,1521,3,18,
	9,0,1520,1519,1,0,0,0,1521,1522,1,0,0,0,1522,1520,1,0,0,0,1522,1523,1,0,
	0,0,1523,1524,1,0,0,0,1524,1525,5,15,0,0,1525,1526,7,36,0,0,1526,1527,5,
	232,0,0,1527,1529,3,218,109,0,1528,1530,3,248,124,0,1529,1528,1,0,0,0,1529,
	1530,1,0,0,0,1530,1560,1,0,0,0,1531,1534,3,256,128,0,1532,1534,3,258,129,
	0,1533,1531,1,0,0,0,1533,1532,1,0,0,0,1534,1535,1,0,0,0,1535,1536,3,168,
	84,0,1536,1537,3,260,130,0,1537,1560,1,0,0,0,1538,1560,3,166,83,0,1539,
	1560,3,172,86,0,1540,1560,3,160,80,0,1541,1560,3,28,14,0,1542,1560,3,92,
	46,0,1543,1560,5,225,0,0,1544,1560,3,18,9,0,1545,1547,5,254,0,0,1546,1548,
	3,72,36,0,1547,1546,1,0,0,0,1547,1548,1,0,0,0,1548,1560,1,0,0,0,1549,1560,
	5,258,0,0,1550,1560,5,259,0,0,1551,1560,3,34,17,0,1552,1560,5,237,0,0,1553,
	1560,5,221,0,0,1554,1560,5,213,0,0,1555,1556,5,260,0,0,1556,1557,3,218,
	109,0,1557,1558,5,261,0,0,1558,1560,1,0,0,0,1559,1321,1,0,0,0,1559,1324,
	1,0,0,0,1559,1326,1,0,0,0,1559,1328,1,0,0,0,1559,1336,1,0,0,0,1559,1344,
	1,0,0,0,1559,1356,1,0,0,0,1559,1359,1,0,0,0,1559,1363,1,0,0,0,1559,1371,
	1,0,0,0,1559,1375,1,0,0,0,1559,1382,1,0,0,0,1559,1394,1,0,0,0,1559,1396,
	1,0,0,0,1559,1401,1,0,0,0,1559,1413,1,0,0,0,1559,1416,1,0,0,0,1559,1428,
	1,0,0,0,1559,1431,1,0,0,0,1559,1435,1,0,0,0,1559,1439,1,0,0,0,1559,1443,
	1,0,0,0,1559,1452,1,0,0,0,1559,1457,1,0,0,0,1559,1469,1,0,0,0,1559,1481,
	1,0,0,0,1559,1486,1,0,0,0,1559,1503,1,0,0,0,1559,1512,1,0,0,0,1559,1520,
	1,0,0,0,1559,1533,1,0,0,0,1559,1538,1,0,0,0,1559,1539,1,0,0,0,1559,1540,
	1,0,0,0,1559,1541,1,0,0,0,1559,1542,1,0,0,0,1559,1543,1,0,0,0,1559,1544,
	1,0,0,0,1559,1545,1,0,0,0,1559,1549,1,0,0,0,1559,1550,1,0,0,0,1559,1551,
	1,0,0,0,1559,1552,1,0,0,0,1559,1553,1,0,0,0,1559,1554,1,0,0,0,1559,1555,
	1,0,0,0,1560,1583,1,0,0,0,1561,1564,10,36,0,0,1562,1563,5,264,0,0,1563,
	1565,3,238,119,0,1564,1562,1,0,0,0,1565,1566,1,0,0,0,1566,1564,1,0,0,0,
	1566,1567,1,0,0,0,1567,1568,1,0,0,0,1568,1569,7,31,0,0,1569,1570,3,238,
	119,37,1570,1582,1,0,0,0,1571,1572,10,39,0,0,1572,1582,3,240,120,0,1573,
	1574,10,38,0,0,1574,1575,5,264,0,0,1575,1582,3,242,121,0,1576,1577,10,24,
	0,0,1577,1578,7,37,0,0,1578,1579,3,238,119,0,1579,1580,3,18,9,0,1580,1582,
	1,0,0,0,1581,1561,1,0,0,0,1581,1571,1,0,0,0,1581,1573,1,0,0,0,1581,1576,
	1,0,0,0,1582,1585,1,0,0,0,1583,1581,1,0,0,0,1583,1584,1,0,0,0,1584,239,
	1,0,0,0,1585,1583,1,0,0,0,1586,1587,7,38,0,0,1587,1588,5,118,0,0,1588,1589,
	5,254,0,0,1589,1590,5,163,0,0,1590,241,1,0,0,0,1591,1598,3,244,122,0,1592,
	1598,3,246,123,0,1593,1594,3,244,122,0,1594,1595,5,210,0,0,1595,1596,3,
	246,123,0,1596,1598,1,0,0,0,1597,1591,1,0,0,0,1597,1592,1,0,0,0,1597,1593,
	1,0,0,0,1598,243,1,0,0,0,1599,1600,5,19,0,0,1600,1601,3,218,109,0,1601,
	245,1,0,0,0,1602,1603,5,20,0,0,1603,1604,3,218,109,0,1604,247,1,0,0,0,1605,
	1606,5,4,0,0,1606,1609,3,218,109,0,1607,1609,3,250,125,0,1608,1605,1,0,
	0,0,1608,1607,1,0,0,0,1609,249,1,0,0,0,1610,1611,5,144,0,0,1611,1627,3,
	34,17,0,1612,1613,5,232,0,0,1613,1614,3,34,17,0,1614,1615,5,140,0,0,1615,
	1616,3,34,17,0,1616,1627,1,0,0,0,1617,1618,5,232,0,0,1618,1619,3,34,17,
	0,1619,1620,5,142,0,0,1620,1621,3,34,17,0,1621,1627,1,0,0,0,1622,1623,5,
	140,0,0,1623,1627,3,34,17,0,1624,1625,5,142,0,0,1625,1627,3,34,17,0,1626,
	1610,1,0,0,0,1626,1612,1,0,0,0,1626,1617,1,0,0,0,1626,1622,1,0,0,0,1626,
	1624,1,0,0,0,1627,251,1,0,0,0,1628,1629,5,144,0,0,1629,1645,3,254,127,0,
	1630,1631,5,140,0,0,1631,1645,3,254,127,0,1632,1633,5,142,0,0,1633,1645,
	3,254,127,0,1634,1635,5,232,0,0,1635,1636,3,254,127,0,1636,1637,5,140,0,
	0,1637,1638,3,254,127,0,1638,1645,1,0,0,0,1639,1640,5,232,0,0,1640,1641,
	3,254,127,0,1641,1642,5,142,0,0,1642,1643,3,254,127,0,1643,1645,1,0,0,0,
	1644,1628,1,0,0,0,1644,1630,1,0,0,0,1644,1632,1,0,0,0,1644,1634,1,0,0,0,
	1644,1639,1,0,0,0,1645,253,1,0,0,0,1646,1651,3,34,17,0,1647,1651,5,225,
	0,0,1648,1651,5,226,0,0,1649,1651,3,166,83,0,1650,1646,1,0,0,0,1650,1647,
	1,0,0,0,1650,1648,1,0,0,0,1650,1649,1,0,0,0,1651,255,1,0,0,0,1652,1654,
	5,211,0,0,1653,1652,1,0,0,0,1653,1654,1,0,0,0,1654,1655,1,0,0,0,1655,1660,
	5,184,0,0,1656,1660,5,12,0,0,1657,1660,5,13,0,0,1658,1660,5,189,0,0,1659,
	1653,1,0,0,0,1659,1656,1,0,0,0,1659,1657,1,0,0,0,1659,1658,1,0,0,0,1660,
	257,1,0,0,0,1661,1662,7,39,0,0,1662,259,1,0,0,0,1663,1667,5,223,0,0,1664,
	1668,3,262,131,0,1665,1668,3,264,132,0,1666,1668,3,266,133,0,1667,1664,
	1,0,0,0,1667,1665,1,0,0,0,1667,1666,1,0,0,0,1668,1669,1,0,0,0,1669,1670,
	5,265,0,0,1670,1674,1,0,0,0,1671,1672,5,232,0,0,1672,1674,3,262,131,0,1673,
	1663,1,0,0,0,1673,1671,1,0,0,0,1674,261,1,0,0,0,1675,1676,5,119,0,0,1676,
	1679,3,28,14,0,1677,1678,7,22,0,0,1678,1680,3,174,87,0,1679,1677,1,0,0,
	0,1679,1680,1,0,0,0,1680,263,1,0,0,0,1681,1682,5,206,0,0,1682,1683,3,28,
	14,0,1683,1684,5,144,0,0,1684,1685,3,18,9,0,1685,1686,5,229,0,0,1686,1687,
	3,18,9,0,1687,265,1,0,0,0,1688,1689,5,206,0,0,1689,1690,3,28,14,0,1690,
	1691,5,214,0,0,1691,1692,5,262,0,0,1692,1697,3,18,9,0,1693,1694,5,264,0,
	0,1694,1696,3,18,9,0,1695,1693,1,0,0,0,1696,1699,1,0,0,0,1697,1695,1,0,
	0,0,1697,1698,1,0,0,0,1698,1700,1,0,0,0,1699,1697,1,0,0,0,1700,1701,5,210,
	0,0,1701,1702,3,18,9,0,1702,1703,5,263,0,0,1703,267,1,0,0,0,1704,1705,3,
	238,119,0,1705,1706,7,40,0,0,1706,1731,1,0,0,0,1707,1708,3,238,119,0,1708,
	1709,7,41,0,0,1709,1710,5,254,0,0,1710,1711,5,161,0,0,1711,1731,1,0,0,0,
	1712,1713,3,238,119,0,1713,1714,7,42,0,0,1714,1715,3,18,9,0,1715,1731,1,
	0,0,0,1716,1717,3,238,119,0,1717,1718,7,43,0,0,1718,1719,3,18,9,0,1719,
	1731,1,0,0,0,1720,1721,3,238,119,0,1721,1722,7,44,0,0,1722,1723,3,18,9,
	0,1723,1731,1,0,0,0,1724,1725,3,160,80,0,1725,1726,5,91,0,0,1726,1731,1,
	0,0,0,1727,1728,3,238,119,0,1728,1729,5,93,0,0,1729,1731,1,0,0,0,1730,1704,
	1,0,0,0,1730,1707,1,0,0,0,1730,1712,1,0,0,0,1730,1716,1,0,0,0,1730,1720,
	1,0,0,0,1730,1724,1,0,0,0,1730,1727,1,0,0,0,1731,269,1,0,0,0,1732,1733,
	5,95,0,0,1733,1734,3,28,14,0,1734,1735,7,45,0,0,1735,271,1,0,0,0,1736,1737,
	3,160,80,0,1737,1738,3,28,14,0,1738,1739,5,109,0,0,1739,1749,1,0,0,0,1740,
	1741,3,160,80,0,1741,1742,3,28,14,0,1742,1743,5,112,0,0,1743,1749,1,0,0,
	0,1744,1745,3,160,80,0,1745,1746,5,112,0,0,1746,1747,3,28,14,0,1747,1749,
	1,0,0,0,1748,1736,1,0,0,0,1748,1740,1,0,0,0,1748,1744,1,0,0,0,1749,273,
	1,0,0,0,1750,1751,5,105,0,0,1751,1759,3,28,14,0,1752,1754,5,172,0,0,1753,
	1755,5,253,0,0,1754,1753,1,0,0,0,1755,1756,1,0,0,0,1756,1754,1,0,0,0,1756,
	1757,1,0,0,0,1757,1758,1,0,0,0,1758,1760,5,261,0,0,1759,1752,1,0,0,0,1759,
	1760,1,0,0,0,1760,1762,1,0,0,0,1761,1763,5,267,0,0,1762,1761,1,0,0,0,1762,
	1763,1,0,0,0,1763,275,1,0,0,0,1764,1765,3,218,109,0,1765,1766,5,115,0,0,
	1766,1767,3,218,109,0,1767,1768,5,264,0,0,1768,1771,5,25,0,0,1769,1772,
	3,278,139,0,1770,1772,3,280,140,0,1771,1769,1,0,0,0,1771,1770,1,0,0,0,1772,
	1774,1,0,0,0,1773,1775,3,288,144,0,1774,1773,1,0,0,0,1774,1775,1,0,0,0,
	1775,277,1,0,0,0,1776,1777,3,286,143,0,1777,279,1,0,0,0,1778,1779,5,266,
	0,0,1779,1781,3,282,141,0,1780,1782,5,265,0,0,1781,1780,1,0,0,0,1781,1782,
	1,0,0,0,1782,281,1,0,0,0,1783,1787,3,284,142,0,1784,1786,3,284,142,0,1785,
	1784,1,0,0,0,1786,1789,1,0,0,0,1787,1785,1,0,0,0,1787,1788,1,0,0,0,1788,
	283,1,0,0,0,1789,1787,1,0,0,0,1790,1791,5,278,0,0,1791,1793,3,286,143,0,
	1792,1794,7,46,0,0,1793,1792,1,0,0,0,1793,1794,1,0,0,0,1794,285,1,0,0,0,
	1795,1810,5,192,0,0,1796,1797,5,34,0,0,1797,1810,3,218,109,0,1798,1799,
	5,33,0,0,1799,1800,7,47,0,0,1800,1810,3,218,109,0,1801,1802,5,32,0,0,1802,
	1810,3,286,143,0,1803,1804,5,20,0,0,1804,1810,3,218,109,0,1805,1806,5,118,
	0,0,1806,1807,5,254,0,0,1807,1808,5,163,0,0,1808,1810,7,48,0,0,1809,1795,
	1,0,0,0,1809,1796,1,0,0,0,1809,1798,1,0,0,0,1809,1801,1,0,0,0,1809,1803,
	1,0,0,0,1809,1805,1,0,0,0,1810,287,1,0,0,0,1811,1812,5,18,0,0,1812,1814,
	3,218,109,0,1813,1815,5,193,0,0,1814,1813,1,0,0,0,1814,1815,1,0,0,0,1815,
	289,1,0,0,0,207,296,298,309,314,323,327,336,340,343,348,351,355,360,373,
	377,381,386,395,400,405,411,417,423,428,434,440,449,451,454,459,464,470,
	476,482,487,493,499,501,509,518,533,536,539,544,549,554,558,562,567,574,
	576,584,587,590,597,608,617,625,633,636,643,649,658,667,674,680,685,690,
	698,704,707,722,726,729,734,739,749,758,766,769,774,778,780,785,792,798,
	801,804,809,813,815,821,827,833,840,847,853,858,864,869,871,881,883,897,
	900,907,911,928,933,940,944,952,955,962,965,967,975,990,993,995,1000,1009,
	1017,1027,1033,1043,1049,1059,1061,1077,1082,1087,1094,1104,1109,1117,1121,
	1126,1129,1144,1151,1156,1160,1167,1192,1200,1215,1221,1231,1249,1258,1265,
	1280,1284,1294,1305,1316,1334,1342,1350,1363,1367,1371,1378,1388,1407,1422,
	1463,1475,1484,1491,1495,1498,1505,1510,1517,1522,1529,1533,1547,1559,1566,
	1581,1583,1597,1608,1626,1644,1650,1653,1659,1667,1673,1679,1697,1730,1748,
	1756,1759,1762,1771,1774,1781,1787,1793,1809,1814];

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
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
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
	public _unitName!: Token;
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
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
	public PERCENT_SIGN(): TerminalNode {
		return this.getToken(RegelSpraakParser.PERCENT_SIGN, 0);
	}
	public EURO_SYMBOL(): TerminalNode {
		return this.getToken(RegelSpraakParser.EURO_SYMBOL, 0);
	}
	public DOLLAR_SYMBOL(): TerminalNode {
		return this.getToken(RegelSpraakParser.DOLLAR_SYMBOL, 0);
	}
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
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
	public _abbrev!: UnitIdentifierContext;
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
	public EQUALS(): TerminalNode {
		return this.getToken(RegelSpraakParser.EQUALS, 0);
	}
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
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
	public UUR(): TerminalNode {
		return this.getToken(RegelSpraakParser.UUR, 0);
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
	public WEEK(): TerminalNode {
		return this.getToken(RegelSpraakParser.WEEK, 0);
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
	public SEMICOLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.SEMICOLON, 0);
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
	public DE(): TerminalNode {
		return this.getToken(RegelSpraakParser.DE, 0);
	}
	public HET(): TerminalNode {
		return this.getToken(RegelSpraakParser.HET, 0);
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


export class ParameterMetLidwoordContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
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
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public KENMERK(): TerminalNode {
		return this.getToken(RegelSpraakParser.KENMERK, 0);
	}
	public IDENTIFIER_list(): TerminalNode[] {
	    	return this.getTokens(RegelSpraakParser.IDENTIFIER);
	}
	public IDENTIFIER(i: number): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, i);
	}
	public ROL(): TerminalNode {
		return this.getToken(RegelSpraakParser.ROL, 0);
	}
	public NIET(): TerminalNode {
		return this.getToken(RegelSpraakParser.NIET, 0);
	}
	public KENMERKEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.KENMERKEN, 0);
	}
	public ROLLEN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ROLLEN, 0);
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


export class FeitCreatiePatternContext extends ParserRuleContext {
	public _role1!: FeitCreatieRolPhraseContext;
	public _article1!: Token;
	public _subject1!: FeitCreatieSubjectPhraseContext;
	public _role2!: FeitCreatieRolPhraseContext;
	public _article2!: Token;
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


export class BasisOnderwerpContext extends ParserRuleContext {
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
	public ALLE(): TerminalNode {
		return this.getToken(RegelSpraakParser.ALLE, 0);
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
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
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
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
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


export class BezieldeReferentieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public ZIJN(): TerminalNode {
		return this.getToken(RegelSpraakParser.ZIJN, 0);
	}
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
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
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public IS(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS, 0);
	}
	public expressie(): ExpressieContext {
		return this.getTypedRuleContext(ExpressieContext, 0) as ExpressieContext;
	}
	public SEMICOLON(): TerminalNode {
		return this.getToken(RegelSpraakParser.SEMICOLON, 0);
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


export class ExpressieContext extends ParserRuleContext {
	constructor(parser?: RegelSpraakParser, parent?: ParserRuleContext, invokingState?: number) {
		super(parent, invokingState);
    	this.parser = parser;
	}
	public logicalExpression(): LogicalExpressionContext {
		return this.getTypedRuleContext(LogicalExpressionContext, 0) as LogicalExpressionContext;
	}
    public get ruleIndex(): number {
    	return RegelSpraakParser.RULE_expressie;
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterExpressie) {
	 		listener.enterExpressie(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitExpressie) {
	 		listener.exitExpressie(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitExpressie) {
			return visitor.visitExpressie(this);
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
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
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
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
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
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
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
	public NUMBER(): TerminalNode {
		return this.getToken(RegelSpraakParser.NUMBER, 0);
	}
	public VAN(): TerminalNode {
		return this.getToken(RegelSpraakParser.VAN, 0);
	}
	public primaryExpression(): PrimaryExpressionContext {
		return this.getTypedRuleContext(PrimaryExpressionContext, 0) as PrimaryExpressionContext;
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
	public _unitName!: Token;
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
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
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
	public _unitName!: Token;
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
	public IDENTIFIER(): TerminalNode {
		return this.getToken(RegelSpraakParser.IDENTIFIER, 0);
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
	public identifier(): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, 0) as IdentifierContext;
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
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public VANAF(): TerminalNode {
		return this.getToken(RegelSpraakParser.VANAF, 0);
	}
	public identifier_list(): IdentifierContext[] {
		return this.getTypedRuleContexts(IdentifierContext) as IdentifierContext[];
	}
	public identifier(i: number): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, i) as IdentifierContext;
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
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public IN(): TerminalNode {
		return this.getToken(RegelSpraakParser.IN, 0);
	}
	public LBRACE(): TerminalNode {
		return this.getToken(RegelSpraakParser.LBRACE, 0);
	}
	public identifier_list(): IdentifierContext[] {
		return this.getTypedRuleContexts(IdentifierContext) as IdentifierContext[];
	}
	public identifier(i: number): IdentifierContext {
		return this.getTypedRuleContext(IdentifierContext, i) as IdentifierContext;
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
export class RegelStatusCheckContext extends RegelStatusConditionContext {
	public _name!: NaamwoordContext;
	public _op!: Token;
	constructor(parser: RegelSpraakParser, ctx: RegelStatusConditionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public REGEL(): TerminalNode {
		return this.getToken(RegelSpraakParser.REGEL, 0);
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
	}
	public IS_GEVUURD(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_GEVUURD, 0);
	}
	public IS_INCONSISTENT(): TerminalNode {
		return this.getToken(RegelSpraakParser.IS_INCONSISTENT, 0);
	}
	public enterRule(listener: RegelSpraakListener): void {
	    if(listener.enterRegelStatusCheck) {
	 		listener.enterRegelStatusCheck(this);
		}
	}
	public exitRule(listener: RegelSpraakListener): void {
	    if(listener.exitRegelStatusCheck) {
	 		listener.exitRegelStatusCheck(this);
		}
	}
	// @Override
	public accept<Result>(visitor: RegelSpraakVisitor<Result>): Result {
		if (visitor.visitRegelStatusCheck) {
			return visitor.visitRegelStatusCheck(this);
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
	public _prepPhrase!: NaamwoordContext;
	public _verb!: Token;
	constructor(parser: RegelSpraakParser, ctx: SubordinateClauseExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
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
	public _object!: NaamwoordContext;
	public _verb!: Token;
	constructor(parser: RegelSpraakParser, ctx: SubordinateClauseExpressionContext) {
		super(parser, ctx.parentCtx, ctx.invokingState);
		super.copyFrom(ctx);
	}
	public onderwerpReferentie(): OnderwerpReferentieContext {
		return this.getTypedRuleContext(OnderwerpReferentieContext, 0) as OnderwerpReferentieContext;
	}
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
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
	public _kenmerk!: NaamwoordContext;
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
	public naamwoord(): NaamwoordContext {
		return this.getTypedRuleContext(NaamwoordContext, 0) as NaamwoordContext;
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
