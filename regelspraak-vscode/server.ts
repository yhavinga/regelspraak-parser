import { createConnection, TextDocuments, DiagnosticSeverity, DocumentSymbol, SymbolKind, Range } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

// Import the parser directly from dist files
import { AntlrParser } from '@regelspraak/parser/parser';
import { SemanticAnalyzer } from '@regelspraak/parser/analyzer';

const connection = createConnection();
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: 1,
    diagnosticProvider: { interFileDependencies: false },
    documentSymbolProvider: true
  }
}));

documents.onDidChangeContent(async (change) => {
  const parser = new AntlrParser();
  const analyzer = new SemanticAnalyzer();
  
  try {
    const { model } = parser.parseWithLocations(change.document.getText());
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

// Handle document symbol requests
connection.onDocumentSymbol((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }
  
  try {
    // Parse the AST with location info
    const parser = new AntlrParser();
    const { model, locationMap } = parser.parseWithLocations(document.getText());
    const symbols: DocumentSymbol[] = [];
    
    // Helper to convert AST location to LSP range
    const nodeToRange = (node: any): Range => {
      const location = locationMap.get(node);
      if (!location) {
        return {
          start: { line: 0, character: 0 },
          end: { line: 0, character: 0 }
        };
      }
      return {
        start: { 
          line: location.startLine - 1,  // Convert to 0-based
          character: location.startColumn 
        },
        end: { 
          line: location.endLine - 1,
          character: location.endColumn
        }
      };
    };
    
    // Extract parameters
    for (const param of model.parameters) {
      symbols.push({
        name: param.name,
        kind: SymbolKind.Variable,
        range: nodeToRange(param),
        selectionRange: nodeToRange(param) // TODO: could be refined to just the name
      });
    }
      
    // Extract object types
    for (const objType of model.objectTypes) {
      symbols.push({
        name: objType.name,
        kind: SymbolKind.Class,
        range: nodeToRange(objType),
        selectionRange: nodeToRange(objType)
      });
    }
      
    // Extract domains
    for (const domain of model.domains || []) {
      symbols.push({
        name: domain.domain || 'unnamed',
        kind: SymbolKind.Enum,
        range: nodeToRange(domain),
        selectionRange: nodeToRange(domain)
      });
    }
    
    // Extract dimensions
    for (const dimension of model.dimensions) {
      symbols.push({
        name: dimension.name,
        kind: SymbolKind.TypeParameter,
        range: nodeToRange(dimension),
        selectionRange: nodeToRange(dimension)
      });
    }
    
    // Extract feit types
    for (const feitType of model.feitTypes || []) {
      symbols.push({
        name: feitType.naam || 'unnamed',
        kind: SymbolKind.Interface,
        range: nodeToRange(feitType),
        selectionRange: nodeToRange(feitType)
      });
    }
    
    // Extract dagsoort definitions
    for (const dagsoort of model.dagsoortDefinities || []) {
      symbols.push({
        name: dagsoort.dagsoortName || 'unnamed',
        kind: SymbolKind.Constant,
        range: nodeToRange(dagsoort),
        selectionRange: nodeToRange(dagsoort)
      });
    }
    
    // Extract rules
    for (const regel of model.regels) {
      symbols.push({
        name: regel.name,
        kind: SymbolKind.Function,
        range: nodeToRange(regel),
        selectionRange: nodeToRange(regel)
      });
    }
    
    // Extract rule groups
    for (const groep of model.regelGroepen) {
      const groupSymbol: DocumentSymbol = {
        name: groep.name,
        kind: SymbolKind.Namespace,
        range: nodeToRange(groep),
        selectionRange: nodeToRange(groep),
        children: []
      };
      
      // Add nested rules as children
      for (const regel of groep.rules || []) {
        groupSymbol.children?.push({
          name: regel.name,
          kind: SymbolKind.Function,
          range: nodeToRange(regel),
          selectionRange: nodeToRange(regel)
        });
      }
      
      symbols.push(groupSymbol);
    }
    
    // Extract decision tables
    for (const tabel of model.beslistabels) {
      symbols.push({
        name: tabel.name,
        kind: SymbolKind.Struct,
        range: nodeToRange(tabel),
        selectionRange: nodeToRange(tabel)
      });
    }
    
    // Extract unit systems
    for (const sys of model.unitSystems || []) {
      symbols.push({
        name: sys.name,
        kind: SymbolKind.Module,
        range: nodeToRange(sys),
        selectionRange: nodeToRange(sys)
      });
    }
    
    return symbols;
  } catch (e) {
    // Return empty array if parsing fails
    return [];
  }
});

documents.listen(connection);
connection.listen();