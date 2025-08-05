import { createConnection, TextDocuments, DiagnosticSeverity } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

// Import the parser directly from dist files
import { AntlrParser } from '@regelspraak/parser/parser';
import { SemanticAnalyzer } from '@regelspraak/parser/analyzer';

const connection = createConnection();
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: 1,
    diagnosticProvider: { interFileDependencies: false }
  }
}));

documents.onDidChangeContent(async (change) => {
  const parser = new AntlrParser();
  const analyzer = new SemanticAnalyzer();
  
  try {
    const model = parser.parseModel(change.document.getText());
    analyzer.analyze(model);
    
    // No errors - send empty diagnostics
    connection.sendDiagnostics({ 
      uri: change.document.uri, 
      diagnostics: [] 
    });
  } catch (e: any) {
    // Extract line:column from error message
    const match = e.message?.match(/line (\d+):(\d+)/);
    
    if (match) {
      connection.sendDiagnostics({
        uri: change.document.uri,
        diagnostics: [{
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: parseInt(match[1]) - 1, character: parseInt(match[2]) },
            end: { line: parseInt(match[1]) - 1, character: parseInt(match[2]) + 10 }
          },
          message: e.message,
          source: 'regelspraak'
        }]
      });
    } else {
      // Fallback for errors without line:column
      connection.sendDiagnostics({
        uri: change.document.uri,
        diagnostics: [{
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 10 }
          },
          message: e.message || 'Unknown error',
          source: 'regelspraak'
        }]
      });
    }
  }
});

documents.listen(connection);
connection.listen();