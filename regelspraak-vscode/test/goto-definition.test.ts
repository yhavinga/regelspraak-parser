import * as assert from 'assert';
import { spawn } from 'child_process';
import * as path from 'path';

describe('Go to Definition', () => {
  it('should find parameter definition from expression', (done) => {
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    const server = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let responseBuffer = '';
    
    server.stdout.on('data', (data) => {
      responseBuffer += data.toString();
      
      // Try to parse complete messages
      const lines = responseBuffer.split('\r\n');
      for (let i = 0; i < lines.length - 1; i++) {
        if (lines[i].startsWith('Content-Length:')) {
          const length = parseInt(lines[i].split(':')[1].trim());
          if (lines[i + 1] === '' && lines[i + 2]) {
            const content = lines.slice(i + 2).join('\r\n');
            if (content.length >= length) {
              const message = content.substring(0, length);
              try {
                const response = JSON.parse(message);
                
                // Check if this is our definition response
                if (response.id === 2) {
                  assert.ok(response.result, 'Should return a definition');
                  assert.equal(response.result.range.start.line, 0, 'Should point to line 0');
                  assert.equal(response.result.range.start.character, 10, 'Should point to start of parameter name');
                  server.kill();
                  done();
                }
              } catch (e) {
                // Not a complete JSON message yet
              }
            }
          }
        }
      }
    });
    
    server.on('error', (err) => {
      done(err);
    });
    
    // Send initialize request
    const initRequest = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: process.pid,
        rootUri: null,
        capabilities: {}
      }
    });
    
    server.stdin.write(`Content-Length: ${Buffer.byteLength(initRequest)}\r\n\r\n${initRequest}`);
    
    // Send document open notification
    setTimeout(() => {
      const docText = `Parameter salaris: Bedrag;
Parameter bonus: Bedrag;
Regel Totaal
geldig altijd
  Het totaal van een persoon moet berekend worden als salaris plus bonus.`;
      
      const openNotification = JSON.stringify({
        jsonrpc: '2.0',
        method: 'textDocument/didOpen',
        params: {
          textDocument: {
            uri: 'file:///test.rs',
            languageId: 'regelspraak',
            version: 1,
            text: docText
          }
        }
      });
      
      server.stdin.write(`Content-Length: ${Buffer.byteLength(openNotification)}\r\n\r\n${openNotification}`);
      
      // Request go to definition for 'salaris' in the expression
      setTimeout(() => {
        const defRequest = JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'textDocument/definition',
          params: {
            textDocument: {
              uri: 'file:///test.rs'
            },
            position: {
              line: 4,  // Line with assignment
              character: 55  // Position within 'salaris'
            }
          }
        });
        
        server.stdin.write(`Content-Length: ${Buffer.byteLength(defRequest)}\r\n\r\n${defRequest}`);
      }, 100);
    }, 100);
    
    // Timeout after 2 seconds
    setTimeout(() => {
      server.kill();
      done(new Error('Test timed out'));
    }, 2000);
  });
});