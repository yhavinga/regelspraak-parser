#!/bin/bash

# Simple LSP test script - Carmack style
# Tests the server by sending raw LSP messages via stdin

echo "=== Building the server first ==="
cd .. && npm run build
cd test

echo ""
echo "=== Test 1: Initialize ==="
echo "Sending initialize request..."
printf 'Content-Length: 85\r\n\r\n{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"rootUri":null,"capabilities":{}}}' | node ../lib/server/src/server.js 2>/dev/null | head -n 10

echo ""
echo "=== Test 2: Valid RegelSpraak code ==="
echo "Sending valid document..."
printf 'Content-Length: 233\r\n\r\n{"jsonrpc":"2.0","method":"textDocument/didOpen","params":{"textDocument":{"uri":"file:///test.regelspraak","languageId":"regelspraak","version":1,"text":"parameter loon is een bedrag."}}}' | node ../lib/server/src/server.js 2>&1 | grep -E "(diagnostics|error)" || echo "✓ No errors (good!)"

echo ""
echo "=== Test 3: Invalid RegelSpraak code ==="
echo "Sending invalid document..."
printf 'Content-Length: 235\r\n\r\n{"jsonrpc":"2.0","method":"textDocument/didOpen","params":{"textDocument":{"uri":"file:///test.regelspraak","languageId":"regelspraak","version":1,"text":"invalid syntax here"}}}' | node ../lib/server/src/server.js 2>&1 | grep -E "(diagnostics|severity)" && echo "✓ Error detected (good!)" || echo "✗ No error found"