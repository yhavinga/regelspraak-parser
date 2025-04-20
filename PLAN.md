# RegelSpraak Engine Development Plan

## 1. Introduction

This document outlines the development plan for the `regelspraak-parser` project, evolving it into a functional RegelSpraak engine capable of parsing, analyzing, and executing RegelSpraak rules. It follows a defined project structure and an incremental, phase-based development approach.

The goal is to create a robust, testable, and maintainable system following Python best practices, ultimately producing a language-agnostic Intermediate Representation (IR) and a Python-based interpreter.

## 2. Development Approach & Phases

We will adopt an incremental approach, focusing on building a minimal vertical slice ("Steel Thread") first and then expanding functionality phase by phase. This ensures a runnable product early on and allows for iterative refinement.

*   **Project Structure:** The code is organized into modules within the `src/regelspraak/` package: `parsing.py` (parser frontend, CST-to-IR builder), `ast.py` (IR/AST definitions, span info), `semantics.py` (semantic analysis), `runtime.py` (runtime objects), `engine.py` (interpreter components), `cli.py`, `jupyter_kernel.py`, `utils.py`, and `_antlr/` (generated code). The `tests/` directory mirrors this flat structure.
*   **Core Strategy:** The primary parsing pipeline will be: ANTLR Parse Tree -> Visitor -> Python IR/AST (Dataclasses) -> Python Interpreter.
*   **Methodology:** Implement the minimal viable functionality end-to-end first, then iteratively add features, ensuring tests pass at each stage.

**Development Phases:**

*   **Phase 1: Core Parsing & IR**
    *   Goal: Establish the core parsing pipeline (text -> ANTLR -> IR) and the essential, source-annotated IR structure.
    *   Key Modules: `grammar/`, `src/regelspraak/parsing.py`, `src/regelspraak/ast.py`, `tests/test_parsing.py`, `tests/test_ast.py`.
*   **Phase 2: Semantic Analysis & Linting**
    *   Goal: Add static analysis to detect errors like duplicate definitions or undefined references before execution.
    *   Key Modules: `src/regelspraak/semantics.py`, `src/regelspraak/cli.py` (lint command), `tests/test_semantics.py`, `tests/fixtures/`.
*   **Phase 3: Interpreter Engine & Tracing**
    *   Goal: Implement the core execution engine based on the IR, including state management and execution tracing.
    *   Key Modules: `src/regelspraak/engine.py`, `src/regelspraak/runtime.py`, `tests/test_engine.py`, `tests/test_runtime.py`.
*   **Phase 4: Command-Line Interface (CLI) & REPL**
    *   Goal: Provide basic interactive command-line tools for using the engine.
    *   Key Modules: `src/regelspraak/cli.py` (run command, REPL), `tests/test_cli.py`.
*   **Phase 5: Advanced Features & Integrations (Optional / Future)**
    *   Goal: Explore performance optimization, notebook integration, and web service deployment.
    *   Key Modules: `src/regelspraak/jupyter_kernel.py`, `src/regelspraak/compiler.py` (new file), `service/`.
*   **Phase 6: Continuous Integration & Quality Assurance (Ongoing)**
    *   Goal: Maintain code quality, ensure stability, and automate checks throughout development.
    *   Key Components: `pytest` config, `.github/workflows/`, linting/formatting configs (`pyproject.toml`), `.gitignore`.

## 3. Detailed Tasks by Phase

### Phase 1: Core Parsing & IR ("Steel Thread")

*   [x] **Task 1.1: Project Structure Setup:** Create the necessary directories and files (`grammar/`, `src/regelspraak/parsing.py`, `src/regelspraak/ast.py`, `tests/test_parsing.py`, etc.). Structure has been flattened.
*   [x] **Task 1.2: Grammar Placement:** Ensure `RegelSpraakLexer.g4` and `RegelSpraak.g4` are placed in `grammar/`.
*   [x] **Task 1.3: Generate ANTLR Artifacts:** Run the ANTLR command (`antlr4 -Dlanguage=Python3 -package regelspraak._antlr -o src/regelspraak/_antlr -visitor -listener grammar/*.g4`) to generate Python files in `src/regelspraak/_antlr/`. Note the updated package and output directory.
*   [ ] **Task 1.4: Define Core IR Nodes (`ast.py`):** Implement/Review basic `dataclasses` for core IR/AST elements (`DomainModel`, `ObjectType`, `Rule`, `Expression` subtypes, `Parameter`, `Domein`). Review existing code moved from `ir/nodes.py`.
*   [ ] **Task 1.5: Implement Span Helper (`ast.py`):** Add `SourceSpan` dataclass or integrate span info directly into AST nodes. Review if needed (related `_span_temp.py` was empty).
*   [ ] **Task 1.6: Implement Initial Visitor (`parsing.py`):**
    *   Review/Update the `RegelSpraakModelBuilder` class inheriting from `RegelSpraakVisitor`.
    *   Implement/Verify helper methods for extracting data and spans.
    *   Implement/Verify `visitRegelSpraakDocument` and other necessary `visit*` methods to construct the AST.
*   [ ] **Task 1.7: Basic AST/Parsing Unit Tests (`tests/test_ast.py`, `tests/test_parsing.py`):**
    *   Write tests parsing minimal strings using `parsing.parse_text`.
    *   Assert the resulting AST structure, content, and potentially spans.

### Phase 2: Semantic Analysis & Linting

*   [ ] **Task 2.1: Implement Semantic Checker (`semantics.py`):**
    *   Create the `SemanticChecker` class (potentially a visitor).
    *   Implement `collect` pass (build symbol table, check duplicates).
    *   Implement `validate_rules` pass (check undefined references, type consistency via recursive walk).
    *   Define `Issue` or `SemanticError` structure to report problems.
*   [ ] **Task 2.2: Create `lint` CLI Command (`cli.py`):**
    *   Add a `lint` command using `click`.
    *   Command should parse file to AST, run `SemanticChecker`, print errors/issues.
*   [ ] **Task 2.3: Semantic Checker Tests (`tests/test_semantics.py`):**
    *   Create sample `.rs` files in `tests/fixtures/` with semantic errors.
    *   Write tests calling a `lint(text)` or `validate(ast)` wrapper and asserting expected issues.

### Phase 3: Interpreter Engine & Tracing

*   [ ] **Task 3.1: Define Trace Interface (`engine.py`):** Implement `TraceEvent`, `TraceSink` ABC, and a basic `PrintTraceSink` implementation.
*   [ ] **Task 3.2: Implement Runtime Context (`runtime.py`):**
    *   Create `Instance` class (or similar runtime data structure).
    *   Create `RuntimeContext` class (holding `DomainModel`, parameters, instances, variable scopes, trace sink).
    *   Implement state access and manipulation methods (`get_variable`, `set_variable`, `get_attribute`, `create_instance`).
*   [ ] **Task 3.3: Implement Evaluator (`engine.py`):**
    *   Refine `Evaluator` class (takes `RuntimeContext`).
    *   Implement `evaluate_rule`, expression visitors (`evaluate_expression`, `_handle_binary`, etc.).
    *   Integrate calls to the `TraceSink`.
*   [ ] **Task 3.4: Implement Runtime Types (`runtime.py`):** Define helpers for runtime type handling/coercion if needed beyond basic Python types.
*   [ ] **Task 3.5: Interpreter Tests (`tests/test_engine.py`, `tests/test_runtime.py`):**
    *   Write unit tests for expression evaluation within `Evaluator`.
    *   Write unit tests for `RuntimeContext` methods.
    *   Write integration tests: load AST, create `RuntimeContext`, run `Evaluator`, assert final state and/or trace output.

### Phase 4: Command-Line Interface (CLI) & REPL

*   [ ] **Task 4.1: Enhance CLI (`cli.py`):**
    *   Implement `run` command: takes `.rs` file + data, parses, creates context, runs `Evaluator`, prints result/trace.
    *   Implement `repl` command (optional): interactive loop using `prompt_toolkit`, maintains `RuntimeContext`.
*   [ ] **Task 4.2: CLI Tests (`tests/test_cli.py`):** Add tests for the `run` command, potentially using `click.testing.CliRunner`.

### Phase 5: Advanced Features & Integrations (Optional / Future)

*   [ ] **Task 5.1: Jupyter Kernel (`jupyter_kernel.py`):** Implement `ipykernel.kernelbase.Kernel` subclass, `do_execute`, packaging.
*   [ ] **Task 5.2: Code-Gen Optimiser (`compiler.py`):** Implement `compile_rule`, AST-to-Python-AST conversion, caching, benchmarks.
*   [ ] **Task 5.3: FastAPI Service (`service/`):** Implement FastAPI app, Pydantic models, endpoint logic, Dockerfile.

### Phase 6: Continuous Integration & Quality Assurance (Ongoing)

*   [x] **Task 6.1: Basic Setup:** `.gitignore` created/updated, `pyproject.toml` created.
*   [ ] **Task 6.2: Testing Framework:** Configure `pytest`, `pytest-cov`.
*   [ ] **Task 6.3: Linting/Formatting:** Configure `black`, `ruff`, `mypy` in `pyproject.toml`.
*   [ ] **Task 6.4: GitHub Actions (`.github/workflows/ci.yml`):** Create workflow for setup, linting, testing (matrix), coverage.
*   [ ] **Task 6.5: Grammar Check:** Add CI step to verify generated ANTLR files match source `.g4`.
*   [ ] **Task 6.6: Semantic Fixture Check:** Add CI step to run `lint` command against `tests/fixtures/*.rs`.

## 4. Documentation

*   [ ] Update `README.md` progressively.
*   [ ] Maintain docstrings for public APIs.
*   [ ] Keep this `PLAN.md` updated.
*   [ ] Document limitations or specification deviations.
