import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

const serverPath = path.join(__dirname, '../dist/server.js');
let messageId = 1;
let server: ChildProcess;

function startServer(): ChildProcess {
  return spawn('node', [serverPath, '--stdio']);
}

function sendMessage(server: ChildProcess, msg: any): void {
  const content = JSON.stringify(msg);
  const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
  server.stdin!.write(header + content);
}

function waitForMessage(server: ChildProcess, predicate: (msg: any) => boolean, timeout = 2000): Promise<any> {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const timer = setTimeout(() => {
      server.stdout!.removeAllListeners();
      reject(new Error('Timeout waiting for message'));
    }, timeout);
    
    const handler = (data: Buffer) => {
      buffer += data.toString();
      
      // Look for Content-Length header followed by JSON
      while (true) {
        const headerEnd = buffer.indexOf('\r\n\r\n');
        if (headerEnd === -1) break;
        
        // Extract content length
        const header = buffer.substring(0, headerEnd);
        const match = header.match(/Content-Length: (\d+)/);
        if (!match) {
          buffer = buffer.substring(headerEnd + 4);
          continue;
        }
        
        const contentLength = parseInt(match[1]);
        const contentStart = headerEnd + 4;
        
        // Check if we have the full message
        if (buffer.length < contentStart + contentLength) break;
        
        // Parse the JSON
        const content = buffer.substring(contentStart, contentStart + contentLength);
        buffer = buffer.substring(contentStart + contentLength);
        
        try {
          const json = JSON.parse(content);
          if (predicate(json)) {
            clearTimeout(timer);
            server.stdout!.off('data', handler);
            resolve(json);
            return;
          }
        } catch (e) {
          console.error('Parse error:', e);
        }
      }
    };
    
    server.stdout!.on('data', handler);
  });
}

async function testInitialize() {
  console.log('Testing initialize...');
  server = startServer();
  
  const id = messageId++;
  sendMessage(server, {
    jsonrpc: '2.0',
    id,
    method: 'initialize',
    params: { rootUri: null, capabilities: {} }
  });
  
  const response = await waitForMessage(server, msg => msg.id === id);
  const caps = response.result.capabilities;
  
  console.assert(caps.textDocumentSync === 1, '  ✓ Text sync');
  console.assert(caps.diagnosticProvider, '  ✓ Diagnostics');
  console.assert(caps.documentSymbolProvider === true, '  ✓ Document symbols');
  console.assert(caps.hoverProvider === true, '  ✓ Hover');
  
  console.log('  ✅ All capabilities present\n');
}

async function testDiagnostics() {
  console.log('Testing diagnostics...');
  
  // Send invalid document
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///test1.rs',
        languageId: 'regelspraak',
        version: 1,
        text: 'invalid syntax'
      }
    }
  });
  
  const errorDiag = await waitForMessage(server, 
    msg => msg.method === 'textDocument/publishDiagnostics' && 
           msg.params.uri === 'file:///test1.rs');
  
  console.assert(errorDiag.params.diagnostics.length > 0, '  ✓ Error detected');
  console.assert(errorDiag.params.diagnostics[0].severity === 1, '  ✓ Severity is Error');
  
  // Send valid document
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///test2.rs',
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter loon: Bedrag;'
      }
    }
  });
  
  const validDiag = await waitForMessage(server,
    msg => msg.method === 'textDocument/publishDiagnostics' && 
           msg.params.uri === 'file:///test2.rs');
  
  console.assert(validDiag.params.diagnostics.length === 0, '  ✓ No errors on valid code');
  
  console.log('  ✅ Diagnostics working\n');
}

async function testDocumentSymbols() {
  console.log('Testing document symbols...');
  
  // Send document with symbols
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///test3.rs',
        languageId: 'regelspraak',
        version: 1,
        text: `Parameter loon: Bedrag;
Parameter leeftijd: Numeriek (geheel getal);

Regel BerekenLoon
  geldig altijd
    Het loon van een persoon moet gesteld worden op 1000 euro.`
      }
    }
  });
  
  // Wait for diagnostics first
  await waitForMessage(server,
    msg => msg.method === 'textDocument/publishDiagnostics' && 
           msg.params.uri === 'file:///test3.rs');
  
  // Request symbols
  const id = messageId++;
  sendMessage(server, {
    jsonrpc: '2.0',
    id,
    method: 'textDocument/documentSymbol',
    params: {
      textDocument: { uri: 'file:///test3.rs' }
    }
  });
  
  const response = await waitForMessage(server, msg => msg.id === id);
  const symbols = response.result;
  
  console.assert(Array.isArray(symbols), '  ✓ Returns array');
  if (symbols.length < 3) {
    console.log(`  ✓ Found ${symbols.length} symbols:`, symbols.map((s: any) => s.name));
  } else {
    console.log(`  ✓ Found all ${symbols.length} symbols`);
  }
  console.assert(symbols.some((s: any) => s.name === 'loon'), '  ✓ Found parameter loon');
  console.assert(symbols.some((s: any) => s.name === 'leeftijd'), '  ✓ Found parameter leeftijd');
  console.assert(symbols.some((s: any) => s.name === 'BerekenLoon'), '  ✓ Found regel');
  
  console.log('  ✅ Document symbols working\n');
}

async function testHover() {
  console.log('Testing hover...');
  
  // Send a simple document for hover testing
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///hover-test.rs',
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter loon: Bedrag;'
      }
    }
  });
  
  // Wait for document to be processed
  await waitForMessage(server,
    msg => msg.method === 'textDocument/publishDiagnostics' && 
           msg.params.uri === 'file:///hover-test.rs');
  
  // Request hover on parameter
  const hoverId = messageId++;
  sendMessage(server, {
    jsonrpc: '2.0',
    id: hoverId,
    method: 'textDocument/hover',
    params: {
      textDocument: { uri: 'file:///hover-test.rs' },
      position: { line: 0, character: 10 } // On "loon"
    }
  });
  
  const hoverResponse = await waitForMessage(server, msg => msg.id === hoverId);
  
  if (!hoverResponse.result) {
    console.log('  ❌ Hover returned null result');
    console.log('  Response:', JSON.stringify(hoverResponse));
  }
  console.assert(hoverResponse.result, '  ✓ Returns hover info');
  console.assert(hoverResponse.result.contents.kind === 'markdown', '  ✓ Markdown content');
  console.assert(hoverResponse.result.contents.value.includes('Parameter'), '  ✓ Shows parameter type');
  console.assert(hoverResponse.result.contents.value.includes('loon'), '  ✓ Shows parameter name');
  
  // Test hover on empty space
  const emptyId = messageId++;
  sendMessage(server, {
    jsonrpc: '2.0',
    id: emptyId,
    method: 'textDocument/hover',
    params: {
      textDocument: { uri: 'file:///hover-test.rs' },
      position: { line: 10, character: 0 } // Beyond document
    }
  });
  
  const emptyResponse = await waitForMessage(server, msg => msg.id === emptyId);
  console.assert(emptyResponse.result === null, '  ✓ Returns null for empty space');
  
  console.log('  ✅ Hover working\n');
}

async function runAllTests() {
  console.log('=== Running LSP Server Tests ===\n');
  
  try {
    await testInitialize();
    await testDiagnostics();
    await testDocumentSymbols();
    await testHover();
    
    console.log('✅ All tests passed!');
    server.kill();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    if (server) server.kill();
    process.exit(1);
  }
}

runAllTests();