const { spawn } = require('child_process');
const path = require('path');

async function testSnippets() {
  const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
  const child = spawn('node', [serverPath, '--stdio'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let buffer = '';
  const responses = {};
  let messageCount = 0;
  
  child.stdout.on('data', (data) => {
    buffer += data.toString();
    
    // Parse messages
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
      
      messageCount++;
      console.log(`\n>>> Message ${messageCount} from server:`);
      
      try {
        const msg = JSON.parse(message);
        console.log(JSON.stringify(msg, null, 2).substring(0, 500));
        
        if (msg.id) {
          responses[msg.id] = msg;
        }
      } catch (e) {
        console.log('Failed to parse:', message);
      }
    }
  });
  
  child.stderr.on('data', (data) => {
    console.error('Server stderr:', data.toString());
  });
  
  // 1. Initialize
  console.log('\n=== Sending Initialize ===');
  const initRequest = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { rootUri: null, capabilities: {} }
  });
  child.stdin.write(`Content-Length: ${Buffer.byteLength(initRequest)}\r\n\r\n${initRequest}`);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // 2. Open document
  console.log('\n=== Sending Document Open ===');
  const text = 'para';
  
  const openRequest = JSON.stringify({
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///test.rs',
        languageId: 'regelspraak',
        version: 1,
        text: text
      }
    }
  });
  child.stdin.write(`Content-Length: ${Buffer.byteLength(openRequest)}\r\n\r\n${openRequest}`);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // 3. Request completions
  console.log('\n=== Sending Completion Request ===');
  const completionRequest = JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'textDocument/completion',
    params: {
      textDocument: { uri: 'file:///test.rs' },
      position: { line: 0, character: 4 }  // After "para"
    }
  });
  
  child.stdin.write(`Content-Length: ${Buffer.byteLength(completionRequest)}\r\n\r\n${completionRequest}`);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  console.log('\n=== Final responses received ===');
  console.log('Response IDs:', Object.keys(responses));
  
  if (responses[2]) {
    const result = responses[2].result;
    console.log('\n=== Completion Response ===');
    if (Array.isArray(result)) {
      console.log(`Got ${result.length} completions`);
      for (const item of result) {
        console.log(`  - ${item.label} (format: ${item.insertTextFormat})`);
      }
    } else {
      console.log('Result is not an array:', result);
    }
  } else {
    console.log('No response for completion request');
  }
  
  child.kill();
  console.log('\n=== Test complete ===');
}

testSnippets().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});