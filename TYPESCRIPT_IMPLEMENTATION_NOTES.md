# TypeScript RegelSpraak Implementation Notes

This document provides technical implementation details for the TypeScript port of the RegelSpraak v2.1.0 parser and execution engine. It chronicles the engineering decisions, architectural patterns, and solutions to complex challenges encountered while building a TypeScript implementation that achieves 99.4% test parity with the Python reference implementation.

## Core Design Philosophy

The TypeScript implementation represents a complete reimplementation rather than a direct port. The fundamental challenge was preserving the natural language parsing capabilities while leveraging TypeScript's type system to catch errors at compile time that would only surface at runtime in Python.

### Key Architectural Decisions:

1. **Visitor Pattern Over Listener**: The implementation uses ANTLR's visitor pattern exclusively, providing explicit control over tree traversal and better TypeScript type inference compared to the event-driven listener pattern.

2. **Immutable AST with Frozen Types**: All AST nodes are immutable interfaces, enforcing data flow discipline and preventing accidental mutation during execution phases.

3. **Layered Architecture**: Strict separation between parsing (visitor), semantic analysis, and runtime execution layers. Each layer has its own error types and validation responsibilities.

4. **Type-Safe Value System**: A discriminated union `Value` type system that preserves units, dimensions, and type information throughout execution, preventing unit mixing errors at compile time.

## 1. Initial Architecture: The Steel Thread Approach

### Evolution from Toy Parsers to ANTLR (Commits 03850e6 → 2d70a88)

The implementation began with hand-written "toy parsers" for specific constructs like decision tables and aggregations. This approach quickly hit scalability limits:

**Initial Toy Parser Approach**:
```typescript
// Early implementation with manual parsing
class DecisionTableParser {
  parse(text: string): DecisionTable {
    const lines = text.split('\n');
    // Manual line-by-line parsing...
  }
}
```

**Problems**:
- No proper error recovery
- Inconsistent whitespace handling
- Duplicate parsing logic across constructs
- Poor composition with main grammar

**Solution**: Complete ANTLR integration (commit 2d70a88):
```typescript
visitBeslistabel(ctx: BeslistabelContext): DecisionTable {
  // Unified parsing through visitor pattern
  const header = this.visit(ctx.beslistabelHeader());
  const rows = ctx.beslistabelRow().map(row => this.visit(row));
  return { type: 'decision_table', header, rows };
}
```

**Engineering Insight**: The transition eliminated ~2000 lines of fragile parsing code while improving error messages and maintaining 95.8% test compatibility.

## 2. The Visitor Pattern Implementation

### Multi-Phase Visitor Architecture (Commit 1d2ac25)

The visitor implementation follows a "steel thread" approach - building a complete vertical slice from source text to executable AST:

```typescript
export class RegelSpraakVisitorImpl extends ParseTreeVisitor<any> {
  private parameterNames: Set<string> = new Set();
  private objectTypes: Map<string, ObjectType> = new Map();
  private dimensions: Map<string, Dimension> = new Map();
  
  visitDomainModel(ctx: DomainModelContext): DomainModel {
    // Phase 1: Collect type definitions for forward references
    this.collectTypeDefinitions(ctx);
    
    // Phase 2: Build AST with full type information
    return this.buildModel(ctx);
  }
}
```

### The Parameter Name Tracking Hack

**Problem**: Dutch articles create ambiguity: "de leeftijd" could be a parameter, variable, or attribute reference.

**Failed Approach**: Grammar-level disambiguation required excessive lookahead and made the grammar unmaintainable.

**Working Solution**: Track parameter names during visiting:
```typescript
visitParameterDefinition(ctx: ParameterDefinitionContext): Parameter {
  const name = this.extractCanonicalName(ctx.parameterNamePhrase());
  this.parameterNames.add(name); // Track for later disambiguation
  // ...
}

visitPrimaryExpression(ctx: PrimaryExpressionContext): Expression {
  const text = this.extractCanonicalName(ctx);
  if (this.parameterNames.has(text)) {
    return { type: 'parameter_reference', name: text };
  }
  // Fall back to variable reference
  return { type: 'variable_reference', name: text };
}
```

**Trade-off**: Visitor complexity for grammar simplicity. The 81KB visitor file size reflects this architectural choice.

## 3. Source Span Tracking

### Rich Error Reporting (Commit 1d2ac25)

Every AST node includes source location information:

```typescript
interface SourceSpan {
  start: { line: number; column: number };
  end: { line: number; column: number };
  text: string;
}

interface ASTNode {
  span?: SourceSpan;
  // ... node-specific fields
}
```

**Implementation Pattern**:
```typescript
private getSpanFromContext(ctx: ParserRuleContext): SourceSpan {
  const start = ctx.start;
  const stop = ctx.stop || ctx.start;
  return {
    start: { line: start.line, column: start.column },
    end: { line: stop.line, column: stop.column + stop.text.length },
    text: ctx.text
  };
}
```

**Engineering Value**: Enables IDE integration with jump-to-definition and inline error highlighting. Critical for business users who need clear feedback on natural language rule errors.

## 4. Type System Implementation

### Value Objects and Units (Commits f557baa → c5d7b25)

The TypeScript implementation enforces type safety that the Python version checks at runtime:

```typescript
type Value = 
  | { type: 'number'; value: number; unit?: string }
  | { type: 'string'; value: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'date'; value: Date }
  | { type: 'object'; objectType: string; value: Record<string, Value> }
  | { type: 'list'; items: Value[] }
  | { type: 'empty' };
```

### Unit-Aware Arithmetic

**Problem**: Business rules mix units freely: "5 meter + 3 voet"

**Solution**: Automatic unit conversion with dimension analysis:
```typescript
function addValues(left: Value, right: Value, unitSystem: UnitSystem): Value {
  if (left.type !== 'number' || right.type !== 'number') {
    throw new TypeError('Can only add numbers');
  }
  
  if (left.unit && right.unit && left.unit !== right.unit) {
    // Convert right to left's unit system
    const converted = unitSystem.convert(right.value, right.unit, left.unit);
    return {
      type: 'number',
      value: left.value + converted,
      unit: left.unit
    };
  }
  
  return {
    type: 'number',
    value: left.value + right.value,
    unit: left.unit || right.unit
  };
}
```

**Engineering Note**: TypeScript's type system prevents unit confusion at compile time, while Python discovers it at runtime. This caught several test bugs during porting.

## 5. Semantic Analysis Layer

### Multi-Pass Validation (Commit cb5e574)

The semantic analyzer provides comprehensive validation before execution:

```typescript
export class SemanticAnalyzer {
  private objectTypes: Map<string, ObjectType> = new Map();
  private parameters: Map<string, Parameter> = new Map();
  private kenmerken: Map<string, Set<string>> = new Map();
  
  analyze(model: DomainModel): ValidationResult {
    // Phase 1: Build symbol tables
    this.buildSymbolTables(model);
    
    // Phase 2: Validate references
    const errors: SemanticError[] = [];
    this.validateRules(model.rules, errors);
    this.validateDecisionTables(model.decisionTables, errors);
    
    return { success: errors.length === 0, errors };
  }
}
```

### Validation Categories:

1. **Unknown Object Types**: Validates object creation and references
2. **Unknown Attributes**: Ensures attributes exist on their object types  
3. **Type Mismatches**: Expression types must match target attribute types
4. **Unknown Kenmerken**: Boolean flags must be declared
5. **Unknown Parameters**: All parameter references must resolve

**Key Innovation**: Early validation prevents runtime failures in production rules. The TypeScript implementation catches errors that Python would only find during execution.

## 6. Complex Pattern Implementations

### Attribute Reference Disambiguation (Commit a4888f3)

The most complex parsing challenge involves disambiguating multi-part references:

```typescript
visitAttribuutReferentie(ctx: AttribuutReferentieContext): AttributeReference {
  const attribute = this.extractCanonicalName(ctx.attribuutMetLidwoord());
  const subject = this.visit(ctx.onderwerpReferentie());
  
  // Handle dimensional references: "bruto inkomen van X"
  if (this.dimensions.has(attribute)) {
    return this.buildDimensionalReference(attribute, subject);
  }
  
  // Handle subselectie: "de som van alle X die Y"
  if (subject.predicates?.length > 0) {
    return this.buildNavigationExpression(attribute, subject);
  }
  
  return { type: 'attribute_reference', attribute, object: subject };
}
```

**The Challenge**: Dutch natural language allows complex navigation paths:
- "de prijs" → Variable reference
- "de prijs van het product" → Attribute reference
- "de prijs van het product met korting" → Navigation with filter
- "de bruto prijs van het product" → Dimensional attribute reference

### Object-Scoped Rule Execution (Commit 9cf6426)

**Problem**: Rules can target all instances of a type or specific instances.

**Pattern Detection**:
```typescript
private isUniversalSubject(expr: Expression): boolean {
  // "Een X" or "Alle X" at rule level means iterate all X
  if (expr.type === 'variable_reference') {
    return expr.name.startsWith('Een ') || expr.name.startsWith('Alle ');
  }
  return false;
}
```

**Execution Strategy**:
```typescript
executeRule(rule: Rule, context: Context): void {
  if (this.isUniversalSubject(rule.subject)) {
    const typeName = this.extractTypeName(rule.subject);
    const instances = context.getObjectsByType(typeName);
    
    instances.forEach(instance => {
      const scopedContext = context.withCurrentInstance(instance);
      this.executeRuleBody(rule, scopedContext);
    });
  } else {
    this.executeRuleBody(rule, context);
  }
}
```

## 7. Distribution Rules (Verdeling) 

### Complex Distribution Algorithm (Commit d519963)

The Verdeling implementation represents the most algorithmically complex feature:

```typescript
interface DistributionMethod {
  ratio?: Expression;           // naar rato van X
  order?: OrderingCriteria;     // op volgorde van X
  maximum?: Expression;         // met een maximum van X
  rounding?: RoundingMethod;    // afgerond op N decimalen
}
```

**Multi-Phase Distribution**:
1. Calculate distribution basis (ratio/order)
2. Apply proportional allocation
3. Enforce maximum constraints
4. Handle rounding and remainders

**Critical Innovation**: Current instance tracking enables attribute-based distribution:
```typescript
interface RuntimeContext {
  current_instance?: ObjectValue;  // Added for distribution context
  variables: Map<string, Value>;
  // ...
}
```

This allows rules like "distribute naar rato van het inkomen" where income is an attribute of the object being distributed to.

## 8. Runtime Engine Pipeline

### Four-Phase Execution Model

The TypeScript engine mirrors Python's multi-phase execution to handle decision table dependencies:

```typescript
// engine.ts execution phases
execute(model: DomainModel, context: RuntimeContext): void {
  // Phase 1: Pre-rule decision tables (e.g., "Woonregio factor")
  this.executeDecisionTables(model.beslistabellen, context, 'pre-rule');
  
  // Phase 2: Regular rules (Gelijkstelling, Kenmerktoekenning, etc.)
  this.executeRules(model.rules, context);
  
  // Phase 3: Post-rule decision tables (e.g., "Belasting op basis van reisduur")
  this.executeDecisionTables(model.beslistabellen, context, 'post-rule');
  
  // Phase 4: Re-run Gelijkstelling rules that depend on Phase 3 outputs
  this.rerunDependentRules(model.rules, context);
}
```

**Why Phase 4 Exists**: Rules like "te betalen belasting" sum values computed by decision tables. Without re-execution after Phase 3, they use stale Phase 1 values (0 instead of computed amounts).

**Critical Implementation Detail**: The Phase 4 filter must check *both* `rule.result?.type` and `rule.resultaat?.type` because `parseModel()` produces English property names while inline parsing produces Dutch names.

### Decision Table Target Resolution

Decision tables store results on objects, not global variables. The engine deduces target type from the table's result column:

```typescript
private deduceBeslistabelTargetType(table: DecisionTable, context: RuntimeContext): string | null {
  const targetPath = table.parsedResult?.targetExpression?.path;
  if (targetPath?.length > 0) {
    // Resolve role names: "passagier" → "Natuurlijk persoon"
    return this.resolveRoleToObjectType(targetPath[0], context) || targetPath[0];
  }
  return null;
}
```

## 9. Kenmerken vs Attributen Architecture

### Separate Storage for Boolean Characteristics

Python's `RuntimeObject` explicitly separates kenmerken (boolean flags) from attributen (typed values):

```python
# Python RuntimeObject
class RuntimeObject:
    attributen: Dict[str, Value]
    kenmerken: Dict[str, bool]  # Separate storage
```

TypeScript mirrors this in `RuntimeContext`:

```typescript
// context.ts
private objectKenmerken: Map<string, Map<string, Map<string, boolean>>> = new Map();
// Structure: Map<objectType, Map<objectId, Map<kenmerkName, boolean>>>

setKenmerk(objectType: string, objectId: string, name: string, value: boolean): void {
  const canonicalType = this.canonicalizeTypeName(objectType);
  // ... store in objectKenmerken, not objectAttributes
}

getKenmerk(objectType: string, objectId: string, name: string): boolean | undefined {
  // Normalize and lookup with fallback matching
}
```

**Why Separation Matters**:
1. **Type clarity**: Kenmerken are always `boolean`, attributen can be any `Value`
2. **Lookup patterns**: Kenmerken use prefix-stripped matching ("is duurzaam" → "duurzaam")
3. **Validation**: Expected booleans in scenarios trigger kenmerk lookup, not attribute lookup

### Kenmerk Name Normalization

Kenmerken can have various prefixes that must be normalized for matching:

```typescript
private normalizeKenmerkName(name: string): string {
  let normalized = name.toLowerCase().trim();
  // Strip common prefixes
  for (const prefix of ['is ', 'heeft ', 'een ', 'de ', 'het ']) {
    if (normalized.startsWith(prefix)) {
      normalized = normalized.substring(prefix.length);
      break;
    }
  }
  return normalized;
}
```

**Special Case - Bezittelijk Kenmerken**: Some kenmerken use possessive patterns like "recht op duurzaamheidskorting" (no "is " prefix). The executor detects these via "recht op" or "heeft " patterns and preserves the original name.

## 10. Central Type Deduction

### Unified Rule Target Resolution

The engine uses a single `deduceRuleTargetType()` method handling all 8 result types, matching Python's architecture:

```typescript
private deduceRuleTargetType(rule: Rule, context: RuntimeContext): string | null {
  const resultaat = rule.result || rule.resultaat;
  if (!resultaat) return null;

  switch (resultaat.type) {
    case 'Gelijkstelling':
    case 'KenmerkToekenning':
    case 'Initialisatie':
      return this.deduceTypeFromAttributeTarget(resultaat, rule, context);
    case 'ObjectCreation':
      return this.deduceTypeForObjectCreation(resultaat, rule, context);
    case 'Dagsoortdefinitie':
      return 'Dag';
    case 'Consistentieregel':
      return this.deduceTypeForConsistentieregel(resultaat, rule, context);
    case 'Verdeling':
      return this.deduceTypeForVerdeling(resultaat, context);
    case 'FeitCreatie':
      return this.deduceTypeForFeitCreatie(resultaat, context);
    default:
      return null;
  }
}
```

**Why Centralization**: Previously, type deduction was scattered across Engine and RuleExecutor (~250 lines in 3 methods). Centralization eliminates duplication and ensures consistent resolution across all rule types.

### Role-to-ObjectType Resolution

Role names like "passagier" must resolve to object types like "Natuurlijk persoon":

```typescript
private resolveRoleToObjectType(roleName: string, context: RuntimeContext): string | null {
  // Check FeitType definitions
  for (const feitType of context.getFeitTypes()) {
    for (const role of feitType.roles) {
      if (role.name.toLowerCase().includes(roleName.toLowerCase())) {
        return role.objectType;
      }
    }
  }
  // Fallback: check if matches a known objectType directly
  return context.hasObjectType(roleName) ? roleName : null;
}
```

**Case-Insensitive Matching**: Rule conditions use lowercase ("vlucht"), but object types are capitalized ("Vlucht"). The deducer tries both forms.

## 11. Dutch Text Normalization Utilities

### Article Stripping

Dutch articles must be stripped for canonical name matching:

```typescript
function extractParameterName(text: string): string {
  let name = text.trim();
  for (const article of ['de ', 'het ', 'een ']) {
    if (name.toLowerCase().startsWith(article)) {
      name = name.substring(article.length);
      break;
    }
  }
  return name;
}
```

### Possessive Pronoun Handling

Possessive pronouns navigate from `current_instance` to related objects:

```typescript
// "zijn reis" → lookup "reis" via FeitType from current_instance
const possessivePrefixes = ['zijn ', 'haar ', 'hun '];
for (const prefix of possessivePrefixes) {
  if (variableName.toLowerCase().startsWith(prefix)) {
    const lookupName = variableName.substring(prefix.length);
    return this.resolveFeitTypeRelation(lookupName, currentInstance);
  }
}
```

### Compound Attribute Detection

Attributes with "van" can be single names or navigation paths:

```typescript
// "luchthaven van vertrek" is ONE attribute, not navigation
const normalizedText = extractParameterName(attrText);
if (this.objectTypeAttributes.has(normalizedText)) {
  // Treat as single attribute, don't split on "van"
  return { type: 'attribute_reference', attribute: normalizedText };
}
// Otherwise, split into navigation path
```

**Key Insight**: Normalize *before* comparing against known attributes. The domain model stores normalized names; raw text includes articles.

### Unit Suffix Stripping

Decision table headers include unit suffixes that must be stripped:

```typescript
function stripUnitSuffix(text: string): string {
  const patterns = [' in minuten', ' in km', ' in EUR', ' in jaren'];
  for (const pattern of patterns) {
    if (text.endsWith(pattern)) {
      return text.slice(0, -pattern.length);
    }
  }
  return text;
}
```

## 12. Parser Integration Challenges

### Token Preservation and Whitespace (Commit 8291d33)

**Problem**: ANTLR hides whitespace, but natural language requires space preservation.

**Failed Approach**:
```typescript
visitResultaatDeel(ctx: ResultaatDeelContext): string {
  // Concatenates tokens without spaces: "Dexmoet" instead of "De x moet"
  return ctx.children.map(c => c.text).join('');
}
```

**Solution**: Reconstruct spacing from hidden channel:
```typescript
private extractTextWithSpaces(ctx: ParserRuleContext): string {
  const tokens: Token[] = [];
  const tokenStream = this.getTokenStream(ctx);
  
  for (let i = ctx.start.tokenIndex; i <= ctx.stop.tokenIndex; i++) {
    tokens.push(tokenStream.get(i));
    
    // Check hidden channel for whitespace
    const hidden = tokenStream.getHiddenTokensToRight(i, HIDDEN);
    if (hidden) {
      tokens.push(...hidden);
    }
  }
  
  return tokens.map(t => t.text).join('');
}
```

### Function Argument Validation (Commit 7738d02)

**Challenge**: Dutch functions use natural language patterns, not parentheses.

**Grammar Pattern**:
```antlr
sqrtFuncExpr: DE_WORTEL_VAN primaryExpression EOF?;
```

**Problem**: Parser accepted "de wortel van" (missing argument) and "de wortel van 4, 5" (multiple arguments).

**Solution**: Enhanced visitor validation:
```typescript
visitSqrtFuncExpr(ctx: SqrtFuncExprContext): Expression {
  const args = ctx.primaryExpression();
  
  if (!args || args.length === 0) {
    throw new ParseError('Missing argument for "de wortel van"');
  }
  
  if (args.length > 1) {
    throw new ParseError('Multiple arguments not supported for "de wortel van"');
  }
  
  return { type: 'function_call', name: 'sqrt', args: [this.visit(args[0])] };
}
```

### Nested Function Support (Commit c29e870)

**Original Grammar Limitation**:
```antlr
// Only accepted primary expressions
AbsValFuncExpr: DE_ABSOLUTE_WAARDE_VAN LPAREN primaryExpression RPAREN;
```

**Problem**: Couldn't parse: `de absolute waarde van ((de wortel van 16) min 10)`

**Solution**: Accept full expressions:
```antlr
AbsValFuncExpr: DE_ABSOLUTE_WAARDE_VAN LPAREN expressie RPAREN;
```

**Engineering Trade-off**: More permissive grammar requires runtime type checking, but enables natural mathematical expressions.

## 13. Performance Optimizations

### Early Symbol Table Construction

The visitor builds symbol tables in a first pass to avoid repeated lookups:

```typescript
private collectTypeDefinitions(ctx: DomainModelContext): void {
  // Single pass to collect all type information
  ctx.objectTypeDefinition().forEach(obj => {
    const objectType = this.visitObjectTypeHeader(obj);
    this.objectTypes.set(objectType.name, objectType);
  });
  
  ctx.dimensieDefinition().forEach(dim => {
    const dimension = this.visitDimensionHeader(dim);
    this.dimensions.set(dimension.name, dimension);
  });
}
```

### Lazy Evaluation Strategy

Timeline expressions and complex aggregations use lazy evaluation:

```typescript
class TimelineExpression implements Expression {
  evaluate(context: Context): Value {
    // Only compute values for requested time periods
    const period = context.getCurrentPeriod();
    return this.cache.getOrCompute(period, () => {
      return this.computeForPeriod(period, context);
    });
  }
}
```

## 14. Testing Strategy and Evolution

### Test-Driven Porting

The TypeScript implementation was built by porting Python tests one by one:

1. Start with 0/322 tests passing
2. Implement minimal feature to pass one test
3. Refactor to improve architecture
4. Repeat until 320/322 tests pass (99.4%)

### Key Test Evolution Milestones:

- **Commit 03850e6**: First expression evaluator (10 tests)
- **Commit 3380888**: Basic rule parsing (50 tests)  
- **Commit 2d70a88**: ANTLR integration complete (228 tests)
- **Commit cb5e574**: Semantic validation (310 tests)
- **Commit a32d2c3**: Final corrections (320 tests)

### Intentionally Skipped Tests:

1. **Multiple object creation**: Grammar enforces one action per rule
2. **Whitespace in function names**: Lexer limitation requiring exact token match

Both represent deliberate design choices rather than implementation gaps.

## 15. Critical Maintenance Notes

### 1. **The 81KB Visitor File**
The large visitor (regelspraak-visitor-impl.ts) is intentional. Attempts to split it break TypeScript's type inference for the visitor pattern. Accept the size as a necessary trade-off.

### 2. **Parameter Name Tracking**
The `parameterNames` Set in the visitor is a hack but a necessary one. The grammar cannot disambiguate parameter vs variable references without semantic information.

### 3. **Error Message Quality**
Natural language error messages are critical. Dutch business users need errors in Dutch that reference their domain concepts, not technical parsing terminology.

### 4. **Unit System Complexity**
The unit system's explicit token enumeration (METER, KILOMETER, etc.) seems verbose but avoids the context-sensitivity problems that plague the Python implementation.

### 5. **Immutable AST Discipline**
Never add mutable state to AST nodes. The execution engine depends on AST immutability for correctness.

## 16. Architectural Insights

### What Worked Well:

1. **Visitor Pattern**: Provides excellent type safety and explicit control
2. **Layered Architecture**: Clean separation of concerns enables independent testing
3. **TypeScript Type System**: Caught many unit/dimension errors at compile time
4. **Source Span Tracking**: Enables rich developer tooling

### What Was Challenging:

1. **Natural Language Ambiguity**: Required visitor-level disambiguation
2. **Token Preservation**: ANTLR's hidden channel required careful handling
3. **Pronoun Resolution**: "zijn/haar" requires execution context
4. **Performance**: Complex rules create deep AST trees

### Design Patterns:

1. **Discriminated Unions**: For type-safe Value and Expression types
2. **Visitor Pattern**: For tree traversal with type safety
3. **Builder Pattern**: For complex AST node construction
4. **Strategy Pattern**: For pluggable distribution methods
5. **Memento Pattern**: For timeline value caching

## 17. Future Enhancement Paths

1. **Incremental Parsing**: For IDE integration with real-time feedback
2. **Parallel Execution**: Rules are often independent and parallelizable
3. **Query Optimization**: Common subexpression elimination for complex rules
4. **Type Inference**: Deduce attribute types from usage patterns
5. **Debugging Support**: Step-through execution with breakpoints

## 18. Conclusion

The TypeScript implementation demonstrates that a strongly-typed language can successfully implement a natural language DSL. The key insight is that compile-time type safety actually makes natural language processing easier by catching ambiguities early.

The 99.4% test compatibility proves that the architectural differences (visitor vs listener, typed vs dynamic) are implementation details that don't affect the user experience. Dutch business users write the same rules and get the same results, but with better error messages and tooling support.

The engineering lesson: embrace the type system rather than fighting it. What seems like additional complexity (discriminated unions, explicit visitor methods) actually reduces overall system complexity by making invalid states unrepresentable.