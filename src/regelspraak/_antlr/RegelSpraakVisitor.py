# Generated from RegelSpraak.g4 by ANTLR 4.13.1
from antlr4 import *
if "." in __name__:
    from .RegelSpraakParser import RegelSpraakParser
else:
    from RegelSpraakParser import RegelSpraakParser

# This class defines a complete generic visitor for a parse tree produced by RegelSpraakParser.

class RegelSpraakVisitor(ParseTreeVisitor):

    # Visit a parse tree produced by RegelSpraakParser#regelSpraakDocument.
    def visitRegelSpraakDocument(self, ctx:RegelSpraakParser.RegelSpraakDocumentContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#definitie.
    def visitDefinitie(self, ctx:RegelSpraakParser.DefinitieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#beslistabel.
    def visitBeslistabel(self, ctx:RegelSpraakParser.BeslistabelContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#identifier.
    def visitIdentifier(self, ctx:RegelSpraakParser.IdentifierContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#naamPhrase.
    def visitNaamPhrase(self, ctx:RegelSpraakParser.NaamPhraseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#naamwoord.
    def visitNaamwoord(self, ctx:RegelSpraakParser.NaamwoordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#voorzetsel.
    def visitVoorzetsel(self, ctx:RegelSpraakParser.VoorzetselContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#datumLiteral.
    def visitDatumLiteral(self, ctx:RegelSpraakParser.DatumLiteralContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#unit.
    def visitUnit(self, ctx:RegelSpraakParser.UnitContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#objectTypeDefinition.
    def visitObjectTypeDefinition(self, ctx:RegelSpraakParser.ObjectTypeDefinitionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#objectTypeMember.
    def visitObjectTypeMember(self, ctx:RegelSpraakParser.ObjectTypeMemberContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#kenmerkSpecificatie.
    def visitKenmerkSpecificatie(self, ctx:RegelSpraakParser.KenmerkSpecificatieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#attribuutSpecificatie.
    def visitAttribuutSpecificatie(self, ctx:RegelSpraakParser.AttribuutSpecificatieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#datatype.
    def visitDatatype(self, ctx:RegelSpraakParser.DatatypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#numeriekDatatype.
    def visitNumeriekDatatype(self, ctx:RegelSpraakParser.NumeriekDatatypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#tekstDatatype.
    def visitTekstDatatype(self, ctx:RegelSpraakParser.TekstDatatypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#booleanDatatype.
    def visitBooleanDatatype(self, ctx:RegelSpraakParser.BooleanDatatypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#datumTijdDatatype.
    def visitDatumTijdDatatype(self, ctx:RegelSpraakParser.DatumTijdDatatypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#getalSpecificatie.
    def visitGetalSpecificatie(self, ctx:RegelSpraakParser.GetalSpecificatieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#domeinDefinition.
    def visitDomeinDefinition(self, ctx:RegelSpraakParser.DomeinDefinitionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#domeinType.
    def visitDomeinType(self, ctx:RegelSpraakParser.DomeinTypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#enumeratieSpecificatie.
    def visitEnumeratieSpecificatie(self, ctx:RegelSpraakParser.EnumeratieSpecificatieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#domeinRef.
    def visitDomeinRef(self, ctx:RegelSpraakParser.DomeinRefContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#eenheidsysteemDefinition.
    def visitEenheidsysteemDefinition(self, ctx:RegelSpraakParser.EenheidsysteemDefinitionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#eenheidEntry.
    def visitEenheidEntry(self, ctx:RegelSpraakParser.EenheidEntryContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#unitIdentifier.
    def visitUnitIdentifier(self, ctx:RegelSpraakParser.UnitIdentifierContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#eenheidExpressie.
    def visitEenheidExpressie(self, ctx:RegelSpraakParser.EenheidExpressieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#eenheidMacht.
    def visitEenheidMacht(self, ctx:RegelSpraakParser.EenheidMachtContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#dimensieDefinition.
    def visitDimensieDefinition(self, ctx:RegelSpraakParser.DimensieDefinitionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#voorzetselSpecificatie.
    def visitVoorzetselSpecificatie(self, ctx:RegelSpraakParser.VoorzetselSpecificatieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#labelWaardeSpecificatie.
    def visitLabelWaardeSpecificatie(self, ctx:RegelSpraakParser.LabelWaardeSpecificatieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#tijdlijn.
    def visitTijdlijn(self, ctx:RegelSpraakParser.TijdlijnContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#dimensieRef.
    def visitDimensieRef(self, ctx:RegelSpraakParser.DimensieRefContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#parameterDefinition.
    def visitParameterDefinition(self, ctx:RegelSpraakParser.ParameterDefinitionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#parameterNamePhrase.
    def visitParameterNamePhrase(self, ctx:RegelSpraakParser.ParameterNamePhraseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#parameterMetLidwoord.
    def visitParameterMetLidwoord(self, ctx:RegelSpraakParser.ParameterMetLidwoordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#feitTypeDefinition.
    def visitFeitTypeDefinition(self, ctx:RegelSpraakParser.FeitTypeDefinitionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#rolSpecificatie.
    def visitRolSpecificatie(self, ctx:RegelSpraakParser.RolSpecificatieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#regel.
    def visitRegel(self, ctx:RegelSpraakParser.RegelContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#regelName.
    def visitRegelName(self, ctx:RegelSpraakParser.RegelNameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#regelVersie.
    def visitRegelVersie(self, ctx:RegelSpraakParser.RegelVersieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#versieGeldigheid.
    def visitVersieGeldigheid(self, ctx:RegelSpraakParser.VersieGeldigheidContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#GelijkstellingResultaat.
    def visitGelijkstellingResultaat(self, ctx:RegelSpraakParser.GelijkstellingResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#KenmerkFeitResultaat.
    def visitKenmerkFeitResultaat(self, ctx:RegelSpraakParser.KenmerkFeitResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#FeitCreatieResultaat.
    def visitFeitCreatieResultaat(self, ctx:RegelSpraakParser.FeitCreatieResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#CapitalizedGelijkstellingResultaat.
    def visitCapitalizedGelijkstellingResultaat(self, ctx:RegelSpraakParser.CapitalizedGelijkstellingResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SpecialPhraseResultaat.
    def visitSpecialPhraseResultaat(self, ctx:RegelSpraakParser.SpecialPhraseResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#AantalDagenInResultaat.
    def visitAantalDagenInResultaat(self, ctx:RegelSpraakParser.AantalDagenInResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#ObjectCreatieActie.
    def visitObjectCreatieActie(self, ctx:RegelSpraakParser.ObjectCreatieActieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#objectCreatie.
    def visitObjectCreatie(self, ctx:RegelSpraakParser.ObjectCreatieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#objectAttributeInit.
    def visitObjectAttributeInit(self, ctx:RegelSpraakParser.ObjectAttributeInitContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#attributeInitVervolg.
    def visitAttributeInitVervolg(self, ctx:RegelSpraakParser.AttributeInitVervolgContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#consistentieregel.
    def visitConsistentieregel(self, ctx:RegelSpraakParser.ConsistentieregelContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#uniekzijnResultaat.
    def visitUniekzijnResultaat(self, ctx:RegelSpraakParser.UniekzijnResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#inconsistentResultaat.
    def visitInconsistentResultaat(self, ctx:RegelSpraakParser.InconsistentResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#voorwaardeDeel.
    def visitVoorwaardeDeel(self, ctx:RegelSpraakParser.VoorwaardeDeelContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#onderwerpReferentie.
    def visitOnderwerpReferentie(self, ctx:RegelSpraakParser.OnderwerpReferentieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#basisOnderwerp.
    def visitBasisOnderwerp(self, ctx:RegelSpraakParser.BasisOnderwerpContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#attribuutReferentie.
    def visitAttribuutReferentie(self, ctx:RegelSpraakParser.AttribuutReferentieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#kenmerkNaam.
    def visitKenmerkNaam(self, ctx:RegelSpraakParser.KenmerkNaamContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#bezieldeReferentie.
    def visitBezieldeReferentie(self, ctx:RegelSpraakParser.BezieldeReferentieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#toplevelSamengesteldeVoorwaarde.
    def visitToplevelSamengesteldeVoorwaarde(self, ctx:RegelSpraakParser.ToplevelSamengesteldeVoorwaardeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#voorwaardeKwantificatie.
    def visitVoorwaardeKwantificatie(self, ctx:RegelSpraakParser.VoorwaardeKwantificatieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#samengesteldeVoorwaardeOnderdeel.
    def visitSamengesteldeVoorwaardeOnderdeel(self, ctx:RegelSpraakParser.SamengesteldeVoorwaardeOnderdeelContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#genesteVoorwaarde.
    def visitGenesteVoorwaarde(self, ctx:RegelSpraakParser.GenesteVoorwaardeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#variabeleDeel.
    def visitVariabeleDeel(self, ctx:RegelSpraakParser.VariabeleDeelContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#variabeleToekenning.
    def visitVariabeleToekenning(self, ctx:RegelSpraakParser.VariabeleToekenningContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#expressie.
    def visitExpressie(self, ctx:RegelSpraakParser.ExpressieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#logicalExpression.
    def visitLogicalExpression(self, ctx:RegelSpraakParser.LogicalExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#IsKenmerkExpr.
    def visitIsKenmerkExpr(self, ctx:RegelSpraakParser.IsKenmerkExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#HeeftKenmerkExpr.
    def visitHeeftKenmerkExpr(self, ctx:RegelSpraakParser.HeeftKenmerkExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#BinaryComparisonExpr.
    def visitBinaryComparisonExpr(self, ctx:RegelSpraakParser.BinaryComparisonExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#UnaryConditionExpr.
    def visitUnaryConditionExpr(self, ctx:RegelSpraakParser.UnaryConditionExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#RegelStatusConditionExpr.
    def visitRegelStatusConditionExpr(self, ctx:RegelSpraakParser.RegelStatusConditionExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#comparisonOperator.
    def visitComparisonOperator(self, ctx:RegelSpraakParser.ComparisonOperatorContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#additiveExpression.
    def visitAdditiveExpression(self, ctx:RegelSpraakParser.AdditiveExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#additiveOperator.
    def visitAdditiveOperator(self, ctx:RegelSpraakParser.AdditiveOperatorContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#multiplicativeExpression.
    def visitMultiplicativeExpression(self, ctx:RegelSpraakParser.MultiplicativeExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#multiplicativeOperator.
    def visitMultiplicativeOperator(self, ctx:RegelSpraakParser.MultiplicativeOperatorContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#powerExpression.
    def visitPowerExpression(self, ctx:RegelSpraakParser.PowerExpressionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#powerOperator.
    def visitPowerOperator(self, ctx:RegelSpraakParser.PowerOperatorContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#WortelFuncExpr.
    def visitWortelFuncExpr(self, ctx:RegelSpraakParser.WortelFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#BooleanTrueLiteralExpr.
    def visitBooleanTrueLiteralExpr(self, ctx:RegelSpraakParser.BooleanTrueLiteralExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DatumMetFuncExpr.
    def visitDatumMetFuncExpr(self, ctx:RegelSpraakParser.DatumMetFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#StringLiteralExpr.
    def visitStringLiteralExpr(self, ctx:RegelSpraakParser.StringLiteralExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#AbsValFuncExpr.
    def visitAbsValFuncExpr(self, ctx:RegelSpraakParser.AbsValFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#MaxValFuncExpr.
    def visitMaxValFuncExpr(self, ctx:RegelSpraakParser.MaxValFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#RekendatumKeywordExpr.
    def visitRekendatumKeywordExpr(self, ctx:RegelSpraakParser.RekendatumKeywordExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#PercentageFuncExpr.
    def visitPercentageFuncExpr(self, ctx:RegelSpraakParser.PercentageFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#EersteDatumFuncExpr.
    def visitEersteDatumFuncExpr(self, ctx:RegelSpraakParser.EersteDatumFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#PasenFuncExpr.
    def visitPasenFuncExpr(self, ctx:RegelSpraakParser.PasenFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#EnumLiteralExpr.
    def visitEnumLiteralExpr(self, ctx:RegelSpraakParser.EnumLiteralExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#NumberLiteralExpr.
    def visitNumberLiteralExpr(self, ctx:RegelSpraakParser.NumberLiteralExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#AbsTijdsduurFuncExpr.
    def visitAbsTijdsduurFuncExpr(self, ctx:RegelSpraakParser.AbsTijdsduurFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#MaandUitFuncExpr.
    def visitMaandUitFuncExpr(self, ctx:RegelSpraakParser.MaandUitFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#CapitalizedTotaalVanExpr.
    def visitCapitalizedTotaalVanExpr(self, ctx:RegelSpraakParser.CapitalizedTotaalVanExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#IdentifierExpr.
    def visitIdentifierExpr(self, ctx:RegelSpraakParser.IdentifierExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DatumLiteralExpr.
    def visitDatumLiteralExpr(self, ctx:RegelSpraakParser.DatumLiteralExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DimensieAggExpr.
    def visitDimensieAggExpr(self, ctx:RegelSpraakParser.DimensieAggExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#TijdsduurFuncExpr.
    def visitTijdsduurFuncExpr(self, ctx:RegelSpraakParser.TijdsduurFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#AantalFuncExpr.
    def visitAantalFuncExpr(self, ctx:RegelSpraakParser.AantalFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#UnaryNietExpr.
    def visitUnaryNietExpr(self, ctx:RegelSpraakParser.UnaryNietExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#ConcatenatieExpr.
    def visitConcatenatieExpr(self, ctx:RegelSpraakParser.ConcatenatieExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#OnderwerpRefExpr.
    def visitOnderwerpRefExpr(self, ctx:RegelSpraakParser.OnderwerpRefExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SomFuncExpr.
    def visitSomFuncExpr(self, ctx:RegelSpraakParser.SomFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#AttrRefExpr.
    def visitAttrRefExpr(self, ctx:RegelSpraakParser.AttrRefExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DagUitFuncExpr.
    def visitDagUitFuncExpr(self, ctx:RegelSpraakParser.DagUitFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SimpleConcatenatieExpr.
    def visitSimpleConcatenatieExpr(self, ctx:RegelSpraakParser.SimpleConcatenatieExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#BegrenzingExpr.
    def visitBegrenzingExpr(self, ctx:RegelSpraakParser.BegrenzingExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#NaamwoordExpr.
    def visitNaamwoordExpr(self, ctx:RegelSpraakParser.NaamwoordExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#BooleanFalseLiteralExpr.
    def visitBooleanFalseLiteralExpr(self, ctx:RegelSpraakParser.BooleanFalseLiteralExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#MinValFuncExpr.
    def visitMinValFuncExpr(self, ctx:RegelSpraakParser.MinValFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#JaarUitFuncExpr.
    def visitJaarUitFuncExpr(self, ctx:RegelSpraakParser.JaarUitFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#BezieldeRefExpr.
    def visitBezieldeRefExpr(self, ctx:RegelSpraakParser.BezieldeRefExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DateCalcExpr.
    def visitDateCalcExpr(self, ctx:RegelSpraakParser.DateCalcExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#TotaalVanExpr.
    def visitTotaalVanExpr(self, ctx:RegelSpraakParser.TotaalVanExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#AfrondingExpr.
    def visitAfrondingExpr(self, ctx:RegelSpraakParser.AfrondingExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#LaatsteDatumFuncExpr.
    def visitLaatsteDatumFuncExpr(self, ctx:RegelSpraakParser.LaatsteDatumFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#HetAantalDagenInExpr.
    def visitHetAantalDagenInExpr(self, ctx:RegelSpraakParser.HetAantalDagenInExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#TijdsevenredigDeelExpr.
    def visitTijdsevenredigDeelExpr(self, ctx:RegelSpraakParser.TijdsevenredigDeelExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#CapitalizedTijdsevenredigDeelExpr.
    def visitCapitalizedTijdsevenredigDeelExpr(self, ctx:RegelSpraakParser.CapitalizedTijdsevenredigDeelExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#ParenExpr.
    def visitParenExpr(self, ctx:RegelSpraakParser.ParenExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#UnaryMinusExpr.
    def visitUnaryMinusExpr(self, ctx:RegelSpraakParser.UnaryMinusExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#ParamRefExpr.
    def visitParamRefExpr(self, ctx:RegelSpraakParser.ParamRefExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#PronounExpr.
    def visitPronounExpr(self, ctx:RegelSpraakParser.PronounExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#afronding.
    def visitAfronding(self, ctx:RegelSpraakParser.AfrondingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#begrenzing.
    def visitBegrenzing(self, ctx:RegelSpraakParser.BegrenzingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#begrenzingMinimum.
    def visitBegrenzingMinimum(self, ctx:RegelSpraakParser.BegrenzingMinimumContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#begrenzingMaximum.
    def visitBegrenzingMaximum(self, ctx:RegelSpraakParser.BegrenzingMaximumContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#conditieBijExpressie.
    def visitConditieBijExpressie(self, ctx:RegelSpraakParser.ConditieBijExpressieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#periodevergelijkingEnkelvoudig.
    def visitPeriodevergelijkingEnkelvoudig(self, ctx:RegelSpraakParser.PeriodevergelijkingEnkelvoudigContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#getalAggregatieFunctie.
    def visitGetalAggregatieFunctie(self, ctx:RegelSpraakParser.GetalAggregatieFunctieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#datumAggregatieFunctie.
    def visitDatumAggregatieFunctie(self, ctx:RegelSpraakParser.DatumAggregatieFunctieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#dimensieSelectie.
    def visitDimensieSelectie(self, ctx:RegelSpraakParser.DimensieSelectieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#aggregerenOverAlleDimensies.
    def visitAggregerenOverAlleDimensies(self, ctx:RegelSpraakParser.AggregerenOverAlleDimensiesContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#aggregerenOverVerzameling.
    def visitAggregerenOverVerzameling(self, ctx:RegelSpraakParser.AggregerenOverVerzamelingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#aggregerenOverBereik.
    def visitAggregerenOverBereik(self, ctx:RegelSpraakParser.AggregerenOverBereikContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#unaryCheckCondition.
    def visitUnaryCheckCondition(self, ctx:RegelSpraakParser.UnaryCheckConditionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#unaryNumeriekExactCondition.
    def visitUnaryNumeriekExactCondition(self, ctx:RegelSpraakParser.UnaryNumeriekExactConditionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#unaryDagsoortCondition.
    def visitUnaryDagsoortCondition(self, ctx:RegelSpraakParser.UnaryDagsoortConditionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#unaryKenmerkCondition.
    def visitUnaryKenmerkCondition(self, ctx:RegelSpraakParser.UnaryKenmerkConditionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#unaryRolCondition.
    def visitUnaryRolCondition(self, ctx:RegelSpraakParser.UnaryRolConditionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#unaryUniekCondition.
    def visitUnaryUniekCondition(self, ctx:RegelSpraakParser.UnaryUniekConditionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#unaryInconsistentDataCondition.
    def visitUnaryInconsistentDataCondition(self, ctx:RegelSpraakParser.UnaryInconsistentDataConditionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#regelStatusCheck.
    def visitRegelStatusCheck(self, ctx:RegelSpraakParser.RegelStatusCheckContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#dagsoortDefinition.
    def visitDagsoortDefinition(self, ctx:RegelSpraakParser.DagsoortDefinitionContext):
        return self.visitChildren(ctx)



del RegelSpraakParser