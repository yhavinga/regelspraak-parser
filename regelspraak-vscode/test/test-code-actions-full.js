const { spawn } = require('child_process');
const path = require('path');

async function testCodeActions() {
  const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
  const child = spawn('node', [serverPath, '--stdio'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  let buffer = '';
  const responses = {};
  
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
      
      try {
        const msg = JSON.parse(message);
        if (msg.id) {
          responses[msg.id] = msg;
        }
      } catch (e) {
        // Ignore
      }
    }
  });
  
  child.stderr.on('data', (data) => {
    console.error('Server error:', data.toString());
  });
  
  // 1. Initialize
  const initRequest = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { rootUri: null, capabilities: {} }
  });
  child.stdin.write(`Content-Length: ${Buffer.byteLength(initRequest)}\r\n\r\n${initRequest}`);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (responses[1]) {
    console.log('✅ Server initialized');
    console.log('   Code Actions enabled:', responses[1].result.capabilities.codeActionProvider === true);
  }
  
  // 2. Open document with error
  const textWithError = `parameter salaris is een bedrag`;
  
  const openRequest = JSON.stringify({
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///test.rs',
        languageId: 'regelspraak',
        version: 1,
        text: textWithError
      }
    }
  });
  child.stdin.write(`Content-Length: ${Buffer.byteLength(openRequest)}\r\n\r\n${openRequest}`);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // 3. Request code actions for the error
  const codeActionRequest = JSON.stringify({
    jsonrpc: '2.0',
    id: 2,
    method: 'textDocument/codeAction',
    params: {
      textDocument: { uri: 'file:///test.rs' },
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
          message: "line 1:0 mismatched input 'parameter' expecting 'Parameter'",
          source: 'regelspraak'
        }]
      }
    }
  });
  
  child.stdin.write(`Content-Length: ${Buffer.byteLength(codeActionRequest)}\r\n\r\n${codeActionRequest}`);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (responses[2]) {
    const codeActions = responses[2].result;
    console.log('\n📝 Code Actions response:');
    console.log(JSON.stringify(codeActions, null, 2));
    
    if (Array.isArray(codeActions) && codeActions.length > 0) {
      console.log('\n✅ Code Actions working!');
      for (const action of codeActions) {
        console.log(`   - ${action.title}`);
      }
    } else {
      console.log('\n⚠️  No code actions returned');
    }
  } else {
    console.log('\n❌ No response for code actions request');
  }
  
  // Test with different error patterns
  console.log('\n--- Testing other error patterns ---');
  
  // Test "is een" error
  const textWithIsEen = `Parameter salaris is een Bedrag;`;
  const openRequest2 = JSON.stringify({
    jsonrpc: '2.0',
    method: 'textDocument/didChange',
    params: {
      textDocument: { uri: 'file:///test.rs', version: 2 },
      contentChanges: [{ text: textWithIsEen }]
    }
  });
  child.stdin.write(`Content-Length: ${Buffer.byteLength(openRequest2)}\r\n\r\n${openRequest2}`);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const codeActionRequest2 = JSON.stringify({
    jsonrpc: '2.0',
    id: 3,
    method: 'textDocument/codeAction',
    params: {
      textDocument: { uri: 'file:///test.rs' },
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
          message: "line 1:18 mismatched input 'is' expecting ':'",
          source: 'regelspraak'
        }]
      }
    }
  });
  
  child.stdin.write(`Content-Length: ${Buffer.byteLength(codeActionRequest2)}\r\n\r\n${codeActionRequest2}`);
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (responses[3]) {
    const codeActions = responses[3].result;
    console.log('\n"is een" fix:');
    if (Array.isArray(codeActions) && codeActions.length > 0) {
      for (const action of codeActions) {
        console.log(`   ✅ ${action.title}`);
      }
    } else {
      console.log('   ⚠️  No fix available');
    }
  }
  
  child.kill();
  console.log('\n✅ Test complete');
}

testCodeActions().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});