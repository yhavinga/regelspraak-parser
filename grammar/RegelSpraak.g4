grammar RegelSpraak;

options { tokenVocab=RegelSpraakLexer; }

// --- Start Rule ---
regelSpraakDocument // Top level container
    : ( definitie | regel | beslistabel | consistentieregel | eenheidsysteemDefinition )* EOF
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
    : BESLISTABEL naamwoord ( regelVersie )?
    ;

// --- Basic Building Blocks ---
identifier
    : IDENTIFIER
    ;

naamPhrase // Used within naamwoord
    : (DE | HET | ZIJN)? IDENTIFIER+
    | identifier+ // Allow all identifiers (covers capitalized Het, De, etc.)
    | NIEUWE IDENTIFIER+ // Allow 'nieuwe' in names
    | NIEUWE IDENTIFIER+ MET IDENTIFIER+ // Allow 'nieuwe X met Y' pattern in rule names
    | identifier+ MET identifier+ // Allow 'X met Y' pattern in rule names
    | NIET IDENTIFIER+ // Allow 'niet X' pattern
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
      (MET_EENHEID (unitName=IDENTIFIER | PERCENT_SIGN | EURO_SYMBOL | DOLLAR_SYMBOL))?
      (GEDIMENSIONEERD_MET dimensieRef (EN dimensieRef)*)?
      tijdlijn? 
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
    | EURO_SYMBOL | DOLLAR_SYMBOL
    ;

// Eenheid expressions
eenheidExpressie // Corresponds to unit structure in §13.3.3.2/3. Simplified based on original G4 & spec.
    : eenheidMacht ( SLASH eenheidMacht )?
    | NUMBER
    | PERCENT_SIGN // Added % as a unit alternative
    | EURO_SYMBOL | DOLLAR_SYMBOL
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
    : (DE | HET)? (IDENTIFIER | AANTAL)+ // Allow AANTAL token to be used in parameter names
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
    : REGEL regelName NUMBER?
      regelVersie
      resultaatDeel ( voorwaardeDeel DOT? | DOT )? // Adjusted termination logic
      ( variabeleDeel )? // Optional variable block
    ;

// Allow flexible rule naming for our tests
regelName
    : IDENTIFIER+ // Simple rule name
    | naamwoord // General case using the naamwoord pattern for other rule names
    | IDENTIFIER+ KENMERK // Handle "check kenmerk" pattern
    | IDENTIFIER+ ROL // Handle "check rol" pattern
    | IDENTIFIER+ NIET KENMERK // Handle "check niet kenmerk" pattern
    | IDENTIFIER+ NIET ROL // Handle "check niet rol" pattern 
    | IDENTIFIER+ KENMERKEN IDENTIFIER+ // Handle "check kenmerken meervoud" pattern
    | IDENTIFIER+ ROLLEN IDENTIFIER+ // Handle "check rollen meervoud" pattern
    ;

regelVersie
    : GELDIG versieGeldigheid
    ;

versieGeldigheid
    : ALTIJD
    | VANAF datumLiteral ( (TM | TOT_EN_MET) datumLiteral )?
    ;

// §13.4.3 Resultaat Deel
resultaatDeel
    : (naamwoord | attribuutReferentie) ( WORDT_BEREKEND_ALS expressie | WORDT_GESTELD_OP expressie | WORDT_GEINITIALISEERD_OP expressie ) # GelijkstellingResultaat
    | onderwerpReferentie (IS | HEEFT) kenmerkNaam                                                # KenmerkFeitResultaat
    | onderwerpReferentie HEEFT naamwoord (MET | TOT) onderwerpReferentie                       # FeitCreatieResultaat
    | identifier+ ( WORDT_BEREKEND_ALS expressie | WORDT_GESTELD_OP expressie | WORDT_GEINITIALISEERD_OP expressie )                   # CapitalizedGelijkstellingResultaat // For capitalized cases
    | (HET_KWARTAAL | HET_DEEL_PER_MAAND | HET_DEEL_PER_JAAR) identifier* ( WORDT_BEREKEND_ALS expressie | WORDT_GESTELD_OP expressie | WORDT_GEINITIALISEERD_OP expressie ) ( (VANAF | VAN) datumLiteral (TOT | TOT_EN_MET) datumLiteral )? DOT? # SpecialPhraseResultaat
    | HET_AANTAL_DAGEN_IN (MAAND | JAAR) ( WORDT_BEREKEND_ALS expressie | WORDT_GESTELD_OP expressie | WORDT_GEINITIALISEERD_OP expressie ) # AantalDagenInResultaat
    | objectCreatie                                                                    # ObjectCreatieActie
    ;

// Object creation rule based on 13.4.6 in reference
objectCreatie
    : ER_WORDT_EEN_NIEUW objectType=naamwoord AANGEMAAKT objectAttributeInit? DOT?
    | CREEER EEN NIEUWE objectType=naamwoord objectAttributeInit? DOT?
    ;

// Attribute initialization during object creation
objectAttributeInit
    : MET attribuut=naamwoord waarde=expressie attributeInitVervolg*
    ;

attributeInitVervolg
    : EN attribuut=naamwoord waarde=expressie
    ;

// --- Consistentieregel Structure ---
consistentieregel
    : CONSISTENTIEREGEL naamwoord
      ( uniekzijnResultaat
      | inconsistentResultaat ( voorwaardeDeel DOT? | DOT )? )
    ;

// Specific result types for consistentieregel
uniekzijnResultaat
    : onderwerpReferentie MOETEN_UNIEK_ZIJN DOT?
    ;

inconsistentResultaat
    : (DE | HET | ER)? naamwoord IS_INCONSISTENT
    ;

// §13.4.12 Voorwaarde Deel
voorwaardeDeel
    : INDIEN ( expressie | toplevelSamengesteldeVoorwaarde ) // Restore complex conditions, keep simple ones in expressie
    ;

// --- RegelSpraak Onderwerpketen (§13.4.1) & References ---

// §13.4.1 Onderwerpketen (Simplified/Combined References in original G4)
onderwerpReferentie // Allow sequence + nesting + pronoun
    : basisOnderwerp ( voorzetsel basisOnderwerp )* // Allow any voorzetsel for nesting
    ;

basisOnderwerp // Base unit for subject/object reference
    : (DE | HET | EEN | ZIJN)? IDENTIFIER+
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
    : (HIJ | HET | onderwerpReferentie) AAN voorwaardeKwantificatie VOLGENDE_VOORWAARDEN VOLDOET COLON // Added HET as alternative subject
      samengesteldeVoorwaardeOnderdeel
    | ER_AAN voorwaardeKwantificatie VOLGENDE_VOORWAARDEN WORDT_VOLDAAN COLON  // Support "er aan ... wordt voldaan" format with ER_AAN token
      samengesteldeVoorwaardeOnderdeel
    ;

voorwaardeKwantificatie // EBNF 13.4.13.4 (Simplified)
    : ALLE                             // All conditions must apply
    | TENMINSTE (EEN_TELWOORD | TWEE_TELWOORD | DRIE_TELWOORD | VIER_TELWOORD | NUMBER) VAN DE  // Support "tenminste <number> van de"
    ;

samengesteldeVoorwaardeOnderdeel // EBNF 13.4.13.6 (Simplified, with alternative bullets)
    : (BULLET | MINUS | ASTERISK) genesteVoorwaarde ( (BULLET | MINUS | ASTERISK) genesteVoorwaarde )*
    ;

genesteVoorwaarde // EBNF 13.4.13.7 (Simplified)
    : expressie // NEW: Nested conditions are now handled by the expression hierarchy
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

// --- RegelSpraak Expressions (§13.4.15, §13.4.16) --- NOW INCLUDES CONDITIONS

expressie
    : logicalExpression // Start with logical OR/AND (if needed, otherwise comparison)
    ;

// Add logical operators if needed (e.g., EN, OF at condition level)
// logicalExpression
//     : left=comparisonExpression ( op=(EN | OF) right=comparisonExpression )*
//     ;

logicalExpression // For now, just pass through to comparison
    : comparisonExpression
    ;

comparisonExpression
    : left=additiveExpression ( comparisonOperator right=additiveExpression )? # BinaryComparisonExpr
    | unaryCondition # UnaryConditionExpr // Integrate unary conditions here
    | regelStatusCondition # RegelStatusConditionExpr // Integrate rule status checks here
    | left=additiveExpression IS identifier # IsKenmerkExpr // Integrate IS kenmerk check
    | left=additiveExpression HEEFT identifier # HeeftKenmerkExpr // Integrate HEEFT kenmerk check
    ;

comparisonOperator // Expanded list
    : GELIJK_AAN | ONGELIJK_AAN
    | GROTER_DAN | GROTER_OF_GELIJK_AAN
    | KLEINER_DAN | KLEINER_OF_GELIJK_AAN
    | KLEINER_IS_DAN | GROTER_IS_DAN
    | IS // Used in boolean contexts?
    | LATER_DAN | LATER_OF_GELIJK_AAN // Date operators
    | EERDER_DAN | EERDER_OF_GELIJK_AAN // Date operators
    | NIET // Unary negation - position might need checking based on full spec

    // Add phrase tokens
    | IS_GELIJK_AAN | IS_ONGELIJK_AAN | IS_KLEINER_DAN | IS_KLEINER_OF_GELIJK_AAN | IS_GROTER_DAN | IS_GROTER_OF_GELIJK_AAN
    | ZIJN_GELIJK_AAN | ZIJN_ONGELIJK_AAN | ZIJN_KLEINER_DAN | ZIJN_KLEINER_OF_GELIJK_AAN | ZIJN_GROTER_DAN | ZIJN_GROTER_OF_GELIJK_AAN
    | IS_LATER_DAN | IS_LATER_OF_GELIJK_AAN | IS_EERDER_DAN | IS_EERDER_OF_GELIJK_AAN
    | ZIJN_LATER_DAN | ZIJN_LATER_OF_GELIJK_AAN | ZIJN_EERDER_DAN | ZIJN_EERDER_OF_GELIJK_AAN
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
      DE_ABSOLUTE_TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?  # AbsTijdsduurFuncExpr
    | TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitName=IDENTIFIER)?            # TijdsduurFuncExpr
    | SOM_VAN (ALLE? onderwerpReferentie)                                                             # SomFuncExpr
    | HET? AANTAL (ALLE? onderwerpReferentie)                                                         # AantalFuncExpr // Made HET optional
    | NUMBER (PERCENT_SIGN | p=IDENTIFIER) VAN primaryExpression                                    # PercentageFuncExpr
    | primaryExpression afronding                                                                   # AfrondingExpr  // EBNF 13.4.16.21
    | primaryExpression COMMA begrenzing                                                            # BegrenzingExpr // EBNF 13.4.16.23
    | CONCATENATIE_VAN primaryExpression (COMMA primaryExpression)* (EN | OF) primaryExpression     # ConcatenatieExpr // EBNF 13.4.16.2
    | primaryExpression (COMMA primaryExpression)+ (EN | OF) primaryExpression                      # SimpleConcatenatieExpr // Simple concatenation without keyword

    // Added for §13.4.16 functions
    | DE_WORTEL_VAN primaryExpression                                          # WortelFuncExpr // EBNF 13.4.16.13 (Simplified, no rounding yet)
    | DE_ABSOLUTE_WAARDE_VAN LPAREN primaryExpression RPAREN                   # AbsValFuncExpr // EBNF 13.4.16.17
    | DE_MINIMALE_WAARDE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression # MinValFuncExpr // EBNF 13.4.16.15
    | DE_MAXIMALE_WAARDE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression # MaxValFuncExpr // EBNF 13.4.16.16
    | HET JAAR UIT primaryExpression                                        # JaarUitFuncExpr // EBNF 13.4.16.18
    | DE MAAND UIT primaryExpression                                        # MaandUitFuncExpr // EBNF 13.4.16.19
    | DE DAG UIT primaryExpression                                          # DagUitFuncExpr // EBNF 13.4.16.20
    | DE_DATUM_MET LPAREN primaryExpression COMMA primaryExpression COMMA primaryExpression RPAREN  # DatumMetFuncExpr // EBNF 13.4.16.31
    | DE_EERSTE_PAASDAG_VAN LPAREN primaryExpression RPAREN                    # PasenFuncExpr // EBNF 13.4.16.32
    | primaryExpression (PLUS | MIN) primaryExpression identifier           # DateCalcExpr // EBNF 13.4.16.33
    | EERSTE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression          # EersteDatumFuncExpr // EBNF 13.4.16.34
    | LAATSTE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression         # LaatsteDatumFuncExpr // EBNF 13.4.16.35

    // Added for §13.4.16.45-53 Aggregations & Conditional Expressions
    | HET_TOTAAL_VAN expressie (GEDURENDE_DE_TIJD_DAT condition=expressie)?                               # TotaalVanExpr // EBNF 13.4.16.51 - Simplified condition
    | HET_AANTAL_DAGEN_IN (DE MAAND | HET JAAR) DAT expressie                                         # HetAantalDagenInExpr // Special case
    | identifier+ HET_TOTAAL_VAN expressie (GEDURENDE_DE_TIJD_DAT condition=expressie)?                  # CapitalizedTotaalVanExpr // Special case for "Het totaal van" with capitalization - Simplified condition
    | HET_TIJDSEVENREDIG_DEEL_PER (MAAND | JAAR) VAN expressie (GEDURENDE_DE_TIJD_DAT condition=expressie)? # TijdsevenredigDeelExpr // Simplified condition
    | identifier+ HET_TIJDSEVENREDIG_DEEL_PER (MAAND | JAAR) VAN expressie (GEDURENDE_DE_TIJD_DAT condition=expressie)? # CapitalizedTijdsevenredigDeelExpr // Simplified condition
    | (getalAggregatieFunctie | datumAggregatieFunctie) attribuutReferentie dimensieSelectie         # DimensieAggExpr // EBNF 13.4.16.45 (Placeholder for now, needs refinement)
    
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
    | ENUM_LITERAL                                                  # EnumLiteralExpr // Add explicit support for enum literals
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

// EBNF 13.4.16.50 Conditie bij Expressie
conditieBijExpressie // Keep this rule name for clarity? Or inline GEDURENDE_DE_TIJD_DAT?
    : GEDURENDE_DE_TIJD_DAT condition=expressie // Reference expressie directly
    | periodevergelijkingEnkelvoudig // Reuse existing definition if suitable
    ;

// EBNF 13.4.16.67-68 Periode Vergelijking (Non-Toplevel)
periodevergelijkingEnkelvoudig // Reusing/defining for conditieBijExpressie and potential other uses
    : VANAF datumLiteral
    | VAN datumLiteral TOT datumLiteral
    | VAN datumLiteral TOT_EN_MET datumLiteral
    | TOT datumLiteral
    | TOT_EN_MET datumLiteral
    ;

// EBNF 13.4.16.42 Getal Aggregatie Functie
getalAggregatieFunctie
    : HET? AANTAL // Made HET optional
    | DE_MAXIMALE_WAARDE_VAN
    | DE_MINIMALE_WAARDE_VAN
    | SOM_VAN
    ;

// EBNF 13.4.16.44 Datum Aggregatie Functie
datumAggregatieFunctie
    : EERSTE_VAN
    | LAATSTE_VAN
    ;

// EBNF 13.4.16.46-.49 Dimensie Selectie (Placeholders)
dimensieSelectie
    : OVER (aggregerenOverAlleDimensies | aggregerenOverVerzameling | aggregerenOverBereik) DOT
    ;

aggregerenOverAlleDimensies
    : ALLE naamwoord // naamwoord used for meervoud form
    ;

aggregerenOverVerzameling // EBNF 13.4.16.48 - Using naamwoord for meervoud, identifier for waarde
    : DE naamwoord VANAF identifier TM identifier
    ;

aggregerenOverBereik // EBNF 13.4.16.49 - Using naamwoord for meervoud, identifier for waarde
    : DE naamwoord IN LBRACE identifier (COMMA identifier)* EN identifier RBRACE
    ;

// --- New Unary Conditions and Status Checks ---

// Represents unary conditions like 'is leeg', 'voldoet aan...', 'is een dagsoort'
unaryCondition // Now potentially part of comparisonExpression
    : expr=primaryExpression op=(IS_LEEG | IS_GEVULD | VOLDOET_AAN_DE_ELFPROEF | VOLDOET_NIET_AAN_DE_ELFPROEF | ZIJN_LEEG | ZIJN_GEVULD | VOLDOEN_AAN_DE_ELFPROEF | VOLDOEN_NIET_AAN_DE_ELFPROEF) # unaryCheckCondition
    | expr=primaryExpression op=(IS_NUMERIEK_MET_EXACT | IS_NIET_NUMERIEK_MET_EXACT | ZIJN_NUMERIEK_MET_EXACT | ZIJN_NIET_NUMERIEK_MET_EXACT) NUMBER CIJFERS # unaryNumeriekExactCondition
    | expr=primaryExpression op=(IS_EEN_DAGSOORT | ZIJN_EEN_DAGSOORT | IS_GEEN_DAGSOORT | ZIJN_GEEN_DAGSOORT) dagsoort=identifier # unaryDagsoortCondition
    | expr=primaryExpression op=(IS_KENMERK | ZIJN_KENMERK | IS_NIET_KENMERK | ZIJN_NIET_KENMERK) kenmerk=identifier # unaryKenmerkCondition
    | expr=primaryExpression op=(IS_ROL | ZIJN_ROL | IS_NIET_ROL | ZIJN_NIET_ROL) rol=identifier # unaryRolCondition
    | ref=onderwerpReferentie MOETEN_UNIEK_ZIJN # unaryUniekCondition // Specific for 'moeten uniek zijn'
    | expr=primaryExpression IS_INCONSISTENT # unaryInconsistentDataCondition // For 'data is inconsistent'
    ;

// Represents conditions checking the status of a rule
regelStatusCondition // Now potentially part of comparisonExpression
    : REGEL name=naamwoord op=(IS_GEVUURD | IS_INCONSISTENT) # regelStatusCheck
    ;

// §13.3.10 Dagsoort Definition (Added based on spec)
dagsoortDefinition
    : DAGSOORT naamwoord SEMICOLON?
    ;
