const { spawn } = require('child_process');
const path = require('path');

// Simple test to verify Code Actions are enabled
async function testCodeActionsEnabled() {
  const serverPath = path.join(__dirname, '..', 'dist', 'server.js');
  const child = spawn('node', [serverPath, '--stdio'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  // Initialize request
  const initRequest = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { rootUri: null, capabilities: {} }
  });
  
  const message = `Content-Length: ${Buffer.byteLength(initRequest)}\r\n\r\n${initRequest}`;
  
  return new Promise((resolve, reject) => {
    let buffer = '';
    
    child.stdout.on('data', (data) => {
      buffer += data.toString();
      
      // Try to find response
      const headerEnd = buffer.indexOf('\r\n\r\n');
      if (headerEnd !== -1) {
        const messageStart = headerEnd + 4;
        const jsonStart = buffer.indexOf('{', messageStart);
        if (jsonStart !== -1) {
          try {
            const response = JSON.parse(buffer.substring(jsonStart));
            if (response.id === 1 && response.result) {
              const capabilities = response.result.capabilities;
              console.log('Server capabilities:', JSON.stringify(capabilities, null, 2));
              
              // Check if codeActionProvider is enabled
              if (capabilities.codeActionProvider === true) {
                console.log('✅ Code Actions are enabled!');
                child.kill();
                resolve();
              } else {
                console.log('❌ Code Actions not enabled');
                child.kill();
                reject(new Error('Code Actions not enabled'));
              }
            }
          } catch (e) {
            // Continue waiting
          }
        }
      }
    });
    
    child.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });
    
    child.stdin.write(message);
    
    setTimeout(() => {
      child.kill();
      reject(new Error('Timeout'));
    }, 3000);
  });
}

testCodeActionsEnabled().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});