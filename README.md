# RegelSpraak Parser

> [!WARNING]
> **EXPERIMENTAL, WORK IN PROGRESS.** This parser is incomplete and under active development.

An incomplete ANTLR4-based parser for the RegelSpraak v2.1.0 language, a Dutch domain-specific language for expressing business rules and decisions. This package allows parsing RegelSpraak text and integrating it into other Python applications.

## Overview

This project implements a parser for RegelSpraak v2.1.0, capable of processing:
- Object type definitions
- Domain definitions
- Dimension definitions
- Parameter definitions
- Fact type definitions
- Rules and decision tables
- Complex expressions and conditions

The core components are the ANTLR grammar files (`.g4`) and the Python runtime code generated from them.

## Project Structure

```
regelspraak-parser/
├── .gitignore
├── LICENSE
├── README.md
├── specification/          # Language specification documents
├── requirements.txt        # Runtime dependencies
├── setup.py                # Package setup script
├── grammar/                # Source ANTLR grammar files (.g4)
│   ├── RegelSpraakLexer.g4
│   └── RegelSpraak.g4
├── src/
│   └── regelspraak/        # Main Python package (flat structure)
│       ├── __init__.py     # Exports public API
│       ├── _antlr/         # Generated ANTLR files (isolated)
│       │   └── ...
│       ├── parsing.py      # Parser frontend, CST -> IR builder
│       ├── ast.py          # Intermediate Representation (AST nodes)
│       ├── semantics.py    # Semantic analysis (symbol table, type checks)
│       ├── runtime.py      # Runtime data objects (Instance, Value, etc.)
│       ├── engine.py       # Execution engine/interpreter
│       ├── errors.py       # Custom exception types
│       ├── cli.py          # Command-line interface logic
│       ├── jupyter_kernel.py # Optional Jupyter integration
│       └── utils.py        # Shared utility functions
├── tests/                  # Unit and integration tests (mirrors src structure)
│   ├── test_parsing.py
│   ├── test_ast.py
│   ├── test_semantics.py
│   ├── test_runtime.py
│   ├── test_engine.py
│   ├── test_cli.py
│   └── fixtures/           # Sample RegelSpraak files for testing
└── examples/               # Example RegelSpraak files (if any)
```

### How each file is structured

*   `parsing.py`: High-level functions (`parse_text`, `compile_file`), parser facade, inner `_Builder(Visitor)` class.
*   `ast.py`: Immutable dataclasses for IR nodes, `SourceSpan`, JSON serialization helpers.
*   `semantics.py`: `SymbolTable`, `StaticChecker` visitor, returns `list[Issue]` without raising.
*   `runtime.py`: Runtime data representation (`ParameterStore`, `Instance`, `Value`, `Unit`). No evaluation logic.
*   `engine.py`: `Evaluator` class (runs rules), `TraceEvent`, `TraceSink`, optional `explain()` helper.
*   `errors.py`: `ParseError`, `SemanticError`, `RuntimeError`, etc.
*   `cli.py`: `click` group (`compile`, `validate`, `run`, `explain`). No rule logic.
*   `jupyter_kernel.py`: Optional, isolated Jupyter kernel logic.
*   `utils.py`: Lightweight helpers (memoization, visitor mixins, etc.).

### Why this still scales

*   **Flat import graph:** Users typically only need `from regelspraak import parse_text, Evaluator, Runtime`.
*   **Module size:** Each module can grow significantly (~800 lines) before needing refactoring (e.g., split `engine.py` into `engine.py` and `optimizer.py`).
*   **Tooling simplicity:** `pytest`, `mypy`, `coverage` configuration remains straightforward.
*   **IDE navigation:** "Go to symbol" remains fast with fewer modules.

### Generated code isolation

*   The generated ANTLR code resides in `src/regelspraak/_antlr/`. This directory should be ignored by Git locally, but *checked-in* versions can be included when publishing packages (wheels).
*   Keeping generated code separate prevents accidental imports of generated classes instead of handwritten ones.

### Entry points exported in `__init__.py`

```python
# src/regelspraak/__init__.py
from .parsing import parse_text, parse_file
from .ast import DomainModel # Represents the parsed document/module
from .engine import Evaluator, TraceEvent, TraceSink
# from .runtime import Runtime, Instance, ParameterStore # Not yet implemented/exported
from .errors import ParseError, SemanticError, RuntimeError, RegelspraakError

# Public API definition is typically handled by __all__ in __init__.py
# __all__ = [...] 
```
This provides a clean, discoverable API for downstream users while keeping the codebase maintainable.

## Requirements

- Python 3.8+
- ANTLR 4.13.1+ **Tool** (for generating parser code, not required for runtime use)
- Java Runtime Environment (JRE) (for running the ANTLR tool)

## Installation

### 1. Setting up the Environment

It is highly recommended to use a virtual environment.

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
# .\venv\Scripts\activate  # Windows
```

### 2. Installing the Package

To use the parser within this project or install it for use in other projects:

**A) Install Runtime Dependencies:**
The required Python library (`antlr4-python3-runtime`) is listed in `requirements.txt` and `setup.py`.

```bash
pip install -r requirements.txt
# or directly via setup.py (which also installs the runtime dependency)
pip install .
# For development (allows editing the source without reinstalling):
# pip install -e .
```

**B) Install ANTLR Tool (Development Only):**
If you need to modify the grammar (`.g4` files) and regenerate the parser code, you need the ANTLR 4 tool.

```bash
# Example for Linux/Mac:
cd /usr/local/lib
curl -O https://www.antlr.org/download/antlr-4.13.1-complete.jar

# Add to your shell profile (.bashrc, .zshrc, etc.):
export CLASSPATH=".:/usr/local/lib/antlr-4.13.1-complete.jar:$CLASSPATH"
alias antlr4='java -jar /usr/local/lib/antlr-4.13.1-complete.jar'
alias grun='java org.antlr.v4.gui.TestRig'

# Verify installation
antlr4
```
Refer to the official ANTLR documentation for Windows installation or alternative methods.

### 3. Generating Parser Files (Development Only)

If you modify the `.g4` grammar files located in the `grammar/` directory, you **must** regenerate the Python parser code. Ensure the output directory `src/regelspraak/_antlr/` exists before running.

The recommended command generates the necessary Python files from the grammar:

```bash
# Make sure you are in the project root directory
# Ensure the output directory exists: mkdir -p src/regelspraak/_antlr

cd grammar ; \
antlr4 -Dlanguage=Python3 RegelSpraakLexer.g4 -o ../src/regelspraak/_antlr ; \
antlr4 -Dlanguage=Python3 -visitor -listener RegelSpraak.g4 -o ../src/regelspraak/_antlr -package regelspraak._antlr ; \
cd ..
```

*   `-Dlanguage=Python3`: Specifies the target language (Python).
*   `-package regelspraak._antlr`: Sets the Python package for the generated files. This is crucial for correct imports within the `_antlr` sub-package.
*   `-o src/regelspraak/_antlr`: Defines the output directory for the generated files.

## Usage

### As a Standalone Tool (Within this Project)

After installation (`pip install -e .`) and generating the parser files (if needed), you can use the library components.

```python
# Example: create a script `parse_example.py` in the root directory
# Import necessary components from the public API
from regelspraak import parse_text, DomainModel, Evaluator 
# Import specific error types
from regelspraak.errors import ParseError, SemanticError, RuntimeError

# Example using raw text
input_text = """
Objecttype de Persoon
    het naam Tekst;
    de leeftijd Numeriek (positief geheel getal);
Einde objecttype.

Regel PersoonIsMeerderjarig
    Voor elke Persoon p:
        Als de leeftijd van p >= 18
        Dan is p meerderjarig.
"""

try:
    # 1. Parse text into Intermediate Representation (IR/AST)
    # parse_text combines lexing, parsing, and building the IR
    # Use DomainModel as the type hint for the parsed result
    module: DomainModel = parse_text(input_text)
    print("--- IR/AST ---")
    # You might add a pretty-print or serialization method to DomainModel/AST nodes
    print(module) # Placeholder: print the top-level DomainModel object

    # 2. (Optional) Perform Semantic Analysis (e.g., type checking, symbol resolution)
    # from regelspraak.semantics import validate # Assuming a validate function exists
    # issues = validate(module)
    # if issues:
    #     print("\\n--- Semantic Issues ---")
    #     for issue in issues:
    #         print(issue)
    #     # Decide whether to proceed despite issues

    # 3. (Optional) Execute the rules using the Engine
    # from regelspraak.runtime import RuntimeContext # Assuming context class exists
    # context = RuntimeContext() # Initialize runtime state
    # evaluator = Evaluator(context)
    # trace = evaluator.execute_model(module) # Use execute_model (plural)
    # print("\\n--- Execution Trace (Summary) ---")
    # # Assuming trace object has methods like summary() or events list
    # # print(trace.summary()) 

except (ParseError, SemanticError, RuntimeError) as e:
    print(f"Error: {e}")

# Note: The original example showed direct ANTLR usage.
# The new structure encourages using higher-level functions like parse_text.
# Direct ANTLR interaction would now involve imports from regelspraak._antlr
# and potentially regelspraak.parsing._builder if accessing the visitor directly.
```

### As a Library in Another Project

1.  **Install the Package:** Install the `regelspraak-parser` package into your other project's environment (e.g., `pip install regelspraak-parser`).

2.  **Use in your Python Code:** Import the high-level functions and classes from the `regelspraak` package.

    ```python
    # In your other project's code (e.g., my_app.py)
    from regelspraak import parse_text, Evaluator, DomainModel
    from regelspraak.errors import ParseError, SemanticError, RuntimeError
    # Potentially import runtime context if needed
    # from regelspraak.runtime import RuntimeContext 

    def process_regelspraak_code(text: str):
        try:
            # Parse the text directly into the IR/AST DomainModel
            module: DomainModel = parse_text(text)
            print("Successfully parsed into IR.")

            # Example: You could now validate or execute the module
            # context = RuntimeContext() # Initialize context
            # evaluator = Evaluator(context)
            # results = evaluator.execute_model(module)
            # return results

            # For now, just return the parsed module representation
            return str(module) # Replace with desired output format

        except (ParseError, SemanticError, RuntimeError) as e:
            print(f"Failed to process RegelSpraak: {e}")
            return None

    # Example usage
    regelspraak_code = """
    Domein Rechtshulp definitie
        Geldigheid: altijd;
    Einde domein.
    """
    parsed_output = process_regelspraak_code(regelspraak_code)
    if parsed_output:
        print("\n--- Processed Output ---")
        print(parsed_output)
    ```

## Grammar Implementation Notes

The ANTLR grammar (`RegelSpraak.g4` and `RegelSpraakLexer.g4`) incorporates specific design choices:

*   **Identifier Handling:** The `IDENTIFIER` token rule in the lexer currently *disallows* spaces. This prevents ambiguity where multi-word phrases might be mistakenly tokenized as a single identifier instead of keywords followed by identifiers (e.g., prevents lexing `geldig altijd` as one identifier).
*   **Multi-word Concepts:** Consequently, multi-word concepts (like `Natuurlijk persoon`, `recht op duurzaamheidskorting`, rule names) are parsed by rules expecting sequences of `IDENTIFIER` tokens (`IDENTIFIER+`). The primary rule for this is `naamwoord`, which is reused by `attribuutSpecificatie` and `variabeleToekenning`. The `onderwerpReferentie` and `kenmerkNaam` rules also handle multi-word constructs.
*   **Multi-word Keywords:** Many fixed RegelSpraak phrases (e.g., `is van het type`, `Datum in dagen`, `wordt berekend als`) are defined as single, distinct tokens in the lexer (`IS_VAN_HET_TYPE`, `DATUM_IN_DAGEN`, `WORDT_BEREKEND_ALS`). This simplifies the parser rules. **Crucially, these multi-word tokens must be defined *before* the `IDENTIFIER` rule in `RegelSpraakLexer.g4`** for the lexer to match them correctly.
*   **Nested References:** Phrases like `de datum van de vlucht van zijn reis` are handled by the `onderwerpReferentie` rule, which uses a `basisOnderwerp` rule and allows repeating prepositional phrases (`voorzetsel basisOnderwerp`) to parse nested ownership/relationships.
*   **Date Literals:** The `DATE_TIME_LITERAL` lexer rule (`dd-mm-yyyy` format) is defined *before* the `NUMBER` rule to ensure it gets precedence and correctly tokenizes dates instead of individual numbers.
*   **Variable Block Termination:** The `variabeleDeel` (`Daarbij geldt: ...`) requires each `variabeleToekenning` within it to optionally end with a `SEMICOLON` (due to `SEMICOLON?` in the rule) and the entire block must end with a `DOT`.
*   **Expression Parsing:** Expression parsing (`expressie`, `primaryExpression`, etc.) handles arithmetic (with standard operator precedence via the rule hierarchy: power > mult/div > add/sub), comparisons, logical operations, and specific function calls (`TIJDSDUUR_VAN`, `SOM_VAN`). It removes left-recursion common in expression grammars.
*   **"aantal" Keyword Handling:** The grammar implements special handling for the word "aantal" which appears both as part of the aggregation function "het aantal" and in parameter names like "het aantal kinderen". This is resolved by:
    1. Making AANTAL a standalone token in the lexer (matching just "aantal")
    2. Using a pattern "HET AANTAL" in the primaryExpression rule for the function
    3. Explicitly allowing AANTAL tokens in the parameterNamePhrase rule to support parameter names containing "aantal"
    This approach preserves the ability to use words that function both as keywords and parts of identifiers.
*   **Eenheidsysteem Parsing:** Handling the `Eenheidsysteem` definition presented a specific challenge due to the context-sensitive nature of unit names described in Specification §3.7. Words like `meter`, `seconde`, `minuut` act as keywords elsewhere in the grammar but must be treated as identifiers (or specific unit tokens) within the `Eenheidsysteem` block (e.g., `de meter m`). Attempts to resolve this using standard ANTLR techniques like Lexer Modes or Semantic Predicates encountered difficulties, including runtime parsing errors (incorrect mode transitions, extraneous input) and persistent Python code generation issues (`IndentationError`) when using embedded parser actions with the ANTLR Python target. An external listener approach also proved complex due to the timing of mode switches relative to token consumption. The final working solution avoids modes and predicates. It defines specific lexer tokens for common unit abbreviations (e.g., `M`, `KG`, `S`) alongside the existing keywords (`METER`, `KILOGRAM`, etc.). A dedicated parser rule, `unitIdentifier`, explicitly lists all valid token types for a unit (standard `IDENTIFIER`, keywords like `METER`, abbreviations like `KG`). The `eenheidEntry` and `eenheidMacht` parser rules were updated to use `unitIdentifier`, allowing the parser context to correctly interpret these tokens within unit definitions without ambiguity. This deviates slightly from the specification's syntax example which uses `<naamwoord>` for the unit name, but correctly parses the intended structure given the keyword conflicts.
*   **Advanced Aggregations & Conditionals (§13.4.16.45-.53):** The grammar now includes support for advanced aggregation functions (`TOTAAL_VAN`, `AANTAL_DAGEN_IN`, `TIJDSEVENREDIG_DEEL_PER`) and conditional expressions (`conditieBijExpressie`). Dimension aggregation rules (`dimensieSelectie`, `aggregerenOver...`) are also included based on the specification.
*   **Parsing Natural Language Ambiguities:** Implementing these features highlighted challenges inherent in parsing Dutch natural language constructs within ANTLR. Specifically, phrases starting with common words (like "Het" or "het") which also function as keywords or parts of multi-word tokens created significant parsing ambiguities and lexer tokenization difficulties. Initial attempts using standard grammar structures and whitespace skipping failed to resolve "no viable alternative" errors.
*   **Resolution Strategy:** The successful approach involved several key adjustments:
    *   **Specific Multi-Word Tokens:** Defining explicit, longer tokens in the lexer for problematic phrases (e.g., `HET_AANTAL_DAGEN_IN`, `HET_KWARTAAL`) ensures they are recognized atomically before potentially conflicting shorter tokens or identifiers.
    *   **Hidden Whitespace Channel:** Changing the lexer's whitespace rule (`WS: [ \t\r\n]+ -> channel(HIDDEN);`) to use a hidden channel instead of `skip` was crucial. This preserves whitespace information for the parser, preventing incorrect merging of adjacent words while still ignoring whitespace for grammar rule matching.
    *   **Explicit Parser Alternatives:** Adding specific alternatives in parser rules (like `resultaatDeel` and `primaryExpression`) to handle capitalized versions or common variations of these multi-word phrases provided necessary disambiguation for the parser.
    This strategy, while adding some specific phrase handling, proved necessary for robustly parsing the intended natural language structures.
*   **Whitespace & Newline Handling:** The grammar sends all whitespace (spaces, tabs, newlines) to the HIDDEN channel using `WS: [ \t\r\n]+ -> channel(HIDDEN);` in the lexer. This design choice:
    *   Significantly simplifies the grammar by removing the need for explicit `NEWLINE*` sequences throughout the rules
    *   Allows for flexible document formatting without changing semantic meaning
    *   Enables termination of statements with either periods, semicolons, or simple newlines

## Testing

The test suite uses Python's `unittest` framework and resides in the `tests/` directory. Ensure the package is installed (preferably in editable mode: `pip install -e .`) and parser files are generated before running tests.

```bash
# Run all tests from the project root directory
python -m unittest discover -s tests -p 'test_*.py'
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the existing style and includes appropriate tests.

### Development Setup

1. Follow the installation instructions above
2. Install development dependencies: `pip install -r requirements-dev.txt` (if exists)
3. Run tests before submitting: `python -m unittest discover -s tests -p 'test_*.py'`
4. Ensure your code passes all existing tests
5. Add new tests for new functionality
