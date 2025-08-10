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
  console.log('Testing Format Document for rules...\n');
  
  // Start the server with --stdio flag
  const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
  const server = spawn('node', [serverPath, '--stdio'], {
    stdio: ['pipe', 'pipe', 'inherit']
  });
  
  let buffer = '';
  let messageId = 1;
  const results = [];
  
  server.stdout.on('data', (data) => {
    buffer += data.toString();
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
  
  // Test 1: Simple rule formatting
  console.log('Test 1: Format simple rule');
  const uri1 = 'file:///test1.regelspraak';
  const unformatted1 = `Parameter salaris:Bedrag;
Parameter bonus:   Bedrag;
Regel   BerekenTotaal
geldig   altijd
Het totaal   wordt salaris plus   bonus;`;
  
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: uri1,
        languageId: 'regelspraak',
        version: 1,
        text: unformatted1
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Request formatting
  sendMessage(server, {
    jsonrpc: '2.0',
    id: messageId++,
    method: 'textDocument/formatting',
    params: {
      textDocument: { uri: uri1 },
      options: {
        tabSize: 2,
        insertSpaces: true
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Parse response
  const response1 = extractResponse(buffer);
  if (response1 && response1.result && response1.result.length > 0) {
    const formatted = response1.result[0].newText;
    console.log('✓ Rule formatted');
    console.log('Formatted output:');
    console.log('---');
    console.log(formatted);
    console.log('---');
    
    // Check if it contains formatted rule
    if (formatted.includes('Regel BerekenTotaal') && 
        formatted.includes('geldig altijd') &&
        formatted.includes('wordt')) {
      console.log('✓ Rule structure preserved');
      results.push(true);
    } else {
      console.log('✗ Rule structure not properly formatted');
      results.push(false);
    }
  } else {
    console.log('✗ No formatting response');
    results.push(false);
  }
  
  buffer = '';
  
  // Test 2: Rule with conditional validity
  console.log('\nTest 2: Format rule with condition');
  const uri2 = 'file:///test2.regelspraak';
  const unformatted2 = `Parameter leeftijd: Aantal;
Parameter korting: Percentage;
Regel BepaalKorting
geldig indien leeftijd >= 65
De korting wordt 10;`;
  
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: uri2,
        languageId: 'regelspraak',
        version: 1,
        text: unformatted2
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  sendMessage(server, {
    jsonrpc: '2.0',
    id: messageId++,
    method: 'textDocument/formatting',
    params: {
      textDocument: { uri: uri2 },
      options: {
        tabSize: 2,
        insertSpaces: true
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const response2 = extractResponse(buffer);
  if (response2 && response2.result && response2.result.length > 0) {
    const formatted = response2.result[0].newText;
    console.log('✓ Conditional rule formatted');
    console.log('Formatted output:');
    console.log('---');
    console.log(formatted);
    console.log('---');
    
    if (formatted.includes('geldig indien')) {
      console.log('✓ Conditional validity preserved');
      results.push(true);
    } else {
      console.log('✗ Conditional validity not formatted correctly');
      results.push(false);
    }
  } else {
    console.log('✗ No formatting response for conditional rule');
    results.push(false);
  }
  
  // Clean up
  server.kill();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  const passed = results.filter(r => r).length;
  const total = results.length;
  console.log(`Tests: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('✓ All formatting tests passed!');
    process.exit(0);
  } else {
    console.log('✗ Some formatting tests failed');
    process.exit(1);
  }
}

// Extract JSON-RPC response from buffer
function extractResponse(buffer) {
  const lines = buffer.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (line.startsWith('{') && line.includes('"jsonrpc"')) {
      try {
        return JSON.parse(line);
      } catch (e) {
        // Continue searching
      }
    }
  }
  return null;
}

// Run tests
runTests().catch(console.error);