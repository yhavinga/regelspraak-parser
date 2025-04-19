// === RegelSpraakParser.g4 ===
parser grammar RegelSpraakParser;

options {
    tokenVocab=RegelSpraakLexer;
    // contextSuperClass=LineNumberedParserRuleContext; // Use if custom class is defined and needed
}

@header {
package com.example.regelspraak.parser; // Adjust package name as needed

import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;

// Example definition if contextSuperClass is used
// class LineNumberedParserRuleContext extends ParserRuleContext {
//     public LineNumberedParserRuleContext(ParserRuleContext parent, int invokingStateNumber) {
//         super(parent, invokingStateNumber);
//     }
//     public int getLine() { return start.getLine(); }
//     public int getCharPositionInLine() { return start.getCharPositionInLine(); }
// }
}

@members {
@Override
public void notifyErrorListeners(Token offendingToken, String msg, RecognitionException e) {
    String errorMsg = "line " + offendingToken.getLine() + ":" + offendingToken.getCharPositionInLine() + " " + msg;
    super.notifyErrorListeners(offendingToken, errorMsg, e);
}
}

// === Start Rule ===
document
    : ( topLevelDefinition )* EOF
    ;

topLevelDefinition
    : objectTypeDefinition
    | domeinDefinition
    | eenheidsSysteem
    | dimDefinition
    | parameterDefinition
    | feitTypeDefinition
    | dagsoortDefinition
    | regel
    | beslistabel
    ;

// === Basic Naming and Types ===
naamwoord
    : (DE | HET)? naam (LPAREN MV COLON meervoudsvorm RPAREN)?
    ;

naam
    : IDENTIFIER (IDENTIFIER | NUM_INT)*
    ;

meervoudsvorm
    : IDENTIFIER (IDENTIFIER | NUM_INT)*
    ;

bepaaldLidwoord: DE | HET;

onbepaaldLidwoord: EEN;

lidwoord: bepaaldLidwoord | onbepaaldLidwoord;

karakterreeks: naam;

// === Object Model Definitions ===
objectTypeDefinition
    : OBJECTTYPE naamwoord (LPAREN BEZIELD RPAREN)? (SEMI | NEWLINE)
      ( koptekst | kenmerkDefinitie | attribuutDefinitie )*
    ;

koptekst
    : MINUS MINUS MINUS karakterreeks (MINUS MINUS MINUS)? (SEMI | NEWLINE)
    ;

kenmerkDefinitie
    : ( (naamwoord KENMERK)
      | (naamwoord KENMERK LPAREN BEZITTELIJK RPAREN)
      | (IS naam (LPAREN MV COLON meervoudsvorm RPAREN)? KENMERK LPAREN BIJVOEGLIJK RPAREN)
      )
      (tijdlijn)? SEMI
    ;

attribuutDefinitie
    : naamwoord (datatype | domeinnaam) (GEDIMENSIONEERD MET dimensieNaam (EN dimensieNaam)*)? (tijdlijn)? SEMI
    ;

attribuutMetLidwoord
    : (bepaaldLidwoord)? attribuutNaam
    ;

attribuutNaam: naam;
kenmerkNaam: naam;

datatype
    : numeriekDatatype
    | percentageDatatype
    | tekstDatatype
    | booleanDatatype
    | datumtijdDatatype
    ;

numeriekDatatype
    : NUMERIEK LPAREN getalSpecificatie RPAREN (MET EENHEID eenheidSpecificatie)?
    ;

percentageDatatype
    : PERCENTAGE LPAREN getalSpecificatie RPAREN (MET EENHEID PERCENT_SIGN (SLASH eenheidsAfkorting)?)?
    ;

tekstDatatype: TEKST;

booleanDatatype: BOOLEAN;

datumtijdDatatype
    : DATUM IN DAGEN
    | DATUM EN TIJD IN MILLISECONDES
    ;

getalSpecificatie
    : (NEGATIEF | NIET_NEGATIEF | POSITIEF)?
      (GEHEEL GETAL | GETAL MET aantalDecimalen DECIMALEN | GETAL)
    ;

aantalDecimalen: NUM_INT;

eenheidSpecificatie
    : ( (eenheidMacht)+ | NUM_INT ) (SLASH (eenheidMacht)+ )? // NUM_INT allows '1' as numerator
    ;

eenheidMacht
    : eenheidsAfkorting (CARET LPAREN exponent RPAREN)?
    ;

exponent: NUM_INT;

eenheidsAfkorting: IDENTIFIER | JR | KM | M | S | MINUUT | U | WK | MND | KW | MS | MM | CM | EUR | EURO_SIGN | DAG | MAAND | JAAR; // Extended list

domeinDefinition
    : DOMEIN domeinnaam IS VAN HET TYPE (datatype | enumeratieSpecificatie) (SEMI | NEWLINE)
    ;

domeinnaam: naam;

enumeratieSpecificatie
    : ENUMERATIE (SEMI | NEWLINE) ( enumeratiewaardeDef (SEMI | NEWLINE) )+
    ;
enumeratiewaardeDef
    : enumeratiewaarde
    ;

eenheidsSysteem
    : EENHEIDSYSTEEM eenheidsSysteemNaam (SEMI | NEWLINE)
      ( eenheidDefinitie (SEMI | NEWLINE) )+
    ;

eenheidsSysteemNaam: naam;

eenheidDefinitie
    : naamwoord eenheidsAfkorting (omrekenSpecificatie)?
    ;

omrekenSpecificatie
    : EQUALS (NUM_INT SLASH)? NUM_INT eenheidsAfkorting
    ;

tijdlijn
    : VOOR (ELKE DAG | ELKE MAAND | ELKE JAAR)
    ;

dimDefinition
    : DIMENSIE bepaaldLidwoord dimensieNaam COMMA BESTAANDE UIT DE dimensieNaamMeervoud voorzetselSpecificatie COLON (SEMI | NEWLINE)
      ( labelWaardeSpecificatie (SEMI | NEWLINE) )+
    ;

dimensieNaam: naam;
dimensieNaamMeervoud: naam;

voorzetselSpecificatie
    : LPAREN NA HET ATTRIBUUT MET VOORZETSEL (VAN | IN | VOOR | OVER | OP | BĲ | UIT) RPAREN
    | LPAREN VOOR HET ATTRIBUUT ZONDER VOORZETSEL RPAREN
    ;

labelWaardeSpecificatie
    : NUM_INT DOT dimensiewaarde
    ;

dimensiewaarde: karakterreeks;

parameterDefinition
    : PARAMETER parameterMetLidwoord COLON (datatype | domeinnaam) (tijdlijn)? SEMI
    ;

parameterMetLidwoord
    : bepaaldLidwoord parameterNaam
    ;

parameterNaam: naam;

feitTypeDefinition
    : (FEITTYPE | WEDERKERIG_FEITTYPE) feittypeNaam (SEMI | NEWLINE)
      rolDefinitie (SEMI | NEWLINE)
      (rolDefinitie (SEMI | NEWLINE))?
      relatieKardinaliteit (SEMI | NEWLINE)
    ;

feittypeNaam: naam;

rolDefinitie
    : (bepaaldLidwoord)? rolNaam (LPAREN MV COLON meervoudRolNaam RPAREN)? objecttypenaam
    ;

rolNaam: naam;
meervoudRolNaam: naam;
objecttypenaam: naam;

relatieKardinaliteit
    : (EEN rolNaam | MEERDERE meervoudRolNaam) relatieBeschrijving (EEN rolNaam | MEERDERE meervoudRolNaam)
    ;

relatieBeschrijving: karakterreeks; // Should capture multi-word relation phrases

dagsoortDefinition
    : DAGSOORT naamwoord (SEMI | NEWLINE)
    ;
dagsoortNaam: naam;

// === RegelSpraak Rules ===
regel
    : REGEL regelNaam (SEMI | NEWLINE)
      ( regelVersie )+
    ;

regelNaam: karakterreeks;

regelVersie
    : versie (SEMI | NEWLINE) regelSpraakRegel
    ;

versie
    : GELDIG versieGeldigheid
    ;

versieGeldigheid
    : ALTĲD
    | VANAF datumOfJaar (TM datumOfJaar)?
    | TM datumOfJaar
    ;

datumOfJaar: datumwaarde | jaar;

regelSpraakRegel
    : resultaatDeel
      (voorwaardenDeel)?
      PUNT
      (variabelenDeel)?
      (SEMI | NEWLINE)?
    ;

// Onderwerp Keten (Non-Left-Recursive)
onderwerpKeten
    : onderwerpKetenBasis ( onderwerpKetenSuffix )*
    ;

onderwerpKetenBasis
    : LPAREN onderwerpKeten RPAREN
    | (lidwoord | ZIJN) (objecttypenaam | rolNaam | kenmerkNaam)
    ;

onderwerpKetenSuffix
    : VAN selector
    | (DIE | DAT) predicaat
    ;

selector
    : (lidwoord)? rolNaam
    ;

attribuutVanOnderwerp
    : (kwantificatie)? attribuutMetLidwoord VAN onderwerpKeten
    ;

kwantificatie
    : ALLE
    | GEEN
    | TEN_MINSTE kwantificatieGetal (VAN DE)?
    | TEN_HOOGSTE kwantificatieGetal (VAN DE)?
    | PRECIES kwantificatieGetal (VAN DE)?
    ;
kwantificatieGetal: NUM_INT | EEN_KW | TWEE | DRIE | VIER;


variabelenDeel
    : DAARBĲ GELDT COLON (variabeleOnderdeel)+ PUNT
    ;

variabeleOnderdeel
    : (bepaaldLidwoord)? variabelenaam IS expressie (SEMI | NEWLINE)?
    ;

variabelenaam: naam;


// === Resultaat Deel (Action Part) ===
resultaatDeel
    : gelijkstelling
    | kenmerkToekenning
    | objectCreatie
    | feitCreatie
    | consistentieRegel
    | initialisatie
    | verdeling
    | dagsoortDefinitie
    ;

gelijkstelling
    : attribuutVanOnderwerp (MOET_GESTELD_WORDEN_OP expressie | MOET_BEREKEND_WORDEN_ALS (getalExpressie | datumExpressie))
    ;

kenmerkToekenning
    : onderwerpKeten (IS | HEEFT) (EEN)? kenmerkNaam
    ;

objectCreatie
    : EEN onderwerpKeten HEEFT EEN rolNaam (MET waardeToekenningList)?
    ;
waardeToekenningList
    : waardeToekenning (COMMA waardeToekenning)* (EN waardeToekenning)?
    ;
waardeToekenning
    : attribuutWaardeToekenning | kenmerkWaardeToekenning
    ;
attribuutWaardeToekenning
    : attribuutNaam GELIJK AAN expressie
    ;
kenmerkWaardeToekenning
    : kenmerkNaam GELIJK AAN booleanWaarde
    ;

feitCreatie
    : EEN rolNaam VAN EEN onderwerpKeten IS (EEN | DE | HET) rolNaam VAN (EEN | DE | HET) onderwerpKeten
    ;

consistentieRegel
    : (enkelvoudigeConsistentieRegel | toplevelSamengesteldCriterium | uniciteitsControle)
    ;

enkelvoudigeConsistentieRegel
    : ( getalConsistentie
      | datumConsistentie
      | tekstConsistentie
      | objectConsistentie
      )
    ;

getalConsistentie: getalExpressie MOET (toplevelEenzijdigeGetalVergelijkingsoperatorMeervoud | toplevelTweezijdigeGetalVergelijkingsoperatorMeervoud);
datumConsistentie: datumExpressie MOET (toplevelEenzijdigeDatumVergelijkingsoperatorMeervoud | toplevelTweezijdigeDatumVergelijkingsoperatorMeervoud);
tekstConsistentie: tekstExpressie MOET (toplevelEenzijdigeTekstVergelijkingsoperatorMeervoud | toplevelTweezijdigeTekstVergelijkingsoperatorMeervoud);
objectConsistentie: objectExpressie MOET (toplevelEenzijdigeObjectVergelijkingsoperatorMeervoud | toplevelTweezijdigeObjectVergelijkingsoperatorMeervoud);

toplevelSamengesteldCriterium
    : (ER MOET WORDEN VOLDAAN AAN | onderwerpKeten MOET VOLDOEN AAN)
      (HET VOLGENDE CRITERIUM COLON | consistentieKwantificatie VOLGENDE CRITERIA COLON)
      samengesteldCriteriumOnderdeel
    ;

samengesteldCriteriumOnderdeel
    : (NEWLINE? BULLET+ genestCriterium)+ // Allow optional newline before bullets
    ;

genestCriterium
    : voorwaardeVergelijking | samengesteldCriterium
    ;

samengesteldCriterium
    : (ER WORDT VOLDAAN AAN | onderwerpKeten VOLDOET AAN) // Assuming verb matches context
      (HET VOLGENDE CRITERIUM COLON | consistentieKwantificatie VOLGENDE CRITERIA COLON)
      samengesteldCriteriumOnderdeel
    ;

consistentieKwantificatie: kwantificatie;

uniciteitsControle
    : (alleAttribuutVanOnderwerp | uniciteitConcatenatie) (vereniging)* MOETEN_UNIEK_ZIJN
    ;

vereniging
    : VERENIGD MET (alleAttribuutVanOnderwerp | uniciteitConcatenatie)
    ;

alleAttribuutVanOnderwerp
    : attribuutMetLidwoord VAN ALLE onderwerpKeten
    ;

uniciteitConcatenatie
    : DE CONCATENATIE VAN attribuutNaam (COMMA attribuutNaam)* EN attribuutNaam VAN ALLE onderwerpKeten
    ;

initialisatie
    : attribuutVanOnderwerp MOET_GEINITIEERD_WORDEN_OP expressie
    ;

verdeling
    : attribuutVanOnderwerp WORDT VERDEELD OVER attribuutVanOnderwerp COMMA
      WAARBĲ WORDT VERDEELD (verdelenZonderGroepen | meervoudigCriteriumVerdeling)
    ;

verdelenZonderGroepen
    : IN GELIJKE DELEN
    | NAAR RATO VAN attribuutMetLidwoord
    ;

meervoudigCriteriumVerdeling
    : COLON (NEWLINE? verdelenOverGroepen | (NEWLINE? BULLET verdelenZonderGroepen COMMA)) // Assume bullet point start
          (NEWLINE? maximumAanspraak)?
          (NEWLINE? verdeelAfronding)?
          (NEWLINE? onverdeeldeRest)?
    ;

verdelenOverGroepen
    : BULLET OP VOLGORDE VAN (AFNEMENDE | TOENEMENDE) attribuutMetLidwoord (NEWLINE | COMMA)
      criteriumBijGelijkeVolgorde COMMA
    ;

criteriumBijGelijkeVolgorde
    : BULLET BĲ EVEN GROOT CRITERIUM (IN GELIJKE DELEN | (NAAR RATO VAN attribuutMetLidwoord))
    ;

maximumAanspraak
    : BULLET MET EEN MAXIMUM VAN attribuutMetLidwoord COMMA
    ;

verdeelAfronding
    : BULLET AFGEROND OP NUM_INT DECIMALEN NAAR BENEDEN
    ;

onverdeeldeRest
    : ALS ONVERDEELDE REST BLĲFT attribuutVanOnderwerp OVER
    ;

dagsoortDefinitie
    : EEN DAG IS EEN dagsoortNaam
    ;


// === Voorwaarden Deel (Condition Part) ===
voorwaardenDeel
    : (INDIEN | GEDURENDE_DE_TIJD_DAT) (toplevelElementaireVoorwaarde | toplevelSamengesteldeVoorwaarde)
    | periodeVergelijkingEnkelvoudig
    ;

predicaat // Used in onderwerpKeten suffix
    : elementairPredicaat | samengesteldPredicaat
    ;

elementairPredicaat
    : getalPredicaat | tekstPredicaat | datumPredicaat | objectPredicaat
    ;

samengesteldPredicaat
    : AAN kwantificatie VOLGENDE VOORWAARDE (N)? (VOLDOET | VOLDOEN) COLON
      (samengesteldeVoorwaardeOnderdeel | toplevelVoorwaardeVergelijking)
    ;

getalPredicaat: toplevelTweezijdigeGetalVergelijkingsoperatorMeervoud getalExpressie;
tekstPredicaat: toplevelTweezijdigeTekstVergelijkingsoperatorMeervoud tekstExpressie;
datumPredicaat: toplevelTweezijdigeDatumVergelijkingsoperatorMeervoud datumExpressie;
objectPredicaat: toplevelTweezijdigeObjectVergelijkingsoperatorMeervoud objectExpressie;

toplevelSamengesteldeVoorwaarde
    : (objectExpressie | referentie | aggregatie | ER)
      AAN voorwaardeKwantificatie VOLGENDE VOORWAARDE (N)?
      (VOLDOET | VOLDOEN | WORDT VOLDAAN) COLON
      samengesteldeVoorwaardeOnderdeel
    ;

genesteSamengesteldeVoorwaarde
    : (objectExpressie | referentie | aggregatie | ER)
      (VOLDOET | VOLDOEN | WORDT VOLDAAN)
      AAN voorwaardeKwantificatie VOLGENDE VOORWAARDE (N)? COLON
      samengesteldeVoorwaardeOnderdeel
    ;

voorwaardeKwantificatie: kwantificatie;

samengesteldeVoorwaardeOnderdeel
    : (NEWLINE? BULLET+ genesteVoorwaarde)+
    ;

genesteVoorwaarde
    : elementaireVoorwaarde | genesteSamengesteldeVoorwaarde
    ;

toplevelElementaireVoorwaarde
    : toplevelVoorwaardeVergelijking
    | toplevelConsistentieVoorwaarde
    ;

toplevelVoorwaardeVergelijking
    : toplevelGetalVergelijking
    | toplevelObjectVergelijking
    | toplevelTekstVergelijking
    | toplevelDatumVergelijking
    | toplevelBooleanVergelijking
    | periodeVergelijkingElementair
    ;

// Vragende vorm operators (for toplevel conditions - ending with verb)
toplevelGetalVergelijking: toplevelEenzijdigeGetalVergelijking | toplevelTweezijdigeGetalVergelijking;
toplevelEenzijdigeGetalVergelijking: getalExpressie toplevelEenzijdigeGetalVergelijkingsoperator;
toplevelTweezijdigeGetalVergelijking: getalExpressie toplevelTweezijdigeGetalVergelijkingsoperator getalExpressie;

toplevelDatumVergelijking: toplevelEenzijdigeDatumVergelijking | toplevelTweezijdigeDatumVergelijking;
toplevelEenzijdigeDatumVergelijking: datumExpressie toplevelEenzijdigeDatumVergelijkingsoperator;
toplevelTweezijdigeDatumVergelijking: datumExpressie toplevelTweezijdigeDatumVergelijkingsoperator datumExpressie;

toplevelTekstVergelijking: toplevelEenzijdigeTekstVergelijking | toplevelTweezijdigeTekstVergelijking;
toplevelEenzijdigeTekstVergelijking: tekstExpressie toplevelEenzijdigeTekstVergelijkingsoperator;
toplevelTweezijdigeTekstVergelijking: tekstExpressie toplevelTweezijdigeTekstVergelijkingsoperator tekstExpressie;

toplevelBooleanVergelijking: toplevelEenzijdigeBooleanVergelijking | toplevelTweezijdigeBooleanVergelijking;
toplevelEenzijdigeBooleanVergelijking: booleanExpressie toplevelEenzijdigeBooleanVergelijkingsoperator;
toplevelTweezijdigeBooleanVergelijking: booleanExpressie toplevelTweezijdigeBooleanVergelijkingsoperator booleanExpressie;

toplevelObjectVergelijking: toplevelEenzijdigeObjectVergelijking | toplevelTweezijdigeObjectVergelijking;
toplevelEenzijdigeObjectVergelijking: objectExpressie toplevelEenzijdigeObjectVergelijkingsoperator;
toplevelTweezijdigeObjectVergelijking: (objectExpressie | referentie) toplevelTweezijdigeObjectVergelijkingsoperator objectExpressie;

toplevelConsistentieVoorwaarde
    : REGEL karakterreeks LPAREN versieGeldigheid RPAREN (IS_GEVUURD | IS_INCONSISTENT)
    ;

// Vragende vorm operator rules using phrase tokens
toplevelEenzijdigeGetalVergelijkingsoperator: (gehelePeriodeVergelijking)? (IS_LEEG | IS_GEVULD | VOLDOET_AAN_DE_ELFPROEF | VOLDOET_NIET_AAN_DE_ELFPROEF);
toplevelEenzijdigeGetalVergelijkingsoperatorMeervoud: (gehelePeriodeVergelijking)? (ZIJN_LEEG | ZIJN_GEVULD | VOLDOEN_AAN_DE_ELFPROEF | VOLDOEN_NIET_AAN_DE_ELFPROEF);
toplevelTweezijdigeGetalVergelijkingsoperator: (gehelePeriodeVergelijking)? (IS_GELIJK_AAN | IS_ONGELIJK_AAN | IS_GROTER_DAN | IS_GROTER_OF_GELIJK_AAN | IS_KLEINER_OF_GELIJK_AAN | IS_KLEINER_DAN);
toplevelTweezijdigeGetalVergelijkingsoperatorMeervoud: (gehelePeriodeVergelijking)? (ZIJN_GELIJK_AAN | ZIJN_ONGELIJK_AAN | ZIJN_GROTER_DAN | ZIJN_GROTER_OF_GELIJK_AAN | ZIJN_KLEINER_OF_GELIJK_AAN | ZIJN_KLEINER_DAN);

toplevelEenzijdigeDatumVergelijkingsoperator: (gehelePeriodeVergelijking)? (IS_LEEG | IS_GEVULD | (IS_EEN_DAGSOORT dagsoortNaam) | (IS_GEEN_DAGSOORT dagsoortNaam));
toplevelEenzijdigeDatumVergelijkingsoperatorMeervoud: (gehelePeriodeVergelijking)? (ZIJN_LEEG | ZIJN_GEVULD | (ZIJN_EEN_DAGSOORT dagsoortNaam) | (ZIJN_GEEN_DAGSOORT dagsoortNaam));
toplevelTweezijdigeDatumVergelijkingsoperator: (gehelePeriodeVergelijking)? (IS_GELIJK_AAN | IS_ONGELIJK_AAN | IS_LATER_DAN | IS_LATER_OF_GELIJK_AAN | IS_EERDER_OF_GELIJK_AAN | IS_EERDER_DAN);
toplevelTweezijdigeDatumVergelijkingsoperatorMeervoud: (gehelePeriodeVergelijking)? (ZIJN_GELIJK_AAN | ZIJN_ONGELIJK_AAN | ZIJN_LATER_DAN | ZIJN_LATER_OF_GELIJK_AAN | ZIJN_EERDER_OF_GELIJK_AAN | ZIJN_EERDER_DAN);

toplevelEenzijdigeTekstVergelijkingsoperator: (gehelePeriodeVergelijking)? (IS_LEEG | IS_GEVULD | (IS_NUMERIEK_MET_EXACT NUM_INT CIJFERS) | (IS_NIET_NUMERIEK_MET_EXACT NUM_INT CIJFERS) | VOLDOET_AAN_DE_ELFPROEF | VOLDOET_NIET_AAN_DE_ELFPROEF);
toplevelEenzijdigeTekstVergelijkingsoperatorMeervoud: (gehelePeriodeVergelijking)? (ZIJN_LEEG | ZIJN_GEVULD | (ZIJN_NUMERIEK_MET_EXACT NUM_INT CIJFERS) | (ZIJN_NIET_NUMERIEK_MET_EXACT NUM_INT CIJFERS) | VOLDOEN_AAN_DE_ELFPROEF | VOLDOEN_NIET_AAN_DE_ELFPROEF);
toplevelTweezijdigeTekstVergelijkingsoperator: (gehelePeriodeVergelijking)? (IS_GELIJK_AAN | IS_ONGELIJK_AAN);
toplevelTweezijdigeTekstVergelijkingsoperatorMeervoud: (gehelePeriodeVergelijking)? (ZIJN_GELIJK_AAN | ZIJN_ONGELIJK_AAN);

toplevelEenzijdigeBooleanVergelijkingsoperator: (gehelePeriodeVergelijking)? (IS_LEEG | IS_GEVULD);
toplevelEenzijdigeBooleanVergelijkingsoperatorMeervoud: (gehelePeriodeVergelijking)? (ZIJN_LEEG | ZIJN_GEVULD);
toplevelTweezijdigeBooleanVergelijkingsoperator: (gehelePeriodeVergelijking)? (IS_GELIJK_AAN | IS_ONGELIJK_AAN);
toplevelTweezijdigeBooleanVergelijkingsoperatorMeervoud: (gehelePeriodeVergelijking)? (ZIJN_GELIJK_AAN | ZIJN_ONGELIJK_AAN);

toplevelEenzijdigeObjectVergelijkingsoperator
    : (gehelePeriodeVergelijking)? ( (EEN)? (rolNaam | kenmerkNaam) (IS | HEEFT)
                                   | (GEEN) (rolNaam | kenmerkNaam) (IS | HEEFT)
                                   )
    ;
toplevelEenzijdigeObjectVergelijkingsoperatorMeervoud
    : (gehelePeriodeVergelijking)? ( (EEN)? (rolNaam | kenmerkNaam) (ZIJN | HEBBEN)
                                   | (GEEN) (rolNaam | kenmerkNaam) (ZIJN | HEBBEN)
                                   )
    ;
toplevelTweezijdigeObjectVergelijkingsoperator: (gehelePeriodeVergelijking)? (IS_GELIJK_AAN | IS_ONGELIJK_AAN);
toplevelTweezijdigeObjectVergelijkingsoperatorMeervoud: (gehelePeriodeVergelijking)? (ZIJN_GELIJK_AAN | ZIJN_ONGELIJK_AAN);

// Stellende vorm operators (for bullet list conditions - verb first)
elementaireVoorwaarde
    : voorwaardeVergelijking | consistentieVoorwaarde
    ;

voorwaardeVergelijking
    : getalVergelijking | objectVergelijking | tekstVergelijking | datumVergelijking | booleanVergelijking | periodeVergelijkingElementair
    ;

getalVergelijking: eenzijdigeGetalVergelijking | tweezijdigeGetalVergelijking;
eenzijdigeGetalVergelijking: getalExpressie eenzijdigeGetalVergelijkingsoperatorStellend;
tweezijdigeGetalVergelijking: getalExpressie tweezijdigeGetalVergelijkingsoperatorStellend getalExpressie;

datumVergelijking: eenzijdigeDatumVergelijking | tweezijdigeDatumVergelijking;
eenzijdigeDatumVergelijking: datumExpressie eenzijdigeDatumVergelijkingsoperatorStellend;
tweezijdigeDatumVergelijking: datumExpressie tweezijdigeDatumVergelijkingsoperatorStellend datumExpressie;

tekstVergelijking: eenzijdigeTekstVergelijking | tweezijdigeTekstVergelijking;
eenzijdigeTekstVergelijking: tekstExpressie eenzijdigeTekstVergelijkingsoperatorStellend;
tweezijdigeTekstVergelijking: tekstExpressie tweezijdigeTekstVergelijkingsoperatorStellend tekstExpressie;

booleanVergelijking: eenzijdigeBooleanVergelijking | tweezijdigeBooleanVergelijking;
eenzijdigeBooleanVergelijking: booleanExpressie eenzijdigeBooleanVergelijkingsoperatorStellend;
tweezijdigeBooleanVergelijking: booleanExpressie tweezijdigeBooleanVergelijkingsoperatorStellend booleanExpressie;

objectVergelijking: eenzijdigeObjectVergelijking | tweezijdigeObjectVergelijking;
eenzijdigeObjectVergelijking: objectExpressie eenzijdigeObjectVergelijkingsoperatorStellend;
tweezijdigeObjectVergelijking: (objectExpressie | referentie) tweezijdigeObjectVergelijkingsoperatorStellend objectExpressie;

consistentieVoorwaarde
    : REGEL karakterreeks LPAREN versieGeldigheid RPAREN (IS_GEVUURD | IS_INCONSISTENT) // No change needed
    ;

periodeVergelijkingEnkelvoudig
    : VANAF datumExpressie
    | VAN datumExpressie TOT datumExpressie
    | VAN datumExpressie TM datumExpressie
    | TOT datumExpressie
    | TM datumExpressie
    ;
periodeVergelijkingElementair
    : HET_IS_DE_PERIODE periodeVergelijkingEnkelvoudig
    ;

gehelePeriodeVergelijking
    : (NIET)? GEDURENDE (GEDURENDE_HET_GEHELE_JAAR | GEDURENDE_DE_GEHELE_MAAND)
    ;

// Stellende vorm operator rules using individual keywords (verb first)
eenzijdigeGetalVergelijkingsoperatorStellend: (IS (gehelePeriodeVergelijking)? (LEEG | GEVULD)) | (VOLDOET (gehelePeriodeVergelijking)? AAN DE ELFPROEF) | (VOLDOET (gehelePeriodeVergelijking)? NIET AAN DE ELFPROEF);
eenzijdigeGetalVergelijkingsoperatorMeervoudStellend: (ZIJN (gehelePeriodeVergelijking)? (LEEG | GEVULD)) | (VOLDOEN (gehelePeriodeVergelijking)? AAN DE ELFPROEF) | (VOLDOEN (gehelePeriodeVergelijking)? NIET AAN DE ELFPROEF);
tweezijdigeGetalVergelijkingsoperatorStellend: IS (gehelePeriodeVergelijking)? (GELIJK AAN | ONGELIJK AAN | GROTER DAN | GROTER OF GELIJK AAN | KLEINER OF GELIJK AAN | KLEINER DAN);
tweezijdigeGetalVergelijkingsoperatorMeervoudStellend: ZIJN (gehelePeriodeVergelijking)? (GELIJK AAN | ONGELIJK AAN | GROTER DAN | GROTER OF GELIJK AAN | KLEINER OF GELIJK AAN | KLEINER DAN);

eenzijdigeDatumVergelijkingsoperatorStellend: (IS (gehelePeriodeVergelijking)? (LEEG | GEVULD)) | ((gehelePeriodeVergelijking)? IS EEN dagsoortNaam) | ((gehelePeriodeVergelijking)? IS GEEN dagsoortNaam);
eenzijdigeDatumVergelijkingsoperatorMeervoudStellend: (ZIJN (gehelePeriodeVergelijking)? (LEEG | GEVULD)) | ((gehelePeriodeVergelijking)? ZIJN EEN dagsoortNaam) | ((gehelePeriodeVergelijking)? ZIJN GEEN dagsoortNaam);
tweezijdigeDatumVergelijkingsoperatorStellend: IS (gehelePeriodeVergelijking)? (GELIJK AAN | ONGELIJK AAN | LATER DAN | LATER OF GELIJK AAN | EERDER OF GELIJK AAN | EERDER DAN);
tweezijdigeDatumVergelijkingsoperatorMeervoudStellend: ZIJN (gehelePeriodeVergelijking)? (GELIJK AAN | ONGELIJK AAN | LATER DAN | LATER OF GELIJK AAN | EERDER OF GELIJK AAN | EERDER DAN);

eenzijdigeTekstVergelijkingsoperatorStellend: (IS (gehelePeriodeVergelijking)? (LEEG | GEVULD | (NUMERIEK MET EXACT NUM_INT CIJFERS) | (NIET NUMERIEK MET EXACT NUM_INT CIJFERS))) | (VOLDOET (gehelePeriodeVergelijking)? AAN DE ELFPROEF) | (VOLDOET (gehelePeriodeVergelijking)? NIET AAN DE ELFPROEF);
eenzijdigeTekstVergelijkingsoperatorMeervoudStellend: (ZIJN (gehelePeriodeVergelijking)? (LEEG | GEVULD | (NUMERIEK MET EXACT NUM_INT CIJFERS) | (NIET NUMERIEK MET EXACT NUM_INT CIJFERS))) | (VOLDOEN (gehelePeriodeVergelijking)? AAN DE ELFPROEF) | (VOLDOEN (gehelePeriodeVergelijking)? NIET AAN DE ELFPROEF);
tweezijdigeTekstVergelijkingsoperatorStellend: IS (gehelePeriodeVergelijking)? (GELIJK AAN | ONGELIJK AAN);
tweezijdigeTekstVergelijkingsoperatorMeervoudStellend: ZIJN (gehelePeriodeVergelijking)? (GELIJK AAN | ONGELIJK AAN);

eenzijdigeBooleanVergelijkingsoperatorStellend: IS (gehelePeriodeVergelijking)? (LEEG | GEVULD);
eenzijdigeBooleanVergelijkingsoperatorMeervoudStellend: ZIJN (gehelePeriodeVergelijking)? (LEEG | GEVULD);
tweezijdigeBooleanVergelijkingsoperatorStellend: IS (gehelePeriodeVergelijking)? (GELIJK AAN | ONGELIJK AAN);
tweezijdigeBooleanVergelijkingsoperatorMeervoudStellend: ZIJN (gehelePeriodeVergelijking)? (GELIJK AAN | ONGELIJK AAN);

eenzijdigeObjectVergelijkingsoperatorStellend: ((IS | HEEFT) (gehelePeriodeVergelijking)? (EEN)? (kenmerkNaam | rolNaam)) | ((IS | HEEFT) (gehelePeriodeVergelijking)? GEEN (kenmerkNaam | rolNaam));
eenzijdigeObjectVergelijkingsoperatorMeervoudStellend: ((ZIJN | HEBBEN) (gehelePeriodeVergelijking)? (EEN)? (kenmerkNaam | rolNaam)) | ((ZIJN | HEBBEN) (gehelePeriodeVergelijking)? GEEN (kenmerkNaam | rolNaam));
tweezijdigeObjectVergelijkingsoperatorStellend: IS (gehelePeriodeVergelijking)? (GELIJK AAN | ONGELIJK AAN);
tweezijdigeObjectVergelijkingsoperatorMeervoudStellend: ZIJN (gehelePeriodeVergelijking)? (GELIJK AAN | ONGELIJK AAN);


// === Expressions ===
expressie
    : getalExpressie
    | objectExpressie
    | datumExpressie
    | tekstExpressie
    | booleanExpressie
    | LPAREN expressie RPAREN
    | parameterMetLidwoord
    | variabelenaam
    | concatenatie
    | enumeratiewaarde
    ;

concatenatie
    : expressie (COMMA expressie)* (EN | OF) expressie
    ;

// Numeric Expressions (Precedence Climbing)
getalExpressie
    : expr_add (COMMA begrenzing | afronding)?
    ;

expr_add
    : expr_mul ( (PLUS | MIN | VERMINDERD_MET) expr_mul )*
    ;

expr_mul
    : expr_unary ( (MAAL | GEDEELD_DOOR | GEDEELD_DOOR_ABS) expr_unary )*
    ;

expr_unary
    : MINUS expr_unary
    | atom_numeric
    ;

atom_numeric
    : getalwaarde
    | REKENJAAR
    | LPAREN getalExpressie RPAREN
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabelenaam
    | getalAggregatie
    | waardePerTijdseenheidAggregatie
    | tellingAantalDagen
    | tijdsevenredigDeel
    | percentageFunctie
    | wortelFunctie
    | machtsverheffenFunctie
    | minimaleWaardeFunctie
    | maximaleWaardeFunctie
    | absoluteWaardeFunctie
    | jaarUitFunctie
    | maandUitFunctie
    | dagUitFunctie
    | tijdsduurTussen
    ;

getalwaarde: NUM_INT | NUM_DEC | (NUM_INT | NUM_DEC) eenheidsAfkorting+; // Removed NUM_RAT literal

percentageFunctie: getalExpressie (PERCENT_SIGN)? VAN getalExpressie;
wortelFunctie: DE_WORTEL_VAN getalExpressie afronding;
machtsverheffenFunctie: getalExpressie TOT_DE_MACHT getalExpressie afronding;
minimaleWaardeFunctie: DE_MINIMALE_WAARDE_VAN expressieList; // Use helper rule for list
maximaleWaardeFunctie: DE_MAXIMALE_WAARDE_VAN expressieList;
absoluteWaardeFunctie: DE_ABSOLUTE_WAARDE_VAN LPAREN getalExpressie RPAREN;
jaarUitFunctie: JAAR UIT LPAREN datumExpressie RPAREN; // Removed HET
maandUitFunctie: MAAND UIT LPAREN datumExpressie RPAREN; // Removed DE
dagUitFunctie: DAG UIT LPAREN datumExpressie RPAREN; // Removed DE
tijdsduurTussen: (TIJDSDUUR | ABSOLUTE TIJDSDUUR) VAN datumExpressie TOT datumExpressie IN (HELE)? eenheidMeervoud;
eenheidMeervoud: DAGEN | MAANDEN | JAREN | IDENTIFIER; // Allow common plural units or general identifier

afronding
    : (NAAR BENEDEN | NAAR BOVEN | REKENKUNDIG | RICHTING NUL | WEG VAN NUL) AFGEROND OP NUM_INT DECIMALEN
    ;

begrenzing
    : begrenzingMinimum (EN begrenzingMaximum)?
    | begrenzingMaximum
    ;
begrenzingMinimum: MET_EEN_MINIMUM_VAN getalExpressie;
begrenzingMaximum: MET_EEN_MAXIMUM_VAN getalExpressie;

// Date Expressions
datumExpressie
    : attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabelenaam
    | dedato
    | datumAggregatie
    | LPAREN datumExpressie RPAREN
    | datumMet
    | eerstePaasdagVan
    | datumBerekening
    | eersteVan
    | laatsteVan
    | rekendatum
    ;

rekendatum: REKENDATUM;
dedato: DD.? datumwaarde (tijdwaarde)?; // Use DD token: 'dd.'
datumwaarde: DATE_DDMMYYYY;
tijdwaarde: TIME_HHMMSSMS;
datumMet: DE_DATUM_MET_JAAR_MAAND_DAG LPAREN getalExpressie COMMA getalExpressie COMMA getalExpressie RPAREN;
eerstePaasdagVan: DE_EERSTE_PAASDAG_VAN LPAREN jaar RPAREN;
jaar: NUM_INT;
datumBerekening: datumExpressie (PLUS | MIN) getalExpressie eenheidsAfkorting;
eersteVan: DE_EERSTE_VAN expressieList; // Use helper rule
laatsteVan: DE_LAATSTE_VAN expressieList;

// Object Expressions
objectExpressie
    : (kwantificatie)? onderwerpKeten
    ;

// Text Expressions
tekstExpressie
    : tekstwaarde
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabelenaam
    | tekstenWaardeReeks
    | LPAREN tekstExpressie RPAREN
    ;
tekstwaarde: STRING;
enumeratiewaarde: ENUMSTRING;
tekstenWaardeReeks: STRING;

// Boolean Expressions
booleanExpressie
    : booleanWaarde
    | attribuutVanOnderwerp
    | parameterMetLidwoord
    | variabelenaam
    | voorwaardeVergelijking
    | consistentieVoorwaarde
    | LPAREN booleanExpressie RPAREN
    ;
booleanWaarde: WAAR | ONWAAR;

// Aggregations
aggregatie
    : getalAggregatie | datumAggregatie | dimensieAggregatie
    ;

getalAggregatie: getalAggregatieFunctie expressie;
getalAggregatieFunctie
    : HET_AANTAL
    | DE_MAXIMALE_WAARDE_VAN
    | DE_MINIMALE_WAARDE_VAN
    | DE_SOM_VAN (OF NUM_INT ALS_DIE_ER_NIET_ZIJN)?
    ;

datumAggregatie: datumAggregatieFunctie expressie;
datumAggregatieFunctie: DE_EERSTE_VAN | DE_LAATSTE_VAN;

dimensieAggregatie
    : (getalAggregatieFunctie | datumAggregatieFunctie) attribuutVanOnderwerp dimensieSelectie
    ;

dimensieSelectie
    : OVER (aggregerenOverAlleDimensies | aggregerenOverVerzameling | aggregerenOverBereik)
    ;

aggregerenOverAlleDimensies: ALLE dimensieNaamMeervoud;
aggregerenOverVerzameling: DE dimensieNaamMeervoud VANAF dimensiewaarde TM dimensiewaarde;
aggregerenOverBereik: DE dimensieNaamMeervoud IN LBRACE dimensiewaarde (COMMA dimensiewaarde)* (EN dimensiewaarde)? RBRACE;

// Specific Time-dependent Expressions
conditieBijExpressie
    : GEDURENDE_DE_TIJD_DAT (toplevelElementaireVoorwaarde | toplevelSamengesteldeVoorwaarde)
    | periodeVergelijkingEnkelvoudig
    ;

waardePerTijdseenheidAggregatie
    : LPAREN? HET_TOTAAL_VAN expressie (conditieBijExpressie)? RPAREN?
    ;

tellingAantalDagen
    : HET_AANTAL_DAGEN_IN (DE MAAND | HET JAAR) DAT booleanExpressie
    ;

tijdsevenredigDeel
    : LPAREN? HET_TIJDSEVENREDIG_DEEL_PER (MAAND | JAAR) VAN expressie conditieBijExpressie RPAREN?
    ;

// References
referentie
    : bezieldeReferentie | nietBezieldeReferentie | dagsoortReferentie
    ;

bezieldeReferentie
    : HĲ
    | ZIJN attribuutNaam
    | ZIJN rolNaam
    ;

nietBezieldeReferentie
    : objecttypenaamMetLidwoord
    ;
objecttypenaamMetLidwoord: bepaaldLidwoord objecttypenaam;

dagsoortReferentie: DE DAG;

// Beslistabel Structure
beslistabel
    : BESLISTABEL regelNaam (SEMI | NEWLINE)
      versie (SEMI | NEWLINE)
      tabelHeader (SEMI | NEWLINE)
      ( tabelRij (SEMI | NEWLINE) )+
    ;

tabelHeader
    : PIPE (tabelHeaderCel)+ PIPE
    ;
tabelHeaderCel
    : ( conclusieHeader | conditieHeader ) PIPE
    ;
conclusieHeader
    : gelijkstellingHeader | kenmerkToekenningHeader
    ;
gelijkstellingHeader
    : attribuutVanOnderwerp MOET_GESTELD_WORDEN_OP
    ;
kenmerkToekenningHeader
    : onderwerpKeten (IS | HEEFT) (EEN)? kenmerkNaam
    ;
conditieHeader
    : INDIEN (voorwaardeVergelijkingHeader)
    ;
voorwaardeVergelijkingHeader // Placeholder, actual header text parsing might be complex
    : expressie (IS_GELIJK_AAN | IS_GROTER_DAN | IS_KLEINER_DAN | IS_LEEG | VOLDOET_AAN_DE_ELFPROEF /* etc */ )
    ;

tabelRij
    : PIPE (tabelDataCel)+ PIPE
    ;
tabelDataCel
    : ( expressie | voorwaardeCelData | NVTCel ) PIPE
    ;
voorwaardeCelData
    : expressie // Single value
    | enumeratiewaardeList // List for equality check
    ;
enumeratiewaardeList
    : enumeratiewaarde (COMMA enumeratiewaarde)* (OF enumeratiewaarde)?
    ;
NVTCel: NVT;

// Helper rule for comma-separated list with 'en'
expressieList
    : expressie (COMMA expressie)* EN expressie
    ;

// Need DD token for 'dd.' literal
DD: 'dd.';