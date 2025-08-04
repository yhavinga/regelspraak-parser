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

// Minimal import - just the parser
import { AntlrParser } from '../../typescript/parsers/antlr-parser';

// Create connection and documents manager
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Initialize handler
connection.onInitialize((params: InitializeParams): InitializeResult => {
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

// Listen for document changes
documents.onDidChangeContent(change => {
  validateDocument(change.document);
});

// Also validate on open
documents.onDidOpen(event => {
  validateDocument(event.document);
});

// Minimal validation - just parse errors
async function validateDocument(textDocument: TextDocument): Promise<void> {
  const text = textDocument.getText();
  const parser = new AntlrParser();
  
  try {
    // Just try to parse - we'll get exceptions on syntax errors
    parser.parseModel(text);
    
    // If we get here, no parse errors
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics: [] });
  } catch (e: any) {
    // Handle parse errors - extract line:column from ANTLR error
    const diagnostics = [];
    
    // Try to extract location from error message
    const match = e.message?.match(/line (\d+):(\d+)/);
    if (match) {
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { 
            line: parseInt(match[1]) - 1, 
            character: parseInt(match[2]) 
          },
          end: { 
            line: parseInt(match[1]) - 1, 
            character: parseInt(match[2]) + 10 
          }
        },
        message: e.message,
        source: 'regelspraak'
      });
    } else {
      // Fallback - put error at start of document
      diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 10 }
        },
        message: `Parse error: ${e.message || 'Unknown error'}`,
        source: 'regelspraak'
      });
    }
    
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
  }
}

// Wire everything up
documents.listen(connection);
connection.listen();