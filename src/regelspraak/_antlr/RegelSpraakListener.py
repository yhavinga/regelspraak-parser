# Generated from RegelSpraak.g4 by ANTLR 4.13.1
from antlr4 import *
if "." in __name__:
    from .RegelSpraakParser import RegelSpraakParser
else:
    from RegelSpraakParser import RegelSpraakParser

# This class defines a complete listener for a parse tree produced by RegelSpraakParser.
class RegelSpraakListener(ParseTreeListener):

    # Enter a parse tree produced by RegelSpraakParser#regelSpraakDocument.
    def enterRegelSpraakDocument(self, ctx:RegelSpraakParser.RegelSpraakDocumentContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#regelSpraakDocument.
    def exitRegelSpraakDocument(self, ctx:RegelSpraakParser.RegelSpraakDocumentContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#definitie.
    def enterDefinitie(self, ctx:RegelSpraakParser.DefinitieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#definitie.
    def exitDefinitie(self, ctx:RegelSpraakParser.DefinitieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#beslistabel.
    def enterBeslistabel(self, ctx:RegelSpraakParser.BeslistabelContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#beslistabel.
    def exitBeslistabel(self, ctx:RegelSpraakParser.BeslistabelContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#identifier.
    def enterIdentifier(self, ctx:RegelSpraakParser.IdentifierContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#identifier.
    def exitIdentifier(self, ctx:RegelSpraakParser.IdentifierContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#naamPhrase.
    def enterNaamPhrase(self, ctx:RegelSpraakParser.NaamPhraseContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#naamPhrase.
    def exitNaamPhrase(self, ctx:RegelSpraakParser.NaamPhraseContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#naamwoord.
    def enterNaamwoord(self, ctx:RegelSpraakParser.NaamwoordContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#naamwoord.
    def exitNaamwoord(self, ctx:RegelSpraakParser.NaamwoordContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#voorzetsel.
    def enterVoorzetsel(self, ctx:RegelSpraakParser.VoorzetselContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#voorzetsel.
    def exitVoorzetsel(self, ctx:RegelSpraakParser.VoorzetselContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#datumLiteral.
    def enterDatumLiteral(self, ctx:RegelSpraakParser.DatumLiteralContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#datumLiteral.
    def exitDatumLiteral(self, ctx:RegelSpraakParser.DatumLiteralContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#unit.
    def enterUnit(self, ctx:RegelSpraakParser.UnitContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#unit.
    def exitUnit(self, ctx:RegelSpraakParser.UnitContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#objectTypeDefinition.
    def enterObjectTypeDefinition(self, ctx:RegelSpraakParser.ObjectTypeDefinitionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#objectTypeDefinition.
    def exitObjectTypeDefinition(self, ctx:RegelSpraakParser.ObjectTypeDefinitionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#objectTypeMember.
    def enterObjectTypeMember(self, ctx:RegelSpraakParser.ObjectTypeMemberContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#objectTypeMember.
    def exitObjectTypeMember(self, ctx:RegelSpraakParser.ObjectTypeMemberContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#kenmerkSpecificatie.
    def enterKenmerkSpecificatie(self, ctx:RegelSpraakParser.KenmerkSpecificatieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#kenmerkSpecificatie.
    def exitKenmerkSpecificatie(self, ctx:RegelSpraakParser.KenmerkSpecificatieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#attribuutSpecificatie.
    def enterAttribuutSpecificatie(self, ctx:RegelSpraakParser.AttribuutSpecificatieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#attribuutSpecificatie.
    def exitAttribuutSpecificatie(self, ctx:RegelSpraakParser.AttribuutSpecificatieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#datatype.
    def enterDatatype(self, ctx:RegelSpraakParser.DatatypeContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#datatype.
    def exitDatatype(self, ctx:RegelSpraakParser.DatatypeContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#numeriekDatatype.
    def enterNumeriekDatatype(self, ctx:RegelSpraakParser.NumeriekDatatypeContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#numeriekDatatype.
    def exitNumeriekDatatype(self, ctx:RegelSpraakParser.NumeriekDatatypeContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#tekstDatatype.
    def enterTekstDatatype(self, ctx:RegelSpraakParser.TekstDatatypeContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#tekstDatatype.
    def exitTekstDatatype(self, ctx:RegelSpraakParser.TekstDatatypeContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#booleanDatatype.
    def enterBooleanDatatype(self, ctx:RegelSpraakParser.BooleanDatatypeContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#booleanDatatype.
    def exitBooleanDatatype(self, ctx:RegelSpraakParser.BooleanDatatypeContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#datumTijdDatatype.
    def enterDatumTijdDatatype(self, ctx:RegelSpraakParser.DatumTijdDatatypeContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#datumTijdDatatype.
    def exitDatumTijdDatatype(self, ctx:RegelSpraakParser.DatumTijdDatatypeContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#getalSpecificatie.
    def enterGetalSpecificatie(self, ctx:RegelSpraakParser.GetalSpecificatieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#getalSpecificatie.
    def exitGetalSpecificatie(self, ctx:RegelSpraakParser.GetalSpecificatieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#domeinDefinition.
    def enterDomeinDefinition(self, ctx:RegelSpraakParser.DomeinDefinitionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#domeinDefinition.
    def exitDomeinDefinition(self, ctx:RegelSpraakParser.DomeinDefinitionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#domeinType.
    def enterDomeinType(self, ctx:RegelSpraakParser.DomeinTypeContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#domeinType.
    def exitDomeinType(self, ctx:RegelSpraakParser.DomeinTypeContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#enumeratieSpecificatie.
    def enterEnumeratieSpecificatie(self, ctx:RegelSpraakParser.EnumeratieSpecificatieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#enumeratieSpecificatie.
    def exitEnumeratieSpecificatie(self, ctx:RegelSpraakParser.EnumeratieSpecificatieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#domeinRef.
    def enterDomeinRef(self, ctx:RegelSpraakParser.DomeinRefContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#domeinRef.
    def exitDomeinRef(self, ctx:RegelSpraakParser.DomeinRefContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#eenheidsysteemDefinition.
    def enterEenheidsysteemDefinition(self, ctx:RegelSpraakParser.EenheidsysteemDefinitionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#eenheidsysteemDefinition.
    def exitEenheidsysteemDefinition(self, ctx:RegelSpraakParser.EenheidsysteemDefinitionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#eenheidEntry.
    def enterEenheidEntry(self, ctx:RegelSpraakParser.EenheidEntryContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#eenheidEntry.
    def exitEenheidEntry(self, ctx:RegelSpraakParser.EenheidEntryContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#unitIdentifier.
    def enterUnitIdentifier(self, ctx:RegelSpraakParser.UnitIdentifierContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#unitIdentifier.
    def exitUnitIdentifier(self, ctx:RegelSpraakParser.UnitIdentifierContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#eenheidExpressie.
    def enterEenheidExpressie(self, ctx:RegelSpraakParser.EenheidExpressieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#eenheidExpressie.
    def exitEenheidExpressie(self, ctx:RegelSpraakParser.EenheidExpressieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#eenheidMacht.
    def enterEenheidMacht(self, ctx:RegelSpraakParser.EenheidMachtContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#eenheidMacht.
    def exitEenheidMacht(self, ctx:RegelSpraakParser.EenheidMachtContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#dimensieDefinition.
    def enterDimensieDefinition(self, ctx:RegelSpraakParser.DimensieDefinitionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#dimensieDefinition.
    def exitDimensieDefinition(self, ctx:RegelSpraakParser.DimensieDefinitionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#voorzetselSpecificatie.
    def enterVoorzetselSpecificatie(self, ctx:RegelSpraakParser.VoorzetselSpecificatieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#voorzetselSpecificatie.
    def exitVoorzetselSpecificatie(self, ctx:RegelSpraakParser.VoorzetselSpecificatieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#labelWaardeSpecificatie.
    def enterLabelWaardeSpecificatie(self, ctx:RegelSpraakParser.LabelWaardeSpecificatieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#labelWaardeSpecificatie.
    def exitLabelWaardeSpecificatie(self, ctx:RegelSpraakParser.LabelWaardeSpecificatieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#tijdlijn.
    def enterTijdlijn(self, ctx:RegelSpraakParser.TijdlijnContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#tijdlijn.
    def exitTijdlijn(self, ctx:RegelSpraakParser.TijdlijnContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#dimensieRef.
    def enterDimensieRef(self, ctx:RegelSpraakParser.DimensieRefContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#dimensieRef.
    def exitDimensieRef(self, ctx:RegelSpraakParser.DimensieRefContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#parameterDefinition.
    def enterParameterDefinition(self, ctx:RegelSpraakParser.ParameterDefinitionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#parameterDefinition.
    def exitParameterDefinition(self, ctx:RegelSpraakParser.ParameterDefinitionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#parameterNamePhrase.
    def enterParameterNamePhrase(self, ctx:RegelSpraakParser.ParameterNamePhraseContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#parameterNamePhrase.
    def exitParameterNamePhrase(self, ctx:RegelSpraakParser.ParameterNamePhraseContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#parameterMetLidwoord.
    def enterParameterMetLidwoord(self, ctx:RegelSpraakParser.ParameterMetLidwoordContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#parameterMetLidwoord.
    def exitParameterMetLidwoord(self, ctx:RegelSpraakParser.ParameterMetLidwoordContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#feitTypeDefinition.
    def enterFeitTypeDefinition(self, ctx:RegelSpraakParser.FeitTypeDefinitionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#feitTypeDefinition.
    def exitFeitTypeDefinition(self, ctx:RegelSpraakParser.FeitTypeDefinitionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#rolSpecificatie.
    def enterRolSpecificatie(self, ctx:RegelSpraakParser.RolSpecificatieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#rolSpecificatie.
    def exitRolSpecificatie(self, ctx:RegelSpraakParser.RolSpecificatieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#regel.
    def enterRegel(self, ctx:RegelSpraakParser.RegelContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#regel.
    def exitRegel(self, ctx:RegelSpraakParser.RegelContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#regelName.
    def enterRegelName(self, ctx:RegelSpraakParser.RegelNameContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#regelName.
    def exitRegelName(self, ctx:RegelSpraakParser.RegelNameContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#regelVersie.
    def enterRegelVersie(self, ctx:RegelSpraakParser.RegelVersieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#regelVersie.
    def exitRegelVersie(self, ctx:RegelSpraakParser.RegelVersieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#versieGeldigheid.
    def enterVersieGeldigheid(self, ctx:RegelSpraakParser.VersieGeldigheidContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#versieGeldigheid.
    def exitVersieGeldigheid(self, ctx:RegelSpraakParser.VersieGeldigheidContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#GelijkstellingResultaat.
    def enterGelijkstellingResultaat(self, ctx:RegelSpraakParser.GelijkstellingResultaatContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#GelijkstellingResultaat.
    def exitGelijkstellingResultaat(self, ctx:RegelSpraakParser.GelijkstellingResultaatContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#KenmerkFeitResultaat.
    def enterKenmerkFeitResultaat(self, ctx:RegelSpraakParser.KenmerkFeitResultaatContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#KenmerkFeitResultaat.
    def exitKenmerkFeitResultaat(self, ctx:RegelSpraakParser.KenmerkFeitResultaatContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#FeitCreatieResultaat.
    def enterFeitCreatieResultaat(self, ctx:RegelSpraakParser.FeitCreatieResultaatContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#FeitCreatieResultaat.
    def exitFeitCreatieResultaat(self, ctx:RegelSpraakParser.FeitCreatieResultaatContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#CapitalizedGelijkstellingResultaat.
    def enterCapitalizedGelijkstellingResultaat(self, ctx:RegelSpraakParser.CapitalizedGelijkstellingResultaatContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#CapitalizedGelijkstellingResultaat.
    def exitCapitalizedGelijkstellingResultaat(self, ctx:RegelSpraakParser.CapitalizedGelijkstellingResultaatContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#SpecialPhraseResultaat.
    def enterSpecialPhraseResultaat(self, ctx:RegelSpraakParser.SpecialPhraseResultaatContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#SpecialPhraseResultaat.
    def exitSpecialPhraseResultaat(self, ctx:RegelSpraakParser.SpecialPhraseResultaatContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#AantalDagenInResultaat.
    def enterAantalDagenInResultaat(self, ctx:RegelSpraakParser.AantalDagenInResultaatContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#AantalDagenInResultaat.
    def exitAantalDagenInResultaat(self, ctx:RegelSpraakParser.AantalDagenInResultaatContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#ObjectCreatieActie.
    def enterObjectCreatieActie(self, ctx:RegelSpraakParser.ObjectCreatieActieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#ObjectCreatieActie.
    def exitObjectCreatieActie(self, ctx:RegelSpraakParser.ObjectCreatieActieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#objectCreatie.
    def enterObjectCreatie(self, ctx:RegelSpraakParser.ObjectCreatieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#objectCreatie.
    def exitObjectCreatie(self, ctx:RegelSpraakParser.ObjectCreatieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#objectAttributeInit.
    def enterObjectAttributeInit(self, ctx:RegelSpraakParser.ObjectAttributeInitContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#objectAttributeInit.
    def exitObjectAttributeInit(self, ctx:RegelSpraakParser.ObjectAttributeInitContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#attributeInitVervolg.
    def enterAttributeInitVervolg(self, ctx:RegelSpraakParser.AttributeInitVervolgContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#attributeInitVervolg.
    def exitAttributeInitVervolg(self, ctx:RegelSpraakParser.AttributeInitVervolgContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#consistentieregel.
    def enterConsistentieregel(self, ctx:RegelSpraakParser.ConsistentieregelContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#consistentieregel.
    def exitConsistentieregel(self, ctx:RegelSpraakParser.ConsistentieregelContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#uniekzijnResultaat.
    def enterUniekzijnResultaat(self, ctx:RegelSpraakParser.UniekzijnResultaatContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#uniekzijnResultaat.
    def exitUniekzijnResultaat(self, ctx:RegelSpraakParser.UniekzijnResultaatContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#inconsistentResultaat.
    def enterInconsistentResultaat(self, ctx:RegelSpraakParser.InconsistentResultaatContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#inconsistentResultaat.
    def exitInconsistentResultaat(self, ctx:RegelSpraakParser.InconsistentResultaatContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#voorwaardeDeel.
    def enterVoorwaardeDeel(self, ctx:RegelSpraakParser.VoorwaardeDeelContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#voorwaardeDeel.
    def exitVoorwaardeDeel(self, ctx:RegelSpraakParser.VoorwaardeDeelContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#onderwerpReferentie.
    def enterOnderwerpReferentie(self, ctx:RegelSpraakParser.OnderwerpReferentieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#onderwerpReferentie.
    def exitOnderwerpReferentie(self, ctx:RegelSpraakParser.OnderwerpReferentieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#basisOnderwerp.
    def enterBasisOnderwerp(self, ctx:RegelSpraakParser.BasisOnderwerpContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#basisOnderwerp.
    def exitBasisOnderwerp(self, ctx:RegelSpraakParser.BasisOnderwerpContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#attribuutReferentie.
    def enterAttribuutReferentie(self, ctx:RegelSpraakParser.AttribuutReferentieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#attribuutReferentie.
    def exitAttribuutReferentie(self, ctx:RegelSpraakParser.AttribuutReferentieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#kenmerkNaam.
    def enterKenmerkNaam(self, ctx:RegelSpraakParser.KenmerkNaamContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#kenmerkNaam.
    def exitKenmerkNaam(self, ctx:RegelSpraakParser.KenmerkNaamContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#bezieldeReferentie.
    def enterBezieldeReferentie(self, ctx:RegelSpraakParser.BezieldeReferentieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#bezieldeReferentie.
    def exitBezieldeReferentie(self, ctx:RegelSpraakParser.BezieldeReferentieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#toplevelSamengesteldeVoorwaarde.
    def enterToplevelSamengesteldeVoorwaarde(self, ctx:RegelSpraakParser.ToplevelSamengesteldeVoorwaardeContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#toplevelSamengesteldeVoorwaarde.
    def exitToplevelSamengesteldeVoorwaarde(self, ctx:RegelSpraakParser.ToplevelSamengesteldeVoorwaardeContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#voorwaardeKwantificatie.
    def enterVoorwaardeKwantificatie(self, ctx:RegelSpraakParser.VoorwaardeKwantificatieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#voorwaardeKwantificatie.
    def exitVoorwaardeKwantificatie(self, ctx:RegelSpraakParser.VoorwaardeKwantificatieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#samengesteldeVoorwaardeOnderdeel.
    def enterSamengesteldeVoorwaardeOnderdeel(self, ctx:RegelSpraakParser.SamengesteldeVoorwaardeOnderdeelContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#samengesteldeVoorwaardeOnderdeel.
    def exitSamengesteldeVoorwaardeOnderdeel(self, ctx:RegelSpraakParser.SamengesteldeVoorwaardeOnderdeelContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#genesteVoorwaarde.
    def enterGenesteVoorwaarde(self, ctx:RegelSpraakParser.GenesteVoorwaardeContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#genesteVoorwaarde.
    def exitGenesteVoorwaarde(self, ctx:RegelSpraakParser.GenesteVoorwaardeContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#variabeleDeel.
    def enterVariabeleDeel(self, ctx:RegelSpraakParser.VariabeleDeelContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#variabeleDeel.
    def exitVariabeleDeel(self, ctx:RegelSpraakParser.VariabeleDeelContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#variabeleToekenning.
    def enterVariabeleToekenning(self, ctx:RegelSpraakParser.VariabeleToekenningContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#variabeleToekenning.
    def exitVariabeleToekenning(self, ctx:RegelSpraakParser.VariabeleToekenningContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#expressie.
    def enterExpressie(self, ctx:RegelSpraakParser.ExpressieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#expressie.
    def exitExpressie(self, ctx:RegelSpraakParser.ExpressieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#logicalExpression.
    def enterLogicalExpression(self, ctx:RegelSpraakParser.LogicalExpressionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#logicalExpression.
    def exitLogicalExpression(self, ctx:RegelSpraakParser.LogicalExpressionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#IsKenmerkExpr.
    def enterIsKenmerkExpr(self, ctx:RegelSpraakParser.IsKenmerkExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#IsKenmerkExpr.
    def exitIsKenmerkExpr(self, ctx:RegelSpraakParser.IsKenmerkExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#HeeftKenmerkExpr.
    def enterHeeftKenmerkExpr(self, ctx:RegelSpraakParser.HeeftKenmerkExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#HeeftKenmerkExpr.
    def exitHeeftKenmerkExpr(self, ctx:RegelSpraakParser.HeeftKenmerkExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#BinaryComparisonExpr.
    def enterBinaryComparisonExpr(self, ctx:RegelSpraakParser.BinaryComparisonExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#BinaryComparisonExpr.
    def exitBinaryComparisonExpr(self, ctx:RegelSpraakParser.BinaryComparisonExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#UnaryConditionExpr.
    def enterUnaryConditionExpr(self, ctx:RegelSpraakParser.UnaryConditionExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#UnaryConditionExpr.
    def exitUnaryConditionExpr(self, ctx:RegelSpraakParser.UnaryConditionExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#RegelStatusConditionExpr.
    def enterRegelStatusConditionExpr(self, ctx:RegelSpraakParser.RegelStatusConditionExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#RegelStatusConditionExpr.
    def exitRegelStatusConditionExpr(self, ctx:RegelSpraakParser.RegelStatusConditionExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#comparisonOperator.
    def enterComparisonOperator(self, ctx:RegelSpraakParser.ComparisonOperatorContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#comparisonOperator.
    def exitComparisonOperator(self, ctx:RegelSpraakParser.ComparisonOperatorContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#additiveExpression.
    def enterAdditiveExpression(self, ctx:RegelSpraakParser.AdditiveExpressionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#additiveExpression.
    def exitAdditiveExpression(self, ctx:RegelSpraakParser.AdditiveExpressionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#additiveOperator.
    def enterAdditiveOperator(self, ctx:RegelSpraakParser.AdditiveOperatorContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#additiveOperator.
    def exitAdditiveOperator(self, ctx:RegelSpraakParser.AdditiveOperatorContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#multiplicativeExpression.
    def enterMultiplicativeExpression(self, ctx:RegelSpraakParser.MultiplicativeExpressionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#multiplicativeExpression.
    def exitMultiplicativeExpression(self, ctx:RegelSpraakParser.MultiplicativeExpressionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#multiplicativeOperator.
    def enterMultiplicativeOperator(self, ctx:RegelSpraakParser.MultiplicativeOperatorContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#multiplicativeOperator.
    def exitMultiplicativeOperator(self, ctx:RegelSpraakParser.MultiplicativeOperatorContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#powerExpression.
    def enterPowerExpression(self, ctx:RegelSpraakParser.PowerExpressionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#powerExpression.
    def exitPowerExpression(self, ctx:RegelSpraakParser.PowerExpressionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#powerOperator.
    def enterPowerOperator(self, ctx:RegelSpraakParser.PowerOperatorContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#powerOperator.
    def exitPowerOperator(self, ctx:RegelSpraakParser.PowerOperatorContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#WortelFuncExpr.
    def enterWortelFuncExpr(self, ctx:RegelSpraakParser.WortelFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#WortelFuncExpr.
    def exitWortelFuncExpr(self, ctx:RegelSpraakParser.WortelFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#BooleanTrueLiteralExpr.
    def enterBooleanTrueLiteralExpr(self, ctx:RegelSpraakParser.BooleanTrueLiteralExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#BooleanTrueLiteralExpr.
    def exitBooleanTrueLiteralExpr(self, ctx:RegelSpraakParser.BooleanTrueLiteralExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#DatumMetFuncExpr.
    def enterDatumMetFuncExpr(self, ctx:RegelSpraakParser.DatumMetFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#DatumMetFuncExpr.
    def exitDatumMetFuncExpr(self, ctx:RegelSpraakParser.DatumMetFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#StringLiteralExpr.
    def enterStringLiteralExpr(self, ctx:RegelSpraakParser.StringLiteralExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#StringLiteralExpr.
    def exitStringLiteralExpr(self, ctx:RegelSpraakParser.StringLiteralExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#AbsValFuncExpr.
    def enterAbsValFuncExpr(self, ctx:RegelSpraakParser.AbsValFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#AbsValFuncExpr.
    def exitAbsValFuncExpr(self, ctx:RegelSpraakParser.AbsValFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#MaxValFuncExpr.
    def enterMaxValFuncExpr(self, ctx:RegelSpraakParser.MaxValFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#MaxValFuncExpr.
    def exitMaxValFuncExpr(self, ctx:RegelSpraakParser.MaxValFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#RekendatumKeywordExpr.
    def enterRekendatumKeywordExpr(self, ctx:RegelSpraakParser.RekendatumKeywordExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#RekendatumKeywordExpr.
    def exitRekendatumKeywordExpr(self, ctx:RegelSpraakParser.RekendatumKeywordExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#PercentageFuncExpr.
    def enterPercentageFuncExpr(self, ctx:RegelSpraakParser.PercentageFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#PercentageFuncExpr.
    def exitPercentageFuncExpr(self, ctx:RegelSpraakParser.PercentageFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#EersteDatumFuncExpr.
    def enterEersteDatumFuncExpr(self, ctx:RegelSpraakParser.EersteDatumFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#EersteDatumFuncExpr.
    def exitEersteDatumFuncExpr(self, ctx:RegelSpraakParser.EersteDatumFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#PasenFuncExpr.
    def enterPasenFuncExpr(self, ctx:RegelSpraakParser.PasenFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#PasenFuncExpr.
    def exitPasenFuncExpr(self, ctx:RegelSpraakParser.PasenFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#EnumLiteralExpr.
    def enterEnumLiteralExpr(self, ctx:RegelSpraakParser.EnumLiteralExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#EnumLiteralExpr.
    def exitEnumLiteralExpr(self, ctx:RegelSpraakParser.EnumLiteralExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#NumberLiteralExpr.
    def enterNumberLiteralExpr(self, ctx:RegelSpraakParser.NumberLiteralExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#NumberLiteralExpr.
    def exitNumberLiteralExpr(self, ctx:RegelSpraakParser.NumberLiteralExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#AbsTijdsduurFuncExpr.
    def enterAbsTijdsduurFuncExpr(self, ctx:RegelSpraakParser.AbsTijdsduurFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#AbsTijdsduurFuncExpr.
    def exitAbsTijdsduurFuncExpr(self, ctx:RegelSpraakParser.AbsTijdsduurFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#MaandUitFuncExpr.
    def enterMaandUitFuncExpr(self, ctx:RegelSpraakParser.MaandUitFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#MaandUitFuncExpr.
    def exitMaandUitFuncExpr(self, ctx:RegelSpraakParser.MaandUitFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#CapitalizedTotaalVanExpr.
    def enterCapitalizedTotaalVanExpr(self, ctx:RegelSpraakParser.CapitalizedTotaalVanExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#CapitalizedTotaalVanExpr.
    def exitCapitalizedTotaalVanExpr(self, ctx:RegelSpraakParser.CapitalizedTotaalVanExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#IdentifierExpr.
    def enterIdentifierExpr(self, ctx:RegelSpraakParser.IdentifierExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#IdentifierExpr.
    def exitIdentifierExpr(self, ctx:RegelSpraakParser.IdentifierExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#DatumLiteralExpr.
    def enterDatumLiteralExpr(self, ctx:RegelSpraakParser.DatumLiteralExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#DatumLiteralExpr.
    def exitDatumLiteralExpr(self, ctx:RegelSpraakParser.DatumLiteralExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#DimensieAggExpr.
    def enterDimensieAggExpr(self, ctx:RegelSpraakParser.DimensieAggExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#DimensieAggExpr.
    def exitDimensieAggExpr(self, ctx:RegelSpraakParser.DimensieAggExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#TijdsduurFuncExpr.
    def enterTijdsduurFuncExpr(self, ctx:RegelSpraakParser.TijdsduurFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#TijdsduurFuncExpr.
    def exitTijdsduurFuncExpr(self, ctx:RegelSpraakParser.TijdsduurFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#AantalFuncExpr.
    def enterAantalFuncExpr(self, ctx:RegelSpraakParser.AantalFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#AantalFuncExpr.
    def exitAantalFuncExpr(self, ctx:RegelSpraakParser.AantalFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#UnaryNietExpr.
    def enterUnaryNietExpr(self, ctx:RegelSpraakParser.UnaryNietExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#UnaryNietExpr.
    def exitUnaryNietExpr(self, ctx:RegelSpraakParser.UnaryNietExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#ConcatenatieExpr.
    def enterConcatenatieExpr(self, ctx:RegelSpraakParser.ConcatenatieExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#ConcatenatieExpr.
    def exitConcatenatieExpr(self, ctx:RegelSpraakParser.ConcatenatieExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#OnderwerpRefExpr.
    def enterOnderwerpRefExpr(self, ctx:RegelSpraakParser.OnderwerpRefExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#OnderwerpRefExpr.
    def exitOnderwerpRefExpr(self, ctx:RegelSpraakParser.OnderwerpRefExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#SomFuncExpr.
    def enterSomFuncExpr(self, ctx:RegelSpraakParser.SomFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#SomFuncExpr.
    def exitSomFuncExpr(self, ctx:RegelSpraakParser.SomFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#AttrRefExpr.
    def enterAttrRefExpr(self, ctx:RegelSpraakParser.AttrRefExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#AttrRefExpr.
    def exitAttrRefExpr(self, ctx:RegelSpraakParser.AttrRefExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#DagUitFuncExpr.
    def enterDagUitFuncExpr(self, ctx:RegelSpraakParser.DagUitFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#DagUitFuncExpr.
    def exitDagUitFuncExpr(self, ctx:RegelSpraakParser.DagUitFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#SimpleConcatenatieExpr.
    def enterSimpleConcatenatieExpr(self, ctx:RegelSpraakParser.SimpleConcatenatieExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#SimpleConcatenatieExpr.
    def exitSimpleConcatenatieExpr(self, ctx:RegelSpraakParser.SimpleConcatenatieExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#BegrenzingExpr.
    def enterBegrenzingExpr(self, ctx:RegelSpraakParser.BegrenzingExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#BegrenzingExpr.
    def exitBegrenzingExpr(self, ctx:RegelSpraakParser.BegrenzingExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#NaamwoordExpr.
    def enterNaamwoordExpr(self, ctx:RegelSpraakParser.NaamwoordExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#NaamwoordExpr.
    def exitNaamwoordExpr(self, ctx:RegelSpraakParser.NaamwoordExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#BooleanFalseLiteralExpr.
    def enterBooleanFalseLiteralExpr(self, ctx:RegelSpraakParser.BooleanFalseLiteralExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#BooleanFalseLiteralExpr.
    def exitBooleanFalseLiteralExpr(self, ctx:RegelSpraakParser.BooleanFalseLiteralExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#MinValFuncExpr.
    def enterMinValFuncExpr(self, ctx:RegelSpraakParser.MinValFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#MinValFuncExpr.
    def exitMinValFuncExpr(self, ctx:RegelSpraakParser.MinValFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#JaarUitFuncExpr.
    def enterJaarUitFuncExpr(self, ctx:RegelSpraakParser.JaarUitFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#JaarUitFuncExpr.
    def exitJaarUitFuncExpr(self, ctx:RegelSpraakParser.JaarUitFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#BezieldeRefExpr.
    def enterBezieldeRefExpr(self, ctx:RegelSpraakParser.BezieldeRefExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#BezieldeRefExpr.
    def exitBezieldeRefExpr(self, ctx:RegelSpraakParser.BezieldeRefExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#DateCalcExpr.
    def enterDateCalcExpr(self, ctx:RegelSpraakParser.DateCalcExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#DateCalcExpr.
    def exitDateCalcExpr(self, ctx:RegelSpraakParser.DateCalcExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#TotaalVanExpr.
    def enterTotaalVanExpr(self, ctx:RegelSpraakParser.TotaalVanExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#TotaalVanExpr.
    def exitTotaalVanExpr(self, ctx:RegelSpraakParser.TotaalVanExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#AfrondingExpr.
    def enterAfrondingExpr(self, ctx:RegelSpraakParser.AfrondingExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#AfrondingExpr.
    def exitAfrondingExpr(self, ctx:RegelSpraakParser.AfrondingExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#LaatsteDatumFuncExpr.
    def enterLaatsteDatumFuncExpr(self, ctx:RegelSpraakParser.LaatsteDatumFuncExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#LaatsteDatumFuncExpr.
    def exitLaatsteDatumFuncExpr(self, ctx:RegelSpraakParser.LaatsteDatumFuncExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#HetAantalDagenInExpr.
    def enterHetAantalDagenInExpr(self, ctx:RegelSpraakParser.HetAantalDagenInExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#HetAantalDagenInExpr.
    def exitHetAantalDagenInExpr(self, ctx:RegelSpraakParser.HetAantalDagenInExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#TijdsevenredigDeelExpr.
    def enterTijdsevenredigDeelExpr(self, ctx:RegelSpraakParser.TijdsevenredigDeelExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#TijdsevenredigDeelExpr.
    def exitTijdsevenredigDeelExpr(self, ctx:RegelSpraakParser.TijdsevenredigDeelExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#CapitalizedTijdsevenredigDeelExpr.
    def enterCapitalizedTijdsevenredigDeelExpr(self, ctx:RegelSpraakParser.CapitalizedTijdsevenredigDeelExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#CapitalizedTijdsevenredigDeelExpr.
    def exitCapitalizedTijdsevenredigDeelExpr(self, ctx:RegelSpraakParser.CapitalizedTijdsevenredigDeelExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#ParenExpr.
    def enterParenExpr(self, ctx:RegelSpraakParser.ParenExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#ParenExpr.
    def exitParenExpr(self, ctx:RegelSpraakParser.ParenExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#UnaryMinusExpr.
    def enterUnaryMinusExpr(self, ctx:RegelSpraakParser.UnaryMinusExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#UnaryMinusExpr.
    def exitUnaryMinusExpr(self, ctx:RegelSpraakParser.UnaryMinusExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#ParamRefExpr.
    def enterParamRefExpr(self, ctx:RegelSpraakParser.ParamRefExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#ParamRefExpr.
    def exitParamRefExpr(self, ctx:RegelSpraakParser.ParamRefExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#PronounExpr.
    def enterPronounExpr(self, ctx:RegelSpraakParser.PronounExprContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#PronounExpr.
    def exitPronounExpr(self, ctx:RegelSpraakParser.PronounExprContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#afronding.
    def enterAfronding(self, ctx:RegelSpraakParser.AfrondingContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#afronding.
    def exitAfronding(self, ctx:RegelSpraakParser.AfrondingContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#begrenzing.
    def enterBegrenzing(self, ctx:RegelSpraakParser.BegrenzingContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#begrenzing.
    def exitBegrenzing(self, ctx:RegelSpraakParser.BegrenzingContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#begrenzingMinimum.
    def enterBegrenzingMinimum(self, ctx:RegelSpraakParser.BegrenzingMinimumContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#begrenzingMinimum.
    def exitBegrenzingMinimum(self, ctx:RegelSpraakParser.BegrenzingMinimumContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#begrenzingMaximum.
    def enterBegrenzingMaximum(self, ctx:RegelSpraakParser.BegrenzingMaximumContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#begrenzingMaximum.
    def exitBegrenzingMaximum(self, ctx:RegelSpraakParser.BegrenzingMaximumContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#conditieBijExpressie.
    def enterConditieBijExpressie(self, ctx:RegelSpraakParser.ConditieBijExpressieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#conditieBijExpressie.
    def exitConditieBijExpressie(self, ctx:RegelSpraakParser.ConditieBijExpressieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#periodevergelijkingEnkelvoudig.
    def enterPeriodevergelijkingEnkelvoudig(self, ctx:RegelSpraakParser.PeriodevergelijkingEnkelvoudigContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#periodevergelijkingEnkelvoudig.
    def exitPeriodevergelijkingEnkelvoudig(self, ctx:RegelSpraakParser.PeriodevergelijkingEnkelvoudigContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#getalAggregatieFunctie.
    def enterGetalAggregatieFunctie(self, ctx:RegelSpraakParser.GetalAggregatieFunctieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#getalAggregatieFunctie.
    def exitGetalAggregatieFunctie(self, ctx:RegelSpraakParser.GetalAggregatieFunctieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#datumAggregatieFunctie.
    def enterDatumAggregatieFunctie(self, ctx:RegelSpraakParser.DatumAggregatieFunctieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#datumAggregatieFunctie.
    def exitDatumAggregatieFunctie(self, ctx:RegelSpraakParser.DatumAggregatieFunctieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#dimensieSelectie.
    def enterDimensieSelectie(self, ctx:RegelSpraakParser.DimensieSelectieContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#dimensieSelectie.
    def exitDimensieSelectie(self, ctx:RegelSpraakParser.DimensieSelectieContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#aggregerenOverAlleDimensies.
    def enterAggregerenOverAlleDimensies(self, ctx:RegelSpraakParser.AggregerenOverAlleDimensiesContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#aggregerenOverAlleDimensies.
    def exitAggregerenOverAlleDimensies(self, ctx:RegelSpraakParser.AggregerenOverAlleDimensiesContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#aggregerenOverVerzameling.
    def enterAggregerenOverVerzameling(self, ctx:RegelSpraakParser.AggregerenOverVerzamelingContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#aggregerenOverVerzameling.
    def exitAggregerenOverVerzameling(self, ctx:RegelSpraakParser.AggregerenOverVerzamelingContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#aggregerenOverBereik.
    def enterAggregerenOverBereik(self, ctx:RegelSpraakParser.AggregerenOverBereikContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#aggregerenOverBereik.
    def exitAggregerenOverBereik(self, ctx:RegelSpraakParser.AggregerenOverBereikContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#unaryCheckCondition.
    def enterUnaryCheckCondition(self, ctx:RegelSpraakParser.UnaryCheckConditionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#unaryCheckCondition.
    def exitUnaryCheckCondition(self, ctx:RegelSpraakParser.UnaryCheckConditionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#unaryNumeriekExactCondition.
    def enterUnaryNumeriekExactCondition(self, ctx:RegelSpraakParser.UnaryNumeriekExactConditionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#unaryNumeriekExactCondition.
    def exitUnaryNumeriekExactCondition(self, ctx:RegelSpraakParser.UnaryNumeriekExactConditionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#unaryDagsoortCondition.
    def enterUnaryDagsoortCondition(self, ctx:RegelSpraakParser.UnaryDagsoortConditionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#unaryDagsoortCondition.
    def exitUnaryDagsoortCondition(self, ctx:RegelSpraakParser.UnaryDagsoortConditionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#unaryKenmerkCondition.
    def enterUnaryKenmerkCondition(self, ctx:RegelSpraakParser.UnaryKenmerkConditionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#unaryKenmerkCondition.
    def exitUnaryKenmerkCondition(self, ctx:RegelSpraakParser.UnaryKenmerkConditionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#unaryRolCondition.
    def enterUnaryRolCondition(self, ctx:RegelSpraakParser.UnaryRolConditionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#unaryRolCondition.
    def exitUnaryRolCondition(self, ctx:RegelSpraakParser.UnaryRolConditionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#unaryUniekCondition.
    def enterUnaryUniekCondition(self, ctx:RegelSpraakParser.UnaryUniekConditionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#unaryUniekCondition.
    def exitUnaryUniekCondition(self, ctx:RegelSpraakParser.UnaryUniekConditionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#unaryInconsistentDataCondition.
    def enterUnaryInconsistentDataCondition(self, ctx:RegelSpraakParser.UnaryInconsistentDataConditionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#unaryInconsistentDataCondition.
    def exitUnaryInconsistentDataCondition(self, ctx:RegelSpraakParser.UnaryInconsistentDataConditionContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#regelStatusCheck.
    def enterRegelStatusCheck(self, ctx:RegelSpraakParser.RegelStatusCheckContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#regelStatusCheck.
    def exitRegelStatusCheck(self, ctx:RegelSpraakParser.RegelStatusCheckContext):
        pass


    # Enter a parse tree produced by RegelSpraakParser#dagsoortDefinition.
    def enterDagsoortDefinition(self, ctx:RegelSpraakParser.DagsoortDefinitionContext):
        pass

    # Exit a parse tree produced by RegelSpraakParser#dagsoortDefinition.
    def exitDagsoortDefinition(self, ctx:RegelSpraakParser.DagsoortDefinitionContext):
        pass



del RegelSpraakParser