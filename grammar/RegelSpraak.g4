grammar RegelSpraak;

options { tokenVocab=RegelSpraakLexer; }

// --- Start Rule ---
regelSpraakDocument // Top level container
    : ( definitie | regel | regelGroep | beslistabel | consistentieregel | eenheidsysteemDefinition )* EOF
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
    : BESLISTABEL naamwoord ( regelVersie )? beslistabelTable
    ;

// Decision table structure
beslistabelTable
    : beslistabelHeader beslistabelSeparator beslistabelRow+
    ;

// Header row with column titles
beslistabelHeader
    : PIPE PIPE? resultColumn=beslistabelColumnText PIPE conditionColumns+=beslistabelColumnText (PIPE conditionColumns+=beslistabelColumnText)* PIPE?
    ;

// Separator line with dashes
beslistabelSeparator
    : PIPE? (MINUS+ PIPE?)+ MINUS*
    ;

// Data row with row number and values
beslistabelRow
    : PIPE rowNumber=NUMBER PIPE resultExpression=expressie PIPE conditionValues+=beslistabelCellValue (PIPE conditionValues+=beslistabelCellValue)* PIPE?
    ;

// Cell value can be expression or n.v.t.
beslistabelCellValue
    : expressie
    | NVT
    ;

// Column header text - everything except pipe
beslistabelColumnText
    : ~(PIPE)+
    ;

// --- Basic Building Blocks ---
identifier
    : IDENTIFIER
    ;

// Rule for tokens that can be used as identifiers in certain contexts
identifierOrKeyword
    : IDENTIFIER
    | DAG        // "dag" - commonly used in "een dag"
    | DAGEN      // "dagen" - can be part of attribute names
    | MAAND      // "maand" - used in date expressions
    | JAAR       // "jaar" - used in date expressions
    | AANTAL     // "aantal" - can be part of names
    | PERIODE    // "periode" - can be an attribute name
    | REGEL      // "regel" - can be referenced
    | VOORWAARDE // "voorwaarde" - can be part of rule names
    | HEEFT      // "heeft" - can appear in feittype names
    | ALLE       // "alle" - can appear in rule names
    | INCONSISTENT // "inconsistent" - can appear in consistency rule names
    | IS         // "is" - can be part of kenmerk names like "is met vakantie"
    | KWARTAAL   // "kwartaal" - can be part of attribute names like "kwartaal bedrag"
    | METER      // "meter" - can be part of object type names like "een meter"
    | EEN_TELWOORD    // "één" - numeric word for dimension labels
    | TWEE_TELWOORD   // "twee" - numeric word for dimension labels
    | DRIE_TELWOORD   // "drie" - numeric word for dimension labels
    | VIER_TELWOORD   // "vier" - numeric word for dimension labels
    | OUDER      // "ouder" - for patterns like "65 jaar of ouder"
    ;

// Rule for contexts where IS should not be treated as an identifier
identifierOrKeywordNoIs
    : IDENTIFIER
    | DAG        // "dag" - commonly used in "een dag"
    | DAGEN      // "dagen" - can be part of attribute names
    | MAAND      // "maand" - used in date expressions
    | JAAR       // "jaar" - used in date expressions
    | AANTAL     // "aantal" - can be part of names
    | PERIODE    // "periode" - can be an attribute name
    | REGEL      // "regel" - can be referenced
    | VOORWAARDE // "voorwaarde" - can be part of rule names
    | HEEFT      // "heeft" - can appear in feittype names
    | ALLE       // "alle" - can appear in regel names
    | INCONSISTENT // "inconsistent" - can appear in consistency rule names
    | KWARTAAL   // "kwartaal" - can be part of attribute names like "kwartaal bedrag"
    | METER      // "meter" - can be part of object type names like "een meter"
    | EEN_TELWOORD    // "één" - numeric word for dimension labels
    | TWEE_TELWOORD   // "twee" - numeric word for dimension labels
    | DRIE_TELWOORD   // "drie" - numeric word for dimension labels
    | VIER_TELWOORD   // "vier" - numeric word for dimension labels
    | OUDER      // "ouder" - for patterns like "65 jaar of ouder"
    ;

naamPhrase // Used within naamwoord
    : (DE | HET | EEN | ZIJN)? identifierOrKeyword+
    | identifierOrKeyword+ // Allow all identifiers (covers capitalized Het, De, etc.)
    | NIEUWE identifierOrKeyword+ // Allow 'nieuwe' in names
    | NIEUWE identifierOrKeyword+ MET identifierOrKeyword+ // Allow 'nieuwe X met Y' pattern in rule names
    | identifierOrKeyword+ MET identifierOrKeyword+ // Allow 'X met Y' pattern in rule names
    | NIET identifierOrKeyword+ // Allow 'niet X' pattern
    | HET AANTAL DAGEN IN identifierOrKeyword+ // Special case for "het aantal dagen in X" as attribute name
    ;

naamPhraseWithNumbers // Used for kenmerk/attribute names that can contain numbers
    : (DE | HET | EEN | ZIJN)? identifierOrKeywordWithNumbers+
    | identifierOrKeywordWithNumbers+ // Allow all identifiers (covers capitalized Het, De, etc.)
    | NIEUWE identifierOrKeywordWithNumbers+ // Allow 'nieuwe' in names
    | NIEUWE identifierOrKeywordWithNumbers+ MET identifierOrKeywordWithNumbers+ // Allow 'nieuwe X met Y' pattern in rule names
    | identifierOrKeywordWithNumbers+ MET identifierOrKeywordWithNumbers+ // Allow 'X met Y' pattern in rule names
    | NIET identifierOrKeywordWithNumbers+ // Allow 'niet X' pattern
    | HET AANTAL DAGEN IN identifierOrKeywordWithNumbers+ // Special case for "het aantal dagen in X" as attribute name
    ;

identifierOrKeywordWithNumbers
    : identifierOrKeyword
    | NUMBER     // Allow numbers in kenmerk/attribute names
    ;

naamPhraseNoIs // Used for object type names where IS should not be included
    : (DE | HET | EEN | ZIJN)? identifierOrKeywordNoIs+
    | identifierOrKeywordNoIs+ // Allow all identifiers (covers capitalized Het, De, etc.)
    | NIEUWE identifierOrKeywordNoIs+ // Allow 'nieuwe' in names
    | NIEUWE identifierOrKeywordNoIs+ MET identifierOrKeywordNoIs+ // Allow 'nieuwe X met Y' pattern in rule names
    | identifierOrKeywordNoIs+ MET identifierOrKeywordNoIs+ // Allow 'X met Y' pattern in rule names
    | NIET identifierOrKeywordNoIs+ // Allow 'niet X' pattern
    ;

naamwoord // Modified to handle structure like 'phrase (preposition phrase)*'
    : naamPhrase ( voorzetsel naamPhrase )*
    ;

naamwoordWithNumbers // For kenmerk/attribute names that can contain numbers
    : naamPhraseWithNumbers ( voorzetsel naamPhraseWithNumbers )*
    ;

naamwoordNoIs // Used for object type names
    : naamPhraseNoIs ( voorzetsel naamPhraseNoIs )*
    ;

voorzetsel // Used by naamwoord and onderwerpReferentie
    : VAN | IN | VOOR | OVER | OP | BIJ | UIT | TOT | EN | MET
    | OF         // Add OF for "of ouder" patterns
    | TOT_EN_MET // Add for "18 tot en met 24" patterns  
    ;

datumLiteral : DATE_TIME_LITERAL ;

unit // Simple unit name
    : IDENTIFIER
    ;

timeUnit // Time units for date arithmetic
    : DAG | DAGEN | MAAND | MAANDEN | JAAR | JAREN | WEEK | WEKEN 
    | UUR | UREN | MINUUT | MINUTEN | SECONDE | SECONDEN
    ;

// --- GegevensSpraak Definitions (§13.3) ---

// §13.3.1 Object Type Definition
objectTypeDefinition
    : OBJECTTYPE naamwoordNoIs ( MV_START plural+=IDENTIFIER+ RPAREN )? (BEZIELD)?
      ( objectTypeMember )*
    ;

objectTypeMember
    : ( kenmerkSpecificatie | attribuutSpecificatie ) SEMICOLON
    ;

// §13.3.2 Kenmerk Specificatie
kenmerkSpecificatie
    : (IS? identifier | naamwoordWithNumbers) KENMERK (BIJVOEGLIJK | BEZITTELIJK)? tijdlijn?
    ;

// §13.3.2 Attribuut Specificatie
attribuutSpecificatie
    : naamwoordWithNumbers ( datatype | domeinRef | objectTypeRef )
      (MET_EENHEID unitIdentifier)?
      (GEDIMENSIONEERD_MET dimensieRef (EN dimensieRef)*)?
      tijdlijn? 
    ;

// §13.3.3 Datatypes
datatype
    : numeriekDatatype
    | tekstDatatype
    | booleanDatatype
    | datumTijdDatatype
    | lijstDatatype
    | percentageDatatype
    ;

lijstDatatype
    : LIJST VAN datatype
    ;

numeriekDatatype
    : NUMERIEK ( LPAREN getalSpecificatie RPAREN )?
    ;

tekstDatatype
    : TEKST
    ;

percentageDatatype
    : PERCENTAGE ( LPAREN getalSpecificatie RPAREN )?
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
    : DOMEIN name=IDENTIFIER IS_VAN_HET_TYPE domeinType (MET_EENHEID eenheidExpressie )? SEMICOLON?
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
    : name=IDENTIFIER
    ;

objectTypeRef // Reference to an object type (for object-type attributes)
    : IDENTIFIER  // Will be validated in semantic analysis
    ;

// §13.3.5 Eenheden & Eenheidsysteem (Added based on spec)
eenheidsysteemDefinition
    : EENHEIDSYSTEEM name=identifier // Standard identifier for system name
      eenheidEntry*
    ;

eenheidEntry
    : DE unitName=unitIdentifier 
      (MV_START pluralName=unitIdentifier RPAREN)?  // Optional plural form
      abbrev=unitIdentifier // abbreviation  
      symbol=unitIdentifier? // optional symbol like € or °C
      (EQUALS (SLASH)? value=NUMBER targetUnit=unitIdentifier)? // conversion spec with optional fraction
    ;

// New rule to allow keywords or identifiers as units
unitIdentifier
    : IDENTIFIER
    | METER | KILOGRAM | SECONDE | MINUUT | MINUTEN | UUR | UREN | VOET | POND | MIJL // Keywords
    | M | KG | S | FT | LB | MIN | MI // Abbreviations + Keyword MIN
    | EURO_SYMBOL | DOLLAR_SYMBOL | DEGREE_SYMBOL
    | DAG | DAGEN | MAAND | MAANDEN | JAAR | JAREN | WEEK | WEKEN // Time units
    | SECONDEN // Additional time units
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
    : NUMBER DOT dimWaarde=naamwoord // Using NUMBER for the digit(s), naamwoord for multi-word labels
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
      ( IS expressie )?
      tijdlijn? SEMICOLON
    ;

parameterNamePhrase // Dedicated rule for parameter names - allow prepositions for spec compliance
    : (DE | HET)? parameterNamePart (voorzetsel parameterNamePart)* // Allow prepositions in parameter names
    ;

parameterNamePart
    : (IDENTIFIER | AANTAL | NUMBER)+  // Allow multiple consecutive identifiers/numbers
    ;

parameterMetLidwoord // Used within expression - allow complex parameter names
    : (DE | HET)? parameterNamePart (voorzetsel parameterNamePart)*  // Match parameter name structure
    | naamwoord  // Fallback to simple naamwoord
    ;

// §13.3.9 FeitType Definition (Based on spec §3.11)
feitTypeDefinition
    : FEITTYPE feittypenaam=naamwoord
      rolDefinition rolDefinition+
      cardinalityLine
    | WEDERKERIG_FEITTYPE feittypenaam=naamwoord  
      rolDefinition
      cardinalityLine
    ;

// Role definition - parse all content after article and split in builder
rolDefinition
    : article=(DE | HET) content=rolContentWords (MV_START meervoud=naamwoord RPAREN)? objecttype=rolObjectType?
    ;

// Object type that comes after optional plural - just identifiers
rolObjectType
    : identifierOrKeyword+
    ;

// All words in role definition after the article
rolContentWords
    : ( identifierOrKeyword | voorzetsel )+
    ;

// Cardinality description is a sentence describing the relationship
// It should contain relationship words but not start a new definition
cardinalityLine
    : cardinalityWord+
    ;

cardinalityWord
    : ~(OBJECTTYPE | PARAMETER | REGEL | FEITTYPE | WEDERKERIG_FEITTYPE | DIMENSIE | DOMEIN | BESLISTABEL | CONSISTENTIEREGEL | EENHEIDSYSTEEM | DAGSOORT | SEMICOLON)
    ;

// --- RegelSpraak Rule Structure (§13.4.2) ---
regel
    : REGEL regelName NUMBER?
      regelVersie
      resultaatDeel ( voorwaardeDeel DOT? | DOT )? // Adjusted termination logic
      ( variabeleDeel )? // Optional variable block
    ;

// --- RegelGroep Structure (§9.9) ---
regelGroep
    : REGELGROEP naamwoord isRecursive=IS_RECURSIEF?
      ( regel | consistentieregel )+
    ;

// Allow flexible rule naming for our tests
regelName
    : naamwoordWithNumbers ( regelNameExtension )*
    ;

// Additional parts that can appear in rule names after the initial naamwoord
regelNameExtension
    : IN_GELIJKE_DELEN
    | COMMA naamwoordWithNumbers
    | COMMA MET naamwoordWithNumbers
    | EN naamwoordWithNumbers
    | IS naamwoordWithNumbers
    | GEEN naamwoordWithNumbers IS
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
    : EEN DAG IS EEN naamwoord                                                        # DagsoortdefinitieResultaat
    | attribuutReferentie ( WORDT_BEREKEND_ALS expressie | WORDT_GESTELD_OP expressie | WORDT_GEINITIALISEERD_OP expressie ) periodeDefinitie? # GelijkstellingResultaat
    | attribuutReferentie MOET consistencyOperator expressie                          # ConsistencyCheckResultaat
    | feitCreatiePattern # FeitCreatieResultaat
    | onderwerpReferentie (IS | HEEFT) kenmerkNaam periodeDefinitie?                  # KenmerkFeitResultaat
    | onderwerpReferentie HEEFT (DE | HET) naamwoord MET attribuutReferentie (GELIJK_AAN | IS_GELIJK_AAN | GELIJK_IS_AAN) expressie # RelationshipWithAttributeResultaat
    | objectCreatie                                                                    # ObjectCreatieResultaat
    | verdelingResultaat                                                               # Verdeling
    ;

consistencyOperator
    : ONGELIJK_ZIJN_AAN
    | ONGELIJK_AAN
    | IS_ONGELIJK_AAN
    | GELIJK_AAN
    | IS_GELIJK_AAN
    | GROTER_DAN
    | IS_GROTER_DAN
    | KLEINER_DAN
    | IS_KLEINER_DAN
    ;

// FeitCreatie pattern - parse the whole pattern as one unit
// Looking for: Een X van Y is een Z van W
feitCreatiePattern
    : EEN role1=feitCreatieRolPhrase VAN EEN subject1=feitCreatieSubjectPhrase
      IS article2=(EEN|DE|HET) role2=feitCreatieRolPhrase VAN article3=(EEN|DE|HET) subject2=feitCreatieSubjectPhrase
    ;

// Role phrase in FeitCreatie - everything up to "van"
feitCreatieRolPhrase
    : feitCreatieWord+
    ;

// Subject phrase in FeitCreatie - all words until end of FeitCreatie or period
feitCreatieSubjectPhrase
    : feitCreatieSubjectWord+
    ;

// Words that can appear in subject - anything except IS (which starts the right side)
feitCreatieSubjectWord
    : identifierOrKeyword
    | voorzetsel
    | DE | HET | EEN
    ;

// Words that can appear in role/subject names
feitCreatieWord
    : identifierOrKeyword
    | voorzetselNietVan
    ;

voorzetselNietVan
    : IN | VOOR | OVER | OP | BIJ | UIT | TOT | EN | MET
    ;

// Object creation rule based on 13.4.6 in reference
objectCreatie
    : ER_WORDT_EEN_NIEUW objectType=naamwoord AANGEMAAKT objectAttributeInit? DOT?
    | CREEER EEN NIEUWE objectType=naamwoord objectAttributeInit? DOT?
    ;

// Attribute initialization during object creation
// Use simpleNaamwoord to avoid ambiguity when attribute name and expression both start with articles
objectAttributeInit
    : MET attribuut=simpleNaamwoord waarde=expressie attributeInitVervolg*
    ;

attributeInitVervolg
    : EN attribuut=simpleNaamwoord waarde=expressie
    ;

// Simple naamwoord without prepositions for unambiguous attribute names
simpleNaamwoord
    : naamPhrase
    ;


// --- Consistentieregel Structure ---
consistentieregel
    : CONSISTENTIEREGEL naamwoord
      ( uniekzijnResultaat
      | inconsistentResultaat ( voorwaardeDeel DOT? | DOT )? )
    ;

// Specific result types for consistentieregel
uniekzijnResultaat
    : alleAttributenVanObjecttype MOETEN_UNIEK_ZIJN DOT?
    ;

// Pattern for "de attributen van alle ObjectType"
alleAttributenVanObjecttype
    : DE naamwoord VAN ALLE naamwoord
    ;

inconsistentResultaat
    : (DE | HET | ER)? naamwoord IS_INCONSISTENT
    ;

// §13.4.12 Voorwaarde Deel
voorwaardeDeel
    : INDIEN ( expressie | toplevelSamengesteldeVoorwaarde ) // Restore complex conditions, keep simple ones in expressie
    ;

// §10.2 Samengestelde Voorwaarde (Compound Conditions)
toplevelSamengesteldeVoorwaarde
    : ER_AAN voorwaardeKwantificatie (VOLGENDE_VOORWAARDEN | VOLGENDE_VOORWAARDE) WORDT_VOLDAAN COLON
      samengesteldeVoorwaardeOnderdeel+
    | (onderwerpReferentie | HIJ | HET | ER) AAN voorwaardeKwantificatie (VOLGENDE_VOORWAARDEN | VOLGENDE_VOORWAARDE) VOLDOET COLON
      samengesteldeVoorwaardeOnderdeel+
    | (onderwerpReferentie | HIJ | HET | ER) VOLDOET AAN voorwaardeKwantificatie (VOLGENDE_VOORWAARDEN | VOLGENDE_VOORWAARDE) COLON
      samengesteldeVoorwaardeOnderdeel+
    ;

voorwaardeKwantificatie
    : ALLE
    | GEEN_VAN_DE
    | (TEN_MINSTE | TENMINSTE) (NUMBER | EEN | EEN_TELWOORD | TWEE_TELWOORD | DRIE_TELWOORD | VIER_TELWOORD) VAN DE
    | TEN_HOOGSTE (NUMBER | EEN | EEN_TELWOORD | TWEE_TELWOORD | DRIE_TELWOORD | VIER_TELWOORD) VAN DE
    | PRECIES (NUMBER | EEN | EEN_TELWOORD | TWEE_TELWOORD | DRIE_TELWOORD | VIER_TELWOORD) VAN DE
    ;

samengesteldeVoorwaardeOnderdeel
    : bulletPrefix ( elementaireVoorwaarde | genesteSamengesteldeVoorwaarde )
    ;

bulletPrefix
    : ( MINUS | DOUBLE_DOT | BULLET | ASTERISK )+
    ;

elementaireVoorwaarde
    : expressie  // Simple conditions are just expressions
    ;

genesteSamengesteldeVoorwaarde
    : (onderwerpReferentie | HIJ | ER) VOLDOET AAN voorwaardeKwantificatie (VOLGENDE_VOORWAARDEN | VOLGENDE_VOORWAARDE) COLON
      samengesteldeVoorwaardeOnderdeel+
    ;

// --- RegelSpraak Onderwerpketen (§13.4.1) & References ---

// §13.4.1 Onderwerpketen (Simplified/Combined References in original G4)
onderwerpReferentie // Allow sequence + nesting + pronoun + subselectie
    : onderwerpBasis ( (DIE | DAT) predicaat )? // Optional filtering with predicaat
    ;

onderwerpReferentieWithNumbers // Variant that allows numbers in kenmerk names
    : onderwerpBasisWithNumbers ( (DIE | DAT) predicaat )? // Optional filtering with predicaat
    ;

onderwerpBasis // Base onderwerp without subselectie to avoid left recursion
    : basisOnderwerp ( voorzetsel basisOnderwerp )* // Allow any voorzetsel for nesting
    ;

onderwerpBasisWithNumbers // Base onderwerp that allows numbers
    : basisOnderwerpWithNumbers ( voorzetsel basisOnderwerpWithNumbers )* // Allow any voorzetsel for nesting
    ;

basisOnderwerp // Base unit for subject/object reference
    : (DE | HET | EEN | ZIJN | ALLE)? identifierOrKeyword+
    | HIJ
    ;

basisOnderwerpWithNumbers // Base unit that allows numbers  
    : (DE | HET | EEN | ZIJN | ALLE | IS)? identifierOrKeywordWithNumbers+
    | HIJ
    ;

attribuutReferentie // According to spec: attribuutmetlidwoord "van" onderwerpketen
    : attribuutMetLidwoord VAN onderwerpReferentie // Simple attribute + "van" + complex subject chain
    ;

attribuutMetLidwoord // Simple attribute name with optional article
    : naamwoord
    ;

kenmerkNaam 
    : kenmerkPhrase                    // Allow complex kenmerk names with prepositions
    | onderwerpReferentieWithNumbers  // Allow kenmerk names with numbers
    | onderwerpReferentie              // Fallback to regular onderwerp reference
    ;

kenmerkPhrase  // Handle complex kenmerk names like "in het hoogseizoen"
    : voorzetsel? (DE | HET | EEN)? identifierOrKeywordWithNumbers+
    ;

// Rule for bezieldeReferentie (Simplified from spec 13.4.16.37 for ZIJN case)
bezieldeReferentie // Used in primaryExpression
    : ZIJN naamwoord
    ;

// --- Predicaat Rules (§5.6 and §13.4.14) ---
predicaat
    : elementairPredicaat
    | samengesteldPredicaat
    ;

elementairPredicaat
    : attribuutVergelijkingsPredicaat  // Check this before objectPredicaat
    | objectPredicaat
    | getalPredicaat
    | tekstPredicaat  
    | datumPredicaat
    ;

// Object predicaat for kenmerk/role checks
objectPredicaat
    : eenzijdigeObjectVergelijking
    // | tweezijdigeObjectVergelijking // Deferred for minimal implementation
    ;

eenzijdigeObjectVergelijking
    : EEN? (kenmerkNaam | rolNaam) (ZIJN | HEBBEN)
    ;

rolNaam : naamwoord ; // Role name is similar to kenmerk name

// Attribute comparison predicaat (e.g., "een leeftijd hebben kleiner dan 18")
attribuutVergelijkingsPredicaat
    : EEN? attribuutNaam=naamwoord HEBBEN comparisonOperator expressie
    ;

// Comparison predicates
getalPredicaat
    : getalVergelijkingsOperatorMeervoud getalExpressie
    ;

tekstPredicaat
    : tekstVergelijkingsOperatorMeervoud tekstExpressie
    ;

datumPredicaat
    : datumVergelijkingsOperatorMeervoud datumExpressie
    ;

// Samengesteld predicaat for compound conditions
samengesteldPredicaat
    : AAN voorwaardeKwantificatie VOLGENDE (VOORWAARDE | VOORWAARDEN) (VOLDOET | VOLDOEN) COLON
      samengesteldeVoorwaardeOnderdeelInPredicaat+
    ;

samengesteldeVoorwaardeOnderdeelInPredicaat
    : bulletPrefix elementaireVoorwaardeInPredicaat
    | bulletPrefix genesteSamengesteldeVoorwaardeInPredicaat
    ;

elementaireVoorwaardeInPredicaat
    : vergelijkingInPredicaat
    ;

vergelijkingInPredicaat
    : attribuutReferentie comparisonOperator expressie    // "zijn leeftijd is groter dan 65"
    | onderwerpReferentie eenzijdigeObjectVergelijking    // "hij is een passagier"
    | attribuutReferentie (IS | ZIJN) kenmerkNaam        // "zijn reis is duurzaam"
    ;

genesteSamengesteldeVoorwaardeInPredicaat
    : (VOLDOET | VOLDOEN | WORDT VOLDAAN) AAN voorwaardeKwantificatie VOLGENDE (VOORWAARDE | VOORWAARDEN) COLON
      samengesteldeVoorwaardeOnderdeelInPredicaat+
    ;

// Add comparison operators (meervoud for die/dat context)
getalVergelijkingsOperatorMeervoud
    : ZIJN_GELIJK_AAN
    | ZIJN_ONGELIJK_AAN
    | ZIJN_GROTER_DAN
    | ZIJN_GROTER_OF_GELIJK_AAN
    | ZIJN_KLEINER_DAN
    | ZIJN_KLEINER_OF_GELIJK_AAN
    ;

tekstVergelijkingsOperatorMeervoud
    : ZIJN_GELIJK_AAN
    | ZIJN_ONGELIJK_AAN
    ;

datumVergelijkingsOperatorMeervoud
    : ZIJN_GELIJK_AAN
    | ZIJN_ONGELIJK_AAN
    | ZIJN_LATER_DAN
    | ZIJN_LATER_OF_GELIJK_AAN
    | ZIJN_EERDER_DAN
    | ZIJN_EERDER_OF_GELIJK_AAN
    ;

// Expression types for predicates
getalExpressie : expressie ;
tekstExpressie : expressie ;
datumExpressie : expressie ;


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
    : logicalExpression COMMA begrenzing afronding             # ExprBegrenzingAfronding
    | logicalExpression COMMA begrenzing                       # ExprBegrenzing
    | logicalExpression afronding                              # ExprAfronding
    | logicalExpression                                        # SimpleExpr
    ;

// Logical operators (EN, OF) at expression level
logicalExpression
    : left=comparisonExpression ( op=(EN | OF) right=logicalExpression )? # LogicalExpr
    ;

comparisonExpression
    : subordinateClauseExpression # SubordinateClauseExpr // Try subordinate clauses first (most specific)
    | left=additiveExpression IS naamwoordWithNumbers # IsKenmerkExpr // Try IS kenmerk check - supports complex names with numbers
    | left=additiveExpression HEEFT naamwoordWithNumbers # HeeftKenmerkExpr // Try HEEFT kenmerk check - supports complex names with numbers
    | left=additiveExpression ( comparisonOperator right=additiveExpression )? # BinaryComparisonExpr
    | unaryCondition # UnaryConditionExpr // Try unary conditions after more specific patterns
    | regelStatusCondition # RegelStatusConditionExpr // Integrate rule status checks here
    ;

comparisonOperator // Expanded list
    : GELIJK_AAN | ONGELIJK_AAN | GELIJK_IS_AAN
    | GROTER_DAN | GROTER_OF_GELIJK_AAN
    | KLEINER_DAN | KLEINER_OF_GELIJK_AAN
    | KLEINER_IS_DAN | GROTER_IS_DAN
    | IS // Used in boolean contexts?
    | IN // Collection membership
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

powerOperator : TOT_DE_MACHT | CARET ; // New rule for operator

primaryExpression : // Corresponds roughly to terminals/functions/references in §13.4.16
    // Unary operators
      MIN primaryExpression                                                                         # UnaryMinusExpr
    | MINUS primaryExpression                                                                       # UnaryMinusExpr
    | NIET primaryExpression                                                                        # UnaryNietExpr
    
    // Functions (Simplified subset)
    | DE_ABSOLUTE_TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitIdentifier)?  # AbsTijdsduurFuncExpr
    | TIJDSDUUR_VAN primaryExpression TOT primaryExpression (IN_HELE unitIdentifier)?            # TijdsduurFuncExpr
    | SOM_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression                    # SomFuncExpr // Simple aggregation of comma-separated values
    | SOM_VAN ALLE naamwoord                                                                       # SomAlleExpr // Aggregate all instances of something
    | SOM_VAN ALLE attribuutReferentie                                                            # SomAlleAttribuutExpr // Sum all attributes with filtering
    | HET? AANTAL (ALLE? onderwerpReferentie)                                                         # AantalFuncExpr // Made HET optional
    | HET? AANTAL attribuutReferentie                                                              # AantalAttribuutExpr // Count attributes with filtering
    | (NUMBER (PERCENT_SIGN | p=IDENTIFIER) | PERCENTAGE_LITERAL) VAN primaryExpression            # PercentageFuncExpr
    | primaryExpression afronding                                                                   # AfrondingExpr  // EBNF 13.4.16.21
    | primaryExpression COMMA begrenzing afronding                                                  # BegrenzingAfrondingExpr // Combined begrenzing and afronding
    | primaryExpression COMMA begrenzing                                                            # BegrenzingExpr // EBNF 13.4.16.23
    | CONCATENATIE_VAN primaryExpression (COMMA primaryExpression)* (EN | OF) primaryExpression     # ConcatenatieExpr // EBNF 13.4.16.2
    | primaryExpression (COMMA primaryExpression)+ (EN | OF) primaryExpression                      # SimpleConcatenatieExpr // Simple concatenation without keyword

    // Added for §13.4.16 functions
    | DE_WORTEL_VAN primaryExpression                                          # WortelFuncExpr // EBNF 13.4.16.13 (Simplified, no rounding yet)
    | DE_ABSOLUTE_WAARDE_VAN LPAREN expressie RPAREN                           # AbsValFuncExpr // EBNF 13.4.16.17
    | DE_MINIMALE_WAARDE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression # MinValFuncExpr // EBNF 13.4.16.15
    | DE_MINIMALE_WAARDE_VAN ALLE attribuutReferentie                         # MinAlleAttribuutExpr // Min all attributes with filtering
    | DE_MAXIMALE_WAARDE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression # MaxValFuncExpr // EBNF 13.4.16.16
    | DE_MAXIMALE_WAARDE_VAN ALLE attribuutReferentie                         # MaxAlleAttribuutExpr // Max all attributes with filtering
    | HET JAAR UIT primaryExpression                                        # JaarUitFuncExpr // EBNF 13.4.16.18
    | DE MAAND UIT primaryExpression                                        # MaandUitFuncExpr // EBNF 13.4.16.19
    | DE DAG UIT primaryExpression                                          # DagUitFuncExpr // EBNF 13.4.16.20
    | DE_DATUM_MET LPAREN primaryExpression COMMA primaryExpression COMMA primaryExpression RPAREN  # DatumMetFuncExpr // EBNF 13.4.16.31
    | DE_EERSTE_PAASDAG_VAN LPAREN primaryExpression RPAREN                    # PasenFuncExpr // EBNF 13.4.16.32
    | primaryExpression (PLUS | MIN) primaryExpression timeUnit            # DateCalcExpr // EBNF 13.4.16.33
    | EERSTE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression          # EersteDatumFuncExpr // EBNF 13.4.16.34
    | LAATSTE_VAN primaryExpression (COMMA primaryExpression)* EN primaryExpression         # LaatsteDatumFuncExpr // EBNF 13.4.16.35

    // Added for §13.4.16.45-53 Aggregations & Conditional Expressions
    | HET_TOTAAL_VAN expressie conditieBijExpressie?                               # TotaalVanExpr // EBNF 13.4.16.51
    | HET AANTAL DAGEN IN (DE? MAAND | HET? JAAR) DAT expressie                                       # HetAantalDagenInExpr // Special case
    | identifier+ HET_TOTAAL_VAN expressie conditieBijExpressie?                  # CapitalizedTotaalVanExpr // Special case for "Het totaal van" with capitalization
    | HET_TIJDSEVENREDIG_DEEL_PER (MAAND | JAAR) VAN expressie conditieBijExpressie? # TijdsevenredigDeelExpr
    | identifier+ HET_TIJDSEVENREDIG_DEEL_PER (MAAND | JAAR) VAN expressie conditieBijExpressie? # CapitalizedTijdsevenredigDeelExpr
    // For aggregations like "de som van de te betalen belasting van alle passagiers"
    // We need a special pattern that doesn't use attribuutReferentie since that consumes "van"
    | (getalAggregatieFunctie | datumAggregatieFunctie) attribuutMetLidwoord dimensieSelectie         # DimensieAggExpr // EBNF 13.4.16.45
    // For dimension range aggregations like "de som van zijn betaalde belasting in jaar vanaf vier jaar geleden t/m een jaar geleden"
    | (getalAggregatieFunctie | datumAggregatieFunctie) (bezieldeReferentie | attribuutReferentie) VANAF naamwoord TM naamwoord DOT? # DimensieRangeAggExpr
    
    // Literals & Keywords (moved before references to prioritize literal parsing)
    | NUMBER unitIdentifier?                                        # NumberLiteralExpr
    | REKENDATUM                                                    # RekendatumKeywordExpr
    | identifier                                                    # IdentifierExpr // Bare identifier as expression?
    
    // References (bezieldeReferentie before attribuutReferentie to match pronouns first)
    | bezieldeReferentie                                            # BezieldeRefExpr
    | attribuutReferentie                                           # AttrRefExpr
    | onderwerpReferentie                                           # OnderwerpRefExpr // Added to support "een X" patterns
    | naamwoord                                                     # NaamwoordExpr // Simple noun phrase as expression?
    | parameterMetLidwoord                                          # ParamRefExpr // Added based on spec §13.4.16.1 - check original G4
    | PERCENTAGE_LITERAL                                            # PercentageLiteralExpr
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

// Timeline period definition for rule results
periodeDefinitie
    : VANAF dateExpression                                            # VanafPeriode
    | TOT dateExpression                                              # TotPeriode
    | TOT_EN_MET dateExpression                                       # TotEnMetPeriode
    | VAN dateExpression TOT dateExpression                           # VanTotPeriode
    | VAN dateExpression TOT_EN_MET dateExpression                    # VanTotEnMetPeriode
    ;

// Date expression can be a literal date or a calculated date
dateExpression
    : datumLiteral
    | REKENDATUM
    | REKENJAAR
    | attribuutReferentie  // Allow date attributes like "zijn geboortedatum"
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
// Modified to support both "over" (per EBNF) and "van" (per examples in spec)
dimensieSelectie
    : OVER (aggregerenOverAlleDimensies | aggregerenOverVerzameling | aggregerenOverBereik) DOT
    | VAN aggregerenOverAlleDimensies  // Support "van alle X" pattern from spec examples
    ;

aggregerenOverAlleDimensies
    : ALLE naamwoord ( (DIE | DAT) predicaat )? // Support filtering with predicates
    ;

aggregerenOverVerzameling // EBNF 13.4.16.48 - Using naamwoord for both dimension name and label values
    : DE naamwoord VANAF naamwoord TM naamwoord
    ;

aggregerenOverBereik // EBNF 13.4.16.49 - Using naamwoord for both dimension name and label values
    : DE naamwoord IN LBRACE naamwoord (COMMA naamwoord)* EN naamwoord RBRACE
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
    : REGELVERSIE name=naamwoord IS_GEVUURD # regelStatusGevuurdCheck
    | REGELVERSIE name=naamwoord IS_INCONSISTENT # regelStatusInconsistentCheck
    ;

// Dutch subordinate clause expressions (Subject-Object-Verb order)
subordinateClauseExpression
    : subject=onderwerpReferentie object=naamwoordWithNumbers verb=HEEFT           # SubordinateHasExpr  // hij een recht op korting heeft
    | subject=onderwerpReferentie prepPhrase=naamwoordWithNumbers verb=IS          # SubordinateIsWithExpr  // hij met vakantie is / hij passagier van 65 jaar of ouder is
    | subject=onderwerpReferentie verb=IS kenmerk=naamwoordWithNumbers             # SubordinateIsKenmerkExpr  // hij is minderjarig / hij is passagier van 18 tot en met 24 jaar
    ;

// §13.3.10 Dagsoort Definition (Added based on spec)
dagsoortDefinition
    : DAGSOORT naamwoord ( MV_START plural+=IDENTIFIER+ RPAREN )? SEMICOLON?
    ;

// --- Verdeling Rules (§13.4.10) ---
// Pattern: X wordt verdeeld over Y, waarbij wordt verdeeld: ...
verdelingResultaat
    : sourceAmount=expressie WORDT_VERDEELD_OVER targetCollection=expressie 
      COMMA WAARBIJ_WORDT_VERDEELD (verdelingMethodeSimple | verdelingMethodeMultiLine)
      verdelingRest?
    ;

// Simple single-line format
verdelingMethodeSimple
    : verdelingMethode
    ;

// Multi-line format with colon and bullet points
verdelingMethodeMultiLine
    : COLON verdelingMethodeBulletList DOT?
    ;

verdelingMethodeBulletList
    : verdelingMethodeBullet (verdelingMethodeBullet)*
    ;

verdelingMethodeBullet
    : MINUS verdelingMethode (COMMA | DOT)?
    ;

// Distribution methods and constraints
verdelingMethode
    : IN_GELIJKE_DELEN                                                              # VerdelingGelijkeDelen
    | NAAR_RATO_VAN ratioExpression=expressie                                      # VerdelingNaarRato
    | OP_VOLGORDE_VAN orderDirection=(TOENEMENDE | AFNEMENDE) orderExpression=expressie  # VerdelingOpVolgorde
    | BIJ_EVEN_GROOT_CRITERIUM tieBreakMethod=verdelingMethode                     # VerdelingTieBreak
    | MET_EEN_MAXIMUM_VAN maxExpression=expressie                                  # VerdelingMaximum
    | AFGEROND_OP decimals=NUMBER DECIMALEN roundDirection=(NAAR_BENEDEN | NAAR_BOVEN)  # VerdelingAfronding
    ;

// Remainder handling
verdelingRest
    : ALS_ONVERDEELDE_REST_BLIJFT remainderTarget=expressie OVER_VERDELING?
    ;
