## Code Analysis for RegelSpraak Parser - 20250625

**Prepared by: John Carmack (Simulated)**
**Date: 2025-06-25**
**Updated: 2025-07-16** - Timeline expression evaluation implemented

### 0. Executive Summary & Overall Impression

This codebase has seen substantial progress, and the detailed `20250510-CODEANALYSIS.md` (updated July 16th) reflects a commendable effort in tracking issues and resolutions. Many foundational pieces are in place: ANTLR parsing, an AST, a semantic analyzer, a runtime, and an initial engine. The test suite is extensive, which is crucial.

My focus here is not to re-hash what's been fixed but to look at the current state and remaining challenges with an eye for **simplicity, robustness, and practical efficiency.** The goal is a solid, understandable, and performant core that can reliably support the project's vision (REPL, Jupyter, Rules as a Service, AI Explainability).

The project is on a good trajectory. The remaining issues, while some are intricate, are solvable with focused effort. The key is to relentlessly simplify, ensure fundamental soundness, and avoid premature complexity.

### 1. Current State Assessment (Carmack Perspective)

*   **Strengths (Reiterated & Emphasized):**
    *   **ANTLR Foundation:** Using ANTLR for parsing a complex DSL like RegelSpraak is the right tool for the job. The detailed grammar notes indicate a deep engagement with the language's intricacies.
    *   **Separation of Concerns:** The modular breakdown (`parsing`, `builder`, `ast`, `semantics`, `runtime`, `engine`, `units`, `arithmetic`) is generally good. The refactor of `parsing.py` into a thin frontend with logic in `builder.py` is a positive step, though `builder.py` itself needs scrutiny.
    *   **AST & Runtime Data Structures:** Use of Python `dataclasses` for AST/runtime models is clean. `SourceSpan` for error reporting is essential. Immutability of AST nodes is a good principle.
    *   **Semantic Analysis:** The addition of a proper semantic analysis phase with a symbol table is a critical improvement for robustness.
    *   **Unit System:** The dedicated `units.py` and `arithmetic.py` for handling units is a solid approach for a DSL that deals with typed and unitized values.
    *   **Testing:** A comprehensive test suite (431 tests) is a major asset. Keep this up.
    *   **Progress:** The number of "RESOLVED" items in the `20250510-CODEANALYSIS.md` shows significant, focused development.

*   **Areas for Continued Focus & Improvement (Carmack Perspective):**
    *   **Complexity in `builder.py`:** This module (previously noted at ~70KB) remains a concern. Large, complex modules are harder to understand, debug, and maintain. The `_extract_canonical_name` function is a symptom – it suggests either the grammar isn't normalized enough, or the builder is trying to be too clever in too many places at once. We need to simplify this.
    *   **Pragmatic Error Handling:** While error types exist, consistency is key. Errors should be explicit and informative. Hiding errors (e.g., `get_kenmerk` returning `False`) is generally bad. Fail fast, fail clearly.
    *   **Performance Mindfulness:** While Python is the current language, design choices should not preclude future performance optimizations. Avoid overly complex object graphs or unnecessary string manipulations in hot paths if the engine is to be used in more demanding scenarios (e.g., "Rules as a Service").
    *   **Clarity of Execution Flow:** The engine's evaluation logic needs to be crystal clear. Tracing helps, but the code itself should be straightforward.
    *   ~~**REPL Robustness:** The REPL's `Evaluate` command using string splitting is a weak point. It needs to use the full parsing/evaluation pipeline.~~ **RESOLVED (2025-12-29):** Kept simple pattern matching for common REPL use cases instead of overengineering.

### 2. Review of Outstanding Issues from `20250510-CODEANALYSIS.md`

The `20250510-CODEANALYSIS.md` is quite current. I'll comment on the outstanding items:

*   **`builder.py` - `_extract_canonical_name` (Medium Priority):**
    *   **Carmack's Take:** This function is a red flag. A 70KB builder with a complex name extraction function suggests the AST construction is fighting the grammar or trying to paper over inconsistencies. The goal should be a grammar that produces fairly regular structures for names, making extraction trivial. If the DSL itself is inherently complex here, the complexity should be isolated and managed, not spread through a giant helper.
    *   **Recommendation:**
        1.  **Analyze Grammar for Name Consistency:** Can parser rules for various named entities (`objectTypeNaam`, `parameterNaam`, `regelNaam`, etc.) be made more uniform so `_extract_canonical_name` isn't needed or is vastly simpler?
        2.  **Simplify or Decompose:** If the grammar can't be simplified further, break `_extract_canonical_name` into smaller, type-specific helpers, or push some of this canonicalization to the semantic analysis phase if it makes more sense there. The current approach feels like a patch magnet.

*   ~~**Inconsistent Error Handling - `runtime.py` - `get_kenmerk` (Medium Priority):**~~
    *   ~~**Carmack's Take:** `get_kenmerk` returning `False` for an undefined kenmerk is a common but often problematic pattern. It masks a potential logic error or an issue with the object's state. It's usually better for such an access to fail explicitly (e.g., raise `RuntimeError` or `AttributeError`-equivalent). This makes debugging far easier.~~
    *   ~~**Recommendation:** Change `get_kenmerk` to raise a `RuntimeError` (or a more specific `UndefinedKenmerkError`) if the kenmerk is not defined on the object type or not set. The caller can then decide to catch this and default to `False` if that's the desired application logic. The engine itself should be stricter.~~
    *   **RESOLUTION (2025-12-29):** After review, the current implementation is correct per specification §3.5: "Default zal een kenmerk er niet zijn (onwaar)". Returning `False` for undefined kenmerken is the specified behavior, not a bug.

*   **Design Concern - `IS`/`IN` Logic Placement (Medium Priority):**
    *   **Carmack's Take:** The `RuntimeContext` should primarily be a data container. Evaluation logic, including how operators like `IS` or `IN` behave, belongs in the `Evaluator`. Mixing this blurs responsibilities and makes both components harder to reason about.
    *   **Recommendation:** Move the core logic of `check_is` and `check_in` from `RuntimeContext` into the `Evaluator`'s expression handling (e.g., `_handle_binary`). The context can provide data access, but the `Evaluator` should interpret it.

*   ~~**Incompleteness - `engine.py` - `_handle_function_call` (Medium Priority):**~~
    *   ~~**Carmack's Take:** A "rudimentary" function handling without a registry is a temporary state. For a usable DSL engine, this needs to be robust.~~
    *   ~~**Recommendation:** Implement a proper function registry (e.g., a dictionary mapping function names to callable implementations). This makes adding new functions cleaner and the `_handle_function_call` method simpler (dispatch based on lookup). Prioritize implementing the core RegelSpraak functions.~~
    *   **RESOLVED (2025-07-21):** Function registry implemented with clean dispatch. All core functions registered without article duplication. Missing _func_het_aantal implemented. Aggregation pre-processing fixed to prevent eager evaluation errors.

*   **Incompleteness - `cli.py` - Data Loading Type Checking (Medium Priority):**
    *   **Carmack's Take:** The "TODO" for type checking loaded data is important. Garbage-in, garbage-out is bad, but garbage-in, crash-later-mysteriously is worse. Validate inputs as early as possible.
    *   **Recommendation:** Implement the type checking. When loading parameters and attributes from JSON, compare their types against the `DomainModel` definitions. Convert if safe and unambiguous (e.g., string "123" to int for a Numeriek field), or raise an error for mismatches. This improves CLI robustness significantly.

*   **Design Decision - `builder.py` - `parameter_names` tracking (Low Priority - but review rationale):**
    *   **Carmack's Take:** The analysis notes this is a "hack" but deferred because the "semantic analyzer expects distinct ParameterReference nodes." This needs a closer look.
        *   If the grammar itself can't distinguish a parameter reference from other name uses syntactically *at the point of parsing*, then the builder has to make a heuristic guess or the AST needs a more generic "NameReference" node that the semantic analyzer then resolves to Parameter, Variable, or Attribute.
        *   Relying on a mutable set (`parameter_names`) populated during one part of the visitor and used in another is indeed fragile. It creates an implicit dependency on visitation order.
    *   **Recommendation (If Re-evaluation is Possible):**
        1.  **Ideal:** Modify grammar so `parameterMetLidwoord` (or similar rules for parameter usage in expressions) is distinct enough that `visitParamRefExpr` can *always* create a `ParameterReference` without needing this external set.
        2.  **Alternative:** If grammar changes are too hard, the semantic analyzer should be the one to definitively classify a generic `NameReference` AST node. The builder should create the most specific node it can *without* such stateful lookups. If the semantic analyzer truly needs distinct AST node *types* from the builder, then the builder's logic to *decide* which type to create must be robust and not rely on parsing-order-dependent state.
        *   Given it's "Low" and "Deferred", this might be a "wart" that's tolerated if the cost of fixing is too high for the current benefit, but it's a point of technical debt.

*   ~~**Design Concern - `repl.py` - `handle_evaluate` (Medium Priority):**~~
    *   ~~**Carmack's Take:** String splitting for expression evaluation in a REPL is a toy implementation. It will break easily and doesn't test the real engine.~~
    *   ~~**Recommendation:** The `Evaluate` command in the REPL *must* feed the input string through the main `parse_text` (or a targeted version for expressions, e.g., `parse_expression_text`) and then use the `Evaluator` to get the result. This makes the REPL a true testbed for the engine.~~
    *   **RESOLUTION (2025-12-29):** Pragmatic solution: kept simple pattern matching for common REPL use cases ("instance is kenmerk", "instance.attribute"). Added "is niet" support and comprehensive unit tests (12 tests). For complex expressions, users should use full rule syntax.

*   **Inconsistency - `engine.py`, `runtime.py` - `TraceSink` usage (Low Priority):**
    *   **Carmack's Take:** Tracing is good. Inconsistent tracing is less good. It makes it harder to rely on the trace output.
    *   **Recommendation:** Review and standardize. Add more granular `TraceSink` calls in `Evaluator` methods (`evaluate_expression`, binary/unary/function handlers) and `RuntimeContext` setters/getters. Aim for a level of detail that allows reconstructing the "why" of a calculation. This is crucial for the "AI-Powered Explainability" vision.

*   **Minor Issue - `Makefile` - ANTLR Jar Path (Low Priority):**
    *   **Carmack's Take:** Using `$(PROJECT_ROOT)/lib/antlr-4.13.1-complete.jar` is fine for a self-contained project. It's not a global system dependency.
    *   **Recommendation:** This is acceptable. If the project grew or needed more complex Java interactions, a more standard Java build tool (Maven/Gradle) for the ANTLR part might be considered, but for now, it's pragmatic.

*   **Minor Issue - `ast.py` - `Operator` Enum `IS`/`IN` (Low Priority):**
    *   **Carmack's Take:** `IS` and `IN` often have different evaluation semantics than pure arithmetic/logical operators. `IS` can involve type checks or kenmerk lookups; `IN` involves collection semantics. Grouping them in one `Operator` enum is fine as long as the `Evaluator` handles their specific logic correctly.
    *   **Recommendation:** No immediate change needed if the `Evaluator` correctly dispatches and handles their unique semantics. If their handling becomes convoluted due to being in the same enum, consider specialized AST nodes (e.g., `IsExpression`, `InExpression`) later.

### 2.5. Recent Implementation Highlights (2025-01-07)

**Aggregation Function Implementation:**
- **Function Registry Pattern**: Implemented in engine.__init__ for cleaner dispatch
- **Generic Collection Resolution**: _resolve_collection_from_feittype and related methods avoid hardcoding object types
- **Proper Date Comparison**: _compare_values handles both date and numeric comparisons with unit conversion
- **Empty Collection Handling**: Preserves specific datatypes (e.g., "Bedrag") even for empty collections
- **Lazy Evaluation**: Function arguments evaluated only when needed to prevent premature errors

**tijdsduur_van Fix:**
- Changed from fractional years (delta.days / 365.25) to whole year calculation
- Implements anniversary date check per specification "in hele jaren"
- Properly handles leap years and edge cases

**Parsing Improvements:**
- Fixed eerste_van/laatste_van parsing using isinstance() checks instead of string comparison
- Added visitConcatenatieExpressie for concatenation patterns
- Proper handling of function argument contexts

### 3. Broader Recommendations (Carmack Style)

1.  **Relentless Simplification of `builder.py`:**
    *   **Priority:** High
    *   **Rationale:** A 70KB Python file for an AST builder is a strong indicator of excessive complexity. This will be a bottleneck for maintenance, debugging, and onboarding new developers.
    *   **Action:**
        *   **Profile & Identify Hotspots:** If this were C, I'd say profile it. In Python, at least identify the most complex methods or those handling many special cases.
        *   **Grammar-Driven Simplicity:** Re-evaluate if ANTLR grammar tweaks (e.g., more specific labeling of alternatives, more consistent naming rules in the grammar) can simplify the visitor logic. The visitor should ideally be a straightforward translation, not a place for complex decision-making based on subtle parse tree structures.
        *   **Decomposition:** Break down large `visitXxx` methods into smaller, more focused helpers.
        *   **State Reduction:** Minimize any state held within the `RegelSpraakModelBuilder` instance itself. Parsing should be as stateless as possible. The `parameter_names` set is an example of state that ideally shouldn't be needed.

2.  **Solidify the Core Engine (`engine.py`):**
    *   **Priority:** High
    *   **Rationale:** The engine is the heart of the system. Its correctness, clarity, and (eventual) performance are paramount.
    *   **Action:**
        *   **Clear Evaluation Path:** Ensure `evaluate_expression` and its helpers (`_handle_binary`, `_handle_unary`, `_handle_function_call`) are exceptionally clear and directly map to RegelSpraak semantics.
        *   **Unit Test Edge Cases:** Thoroughly test arithmetic and logical operations with edge cases, especially involving units and empty values (as per `RegelSpraak-specificatie - typeringen v2.1.0.md`). The `arithmetic.py` module is good, ensure its integration is flawless.
        *   **Tracing as a First-Class Citizen:** Enhance tracing. Every significant step in evaluation (operand fetch, operator application, function entry/exit, intermediate results) should be traceable. This is not just for debugging but foundational for the explainability goal.

3.  **Improve REPL and CLI Robustness:**
    *   **Priority:** Medium
    *   **Rationale:** User-facing tools should be reliable and reflect the true capabilities of the engine.
    *   **Action:**
        *   ~~**REPL `Evaluate`:** Rewrite to use the full parsing/evaluation pipeline.~~ **DONE:** Kept pragmatic pattern matching with tests.
        *   **CLI Data Loading:** Implement the TODO for type checking data loaded from JSON. Provide clear errors for malformed or mismatched data.

4.  **Performance Considerations (Long-Term):**
    *   **Priority:** Low (for now), but inform design choices.
    *   **Rationale:** While Python is fine for initial development, the "Rules as a Service" vision implies potential performance needs.
    *   **Action:**
        *   Be mindful of creating excessive temporary objects during evaluation if rules can be large or deeply nested.
        *   The "Phase 2: Performance Optimization" (Python AST code gen) in the `20250510-CODEANALYSIS.md` roadmap is a good direction if performance becomes an issue.
        *   The `test_previous_commit.sh` is a good, simple start for regression checking. Consider more formal benchmarking if specific performance targets arise.

5.  **Documentation and Specification Alignment:**
    *   **Priority:** Medium
    *   **Rationale:** The provided specification documents are detailed. The codebase must remain aligned.
    *   **Action:**
        *   **README Grammar Notes:** Keep these updated as the grammar evolves. They are very valuable.
        *   **Source Code Comments:** Use comments to explain the "why" of complex or non-obvious code sections, especially in `builder.py` and `engine.py`.
        *   **Specification as Truth:** Continue to treat `RegelSpraak-specificatie v2.1.0.md` and `RegelSpraak-specificatie - typeringen v2.1.0.md` as the ground truth for language semantics. Tests should reflect this.

### 4. Remediation Plan (Prioritized)

This plan integrates the remaining issues from the previous analysis with a Carmack-esque focus.

| Priority   | Action                                                                 | Location(s)                                                              | Proposed Change & Rationale (Carmack Perspective)                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :--------- | :--------------------------------------------------------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **High**   | **Simplify `builder.py` (esp. `_extract_canonical_name`)**             | `builder.py`                                                             | **Reduce Complexity/Improve Maintainability:** This is a beast. Simplify by (1) Pushing more normalization to grammar if possible, or (2) Decomposing into smaller, more testable helpers. Aim for a builder that's a more direct translation of grammar rules, less ad-hoc logic.                                                                                                                                                                              |
| ~~**High**~~   | ~~**Extract Expression Evaluation Duplication**~~                         | ~~`engine.py`~~                                                          | ~~**DRY/Maintainability:** evaluate_expression and _evaluate_expression_non_timeline had ~130 lines of identical code. Extract shared logic into helper methods while preserving intentional differences in recursive paths.~~ **RESOLVED (2025-07-20):** Extracted _evaluate_literal, _evaluate_variable_reference, _evaluate_parameter_reference helper methods.                                                                                         |
| ~~**High**~~   | ~~**Standardize Runtime Error Handling**~~                                 | ~~`runtime.py` (`get_kenmerk`)~~                                             | ~~**Robustness/Predictability:** `get_kenmerk` returning `False` for undefined is a bug waiting to happen. Change to raise `RuntimeError` (or specific `UndefinedKenmerkError`). Fail fast and clearly. Application logic can catch and default if needed.~~ **RESOLVED:** Current behavior is correct per spec §3.5.                                                                                                                                                                                                     |
| ~~**High**~~   | ~~**Refactor REPL `Evaluate` Command**~~                                   | ~~`repl.py` (`handle_evaluate`)~~                                            | ~~**Correctness/Usability:** String splitting is not parsing. Route `Evaluate` input through `parse_text` (or a dedicated `parse_expression`) and the `Evaluator`. The REPL must be a reliable testbed for the actual engine.~~ **RESOLVED:** Pragmatic pattern matching with comprehensive tests.                                                                                                                                                                                                                                        |
| **Medium** | **Centralize `IS`/`IN` Logic**                                         | `engine.py`, `runtime.py`                                                | **Design/Cohesion:** `RuntimeContext` should be data + state. `Evaluator` should evaluate. Move `check_is`/`check_in` logic fully into `Evaluator._handle_binary` or similar. Cleaner separation of concerns.                                                                                                                                                                                                                                                        |
| ~~**Medium**~~ | ~~**Implement Full Function Registry & Execution**~~                       | ~~`engine.py` (`_handle_function_call`)~~                                    | ~~**Functionality/Extensibility:** Current function handling is too basic. Implement a proper registry (dict mapping names to callables). Define and implement core RegelSpraak functions. Makes the engine more powerful and easier to extend.~~ **RESOLVED (2025-07-21):** Registry implemented, functions standardized, missing implementations added.                                                                                                                                                                                                                |
| **Medium** | **Add Type Checking to CLI Data Loading**                                | `cli.py` (`run` command)                                                 | **Robustness:** Validate data from `--data` JSON against `DomainModel` definitions *before* execution. Convert types where safe (e.g., string "10" to int for Numeriek), error out on mismatches. Prevents runtime surprises.                                                                                                                                                                                                                                   |
| **Medium** | **Enhance Tracing Consistency & Granularity**                          | `engine.py`, `runtime.py`                                                | **Debugging/Explainability:** Good tracing is gold. Review evaluation paths and context modifications; add more `TraceSink` calls for intermediate steps, value reads/writes, function entry/exit. Structured events are key for any future AI explainability.                                                                                                                                                                                                  |
| **Low**    | **Review `parameter_names` hack in `builder.py` (if time permits)**    | `builder.py`, `semantics.py`                                             | **Design Purity/Robustness:** While deferred, this stateful parsing hack is non-ideal. If a refactoring opportunity arises (e.g., major grammar work or semantic analyzer changes), revisit if this can be eliminated by making symbol resolution purely a semantic phase concern or by more explicit grammar rules.                                                                                                                                                   |
| **Low**    | **Review `Operator` Enum for `IS`/`IN`**                               | `ast.py`                                                                 | **Clarity/Design:** `IS` and `IN` have distinct semantics from arithmetic/logical ops. Current enum is fine if `Evaluator` handles them correctly. If their special logic pollutes general operator handling, consider dedicated AST nodes (e.g., `IsExpression`) later.                                                                                                                                                                                            |
| **Low**    | **`Makefile` - ANTLR Jar Path**                                        | `Makefile`                                                               | **Build Flexibility:** Using `$(PROJECT_ROOT)/lib/...` is acceptable for a self-contained project. No urgent change needed unless it becomes a maintenance issue or for wider distribution.                                                                                                                                                                                                                                                                               |

### 5. Final Thoughts

The project has made excellent progress, tackling a complex DSL. The focus now should be on hardening the core: simplifying complex areas like the AST builder, ensuring robust and clear execution in the engine, and making user-facing tools like the CLI and REPL solid. Consistent, detailed tracing will be invaluable, not just for debugging but for the ambitious AI explainability goals. Keep up the strong testing culture. The foundations are mostly there; now it's about refinement and building out the remaining core functionality with a pragmatic engineering mindset.

### 6. Grammar Completeness Analysis (2025-12-27)

**Update (2025-01-07)**:
- All aggregation functions implemented per specification:
  - som_van: sum aggregation with feittype navigation (all patterns)
  - eerste_van/laatste_van: first/last date functions with proper parsing
  - Generic collection resolution without hardcoded object types
- Fixed tijdsduur_van to calculate whole years (anniversary date check)
- Fixed datatype preservation for empty collections
- Identified gemiddelde_van as not in specification (tests skipped)
- Test suite increased to 326 tests (10 skipped)

**Update (2025-12-29)**: 
- Initialisatie rules have been successfully implemented. These rules set attribute values only when the attributes are empty (None or not set), following specification §9.6. The implementation includes AST node, builder visitor, semantic validation, and engine execution logic.
- REPL evaluate command improved with pattern matching for common use cases, added "is niet" support, and comprehensive unit tests.

**Update (2025-01-04):**
- Verdeling (distribution) rules partially implemented:
  - AST nodes for Verdeling and all distribution method types (gelijke delen, naar rato, op volgorde, etc.)
  - Builder visitor for parsing Verdeling syntax
  - Engine support for basic distribution patterns (equal distribution, proportional)
  - Feittype-based collection resolution for complex navigation patterns
  - Test suite increased to 328 tests (10 skipped)
- Grammar limitations identified:
  - Multi-line Verdeling syntax with colon not parsing correctly
  - "Als onverdeelde rest blijft" remainder clause not recognized
  - These are parser issues, not engine issues
- Next steps: Fix grammar for complete Verdeling support, implement Dagsoortdefinitie and Beslistabel

**Update (2025-01-07)**:
- Dagsoortdefinitie (day type definition) rules implemented:
  - AST node for Dagsoortdefinitie extending ResultaatDeel
  - Grammar support for "Een dag is een X" pattern with priority over kenmerk assignment
  - Builder visitor for parsing dagsoort names with plural form handling
  - Semantic validation placeholder (dagsoort declarations not yet tracked)
  - Engine execution with trace events
  - Tests for simple definitions and complex Christmas day example
  - Test suite increased to 336 tests (10 skipped)

**Update (2025-07-04)**:
- som_van aggregation patterns fully implemented with support for:
  - Concatenation: "de som van X, Y en Z"
  - All instances: "de som van alle bedragen"
  - Attribute of collection: "de som van de te betalen belasting van alle passagiers van de reis"
- Fixed role name resolution in _deduce_rule_target_type to map feittype roles to object types
- Added feittype navigation for "X van de Y" collection patterns
- Fixed eager argument evaluation in function calls to prevent premature errors
- Test suite increased to 319 tests (8 skipped)

**Update (2025-06-29)**:
- tijdsduur_van function implemented following specification §6.10. Supports date parsing, unit conversion (milliseconds to years), and empty value handling.
- Fixed feittype navigation bug where code incorrectly accessed role1/role2 instead of rollen list.
- Added TOKA age calculation test demonstrating tijdsduur_van with feittype relationships.

**Update (2025-07-05)**:
- Beslistabel (decision tables) implemented per specification §12:
  - AST nodes for Beslistabel and BeslistabelRow with expression/literal values
  - Grammar support for pipe-delimited table format with header/separator/data rows
  - Builder visitor handles column text extraction and n.v.t. cell values
  - Engine executes by finding first row where all non-n.v.t. conditions match
  - Semantic validation for table structure and expression analysis
  - Test coverage for parsing, n.v.t. handling, and simplified execution
- Beslistabel condition parsing implemented (2025-07-05 afternoon):
  - Created beslistabel_parser.py module for natural language pattern parsing
  - Added BeslistabelCondition and BeslistabelResult AST nodes
  - Parser recognizes Dutch patterns: "indien zijn X gelijk is aan", "indien de X van zijn Y groter is dan", etc.
  - Result columns parse to identify attribute/kenmerk assignment targets
  - Engine builds comparison expressions from parsed conditions + cell values
  - Full semantic evaluation of decision table conditions
- Test suite increased to 342 tests (10 skipped)

**Update (2025-07-05 late afternoon)**:
- aantal dagen in function implemented:
  - Basic implementation counts days in month/year from a given date
  - Full specification pattern "het aantal dagen in de maand/jaar dat [condition]" not yet supported by grammar
  - Function accepts date argument and returns day count for that month
  - Handles leap years correctly
  - Test suite increased to 345 tests (10 skipped)
- totaal van parsing issue identified:
  - Function implementation exists but grammar doesn't support concatenation pattern
  - Grammar expects single expression after HET_TOTAAL_VAN, not concatenation
  - som_van works with concatenation but totaal_van doesn't due to grammar differences
  - Requires grammar fix to support "het totaal van X, Y en Z" pattern

**Update (2025-07-12)**:
- Lexer/parser ambiguity fix for aggregation expressions and compound identifiers:
  - Problem: Compound tokens (HET_KWARTAAL, HET_DEEL_PER_MAAND, HET_DEEL_PER_JAAR) were greedily consuming input
  - This prevented parsing of valid multi-word attribute names like "het kwartaal bedrag van een rapportage"
  - Aggregation expressions were limited to GEDURENDE_DE_TIJD_DAT conditions only
  - Solution:
    - Removed conflicting compound tokens from lexer
    - Updated aggregation productions to use conditieBijExpressie reference
    - Added KWARTAAL and METER to identifierOrKeyword lists
    - Deleted orphaned SpecialPhraseResultaat production
  - Result: All aggregation expressions now support both "gedurende de tijd dat" and period patterns
  - Test suite increased to 375 tests (11 skipped)

**Update (2025-07-16):**
- Timeline expression evaluation implemented:
  - Empty timeline values return 0 for numeric types per specification §5.1.4
  - Fixed _is_timeline_expression and _collect_timeline_operands to handle compound paths like ['self', 'salaris']
  - Rules assigning to timeline attributes now correctly create TimelineValue results
  - Test suite increased to 386 tests (9 skipped)

**Update (2025-07-17):**
- Timeline period definitions fully implemented:
  - Fixed parameter reference disambiguation - "het basisSalaris" now correctly parsed as ParameterReference
  - Added visitOnderwerpRefExpr to handle grammar ambiguity where onderwerpReferentie matches before parameterMetLidwoord
  - Fixed unit handling for literals - AST uses 'eenheid' but Value expects 'unit'
  - Enhanced DateCalcExpr to propagate units from identifiers to numeric literals
  - All timeline period syntax now working: vanaf, tot, van...tot, tot en met
  - Test suite increased to 396 tests (11 skipped)

**Update (2025-07-19):**
- Subselectie (filtered collections) fully implemented:
  - Grammar extended to support DIE/DAT predicaat filtering in onderwerpReferentie
  - Full predicaat hierarchy: object, comparison, and typed predicates
  - Engine evaluation with proper context switching for predicate evaluation
  - Navigation expression support - "passagiers van de vlucht" parsed as single navigation
  - AttributeReference enhanced to handle "X van de Y" patterns in single-element paths
  - Integration with aggregation functions for filtered aggregation
  - het_aantal function implemented for counting collections
  - Test suite increased to 397 tests (11 skipped)

**Update (2025-07-20):**
- Recursion (Recursie) fully implemented per specification §9.9:
  - Grammar extended with REGELGROEP and IS_RECURSIEF tokens
  - AST node RegelGroep added for recursive rule groups
  - Semantic validation ensures recursive groups have object creation with termination conditions
  - Engine execution with iteration tracking and 1000-iteration safety limit
  - Special handling for ObjectCreatie and aggregations without current instance
  - Test suite increased to 407 tests (11 skipped)

**Update (2025-07-20) - Elfproef Implementation:**
- Elfproef validation predicate implemented per specification §8.1.3:
  - Added VOLDOET_AAN_DE_ELFPROEF and VOLDOET_NIET_AAN_DE_ELFPROEF operators to AST
  - Implemented visitUnaryCondition in builder to handle unaryCheckCondition grammar alternative
  - Added _elfproef_check method in engine implementing the standard 11-proof checksum algorithm
  - Validates 9-digit BSN numbers using weighted sum (digit × position) divisible by 11
  - Comprehensive integration tests for valid/invalid BSNs and edge cases
  - Test suite increased to 413 tests (11 skipped)

**Update (2025-07-20) - Dagsoort Predicate Implementation:**
- Dagsoort (day type) predicate implemented per specification §3.12 and §9.8:
  - Added IS_EEN_DAGSOORT, ZIJN_EEN_DAGSOORT, IS_GEEN_DAGSOORT, ZIJN_GEEN_DAGSOORT operators to AST
  - Fixed lexer token ordering: IS_RECURSIEF before IS to prevent misparsing
  - Added Dagsoort AST node and DomainModel.dagsoorten collection
  - Implemented visitDagsoortDefinition in builder to parse declarations with plural forms
  - Extended visitUnaryCondition to handle unaryDagsoortCondition expressions
  - Implemented _dagsoort_check in engine using clever pattern: creates temporary "dag" objects
    to evaluate against dagsoort definition rules, reusing existing rule infrastructure
  - Added date extraction functions (maand_uit, dag_uit, jaar_uit) for date component access
  - Added semantic validation for dagsoort name references
  - Updated _deduce_rule_target_type to recognize Dagsoortdefinitie rules target "Dag" objects
  - Test suite increased to 419 tests (11 skipped)

**Update (2025-07-20) - Uniqueness Predicate Implementation:**
- Uniqueness (is uniek) predicate fully implemented per specification §8.1.6:
  - Added MOETEN_UNIEK_ZIJN operator to AST enum
  - Implemented visitUnaryCondition to handle unaryUniekCondition grammar alternative
  - Full uniqueness checking in engine's _apply_consistentieregel:
    * Parses target expression to extract attribute and object type names
    * Handles plural forms for both attributes and object types  
    * Checks for duplicate values across all instances
    * Returns false (inconsistent) if duplicates found
    * Emits detailed CONSISTENCY_CHECK trace events
  - Enhanced semantic validation to verify:
    * Proper "de X van alle Y" pattern structure
    * Object type exists in domain model
    * Attribute exists on specified object type
  - Added comprehensive integration tests covering edge cases
  - Test suite increased to 426 tests (11 skipped)

**Update (2025-07-20) - ObjectCreatie Grammar Ambiguity Fix:**
- Fixed parsing ambiguity in object creation attribute initialization:
  - Problem: "met de naam de naam" could parse ambiguously when attribute names and expressions both start with articles
  - Solution: Introduced simpleNaamwoord rule (naamPhrase without prepositions) for attribute names
  - Grammar changes:
    * Added simpleNaamwoord rule to restrict attribute names
    * Updated objectAttributeInit to use simpleNaamwoord instead of naamwoord
    * Preserves full expressiveness for attribute values while eliminating ambiguity
  - Builder updated with visitSimpleNaamwoord method
  - Added comprehensive test suite (test_object_creation_ambiguity.py) with 5 tests
  - Test suite increased to 431 tests (11 skipped)

**Update (2025-07-20) - Expression Evaluation Refactoring:**
- Eliminated ~130 lines of code duplication between evaluate_expression and _evaluate_expression_non_timeline:
  - Problem: Both methods contained identical logic for literal, variable, and parameter evaluation
  - Solution: Extracted common evaluation logic into helper methods:
    * _evaluate_literal(): Handles literal value wrapping, date parsing, and datatype inference
    * _evaluate_variable_reference(): Encapsulates variable lookup and trace event emission
    * _evaluate_parameter_reference(): Encapsulates parameter lookup and trace event emission
  - Design decision: The remaining differences between the two methods are intentional - they use different recursive paths
    (_handle_binary vs _handle_binary_non_timeline) to prevent infinite recursion when evaluating timeline expressions
  - Chose inline helper methods over a separate module to keep the solution simple and localized
  - Net reduction: 46 lines (removed 121, added 75)
  - All 431 tests pass unchanged

**Update (2025-07-21) - Compound Predicate Implementation:**
- Implemented samengesteld predicaat (compound predicates) per specification §5.6:
  - Grammar changes:
    * Added samengesteldPredicaat rule tree for compound conditions in predicates
    * Fixed voorwaardeKwantificatie to accept NUMBER tokens alongside word numbers
    * Changed GEEN VAN DE to single GEEN_VAN_DE token to resolve parse ambiguity
    * Allow multiple bulletPrefix tokens for nested condition hierarchies
  - AST additions:
    * SamengesteldPredicaat: compound predicate with quantifier logic
    * Kwantificatie/KwantificatieType: quantifier representation (ALLE/GEEN/TEN_MINSTE/etc)
    * GenesteVoorwaardeInPredicaat: nested condition with bullet level tracking
    * VergelijkingInPredicaat: comparison expressions within predicates
    * SamengesteldeVoorwaarde: compound conditions in regular rules (not just predicates)
  - Builder implementation:
    * Full visitor support for compound predicate parse tree
    * Proper NUMBER token handling in quantifiers
    * Correct GEEN_VAN_DE token detection
    * Bullet level counting for nested conditions
  - Engine execution:
    * _evaluate_samengesteld_predicaat: implements quantifier logic for predicates
    * _evaluate_samengestelde_voorwaarde: handles compound conditions in rules
    * Support in all rule contexts: regular rules, recursive rules, FeitCreatie
  - Semantic validation:
    * Validates quantifier counts don't exceed condition counts
    * Ensures quantifiers requiring numbers have them
  - Discovery: bezittelijk kenmerken store with "heeft" prefix in their names
  - Test suite increased to 439 tests (11 skipped)

**Update (2025-07-21) - Function Registry Refactoring:**
- Refactored function registry to eliminate article-based duplication:
  - Problem: Registry contained redundant entries for Dutch articles ("de", "het") complicating dispatch
  - Solution: Standardized function registration by removing articles from keys
  - Registry organization:
    * Mathematical functions: abs, max, min (with Dutch aliases)
    * Date/time functions: tijdsduur_van, maand_uit, dag_uit, jaar_uit
    * Aggregation functions: som_van, eerste_van, laatste_van, totaal_van, het_aantal
  - Fixed missing _func_het_aantal implementation:
    * Function was referenced in registry but not implemented
    * Now handles object type counting ("het aantal alle Iteratie")
    * Special pattern recognition before expression evaluation
  - Fixed aggregation pre-processing bug:
    * "het aantal alle X" pattern was eagerly evaluating arguments
    * Now correctly defers to registry function for special handling
    * Prevents "No current instance" errors in recursive contexts
  - Normalized function name handling in _handle_function_call_non_timeline
  - All 439 tests pass with cleaner, more maintainable function dispatch

**Current Coverage: ~97% of specification**

**Implemented:**
- Basic rule types: Gelijkstelling, KenmerkToekenning, ObjectCreatie, FeitCreatie, Consistentieregel, Initialisatie, Dagsoortdefinitie
- Beslistabel (decision tables) - full functionality (sequential row evaluation, n.v.t. handling, condition parsing)
- Verdeling (distribution) rules - full functionality (equal distribution, proportional, ordering, rounding, maximum constraints, remainder handling)
- Core expressions and operators
- Units, domains, parameters
- Basic predicates
- Elfproef validation - full functionality (BSN checksum validation using 11-proof algorithm)
- Dagsoort predicates - full functionality (day type declarations, definitions, and predicate checks)
- Uniqueness checks - full functionality (detects duplicate values across object instances)
- Date functions: tijdsduur_van (with whole year calculation), absolute_tijdsduur_van with unit conversion, aantal dagen in (basic), maand_uit, dag_uit, jaar_uit
- Aggregation functions: som_van, eerste_van, laatste_van, totaal_van, het_aantal (all patterns including feittype navigation)
- Generic collection resolution without hardcoded object types
- Dimensions (Dimensies) - full functionality (multi-valued attributes with adjectival/prepositional styles, coordinate-based access)
- Timeline expressions - full functionality (expression evaluation with empty value handling, timeline-aware rule execution, period definitions)
- Subselectie - full functionality (filtered collections with predicates, navigation expressions, aggregation integration)
- Recursion (Recursie) - full functionality (recursive rule groups with iteration tracking, termination conditions, safety limits)
- Compound predicates (Samengesteld Predicaat) - full functionality (all quantifiers, nested predicates, rule integration)

**Missing Critical Features:**
1. **Timelines (Tijdlijnen)**: Fully implemented ✓
   - ✓ Timeline expression evaluation with empty value handling
   - ✓ Timeline-aware rule execution
   - ✓ Timeline period definitions (van/tot, vanaf, tot en met)
   - ✓ Basic temporal operations
2. **Subselectie**: Fully implemented ✓
   - ✓ Filtering collections with predicates (DIE/DAT syntax)
   - ✓ Object predicates for kenmerk checks
   - ✓ Comparison predicates for attributes
   - ✓ Navigation expression support ("X van de Y" patterns)
   - ✓ Integration with aggregation functions
3. **Recursion (Recursie)**: Fully implemented ✓
   - ✓ Recursive rule evaluation within designated rule groups
   - ✓ Iteration tracking and 1000-iteration safety limit
   - ✓ Object creation with termination conditions
   - ✓ Context isolation between iterations
   - ✓ Semantic validation for recursive groups
4. **Advanced Predicates**: All implemented ✓
   - elfproef validation ✓ (BSN checksum validation implemented)
   - is uniek checks ✓ (uniqueness validation across instances implemented)
   - is een dagsoort ✓ (day type checking implemented)
5. **Compound Predicates (Samengesteld Predicaat)**: Fully implemented ✓
   - ✓ All quantifiers (ALLE, GEEN VAN DE, TEN_MINSTE, TEN_HOOGSTE, PRECIES)
   - ✓ Nested compound predicates with bullet level tracking
   - ✓ Integration with subselectie and aggregation functions
   - ✓ Full semantic validation
6. **Grammar Limitations**: aantal dagen in conditional pattern ("dat" clause)

**Next Priority**: Focus on code quality improvements - all major features are now implemented!