import * as path from 'path';
import { spawn } from 'child_process';

// Simple direct test without complex message handling
const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
const server = spawn('node', [serverPath, '--stdio'], {
  stdio: ['pipe', 'pipe', 'pipe']
});

let buffer = '';
server.stdout.on('data', (data: Buffer) => {
  buffer += data.toString();
  
  // Try to parse messages
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
      console.log('Response:', JSON.stringify(json, null, 2));
    } catch (e) {
      console.error('Parse error:', e);
    }
  }
});

server.stderr.on('data', (data: Buffer) => {
  console.error('Server stderr:', data.toString());
});

// Send initialize
const init = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: { rootUri: null, capabilities: {} }
};

function send(msg: any) {
  const content = JSON.stringify(msg);
  const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
  server.stdin.write(header + content);
}

send(init);

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
        text: 'Parameter loon: Bedrag;'
      }
    }
  });
  
  setTimeout(() => {
    // Request semantic tokens
    send({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/semanticTokens/full',
      params: {
        textDocument: { uri: 'file:///test.rs' }
      }
    });
    
    setTimeout(() => {
      console.log('Done');
      server.kill();
      process.exit(0);
    }, 1000);
  }, 500);
}, 500);