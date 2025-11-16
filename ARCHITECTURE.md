# RegelSpraak Parser Architecture

## Overview

The RegelSpraak Parser is an ANTLR4-based implementation of the RegelSpraak v2.1.0 specification - a Dutch domain-specific language for business rules. The system provides both Python and TypeScript implementations sharing a common ANTLR grammar.

## Architecture Pipeline

```
Source Code (.rs)
    ↓
ANTLR Lexer/Parser
    ↓
Builder (Visitor Pattern)
    ↓
AST (Immutable Dataclasses)
    ↓
Semantic Analysis
    ↓
Runtime Context
    ↓
Execution Engine
```

## Module Responsibilities

### Core Modules

#### `parsing.py`
- Simple facade module
- Delegates to builder for actual parsing
- Entry point for external callers

#### `builder.py`
- ANTLR visitor implementation
- Transforms parse tree to AST nodes
- Handles grammar-to-AST transformation
- Uses parameter_names tracking (required for semantic analyzer)
- Contains complex name extraction logic due to grammar variations

#### `ast.py`
- Immutable frozen dataclasses for all AST nodes
- SourceSpan tracking for error reporting
- Type definitions for the entire syntax tree
- No business logic - pure data structures

#### `semantics.py`
- Semantic analysis and validation
- Symbol table management
- Type checking and reference resolution
- Domain model construction
- Validates rule consistency and references

#### `runtime.py`
- Runtime data structures (no execution logic)
- Instance management
- Context and state containers
- TraceSink for execution monitoring
- Registry for objects, parameters, and variables

#### `engine.py`
- Core execution logic
- Expression evaluation
- Rule application and firing
- Timeline evaluation
- Aggregation functions
- Predicate evaluation
- Distribution rule execution

### Supporting Modules

#### `units.py`
- BaseUnit and CompositeUnit classes
- UnitSystem definitions
- UnitRegistry with hub-and-spoke conversion
- Support for time, currency, distance units

#### `arithmetic.py`
- Unit-aware arithmetic operations
- Decimal precision preservation
- Type coercion rules
- Mathematical function implementations

#### `timeline_utils.py`
- Timeline period handling
- Date range operations
- Calendar-based calculations
- Period expansion for aggregation

#### `beslistabel_parser.py`
- Decision table parsing
- Table structure validation
- Cell value extraction
- Integration with main parser

#### `decimal_utils.py`
- Decimal precision handling
- Rounding and formatting
- Number parsing utilities

#### `errors.py`
- Custom exception types
- Error message formatting

#### `cli.py` & `repl.py`
- Command-line interface
- Interactive REPL session
- Model loading and execution

## Dual Implementation Structure

### Python Implementation
- Full implementation at 99%+ specification compliance
- 568+ tests across 94 test modules
- Production-ready status as of v1.0.0

### TypeScript Implementation
- Parallel implementation sharing ANTLR grammar
- Modular architecture with specialized evaluators
- Located in `typescript/src/`:
  - `ast/` - AST type definitions
  - `engine/` - Execution engine
  - `evaluators/` - Expression evaluators
  - `executors/` - Rule executors
  - `predicates/` - Predicate implementations
  - `runtime/` - Runtime context
  - `units/` - Unit system
  - `visitors/` - ANTLR visitors

## Key Architectural Patterns

### Immutable AST
- All AST nodes are frozen dataclasses
- No mutation after construction
- Enables safe sharing and caching

### Visitor Pattern
- Builder implements ANTLR visitor
- Separates parsing from AST construction
- Allows multiple traversal strategies

### Execution Tracing
- TraceSink pattern for monitoring execution
- Essential for debugging and explainability
- Non-invasive - doesn't affect core logic

### Article-Insensitive Resolution
- Consistent name resolution across the system
- `_resolve_attribute_name` in engine.py
- `_resolve_kenmerk_name` in runtime.py
- Handles de/het/een articles uniformly

### Pre-indexed Optimizations
- DagsoortDefinitionRuntime with pre-indexed rules
- O(1) lookup for dagsoort checks
- Rules grouped by type at initialization

## Technical Constraints

### Build System
- **No linting tools configured** - manual style consistency required
- **ANTLR JAR**: Located at `lib/antlr-4.13.1-complete.jar`
- **Makefile targets**:
  - `make parser` - Generate Python parser
  - `make parser-java` - Generate Java parser for debugging
  - `make test` - Run test suite

### Runtime Requirements
- **Python 3.7+** minimum version
- **No external dependencies** beyond ANTLR runtime
- **Generated files** in `src/regelspraak/_antlr/` may not be in git

### Grammar Considerations
- Multi-word keywords as single tokens (e.g., `IS_VAN_HET_TYPE`)
- Whitespace channeled to HIDDEN
- Tab characters in specification are conversion artifacts, not syntax

## Technical Debt

### Medium Priority Issues

#### IS/IN Logic Distribution
- Currently split between RuntimeContext and Evaluator
- Should be centralized in one location

#### Parameter Tracking Workaround
- Builder uses parameter_names tracking hack
- Required due to semantic analyzer expectations
- Indicates need for AST node distinction

### Low Priority Issues

#### Test Organization
- 94 test modules in flat structure
- Could benefit from categorization
- Some tests only verify parsing, not execution

## Implementation Notes

### Grammar Coverage
- 99%+ specification compliance achieved
- All major features fully implemented
- Minor gaps only in edge cases

### Performance Characteristics
- Interpreted execution model
- No compilation or optimization currently
- Suitable for rule sets up to moderate complexity
- Timeline operations can be memory-intensive

### Extension Points
- TraceSink for custom monitoring
- UnitRegistry for custom units
- Pluggable validation in semantic analyzer
- Custom functions via engine registry