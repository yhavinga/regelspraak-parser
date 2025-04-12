# RegelSpraak Interpreter Project Plan

## 1. Introduction

This document outlines the plan to develop the existing `regelspraak-parser` project beyond simple parsing into a functional RegelSpraak interpreter. The goal is to create a system capable of executing RegelSpraak rules, managing state, and potentially providing interactive interfaces like a REPL or a Jupyter Notebook kernel.

This plan builds upon the existing ANTLR4 grammar, generated parser code, basic data models, and unit tests.

## 2. Phases

The development is broken down into the following major phases:

**Phase 1: Solidify Parsing and Abstract Syntax Tree (AST) Generation**
    * Goal: Ensure the parser correctly handles the full v2.1.0 specification and produces a robust, usable AST.

**Phase 2: Develop the Core Interpreter Engine**
    * Goal: Create the "brain" that understands the AST and executes RegelSpraak semantics.

**Phase 3: Build Interactive Interfaces (Optional but Recommended)**
    * Goal: Provide user-friendly ways to interact with the interpreter (REPL, Jupyter).

**Phase 4: Testing, Refinement, and Documentation**
    * Goal: Ensure correctness, usability, and maintainability.

## 3. Detailed Tasks

### Phase 1: Parsing & AST Refinement

*   [ ] **Task 1.1: Verify/Update Grammar:** Briefly review `RegelSpraak.g4` against the full EBNF specification (Chapter 13) to ensure major constructs are covered. Make minor corrections if necessary.
*   [ ] **Task 1.2: Regenerate ANTLR Code:** If the grammar was modified, regenerate the Python parser/lexer/visitor/listener files using the `antlr4` command specified in `README.md`.
*   [ ] **Task 1.3: Expand Data Model (`model.py`):**
    *   Define more granular dataclasses to represent the full RegelSpraak AST. This includes specific nodes for:
        *   Expressions (Arithmetic, Comparison, Logical, Function Calls, Literals, References)
        *   Statements (Gelijkstelling, Kenmerktoekenning, ObjectCreatie, FeitCreatie, Verdeling, Initialisatie, etc.)
        *   Conditions (Elementaire, Samengestelde, Predicates)
        *   Definitions (ObjectType, Parameter, Domein, Dimensie, FeitType, Eenheid, Tijdlijn details)
        *   Units, Dimensions, Enumerations.
    *   Ensure the model can capture relationships (e.g., an expression contains sub-expressions, a rule contains conditions and results).
*   [ ] **Task 1.4: Complete AST Visitor (`visitor.py`):**
    *   Thoroughly implement the `RegelSpraakModelBuilder` visitor.
    *   Ensure `visit` methods exist for *all relevant parser rule contexts* defined in `RegelSpraakParser.py` (e.g., `visitRegel`, `visitGelijkstelling`, `visitVoorwaardeDeel`, `visitGetalExpressie`, etc.).
    *   Each `visit` method should construct and return the corresponding AST node(s) defined in the expanded `model.py`.
    *   Handle the structure of expressions (operator precedence) and conditions correctly when building the AST.
*   [ ] **Task 1.5: Refine Parser Tests:**
    *   Update existing tests (`test_*.py`) to not only check for parsing success (`assertNoParseErrors`) but also to verify the structure and content of the generated AST (the `Domain` object and its children returned by the visitor).
    *   Add tests for constructs not yet covered.

### Phase 2: Core Interpreter Engine

*   [ ] **Task 2.1: Design Interpreter Class:**
    *   Create a new `Interpreter` class (e.g., in `src/regelspraak/interpreter.py`).
    *   This class will hold the runtime state and execution logic.
*   [ ] **Task 2.2: Implement State Management:**
    *   The `Interpreter` needs to manage:
        *   Definitions: Loaded ObjectTypes, Domains, Parameters, etc. (from the AST).
        *   Runtime Instances: In-memory representations of created objects (e.g., instances of `Natuurlijk persoon`).
        *   Parameter Values: Current values assigned to parameters.
        *   Variable Scopes: Handle variables defined within rules (`Daarbij geldt:`).
        *   Time-dependent Data: A mechanism to store and query attribute/kenmerk values that change over time (if implementing time-dependency fully).
*   [ ] **Task 2.3: Implement AST Walker/Evaluator:**
    *   The `Interpreter` needs a method (e.g., `evaluate(node)`) that recursively walks the AST generated in Phase 1.
    *   Refactor/Move the evaluation logic from `parser.py` (e.g., `handle_arithmetic`) into the `Interpreter`, making it operate on the AST nodes from `model.py`.
*   [ ] **Task 2.4: Implement Full Semantics:**
    *   Implement the execution logic for *all* RegelSpraak expressions and operations based on the specifications (Chapters 6, 7, 8, 9):
        *   Arithmetic, Comparisons, Logical Operations.
        *   Function calls (`tijdsduur van`, `som van`, `aantal`, etc.).
        *   Handling of `leeg` values according to spec tables.
        *   Type checking during evaluation.
        *   Unit conversions based on `Eenheidsysteem` definitions.
        *   Evaluation of conditions and predicates.
        *   Execution of result parts (`gelijkstelling`, `kenmerktoekenning`, `objectCreatie`, `feitCreatie`, `verdeling`, etc.), modifying the interpreter's state.
    *   Implement the logic for resolving time-dependent values if applicable.
*   [ ] **Task 2.5: Implement Rule Execution Flow:**
    *   Add methods to load rules into the interpreter state.
    *   Implement logic to select and execute rules based on context (e.g., triggered by data changes or explicit calls).
    *   Handle the `geldig` clauses (rule versions) based on a provided `Rekendatum`.
    *   Implement the execution order (evaluate conditions, handle variables, execute results).
*   [ ] **Task 2.6: Handle Beslistabellen:** Decide on a strategy:
    *   *Option A:* Pre-process Beslistabellen into standard `Regel` AST nodes before interpretation.
    *   *Option B:* Add specific logic to the `Interpreter` to handle the structure and evaluation of Beslistabel AST nodes.

### Phase 3: Build Interactive Interfaces

*   [ ] **Task 3.1: Develop REPL:**
    *   Create a command-line interface using `cmd` or `prompt_toolkit`.
    *   Implement parsing of user input (RegelSpraak definitions/rules/commands).
    *   Define commands for:
        *   Loading files (`load <file>`).
        *   Defining elements directly (`Objecttype ...`, `Regel ...`).
        *   Setting context (`set parameter <name> = <value>`).
        *   Creating instances (`create <var> = <ObjectType> with ...`).
        *   Evaluating expressions or rules (`evaluate <expression>`, `execute <rule>`).
        *   Querying state (`get <instance>.<attribute>`, `show definitions`).
        *   Saving/loading state.
        *   Exiting (`exit`).
    *   Connect these commands to the `Interpreter` instance.
    *   Handle multi-line input for definitions/rules.
*   [ ] **Task 3.2: Develop Jupyter Kernel:**
    *   Install `ipykernel`.
    *   Create a custom Kernel class inheriting from `ipykernel.kernelbase.Kernel`.
    *   Implement `do_execute` to parse and interpret RegelSpraak code from cells, updating the persistent `Interpreter` state associated with the kernel.
    *   Implement `do_complete` for basic code completion (optional).
    *   Decide how users interact: pure RegelSpraak cells vs. magic commands vs. Python API calls within cells.
    *   Package the kernel for installation (`jupyter kernelspec install ...`).

### Phase 4: Testing, Refinement, and Documentation

*   [ ] **Task 4.1: Comprehensive Testing:**
    *   Write integration tests for the `Interpreter` engine, simulating rule execution scenarios with specific inputs and expected outputs.
    *   Test edge cases, `leeg` value handling, type/unit errors, time-dependency logic.
    *   Add tests for the REPL commands and Jupyter kernel functionality if implemented.
    *   Use the TOKA casus extensively for test scenarios.
*   [ ] **Task 4.2: Improve Error Handling:**
    *   Provide clearer error messages for parsing errors (linking to source location).
    *   Implement informative runtime errors from the interpreter (e.g., "TypeError: Cannot add Numeriek and Tekst", "UndefinedVariableError: 'X'", "UnitMismatchError: Cannot compare 'jr' and 'km'").
*   [ ] **Task 4.3: Documentation:**
    *   Update `README.md` to reflect the interpreter capabilities and link to this `PLAN.md`.
    *   Document the structure of the AST (`model.py`).
    *   Document the public API of the `Interpreter` class.
    *   Provide usage examples for the REPL and/or Jupyter kernel.
    *   Document any known limitations or deviations from the specification.
*   [ ] **Task 4.4: Refinements (Optional):**
    *   Performance profiling and optimization.
    *   Add state serialization (save/load definitions and runtime instances).
    *   Consider advanced features like debugging hooks, rule tracing, visualization of the object model or rule execution.
