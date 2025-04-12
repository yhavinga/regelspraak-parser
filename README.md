# RegelSpraak Parser

An ANTLR4-based parser for the RegelSpraak v2.1.0 language, a Dutch domain-specific language for expressing business rules and decisions. This package allows parsing RegelSpraak text and integrating it into other Python applications.

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
├── README.md
├── requirements.txt        # Runtime dependencies
├── setup.py                # Package setup script
├── specification/          # Language specification documents
├── src/
│   └── regelspraak/        # Main Python package
│       ├── __init__.py
│       └── generated/      # ANTLR-generated parser files (IMPORTANT: create this dir)
│           └── ...         # Lexer, Parser, Listener, Visitor Python files
│   └── main/
│       └── antlr4/         # Source ANTLR grammar files
│           ├── RegelSpraakLexer.g4
│           └── RegelSpraak.g4
├── tests/                  # Test files using unittest
│   ├── resources/          # Test RegelSpraak files
│   └── ...                 # Python test scripts (test_*.py)
└── examples/               # Example RegelSpraak files (if any)
```

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

If you modify the `.g4` grammar files, you **must** regenerate the Python parser code. **Ensure the output directory `src/regelspraak/generated/` exists before running.**

The recommended command generates the Lexer, Parser, Visitor, and Listener files together in the correct package structure:

```bash
# Make sure you are in the project root directory
# Ensure the output directory exists: mkdir -p src/regelspraak/generated

cd src/main/antlr4 ; \
antlr4 -Dlanguage=Python3 RegelSpraakLexer.g4 -o ../../../src/regelspraak/generated ; \
antlr4 -Dlanguage=Python3 -visitor -listener RegelSpraak.g4 -o ../../../src/regelspraak/generated -package regelspraak.generated ; \
cd ../../..
```

*   `-Dlanguage=Python3`: Specifies the target language.
*   `RegelSpraak.g4 RegelSpraakLexer.g4`: Specifies the grammar files to process.
*   `-o src/regelspraak/generated`: Defines the output directory for generated files.
*   `-visitor`: Generates the base Visitor class (used by `src/regelspraak/visitor.py`).
*   `-listener`: Generates the base Listener class (provides an alternative processing pattern).
*   `-package regelspraak.generated`: Ensures the generated Python files are part of the `regelspraak.generated` package, crucial for correct imports within the project.

## Usage

### As a Standalone Tool (Within this Project)

After installation (`pip install -e .`) and generating the parser files (if needed), you can run scripts that use the parser.

```python
# Example: create a script `parse_example.py` in the root directory
from antlr4 import FileStream, CommonTokenStream, InputStream
from regelspraak.generated.RegelSpraakLexer import RegelSpraakLexer
from regelspraak.generated.RegelSpraakParser import RegelSpraakParser
# Optional: Import your custom Visitor or Listener if you create one
# from regelspraak.visitor import MyRegelSpraakVisitor

# Example using a file path
# input_stream = FileStream("path/to/your_regelspraak_file.rs", encoding='utf-8')

# Example using raw text
input_text = """
Objecttype de Persoon
    het naam Tekst;
    de leeftijd Numeriek (positief geheel getal);
Einde objecttype.
"""
input_stream = InputStream(input_text)

lexer = RegelSpraakLexer(input_stream)
stream = CommonTokenStream(lexer)
parser = RegelSpraakParser(stream)

# Parse starting from the 'regelSpraakDocument' rule (adjust if needed)
tree = parser.regelSpraakDocument()

# Process the Parse Tree (Choose one method):
# 1. Use ANTLR's built-in tree representation (for debugging):
print(tree.toStringTree(recog=parser))

# 2. Implement and use a Visitor (Recommended for structured processing):
# visitor = MyRegelSpraakVisitor()
# result = visitor.visitRegelSpraakDocument(tree)
# print(f"Visitor Result: {result}")

# 3. Implement and use a Listener (For event-driven processing):
# walker = ParseTreeWalker()
# listener = MyRegelSpraakListener()
# walker.walk(listener, tree)
# # Access results gathered by the listener
```

### As a Library in Another Project

1.  **Install the Package:** Install the `regelspraak-parser` package into your other project's environment. You can install it from:
    *   A Git repository: `pip install git+https://your-git-repo-url/regelspraak-parser.git`
    *   A local directory (if checked out): `pip install /path/to/regelspraak-parser`
    *   A built wheel (`.whl`) file.

2.  **Use in your Python Code:** Import and use the parser components similarly to the standalone example.

    ```python
    # In your other project's code (e.g., my_app.py)
    from antlr4 import InputStream, CommonTokenStream
    # Import directly from the installed package
    from regelspraak.generated.RegelSpraakLexer import RegelSpraakLexer
    from regelspraak.generated.RegelSpraakParser import RegelSpraakParser
    # Potentially import your custom Visitor/Listener if included in the package

    def parse_regelspraak_text(text: str):
        input_stream = InputStream(text)
        lexer = RegelSpraakLexer(input_stream)
        stream = CommonTokenStream(lexer)
        parser = RegelSpraakParser(stream)
        tree = parser.regelSpraakDocument() # Or appropriate entry rule

        # Process the tree, e.g., using a visitor
        # visitor = MyRegelSpraakVisitor() # Assuming you packaged a visitor
        # processed_data = visitor.visit(tree)
        # return processed_data

        # Or return the raw tree or string representation for now
        return tree.toStringTree(recog=parser)

    # Example usage
    regelspraak_code = """
    Domein Rechtshulp definitie
        Geldigheid: altijd;
    Einde domein.
    """
    parsed_output = parse_regelspraak_text(regelspraak_code)
    print(parsed_output)
    ```

## Grammar Implementation Notes

The ANTLR grammar (`RegelSpraak.g4` and `RegelSpraakLexer.g4`) incorporates specific design choices:

*   **Identifier Handling:** The `IDENTIFIER` token rule in the lexer currently *disallows* spaces. This prevents ambiguity where multi-word phrases might be mistakenly tokenized as a single identifier instead of keywords followed by identifiers (e.g., prevents lexing `geldig altijd` as one identifier).
*   **Multi-word Concepts:** Consequently, multi-word concepts (like `Natuurlijk persoon`, `recht op duurzaamheidskorting`, rule names) are parsed by rules expecting sequences of `IDENTIFIER` tokens (`IDENTIFIER+`). The primary rule for this is `naamwoord`, which is reused by `attribuutSpecificatie` and `variabeleToekenning`. The `onderwerpReferentie` and `kenmerkNaam` rules also handle multi-word constructs.
*   **Multi-word Keywords:** Many fixed RegelSpraak phrases (e.g., `is van het type`, `Datum in dagen`, `wordt berekend als`) are defined as single, distinct tokens in the lexer (`IS_VAN_HET_TYPE`, `DATUM_IN_DAGEN`, `WORDT_BEREKEND_ALS`). This simplifies the parser rules. **Crucially, these multi-word tokens must be defined *before* the `IDENTIFIER` rule in `RegelSpraakLexer.g4`** for the lexer to match them correctly.
*   **Nested References:** Phrases like `de datum van de vlucht van zijn reis` are handled by the `onderwerpReferentie` rule, which uses a `basisOnderwerp` rule and allows repeating prepositional phrases (`voorzetsel basisOnderwerp`) to parse nested ownership/relationships.
*   **Date Literals:** The `DATE_TIME_LITERAL` lexer rule (`dd-mm-yyyy` format) is defined *before* the `NUMBER` rule to ensure it gets precedence and correctly tokenizes dates instead of individual numbers.
*   **Variable Block Termination:** The `variabeleDeel` (`Daarbij geldt: ...`) requires a mandatory `SEMICOLON` at the end of each `variabeleToekenning` and must end with a `DOT`.
*   **Expression Simplification:** Expression parsing (`expressie`, `primaryExpression`, etc.) handles basic arithmetic, comparisons, and some specific function calls (`TIJDSDUUR_VAN`, `SOM_VAN`). It removes left-recursion but does *not* yet implement full operator precedence (e.g., multiplication before addition). This would require further refinement if complex mathematical expressions are needed.
*   **Eenheidsysteem Parsing:** Handling the `Eenheidsysteem` definition presented a specific challenge due to the context-sensitive nature of unit names described in Specification §3.7. Words like `meter`, `seconde`, `minuut` act as keywords elsewhere in the grammar but must be treated as identifiers (or specific unit tokens) within the `Eenheidsysteem` block (e.g., `de meter m`). Attempts to resolve this using standard ANTLR techniques like Lexer Modes or Semantic Predicates encountered difficulties, including runtime parsing errors (incorrect mode transitions, extraneous input) and persistent Python code generation issues (`IndentationError`) when using embedded parser actions with the ANTLR Python target. An external listener approach also proved complex due to the timing of mode switches relative to token consumption. The final working solution avoids modes and predicates. It defines specific lexer tokens for common unit abbreviations (e.g., `M`, `KG`, `S`) alongside the existing keywords (`METER`, `KILOGRAM`, etc.). A dedicated parser rule, `unitIdentifier`, explicitly lists all valid token types for a unit (standard `IDENTIFIER`, keywords like `METER`, abbreviations like `KG`). The `eenheidEntry` and `eenheidMacht` parser rules were updated to use `unitIdentifier`, allowing the parser context to correctly interpret these tokens within unit definitions without ambiguity. This deviates slightly from the specification's syntax example which uses `<naamwoord>` for the unit name, but correctly parses the intended structure given the keyword conflicts.

## Testing

The test suite uses Python's `unittest` framework. Ensure the package is installed in editable mode (`pip install -e .`) and parser files are generated before running tests.

```bash
# Run all tests from the project root directory
python -m unittest discover -s tests -p 'test_*.py'
# Or use the provided script (if it handles discovery)
# ./tests/run_tests.py
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
