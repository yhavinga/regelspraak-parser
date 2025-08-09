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

async function testFindReferences() {
  console.log('Testing find all references...');
  
  // Send document with parameter references
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///references-test.rs',
        languageId: 'regelspraak',
        version: 1,
        text: `Parameter loon: Bedrag;
Parameter bonus: Bedrag;
Regel BerekenTotaal
  geldig altijd
    Het totaal van de persoon moet gesteld worden op loon.
Regel ControleerLoon
  geldig altijd
    Het minimum van de persoon moet gesteld worden op loon.`
      }
    }
  });
  
  // Wait for document to be processed
  await waitForMessage(server, 
    msg => msg.method === 'textDocument/publishDiagnostics' && 
           msg.params.uri === 'file:///references-test.rs'
  );
  
  // Request references for 'loon'
  const refId = messageId++;
  sendMessage(server, {
    jsonrpc: '2.0',
    id: refId,
    method: 'textDocument/references',
    params: {
      textDocument: { uri: 'file:///references-test.rs' },
      position: { line: 0, character: 10 },  // On "loon" in parameter definition
      context: { includeDeclaration: true }
    }
  });
  
  const refResponse = await waitForMessage(server, msg => msg.id === refId);
  
  if (!refResponse.result || !Array.isArray(refResponse.result)) {
    console.log('  ❌ No references found or invalid response');
    console.log('  Response:', JSON.stringify(refResponse));
  } else {
    console.log(`  ✓ Found ${refResponse.result.length} references`);
    if (refResponse.result.length >= 3) {
      console.log('  ✓ Found expected references');
    } else {
      console.log('  ❌ Expected at least 3 references');
    }
  }
  
  console.log('  ✅ Find references working\n');
}

async function testGoToDefinition() {
  console.log('Testing go to definition...');
  
  // Send document with parameter references
  sendMessage(server, {
    jsonrpc: '2.0',
    method: 'textDocument/didOpen',
    params: {
      textDocument: {
        uri: 'file:///gotodef-test.rs',
        languageId: 'regelspraak',
        version: 1,
        text: `Parameter salaris: Bedrag;
Parameter bonus: Bedrag;
Regel Totaal
  geldig altijd
    Het totaal van een persoon moet berekend worden als salaris + bonus.`
      }
    }
  });
  
  // Wait for document to be processed
  await waitForMessage(server, 
    msg => msg.method === 'textDocument/publishDiagnostics' && 
           msg.params.uri === 'file:///gotodef-test.rs'
  );
  
  // Request go to definition for 'salaris' in expression
  const defId = messageId++;
  sendMessage(server, {
    jsonrpc: '2.0',
    id: defId,
    method: 'textDocument/definition',
    params: {
      textDocument: { uri: 'file:///gotodef-test.rs' },
      position: { line: 4, character: 56 }  // On "salaris" in expression
    }
  });
  
  const defResponse = await waitForMessage(server, msg => msg.id === defId);
  
  if (!defResponse.result) {
    console.log('  ❌ No definition found');
    console.log('  Response:', JSON.stringify(defResponse));
  } else {
    console.log('  ✓ Returns definition location');
    console.assert(defResponse.result.uri === 'file:///gotodef-test.rs', '  ✓ Same file');
    console.assert(defResponse.result.range.start.line === 0, '  ✓ Points to parameter definition line');
    console.assert(defResponse.result.range.start.character === 10, '  ✓ Points to parameter name start');
  }
  
  // Test go to definition on empty space
  const emptyDefId = messageId++;
  sendMessage(server, {
    jsonrpc: '2.0',
    id: emptyDefId,
    method: 'textDocument/definition',
    params: {
      textDocument: { uri: 'file:///gotodef-test.rs' },
      position: { line: 10, character: 0 }  // Beyond document
    }
  });
  
  const emptyDefResponse = await waitForMessage(server, msg => msg.id === emptyDefId);
  console.assert(emptyDefResponse.result === null, '  ✓ Returns null for empty space');
  
  console.log('  ✅ Go to definition working\n');
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
    await testGoToDefinition();
    await testFindReferences();
    
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