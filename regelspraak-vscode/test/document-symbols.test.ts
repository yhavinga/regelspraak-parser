import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';

interface LSPMessage {
  jsonrpc: string;
  id?: number;
  method?: string;
  params?: any;
  result?: any;
}

interface DocumentSymbol {
  name: string;
  kind: number;
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  selectionRange: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  children?: DocumentSymbol[];
}

describe('Document Symbols', () => {
  let server: ChildProcess;
  let messageId = 1;

  beforeEach(() => {
    const serverPath = path.join(__dirname, '../dist/server.js');
    server = spawn('node', [serverPath, '--stdio']);
  });

  afterEach(() => {
    server.kill();
  });

  function sendMessage(msg: LSPMessage): void {
    const content = JSON.stringify(msg);
    const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
    server.stdin!.write(header + content);
  }

  function waitForResponse(id: number): Promise<LSPMessage> {
    return new Promise((resolve, reject) => {
      let buffer = '';
      const timeout = setTimeout(() => {
        server.stdout!.removeAllListeners();
        reject(new Error('Timeout waiting for response'));
      }, 5000);

      server.stdout!.on('data', (data) => {
        buffer += data.toString();
        
        // Try to parse complete messages
        const messages = buffer.split('\r\n\r\n');
        for (let i = 0; i < messages.length - 1; i++) {
          const message = messages[i];
          const contentMatch = message.match(/Content-Length: \\d+\\r?\\n/);
          if (contentMatch) {
            const contentStart = message.indexOf('\\n') + 1;
            const content = message.substring(contentStart);
            try {
              const json = JSON.parse(content);
              if (json.id === id) {
                clearTimeout(timeout);
                server.stdout!.removeAllListeners();
                resolve(json);
                return;
              }
            } catch (e) {
              // Continue parsing
            }
          }
        }
        buffer = messages[messages.length - 1];
      });
    });
  }

  test('should return symbols for parameters', async () => {
    // Initialize
    sendMessage({
      jsonrpc: '2.0',
      id: messageId++,
      method: 'initialize',
      params: { rootUri: null, capabilities: {} }
    });
    
    await waitForResponse(messageId - 1);

    // Send document
    sendMessage({
      jsonrpc: '2.0',
      method: 'textDocument/didOpen',
      params: {
        textDocument: {
          uri: 'file:///test.regelspraak',
          languageId: 'regelspraak',
          version: 1,
          text: `Parameter loon: Bedrag;
Parameter leeftijd: Numeriek (geheel getal);`
        }
      }
    });

    // Request symbols
    const symbolsId = messageId++;
    sendMessage({
      jsonrpc: '2.0',
      id: symbolsId,
      method: 'textDocument/documentSymbol',
      params: {
        textDocument: { uri: 'file:///test.regelspraak' }
      }
    });

    const response = await waitForResponse(symbolsId);
    const symbols = response.result as DocumentSymbol[];

    expect(symbols).toHaveLength(2);
    expect(symbols[0].name).toBe('loon');
    expect(symbols[0].kind).toBe(13); // Variable
    expect(symbols[0].range.start.line).toBe(0);
    expect(symbols[1].name).toBe('leeftijd');
    expect(symbols[1].range.start.line).toBe(1);
  });

  test('should return empty array for invalid document', async () => {
    // Initialize
    sendMessage({
      jsonrpc: '2.0',
      id: messageId++,
      method: 'initialize',
      params: { rootUri: null, capabilities: {} }
    });
    
    await waitForResponse(messageId - 1);

    // Send invalid document
    sendMessage({
      jsonrpc: '2.0',
      method: 'textDocument/didOpen',
      params: {
        textDocument: {
          uri: 'file:///invalid.regelspraak',
          languageId: 'regelspraak',
          version: 1,
          text: 'This is not valid RegelSpraak syntax'
        }
      }
    });

    // Request symbols
    const symbolsId = messageId++;
    sendMessage({
      jsonrpc: '2.0',
      id: symbolsId,
      method: 'textDocument/documentSymbol',
      params: {
        textDocument: { uri: 'file:///invalid.regelspraak' }
      }
    });

    const response = await waitForResponse(symbolsId);
    expect(response.result).toEqual([]);
  });
});