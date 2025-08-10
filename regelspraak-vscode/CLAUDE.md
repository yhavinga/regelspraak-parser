# CLAUDE.md - RegelSpraak VSCode Extension

This file provides guidance to Claude Code when developing the RegelSpraak Language Server and VSCode extension.

### Import Core Engineering Principles
@/home/yeb/CLAUDE.md

### Import Gemini CLI Usage Guide
@/home/yeb/regelspraak-parser/CLAUDE_USE_GEMINI.md

## Project Overview

Language Server Protocol (LSP) implementation for RegelSpraak, providing IDE support for VSCode (and potentially other editors).

- **Status**: Diagnostics ✅ Document Symbols ✅ Hover ✅ Autocomplete ✅ Go to Definition ✅ Find References ✅ Code Actions ✅ Snippets ✅ Format Document ✅ Semantic Highlighting ✅
- **Philosophy**: Carmack principles - ship the simplest thing that works
- **Architecture**: TypeScript LSP server wrapping existing parser
- **Reality**: LSP is just JSON-RPC over stdin/stdout. Nothing magical.

## The Truth About LSP

```bash
# This is literally all LSP is:
echo '{"jsonrpc":"2.0","method":"initialize","params":{}}' | node server.js
# Server responds with capabilities
# Then you send documents, get diagnostics back
```

## Architecture (Keep It Simple)

```
regelspraak-vscode/
├── server.ts                # Main LSP server (all logic in one file)
├── build-lsp.js            # esbuild bundler script
├── dist/
│   └── server.js           # Bundled server ready to run
└── test/
    ├── simple-test.js      # Integration tests
    └── *.test.ts           # TypeScript unit tests
```

No subdirectories. No separate handlers. No client needed for testing.

## LSP Protocol Essentials

### Message Format
Every LSP message has this structure:
```
Content-Length: <number>\r\n
\r\n
<JSON-RPC content>
```

### Core Methods You Must Implement

#### 1. initialize
Client says hello, server responds with capabilities:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "capabilities": {
      "textDocumentSync": 1,  // Full document sync
      "diagnosticProvider": { "interFileDependencies": false }
    }
  }
}
```

#### 2. textDocument/didOpen
Client opens a file:
```json
{
  "method": "textDocument/didOpen",
  "params": {
    "textDocument": {
      "uri": "file:///path/to/file.regelspraak",
      "languageId": "regelspraak",
      "version": 1,
      "text": "parameter loon is een bedrag."
    }
  }
}
```

#### 3. textDocument/publishDiagnostics
Server sends errors:
```json
{
  "method": "textDocument/publishDiagnostics",
  "params": {
    "uri": "file:///path/to/file.regelspraak",
    "diagnostics": [{
      "range": {
        "start": { "line": 0, "character": 10 },
        "end": { "line": 0, "character": 14 }
      },
      "severity": 1,  // Error
      "message": "Unknown parameter 'loon'"
    }]
  }
}
```

### What You Already Have

From the TypeScript parser:
- `AntlrParser` with `parseModel()` and `parseWithLocations()` methods
- `SemanticAnalyzer` with `analyze()` returning `ValidationError[]`
- Error locations with line:column
- Complete AST generation
- LocationMap (WeakMap) for source positions

The server is implemented and working with diagnostics and document symbols.

## Current Implementation

The server (`server.ts`) implements:
- ✅ Diagnostics (syntax/semantic errors)
- ✅ Document Symbols (outline view)
- ✅ Hover (type information on mouse over)
- ✅ Autocomplete (context-aware suggestions)
- ✅ Go to Definition (jump to declarations)
- ✅ Find All References (find all uses)
- ✅ Code Actions (quick fixes for common errors)
- ✅ Snippets (code templates with tab stops)

### Testing Without VSCode

```bash
# test/test.sh
#!/bin/bash

# Test 1: Initialize
echo "=== Testing Initialize ==="
cat <<EOF | node ../server/lib/server.js
Content-Length: 85\r\n\r\n{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"rootUri":null,"capabilities":{}}}
EOF

# Test 2: Send document with error
echo "=== Testing Diagnostics ==="
cat <<EOF | node ../server/lib/server.js
Content-Length: 200\r\n\r\n{"jsonrpc":"2.0","method":"textDocument/didOpen","params":{"textDocument":{"uri":"file:///test.rs","languageId":"regelspraak","version":1,"text":"invalid syntax here"}}}
EOF
```

### Phase 3: Add Features (When Needed)

**Document Symbols** (list all parameters/rules):
```typescript
connection.onDocumentSymbol(params => {
  // Return array of SymbolInformation
});
```

**Hover** (show type on hover):
```typescript
connection.onHover(params => {
  // Return hover info at position
});
```

**Completion** (autocomplete):
```typescript
connection.onCompletion(params => {
  // Return completion items
});
```

## Testing Strategy

### Without GUI
1. Direct stdin/stdout testing with bash scripts
2. Use `lsp-cli` for automated testing
3. Test individual messages and responses

### Test Harness
```javascript
// test/send-message.js
const message = process.argv[2];
const content = JSON.stringify(JSON.parse(message));
const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
process.stdout.write(header + content);

// Usage: node send-message.js '{"method":"initialize"}' | node server.js
```

## Common Issues and Root Causes

### Issue: "No response from server"
**Root cause**: Not sending Content-Length header
**Fix**: Always prepend `Content-Length: <bytes>\r\n\r\n`

### Issue: "Invalid JSON"
**Root cause**: Server stdout has debug logs mixed with JSON-RPC
**Fix**: Only write JSON-RPC to stdout, use stderr for logs

### Issue: "Error location off by one"
**Root cause**: LSP uses 0-based lines, ANTLR uses 1-based
**Fix**: `line: antlrLine - 1`

## When to Use Gemini

Use Gemini CLI when:
- Analyzing the entire TypeScript parser codebase
- Understanding complex visitor patterns
- Checking if a feature is already implemented

```bash
export GEMINI_API_KEY="AIzaSyCqhpkgfHSXjNdJRGDCy5F6dTrn4y-DWhk"
gemini -p "@../typescript/src/ How does the expression evaluator handle navigation expressions?"
```

## Core Development Principles

- **No workarounds** - Fix root causes, not symptoms
- **No shortcuts** - Do it right the first time
- **No overengineering** - Ship the simplest thing that works
- **TypeScript only** - Never write .js files, always .ts
- **No git add -A** - Always list files explicitly when committing
- **Test everything** - Write tests for new features
- **Find root causes** - When something breaks, understand why

## What NOT to Do

- **Don't** implement every LSP feature upfront
- **Don't** write a complex test framework  
- **Don't** worry about performance until it's a problem
- **Don't** add configuration until users ask
- **Don't** refactor the parser - just wrap it
- **Never** add features because they're "nice to have"
- **Never** write test files in JavaScript - use TypeScript

## Development Path

1. ✅ Diagnostics - DONE
2. ✅ Document Symbols - DONE  
3. ✅ Hover - DONE
4. ✅ Autocomplete - DONE (Session 10)
5. ✅ Go to Definition - DONE (Session 11-13)
   - Handler implemented for VariableReference nodes
   - Fixed: Parser now creates VariableReference (not ParameterReference) for identifiers
   - Fixed: Added location tracking to ALL VariableReference creation sites (not just visitIdentifierExpr)
   - Works for parameter references in expressions
6. ✅ Find All References - DONE (Session 12-13)
   - Handler implemented with full AST traversal
   - Fixed: VariableReference nodes now have location data via WeakMap
   - Finds all references (definitions and uses)
   - Test suite confirms 3/3 references found
7. ✅ Code Actions - DONE
   - Quick fix for capitalization errors (parameter → Parameter)
   - Quick fix for colon syntax (is een → :)
   - Quick fix for missing semicolons
   - Quick fix for assignment syntax (= → wordt)
   - Quick fix for missing "geldig altijd" in rules
   - Quick fix to create missing parameters
8. ✅ Snippets - DONE
   - Parameter, Regel, Objecttype, Domein, Beslistabel snippets
   - Tab stops and choice placeholders
   - Triggered by typing prefixes (param, regel, object, etc.)
9. ✅ Semantic Highlighting - DONE
   - Keywords, types, numbers, strings, operators highlighted
   - Regex-based implementation for reliability
   - Full AST-based approach ready when location tracking improves
10. ✅ Format Document - PARTIALLY DONE
   - Aligns parameter colons
   - Formats parameters, domains, object types
   - Rules formatting not implemented (shows placeholder text)
11. ⏳ Next priority: Better error messages

## Success Criteria

The server successfully provides:
1. ✅ Red squiggles on errors
2. ✅ Error messages with correct locations
3. ✅ Document outline/symbols
4. ✅ Hover information on symbols
5. ✅ Context-aware autocomplete with type filtering
6. ✅ Works without VSCode (testable via stdin/stdout)
7. ✅ Go to Definition for parameters/domains/types
8. ✅ Find All References (complete implementation)

MVP achieved. Ship it.

## Quick Start Commands

```bash
# Build
npm install
npm run build
# Or: make build

# Test (use Makefile to avoid issues with Jest arguments)
make test           # Run all tests
make test-coverage  # Run with coverage
make test-watch     # Run in watch mode

# Run specific test file
make test-file FILE=test/lsp-integration.test.ts

# Run specific test suite  
make test-suite SUITE="Diagnostics"

# Debug helpers for quick testing
make test-references   # Test Find References
make test-code-action  # Test Code Actions
make test-symbols      # Test Document Symbols

# Direct LSP testing
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' | node dist/server.js
```

### Important: Running Tests

Always use the Makefile targets (`make test`) instead of `npm test` directly. The parent directory also has a Makefile with a test target that runs Python tests, which can cause confusion. The Makefile ensures tests run in the correct directory context.

## The Bottom Line

LSP server provides essential IDE features in 1554 lines of TypeScript:
- Real-time error checking
- Document symbols/outline  
- Hover information
- Context-aware autocomplete with type filtering
- Go to Definition for parameters, domains, and types
- Find All References with complete location tracking
- Code Actions with 6 different quick fixes
- Snippets for common RegelSpraak patterns
- Format Document for code consistency
- Semantic highlighting for keywords, types, and literals
- Comprehensive test suite

All core features working. Ready for production use.