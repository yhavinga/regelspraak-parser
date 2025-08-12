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

// Helper to wait for diagnostics
function waitForDiagnostics(proc: any): Promise<any> {
  return new Promise((resolve) => {
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
          const msg = JSON.parse(content);
          if (msg.method === 'textDocument/publishDiagnostics') {
            proc.stdout.off('data', handler);
            resolve(msg.params);
            return;
          }
        } catch (e) {
          // Continue looking
        }
      }
    };
    
    proc.stdout.on('data', handler);
    
    // Timeout after 1 second (diagnostics should be quick)
    setTimeout(() => {
      proc.stdout.off('data', handler);
      resolve(null);
    }, 1000);
  });
}

describe('Indien Conditions in LSP', () => {
  it('should parse simple indien conditions without errors', async () => {
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    const server = spawn('node', [serverPath, '--stdio']);
    
    try {
      // Initialize
      await sendRequest(server, 'initialize', {
        processId: process.pid,
        rootUri: null,
        capabilities: {}
      }, 1);
      
      // Send document with simple indien condition
      const text = `Parameter de volwassenleeftijd: Numeriek (geheel getal) met eenheid jr;

Objecttype de Natuurlijk persoon
    is minderjarig kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;

Regel Minderjarigheid
    geldig altijd
        Een Natuurlijk persoon is minderjarig
        indien zijn leeftijd kleiner is dan de volwassenleeftijd.`;
      
      sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri: 'file:///test-indien.rs',
          languageId: 'regelspraak',
          version: 1,
          text
        }
      });
      
      // Wait for diagnostics
      const diagnostics = await waitForDiagnostics(server);
      
      // Should have no errors
      assert.ok(diagnostics, 'Should receive diagnostics');
      assert.equal(diagnostics.diagnostics.length, 0, 'Should have no errors');
      
    } finally {
      server.kill();
    }
  });

  it('should parse compound indien conditions without errors', async () => {
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    const server = spawn('node', [serverPath, '--stdio']);
    
    try {
      // Initialize
      await sendRequest(server, 'initialize', {
        processId: process.pid,
        rootUri: null,
        capabilities: {}
      }, 1);
      
      // Send document with compound indien condition
      const text = `Parameter de minimum leeftijd: Numeriek (geheel getal) met eenheid jr;

Objecttype de Natuurlijk persoon
    is geschikt kenmerk (bijvoeglijk);
    de leeftijd Numeriek (geheel getal) met eenheid jr;
    de nationaliteit Tekst;

Regel GeschiktheidsTest
    geldig altijd
        Een Natuurlijk persoon is geschikt
        indien hij aan alle volgende voorwaarden voldoet:
            • zijn leeftijd is groter of gelijk aan de minimum leeftijd
            • zijn nationaliteit is gelijk aan "Nederlandse".`;
      
      sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri: 'file:///test-compound-indien.rs',
          languageId: 'regelspraak',
          version: 1,
          text
        }
      });
      
      // Wait for diagnostics
      const diagnostics = await waitForDiagnostics(server);
      
      // Should have no errors
      assert.ok(diagnostics, 'Should receive diagnostics');
      assert.equal(diagnostics.diagnostics.length, 0, 'Should have no errors for compound conditions');
      
    } finally {
      server.kill();
    }
  });

  it('should provide hover info for indien keywords', async () => {
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
      const text = `Regel Test
    geldig altijd
        Een Persoon is ok
        indien zijn naam is "Test".`;
      
      sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri: 'file:///test-hover.rs',
          languageId: 'regelspraak',
          version: 1,
          text
        }
      });
      
      // Wait a bit for processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Request hover on "indien"
      const response = await sendRequest(server, 'textDocument/hover', {
        textDocument: { uri: 'file:///test-hover.rs' },
        position: { line: 3, character: 8 }  // On "indien"
      }, 2);
      
      // Should return hover info
      assert.ok(response.result, 'Should return hover info');
      assert.ok(response.result.contents, 'Should have contents');
      
    } finally {
      server.kill();
    }
  });
});