import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import * as path from 'path';
import { spawn } from 'child_process';

// Helper to send LSP message
function sendMessage(proc: any, message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const content = JSON.stringify(message);
    const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
    
    proc.stdin.write(header + content);
    
    // Collect response
    let buffer = '';
    const handler = (data: Buffer) => {
      buffer += data.toString();
      
      // Try to parse response
      const match = buffer.match(/Content-Length: (\d+)\r\n\r\n/);
      if (match) {
        const contentLength = parseInt(match[1]);
        const messageStart = match.index! + match[0].length;
        
        if (buffer.length >= messageStart + contentLength) {
          const content = buffer.substring(messageStart, messageStart + contentLength);
          try {
            const response = JSON.parse(content);
            proc.stdout.off('data', handler);
            resolve(response);
          } catch (e) {
            reject(e);
          }
        }
      }
    };
    
    proc.stdout.on('data', handler);
    
    // Timeout after 2 seconds
    setTimeout(() => {
      proc.stdout.off('data', handler);
      reject(new Error('Timeout waiting for response'));
    }, 2000);
  });
}

describe('Code Actions', () => {
  let serverProcess: any;
  let messageId = 1;
  
  beforeAll(async () => {
    // Start the server
    const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
    serverProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Initialize
    await sendMessage(serverProcess, {
      jsonrpc: '2.0',
      id: messageId++,
      method: 'initialize',
      params: {
        processId: process.pid,
        capabilities: {},
        rootUri: null
      }
    });
    
    await sendMessage(serverProcess, {
      jsonrpc: '2.0',
      method: 'initialized',
      params: {}
    });
  });
  
  afterAll(() => {
    if (serverProcess) {
      serverProcess.kill();
    }
  });
  
  describe('Mathematical operators', () => {
    it('should offer to replace minus sign with "min"', async () => {
      const uri = 'file:///test.regelspraak';
      
      // Open document with minus sign error
      await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        method: 'textDocument/didOpen',
        params: {
          textDocument: {
            uri,
            languageId: 'regelspraak',
            version: 1,
            text: 'Parameter salaris: Bedrag;\nRegel BerekenNetto\n  geldig altijd\n    Het netto wordt salaris - belasting.'
          }
        }
      });
      
      // Wait for diagnostics
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Request code actions
      const response = await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'textDocument/codeAction',
        params: {
          textDocument: { uri },
          range: {
            start: { line: 3, character: 28 },
            end: { line: 3, character: 29 }
          },
          context: {
            diagnostics: [{
              range: {
                start: { line: 3, character: 28 },
                end: { line: 3, character: 29 }
              },
              message: 'no viable alternative at input "-"',
              severity: 1
            }]
          }
        }
      });
      
      expect(response.result).toBeDefined();
      expect(response.result.length).toBeGreaterThan(0);
      
      const minusAction = response.result.find((a: any) => 
        a.title === 'Replace "-" with "min"'
      );
      expect(minusAction).toBeDefined();
      expect(minusAction.edit.changes[uri][0].newText).toBe(' min ');
    });
    
    it('should offer to replace division sign with "gedeeld door"', async () => {
      const uri = 'file:///test2.regelspraak';
      
      // Open document with division sign error
      await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        method: 'textDocument/didOpen',
        params: {
          textDocument: {
            uri,
            languageId: 'regelspraak',
            version: 1,
            text: 'Parameter totaal: Bedrag;\nParameter aantal: Aantal;\nRegel BerekenGemiddelde\n  geldig altijd\n    Het gemiddelde wordt totaal / aantal.'
          }
        }
      });
      
      // Wait for diagnostics
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Request code actions
      const response = await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'textDocument/codeAction',
        params: {
          textDocument: { uri },
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
      
      const divAction = response.result.find((a: any) => 
        a.title === 'Replace "/" with "gedeeld door"'
      );
      expect(divAction).toBeDefined();
      expect(divAction.edit.changes[uri][0].newText).toBe(' gedeeld door ');
    });
  });
  
  describe('Language keywords', () => {
    it('should offer to replace "if" with "indien"', async () => {
      const uri = 'file:///test3.regelspraak';
      
      // Open document with "if" instead of "indien"
      await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        method: 'textDocument/didOpen',
        params: {
          textDocument: {
            uri,
            languageId: 'regelspraak',
            version: 1,
            text: 'Parameter leeftijd: Aantal;\nRegel CheckVolwassen\n  geldig if leeftijd >= 18\n    Het resultaat wordt waar.'
          }
        }
      });
      
      // Wait for diagnostics
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Request code actions
      const response = await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'textDocument/codeAction',
        params: {
          textDocument: { uri },
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
      
      const ifAction = response.result.find((a: any) => 
        a.title === 'Replace "if" with "indien"'
      );
      expect(ifAction).toBeDefined();
      expect(ifAction.edit.changes[uri][0].newText).toBe('indien');
    });
    
    it('should offer to replace "Rule" with "Regel"', async () => {
      const uri = 'file:///test4.regelspraak';
      
      // Open document with "Rule" instead of "Regel"
      await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        method: 'textDocument/didOpen',
        params: {
          textDocument: {
            uri,
            languageId: 'regelspraak',
            version: 1,
            text: 'Parameter salaris: Bedrag;\nRule CalculateBonus\n  geldig altijd\n    Het resultaat wordt 100.'
          }
        }
      });
      
      // Wait for diagnostics
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Request code actions
      const response = await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'textDocument/codeAction',
        params: {
          textDocument: { uri },
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
              message: 'mismatched input "Rule"',
              severity: 1
            }]
          }
        }
      });
      
      const ruleAction = response.result.find((a: any) => 
        a.title === 'Replace "Rule" with "Regel"'
      );
      expect(ruleAction).toBeDefined();
      expect(ruleAction.edit.changes[uri][0].newText).toBe('Regel');
    });
  });
  
  describe('Spelling corrections', () => {
    it('should fix common Parameter misspellings', async () => {
      const uri = 'file:///test5.regelspraak';
      
      // Test "Paramater" misspelling
      await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        method: 'textDocument/didOpen',
        params: {
          textDocument: {
            uri,
            languageId: 'regelspraak',
            version: 1,
            text: 'Paramater salaris: Bedrag;'
          }
        }
      });
      
      // Wait for diagnostics
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Request code actions
      const response = await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'textDocument/codeAction',
        params: {
          textDocument: { uri },
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
              message: 'mismatched input "Paramater"',
              severity: 1
            }]
          }
        }
      });
      
      const spellingAction = response.result.find((a: any) => 
        a.title.includes('Fix spelling')
      );
      expect(spellingAction).toBeDefined();
      expect(spellingAction.edit.changes[uri][0].newText).toBe('Parameter');
    });
  });
  
  describe('Missing type colon', () => {
    it('should add missing colon in parameter declaration', async () => {
      const uri = 'file:///test6.regelspraak';
      
      // Parameter missing colon before type
      await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        method: 'textDocument/didOpen',
        params: {
          textDocument: {
            uri,
            languageId: 'regelspraak',
            version: 1,
            text: 'Parameter salaris;'
          }
        }
      });
      
      // Wait for diagnostics
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Request code actions
      const response = await sendMessage(serverProcess, {
        jsonrpc: '2.0',
        id: messageId++,
        method: 'textDocument/codeAction',
        params: {
          textDocument: { uri },
          range: {
            start: { line: 0, character: 17 },
            end: { line: 0, character: 18 }
          },
          context: {
            diagnostics: [{
              range: {
                start: { line: 0, character: 17 },
                end: { line: 0, character: 18 }
              },
              message: "mismatched input ';' expecting ':'",
              severity: 1
            }]
          }
        }
      });
      
      const colonAction = response.result.find((a: any) => 
        a.title === 'Add missing colon before type'
      );
      expect(colonAction).toBeDefined();
      expect(colonAction.edit.changes[uri][0].newText).toBe(': Bedrag');
    });
  });
});