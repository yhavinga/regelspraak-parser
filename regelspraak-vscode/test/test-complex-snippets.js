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
  console.log('Testing complex snippets...\n');
  
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
  
  // Test snippets
  const uri = 'file:///test.regelspraak';
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri,
        languageId: 'regelspraak',
        version: 1,
        text: ''
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Request completions at beginning of document
  sendMessage(server, {
    jsonrpc: '2.0',
    id: messageId++,
    method: 'textDocument/completion',
    params: {
      textDocument: { uri },
      position: { line: 0, character: 0 }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Parse response
  const response = extractResponse(buffer);
  
  if (response && response.result) {
    console.log('Response received with', response.result.length, 'items');
    
    // Debug: show kinds
    const kinds = response.result.map(item => ({ label: item.label, kind: item.kind }));
    console.log('Item kinds:', kinds.slice(0, 5));
    
    const snippets = response.result.filter(item => item.kind === 15); // Snippet kind
    
    // Check for new complex snippets
    const expectedSnippets = [
      'Regel met conditie',
      'Beslistabel complex',
      'Tijdlijn expressie',
      'Aggregatiefunctie',
      'Objecttype met relatie',
      'Verdeling regel',
      'Recursieve regel',
      'Subselectie',
      'Samengesteld predicaat',
      'Datum berekening'
    ];
    
    console.log(`Found ${snippets.length} snippets total\n`);
    
    for (const expected of expectedSnippets) {
      const found = snippets.find(s => s.label === expected);
      if (found) {
        console.log(`✓ ${expected}`);
        results.push(true);
      } else {
        console.log(`✗ ${expected} - NOT FOUND`);
        results.push(false);
      }
    }
    
    // Show a sample snippet
    const regelCond = snippets.find(s => s.label === 'Regel met conditie');
    if (regelCond) {
      console.log('\nSample snippet content:');
      console.log('Label:', regelCond.label);
      console.log('Documentation:', regelCond.documentation);
      console.log('Insert text preview:', regelCond.insertText.substring(0, 100) + '...');
    }
  } else {
    console.log('✗ No completion response received');
  }
  
  // Clean up
  server.kill();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  const passed = results.filter(r => r).length;
  const total = results.length;
  console.log(`Tests: ${passed}/${total} passed`);
  
  if (passed === total) {
    console.log('✓ All complex snippets found!');
    process.exit(0);
  } else {
    console.log('✗ Some snippets missing');
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