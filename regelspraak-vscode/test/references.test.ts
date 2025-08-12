import { describe, it } from '@jest/globals';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as assert from 'assert';

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

describe('Find All References', () => {
  it('should find all references to a parameter', async () => {
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    const server = spawn('node', [serverPath, '--stdio']);
    
    try {
      // Initialize
      await sendRequest(server, 'initialize', {
        processId: process.pid,
        rootUri: null,
        capabilities: {}
      }, 1);
      
      // Send document
      const text = `Parameter loon: Bedrag;
Parameter bonus: Bedrag;
Regel BerekenTotaal
geldig altijd
  Het totaal van een persoon moet berekend worden als loon plus bonus.
Regel BerekenMinimum
geldig altijd
  Het minimum van een persoon moet berekend worden als loon min 100.
Regel BerekenMaximum
geldig altijd
  Het maximum van een persoon moet gesteld worden op loon maal 2.`;
      
      sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri: 'file:///test.rs',
          languageId: 'regelspraak',
          version: 1,
          text
        }
      });
      
      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Request references for 'loon' at its definition
      const response = await sendRequest(server, 'textDocument/references', {
        textDocument: { uri: 'file:///test.rs' },
        position: { line: 0, character: 10 },  // On "loon" in "Parameter loon: Bedrag;"
        context: { includeDeclaration: true }
      }, 2);
      
      // Verify response
      assert.ok(Array.isArray(response.result), 'Should return array of locations');
      assert.equal(response.result.length, 4, 'Should find 4 references to "loon"');
      
      // Check that we found the definition and all uses
      // Line 0: Parameter loon: Bedrag;
      // Line 4: loon plus bonus (first use)
      // Line 7: loon min 100 (second use)
      // Line 10: loon maal 2 (third use)
      const lines = response.result.map((loc: any) => loc.range.start.line).sort((a: number, b: number) => a - b);
      assert.deepEqual(lines, [0, 4, 7, 10], 'Should find references on lines 0, 4, 7, and 10');
      
    } finally {
      server.kill();
    }
  });
});