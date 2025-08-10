import { describe, it, beforeEach, afterEach } from '@jest/globals';
import { strict as assert } from 'assert';
import * as path from 'path';
import { spawn } from 'child_process';

describe('Semantic Tokens', () => {
  let serverProcess: any;
  
  beforeEach(() => {
    // Start server
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    serverProcess = spawn('node', [serverPath, '--stdio'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
  });
  
  afterEach(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });
  
  function sendMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const content = JSON.stringify(message);
      const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
      
      let response = '';
      let contentLength = 0;
      let headerComplete = false;
      
      serverProcess.stdout.on('data', (data: Buffer) => {
        response += data.toString();
        
        if (!headerComplete) {
          const headerEnd = response.indexOf('\r\n\r\n');
          if (headerEnd !== -1) {
            const header = response.substring(0, headerEnd);
            const lengthMatch = header.match(/Content-Length: (\d+)/);
            if (lengthMatch) {
              contentLength = parseInt(lengthMatch[1]);
            }
            response = response.substring(headerEnd + 4);
            headerComplete = true;
          }
        }
        
        if (headerComplete && response.length >= contentLength) {
          const jsonStr = response.substring(0, contentLength);
          try {
            const result = JSON.parse(jsonStr);
            resolve(result);
          } catch (e) {
            reject(e);
          }
        }
      });
      
      serverProcess.stderr.on('data', (data: Buffer) => {
        console.error('Server error:', data.toString());
      });
      
      serverProcess.stdin.write(header + content);
    });
  }
  
  it('should provide semantic tokens for parameters', async () => {
    // Initialize
    const initResponse = await sendMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        rootUri: null,
        capabilities: {}
      }
    });
    
    assert(initResponse.result.capabilities.semanticTokensProvider);
    assert(initResponse.result.capabilities.semanticTokensProvider.legend);
    assert(Array.isArray(initResponse.result.capabilities.semanticTokensProvider.legend.tokenTypes));
    
    // Open document
    await sendMessage({
      jsonrpc: '2.0',
      method: 'textDocument/didOpen',
      params: {
        textDocument: {
          uri: 'file:///test.regelspraak',
          languageId: 'regelspraak',
          version: 1,
          text: 'Parameter loon: Bedrag;'
        }
      }
    });
    
    // Request semantic tokens
    const tokensResponse = await sendMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/semanticTokens/full',
      params: {
        textDocument: {
          uri: 'file:///test.regelspraak'
        }
      }
    });
    
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
    await sendMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        rootUri: null,
        capabilities: {}
      }
    });
    
    // Open document with object type
    await sendMessage({
      jsonrpc: '2.0',
      method: 'textDocument/didOpen',
      params: {
        textDocument: {
          uri: 'file:///test.regelspraak',
          languageId: 'regelspraak',
          version: 1,
          text: 'Objecttype Persoon\n  naam: Tekst;\n  leeftijd: Numeriek;'
        }
      }
    });
    
    // Request semantic tokens
    const tokensResponse = await sendMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/semanticTokens/full',
      params: {
        textDocument: {
          uri: 'file:///test.regelspraak'
        }
      }
    });
    
    assert(tokensResponse.result);
    assert(Array.isArray(tokensResponse.result.data));
    assert(tokensResponse.result.data.length > 0, 'Should have semantic tokens for object type');
  });
  
  it('should provide semantic tokens for rules', async () => {
    // Initialize
    await sendMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        rootUri: null,
        capabilities: {}
      }
    });
    
    // Open document with rule
    await sendMessage({
      jsonrpc: '2.0',
      method: 'textDocument/didOpen',
      params: {
        textDocument: {
          uri: 'file:///test.regelspraak',
          languageId: 'regelspraak',
          version: 1,
          text: 'Parameter salaris: Bedrag;\n\nRegel bereken_bonus\n  geldig altijd\n    Het bonus wordt salaris * 0.1;'
        }
      }
    });
    
    // Request semantic tokens
    const tokensResponse = await sendMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/semanticTokens/full',
      params: {
        textDocument: {
          uri: 'file:///test.regelspraak'
        }
      }
    });
    
    assert(tokensResponse.result);
    assert(Array.isArray(tokensResponse.result.data));
    assert(tokensResponse.result.data.length > 0, 'Should have semantic tokens for rule');
    
    // Should have tokens for "Regel" keyword and parameter reference "salaris"
    const tokens = tokensResponse.result.data;
    assert(tokens.length >= 15, 'Should have multiple tokens including keywords and references');
  });
});