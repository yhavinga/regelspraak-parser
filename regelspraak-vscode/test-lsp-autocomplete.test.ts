/**
 * Test LSP autocomplete functionality
 */

import { spawn, ChildProcess } from 'child_process';

interface LSPMessage {
  jsonrpc: string;
  id?: number;
  method?: string;
  params?: any;
  result?: any;
}

function createMessage(content: LSPMessage): string {
  const json = JSON.stringify(content);
  const contentLength = Buffer.byteLength(json, 'utf8');
  return `Content-Length: ${contentLength}\r\n\r\n${json}`;
}

class LSPClient {
  private server: ChildProcess;
  private responseBuffer = '';
  private expectedLength = 0;
  private responseHandlers = new Map<number, (response: LSPMessage) => void>();
  private nextId = 1;

  constructor() {
    this.server = spawn('node', ['dist/server.js', '--stdio'], {
      stdio: ['pipe', 'pipe', 'inherit']
    });

    this.server.stdout!.on('data', (data) => {
      this.handleData(data.toString());
    });
  }

  private handleData(data: string) {
    this.responseBuffer += data;
    
    while (true) {
      if (this.expectedLength === 0) {
        const match = this.responseBuffer.match(/Content-Length: (\d+)\r\n\r\n/);
        if (!match) break;
        
        this.expectedLength = parseInt(match[1]);
        this.responseBuffer = this.responseBuffer.substring(match.index! + match[0].length);
      }
      
      if (this.responseBuffer.length >= this.expectedLength) {
        const message = this.responseBuffer.substring(0, this.expectedLength);
        this.responseBuffer = this.responseBuffer.substring(this.expectedLength);
        this.expectedLength = 0;
        
        const response = JSON.parse(message) as LSPMessage;
        if (response.id && this.responseHandlers.has(response.id)) {
          this.responseHandlers.get(response.id)!(response);
          this.responseHandlers.delete(response.id);
        }
      } else {
        break;
      }
    }
  }

  async request(method: string, params: any): Promise<any> {
    return new Promise((resolve) => {
      const id = this.nextId++;
      this.responseHandlers.set(id, (response) => {
        resolve(response.result);
      });
      
      this.server.stdin!.write(createMessage({
        jsonrpc: '2.0',
        id,
        method,
        params
      }));
    });
  }

  notify(method: string, params: any) {
    this.server.stdin!.write(createMessage({
      jsonrpc: '2.0',
      method,
      params
    }));
  }

  close() {
    this.server.kill();
  }
}

async function runTests() {
  const client = new LSPClient();
  
  try {
    // Initialize
    await client.request('initialize', {
      rootUri: null,
      capabilities: {}
    });
    
    // Test 1: Type suggestions after parameter colon
    client.notify('textDocument/didOpen', {
      textDocument: {
        uri: 'file:///test1.regelspraak',
        languageId: 'regelspraak',
        version: 1,
        text: 'Parameter loon: '
      }
    });
    
    const result1 = await client.request('textDocument/completion', {
      textDocument: { uri: 'file:///test1.regelspraak' },
      position: { line: 0, character: 16 }
    });
    
    const labels1 = result1.map((item: any) => item.label);
    console.log('Test 1 - Parameter types received:', labels1);
    console.log('✅ Test 1 - Parameter types:', labels1.includes('Bedrag') && labels1.includes('Numeriek'));
    
    // Test 2: Keywords after "geldig"
    client.notify('textDocument/didOpen', {
      textDocument: {
        uri: 'file:///test2.regelspraak',
        languageId: 'regelspraak',
        version: 1,
        text: 'Regel Test\n  geldig '
      }
    });
    
    const result2 = await client.request('textDocument/completion', {
      textDocument: { uri: 'file:///test2.regelspraak' },
      position: { line: 1, character: 9 }
    });
    
    const labels2 = result2.map((item: any) => item.label);
    console.log('✅ Test 2 - Keywords after geldig:', labels2.includes('altijd') || labels2.includes('indien'));
    
    // Test 3: Domain values
    const docWithDomain = `Domein Status {
  'actief',
  'inactief'
}

Parameter klant_status: Status;

Regel Check
  geldig indien klant_status is gelijk aan `;
    
    client.notify('textDocument/didOpen', {
      textDocument: {
        uri: 'file:///test3.regelspraak',
        languageId: 'regelspraak',
        version: 1,
        text: docWithDomain
      }
    });
    
    const result3 = await client.request('textDocument/completion', {
      textDocument: { uri: 'file:///test3.regelspraak' },
      position: { line: 8, character: 42 }
    });
    
    const labels3 = result3.map((item: any) => item.label);
    console.log('✅ Test 3 - Domain values:', labels3.includes("'actief'") || labels3.includes("'inactief'"));
    
    console.log('\nAll tests completed!');
  } finally {
    client.close();
  }
}

runTests().catch(console.error);