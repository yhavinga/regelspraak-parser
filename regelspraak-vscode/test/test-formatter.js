const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, '../dist/server.js');
const server = spawn('node', [serverPath, '--stdio']);

let buffer = '';
let messageId = 1;

function send(msg) {
  const content = JSON.stringify(msg);
  const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
  server.stdin.write(header + content);
}

server.stdout.on('data', (data) => {
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
      console.log('Received:', json.method || `response id=${json.id}`);
      if (json.method === 'window/logMessage') {
        console.log('  Server log:', json.params.message);
      }
      
      if (json.id === 1) {
        console.log('✅ Server initialized');
        console.log('  Formatter capability:', json.result.capabilities.documentFormattingProvider);
        
        // Send unformatted document with messy spacing
        const messyCode = `Parameter   salaris :Bedrag;
  Parameter bonus:   Bedrag  ;
Parameter   leeftijd:Numeriek (geheel getal);`;
        
        send({
          jsonrpc: '2.0',
          method: 'textDocument/didOpen',
          params: {
            textDocument: {
              uri: 'file:///test-format.rs',
              languageId: 'regelspraak',
              version: 1,
              text: messyCode
            }
          }
        });
        
        // Request formatting
        setTimeout(() => {
          console.log('\n=== Requesting format ===');
          send({
            jsonrpc: '2.0',
            id: 2,
            method: 'textDocument/formatting',
            params: {
              textDocument: { uri: 'file:///test-format.rs' },
              options: { tabSize: 2, insertSpaces: true }
            }
          });
        }, 100);
      }
      
      if (json.id === 2) {
        console.log('\n=== Format result ===');
        if (json.result && json.result.length > 0) {
          const edit = json.result[0];
          console.log('Formatted text:');
          console.log('---');
          console.log(edit.newText);
          console.log('---');
        } else {
          console.log('No formatting edits returned');
        }
        server.kill();
        process.exit(0);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }
});

// Initialize
send({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: { rootUri: null, capabilities: {} }
});

setTimeout(() => {
  console.log('Timeout!');
  server.kill();
  process.exit(1);
}, 3000);