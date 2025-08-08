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
    documentSymbolProvider: true,
    hoverProvider: true,
    completionProvider: {
      resolveProvider: false,
      triggerCharacters: [' ', ':', '.', ',', '(', '<', '>', '=', '+', '-', '*', '/']
    }
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
  } catch (e: any) {
    // Log error for debugging
    console.error('Document symbols error:', e.message || e);
    // Return empty array if parsing fails
    return [];
  }
});

// Helper to find node at a given position
function findNodeAtPosition(node: any, position: { line: number; character: number }, locationMap: WeakMap<any, any>): any {
  const location = locationMap.get(node);
  if (!location) {
    // If no location for this node, try its children
    for (const key of Object.keys(node)) {
      const value = node[key];
      if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          for (const item of value) {
            const result = findNodeAtPosition(item, position, locationMap);
            if (result) return result;
          }
        } else {
          const result = findNodeAtPosition(value, position, locationMap);
          if (result) return result;
        }
      }
    }
    return null;
  }
  
  // Check if position is within this node's range (using 1-based lines from parser)
  const posLine = position.line + 1; // Convert to 1-based
  const posChar = position.character;
  
  if (posLine < location.startLine || posLine > location.endLine) {
    return null;
  }
  
  if (posLine === location.startLine && posChar < location.startColumn) {
    return null;
  }
  
  if (posLine === location.endLine && posChar > location.endColumn) {
    return null;
  }
  
  // Position is within this node - check children for more specific match
  let bestMatch = node;
  
  // Traverse all properties looking for child nodes
  for (const key of Object.keys(node)) {
    const value = node[key];
    
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        // Check each item in array
        for (const item of value) {
          const childMatch = findNodeAtPosition(item, position, locationMap);
          if (childMatch) {
            bestMatch = childMatch;
          }
        }
      } else {
        // Check single object
        const childMatch = findNodeAtPosition(value, position, locationMap);
        if (childMatch) {
          bestMatch = childMatch;
        }
      }
    }
  }
  
  return bestMatch;
}

// Handle hover requests
connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    console.error('Document not found:', params.textDocument.uri);
    return null;
  }
  
  try {
    const parser = new AntlrParser();
    const { model, locationMap } = parser.parseWithLocations(document.getText());
    
    // Find node at position
    const node = findNodeAtPosition(model, params.position, locationMap);
    if (!node) {
      return null;
    }
    
    // Build hover content based on node type
    let content = '';
    
    // Check node type and build appropriate hover
    if (node.type === 'ParameterDefinition' && node.name && node.dataType) {
      // Parameter node
      if (node.dataType.type === 'DomainReference') {
        content = `**Parameter** \`${node.name}\`: ${node.dataType.domain}`;
      } else if (node.dataType.type === 'DataType') {
        content = `**Parameter** \`${node.name}\`: ${node.dataType.typeName || 'Unknown'}`;
        if (node.dataType.unitName) {
          content += ` (${node.dataType.unitName})`;
        }
      } else {
        content = `**Parameter** \`${node.name}\``;
      }
    } else if (node.name && node.expression) {
      // Rule node
      content = `**Regel** \`${node.name}\``;
    } else if (node.name && node.attributes) {
      // Object type
      content = `**Objecttype** \`${node.name}\``;
    } else if (node.domain) {
      // Domain
      content = `**Domein** \`${node.domain}\``;
    } else if (node.naam) {
      // Feit type
      content = `**Feittype** \`${node.naam}\``;
    } else if (node.dagsoortName) {
      // Dagsoort
      content = `**Dagsoort** \`${node.dagsoortName}\``;
    } else if (node.name && node.columns) {
      // Decision table
      content = `**Beslistabel** \`${node.name}\``;
    } else if (node.name) {
      // Generic named node
      content = `**${node.constructor?.name || 'Item'}** \`${node.name}\``;
    }
    
    if (!content) {
      return null;
    }
    
    return {
      contents: {
        kind: 'markdown',
        value: content
      }
    };
  } catch (e) {
    // Return null on parse errors
    return null;
  }
});

// Handle completion requests
connection.onCompletion((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return [];
  }
  
  try {
    const parser = new AntlrParser();
    const text = document.getText();
    
    // Convert VSCode position to character offset
    const lines = text.split('\n');
    let offset = 0;
    for (let i = 0; i < params.position.line; i++) {
      offset += lines[i].length + 1; // +1 for newline
    }
    offset += params.position.character;
    
    // Get suggestions from the parser
    const suggestions = parser.getExpectedTokensAt(text, offset);
    
    // Convert to LSP CompletionItem format
    return suggestions.map((suggestion, index) => {
      // Clean up suggestions - capitalize type names properly
      const cleaned = cleanSuggestion(suggestion);
      return {
        label: cleaned,
        kind: getCompletionItemKind(cleaned),
        sortText: String(index).padStart(4, '0'), // Keep original order
        insertText: cleaned
      };
    });
  } catch (e) {
    console.error('Completion error:', e);
    return [];
  }
});

// Helper to clean up suggestions from parser
function cleanSuggestion(suggestion: string): string {
  // Map common raw token names to proper names
  const mappings: Record<string, string> = {
    'boolean': 'Boolean',
    'numeriek': 'Numeriek',
    'tekst': 'Tekst',
    'datum': 'Datum',
    'bedrag': 'Bedrag',
    'percentage': 'Percentage',
    'aantal': 'Aantal',
    'datum en tijd in millisecondes': 'Datum',
    'datum in dagen': 'Datum',
    'numeriek met exact': 'Numeriek',
    'identifier': '<naam>',
    'lijst': 'Lijst'
  };
  
  return mappings[suggestion.toLowerCase()] || suggestion;
}

// Helper to determine completion item kind
function getCompletionItemKind(suggestion: string): number {
  // Import CompletionItemKind enum values
  const CompletionItemKind = {
    Keyword: 14,
    Variable: 6,
    Value: 12,
    Property: 10
  };
  
  // Keywords
  if (/^(regel|parameter|domein|objecttype|feittype|indien|altijd|geldig|wordt|is|van|de|het|een)$/i.test(suggestion)) {
    return CompletionItemKind.Keyword;
  }
  
  // Types
  if (/^(bedrag|datum|tekst|numeriek|boolean|percentage|aantal)$/i.test(suggestion)) {
    return CompletionItemKind.Property;
  }
  
  // Domain values (quoted strings)
  if (suggestion.startsWith("'") && suggestion.endsWith("'")) {
    return CompletionItemKind.Value;
  }
  
  // Default to variable for parameters
  return CompletionItemKind.Variable;
}

documents.listen(connection);
connection.listen();