grammar RegelSpraak;

options { tokenVocab=RegelSpraakLexer; }

// --- Start Rule ---
regelSpraakDocument // Top level container
    : ( definitie | regel | beslistabel | eenheidsysteemDefinition )* EOF
    ;

// --- Top-Level Definitions ---
definitie
    : objectTypeDefinition
    | domeinDefinition
    | parameterDefinition
    | dimensieDefinition
    | feitTypeDefinition       // Added FeitType definition
    | dagsoortDefinition       // Uncommented
    ;

// --- Beslistabel Rule (Added based on Spec) ---
beslistabel
    : BESLISTABEL identifier
    ;

// --- Basic Building Blocks ---
identifier
    : IDENTIFIER
    ;

naamPhrase // Used within naamwoord
    : (DE | HET | ZIJN)? IDENTIFIER+
    ;

naamwoord // Modified to handle structure like 'phrase (preposition phrase)*'
    : naamPhrase ( voorzetsel naamPhrase )*
    ;

voorzetsel // Used by naamwoord and onderwerpReferentie
    : VAN | IN | VOOR | OVER | OP | BIJ | UIT | TOT
    ;

datumLiteral : DATE_TIME_LITERAL ;

unit // Simple unit name
    : IDENTIFIER
    ;

// --- GegevensSpraak Definitions (§13.3) ---

// §13.3.1 Object Type Definition
objectTypeDefinition
    : OBJECTTYPE naamwoord ( MV_START plural+=IDENTIFIER+ RPAREN )? (BEZIELD)?
      ( objectTypeMember )*
    ;

objectTypeMember
    : ( kenmerkSpecificatie | attribuutSpecificatie ) SEMICOLON
    ;

// §13.3.2 Kenmerk Specificatie
kenmerkSpecificatie
    : (IS? identifier | naamwoord) KENMERK (BIJVOEGLIJK | BEZITTELIJK)?
    ;

// §13.3.2 Attribuut Specificatie
attribuutSpecificatie
    : naamwoord ( datatype | domeinRef )
      (MET_EENHEID (unitName=IDENTIFIER | PERCENT_SIGN))? // Simplified unit from original G4
      (GEDIMENSIONEERD_MET dimensieRef (EN dimensieRef)*)?
      tijdlijn? // Uncommented based on Spec
    ;

// §13.3.3 Datatypes
datatype
    : numeriekDatatype
    | tekstDatatype
    | booleanDatatype
    | datumTijdDatatype
    // | percentageDatatype // Placeholder from Spec - Not in original G4
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

getalSpecificatie // §13.3.3.7 - Use single tokens
    : (NEGATIEF | NIET_NEGATIEF | POSITIEF)? (GEHEEL_GETAL | (GETAL MET NUMBER DECIMALEN) | GETAL)
    ;

// §13.3.4 Domein Definition
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

enumeratieSpecificatie // §13.3.4.2
    : ENUMERATIE
      ( ENUM_LITERAL )+
    ;

domeinRef // Reference to a domain definition
    : DOMEIN name=IDENTIFIER
    ;

// §13.3.5 Eenheden & Eenheidsysteem (Added based on spec)
eenheidsysteemDefinition
    : EENHEIDSYSTEEM name=identifier // Standard identifier for system name
      eenheidEntry*
    ;

eenheidEntry
    : DE unitName=unitIdentifier abbrev=unitIdentifier // Use unitIdentifier rule
      (EQUALS value=NUMBER targetUnit=unitIdentifier)? // Use standard tokens + unitIdentifier
    ;

// New rule to allow keywords or identifiers as units
unitIdentifier
    : IDENTIFIER
    | METER | KILOGRAM | SECONDE | MINUUT | UUR | VOET | POND | MIJL // Keywords
    | M | KG | S | FT | LB | MIN | MI // Abbreviations + Keyword MIN
    ;

// Eenheid expressions
eenheidExpressie // Corresponds to unit structure in §13.3.3.2/3. Simplified based on original G4 & spec.
    : eenheidMacht ( SLASH eenheidMacht )?
    | NUMBER
    | PERCENT_SIGN // Added % as a unit alternative
    ;

eenheidMacht // EBNF 13.3.5.5. Simplified based on original G4 & spec.
    : unitIdentifier ( CARET NUMBER )? // Use unitIdentifier rule here too
    ;

// §13.3.7 Dimensie Definition (Added based on Spec)
dimensieDefinition
    : DIMENSIE naamwoord (COMMA)? BESTAANDE_UIT dimensieNaamMeervoud=naamwoord voorzetselSpecificatie // Assuming meervoud is also a naamwoord
      ( labelWaardeSpecificatie )+
    ;

voorzetselSpecificatie // EBNF 13.3.7.2
    : ( NA_HET_ATTRIBUUT_MET_VOORZETSEL vz=voorzetsel RPAREN COLON? )
    | VOOR_HET_ATTRIBUUT_ZONDER_VOORZETSEL
    ;

labelWaardeSpecificatie // EBNF 13.3.7.5
    : NUMBER DOT dimWaarde=identifier // Using NUMBER for the digit(s), identifier for the value
    ;

// §13.3.6 Tijdlijn (Simplified in original G4)
tijdlijn
    : VOOR_ELKE_DAG | VOOR_ELKE_MAAND | VOOR_ELK_JAAR
    ;

// §13.3.7 Dimensies (Simplified in original G4)
dimensieRef // Reference to a dimension definition
    : name=IDENTIFIER
    ;

// §13.3.8 Parameter Definition
parameterDefinition
    : PARAMETER parameterNamePhrase COLON ( datatype | domeinRef )
      ( MET_EENHEID eenheidExpressie )?
      tijdlijn? SEMICOLON
    ;

parameterNamePhrase // Dedicated rule for parameter names
    : (DE | HET)? IDENTIFIER+ // Reverted to include optional article
    ;

parameterMetLidwoord // Used within expression, but defined with parameter def
    : naamwoord
    ;

// §13.3.9 FeitType Definition (Added based on Spec - simplified)
feitTypeDefinition
    : (WEDERKERIG_FEITTYPE | FEITTYPE)
      subject=naamwoord
      ( HEEFT object=naamwoord | IS description=naamwoord ) // Explicitly handle predicate part of the name
      rolSpecificatie rolSpecificatie+ // Requires at least two roles
    ;

rolSpecificatie
    : voorzetselSpecificatie identifier
    ;

// --- RegelSpraak Rule Structure (§13.4.2) ---
regel
    : REGEL name+=IDENTIFIER+
      regelVersie
      resultaatDeel ( voorwaardeDeel DOT? | DOT )? // Adjusted termination logic
      ( variabeleDeel )? // Optional variable block
    ;

regelVersie
    : GELDIG versieGeldigheid
    ;

versieGeldigheid
    : ALTIJD
    | VANAF datumLiteral ( (TM | TOT_EN_MET) datumLiteral )?
    ;

// §13.4.3 Resultaat Deel (Simplified in original G4)
resultaatDeel
    : (attribuutReferentie | onderwerpReferentie) ( WORDT_BEREKEND_ALS expressie | WORDT_GESTELD_OP expressie ) // Removed DOT?
    | onderwerpReferentie (IS | HEEFT) kenmerkNaam // Removed DOT?
    // Specific result types like gelijkstelling, kenmerkToekenning, etc. are merged here in the simplified G4
    ;

// §13.4.12 Voorwaarde Deel (Simplified in original G4)
voorwaardeDeel
    : INDIEN ( expressie | toplevelSamengesteldeVoorwaarde ) // Allows simple expression or complex structure
    ;

// §13.4.2 Variabele Deel
variabeleDeel // Use single token
    : DAARBIJ_GELDT
      variabeleToekenning* // Changed to * to allow zero or more
      DOT
    ;

variabeleToekenning
    : naamwoord IS expressie SEMICOLON?
    ;

// --- RegelSpraak Onderwerpketen (§13.4.1) & References ---

// §13.4.1 Onderwerpketen (Simplified/Combined References in original G4)
onderwerpReferentie // Allow sequence + nesting + pronoun
    : basisOnderwerp ( voorzetsel basisOnderwerp )* // Allow any voorzetsel for nesting
    ;

basisOnderwerp // Base unit for subject/object reference
    : (DE | HET | EEN | ZIJN)? IDENTIFIER+ // Added ZIJN
    | HIJ
    ;

attribuutReferentie // Combination of spec 13.4.1.9 and reference structure
    : naamwoord VAN onderwerpReferentie // Relies on onderwerpReferentie for nesting
    ;

kenmerkNaam : onderwerpReferentie ; // Reuse onderwerpReferentie structure (as per original G4)

// Rule for bezieldeReferentie (Simplified from spec 13.4.16.37 for ZIJN case)
bezieldeReferentie // Used in primaryExpression
    : ZIJN identifier
    ;

// --- RegelSpraak Condition Parts (§13.4.13 - §13.4.14) (Simplified in original G4) ---

// §13.4.13 Samengestelde voorwaarde (Simplified structure)
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

// §13.4.14 Elementaire voorwaarde (Simplified)
elementaireVoorwaarde
    : voorwaardeVergelijking
    ;

// §13.4.14.50 VoorwaardeVergelijking (Simplified)
voorwaardeVergelijking
    : objectVergelijking
    | getalVergelijking
    ;

// Specific comparison types for the test case (Simplified)
objectVergelijking // Corresponds partly to 13.4.14.63/64/96/97
    : onderwerpReferentie IS identifier // E.g., zijn reis is duurzaam
    ;

getalVergelijking // Corresponds partly to 13.4.14.51/53/75/76
    : (naamwoord | attribuutReferentie | bezieldeReferentie) (IS_GROTER_OF_GELIJK_AAN | GROTER_DAN | IS_GROTER_DAN) NUMBER // Added naamwoord, limited operators
    ;

// --- RegelSpraak Expressions (§13.4.15, §13.4.16) (Simplified / Refactored in original G4) ---

expressie
    : comparisonExpression // Top level of expression starts with comparison (or additive if no comparison)
    ;

comparisonExpression
    : left=additiveExpression ( comparisonOperator right=additiveExpression )?
    ;

comparisonOperator // Limited set from original G4
    : GELIJK_AAN | ONGELIJK_AAN
    | GROTER_DAN | GROTER_OF_GELIJK_AAN
    | KLEINER_DAN | KLEINER_OF_GELIJK_AAN
    | KLEINER_IS_DAN // Note: Potential overlap/ambiguity with other operators? Check spec/lexer.
    | IS // Used in boolean contexts?
    | LATER_DAN | LATER_OF_GELIJK_AAN // Date operators
    | EERDER_DAN | EERDER_OF_GELIJK_AAN // Date operators
    | NIET // Unary negation - position might need checking based on full spec
    ;

additiveExpression
    : left=multiplicativeExpression ( additiveOperator right=multiplicativeExpression )*
    ;

additiveOperator : PLUS | MIN | VERMINDERD_MET ; // Limited set

multiplicativeExpression // New rule for higher precedence
    : left=powerExpression ( multiplicativeOperator right=powerExpression )*
    ;

multiplicativeOperator : MAAL | GEDEELD_DOOR | GEDEELD_DOOR_ABS ; // New rule for operators

powerExpression // New rule for exponentiation
    : left=primaryExpression ( powerOperator right=primaryExpression )*
    ;

powerOperator : TOT_DE_MACHT ; // New rule for operator

primaryExpression : // Corresponds roughly to terminals/functions/references in §13.4.16
    // Functions (Simplified subset)
      ABSOLUTE_TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?  # AbsTijdsduurFuncExpr
    | TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?            # TijdsduurFuncExpr
    | SOM_VAN (ALLE? onderwerpReferentie)                                                             # SomFuncExpr
    | NUMBER (PERCENT_SIGN | p=IDENTIFIER) VAN primaryExpression                                    # PercentageFuncExpr
    | primaryExpression afronding                                                                   # AfrondingExpr  // EBNF 13.4.16.21
    | primaryExpression COMMA begrenzing                                                            # BegrenzingExpr // EBNF 13.4.16.23

    // Added for §13.4.16 functions
    | WORTEL_VAN expressie                                          # WortelFuncExpr // EBNF 13.4.16.13 (Simplified, no rounding yet)
    | ABSOLUTE_WAARDE_VAN LPAREN expressie RPAREN                   # AbsValFuncExpr // EBNF 13.4.16.17
    | MINIMALE_WAARDE_VAN expressie (COMMA expressie)* EN expressie # MinValFuncExpr // EBNF 13.4.16.15
    | MAXIMALE_WAARDE_VAN expressie (COMMA expressie)* EN expressie # MaxValFuncExpr // EBNF 13.4.16.16
    | HET JAAR UIT expressie                                        # JaarUitFuncExpr // EBNF 13.4.16.18
    | DE MAAND UIT expressie                                        # MaandUitFuncExpr // EBNF 13.4.16.19
    | DE DAG UIT expressie                                          # DagUitFuncExpr // EBNF 13.4.16.20
    | DE_DATUM_MET LPAREN expressie COMMA expressie COMMA expressie RPAREN  # DatumMetFuncExpr // EBNF 13.4.16.31
    | EERSTE_PAASDAG_VAN LPAREN expressie RPAREN                    # PasenFuncExpr // EBNF 13.4.16.32
    | primaryExpression (PLUS | MIN) expressie identifier           # DateCalcExpr // EBNF 13.4.16.33

    // References
    | attribuutReferentie                                           # AttrRefExpr
    | bezieldeReferentie                                            # BezieldeRefExpr
    | naamwoord                                                     # NaamwoordExpr // Simple noun phrase as expression?
    | parameterMetLidwoord                                          # ParamRefExpr // Added based on spec §13.4.16.1 - check original G4

    // Literals & Keywords
    | REKENDATUM                                                    # RekendatumKeywordExpr
    | identifier                                                    # IdentifierExpr // Bare identifier as expression?
    | NUMBER                                                        # NumberLiteralExpr
    | STRING_LITERAL                                                # StringLiteralExpr
    | datumLiteral                                                  # DatumLiteralExpr // Added DATE_TIME_LITERAL via datumLiteral rule
    | WAAR                                                          # BooleanTrueLiteralExpr
    | ONWAAR                                                        # BooleanFalseLiteralExpr
    | HIJ                                                           # PronounExpr // Pronoun reference

    // Grouping
    | LPAREN expressie RPAREN                                       # ParenExpr
    ;

// EBNF 13.4.16.22 Afronding
afronding
    : (NAAR_BENEDEN | NAAR_BOVEN | REKENKUNDIG | RICHTING_NUL | WEG_VAN_NUL) AFGEROND_OP NUMBER DECIMALEN
    ;

// EBNF 13.4.16.24-.26 Begrenzing
begrenzing
    : begrenzingMinimum
    | begrenzingMaximum
    | begrenzingMinimum EN begrenzingMaximum
    ;

begrenzingMinimum
    : MET_EEN_MINIMUM_VAN expressie
    ;

begrenzingMaximum
    : MET_EEN_MAXIMUM_VAN expressie
    ;

// §13.3.10 Dagsoort Definition (Added based on spec)
dagsoortDefinition
    : DAGSOORT naamwoord SEMICOLON?
    ;

// Note: Many specific function calls (wortel, macht, etc.) and expression types
// from §13.4.16 are not present in the simplified original G4 provided.
// The refactored expression structure (comparison -> additive -> primary)
// handles basic precedence.
// Note: While functions like wortel, abs, date extraction, min/max, rounding, date creation and sum have been added,
// some other specific function calls
// and expression types from §13.4.16 are still not explicitly handled.
// The refactored expression structure (comparison -> additive -> primary)
// handles basic operator precedence for the implemented operators.