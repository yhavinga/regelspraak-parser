// Generated from RegelSpraak.g4 by ANTLR 4.13.1

import {ParseTreeListener} from "antlr4";


import { RegelSpraakDocumentContext } from "./RegelSpraakParser";
import { DefinitieContext } from "./RegelSpraakParser";
import { BeslistabelContext } from "./RegelSpraakParser";
import { BeslistabelTableContext } from "./RegelSpraakParser";
import { BeslistabelHeaderContext } from "./RegelSpraakParser";
import { BeslistabelSeparatorContext } from "./RegelSpraakParser";
import { BeslistabelRowContext } from "./RegelSpraakParser";
import { BeslistabelCellValueContext } from "./RegelSpraakParser";
import { BeslistabelColumnTextContext } from "./RegelSpraakParser";
import { IdentifierContext } from "./RegelSpraakParser";
import { IdentifierOrKeywordContext } from "./RegelSpraakParser";
import { IdentifierOrKeywordNoIsContext } from "./RegelSpraakParser";
import { NaamPhraseContext } from "./RegelSpraakParser";
import { NaamPhraseNoIsContext } from "./RegelSpraakParser";
import { NaamwoordContext } from "./RegelSpraakParser";
import { NaamwoordNoIsContext } from "./RegelSpraakParser";
import { VoorzetselContext } from "./RegelSpraakParser";
import { DatumLiteralContext } from "./RegelSpraakParser";
import { UnitContext } from "./RegelSpraakParser";
import { ObjectTypeDefinitionContext } from "./RegelSpraakParser";
import { ObjectTypeMemberContext } from "./RegelSpraakParser";
import { KenmerkSpecificatieContext } from "./RegelSpraakParser";
import { AttribuutSpecificatieContext } from "./RegelSpraakParser";
import { DatatypeContext } from "./RegelSpraakParser";
import { LijstDatatypeContext } from "./RegelSpraakParser";
import { NumeriekDatatypeContext } from "./RegelSpraakParser";
import { TekstDatatypeContext } from "./RegelSpraakParser";
import { PercentageDatatypeContext } from "./RegelSpraakParser";
import { BooleanDatatypeContext } from "./RegelSpraakParser";
import { DatumTijdDatatypeContext } from "./RegelSpraakParser";
import { GetalSpecificatieContext } from "./RegelSpraakParser";
import { DomeinDefinitionContext } from "./RegelSpraakParser";
import { DomeinTypeContext } from "./RegelSpraakParser";
import { EnumeratieSpecificatieContext } from "./RegelSpraakParser";
import { DomeinRefContext } from "./RegelSpraakParser";
import { ObjectTypeRefContext } from "./RegelSpraakParser";
import { EenheidsysteemDefinitionContext } from "./RegelSpraakParser";
import { EenheidEntryContext } from "./RegelSpraakParser";
import { UnitIdentifierContext } from "./RegelSpraakParser";
import { EenheidExpressieContext } from "./RegelSpraakParser";
import { EenheidMachtContext } from "./RegelSpraakParser";
import { DimensieDefinitionContext } from "./RegelSpraakParser";
import { VoorzetselSpecificatieContext } from "./RegelSpraakParser";
import { LabelWaardeSpecificatieContext } from "./RegelSpraakParser";
import { TijdlijnContext } from "./RegelSpraakParser";
import { DimensieRefContext } from "./RegelSpraakParser";
import { ParameterDefinitionContext } from "./RegelSpraakParser";
import { ParameterNamePhraseContext } from "./RegelSpraakParser";
import { ParameterMetLidwoordContext } from "./RegelSpraakParser";
import { FeitTypeDefinitionContext } from "./RegelSpraakParser";
import { RolDefinitionContext } from "./RegelSpraakParser";
import { RolObjectTypeContext } from "./RegelSpraakParser";
import { RolContentWordsContext } from "./RegelSpraakParser";
import { CardinalityLineContext } from "./RegelSpraakParser";
import { CardinalityWordContext } from "./RegelSpraakParser";
import { RegelContext } from "./RegelSpraakParser";
import { RegelGroepContext } from "./RegelSpraakParser";
import { RegelNameContext } from "./RegelSpraakParser";
import { RegelVersieContext } from "./RegelSpraakParser";
import { VersieGeldigheidContext } from "./RegelSpraakParser";
import { DagsoortdefinitieResultaatContext } from "./RegelSpraakParser";
import { GelijkstellingResultaatContext } from "./RegelSpraakParser";
import { FeitCreatieResultaatContext } from "./RegelSpraakParser";
import { KenmerkFeitResultaatContext } from "./RegelSpraakParser";
import { ObjectCreatieResultaatContext } from "./RegelSpraakParser";
import { VerdelingContext } from "./RegelSpraakParser";
import { FeitCreatiePatternContext } from "./RegelSpraakParser";
import { FeitCreatieRolPhraseContext } from "./RegelSpraakParser";
import { FeitCreatieSubjectPhraseContext } from "./RegelSpraakParser";
import { FeitCreatieSubjectWordContext } from "./RegelSpraakParser";
import { FeitCreatieWordContext } from "./RegelSpraakParser";
import { VoorzetselNietVanContext } from "./RegelSpraakParser";
import { ObjectCreatieContext } from "./RegelSpraakParser";
import { ObjectAttributeInitContext } from "./RegelSpraakParser";
import { AttributeInitVervolgContext } from "./RegelSpraakParser";
import { SimpleNaamwoordContext } from "./RegelSpraakParser";
import { ConsistentieregelContext } from "./RegelSpraakParser";
import { UniekzijnResultaatContext } from "./RegelSpraakParser";
import { AlleAttributenVanObjecttypeContext } from "./RegelSpraakParser";
import { InconsistentResultaatContext } from "./RegelSpraakParser";
import { VoorwaardeDeelContext } from "./RegelSpraakParser";
import { ToplevelSamengesteldeVoorwaardeContext } from "./RegelSpraakParser";
import { VoorwaardeKwantificatieContext } from "./RegelSpraakParser";
import { SamengesteldeVoorwaardeOnderdeelContext } from "./RegelSpraakParser";
import { BulletPrefixContext } from "./RegelSpraakParser";
import { ElementaireVoorwaardeContext } from "./RegelSpraakParser";
import { GenesteSamengesteldeVoorwaardeContext } from "./RegelSpraakParser";
import { OnderwerpReferentieContext } from "./RegelSpraakParser";
import { OnderwerpBasisContext } from "./RegelSpraakParser";
import { BasisOnderwerpContext } from "./RegelSpraakParser";
import { AttribuutReferentieContext } from "./RegelSpraakParser";
import { AttribuutMetLidwoordContext } from "./RegelSpraakParser";
import { KenmerkNaamContext } from "./RegelSpraakParser";
import { BezieldeReferentieContext } from "./RegelSpraakParser";
import { PredicaatContext } from "./RegelSpraakParser";
import { ElementairPredicaatContext } from "./RegelSpraakParser";
import { ObjectPredicaatContext } from "./RegelSpraakParser";
import { EenzijdigeObjectVergelijkingContext } from "./RegelSpraakParser";
import { RolNaamContext } from "./RegelSpraakParser";
import { AttribuutVergelijkingsPredicaatContext } from "./RegelSpraakParser";
import { GetalPredicaatContext } from "./RegelSpraakParser";
import { TekstPredicaatContext } from "./RegelSpraakParser";
import { DatumPredicaatContext } from "./RegelSpraakParser";
import { SamengesteldPredicaatContext } from "./RegelSpraakParser";
import { SamengesteldeVoorwaardeOnderdeelInPredicaatContext } from "./RegelSpraakParser";
import { ElementaireVoorwaardeInPredicaatContext } from "./RegelSpraakParser";
import { VergelijkingInPredicaatContext } from "./RegelSpraakParser";
import { GenesteSamengesteldeVoorwaardeInPredicaatContext } from "./RegelSpraakParser";
import { GetalVergelijkingsOperatorMeervoudContext } from "./RegelSpraakParser";
import { TekstVergelijkingsOperatorMeervoudContext } from "./RegelSpraakParser";
import { DatumVergelijkingsOperatorMeervoudContext } from "./RegelSpraakParser";
import { GetalExpressieContext } from "./RegelSpraakParser";
import { TekstExpressieContext } from "./RegelSpraakParser";
import { DatumExpressieContext } from "./RegelSpraakParser";
import { VariabeleDeelContext } from "./RegelSpraakParser";
import { VariabeleToekenningContext } from "./RegelSpraakParser";
import { ExpressieContext } from "./RegelSpraakParser";
import { LogicalExprContext } from "./RegelSpraakParser";
import { SubordinateClauseExprContext } from "./RegelSpraakParser";
import { IsKenmerkExprContext } from "./RegelSpraakParser";
import { HeeftKenmerkExprContext } from "./RegelSpraakParser";
import { BinaryComparisonExprContext } from "./RegelSpraakParser";
import { UnaryConditionExprContext } from "./RegelSpraakParser";
import { RegelStatusConditionExprContext } from "./RegelSpraakParser";
import { ComparisonOperatorContext } from "./RegelSpraakParser";
import { AdditiveExpressionContext } from "./RegelSpraakParser";
import { AdditiveOperatorContext } from "./RegelSpraakParser";
import { MultiplicativeExpressionContext } from "./RegelSpraakParser";
import { MultiplicativeOperatorContext } from "./RegelSpraakParser";
import { PowerExpressionContext } from "./RegelSpraakParser";
import { PowerOperatorContext } from "./RegelSpraakParser";
import { WortelFuncExprContext } from "./RegelSpraakParser";
import { BooleanTrueLiteralExprContext } from "./RegelSpraakParser";
import { AbsValFuncExprContext } from "./RegelSpraakParser";
import { MaxValFuncExprContext } from "./RegelSpraakParser";
import { RekendatumKeywordExprContext } from "./RegelSpraakParser";
import { EnumLiteralExprContext } from "./RegelSpraakParser";
import { NumberLiteralExprContext } from "./RegelSpraakParser";
import { DatumLiteralExprContext } from "./RegelSpraakParser";
import { AantalFuncExprContext } from "./RegelSpraakParser";
import { UnaryNietExprContext } from "./RegelSpraakParser";
import { ConcatenatieExprContext } from "./RegelSpraakParser";
import { SomAlleAttribuutExprContext } from "./RegelSpraakParser";
import { AttrRefExprContext } from "./RegelSpraakParser";
import { DagUitFuncExprContext } from "./RegelSpraakParser";
import { BegrenzingExprContext } from "./RegelSpraakParser";
import { NaamwoordExprContext } from "./RegelSpraakParser";
import { BooleanFalseLiteralExprContext } from "./RegelSpraakParser";
import { JaarUitFuncExprContext } from "./RegelSpraakParser";
import { TotaalVanExprContext } from "./RegelSpraakParser";
import { TijdsevenredigDeelExprContext } from "./RegelSpraakParser";
import { CapitalizedTijdsevenredigDeelExprContext } from "./RegelSpraakParser";
import { AantalAttribuutExprContext } from "./RegelSpraakParser";
import { ParenExprContext } from "./RegelSpraakParser";
import { DimensieRangeAggExprContext } from "./RegelSpraakParser";
import { DatumMetFuncExprContext } from "./RegelSpraakParser";
import { PercentageLiteralExprContext } from "./RegelSpraakParser";
import { StringLiteralExprContext } from "./RegelSpraakParser";
import { PercentageFuncExprContext } from "./RegelSpraakParser";
import { EersteDatumFuncExprContext } from "./RegelSpraakParser";
import { PasenFuncExprContext } from "./RegelSpraakParser";
import { AbsTijdsduurFuncExprContext } from "./RegelSpraakParser";
import { MaandUitFuncExprContext } from "./RegelSpraakParser";
import { CapitalizedTotaalVanExprContext } from "./RegelSpraakParser";
import { IdentifierExprContext } from "./RegelSpraakParser";
import { DimensieAggExprContext } from "./RegelSpraakParser";
import { TijdsduurFuncExprContext } from "./RegelSpraakParser";
import { OnderwerpRefExprContext } from "./RegelSpraakParser";
import { SomFuncExprContext } from "./RegelSpraakParser";
import { SomAlleExprContext } from "./RegelSpraakParser";
import { SimpleConcatenatieExprContext } from "./RegelSpraakParser";
import { MinValFuncExprContext } from "./RegelSpraakParser";
import { MaxAlleAttribuutExprContext } from "./RegelSpraakParser";
import { BezieldeRefExprContext } from "./RegelSpraakParser";
import { DateCalcExprContext } from "./RegelSpraakParser";
import { MinAlleAttribuutExprContext } from "./RegelSpraakParser";
import { AfrondingExprContext } from "./RegelSpraakParser";
import { LaatsteDatumFuncExprContext } from "./RegelSpraakParser";
import { HetAantalDagenInExprContext } from "./RegelSpraakParser";
import { UnaryMinusExprContext } from "./RegelSpraakParser";
import { ParamRefExprContext } from "./RegelSpraakParser";
import { PronounExprContext } from "./RegelSpraakParser";
import { AfrondingContext } from "./RegelSpraakParser";
import { BegrenzingContext } from "./RegelSpraakParser";
import { BegrenzingMinimumContext } from "./RegelSpraakParser";
import { BegrenzingMaximumContext } from "./RegelSpraakParser";
import { ConditieBijExpressieContext } from "./RegelSpraakParser";
import { PeriodevergelijkingEnkelvoudigContext } from "./RegelSpraakParser";
import { VanafPeriodeContext } from "./RegelSpraakParser";
import { TotPeriodeContext } from "./RegelSpraakParser";
import { TotEnMetPeriodeContext } from "./RegelSpraakParser";
import { VanTotPeriodeContext } from "./RegelSpraakParser";
import { VanTotEnMetPeriodeContext } from "./RegelSpraakParser";
import { DateExpressionContext } from "./RegelSpraakParser";
import { GetalAggregatieFunctieContext } from "./RegelSpraakParser";
import { DatumAggregatieFunctieContext } from "./RegelSpraakParser";
import { DimensieSelectieContext } from "./RegelSpraakParser";
import { AggregerenOverAlleDimensiesContext } from "./RegelSpraakParser";
import { AggregerenOverVerzamelingContext } from "./RegelSpraakParser";
import { AggregerenOverBereikContext } from "./RegelSpraakParser";
import { UnaryCheckConditionContext } from "./RegelSpraakParser";
import { UnaryNumeriekExactConditionContext } from "./RegelSpraakParser";
import { UnaryDagsoortConditionContext } from "./RegelSpraakParser";
import { UnaryKenmerkConditionContext } from "./RegelSpraakParser";
import { UnaryRolConditionContext } from "./RegelSpraakParser";
import { UnaryUniekConditionContext } from "./RegelSpraakParser";
import { UnaryInconsistentDataConditionContext } from "./RegelSpraakParser";
import { RegelStatusGevuurdCheckContext } from "./RegelSpraakParser";
import { RegelStatusInconsistentCheckContext } from "./RegelSpraakParser";
import { SubordinateHasExprContext } from "./RegelSpraakParser";
import { SubordinateIsWithExprContext } from "./RegelSpraakParser";
import { SubordinateIsKenmerkExprContext } from "./RegelSpraakParser";
import { DagsoortDefinitionContext } from "./RegelSpraakParser";
import { VerdelingResultaatContext } from "./RegelSpraakParser";
import { VerdelingMethodeSimpleContext } from "./RegelSpraakParser";
import { VerdelingMethodeMultiLineContext } from "./RegelSpraakParser";
import { VerdelingMethodeBulletListContext } from "./RegelSpraakParser";
import { VerdelingMethodeBulletContext } from "./RegelSpraakParser";
import { VerdelingGelijkeDelenContext } from "./RegelSpraakParser";
import { VerdelingNaarRatoContext } from "./RegelSpraakParser";
import { VerdelingOpVolgordeContext } from "./RegelSpraakParser";
import { VerdelingTieBreakContext } from "./RegelSpraakParser";
import { VerdelingMaximumContext } from "./RegelSpraakParser";
import { VerdelingAfrondingContext } from "./RegelSpraakParser";
import { VerdelingRestContext } from "./RegelSpraakParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `RegelSpraakParser`.
 */
export default class RegelSpraakListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.regelSpraakDocument`.
	 * @param ctx the parse tree
	 */
	enterRegelSpraakDocument?: (ctx: RegelSpraakDocumentContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.regelSpraakDocument`.
	 * @param ctx the parse tree
	 */
	exitRegelSpraakDocument?: (ctx: RegelSpraakDocumentContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.definitie`.
	 * @param ctx the parse tree
	 */
	enterDefinitie?: (ctx: DefinitieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.definitie`.
	 * @param ctx the parse tree
	 */
	exitDefinitie?: (ctx: DefinitieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.beslistabel`.
	 * @param ctx the parse tree
	 */
	enterBeslistabel?: (ctx: BeslistabelContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.beslistabel`.
	 * @param ctx the parse tree
	 */
	exitBeslistabel?: (ctx: BeslistabelContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.beslistabelTable`.
	 * @param ctx the parse tree
	 */
	enterBeslistabelTable?: (ctx: BeslistabelTableContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.beslistabelTable`.
	 * @param ctx the parse tree
	 */
	exitBeslistabelTable?: (ctx: BeslistabelTableContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.beslistabelHeader`.
	 * @param ctx the parse tree
	 */
	enterBeslistabelHeader?: (ctx: BeslistabelHeaderContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.beslistabelHeader`.
	 * @param ctx the parse tree
	 */
	exitBeslistabelHeader?: (ctx: BeslistabelHeaderContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.beslistabelSeparator`.
	 * @param ctx the parse tree
	 */
	enterBeslistabelSeparator?: (ctx: BeslistabelSeparatorContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.beslistabelSeparator`.
	 * @param ctx the parse tree
	 */
	exitBeslistabelSeparator?: (ctx: BeslistabelSeparatorContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.beslistabelRow`.
	 * @param ctx the parse tree
	 */
	enterBeslistabelRow?: (ctx: BeslistabelRowContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.beslistabelRow`.
	 * @param ctx the parse tree
	 */
	exitBeslistabelRow?: (ctx: BeslistabelRowContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.beslistabelCellValue`.
	 * @param ctx the parse tree
	 */
	enterBeslistabelCellValue?: (ctx: BeslistabelCellValueContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.beslistabelCellValue`.
	 * @param ctx the parse tree
	 */
	exitBeslistabelCellValue?: (ctx: BeslistabelCellValueContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.beslistabelColumnText`.
	 * @param ctx the parse tree
	 */
	enterBeslistabelColumnText?: (ctx: BeslistabelColumnTextContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.beslistabelColumnText`.
	 * @param ctx the parse tree
	 */
	exitBeslistabelColumnText?: (ctx: BeslistabelColumnTextContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.identifier`.
	 * @param ctx the parse tree
	 */
	enterIdentifier?: (ctx: IdentifierContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.identifier`.
	 * @param ctx the parse tree
	 */
	exitIdentifier?: (ctx: IdentifierContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.identifierOrKeyword`.
	 * @param ctx the parse tree
	 */
	enterIdentifierOrKeyword?: (ctx: IdentifierOrKeywordContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.identifierOrKeyword`.
	 * @param ctx the parse tree
	 */
	exitIdentifierOrKeyword?: (ctx: IdentifierOrKeywordContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.identifierOrKeywordNoIs`.
	 * @param ctx the parse tree
	 */
	enterIdentifierOrKeywordNoIs?: (ctx: IdentifierOrKeywordNoIsContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.identifierOrKeywordNoIs`.
	 * @param ctx the parse tree
	 */
	exitIdentifierOrKeywordNoIs?: (ctx: IdentifierOrKeywordNoIsContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.naamPhrase`.
	 * @param ctx the parse tree
	 */
	enterNaamPhrase?: (ctx: NaamPhraseContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.naamPhrase`.
	 * @param ctx the parse tree
	 */
	exitNaamPhrase?: (ctx: NaamPhraseContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.naamPhraseNoIs`.
	 * @param ctx the parse tree
	 */
	enterNaamPhraseNoIs?: (ctx: NaamPhraseNoIsContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.naamPhraseNoIs`.
	 * @param ctx the parse tree
	 */
	exitNaamPhraseNoIs?: (ctx: NaamPhraseNoIsContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.naamwoord`.
	 * @param ctx the parse tree
	 */
	enterNaamwoord?: (ctx: NaamwoordContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.naamwoord`.
	 * @param ctx the parse tree
	 */
	exitNaamwoord?: (ctx: NaamwoordContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.naamwoordNoIs`.
	 * @param ctx the parse tree
	 */
	enterNaamwoordNoIs?: (ctx: NaamwoordNoIsContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.naamwoordNoIs`.
	 * @param ctx the parse tree
	 */
	exitNaamwoordNoIs?: (ctx: NaamwoordNoIsContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.voorzetsel`.
	 * @param ctx the parse tree
	 */
	enterVoorzetsel?: (ctx: VoorzetselContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.voorzetsel`.
	 * @param ctx the parse tree
	 */
	exitVoorzetsel?: (ctx: VoorzetselContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.datumLiteral`.
	 * @param ctx the parse tree
	 */
	enterDatumLiteral?: (ctx: DatumLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.datumLiteral`.
	 * @param ctx the parse tree
	 */
	exitDatumLiteral?: (ctx: DatumLiteralContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.unit`.
	 * @param ctx the parse tree
	 */
	enterUnit?: (ctx: UnitContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.unit`.
	 * @param ctx the parse tree
	 */
	exitUnit?: (ctx: UnitContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.objectTypeDefinition`.
	 * @param ctx the parse tree
	 */
	enterObjectTypeDefinition?: (ctx: ObjectTypeDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.objectTypeDefinition`.
	 * @param ctx the parse tree
	 */
	exitObjectTypeDefinition?: (ctx: ObjectTypeDefinitionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.objectTypeMember`.
	 * @param ctx the parse tree
	 */
	enterObjectTypeMember?: (ctx: ObjectTypeMemberContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.objectTypeMember`.
	 * @param ctx the parse tree
	 */
	exitObjectTypeMember?: (ctx: ObjectTypeMemberContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.kenmerkSpecificatie`.
	 * @param ctx the parse tree
	 */
	enterKenmerkSpecificatie?: (ctx: KenmerkSpecificatieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.kenmerkSpecificatie`.
	 * @param ctx the parse tree
	 */
	exitKenmerkSpecificatie?: (ctx: KenmerkSpecificatieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.attribuutSpecificatie`.
	 * @param ctx the parse tree
	 */
	enterAttribuutSpecificatie?: (ctx: AttribuutSpecificatieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.attribuutSpecificatie`.
	 * @param ctx the parse tree
	 */
	exitAttribuutSpecificatie?: (ctx: AttribuutSpecificatieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.datatype`.
	 * @param ctx the parse tree
	 */
	enterDatatype?: (ctx: DatatypeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.datatype`.
	 * @param ctx the parse tree
	 */
	exitDatatype?: (ctx: DatatypeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.lijstDatatype`.
	 * @param ctx the parse tree
	 */
	enterLijstDatatype?: (ctx: LijstDatatypeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.lijstDatatype`.
	 * @param ctx the parse tree
	 */
	exitLijstDatatype?: (ctx: LijstDatatypeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.numeriekDatatype`.
	 * @param ctx the parse tree
	 */
	enterNumeriekDatatype?: (ctx: NumeriekDatatypeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.numeriekDatatype`.
	 * @param ctx the parse tree
	 */
	exitNumeriekDatatype?: (ctx: NumeriekDatatypeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.tekstDatatype`.
	 * @param ctx the parse tree
	 */
	enterTekstDatatype?: (ctx: TekstDatatypeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.tekstDatatype`.
	 * @param ctx the parse tree
	 */
	exitTekstDatatype?: (ctx: TekstDatatypeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.percentageDatatype`.
	 * @param ctx the parse tree
	 */
	enterPercentageDatatype?: (ctx: PercentageDatatypeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.percentageDatatype`.
	 * @param ctx the parse tree
	 */
	exitPercentageDatatype?: (ctx: PercentageDatatypeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.booleanDatatype`.
	 * @param ctx the parse tree
	 */
	enterBooleanDatatype?: (ctx: BooleanDatatypeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.booleanDatatype`.
	 * @param ctx the parse tree
	 */
	exitBooleanDatatype?: (ctx: BooleanDatatypeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.datumTijdDatatype`.
	 * @param ctx the parse tree
	 */
	enterDatumTijdDatatype?: (ctx: DatumTijdDatatypeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.datumTijdDatatype`.
	 * @param ctx the parse tree
	 */
	exitDatumTijdDatatype?: (ctx: DatumTijdDatatypeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.getalSpecificatie`.
	 * @param ctx the parse tree
	 */
	enterGetalSpecificatie?: (ctx: GetalSpecificatieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.getalSpecificatie`.
	 * @param ctx the parse tree
	 */
	exitGetalSpecificatie?: (ctx: GetalSpecificatieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.domeinDefinition`.
	 * @param ctx the parse tree
	 */
	enterDomeinDefinition?: (ctx: DomeinDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.domeinDefinition`.
	 * @param ctx the parse tree
	 */
	exitDomeinDefinition?: (ctx: DomeinDefinitionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.domeinType`.
	 * @param ctx the parse tree
	 */
	enterDomeinType?: (ctx: DomeinTypeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.domeinType`.
	 * @param ctx the parse tree
	 */
	exitDomeinType?: (ctx: DomeinTypeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.enumeratieSpecificatie`.
	 * @param ctx the parse tree
	 */
	enterEnumeratieSpecificatie?: (ctx: EnumeratieSpecificatieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.enumeratieSpecificatie`.
	 * @param ctx the parse tree
	 */
	exitEnumeratieSpecificatie?: (ctx: EnumeratieSpecificatieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.domeinRef`.
	 * @param ctx the parse tree
	 */
	enterDomeinRef?: (ctx: DomeinRefContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.domeinRef`.
	 * @param ctx the parse tree
	 */
	exitDomeinRef?: (ctx: DomeinRefContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.objectTypeRef`.
	 * @param ctx the parse tree
	 */
	enterObjectTypeRef?: (ctx: ObjectTypeRefContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.objectTypeRef`.
	 * @param ctx the parse tree
	 */
	exitObjectTypeRef?: (ctx: ObjectTypeRefContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.eenheidsysteemDefinition`.
	 * @param ctx the parse tree
	 */
	enterEenheidsysteemDefinition?: (ctx: EenheidsysteemDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.eenheidsysteemDefinition`.
	 * @param ctx the parse tree
	 */
	exitEenheidsysteemDefinition?: (ctx: EenheidsysteemDefinitionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.eenheidEntry`.
	 * @param ctx the parse tree
	 */
	enterEenheidEntry?: (ctx: EenheidEntryContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.eenheidEntry`.
	 * @param ctx the parse tree
	 */
	exitEenheidEntry?: (ctx: EenheidEntryContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.unitIdentifier`.
	 * @param ctx the parse tree
	 */
	enterUnitIdentifier?: (ctx: UnitIdentifierContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.unitIdentifier`.
	 * @param ctx the parse tree
	 */
	exitUnitIdentifier?: (ctx: UnitIdentifierContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.eenheidExpressie`.
	 * @param ctx the parse tree
	 */
	enterEenheidExpressie?: (ctx: EenheidExpressieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.eenheidExpressie`.
	 * @param ctx the parse tree
	 */
	exitEenheidExpressie?: (ctx: EenheidExpressieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.eenheidMacht`.
	 * @param ctx the parse tree
	 */
	enterEenheidMacht?: (ctx: EenheidMachtContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.eenheidMacht`.
	 * @param ctx the parse tree
	 */
	exitEenheidMacht?: (ctx: EenheidMachtContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.dimensieDefinition`.
	 * @param ctx the parse tree
	 */
	enterDimensieDefinition?: (ctx: DimensieDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.dimensieDefinition`.
	 * @param ctx the parse tree
	 */
	exitDimensieDefinition?: (ctx: DimensieDefinitionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.voorzetselSpecificatie`.
	 * @param ctx the parse tree
	 */
	enterVoorzetselSpecificatie?: (ctx: VoorzetselSpecificatieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.voorzetselSpecificatie`.
	 * @param ctx the parse tree
	 */
	exitVoorzetselSpecificatie?: (ctx: VoorzetselSpecificatieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.labelWaardeSpecificatie`.
	 * @param ctx the parse tree
	 */
	enterLabelWaardeSpecificatie?: (ctx: LabelWaardeSpecificatieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.labelWaardeSpecificatie`.
	 * @param ctx the parse tree
	 */
	exitLabelWaardeSpecificatie?: (ctx: LabelWaardeSpecificatieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.tijdlijn`.
	 * @param ctx the parse tree
	 */
	enterTijdlijn?: (ctx: TijdlijnContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.tijdlijn`.
	 * @param ctx the parse tree
	 */
	exitTijdlijn?: (ctx: TijdlijnContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.dimensieRef`.
	 * @param ctx the parse tree
	 */
	enterDimensieRef?: (ctx: DimensieRefContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.dimensieRef`.
	 * @param ctx the parse tree
	 */
	exitDimensieRef?: (ctx: DimensieRefContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.parameterDefinition`.
	 * @param ctx the parse tree
	 */
	enterParameterDefinition?: (ctx: ParameterDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.parameterDefinition`.
	 * @param ctx the parse tree
	 */
	exitParameterDefinition?: (ctx: ParameterDefinitionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.parameterNamePhrase`.
	 * @param ctx the parse tree
	 */
	enterParameterNamePhrase?: (ctx: ParameterNamePhraseContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.parameterNamePhrase`.
	 * @param ctx the parse tree
	 */
	exitParameterNamePhrase?: (ctx: ParameterNamePhraseContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.parameterMetLidwoord`.
	 * @param ctx the parse tree
	 */
	enterParameterMetLidwoord?: (ctx: ParameterMetLidwoordContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.parameterMetLidwoord`.
	 * @param ctx the parse tree
	 */
	exitParameterMetLidwoord?: (ctx: ParameterMetLidwoordContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.feitTypeDefinition`.
	 * @param ctx the parse tree
	 */
	enterFeitTypeDefinition?: (ctx: FeitTypeDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.feitTypeDefinition`.
	 * @param ctx the parse tree
	 */
	exitFeitTypeDefinition?: (ctx: FeitTypeDefinitionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.rolDefinition`.
	 * @param ctx the parse tree
	 */
	enterRolDefinition?: (ctx: RolDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.rolDefinition`.
	 * @param ctx the parse tree
	 */
	exitRolDefinition?: (ctx: RolDefinitionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.rolObjectType`.
	 * @param ctx the parse tree
	 */
	enterRolObjectType?: (ctx: RolObjectTypeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.rolObjectType`.
	 * @param ctx the parse tree
	 */
	exitRolObjectType?: (ctx: RolObjectTypeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.rolContentWords`.
	 * @param ctx the parse tree
	 */
	enterRolContentWords?: (ctx: RolContentWordsContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.rolContentWords`.
	 * @param ctx the parse tree
	 */
	exitRolContentWords?: (ctx: RolContentWordsContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.cardinalityLine`.
	 * @param ctx the parse tree
	 */
	enterCardinalityLine?: (ctx: CardinalityLineContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.cardinalityLine`.
	 * @param ctx the parse tree
	 */
	exitCardinalityLine?: (ctx: CardinalityLineContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.cardinalityWord`.
	 * @param ctx the parse tree
	 */
	enterCardinalityWord?: (ctx: CardinalityWordContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.cardinalityWord`.
	 * @param ctx the parse tree
	 */
	exitCardinalityWord?: (ctx: CardinalityWordContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.regel`.
	 * @param ctx the parse tree
	 */
	enterRegel?: (ctx: RegelContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.regel`.
	 * @param ctx the parse tree
	 */
	exitRegel?: (ctx: RegelContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.regelGroep`.
	 * @param ctx the parse tree
	 */
	enterRegelGroep?: (ctx: RegelGroepContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.regelGroep`.
	 * @param ctx the parse tree
	 */
	exitRegelGroep?: (ctx: RegelGroepContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.regelName`.
	 * @param ctx the parse tree
	 */
	enterRegelName?: (ctx: RegelNameContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.regelName`.
	 * @param ctx the parse tree
	 */
	exitRegelName?: (ctx: RegelNameContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.regelVersie`.
	 * @param ctx the parse tree
	 */
	enterRegelVersie?: (ctx: RegelVersieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.regelVersie`.
	 * @param ctx the parse tree
	 */
	exitRegelVersie?: (ctx: RegelVersieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.versieGeldigheid`.
	 * @param ctx the parse tree
	 */
	enterVersieGeldigheid?: (ctx: VersieGeldigheidContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.versieGeldigheid`.
	 * @param ctx the parse tree
	 */
	exitVersieGeldigheid?: (ctx: VersieGeldigheidContext) => void;
	/**
	 * Enter a parse tree produced by the `DagsoortdefinitieResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	enterDagsoortdefinitieResultaat?: (ctx: DagsoortdefinitieResultaatContext) => void;
	/**
	 * Exit a parse tree produced by the `DagsoortdefinitieResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	exitDagsoortdefinitieResultaat?: (ctx: DagsoortdefinitieResultaatContext) => void;
	/**
	 * Enter a parse tree produced by the `GelijkstellingResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	enterGelijkstellingResultaat?: (ctx: GelijkstellingResultaatContext) => void;
	/**
	 * Exit a parse tree produced by the `GelijkstellingResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	exitGelijkstellingResultaat?: (ctx: GelijkstellingResultaatContext) => void;
	/**
	 * Enter a parse tree produced by the `FeitCreatieResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	enterFeitCreatieResultaat?: (ctx: FeitCreatieResultaatContext) => void;
	/**
	 * Exit a parse tree produced by the `FeitCreatieResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	exitFeitCreatieResultaat?: (ctx: FeitCreatieResultaatContext) => void;
	/**
	 * Enter a parse tree produced by the `KenmerkFeitResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	enterKenmerkFeitResultaat?: (ctx: KenmerkFeitResultaatContext) => void;
	/**
	 * Exit a parse tree produced by the `KenmerkFeitResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	exitKenmerkFeitResultaat?: (ctx: KenmerkFeitResultaatContext) => void;
	/**
	 * Enter a parse tree produced by the `ObjectCreatieResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	enterObjectCreatieResultaat?: (ctx: ObjectCreatieResultaatContext) => void;
	/**
	 * Exit a parse tree produced by the `ObjectCreatieResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	exitObjectCreatieResultaat?: (ctx: ObjectCreatieResultaatContext) => void;
	/**
	 * Enter a parse tree produced by the `Verdeling`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	enterVerdeling?: (ctx: VerdelingContext) => void;
	/**
	 * Exit a parse tree produced by the `Verdeling`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 */
	exitVerdeling?: (ctx: VerdelingContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.feitCreatiePattern`.
	 * @param ctx the parse tree
	 */
	enterFeitCreatiePattern?: (ctx: FeitCreatiePatternContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.feitCreatiePattern`.
	 * @param ctx the parse tree
	 */
	exitFeitCreatiePattern?: (ctx: FeitCreatiePatternContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.feitCreatieRolPhrase`.
	 * @param ctx the parse tree
	 */
	enterFeitCreatieRolPhrase?: (ctx: FeitCreatieRolPhraseContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.feitCreatieRolPhrase`.
	 * @param ctx the parse tree
	 */
	exitFeitCreatieRolPhrase?: (ctx: FeitCreatieRolPhraseContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.feitCreatieSubjectPhrase`.
	 * @param ctx the parse tree
	 */
	enterFeitCreatieSubjectPhrase?: (ctx: FeitCreatieSubjectPhraseContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.feitCreatieSubjectPhrase`.
	 * @param ctx the parse tree
	 */
	exitFeitCreatieSubjectPhrase?: (ctx: FeitCreatieSubjectPhraseContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.feitCreatieSubjectWord`.
	 * @param ctx the parse tree
	 */
	enterFeitCreatieSubjectWord?: (ctx: FeitCreatieSubjectWordContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.feitCreatieSubjectWord`.
	 * @param ctx the parse tree
	 */
	exitFeitCreatieSubjectWord?: (ctx: FeitCreatieSubjectWordContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.feitCreatieWord`.
	 * @param ctx the parse tree
	 */
	enterFeitCreatieWord?: (ctx: FeitCreatieWordContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.feitCreatieWord`.
	 * @param ctx the parse tree
	 */
	exitFeitCreatieWord?: (ctx: FeitCreatieWordContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.voorzetselNietVan`.
	 * @param ctx the parse tree
	 */
	enterVoorzetselNietVan?: (ctx: VoorzetselNietVanContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.voorzetselNietVan`.
	 * @param ctx the parse tree
	 */
	exitVoorzetselNietVan?: (ctx: VoorzetselNietVanContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.objectCreatie`.
	 * @param ctx the parse tree
	 */
	enterObjectCreatie?: (ctx: ObjectCreatieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.objectCreatie`.
	 * @param ctx the parse tree
	 */
	exitObjectCreatie?: (ctx: ObjectCreatieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.objectAttributeInit`.
	 * @param ctx the parse tree
	 */
	enterObjectAttributeInit?: (ctx: ObjectAttributeInitContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.objectAttributeInit`.
	 * @param ctx the parse tree
	 */
	exitObjectAttributeInit?: (ctx: ObjectAttributeInitContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.attributeInitVervolg`.
	 * @param ctx the parse tree
	 */
	enterAttributeInitVervolg?: (ctx: AttributeInitVervolgContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.attributeInitVervolg`.
	 * @param ctx the parse tree
	 */
	exitAttributeInitVervolg?: (ctx: AttributeInitVervolgContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.simpleNaamwoord`.
	 * @param ctx the parse tree
	 */
	enterSimpleNaamwoord?: (ctx: SimpleNaamwoordContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.simpleNaamwoord`.
	 * @param ctx the parse tree
	 */
	exitSimpleNaamwoord?: (ctx: SimpleNaamwoordContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.consistentieregel`.
	 * @param ctx the parse tree
	 */
	enterConsistentieregel?: (ctx: ConsistentieregelContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.consistentieregel`.
	 * @param ctx the parse tree
	 */
	exitConsistentieregel?: (ctx: ConsistentieregelContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.uniekzijnResultaat`.
	 * @param ctx the parse tree
	 */
	enterUniekzijnResultaat?: (ctx: UniekzijnResultaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.uniekzijnResultaat`.
	 * @param ctx the parse tree
	 */
	exitUniekzijnResultaat?: (ctx: UniekzijnResultaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.alleAttributenVanObjecttype`.
	 * @param ctx the parse tree
	 */
	enterAlleAttributenVanObjecttype?: (ctx: AlleAttributenVanObjecttypeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.alleAttributenVanObjecttype`.
	 * @param ctx the parse tree
	 */
	exitAlleAttributenVanObjecttype?: (ctx: AlleAttributenVanObjecttypeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.inconsistentResultaat`.
	 * @param ctx the parse tree
	 */
	enterInconsistentResultaat?: (ctx: InconsistentResultaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.inconsistentResultaat`.
	 * @param ctx the parse tree
	 */
	exitInconsistentResultaat?: (ctx: InconsistentResultaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.voorwaardeDeel`.
	 * @param ctx the parse tree
	 */
	enterVoorwaardeDeel?: (ctx: VoorwaardeDeelContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.voorwaardeDeel`.
	 * @param ctx the parse tree
	 */
	exitVoorwaardeDeel?: (ctx: VoorwaardeDeelContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.toplevelSamengesteldeVoorwaarde`.
	 * @param ctx the parse tree
	 */
	enterToplevelSamengesteldeVoorwaarde?: (ctx: ToplevelSamengesteldeVoorwaardeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.toplevelSamengesteldeVoorwaarde`.
	 * @param ctx the parse tree
	 */
	exitToplevelSamengesteldeVoorwaarde?: (ctx: ToplevelSamengesteldeVoorwaardeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.voorwaardeKwantificatie`.
	 * @param ctx the parse tree
	 */
	enterVoorwaardeKwantificatie?: (ctx: VoorwaardeKwantificatieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.voorwaardeKwantificatie`.
	 * @param ctx the parse tree
	 */
	exitVoorwaardeKwantificatie?: (ctx: VoorwaardeKwantificatieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.samengesteldeVoorwaardeOnderdeel`.
	 * @param ctx the parse tree
	 */
	enterSamengesteldeVoorwaardeOnderdeel?: (ctx: SamengesteldeVoorwaardeOnderdeelContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.samengesteldeVoorwaardeOnderdeel`.
	 * @param ctx the parse tree
	 */
	exitSamengesteldeVoorwaardeOnderdeel?: (ctx: SamengesteldeVoorwaardeOnderdeelContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.bulletPrefix`.
	 * @param ctx the parse tree
	 */
	enterBulletPrefix?: (ctx: BulletPrefixContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.bulletPrefix`.
	 * @param ctx the parse tree
	 */
	exitBulletPrefix?: (ctx: BulletPrefixContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.elementaireVoorwaarde`.
	 * @param ctx the parse tree
	 */
	enterElementaireVoorwaarde?: (ctx: ElementaireVoorwaardeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.elementaireVoorwaarde`.
	 * @param ctx the parse tree
	 */
	exitElementaireVoorwaarde?: (ctx: ElementaireVoorwaardeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.genesteSamengesteldeVoorwaarde`.
	 * @param ctx the parse tree
	 */
	enterGenesteSamengesteldeVoorwaarde?: (ctx: GenesteSamengesteldeVoorwaardeContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.genesteSamengesteldeVoorwaarde`.
	 * @param ctx the parse tree
	 */
	exitGenesteSamengesteldeVoorwaarde?: (ctx: GenesteSamengesteldeVoorwaardeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.onderwerpReferentie`.
	 * @param ctx the parse tree
	 */
	enterOnderwerpReferentie?: (ctx: OnderwerpReferentieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.onderwerpReferentie`.
	 * @param ctx the parse tree
	 */
	exitOnderwerpReferentie?: (ctx: OnderwerpReferentieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.onderwerpBasis`.
	 * @param ctx the parse tree
	 */
	enterOnderwerpBasis?: (ctx: OnderwerpBasisContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.onderwerpBasis`.
	 * @param ctx the parse tree
	 */
	exitOnderwerpBasis?: (ctx: OnderwerpBasisContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.basisOnderwerp`.
	 * @param ctx the parse tree
	 */
	enterBasisOnderwerp?: (ctx: BasisOnderwerpContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.basisOnderwerp`.
	 * @param ctx the parse tree
	 */
	exitBasisOnderwerp?: (ctx: BasisOnderwerpContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.attribuutReferentie`.
	 * @param ctx the parse tree
	 */
	enterAttribuutReferentie?: (ctx: AttribuutReferentieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.attribuutReferentie`.
	 * @param ctx the parse tree
	 */
	exitAttribuutReferentie?: (ctx: AttribuutReferentieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.attribuutMetLidwoord`.
	 * @param ctx the parse tree
	 */
	enterAttribuutMetLidwoord?: (ctx: AttribuutMetLidwoordContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.attribuutMetLidwoord`.
	 * @param ctx the parse tree
	 */
	exitAttribuutMetLidwoord?: (ctx: AttribuutMetLidwoordContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.kenmerkNaam`.
	 * @param ctx the parse tree
	 */
	enterKenmerkNaam?: (ctx: KenmerkNaamContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.kenmerkNaam`.
	 * @param ctx the parse tree
	 */
	exitKenmerkNaam?: (ctx: KenmerkNaamContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.bezieldeReferentie`.
	 * @param ctx the parse tree
	 */
	enterBezieldeReferentie?: (ctx: BezieldeReferentieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.bezieldeReferentie`.
	 * @param ctx the parse tree
	 */
	exitBezieldeReferentie?: (ctx: BezieldeReferentieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.predicaat`.
	 * @param ctx the parse tree
	 */
	enterPredicaat?: (ctx: PredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.predicaat`.
	 * @param ctx the parse tree
	 */
	exitPredicaat?: (ctx: PredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.elementairPredicaat`.
	 * @param ctx the parse tree
	 */
	enterElementairPredicaat?: (ctx: ElementairPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.elementairPredicaat`.
	 * @param ctx the parse tree
	 */
	exitElementairPredicaat?: (ctx: ElementairPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.objectPredicaat`.
	 * @param ctx the parse tree
	 */
	enterObjectPredicaat?: (ctx: ObjectPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.objectPredicaat`.
	 * @param ctx the parse tree
	 */
	exitObjectPredicaat?: (ctx: ObjectPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.eenzijdigeObjectVergelijking`.
	 * @param ctx the parse tree
	 */
	enterEenzijdigeObjectVergelijking?: (ctx: EenzijdigeObjectVergelijkingContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.eenzijdigeObjectVergelijking`.
	 * @param ctx the parse tree
	 */
	exitEenzijdigeObjectVergelijking?: (ctx: EenzijdigeObjectVergelijkingContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.rolNaam`.
	 * @param ctx the parse tree
	 */
	enterRolNaam?: (ctx: RolNaamContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.rolNaam`.
	 * @param ctx the parse tree
	 */
	exitRolNaam?: (ctx: RolNaamContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.attribuutVergelijkingsPredicaat`.
	 * @param ctx the parse tree
	 */
	enterAttribuutVergelijkingsPredicaat?: (ctx: AttribuutVergelijkingsPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.attribuutVergelijkingsPredicaat`.
	 * @param ctx the parse tree
	 */
	exitAttribuutVergelijkingsPredicaat?: (ctx: AttribuutVergelijkingsPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.getalPredicaat`.
	 * @param ctx the parse tree
	 */
	enterGetalPredicaat?: (ctx: GetalPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.getalPredicaat`.
	 * @param ctx the parse tree
	 */
	exitGetalPredicaat?: (ctx: GetalPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.tekstPredicaat`.
	 * @param ctx the parse tree
	 */
	enterTekstPredicaat?: (ctx: TekstPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.tekstPredicaat`.
	 * @param ctx the parse tree
	 */
	exitTekstPredicaat?: (ctx: TekstPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.datumPredicaat`.
	 * @param ctx the parse tree
	 */
	enterDatumPredicaat?: (ctx: DatumPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.datumPredicaat`.
	 * @param ctx the parse tree
	 */
	exitDatumPredicaat?: (ctx: DatumPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.samengesteldPredicaat`.
	 * @param ctx the parse tree
	 */
	enterSamengesteldPredicaat?: (ctx: SamengesteldPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.samengesteldPredicaat`.
	 * @param ctx the parse tree
	 */
	exitSamengesteldPredicaat?: (ctx: SamengesteldPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.samengesteldeVoorwaardeOnderdeelInPredicaat`.
	 * @param ctx the parse tree
	 */
	enterSamengesteldeVoorwaardeOnderdeelInPredicaat?: (ctx: SamengesteldeVoorwaardeOnderdeelInPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.samengesteldeVoorwaardeOnderdeelInPredicaat`.
	 * @param ctx the parse tree
	 */
	exitSamengesteldeVoorwaardeOnderdeelInPredicaat?: (ctx: SamengesteldeVoorwaardeOnderdeelInPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.elementaireVoorwaardeInPredicaat`.
	 * @param ctx the parse tree
	 */
	enterElementaireVoorwaardeInPredicaat?: (ctx: ElementaireVoorwaardeInPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.elementaireVoorwaardeInPredicaat`.
	 * @param ctx the parse tree
	 */
	exitElementaireVoorwaardeInPredicaat?: (ctx: ElementaireVoorwaardeInPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.vergelijkingInPredicaat`.
	 * @param ctx the parse tree
	 */
	enterVergelijkingInPredicaat?: (ctx: VergelijkingInPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.vergelijkingInPredicaat`.
	 * @param ctx the parse tree
	 */
	exitVergelijkingInPredicaat?: (ctx: VergelijkingInPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.genesteSamengesteldeVoorwaardeInPredicaat`.
	 * @param ctx the parse tree
	 */
	enterGenesteSamengesteldeVoorwaardeInPredicaat?: (ctx: GenesteSamengesteldeVoorwaardeInPredicaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.genesteSamengesteldeVoorwaardeInPredicaat`.
	 * @param ctx the parse tree
	 */
	exitGenesteSamengesteldeVoorwaardeInPredicaat?: (ctx: GenesteSamengesteldeVoorwaardeInPredicaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.getalVergelijkingsOperatorMeervoud`.
	 * @param ctx the parse tree
	 */
	enterGetalVergelijkingsOperatorMeervoud?: (ctx: GetalVergelijkingsOperatorMeervoudContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.getalVergelijkingsOperatorMeervoud`.
	 * @param ctx the parse tree
	 */
	exitGetalVergelijkingsOperatorMeervoud?: (ctx: GetalVergelijkingsOperatorMeervoudContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.tekstVergelijkingsOperatorMeervoud`.
	 * @param ctx the parse tree
	 */
	enterTekstVergelijkingsOperatorMeervoud?: (ctx: TekstVergelijkingsOperatorMeervoudContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.tekstVergelijkingsOperatorMeervoud`.
	 * @param ctx the parse tree
	 */
	exitTekstVergelijkingsOperatorMeervoud?: (ctx: TekstVergelijkingsOperatorMeervoudContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.datumVergelijkingsOperatorMeervoud`.
	 * @param ctx the parse tree
	 */
	enterDatumVergelijkingsOperatorMeervoud?: (ctx: DatumVergelijkingsOperatorMeervoudContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.datumVergelijkingsOperatorMeervoud`.
	 * @param ctx the parse tree
	 */
	exitDatumVergelijkingsOperatorMeervoud?: (ctx: DatumVergelijkingsOperatorMeervoudContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.getalExpressie`.
	 * @param ctx the parse tree
	 */
	enterGetalExpressie?: (ctx: GetalExpressieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.getalExpressie`.
	 * @param ctx the parse tree
	 */
	exitGetalExpressie?: (ctx: GetalExpressieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.tekstExpressie`.
	 * @param ctx the parse tree
	 */
	enterTekstExpressie?: (ctx: TekstExpressieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.tekstExpressie`.
	 * @param ctx the parse tree
	 */
	exitTekstExpressie?: (ctx: TekstExpressieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.datumExpressie`.
	 * @param ctx the parse tree
	 */
	enterDatumExpressie?: (ctx: DatumExpressieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.datumExpressie`.
	 * @param ctx the parse tree
	 */
	exitDatumExpressie?: (ctx: DatumExpressieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.variabeleDeel`.
	 * @param ctx the parse tree
	 */
	enterVariabeleDeel?: (ctx: VariabeleDeelContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.variabeleDeel`.
	 * @param ctx the parse tree
	 */
	exitVariabeleDeel?: (ctx: VariabeleDeelContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.variabeleToekenning`.
	 * @param ctx the parse tree
	 */
	enterVariabeleToekenning?: (ctx: VariabeleToekenningContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.variabeleToekenning`.
	 * @param ctx the parse tree
	 */
	exitVariabeleToekenning?: (ctx: VariabeleToekenningContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.expressie`.
	 * @param ctx the parse tree
	 */
	enterExpressie?: (ctx: ExpressieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.expressie`.
	 * @param ctx the parse tree
	 */
	exitExpressie?: (ctx: ExpressieContext) => void;
	/**
	 * Enter a parse tree produced by the `LogicalExpr`
	 * labeled alternative in `RegelSpraakParser.logicalExpression`.
	 * @param ctx the parse tree
	 */
	enterLogicalExpr?: (ctx: LogicalExprContext) => void;
	/**
	 * Exit a parse tree produced by the `LogicalExpr`
	 * labeled alternative in `RegelSpraakParser.logicalExpression`.
	 * @param ctx the parse tree
	 */
	exitLogicalExpr?: (ctx: LogicalExprContext) => void;
	/**
	 * Enter a parse tree produced by the `SubordinateClauseExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	enterSubordinateClauseExpr?: (ctx: SubordinateClauseExprContext) => void;
	/**
	 * Exit a parse tree produced by the `SubordinateClauseExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	exitSubordinateClauseExpr?: (ctx: SubordinateClauseExprContext) => void;
	/**
	 * Enter a parse tree produced by the `IsKenmerkExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	enterIsKenmerkExpr?: (ctx: IsKenmerkExprContext) => void;
	/**
	 * Exit a parse tree produced by the `IsKenmerkExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	exitIsKenmerkExpr?: (ctx: IsKenmerkExprContext) => void;
	/**
	 * Enter a parse tree produced by the `HeeftKenmerkExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	enterHeeftKenmerkExpr?: (ctx: HeeftKenmerkExprContext) => void;
	/**
	 * Exit a parse tree produced by the `HeeftKenmerkExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	exitHeeftKenmerkExpr?: (ctx: HeeftKenmerkExprContext) => void;
	/**
	 * Enter a parse tree produced by the `BinaryComparisonExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	enterBinaryComparisonExpr?: (ctx: BinaryComparisonExprContext) => void;
	/**
	 * Exit a parse tree produced by the `BinaryComparisonExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	exitBinaryComparisonExpr?: (ctx: BinaryComparisonExprContext) => void;
	/**
	 * Enter a parse tree produced by the `UnaryConditionExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	enterUnaryConditionExpr?: (ctx: UnaryConditionExprContext) => void;
	/**
	 * Exit a parse tree produced by the `UnaryConditionExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	exitUnaryConditionExpr?: (ctx: UnaryConditionExprContext) => void;
	/**
	 * Enter a parse tree produced by the `RegelStatusConditionExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	enterRegelStatusConditionExpr?: (ctx: RegelStatusConditionExprContext) => void;
	/**
	 * Exit a parse tree produced by the `RegelStatusConditionExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 */
	exitRegelStatusConditionExpr?: (ctx: RegelStatusConditionExprContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.comparisonOperator`.
	 * @param ctx the parse tree
	 */
	enterComparisonOperator?: (ctx: ComparisonOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.comparisonOperator`.
	 * @param ctx the parse tree
	 */
	exitComparisonOperator?: (ctx: ComparisonOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.additiveExpression`.
	 * @param ctx the parse tree
	 */
	enterAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.additiveExpression`.
	 * @param ctx the parse tree
	 */
	exitAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.additiveOperator`.
	 * @param ctx the parse tree
	 */
	enterAdditiveOperator?: (ctx: AdditiveOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.additiveOperator`.
	 * @param ctx the parse tree
	 */
	exitAdditiveOperator?: (ctx: AdditiveOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 */
	enterMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 */
	exitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.multiplicativeOperator`.
	 * @param ctx the parse tree
	 */
	enterMultiplicativeOperator?: (ctx: MultiplicativeOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.multiplicativeOperator`.
	 * @param ctx the parse tree
	 */
	exitMultiplicativeOperator?: (ctx: MultiplicativeOperatorContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.powerExpression`.
	 * @param ctx the parse tree
	 */
	enterPowerExpression?: (ctx: PowerExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.powerExpression`.
	 * @param ctx the parse tree
	 */
	exitPowerExpression?: (ctx: PowerExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.powerOperator`.
	 * @param ctx the parse tree
	 */
	enterPowerOperator?: (ctx: PowerOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.powerOperator`.
	 * @param ctx the parse tree
	 */
	exitPowerOperator?: (ctx: PowerOperatorContext) => void;
	/**
	 * Enter a parse tree produced by the `WortelFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterWortelFuncExpr?: (ctx: WortelFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `WortelFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitWortelFuncExpr?: (ctx: WortelFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `BooleanTrueLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterBooleanTrueLiteralExpr?: (ctx: BooleanTrueLiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `BooleanTrueLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitBooleanTrueLiteralExpr?: (ctx: BooleanTrueLiteralExprContext) => void;
	/**
	 * Enter a parse tree produced by the `AbsValFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterAbsValFuncExpr?: (ctx: AbsValFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `AbsValFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitAbsValFuncExpr?: (ctx: AbsValFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `MaxValFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterMaxValFuncExpr?: (ctx: MaxValFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `MaxValFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitMaxValFuncExpr?: (ctx: MaxValFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `RekendatumKeywordExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterRekendatumKeywordExpr?: (ctx: RekendatumKeywordExprContext) => void;
	/**
	 * Exit a parse tree produced by the `RekendatumKeywordExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitRekendatumKeywordExpr?: (ctx: RekendatumKeywordExprContext) => void;
	/**
	 * Enter a parse tree produced by the `EnumLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterEnumLiteralExpr?: (ctx: EnumLiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `EnumLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitEnumLiteralExpr?: (ctx: EnumLiteralExprContext) => void;
	/**
	 * Enter a parse tree produced by the `NumberLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterNumberLiteralExpr?: (ctx: NumberLiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `NumberLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitNumberLiteralExpr?: (ctx: NumberLiteralExprContext) => void;
	/**
	 * Enter a parse tree produced by the `DatumLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterDatumLiteralExpr?: (ctx: DatumLiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `DatumLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitDatumLiteralExpr?: (ctx: DatumLiteralExprContext) => void;
	/**
	 * Enter a parse tree produced by the `AantalFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterAantalFuncExpr?: (ctx: AantalFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `AantalFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitAantalFuncExpr?: (ctx: AantalFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `UnaryNietExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterUnaryNietExpr?: (ctx: UnaryNietExprContext) => void;
	/**
	 * Exit a parse tree produced by the `UnaryNietExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitUnaryNietExpr?: (ctx: UnaryNietExprContext) => void;
	/**
	 * Enter a parse tree produced by the `ConcatenatieExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterConcatenatieExpr?: (ctx: ConcatenatieExprContext) => void;
	/**
	 * Exit a parse tree produced by the `ConcatenatieExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitConcatenatieExpr?: (ctx: ConcatenatieExprContext) => void;
	/**
	 * Enter a parse tree produced by the `SomAlleAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterSomAlleAttribuutExpr?: (ctx: SomAlleAttribuutExprContext) => void;
	/**
	 * Exit a parse tree produced by the `SomAlleAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitSomAlleAttribuutExpr?: (ctx: SomAlleAttribuutExprContext) => void;
	/**
	 * Enter a parse tree produced by the `AttrRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterAttrRefExpr?: (ctx: AttrRefExprContext) => void;
	/**
	 * Exit a parse tree produced by the `AttrRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitAttrRefExpr?: (ctx: AttrRefExprContext) => void;
	/**
	 * Enter a parse tree produced by the `DagUitFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterDagUitFuncExpr?: (ctx: DagUitFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `DagUitFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitDagUitFuncExpr?: (ctx: DagUitFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `BegrenzingExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterBegrenzingExpr?: (ctx: BegrenzingExprContext) => void;
	/**
	 * Exit a parse tree produced by the `BegrenzingExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitBegrenzingExpr?: (ctx: BegrenzingExprContext) => void;
	/**
	 * Enter a parse tree produced by the `NaamwoordExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterNaamwoordExpr?: (ctx: NaamwoordExprContext) => void;
	/**
	 * Exit a parse tree produced by the `NaamwoordExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitNaamwoordExpr?: (ctx: NaamwoordExprContext) => void;
	/**
	 * Enter a parse tree produced by the `BooleanFalseLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterBooleanFalseLiteralExpr?: (ctx: BooleanFalseLiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `BooleanFalseLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitBooleanFalseLiteralExpr?: (ctx: BooleanFalseLiteralExprContext) => void;
	/**
	 * Enter a parse tree produced by the `JaarUitFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterJaarUitFuncExpr?: (ctx: JaarUitFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `JaarUitFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitJaarUitFuncExpr?: (ctx: JaarUitFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `TotaalVanExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterTotaalVanExpr?: (ctx: TotaalVanExprContext) => void;
	/**
	 * Exit a parse tree produced by the `TotaalVanExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitTotaalVanExpr?: (ctx: TotaalVanExprContext) => void;
	/**
	 * Enter a parse tree produced by the `TijdsevenredigDeelExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterTijdsevenredigDeelExpr?: (ctx: TijdsevenredigDeelExprContext) => void;
	/**
	 * Exit a parse tree produced by the `TijdsevenredigDeelExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitTijdsevenredigDeelExpr?: (ctx: TijdsevenredigDeelExprContext) => void;
	/**
	 * Enter a parse tree produced by the `CapitalizedTijdsevenredigDeelExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterCapitalizedTijdsevenredigDeelExpr?: (ctx: CapitalizedTijdsevenredigDeelExprContext) => void;
	/**
	 * Exit a parse tree produced by the `CapitalizedTijdsevenredigDeelExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitCapitalizedTijdsevenredigDeelExpr?: (ctx: CapitalizedTijdsevenredigDeelExprContext) => void;
	/**
	 * Enter a parse tree produced by the `AantalAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterAantalAttribuutExpr?: (ctx: AantalAttribuutExprContext) => void;
	/**
	 * Exit a parse tree produced by the `AantalAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitAantalAttribuutExpr?: (ctx: AantalAttribuutExprContext) => void;
	/**
	 * Enter a parse tree produced by the `ParenExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterParenExpr?: (ctx: ParenExprContext) => void;
	/**
	 * Exit a parse tree produced by the `ParenExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitParenExpr?: (ctx: ParenExprContext) => void;
	/**
	 * Enter a parse tree produced by the `DimensieRangeAggExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterDimensieRangeAggExpr?: (ctx: DimensieRangeAggExprContext) => void;
	/**
	 * Exit a parse tree produced by the `DimensieRangeAggExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitDimensieRangeAggExpr?: (ctx: DimensieRangeAggExprContext) => void;
	/**
	 * Enter a parse tree produced by the `DatumMetFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterDatumMetFuncExpr?: (ctx: DatumMetFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `DatumMetFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitDatumMetFuncExpr?: (ctx: DatumMetFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `PercentageLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterPercentageLiteralExpr?: (ctx: PercentageLiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `PercentageLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitPercentageLiteralExpr?: (ctx: PercentageLiteralExprContext) => void;
	/**
	 * Enter a parse tree produced by the `StringLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterStringLiteralExpr?: (ctx: StringLiteralExprContext) => void;
	/**
	 * Exit a parse tree produced by the `StringLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitStringLiteralExpr?: (ctx: StringLiteralExprContext) => void;
	/**
	 * Enter a parse tree produced by the `PercentageFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterPercentageFuncExpr?: (ctx: PercentageFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `PercentageFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitPercentageFuncExpr?: (ctx: PercentageFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `EersteDatumFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterEersteDatumFuncExpr?: (ctx: EersteDatumFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `EersteDatumFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitEersteDatumFuncExpr?: (ctx: EersteDatumFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `PasenFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterPasenFuncExpr?: (ctx: PasenFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `PasenFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitPasenFuncExpr?: (ctx: PasenFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `AbsTijdsduurFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterAbsTijdsduurFuncExpr?: (ctx: AbsTijdsduurFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `AbsTijdsduurFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitAbsTijdsduurFuncExpr?: (ctx: AbsTijdsduurFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `MaandUitFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterMaandUitFuncExpr?: (ctx: MaandUitFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `MaandUitFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitMaandUitFuncExpr?: (ctx: MaandUitFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `CapitalizedTotaalVanExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterCapitalizedTotaalVanExpr?: (ctx: CapitalizedTotaalVanExprContext) => void;
	/**
	 * Exit a parse tree produced by the `CapitalizedTotaalVanExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitCapitalizedTotaalVanExpr?: (ctx: CapitalizedTotaalVanExprContext) => void;
	/**
	 * Enter a parse tree produced by the `IdentifierExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterIdentifierExpr?: (ctx: IdentifierExprContext) => void;
	/**
	 * Exit a parse tree produced by the `IdentifierExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitIdentifierExpr?: (ctx: IdentifierExprContext) => void;
	/**
	 * Enter a parse tree produced by the `DimensieAggExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterDimensieAggExpr?: (ctx: DimensieAggExprContext) => void;
	/**
	 * Exit a parse tree produced by the `DimensieAggExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitDimensieAggExpr?: (ctx: DimensieAggExprContext) => void;
	/**
	 * Enter a parse tree produced by the `TijdsduurFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterTijdsduurFuncExpr?: (ctx: TijdsduurFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `TijdsduurFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitTijdsduurFuncExpr?: (ctx: TijdsduurFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `OnderwerpRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterOnderwerpRefExpr?: (ctx: OnderwerpRefExprContext) => void;
	/**
	 * Exit a parse tree produced by the `OnderwerpRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitOnderwerpRefExpr?: (ctx: OnderwerpRefExprContext) => void;
	/**
	 * Enter a parse tree produced by the `SomFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterSomFuncExpr?: (ctx: SomFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `SomFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitSomFuncExpr?: (ctx: SomFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `SomAlleExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterSomAlleExpr?: (ctx: SomAlleExprContext) => void;
	/**
	 * Exit a parse tree produced by the `SomAlleExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitSomAlleExpr?: (ctx: SomAlleExprContext) => void;
	/**
	 * Enter a parse tree produced by the `SimpleConcatenatieExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterSimpleConcatenatieExpr?: (ctx: SimpleConcatenatieExprContext) => void;
	/**
	 * Exit a parse tree produced by the `SimpleConcatenatieExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitSimpleConcatenatieExpr?: (ctx: SimpleConcatenatieExprContext) => void;
	/**
	 * Enter a parse tree produced by the `MinValFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterMinValFuncExpr?: (ctx: MinValFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `MinValFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitMinValFuncExpr?: (ctx: MinValFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `MaxAlleAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterMaxAlleAttribuutExpr?: (ctx: MaxAlleAttribuutExprContext) => void;
	/**
	 * Exit a parse tree produced by the `MaxAlleAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitMaxAlleAttribuutExpr?: (ctx: MaxAlleAttribuutExprContext) => void;
	/**
	 * Enter a parse tree produced by the `BezieldeRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterBezieldeRefExpr?: (ctx: BezieldeRefExprContext) => void;
	/**
	 * Exit a parse tree produced by the `BezieldeRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitBezieldeRefExpr?: (ctx: BezieldeRefExprContext) => void;
	/**
	 * Enter a parse tree produced by the `DateCalcExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterDateCalcExpr?: (ctx: DateCalcExprContext) => void;
	/**
	 * Exit a parse tree produced by the `DateCalcExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitDateCalcExpr?: (ctx: DateCalcExprContext) => void;
	/**
	 * Enter a parse tree produced by the `MinAlleAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterMinAlleAttribuutExpr?: (ctx: MinAlleAttribuutExprContext) => void;
	/**
	 * Exit a parse tree produced by the `MinAlleAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitMinAlleAttribuutExpr?: (ctx: MinAlleAttribuutExprContext) => void;
	/**
	 * Enter a parse tree produced by the `AfrondingExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterAfrondingExpr?: (ctx: AfrondingExprContext) => void;
	/**
	 * Exit a parse tree produced by the `AfrondingExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitAfrondingExpr?: (ctx: AfrondingExprContext) => void;
	/**
	 * Enter a parse tree produced by the `LaatsteDatumFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterLaatsteDatumFuncExpr?: (ctx: LaatsteDatumFuncExprContext) => void;
	/**
	 * Exit a parse tree produced by the `LaatsteDatumFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitLaatsteDatumFuncExpr?: (ctx: LaatsteDatumFuncExprContext) => void;
	/**
	 * Enter a parse tree produced by the `HetAantalDagenInExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterHetAantalDagenInExpr?: (ctx: HetAantalDagenInExprContext) => void;
	/**
	 * Exit a parse tree produced by the `HetAantalDagenInExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitHetAantalDagenInExpr?: (ctx: HetAantalDagenInExprContext) => void;
	/**
	 * Enter a parse tree produced by the `UnaryMinusExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => void;
	/**
	 * Exit a parse tree produced by the `UnaryMinusExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => void;
	/**
	 * Enter a parse tree produced by the `ParamRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterParamRefExpr?: (ctx: ParamRefExprContext) => void;
	/**
	 * Exit a parse tree produced by the `ParamRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitParamRefExpr?: (ctx: ParamRefExprContext) => void;
	/**
	 * Enter a parse tree produced by the `PronounExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	enterPronounExpr?: (ctx: PronounExprContext) => void;
	/**
	 * Exit a parse tree produced by the `PronounExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 */
	exitPronounExpr?: (ctx: PronounExprContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.afronding`.
	 * @param ctx the parse tree
	 */
	enterAfronding?: (ctx: AfrondingContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.afronding`.
	 * @param ctx the parse tree
	 */
	exitAfronding?: (ctx: AfrondingContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.begrenzing`.
	 * @param ctx the parse tree
	 */
	enterBegrenzing?: (ctx: BegrenzingContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.begrenzing`.
	 * @param ctx the parse tree
	 */
	exitBegrenzing?: (ctx: BegrenzingContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.begrenzingMinimum`.
	 * @param ctx the parse tree
	 */
	enterBegrenzingMinimum?: (ctx: BegrenzingMinimumContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.begrenzingMinimum`.
	 * @param ctx the parse tree
	 */
	exitBegrenzingMinimum?: (ctx: BegrenzingMinimumContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.begrenzingMaximum`.
	 * @param ctx the parse tree
	 */
	enterBegrenzingMaximum?: (ctx: BegrenzingMaximumContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.begrenzingMaximum`.
	 * @param ctx the parse tree
	 */
	exitBegrenzingMaximum?: (ctx: BegrenzingMaximumContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.conditieBijExpressie`.
	 * @param ctx the parse tree
	 */
	enterConditieBijExpressie?: (ctx: ConditieBijExpressieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.conditieBijExpressie`.
	 * @param ctx the parse tree
	 */
	exitConditieBijExpressie?: (ctx: ConditieBijExpressieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.periodevergelijkingEnkelvoudig`.
	 * @param ctx the parse tree
	 */
	enterPeriodevergelijkingEnkelvoudig?: (ctx: PeriodevergelijkingEnkelvoudigContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.periodevergelijkingEnkelvoudig`.
	 * @param ctx the parse tree
	 */
	exitPeriodevergelijkingEnkelvoudig?: (ctx: PeriodevergelijkingEnkelvoudigContext) => void;
	/**
	 * Enter a parse tree produced by the `VanafPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 */
	enterVanafPeriode?: (ctx: VanafPeriodeContext) => void;
	/**
	 * Exit a parse tree produced by the `VanafPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 */
	exitVanafPeriode?: (ctx: VanafPeriodeContext) => void;
	/**
	 * Enter a parse tree produced by the `TotPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 */
	enterTotPeriode?: (ctx: TotPeriodeContext) => void;
	/**
	 * Exit a parse tree produced by the `TotPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 */
	exitTotPeriode?: (ctx: TotPeriodeContext) => void;
	/**
	 * Enter a parse tree produced by the `TotEnMetPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 */
	enterTotEnMetPeriode?: (ctx: TotEnMetPeriodeContext) => void;
	/**
	 * Exit a parse tree produced by the `TotEnMetPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 */
	exitTotEnMetPeriode?: (ctx: TotEnMetPeriodeContext) => void;
	/**
	 * Enter a parse tree produced by the `VanTotPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 */
	enterVanTotPeriode?: (ctx: VanTotPeriodeContext) => void;
	/**
	 * Exit a parse tree produced by the `VanTotPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 */
	exitVanTotPeriode?: (ctx: VanTotPeriodeContext) => void;
	/**
	 * Enter a parse tree produced by the `VanTotEnMetPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 */
	enterVanTotEnMetPeriode?: (ctx: VanTotEnMetPeriodeContext) => void;
	/**
	 * Exit a parse tree produced by the `VanTotEnMetPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 */
	exitVanTotEnMetPeriode?: (ctx: VanTotEnMetPeriodeContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.dateExpression`.
	 * @param ctx the parse tree
	 */
	enterDateExpression?: (ctx: DateExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.dateExpression`.
	 * @param ctx the parse tree
	 */
	exitDateExpression?: (ctx: DateExpressionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.getalAggregatieFunctie`.
	 * @param ctx the parse tree
	 */
	enterGetalAggregatieFunctie?: (ctx: GetalAggregatieFunctieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.getalAggregatieFunctie`.
	 * @param ctx the parse tree
	 */
	exitGetalAggregatieFunctie?: (ctx: GetalAggregatieFunctieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.datumAggregatieFunctie`.
	 * @param ctx the parse tree
	 */
	enterDatumAggregatieFunctie?: (ctx: DatumAggregatieFunctieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.datumAggregatieFunctie`.
	 * @param ctx the parse tree
	 */
	exitDatumAggregatieFunctie?: (ctx: DatumAggregatieFunctieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.dimensieSelectie`.
	 * @param ctx the parse tree
	 */
	enterDimensieSelectie?: (ctx: DimensieSelectieContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.dimensieSelectie`.
	 * @param ctx the parse tree
	 */
	exitDimensieSelectie?: (ctx: DimensieSelectieContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.aggregerenOverAlleDimensies`.
	 * @param ctx the parse tree
	 */
	enterAggregerenOverAlleDimensies?: (ctx: AggregerenOverAlleDimensiesContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.aggregerenOverAlleDimensies`.
	 * @param ctx the parse tree
	 */
	exitAggregerenOverAlleDimensies?: (ctx: AggregerenOverAlleDimensiesContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.aggregerenOverVerzameling`.
	 * @param ctx the parse tree
	 */
	enterAggregerenOverVerzameling?: (ctx: AggregerenOverVerzamelingContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.aggregerenOverVerzameling`.
	 * @param ctx the parse tree
	 */
	exitAggregerenOverVerzameling?: (ctx: AggregerenOverVerzamelingContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.aggregerenOverBereik`.
	 * @param ctx the parse tree
	 */
	enterAggregerenOverBereik?: (ctx: AggregerenOverBereikContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.aggregerenOverBereik`.
	 * @param ctx the parse tree
	 */
	exitAggregerenOverBereik?: (ctx: AggregerenOverBereikContext) => void;
	/**
	 * Enter a parse tree produced by the `unaryCheckCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	enterUnaryCheckCondition?: (ctx: UnaryCheckConditionContext) => void;
	/**
	 * Exit a parse tree produced by the `unaryCheckCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	exitUnaryCheckCondition?: (ctx: UnaryCheckConditionContext) => void;
	/**
	 * Enter a parse tree produced by the `unaryNumeriekExactCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	enterUnaryNumeriekExactCondition?: (ctx: UnaryNumeriekExactConditionContext) => void;
	/**
	 * Exit a parse tree produced by the `unaryNumeriekExactCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	exitUnaryNumeriekExactCondition?: (ctx: UnaryNumeriekExactConditionContext) => void;
	/**
	 * Enter a parse tree produced by the `unaryDagsoortCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	enterUnaryDagsoortCondition?: (ctx: UnaryDagsoortConditionContext) => void;
	/**
	 * Exit a parse tree produced by the `unaryDagsoortCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	exitUnaryDagsoortCondition?: (ctx: UnaryDagsoortConditionContext) => void;
	/**
	 * Enter a parse tree produced by the `unaryKenmerkCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	enterUnaryKenmerkCondition?: (ctx: UnaryKenmerkConditionContext) => void;
	/**
	 * Exit a parse tree produced by the `unaryKenmerkCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	exitUnaryKenmerkCondition?: (ctx: UnaryKenmerkConditionContext) => void;
	/**
	 * Enter a parse tree produced by the `unaryRolCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	enterUnaryRolCondition?: (ctx: UnaryRolConditionContext) => void;
	/**
	 * Exit a parse tree produced by the `unaryRolCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	exitUnaryRolCondition?: (ctx: UnaryRolConditionContext) => void;
	/**
	 * Enter a parse tree produced by the `unaryUniekCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	enterUnaryUniekCondition?: (ctx: UnaryUniekConditionContext) => void;
	/**
	 * Exit a parse tree produced by the `unaryUniekCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	exitUnaryUniekCondition?: (ctx: UnaryUniekConditionContext) => void;
	/**
	 * Enter a parse tree produced by the `unaryInconsistentDataCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	enterUnaryInconsistentDataCondition?: (ctx: UnaryInconsistentDataConditionContext) => void;
	/**
	 * Exit a parse tree produced by the `unaryInconsistentDataCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 */
	exitUnaryInconsistentDataCondition?: (ctx: UnaryInconsistentDataConditionContext) => void;
	/**
	 * Enter a parse tree produced by the `regelStatusGevuurdCheck`
	 * labeled alternative in `RegelSpraakParser.regelStatusCondition`.
	 * @param ctx the parse tree
	 */
	enterRegelStatusGevuurdCheck?: (ctx: RegelStatusGevuurdCheckContext) => void;
	/**
	 * Exit a parse tree produced by the `regelStatusGevuurdCheck`
	 * labeled alternative in `RegelSpraakParser.regelStatusCondition`.
	 * @param ctx the parse tree
	 */
	exitRegelStatusGevuurdCheck?: (ctx: RegelStatusGevuurdCheckContext) => void;
	/**
	 * Enter a parse tree produced by the `regelStatusInconsistentCheck`
	 * labeled alternative in `RegelSpraakParser.regelStatusCondition`.
	 * @param ctx the parse tree
	 */
	enterRegelStatusInconsistentCheck?: (ctx: RegelStatusInconsistentCheckContext) => void;
	/**
	 * Exit a parse tree produced by the `regelStatusInconsistentCheck`
	 * labeled alternative in `RegelSpraakParser.regelStatusCondition`.
	 * @param ctx the parse tree
	 */
	exitRegelStatusInconsistentCheck?: (ctx: RegelStatusInconsistentCheckContext) => void;
	/**
	 * Enter a parse tree produced by the `SubordinateHasExpr`
	 * labeled alternative in `RegelSpraakParser.subordinateClauseExpression`.
	 * @param ctx the parse tree
	 */
	enterSubordinateHasExpr?: (ctx: SubordinateHasExprContext) => void;
	/**
	 * Exit a parse tree produced by the `SubordinateHasExpr`
	 * labeled alternative in `RegelSpraakParser.subordinateClauseExpression`.
	 * @param ctx the parse tree
	 */
	exitSubordinateHasExpr?: (ctx: SubordinateHasExprContext) => void;
	/**
	 * Enter a parse tree produced by the `SubordinateIsWithExpr`
	 * labeled alternative in `RegelSpraakParser.subordinateClauseExpression`.
	 * @param ctx the parse tree
	 */
	enterSubordinateIsWithExpr?: (ctx: SubordinateIsWithExprContext) => void;
	/**
	 * Exit a parse tree produced by the `SubordinateIsWithExpr`
	 * labeled alternative in `RegelSpraakParser.subordinateClauseExpression`.
	 * @param ctx the parse tree
	 */
	exitSubordinateIsWithExpr?: (ctx: SubordinateIsWithExprContext) => void;
	/**
	 * Enter a parse tree produced by the `SubordinateIsKenmerkExpr`
	 * labeled alternative in `RegelSpraakParser.subordinateClauseExpression`.
	 * @param ctx the parse tree
	 */
	enterSubordinateIsKenmerkExpr?: (ctx: SubordinateIsKenmerkExprContext) => void;
	/**
	 * Exit a parse tree produced by the `SubordinateIsKenmerkExpr`
	 * labeled alternative in `RegelSpraakParser.subordinateClauseExpression`.
	 * @param ctx the parse tree
	 */
	exitSubordinateIsKenmerkExpr?: (ctx: SubordinateIsKenmerkExprContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.dagsoortDefinition`.
	 * @param ctx the parse tree
	 */
	enterDagsoortDefinition?: (ctx: DagsoortDefinitionContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.dagsoortDefinition`.
	 * @param ctx the parse tree
	 */
	exitDagsoortDefinition?: (ctx: DagsoortDefinitionContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.verdelingResultaat`.
	 * @param ctx the parse tree
	 */
	enterVerdelingResultaat?: (ctx: VerdelingResultaatContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.verdelingResultaat`.
	 * @param ctx the parse tree
	 */
	exitVerdelingResultaat?: (ctx: VerdelingResultaatContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.verdelingMethodeSimple`.
	 * @param ctx the parse tree
	 */
	enterVerdelingMethodeSimple?: (ctx: VerdelingMethodeSimpleContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.verdelingMethodeSimple`.
	 * @param ctx the parse tree
	 */
	exitVerdelingMethodeSimple?: (ctx: VerdelingMethodeSimpleContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.verdelingMethodeMultiLine`.
	 * @param ctx the parse tree
	 */
	enterVerdelingMethodeMultiLine?: (ctx: VerdelingMethodeMultiLineContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.verdelingMethodeMultiLine`.
	 * @param ctx the parse tree
	 */
	exitVerdelingMethodeMultiLine?: (ctx: VerdelingMethodeMultiLineContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.verdelingMethodeBulletList`.
	 * @param ctx the parse tree
	 */
	enterVerdelingMethodeBulletList?: (ctx: VerdelingMethodeBulletListContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.verdelingMethodeBulletList`.
	 * @param ctx the parse tree
	 */
	exitVerdelingMethodeBulletList?: (ctx: VerdelingMethodeBulletListContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.verdelingMethodeBullet`.
	 * @param ctx the parse tree
	 */
	enterVerdelingMethodeBullet?: (ctx: VerdelingMethodeBulletContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.verdelingMethodeBullet`.
	 * @param ctx the parse tree
	 */
	exitVerdelingMethodeBullet?: (ctx: VerdelingMethodeBulletContext) => void;
	/**
	 * Enter a parse tree produced by the `VerdelingGelijkeDelen`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	enterVerdelingGelijkeDelen?: (ctx: VerdelingGelijkeDelenContext) => void;
	/**
	 * Exit a parse tree produced by the `VerdelingGelijkeDelen`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	exitVerdelingGelijkeDelen?: (ctx: VerdelingGelijkeDelenContext) => void;
	/**
	 * Enter a parse tree produced by the `VerdelingNaarRato`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	enterVerdelingNaarRato?: (ctx: VerdelingNaarRatoContext) => void;
	/**
	 * Exit a parse tree produced by the `VerdelingNaarRato`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	exitVerdelingNaarRato?: (ctx: VerdelingNaarRatoContext) => void;
	/**
	 * Enter a parse tree produced by the `VerdelingOpVolgorde`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	enterVerdelingOpVolgorde?: (ctx: VerdelingOpVolgordeContext) => void;
	/**
	 * Exit a parse tree produced by the `VerdelingOpVolgorde`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	exitVerdelingOpVolgorde?: (ctx: VerdelingOpVolgordeContext) => void;
	/**
	 * Enter a parse tree produced by the `VerdelingTieBreak`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	enterVerdelingTieBreak?: (ctx: VerdelingTieBreakContext) => void;
	/**
	 * Exit a parse tree produced by the `VerdelingTieBreak`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	exitVerdelingTieBreak?: (ctx: VerdelingTieBreakContext) => void;
	/**
	 * Enter a parse tree produced by the `VerdelingMaximum`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	enterVerdelingMaximum?: (ctx: VerdelingMaximumContext) => void;
	/**
	 * Exit a parse tree produced by the `VerdelingMaximum`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	exitVerdelingMaximum?: (ctx: VerdelingMaximumContext) => void;
	/**
	 * Enter a parse tree produced by the `VerdelingAfronding`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	enterVerdelingAfronding?: (ctx: VerdelingAfrondingContext) => void;
	/**
	 * Exit a parse tree produced by the `VerdelingAfronding`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 */
	exitVerdelingAfronding?: (ctx: VerdelingAfrondingContext) => void;
	/**
	 * Enter a parse tree produced by `RegelSpraakParser.verdelingRest`.
	 * @param ctx the parse tree
	 */
	enterVerdelingRest?: (ctx: VerdelingRestContext) => void;
	/**
	 * Exit a parse tree produced by `RegelSpraakParser.verdelingRest`.
	 * @param ctx the parse tree
	 */
	exitVerdelingRest?: (ctx: VerdelingRestContext) => void;
}

