// Simple test that sends LSP messages to the server
const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, '../dist/server.js');
const server = spawn('node', [serverPath, '--stdio']);

let response = '';

server.stdout.on('data', (data) => {
  response += data.toString();
  // Look for complete messages
  const lines = response.split('\r\n');
  for (const line of lines) {
    if (line.includes('Content-Length:') || line.includes('method') || line.includes('diagnostics')) {
      console.log('Server response:', line);
    }
  }
});

server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

// Send initialize
const initMsg = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    rootUri: null,
    capabilities: {}
  }
};

function sendMessage(msg) {
  const content = JSON.stringify(msg);
  const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
  server.stdin.write(header + content);
}

// Send messages
console.log('Sending initialize...');
sendMessage(initMsg);

setTimeout(() => {
  console.log('\nSending document with error...');
  sendMessage({
    jsonrpc: "2.0",
    method: "textDocument/didOpen",
    params: {
      textDocument: {
        uri: "file:///test.regelspraak",
        languageId: "regelspraak",
        version: 1,
        text: "invalid syntax here"
      }
    }
  });
}, 1000);

setTimeout(() => {
  console.log('\nSending valid document...');
  sendMessage({
    jsonrpc: "2.0",
    method: "textDocument/didOpen",
    params: {
      textDocument: {
        uri: "file:///test2.regelspraak",
        languageId: "regelspraak",
        version: 1,
        text: "Parameter loon: Bedrag;"
      }
    }
  });
}, 2000);

setTimeout(() => {
  server.kill();
  console.log('\nTest complete.');
}, 3000);