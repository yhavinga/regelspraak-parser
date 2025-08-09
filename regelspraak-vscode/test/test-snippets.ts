import { strict as assert } from 'assert';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

interface LSPResponse {
  id: number;
  result?: any;
  error?: any;
}

async function sendRequest(child: ChildProcess, method: string, params: any): Promise<any> {
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
          const response: LSPResponse = JSON.parse(message);
          if (response.id === id) {
            child.stdout!.off('data', dataHandler);
            resolve(response.result);
          }
        } catch (e) {
          // Not a response we're looking for
        }
      }
    };
    
    child.stdout!.on('data', dataHandler);
    child.stdin!.write(message);
    
    // Timeout after 2 seconds
    setTimeout(() => {
      child.stdout!.off('data', dataHandler);
      reject(new Error('Request timeout'));
    }, 2000);
  });
}

async function testSnippets() {
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
    
    // Open a document
    const uri = 'file:///test.rs';
    const text = 'para';  // Starting to type "param"
    
    await sendRequest(child, 'textDocument/didOpen', {
      textDocument: {
        uri,
        languageId: 'regelspraak',
        version: 1,
        text
      }
    });
    
    // Request completions
    const completions = await sendRequest(child, 'textDocument/completion', {
      textDocument: { uri },
      position: { line: 0, character: 4 }  // After "para"
    });
    
    assert(Array.isArray(completions), 'Should return array of completions');
    
    // Find the Parameter snippet
    const snippetCompletion = completions.find((c: any) => 
      c.label === 'Parameter' && c.insertTextFormat === 2
    );
    
    assert(snippetCompletion, 'Should have Parameter snippet');
    assert.strictEqual(snippetCompletion.insertTextFormat, 2, 'Should use snippet format');
    assert(snippetCompletion.insertText.includes('${'), 'Should contain tab stops');
    assert(snippetCompletion.documentation, 'Should have documentation');
    
    console.log('✅ Snippet found:', snippetCompletion.label);
    console.log('   Insert text:', snippetCompletion.insertText.substring(0, 50) + '...');
    
    // Test other snippet triggers
    const snippetTests = [
      { text: 'reg', expectedLabel: 'Regel' },
      { text: 'obj', expectedLabel: 'Objecttype' },
      { text: 'dom', expectedLabel: 'Domein' },
      { text: 'besl', expectedLabel: 'Beslistabel' },
      { text: 'ind', expectedLabel: 'indien' },
      { text: 'geld', expectedLabel: 'geldig' }
    ];
    
    for (const test of snippetTests) {
      // Update document
      await sendRequest(child, 'textDocument/didChange', {
        textDocument: { uri, version: 2 },
        contentChanges: [{ text: test.text }]
      });
      
      // Request completions
      const completions = await sendRequest(child, 'textDocument/completion', {
        textDocument: { uri },
        position: { line: 0, character: test.text.length }
      });
      
      const snippet = completions.find((c: any) => 
        c.label === test.expectedLabel && c.insertTextFormat === 2
      );
      
      assert(snippet, `Should have ${test.expectedLabel} snippet for "${test.text}"`);
      console.log(`✅ ${test.expectedLabel} snippet found for "${test.text}"`);
    }
    
    console.log('\n✅ All snippet tests passed!');
    
  } finally {
    child.kill();
  }
}

// Run test
testSnippets().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});