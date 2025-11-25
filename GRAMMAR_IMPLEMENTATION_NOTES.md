# RegelSpraak Grammar Implementation Notes

ANTLR4 parser for RegelSpraak v2.1.0 - a Dutch natural language DSL for business rules. The fundamental challenge: parsing natural Dutch within formal grammar constraints. Solution: aggressive lexical disambiguation via 1000+ tokens, with semantic resolution in the visitor layer.

## Architectural Philosophy

### Why Extreme Lexicalization
Dutch free word order + natural phrasing would cause ANTLR lookahead explosion without aggressive tokenization. The 1000+ multi-word tokens aren't over-engineering - they're the minimal set preventing ambiguous parse trees. Each comparison operator, distribution idiom, and object-creation phrase gets its own token to avoid backtracking.

### Staging for Semantics, Not Syntax
Unlike typical compilers that enforce syntactic correctness, this parser stages data for semantic heuristics. The grammar accepts linguistically plausible constructs; the visitor applies business logic. This inversion exists because Dutch speakers expect their natural phrasing to work, not to learn formal syntax.

### Natural Language as Primary Constraint
Reserved words appear inside identifiers. Pronouns navigate object graphs. Adjectives become dimensions. These aren't edge cases - they're core requirements. The architecture assumes linguistic flexibility supersedes parseability.

## Core Architecture

### Token Precedence Critical
Multi-word tokens MUST precede constituents in lexer:
```
IS_GROTER_OF_GELIJK_AAN: 'is groter of gelijk aan';  // Must come before IS, GROTER
```
ANTLR's longest-match-first rule makes this mandatory. Reordering breaks parsing.

### Whitespace on Hidden Channel
```antlr
WS: [ \t\r\n]+ -> channel(HIDDEN);
```
Not skipped - preserves formatting for multi-word token reconstruction and tab detection.

### Grammar/Visitor Trade-off
Grammar intentionally permissive. Disambiguation in visitor (builder.py) rather than grammar. Pure grammar solution would require excessive lookahead and unmaintainable context sensitivity.

## Stateful Visitor Design

### Mutable DomainModel During Traversal
The builder maintains a `DomainModel` that mutates during tree walking. Definitions parsed early immediately influence later disambiguation. This parse-order dependency is intentional - business rules reference earlier definitions, never forward-declare.

### Parameter Tracking Mechanism
`parameter_names` set shared across visitor methods distinguishes parameters from attributes. Without this stateful tracking, "de leeftijd" would be ambiguous in every context. The set populates from parameter definitions, then influences all subsequent reference resolution.

### Raw Input Stream Access
Builder re-reads original text for:
- Tab detection in FeitType roles (tabs survive only on hidden channel)
- Reconstructing multi-word names with proper spacing
- Extracting text spans for error messages

This augments ANTLR's token stream with positional information the lexer discarded.

## Three-Layer Coupling

### Navigation Path Flow
1. **Grammar**: Produces `attribuutMetLidwoord VAN onderwerpReferentie` structure
2. **Builder**: Reverses Dutch right-to-left into left-to-right path list
3. **Engine**: Pops current object type, resolves roles/dimensions along path

Change navigation syntax = update all three layers.

### Dimension Resolution Chain
1. **Grammar**: Captures full text including potential dimension labels
2. **Builder**: Detects linguistic patterns (adjectives, "van X" phrases), creates `DimensionedAttributeReference`
3. **Engine**: Maps textual labels to actual dimension definitions at evaluation time

Dimensions can't be resolved during parsing - the dimension definition might appear later in the file.

### Role Resolution Dependencies
- Builder populates `domain_model.feittypen` during definition parsing
- Object creation rules reference these roles
- Engine uses role metadata for navigation and relationship creation

Parse order matters: definitions before usage, always.

## Component Implementations

### Parameters (§3.1)
```antlr
parameterNamePhrase: (artikel)? (AANTAL)? IDENTIFIER+;
```
`AANTAL` both keyword and parameter component. Explicit inclusion allows "het aantal kinderen" while preserving aggregation functions.

### Object Types (§3.2)
```antlr
naamwoord: IDENTIFIER+;
```
Concatenates tokens with spaces. Handles "Natuurlijk persoon" but requires visitor post-processing.

### FeitType Definitions (§3.11)
Specification requires tab-separated roles:
```
[article] <role_name> \t <object_type>
```
Problem: Tabs consumed by WS token. Solution: Builder accesses raw input stream to detect tabs.

### Dimensions (§3.4)
Grammar consumes dimension info as attribute names. Visitor detects patterns:
- Adjectival: "bruto inkomen"
- Prepositional: "inkomen van vorig jaar"

Creates `DimensionedAttributeReference` nodes during AST construction.

### Expression Precedence
Standard mathematical hierarchy via rule nesting:
```antlr
logicalExpression → comparisonExpression → additiveExpression → multiplicativeExpression → powerExpression → unaryExpression → primaryExpression
```

### Unit Context Sensitivity
"jaar", "meter", etc. are both keywords and units. Solution: explicit enumeration in `unitIdentifier`:
```antlr
unitIdentifier: IDENTIFIER | JAAR | JAREN | JR | METER | KILOMETER | KM | M | ...;
```
Verbose but reliable. Lexer modes and semantic predicates fail due to Python target limitations.

### Timeline Support (§8, §10.3)
Period definitions work across all resultaat types. Timeline kenmerken require explicit `evaluation_date` parameter - raises errors when temporal context missing. Engine short-circuits timeline expressions unless evaluation date present.

### Subselectie (§10.5)
```antlr
subselectieFilter: DIE predikaat | DAT predikaat | MET attribuutReferentie vergelijkingsoperator expressie;
```
Gender agreement enforced: DIE (plural/common), DAT (neuter).

### Decision Tables
```antlr
beslistabelColumnText: ~(PIPE)+;
```
Consumes any tokens except pipes. Rigid pipe delimiters prevent ambiguity.

### Distribution Rules
Colon presence deterministically switches syntax:
- No colon: single-line
- With colon: multi-line bullet list

### Compound Predicates
```antlr
quantifier: ALLE | GEEN VAN DE | TEN_MINSTE NUMBER | TEN_HOOGSTE NUMBER | PRECIES NUMBER;
```
Bullet markers (•, ••, •••) map to logical nesting depth.

### Reference Disambiguation
"de leeftijd" could be parameter, variable, or attribute. Partial grammar solution via mandatory VAN for attributes. Visitor tracks `parameter_names` to distinguish parameters from variables.

### IS/IN Centralization
All IS/IN evaluations route through RuntimeContext methods:
- `check_is()`: type checks, kenmerken, roles
- `check_in()`: collection membership, domain enumerations

## AST Design Trade-offs

### Frozen Dataclasses
AST nodes are `@dataclass(frozen=True)`. Consequences:
- Builder must fully compute all fields before instantiation
- No post-construction corrections (e.g., dimension resolution)
- Location metadata safely shareable via immutable `SourceSpan`

Trade-off: Construction complexity for runtime safety.

### Deferred Resolution
`DimensionedAttributeReference` stores textual labels, not resolved dimensions. Timeline expressions store AST nodes, not evaluated values. This defers resolution to the engine where full context exists.

### Value Objects
All runtime values wrapped in `Value` objects with optional units. Enables unit arithmetic and null propagation without special-casing every operation.

## Why This Parser Is Different

### Linguistic Constructs as First-Class
- Bullet-structured quantifiers with nesting
- Pronouns ("zijn", "hij") navigate object graphs
- Adjectives double as dimension selectors
- Reserved words valid inside identifiers

These drive architectural decisions absent from programming language parsers.

### Parse Order Matters
Unlike forward-declaring compilers, RegelSpraak definitions must precede usage. The visitor's stateful `DomainModel` enforces this temporally - later rules see earlier definitions immediately.

### Semantic Heuristics Over Syntactic Rules
"van" might introduce navigation, dimensions, or possession. The grammar doesn't decide - the visitor inspects context and domain model. This keeps the grammar tractable while supporting natural phrasing.

## Performance Implications

### DFA Size vs Backtracking
1000+ tokens create large DFA but eliminate backtracking. Memory-intensive but predictable performance. Adding keywords is expensive - each multi-word phrase increases DFA states multiplicatively.

### Visitor Overhead
70KB+ visitor with complex heuristics. Every node visit potentially consults domain model, checks parameter sets, or reconstructs text. Consider splitting if grows beyond 100KB.

### Runtime Short-Circuits
- Timeline expressions skip evaluation without evaluation_date
- Dimension coordinates resolve lazily
- Aggregations compute only requested dimensions

These optimizations prevent eager traversal of all possibilities.

## Critical Gotchas

- **Never reorder lexer tokens** - precedence is load-bearing
- **AANTAL overloading** - fragile but necessary hack
- **_extract_canonical_name complexity** - 100+ lines indicate grammar naming inconsistencies
- **Tab character detection** - FeitType roles require raw stream access
- **Python target broken for**:
  - Lexer modes (generates invalid Python)
  - Semantic predicates (indentation errors)
  - Some embedded actions (Java idioms)
- **Unit context sensitivity** - explicit enumeration only reliable approach
- **Timeline kenmerken** - always require evaluation_date parameter
- **Grammar deliberately permissive** - expect complex visitor logic
- **Hidden channel mandatory** - changing to skip breaks multi-word tokens
- **Parse order dependencies** - definitions must precede usage

## Testing Recommendations

### Token Order Regression Tests
Generate assertion list from lexer token sequence. Any reordering should fail CI immediately.

### Disambiguation Coverage
Extract parameter/dimension heuristics into testable utilities. Cover:
- Compound attributes with "van" chains
- Subselectie with pronouns
- Dimension label detection patterns

### Performance Benchmarks
Profile tokenization/parsing of 1000+ token documents. Alert on throughput regression before expanding vocabulary.

## Maintenance Principles

1. Token order is sacred
2. Grammar permissiveness is intentional
3. Visitor complexity is the trade-off for natural language
4. Python target limitations are real - don't fight them
5. Three-layer coupling is deliberate - maintain consistency
6. Test everything - subtle breaks are common

## Key Files

- `grammar/*.g4` - ANTLR grammars (keep tokens ordered!)
- `src/regelspraak/builder.py` - AST construction with stateful heuristics
- `src/regelspraak/ast.py` - Immutable AST nodes with deferred resolution
- `src/regelspraak/semantics.py` - Validation using builder's domain model
- `src/regelspraak/runtime.py` - Execution context with IS/IN centralization
- `src/regelspraak/engine.py` - Rule evaluation with dimension/timeline resolution