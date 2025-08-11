import { describe, it, beforeEach, afterEach } from '@jest/globals';
import { strict as assert } from 'assert';
import * as path from 'path';
import { spawn } from 'child_process';

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

describe('Semantic Tokens', () => {
  let serverProcess: any;
  let messageId = 1;
  
  beforeEach(() => {
    // Start server
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    serverProcess = spawn('node', [serverPath, '--stdio'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    messageId = 1; // Reset for each test
  });
  
  afterEach(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });
  
  it('should provide semantic tokens for parameters', async () => {
    // Initialize
    const initResponse = await sendRequest(serverProcess, 'initialize', {
      rootUri: null,
      capabilities: {}
    }, messageId++);
    
    assert(initResponse.result.capabilities.semanticTokensProvider);
    assert(initResponse.result.capabilities.semanticTokensProvider.legend);
    assert(Array.isArray(initResponse.result.capabilities.semanticTokensProvider.legend.tokenTypes));
    
    // Open document
    sendNotification(serverProcess, 'textDocument/didOpen', {
      textDocument: {
        uri: 'file:///test.regelspraak',
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter loon: Bedrag;'
      }
    });
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Request semantic tokens
    const tokensResponse = await sendRequest(serverProcess, 'textDocument/semanticTokens/full', {
      textDocument: {
        uri: 'file:///test.regelspraak'
      }
    }, messageId++);
    
    // Should have tokens
    assert(tokensResponse.result);
    assert(Array.isArray(tokensResponse.result.data));
    assert(tokensResponse.result.data.length > 0, 'Should have semantic tokens');
    
    // Tokens are encoded as 5-element tuples
    // [deltaLine, deltaStartChar, length, tokenType, tokenModifiers]
    const tokens = tokensResponse.result.data;
    
    // Should have at least one token for "Parameter" keyword
    // and one for the parameter name "loon"
    assert(tokens.length >= 10, 'Should have at least 2 tokens (10 integers)');
  });
  
  it('should provide semantic tokens for object types', async () => {
    // Initialize
    await sendRequest(serverProcess, 'initialize', {
      rootUri: null,
      capabilities: {}
    }, messageId++);
    
    // Open document with object type
    sendNotification(serverProcess, 'textDocument/didOpen', {
      textDocument: {
        uri: 'file:///test.regelspraak',
        languageId: 'regelspraak',
        version: 1,
        text: 'Objecttype Persoon\n  naam: Tekst;\n  leeftijd: Numeriek;'
      }
    });
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Request semantic tokens
    const tokensResponse = await sendRequest(serverProcess, 'textDocument/semanticTokens/full', {
      textDocument: {
        uri: 'file:///test.regelspraak'
      }
    }, messageId++);
    
    assert(tokensResponse.result);
    assert(Array.isArray(tokensResponse.result.data));
    assert(tokensResponse.result.data.length > 0, 'Should have semantic tokens for object type');
  });
  
  it('should provide semantic tokens for rules', async () => {
    // Initialize
    await sendRequest(serverProcess, 'initialize', {
      rootUri: null,
      capabilities: {}
    }, messageId++);
    
    // Open document with rule
    sendNotification(serverProcess, 'textDocument/didOpen', {
      textDocument: {
        uri: 'file:///test.regelspraak',
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter salaris: Bedrag;\n\nRegel bereken_bonus\n  geldig altijd\n    Het bonus wordt salaris * 0.1;'
      }
    });
    
    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Request semantic tokens
    const tokensResponse = await sendRequest(serverProcess, 'textDocument/semanticTokens/full', {
      textDocument: {
        uri: 'file:///test.regelspraak'
      }
    }, messageId++);
    
    assert(tokensResponse.result);
    assert(Array.isArray(tokensResponse.result.data));
    assert(tokensResponse.result.data.length > 0, 'Should have semantic tokens for rule');
    
    // Should have tokens for "Regel" keyword and parameter reference "salaris"
    const tokens = tokensResponse.result.data;
    assert(tokens.length >= 15, 'Should have multiple tokens including keywords and references');
  });
});