import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

let messageId = 1; // Global counter for message IDs

describe('LSP Integration Tests', () => {
  let server: ChildProcess;
  
  beforeAll(async () => {
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    server = spawn('node', [serverPath, '--stdio'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Initialize server
    await sendRequest(server, 'initialize', {
      processId: process.pid,
      capabilities: {},
      rootUri: null
    });
    
    await sendNotification(server, 'initialized', {});
  });
  
  afterAll(() => {
    if (server) {
      server.kill();
    }
  });
  
  describe('Diagnostics', () => {
    it('should report syntax errors', async () => {
      const uri = 'file:///test-syntax.regelspraak';
      
      // Send document with syntax error
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: 'Parameter salaris is een Bedrag;' // Should use colon
        }
      });
      
      // Wait for diagnostics
      const diagnostics = await waitForDiagnostics(server, uri);
      
      expect(diagnostics).toBeDefined();
      expect(diagnostics.length).toBeGreaterThan(0);
      expect(diagnostics[0].message).toContain('Parameters use colon syntax');
    });
    
    it('should clear diagnostics when errors are fixed', async () => {
      const uri = 'file:///test-fix.regelspraak';
      
      // Send document with error
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: 'Parameter salaris is een Bedrag;'
        }
      });
      
      // Wait for initial diagnostics
      let diagnostics = await waitForDiagnostics(server, uri);
      expect(diagnostics.length).toBeGreaterThan(0);
      
      // Fix the error
      await sendNotification(server, 'textDocument/didChange', {
        textDocument: { uri, version: 2 },
        contentChanges: [{
          text: 'Parameter salaris: Bedrag;'
        }]
      });
      
      // Wait for updated diagnostics
      diagnostics = await waitForDiagnostics(server, uri);
      expect(diagnostics.length).toBe(0);
    });
  });
  
  describe('Document Symbols', () => {
    it('should provide document symbols', async () => {
      const uri = 'file:///test-symbols.regelspraak';
      
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: `Parameter salaris: Bedrag;
Parameter bonus: Bedrag;
Regel BerekenTotaal
  geldig altijd
    Het totaal wordt salaris plus bonus;`
        }
      });
      
      const symbols = await sendRequest(server, 'textDocument/documentSymbol', {
        textDocument: { uri }
      });
      
      expect(symbols).toBeDefined();
      expect(Array.isArray(symbols)).toBe(true);
      
      const paramSymbols = symbols.filter((s: any) => s.kind === 13); // Variable
      expect(paramSymbols.length).toBe(2);
      expect(paramSymbols.map((s: any) => s.name)).toContain('salaris');
      expect(paramSymbols.map((s: any) => s.name)).toContain('bonus');
      
      const ruleSymbols = symbols.filter((s: any) => s.kind === 12); // Function
      expect(ruleSymbols.length).toBe(1);
      expect(ruleSymbols[0].name).toBe('BerekenTotaal');
    });
  });
  
  describe('Hover', () => {
    it('should provide hover information for parameters', async () => {
      const uri = 'file:///test-hover.regelspraak';
      
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: 'Parameter salaris: Bedrag;'
        }
      });
      
      const hover = await sendRequest(server, 'textDocument/hover', {
        textDocument: { uri },
        position: { line: 0, character: 10 } // On "salaris"
      });
      
      expect(hover).toBeDefined();
      expect(hover.contents).toBeDefined();
      expect(hover.contents.value).toContain('Bedrag');
    });
  });
  
  describe('Completion', () => {
    it('should provide completions including snippets', async () => {
      const uri = 'file:///test-completion.regelspraak';
      
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: 'param'
        }
      });
      
      const completions = await sendRequest(server, 'textDocument/completion', {
        textDocument: { uri },
        position: { line: 0, character: 5 }
      });
      
      expect(completions).toBeDefined();
      expect(Array.isArray(completions)).toBe(true);
      
      // Should include Parameter snippet
      const paramSnippet = completions.find((c: any) => 
        c.label === 'Parameter' && c.kind === 15 // Snippet
      );
      expect(paramSnippet).toBeDefined();
    });
    
    it('should suggest defined parameters in context', async () => {
      const uri = 'file:///test-param-completion.regelspraak';
      
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: `Parameter salaris: Bedrag;
Parameter bonus: Bedrag;
Regel Test
  geldig altijd
    Het totaal wordt sal`
        }
      });
      
      const completions = await sendRequest(server, 'textDocument/completion', {
        textDocument: { uri },
        position: { line: 4, character: 24 }
      });
      
      const salarisSuggestion = completions.find((c: any) => c.label === 'salaris');
      expect(salarisSuggestion).toBeDefined();
    });
  });
  
  describe('Go to Definition', () => {
    it('should navigate to parameter definition', async () => {
      const uri = 'file:///test-definition.regelspraak';
      
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: `Parameter salaris: Bedrag;
Regel Test
  geldig altijd
    Het totaal wordt salaris plus 100;`
        }
      });
      
      const definition = await sendRequest(server, 'textDocument/definition', {
        textDocument: { uri },
        position: { line: 3, character: 21 } // On "salaris" in regel
      });
      
      expect(definition).toBeDefined();
      if (Array.isArray(definition) && definition.length > 0) {
        expect(definition[0].range.start.line).toBe(0);
      } else if (definition && !Array.isArray(definition)) {
        expect(definition.range.start.line).toBe(0);
      }
    });
  });
  
  describe('Find References', () => {
    it('should find all references to a parameter', async () => {
      const uri = 'file:///test-references.regelspraak';
      
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: `Parameter salaris: Bedrag;
Regel Test1
  geldig altijd
    Het totaal wordt salaris plus 100;
Regel Test2
  geldig altijd
    Het dubbel wordt salaris maal 2;`
        }
      });
      
      const references = await sendRequest(server, 'textDocument/references', {
        textDocument: { uri },
        position: { line: 0, character: 10 }, // On "salaris" definition
        context: { includeDeclaration: true }
      });
      
      expect(references).toBeDefined();
      expect(Array.isArray(references)).toBe(true);
      expect(references.length).toBe(3); // Definition + 2 uses
    });
  });
  
  describe('Code Actions', () => {
    it('should offer to fix "is een" to colon', async () => {
      const uri = 'file:///test-codeaction.regelspraak';
      
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: 'Parameter salaris is een Bedrag;'
        }
      });
      
      // Wait for diagnostics first
      const diagnostics = await waitForDiagnostics(server, uri);
      
      const actions = await sendRequest(server, 'textDocument/codeAction', {
        textDocument: { uri },
        range: {
          start: { line: 0, character: 18 },
          end: { line: 0, character: 24 }
        },
        context: { diagnostics }
      });
      
      expect(actions).toBeDefined();
      expect(Array.isArray(actions)).toBe(true);
      
      const fixAction = actions.find((a: any) => 
        a.title === 'Replace "is een" with ":"'
      );
      expect(fixAction).toBeDefined();
      expect(fixAction.edit).toBeDefined();
    });
    
    it('should offer to replace minus sign with "min"', async () => {
      const uri = 'file:///test-minus-action.regelspraak';
      
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: `Parameter a: Bedrag;
Parameter b: Bedrag;
Regel Test
  geldig altijd
    Het verschil wordt a - b;`
        }
      });
      
      const diagnostics = await waitForDiagnostics(server, uri);
      
      const actions = await sendRequest(server, 'textDocument/codeAction', {
        textDocument: { uri },
        range: {
          start: { line: 4, character: 25 },
          end: { line: 4, character: 26 }
        },
        context: { diagnostics }
      });
      
      const minusAction = actions.find((a: any) => 
        a.title === 'Replace "-" with "min"'
      );
      expect(minusAction).toBeDefined();
    });
  });
  
  describe('Format Document', () => {
    it('should format parameters with alignment', async () => {
      const uri = 'file:///test-format.regelspraak';
      
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: `Parameter salaris:Bedrag;
Parameter   bonus:   Bedrag;`
        }
      });
      
      const edits = await sendRequest(server, 'textDocument/formatting', {
        textDocument: { uri },
        options: { tabSize: 2, insertSpaces: true }
      });
      
      expect(edits).toBeDefined();
      expect(Array.isArray(edits)).toBe(true);
      expect(edits.length).toBe(1);
      
      const formatted = edits[0].newText;
      expect(formatted).toContain('Parameter salaris: Bedrag;');
      expect(formatted).toContain('Parameter bonus  : Bedrag;');
    });
    
    it('should format rules with proper indentation', async () => {
      const uri = 'file:///test-format-rules.regelspraak';
      
      await sendNotification(server, 'textDocument/didOpen', {
        textDocument: {
          uri,
          languageId: 'regelspraak',
          version: 1,
          text: `Regel Test
geldig altijd
Het resultaat wordt 42;`
        }
      });
      
      const edits = await sendRequest(server, 'textDocument/formatting', {
        textDocument: { uri },
        options: { tabSize: 2, insertSpaces: true }
      });
      
      expect(edits).toBeDefined();
      const formatted = edits[0].newText;
      expect(formatted).toContain('Regel Test');
      expect(formatted).toContain('  geldig altijd');
      expect(formatted).toMatch(/\s{4}Het resultaat/); // 4 spaces indent
    });
  });
});

// Helper functions
async function sendRequest(server: ChildProcess, method: string, params: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const id = messageId++;
    const message = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };
    
    const content = JSON.stringify(message);
    const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
    
    server.stdin!.write(header + content);
    
    let buffer = '';
    const handler = (data: Buffer) => {
      buffer += data.toString();
      
      // Try to parse response
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (line.includes(`"id":${id}`)) {
          try {
            const response = JSON.parse(line);
            server.stdout!.off('data', handler);
            resolve(response.result);
            return;
          } catch (e) {
            // Continue looking
          }
        }
      }
    };
    
    server.stdout!.on('data', handler);
    
    // Timeout after 2 seconds
    setTimeout(() => {
      server.stdout!.off('data', handler);
      reject(new Error(`Timeout waiting for response to ${method}`));
    }, 2000);
  });
}

async function sendNotification(server: ChildProcess, method: string, params: any): Promise<void> {
  const message = {
    jsonrpc: '2.0',
    method,
    params
  };
  
  const content = JSON.stringify(message);
  const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
  
  server.stdin!.write(header + content);
  
  // Give server time to process
  await new Promise(resolve => setTimeout(resolve, 100));
}

async function waitForDiagnostics(server: ChildProcess, uri: string): Promise<any[]> {
  return new Promise((resolve) => {
    let buffer = '';
    const handler = (data: Buffer) => {
      buffer += data.toString();
      
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (line.includes('textDocument/publishDiagnostics') && line.includes(uri)) {
          try {
            const message = JSON.parse(line);
            server.stdout!.off('data', handler);
            resolve(message.params.diagnostics);
            return;
          } catch (e) {
            // Continue looking
          }
        }
      }
    };
    
    server.stdout!.on('data', handler);
    
    // Timeout after 1 second - return empty diagnostics
    setTimeout(() => {
      server.stdout!.off('data', handler);
      resolve([]);
    }, 1000);
  });
}