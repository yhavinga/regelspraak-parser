# RegelSpraak Language Server

Minimal LSP implementation for RegelSpraak, following Carmack principles - ship the simplest thing that works.

## Status

✅ **Working MVP** - Error squiggles in VSCode

- Initialize handler responds with capabilities
- Document sync (full document)
- Diagnostics provider
- Test server validates basic functionality

## Architecture

```
regelspraak-vscode/
├── server/src/
│   ├── server-test.ts     # Ultra-minimal test server (working)
│   ├── server-minimal.ts  # Parser integration (needs fixes)
│   └── server.ts         # Full server with semantic analysis
├── typescript/           # Copy of parser source
├── lib/                 # Compiled JavaScript
└── test/                # Test scripts
```

## Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
node test/simple-test.js
```

## Current Implementation

The test server (`server-test.ts`) provides:
- Basic LSP initialization
- Document open/change handling
- Simple diagnostic: reports error if text contains "invalid"

## Next Steps

1. Fix the parser integration issues (ES6 class inheritance)
2. Wire up real RegelSpraak parser for actual syntax errors
3. Package as VSCode extension
4. Add more LSP features only when needed

## Test Results

```
✓ Initialize request handled
✓ Diagnostics sent for invalid text
✓ No diagnostics for valid text
```

Total implementation: ~100 lines of TypeScript, as predicted.