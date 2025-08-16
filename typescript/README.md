# RegelSpraak Parser - TypeScript Implementation

TypeScript implementation of the RegelSpraak v2.1.0 parser and execution engine.

## Overview

This is the TypeScript implementation of RegelSpraak, a Dutch DSL for business rules. It provides:
- Full ANTLR4-based parser for RegelSpraak syntax
- AST generation and semantic analysis
- Runtime execution engine
- Timeline support for temporal business rules
- VSCode Language Server Protocol support

## Installation

```bash
# Install dependencies
make install
# or
npm install
```

## Building

```bash
# Build the project
make build
# or
npm run build

# Development build (without size checks)
make dev-build
# or
npx tsc
```

## Testing

```bash
# Run all tests
make test
# or
npm test

# Run specific test file
make test-file FILE=tests/timeline/timeline-basic.test.ts
# or
npm test -- tests/timeline/timeline-basic.test.ts

# Run tests in watch mode
make test-watch
# or
npm run test:watch
```

## Development

### Project Structure

```
typescript/
├── src/
│   ├── ast/              # Abstract Syntax Tree definitions
│   ├── evaluators/       # Expression and rule evaluators
│   ├── executors/        # Rule execution engine
│   ├── parsers/          # ANTLR parser and utilities
│   ├── runtime/          # Runtime context and object management
│   ├── utils/            # Utility functions (timeline, etc.)
│   ├── visitors/         # AST visitor implementations
│   └── generated/        # Generated ANTLR files
├── tests/                # Test files
│   └── timeline/         # Timeline-specific tests
├── scripts/              # Build and utility scripts
└── dist/                 # Compiled JavaScript output
```

### Quality Checks

```bash
# Run linter
make lint
# or
npm run lint

# Run type checking
make typecheck
# or
npm run typecheck

# Run all quality checks (lint + typecheck + test)
make quality

# Check module sizes
make check-size
# or
npm run check-size
```

### Clean and Rebuild

```bash
# Clean build artifacts
make clean
# or
npm run clean

# Full rebuild (clean + install + build)
make rebuild
```

## Features

### Core Language Support
- ✅ Parameters (all types: Bedrag, Tekst, Numeriek, Datum, Boolean)
- ✅ Domains (value domains with enumerated values)
- ✅ Object Types (Feittype) with attributes and relationships
- ✅ All major rule types (Gelijkstelling, Initialisatie, Kenmerktoekenning, etc.)
- ✅ Complex expressions and operations
- ✅ Unit system with conversions
- ✅ Decision tables (Beslistabel)
- ✅ Dimensions (Dimensies)
- ✅ Filtered collections (Subselectie)

### Timeline Support (100% Complete)
- ✅ Timeline data structures (Timeline, Period, TimelineValue)
- ✅ Timeline expression evaluation with knips (change points)
- ✅ Temporal conditions ("gedurende de tijd dat")
- ✅ Conditional day counting ("aantal dagen in ... dat")
- ✅ Timeline aggregation functions
- ✅ Tijdsevenredig deel (time-proportional calculations)
- ✅ Calendar-aware calculations with leap year support

### Advanced Features
- ✅ Compound predicates with all quantifiers
- ✅ Distribution rules (Verdeling)
- ✅ Aggregation functions (som van, aantal, maximum, minimum, etc.)
- ✅ Date arithmetic
- ✅ String operations

## Usage Example

```typescript
import { AntlrParser } from './src/parsers/antlr-parser';
import { Context } from './src/runtime/context';
import { RuleExecutor } from './src/executors/rule-executor';

// Parse RegelSpraak code
const parser = new AntlrParser();
const ast = parser.parse(`
  Objecttype de Persoon
    het salaris Bedrag voor elke maand;
    de naam Tekst;
  
  Regel SalarisBerekening
    geldig altijd
    Het salaris van een persoon moet gesteld worden op 5000 euro.
`);

// Create runtime context
const context = new Context();

// Create a person object
context.createObject('Persoon', 'p1', {
  naam: { type: 'string', value: 'Jan' }
});

// Execute rules
const executor = new RuleExecutor();
for (const rule of ast.rules) {
  executor.execute(rule, context);
}
```

## API Documentation

### Parser
- `AntlrParser.parse(code: string)` - Parse RegelSpraak code into AST

### Runtime Context
- `Context` - Runtime execution context
- `Context.createObject()` - Create runtime objects
- `Context.setTimelineAttribute()` - Set timeline attributes
- `Context.getTimelineAttribute()` - Get timeline value at date

### Evaluators
- `ExpressionEvaluator` - Evaluate expressions
- `TimelineEvaluator` - Evaluate timeline expressions
- `RuleExecutor` - Execute rules

### Timeline Utilities
- Date alignment functions
- Knips (change points) handling
- Proportional value calculations

## Contributing

1. Follow existing code patterns
2. Add tests for new features
3. Run quality checks before committing
4. Update documentation as needed

## License

See LICENSE file in the root directory.

## Related

- [Python Implementation](../README.md) - Python version with 100% feature parity
- [VSCode Extension](../vscode-extension/) - Language server and IDE support
- [Specification](../specification/) - RegelSpraak v2.1.0 specification