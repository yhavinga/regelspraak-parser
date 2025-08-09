import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as assert from 'assert';

describe('Find All References', () => {
  it('should find all references to a parameter', (done) => {
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    const server = spawn('node', [serverPath, '--stdio']);
    
    let msgId = 1;
    let responseBuffer = '';
    
    function sendMessage(msg: any) {
      const content = JSON.stringify(msg);
      const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
      server.stdin.write(header + content);
    }
    
    server.stdout.on('data', (data) => {
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
          
          if (response.id === 2) {
            // This is our references response
            assert.ok(Array.isArray(response.result), 'Should return array of locations');
            assert.equal(response.result.length, 4, 'Should find 4 references to "loon"');
            
            // Check that we found the definition and all uses
            const lines = response.result.map((loc: any) => loc.range.start.line).sort();
            assert.deepEqual(lines, [0, 4, 5, 8], 'Should find references on lines 0, 4, 5, and 8');
            
            server.kill();
            done();
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
  indien loon > 1000
    Het totaal van een persoon moet berekend worden als loon + bonus.
Regel ControleerLoon
geldig altijd
  Het minimum van een persoon moet berekend worden als loon.`;
      
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
      server.kill();
      done(new Error('Test timed out'));
    }, 2000);
  });
});