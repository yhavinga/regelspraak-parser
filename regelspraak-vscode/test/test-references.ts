import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
const server = spawn('node', [serverPath, '--stdio']);

let msgId = 1;
let responseBuffer = '';

function sendMessage(msg: any): void {
  const content = JSON.stringify(msg);
  const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
  server.stdin!.write(header + content);
}

server.stderr!.on('data', (data) => {
  console.log('DEBUG:', data.toString().trim());
});

server.stdout!.on('data', (data) => {
  responseBuffer += data.toString();
  
  // Parse complete messages
  while (true) {
    const headerEnd = responseBuffer.indexOf('\r\n\r\n');
    if (headerEnd === -1) break;
    
    const header = responseBuffer.substring(0, headerEnd);
    const match = header.match(/Content-Length: (\d+)/);
    if (!match) {
      responseBuffer = responseBuffer.substring(headerEnd + 4);
      continue;
    }
    
    const contentLength = parseInt(match[1]);
    const contentStart = headerEnd + 4;
    
    if (responseBuffer.length < contentStart + contentLength) break;
    
    const content = responseBuffer.substring(contentStart, contentStart + contentLength);
    responseBuffer = responseBuffer.substring(contentStart + contentLength);
    
    try {
      const response = JSON.parse(content);
      
      // Log all messages for debugging
      if (response.method === 'window/logMessage') {
        console.log('Server log:', response.params.message);
      }
      
      if (response.id === 2) {
        // This is our references response
        console.log('Full response:', JSON.stringify(response, null, 2));
        console.log('References response:', JSON.stringify(response.result, null, 2));
        
        if (Array.isArray(response.result)) {
          console.log(`Found ${response.result.length} references`);
          response.result.forEach((loc: any, i: number) => {
            console.log(`  ${i + 1}. Line ${loc.range.start.line}, char ${loc.range.start.character}`);
          });
          
          if (response.result.length === 3) {
            console.log('✅ Test passed!');
          } else {
            console.log('❌ Expected 3 references');
          }
        } else {
          console.log('❌ Response is not an array');
        }
        
        server.kill();
        process.exit(response.result.length === 3 ? 0 : 1);
      }
    } catch (e) {
      // Not complete JSON yet
    }
  }
});

// Initialize
sendMessage({
  jsonrpc: '2.0',
  id: msgId++,
  method: 'initialize',
  params: {
    processId: process.pid,
    rootUri: null,
    capabilities: {}
  }
});

// Send document
setTimeout(() => {
  const text = `Parameter loon: Bedrag;
Parameter bonus: Bedrag;
Regel BerekenTotaal
  geldig altijd
    Het totaal van de persoon moet gesteld worden op loon.
Regel ControleerLoon
  geldig altijd
    Het minimum van de persoon moet gesteld worden op loon.`;
  
  console.log('Sending document with "loon" on lines 0, 4, 7');
  
  sendMessage({
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///test.rs',
        languageId: 'regelspraak',
        version: 1,
        text
      }
    }
  });
  
  // Request references for 'loon' at its definition
  setTimeout(() => {
    console.log('Requesting references for "loon" at line 0, char 10');
    sendMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/references',
      params: {
        textDocument: { uri: 'file:///test.rs' },
        position: { line: 0, character: 10 },  // On "loon" in "Parameter loon: Bedrag;"
        context: { includeDeclaration: true }
      }
    });
  }, 100);
}, 100);

// Timeout
setTimeout(() => {
  console.log('❌ Test timed out');
  server.kill();
  process.exit(1);
}, 3000);