import { describe, it, beforeEach, afterEach, expect } from '@jest/globals';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

interface LSPMessage {
  jsonrpc: string;
  id?: number;
  method?: string;
  params?: any;
  result?: any;
}

interface DocumentSymbol {
  name: string;
  kind: number;
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  selectionRange: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  children?: DocumentSymbol[];
}

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

describe('Document Symbols', () => {
  let server: ChildProcess;
  let messageId = 1;

  beforeEach(() => {
    const serverPath = path.join(__dirname, '../dist/server.js');
    server = spawn('node', [serverPath, '--stdio']);
    messageId = 1; // Reset for each test
  });

  afterEach(() => {
    server.kill();
  });

  test('should return symbols for parameters', async () => {
    // Initialize
    await sendRequest(server, 'initialize', {
      rootUri: null,
      capabilities: {}
    }, messageId++);

    // Send document
    sendNotification(server, 'textDocument/didOpen', {
      textDocument: {
        uri: 'file:///test.regelspraak',
        languageId: 'regelspraak',
        version: 1,
        text: `Parameter loon: Bedrag;
Parameter leeftijd: Numeriek (geheel getal);`
      }
    });
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 100));

    // Request symbols
    const response = await sendRequest(server, 'textDocument/documentSymbol', {
      textDocument: { uri: 'file:///test.regelspraak' }
    }, messageId++);
    const symbols = response.result as DocumentSymbol[];

    expect(symbols).toHaveLength(2);
    expect(symbols[0].name).toBe('loon');
    expect(symbols[0].kind).toBe(13); // Variable
    expect(symbols[0].range.start.line).toBe(0);
    expect(symbols[1].name).toBe('leeftijd');
    expect(symbols[1].range.start.line).toBe(1);
  });

  test('should return empty array for invalid document', async () => {
    // Initialize
    await sendRequest(server, 'initialize', {
      rootUri: null,
      capabilities: {}
    }, messageId++);

    // Send invalid document
    sendNotification(server, 'textDocument/didOpen', {
      textDocument: {
        uri: 'file:///invalid.regelspraak',
        languageId: 'regelspraak',
        version: 1,
        text: 'This is not valid RegelSpraak syntax'
      }
    });
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 100));

    // Request symbols
    const response = await sendRequest(server, 'textDocument/documentSymbol', {
      textDocument: { uri: 'file:///invalid.regelspraak' }
    }, messageId++);
    expect(response.result).toEqual([]);
  });
});