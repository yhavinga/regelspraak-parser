# RegelSpraak Language Server

Language Server Protocol (LSP) implementation for RegelSpraak, providing IDE support for VSCode and other LSP-compatible editors.

## Status

**Implemented & Tested:**
- ✅ **Diagnostics** - Real-time syntax and semantic error checking
- ✅ **Document Symbols** - Outline view of parameters, rules, domains, etc.
- ✅ **Hover** - Shows type information for parameters and rule names

**Next Steps:**
- ❌ **Go to Definition** - Navigate to symbol definitions (reuses hover's node-finding logic)
- ❌ **Completion** - Autocomplete for keywords and symbols
- ❌ **Find References** - Find all usages of a symbol

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
```bash
# Run comprehensive test suite
npm test

# Tests cover:
# - Server initialization with all capabilities
# - Diagnostics for syntax/semantic errors  
# - Document symbols extraction (parameters, rules, etc.)
# - Hover information for parameters
```

### Important Rules

1. **TypeScript only for production code** - Test files should be `.ts`, not `.js`
2. **No subdirectories** - Keep it flat and simple
3. **Bundle everything** - Use esbuild to create self-contained server
4. **Keep VSCode libs external** - Only bundle the parser, not LSP libraries
5. **No overengineering** - Ship the simplest thing that works

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

## How Hover Works

The hover implementation demonstrates the core pattern for position-based features:

1. **Finding the node at cursor position:**
   - Start with the root AST node
   - If node has no location in WeakMap, traverse its children
   - For nodes with locations, check if cursor is within bounds
   - Recursively search children for more specific matches
   - Return the deepest (most specific) node

2. **Node type detection:**
   - Check `node.type` field to identify construct type
   - Extract relevant info (name, dataType, etc.)
   - Format as markdown for display

This same node-finding logic can be reused for:
- **Go to Definition** - Return the node's location
- **Find References** - Search for nodes referencing this symbol
- **Rename** - Find all occurrences to update