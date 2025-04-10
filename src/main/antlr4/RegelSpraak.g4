grammar RegelSpraak;

options { tokenVocab=RegelSpraakLexer; }

// Start Rule: Can parse a file with multiple definitions/rules
regelSpraakDocument
    : ( definitie | regel )* EOF
    ;

definitie
    : objectTypeDefinition
    | domeinDefinition
    ;

// --- Object Type Definition (Based on objecttype.txt) ---
objectTypeDefinition
    : OBJECTTYPE naamwoord ( MV_START plural+=IDENTIFIER+ RPAREN )? (BEZIELD)?
      ( objectTypeMember )*
    ;

naamwoord // Allow sequence of IDENTIFIERs and prepositions
    : (DE | HET | ZIJN)? name+=IDENTIFIER+ ( voorzetsel more_name+=IDENTIFIER+ )*
    ;

objectTypeMember
    : ( kenmerkSpecificatie | attribuutSpecificatie ) SEMICOLON
    ;

kenmerkSpecificatie // Expect single IDENTIFIERs for name parts
    : (IS? identifier | naamwoord) KENMERK (BIJVOEGLIJK | BEZITTELIJK)?
    ;

attribuutSpecificatie // Expect single IDENTIFIERs for name parts
    : naamwoord ( datatype | domeinRef ) (MET_EENHEID (unitName=IDENTIFIER | PERCENT_SIGN))? (GEDIMENSIONEERD_MET dimensieRef (EN dimensieRef)*)?
    ;

domeinRef
    : DOMEIN name=IDENTIFIER
    ;

dimensieRef
    : name=IDENTIFIER
    ;

// Re-add datatype rule definition
datatype
    : numeriekDatatype
    | tekstDatatype
    | booleanDatatype
    | datumTijdDatatype
    ;

// --- Domain Definition (Based on domein.txt) ---
domeinDefinition
    : DOMEIN name+=IDENTIFIER+ IS_VAN_HET_TYPE domeinType (MET_EENHEID (unitName=IDENTIFIER | PERCENT_SIGN))? SEMICOLON?
    ;

domeinType
    : enumeratieSpecificatie
    | numeriekDatatype
    | tekstDatatype
    | booleanDatatype
    | datumTijdDatatype
    ;

enumeratieSpecificatie
    : ENUMERATIE
      ( ENUM_LITERAL )+
    ;

numeriekDatatype
    : NUMERIEK ( LPAREN getalSpecificatie RPAREN )?
    ;

tekstDatatype
    : TEKST
    ;

booleanDatatype
    : BOOLEAN
    ;

datumTijdDatatype // Use single tokens
    : DATUM_IN_DAGEN
    | DATUM_TIJD_MILLIS
    ;

getalSpecificatie // Use single tokens
    : (NEGATIEF | NIET_NEGATIEF | POSITIEF)? (GEHEEL_GETAL | (GETAL MET NUMBER DECIMALEN) | GETAL)
    ;

// --- Regel Definition (Based on regel.txt) ---
regel
    : REGEL name+=IDENTIFIER+
      regelVersie
      resultaatDeel ( DOT? | ( voorwaardeDeel DOT? ) )
      ( variabeleDeel )?
    ;

regelVersie
    : GELDIG versieGeldigheid
    ;

versieGeldigheid
    : ALTIJD
    | VANAF datumLiteral ( (TM | TOT_EN_MET) datumLiteral )?
    ;

resultaatDeel // Use single tokens
    : (attribuutReferentie | onderwerpReferentie) ( WORDT_BEREKEND_ALS expressie | WORDT_GESTELD_OP expressie ) DOT?
    | onderwerpReferentie (IS | HEEFT) kenmerkNaam DOT?
    ;

voorwaardeDeel
    : INDIEN expressie
    ;

variabeleDeel // Use single token
    : DAARBIJ_GELDT
      variabeleToekenning* // Changed to * to allow zero or more after first mandatory one implied by DAARBIJ_GELDT
      DOT
    ;

variabeleToekenning
    : naamwoord IS expressie SEMICOLON // Mandatory semicolon
    ;

// --- Expressions (Refactored to remove left recursion) ---
expressie
    : comparisonExpression
    ;

comparisonExpression
    : left=additiveExpression ( comparisonOperator right=additiveExpression )?
    ;

comparisonOperator
    : GELIJK_AAN | ONGELIJK_AAN
    | GROTER_DAN | GROTER_OF_GELIJK_AAN
    | KLEINER_DAN | KLEINER_OF_GELIJK_AAN
    | IS
    ;

additiveExpression
    : left=primaryExpression ( additiveOperator right=primaryExpression )*
    ;

additiveOperator : PLUS | MIN | VERMINDERD_MET ;

primaryExpression // Use single tokens
    : ABSOLUTE_TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?
    | TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?
    | SOM_VAN (ALLE? onderwerpReferentie)
    | NUMBER (PERCENT_SIGN | p=IDENTIFIER) VAN primaryExpression
    | attribuutReferentie
    | naamwoord
    | REKENDATUM
    | identifier
    | NUMBER
    | STRING_LITERAL
    | WAAR | ONWAAR
    | HIJ
    | LPAREN expressie RPAREN
    ;

// --- References ---
attribuutReferentie
    : naamwoord VAN onderwerpReferentie // Relies on onderwerpReferentie for nesting
    ;

onderwerpReferentie // Allow sequence + nesting + pronoun
    : basisOnderwerp ( voorzetsel basisOnderwerp )* // Allow any voorzetsel for nesting
    ;

basisOnderwerp // Base unit for subject/object reference
    : (DE | HET | EEN | ZIJN)? IDENTIFIER+ // Added ZIJN
    | HIJ
    ;

kenmerkNaam : onderwerpReferentie ; // Reuse onderwerpReferentie structure

identifier
    : IDENTIFIER
    ;

unit
    : IDENTIFIER
    ;

datumLiteral : DATE_TIME_LITERAL ;

voorzetsel // Define preposition rule needed by naamwoord
    : VAN | IN | VOOR | OVER | OP | BIJ | UIT
    ;