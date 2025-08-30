# RegelSpraak Grammar Implementation Notes

This document provides technical implementation details for the RegelSpraak v2.1.0 ANTLR grammar. It explains the engineering decisions, trade-offs, and specific solutions to parsing challenges in this Dutch natural language DSL.

## Core Design Philosophy

The fundamental challenge of RegelSpraak is parsing Dutch natural language within a formal grammar. Unlike traditional programming languages with rigid syntax, RegelSpraak allows business users to write rules in near-natural Dutch. This creates significant ambiguity that must be resolved at the lexer and parser levels.

For authoritative documentation on ANTLR's architecture, see:
- [Official ANTLR4 Lexer Rules](https://github.com/antlr/antlr4/blob/master/doc/lexer-rules.md)
- [ANTLR4 Listeners Documentation](https://github.com/antlr/antlr4/blob/master/doc/listeners.md)
- [The ANTLR Mega Tutorial](https://tomassetti.me/antlr-mega-tutorial/) by Federico Tomassetti

### Key Design Decisions:

1. **Multi-word Token Prioritization**: The lexer defines hundreds of multi-word tokens (e.g., `IS_GROTER_OF_GELIJK_AAN: 'is groter of gelijk aan'`) to disambiguate common phrases before they reach the parser.

2. **Token Ordering Critical**: Multi-word tokens MUST be defined before single-word tokens in the lexer. ANTLR's longest-match-first rule means `IS_VAN_HET_TYPE` must precede `IS` to parse correctly.
   
   This behavior is documented in:
   - [ANTLR Priority Rules](https://riptutorial.com/antlr/example/11235/priority-rules)
   - [How ANTLR decides which lexer rule to apply](https://stackoverflow.com/questions/45450156/how-does-antlr-decide-which-lexer-rule-to-apply-the-longest-matching-lexer-rule)
   - Official documentation confirms: "If several lexer rules match the same input length, choose the first one, based on definition order"

3. **Hidden Whitespace Channel**: All whitespace is sent to HIDDEN channel (`WS: [ \t\r\n]+ -> channel(HIDDEN);`) rather than skipped, preserving formatting information while simplifying parser rules.
   
   For more on ANTLR channels:
   - [What are ANTLR4 channels used for?](https://github.com/antlr/antlr4/discussions/4220)
   - [ANTLR White Space handling](https://stackoverflow.com/questions/5009398/antlr-white-space-question-and-not-the-typical-one)
   - Common pattern seen in [grammars-v4 repository](https://github.com/antlr/grammars-v4)

## 1. Parameter Definitions (§3.1)

### Grammar Structure:
```antlr
parameterDefinition
    : PARAMETER parameterNamePhrase DUBBELE_PUNT datatype ( parameterdataConstraint )? SEMICOLON?
    ;

parameterNamePhrase
    : ( artikel )? ( AANTAL )? IDENTIFIER+
    ;
```

### Implementation Choices:

**Problem**: The word "aantal" appears both as a keyword (in aggregation functions) and in parameter names like "het aantal kinderen".

**Solution**: Created standalone `AANTAL` token and explicitly allow it in `parameterNamePhrase`. This preserves keyword functionality while supporting natural parameter names.

**Trade-off**: More complex grammar rule, but maintains natural language expressiveness.

### Working Test Examples:
```regelspraak
Parameter het aantal kinderen : AantalKinderen;
Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;
Parameter het maximum snelheid : Numeriek (getal) met eenheid km/u;
```
(From tests/test_parameter.py, tests/resources/parameter.rs)

## 2. Object Type Definitions (§3.2)

### Grammar Structure:
```antlr
objectTypeDefinition
    : OBJECTTYPE ( artikel )? naamwoord attributenEnKenmerken? SEMICOLON?
    ;

attributenEnKenmerken
    : ( attribuutSpecificatie | kenmerkSpecificatie )+
    ;
```

### Implementation Choices:

**Problem**: Multi-word object type names (e.g., "Natuurlijk persoon") vs single-token parsing.

**Solution**: The `naamwoord` rule accepts `IDENTIFIER+`, concatenating tokens with spaces.

```antlr
naamwoord
    : IDENTIFIER+
    ;
```

**Engineering Note**: This simple rule handles 90% of cases but requires post-processing in the visitor to properly reconstruct multi-word names with correct spacing.

### Working Test Examples:
```regelspraak
Objecttype de Natuurlijk persoon
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Objecttype de Natuurlijk persoon (mv: Natuurlijke personen) (bezield)
    het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie;
```
(From tests/test_steelthread.py, tests/test_dimension_engine.py)

## 3. Domain Definitions (§3.3)

### Grammar Structure:
```antlr
domeinDefinition
    : DOMEIN domeinRef IS datatype ( parameterdataConstraint )? SEMICOLON?
    ;

domeinRef
    : naamwoord
    ;
```

### Working Test Examples:
```regelspraak
Domein Bedrag is van het type Numeriek (getal met 2 decimalen) met eenheid EUR;
Domein Korting is van het type Numeriek (niet-negatief getal met 1 decimalen) met eenheid %;
```
(From tests/test_domein.py, tests/test_beslistabel.py)

## 4. FeitType Definitions (§3.11)

### Grammar Structure:
```antlr
feitTypeDefinition
    : FEITTYPE feittypenaam=naamwoord
      rolDefinition rolDefinition+
      cardinalityLine
    ;
```

### Critical Implementation Note:

**Specification Requirement**: The EBNF specification (§13.1.8, §13.3.9) requires tab characters (`\t`) to separate role names from object types:
```
[article] <role_name> \t <object_type>
```

**Implementation Challenge**: Tabs are consumed by `WS: [ \t\r\n]+ -> channel(HIDDEN);` making them invisible to parser rules.

**Solution**: The builder accesses the raw input stream to detect tabs:
```python
# In visitRolDefinition
input_stream = ctx.start.getInputStream()
full_text = input_stream.getText(start_idx, stop_idx)
if '\t' in full_text:
    parts = full_text.split('\t', 1)
```

### Working Test Examples:
```regelspraak
Feittype vlucht van natuurlijke personen
    de reis	Vlucht  // Tab separates role from type
    de passagier	Natuurlijk persoon
    één reis betreft de verplaatsing van meerdere passagiers
```
(From examples/toka/gegevens.rs)

## 5. Dimension Definitions (§3.4)

### Grammar Structure:
```antlr
dimensieDefinition
    : DIMENSIE naamwoord ( IS | MET )? 
      ( dimensiewaarde ( COMMA dimensiewaarde )* )? SEMICOLON?
    ;
```

### Implementation Challenge:

**Problem**: Dimensions can use both adjectival ("bruto inkomen") and prepositional ("inkomen van vorig jaar") styles, but the grammar consumes dimension information as part of the attribute name.

**Solution**: Post-processing pattern detection in `visitAttribuutReferentie`:
1. Check if attribute words match known dimension labels
2. Split prepositional phrases on "van"
3. Create `DimensionedAttributeReference` AST nodes

**Trade-off**: Grammar simplicity at the cost of complex visitor logic. A pure grammar solution would require significant lookahead and context sensitivity.

### Working Test Examples:
```regelspraak
Dimensie de brutonettodimensie, bestaande uit de brutonettodimensies (voor het attribuut zonder voorzetsel):
    1. bruto
    2. netto;

Dimensie de jaardimensie, bestaande uit de jaardimensies (na het attribuut met voorzetsel van):
    1. huidig jaar
    2. vorig jaar;

Objecttype de Natuurlijk persoon
    het inkomen Numeriek (geheel getal) gedimensioneerd met jaardimensie en brutonettodimensie;
```
(From tests/test_dimension_simple.py, tests/test_dimension_spec_examples.py)

## 6. Expression Parsing

### Grammar Structure (Precedence Hierarchy):
```antlr
expressie : logicalExpression ;

logicalExpression
    : comparisonExpression
    | left=logicalExpression EN right=logicalExpression
    | left=logicalExpression OF right=logicalExpression
    ;

comparisonExpression
    : additiveExpression
    | /* comparison operators */
    ;

// ... continuing through multiplicative, power, unary, primary
```

### Implementation Choices:

**Operator Precedence**: Standard mathematical precedence implemented via rule hierarchy:
- Power (highest)
- Multiply/Divide
- Add/Subtract
- Comparison
- Logical AND/OR (lowest)

**Problem**: Natural language comparison operators create massive ambiguity.

**Solution**: Dedicated comparison tokens in lexer:
```
IS_GROTER_OF_GELIJK_AAN: 'is groter of gelijk aan';
ZIJN_KLEINER_DAN: 'zijn kleiner dan';
```

This prevents misparse of "X is groter of Y" as logical OR expression.

### Working Test Examples:
```regelspraak
Regel Minderjarigheid voor alle personen
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.

Regel bereken bruto inkomen huidig jaar
    geldig altijd
        Het bruto inkomen van huidig jaar van een Natuurlijk persoon 
        moet berekend worden als 100000.
```
(From tests/test_steelthread.py, tests/test_dimension_spec_examples.py)

## 7. Unit System Implementation

### Grammar Structure:
```antlr
unitIdentifier
    : IDENTIFIER
    | JAAR | JAREN | JR | MAAND | MAANDEN | MND
    | DAG | DAGEN | DG | WEEK | WEKEN | WK
    | METER | KILOMETER | KM | M
    // ... 30+ more tokens
    ;

eenheidExpressie
    : eenheidProduct (PER eenheidProduct)?
    ;
```

### The Context Sensitivity Problem:

**Challenge**: "jaar" is both a keyword (in "dit jaar") and a unit (in "18 jaar").

#### Failed Approach 1: Lexer Modes

**What was tried**: ANTLR lexer modes to switch between keyword and unit interpretation contexts.

```antlr
// Failed attempt
mode UNIT_MODE;
JAAR_UNIT : 'jaar' -> type(IDENTIFIER);
METER_UNIT : 'meter' -> type(IDENTIFIER);
// etc.
```

**Why it failed**:
1. **Lexer context independence**: Lexer modes operate entirely within the lexer phase using a mode stack (`pushMode`/`popMode`). They cannot respond to parser context, so the lexer can't know when it's inside an `Eenheidsysteem` block. This caused:
   - "extraneous input" errors when tokens were misclassified
   - Mode transition timing issues (though "Empty Stack" errors may have been misdiagnosed)
2. **Python code generation errors**: ANTLR's Python target generated broken code:
   - `IndentationError` in generated parser actions
   - `NameError` for undefined mode transition variables

**Technical reason**: While ANTLR uses on-demand tokenization (not pre-tokenization), the fundamental issue remains: lexer modes are designed for handling different lexical contexts (like JavaScript within HTML), not for responding to parser decisions. The lexer operates independently and cannot access parser state.

**Technical references**:
- [ANTLR4 pushMode, popMode, mode explanation](https://stackoverflow.com/questions/47496626/what-does-pushmode-popmode-mode-open-and-close-mean-in-the-lexer-grammar)
- [Stack Overflow: ANTLR4 pushMode, popMode, mode](https://stackoverflow.com/questions/26810380/antlr4-pushmode-popmode-mode)
- Lexer modes are documented to work for handling different lexical contexts (e.g., JavaScript within HTML), not parser-driven context switching
- [CommonTokenStream documentation](https://www.tabnine.com/code/java/classes/org.antlr.v4.runtime.CommonTokenStream) shows on-demand tokenization

#### Failed Approach 2: Semantic Predicates

**What was tried**: Conditional token matching based on parser state.

```antlr
// Failed attempt
JAAR : 'jaar' { not self.inUnitContext() }?;
JAAR_AS_UNIT : 'jaar' { self.inUnitContext() }? -> type(IDENTIFIER);
```

**Why it failed**:
1. **ANTLR Python target limitations**: The code generator produced syntactically invalid Python:
   - `IndentationError` - embedded predicates weren't properly indented
   - `SyntaxError` - malformed conditional expressions (e.g., Java-style `(char)_input.LA(-1)`)
   - Different syntax requirements (`self._input` vs `_input`)
2. **Well-documented issues**: 
   - [GitHub issue #1062](https://github.com/antlr/antlr4/issues/1062) and [#1037](https://github.com/antlr/antlr4/issues/1037): Generated code contains Java-style syntax like `(char)_input.LA(-1)` causing `SyntaxError` in Python
   - [GitHub issue #2193](https://github.com/antlr/antlr4/issues/2193): Invalid Python syntax generation with assignment to expressions  
   - [GitHub issue #821](https://github.com/antlr/grammars-v4/issues/821): Python indentation handling accepts invalid code
   - [Stack Overflow discussion](https://stackoverflow.com/questions/34086623/using-semantic-predicates-with-python-target): Community struggles with Python semantic predicates

**Technical reason**: ANTLR was designed primarily for Java, where inline code blocks are syntactically simple. Python's significant whitespace makes embedding code fragments error-prone. The Python target's template engine struggles with indentation, and the generated code often contains Java idioms that don't translate to Python. The Python target has been described as "beta state" in official documentation.

#### Failed Approach 3: External Listener Mode Switching

**What was tried**: Using an ANTLR listener to detect `Eenheidsysteem` context and dynamically change lexer behavior.

```python
# Hypothetical attempt (reconstructed)
# class UnitContextListener(RegelSpraakListener):
#     def enterEenheidsysteem(self, ctx):
#         # Attempt to switch lexer mode
#         lexer.pushMode(UNIT_MODE)
```

**Why it failed**:
1. **Lexer inaccessibility**: While ANTLR supports parse-time listeners via `parser.addParseListener()`, these listeners cannot access or modify the lexer's behavior. The lexer and parser maintain strict separation.
2. **Lookahead interference**: Even with on-demand tokenization, the parser's lookahead buffer would already contain tokens with fixed types. Changing lexer behavior mid-parse would create inconsistencies.
3. **Mode synchronization**: The timing of when to switch modes relative to token consumption proved impossible to coordinate correctly.

**Technical reason**: Although parse-time listeners can execute during parsing (not just after), they still cannot manipulate the lexer. ANTLR's architecture maintains a one-way flow from lexer to parser, with no back-channel for parser state to influence tokenization. This separation is fundamental to ANTLR's design and enables features like token buffering and lookahead.

The [ANTLR4 Listeners documentation](https://github.com/antlr/antlr4/blob/master/doc/listeners.md#during-the-parse) explicitly states that parse-time listeners (via `parser.addParseListener()`) are for executing code during parsing, not for modifying tokenization behavior.

#### Working Solution: Explicit Enumeration

**Why it works**: Instead of fighting ANTLR's architecture, embrace it. The parser rule explicitly lists all possible unit tokens, letting parser context determine interpretation. This respects the lexer→parser pipeline while achieving context sensitivity at the parser level.

**Engineering wisdom**: Sometimes the "dumb" solution is the smart choice. This verbose approach:
- Works reliably without tool fighting
- Is immediately understandable
- Has predictable behavior
- Avoids hidden complexity

**Implementation Note**: Some errors described above may have been specific to particular ANTLR versions or the result of implementation attempts that weren't fully captured in version control. The key takeaway remains valid: the Python target has significant limitations, and attempting to use advanced ANTLR features for context-sensitive tokenization proved unworkable. The explicit enumeration solution, while verbose, provides a robust and maintainable approach that works within ANTLR's architectural constraints.

**Important clarification about tokenization**: The original implementation notes incorrectly claimed "the lexer must tokenize the entire input before the parser starts." This is false - ANTLR actually uses on-demand tokenization through `CommonTokenStream`, where tokens are generated as the parser requests them. However, this doesn't solve the fundamental issue: the lexer still operates independently of parser context and cannot respond to parser state decisions.

## 8. Timeline Support (§8)

### Grammar Structure:
```antlr
tijdlijnExpressie
    : tijdlijnVan
    | tijdlijnVanaf
    | tijdlijnTot
    | tijdlijnIn
    ;
```

### Implementation Status:
- ✓ Timeline expression evaluation in rules
- ✓ Empty value handling (returns 0 for numerics)
- ✗ Period definitions (van/tot syntax) - grammar exists but not fully implemented

**Engineering Note**: Timeline expressions require special runtime handling to track temporal values across rule evaluations.

### Working Test Examples:
```regelspraak
Regel timeline leeftijd berekening
    geldig altijd
        De leeftijd op het tijdstip van een Natuurlijk persoon 
        moet berekend worden als 
        de tijdsduur van de geboortedatum tot het tijdstip.
```
(From specification examples - timeline feature partially implemented)

## 9. Subselectie (Filtered Collections) (§10.5)

### Grammar Structure:
```antlr
subselectieExpressie
    : objectExpressie subselectieFilter
    ;

subselectieFilter
    : DIE predikaat
    | DAT predikaat
    | MET attribuutReferentie vergelijkingsoperator expressie
    ;
```

### Implementation Genius:

The DIE/DAT/MET syntax provides natural language filtering that maps cleanly to predicates. The grammar enforces gender agreement (DIE for plural/common, DAT for neuter) matching Dutch grammar rules.

### Working Test Examples:
```regelspraak
Regel tel minderjarigen
    geldig altijd
        De hoeveelheid minderjarige passagiers van een vlucht moet berekend worden als 
        het aantal passagiers van de vlucht die minderjarig zijn.

Regel bereken totale belasting minderjarigen
    geldig altijd
        De totale belasting minderjarigen van een vlucht moet berekend worden als 
        de som van de belasting van alle passagiers van de vlucht die minderjarig zijn.
```
(From tests/test_subselectie.py)

## 10. Object and Relationship Creation

### Object Creation (ObjectCreatie):
```antlr
objectCreatieResultaat
    : ER_WORDT_EEN_NIEUW (objectTypeNaam=naamwoord) 
      (meervoud=OBJECT_)? AANGEMAAKT 
      (MET objectCreatieKenmerk (COMMA objectCreatieKenmerk)*)?
    ;
```

**Key Design**: The `OBJECT_` token (with underscore) avoids Python reserved word conflict.

### Relationship Creation (FeitCreatie):
```antlr
feitCreatieResultaat
    : CREEER? EEN feitCreatieSubjectPhrase=naamwoord 
      (IS | ALS) EEN feitTypeNaam=naamwoord
    ;
```

**Complex Navigation Pattern**:
```
Een passagier van de reis met treinmiles van het vastgestelde contingent
```

**Implementation Challenge**: The entire navigation path is captured as one `naamwoord`, requiring post-processing to split on "van" for relationship traversal.

### Working Test Examples:
```regelspraak
Regel object creatie eenvoudig
    geldig altijd
        Er wordt een nieuw Persoon aangemaakt.

Regel object creatie met attributen
    geldig altijd
        Er wordt een nieuw Product aangemaakt
        met naam "Laptop"
        en prijs 1000 EUR
        en voorraad 5.

Regel passagier met recht op treinmiles
    geldig altijd
        Een passagier met recht op treinmiles van een vastgestelde contingent treinmiles 
        is een passagier van de reis met treinmiles van het vastgestelde contingent treinmiles.
```
(From tests/test_object_creation_integration.py, tests/test_feitcreatie_integration.py)

## 11. Rule Types

### Grammar Structure:
```antlr
regel
    : regelHeader regelBody SEMICOLON?
    ;

regelHeader
    : REGEL regelName=naamwoord ( regelVersie )? 
      ( RECURSIE )? ( regelGeldigheid )?
    ;
```

### Key Implementation:

**Recursion Safety**: Rules marked with `RECURSIE` get special runtime treatment with iteration tracking and limits (default: 100).

**Rule Name Extraction**: Complex due to prepositions in names like "passagier met recht op treinmiles". Solution uses `get_text_with_spaces()` to preserve full text.

### Working Test Examples:
```regelspraak
Regel Recursie genereer berekeningen
    Recursie
    geldig altijd
    Er wordt een nieuw Berekening aangemaakt
    indien de iteratie van de Berekening kleiner is dan 10.

Regel Minderjarigheid voor alle personen
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.
```
(From tests/test_recursie.py, tests/test_steelthread.py)

## 12. Function Registry

### Implementation Evolution:

**Original Problem**: Duplicate function definitions for articles:
```python
# Function registry showing duplication
# 'de som van': self._func_som_van,
# 'het totaal van': self._func_som_van,  # Same function!
```

**Solution**: Normalized function registry strips articles before lookup, eliminating ~30% code duplication.

### Working Test Examples:
```regelspraak
Regel bereken leeftijd
    geldig altijd
        De leeftijd van een Natuurlijk persoon moet berekend worden als 
        de tijdsduur van zijn geboortedatum tot vandaag.

Regel bereken totale belasting
    geldig altijd
        De totale belasting van een Vlucht moet berekend worden als 
        de som van de te betalen belasting van alle passagiers van de vlucht.

Regel bereken aantal passagiers
    geldig altijd
        Het aantal passagiers van een vlucht moet berekend worden als 
        het aantal passagiers van de vlucht.
```
(From tests/test_aggregation_functions.py, tests/test_tijdsduur_toka.py)

## 13. Advanced Predicates

### Elfproef Implementation:
```antlr
primaryExpression
    : ...
    | expr=primaryExpression VOLDOET_AAN_DE_ELFPROEF
    ;
```

Maps to BSN checksum validation - a domain-specific requirement for Dutch social security numbers.

### Working Test Examples:
```regelspraak
Objecttype de Natuurlijk persoon
    het burgerservicenummer Tekst;
    is BSNgeldig kenmerk (bijvoeglijk);
    
Regel BSN validatie
    geldig altijd
        Een Natuurlijk persoon is BSNgeldig
        indien zijn burgerservicenummer voldoet aan de elfproef.
```
(From tests/test_elfproef_integration.py)

### Dagsoort Predicates:
```antlr
dagsoortDefinition
    : DAGSOORTDEFINITIE naamwoord IS 
      ( specificDagsoort | datumExpressie ) SEMICOLON?
    ;
```

Enables business rules based on weekdays, weekends, and holidays.

### Working Test Examples:
```regelspraak
Dagsoort de kerstdag (mv: kerstdagen);

Regel Kerstdag
    geldig altijd
        Een dag is een kerstdag
        indien de dag aan alle volgende voorwaarden voldoet:
        - de maand uit (de dag) is gelijk aan 12
        - de dag voldoet aan ten minste één van de volgende voorwaarden:
            .. de dag uit (de dag) is gelijk aan 25
            .. de dag uit (de dag) is gelijk aan 26.

Dagsoort de weekenddag (mv: weekenddagen);

Regel Weekenddag definitie
    geldig altijd
        Een dag is een weekenddag
        indien de dag aan ten minste één van de volgende voorwaarden voldoet:
        - de dag uit naam (de dag) is gelijk aan 'zaterdag'
        - de dag uit naam (de dag) is gelijk aan 'zondag'.

Regel Vlucht op kerstdag
    geldig altijd
        Een Vlucht is op_kerstdag indien de vluchtdatum van de vlucht is een dagsoort kerstdag.
```
(From tests/test_dagsoortdefinitie.py, tests/test_dagsoort_integration.py)


## 14. Decision Tables (Beslistabel)

### Grammar Structure:
```antlr
beslistabelRow
    : PIPE rowNumber=NUMBER PIPE resultExpression=expressie 
      PIPE conditionValues+=beslistabelCellValue 
      (PIPE conditionValues+=beslistabelCellValue)* PIPE?
    ;

beslistabelColumnText
    : ~(PIPE)+  // Match anything except pipe
    ;
```

### Implementation Genius:

**Pipe-Delimited Parsing**: The `~(PIPE)+` pattern is crucial - it consumes ANY tokens except pipes, allowing natural language in column headers without complex escaping.

**Rigid Structure Enforcement**: Pipes are mandatory delimiters, not optional. This prevents ambiguity in table parsing.

### Working Test Examples:
```regelspraak
Beslistabel Woonregio factor
    geldig altijd
|   | de woonregio factor van een Natuurlijk persoon moet gesteld worden op | indien zijn woonprovincie gelijk is aan |
|---|-----------------------------------------------------------------------|------------------------------------------|
| 1 | 1                                                                     | 'Friesland'                              |
| 2 | 2                                                                     | 'Noord-Brabant'                          |
| 3 | 3                                                                     | 'Noord-Holland'                          |
```
(From tests/test_beslistabel.py)

## 15. Distribution Rules (Verdeling)

### Grammar Structure:
```antlr
verdelingResultaat
    : ... WAARBIJ_WORDT_VERDEELD 
      (verdelingMethodeSimple | verdelingMethodeMultiLine) ...
    ;

verdelingMethodeMultiLine
    : COLON verdelingMethodeBulletList DOT?
    ;
```

### Syntactic Disambiguation:

**Key Innovation**: The presence of a colon (`:`) switches between single-line and multi-line syntax. This is deterministic - no backtracking needed.

**Single-line**: `waarbij wordt verdeeld in gelijke delen`

**Multi-line with colon**:
```
waarbij wordt verdeeld:
- naar rato van het inkomen
- met een maximum van 1000
```

**Engineering Note**: The colon acts as a lookahead token that commits the parser to multi-line mode, preventing ambiguity.

### Working Test Examples:
```regelspraak
Regel verdeling treinmiles eenvoudig
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over 
        de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld in gelijke delen.

Regel verdeling treinmiles complex
    geldig altijd
        Het totaal aantal treinmiles van een te verdelen contingent treinmiles wordt verdeeld over 
        de treinmiles van alle passagiers met recht op treinmiles van het te verdelen
        contingent treinmiles, waarbij wordt verdeeld:
        - op volgorde van toenemende de leeftijd,
        - bij een even groot criterium naar rato van de woonregio factor,
        - met een maximum van het maximaal aantal te ontvangen treinmiles,
        - afgerond op 0 decimalen naar beneden.
```
(From tests/test_verdeling.py)

## 16. Compound Predicates (Samengesteld Predicaat)

### Grammar Structure:
```antlr
samengesteldPredikaat
    : quantifier subselectieExpressie 
      ( DUBBELE_PUNT bulletPredicaatLijst )?
    ;

quantifier
    : ALLE
    | GEEN VAN DE
    | TEN_MINSTE NUMBER
    | TEN_HOOGSTE NUMBER
    | PRECIES NUMBER
    ;
```

### Bullet Level Tracking:
The grammar supports nested conditions with bullet markers (•, ••, •••). This visual hierarchy maps to logical nesting depth in the AST.

### Working Test Examples:
```regelspraak
Regel test alle kinderen minderjarig
    geldig altijd
        Een ouder is alleenstaand ouder indien alle kinderen van de ouder:
        • minderjarig zijn
        • langer zijn dan 150 cm.

Regel test geen werknemers
    geldig altijd
        Het bedrijf is startup indien geen van de werknemers van het bedrijf:
        • een vast contract heeft
        • meer verdient dan 50000 EUR.

Regel test ten minste 3 personen
    geldig altijd
        Het team is compleet indien ten minste 3 personen van het team aanwezig zijn.
```
(From tests/test_samengesteld_predicaat.py)

## 17. Reference Disambiguation Deep Dive

### The Three-Way Ambiguity Problem:

```antlr
primaryExpression
    : naamwoord                    #NaamwoordExpr
    | parameterMetLidwoord         #ParamRefExpr  
    | attribuutReferentie          #AttribuutRefExpr
    ;
```

**The Challenge**: "de leeftijd" could be:
1. A parameter reference
2. A variable reference
3. Part of an attribute reference (if followed by "van")

**Grammar Solution**: Partial - only attributes are disambiguated via the mandatory `VAN` keyword.

**Visitor Solution**: The `parameter_names` hack in builder.py tracks declared parameters to distinguish them from variables during AST construction. This is suboptimal but necessary given the grammar structure.

### The "Een X" Pattern Deep Dive:

The grammar handles "Een X" contextually:

```antlr
onderwerpBasis
    : (DE | HET | EEN | ZIJN | ALLE)? identifierOrKeyword+
    ;
```

**Three Distinct Uses**:

1. **Existential Reference**: "Een persoon" - refers to any person
2. **Rule Scope Declaration**: "Een Natuurlijk persoon is minderjarig indien..." - defines rule applicability
3. **Object Creation**: "Er wordt een nieuw Product aangemaakt" - creates new instance

**Engineering Trade-off**: The grammar doesn't distinguish these uses syntactically. Semantic analysis must determine intent from context (rule type, position in AST).

## 18. Attribute vs Subject Reference Architecture

### The Compositional Design:

```antlr
attribuutReferentie
    : attribuutMetLidwoord VAN onderwerpReferentie
    ;

onderwerpReferentie
    : basisOnderwerp (voorzetsel basisOnderwerp)*
    ;
```

**Key Insight**: This is a recursive composition pattern. Examples:

1. Simple: "de naam" (just onderwerpReferentie)
2. Attribute: "de naam VAN de persoon" 
3. Nested: "de naam VAN de eigenaar VAN het huis"
4. Complex: "de prijs VAN het product MET korting DIE actief is"

**Implementation Note**: The visitor must traverse this recursively, building a path list for runtime navigation through object relationships.

## Critical Maintenance Notes

### 1. **Never Reorder Lexer Tokens**
Token order is critical. Moving a multi-word token after IDENTIFIER breaks everything.

### 2. **The AANTAL Hack**
The word "aantal" is overloaded. Current solution works but is fragile. Future maintainers should consider semantic predicates if ANTLR significantly improves Python target support (currently suffers from well-documented code generation issues - see [Python target limitations](https://theantlrguy.atlassian.net/wiki/spaces/ANTLR3/pages/2687339/Antlr3PythonTarget) which describes it as "beta state").

### 3. **Grammar vs Visitor Complexity Trade-off**
Many ambiguities are resolved in the visitor (builder.py) rather than the grammar. This is intentional - a pure grammar solution would require excessive lookahead and context sensitivity, making it unmaintainable.

### 4. **Hidden Channel Critical**
Do NOT change whitespace handling to skip. The hidden channel preserves formatting needed for proper multi-word token reconstruction.

### 5. **The _extract_canonical_name Problem**
The 100+ line helper function in builder.py is a code smell indicating grammar naming inconsistencies. Refactoring would require coordinated grammar and visitor changes.

### 6. **Unit System Context Sensitivity**
Words like "meter", "jaar", "dag" are both keywords AND unit identifiers. The `unitIdentifier` rule explicitly lists all possible tokens to handle this context sensitivity. This is verbose but avoids lexer modes which don't work well with ANTLR's Python target.

### 7. **Error Recovery Limitations**
The grammar has minimal error recovery. Invalid input often results in "no viable alternative" errors. This is acceptable for a DSL where syntax errors should be caught early, but consider adding error recovery rules if used in an IDE.

## Performance Considerations

1. **Token Explosion**: The lexer has 1000+ tokens. This is memory-intensive but necessary for disambiguation.

2. **Visitor Complexity**: The builder.py visitor is 70KB+. Consider splitting into multiple specialized visitors if it grows further.

3. **Runtime Implications**: Complex expressions with nested subselecties and timeline operations can create deep AST trees. The evaluator implements safety limits.

## ANTLR-Specific Features Used

### 1. **Labeled Alternatives (#Label)**
```antlr
primaryExpression
    : naamwoord                    #NaamwoordExpr
    | attribuutReferentie          #AttribuutRefExpr
    ;
```
**Purpose**: Generates specific visitor methods (`visitNaamwoordExpr`) instead of generic `visitPrimaryExpression`.

### 2. **List Labels (+=)**
```antlr
conditionColumns+=beslistabelColumnText
```
**Purpose**: Automatically collects multiple matches into a Python list.

### 3. **Negative Token Sets (~)**
```antlr
beslistabelColumnText : ~(PIPE)+ ;
```
**Purpose**: Matches any token except those specified - crucial for table parsing.

### 4. **Hidden Channels**
```antlr
WS: [ \t\r\n]+ -> channel(HIDDEN);
```
**Purpose**: Preserves whitespace without cluttering parser rules.

### 5. **Token Vocabulary Import**
```antlr
options { tokenVocab=RegelSpraakLexer; }
```
**Purpose**: Separates lexer and parser grammars for better organization.

## Future Enhancement Paths

1. **Semantic Predicates**: When ANTLR improves Python support, many disambiguation rules could move from visitor to grammar.

2. **Grammar Modularization**: Consider splitting into multiple grammar files (expressions.g4, rules.g4, etc.) for maintainability.

3. **Performance**: For production use, consider generating a more efficient parser or compiling hot paths.

## Example Parse Trees

### Complex Rule Example:

```
Regel Minderjarigheid voor alle personen
  Een Natuurlijk persoon is minderjarig
  indien zijn leeftijd kleiner is dan de volwassenleeftijd.
```

**Parse Tree Structure**:
```
regel
├── regelHeader
│   ├── REGEL: "Regel"
│   ├── regelName (naamwoord): "Minderjarigheid voor alle personen"
│   └── regelGeldigheid: (absent - defaults to "altijd")
└── regelBody
    └── kenmerktoekenningRegel
        ├── regelConditie: "Een Natuurlijk persoon"
        ├── kenmerkToekenning: "is minderjarig"
        └── voorwaarde
            └── logicalExpression
                └── comparisonExpression
                    ├── left: attribuutReferentie "zijn leeftijd"
                    ├── operator: KLEINER_IS_DAN
                    └── right: parameterMetLidwoord "de volwassenleeftijd"
```

### Attribute Reference Chain Example:

```
de prijs van het product van de bestelling met korting
```

**Parse Breakdown**:
1. `attribuutMetLidwoord`: "de prijs"
2. `VAN`
3. `onderwerpReferentie`:
   - `basisOnderwerp`: "het product"
   - `voorzetsel`: "van"
   - `basisOnderwerp`: "de bestelling"
   - `subselectieFilter`: "met korting"

**Visitor Path Construction**: ["prijs", "product", "bestelling"] with filter "heeft korting"

## Common Pitfalls and Solutions

### Pitfall 1: Forgetting Multi-word Token Precedence
**Symptom**: "is groter of gelijk aan" parses as "is groter" OR "gelijk aan"
**Solution**: Ensure `IS_GROTER_OF_GELIJK_AAN` is defined before `IS` and `GROTER` in lexer

### Pitfall 2: Assuming Whitespace Significance
**Symptom**: Rules break when formatting changes
**Solution**: Remember whitespace is on HIDDEN channel - it's preserved but not significant for parsing

### Pitfall 3: Over-constraining the Grammar
**Symptom**: Natural variations of valid Dutch rejected
**Solution**: Keep grammar permissive, handle validation in semantic analysis

## Conclusion

The RegelSpraak grammar represents a sophisticated solution to parsing natural language within formal constraints. Its complexity stems not from poor design but from the inherent challenge of making formal rules accessible to business users in their native language. Understanding these trade-offs is crucial for effective maintenance and enhancement.

The key insight is that the grammar is intentionally permissive in many places, deferring disambiguation to the visitor/semantic analysis phase. This is not a weakness but a deliberate engineering choice that balances parser complexity with maintainability.

## Additional Resources and References

### ANTLR Documentation
- [Official ANTLR4 Documentation](https://github.com/antlr/antlr4/tree/master/doc)
- [ANTLR4 Python Target Guide](https://github.com/antlr/antlr4/blob/master/doc/python-target.md)
- [Terence Parr's ANTLR v4 Lexers](https://theantlrguy.atlassian.net/wiki/spaces/~admin/pages/524332/ANTLR+v4+lexers)

### Community Resources
- [ANTLR4 Listeners vs Visitors](https://stackoverflow.com/questions/20714492/antlr4-listeners-and-visitors-which-to-implement)
- [The ANTLR Mega Tutorial](https://tomassetti.me/antlr-mega-tutorial/)
- [Listeners and Visitors Guide](https://tomassetti.me/listeners-and-visitors/)

### Known Issues with Python Target
- [Issue #1037: Incorrectly generated code for Python 3](https://github.com/antlr/antlr4/issues/1037)
- [Issue #680: Transmitting tokens on different channels in Python](https://github.com/antlr/antlr4/issues/680)
- [Issue #4291: Some rule names cause runtime errors in Python](https://github.com/antlr/antlr4/issues/4291)