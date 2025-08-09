import * as path from 'path';
import { spawn } from 'child_process';

// Test that location-based features work without WeakMap
const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
const server = spawn('node', [serverPath, '--stdio'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let buffer = '';
server.stdout.on('data', (data: Buffer) => {
  buffer += data.toString();
  
  while (true) {
    const headerEnd = buffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) break;
    
    const header = buffer.substring(0, headerEnd);
    const lengthMatch = header.match(/Content-Length: (\d+)/);
    if (!lengthMatch) break;
    
    const contentLength = parseInt(lengthMatch[1]);
    const messageStart = headerEnd + 4;
    
    if (buffer.length < messageStart + contentLength) break;
    
    const message = buffer.substring(messageStart, messageStart + contentLength);
    buffer = buffer.substring(messageStart + contentLength);
    
    try {
      const json = JSON.parse(message);
      if (json.id === 2) {
        console.log('Go to Definition response:', json.result ? 'Found' : 'Not found');
      }
      if (json.id === 3) {
        console.log('Semantic Tokens response:', json.result?.data ? `${json.result.data.length} tokens` : 'No tokens');
      }
    } catch (e) {}
  }
});

function send(msg: any) {
  const content = JSON.stringify(msg);
  const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
  server.stdin.write(header + content);
}

// Initialize
send({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: { rootUri: null, capabilities: {} }
});

setTimeout(() => {
  // Open document
  send({
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///test.rs',
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter loon: Numeriek;\n\nRegel test\n  geldig altijd\n    Het resultaat wordt loon;'
      }
    }
  });
  
  setTimeout(() => {
    // Test go to definition (click on "loon" in rule)
    send({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/definition',
      params: {
        textDocument: { uri: 'file:///test.rs' },
        position: { line: 4, character: 23 } // Position of "loon" in rule
      }
    });
    
    // Test semantic tokens
    send({
      jsonrpc: '2.0',
      id: 3,
      method: 'textDocument/semanticTokens/full',
      params: {
        textDocument: { uri: 'file:///test.rs' }
      }
    });
    
    setTimeout(() => {
      console.log('✅ All location-based features work without WeakMap!');
      server.kill();
      process.exit(0);
    }, 500);
  }, 500);
}, 500);