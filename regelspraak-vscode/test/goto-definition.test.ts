import { describe, it } from '@jest/globals';
import * as assert from 'assert';
import { spawn } from 'child_process';
import * as path from 'path';

// Helper to send LSP request (expects response)
function sendRequest(proc: any, method: string, params: any, id: number): Promise<any> {
  return new Promise((resolve, reject) => {
    const message = { jsonrpc: '2.0', id, method, params };
    const content = JSON.stringify(message);
    const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
    
    proc.stdin.write(header + content);
    
    // Collect response
    let buffer = Buffer.alloc(0);
    const handler = (data: Buffer) => {
      buffer = Buffer.concat([buffer, data]);
      
      // Parse LSP messages with headers
      while (true) {
        const headerEndBytes = Buffer.from('\r\n\r\n');
        const headerEnd = buffer.indexOf(headerEndBytes);
        if (headerEnd === -1) break;
        
        const header = buffer.slice(0, headerEnd).toString();
        const contentLengthMatch = header.match(/Content-Length: (\d+)/);
        if (!contentLengthMatch) {
          buffer = buffer.slice(headerEnd + 4);
          continue;
        }
        
        const contentLength = parseInt(contentLengthMatch[1], 10);
        const contentStart = headerEnd + 4;
        const contentEnd = contentStart + contentLength;
        
        if (buffer.length < contentEnd) break; // Wait for more data
        
        const content = buffer.slice(contentStart, contentEnd).toString('utf8');
        buffer = buffer.slice(contentEnd);
        
        try {
          const response = JSON.parse(content);
          if (response.id === id) {
            proc.stdout.off('data', handler);
            if (response.error) {
              reject(new Error(response.error.message));
            } else {
              resolve(response);
            }
            return;
          }
        } catch (e) {
          // Continue looking
        }
      }
    };
    
    proc.stdout.on('data', handler);
    
    // Timeout after 2 seconds
    setTimeout(() => {
      proc.stdout.off('data', handler);
      reject(new Error('Timeout waiting for response'));
    }, 2000);
  });
}

// Helper to send LSP notification (no response expected)
function sendNotification(proc: any, method: string, params: any): void {
  const message = { jsonrpc: '2.0', method, params };
  const content = JSON.stringify(message);
  const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
  proc.stdin.write(header + content);
}

describe('Go to Definition', () => {
  it('should find parameter definition from expression', async () => {
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    const server = spawn('node', [serverPath, '--stdio'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    try {
      // Send initialize request
      await sendRequest(server, 'initialize', {
        processId: process.pid,
        rootUri: null,
        capabilities: {}
      }, 1);
    
      // Send document open notification
      const docText = `Parameter salaris: Bedrag;
Parameter bonus: Bedrag;
Regel Totaal
geldig altijd
  Het totaal van een persoon moet berekend worden als salaris plus bonus.`;
      
      sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri: 'file:///test.rs',
          languageId: 'regelspraak',
          version: 1,
          text: docText
        }
      });
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Request go to definition for 'salaris' in the expression
      const defResponse = await sendRequest(server, 'textDocument/definition', {
        textDocument: {
          uri: 'file:///test.rs'
        },
        position: {
          line: 4,  // Line with assignment
          character: 55  // Position within 'salaris'
        }
      }, 2);
      
      // Check result
      assert.ok(defResponse.result, 'Should return a definition');
      assert.equal(defResponse.result.range.start.line, 0, 'Should point to line 0');
      assert.equal(defResponse.result.range.start.character, 10, 'Should point to start of parameter name');
      
    } finally {
      server.kill();
    }
  });
});