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
  console.log('Testing new Code Actions...\n');
  
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
  
  // Test 1: Minus sign
  console.log('Test 1: Replace "-" with "min"');
  const uri1 = 'file:///test1.regelspraak';
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: uri1,
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter salaris: Bedrag;\nParameter belasting: Bedrag;\nRegel BerekenNetto\n  geldig altijd\n    Het netto wordt salaris - belasting.'
      }
    }
  });
  
  // Wait for diagnostics
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Request code actions
  sendMessage(server, {
    jsonrpc: '2.0',
    id: messageId++,
    method: 'textDocument/codeAction',
    params: {
      textDocument: { uri: uri1 },
      range: {
        start: { line: 4, character: 28 },
        end: { line: 4, character: 29 }
      },
      context: {
        diagnostics: [{
          range: {
            start: { line: 4, character: 28 },
            end: { line: 4, character: 29 }
          },
          message: 'no viable alternative at input "-"',
          severity: 1
        }]
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Parse response
  const response1 = extractResponse(buffer);
  if (response1 && response1.result) {
    const minusAction = response1.result.find(a => a.title === 'Replace "-" with "min"');
    if (minusAction) {
      console.log('✓ Code Action found for minus sign');
      results.push(true);
    } else {
      console.log('✗ Code Action NOT found for minus sign');
      console.log('Available actions:', response1.result.map(a => a.title));
      results.push(false);
    }
  } else {
    console.log('✗ No response for minus sign test');
    results.push(false);
  }
  
  // Clear buffer for next test
  buffer = '';
  
  // Test 2: Division sign
  console.log('\nTest 2: Replace "/" with "gedeeld door"');
  const uri2 = 'file:///test2.regelspraak';
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: uri2,
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter totaal: Bedrag;\nParameter aantal: Aantal;\nRegel BerekenGemiddelde\n  geldig altijd\n    Het gemiddelde wordt totaal / aantal.'
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  sendMessage(server, {
    jsonrpc: '2.0',
    id: messageId++,
    method: 'textDocument/codeAction',
    params: {
      textDocument: { uri: uri2 },
      range: {
        start: { line: 4, character: 32 },
        end: { line: 4, character: 33 }
      },
      context: {
        diagnostics: [{
          range: {
            start: { line: 4, character: 32 },
            end: { line: 4, character: 33 }
          },
          message: 'no viable alternative at input "/"',
          severity: 1
        }]
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const response2 = extractResponse(buffer);
  if (response2 && response2.result) {
    const divAction = response2.result.find(a => a.title === 'Replace "/" with "gedeeld door"');
    if (divAction) {
      console.log('✓ Code Action found for division sign');
      results.push(true);
    } else {
      console.log('✗ Code Action NOT found for division sign');
      console.log('Available actions:', response2.result.map(a => a.title));
      results.push(false);
    }
  } else {
    console.log('✗ No response for division sign test');
    results.push(false);
  }
  
  buffer = '';
  
  // Test 3: "if" instead of "indien"
  console.log('\nTest 3: Replace "if" with "indien"');
  const uri3 = 'file:///test3.regelspraak';
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: uri3,
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter leeftijd: Aantal;\nRegel CheckVolwassen\n  geldig if leeftijd >= 18\n    Het resultaat wordt waar.'
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  sendMessage(server, {
    jsonrpc: '2.0',
    id: messageId++,
    method: 'textDocument/codeAction',
    params: {
      textDocument: { uri: uri3 },
      range: {
        start: { line: 2, character: 9 },
        end: { line: 2, character: 11 }
      },
      context: {
        diagnostics: [{
          range: {
            start: { line: 2, character: 9 },
            end: { line: 2, character: 11 }
          },
          message: 'no viable alternative at input "if"',
          severity: 1
        }]
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const response3 = extractResponse(buffer);
  if (response3 && response3.result) {
    const ifAction = response3.result.find(a => a.title === 'Replace "if" with "indien"');
    if (ifAction) {
      console.log('✓ Code Action found for "if"');
      results.push(true);
    } else {
      console.log('✗ Code Action NOT found for "if"');
      console.log('Available actions:', response3.result.map(a => a.title));
      results.push(false);
    }
  } else {
    console.log('✗ No response for "if" test');
    results.push(false);
  }
  
  buffer = '';
  
  // Test 4: "Rule" instead of "Regel"
  console.log('\nTest 4: Replace "Rule" with "Regel"');
  const uri4 = 'file:///test4.regelspraak';
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: uri4,
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter salaris: Bedrag;\nRule CalculateBonus\n  geldig altijd\n    Het resultaat wordt 100.'
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  sendMessage(server, {
    jsonrpc: '2.0',
    id: messageId++,
    method: 'textDocument/codeAction',
    params: {
      textDocument: { uri: uri4 },
      range: {
        start: { line: 1, character: 0 },
        end: { line: 1, character: 4 }
      },
      context: {
        diagnostics: [{
          range: {
            start: { line: 1, character: 0 },
            end: { line: 1, character: 4 }
          },
          message: 'extraneous input \'Rule\'',
          severity: 1
        }]
      }
    }
  });
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const response4 = extractResponse(buffer);
  if (response4 && response4.result) {
    const ruleAction = response4.result.find(a => a.title === 'Replace "Rule" with "Regel"');
    if (ruleAction) {
      console.log('✓ Code Action found for "Rule"');
      results.push(true);
    } else {
      console.log('✗ Code Action NOT found for "Rule"');
      console.log('Available actions:', response4.result.map(a => a.title));
      results.push(false);
    }
  } else {
    console.log('✗ No response for "Rule" test');
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
    console.log('✓ All tests passed!');
    process.exit(0);
  } else {
    console.log('✗ Some tests failed');
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
        // Try to find complete JSON
        const match = buffer.match(/Content-Length: \d+\r?\n\r?\n(\{.*?\})\s*$/s);
        if (match) {
          try {
            return JSON.parse(match[1]);
          } catch (e2) {
            // Continue searching
          }
        }
      }
    }
  }
  return null;
}

// Run tests
runTests().catch(console.error);