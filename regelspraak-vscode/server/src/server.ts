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

// Import the existing parser and analyzer
import { AntlrParser } from '../../typescript/parsers/antlr-parser';
import { SemanticAnalyzer } from '../../typescript/semantic-analyzer';

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

// Main validation function
async function validateDocument(textDocument: TextDocument): Promise<void> {
  const text = textDocument.getText();
  const parser = new AntlrParser();
  const analyzer = new SemanticAnalyzer();
  
  try {
    // Parse the model
    const model = parser.parseModel(text);
    
    // Run semantic analysis
    const errors = analyzer.analyze(model);
    
    // Convert validation errors to LSP diagnostics
    const diagnostics = errors.map(error => {
      // Extract line/column from location if available
      let line = 0;
      let character = 0;
      
      if (error.location) {
        // ANTLR locations are 1-based, LSP is 0-based
        line = (error.location.line || 1) - 1;
        character = error.location.column || 0;
      }
      
      return {
        severity: error.severity === 'warning' ? DiagnosticSeverity.Warning : DiagnosticSeverity.Error,
        range: {
          start: { line, character },
          end: { line, character: character + 10 }
        },
        message: error.message,
        source: 'regelspraak'
      };
    });
    
    // Send diagnostics
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
  } catch (e: any) {
    // Handle parse errors - extract line:column from ANTLR error
    const match = e.message?.match(/line (\d+):(\d+)/);
    if (match) {
      connection.sendDiagnostics({
        uri: textDocument.uri,
        diagnostics: [{
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
        }]
      });
    } else {
      // Generic error
      connection.sendDiagnostics({
        uri: textDocument.uri,
        diagnostics: [{
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 10 }
          },
          message: `Parse error: ${e.message || 'Unknown error'}`,
          source: 'regelspraak'
        }]
      });
    }
  }
}

// Wire everything up
documents.listen(connection);
connection.listen();