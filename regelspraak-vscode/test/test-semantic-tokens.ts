import * as path from 'path';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

class LSPTester {
  private serverProcess: ChildProcessWithoutNullStreams;
  private messageId = 0;
  
  constructor() {
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    this.serverProcess = spawn('node', [serverPath, '--stdio'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    this.serverProcess.stderr.on('data', (data: Buffer) => {
      // Show errors for debugging
      console.error('Server error:', data.toString());
    });
  }
  
  async sendMessage(method: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`Timeout waiting for response to ${method}`));
      }, 2000);
      const message = {
        jsonrpc: '2.0',
        id: ++this.messageId,
        method,
        params
      };
      
      const content = JSON.stringify(message);
      const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
      
      let response = '';
      let contentLength = 0;
      let headerComplete = false;
      
      const dataHandler = (data: Buffer) => {
        response += data.toString();
        
        if (!headerComplete) {
          const headerEnd = response.indexOf('\r\n\r\n');
          if (headerEnd !== -1) {
            const headerStr = response.substring(0, headerEnd);
            const lengthMatch = headerStr.match(/Content-Length: (\d+)/);
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
            if (result.id === message.id) {
              clearTimeout(timeout);
              this.serverProcess.stdout.off('data', dataHandler);
              resolve(result);
            }
          } catch (e) {
            reject(e);
          }
        }
      };
      
      this.serverProcess.stdout.on('data', dataHandler);
      this.serverProcess.stdin.write(header + content);
    });
  }
  
  async sendNotification(method: string, params: any): Promise<void> {
    const message = {
      jsonrpc: '2.0',
      method,
      params
    };
    
    const content = JSON.stringify(message);
    const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
    
    this.serverProcess.stdin.write(header + content);
    
    // Give server time to process
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  close(): void {
    this.serverProcess.kill();
  }
}

async function testSemanticTokens(): Promise<void> {
  const tester = new LSPTester();
  
  try {
    console.log('=== Testing Semantic Tokens ===\n');
    
    // Initialize
    console.log('Testing initialize with semantic tokens...');
    const initResponse = await tester.sendMessage('initialize', {
      rootUri: null,
      capabilities: {}
    });
    
    if (!initResponse.result?.capabilities?.semanticTokensProvider) {
      console.log('  ❌ No semantic tokens provider');
      return;
    }
    
    const legend = initResponse.result.capabilities.semanticTokensProvider.legend;
    if (!legend || !Array.isArray(legend.tokenTypes) || !Array.isArray(legend.tokenModifiers)) {
      console.log('  ❌ Invalid semantic tokens legend');
      return;
    }
    
    console.log('  ✅ Semantic tokens provider registered');
    console.log(`  Token types: ${legend.tokenTypes.join(', ')}`);
    console.log(`  Token modifiers: ${legend.tokenModifiers.join(', ')}\n`);
    
    // Test 1: Parameters
    console.log('Testing semantic tokens for parameters...');
    await tester.sendNotification('textDocument/didOpen', {
      textDocument: {
        uri: 'file:///test.regelspraak',
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter loon: Bedrag;\nParameter bonus: Percentage;'
      }
    });
    
    const tokensResponse1 = await tester.sendMessage('textDocument/semanticTokens/full', {
      textDocument: { uri: 'file:///test.regelspraak' }
    });
    
    if (tokensResponse1.result?.data && tokensResponse1.result.data.length > 0) {
      console.log(`  ✅ Got ${tokensResponse1.result.data.length / 5} tokens for parameters`);
      
      // Decode first few tokens
      const data = tokensResponse1.result.data;
      console.log('  First token:', {
        line: data[0],
        char: data[1],
        length: data[2],
        type: legend.tokenTypes[data[3]],
        modifiers: data[4]
      });
    } else {
      console.log('  ❌ No tokens returned for parameters');
    }
    
    // Test 2: Object types
    console.log('\nTesting semantic tokens for object types...');
    await tester.sendNotification('textDocument/didChange', {
      textDocument: {
        uri: 'file:///test.regelspraak',
        version: 2
      },
      contentChanges: [{
        text: 'Objecttype Persoon\n  naam: Tekst;\n  leeftijd: Numeriek;\n  salaris: Bedrag;'
      }]
    });
    
    const tokensResponse2 = await tester.sendMessage('textDocument/semanticTokens/full', {
      textDocument: { uri: 'file:///test.regelspraak' }
    });
    
    if (tokensResponse2.result?.data && tokensResponse2.result.data.length > 0) {
      console.log(`  ✅ Got ${tokensResponse2.result.data.length / 5} tokens for object type`);
    } else {
      console.log('  ❌ No tokens returned for object type');
    }
    
    // Test 3: Rules with references
    console.log('\nTesting semantic tokens for rules...');
    await tester.sendNotification('textDocument/didChange', {
      textDocument: {
        uri: 'file:///test.regelspraak',
        version: 3
      },
      contentChanges: [{
        text: 'Parameter salaris: Bedrag;\n\nRegel bereken_bonus\n  geldig altijd\n    Het bonus wordt salaris * 0.1;'
      }]
    });
    
    const tokensResponse3 = await tester.sendMessage('textDocument/semanticTokens/full', {
      textDocument: { uri: 'file:///test.regelspraak' }
    });
    
    if (tokensResponse3.result?.data && tokensResponse3.result.data.length > 0) {
      const tokenCount = tokensResponse3.result.data.length / 5;
      console.log(`  ✅ Got ${tokenCount} tokens for rule`);
      
      // Check for specific token types
      const tokens: any[] = [];
      for (let i = 0; i < tokensResponse3.result.data.length; i += 5) {
        tokens.push({
          line: tokensResponse3.result.data[i],
          char: tokensResponse3.result.data[i + 1],
          length: tokensResponse3.result.data[i + 2],
          type: legend.tokenTypes[tokensResponse3.result.data[i + 3]],
          modifiers: tokensResponse3.result.data[i + 4]
        });
      }
      
      const hasKeyword = tokens.some(t => t.type === 'keyword');
      const hasVariable = tokens.some(t => t.type === 'variable');
      const hasNumber = tokens.some(t => t.type === 'number');
      
      console.log(`  Keywords: ${hasKeyword ? '✓' : '✗'}`);
      console.log(`  Variables: ${hasVariable ? '✓' : '✗'}`);
      console.log(`  Numbers: ${hasNumber ? '✓' : '✗'}`);
    } else {
      console.log('  ❌ No tokens returned for rule');
    }
    
    // Test 4: Invalid syntax (should not crash)
    console.log('\nTesting semantic tokens with invalid syntax...');
    await tester.sendNotification('textDocument/didChange', {
      textDocument: {
        uri: 'file:///test.regelspraak',
        version: 4
      },
      contentChanges: [{
        text: 'This is invalid RegelSpraak syntax!!!'
      }]
    });
    
    const tokensResponse4 = await tester.sendMessage('textDocument/semanticTokens/full', {
      textDocument: { uri: 'file:///test.regelspraak' }
    });
    
    if (tokensResponse4.result) {
      console.log('  ✅ Server handled invalid syntax gracefully');
      console.log(`  Returned ${tokensResponse4.result.data?.length || 0} data items`);
    } else if (tokensResponse4.error) {
      console.log('  ⚠️  Server returned error for invalid syntax:', tokensResponse4.error.message);
    } else {
      console.log('  ❌ Unexpected response for invalid syntax');
    }
    
    console.log('\n✅ Semantic tokens tests complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    tester.close();
  }
}

// Run tests
testSemanticTokens().catch(console.error);