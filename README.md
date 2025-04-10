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

1. Generate the parser:
   ```bash
   cd src/main/antlr4
   antlr4 -Dlanguage=Python3 RegelSpraak.g4
   ```

2. Use the parser in your Python code:
   ```python
   from antlr4 import FileStream, CommonTokenStream
   from RegelSpraakLexer import RegelSpraakLexer
   from RegelSpraakParser import RegelSpraakParser

   input_stream = FileStream("your_regelspraak_file.txt")
   lexer = RegelSpraakLexer(input_stream)
   stream = CommonTokenStream(lexer)
   parser = RegelSpraakParser(stream)
   tree = parser.regelSpraakDocument()
   ```

## License

[License information to be added]

## Contributing

[Contribution guidelines to be added] 