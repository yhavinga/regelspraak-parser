# RegelSpraak Parser

> [!WARNING]
> **EXPERIMENTAL, WORK IN PROGRESS.** This parser is incomplete and under active development.

A nearly-complete ANTLR4-based parser for the RegelSpraak v2.1.0 language, implementing ~95-97% of the specification. RegelSpraak is a Dutch domain-specific language for expressing business rules and decisions. This package allows parsing RegelSpraak text and integrating it into other Python applications.

## Overview

This project implements a parser for RegelSpraak v2.1.0, capable of processing:
- Object type definitions with multi-dimensional attributes (Dimensies)
- Domain definitions
- Dimension definitions with adjectival and prepositional styles
- Parameter definitions
- Fact type definitions and relationship creation (FeitCreatie)
- All rule types: Gelijkstelling, Kenmerktoekenning, Initialisatie, Consistentie
- Decision tables (Beslistabel) and distribution rules (Verdeling)
- Complex expressions with timeline support
- Filtered collections (Subselectie) with DIE/DAT syntax
- Recursive rule groups (Recursie) with safety limits
- Advanced predicates: elfproef, dagsoort, uniqueness checks
- Compound predicates (samengesteld predicaat) with quantifiers
- All aggregation functions: som van, het aantal, tijdsduur van, etc.

The implementation includes 439 passing tests covering all major features. The core components are the ANTLR grammar files (`.g4`) and the Python runtime code generated from them.

## Project Structure

```
regelspraak-parser/
├── .gitignore
├── LICENSE
├── Makefile                # Makefile for common tasks like parser generation and testing
├── README.md               # This file
├── requirements.txt        # Runtime dependencies
├── setup.py                # Package setup script
├── grammar/                # Source ANTLR grammar files (.g4)
│   ├── RegelSpraakLexer.g4
│   └── RegelSpraak.g4
├── specification/          # Language specification documents
│   └── ...
├── src/
│   └── regelspraak/        # Main Python package
│       ├── __init__.py     # Exports public API
│       ├── _antlr/         # Generated ANTLR files (isolated)
│       │   └── ...         # (Generated files - may not be in git)
│       ├── parsing.py      # Parser frontend, CST -> IR builder
│       ├── ast.py          # Intermediate Representation (AST nodes)
│       ├── semantics.py    # Semantic analysis (symbol table, type checks - placeholder)
│       ├── runtime.py      # Runtime data objects (Instance, Value, etc.)
│       ├── engine.py       # Execution engine/interpreter
│       ├── errors.py       # Custom exception types
│       ├── repl.py         # Interactive REPL logic
│       ├── jupyter_kernel.py # Optional Jupyter integration
│       └── cli.py          # Command-line interface logic
└── tests/                  # Unit and integration tests
    ├── __init__.py
    ├── run_tests.py        # Test runner script
    ├── test_base.py        # Base class for tests
    ├── test_*.py           # Various test files (e.g., test_cli.py, test_regel.py)
    └── resources/          # Sample RegelSpraak files for testing
        └── *.rs            # Test files
        └── *.json          # Test data files
```

### How each file is structured

*   `parsing.py`: High-level functions (`parse_text`, `parse_file`), parser facade, inner `_Builder(Visitor)` class.
*   `ast.py`: Immutable dataclasses for IR nodes, `SourceSpan`, JSON serialization helpers.
*   `semantics.py`: Placeholder for `SymbolTable`, `StaticChecker` visitor, should return `list[Issue]` without raising.
*   `runtime.py`: Runtime data representation (`RuntimeContext`, `RuntimeObject`, `Value`, `Unit`). No evaluation logic.
*   `engine.py`: `Evaluator` class (runs rules), `TraceEvent`, `TraceSink`, optional `explain()` helper.
*   `errors.py`: `ParseError`, `SemanticError`, `RuntimeError`, etc.
*   `cli.py`: `click` group (`validate`, `run`). No rule logic.

## Requirements

- Python 3.7+
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

**A) Install Dependencies:**
Install the required Python libraries listed in `requirements.txt`. Note that `setup.py` currently only lists `antlr4-python3-runtime`; for CLI functionality, you must install all requirements.

```bash
# Install all runtime dependencies
pip install -r requirements.txt

# Then install the regelspraak package itself
pip install .

# For development (allows editing the source without reinstalling):
# pip install -e .
```

**B) Install ANTLR Tool (Development Only):**
If you need to modify the grammar (`.g4` files) and regenerate the parser code, you need the ANTLR 4 tool.

```bash
# Example for Linux/Mac (Adjust path as needed):
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

You can use the `Makefile`:
```bash
make parser
```

Or run the ANTLR commands directly (ensure the `antlr4` alias from Step 2B is set up):
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

You can use the parser either via the command-line interface or by importing it as a library in your code.

### Command-Line Interface


Provides both batch processing commands and an interactive REPL session. Ensure the package and its dependencies are installed (see Installation).

**1. Interactive REPL Session (Default):**
Launch an interactive session for step-by-step development, testing, and inspection of RegelSpraak code and runtime state.

```bash
python -m regelspraak

RegelSpraak REPL v0.1.0
Type ':help' for commands, ':quit' to exit
Use '.' on a newline to end multi-line input
RegelSpraak>
```

This starts the REPL. Key features:
- Enter RegelSpraak definitions directly (end multi-line input with `.` on a new line).
- Use meta-commands:
    - `:help`: Show available commands.
    - `:load <filename.rs>`: Load and merge definitions from a file.
    - `:reset`: Clear the current session state.
    - `:show ctx`: Display the current parameters, types, rules, and instances.
    - `:trace on|off`: Enable/disable execution tracing output.
    - `:quit` or `:q`: Exit the REPL.
- Execute Python code using the `py:` prefix (e.g., `py: context.set_parameter(...)`). Access `context`, `RuntimeObject`, `Value`.
- Evaluate simple expressions using `Evaluate <instance> is <kenmerk>`.
- Command history is saved (requires `prompt_toolkit`).

*Example REPL Session:*

```
RegelSpraak> :load tests/resources/steelthread_example.rs
Loaded and merged model from tests/resources/steelthread_example.rs
RegelSpraak> py: context.set_parameter('volwassenleeftijd', 18, unit='jr')
RegelSpraak> py: p1 = RuntimeObject(object_type_naam='Natuurlijk persoon', instance_id='p1')
RegelSpraak> py: context.add_object(p1)
RegelSpraak> py: context.set_attribute(p1, 'leeftijd', 15)
TRACE: ASSIGNMENT - instance='Natuurlijk persoon[p1]', target='leeftijd', old_value=None, new_value=15
RegelSpraak> py: evaluator.execute_model(domain_model)
TRACE: (Line 7) RULE_FIRED - rule_name='Kenmerktoekenning persoon minderjarig'
TRACE: (Line 9) ASSIGNMENT - instance='Natuurlijk persoon[p1]', target='kenmerk:minderjarig', old_value=False, new_value=True
RegelSpraak> Evaluate p1 is minderjarig
waar
RegelSpraak> :quit
Exiting...
```

**2. Validate Syntax:**
Check if a RegelSpraak file is syntactically correct according to the grammar.

Example:
```bash
python -m regelspraak validate tests/resources/steelthread_example.rs
```

Output on success:
```
Validating steelthread_example.rs...
Parsing successful.
'steelthread_example.rs' validation successful.
```

**3. Run Rules:**
Parse a RegelSpraak file, optionally load initial runtime data from a JSON file, execute the rules, and print the final state.

```bash
python -m regelspraak run path/to/your/file.rs [--data path/to/data.json]
```

*   `--data <path>`: Optional path to a JSON file containing initial parameters and object instances. The expected JSON structure is:
    ```json
    {
      "parameters": {
        "parameter_name": value,
        ...
      },
      "instances": [
        {
          "object_type_naam": "TypeName",
          "instance_id": "optional_unique_id",
          "attributen": {
            "attribute_name": value,
            ...
          },
          "kenmerken": {
            "kenmerk_name": true/false,
             ...
          } // Optional
        },
        ...
      ]
    }
    ```

Example (using the steel thread example):
```bash
python -m regelspraak run tests/resources/steelthread_example.rs --data tests/resources/steelthread_data.json
```

Example Output:
```
Running steelthread_example.rs...
Loading data from steelthread_data.json...
Parsing successful.
Runtime context created.
Loading parameters...
  Loaded parameter 'volwassenleeftijd' = 18
Loading instances...
  Created and added instance: person_15 (Type: Natuurlijk persoon)
TRACE: ASSIGNMENT - instance='Natuurlijk persoon[person_15]', target='leeftijd', old_value=None, new_value=15
    Set attribute 'leeftijd' = 15
  Created and added instance: person_25 (Type: Natuurlijk persoon)
TRACE: ASSIGNMENT - instance='Natuurlijk persoon[person_25]', target='leeftijd', old_value=None, new_value=25
    Set attribute 'leeftijd' = 25
Executing model...
TRACE: (Line 7) RULE_FIRED - rule_name='Kenmerktoekenning persoon minderjarig'
TRACE: (Line 10) ASSIGNMENT - instance='Natuurlijk persoon[person_15]', target='kenmerk:minderjarig', old_value=False, new_value=True

Execution finished.

Final Runtime Context State (raw):
  Parameters: {'volwassenleeftijd': Value(value=18, datatype='Numeriek(geheel getal)', eenheid='jr')}
  Instances: defaultdict(<class 'list'>, {'Natuurlijk persoon': [RuntimeObject(object_type_naam='Natuurlijk persoon', attributen={'leeftijd': Value(value=15, datatype='Numeriek(geheel getal)', eenheid='jr')}, kenmerken={'minderjarig': True}, instance_id='person_15'), RuntimeObject(object_type_naam='Natuurlijk persoon', attributen={'leeftijd': Value(value=25, datatype='Numeriek(geheel getal)', eenheid='jr')}, kenmerken={}, instance_id='person_25')]})
```

If errors occur during parsing, data loading, or execution, the command will print an error message and exit with a non-zero status code.

### Programmatic API

For integration into other Python applications.

```python
# In your other project's code (e.g., my_app.py)
from regelspraak.parsing import parse_text
from regelspraak.ast import DomainModel
from regelspraak.runtime import RuntimeContext, Value, RuntimeObject
from regelspraak.engine import Evaluator, PrintTraceSink
from regelspraak.errors import ParseError, SemanticError, RuntimeError

def process_regelspraak_code(text: str):
    try:
        # Parse the text directly into the IR/AST DomainModel
        model: DomainModel = parse_text(text)
        print("Successfully parsed into IR.")

        # Create a runtime context with a trace sink for debugging
        trace_sink = PrintTraceSink()
        context = RuntimeContext(domain_model=model, trace_sink=trace_sink)
        
        # Add parameter values
        context.add_parameter("volwassenleeftijd", 
                             Value(value=18, datatype="Numeriek(geheel getal)", eenheid="jr"))
        
        # Create object instances
        person_young = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="person_15")
        person_young.attributen["leeftijd"] = Value(value=15, datatype="Numeriek(geheel getal)", eenheid="jr")
        
        person_adult = RuntimeObject(object_type_naam="Natuurlijk persoon", instance_id="person_25")
        person_adult.attributen["leeftijd"] = Value(value=25, datatype="Numeriek(geheel getal)", eenheid="jr")
        
        # Add instances to context
        context.add_object(person_young)
        context.add_object(person_adult)
        
        # Create evaluator and execute rules
        evaluator = Evaluator(context)
        results = evaluator.execute_model(model)
        print(f"Execution complete: {results}")
        
        # Access updated state
        instances = context.find_objects_by_type("Natuurlijk persoon")
        for instance in instances:
            print(f"Instance {instance.instance_id}:")
            for attr_name, attr_value in instance.attributen.items():
                print(f"  - {attr_name}: {attr_value.value}")
            print(f"  - kenmerken: {instance.kenmerken}")
        
        return instances

    except (ParseError, SemanticError, RuntimeError) as e:
        print(f"Failed to process RegelSpraak: {e}")
        return None

# Example usage
regelspraak_code = """
Parameter de volwassenleeftijd : Numeriek (geheel getal) met eenheid jr;

Objecttype de Natuurlijk persoon
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Regel Kenmerktoekenning persoon minderjarig
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.
"""
instances = process_regelspraak_code(regelspraak_code)

# Output will show:
# Successfully parsed into IR.
# Parameters: {'volwassenleeftijd': Value(value=18, datatype='Numeriek(geheel getal)', eenheid='jr')}
# Initial state:
#   person_15 kenmerken: {}
#   person_25 kenmerken: {}
# TRACE: (Line 8) RULE_FIRED - rule_name='Kenmerktoekenning persoon minderjarig'
# TRACE: (Line 10) ASSIGNMENT - instance='Natuurlijk persoon[person_15]', target='kenmerk:minderjarig', old_value=False, new_value=True
# Execution complete: {'Kenmerktoekenning persoon minderjarig': [{'instance_id': 'person_15', 'status': 'evaluated'}, {'instance_id': 'person_25', 'status': 'evaluated'}]}
# Final state:
# Instance person_15:
#   - leeftijd: 15
#   - kenmerken: {'minderjarig': True}
# Instance person_25:
#   - leeftijd: 25
#   - kenmerken: {}
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
    1.  Making AANTAL a standalone token in the lexer (matching just "aantal")
    2.  Using a pattern "HET AANTAL" in the primaryExpression rule for the function
    3.  Explicitly allowing AANTAL tokens in the parameterNamePhrase rule to support parameter names containing "aantal"
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
*   **FeitCreatie Pattern Parsing:** FeitCreatie rules create new relationships by navigating existing ones. The grammar handles complex patterns like "Een passagier van de reis met treinmiles van het vastgestelde contingent treinmiles" by:
    *   Parsing the entire navigation pattern as a single subject phrase in `feitCreatieSubjectPhrase`
    *   Including articles in the captured text to preserve object identity
    *   The builder then splits these patterns on "van" to create navigation chains
    *   The engine navigates these chains through the relationship graph at runtime
*   **Rule Name Extraction:** Rule names can contain prepositions and multi-word phrases (e.g., "passagier met recht op treinmiles"). The grammar prioritizes the `naamwoord` pattern over `IDENTIFIER+` in `regelName` to capture the complete name. The builder's `_extract_canonical_name` uses `get_text_with_spaces` to preserve the full text including prepositions.
*   **Kenmerk Expression Handling:** The "is kenmerk" pattern (e.g., "de koper is actief") initially created a `VariableReference` for the kenmerk name, causing runtime errors when the engine tried to look up "actief" as a variable. The fix was to create a `Literal` expression instead, allowing the IS operator handler to receive the kenmerk name as a string value.
*   **Target Type Deduction for FeitCreatie:** FeitCreatie rules iterate over instances of a specific object type. When deducing this type from phrases like "een product aanbieding", the engine now:
    *   Removes articles first ("een", "de", "het")
    *   Prioritizes matching the last word (most specific) to avoid "product" matching before "aanbieding"
    *   Falls back to trying longer word combinations
    *   This ensures "product aanbieding" correctly matches the "Aanbieding" object type
*   **Timeline Expression Handling:** Timeline expressions enable temporal reasoning in rules. The implementation (July 2025) includes:
    *   Special handling for empty timeline values (return 0 for numeric types per specification)
    *   Timeline-aware rule execution for Gelijkstelling and Initialisatie rules
    *   Support for compound attribute paths in timeline contexts (e.g., "de waarde van X op tijdstip Y")
    *   The `_is_timeline_expression` and `_collect_timeline_operands` methods detect and process timeline patterns
    *   Rules assigning to timeline attributes automatically create TimelineValue results
    *   Note: Timeline period definitions (van/tot, vanaf, tot en met) are still pending implementation
*   **Dimensions (Dimensies) Pattern Detection:** Multi-dimensional attributes allow values to be indexed by dimension labels (e.g., "bruto inkomen", "inkomen van vorig jaar"). The implementation uses sophisticated pattern matching in `visitAttribuutReferentie`:
    *   **Adjectival dimensions:** Detected when an attribute name contains a known dimension label (e.g., "bruto inkomen" → dimension="bruto", attribute="inkomen")
    *   **Prepositional dimensions:** Detected via "van" patterns (e.g., "inkomen van huidig jaar" → dimension="huidig jaar", attribute="inkomen")
    *   **Combined patterns:** Both styles can be combined (e.g., "bruto inkomen van huidig jaar")
    *   The runtime uses `DimensionCoordinate` for multi-dimensional storage, allowing each attribute to hold different values for different dimension combinations
    *   Full semantic validation ensures dimension references are valid
    *   The grammar's consumption of dimension information in the `naamwoord` rule required creative pattern detection heuristics
*   **Subselectie (Filtered Collections):** Subselectie enables filtering object collections using natural language predicates. The implementation supports the DIE/DAT syntax from the specification:
    *   **Object predicates:** Filter objects by kenmerk checks (e.g., "de personen DIE minderjarig zijn")
    *   **Comparison predicates:** Filter by attribute comparisons (e.g., "de producten MET een prijs GROTER DAN 100 euro")
    *   **Navigation expressions:** Support for "X van de Y" patterns to navigate relationships before filtering
    *   The filtered collections integrate seamlessly with aggregation functions (e.g., "het aantal personen DIE minderjarig zijn")
    *   Implementation uses the visitor pattern to build SubselectieExpression AST nodes with appropriate predicates
*   **Recursion (Recursie) Implementation:** Recursive rule groups allow rules to iterate until a termination condition is met. The implementation follows RegelSpraak v2.1.0 §9.9:
    *   Rules marked with "Recursie" execute repeatedly within their designated rule group
    *   Iteration tracking prevents infinite loops with a configurable safety limit (default: 100 iterations)
    *   Object creation rules can include termination conditions to stop recursion
    *   The engine maintains iteration state and checks for changes between iterations
    *   Commonly used for iterative calculations or generating sequences of objects
*   **Advanced Predicates:** The parser now supports specialized validation predicates:
    *   **Elfproef validation:** Implements the Dutch BSN (Burgerservicenummer) checksum algorithm for social security number validation. The predicate "voldoet aan de elfproef" performs modulo-11 checksum verification on 8 or 9 digit numbers
    *   **Dagsoort predicates:** Support for day type checks including "werkdag", "weekend dag", "feestdag", "zaterdag", "zondag", "maandag" through "vrijdag". The implementation uses Python's calendar module and supports custom holiday definitions
    *   **Uniqueness checks:** The "is uniek" predicate validates that a value is unique within a collection or across related objects. Used in consistency rules to enforce data integrity constraints
*   **Compound Predicates (Samengesteld Predicaat):** Compound predicates enable complex logical conditions with quantifiers over collections. The implementation supports all quantifier types from the specification:
    *   **Universal quantifiers:** ALLE ("alle kinderen zijn minderjarig")
    *   **Negative universal:** GEEN VAN DE ("geen van de producten is uitverkocht")
    *   **Bounded quantifiers:** TEN_MINSTE N ("ten minste 3 personen"), TEN_HOOGSTE N ("ten hoogste 5 items"), PRECIES N ("precies 2 aanbiedingen")
    *   **Nested support:** Compound predicates can be nested with proper bullet level tracking, allowing complex hierarchical conditions
    *   The grammar handles the bullet point syntax (•, ••, •••) for multi-level conditions
    *   Full integration with regular predicates and rule execution
    *   Semantic validation ensures quantifiers are used correctly with collections
*   **Code Quality Improvements (July 2025):** Several major refactoring efforts improved code maintainability:
    *   **visitPrimaryExpression refactoring:** The 545-line monolithic method in builder.py was refactored into a clean 42-line dispatcher with 4 focused helper methods, dramatically improving readability and maintainability
    *   **Expression evaluation deduplication:** Extracted common evaluation logic into reusable methods (_evaluate_literal, _evaluate_variable_reference, _evaluate_parameter_reference), eliminating ~130 lines of duplicated code between evaluate_expression and _evaluate_expression_non_timeline
    *   **Function registry standardization:** Eliminated article-based duplication in the function registry, standardized function naming conventions, implemented missing _func_het_aantal, and fixed an aggregation pre-processing bug that affected function execution
    *   **ObjectCreatie ambiguity resolution:** Added the simpleNaamwoord grammar rule to resolve parsing ambiguity in attribute initialization within object creation rules

## Testing

The test suite uses Python's `unittest` framework and resides in the `tests/` directory. Ensure the package is installed (preferably in editable mode: `pip install -e .`) and parser files are generated before running tests.

You can use the `Makefile`:
```bash
make test
```

Or run a selection of the tests manually:

```bash
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
2. Run tests before submitting: `python -m unittest discover -s tests -p 'test_*.py'`
3. Ensure your code passes all existing tests
4. Add new tests for new functionality
