// Ultra-minimal LSP server for testing
import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
  DiagnosticSeverity
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

// Create connection 
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Log to stderr for debugging
function log(message: string) {
  console.error(`[LSP] ${message}`);
}

// Initialize
connection.onInitialize((params: InitializeParams): InitializeResult => {
  log('Initialize request received');
  return {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Full,
      diagnosticProvider: {
        interFileDependencies: false,
        workspaceDiagnostics: false
      }
    }
  };
});

// Document opened/changed
documents.onDidChangeContent(change => {
  log(`Document changed: ${change.document.uri}`);
  validateDocument(change.document);
});

documents.onDidOpen(event => {
  log(`Document opened: ${event.document.uri}`);
  validateDocument(event.document);
});

// Simple validation - just check for "invalid"
async function validateDocument(textDocument: TextDocument): Promise<void> {
  const text = textDocument.getText();
  const diagnostics = [];
  
  // Ultra simple: if text contains "invalid", report error
  if (text.includes('invalid')) {
    diagnostics.push({
      severity: DiagnosticSeverity.Error,
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 10 }
      },
      message: 'Text contains "invalid"',
      source: 'regelspraak-test'
    });
  }
  
  log(`Sending ${diagnostics.length} diagnostics`);
  connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// Start
documents.listen(connection);
connection.listen();
log('LSP server started');