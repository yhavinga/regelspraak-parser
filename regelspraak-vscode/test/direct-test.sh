#!/bin/bash

echo "=== Direct LSP Test ==="
echo ""
echo "Testing initialize and didOpen messages..."

# Create a temporary file with both messages
cat > test-messages.txt << 'EOF'
Content-Length: 85

{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"rootUri":null,"capabilities":{}}}
Content-Length: 216

{"jsonrpc":"2.0","method":"textDocument/didOpen","params":{"textDocument":{"uri":"file:///test.regelspraak","languageId":"regelspraak","version":1,"text":"invalid syntax here"}}}
EOF

# Run the server with stdio and feed it the messages
echo "Running server with test messages..."
cat test-messages.txt | node ../lib/server/src/server-minimal.js --stdio 2>&1 | grep -A5 -B5 -E "(initialize|diagnostics|severity)" | head -30

# Clean up
rm test-messages.txt