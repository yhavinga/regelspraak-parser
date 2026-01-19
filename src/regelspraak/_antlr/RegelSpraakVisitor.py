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


    # Visit a parse tree produced by RegelSpraakParser#beslistabelTable.
    def visitBeslistabelTable(self, ctx:RegelSpraakParser.BeslistabelTableContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#beslistabelHeader.
    def visitBeslistabelHeader(self, ctx:RegelSpraakParser.BeslistabelHeaderContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#beslistabelSeparator.
    def visitBeslistabelSeparator(self, ctx:RegelSpraakParser.BeslistabelSeparatorContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#beslistabelRow.
    def visitBeslistabelRow(self, ctx:RegelSpraakParser.BeslistabelRowContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#beslistabelCellValue.
    def visitBeslistabelCellValue(self, ctx:RegelSpraakParser.BeslistabelCellValueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#beslistabelColumnText.
    def visitBeslistabelColumnText(self, ctx:RegelSpraakParser.BeslistabelColumnTextContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#identifier.
    def visitIdentifier(self, ctx:RegelSpraakParser.IdentifierContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#identifierOrKeyword.
    def visitIdentifierOrKeyword(self, ctx:RegelSpraakParser.IdentifierOrKeywordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#identifierOrKeywordNoIs.
    def visitIdentifierOrKeywordNoIs(self, ctx:RegelSpraakParser.IdentifierOrKeywordNoIsContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#naamPhrase.
    def visitNaamPhrase(self, ctx:RegelSpraakParser.NaamPhraseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#naamPhraseWithNumbers.
    def visitNaamPhraseWithNumbers(self, ctx:RegelSpraakParser.NaamPhraseWithNumbersContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#identifierOrKeywordWithNumbers.
    def visitIdentifierOrKeywordWithNumbers(self, ctx:RegelSpraakParser.IdentifierOrKeywordWithNumbersContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#naamPhraseNoIs.
    def visitNaamPhraseNoIs(self, ctx:RegelSpraakParser.NaamPhraseNoIsContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#naamwoord.
    def visitNaamwoord(self, ctx:RegelSpraakParser.NaamwoordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#naamwoordWithNumbers.
    def visitNaamwoordWithNumbers(self, ctx:RegelSpraakParser.NaamwoordWithNumbersContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#naamwoordNoIs.
    def visitNaamwoordNoIs(self, ctx:RegelSpraakParser.NaamwoordNoIsContext):
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


    # Visit a parse tree produced by RegelSpraakParser#timeUnit.
    def visitTimeUnit(self, ctx:RegelSpraakParser.TimeUnitContext):
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


    # Visit a parse tree produced by RegelSpraakParser#lijstDatatype.
    def visitLijstDatatype(self, ctx:RegelSpraakParser.LijstDatatypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#numeriekDatatype.
    def visitNumeriekDatatype(self, ctx:RegelSpraakParser.NumeriekDatatypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#tekstDatatype.
    def visitTekstDatatype(self, ctx:RegelSpraakParser.TekstDatatypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#percentageDatatype.
    def visitPercentageDatatype(self, ctx:RegelSpraakParser.PercentageDatatypeContext):
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


    # Visit a parse tree produced by RegelSpraakParser#objectTypeRef.
    def visitObjectTypeRef(self, ctx:RegelSpraakParser.ObjectTypeRefContext):
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


    # Visit a parse tree produced by RegelSpraakParser#parameterNamePart.
    def visitParameterNamePart(self, ctx:RegelSpraakParser.ParameterNamePartContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#parameterMetLidwoord.
    def visitParameterMetLidwoord(self, ctx:RegelSpraakParser.ParameterMetLidwoordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#feitTypeDefinition.
    def visitFeitTypeDefinition(self, ctx:RegelSpraakParser.FeitTypeDefinitionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#rolDefinition.
    def visitRolDefinition(self, ctx:RegelSpraakParser.RolDefinitionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#rolObjectType.
    def visitRolObjectType(self, ctx:RegelSpraakParser.RolObjectTypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#rolContentWords.
    def visitRolContentWords(self, ctx:RegelSpraakParser.RolContentWordsContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#cardinalityLine.
    def visitCardinalityLine(self, ctx:RegelSpraakParser.CardinalityLineContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#cardinalityWord.
    def visitCardinalityWord(self, ctx:RegelSpraakParser.CardinalityWordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#regel.
    def visitRegel(self, ctx:RegelSpraakParser.RegelContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#regelGroep.
    def visitRegelGroep(self, ctx:RegelSpraakParser.RegelGroepContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#regelName.
    def visitRegelName(self, ctx:RegelSpraakParser.RegelNameContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#regelNameExtension.
    def visitRegelNameExtension(self, ctx:RegelSpraakParser.RegelNameExtensionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#regelVersie.
    def visitRegelVersie(self, ctx:RegelSpraakParser.RegelVersieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#versieGeldigheid.
    def visitVersieGeldigheid(self, ctx:RegelSpraakParser.VersieGeldigheidContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DagsoortdefinitieResultaat.
    def visitDagsoortdefinitieResultaat(self, ctx:RegelSpraakParser.DagsoortdefinitieResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#GelijkstellingResultaat.
    def visitGelijkstellingResultaat(self, ctx:RegelSpraakParser.GelijkstellingResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#ConsistencyCheckResultaat.
    def visitConsistencyCheckResultaat(self, ctx:RegelSpraakParser.ConsistencyCheckResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#FeitCreatieResultaat.
    def visitFeitCreatieResultaat(self, ctx:RegelSpraakParser.FeitCreatieResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#KenmerkFeitResultaat.
    def visitKenmerkFeitResultaat(self, ctx:RegelSpraakParser.KenmerkFeitResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#RelationshipWithAttributeResultaat.
    def visitRelationshipWithAttributeResultaat(self, ctx:RegelSpraakParser.RelationshipWithAttributeResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#ObjectCreatieResultaat.
    def visitObjectCreatieResultaat(self, ctx:RegelSpraakParser.ObjectCreatieResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#Verdeling.
    def visitVerdeling(self, ctx:RegelSpraakParser.VerdelingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#consistencyOperator.
    def visitConsistencyOperator(self, ctx:RegelSpraakParser.ConsistencyOperatorContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#feitCreatiePattern.
    def visitFeitCreatiePattern(self, ctx:RegelSpraakParser.FeitCreatiePatternContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#feitCreatieRolPhrase.
    def visitFeitCreatieRolPhrase(self, ctx:RegelSpraakParser.FeitCreatieRolPhraseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#feitCreatieSubjectPhrase.
    def visitFeitCreatieSubjectPhrase(self, ctx:RegelSpraakParser.FeitCreatieSubjectPhraseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#feitCreatieSubjectWord.
    def visitFeitCreatieSubjectWord(self, ctx:RegelSpraakParser.FeitCreatieSubjectWordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#feitCreatieWord.
    def visitFeitCreatieWord(self, ctx:RegelSpraakParser.FeitCreatieWordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#voorzetselNietVan.
    def visitVoorzetselNietVan(self, ctx:RegelSpraakParser.VoorzetselNietVanContext):
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


    # Visit a parse tree produced by RegelSpraakParser#simpleNaamwoord.
    def visitSimpleNaamwoord(self, ctx:RegelSpraakParser.SimpleNaamwoordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#consistentieregel.
    def visitConsistentieregel(self, ctx:RegelSpraakParser.ConsistentieregelContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#uniekzijnResultaat.
    def visitUniekzijnResultaat(self, ctx:RegelSpraakParser.UniekzijnResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#alleAttributenVanObjecttype.
    def visitAlleAttributenVanObjecttype(self, ctx:RegelSpraakParser.AlleAttributenVanObjecttypeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#inconsistentResultaat.
    def visitInconsistentResultaat(self, ctx:RegelSpraakParser.InconsistentResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#voorwaardeDeel.
    def visitVoorwaardeDeel(self, ctx:RegelSpraakParser.VoorwaardeDeelContext):
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


    # Visit a parse tree produced by RegelSpraakParser#bulletPrefix.
    def visitBulletPrefix(self, ctx:RegelSpraakParser.BulletPrefixContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#elementaireVoorwaarde.
    def visitElementaireVoorwaarde(self, ctx:RegelSpraakParser.ElementaireVoorwaardeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#genesteSamengesteldeVoorwaarde.
    def visitGenesteSamengesteldeVoorwaarde(self, ctx:RegelSpraakParser.GenesteSamengesteldeVoorwaardeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#onderwerpReferentie.
    def visitOnderwerpReferentie(self, ctx:RegelSpraakParser.OnderwerpReferentieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#onderwerpReferentieWithNumbers.
    def visitOnderwerpReferentieWithNumbers(self, ctx:RegelSpraakParser.OnderwerpReferentieWithNumbersContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#onderwerpBasis.
    def visitOnderwerpBasis(self, ctx:RegelSpraakParser.OnderwerpBasisContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#onderwerpBasisWithNumbers.
    def visitOnderwerpBasisWithNumbers(self, ctx:RegelSpraakParser.OnderwerpBasisWithNumbersContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#basisOnderwerp.
    def visitBasisOnderwerp(self, ctx:RegelSpraakParser.BasisOnderwerpContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#basisOnderwerpWithNumbers.
    def visitBasisOnderwerpWithNumbers(self, ctx:RegelSpraakParser.BasisOnderwerpWithNumbersContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#attribuutReferentie.
    def visitAttribuutReferentie(self, ctx:RegelSpraakParser.AttribuutReferentieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#attribuutMetLidwoord.
    def visitAttribuutMetLidwoord(self, ctx:RegelSpraakParser.AttribuutMetLidwoordContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#kenmerkNaam.
    def visitKenmerkNaam(self, ctx:RegelSpraakParser.KenmerkNaamContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#kenmerkPhrase.
    def visitKenmerkPhrase(self, ctx:RegelSpraakParser.KenmerkPhraseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#bezieldeReferentie.
    def visitBezieldeReferentie(self, ctx:RegelSpraakParser.BezieldeReferentieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#predicaat.
    def visitPredicaat(self, ctx:RegelSpraakParser.PredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#elementairPredicaat.
    def visitElementairPredicaat(self, ctx:RegelSpraakParser.ElementairPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#objectPredicaat.
    def visitObjectPredicaat(self, ctx:RegelSpraakParser.ObjectPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#eenzijdigeObjectVergelijking.
    def visitEenzijdigeObjectVergelijking(self, ctx:RegelSpraakParser.EenzijdigeObjectVergelijkingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#rolNaam.
    def visitRolNaam(self, ctx:RegelSpraakParser.RolNaamContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#attribuutVergelijkingsPredicaat.
    def visitAttribuutVergelijkingsPredicaat(self, ctx:RegelSpraakParser.AttribuutVergelijkingsPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#getalPredicaat.
    def visitGetalPredicaat(self, ctx:RegelSpraakParser.GetalPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#tekstPredicaat.
    def visitTekstPredicaat(self, ctx:RegelSpraakParser.TekstPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#datumPredicaat.
    def visitDatumPredicaat(self, ctx:RegelSpraakParser.DatumPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#samengesteldPredicaat.
    def visitSamengesteldPredicaat(self, ctx:RegelSpraakParser.SamengesteldPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#samengesteldeVoorwaardeOnderdeelInPredicaat.
    def visitSamengesteldeVoorwaardeOnderdeelInPredicaat(self, ctx:RegelSpraakParser.SamengesteldeVoorwaardeOnderdeelInPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#elementaireVoorwaardeInPredicaat.
    def visitElementaireVoorwaardeInPredicaat(self, ctx:RegelSpraakParser.ElementaireVoorwaardeInPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#vergelijkingInPredicaat.
    def visitVergelijkingInPredicaat(self, ctx:RegelSpraakParser.VergelijkingInPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#genesteSamengesteldeVoorwaardeInPredicaat.
    def visitGenesteSamengesteldeVoorwaardeInPredicaat(self, ctx:RegelSpraakParser.GenesteSamengesteldeVoorwaardeInPredicaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#getalVergelijkingsOperatorMeervoud.
    def visitGetalVergelijkingsOperatorMeervoud(self, ctx:RegelSpraakParser.GetalVergelijkingsOperatorMeervoudContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#tekstVergelijkingsOperatorMeervoud.
    def visitTekstVergelijkingsOperatorMeervoud(self, ctx:RegelSpraakParser.TekstVergelijkingsOperatorMeervoudContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#datumVergelijkingsOperatorMeervoud.
    def visitDatumVergelijkingsOperatorMeervoud(self, ctx:RegelSpraakParser.DatumVergelijkingsOperatorMeervoudContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#getalExpressie.
    def visitGetalExpressie(self, ctx:RegelSpraakParser.GetalExpressieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#tekstExpressie.
    def visitTekstExpressie(self, ctx:RegelSpraakParser.TekstExpressieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#datumExpressie.
    def visitDatumExpressie(self, ctx:RegelSpraakParser.DatumExpressieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#variabeleDeel.
    def visitVariabeleDeel(self, ctx:RegelSpraakParser.VariabeleDeelContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#variabeleToekenning.
    def visitVariabeleToekenning(self, ctx:RegelSpraakParser.VariabeleToekenningContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#variabeleExpressie.
    def visitVariabeleExpressie(self, ctx:RegelSpraakParser.VariabeleExpressieContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#ExprBegrenzingAfronding.
    def visitExprBegrenzingAfronding(self, ctx:RegelSpraakParser.ExprBegrenzingAfrondingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#ExprBegrenzing.
    def visitExprBegrenzing(self, ctx:RegelSpraakParser.ExprBegrenzingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#ExprAfronding.
    def visitExprAfronding(self, ctx:RegelSpraakParser.ExprAfrondingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SimpleExpr.
    def visitSimpleExpr(self, ctx:RegelSpraakParser.SimpleExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SimpleExprBegrenzingAfronding.
    def visitSimpleExprBegrenzingAfronding(self, ctx:RegelSpraakParser.SimpleExprBegrenzingAfrondingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SimpleExprBegrenzing.
    def visitSimpleExprBegrenzing(self, ctx:RegelSpraakParser.SimpleExprBegrenzingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SimpleExprAfronding.
    def visitSimpleExprAfronding(self, ctx:RegelSpraakParser.SimpleExprAfrondingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SimpleExprBase.
    def visitSimpleExprBase(self, ctx:RegelSpraakParser.SimpleExprBaseContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#LogicalExpr.
    def visitLogicalExpr(self, ctx:RegelSpraakParser.LogicalExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SubordinateClauseExpr.
    def visitSubordinateClauseExpr(self, ctx:RegelSpraakParser.SubordinateClauseExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#PeriodeCheckExpr.
    def visitPeriodeCheckExpr(self, ctx:RegelSpraakParser.PeriodeCheckExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#IsKenmerkExpr.
    def visitIsKenmerkExpr(self, ctx:RegelSpraakParser.IsKenmerkExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#HeeftKenmerkExpr.
    def visitHeeftKenmerkExpr(self, ctx:RegelSpraakParser.HeeftKenmerkExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#GelijkIsAanOfExpr.
    def visitGelijkIsAanOfExpr(self, ctx:RegelSpraakParser.GelijkIsAanOfExprContext):
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


    # Visit a parse tree produced by RegelSpraakParser#literalValue.
    def visitLiteralValue(self, ctx:RegelSpraakParser.LiteralValueContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#gelijkIsAanOperator.
    def visitGelijkIsAanOperator(self, ctx:RegelSpraakParser.GelijkIsAanOperatorContext):
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


    # Visit a parse tree produced by RegelSpraakParser#AbsValFuncExpr.
    def visitAbsValFuncExpr(self, ctx:RegelSpraakParser.AbsValFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#MaxValFuncExpr.
    def visitMaxValFuncExpr(self, ctx:RegelSpraakParser.MaxValFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#RekendatumKeywordExpr.
    def visitRekendatumKeywordExpr(self, ctx:RegelSpraakParser.RekendatumKeywordExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#EnumLiteralExpr.
    def visitEnumLiteralExpr(self, ctx:RegelSpraakParser.EnumLiteralExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#NumberLiteralExpr.
    def visitNumberLiteralExpr(self, ctx:RegelSpraakParser.NumberLiteralExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DatumLiteralExpr.
    def visitDatumLiteralExpr(self, ctx:RegelSpraakParser.DatumLiteralExprContext):
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


    # Visit a parse tree produced by RegelSpraakParser#SomAlleAttribuutExpr.
    def visitSomAlleAttribuutExpr(self, ctx:RegelSpraakParser.SomAlleAttribuutExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#AttrRefExpr.
    def visitAttrRefExpr(self, ctx:RegelSpraakParser.AttrRefExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DagUitFuncExpr.
    def visitDagUitFuncExpr(self, ctx:RegelSpraakParser.DagUitFuncExprContext):
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


    # Visit a parse tree produced by RegelSpraakParser#JaarUitFuncExpr.
    def visitJaarUitFuncExpr(self, ctx:RegelSpraakParser.JaarUitFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#TotaalVanExpr.
    def visitTotaalVanExpr(self, ctx:RegelSpraakParser.TotaalVanExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#TijdsevenredigDeelExpr.
    def visitTijdsevenredigDeelExpr(self, ctx:RegelSpraakParser.TijdsevenredigDeelExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#CapitalizedTijdsevenredigDeelExpr.
    def visitCapitalizedTijdsevenredigDeelExpr(self, ctx:RegelSpraakParser.CapitalizedTijdsevenredigDeelExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#AantalAttribuutExpr.
    def visitAantalAttribuutExpr(self, ctx:RegelSpraakParser.AantalAttribuutExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#ParenExpr.
    def visitParenExpr(self, ctx:RegelSpraakParser.ParenExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DimensieRangeAggExpr.
    def visitDimensieRangeAggExpr(self, ctx:RegelSpraakParser.DimensieRangeAggExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DatumMetFuncExpr.
    def visitDatumMetFuncExpr(self, ctx:RegelSpraakParser.DatumMetFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#PercentageLiteralExpr.
    def visitPercentageLiteralExpr(self, ctx:RegelSpraakParser.PercentageLiteralExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#StringLiteralExpr.
    def visitStringLiteralExpr(self, ctx:RegelSpraakParser.StringLiteralExprContext):
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


    # Visit a parse tree produced by RegelSpraakParser#DimensieAggExpr.
    def visitDimensieAggExpr(self, ctx:RegelSpraakParser.DimensieAggExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#TijdsduurFuncExpr.
    def visitTijdsduurFuncExpr(self, ctx:RegelSpraakParser.TijdsduurFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#OnderwerpRefExpr.
    def visitOnderwerpRefExpr(self, ctx:RegelSpraakParser.OnderwerpRefExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SomFuncExpr.
    def visitSomFuncExpr(self, ctx:RegelSpraakParser.SomFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SomAlleExpr.
    def visitSomAlleExpr(self, ctx:RegelSpraakParser.SomAlleExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SimpleConcatenatieExpr.
    def visitSimpleConcatenatieExpr(self, ctx:RegelSpraakParser.SimpleConcatenatieExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#BegrenzingAfrondingExpr.
    def visitBegrenzingAfrondingExpr(self, ctx:RegelSpraakParser.BegrenzingAfrondingExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#PercentageOfExpr.
    def visitPercentageOfExpr(self, ctx:RegelSpraakParser.PercentageOfExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#MinValFuncExpr.
    def visitMinValFuncExpr(self, ctx:RegelSpraakParser.MinValFuncExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#MaxAlleAttribuutExpr.
    def visitMaxAlleAttribuutExpr(self, ctx:RegelSpraakParser.MaxAlleAttribuutExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#BezieldeRefExpr.
    def visitBezieldeRefExpr(self, ctx:RegelSpraakParser.BezieldeRefExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#DateCalcExpr.
    def visitDateCalcExpr(self, ctx:RegelSpraakParser.DateCalcExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#MinAlleAttribuutExpr.
    def visitMinAlleAttribuutExpr(self, ctx:RegelSpraakParser.MinAlleAttribuutExprContext):
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


    # Visit a parse tree produced by RegelSpraakParser#periodevergelijkingElementair.
    def visitPeriodevergelijkingElementair(self, ctx:RegelSpraakParser.PeriodevergelijkingElementairContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#periodevergelijkingEnkelvoudig.
    def visitPeriodevergelijkingEnkelvoudig(self, ctx:RegelSpraakParser.PeriodevergelijkingEnkelvoudigContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#VanafPeriode.
    def visitVanafPeriode(self, ctx:RegelSpraakParser.VanafPeriodeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#TotPeriode.
    def visitTotPeriode(self, ctx:RegelSpraakParser.TotPeriodeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#TotEnMetPeriode.
    def visitTotEnMetPeriode(self, ctx:RegelSpraakParser.TotEnMetPeriodeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#VanTotPeriode.
    def visitVanTotPeriode(self, ctx:RegelSpraakParser.VanTotPeriodeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#VanTotEnMetPeriode.
    def visitVanTotEnMetPeriode(self, ctx:RegelSpraakParser.VanTotEnMetPeriodeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#dateExpression.
    def visitDateExpression(self, ctx:RegelSpraakParser.DateExpressionContext):
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


    # Visit a parse tree produced by RegelSpraakParser#regelStatusGevuurdCheck.
    def visitRegelStatusGevuurdCheck(self, ctx:RegelSpraakParser.RegelStatusGevuurdCheckContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#regelStatusInconsistentCheck.
    def visitRegelStatusInconsistentCheck(self, ctx:RegelSpraakParser.RegelStatusInconsistentCheckContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SubordinateHasExpr.
    def visitSubordinateHasExpr(self, ctx:RegelSpraakParser.SubordinateHasExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SubordinateIsWithExpr.
    def visitSubordinateIsWithExpr(self, ctx:RegelSpraakParser.SubordinateIsWithExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#SubordinateIsKenmerkExpr.
    def visitSubordinateIsKenmerkExpr(self, ctx:RegelSpraakParser.SubordinateIsKenmerkExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#dagsoortDefinition.
    def visitDagsoortDefinition(self, ctx:RegelSpraakParser.DagsoortDefinitionContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#tekstreeksExpr.
    def visitTekstreeksExpr(self, ctx:RegelSpraakParser.TekstreeksExprContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#verdelingResultaat.
    def visitVerdelingResultaat(self, ctx:RegelSpraakParser.VerdelingResultaatContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#verdelingMethodeSimple.
    def visitVerdelingMethodeSimple(self, ctx:RegelSpraakParser.VerdelingMethodeSimpleContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#verdelingMethodeMultiLine.
    def visitVerdelingMethodeMultiLine(self, ctx:RegelSpraakParser.VerdelingMethodeMultiLineContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#verdelingMethodeBulletList.
    def visitVerdelingMethodeBulletList(self, ctx:RegelSpraakParser.VerdelingMethodeBulletListContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#verdelingMethodeBullet.
    def visitVerdelingMethodeBullet(self, ctx:RegelSpraakParser.VerdelingMethodeBulletContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#VerdelingGelijkeDelen.
    def visitVerdelingGelijkeDelen(self, ctx:RegelSpraakParser.VerdelingGelijkeDelenContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#VerdelingNaarRato.
    def visitVerdelingNaarRato(self, ctx:RegelSpraakParser.VerdelingNaarRatoContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#VerdelingOpVolgorde.
    def visitVerdelingOpVolgorde(self, ctx:RegelSpraakParser.VerdelingOpVolgordeContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#VerdelingTieBreak.
    def visitVerdelingTieBreak(self, ctx:RegelSpraakParser.VerdelingTieBreakContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#VerdelingMaximum.
    def visitVerdelingMaximum(self, ctx:RegelSpraakParser.VerdelingMaximumContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#VerdelingAfronding.
    def visitVerdelingAfronding(self, ctx:RegelSpraakParser.VerdelingAfrondingContext):
        return self.visitChildren(ctx)


    # Visit a parse tree produced by RegelSpraakParser#verdelingRest.
    def visitVerdelingRest(self, ctx:RegelSpraakParser.VerdelingRestContext):
        return self.visitChildren(ctx)



del RegelSpraakParser