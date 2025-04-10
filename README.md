# RegelSpraak Parser

An ANTLR4-based parser for the RegelSpraak v2.1.0 language, a Dutch domain-specific language for expressing business rules and decisions.

## Overview

This project implements a parser for RegelSpraak v2.1.0, capable of processing:
- Object type definitions
- Domain definitions
- Dimension definitions
- Parameter definitions
- Fact type definitions
- Rules and decision tables
- Complex expressions and conditions

## Project Structure

```
regelspraak-parser/
├── specification/           # Language specification documents
├── src/                    # Source code
│   └── main/
│       └── antlr4/        # ANTLR grammar files
├── tests/                  # Test files
└── examples/              # Example RegelSpraak files
```

## Requirements

- Python 3.8+
- ANTLR4 4.13.1+
- antlr4-python3-runtime

## Installation

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # or
   .\venv\Scripts\activate  # Windows
   ```

2. Install dependencies:
   ```bash
   pip install antlr4-python3-runtime
   ```

3. Install ANTLR4:
   ```bash
   # Linux/Mac
   cd /usr/local/lib
   curl -O https://www.antlr.org/download/antlr-4.13.1-complete.jar
   
   # Add to .bashrc or .zshrc:
   export CLASSPATH=".:/usr/local/lib/antlr-4.13.1-complete.jar:$CLASSPATH"
   alias antlr4='java -jar /usr/local/lib/antlr-4.13.1-complete.jar'
   alias grun='java org.antlr.v4.gui.TestRig'
   ```

## Usage

1. **Generate Parser Files:**
    Run the ANTLR generator first for the lexer, then the parser. Ensure you have ANTLR properly installed and configured (see Installation).
    ```bash
    # Make sure you are in the project root directory
    antlr4 -Dlanguage=Python3 src/main/antlr4/RegelSpraakLexer.g4 -o src/regelspraak/generated
    antlr4 -Dlanguage=Python3 -visitor src/main/antlr4/RegelSpraak.g4 -o src/regelspraak/generated
    ```
    *Note:* It's crucial to run the lexer generation first as it creates a `.tokens` file required by the parser grammar when using `tokenVocab`.

2. **Use in Python:**
    Import the necessary generated classes and standard ANTLR components.
    ```python
    from antlr4 import FileStream, CommonTokenStream, InputStream
    from regelspraak.generated.RegelSpraakLexer import RegelSpraakLexer
    from regelspraak.generated.RegelSpraakParser import RegelSpraakParser

    # Example using a file
    # input_stream = FileStream("your_regelspraak_file.rs", encoding='utf-8') 
    # Example using text
    input_text = """Objecttype de Persoon
        het naam Tekst;
        de leeftijd Numeriek (positief geheel getal);
    """
    input_stream = InputStream(input_text)

    lexer = RegelSpraakLexer(input_stream)
    stream = CommonTokenStream(lexer)
    parser = RegelSpraakParser(stream)
    
    # Assuming 'regelSpraakDocument' is the main entry rule for a full file
    tree = parser.regelSpraakDocument()
    
    # TODO: Add visitor/listener logic to process the tree
    # print(tree.toStringTree(recog=parser))
    ```

## Grammar Implementation Notes

The current ANTLR grammar (`RegelSpraak.g4` and `RegelSpraakLexer.g4`) incorporates specific design choices to handle the nuances of the RegelSpraak language:

*   **Identifier Handling:** The `IDENTIFIER` token rule in the lexer currently *disallows* spaces. This prevents ambiguity where multi-word phrases might be mistakenly tokenized as a single identifier instead of keywords followed by identifiers (e.g., prevents lexing `geldig altijd` as one identifier).
*   **Multi-word Concepts:** Consequently, multi-word concepts (like `Natuurlijk persoon`, `recht op duurzaamheidskorting`, rule names) are parsed by rules expecting sequences of `IDENTIFIER` tokens (`IDENTIFIER+`). The primary rule for this is `naamwoord`, which is reused by `attribuutSpecificatie` and `variabeleToekenning`. The `onderwerpReferentie` and `kenmerkNaam` rules also handle multi-word constructs.
*   **Multi-word Keywords:** Many fixed RegelSpraak phrases (e.g., `is van het type`, `Datum in dagen`, `wordt berekend als`) are defined as single, distinct tokens in the lexer (`IS_VAN_HET_TYPE`, `DATUM_IN_DAGEN`, `WORDT_BEREKEND_ALS`). This simplifies the parser rules. **Crucially, these multi-word tokens must be defined *before* the `IDENTIFIER` rule in `RegelSpraakLexer.g4`** for the lexer to match them correctly.
*   **Nested References:** Phrases like `de datum van de vlucht van zijn reis` are handled by the `onderwerpReferentie` rule, which uses a `basisOnderwerp` rule and allows repeating prepositional phrases (`voorzetsel basisOnderwerp`) to parse nested ownership/relationships.
*   **Date Literals:** The `DATE_TIME_LITERAL` lexer rule (`dd-mm-yyyy` format) is defined *before* the `NUMBER` rule to ensure it gets precedence and correctly tokenizes dates instead of individual numbers.
*   **Variable Block Termination:** The `variabeleDeel` (`Daarbij geldt: ...`) requires a mandatory `SEMICOLON` at the end of each `variabeleToekenning` and must end with a `DOT`.
*   **Expression Simplification:** Expression parsing (`expressie`, `primaryExpression`, etc.) handles basic arithmetic, comparisons, and some specific function calls (`TIJDSDUUR_VAN`, `SOM_VAN`). It removes left-recursion but does *not* yet implement full operator precedence (e.g., multiplication before addition). This would require further refinement if complex mathematical expressions are needed.

## Testing

The test suite uses Python's `unittest` framework.

```bash
# Run all tests
./tests/run_tests.py 
# Or run specific tests
# python -m unittest tests.test_domein
```

## License

[License information to be added]

## Contributing

[Contribution guidelines to be added] 