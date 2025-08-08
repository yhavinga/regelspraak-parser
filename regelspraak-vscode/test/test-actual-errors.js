const { spawn } = require('child_process');
const path = require('path');

// Test with actual parser errors
async function testActualErrors() {
  const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
  const child = spawn('node', [serverPath, '--stdio'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let buffer = '';
  let diagnostics = null;
  
  child.stdout.on('data', (data) => {
    buffer += data.toString();
    
    // Parse messages
    while (true) {
      const headerEnd = buffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) break;
      
      const header = buffer.substring(0, headerEnd);
      const contentLengthMatch = header.match(/Content-Length: (\d+)/);
      if (!contentLengthMatch) break;
      
      const contentLength = parseInt(contentLengthMatch[1]);
      const messageStart = headerEnd + 4;
      const messageEnd = messageStart + contentLength;
      
      if (buffer.length < messageEnd) break;
      
      const message = buffer.substring(messageStart, messageEnd);
      buffer = buffer.substring(messageEnd);
      
      try {
        const msg = JSON.parse(message);
        if (msg.method === 'textDocument/publishDiagnostics') {
          diagnostics = msg.params.diagnostics;
          console.log('Got diagnostics:', JSON.stringify(diagnostics, null, 2));
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  });
  
  // Initialize
  const initRequest = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { rootUri: null, capabilities: {} }
  });
  child.stdin.write(`Content-Length: ${Buffer.byteLength(initRequest)}\r\n\r\n${initRequest}`);
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Send document with errors
  const textWithErrors = `parameter salaris is een bedrag

Regel bereken_bonus
  Het bonus wordt salaris * 0.1;`;
  
  const openRequest = JSON.stringify({
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///test.rs',
        languageId: 'regelspraak',
        version: 1,
        text: textWithErrors
      }
    }
  });
  child.stdin.write(`Content-Length: ${Buffer.byteLength(openRequest)}\r\n\r\n${openRequest}`);
  
  // Wait for diagnostics
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (diagnostics && diagnostics.length > 0) {
    console.log('\nActual error messages from parser:');
    for (const diag of diagnostics) {
      console.log(`- Line ${diag.range.start.line}: "${diag.message}"`);
    }
    
    // Now test code actions with actual diagnostics
    const codeActionRequest = JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/codeAction',
      params: {
        textDocument: { uri: 'file:///test.rs' },
        range: diagnostics[0].range,
        context: { diagnostics: [diagnostics[0]] }
      }
    });
    
    child.stdin.write(`Content-Length: ${Buffer.byteLength(codeActionRequest)}\r\n\r\n${codeActionRequest}`);
    
    // Wait for response
    await new Promise(resolve => setTimeout(resolve, 500));
  } else {
    console.log('No diagnostics received');
  }
  
  child.kill();
}

testActualErrors().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});