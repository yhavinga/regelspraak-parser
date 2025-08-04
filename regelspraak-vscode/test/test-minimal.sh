#!/bin/bash

echo "=== Test 1: Initialize ==="
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"rootUri":null,"capabilities":{}}}' | node send-message.js | node ../lib/server/src/server-minimal.js 2>&1 | head -20

echo ""
echo "=== Test 2: Valid RegelSpraak code ==="
echo '{"jsonrpc":"2.0","method":"textDocument/didOpen","params":{"textDocument":{"uri":"file:///test.regelspraak","languageId":"regelspraak","version":1,"text":"parameter loon is een bedrag."}}}' | node send-message.js | node ../lib/server/src/server-minimal.js 2>&1 | grep -E "(diagnostics|Content-Length)" || echo "No output (checking stderr)"

echo ""
echo "=== Test 3: Invalid RegelSpraak code ==="
echo '{"jsonrpc":"2.0","method":"textDocument/didOpen","params":{"textDocument":{"uri":"file:///test.regelspraak","languageId":"regelspraak","version":1,"text":"invalid syntax here"}}}' | node send-message.js | node ../lib/server/src/server-minimal.js 2>&1 | grep -E "(diagnostics|severity|Content-Length)" || echo "No diagnostics found"