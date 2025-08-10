#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Helper to send LSP messages
function sendMessage(proc, message) {
  const content = JSON.stringify(message);
  const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
  proc.stdin.write(header + content);
}

// Test runner
async function runTests() {
  console.log('Testing basic formatting...\n');
  
  // Start the server with --stdio flag
  const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
  const server = spawn('node', [serverPath, '--stdio'], {
    stdio: ['pipe', 'pipe', 'pipe'] // Capture stderr
  });
  
  let stdout = '';
  let stderr = '';
  let messageId = 1;
  
  server.stdout.on('data', (data) => {
    stdout += data.toString();
  });
  
  server.stderr.on('data', (data) => {
    stderr += data.toString();
    console.error('STDERR:', data.toString());
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Initialize
  sendMessage(server, {
    jsonrpc: '2.0',
    id: messageId++,
    method: 'initialize',
    params: {
      processId: process.pid,
      capabilities: {},
      rootUri: null
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'initialized',
    params: {}
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Test with a rule
  console.log('Test: Format simple rule');
  const uri = 'file:///test.regelspraak';
  const code = `Parameter salaris: Bedrag;
Parameter bonus: Bedrag;
Regel BerekenTotaal
  geldig altijd
    Het totaal wordt salaris plus bonus;`;
  
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri,
        languageId: 'regelspraak',
        version: 1,
        text: code
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Request formatting
  console.log('Sending format request...');
  sendMessage(server, {
    jsonrpc: '2.0',
    id: messageId++,
    method: 'textDocument/formatting',
    params: {
      textDocument: { uri },
      options: {
        tabSize: 2,
        insertSpaces: true
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check response
  console.log('\nSTDOUT buffer length:', stdout.length);
  console.log('STDERR buffer length:', stderr.length);
  
  // Try to find the response
  const lines = stdout.split('\n');
  let foundFormat = false;
  for (const line of lines) {
    if (line.includes('"id":2')) {  // Our formatting request
      console.log('Format response:', line);
      foundFormat = true;
      try {
        const json = JSON.parse(line);
        if (json.result) {
          if (Array.isArray(json.result) && json.result.length > 0) {
            console.log('✓ Formatted text received');
            const formatted = json.result[0].newText;
            console.log('---');
            console.log(formatted);
            console.log('---');
          } else if (Array.isArray(json.result) && json.result.length === 0) {
            console.log('✗ Empty result array - formatting failed or no changes needed');
          } else {
            console.log('Result:', json.result);
          }
        }
      } catch (e) {
        console.log('Parse error:', e.message);
      }
    }
  }
  
  if (!foundFormat) {
    console.log('No format response found');
    console.log('Last few lines:', lines.slice(-5));
  }
  
  // Clean up
  server.kill();
}

// Run tests
runTests().catch(console.error);