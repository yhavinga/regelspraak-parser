grammar RegelSpraak;

options { tokenVocab=RegelSpraakLexer; }

// Start Rule: Can parse a file with multiple definitions/rules
regelSpraakDocument
    : ( definitie | regel )* EOF
    ;

definitie
    : objectTypeDefinition
    | domeinDefinition
    | parameterDefinition
    ;

// --- Object Type Definition (Based on objecttype.txt) ---
objectTypeDefinition
    : OBJECTTYPE naamwoord ( MV_START plural+=IDENTIFIER+ RPAREN )? (BEZIELD)?
      ( objectTypeMember )*
    ;

// New simple phrase rule
naamPhrase
    : (DE | HET | ZIJN)? IDENTIFIER+
    ;

naamwoord // Modified to handle structure like 'phrase (preposition phrase)*'
    : naamPhrase ( voorzetsel naamPhrase )*
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
    : DOMEIN name+=IDENTIFIER+ IS_VAN_HET_TYPE domeinType (MET_EENHEID eenheidExpressie )? SEMICOLON?
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

voorwaardeDeel // Modified to handle simple and complex conditions
    : INDIEN ( expressie | toplevelSamengesteldeVoorwaarde ) // Added alternative
    ;

// EBNF §13.4.13 Samengestelde voorwaarde (Simplified structure)
toplevelSamengesteldeVoorwaarde
    : (HIJ | onderwerpReferentie) AAN voorwaardeKwantificatie VOLGENDE_VOORWAARDEN VOLDOET COLON
      samengesteldeVoorwaardeOnderdeel
    ;

voorwaardeKwantificatie // EBNF 13.4.13.4 (Simplified)
    : ALLE // Only handle ALLE for now
    ;

samengesteldeVoorwaardeOnderdeel // EBNF 13.4.13.6 (Simplified)
    : BULLET genesteVoorwaarde ( BULLET genesteVoorwaarde )*
    ;

genesteVoorwaarde // EBNF 13.4.13.7 (Simplified)
    : elementaireVoorwaarde // Only handling elementaire for now
    ;

// EBNF §13.4.14 Elementaire voorwaarde (Simplified)
elementaireVoorwaarde
    : voorwaardeVergelijking
    ;

// EBNF §13.4.14.50 VoorwaardeVergelijking (Simplified)
voorwaardeVergelijking
    : objectVergelijking
    | getalVergelijking
    ;

// Specific comparison types for the test case (Simplified)
objectVergelijking
    : onderwerpReferentie IS identifier // E.g., zijn reis is duurzaam
    ;

getalVergelijking // Refined further for test cases
    : (naamwoord | attribuutReferentie | bezieldeReferentie) (IS_GROTER_OF_GELIJK_AAN | GROTER_DAN | IS_GROTER_DAN) NUMBER // Added naamwoord
    ;

variabeleDeel // Use single token
    : DAARBIJ_GELDT
      variabeleToekenning* // Changed to * to allow zero or more after first mandatory one implied by DAARBIJ_GELDT
      DOT
    ;

variabeleToekenning
    : naamwoord IS expressie SEMICOLON?
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
    | KLEINER_IS_DAN
    | IS
    | LATER_DAN | LATER_OF_GELIJK_AAN
    | EERDER_DAN | EERDER_OF_GELIJK_AAN
    | NIET
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
    | bezieldeReferentie
    ;

// Rule for bezieldeReferentie (Simplified from spec 13.4.16.37 for ZIJN case)
bezieldeReferentie
    : ZIJN identifier
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
    : VAN | IN | VOOR | OVER | OP | BIJ | UIT | TOT
    ;

parameterNamePhrase // Dedicated rule for parameter names
    : (DE | HET)? IDENTIFIER+ // Reverted to include optional article
    ;

// EBNF §13.3.8 Parameter Definition
parameterDefinition
    : PARAMETER parameterNamePhrase COLON ( datatype | domeinRef )
      ( MET_EENHEID eenheidExpressie )?
      tijdlijn? SEMICOLON
    ;

parameterMetLidwoord
    : naamwoord
    ;

eenheidExpressie // Corresponds to unit structure in §13.3.3.2/3. Simplified placeholder based on spec.
    : eenheidMacht ( SLASH eenheidMacht )?
    | NUMBER
    | PERCENT_SIGN // Added % as a unit alternative
    ;

eenheidMacht // EBNF 13.3.5.5. Simplified placeholder.
    : identifier ( CARET NUMBER )? // E.g., m^2
    ;

tijdlijn // EBNF §13.3.6. Modified to accept specific tokens directly.
    : VOOR_ELKE_DAG | VOOR_ELKE_MAAND | VOOR_ELK_JAAR
    ;