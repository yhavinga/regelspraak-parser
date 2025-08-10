# RegelSpraak Language Server

Language Server Protocol (LSP) implementation for RegelSpraak, providing IDE support for VSCode and other LSP-compatible editors.

## Features

All core IDE features implemented in 1554 lines of TypeScript:

- ✅ **Diagnostics** - Real-time syntax and semantic error checking
- ✅ **Document Symbols** - Outline view of parameters, rules, domains, etc.
- ✅ **Hover** - Type information for parameters and rule names
- ✅ **Autocomplete** - Context-aware suggestions with type filtering
- ✅ **Go to Definition** - Navigate to symbol definitions
- ✅ **Find References** - Find all usages of a symbol
- ✅ **Code Actions** - Quick fixes for common errors (6 different fixes)
- ✅ **Snippets** - Code templates for common patterns
- ✅ **Format Document** - Aligns parameter colons, formats domains and object types (rules not yet formatted)
- ✅ **Semantic Highlighting** - Syntax coloring for keywords, types, literals

## Architecture

The LSP server is a thin wrapper around the TypeScript parser:
- `server.ts` - Single file containing all LSP protocol handling
- `build-lsp.js` - esbuild script that bundles the parser with the server
- Result: Self-contained `dist/server.js` with all dependencies

Key insight: LSP is just JSON-RPC over stdin/stdout. No magic.

## Development

### Build
```bash
npm install
npm run build
```

### Test

The test suite uses Jest for unit and integration testing.

```bash
# Run comprehensive test suite
npm test
# Or using Makefile:
make test

# Run tests with coverage
npm run test:coverage
# Or: make test-coverage

# Run tests in watch mode (for development)
npm run test:watch
# Or: make test-watch

# Run specific test file
npm test -- test/lsp-integration.test.ts
# Or: make test-file FILE=test/lsp-integration.test.ts

# Run specific test suite
npm test -- -t "Diagnostics"
# Or: make test-suite SUITE="Diagnostics"

# Debug helpers (JavaScript files for quick testing)
make test-references    # Test Find References
make test-code-action   # Test Code Actions  
make test-symbols       # Test Document Symbols

# Direct LSP testing without VSCode
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | node dist/server.js
```

#### Common Test Issues

If you see `No tests found` when running `npm test`, this is often because Jest is receiving unexpected arguments. Use the Makefile targets or ensure you're not passing extra arguments to npm test.


## How It Works

1. VSCode launches `dist/server.js` as a subprocess
2. Communication happens via JSON-RPC messages over stdin/stdout
3. Server parses RegelSpraak files using the TypeScript parser
4. Errors and symbols are sent back to VSCode as LSP messages

## Implementation Details

### Location Tracking
The parser provides a `parseWithLocations()` method that returns:
- `model` - The AST without location pollution
- `locationMap` - A WeakMap from AST nodes to source positions

This separation keeps the AST pure while providing location data for IDE features.

### Symbol Mapping
RegelSpraak constructs map to LSP SymbolKind:
- Parameter → Variable
- Regel → Function  
- Regelgroep → Namespace
- Objecttype → Class
- Domein → Enum
- Beslistabel → Struct
- And more...

## Position-Based Features

All position-based features (hover, go-to-definition, find references) use the same pattern:

1. **Find the node at cursor position** using the locationMap
2. **Identify the node type** (Parameter, Rule, Domain, etc.)
3. **Return appropriate response** (hover text, definition location, reference list)