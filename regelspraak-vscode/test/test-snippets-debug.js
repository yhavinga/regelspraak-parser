const { spawn } = require('child_process');
const path = require('path');

async function sendRequest(child, method, params) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const request = JSON.stringify({ jsonrpc: '2.0', id, method, params });
    const message = `Content-Length: ${Buffer.byteLength(request)}\r\n\r\n${request}`;
    
    let buffer = '';
    const dataHandler = (data) => {
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

async function testSnippets() {
  const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
  const child = spawn('node', [serverPath, '--stdio'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  // Log stderr for debugging
  child.stderr.on('data', (data) => {
    console.error('Server error:', data.toString());
  });
  
  try {
    // Initialize
    const initResult = await sendRequest(child, 'initialize', {
      rootUri: null,
      capabilities: {}
    });
    console.log('Init result:', initResult.capabilities.completionProvider);
    
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
    
    console.log('Got completions:', completions ? completions.length : 'null');
    
    if (Array.isArray(completions)) {
      console.log('\nAll completions:');
      for (const c of completions) {
        console.log(`  - ${c.label} (kind: ${c.kind}, format: ${c.insertTextFormat})`);
        if (c.insertTextFormat === 2) {
          console.log(`    Snippet text: ${c.insertText.substring(0, 60)}...`);
        }
      }
      
      // Find the Parameter snippet
      const snippetCompletion = completions.find(c => 
        c.label === 'Parameter' && c.insertTextFormat === 2
      );
      
      if (snippetCompletion) {
        console.log('\n✅ Parameter snippet found!');
        console.log('   Full insert text:', snippetCompletion.insertText);
      } else {
        console.log('\n❌ Parameter snippet NOT found');
      }
    } else {
      console.log('❌ Completions is not an array:', completions);
    }
    
  } finally {
    child.kill();
  }
}

// Run test
testSnippets().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});