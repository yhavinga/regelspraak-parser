// Helper to send properly formatted LSP messages
const message = JSON.parse(process.argv[2]);
const content = JSON.stringify(message);
const header = `Content-Length: ${Buffer.byteLength(content)}\r\n\r\n`;
process.stdout.write(header + content);