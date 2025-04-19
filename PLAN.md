# RegelSpraak Engine Development Plan

## 1. Introduction

This document outlines the development plan for the `regelspraak-parser` project, evolving it into a functional RegelSpraak engine capable of parsing, analyzing, and executing RegelSpraak rules. It follows a defined project structure and an incremental, phase-based development approach.

The goal is to create a robust, testable, and maintainable system following Python best practices, ultimately producing a language-agnostic Intermediate Representation (IR) and a Python-based interpreter.

## 2. Development Approach & Phases

We will adopt an incremental approach, focusing on building a minimal vertical slice ("Steel Thread") first and then expanding functionality phase by phase. This ensures a runnable product early on and allows for iterative refinement.

*   **Project Structure:** The code will be organized into modules within `src/regelspraak/`: `parse` (ANTLR artifacts, CST-to-IR builder), `ir` (IR definitions, span info), `sema` (semantic analysis), `exec` (interpreter components), `cli`, and `kernel`.
*   **Core Strategy:** The primary parsing pipeline will be: ANTLR Parse Tree -> Visitor -> Python IR (Dataclasses) -> Python Interpreter.
*   **Methodology:** Implement the minimal viable functionality end-to-end first, then iteratively add features, ensuring tests pass at each stage.

**Development Phases:**

*   **Phase 1: Core Parsing & IR**
    *   Goal: Establish the core parsing pipeline (text -> ANTLR -> IR) and the essential, source-annotated IR structure.
    *   Key Modules: `grammar/`, `src/regelspraak/parse/`, `src/regelspraak/ir/`, `tests/ir/`.
*   **Phase 2: Semantic Analysis & Linting**
    *   Goal: Add static analysis to detect errors like duplicate definitions or undefined references before execution.
    *   Key Modules: `src/regelspraak/sema/`, `src/regelspraak/cli/` (lint command), `tests/sema/`, `tests/fixtures/`.
*   **Phase 3: Interpreter Engine & Tracing**
    *   Goal: Implement the core execution engine based on the IR, including state management and execution tracing.
    *   Key Modules: `src/regelspraak/exec/`, `tests/exec/`.
*   **Phase 4: Command-Line Interface (CLI) & REPL**
    *   Goal: Provide basic interactive command-line tools for using the engine.
    *   Key Modules: `src/regelspraak/cli/` (run command, REPL).
*   **Phase 5: Advanced Features & Integrations (Optional / Future)**
    *   Goal: Explore performance optimization, notebook integration, and web service deployment.
    *   Key Modules: `src/regelspraak/kernel/`, `src/regelspraak/exec/compiler.py`, `service/`.
*   **Phase 6: Continuous Integration & Quality Assurance (Ongoing)**
    *   Goal: Maintain code quality, ensure stability, and automate checks throughout development.
    *   Key Components: `pytest` config, `.github/workflows/`, linting/formatting configs (`pyproject.toml`), `.gitignore`.

## 3. Detailed Tasks by Phase

### Phase 1: Core Parsing & IR ("Steel Thread")

*   [x] **Task 1.1: Project Structure Setup:** Create the necessary directories (`grammar/`, `src/regelspraak/parse/`, `src/regelspraak/ir/`, `tests/ir/`, etc.).
*   [x] **Task 1.2: Grammar Placement:** Ensure `RegelSpraakLexer.g4` and `RegelSpraak.g4` are placed in `grammar/`.
*   [ ] **Task 1.3: Generate ANTLR Artifacts:** Run the ANTLR command (`antlr4 -Dlanguage=Python3 -package regelspraak.parse.antlr -o src/regelspraak/parse/antlr grammar/*.g4`) to generate Python files in `src/regelspraak/parse/antlr/`.
*   [ ] **Task 1.4: Define Core IR Nodes (`ir/nodes.py`):** Implement basic `dataclasses` for core IR elements (`Module`, `ObjectType`, `Rule`, `Expr` subtypes, `Parameter`, `TypeRef`). Review existing code moved from `model.py` and align/expand as needed. Focus initially on types needed for a minimal parsing example.
*   [ ] **Task 1.5: Implement Span Helper (`ir/span.py`):** Create the `Span` dataclass (`start_line`, `start_col`, `end_line`, `end_col`) and `from_token(token)` static method. Populate the existing empty file.
*   [ ] **Task 1.6: Implement Initial Visitor (`parse/builder.py`):**
    *   Review/Update the `ToIR` class (moved from `visitor.py`) inheriting from `RegelSpraakVisitor`.
    *   Implement/Verify the `span(ctx)` helper method.
    *   Implement `visitRegelSpraakDocument`.
    *   Implement visitor methods (e.g., `visitObjectTypeDefinition`, `visitRule`) needed for the minimal "steel thread" example, constructing IR nodes and assigning spans.
*   [ ] **Task 1.7: Basic IR Unit Tests (`tests/ir/`):**
    *   Create test files (e.g., `test_builder.py`).
    *   Write tests parsing minimal strings, invoking the visitor, and asserting the resulting IR structure, content, and spans.

### Phase 2: Semantic Analysis & Linting

*   [ ] **Task 2.1: Implement Semantic Checker (`sema/checker.py`):**
    *   Create the `SemanticChecker` class (populate existing empty file).
    *   Implement `collect` pass (build symbol table, check duplicates).
    *   Implement `validate_rules` pass (check undefined references via recursive `_walk_expr`).
*   [ ] **Task 2.2: Create `lint` CLI Command (`cli/__main__.py`):**
    *   Add a `lint` command using `click` (populate existing empty file).
    *   Command should parse file to IR, run `SemanticChecker`, print errors.
*   [ ] **Task 2.3: Semantic Checker Tests (`tests/sema/`):**
    *   Create test files (e.g., `test_checker.py`).
    *   Create sample `.rs` files in `tests/fixtures/` with semantic errors.
    *   Write tests calling a `lint(text)` wrapper and asserting expected error messages.

### Phase 3: Interpreter Engine & Tracing

*   [ ] **Task 3.1: Define Trace Interface (`exec/trace.py`):** Implement `TraceSink` ABC and a basic `PrintTrace` implementation (populate existing empty file).
*   [ ] **Task 3.2: Implement Runtime Context (`exec/context.py`):**
    *   Create `Instance` class.
    *   Create `Context` class (holding `module`, `parameters`, `instances`, `trace`).
    *   Implement instance creation and state access methods (populate existing empty file).
*   [ ] **Task 3.3: Implement Evaluator (`exec/evaluator.py`):**
    *   Create `Eval` class (IR visitor). Takes `Context`.
    *   Implement `visit_Rule`, expression visitors (`visit_BinaryOp`, etc.), and `_apply_action` logic.
    *   Integrate calls to the `TraceSink` (populate existing empty file).
*   [ ] **Task 3.4: Implement Runtime Types (`exec/runtime_types.py`):** Define helpers for runtime type handling if needed (populate existing empty file).
*   [ ] **Task 3.5: Interpreter Tests (`tests/exec/`):**
    *   Create test files (`test_evaluator.py`, `test_context.py`).
    *   Write unit tests for expression evaluation.
    *   Write integration tests: load IR, create Context, run Eval, assert final state and/or trace output.

### Phase 4: Command-Line Interface (CLI) & REPL

*   [ ] **Task 4.1: Enhance CLI (`cli/__main__.py`):**
    *   Implement `run` command: takes `.rs` file + data, runs Eval, prints result/trace.
    *   Implement `repl` command: interactive loop using `prompt_toolkit`, maintains `Context`.
*   [ ] **Task 4.2: CLI Tests:** Add tests for the `run` and `repl` commands if feasible.

### Phase 5: Advanced Features & Integrations (Optional / Future)

*   [ ] **Task 5.1: Jupyter Kernel (`kernel/`):** Implement `ipykernel.kernelbase.Kernel` subclass, `do_execute`, packaging.
*   [ ] **Task 5.2: Code-Gen Optimiser (`exec/compiler.py`):** Implement `compile_rule`, IR-to-AST conversion, caching, benchmarks.
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
