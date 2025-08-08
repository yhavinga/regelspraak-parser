#!/usr/bin/env node

/**
 * Test LSP completion functionality
 */

const net = require('net');
const readline = require('readline');

// LSP message helpers
function createMessage(content) {
  const json = JSON.stringify(content);
  const contentLength = Buffer.byteLength(json, 'utf8');
  return `Content-Length: ${contentLength}\r\n\r\n${json}`;
}

// Connect to LSP server via stdin/stdout simulation
const { spawn } = require('child_process');
const server = spawn('node', ['dist/server.js', '--stdio'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let responseBuffer = '';
let expectedLength = 0;

// Parse LSP responses
server.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  
  while (true) {
    if (expectedLength === 0) {
      // Look for Content-Length header
      const match = responseBuffer.match(/Content-Length: (\d+)\r\n\r\n/);
      if (!match) break;
      
      expectedLength = parseInt(match[1]);
      responseBuffer = responseBuffer.substring(match.index + match[0].length);
    }
    
    if (responseBuffer.length >= expectedLength) {
      const message = responseBuffer.substring(0, expectedLength);
      responseBuffer = responseBuffer.substring(expectedLength);
      expectedLength = 0;
      
      const response = JSON.parse(message);
      console.log('Response:', JSON.stringify(response, null, 2));
      
      // Check if this is the completion response
      if (response.id === 3 && response.result) {
        console.log('\n✅ Completion test passed!');
        console.log('Suggestions received:', response.result.map(item => item.label));
        process.exit(0);
      }
    } else {
      break;
    }
  }
});

// Send test messages
async function runTest() {
  console.log('Testing LSP completion...\n');
  
  // 1. Initialize
  server.stdin.write(createMessage({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      rootUri: null,
      capabilities: {}
    }
  }));
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 2. Open document
  const testDoc = 'Parameter loon: ';
  server.stdin.write(createMessage({
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///test.regelspraak',
        languageId: 'regelspraak',
        version: 1,
        text: testDoc
      }
    }
  }));
  
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // 3. Request completion at end of line
  server.stdin.write(createMessage({
    jsonrpc: '2.0',
    id: 3,
    method: 'textDocument/completion',
    params: {
      textDocument: {
        uri: 'file:///test.regelspraak'
      },
      position: {
        line: 0,
        character: testDoc.length
      }
    }
  }));
  
  // Wait for response
  setTimeout(() => {
    console.log('❌ Test timeout - no completion response received');
    process.exit(1);
  }, 5000);
}

runTest().catch(console.error);