# Engineering Natural Language Business Rules: The RegelSpraak Parser Architecture

## The Core Challenge

Consider this Dutch business rule: "de leeftijd van de persoon". Is "leeftijd" a parameter? An attribute? Does "van" indicate possession, navigation, or a dimension? In English parsers, rigid syntax disambiguates. In Dutch, word order varies, articles float, and the same phrase means different things in different contexts.

Traditional compiler architecture fails here. ANTLR's lookahead cannot resolve whether "de" starts a parameter reference or an attribute path without understanding the entire domain model. Semantic predicates break on Python targets. Context-sensitive lexer modes generate invalid code. The solution isn't to fight Dutch - it's to embrace linguistic ambiguity as a first-class architectural constraint.

## Architectural Solution: Three-Phase Resolution

The RegelSpraak parser implements a deliberate three-phase architecture where each layer has a specific responsibility in the ambiguity resolution pipeline:

**Phase 1: Aggressive Lexicalization** - The lexer contains 1000+ tokens, each multi-word Dutch phrase gets its own token. "is groter of gelijk aan" becomes a single `IS_GROTER_OF_GELIJK_AAN` token. This isn't over-engineering - it's the minimum viable approach to prevent combinatorial explosion in the parser.

**Phase 2: Permissive Parsing with Deferred Semantics** - The parser accepts linguistically plausible constructs without semantic validation. It produces a parse tree that preserves all structural information but makes no decisions about meaning. Attributes follow the pattern `attribuutMetLidwoord VAN onderwerpReferentie`, forcing navigation separators into the grammar while deferring semantic interpretation.

Consider this navigation example: "de vluchtdatum van de vlucht":

```
Tokens: [DE] [IDENTIFIER:vluchtdatum] [VAN] [DE] [IDENTIFIER:vlucht]

Parse Tree:
(expressie
  (logicalExpression
    (comparisonExpression
      (additiveExpression
        (multiplicativeExpression
          (powerExpression
            (primaryExpression
              (attribuutReferentie
                (attribuutMetLidwoord
                  (naamwoordNoIs
                    (naamPhraseNoIs de vluchtdatum)))
                van
                (onderwerpReferentie
                  (onderwerpBasis
                    (basisOnderwerp de vlucht)))))))))))
```

The deep nesting (logical→comparison→additive→multiplicative→power→primary) encodes operator precedence through grammar rules - even simple expressions traverse all levels to maintain uniform tree structure.

The parser creates the same structural tree whether "vluchtdatum" is an attribute of "vlucht" (through a FeitType relationship) or a dimensioned attribute. It doesn't know if "vlucht" is a parameter, variable, or object type. These decisions await Phase 3.

**Phase 3: Stateful Semantic Resolution** - The visitor (builder.py) maintains a mutable `DomainModel` that accumulates knowledge during tree traversal. Earlier definitions immediately influence later disambiguation. This temporal coupling is intentional - business rules reference earlier definitions, never forward-declare.

Consider how the visitor processes this TOKA example:

```regelspraak
Parameter de volwassenleeftijd: Numeriek met eenheid jr

Objecttype de Natuurlijk persoon
    de leeftijd Numeriek met eenheid jr;

Regel minderjarig kenmerk
    ...
    indien zijn leeftijd kleiner is dan de volwassenleeftijd.
```

The visitor mutates the DomainModel during traversal:

```
# Step 1: Process Parameter definition
visitParameterDefinition():
    self.parameter_names.add("volwassenleeftijd")  # Mutates set
    self.domain_model.parameters["volwassenleeftijd"] = ParameterDef(...)

# Step 2: Process ObjectType
visitObjectTypeDefinition():
    self.domain_model.objecttypes["Natuurlijk persoon"] = ObjectTypeDef(
        attributes={"leeftijd": AttributeDef(...)}
    )

# Step 3: Process Rule - "de volwassenleeftijd" now disambiguates
visitComparisonExpression("zijn leeftijd kleiner is dan de volwassenleeftijd"):
    # Left side: "zijn leeftijd"
    → Pronoun "zijn" → current object context
    → "leeftijd" NOT in parameter_names → attribute lookup
    → Returns: AttributeReference(path=["leeftijd"])

    # Right side: "de volwassenleeftijd"
    → "volwassenleeftijd" IN parameter_names  # Found due to Step 1!
    → Returns: ParameterReference("volwassenleeftijd")
```

Data structures populated during Phase 3:
- `parameter_names`: Set of all parameter names for disambiguation
- `domain_model.parameters`: Parameter definitions with types/units
- `domain_model.objecttypes`: Object types with attributes/kenmerken
- `domain_model.dimensions`: Dimension definitions for attribute resolution
- `domain_model.feittypen`: Relationship types for navigation
- `domain_model.regels`: Rules with resolved AST nodes

## The Lexical Strategy

### Token Precedence as Architecture

The lexer's token ordering isn't just important - it's load-bearing architecture. ANTLR's longest-match-first rule means multi-word tokens must appear before their constituents:

```antlr
IS_GROTER_OF_GELIJK_AAN: 'is groter of gelijk aan';  // Line 89 - MUST precede IS, GROTER
IS: 'is';                                             // Line 234 - Would shadow if reversed
```

Reordering these breaks parsing catastrophically. Each new multi-word token multiplies DFA states, making vocabulary expansion expensive. The team discovered this empirically - the grammar contains warning comments about precedence violations that took days to debug.

### Hidden Channel Preservation

```antlr
WS: [ \t\r\n]+ -> channel(HIDDEN);  // Not skipped!
```

Whitespace lives on the hidden channel, not discarded. This enables:
- Multi-word token reconstruction with proper spacing
- Tab detection for FeitType role definitions (tabs only survive here)
- Original text span extraction for error messages

The visitor frequently accesses raw input to recover information the lexer consumed but preserved:

```python
# Example 1: Detecting tabs in FeitType definitions (builder.py:4147)
def visitRolDefinition(self, ctx):
    input_stream = ctx.start.getInputStream()
    full_input = input_stream.getText(0, input_stream.size)

    # Extract line containing the role definition
    role_start = ctx.content.start.start
    next_newline = full_input.find('\n', role_start)
    full_text = full_input[role_start:next_newline].rstrip()

    # Check for tab separator (specification requires tab between role and type)
    if '\t' in full_text:
        parts = full_text.split('\t', 1)
        rol_naam = parts[0].strip()      # "de passagier"
        object_type = parts[1].strip()   # "Natuurlijk persoon"

# Example 2: Reconstructing multi-word names with proper spacing (builder.py:1525)
def visitOnderwerpRefExpr(self, ctx):
    # Reconstruct full text including spaces from hidden channel
    input_stream = start_token.getTokenSource().inputStream
    full_text_with_spaces = input_stream.getText(start_idx, stop_idx)
    # "de volwassen leeftijd" → preserves spacing between words
    canonical_name = self._extract_canonical_name_from_text(full_text_with_spaces)
    if canonical_name in self.parameter_names:
        return ParameterReference(canonical_name)
```

Without raw input access, tabs would be lost (consumed by WS token) and multi-word names would collapse ("de volwassen leeftijd" → "devolwassenleeftijd").

### Context-Sensitive Keywords

Dutch uses "jaar", "meter", "kilometer" as both units and common words. Lexer modes would solve this elegantly, but Python target generates broken code. The solution: exhaustive enumeration in grammar rules:

```antlr
unitIdentifier: IDENTIFIER | JAAR | JAREN | JR | METER | KILOMETER | KM | M | ...;
```

Verbose but reliable. Each context explicitly lists allowed keywords, preventing ambiguity without lexer modes.

## Semantic Disambiguation Engine

### The Stateful Visitor Pattern

The builder maintains three critical pieces of state during traversal:

1. **DomainModel** - Accumulates type definitions, parameters, dimensions, relationships
2. **parameter_names** - Set of declared parameter names for disambiguation
3. **Raw input stream** - Original text for tab detection and reconstruction

This statefulness violates pure visitor patterns but enables natural language processing:

```python
def visitAttribuutReferentie(self, ctx):
    attr_name = self.visitAttribuutMetLidwoord(ctx.attribuutMetLidwoord())

    # Check parameter_names first - parameters shadow attributes
    if attr_name in self.parameter_names:
        return ParameterReference(attr_name)

    # Check for navigation via "van"
    if ctx.VAN() and ctx.onderwerpReferentie():
        # Dutch writes right-to-left, engine expects left-to-right
        path = self._reverse_navigation_path(ctx)
        return self._resolve_with_dimensions(path)
```

### Navigation Path Reversal

Dutch naturally expresses paths right-to-left: "het inkomen van de partner van de persoon" (the income of the partner of the person). The engine needs left-to-right traversal: person → partner → income.

The visitor reverses paths during AST construction, preserving linguistic naturalness while providing computational efficiency. This three-way contract (grammar structure, visitor reversal, engine traversal) is fragile but essential.

Consider the concrete example: "de postcode van het adres van een Natuurlijk persoon":

```regelspraak
Objecttype Natuurlijk persoon
    het adres Tekst;  # In real system, this would be another object

Objecttype Adres
    de postcode Tekst;
    de straat Tekst;

Feittype adres van personen
    het adres	Adres
    de persoon	Natuurlijk persoon

# Dutch input: "de postcode van het adres van een Natuurlijk persoon"
```

Grammar parses this structure (simplified):
```
(attribuutReferentie
  (attribuutMetLidwoord "de postcode")
  VAN
  (onderwerpReferentie
    (attribuutMetLidwoord "het adres")
    VAN
    (onderwerpBasis "een Natuurlijk persoon")))
```

Visitor processes right-to-left navigation and reverses (builder.py:1243):
```python
# Dutch order as parsed: ["postcode", "adres", "Natuurlijk persoon"]
# After detection of navigation parts:
extracted_nav_parts = ["adres"]  # Middle navigation element
base_path = ["Natuurlijk persoon"]  # Object type specification

# Reversal happens here:
reversed_extracted = list(reversed(extracted_nav_parts))  # Still ["adres"] in this case
additional_path_elements = reversed_extracted + (additional_path_elements or [])

# Final path construction for object type spec (line 1371):
full_path = base_path + additional_path_elements + [actual_attribute_name]
# Result: ["Natuurlijk persoon", "adres", "postcode"]
```

Engine traverses left-to-right (engine.py:2151-2258):
```python
# Engine receives: ["Natuurlijk persoon", "adres", "postcode"]
# Step 1: Start with Natuurlijk persoon instance
# Step 2: Navigate to adres (via FeitType relationship)
# Step 3: Get postcode attribute from the adres object

# The engine processes left-to-right:
current_obj = natuurlijk_persoon_instance
current_obj = navigate_via_feittype(current_obj, "adres")  # Returns Adres object
result = get_attribute(current_obj, "postcode")
```

Test expectation confirms (test_beslistabel.py:195):
```python
# Path should be: [object type, intermediate object, final attribute]
self.assertEqual(result.attribute_path, ["Natuurlijk persoon", "adres", "postcode"])
```

The reversal is essential: Dutch users write what's most specific first (postcode), then qualify it with context (of the address, of the person). The engine needs the opposite: start with the object you have (person), navigate to related objects (address), then get the attribute (postcode).

### Deferred Dimension Resolution

Dimensions can't resolve during parsing - their definitions might appear later in the file. The visitor creates `DimensionedAttributeReference` nodes with textual labels:

```python
# Builder detects pattern, stores label
if self._looks_like_dimension(attr_name):
    return DimensionedAttributeReference(
        attribute="inkomen",
        dimension_labels=["vorig jaar"]  # Textual, not resolved
    )

# Engine resolves against domain model later
dimension = self._find_dimension_by_label(ref.dimension_labels[0])
```

This deferred resolution enables forward references while maintaining parse-order evaluation.

### Parameter Tracking Mechanism

The parameter/attribute ambiguity pervades the grammar. "de leeftijd" could be either. The solution: a shared `parameter_names` set populated from parameter definitions, then checked by all reference visitors:

```python
# In visitParameterDefinition
self.parameter_names.add(canonical_name)

# In visitAttribuutReferentie, visitOnderwerpRefExpr, visitParamRefExpr
if name in self.parameter_names:
    return ParameterReference(name)
```

Without this stateful tracking, every context would need its own disambiguation logic.

## Runtime Architecture

### Immutable AST with Frozen Dataclasses

All AST nodes are `@dataclass(frozen=True)`. This decision cascades through the architecture:

```python
@dataclass(frozen=True)
class DimensionedAttributeReference:
    attribute: str
    dimension_labels: tuple[str, ...]  # Tuple for immutability
    navigation_path: tuple[str, ...] = ()
    location: Optional[SourceSpan] = None
```

Benefits:
- Thread-safe sharing of AST nodes
- Location metadata safely shared across transformations
- No defensive copying needed

Trade-offs:
- Builder must fully compute all fields before instantiation
- No post-construction corrections possible
- Dimension resolution requires new node creation, not mutation

### Value Objects with Unit Propagation

All runtime values wrap in `Value` objects:

```python
@dataclass(frozen=True)
class Value:
    value: Any
    unit: Optional[str] = None

    def __add__(self, other):
        if self.unit != other.unit:
            raise UnitError(f"Cannot add {self.unit} to {other.unit}")
        return Value(self.value + other.value, self.unit)
```

This enables unit arithmetic and null propagation without special-casing every operation. The engine never handles raw Python values, preventing unit loss or null pointer exceptions.

### IS/IN Evaluation Centralization

All type checking and membership testing routes through RuntimeContext methods. This centralization is critical because Dutch "is" and "in" operators are heavily overloaded with context-dependent meanings:

```python
def check_is(self, obj, type_or_role):
    """Centralized IS evaluation - handles types, kenmerken, roles"""
    if isinstance(type_or_role, str):
        # Could be object type, kenmerk, or role
        return self._check_type(obj, type_or_role) or \
               self._check_kenmerk(obj, type_or_role) or \
               self._check_role(obj, type_or_role)
```

Why centralization matters (runtime.py:1293-1337):

**1. Semantic Overloading** - "is" means different things in different contexts:
```regelspraak
hij is minderjarig          # Kenmerk check (line 1309-1324)
hij is een Natuurlijk persoon  # Type check (line 1328)
hij is een passagier        # Role check via FeitType (line 1332)
hij is minderjarig voor elke dag  # Timeline kenmerk (line 1311-1322)
```

**2. Timeline Complexity** - Timeline kenmerken require special handling:
```python
if kenmerk_or_type in instance.timeline_kenmerken:
    if not date_to_use:
        raise RuntimeError(
            f"Timeline kenmerk '{kenmerk_or_type}' requires evaluation_date"
        )
    timeline_val = instance.timeline_kenmerken[kenmerk_or_type]
    val = timeline_val.get_value_at(date_to_use)
```

**3. Domain Enumeration Membership** - "in" checks against domain values (runtime.py:1350-1364):
```python
def check_in(self, value, collection):
    # Is collection a domain name with enumeration?
    domain_def = self.domain_model.domeinen.get(collection)
    if domain_def and domain_def.enumeratie_waarden:
        for enum_val in domain_def.enumeratie_waarden:
            if str(value) == enum_val:
                return True
```

**4. Multiple Error Checks, Consistent Reporting** - Different validation checks converge to uniform error handling:

The centralized methods perform multiple distinct error checks:
- **Null instance validation**: "IS operator requires a valid object instance on the left"
- **Timeline date requirements**: "Timeline kenmerk 'X' requires evaluation_date to be set. Per specification §10.3..."
- **Collection type validation**: "IN operator requires a collection... got {type}"
- **Domain enumeration lookups**: Implicit membership checking against domain values
- **Graceful fallbacks**: Undefined kenmerken/types/roles return False (no error)

Each check has its own specific logic and tailored error message, but all errors flow through the same RuntimeError mechanism. This provides:
- Uniform error message format with contextual details
- Specification section references where applicable
- Type information for debugging
- Single exception type for all semantic violations

Without this centralization, every expression evaluator would need to:
- Validate null instances separately
- Check for timeline evaluation dates
- Handle domain enumeration lookups
- Format consistent error messages
- Reference specification sections correctly

The centralized approach ensures that while there are multiple distinct error conditions being checked, they all report errors through a consistent mechanism.

## Natural Language Patterns

### Possessive Pronouns as Self-Reference

Currently, only possessive pronouns referring to the current object are implemented:

```
"zijn inkomen" → AttributeReference(path=["self", "inkomen"]) → income of current object
"haar leeftijd" → AttributeReference(path=["self", "leeftijd"]) → age of current object
```

The resolution happens in two phases:
1. **Visitor phase** (builder.py:1425-1467): Recognizes possessive pronoun "zijn/haar" and creates `AttributeReference(path=["self", attribute_name])`
2. **Engine phase** (engine.py:2296): Resolves "self" to `context.current_instance` during evaluation

### Dimensions: Adjectival and Prepositional Patterns

RegelSpraak supports two distinct dimension patterns, each defined with specific usage rules:

**Adjectival dimensions** (positioned before the attribute without preposition):
```regelspraak
Dimensie de brutonettodimensie (voor het attribuut zonder voorzetsel):
    1. bruto
    2. netto
```

**Prepositional dimensions** (positioned after the attribute with "van"):
```regelspraak
Dimensie de jaardimensie (na het attribuut met voorzetsel van):
    1. vorig jaar
    2. huidig jaar
```

These combine to form multi-dimensional references:
```
"het bruto inkomen van vorig jaar" → DimensionedAttributeReference(
    base_attribute: AttributeReference(path=["Natuurlijk persoon", "inkomen"]),
    dimension_labels: [
        DimensionLabel(label="vorig jaar"),  # prepositional dimension
        DimensionLabel(label="bruto")         # adjectival dimension
    ]
)
```

The visitor detects and distinguishes these patterns during semantic resolution. The engine later maps these textual labels to their dimension definitions for coordinate-based value lookup.

### Bullet-Structured Quantifiers: Recursive AST and Evaluation

Business rules use bullets for nested logical conditions. Consider this nested structure:

```regelspraak
indien hij aan alle volgende voorwaarden voldoet:
    • zijn nationaliteit is gelijk aan "Nederlandse"
    • hij voldoet aan ten minste één van de volgende voorwaarden:
        •• hij is student
        •• hij is werknemer
        •• zijn leeftijd is groter dan 65 jr
```

The visitor builds a **recursive AST structure** (builder.py:1853-1965):

```python
SamengesteldPredicaat(
    kwantificatie=Kwantificatie(type=ALLE),
    voorwaarden=[
        GenesteVoorwaardeInPredicaat(
            niveau=1,  # Single bullet (•)
            voorwaarde=VergelijkingInPredicaat(
                type="comparison",
                attribuut="nationaliteit",
                operator=GELIJK_AAN,
                waarde="Nederlandse")),
        GenesteVoorwaardeInPredicaat(
            niveau=1,  # Single bullet (•)
            voorwaarde=SamengesteldPredicaat(  # Nested compound!
                kwantificatie=Kwantificatie(type=TEN_MINSTE, aantal=1),
                voorwaarden=[
                    GenesteVoorwaardeInPredicaat(
                        niveau=2,  # Double bullet (••)
                        voorwaarde=VergelijkingInPredicaat(type="kenmerk_check")),
                    GenesteVoorwaardeInPredicaat(
                        niveau=2,  # Double bullet (••)
                        voorwaarde=VergelijkingInPredicaat(type="kenmerk_check")),
                    # ...
                ]))
    ]
)
```

The engine **evaluates recursively** with quantifier logic (engine.py:4042-4087):

```python
def _evaluate_samengesteld_predicaat(self, predicaat, instance):
    # Count how many conditions are met
    conditions_met = 0
    for geneste_voorwaarde in predicaat.voorwaarden:
        if isinstance(geneste_voorwaarde.voorwaarde, SamengesteldPredicaat):
            # RECURSIVE call for nested compound predicates
            result = self._evaluate_samengesteld_predicaat(
                geneste_voorwaarde.voorwaarde, instance)
        else:
            # Base case: evaluate simple condition
            result = self._evaluate_vergelijking(geneste_voorwaarde.voorwaarde)

        if result:
            conditions_met += 1

    # Apply quantifier logic
    if predicaat.kwantificatie.type == ALLE:
        return conditions_met == len(predicaat.voorwaarden)  # ALL must be true
    elif predicaat.kwantificatie.type == TEN_MINSTE:
        return conditions_met >= predicaat.kwantificatie.aantal  # AT LEAST N
    elif predicaat.kwantificatie.type == GEEN:
        return conditions_met == 0  # NONE must be true
    # ...
```

The bullet level (`niveau`) preserves visual structure but doesn't affect evaluation - only the recursive nesting matters. This allows arbitrary depth of logical conditions while maintaining readability through indentation.

### Tab Character Requirements

The EBNF specification (§13.3.9) mandates tab characters (`\t`) as structural delimiters in exactly one context:

```
FeitType definitions: [article] <role_name> \t <object_type>
```

Example:
```regelspraak
Feittype vlucht van natuurlijke personen
    de reis[TAB]Vlucht
    de passagier[TAB]Natuurlijk persoon
```

**Problem**: Tabs are consumed by `WS -> channel(HIDDEN)`, making them invisible to parser rules. The grammar cannot use tabs as structural tokens.

**Solution**: The visitor (`visitRolDefinition`) accesses the raw input stream to detect and split on tabs:
```python
full_text = input_stream.getText(start_idx, stop_idx)
if '\t' in full_text:
    parts = full_text.split('\t', 1)  # role_name | object_type
```

This couples the visitor to input encoding but preserves the specification's natural formatting requirements for disambiguating complex multi-word role names from object types.

**Other Tab Usage**: Tabs also appear in attributes, enumerations, and variable definitions for visual alignment. These are stylistic only - the parser accepts both spaces and tabs, with no special handling required.

## Engineering Trade-offs

### Memory vs Performance

**Choice**: 1000+ lexer tokens creating large DFA
**Benefit**: Predictable O(n) tokenization without backtracking
**Cost**: ~10MB memory overhead for DFA tables
**Alternative rejected**: Smaller vocabulary with parser backtracking - exponential worst case

### Grammar Permissiveness vs Visitor Complexity

**Choice**: Grammar accepts linguistically plausible constructs
**Benefit**: Natural Dutch phrasing works without modification
**Cost**: 5000+ line visitor with complex heuristics
**Alternative rejected**: Strict grammar - users must learn formal syntax

### Immutability vs Construction Complexity

**Choice**: Frozen AST dataclasses
**Benefit**: Thread-safe, no defensive copying, safe location sharing
**Cost**: Complex field computation before instantiation
**Alternative rejected**: Mutable AST - race conditions in parallel evaluation

### Python Target Limitations

**Cannot use**: Lexer modes, semantic predicates, embedded actions
**Workarounds**: Manual token ordering, visitor heuristics, raw stream access
**Cost**: Platform-specific code, manual maintenance of precedence
**Alternative rejected**: Java target - Python ecosystem required

## Critical Integration Points

### Three Files That Must Change Together

Any change to navigation syntax requires synchronized updates:

1. **Grammar** (`RegelSpraak.g4:587-589`): Parse structure
2. **Builder** (`builder.py:1353-1407`): Path reversal logic
3. **Engine** (`engine.py:2140-2189`): Resolution algorithm

Example: Adding possessive pronouns requires grammar rule, visitor detection, and engine resolution support.

### Order Dependencies That Break Everything

1. **Lexer token order** - Multi-word before constituents (fatal if violated)
2. **Definition before usage** - Domain model builds incrementally (forward references fail)
3. **Parameter declaration before reference** - parameter_names must be populated (ambiguity if missing)

### Heuristics That Can't Be in Grammar

These ambiguities require domain knowledge unavailable during parsing. The grammar accepts all linguistically valid patterns, leaving semantic resolution to the visitor.

#### 1. "van" Navigation vs Dimension Disambiguation

The EBNF allows "van" in both contexts without distinction:
- **Navigation** (§13.4.1): `[<kwantificatie>] <attribuutmetlidwoord> "van" <onderwerpketen>`
- **Dimension** (§13.3.7): Prepositional dimensions use "van" after attributes

**RegelSpraak Examples:**
```regelspraak
# Dimension: "van" introduces temporal dimension (spec §3.8.2, line 694)
"het inkomen van vorig jaar"       # vorig jaar is a dimension label

# Navigation: "van" chains through relationships (test_beslistabel.py:190)
"de postcode van het adres"        # Navigate from person → address → postcode
```

**Visitor Heuristic** (builder.py lines 1156-1227):
```python
# Lists include all current keywords
dimension_keywords = ["jaar", "maand", "dag", "kwartaal", "periode", "vorig", "huidig", "volgend"]
navigation_indicators = ["alle", "de", "het", "een", "zijn", "haar", "hun"]

# Scan right-to-left to find the rightmost navigation "van"
nav_start_idx = -1
for i in range(len(parts) - 1, 0, -1):
    part_strip = parts[i].strip()
    first_word = part_words[0].lower()

    if any(keyword in part_strip.lower() for keyword in dimension_keywords):
        if i == 1 and nav_start_idx == -1:  # Pure dimension pattern
            prepositional_dimension = part_strip
            attribute_part = parts[0].strip()
    elif first_word in navigation_indicators:
        nav_start_idx = i  # Mark navigation start, keep looking right

# Fallback: check capitalization if no clear indicators
if nav_start_idx < 0 and parts[1][0].isupper():  # Likely object type
    # Treat as navigation

# Also rescan raw_attribute_text for dimension patterns (lines 1208-1227)
```

#### 2. Adjective: Dimensional vs Descriptive

The EBNF (§13.3.7) defines adjectival dimensions positioned before attributes without preposition, but the grammar cannot distinguish dimensional from regular adjectives.

**RegelSpraak Examples:**
```regelspraak
# Dimensional adjective (defined in Dimensie)
"het bruto inkomen"                # "bruto" is a dimension label

# Descriptive adjective (not dimensional)
"de mooie auto"                    # "mooie" is just descriptive
```

**Visitor Heuristic** (builder.py lines 1299-1313):
```python
known_dimension_labels = ["bruto", "netto", "vorig", "huidig", "volgend"]
potential_label = attr_words[0].lower()

# Only create dimension label if it's a known dimension keyword
if potential_label in known_dimension_labels:
    dimension_labels.append(DimensionLabel(label=attr_words[0]))
    actual_attribute_name = " ".join(attr_words[1:])
else:
    # Keep full attribute name intact - not dimensional
    actual_attribute_name = full_text
```

#### 3. Pronoun Reference Resolution

The EBNF specification (§3.1.1, §5.5.4) defines pronoun scoping: possessive pronouns ('zijn'/'haar') can only be used with animate object types when there's a single animate subject in scope.

**RegelSpraak Examples:**
```regelspraak
# Specified behavior: refers to current instance (§5.5.4)
"zijn inkomen"                     # Income of current object being evaluated

# Not specified: navigation context pronouns
"zijn vorige werkgever"            # Would need context from navigation path (not in spec)
```

**Visitor Resolution** (builder.py lines 1425-1467):
```python
if pronoun_text in ["zijn", "haar"]:
    base_name = "self"  # Map to current instance marker

# Creates: AttributeReference(path=["self", attribute_name])
# Engine later resolves (engine.py lines 1354, 2296, 2463, 3272, 3295):
if path_element == "self":
    current_obj = context.current_instance
```

#### 4. Compound Words: Single Attribute vs Navigation

The specification allows multi-word attribute names, but the grammar cannot distinguish these from navigation paths.

**RegelSpraak Examples:**
```regelspraak
Objecttype Natuurlijk persoon
    # Single compound attribute (defined as one attribute)
    de belasting op basis van afstand Bedrag;

# Usage looks like navigation but isn't:
"de belasting op basis van afstand van een passagier"
# → ["passagier", "belasting op basis van afstand"] (NOT navigation)

# Actual navigation through relationships:
"het adres van de persoon"
# → ["persoon", "adres"] (IS navigation via FeitType)
```

**Visitor Heuristic** (builder.py lines 1138-1147):
```python
is_compound_attribute = False
if " van " in raw_attribute_text or " op " in raw_attribute_text:
    # Check if this compound name exists as attribute in domain model
    for obj_type in self.domain_model.objecttypes.values():
        if raw_attribute_text in obj_type.attributen:
            is_compound_attribute = True
            attribute_part = raw_attribute_text  # Use full text
            break

if not is_compound_attribute:
    # Split and treat as navigation
    parts = raw_attribute_text.split(" van ")
```

These heuristics demonstrate why semantic understanding must drive syntactic analysis in natural language processing. The visitor implements domain-aware disambiguation that the context-free grammar cannot express.

### Performance Cliffs

1. **Adding keywords** - Each multi-word token multiplies DFA states exponentially
2. **Timeline evaluation without date** - Engine must check every rule for temporal context
3. **Dimension coordinate explosion** - Each dimension multiplies evaluation paths
4. **Deep navigation chains** - Stack overflow possible without depth limits

## Lessons Learned

### Why This Isn't a Typical Compiler

Traditional compilers enforce syntax to simplify semantics. RegelSpraak inverts this: simple syntax with complex semantic resolution. The grammar stages data for heuristics rather than enforcing correctness.

Users write: "de leeftijd van de partner"
Not: "partner.getAge()" or "SELECT age FROM partner"

This fundamental difference drives every architectural decision.

### What Makes Dutch Particularly Challenging

1. **Free word order** - "de persoon zijn leeftijd" = "de leeftijd van de persoon"
2. **Article floating** - "de" can attach to various phrase components
3. **Gender agreement** - DIE (plural/common) vs DAT (neuter) for subselectie
4. **Compound words** - "belastingaangifte" could be one word or navigation
5. **Implicit relationships** - "zijn" implies possession without explicit object

### Why Semantic Heuristics Beat Syntactic Rules

Encoding Dutch rules in grammar creates unmaintainable complexity:

```antlr
// Would need gender, number, case for every noun
// Would need verb agreement rules
// Would need word order variations
// Result: 10,000+ line grammar nobody understands
```

Instead: permissive grammar + visitor heuristics = maintainable solution.

### When to Extend Grammar vs Visitor

**Extend grammar when**:
- Adding new statement types (new rule structures)
- Introducing operators (new tokens)
- Changing fundamental syntax (new patterns)

**Extend visitor when**:
- Refining disambiguation logic
- Adding semantic validation
- Improving error messages
- Handling new Dutch phrasings

The grammar defines structure, the visitor defines meaning.

## Testing Recommendations

### Token Order Regression Tests

Generate assertion list from lexer:
```python
def test_token_precedence():
    tokens = extract_lexer_tokens('RegelSpraakLexer.g4')
    assert tokens.index('IS_GROTER_OF_GELIJK_AAN') < tokens.index('IS')
    assert tokens.index('VAN_HET_TYPE') < tokens.index('VAN')
```

Any reordering fails immediately, preventing subtle parsing bugs.

### Disambiguation Coverage

Extract heuristics into testable functions:
```python
def test_dimension_detection():
    assert is_dimension_adjective("bruto", "inkomen") == True
    assert is_dimension_adjective("mooie", "auto") == False
    assert detect_dimension_pattern("inkomen van vorig jaar") == "vorig jaar"
```

### Performance Benchmarks

Profile critical paths:
```python
def benchmark_timeline_parsing():
    start = time.time()
    parse_document('timeline_heavy_rules.regelspraak')  # 1000+ tokens
    assert time.time() - start < 1.0  # Sub-second for 1000 tokens
```

Alert on regression before expanding vocabulary.

## Conclusion

The RegelSpraak parser succeeds by embracing, not fighting, natural language complexity. Its architecture deliberately couples three layers (grammar, visitor, engine) to stage ambiguity resolution across phases. The aggressive lexicalization, stateful visitor, and deferred resolution patterns emerge from Dutch linguistic requirements, not engineering preference.

New engineers must understand: this isn't a broken compiler that needs fixing. It's a natural language processor disguised as a parser. The complexity in builder.py isn't technical debt - it's the price of letting Dutch speakers write Dutch.

The fundamental insight: when parsing natural language, semantic understanding must drive syntactic analysis, not vice versa. The RegelSpraak architecture inverts traditional compiler design to achieve this, creating a system where business users write rules in their language, not ours.