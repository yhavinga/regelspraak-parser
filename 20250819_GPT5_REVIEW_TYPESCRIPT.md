## RegelSpraak v2.1.0 — Typescript Grammar & Implementation Review (2025-08-19)

**Update 2025-08-27**: Most gaps identified in this review have been fixed. See "Notable gaps vs. specification" section for current status.

### Scope
- Assessed:
  - `specification/RegelSpraak-specificatie v2.1.0.md`
  - Grammar: `grammar/RegelSpraak.g4`, `grammar/RegelSpraakLexer.g4`
  - TypeScript: `typescript/src/**` (parser bridge, visitor, AST, evaluators, engine, executors, utils)
- Focus: language completeness and architectural soundness. No code changes performed.

### Executive summary
- **Grammar**: Broad and ambitious coverage. Most major constructs from §13 are represented (definitions, rules, predicates, expressions, timelines, decision tables, distributions, dimensions, units). A few areas remain risky due to ambiguity handling and extended identifier sets.
- **TypeScript implementation**: Solid foundations (ANTLR bridge, AST/visitors, evaluators, timelines, units, decision tables, distributions). However, several spec-level features are parsed but not evaluated, or only partially implemented. The largest gaps: compound conditions evaluation, dagsoort definitions integration, regel-status conditions, some unary predicates (numeric exact digits), feit-creatie results, and timeline-scalar math.
- **Architecture**: Reasonable layering (Parser→Visitor→AST→Evaluator/Executors). Some duplication and drift between grammar-intent and evaluator capabilities (e.g., `totaal_van` vs timeline aggregation; tijdsevenredig paths; predicate handling). Recommend convergence on a single semantic pipeline for aggregations and conditions, and wiring model-level definitions (dagsoort, dimensions) into evaluation.

---

### Coverage map (high-level)
- **GegevensSpraak (§13.3)**
  - Objecttype, Parameters, Domein, Dimensie, Eenheidsysteem: Grammar and visitors present; AST nodes exist; unit systems registered into `UnitRegistry`. Dimensies parsed into model; limited runtime wiring.
  - Feittype: Grammar and visitor present; used for relationship navigation heuristics; feit-creatie result pattern is parsed in grammar but not implemented in visitor.
  - Dagsoort: Grammar present. Visitor builds unary dagsoort checks; dagsoort-definitie result not implemented; evaluator uses hardcoded day-type logic (not model-driven).
- **RegelSpraak (§13.4)**
  - Regel, Regelgroep (incl. recursive execution loop): Supported. Recursion termination relies on rule condition; safety cap present.
  - Result types: Gelijkstelling, Kenmerk-toekenning, Object-creatie, Verdeling: Implemented. Feit-creatie: not implemented.
  - Voorwaarde (INDIEN): Simple expressions: implemented; Compound conditions with quantifiers: parsed into AST but not evaluated.
  - Predicaten: Attribute comparisons and simple kenmerken supported. Samengesteld predicaat (bulleted) parsed in grammar; visitor/evaluator incomplete.
- **Expressions (§13.4.15–16)**
  - Arithmetic, comparisons, logical, parentheses: Implemented.
  - Functions: sqrt/abs/sum/aantal; tijdsduur (with unit conversion), elfproef; aantal_dagen_in (special path) implemented; several spec functions simplified or absent.
  - Aggregations: `totaal_van` exists both as timeline aggregation and as scalar/array sum — needs consolidation.
  - Timelines: Value model and evaluator implemented; `totaal`, `aantal_dagen`, `tijdsevenredig_deel_per_(maand|jaar)` exist; timeline binary ops; temporal conditions supported during aggregation.
  - Dimensions: AST support + some ad-hoc evaluation for dimensional attribute references.
- **Decision tables**: Grammar/visitor/executor implemented; header parsing heuristic; condition handling limited but functional for simple cases.
- **Distributions (§13.4.10)**: Full stack present: grammar, visitor, executor supporting gelijk, naar rato, op volgorde (+ tie-break), maximum, rounding, remainder.

---

### Notable gaps vs. specification

**Status as of 2025-08-27:**
- ✅ **FIXED** - Compound conditions (samengestelde voorwaarden) 
- ✅ **FIXED** - Dagsoort definitions (model-driven evaluation)
- ✅ **FIXED** - Regel status conditions
- ✅ **FIXED** - Unary numeric exact digits
- ✅ **FIXED** - Feit-creatie result
- ✅ **FIXED** - Timeline × scalar operations
- ✅ **FIXED** - Tijdsevenredig calculations
- ⚠️ **MINOR** - Aggregation duplication (totaal_van in two places)
- ⚠️ **MINOR** - Decision table advanced semantics
- ⚠️ **MINOR** - Dimensions runtime usage

#### Original findings (now fixed):

- **~~Compound conditions (samengestelde voorwaarden) — parse-only, not evaluated~~** ✅ FIXED
  - AST nodes are built, but evaluator has no case for `SamengesteldeVoorwaarde`.
```2220:2260:typescript/src/visitors/regelspraak-visitor-impl.ts
        type: 'Voorwaarde',
        expression
      };
...
  visitToplevelSamengesteldeVoorwaarde(ctx: any): SamengesteldeVoorwaarde {
    // Extract the quantifier
    const kwantificatie = this.visitVoorwaardeKwantificatie(ctx.voorwaardeKwantificatie());
...
    const node: SamengesteldeVoorwaarde = {
      type: 'SamengesteldeVoorwaarde',
      kwantificatie,
      voorwaarden
    };
    this.setLocation(node, ctx);
    return node;
  }
```
- ~~In execution, conditions are evaluated via `ExpressionEvaluator.evaluate(...)`, which does not handle this type, so complex conditions cannot be executed.~~ **FIXED: evaluateSamengesteldeVoorwaarde() implemented at line 1907**

- **~~Dagsoort definitions not wired; checks are hardcoded~~** ✅ FIXED
  - Grammar has `dagsoortDefinition` and rules to assign a day type. Visitor emits unary dagsoort checks; dagsoort definitie result is explicitly not implemented. Evaluator checks only ‘werkdag’, ‘weekend’, ‘feestdag’ with built-in calendars.
```1531:1532:typescript/src/visitors/regelspraak-visitor-impl.ts
} else if (ctx.constructor.name === 'DagsoortdefinitieResultaatContext') {
  throw new Error('DagsoortdefinitieResultaat not implemented');
```
```1183:1239:typescript/src/evaluators/expression-evaluator.ts
  private evaluateDagsoortExpression(expr: BinaryExpression, context: RuntimeContext): Value {
    // ... hardcoded cases: werkdag, weekend, feestdag
  }
```
**FIXED: Now checks domainModel.dagsoortDefinities at line 1546**

- **~~Regel status conditions missing~~** ✅ FIXED
  - Grammar supports `REGEL <name> is gevuurd | is inconsistent` in expressions.
```854:856:grammar/RegelSpraak.g4
regelStatusCondition // Now potentially part of comparisonExpression
    : REGEL name=naamwoord op=(IS_GEVUURD | IS_INCONSISTENT) # regelStatusCheck
    ;
```
  - ~~No corresponding visitor/evaluator; grep shows no handling.~~ **FIXED: evaluateRegelStatusExpression() implemented at line 1886**

- **~~Unary numeric exact digits ("is numeriek met exact N cijfers") parsed, not evaluated~~** ✅ FIXED
  - ~~Tokens and grammar exist; visitor path not found; evaluator lacks operator handling.~~ **FIXED: Full implementation in visitor and evaluator**

- **~~Feit-creatie result not implemented~~** ✅ FIXED
  - ~~Grammar defines `feitCreatiePattern`. Visitor throws for `FeitCreatieResultaatContext`. No executor path.~~ **FIXED: executeFeitCreatie() implemented in feit-executor.ts**

- **~~Timeline × scalar operations not implemented~~** ✅ FIXED
  - ~~Binary ops require timeline×timeline; timeline×scalar throws.~~ **FIXED: Scalar lifting implemented**
```435:437:typescript/src/evaluators/expression-evaluator.ts
  // One timeline and one scalar - not yet implemented
  throw new Error('Timeline-scalar operations not yet implemented');
```
**FIXED: Now supports timeline × scalar operations with proper scalar lifting**

- **Aggregation duplication and drift** ⚠️ MINOR ISSUE
  - `totaal_van` exists as:
    - Timeline aggregation via `TimelineExpression('totaal')` in visitor, executed in `TimelineEvaluator.evaluateTotaal` (returns scalar per spec 7.1).
    - Scalar/array built-in `ExpressionEvaluator.totaal_van` with comment about temporal conditions not fully implemented.
  - This split risks inconsistent behavior and error messages; prefer one semantic entry point (timeline-aware) and have the visitor consistently build it.
```2972:2989:typescript/src/visitors/regelspraak-visitor-impl.ts
  visitTotaalVanExpr(ctx: any): Expression {
    // ... returns TimelineExpression { operation: 'totaal' }
  }
```

- **~~Samengesteld predicaat (bulleted) inside predicaat~~** ✅ FIXED
  - ~~Grammar includes it; visitor contains TODO comments and partial structures, but no complete evaluation path.~~ **FIXED: Full implementation with all quantifiers**

- **Decision table semantics limited** ⚠️ MINOR ISSUE
  - Executor parses headers heuristically and matches conditions against context variables. Attribute paths, units, enums, and dagsoort within tables are not fully integrated. Adequate for straightforward tables, but below spec richness.

- **Dimensions used sparsely at runtime** ⚠️ MINOR ISSUE
  - Dimensies are parsed and stored. Evaluation of dimensioned attribute references is ad hoc and not model-driven; lacks generic resolution of prepositional vs adjectival usage styles.

---

### Grammar observations
- **Strengths**
  - Comprehensive tokenization of Dutch multi-word constructs; careful ordering of longest-first tokens in lexer.
  - Broad coverage across definitions, rules, predicates, expressions, and specialized constructs (decision tables, distributions, timelines, dimensions, units). Significantly closer to spec than typical first-pass grammars.
- **Risks/complexity**
  - The `identifierOrKeyword` and `identifierOrKeywordNoIs` approach admits many tokens as identifiers. This increases flexibility for names but elevates ambiguity risk in edge cases; correctness then shifts to visitor/evaluator disambiguation.
  - Several constructs rely on permissive alternatives (e.g., `naamwoord`, prepositional chains), which are appropriate for a natural-language DSL but put pressure on the visitor layer to recover canonical forms reliably.
  - Grammar includes constructs not yet implemented in TS runtime (regel-status, unary numeric exact, feit-creatie result, dagsoort definitie result), which is acceptable as a staged approach but should be tracked.

---

### Architecture assessment (TypeScript)
- **Layering**
  - ANTLR bridge isolates parse concerns; large `RegelSpraakVisitorImpl` maps parse contexts to a typed AST. Runtime separated into evaluators (`ExpressionEvaluator`, `TimelineEvaluator`), executors (`RuleExecutor`, `DecisionTableExecutor`), and `Engine` orchestration. Good separation of concerns.
- **Positives**
  - Timeline model and evaluator are thoughtfully designed: knip-merging, per-period evaluation, conditional filtering, scalar result for total, proportional handling for partial months/years.
  - Distribution executor implements a nuanced set of rules including ordering, tie-breakers, maximum constraints, and rounding.
  - Units: custom unit systems can be registered and later used by the evaluator; unit arithmetic supported for +, -, *, /.
  - Subselectie model and predicate evaluation for basic attribute/kenmerk comparisons is present.
- **Areas to improve**
  - **Condition evaluation is expression-centric**: Complex rule conditions are represented as `SamengesteldeVoorwaarde` expressions but there is no evaluator path. Introduce a dedicated evaluation path (or extend `ExpressionEvaluator`) for compound conditions, including quantifiers and nested items.
  - **Aggregation cohesion**: Unify all aggregation semantics (sum/total/first/last, with temporal conditions) in one module (likely timeline-aware), and make the visitor target that surface consistently. Remove or narrow the array-based `totaal_van` to be an implementation detail of timeline aggregation over scalarized series.
  - **Model-driven evaluation**: Wire `DagsoortDefinitie`, `Dimensie`, and `FeitType` definitions into evaluators so checks and navigations are not heuristic/hardcoded.
  - **Predicate system**: Centralize predicate representation and evaluation (including ‘samengesteld predicaat’), rather than scattering logic across visitor and evaluator. This will simplify subselectie and conditional evaluation reuse.
  - **Error surfaces**: A few explicit `throw new Error('not yet implemented')` or console warnings exist in evaluators. Replace with structured errors and consistent messages.

---

### Prioritized recommendations

**Update 2025-08-27**: Items 1-7 below have been fully implemented. Only minor issues remain (aggregation consolidation, decision table expressiveness, dimension evaluation).

1. **~~Implement evaluation of `SamengesteldeVoorwaarde`~~** ✅ FIXED
   - Semantics: evaluate each child expression to boolean; apply quantifier (ALLE, GEEN, TEN_MINSTE n, TEN_HOOGSTE n, PRECIES n) over the collection of booleans. Support nested `SamengesteldeVoorwaarde` recursively.
   - Integrate into `ExpressionEvaluator.evaluate` with a new case, or a dedicated `ConditionEvaluator` invoked by `RuleExecutor` for `Voorwaarde`.
2. **~~Dagsoort: honor model definitions~~** ✅ FIXED
   - ~~Add visitor for dagsoort definitie results; store predicates on the model.~~
   - ~~Extend evaluator to resolve `BinaryExpression` dagsoort checks against registered dagsoorten rather than hardcoded sets.~~
3. **~~Regel status conditions~~** ✅ FIXED
   - ~~Add visitor nodes for `regelStatusCondition` and evaluation support (track executed rules and consistency outcomes in `Context`).~~
4. **~~Unary numeric exact digits~~** ✅ FIXED
   - ~~Implement both positive and negative variants (`is numeriek met exact N cijfers` / `is niet numeriek met exact N cijfers`) as unary operations in evaluator.~~
5. **~~Feit-creatie result~~** ✅ FIXED
   - ~~Implement visitor and executor behavior (relationship creation between objects) aligned with `FeitType` role definitions and cardinality constraints.~~
6. **~~Timeline × scalar operators~~** ✅ FIXED
   - ~~Add scalar lifting for timeline arithmetic, aligning with timeline granularity and applying operation pointwise.~~
7. **Aggregation consolidation** ⚠️ MINOR - Still recommended
   - Route `totaal_van` through the timeline path; deprecate or scope the array/number variant to internal use where appropriate; ensure temporal condition expressions are uniformly supported.
8. **Decision table expressiveness** ⚠️ MINOR - Still recommended
   - Improve subject-path resolution (attributes with 'van …'), enums, units, and dagsoort usage inside tables.
9. **Dimension evaluation** ⚠️ MINOR - Still recommended
   - Replace ad hoc logic with model-driven resolution honoring `voorzetselSpecificatie` (prepositional vs adjectival), plural labels, and value label selection.

---

### Selected evidence excerpts
- Grammar has regel-status condition; no TS handling present:
```854:856:grammar/RegelSpraak.g4
regelStatusCondition // Now potentially part of comparisonExpression
    : REGEL name=naamwoord op=(IS_GEVUURD | IS_INCONSISTENT) # regelStatusCheck
    ;
```
- Visitor creates `TimelineExpression` for tijdsevenredig and totaal:
```2930:2959:typescript/src/visitors/regelspraak-visitor-impl.ts
visitTijdsevenredigDeelExpr(ctx: any): Expression {
  // ... operation: 'tijdsevenredig_deel_per_maand' | 'tijdsevenredig_deel_per_jaar'
  const node = { type: 'TimelineExpression', operation: periodType, target: targetExpr, condition: conditionExpr };
  return node;
}
```
```2972:2991:typescript/src/visitors/regelspraak-visitor-impl.ts
visitTotaalVanExpr(ctx: any): Expression {
  const node = { type: 'TimelineExpression', operation: 'totaal', target: targetExpr, condition: conditionExpr };
  return node;
}
```
- Timeline evaluator returns scalar for `totaal` per spec §7.1:
```127:163:typescript/src/evaluators/timeline-evaluator.ts
// Per specification section 7.1: totaal_van returns a scalar sum
let total = new Decimal(0);
...
return { type: 'number', value: total.toNumber(), unit: timeline.periods[0]?.value.unit };
```
- Dagsoort definitie result is not implemented; evaluator has hardcoded checks:
```1531:1532:typescript/src/visitors/regelspraak-visitor-impl.ts
throw new Error('DagsoortdefinitieResultaat not implemented');
```
```1183:1210:typescript/src/evaluators/expression-evaluator.ts
switch (dagsoortName.toLowerCase()) { case 'werkdag': ... case 'weekend': ... case 'feestdag': ... }
```
- Timeline × scalar operations missing:
```435:437:typescript/src/evaluators/expression-evaluator.ts
throw new Error('Timeline-scalar operations not yet implemented');
```

---

### Test signals (what is exercised)
- Conditional rules: simple conditions are parsed and executed; complex INDlEN with bullets are parsed only (no execution tests).
- Timelines: tijdsevenredig tests include manual application; parsing-based tests around tijdsevenredig are skipped in places; total aggregation tested.
- Distributions: unit tests cover ordering, tie-break, maximum, rounding.
- Units: arithmetic and system definitions have unit tests.

---

### Final take
- The grammar is impressively comprehensive and aligns well with the v2.1.0 spec. ~~A few advanced constructs are present in the grammar but not yet surfaced in the TS runtime.~~ **UPDATE 2025-08-27: All major constructs now implemented.**
- The TypeScript implementation delivers a ~~functional core~~ **near-complete implementation** for rules, arithmetic, timelines, distribution, and decision tables. ~~To reach spec-level completeness, prioritize compound condition evaluation, model-driven dagsoort, regel-status, unary numeric exact, feit-creatie, and timeline-scalar support~~ **UPDATE: All these features have been implemented as of 2025-08-27**. Only minor issues remain: aggregation consolidation, advanced decision table semantics, and dimension runtime usage.
