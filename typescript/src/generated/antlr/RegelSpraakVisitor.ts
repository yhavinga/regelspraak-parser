// Generated from RegelSpraak.g4 by ANTLR 4.13.1

import {ParseTreeVisitor} from 'antlr4';


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
import { NaamPhraseWithNumbersContext } from "./RegelSpraakParser";
import { IdentifierOrKeywordWithNumbersContext } from "./RegelSpraakParser";
import { NaamPhraseNoIsContext } from "./RegelSpraakParser";
import { NaamwoordContext } from "./RegelSpraakParser";
import { NaamwoordWithNumbersContext } from "./RegelSpraakParser";
import { NaamwoordNoIsContext } from "./RegelSpraakParser";
import { VoorzetselContext } from "./RegelSpraakParser";
import { DatumLiteralContext } from "./RegelSpraakParser";
import { UnitContext } from "./RegelSpraakParser";
import { TimeUnitContext } from "./RegelSpraakParser";
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
import { ParameterNamePartContext } from "./RegelSpraakParser";
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
import { RegelNameExtensionContext } from "./RegelSpraakParser";
import { RegelVersieContext } from "./RegelSpraakParser";
import { VersieGeldigheidContext } from "./RegelSpraakParser";
import { DagsoortdefinitieResultaatContext } from "./RegelSpraakParser";
import { GelijkstellingResultaatContext } from "./RegelSpraakParser";
import { ConsistencyCheckResultaatContext } from "./RegelSpraakParser";
import { FeitCreatieResultaatContext } from "./RegelSpraakParser";
import { KenmerkFeitResultaatContext } from "./RegelSpraakParser";
import { RelationshipWithAttributeResultaatContext } from "./RegelSpraakParser";
import { ObjectCreatieResultaatContext } from "./RegelSpraakParser";
import { VerdelingContext } from "./RegelSpraakParser";
import { ConsistencyOperatorContext } from "./RegelSpraakParser";
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
import { OnderwerpReferentieWithNumbersContext } from "./RegelSpraakParser";
import { OnderwerpBasisContext } from "./RegelSpraakParser";
import { OnderwerpBasisWithNumbersContext } from "./RegelSpraakParser";
import { BasisOnderwerpContext } from "./RegelSpraakParser";
import { BasisOnderwerpWithNumbersContext } from "./RegelSpraakParser";
import { AttribuutReferentieContext } from "./RegelSpraakParser";
import { AttribuutMetLidwoordContext } from "./RegelSpraakParser";
import { KenmerkNaamContext } from "./RegelSpraakParser";
import { KenmerkPhraseContext } from "./RegelSpraakParser";
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
import { VariabeleExpressieContext } from "./RegelSpraakParser";
import { ExprBegrenzingAfrondingContext } from "./RegelSpraakParser";
import { ExprBegrenzingContext } from "./RegelSpraakParser";
import { ExprAfrondingContext } from "./RegelSpraakParser";
import { SimpleExprContext } from "./RegelSpraakParser";
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
import { BegrenzingAfrondingExprContext } from "./RegelSpraakParser";
import { PercentageOfExprContext } from "./RegelSpraakParser";
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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `RegelSpraakParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export default class RegelSpraakVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.regelSpraakDocument`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRegelSpraakDocument?: (ctx: RegelSpraakDocumentContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.definitie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDefinitie?: (ctx: DefinitieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.beslistabel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBeslistabel?: (ctx: BeslistabelContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.beslistabelTable`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBeslistabelTable?: (ctx: BeslistabelTableContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.beslistabelHeader`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBeslistabelHeader?: (ctx: BeslistabelHeaderContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.beslistabelSeparator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBeslistabelSeparator?: (ctx: BeslistabelSeparatorContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.beslistabelRow`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBeslistabelRow?: (ctx: BeslistabelRowContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.beslistabelCellValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBeslistabelCellValue?: (ctx: BeslistabelCellValueContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.beslistabelColumnText`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBeslistabelColumnText?: (ctx: BeslistabelColumnTextContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.identifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifier?: (ctx: IdentifierContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.identifierOrKeyword`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierOrKeyword?: (ctx: IdentifierOrKeywordContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.identifierOrKeywordNoIs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierOrKeywordNoIs?: (ctx: IdentifierOrKeywordNoIsContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.naamPhrase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNaamPhrase?: (ctx: NaamPhraseContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.naamPhraseWithNumbers`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNaamPhraseWithNumbers?: (ctx: NaamPhraseWithNumbersContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.identifierOrKeywordWithNumbers`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierOrKeywordWithNumbers?: (ctx: IdentifierOrKeywordWithNumbersContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.naamPhraseNoIs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNaamPhraseNoIs?: (ctx: NaamPhraseNoIsContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.naamwoord`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNaamwoord?: (ctx: NaamwoordContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.naamwoordWithNumbers`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNaamwoordWithNumbers?: (ctx: NaamwoordWithNumbersContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.naamwoordNoIs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNaamwoordNoIs?: (ctx: NaamwoordNoIsContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.voorzetsel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVoorzetsel?: (ctx: VoorzetselContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.datumLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatumLiteral?: (ctx: DatumLiteralContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.unit`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnit?: (ctx: UnitContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.timeUnit`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTimeUnit?: (ctx: TimeUnitContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.objectTypeDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectTypeDefinition?: (ctx: ObjectTypeDefinitionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.objectTypeMember`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectTypeMember?: (ctx: ObjectTypeMemberContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.kenmerkSpecificatie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKenmerkSpecificatie?: (ctx: KenmerkSpecificatieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.attribuutSpecificatie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAttribuutSpecificatie?: (ctx: AttribuutSpecificatieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.datatype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatatype?: (ctx: DatatypeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.lijstDatatype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLijstDatatype?: (ctx: LijstDatatypeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.numeriekDatatype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumeriekDatatype?: (ctx: NumeriekDatatypeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.tekstDatatype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTekstDatatype?: (ctx: TekstDatatypeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.percentageDatatype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPercentageDatatype?: (ctx: PercentageDatatypeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.booleanDatatype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBooleanDatatype?: (ctx: BooleanDatatypeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.datumTijdDatatype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatumTijdDatatype?: (ctx: DatumTijdDatatypeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.getalSpecificatie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGetalSpecificatie?: (ctx: GetalSpecificatieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.domeinDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDomeinDefinition?: (ctx: DomeinDefinitionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.domeinType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDomeinType?: (ctx: DomeinTypeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.enumeratieSpecificatie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumeratieSpecificatie?: (ctx: EnumeratieSpecificatieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.domeinRef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDomeinRef?: (ctx: DomeinRefContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.objectTypeRef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectTypeRef?: (ctx: ObjectTypeRefContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.eenheidsysteemDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEenheidsysteemDefinition?: (ctx: EenheidsysteemDefinitionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.eenheidEntry`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEenheidEntry?: (ctx: EenheidEntryContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.unitIdentifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnitIdentifier?: (ctx: UnitIdentifierContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.eenheidExpressie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEenheidExpressie?: (ctx: EenheidExpressieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.eenheidMacht`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEenheidMacht?: (ctx: EenheidMachtContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.dimensieDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDimensieDefinition?: (ctx: DimensieDefinitionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.voorzetselSpecificatie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVoorzetselSpecificatie?: (ctx: VoorzetselSpecificatieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.labelWaardeSpecificatie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLabelWaardeSpecificatie?: (ctx: LabelWaardeSpecificatieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.tijdlijn`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTijdlijn?: (ctx: TijdlijnContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.dimensieRef`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDimensieRef?: (ctx: DimensieRefContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.parameterDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterDefinition?: (ctx: ParameterDefinitionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.parameterNamePhrase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterNamePhrase?: (ctx: ParameterNamePhraseContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.parameterNamePart`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterNamePart?: (ctx: ParameterNamePartContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.parameterMetLidwoord`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterMetLidwoord?: (ctx: ParameterMetLidwoordContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.feitTypeDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFeitTypeDefinition?: (ctx: FeitTypeDefinitionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.rolDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRolDefinition?: (ctx: RolDefinitionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.rolObjectType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRolObjectType?: (ctx: RolObjectTypeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.rolContentWords`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRolContentWords?: (ctx: RolContentWordsContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.cardinalityLine`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCardinalityLine?: (ctx: CardinalityLineContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.cardinalityWord`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCardinalityWord?: (ctx: CardinalityWordContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.regel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRegel?: (ctx: RegelContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.regelGroep`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRegelGroep?: (ctx: RegelGroepContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.regelName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRegelName?: (ctx: RegelNameContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.regelNameExtension`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRegelNameExtension?: (ctx: RegelNameExtensionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.regelVersie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRegelVersie?: (ctx: RegelVersieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.versieGeldigheid`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVersieGeldigheid?: (ctx: VersieGeldigheidContext) => Result;
	/**
	 * Visit a parse tree produced by the `DagsoortdefinitieResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDagsoortdefinitieResultaat?: (ctx: DagsoortdefinitieResultaatContext) => Result;
	/**
	 * Visit a parse tree produced by the `GelijkstellingResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGelijkstellingResultaat?: (ctx: GelijkstellingResultaatContext) => Result;
	/**
	 * Visit a parse tree produced by the `ConsistencyCheckResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConsistencyCheckResultaat?: (ctx: ConsistencyCheckResultaatContext) => Result;
	/**
	 * Visit a parse tree produced by the `FeitCreatieResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFeitCreatieResultaat?: (ctx: FeitCreatieResultaatContext) => Result;
	/**
	 * Visit a parse tree produced by the `KenmerkFeitResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKenmerkFeitResultaat?: (ctx: KenmerkFeitResultaatContext) => Result;
	/**
	 * Visit a parse tree produced by the `RelationshipWithAttributeResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRelationshipWithAttributeResultaat?: (ctx: RelationshipWithAttributeResultaatContext) => Result;
	/**
	 * Visit a parse tree produced by the `ObjectCreatieResultaat`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectCreatieResultaat?: (ctx: ObjectCreatieResultaatContext) => Result;
	/**
	 * Visit a parse tree produced by the `Verdeling`
	 * labeled alternative in `RegelSpraakParser.resultaatDeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdeling?: (ctx: VerdelingContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.consistencyOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConsistencyOperator?: (ctx: ConsistencyOperatorContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.feitCreatiePattern`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFeitCreatiePattern?: (ctx: FeitCreatiePatternContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.feitCreatieRolPhrase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFeitCreatieRolPhrase?: (ctx: FeitCreatieRolPhraseContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.feitCreatieSubjectPhrase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFeitCreatieSubjectPhrase?: (ctx: FeitCreatieSubjectPhraseContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.feitCreatieSubjectWord`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFeitCreatieSubjectWord?: (ctx: FeitCreatieSubjectWordContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.feitCreatieWord`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFeitCreatieWord?: (ctx: FeitCreatieWordContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.voorzetselNietVan`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVoorzetselNietVan?: (ctx: VoorzetselNietVanContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.objectCreatie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectCreatie?: (ctx: ObjectCreatieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.objectAttributeInit`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectAttributeInit?: (ctx: ObjectAttributeInitContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.attributeInitVervolg`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAttributeInitVervolg?: (ctx: AttributeInitVervolgContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.simpleNaamwoord`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSimpleNaamwoord?: (ctx: SimpleNaamwoordContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.consistentieregel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConsistentieregel?: (ctx: ConsistentieregelContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.uniekzijnResultaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUniekzijnResultaat?: (ctx: UniekzijnResultaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.alleAttributenVanObjecttype`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAlleAttributenVanObjecttype?: (ctx: AlleAttributenVanObjecttypeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.inconsistentResultaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInconsistentResultaat?: (ctx: InconsistentResultaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.voorwaardeDeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVoorwaardeDeel?: (ctx: VoorwaardeDeelContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.toplevelSamengesteldeVoorwaarde`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitToplevelSamengesteldeVoorwaarde?: (ctx: ToplevelSamengesteldeVoorwaardeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.voorwaardeKwantificatie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVoorwaardeKwantificatie?: (ctx: VoorwaardeKwantificatieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.samengesteldeVoorwaardeOnderdeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSamengesteldeVoorwaardeOnderdeel?: (ctx: SamengesteldeVoorwaardeOnderdeelContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.bulletPrefix`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBulletPrefix?: (ctx: BulletPrefixContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.elementaireVoorwaarde`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElementaireVoorwaarde?: (ctx: ElementaireVoorwaardeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.genesteSamengesteldeVoorwaarde`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenesteSamengesteldeVoorwaarde?: (ctx: GenesteSamengesteldeVoorwaardeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.onderwerpReferentie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOnderwerpReferentie?: (ctx: OnderwerpReferentieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.onderwerpReferentieWithNumbers`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOnderwerpReferentieWithNumbers?: (ctx: OnderwerpReferentieWithNumbersContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.onderwerpBasis`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOnderwerpBasis?: (ctx: OnderwerpBasisContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.onderwerpBasisWithNumbers`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOnderwerpBasisWithNumbers?: (ctx: OnderwerpBasisWithNumbersContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.basisOnderwerp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBasisOnderwerp?: (ctx: BasisOnderwerpContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.basisOnderwerpWithNumbers`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBasisOnderwerpWithNumbers?: (ctx: BasisOnderwerpWithNumbersContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.attribuutReferentie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAttribuutReferentie?: (ctx: AttribuutReferentieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.attribuutMetLidwoord`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAttribuutMetLidwoord?: (ctx: AttribuutMetLidwoordContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.kenmerkNaam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKenmerkNaam?: (ctx: KenmerkNaamContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.kenmerkPhrase`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKenmerkPhrase?: (ctx: KenmerkPhraseContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.bezieldeReferentie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBezieldeReferentie?: (ctx: BezieldeReferentieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.predicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPredicaat?: (ctx: PredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.elementairPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElementairPredicaat?: (ctx: ElementairPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.objectPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectPredicaat?: (ctx: ObjectPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.eenzijdigeObjectVergelijking`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEenzijdigeObjectVergelijking?: (ctx: EenzijdigeObjectVergelijkingContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.rolNaam`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRolNaam?: (ctx: RolNaamContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.attribuutVergelijkingsPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAttribuutVergelijkingsPredicaat?: (ctx: AttribuutVergelijkingsPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.getalPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGetalPredicaat?: (ctx: GetalPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.tekstPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTekstPredicaat?: (ctx: TekstPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.datumPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatumPredicaat?: (ctx: DatumPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.samengesteldPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSamengesteldPredicaat?: (ctx: SamengesteldPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.samengesteldeVoorwaardeOnderdeelInPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSamengesteldeVoorwaardeOnderdeelInPredicaat?: (ctx: SamengesteldeVoorwaardeOnderdeelInPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.elementaireVoorwaardeInPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElementaireVoorwaardeInPredicaat?: (ctx: ElementaireVoorwaardeInPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.vergelijkingInPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVergelijkingInPredicaat?: (ctx: VergelijkingInPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.genesteSamengesteldeVoorwaardeInPredicaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenesteSamengesteldeVoorwaardeInPredicaat?: (ctx: GenesteSamengesteldeVoorwaardeInPredicaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.getalVergelijkingsOperatorMeervoud`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGetalVergelijkingsOperatorMeervoud?: (ctx: GetalVergelijkingsOperatorMeervoudContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.tekstVergelijkingsOperatorMeervoud`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTekstVergelijkingsOperatorMeervoud?: (ctx: TekstVergelijkingsOperatorMeervoudContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.datumVergelijkingsOperatorMeervoud`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatumVergelijkingsOperatorMeervoud?: (ctx: DatumVergelijkingsOperatorMeervoudContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.getalExpressie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGetalExpressie?: (ctx: GetalExpressieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.tekstExpressie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTekstExpressie?: (ctx: TekstExpressieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.datumExpressie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatumExpressie?: (ctx: DatumExpressieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.variabeleDeel`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariabeleDeel?: (ctx: VariabeleDeelContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.variabeleToekenning`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariabeleToekenning?: (ctx: VariabeleToekenningContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.variabeleExpressie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVariabeleExpressie?: (ctx: VariabeleExpressieContext) => Result;
	/**
	 * Visit a parse tree produced by the `ExprBegrenzingAfronding`
	 * labeled alternative in `RegelSpraakParser.expressie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExprBegrenzingAfronding?: (ctx: ExprBegrenzingAfrondingContext) => Result;
	/**
	 * Visit a parse tree produced by the `ExprBegrenzing`
	 * labeled alternative in `RegelSpraakParser.expressie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExprBegrenzing?: (ctx: ExprBegrenzingContext) => Result;
	/**
	 * Visit a parse tree produced by the `ExprAfronding`
	 * labeled alternative in `RegelSpraakParser.expressie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExprAfronding?: (ctx: ExprAfrondingContext) => Result;
	/**
	 * Visit a parse tree produced by the `SimpleExpr`
	 * labeled alternative in `RegelSpraakParser.expressie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSimpleExpr?: (ctx: SimpleExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `LogicalExpr`
	 * labeled alternative in `RegelSpraakParser.logicalExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogicalExpr?: (ctx: LogicalExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `SubordinateClauseExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSubordinateClauseExpr?: (ctx: SubordinateClauseExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `IsKenmerkExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIsKenmerkExpr?: (ctx: IsKenmerkExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `HeeftKenmerkExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHeeftKenmerkExpr?: (ctx: HeeftKenmerkExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `BinaryComparisonExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBinaryComparisonExpr?: (ctx: BinaryComparisonExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `UnaryConditionExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryConditionExpr?: (ctx: UnaryConditionExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `RegelStatusConditionExpr`
	 * labeled alternative in `RegelSpraakParser.comparisonExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRegelStatusConditionExpr?: (ctx: RegelStatusConditionExprContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.comparisonOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitComparisonOperator?: (ctx: ComparisonOperatorContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.additiveExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdditiveExpression?: (ctx: AdditiveExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.additiveOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdditiveOperator?: (ctx: AdditiveOperatorContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.multiplicativeOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicativeOperator?: (ctx: MultiplicativeOperatorContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.powerExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPowerExpression?: (ctx: PowerExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.powerOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPowerOperator?: (ctx: PowerOperatorContext) => Result;
	/**
	 * Visit a parse tree produced by the `WortelFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWortelFuncExpr?: (ctx: WortelFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `BooleanTrueLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBooleanTrueLiteralExpr?: (ctx: BooleanTrueLiteralExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `AbsValFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAbsValFuncExpr?: (ctx: AbsValFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `MaxValFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMaxValFuncExpr?: (ctx: MaxValFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `RekendatumKeywordExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRekendatumKeywordExpr?: (ctx: RekendatumKeywordExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `EnumLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumLiteralExpr?: (ctx: EnumLiteralExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `NumberLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumberLiteralExpr?: (ctx: NumberLiteralExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `DatumLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatumLiteralExpr?: (ctx: DatumLiteralExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `AantalFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAantalFuncExpr?: (ctx: AantalFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `UnaryNietExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryNietExpr?: (ctx: UnaryNietExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `ConcatenatieExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConcatenatieExpr?: (ctx: ConcatenatieExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `SomAlleAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSomAlleAttribuutExpr?: (ctx: SomAlleAttribuutExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `AttrRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAttrRefExpr?: (ctx: AttrRefExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `DagUitFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDagUitFuncExpr?: (ctx: DagUitFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `BegrenzingExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBegrenzingExpr?: (ctx: BegrenzingExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `NaamwoordExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNaamwoordExpr?: (ctx: NaamwoordExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `BooleanFalseLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBooleanFalseLiteralExpr?: (ctx: BooleanFalseLiteralExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `JaarUitFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJaarUitFuncExpr?: (ctx: JaarUitFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `TotaalVanExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTotaalVanExpr?: (ctx: TotaalVanExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `TijdsevenredigDeelExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTijdsevenredigDeelExpr?: (ctx: TijdsevenredigDeelExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `CapitalizedTijdsevenredigDeelExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCapitalizedTijdsevenredigDeelExpr?: (ctx: CapitalizedTijdsevenredigDeelExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `AantalAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAantalAttribuutExpr?: (ctx: AantalAttribuutExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `ParenExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParenExpr?: (ctx: ParenExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `DimensieRangeAggExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDimensieRangeAggExpr?: (ctx: DimensieRangeAggExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `DatumMetFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatumMetFuncExpr?: (ctx: DatumMetFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `PercentageLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPercentageLiteralExpr?: (ctx: PercentageLiteralExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `StringLiteralExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStringLiteralExpr?: (ctx: StringLiteralExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `PercentageFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPercentageFuncExpr?: (ctx: PercentageFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `EersteDatumFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEersteDatumFuncExpr?: (ctx: EersteDatumFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `PasenFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPasenFuncExpr?: (ctx: PasenFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `AbsTijdsduurFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAbsTijdsduurFuncExpr?: (ctx: AbsTijdsduurFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `MaandUitFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMaandUitFuncExpr?: (ctx: MaandUitFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `CapitalizedTotaalVanExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCapitalizedTotaalVanExpr?: (ctx: CapitalizedTotaalVanExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `IdentifierExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierExpr?: (ctx: IdentifierExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `DimensieAggExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDimensieAggExpr?: (ctx: DimensieAggExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `TijdsduurFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTijdsduurFuncExpr?: (ctx: TijdsduurFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `OnderwerpRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOnderwerpRefExpr?: (ctx: OnderwerpRefExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `SomFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSomFuncExpr?: (ctx: SomFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `SomAlleExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSomAlleExpr?: (ctx: SomAlleExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `SimpleConcatenatieExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSimpleConcatenatieExpr?: (ctx: SimpleConcatenatieExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `BegrenzingAfrondingExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBegrenzingAfrondingExpr?: (ctx: BegrenzingAfrondingExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `PercentageOfExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPercentageOfExpr?: (ctx: PercentageOfExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `MinValFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMinValFuncExpr?: (ctx: MinValFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `MaxAlleAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMaxAlleAttribuutExpr?: (ctx: MaxAlleAttribuutExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `BezieldeRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBezieldeRefExpr?: (ctx: BezieldeRefExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `DateCalcExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDateCalcExpr?: (ctx: DateCalcExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `MinAlleAttribuutExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMinAlleAttribuutExpr?: (ctx: MinAlleAttribuutExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `AfrondingExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAfrondingExpr?: (ctx: AfrondingExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `LaatsteDatumFuncExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLaatsteDatumFuncExpr?: (ctx: LaatsteDatumFuncExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `HetAantalDagenInExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitHetAantalDagenInExpr?: (ctx: HetAantalDagenInExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `UnaryMinusExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `ParamRefExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParamRefExpr?: (ctx: ParamRefExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `PronounExpr`
	 * labeled alternative in `RegelSpraakParser.primaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPronounExpr?: (ctx: PronounExprContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.afronding`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAfronding?: (ctx: AfrondingContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.begrenzing`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBegrenzing?: (ctx: BegrenzingContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.begrenzingMinimum`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBegrenzingMinimum?: (ctx: BegrenzingMinimumContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.begrenzingMaximum`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBegrenzingMaximum?: (ctx: BegrenzingMaximumContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.conditieBijExpressie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConditieBijExpressie?: (ctx: ConditieBijExpressieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.periodevergelijkingEnkelvoudig`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPeriodevergelijkingEnkelvoudig?: (ctx: PeriodevergelijkingEnkelvoudigContext) => Result;
	/**
	 * Visit a parse tree produced by the `VanafPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVanafPeriode?: (ctx: VanafPeriodeContext) => Result;
	/**
	 * Visit a parse tree produced by the `TotPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTotPeriode?: (ctx: TotPeriodeContext) => Result;
	/**
	 * Visit a parse tree produced by the `TotEnMetPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTotEnMetPeriode?: (ctx: TotEnMetPeriodeContext) => Result;
	/**
	 * Visit a parse tree produced by the `VanTotPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVanTotPeriode?: (ctx: VanTotPeriodeContext) => Result;
	/**
	 * Visit a parse tree produced by the `VanTotEnMetPeriode`
	 * labeled alternative in `RegelSpraakParser.periodeDefinitie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVanTotEnMetPeriode?: (ctx: VanTotEnMetPeriodeContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.dateExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDateExpression?: (ctx: DateExpressionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.getalAggregatieFunctie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGetalAggregatieFunctie?: (ctx: GetalAggregatieFunctieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.datumAggregatieFunctie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDatumAggregatieFunctie?: (ctx: DatumAggregatieFunctieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.dimensieSelectie`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDimensieSelectie?: (ctx: DimensieSelectieContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.aggregerenOverAlleDimensies`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAggregerenOverAlleDimensies?: (ctx: AggregerenOverAlleDimensiesContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.aggregerenOverVerzameling`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAggregerenOverVerzameling?: (ctx: AggregerenOverVerzamelingContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.aggregerenOverBereik`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAggregerenOverBereik?: (ctx: AggregerenOverBereikContext) => Result;
	/**
	 * Visit a parse tree produced by the `unaryCheckCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryCheckCondition?: (ctx: UnaryCheckConditionContext) => Result;
	/**
	 * Visit a parse tree produced by the `unaryNumeriekExactCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryNumeriekExactCondition?: (ctx: UnaryNumeriekExactConditionContext) => Result;
	/**
	 * Visit a parse tree produced by the `unaryDagsoortCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryDagsoortCondition?: (ctx: UnaryDagsoortConditionContext) => Result;
	/**
	 * Visit a parse tree produced by the `unaryKenmerkCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryKenmerkCondition?: (ctx: UnaryKenmerkConditionContext) => Result;
	/**
	 * Visit a parse tree produced by the `unaryRolCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryRolCondition?: (ctx: UnaryRolConditionContext) => Result;
	/**
	 * Visit a parse tree produced by the `unaryUniekCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryUniekCondition?: (ctx: UnaryUniekConditionContext) => Result;
	/**
	 * Visit a parse tree produced by the `unaryInconsistentDataCondition`
	 * labeled alternative in `RegelSpraakParser.unaryCondition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryInconsistentDataCondition?: (ctx: UnaryInconsistentDataConditionContext) => Result;
	/**
	 * Visit a parse tree produced by the `regelStatusGevuurdCheck`
	 * labeled alternative in `RegelSpraakParser.regelStatusCondition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRegelStatusGevuurdCheck?: (ctx: RegelStatusGevuurdCheckContext) => Result;
	/**
	 * Visit a parse tree produced by the `regelStatusInconsistentCheck`
	 * labeled alternative in `RegelSpraakParser.regelStatusCondition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRegelStatusInconsistentCheck?: (ctx: RegelStatusInconsistentCheckContext) => Result;
	/**
	 * Visit a parse tree produced by the `SubordinateHasExpr`
	 * labeled alternative in `RegelSpraakParser.subordinateClauseExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSubordinateHasExpr?: (ctx: SubordinateHasExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `SubordinateIsWithExpr`
	 * labeled alternative in `RegelSpraakParser.subordinateClauseExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSubordinateIsWithExpr?: (ctx: SubordinateIsWithExprContext) => Result;
	/**
	 * Visit a parse tree produced by the `SubordinateIsKenmerkExpr`
	 * labeled alternative in `RegelSpraakParser.subordinateClauseExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSubordinateIsKenmerkExpr?: (ctx: SubordinateIsKenmerkExprContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.dagsoortDefinition`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDagsoortDefinition?: (ctx: DagsoortDefinitionContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.verdelingResultaat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingResultaat?: (ctx: VerdelingResultaatContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.verdelingMethodeSimple`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingMethodeSimple?: (ctx: VerdelingMethodeSimpleContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.verdelingMethodeMultiLine`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingMethodeMultiLine?: (ctx: VerdelingMethodeMultiLineContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.verdelingMethodeBulletList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingMethodeBulletList?: (ctx: VerdelingMethodeBulletListContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.verdelingMethodeBullet`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingMethodeBullet?: (ctx: VerdelingMethodeBulletContext) => Result;
	/**
	 * Visit a parse tree produced by the `VerdelingGelijkeDelen`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingGelijkeDelen?: (ctx: VerdelingGelijkeDelenContext) => Result;
	/**
	 * Visit a parse tree produced by the `VerdelingNaarRato`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingNaarRato?: (ctx: VerdelingNaarRatoContext) => Result;
	/**
	 * Visit a parse tree produced by the `VerdelingOpVolgorde`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingOpVolgorde?: (ctx: VerdelingOpVolgordeContext) => Result;
	/**
	 * Visit a parse tree produced by the `VerdelingTieBreak`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingTieBreak?: (ctx: VerdelingTieBreakContext) => Result;
	/**
	 * Visit a parse tree produced by the `VerdelingMaximum`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingMaximum?: (ctx: VerdelingMaximumContext) => Result;
	/**
	 * Visit a parse tree produced by the `VerdelingAfronding`
	 * labeled alternative in `RegelSpraakParser.verdelingMethode`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingAfronding?: (ctx: VerdelingAfrondingContext) => Result;
	/**
	 * Visit a parse tree produced by `RegelSpraakParser.verdelingRest`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVerdelingRest?: (ctx: VerdelingRestContext) => Result;
}

