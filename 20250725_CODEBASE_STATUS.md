# RegelSpraak Parser Codebase Status

## Current Implementation Coverage
- **~97% of specification implemented**
- **439 tests passing** (11 skipped acceptable)
- All major features complete

## Technical Architecture

### Module Responsibilities
- **parsing.py** (4KB): Simple facade, delegates to builder
- **builder.py** (~180KB): Complex ANTLR visitor implementation
  - Handles grammar-to-AST transformation
  - Still uses `parameter_names` tracking (required for semantic analyzer)
  - **CRITICAL ISSUE**: Severely oversized at 180KB (2.5x larger than documented)
  - **ISSUE**: Overly complex, especially `_extract_canonical_name` function (136 lines)
- **ast.py** (19KB): Immutable dataclasses with SourceSpan tracking
- **runtime.py** (40KB): Data structures only (no logic)
- **engine.py** (~339KB): Execution logic with tracing
  - **CRITICAL ISSUE**: Largest module in codebase, needs decomposition
  - Monolithic design violates single responsibility principle
- **units.py** (11KB): BaseUnit, CompositeUnit, UnitSystem, UnitRegistry
- **arithmetic.py** (17KB): Unit-aware operations with decimal preservation
- **semantics.py** (37KB): Semantic analysis with symbol table
- **timeline_utils.py**: Timeline period handling utilities
- **beslistabel_parser.py**: Decision table parsing logic

### Technical Constraints
- **No linting tools**: Manual style consistency required
- **ANTLR JAR**: Located at `lib/antlr-4.13.1-complete.jar`
- **Python 3.7+**: Minimum version requirement
- **Generated files**: `src/regelspraak/_antlr/` may not be in git
- **Test count**: 439 tests must pass (11 skipped acceptable)

## Remaining Issues

### High Priority
1. **Decompose engine.py (339KB)**
   - Largest file in codebase, 5x larger than reasonable
   - Monolithic design with mixed responsibilities
   - Extract: expression evaluation, rule execution, timeline handling into separate modules
   
2. **Refactor builder.py (180KB)**
   - 180KB indicates severe architectural issues
   - `_extract_canonical_name` (136 lines) is a symptom of grammar/visitor mismatch
   - Consider: separate visitor classes per feature, push logic to semantic analysis
   - Extract: decision table building, dimension handling, aggregation building

### Medium Priority
1. **Centralize IS/IN Logic**
   - Move from RuntimeContext to Evaluator
   - Improves separation of concerns

2. **Add Type Checking to CLI Data Loading**
   - Validate JSON data against DomainModel before execution
   - Prevents runtime surprises

3. **Enhance Tracing Consistency**
   - Add granular TraceSink calls for AI explainability
   - Critical for future debugging/explanation features

### Low Priority
1. **Review parameter_names hack** (if refactoring opportunity arises)
2. **Review Operator Enum for IS/IN semantics**

## Future Development Roadmap

### Phase 1 (Current): Pure Python Interpreter
- ✓ All major features implemented
- Next: Enhance execution tracing for explainability
- Status: ~97% of specification implemented

### Phase 2: Performance Optimization
- Python AST code generation from IR
- Compile rules to Python functions with `compile()`
- Expected 3-30x performance improvement
- Cache compiled rules for reuse

### Phase 3: Multi-Language Support
- Freeze IR as language-agnostic format (JSON/Protobuf)
- Implement additional backends (JVM, Go, WASM) as needed
- Enable polyglot deployment scenarios
- Share rule definitions across platforms

## AI-Powered Explainability Vision

### Prerequisites (Foundation)
1. **Robust AST & Semantic Model** ✓ COMPLETED
2. **Accurate Runtime Engine** ✓ COMPLETED  
3. **Comprehensive Execution Tracing** ← NEXT PRIORITY

### Implementation Steps

1. **Step 1: Enhance Granularity and Structure of Execution Tracing** (High Priority)
   - **Location**: `engine.py`, `runtime.py`, `ast.py` (for spans)
   - **Trace Events Needed**:
     - Rule evaluation start/end (including which instance)
     - Condition evaluation start/end (with outcome: true/false)
     - Evaluation of each part of complex conditions (recording intermediate values)
     - Variable/Parameter/Attribute reads (what value was read)
     - Variable/Parameter/Attribute writes (old value, new value)
     - Function calls (name, arguments, result)
     - Rule firing (which rule, for which instance)
     - Rule not firing (and why - e.g., condition false)
     - Object creation/kenmerk assignment
   - **Event Structure** (JSON format):
     - `event_type` (e.g., `RULE_EVAL_START`, `CONDITION_EVAL`, `VAR_READ`, `ATTR_WRITE`)
     - `timestamp` or logical step counter
     - `rule_name` (if applicable)
     - `instance_id` (if applicable)
     - `ast_node_span` (linking event to source code via `SourceSpan`)
     - `details`: Dictionary with relevant data (variable names, values, operator, function name, etc.)
   - **Implementation**: Modify `evaluate_expression`, `_handle_binary`, `_handle_unary`, `_handle_function_call`, `_apply_resultaat`, and `RuntimeContext` setters/getters

2. **Step 2: Integrate Semantic Information with Traces** (Medium Priority)
   - **Location**: `engine.py` (trace emission points), `TraceSink` implementations
   - **Action**: Link trace events to semantic model (`DomainModel` and `SymbolTable`)
   - **Details**: Include defined types and units from semantic model/symbol table in trace events alongside runtime values
   - **Rationale**: Enables explaining not just *what* happened, but *why* in terms of defined types (e.g., "leeftijd (Numeriek jr) was compared to volwassenleeftijd (Numeriek jr)")

3. **Step 3: Develop an Explanation Query Interface** (Medium Priority)
   - **Location**: New module (e.g., `explainability.py`), `cli.py`, `repl.py`
   - **Common Explanation Queries**:
     - "Explain rule X"
     - "Why is attribute Y of instance Z equal to V?"
     - "Trace the calculation of variable A"
   - **Implementation**: New REPL command (`:explain why person_15 is minderjarig`) and CLI integration
   - **Rationale**: Creates user-facing entry point for explainability features

4. **Step 4: Implement the Explanation Generation Module** (Medium Priority)
   - **Location**: New module (`explainability.py`)
   - **Components**:
     - **Trace Processor**: Filter/select relevant events based on user query (e.g., all events for calculating `minderjarig` for `person_15`)
     - **Context Retriever**: Fetch RegelSpraak source snippets using `SourceSpan` from trace events and AST
     - **LLM Prompt Engineering**: Construct prompts with:
       - User's question
       - Filtered trace events (structured data)
       - Relevant source code snippets
       - Semantic context (definitions, types, units)
       - Instructions for desired explanation format
     - **LLM Interaction**: Code to call LLM API (OpenAI, Anthropic, local model) with prompt
   - **Rationale**: Core AI integration point translating execution data into human-understandable explanations

5. **Step 5: Integrate and Refine** (Low Priority - Iterative)
   - **Location**: `cli.py`, `repl.py`, `explainability.py`
   - **Action**: Connect query interface to generation module, test and refine
   - **Process**: Start with simple explanations (single rule text, direct calculations), iteratively add complex "why" queries
   - **Evaluation**: Assess accuracy and clarity of AI-generated explanations
   - **Rationale**: Explainability is an iterative development process requiring refinement

## Technical Debt Metrics

### Module Size Analysis
| Module | Size | Status | Recommended Action |
|--------|------|--------|-------------------|
| engine.py | 339KB | 🔴 CRITICAL | Split into 5-6 modules |
| builder.py | 180KB | 🔴 CRITICAL | Split into 3-4 visitor classes |
| runtime.py | 40KB | 🟡 WARNING | Consider splitting |
| semantics.py | 37KB | 🟢 OK | Manageable size |
| ast.py | 19KB | 🟢 OK | Appropriate for data classes |
| arithmetic.py | 17KB | 🟢 OK | Well-focused |
| units.py | 11KB | 🟢 OK | Well-focused |
| parsing.py | 4KB | 🟢 OK | Proper facade |

### Key Technical Debt Items
1. **Monolithic Modules**: engine.py and builder.py contain 519KB (74%) of core logic
2. **Complex Name Extraction**: 136-line function indicates grammar/code mismatch
3. **Parameter Tracking Hack**: Architectural debt requiring AST node distinction
4. **No Static Analysis**: No linting/type checking enforced
5. **Test Organization**: 440 tests in flat structure, needs categorization

## Grammar Limitations
- **aantal dagen in conditional pattern**: "dat" clause not fully supported by grammar
- **totaal van concatenation pattern**: Grammar expects single expression after HET_TOTAAL_VAN, not concatenation like "het totaal van X, Y en Z" (som_van does support this pattern)
- All other major features fully implemented