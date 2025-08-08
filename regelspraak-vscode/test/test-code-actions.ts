import * as assert from 'assert';
import { spawn } from 'child_process';
import * as path from 'path';

// Test Code Actions functionality
async function sendRequest(child: any, method: string, params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const request = JSON.stringify({ jsonrpc: '2.0', id, method, params });
    const message = `Content-Length: ${Buffer.byteLength(request)}\r\n\r\n${request}`;
    
    let buffer = '';
    const dataHandler = (data: Buffer) => {
      buffer += data.toString();
      
      // Try to parse complete messages
      while (true) {
        const headerEnd = buffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) break;
        
        const header = buffer.substring(0, headerEnd);
        const contentLengthMatch = header.match(/Content-Length: (\d+)/);
        if (!contentLengthMatch) break;
        
        const contentLength = parseInt(contentLengthMatch[1]);
        const messageStart = headerEnd + 4;
        const messageEnd = messageStart + contentLength;
        
        if (buffer.length < messageEnd) break;
        
        const message = buffer.substring(messageStart, messageEnd);
        buffer = buffer.substring(messageEnd);
        
        try {
          const response = JSON.parse(message);
          if (response.id === id) {
            child.stdout.off('data', dataHandler);
            resolve(response.result);
          }
        } catch (e) {
          // Not a response we're looking for
        }
      }
    };
    
    child.stdout.on('data', dataHandler);
    child.stdin.write(message);
    
    // Timeout after 2 seconds
    setTimeout(() => {
      child.stdout.off('data', dataHandler);
      reject(new Error('Request timeout'));
    }, 2000);
  });
}

async function testCodeActions() {
  const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
  const child = spawn('node', [serverPath, '--stdio'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  try {
    // Initialize
    await sendRequest(child, 'initialize', {
      rootUri: null,
      capabilities: {}
    });
    
    // Open document with errors
    const uri = 'file:///test.rs';
    const textWithErrors = `parameter salaris is een bedrag

Regel bereken_bonus
  Het bonus = salaris * 0.1`;
    
    // Send document
    await sendRequest(child, 'textDocument/didOpen', {
      textDocument: {
        uri,
        languageId: 'regelspraak',
        version: 1,
        text: textWithErrors
      }
    });
    
    // Wait for diagnostics to be processed
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Request code actions for line 0 (parameter capitalization error)
    const codeActions = await sendRequest(child, 'textDocument/codeAction', {
      textDocument: { uri },
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 9 }
      },
      context: {
        diagnostics: [{
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 9 }
          },
          severity: 1,
          message: "mismatched input 'parameter' expecting 'Parameter'",
          source: 'regelspraak'
        }]
      }
    });
    
    // Verify we got code actions
    assert(Array.isArray(codeActions), 'Should return array of code actions');
    assert(codeActions.length > 0, 'Should have at least one code action');
    
    // Check first action
    const capitalizeAction = codeActions[0];
    assert.strictEqual(capitalizeAction.title, 'Capitalize "parameter" to "Parameter"');
    assert(capitalizeAction.edit, 'Should have edit');
    assert(capitalizeAction.edit.changes, 'Should have changes');
    
    // Test "is een" to ":" fix
    const codeActions2 = await sendRequest(child, 'textDocument/codeAction', {
      textDocument: { uri },
      range: {
        start: { line: 0, character: 18 },
        end: { line: 0, character: 24 }
      },
      context: {
        diagnostics: [{
          range: {
            start: { line: 0, character: 18 },
            end: { line: 0, character: 24 }
          },
          severity: 1,
          message: "mismatched input 'is' expecting ':'",
          source: 'regelspraak'
        }]
      }
    });
    
    assert(codeActions2.length > 0, 'Should have code action for "is een" fix');
    const colonAction = codeActions2[0];
    assert.strictEqual(colonAction.title, 'Replace "is een" with ":"');
    
    // Test unknown parameter fix
    const codeActions3 = await sendRequest(child, 'textDocument/codeAction', {
      textDocument: { uri },
      range: {
        start: { line: 3, character: 0 },
        end: { line: 3, character: 30 }
      },
      context: {
        diagnostics: [{
          range: {
            start: { line: 3, character: 15 },
            end: { line: 3, character: 20 }
          },
          severity: 1,
          message: "Unknown parameter: bonus",
          source: 'regelspraak'
        }]
      }
    });
    
    assert(codeActions3.length > 0, 'Should have code action for unknown parameter');
    const createParamAction = codeActions3[0];
    assert.strictEqual(createParamAction.title, "Create parameter 'bonus'");
    
    console.log('✅ All Code Actions tests passed!');
    
  } finally {
    child.kill();
  }
}

// Run test
testCodeActions().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});